<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="logo-box">
            <div class="logo">
              <!-- <img
                :src="
                  require('@/assets/img_bank/' +
                    this.logoUrl[+this.baseInfo.templateTitleLogoUrl].icon)
                "
                alt=""
              /> -->
              <el-image v-loading="logoIconUrl == ''" style="height: 35px;width:35px;" :src="logoIconUrl"
                fit="cover"></el-image>

              <span class="title">{{ baseInfo.templateTitleName }}</span>
            </div>
          </div>

          <div class="payinfo-box-1 t-72 " style="padding-bottom: 0;">
            <!-- 基础信息卡片 -->

            <!-- <div class="tishi">转错金额会导致支付失败！</div> -->

            <p class="tishi">请按此金额复制支付！</p>
            <p class="tishi">转错金额会导致支付失败！</p>



            <div class="order-money-box">
              <div class="order-money">￥{{ orderMoney }}</div>
              <el-button class="btn-copy-1" type="text" @click="
                (e) => {
                  copyInfo(e, orderMoney)
                }
              ">复制</el-button>


              <div class="arrow left">
                <img src="@/assets/img/left.jpg" alt="">
              </div>

              <div class="arrow right ">
                <img src="@/assets/img/right.jpg" alt="">
              </div>

            </div>

            <h3 class="py-1">付款需复制附言备注 否则不到账</h3>


            <div class="text-info card">
              <div class="txt-info-item" v-if="baseInfo.isShowTransferRemark">
                <span class="txt-left">{{ baseInfo.transferRemarkTitle }}：</span>

                <span class="txt" style="margin-right: 10px">{{ remarkContent }}</span>

                <el-button class="btn-copy-1" type="text" @click="
                  (e) => {
                    copyInfo(e, remarkContent)
                  }
                ">复制</el-button>
              </div>

            </div>


            <div class="cutdowntime">
              <!-- <div>付款倒计时：</div> -->
              <span>{{ cutdownHours }}时</span>
              <span style="margin: 0 8px;">{{ cutdownMinutes }}分</span>
              <span>{{ cutdownSeconds }}秒</span>
            </div>

            <div class="hr"></div>
            <div class="txt-order-no" v-if="baseInfo.isShowMerchantOrderNo">
              <span class="txt-left"> 订单号：</span>
              <span style="margin: 0 8px;">{{ orderNum }}</span>
              <el-button type="text" @click="
                (e) => {
                  copyInfo(e, orderNum)
                }
              ">复制</el-button>
            </div>

          </div>

          <div class="payinfo-box-1 mt-20">


            <!-- <div class="pt-1">
              注意: 禁止支付宝微信扫码!违者不到账!
            </div>
            <div class="pt-1 blue  ">
              注意:仅支持银行app云闪付扫码支付!
            </div>
            <div class="pt-1 green ">
              注意:只能支付一次，重复扫码不到账!
            </div>
            <div class="pt-1 popur">
              注意:行选项跳转页面失败，可保存二维码手动打开银联APP扫码支付!
            </div> -->



            <!-- 二维码卡片 -->
            <div class="qrcode card" v-if="qrConfig.isActive && qrConfig.qrUrl">
              <div style="text-align: center">
                <div class="img-wrap">

                  <img :src="qrConfig.qrUrl" alt="" />
                </div>
              </div>
            </div>

            <!-- <div class="pay-intro">
              支付说明：使用支付宝扫码，直接完成支付或者截屏保存二维码，打开支付宝扫一扫，点击相册选择截图二维码，完成支付
            </div> -->

            <div class="hr"></div>



            <!-- 文本信息卡片 -->
            <div class="text-info card" v-if="textConfigInfo.texts.length > 0">
              <div class="txt-info-item" v-for="info in textConfigInfo.texts" :key="info.sort">
                <span class="txt-left">{{ info.textTitle }}
                  <span v-if="info.textTitle.length > 0">：</span></span>
                <span class="txt-right"><span style="margin-right: 20px">{{ info.textValue }}</span>
                  <el-button type="text" @click="
                    (e) => {
                      copyInfo(e, info.textValue);
                    }
                  ">复制</el-button></span>
              </div>
            </div>

            <!-- 提交信息卡片 -->
            <div class="submit-info card" v-if="submitConfigInfo.submitConfigs.length > 0">
              <!-- <div class="hr"></div> -->
              <el-form ref="submitInfoRef" :model="submitConfigInfo" label-width="120px">
                <div class="submit-info-item" v-for="(info, index) in submitConfigInfo.submitConfigs" :key="info.id"
                  style="margin-bottom: 10px">
                  <!-- 0 文本框   checkType（0-不校验、1-数值、2-中文、3、字母、4-邮箱） -->
                  <!-- :prop="`submitInfo.${index}.textValue`" -->
                  <el-form-item v-if="info.showType == 0" :label="info.submitTitle" :rules="info.checkType == 0
                    ? []
                    : [
                      {
                        required: true,
                        message: '请输入' + info.submitTitle,
                        trigger: 'blur'
                      },
                      // {
                      //   validator: (rule, value, callback) => {
                      //     // 0 不校验  1 数值  2 中文  3 字母  4 邮箱
                      //     checkSubmitValue(info, rule, value, callback)
                      //   }
                      // }
                    ]
                    " :prop="`submitConfigs[${index}].textValue`">
                    <el-input v-model="info.textValue" :placeholder="'请输入' + info.submitTitle"></el-input>
                  </el-form-item>

                  <!-- 1 图片上传 -->
                  <!-- :prop="`submitInfo.${index}.file`" -->
                  <!-- <el-form-item
                    v-if="info.showType == 1"
                    :label="info.submitTitle"
                    :prop="`submitConfigs[${index}].fileId`"
                    :rules="[
                      {
                        required: true,
                        message: '请选择' + info.submitTitle,
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :before-upload="beforeAvatarUpload"
                      action="#"
                      :http-request="uploadImage"
                      :on-success="
                        (response, file, fileList) => handleSuccess(index, response, file, fileList)
                      "
                      :on-remove="(file, fileList) => handleRemove(index, file, fileList)"
                      :limit="1"
                      list-type="picture-card"
                      :auto-upload="true"
                    >
                      <div class="trigger" v-if="!info.fileList || info.fileList.length == 0">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </div>
                      <div slot="help-tip" class="el-upload__tip">只能上传jpg/png文件</div>
                    </el-upload>
                  </el-form-item> -->
                </div>
                <div style="text-align: center">
                  <el-button type="primary" @click="onBtnSubmit">提交信息</el-button>
                </div>

                <!-- 2 邮箱  废弃 -->
                <!-- <el-form-item
                    v-if="info.showType == 2"
                    :label="info.submitTitle"
                    prop="templateName"
                    :rules="templateNameRules"
                  >
                    <el-input v-model="baseInfo.templateName" placeholder="输入模板名称"></el-input>
                  </el-form-item> -->
              </el-form>
            </div>

            <!-- 银行组件卡片 -->
            <!-- <div class="bank-comp card" v-if="componentsConfig.components.length > 0">
              <div class="hr"></div>
              <div class="bank-box">
                <div class="btn-info" v-for="bank in componentsConfig.components" :key="bank.id">
                  <a :href="bank.buttonUrl" target="_blank">
                    <div class="btn-info-item">
                      <img style="height: 80px; margin: 10px"
                        :src="require('@/assets/img_bank/' + logoUrl[+bank.buttonLogoUrl].icon)" alt="" />
                      <span style="font-size: 14px">{{ bank.buttonTitle }}</span>
                    </div>
                  </a>
                </div>
              </div>
            </div> -->

            <!-- 按钮信息卡片 -->
            <!-- <div class="btns card" v-if="buttonConfigInfo.buttons.length > 0">
              <div class="btn-info" v-for="info in buttonConfigInfo.buttons" :key="info.id">
                <div class="btn-info-item">
                  <img
                    v-if="info.showType == 1 || info.showType == 2"
                    src="@/assets/img/qr-code.png"
                    width="90"
                    alt=""
                    class="mt-10"
                  />
                  <span v-if="info.showType == 2" style="color: red; font-size: 10px; margin: 8px"
                    >点击跳转，或者 扫码跳转</span
                  >
                  <el-button
                    v-if="info.showType == 0 || info.showType == 2"
                    type="primary"
                    style="width: 30%; margin-bottom: 10px"
                    >{{ info.buttonTitle }}</el-button
                  >
                </div>
              </div>
            </div> -->

            <div class="service card" v-if="baseInfo.isOnlineService" style="margin-top:15px;">
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="success" style="width: 30%; margin-bottom: 10px">在线客服</el-button>
                </div>
              </div>
            </div>

            <div class="card pay-course payinfo-box"  style="padding: 0 15px;"  v-if="baseInfo.paymentTutorialUrl.length > 0">
              <div class="title-box">
                <div class="title">注意事项</div>
              </div>

              <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
            </div>

          </div>


          <div class="mt-20"  v-if="componentsConfig.components"  >
            <Bank></Bank>
          </div>


        </div>
      </div>
    </div>

  </div>
</template>

<script>

import template from './mixin/template.js'

export default {
  name: 'TemplateDefault',
  mixins: [template],
}

// import { BankInfoList } from '@/utils/constants'
// import { getFileById, uploadFileToServer } from '@/api/upload'

// import clipboard from '@/utils/clipboard'

// export default {
//   name: 'TemplatePreview',
//   props: {
//     responseData: {
//       type: Object,
//       default: () => {
//         return {}
//       }
//     }
//   },
//   data() {
//     return {
//       tutorial_visiual: false, // 教程弹窗
//       submit_visiual: false, // 提交弹窗
//       submitForm: {
//         submitValue: ''
//       },

//       cashTemplateId: '', // 当前模板  id
//       baseInfo: {
//         templateName: '', // 	模板名称
//         tutorialFilesUrl: [], // 教程文件地址
//         templateTitleName: '', // 	模板标题名称
//         templateTitleLogoUrl: '0',
//         //预定义颜色
//         isShowMerchantOrderNo: 0,
//         themeColor: '#42b983', // 现在改为 模板主题了

//         isTutorialPopup: 0, // 是否开启教程弹窗
//         tutorialButtonName: '',

//         submitPopup: 0, // 是否显示提交弹窗
//         submitTitle: '',
//         submitCheckType: 0, // 提交检验类型（0 - 不校验、1 - 数值、2 - 中文、3 - 字母、4 - 邮箱）

//         isShowTransferRemark: 0, // 是否展示转账备注
//         transferRemarkTitle: '',

//         isOnlineService: 0, // 是否显示在线客服

//         isPaymentTutorial: 0, // 是否显示教程按钮
//         paymentTutorialUrl: '', // 教程内容
//         isDefault: 1 // 超管创建的 模板为 默认模板  ， 其他用户创建的模板为 非默认模板
//       },

//       componentsConfig: {
//         components: []
//       },

//       // 提交信息
//       submitConfigInfo: {
//         submitConfigs: []
//       },

//       // 文本配置
//       textConfigInfo: {
//         texts: []
//       },

//       // 按钮配置
//       buttonConfigInfo: {
//         buttons: []
//       },

//       // 二维码配置
//       qrConfig: {
//         isActive: 1,
//         isShow: 0
//       },

//       // 二维码配置
//       fileConfigInfo: {
//         files: []
//       },

//       logoUrl: BankInfoList,

//       backupData: {}, // 备份数据

//       // 倒计时 时间
//       cutdownTime: 1000,

//       remarkContent: '88888666',

//       orderNum: 'xxxxxx88xxxxxxx88xx8',
//       // 订单金额
//       orderMoney: 100
//     }
//   },

//   computed: {
//     cutdownHours() {
//       return String(Math.floor(this.cutdownTime / 3600)).padStart(2, '0')
//     },
//     cutdownMinutes() {
//       return String(Math.floor((this.cutdownTime % 3600) / 60)).padStart(2, '0')
//     },
//     cutdownSeconds() {
//       return String(Math.floor((this.cutdownTime % 3600) % 60)).padStart(2, '0')
//     }
//   },

//   methods: {
//     checkSubmitDialogValue(info, rule, value, callback) {
//       if (value) {
//         if (info.submitCheckType == 1) {
//           if (value.trim().length > 0 && !/^\d+$/.test(value)) {
//             return callback(new Error('请输入数值'))
//           }
//         } else if (info.submitCheckType == 2) {
//           if (value.trim().length > 0 && !/^[\u4E00-\u9FA5]+$/.test(value)) {
//             return callback(new Error('请输入中文'))
//           }
//         } else if (info.submitCheckType == 3) {
//           if (value.trim().length > 0 && !/^[a-zA-Z]+$/.test(value)) {
//             return callback(new Error('请输入字母'))
//           }
//         } else if (info.submitCheckType == 4) {
//           if (
//             value.trim().length > 0 &&
//             !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
//           ) {
//             return callback(new Error('请输入正确的邮箱'))
//           }
//         }
//         callback()
//       } else {
//         callback(new Error('请输入'))
//       }
//     },

//     checkSubmitValue(info, rule, value, callback) {
//       if (value) {
//         if (info.checkType == 1) {
//           if (value.trim().length > 0 && !/^\d+$/.test(value)) {
//             return callback(new Error('请输入数值'))
//           }
//         } else if (info.checkType == 2) {
//           if (value.trim().length > 0 && !/^[\u4E00-\u9FA5]+$/.test(value)) {
//             return callback(new Error('请输入中文'))
//           }
//         } else if (info.checkType == 3) {
//           if (value.trim().length > 0 && !/^[a-zA-Z]+$/.test(value)) {
//             return callback(new Error('请输入字母'))
//           }
//         } else if (info.checkType == 4) {
//           if (
//             value.trim().length > 0 &&
//             !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
//           ) {
//             return callback(new Error('请输入正确的邮箱'))
//           }
//         }
//         callback()
//       } else {
//         callback(new Error('请输入'))
//       }
//     },

//     copyInfo(e, content) {
//       clipboard(content, e)
//     },
//     onBtnSubmit() {
//       this.$refs.submitInfoRef.validate((valid) => {
//         if (valid) {
//           console.log('submitInfoRef 提交信息：', this.submitConfigInfo)
//           this.$message.success('提交成功')
//         }
//       })
//     },
//     async uploadImage(action) {
//       try {
//         console.log('----uploadImage------', action)
//         let res = await uploadFileToServer(action.file)
//         console.log('uploadImage - ', res)
//         return res
//       } catch (e) {
//         console.log(e)
//       }
//     },

//     async handleSuccess(index, response, file, fileList) {
//       console.log('-handleSuccess-- ', index, response)

//       if (response && response.data) {
//         this.submitConfigInfo.submitConfigs[index].fileList = fileList

//         fileList[0].fileId = response.data
//         this.submitConfigInfo.submitConfigs[index].fileId = response.data
//       } else {
//         console.error('上传文件出错，', response)

//         this.submitConfigInfo.submitConfigs[index].fileList = []
//       }
//     },

//     handleRemove(index, file, fileList) {
//       this.submitConfigInfo.submitConfigs[index].fileList = []
//       this.$forceUpdate()
//     },

//     beforeAvatarUpload(file) {
//       const isJPG =
//         file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
//       const isLt2M = file.size / 1024 / 1024 < 4

//       if (!isJPG) {
//         this.$message.error('上传图片只能是 JPG/PNG 格式!')
//       }
//       if (!isLt2M) {
//         this.$message.error('上传图片大小不能超过 4MB!')
//       }
//       return isJPG && isLt2M
//     },

//     async getTemplateDetail() {
//       // let res = await getTemplateInfo(this.cashTemplateId)
//       let res = this.responseData
//       console.log(res)
//       if (!res.data) {
//         return
//       }
//       this.baseInfo = res.data.baseInfo

//       this.componentsConfig.components = res.data.components ? res.data.components : []
//       this.submitConfigInfo.submitConfigs = res.data.submitConfigs ? res.data.submitConfigs : []
//       this.textConfigInfo.texts = res.data.texts ? res.data.texts : []
//       this.buttonConfigInfo.buttons = res.data.buttons ? res.data.buttons : []
//       this.qrConfig = res.data.qrConfig || {}
//       this.fileConfigInfo.files = res.data.files ? res.data.files : []
//       // 富文本内容：
//       console.log('----paymentTutorialUrl------', this.baseInfo.paymentTutorialUrl)

//       // this.showTutorialDialog()
//     },

//     tutorialDialogClose() {
//       this.tutorial_visiual = false
//       this.showSubmitDialog()
//     },

//     // 显示提交弹窗，如果需要的话
//     showSubmitDialog() {
//       if (this.baseInfo.submitPopup == 1) {
//         this.submit_visiual = true
//       }
//     },
//     onSubmitBtnOk() {
//       console.log('---onSubmitBtnOk--')

//       this.$refs.submitDialogRef.validate((valid) => {
//         console.log('submitDialogRef 提交信息：', valid, this.submitForm)
//         if (valid) {
//           this.$message.success('提交成功')

//           this.closeSubmitDialog()
//         }
//       })
//     },
//     closeSubmitDialog() {
//       this.submit_visiual = false
//     },
//     showTutorialDialog() {
//       // 处理文件
//       if (this.baseInfo.isTutorialPopup == 0 || !this.baseInfo.tutorialFilesUrl) {
//         // 没有弹窗教程
//         this.tutorial_visiual = false
//         this.baseInfo.tutorialFilesUrl = []

//         this.showSubmitDialog()
//       } else {
//         // 获得教程图片

//         this.tutorial_visiual = true

//         const fileIds = this.baseInfo.tutorialFilesUrl.split(',')
//         this.baseInfo.tutorialFilesUrl = []

//         fileIds.forEach((item) => {
//           getFileById(item).then((res) => {
//             this.baseInfo.tutorialFilesUrl.push({
//               url: res.data.fileUrl,
//               name: res.data.originalName,
//               fileId: item
//             })
//             this.$forceUpdate()
//           })
//         })
//       }
//     }
//   },
//   mounted() {
//     this.cashTemplateId = this.$route.query.templateId
//     this.getTemplateDetail()

//     setInterval(() => {
//       this.cutdownTime -= 1
//     }, 1000)
//   }
// }
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  background-color: white;
  // min-height: calc(100vh - 180px);
  // background-color: aquamarine;
  // padding: 20px;

  .body {
    display: flex;
    justify-content: center;
    align-items: stretch;
    min-height: calc(100vh - 165px);
  }

  .preview {
    width: 100vw;
    // height: 400px;
    min-height: 100vh;
    // background-color: #f1f1f1;
    padding-bottom: 30px;

    .tip {
      text-align: center;
    }

    .main {
      width: 100vw;
      // max-width: 375px;
      // min-width: 400px;
      max-width: 440px;
      background-color: white;
      margin: 0 auto;
      // margin-top: 10px;
      // padding-top: 52px;
      padding-bottom: 20px;
      // background-color: #fff;
      color: #2b3674;
      // .card {
      // background-color: #fff;
      // border-top: 1px solid #eee;
      // padding: 20px;
      // }

      .logo-box {
        width: 100%;
        height: 150px;
        background-color: #49a1ff;
        // border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: center;
        // align-items: center;
        // padding-top: 11px;
      }

      .logo {
        height: 78px;
        // background-color: #ffffffe5;
        border-radius: 21px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px 35px;

        img {
          width: 50px;

        }

        .title {
          font-size: 22px;
          margin-left: 10px;
          color: #fff;
        }
      }

      .t-72 {
        margin-top: -72px;
      }

      .payinfo-box-1 {
        // width: 355px;
        background-color: #fff;
        padding: 20px 0;

        margin-inline: 20px;

        // border-radius: 12px;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.195);
        border-radius: 10px !important;

        // margin: 10px auto;

        .tishi {
          // background-color: #ff3b3014;
          // height: 30px;
          // border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 15px;
        }

        .btn-copy-1 {
          color: rgb(73, 161, 255);
          font-size: 19px;
          margin-left: 11px;
          font-weight: 600;
        }

        .order-money-box {
          position: relative;
          margin: 20px 0;
          display: flex;
          justify-content: center;
          align-items: center;

          .arrow {
            width: 35px;
            height: 35px;
            position: absolute;
            top: -10%;
            left: 50%;
            transform: translate(-50%, 0);

            img {
              width: 100%;
              height: 100%;
            }
          }

          .arrow.left {
            margin-left: -25%;

            img {
              animation: left-move .5s infinite alternate;
            }
          }

          .arrow.right {
            margin-left: 25%;

            img {
              animation: right-move .5s infinite alternate;
            }
          }




          .order-money {
            color: #ff3b30;
            font-weight: bold;
            font-size: 30px;
            // margin-right: 20px;
          }

          .copy-order-money {
            height: 26px;
            line-height: 16px;
            padding: 3px 10px !important;
            margin-left: 5px;
          }
        }


        .py-1 {
          text-align: center;
          color: #ff3b30;
        }




        .qrcode.card {
          width: 160px;
          // height: 210px;
          // background-color: #1777ff;
          margin: 0px auto;
          padding-top: 5px;

          &>div {
            span {
              color: #fff;
            }

            .up-txt {
              font-weight: 600;
              font-size: 16px;
            }

            .down-txt {
              font-size: 12px;
            }

            .img-wrap {
              width: 160px;
              background-color: #fff;
              padding: 10px 10px;
            }

            img {
              width: 100%;
              display: block;
            }
          }
        }

        .cutdowntime {
          display: flex;
          justify-content: center;
          align-items: center;
          // padding: 10px;
          // color: #2b3674;
          font-size: 12px;

          // div {
          //   font-weight: 600;
          // }

          // i {
          //   // color: #0084ff;
          //   margin: 0 5px;
          //   font-weight: bold;
          // }

          span {
            padding: 5px;
            border-radius: 4px;
            background-color: #5ac725;
            color: #fff;
          }
        }

        .txt-order-no {
          text-align: center;
        }


        .pt-1 {
          text-align: center;
          color: #ff3b30;
          padding: 5px 10px;
        }

        .blue {
          color: blue;
        }

        .green {
          color: rgb(90, 199, 37);
        }

        .popur {
          color: rgb(186, 85, 211);
        }


        .pay-intro {
          text-align: center;
          font-weight: 400;
          font-size: 16px;
          color: #3f528c;
          margin: 30px 0;
        }

        .txt-info-item {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
          font-weight: 600;

          .txt-left {
            color: #ff3b30;
            font-size: 1.17em;
          }

          .txt {
            font-size: 33px;
            color: rgb(255, 0, 255);
            // margin-left: 5px;
          }

          // .copy-btn {}

        }
      }

      .submit-info-item {
        display: flex;
        // align-items: center;
        // justify-content: center;

        ::v-deep .el-upload--picture-card {
          width: auto;
          height: auto;
          padding: 0 20px;
          border: none;
          line-height: 0;
          background-color: transparent;
          box-shadow: none;
        }

        .trigger {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          text-align: center;
          border: 1px solid #eee;
        }
      }

      .btn-info {
        // display: flex;
        // width: 100%;
        // justify-content: center;
        text-align: center;

        .btn-info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }

      .bank-box {
        display: flex;
        flex-wrap: wrap;
      }

      .pay-course {
        margin-top: 20px;

        .title-box {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 15px 0px;
          border-bottom: 1px solid #eee;

          .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            width: 145px;
            height: 30px;
            background-color: #115cd8;
            color: #fff;
          }
        }


      }
    }
  }
}

.pay-course {
  .title {
    text-align: left;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
.pay-course {
  blockquote {
    background-color: var(--w-e-textarea-slight-bg-color);
    border-left: 8px solid var(--w-e-textarea-selected-border-color);
    display: block;
    font-size: 100%;
    line-height: 1.5;
    margin: 10px 0;
    padding: 10px;
  }
}

.rich-content {
  // background-color: red;
  // overflow: hidden;

  video,
  img {
    max-width: 100%;
  }

  ul {
    padding-left: 20px;
  }

  // color: #fc5449;
  // font-weight: 600;
  // padding: 10px;
  // line-height: 1.5;

  // .item {
  //   padding-left: 13px;
  // }
  // .item:before {
  //   content: ' ● ';
  //   margin-left: -13px;
  // }
}


@keyframes left-move {
  0% {
    transform: translate(-50%, -50%);
  }

  100% {
    transform: translate(0, 0);
  }
}

@keyframes right-move {
  0% {
    transform: translate(50%, -50%);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>
