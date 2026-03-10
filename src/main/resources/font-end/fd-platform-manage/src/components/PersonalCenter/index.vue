<template>
  <div class="container">
    <!-- <h3>个人中心</h3> -->
    <el-dialog :visible.sync="dialogVisible" :title="title" width="700px" @close="onBtnCancel()">
      <div class="mt-20 base-config">
        <el-form
          :rules="rules"
          ref="personalFormData"
          :model="personalFormData"
          label-width="110px"
        >
          <!-- <div class="line"> -->
          <!-- <el-form-item label="账号:" prop="userName" class="inline">
              <el-input v-model="personalFormData.userName" disabled></el-input>
            </el-form-item> -->
          <el-form-item label="平台名称:" prop="tenantName">
            <el-input
              :disabled="!isEdit"
              placeholder="请输入平台名称"
              v-model="personalFormData.tenantName"
            ></el-input>
          </el-form-item>
          <!-- </div> -->
          <!-- <div class="line">
            <el-form-item label="登录设备:" prop="loginDevice" class="inline">
              <el-input v-model="personalFormData.loginDevice" disabled></el-input>
            </el-form-item>
            <el-form-item label="登录IP:" prop="loginIp" class="inline">
              <el-input v-model="personalFormData.loginIp" disabled></el-input>
            </el-form-item>
          </div> -->
          <!-- <div class="line">
            <el-form-item label="最后登录时间:" prop="lastLoginDate" class="inline">
              <el-input v-model="personalFormData.lastLoginDate" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建时间:" prop="createTime" class="inline">
              <el-input v-model="personalFormData.createTime" disabled></el-input>
            </el-form-item>
          </div> -->
          <div class="line">
            <el-form-item label="PC端背景图:" prop="" :rules="[]" class="inline">
              <!-- :on-change="handleChange" -->
              <el-upload
                :disabled="!isEdit"
                class="upload-demo"
                ref="upload"
                :before-upload="beforeAvatarUpload"
                action="#"
                :http-request="uploadImage"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :file-list="personalFormData.pcBackImage"
                :limit="1"
                list-type="picture-card"
                :auto-upload="true"
              >
                <i
                  v-if="!personalFormData.pcBackImage || personalFormData.pcBackImage.length == 0"
                  class="el-icon-plus avatar-uploader-icon"
                ></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/jepg文件</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="手机端背景图:" prop="" :rules="[]" class="inline">
              <!-- :on-change="handleChange2" -->
              <el-upload
                :disabled="!isEdit"
                class="upload-demo"
                ref="upload"
                :before-upload="beforeAvatarUpload"
                action="#"
                :http-request="uploadImage"
                :on-success="handleSuccess2"
                :on-remove="handleRemove2"
                :on-exceed="handleExceed"
                :file-list="personalFormData.appBackImage"
                :limit="1"
                list-type="picture-card"
                :auto-upload="true"
              >
                <i
                  v-if="!personalFormData.appBackImage || personalFormData.appBackImage.length == 0"
                  class="el-icon-plus avatar-uploader-icon"
                ></i>

                <div slot="tip" class="el-upload__tip">只能上传jpg/png/jepg文件</div>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
        <div class="footerBtn" style="display:flex,flex-direction: center;">
          <div>
            <el-button @click="onBtnCancel()" size="small"> 关闭 </el-button>

            <el-button
              v-if="!isEdit && this.personalFormData.isUpdate"
              type="primary"
              @click="editCheck()"
              >修改</el-button
            >
            <el-button v-if="isEdit" type="primary" @click="editBtnOk()">确认修改</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { passwordRules } from './rules'
