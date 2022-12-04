
export function hasOwnProperty<X extends Record<string, unknown>, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function file2Buffer(file: File): Promise<Buffer> {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    const readFile = function (event: any) {
      const buffer = reader.result
      resolve(buffer as Buffer)
    }
    reader.addEventListener('load', readFile)
    reader.readAsArrayBuffer(file)
  })
}
