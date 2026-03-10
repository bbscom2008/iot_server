<template>
  <div class="container" v-if="isDialogVisible" >
    <!-- 产品配置码商，码商配置产品都是这个对话框    -->
    <el-dialog
      :visible.sync="isDialogVisible"
      :title="`码商【${parentItem.userNickName || item.providerName}】费率记录`"
      :modal="false"
      @close="onDialogBtnClose()"
      width="700px"
    >
      <el-card>
        <my-table
          :loadData="loadTableData"
          :tableData="tableData"
          ref="tableRef"
          style="width: 100%"
          border
        >
          <el-table-column align="center" label="序号" type="index" width="55"></el-table-column>

          <el-table-column label="产品名称" align="center" prop="productName" />

          <el-table-column label="原费率(%)" align="center">
            <template slot-scope="{ row }"> {{ row.originalRate }}% </template>
          </el-table-column>
          <el-table-column label="新费率(%)" align="center">
            <template slot-scope="{ row }">
              <span style="color: green; font-weight: 600"> {{ row.newRate }}%</span>
            </template>
          </el-table-column>

          <el-table-column label="原单笔费用(元)" align="center">
            <template slot-scope="{ row }">
              {{ row.originalPerTransactionFee | amountFormat }}
            </template>
          </el-table-column>
          <el-table-column label="新单笔费用(元)" align="center">
            <template slot-scope="{ row }">
              <span style="color: green; font-weight: 600"> {{ row.newTransactionFee | amountFormat }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center" width="110" >
            <template slot-scope="{ row }">
              <span> {{ row.createTime }}</span>
            </template>
          </el-table-column>
        </my-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { getProviderProductRateHistory } from '@/api/service-product-mananger.js'

export default {
  name: 'productRateHistoryDialog',
  data() {
    return {
      tableData: [],
      isDialogVisible: false,
      item:{},
      parentItem:{}
    }
  },
  methods: {
      showRateHistoryDialog(row, parentItem) {
      this.item = row
      this.parentItem = parentItem
      this.isDialogVisible = true
    },

    async loadTableData({ pageNum, pageSize }) {
      let res = await getProviderProductRateHistory(this.item.id, {
        pageNum,
        pageSize
      })
      this.tableData = res.data.list
      return res
    },

    onDialogBtnClose() {
      this.isDialogVisible = false
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>

::v-deep .el-dialog{
  padding-bottom: 50px;
}

::v-deep .el-card__body{
  margin-top: 0;
}
</style>
