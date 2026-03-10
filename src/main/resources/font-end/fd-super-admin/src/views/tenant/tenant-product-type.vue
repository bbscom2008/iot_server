<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormDataRef"
        :rules="myQueryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="产品类型名称" prop="productTypeName">
          <el-input
            v-model="queryFormData.productTypeName"
            placeholder="请输入产品类型名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select
            filterable
            v-model="queryFormData.tradeType"
            placeholder="请选择交易类型"
            size="small"
          >
            <el-option
              v-for="item in tradeTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select filterable v-model="queryFormData.isActive" placeholder="请选择" size="small">
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
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="loadTableData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="产品类型名称" align="center" prop="productTypeName" />
        <el-table-column label="费率" align="center" prop="systemRate">
          <template slot-scope="{ row }">
            {{ row.systemRate }} %
          </template>
        </el-table-column>
        <el-table-column label="产品类型编码" align="center" prop="productTypeCode">
          <template slot-scope="{ row }">
            {{ row.productTypeCode }}
          </template>
        </el-table-column>

        <el-table-column label="交易类型" align="center">
          <template slot-scope="{ row }">
            <!-- （0-代收，1-代付） -->
            <el-tag :type="row.tradeType == 0 ? 'primary' : 'success'">{{
              row.tradeType == 0 ? '代收' : '代付'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="收银台模板" align="center" prop="cashTemplateId">
          <template slot-scope="{ row }">
            <span v-if="row.tradeType == 0"> {{ row.templateName }} </span>
          </template>
        </el-table-column>

        <el-table-column label="是否为静态支付信息" align="center">
          <template slot-scope="{ row }">
            <el-switch @change="onSwitchChange(row, 0)" v-model="row.isPaymentInfoStatic" />
          </template>
        </el-table-column>

        <el-table-column label="是否为自动确认订单" align="center">
          <template slot-scope="{ row }">
            <el-switch @change="onSwitchChange(row, 1)" v-model="row.isAutoConfirmOrder" />
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="onSwitchChange(row, 2)" />
          </template>
        </el-table-column>
        <el-table-column label="是否开启浮动" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.isEnableFloating == 1 ? 'primary' : 'danger'">{{
              row.isEnableFloating == 1 ? '开启' : '关闭'
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>

              <div type="primary" class="btn mt-5" @click="syncToTenant(row)">
                <i class="el-icon-delete" />同步至平台
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改产品类型' : '新增产品类型'"
      @close="onDialogCancel()"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="160px"
        style="margin-right: 100px"
      >
        <el-form-item label="产品类型名称" prop="productTypeName" :rules="productTypeNameRule">
          <el-input
            v-model="formData.productTypeName"
            placeholder="请输入产品类型名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易类型" prop="tradeType">
          <el-select
            filterable
            v-model="formData.tradeType"
            placeholder="请选择交易类型"
            size="small"
          >
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型编码" prop="productTypeCode" :rules="productTypeCodeRule">
          <el-input
            v-model="formData.productTypeCode"
            placeholder="请输入产品类型编码"
            size="small"
          />
        </el-form-item>

        <el-form-item label="支付类型" prop="payType">
          <el-select
            filterable
            v-model="formData.payType"
            placeholder="请选择支付类型"
            size="small"
          >
            <el-option
              v-for="item in payTypeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收银台模板" prop="cashTemplateId" v-if="formData.tradeType == '0'">
          <el-select
            filterable
            v-model="formData.cashTemplateId"
            placeholder="请选择收银台模板"
            size="small"
          >
            <el-option
              v-for="item in templateList"
              :key="item.templateId"
              :label="item.templateName"
              :value="item.cashTemplateId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认系统费率" prop="systemRate" :rules="systemRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.systemRate"
            placeholder="请输入默认系统费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item label="收款信息类型" prop="paymentDataType" v-if="formData.tradeType == '1'">
          <el-select
            filterable
            v-model="formData.paymentDataType"
            placeholder="请选择收款信息类型"
            size="small"
          >
            <el-option label="收款链接" :value="0"></el-option>
            <el-option label="图片base64" :value="1"></el-option>
            <el-option label="文本信息json" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否为静态支付信息" prop="isPaymentInfoStatic">
          <el-switch v-model="formData.isPaymentInfoStatic" />
        </el-form-item>

        <el-form-item label="是否为自动确认订单" prop="isAutoConfirmOrder">
          <el-switch v-model="formData.isAutoConfirmOrder" />
        </el-form-item>
        <!-- 
        <el-form-item label="是否启动浮动" prop="isEnableFloating">
          <el-switch v-model="formData.isEnableFloating" />
        </el-form-item> -->

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item v-if="formData.tradeType == 0" label="是否开启浮动">
          <el-switch v-model="formData.isEnableFloating" @change="onSwitchFloatChange()" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog
      :visible.sync="syncDialogVisible"
      title="同步至平台"
      @close="onSyncDialogCancel()"
      width="600px"
    >
      <el-select
        filterable
        v-model="formData.tradeType"
        placeholder="请选择平台"
        :multiple="true"
        size="small"
      >
        <el-option label="全部" :value="null"></el-option>
        <el-option
          :label="item.tenantName"
          :value="item.tenantId"
          v-for="item in tenantList"
          :key="item.tenantId"
        ></el-option>
      </el-select>

      <div class="help-tip">
        选择要同步的平台，如果原平台已经有当前产品类型，跳过，不做任何修改
      </div>

      <div slot="footer">
        <el-button @click="onDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { tenantRules, queryRules } from './rules'
import { getAllTemplate } from '@/api/template-create'
import {
  getProductTypePage,
  addProductType,
  updateProductType,
  deleteProductType,
  updateProductTypeStatus,
  checkProductTypeNameUnique,
  hasProductIsEnableFloatingByProductTypeId,
  getPayTypeList,
  checkProductTypeCodeUnique,
  hasTenantExistsByProductTypeId,
  getTenantConfigValueByTenantConfigKey,
  syncProductTypeToTenant
} from '@/api/tenant-product-type'

import {
  rulesCode,
  rulesName,
  userNickNameRules,
  rateCheck,
  systemRateRules
} from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  name: 'TenantProductType',
  data() {
    const isNameOnly = async (rule, value, callback) => {
      let ret = await checkProductTypeNameUnique(
        this.productTypeId == '' ? '0' : this.productTypeId,
        { productTypeName: value }
      )
      if (ret.data) {
        callback(new Error('产品类型名称已存在'))
      } else {
        callback()
      }
    }
    const isCodeOnly = async (rule, value, callback) => {
      let ret = await checkProductTypeCodeUnique(
        this.productTypeId == '' ? '0' : this.productTypeId,
        { productTypeCode: value }
      )
      if (ret.data) {
        callback(new Error('产品类型编码已存在'))
      } else {
        callback()
      }
    }

    return {
      myQueryRules: queryRules,
      rules: tenantRules,
      productTypeNameRule: [
        { required: true, message: '请输入产品类型名称', trigger: 'blur' },
        // ...rulesName,
        // { max:32,min:1, message: '长度在 1 到 32 个字符', trigger: 'blur' },

        { validator: isNameOnly, trigger: 'blur' }
      ],
      systemRate: [
        { required: false, message: '请输入默认系统费率', trigger: 'blur' },
        { validator: systemRateRules, trigger: 'blur' }
      ],
      productTypeCodeRule: [
        { required: true, message: '请输入产品类型编码', trigger: 'blur' },
        // ...userNickNameRules,
        { validator: isCodeOnly, trigger: 'blur' }
      ],
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      tradeTypeOptions: [
        { label: '全部', value: '' },
        { label: '代收', value: 0 },
        { label: '代付', value: 1 }
      ],
      templateList: [], // 收银台模板列表
      productTypeId: '',
      payTypeList: ['zhifubao', 'weixin'],
      hasTenantExist: false,

      isEnableFloatingByProductType: null
    }
  },
  methods: {
     syncToTenant(row) {
      // this.syncDialogVisible = true

        this.$confirm('确定要全同至所有平台吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let ret =  await syncProductTypeToTenant(row.productTypeId)

          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });


    },
    async hasProductIsEnableFloatingByProductTypeId() {
      let ret = await hasProductIsEnableFloatingByProductTypeId(this.formData.productTypeId)
      this.isEnableFloatingByProductType = ret.data
    },
    async onSwitchFloatChange() {
      if (!this.isEdit) {
        // 新增时，不做任何事情
        return
      }

      console.log('--formData.isEnableFloating---', this.formData.isEnableFloating)

      if (this.formData.isEnableFloating && this.isEnableFloatingByProductType == null) {
        let ret = await hasProductIsEnableFloatingByProductTypeId(this.formData.productTypeId)
        this.isEnableFloatingByProductType = ret.data
      }

      if (this.formData.isEnableFloating == 0 && this.isEnableFloatingByProductType) {
        this.$confirm('有产品已经开启浮动，确定要关闭吗？')
          .then((_) => {
            console.log('------123------')
          })
          .catch((_) => {
            console.log('------456-----')
            this.formData.isEnableFloating = 1
          })
      }
    },
    async hasTenantExistsByProductTypeId(productTypeId) {
      let res = await hasTenantExistsByProductTypeId(productTypeId)
      this.hasTenantExist = res.data
      console.log(res, 'res')
    },
    async onSwitchChange(row, type) {
      if (type == 2 && row.isActive == 0) {
        let res = await hasTenantExistsByProductTypeId(row.productTypeId)
        if (res.data) {
          this.$message.error('该产品类型已和平台绑定!')
          // this.flushPage()
          return
        }
      }
      const isActive =
        type == 0 ? row.isPaymentInfoStatic : type == 1 ? row.isAutoConfirmOrder : row.isActive

      try {
        let res = await updateProductTypeStatus(row.productTypeId, {
          paymentType: type,
          isActive
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.flushPage()
    },
    onDialogCancel() {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    },

    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // if (this.hasTenantExist&&this.formData.isActive==0) {
            //   this.$message.error('该产品类型已和平台绑定，无法关闭！！')
            //   return
            // }
            // 编辑
            let res = await updateProductType({
              productTypeId: this.formData.productTypeId,
              productTypeName: this.formData.productTypeName,
              productTypeCode: this.formData.productTypeCode,
              paymentDataType: this.formData.paymentDataType,
              tradeType: this.formData.tradeType,
              cashTemplateId: this.formData.cashTemplateId,
              isPaymentInfoStatic: this.formData.isPaymentInfoStatic,
              isAutoConfirmOrder: this.formData.isAutoConfirmOrder,
              isActive: this.formData.isActive,
              isEnableFloating: this.formData.isEnableFloating,
              payType: this.formData.payType,
              systemRate: this.formData.systemRate
              // remark: this.formData.remark
            })
            this.$message.success('修改成功')
            console.log(res)
          } else {
            // 新增
            let res = await addProductType(this.formData)
            this.$message.success('新增成功')
            console.log(res)
          }
          this.onDialogCancel()
          this.flushPage()
        }
      })
    },

    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除产品类型 【 ${row.productTypeName} 】吗？`)
        let res = await hasTenantExistsByProductTypeId(row.productTypeId)
        if (res.data) {
          this.$message.error('该产品类型已和平台绑定，请先解绑，再删除！！')
          return
        }
        await deleteProductType(row.productTypeId)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.flushPage()
      } catch (e) {
        console.log('取消删除')
      }
    },

    flushPage() {
      // 保持当前分页不变，刷新表格数据
      this.$refs.tableRef.getTableData()
    },
    showEditDialog(row) {
      this.isEdit = true
      this.productTypeId = row.productTypeId
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
      this.hasTenantExistsByProductTypeId(row.productTypeId)

      this.hasProductIsEnableFloatingByProductTypeId(this.formData.productTypeId)
    },
    async getTenantConfigValueByTenantConfigKey() {
      let res = await getTenantConfigValueByTenantConfigKey(
        this.$store.state.tenant.selectTenantId,
        {
          tenantConfigKey: 'systemRate'
        }
      )
      this.formData.systemRate = res.data ? res.data : 0.1
      console.log(res.data, 'res')
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        productTypeName: '',
        productTypeCode: '',
        tradeType: 0,
        cashTemplateId: '',
        paymentDataType: 0,
        isPaymentInfoStatic: 1,
        isAutoConfirmOrder: 1,
        isEnableFloating: 0,
        isActive: 1,
        systemRate: 0.1
        // remark: ''
      }
      this.getTenantConfigValueByTenantConfigKey()
    },

    async loadTableData(page) {
      let res = await getProductTypePage(page, {
        ...this.queryFormData
      })
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    resetQueryForm() {
      this.$refs.queryFormDataRef.resetFields()
      this.queryFormData = this.getQueryForm()
      this.queryTableData()
    },

    getQueryForm() {
      return {
        tradeType: '',
        isActive: ''
      }
    },

    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    }
  },
  async mounted() {
    let ret = await getAllTemplate(this.$store.state.tenant.selectTenantId)

    this.templateList = ret.data.filter((ele) => ele.isDefault == 1) // 只要默认的

    getPayTypeList().then((res) => {
      console.log(res)
      this.payTypeList = res.data
    })
  }
}
</script>

<style lang="scss" scoped></style>
