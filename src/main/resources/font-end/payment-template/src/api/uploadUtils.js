// utils/upload.js
import axios from "axios";

import JSONbig from "json-bigint";
import MessageBox from "@/utils/messageBox";
import Message from "@/utils/message";
import storage from "@/utils/storage";

const JSONbigString = JSONbig({ storeAsString: true });

// 创建上传专用的axios实例
const uploadInstance = axios.create({
  baseURL: "/wxapi",
  timeout: 3600000, // 1小时超时（大文件上传需要长时间）
  headers: {
    "Content-Type": "multipart/form-data",
  },
  transformResponse: [
    (data) => {
      try {
        // 自动将大数字转为 BigInt
        return JSONbigString.parse(data);
      } catch (e) {
        return data;
      }
    },
  ],
});

// 请求拦截器
uploadInstance.interceptors.request.use(
  (config) => {
    // 添加token等认证信息
    const token = storage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
uploadInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.code === "ECONNABORTED") {
      error.message = "请求超时，请检查网络连接或稍后重试";
    }
    return Promise.reject(error);
  }
);

export const uploadFile = (file, options = {}) => {
  const {
    url = "/api/upload",
    onProgress = null,
    onSuccess = null,
    onError = null,
    timeout = 3600000, // 单独设置本次上传的超时时间
    fieldName = "file", // 表单字段名
    additionalData = {}, // 附加数据
  } = options;

  const formData = new FormData();
  formData.append(fieldName, file);

  // 添加附加数据
  Object.keys(additionalData).forEach((key) => {
    formData.append(key, additionalData[key]);
  });

  const config = {
    timeout, // 本次请求的超时时间
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.lengthComputable) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted, progressEvent);
      }
    },
  };

  return uploadInstance
    .post(url, formData, config)
    .then((response) => {
      if (onSuccess) {
        onSuccess(response);
      }
      return response;
    })
    .catch((error) => {
      Message({
        message: error.message || "请求超时，请稍后重试！",
        type: "error",
        duration: 5 * 1000,
      });
      console.log('======111========', error.message);
      
      if (onError) {
        onError(error);
      }
      throw error;
    });
};

// 批量上传
export const uploadMultipleFiles = (files, options = {}) => {
  const uploadPromises = files.map((file, index) => {
    return uploadFile(file, {
      ...options,
      onProgress: (progress) => {
        if (options.onProgress) {
          options.onProgress(progress, index, files.length);
        }
      },
    });
  });

  return Promise.all(uploadPromises);
};

// 取消上传的方法
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export default uploadInstance;
