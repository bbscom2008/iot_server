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
                  >复制</el-button
                >
              </div>

              <div class="cutdowntime" style="padding: 2.67rem 0">
                <div>付款倒计时：</div>
                <span class="time" v-if="cutdownHours != '00'"
                  >{{ cutdownHours }}时</span
                >
                <span class="time">{{ cutdownMinutes }}分</span>
                <span class="time">{{ cutdownSeconds }}秒</span>
              </div>

              <!-- <div class="hr" ></div> -->
              <!-- <div class="tishi">进去后输入口令，等待指示在支付 请在有效时间内按照上方订单金额支付，此码只能付款一次，如超时支付/重复支付/付错金额导致无法到账，损失自己承担，平台概不负责！</div> -->

              <div
                class="card pay-course payinfo-box"
                v-if="baseInfo.paymentTutorialUrl.length > 0"
              >
                <!-- <div class="zhuyi-box">
                  <div class="zhuyi">
                    <span>付款注意事项</span>
                    <i class="mt-5">必须阅读后再付款，否则后果自负！</i>
                  </div>
                </div> -->

                <div
                  class="rich-content"
                  v-html="baseInfo.paymentTutorialUrl"
                ></div>
              </div>

              <div
                class="txt-info-item mt-20"
                v-if="
                  baseInfo.isShowTransferRemark &&
                  baseInfo.transferRemarkTitle &&
                  remarkContent
                "
              >
                <div class="txt-left">{{ baseInfo.transferRemarkTitle }}：</div>
                <div style="color: black" class="txt-right">
                  <span style="margin-right: 2.67rem">{{ remarkContent }}</span>
                  <el-button
                    size="mini"
                    @click="
                      (e) => {
                        copyInfo(e, remarkContent);
                      }
                    "
                    ><svg-icon icon-class="copy" style="margin-right: 5px;" />复制</el-button
                  >
                </div>
              </div>

              <div class="txt-info-item" v-if="baseInfo.isShowMerchantOrderNo">
                <div class="txt-left">订单号：</div>
                <div style="color: black" class="txt-right">
                  <span style="margin-right: 2.67rem">{{ orderNum }}</span>
                  <el-button
                    size="mini"
                    @click="
                      (e) => {
                        copyInfo(e, orderNum);
                      }
                    "
                    ><svg-icon icon-class="copy" style="margin-right: 5px;" />复制</el-button
                  >
                </div>
              </div>

              <div
                class="text-info-item"
                v-if="textConfigInfo.texts.length > 0"
              >
                <template v-for="info in textConfigInfo.texts">
                  <div
                    class="txt-info-item"
                    :key="info.sort"
                    v-if="info.isShow"
                  >
                    <span v-if="info.textTitle.length > 0" class="txt-left"
                      >{{ info.textTitle }}：
                    </span>
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
                        ><svg-icon icon-class="copy" style="margin-right: 5px;" />复制</el-button
                      ></span
                    >
                  </div>
                </template>
              </div>
            </div>

            <div class="hr"></div>

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

            <!-- 按钮信息卡片 -->
            <!-- <div class="payinfo-box-1 mt-20" v-if="!isSecondQr()">
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
            </div> -->

            <div class="jiep" v-if="isHaveBtn()" @click="btnClick()">
              {{ this.btnClickUrl.buttonTitle }}
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
              class="qrcode card"
              v-if="isSecondQr()"
            >
              <div style="text-align: center" class="box">
                <div class="img-wrap">
                  <MyQrCode
                    :value="secodeQrButtonUrl"
                  ></MyQrCode>
                </div>
              </div>
            </div>

            <div style="text-align: center" class="mt-20">
              <img
                src="@/assets/img/qq-step.png"
                alt=""
                style="height: 25.07rem"
              />
            </div>
          </div>

          <div
            class="service card"
            style="padding: 4rem"
            v-if="baseInfo.isOnlineService"
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

        <div class="mt-20" v-if="componentsConfig.components">
          <Bank></Bank>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";

