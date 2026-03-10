<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormDataRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="商户名称" prop="userNickName">
          <el-select
            filterable
            v-model="queryFormData.merchantId"
            placeholder="请选择"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.merchantId"
            ></el-option>
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

        <el-form-item label="商户分组" prop="merchantPacket">
          <el-select
            filterable
            v-model="queryFormData.merchantPacket"
            placeholder="请选择角色"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
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
      <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <el-button
        type="success"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-plus"
        @click="batchSettle(false)"
        >批量结算</el-button
      >

      <el-button type="primary" plain icon="el-icon-plus" @click="batchSettle(true)"
        >全部结算</el-button
      >

      <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()">复制</el-button>

      <el-button
        type="primary"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-plus"
        @click="showPatchDialog(false)"
        >批量修改</el-button
      >
      <el-button type="primary" plain icon="el-icon-plus" @click="showPatchDialog(true)"
        >全部修改</el-button
      >

      <el-button
        type="primary"
        :disabled="selectionRows.length == 0"
        plain
        icon="el-icon-plus"
        @click="showPatchAddChannelDialog(false)"
        >批量添加通道</el-button
      >
      <el-button type="primary" plain icon="el-icon-plus" @click="showPatchAddChannelDialog(true)"
        >全部添加通道</el-button
      >

      <el-button type="danger" icon="el-icon-plus" @click="deleteAllMerchant()"
        >全部删除商户【超管专用】</el-button
      >

      <div class="tips mt-10">
        统计信息：
        <span class="mr-10"
          >商户总数: {{ summaryData.totalCount ? summaryData.totalCount : 0 }}
        </span>
        <span class="mr-10"
          >可用余额总和: {{ summaryData.availableBalance ? summaryData.availableBalance : 0 }}
        </span>
        <span class="mr-10"
          >冻结金额总和: {{ summaryData.freezeBalance ? summaryData.freezeBalance : 0 }}
        </span>
        <span class="mr-10"
          >预付商户金额总和: {{ summaryData.collectDeposit ? summaryData.collectDeposit : 0 }}
        </span>
        <span class="mr-10"
          >预付净额总和:
          {{
            summaryData.collectDeposit
              ? (summaryData.collectDeposit - summaryData.availableBalance).toFixed(2)
              : 0
          }}
        </span>
      </div>
      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center"> </el-table-column>
        <el-table-column label="序号" align="center" type="index" width="50" />

        <!-- <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="商户名称" align="center" prop="userNickName" /> -->

        <el-table-column label="商户信息" align="center" prop="merchantPacket" min-width="120">
          <template slot-scope="{ row }">
            <div class="ta-l">
              <div>
                <span class="mr-5">账号</span
                ><el-tag type="primary" size="small">{{ row.userName }}</el-tag>
              </div>
              <div class="mt-10">
                <span class="mr-5">名称</span
                ><el-tag type="primary" size="small">{{ row.userNickName }}</el-tag>
              </div>
              <div class="mt-10">
                <span class="mr-5">类型</span
                ><el-tag :type="row.merchantPacket === 0 ? 'primary' : 'danger'" size="small">
                  {{ row.merchantPacket === 0 ? '代收' : '代付' }}</el-tag
                >
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          class-name="balance"
          label="可用余额(元)"
          align="center"
          prop="availableBalance"
          width="110px"
          sortable
          :sort-method="(a, b) => a.availableBalance - b.availableBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.availableBalance) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 1)">＋</span>
              <span class="sub" @click="showChangeFeeDialog(row, 2)">－</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          class-name="balance"
          label="冻结金额(元)"
          align="center"
          sortable
          width="90px"
          :sort-method="(a, b) => a.freezeBalance - b.freezeBalance"
          prop="freezeBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.freezeBalance).toFixed(2) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 3)">＋</span>
              <span class="sub" @click="showChangeFeeDialog(row, 4)">－</span>
            </div>
          </template></el-table-column
        >
        <el-table-column
          class-name="balance"
          label="预付商户金额(元)"
          align="center"
          width="110px"
          sortable
          :sort-method="(a, b) => a.collectDeposit - b.collectDeposit"
          prop="collectDeposit"
        >
          <template slot="header">
            预付商户金额(元)
            <el-tooltip class="item" effect="dark" content="提前支付给商户的金额" placement="top"
              ><i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.collectDeposit).toFixed(2) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 5)">＋</span>
              <span class="sub" @click="showChangeFeeDialog(row, 6)">－</span>
            </div>
          </template></el-table-column
        >

        <el-table-column
          label="预付净额(元)"
          align="center"
          width="100px"
          sortable
          :sort-method="
            (a, b) =>
              a.collectDeposit - a.availableBalance - (b.collectDeposit - b.availableBalance)
          "
        >
          <template slot-scope="{ row }">
            <span class="val">{{
              Number(row.collectDeposit - row.availableBalance).toFixed(2)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商户号" align="center" prop="merchantNo" />
        <el-table-column label="商户密钥" align="center" prop="merchantSecretKey">
          <template slot-scope="{ row }">
            <el-tag type="danger" @click="showMerchantKey(row)" class="tag-pink" size="mini"
              >查看</el-tag
            >
          </template>
        </el-table-column>

        <!-- <el-table-column label="商户密钥" align="center" prop="merchantSecretKey">
          <template slot-scope="{ row }">
            <el-tag type="danger" @click="showMerchantKey(row)" class="tag-pink" size="mini"
              >查看</el-tag
            >
          </template>
        </el-table-column> -->

        <el-table-column label="指定码商数量" align="center" width="80" prop="appointProviderCount">
          <template slot-scope="{ row }">
            <div v-if="row.appointProviderCount > 0">{{ row.appointProviderCount }}</div>
            <el-tag v-else type="success">全部</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center" width="80">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="onSwitchChange(row)" />
          </template>
        </el-table-column>

        <el-table-column label="是否允许手动创建代付订单" align="center" width="80">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isManualCreateOrderEnable == 1" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="群组ID" align="center" prop="groupId" min-width="95" />
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="120" />
        <!-- <el-table-column label="更新时间" align="center" prop="updateTime" /> -->

        <el-table-column align="center" label="操作" width="260" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>

              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置通道
              </div>

              <div type="success" class="btn" @click="showIPDialog(row)">
                <i class="el-icon-edit" />IP白名单
              </div>
              <div type="success" class="btn" @click="showFanChaDialog(row)">
                <i class="el-icon-edit" />代付反查配置
              </div>

              <div type="success" class="btn" @click="showServiceDialog(row)">
                <i class="el-icon-thumb" /> 代收指定码商
              </div>

              <div type="success" class="btn" @click="showResetPassword(row, 1)">
                <i class="el-icon-brush" />重置登录密码
              </div>

              <div type="success" class="btn" @click="showResetPassword(row, 2)">
                <i class="el-icon-brush" />重置谷歌密钥
              </div>
              <div type="success" class="btn" @click="showResetPassword(row, 3)">
                <i class="el-icon-brush" />重置商户密钥
              </div>
              <div type="success" class="btn" @click="showResetPassword(row, 4)">
                <i class="el-icon-brush" />重置交易密码
              </div>

              <div type="primary" class="btn" @click="showConfirmSettle(row)">
                <i class="el-icon-finished" /> 结算
              </div>

              <div type="success" class="btn" @click="unlockUser(row)">
                <i class="el-icon-unlock" />解锁
              </div>

              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
              <!-- <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="unlockUser(row)">
                      <i class="el-icon-unlock" />解锁
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 1)">
                      <i class="el-icon-brush" />重置登录密码
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 2)">
                      <i class="el-icon-brush" />重置谷歌密钥
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 3)">
                      <i class="el-icon-brush" />重置商户密钥
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div type="success" class="btn" @click="showResetPassword(row, 4)">
                      <i class="el-icon-brush" />重置交易密码
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
              </el-dropdown> -->
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="iPdialogVisible"
      @close="onIPDialogBtnCancel()"
      title="IP白名单"
      width="600px"
    >
      <el-form
        :rules="rules"
        ref="ipformRef"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号登录IP" prop="loginWhiteIp">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.loginWhiteIp"
            placeholder="输入IP，多个IP用，号间隔"
            size="small"
          />
        </el-form-item>

        <el-form-item label="进单网关IP" prop="apiWhiteIp">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.apiWhiteIp"
            placeholder="输入IP，多个IP用，号间隔"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onIPDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onIPDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="fanchaVisible"
      title="反查配置"
      width="600px"
      @close="onDialogFanchaBtnCancel()"
    >
      <el-form
        :rules="rules"
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="反查系统" prop="loginIP">
          <el-select
            filterable
            v-model="formData.reverseCheckType"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="(item, index) in reverseConfigList"
              :key="index"
              :label="item.reverseTypeName"
              :value="item.reverseType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="域名列表" prop="reverseCheckAddress">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.reverseCheckAddress"
            placeholder="输入域名，多个IP用，号间隔"
            size="small"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="">
          <el-switch v-model="formData.isReverseCheckEnable" size="small"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogFanchaBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogFanchaBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="onDialogBtnCancel"
      :title="isEdit ? '修改商户' : '新增商户'"
      width="600px"
    >
      <el-form
        :rules="rules"
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="180px"
        style="margin-right: 100px"
      >
        <el-form-item
          label="账号"
          :prop="isEdit ? '' : 'userName'"
          :rules="isEdit ? {} : userNameRules"
        >
          <el-input
            v-model="formData.userName"
            placeholder="请输入账号"
            size="small"
            :disabled="isEdit ? true : false"
          />
        </el-form-item>

        <!-- :rules="userNickNameRules" -->
        <el-form-item label="商户名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入商户名称" size="small" />
        </el-form-item>

        <el-form-item label="商户分组" prop="merchantPacket">
          <el-select
            filterable
            v-model="formData.merchantPacket"
            placeholder="请选择角色"
            size="small"
          >
            <el-option label="代收" :value="0"></el-option>
            <el-option label="代付" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="群组ID" prop="groupId">
          <el-input v-model="formData.groupId" placeholder="请输入群组ID" size="small" />
        </el-form-item>

        <el-form-item label="选择代理" prop="merchantAgentId">
          <el-select
            filterable
            v-model="formData.merchantAgentId"
            placeholder="请选择代理"
            size="small"
          >
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="item in allMerchantAgentList"
              :key="item.merchantAgentId"
              :label="item.userName"
              :value="item.merchantAgentId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch :disabled="isEdit ? false : true" v-model="formData.isActive" />
        </el-form-item>
        <el-form-item label="是否允许手动创建代付订单" prop="isManualCreateOrderEnable">
          <el-switch v-model="formData.isManualCreateOrderEnable" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 重置密钥 -->
    <el-dialog :visible.sync="keyDialogVisible" title="查看商户密钥" width="500px" center>
      <div style="text-align: center">
        {{ merchant_key }} <el-button type="text" @click="copyMerchantKey">复制</el-button>
      </div>

      <div slot="footer">
        <el-button type="success" @click="resetMerchantKey()" size="small"> 重置密钥 </el-button>
        <el-button @click="keyDialogVisible = false" size="small"> 关闭窗口 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onFeeDialogBtnCancel()"
      :visible.sync="feeDialogVisible"
      :title="feeDialogTitle"
      width="500px"
    >
      <el-form
        ref="feeChangeFormDataRef"
        :model="feeChangeFormData"
        label-position="right"
        :rules="feeChangeFormRules"
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

        <el-form-item label="当前余额" prop="balance">
          <el-input v-model="feeChangeFormData.balance" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="操作类型" prop="opt_type">
          <el-input v-model="feeChangeFormData.opt_type" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" prop="changeAmount">
          <el-input
            v-number-input
            type="number"
            v-model="feeChangeFormData.changeAmount"
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易密码" prop="tradePassword">
          <el-input
            v-model="feeChangeFormData.tradePassword"
            type="password"
            show-password
            placeholder="请输入交易密码"
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
      :title="'配置【' + formData.userNickName + '】的通道'"
      width="900px"
    >
      <!-- <Peizhi :currItem="formData"></Peizhi> -->
      <div style="max-height: 600px; overflow: auto">
        <Peizhi
          v-if="peizhiDialogVisible"
          :currItem="formData"
          :parentV="peizhiDialogVisible"
        ></Peizhi>
      </div>
      <!-- <div slot="footer">
        <el-button @click="peizhiDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="peizhiDialogVisible = false" size="small">
          确定
        </el-button>
      </div> -->
    </el-dialog>

    <service
      :currItem="formData"
      ref="serviceDialog"
      @close="
        () => {
          showServiceVisible = false
          flushPage()
        }
      "
      v-if="showServiceVisible"
    ></service>

    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="600px">
      <div style="margin-left: 10px">
        <div class="request">
          <h3>基本信息</h3>

          <div class="req-line">
            <span class="req-label">商户端登录地址</span>
            <span class="req-value">
              <el-input :value="open_info.merchantLoginAddress" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">登录账号</span>
            <span class="req-value">
              <el-input :value="open_info.userName" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">初始登录密码</span>

            <span class="req-value">
              <el-input :value="open_info.initialLoginPassword" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">商户号</span>
            <span class="req-value">
              <el-input :value="open_info.merchantNo" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">商户密钥</span>
            <span class="req-value">
              <el-input :value="open_info.merchantSecretKey" disabled></el-input>
            </span>
          </div>

          <h3>订单相关</h3>
          <div class="req-line">
            <span class="req-label">代收下单</span>
            <span class="req-value">
              <el-input :value="open_info.collectOrderGateway" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">代收订单查询</span>
            <span class="req-value">
              <el-input :value="open_info.queryUrl" disabled></el-input>
            </span>
          </div>

          <!-- <h3>订单相关</h3> -->
          <div class="req-line">
            <span class="req-label">代付下单</span>
            <span class="req-value">
              <el-input :value="open_info.paymentAllOrderAddress" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">代付订单查询</span>
            <span class="req-value">
              <el-input :value="open_info.queryPayUrl" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">商户信息查询</span>
            <span class="req-value">
              <el-input :value="open_info.merchantInfoQueryAddress" disabled></el-input>
            </span>
          </div>

          <H3>api 相关</H3>

          <div class="req-line">
            <span class="req-label">文档</span>
            <span class="req-value">
              <el-input :value="open_info.documentAddress" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">回调IP</span>
            <span class="req-value">
              <el-input :value="open_info.callbackIp" disabled></el-input>
            </span>
          </div>
        </div>

        <div
          style="
            color: red;
            font-size: 12px;
            line-height: 20px;
            margin-left: 10px;
            margin-top: 20px;
          "
        >
          说明：（主要针对账号安全设定）
        </div>
        <div style="color: red; font-size: 12px; line-height: 20px; margin-left: 10px">
          1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
        </div>
        <div style="color: red; font-size: 12px; line-height: 20px; margin-left: 10px">
          2、若开户后忘记临时密码需要跟后台申请重置
        </div>
        <div style="color: red; font-size: 12px; line-height: 20px; margin-left: 10px">
          3、初次登录后，请及时设置交易密码
        </div>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button type="success" size="small" style="margin-right: 30px" @click="copyMerchantInfo"
          >复制</el-button
        >
        <el-button @click="user_info_dialog = false" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="reset_password_dialog"
      :title="
        resetPwdType == 1
          ? '重置密码'
          : resetPwdType == 2
          ? '重置谷歌密钥'
          : resetPwdType == 3
          ? '重置商户密钥'
          : '重置交易密码'
      "
      width="600px"
      @close="closeResetPassword"
    >
      <el-form
        ref="form"
        :model="formDataPassword"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="登录密码" prop="login_code" v-if="resetPwdType == 1">
          <div class="line">
            <el-input
              v-model="formDataPassword.login_code"
              placeholder="请输入登录密码"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(1)">重置</el-button> -->
            <el-button
              v-if="showCopyBtn"
              type="primary"
              plain
              size="small"
              class="el_btn"
              @click="copyPassword"
              >复制</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="谷歌密钥" prop="google_key" v-if="resetPwdType == 2">
          <div class="line">
            <el-input
              v-model="formDataPassword.google_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(2)">重置</el-button> -->
          </div>
        </el-form-item>

        <el-form-item label="商户密钥" prop="" v-if="resetPwdType == 3">
          <div class="line">
            <el-input
              v-model="formDataPassword.merchant_key"
              placeholder="请输入谷歌密钥"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(3)">重置</el-button> -->
          </div>
        </el-form-item>
        <el-form-item label="交易密码" prop="tradePwd" v-if="resetPwdType == 4">
          <div class="line">
            <el-input
              v-model="formDataPassword.tradePwd"
              placeholder="请输入交易密码"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword(4)">重置</el-button> -->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="success" @click="resetPassword(resetPwdType)">重置</el-button>
        <el-button type="primary" @click="closeResetPassword()" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="copyBtnCancel"
      :visible.sync="showCopyDialogVisable"
      title="复制商户"
      width="500px"
    >
      <div class="help-tip txt-center mb-10">
        复制商户就是根据已有的商户相关配置，快速创建新的商户。
      </div>

      <el-form
        ref="copyFormData"
        :rules="rules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号" prop="userName" :rules="userNameRules">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="商户名称" prop="userNickName">
          <!-- :rules="userNickNameRules" -->
          <el-input v-model="copyFormData.userNickName" placeholder="请输入商户名称" size="small" />
        </el-form-item>

        <el-form-item required label="商户模板" prop="merchantId">
          <el-select filterable v-model="copyFormData.merchantId" placeholder="请选择" size="small">
            <el-option
              v-for="item in allMerchantList"
              :key="item.merchantId"
              :label="item.userNickName"
              :value="item.merchantId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="群组ID" prop="groupId">
          <el-input v-model="copyFormData.groupId" placeholder="请输入群组ID" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="copyBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="copyBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showPatchDialogVisable"
      :title="isModAll ? '全部修改' : '批量修改'"
      @close="onPatchBtnCancel()"
      width="600px"
    >
      <el-form
        ref="formPatchRef"
        :rules="setRules"
        :model="formPatchData"
        label-position="right"
        label-width="150px"
        style="margin-right: 100px"
      >
        <el-form-item label="是否启用" prop="isActive">
          <el-radio-group v-model="formPatchData.isActive" size="small">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="修改费率" prop="isUpdateMerchantRate">
          <el-switch v-model="formPatchData.isUpdateMerchantRate"></el-switch>
        </el-form-item>
        <el-form-item label="通道名称" prop="channelIds" v-if="formPatchData.isUpdateMerchantRate">
          <el-select
            v-model="formPatchData.channelIds"
            :multiple="true"
            placeholder="请选择"
            @change="allChannelChange"
          >
            <el-option v-if="allChannelList.length != 0" label="全部" value=""> </el-option>
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formPatchData.isUpdateMerchantRate"
          label="商户费率"
          prop="merchantRate"
        >
          <el-input
            v-number-input
            type="number"
            v-model="formPatchData.merchantRate"
            placeholder="请输入商户费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
        </el-form-item>

        <el-form-item v-if="formPatchData.isUpdateMerchantRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatchData.merchantRateAdjustType">
            <el-radio class="mt-10" :label="1"
              >设置为当前值
              <div class="help-tip">例如：输入2 ，无论之前费率是多少，都会调整为 2%</div></el-radio
            >

            <el-radio class="mt-10" :label="2"
              >全部增加当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，会调整为 7%</div></el-radio
            >

            <el-radio class="mt-10" :label="3"
              >全部减少当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，会调整为 3%</div></el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onPatchBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="add_channel_dialogVisible"
      :title="isAddAll ? '全部商户添加通道' : '批量商户添加通道'"
      @close="onAddChannelDialogCancel()"
      width="600px"
    >
      <el-form
        ref="addChannelFormRef"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="通道名称" prop="channelId">
          <el-select
            filterable
            v-model="formData.channelId"
            :multiple="true"
            placeholder="请选择"
            @change="allChannelChange"
          >
            <el-option v-if="allChannelList.length != 0" label="全部" value=""> </el-option>
            <el-option
              v-for="item in allChannelList"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商户费率" prop="merchantRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.merchantRate"
            placeholder="请输入商户费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如 3% 表示每成交1笔订单，平台抽取订单金额的3%</div>
        </el-form-item>

        <el-form-item label="代理分润比例" prop="merchantAgentProfitRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.merchantAgentProfitRate"
            placeholder="请输入代理分润比例"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如 3% 表示每成交100元，商户代理抽取3元</div>
        </el-form-item>

        <el-form-item label="单笔费用" prop="merchantPerTransactionFee">
          <el-input
            v-number-input
            type="number"
            v-model="formData.merchantPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
          <div class="help-tip">如 2元 表示每成交1笔订单，平台抽取2元</div>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onAddChannelDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onAddChannelDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Peizhi from './merchant-setting.vue'
