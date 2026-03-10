line
<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="商户昵称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入商户昵称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="用户类型" prop="userType">
          <el-select
            filterable
            v-model="queryFormData.userType"
            placeholder="请选择用户类型"
            size="small"
          >
            <el-option label="系统用户" value="0"></el-option>
            <el-option label="平台" value="1"></el-option>
            <el-option label="代收商户" value="2"></el-option>
            <el-option label="代付商户" value="3"></el-option>
            <el-option label="码商" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            filterable
            v-model="queryFormData.isActive"
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
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
      <el-button type="success" plain icon="el-icon-plus" @click="batchSettle()"
        >全部结算</el-button
      >

      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <!-- <div class="tips mt-10 "  >
        汇总信息： 
        <span class="mr-10" >订单数量: 100 </span>
        <span class="mr-10" >订单金额: 100 </span>
        <span class="mr-10">成功订单数: 100 </span>
        <span class="mr-10">成功订金额: 100 </span>
        <span class="mr-10">成功率(%): 100% </span>
        <span class="mr-10">商户费用: 100 </span>
      </div> -->

      <my-table
        class="mt-10"
        ref="my-table"
        style="width: 100%"
        border
        :loadData="mockData"
        :tableData="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="商户名称" align="center" prop="userNickName" />

        <!-- <el-table-column label="用户类型" align="center" prop="userType"> -->
        <!-- <template slot-scope="{ row }"> -->
        <!-- {{ undefined.find((item) => item.value === row.userType).label }} -->
        <!-- </template> -->
        <!-- </el-table-column> -->
        <el-table-column
          class-name="balance"
          label="可用余额"
          align="center"
          prop="availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ row.availableBalance }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 1)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 2)">-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="balance" label="冻结金额" align="center" prop="freezeBalance">
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ row.freezeBalance }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 3)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 4)">-</span>
            </div>
          </template></el-table-column
        >
        <el-table-column class-name="balance" label="代收押金" align="center" prop="collectDeposit">
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ row.collectDeposit }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 5)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 6)">-</span>
            </div>
          </template></el-table-column
        >
        <el-table-column label="商户号" align="center" prop="merchantNo" />
        <el-table-column label="商户密钥" align="center" prop="merchantSecretKey">
          <template slot-scope="{ row }">
            {{ row.merchantSecretKey
            }}<el-tag type="danger" @click="showMerchantKey(row)" class="tag-pink" size="mini"
              >查看</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" />
          </template>
        </el-table-column>

        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <!-- <el-table-column align="center" label="操作" width="200">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置通道
              </div>
              <div type="success" class="btn" @click="showServiceDialog(row)">
                <i class="el-icon-thumb" /> 指定码商
              </div>
              <div type="primary" class="btn" @click="showConfirmSettle(row)">
                <i class="el-icon-finished" /> 结算
              </div>

              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" /> 修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" /> 删除
              </div>
            
            </div>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置通道
              </div>

              <div type="primary" class="btn" @click="showConfirmSettle(row)">
                <i class="el-icon-finished" /> 结算
              </div>

              <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showUserInfo(row)">
                      <i class="el-icon-user" />开户信息
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row)">
                      <i class="el-icon-brush" />重置密码
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showServiceDialog(row)">
                      <i class="el-icon-thumb" /> 指定码商
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showEditDialog(row)">
                      <i class="el-icon-edit" />修改
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="primary" class="btn mt-5 red" @click="showConfirmDelete(row)">
                      <i class="el-icon-delete" />删除
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" :title="isEdit ? '修改' : '新增商户'" width="600px">
      <el-form
        :rules="myRules"
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="formData.userName"
            placeholder="请输入账号"
            size="small"
            :disabled="isEdit ? true : false"
          />
        </el-form-item>

        <el-form-item label="商户名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入商户名称" size="small" />
        </el-form-item>

        <el-form-item label="选择代理" prop="merchantAgentUserId">
          <el-select
            filterable
            v-model="formData.merchantAgentUserId"
            placeholder="请选择代理"
            size="small"
          >
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option
              v-for="item in 10"
              :key="item"
              :label="'代理' + item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="商户代理" prop="userType">
          <el-select filterable  v-model="formData.userType" placeholder="请选择用户类型" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in undefined"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="商户号" prop="merchant_num" v-if="isEdit">
          <el-input
            v-model="formData.merchant_num"
            placeholder="请输入商户号"
            size="small"
            :disabled="isEdit ? true : false"
          />
        </el-form-item>

        <el-form-item label="商户密钥" prop="merchant_key" v-if="isEdit">
          <div class="line">
            <el-input
              v-model="formData.merchant_key"
              placeholder="请输入商户密钥"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="登录密码" prop="login_code" v-if="isEdit">
          <div class="line">
            <el-input
              v-model="formData.login_code"
              placeholder="请输入登录密码"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="谷歌密钥" prop="google_key" v-if="isEdit">
          <div class="line">
            <el-input
              v-model="formData.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item> -->

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input
            type="textarea"
            :rows="4"
            v-model="formData.remark"
            placeholder="请输入备注信息"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="keyDialogVisible" title="查看商户密钥" width="500px">
      <el-form
        ref="keyFormData"
        :model="keyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
        :rules="keyFormRules"
      >
        <el-form-item label="交易密码：" prop="deal_passage">
          <el-input v-model="keyFormData.deal_passage" placeholder="请输入交易密码" size="small" />
        </el-form-item>

        <el-form-item label="谷歌密钥：" prop="google_key">
          <el-input v-model="keyFormData.google_key" placeholder="请输入谷歌密钥" size="small" />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small" @click="checkBtnOk()"> 确定 </el-button>
        </el-form-item>
        <el-form-item label="商户密钥：" prop="merchant_key">
          <template>{{ merchant_key }}</template>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="keyDialogVisible = false" size="small"> 关闭窗口 </el-button>
        <!-- <el-button type="primary" @click="onDialogBtnOk()" size="small"> 关闭 </el-button> -->
      </div>
    </el-dialog>
    <el-dialog :visible.sync="feeDialogVisible" :title="feeDialogTitle" width="500px">
      <el-form
        ref="form"
        :model="feeChangeFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="feeChangeFormData.userName"
            :disabled="true"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商户昵称" prop="userNickName">
          <el-input
            v-model="feeChangeFormData.userNickName"
            :disabled="true"
            placeholder="请输入商户昵称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="余额类型" prop="type">
          <el-input
            v-model="feeChangeFormData.banlance_type"
            :disabled="true"
            placeholder="请输入租户域名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="当前余额" prop="available_balance">
          <el-input v-model="feeChangeFormData.balance" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="操作类型" prop="opt_type">
          <el-input v-model="feeChangeFormData.opt_type" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" required prop="money">
          <el-input
            v-number-input
            type="number"
            v-model="feeChangeFormData.money"
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="支付密码" required prop="password">
          <el-input
            v-model="feeChangeFormData.password"
            type="password"
            show-password
            placeholder="请输入支付密码"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="备注信息" prop="remark">
          <el-input v-model="feeChangeFormData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="feeDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onFeeDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="'配置【' + formData.userNickName + '】的通道'"
      width="900px"
    >
      <!-- <Peizhi :currItem="formData"></Peizhi> -->
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

    <service :currItem="formData" ref="serviceDialog"></service>

    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
      <div style="margin-left: 50px">
        <p><span class="label">登录地址:</span><span class="text">https://112.254.236.3</span></p>
        <p>
          <span class="label">账号:</span><span class="text">{{ user_info.userName }}</span>
        </p>
        <p><span class="label">登录密码:</span><span class="text">rxy12547896587</span></p>
        <span class="remark red">说明：登录密码为初始密码请及时登录修改</span>
        <p><el-button size="small">复制</el-button></p>
      </div>

      <div slot="footer">
        <el-button @click="user_info_dialog = false" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="reset_password_dialog" title="重置密码" width="600px">
      <el-form
        ref="form"
        :model="formDataPassword"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="登录密码" prop="login_code">
          <div class="line">
            <el-input
              v-model="formDataPassword.login_code"
              placeholder="请输入登录密码"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item label="谷歌密钥" prop="google_key">
          <div class="line">
            <el-input
              v-model="formDataPassword.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>

        <el-form-item label="商户密钥" prop="google_key">
          <div class="line">
            <el-input
              v-model="formDataPassword.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <el-button size="small" class="el_btn">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="reset_password_dialog = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="closeResetPassword()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showCopyDialogVisable" title="复制商户" width="500px">
      <el-form
        ref="formCopy"
        :rules="myRules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="商户名称" prop="userNickName">
          <el-input v-model="copyFormData.userNickName" placeholder="请输入商户名称" size="small" />
        </el-form-item>

        <el-form-item required label="商户模板" prop="merchantId">
          <el-select filterable v-model="copyFormData.merchantId" placeholder="请选择" size="small">
            <!-- <el-option :label="item.merchant_name" :value="item.id" v-for="item in tableData" :key="item.id"  ></el-option> -->
            <el-option
              v-for="i in 10"
              v-bind:key="i"
              :label="'abc' + i"
              :value="'abc' + i"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item required label="选择商户" prop="copy_merchat_id">
          <el-select filterable  v-model="copyFormData.copy_merchat_id"  multiple  placeholder="请选择" size="small">
            <template #default >
              <el-option v-for="i in 10" v-bind:key="i"  :label="'商户'+i" :value="'商户'+i"   ></el-option>
            </template>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="showCopyDialogVisable = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="showCopyDialogVisable = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myRules } from '@/utils/form-rules'
