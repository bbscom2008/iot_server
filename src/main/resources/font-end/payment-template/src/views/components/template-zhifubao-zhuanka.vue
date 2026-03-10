<template>
  <div class="container">
    <div class="preview">
      <div class="main">
        <div class="card">
          <div class="txt-info-item">
            <span class="txt-left">订单号 </span>
            <span class="txt-right">{{ showOrderNum }} </span
            ><el-button
              type="primary"
              round
              @click="
                (e) => {
                  copyInfo(e, orderNum ? orderNum : sysOrderNum);
                }
              "
              >复制</el-button
            >
          </div>

          <div class="txt-info-item" style="justify-content: center">
            <div>提交时间：</div>
            <div class="time-tip">
              {{ cutdownMinutes }} : {{ cutdownSeconds }}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="txt-info-item">
            <span class="txt-left">验证码 </span>
            <span class="txt-right red">{{ remarkContent }} </span
            ><el-button
              type="primary"
              round
              @click="
                (e) => {
                  copyInfo(e, remarkContent);
                }
              "
              >复制</el-button
            >
          </div>
        </div>

        <div class="order-box card">
          <!-- 文本信息卡片 星雨修改处  开始-->
          <div class="text-info" v-if="textConfigInfo.texts.length > 0">
            <template v-for="info in textConfigInfo.texts">
              <div class="txt-info-item" v-if="info.isShow" :key="info.sort">
                <!-- <div class="txt-info-item" :key="info.sort"> -->
                <span class="txt-left">{{ info.textTitle }} </span>
                <span class="txt-right red">{{ info.textValue }} </span
                ><el-button
                  type="primary"
                  round
                  @click="
                    (e) => {
                      copyInfo(e, info.textValue);
                    }
                  "
                  >复制</el-button
                >
              </div>
            </template>
          </div>
        </div>

        <div class="card">
          <div class="txt-info-item">
            <span class="txt-left">转账金额 </span>
            <span class="txt-right red">￥{{ orderMoney }} </span
            ><el-button
              type="primary"
              round
              @click="
                (e) => {
                  copyInfo(e, orderMoney);
                }
              "
              >复制</el-button
            >
          </div>
        </div>

        <!-- <div class="order-money-box">
          <div>转账金额</div>
          <div class="order-money red">￥{{ orderMoney }}</div>
          <el-button
            type="primary"
            class="copy-order-money"
            @click="
              (e) => {
                copyInfo(e, orderMoney);
              }
            "
            >复制</el-button
          >
        </div> -->

        <!-- <div class="info">
          <div>1、金额错误、延迟支付、重复支付皆不会到账。</div>
          <div>2、若出现24小时后到账提示，请勿付款。</div>
          <div>3、支付后未到账，请联系客服。</div>
        </div> -->

        <div class="card" v-if="baseInfo.paymentTutorialUrl.length > 0">
          <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";

export default {
  name: "TemplateZhiFuBaoCopyPay",
  mixins: [template],
  data() {
    return {
      showLogo: false, // Logo延迟显示
      showCutdown: false, // 倒计时延迟显示
      showDetails: false, // 详细信息延迟显示
      bgImageLoaded: false, // 背景图延迟加载
    };
  },
  mounted() {
    // ⭐ 性能优化：分阶段显示内容
    // 关键内容（金额、按钮）立即显示（已在模板中）

    // 延迟显示次要内容，优化LCP
    this.$nextTick(() => {
      // 100ms后显示Logo和倒计时
      setTimeout(() => {
        this.showLogo = true;
        this.showCutdown = true;
      }, 100);

      // 200ms后显示详细信息
      setTimeout(() => {
        this.showDetails = true;
      }, 200);

      // 300ms后加载背景图
      setTimeout(() => {
        this.bgImageLoaded = true;
      }, 300);
    });
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
::v-deep .custom-button {
  padding: 1.6rem 5.3333rem;
}
.main {
  background-color: #fff;
  padding: 2.6667rem;
  font-size: 4.2667rem;
  display: flex;
  flex-direction: column;
  gap: 2.6667rem;
  align-items: stretch;
  padding-bottom: 5.3333rem;
  padding-top: 5.3333rem;
}
.red {
  color: red;
}
.card {
  // border: .2667rem solid #ccc;
  border-radius: 4rem;
  padding: 1.3333rem 2.6667rem;
  box-shadow: .5333rem .5333rem 2.6667rem .5333rem rgba(153, 153, 153, 0.2);
}

.txt-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.3333rem 0;
  .txt-right {
    font-weight: 600;
  }
}
.time-tip {
  color: #409eff;
  font-size: 5.3333rem;
  font-weight: 600;
}

.order-box {
  border-radius: 4rem;
  padding: 2.6667rem;
  .info {
    font-size: 5.3333rem;
    line-height: 1.5;
    font-weight: 600;
    background-color: #f8fad3;
    padding: 1.3333rem;
  }

  .text-info {
    .danger {
      text-align: center;
      font-weight: 600;
      color: red;
      line-height: 1.5;
      font-size: 5.6rem;
    }
  }
}
.order-money-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep .rich-content {
  img {
    width: 100%;
  }
  p{
    margin: 2.6667rem 0;
  }
}
</style>