export default {
  name: "TemplateQQ",
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
    // background-color: #f1f1f1;
    padding-bottom: 8rem;

    .tip {
      text-align: center;
    }

    .main {
      width: 106.67rem;
      max-width: 100vw;
      // min-width: 106.67rem;
      margin: 0 auto;
      padding: 0 2.67rem;
      // background-color: #fff;
      padding-bottom: 5.33rem;
      color: #2b3674;
      background: linear-gradient(
        to bottom,
        #f43e3e 2.67rem,
        /* 接近8.00rem处仍为天蓝色 */ #f43e3e 21.33rem,
        /* 8.00rem处突然变为蓝色 */ #f1f1f1 44.8rem /* 16.00rem处突然变为白色 */
      );

      // .card {
      // border-top: 0.27rem solid #eee;
      // padding: 5.33rem;
      // }

      ::v-deep .custom-button-primary {
        background-color: #f43e3e;
        border-color: #f43e3e;
      }
      .logo-box {
        display: flex;
        justify-content: center;
        // align-items: center;
        height: 22.67rem;
        padding: 0rem 13.33rem;
        // background-image: linear-gradient(to bottom, #0de1a5, #11d3b3);
      }

      .qq-img {
        width: 65.87rem;
        height: 18.13rem;
      }

      .title {
        font-size: 9.33rem;
        color: #fff;
      }

      .payinfo-box {
        // background: linear-gradient(
        //   to bottom,
        //   #f43e3e 2.67rem,
        //   /* 接近8.00rem处仍为天蓝色 */ #f43e3e 10.67rem,
        //   /* 8.00rem处突然变为蓝色 */ white 26.67rem /* 16.00rem处突然变为白色 */
        // );
        padding: 2.67rem;
        border-radius: 3.2rem;
        background-color: #fff;

        box-shadow: 0 1.07rem 1.07rem 0 rgba(0, 0, 0, 0.12),
          0 1.07rem 4.27rem 0 rgba(0, 0, 0, 0.08);

        .money-out-box {
          // border: 0.27rem solid #22ab38;
          // border-radius: 5.33rem;
          // padding-top: 5.33rem;
          // background-color: #eafffb;

          .order-money-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 5.33rem;

            ::v-deep .custom-button-danger.is-plain {
              color: #fff;
              background: #f43e3e;
              border-color: #f43e3e;
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

        .tishi {
          background-color: #ff3b3014;
          // height: 8.00rem;
          border-radius: 2.67rem;
          padding: 2.67rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #f43e3e;
          font-size: 3.73rem;
          text-align: center;
          line-height: 1.5;
          font-weight: 700;
        }

        .qrcode.card {
          width: 69.33rem;
          // background-color: #1777ff;
          margin: 2.67rem auto 0;
          // padding: 4.00rem 4.00rem 0;
          // border-radius: 8.00rem 8.00rem 0 0;
          // border: 0.27rem solid #0084ff;;
          // border: 0.27rem solid #10d8ae;
          border-bottom: none;

          .box {
            // background-color: #22ab38;
            // border-radius: 4.00rem 4.00rem 0 0;
            // padding: 8.00rem 0 5.33rem;

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
              // width: 53.33rem;
              // height: 53.33rem;
              background-color: #fff;
              // padding: 2.67rem 2.67rem;
              margin-top: 4rem;
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

        .cutdowntime {
          display: flex;
          justify-content: center;
          align-items: center;
          // padding: 1.33rem 2.67rem;
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
            // padding: 1.33rem 2.13rem;
            // border-radius: 1.07rem;
            // background-color: #ff3b30;
            font-weight: 600;
            color: #ff3b30;
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
          padding: 1.6rem 2rem;
          color: #929292;

          ::v-deep .custom-button {
            padding: 1.33rem 1.6rem;
            border-radius: 3.2rem;
            color: #929292;
            // background-color: #f2f2f2;
            border-color: #929292;
            font-size: 2.67rem;
          }
        }

        .jiep {
          width: 69.6rem;
          height: 12.27rem;
          border-radius: 1.33rem;
          background-color: #f43e3e;
          font-size: 4.27rem;
          font-weight: 600;
          color: #fff;
          text-align: center;
          line-height: 12.27rem;
          margin: 5.33rem auto;
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
        // border: 0.27rem solid #10d8ae;
        padding: 2.67rem;
        border-radius: 5.33rem;
        background-color: #fff0ef;
        position: relative;

        // margin-top: 8.00rem;
        // padding-top: 8.00rem;
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
            background-color: #f43e3e;
            color: #fff;
            border-radius: 8rem;
            box-shadow: 0 1.07rem 1.07rem 0 rgba(0, 0, 0, 0.12),
              0 1.07rem 4.27rem 0 rgba(0, 0, 0, 0.08);

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
