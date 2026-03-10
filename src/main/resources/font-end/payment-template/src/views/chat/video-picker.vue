<template>
  <div class="">
    <input
      type="file"
      style="display: none"
      id="fileInputvv"
      class="file-input"
      accept="video/*"
    />

    <div class="item" @click="handleClick">
      <svg-icon
        icon-class="video"
        class-name="video-icon"
        style="font-size: 34px"
      ></svg-icon>
      <span>视频</span>
    </div>
    <!-- </el-upload> -->
  </div>
</template>

<script>
import { base64ToBlob } from "@/utils/index";

import { generateUniqueId, parseTime, parseNow } from "@/utils/index";

import { MessageType, FromType } from "@/utils/chat";

export default {
  name: "VideoPicker",

  data() {
    return {
      wsService: null,
      FromType,
      MessageType,
      inputDom: null,

      //-------以下为压缩用的变量
      ffmpeg: null,
      compressMessage: "",
      isProcessing: false,
      progress: 0,
    };
  },

  mounted() {
    this.inputDom = document.getElementById("fileInputvv");
    this.inputDom.addEventListener("change", this.beforeAvatarUpload);
  },
  methods: {
    handleClick() {
      this.inputDom.click();
    },
    beforeAvatarUpload(e) {
      let file = "";
      if (e.target.files.length > 0) {
        file = e.target.files[0];
      }

      console.log("----beforeAvatarUpload---", file);
      console.log("----beforeAvatarUpload----file.name--", file.name);

      // const isLt2M = file.size / 1024 / 1024 < 4;

      // const isVideo = file.type === "video/mp4" || file.type === "video/avi";

      // if (!isVideo) {
      //   this.$message.error("上传视频只能是 mp4 avi 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 4MB!");
      // }

      // // 先显示 缩略图
      // if (isVideo && isLt2M) {
      //   this.sendImageMessage(file);
      // }

      // return isVideo && isLt2M;
      this.sendImageMessage(file);

      return true;
    },

    /**
     * 选择图片并发送
     * @param videoFile
     */
    async sendImageMessage(videoFile) {
      const messageItem = {
        time: parseNow(),
        id: generateUniqueId(),
        from: FromType.client,
        content: [],
      };
      console.log("===========111==========");

      const videoItem = {
        type: MessageType.video,
        videoFileId: "", // 视频文件fileID
        videoUrl: URL.createObjectURL(videoFile), // 视频地址 本地  或  远程  二选一
        videoFileObj: videoFile, // 视频文件

        thumbFileId: "", // 缩备图 文件ID
        thumbImgSrc: "", // 缩备图 图片src  base64 格式  或者 是 远程  url
        thumbFile: "", // 缩备图 图片文件对象
        id: generateUniqueId(),
        isLocal: true,
      };

      console.log("===========222==========");

      messageItem.content.push(videoItem);

      videoItem.parent = messageItem;

      // 如果 是 MOV 或者 avi 直接上传，不生成缩略图
      if (
        videoFile.name.includes(".MOV") ||
        videoFile.name.includes(".mov") ||
        videoFile.name.includes(".AVI") ||
        videoFile.name.includes(".avi")
      ) {
        this.$emit("select-video", messageItem);
        return;
      }

      try {
        // 生成缩略图
        console.log("===========333==========");

        let thumbnail = await this.generateThumbnailWithCanvas(videoFile);

        videoItem.thumbImgSrc = thumbnail;
        // base64 转文件，并上传
        console.log("===========444==========");

        let thumbImageFile = base64ToBlob(thumbnail);
        videoItem.thumbFile = thumbImageFile;
        console.log("----thumbImageFile--", thumbImageFile);
      } catch (err) {
        console.log("===========555==========");

        console.log("生成缩略图失败: ", err);
        videoItem.thumbImgSrc = null;
        videoItem.thumbFile = "";
      }

      // 显示在页面
      this.$emit("select-video", messageItem);

      // this.sendVideoToServer(messageItem);
    },

    // 使用Canvas生成缩略图
    generateThumbnailWithCanvas(videoFile) {
      return new Promise((resolve, reject) => {
        // 创建video元素
        try {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(videoFile);
          video.crossOrigin = "anonymous";
          video.muted = true;
          video.currentTime = 1; // 跳到第1秒获取帧

          video.addEventListener("loadeddata", () => {
            // 创建canvas元素
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // 设置canvas尺寸
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // 绘制视频帧到canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 获取base64图片数据
            const thumbnail = canvas.toDataURL("image/jpeg");
            resolve(thumbnail);
          });

          video.addEventListener("error", () => {
            // 出错时使用默认缩略图
            console.log("生成缩略图失败");
            reject(new Error("生成缩略图失败"));
            // this.addVideoMessage(videoPath, 'https://via.placeholder.com/200x150?text=预览图', 10);
          });
        } catch (err) {
          reject(err);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
i {
  font-style: normal;
}

.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 160rem;
  margin: 0 auto;

  .title {
    font-size: 3.7333rem;
    padding: 2.6667rem;
    text-align: center;
    // background-color: #07c160;
  }
}

.picker-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  height: 40rem;
  background-color: #eee;
  padding: 4rem;
  border-top: 0.2667rem solid #ccc;

  .item {
    display: flex;
    flex-direction: column;
    width: 80px;
    gap: 8px;
    height: 80px;
    align-items: center;
    justify-content: center;
    // padding: 12px;
    // background-color: #ccc;
    font-size: 14px;
    font-weight: 600;
  }
}
.video-icon {
  font-size: 45px;
  width: 9rem;
  height: 9rem;
}
</style>