import { getFileById, uploadFileToServer } from '@/api/upload'
import { getTenantLoginDetail, updateTenantLoginDetail } from '@/api/user'
export default {
  data() {
    return {
      rules: passwordRules,
      dialogVisible: false,
      personalFormData: {},
      isEdit: false,
      title: '平台信息',
      pcBackImageId: '',
      appBackImageId: ''
    }
  },
  watch: {
    dialogVisible(newV, oldV) {
      if (newV) {
        this.getTenantLoginDetail()
      }
    }
  },
  methods: {
    editCheck() {
      this.isEdit = true
      this.title = '修改平台信息'
    },
    onBtnCancel() {
      this.isEdit = false
      this.dialogVisible = false
      this.title = '平台信息'
      this.resetFields()
    },
    resetFields() {
      this.$nextTick(() => {
        this.$refs.personalFormData.resetFields()
        this.$refs.personalFormData.clearValidate()
      })
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    },
    async uploadImage(action) {
      try {
        console.log('----uploadImage------', action)
        let res = await uploadFileToServer(action.file)
        console.log('uploadImage - ', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },
    async handleSuccess(response, file, fileList) {
      console.log('-handleSuccess-- ', response)

      if (response && response.data) {
        this.personalFormData.pcBackImage = fileList

        fileList[0].fileId = response.data
        this.personalFormData.pcBackImageFileId = response.data
      } else {
        console.error('上传文件出错，', response)

        this.personalFormData.pcBackImage = []
      }
    },
    async handleSuccess2(response, file, fileList) {
      console.log('-handleSuccess2-- ', response)

      if (response && response.data) {
        this.personalFormData.appBackImage = fileList

        fileList[0].fileId = response.data
        this.personalFormData.appBackImageFileId = response.data
      } else {
        console.error('上传文件出错，', response)

        this.personalFormData.appBackImage = []
      }
    },
    handleChange(file, fileList) {
      console.log('----handleChange------', fileList)
      this.personalFormData.pcBackImage = fileList
      // 校验 上传
      this.$refs.formRef.validateField('pcBackImage')
    },

    handleExceed(file, fileList) {
      console.log('----handleExceed------', fileList)
      this.$message({
        message: '最多只能选择1张图片',
        type: 'error'
      })
    },

    handleRemove(file, fileList) {
      console.log('----handleRemove------', fileList)
      this.personalFormData.pcBackImage = fileList
      this.pcBackImageId=''
      // console.log(file, fileList)
      // this.formData.pcBackImage = fileList.map((item) => {
      //   item.url = item.response ? item.response[0] : ''
      //   return item
      // })
    },

    handleChange2(file, fileList) {
      console.log('----handleChange------')
      this.personalFormData.appBackImage = fileList
      // this.formData.appBackImage = fileList.slice(-3).map((item) => {
      //   item.url = item.response ? item.response[0] : ''
      //   return item
      // })
      // 校验 上传
      this.$refs.formRef.validateField('appBackImage')
    },

    handleRemove2(file, fileList) {
      console.log('----handleRemove------')
      this.personalFormData.appBackImage = fileList
      this.appBackImageId=''
      // console.log(file, fileList)
      // this.formData.appBackImage = fileList.map((item) => {
      //   item.url = item.response ? item.response[0] : ''
      //   return item
      // })
    },
    editBtnOk() {
      this.$refs.personalFormData.validate(async (valid) => {
        if (valid) {
          if (this.personalFormData.tenantName == '') {
            this.$message.error('平台名称不能为空！！')
            return
          }
          let res = await updateTenantLoginDetail({
            tenantId: this.personalFormData.tenantId,
            pcBackImage: this.personalFormData.pcBackImageFileId
              ? this.personalFormData.pcBackImageFileId
              : this.pcBackImageId,
            appBackImage: this.personalFormData.appBackImageFileId
              ? this.personalFormData.appBackImageFileId
              : this.appBackImageId,
            tenantName: this.personalFormData.tenantName
          })
          console.log(res, 'res')
          this.$message.success('修改成功')
          this.onBtnCancel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getTenantLoginDetail() {
      let res = await getTenantLoginDetail()
      this.personalFormData = res.data
      this.pcBackImageId = res.data.pcBackImage
      this.appBackImageId = res.data.appBackImage
      const pcBackImageId = res.data.pcBackImage
      const appBackImageId = res.data.appBackImage
      this.personalFormData.pcBackImage = []
      this.personalFormData.appBackImage = []

      if (pcBackImageId) {
        getFileById(pcBackImageId).then((ret) => {
          this.personalFormData = {
            ...this.personalFormData,
            pcBackImage: [
              {
                url: ret.data.fileUrl,
                name: ret.data.originalName
              }
            ]
          }
        })
      }
      if (appBackImageId) {
        getFileById(appBackImageId).then((ret) => {
          this.personalFormData = {
            ...this.personalFormData,
            appBackImage: [
              {
                url: ret.data.fileUrl,
                name: ret.data.originalName
              }
            ]
          }
        })
      }

      console.log(res, 'res')
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-top: 0 !important;
}

::v-deep .upload-demo .el-upload--picture-card {
  width: auto;
  height: auto;
  border: none;
  line-height: 0;
  background-color: transparent;
  box-shadow: none;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid #ccc;
}
.line {
  display: flex;
  flex-direction: row;
  .inline {
    width: 50%;
  }
}
.footerBtn {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
