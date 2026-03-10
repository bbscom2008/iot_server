import { BankInfoList } from '@/utils/constants'
import { getFileById, uploadFileToServer } from '@/api/upload'

import clipboard from '@/utils/clipboard'
import Bank from '../blank/index.vue'
export default {
  props: {
    responseData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components:{
    Bank
  },
  data() {
    return {
      tutorial_visiual: false, // 教程弹窗
      submit_visiual: false, // 提交弹窗
      submitForm: {
        submitValue: ''
      },

      cashTemplateId: '', // 当前模板  id
      baseInfo: {
        templateName: '', // 	模板名称
        tutorialFilesUrl: [], // 教程文件地址
        templateTitleName: '', // 	模板标题名称
        templateTitleLogoUrl: '0',
        //预定义颜色
        isShowMerchantOrderNo: 0,
        themeColor: '#42b983', // 现在改为 模板主题了

        isTutorialPopup: 0, // 是否开启教程弹窗
        tutorialButtonName: '',

        submitPopup: 0, // 是否显示提交弹窗
        submitTitle: '',
        submitCheckType: 0, // 提交检验类型（0 - 不校验、1 - 数值、2 - 中文、3 - 字母、4 - 邮箱）

        isShowTransferRemark: 0, // 是否展示转账备注
        transferRemarkTitle: '',

        isOnlineService: 0, // 是否显示在线客服

        isPaymentTutorial: 0, // 是否显示教程按钮
        paymentTutorialUrl: '', // 教程内容
        isDefault: 1 // 超管创建的 模板为 默认模板  ， 其他用户创建的模板为 非默认模板
      },

      componentsConfig: {
        components: []
      },

      // 提交信息
      submitConfigInfo: {
        submitConfigs: []
      },

      // 文本配置
      textConfigInfo: {
        texts: []
      },

      // 按钮配置
      buttonConfigInfo: {
        buttons: []
      },

      // 二维码配置
      qrConfig: {
        isActive: 1,
        isShow: 0
      },

      // 二维码配置
      fileConfigInfo: {
        files: []
      },

      logoUrl: BankInfoList,

      backupData: {}, // 备份数据

      // 倒计时 时间
      cutdownTime: 1000,

      remarkContent: '88888666',

      orderNum: 'xxxxxx88xxxxxxx88xx8',
      // 订单金额
      orderMoney: 6666.66,
      logoIconUrl: '',
      orderMoneyOrange: 888,
    }
  },

  computed: {
    cutdownHours() {
      return String(Math.floor(this.cutdownTime / 3600)).padStart(2, '0')
    },
    cutdownMinutes() {
      return String(Math.floor((this.cutdownTime % 3600) / 60)).padStart(2, '0')
    },
    cutdownSeconds() {
      return String(Math.floor((this.cutdownTime % 3600) % 60)).padStart(2, '0')
    }
  },

  methods: {
    checkSubmitDialogValue(info, rule, value, callback) {
      if (value) {
        if (info.submitCheckType == 1) {
          if (value.trim().length > 0 && !/^\d+$/.test(value)) {
            return callback(new Error('请输入数值'))
          }
        } else if (info.submitCheckType == 2) {
          if (value.trim().length > 0 && !/^[\u4E00-\u9FA5]+$/.test(value)) {
            return callback(new Error('请输入中文'))
          }
        } else if (info.submitCheckType == 3) {
          if (value.trim().length > 0 && !/^[a-zA-Z]+$/.test(value)) {
            return callback(new Error('请输入字母'))
          }
        } else if (info.submitCheckType == 4) {
          if (
            value.trim().length > 0 &&
            !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
          ) {
            return callback(new Error('请输入正确的邮箱'))
          }
        }
        callback()
      } else {
        callback(new Error('请输入'))
      }
    },

    checkSubmitValue(info, rule, value, callback) {
      if (value) {
        if (info.checkType == 1) {
          if (value.trim().length > 0 && !/^\d+$/.test(value)) {
            return callback(new Error('请输入数值'))
          }
        } else if (info.checkType == 2) {
          if (value.trim().length > 0 && !/^[\u4E00-\u9FA5]+$/.test(value)) {
            return callback(new Error('请输入中文'))
          }
        } else if (info.checkType == 3) {
          if (value.trim().length > 0 && !/^[a-zA-Z]+$/.test(value)) {
            return callback(new Error('请输入字母'))
          }
        } else if (info.checkType == 4) {
          if (
            value.trim().length > 0 &&
            !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
          ) {
            return callback(new Error('请输入正确的邮箱'))
          }
        }
        callback()
      } else {
        callback(new Error('请输入'))
      }
    },

    copyInfo(e, content) {
      clipboard(content, e)
    },
    onBtnSubmit() {
      this.$refs.submitInfoRef.validate((valid) => {
        if (valid) {
          console.log('submitInfoRef 提交信息：', this.submitConfigInfo)
          this.$message.success('提交成功')
        }
      })
    },
    async uploadImage(action) {
      try {
        console.log('----uploadImage------', action)
        let res = await uploadFileToServer(action.file)
        console.log('uploadImage - ', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },

    async handleSuccess(index, response, file, fileList) {
      console.log('-handleSuccess-- ', index, response)

      if (response && response.data) {
        this.submitConfigInfo.submitConfigs[index].fileList = fileList

        fileList[0].fileId = response.data
        this.submitConfigInfo.submitConfigs[index].fileId = response.data
      } else {
        console.error('上传文件出错，', response)

        this.submitConfigInfo.submitConfigs[index].fileList = []
      }
    },

    handleRemove(index, file, fileList) {
      this.submitConfigInfo.submitConfigs[index].fileList = []
      this.$forceUpdate()
    },

    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    },

    async getTemplateDetail() {
      // let res = await getTemplateInfo(this.cashTemplateId)
      let res = this.responseData
      if (!res.data) {
        return
      }
      console.log(res)
      this.baseInfo = res.data.baseInfo

      if(this.baseInfo.templateTitleLogoUrl.length < 3){  // 系统图标
            this.logoIconUrl = require('@/assets/img_bank/' + this.logoUrl[this.baseInfo.templateTitleLogoUrl].icon)
      }else{ // 自定义图标
        // fileId 
        getFileById(this.baseInfo.templateTitleLogoUrl).then(res=>{
          this.logoIconUrl =  res.data.fileUrl
        })
      }

      this.componentsConfig.components = res.data.components ? res.data.components : null
      this.submitConfigInfo.submitConfigs = res.data.submitConfigs ? res.data.submitConfigs : []
      this.textConfigInfo.texts = res.data.texts ? res.data.texts : []
      this.buttonConfigInfo.buttons = res.data.buttons ? res.data.buttons : []
      this.qrConfig = res.data.qrConfig || {}

      this.qrConfig.qrUrl= require('@/assets/img/qr-code.png')

      this.fileConfigInfo.files = res.data.files ? res.data.files : []
      // 富文本内容：
      console.log('----paymentTutorialUrl------', this.baseInfo.paymentTutorialUrl)

    //   this.showTutorialDialog()
    },

    tutorialDialogClose() {
      this.tutorial_visiual = false
      this.showSubmitDialog()
    },

    // 显示提交弹窗，如果需要的话
    showSubmitDialog() {
      if (this.baseInfo.submitPopup == 1) {
        this.submit_visiual = true
      }
    },
    onSubmitBtnOk() {
      console.log('---onSubmitBtnOk--')

      this.$refs.submitDialogRef.validate((valid) => {
        console.log('submitDialogRef 提交信息：', valid, this.submitForm)
        if (valid) {
          this.$message.success('提交成功')

          this.closeSubmitDialog()
        }
      })
    },
    closeSubmitDialog() {
      this.submit_visiual = false
    },
    showTutorialDialog() {
      // 处理文件
      if (this.baseInfo.isTutorialPopup == 0 || !this.baseInfo.tutorialFilesUrl) {
        // 没有弹窗教程
        this.tutorial_visiual = false
        this.baseInfo.tutorialFilesUrl = []

        this.showSubmitDialog()
      } else {
        // 获得教程图片

        this.tutorial_visiual = true

        const fileIds = this.baseInfo.tutorialFilesUrl.split(',')
        this.baseInfo.tutorialFilesUrl = []

        fileIds.forEach((item) => {
          getFileById(item).then((res) => {
            this.baseInfo.tutorialFilesUrl.push({
              url: res.data.fileUrl,
              name: res.data.originalName,
              fileId: item
            })
            this.$forceUpdate()
          })
        })
      }
    }
  },
  mounted() {
    this.cashTemplateId = this.$route.query.templateId
    this.getTemplateDetail()

    document.title="收银台预览"

    setInterval(() => {
      this.cutdownTime -= 1
    }, 1000)
  }
}