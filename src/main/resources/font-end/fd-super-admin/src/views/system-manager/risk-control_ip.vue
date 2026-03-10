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
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="queryFormData.ip" placeholder="请输入IP地址" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select v-model="queryFormData.isActive" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryFormData.createTime"
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
        :loadData="sensitiveIpPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="IP" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="address" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="(e) => onSwitchChange(e, row)" />
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
      :title="isEdit ? '编辑条目' : '新增条目'"
      width="600px"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="IP地址" prop="ip" :rules="ipRules">
          <el-input v-model="formData.ip" placeholder="请输入IP地址" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
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
import { formatDateTime } from '@/utils'
import {
  sensitiveIpPage,
  sensitiveIpAdd,
  sensitiveIpExists,
  sensitiveIpDelete,
  sensitiveIpEnable
} from '@/api/system-manager'
import { queryRules, riskRules } from './rules.js'
import { rulesName } from '@/utils/validate'
export default {
  name: 'gCodePreview',
  data() {
    return {
      tableData: [],
      queryRules: queryRules,
      rules: riskRules,
      ipRules: [
        { required: true, message: '请输入IP地址', trigger: 'blur' },
        rulesName,
        {
          validator: async (rule, value, callback) => {
            console.log(value)
            let res = await sensitiveIpExists(value)
            if (res.data) {
              callback(new Error('IP地址已存在'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      dialogVisible: false,
      formData: {
        ip: '',
        isActive: ''
      },
      queryFormData: this.getQueryForm(),
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  watch:{
    '$store.state.tenant.selectTenantId'(val){
      this.$refs.tableRef.getTableData(1)
    }
  },
  methods: {
    async onSwitchChange(e, row) {
      try {
        let res = await sensitiveIpEnable(row.riskIpId, {enabled:e})
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    async sensitiveIpPage(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            // params['startTime'] = this.queryFormData['createTime'][0]
            // params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await sensitiveIpPage(params, page)
      this.tableData = res.data.list.map(ele=>{
        ele.isActive = ele.isActive ? 1 : 0
        return ele
      })
      console.log(res)
      return res
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30, 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)

      return {
        ip: '',
        isActive: '',
        createTime: [todayStr, nowStr]
      }
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除IP地址 【 ${row.ip} 】吗？`)
        let res = await sensitiveIpDelete(row.riskIpId)
        //todo 调用接口删除
        console.log('删除成功')
        this.$refs.tableRef.getTableData()
      } catch (e) {
        console.log('取消删除')
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        ip: '',
        isActive: 1
      }
    },
    async onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            //修改
          } else {
            //新增
            let res = await sensitiveIpAdd({ ...this.formData, tenantId: this.$store.state.tenant.selectTenantId })
            console.log(res, '添加')
          }
          this.dialogVisible = false
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
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

<style lang="scss" scoped></style>
