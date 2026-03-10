<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="租户名称" prop="username">
          <el-input v-model="queryFormData.username" placeholder="请输入租户名称" size="small" />
        </el-form-item>

        <el-form-item label="租户域名" prop="domainUrl">
          <!-- <el-input
            v-model="queryFormData.domainUrl"
            placeholder="请输入租户域名"
            size="small"
          /> -->
          <el-select v-model="queryFormData.domainUrl" placeholder="请选择" size="small">
            <el-option label="http://www.qq.com" value="1"></el-option>
            <el-option label="http://www.qq2.com" value="2"></el-option>
            <el-option label="http://www.qq3.com" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <!-- <el-switch v-model="queryFormData.isActive" /> -->
          <el-select v-model="queryFormData.isActive" placeholder="请选择" size="small">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            v-model="queryFormData.create_time"
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
      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <my-table
        class="mt-10"
        ref="my-table"
        :loadData="mockData"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="username" />
        <el-table-column label="租户名称" align="center" prop="userNickName" />
        <el-table-column label="租户域名" align="center" prop="domainUrl" />
        <el-table-column label="收银台域名" align="center" prop="cashPageDomainUrl" />
        <el-table-column
          class-name="balance"
          label="可用余额"
          align="center"
          prop="availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.availableBalance) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 1)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 2)">-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="balance" label="冻结金额" align="center" prop="freezeBalance">
          <template slot-scope="{ row }">
            <!-- {{ row.freeze_balance }} -->
            <div class="fee-box">
              <span class="val">{{ Number(row.freezeBalance) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 3)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 4)">-</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="PC端背景图" align="center" prop="pc_back_image" />
        <el-table-column label="手机端背景图" align="center" prop="app_back_image" /> -->
        <!-- <el-table-column label="数据库地址" align="center" prop="db_url" />
        <el-table-column label="数据库用户名" align="center" prop="db_username" />
        <el-table-column label="数据库密码" align="center" prop="db_password" /> -->

        <el-table-column label="过期时间" align="center" prop="expireTime">
          <template slot-scope="{ row }">
            {{ row.expireTime }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" />
          </template>
        </el-table-column>

        <el-table-column label="备注信息" align="center" prop="remark" />

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

        <!-- <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-edit" />配置
              </div>
              <div type="success" class="btn" style="margin: 5px 0" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-edit" />配置产品类型
              </div>

              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>
              <div type="success" class="btn" @click="showResetPassword(row)">
                <i class="el-icon-brush" />重置密码
              </div>

              <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>
                <!-- <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span> -->
                <el-dropdown-menu slot="dropdown">
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

    <el-dialog :visible.sync="dialogVisible" :title="isEdit ? '修改' : '新增租户'" width="600px">
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="tenant_number">
          <el-input
            v-model="formData.tenant_number"
            :disabled="isEdit"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="租户名称" prop="username">
          <el-input v-model="formData.username" placeholder="请输入租户名称" size="small" />
        </el-form-item>

        <el-form-item label="租户域名" prop="domainUrl">
          <el-input v-model="formData.domainUrl" placeholder="请输入租户域名" size="small" />
        </el-form-item>

        <el-form-item label="收银台域名" prop="cash_page_domain">
          <!-- <el-input
            v-model="formData.cash_page_domain"
            placeholder="请输入收银台域名"
            size="small"
          /> -->
          <el-select v-model="formData.cash_page_domain" placeholder="请选择" size="small">
            <el-option label="http://www.qq.com" value="1"></el-option>
            <el-option label="http://www.qq2.com" value="2"></el-option>
            <el-option label="http://www.qq3.com" value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="选择代理" prop="choose_agent"> -->
        <el-form-item label="选择代理">
          <!-- <el-input
            v-model="formData.choose_agent"
            placeholder="请输入收银台域名"
            size="small"
          /> -->
          <el-select v-model="formData.choose_agent" placeholder="请选择代理" size="small">
            <el-option :label="'代理名称' + i" :value="i" v-for="i in 10" :key="i"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="可用余额" prop="available_balance">
          <el-input
            v-model="formData.available_balance"
            placeholder="请输入可用余额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="冻结金额" prop="freeze_balance">
          <el-input v-model="formData.freeze_balance" placeholder="请输入冻结金额" size="small" />
        </el-form-item> -->

        <el-form-item label="PC端背景图" prop="pc_back_image">
          <!-- <el-input v-model="formData.pc_back_image" placeholder="请输入PC端背景图" size="small" /> -->

          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="filePcList"
            :limit="1"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="手机端背景图" prop="app_back_image">
          <!-- <el-input
            v-model="formData.app_back_image"
            placeholder="请输入手机端背景图"
            size="small"
          /> -->
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="filePcList"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item label="数据库地址" prop="db_url">
          <el-input v-model="formData.db_url" placeholder="请输入数据库地址" size="small" />
        </el-form-item>

        <el-form-item label="数据库用户名" prop="db_username">
          <el-input v-model="formData.db_username" placeholder="请输入数据库用户名" size="small" />
        </el-form-item>

        <el-form-item label="数据库密码" prop="db_password">
          <el-input v-model="formData.db_password" placeholder="请输入数据库密码" size="small" />
        </el-form-item> -->

        <el-form-item label="过期时间" prop="expire_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.expire_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>

        <!-- <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="更新时间" prop="update_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.update_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="peizhiDialogVisible" title="配置" width="900px"> -->
    <Peizhi :currItem="formData" ref="peizhiDialog"></Peizhi>
    <!-- </el-dialog> -->

    <el-dialog :visible.sync="feeDialogVisible" :title="feeDialogTitle" width="500px">
      <el-form
        ref="form"
        :model="feeChangeFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="商户账号" prop="username">
          <el-input
            v-model="feeChangeFormData.username"
            :disabled="true"
            placeholder="请输入租户名称"
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
            placeholder="请输入大于0的整数，最多保留2位小数"
            size="small"
          />
        </el-form-item>

        <el-form-item label="支付密码" required prop="password">
          <el-input
            v-model="feeChangeFormData.password"
            type="password"
            placeholder="请输入支付密码"
            size="small"
          />
        </el-form-item>

        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="feeChangeFormData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="feeDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onFeeDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showCopyDialogVisable" title="复制租户" width="500px">
      <el-form
        ref="form"
        :rules="myRules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="tenant_number">
          <el-input v-model="copyFormData.tenant_number" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="租户名称" prop="username">
          <el-input v-model="copyFormData.username" placeholder="请输入租户名称" size="small" />
        </el-form-item>

        <el-form-item label="租户模板" prop="tenant_template">
          <el-select v-model="copyFormData.tenant_template" placeholder="请选择" size="small">
            <el-option
              :label="item.username"
              :value="item.id"
              v-for="item in tableData"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showCopyDialogVisable = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="showCopyDialogVisable = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="500px">
      <div style="margin-left: 50px">
        <p><span class="label">登录地址:</span><span class="text">https://112.254.236.3</span></p>
        <p>
          <span class="label">账号:</span><span class="text">{{ user_info.user_name }}</span>
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
      </el-form>
      <div slot="footer">
        <el-button @click="reset_password_dialog = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="closeResetPassword()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Peizhi from './tenant-setting.vue'
export default {
  components: {
    Peizhi
  },

  name: 'TenantManager',
  data() {
    return {
      showCopyDialogVisable: false,
      copyFormData: {
        tenant_number: '',
        username: '',
        tenant_template: ''
      },
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
      tableData: [],
      dialogVisible: false,
      peizhiDialogVisible: false, // 配置对话框
      feeDialogVisible: false, // 增减余额对话框
      feeChangeFormData: {
        username: '',
        banlance_type: '', //
        balance: '',
        opt_type: '', // 1 充值 2 扣款
        money: '', // 变动金额
        password: '', // 支付密码
        remark: ''
      },

      feeDialogTitle: '默认标题',
      formData: {
        tenant_number: '',
        username: '',
        domainUrl: '',
        cash_page_domain: '',
        choose_agent: '',
        choose_agent: '',
        pc_back_image: '',
        app_back_image: '',
        expire_time: '',
        isActive: '',
        remark: ''
      },
      filePcList: [],
      queryFormData: {
        username: '',
        domainUrl: '',
        isActive: false,
        create_time: ''
      },
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      user_info_dialog: false,
      user_info: {},
      formDataPassword: {
        login_code: '',
        google_key: ''
      },
      reset_password_dialog: false
    }
  },
  methods: {
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

    showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      this.user_info = row
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确认删除当前租户 【 ${row.username} 】`)
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
    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      // this.peizhiDialogVisible = true
      this.$refs.peizhiDialog.peizhiDialogVisible = true
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        index: '',
        username: '',
        domainUrl: '',
        cash_page_domain: '',
        available_balance: '',
        freeze_balance: '',
        pc_back_image: '',
        app_back_image: '',
        db_url: '',
        db_username: '',
        db_password: '',
        expire_time: '',
        isActive: '',
        remark: '',
        create_time: '',
        update_time: '',
        opt: ''
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
        username: '',
        domainUrl: '',
        isActive: true,
        create_time: ''
      }
      this.mockData()
    },
    showChangeFeeDialog(row, type) {
      this.feeDialogVisible = true
      this.feeChangeFormData = Object.assign(this.feeChangeFormData, row)
      if (type == 1) {
        // 余额充值
        this.feeDialogTitle = '余额充值'
        let ttt = {
          username: row.username,
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
          username: row.username,
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
          username: row.username,
          banlance_type: '冻结余额',
          balance: row.freeze_balance,
          opt_type: '增加',
          money: '',
          password: '',
          remark: ''
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogTitle = '减少冻结金额'
        let ttt = {
          username: row.username,
          banlance_type: '冻结余额',
          balance: row.freeze_balance,
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
      this.$confirm(
        `确认为 【${this.feeChangeFormData.username}】 ${this.feeChangeFormData.opt_type} ${this.feeChangeFormData.banlance_type} ${this.feeChangeFormData.money} 元吗？`
      )
        .then(async (_) => {
          // 调用接口
          console.log('调用接口')

          this.feeDialogVisible = false
          console.log(JSON.stringify(this.feeChangeFormData))

          if (this.feeChangeFormData.banlance_type == '可用余额') {
            if (this.feeChangeFormData.opt_type == '充值') {
              this.feeChangeFormData.balance =
                parseFloat(this.feeChangeFormData.balance) +
                parseFloat(this.feeChangeFormData.money)
            } else {
              // 扣款
              this.feeChangeFormData.balance =
                parseFloat(this.feeChangeFormData.balance) -
                parseFloat(this.feeChangeFormData.money)
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
                parseFloat(this.feeChangeFormData.balance) +
                parseFloat(this.feeChangeFormData.money)
            } else {
              // 减 少 }
              this.feeChangeFormData.balance =
                parseFloat(this.feeChangeFormData.balance) -
                parseFloat(this.feeChangeFormData.money)
            }
            this.tableData = this.tableData.map((item) => {
              if (item.id === this.feeChangeFormData.id) {
                item.freeze_balance = this.feeChangeFormData.balance
              }
              return item
            })
          }
        })
        .catch((_) => {
          console.log('------cache----')
        })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
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

      newItem.username = this.copyFormData.username
      newItem.id = Date.now() + this.tableData.length

      this.tableData.push(newItem)
      this.showCopyDialogVisable = false
    },
    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.username != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.username == this.queryFormData.username
        })
      }
      if (this.queryFormData.domainUrl != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.domainUrl == this.queryFormData.domainUrl
        })
      }
      if (this.queryFormData.isActive != undefined) {
        // 是否启用
        this.tableData = this.tableData.filter((item) => {
          return item.isActive == this.queryFormData.isActive
        })
      }
    },
    mockData() {
      // 模拟数据
      let columnList = [
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1000 },
        { title: '账号', type: 'string', key: 'username', isSearch: true, id: 1009 }, // tenant_user_name
        { title: '租户名称', type: 'string', key: 'userNickName', isSearch: true, id: 1001 },
        { title: '租户域名', type: 'string', key: 'domainUrl', isSearch: true, id: 1002 }, // tenant_user_name
        {
          title: '收银台域名',
          type: 'string',
          key: 'cashPageDomainUrl',
          isSearch: false,
          id: 1003
        },
        { title: '可用余额', type: 'number', key: 'availableBalance', isSearch: false, id: 1004 },
        { title: '冻结金额', type: 'number', key: 'freezeBalance', isSearch: false, id: 1005 },
        { title: 'PC端背景图', type: 'string', key: 'pc_back_image', isSearch: false, id: 1006 },
        { title: '手机端背景图', type: 'string', key: 'app_back_image', isSearch: false, id: 1007 },
        { title: '数据库地址', type: 'string', key: 'db_url', isSearch: false, id: 1008 },
        { title: '数据库用户名', type: 'string', key: 'db_username', isSearch: false, id: 1009 },
        { title: '数据库密码', type: 'string', key: 'db_password', isSearch: false, id: 1010 },
        { title: '过期时间', type: 'date', key: 'expireTime', isSearch: false, id: 1011 },
        { title: '是否启用', type: 'boolean', key: 'isActive', isSearch: true, id: 1012 },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: false, id: 1013 },
        { title: '创建时间', type: 'date', key: 'createTime', isSearch: true, id: 1014 },
        { title: '更新时间', type: 'date', key: 'updateTime', isSearch: false, id: 1015 },
        { id: 1016, title: '操作', type: 'operate', key: 'opt', isSearch: false }
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
            ele[column.key] = 'abc' + this.tableData.length
          }

          // 根据 列表添加值
          if (column.title == '租户名称') {
            ele[column.key] = ele[column.key] = '租户名称' + this.tableData.length
          }

          ele.choose_agent = this.tableData.length + 1
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
</style>
