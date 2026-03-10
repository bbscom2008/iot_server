<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="queryFormData.providerQueryDTO.userName"
            placeholder="请输入账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="码商名称" prop="userNickName">
          <el-input
            v-model="queryFormData.providerQueryDTO.userNickName"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

    

        <el-form-item label="是否启用" prop="isActive">
          <el-select
            v-model="queryFormData.providerQueryDTO.isActive"
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
      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <!-- <div class="tips mt-10">
        汇总信息：
        <span class="mr-10">订单数量: 100 </span>
        <span class="mr-10">订单金额: 100 </span>
        <span class="mr-10">成功订单数: 100 </span>
        <span class="mr-10">成功订金额: 100 </span>
        <span class="mr-10">实付金额: 100 </span>
        <span class="mr-10">成功率(%): 100% </span>
        <span class="mr-10">码商费用: 100 </span>
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

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" />
          </template>
        </el-table-column>

        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="码商名称" align="center" prop="userNickName" />

        <el-table-column label="当前层级" align="center">
          <template slot-scope="{ row }">
            {{row.level}}级 <el-button type="text" @click="showLevelTree(row)">查看子级</el-button>
          </template>
        </el-table-column>

        <el-table-column
          class-name="balance"
          label="可用余额"
          align="center"
          prop="availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{Number( row.availableBalance) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 1)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 2)">-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="balance" label="冻结金额" align="center" prop="freezeBalance">
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.freezeBalance) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 3)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 4)">-</span>
            </div>
          </template></el-table-column
        >
        <el-table-column
          class-name="balance"
          label="最低接单金额"
          align="center"
          prop="minAllowableCollectAmount"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.minAllowableCollectAmount) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 5)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 6)">-</span>
            </div>
          </template></el-table-column
        >
        

        <el-table-column label="码商权限" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="showServicePromisessDialog(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="团队权限" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="showTeamPromisessDialog(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="开启代收" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isCollectEnable" />
          </template>
        </el-table-column>
        <el-table-column label="开启代付" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isPaymentEnable" />
          </template>
        </el-table-column>

        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置产品
              </div>
              <div type="success" class="btn" @click="showBalanceDialog(row)">
                <i class="el-icon-thumb" /> 余额划拨
              </div>
              <el-dropdown trigger="click">
                <div type="success" class="btn"><i class="el-icon-caret-bottom" />更多</div>
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

    <el-dialog :visible.sync="dialogVisible" :title="isEdit ? '修改' : '新增码商'" width="600px">
      <el-form
        ref="form"
        :model="formData"
        :rules="myRules"
        label-position="right"
        label-width="150px"
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

        <el-form-item label="码商名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入码商名称" size="small" />
        </el-form-item>

       
        <el-form-item label="选择上级码商">
          <el-select v-model="formData.parentId" placeholder="请选择上级码商" size="small">
            <el-option label="上级码商1" value="1"></el-option>
            <el-option label="上级码商2" value="2"></el-option>
            <el-option label="上级码商3" value="3"></el-option>
            <el-option label="上级码商4" value="4"></el-option>
            <el-option label="上级码商5" value="5"></el-option>
            <el-option label="上级码商6" value="6"></el-option>
            <el-option label="上级码商7" value="7"></el-option>
            <el-option label="上级码商8" value="8"></el-option>
          </el-select>
        </el-form-item>

        

        <el-form-item label="是否需要审核" v-if="!isEdit" prop="isAuditRequired">
          <el-switch v-model="formData.isAuditRequired" />
        </el-form-item>

        <el-form-item label="是否延时回款" v-if="!isEdit" prop="isDelayedPayment">
          <el-switch v-model="formData.isDelayedPayment" />
        </el-form-item>

        <el-form-item
          label="延时回款时间"
          v-if="formData.isDelayedPayment && !isEdit"
          prop="delayedPaymentTime"
        >
          <el-select
            v-model="formData.delayedPaymentTime"
            placeholder="请选择延时回款时间"
            size="small"
          >
            <el-option
              v-for="item in delay_payment_time_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="最大同时接单数量" v-if="!isEdit" prop="maxConcurrentOrdersCount">
          <el-input
            v-model="formData.maxConcurrentOrdersCount"
            placeholder="请输入最大同时接单数量"
            size="small"
          />
        </el-form-item>

        <el-form-item label="转账备注类型" prop="remark_type">
          <el-select v-model="formData.remark_type" placeholder="请选择转账备注类型" size="small">
                  <el-option label="无" value="0"></el-option>
                  <el-option label="随机6位数字" value="1"></el-option>
                  <el-option label="随机字符串" value="2"></el-option>
                  <el-option label="随机邮箱" value="3"></el-option>
                  <el-option label="随机手机号" value="4"></el-option>
                  <el-option label="随机QQ号" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input v-model="formData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="keyDialogVisible" title="查看码商密钥" width="500px">
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
        <el-form-item label="码商密钥：" prop="merchant_key">
          <template>{{ merchant_key }}</template>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="keyDialogVisible = false" size="small"> 关闭窗口 </el-button>
        <!-- <el-button type="primary" @click="onDialogBtnOk()" size="small"> 关闭 </el-button> -->
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showLevelTreeVisual" title="查看码商层级" width="500px">
      <el-tree :data="levelTree" default-expand-all node-key="id"> </el-tree>

      <div slot="footer">
        <el-button @click="showLevelTreeVisual = false" type="primary" size="small">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="feeDialogVisible" :title="feeDialogTitle" width="500px">
      <el-form
        ref="form"
        :model="feeChangeFormData"
        :rules="myRules"
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
        <el-form-item label="码商名称" prop="userNickName">
          <el-input
            v-model="feeChangeFormData.userNickName"
            :disabled="true"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="余额类型" prop="banlance_type">
          <el-input
            v-model="feeChangeFormData.banlance_type"
            :disabled="true"
            placeholder="请输入余额类型"
            size="small"
          />
        </el-form-item>

        <el-form-item label="当前余额" prop="balance">
          <el-input v-model="feeChangeFormData.balance" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="操作类型" prop="opt_type">
          <el-input v-model="feeChangeFormData.opt_type" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" required prop="money">
          <el-input v-model="feeChangeFormData.money" placeholder="请输入金额" size="small" />
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

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="`配置 【 ${formData.userNickName} 】 的产品`"
      width="800px"
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

    <!--      查看团队权限对话框    -->
    <el-dialog :visible.sync="showTeamPromisessDialogVisible" title="团队权限" width="300px">
      <el-form
        ref="form"
        :model="showPromisessFormData"
        label-position="right"
        label-width="140px"
        style="margin-right: 100px"
      >
        <el-form-item label="查看全部下级订单" prop="is_look_lower">
          <el-switch v-model="showPromisessFormData.is_look_lower" size="small" />
        </el-form-item>

        <el-form-item label="操作全部下级订单" prop="is_look_lower_order">
          <el-switch v-model="showPromisessFormData.is_look_lower_order" size="small" />
        </el-form-item>

        <el-form-item label="查看直接下级订单" prop="is_replace_order">
          <el-switch v-model="showPromisessFormData.is_replace_order" size="small" />
        </el-form-item>

        <el-form-item label="操作直接下级订单" prop="is_cancel_replace_order">
          <el-switch v-model="showPromisessFormData.is_cancel_replace_order" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showTeamPromisessDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="showTeamPromisessDialogVisible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 码商权限对话框 -->
    <el-dialog :visible.sync="showServicePromisessDialogVisible" title="码商权限" width="500px">
      <el-form
        ref="form"
        :model="showPromisessFormData"
        label-position="right"
        label-width="140px"
        style="margin-right: 100px"
      >
        <el-form-item label="是否需要审核" prop="isAuditRequired">
          <el-switch v-model="showPromisessFormData.isAuditRequired" />
          <div class="red_tip">仅代付生效</div>
        </el-form-item>

        <el-form-item label="是否延时回款" prop="isDelayedPayment">
          <el-switch v-model="showPromisessFormData.isDelayedPayment" />
          <div class="red_tip">仅代付生效</div>
        </el-form-item>

        <el-form-item
          label="延时回款时间"
          v-if="showPromisessFormData.isDelayedPayment"
          prop="delayedPaymentTime"
        >
          <el-select
            v-model="showPromisessFormData.delayedPaymentTime"
            placeholder="请选择延时回款时间"
            size="small"
          >
            <el-option
              v-for="item in delay_payment_time_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="red_tip">仅代付生效</div>
        </el-form-item>

        <el-form-item label="最大同时接单数量" prop="maxConcurrentOrdersCount">
          <el-input
            v-model="showPromisessFormData.maxConcurrentOrdersCount"
            placeholder="请输入最大同时接单数量"
            size="small"
          />
          <div class="red_tip">仅代付生效</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showServicePromisessDialogVisible = false" size="small">
          取消
        </el-button>
        <el-button type="primary" @click="showServicePromisessDialogVisible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showCopyDialogVisable" title="复制码商" width="500px">
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

        <el-form-item label="码商名称" prop="tenant_name">
          <el-input
            v-model="copyFormData.tenant_name"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="码商模板" prop="tenant_template">
          <el-select v-model="copyFormData.tenant_template" placeholder="请选择" size="small">
            <el-option
              :label="item.userName"
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
      </el-form>
      <div slot="footer">
        <el-button @click="reset_password_dialog = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="closeResetPassword()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <service :currItem="formData" ref="serviceDialog"></service>
    <balance :currItem="formData" ref="balanceDialog"></balance>
  </div>
</template>

<script>
import Peizhi from './service-list-setting.vue'
import service from './merchant_service_setting.vue'
import balance from './service-list-balance.vue'
export default {
  components: {
    Peizhi,
    service,
    balance
  },
  name: 'MerchantInfo',
  data() {
    return {
      copyFormData: {
        tenant_number: '',
        tenant_name: '',
        tenant_template: ''
      },
      code: '',
      tableData: [
        {
          providerId: '', //	全局码商ID	integer
          isActive: '', //	是否启用,可用值:0,1	integer
          userName: '', //	账号	string
          userNickName: '', //	码商名称	string
          level: '', //	当前层级	integer
          availableBalance: '', //	可用余额	number
          freezeBalance: '', //	冻结余额	number
          minAllowableCollectAmount: '', //	最低接单金额	number

          isViewAllSubOrders: '', //	是否查看全部下级订单,可用值:0,1	integer
          isOperateAllSubOrders: '', //	是否操作全部下级订单,可用值:0,1	integer
          isViewDirectSubOrders: '', //	是否查看直接下级订单,可用值:0,1	integer
          isOperateDirectSubOrders: '', //	是否操作直接下级订单,可用值:0,1	integer

          isCollectEnable: '', //	是否开启代收,可用值:0,1	integer
          isPaymentEnable: '', //	是否开启代付,可用值:0,1	integer
          isAuditRequired: '', //	是否需要审核,可用值:0,1	integer
          isDelayedPayment: '', //	是否延时回款,可用值:0,1	integer
          delayedPaymentTime: '', //	延时回款时间	integer
          maxConcurrentOrdersCount: '', //	最大同时接单数量	integer
          remark: '', //	备注信息	string
          createTime: '', //	创建时间	string
          updateTime: '' //	更新时间	string
        }
      ],
      dialogVisible: false,
      user_info_dialog: false,
      reset_password_dialog: false,
      formData: {
        // userName: '',
        // userNickName: '',
        // merchant_key: '',
        // merchant_num: '',
        // login_code: '',
        // google_key: '',
        // isActive: '',
        // parentId: '',
        // remark: '',

        //---------------
        providerId: '', //	全局码商ID,示例值(123456789)
        userName: '', //	账号,示例值(账号)		true
        userNickName: '', //	码商名称,示例值(码商名称)		true
        parentId: '', //	上级码商ID		true
        parentUserName: '', //	上级码商名称		false
        level: '', //	层级深度		false
        isAuditRequired: '', //	是否需要审核：0-否，1-是,可用值:0,1,示例值(1)		true
        isDelayedPayment: '', //	是否延时回款 0-否，1-是,示例值(1)		true
        delayedPaymentTime: '', //	延时回款时间 延时回款时间(6-2分钟、9-5分钟、14-10分钟、16-30分钟、17-1小时、18-2小时,示例值(6)		false
        maxConcurrentOrdersCount: '', //	最大同时接单数量,示例值(1)		true
        transferRemarkType: '', //	转账备注类型转账备注类型（0-随机6位数字 1-随机字符串 2-随机邮箱 3-随机手机号 4-随机QQ号）,示例值(1)		true
        isActive: '', //	是否启用：0-禁用，1-启用,可用值:0,1,示例值(1)		false
        remark: '' //	备注信息,示例值(备注信息)		false
      },
      queryFormData: {
        // userName: '',
        // userNickName: '',
        // user_type: '',
        // isActive: '',

        //-----

        pageNum: 1, //	页码	query	true
        pageSize: 10, //	每页大小	query	true
        providerQueryDTO: {
          //	码商数据传输对象	body	true
          providerId: '', // 	码商ID,示例值(123456789)		false
          userName: '', // 账号,示例值(账号)		false
          userNickName: '', //	码商名称,示例值(码商名称)		false
          isActive: 1
        } //是否启用：0-禁用，1-启用,可用值:0,1,示例值(1)		false
      },

      feeDialogVisible: false, // 增减余额对话框
      keyDialogVisible: false, // 查看码商密钥对话框
      peizhiDialogVisible: false, // 配置通道
      keyFormData: {
        deal_passage: '',
        google_key: '',
        merchant_key: ''
      },
      formDataPassword: {
        login_code: '',
        google_key: ''
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
      delay_payment_time_options: [
        // {
        //   value: 0,
        //   label: '实时回款'
        // },
        {
          value: 1,
          label: '1分钟'
        },
        {
          value: 6,
          label: '2分钟'
        },
        {
          value: 9,
          label: '5分钟'
        },
        {
          value: 14,
          label: '10分钟'
        },
        {
          value: 16,
          label: '30分钟'
        },
        {
          value: 17,
          label: '1小时'
        },
        {
          value: 18,
          label: '2小时'
        }
      ],
      selectionRows: [], // 选中的行数据
      user_info: [],
      keyFormRules: {
        deal_passage: [{ required: true, trigger: 'blur', message: '请输入' }],
        google_key: [{ required: true, trigger: 'blur', message: '请输入' }]
      },
      showTeamPromisessDialogVisible: false, // 权限
      showServicePromisessDialogVisible: false, // 权限
      showPromisessFormData: {},
      // 添加扩展数据，如 options 所需要的数据
      levelTree: [
        {
          id: 1,
          label: '码商1',
          children: [
            {
              id: 2,
              label: '码商1-1'
            },
            {
              id: 3,
              label: '码商1-2'
            }
          ]
        },
        {
          id: 4,
          label: '码商2',
          children: [
            {
              id: 5,
              label: '码商2-1'
            },
            {
              id: 6,
              label: '码商2-2'
            }
          ]
        }
      ],
      showLevelTreeVisual: false,
      showCopyDialogVisable: false
    }
  },
  methods: {
    closeResetPassword() {
      this.reset_password_dialog = false
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
    showCopyDialog() {
      this.showCopyDialogVisable = true
    },
    showLevelTree(row) {
      this.showLevelTreeVisual = true
    },
    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    showBalanceDialog(row) {
      this.formData = Object.assign({}, row)
      this.$refs.balanceDialog.balanceDialogVisible = true
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
          balance: row.availableBalance,
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
          balance: row.availableBalance,
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
          balance: row.freezeBalance,
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
          balance: row.freezeBalance,
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
          balance: row.minAllowableCollectAmount,
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
          balance: row.minAllowableCollectAmount,
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
            item.availableBalance = this.feeChangeFormData.balance
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
            item.freezeBalance = this.feeChangeFormData.balance
          }
          return item
        })
      }
    },
    batchSettle() {
      this.$confirm('您确定对选中的码商进行结算吗?', '提示', {
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
    showServicePromisessDialog(row) {
      this.showServicePromisessDialogVisible = true
      this.showPromisessFormData = row
    },

    showTeamPromisessDialog(row) {
      this.showTeamPromisessDialogVisible = true
      this.showPromisessFormData = row
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
      this.formData = {
        selection: '',
        index: '',
        userName: '',
        userNickName: '',
        user_type: '',
        availableBalance: '',
        parentId: '',
        freezeBalance: '',
        minAllowableCollectAmount: '',
        merchant_num: '',
        merchant_key: '',
        isActive: '',
        remark: '',
        createTime: '',
        updateTime: ''
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
        user_type: '',
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

      if (this.queryFormData.user_type != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.user_type == this.queryFormData.user_type
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
        { title: '码商名称', type: 'string', key: 'userNickName', isSearch: true, id: 1003 },
        { title: '开启代收', type: 'boolean', key: 'isCollectEnable', isSearch: true, id: 10014 },
        { title: '开启代付', type: 'boolean', key: 'isPaymentEnable', isSearch: true, id: 10014 },
        { title: '用户类型', type: 'string', key: 'user_type', isSearch: true, id: 1004 },
        { title: '可用余额', type: 'number', key: 'availableBalance', isSearch: false, id: 1005 },
        { title: '冻结金额', type: 'number', key: 'freezeBalance', isSearch: false, id: 1006 },
        { title: '代收押金', type: 'number', key: 'minAllowableCollectAmount', isSearch: false, id: 1007 },
        { title: '码商号', type: 'string', key: 'merchant_num', isSearch: false, id: 1008 },
        { title: '码商密钥', type: 'string', key: 'merchant_key', isSearch: false, id: 1009 },
        { title: '是否启用', type: 'boolean', key: 'isActive', isSearch: true, id: 1010 }, //
        {
          title: '是否需要审核',
          type: 'boolean',
          key: 'isAuditRequired',
          isSearch: false,
          id: 1012
        },
        {
          title: '是否延时回款',
          type: 'boolean',
          key: 'isDelayedPayment',
          isSearch: false,
          id: 1013
        },
        {
          title: '延时回款时间',
          type: 'select',
          key: 'delayedPaymentTime',
          isSearch: false,
          id: 1014,
          options: this.delay_payment_time_options
        },
        {
          title: '最大同时接单数量',
          type: 'number',
          key: 'maxConcurrentOrdersCount',
          isSearch: false,
          id: 1015
        },
        { title: '备注信息', type: 'string', key: 'remark', isSearch: false, id: 1011 },
        { title: '转账备注类型', type: 'string', key: 'remark_type', isSearch: false, id: 1017 },
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
          if (column.title == '码商名称') {
            ele[column.key] = '码商名称' + this.tableData.length
          }

          //
          if (column.title == '码商密钥') {
            ele[column.key] = '********'
          }
        })

        /**
         * 查看全部下级
          查看下级订单
          代收补单
          取消代收订单
          确认代收订单
         */
        ele.is_look_lower = true
        ele.is_look_lower_order = true
        ele.is_replace_order = true
        ele.is_cancel_replace_order = true
        ele.is_confirm_replace_order = true

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
.red {
  color: red;
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
.label {
  font-size: 18px;
  margin-right: 10px;
  line-height: 20px;
}
.text {
  font-size: 16px;
  // color: green;
  line-height: 20px;
}
.remark {
  font-size: 12px;
}
</style>
