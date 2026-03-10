<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="payinfo-box-1" style="padding-bottom: 0">
            <div class="step">
              <div class="steps-container">
                <div class="step-item active">
                  <div class="step-circle">
                    <div class="step-icon"></div>
                  </div>
                  <div class="step-label">填入金额</div>
                </div>
                <div class="step-line active"></div>
                <div class="step-item active">
                  <div class="step-circle">
                    <div class="step-icon"></div>
                  </div>
                  <div class="step-label">选择付款</div>
                </div>
                <div class="step-line"></div>
                <div class="step-item">
                  <div class="step-circle">
                    <div class="step-icon"></div>
                  </div>
                  <div class="step-label">等待到账</div>
                </div>
              </div>
            </div>

            <div class="order-money-box">
              <div class="order-money">{{ orderMoneyOrange }}</div>
              <i
                class="el-icon-copy-document btn-copy-1"
                @click="
                  (e) => {
                    copyInfo(e, orderMoneyOrange);
                  }
                "
              ></i>
            </div>

            <div class="cutdowntime">
              <span>请在</span>
              <span class="time">{{ cutdownMinutes }}:</span>
              <span class="time">{{ cutdownSeconds }}s</span>
              <span>内完成支付</span>
            </div>

            <div class="tip">
              成功付款后，请及时 <span class="red">发送电子回单到邮箱!</span>
            </div>

            <div class="qrcode card">
              <div class="img-wrap" style="padding-top: 15px">
                <!-- <el-image :src="qrConfig.qrUrl" /> -->
                <!-- 系统解析后的二维码， -->
                <MyQrCode
                  v-if="qrConfig.isShow == 1"
                  :value="qrConfig.parseValue"
                ></MyQrCode>
                <!-- 原图 -->
                <el-image
                  v-else
                  :src="qrConfig.qrUrl"
                  alt=""
                  style="width: 260px"
                />
              </div>
            </div>

            <div class="txt-tip">付款5分钟后如未到账，请及时联系客服处理</div>

            <!-- 文本信息卡片 -->
            <div class="text-info card" v-if="textConfigInfo.texts.length > 0">
              <div v-for="info in textConfigInfo.texts" :key="info.sort">
                <div class="txt-info-item" v-if="info.isShow">
                  <div class="txt-left">
                    <span style="margin-left: 10.0001px">{{
                      info.textTitle
                    }}</span>
                  </div>
                  <span class="txt-right"
                    ><span
                      style="word-wrap: break-word; letter-spacing: -0.6px"
                      >{{ info.textValue }}</span
                    >
                  </span>
                  <i
                    @click="
                      (e) => {
                        copyInfo(e, info.textValue);
                      }
                    "
                  >
                    <svg-icon icon-class="copy"></svg-icon>
                  </i>
                </div>
                <div
                  class="tip-email"
                  v-if="info.isShow && info.textValue.includes('@')"
                >
                  （请发送电子回单）
                </div>
              </div>

              <div class="txt-info-item">
                <div class="txt-left">
                  <span style="margin-left: 10.0001px">转账金额</span>
                </div>
                <span class="txt-right"
                  ><span
                    style="word-wrap: break-word; letter-spacing: -0.6px"
                    >{{ orderMoneyOrange }}</span
                  >
                </span>
                <i
                  @click="
                    (e) => {
                      copyInfo(e, orderMoneyOrange);
                    }
                  "
                >
                  <svg-icon icon-class="copy"></svg-icon>
                </i>
              </div>
              <div class="money-tip">
                <div class="item">转账金额勿必与订单金额一致</div>
                <div class="item" style="border-radius: 15px">
                  <svg-icon icon-class="link" style="margin-right: 4.9875px">
                  </svg-icon>
                  立即转账
                </div>
              </div>

              <div class="txt-info-item">
                <div class="txt-left">
                  <span style="margin-left: 10.0001px">发送回执</span>
                </div>
                <span class="txt-right"
                  ><span
                    style="color: #2c3c78"
                    @click.stop="dialogVisible1 = true"
                    >前往查看教程</span
                  >
                </span>
                <i> </i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="answers">
        <el-dialog :visible.sync="dialogVisible1" width="100%">
          <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";

