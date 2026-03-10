<template>
  <div
    class="container"
    v-loading="$store.state.app.loading"
    style="min-height: 100vh"
  >
    <!-- <button @click="testBtn">test-btn</button> -->
    <!-- <div class="file-upload">
      <input ref="fileInput" type="file" @change="handleFileChange" />

      <div v-if="selectedFile" class="file-info">
        <p>文件名：{{ selectedFile.name }}</p>
        <p>大小：{{ formatFileSize(selectedFile.size) }}</p>
        <p>类型：{{ selectedFile.type || "未知" }}</p>
        <img v-if="previewUrl" :src="previewUrl" class="preview-image" />
        <button @click="uploadFile" :disabled="uploading">
          {{ uploading ? "上传中..." : "开始上传" }}
        </button>
      </div>
    </div> -->

    <!-- ------test------ -->
    <div v-if="show_template">
      <!-- 动态组件，根据 templateTheme 自动渲染对应的组件 -->
      <component
        :is="currentTemplateComponent"
        :responseData="responseData"
      ></component>
    </div>

    <!-- 等待刷新数据的loading组件 -->
    <div v-if="showRefreshLoading" class="refresh-loading-container">
      <div class="refresh-loading-content">
        <i class="el-icon-loading refresh-loading-icon"></i>
        <div class="refresh-loading-text">正在加载中...</div>
      </div>
    </div>

    <div v-loading.fullscreen.lock="$store.state.app.loading"></div>

    <el-dialog
      @close="tutorialDialogClose()"
      :visible.sync="tutorial_visiual"
      class="look-dialog"
      title="温馨提示"
      :show-close="false"
      :close-on-click-modal="false"
      width="80.00rem"
    >
      <div class="swiper-container">
        <swiper ref="swiper" :options="swiperOptions">
          <swiper-slide
            v-loading="!item.url"
            v-for="(item, index) in baseInfo.tutorialFilesUrl"
            :key="index"
          >
            <el-image :src="item.url" fit="contain" style="width: 100%">
            </el-image>
          </swiper-slide>
          <!-- 导航按钮、分页器等组件 -->
          <div class="swiper-pagination" slot="pagination"></div>
          <!--  <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div> -->
        </swiper>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="tutorialDialogClose()" size="small">
          {{ baseInfo.tutorialButtonName || "关闭" }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="submit_visiual"
      title="请严格按照要求输入"
      class="submit-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="80.00rem"
    >
      <el-form
        ref="submitDialogRef"
        :model="submitForm"
        label-position="top"
        @submit.native.prevent
      >
        <!-- {
              required: true,
              message: '请输入' + baseInfo.submitTitle,
              trigger: 'blur',
            }, -->
        <el-form-item
          :label="baseInfo.submitTitle"
          :rules="[
            {
              validator: (rule, value, callback) => {
                // 0 不校验  1 数值  2 中文  3 字母  4 邮箱
                checkSubmitDialogValue(baseInfo, rule, value, callback);
              },
            },
          ]"
          prop="submitValue"
        >
          <el-input
            v-model="submitForm.submitValue"
            @keyup.stop.enter.native="onSubmitBtnOk()"
            :placeholder="'请输入' + baseInfo.submitTitle"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: center">
        <el-button
          class="btn"
          @click="onSubmitBtnOk()"
          type="primary"
          style="padding: 10px 40px"
          size="small"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="show_error_page"
      title="温馨提示"
      class="error-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="80.00rem"
    >
      <div class="msg">
        <div
          style="
            font-size: 16px;
            font-weight: 500;
            color: red;
            text-align: center;
            line-height: 8rem;
          "
        >
          {{ error_msg }}
        </div>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button class="btn" @click="show_error_page = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showTimeoutDialogVisiual"
      title="温馨提示"
      class="error-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      width="80.00rem"
    >
      <div class="msg">
        <div
          style="
            font-size: 16px;
            font-weight: 500;
            color: red;
            text-align: center;
            line-height: 8rem;
          "
        >
          {{ error_message_2 }}
        </div>
      </div>
      <!-- <div slot="footer" style="text-align: center">
        <el-button class="btn" @click="closeWindow()">
          关闭
        </el-button>
      </div> -->
    </el-dialog>

    <!-- <ErrorPage v-if="show_error_page"  ></ErrorPage> -->
  </div>
