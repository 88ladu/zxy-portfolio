const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const simplifier = require('meshoptimizer/meshopt_simplifier.js')

const COMPONENT_BYTES = { 5126: 4, 5125: 4, 5123: 2 }
const TYPE_SIZE = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }
const TARGET_ARRAY_BUFFER = 34962
const TARGET_ELEMENT_ARRAY_BUFFER = 34963
const MISSING = 2 ** 32 - 1

function align4(n) {
  return (n + 3) & ~3
}

function padBuffer(buffer, fill = 0) {
  const padded = Buffer.alloc(align4(buffer.length), fill)
  buffer.copy(padded)
  return padded
}

function readGlb(file) {
  const buffer = fs.readFileSync(file)
  if (buffer.toString('utf8', 0, 4) !== 'glTF') throw new Error(`${file} is not GLB`)
  let offset = 12
  let json = null
  let bin = null
  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset)
    const chunkType = buffer.readUInt32LE(offset + 4)
    const start = offset + 8
    const chunk = buffer.subarray(start, start + chunkLength)
    if (chunkType === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8').replace(/\0+$/g, '').trim())
    if (chunkType === 0x004e4942) bin = chunk
    offset = start + chunkLength
  }
  if (!json || !bin) throw new Error(`${file} missing GLB chunks`)
  return { json, bin }
}

function accessorArray(json, bin, accessorIndex) {
  const accessor = json.accessors[accessorIndex]
  const view = json.bufferViews[accessor.bufferView]
  const componentBytes = COMPONENT_BYTES[accessor.componentType]
  const itemSize = TYPE_SIZE[accessor.type]
  const byteOffset = (view.byteOffset || 0) + (accessor.byteOffset || 0)
  const length = accessor.count * itemSize
  if (accessor.componentType === 5126) {
    return new Float32Array(bin.buffer, bin.byteOffset + byteOffset, length).slice()
  }
  if (accessor.componentType === 5125) {
    return new Uint32Array(bin.buffer, bin.byteOffset + byteOffset, length).slice()
  }
  if (accessor.componentType === 5123) {
    return new Uint16Array(bin.buffer, bin.byteOffset + byteOffset, length).slice()
  }
  throw new Error(`Unsupported accessor componentType ${accessor.componentType} (${componentBytes})`)
}

function bounds(positions) {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < positions.length; i += 3) {
    min[0] = Math.min(min[0], positions[i])
    min[1] = Math.min(min[1], positions[i + 1])
    min[2] = Math.min(min[2], positions[i + 2])
    max[0] = Math.max(max[0], positions[i])
    max[1] = Math.max(max[1], positions[i + 1])
    max[2] = Math.max(max[2], positions[i + 2])
  }
  return { min, max }
}

function compactAttribute(source, itemSize, remap, unique) {
  const out = new Float32Array(unique * itemSize)
  for (let oldIndex = 0; oldIndex < remap.length; oldIndex++) {
    const nextIndex = remap[oldIndex]
    if (nextIndex === MISSING) continue
    for (let c = 0; c < itemSize; c++) out[nextIndex * itemSize + c] = source[oldIndex * itemSize + c]
  }
  return out
}

function imageBuffer(json, bin, image) {
  const view = json.bufferViews[image.bufferView]
  return Buffer.from(bin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength))
}

function resizeImage(buffer, mimeType, maxSize, index, stem) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `glb-${stem}-${index}-`))
  const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png'
  const input = path.join(tmp, `input.${ext}`)
  const output = path.join(tmp, `output.${ext}`)
  fs.writeFileSync(input, buffer)
  try {
    execFileSync('/usr/bin/sips', ['-s', 'format', ext === 'jpg' ? 'jpeg' : 'png', '-Z', String(maxSize), input, '--out', output], {
      stdio: 'ignore',
    })
    const resized = fs.readFileSync(output)
    return resized.length < buffer.length ? resized : buffer
  } catch {
    return buffer
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}

function append(chunks, buffer, byteOffsetRef, target) {
  const padded = padBuffer(buffer)
  const view = { buffer: 0, byteOffset: byteOffsetRef.value, byteLength: buffer.length }
  if (target) view.target = target
  chunks.push(padded)
  byteOffsetRef.value += padded.length
  return view
}

