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
        <el-form-item label="支付类型" prop="paymentType">
          <el-select filterable v-model="queryFormData.paymentType" size="small">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="代收" value="代收"></el-option>
            <el-option label="代付" value="代付"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="团队长名称" prop="providerNickname">
          <el-input
            v-model="queryFormData.providerNickname"
            placeholder="请输入团队长名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            unlink-panels
            :picker-options="myPickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            align="right"
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
      <div>
        <!-- <span v-for="(item, index) in levelList" :key="index">
          <span @click="goLevel(item)" class="item" :class="providerId == item ? 'active' : ''">
            {{ index + 1 }}级
            <span v-if="levelList.length - 1 !== index" class="divider">/</span></span
          >
        </span> -->
      </div>

      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        row-key="providerId"
        :row-class-name="tableRowClassName"
        lazy
        :load="loadTreeData"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="当前层级" align="center" prop="currLevel" >
          <template slot-scope="{row}" >
            {{row.currLevel}}级
          </template>
        </el-table-column>
        <el-table-column label="团队长名称" align="left" prop="userNickName" />
        <el-table-column label="子级数量" align="center" prop="subLevelNumber">
          <template slot-scope="{ row }">
            {{ row.subLevelNumber }}个
            <!-- <el-button v-if="row.subLevelNumber !== 0" type="text" @click="checkInfo(row)"
              >查看</el-button
            > -->
          </template>
        </el-table-column>
        <el-table-column label="团队余额" align="center" prop="teamAvailableBalanceTotal">
          <template slot-scope="{ row }"> {{ row.teamAvailableBalanceTotal }} 元 </template>
        </el-table-column>
        <el-table-column label="金额占比" align="center" prop="amountProportion">
          <template slot-scope="{ row }"> {{ row.amountProportion }} </template>
        </el-table-column>

        <el-table-column
          label="在线收款码数量"
          align="center"
          prop="onlinePaymentInfoNumberTotal"
          width="150"
        >
          <template slot-scope="{ row }">
            {{ row.onlinePaymentInfoNumberTotal }}
            <!-- v-if="row.onlinePaymentInfoNumberTotal !== 0" -->
            <el-button
              v-if="row.onlinePaymentInfoNumberTotal !== 0"
              type="text"
              @click="checkOnlinePaymentInfo(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>

        <el-table-column label="团队成员" align="center" prop="teamNumberTotal">
          <template slot-scope="{ row }">
            {{ row.teamNumberTotal }}
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="center" prop="orderAmountTotal">
          <template slot-scope="{ row }">
            {{ row.orderAmountTotal ? row.orderAmountTotal : 0 }} 元
          </template>
        </el-table-column>
        <el-table-column label="订单数量" align="center" prop="orderNumberTotal">
          <template slot-scope="{ row }">
            {{ row.orderNumberTotal }}
          </template>
        </el-table-column>
        <el-table-column
          label="成功金额"
          sortable
          align="center"
          width="100"
          prop="successfullyOrdersAmountTotal"
        >
          <template slot-scope="{ row }">
            {{ row.successfullyOrdersAmountTotal ? row.successfullyOrdersAmountTotal : 0 }} 元
          </template>
        </el-table-column>
        <el-table-column label="成功数量" align="center" prop="successfullyOrdersNumberTotal">
          <template slot-scope="{ row }">
            {{ row.successfullyOrdersNumberTotal }}
          </template>
        </el-table-column>
        <el-table-column label="支付成功率" align="center" prop="paymentSuccessRate">
          <template slot-scope="{ row }">
            {{ row.paymentSuccessRate ? row.paymentSuccessRate : '0.00 %' }}
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      v-if="onlineDialogVisible"
      :visible.sync="onlineDialogVisible"
      title="在线收款码数量"
      width="1100px"
    >
      <el-card>
        <el-form
          :inline="true"
          ref="onlineFormData"
          :model="onlineFormData"
          class="demo-form-inline"
        >
          <el-form-item label="码商名称" prop="providerId">
            <el-select
              filterable
              v-model="onlineFormData.providerId"
              placeholder="请选择码商名称"
              size="small"
            >
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="item in subProviderList"
                :key="item.providerId"
                :label="item.userNickName"
                :value="item.providerId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData1"
              >搜索</el-button
            >
            <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm1">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="mt-10">
        <my-table
          class="mt-10"
          :loadData="loadonlineData"
          :tableData="onlineData"
          ref="tableOnline"
          style="width: 100%"
          border
        >
          <el-table-column label="序号" align="center" type="index" width="60" />

          <el-table-column label="码商名称" align="center" prop="userNickName" />
          <el-table-column label="收款码名称" align="center" prop="payeeAccountName" />
        </my-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {
  teamManagementList,
  getPayeeAccountListPageByProviderId,
  getProviderContainsSubByProviderId,
  getOneLinePayeeAccountListPageBySelfProviderId
} from '@/api/service-team-manage.js'
import { formatDateTime } from '@/utils'
export default {
  name: 'ServiceTeamManage',
  data() {
    return {
      queryRules: {},
      queryFormData: this.getQueryForm(),
      tableData: [],
      teamData: [],
      teamFormData: this.getQueryForm(),
      levelList: [''],
      providerId: '',
      onlineDialogVisible: false,
      subProviderList: [],
      onlineData: [],
      providerIdOnline: '',
      onlineFormData: {
        providerId: ''
      }
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.providerId = ''
      this.levelList = ['']
      this.queryTableData()
    }
  },

  methods: {
    tableRowClassName({row, rowIndex}){
      console.log('tableRowClassName');
      console.log(row);
      // if (rowIndex === 1) {
      //     return 'warning-row';
      //   } else if (rowIndex === 3) {
      //     return 'success-row';
      //   }
        return 'level_'+row.currLevel;
    },
    async loadTreeData(tree, treeNode, resolve) {
      // console.log('tree : ', tree)
      // console.log('treeNode : ', treeNode)

      const providerId = tree.providerId

      let params = {
        tenantId: this.$store.state.tenant.selectTenantId,
        providerTeamQueryType: providerId == '' ? '1' : '2',
        providerId: providerId
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

      let page = {
        pageSize: 100,
        pageNum: 1
      }

      let res = await teamManagementList(params, page)
      let tableData = res.data.list
      tableData.forEach((ele) => {
        ele.hasChildren = ele.subLevelNumber > 0
        ele.children = []
        ele.currLevel = tree.currLevel+1
      })

      resolve(tableData)
    },
    goLevel(item) {
      this.providerId = item
      this.$refs.tableRef.getTableData(1)
      if (this.levelList.indexOf(item) + 1 < this.levelList.length) {
        this.levelList = this.levelList.slice(0, this.levelList.indexOf(item) + 1)
      }
      if (item == '') {
        this.levelList = ['']
      }
    },
    checkOnlinePaymentInfo(row) {
      this.providerIdOnline = row.providerId
      this.getProviderContainsSubByProviderId(row.providerId)
      this.onlineData = []
      this.onlineDialogVisible = true
      this.onlineFormData = {
        providerId: ''
      }
    },
    checkInfo(row) {
      this.providerId = row.providerId
      if (!this.levelList.includes(row.providerId)) {
        this.levelList.push(row.providerId)
      }
      this.$refs.tableRef.getTableData(1)
    },
    async getProviderContainsSubByProviderId(providerId) {
      let res = await getProviderContainsSubByProviderId(providerId)
      this.subProviderList = res.data
    },
    async loadonlineData(page) {
      if (this.onlineFormData.providerId) {
        let providerId = this.onlineFormData.providerId
        let res = await getOneLinePayeeAccountListPageBySelfProviderId(providerId, {
          ...page,
          tenantId: this.$store.state.tenant.selectTenantId
        })
        this.onlineData = res.data.list
        return res
      } else {
        let providerId = this.providerIdOnline
        let res = await getPayeeAccountListPageByProviderId(providerId, {
          ...page,
          tenantId: this.$store.state.tenant.selectTenantId
        })
        this.onlineData = res.data.list
        return res
      }
    },
    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId,
        providerTeamQueryType: this.providerId == '' ? '1' : '2'
      }
      if (this.providerId) {
        params.providerId = this.providerId
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

      let res = await teamManagementList(params, page)
      this.tableData = res.data.list
      this.tableData.forEach((ele) => {
        ele.hasChildren = ele.subLevelNumber > 0
        ele.currLevel = 1
      })

      console.log(res)
      return res
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    resetQueryForm1() {
      this.onlineFormData = {
        providerId: ''
      }
      this.$refs.tableOnline.getTableData(1)
    },
    resetTeamFormData() {
      this.teamFormData = this.getQueryForm()
      this.$refs.teamData.getTableData(1)
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(new Date(today.getTime() - 24*60*60*1000*30))
      return {
        paymentType: '全部',
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },
    queryTableData1() {
      this.$refs.onlineFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableOnline.getTableData(1)
        }
      })
    },
    queryTeamFormData() {
      this.$refs.teamFormDataref.validate(async (valid) => {
        if (valid) {
          this.$nextTick(() => {
            this.$refs.teamData.getTableData(1)
          })
          //
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

::v-deep .level_1{
  // background-color: rgb(210, 232, 241) !important;
}

::v-deep .level_2{
  background-color: #fde9d9 !important;
}

::v-deep .level_3{
  background-color: #fcd5b4 !important;
}

::v-deep .level_4{
  background-color: #fabf8f !important;
}
::v-deep .level_5{
  background-color: #b7dee8 !important;
}
::v-deep .level_6{
  background-color: #92cddc !important;
}
::v-deep .level_7{
  background-color: #ccc0da !important;
}
::v-deep .level_8{
  background-color: #b1a0c7 !important;
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
.red {
  color: red;
}
.tag-pink {
  cursor: pointer;
  margin-left: 5px;
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}
.label {
  font-size: 18px;
  margin-right: 10px;
  line-height: 20px;
}
.text {
  font-size: 16px;
  // color: green;
  line-height: 20px;
}
.remark {
  font-size: 12px;
}
.editBtn {
  cursor: pointer;
}
.labelText {
  // font-size: 18px;
  line-height: 18px;
  font-weight: bold;
}
.active {
  color: #007bff;
}

.divider {
  margin: 0 5px !important; /* 分隔符左右各5px的间距 */
  color: #303133;
}
.item {
  font-size: 20px !important;
  cursor: pointer;
}
</style>
