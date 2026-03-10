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
             
              <img
                v-loading="logoIconUrl == ''"
                style="height: 9.33rem; width: 9.33rem"
                :src="logoIconUrl"
                fit="cover"
                title="logo"
              />

              <span class="title">{{ baseInfo.templateTitleName }}</span>
            </div>
          </div>

          <div class="payinfo-box-1 t-72" style="padding-bottom: 0">
            <!-- 基础信息卡片 -->

            <!-- <div class="tishi">转错金额会导致支付失败！</div> -->

            <p class="tishi">请按此金额复制支付！</p>
            <p class="tishi">转错金额会导致支付失败！</p>

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

              <div class="arrow left">
                <img :src="require('@/assets/img/left.jpg')" alt="" />
              </div>

              <div class="arrow right">
                <img :src="require('@/assets/img/right.jpg')" alt="" />
              </div>
            </div>

            <!-- <h3 class="py-1">付款需复制附言备注 否则不到账</h3> -->

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

            <div class="cutdowntime">
              <!-- <div>付款倒计时：</div> -->
              <span>{{ cutdownHours }}时</span>
              <span style="margin: 0 2.13rem">{{ cutdownMinutes }}分</span>
              <span>{{ cutdownSeconds }}秒</span>
            </div>

            <div class="hr"></div>
            <div class="txt-order-no" v-if="baseInfo.isShowMerchantOrderNo">
              <span class="txt-left"> 订单号：</span>
              <span style="margin: 0 2.13rem">{{ orderNum }}</span>
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

          <div class="payinfo-box-1 mt-10" v-if="buttonConfigInfo && buttonConfigInfo.buttons.length > 0" >

            <div class="payinfo-box" v-if="!isSecondQr()">
              <!-- 按钮信息卡片 -->
              <div class="btns card" >
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
                      <MyQrCode :value="info.resultButtonUrl" v-if="info.resultButtonUrl" ></MyQrCode>

                      <span
                        style="color: red; font-size: 2.67rem; margin: 2.13rem"
                        >{{ info.buttonTitle }}</span
                      >
                    </div>
          
                    <el-button
                      v-if="info.showType == 0 || info.showType == 2"
                      @click="(e) => btnClick(info)"
                      type="primary"
                      class="btn"
                      style=""
                      >{{ info.buttonTitle }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
         </div>

          <div class="payinfo-box-1 mt-10">
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
            <div class="qrcode card" v-if="qrConfig && qrConfig.qrUrl">
              <div style="text-align: center">
                <div class="img-wrap">
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

            <!-- 文本信息卡片 -->
            <div class="text-info card" v-if="textConfigInfo.texts.length > 0">
              <div class="hr"></div>

              <template v-for="info in textConfigInfo.texts">
                <div class="txt-info-item" :key="info.sort" v-if="info.isShow" >
                  <span class="txt-left"
                    >{{ info.textTitle }}
                    <span v-if="info.textTitle.length > 0">：</span></span
                  >
                  <span class="txt-right"
                    ><span>{{ info.textValue }}</span>
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
    padding-bottom: 8rem;

    .tip {
      text-align: center;
    }

    .main {
      width: 100rem;
      margin: 0 auto;
      padding: 0;
      background-color: #fff;
      color: #2b3674;

      .logo-box {
        width: 100%;
        height: 36rem;
        background-color: #49a1ff;
        display: flex;
        justify-content: center;
      }

      .logo {
        height: 18.1333rem;
        border-radius: 5.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2.13rem 9.33rem;

        img {
          width: 13.33rem;
        }

        .title {
          font-size: 5.87rem;
          margin-left: 2.67rem;
          color: #fff;
        }
      }

      .t-72 {
        margin-top: -19.2rem;
      }

      .payinfo-box-1 {
        background-color: #fff;
        padding: 2.6667rem 0;
        margin-inline: 2.5rem;
        box-shadow: 0.27rem 0.27rem 1.07rem rgba(0, 0, 0, 0.195);
        border-radius: 2.67rem !important;

        .tishi {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 4rem;
          margin: 2.6667rem;
        }

        .btn-copy-1 {
          color: rgb(73, 161, 255);
          font-size: 5.07rem;
          margin-left: 2rem;
          font-weight: 600;
        }

        .order-money-box {
          position: relative;
          margin: 2.6667rem 0 0;
          display: flex;
          justify-content: center;
          align-items: center;

          .arrow {
            width: 9.33rem;
            height: 9.33rem;
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
            margin-left: -25rem;

            img {
              animation: left-move 0.5s infinite alternate;
            }
          }

          .arrow.right {
            margin-left: 25rem;

            img {
              animation: right-move 0.5s infinite alternate;
            }
          }

          .order-money {
            color: #ff3b30;
            font-weight: bold;
            font-size: 8rem;
          }
        }

        .qrcode.card {
          width: 53.3333rem;
          margin: 0rem auto;

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
          font-size: 3.2rem;

          span {
            padding: 1.33rem;
            border-radius: 1.07rem;
            background-color: #5ac725;
            color: #fff;
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

          .txt-left {
            color: #ff3b30;
            font-size: 1.17em;
          }

          .txt {
            font-size: 8.8rem;
            color: rgb(255, 0, 255);
          }
        }
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

          .btn {
            margin-bottom: 2.67rem;
            background-color: #1677ff;
            width: 80rem;
          }
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
    width: 100%;
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
