<template>
  <div class="container">
    <!-- <div class="tt">自定义收银台模板</div> -->
    <div class="body">
      <div class="preview">

        <div class="main">
          <div class="logo" :style="{ background: baseProp.headBgColor }">
            <img
              style="height: 50px; margin-right: 15px"
              :src="require('@/assets/img_bank/' + this.logoUrl[this.baseProp.logoIndex].icon)"
              alt=""
            />
            <span class="title">{{ baseProp.title }}</span>
          </div>

          <!-- 基础信息卡片 -->
          <div class="base-info card-item">
            <div class="order-money">订单金额：￥100</div>
            <span class="hr"></span>
            <div style="line-height: 26px" v-if="baseProp.isHaveRemark">
              {{ baseProp.remarkText }}：88888
            </div>
            <div style="line-height: 26px" v-if="!baseProp.isHideOrderNum">订单号：xxxx</div>
            <div style="line-height: 26px">请在 <span style="color: blue">xxx</span> 秒内支付</div>
          </div>

          <!-- 文本信息卡片 -->
          <div
            class="text-info  card-item"
            v-if="textConfigInfo.textConfigInfoList.filter((el) => el.isShow).length > 0"
          >
            <div
              class="txt-info-item"
              style="line-height: 26px; text-align: center"
              v-for="info in textConfigInfo.textConfigInfoList.filter((el) => el.isShow)"
              :key="info.id"
            >
              <span style="text-align: right"
                >{{ info.label }} <span v-if="info.label.length > 0">：</span></span
              >
              <span style="text-align: left"
                ><span style="margin-right: 20px">文本值</span>
                <el-button type="text">复制</el-button></span
              >
            </div>
          </div>

          <!-- 二维码卡片 -->
          <div
            class="text-info  card-item"
            v-if="qrCodeConfigInfo.isEnable && qrCodeConfigInfo.isShow"
          >
            <div style="text-align: center">
              <img src="@/assets/img/qr-code.png" width="160" alt="" class="mt-10" />
            </div>
          </div>

          <!-- 提交信息卡片 -->
          <div
            class="submit-info  card-item"
            v-if="submitConfigInfo.submitConfigInfoList.length > 0"
          >
            <div
              class="submit-info-item"
              v-for="info in submitConfigInfo.submitConfigInfoList"
              :key="info.id"
              style="margin-bottom: 20px"
            >
              <div class="mr-10" style="width: 30%; text-align: right">
                <span>{{ info.label }}</span>
              </div>

              <div style="width: 60%">
                <el-button v-if="info.showType == 1" type="primary">选择图片</el-button>
                <el-input v-else></el-input>
              </div>
            </div>
            <div style="text-align: center" class="mt-10">
              <el-button type="primary">确定</el-button>
            </div>
          </div>

          <!-- 按钮信息卡片 -->
          <div class=" card-item" v-if="buttonConfigInfo.isEnable">
            <div class="btn-info" v-for="info in buttonConfigInfo.btnList" :key="info.id">
              <div class="btn-info-item">
                <img
                  v-if="info.showModes.includes('2')"
                  src="@/assets/img/qr-code.png"
                  width="90"
                  alt=""
                  class="mt-10"
                />
                <!-- <div id="qrcode"></div> -->
                <span
                  v-if="info.showModes.length == 2"
                  style="color: red; font-size: 10px; margin: 8px"
                  >点击跳转，或者 扫码跳转</span
                >
                <el-button
                  v-if="info.showModes.includes('1')"
                  type="primary"
                  style="width: 30%; margin-bottom: 10px"
                  >{{ info.label }}</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

import { mapMutations } from 'vuex'

import { BankInfoList } from '@/utils/constants'

