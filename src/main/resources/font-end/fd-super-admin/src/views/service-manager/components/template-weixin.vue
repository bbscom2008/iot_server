<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="logo-box">
            <span class="title">微信支付</span>
            <img :src="require('@/assets/img/duigou.png')" alt="" />
          </div>

          <div class="payinfo-box">
            <!-- 基础信息卡片 -->

            <div class="tishi">请按此金额复制支付！转错金额会导致支付失败！</div>

            <!-- 二维码卡片 -->
            <div class="qrcode card" v-if="qrConfig.isActive && qrConfig.qrUrl">
              <div style="text-align: center" class="box">
                <span class="up-txt">推荐使用微信支付</span>
                <div class="img-wrap">
                  <img :src="qrConfig.qrUrl" alt="" />
                </div>
                <div class="down-txt">打开微信扫一扫</div>
              </div>
            </div>

            <div class="money-out-box">
              <div class="order-money-box">
                <div class="order-money">￥{{ orderMoney }}</div>
                <el-button type="danger" round plain icon="el-icon-document-copy" class="copy-order-money" @click="
                  (e) => {
                    copyInfo(e, orderMoney)
                  }
                ">复制</el-button>
              </div>

              <div class="cutdowntime">
                <div>付款倒计时：</div>
                <span class="time">{{ cutdownHours }}</span><i>:</i><span class="time">{{ cutdownMinutes }}</span>
                <i>:</i>
                <span class="time">{{ cutdownSeconds }}</span>
              </div>

              <!-- <div class="cutdowntime">
                <div>收款人姓名：</div>
                <div style="color: black">李小龙</div>
              </div> -->

              <div class="cutdowntime" v-if="baseInfo.isShowTransferRemark">
                <div>{{ baseInfo.transferRemarkTitle }}：</div>
                <div style="color: black">
                  <span style="margin-right: 10px">{{ remarkContent }}</span>
                  <el-button type="text" @click="
                    (e) => {
                      copyInfo(e, remarkContent)
                    }
                  ">复制</el-button>
                </div>
              </div>

              <div class="cutdowntime" v-if="baseInfo.isShowMerchantOrderNo">
                <div>订单号：</div>
                <div style="color: black">
                  <span style="margin-right: 20px">{{ orderNum }}</span>
                  <el-button type="text" @click="
                    (e) => {
                      copyInfo(e, orderNum)
                    }
                  ">复制</el-button>
                </div>
              </div>



              <div class="btn-box">
                <div class="btn-launch">启动微信</div>
              </div>
            </div>

            <!-- <div class="text-info card" style="margin-top: 15px">
                <div class="txt-info-item" v-if="baseInfo.isShowTransferRemark">
                  <span class="txt-left">{{ baseInfo.transferRemarkTitle }}：</span>
                  <span class="txt-right">
                    <span style="margin-right: 10px">{{ remarkContent }}</span>
                    <el-button
                      type="text"
                      @click="
                        (e) => {
                          copyInfo(e, remarkContent)
                        }
                      "
                      >复制</el-button
                    ></span
                  >
                </div>
                <div class="txt-info-item" v-if="baseInfo.isShowMerchantOrderNo">
                  <span class="txt-left"> 订单号：</span>
                  <span class="txt-right">
                    <span style="margin-right: 20px">{{ orderNum }}</span>
                    <el-button
                      type="text"
                      @click="
                        (e) => {
                          copyInfo(e, orderNum)
                        }
                      "
                      >复制</el-button
                    >
                  </span>
                </div>
              </div> -->

            <!-- <div class="pay-intro">
              支付说明：使用支付宝扫码，直接完成支付或者截屏保存二维码，打开支付宝扫一扫，点击相册选择截图二维码，完成支付
            </div> -->

            <!-- <div class="hr"></div> -->

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
                  <el-form-item v-if="info.showType == 0" :label="info.submitTitle"
                    :prop="`submitConfigs[${index}].textValue`" :rules="info.checkType == 0
                        ? []
                        : [
                          {
                            required: true,
                            message: '请输入' + info.submitTitle,
                            trigger: 'blur'
                          },
                   
                        ]
                      ">
                    <el-input v-model="info.textValue" :placeholder="'请输入' + info.submitTitle"></el-input>
                  </el-form-item>
                </div>
                <div style="text-align: center">
                  <el-button type="primary" @click="onBtnSubmit">提交信息</el-button>
                </div>
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

            <div class="hr"></div>

            <div class="service card" style="padding: 15px" v-if="baseInfo.isOnlineService">
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="primary" style="width: 30%; margin-bottom: 10px">在线客服</el-button>
                </div>
              </div>
            </div>

            <div class="card pay-course payinfo-box" v-if="baseInfo.paymentTutorialUrl.length > 0">
              <div class="zhuyi-box">
                <div class="zhuyi">
                  <span>付款注意事项</span>
                  <i class="mt-5">必须阅读后再付款，否则后果自负！</i>
                </div>
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
  name: 'TemplateWeiXin',
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
    background-color: #f1f1f1;
    padding-bottom: 30px;

    .tip {
      text-align: center;
    }

    .main {
      width: 400px;
      max-width: 100vw;
      // min-width: 400px;
      margin: 0 auto;
      // background-color: #fff;
      padding-bottom: 20px;
      color: #2b3674;
      background: linear-gradient(to bottom,
          #0de1a5 0px,
          /* 接近30px处仍为天蓝色 */
          #11d3b3 99px,
          /* 30px处突然变为蓝色 */
          white 200px
          /* 60px处突然变为白色 */
        );

      // .card {
        // border-top: 1px solid #eee;
        // padding: 20px;
      // }

      .logo-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 85px;
        padding: 0px 50px;
        // background-image: linear-gradient(to bottom, #0de1a5, #11d3b3);
      }

      img {
        width: 76px;
        height: 76px;
      }

      .title {
        font-size: 35px;
        color: #fff;
      }

      .payinfo-box {
        background: linear-gradient(to bottom,
            #caf5ef 10px,
            /* 接近30px处仍为天蓝色 */
            #adeee6 40px,
            /* 30px处突然变为蓝色 */
            white 100px
            /* 60px处突然变为白色 */
          );
        padding: 10px;
        border-radius: 30px 30px 0 0;

        .tishi {
          // background-color: #ff3b3014;
          height: 30px;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 14px;
        }

        .qrcode.card {
          width: 260px;
          // background-color: #1777ff;
          margin: 10px auto 0;
          padding: 15px 15px 0;
          border-radius: 30px 30px 0 0;
          // border: 1px solid #0084ff;;
          border: 1px solid #10d8ae;
          border-bottom: none;

          .box {
            background-color: #22ab38;
            border-radius: 15px 15px 0 0;
            padding: 30px 0 20px;

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
              width: 160px;
              height: 160px;
              background-color: #fff;
              padding: 10px 10px;
              margin-top: 5px;
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

        .money-out-box {
          border: 1px solid #22ab38;
          border-radius: 20px;
          padding-top: 20px;
          background-color: #eafffb;

          .order-money-box {
            display: flex;
            justify-content: center;
            align-items: center;

            ::v-deep .el-button--danger.is-plain {
              color: #22ab38;
              background: transparent;
              border-color: #22ab38;
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

        .cutdowntime {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
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
            padding: 5px 8px;
            border-radius: 4px;
            background-color: #ff3b30;
            color: #fff;
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
          padding: 10px 15px;
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
        border: 1px solid #10d8ae;
        padding: 10px;
        border-radius: 20px;
        background-color: #eafffb;
        position: relative;
        margin-top: 30px;
        padding-top: 30px;

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
            background-color: #22ab38;
            color: #fff;
            border-radius: 30px;

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
