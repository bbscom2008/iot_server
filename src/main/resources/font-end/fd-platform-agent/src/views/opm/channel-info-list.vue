<template>
  <div class="container">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="登录名:">
        <el-input v-model="formData.username" size="small" placeholder="登录名"></el-input>
      </el-form-item>
      <el-form-item label="Accesskey(商户号):">
        <el-input v-model="formData.userNumber" size="small" placeholder="商户号"></el-input>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="formData.comment" size="small" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item label="标签">
        <el-select filterable  v-model="formData.region" placeholder="活动区域" size="small">
          <el-option label="代收" value="shanghai"></el-option>
          <el-option label="收付" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">
          <i class="el-icon-refresh mr-5" />刷新</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleAdd" size="small">
          <i class="el-icon-plus mr-5" />新建</el-button
        >
      </el-form-item>
    </el-form>

    <div class="tips">收款信息列表：</div>

    <my-table
      class="mt-10"
      ref="infoTable"
      :tableData="list"
      :total="total"
      :loadData="getDataList"
      style="width: 100%"
    >
      <my-table-column label="序号" align="center" type="index" width="60" />

      <my-table-column align="center" label="产品名称">
        <template slot-scope="{ row }">
          <span>{{ row.productName }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="收款信息名称">
        <template slot-scope="{ row }">
          <span>{{ row.receipeInfoName }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="限额类型">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.astrictType }}</span> -->
          <span>{{
            row.astrictType == 0 ? '无限制' : row.astrictType == 1 ? '固定金额' : '范围金额'
          }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="金额限制" width="130">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.astrictMoney }}</span> -->
          <template v-if="row.astrictType == 0">
            <span>无限制</span>
          </template>
          <template v-else-if="row.astrictType == 1">
            <el-tag v-for="(item, id) of row.astrictMoney" :key="id" style="margin-left: 10px">
              {{ item }}
            </el-tag>
          </template>
          <template v-else>
            <span>{{ row.astrictMoney[0] }} — {{ row.astrictMoney[1] }}</span>
          </template>
        </template>
      </my-table-column>

      <my-table-column align="center" label="当日金额限额">
        <template slot-scope="{ row }">
          <span>{{ row.astrictMoneyToday }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="当日订单限额">
        <template slot-scope="{ row }">
          <span>{{ row.todayAstrictOrder }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="累计成功">
        <template slot-scope="{ row }">
          <span>{{ row.addupSuccess }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="今日成功">
        <template slot-scope="{ row }">
          <span>{{ row.todaySuccess }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="昨日成功">
        <template slot-scope="{ row }">
          <span>{{ row.yesterdaySuccess }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="创建时间" width="160">
        <template slot-scope="{ row }">
          <span>{{ row.createdTime }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="接单状态">
        <template slot-scope="{ row }">
          <span>{{ row.takeOrderState }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="授权状态">
        <template slot-scope="{ row }">
          <span>{{ row.authorState }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.comment }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="操作" width="190">
        <template>
          <el-button type="success" size="small"><svg-icon icon-class="edit" />编辑</el-button>
          <el-button type="primary" size="small"><i class="el-icon-connection"></i>通道</el-button>
        </template>
      </my-table-column>
    </my-table>
    <channelDialog ref="channelDialog"></channelDialog>
  </div>
</template>

<script>
import { channelInfoList } from '@/api/operate-manager'
import channelDialog from './components/channel-dialog.vue'
export default {
  components:{channelDialog},
  name: 'MerchantInfoList',
  data() {
    const validatetest3 = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请上传'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      formData: {
        username: '',
        userNumber: '',
        comment: '',
        region: ''
      },
      total: 0,
    }
  },
  methods: {
    async getDataList() {
      let ret = await channelInfoList()
      // console.log(JSON.stringify(ret))
      this.list = ret.data
      this.total = ret.data.length
    },
    onSubmit() {
      console.log('submit!')
    },
    handleAdd() {
      console.log('添加')
      this.dialogVisible = true
      this.$refs.channelDialog.dialogVisible=true
    },
  },
  mounted() {
    // this.getDataList()
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
}
.symbol {
  margin: 0 10px;
}
// .el-tabs--border-card{
//   min-height: 400px;
// }
</style>
