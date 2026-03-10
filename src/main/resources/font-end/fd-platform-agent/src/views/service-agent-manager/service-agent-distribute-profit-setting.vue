<template>
  <div class="container">
    <!-- <div class="tips">分润配置列表：</div> -->
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="商户:">
        <el-select filterable  v-model="formData.merchantName" placeholder="请选择商户" size="small">
          <el-option label="商户1" value="1"></el-option>
          <el-option label="商户2" value="2"></el-option>
          <el-option label="商户3" value="3"></el-option>
          <el-option label="商户4" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户通道:">
        <el-input v-model="formData.passage" size="small" placeholder="商户通道"></el-input>
      </el-form-item>
      <el-form-item label="代理:">
        <el-select filterable  v-model="formData.agent" placeholder="请选择代理" size="small">
          <el-option label="代理1" value="1"></el-option>
          <el-option label="代理2" value="2"></el-option>
          <el-option label="代理3" value="3"></el-option>
          <el-option label="代理4" value="4"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small" icon="el-icon-search"
          >搜索</el-button
        >
        <el-button type="success" @click="addButton" size="small" icon="el-icon-plus"
          >增加配置分润</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tips">
      <p>总记录数:0</p>
      <p>注: 汇率都是以 千分之xx + 单笔yy 来计算，例如5‰为千5，5‰+1为千5+每笔1[货币单位]</p>
    </div>
    <my-table
      class="mt-10"
      ref="infoTable"
      :tableData="list"
      :total="total"
      :loadData="getDataList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55"> </el-table-column>
      <el-table-column align="center" label="ID">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商户名称">
        <template slot-scope="{ row }">
          <span>{{ row.merchantName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通道">
        <template slot-scope="{ row }">
          <span>{{ row.passage }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付类型" width="130">
        <template slot-scope="{ row }">
          <template>
            <span> {{ row.payType }} </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商户通道汇率">
        <template slot-scope="{ row }">
          <span>{{ row.merchantRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属代理">
        <template slot-scope="{ row }">
          <span>{{ row.OwnAgent }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理分润" width="160">
        <template slot-scope="{ row }">
          <span>{{ row.agentPart }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
    </my-table>
    <el-dialog :visible.sync="dialogVisible" title="增加代理分润配置" width="600px">
      <el-form
        ref="agentForm"
        :rules="rules"
        :model="agentForm"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="代理:" prop="agent">
          <el-select filterable  v-model="agentForm.agent" placeholder="请选择代理" size="small">
            <el-option label="代理1" value="1"></el-option>
            <el-option label="代理2" value="2"></el-option>
            <el-option label="代理3" value="3"></el-option>
            <el-option label="代理4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户:" prop="merchantName">
          <el-select filterable  v-model="agentForm.merchantName" placeholder="请选择商户" size="small">
            <el-option label="商户1" value="1"></el-option>
            <el-option label="商户2" value="2"></el-option>
            <el-option label="商户3" value="3"></el-option>
            <el-option label="商户4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户通道:" prop="merchantPassage">
          <el-select filterable  v-model="agentForm.merchantPassage" placeholder="请选择商户通道" size="small">
            <el-option label="商户通道1" value="1"></el-option>
            <el-option label="商户通道2" value="2"></el-option>
            <el-option label="商户通道3" value="3"></el-option>
            <el-option label="商户通道4" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费率(千):" prop="rate">
          <el-input v-model="agentForm.rate" placeholder="请输入费率" size="small" />
        </el-form-item>
        <el-form-item label="单笔手续费:" prop="singleCharge">
          <el-input v-model="agentForm.singleCharge" placeholder="请输入单笔手续费" size="small" />
        </el-form-item>
      </el-form>
       <div slot="footer">
          <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { distributeProfitSetting } from '@/api/merchant-agent'
export default {
  name: 'DistributeProfitSetting',

  data() {
    const validateAgent = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择代理'))
      } else {
        callback()
      }
    }
    const validateMerchantName = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择商户'))
      } else {
        callback()
      }
    }
    const validateMerchantPassage = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择商户通道'))
      } else {
        callback()
      }
    }
    const validateRate = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入费率'))
      } else {
        callback()
      }
    }
    const validateSingleCharge = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入单笔手续费'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      formData: {
        merchantName: '',
        passage: '',
        agent: ''
      },
      agentForm: {
        agent: '',
        merchantName: '',
        merchantPassage: '',
        rate: 0,
        singleCharge: 0
      },
      total: 0,
      dialogVisible: false,
      selectedRows: '',
      rules: {
        agent: [{ required: true, trigger: 'change', validator: validateAgent }],
        merchantName: [{ required: true, trigger: 'change', validator: validateMerchantName }],
        merchantPassage: [
          { required: true, trigger: 'change', validator: validateMerchantPassage }
        ],
        rate: [{ required: true, trigger: 'blur', validator: validateRate }],
        singleCharge: [{ required: true, trigger: 'blur', validator: validateSingleCharge }]
      }
    }
  },
  methods: {
    async getDataList(currentPage, pageSize) {
      console.log('---getDataList----' + currentPage + '---' + pageSize)
      let ret = await distributeProfitSetting()
      console.log('ret.total : ' + ret.total)
      this.list = ret.data
      this.total = ret.total
    },
    onSubmit() {
      console.log('submit!')
    },
    handleSelectionChange(val) {
      console.log('---handleSelectionChange----' + JSON.stringify(val))
      this.selectedRows = val
    },
    handleSubmit() {
      this.$refs.agentForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    addButton() {
      this.dialogVisible = true
    }
  },
  mounted() {
    // 由 my-table 组件自己加载数据
    // this.getDataList()
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  font-size: 14px;
  padding: 15px;
  margin-bottom: 20px;
}
</style>
