<template>
  <div class="container">
    <el-card>
      <el-form
        ref="queryFormRef"
        :rules="queryRules"
        :inline="true"
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
            placeholder="订单金额"
            size="small"
            clearable
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
            placeholder="最小金额"
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
            placeholder="最大金额"
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

        <el-form-item label="审核用户名" prop="">
          <el-input
            v-model="queryFormData.confirmOrderUserName"
            placeholder="请输入审核用户名"
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
            :default-time="['00:00:00', '23:59:59']"
            align="right"
            unlink-panels
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

    <el-card class="mt-10" v-loading="patchLoading">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex; gap: 15px; align-items: center">
          <el-button
            type="primary"
            :disabled="selectionRows.length == 0"
            icon="el-icon-edit-outline"
            @click="batchConfirm()"
            >批量确认</el-button
          >

          <el-button
            type="danger"
            :disabled="selectionRows.length == 0"
            plain
            icon="el-icon-edit"
            @click="batchReject()"
            >批量驳回</el-button
          >

          <el-button
            type="warning"
            :disabled="selectionRows.length == 0"
            plain
            icon="el-icon-edit-outline"
            @click="batchCancel()"
            >批量取消</el-button
          >

          <el-button type="success" plain icon="el-icon-download" @click="handleDownload()"
            >导出</el-button
          >
        </div>
        <div class="auto-flush">
          <span class="mr-10">自动刷新</span>
          <el-checkbox-group v-model="autoCheckList" @change="checkGroupChange">
            <el-checkbox :label="10">10秒</el-checkbox>
            <el-checkbox :label="30">30秒</el-checkbox>
            <el-checkbox :label="60">60秒</el-checkbox>
          </el-checkbox-group>
          <span class="flush-tips ml-10">{{ flushTips }}</span>
        </div>
      </div>

      <my-table
        ref="tableRef"
        class="mt-10"
        :load-data="loadTableData"
        :table-data="tableData"
        :defaultPageSize="30"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >

        <el-table-column label="选择" align="center" type="selection" width="60" />

        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="订单号" align="center" width="240">
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
                >
                  {{ row.systemOrderNo }}
                </span>
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

        <el-table-column label="订单金额(元)" align="center" width="90">
          <template slot-scope="{ row }">
            <div>
              <div>
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
            </div>
          </template>
        </el-table-column>

        <el-table-column label="产品信息" align="center" width="180">
          <template slot-scope="{ row }">
            {{ row.productName }}
          </template>
        </el-table-column>

        <el-table-column label="收款信息" width="120" align="center" prop="paymentData">
          <template slot-scope="{ row }">
            <!-- 0 -收款链接，1-图片base64，2-文本信息 -->
            <div v-if="row.paymentDataType == 2">
              <div
                v-if="row.paymentData"
                style="display: flex; flex-direction: column; align-items: flex-start"
              >
                <div>
                  <el-tag>收款人</el-tag>
                  {{ JSON.parse(row.paymentData).payee }}
                </div>
                <div class="mt-5">
                  <el-tag>账号</el-tag>
                  {{ JSON.parse(row.paymentData).payeeNo }}
                </div>
                <div class="mt-5">
                  <el-tag>地址</el-tag>
                  {{ JSON.parse(row.paymentData).payeeAddress }}
                </div>
              </div>
            </div>
            <el-image
              v-else
              class="img"
              style="width: 100px; height: 100px"
              :src="row.paymentData"
              :preview-src-list="row.paymentData"
            ></el-image>
          </template>
        </el-table-column>

        <!-- <el-table-column label="收款码" align="center" prop="shoukuan_info">
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_shoukuan_info(row)">查看</el-button>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="付款说明" align="center" prop="paymentDesc">
          <template slot-scope="{ row }">
           {{ row.paymentDesc }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="交易者信息" align="center">
          <template slot-scope="{ row }">
            <div>
               <div><el-tag>商户</el-tag> {{ row.trans_merchant_no }}</div>
              <div class="mt-5"><el-tag>码商</el-tag> {{ row.providerUserName }}</div>
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="商户" align="center" prop="trans_merchant_no" />
        <el-table-column label="码商" align="center" prop="trans_product_no" /> -->

        <el-table-column label="订单时间" align="center" width="220px">
          <template slot-scope="{ row }">
            <div style="text-align: left">
              <div v-if="row.createTime"><el-tag>创建时间:</el-tag> {{ row.createTime }}</div>
              <div v-if="row.receiveTime"><el-tag>接单时间:</el-tag> {{ row.receiveTime }}</div>
              <div v-if="row.confirmOrderTime">
                <el-tag>确认时间:</el-tag> {{ row.confirmOrderTime }}
              </div>
              <div v-if="row.notifyTime"><el-tag>通知时间:</el-tag> {{ row.notifyTime }}</div>
              <div v-if="row.repaymentTime"><el-tag>回款时间:</el-tag> {{ row.repaymentTime }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="创建时间" align="center" sortable prop="create_time">
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>

        <el-table-column label="确认时间" align="center" sortable prop="confirm_time">
          <template slot-scope="{ row }">
            {{ row.confirm_time }}
          </template>
        </el-table-column>

        <el-table-column label="通知时间" align="center" sortable prop="notice_time">
          <template slot-scope="{ row }">
            {{ row.notice_time }}
          </template>
        </el-table-column>

        <el-table-column label="过期时间" align="center" sortable prop="ood_time">
          <template slot-scope="{ row }">
            {{ row.ood_time }}
          </template>
        </el-table-column> -->

        <el-table-column label="状态" align="center" width="160px">
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
              <div v-if="row.auditStatus >= 0">
                审核状态:
                <el-tag v-if="row.auditStatus == 0">无需审核</el-tag>
                <el-tag v-if="row.auditStatus == 1" type="info">待审核</el-tag>
                <el-tag v-if="row.auditStatus == 2" type="success">通过</el-tag>
                <el-tag v-if="row.auditStatus == 3" type="danger">驳回</el-tag>
              </div>
              <div v-if="row.repaymentStatus == 0 || row.repaymentStatus == 1">
                回款状态:
                <el-tag v-if="row.repaymentStatus == 0" type="danger">待回款</el-tag>
                <el-tag v-if="row.repaymentStatus == 1" type="success">已回款</el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="转账凭证" align="center" prop="submit_info">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.transferVoucher && row.transferVoucher.length > 0"
              type="text"
              @click="look_submit_info(row)"
              >查看</el-button
            >
          </template>
        </el-table-column>

        <el-table-column label="审核用户名" align="center" prop="auditResultPeople">
          <template slot-scope="{ row }"> {{ row.confirmOrderUserName }} </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="120px" fixed="right">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 0)">
                <i class="el-icon-s-release" />取消订单
              </div>

              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 1)">
                <i class="el-icon-s-claim" />确认订单
              </div>

              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 2)">
                <i class="el-icon-s-promotion" />驳回订单
              </div>

              <div type="primary" class="btn mt-5" @click="showDetail(row)">
                <i class="el-icon-s-order" />详情
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-drawer title="订单详情" :visible.sync="drawerVisible" direction="rtl" size="40%">
      <div class="request" v-loading="$store.state.app.loading">
        <p class="req-line2">
          <span class="req-label">付款说明：</span>
          <el-input
            disabled
            style="margin-top: 15px"
            type="textarea"
            readonly
            :autosize="{ minRows: 6 }"
            :value="orderDetail.paymentDesc"
          />
        </p>
        <p class="req-line2">
          <span class="req-label">转账说明：</span>
          <el-input
            disabled
            style="margin-top: 15px"
            type="textarea"
            readonly
            :autosize="{ minRows: 6 }"
            :value="orderDetail.transferDesc"
          />
        </p>
        <p class="req-line2">
          <span class="req-label">审核说明：</span>
          <el-input
            disabled
            style="margin-top: 15px"
            type="textarea"
            readonly
            :autosize="{ minRows: 6 }"
            :value="orderDetail.auditResultRemark"
          />
        </p>
      </div>
    </el-drawer>

    <el-dialog
      :visible.sync="commonDialogVisible"
      :title="commonDialogTitle"
      width="600px"
      @close="onCommonBtnCancel()"
    >
      <el-form
        ref="formRef"
        :model="commonFormData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="">
          <el-input
            v-model="commonFormData.systemOrderNo"
            disabled
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item v-if="[0, 1, 2].includes(commonDialogType)" label="商户订单号" prop="">
          <el-input
            v-model="commonFormData.merchantOrderNo"
            disabled
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="">
          <el-input
            v-model="commonFormData.orderAmount"
            disabled
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="收款人" prop="" v-if="commonFormData.paymentDataType == 2">
          <el-input
            :value="JSON.parse(commonFormData.paymentData).payee"
            disabled
            placeholder=""
            size="small"
          />
        </el-form-item>
        <el-form-item label="账号" prop="" v-if="commonFormData.paymentDataType == 2">
          <el-input
            :value="JSON.parse(commonFormData.paymentData).payeeNo"
            disabled
            placeholder=""
            size="small"
          />
        </el-form-item>
        <el-form-item label="地址" prop="" v-if="commonFormData.paymentDataType == 2">
          <el-input
            :value="JSON.parse(commonFormData.paymentData).payeeAddress"
            disabled
            placeholder=""
            size="small"
          />
        </el-form-item>

        <el-form-item
          label="收款信息"
          prop="paymentData"
          v-if="commonFormData.paymentDataType != 2"
        >
          <el-image
            class="img"
            style="width: 100px; height: 100px"
            :src="commonFormData.paymentData"
          >
          </el-image>
        </el-form-item>

        <el-form-item v-if="commonDialogType == 1" label="付款说明" prop="paymentDesc">
          <el-input
            v-model="commonFormData.paymentDesc"
            disabled
            placeholder="请输入付款说明"
            size="small"
          />
        </el-form-item>

        <el-form-item v-if="commonDialogType == 1" label="转账说明" prop="transferDesc">
          <el-input
            v-model="commonFormData.transferDesc"
            placeholder="请输入转账说明"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item v-if="commonDialogType == 3" required label="审核说明">
          <el-select
            filterable
            v-model="commonFormData.checkReason"
            placeholder="请选择原因"
            size="small"
          >
            <el-option v-for="i in 5" :key="i" :label="`说明` + i" :value="i"></el-option>
            <el-option label="其他说明" :value="6"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item
          v-if="commonDialogType == 3 && commonFormData.checkReason == 6"
          required
          label="其他说明"
          prop="systemOrderNo"
        >
          <el-input
            v-model="commonFormData.otherCheckReson"
            placeholder="请输入审核说明"
            size="small"
          />
        </el-form-item> -->

        <el-form-item v-if="commonDialogType == 2" label="驳回原因" prop="rejectReson">
          <el-select
            v-model="commonFormData.rejectReson"
            filterable
            placeholder="请选择原因"
            size="small"
          >
            <!-- <el-option v-for="i in 5" :key="i" :label="`原因` + i" :value="`原因` + i" /> -->

            <el-option label="信息不符" value="信息不符" />
            <el-option label="信用卡" value="信用卡" />
            <el-option label="银行卡退款" value="银行卡退款" />
            <el-option label="账号限制收款" value="账号限制收款" />
            <el-option label="会员账号设置隐私" value="会员账号设置隐私" />
            <el-option label="未实名" value="未实名" />
            <el-option label="账户风险" value="账户风险" />

            <el-option label="其他原因" :value="6" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="commonDialogType == 2 && commonFormData.rejectReson == 6"
          label="其他原因"
          prop="auditResultRemark"
        >
          <el-input
            v-model="commonFormData.auditResultRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
            size="small"
          />
        </el-form-item>
        <!-- <el-upload
            class="avatar-uploader"
            action="#"
            multiple
            :auto-upload="false"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <div
              v-else
              style="
                width: 50px;
                height: 50px;
                border: 1px solid #dfe4ed;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </el-upload> -->
        <el-form-item v-if="[1, 2].includes(commonDialogType)" label="凭证" prop="transferVoucher">
          <!-- :rules="commonDialogType == 2 ? '' : uploadTransFerRules" -->
          <el-upload
            ref="upload"
            class="upload-demo"
            action="#"
            :on-remove="handleRemove"
            accept="image/*"
            :on-change="handleChange"
            :http-request="uploadImage"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :file-list="commonFormData.transferVoucher"
            :limit="3"
            multiple
            list-type="picture-card"
            :auto-upload="true"
          >
            <i class="el-icon-plus" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="commonDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onCommonBtnOK()"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="submit_info_dialog_visible" title="查看转账凭证" width="500px">
      <span>共计 {{ pingImgShowList.length }} 张图片</span>
      <div class="img-box">
        <el-image
          v-for="(item, i) in pingImgShowList"
          :key="i"
          class="img"
          style="width: 200px; height: 200px"
          :src="item.url"
          :preview-src-list="pingImgShowList.map((item) => item.url)"
        />
      </div>

      <div style="text-align: center">
        <el-button type="primary" size="small" @click="submit_info_dialog_visible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog :visible.sync="showChuliDialogVisual" title="处理订单" width="600px">
      <el-form
        ref="form"
        :model="commonFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            disabled
            v-model="commonFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="systemOrderNo">
          <el-input
            disabled
            v-model="commonFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="merchant_order_money">
          <el-input
            disabled
            v-model="commonFormData.merchant_order_money"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="收款信息" prop="systemOrderNo">
          <el-input
            disabled
            v-model="commonFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="驳回原因" prop="systemOrderNo">
          <el-input
            v-model="commonFormData.systemOrderNo"
            placeholder="请输入驳回原因"
            size="small"
          />
        </el-form-item>

        <el-form-item label="凭证上传" prop="systemOrderNo">
          <el-upload
            class="avatar-uploader"
            action="#"
            multiple
            :auto-upload="false"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div style="text-align: center">
          <el-button @click="showChuliDialogVisual = false" type="danger" size="small">
            驳回订单
          </el-button>
          <el-button
            @click="showChuliDialogVisual = false"
            size="small"
            type="warning"
            style="margin: 0 40px"
          >
            取消订单
          </el-button>
          <el-button type="primary" @click="showChuliDialogVisual = false" size="small">
            确认订单
          </el-button>
        </div>
      </div>
    </el-dialog> -->

    <!-- <el-dialog :visible.sync="fenpeiDialogVisual" title="分配订单" width="600px">
      <el-form
        ref="form"
        :model="fenpeiFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            disabled
            v-model="fenpeiFormData.systemOrderNo"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="merchant_order_money">
          <el-input
            disabled
            v-model="fenpeiFormData.merchant_order_money"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="选择码商" prop="choose_service">
          <el-select filterable v-model="fenpeiFormData.choose_service">
            <el-option
              v-for="i in 10"
              :key="i"
              :label="'码商' + i"
              :value="'码商' + i"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="交易密码" prop="password">
          <el-input
            v-model="commonFormData.password"
            type="password"
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="fenpeiDialogVisual = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="fenpeiDialogVisual = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