export default {
  name: 'TemplateCreate',
  components: { Tinymce },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,

      id: '', // 表明当前是 新建的，还是 预览之前的
      activeName: 'tab1',

      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgba(22, 212, 107, 1)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],

      baseProp: {
        title: '微信支付',
        logoIndex: 0,
        //预定义颜色
        headBgColor: '#16d46b',
        isHideOrderNum: false,
        isHaveRemark: true,
        remarkText: '验证码',

        isShowPopup: true, // 是否显示提示弹窗口
        popupTitle: '', // 提示窗口标题
        popFormat: '1',
        popupFilterWord: '', // 提示窗口过滤词

        isShowTeach: true, // 是否显示教程弹窗
        teachBtnTxt: '查看教程',
        teachContent: '', // 教程内容
        isTeachEnable: false, // 是否显示教程按钮
        isOnlineServer: false // 是否显示在线客服
      },

      componentsConfig: {
        isBankEnable: false // 银行组件
      },

      // 文本配置
      textConfigInfo: {
        textConfigInfoList: [
          {
            label: '标题',
            isShow: true,
            showType: '0',
            paramsName: '',
            length: 2,
            isRequest: true, // 是否必填
            id: 'text' + Date.now()
          }
        ]
      },

      // 提交信息
      submitConfigInfo: {
        submitConfigInfoList: [
          {
            label: '标题',
            showType: '0',
            checklist: [],
            id: 'text' + Date.now()
          }
        ]
      },

      // 按钮配置
      buttonConfigInfo: {
        isEnable: true,
        btnList: [
          {
            label: '按钮',
            showModes: ['1'], // 1 按钮 2 二维码
            jumpUrl: '',
            paramsList: [
              {
                params: 'appId',
                paramsName: '应用ID',
                remark: 'remark',
                id: 'para' + Date.now()
              }
            ],
            id: 'text' + Date.now()
          }
        ],
        id: 'text' + Date.now()
      },

      // 二维码配置
      qrCodeConfigInfo: {
        isEnable: true,
        isShow: false,
        parseMode: 1
      },

      // 二维码配置
      fileConfigInfo: {
        fileList: [
          {
            label: '标题',
            remark: '说明',
            id: 'file' + Date.now()
          }
        ]
      },
      // 上传文件
      fileList: [],
  
      logoUrl: BankInfoList
    }
  },
  methods: {
    

    ...mapMutations({
      addTemplate: 'gcode-state/addTemplateList'
    }),

    
    // saveTemplate() {
    //   // 保存模板
    //   // 预览页面
    //   let templateData = {
    //     id: this.id || Date.now(),
    //     baseProp: this.baseProp,
    //     componentsConfig: this.componentsConfig,
    //     textConfigInfo: this.textConfigInfo,
    //     submitConfigInfo: this.submitConfigInfo,
    //     buttonConfigInfo: this.buttonConfigInfo,
    //     qrCodeConfigInfo: this.qrCodeConfigInfo,
    //     fileConfigInfo: this.fileConfigInfo
    //   }

    //   this.addTemplate(templateData)

    //   this.$message({
    //     type: 'success',
    //     message: '保存成功'
    //   })
    // },
    // preview() {
    //   // 预览页面
    //   let templateData = {
    //     id: this.id || Date.now(),
    //     baseProp: this.baseProp,
    //     componentsConfig: this.componentsConfig,
    //     textConfigInfo: this.textConfigInfo,
    //     submitConfigInfo: this.submitConfigInfo,
    //     buttonConfigInfo: this.buttonConfigInfo,
    //     qrCodeConfigInfo: this.qrCodeConfigInfo,
    //     fileConfigInfo: this.fileConfigInfo
    //   }
    //   localStorage.setItem('templateData', JSON.stringify(templateData))
    //   window.open('http://localhost:9527/#/template-preview', '_blank')
    // },

    
    // onImageChange(file, filelist) {
    //   let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   if (currIndex > -1) {
    //     let currItem = this.imageCompList[currIndex]
    //     currItem.file = file

    //     if (file) {
    //       const reader = new FileReader()
    //       reader.onload = (e) => {
    //         currItem.url = e.target.result
    //       }
    //       reader.readAsDataURL(file.raw)
    //     }
    //   } else {
    //     console.error('找不到当前图片')
    //   }
    // },
    // onImageRemove() {
    //   let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   this.imageCompList[currIndex].file = null
    // }
  },
  created() {
    // console.log('this.$store.state[gcode-state].currEditIndex : ' + this.$store.state['gcode-state'].currEditIndex);
    
    // if (this.$store.state['gcode-state'].currEditIndex != -1) {
    //   let templateData =
    //     this.$store.state['gcode-state'].templateList[
    //       this.$store.state['gcode-state'].currEditIndex
    //     ]
    //     console.log('-----templateData------');
    //     console.log(templateData);
        
        
    //   if (templateData) {
    //     // this.id = templateData.id
    //     // this.baseProp = templateData.baseProp
    //     // this.componentsConfig = templateData.componentsConfig
    //     // this.textConfigInfo = templateData.textConfigInfo
    //     // this.submitConfigInfo = templateData.submitConfigInfo
    //     // this.buttonConfigInfo = templateData.buttonConfigInfo
    //     // this.qrCodeConfigInfo = templateData.qrCodeConfigInfo
    //     // this.fileConfigInfo = templateData.fileConfigInfo
    //     Object.assign(this, templateData)
    //   }
    // }


    let templateData = localStorage.getItem('templateData')
    if (templateData) {
      let templateDataObj = JSON.parse(templateData)
      // this.baseProp = this.templateData.baseProp
      // this.textCompList = this.templateData.textCompList
      // this.inputCompList = this.templateData.inputCompList
      // this.buttonCompList = this.templateData.buttonCompList
      // this.isShowQrCode = this.templateData.isShowQrCode
      // this.uploadFileList = this.templateData.uploadFileList

      Object.assign(this, templateDataObj)

    }



  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  min-height: 100vh;
  // background-color: aquamarine;
  // padding: 20px;

  .tt {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .body {
    display: flex;
    align-items: stretch;
    min-height: 100vh 
  }
  .preview {
    // width: 500px;
    // height: 400px;
    background-color: #f1f1f1;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;

    .tip {
      text-align: center;
    }
    .main {
      width: 400px;
      min-height: 400px;
      margin: 0 auto;
      margin-top: 10px;

      .logo {
        width: 100%;
        height: 100px;
        background-color: #16d46b;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .title {
          font-size: 20px;
          color: #fff;
        }
      }

      .base-info {
        text-align: center;
        padding-top: 30px;
        .order-money {
          color: red;
          font-weight: bold;
          padding-bottom: 15px;
        }
      }
      .card-item {
       background-color: #fff; 
      }

      .txt-info-item {
        display: flex;
        align-items: center;
        span {
          flex: 1;
        }
      }
      .submit-info-item {
        display: flex;
        align-items: center;
        justify-content: center;
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
    }
  }

}
</style>
