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
        <el-form-item label="支付宝账号" prop="alipayAccount">
          <el-input
            v-model="queryFormData.alipayAccount"
            placeholder="请输入支付宝账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="支付宝名称" prop="alipayName">
          <el-input
            v-model="queryFormData.alipayName"
            placeholder="请输入支付宝名称"
            size="small"
          />
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
            :default-time="['00:00:00', '23:59:59']"
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
        :loadData="getAlipayAccountPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="支付宝账号" align="center" prop="alipayAccount" />
        <el-table-column label="支付宝名称" align="center" prop="alipayName" />
        <el-table-column label="APPID" align="center" prop="appId" />
        <el-table-column label="应用名称" align="center" prop="appName" />

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
      :title="isEdit ? '修改支付宝码商' : '新增支付宝码商'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="支付宝账号" prop="alipayAccount">
          <el-input v-model="formData.alipayAccount" placeholder="请输入支付宝账号" size="small" />
        </el-form-item>

        <el-form-item label="支付宝名称" prop="alipayName">
          <el-input v-model="formData.alipayName" placeholder="请输入支付宝名称" size="small" />
        </el-form-item>

        <el-form-item label="APPID" prop="appId">
          <el-input v-model="formData.appId" placeholder="请输入APPID" size="small" />
        </el-form-item>

        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="formData.appName" placeholder="请输入应用名称" size="small" />
        </el-form-item>
        <el-form-item label="应用私钥" prop="">
          <el-input v-model="formData.privateKey" placeholder="请输入应用私钥" size="small" />
        </el-form-item>

        <el-form-item label="认证类型" prop="authType">
          <el-radio-group v-model="formData.authType" @change="radioChange">
            <el-radio :label="0">密钥</el-radio>
            <el-radio :label="1">证书</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.authType == 0" label="支付宝公钥" prop="">
          <el-input
            v-model="formData.alipayPublicKey"
            placeholder="请输入支付宝公钥"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="formData.authType == 1" label="应用证书" prop="appCertPath">
          <el-upload
            class="upload-demo"
            :on-remove="(file, fileList) => handleRemove('1', file, fileList)"
            :on-success="(response, file, fileList) => handleSuccess('1', response, file, fileList)"
            :before-upload="beforeAvatarUpload"
            :http-request="(action) => uploadFile('1', action)"
            :file-list="formData.appCertPath"
            action="#"
            :limit="1"
            :auto-upload="true"
          >
            <el-button
              v-if="!formData.appCertPath || formData.appCertPath.length == 0"
              size="small"
              type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>

        <el-form-item v-if="formData.authType == 1" label="支付宝公钥证书" prop="alipayCertPath">
          <el-upload
            :on-remove="(file, fileList) => handleRemove('2', file, fileList)"
            :on-success="(response, file, fileList) => handleSuccess('2', response, file, fileList)"
            :before-upload="beforeAvatarUpload"
            :http-request="(action) => uploadFile('2', action)"
            class="upload-demo"
            :file-list="formData.alipayCertPath"
            action="#"
            :limit="1"
            :auto-upload="true"
          >
            <el-button
              v-if="!formData.alipayCertPath || formData.alipayCertPath.length == 0"
              size="small"
              type="primary"
              >点击上传</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formData.authType == 1" label="支付宝根证书" prop="alipayRootCertPath">
          <el-upload
            :on-remove="(file, fileList) => handleRemove('3', file, fileList)"
            :on-success="(response, file, fileList) => handleSuccess('3', response, file, fileList)"
            :before-upload="beforeAvatarUpload"
            :http-request="(action) => uploadFile('3', action)"
            class="upload-demo"
            :file-list="formData.alipayRootCertPath"
            action="#"
            :limit="1"
            :auto-upload="true"
          >
            <!-- :on-preview="handlePreview" -->
            <el-button
              v-if="!formData.alipayRootCertPath || formData.alipayRootCertPath.length == 0"
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
  getAlipayAccountPage,
  alipayAccountAdd,
  alipayAccount,
  alipayAccountUpdate,
  alipayAccountEnable,
  alipayAccountDelete
} from '@/api/ali-pay'
import { aliPayRules, queryRules } from './rules.js'
import { formatDateTime } from '@/utils'

import { getFileById, uploadFileToServer } from '@/api/upload'

