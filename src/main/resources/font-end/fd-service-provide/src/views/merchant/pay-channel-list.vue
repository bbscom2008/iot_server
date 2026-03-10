<template>
  <div class="container">
    <!-- <h3>商户管理 - 代收通道列表</h3> -->
    <div class="tips">可用支付渠道(api对接请参考文档中心的对接文档)</div>
    <el-table ref="infoTable" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" type="index" width="60" />

      <el-table-column align="center" label="通道名称">
        <template slot-scope="{ row }">
          <span>{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通道编码">
        <template slot-scope="{ row }">
          <span>{{ row.channelcode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="金额限制类型">
        <template slot-scope="{ row }">
          <span>{{
            row.astrictType == 0 ? '无限制' : row.astrictType == 1 ? '固定金额' : '范围金额'
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="金额值">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.astrictType == 0 ? '无限制' : row.money }}</span> -->
          <template v-if="row.astrictType == 0">
            <span>无限制</span>
          </template>
          <template v-else-if="row.astrictType == 1">
            <el-tag v-for="(item, id) of row.money" :key="id" style="margin-left: 10px">
              {{ item }}
            </el-tag>
          </template>
          <template v-else>
            <span>{{ row.money[0]}} — {{ row.money[1] }}</span>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="费率(%)">
        <template slot-scope="{ row }">
          <span>{{ parseFloat(row.rate).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否启用(开关)">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.enable }}</span> -->
          <el-switch v-model="row.enable" active-color="#13ce66" inactive-color="#999"> </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template>
          <el-button type="success" size="small"><svg-icon class="mr-5" icon-class="edit" />编辑</el-button>
          <el-button type="primary" size="small"><i class="el-icon-connection mr-5" />通道</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { payChannelList } from '@/api/merchant'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  name: 'payChannelList',
  data() {
    return {
      list: [],
      total: 0
    }
  },
  methods: {
    async getDataList() {
      let ret = await payChannelList()
      this.list = ret.data
    }
  },
  mounted() {
    this.getDataList()
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 30px 20px;
  margin-bottom: 20px;
}
</style>