import { formatDateTime, checkPassword } from '@/utils'

import FileSaver from 'file-saver'

import { orderRules, queryRules } from './rules.js'

import { imageUploadServer } from '@/settings'

import { getProductListByUserId } from '@/api/service-product-mananger.js'

import { getFileById } from '@/api/upload'

import {
  paymentOrderReject,
  getProviderPaymentOrderListPage,
  getPaymentOrderDetail,
  exportProviderPaymentOrderDetail,
  providerPaymentOrderConfirm,
  providerPaymentOrderCancel
} from '@/api/order-manage/agent-pay.js'

import { uploadFileToServer } from '@/api/upload'

import { amountCheck } from '@/utils/validate.js'
import { isEmpty } from '@/utils'

export default {
  name: 'AgentPay',
  data() {
    return {
      uploadTransFerRules: [
        { required: true, message: '请选择文件', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            console.log('---uploadTransFerRules----------', value)

            if (value.length > 0) {
              return callback()
            } else {
              return callback(new Error('请选择文件'))
            }
          },
          trigger: 'blur'
        }
      ],
      queryRules,
      rules: orderRules,
      imageUploadServer: imageUploadServer,
      activeName: 'orderInfo',
      drawerVisible: false,
      tableData: [],
      dialogVisible: false,
      formData: {},
      queryFormData: this.getQueryForm(),
      isEdit: false, // 是否是编辑状态

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

      channel_nameOptions: [
        { label: '通道1', value: 1 },
        { label: '通道2', value: 2 },
        { label: '通道3', value: 3 }
      ],
      product_nameOptions: [
        { label: '产品1', value: 1 },
        { label: '产品2', value: 2 },
        { label: '产品3', value: 3 }
      ],
      orderStateOptions: [
        { label: '已生成', value: 0, type: 'info' },
        { label: '待接单', value: 1, type: 'info' },
        { label: '已接单', value: 2, type: 'success' },
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

      huikuan_stateOptions: [
        { label: '待回款', value: '0', type: 'warning' },
        { label: '已回款', value: '1', type: 'success' }
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
      pingImgRandom: 1,
      pingImgShowList: [],

      fenpeiDialogVisual: false,
      fenpeiFormData: {
        choose_service: '',
        systemOrderNo: '',
        merchant_order_money: '',
        pay_order_money: ''
      },
      showChuliDialogVisual: false,
      productList: [],
      imageUrl: '',
      orderDetail: {
        paymentDesc: '',
        transferDesc: '',
        auditResultRemark: ''
      },
      selectionRows: [], // 选中的订单
      patchLoading: false,
    }
  },
  mounted() {
    getProductListByUserId().then((res) => {
      if (res.data && res.data.length > 0) {
        this.productList = res.data
      }
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.selectionRows = val
    },
    batchConfirm() {
      this.$confirm('确定要批量确认这些订单吗？', '批量确认确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.patchLoading = true
        // 现在还没有批量确认的接口，改为 循环调用,全部成功以后，再调用弹框提示，使用 Promise.all 来处理
        const result = await Promise.all(this.selectionRows.map(async (row) => {
          await providerPaymentOrderConfirm({
            orderId: row.orderId,
            transferDesc: '批量确认',
          })
        })).then(() => {
          this.$message.success('批量确认成功')
        }).finally(() => {
          this.patchLoading = false
          this.flushPage()
        })
      })
    },
    batchReject() {
      this.$confirm('确定要批量驳回这些订单吗？', '批量驳回确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.patchLoading = true
        // 现在还没有批量驳回的接口，改为 循环调用,全部成功以后，再调用弹框提示，使用 Promise.all 来处理
        const result = await Promise.all(this.selectionRows.map(async (row) => {
          await paymentOrderReject({
            orderId: row.orderId,
            auditResultRemark: '批量驳回',
          })
        }))
        .then(() => {
          this.$message.success('批量驳回成功')
        }).finally(() => {
          this.patchLoading = false
          this.flushPage()
        })
      })


    },
    batchCancel() {
      this.$confirm('确定要批量取消这些订单吗？', '批量取消确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.patchLoading = true
        // 现在还没有批量驳回的取消，改为 循环调用,全部成功以后，再调用弹框提示，使用 Promise.all 来处理
        const result = await Promise.all(this.selectionRows.map(async (row) => {
          await providerPaymentOrderCancel(row.orderId)
        })).then(() => {
          this.$message.success('批量取消成功')
        }).finally(() => {
          this.flushPage()
          this.patchLoading = false
        })
      })
    },
    onCommonBtnCancel() {
      this.commonDialogVisible = false
      this.$refs.formRef.resetFields()
    },

    onCommonBtnOK() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) {
          console.log('-----验证不通过-----')
          return
        }
        console.log('-----验证通过-----')

        if (this.commonDialogType == 0) {
          // 取消订单
          await providerPaymentOrderCancel(this.commonFormData.orderId)
          this.$message.success('取消订单成功')
        } else if (this.commonDialogType == 1) {
          const transferVoucher = this.commonFormData.transferVoucher
            .map((ele) => {
              // if (ele.response && ele.response.length > 0) {
              //   return ele.response[0].url
              // }
              return ele.fileId
            })
            .join(',')

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

          // 确认订单
          await providerPaymentOrderConfirm({
            orderId: this.commonFormData.orderId,
            transferDesc: this.commonFormData.transferDesc,
            transferVoucher: transferVoucher
          })
          this.$message.success('确认订单成功')
        } else if (this.commonDialogType == 2) {
          const remark =
            this.commonFormData.rejectReson == 6
              ? this.commonFormData.auditResultRemark
              : this.commonFormData.rejectReson

          const transferVoucher = this.commonFormData.transferVoucher
            .map((ele) => {
              // if (ele.response && ele.response.length > 0) {
              //   return ele.response[0].url
              // }
              return ele.fileId
            })
            .join(',')

          // 驳回订单
          await paymentOrderReject({
            orderId: this.commonFormData.orderId,
            transferVoucher: transferVoucher,
            auditResultRemark:
              this.commonDialogType == 2 && this.commonFormData.rejectReson == 6
                ? this.commonFormData.auditResultRemark
                : this.commonFormData.rejectReson
          })
          this.$message.success('驳回订单成功')
        }

        // this.$message.success('处理成功')

        this.flushPage()
        this.onCommonBtnCancel()
      })
    },

    async loadTableData(page) {
      const params = {
        // tenantId: this.$store.state.user.tenantId
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

      const res = await getProviderPaymentOrderListPage(page, params)
      this.tableData = res.data.list
      console.log(res)
      return res
    },

    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
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
      let params = {
        operationType: 0
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== undefined) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })

      const res = await exportProviderPaymentOrderDetail(params)
      FileSaver.saveAs(res, '代付订单列表.xlsx')
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type.includes('image')
      // file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    },

    clipboard,
    look_submit_info(row) {
      this.pingImgShowList = row.transferVoucher.split(',').map((ele) => {
        let item = {
          fileId: ele,
          url: '',
          name: ''
        }
        return item
      })
      this.submit_info_dialog_visible = true

      this.pingImgShowList.forEach((ele) => {
        getFileById(ele.fileId).then((res, index) => {
          ele.url = res.data.fileUrl
          ele.name = res.data.originalName
        })
      })
    },

    showCommonDialog(row, type) {
      this.commonDialogType = type
      this.commonDialogTitle =
        type == 0 ? '取消订单' : type == 1 ? '确认订单' : type == 2 ? '驳回订单' : '出错了' + type
      this.commonDialogVisible = true

      // 转账说明

      this.commonFormData = {
        orderId: row.orderId,
        systemOrderNo: row.systemOrderNo, // 系统订单号
        merchantOrderNo: row.merchantOrderNo, //  商户订单号
        orderAmount: row.orderAmount, // 订单金额
        paymentData: row.paymentData, // 收款信息
        paymentDesc: row.paymentDesc, // 付款说明
        paymentDataType: row.paymentDataType, //收款信息类型
        transferDesc: '', // 转账说明
        transferVoucher: [], // 凭证
        rejectReson: '', // 驳回原因
        otherRejectReson: '' // 其他驳回原因
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
      // this.$alert(`查看${row.systemOrderNo} 的交易者信息`, {
      //   confirmButtonText: '确定',
      //   callback: (action) => {}
      // })
      this.trans_product_visual = true
    },
    look_shoukuan_info(row) {
      this.$alert(`查看${row.systemOrderNo} 的收款码`, {
        confirmButtonText: '确定',
        callback: (action) => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
        }
      })
    },

    async showDetail(row) {
      this.drawerVisible = true
      let createTime = row.createTime
      let timestr = createTime.split(' ')
      let time = timestr.join('T')
      let res = await getPaymentOrderDetail(row.orderId, { createTime: time })
      if (res.data) {
        this.orderDetail = res.data
      }
    },

    handleChange(file, fileList) {
      // console.log('----handleChange------', fileList)
      // this.commonFormData.transferVoucher = fileList
      // 校验 上传
      this.$refs.formRef.validateField('transferVoucher')
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
      console.log('----handleSuccess------', response, file, fileList)

      //-------
      this.commonFormData.transferVoucher = fileList
      const index = this.commonFormData.transferVoucher.findIndex((ele) => ele.uid == file.uid)

      if (response && response.data) {
        let res = await getFileById(response.data)
        console.log(res)
        fileList[index].fileId = response.data
      } else {
        console.error('上传文件出错，data 为空')
        this.$message.error('上传文件出错， 请稍后重试')
        this.commonFormData.transferVoucher.splice(index, 1)
      }
    },

    handleExceed(file, fileList) {
      this.$message({
        message: '最多只能选择3张图片',
        type: 'error'
      })
    },

    handleRemove(file, fileList) {
      this.commonFormData.transferVoucher = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
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
.line {
  text-align: center;
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

.img-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img {
    margin: 10px;
  }
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

.demo-form-inline {
  .zhi {
    ::v-deep .el-form-item__label {
      padding-right: 5px;
    }
  }
}
.request {
  padding: 15px 20px;

  .req-line {
    display: flex;
    line-height: 40px;
    .req-label {
      width: 120px;
    }
  }
}

.flush-tips {
  font-size: 14px;
  color: red;
}

::v-deep .request .el-textarea {
  margin-top: 0px !important;
}

::v-deep .el-drawer__header span:focus-visible {
  outline: none;
}
</style>
