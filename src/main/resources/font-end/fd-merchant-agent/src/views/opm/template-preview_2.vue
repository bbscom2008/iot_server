<template>
  <div class="container">
    <!-- <div class="tips">自定义收银台模板 -- 创建</div> -->
    <div class="body" @click.stop="currSelectCompName = 'body'">
      <!-- 左侧区域 -->
    
      <!-- 中间区域 -->
      <!-- @click.stop="currSelectCompName = 'main-panel'" -->
      <!-- :class="{ 'curr-select': currSelectCompName === 'main-panel' }" -->
      <!-- :style="{ width: baseProp.panelWidth + 'px', height: baseProp.panelHeight + 'px' }" -->
      <div class="main-panel" name="main-panel">
        <!-- 标题 logo 区域 -->
        <div class="title">
          <img
            style="height: 50px; margin-right: 15px"
            :src="require('@/assets/img/' + this.logoUrl[this.baseProp.logoIndex].name)"
            alt=""
          />
          <span>{{ baseProp.title }}</span>
        </div>

        <div class="content">
          <div class="static">
            <!-- 以下信息收服务器返回  -->
            <div class="money info"><em>支付金额：</em><span> ￥ 66.88</span></div>
            <div class="info mt-10"><em>订单号：</em> 12312131313</div>
            <div class="info mt-10"><em>转账备注：</em> xxxxx</div>
            <div class="info2">还有 xx 秒过期</div>
          </div>
          <i class="hr"></i>
          <!-- 内容区域 -->
          <div class="middle">
            <div
              v-if="textCompList.length > 0"
              @click.stop="currSelectCompName = 'text'"
              :class="{ 'curr-select': currSelectCompName === 'text' }"
            >
              <div
                v-for="(item, index) in textCompList"
                :key="item.id"
                class="info"
                :class="{ 'mt-10': index > 0 }"
              >
                <em>{{ item.text }}</em
                >：<span>文本内容</span>
              </div>
            </div>

            <div
              v-if="inputCompList.length > 0"
              @click.stop="currSelectCompName = 'input'"
              :class="{ 'curr-select': currSelectCompName === 'input' }"
            >
              <div v-for="(item, index) in inputCompList" class="mr-10 mt-10" :key="item.id">
                <el-form label-width="100px">
                  <el-form-item :label="item.label">
                    <el-input type="text" size="small"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <el-button type="primary">确认提交</el-button>
            </div>

            <!-- <div v-for="(item, index) in dynamicCompList.filter(ele => ele.type == 'text')" :key="item.id"
              @click.stop="currSelectCompName = item.id" :class="{ 'curr-select': currSelectCompName === item.id }"
              class="mt-10">

              <template v-if="item.type == 'text'" class="text">
                <span>{{ item.text }}</span>：<em>文本内容</em>
              </template>

<template v-else-if="item.type == 'image'">
                <img v-if="item.url" :src="item.url" alt="">
                <img v-else src="@/assets/img/test-img.png"></img>
              </template>

<template v-else-if="item.type == 'qrcode'">
                <img src="@/assets/img/qr-code.png" width="160" alt="">
              </template>

<template v-else-if="item.type == 'input'">
                <el-form label-width="110px">
                  <el-form-item :label="item.label">
                    <el-input  type="text"  size="small"></el-input>
                  </el-form-item>
                </el-form>
              </template>

