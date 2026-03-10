<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormRef"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="账号" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="码商名称" prop="userNickName">
          <el-input
            v-model="queryFormData.userNickName"
            placeholder="请输入码商名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="码商级别" prop="level">
          <el-input
            v-model="queryFormData.level"
            placeholder="请输入码商级别"
            size="small"
          />
        </el-form-item>


        <el-form-item label="产品名称">
          <el-select
            filterable
            v-model="queryFormData.productId"
            placeholder="请选择产品名称"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in allProductList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="">
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

    <div v-if="isShowUi" class="report-summary">
      <div class="tool-box">
        <div class="btns">
          <el-button type="success" plain icon="el-icon-plus" @click="showAddDialog()"
            >新增</el-button
          >
          <el-button type="info" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
          <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()"
            >复制</el-button
          >

          <!-- 是否启用，，最大接单数 -->
          <el-button
            type="success"
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
            type="success"
            :disabled="selectionRows.length == 0"
            plain
            icon="el-icon-plus"
            @click="showPatchAddProductDialog(false)"
            >批量添加产品</el-button
          >
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="showPatchAddProductDialog(true)"
            >全部添加产品</el-button
          >

          <el-button type="primary" plain icon="el-icon-plus" @click="showPatchDialog(true, 1)"
            >全部修改一级码商</el-button
          >

          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            @click="showPatchAddProductDialog(true, 1)"
            >全部一级码商添加产品</el-button
          >

          <el-button type="danger" @click="clearAllBarence()"
            >清空所有余额（超管专用）</el-button
          >
          <el-button type="danger" @click="deleteAllprovide()"
            >删除所有码商（超管专用）</el-button
          >
        </div>

        <div class="item-box">
          <div class="item s1">
            码商总数<span class="value">{{ summaryData.totalCount }}</span>
          </div>
          <div class="item s2">
            可用余额总和(元) <span class="value">{{ summaryData.availableBalance }}</span>
          </div>

          <div class="item s4">
            冻结金额总和(元)
            <span class="value">{{ summaryData.freezeBalance }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-card class="mt-10">
      <!-- <div v-if="!isShowUi">
        <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()"
          >新增</el-button
        >
        <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
          >导出</el-button
        >
        <el-button type="primary" plain icon="el-icon-plus" @click="showCopyDialog()"
          >复制</el-button
        >

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
          @click="showPatchAddProductDialog(false)"
          >批量添加产品</el-button
        >
        <el-button type="primary" plain icon="el-icon-plus" @click="showPatchAddProductDialog(true)"
          >全部添加产品</el-button
        >
        <div class="tips mt-10">
          该平台下汇总:
          <span class="mr-10"
            >码商总数: {{ summaryData.totalCount ? summaryData.totalCount : 0 }}
          </span>
          <span class="mr-10"
            >可用余额总和: {{ summaryData.availableBalance ? summaryData.availableBalance : 0 }}
          </span>
          <span class="mr-10"
            >冻结金额总和: {{ summaryData.freezeBalance ? summaryData.freezeBalance : 0 }}
          </span>
        </div>
      </div> -->
      <my-table
        class="mt-10"
        :loadData="loadTableData"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="序号" align="center" type="index" min-width="60" />

        <el-table-column label="码商" align="center" prop="userName" min-width="130">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <el-tag type="success" class="mr-5">账号</el-tag> <span>{{ row.userName }}</span>
            </div>
            <div style="text-align: left" class="mt-5">
              <el-tag type="primary" class="mr-5">名称</el-tag> <span>{{ row.userNickName }}</span>
            </div>
            <div style="text-align: left">
              <el-tag type="info" class="mr-5">层级</el-tag>
              <span class="mr-5">{{ row.level }}级码商</span>
              <el-button type="text" @click="showLevelTree(row)">查看</el-button>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="码商名称" align="center" prop="userNickName" min-width="120" /> -->

        <!-- <el-table-column label="当前层级" align="center" min-width="80">
          <template slot-scope="{ row }">
            {{ row.level }}级 <el-button type="text" @click="showLevelTree(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <el-table-column
          class-name="balance"
          label="可用余额"
          align="center"
          prop="availableBalance"
          min-width="100"
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
          prop="freezeBalance"
          min-width="100"
        >
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
          min-width="100"
        >
          <template slot="header">
            <div>
              最低接单金额
              <el-tooltip
                class="item"
                effect="dark"
                content="相当于押金。匹配订单时，可用余额减去最低接单金额大于或等于订单金额才可以匹配成功。"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>

          <template slot-scope="{ row }">
            <div class="fee-box">
              <span class="val">{{ Number(row.minAllowableCollectAmount) }}</span>
              <span class="plus" @click="showChangeFeeDialog(row, 5)">+</span>
              <span class="sub" @click="showChangeFeeDialog(row, 6)">-</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="同时最大接单数量" align="center" min-width="80">
          <template slot="header">
            <div>
              同时最大接单数量
              <el-tooltip
                class="item"
                effect="dark"
                content="代收订单：码商单个收款信息同时可以接多少单；代付订单：一个码商同时可以接多少单。当前订单完成或者失败后，才可以接下一个订单。"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>

          <!-- <el-table-column label="代收接单数量" align="center" width="80">
            <template slot-scope="{ row }">
              {{ row.maxConcurrentCollectOrdersCount }}
            </template>
          </el-table-column>
          <el-table-column label="代付接单数量" align="center" width="80">
            <template slot-scope="{ row }">
              {{ row.maxConcurrentPaymentOrdersCount }}
            </template>
          </el-table-column> -->

          <template slot-scope="{ row }">
            <div
              v-if="
                row.maxConcurrentCollectOrdersCount == 0 && row.maxConcurrentPaymentOrdersCount == 0
              "
            >
              无限制
            </div>
            <template v-else>
              <div>
                代收:{{
                  row.maxConcurrentCollectOrdersCount == 0
                    ? '无限制'
                    : row.maxConcurrentCollectOrdersCount
                }}
              </div>
              <div>
                代付:{{
                  row.maxConcurrentPaymentOrdersCount == 0
                    ? '无限制'
                    : row.maxConcurrentPaymentOrdersCount
                }}
              </div>
            </template>
          </template>
        </el-table-column>

        <!-- <el-table-column label="解锁" align="center" min-width="90">
          <template slot-scope="{ row }">
            <el-button type="text" @click="unlockUser(row)" >解锁</el-button>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="是否启用" align="center" min-width="90">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isActive" @change="onSwitchChange(row)" />
          </template>
        </el-table-column> -->

        <el-table-column label="开启状态" align="center" min-width="140">
          <template slot-scope="{ row }">
            <div style="padding: 15px 0">
              <div>
                <!-- <el-tag type="danger">启用</el-tag> -->
                <el-switch
                  active-label="账户启用"
                  inactive-label="账户停用"
                  :width="80"
                  v-model="row.isActive"
                  @change="onSwitchChange(row)"
                />
              </div>
              <div class="mt-5">
                <!-- <el-tag type="primary">代收</el-tag > -->
                <el-switch
                  v-model="row.isCollectEnable"
                  active-label="代收开启"
                  inactive-label="代收关闭"
                  :width="80"
                  @change="onBussinessSwitchChange(row)"
                />
              </div>
              <div class="mt-5">
                <!-- <el-tag type="success">代付</el-tag> -->
                <el-switch
                  v-model="row.isPaymentEnable"
                  active-label="代付开启"
                  inactive-label="代付关闭"
                  :width="80"
                  @change="onBussinessSwitchChange(row)"
                />
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="开启代付" align="center" min-width="90">
          <template slot-scope="{ row }">
            <el-switch v-model="row.isPaymentEnable" @change="onBussinessSwitchChange(row)" />
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="码商权限" align="center">
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
        </el-table-column> -->

        <el-table-column label="时间" align="center" prop="createTime" min-width="180">
          <template slot-scope="{ row }">
            <div class="ta-l">
              <div>
                <el-tag type="primary">创建时间</el-tag>
                <span>{{ row.createTime }}</span>
              </div>

              <div class="mt-10">
                <el-tag type="info">更新时间</el-tag>
                <!-- <span v-html="row.updateTime.replace(' ', '<br/>')"></span> -->
                <span> {{ row.updateTime }} </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="备注信息" align="center" prop="remark" min-width="50" /> -->

        <!-- <el-table-column label="更新时间" align="center" prop="updateTime" min-width="90">
          <template slot-scope="{ row }">
            <span v-html="row.updateTime.replace(' ', '<br/>')"></span>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作" min-width="240" fixtt="right">
          <template slot-scope="{ row }">
            <div class="opt">
              <div type="success" class="btn" @click="showPeizhiDialog(row)">
                <i class="el-icon-setting" /> 配置产品
              </div>

              <div type="success" class="btn" @click="showResetPassword(row, 1)">
                <i class="el-icon-brush" />重置登录密码
              </div>
              <div type="success" class="btn" @click="unlockUser(row)">
                <i class="el-icon-unlock" />解锁
              </div>

              <div type="success" class="btn" @click="showBalanceDialog(row)">
                <i class="el-icon-thumb" /> 余额划拨
              </div>
              <div type="success" class="btn" @click="showResetPassword(row, 2)">
                <i class="el-icon-brush" />重置谷歌密钥
              </div>

              <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>

              <div type="success" class="btn" @click="showUserInfo(row)">
                <i class="el-icon-user" />开户信息
              </div>

              <div type="success" class="btn" @click="showResetPassword(row, 3)">
                <i class="el-icon-brush" />重置交易密码
              </div>

              <div type="primary" class="btn" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="onDialogCancel()"
      :title="isEdit ? '修改码商' : '新增码商'"
      width="650px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="150px"
        style="margin-right: 50px"
      >
        <el-form-item
          label="账号【建议用汉字】"
          prop="userName"
          :rules="isEdit ? {} : userNameRule"
        >
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

        <el-form-item label="选择上级码商" prop="parentId" v-if="!isEdit">
          <el-select
            filterable
            v-model="formData.parentId"
            placeholder="请选择上级码商"
            size="small"
            :disabled="isEdit ? true : false"
          >
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="item in serviceList"
              :label="item.userNickName"
              :value="item.providerId"
              :key="item.providerId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择上级码商" prop="parentId" v-if="isEdit">
          <el-select
            filterable
            v-model="formData.parentId"
            placeholder="请选择上级码商"
            size="small"
          >
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="item in editServiceList"
              :label="item.userNickName"
              :value="item.providerId"
              :key="item.providerId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="最大接单数（代收）" prop="maxConcurrentCollectOrdersCount">
          <el-input
            v-number-input-positive
            type="number"
            v-model="formData.maxConcurrentCollectOrdersCount"
            placeholder="同时最大代收接单数量"
            size="small"
          />
        </el-form-item>

        <el-form-item label="最大接单数（代付）" prop="maxConcurrentPaymentOrdersCount">
          <el-input
            v-number-input-positive
            type="number"
            v-model="formData.maxConcurrentPaymentOrdersCount"
            placeholder="同时最大代付接单数量"
            size="small"
          />
        </el-form-item>
        <div class="help-tip2" style="padding-left: 120px; margin-bottom: 20px">
          <span>
            最大接单数：一个码商同时最大可以接多少单，当前订单完成或者失败后，才可以接下一个订单，当设置为
            0 时，接单数量不受限制
          </span>
        </div>

        <el-form-item label="最小允许接单金额" prop="minAllowableCollectAmount">
          <el-input
            v-number-input
            type="number"
            v-model="formData.minAllowableCollectAmount"
            placeholder="请输入最小允许接单金额"
            size="small"
          />
        </el-form-item>
        <el-form-item label="码商飞机号" prop="botUserName">
          <el-input v-model="formData.botUserName" placeholder="输入码商飞机号" size="small" />
        </el-form-item>

        <el-form-item label="群组ID" prop="groupIdList">
          <el-input
            v-model="formData.groupIdList"
            placeholder="输入群组ID，不能有空格，以负号开头，多个ID以逗号间隔"
            size="small"
          />
        </el-form-item>

        <el-form-item label="授权审核人ID" prop="personOperatorAuthList">
          <el-input
            v-model="formData.personOperatorAuthList"
            placeholder="输入机器人用户ID，不能有空格，多个ID以逗号间隔"
            size="small"
          />
          <div class="help-tip">说明：授权处理超时订单的机器人用户ID</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showPatchDialogVisable"
      :title="isModAll ? (modifyProvideLevel === 0 ? '全部修改' : '全部修改一级码商') : '批量修改'"
      @close="onPatchDialogBtnCancel()"
      width="600px"
    >
      <el-form
        :model="formPatchData"
        label-position="right"
        :rules="patchRules"
        ref="formPatchDataRef"
        label-width="150px"
        style="margin-right: 80px"
      >
        <el-form-item label="修改最大接单数量" prop="">
          <el-switch v-model="formPatchData.isMaxConcurrentOrdersCount"></el-switch>
        </el-form-item>

        <el-form-item
          label="最大接单数（代收）"
          prop=""
          v-if="formPatchData.isMaxConcurrentOrdersCount"
        >
          <el-input
            type="number"
            v-model="formPatchData.maxConcurrentCollectOrdersCount"
            placeholder="同时最大代收接单数量"
            size="small"
          />
        </el-form-item>

        <el-form-item
          label="最大接单数（代付）"
          prop=""
          v-if="formPatchData.isMaxConcurrentOrdersCount"
        >
          <el-input
            type="number"
            v-model="formPatchData.maxConcurrentPaymentOrdersCount"
            placeholder="同时最大代付接单数量"
            size="small"
          />
        </el-form-item>
        <div
          class="help-tip2"
          style="padding-left: 120px; margin-bottom: 20px"
          v-if="formPatchData.isMaxConcurrentOrdersCount"
        >
          <span>
            最大接单数：一个码商同时最大可以接多少单，当前订单完成或者失败后，才可以接下一个订单，当设置为
            0 时，接单数量不受限制
          </span>
        </div>

        <!-- //----- 后台没完成    先注释 ---- -->
        <el-form-item label="修改费率" prop="isModifiedProviderRate">
          <el-switch v-model="formPatchData.isModifiedProviderRate"></el-switch>
        </el-form-item>

        <el-form-item
          label="产品名称"
          v-if="formPatchData.isModifiedProviderRate"
          prop="productIds"
        >
          <el-select
            filterable
            v-model="formPatchData.productIds"
            :multiple="true"
            placeholder="请选择产品名称"
            size="small"
            @change="patchProductChange"
          >
            <el-option v-if="allProductList.length != 0" label="全部" value=""></el-option>
            <el-option
              v-for="item in allProductList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          style="width: 360px"
          v-if="formPatchData.isModifiedProviderRate"
          label="码商费率"
          prop="providerRate"
        >
          <el-input
            type="number"
            v-model="formPatchData.providerRate"
            placeholder="请输入码商费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">调整费率的值 如 2</div>
        </el-form-item>

        <el-form-item v-if="formPatchData.isModifiedProviderRate" label="调整类型" prop="type">
          <el-radio-group v-model="formPatchData.providerRateAdjustType">
            

            <el-radio class="mt-10" :label="2"
              >全部增加当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，调整后为 7%</div></el-radio
            >

            <el-radio class="mt-10" :label="3"
              >全部减少当前值
              <div class="help-tip">例如：输入2 ，之前的费率是 5%，调整后为 3%</div></el-radio
            >

            <el-radio class="mt-10" :label="1"
              >设置为当前值
              <div class="help-tip">例如：输入2 ，无论之前费率是多少，都会调整为 2%</div></el-radio
            >
          </el-radio-group>
        </el-form-item>

        <!-- ---//--------- -->

        <el-form-item label="是否启用" prop="">
          <el-radio-group v-model="formPatchData.isActive" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="开启代收" prop="isCollectEnable">
          <el-radio-group v-model="formPatchData.isCollectEnable" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="开启代付" prop="isPaymentEnable">
          <el-radio-group v-model="formPatchData.isPaymentEnable" size="small">
            <el-radio :label="null">保持不变</el-radio>
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onPatchDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPatchDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showLevelTreeVisual" title="查看码商层级" width="500px">
      <!-- <el-tree :data="levelTree" default-expand-all node-key="id"> </el-tree> -->
      <!-- <div>
        <p v-for="item of levelTreeData" :key="item.providerId">{{ item.userNickName }}</p>
      </div> -->
      <my-table
        class="mt-10"
        :loadData="() => {}"
        :tableData="levelTreeData"
        ref="levelTreeDataRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="码商账号" prop="userName" />
        <el-table-column label="码商名称" prop="userNickName" />
        <el-table-column label="级别" width="80" prop="level" align="center" />
        <el-table-column label="是否启用" width="80" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.isActive ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
      </my-table>

      <div slot="footer" style="text-align: center">
        <el-button @click="showLevelTreeVisual = false" type="primary" size="small">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="feeDialogVisible" :title="feeDialogTitle" width="500px">
      <el-form
        ref="feeChangeFormDataRef"
        :model="feeChangeFormData"
        :rules="rules"
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

        <el-form-item label="操作类型" prop="operationType">
          <el-input v-model="feeChangeFormData.operationType" :disabled="true" size="small" />
        </el-form-item>

        <el-form-item label="变动金额" prop="amount">
          <el-input
            v-number-input
            type="number"
            v-model="feeChangeFormData.amount"
            placeholder="请输入金额"
            @input="(e) => (feeChangeFormData.amount = e)"
            size="small"
          />
          <!-- <input v-number-input-positive
            v-model="feeChangeFormData.amount"
            placeholder="请输入金额"
            @input="e=>feeChangeFormData.amount=e" ></input> -->
        </el-form-item>

        <el-form-item label="交易密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="feeChangeFormData.password"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
        <el-form-item v-if="feeDialogFlag" label="备注信息" prop="remark">
          <el-input v-model="feeChangeFormData.remark" placeholder="请输入备注信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onFeeDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onFeeDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="peizhiDialogVisible"
      :title="`配置码商 【 ${formData.userNickName} 】 的产品`"
      width="1100px"
    >
      <div v-if="peizhiDialogVisible" style="max-height: 600px; overflow: auto">
        <Peizhi :currItem="formData" :parentVisible="peizhiDialogVisible"></Peizhi>
      </div>
    </el-dialog>
    <!-- 复制码商 -->
    <el-dialog
      @close="onCopyBtnCancel"
      :visible.sync="showCopyDialogVisable"
      title="复制码商"
      width="600px"
    >
      <div class="help-tip txt-center mb-10">
        复制码商就是根据已有的码商相关配置，快速创建新的码商。
      </div>
      <el-form
        ref="copyFormDataRef"
        :rules="rules"
        :model="copyFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 50px"
      >
        <el-form-item label="账号" prop="userName" :rules="userNameRule">
          <el-input v-model="copyFormData.userName" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="码商名称" prop="userNickName">
          <el-input v-model="copyFormData.userNickName" placeholder="请输入码商名称" size="small" />
        </el-form-item>

        <el-form-item label="码商模板" prop="providerId">
          <el-select filterable v-model="copyFormData.providerId" placeholder="请选择" size="small">
            <el-option
              v-for="item in serviceList"
              :label="item.userNickName"
              :value="item.providerId"
              :key="item.providerId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onCopyBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onCopyBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- 开户信息 -->
    <el-dialog :visible.sync="user_info_dialog" title="开户信息" width="600px">
      <div style="margin-left: 10px">
        <div class="request">
          <!-- <h3>基本信息</h3> -->
          <div class="req-line">
            <span class="req-label">账号</span>
            <span class="req-value">
              <el-input :value="user_info.userName" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">初始登录密码</span>

            <span class="req-value">
              <el-input :value="user_info.loginPassword" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">码商管理后台（PC端）</span>
            <span class="req-value">
              <el-input :value="user_info.loginAddress" disabled></el-input>
            </span>
          </div>

          <div class="req-line">
            <span class="req-label">码商管理后台（手机端）</span>
            <span class="req-value">
              <el-input :value="user_info.serverMobileUrl" disabled></el-input>
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
        <el-button type="success" size="small" style="margin-right: 30px" @click="copyAgentInfo"
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
            <el-button
              v-if="showCopyBtn"
              type="primary"
              plain
              size="small"
              class="el_btn"
              @click="copyPassword"
              >复制</el-button
            >
            <!-- <el-button size="small" class="el_btn" @click="resetPassword('password')"
              >重置</el-button
            > -->
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
            <!-- <el-button size="small" class="el_btn" @click="resetPassword('google_key')"
              >重置</el-button
            > -->
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
            <!-- <el-button size="small" class="el_btn"  @click="resetPassword('tradePwd')"
              >重置</el-button
            > -->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button
          type="success"
          @click="
            resetPassword(
              resetPwdType == 1 ? 'password' : resetPwdType == 2 ? 'google_key' : 'tradePwd'
            )
          "
          >重置</el-button
        >
        <el-button type="primary" @click="closeResetPassword()"> 关闭 </el-button>
      </div>
    </el-dialog>
    <balance :currItem="formData" ref="balanceDialog"></balance>

    <el-dialog
      :visible.sync="patchAddVisible"
      :title="
        isAddAll
          ? modifyProvideLevel === 0
            ? '全部添加产品'
            : '全部一级码商添加产品'
          : '批量添加产品'
      "
      :modal="false"
      @close="onPathAddDialogCancel()"
      width="600px"
    >
      <el-form
        ref="patchAddformDataRef"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="margin-right: 90px"
      >
        <el-form-item label="产品名称" prop="productIds">
          <el-select
            filterable
            v-model="formData.productIds"
            :multiple="true"
            placeholder="请选择"
            @change="patchAddProductChange"
          >
            <el-option v-if="allProductList.length != 0" label="全部" value=""></el-option>
            <el-option
              v-for="item in allProductList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 0 -->
        <el-form-item label="码商费率" prop="providerRate">
          <el-input
            v-number-input
            type="number"
            v-model="formData.providerRate"
            placeholder="请输入码商费率"
            size="small"
          >
            <template slot="append"> % </template>
          </el-input>
          <div class="help-tip">如 3%，每成交一笔订单，码商获得 3% 的利润</div>
        </el-form-item>
        <!-- 0 -->
        <el-form-item label="单笔费用" prop="providerPerTransactionFee">
          <el-input
            v-number-input
            type="number"
            v-model="formData.providerPerTransactionFee"
            placeholder="请输入费用金额"
            size="small"
          >
            <template slot="append"> 元 </template>
          </el-input>
          <div class="help-tip">如2元，每完成一笔订单，码商获得2元的利润</div>
        </el-form-item>
        <!-- 1 -->
        <el-form-item label="权重" prop="weight">
          <el-input
            type="number"
            v-model.number="formData.weight"
            placeholder="请输入权重"
            size="small"
          >
          </el-input>
          <div class="help-tip">1-10 的整数，值越大，接单概率越高</div>
        </el-form-item>

        <el-form-item label="是否启用" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onPathAddDialogCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onPathAddDialogOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Peizhi from './service-list-setting.vue'

import { serviceRules, queryRules, patchRules } from './rules'

import {
  getServiceList,
  addService,
  copyService,
  isActiveService,
  getProviderOptionList,
  updateAllService,
  updateBatchService,
  adjustAvailableBalance,
  adjustFreezeBalance,
  adjustMinAllowableCollectAmount,
  isExistProviderName,
  isExistProviderUserName,
  getProviderInfoDetailByProviderId,
  resetProviderSecretKey,
  resetProviderGoogleAuthKey,
  updateCollectPayStatus,
  getProviderLevel,
  updateAllOneLevelService,
  getProviderOpenInfo,
  patchAllOneLevelProvideAddProduct,
  providerDelete,
  patchUnlockUser,
  updateSingleProvider,
  patchAllProvideAddProduct,
  getProviderMinAllowableCollectAmount,
  getProviderSum,
  providerExport,
  getProviderOptionListExcludeChildren
} from '@/api/service-list.js'
import { systemUserIsLock } from '@/api/system-manager'
import { getProductListByTenantId } from '@/api/service-list-setting.js'

import { resetTradePassword } from '@/api/tenant-manager'
import balance from './service-list-balance.vue'
import { userName, rulesName } from '@/utils/validate'
import clipboard from '@/utils/clipboard'
import FileSaver from 'file-saver'
export default {
  components: {
    Peizhi,
    balance
  },
  name: 'ServiceList',
  data() {
    const isNameOnly = async (rule, value, callback) => {
      let ret = await isExistProviderUserName(this.$store.state.tenant.selectTenantId, {
        providerUserName: value
      })
      if (ret.data) {
        callback(new Error('账号已存在'))
      } else {
        callback()
      }
    }
    const isNickNameOnly = async (rule, value, callback) => {
      let ret = await isExistProviderName(value)
      if (ret.data) {
        callback(new Error('码商名称已存在'))
      } else {
        callback()
      }
    }
    return {
      modifyProvideLevel: 0, // 0 默认值  即 全部级别
      queryRules: queryRules,
      rules: serviceRules,
      patchRules: {
        ...patchRules,
        ...serviceRules
      },
      summaryData: [],
      userNameRule: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        ...userName,
        { validator: isNameOnly, trigger: 'blur' }
      ],
      userNickNameRule: [
        { required: true, message: '请输入码商名称', trigger: 'blur' },
        ...rulesName,
        { validator: isNickNameOnly, trigger: 'blur' }
      ],

      copyFormData: {},
      tableData: [],
      showCopyBtn: false,
      dialogVisible: false,
      user_info_dialog: false,
      reset_password_dialog: false,
      formData: {},
      queryFormData: this.getQueryForm(),
      resetPwdType: 1, // 重置密码类型 1:重置登录密码 2:重置谷歌密钥
      serviceList: [], // 指定平台的 服务列表----新增
      editServiceList: [], // 指定平台的 服务列表---修改
      feeDialogFlag: false,
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
      feeChangeFormData: {},
      merchant_key: '',
      delay_payment_time_options: [
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
      levelTreeData: [],
      showLevelTreeVisual: false,
      showCopyDialogVisable: false,

      showPatchDialogVisable: false, // 批量修改
      formPatchData: {},
      isModAll: false, // 是否是全部修改
      allProductList: [], // 产品名称
      isAddAll: false, // 是否全部增加
      patchAddVisible: false
    }
  },

  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.queryTableData()
      this.flushData()
    },
    'formData.userName'(newV, oldV) {
      if (newV) {
        this.formData.userNickName = newV
      }
    }
  },

  methods: {
    deleteAllprovide(){
      this.$confirm('确认删除除所有码商吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.forEach(row=>{
          providerDelete(row.providerId)
        })
      })
    },
    clearAllBarence() {
      // 确认框
      this.$confirm('确认清除所有码商的余额吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 弹出 prompt 提示，输入交易密码
        this.$prompt('请输入交易密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((ret) => {
          console.log(ret.value)

           this.tableData.forEach((row) => {
            console.log('row.availableBalance : ', row.availableBalance)
            if (Number(row.availableBalance) > 0) {
              adjustAvailableBalance({
                userId: row.userId, // 码商id
                businessType: 2, //  0-代收类，1-代付类，2-业务类
                changeType: 1, // 账变类型（0-充值、1-扣款）
                changeAmount: Number(row.availableBalance), // 变动金额
                tradePassword: ret.value, // 交易密码
                remark: ''
              }).then((res) => {
                console.log('扣减成功')
              })
            }
          })
        })
      })
    },
    copyPassword(e) {
      this.clipboard(`${this.formDataPassword.login_code}`, e)
    },
    closeResetPassword() {
      this.reset_password_dialog = false
      this.showCopyBtn = false
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
      let res = await providerExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '码商列表.xlsx')
    },
    async getProviderSum() {
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
      let res = await getProviderSum(params)
      this.summaryData = res.data
      console.log(res, 'res')
    },
    async getProviderMinAllowableCollectAmount() {
      let res = await getProviderMinAllowableCollectAmount(this.$store.state.tenant.selectTenantId)
      this.formData.minAllowableCollectAmount = res.data ? Number(res.data) : 0
    },

    patchProductChange(e) {
      if (e.indexOf('') != -1 && e.length > 1) {
        this.formPatchData.productIds = ['']
        this.$message.error('您已选择全部，无须选择其他！')
      }
    },
    patchAddProductChange(e) {
      if (e.indexOf('') != -1 && e.length > 1) {
        this.formData.productIds = ['']
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
    onPathAddDialogOk() {
      this.$refs.patchAddformDataRef.validate(async (valid) => {
        if (valid) {
          // 校验成功

          const isAllProduct = this.formData.productIds.indexOf('') != -1

          const params = {
            tenantId: this.$store.state.tenant.selectTenantId,
            providerIdList: this.isAddAll ? [] : this.selectionRows.map((ele) => ele.providerId),
            productIdList: isAllProduct ? [] : this.formData.productIds,
            relationCreateDTO: {
              providerRate: this.formData.providerRate,
              providerPerTransactionFee: this.formData.providerPerTransactionFee,
              weight: this.formData.weight,
              isActive: this.formData.isActive
            }
          }

          if (this.isAddAll) {
            if (this.modifyProvideLevel == 1) {
              await patchAllOneLevelProvideAddProduct(params)
              this.$message.success('全部一级码商添加成功')
            } else {
              await patchAllProvideAddProduct(params)
              this.$message.success('全部添加成功')
            }
          } else {
            await patchAllProvideAddProduct(params)
            this.$message.success('批量添加成功')
          }

          this.onPathAddDialogCancel()
        }
      })
    },

    onPathAddDialogCancel() {
      this.patchAddVisible = false
      this.$refs.patchAddformDataRef.resetFields()
      this.modifyProvideLevel = 0
    },

    showPatchAddProductDialog(isAddAll, level = 0) {
      this.isAddAll = isAddAll
      this.modifyProvideLevel = level

      this.patchAddVisible = true

      this.formData = {
        productIds: [],
        providerRate: '',
        providerPerTransactionFee: '0',
        weight: '1',
        isActive: 1
      }
    },
    async getAllProductList() {
      getProductListByTenantId(this.$store.state.tenant.selectTenantId).then((res) => {
        if (res.data && res.data.length > 0) {
          this.allProductList = res.data
        }
      })
    },

    async onBussinessSwitchChange(row) {
      await updateCollectPayStatus(row)
      this.$message.success('状态更新成功')
    },
    async resetPassword(row) {
      if (row == 'password') {
        let res = await resetProviderSecretKey(this.userId)
        this.$message.success('密码重置成功')
        this.showCopyBtn = true
        this.formDataPassword.login_code = res.data
      } else if (row == 'google_key') {
        let res = await resetProviderGoogleAuthKey(this.userId)
        this.$message.success('谷歌密钥重置成功')
      } else {
        // 交易密码
        await resetTradePassword(this.userId)
        this.$message.success('交易密码重置成功')
      }
      // this.userId = ''
    },
    copyAgentInfo(e) {
      this.clipboard(
        `账号： ${this.user_info.userName}
初始登录密码： ${this.user_info.loginPassword}
码商管理后台（PC端）： ${this.user_info.loginAddress}
码商管理后台（手机端）： ${this.user_info.serverMobileUrl}

说明：（主要针对账号安全设定）
  1、平台、商户、码商开户时都会生成临时密码，账号初次登录时会强制进行修改
  2、若开户后忘记临时密码需要跟后台申请重置
  3、初次登录后，请及时设置交易密码
`,
        e
      )
    },
    clipboard,
    onDialogCancel() {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    },

    onDialogBtnOk() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          // 校验成功
          if (this.isEdit) {
            // 编辑
            await updateSingleProvider({
              providerId: this.formData.providerId,
              userId: this.formData.userId,
              providerName: this.formData.userNickName,
              parentId: this.formData.parentId,
              maxConcurrentCollectOrdersCount: Number(
                this.formData.maxConcurrentCollectOrdersCount
              ),
              maxConcurrentPaymentOrdersCount: Number(
                this.formData.maxConcurrentPaymentOrdersCount
              ),
              minAllowableCollectAmount: this.formData.minAllowableCollectAmount,
              botUserName: this.formData.botUserName,
              groupIdList: this.formData.groupIdList ? this.formData.groupIdList.split(',') : [],
              personOperatorAuthList: this.formData.personOperatorAuthList
                ? this.formData.personOperatorAuthList.split(',')
                : []
            })
            this.flushPage()
          } else {
            // 新增

            await addService({
              ...this.formData,
              tenantId: this.$store.state.tenant.selectTenantId,
              isActive: 1, // 新增的默认 开启
              botUserName: this.formData.botUserName,
              groupIdList: this.formData.groupIdList ? this.formData.groupIdList.split(',') : [],
              personOperatorAuthList: this.formData.personOperatorAuthList
                ? this.formData.personOperatorAuthList.split(',')
                : []
            })

            this.$message.success('新增成功')
            this.flushPage()
          }

          this.onDialogCancel()
        }
      })
    },

    onPatchDialogBtnCancel() {
      this.$refs.formPatchDataRef.resetFields()
      this.showPatchDialogVisable = false
      this.modifyProvideLevel = 0
    },

    onPatchDialogBtnOk() {
      this.$refs.formPatchDataRef.validate(async (valid) => {
        if (valid) {
          // 校验成功
          // 发起请求
          let productIdsFlag = this.formPatchData.productIds
          const isAllProduct = this.formPatchData.productIds.indexOf('') != -1
          if (isAllProduct) {
            productIdsFlag = []
          }
          let providerRate = this.formPatchData.isModifiedProviderRate == 1 ? true : false

          // this.formPatchData.isModifiedProviderRate =
          //   this.formPatchData.isModifiedProviderRate == 1 ? true : false

          const { productIds, isModifiedProviderRate, ...rest } = this.formPatchData

          if (this.isModAll) {
            if (this.modifyProvideLevel === 0) {
              // 全部修改
              await updateAllService({
                isModifiedProviderRate: providerRate,
                ...rest,
                productIds: productIdsFlag,
                tenantId: this.$store.state.tenant.selectTenantId
              })
            } else {
              // 全部修改 一级码商
              await updateAllOneLevelService({
                isModifiedProviderRate: providerRate,
                ...rest,
                productIds: productIdsFlag,
                tenantId: this.$store.state.tenant.selectTenantId
              })
            }
          } else {
            // 批量修改

            let idList = this.selectionRows.map((ele) => ele.providerId)

            let res = await updateBatchService({
              // tenantId,
              providerIds: idList,
              isModifiedProviderRate: providerRate,
              ...rest,
              productIds: productIdsFlag,
              tenantId: this.$store.state.tenant.selectTenantId
            })
          }
          this.$message.success('修改成功')
          this.onPatchDialogBtnCancel()
          this.flushPage()
        }
      })
    },
    showPatchDialog(isModAll, level = 0) {
      this.isModAll = isModAll // 是否是全部修改
      this.modifyProvideLevel = level
      this.formPatchData = {
        isActive: null, //0 保持不变  1  开启   2  关闭
        isCollectEnable: null, //0 保持不变  1  开启   2  关闭
        isPaymentEnable: null, //0 保持不变  1  开启   2  关闭
        // maxConcurrentOrdersCount: 0,
        maxConcurrentCollectOrdersCount: 0,
        maxConcurrentPaymentOrdersCount: 0,
        isMaxConcurrentOrdersCount: 0,

        productIds: [], //  [] 全部
        isModifiedProviderRate: 0,
        providerRateAdjustType: 2, // 默认费率增加
        providerRate: ''
      }

      this.showPatchDialogVisable = true
    },
    async showUserInfo(row) {
      console.log('开户信息')
      this.user_info_dialog = true
      let res = await getProviderOpenInfo(row.providerId)
      this.user_info = res.data
    },
    showResetPassword(row, type) {
      console.log('重置密码')
      this.resetPwdType = type
      this.userId = row.userId

      this.formDataPassword = {
        login_code: '********',
        google_key: '**********',
        tradePwd: '********'
      }
      this.reset_password_dialog = true
    },
    showCopyDialog() {
      this.getProviderOptionList()
      this.showCopyDialogVisable = true
      this.copyFormData = {
        userName: '',
        userNickName: '',
        providerId: ''
      }
    },

    onCopyBtnCancel() {
      this.$refs.copyFormDataRef.resetFields()
      this.showCopyDialogVisable = false
    },
    onCopyBtnOk() {
      this.$refs.copyFormDataRef.validate(async (valid) => {
        if (valid) {
          // 校验成功
          // 发起请求
          let res = await copyService({
            ...this.copyFormData,
            tenantId: this.$store.state.tenant.selectTenantId
          })
          this.$message.success('复制成功')

          this.onCopyBtnCancel()
          this.flushPage()
        }
      })
    },

    async showLevelTree(row) {
      this.showLevelTreeVisual = true
      let res = await getProviderLevel(row.providerId)
      console.log(res, 'res')
      this.levelTreeData = res.data
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
      // this.feeChangeFormData = Object.assign(this.feeChangeFormData, row)

      if (type == 1) {
        this.feeDialogFlag = true
        // 余额充值
        this.feeDialogTitle = '余额充值'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: '充值'
        }
      } else if (type == 2) {
        this.feeDialogFlag = true
        this.feeDialogTitle = '余额扣除'
        this.feeChangeFormData = {
          banlance_type: '可用余额',
          balance: row.availableBalance,
          operationType: '扣款'
        }
      } else if (type == 3) {
        // 冻结金额 +
        this.feeDialogTitle = '增加冻结金额'
        this.feeDialogFlag = true
        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.availableBalance,
          operationType: '冻结'
        }
      } else if (type == 4) {
        // 冻结金额 -
        this.feeDialogFlag = true
        this.feeDialogTitle = '减少冻结金额'
        this.feeChangeFormData = {
          banlance_type: '冻结余额',
          balance: row.freezeBalance,
          operationType: '解冻'
        }
      } else if (type == 5) {
        // 最低接单金额  +
        this.feeDialogFlag = false
        this.feeDialogTitle = '增加最低接单金额'
        this.feeChangeFormData = {
          banlance_type: '最低接单金额',
          balance: row.minAllowableCollectAmount,
          operationType: '增加'
        }
      } else if (type == 6) {
        // 最低接单金额 -
        this.feeDialogFlag = false
        this.feeDialogTitle = '减少最低接单金额'
        this.feeChangeFormData = {
          banlance_type: '最低接单金额',
          balance: row.minAllowableCollectAmount,
          operationType: '减少'
        }
      }

      this.feeChangeFormData.type = type
      this.feeChangeFormData.userId = row.userId
      this.feeChangeFormData.userName = row.userName
      this.feeChangeFormData.userNickName = row.userNickName
      this.feeChangeFormData.freezeBalance = row.freezeBalance

      console.log(JSON.stringify(this.feeChangeFormData))
    },
    onFeeDialogBtnCancel() {
      this.$refs.feeChangeFormDataRef.resetFields()
      this.$refs.feeChangeFormDataRef.clearValidate()
      this.feeDialogVisible = false
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

        if (this.feeChangeFormData.type == 1 || this.feeChangeFormData.type == 2) {
          let changeType = this.feeChangeFormData.operationType == '充值' ? 0 : 1 // 账变类型（0-充值、1-扣款）

          // if (this.feeChangeFormData.operationType == '扣款') {
          //   if (Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance)) {
          //     this.$message.error('变动金额不能大于可用余额！')
          //     return
          //   }
          // }
          if (this.checkMountNumber(this.feeChangeFormData.type, balance, changeAmount) == false) {
            return
          }
          // 扣款
          await adjustAvailableBalance({
            userId: this.feeChangeFormData.userId, // 码商id
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            changeType: changeType, // 账变类型（0-充值、1-扣款）
            changeAmount: Number(this.feeChangeFormData.amount), // 变动金额
            tradePassword: this.feeChangeFormData.password, // 交易密码
            remark: this.feeChangeFormData.remark
          })
        } else if (this.feeChangeFormData.type == 3 || this.feeChangeFormData.type == 4) {
          let changeType = this.feeChangeFormData.operationType == '冻结' ? 10 : 11 // 账变类型（10-冻结、11-解冻）
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

          await adjustFreezeBalance({
            userId: this.feeChangeFormData.userId, // 码商id
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            changeType: changeType, // 账变类型（0-充值、1-扣款）
            changeAmount: Number(this.feeChangeFormData.amount), // 变动金额
            tradePassword: this.feeChangeFormData.password, // 交易密码
            remark: this.feeChangeFormData.remark
          })
        } else if (this.feeChangeFormData.type == 5 || this.feeChangeFormData.type == 6) {
          let operationType = this.feeChangeFormData.operationType == '增加' ? 1 : 0 // 操作类型（0-减少，1-增加）
          // if (
          //   Number(this.feeChangeFormData.amount) > Number(this.feeChangeFormData.balance) &&
          //   this.feeChangeFormData.operationType == '减少'
          // ) {
          //   this.$message.error('变动金额不能大于最低接单余额！')
          //   return
          // }
          if (this.checkMountNumber(this.feeChangeFormData.type, balance, changeAmount) == false) {
            return
          }

          await adjustMinAllowableCollectAmount({
            userId: this.feeChangeFormData.userId, // 码商id
            businessType: 2, //  0-代收类，1-代付类，2-业务类
            operationType: operationType, // 操作类型（0-减少，1-增加）
            changeAmount: Number(this.feeChangeFormData.amount), // 变动金额
            tradePassword: this.feeChangeFormData.password // 交易密码
          })
        }

        this.onFeeDialogBtnCancel()
        this.flushPage()
      })
    },
    batchSettle() {
      this.$confirm('您确定对选中的码商进行结算吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('确定！')
        })
        .catch(() => {
          console.log('取消！')
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
        let res = await providerDelete(row.providerId)
        this.$refs.tableRef.getTableData(1)
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },

    async showEditDialog(row) {
      // this.getProviderOptionList()
      this.getProviderOptionListExcludeChildren(row.providerId)
      // row.parentId = row.parentId == '0' ? '' : row.parentId
      this.isEdit = true
      this.dialogVisible = true
      let linshi = {
        ...row,
        merchant_key: '********',
        login_code: '********',
        google_key: '********'
      }
      this.formData = Object.assign({}, linshi)

      let res = await getProviderInfoDetailByProviderId(row.providerId)

      this.formData.botUserName = res.data.botUserName
      this.formData.groupIdList = res.data.groupIdList ? res.data.groupIdList.join(',') : ''
      this.formData.personOperatorAuthList = res.data.personOperatorAuthList
        ? res.data.personOperatorAuthList.join(',')
        : ''
    },
    showAddDialog() {
      this.formData = {
        userName: '',
        userNickName: '',
        parentId: 0, // 0 无上线码商
        maxConcurrentCollectOrdersCount: 0,
        maxConcurrentPaymentOrdersCount: 0,

        minAllowableCollectAmount: '0'
      }
      this.getProviderMinAllowableCollectAmount()
      this.getProviderOptionList()
      this.isEdit = false
      this.dialogVisible = true
    },

    async onSwitchChange(row) {
      try {
        // 如果是 关闭，同时 关闭 代收 和代付
        if (!row.isActive) {
          row.isCollectEnable = 0
          row.isPaymentEnable = 0

          updateCollectPayStatus(row)
        }

        let res = await isActiveService(row.providerId, row.isActive)
        console.log(res)
        this.$message.success('状态更新成功')
      } catch (e) {
        console.log(e)
      }
      // this.flushPage()
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
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      let res = await getServiceList(params, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.$refs.tableRef.getTableData()
      this.getProviderSum()
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormRef.resetFields()
      this.flushPage()
    },
    getQueryForm() {
      return {
        isActive: '',
        productId: ''
      }
    },

    queryTableData() {
      this.$refs.queryFormRef.validate((valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.getProviderSum()
        }
      })
    },
    async getProviderOptionList() {
      // 新增----获取上级码商
      let res = await getProviderOptionList(this.$store.state.tenant.selectTenantId)
      this.serviceList = res.data
      console.log(res)
    },
    async getProviderOptionListExcludeChildren(providerId) {
      //修改---获取上级码商（不包含子级）
      let res = await getProviderOptionListExcludeChildren(
        this.$store.state.tenant.selectTenantId,
        {
          providerId: providerId
        }
      )
      this.editServiceList = res.data
    },
    flushData() {
      this.getAllProductList()
    }
  },
  mounted() {
    this.flushData()
    this.getProviderSum()
  }
}
</script>

<style lang="scss" scoped>
.isShowUi .tool-box .btns::after {
  content: '码商列表';
}

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
      width: 180px;
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
.help-tip2 {
  font-size: 12px;
  line-height: 17px;
  color: #cc0000;
}
</style>
