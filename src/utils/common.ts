export function removeEmptyProperties(obj: Record<string, any> | undefined) {
  const _obj = obj ? { ...obj } : obj
  if (_obj) {
    for (let key in _obj) {
      if (!_obj[key]) delete _obj[key]
    }
  }
  return _obj
}

export function delay(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}
