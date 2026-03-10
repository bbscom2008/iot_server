import request from '@/utils/request'

// const tempBase = '/myserver'
// const tempBase = '/'
const tempBase = ''

// 根据文件表Id获取文件
export function getFileById(sysOssFileId) {
  return request({
    url: tempBase + `/master/system/file/${sysOssFileId}`,
    method: 'get'
  })
}

// 文件上传
export function uploadFileToServer(file, name='') {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: tempBase + `/master/system/file`,
    method: 'post',
    data: formData
  })
}

// 处理解析上传生成二维码
export function handleUploadParseFileToServer(file, name = '') {
  const formData = new FormData()
  formData.append('file', file)
  // formData.append('fileName', name)

  return request({
    url: tempBase + `/master/system/file/upload/file`,
    method: 'post',
    data: formData
  })
}

// 处理文本-Base64生成二维码
export function handleUploadDataToQrCode(content) {
  // const formData = new FormData()
  // formData.append('content', content)
  // formData.append('fileName', name)
  return request({
    url: tempBase + `/master/system/file/upload/data`,
    method: 'post',
    data: {
      content
    }
  })
}
