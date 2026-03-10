<template>
  <div class="container">
    <div class="tt" style="font-weight: bold">收款信息模板</div>
    <div class="body">
      <div class="preview">
        <div class="tip" style="color: green; margin: 20px auto">
          该效果仅供大致预览，具体效果请前往收银台查看
        </div>

        <div class="main">
          <!-- 文本信息卡片 -->
          <div class="text-info qr-code" v-if="textConfigInfo.textConfigInfoList.length > 0">
            <el-form :model="textConfigInfo" label-width="110px">
              <div
                class="txt-info-item"
                v-for="(info, index) in textConfigInfo.textConfigInfoList"
                :key="info.id"
              >
                <el-form-item
                  :required="info.isRequest"
                  :label="info.label"
                  :prop="`info.${index}.value`"
                >
                  <el-input v-model="info.value"></el-input>
                  <div  v-if="info.remark.length>0"  class="red_tip" style="color: red">说明：{{ info.remark }}</div>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <!-- 按钮信息卡片 -->
          <div class="text-info qr-code" v-if="buttonConfigInfo.btnList.length > 0">
            <div class="hr"></div>
            <el-form :model="buttonConfigInfo" label-width="110px">
              <div class="txt-info-item" v-for="info in buttonConfigInfo.btnList" :key="info.id">
                <el-form-item required :label="info.paramName" prop="btnList[0].value">
                  <el-input v-model="info.value"></el-input>
                  <div  v-if="info.remark.length>0"  class="red_tip" style="color: red">说明：{{ info.remark }}</div>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <!-- 二维码 -->
          <div class="qr-code" v-if="qrCodeConfigInfo.isEnable">
            <div class="hr"></div>
            <el-form :modal="qrCodeConfigInfo"  label-width="110px">
              <div>
                <el-form-item label="解析模式">
                  <el-radio-group v-model="qrCodeConfigInfo.parseMode">
                    <el-radio :label="1">上传并解析</el-radio>
                    <el-radio :label="2">仅上传</el-radio>
                    <el-radio :label="3">直接配置数据</el-radio>
                  </el-radio-group>
                  <div class="red_tip" style="color: red">
                    说明：解析充值页面显示新的二维码，无解析直接显示原图。有些二维码不能解析！！！
                  </div>
                </el-form-item>

                <div>
                  <el-form-item
                    label="选择二维码"
                    v-if="qrCodeConfigInfo.parseMode == 1 || qrCodeConfigInfo.parseMode == 2"
                  >
                    <el-upload action="#">
                      <div class="plus">
                        <i class="el-icon-plus" />
                      </div>
                    </el-upload>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="配置数据" v-if="qrCodeConfigInfo.parseMode == 3">
                    <el-input
                      type="textarea"
                      :rows="3"
                      style="width: 300px"
                      resize="none"
                      placeholder="请输入内容"
                      v-model="qrCodeConfigInfo.configData"
                    >
                    </el-input>
                  </el-form-item>
                  
                </div>
              </div>
            </el-form>
          </div>

          <!-- 上传文件 -->
          <div class="qr-code" v-if="fileConfigInfo.fileList.length > 0">
            <div class="hr"></div>
            <el-form :modal="fileConfigInfo"   label-width="110px" >
              <el-form-item
                :label="info.label"
                v-for="info in fileConfigInfo.fileList"
                :key="info.id"
              >
                <el-upload action="#">
                  <el-button type="primary" plain> 选择要上传的文件 </el-button>
                </el-upload>
                <div  v-if="info.remark.length>0"  class="red_tip" style="color: red">说明：{{ info.remark }}</div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <!----------------------- config ---------------- -->

      <div class="config">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
          <!----------------- tab2 -----文本信息配置------- -->
          <el-tab-pane label="文本信息配置" name="tab2">
            <div style="margin-left: 130px; margin-bottom: 20px;">
              <el-button type="primary" plain @click="addText">添加行</el-button>
              <el-button type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="">
              <el-form :model="textConfigInfo" label-width="110px" :inline="true">
                <template v-for="(textInfo, index) in textConfigInfo.textConfigInfoList">
                  <el-form-item label="标题：">
                    <el-input v-model="textInfo.label" placeholder="标题"></el-input>
                  </el-form-item>

                  <el-form-item label="说明：">
                    <el-input v-model="textInfo.remark" placeholder="说明"></el-input>
                  </el-form-item>

                  <el-form-item label="是否必填：">
                    <el-checkbox v-model="textInfo.isRequest">必填</el-checkbox>
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteText(index)">删除</el-button>
                  <i class="hr"></i>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!--------------- tab3 --------提交信息配置------------>
          <!----------- tab4 -------------按钮配置---------------->

          <el-tab-pane label="按钮配置" name="tab4">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addBtnInfo">添加行</el-button>
              <el-button type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :modal="buttonConfigInfo" label-width="110px" :inline="true">

                <template>
                  <div>
                    <el-form-item label="跳转地址：">
                      <el-input
                        v-model="buttonConfigInfo.jumpUrl"
                        size="small"
                        placeholder="按钮名称"
                      ></el-input>
                    </el-form-item>
                  </div>

                  <div v-for="(btnInfo, index) in buttonConfigInfo.btnList">
                    <el-form-item label="参数：">
                      <el-input
                        size="small"
                        v-model="btnInfo.param"
                        placeholder="参数"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="参数名称：">
                      <el-input
                        size="small"
                        v-model="btnInfo.paramName"
                        placeholder="参数名称"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="说明：">
                      <el-input size="small" v-model="btnInfo.remark" placeholder="说明"></el-input>
                    </el-form-item>

                    <el-button type="danger" plain @click="deleteBtnInfo(index)">删除</el-button>
                    <!-- <i class="hr"></i> -->
                  </div>
                </template>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab5 -------------二维码配置---------------->

          <el-tab-pane label="二维码配置" name="tab5">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addBtnInfo" v-if="buttonConfigInfo.isEnable"
                >添加行</el-button
              >
              <el-button type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :modal="qrCodeConfigInfo" label-width="110px" :inline="true">
                <el-form-item label="是否开启：">
                  <el-switch
                    v-model="qrCodeConfigInfo.isEnable"
                    active-text="开启"
                    inactive-text="关闭"
                  >
                  </el-switch>
                </el-form-item>

                <div>
                  <el-form-item label="">
                    <div class="red_tip" style="margin-left: 30px; color: red">
                      说明：解析充值页面显示新的二维码，无解析直接显示原图。有些二维码不能解析！！！
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-tab-pane>

          <!----------- tab6 -------------文件配置---------------->

          <el-tab-pane label="上传文件配置" name="tab6">
            <div style="margin-left: 130px">
              <el-button type="primary" plain @click="addFileInfo">添加行</el-button>
              <el-button type="primary">保存</el-button>
              <el-button>取消</el-button>
            </div>
            <div class="mt-20">
              <el-form :modal="fileConfigInfo" label-width="110px" :inline="true">
                <template v-for="(fileInfo, index) in fileConfigInfo.fileList">
                  <!-- <el-form-item label="标题："> -->
                  <!-- <el-upload
                      class="upload-demo"
                      ref="upload"
                      action="#"
                      :on-preview="handlePreview"
                      :file-list="fileList"
                      :auto-upload="false"
                    >
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <el-button
                        style="margin-left: 10px"
                        size="small"
                        type="success"
                        @click="submitUpload"
                        >上传到服务器</el-button
                      >
                      <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过500kb
                      </div>
                    </el-upload> -->

                  <!-- </el-form-item> -->

                  <el-form-item label="标题：">
                    <el-input v-model="fileInfo.label" placeholder="请输入标题"></el-input>
                  </el-form-item>

                  <el-form-item label="说明：">
                    <el-input v-model="fileInfo.remark" placeholder="请输入说明"></el-input>
                  </el-form-item>

                  <el-button type="danger" plain @click="deleteFileInfo(index)">删除</el-button>
                  <i class="hr"></i>
                </template>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  name: 'TemplateTest',
  data() {
    return {
      activeName: 'tab5',
      //预定义颜色
      headBgColor: '#16d46b',
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

      // 文本配置
      textConfigInfo: {
        textConfigInfoList: [
          {
            label: '标题',
            value: '',
            remark: '',
            isRequest: true, // 是否必填
            id: 'text' + Date.now()
          }
        ]
      },

      textForm: {},

      // 提交信息
      // submitConfigInfo: {
      //   submitConfigInfoList: [
      //     {
      //       label: '标题',
      //       showType: '0',
      //       checklist: [],
      //       id: 'text' + Date.now()
      //     }
      //   ]
      // },

      // 按钮配置
      buttonConfigInfo: {
        jumpUrl: '',
        btnList: [
          {
            paramName: '参数名称',
            param: '参数',
            value: '',
            remark: '',
            id: 'text' + Date.now()
          }
        ],
        id: 'text' + Date.now()
      },

      // 二维码配置
      qrCodeConfigInfo: {
        isEnable: true,
        parseMode: 1,
        configData: ''
      },

      // 上传文件配置
      fileConfigInfo: {
        fileList: [
          {
            label: '标题',
            remark: '',
            id: 'file' + Date.now()
          }
        ]
      },
      // 上传文件
      fileList: [],
    }
  },
  methods: {
    addFileInfo() {
      this.fileConfigInfo.fileList.push({
        label: '标题',
        remark: '',
        id: 'file' + Date.now()
      })
    },
    deleteFileInfo(index) {
      this.fileConfigInfo.fileList.splice(index, 1)
    },
    //------ 按钮配置信息
    addBtnInfo() {
      this.buttonConfigInfo.btnList.push({
        paramName: '占位符',
        param: '标识',
        value: '',
        remark: '',
        id: 'text' + Date.now()
      })
    },
    deleteBtnInfo(index) {
      this.buttonConfigInfo.btnList.splice(index, 1)
    },

    // ----- 文本配置
    addText() {
      this.textConfigInfo.textConfigInfoList.push({
        label: '标题',
        remark: '',
        isRequest: true, // 是否必填
        id: 'text' + Date.now()
      })
    },
    deleteText(index) {
      this.textConfigInfo.textConfigInfoList.splice(index, 1)
    },

    handlePreview(file) {
      console.log('---handlePreview----')
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },

    ...mapMutations({
      addTemplate: 'gcode-state/addTemplateList'
    }),
    deleteUpFile(item) {
      let index = this.uploadFileList.findIndex((ele) => ele.id == item.id)
      this.uploadFileList.splice(index, 1)
    },
    addUpFile() {
      this.uploadFileList.push({
        id: Date.now() + 11,
        label: '',
        fileLabel: ''
      })
    },

    addImage() {
      this.imageCompList.push({
        type: 'image',
        text: '图片',
        file: null, // 图片文件
        url: null, // 图片地址
        id: 'image' + Date.now()
      })
    },
    addQrCode() {
      this.isShowQrCode = true
    },
    deleteQrCode() {
      this.isShowQrCode = false
      this.currSelectCompName = 'body'
    },
    addInputLine() {
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
        id: this.id || Date.now(),
        baseProp: this.baseProp,
        textCompList: this.textCompList,
        inputCompList: this.inputCompList,
        buttonCompList: this.buttonCompList,
        isShowQrCode: this.isShowQrCode,
        uploadFileList: this.uploadFileList
      }

      this.addTemplate(templateData)

      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    preview() {
      // 预览页面
      let templateData = {
        id: Date.now(),
        baseProp: this.baseProp,
        textCompList: this.textCompList,
        inputCompList: this.inputCompList,
        buttonCompList: this.buttonCompList,
        isShowQrCode: this.isShowQrCode,
        uploadFileList: this.uploadFileList
      }
      localStorage.setItem('templateData', JSON.stringify(templateData))
      window.open('http://localhost:9527/#/template-preview', '_blank')
    },

    onImageChange(file, filelist) {
      let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
      if (currIndex > -1) {
        let currItem = this.imageCompList[currIndex]
        currItem.file = file

        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            currItem.url = e.target.result
          }
          reader.readAsDataURL(file.raw)
        }
      } else {
        console.error('找不到当前图片')
      }
    },
    onImageRemove() {
      let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
      this.imageCompList[currIndex].file = null
    }
  },
  mounted() {
    if (this.$store.state['gcode-state'].currEditIndex != -1) {
      let templateData =
        this.$store.state['gcode-state'].templateList[
          this.$store.state['gcode-state'].currEditIndex
        ]
      if (templateData) {
        this.id = templateData.id
        this.baseProp = templateData.baseProp
        this.textCompList = templateData.textCompList
        this.inputCompList = templateData.inputCompList
        this.buttonCompList = templateData.buttonCompList
        this.isShowQrCode = templateData.isShowQrCode
        this.uploadFileList = templateData.uploadFileList
      }
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
  min-height: calc(100vh - 180px);
  // background-color: aquamarine;
  padding: 20px;

  .tt {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .body {
    display: flex;
    align-items: stretch;
    min-height: calc(100vh - 165px);
  }
  .preview {
    width: 600px;
    // height: 400px;
    background-color: #f1f1f1;
    padding-bottom: 30px;

    .tip {
      text-align: center;
    }
    .main {
      width: 500px;
      min-height: 600px;
      margin: 0 auto;
      margin-top: 10px;
      background-color: #fff;
      padding: 20px 10px;

      .base-info {
        text-align: center;
        padding-top: 20px;
        .order-money {
          color: red;
          font-weight: bold;
          padding-bottom: 15px;
        }
      }

      .txt-info-item {
        display: flex;
        align-items: center;
        // margin-bottom: 20px;
        .label {
          flex: 1;
        }
        .input {
          flex: 2;
          margin-right: 15px;
        }
      }
      .submit-info-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-info {
        // display: flex;
        width: 100%;
        // justify-content: flex-start;
        margin-left: 20px;
        // flex-wrap: wrap;
      }

      .qr-code {
        padding: 0 15px;
      }
      .plus {
        width: 80px;
        height: 80px;
        border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
  .config {
    flex: 1;
    // height: 100%;
    // background-color: #f1f1f1;
    margin: 0 15px 0 20px;
    padding: 0 0 0 30px;

    .rich-txt {
      ::v-deep .el-form-item__content {
        width: calc(100% - 130px);
      }
    }

    .base-config {
      ::v-deep .el-select-dropdown__item {
        display: flex;
        align-items: center;
        height: 40px;
        text-align: left;
        padding-left: 10px;
        margin: 5px;
      }
    }
  }
}
</style>
