<template>
  <div class="container">
    <div class="preview">
      <div class="main">
        <div class="warn-box">
          <div>
            请在支付时间内按金额完成付款，此订单只能支付一次。5分钟内未到账，联系客服查单，查单需提供凭证。超24小时不予处理。如超时支付、重复支付、金额错误等无法到账，概不负责。
          </div>
          <div class="warn2">
            不要相信除本页面以内的任何付款方式，被骗概不负责
          </div>
        </div>

        <div class="warn-img">
          <img src="@/assets/img/zfb-tip.png" alt="" />
        </div>

        <div clang="tip1">【请使用支付宝账号转账：秒到账！】</div>

        <div class="time-tip">请在 {{ cutdownMinutes }} 分 {{ cutdownSeconds }} 秒内完成支付</div>

        <div class="order-box">
          <div class="info">
            首页-转账-转到支付宝-输入页面提供的支付宝账户-输入页面上提供的支付宝姓氏首字母
          </div>

          <!-- 文本信息卡片 星雨修改处  开始-->
          <div class="text-info" v-if="textConfigInfo.texts.length > 0">
            <template v-for="info in textConfigInfo.texts">
              <div class="txt-info-item" v-if="info.isShow" :key="info.sort">
                <!-- <div class="txt-info-item" :key="info.sort"> -->
                <span class="txt-left">{{ info.textTitle }} </span>
                <span class="txt-right">{{ info.textValue }} </span
                ><el-button
                  type="primary"
                  @click="
                    (e) => {
                      copyInfo(e, info.textValue);
                    }
                  "
                  >复制</el-button
                >
              </div>
            </template>
            <div class="danger">请完整复制收款账号，不可漏“-”符号！</div>
            <div class="danger">如果收款账号不对，请勿付款！</div>
          </div>
        </div>

        <div class="order-money-box">
          <div>转账金额</div>
          <div class="order-money">￥{{ orderMoney }}</div>
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
        </div>

        <div class="info">
          <div>1、金额错误、延迟支付、重复支付皆不会到账。</div>
          <div>2、若出现24小时后到账提示，请勿付款。</div>
          <div>3、支付后未到账，请联系客服。</div>
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
::v-deep .custom-button{
  padding: 1.6rem 3.2rem;
}
.main {
  background-color: #fff;
  padding: 2.6667rem;
  font-size: 4.2667rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  align-items: center;
  padding-bottom: 5.3333rem;
}
.warn-box {
  // background-color: #fff1cc;
  color: #ff5007;
  font-size: 3.7333rem;
  line-height: 1.5;
  .warn2 {
    color: red;
  }
}
.warn-img {
  border: .2667rem solid #ccc;
  border-radius: 4rem;
  padding: 2.6667rem;
  background-color: #fff9ef;
  img {
    width: 100%;
  }
}
.tip1 {
  font-weight: 600;
  text-align: center;
}
.time-tip {
  font-size: 5.3333rem;
  font-weight: 600;
  color: #ff5007;
}
.order-box {
  border: .2667rem solid #eee;
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
    margin-top: 2.6667rem;
    .txt-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: .2667rem solid #eee;
      line-height: 3;
      padding: 1.3333rem 0;
      .txt-right {
        font-weight: 600;
      }
    }
    .danger {
      text-align: center;
      font-weight: 600;
      color: red;
      line-height: 1.5;
      font-size: 4.8rem;
    }
  }
}
.order-money-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
