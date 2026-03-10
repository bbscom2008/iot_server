export function parseCiphertext() {
  const pathname = window.location.pathname;
  const pathSegments = pathname.split("/");
  const ciphertext = pathSegments[pathSegments.length - 1];
  return ciphertext;
}


/**
 * Created by PanJiaChen on 16/11/18.
 */

export function randomHeadIcon() {
  let headIcon = localStorage.getItem("headIcon");
  if (headIcon == null) {
    headIcon = Math.floor(Math.random() * 11);
    localStorage.setItem("headIcon", headIcon);
  }
  return headIcon;
}

export function parseNow() {
  return parseTime(new Date());
}

/**
 * base64 转 blob
 * @param {*} base64
 * @returns
 */
export function base64ToBlob(base64) {
  // 分割 base64 字符串获取内容类型和纯数据部分
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  // 转换为 Uint8Array
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // 创建 File 对象
  return new File(
    [u8arr],
    "img_" + generateUniqueId() + "." + mime.split("/")[1],
    { type: mime }
  );
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * 格式化时间为 小时:分钟
 * @param {Date} date - 日期对象
 * @returns {string} 格式化的时间字符串
 */
export function formatTime(date) {
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  // console.log(date.getUTCHours());
  // console.log('=========formatTime', `${hours}:${minutes}`);
  return `${hours}:${minutes}`;
}

// /**
//  * @param {number} time
//  * @param {string} option
//  * @returns {string}
//  */
// export function formatTime(time, option) {
//   if (("" + time).length === 10) {
//     time = parseInt(time) * 1000;
//   } else {
//     time = +time;
//   }
//   const d = new Date(time);
//   const now = Date.now();

//   const diff = (now - d) / 1000;

//   if (diff < 30) {
//     return "刚刚";
//   } else if (diff < 3600) {
//     // less 1 hour
//     return Math.ceil(diff / 60) + "分钟前";
//   } else if (diff < 3600 * 24) {
//     return Math.ceil(diff / 3600) + "小时前";
//   } else if (diff < 3600 * 24 * 2) {
//     return "1天前";
//   }
//   if (option) {
//     return parseTime(time, option);
//   } else {
//     return (
//       d.getMonth() +
//       1 +
//       "月" +
//       d.getDate() +
//       "日" +
//       d.getHours() +
//       "时" +
//       d.getMinutes() +
//       "分"
//     );
//   }
// }

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * 生成自用的 唯一 ID
 * @returns
 */
export function generateUniqueId() {
  // 1. 获取当前时间戳（毫秒）并转换为36进制字符串，更短
  const timestamp = Date.now().toString(36);

  // 2. 生成一个随机数并转换为36进制字符串，并截取掉前面的 '0.'
  const randomStr = Math.random().toString(36).substring(2);

  // 3. 拼接两者，得到一个几乎不可能重复的ID
  return `${timestamp}-${randomStr}`;
}


/**
 * 格式化日期为 几月几日
 * @param {Date} date - 日期对象
 * @returns {string} 格式化的日期字符串
 */
export function formatDate(date) {
  const month = date.getMonth() + 1; // 月份从0开始，需要+1
  const day = date.getDate();
  return `${month}月${day}日`;
}

export function isMobile() {
  const ua = navigator.userAgent.toLowerCase();
  return /mobile/i.test(ua);
}