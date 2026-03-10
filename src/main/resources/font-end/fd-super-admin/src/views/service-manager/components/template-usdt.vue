<template>
  <div class="container" style="width: 400px;margin: 0 auto;">
    <div class="body" v-loading="$store.state.app.loading">
      <div class="preview">
        <div class="main">
          

          <div class="payinfo-box-1" style="padding-bottom: 0">

            <div class="logo-box">
              <div class="logo">
              
                <img
                  style="height: 34.9875px; width: 34.9875px"
                  src="@/assets/img_bank/usdt_icon.png"
                  fit="cover"
                  title="logo"
                ></img>

                <span class="title">待付款</span>
              </div>
            </div>

            <div class="order-money-box">
              <div class="order-money">{{ 66 }} USDT</div>
              <i class="el-icon-copy-document btn-copy-1"
                @click="
                  (e) => {
                    copyInfo(e, 66);
                  }
                " ></i>
             
            </div>

            <!-- <div class="text-info card">
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
            </div> -->

            <div class="cutdowntime">
              <span>请在</span>
              <span class="time" >{{ cutdownMinutes }}:</span>
              <span class="time" >{{ cutdownSeconds }}s</span>
              <span>内完成支付</span>
            </div>


            

           

            <!-- 文本信息卡片 -->
            <div class="text-info card" >

              <div
                class="txt-info-item"
              >
                <div class="txt-left"
                  >
                  <img src="@/assets/img/ttrc.png" alt=""  style="width: 48.75px; " >
                  <!-- {{ info.textTitle }} -->
                    <span style="margin-left: 10.0001px;">TRC20充币地址</span>
                </div >
                <span class="txt-right"
                  ><span style="word-wrap: break-word; letter-spacing: -0.6px;" >ser234asffghe567tyudzg234</span>
                  
                  <i class="el-icon-copy-document btn-copy-1"
                    @click=" (e) => {
                      copyInfo(e, 'ser234asffghe567tyudzg234');
                    } " ></i>
                  </span
                >
              </div>
            </div>

            <div class="qr-box" >
              <div class="info"> 请认准TRC20公链+仔细核对，以免造成损失！ </div>
              <div class="qr" ref="qrCode" >
                <MyQrCode  value="ser234asffghe567tyudzg234"></MyQrCode>
                <svg-icon iconClass="trc20" style="width: 40px; height: 40px;
                position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);
                background-color: white;
                border: 1.9999px solid #fff; border-radius: 50%; " ></svg-icon>
              </div>
              <div @click="saveAsImage($refs.qrCode)" style="text-align: center; color: #217eff; font-size: 12px;margin-top: 15px; " >保存二维码</div>
            </div>


           <div class="info-box">
            <div class="txt-order-no" >
              <span class="txt-left"> 币种</span>

              <div>
                <svg-icon iconClass="trc20" style="width: 20px; height: 20px;" ></svg-icon>
                <span class="value" style="margin-left: 6px;" >USDT</span>
              </div>
            </div>

            <div class="txt-order-no" >
              <span class="txt-left"> 公链协议</span>
              <div class="value">
                <img src="@/assets/img/ttrc.png" alt=""  style="width: 48.75px; " >
                <span>TRC20</span>
                <i class="el-icon-copy-document btn-copy-1"
                @click="
                  (e) => {
                    copyInfo(e, 'TRC20');
                  }
                " ></i>
              </div>
            </div>

            <div class="txt-order-no" >
              <span class="txt-left">充币数量</span>
              <div class="value">
                <span style="font-weight: 600;" >{{ 66 }}USDT</span>
                  <i class="el-icon-copy-document btn-copy-1"
                @click="
                  (e) => {
                    copyInfo(e, 66);
                  }
                " ></i>
                
              </div>
            </div>



             <div class="txt-order-no" v-if="baseInfo.isShowMerchantOrderNo">
              <span class="txt-left"> 订单号</span>
              <div>
                <span>{{ orderNum }}</span>
              <i class="el-icon-copy-document btn-copy-1"
                @click="
                  (e) => {
                    copyInfo(e, orderNum);
                  }
                " ></i>
              </div>
            </div>

           </div>


            <!-- 提交信息卡片 -->
            

            <!-- 按钮信息卡片 -->
            

            <!-- 银行组件卡片 -->
      

            <div
              class="service card"
              v-if="baseInfo.isOnlineService"
              style="margin-top: 15px"
            >
              <div class="btn-info">
                <div class="btn-info-item">
                  <el-button
                    type="success"
                    style="width: 30%; margin-bottom: 10.0125px"
                    >在线客服</el-button
                  >
                </div>
              </div>
            </div>

            
          </div>

          <div
              class="card pay-course payinfo-box"
              style="padding: 0 15px"
              >
              <!-- v-if="baseInfo.paymentTutorialUrl.length > 0" -->
              <!-- <div class="title-box"> -->
                <!-- <div class="title">注意事项</div> -->
              <!-- </div> -->

              <!-- v-html="baseInfo.paymentTutorialUrl" -->
              <div
                class="rich-content"
              >
            <p style="text-align: left;"><strong>充币说明</strong></p>
            <div class="summary-box" >

              <p style="text-align: left;"><strong>1、币种限制：</strong>以上地址只支持TRC20公链协议的USDT币种，请勿充入其他币种，以免造成损失。</p>
            <p style="text-align: left;"><strong>2、金额限制：</strong>请务必按以上金额进行充币，超出或低于此金额将无法自动上分，需自行联系商户进行补单。</p>
            <p style="text-align: left;"><strong>3、到账时间：</strong>提币到以上地址后，至少需要1个区块链确认才能到账，一般1分钟内完成，请耐心等待区块网络确认。</p>
            <p style="text-align: left;"><strong>4、异常处理：</strong>若存在确认超时、错误、大额误充等情形，请联系钱包客服进行人工处理。</p>
            <p style="text-align: left;"><strong>5、使用正版：</strong>请务必使用正版浏览器、APP等程序，切勿使用破解版、非官方版本，以免被篡改或被盗。</p>
            <!-- <p style="text-align: left;"><strong>6、区块链记录：</strong>一切交易以官方区块链浏览器记录为准，以上地址的区块链记录链接是 <a href="https://tronscan.org/#/address/TTPkSVcKsfwbRCyqRqpEpU3EGELuXTcM6T/transfers" target="_blank">https://tronscan.org/#/address/TTPkSVcKsfwbRCyqRqpEpU3EGELuXTcM6T/transfers</a></p> -->
            </div>
            
            <div class="teacher-box">
              <p style="text-align: left;">常见教程：</p>
              <p style="text-align: left;"><a href="#"  @click.stop="dialogVisible1 = true"  >1. 什么是USDT？</a></p>
              <p style="text-align: left;"><a href="#" @click.stop="dialogVisible2 = true" >2. 如何购买？</a></p>
              <p style="text-align: left;"><a href="#" @click.stop="dialogVisible3 = true" >3. 充币多久能到账？如何查询？</a></p>
              <p style="text-align: left;"><a href="#" @click.stop="dialogVisible4 = true" >4. 充/提币需要手续费吗？</a></p>
              <p style="text-align: left;"><a href="#" @click.stop="dialogVisible5 = true" >5. 充币没到账要怎么处理？</a></p>
            </div>
            
            
            <!-- <p style="text-align: left;"><span style="color: #31c82f;"><strong>NO钱包实力官网NO.com，倡导去中心化精神，支持发薪和批量提币，充提币全网最低0.1U起！</strong></span></p> -->
            
          </div>
            </div>


          <div class="mt-20" v-if="componentsConfig.components">
            <Bank></Bank>
          </div>
        </div>
      </div>


      <div class="answers">
        <el-dialog
          :visible.sync="dialogVisible1"
          width="375px">
          <div slot="title" class="title" style="border-bottom: 1px solid #ccc;padding-bottom: 10px;text-align: center;font-size: 20px;" > 常见教程
          </div>
          <div class="title">什么是USDT?</div>
          <p>
            USDT又称为泰达币(USDT),是由美国Tether公司，为了与美元等值发行的一种代币，即1USDT=1美元，用户可以随时使用USDT与USD进行1:1兑换。为了严格遵守其公司所承诺的1比1保证金，其每增加1枚新的USDT，都会在其银行账户里增加1美元的账户资金，从而保证投资者随用随取的安全性。同时用户可以在 Tether官网平台进行资金查询，以随时监督其资金安全性以保障透明度。
          </p>
          <p>
            USDT可以被传输、存储、使用，就像BTC、ETH或任何其他加密货币一样，用户可以通过主流交易所或NO钱包来进行交易和存储。
          </p>
          <p>
            USDT用起来很简单。在全球各大主流交易平台 OKEX、币安等，可以通过场外交易购买USDT，在币币交易区它可以被用于购买比特币和其它加密货币。USDT也可以非常容易的从交易所移转到任何支持的钱包中。
          </p>

        </el-dialog>

        <el-dialog
          :visible.sync="dialogVisible2"
          width="375px">
          <div slot="title" class="title" style="border-bottom: 1px solid #ccc;padding-bottom: 10px;text-align: center;font-size: 20px;" > 常见教程
          </div>
          <div class="title">如何购买？</div>

          <div class="title">一、通过各大交易所购买，地址如下：</div>
          <p>
            币安交易所：<a href="https:/www.binance.com" target="_blank" >https:/www.binance.com</a>
          </p>
          <p>
            欧易交易所：<a href="https:/www.okex.com" target="_blank" >https:/www.okex.com</a>
          </p>
          <p>gate交易所：<a href="https:/www.gate.io" target="_blank" >https:/www.gate.io</a></p>
          <div class="title">二、中国大陆翻墙vpn：</div>
          <p>Opera浏览器：<a href="https:/www.opera.com/zh-cn" target="_blank" >https:/www.opera.com/zh-cn</a></p>
          <p>PandaFan: <a href="https://pandafan.website/pricing" target="_blank" >https://pandafan.website/pricing</a></p>
          <p>NordVPN: <a href="https://nordvpn.com/zh/" target="_blank" >https://nordvpn.com/zh/</a></p>

        </el-dialog>

        <el-dialog
          :visible.sync="dialogVisible3"
          width="375px">
          <div slot="title" class="title" style="border-bottom: 1px solid #ccc;padding-bottom: 10px;text-align: center;font-size: 20px;" > 常见教程
          </div>


          <div class="title">充币多久到账？</div>
          <p>
            充值经过一定数量的网络确认就可以到账。网络确认是由区块上的网络矿工进行自动确认的，平台是无法干预区块确认的，所以相应的确认时间是不固定的，每个币种所需的确认数不一样，需要以区块的确认为准。
          </p>
          <p>
            欧易交易所：<a href="https:/www.okex.com" target="_blank" >https:/www.okex.com</a>
          </p>
          <p>NO钱包的USDT、USDC一般1—2分钟左右即可到账，BTC一般30分钟到账。</p>

          <div class="title">如何查询充币是否到账？</div>
          <p>如果您充值的是TRC20网络的USDT，可以直接通过tron的区块浏览器查询，经过1个区块确认即代表已经到账 <a href="https:/tronscan.org/" target="_blank" >https:/tronscan.org/</a></p>

        </el-dialog>


        <el-dialog
          :visible.sync="dialogVisible4"
          width="375px">
          <div slot="title" class="title" style="border-bottom: 1px solid #ccc;padding-bottom: 10px;text-align: center;font-size: 20px;" > 常见教程
          </div>


          <div class="title">充/提币需要手续费吗？</div>
          <p>目前各交易所和NO钱包充币入账都是免费的。但是于提币时需要收费，若是通过交易所和NO钱包提币时。根据链种不同最少需要收取0.1USDT作为矿工费。</p>

        </el-dialog>

        <el-dialog
          :visible.sync="dialogVisible5"
          width="375px">
          <div slot="title" class="title" style="border-bottom: 1px solid #ccc;padding-bottom: 10px;text-align: center;font-size: 20px;" > 常见教程
          </div>


          <div class="title">充币没到账要怎么处理？</div>
          <p>区块链资产转账分为三个步骤：</p>
          <p>(1)提出</p>

          <p>(2)区块确认</p> 
          <p>(3)入账</p>

          <p>如果您的充值已有区块确认，NO钱包会直接帮您入账，如果没有入账，您可直接联系客服</p>

        </el-dialog>



      </div>


    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";


