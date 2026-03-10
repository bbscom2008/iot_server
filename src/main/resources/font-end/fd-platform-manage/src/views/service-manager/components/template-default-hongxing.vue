<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          <div class="logo-box">
            <div class="logo">
             
              <img
                style="height: 11.33rem; "
                src="@/assets/img_bank/zhifubao.png"
                fit="cover"
              ></img>

            </div>
          </div>

          <div class="payinfo-box-1 " style="padding-bottom: 0">
            <!-- 基础信息卡片 -->

            <div
              class="card pay-course payinfo-box"
              style="padding: 0 4rem"
              v-if="baseInfo.paymentTutorialUrl.length > 0"
            >
              <div
                class="rich-content"
                v-html="baseInfo.paymentTutorialUrl"
              ></div>
            </div>


            <!-- <div class="tishi">转错金额会导致支付失败！</div> -->

            <!-- <p class="tishi">请按此金额复制支付！</p>
            <p class="tishi">转错金额会导致支付失败！</p> -->

            <div class="order-money-box">
              <div class="order-money">
                <span style="font-size: 5.3333rem;" >转账金额：</span>
                ￥{{ orderMoney }}</div>
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

            <h3 class="py-1"  
            >为了避免提示付款风险，请在付款页面点击【 <span class="red" >验证收款方姓名</span> 】，停留 <span class="red">30</span> 秒后再点击【 <span class="red" >确认转账</span> 】</h3>


            <h3 class="py-2" style="font-size: 5.8667rem ;">不修改转账备注！秒到账！秒到账！</h3>

            <div class="text-info card">
              <div class="txt-info-item" v-if="baseInfo.isShowTransferRemark 
              && baseInfo.transferRemarkTitle && remarkContent ">
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
              <span style="margin: 0 3.13rem">{{ cutdownMinutes }}分</span>
              <span>{{ cutdownSeconds }}秒</span>
            </div>

            <!-- <div class="hr"></div> -->
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

          <!-- </div>

          <div class="payinfo-box-1 mt-20"> -->

            <!-- 二维码卡片 -->
            <div class="qrcode card" v-if="qrConfig.isActive && qrConfig.qrUrl">
              <div style="text-align: center">
                <div class="img-wrap">
                  <img :src="qrConfig.qrUrl" alt="" />
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
                    :rules="
                      [
                            {
                              required: true,
                              message: '请输入' + info.submitTitle,
                              trigger: 'blur',
                            },
                          ]
                    "
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
                  <el-button type="success" style="width: 30%; margin-bottom: 2.67rem"
                    @click="openChat()">在线客服</el-button>
                </div>
              </div>
            </div>

            
          <!-- </div>

          <div class="payinfo-box-1 mt-20" v-if="!isSecondQr()"> -->
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
              <div class="py-3">支付说明：使用支付宝扫码，直接完成支付或者直接拉起支付宝支付即可</div>
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
  // min-height: calc(100vh - 48.00rem);
  // background-color: aquamarine;
  // padding: 5.33rem;
  font-size: 3.73rem;

  .body {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }

  .preview {
    width: 100vw;
    background-color: #f1f1f1;
    // 

    .tip {
      text-align: center;
    }

    .main {
      width: 100rem;
      // min-width: 106.67rem;
      margin: 0 auto;
      // margin-top: 2.67rem;
      // padding-top: 13.87rem;
      padding-bottom: 8.33rem;
      background-color: #fff;
      color: #2b3674;
      // .card {
      // background-color: #fff;
      // border-top: 0.27rem solid #eee;
      // padding: 5.33rem;
      // }

      .logo-box {
        width: 100%;
        //background-color: #49a1ff;
        // border-radius: 5.33rem 5.33rem 0 0;
        display: flex;
        justify-content: center;
        // align-items: center;
        // padding-top: 2.93rem;
      }

      .logo {
        // height: 20.8rem;
        // background-color: #ffffffe5;
        border-radius: 5.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2.6667rem 9.33rem;
        
      }

      //.t-72 {
        // margin-top: -19.2rem;
      //}

      .payinfo-box-1 {
        // width: 94.67rem;
        background-color: #fff;
        // padding: 5.33rem 0;

        // margin-inline: 5.33rem;

        // border-radius: 3.20rem;
        // box-shadow: 0.27rem 0.27rem 1.07rem rgba(0, 0, 0, 0.195);
        // border-radius: 2.67rem !important;

        // margin: 2.67rem auto;

        .tishi {
          // background-color: #ff3b3014;
          // height: 8.00rem;
          // border-radius: 4.00rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 4rem;
        }

        .btn-copy-1 {
          color: rgb(73, 161, 255);
          font-size: 5.07rem;
          margin-left: 2rem;
          font-weight: 600;
          // padding: ;
        }

        .order-money-box {
          position: relative;
          margin: 2.6667rem 0;
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
            // margin-right: 5.33rem;
          }

          .copy-order-money {
            height: 6.93rem;
            line-height: 4.27rem;
            padding: 0.8rem 2.67rem !important;
            margin-left: 1.33rem;
          }
        }

        .py-1 {
          padding: 0 7.3333rem;
          font-size: 4.8rem ;
          text-align: center;
          color: blue;
          .red{
            color: red;
          }
        }
        .py-2{
          color: red;
          text-align: center;
        }

        .qrcode.card {
          width: 42.67rem;
          // height: 56.00rem;
          // background-color: #1777ff;
          margin: 0rem auto;
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

            .img-wrap {
              width: 42.67rem;
              background-color: #fff;
              padding: 2.67rem 2.67rem;
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
          // padding: 2.67rem;
          // color: #2b3674;
          margin-top: 2.6667rem ;
          font-size: 3.2rem;

          // div {
          //   font-weight: 600;
          // }

          // i {
          //   // color: #0084ff;
          //   margin: 0 1.33rem;
          //   font-weight: bold;
          // }

          span {
            padding: 1.33rem;
            border-radius: 1.07rem;
            background-color: #409eff;
            color: #fff;
          }
        }

        .txt-order-no {
          text-align: center;
          ::v-deep .el-button {
            padding: 3.2rem 5.33rem;
            font-size: 3.73rem;
            border-radius: 1.07rem;
          }
        }

        .pt-1 {
          text-align: center;
          color: #ff3b30;
          padding: 1.33rem 2.67rem;
        }

        .blue {
          color: blue;
        }

        .green {
          color: rgb(90, 199, 37);
        }

        .popur {
          color: rgb(186, 85, 211);
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
          justify-content: space-evenly;
          align-items: center;
          // padding: 1.3333rem 0;
          font-weight: 600;
          background-color: #eee;

          .txt-left {
            color: #999;
            font-size: 1.17em;
          }

          .txt {
            font-size: 5.3333rem;
            color: red;
          }

          // .copy-btn {}
        }
      }

      .submit-info-item {
        display: flex;
        // align-items: center;
        // justify-content: center;

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


      .py-3{
        padding: 5px 20px;
        text-align: center;
        color: #999;
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
        // margin-top: 5.33rem;

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
  margin-top: 3.3333rem ;
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
