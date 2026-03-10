<template>
  <div class="container">
    <el-card>
      <el-form
        :rules="queryRules"
        ref="queryFormDataRef"
        :inline="true"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-select
            filterable
            v-model="queryFormData.productName"
            placeholder="请选择产品类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品类型" prop="">
          <el-select
            filterable
            v-model="queryFormData.productTypeId"
            placeholder="请选择产品类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in productTypeList"
              :key="item.productTypeId"
              :label="item.productTypeName"
              :value="item.productTypeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select v-model="queryFormData.tradeType" placeholder="请选择交易类型" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            filterable
            v-model="queryFormData.isActive"
            placeholder="请选择是否启用"
            size="small"
          >
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
      <!-- <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button> -->
      <el-button type="success" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="产品名称" align="center" prop="productName" />
        <!-- <el-table-column label="产品类型编码" align="center" prop="productTypeId" /> -->

        <el-table-column label="产品类型" align="center">
          <template slot-scope="{ row }">
            {{ row.productTypeName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否一次性接单" align="center" width="130">
          <template slot-scope="{ row }">
            <el-tag type="primary" v-if="row.isOneTimeAccept==1">是</el-tag>
            <el-tag type="danger" v-if="row.isOneTimeAccept==0">否</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="交易类型" align="center">
          <template slot-scope="{ row }">
            {{ row.tradeType == 0 ? '代收' : '代付' }}
          </template>
        </el-table-column>

        <el-table-column label="产品费率(%)" align="center">
          <template slot-scope="{ row }">
            <el-tag>{{ row.providerRate }} %</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="单笔费用(元)" align="center">
          <template slot-scope="{ row }"> {{ row.providerPerTransactionFee }} 元 </template>
        </el-table-column>

        <!-- <el-table-column label="浮动金额" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="showFloatDialog(row, true)">详情</el-button>
          </template>
        </el-table-column> -->
        <!-- 订单超时时间(6-2分钟、9-5分钟、14-10分钟、16-30分钟、17-1小时、18-2 小时) -->
        <!-- <el-table-column label="订单超时时间" align="center">
          <template slot-scope="{ row }">
            {{
              orderExpireTimeOptions.find((item) => item.value === row.orderExpireTime)
                ? orderExpireTimeOptions.find((item) => item.value === row.orderExpireTime).label
                : ''
            }}
          </template>
        </el-table-column> -->

        <!-- 转账备注类型（0-空 1-随机6位数字 2-随机字符串 3-随机邮箱 4-随机手机号 5-随机QQ号） -->
        <el-table-column label="转账备注类型" align="center">
          <template slot-scope="{ row }">
            <span>
              {{
                transferRemarkTypeOptions.find((item) => item.value === row.transferRemarkType)
                  ? transferRemarkTypeOptions.find((item) => item.value === row.transferRemarkType)
                      .label
                  : ''
              }}
            </span>
            <!-- <span v-else>无</span> -->
          </template>
        </el-table-column>

        <el-table-column label="自动类型" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.isAutoConfirmOrder == 1 ? '自动' : '手动' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <!-- <el-switch v-model="row.isActive" @change="onSwitchChange(row)" /> -->
            <!-- <span> {{ row.isActive?'开启':'禁用' }} </span> -->

            <el-tag :type="row.isActive ? '' : 'danger'">{{
              row.isActive ? '开启' : '禁用'
            }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="操作" width="260">
          <template slot-scope="{ row }">
            <div class="opt">
          
              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" /> 修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" /> 删除
              </div>
            </div>
          </template>
        </el-table-column> -->
      </my-table>
    </el-card>

    <el-dialog
      @close="onDialogBtnCancel()"
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改产品' : '新增产品'"
      width="600px"
    >
      <el-form
        ref="formDataRef"
        :model="formData"
        :rules="productRules"
        label-position="right"
        label-width="150px"
        style="margin-left: 50px"
      >
        <el-form-item
          label="产品名称"
          :prop="isEdit ? '' : 'productName'"
          :rules="isEdit ? {} : productNameRules"
        >
          <el-input
            :disabled="isEdit"
            style="width: 225px"
            v-model="formData.productName"
            placeholder="请输入产品名称"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item
          label="产品类型编码"
          :prop="isEdit ? '' : 'productTypeCode'"
          :rules="isEdit ? {} : productTypeCodeRules"
        >
          <el-input
            :disabled="isEdit"
            v-model="formData.productTypeCode"
            placeholder="请输入产品类型编码"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="产品类型" prop="productTypeId">
          <el-select
            filterable
            v-model="formData.productTypeId"
            placeholder="请选择产品类型"
            @change="$refs.formDataRef.clearValidate()"
            size="small"
          >
            <el-option
              v-for="item in productTypeList"
              :key="item.productTypeId"
              :label="item.productTypeName"
              :value="item.productTypeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <template v-if="newProductTradeType == 0">
          <el-form-item label="交易类型">
            <div>代收</div>
          </el-form-item>
          <el-form-item label="收银台页面模板" prop="cashTemplateId">
            <el-select
              filterable
              v-model="formData.cashTemplateId"
              placeholder="请选择收银台页面模板"
              size="small"
            >
              <el-option
                v-for="item in templateList"
                :key="item.templateName"
                :label="item.templateName"
                :value="String(item.cashTemplateId)"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <template v-if="!isEdit">
          <el-form-item label="是否开启浮动" prop="isFloatEnable">
            <el-switch v-model="formData.isFloatEnable" />
          </el-form-item>

          <el-form-item label="浮动最大值" prop="floatMax" v-if="formData.isFloatEnable">
            <el-input
              v-number-input
              v-model="formData.floatMax"
              placeholder="请输入浮动最大值"
              size="small"
            />
          </el-form-item>

          <el-form-item label="浮动最小值" prop="floatMin" v-if="formData.isFloatEnable">
            <el-input
              v-number-input
              v-model="formData.floatMin"
              placeholder="请输入浮动最小值"
              size="small"
            />
          </el-form-item>
          <el-form-item label="浮动排除值" prop="floatExclude" v-if="formData.isFloatEnable">
            <el-input v-model="formData.floatExclude" placeholder="请输入浮动排除值" size="small" />
          </el-form-item>
          <el-form-item
            label="是否允许浮动重复"
            prop="floatAllowDuplicate"
            v-if="formData.isFloatEnable"
          >
            <el-switch v-model="formData.floatAllowDuplicate" />
          </el-form-item>
          </template> -->

          <el-form-item label="转账备注类型" prop="transferRemarkType">
            <el-select
              filterable
              v-model="formData.transferRemarkType"
              placeholder="请选择备注类型"
              size="small"
            >
              <el-option
                v-for="item in transferRemarkTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="newProductTradeType == 1">
          <el-form-item label="交易类型">
            <div>代付</div>
          </el-form-item>

          <el-form-item label="最大接单数" prop="maxDailyOrdersCount">
            <el-input
              v-input-int-positive
              type="number"
              style="width: 225px"
              v-model="formData.maxDailyOrdersCount"
              placeholder="请输入最大接单数"
              size="small"
            />
          </el-form-item>
        </template>

        <el-form-item label="订单超时时间" prop="orderExpireTime">
          <el-select
            filterable
            v-model="formData.orderExpireTime"
            placeholder="请选择订单超时时间"
            size="small"
          >
            <el-option
              v-for="item in orderExpireTimeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 金额浮动动话框 -->
    <el-dialog
      :visible.sync="floatDdialogVisible"
      :title="`${floatReadOnly ? '查看' : '设置'}产品【 ${formData.productName} 】的浮动金额`"
      @close="onFloatBtnCancel()"
      width="600px"
    >
      <el-form
        ref="changeFlostRef"
        :model="formData"
        :rules="flostSettingRules"
        label-position="right"
        label-width="230px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品名称：" prop="">
          <!-- <el-input
            v-model="formData.productName"
            :disabled="true"
            placeholder="请输入产品名称"
            size="small"
          /> -->
          <div>{{ formData.productName }}</div>
        </el-form-item>

        <template v-if="floatReadOnly">
          <el-form-item label="是否开启浮动：">
            <el-tag>{{ formData.isFloatEnable ? '开启' : '关闭' }}</el-tag>
          </el-form-item>

          <el-form-item label="浮动最大值：" v-if="formData.isFloatEnable">
            <div>{{ formData.floatMax }}</div>
          </el-form-item>

          <el-form-item label="浮动最小值：" v-if="formData.isFloatEnable">
            <div>{{ formData.floatMin }}</div>
          </el-form-item>
          <el-form-item label="浮动排除值：" v-if="formData.isFloatEnable">
            <div>{{ formData.floatExclude }}</div>
          </el-form-item>
          <el-form-item label="是否允许浮动重复：" v-if="formData.isFloatEnable">
            <el-tag>{{ formData.floatAllowDuplicate ? '允许' : '不允许' }}</el-tag>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="是否开启浮动：" prop="">
            <el-switch v-model="formData.isFloatEnable" />
          </el-form-item>

          <el-form-item label="浮动最大值：" prop="floatMax" v-if="formData.isFloatEnable">
            <el-input v-model="formData.floatMax" placeholder="请输入浮动最大值" size="small" />
          </el-form-item>

          <el-form-item label="浮动最小值：" prop="floatMin" v-if="formData.isFloatEnable">
            <el-input v-model="formData.floatMin" placeholder="请输入浮动最小值" size="small" />
          </el-form-item>
          <el-form-item label="浮动排除值：" prop="floatExclude" v-if="formData.isFloatEnable">
            <el-input
              v-model="formData.floatExclude"
              placeholder="请输入排除值，多个值用,号隔开"
              size="small"
            />
          </el-form-item>
          <el-form-item label="是否允许浮动重复：" prop="floatAllowDuplicate">
            <el-switch v-model="formData.floatAllowDuplicate" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" :style="{ textAlign: floatReadOnly ? 'center' : 'right' }">
        <el-button @click="floatDdialogVisible = false" size="small">
          {{ floatReadOnly ? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="!floatReadOnly" type="primary" @click="onFloatBtnOk()" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProductListForProcide,
  updateProductStatus,
  addProduct,
  updateProduct,
  getAllProductType,
  deleteProduct,
  getProductListByUserId,
  updateFloatAmount,
  checkProductName,
  exportByProvider
} from '@/api/service-product-mananger.js'

import { checkProductTypeCodeUnique } from '@/api/tenant-product-type.js'

import { productRules, queryRules } from './rules.js'

import { getAllTemplate } from '@/api/template-create.js'

import { fixedAmountCheckRule, amountCheck, userNickNameRules } from '@/utils/validate'
import { isEmpty } from '@/utils/index.js'
import FileSaver from 'file-saver'
export default {
  name: 'ServiceProductMananger',

  computed: {
    newProductTradeType() {
      if (
        this.productTypeList.length == 0 ||
        !this.dialogVisible ||
        this.formData.productTypeId == ''
      ) {
        return undefined
      }

      let ele = this.productTypeList.find((ele) => ele.productTypeId == this.formData.productTypeId)
      if (ele) {
        return ele.tradeType
      }
      return undefined
    }
  },

  data() {
    return {
      rules: productRules,
      productRules,
      flostSettingRules: {
        productName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          ...userNickNameRules
        ],
        productTypeCode: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          ...userNickNameRules
        ],

        cashTemplateId: [{ required: true, message: '请选择模板', trigger: 'change' }],
        productTypeId: [{ required: true, message: '请选择类型', trigger: 'change' }],

        isFloatEnable: [{ required: true, message: '请选择', trigger: 'blur' }],
        orderExpireTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
        transferRemarkType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        isActive: [{ required: true, message: '请选择状态', trigger: 'change' }],

        floatExclude: [
          { required: true, message: '请输入排除值', trigger: 'blur' },
          fixedAmountCheckRule
        ],
        floatMin: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { validator: amountCheck, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (isEmpty(this.formData.floatMin) || isEmpty(this.formData.floatMax)) {
                return callback()
              }

              if (Number(this.formData.floatMin) >= Number(this.formData.floatMax)) {
                return callback(new Error('必须小于最大值'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        floatMax: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { validator: amountCheck, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (isEmpty(this.formData.floatMin) || isEmpty(this.formData.floatMax)) {
                return callback()
              }

              if (Number(this.formData.floatMin) >= Number(this.formData.floatMax)) {
                return callback(new Error('必须大于最小值'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      queryRules: queryRules,
      productNameRules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        ...userNickNameRules,
        {
          validator: async (rules, value, callback) => {
            try {
              let ret = await checkProductName(value)
              if (ret.data) {
                callback(new Error('产品名称已存在'))
              } else {
                callback()
              }
            } catch (e) {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],

      productTypeCodeRules: [
        { required: true, message: '请输入编码', trigger: 'blur' },
        ...userNickNameRules,
        {
          validator: async (rules, value, callback) => {
            try {
              let ret = await checkProductTypeCodeUnique(value)
              if (ret.data) {
                callback(new Error('产品编码已存在'))
              } else {
                callback()
              }
            } catch (error) {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      tableData: [],
      dialogVisible: false,
      isNotEnable: '',
      formData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      floatDdialogVisible: false,
      templateList: [],
      orderExpireTimeOptions: [
        { value: 6, label: '2分钟' },
        { value: 7, label: '3分钟' },
        { value: 9, label: '5分钟' },
        { value: 11, label: '7分钟' },
        { value: 14, label: '10分钟' },
        { value: 15, label: '20分钟' },
        { value: 16, label: '30分钟' },
        { value: 17, label: '1小时' },
        { value: 18, label: '2小时' }
      ],
      transferRemarkTypeOptions: [
        { value: 0, label: '无' },
        { value: 1, label: '随机6位数字' },
        { value: 2, label: '随机字符串' },
        { value: 3, label: '随机邮箱' },
        { value: 4, label: '随机手机号' },
        { value: 5, label: '随机QQ号' }
      ],
      productList: [],
      floatReadOnly: false, // 是否只读
      productTypeList: []
    }
  },
  methods: {
    async exportReport() {
      let params = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      let res = await exportByProvider(params)
      FileSaver.saveAs(res, '产品列表.xlsx')
    },
    showFloatDialog(row, type) {
      this.floatReadOnly = type

      this.floatDdialogVisible = true
      this.formData = {
        productId: row.productId,
        productName: row.productName,
        isFloatEnable: row.isFloatEnable,
        floatMax: row.floatMax,
        floatMin: row.floatMin,
        floatExclude: row.floatExclude,
        floatAllowDuplicate: row.floatAllowDuplicate
      }
    },

    // showFloatDetailDialog(row){
    //   this.currRow = row
    //   this.floatDetailVisible = true

    // },
    onFloatBtnCancel() {
      if (this.$refs.changeFlostRef) {
        this.$refs.changeFlostRef.resetFields()
      }
      this.floatDdialogVisible = false
    },
    onFloatBtnOk() {
      this.$refs.changeFlostRef.validate(async (valid) => {
        if (valid) {
          await updateFloatAmount({
            // ...this.formData,
            productId: this.formData.productId,
            isFloatEnable: this.formData.isFloatEnable,
            floatMax: Number(this.formData.floatMax),
            floatMin: Number(this.formData.floatMin),
            floatAllowDuplicate: this.formData.floatAllowDuplicate,
            floatExclude: this.formData.floatExclude
          })

          this.$message.success('修改成功')
          this.onFloatBtnCancel()
          this.flushPage()
        }
      })
    },
    // floatChange(e) {
    //   this.isNotEnable = e
    //   this.formData.float_max = ''
    //   this.formData.float_min = ''
    //   this.formData.float_allow_duplicate = false
    //   this.formData.float_exclude = ''
    // },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除产品【 ${row.productName} 】 吗？`)

        await deleteProduct(row.productId)

        this.$message.success('删除成功')
        this.flushPage()
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
        productTypeId: '',
        isFloatEnable: 0,
        floatAllowDuplicate: 0,
        isActive: 1
      }
    },

    onDialogBtnCancel() {
      this.$refs.formDataRef.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formDataRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑

            await updateProduct({
              // ...this.formData
              productId: this.formData.productId,
              productName: this.formData.productName,
              productTypeId: this.formData.productTypeId,
              cashTemplateId: this.formData.cashTemplateId,
              orderExpireTime: this.formData.orderExpireTime,
              transferRemarkType: this.formData.transferRemarkType,
              isActive: this.formData.isActive
            })

            this.$message.success('修改成功')
          } else {
            // 新增
            await addProduct({
              ...this.formData
            })
            this.$message.success('添加成功')
          }

          this.onDialogBtnCancel()
          this.flushPage()
        }
      })
    },

    onSwitchChange(row) {
      updateProductStatus(row.productId, row.isActive).then((res) => {
        this.flushPage()
      })
    },
    async loadTableData(page) {
      let params = {}
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getProductListForProcide(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()

      // 同步刷新 产品缓存
      getProductListByUserId().then((res) => {
        if (res.data && res.data.length > 0) {
          this.productList = res.data
          this.$store.state.order.productList = res.data
        }
      })
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      return {
        productTypeId: '',
        tradeType: '',
        isActive: ''
      }
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate((valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },
    async getAllProductType() {
      let res = await getAllProductType()
      this.productTypeList = res.data
      console.log(res, 'res')
    }
  },
  mounted() {
    getAllTemplate(this.$store.state.user.tenantId).then((res) => {
      console.log(res)
      this.templateList = res.data
    })
    // 所有产品列表明
    if (this.$store.state.order.productList.length == 0) {
      getProductListByUserId().then((res) => {
        if (res.data && res.data.length > 0) {
          this.productList = res.data
          this.$store.state.order.productList = res.data
        }
      })
    } else {
      this.productList = this.$store.state.order.productList
    }

    this.getAllProductType()
  }
}
</script>

<style lang="scss" scoped></style>
