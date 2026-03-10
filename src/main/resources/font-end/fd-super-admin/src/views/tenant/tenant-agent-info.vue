<template>
  <div class="container">
    <el-dialog :visible.sync="tenent_info_dialog" title="平台信息" width="700px">
      <my-table
        ref="tableRef"
        class="mt-10"
        v-if="tenent_info_dialog"
        :tableData="infoTableData"
        :loadData="loadTableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="平台名称" align="center" width="180">
          <template slot-scope="{ row }">
            <div>{{ row.tenantName }}</div>
          </template>
        </el-table-column>

        <el-table-column label="平台可用余额（元）" align="center">
          <template slot-scope="{ row }">{{ Number(row.availableBalance) }} </template>
        </el-table-column>

        <el-table-column label="平台冻结金额（元）" align="center">
          <template slot-scope="{ row }">
            {{ row.freezeBalance }}
          </template>
        </el-table-column>
      </my-table>

      <div slot="footer">
        <el-button @click="tenent_info_dialog = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTenantListByAgentId } from '@/api/tenant-agent'
export default {
  name: 'agentInfo',
  props: {
    currItem: {
      type: Object,
      default: {}
    }
  },


  data() {
    return {
      infoTableData: [],
      tenent_info_dialog: false
    }
  },
  methods: {
    async loadTableData(page) {
      let res = await getTenantListByAgentId(this.currItem.tenantAgentId, { ...page })
      this.infoTableData = res.data.list
      console.log(res)
      return res
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped></style>
