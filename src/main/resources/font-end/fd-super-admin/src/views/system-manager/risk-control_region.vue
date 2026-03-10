<template>
  <div class="container">
    <div class="tips">当前配置仅对代付有效，当代付单子是风险银行地区时，系统会自动过滤。</div>

    <el-card>
      <el-form
        :inline="true"
        :rules="queryRules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="银行名称" prop="bankName">
          <el-select v-model="queryFormData.bankName" filterable placeholder="请选择银行名称" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="bank in BankNames"
              :key="bank"
              :label="bank"
              :value="bank"
            ></el-option>
          </el-select>
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
        :loadData="getPaymentBankRegionRulePage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="银行名称" align="center" prop="bankName" />
        <el-table-column label="所属地区" align="center" prop="bankName">
          <template slot-scope="{ row }">
            <!-- {{ row.regionConfig }} -->
            <div v-if="row.regionList.length == 0" >
              全部省份
            </div>
            <div v-for="item in row.regionList" :key="item.province">
              {{ item.province }}
              <span v-if="item.cities && item.cities.length > 0">
                ({{ item.cities.join(',') }})
              </span>
              <span v-else> 全部 </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="(e) => onSwitchChange(e, row)" />
          </template>
        </el-table-column>

        <!-- <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column> -->

        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="primary" class="btn mt-5" @click="showEditDialog(row)">
                <i class="el-icon-edit" />编辑
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
      :title="isEdit ? '编辑条目' : '新增条目'"
      width="900px"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="银行名称" prop="bankName" :rules="wordRules">
          <el-select v-model="formData.bankName" filterable placeholder="请选择银行名称" size="small">
            <el-option
              v-for="bank in BankNames"
              :key="bank"
              :label="bank"
              :value="bank"
            ></el-option>
          </el-select>
          
          
          <!-- <el-input v-model="formData.bankName" placeholder="请输入银行名称" size="small" /> -->
        </el-form-item>

        <el-form-item label="地区选择" prop="regionConfig">
          <region-selector
            ref="regionSelector"
            v-model="formData.regionConfig"
            @change="onRegionChange"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
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
import RegionSelector from '@/components/RegionSelector'

import {BankNames} from '@/utils/provinceCity'

import {
  paymentBankRegionById,
  getPaymentBankRegionRulePage,
  addPaymentBankRegionRule,
  deletePaymentBankRegionRule,
  updatePaymentBankRegionRule
} from '@/api/risk-contrl-center'

import { queryRules, riskRules } from './rules.js'

export default {
  name: 'gCodePreview',
  components: {
    RegionSelector
  },
  data() {
    return {
      BankNames,
      queryRules: queryRules,
      rules: riskRules,
      wordRules: [
        { required: true, message: '请输入银行名称', trigger: 'blur' }
        // rulesName,
        // {
        //   validator: async (rule, value, callback) => {
        //     console.log(value)
        //     let res = await sensitiveWordExists(value)
        //     if (res.data) {
        //       callback(new Error('敏感词已存在'))
        //     } else {
        //       callback()
        //     }
        //   },
        //   trigger: 'blur'
        // }
      ],
      tableData: [],
      dialogVisible: false,
      formData: {
        bankName: '',
        isActive: '',
        regionConfig: [],
        remark: ''
      },
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      editingRow: null // 编辑中的行数据
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(val) {
      this.$refs.tableRef.getTableData(1)
    }
  },
  methods: {
    async getPaymentBankRegionRulePage(page) {
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
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getPaymentBankRegionRulePage(params, page)
      this.tableData = res.data.list.map((ele) => {
        ele.isActive = ele.isActive ? 1 : 0
        ele.regionList = ele.regionConfig ? JSON.parse(ele.regionConfig) : null
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
        bankName: '',
        isActive: ''
        // createTime: [todayStr, nowStr]
      }
    },
    async onSwitchChange(e, row) {
      try {
        const payload = {
          bankName: row.bankName,
          bankRegionRuleId: row.bankRegionRuleId,
          isActive: row.isActive ? 1 : 0,
          regionConfig: row.regionConfig,
          remark: row.remark
        }
        let res = await updatePaymentBankRegionRule(payload)
        console.log(res, '更新')
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除银行【 ${row.bankName} 】 吗？`)
        await deletePaymentBankRegionRule(row.bankRegionRuleId)
        console.log('删除成功')
        this.$refs.tableRef.getTableData()
      } catch (e) {
        console.log('取消删除')
      }
    },
    showAddDialog() {
      this.isEdit = false
      this.editingRow = null
      this.dialogVisible = true
      this.formData = {
        bankName: '',
        isActive: 1,
        regionConfig: [],
        remark: ''
      }
      // 清空地区选择器
      this.$nextTick(() => {
        if (this.$refs.regionSelector) {
          this.$refs.regionSelector.clearSelection()
        }
      })
    },
    showEditDialog(row) {
      this.isEdit = true
      this.editingRow = row
      this.dialogVisible = true
      // 解析 regionConfig
      const regionConfig = row.regionList || []
      this.formData = {
        bankName: row.bankName,
        isActive: row.isActive ? 1 : 0,
        regionConfig: regionConfig,
        remark: row.remark || ''
      }
      // 在树形选择器中恢复已选的地区
      this.$nextTick(() => {
        if (this.$refs.regionSelector) {
          this.$refs.regionSelector.restoreCheckedState(regionConfig)
        }
      })
    },
    onRegionChange(regionConfig) {
      // 地区选择变化时调用
      this.formData.regionConfig = regionConfig
      console.log('Selected regions:', regionConfig)
    },
    async onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          // 检查是否选择了地区
          // if (!this.formData.regionConfig || this.formData.regionConfig.length === 0) {
          //   this.$message.warning('请选择至少一个地区')
          //   return
          // }

          if (this.isEdit) {
            //修改
            // 去掉 regionList 只保留 regionConfig 字段
            const { regionList, ...rest } = this.editingRow

            const payload = {
              bankName: this.formData.bankName,
              isActive: this.formData.isActive ? 1 : 0,
              bankRegionRuleId: this.editingRow.bankRegionRuleId,
              regionConfig: JSON.stringify(this.formData.regionConfig),
              remark: this.formData.remark
            }
            let res = await updatePaymentBankRegionRule(payload)
            console.log(res, '更新')
            this.$message.success('更新成功')
          } else {
            //新增
            const payload = {
              ...this.formData,
              regionConfig: JSON.stringify(this.formData.regionConfig),
              isActive: this.formData.isActive ? 1 : 0,
              tenantId: this.$store.state.tenant.selectTenantId
            }
            let res = await addPaymentBankRegionRule(payload)
            console.log(res, '添加')
            this.$message.success('添加成功')
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
