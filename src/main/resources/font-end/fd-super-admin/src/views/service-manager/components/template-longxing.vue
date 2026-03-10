<template>
  <div class="container">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">


          <div class="payinfo-box-1" style="padding-bottom: 0">

            <div class="logo-box">
              <div class="logo">

                <img style="height: 9.33rem;" src="@/assets/img_bank/alipay3.png" fit="cover" title="logo" />
                <!-- <img style="height: 9.33rem;" :src="qrConfig.qrUrl" alt="" /> -->
                <!-- <span class="title">待付款</span> -->
              </div>
            </div>

            <div class="txt-order-no" v-if="baseInfo.isShowMerchantOrderNo">
              <div style="text-align: center; font-weight: 600; ">
                <span>{{ orderNum }}</span>
                <i class="el-icon-copy-document btn-copy-1" @click="
                  (e) => {
                    copyInfo(e, orderNum);
                  }
                "></i>
              </div>
            </div>


            <div class="order-money-box">
              <div class="order-money">￥{{ orderMoneyOrange }} </div>
              <i class="el-icon-copy-document btn-copy-1" @click="
                (e) => {
                  copyInfo(e, String(orderMoneyOrange));
                }
              "></i>

            </div>



            <div class="cutdowntime" style="font-size: 3.7333rem; font-weight: 600;">
              <span>支付倒计时:</span>
              <span class="time">{{ cutdownMinutes }}分</span>
              <span class="time">{{ cutdownSeconds }}秒</span>
            </div>

            <!-- 文本信息卡片 -->
            <div class="text-info card" v-if="textConfigInfo.texts.length > 0">

              <div class="txt-info-item" v-for="info in textConfigInfo.texts" :key="info.sort">
                <div class="txt-right">
                  <span style="margin-left: 2.6667rem;">如需验证收款人姓名，请填写：</span>
                  <span style="color: red;  word-wrap: break-word; letter-spacing: -0.16rem;">{{ info.textValue
                    }}</span>

                  <i class="el-icon-copy-document btn-copy-1" @click="(e) => {
                    copyInfo(e, info.textValue);
                  }"></i>

                </div>
                <span class="txt-right">
                </span>
              </div>
            </div>

            <div class="warning">
              请在有效时间内按上方订单金额支付，此码只能付款一次，如超时支付、重复支付、付错金额导致无法到账，损失需自己承担，平台概不负责！！！
            </div>


            <div class="qr-box" style="text-align: center;" >
              <!-- <div class="info"> 请认准TRC20公链+仔细核对，以免造成损失！ </div> -->
              <!-- <div class="qr" ref="qrCode"> -->
                <!-- <MyQrCode v-if="textConfigInfo.texts[0]" :value="textConfigInfo.texts[0].textValue"></MyQrCode> -->
                 <img style="width: 69.3333rem;" :src="qrConfig.qrUrl" alt="" />
              <!-- </div> -->
              <!-- <div @click="saveAsImage($refs.qrCode)"
                style="text-align: center; color: #217eff; font-size: 3.2rem;margin-top: 4rem; ">保存二维码</div> -->
            </div>

            <div class="tip">
              支付说明：使用支付宝扫码，直接完成支付或者截屏保存二维码，打开支付宝扫一扫，点击相册选择截图二维码，完成支付
            </div>

            <!-- 提交信息卡片 -->

            <!-- 按钮信息卡片 -->

            <!-- 银行组件卡片  -->

            <div class="service card" v-if="baseInfo.isOnlineService" style="margin-top: 4rem">
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button type="success" style="width: 30%; margin-bottom: 2.67rem"
                    @click="openChat()">在线客服</el-button>
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

    <el-dialog :visible.sync="submit_visiual" title="请输入付款人姓名" class="error-dialog" :close-on-click-modal="false"
      :show-close="false" width="90.00rem">

      <div style="text-align: center; margin-bottom: 2.67rem;font-size: 14px;color: red; font-weight: 600;">
        请正确填写付款支付宝号的真实姓名</div>

      <el-form ref="submitDialogRef" :model="submitForm" label-position="top" label-width="32.00rem">
        <el-form-item label="" :rules="[
          {
            required: true,
            message: '请输入' + baseInfo.submitTitle,
            trigger: 'blur',
          },
        ]
          " prop="submitValue">
          <el-input v-model="submitForm.submitValue" :placeholder="'请输入' + baseInfo.submitTitle"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: center">
        <el-button style="width: 100%;" @click="onSubmitBtnOk()" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="info_dialog_visiual" title="本单只需支付" class="error-dialog" :close-on-click-modal="false"
      :show-close="false" width="90.00rem">

      <div style="text-align: center; margin-bottom: 2.67rem;font-size: 5.3333rem;color: red; font-weight: 600;">
        ￥{{ orderMoneyOrange }}</div>

      <div style="text-align: center; margin-bottom: 2.67rem;font-size: 14px;color: black; ">
        一定要复制金额粘贴到付款界面完成付款，严格按照提示金额付款，否则不回调，不补单，不查单，损失自行承担，切记切记！</div>

      <div slot="footer" style="text-align: center">
        <el-button style="width: 100%;" @click=" (e) => {
                    onCopyMoneyBtnOk(e);
                  }" size="small">
          复制金额
        </el-button>
      </div>
    </el-dialog>



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
        submitValue: '',
      },
      info_dialog_visiual: false,
    }
  },
  mounted() {
    console.log('-this.baseInfo.submitPopup--', this.baseInfo.submitPopup);
    
    if (this.baseInfo.submitPopup == 1) {
      this.submit_visiual = true;
    }else{
      this.info_dialog_visiual = true
    }
  },
  methods: {
    
    onCopyMoneyBtnOk(e){
      this.copyInfo(e, String(this.orderMoneyOrange))
      this.info_dialog_visiual = false
    },
    onSubmitBtnOk() {
      console.log("---onSubmitBtnOk--");

      this.$refs.submitDialogRef.validate(async (valid) => {
        console.log("submitDialogRef 提交信息：", valid, this.submitForm);

        if (valid) {
          this.$message.success("提交成功");
          // try {
          //   let ret = await submitPopupInfo({
          //     orderId: this.$store.state.app.orderId,
          //     submitCheckType: this.baseInfo.submitCheckType,
          //     submitPopupContent: this.submitForm.submitValue,
          //   });

          //   if (ret.code == "00000") {
          //     console.log("--------------");
          //     this.$message.success("提交成功");
          //     // 显示收银台
          //     this.show_template = true;
          //     this.closeSubmitDialog();
          //   } else {
          //     this.$message.error("提交失败, 请重新提交！");
          //   }
          // } catch (e) {
          //   console.log('----eee------',e);
          //   console.dir(e.response);
          //   const { status, data } = e.response
          //   if (status == 400) {
          //     // this.submit_visiual = false
          //     // this.error_message_2 = data.message
          //     // this.showTimeoutDialogVisiual = true

          //   }
          // }

        }
      });
    },
    closeSubmitDialog() {
      // 关闭提交弹窗
      this.submit_visiual = false;

      this.info_dialog_visiual = true
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  padding: 0 3.2rem 4rem;
}

::v-deep .el-button--default {
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

        .tip {
          padding: 5.3333rem 5.3333rem 10.6667rem;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      }

      .btn-info {
        text-align: center;
      }
    }
  }
}
</style>
