<template>
  <el-form
    ref="innerForm"
    :model="formData"
    :rules="incomeInfoRules"
    label-position="right"
    label-width="120px"
    class="add-form2"
    style="margin: 0 30px"
  >
    <!-- <el-form-item label="选择码商" :prop="isEdit ? '' : 'providerId'">
      <el-select
        v-model="formData.providerId"
        filterable
        :disabled="isEdit"
        placeholder="请选择码商"
        size="small"
        @change="handleProviderSelect"
      >
        <el-option
          v-for="item in providerList"
          :key="item.providerId"
          :label="item.userNickName"
          :value="item.providerId"
        />
      </el-select>
    </el-form-item> -->

    <el-form-item label="产品名称" :prop="isEdit ? '' : 'productId'">
      <el-input
        v-if="isEdit"
        :disabled="isEdit"
        v-model="formData.productName"
        placeholder="请输入收款码名称"
        size="small"
      />
      <el-select
        v-else
        v-model="formData.productId"
        filterable
        placeholder="请选择产品"
        size="small"
        :loading="productLoading"
        @change="handleProductSelect"
      >
        <el-option
          v-for="item in providerProductList"
          :key="item.productId"
          :label="item.productName"
          :value="item.productId"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="收款码名称"
      :prop="isEdit ? '' : 'payeeAccountName'"
      :rules="isEdit ? [] : payeeAccountNameRules"
    >
      <el-row>
        <el-col :span="24">
          <el-input
            v-model="formData.payeeAccountName"
            placeholder="请输入收款码名称"
            ref="textareaRef"
            type="textarea"
            :rows="isEdit ? 1 : 4"
          />
          <!-- :style="{ height: textareaHeight + 'px', resize: 'none' }" -->
        </el-col>
      </el-row>
      <div v-if="isMutiply" class="tips" style="margin: 20px 0px 0px; line-height: 1.5">
        <div style="display: flex; align-items: center">
          <div>收款码名称会自动生成，如需前缀，请输入：</div>
          <el-input
            v-model="preTxt"
            @blur="onPreTxtBlur"
            style="width: 150px"
            placeholder="请输入前缀"
          ></el-input>
        </div>
        <div>多个名称之间用 | 分隔，当前共有 {{ mutiplyMode === 'image' ? selectImageList.length : allTextValues.length }} 个</div>
      </div>
    </el-form-item>

    <!-- <div
      class="tips"
      style="margin: 20px 0px; line-height: 1.5"
      v-if="
        formData.payeeAccountConfig &&
        formData.payeeAccountConfig.qrConfig.isActive == 1 &&
        formData.payeeAccountConfig.qrConfig.parseType != 2
      "
    >
      <div>1. 多个收款码名称相同，输入一个名称即可。</div>
      <div>2. 名称不同，名称之间用 | 分隔</div>
    </div> -->

    <div v-loading="loadingInfo"></div>

    <div v-if="formData.payeeAccountConfig">
      <template
        v-if="formData.payeeAccountConfig.texts && formData.payeeAccountConfig.texts.length > 0"
      >
        <div v-for="(item, index) in formData.payeeAccountConfig.texts" :key="item.textConfigId">
          <!-- realLink  这个文本 不展示 -->
          <el-form-item
            v-if="item.textCode != 'realLink'"
            :label="item.textTitle"
            :prop="item.isRequired === 1 ? `payeeAccountConfig.texts.${index}.textValue` : ''"
            :rules="[
              { required: item.isRequired, message: '请输入' + item.textTitle, trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="item.textValue"
              type="textarea"
              :rows="isEdit || index != 0 ? 1 : 4"
              @blur="onTextBlur(index, item)"
              :placeholder="item.remark"
              size="small"
            />

            <div v-if="index == 0" class="tips" style="margin: 10px 0px; line-height: 1.5">
              <div>当多个值时，一行一个！ 当前共有{{ allTextValues.length }}个</div>
            </div>
          </el-form-item>
        </div>
      </template>

      <div v-for="(item, index) in formData.payeeAccountConfig.buttons" :key="item.buttonConfigId">
        <template v-for="(param, index2) in item.buttonParamList">
          <div :key="index2" class="params" v-if="param.paramTitle && param.isShow">
            <el-form-item
              :prop="`payeeAccountConfig.buttons[${index}].buttonParamList[${index2}].buttonParamValue`"
              :rules="incomeInfoRules.buttonParamValueRules"
              :label="param.paramTitle"
            >
              <el-input v-model="param.buttonParamValue" :placeholder="param.remark" size="small" />
            </el-form-item>
          </div>
        </template>
      </div>

      <div v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">
        <!-- <el-form-item label="生成方式">
          <el-select
            v-model="formData.payeeAccountConfig.qrConfig.parseType"
            filterable
            placeholder="解析模式"
            size="small"
            @change="handleQrConfigChange"
          >
            <el-option label="原图" :value="0" />
            <el-option label="上传二维码" :value="1" />
            <el-option label="直接配置数据" :value="2" />
          </el-select>
        </el-form-item> -->

        <el-form-item
          v-if="formData.payeeAccountConfig.qrConfig.parseType != 2"
          label="选择文件"
          prop="payeeAccountConfig.qrConfig.qrUrl"
          :rules="incomeInfoRules.qrUrlRules"
        >
          <el-upload
            style="width: 100%"
            class="qrcode-uploader"
            action="#"
            :multiple="!isEdit"
            :file-list="safeFileList"
            :limit="isEdit ? 1 : 50"
            list-type="picture"
            :auto-upload="true"
            :before-upload="beforeUpload"
            :http-request="uploadImage"
            :on-success="onSuccess"
            :on-remove="onRemove"
            :on-change="handleQrImageChange"
            :on-error="onError"
            :on-exceed="handleQrConfigExceedLimit"
            ref="qrUploader"
          >
            <!-- <div slot="trigger" class="trgger-box" @click="handleUploadTriggerClick">
              <i class="el-icon-plus avatar-uploader-icon" />
            </div> -->
            <el-button
              style="margin-bottom: 10px"
              size="small"
              @click="handleUploadTriggerClick"
              type="primary"
              >点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4M</div>
          </el-upload>
        </el-form-item>
        <div class="tips" v-if="failedFiles.length">
          解析失败：
          <span v-for="(item, idx) in failedFiles" :key="item.uid">
            {{ item.name }}<span v-if="idx !== failedFiles.length - 1">；</span>
          </span>
        </div>
        <div class="tips" v-if="formData.payeeAccountConfig.qrConfig.parseType != 2">
          <div v-if="!isEdit" style="font-weight: 600; margin-bottom: 10px">
            最多可上传 50 张图片，创建 50 个收款码 ！！
          </div>
          <div>请保证上传的二维码图片，清晰、完整！否则会影响支付！</div>
        </div>

        <el-form-item
          v-if="
            formData.payeeAccountConfig.qrConfig.parseType == 2 &&
            formData.payeeAccountConfig.qrConfig.GenerQrUrl
          "
          label="二维码"
        >
          <el-image
            v-if="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
            style="width: 146px; height: 146px"
            :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
            fit="scale-down"
          />
        </el-form-item>

        <el-form-item
          v-if="formData.payeeAccountConfig.qrConfig.parseType == 2"
          label="输入数据"
          prop="payeeAccountConfig.qrConfig.parseValue"
          :rules="incomeInfoRules.parseValueRules"
        >
          <el-input
            v-model="formData.payeeAccountConfig.qrConfig.parseValue"
            type="textarea"
            :rows="4"
            placeholder="输入数据"
            size="small"
          />
        </el-form-item>

        <div class="btn-box" style="text-align: center; padding-bottom: 20px">
          <el-button
            v-show="formData.payeeAccountConfig.qrConfig.parseType == 2"
            type="primary"
            size="small"
            @click="handleGenerateQr"
            >{{
              formData.payeeAccountConfig.qrConfig.GenerQrUrl ? '重新生成' : '生成二维码'
            }}</el-button
          >
        </div>
      </div>

      <div
        v-if="formData.payeeAccountConfig.files && formData.payeeAccountConfig.files.length > 0"
        class="file-config"
      >
        <el-form-item
          v-for="(item, index) in formData.payeeAccountConfig.files"
          :key="index"
          :label="item.fileTitle"
          :prop="`payeeAccountConfig.files[${index}].fileUrl`"
          :rules="incomeInfoRules.fileUrlRules"
        >
          <el-upload
            class="avatar-uploader"
            action="#"
            :multiple="false"
            :limit="1"
            :file-list="item.fileList"
            :show-file-list="true"
            :before-upload="beforeUploadFile"
            :http-request="uploadConfigFile"
            :on-success="(res, file, fileList) => handleFileSuccess(index, res, file, fileList)"
            :on-remove="(file, fileList) => handleFileRemove(index, file, fileList)"
          >
            <el-button
              v-if="!formData.payeeAccountConfig.files[index].fileUrl"
              size="small"
              type="primary"
              >点击上传</el-button
            >
          </el-upload>
          <div class="red_tip" v-if="item.remark">说明： {{ item.remark }}</div>
        </el-form-item>
      </div>
    </div>

    <el-form-item label="备注">
      <el-input v-model="formData.remark" placeholder="备注，可以为空" size="small" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CreateIncomeInfo',
  props: {
    formData: {
      type: Object,
      required: true
    },
    incomeInfoRules: {
      type: Object,
      required: true
    },
    payeeAccountNameRules: {
      type: Array,
      default: () => []
    },
    handleQrConfigError: {
      type: Function,
      default: null
    },
    providerList: {
      type: Array,
      default: () => []
    },
    providerProductList: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    productLoading: {
      type: Boolean,
      default: false
    },
    loadingInfo: {
      type: Boolean,
      default: false
    },
    isPayeeAccountNameExist: {
      type: Boolean,
      default: false
    },
    qrImageUrl: {
      type: String,
      default: ''
    },
    beforeUpload: {
      type: Function,
      default: null
    },
    uploadImage: {
      type: Function,
      default: null
    },
    handleQrConfigSuccess: {
      type: Function,
      default: null
    },
    handleQrConfigRemove: {
      type: Function,
      default: null
    },
    beforeUploadFile: {
      type: Function,
      default: null
    },
    uploadConfigFile: {
      type: Function,
      default: null
    },
    handleFileSuccess: {
      type: Function,
      default: null
    },
    handleFileRemove: {
      type: Function,
      default: null
    },
    onProviderChange: {
      type: Function,
      default: null
    },
    onProductChange: {
      type: Function,
      default: null
    },
    onQrConfigChange: {
      type: Function,
      default: null
    },
    onGenerateQr: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      isMutiply: false, // 是否多条数据
      mutiplyMode: '', // 多条数据模式  text/image
      allTextValues: [],
      preTxt: '',
      timeoutFlag: null,
      selectImageList: [],
      textareaHeight: 38, // 初始高度（匹配 ElementUI textarea 默认行高，可根据需求调整）
      nameMethods: '0' // 名称生成方式  0：图片文件名称  1：规则生成
    }
  },
  // watch:{
  //   'formData.payeeAccountName':{
  //     handler(val){
  //       console.log('---payeeAccountName------', val);

  //       if (val) {
  //         this.autoResizeTextarea()
  //       }
  //     }
  //   }
  // },
  computed: {
    failedFiles() {
      return this.formData.payeeAccountConfig?.qrConfig?.failedFiles || []
    },
    safeFileList() {
      const qrConfig = this.formData.payeeAccountConfig?.qrConfig
      if (!qrConfig || !qrConfig.fileList) {
        return []
      }
      if (!this.failedFiles.length) {
        return qrConfig.fileList
      }
      return qrConfig.fileList.filter((item) => {
        return !this.failedFiles.some((failed) => failed.uid === item.uid)
      })
    }
  },
  mounted() {
    this.getNameMethods()
  },
  methods: {
    async getNameMethods() {
      const tenantConfig = await this.$store.dispatch('tenant/getTenantConfig')
      console.log('tenantConfig------->', tenantConfig)
      const nameMethods = tenantConfig.find((ele) => ele.configKey === 'PatchCreateCodeNameMethods')
      this.nameMethods = nameMethods.configValue || '0'
    },
    uploadAllImage() {
      this.$refs.qrUploader.submit()
    },
    handleQrImageChange(file, fileList) {
      console.log('handleQrImageChange fileList.length:', fileList)
      console.log('-file.name--', file.name)

      // 多图片模式
      this.mutiplyMode = 'image'

      this.timeoutFlag && clearTimeout(this.timeoutFlag)
      this.timeoutFlag = setTimeout(() => {
        if (fileList.length > 0) {
          // 多图上传，显示一个默认图片
          this.formData.payeeAccountConfig.qrConfig.qrUrl = 'mutiplyQrImageUrl'
        } else {
          this.formData.payeeAccountConfig.qrConfig.qrUrl = ''
        }

        this.selectImageList = fileList
        this.handleGenerateName(fileList)
      }, 500)
    },
    onTextBlur(index, item) {
      console.log('onTextBlur', item)
      if (this.isEdit || !item.textValue || index !== 0) {
        return
      }

      // 去掉多余的空行, 保留有内容的行,去掉重复的内容
      let linesSet = new Set()
      item.textValue.split('\n').forEach((line) => {
        let trimmedLine = line.trim()
        if (trimmedLine.length > 0) {
          linesSet.add(trimmedLine)
        }
      })
      this.allTextValues = Array.from(linesSet)
      if(this.allTextValues.length > 1){
        // 多文本模式
        this.mutiplyMode = 'text'
      }

      item.textValue = Array.from(linesSet).join('\n')

      let provideName = this.$store.state.user.personalInfo.userName || ''

      let preTxt = this.preTxt
      let names = []

      if (item.textValue && item.textValue.trim().length > 0) {
        // 将当前的日期和序号，做为payeeAccountName 的值
        // 如  12月14-1 | 12月14-2
        let date = new Date()
        let mouth = date.getMonth()
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()

        let lines = item.textValue.trim().split('\n')
        this.allTextValues = lines

        lines.forEach((line, index) => {
          names.push(
            `${preTxt ? preTxt + '_' : ''}${provideName ? provideName + '_' : ''}${
              mouth + 1
            }${day}_${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}_${(
              index + 1
            )
              .toString()
              .padStart(2, '0')}号`
          )
        })
      }

      this.$set(this.formData, 'payeeAccountName', names.join(' | '))

      console.log('names.length : ', names.length)

      if (names.length > 1) {
        this.isMutiply = true
        this.$emit('first-text-multiple', true)
        this.$refs.innerForm.clearValidate('payeeAccountName')
      } else {
        this.isMutiply = false
        this.$emit('first-text-multiple', false)
      }
    },
    onPreTxtBlur() {
      if (this.preTxt.trim().length === 0) {
        return
      }
      // 可能是多文本，也可能是多图片
      if (this.allTextValues.length > 1) {
        this.handleGenerateName(this.allTextValues)
      } else {
        
        this.handleGenerateName(this.selectImageList)
      }
    },
    async onSuccess(res, file, fileList) {
      console.log('---onSuccess---fileList.length:---', fileList.length)
      await this.handleQrConfigSuccess(res, file, fileList)
      this.handleGenerateName(this.safeFileList)
    },
    onError(error, file, fileList) {
      console.log('---onError------', error, file, fileList)
      this.handleQrConfigError(error, file, fileList)
      this.handleGenerateName(this.safeFileList)
    },
    onRemove(file, fileList) {
      console.log('---onRemove------', file, fileList)
      this.handleQrConfigRemove(file, fileList)
      this.handleGenerateName(this.safeFileList)
    },

    autoResizeTextarea() {
      // 获取 el-input 内部的原生 textarea 元素
      const textarea = this.$refs.textareaRef.$refs.textarea
      console.log('------------------textarea---------', textarea)

      if (!textarea) return

      // 关键：重置高度为 auto，让 scrollHeight 能准确计算实际内容高度
      textarea.style.height = 'auto'
      textarea.style.resize = 'none'

      // 计算实际高度：scrollHeight（内容总高度）+ 上下内边距（抵消 ElementUI 自带样式）
      // 注：ElementUI 的 textarea 默认 padding 为 6px，可根据实际样式调整
      const actualHeight = textarea.scrollHeight + 12 // 12 = 6px (上) + 6px (下)

      // 限制最小高度（避免内容为空时高度过小）
      this.textareaHeight = Math.max(actualHeight, 38)
    },
    handleGenerateName(itemList) {
      if (this.isEdit) {
        return
      }

      console.log('itemList.length ', itemList.length)

      this.isMutiply = itemList.length > 1
      let preTxt = this.preTxt
      let names = []

      // 使用图片名称 还是 规则生成
      if (this.nameMethods === '0' && this.mutiplyMode == 'image') {
        names = itemList.map((line) => {
            let name = line.name.split('.')[0] // 去掉扩展名
          return `${preTxt ? preTxt + '_' : ''}${name}`
        })

      } else {
        let provideName = this.$store.state.user.personalInfo.userName || ''

        // 如  12月14-1 | 12月14-2
        let date = new Date()
        let mouth = date.getMonth()
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()

        itemList.forEach((line, index) => {
          names.push(
            `${preTxt ? preTxt + '_' : ''}${provideName ? provideName + '_' : ''}${
              mouth + 1
            }${day}_${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}_${(
              index + 1
            )
              .toString()
              .padStart(2, '0')}号`
          )
        })
      }

      this.$set(this.formData, 'payeeAccountName', names.join(' | '))
      this.$refs.innerForm.clearValidate('payeeAccountName')
    },

    handleQrConfigExceedLimit(files, fileList) {
      this.$message.error('最多可上传 20 张图片 ！！ ')
      return false
    },
    getFileIndex(name) {
      return this.safeFileList.findIndex((ele) => name.includes(ele.name))
    },
    validate(callback) {
      if (!this.$refs.innerForm) {
        return callback ? callback(false) : false
      }
      return this.$refs.innerForm.validate(callback)
    },
    validateField(prop, callback) {
      if (!this.$refs.innerForm) {
        return callback ? callback('表单未初始化') : undefined
      }
      return this.$refs.innerForm.validateField(prop, callback)
    },
    resetFields() {
      if (this.$refs.innerForm) {
        this.$refs.innerForm.resetFields()
      }
    },
    clearValidate(props) {
      if (!this.$refs.innerForm) {
        return
      }
      if (Array.isArray(props)) {
        props.forEach((prop) => this.$refs.innerForm.clearValidate(prop))
      } else if (typeof props === 'string') {
        this.$refs.innerForm.clearValidate(props)
      } else {
        this.$refs.innerForm.clearValidate()
      }
    },
    handleProviderSelect(value) {
      if (this.onProviderChange) {
        this.onProviderChange(value)
      }
    },
    handleProductSelect(value) {
      if (this.onProductChange) {
        this.onProductChange(value)
      }
    },
    handleQrConfigChange(value) {
      if (this.onQrConfigChange) {
        this.onQrConfigChange(value)
      }
    },
    handleGenerateQr() {
      if (this.onGenerateQr) {
        this.onGenerateQr()
      }
    },
    handleUploadTriggerClick(event) {
      if (this.isEdit && this.safeFileList.length >= 1) {
        this.$message.error('只能展示一张图片')
        event.preventDefault()
        event.stopPropagation()
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode-uploader {
  width: 100%;

  ::v-deep .el-upload-list.el-upload-list--picture {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  ::v-deep .el-upload-list__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    width: 22%;
    height: 111px;

    img {
      margin: 5px;
    }

    .el-upload-list__item-name {
      margin: 0;
      line-height: 1.5;
    }
  }
}
</style>