</template>

<script>
import { isMobile } from "@/utils/index.js";
import { safeOpen } from "@/utils/navigator";

// 引入 SDK
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import {
  getTemplateInfo,
  addOrderOperationLog,
  getPayCashInfo,
  getBasePayCashInfo,
  submitPopupInfo,
} from "@/api/template-create.js";

import {
  getFileById,
  uploadFileToServer,
  generateUploadPath,
} from "@/api/upload";

import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";

export default {
  name: "TemplatePreview",
  components: {
    // 使用异步组件实现按需加载（懒加载）
    // 只有在需要显示某个模板时，才会加载对应的组件代码
    TemplateDefault: () => import("./components/template-default.vue"),
    TemplateTaoBaofu: () => import("./components/template-taobaofu.vue"),
    TemplateZhiFuBao: () => import("./components/template-zhifubao.vue"),
    TemplateZhiFuBaoWukuang: () =>
      import("./components/template-zhifubao-wukuang.vue"),
    TemplateWeiXin: () => import("./components/template-weixin.vue"),
    TemplateWeiXinWukuang: () =>
      import("./components/template-weixin-wukuang.vue"),
    TemplateWeiXinWukuangXY: () =>
      import("./components/template-weixin-wukuang-xy.vue"),
    TemplateQQ: () => import("./components/template-qq.vue"),
    TemplateDigitalPay1: () => import("./components/template-digital-pay1.vue"),
    // TemplateDigitalPay2: () => import("./components/template-digital-pay2.vue"),
    TemplateBao: () => import("./components/template-default-hongxing.vue"),
    TemplateUSDT: () => import("./components/template-usdt.vue"),
    TemplateUSDT_RMB: () => import("./components/template-usdt-rmb.vue"),
    TemplateLongXing: () => import("./components/template-longxing.vue"),
    DouyinHongbao: () => import("./components/template-douyin-hongbao.vue"),
    TemplateHongmeng: () => import("./components/template-hongmeng.vue"),
    TemplateChatRoom: () => import("./components/template-chatroom.vue"),
    TemplateLiangDian: () =>
      import("./components/template-default-liangdian.vue"),
    TemplateJuHe: () => import("./components/template-juhe.vue"),
    TemplateZhiFuBaoCopyPay: () =>
      import("./components/template-zhifubao-copy-pay.vue"),
    TemplateZhiFuBaoZhuanKa: () =>
      import("./components/template-zhifubao-zhuanka.vue"), // template-zhifubao-zhuanka.vue
    TemplateZhiFuBaoZhuanKa: () =>
      import("./components/template-zhifubao-zhuanka.vue"), // template-zhifubao-zhuanka.vue
    TemplateWeiXinAddFriend: () =>
      import("./components/template-weixin-add-friend.vue"),
    TemplateEmail: () => import("./components/template-email.vue"), //  email 回执
    swiper,
    swiperSlide,
  },
  data() {
    return {
      selectedFile: null,
      uploading: false,
      previewUrl: "",
      uploadData: null,

      lastShowPopupCipherInfo: null, // 上次展示弹窗的订单信息，
      isBaseShowPopup: false,
      ciphertext: "",
      isLoadBaseInfo: false,
      error_message_2: "订单已超时，请关闭窗口！",
      swiperOptions: {
        // Swiper 配置项，与官方文档一致
        loop: false,
        autoplay: false,
        pagination: {
          el: ".swiper-pagination",
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },

      templateTheme: "", // 模板样式 0 无主题   1  支付宝   2  微信
      responseData: {},
      baseInfo: {},
      tutorial_visiual: false,
      submit_visiual: false,
      show_template: false,
      submitForm: {
        submitValue: "",
      },
      cipherInfo: {},
      show_error_page: false,
      error_msg: "",

      showTimeoutDialogVisiual: false, // 超时弹窗
      timeoutCount: 10, // 超时弹窗内容
      timeoutFlag: null, // 超时弹窗定时器
      showRefreshLoading: false, // 刷新数据时的loading状态
      hasHiddenSkeleton: false,

      // <el-option value="0" label="默认主题"> </el-option>
      // <el-option value="1" label="支付宝主题"> </el-option>
      // <el-option value="7" label="支付宝无框主题"> </el-option>
      // <el-option value="8" label="支付宝名片"> </el-option>
      // <el-option value="2" label="微信主题"> </el-option>
      // <el-option value="9" label="微信无框主题"> </el-option>
      // <el-option value="10" label="抖音红包"> </el-option>
      // <el-option value="11" label="鸿蒙主题"> </el-option>
      // <el-option value="3" label="QQ主题"> </el-option>
      // <el-option value="4" label="数字人民币主题"> </el-option>
      // <el-option value="5" label="宝盛主题"> </el-option>
      // <el-option value="6" label="USDT主题"> </el-option>
      // <el-option value="12" label="链接自动跳转"> </el-option>
      // <el-option value="13" label="聊天室自动跳转"> </el-option>
      // <el-option value="15" label="聊天室频道列表"> </el-option>
      // <el-option value="14" label="聚合支付"> </el-option>
      // <el-option value="16" label="亮点主题"> </el-option>

      // 模板组件映射表
      templateComponentMap: {
        0: "TemplateDefault", // 默认模板
        1: "TemplateZhiFuBao", // 支付宝
        2: "TemplateWeiXin", // 微信
        3: "TemplateQQ", // QQ
        4: "TemplateDigitalPay1", // 数字支付1
        5: "TemplateBao", // 鸿兴宝盛
        6: "TemplateUSDT", // USDT
        7: "TemplateZhiFuBaoWukuang", // 支付宝无框
        8: "TemplateLongXing", // 龙星 -- 支付宝名片码
        9: "TemplateWeiXinWukuang", // 微信无框
        10: "DouyinHongbao", // 抖音红包
        11: "TemplateHongmeng", // 鸿蒙支付
        12: "TemplateZhiFuBaoWukuang", // 提交弹窗后直接跳转
        14: "TemplateJuHe", // 聚合支付
        15: "TemplateChatRoom", // 聊天室,有支付列表
        16: "TemplateLiangDian", // 亮点
        17: "TemplateUSDT_RMB", // USDT人民币
        18: "TemplateTaoBaofu", // 淘宝代付直接付
        19: "TemplateZhiFuBaoCopyPay", // 淘宝复制转账
        20: "TemplateZhiFuBaoZhuanKa", // 支付宝转卡
        21: "TemplateWeiXinWukuangXY", // 微信无框XY
        22: "TemplateWeiXinAddFriend", // 微信无框 - 加好友转账
        23: "TemplateEmail", // Email回执
      },
    };
  },

  computed: {
    // 根据 templateTheme 动态返回对应的组件名称
    currentTemplateComponent() {
      return this.templateComponentMap[this.templateTheme] || "TemplateDefault";
    },
  },

  mounted() {
    this.hideGlobalSkeleton();

    this.$eventBus.$on("myqr-code-empty", () => {
      console.log("-------myqr-code-empty----================-----");
      // setTimeout(() => {
      //   this.getTemplateAndOrderInfo(false, true)
      // }, 500);
    });
  },

  methods: {
    /**
     * 上传文件到 S3
     * @param {File} file 用户选择的文件对象
     */
    async uploadToS3(file) {
      const { credentials, uploadPath } = this.uploadData;

      // 1. 创建 S3 客户端（使用临时凭证）
      const client = new S3Client({
        region: credentials.region,
        credentials: {
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.accessKeySecret,
          sessionToken: credentials.securityToken, // 关键：临时 Token
        },
      });

      // 2. 准备上传命令
      const command = new PutObjectCommand({
        Bucket: credentials.bucketName,
        Key: uploadPath, // 文件在 S3 上的完整路径
        Body: file, // 直接传 File 对象
        ContentType: file.type, // 设置正确的 MIME 类型
        // 如果需要公开读取，可以加上 ACL
        ACL: "public-read",
      });

      try {
        // 3. 执行上传
        const response = await client.send(command);
        console.log("上传成功:", response);

        // 返回可访问的 URL（如果 Bucket 是公开的）
        const fileUrl = `https://${credentials.bucketName}.s3.${credentials.region}.amazonaws.com/${uploadPath}`;
        return fileUrl;
      } catch (error) {
        console.error("上传失败:", error);
        throw error;
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.selectedFile = file;

      // 生成预览（如果是图片）
      this.previewUrl = URL.createObjectURL(file);

      // 清空 input，确保可以重新选择同一个文件
      event.target.value = "";
    },
    async testBtn() {
      console.log("-testbtn---");

      let ret = await generateUploadPath("");
      console.log("generateUploadPath ret :", ret);
      this.uploadData = ret.data;
    },

    isMobile,
    hideGlobalSkeleton() {
      const skeleton = document.getElementById("global-skeleton");
      if (skeleton) {
        this.hasHiddenSkeleton = true;
        skeleton.classList.add("fade-out");
        setTimeout(() => {
          const el = document.getElementById("global-skeleton");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }, 320);
      }
    },
    closeWindow() {
      // 尝试关闭窗口
      window.close();
    },
    showTimeOutDialog() {
      this.showTimeoutDialogVisiual = true;
      this.show_template = false;
    },
    checkSubmitDialogValue(info, rule, value, callback) {
      if (value.trim()) {
        // if (info.submitCheckType == 1) {
        //   if (value.trim().length > 0 && !/^\d+$/.test(value)) {
        //     return callback(new Error("请输入数值"));
        //   }
        // } else if (info.submitCheckType == 2) {
        //   if (value.trim().length > 0 && !/^[\u4E00-\u9FA5]+$/.test(value)) {
        //     return callback(new Error("请输入中文"));
        //   }
        // } else if (info.submitCheckType == 3) {
        //   if (value.trim().length > 0 && !/^[a-zA-Z]+$/.test(value)) {
        //     return callback(new Error("请输入字母"));
        //   }
        // } else if (info.submitCheckType == 4) {
        //   if (
        //     value.trim().length > 0 &&
        //     !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
        //   ) {
        //     return callback(new Error("请输入正确的邮箱"));
        //   }
        // }
        callback();
      } else {
        this.$message.error("请输入" + info.submitTitle);
        callback("请输入" + info.submitTitle);
      }
    },

    async getTemplateDetail() {
      // 如果是聊天室主题，直接跳至聊天室
      if (this.templateTheme == "13") {
        const url = "/on-line-server/" + this.$store.state.app.ciphertext;
        safeOpen(url, {
          target: "_self",
        });
        return;
      }

      // 如果是自动跳转的，不显示内容
      if (this.templateTheme == "12" && isMobile()) {
        this.autoJump();
        return;
      }

      // 显示支付页面，
      this.show_template = true;

      this.showTutorialDialog();
    },
    tutorialDialogClose() {
      this.tutorial_visiual = false;
    },

    // 显示提交弹窗，如果需要的话
    // 只有第一次 baseInfo 要求弹时，才会弹。其他情况，都不弹。
    showSubmitDialog() {
      this.submit_visiual = true;
      addOrderOperationLog(this.cipherInfo.orderId, "显示弹窗");
      // if(this.isLoadBaseInfo ){
      //   this.isBaseShowPopup = true;
      //   this.submit_visiual = true;

      // }else{

      //   // TemplateLongXing 的弹窗信息，自己处理 X, 弹窗 统一处理
      //   if (this.baseInfo.submitPopup == 1
      //     && !this.isBaseShowPopup) {

      //     this.submit_visiual = true;
      //   } else {
      //     // 没有提交弹窗，直接显示收银台
      //     this.show_template = true;
      //   }
      // }
    },
    showTutorialDialog() {
      // 处理文件
      if (
        this.baseInfo.isTutorialPopup == 0 ||
        !this.baseInfo.tutorialFilesUrl
      ) {
        // 没有弹窗教程的内容，就什么也不干
        this.tutorial_visiual = false;
        this.baseInfo.tutorialFilesUrl = [];
      } else {
        // 获得教程图片

        this.tutorial_visiual = true;

        const fileIds = this.baseInfo.tutorialFilesUrl.split(",");
        this.baseInfo.tutorialFilesUrl = [];

        fileIds.forEach((item) => {
          this.baseInfo.tutorialFilesUrl.push({
            url: "",
            name: "",
            fileId: item,
          });

          getFileById(item).then((res) => {
            let fileItems = this.baseInfo.tutorialFilesUrl.find(
              (ele) => ele.fileId == item
            );
            fileItems.url = res.data.fileUrl;
            fileItems.name = res.data.originalName;

            this.$forceUpdate();
          });
        });
      }
    },

    autoJump() {
      const url =
        this.responseData.data.payCashPayInfoVO.buttons[0].resultButtonUrl;

      if (!url) {
        console.error("[autoJump] URL is empty");
        return;
      }

      console.log("[autoJump] Auto jumping to:", url);
      safeOpen(url, {
        target: "_blank",
        showErrorTip: false, // 自动跳转不显示提示
      });
    },

    onSubmitBtnOk() {
      console.log("---onSubmitBtnOk--");
      addOrderOperationLog(
        this.cipherInfo.orderId,
        "开始提交弹窗 : " + this.submitForm.submitValue
      );

      this.$refs.submitDialogRef.validate(async (valid) => {
        console.log("submitDialogRef 提交信息：", valid, this.submitForm);

        if (valid) {
          try {
            let ret = await submitPopupInfo({
              orderId: this.cipherInfo.orderId,
              submitCheckType: this.baseInfo.submitCheckType,
              submitPopupContent: this.submitForm.submitValue,
            });

            if (ret.code == "00000") {
              console.log("--------------");
              this.$message.success("提交成功");
              addOrderOperationLog(
                this.cipherInfo.orderId,
                "提交弹窗成功 : " + this.submitForm.submitValue
              );
              // 当前订单已经提交，不需要再次提交
              localStorage.setItem("lastShowPopupCipherInfo", this.ciphertext);

              if (this.isLoadBaseInfo) {
                this.getTemplateAndOrderInfo(false);
              } else {
                console.log("=======这里永远不会来===========");

                // 如果是自动跳转的，不显示内容
                if (this.templateTheme == "12" && isMobile()) {
                  this.autoJump();
                } else {
                  // 显示收银台
                  this.show_template = true;
                }
              }
              this.closeSubmitDialog();
            } else {
              this.$message.error("提交失败, 请重新提交！");
              addOrderOperationLog(
                this.cipherInfo.orderId,
                "提交弹窗失败 : " + e.response.data.message
              );
            }
          } catch (e) {
            console.dir(e.response);
            try {
              addOrderOperationLog(
                this.cipherInfo.orderId,
                "提交弹窗异常: " + e.response.data.message
              );
            } catch (e) {
              addOrderOperationLog(
                this.cipherInfo.orderId,
                "提交弹窗异常: " + e.message
              );
            }
            // const { status, data } = e.response;
            // this.$message.error(data.message)
          }
        }
      });
    },
    closeSubmitDialog() {
      // 关闭提交弹窗
      this.submit_visiual = false;
    },
    async getTemplateAndOrderInfo(isBase, useCache = false) {
      this.isLoadBaseInfo = isBase;
      try {
        // 第一次请求，使用缓存（默认）
        let res = "";
        if (isBase) {
          res = await getBasePayCashInfo(this.ciphertext, true);
        } else {
          res = await getPayCashInfo(this.ciphertext, !useCache);
        }
        console.log(
          "useCache",
          useCache,
          "获取数据 getTemplateAndOrderInfo isBase  :",
          isBase,
          res
        );

        this.$store.commit("app/setOrderId", res.data.orderId);
        sessionStorage.setItem("app/setOrderId", res.data.orderId); // 存入缓存中

        addOrderOperationLog(
          res.data.orderId,
          "获取订单信息 isBase :" + isBase
        );
        if (isBase) {
          this.responseData = res;
          this.cipherInfo = res.data;
          this.baseInfo = res.data.payCashPageConfigVO.baseInfo;
          // 基础信息中，检查是否需要弹窗，如果需要弹窗，则弹窗， 如果不需要，再获取收银台信息
          if (
            this.baseInfo.submitPopup == 1 &&
            this.lastShowPopupCipherInfo != this.ciphertext
          ) {
            this.showSubmitDialog();
          } else {
            this.getTemplateAndOrderInfo(false);
          }
          return;
        }

        // 检查是否需要刷新数据
        const templateName =
          res.data.payCashPageConfigVO.baseInfo.templateName || "";
        const buttons = res.data.payCashPayInfoVO.buttons || [];
        const resultButtonUrl =
          buttons.length > 0 ? buttons[0].resultButtonUrl : null;

        // 如果模板名称包含"支付宝原生"且 resultButtonUrl 为空，则延迟2.5秒强制刷新数据
        const needRefresh =
          templateName.includes("支付宝原生") && !resultButtonUrl;
        console.log("====needRefresh======", needRefresh);

        if (needRefresh) {
          console.log(
            "检测到支付宝原生模板且按钮URL为空，将在2.5秒后强制刷新数据（useCache=false）"
          );

          // 显示刷新loading
          this.showRefreshLoading = true;

          // 先不处理数据和弹窗，等待刷新接口
          setTimeout(async () => {
            this.getTemplateAndOrderInfo(false, true);

            // try {
            //   // 第二次请求，强制刷新数据（useCache=false）
            //   const resRefresh = await getPayCashInfo(this.ciphertext, false);
            //   console.log('第二次请求返回数据（强制刷新）:', resRefresh);

            //   // 使用刷新后的数据完全覆盖
            //   res = resRefresh;

            //   // 更新所有响应式数据
            //   this.responseData = resRefresh;
            //   this.cipherInfo = resRefresh.data;
            //   this.baseInfo = resRefresh.data.payCashPageConfigVO.baseInfo;
            //   this.templateTheme = this.baseInfo.themeColor;

            //   // 强制更新视图
            //   this.$forceUpdate();

            //   console.log('数据已更新为强制刷新后的数据');

            //   // 隐藏刷新loading
            //   this.showRefreshLoading = false;

            //   // 刷新后再处理超时和显示弹窗
            //   let endTime = resRefresh.data.payCashOrderVO.expiredTime;
            //   if (new Date(endTime).getTime() <= Date.now()) {
            //     this.showTimeOutDialog();
            //   } else {

            //     // 如果是直接支付的，
            //     // 如果是自动跳转的，不显示内容
            //     if (this.templateTheme == "12" && this.isMobile()) {
            //       this.autoJump();
            //     } else {
            //       // 显示收银台
            //       this.show_template = true;
            //     }

            //     this.getTemplateDetail();
            //   }

            // } catch (error) {
            //   console.error('强制刷新数据失败:', error);

            //   // 隐藏刷新loading
            //   this.showRefreshLoading = false;

            //   // 刷新失败，使用第一次的数据继续流程
            //   this.responseData = res;
            //   this.cipherInfo = res.data;
            //   this.baseInfo = res.data.payCashPageConfigVO.baseInfo;
            //   this.templateTheme = this.baseInfo.themeColor;

            //   let endTime = res.data.payCashOrderVO.expiredTime;
            //   if (new Date(endTime).getTime() <= Date.now()) {
            //     this.showTimeOutDialog();
            //   } else {
            //     this.getTemplateDetail();
            //   }
            // }
          }, 1000);
        } else {
          // 不需要刷新，直接处理第一次请求的数据
          this.responseData = res;
          this.cipherInfo = res.data;
          this.baseInfo = res.data.payCashPageConfigVO.baseInfo;
          this.templateTheme = this.baseInfo.themeColor;

          this.showRefreshLoading = false;

          // 判断是否有超时
          let endTime = res.data.payCashOrderVO.expiredTime;

          if (new Date(endTime).getTime() <= Date.now()) {
            this.showTimeOutDialog();
          } else {
            this.getTemplateDetail();
          }
        }
      } catch (e) {
        console.dir(e);

        this.show_error_page = true;
        if (e.response) {
          this.error_msg = e.response.data.message;
        } else {
          this.error_msg = e.message;
        }

        if (!this.error_msg) {
          this.error_msg = "未知错误，请稍后重试！";
        }
      }
    },
  },
  async created() {
    console.log(location.href);
    const lastNum = location.href.lastIndexOf("/");
    const ciphertext = location.href.substring(lastNum + 1);

    console.log("ciphertext : ", ciphertext);

    if (!ciphertext) {
      this.show_error_page = true;
      this.error_msg = "订单信息不存在！";
      return;
    }
    this.ciphertext = ciphertext;
    this.$store.commit("app/setCiphertext", ciphertext);

    this.lastShowPopupCipherInfo = localStorage.getItem(
      "lastShowPopupCipherInfo"
    );

    this.getTemplateAndOrderInfo(true);
  },
};
</script>

<style lang="scss" scoped>
.container {
  font-size: 3.73rem;

  .preview {
    min-height: 100vh;
  }
}

.el-upload--picture-card {
  width: auto;
  height: auto;
  padding: 0 5.33rem;
  border: none;
  line-height: 0;
  background-color: transparent;
  box-shadow: none;
}

.el-input__inner {
  border-radius: 1.07rem;
  height: 10.67rem;
  line-height: 10.67rem;
  outline: 0;
  padding: 0 4rem;
  font-size: 3.73rem;
}

.el-form-item__content {
  // width: calc(100% - 32rem);
  width: 100%;
  line-height: 10.66rem !important;
}
.submit-info .el-form-item__content {
  width: calc(100% - 36rem);
}

.el-form-item__label {
  font-size: 3.73rem;
  line-height: 10.67rem;
  padding: 0 !important;
  padding-right: 2rem !important;
}
.el-form-item {
  margin-bottom: 5.8667rem;
}
.el-dialog__body {
  padding: 2rem 3rem;
}
.el-form-item__error {
  font-size: 3.2rem;
  padding-top: 1.07rem;
}
.swiper-container {
  width: 100%;
  min-height: 80rem;
}

.el-dialog__footer {
  padding: 2.67rem 5.33rem 5.33rem;
}

::v-deep .submit-dialog {
  text-align: center;
  .custom-dialog-header {
    justify-content: center;
    font-weight: 600;
  }
  .custom-dialog-title {
    color: #c00;
  }

  .custom-form-item-label {
    display: block;
    text-align: center;
    font-size: 14px;
    color: red;
    font-weight: 600;
    padding: 0;
  }

  .custom-dialog-body {
    padding: 0px 20px;

    .el-form-item__content {
      width: 100%;
    }
  }
  .custom-dialog-footer {
    padding: 0;
    .btn {
      width: 100%;
    }
  }
}
.error-dialog {
  .el-dialog {
    border-radius: 5.33rem;

    .el-dialog__header {
      text-align: center;
      font-weight: 700;
      border-bottom: 0.27rem solid #eee;
      padding: 5.3333rem 5.3333rem 2.6667rem;
    }

    .msg {
      color: #c00;
      text-align: center;
      line-height: 8rem;
      font-size: 4.27rem;
    }

    .btn {
      border-color: #c00;
      color: #c00;
      height: 10.67rem;
      line-height: 10.67rem;
      padding: 0;
      width: 60%;
      font-size: 4.27rem;
      border-radius: 5.33rem;
    }
  }
}

.el-dialog__title {
  line-height: 6.4rem;
  font-size: 4.8rem;
}

.look-dialog {
  .el-dialog {
    border-radius: 5.33rem;
  }

  .el-dialog__body {
    padding: 5.33rem;
  }

  .el-dialog__header {
    text-align: center;
    font-weight: 700;
    border-bottom: 0.27rem solid #eee;
  }

  .el-dialog__footer {
    padding-top: 0;
  }
}

// 刷新数据loading样式
.refresh-loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.refresh-loading-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}

.refresh-loading-icon {
  font-size: 13.33rem;
  color: #409eff;
  animation: rotating 1s linear infinite;
}

.refresh-loading-text {
  font-size: 4.27rem;
  color: #606266;
  font-weight: 500;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