export default {
  name: "TemplateDefault",
  mixins: [template],
  data() {
    return {
      dialogVisible1: false,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  background-color: white;
  font-size: 13.9875px;

  .answers {
    ::v-deep .custom-dialog-header {
      padding-bottom: 0;
    }
    .title {
      font-weight: 600;
      color: #000;
      margin: 2.6667rem;
    }
    p {
      margin: 2.6667rem;
      line-height: 1.8;
      text-indent: 2em;
      word-break: normal;
    }

    a,
    a:hover,
    a:active {
      color: #115cd8;
    }
  }

  .body {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }

  .preview {
    width: 100vw;
    background-color: #f8f8f8;
    padding-bottom: 30px;

    .main {
      width: 375px;
      margin: 0 auto;
      padding-bottom: 19.9875px;
      background-color: #f1f1f1;
      color: #2b3674;
      font-size: 12px;
    }

    .qr {
      width: 199.9999px;
      margin: 19.9999px auto;
      position: relative;
    }
  }

  .logo-box {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
  }

  .logo {
    height: 78px;
    border-radius: 21px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 7.9875px 34.9875px;

    img {
      width: 49.9875px;
    }

    .title {
      font-size: 16.0001px;
      margin-top: 10.0001px;
      font-weight: 600;
      color: #ffaa09;
    }
  }

  .payinfo-box-1 {
    padding-top: 20px;
    background-color: #eceff6;
    margin-inline: 8.7375px;

    .step {
      display: flex;
      justify-content: center;
      padding: 20px 0;

      .steps-container {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 20px;
        max-width: 320px;

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;

          .step-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #e8e8e8;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 20px;
            color: #7c7f92;

            .step-icon {
              width: 20px;
              height: 12px;
              border-left: 3px solid #fff;
              border-bottom: 3px solid #fff;
              margin-top: -7px;
              transform: rotate(-45deg);
            }
          }

          .step-label {
            font-size: 12px;
            color: #666;
            text-align: center;
            font-weight: 500;
          }

          &.active {
            .step-circle {
              background-color: #232a82;
              color: #fff;

              .step-number {
                color: #fff;
              }
            }
          }
        }

        .step-line {
          flex: 0 1 auto;
          height: 2px;
          background-color: #7c7f92;
          margin: 0 -8px;
          width: 30px;

          &.active {
            background-color: #232a82;
          }
        }
      }
    }

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
      font-size: 15.2625px;
      margin-left: 7.5px;
      font-weight: 600;
      // padding: ;
    }

    .order-money-box {
      position: relative;
      // padding: 10.0001px 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .order-money {
        color: #000;
        font-weight: bold;
        font-size: 30px;
        // margin-right: 19.9875px;
      }

      .copy-order-money {
        height: 25.9875px;
        line-height: 16.0125px;
        padding: 3px 10.0125px !important;
        margin-left: 4.9875px;
      }
    }

    .py-1 {
      text-align: center;
      color: #ff3b30;
    }

    .qrcode.card {
      width: 80%;
      // height: 210px;
      // background-color: #1777ff;
      margin: 0px auto;
      padding-top: 4.9875px;

      img {
        width: 100%;
        display: block;
      }
    }

    .cutdowntime {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13.9999px;
      span {
        color: #333;
      }
      .time {
        color: red;
        font-weight: 600;
      }
    }

    .tip {
      text-align: center;
      margin-top: 20px;
      .red {
        color: red;
      }
    }

    .info-box {
      border-top: 0.2667rem #eee solid;
      .txt-order-no {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10.0001px;

        .txt-left {
          color: #999;
        }
      }
    }

    .pt-1 {
      text-align: center;
      color: #ff3b30;
      padding: 4.9875px 10.0125px;
    }

    .pay-intro {
      text-align: center;
      font-weight: 400;
      font-size: 16.0125px;
      color: #3f528c;
      margin: 30px 0;
    }

    .text-info {
      margin-top: 19.9875px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
    }

    .txt-tip {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 10px;
    }

    .txt-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 0.2667rem solid #eee;
      border-radius: 2.6667rem;

      .txt-left {
        color: #666;
        font-weight: 600;
        font-size: 13.9999px;
        margin: 10.0001px 0;
      }

      .txt-right {
        color: #333;
        flex: 1;
        text-align: left;
        font-weight: 600;
        margin-left: 15px;
      }
    }
    .tip-email {
      font-weight: 600;
      color: #2c3c78;
      text-align: center;
    }

    .money-tip {
      display: flex;
      padding-right: 15px;
      justify-content: flex-end;
      gap: 10px;
      align-items: center;

      font-size: 10px;

      .item {
        background-color: #212b70;
        color: #fff;
        font-weight: 600;
        padding: 8px 10px;
        border-radius: 5px;
      }
    }
  }

  .submit-info-item {
    display: flex;

    .trigger {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      text-align: center;
      border: 1.0125px solid #eee;
    }
  }

  .btn-info {
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
    margin-top: 19.9875px;

    .title-box {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10.0125px 15px 0px;
      border-bottom: 1.0125px solid #eee;

      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 16.0125px;
        width: 145.0125px;
        height: 30px;
        background-color: #115cd8;
        color: #fff;
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
    border-left: 7.9875px solid var(--w-e-textarea-selected-border-color);
    display: block;
    font-size: 100%;
    line-height: 1.5;
    margin: 10.0125px 0;
    padding: 10.0125px;
  }
}

.rich-content {
  video,
  img {
    max-width: 100%;
  }

  ul {
    padding-left: 19.9875px;
  }

  p {
    word-break: break-all;
    line-height: 1.5;
    font-size: 13.9999px;
    margin: 10.0001px 0;
  }

  a,
  a:hover,
  a:active {
    color: #4893fd;
  }

  .teacher-box {
    background-color: #fff;
    padding: 10.0001px;
  }

  .summary-box p {
    margin-left: 5.3333rem;
    text-indent: -5.3333rem;
  }
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

.btns.card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .btn-info {
    width: 50%;
    // border: .2667rem solid #f1f1f1;
    justify-self: stretch;
  }
  .img-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
      width: 80rem !important;
      height: 80rem !important;
    }
  }
}
</style>