import service from './merchant_service_setting.vue'

import {
  merchantAgentPage, // ok
  getMerchantList, // ok
  createMerchant, // ok
  copyMerchant, // ok
  updateMerchant, // ok
  deleteMerchant, // ok
  settleAll, // ok
  settleMerchant, //  ok
  updateMerchantActiveStatus,
  updateMerchantActiveStatusAll,
  updateBatchMerchant,
  updateMerchantIsActive, // ok
  getMerchantBankInfo, //
  resetMerchantSecretKey, //
  resetMerchantLoginPassword, //
  isMerchantAccountExist, //
  resetMerchantGoogleSecret, //
  getMerchantWhiteList, //
  updateMerchantWhiteList, //
  getMerchantReverseConfig, // ?
  getMerchantReverseConfigByMerchantId,
  patchAllMerchantAddChannel,
  updateMerchantReverseConfig,
  getMerchantSum,
  merchantExport,
  batchSettlement
} from '@/api/merchant-info.js'
import { systemUserIsLock } from '@/api/system-manager'
import {
  adjustAvailableBalance,
  adjustFreezeBalance,
  adjustMinAllowableCollectAmount,
  adjustDepositAmount
} from '@/api/service-list'

import { getMerchantAgentList } from '@/api/merchant-agent-list'