export default {
  name: 'AliPayManager',
  data() {
    return {
      tableData: [],
      rules: aliPayRules,
      queryRules: queryRules,
      dialogVisible: false,
      formData: {
        alipayAccount: '',
        alipayName: '',
        appId: '',
        appName: '',
        privateKey: '',
        authType: 0, // 认证类型 0: 密钥 1: 证书
        alipayPublicKey: '',
        appCertPath: [],
        alipayCertPath: [],
        alipayRootCertPath: [],
        isActive: 1,
        remark: ''
      },
      queryFormData: this.getQueryForm(),
      isEdit: false // 是否是编辑状态
    }
  },
  methods: {
    radioChange(e) {
      this.formData.alipayPublicKey = ''
      this.formData.appCertPath = []
      this.formData.alipayCertPath = []
      this.formData.alipayRootCertPath = []
    },
    async uploadFile(row, action) {
      console.log(row, '09')
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
        let res = await alipayAccountEnable(row.alipayAccountId, {
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
          ? (this.formData.appCertPath = fileList)
          : flag == 2
          ? (this.formData.alipayCertPath = fileList)
          : (this.formData.alipayRootCertPath = fileList)
        flag == 1
          ? (this.formData.appCertPathId = response.data)
          : flag == 2
          ? (this.formData.alipayCertPathId = response.data)
          : (this.formData.alipayRootCertPathId = response.data)
      } else {
        console.error('上传文件出错', response)
        flag == 1
          ? (this.formData.appCertPath = [])
          : flag == 2
          ? (this.formData.alipayCertPath = [])
          : (this.formData.alipayRootCertPath = [])
      }
      this.$forceUpdate()
    },

    handleRemove(row, file, fileList) {
      console.log(row, 'row')
      const flag = row
      flag == 1
        ? (this.formData.appCertPath = [])
        : flag == 2
        ? (this.formData.alipayCertPath = [])
        : (this.formData.alipayRootCertPath = [])
      this.$forceUpdate()
    },

    async getAlipayAccountPage(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
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
      let res = await getAlipayAccountPage(params, page)
      console.log(res, 'res')
      this.tableData = res.data.list
      return res
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除 【 ${row.alipayName}】 吗？`)
        let res = await alipayAccountDelete(row.alipayAccountId)
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
      let res = await alipayAccount(row.alipayAccountId)
      console.log(res, 'res-----')
      this.formData = res.data

      const appCertPathId = res.data.appCertPath // 服务器返回的图片id
      const alipayCertPathId = res.data.alipayCertPath // 服务器返回的图片id
      const alipayRootCertPathId = res.data.alipayRootCertPath // 服务器返回的图片id
      this.formData.appCertPath = []
      this.formData.alipayCertPath = []
      this.formData.alipayRootCertPath = []
      this.formData.appCertPathId = appCertPathId
      this.formData.alipayCertPathId = alipayCertPathId
      this.formData.alipayRootCertPathId = alipayRootCertPathId
      if (this.formData.authType == 0) {
        return
      }
      getFileById(appCertPathId).then((res1) => {
        console.log(res1, 'res11')
        this.formData = {
          ...this.formData,
          appCertPath: [
            {
              url: res1.data.fileUrl,
              name: res1.data.originalName
            }
          ]
        }
      })
      getFileById(alipayCertPathId).then((res2) => {
        console.log(res2, 'res22')
        this.formData = {
          ...this.formData,
          alipayCertPath: [
            {
              url: res2.data.fileUrl,
              name: res2.data.originalName
            }
          ]
        }
      })
      getFileById(alipayRootCertPathId).then((res3) => {
        console.log(res3, 'res33')
        this.formData = {
          ...this.formData,
          alipayRootCertPath: [
            {
              url: res3.data.fileUrl,
              name: res3.data.originalName
            }
          ]
        }
      })

      // this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        alipayAccount: '',
        alipayName: '',
        appId: '',
        appName: '',
        privateKey: '',
        authType: 0, // 认证类型 0: 密钥 1: 证书
        alipayPublicKey: '',
        appCertPath: [],
        alipayCertPath: [],
        alipayRootCertPath: [],
        isActive: 1,
        remark: ''
      }
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            console.log(this.formData, 'this.formDatathis.formData')

            let res = await alipayAccountUpdate({
              alipayAccountId: this.formData.alipayAccountId,
              alipayAccount: this.formData.alipayAccount,
              alipayName: this.formData.alipayName,
              appId: this.formData.appId,
              appName: this.formData.appName,
              privateKey: this.formData.privateKey,
              authType: this.formData.authType,
              appCertPath: this.formData.authType == 1 ? this.formData.appCertPathId : '',
              alipayPublicKey: this.formData.authType == 0 ? this.formData.alipayPublicKey : '',
              alipayCertPath: this.formData.authType == 1 ? this.formData.alipayCertPathId : '',
              alipayRootCertPath:
                this.formData.authType == 1 ? this.formData.alipayRootCertPathId : '',
              isActive: this.formData.isActive,
              remark: this.formData.remark
            })
            // 编辑
          } else {
            // 新增
            let res = await alipayAccountAdd({
              alipayAccount: this.formData.alipayAccount,
              alipayName: this.formData.alipayName,
              appId: this.formData.appId,
              appName: this.formData.appName,
              privateKey: this.formData.privateKey,
              tenantId: this.$store.state.tenant.selectTenantId,
              authType: this.formData.authType,
              appCertPath: this.formData.authType == 1 ? this.formData.appCertPathId : '',
              alipayPublicKey: this.formData.authType == 0 ? this.formData.alipayPublicKey : '',
              alipayCertPath: this.formData.authType == 1 ? this.formData.alipayCertPathId : '',
              alipayRootCertPath:
                this.formData.authType == 1 ? this.formData.alipayRootCertPathId : '',
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
