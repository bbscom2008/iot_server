<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="payinfo-box-1">
            <div class="logo-box" style="padding-top: 7rem">
              <div class="logo">
                <img
                  style="height: 17.33rem"
                  src="@/assets/img_bank/douyin.png"
                  fit="cover"
                  title="logo"
                />

                <!-- <img
                  v-loading="logoIconUrl == ''"
                  style="height: 17.33rem"
                  :src="logoIconUrl"
                  title="logo"
                  fit="cover"
                /> -->
              </div>
            </div>

            <div class="order-money-box">
              <div class="order-money">￥{{ orderMoneyOrange }}</div>
              <!-- <i
                class="el-icon-copy-document btn-copy-1"
                @click="
                  (e) => {
                    copyInfo(e, String(orderMoneyOrange));
                  }
                "
              ></i> -->
            </div>

            <div
              class="cutdowntime"
              style="font-size: 3.7333rem; font-weight: 600"
            >
              <span>支付倒计时 ：</span>
              <span class="time">{{ cutdownMinutes }}分</span>
              <span class="time">{{ cutdownSeconds }}秒</span>
            </div>

            <!-- 文本信息卡片 -->

            <!-- 提交信息卡片 -->

            <div class="payinfo-box">
              <!-- 按钮信息卡片 -->
              <div class="btns card" v-if="buttonConfigInfo.buttons.length > 0">
                <div v-for="info in buttonConfigInfo.buttons" :key="info.id">
                  <div
                    class="btn-info-item"
                    style="text-align: center; margin-top: 3rem"
                  >
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
                      v-if="info.showType == 0 || info.showType == 2"
                      @click="(e) => btnClick(info)"
                      type="primary"
                      style="
                        width: 70rem;
                        margin-bottom: 2.67rem;
                        background-color: #2368f4;
                      "
                      >{{ info.buttonTitle }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- 跳转失败提示 -->
            <div class="red-tip" style="margin-top: 15px">
              如果跳转失败，请截屏保存抖音码，打开抖音APP扫码
            </div>

            <div
              class="red-tip"
              v-if="
                baseInfo.isShowTransferRemark &&
                baseInfo.transferRemarkTitle &&
                remarkContent
              "
            >
              <span class="txt-left">{{ baseInfo.transferRemarkTitle }}：</span>
              <span class="txt-right">
                <span style="margin-right: 2.67rem">{{ remarkContent }}</span>
                <span
                  class="text-btn"
                  @click="
                    (e) => {
                      copyInfo(e, remarkContent);
                    }
                  "
                >
                  复制
                </span></span
              >
            </div>

            <!-- 二维码卡片 -->
            <div class="qrcode card" v-if="qrConfig && qrConfig.qrUrl">
              <div style="display:flex; justify-content: center;" class="box" 
               >
                <div class="img-wrap" style="width: 70%;" >
                  <!-- 系统解析后的二维码， -->
                  <MyQrCode v-if="qrConfig.isActive == 1" :value="qrConfig.parseValue" ></MyQrCode>
                  <!-- 原图 -->
                  <el-image v-else :src="qrConfig.qrUrl" alt="" style="width: 260px" />
                </div>
              </div>
            </div>


            <div class="red-tip" style="margin-top: 30px" v-if="baseInfo.paymentTutorialUrl">
              <div
                class="rich-content"
                v-html="baseInfo.paymentTutorialUrl"
              ></div>
              <!-- <div v-else>
                <h3 class="tutorial-title">充值教程：</h3>
                <div class="tutorial-list">
                  <div>
                    1.进入抖音客服个人主页，点击“+关注”，等待1分钟左右客服回关。
                  </div>
                  <div>2.点击“私信”，复制上方“口令”发送给客服。</div>
                  <div>
                    3.点击聊天界面右下角“+”号，选择红包，发送红包总金额为订单金额，切勿少付多付！
                  </div>
                  <div>4.订单一次性有效，再次充值请重新发起订单！</div>
                  <div>
                    5.只支付给订单对应的抖音号，如有人私聊你让发红包上分，一律都是骗子，损失自行承担！
                  </div>
                </div>
              </div> -->
            </div>

            <!-- <div class="red-tip">
              <img style="width: 260px;" src="@/assets/img/douyin2.png" alt="">
            </div> -->
          </div>
        </div>
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
        height: 20.8rem;
        border-radius: 5.6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2.13rem 9.33rem;
      }

      .payinfo-box-1 {
        background-color: #fff;
        margin-inline: 2.33rem;
        padding-bottom: 30px;
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
          color: #333;

          .time {
            color: #dc1434;
            font-weight: 600;
          }
        }

        .txt-info-item {
          padding: 2.67rem;
          border-radius: 2.6667rem;
          margin-top: 4rem;

          .txt-right {
            font-weight: 600;
            margin: 2.6667rem 0;
            text-align: center;
          }
        }

        .warning {
          text-align: center;
          font-size: 3.7333rem;
          font-weight: 600;
          color: red;
          padding: 5.3333rem;
        }
      }

      .btn-info {
        text-align: center;
      }
    }
  }
}

.red-tip {
  text-align: center;
  font-size: 16px;
  margin: 0 20px;
  color: #dc1434;
  margin-bottom: 20px;
  font-weight: 600;
  .text-btn {
    background-color: #dc1434;
    color: white;
    padding: 5px;
    border-radius: 6px;
  }
}

.tutorial-title {
  text-align: left;
  margin-bottom: 10px;
}
.tutorial-list {
  text-align: left;
  line-height: 1.8;
}
.tutorial-list {
  // padding-left: 20px;
  & > div {
    margin-bottom: 8px;
  }
}
</style>
