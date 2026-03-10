import request from '@/utils/request'

import {uploadFile} from './uploadUtils'
import store from '@/store'

// const tempBase = '/myserver'
// const tempBase = '/'
const tempBase = ''

// 根据文件表Id获取文件
export function getFileById(sysOssFileId, isLoading=false) {
  store.commit('app/setLoadingEnable', isLoading)
  return request({
    url: tempBase + `/master/system/file/${sysOssFileId}`,
    method: 'get'
  })
}


// 文件上传
export function uploadFileToServer(file, onProgress) {
  // const formData = new FormData()
  // formData.append('file', file)

  // return request({
  //   url: tempBase + `/master/system/file`,
  //   method: 'post',
  //   data: formData,
  //   timeout: 600000,
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // })

  return uploadFile(file, {
    url: `/master/system/file`,
    onProgress: (percent) => {
      if (onProgress) {
        onProgress(percent);
      }
    },
    onSuccess: (response) => {
      console.log("--success-", response);
    },
    onError: (error) => {
      console.log("onError", error);
    },
  });
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
export function handleUploadDataToQrCode(content, name='fileName.png') {
  // const formData = new FormData()
  // formData.append('content', content)
  // formData.append('fileName', name)
  return request({
    url: tempBase + `/master/system/file/upload/data`,
    method: 'post',
    data: {
      content,
      // fileName: name
    }
  })
}