async function optimize(input, output, options) {
  await simplifier.ready
  const stem = path.basename(input, '.glb')
  const { json, bin } = readGlb(input)
  const primitive = json.meshes[0].primitives[0]
  const positions = accessorArray(json, bin, primitive.attributes.POSITION)
  const normals = accessorArray(json, bin, primitive.attributes.NORMAL)
  const uvs = accessorArray(json, bin, primitive.attributes.TEXCOORD_0)
  const originalIndices = accessorArray(json, bin, primitive.indices)
  const sourceIndices = originalIndices instanceof Uint32Array ? originalIndices : Uint32Array.from(originalIndices)
  const target = Math.max(3000, Math.floor((sourceIndices.length * options.ratio) / 3) * 3)
  const [simplifiedRaw, error] = simplifier.simplify(sourceIndices, positions, 3, target, options.error, ['LockBorder'])
  let simplified = simplifiedRaw instanceof Uint32Array ? simplifiedRaw : Uint32Array.from(simplifiedRaw)
  const [remap, unique] = simplifier.compactMesh(simplified)
  const compactPositions = compactAttribute(positions, 3, remap, unique)
  const compactNormals = compactAttribute(normals, 3, remap, unique)
  const compactUvs = compactAttribute(uvs, 2, remap, unique)
  const indices = unique <= 65535 ? Uint16Array.from(simplified) : Uint32Array.from(simplified)
  const indexComponentType = unique <= 65535 ? 5123 : 5125

  const chunks = []
  const offset = { value: 0 }
  const bufferViews = []
  const accessors = []

  const posView = append(chunks, Buffer.from(compactPositions.buffer), offset, TARGET_ARRAY_BUFFER)
  bufferViews.push(posView)
  const posBounds = bounds(compactPositions)
  accessors.push({ bufferView: 0, componentType: 5126, count: unique, type: 'VEC3', min: posBounds.min, max: posBounds.max })

  const normalView = append(chunks, Buffer.from(compactNormals.buffer), offset, TARGET_ARRAY_BUFFER)
  bufferViews.push(normalView)
  accessors.push({ bufferView: 1, componentType: 5126, count: unique, type: 'VEC3' })

  const uvView = append(chunks, Buffer.from(compactUvs.buffer), offset, TARGET_ARRAY_BUFFER)
  bufferViews.push(uvView)
  accessors.push({ bufferView: 2, componentType: 5126, count: unique, type: 'VEC2' })

  const indexView = append(chunks, Buffer.from(indices.buffer), offset, TARGET_ELEMENT_ARRAY_BUFFER)
  bufferViews.push(indexView)
  accessors.push({ bufferView: 3, componentType: indexComponentType, count: indices.length, type: 'SCALAR' })

  const nextImages = (json.images || []).map((image, index) => {
    const source = imageBuffer(json, bin, image)
    const resized = resizeImage(source, image.mimeType || 'image/png', options.textureSize, index, stem)
    const view = append(chunks, resized, offset)
    const bufferView = bufferViews.push(view) - 1
    return { ...image, bufferView }
  })

  const next = JSON.parse(JSON.stringify(json))
  next.buffers = [{ byteLength: offset.value }]
  next.bufferViews = bufferViews
  next.accessors = accessors
  next.images = nextImages
  next.meshes[0].primitives[0].attributes = { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 }
  next.meshes[0].primitives[0].indices = 3
  delete next.meshes[0].primitives[0].extensions

  const jsonChunk = padBuffer(Buffer.from(JSON.stringify(next)), 0x20)
  const binChunk = Buffer.concat(chunks)
  const total = 12 + 8 + jsonChunk.length + 8 + binChunk.length
  const out = Buffer.alloc(total)
  out.write('glTF', 0)
  out.writeUInt32LE(2, 4)
  out.writeUInt32LE(total, 8)
  out.writeUInt32LE(jsonChunk.length, 12)
  out.writeUInt32LE(0x4e4f534a, 16)
  jsonChunk.copy(out, 20)
  const binHeader = 20 + jsonChunk.length
  out.writeUInt32LE(binChunk.length, binHeader)
  out.writeUInt32LE(0x004e4942, binHeader + 4)
  binChunk.copy(out, binHeader + 8)
  fs.writeFileSync(output, out)
  console.log(`${stem}: ${Math.round(sourceIndices.length / 3).toLocaleString()} tris -> ${Math.round(indices.length / 3).toLocaleString()} tris, ${positions.length / 3} verts -> ${unique} verts, error=${error.toFixed(5)}, ${(fs.statSync(input).size / 1048576).toFixed(1)}MB -> ${(out.length / 1048576).toFixed(1)}MB`)
}

const jobs = [
  ['coffee-cup', 0.08, 0.035, 1024],
  ['rug-model', 0.06, 0.035, 1024],
  ['new-easel', 0.08, 0.03, 1024],
  ['new-cabinet', 0.08, 0.03, 1024],
  ['decor-art', 0.08, 0.03, 1024],
]

;(async () => {
  for (const [name, ratio, error, textureSize] of jobs) {
    await optimize(`public/models/${name}.glb`, `public/models/${name}.optimized.glb`, { ratio, error, textureSize })
  }
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
