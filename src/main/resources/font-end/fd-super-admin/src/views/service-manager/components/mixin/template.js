import { BankInfoList } from "@/utils/constants";
import { getFileById, uploadFileToServer } from "@/api/upload";

import clipboard from "@/utils/clipboard";

// import { submitCashInfo } from "@/api/template-create";
import Bank from "../blank/index.vue";

import MyQrCode from "@/components/MyQrCode/MyQrCode.vue";
// import html2canvas from 'html2canvas';

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
      orderNum: "123345466767978542", // 商户订单号
      orderMoney: "666",
      orderMoneyOrange: "888", // 原始数据，无小数后二位

      interFlag: null, // 倒计时定时器
      secodeQrButtonUrl: "xxadfqer134232", // 第二个  二维码
      btnClickUrl: {
        buttonTitle: "确定",
        resultButtonUrl: "we234ee35",
      }, // 按钮点击的
      base64Data: "",
    };
  },

  computed: {
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
    openChat(){

      window.open('/on-line-server/'+this.$store.state.app.ciphertext, '_blank')

    },
    async saveAsImage(element) {
      try {
        // const element = this.$refs.contentToSave;
        
        // const canvas = await html2canvas(element, {
        //   scale: 2, 
        //   backgroundColor: '#ffffff',
        //   useCORS: true,
        //   allowTaint: true
        // });
        
        // this.downloadImage(canvas);
        
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
          if(!element.textValue){
            isOk = false
            this.$message.error('请选择'+this.submitConfigInfo.submitConfigs[index].submitTitle)
            return 
          }
        }
     });

     // 有错，直接返回
     if(!isOk){
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
        // this.$refs.submitInfoRef.validate(async (valid) => {
        //   if (valid) {
        //     console.log("submitInfoRef 提交信息：", this.submitConfigInfo);

        //     let ret = await submitCashInfo(
        //       this.submitConfigInfo.submitConfigs.map((item) => {
        //         return {
        //           showType: item.showType,
        //           // checkType: item.checkType,
        //           orderId: this.responseData.data.orderId,
        //           submitInfoValue: item.textValue,
        //           submitInfoKey: item.submitTitle,
        //         };
        //       })
        //     );

        //     this.$message.success("提交成功");
        //   }
        // });
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
      console.log("----uploadImage------", action);
      // let base64 = await this.convertToBase64(action.file);
      let res = await uploadFileToServer(action.file);
      console.log("uploadImage - ", res);
      return res.data;
    },

    async handleSuccess(index, response, file, fileList) {
      console.log("-handleSuccess-- ", index, response, file, fileList);

      if (response) {
        this.submitConfigInfo.submitConfigs[index].fileList = fileList;
        this.submitConfigInfo.submitConfigs[index].textValue = response;

        this.$refs.submitInfoRef.clearValidate();
      } else {
        this.$message.error('上传文件出错 !')
        this.$nextTick(() => {
          this.submitConfigInfo.submitConfigs[index].fileList = [];
        this.submitConfigInfo.submitConfigs[index].textValue = '';
        this.$forceUpdate()

        })
      }
    },

    handleRemove(index, file, fileList) {
      this.submitConfigInfo.submitConfigs[index].fileList = [];
      this.submitConfigInfo.submitConfigs[index].textValue = '';
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

      const payInfoConfig = res.data.payCashPayInfoVO;

      this.textConfigInfo.texts = payInfoConfig.texts
        ? payInfoConfig.texts.filter(ele=>(ele.textValue!=null && ele.textValue!= undefined  && ele.textValue.length>0))
        : [];
      this.buttonConfigInfo.buttons = payInfoConfig.buttons
        ? payInfoConfig.buttons
        : [];
      this.qrConfig = payInfoConfig.qrConfig;

      // 根据 二维码的 fileId 获得 图片 url
      if (this.qrConfig && this.qrConfig.isActive && this.qrConfig.qrUrl) {
        this.qrConfig.fileId = this.qrConfig.qrUrl;
        getFileById(this.qrConfig.fileId).then((res) => {
          this.qrConfig.qrUrl = res.data.fileUrl;
        });
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

      
      this.$store.commit('app/setOrderInfo', orderInfo)
      this.orderNum = orderInfo.merchantOrder;

      this.orderMoneyOrange = Number(orderInfo.payAmount)
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
      if (info) {
        window.open(info.resultButtonUrl, "_blank");
      } else {
        window.open(this.btnClickUrl.resultButtonUrl, "_blank");
      }
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

      if (this.qrConfig.isActive && this.qrConfig.qrUrl) {
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
    // this.getTemplateDetail();

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
