<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormDataRef"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="产品类型编码" prop="productTypeCode">
          <el-input
            v-model="queryFormData.productTypeCode"
            placeholder="请输入产品类型编码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="解析模式" prop="analyticalModel">
          <el-input
            v-model="queryFormData.analyticalModel"
            placeholder="请输入解析模式"
            size="small"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-select v-model="queryFormData.isActive" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="占位符" prop="placeholder">
          <el-input v-model="queryFormData.placeholder" placeholder="请输入占位符" size="small" />
        </el-form-item>
        <el-form-item label="替换值" prop="replaceValue">
          <el-input v-model="queryFormData.replaceValue" placeholder="请输入替换值" size="small" />
        </el-form-item> -->
        <!-- <el-form-item label="创建时间" prop="">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            unlink-panels
            :picker-options="myPickerOptionsAll"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item> -->

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
        ref="tableRef"
        :loadData="loadTableData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="产品类型编码" align="center" prop="productTypeCode">
          <template slot-scope="{ row }">
            {{ row.productTypeCode }}
          </template>
        </el-table-column>

        <el-table-column label="解析模式" align="center">
          <template slot-scope="{ row }">
            {{ row.analyticalModel }}
          </template>
        </el-table-column>
        <el-table-column label="占位符" align="center" prop="placeholder">
          <template slot-scope="{ row }">
            {{ row.placeholder }}
          </template>
        </el-table-column>

        <el-table-column label="替换值" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.replaceValue }}</span>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="onSwitchChange(row)" />
          </template>
        </el-table-column>

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
      :title="isEdit ? '修改联接类型' : '新增联接类型'"
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
        <el-form-item label="产品类型名称" prop="productTypeCode">
          <el-select
            filterable
            v-model="formData.productTypeCode"
            placeholder="请选择产品类型名称"
            size="small"
          >
            <el-option
              v-for="item in allProductTypeList"
              :key="item.productTypeCode"
              :label="item.productTypeName"
              :value="item.productTypeCode"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="解析模式" prop="analyticalModel">
          <el-input v-model="formData.analyticalModel" placeholder="请输入解析模式" size="small" />
        </el-form-item>

        <el-form-item label="占位符" prop="placeholder">
          <el-input v-model="formData.placeholder" placeholder="请输入占位符" size="small" />
        </el-form-item>

        <el-form-item label="替换值" prop="replaceValue">
          <el-input v-model="formData.replaceValue" placeholder="请输入替换值" size="small" />
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
import { neturlRules, queryRules } from './rules'
import {
  getLinkTypePage,
  getProductTypeList,
  linkTypeUpdate,
  linkTypeDelete,
  linkTypeAdd,
  linkTypeEnable
} from '@/api/tenant-product-neturl'

export default {
  name: 'ProductNeturl',
  data() {
    return {
      rules: neturlRules,
      queryRules: queryRules,
      tableData: [],
      allProductTypeList: [],
      dialogVisible: false,
      formData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false // 是否是编辑状态
    }
  },
  methods: {
    async onSwitchChange(row) {
      const isActive = row.isActive

      try {
        let res = await linkTypeEnable(row.linkTypeId, {
          isActive
        })
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
            let res = await linkTypeUpdate({
              tenantId: this.$store.state.tenant.selectTenantId,
              productTypeCode: this.formData.productTypeCode,
              linkTypeId: this.formData.linkTypeId,
              analyticalModel: this.formData.analyticalModel,
              placeholder: this.formData.placeholder,
              replaceValue: this.formData.replaceValue,
              isActive: this.formData.isActive
            })
            console.log(res)
          } else {
            // 新增
            let res = await linkTypeAdd({
              tenantId: this.$store.state.tenant.selectTenantId,
              ...this.formData
            })
            console.log(res)
          }
          this.onDialogCancel()
          this.flushPage()
        }
      })
    },

    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除产品类型编码为 【 ${row.productTypeCode} 】的这条数据吗？`)

        await linkTypeDelete(row.linkTypeId)
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
      this.$refs.tableRef.getTableData()
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    showAddDialog() {
      this.getProductTypeList()
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        productTypeCode: '',
        analyticalModel: '',
        placeholder: '',
        replaceValue: '',
        isActive: 1
      }
    },
    async loadTableData(page) {
      const params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      const res = await getLinkTypePage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    resetQueryForm() {
      this.$refs.queryFormDataRef.resetFields()
      this.queryFormData = this.getQueryForm()
      this.queryTableData()
    },

    getQueryForm() {
      return {
        productTypeCode: '',
        analyticalModel: '',
        // placeholder: '',
        // replaceValue: '',
        isActive: ''
        // createTime: []
      }
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },
    async getProductTypeList() {
      let res = await getProductTypeList()
      this.allProductTypeList = res.data
      console.log()
    }
  },
  async mounted() {
    this.getProductTypeList()
  }
}
</script>

<style lang="scss" scoped></style>
