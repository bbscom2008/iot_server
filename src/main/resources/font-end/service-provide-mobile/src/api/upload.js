import request from '@/utils/request'
import {uploadServiceUrl} from '@/utils/constants.js'
import {replaceBigNumbers} from '@/utils/index.js'
import { getToken, getTokenHead } from '@/utils/auth'

import {BaseUrl} from '@/utils/request.js'
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
export function uploadFileToServer2(file, onProgressCallback) {

  return new Promise((resolve, reject) => {
    const task = uni.uploadFile({
      url: `${BaseUrl}/master/system/file`, // 后端文件上传接口地址
      file: file,
      name: 'file', // 后端接收文件的字段名
      dataType: 'String',
      timeout: 600000,
      header:{
        Authorization: getTokenHead() + getToken()
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(replaceBigNumbers(res.data)))
        } else {
          reject('上传失败')
        }
      },
      fail: (err) => {
        console.error('文件上传失败:', err)
        reject('上传失败')
      }
    })

    if (onProgressCallback) {
      task.onProgressUpdate((res) => {
        onProgressCallback(res.progress)
      })
    }

  })
  
  
}


// 文件上传
export function uploadFileToServer(filePath, onProgressCallback) {

  return new Promise((resolve, reject) => {
    const task = uni.uploadFile({
      url: `${BaseUrl}/master/system/file`, // 后端文件上传接口地址
      filePath: filePath,
      name: 'file', // 后端接收文件的字段名
      dataType: 'String',
      timeout: 600000,
      header:{
        Authorization: getTokenHead() + getToken()
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(replaceBigNumbers(res.data)))
        } else {
          reject('上传失败')
        }
      },
      fail: (err) => {
        console.error('文件上传失败:', err)
        reject('上传失败')
      }
    })

    if (onProgressCallback) {
      task.onProgressUpdate((res) => {
        onProgressCallback(res.progress)
      })
    }

  })
  
  
}

// 处理解析上传生成二维码
export function handleUploadParseFileToServer(filePath) {
  
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${BaseUrl}/master/system/file/upload/file`, // 后端文件上传接口地址
      filePath: filePath,
      name: 'file', // 后端接收文件的字段名
      dataType: 'String',
      header:{
        Authorization: getTokenHead() + getToken()
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(replaceBigNumbers(res.data)))
        } else if (res.statusCode === 400){
          const result = JSON.parse(replaceBigNumbers(res.data))
          
          uni.showToast({
            title: result.message,
            icon: 'none',
            duration: 3000
          })
          
          reject('上传失败')
        }
      },
      fail: (err) => {
        console.error('文件上传失败:', err)
        reject('上传失败')
      }
    })
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