import { getChannelByTenantId } from '@/api/merchant.js'

import { merchantRules, queryRules, feeChangeFormRules, merchantSettingRules } from './rules'
import { resetTradePassword } from '@/api/merchant-agent-list'
import clipboard from '@/utils/clipboard'
import { userNameValidate, userNickNameRules } from '@/utils/validate'

import { patchUnlockUser } from '@/api/service-list.js'
import FileSaver from 'file-saver'
export default {
  components: {
    Peizhi,
    service
  },
  name: 'MerchantInfo',
  data() {
    return {
      feeChangeFormRules: feeChangeFormRules,
      queryRules: queryRules,
      showCopyDialogVisable: false,
      copyFormData: {},
      setRules: merchantSettingRules,
      rules: merchantRules,
      summaryData: [],
      userNameRules: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userNameValidate,
        {
          validator: async (rule, value, callback) => {
            console.log(value)

            try {
              let ret = await isMerchantAccountExist(value)
              if (ret.data) {
                callback(new Error('账号已存在'))
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
      userNickNameRules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        ...userNickNameRules,
        {
          validator: async (rule, value, callback) => {
            console.log(value)

            // 如果修改的时候，新名与旧名相同，不校验
            if (this.isEdit && this.oldFormData.userNickName == this.formData.userNickName) {
              return callback()
            }

            try {
              let ret = await isMerchantAccountExist(value)
              if (ret.data) {
                callback(new Error('账号已存在'))
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

      tableData: [],
      dialogVisible: false,
      formData: {},
      oldFormData: {},
      showCopyBtn: false,
      queryFormData: this.getQueryForm(),
      feeDialogVisible: false, // 增减余额对话框
      keyDialogVisible: false, // 查看商户密钥对话框
      peizhiDialogVisible: false, // 配置通道
      keyFormData: {},
      feeDialogTitle: '默认标题',
      isEdit: false, // 是否是编辑状态
      feeChangeFormData: {},
      merchant_key: '',
      selectionRows: [], // 选中的行数据
      keyFormRules: {
        deal_passage: [{ required: true, trigger: 'blur', message: '请输入' }],
        google_key: [{ required: true, trigger: 'blur', message: '请输入' }]
      },
      user_info_dialog: false,
      open_info: {},
      reset_password_dialog: false,
      formDataPassword: {},
      // 添加扩展数据，如 options 所需要的数据

      showPatchDialogVisable: false, // 批量修改
      formPatchData: {
        isActive: 0, //0 保持不变  1  开启   2  关闭
        channelIds: []
      },
      isModAll: false, // 是否是全部修改
      allMerchantList: [], // 所有商户列表

      allMerchantAgentList: [], // 所有商户代理列表
      iPdialogVisible: false,
      fanchaVisible: false,

      showServiceVisible: false,
      resetPwdType: 1, // 1 登录密码  2 谷歌密钥  3 商户密钥
      reverseConfigList: [], // 商户反查配置列表
      feeChangeType: 0, // 1 增加余额  2 减少余额

      isAddAll: false,
      add_channel_dialogVisible: false,

      allChannelList: []
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.flushData()
      this.flushPage()
    }
  },
  methods: {
    async deleteAllMerchant() {
      try {
        await this.$confirm('确定要删除所有的商户吗？')

        this.tableData.forEach((row) => {
          deleteMerchant(row.merchantId, {})
        })
      } catch (e) {
        console.log(e)
      }
    },
    closeResetPassword() {
      this.reset_password_dialog = false
      this.showCopyBtn = false
    },
    copyPassword(e) {
      this.clipboard(`${this.formDataPassword.login_code}`, e)
    },
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          obj[key] = this.queryFormData[key]
        }
      })
      let res = await merchantExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户列表.xlsx')
    },
    async getMerchantSum() {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          params[key] = this.queryFormData[key]
        }
      })
      let res = await getMerchantSum(params)
      this.summaryData = res.data
      console.log(res, 'res')
    },
    allChannelChange(e) {
      if (e.indexOf('') != -1 && e.length > 1) {
        this.formData.channelId = ['']
        this.formPatchData.channelIds = ['']
        this.$message.error('您已选择全部，无须选择其他！')
      }
    },
    async unlockUser(row) {
      let res = await systemUserIsLock(row.userId)
      if (res.data.isLocked == 0) {
        //0 未锁定 1锁定
        this.$message.error('无须解锁')
        return
      }

      try {
        let ret = await this.$confirm(`确定解锁账号为【 ${row.userName} 】的用户吗？`)
        await patchUnlockUser([row.userId])
        this.$message.success('解锁成功')
      } catch (e) {
        console.log('取消操作')
      }
    },

    onAddChannelDialogCancel() {
      this.add_channel_dialogVisible = false
      this.$refs.addChannelFormRef.resetFields()
      this.$refs.addChannelFormRef.clearValidate()
    },
    showPatchAddChannelDialog(isAddAll) {
      this.isAddAll = isAddAll

      this.add_channel_dialogVisible = true
      this.formData = {
        channelId: [],
        merchantRate: '',
        merchantAgentProfitRate: '',
        merchantPerTransactionFee: '0',
        isActive: 1
      }
    },
    onAddChannelDialogBtnOk() {
      this.$refs.addChannelFormRef.validate(async (valid) => {
        if (valid) {
          // 提交表单数据
          console.log(this.formData)

          let channelArr = this.formData.channelId
          if (this.formData.channelId.indexOf('') != -1) {
            channelArr = [] // 全部
          }

          let data = {
            tenantId: this.$store.state.tenant.selectTenantId,
            merchantIdList: this.isAddAll ? [] : this.selectionRows.map((ele) => ele.merchantId),
            channelIdList: channelArr,
            relationCreateDTO: {
              merchantRate: this.formData.merchantRate,
              merchantAgentProfitRate: this.formData.merchantAgentProfitRate,
              merchantPerTransactionFee: this.formData.merchantPerTransactionFee,
              isActive: this.formData.isActive
            }
          }
          await patchAllMerchantAddChannel(data)

          if (this.isAddAll) {
            this.$message.success('全部添加成功')
          } else {
            this.$message.success('批量添加成功')
          }

          this.onAddChannelDialogCancel()
        } else {
          // 表单验证失败
          console.log('表单验证失败')
        }
      })
    },

    async resetMerchantKey() {
      try {
        await this.$confirm('是否重置密钥', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await resetMerchantSecretKey(this.formData.merchantId)
        console.log(res)

        this.merchant_key = res.data
        this.$message.success('重置密钥成功')
        // 为对话框中的 密钥重新赋值
      } catch (e) {}
    },
    async showFanChaDialog(row) {
      this.fanchaVisible = true
      this.formData.isReverseCheckEnable = 0 // 默认值，防止一个敬告

      let ret = await getMerchantReverseConfig({
        // tenantId: this.$store.state.tenant.selectTenantId
      })
      this.reverseConfigList = ret.data

      let ret2 = await getMerchantReverseConfigByMerchantId(row.merchantId)
      this.formData = {
        merchantId: row.merchantId,
        ...ret2.data
      }
    },
    onDialogFanchaBtnCancel() {
      this.fanchaVisible = false
    },
    async onDialogFanchaBtnOk() {
      let ret = await updateMerchantReverseConfig(this.formData)
      this.$message.success('更新成功')

      this.onDialogFanchaBtnCancel()
    },

    async onIPDialogBtnOk() {
      let ret = await updateMerchantWhiteList(this.formData)
      this.$message.success('更新成功')
      this.onIPDialogBtnCancel()
    },

    onIPDialogBtnCancel() {
      this.$refs.ipformRef.resetFields()
      this.iPdialogVisible = false
    },
    async showIPDialog(row) {
      // 群组ID
      this.iPdialogVisible = true
      let ret = await getMerchantWhiteList(row.merchantId)
      this.formData = ret.data
    },
    async resetPassword(type) {
      const merchantId = this.formDataPassword.merchantId // 商户ID

      if (type == 1) {
        // 登录密码
        let ret = await resetMerchantLoginPassword(merchantId)
        this.formDataPassword.login_code = ret.data
        this.showCopyBtn = true
        this.$message.success('登录密码重置成功')
      } else if (type == 2) {
        // 谷歌密钥
        await resetMerchantGoogleSecret(merchantId)
        this.$message.success('谷歌密钥重置成功')
      } else if (type == 3) {
        // 商户密钥
        let res = await resetMerchantSecretKey(merchantId)
        this.formDataPassword.merchant_key = res.data
        this.$message.success('商户密钥重置成功')
      } else {
        // 交易密码
        await resetTradePassword(this.formDataPassword.userId)
        this.$message.success('交易密码重置成功')
      }
    },
    clipboard,
    copyMerchantKey(e) {
      this.clipboard(`${this.merchant_key}`, e)
    },
    copyMerchantInfo(e) {
      this.clipboard(
        `
基本信息
  商户端登录地址
  ${this.open_info.merchantLoginAddress}
  登录账号
  ${this.open_info.userName}
  初始登录密码
  ${this.open_info.initialLoginPassword}
  商户号
  ${this.open_info.merchantNo}
  商户密钥
  ${this.open_info.merchantSecretKey}

订单相关
  代收下单
  ${this.open_info.collectOrderGateway}
  代收订单查询
  ${this.open_info.queryUrl}
  代付下单
  ${this.open_info.paymentAllOrderAddress}
  代付订单查询
  ${this.open_info.queryPayUrl}
  商户信息查询
  ${this.open_info.merchantInfoQueryAddress}

api 相关
  文档
  ${this.open_info.documentAddress}
  回调IP
  ${this.open_info.callbackIp}

说明：（主要针对账号安全设定）
  1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
  2、若开户后忘记临时密码需要跟后台申请重置
  3、初次登录后，请及时设置交易密码

      `,
        e
      )
    },
    async onSwitchChange(row) {
      // updateMerchantIsActive(row.merchantId, row.isActive).then((res) => {
      //   this.$message.success('修改成功')
      //   this.flushPage()
      // })

      try {
        let res = await updateMerchantIsActive(row.merchantId, {
          isActive: row.isActive
          // tenantId: this.$store.state.tenant.selectTenantId
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.flushPage()
    },
    onPatchBtnCancel() {
      this.$refs.formPatchRef.resetFields()
      this.showPatchDialogVisable = false
    },
    async onPatchDialogBtnOk() {
      this.$refs.formPatchRef.validate(async (valid) => {
        if (valid) {
          let channelIdsFlag = this.formPatchData.channelIds
          const isAllChannel = this.formPatchData.channelIds.indexOf('') != -1
          if (isAllChannel) {
            //全选的话
            channelIdsFlag = []
          }

          if (this.isModAll) {
            //全部修改

            await updateBatchMerchant(
              {
                tenantId: this.$store.state.tenant.selectTenantId,
                merchantIds: [],
                isActive: this.formPatchData.isActive,
                channelIds: channelIdsFlag,
                isUpdateMerchantRate: this.formPatchData.isUpdateMerchantRate,
                merchantRateAdjustType: this.formPatchData.merchantRateAdjustType,
                merchantRate: this.formPatchData.merchantRate
              },

              this.$store.state.tenant.selectTenantId
            )
          } else {
            // 批量修改

            let merchantIds = this.selectionRows.map((el) => el.merchantId)
            await updateBatchMerchant({
              tenantId: this.$store.state.tenant.selectTenantId,
              merchantIds: merchantIds,
              isActive: this.formPatchData.isActive,
              channelIds: channelIdsFlag,
              isUpdateMerchantRate: this.formPatchData.isUpdateMerchantRate,
              merchantRateAdjustType: this.formPatchData.merchantRateAdjustType,
              merchantRate: this.formPatchData.merchantRate
            })
          }

          this.$message.success('修改成功')
          this.showPatchDialogVisable = false
          this.flushPage()
        }
      })
    },
    showPatchDialog(isModAll) {
      this.isModAll = isModAll // 是否是全部修改

      this.formPatchData = {
        isActive: 1, // 1  开启   0  关闭
        // 批量修改
        isUpdateMerchantRate: 0, // 是否修改商户费率
        // merchantRate: '', // 商户费率
        merchantRateAdjustType: 1, //1设置为当前值，2全部增加当前值，3全部减少当前
        channelIds: []
      }
      this.getChannelByTenantId()
      this.showPatchDialogVisable = true
    },

    showCopyDialog() {
      this.isEdit = false
      this.showCopyDialogVisable = true

      if (this.allMerchantList.length == 0) {
        getMerchantList({
          tenantId: this.$store.state.tenant.selectTenantId
        }).then((res) => {
          console.log(res)
          this.allMerchantList = res.data
        })
      }
    },
    copyBtnOk() {
      this.$refs.copyFormData.validate(async (valid) => {
        if (valid) {
          await copyMerchant({
            ...this.copyFormData,
            tenantId: this.$store.state.tenant.selectTenantId
          })
          this.$message.success('复制成功')
          this.copyBtnCancel()
          this.flushPage()
          this.updateMerchantList()
        }
      })
    },
    copyBtnCancel() {
      this.$refs.copyFormData.resetFields()
      this.showCopyDialogVisable = false
    },
    showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true

      getMerchantBankInfo(row.merchantId, this.$store.state.tenant.selectTenantId).then((res) => {
        this.open_info = res.data
      })
    },
    showResetPassword(row, type) {
      console.log('重置密码')
      this.resetPwdType = type
      this.formDataPassword = {
        ...row,
        login_code: '********',
        google_key: '**********',
        merchant_key: '**********',
        tradePwd: '********'
      }
      this.reset_password_dialog = true
    },

    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    showServiceDialog(row) {
      this.formData = Object.assign({}, row)

      this.showServiceVisible = true
      // this.$refs.serviceDialog.serviceDialogVisible = true
    },
    handleSelectionChange(val) {
      this.selectionRows = val
    },
    showMerchantKey(row) {
      this.merchant_key = row.merchantSecretKey
      this.formData = Object.assign({}, row)
      this.keyDialogVisible = true
    },

    showChangeFeeDialog(row, type) {
      this.feeDialogVisible = true
      this.feeChangeType = type
      this.feeChangeFormData = Object.assign(this.feeChangeFormData, row)

      if (type == 1) {
        // 余额充值
        this.feeDialogTitle = '余额充值'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '可用余额',
          balance: row.availableBalance,
          opt_type: '充值'
        }

        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 2) {
        this.feeDialogTitle = '余额扣除'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '可用余额',
          balance: row.availableBalance,
          opt_type: '扣款'
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 3) {
        // 冻结金额 +
        this.feeDialogTitle = '增加冻结金额'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          opt_type: '冻结'
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogTitle = '减少冻结金额'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          opt_type: '解冻 '
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 5) {
        // 预付商户金额  +
        this.feeDialogTitle = '增加预付商户金额'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '预付商户金额',
          balance: row.availableBalance,
          opt_type: '增加 '
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      } else if (type == 6) {
        // 预付商户金额 -
        this.feeDialogTitle = '减少预付商户金额'
        let ttt = {
          userName: row.userName,
          userNickName: row.userNickName,
          banlance_type: '预付商户金额',
          balance: row.availableBalance,
          opt_type: '减少 '
        }
        this.feeChangeFormData = Object.assign(this.feeChangeFormData, ttt)
      }

      this.feeChangeFormData = {
        ...this.feeChangeFormData,
        changeAmount: '',
        tradePassword: ''
      }

      console.log(JSON.stringify(this.feeChangeFormData))
    },
    onFeeDialogBtnCancel() {
      this.$refs.feeChangeFormDataRef.resetFields()
      this.feeDialogVisible = false
    },
    checkMountNumber(type, balance, changeAmount) {
      if (
        (type == 1 || type == 5 || type == 3) &&
        (balance + changeAmount > '999999999999.99' || balance + changeAmount < '-999999999999.99')
      ) {
        //充值
        //变动后金额
        this.$message.error(
          '变动后金额不能超过最大值999999999999.99,不能低于最小值-999999999999.99'
        )
        return false
      }
      if (
        (type == 2 || type == 6 || type == 4) &&
        (balance - changeAmount > '999999999999.99' || balance - changeAmount < '-999999999999.99')
      ) {
        //扣款
        //变动后金额
        this.$message.error(
          '变动后金额不能超过最大值999999999999.99,不能低于最小值-999999999999.99'
        )
        return false
      }
    },
    onFeeDialogBtnOk() {
      this.$refs.feeChangeFormDataRef.validate(async (valid) => {
        if (valid) {
          let changeAmount = Number(this.feeChangeFormData.changeAmount)
          let balance = Number(this.feeChangeFormData.balance)
          let collectDeposit = Number(this.feeChangeFormData.collectDeposit)
          let freezeBalance = Number(this.feeChangeFormData.freezeBalance)

          if (this.feeChangeType == 1 || this.feeChangeType == 2) {
            if (this.checkMountNumber(this.feeChangeType, balance, changeAmount) == false) {
              return
            }
            //  余额
            await adjustAvailableBalance({
              userId: this.feeChangeFormData.userId,
              businessType: 2,
              changeType: this.feeChangeType == 1 ? 0 : 1, // 账变类型（0-充值、1-扣款）
              changeAmount: Number(this.feeChangeFormData.changeAmount),
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
          } else if (this.feeChangeType == 3 || this.feeChangeType == 4) {
            if (this.checkMountNumber(this.feeChangeType, freezeBalance, changeAmount) == false) {
              return
            }
            await adjustFreezeBalance({
              userId: this.feeChangeFormData.userId,
              businessType: 2,
              changeType: this.feeChangeType == 3 ? 10 : 11, // 账变类型（10-冻结、11-解冻）
              changeAmount: Number(this.feeChangeFormData.changeAmount),
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
          } else if (this.feeChangeType == 5 || this.feeChangeType == 6) {
            if (this.checkMountNumber(this.feeChangeType, collectDeposit, changeAmount) == false) {
              return
            }
            await adjustDepositAmount({
              userId: this.feeChangeFormData.userId,
              businessType: 2,
              changeAmount: Number(this.feeChangeFormData.changeAmount),
              operationType: this.feeChangeType == 5 ? 1 : 0, // 操作类型（0-减少，1-增加）
              tradePassword: this.feeChangeFormData.tradePassword,
              remark: this.feeChangeFormData.remark
            })
          }
          this.$message.success('操作成功')
          this.onFeeDialogBtnCancel()
          this.flushPage()
        }
      })
    },
    async batchSettle(isAll) {
      try {
        await this.$confirm(`您确定对${isAll ? '所有' : '选中'}商户进行结算吗?`, '提示', {
          type: 'warning'
        })

        if (isAll) {
          await settleAll({
            tenantId: this.$store.state.tenant.selectTenantId
          })
        } else {
          await batchSettlement(this.selectionRows.map((item) => item.merchantId))
        }

        this.$message.success('结算成功')
        this.flushPage()
      } catch (e) {
        console.log(e)
      }
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确定删除用户 【 ${row.userNickName} 】 吗？`)
        await deleteMerchant(row.merchantId, {
          // tenantId: this.$store.state.tenant.selectTenantId
        })
        this.$message.success('删除成功')
        this.flushPage()
        this.updateMerchantList()
      } catch (e) {
        console.log('取消删除', e)
      }
    },
    async showConfirmSettle(row) {
      try {
        await this.$confirm(`确定对 【 ${row.userNickName} 】进行结算吗？`)
        await settleMerchant(row.merchantId)
        this.$message.success('结算成功')
        this.flushPage()
      } catch (e) {
        console.log('取消结算')
      }
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      // row.merchantAgentId = row.merchantAgentId == '0' ? '' : row.merchantAgentId
      let linshi = {
        ...row,
        merchant_key: '********',
        login_code: '********',
        google_key: '********'
      }
      this.oldFormData = Object.assign({}, row)
      this.formData = Object.assign({}, linshi)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        isActive: 1,
        merchantAgentId: 0,
        merchantPacket: 0,
        isManualCreateOrderEnable: 0
      }
      if (this.allMerchantAgentList.length == 0) {
        getMerchantAgentList({
          tenantId: this.$store.state.tenant.selectTenantId
        }).then((res) => {
          console.log('----getMerchantAgentList------')
          console.log(res)
          this.allMerchantAgentList = res.data
        })
      }
    },
    onDialogBtnCancel() {
      this.$refs.formRef.resetFields()
      this.dialogVisible = false
    },
    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            // 编辑
            await updateMerchant({
              // tenantId: this.$store.state.tenant.selectTenantId,
              merchantId: this.formData.merchantId,
              userNickName: this.formData.userNickName,
              merchantAgentId: this.formData.merchantAgentId,
              merchantPacket: this.formData.merchantPacket,
              isManualCreateOrderEnable: this.formData.isManualCreateOrderEnable,
              // this.formData.merchantAgentId == '0' ? null : this.formData.merchantAgentId,
              isActive: this.formData.isActive,
              groupId: this.formData.groupId
            })
            this.$message.success('修改完成')
          } else {
            // 新增
            await createMerchant({
              ...this.formData,
              tenantId: this.$store.state.tenant.selectTenantId,
              merchantAgentId: this.formData.merchantAgentId
              // this.formData.merchantAgentId == '0' ? null : this.formData.merchantAgentId
            })
            this.$message.success('新增完成')
          }

          this.onDialogBtnCancel()
          this.flushPage()
          this.updateMerchantList()
        }
      })
    },

    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          // if (key == 'createTime') {
          //   params['startTime'] = this.queryFormData['createTime'][0]
          //   params['endTime'] = this.queryFormData['createTime'][1]
          // } else {
          params[key] = this.queryFormData[key]
          // }
        }
      })

      let res = await merchantAgentPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    queryTableData() {
      // 刷新表格

      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.getMerchantSum()
        }
      })
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.flushPage()
      this.$refs.queryFormDataRef.resetFields()
    },
    getQueryForm() {
      return {
        isActive: '',
        merchantId: '',
        merchantPacket: ''
      }
    },
    /**
     * 在初始时，新增， 删除 ，更新时， 复制完后， 调用此方法
     */
    updateMerchantList() {
      getMerchantList({
        tenantId: this.$store.state.tenant.selectTenantId
      }).then((res) => {
        console.log(res)
        this.allMerchantList = res.data
      })
    },
    flushData() {
      // 获得商户代理列表
      getMerchantAgentList({
        tenantId: this.$store.state.tenant.selectTenantId
      }).then((res) => {
        console.log('----getMerchantAgentList------')
        console.log(res)
        this.allMerchantAgentList = res.data
      })
      // 获得商户列表
      this.updateMerchantList()
      this.getChannelByTenantId()
    },
    async getChannelByTenantId() {
      // 获得当前的所有通道
      getChannelByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.allChannelList = res.data
        }
      })
    }
  },
  mounted() {
    this.flushData()
    this.getMerchantSum()
  }
}
</script>

<style lang="scss" scoped>
::v-deep td.balance {
  .cell {
    // background-color: pink;
    height: 90px;
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

.request {
  padding: 0 20px;

  h3 {
    text-align: center;
  }

  .req-line {
    margin-top: 5px;
    display: flex;
    align-items: center;
    line-height: 20px;

    .req-label {
      width: 140px;
      margin-left: 15px;
      font-size: 14px;
      font-weight: bold;
      text-align: right;
      padding-right: 10px;
    }

    .req-value {
      flex: 1;
    }
  }
}
::v-deep .el-dropdown {
  font-size: 12px;
}
</style>
