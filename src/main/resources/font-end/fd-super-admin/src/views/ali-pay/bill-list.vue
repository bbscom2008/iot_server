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
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="queryFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="码商名称" prop="providerName">
          <el-input
            v-model="queryFormData.providerName"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="收款码名称" prop="payeeAccountName">
          <el-input
            v-model="queryFormData.payeeAccountName"
            placeholder="请输入收款码名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="收入/支出" prop="direction">
          <el-select v-model="queryFormData.direction" placeholder="请选择收入/支出" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="收入" value="收入"></el-option>
            <el-option label="支出" value="支出"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额（元）" prop="transAmount">
          <el-input
            v-number-input
            v-model="queryFormData.transAmount"
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>
        <el-form-item label="账务备注" prop="transMemo">
          <el-input v-model="queryFormData.transMemo" placeholder="请输入账务备注" size="small" />
        </el-form-item>
        <el-form-item label="入账时间" prop="">
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
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <my-table
        class="mt-10"
        :loadData="getAlipayBillPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="租户ID" align="center" prop="tenantId" />
        <el-table-column label="系统订单号" align="center" prop="systemOrderNo" />
        <el-table-column label="码商名称" align="center" prop="providerName" />
        <el-table-column label="收款码名称" align="center" prop="payeeAccountName" />
        <el-table-column label="商户订单号" align="center" prop="merchantOrderNo" />
        <el-table-column label="账户余额(元)" align="center" prop="balance" />
        <el-table-column label="收入/支出" align="center" prop="direction" />
        <el-table-column label="对方账户" align="center" prop="otherAccount" />
        <el-table-column label="金额(元)" align="center" prop="transAmount" />
        <el-table-column label="入账时间" align="center" prop="transDt" />
        <el-table-column label="账务备注" align="center" prop="transMemo" />
        <el-table-column label="账务记录类型" align="center" prop="type">
          <template slot-scope="{ row }">
            {{row.type}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showInfo(row)">
                <i class="el-icon-edit" />详情
              </div>
              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-drawer
      title="订单详情"
      :visible.sync="drawer"
      direction="rtl"
      @closed="handleClosed"
      size="40%"
    >
      <div class="info-con" v-loading="$store.state.app.loading">
        <p class="info-line">
          <span class="line-label">系统订单号：</span>
          <span class="line-content">{{ orderInfoData.alipayBillId }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">租户ID：</span>
          <span class="line-content">{{ orderInfoData.tenantId }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">码商名称：</span>
          <span class="line-content">{{ orderInfoData.providerName }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">收款码名称：</span>
          <span class="line-content">{{ orderInfoData.payeeAccountName }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">支付宝账务流水号：</span>
          <span class="line-content">{{ orderInfoData.accountLogId }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">支付宝订单号：</span>
          <span class="line-content">{{ orderInfoData.alipayOrderNo }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">商户订单号：</span>
          <span class="line-content">{{ orderInfoData.merchantOrderNo }}</span>
        </p>
        <!-- <p class="info-line">
          <span class="line-label">支付宝交易商户退款请求号：</span>
          <span class="line-content">{{ orderInfoData.merchantOutRefundNo }}</span>
        </p> -->
        <p class="info-line">
          <span class="line-label">账户余额(元)：</span>
          <span class="line-content">{{ orderInfoData.balance }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">业务账单来源：</span>
          <span class="line-content">{{ orderInfoData.billSource }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">业务订单号：</span>
          <span class="line-content">{{ orderInfoData.bizNos }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">业务基础订单号：</span>
          <span class="line-content">{{ orderInfoData.bizOrigNo }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">业务描述：</span>
          <span class="line-content">{{ orderInfoData.bizDesc }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">账单的补全信息：</span>
          <span class="line-content">{{ orderInfoData.complementInfo }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">收入/支出：</span>
          <span class="line-content">{{ orderInfoData.direction }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">对方账户：</span>
          <span class="line-content">{{ orderInfoData.otherAccount }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">金额(元)：</span>
          <span class="line-content">{{ orderInfoData.transAmount }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">入账时间：</span>
          <span class="line-content">{{ orderInfoData.transDt }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">账务备注：</span>
          <span class="line-content">{{ orderInfoData.transMemo }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">账务记录类型：</span>
          <span class="line-content">{{ orderInfoData.type }}</span>
        </p>
        <p class="info-line">
          <span class="line-label">创建时间：</span>
          <span class="line-content">{{ orderInfoData.createTime }}</span>
        </p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getAlipayBillPage,
  alipayBillDelete,
  alipayBillInfo,
  alipayBillExport
} from '@/api/ali-pay'
import { aliPayRules, queryRules } from './rules.js'
import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'
export default {
  name: 'AliBillList',
  data() {
    return {
      tableData: [],
      rules: aliPayRules,
      queryRules: queryRules,
      dialogVisible: false,
      drawer: false,
      orderInfoData: {},
      queryFormData: this.getQueryForm()
    }
  },
  computed: {
    selectTenantId() {
      return this.$store.state.tenant.selectTenantId
    }
  },

  watch: {
    selectTenantId(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (this.$route.name == 'AliBillList') {
        this.$refs.tableRef.getTableData(1)
      }
    }
  },
  methods: {
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'create_time') {
            obj['startTime'] = this.queryFormData['create_time'][0]
            obj['endTime'] = this.queryFormData['create_time'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })

      let res = await alipayBillExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '支付宝账单.xlsx')
    },
    handleClosed() {
      this.drawer = false
    },
    async getAlipayBillPage(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'create_time') {
            params['startTime'] = this.queryFormData['create_time'][0]
            params['endTime'] = this.queryFormData['create_time'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await getAlipayBillPage(params, page)
      console.log(res, 'res')
      this.tableData = res.data.list
      return res
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除系统订单号为 【 ${row.systemOrderNo}】的账单吗？`)
        let res = await alipayBillDelete(row.alipayBillId, this.$store.state.tenant.selectTenantId)
        this.$refs.tableRef.getTableData()
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    async showInfo(row) {
      this.drawer = true
      let res = await alipayBillInfo(row.alipayBillId, this.$store.state.tenant.selectTenantId)
      this.orderInfoData = res.data
      console.log(res, 'res')
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
        direction: '',
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
.info-con {
  display: flex;
  flex-wrap: wrap;
  p {
    margin: 0px;
  }
  .info-line2 {
    width: 100%;
    display: flex;
    align-items: flex-start;
    margin-top: 20px;

    .line-label {
      width: 150px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      margin-top: 7px;
      font-size: 14px;
      text-align: right;
      padding-right: 10px;
    }
    .line-content {
      flex: 1;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      min-height: 33px;
      line-height: 1.5;
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 20px;
    }
  }
  .info-line {
    width: 50%;
    display: flex;
    align-items: flex-start;
    margin-top: 20px;

    .line-label {
      width: 150px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      margin-top: 7px;
      font-size: 14px;
      text-align: right;
      padding-right: 10px;
    }
    .line-content {
      flex: 1;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      min-height: 33px;
      line-height: 1.5;
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 20px;
    }
  }
}
</style>
