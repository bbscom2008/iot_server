<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <!--======================== 开始 ===========================-->

          <div class="txt-order-no">
            <span style="margin: 0 2.13rem; font-size: 5rem">{{
              orderNum
            }}</span>
            <!-- <el-button
                type="text"
                @click="
                  (e) => {
                    copyInfo(e, orderNum);
                  }
                "
                >复制</el-button
              > -->
          </div>

          <div class="order-money-box">
            <div class="order-money">￥{{ orderMoney }}</div>
            <el-button
              class="btn-copy-1"
              type="text"
              @click="
                (e) => {
                  copyInfo(e, orderMoney);
                }
              "
              >复制</el-button
            >
          </div>

          <div class="text-kouling">
            <div class="tip">付款时一定要添加备注口令</div>

            <div
              class="txt-info-item"
              v-if="
                baseInfo.isShowTransferRemark &&
                baseInfo.transferRemarkTitle &&
                remarkContent
              "
            >
              <span class="txt-left">{{ baseInfo.transferRemarkTitle }}：</span>

              <span class="txt" style="margin-right: 2.67rem">{{
                remarkContent
              }}</span>

              <el-button
                class="btn-copy-1"
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

          <div class="vip-tip">
            <div>注意：禁止支付宝微信扫码，违者不到账！</div>
            <div style="margin-top:4rem;" >注意：请截图使用手机银行APP或云闪付APP扫码支付！</div>
          </div>

          <div class="cutdowntime">
            <div>支付倒计时：</div>
            <span v-if=" Number(cutdownHours)> 0"  >{{ cutdownHours }}时</span>
            <span>{{ cutdownMinutes }}分</span>
            <span>{{ cutdownSeconds }}秒</span>
          </div>



          <!-- 文本信息卡片 -->
          <div class="text-info card" style="margin:5rem 0;" v-if="textConfigInfo.texts.length > 0">
            <template v-for="info in textConfigInfo.texts">
              <div class="txt-info-item" :key="info.sort" v-if="info.isShow">
                <span class="txt-left"
                  >{{ info.textTitle }}
                  <span v-if="info.textTitle.length > 0">：</span></span
                >
                <span class="txt-right"
                  ><span>{{ info.textValue }}</span>
                  <!-- <el-button
                    type="text"
                    @click="
                      (e) => {
                        copyInfo(e, info.textValue);
                      }
                    "
                    >复制</el-button
                  > -->
                  </span
                >
              </div>
            </template>
          </div>

          <div style="color:red;font-weight:600;"  >！ 禁止修改金额 超时支付 ！</div>
          <!-- 二维码卡片 -->
          <div class="qrcode card" v-if="qrConfig && qrConfig.qrUrl">
            <div style="text-align: center">
              <div class="img-wrap" style="padding: 3rem" >
                <!-- 系统解析后的二维码， -->
                <MyQrCode v-if="qrConfig.isActive == 1" :value="qrConfig.parseValue" ></MyQrCode>
                <!-- 原图 -->
                <el-image v-else :src="qrConfig.qrUrl" alt="" />
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

          <!-- <div class="pay-intro">
              支付说明：使用支付宝扫码，直接完成支付或者截屏保存二维码，打开支付宝扫一扫，点击相册选择截图二维码，完成支付
            </div> -->

          

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
                <el-button type="success" @click="onBtnSubmit"
                  >提交信息</el-button
                >
              </div>
            </el-form>
          </div>

          <div class="payinfo-box mt-10" v-if="!isSecondQr()">
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
                    <MyQrCode
                      :value="info.resultButtonUrl"
                      v-if="info.resultButtonUrl"
                    ></MyQrCode>

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
                    style="margin-bottom: 2.67rem; background-color: #1677ff"
                    >{{ info.buttonTitle }}</el-button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 银行组件卡片 -->
          <!-- <div class="bank-comp card" v-if="componentsConfig.components.length > 0">
              <div class="hr"></div>
              <div class="bank-box">
                <div class="btn-info" v-for="bank in componentsConfig.components" :key="bank.id">
                  <a :href="bank.buttonUrl" target="_blank">
                    <div class="btn-info-item">
                      <img style="height: 21.33rem; margin: 2.67rem"
                        :src="require('@/assets/img_bank/' + logoUrl[+bank.buttonLogoUrl].icon)" alt="" />
                      <span style="font-size: 3.73rem">{{ bank.buttonTitle }}</span>
                    </div>
                  </a>
                </div>
              </div>
            </div> -->

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

          <div
            class="card pay-course payinfo-box"
            style="padding: 0 4rem"
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
  name: "TemplateDefault",
  mixins: [template],
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
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
    background-color: #f1f1f1;

    .main {
      width: 100rem;
      text-align: center;
      margin: 0 auto;
      font-weight: 600;
      padding: 5.33rem 0;
      background-color: #fff;
      color: #2b3674;
      .btn-copy-1 {
        color: rgb(73, 161, 255);
        font-size: 4.07rem;
        margin-left: 2rem;
        font-weight: 600;
      }

      .order-money-box {
        position: relative;
        margin: 2.6667rem 0 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .order-money {
          color: #000;
          font-weight: bold;
          font-size: 8rem;
        }
      }

      .text-kouling {
        padding-top: 10rem;
        color: #ff3b30;
        line-height: 1.5;
        font-size: 1.2em;
        font-weight: 600;
      }

      .vip-tip{
        padding: 3rem 6rem;
        color: #ff3b30;
        font-weight: 600;
        font-size: 5.5rem;
      }

      .qrcode.card {
        width: 80%;
        // height: 56.00rem;
        // background-color: #1777ff;
        margin: 0rem auto;
        // padding-top: 1.33rem;

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

          .img-wrap {
            width: 100%;
            height: 100%;
            background-color: #fff;
            padding: 2.1333rem 2.1333rem;
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
        font-weight: 600;
        font-size: 4.5rem;

        span {
          padding: 0.5rem;
          border-radius: 1.07rem;
          color:#ff3b30;
        }
      }

      .txt-order-no {
        text-align: center;
        ::v-deep .custom-button {
          padding: 3.2rem 5.33rem;
          font-size: 3.73rem;
          border-radius: 1.07rem;
        }
      }

      .txt-info-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0 2.67rem;
        font-weight: 600;
        font-size: 4rem;
        color: #ff3b30;
      }

      .submit-info-item {
        display: flex;

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
        text-align: center;

        .btn-info-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }

      .pay-course {
        .title-box {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 4rem 0rem;
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
  video,
  img {
    max-width: 100%;
  }

  ul {
    padding-left: 5.33rem;
  }
}

.btns.card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .btn-info {
    width: 50%;
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
