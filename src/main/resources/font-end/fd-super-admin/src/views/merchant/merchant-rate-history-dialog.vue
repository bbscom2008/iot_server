<template>
  <div class="container" v-if="isDialogVisible" >
    <el-dialog
      :visible.sync="isDialogVisible"
      :title="`商户【${item.userNickName}】费率记录`"
      :modal="false"
      @close="onDialogBtnClose()"
      width="800px"
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

          <el-table-column label="通道名称" align="center" prop="channelName" />
          <el-table-column label="通道编码" align="center" prop="channelCode" />

          <el-table-column label="原商户费率(%)" align="center">
            <template slot-scope="{ row }"> {{ row.originalRate }}% </template>
          </el-table-column>
          <el-table-column label="新商户费率(%)" align="center">
            <template slot-scope="{ row }">
              <span style="color: green; font-weight: 600"> {{ row.newRate }}%</span>
            </template>
          </el-table-column>

          <el-table-column label="原单笔费用(元)" align="center">
            <template slot-scope="{ row }">
              {{ row.originalTransactionFee | amountFormat }}
            </template>
          </el-table-column>
          <el-table-column label="新单笔费用(元)" align="center">
            <template slot-scope="{ row }">
              <span style="color: green; font-weight: 600"> {{ row.newTransactionFee | amountFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center" width="150" >
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
import { getChannelMerchantRateHistoryList } from '@/api/service-income-info.js'

export default {
  name: 'merchantRateHistoryDialog',
  data() {
    return {
      tableData: [],
      isDialogVisible: false,
      item:{}
    }
  },
  methods: {
    showRateHistoryDialog(row) {
      this.item = row
      this.isDialogVisible = true
      // this.$refs.tableRef.getTableData(1)
    },

    async loadTableData({ pageNum, pageSize }) {
      let res = await getChannelMerchantRateHistoryList(this.item.id, {
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
