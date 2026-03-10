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

            <div class="tishi">
              请按此金额复制支付！转错金额会导致支付失败！
            </div>

            <!-- 二维码卡片 -->
            <div
              class="qrcode card"
            >
              <div style="text-align: center" class="box">
                <!-- <span class="up-txt">推荐使用微信支付</span> -->
                <!-- <div class="img-wrap"> -->
                  <img
                    src="@/assets/img/aliUID.png"
                    alt=""
                  />
                
                  <!-- <img src="@/assets/img/qr-code.png" alt=""> -->
                <!-- </div> -->
                <!-- <div class="down-txt">打开微信扫一扫</div> -->
              </div>
            </div>

            <div class="money-out-box">
              <div class="order-money-box">
                <div class="order-money">￥888</div>
                <el-button
                  type="danger"
                  round
                  plain
                  icon="el-icon-document-copy"
                  class="copy-order-money"
                  @click="
                    (e) => {
                      copyInfo(e, orderMoney);
                    }
                  "
                  >复制</el-button
                >
              </div>

              <div class="cutdowntime">
                <div>付款倒计时：</div>
                <span class="time">{{ cutdownHours }}</span
                ><i>:</i><span class="time">{{ cutdownMinutes }}</span>
                <i>:</i>
                <span class="time">{{ cutdownSeconds }}</span>
              </div>

              <!-- <div class="cutdowntime">
                <div>收款人姓名：</div>
                <div style="color: black">李小龙</div>
              </div> -->

              <div
                class="cutdowntime"
                v-if="
                  baseInfo.isShowTransferRemark &&
                  baseInfo.transferRemarkTitle &&
                  remarkContent
                "
              >
                <div>{{ baseInfo.transferRemarkTitle }}：</div>
                <div style="color: black">
                  <span style="margin-right: 2.67rem">{{ remarkContent }}</span>
                  <el-button
                    type="text"
                    @click="
                      (e) => {
                        copyInfo(e, remarkContent);
                      }
                    "
                    >复制</el-button
                  >
                </div>
              </div>

              <div class="cutdowntime" v-if="baseInfo.isShowMerchantOrderNo">
                <div>订单号：</div>
                <div style="color: black">
                  <span style="margin-right: 5.33rem">{{ orderNum }}</span>
                  <el-button
                    type="text"
                    @click="
                      (e) => {
                        copyInfo(e, orderNum);
                      }
                    "
                    >复制</el-button
                  >
                </div>
              </div>

              <div class="btn-box" v-if="isHaveBtn()">
                <div class="btn-launch" @click="btnClick()">
                  {{ this.btnClickUrl.buttonTitle }}
                </div>
              </div>
            </div>

            <!-- <div class="text-info card" style="margin-top: 4.00rem">
                <div class="txt-info-item" v-if="baseInfo.isShowTransferRemark">
                  <span class="txt-left">{{ baseInfo.transferRemarkTitle }}：</span>
                  <span class="txt-right">
                    <span style="margin-right: 2.67rem">{{ remarkContent }}</span>
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
                    <span style="margin-right: 5.33rem">{{ orderNum }}</span>
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
              <div
                class="txt-info-item"
                v-for="info in textConfigInfo.texts"
                :key="info.sort"
              >
                <span class="txt-left"
                  >{{ info.textTitle }}
                  <span v-if="info.textTitle.length > 0">：</span></span
                >
                <span class="txt-right"
                  ><span style="margin-right: 5.33rem">{{
                    info.textValue
                  }}</span>
                  <el-button
                    type="text"
                    @click="
                      (e) => {
                        copyInfo(e, info.textValue);
                      }
                    "
                    >复制</el-button
                  ></span
                >
              </div>
            </div>

            <!-- 提交信息卡片 -->
            <div
              class="submit-info card"
              v-if="submitConfigInfo.submitConfigs.length > 0"
            >
              <!-- <div class="hr"></div> -->
              <el-form
                ref="submitInfoRef"
                :model="submitConfigInfo"
                label-width="32.00rem"
              >
                <div
                  class="submit-info-item"
                  v-for="(info, index) in submitConfigInfo.submitConfigs"
                  :key="info.id"
                  style="margin-bottom: 2.67rem"
                >
                  <!-- 0 文本框   checkType（0-不校验、1-数值、2-中文、3、字母、4-邮箱） -->
                  <el-form-item
                    :prop="`submitConfigs.${index}.textValue`"
                    v-if="info.showType == 0"
                    :label="info.submitTitle"
                    :rules="[
                      {
                        required: true,
                        message: '请输入' + info.submitTitle,
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="info.textValue"
                      :placeholder="'请输入' + info.submitTitle"
                    ></el-input>
                  </el-form-item>

                  <!-- 1 图片上传 -->
                  <!-- :prop="`submitInfo.${index}.file`" -->
                  <!-- :prop="`submitConfigs.${index}.textValue`" -->
                  <el-form-item
                    v-if="info.showType == 1"
                    :label="info.submitTitle"
                    :rules="[
                      {
                        required: true,
                        message: '请选择' + info.submitTitle,
                        trigger: 'change',
                      },
                    ]"
                  >
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :before-upload="beforeAvatarUpload"
                      action="#"
                      :http-request="uploadImage"
                      :on-success="
                        (response, file, fileList) =>
                          handleSuccess(index, response, file, fileList)
                      "
                      :on-remove="
                        (file, fileList) => handleRemove(index, file, fileList)
                      "
                      :limit="1"
                      list-type="picture-card"
                      :auto-upload="true"
                    >
                      <div
                        class="trigger"
                        v-if="!info.fileList || info.fileList.length == 0"
                      >
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </div>
                      <div slot="help-tip" class="el-upload__tip">
                        只能上传jpg/png文件
                      </div>
                    </el-upload>
                  </el-form-item>
                </div>
                <div style="text-align: center">
                  <el-button type="primary" @click="onBtnSubmit"
                    >提交信息</el-button
                  >
                </div>
              </el-form>
            </div>

            <div class="payinfo-box-1 mt-20" v-if="!isSecondQr()">
              <!-- 按钮信息卡片 -->
              <div class="btns card" v-if="buttonConfigInfo.buttons.length > 0">
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
                      <!-- <img
                      src="@/assets/img/qr-code.png"
                      width="90"
                      class="mt-10"
                    /> -->
                      <MyQrCode :value="info.resultButtonUrl"></MyQrCode>

                      <span
                        style="color: red; font-size: 2.67rem; margin: 2.13rem"
                        >{{ info.buttonTitle }}</span
                      >
                    </div>
                    <!-- <span
                    v-if="info.showType == 2"
                    style="color: red; font-size: 2.67rem; margin: 2.13rem"
                    >点击跳转，或者 扫码跳转</span
                  > -->
                    <el-button
                      v-if="info.showType == 0 || info.showType == 2"
                      @click="(e) => btnClick(info)"
                      type="primary"
                      style="margin-bottom: 2.67rem"
                      >{{ info.buttonTitle }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              class="service card"
              style="padding: 4rem"
              v-if="baseInfo.isOnlineService"
            >
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="success" style="width: 30%; margin-bottom: 2.67rem"
                    @click="openChat()">在线客服</el-button>
                </div>
              </div>
            </div>

            <div
              class="card pay-course payinfo-box"
              v-if="baseInfo.paymentTutorialUrl.length > 0"
            >
              <div class="zhuyi-box">
                <div class="zhuyi">
                  <span>付款注意事项</span>
                  <i class="mt-5">必须阅读后再付款，否则后果自负！</i>
                </div>
              </div>

              <div
                class="rich-content"
                v-html="baseInfo.paymentTutorialUrl"
              ></div>
            </div>
          </div>

          <div
            class="mt-20"
            style="margin-left: 2.67rem; margin-right: 2.67rem"
            v-if="componentsConfig.components"
          >
            <Bank></Bank>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";

export default {
  name: "TemplateWeiXin",
  mixins: [template],
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  // min-height: calc(100vh - 48.00rem);
  // background-color: aquamarine;
  // padding: 5.33rem;

  ::v-deep .el-button--primary {
    background-color: #09b29e;
    border-color: #09b29e;
  }
  .body {
    display: flex;
    justify-content: center;
    align-items: stretch;
    min-height: calc(100vh - 44rem);
  }

  .preview {
    width: 100vw;
    // height: 106.67rem;
    min-height: 100vh;
    background-color: #f1f1f1;
    padding-bottom: 8rem;

    .tip {
      text-align: center;
    }

    .main {
      width: 100rem;
      // min-width: 106.67rem;
      margin: 0 auto;
      // background-color: #fff;
      padding-bottom: 5.33rem;
      color: #2b3674;
      background: linear-gradient(
        to bottom,
        #0de1a5 0rem,
        /* 接近8.00rem处仍为天蓝色 */ #11d3b3 26.4rem,
        /* 8.00rem处突然变为蓝色 */ white 53.33rem /* 16.00rem处突然变为白色 */
      );

      // .card {
      // border-top: 0.27rem solid #eee;
      // padding: 5.33rem;
      // }

      .logo-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 22.67rem;
        padding: 0rem 13.33rem;
        // background-image: linear-gradient(to bottom, #0de1a5, #11d3b3);
      }

      img {
        width: 20.27rem;
        height: 20.27rem;
      }

      .title {
        font-size: 9.33rem;
        color: #fff;
      }

      .payinfo-box {
        background: linear-gradient(
          to bottom,
          #caf5ef 2.67rem,
          /* 接近8.00rem处仍为天蓝色 */ #adeee6 10.67rem,
          /* 8.00rem处突然变为蓝色 */ white 26.67rem
            /* 16.00rem处突然变为白色 */
        );
        padding: 2.67rem;
        border-radius: 8rem 8rem 0 0;

        .tishi {
          // background-color: #ff3b3014;
          height: 8rem;
          border-radius: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 3.73rem;
        }

        .qrcode.card {
          width: 69.33rem;
          // background-color: red;
          margin: 2.67rem auto 0;
          padding: 4rem ;
          border-radius: 8rem 8rem 0 0;
          // border: 0.27rem solid #0084ff;;
          //border: 0.27rem solid #10d8ae;
          border-bottom: none;

          svg {
            width: 160px !important;
            height: 160px !important;
          }
          .test-t {
            color: red;
          }

          .box {
            //background-color: #22ab38;
            border-radius: 4rem 4rem 0 0;
            padding: 0 0 5.33rem;

            span {
              color: #fff;
            }

            .up-txt {
              font-weight: 600;
              font-size: 4.8rem;
            }

            .down-txt {
              font-size: 3.73rem;
              margin-top: 4rem;
              color: #fff;
            }

            .img-wrap {
              width: 42.67rem;
              height: 42.67rem;
              background-color: #fff;
              padding: 2.67rem 2.67rem;
              margin-top: 1.33rem;
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 0.8rem;
            }

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
        }

        .money-out-box {
          border: 0.27rem solid #22ab38;
          border-radius: 5.33rem;
          padding-top: 5.33rem;
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
              font-size: 10.67rem;
            }

            .copy-order-money {
              height: 6.93rem;
              line-height: 4.27rem;
              padding: 0.8rem 2.67rem !important;
              margin-left: 2.67rem;
            }
          }

          .btn-box {
            display: flex;
            justify-content: center;
            padding: 4rem;

            .btn-launch {
              display: flex;
              cursor: pointer;
              justify-content: center;
              align-items: center;
              color: #fff;
              font-size: 4.27rem;
              width: 51.2rem;
              height: 9.07rem;
              border-radius: 4.53rem;
              background-color: #09b29e;
            }
          }
        }

        .cutdowntime {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2.67rem;
          color: #909090;
          font-size: 4.27rem;

          div {
            font-weight: 600;
          }

          i {
            color: #0084ff;
            margin: 0 1.33rem;
            font-weight: bold;
          }

          .time {
            padding: 1.33rem 2.13rem;
            border-radius: 1.07rem;
            background-color: #ff3b30;
            color: #fff;
          }
        }

        .pay-intro {
          text-align: center;
          font-weight: 400;
          font-size: 4.27rem;
          color: #3f528c;
          margin: 8rem 0;
        }

        .txt-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2.67rem 4rem;
        }
      }

      .submit-info {
        // margin-top:5.33rem;
        padding: 5.33rem;
      }

      .submit-info-item {
        display: flex;
        // align-items: center;
        // justify-content: center;

        ::v-deep .el-upload--picture-card {
          width: auto;
          height: auto;
          padding: 0 5.33rem;
          border: none;
          line-height: 0;
          background-color: transparent;
          box-shadow: none;
        }

        .trigger {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 16rem;
          height: 16rem;
          text-align: center;
          border: 0.27rem solid #eee;
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
        // margin-top:5.33rem;
        border: 0.27rem solid #10d8ae;
        padding: 2.67rem;
        border-radius: 5.33rem;
        background-color: #eafffb;
        position: relative;
        margin-top: 8rem;
        padding-top: 8rem;

        .zhuyi-box {
          position: absolute;
          top: 0rem;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 0.27rem solid #eee;

          .zhuyi {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 74.67rem;
            height: 16.27rem;
            background-color: #22ab38;
            color: #fff;
            border-radius: 8rem;

            span {
              font-size: 4.27rem;
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
    border-left: 2.13rem solid var(--w-e-textarea-selected-border-color);
    display: block;
    font-size: 100%;
    line-height: 1.5;
    margin: 2.67rem 0;
    padding: 2.67rem;
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
    padding-left: 5.33rem;
  }

  // color: #fc5449;
  // font-weight: 600;
  // padding: 2.67rem;
  // line-height: 1.5;

  // .item {
  //   padding-left: 3.47rem;
  // }
  // .item:before {
  //   content: ' ● ';
  //   margin-left: -3.47rem;
  // }
}

.btns.card {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .btn-info {
    width: 50%;
    // border: 1px solid #f1f1f1;
    justify-self: stretch;
  }
  .img-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
      width: 300px !important;
      height: 300px !important;
    }
  }
}
</style>
