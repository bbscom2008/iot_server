<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormDataRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="平台名称" prop="tenantName">
          <el-input v-model="queryFormData.tenantName" placeholder="请输入平台名称" size="small" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isActive">
          <el-select filterable v-model="queryFormData.isActive" placeholder="请选择" size="small">
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

        <el-form-item label="过期时间" prop="">
          <el-date-picker
            v-model="queryFormData.expire_time"
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
      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="getTenantAgentByUserIdPage"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="平台名称" align="center" prop="tenantName" />
        <el-table-column label="平台ID" align="center" prop="tenantId" />
        <el-table-column
          class-name="balance"
          label="可用余额(元)"
          align="center"
          prop="availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ row.availableBalance }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          class-name="balance"
          label="冻结金额(元)"
          align="center"
          prop="freezeBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ row.freezeBalance }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="过期时间" align="center" prop="expireTime">
          <template slot-scope="{ row }">
            {{ row.expireTime }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive"> {{ row.isActive ? '启用' : '禁用' }} </el-tag>
            <el-tag v-else style="color: red"> {{ row.isActive ? '启用' : '禁用' }} </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="备注信息" align="center" prop="remark">
          <template slot-scope="{ row }">
            {{ row.remark?row.remark:'---' }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getTenantAgentByUserIdPage } from '@/api/report-center'
import { formatDateTime } from '@/utils'
import { queryRules } from './rules.js'
export default {
  name: 'TenantManager',
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      queryFormData: this.getQueryForm()
    }
  },
  methods: {
    async getTenantAgentByUserIdPage(page) {
      let params = { userId: this.$store.state.userAccount.userId }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined) {
          if (key == 'create_time') {
            params['startTime'] = this.queryFormData['create_time'][0]
            params['endTime'] = this.queryFormData['create_time'][1]
          } else if (key == 'expire_time') {
            params['startExpireTime'] = this.queryFormData['expire_time'][0]
            params['endExpireTime'] = this.queryFormData['expire_time'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getTenantAgentByUserIdPage(params, page)
      this.tableData = res.data.list
      return res
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.queryTableData()
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        platform: '',
        isActive: '',
        // create_time: [todayStr, nowStr],
        create_time: [],
        // expire_time: [todayStr, nowStr]
        expire_time: []
      }
    },
    showCopyDialog() {
      this.showCopyDialogVisable = true
    },
    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
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
::v-deep td.balance {
  .cell {
    // background-color: pink;
    height: 85px;
  }
}
.line {
  display: flex;
  flex-direction: row;
  align-items: center;
  .el_btn {
    margin-left: 5px;
    width: 40px;
    padding: 6px;
  }
}
</style>
