<template>
  <div class="container" v-loading="$store.state.app.loading" style="min-height: 100vh">
    <div v-if="show_template">
      <TemplateDefault :responseData="responseData" v-if="templateTheme == '0'">
      </TemplateDefault>

      <TemplateZhiFuBao :responseData="responseData" v-else-if="templateTheme == '1'"></TemplateZhiFuBao>

      <TemplateWeiXin :responseData="responseData" v-else-if="templateTheme == '2'"></TemplateWeiXin>

      <TemplateQQ :responseData="responseData" v-else-if="templateTheme == '3'"></TemplateQQ>

      <TemplateDigitalPay1 :responseData="responseData" v-else-if="templateTheme == '4'"></TemplateDigitalPay1>
     <TemplateUSDT :responseData="responseData" v-else-if="templateTheme == '6'"></TemplateUSDT>

      <TemplateBao :responseData="responseData" v-else-if="templateTheme == '5'"></TemplateBao>
      <TemplateZhiFuBaoWukuang :responseData="responseData" v-else-if="templateTheme == '7'"></TemplateZhiFuBaoWukuang>
      <TemplateLongXing :responseData="responseData" v-else-if="templateTheme == '8'"></TemplateLongXing>

      <TemplateWeiXinWukuang :responseData="responseData" v-else-if="templateTheme == '9'"></TemplateWeiXinWukuang>

      <!-- <TemplateDigitalPay2
        :responseData="responseData"
        v-else-if="templateTheme == '5'"
      ></TemplateDigitalPay2> -->
    </div>

    <div v-loading.fullscreen.lock="$store.state.app.loading" v-else></div>


    <el-dialog @close="tutorialDialogClose()" :visible.sync="tutorial_visiual" class="look-dialog" title="查看教程"
      :show-close="false" :close-on-click-modal="false" width="300px">
      <!-- <div>loading...</div> -->
      <!-- <div
        v-for="(item, index) in baseInfo.tutorialFilesUrl"
        :key="item.url + '-' + index"
        v-loading="!item.url"
      >
        <el-image :src="item.url" style="min-width: 40px; min-height: 40px">
        </el-image>
      </div> -->

      <div class="swiper-container">
        <swiper ref="swiper" :options="swiperOptions">
          <swiper-slide v-loading="!item.url" v-for="(item, index) in baseInfo.tutorialFilesUrl" :key="index">
            <el-image :src="item.url" style="min-width: 40px; min-height: 40px">
            </el-image>
          </swiper-slide>
          <!-- 导航按钮、分页器等组件 -->
          <div class="swiper-pagination" slot="pagination"></div>
          <!--  <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div> -->
        </swiper>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="tutorial_visiual = false" size="small">
          {{ baseInfo.tutorialButtonName || "关闭" }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="submit_visiual" title="提交弹窗信息" class="error-dialog" :close-on-click-modal="false"
      :show-close="false" width="300px"  >
      <el-form ref="submitDialogRef" :model="submitForm" label-position="top" label-width="120px">
        <el-form-item :label="baseInfo.submitTitle" :rules="baseInfo.submitCheckType == 0
          ? []
          : [
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
        <el-button class="btn" @click="onSubmitBtnOk()" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="show_error_page" title="温馨提示" class="error-dialog" :close-on-click-modal="false"
      :show-close="false" width="300px">
      <div class="msg">
        <div>{{ error_msg }}</div>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button class="btn" @click="show_error_page = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showTimeoutDialogVisiual" title="温馨提示" class="error-dialog" :close-on-click-modal="false"
      :show-close="false" width="300px">
      <div class="msg">
        <div>订单已超时，请关闭窗口！</div>
      </div>
      <!-- <div slot="footer" style="text-align: center">
        <el-button class="btn" @click="closeWindow()">
          关闭
        </el-button>
      </div> -->
    </el-dialog>


  </div>
</template>

<script>
import TemplateDefault from './components/template-default.vue'
import TemplateZhiFuBao from './components/template-zhifubao.vue'
import TemplateWeiXin from './components/template-weixin.vue'
import TemplateQQ from './components/template-qq.vue'
import TemplateDigitalPay1 from './components/template-digital-pay1.vue'
import TemplateDigitalPay2 from './components/template-digital-pay2.vue'

import { getTemplateInfo } from '@/api/template-create.js'

import TemplateUSDT from "./components/template-usdt.vue";

import { getFileById, uploadFileToServer } from "@/api/upload";

import TemplateBao from "./components/template-default-hongxing.vue";
import TemplateZhiFuBaoWukuang from "./components/template-zhifubao-wukuang.vue";
import TemplateLongXing from "./components/template-longxing.vue";
import TemplateWeiXinWukuang from "./components/template-weixin-wukuang.vue";


import { swiper, swiperSlide } from "vue-awesome-swiper";
// import "swiper/css/swiper.css";
import 'swiper/swiper-bundle.css';

export default {
  name: 'TemplatePreview',
  data() {
    return {
      swiperOptions: {
        // Swiper 配置项，与官方文档一致
        loop: false,
        // autoplay: {
        //   delay: 13000,
        //   disableOnInteraction: false,
        // },
        autoplay: false,
        pagination: {
          el: ".swiper-pagination",
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },

      templateTheme: "", // 模板样式 0 无主题   1  支付宝   2  微信
      responseData: {},
      baseInfo: {},
      tutorial_visiual: false,
      submit_visiual: false,
      show_template: false,
      submitForm: {
        submitValue: "",
      },
      cipherInfo: {},
      show_error_page: false,
      error_msg: "",

      showTimeoutDialogVisiual: false, // 超时弹窗
      timeoutCount: 10, // 超时弹窗内容
      timeoutFlag: null, // 超时弹窗定时器
    }
  },
  components: {
    TemplateDefault,
    TemplateZhiFuBao,
    TemplateDigitalPay1,
    TemplateUSDT,
    TemplateBao,
    TemplateZhiFuBaoWukuang,
     TemplateWeiXinWukuang,
    TemplateLongXing,
    TemplateDigitalPay2,
    TemplateQQ,
    TemplateWeiXin,
    swiper,
    swiperSlide,
  },

  methods: {
    
    tutorialDialogClose() {
      this.tutorial_visiual = false;
      this.showSubmitDialog();
    },

    // 显示提交弹窗，如果需要的话
    showSubmitDialog() {
      if (this.baseInfo.submitPopup == 1) {
        this.submit_visiual = true;
      } else {
        // 没有提交弹窗，直接显示收银台
        this.show_template = true;
      }
    },

    onSubmitBtnOk() {
      console.log("---onSubmitBtnOk--");

      this.$refs.submitDialogRef.validate(async (valid) => {
        console.log("submitDialogRef 提交信息：", valid, this.submitForm);

        if (valid) {

          // let ret = await submitPopupInfo({
          //   orderId: this.cipherInfo.orderId,
          //   submitCheckType: this.baseInfo.submitCheckType,
          //   submitPopupContent: this.submitForm.submitValue,
          // });

          // if (ret.code == "00000") {
          //   console.log("--------------");
          //   this.$message.success("提交成功");
          //   // 显示收银台
          //   this.show_template = true;
          //   this.closeSubmitDialog();
          // } else {
          //   this.$message.error("提交失败, 请重新提交！");
          // }


          this.$message.success("提交成功");
          // 显示收银台
          this.closeSubmitDialog();
          this.show_template = true;

        }
      });
    },

     closeSubmitDialog() {
      // 关闭提交弹窗
      this.submit_visiual = false;
    },

    showTutorialDialog() {
      // 处理文件
      if (
        this.baseInfo.isTutorialPopup == 0 ||
        !this.baseInfo.tutorialFilesUrl
      ) {
        // 没有弹窗教程
        this.tutorial_visiual = false;
        this.baseInfo.tutorialFilesUrl = [];

        this.showSubmitDialog();
      } else {
        // 获得教程图片

        this.tutorial_visiual = true;

        const fileIds = this.baseInfo.tutorialFilesUrl.split(",");
        this.baseInfo.tutorialFilesUrl = [];

        fileIds.forEach((item) => {
          this.baseInfo.tutorialFilesUrl.push({
            url: "",
            name: "",
            fileId: item,
          });

          getFileById(item).then((res) => {
            let fileItems = this.baseInfo.tutorialFilesUrl.find(
              (ele) => ele.fileId == item
            );
            fileItems.url = res.data.fileUrl;
            fileItems.name = res.data.originalName;

            this.$forceUpdate();

            // this.$nextTick(() => {
            //   this.$refs.swiper.$swiper.update()
            // })

          });
        });
      }
    },

    async getTemplateDetail() {
      let res = await getTemplateInfo(this.cashTemplateId)
      this.templateTheme = res.data.baseInfo.themeColor
      this.baseInfo = res.data.baseInfo
      this.responseData = res

      this.showTutorialDialog();

    },

    detectDeviceType() {
      const ua = navigator.userAgent.toLowerCase();
      // 先检查是否为移动设备
      const isMobile = /mobile/i.test(ua);
      // 再判断是否为平板设备
      if (
        (isMobile && /tablet|ipad|android(?!.*mobile)|kindle|silk/i.test(ua)) ||
        (window.innerWidth >= 768 && window.innerWidth <= 1024 && isMobile)
      ) {
        return 'pad';
      }

      // 判断是否为手机设备
      if (isMobile && !/ipad/i.test(ua)) {
        return 'phone';
      }

      // 剩下的情况就认为是PC设备
      return 'pc';
    },

    setRootFontSize() {

      let deviceType = this.detectDeviceType()

      let screenWidth = 900;
      if (deviceType == 'phone') {
        screenWidth = window.innerWidth
      } else if (deviceType == 'pad') {
        screenWidth = window.innerWidth
      } else if (deviceType == 'pc') {
        screenWidth = 400
      }


      const htmlElement = document.documentElement;
      const fontSize = screenWidth / 100; // 屏幕宽度的 100 分之一
      htmlElement.style.fontSize = `${fontSize}px`;
    },

  },
  mounted() {
    this.cashTemplateId = this.$route.query.templateId
    this.getTemplateDetail()
    this.setRootFontSize()
  }
}
</script>


<style lang="scss">

.swiper-container {
  width: 100%;
  min-height: 300px;
}

.error-dialog {
  .el-dialog {
    border-radius: 20px;

    .el-dialog__header {
      text-align: center;
      font-weight: 700;
      border-bottom: 1px solid #eee;
    }

    .msg {
      color: #c00;
      text-align: center;
      line-height: 30px;
      font-size: 16px;
    }

    .btn {
      border-color: #c00;
      color: #c00;
      height: 40px;
      line-height: 40px;
      padding: 0;
      width: 60%;
      font-size: 16px;
      border-radius: 20px;
    }
  }
}

.look-dialog {
  .el-dialog {
    border-radius: 20px;
  }
  .el-dialog__body{
    padding: 20px;
  }
  .el-dialog__header {
    text-align: center;
    font-weight: 700;
    border-bottom: 1px solid #eee;
  }
  .el-dialog__footer{
    padding-top: 0;
  }
}
</style>

