<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="logo-box"  v-if="baseInfo.templateTitleName != 'null'"   >
            <div class="logo">
              <img
                v-loading="logoIconUrl == ''"
                style="height: 9.33rem; width: 9.33rem; margin-right: 2.67rem"
                :src="logoIconUrl"
                title="logo"
                fit="cover"
              />
              <span class="title">{{ baseInfo.templateTitleName }}</span>
            </div>
          </div>

          <div class="payinfo-box mt-20">
            <!-- 基础信息卡片 -->

            <div class="tishi">
              请按此金额复制支付！转错金额会导致支付失败！
            </div>

            <!-- 二维码卡片 -->
            <div class="qrcode card" v-if="qrConfig && qrConfig.qrUrl">
              <div style="text-align: center" class="box">
                <div class="img-wrap">
                  <!-- 系统解析后的二维码， -->
                  <MyQrCode v-if="qrConfig.isActive == 1" :value="qrConfig.parseValue" ></MyQrCode>
                  <!-- 原图 -->
                  <el-image v-else :src="qrConfig.qrUrl" alt="" style="width: 260px" />
                </div>
              </div>
            </div>
            <div
              v-else-if="isSecondQr()"
              style="display: flex; justify-content: center"
            >
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
                      style="margin-bottom: 2.67rem"
                      >{{ info.buttonTitle }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="cutdowntime">
              <div>付款倒计时：</div>
              <span>{{ cutdownHours }}</span
              ><i>:</i><span>{{ cutdownMinutes }}</span> <i>:</i>
              <span>{{ cutdownSeconds }}</span>
            </div>

            <div class="order-money-box">
              <div class="order-money">￥{{ orderMoney }}</div>
              <el-button
                type="danger"
                round
                plain
                class="copy-order-money"
                @click="
                  (e) => {
                    copyInfo(e, orderMoney);
                  }
                "
                ><svg-icon icon-class="copy" style="margin-right: 5px;" />复制</el-button
              >
            </div>
            <!-- <div class="pay-intro">
              支付说明：使用支付宝扫码，直接完成支付或者截屏保存二维码，打开支付宝扫一扫，点击相册选择截图二维码，完成支付
            </div> -->

            <div class="text-info card">
              <div
                class="txt-info-item"
                v-if="
                  baseInfo.isShowTransferRemark &&
                  baseInfo.transferRemarkTitle &&
                  remarkContent
                "
              >
                <span class="txt-left"
                  >{{ baseInfo.transferRemarkTitle }}：</span
                >
                <span class="txt-right">
                  <span style="margin-right: 2.67rem">{{ remarkContent }}</span>
                  <el-button
                    type="text"
                    @click="
                      (e) => {
                        copyInfo(e, remarkContent);
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
                        copyInfo(e, orderNum);
                      }
                    "
                    >复制</el-button
                  >
                </span>
              </div>
            </div>

            <!-- 文本信息卡片 星雨修改处  开始-->
            <div class="text-info card" v-if="textConfigInfo.texts.length > 0">
              <template v-for="info in textConfigInfo.texts">
                <div class="txt-info-item" v-if="info.isShow" :key="info.sort">
                <!-- <div class="txt-info-item" :key="info.sort"> -->
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
              </template>
            </div>
            <!-- 结束 星雨修改处-->

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

            <div class="payinfo-box" v-if="!isSecondQr()">
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
                      style="margin-bottom: 2.67rem"
                      >{{ info.buttonTitle }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <div
              class="card pay-course payinfo-box mt-10"
              v-if="baseInfo.paymentTutorialUrl.length > 0"
            >
              <div class="title-box">
                <div class="title">注意事项</div>
              </div>

              <div
                class="rich-content"
                v-html="baseInfo.paymentTutorialUrl"
              ></div>
            </div>

            <!-- <div
              class="hr"
              v-if="
                baseInfo.isShowTransferRemark || baseInfo.isShowMerchantOrderNo
              "
            ></div> -->

            <!-- 银行组件卡片 -->
            <!-- <div
              class="bank-comp card"
              v-if="componentsConfig.components.length > 0"
            >
              <div class="hr"></div>
              <div class="bank-box">
                <div
                  class="btn-info"
                  v-for="bank in componentsConfig.components"
                  :key="bank.id"
                >
                  <a :href="bank.buttonUrl" target="_blank">
                    <div class="btn-info-item">
                      <img
                        style="height: 21.33rem; margin: 2.67rem"
                        :src="
                          require('@/assets/img_bank/' +
                            logoUrl[+bank.buttonLogoUrl].icon)
                        "
                        alt=""
                      />
                      <span style="font-size: 3.73rem">{{
                        bank.buttonTitle
                      }}</span>
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
                  <span v-if="info.showType == 2" style="color: red; font-size: 2.67rem; margin: 2.13rem"
                    >点击跳转，或者 扫码跳转</span
                  >
                  <el-button
                    v-if="info.showType == 0 || info.showType == 2"
                    type="primary"
                    style="width: 30%; margin-bottom: 2.67rem"
                    >{{ info.buttonTitle }}</el-button
                  >
                </div>
              </div>
            </div> -->

            <div class="service card mt-20" v-if="baseInfo.isOnlineService">
              <div class="hr"></div>
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="success" style="width: 30%; margin-bottom: 2.67rem"
                    @click="openChat()">在线客服</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- <div
            class="card pay-course payinfo-box mt-10"
            v-if="baseInfo.paymentTutorialUrl.length > 0"
          >
            <div class="title-box">
              <div class="title">注意事项</div>
            </div>

            <div
              class="rich-content"
              v-html="baseInfo.paymentTutorialUrl"
            ></div>
          </div> -->

          <div class="mt-20" v-if="componentsConfig.components">
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
  name: "TemplateZhiFuBao",
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
      width: 106.67rem;
      max-width: 100vw;
      margin: 0 auto;
      background-image: url("~@/assets/img/zhifubao_template_bg.png");
      padding: 11.2rem 2.67rem 5.33rem;
      color: #2b3674;
      background-size: cover;
      // .card {
      // background-color: #fff;
      // border-top: 0.27rem solid #eee;
      // padding: 5.33rem;
      // }

      .logo-box {
        display: flex;
        justify-content: center;
      }
      .logo {
        height: 11.2rem;
        background-color: #ffffffe5;
        border-radius: 5.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2.13rem 9.33rem;
        img {
          width: 9.07rem;
          margin-right: 2.13rem;
        }
        .title {
          font-size: 4.27rem;
          color: #2b3674;
        }
      }
      .payinfo-box {
        // width: 94.67rem;
        background-color: #fff;
        padding: 2.67rem;
        border-radius: 3.2rem;
        // margin: 2.67rem auto;

        .tishi {
          background-color: #ff3b3014;
          height: 8rem;
          border-radius: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 3.73rem;
        }

        .qrcode.card {
          width: 68rem;
          min-height: 100px;
          // height: 56.00rem;
          // background-color: #1777ff;
          margin: 2.67rem auto;
          padding-top: 1.33rem;

          & > div {
            span {
              color: #fff;
            }
            .up-txt {
              font-weight: 600;
              font-size: 4.27rem;
            }
            .down-txt {
              font-size: 3.2rem;
            }
            // .img-wrap {
            //   width: 100%;
            //   height: 100%;
            //   background-color: #fff;
            //   padding: 2.67rem 2.67rem;
            //   margin-top: 1.33rem;
            //   margin-left: auto;
            //   margin-right: auto;
            //   margin-bottom: 0.8rem;
            // }
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
          padding: 2.67rem;
          color: #2b3674;
          font-size: 4.27rem;

          div {
            font-weight: 600;
          }
          i {
            color: #0084ff;
            margin: 0 1.33rem;
            font-weight: bold;
          }
          span {
            padding: 1.33rem 2.13rem;
            border-radius: 1.07rem;
            background-color: #0084ff;
            color: #fff;
          }
        }

        .order-money-box {
          display: flex;
          justify-content: center;
          align-items: center;

          .order-money {
            color: #ff3b30;
            font-weight: bold;
            font-size: 8rem;
          }
          .copy-order-money {
            height: 6.93rem;
            line-height: 4.27rem;
            padding: 0.8rem 2.67rem !important;
            margin-left: 1.33rem;
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
          padding: 0 4rem;
        }
      }

      .submit-info-item {
        display: flex;
        // align-items: center;
        // justify-content: center;

        ::v-deep .custom-upload-picture-card {
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
        .title-box {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2.67rem 4rem 0rem;
          border-bottom: 0.27rem solid #eee;

          .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 4.27rem;
            width: 38.67rem;
            height: 8rem;
            background-color: #115cd8;
            color: #fff;
            border-radius: 4rem 4rem 0 0;
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
