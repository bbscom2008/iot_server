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
        <el-form-item label="平台名称" prop="tenantName">
          <el-input v-model="queryFormData.tenantName" placeholder="请输入平台名称" size="small" />
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-select filterable v-model="queryFormData.isActive" placeholder="请选择" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" prop="">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            unlink-panels
            :picker-options="myPickerOptionsAll"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            align="right"
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
      <el-button
        :disabled="selectionRows.length == 0"
        icon="el-icon-edit-outline"
        size="mini"
        plain
        type="warning"
        @click="patchModify(false)"
        >批量修改</el-button
      >
      <el-button
        icon="el-icon-edit-outline"
        size="mini"
        plain
        type="success"
        @click="patchModify(true)"
        >全部修改</el-button
      >

      <el-button
        icon="el-icon-edit-outline"
        size="mini"
        type="success"
        @click="querylastLoginTime()"
        >获得最近登陆时间</el-button
      >


      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="loadTableData"
        :tableData="tableData"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="60" />
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="账号" align="center" prop="userName" />
        <el-table-column label="管理员名称" align="center" prop="userNickName" />
        <el-table-column label="平台ID" align="center" prop="tenantId" />
        <el-table-column label="平台名称" align="center" prop="tenantName" />
        <el-table-column label="收银台域名" align="center" prop="configValue">
          <template slot-scope="{ row }">
            {{ row.configValue }}
          </template>
        </el-table-column>

        <el-table-column
          class-name="balance"
          label="可用余额"
          align="center"
          sortable
          :sort-method="balanceSort"
          min-width="100px"
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
        <el-table-column
          class-name="balance"
          label="冻结金额"
          align="center"
          min-width="100px"
          prop="freezeBalance"
        >
          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.freezeBalance) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 3)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 4)">-</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="过期时间" align="center" prop="expireTime">
          <template slot-scope="{ row }">
            {{ row.expireTime }}
          </template>
        </el-table-column>

        <el-table-column label="是否启用" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="switchEnable(row)" />
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column label="创建时间" align="center" prop="createTime" width="85">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间" align="center" prop="updateTime" width="85">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column label="最近登陆时间" align="center" prop="lastLoginTime" width="85">
          <template slot-scope="{ row }">
            {{ row.lastLoginTime }}
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

        <el-table-column align="center" label="操作" width="220" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-edit" />配置产品类型
              </div>

              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>

              <div type="success" class="btn" @click="showUrlManage(row)">
                <i class="el-icon-brush" />域名管理
              </div>

              <div type="success" class="btn" @click="showResetPassword(row, 1)">
                <i class="el-icon-brush" />重置登录密码
              </div>
              <div type="success" class="btn" @click="showResetPassword(row, 2)">
                <i class="el-icon-brush" />重置谷歌密钥
              </div>
              <div type="success" class="btn" @click="showResetPassword(row, 3)">
                <i class="el-icon-brush" />重置交易密码
              </div>
              <div type="success" class="btn" @click="unlockUser(row)">
                <i class="el-icon-unlock" />解锁
              </div>
              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5 red" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>


              <!-- <el-dropdown trigger="click">
                <div type="success" class="btn">更多 <i class="el-icon-caret-bottom" /></div>
                <el-dropdown-menu slot="dropdown">
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
                      <i class="el-icon-brush" />重置交易密码
                    </div>
                  </el-dropdown-item>

                  <el-dropdown-item>
                    <div type="success" class="btn" @click="unlockUser(row)">
                      <i class="el-icon-unlock" />解锁
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
      @close="onBtnCancel()"
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改平台' : '新增平台'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item
          label="平台账号"
          :prop="isEdit ? '' : 'userName'"
          :rules="isEdit ? [] : userNameRule"
        >
          <el-input v-model="formData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="平台名称" prop="tenantName">
          <el-input v-model="formData.tenantName" placeholder="请输入平台名称" size="small" />
        </el-form-item>

        <el-form-item label="管理员名称" prop="userNickName">
          <el-input v-model="formData.userNickName" placeholder="请输入管理员名称" size="small" />
        </el-form-item>

        <!-- <el-form-item label="平台域名" prop="tenantDomain">
          <el-input v-model="formData.tenantDomain" placeholder="请输入平台域名" size="small" />
        </el-form-item> -->
        <el-form-item label="收银台域名" prop="cashPageDomainUrl">
          <el-select
            filterable
            v-model="formData.cashPageDomainUrl"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in cashPageDomainUrlList"
              :key="item.configKey"
              :label="item.configValue"
              :value="item.configKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择代理" prop="tenantAgentId">
          <el-select
            filterable
            v-model="formData.tenantAgentId"
            placeholder="请选择代理"
            size="small"
          >
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="item in allAgentList"
              :key="item.tenantAgentId"
              :label="item.userName"
              :value="item.tenantAgentId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="群组ID" prop="tenantGroupId">
          <el-input v-model="formData.tenantGroupId" placeholder="请输入群组ID" size="small" />
        </el-form-item>

        <el-form-item label="对象存储" prop="ossConfigId">
          <el-select
            filterable
            v-model="formData.ossConfigId"
            placeholder="请选择对象存储"
            size="small"
          >
            <el-option
              :label="item.ossName"
              :value="String(item.ossConfigId)"
              v-for="item in allObjSave"
              :key="String(item.ossConfigId)"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isEdit" label="PC端背景图" prop="" :rules="[]">
          <!-- :on-change="handleChange" -->
          <el-upload
            class="upload-demo"
            ref="upload"
            :before-upload="beforeAvatarUpload"
            action="#"
            :http-request="uploadImage"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :file-list="formData.pcBackImage"
            :limit="1"
            list-type="picture-card"
            :auto-upload="true"
          >
            <i
              v-if="!formData.pcBackImage || formData.pcBackImage.length == 0"
              class="el-icon-plus avatar-uploader-icon"
            ></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item v-if="isEdit" label="手机端背景图" prop="" :rules="[]">
          <!-- :on-change="handleChange2" -->
          <el-upload
            class="upload-demo"
            ref="upload"
            :before-upload="beforeAvatarUpload"
            action="#"
            :http-request="uploadImage"
            :on-success="handleSuccess2"
            :on-remove="handleRemove2"
            :on-exceed="handleExceed"
            :file-list="formData.appBackImage"
            :limit="1"
            list-type="picture-card"
            :auto-upload="true"
          >
            <i
              v-if="!formData.appBackImage || formData.appBackImage.length == 0"
              class="el-icon-plus avatar-uploader-icon"
            ></i>

            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="formData.expireTime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onPatchModifyBtnCancel()"
      :visible.sync="patchModifyVisible"
      :title="isModifyAll ? '全部修改' : '批量修改'"
      width="600px"
    >
      <el-form
        ref="modifyAllFormRef"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="收银台域名" prop="cashPageDomainUrl"
          :rules="[{ required: true, message: '请选择收银台域名', trigger: 'change' }]"
        >
          <el-select
            filterable
            v-model="formData.cashPageDomainUrl"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in cashPageDomainUrlList"
              :key="item.configKey"
              :label="item.configValue"
              :value="item.configKey"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="对象存储" prop="ossConfigId">
          <el-select
            filterable
            v-model="formData.ossConfigId"
            placeholder="请选择对象存储"
            size="small"
          >
            <el-option
              :label="item.ossName"
              :value="String(item.ossConfigId)"
              v-for="item in allObjSave"
              :key="String(item.ossConfigId)"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="onPatchModifyBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchModifyBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="`配置 【 ${formData.tenantName} 】 的产品类型`"
      width="1000px"
    >
      <div v-if="peizhiDialogVisible" style="max-height: 600px; overflow: auto">
        <Peizhi :currItem="formData" :parentVisible="peizhiDialogVisible"></Peizhi>
      </div>
      <!-- <div slot="footer">
        <el-button @click="peizhiDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="peizhiDialogVisible = false" size="small">
          确定
        </el-button>
      </div> -->
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
        label-width="120px"
        :rules="rules"
        style="margin-right: 100px"
      >
        <el-form-item label="平台名称" prop="userNickName">
          <el-input
            v-model="feeChangeFormData.userNickName"
            :disabled="true"
            placeholder="请输入平台名称"
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

        <el-form-item label="操作类型" prop="operationType">
          <el-input v-model="feeChangeFormData.operationType" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" prop="amount">
          <el-input
            v-number-input
            type="number"
            v-model="feeChangeFormData.amount"
            placeholder="请输入金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="交易密码" prop="tradePassword">
          <el-input
            type="password"
            show-password
            v-model="feeChangeFormData.tradePassword"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="feeChangeFormData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onFeeDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onFeeDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onCopyDialogCancel()"
      :visible.sync="showCopyDialogVisable"
      title="复制平台"
      width="600px"
    >
      <el-form
        ref="formRefCopy"
        :rules="rules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="平台账号" prop="userName" :rules="userNameRule">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="平台名称" prop="tenantName">
          <el-input v-model="copyFormData.tenantName" placeholder="请输入平台名称" size="small" />
        </el-form-item>
        <el-form-item label="管理员名称" prop="userNickName">
          <el-input
            v-model="copyFormData.userNickName"
            placeholder="请输入管理员名称"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="平台域名" prop="tenantDomain">
          <el-input v-model="copyFormData.tenantDomain" placeholder="请输入平台域名" size="small" />
        </el-form-item> -->
        <el-form-item label="对象存储" prop="ossConfigId">
          <el-select
            filterable
            v-model="copyFormData.ossConfigId"
            placeholder="请选择对象存储"
            size="small"
          >
            <el-option
              :label="item.ossName"
              :value="String(item.ossConfigId)"
              v-for="item in allObjSave"
              :key="String(item.ossConfigId)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租户模板" prop="tenantTemplateId">
          <el-select
            filterable
            v-model="copyFormData.tenantTemplateId"
            placeholder="请选择租户模板"
            size="small"
          >
            <el-option
              :label="item.tenantName"
              :value="item.tenantId"
              v-for="item in tenantList"
              :key="item.tenantId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCopyDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCopyDialogOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      @close="onUrlDialogCancel()"
      :visible.sync="urlDialogVisable"
      title="域名管理"
      width="600px"
    >
      <el-form
        ref="urlFormDataRef"
        :rules="rules"
        :model="urlFormData"
        label-position="right"
        label-width="140px"
        style="margin-right: 100px"
      >
        <el-form-item label="平台账号" prop="">
          <el-input
            v-model="urlFormData.userName"
            disabled
            placeholder="请输入平台账号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="平台名称" prop="">
          <el-input
            v-model="urlFormData.tenantName"
            disabled
            placeholder="请输入平台名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="平台域名" prop="platformUrl">
          <el-input
            type="textarea"
            :rows="3"
            v-model="urlFormData.platformUrl"
            placeholder="请输入平台域名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商户代理域名" prop="merchantAgentUrl">
          <el-input
            type="textarea"
            :rows="3"
            v-model="urlFormData.merchantAgentUrl"
            placeholder="请输入商户代理域名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="商户域名" prop="merchantUrl">
          <el-input
            type="textarea"
            :rows="3"
            v-model="urlFormData.merchantUrl"
            placeholder="请输入商户域名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="码商PC端域名" prop="serverUrl">
          <el-input
            type="textarea"
            :rows="3"
            v-model="urlFormData.serverUrl"
            placeholder="请输入码商PC端域名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="码商手机端域名" prop="serverMobileUrl">
          <el-input
            type="textarea"
            :rows="3"
            v-model="urlFormData.serverMobileUrl"
            placeholder="请输入手机端域名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="支付网关" prop="paymentGateway">
          <el-input
            type="textarea"
            :rows="3"
            v-model="urlFormData.paymentGateway"
            placeholder="请输入支付网关"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onUrlDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onUrlDialogOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="user_info_dialog" top="5vh" title="开户信息" width="600px">
      <div style="margin-left: 10px">
        <div class="request">
          <h3>基本信息</h3>
          <div class="req-line">
            <span class="req-label">账号</span>
            <span class="req-value">
              <el-input :value="user_info.userName" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">初始登录密码</span>

            <span class="req-value">
              <el-input :value="user_info.initialLoginPassword" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">平台管理后台</span>
            <span class="req-value">
              <el-input :value="user_info.platformUrl" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">商户管理后台</span>
            <span class="req-value">
              <el-input :value="user_info.merchantUrl" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">码商端管理后台（PC端）</span>
            <span class="req-value">
              <el-input :value="user_info.serverUrl" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">码商端管理后台（手机端）</span>
            <span class="req-value">
              <el-input :value="user_info.serverMobileUrl" disabled></el-input>
            </span>
          </div>
          <h3>代收相关</h3>
          <div class="req-line">
            <span class="req-label">下单网关</span>
            <span class="req-value">
              <el-input :value="user_info.payUrl" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">订单查询网关</span>
            <span class="req-value">
              <el-input :value="user_info.queryUrl" disabled></el-input>
            </span>
          </div>

          <h3>代付相关</h3>
          <div class="req-line">
            <span class="req-label">代付统一下单</span>
            <span class="req-value">
              <el-input :value="user_info.payPayUrl" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">代付订单查询</span>
            <span class="req-value">
              <el-input :value="user_info.queryPayUrl" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">商户信息查询</span>
            <span class="req-value">
              <el-input :value="user_info.queryMerchantUrl" disabled></el-input>
            </span>
          </div>

          <H3>api 相关</H3>

          <div class="req-line">
            <span class="req-label">文档</span>
            <span class="req-value">
              <el-input :value="user_info.apiDocUrl" disabled></el-input>
            </span>
          </div>
          <div class="req-line">
            <span class="req-label">回调IP</span>
            <span class="req-value">
              <el-input :value="user_info.callbackIp" disabled></el-input>
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
        <el-button type="success" size="small" style="margin-right: 30px" @click="copyInfo"
          >复制</el-button
        >
        <el-button @click="user_info_dialog = false" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="reset_password_dialog"
      :title="
        resetPwdType == 1 ? '重置登录密码' : resetPwdType == 2 ? '重置谷歌密钥' : '重置交易密码'
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
            <!-- <el-button size="small" class="el_btn" @click="resetPassword()">重置</el-button> -->
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
            <!-- <el-button size="small" class="el_btn" @click="resetPassword()">重置</el-button> -->
          </div>
        </el-form-item>
        <el-form-item label="交易密码" prop="tradePwd" v-if="resetPwdType == 3">
          <div class="line">
            <el-input
              v-model="formDataPassword.tradePwd"
              placeholder="请输入交易密码"
              size="small"
              disabled
            />
            <!-- <el-button size="small" class="el_btn" @click="resetPassword()">重置</el-button> -->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="success" @click="resetPassword()">重置</el-button>

        <el-button type="primary" @click="closeResetPassword()" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Peizhi from './tenant-setting.vue'

