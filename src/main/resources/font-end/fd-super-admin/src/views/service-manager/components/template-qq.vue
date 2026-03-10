<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="logo-box">
            <!-- <span class="title">QQ</span> -->
            <img class="qq-img" :src="require('@/assets/img/qq.png')" alt="" />
          </div>

          <div class="payinfo-box">

            <div class="money-out-box">
              <div class="order-money-box">
                <div class="order-money">￥{{ orderMoney }}</div>
                <el-button type="danger" round plain class="copy-order-money" @click="
                  (e) => {
                    copyInfo(e, orderMoney)
                  }
                ">复制</el-button>
              </div>

              <div class="cutdowntime" style="padding:10px 0;">
                <div>付款倒计时：</div>
                <span class="time" v-if="cutdownHours != '00'">{{ cutdownHours }}时</span>
                <span class="time">{{ cutdownMinutes }}分</span>
                <span class="time">{{ cutdownSeconds }}秒</span>
              </div>



              <!-- <div class="hr" ></div> -->
              <!-- <div class="tishi">进去后输入口令，等待指示在支付 请在有效时间内按照上方订单金额支付，此码只能付款一次，如超时支付/重复支付/付错金额导致无法到账，损失自己承担，平台概不负责！</div> -->

              <div class="card pay-course payinfo-box" v-if="baseInfo.paymentTutorialUrl.length > 0">
                <!-- <div class="zhuyi-box">
                  <div class="zhuyi">
                    <span>付款注意事项</span>
                    <i class="mt-5">必须阅读后再付款，否则后果自负！</i>
                  </div>
                </div> -->

                <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
              </div>



              <div class="txt-info-item mt-20 " v-if="baseInfo.isShowTransferRemark">
                <div class="txt-left">{{ baseInfo.transferRemarkTitle }}：</div>
                <div style="color: black" class="txt-right">
                  <span style="margin-right: 10px">{{ remarkContent }}</span>
                  <el-button icon="el-icon-document-copy" size="mini" @click="
                    (e) => {
                      copyInfo(e, remarkContent)
                    }
                  ">复制</el-button>
                </div>
              </div>

              <div class="txt-info-item" v-if="baseInfo.isShowMerchantOrderNo">
                <div class="txt-left">订单号：</div>
                <div style="color: black" class="txt-right">
                  <span style="margin-right: 20px">{{ orderNum }}</span>
                  <el-button icon="el-icon-document-copy" size="mini" @click="
                    (e) => {
                      copyInfo(e, orderNum)
                    }
                  ">复制</el-button>
                </div>
              </div>

              <div class="text-info-item" v-if="textConfigInfo.texts.length > 0">
                <div class="txt-info-item" v-for="info in textConfigInfo.texts" :key="info.sort">
                  <span v-if="info.textTitle.length > 0" class="txt-left">{{ info.textTitle }}：
                  </span>
                  <span class="txt-right"><span style="margin-right: 20px">{{ info.textValue }}</span>
                    <el-button icon="el-icon-document-copy" size="mini" @click="
                      (e) => {
                        copyInfo(e, info.textValue);
                      }
                    ">复制</el-button></span>
                </div>
              </div>


            </div>

            <div class="hr"></div>

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
                  <el-button type="danger" @click="onBtnSubmit">提交信息</el-button>
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

              <div class="jiep ">
                【截屏后】点击启动QQ付款
              </div>
              <div class="qrcode card" v-if="qrConfig.isActive && qrConfig.qrUrl">
                <div style="text-align: center" class="box">
                  <div class="img-wrap">
                    <img :src="qrConfig.qrUrl" alt="" />
                  </div>
                </div>
              </div>

              <div style="text-align: center;" class="mt-20">
                <img src="@/assets/img/qq-step.png" alt="" style="height:94px;" />
              </div>

            </div>

            <div class="service card" style="padding: 15px" v-if="baseInfo.isOnlineService">
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="danger" style="width: 30%; margin-bottom: 10px">在线客服</el-button>
                </div>
              </div>
            </div>


          </div>

          <!-- <div class="payinfo-box mt-10 " v-if="componentsConfig.components.length > 0"> -->
            <!-- 银行组件卡片 -->
            <!-- <div class="bank-comp card" v-if="componentsConfig.components.length > 0">

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

            <!-- <div class="card pay-course payinfo-box" v-if="baseInfo.paymentTutorialUrl.length > 0">
              <div class="zhuyi-box">
                <div class="zhuyi">
                  <span>付款注意事项</span>
                  <i class="mt-5">必须阅读后再付款，否则后果自负！</i>
                </div>
              </div>

              <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
            </div> -->
          <!-- </div> -->

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
  name: 'TemplateQQ',
  mixins: [template]
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
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
      width: 400px;
      max-width: 100vw;
      // min-width: 400px;
      margin: 0 auto;
      padding: 0 10px;
      // background-color: #fff;
      padding-bottom: 20px;
      color: #2b3674;
      background: linear-gradient(to bottom,
          #f43e3e 10px,
          /* 接近30px处仍为天蓝色 */
          #f43e3e 80px,
          /* 30px处突然变为蓝色 */
          #f1f1f1 168px
          /* 60px处突然变为白色 */
        );

      // .card {
        // border-top: 1px solid #eee;
        // padding: 20px;
      // }

      .logo-box {
        display: flex;
        justify-content: center;
        // align-items: center;
        height: 85px;
        padding: 0px 50px;
        // background-image: linear-gradient(to bottom, #0de1a5, #11d3b3);
      }

      .qq-img {
        width: 247px;
        height: 68px;
      }

      .title {
        font-size: 35px;
        color: #fff;
      }

      .payinfo-box {
        // background: linear-gradient(
        //   to bottom,
        //   #f43e3e 10px,
        //   /* 接近30px处仍为天蓝色 */ #f43e3e 40px,
        //   /* 30px处突然变为蓝色 */ white 100px /* 60px处突然变为白色 */
        // );
        padding: 10px;
        border-radius: 12px;
        background-color: #fff;

        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12), 0 4px 16px 0 rgba(0, 0, 0, 0.08);

        .money-out-box {
          // border: 1px solid #22ab38;
          // border-radius: 20px;
          // padding-top: 20px;
          // background-color: #eafffb;

          .order-money-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;

            ::v-deep .el-button--danger.is-plain {
              color: #FFF;
              background: #f43e3e;
              border-color: #f43e3e;
            }

            .order-money {
              color: #000;
              font-weight: bold;
              font-size: 40px;
            }

            .copy-order-money {
              height: 26px;
              line-height: 16px;
              padding: 3px 10px !important;
              margin-left: 10px;
            }
          }

          .btn-box {
            display: flex;
            justify-content: center;
            padding: 15px;

            .btn-launch {
              display: flex;
              cursor: pointer;
              justify-content: center;
              align-items: center;
              color: #fff;
              font-size: 16px;
              width: 192px;
              height: 34px;
              border-radius: 17px;
              background-color: #09b29e;
            }
          }
        }


        .tishi {
          background-color: #ff3b3014;
          // height: 30px;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #f43e3e;
          font-size: 14px;
          text-align: center;
          line-height: 1.5;
          font-weight: 700;
        }

        .qrcode.card {
          width: 260px;
          // background-color: #1777ff;
          margin: 10px auto 0;
          // padding: 15px 15px 0;
          // border-radius: 30px 30px 0 0;
          // border: 1px solid #0084ff;;
          // border: 1px solid #10d8ae;
          border-bottom: none;

          .box {
            // background-color: #22ab38;
            // border-radius: 15px 15px 0 0;
            // padding: 30px 0 20px;

            span {
              color: #fff;
            }

            .up-txt {
              font-weight: 600;
              font-size: 18px;
            }

            .down-txt {
              font-size: 14px;
              margin-top: 15px;
              color: #fff;
            }

            .img-wrap {
              width: 200px;
              height: 200px;
              background-color: #fff;
              // padding: 10px 10px;
              margin-top: 15px;
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 3px;
            }

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
        }



        .cutdowntime {
          display: flex;
          justify-content: center;
          align-items: center;
          // padding: 5px 10px;
          color: #909090;
          font-size: 16px;

          div {
            font-weight: 600;
          }

          i {
            color: #0084ff;
            margin: 0 5px;
            font-weight: bold;
          }

          .time {
            // padding: 5px 8px;
            // border-radius: 4px;
            // background-color: #ff3b30;
            font-weight: 600;
            color: #FF3B30;
          }
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
          justify-content: space-between;
          align-items: center;
          padding: 6px 15px;
          color: #929292;


          ::v-deep .el-button--small {
            padding: 5px 6px;
            border-radius: 12px;
            color: #929292;
            // background-color: #f2f2f2;
            border-color: #929292;
            font-size: 10px;
          }


        }

        .jiep {
          width: 261px;
          height: 46px;
          border-radius: 5px;
          background-color: #f43e3e;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          text-align: center;
          line-height: 46px;
          margin: 20px auto;
        }


      }

      .submit-info {
        // margin-top:20px;
        padding: 20px;
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
        // margin-top:20px;
        // border: 1px solid #10d8ae;
        padding: 10px;
        border-radius: 20px;
        background-color: #fff0ef;
        position: relative;

        // margin-top: 30px;
        // padding-top: 30px;
        .zhuyi-box {
          position: absolute;
          top: 0px;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #eee;

          .zhuyi {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 280px;
            height: 61px;
            background-color: #f43e3e;
            color: #fff;
            border-radius: 30px;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12), 0 4px 16px 0 rgba(0, 0, 0, 0.08);

            span {
              font-size: 16px;
              font-weight: bold;
            }
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
</style>
