// 导出base64格式的文件
export function fileExport(fileUrl, fileName) {
  const byteCharacters = atob(fileUrl)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'application/octet-stream;charset=utf-8;' })

  // 创建一个URL对象来引用Blob对象的URL
  const url = URL.createObjectURL(blob)

  // 创建一个链接元素并设置属性
  const a = document.createElement('a')
  a.href = url
  a.download = fileName

  // 模拟点击链接来触发下载
  a.click()

  // 释放URL对象
  URL.revokeObjectURL(url)
}

// 导出文件流
export function fileExportBlob(blob) {
  const downloadUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = downloadUrl
  document.body.appendChild(a)
  // 触发下载
  a.click()
  // 清理资源
  window.URL.revokeObjectURL(downloadUrl)
  document.body.removeChild(a)
}
