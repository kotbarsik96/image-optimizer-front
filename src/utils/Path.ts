export class Path {
  static separator = '/'

  static join(...parts: string[]) {
    return parts
      .map((part) => {
        return part.replace(/^\/+|\/+$/g, '').trim()
      })
      .filter(Boolean)
      .join(this.separator)
  }

  static base(path: string) {
    const split = path.trim().split(this.separator)
    if (split.length < 2) return path

    let lastPart = split.at(split.length - 1)
    if (lastPart === '') lastPart = split.at(split.length - 2)

    return lastPart ?? ''
  }

  static dir(path: string) {
    const split = path.trim().split(this.separator)
    if (split.length < 2) return this.separator

    return path.slice(0, path.lastIndexOf(this.separator))
  }
}
