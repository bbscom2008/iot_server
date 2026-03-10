<template>
  <div class="container">
    <!-- <div class="tips">自定义收银台模板 -- 创建</div> -->
    <div class="body" @click.stop="currSelectCompName = 'body'">
      <!-- 左侧区域 -->
      <div class="left-panel" @click.stop="">
        <div class="mt-10" style="width: 100%; padding: 10px 20px">添加组件</div>

        <div class="mt-10 btn-add">
          <el-button type="primary" @click="addText">添加文本</el-button>
        </div>
        <div class="mt-10 btn-add">
          <el-button type="primary" @click="addImage">添加图片 -- TT</el-button>
        </div>
        <div class="mt-10 btn-add">
          <el-button type="primary" @click="addInputLine">添加输入框</el-button>
        </div>

        <!-- <div class="mt-10 btn-add">
          <el-button type="primary" @click="addInputLine">添加文件</el-button>
        </div> -->

        <div class="mt-10 btn-add">
          <el-button type="primary" @click="addQrCode" :disabled="isShowQrCode"
            >添加二维码</el-button
          >
        </div>
        <div class="mt-10 btn-add">
          <el-button type="primary" @click="addButton">添加按钮</el-button>
        </div>
      </div>
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
              v-if="imageCompList.length > 0"
              @click.stop="currSelectCompName = 'image'"
              :class="{ 'curr-select': currSelectCompName === 'image' }"
            >
              <i class="hr" v-if="textCompList.length > 0 "></i>
              <div v-for="(item, index) in imageCompList" :key="item.id" :class="{'mt-10': index > 0 }">
                <img v-if="item.url" :src="item.url" alt="">
                <img v-else src="@/assets/img/test-img.png"></img>
              </div>
            </div>

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
      <!-- 右侧区域 -->
      <div class="right-panel" @click.stop="">
        <!-- <el-form ref="form" :model="baseProp" label-width="80px" v-if="currSelectCompName == 'main-panel'">
          主面板属性
          <el-form-item label="面板宽度">
            <el-input v-model="baseProp.panelWidth"></el-input>
          </el-form-item>
          <el-form-item label="面板高度">
            <el-input v-model="baseProp.panelHeight"></el-input>
          </el-form-item>
        </el-form> -->

        <!-- <el-form ref="form" label-width="80px" v-if="currSelectCompName.startsWith('logo')">
          设备 logo 属性
          <el-form-item label="选择logo">
            <el-input v-model="currSelectComp.text"></el-input>
          </el-form-item>
        </el-form> -->

        <el-form
          ref="form"
          :inline="true"
          label-width="80px"
          v-for="(item, index) in textCompList"
          :key="item.id"
          v-if="currSelectCompName.startsWith('text')"
        >
          <div class="mb-10">文本信息配置</div>
          <el-form-item label="文字内容">
            <el-input v-model="item.text"></el-input>
          </el-form-item>
          <el-button size="mini" type="danger" plain @click="deleteText(index)">删除</el-button>
        </el-form>

        <el-form
          ref="form"
          :inline="true"
          v-for="(item, index) in inputCompList"
          :key="item.id"
          label-width="80px"
          v-if="currSelectCompName.startsWith('input')"
        >
          <div class="mb-10">提交信息配置</div>
          <el-form-item label="提示文字">
            <el-input v-model="item.label"></el-input>
          </el-form-item>
          <el-button size="mini" type="danger" plain @click="deleteInput(index)">删除</el-button>
        </el-form>

        <el-form ref="form" label-width="80px" v-if="currSelectCompName.startsWith('qrcode')">
          <div class="mb-10">二维码信息配置</div>
          <div class="tips">二维码只能添加一个</div>
          <el-button size="mini" type="danger" plain @click="deleteQrCode()">删除二维码</el-button>
          <!-- <el-form-item label="文字内容">
            <el-input v-model="currSelectComp.text"></el-input>
          </el-form-item> -->
        </el-form>

        <el-form
          ref="form"
          label-width="80px"
          :inline="true"
          v-if="currSelectCompName.startsWith('button')"
        >
          <div class="mb-20">按钮信息配置</div>

          <div v-for="(item, index) in buttonCompList" :key="item.id">
            <!-- <div class="hr"  v-if="index>0" ></div> -->
            <el-form-item label="文字内容">
              <el-input v-model="item.label"></el-input>
            </el-form-item>
            <!-- <el-form-item label="是否朴素按钮">
              <el-switch v-model="item.isPlain"></el-switch>
            </el-form-item>
            <el-form-item label="按钮类型">
              <el-select filterable  v-model="item.buttonType" placeholder="请选择">
                <el-option v-for="(item) in btnTypes" :key="item" :value="item">
                  <span>{{ item }}</span>
                </el-option>
              </el-select>
              
            </el-form-item> -->
            <el-button size="mini" type="danger" plain @click="deleteButton(index)">删除</el-button>
          </div>
        </el-form>

        <el-form ref="form" label-width="80px" v-if="currSelectCompName.startsWith('image')">
          <div class="mb-10">图片属性</div>
          <el-form-item label="选择图片">
            <el-upload
              action=""
              :auto-upload="false"
              :on-change="onImageChange"
              :on-remove="onImageRemove"
              :file-list="imageFileList"
              :limit="1"
            >
              <i
                class="el-icon-plus"
                style="font-size: 20px; border: 1px solid #ccc; padding: 10px"
              ></i>
            </el-upload>
          </el-form-item>
        </el-form>

        <div v-if="currSelectCompName == 'body'">
          <div class="bm-10">基础信息配置</div>
          <div class="mt-20">
            <el-form :modal="baseProp" label-width="110px">
              <el-form-item label="模板名称">
                <el-input v-model="baseProp.templateName"></el-input>
              </el-form-item>

              <!-- <el-form-item label="选择logo">
                <el-select filterable 
                  v-model="baseProp.logoIndex"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="(item, index) in logoUrl"
                    :key="item.name"
                    :value="index"
                    :label="item.label"
                  >
                    <img
                      class="mr-5"
                      style="height: 100%"
                      :src="require('@/assets/img/' + logoUrl[index].name)"
                      alt=""
                    />
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item label="选择银行">
                <!-- <el-input v-model="baseProp.index"></el-input> -->
                <el-select filterable 
                  v-model="baseProp.logoIndex"
                  placeholder="请选择"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="(item, index) in logoUrl"
                    :key="item.name"
                    :value="index"
                    :label="item.label"
                  >
                    <img
                      class="mr-5"
                      style="height: 100%"
                      :src="require('@/assets/img/' + logoUrl[index].name)"
                      alt=""
                    />
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="备注类型">
                <!-- <el-input v-model="baseProp.index"></el-input> -->

                <el-select filterable 
                  v-model="baseProp.remarkType"
                  placeholder="请选择转账备注类型"
                  size="small"
                >
                  <el-option label="无" value="0"></el-option>
                  <el-option label="随机6位数字" value="1"></el-option>
                  <el-option label="随机字符串" value="2"></el-option>
                  <el-option label="随机邮箱" value="3"></el-option>
                  <el-option label="随机手机号" value="4"></el-option>
                  <el-option label="随机QQ号" value="5"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="设置标题">
                <el-input v-model="baseProp.title"></el-input>
              </el-form-item>

              <i class="hr"></i>

              <el-form-item label="是否显示弹窗">
                <el-switch v-model="baseProp.isShowPopup"> </el-switch>
              </el-form-item>
              <el-form-item label="弹窗提示语" v-if="baseProp.isShowPopup">
                <el-input v-model="baseProp.popupTitle"> </el-input>
              </el-form-item>
              <i class="hr"></i>
              <el-form-item label="是否开启客服">
                <el-switch v-model="baseProp.isEnableService"> </el-switch>
              </el-form-item>

              <i class="hr"></i>
              <el-button type="primary" class="mb-10" @click="addUpFile">添加上传文件</el-button>

              <el-form-item label="文件标题" v-for="item in uploadFileList" :key="item.id">
                <el-input v-model="item.label">
                  <el-button
                    slot="append"
                    @click="deleteUpFile(item)"
                    icon="el-icon-delete"
                  ></el-button>
                </el-input>
              </el-form-item>

              <!-- <el-form-item label="面板宽度">
                <el-input v-model="baseProp.panelWidth"></el-input>
              </el-form-item>
              <el-form-item label="面板高度">
                <el-input v-model="baseProp.panelHeight"></el-input>
              </el-form-item> -->
            </el-form>

            <el-button type="primary" @click="preview()">预览模板</el-button>
            <el-button type="primary" @click="saveTemplate()">保存模板</el-button>
          </div>
        </div>

        <!-- <div v-if="currSelectComp && currSelectComp.isCanMove">
          <el-form v-show="currSelectCompName !== 'main-panel'">
            <el-form-item>
              <el-button size="small" @click="moveUp()">向上移动</el-button>
              <el-button size="small" @click="moveDown()">向下移动</el-button>
              <el-button size="small" type="danger" @click="deleteComp()">删除</el-button>
            </el-form-item>
          </el-form>
        </div> -->
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
      id: '',
      baseProp: {
        templateName: '小荷包',
        logoIndex: 0,
        title: '微信支付',
        isShowPopup: false, // 是否显示提示弹窗口
        popupTitle: '请输入姓名', // 提示窗口标题
        isEnableService: false, // 是否开启服务器
        remarkType:'0'
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
      imageCompList: [],
      buttonCompList: [],
      imageFileList:[],
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
      uploadFileList: [
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
    ...mapMutations({
      addTemplate: 'gcode-state/addTemplateList'
    }),
    deleteUpFile(item) {
      // this.uploadFileList.splice(this.uploadFileList, 1)
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
      this.imageCompList.push({
        type: 'image',
        text: '图片',
        file: null, // 图片文件
        url: null, // 图片地址
        id: 'image' + Date.now(),
      })
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
    ,
    onImageChange(file, filelist) {
      let currIndex = this.imageCompList.findIndex((item) => item.id === this.currSelectCompName)
      if (currIndex > -1) {
        let currItem = this.imageCompList[currIndex]
        currItem.file = file

        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            currItem.url = e.target.result;
          };
          reader.readAsDataURL(file.raw);
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
  justify-content: space-between;
  margin: 0 auto;
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
