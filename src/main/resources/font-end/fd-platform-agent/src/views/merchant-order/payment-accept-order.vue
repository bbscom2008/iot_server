<template>
  <div class="container">
    <!-- <div class="gongji">
      <div class="box">
        <el-card class="item-card" v-for="(ele, i) in cardItems" :key="i">
          <div class="title">
            {{ i == 0 ? '实时统计：' : i == 1 ? '今日统计：' : '昨日统计：' }}
          </div>
          <div class="item">
            <div class="txt" v-for="item in ele" :key="item.title">
              <span class="label">{{ item.title }} :</span>
              <span class="money"
                >{{ item.value }}
                {{ item.type == 'number' ? '单' : item.type == 'money' ? '元' : '%' }}
              </span>
            </div>
          </div>
        </el-card>
      </div>
    </div> -->

    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="系统订单号" prop="system_order_num">
          <el-input
            v-model="queryFormData.system_order_num"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchant_order_num">
          <el-input
            v-model="queryFormData.merchant_order_num"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="订单金额" prop="merchant_order_money">
          <el-input
            v-model="queryFormData.merchant_order_money"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="订单金额范围" prop="pay_order_money" style="margin-right: 5px; ">
          <el-input
            v-model="queryFormData.merchant_order_money"
            placeholder="订单金额"
            size="small"
            style="width: 180px;"
          >
            <template slot="append">元</template>
        </el-input>
        </el-form-item>
        <el-form-item label="至" prop="merchant_order_money" class="zhi">
          <el-input
            v-model="queryFormData.pay_order_money"
            placeholder="订单金额"
            size="small"
            style="width: 180px;"
          >
            <template slot="append">元</template>
        </el-input>
        </el-form-item>



        <!-- <el-form-item label="实付金额" prop="pay_order_money">
          <el-input
            v-model="queryFormData.pay_order_money"
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="通道名称" prop="channel_name">
          <el-select filterable  v-model="queryFormData.channel_name" placeholder="请选择通道名称" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in channel_nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称" prop="product_name">
          <el-select filterable  v-model="queryFormData.product_name" placeholder="请选择产品名称" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in product_nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商户" prop="trans_merchant_no">
          <el-input
            v-model="queryFormData.trans_merchant_no"
            placeholder="请输入商户"
            size="small"
          />
        </el-form-item>

        <el-form-item label="码商" prop="trans_product_no">
          <el-input
            v-model="queryFormData.trans_product_no"
            placeholder="请输入码商"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单状态" prop="order_state">
          <el-select filterable  v-model="queryFormData.order_state" placeholder="请选择订单状态" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in order_stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通知状态" prop="notice_state">
          <el-select filterable  v-model="queryFormData.notice_state" placeholder="请选择通知状态" size="small">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in notice_stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单确认用户名" prop="order_confirm_user_name">
          <el-input
            v-model="queryFormData.order_confirm_user_name"
            placeholder="请输入订单确认用户名"
            size="small"
          />
        </el-form-item> -->

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
      <div class="auto-flush">
        <span class="mr-10">自动刷新</span>
        <el-checkbox-group v-model="autoCheckList" @change="checkGroupChange">
          <el-checkbox :label="10">10秒</el-checkbox>
          <el-checkbox :label="30">30秒</el-checkbox>
          <el-checkbox :label="60">60秒</el-checkbox>
        </el-checkbox-group>
        <span class="flush-tips ml-10">{{ flushTips }}</span>
      </div>

      <!-- <el-button type="primary" icon="el-icon-dish" @click="allNotify()">批量通知</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleDownload"
        >批量导出</el-button
      > -->

      <my-table
        class="mt-10"
        :loadData="mockData"
        :tableData="tableData"
        :total="50"
        ref="my-table"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="订单号" align="center" width="180">
          <template slot-scope="{ row }">
            <div>
              系统订单号:{{ row.system_order_num }} <br />
              商户订单号:{{ row.merchant_order_num }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="商户订单号" align="center" prop="merchant_order_num" /> -->

        <!-- <el-table-column label="订单金额" align="center" prop="merchant_order_money" sortable />
        <el-table-column label="实付金额" align="center" prop="pay_order_money" sortable /> -->
        <el-table-column label="金额" align="center">
          <template slot-scope="{ row }">
            <div>
              订单金额:{{ row.merchant_order_money }} <br />
              实付金额:{{ row.pay_order_money }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="产品信息" align="center">
          <template slot-scope="{ row }">
            <div>
              <!-- 通道名称:{{
                channel_nameOptions.find((item) => item.value === row.channel_name).label
              }}
              <br /> -->
              产品名称:{{
                product_nameOptions.find((item) => item.value === row.product_name).label
              }}
            </div>
          </template>
        </el-table-column>

        <!-- 
        <el-table-column label="通道名称" align="center">
          <template slot-scope="{ row }">
            {{ channel_nameOptions.find((item) => item.value === row.channel_name).label }}
          </template>
        </el-table-column>

        <el-table-column label="产品名称" align="center">
          <template slot-scope="{ row }">
            {{ product_nameOptions.find((item) => item.value === row.product_name).label }}
          </template>
        </el-table-column> -->

        <el-table-column label="收款信息" align="center" prop="shoukuan_info">
          <template slot-scope="{ row, $index }">
            <!-- <el-button type="text" @click="look_shoukuan_info(row)">查看</el-button> -->
            收款信息{{ $index + 1  }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="交易者信息" align="center">
          <template slot-scope="{ row }">
            <div>
              商户:{{ row.trans_merchant_no }} <br />
              码商:{{ row.trans_product_no }}
              <el-button type="text" @click="look_trans_product_info(row)">查看</el-button>
            </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="商户" align="center" prop="trans_merchant_no" />
        <el-table-column label="码商" align="center" prop="trans_product_no" /> -->

        <el-table-column label="订单时间" align="center" width="200">
          <template slot-scope="{ row }">
            <div>
              创建时间:{{ row.create_time }} <br />
              <!-- 确认时间:{{ row.confirm_time }} <br />
              通知时间:{{ row.notice_time }} <br />
              过期时间:{{ row.ood_time }} -->
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

        <!-- <el-table-column label="订单状态" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="order_stateOptions.find((item) => item.value === row.order_state).type">
              {{ order_stateOptions.find((item) => item.value === row.order_state).label }}
            </el-tag>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="通知状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="notice_stateOptions.find((item) => item.value === row.notice_state).type"
            >
              {{
                notice_stateOptions.find((item) => item.value === row.notice_state).label
              }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="回款状态" align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="huikuan_stateOptions.find((item) => item.value === row.huikuan_state).type"
            >
              {{
                huikuan_stateOptions.find((item) => item.value === row.huikuan_state).label
              }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="转账凭证" align="center" prop="submit_info">
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_submit_info(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <el-table-column label="注意事项" align="center" >
          <template slot-scope="{ row }"> 说明文字 </template>
        </el-table-column>

        <el-table-column label="抢单次数" align="center" >
          <template slot-scope="{ row }"> 33 </template>
        </el-table-column>

        <!-- <el-table-column label="订单确认用户名" align="center" prop="order_confirm_user_name" />
        <el-table-column label="付款信息" align="center" prop="payment_info" />

        <el-table-column label="提交信息" align="center" prop="submit_info">
          <template slot-scope="{ row }">
            <el-button type="text" @click="look_submit_info(row)">查看</el-button>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <!-- <div type="success" class="btn" @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div> -->
              <!-- <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 0)">
                <i class="el-icon-delete" />取消
              </div>
              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 1)">
                <i class="el-icon-delete" />确认
              </div>

              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 2)">
                <i class="el-icon-delete" />驳回
              </div>

              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 3)">
                <i class="el-icon-delete" />审核
              </div>

              <div type="primary" class="btn mt-5" @click="showCommonDialog(row, 4)">
                <i class="el-icon-delete" />补单
              </div>

              <div type="primary" class="btn mt-5" @click="notice_merchant(row)">
                <i class="el-icon-delete" />通知商户
              </div> -->

              <div type="primary" class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />接单
              </div>
              <!-- <div type="primary" class="btn mt-5" @click="orderInfo(row)">
                <i class="el-icon-s-order" />详情
              </div> -->
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑订单' : '新增条目'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="system_order_num">
          <el-input
            v-model="formData.system_order_num"
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号" prop="merchant_order_num">
          <el-input
            v-model="formData.merchant_order_num"
            placeholder="请输入商户订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="订单金额" prop="merchant_order_money">
          <el-input
            v-model="formData.merchant_order_money"
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="实付金额" prop="pay_order_money">
          <el-input v-model="formData.pay_order_money" placeholder="请输入实付金额" size="small" />
        </el-form-item>

        <el-form-item label="通道名称" prop="channel_name">
          <el-select filterable  v-model="formData.channel_name" placeholder="请选择通道名称" size="small">
            <el-option
              v-for="item in channel_nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品名称" prop="product_name">
          <el-select filterable  v-model="formData.product_name" placeholder="请选择产品名称" size="small">
            <el-option
              v-for="item in product_nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收款信息" prop="shoukuan_info">
          <el-input v-model="formData.shoukuan_info" placeholder="请输入收款信息" size="small" />
        </el-form-item>

        <el-form-item label="商户" prop="trans_merchant_no">
          <el-input v-model="formData.trans_merchant_no" placeholder="请输入商户" size="small" />
        </el-form-item>

        <el-form-item label="码商" prop="trans_product_no">
          <el-input v-model="formData.trans_product_no" placeholder="请输入码商" size="small" />
        </el-form-item>

        <el-form-item label="创建时间" prop="create_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.create_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="确认时间" prop="confirm_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.confirm_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="通知时间" prop="notice_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.notice_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="过期时间" prop="ood_time">
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formData.ood_time"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="订单状态" prop="order_state">
          <el-select filterable  v-model="formData.order_state" placeholder="请选择订单状态" size="small">
            <el-option
              v-for="item in order_stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通知状态" prop="notice_state">
          <el-select filterable  v-model="formData.notice_state" placeholder="请选择通知状态" size="small">
            <el-option
              v-for="item in notice_stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单确认用户名" prop="order_confirm_user_name">
          <el-input
            v-model="formData.order_confirm_user_name"
            placeholder="请输入订单确认用户名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="付款信息" prop="payment_info">
          <el-input v-model="formData.payment_info" placeholder="请输入付款信息" size="small" />
        </el-form-item>

        <el-form-item label="提交信息" prop="submit_info">
          <el-input v-model="formData.submit_info" placeholder="请输入提交信息" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
    <incomeOrder ref="incomeOrderInfo" payType="agent-pay"  ></incomeOrder>

    <el-dialog :visible.sync="trans_product_visual" title="交易者信息" width="600px">
      <el-table class="mt-10" :data="tableData" style="width: 100%" border>
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column label="当前层级" align="center" width="180">
          <template slot-scope="{ row, $index }">
            <div>层级{{ $index }}</div>
          </template>
        </el-table-column>

        <el-table-column label="用户名" align="center">
          <template slot-scope="{ row, $index }"> abc-{{ $index }} </template>
        </el-table-column>

        <el-table-column label="码商名称" align="center">
          <template slot-scope="{ row }">
            {{ row.trans_product_no }}
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button @click="trans_product_visual = false" size="small"> 确定 </el-button>
        <!-- <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button> -->
      </div>
    </el-dialog>

    <el-dialog :visible.sync="commonDialogVisible" :title="commonDialogTitle" width="600px">
      <el-form
        ref="form"
        :model="commonFormData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="system_order_num">
          <el-input
            disabled
            v-model="commonFormData.system_order_num"
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

        <!-- <el-form-item label="实付金额" v-if="commonDialogType != 3" prop="pay_order_money"> -->
        <el-form-item label="实付金额" prop="pay_order_money">
          <el-input
            v-model="commonFormData.pay_order_money"
            disabled
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>

        <!-- <el-form-item label="原实付金额" v-if="commonDialogType == 3" prop="pay_order_money">
          <el-input
            v-model="commonFormData.pay_order_money"
            disabled
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item>

        <el-form-item
          label="新实付金额"
          v-if="commonDialogType == 3"
          required
          prop="pay_order_money"
        >
          <el-input
            v-model="commonFormData.new_pay_order_money"
            placeholder="请输入实付金额"
            size="small"
          />
        </el-form-item> -->

        <el-form-item label="交易密码" prop="password" required>
          <el-input
            v-model="commonFormData.password"
            type="password"
            show-password
            placeholder="请输入交易密码"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="commonDialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="commonDialogVisible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="submit_info_dialog_visible" title="查看转账凭证" width="500px">
      <span>共计 {{ pingImgRandom }} 张图片</span>
      <div class="img-box">
        <el-image
          class="img"
          v-for="i in pingImgRandom"
          :key="i"
          style="width: 200px; height: 200px"
          :src="pingImgList[i]"
          :preview-src-list="pingImgList"
        >
        </el-image>
      </div>

      <div slot="footer">
        <el-button @click="submit_info_dialog_visible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="submit_info_dialog_visible = false" size="small">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import incomeOrder from './components/order-detail.vue'

import clipboard from '@/utils/clipboard'

import img1 from '@/assets/img/ping1.png'
import img2 from '@/assets/img/ping2.png'
import img3 from '@/assets/img/ping3.png'
import img4 from '@/assets/img/ping4.png'
import img5 from '@/assets/img/ping5.png'

export default {
  name: 'gCodePreview',
  components: { incomeOrder },
  data() {
    let now = new Date()
    let today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近15天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      code: '',
      tableData: [],
      dialogVisible: false,
      formData: {
        index: '',
        system_order_num: '',
        merchant_order_num: '',
        merchant_order_money: '',
        pay_order_money: '',
        channel_name: '',
        product_name: '',
        shoukuan_info: '',
        trans_merchant_no: '',
        trans_product_no: '',
        create_time: '',
        confirm_time: '',
        notice_time: '',
        ood_time: '',
        order_state: '',
        notice_state: '',
        huikuan_state: '',
        order_confirm_user_name: '',
        payment_info: '',
        submit_info: '',
        opt: ''
      },
      cardItems: ['订单数量', '订单金额', '成交订单数量', '成交订单金额', '成功率', '实付金额'],
      queryFormData: {
        system_order_num: '',
        merchant_order_num: '',
        merchant_order_money: '',
        pay_order_money: '',
        channel_name: '',
        product_name: '',
        trans_merchant_no: '',
        trans_product_no: '',
        create_time: [today, today],
        order_state: '',
        notice_state: '',
        order_confirm_user_name: ''
      },
      isEdit: false, // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
      channel_nameOptions: [
        { label: '通道1', value: '1' },
        { label: '通道2', value: '2' },
        { label: '通道3', value: '3' }
      ],
      product_nameOptions: [
        { label: '产品1', value: '1' },
        { label: '产品2', value: '2' },
        { label: '产品3', value: '3' }
      ],
      order_stateOptions: [
        { label: '已生成', value: '0', type: 'info' },
        { label: '待接单', value: '1', type: 'info' },
        { label: '已接单', value: '2', type: 'success' },
        { label: '已成功', value: '3', type: 'success' },
        { label: '已取消', value: '4', type: 'warning' },
        { label: '已超时', value: '5', type: 'warning' },
        { label: '高危订单', value: '6', type: 'danger' },
        { label: '渠道订单失败', value: '7', type: 'danger' }
      ],
      notice_stateOptions: [
        { label: '待发送', value: '0', type: 'info' },
        { label: '发送成功', value: '1', type: 'success' },
        { label: '发送失败', value: '2', type: 'danger' },
        { label: '响应成功', value: '3', type: 'success' },
        { label: '响应失败', value: '4', type: 'warning' }
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
        system_order_num: ''
      },
      pingImgList: [img1, img2, img3, img4, img5],
      pingImgRandom: 1,
      pingImgShowList: []
    }
  },
  methods: {
    handleDownload() {
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [ 'system_order_num','merchant_order_num','merchant_order_money','pay_order_money','channel_name','product_name','shoukuan_info','trans_merchant_no','trans_product_no','create_time','confirm_time','notice_time','ood_time','order_state','notice_state','huikuan_state','order_confirm_user_name','payment_info','submit_info','opt']
        let data = []
        this.tableData.forEach((ele) => {
          let lineValue = []
          tHeader.forEach((item) => {
            let v =  ele[item] ? ele[item] : ''
            lineValue.push(v)
          })

          data.push(lineValue)
        })

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
      })
    },

    clipboard,
    look_submit_info(row) {
      // this.submit_info_formData = Object.assign({}, row)

      this.submit_info_formData = {
        password: '',
        isShow: false,
        system_order_num: row.system_order_num
      }

      this.pingImgRandom = Math.floor(Math.random() * 3) + 3
      this.submit_info_dialog_visible = true
      this.pingImgShowList = this.pingImgList.slice(0, this.pingImgRandom)

      // this.$alert(`查看${row.system_order_num} 的提交信息`, {
      //   confirmButtonText: '确定',
      //   callback: (action) => {
      //     // this.$message({
      //     //   type: 'info',
      //     //   message: `action: ${ action }`
      //     // });
      //   }
      // })
    },

    showCommonDialog(row, type) {
      this.commonDialogType = type
      this.commonDialogTitle =
        type == 0
          ? '取消订单'
          : type == 1
          ? '确认订单'
          : type == 2
          ? '驳回订单'
          : type == 3
          ? '审核订单'
          : '补单'
      this.commonDialogVisible = true
      // this.commonFormData = Object.assign({}, row)
      this.commonFormData = {
        system_order_num: row.system_order_num,
        merchant_order_money: row.merchant_order_money,
        pay_order_money: row.pay_order_money,
        new_pay_order_money: '',
        password: ''
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
          }
          this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        }, 1000)
      } else {
        clearInterval(this.autoFlushFlag)
        this.flushTips = ''
      }
    },
    look_trans_product_info(row) {
      // this.$alert(`查看${row.system_order_num} 的交易者信息`, {
      //   confirmButtonText: '确定',
      //   callback: (action) => {}
      // })
      this.trans_product_visual = true
    },
    look_shoukuan_info(row) {
      this.$alert(`查看${row.system_order_num} 的收款信息`, {
        confirmButtonText: '确定',
        callback: (action) => {
          // this.$message({
          //   type: 'info',
          //   message: `action: ${ action }`
          // });
        }
      })
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
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定接单 【 ${row.system_order_num} 】 吗？`)
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
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        index: '',
        system_order_num: '',
        merchant_order_num: '',
        merchant_order_money: '',
        pay_order_money: '',
        channel_name: '',
        product_name: '',
        shoukuan_info: '',
        trans_merchant_no: '',
        trans_product_no: '',
        create_time: '',
        confirm_time: '',
        notice_time: '',
        ood_time: '',
        order_state: '',
        notice_state: '',
        order_confirm_user_name: '',
        payment_info: '',
        submit_info: '',
        opt: ''
      }
    },
    orderInfo() {
      this.$refs.incomeOrderInfo.drawer = true
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
      let now = new Date()
      let today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`

      this.queryFormData = {
        system_order_num: '',
        merchant_order_num: '',
        merchant_order_money: '',
        pay_order_money: '',
        channel_name: '',
        product_name: '',
        trans_merchant_no: '',
        trans_product_no: '',
        create_time: [today, today],
        order_state: '',
        notice_state: '',
        order_confirm_user_name: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      // this.mockData()

      if (this.queryFormData.system_order_num != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.system_order_num == this.queryFormData.system_order_num
        })
      }

      if (this.queryFormData.merchant_order_num != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.merchant_order_num == this.queryFormData.merchant_order_num
        })
      }

      if (this.queryFormData.merchant_order_money != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.merchant_order_money == this.queryFormData.merchant_order_money
        })
      }

      if (this.queryFormData.pay_order_money != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.pay_order_money == this.queryFormData.pay_order_money
        })
      }

      if (this.queryFormData.channel_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.channel_name == this.queryFormData.channel_name
        })
      }

      if (this.queryFormData.product_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.product_name == this.queryFormData.product_name
        })
      }

      if (this.queryFormData.trans_merchant_no != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.trans_merchant_no == this.queryFormData.trans_merchant_no
        })
      }

      if (this.queryFormData.trans_product_no != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.trans_product_no == this.queryFormData.trans_product_no
        })
      }

      // if (this.queryFormData.create_time != '') {
      //   this.tableData = this.tableData.filter((item) => {
      //     return item.create_time == this.queryFormData.create_time
      //   })
      // }

      if (this.queryFormData.order_state != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.order_state == this.queryFormData.order_state
        })
      }

      if (this.queryFormData.notice_state != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.notice_state == this.queryFormData.notice_state
        })
      }

      if (this.queryFormData.order_confirm_user_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.order_confirm_user_name == this.queryFormData.order_confirm_user_name
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
        { title: '序号', type: 'index', key: 'index', isSearch: false, id: 1000 },
        { title: '系统订单号', type: 'string', key: 'system_order_num', isSearch: true, id: 1001 },
        {
          title: '商户订单号',
          type: 'string',
          key: 'merchant_order_num',
          isSearch: true,
          id: 1002
        },
        {
          title: '订单金额',
          type: 'number',
          key: 'merchant_order_money',
          isSearch: true,
          id: 1003
        },
        { title: '实付金额', type: 'number', key: 'pay_order_money', isSearch: true, id: 1004 },
        {
          title: '通道名称',
          type: 'select',
          key: 'channel_name',
          isSearch: true,
          id: 1005,
          options: [
            { label: '通道1', value: '1' },
            { label: '通道2', value: '2' },
            { label: '通道3', value: '3' }
          ],
          optionsName: 'channel_nameOptions'
        },
        {
          title: '产品名称',
          type: 'select',
          key: 'product_name',
          isSearch: true,
          id: 1006,
          options: [
            { label: '产品1', value: '1' },
            { label: '产品2', value: '2' },
            { label: '产品3', value: '3' }
          ],
          optionsName: 'product_nameOptions'
        },
        { title: '收款信息', type: 'string', key: 'shoukuan_info', isSearch: false, id: 1007 },
        { title: '商户', type: 'string', key: 'trans_merchant_no', isSearch: true, id: 1008 },
        { title: '码商', type: 'string', key: 'trans_product_no', isSearch: true, id: 1009 },
        { title: '创建时间', type: 'date', key: 'create_time', isSearch: true, id: 1010 },
        { title: '确认时间', type: 'date', key: 'confirm_time', isSearch: false, id: 1011 },
        { title: '通知时间', type: 'date', key: 'notice_time', isSearch: false, id: 1012 },
        { title: '过期时间', type: 'date', key: 'ood_time', isSearch: false, id: 1013 },
        {
          title: '订单状态',
          type: 'select',
          key: 'order_state',
          isSearch: true,
          id: 1014,
          options: [
            { label: '已生成', value: '0' },
            { label: '待接单', value: '1' },
            { label: '已接单', value: '2' },
            { label: '已成功', value: '3' },
            { label: '已取消', value: '4' },
            { label: '已超时', value: '5' },
            { label: '高危订单', value: '6' },
            { label: '渠道订单失败', value: '7' }
          ],
          optionsName: 'order_stateOptions'
        },
        {
          title: '通知状态',
          type: 'select',
          key: 'notice_state',
          isSearch: true,
          id: 1015,
          options: [
            { label: '待发送', value: '0' },
            { label: '发送成功', value: '1' },
            { label: '发送失败', value: '2' },
            { label: '响应成功', value: '3' },
            { label: '响应失败', value: '4' }
          ],
          optionsName: 'notice_stateOptions'
        },

        {
          title: '回款状态',
          type: 'select',
          key: 'huikuan_state',
          isSearch: true,
          id: 1019,
          options: [
            { label: '待回款', value: '0' },
            { label: '已回款', value: '1' }
          ],
          optionsName: 'huikuan_stateOptions'
        },

        {
          title: '订单确认用户名',
          type: 'string',
          key: 'order_confirm_user_name',
          isSearch: true,
          id: 1016
        },
        { title: '付款信息', type: 'string', key: 'payment_info', isSearch: false, id: 1017 },
        { title: '提交信息', type: 'string', key: 'submit_info', isSearch: false, id: 1018 },
        { title: '操作', type: 'operate', key: 'opt', isSearch: false, id: 1019 }
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
        })
        this.tableData.push(ele)
      })
    }
  },
  mounted() {
    this.mockData()

    let cardItems = ['订单数量', '成交订单数量', '待接单量', '订单金额', '成交订单金额', '成功率']
    let cardTypes = ['number', 'number', 'number', 'money', 'money', 'rate']

    this.cardItems = Array(3)
      .fill(0)
      .map((_, index) => {
        return cardItems.map((item, index2) => {
          return {
            title: item,
            value: Math.floor(Math.random() * 100) + 10,
            type: cardTypes[index2]
          }
        })
      })
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
    margin-bottom: 20px;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    height: 100px;
    //  border: 1px solid red;

    .txt {
      display: flex;
      justify-content: center;
      padding: 0 10px;
      width: 30%;
      height: 20px;
      line-height: 20px;
      .label {
        // width: 120px;
        text-align: right;
        margin-right: 20px;
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

</style>
