import { BankInfoList } from "@/utils/constants";
import { getFileById, uploadFileToServer } from "@/api/upload";

import clipboard from "@/utils/clipboard";

import { submitCashInfo } from "@/api/template-create";
import Bank from "../blank/index.vue";

import MyQrCode from "@/components/MyQrCode/MyQrCode.vue";
import { safeOpen } from "@/utils/navigator";

let html2canvasLoader = null;
async function loadHtml2Canvas() {
  if (!html2canvasLoader) {
    html2canvasLoader = import(
      /* webpackChunkName: "html2canvas" */ "html2canvas"
    ).then((module) => module.default || module);
  }
  return html2canvasLoader;
}

import { addOrderOperationLog } from '@/api/template-create'

export default {
  props: {
    responseData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Bank,
    MyQrCode,
  },
  data() {
    return {

      logoIconUrl: "",
      cashTemplateId: "", // 当前模板  id
      baseInfo: {
        templateName: "", // 	模板名称
        tutorialFilesUrl: [], // 教程文件地址
        templateTitleName: "", // 	模板标题名称
        templateTitleLogoUrl: "0",
        tenantId: 0, // 租户id
        //预定义颜色
        isShowMerchantOrderNo: 0,
        themeColor: "#42b983", // 现在改为 模板主题了

        isTutorialPopup: 0, // 是否开启教程弹窗
        tutorialButtonName: "",

        submitPopup: 0, // 是否显示提交弹窗
        submitTitle: "",
        submitCheckType: 0, // 提交检验类型（0 - 不校验、1 - 数值、2 - 中文、3 - 字母、4 - 邮箱）

        isShowTransferRemark: 0, // 是否展示转账备注
        transferRemarkTitle: "",

        isOnlineService: 0, // 是否显示在线客服

        isPaymentTutorial: 0, // 是否显示教程按钮
        paymentTutorialUrl: "", // 教程内容
        isDefault: 1, // 超管创建的 模板为 默认模板  ， 其他用户创建的模板为 非默认模板
      },

      componentsConfig: {
        components: null,
      },

      // 提交信息
      submitConfigInfo: {
        submitConfigs: [],
      },

      // 文本配置
      textConfigInfo: {
        texts: [],
      },

      // 按钮配置
      buttonConfigInfo: {
        buttons: [],
      },

      // 二维码配置
      qrConfig: {
        isActive: 1,
        isShow: 0,
      },

      // 二维码配置
      fileConfigInfo: {
        files: [],
      },

      logoUrl: BankInfoList,

      // 倒计时 时间
      cutdownTime: 1000,
      remarkContent: "",
      orderNum: "", // 商户订单号
      sysOrderNum: "", // 系统订单号
      orderMoney: "",
      orderMoneyOrange: "", // 原始数据，无小数后二位

      interFlag: null, // 倒计时定时器
      secodeQrButtonUrl: "", // 第二个  二维码
      btnClickUrl: {
        buttonTitle: "",
        resultButtonUrl: "",
      }, // 按钮点击的
      base64Data: "",
      orderInfo: {},
      hideSubmitBtn: false, // 控制单图片上传时自动提交后隐藏按钮
    };
  },

  computed: {
    showOrderNum() {
      const targetStr = this.orderNum ? this.orderNum : this.sysOrderNum
      const strLength = targetStr.length;

      // 情况1：字符串长度 <= 6，直接返回对应长度的 *
      if (strLength <= 6) {
        return '*'.repeat(strLength);
      }

      // 情况2：字符串长度 > 6，计算前后需要保留的部分
      // 中间6位的前后分割点：前半部分保留 (总长度 - 6) / 2 位（向下取整）
      const keepLength = Math.floor((strLength - 6) / 2);
      // 前半部分：从开头截取 keepLength 位
      const prefix = targetStr.slice(0, keepLength);
      // 后半部分：从 末尾向前截取 keepLength 位（或用 slice(keepLength + 6) 更直接）
      const suffix = targetStr.slice(strLength - keepLength);

      // 拼接结果：前半部分 + 6个* + 后半部分
      return `${prefix}******${suffix}`;
    },
    cutdownHours() {
      return String(Math.floor(this.cutdownTime / 3600)).padStart(2, "0");
    },
    cutdownMinutes() {
      return String(Math.floor((this.cutdownTime % 3600) / 60)).padStart(
        2,
        "0"
      );
    },
    cutdownSeconds() {
      return String(Math.floor((this.cutdownTime % 3600) % 60)).padStart(
        2,
        "0"
      );
    },
  },

  methods: {
    openChat() {
      const url = '/on-line-server/' + this.$store.state.app.ciphertext;
      safeOpen(url, {
        target: '_blank',
        showErrorTip: true
      });
    },
    async saveAsImage(element) {
      try {
        const html2canvas = await loadHtml2Canvas();
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true
        });

        this.downloadImage(canvas);

      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存图片失败');
      }
    },

    downloadImage(canvas) {
      // 方法1: 直接下载
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `content-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 方法2: 在新窗口打开
      // window.open(canvas.toDataURL('image/png'));
    },


    checkSubmitValue(info, rule, value, callback) {
      if (value) {
        if (info.checkType == 1) {
          if (value.trim().length > 0 && !/^\d+$/.test(value)) {
            return callback(new Error("请输入数值"));
          }
        } else if (info.checkType == 2) {
          if (value.trim().length > 0 && !/^[\u4E00-\u9FA5]+$/.test(value)) {
            return callback(new Error("请输入中文"));
          }
        } else if (info.checkType == 3) {
          if (value.trim().length > 0 && !/^[a-zA-Z]+$/.test(value)) {
            return callback(new Error("请输入字母"));
          }
        } else if (info.checkType == 4) {
          if (
            value.trim().length > 0 &&
            !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
          ) {
            return callback(new Error("请输入正确的邮箱"));
          }
        }
        callback();
      } else {
        callback(new Error("请输入"));
      }
    },

    copyInfo(e, content) {
      clipboard(content, e);
    },
    async onBtnSubmit() {

      let isOk = true

      this.submitConfigInfo.submitConfigs.forEach((element, index) => {
        if (element.showType == 1) {
          // 文件
          if (!element.textValue) {
            isOk = false
            this.$message.error('请选择' + this.submitConfigInfo.submitConfigs[index].submitTitle)
            return
          }
        }
      });

      // 有错，直接返回
      if (!isOk) {
        return
      }

      // if (item.showType == 1) {
      //   // 文件

      //   if(!item.textValue){
      //     this.$message.error('请选择文件')
      //     return 
      //   }

      //   let ret = await submitCashInfo(
      //     this.submitConfigInfo.submitConfigs.map((item) => {
      //       return {
      //         checkType: item.checkType,
      //         orderId: this.responseData.data.orderId,
      //         submitInfoValue: item.textValue,
      //       };
      //     })
      //   );

      //   this.$message.success("提交成功");
      // } else {
      this.$refs.submitInfoRef.validate(async (valid) => {
        if (valid) {
          console.log("submitInfoRef 提交信息：", this.submitConfigInfo);

          let ret = await submitCashInfo(
            this.submitConfigInfo.submitConfigs.map((item) => {
              return {
                showType: item.showType,
                // checkType: item.checkType,
                orderId: this.responseData.data.orderId,
                submitInfoValue: item.textValue,
                submitInfoKey: item.submitTitle,
              };
            })
          );

          this.$message.success("提交成功");
          // 上传成功后如果是单文件图片，同样隐藏按钮
          if (
            this.submitConfigInfo.submitConfigs.length === 1 &&
            this.submitConfigInfo.submitConfigs[0].showType === 1
          ) {
            this.hideSubmitBtn = true;
          }
        }
      });
      // }
    },
    async uploadImage(action) {
      try {
        console.log("----uploadImage------", action);
        let res = await uploadFileToServer(action.file);
        console.log("uploadImage - ", res);
        return res;
      } catch (e) {
        console.log(e);
      }
    },

    async convertToBase64(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject(new Error("没有选择文件"));
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          // 获取 Base64 编码（包含数据前缀）
          const base64Data = e.target.result;
          console.log("Base64 数据长度:", base64Data.length);

          // 保存到组件数据
          this.base64Data = base64Data;

          // 解析文件类型
          const fileType = base64Data.split(";")[0].split(":")[1];
          console.log("文件类型:", fileType);

          resolve(base64Data);
        };

        reader.onerror = () => {
          const errorMsg = "文件读取失败";
          console.error(errorMsg, reader.error);
          reject(new Error(errorMsg));
        };

        reader.onabort = () => {
          const errorMsg = "文件读取被取消";
          console.warn(errorMsg);
          reject(new Error(errorMsg));
        };

        // 开始读取文件
        reader.readAsDataURL(file);
      });
    },

    async uploadImage(action) {
      // 自定义 http-request 上传时，必须手动调用 onSuccess/onError，否则 el-upload 不会触发
      // handleSuccess/handleRemove 等事件。
      console.log("----uploadImage------", action);
      try {
        let res = await uploadFileToServer(action.file);
        console.log("uploadImage - ", res);
        // 有些接口直接返回字符串 id，有些返回对象
        const data = res.data || res;
        // 通知 el-upload 上传成功，并将结果传给 on-success 事件
        if (action.onSuccess) {
          action.onSuccess(data, action.file);
        }
        return data;
      } catch (err) {
        console.error("uploadImage error", err);
        if (action.onError) {
          action.onError(err);
        }
        // 抛出错误以便外部也能捕获
        throw err;
      }
    },

    async handleSuccess(index, response, file, fileList) {
      console.log("-handleSuccess-- ", index, response, file, fileList);

      if (response) {
        // 兼容 response 直接为字符串或包含 url 的对象
        const url = response.url || response;
        // 构造 el-upload 需要的 fileList 格式
        // const uploaded = {
        //   name: file.name,
        //   url,
        //   response,
        //   status: 'success',
        //   uid: file.uid || file.name,
        // };
        this.submitConfigInfo.submitConfigs[index].fileList = fileList;
        this.submitConfigInfo.submitConfigs[index].textValue = url;

        // this.$refs.submitInfoRef.clearValidate();

        // 如果只有一个上传字段则自动提交并隐藏按钮
        if (
          this.submitConfigInfo.submitConfigs.length === 1 &&
          this.submitConfigInfo.submitConfigs[0].showType === 1
        ) {
          this.hideSubmitBtn = true;
          // 延迟调用，确保表单数据已更新
          this.$nextTick(() => {
            this.onBtnSubmit();
          });
        }
      } else {
        this.$message.error('上传文件出错 !');
        this.$nextTick(() => {
          this.submitConfigInfo.submitConfigs[index].fileList = [];
          this.submitConfigInfo.submitConfigs[index].textValue = '';
          this.hideSubmitBtn = false;
          this.$forceUpdate();
        });
      }
    },


    handleRemove(index, file, fileList) {
      this.submitConfigInfo.submitConfigs[index].fileList = [];
      this.submitConfigInfo.submitConfigs[index].textValue = '';
      // 取消自动隐藏
      this.hideSubmitBtn = false;
      this.$forceUpdate();
    },

    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/bmp" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    },

    async getTemplateDetail() {
      // let res = await getTemplateInfo(this.cashTemplateId)
      let res = this.responseData;
      if (!res.data) {
        return;
      }
      console.log(res);
      this.baseInfo = res.data.payCashPageConfigVO.baseInfo;

      this.$store.commit('app/setOrderId', res.data.orderId)

      try {
        if (this.baseInfo.templateTitleLogoUrl.length < 3) {
          // 系统图标
          this.logoIconUrl = require("@/assets/img_bank/" +
            this.logoUrl[+this.baseInfo.templateTitleLogoUrl].icon);
        } else {
          // 自定义图标
          // fileId
          getFileById(this.baseInfo.templateTitleLogoUrl).then((res) => {
            this.logoIconUrl = res.data.fileUrl;
          });
        }
      } catch (e) {
        console.log(e);
      }

      const cashConfig = res.data.payCashPageConfigVO;

      this.componentsConfig.components = cashConfig.components
        ? cashConfig.components
        : null;

      this.submitConfigInfo.submitConfigs = cashConfig.submitConfigs
        ? cashConfig.submitConfigs
        : [];

      if (
        this.submitConfigInfo.submitConfigs.length === 1 &&
        this.submitConfigInfo.submitConfigs[0].showType === 1
      ) {
        this.hideSubmitBtn = true;
      } else {
        this.hideSubmitBtn = false;
      }

      const payInfoConfig = res.data.payCashPayInfoVO;

      this.textConfigInfo.texts = payInfoConfig.texts
        ? payInfoConfig.texts.filter(ele => (ele.textValue != null && ele.textValue != undefined && ele.textValue.length > 0))
        : [];
      this.buttonConfigInfo.buttons = payInfoConfig.buttons
        ? payInfoConfig.buttons
        : [];
      this.qrConfig = payInfoConfig.qrConfig;

      // 根据 二维码的 fileId 获得 图片 url
      if (this.qrConfig && this.qrConfig.qrUrl) {

        // 是否显示系统二维码，即 解析后的数据，默认为 false , 理论上肯定会返回该值，但理论不一定可靠
        if(this.qrConfig.isShow === undefined || this.qrConfig.isShow === null){
          this.qrConfig.isShow = 0
        }

        // 显示系统二维码,并且有解析值，才显示解析的值
        if (this.qrConfig.isActive == 1 && this.qrConfig.parseValue && this.qrConfig.isShow == 1) {
          // 二维码会解析  parseValue 来显示
          // 有些会解析失败，那就还显示原图
          addOrderOperationLog(this.$store.getters.orderId, '显示解析二维码: ' + this.qrConfig.parseValue);
        } else {
          this.qrConfig.isActive = 0
          // 显示原图 qrUrl 返回的其实是 fileId 
          this.qrConfig.fileId = this.qrConfig.qrUrl;
          this.qrConfig.qrUrl = '' // 清空避免无用的加载行为
          addOrderOperationLog(this.$store.getters.orderId, '开始获取二维码图片: ' + this.qrConfig.fileId);
          getFileById(this.qrConfig.fileId).then((res) => {
            this.qrConfig.qrUrl = res.data.fileUrl;
          }).catch((err) => {
            console.error('获取二维码图片失败:', err);
            addOrderOperationLog(this.$store.getters.orderId, '获取二维码图片失败: ' + this.qrConfig.fileId);
            // this.qrConfig.qrUrl='';
          });

        }

        console.log('this.qrConfig.fileId ', this.qrConfig.fileId);
      }

      this.fileConfigInfo.files = payInfoConfig.files
        ? payInfoConfig.files
        : [];
      // 富文本内容：
      console.log(
        "----paymentTutorialUrl------",
        this.baseInfo.paymentTutorialUrl
      );

      // 订单信息
      const orderInfo = res.data.payCashOrderVO;
      this.orderInfo = orderInfo

      this.$store.commit('app/setOrderInfo', orderInfo)
      this.orderNum = orderInfo.merchantOrder;
      this.sysOrderNum = res.data.orderId

      this.orderMoneyOrange = Number(orderInfo.payAmount).toFixed(2)
      this.orderMoney = Number(orderInfo.payAmount).toFixed(2);
      this.remarkContent = orderInfo.transferRemark;

      const endTime = new Date(orderInfo.expiredTime);

      this.cutdownTime = Math.floor((endTime - new Date()) / 1000);
      if (this.cutdownTime <= 0) {
        this.cutdownTime = 0;
        clearInterval(this.interFlag);

        this.$parent.showTimeOutDialog();
      }
    },

    btnClick(info) {
      const url = info ? info.resultButtonUrl : this.btnClickUrl.resultButtonUrl;

      if (!url) {
        console.error('[btnClick] URL is empty');
        addOrderOperationLog(this.$store.getters.orderId, '按钮跳转链接不存在:' + info);
        this.$message.error('跳转链接不存在');
        return;
      }

      console.log('[btnClick] Jumping to:', url);
      safeOpen(url, {
        target: '_blank',
        showErrorTip: true
      });
    },

    isHaveBtn() {
      if (
        !this.buttonConfigInfo.buttons ||
        this.buttonConfigInfo.buttons.length == 0
      ) {
        return false;
      }

      for (
        let index = 0;
        index < this.buttonConfigInfo.buttons.length;
        index++
      ) {
        const element = this.buttonConfigInfo.buttons[index];
        if (element.showType == 2 || element.showType == 0) {
          this.btnClickUrl = element;
          return true;
        }
      }

      return false;
    },

    // 如果没有配置二维码，但按钮中有二维码
    isSecondQr() {
      if (
        !this.buttonConfigInfo.buttons ||
        this.buttonConfigInfo.buttons.length == 0
      ) {
        return false;
      }

      if (this.qrConfig && this.qrConfig.isActive && this.qrConfig.parseValue) {
        return false;
      }

      if (this.qrConfig && !this.qrConfig.isActive && this.qrConfig.qrUrl) {
        return false;
      }


      for (
        let index = 0;
        index < this.buttonConfigInfo.buttons.length;
        index++
      ) {
        const element = this.buttonConfigInfo.buttons[index];

        if (element.showType == 2 || element.showType == 1) {
          this.secodeQrButtonUrl = element.resultButtonUrl;
          return true;
        }
      }

      return false;
    },
  },
  mounted() {
    this.cashTemplateId = this.$route.query.templateId;
    this.getTemplateDetail();

    this.interFlag = setInterval(() => {
      if (this.cutdownTime <= 0) {
        clearInterval(this.interFlag);
        this.$parent.showTimeOutDialog();
      } else {
        this.cutdownTime -= 1;
      }
    }, 1000);
  },
};