import { tenantRules, queryRules } from './rules.js'

import { imageUploadServer } from '@/settings'

import { getFileById, uploadFileToServer } from '@/api/upload'

import handleClipboard from '@/utils/clipboard'

import { getAllObjSave } from '@/api/obj-save.js'
import { getAllTenantAgentList } from '@/api/tenant-agent'
import {
  getTenantPage,
  getTenantInfoById,
  addTenant,
  copyTenant,
  getTenantById,
  updateTenant,
  deleteTenantById,
  isEnableTenant,
  resetTenantGoogleAuthKey,
  resetTenantSecretKey,
  resetTradePassword,
  adjustAvailableBalance,
  adjustFreezeBalance,
  updateTenantDomainPage,
  getTenantDomainInfo,
  updatePatchTenantInfo,
  getTenantConfigList,
  isExistTenantUserName,
  isExistTenantName
} from '@/api/tenant-manager'
import { systemUserIsLock, getLoginLogPage } from '@/api/system-manager'
import { patchUnlockUser } from '@/api/service-list.js'

import { userName, rulesName } from '@/utils/validate'
import { formatDateTime } from '@/utils'
export default {
  components: {
    Peizhi
  },

  name: 'TenantManager',
  data() {
    const isNameOnly = async (rule, value, callback) => {
      let ret = await isExistTenantUserName(value)
      if (ret.data) {
        callback(new Error('账号已存在'))
      } else {
        callback()
      }
    }
    const isNickNameOnly = async (rule, value, callback) => {
      console.log(value, 'valuevaluevaluevaluevalue')
      let ret = await isExistTenantName(this.rowTenantId == '' ? '0' : this.rowTenantId, {
        tenantName: value
      })
      if (ret.data) {
        callback(new Error('平台名称已存在'))
      } else {
        callback()
      }
    }
    return {
      selectionRows: [],
      queryRules: queryRules,
      rowTenantId: '',
      userNameRule: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userName,
        { validator: isNameOnly, trigger: 'blur' }
      ],
      userNickNameRule: [
        { required: true, message: '请输入平台名称', trigger: 'blur' },
        ...rulesName,
        { validator: isNickNameOnly, trigger: 'blur' }
      ],
      pcBackImageRule: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!this.formData.pcBackImage || this.formData.pcBackImage.length === 0) {
              callback(new Error('请上传图片'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      appBackImageRule: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!this.formData.appBackImage || this.formData.appBackImage.length === 0) {
              callback(new Error('请上传图片'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],

      imageUploadServer,
      rules: tenantRules,
      showCopyDialogVisable: false,
      copyFormData: {},

      code: '',
      tableData: [],
      allAgentList: [],
      dialogVisible: false,
      peizhiDialogVisible: false, // 配置对话框
      feeDialogVisible: false, // 增减余额对话框
      feeChangeFormData: {},
      cashPageDomainUrlList: [],
      feeDialogTitle: '默认标题',
      formData: {
        isActive: 1
      },
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态
      showCopyBtn: false,
      // 添加扩展数据，如 options 所需要的数据
      user_info_dialog: false,
      user_info: {},
      formDataPassword: {
        login_code: '',
        google_key: '',
        tradePwd: ''
      },
      reset_password_dialog: false,
      tenantList: [],
      feeChangeFormRules: {
        amount: [
          { required: true, message: '请输入大于0的整数，最多保留2位小数', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value <= 0) {
                callback(new Error('请输入大于0的整数，最多保留2位小数'))
              } else {
                callback()
              }
            }
          }
        ],
        tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }]
      },

      allObjSave: [], // 所有的对象保存

      urlDialogVisable: false, // 查看url的对话框
      urlFormData: {},
      resetPwdType: 1,
      patchModifyVisible: false,
      isModifyAll: false
    }
  },
  methods: {
    balanceSort(a,b){
      return a.availableBalance - b.availableBalance
    },
    onPatchModifyBtnOk() {

      this.$refs.modifyAllFormRef.validate(async (valid) => {
        if (valid) {
          // 全部修改 空数组
          let tenantIds = []
          if (!this.isModifyAll) {
            // 批量修改
            this.selectionRows.forEach((item) => {
              tenantIds.push(item.tenantId)
            })
          }
          try {
            await updatePatchTenantInfo({
              tenantIds: tenantIds,
              cashPageDomainUrl: this.formData.cashPageDomainUrl
              // ossConfigId: this.formData.ossConfigId
            })

            this.$message.success('修改成功')
            this.onPatchModifyBtnCancel()
            this.flushPage()
          } catch (e) {
            console.log(e)
          }
        }
      })



    },
    onPatchModifyBtnCancel() {
      this.$refs.modifyAllFormRef.resetFields()
      this.patchModifyVisible = false
    },
    patchModify(isAll) {
      this.isModifyAll = isAll
      this.patchModifyVisible = true
      this.formData = {
        cashPageDomainUrl: ''
        // ossConfigId: ''
      }
    },
    handleSelectionChange(val) {
      this.selectionRows = val
    },
    async querylastLoginTime() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message.info('无可用平台数据')
        return
      }

      try {
        const promises = this.tableData.map((row) => {
          if (!row || !row.tenantId) return Promise.resolve(null)
          return getLoginLogPage({ tenantId: row.tenantId }, { pageNum: 1, pageSize: 1 })
        })

        const results = await Promise.all(promises)

        results.forEach((res, idx) => {
          const row = this.tableData[idx]
          if (!row) return
          if (res && res.data && Array.isArray(res.data.list) && res.data.list.length > 0) {
            row.lastLoginTime = res.data.list[0].lastLoginTime 
          } else {
            row.lastLoginTime = ''
          }
        })
        this.$forceUpdate()
        this.$message.success('已更新最近登录时间')
      } catch (e) {
        console.error(e)
        this.$message.error('获取最近登录时间失败')
      }
    },
    copyPassword(e) {
      handleClipboard(`${this.formDataPassword.login_code}`, e)
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
    async uploadImage(action) {
      try {
        console.log('----uploadImage------', action)
        let res = await uploadFileToServer(action.file)
        console.log('uploadImage - ', res)
        return res
      } catch (e) {
        console.log(e)
      }
    },
    async handleSuccess(response, file, fileList) {
      console.log('-handleSuccess-- ', response)

      if (response && response.data) {
        this.formData.pcBackImage = fileList

        fileList[0].fileId = response.data
        this.formData.pcBackImageFileId = response.data
      } else {
        console.error('上传文件出错，', response)

        this.formData.pcBackImage = []
      }
    },
    async handleSuccess2(response, file, fileList) {
      console.log('-handleSuccess2-- ', response)

      if (response && response.data) {
        this.formData.appBackImage = fileList

        fileList[0].fileId = response.data
        this.formData.appBackImageFileId = response.data
      } else {
        console.error('上传文件出错，', response)

        this.formData.appBackImage = []
      }
    },

    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    },
    showUrlManage(row) {
      this.urlDialogVisable = true
      // 登录端类型（0-租户、1-商户代理、2-商户、3-码商、4-码商手机端）

      getTenantDomainInfo(row.tenantId).then((res) => {
        console.log(res)
        this.urlFormData = {
          userName: row.username,
          tenantName: row.tenantName,
          ...res.data
        }
      })
    },
    async getTenantConfigList() {
      let res = await getTenantConfigList(this.$store.state.tenant.currTenantId)
      this.cashPageDomainUrlList = res.data
      console.log(res, 'res==')
    },
    onUrlDialogCancel() {
      this.$refs.urlFormDataRef.resetFields()
      this.urlDialogVisable = false
    },
    onUrlDialogOk() {
      this.$refs.urlFormDataRef.validate(async (valid) => {
        if (valid) {
          await updateTenantDomainPage({
            tenantId: this.urlFormData.tenantId,
            platformUrl: this.urlFormData.platformUrl,
            merchantAgentUrl: this.urlFormData.merchantAgentUrl,
            merchantUrl: this.urlFormData.merchantUrl,
            serverUrl: this.urlFormData.serverUrl,
            serverMobileUrl: this.urlFormData.serverMobileUrl,
            paymentGateway: this.urlFormData.paymentGateway
          })

          this.$message.success('修改成功')
          this.onUrlDialogCancel()
          this.flushPage()
        }
      })
    },
    closeResetPassword() {
      this.reset_password_dialog = false
      this.showCopyBtn = false
    },
    async resetPassword(type) {
      if (this.resetPwdType == 1) {
        // 登录密码
        let res = await resetTenantSecretKey(this.userId)
        this.$message.success('密码重置成功')
        this.showCopyBtn = true
        this.formDataPassword.login_code = res.data
      } else if (this.resetPwdType == 2) {
        // 谷歌密钥
        await resetTenantGoogleAuthKey(this.userId)
        this.$message.success('谷歌密钥重置成功')
      } else {
        // 交易密码
        await resetTradePassword(this.userId)
        this.$message.success('交易密码重置成功')
      }

      // this.$message({
      //   message: '重置成功',
      //   type: 'success',
      //   duration: 1500
      // })
    },
    async switchEnable(row) {
      try {
        let res = await isEnableTenant(row.tenantId, row.isActive)
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.flushPage()
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
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

      let res = await getTenantPage(params, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    queryTableData() {
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
        }
      })
    },

    onCopyDialogCancel() {
      this.showCopyDialogVisable = false
      this.$refs.formRefCopy.resetFields()
    },
    onCopyDialogOk() {
      this.$refs.formRefCopy.validate(async (valid) => {
        if (valid) {
          let res = await copyTenant(this.copyFormData)

          // 弹出提示 成功
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1500
          })

          this.onCopyDialogCancel()
          // 刷新
          this.$refs.tableRef.getTableData(1)
        }
      })
    },

    handleChange(file, fileList) {
      console.log('----handleChange------', fileList)
      this.formData.pcBackImage = fileList
      // 校验 上传
      this.$refs.formRef.validateField('pcBackImage')
    },

    handleExceed(file, fileList) {
      console.log('----handleExceed------', fileList)
      this.$message({
        message: '最多只能选择1张图片',
        type: 'error'
      })
    },

    handleRemove(file, fileList) {
      console.log('----handleRemove------', fileList)
      this.formData.pcBackImage = fileList
      // console.log(file, fileList)
      // this.formData.pcBackImage = fileList.map((item) => {
      //   item.url = item.response ? item.response[0] : ''
      //   return item
      // })
    },

    handleChange2(file, fileList) {
      console.log('----handleChange------')
      this.formData.appBackImage = fileList
      // this.formData.appBackImage = fileList.slice(-3).map((item) => {
      //   item.url = item.response ? item.response[0] : ''
      //   return item
      // })
      // 校验 上传
      this.$refs.formRef.validateField('appBackImage')
    },

    handleRemove2(file, fileList) {
      console.log('----handleRemove------')
      this.formData.appBackImage = fileList
      // console.log(file, fileList)
      // this.formData.appBackImage = fileList.map((item) => {
      //   item.url = item.response ? item.response[0] : ''
      //   return item
      // })
    },

    showResetPassword(row, type) {
      console.log('重置密码')
      this.resetPwdType = type
      this.userId = row.userId

      this.formDataPassword = {
        login_code: '********',
        google_key: '********',
        tradePwd: '********'
      }
      this.reset_password_dialog = true
    },

    async showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      let res = await getTenantInfoById(row.tenantId)
      this.user_info = res.data
    },
    copyInfo(e) {
      //       码商端管理后台（手机端）
      // ${this.user_info.serverMobileUrl}
      handleClipboard(
        `基本信息:
    账号
    ${this.user_info.userName}
    初始登录密码
    ${this.user_info.initialLoginPassword}
    平台管理后台
    ${this.user_info.platformUrl}
    商户管理后台
    ${this.user_info.merchantUrl}
    码商端管理后台（PC端）
    ${this.user_info.serverUrl}
    码商端管理后台（手机端）
    ${this.user_info.serverMobileUrl}

代收相关:
    下单网关
    ${this.user_info.payUrl}
    订单查询网关
    ${this.user_info.queryUrl}

代付相关:
    代付统一下单
    ${this.user_info.payPayUrl}
    代付订单查询
    ${this.user_info.queryPayUrl}
    商户信息查询
    ${this.user_info.queryMerchantUrl}

api 相关
    文档
    ${this.user_info.apiDocUrl}
    回调IP
    ${this.user_info.callbackIp}

说明：（主要针对账号安全设定）
    1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
    2、若开户后忘记临时密码需要跟后台申请重置
    3、初次登录后，请及时设置交易密码`,
        e
      )
    },
    async showConfirmDelete(row) {
      try {
        await this.$confirm(`确认删除当前平台 【 ${row.tenantName} 】`)

        let res = await deleteTenantById(row.tenantId, { userId: row.userId })
        console.log(res)
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 1500
        })

        // 刷新页面
        this.$refs.tableRef.getTableData()
      } catch (e) {
        console.log('取消删除')
      }
    },
    async showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.rowTenantId = row.tenantId
      let res = await getTenantById(row.tenantId)

      const pcImageId = res.data.pcBackImage // 服务器返回的图片id
      const appImageId = res.data.appBackImage // 服务器返回的图片id

      this.formData = res.data
      this.formData.tenantAgentId = res.data.tenantAgentId == null ? 0 : res.data.tenantAgentId // 如果没有，置为0
      this.formData.pcBackImage = [] // 先默认为空 ，然后再去获取图片
      this.formData.appBackImage = []
      this.formData.pcBackImageFileId = pcImageId
      this.formData.appBackImageFileId = appImageId

      console.log('pcImageId', pcImageId)
      console.log('-----pcBackImage----', res.data.pcBackImage)

      if (pcImageId) {
        getFileById(pcImageId).then((ret) => {
          this.formData = {
            ...this.formData,
            pcBackImage: [
              {
                url: ret.data.fileUrl,
                name: ret.data.originalName
              }
            ]
          }
        })
      }

      if (appImageId) {
        getFileById(appImageId).then((ret2) => {
          this.formData = {
            ...this.formData,
            appBackImage: [
              {
                url: ret2.data.fileUrl,
                name: ret2.data.originalName
              }
            ]
          }
        })
      }
    },
    showPeizhiDialog(row) {
      this.formData = Object.assign({}, row)
      this.peizhiDialogVisible = true
    },
    showAddDialog() {
      this.isEdit = false
      this.formData = {
        isActive: 1,
        expireTime: '',
        tenantAgentId: 0, // 0 无上级代理
        pcBackImage: [],
        appBackImage: []
      }
      this.dialogVisible = true
      this.getAllTenantAgentList()
      this.getTenantConfigList()
      this.getAllObjSave()
    },

    onBtnCancel() {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
      this.formData = {
        isActive: 1,
        pcBackImage: [],
        appBackImage: []
      }
    },

    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          // 校验成功
          console.log('---this.isEdit--' + this.isEdit)

          if (this.isEdit) {
            // 编辑

            let res = await updateTenant({
              userId: this.formData.userId,
              userName: this.formData.userName,
              tenantId: this.formData.tenantId,
              userNickName: this.formData.userNickName,
              tenantName: this.formData.tenantName,
              tenantGroupId: this.formData.tenantGroupId,
              // tenantDomain: this.formData.tenantDomain,
              cashPageDomainUrl: this.formData.cashPageDomainUrl,
              tenantAgentId: this.formData.tenantAgentId == 0 ? null : this.formData.tenantAgentId,
              expireTime: this.formData.expireTime,
              isActive: this.formData.isActive,
              pcBackImage: this.formData.pcBackImageFileId,
              appBackImage: this.formData.appBackImageFileId,
              ossConfigId: this.formData.ossConfigId
              // pcBackImage: this.formData.pcBackImage[0].response // 有response 是新上传的
              //   ? this.formData.pcBackImage[0].response[0].url // 无 response 是服务器返回的
              //   : this.formData.pcBackImage[0].url,
              // appBackImage: this.formData.appBackImage[0].response
              //   ? this.formData.appBackImage[0].response[0].url
              //   : this.formData.appBackImage[0].url
            })
            console.log(res)
            this.$message.success('修改成功')
          } else {
            let res = await addTenant({
              userName: this.formData.userName,
              userNickName: this.formData.userNickName,
              tenantName: this.formData.tenantName,
              tenantGroupId: this.formData.tenantGroupId,
              // tenantDomain: this.formData.tenantDomain,
              cashPageDomainUrl: this.formData.cashPageDomainUrl,
              tenantAgentId: this.formData.tenantAgentId == 0 ? null : this.formData.tenantAgentId,
              ossConfigId: this.formData.ossConfigId,
              pcBackImage: this.formData.pcBackImageFileId,
              appBackImage: this.formData.appBackImageFileId,
              expireTime: this.formData.expireTime,
              isActive: this.formData.isActive
              // ...this.formData,
              // // pcBackImage: this.formData.pcBackImage[0].response[0].url,
              // // appBackImage: this.formData.appBackImage[0].response[0].url
            })
            console.log(res)
            this.$message.success('添加成功')
            this.$store.dispatch('tenant/getTenantList')
          }

          // 刷新页面
          this.onBtnCancel()
          this.flushPage()
        }
      })
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.queryTableData()
    },

    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let todayStr = formatDateTime(today)
      return {
        isActive: '',
        // createTime: [todayStr, nowStr]
        createTime: []
      }
    },

    showChangeFeeDialog(row, type) {
      console.log(row, 'row')
      this.feeDialogVisible = true
      // this.feeChangeFormData = Object.assign(this.feeChangeFormData, row)
      if (type == 1) {
        // 余额充值
        this.feeDialogTitle = '余额充值'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: '充值'
        }
      } else if (type == 2) {
        this.feeDialogTitle = '余额扣除'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: '扣款'
        }
      } else if (type == 3) {
        // 冻结金额 +
        this.feeDialogTitle = '增加冻结金额'

        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          operationType: '冻结'
        }
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogTitle = '减少冻结金额'
        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.freezeBalance,
          operationType: '解冻'
        }
      }
      this.feeChangeFormData.type = type
      this.feeChangeFormData.userId = row.userId
      this.feeChangeFormData.userName = row.userName
      this.feeChangeFormData.userNickName = row.tenantName
      this.feeChangeFormData.freezeBalance = row.freezeBalance
    },
    onFeeDialogBtnCancel() {
      this.feeDialogVisible = false
      this.$refs.feeChangeFormDataRef.resetFields()
    },
    checkMountNumber(type, balance, changeAmount) {
      if (
        (type == 1 || type == 3 || type == 5) &&
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
        (type == 2 || type == 4 || type == 6) &&
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
        if (!valid) {
          return
        }
        let changeAmount = Number(this.feeChangeFormData.amount)
        let balance = Number(this.feeChangeFormData.balance)
        let freezeBalance = Number(this.feeChangeFormData.freezeBalance)
        if (this.feeChangeFormData.type == '1' || this.feeChangeFormData.type == '2') {
          //可用余额
          let changeType = this.feeChangeFormData.operationType == '充值' ? 0 : 1
          if (this.checkMountNumber(this.feeChangeFormData.type, balance, changeAmount) == false) {
            return
          }
          // if (this.feeChangeFormData.operationType == '扣款') {
          //   if (Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance)) {
          //     this.$message.error('变动金额不能大于可用余额！')
          //     return
          //   }
          // }
          let res = await adjustAvailableBalance({
            userId: this.feeChangeFormData.userId,
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            changeType: changeType, // 账变类型（0-充值、1-扣款）
            changeAmount: Number(this.feeChangeFormData.amount),
            tradePassword: this.feeChangeFormData.tradePassword,
            remark: this.feeChangeFormData.remark
          })
          console.log(res, 'res')
        } else if (this.feeChangeFormData.type == '3' || this.feeChangeFormData.type == '4') {
          //冻结金额
          let changeType = this.feeChangeFormData.operationType == '冻结' ? 10 : 11
          if (
            this.checkMountNumber(this.feeChangeFormData.type, freezeBalance, changeAmount) == false
          ) {
            return
          }
          // if (
          //   Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance) &&
          //   this.feeChangeFormData.operationType == '冻结'
          // ) {
          //   this.$message.error('变动金额不能大于可用余额！')
          //   return
          // } else if (
          //   Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance) &&
          //   this.feeChangeFormData.operationType == '解冻'
          // ) {
          //   this.$message.error('变动金额不能大于冻结余额！')
          //   return
          // }
          let res = await adjustFreezeBalance({
            userId: this.feeChangeFormData.userId,
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            changeType: changeType, // 账变类型（0-充值、1-扣款）
            changeAmount: Number(this.feeChangeFormData.amount),
            tradePassword: this.feeChangeFormData.tradePassword,
            remark: this.feeChangeFormData.remark
          })
          console.log(res, 'res')
        }

        this.$message.success('修改成功')
        this.onFeeDialogBtnCancel()
        this.flushPage()
      })
    },

    async showCopyDialog() {
      this.showCopyDialogVisable = true
      this.copyFormData = {
        userName: '',
        tenantName: '',
        userNickName: '',
        // tenantDomain: '',
        ossConfigId: '',
        tenantTemplateId: ''
      }
      this.tenantList = await this.$store.dispatch('tenant/getTenantList')
    },
    // onCopyDialogBtnOk() {
    //   let obj = this.tableData.find((item) => {
    //     return item.id == this.copyFormData.copy_tenant_id
    //   })

    //   let newItem = Object.assign({}, obj)

    //   // console.log(JSON.stringify(newItem));

    //   newItem.username = this.copyFormData.username
    //   newItem.id = Date.now() + this.tableData.length

    //   this.tableData.push(newItem)
    //   this.showCopyDialogVisable = false
    // }
    async getAllTenantAgentList() {
      let res = await getAllTenantAgentList()
      this.allAgentList = res.data
    },
    async getAllObjSave() {
      let res = await getAllObjSave()
      this.allObjSave = res.data
    }
  },
  async mounted() {
    this.getAllTenantAgentList()
    this.getTenantConfigList()
    this.tenantList = await this.$store.dispatch('tenant/getTenantList')

    this.getAllObjSave()
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
      width: 185px;
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

::v-deep .upload-demo .el-upload--picture-card {
  width: auto;
  height: auto;
  border: none;
  line-height: 0;
  background-color: transparent;
  box-shadow: none;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid #ccc;
}
</style>
