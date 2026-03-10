<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="queryFormData.channelName" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道编码" prop="channelCode">
          <el-input v-model="queryFormData.channelCode" placeholder="请输入通道编码" size="small" />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select v-model="queryFormData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" style="" prop="queryAmount">
          <el-input
            v-model="queryFormData.queryAmount"
            v-number-input
            type="number"
            placeholder="请输入"
            size="small"
          >
            <template slot="append">元</template>
          </el-input>
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
      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
        :tableData="tableData"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column label="通道编码" align="center" prop="channelCode" />

        <el-table-column label="交易类型" align="center" prop="tradeType">
          <template slot-scope="{ row }">
            <span v-if="row.tradeType == 0">代收</span>
            <span v-else-if="row.tradeType == 1">代付</span>
            <span v-else>无效值{{ row.tradeType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="金额值(元)" align="center" width="130">
          <template slot-scope="{ row }">
            <span v-if="row.limitAmountType == 0">无限制</span>
            
            <div v-if="row.limitAmountType == 1" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;" >
              <el-tag :key="index" v-for="(item, index) in row.fixedAmount.split(',')"  
              size="small" >{{ item }}</el-tag>
            </div>

            <span v-if="row.limitAmountType == 2">
              <el-tag size="small">{{ row.minAmount }}</el-tag> ~
              <el-tag size="small">{{ row.maxAmount }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="商户费率(%)" align="center">
          <template slot-scope="{ row }">
            <el-tag size="small"> {{ row.merchantRate }}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="单笔费用(元)" align="center">
          <template slot-scope="{ row }">
            {{ row.merchantPerTransactionFee }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <!-- <el-switch v-model="row.isActive" /> -->

            <span v-if="row.isActive">{{ row.isActive ? '开启' : '关闭' }}</span>
            <span v-else style="color: red">{{ row.isActive ? '开启' : '关闭' }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="是否访问收银台后才匹配订单" align="center" width="210">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_march_order_after_visit" />
          </template>
        </el-table-column> -->

        <el-table-column label="备注" align="center" prop="remark" />
        <!-- <el-table-column align="center" label="操作" width="250">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" /> 修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" /> 删除
              </div>
              <div type="primary" class="btn" @click="showConfirmPeizhi(row)">
                <i class="el-icon-setting" /> 配置产品
              </div>
              <div type="primary" class="btn" @click="showTestOrder(row)">
                <i class="el-icon-setting" /> 测试订单
              </div>
            </div>
          </template>
        </el-table-column> -->
      </my-table>
    </el-card>
    <el-dialog :visible.sync="showCopyDialogVisable" title="复制通道" width="500px">
      <el-form
        ref="form"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" prop="tenant_name">
          <el-input v-model="copyFormData.tenant_name" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道编码" prop="channelCode">
          <el-input v-model="copyFormData.channelCode" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道模板" prop="type">
          <el-select v-model="copyFormData.copy_tenant_id" placeholder="请选择" size="small">
            <el-option
              :label="item.tenant_name"
              :value="item.id"
              v-for="item in tableData"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showCopyDialogVisable = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCopyDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改通道' : '新增通道'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="formData.channelName" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道编码" prop="channelCode">
          <el-input
            v-model="formData.channelCode"
            placeholder="请输入通道编码"
            size="small"
            :disabled="isEdit ? true : false"
          />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select v-model="formData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="金额限制类型：" prop="limit_type">
          <el-select
            v-model="formData.limit_type"
            placeholder="请选择"
            size="small"
            @change="selectChange"
          >
            <el-option label="无限制" value="0" />
            <el-option label="固定金额" value="1" />
            <el-option label="范围金额" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="固定金额：" prop="fixed_amount" v-if="whichLimit == '1'">
          <el-input
            v-model="formData.fixed_amount"
            placeholder="请输入"
            size="small"
            @input="formData.fixed_amount = formData.fixed_amount.replace(/[^0-9]/g, '')"
          />
          <span class="text">提示：多个金额用 “ , ” 分割</span>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="范围金额：" prop="min_amount" v-if="whichLimit == '2'">
            <el-input
              v-model="formData.min_amount"
              placeholder="请输入"
              size="small"
              style="width: 80px"
              @input="formData.min_amount = formData.min_amount.replace(/[^0-9]/g, '')"
            />
          </el-form-item>
          <el-form-item label="" prop="max_amount" v-if="whichLimit == '2'" label-width="0">
            <span class="symbol">~</span>
            <el-input
              v-model="formData.max_amount"
              placeholder="请输入"
              size="small"
              style="width: 80px"
              @input="formData.max_amount = formData.max_amount.replace(/[^0-9]/g, '')"
            />
          </el-form-item>
        </div>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="访问后匹配" prop="is_march_order_after_visit">
          <el-switch v-model="formData.is_march_order_after_visit" />
          <p class="text">说明：是否等用户访问收银台后，再将订单分配给码商</p>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="testOrderDialogVistual" title="测试订单" width="600px">
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="商户" prop="channelName">
          <!-- <el-input v-model="formData.channelName"   placeholder="请输入通道名称" size="small" /> -->
          <el-select v-model="formData.channelName" placeholder="请选择通道名称" size="small">
            <el-option v-for="i in 10" :key="i" :label="'通道' + i" :value="'通道' + i"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="码商" prop="tradeType">
          <el-select v-model="formData.service_name" placeholder="请选择码商" size="small">
            <el-option
              v-for="i in 10"
              :key="i"
              :label="'码商' + i"
              :value="'码商' + i"
            ></el-option>
            <!-- <el-option label="代付" value="1"></el-option> -->
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="金额限制类型：" prop="limit_type">
          <el-select
            v-model="formData.limit_type"
            placeholder="请选择"
            size="small"
            @change="selectChange"
          >
            <el-option label="无限制" value="0" />
            <el-option label="固定金额" value="1" />
            <el-option label="范围金额" value="2" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="金额：" prop="fixed_amount">
          <el-input v-model="formData.fixed_amount" placeholder="请输入" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="testOrderDialogVistual = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="testOrderDialogVistual = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="`配置通道【${formData.channelName}】的产品`"
    >
      <div style="max-height: 600px; overflow: auto">
        <Peizhi :currItem="formData"></Peizhi>
      </div>
      <div slot="footer">
        <el-button @click="peizhiDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="peizhiDialogVisible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Peizhi from './income_channel_setting.vue'


import {
  getChannelByMerchantRelPage,
} from '@/api/merchant'

export default {
  components: {
    Peizhi
  },
  name: 'IncomeChannelList',
  data() {
    return {
      code: '',
      tableData: [],
      dialogVisible: false,
      showCopyDialogVisable: false,
      peizhiDialogVisible: false,
      formData: {
        index: '',
        channelName: '',
        channelCode: '',
        tradeType: '',
        limit_type: '',
        money: '',
        isActive: '',
        is_march_order_after_visit: '',
        fixed_amount: '',
        min_amount: '',
        max_amount: '',
        remark: ''
      },
      copyFormData: {
        tenant_name: '',
        copy_tenant_id: ''
      },
      queryFormData: {
        channelName: '',
        channelCode: '',
        tradeType: '',
        queryAmount:'',
        limit_type: '',
        min_money: '',
        max_money: '',
        isActive: '',
        is_march_order_after_visit: ''
      },
      whichLimit: '',
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据

      testOrderDialogVistual: false
    }
  },
  methods: {
    async loadTableData(page) {

      let params = {
        userId:this.$store.state.userAccount.userId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          // if (key == 'createTime') {
          //   params['startTime'] = this.queryFormData['createTime'][0]
          //   params['endTime'] = this.queryFormData['createTime'][1]
          // } else {
            params[key] = this.queryFormData[key]
          // }
        }
      })


      let res = await getChannelByMerchantRelPage(params, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    flushPage() {
      this.$refs['my-table'].getTableData(1)
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs['my-table'].getTableData(1)
    },

    getQueryForm() {
      return {
        tradeType: '',
        isActive: '',
      }
    },

    queryTableData() {
      this.$refs['my-table'].getTableData(1)
    },

    showTestOrder(row) {
      this.testOrderDialogVistual = true
      this.formData = Object.assign({}, row)
    },
    selectChange(e) {
      this.whichLimit = e
    },
    showCopyDialog() {
      this.showCopyDialogVisable = true
    },
    onCopyDialogBtnOk() {
      let obj = this.tableData.find((item) => {
        return item.id == this.copyFormData.copy_tenant_id
      })

      let newItem = Object.assign({}, obj)

      // console.log(JSON.stringify(newItem));

      newItem.tenant_name = this.copyFormData.tenant_name
      newItem.id = Date.now() + this.tableData.length

      this.tableData.push(newItem)
      this.showCopyDialogVisable = false
    },
    showConfirmPeizhi(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除通道 【 ${row.channelName} 】吗？`)
        this.tableData = this.tableData.filter((item) => {
          return item.id !== row.id
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    onDialogBtnOk() {
      this.dialogVisible = false
      if (this.isEdit) {
        // 编辑
        this.tableData = this.tableData.map((item) => {
          if (item.id === this.formData.id) {
            return this.formData
          }
          return item
        })
      } else {
        // 新增
        this.formData.id = Date.now()
        this.tableData.push(this.formData)
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.text {
  color: red;
  font-size: 12px;
  margin: 0;
}
</style>
