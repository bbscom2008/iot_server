<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="logo-box">
            <div class="logo">
             
              <el-image v-loading="logoIconUrl == ''"  class="img" :src="logoIconUrl"
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

                
              </el-form>
            </div>

            

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

            

            <div class="card pay-course payinfo-box"  style="padding: 0 15px;"  v-if="baseInfo.paymentTutorialUrl.length > 0">
              <div class="title-box">
                <div class="title">注意事项</div>
              </div>

              <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
            </div>

            <div class="service card" v-if="baseInfo.isOnlineService" style="margin-top:15px;">
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="success" style="width: 30%; margin-bottom: 10px">在线客服</el-button>
                </div>
              </div>
            </div>

          </div>


          <div class="mt-20 div-comp "  v-if="componentsConfig.components"  >
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
    font-size:16px;
  }

  .preview {
    width: 100vw;
    // height: 400px;
    min-height: 100vh;
    background-color: #f1f1f1;
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

      .div-comp{
        margin-left: 15px;
        margin-right: 15px;
      }

      .logo-box {
        width: 100%;
        height: 150px;
        background-color: #49a1ff;
        // border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: center;
        // align-items: center;
        // padding-top: 11px;
      

        .logo {
          height: 78px;
          // background-color: #ffffffe5;
          border-radius: 21px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 35px;

          .img {
           height: 35px;
           width:35px;

          }

          .title {
            font-size: 22px;
            margin-left: 10px;
            color: #fff;
          }
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
            margin-left: -130px;

            img {
              animation: left-move .5s infinite alternate;
            }
          }

          .arrow.right {
            margin-left: 130px;

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