import Peizhi from './merchant-setting.vue'
import service from './merchant_service_setting.vue'
export default {
  components: {
    Peizhi,
    service
  },
  name: 'MerchantInfo',
  data() {
    return {
      showCopyDialogVisable: false,
      copyFormData: {
        userName: '',
        merchant_name: '',
        copy_merchant_template_id: '',
        copy_merchat_id: []
      },

      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {
        userName: '',
        userNickName: '',
        merchant_key: '',
        merchant_num: '',
        login_code: '',
        google_key: '',
        isActive: '',
        remark: ''
      },
      queryFormData: {
        userName: '',
        userNickName: '',
        userType: '',
        isActive: ''
      },
      feeDialogVisible: false, // 增减余额对话框
      keyDialogVisible: false, // 查看商户密钥对话框
      peizhiDialogVisible: false, // 配置通道
      keyFormData: {
        deal_passage: '',
        google_key: '',
        merchant_key: ''
      },
      feeDialogTitle: '默认标题',
      isEdit: false, // 是否是编辑状态
      feeChangeFormData: {
        userName: '',
        userNickName: '',
        banlance_type: '', //
        balance: '',
        opt_type: '', // 1 充值 2 扣款
        money: '', // 变动金额
        password: '', // 支付密码
        remark: ''
      },
      merchant_key: '',
      selectionRows: [], // 选中的行数据
      keyFormRules: {
        deal_passage: [{ required: true, trigger: 'blur', message: '请输入' }],
        google_key: [{ required: true, trigger: 'blur', message: '请输入' }]
      },
      user_info_dialog: false,
      user_info: {},
      reset_password_dialog: false,
      formDataPassword: {
        login_code: '',
        google_key: ''
      }
      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    showCopyDialog() {
      this.showCopyDialogVisable = true

      this.$nextTick(() => {
        this.$refs.formCopy.resetFields()
        this.$refs.formCopy.clearValidate()
      })
    },
    showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      this.user_info = row
    },
    showResetPassword(row) {
      console.log('重置密码')
      ;(this.formDataPassword = {
        login_code: '********',
        google_key: '**********'
      }),
        (this.reset_password_dialog = true)
    },
    closeResetPassword() {
      this.reset_password_dialog = false
    },
    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    showServiceDialog(row) {
      this.formData = Object.assign({}, row)
      this.$refs.serviceDialog.serviceDialogVisible = true
    },
    handleSelectionChange(val) {
      console.log(JSON.stringify(val))
      this.selectionRows = val
    },
    showMerchantKey(row) {
      this.merchant_key = row.merchant_key
      this.keyDialogVisible = true
    },
    checkBtnOk() {
      this.$refs.keyFormData.validate((valid) => {
        if (valid) {
          this.merchant_key = Math.floor(Math.random() * 90000000) + 10000000
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showChangeFeeDialog(row, type) {
      this.feeDialogVisible = true
      this.feeChangeFormData = Object.assign(this.feeChangeFormData, row)
      if (type == 1) {
        // 余额充值
        this.feeDialogTitle = '余额充值'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '可用余额',
          balance: row.available_balance,
          opt_type: '充值',
          money: '',
          password: '',
          remark: ''
        }

        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 2) {
        this.feeDialogTitle = '余额扣除'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '可用余额',
          balance: row.available_balance,
          opt_type: '扣款',
          money: '',
          password: '',
          remark: ''
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 3) {
        // 冻结金额 +
        this.feeDialogTitle = '增加冻结金额'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '冻结余额',
          balance: row.freeze_balance,
          opt_type: '冻结',
          money: '',
          password: '',
          remark: ''
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogTitle = '减少冻结金额'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '冻结余额',
          balance: row.freeze_balance,
          opt_type: '解冻 ',
          money: '',
          password: '',
          remark: ''
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 5) {
        // 代收押金  +
        this.feeDialogTitle = '增加代收押金'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '代收押金',
          balance: row.income_yajin,
          opt_type: '增加 ',
          money: '',
          password: '',
          remark: ''
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 6) {
        // 代收押金 -
        this.feeDialogTitle = '减少代收押金'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '代收押金',
          balance: row.income_yajin,
          opt_type: '减少 ',
          money: '',
          password: '',
          remark: ''
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      }

      console.log(JSON.stringify(this.feeChangeFormData))
    },
    onFeeDialogBtnOk() {
      this.feeDialogVisible = false
      console.log(JSON.stringify(this.feeChangeFormData))

      if (this.feeChangeFormData.banlance_type == '可用余额') {
        if (this.feeChangeFormData.opt_type == '充值') {
          this.feeChangeFormData.balance =
            parseFloat(this.feeChangeFormData.balance) + parseFloat(this.feeChangeFormData.money)
        } else {
          // 扣款
          this.feeChangeFormData.balance =
            parseFloat(this.feeChangeFormData.balance) - parseFloat(this.feeChangeFormData.money)
        }
        this.tableData = this.tableData.map((item) => {
          if (item.id === this.feeChangeFormData.id) {
            item.available_balance = this.feeChangeFormData.balance
          }
          return item
        })
      } else if (this.feeChangeFormData.banlance_type == '冻结余额') {
        if (this.feeChangeFormData.opt_type == '增加') {
          this.feeChangeFormData.balance =
            parseFloat(this.feeChangeFormData.balance) + parseFloat(this.feeChangeFormData.money)
        } else {
          // 减 少 }
          this.feeChangeFormData.balance =
            parseFloat(this.feeChangeFormData.balance) - parseFloat(this.feeChangeFormData.money)
        }
        this.tableData = this.tableData.map((item) => {
          if (item.id === this.feeChangeFormData.id) {
            item.freeze_balance = this.feeChangeFormData.balance
          }
          return item
        })
      }
    },
    batchSettle() {
      this.$confirm('您确定对所有商户进行结算吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('确定！')
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // })
        })
        .catch(() => {
          console.log('取消！')
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除用户 【 ${row.userName} 】 吗？`)
        this.tableData = this.tableData.filter((item) => {
          return item.id !== row.id
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    async showConfirmSettle(row) {
      try {
        let ret = await this.$confirm(`确定对 【 ${row.userNickName} 】进行结算吗？`)
        // this.tableData = this.tableData.filter((item) => {
        //   return item.id !== row.id
        // })
        //todo 调用接口删除
        console.log('结算成功')
      } catch (e) {
        console.log('取消结算')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      let linshi = {
        ...row,
        merchant_key: '********',
        login_code: '********',
        google_key: '********'
      }
      this.formData = Object.assign({}, linshi)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.$refs['form'].clearValidate()
      })
      this.formData = {
        selection: '',
        index: '',
        userName: '',
        userNickName: '',
        userType: '',
        available_balance: '',
        freeze_balance: '',
        income_yajin: '',
        merchant_num: '',
        merchant_key: '',
        isActive: '',
        remark: '',
        create_time: '',
        update_time: ''
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
        userName: '',
        userNickName: '',
        userType: '',
        isActive: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.userName != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.userName == this.queryFormData.userName
        })
      }

      if (this.queryFormData.userNickName != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.userNickName == this.queryFormData.userNickName
        })
      }

      if (this.queryFormData.userType != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.userType == this.queryFormData.userType
        })
      }

      if (this.queryFormData.isActive != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.isActive == this.queryFormData.isActive
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
        { title: '选择框', type: 'checkbox', key: 'selection', isSearch: false, id: 1000 },
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1001 },
        { title: '账号', type: 'string', key: 'userName', isSearch: true, id: 1002 },
        { title: '商户昵称', type: 'string', key: 'userNickName', isSearch: true, id: 1003 },
        { title: '用户类型', type: 'string', key: 'userType', isSearch: true, id: 1004 },
        { title: '可用余额', type: 'number', key: 'availableBalance', isSearch: false, id: 1005 },
        { title: '冻结金额', type: 'number', key: 'freezeBalance', isSearch: false, id: 1006 },
        { title: '代收押金', type: 'number', key: 'collectDeposit', isSearch: false, id: 1007 },
        { title: '商户号', type: 'string', key: 'merchantNo', isSearch: false, id: 1008 },
        { title: '商户密钥', type: 'string', key: 'merchantSecretKey', isSearch: false, id: 1009 },
        { title: '是否启用', type: 'boolean', key: 'isActive', isSearch: true, id: 1010 },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: false, id: 1011 },
        {
          title: '创建时间（自动生成）',
          type: 'date',
          key: 'createTime',
          isSearch: false,
          id: 1012
        },
        {
          title: '更新时间（自动更新）',
          type: 'date',
          key: 'updateTime',
          isSearch: false,
          id: 1013
        }
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

          //
          if (column.title == '商户密钥') {
            ele[column.key] = '********'
          }
        })
        this.tableData.push(ele)
      })
    }
  },
  mounted() {
    // this.mockData()
  }
}
</script>

<style lang="scss" scoped>
::v-deep td.balance {
  .cell {
    // background-color: pink;
    height: 85px;
  }
}
.line {
  display: flex;
  flex-direction: row;
  align-items: center;
  .el_btn {
    margin-left: 5px;
    width: 40px;
    padding: 6px;
  }
}

// .fee-box {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   .val,
//   .plus,
//   .sub {
//     position: absolute;
//     padding: 5px;
//     // background-color: aquamarine;
//   }
//   .val {
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//   }
//   .plus {
//     font-size: 18px;
//     color: skyblue;
//     cursor: pointer;
//     top: 0px;
//     right: 0px;
//     &:hover {
//       color: red;
//     }
//   }
//   .sub {
//     font-size: 18px;
//     color: skyblue;
//     cursor: pointer;
//     right: 0px;
//     bottom: 0px;
//     &:hover {
//       color: red;
//     }
//   }
// }
.tag-pink {
  cursor: pointer;
  margin-left: 5px;
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}
</style>
