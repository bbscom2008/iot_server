<template>
  <div class="container">
    <el-card>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="queryFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchantOrderNo">
          <el-input
            v-model="queryFormData.merchantOrderNo"
            placeholder="请输入商户订单号"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount" :rules="minOrderAmountRules">
          <el-input
            v-model="queryFormData.orderAmount"
            v-number-input-positive
            type="number"
            clearable
            placeholder="订单金额"
            size="small"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <!-- <el-form-item
          label="订单金额"
          prop="minOrderAmount"
          :rules="minOrderAmountRules"
          style="margin-right: 5px"
        >
          <el-input
            v-model="queryFormData.minOrderAmount"
            v-number-input-positive
            type="number"
            placeholder="订单金额"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="至" prop="maxOrderAmount" :rules="maxOrderAmountRules" class="zhi">
          <el-input
            v-model="queryFormData.maxOrderAmount"
            v-number-input-positive
            type="number"
            placeholder="订单金额"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->

        <el-form-item label="实付金额" prop="payAmount" :rules="minPayAmountRules">
          <el-input
            v-model="queryFormData.payAmount"
            v-number-input-positive
            type="number"
            placeholder="实付金额"
            size="small"
            clearable
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <!-- <el-form-item
          label="实付金额"
          prop="minPayAmount"
          :rules="minPayAmountRules"
          style="margin-right: 5px"
        >
          <el-input
            v-model="queryFormData.minPayAmount"
            v-number-input-positive
            type="number"
            placeholder="实付金额"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="至" prop="maxPayAmount" :rules="maxPayAmountRules" class="zhi">
          <el-input
            v-model="queryFormData.maxPayAmount"
            v-number-input-positive
            type="number"
            placeholder="实付金额"
            size="small"
            style="width: 180px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->

        <el-form-item label="产品名称" prop="">
          <el-select
            v-model="queryFormData.productId"
            filterable
            placeholder="请选择产品名称"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收款信息" prop="">
          <el-input
            v-model="queryFormData.collectInfoName"
            placeholder="请输入收款信息"
            size="small"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="收款信息" prop="">
          <el-select
            v-model="queryFormData.collectInfoId"
            filterable
            placeholder="请选择收款信息"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in payeeAccountList"
              :key="item.payeeAccountId"
              :label="item.payeeAccountName"
              :value="item.payeeAccountId"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="订单状态" prop="">
          <el-select
            v-model="queryFormData.orderStatus"
            filterable
            placeholder="请选择订单状态"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in orderStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="通知状态" prop="">
          <el-select
            v-model="queryFormData.notifyStatus"
            filterable
            placeholder="请选择通知状态"
            size="small"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in notifyStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="付款人姓名" prop="">
          <el-input
            v-model="queryFormData.payerName"
            placeholder="请输入付款人姓名"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="转账备注" prop="transferRemark">
          <el-input
            v-model="queryFormData.transferRemark"
            placeholder="请输入转账备注"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="确认用户名" prop="">
          <el-input
            v-model="queryFormData.confirmOrderUserName"
            placeholder="请输入确认用户名"
            size="small"
            clearable
          />
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptions"
          />
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
      <div class="tool-box">
        <div style="display: flex">
          <div class="auto-flush" style="margin-right: 50px">
            <span class="mr-10">自动刷新</span>
            <el-checkbox-group v-model="autoCheckList" @change="checkGroupChange">
              <el-checkbox :label="10">10秒</el-checkbox>
              <el-checkbox :label="30">30秒</el-checkbox>
              <el-checkbox :label="60">60秒</el-checkbox>
            </el-checkbox-group>
            <span class="flush-tips ml-10">{{ flushTips }}</span>
          </div>

          <el-button type="primary" plain icon="el-icon-plus" @click="handleDownload"
            >批量导出</el-button
          >
        </div>

        <el-dropdown trigger="click" style="margin-left: 10px; cursor: pointer">
          <span
            class="el-dropdown-link"
            style="display: flex; height: 100%; align-items: center; font-size: 24px"
          >
            <i class="el-icon-s-grid"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="padding: 10px; width: 200px">
            <el-checkbox
              v-model="allSelected"
              @change="handleAllSelectChange"
              style="display: block; margin-bottom: 8px"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="selectedItems" @change="handleItemChange">
              <el-checkbox
                v-for="(item, index) in allItems"
                :key="index"
                style="display: block"
                :label="item"
                >{{ item }}</el-checkbox
              >
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <my-table
        ref="tableRef"
        class="mt-10"
        :load-data="loadTableData"
        :defaultPageSize="30"
        :table-data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column
          label="订单号"
          align="center"
          min-width="240"
          v-if="selectedItems.includes('订单号')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div>
                <el-tag>系统</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.systemOrderNo, e)
                    }
                  "
                  >{{ row.systemOrderNo }}</span
                >
              </div>
              <div class="mt-5">
                <el-tag>商户</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.merchantOrderNo, e)
                    }
                  "
                >
                  {{ row.merchantOrderNo }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="金额(元)"
          align="center"
          width="120"
          v-if="selectedItems.includes('金额')"
        >
          <template slot-scope="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-start">
              <div>
                <el-tag>订单</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.orderAmount, e)
                    }
                  "
                >
                  {{ row.orderAmount }}</span
                >
              </div>
              <div class="mt-5">
                <el-tag>实付</el-tag>
                <span
                  style="cursor: pointer"
                  @click="
                    (e) => {
                      clipboard(row.payAmount, e)
                    }
                  "
                >
                  {{ row.payAmount }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="产品信息"
          align="center"
          width="150"
          v-if="selectedItems.includes('产品信息')"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.productName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="收款信息"
          align="center"
          width="150"
          prop="collectInfoName"
          v-if="selectedItems.includes('收款信息')"
        >
          <template slot-scope="{ row }">
            <div>
              <!-- 收款码名称 -->
              <div
                v-if="row.collectInfoName"
                style="margin-bottom: 5px; font-weight: 500; color: #409eff; cursor: pointer"
                @click="
                  (e) => {
                    clipboard(row.collectInfoName, e)
                  }
                "
                title="点击复制收款码名称"
              >
                {{ row.collectInfoName }}
              </div>
              <!-- 解析后的收款信息内容 -->
              <div v-html="getCollectInfoDisplay(row.collectInfoContent)"></div>
            </div>
            <el-button type="text" @click="look_shoukuan_info(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="付款人信息"
          align="center"
          width="160"
          v-if="selectedItems.includes('付款人信息')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.payerName">
                <el-tag>姓名</el-tag>
                <span style="cursor: pointer" @click="(e) => clipboard(row.payerName, e)">{{
                  row.payerName
                }}</span>
              </div>
              <div v-if="row.payerIp" class="mt-5"><el-tag>ip</el-tag> {{ row.payerIp }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="订单时间"
          align="center"
          min-width="220px"
          v-if="selectedItems.includes('订单时间')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.createTime"><el-tag type="success" >创建时间:</el-tag> {{ row.createTime }}</div>
              <div v-if="row.receiveTime"><el-tag>接单时间:</el-tag> {{ row.receiveTime }}</div>
              <div v-if="row.confirmOrderTime">
                <el-tag>确认时间:</el-tag> {{ row.confirmOrderTime }}
              </div>
              <div v-if="row.notifyTime"><el-tag>通知时间:</el-tag> {{ row.notifyTime }}</div>
              <div v-if="row.expiredTime"><el-tag type="danger" >过期时间:</el-tag> {{ row.expiredTime }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          align="center"
          width="150"
          v-if="selectedItems.includes('状态')"
        >
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.orderStatus != null">
                订单状态:
                <el-tag
                  :type="orderStateOptions.find((item) => item.value === row.orderStatus).type"
                  >{{
                    orderStateOptions.find((item) => item.value === row.orderStatus).label
                  }}</el-tag
                >
              </div>
              <div v-if="row.notifyStatus != null">
                通知状态:
                <el-tag
                  :type="notifyStatusOptions.find((item) => item.value === row.notifyStatus).type"
                >
                  {{
                    notifyStatusOptions.find((item) => item.value === row.notifyStatus).label
                  }}</el-tag
                >
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="转账备注"
          align="center"
          prop="transferRemark"
          v-if="selectedItems.includes('转账备注')"
        />

        <el-table-column
          label="提交信息"
          align="center"
          prop=""
          v-if="selectedItems.includes('提交信息')"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_submit_info(row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="近半小时流水"
          align="center"
          prop="shoukuan_info"
          width="120"
          v-if="selectedItems.includes('近半小时流水')"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_bill_info(row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="确认用户名"
          align="center"
          prop="confirmOrderUserName"
          v-if="selectedItems.includes('确认用户名')"
        >
          <template slot-scope="{ row }">
            <span>{{ row.confirmOrderUserName ? row.confirmOrderUserName : '' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          width="110"
          fixed="right"
          v-if="selectedItems.includes('操作')"
        >
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 0)"  v-if="$store.state.user.providerPermission.isCancelOrder"  >
                <i class="el-icon-s-release" />取消
              </div>
              <div
                v-if="row.orderStatus != 3"
                type="primary"
                class="btn mt-5"
                @click="showCommonDialog(row, 1)"
              >
                <i class="el-icon-s-claim" />确认
              </div>

              <div type="primary" class="btn mt-5" @click="showBlackDialog(row)"  v-if="$store.state.user.providerPermission.isOneKeyBlacklist"   >
                <i class="el-icon-s-help" />一键拉黑
              </div>


              <!-- <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 2)">
                <i class="el-icon-delete" />补单
              </div> -->




            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="commonDialogVisible"
      :title="commonDialogTitle"
      width="600px"
      class="deal-order"
      @close="onCommonBtnCancel()"
    >
      <el-form
        ref="commonFormData"
        :model="commonFormData"
        label-position="right"
        label-width="120px"
        :rules="rules"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="commonFormData.systemOrderNo"
            disabled
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号 :" prop="">
          <el-input disabled v-model="commonFormData.merchantOrderNo" size="small" />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount">
          <el-input
            v-model="commonFormData.orderAmount"
            disabled
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item v-if="commonDialogType != 3" label="实付金额" prop="pay_order_money">
          <el-input
            v-model="commonFormData.pay_order_money"
            disabled
            placeholder="请输入实付金额"
            size="small"
            class="money"
          />
        </el-form-item>

        <el-form-item v-if="commonDialogType == 3" label="原实付金额" prop="pay_order_money">
          <el-input
            v-model="commonFormData.pay_order_money"
            disabled
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>

        <el-form-item
          v-if="commonDialogType == 3"
          label="新实付金额"
          required
          prop="pay_order_money"
        >
          <el-input
            v-model="commonFormData.new_pay_order_money"
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="收款码名称" prop="" v-if="commonFormData.collectInfoName">
          <el-input disabled v-model="commonFormData.collectInfoName" size="small" />
        </el-form-item>

        <el-form-item label="付款人姓名" prop="">
          <el-input disabled v-model="commonFormData.payerName" placeholder="" size="small" />
        </el-form-item>

        <el-form-item label="付款人IP" prop="" v-if="commonFormData.payerIp">
          <el-input
            disabled
            v-model="commonFormData.payerIp"
            placeholder="请输入付款人IP"
            size="small"
          />
        </el-form-item>

        <el-form-item label="转账备注" prop="" v-if="commonFormData.transferRemark">
          <el-input disabled v-model="commonFormData.transferRemark" size="small" />
        </el-form-item>

        <el-form-item label="订单创建时间" prop="" v-if="commonFormData.createTime">
          <el-input disabled v-model="commonFormData.createTime" size="small" />
        </el-form-item>

        <!-- <el-form-item label="交易密码" >
          <el-input
            v-model="commonFormData.password"
            type="password"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="onCommonBtnCancel()"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onCommonBtnOK()"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="submit_info_dialog_visible"
      @close="closeInfoDialog()"
      title="查看提交信息"
      width="600px"
    >
      <div style="padding: 0 100px">
        <div v-for="(item, i) in submit_info_formData.submitInfo" :key="i" style="padding: 5px 0">
          <div v-if="item.showType == 0">
            <span style="margin-right: 20px">{{ item.submitInfoKey }}：</span>
            <span style="font-weight: 600; margin-right: 10px">{{ item.submitInfoValue }}</span>
            <el-button
              type="text"
              @click="
                (e) => {
                  clipboard(item.submitInfoValue, e)
                }
              "
              >复制</el-button
            >
          </div>
          <div v-if="item.showType == 1">
            <span style="margin-right: 20px">{{ item.submitInfoKey }}：</span>
            <span>
              <el-image
                style="width: 200px; height: 200px"
                fit="fill"
                :src="item.imageUrl"
                alt=""
                :preview-src-list="[item.imageUrl]"
              ></el-image>
            </span>
          </div>
        </div>
      </div>

      <div slot="footer">
        <el-button type="primary" @click="closeInfoDialog()" size="small"> 关闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showAccountInfoVisible"
      :title="'查看收款信息'"
      width="500px"
      :modal="false"
      @close="showAccountInfoVisible = false"
    >
      <el-form
        :model="formData"
        class="add-form"
        readonly
        label-position="right"
        label-width="120px"
      >
        <el-form-item label="当前码商" prop="">
          <div>
            {{ formData.providerUserName ? formData.providerUserName : '' }}
          </div>
        </el-form-item>

        <el-form-item label="收款码名称">
          <div>{{ formData.collectInfoName ? formData.collectInfoName : '' }}</div>
        </el-form-item>

        <el-form-item label="产品名称">
          <div>
            {{ formData.productName ? formData.productName : '' }}
          </div>
        </el-form-item>

        <div v-if="formData.payeeAccountConfig && showAccountInfoVisible">
          <div
            v-if="formData.payeeAccountConfig.texts && formData.payeeAccountConfig.texts.length > 0"
          >
            <!-- 文本信息 -->
            <el-form-item
              v-for="item in formData.payeeAccountConfig.texts"
              :key="item.textConfigId"
              :label="item.textTitle"
            >
              <div>{{ item.textValue }}</div>
            </el-form-item>
          </div>
          <!-- 按钮信息 -->
          <div v-for="item in formData.payeeAccountConfig.buttons" :key="item.buttonConfigId">
            <div v-for="param in item.buttonParamList" :key="param.buttonParamId" class="params">
              <el-form-item :label="param.paramTitle">
                <div>{{ param.buttonParamValue }}</div>
              </el-form-item>
            </div>
          </div>

          <!-- 二维码设置 -->
          <div v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">
            <el-form-item label="生成方式" prop="">
              <div>
                {{
                  formData.payeeAccountConfig.qrConfig.parseType == 0
                    ? '原图'
                    : formData.payeeAccountConfig.qrConfig.parseType == 1
                    ? '上传并解析'
                    : '直接配置数据'
                }}
              </div>
            </el-form-item>

            <template
              v-if="
                formData.payeeAccountConfig.qrConfig.parseType == 1 ||
                formData.payeeAccountConfig.qrConfig.parseType == 0
              "
            >
              <el-form-item label="二维码"> </el-form-item>
              <div style="text-align: center">
                <el-image
                  style="width: 300px"
                  :src="formData.payeeAccountConfig.qrConfig.fileList[0].url"
                  fit="scale-down"
                  class="hand"
                  @click="openImagePreview(formData.payeeAccountConfig.qrConfig.fileList[0].url)"
                />
              </div>
            </template>

            <el-form-item v-if="formData.payeeAccountConfig.qrConfig.parseType == 2" label="二维码">
              <el-image
                style="width: 146px; height: 146px"
                :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl"
                fit="scale-down"
                class="hand"
                @click="openImagePreview(formData.payeeAccountConfig.qrConfig.GenerQrUrl)"
              />

              <el-input
                v-model="formData.payeeAccountConfig.qrConfig.parseValue"
                type="textarea"
                :rows="4"
                readonly
                placeholder="输入数据"
                size="small"
              />
            </el-form-item>
          </div>

          <!-- 文件配置 -->
          <div
            v-if="formData.payeeAccountConfig.files && formData.payeeAccountConfig.files.length > 0"
            class="file-config"
          >
            <!-- <div
              class="title"
              style="font-weight: 700; text-align: left; margin-bottom: 10px; margin-left: 10px"
            >
              文件配置
            </div> -->

            <el-form-item
              v-for="(item, index) in formData.payeeAccountConfig.files"
              :key="index"
              :label="item.fileTitle"
            >
              <!-- <el-input readonly v-model="item.fileList[0].name" size="small" /> -->
              <div style="display: flex; justify-content: space-between; padding-right: 50px">
                <span> {{ item.fileList.length > 0 ? item.fileList[0].name : '' }} </span>

                <el-button
                  size="mini"
                  plain
                  type="primary"
                  @click="
                    item.fileList.length > 0
                      ? downloadFile(item.fileList[0].url, item.fileList[0].name)
                      : ''
                  "
                  >下载</el-button
                >
              </div>
              <div class="red_tip">说明： {{ item.remark }}</div>
            </el-form-item>
          </div>
        </div>
        <div v-else v-loading="true"></div>
      </el-form>
      <!-- <div slot="footer">
        <el-button type="primary" size="small" @click="showAccountInfoVisible = false">
          关闭
        </el-button>
      </div> -->
    </el-dialog>

    <el-dialog
      :visible.sync="showBlackDialogVisual"
      title="一键拉黑"
      width="400px"
      @close="onBlackBtnCancel"
    >
      <el-form
        ref="blackFormDataRef"
        :model="blackFormData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="请选择：" prop="black">
          <el-radio-group v-model="blackFormData.black">
            <el-radio :label="3">全部</el-radio>
            <el-radio :label="2"  style="margin: 10px 0;" >付款人姓名</el-radio>
            <el-radio :label="1">付款人IP</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- <div class="tips" >
        确认要拉黑付款人IP吗？
      </div> -->
      <div slot="footer" style="text-align: center" >
        <el-button @click="onBlackBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onBlackBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <halfHourBill
      ref="halfHourBill"
      v-if="showhalfHourBill"
      @close="showhalfHourBill = false"
      :orderItem="currOrder"
    ></halfHourBill>

    <ImagePreviewer
      :visible="imagePreview.visible"
      :src="imagePreview.src"
      @update:visible="onImagePreviewVisibleChange"
    />
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

import { formatDateTime, checkPassword } from '@/utils'
import ImagePreviewer from '@/views/service-manager/components/ImagePreviewer.vue'
import { orderRules, queryRules } from './rules.js'

import FileSaver from 'file-saver'
import { downloadFile } from '@/utils'
import { getProductListByUserId } from '@/api/service-product-mananger.js'

import {
  getPayeeAccountInfoById,
  getPayeeAccountListByProviderId
} from '@/api/service-income-info.js'
import { getFileById } from '@/api/upload'

import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'
import halfHourBill from './components/halfHourBill.vue'
import {
  getProviderCollectOrderListPage,
  exportProviderCollectOrderDetail,
  providerCollectOrderRepay,
  providerCollectOrderConfirm,
  providerCollectOrderCancel,
  getPayeeAccountByName,
  getOrderPayeeAccountInfo,
  getSubmitInfoInfo,
  addBlackList
} from '@/api/order-manage/collect-order.js'
export default {
  name: 'CollectOrder',
  components: { halfHourBill, ImagePreviewer },
  data() {
    return {
      allSelected: true, // 全选
      allItems: [
        '订单号',
        '金额',
        '产品信息',
        '收款信息',
        '付款人信息',
        '订单时间',
        '状态',
        '转账备注',
        '提交信息',
        '近半小时流水',
        '确认用户名',
        '操作'
      ],

      selectedItems: [],
      SAVE_KEY: 'asdfasdfasdfasd_colectorder_selectedItems',

      payeeAccountList: [], // 收款信息列表
      rules: orderRules,
      queryRules,
      tableData: [],
      dialogVisible: false,
      showhalfHourBill: false,
      queryFormData: this.getQueryForm(),
      currOrder: {},
      minOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' }
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minOrderAmount) ||
        //       isEmpty(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (
        //       Number(this.queryFormData.minOrderAmount) > Number(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback(new Error('必须小于最大金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],
      maxOrderAmountRules: [
        { validator: amountCheck, trigger: 'blur' }
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minOrderAmount) ||
        //       isEmpty(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (
        //       Number(this.queryFormData.minOrderAmount) > Number(this.queryFormData.maxOrderAmount)
        //     ) {
        //       return callback(new Error('必须大于最小金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],

      minPayAmountRules: [
        { validator: amountCheck, trigger: 'blur' }
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minPayAmount) ||
        //       isEmpty(this.queryFormData.maxPayAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (Number(this.queryFormData.minPayAmount) > Number(this.queryFormData.maxPayAmount)) {
        //       return callback(new Error('必须小于最大金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],
      maxPayAmountRules: [
        { validator: amountCheck, trigger: 'blur' }
        // {
        //   validator: (rule, value, callback) => {
        //     if (
        //       isEmpty(this.queryFormData.minPayAmount) ||
        //       isEmpty(this.queryFormData.maxPayAmount)
        //     ) {
        //       return callback()
        //     }

        //     if (Number(this.queryFormData.minPayAmount) > Number(this.queryFormData.maxPayAmount)) {
        //       return callback(new Error('必须大于最小金额'))
        //     }
        //     callback()
        //   },
        //   trigger: 'blur'
        // }
      ],

      isEdit: false, // 是否是编辑状态
      orderStateOptions: [
        { label: '已生成', value: 0, type: 'info' },
        { label: '待接单', value: 1, type: 'info' },
        { label: '已接单', value: 2, type: '' },
        { label: '已成功', value: 3, type: 'success' },
        { label: '已取消', value: 4, type: 'warning' },
        { label: '已超时', value: 5, type: 'warning' },
        { label: '恶意拉单', value: 6, type: 'danger' },
        { label: '未出码', value: 7, type: 'danger' },
        { label: '无码订单', value: 8, type: 'danger' },
        { label: '冲正', value: 9, type: 'danger' },
        { label: '未访问', value: 10, type: 'danger' }
      ],
      notifyStatusOptions: [
        { label: '未通知', value: 0, type: 'info' },
        { label: '通知成功', value: 1, type: 'success' },
        { label: '通知失败', value: 2, type: 'danger' }
        // { label: '响应成功', value: 3, type: 'success' },
        // { label: '响应失败', value: 4, type: 'warning' }
      ],

      autoCheckList: [],
      flushTips: '',
      currFlushSecond: 0,
      autoFlushFlag: '',
      trans_product_visual: false, // 交易者信息 弹窗
      commonFormData: {},
      commonDialogVisible: false,
      commonDialogTitle: '',
      commonDialogType: 0,
      // 提交信息弹框
      submit_info_dialog_visible: false,
      submit_info_formData: {
        password: '',
        isShow: false,
        systemOrderNo: ''
      },
      productList: [],
      collectInfoList: [],
      showAccountInfoVisible: false,
      formData: {},
      imagePreview: {
        visible: false,
        src: ''
      },
      showBlackDialogVisual: false,
      blackFormData: {},

    }
  },
  mounted() {
    this.loadAllPayeeAccountInfo()
    getProductListByUserId().then((res) => {
      if (res.data && res.data.length > 0) {
        this.productList = res.data
        this.$store.state.order.productList = res.data
      }
    })

    // 读取配置,如果没有，就全选
    this.selectedItems = localStorage.getItem(this.SAVE_KEY)
      ? JSON.parse(localStorage.getItem(this.SAVE_KEY))
      : this.allItems

    this.allSelected = this.selectedItems.length === this.allItems.length
  },

  methods: {

    showBlackDialog(row) {
      this.showBlackDialogVisual = true
      this.blackFormData = {
        black: 1,
        orderId: row.orderId,
        payerIp: row.payerIp,
        payerName: row.payerName
      }
    },
    onBlackBtnCancel() {
      this.showBlackDialogVisual = false
      this.$refs.blackFormDataRef.resetFields()
    },
    async onBlackBtnOk() {
      // this.$refs.blackFormDataRef.validate(async (valid) => {
      //   if (valid) {
          let res = await addBlackList({
            tenantId: this.$store.state.user.tenantId,
            orderId: this.blackFormData.orderId,
            payerIp: this.blackFormData.black == 2 ? '' : this.blackFormData.payerIp,
            payerName: this.blackFormData.black == 1 ? '' : this.blackFormData.payerName
          })
          console.log(res, 'res')
          this.$message.success('操作成功')
          this.onBlackBtnCancel()
      //   }
      // })
    },


    openImagePreview(url) {
      if (!url) return
      this.imagePreview = {
        visible: true,
        src: url
      }
    },

    onImagePreviewVisibleChange(val) {
      this.imagePreview.visible = val
      if (!val) {
        this.imagePreview.src = ''
      }
    },
    handleAllSelectChange(val) {
      if (val) {
        this.selectedItems = [...this.allItems]
      } else {
        this.selectedItems = []
      }
    },
    handleItemChange(val) {
      this.allSelected = val.length === this.allItems.length

      // 保存选择的
      console.log(this.selectedItems)

      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.selectedItems))
    },
    async loadAllPayeeAccountInfo() {
      // let res = await getPayeeAccountListByProviderId(this.$store.state.user.personalInfo.providerId)
      // this.payeeAccountList = res.data
    },
    downloadFile,
    async loadTableData(page) {
      const params = {
        // tenantId: this.$store.state.user.tenantId
        // orderStatus:'1'
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

      // 操作类型(0-当前码商、1-下级码商)
      params.operationType = 0
      const res = await getProviderCollectOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    look_bill_info(row) {
      this.currOrder = row
      this.showhalfHourBill = true
    },

    flushPage() {
      this.queryTableData()
    },
    async payeeAccountChange(e) {
      if (e) {
        let res = await getPayeeAccountByName({
          payeeAccountName: e,
          providerId: this.$store.state.user.personalInfo.providerId
        })
        this.collectInfoList = res.data
      }
    },

    resetQueryForm() {
      this.collectInfoList = []
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormRef.resetFields()
      this.$refs.tableRef.getTableData(1)
    },
    getQueryForm() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      const todayStr = formatDateTime(today)
      return {
        channelId: '',
        productId: '',
        collectInfoId: '',
        merchantId: '',
        providerId: '',
        orderStatus: '',
        notifyStatus: '',
        createTime: [todayStr, nowStr]
      }
    },

    queryTableData() {
      this.$refs.queryFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // 刷新表格
        this.$refs.tableRef.getTableData(1)
      })
    },

    async handleDownload() {
      // 本地导出, 改为  联网导出
      let params = {
        operationType: 0
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key]) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      const res = await exportProviderCollectOrderDetail(params)
      FileSaver.saveAs(res, '代收订单列表.xlsx')
    },
    clipboard,
    look_submit_info(row) {
      this.submit_info_formData = {
        tradePassword: '',
        isShow: false,
        submitInfo: '',
        orderId: row.orderId
      }
      this.submit_info_dialog_visible = true

      this.doLookInfo()
    },

    async doLookInfo() {
      let ret = await getSubmitInfoInfo(this.submit_info_formData.orderId, {
        tenantId: this.$store.state.user.tenantId
      })
      this.submit_info_formData.submitInfo = JSON.parse(ret.data)
      this.submit_info_formData.isShow = true

      // 如果提交的信息中有图片，异步加载图片
      this.submit_info_formData.submitInfo.forEach(async (item) => {
        if (item.showType == 1) {
          let res = await getFileById(item.submitInfoValue)

          item.imageUrl = res.data.fileUrl
          this.$forceUpdate()
        }
      })
    },

    closeInfoDialog() {
      this.submit_info_dialog_visible = false
      this.submit_info_formData = {
        tradePassword: '',
        isShow: false,
        submitInfo: '',
        orderId: ''
      }
    },
    onCommonBtnCancel() {
      this.commonDialogVisible = false
      this.$nextTick(() => {
        this.$refs.commonFormData.resetFields()
        this.$refs.commonFormData.clearValidate()
      })
    },

    async onCommonBtnOK() {
      this.$refs.commonFormData.validate(async (valid) => {
        if (valid) {
          if (this.commonDialogType == 0) {
            // 取消
            await providerCollectOrderCancel(this.commonFormData.orderId)
          } else if (this.commonDialogType == 1) {
            // 判断是否需要二次确认，如果需要输入密码
            if (this.$store.getters['isSecondConfirmOrder']) {
              // 二次确认需要密码
              try {
                let ret = await checkPassword(this)
                if (!ret.data) {
                  this.$message.error('密码错误')
                  return
                }
              } catch (err) {
                console.log('err-6666--' + err)
                return
              }
            }

            // 确认
            await providerCollectOrderConfirm(this.commonFormData.orderId, {
              payerName: this.commonFormData.payerName,
              payerIp: this.commonFormData.payerIp
            })
          } else if (this.commonDialogType == 2) {
            // 补单
            await providerCollectOrderRepay(this.commonFormData.orderId)
          }
          this.$message.success(`${this.commonDialogTitle} 成功`)
          this.flushPage()

          this.onCommonBtnCancel()
        }
      })
    },
    showCommonDialog(row, type) {
      this.commonDialogType = type
      this.commonDialogTitle =
        type == 0 ? '取消订单' : type == 1 ? '确认订单' : type == 2 ? '补单' : '修改金额'
      this.commonDialogVisible = true

      this.commonFormData = {
        orderId: row.orderId,
        systemOrderNo: row.systemOrderNo,
        merchantOrderNo: row.merchantOrderNo,
        orderAmount: row.orderAmount,
        pay_order_money: row.payAmount,
        new_pay_order_money: '',
        password: '',
        payerName: row.payerName,
        payerIp: row.payerIp,
        collectInfoName: row.collectInfoName,
        transferRemark: row.transferRemark,
        createTime: row.createTime
      }
    },
    checkGroupChange(ele) {
      if (ele.length > 0) {
        this.currFlushSecond = ele[ele.length - 1]
        this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        this.autoCheckList = [ele[ele.length - 1]]
        clearInterval(this.autoFlushFlag)
        this.autoFlushFlag = setInterval(() => {
          this.currFlushSecond--
          if (this.currFlushSecond == 0) {
            this.currFlushSecond = ele[ele.length - 1]
            this.flushPage()
          }
          this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        }, 1000)
      } else {
        clearInterval(this.autoFlushFlag)
        this.flushTips = ''
      }
    },
    look_trans_product_info(row) {
      this.trans_product_visual = true
    },
    async look_shoukuan_info(row) {
      // if (!row.collectInfoId) {
      //   this.$message.error('收款信息不存在', row.collectInfoId)
      //   return
      // }

      this.showAccountInfoVisible = true

      this.formData = Object.assign({}, row)

      // const res = await getPayeeAccountInfoById(row.collectInfoId) // 旧的
      const res = await getOrderPayeeAccountInfo(row.orderId) // 新的

      const qrConfig = res.data.qrConfig
      qrConfig.fileId = qrConfig.qrUrl // 其实是 fileId

      if (qrConfig.parseType == null) {
        qrConfig.parseType = 0
        qrConfig.fileList = []
        console.error('-----不应该出现的情况，-----', qrConfig.parseType)
      } else if (qrConfig.parseType != 2) {
        // 0 原图 1 上传并解析

        let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId

        qrConfig.fileList = [
          {
            name: resp.data.originalName,
            url: resp.data.fileUrl
          }
        ]
        this.qrImageUrl = resp.data.fileUrl
      } else {
        let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId
        qrConfig.GenerQrUrl = resp.data.fileUrl ? resp.data.fileUrl : ''
        qrConfig.parseValue = qrConfig.parseValue ? qrConfig.parseValue : ''
      }

      if (res.data.files) {
        for (let index = 0; index < res.data.files.length; index++) {
          const ele = res.data.files[index]
          ele.fileId = ele.fileUrl

          let resp = await getFileById(ele.fileId) // 其实是 fileId

          ele.fileList = [
            {
              name: resp.data.originalName,
              url: resp.data.fileUrl
            }
          ]
        }
      }

      this.formData = {
        ...this.formData,
        payeeAccountConfig: {
          texts: res.data.texts,
          buttons: res.data.buttons,
          qrConfig: qrConfig,
          files: res.data.files
        }
      }
    },

    allNotify() {
      this.$confirm('确认要将全部未通知成功的订单重新通知吗？')
        .then((_) => {
          // done();
        })
        .catch((_) => {})
    },
    notice_merchant(row) {
      this.$confirm(`确认要通知商户 【 ${row.trans_merchant_no} 】 吗？`)
        .then((_) => {
          // done();
        })
        .catch((_) => {})
    },

    // showEditDialog(row) {
    //   this.isEdit = true
    //   this.dialogVisible = true
    //   this.formData = Object.assign({}, row)
    // },
    // showAddDialog() {
    //   this.isEdit = false
    //   this.dialogVisible = true
    //   this.formData = {
    //     index: '',
    //     systemOrderNo: '',
    //     merchantOrderNo: '',
    //     orderAmount: '',
    //     pay_order_money: '',
    //     channelId: '',
    //     product_name: '',
    //     shoukuan_info: '',
    //     trans_merchant_no: '',
    //     trans_product_no: '',
    //     create_time: '',
    //     confirm_time: '',
    //     notice_time: '',
    //     ood_time: '',
    //     order_state: '',
    //     notice_state: '',
    //     order_confirm_user_name: '',
    //     payment_info: '',
    //     submit_info: '',
    //     opt: ''
    //   }
    // },
    // orderInfo() {
    //   this.$refs.incomeOrderInfo.drawer = true
    // },
    // onDialogBtnOk() {
    //   this.dialogVisible = false
    //   if (this.isEdit) {
    //     // 编辑
    //     this.tableData = this.tableData.map((item) => {
    //       if (item.id === this.formData.id) {
    //         return this.formData
    //       }
    //       return item
    //     })
    //   } else {
    //     // 新增
    //     this.formData.id = Date.now()
    //     this.tableData.push(this.formData)
    //   }
    // },
    getCollectInfoDisplay(collectInfoContent) {
      if (!collectInfoContent || collectInfoContent === '收款信息不存在!') {
        return '收款信息不存在!'
      }

      try {
        const parsed = JSON.parse(collectInfoContent)
        if (parsed.texts && Array.isArray(parsed.texts)) {
          return parsed.texts
            .filter((text) => text.textTitle && text.textValue !== undefined && text.isShow)
            .map((text) => `${text.textTitle}:${text.textValue || ''}`)
            .join('<br>')
        }
        return ''
      } catch (error) {
        console.error('解析收款信息失败:', error)
        return ''
      }
    },

    getCollectInfoText(collectInfoContent) {
      if (!collectInfoContent || collectInfoContent === '收款信息不存在!') {
        return '收款信息不存在!'
      }

      try {
        const parsed = JSON.parse(collectInfoContent)
        if (parsed.texts && Array.isArray(parsed.texts)) {
          return parsed.texts
            .filter((text) => text.textTitle && text.textValue !== undefined)
            .map((text) => `${text.textTitle}:${text.textValue || ''}`)
            .join('\n')
        }
        return ''
      } catch (error) {
        console.error('解析收款信息失败:', error)
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-box {
  display: flex;
  justify-content: space-between;
}

.gongji {
  margin-bottom: 20px;

  .box {
    display: flex;
    justify-content: space-between;
  }

  .item-card {
    margin: 0 10px;
  }

  .title {
    margin-bottom: 10px;
  }

  .item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    height: 70px;
    //  border: 1px solid red;

    .txt {
      display: flex;
      justify-content: center;
      // padding: 0 10px;
      width: 30%;
      height: 20px;
      line-height: 20px;
      font-size: 14px;

      .label {
        // width: 120px;
        text-align: right;
        margin-right: 10px;
      }

      .money {
        color: green;
      }
    }
  }
}

.auto-flush {
  display: flex;
  padding: 10px;
}

.demo-form-inline {
  .zhi {
    ::v-deep .el-form-item__label {
      padding-right: 5px;
    }
  }
}

.flush-tips {
  font-size: 14px;
  color: red;
}

.container {
  .filter-container {
    padding: 10px;
  }
}

::v-deep .el-drawer__body {
  padding: 0 30px !important;
}

.info-con {
  display: flex;
  flex-wrap: wrap;
}

.line-label {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
}

.line-content {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
}

.info-line {
  width: 50%;
}

.tag-purple {
  color: #722ed1;
  background: #f9f0ff;
  border-color: #d3adf7;
}

.tag-pink {
  color: #eb2f96;
  background: #fff0f6;
  border-color: #ffadd2;
}

::v-deep .deal-order {
  .el-form {
    .el-form-item__label {
      color: #999;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    .el-input.is-disabled {
      .el-input__inner {
        color: black;
        border-color: transparent;
        background-color: transparent;
        padding-left: 0;
      }
    }

    .el-input.is-disabled.money {
      .el-input__inner {
        color: red;
        font-weight: 600;
      }
    }
  }
}

::v-deep .add-form {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-dialog__body {
    padding-top: 0px;
  }
}
</style>
