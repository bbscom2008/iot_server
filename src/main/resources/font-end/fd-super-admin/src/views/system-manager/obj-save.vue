<template>
  <div class="container">
    <el-card>
      <el-form
        :rules="queryRules"
        :inline="true"
        ref="queryFormRef"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="域名" prop="domain">
          <el-input v-model="queryFormData.domain" placeholder="请输入域名" size="small" />
        </el-form-item>

        <el-form-item label="桶名称" prop="bucketName">
          <el-input v-model="queryFormData.bucketName" placeholder="请输入桶名称" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select filterable v-model="queryFormData.isActive" placeholder="请选择" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
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
        ref="my-table"
        :loadData="loadTableData"
        :total="50"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="名称" align="center">
          <template slot-scope="{ row }">
            {{ row.ossName }}
          </template>
        </el-table-column>

        <el-table-column label="访问站点" align="center" prop="endpoint" />
        <el-table-column label="域" align="center" prop="region">
          <template slot-scope="{ row }">
            {{ row.region }}
          </template>
        </el-table-column>

        <el-table-column label="桶名称" align="center">
          <template slot-scope="{ row }">
            <el-tag>{{ row.bucketName }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="accessKey" align="center" prop="accessKey" />
        <el-table-column label="秘钥" align="center" prop="secretKey" />

        <el-table-column label="基础路径" align="center" prop="basePath">
          <template slot-scope="{ row }"> {{ row.basePath }} </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch @change="(e) => onSwitchChange(row, e)" v-model="row.isActive" />
          </template>
        </el-table-column>

        <el-table-column label="自定义域名" align="center" prop="domain" />

        <el-table-column label="备份名称" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.backupOssName }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="createTime" width="135">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改对象存储' : '新增对象存储'"
      @close="onDialogCancel()"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="160px"
        style="margin-right: 100px"
      >
        <el-form-item label="名称" prop="ossName">
          <el-input v-model="formData.ossName" placeholder="请输入存储名称" size="small" />
        </el-form-item>

        <el-form-item label="访问站点" prop="endpoint">
          <el-input v-model="formData.endpoint" placeholder="请输入访问站点" size="small" />
        </el-form-item>

        <el-form-item label="域" prop="region">
          <el-input v-model="formData.region" placeholder="请输入域" size="small" />
        </el-form-item>

        <el-form-item label="桶名称" prop="bucketName">
          <el-input v-model="formData.bucketName" placeholder="请输入桶名称" size="small" />
        </el-form-item>

        <el-form-item label="accessKey" prop="accessKey">
          <el-input v-model="formData.accessKey" placeholder="请输入accessKey" size="small" />
        </el-form-item>
        <el-form-item label="secretKey" prop="secretKey">
          <el-input v-model="formData.secretKey" placeholder="请输入secretKey" size="small" />
        </el-form-item>

        <el-form-item label="基础路径" prop="basePath">
          <el-input v-model="formData.basePath" placeholder="请输入基础路径" size="small" />
        </el-form-item>

        <el-form-item label="自定义域名" prop="domain">
          <el-input v-model="formData.domain" placeholder="请输入自定义域名" size="small" />
        </el-form-item>

        <el-form-item label="选择备用服务器端" prop="backupOssConfigId">
          <el-select
            filterable
            clearable
            v-model="formData.backupOssConfigId"
            placeholder="请选择备用服务器"
            size="small"
          >
            <el-option
              v-for="item in objSaveType"
              :key="item.ossConfigId"
              :label="item.ossName"
              :value="item.ossConfigId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sysMangerRules, queryRules } from './rules'

import {
  getObjSavePage,
  addObjSave,
  updateObjSave,
  getAllObjSaveType,
  getObjSaveById,
  updateObjSaveStatus,
  deleteObjSave
} from '@/api/obj-save.js'

export default {
  name: 'ObjSave',
  data() {
    return {
      rules: sysMangerRules,
      queryRules,
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {},
      queryFormData: this.getQueryFormData(),
      isEdit: false, // 是否是编辑状态
      objSaveType: []
    }
  },
  methods: {
    async onSwitchChange(row, type) {
      try {
        let res = await updateObjSaveStatus(row.ossConfigId, type)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.flushPage()
    },
    onDialogCancel() {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    },

    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑
            let { backupOssName, createTime, ...params } = this.formData
            let res = await updateObjSave({
              ...params
            })
            console.log(res)
          } else {
            // 新增
            let res = await addObjSave(this.formData)
            console.log(res)
          }
          this.onDialogCancel()
          this.flushPage()
        }
      })
    },

    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除产品类型 【 ${row.endpoint} 】吗？`)

        await deleteObjSave(row.ossConfigId)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },

    flushPage() {
      // 保持当前分页不变，刷新表格数据
      this.$refs['my-table'].getTableData()
      this.getAllObjSaveType()
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        endpoint: '',
        region: '',
        bucketName: '',
        accessKey: '',
        secretKey: '',
        basePath: '',
        domain: '',
        isActive: 1
      }
    },

    async loadTableData(page) {
      let res = await getObjSavePage(page, {
        ...this.queryFormData
      })
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryFormData()
      this.queryTableData()
      this.$refs.queryFormRef.resetFields()
    },
    getQueryFormData() {
      return {
        isActive: ''
      }
    },

    queryTableData() {
      // 重置分页为第一页
      this.$refs['my-table'].getTableData(1)
    },
    getAllObjSaveType() {
      getAllObjSaveType().then((res) => {
        console.log('getAllObjSaveType--', res)
        this.objSaveType = res.data
      })
    }
  },
  mounted() {
    this.getAllObjSaveType()
  }
}
</script>

<style lang="scss" scoped></style>
