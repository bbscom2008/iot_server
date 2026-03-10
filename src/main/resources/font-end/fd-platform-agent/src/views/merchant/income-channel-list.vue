<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="通道名称" prop="channelName">
          <el-input
            v-model="queryFormData.channelName"
            placeholder="请输入通道名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="通道编码" prop="channelCode">
          <el-input
            v-model="queryFormData.channelCode"
            placeholder="请输入通道编码"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select filterable  v-model="queryFormData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="代收" value="0"></el-option>
            <el-option label="代付" value="1"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="金额限制类型" prop="limitType">
          <el-select filterable 
            v-model="queryFormData.limitType"
            placeholder="请选择金额限制类型"
            size="small"
          >
            <el-option label="无限制" value="0"></el-option>
            <el-option label="固定金额" value="1"></el-option>
            <el-option label="范围金额" value="1"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="金额范围">
          <el-col :span="9">
            <el-input v-model="queryFormData.minValue" placeholder="请输入" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-col>
          <el-col class="line" style="text-align: center" :span="2">至</el-col>
          <el-col :span="9">
            <el-input v-model="queryFormData.maxValue" placeholder="请输入" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select filterable  v-model="queryFormData.isActive" placeholder="请选择是否启用" size="small">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否访问收银台后才匹配订单" prop="isMarchOrderAfterVisit">
          <el-select filterable 
            v-model="queryFormData.isMarchOrderAfterVisit"
            placeholder="请选择"
            size="small"
          >
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
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
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      <el-button type="warning" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <my-table
        class="mt-10"
        :loadData="mockData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
        :tableData="tableData"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column label="通道编码" align="center" prop="channelCode" />
        <el-table-column label="交易类型" align="center" prop="tradeType" />

        <!-- <el-table-column label="金额限制类型" align="center" prop="limitType" /> -->

        <!-- <el-table-column label="金额值" align="center" prop="money" /> -->
        <el-table-column label="金额值" align="center" width="130">
          <template slot-scope="{ row }">
            <!-- {{ row.limitType }} -->
            <span v-if="row.money == '0'">无限制</span>
            <el-tag size="small" v-if="row.money == '1'">{{ row.amount }}</el-tag>
            <span v-if="row.money == '2'">
              <el-tag size="small">{{ row.minAmount }}</el-tag> ~
              <el-tag size="small">{{ row.maxAmount }}</el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" />
          </template>
        </el-table-column>

        <el-table-column label="是否访问收银台后才匹配订单" align="center" width="210">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isMarchOrderAfterVisit" />
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column align="center" label="操作" width="250">
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
        </el-table-column>
      </my-table>
    </el-card>
    <el-dialog :visible.sync="showCopyDialogVisable" title="复制通道" width="500px">
      <el-form
        ref="form"
        :rules="myRules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" prop="channelName">
          <el-input v-model="copyFormData.channelName" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道编码" prop="channelCode">
          <el-input v-model="copyFormData.channelCode" placeholder="请输入通道名称" size="small" />
        </el-form-item>

        <el-form-item label="通道模板" prop="channelId">
          <el-select filterable  v-model="copyFormData.channelId" placeholder="请选择" size="small">
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
        :rules="myRules"
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
          <el-select filterable  v-model="formData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="代收" value="0"></el-option>
            <el-option label="代付" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="金额限制类型：" prop="limitType">
          <el-select filterable 
            v-model="formData.limitType"
            placeholder="请选择"
            size="small"
            @change="selectChange"
          >
            <el-option label="无限制" value="0" />
            <el-option label="固定金额" value="1" />
            <el-option label="范围金额" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="固定金额：" prop="fixedAmount" v-if="whichLimit == '1'">
          <el-input
            v-model="formData.fixedAmount"
            placeholder="请输入"
            size="small"
            @input="formData.fixedAmount = formData.fixedAmount.replace(/[^0-9]/g, '')"
          />
          <span class="text">提示：多个金额用 “ , ” 分割</span>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="范围金额：" prop="minAmount" v-if="whichLimit == '2'">
            <el-input
              v-model="formData.minAmount"
              placeholder="请输入"
              size="small"
              style="width: 80px"
              @input="formData.minAmount = formData.minAmount.replace(/[^0-9]/g, '')"
            />
          </el-form-item>
          <el-form-item label="" prop="maxAmount" v-if="whichLimit == '2'" label-width="0">
            <span class="symbol">~</span>
            <el-input
              v-model="formData.maxAmount"
              placeholder="请输入"
              size="small"
              style="width: 80px"
              @input="formData.maxAmount = formData.maxAmount.replace(/[^0-9]/g, '')"
            />
          </el-form-item>
        </div>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="访问后匹配" prop="isMarchOrderAfterVisit">
          <el-switch v-model="formData.isMarchOrderAfterVisit" />
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
          <el-select filterable  v-model="formData.channelName" placeholder="请选择通道名称" size="small">
            <el-option v-for="i in 10" :key="i" :label="'通道' + i" :value="'通道' + i"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="码商" prop="tradeType">
          <el-select filterable  v-model="formData.service_name" placeholder="请选择码商" size="small">
            <el-option
              v-for="i in 10"
              :key="i"
              :label="'码商' + i"
              :value="'码商' + i"
            ></el-option>
            <!-- <el-option label="代付" value="1"></el-option> -->
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="金额限制类型：" prop="limitType">
          <el-select filterable 
            v-model="formData.limitType"
            placeholder="请选择"
            size="small"
            @change="selectChange"
          >
            <el-option label="无限制" value="0" />
            <el-option label="固定金额" value="1" />
            <el-option label="范围金额" value="2" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="金额：" prop="fixedAmount">
          <el-input v-model="formData.fixedAmount" placeholder="请输入" size="small" />
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
        limitType: '',
        money: '',
        isActive: '',
        isMarchOrderAfterVisit: '',
        fixedAmount: '',
        minAmount: '',
        maxAmount: '',
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
        limitType: '',
        minValue: '',
        maxValue: '',
        isActive: '',
        isMarchOrderAfterVisit: ''
      },
      whichLimit: '',
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据

      testOrderDialogVistual: false
    }
  },
  methods: {
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
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        index: '',
        channelName: '',
        channelCode: '',
        tradeType: '',
        limitType: '',
        money: '',
        isActive: '',
        isMarchOrderAfterVisit: '',
        remark: ''
      }
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
    },
    resetQueryForm() {
      this.queryFormData = {
        channelName: '',
        channelCode: '',
        tradeType: '',
        limitType: '',
        isActive: '',
        isMarchOrderAfterVisit: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.channelName != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.channelName == this.queryFormData.channelName
        })
      }

      if (this.queryFormData.channelCode != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.channelCode == this.queryFormData.channelCode
        })
      }

      if (this.queryFormData.tradeType != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.tradeType == this.queryFormData.tradeType
        })
      }

      if (this.queryFormData.limitType != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.limitType == this.queryFormData.limitType
        })
      }

      if (this.queryFormData.isActive != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.isActive == this.queryFormData.isActive
        })
      }

      if (this.queryFormData.isMarchOrderAfterVisit != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.isMarchOrderAfterVisit == this.queryFormData.isMarchOrderAfterVisit
        })
      }

      if (this.queryFormData.name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.name == this.queryFormData.name
        })
      }
      if (this.queryFormData.gender != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.gender == this.queryFormData.gender
        })
      }
      // 是否启用
      this.tableData = this.tableData.filter((item) => {
        return item.isEnable == this.queryFormData.isEnable
      })
    },
    mockData() {
      // 模拟数据
      let columnList = [
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1000 },
        { title: '固定金额', type: 'number', key: 'amount', isSearch: false, id: 1005 },
        { title: '最小值', type: 'number', key: 'minAmount', isSearch: false, id: 1006 },
        { title: '最大值', type: 'number', key: 'maxAmount', isSearch: false, id: 1007 },
        { title: '通道名称', type: 'string', key: 'channelName', isSearch: true, id: 1001 },
        { title: '通道编码', type: 'string', key: 'channelCode', isSearch: true, id: 1002 },
        { title: '交易类型', type: 'string', key: 'tradeType', isSearch: true, id: 1003 },
        { title: '金额限制类型', type: 'string', key: 'limitType', isSearch: true, id: 1004 },
        { title: '金额值', type: 'string', key: 'money', isSearch: false, id: 1005 },
        { title: '是否启用', type: 'boolean', key: 'isActive', isSearch: true, id: 1006 },
        {
          title: '是否访问收银台后才匹配订单',
          type: 'boolean',
          key: 'isMarchOrderAfterVisit',
          isSearch: true,
          id: 1007
        },
        { title: '备注', type: 'string', key: 'remark', isSearch: false, id: 1008 }
      ]
      this.tableData = []
      new Array(10).fill(0).forEach((_, index) => {
        let ele = {}
        ele.id = Date.now() + index
        columnList.forEach((column) => {
          if (column.type == 'select') {
            ele[column.key] =
              column.options[Math.floor(Math.random() * column.options.length)].value
          } else if (column.type == 'number') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          } else if (column.type == 'date') {
            const date = new Date()
            date.setTime(date.getTime() - Math.floor(Math.random() * 10000) * 3600 * 1000 * 24)
            ele[column.key] =
              date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          } else if (column.type == 'boolean') {
            ele[column.key] = Math.floor(Math.random() * 2) == 0 ? false : true
          } else if (
            column.type == 'index' ||
            column.type == 'operate' ||
            column.type == 'selection'
          ) {
            // 啥也不加
          } else {
            ele[column.key] = column.title + this.tableData.length
          }

          // 根据 列表添加值
          if (column.title == 'abc') {
            ele[column.key] = 'abc' + this.tableData.length
          }
          if (column.title == '金额值') {
            ele[column.key] = String(Math.floor(Math.random() * 3))
          } else if (column.title == '固定金额') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          } else if (column.title == '最大值') {
            ele[column.key] = Math.floor(Math.random() * 4000) + 1000
          } else if (column.title == '最小值') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          }
        })

        ele.service_name = ''

        this.tableData.push(ele)
      })
    }
  },
  mounted() {
    this.mockData()
  }
}
</script>

<style lang="scss" scoped>
.text {
  color: red;
  font-size: 12px;
  margin: 0;
}
</style>
