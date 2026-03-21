export enum EContentType {
  ApplicationJson = 'application/json',
  MultipartFormData = 'multipart/form-data',
}

export const methodToContentType = {
  GET: EContentType.ApplicationJson,
  DELETE: EContentType.ApplicationJson,
  PUT: EContentType.MultipartFormData,
  POST: EContentType.MultipartFormData,
}
