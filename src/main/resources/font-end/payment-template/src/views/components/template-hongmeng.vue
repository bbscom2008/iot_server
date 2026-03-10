<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="payinfo-box-1" style="padding-bottom: 0">
            <div class="logo-box">
              <div class="logo">
                <img
                  style="height: 9.33rem"
                  src="@/assets/img_bank/alipay3.png"
                  fit="cover"
                  title="logo"
                />
                <!-- <img style="height: 9.33rem;" :src="qrConfig.qrUrl" alt="" /> -->
                <!-- <span class="title">待付款</span> -->
              </div>
            </div>

            <div
              class="card pay-course payinfo-box mt-10"
              v-if="baseInfo.paymentTutorialUrl.length > 0"
            >
              <div
                class="rich-content"
                v-html="baseInfo.paymentTutorialUrl"
              ></div>
            </div>

            <!-- 二维码卡片 -->
            <div class="qrcode card" v-if="qrConfig && qrConfig.qrUrl">
              <div style="display: flex; justify-content: center;padding: 20px;" class="box">
                <div class="img-wrap" style="width: 70%;" >
                  <!-- 系统解析后的二维码， -->
                  <MyQrCode v-if="qrConfig.isActive == 1" :value="qrConfig.parseValue" ></MyQrCode>
                  <!-- 原图 -->
                  <el-image v-else :src="qrConfig.qrUrl" alt="" style="width: 260px" />
                </div>
              </div>
            </div>

            <div
              class="cutdowntime"
              style="font-size: 3.7333rem; font-weight: 600; color: green"
            >
              <span>支付倒计时:</span>
              <span>{{ cutdownMinutes }}分</span>
              <span>{{ cutdownSeconds }}秒</span>
            </div>

            <div class="txt-order-no" v-if="baseInfo.isShowMerchantOrderNo">
              <div style="text-align: center; font-weight: 600; color: #999; font-size: 12px;">
                <span>订单号：{{ orderNum }}</span>
                <i
                  class="el-icon-copy-document btn-copy-1"
                  @click="
                    (e) => {
                      copyInfo(e, orderNum);
                    }
                  "
                ></i>
              </div>
            </div>

            <div class="txt-info-item">
              <div class="txt-1">金额</div>
              <div class="txt-2">￥{{ orderMoneyOrange }}</div>
              <div class="txt-3"
                  @click="
                    (e) => {
                      copyInfo(e, String(orderMoneyOrange));
                    }
                  "
                  >点击复制
              </div>
            </div>

            <!-- 文本信息卡片 -->
            <template  v-if="textConfigInfo.texts.length > 0">
              <div v-for="info in textConfigInfo.texts" :key="info.sort">
                <div class="txt-info-item">
                  <div class="txt-1">{{ info.textTitle }}</div>
                  <div class="txt-2">{{ info.textValue }}</div>
                  <div class="txt-3"
                      @click="
                        (e) => {
                          copyInfo(e, info.textValue);
                        }
                      "
                      >点击复制
                  </div>
                </div>
              </div>
            </template>

            <template v-if="!isSecondQr()">
              <!-- 按钮信息卡片 -->
              <div class="btns" v-if="buttonConfigInfo.buttons.length > 0">
                <div
                  class="btn-info"
                  v-for="info in buttonConfigInfo.buttons"
                  :key="info.id"
                >
                  <div class="btn-info-item">
                    <div
                      v-if="info.showType == 1 || info.showType == 2"
                      class="img-box"
                    >
                      <MyQrCode :value="info.resultButtonUrl"></MyQrCode>

                      <span
                        style="color: red; font-size: 2.67rem; margin: 2.13rem"
                        >{{ info.buttonTitle }}</span
                      >
                    </div>

                    <el-button
                      class="btn"
                      v-if="info.showType == 0 || info.showType == 2"
                      @click="(e) => btnClick(info)"
                      type="primary"
                      >{{ info.buttonTitle }}</el-button
                    >
                  </div>
                </div>
              </div>
            </template>


            <div class="tip">
              支付说明：可以直接点击，启动支付宝APP支付，或者使用支付宝扫码，直接完成支付，或者截屏保存二维码，打开支付宝扫一扫，点击相册选择截图二维码，完成支付
            </div>

            <!-- 提交信息卡片 -->

            <!-- 按钮信息卡片 -->

            <!-- 银行组件卡片  -->

            <div
              class="service card"
              v-if="baseInfo.isOnlineService"
              style="margin-top: 4rem"
            >
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button
                    type="success"
                    style="width: 30%; margin-bottom: 2.67rem"
                    @click="openChat()"
                    >在线客服</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";

import { submitPopupInfo } from "@/api/template-create.js";

export default {
  name: "TemplateDefault",
  mixins: [template],
  data() {
    return {
      submit_visiual: false,
      submitForm: {
        submitValue: "",
      },
      info_dialog_visiual: false,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
::v-deep .custom-dialog-footer {
  padding: 0 3.2rem 4rem;
}

::v-deep .custom-button {
  background-color: #09aaff;
  color: white;
}

.container {
  width: 100%;
  background-color: white;
  font-size: 3.73rem;

  .body {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }

  .preview {
    width: 100vw;
    background-color: #f8f8f8;
    padding-bottom: 8rem;

    .tip {
      text-align: center;
    }

    .main {
      width: 100rem;
      margin: 0 auto;
      padding-bottom: 5.33rem;
      background-color: #f1f1f1;
      color: #2b3674;

      .qr-box {
        .qr {
          width: 53.3333rem;
          margin: 5.3333rem auto;
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
        border-radius: 5.6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 6rem 9.33rem 0;
      }

      .payinfo-box-1 {
        background-color: #fff;
        margin-inline: 2.33rem;

        .btn-copy-1 {
          color: rgb(73, 161, 255);
          font-size: 4.07rem;
          margin-left: 2rem;
          font-weight: 600;
        }

        .order-money-box {
          padding: 2.6667rem 0;
          display: flex;
          justify-content: center;
          align-items: center;

          .order-money {
            color: #000;
            font-weight: bold;
            font-size: 8rem;
          }
        }

        .cutdowntime {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 3.7333rem;

          .time {
            color: #09aaff;
            font-weight: 600;
          }
        }

        .txt-info-item {
          display: flex;
          justify-content: space-evenly;
          background-color: #f5f5f5;
          align-items: center;
          margin: 2rem  4rem ;
          height: 40px;
          .txt-1{
            color: #999;
            font-weight: 600;
          }
          .txt-2{
            color: red;
            font-weight: 600;
          }
          .txt-3{
            background-color: #7d7d7d;
            color: white;
            font-size: 10px;
            padding: 5px;
            border-radius: 5px;
          }
        }

        .warning {
          text-align: center;
          font-size: 3.7333rem;
          font-weight: 600;
          color: red;
          padding: 5.3333rem;
        }

        .tip {
          padding: 2.3333rem 5.3333rem 10.6667rem;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      }

      ::v-deep .btn-info-item{
        text-align: center;
        .btn{
          padding: 8px 30px;
        }
      }
    }
  }
}
</style>
