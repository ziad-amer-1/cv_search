import axios from "axios"

export async function login(data) {
  const response = await axios.post("/api/v1/users/login", data)
  return response
}

export async function getPdfFiles() {
  const response = await axios.get("/api/v1/files")
  return response
}

export async function previewPdf(filename) {
  const blob = await axios.get(
    `/api/v1/files/preview_pdf?filename=${filename}`,
    { responseType: "blob" }
  )
  const url = URL.createObjectURL(blob.data)
  window.open(url, "_blank")
}

export async function search(keyword) {
  const response = await axios.get(`/api/v1/files/search?keyword=${keyword}`)
  return response
}

export async function uploadFiles(files) {
  const response = axios.post('/api/v1/files', files)
  return response
}