</div> -->

            <!-- <template v-if="dynamicCompList.filter(ele => ele.type == 'input').length > 0">
              <div v-for="(item, index) in dynamicCompList.filter(ele => ele.type == 'input')" :key="item.id"
                @click.stop="currSelectCompName = item.id" :class="{ 'curr-select': currSelectCompName === item.id }"
                class="mt-10">
                <el-form label-width="110px">
                  <el-form-item :label="item.label">
                    <el-input type="text" size="small"></el-input>
                  </el-form-item>
                </el-form>
              </div>

              <el-button type="primary">确认提交</el-button>
            </template> -->

            <div
              v-if="isShowQrCode"
              @click.stop="currSelectCompName = 'qrcode'"
              :class="{ 'curr-select': currSelectCompName === 'qrcode' }"
            >
              <i class="hr" v-if="textCompList.length > 0 || inputCompList.length > 0"></i>
              <img src="@/assets/img/qr-code.png" width="160" alt="" class="mt-10" />
            </div>
          </div>
        </div>
        <!-- <div class="footer" v-if="dynamicCompList.filter(ele => ele.type == 'button').length > 0">
          <i class="hr"></i>
          <div v-for="(item, index) in dynamicCompList.filter(ele => ele.type == 'button')" :key="item.id"
            @click.stop="currSelectCompName = item.id" :class="{ 'curr-select': currSelectCompName === item.id }"
            class="mt-10">
            <el-button style="width:120px;" :plain="item.isPlain" :type="item.buttonType">{{
              item.label }}</el-button>
          </div>
        </div> -->

        <div
          class="footer"
          v-if="buttonCompList.length > 0"
          @click.stop="currSelectCompName = 'button'"
          :class="{ 'curr-select': currSelectCompName === 'button' }"
          style="border-radius: 0 0 20px 20px"
        >
          <i class="hr"></i>
          <div
            v-for="(item, index) in buttonCompList"
            :key="item.id"
            :class="{ 'mt-10': index > 0 }"
          >
            <el-button style="width: 120px" :plain="item.isPlain" :type="item.buttonType">{{
              item.label
            }}</el-button>
          </div>
        </div>
      </div>
     
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateTest',
  data() {
    return {
      baseProp: {
        templateName: '小荷包',
        logoIndex: 0,
        title: '微信支付',
        isShowPopup: false, // 是否显示提示弹窗口
        popupTitle: '请输入姓名', // 提示窗口标题
        isEnableService: false // 是否开启服务器
      },
      currSelectCompName: 'body',
      // staticCompList: {
      //   logo: {
      //     type: 'logo',
      //     index: 0,
      //   },
      //   title: {
      //     type: 'title',
      //     text: '微信支付',
      //   }
      // },
      // dynamicCompList: [],
      textCompList: [],
      inputCompList: [],
      buttonCompList: [],
      isShowQrCode: false, // 是否显示二维码

      // logoUrlNames: [
      //   'weixin-pay.png',
      //   'zhifu-pay.png',
      //   'zhongguo-pay.png',
      //   'gongshang-pay.png',
      // ],
      // logoNames: [
      //   '微信支付',
      //   '支付宝支付',
      //   '中国银行',
      //   '工商银行',
      // ],
      logoUrl: [
        { name: 'weixin-pay.png', label: '微信支付' },
        { name: 'zhifu-pay.png', label: '支付宝支付' },
        { name: 'zhongguo-pay.png', label: '中国银行' },
        { name: 'gongshang-pay.png', label: '工商银行' }
      ],
      btnTypes: ['primary', 'success', 'warning', 'danger', 'info'],
      uploadFileList:[
        // {
        //   id: 11,
        //   label: '支付宝公钥',
        //   fileLabel:''
        // },
        // {
        //   id: 22,
        //   label: '支付宝公钥',
        //   fileLabel:''
        // }
      ]
    }
  },
  computed: {
    // currSelectComp() {
    //   let item = this.dynamicCompList.find((item) => item.id === this.currSelectCompName)
    //   console.log(item)
    //   return item
    // },
  },
  methods: {
    deleteUpFile(item){
      // this.uploadFileList.splice(this.uploadFileList, 1)
      let index = this.uploadFileList.findIndex(ele => ele.id == item.id)
      this.uploadFileList.splice(index, 1)
    },
    addUpFile(){
      this.uploadFileList.push({
        id: Date.now() + 11,
        label: '',
        fileLabel:''
      })
    },
    addText() {
      // this.dynamicCompList.push({
      //   type: 'text',
      //   text: '提示文本',
      //   id: 'text' + Date.now(),
      //   isCanMove: true,
      // })

      this.textCompList.push({
        text: '提示',
        id: 'text' + Date.now()
      })
    },
    deleteText(index) {
      this.textCompList.splice(index, 1)
      if (this.textCompList.length == 0) {
        this.currSelectCompName = 'body'
      }
    },

    addImage() {
      // this.dynamicCompList.push({
      //   type: 'image',
      //   text: '测试图片',
      //   file: null, // 图片文件
      //   url: null, // 图片地址
      //   id: 'image' + Date.now(),
      //   isCanMove: true,
      // })
    },
    addQrCode() {
      // this.dynamicCompList.push({
      //   type: 'qrcode',
      //   id: 'qrcode',
      //   isCanMove: true,
      // })
      this.isShowQrCode = true
    },
    deleteQrCode() {
      this.isShowQrCode = false
      this.currSelectCompName = 'body'
    },
    addInputLine() {
      // this.dynamicCompList.push({
      //   type: 'input',
      //   label: '测试输入',
      //   value: '',
      //   id: 'input' + Date.now(),
      //   isCanMove: true,
      // })
      this.inputCompList.push({
        label: '提示',
        value: '',
        id: 'input' + Date.now()
      })
    },
    deleteInput(index) {
      this.inputCompList.splice(index, 1)
      if (this.inputCompList.length == 0) {
        this.currSelectCompName = 'body'
      }
    },
    addButton() {
      // this.dynamicCompList.push({
      //   type: 'button',
      //   label: '按钮',
      //   isPlain: false,
      //   buttonType: 'primary',
      //   id: 'button' + Date.now(),
      //   isCanMove: true,
      // })
      this.buttonCompList.push({
        label: '按钮',
        isPlain: false,
        buttonType: 'primary',
        id: 'button' + Date.now()
      })
    },
    deleteButton(index) {
      this.buttonCompList.splice(index, 1)
      if (this.buttonCompList.length == 0) {
        this.currSelectCompName = 'body'
      }
    },
    saveTemplate() {
      // 保存模板
       // 预览页面
       let templateData = {
        baseProp: this.baseProp,
        textCompList: this.textCompList,
        inputCompList: this.inputCompList,
        buttonCompList: this.buttonCompList,
        isShowQrCode: this.isShowQrCode
      }

      this.$store.commit('cashier-template/ADD_TEMPLATE', templateData)

      this.$message({
        type: 'success',
        message: '保存成功'
      })

    },
    preview() {
      // 预览页面
      let templateData = {
        baseProp: this.baseProp,
        textCompList: this.textCompList,
        inputCompList: this.inputCompList,
        buttonCompList: this.buttonCompList,
        isShowQrCode: this.isShowQrCode,
        uploadFileList: this.uploadFileList
      }
      localStorage.setItem('templateData', JSON.stringify(templateData))
      window.open('http://localhost:9527/#/template-preview', '_blank')
    }

    // deleteComp(item) {

    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   console.log('----deleteComp------' + currIndex)
    //   if (currIndex > -1) {
    //     this.dynamicCompList.splice(currIndex, 1)
    //   } else {
    //     console.error('找不到当前组件')
    //   }
    //   // 更新 currSelectCompName
    //   this.currSelectCompName = 'main-panel'
    // },
    // moveUp() {
    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   if (currIndex > 0) {
    //     let temp = this.dynamicCompList[currIndex - 1]
    //     this.dynamicCompList[currIndex - 1] = this.dynamicCompList[currIndex]
    //     this.dynamicCompList[currIndex] = temp
    //     this.$set(this.dynamicCompList, currIndex, temp)
    //   }
    // },
    // moveDown() {
    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   if (currIndex < this.dynamicCompList.length - 1) {
    //     // this.dynamicCompList.splice(currIndex, 1)
    //     // this.dynamicCompList.splice(currIndex + 1, 0, this.currSelectComp)
    //     // [this.dynamicCompList[currIndex], this.dynamicCompList[currIndex + 1]] = [this.dynamicCompList[currIndex + 1], this.dynamicCompList[currIndex]]

    //     let temp = this.dynamicCompList[currIndex]
    //     this.dynamicCompList[currIndex] = this.dynamicCompList[currIndex + 1]
    //     this.dynamicCompList[currIndex + 1] = temp
    //     this.$set(this.dynamicCompList, currIndex + 1, temp)

    //   }
    // },

    // onImageChange(file, filelist) {
    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   if (currIndex > -1) {
    //     let currItem = this.dynamicCompList[currIndex]
    //     currItem.file = file

    //     if (file) {
    //       const reader = new FileReader();
    //       reader.onload = (e) => {
    //         currItem.url = e.target.result;
    //       };
    //       reader.readAsDataURL(file.raw);
    //     }
    //   } else {
    //     console.error('找不到当前图片')
    //   }
    // },
    // onImageRemove() {
    //   let currIndex = this.dynamicCompList.findIndex((item) => item.id === this.currSelectCompName)
    //   this.dynamicCompList[currIndex].file = null
    // }
  },
  mounted() {

    let templateData = localStorage.getItem('templateData')
    if (templateData) {
      this.templateData = JSON.parse(templateData)
      this.baseProp = this.templateData.baseProp
      this.textCompList = this.templateData.textCompList
      this.inputCompList = this.templateData.inputCompList
      this.buttonCompList = this.templateData.buttonCompList
      this.isShowQrCode = this.templateData.isShowQrCode
      this.uploadFileList = this.templateData.uploadFileList
    }

  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

img {
  vertical-align: middle;
}

.curr-select {
  border: 1px solid red;
}

.container {
  background-color: #cbf6f2;
  padding: 10px;
}

.body {
  display: flex;
  min-height: calc(100vh - 150px);
  justify-content: center;

  .left-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    min-height: 100%;
    background-color: #fff;

    .btn-add {
      width: 160px;

      button {
        width: 100%;
      }
    }
  }

  .main-panel {
    // display: flex;
    // flex-direction: column;
    align-self: flex-start;
    width: 400px;
    min-height: 500px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #fff;
    text-align: center;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #16d46b;
      height: 100px;
      font-size: 22px;
      color: #fff;
      font-weight: bold;
    }

    .content {
      // display: flex;
      // flex: 1;
      // flex-direction: column;
      padding: 20px 30px;

      .static {
        .money {
          color: red;

          span {
            font-size: 24px;
          }
        }
      }

      .info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-left: 20px;

        em {
          width: 120px;
          text-align: right;
        }

        .info2 {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }
      }

      // .middle {
        // flex: 1;
      // }

      .text {
        text-align: left;
        padding-left: 15px;
        font-size: 16px;
      }
    }

    .footer {
      padding: 0 30px 20px;
      min-height: 100px;
      text-align: center;
    }
  }

  .right-panel {
    width: 400px;
    min-height: 100%;
    padding: 20px;
    background-color: #fff;

    ::v-deep .el-select-dropdown__item {
      height: 50px;
      text-align: left;
      padding-left: 10px;
      margin: 5px;
    }
  }
}
</style>
