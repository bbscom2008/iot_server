<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="码商账号" prop="user_id">
          <el-input v-model="queryFormData.user_id" placeholder="请输入码商账号" size="small" />
        </el-form-item>

        <el-form-item label="产品名称" prop="product_id">
          <el-select filterable  v-model="queryFormData.product_id" placeholder="请选择产品名称" size="small">
            <el-option label="全部" value="" />
            <el-option label="产品1" value="0" />
            <el-option label="产品2" value="1" />
            <el-option label="产品3" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="收款信息名称" prop="payee_account_name">
          <el-input
            v-model="queryFormData.payee_account_name"
            placeholder="请输入收款信息名称"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="金额限制类型" prop="limit_type">
          <el-select filterable 
            v-model="queryFormData.limit_type"
            placeholder="请选择金额限制类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="无限制" value="0"></el-option>
            <el-option label="固定金额" value="1"></el-option>
            <el-option label="范围金额" value="2"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="是否可用" prop="is_available">
          <el-select filterable  v-model="queryFormData.is_available" placeholder="请选择是否可用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="is_active">
          <el-select filterable  v-model="queryFormData.is_active" placeholder="请选择是否启用" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="expire_time">
          <el-date-picker
            v-model="queryFormData.expire_time"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
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
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="addPatch()"
        >批量新增</el-button
      >
      <el-button
        type="success"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-edit-outline"
        @click="optAll(true)"
        >批量开启</el-button
      >
      <el-button
        type="danger"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-edit-outline"
        @click="optAll(false)"
        >批量关闭</el-button
      >

      <my-table
        class="mt-10"
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column label="序号" align="center" type="index"></el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.is_active" />
          </template>
        </el-table-column>

        <el-table-column label="码商账号" align="center" prop="user_id" />
        <el-table-column label="收款信息名称" align="center" prop="payee_account_name" />
        <!-- <el-table-column label="租户名称" align="center" prop="tenant_id" width="85" /> -->
        <el-table-column label="产品名称" align="center" prop="product_id" />

        <el-table-column label="收款信息" align="center">
          <template slot-scope="{ row }">
            {{ row.income_info }}
            <el-tag type="success" size="mini" @click="checkIncomeInfo(row)" class="hand"
              >查看</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="金额限制类型" align="center" width="130">
          <template slot-scope="{ row }">
            <!-- {{ row.limit_type }} -->
            <span v-if="row.limit_type == '0'">无限制</span>
            <el-tag size="small" v-if="row.limit_type == '1'">{{ row.fixed_amount }}</el-tag>
            <span v-if="row.limit_type == '2'">
              <el-tag size="small">{{ row.min_amount }}</el-tag> ~
              <el-tag size="small">{{ row.max_amount }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="金额限制" align="center" width="130">
          <template slot-scope="{ row }">
            <span v-if="row.limit_type == '0'">无限制</span>
            <el-tag v-if="row.limit_type == '1'">{{ row.fixed_amount }}</el-tag>
            <span v-if="row.limit_type == '2'">
              <el-tag>{{ row.min_amount }}</el-tag
              >~<el-tag>{{ row.max_amount }}</el-tag>
            </span>
          </template>
        </el-table-column> -->

        <el-table-column label="当日限制" align="center">
          <template slot-scope="{ row }">
            <div>
              最大金额:{{ row.daily_max_amount }} <br />
              最大订单数:{{ row.daily_max_count }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="当日剩余" align="center" width="120">
          <template slot-scope="{ row }">
            <div>
              可用金额:{{ row.daily_available_amount }} <br />
              可用订单数:{{ row.daily_available_count }}
            </div>
          </template>
        </el-table-column> -->

        <el-table-column label="是否可用" align="center">
          <template slot-scope="{ row }">
            <svg-icon
              v-if="!row.is_available"
              @click="open"
              icon-class="tanhao"
              class="hand"
            />&nbsp;
            <!-- <el-switch v-model="row.is_available" /> -->

            <span>{{ row.is_available ? '可用' : '不可用' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="累计" align="center">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              金额:{{ row.total_money }} <br />
              单数:{{ row.total_num }}
            </div>
            <!-- <el-tag class="tag-pink hand" size="mini">刷新</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="昨日" align="center">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              金额:{{ row.yesterday_money }} <br />
              单数:{{ row.yesterday_num }}
            </div>
            <!-- <el-tag class="tag-purple hand" size="mini">刷新</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="今日" align="center">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              金额:{{ row.today_money }} <br />
              单数:{{ row.today_num }}
            </div>
            <!-- <el-tag type="primary" size="mini" class="hand">刷新</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" prop="expire_time">
          <template slot-scope="{ row, $index }">
            {{ $index < 2 ? '不限制' : row.expire_time }}
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改收款信息' : '新增收款信息'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane label="收款信息配置" name="tab1">
            <el-form-item label="收款信息名称" prop="income_info_name">
              <el-input
                v-model="formData.income_info_name"
                placeholder="请输入收款信息名称"
                size="small"
              />
            </el-form-item>

            <el-form-item label="产品名称" prop="productId">
              <el-select filterable  v-model="formData.productId" placeholder="请选择产品" size="small">
                <el-option label="产品1" value="0" />
                <el-option label="产品2" value="1" />
                <el-option label="产品3" value="2" />
              </el-select>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="接单配置" name="first">
            <!-- <el-form-item label="收款名称" prop="payeeAccountName">
              <el-input
                v-model="formData.payeeAccountName"
                placeholder="请输入收款名称"
                size="small"
              />
            </el-form-item> -->
            <el-form-item label="金额限制类型" prop="limitType">
              <el-select filterable 
                v-model="formData.limitType"
                placeholder="请选择金额限制类型"
                size="small"
                @change="selectChange"
              >
                <el-option label="无限制" value="0"></el-option>
                <el-option label="固定金额" value="1"></el-option>
                <el-option label="范围金额" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="固定金额：" prop="fixedAmount" v-if="whichLimit == '1'">
              <el-input
                v-model="formData.fixedAmount"
                placeholder="请输入"
                size="small"
                @input="formData.fixedAmount = formData.fixedAmount.replace(/[^0-9]/g, '')"
              />
              <span class="text">提示：多个金额用 “ _ ” 分割</span>
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
              <el-form-item label="" prop="max_amount" v-if="whichLimit == '2'" label-width="0">
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
            <el-form-item label="当日最大金额" prop="dailyMaxAmount">
              <el-input
                v-model="formData.dailyMaxAmount"
                placeholder="请输入当日最大金额"
                size="small"
              />
            </el-form-item>

            <el-form-item label="当日最大订单数" prop="dailyMaxCount">
              <el-input
                v-model="formData.dailyMaxCount"
                placeholder="请输入当日最大订单数"
                size="small"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isShowPatchDialog" title="批量新增" width="500px">
      <el-form
        ref="formPatch"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品名称" prop="productId">
          <el-select filterable  v-model="formData.productId" placeholder="请选择产品" size="small">
            <el-option label="产品1" value="0" />
            <el-option label="产品2" value="1" />
            <el-option label="产品3" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="下载模板">
          <el-button>下载模板</el-button>
        </el-form-item>
        <el-form-item label="批量上传">
          <el-upload action="#" multiple  :auto-upload="false" >
            <el-button    size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShowPatchDialog = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="isShowPatchDialog = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'gCodePreview',
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      code: '',
      activeName: 'tab1',
      tableData: [],
      dialogVisible: false,
      formData: {
        payeeAccountName: '',
        limitType: '',
        fixedAmount: '',
        minAmount: '',
        maxAmount: '',
        dailyMaxAmount: '',
        dailyMaxCount: '',
        remark: '',
        income_info_name: '',
        productId: ''
      },
      queryFormData: {
        tenant_id: '',
        user_id: '',
        product_id: '',
        payee_account_name: '',
        limit_type: '',
        is_available: '',
        expire_time: '',
        is_active: ''
      },
      whichLimit: '',
      isEdit: false, // 是否是编辑状态
      selectionRows: [],
      // 添加扩展数据，如 options 所需要的数据
      isShowPatchDialog: false,
      formPath: {}
    }
  },
  methods: {
    /**
     * 批量新增
     */
    addPatch() {
      this.isShowPatchDialog = true
    },
    selectChange(e) {
      this.whichLimit = e
    },
    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    open() {
      this.$alert('我是不可用原因', '原因', {
        confirmButtonText: '知道了',
        callback: (action) => {
          console.log('关闭')
        }
      })
    },
    checkIncomeInfo(row) {
      this.$alert('查看 ' + row.payee_account_name + ' 的详细内容', '查看', {
        confirmButtonText: '知道了',
        callback: (action) => {
          console.log('关闭')
        }
      })
    },
    optAll(flag) {
      this.tableData = this.tableData.map((item) => {
        item.is_active = flag
        return item
      })
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除收款信息 【 ${row.payee_account_name} 】 吗？`)
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
        payeeAccountName: '',
        limitType: '',
        fixedAmount: '',
        minAmount: '',
        maxAmount: '',
        dailyMaxAmount: '',
        dailyMaxCount: '',
        remark: '',
        income_info_name: '',
        productId: ''
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
        tenant_id: '',
        user_id: '',
        product_id: '',
        payee_account_name: '',
        limit_type: '',
        is_available: '',
        expire_time: '',
        is_active: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.tenant_id != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.tenant_id == this.queryFormData.tenant_id
        })
      }

      if (this.queryFormData.user_id != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.user_id == this.queryFormData.user_id
        })
      }

      if (this.queryFormData.product_id != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.product_id == this.queryFormData.product_id
        })
      }

      if (this.queryFormData.payee_account_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.payee_account_name == this.queryFormData.payee_account_name
        })
      }

      if (this.queryFormData.limit_type != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.limit_type == this.queryFormData.limit_type
        })
      }

      if (this.queryFormData.is_available != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.is_available == this.queryFormData.is_available
        })
      }

      if (this.queryFormData.expire_time != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.expire_time == this.queryFormData.expire_time
        })
      }

      if (this.queryFormData.is_active != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.is_active == this.queryFormData.is_active
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
        { title: '租户名称', type: 'string', key: 'tenant_id', isSearch: true, id: 1000 },
        { title: '码商账号', type: 'string', key: 'user_id', isSearch: true, id: 1001 },
        { title: '产品名称', type: 'string', key: 'product_id', isSearch: true, id: 1002 },
        {
          title: '收款信息名称',
          type: 'string',
          key: 'payee_account_name',
          isSearch: true,
          id: 1003
        },
        { title: '金额限制类型', type: 'string', key: 'limit_type', isSearch: true, id: 1004 },
        { title: '固定金额', type: 'number', key: 'fixed_amount', isSearch: false, id: 1005 },
        { title: '最小值', type: 'number', key: 'min_amount', isSearch: false, id: 1006 },
        { title: '最大值', type: 'number', key: 'max_amount', isSearch: false, id: 1007 },
        { title: '收款信息', type: 'string', key: 'income_info', isSearch: false, id: 1008 },
        {
          title: '当日最大金额',
          type: 'number',
          key: 'daily_max_amount',
          isSearch: false,
          id: 1009
        },
        {
          title: '当日最大订单数',
          type: 'number',
          key: 'daily_max_count',
          isSearch: false,
          id: 1010
        },
        {
          title: '当日剩余可用金额',
          type: 'number',
          key: 'daily_available_amount',
          isSearch: false,
          id: 1011
        },
        {
          title: '当日剩余可用订单数',
          type: 'number',
          key: 'daily_available_count',
          isSearch: false,
          id: 1012
        },
        { title: '是否可用', type: 'boolean', key: 'is_available', isSearch: true, id: 1013 },
        {
          title: '不可用原因',
          type: 'string',
          key: 'unavailable_reason',
          isSearch: false,
          id: 1014
        },
        { title: '过期时间', type: 'date', key: 'expire_time', isSearch: true, id: 1015 },
        { title: '是否启用', type: 'boolean', key: 'is_active', isSearch: true, id: 1016 },
        { title: '累计金额', type: 'number', key: 'total_money', isSearch: false, id: 1017 },
        { title: '累计订单数', type: 'number', key: 'total_num', isSearch: false, id: 1018 },
        { title: '昨日金额', type: 'number', key: 'yesterday_money', isSearch: false, id: 1019 },
        { title: '昨日订单数', type: 'number', key: 'yesterday_num', isSearch: false, id: 1020 },
        { title: '今日金额', type: 'number', key: 'today_money', isSearch: false, id: 1021 },
        { title: '今日订单数', type: 'number', key: 'today_num', isSearch: false, id: 1022 },
        { title: '备注', type: 'string', key: 'remark', isSearch: false, id: 1023 }
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
          if (column.title == '金额限制类型') {
            ele[column.key] = String(Math.floor(Math.random() * 3))
          } else if (column.title == '固定金额') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          } else if (column.title == '最大值') {
            ele[column.key] = Math.floor(Math.random() * 4000) + 1000
          } else if (column.title == '最小值') {
            ele[column.key] = Math.floor(Math.random() * 40) + 10
          }
        })
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
.hand {
  cursor: pointer;
}
</style>
