const endMessageText = 'x'.repeat(74)

export async function encode(dataUrl: string, message: string): Promise<string> {
  const image = await loadImage(dataUrl)
  const { canvas, ctx } = drawOnCanvas(image)

  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const originalRGBValuesInBinary = [...pixelData.data]
    .filter(isRGBChannel)
    .map((n) => n.toString(2).padStart(7, '0'))

  const fullMessage = sanitizeMessage(message) + endMessageText
  const newRGBValues = writeOnImageData(fullMessage, originalRGBValuesInBinary).map((strNumber) =>
    parseInt(strNumber, 2),
  )

  const newPixelBytes = pixelData.data.slice()
  let rgbIndex = 0
  for (let i = 0; i < newPixelBytes.length; i++) {
    if (!isRGBChannel(0, i)) continue // leave alpha untouched: flipping it can round the RGB bytes on readback
    newPixelBytes[i] = newRGBValues[rgbIndex]
    rgbIndex++
  }

  ctx.putImageData(new ImageData(newPixelBytes, canvas.width, canvas.height), 0, 0)

  return canvas.toDataURL()
}

export async function decode(dataUrl: string): Promise<string> {
  const image = await loadImage(dataUrl)
  const { canvas, ctx } = drawOnCanvas(image)

  const bits = [...ctx.getImageData(0, 0, canvas.width, canvas.height).data]
    .filter(isRGBChannel)
    .map(extractLastBit)

  return extractMessage(bits)
}

function isRGBChannel(_: unknown, index: number) {
  return index % 4 !== 3
}

function extractLastBit(n: number) {
  const binaryNumber = n.toString(2)
  return binaryNumber.substring(binaryNumber.length - 1)
}

function extractMessage(bits: string[]) {
  const bytesOfString = chunkArray(bits, 7)
    .map((item) => item.join(''))
    // Transform the bytes from binary to integer
    .map((binStr) => parseInt(binStr, 2))
    // Transform numbers into characters
    .map((int) => String.fromCharCode(int))
    .join('')

  const messageEnd = bytesOfString.indexOf(endMessageText)
  return bytesOfString.substring(0, messageEnd).trim()
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })
}

function drawOnCanvas(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.drawImage(image, 0, 0)

  return { canvas, ctx }
}

function sanitizeMessage(text: string) {
  return text.replace(/[^ -~]/g, '') // remove non ascii characters
}

function writeOnImageData(text: string, imageBytesData: string[], initialIndex: number = 0) {
  const textToBinaryCharCode = text
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(7, '0'))

  const imageBytesDataClone = [...imageBytesData]

  let lastIndex = initialIndex

  textToBinaryCharCode.forEach((binStr) => {
    binStr.split('').forEach((bit) => {
      let imgByte = imageBytesDataClone[lastIndex]
      if (!imgByte) {
        throw new Error('A imgem é pequena demais pro dado')
      }
      // Swap the last bit with the new one
      imgByte = imgByte.substring(0, imgByte.length - 1) + bit
      imageBytesDataClone[lastIndex] = imgByte
      //
      lastIndex++
    })
  })
  return imageBytesDataClone
}

/**
 * @example chunkArray([1,2,3,4,5,6], 2) => [[1,2],[3,4],[5,6]]
 */
function chunkArray<T>(array: T[], size: number) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
