<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="微信商户号" prop="mchId">
          <el-input v-model="queryFormData.mchId" placeholder="请输入微信商户号" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            filterable
            v-model="queryFormData.isActive"
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="">
          <el-date-picker
            v-model="queryFormData.create_time"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptionsAll"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>

      <my-table
        class="mt-10"
        :loadData="getWechatPayAccountPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="微信商户号" align="center" prop="mchId" />
        <el-table-column label="应用ID" align="center" prop="appId" />
        <el-table-column label="特约商户号" align="center" prop="subMchId" />
        <el-table-column label="子应用ID" align="center" prop="subAppId" />
        <!-- <el-table-column label="apiv2秘钥" align="center" prop="apiKeyV2" /> -->
        <el-table-column label="apiv3秘钥" align="center" prop="apiKeyV3" />

        <el-table-column label="商户类型" align="center" prop="mchType">
          <template slot-scope="{ row }">
            {{ row.mchType == 0 ? '普通商户' : '码商' }}
          </template>
        </el-table-column>

        <el-table-column label="认证类型" align="center">
          <template slot-scope="{ row }">
            <el-tag>{{ row.authType == 0 ? '密钥' : '证书' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch
              @change="(e) => onSwitchChange(e, row)"
              v-model="row.isActive"
              active-text="开启"
              inactive-text="关闭"
            />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改微信码商' : '新增微信码商'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="140px"
        style="margin-right: 50px"
      >
        <el-form-item label="微信商户号" prop="mchId">
          <el-input v-model="formData.mchId" placeholder="请输入微信商户号" size="small" />
        </el-form-item>
        <el-form-item label="应用ID" prop="appId">
          <el-input v-model="formData.appId" placeholder="请输入应用ID" size="small" />
        </el-form-item>
        <el-form-item label="特约商户号" prop="subMchId">
          <el-input v-model="formData.subMchId" placeholder="请输入特约商户号" size="small" />
        </el-form-item>
        <el-form-item label="子应用ID" prop="subAppId">
          <el-input v-model="formData.subAppId" placeholder="请输入子应用ID" size="small" />
        </el-form-item>
        <el-form-item label="apiv3秘钥" prop="apiKeyV3">
          <el-input v-model="formData.apiKeyV3" placeholder="请输入apiv3秘钥" size="small" />
        </el-form-item>

        <el-form-item label="认证类型" prop="authType">
          <el-radio-group v-model="formData.authType" @change="radioChange">
            <el-radio :label="0">密钥</el-radio>
            <el-radio :label="1">证书</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.authType == 0" label="微信支付公钥id" prop="payPublicKeyId">
          <el-input
            v-model="formData.payPublicKeyId"
            placeholder="请输入微信支付公钥id"
            size="small"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.authType == 0"
          label="微信支付公钥路径"
          prop="payPublicKeyPath"
        >
          <el-upload
            class="upload-demo"
            :on-remove="(file, fileList) => handleRemove('1', file, fileList)"
            :on-success="(response, file, fileList) => handleSuccess('1', response, file, fileList)"
            :before-upload="beforeAvatarUpload"
            :http-request="(action) => uploadFile('1', action)"
            :file-list="formData.payPublicKeyPath"
            action="#"
            :limit="1"
            :auto-upload="true"
          >
            <el-button
              v-if="!formData.payPublicKeyPath || formData.payPublicKeyPath.length == 0"
              size="small"
              type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <!-- <el-form-item v-if="formData.authType == 1" label="证书序列号" prop="certSerialNo">
          <el-input v-model="formData.certSerialNo" placeholder="请输入证书序列号" size="small" />
        </el-form-item> -->
        <el-form-item v-if="formData.authType == 1" label="证书序列号" prop="certSerialNo">
          <el-input v-model="formData.certSerialNo" placeholder="请输入证书序列号" size="small" />
        </el-form-item>
        <el-form-item v-if="formData.authType == 1" label="微信Api证书" prop="apiCertPath">
          <el-upload
            :on-remove="(file, fileList) => handleRemove('2', file, fileList)"
            :on-success="(response, file, fileList) => handleSuccess('2', response, file, fileList)"
            :before-upload="beforeAvatarUpload"
            :http-request="(action) => uploadFile('2', action)"
            class="upload-demo"
            :file-list="formData.apiCertPath"
            action="#"
            :limit="1"
            :auto-upload="true"
          >
            <el-button
              v-if="!formData.apiCertPath || formData.apiCertPath.length == 0"
              size="small"
              type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formData.authType == 1" label="私钥文件" prop="apiKeyPath">
          <el-upload
            :on-remove="(file, fileList) => handleRemove('3', file, fileList)"
            :on-success="(response, file, fileList) => handleSuccess('3', response, file, fileList)"
            :before-upload="beforeAvatarUpload"
            :http-request="(action) => uploadFile('3', action)"
            class="upload-demo"
            :file-list="formData.apiKeyPath"
            action="#"
            :limit="1"
            :auto-upload="true"
          >
            <!-- :on-preview="handlePreview" -->
            <el-button
              v-if="!formData.apiKeyPath || formData.apiKeyPath.length == 0"
              size="small"
              type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWechatPayAccountPage,
  wechatPayAccountAdd,
  wechatPayAccount,
  wechatPayAccountUpdate,
  wechatPayAccountEnable,
  wechatPayAccountDelete
} from '@/api/we-chat'
import { weChatRules, queryRules } from './rules.js'
import { formatDateTime } from '@/utils'

import { getFileById, uploadFileToServer } from '@/api/upload'

export default {
  name: 'weChatManager',
  data() {
    return {
      tableData: [],
      rules: weChatRules,
      queryRules: queryRules,
      dialogVisible: false,
      formData: {
        mchId: '',
        appId: '',
        subMchId: '',
        subAppId: '',
        apiKeyV3: '',
        authType: 0, //认证类型 0密钥1 证书
        payPublicKeyId: '',
        payPublicKeyPath: [],
        apiCertPath: [],
        apiKeyPath: [],
        certSerialNo: '',
        isActive: 1,
        remark: ''
      },
      queryFormData: this.getQueryForm(),
      isEdit: false // 是否是编辑状态
    }
  },
  methods: {
    radioChange(e) {
      this.formData.payPublicKeyId = ''
      this.formData.certSerialNo = ''
      this.formData.payPublicKeyPath = []
      this.formData.apiCertPath = []
      this.formData.apiKeyPath = []
    },
    async uploadFile(row, action) {
      try {
        console.log('----uploadFile------', action)
        let res = await uploadFileToServer(action.file)
        console.log('uploadFile - ', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isLt2M
    },
    async onSwitchChange(e, row) {
      try {
        let res = await wechatPayAccountEnable(row.wechatPayAccountId, {
          isActive: e
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    async handleSuccess(row, response, file, fileList) {
      console.log(row, 'row111')
      const flag = row
      console.log('----handleSuccess------', response, file, fileList)

      const index = 0
      if (response && response.data) {
        // 上传成功
        fileList[index].fileId = response.data
        flag == 1
          ? (this.formData.payPublicKeyPath = fileList)
          : flag == 2
          ? (this.formData.apiCertPath = fileList)
          : (this.formData.apiKeyPath = fileList)
        flag == 1
          ? (this.formData.payPublicKeyPathId = response.data)
          : flag == 2
          ? (this.formData.apiCertPathId = response.data)
          : (this.formData.apiKeyPathId = response.data)
      } else {
        console.error('上传文件出错', response)
        flag == 1
          ? (this.formData.payPublicKeyPath = [])
          : flag == 2
          ? (this.formData.apiCertPath = [])
          : (this.formData.apiKeyPath = [])
      }
      this.$forceUpdate()
    },

    handleRemove(row, file, fileList) {
      console.log(row, 'row')
      const flag = row
      flag == 1
        ? (this.formData.payPublicKeyPath = [])
        : flag == 2
        ? (this.formData.apiCertPath = [])
        : (this.formData.apiKeyPath = [])
      this.$forceUpdate()
    },

    async getWechatPayAccountPage(page) {
      let params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'create_time') {
            params['startTime'] = this.queryFormData['create_time'][0]
            params['endTime'] = this.queryFormData['create_time'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getWechatPayAccountPage(params, page)
      console.log(res, 'res')
      this.tableData = res.data.list
      return res
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除微信商户号为【 ${row.mchId}】的微信码商吗？`)
        let res = await wechatPayAccountDelete(row.wechatPayAccountId)
        this.$refs.tableRef.getTableData()
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    async showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      let res = await wechatPayAccount(row.wechatPayAccountId)
      console.log(res, 'res-----')
      this.formData = res.data

      const payPublicKeyPathId = res.data.payPublicKeyPath // 服务器返回的图片id
      const apiCertPathId = res.data.apiCertPath // 服务器返回的图片id
      const apiKeyPathId = res.data.apiKeyPath // 服务器返回的图片id
      this.formData.payPublicKeyPath = []
      this.formData.apiCertPath = []
      this.formData.apiKeyPath = []
      this.formData.payPublicKeyPathId = payPublicKeyPathId
      this.formData.apiCertPathId = apiCertPathId
      this.formData.apiKeyPathId = apiKeyPathId
      if (this.formData.authType == 0) {
        getFileById(payPublicKeyPathId).then((res1) => {
          this.formData = {
            ...this.formData,
            payPublicKeyPath: [
              {
                url: res1.data.fileUrl,
                name: res1.data.originalName
              }
            ]
          }
        })
        return 
      }

      getFileById(apiCertPathId).then((res2) => {
        this.formData = {
          ...this.formData,
          apiCertPath: [
            {
              url: res2.data.fileUrl,
              name: res2.data.originalName
            }
          ]
        }
      })
      getFileById(apiKeyPathId).then((res3) => {
        this.formData = {
          ...this.formData,
          apiKeyPath: [
            {
              url: res3.data.fileUrl,
              name: res3.data.originalName
            }
          ]
        }
      })
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        mchId: '',
        appId: '',
        subMchId: '',
        subAppId: '',
        apiKeyV3: '',
        authType: 0, //认证类型 0密钥1 证书
        payPublicKeyId: '',
        payPublicKeyPath: [],
        apiCertPath: [],
        apiKeyPath: [],
        certSerialNo: '',
        isActive: 1,
        remark: ''
      }
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {

            let res = await wechatPayAccountUpdate({
              wechatPayAccountId: this.formData.wechatPayAccountId,
              mchId: this.formData.mchId,
              appId: this.formData.appId,
              subMchId: this.formData.subMchId,
              subAppId: this.formData.subAppId,
              apiKeyV3: this.formData.apiKeyV3,
              authType: this.formData.authType, //认证类型 0密钥1 证书
              payPublicKeyId: this.formData.authType == 0 ? this.formData.payPublicKeyId : '',
              payPublicKeyPath: this.formData.authType == 0 ? this.formData.payPublicKeyPathId : '',
              apiCertPath: this.formData.authType == 1 ? this.formData.apiCertPathId : '',
              apiKeyPath: this.formData.authType == 1 ? this.formData.apiKeyPathId : '',
              certSerialNo: this.formData.authType == 1 ? this.formData.certSerialNo : '',
              isActive: this.formData.isActive,
              remark: this.formData.remark
            })
            // 编辑
          } else {
            // 新增
            let res = await wechatPayAccountAdd({
              mchId: this.formData.mchId,
              appId: this.formData.appId,
              subMchId: this.formData.subMchId,
              subAppId: this.formData.subAppId,
              apiKeyV3: this.formData.apiKeyV3,
              authType: this.formData.authType, //认证类型 0密钥1 证书
              payPublicKeyId: this.formData.authType == 0 ? this.formData.payPublicKeyId : '',
              payPublicKeyPath: this.formData.authType == 0 ? this.formData.payPublicKeyPathId : '',
              apiCertPath: this.formData.authType == 1 ? this.formData.apiCertPathId : '',
              apiKeyPath: this.formData.authType == 1 ? this.formData.apiKeyPathId : '',
              certSerialNo: this.formData.authType == 1 ? this.formData.certSerialNo : '',
              isActive: this.formData.isActive,
              remark: this.formData.remark
              // ...this.formData
            })
          }
          this.dialogVisible = false
          this.$refs.tableRef.getTableData()
        }
      })
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormData.resetFields()
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        isActive: '',
        // create_time: [todayStr, nowStr]
        create_time: []
      }
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.upload-demo {
  display: flex;
}
</style>
