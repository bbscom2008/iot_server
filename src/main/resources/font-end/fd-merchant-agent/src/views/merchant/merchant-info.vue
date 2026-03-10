line
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
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>
        <el-form-item label="商户名称" prop="userNickName">
          <el-select
            filterable
            v-model="queryFormData.userNickName"
            placeholder="请选择"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.userNickName"
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

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <div class="tips mt-10">
        统计信息：
        <span class="mr-10"
          >商户总数: {{ summaryData.totalCount ? summaryData.totalCount : 0 }}
        </span>
        <span class="mr-10"
          >可用余额总和: {{ summaryData.availableBalance ? summaryData.availableBalance : 0 }}
        </span>
        <span class="mr-10"
          >冻结金额总和: {{ summaryData.freezeBalance ? summaryData.freezeBalance : 0 }}
        </span>
        <span class="mr-10"
          >预付商户金额总和: {{ summaryData.collectDeposit ? summaryData.collectDeposit : 0 }}
        </span>
      </div>
      <my-table
        class="mt-10"
        ref="tableRef"
        style="width: 100%"
        border
        :loadData="loadTableData"
        :tableData="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="商户名称" align="center" prop="userNickName" />
        <el-table-column
          class-name="balance"
          label="可用余额(元)"
          align="center"
          prop="availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.availableBalance) }}</span>
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
              <span class="val">{{ Number(row.freezeBalance) }}</span>
            </div>
          </template></el-table-column
        >
        <el-table-column
          class-name="balance"
          label="预付商户金额(元)"
          align="center"
          prop="collectDeposit"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.collectDeposit) }}</span>
            </div>
          </template></el-table-column
        >
        <el-table-column label="商户号" align="center" prop="merchantNo" />

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isActive">{{ row.isActive ? '开启' : '关闭' }}</el-tag>
            <el-tag v-else style="color: red">{{ row.isActive ? '开启' : '关闭' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="备注信息" align="center" prop="remark">
          <template slot-scope="{ row }">
            <span>{{ row.remark ? row.remark : '---' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" />
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { queryRules } from './rules'
import {
  getMerchantListByMerchantAgentId,
  getMerchantList,
  getMerchantSum,
  getMerchantListByMerchantAgentIdSelect,
  exportByMerchantAgentIdAndByCondition
} from '@/api/user'
import FileSaver from 'file-saver'
export default {
  name: 'MerchantInfo',
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      dialogVisible: false,
      queryFormData: {
        userName: '',
        userNickName: '',
        isActive: ''
      },
      summaryData: [],
      allMerchantList: [], // 所有商户列表
      selectionRows: [] // 选中的行数据
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async exportReport() {
      let obj = {
        merchantAgentId: this.$store.state.user.merchantAgentId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          obj[key] = this.queryFormData[key]
        }
      })
      let res = await exportByMerchantAgentIdAndByCondition(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户列表.xlsx')
    },
    async getMerchantSum() {
      let params = {
        merchantAgentId: this.$store.state.user.merchantAgentId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          params[key] = this.queryFormData[key]
        }
      })
      let res = await getMerchantSum(params)
      this.summaryData = res.data
      console.log(res, 'res')
    },
    updateMerchantList() {
      getMerchantListByMerchantAgentIdSelect().then((res) => {
        console.log(res)
        this.allMerchantList = res.data
      })
    },
    async loadTableData(page) {
      let params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          // this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined
        ) {
          params[key] = this.queryFormData[key]
        }
      })
      console.log(params, 'params')

      if (!this.$store.state.user.merchantAgentId) {
        await store.dispatch('user/merchantAgentInfo')
      }

      params.merchantAgentId = this.$store.state.user.merchantAgentId

      let res = await getMerchantListByMerchantAgentId(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.$refs.queryFormDataRef.resetFields()
    },
    getQueryForm() {
      return {
        userName: '',
        userNickName: '',
        isActive: ''
      }
    },
    queryTableData() {
      // 刷新表格
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.getMerchantSum()
        }
      })
    }
  },
  mounted() {
    this.updateMerchantList()
    this.getMerchantSum()
  }
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

// .fee-box {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   .val,
//   .plus,
//   .sub {
//     position: absolute;
//     padding: 5px;
//     // background-color: aquamarine;
//   }
//   .val {
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//   }
//   .plus {
//     font-size: 18px;
//     color: skyblue;
//     cursor: pointer;
//     top: 0px;
//     right: 0px;
//     &:hover {
//       color: red;
//     }
//   }
//   .sub {
//     font-size: 18px;
//     color: skyblue;
//     cursor: pointer;
//     right: 0px;
//     bottom: 0px;
//     &:hover {
//       color: red;
//     }
//   }
// }
.tag-pink {
  cursor: pointer;
  margin-left: 5px;
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}
</style>
