import request from "@/utils/request";
import store from '@/store'
import { uploadFile } from "./uploadUtils";

// const tempBase = '/myserver'
// const tempBase = '/'
const tempBase = "";


// 根据文件表Id获取文件
export function generateUploadPath(name) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/system/file/generate-upload-path`,
    method: "get",
    params: {
      ext: name || ''
    }
  }).finally(() => {
    store.commit('app/setLoadingEnable', true)
  })
}




// 根据文件表Id获取文件
export function getFileById(sysOssFileId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/system/file/${sysOssFileId}`,
    method: "get",
  }).finally(() => {
    store.commit('app/setLoadingEnable', true)
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
export function handleUploadParseFileToServer(file, name = "") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", name);

  return request({
    url: tempBase + `/master/system/file/upload/file`,
    method: "post",
    data: formData,
  });
}

// 处理文本-Base64生成二维码
export function handleUploadDataToQrCode(content, name = "") {
  return request({
    url: tempBase + `/master/system/file/upload/data`,
    method: "post",
    data: {
      content,
      // fileName: 'fllename'
    },
  });
}
