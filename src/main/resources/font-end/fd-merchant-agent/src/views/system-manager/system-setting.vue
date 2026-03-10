<template>
  <div class="container">
    <div class="tips">
      <p>系统参数配置，除非你知道修改的意义，否则请不要随意修改！</p>
      <p>只读配置，只能找技术修改！</p>
      <!-- <el-button type="primary" size="small" icon="el-icon-refresh" @click="refreshBtn">刷新</el-button> -->
    </div>
    <my-table
      ref="infoTable"
      :tableData="list"
      :total="total"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :loadData="systemSettingList"
    >
      <el-table-column label="序号" align="center" type="index" width="60" />

      <my-table-column align="center" label="配置说明">
        <template slot-scope="{ row }">
          <span>{{ row.settingText }}</span>
        </template>
      </my-table-column>

      <my-table-column align="center" label="值">
        <template slot-scope="{ row }">
          <span v-if="row.type == 1">{{ row.settingValue }}</span>
          <span v-if="row.type == 2">{{
            '{ ReceiveOrder :' + row.ReceiveOrder + ', BussinessHour :' + row.BussinessHour + ' }'
          }}</span>
        </template>
      </my-table-column>
      <my-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button v-if="row.type == 1" type="primary" size="small" @click="dialogType1(row)"
            >更新配置</el-button
          >
          <el-button v-if="row.type == 2" type="primary" size="small" @click="dialogType2(row)"
            >更新配置</el-button
          >
        </template>
      </my-table-column>
    </my-table>
    <el-dialog :visible.sync="dialogVisible1" title="更新配置" width="600px">
      <div>
        <p class="text">key: WithdrawalFrozenBalanceTTL</p>
        <p class="text f-b">配置描述：</p>
        <p class="text red">{{ this.form.settingText ? this.form.settingText : '' }}</p>
      </div>
      <el-input v-model="form.settingValue" size="small" placeholder="请输入"></el-input>
      <div class="tips m-t-10">如果不知道修改的意义，请勿修改！</div>
      <div>
        <el-button type="primary" @click="handleSubmit()" size="small"> 更改配置 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible2" title="更新配置" width="700px">
      <div>
        <p class="text">key: WithdrawalFrozenBalanceTTL</p>
        <p class="text f-b">配置描述：</p>
        <p class="text red">{{ this.form.settingText ? this.form.settingText : '' }}</p>
      </div>
      <el-table
        ref="infoTable"
        :data="editList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="配置项">
          <template slot-scope="{ row }">
            <span class="textColor f-b">{{ row.text }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="内容">
          <template slot-scope="{ row }">
            <!-- <span v-if="row.content==true">{{ row.content==true }}</span> -->

            <el-checkbox v-if="row.flag == 1" v-model="row.content"></el-checkbox>
            <el-input v-else v-model="row.content"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="{ row }">
            <span class="red">{{ row.description }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tips m-t-10">如果不知道修改的意义，请勿修改！</div>
      <div>
        <el-button type="primary" @click="handleSubmit()" size="small"> 更改配置 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { systemSettingList } from '@/api/operate-manager'
import  mockDb from '@/utils/mockdb'
export default {
  name: 'SystemSetting',
  data() {
    return {
      list: [],
      dialogVisible1: false,
      dialogVisible2: false,
      form: {},
      total:0,
      editList: []
    }
  },
  methods: {
    async systemSettingList() {
      // let ret = await systemSettingList()
      let ret =mockDb.systemSettingList
      this.list = ret
      this.total=ret.length
    },
    dialogType1(row) {
      this.form = row
      this.dialogVisible1 = true
    },
    dialogType2(row) {
      this.form = row
      this.editList = [
        {
          text: '接单状态',
          content: row.ReceiveOrder,
          description: '如果关闭，则不接受商户拉单',
          flag: 1
        },
        {
          text: '接单时间区间',
          content: row.BussinessHour,
          description:
            '只有启用【接单状态】和满足【接单时间区间】才能拉单，注意配置是24小时制，例如 00:00-23:00 表示营业时间为要点到晚上23点，00:00-00:00 永不日切',
          flag: 2
        }
      ]
      this.dialogVisible2 = true
    },
    handleSubmit() {
      console.log('submit!')
      this.dialogVisible1 = false
      this.dialogVisible2 = false
    },
    refreshBtn(){
      this.systemSettingList()
    }
  },
  mounted() {
    // this.systemSettingList()
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
.text {
  line-height: 8px;
}
.textColor {
  color: #1a53ff;
}
.f-b {
  font-weight: bold;
}
.red {
  color: red;
}
.m-t-10 {
  margin-top: 10px;
}
</style>