import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'

export default {
  name: "TemplateDefault",
  mixins: [template],
  components:{
    MyQrCode
  },
  data(){
    return {
    dialogVisible1: false,
    dialogVisible2: false, 
    dialogVisible3: false,
    dialogVisible4: false,
    dialogVisible5: false,
    
    
    }
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  background-color: white;
  // min-height: calc(100vh - 48rem);
  // background-color: aquamarine;
  // padding: 5.33rem;
  font-size: 13.9875px;

.answers{

  ::v-deep .el-dialog__header{
    padding-bottom: 0;
  }
  .title{
    font-weight: 600;
    color: #000;
    margin: 10px;
  }
  p{
    margin: 10px;
    line-height: 1.8;
    text-indent: 2em;
    word-break: normal;
  }

  a,a:hover, a:active{
    color: #115cd8;
  }

}


  .body {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }

  .preview {
    // width: 100vw;
    background-color: #f8f8f8;
    padding-bottom: 30px;

    .tip {
      text-align: center;
    }

    .main {
      //width: 375px;
      // min-width: 106.67rem;
      margin: 0 auto;
      // margin-top: 2.67rem;
      // padding-top: 13.87rem;
      padding-bottom: 19.9875px;
      background-color: #f1f1f1;
      color: #2b3674;
      // .card {
      // background-color: #fff;
      // border-top: .27rem solid #eee;
      // padding: 5.33rem;
      // }


      .qr-box{
        padding: 10.0001px;
        .info{
          color: #ffaa09;
          font-size: 12px;
        }

        .qr{
          width: 199.9999px;
          margin: 19.9999px auto;
          position: relative;

          .svg-icon{
            
          }

        }

      }


      .logo-box {
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: center;
      }

      .logo {
        // height: 78px;
        // background-color: #ffffffe5;
        border-radius: 21px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 7.9875px 34.9875px;

        img {
          width: 49.9875px;
        }

        .title {
          font-size: 16.0001px;
          margin-top: 10.0001px;
          font-weight: 600;
          color: #ffaa09;
        }
      }

  

      .payinfo-box-1 {
        // width: 94.67rem;
        background-color: #fff;
        // padding: 5.33rem 0;

        margin-inline: 8.7375px;

        // border-radius: 3.2rem;
        // box-shadow: .27rem .27rem 1.07rem rgba(0, 0, 0, 0.195);
        // border-radius: 2.67rem !important;

        // margin: 2.67rem auto;

        .tishi {
          // background-color: #ff3b3014;
          // height: 8rem;
          // border-radius: 4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ff3b30;
          font-size: 15px;
        }

        .btn-copy-1 {
          color: rgb(73, 161, 255);
          font-size: 15.2625px;
          margin-left: 7.5px;
          font-weight: 600;
          // padding: ;
        }

        .order-money-box {
          position: relative;
          padding: 10.0001px 0;
          display: flex;
          justify-content: center;
          align-items: center;

          .arrow {
            width: 34.9875px;
            height: 34.9875px;
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
            margin-left: -93.75px;

            img {
              animation: left-move 0.5s infinite alternate;
            }
          }

          .arrow.right {
            margin-left: 93.75px;

            img {
              animation: right-move 0.5s infinite alternate;
            }
          }

          .order-money {
            color: #000;
            font-weight: bold;
            font-size: 30px;
            // margin-right: 5.33rem;
          }

          .copy-order-money {
            height: 25.9875px;
            line-height: 16.0125px;
            padding: 3px 10.0125px !important;
            margin-left: 4.9875px;
          }
        }

        .py-1 {
          text-align: center;
          color: #ff3b30;
        }

        .qrcode.card {
          width: 160.0125px;
          // height: 210px;
          // background-color: #1777ff;
          margin: 0px auto;
          padding-top: 4.9875px;

          & > div {
            span {
              color: #fff;
            }

            .up-txt {
              font-weight: 600;
              font-size: 16.0125px;
            }

            .down-txt {
              font-size: 12px;
            }

            .img-wrap {
              width: 160.0125px;
              background-color: #fff;
              padding: 10.0125px 10.0125px;
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
          font-size: 13.9999px;
          span {
            color: #333;
          }
          .time{
            color: #ffaa09;
            font-weight: 600;
          }
        }

        .info-box{
          border-top: 1.0001px #eee solid;
          .txt-order-no {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10.0001px;


            .txt-left{
              color: #999;
            }

          }
        }

        .pt-1 {
          text-align: center;
          color: #ff3b30;
          padding: 4.9875px 10.0125px;
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
          font-size: 16.0125px;
          color: #3f528c;
          margin: 30px 0;
        }

        .txt-info-item {
          padding: 10.0125px;
          border: 1.0001px solid #eee;
          border-radius: 10.0001px;
          margin-top: 15px;

          .txt-left {
            color: #999;
            font-size: 13.9999px;
            margin: 10.0001px 0;
          }

          .txt {
            font-size: 33px;
            color: rgb(255, 0, 255);
            // margin-left: 1.33rem;
          }

          .txt-right{
            font-weight: 600;
            margin: 10.0001px 0;
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
          width: 60px;
          height: 60px;
          text-align: center;
          border: 1px solid #eee;
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
        margin-top: 19.9875px;

        .title-box {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10.0125px 15px 0px;
          border-bottom: 1.0125px solid #eee;

          .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 16.0125px;
            width: 145.0125px;
            height: 30px;
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
    border-left: 7.9875px solid var(--w-e-textarea-selected-border-color);
    display: block;
    font-size: 100%;
    line-height: 1.5;
    margin: 10.0125px 0;
    padding: 10.0125px;
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
    padding-left: 19.9875px;
  }

  p {
   word-break: break-all;
   line-height: 1.5;
   font-size: 13.9999px;
   margin: 10.0001px 0;
  }
  a,a:hover, a:active {
    color: #4893fd;
  }
  .teacher-box{
    background-color: #fff;
    padding: 10.0001px;
  }
  .summary-box p{
    margin-left: 19.9999px;
    text-indent: -19.9999px;
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
  .btn-info {
    width: 50%;
    // border: 1.0001px solid #f1f1f1;
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
