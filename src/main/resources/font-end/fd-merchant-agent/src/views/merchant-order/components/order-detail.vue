<template>
  <div class="app-container">
    <el-drawer
      title="订单详情"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="40%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="订单信息" name="orderInfo">
          <div class="info-con">
            <p class="info-line">
              <span class="line-label">平台订单号：</span>
              <!-- <span class="line-content">168743453434687</span> -->
              <el-tag class="tag-purple">168743453434687</el-tag>
            </p>
            <p class="info-line">
              <span class="line-label">商户订单号：</span>
              <span class="line-content">348643431</span>
            </p>
            <p class="info-line">
              <span class="line-label">订单金额(元)：</span>
              <!-- <span class="line-content">457</span> -->
              <el-tag type="success">457</el-tag>
            </p>
            <p class="info-line">
              <span class="line-label">手续费(元)：</span>
              <!-- <span class="line-content">4.54</span> -->
              <el-tag class="tag-pink">457</el-tag>
            </p>
            <template v-if="payType == 'agent-pay'">
              <p class="info-line">
                <span class="line-label">收款人：</span>
                <span class="line-content">loopy</span>
              </p>
              <p class="info-line">
                <span class="line-label">收款账号：</span>
                <span class="line-content">13625648759</span>
              </p>
              <p class="info-line">
                <span class="line-label">收款地址：</span>
                <span class="line-content">河南省郑州市金水区郑州东站</span>
              </p>
              <p class="info-line">
                <span class="line-label">状态：</span>
                <!-- <span class="line-content">已支付</span> -->
                <el-tag type="success">已支付</el-tag>
              </p>
              <p class="info-line">
                <span class="line-label">订单来源：</span>
                <span class="line-content">微信转账</span>
              </p>
              <p class="info-line">
                <span class="line-label">转账附件：</span>
                <span class="line-content">转账截图</span>
              </p>
              <p class="info-line">
                <span class="line-label">回调状态：</span>
                <!-- <span class="line-content">成功</span> -->
                <el-tag type="warning">未收到</el-tag>
              </p>
              <p class="info-line">
                <span class="line-label">下单时间：</span>
                <span class="line-content">2023-11-22 11:16:22</span>
              </p>
              <p class="info-line">
                <span class="line-label">更新时间：</span>
                <span class="line-content">2023-11-22 11:16:22</span>
              </p>
              <p class="info-line">
                <span class="line-label">备注：</span>
                <span class="line-content">我是备注</span>
              </p>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="费用详情" name="payInfo">
          <div class="info-con">
            <p class="info-line">
              <span class="line-label">订单金额：</span>
              <span class="line-content">958（元）</span>
            </p>
            <p class="info-line">
              <span class="line-label">平台利润：</span>
              <span class="line-content">36985（元）</span>
            </p>
            <p class="info-line">
              <span class="line-label">系统费率：</span>
              <el-tag type="success">5%</el-tag>
            </p>
            <p class="info-line">
              <span class="line-label">系统费用：</span>
              <span class="line-content">365（元）</span>
            </p>
            <p class="info-line">
              <span class="line-label">商户费率：</span>
              <el-tag class="tag-pink">6%</el-tag>
            </p>
            <p class="info-line">
              <span class="line-label">商户费用：</span>
              <span class="line-content">666（元）</span>
            </p>
            <p class="info-line">
              <span class="line-label">码商费率：</span>
              <el-tag class="tag-purple">4%</el-tag>
            </p>
            <p class="info-line">
              <span class="line-label">码商费用：</span>
              <span class="line-content">968（元）</span>
            </p>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="payType == 'default'" label="收银台访问记录" name="viewRecord">
          <div>收银台地址: 北京 天安门</div>
          <my-table
            class="mt-10"
            ref="infoTable"
            :tableData="list"
            :total="total"
            :loadData="getDataList"
            style="width: 100%"
          >
            <!-- <el-table-column align="center" label="收银台地址">
              <template slot-scope="{ row }">
                <span>{{ row.cash_page_url }}</span>
              </template>
            </el-table-column> -->

            <el-table-column label="序号" align="center" type="index" width="60" />

            <el-table-column align="center" label="访问收银台时间" sortable>
              <template slot-scope="{ row }">
                <span>{{ row.visit_time }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="设备信息">
              <template slot-scope="{ row }">
                <span v-if="row.device_type == 0">
                  <svg-icon icon-class="weizhi" /> &nbsp;未知</span
                >
                <span v-if="row.device_type == 1">
                  <svg-icon icon-class="windows" />&nbsp;Windows</span
                >
                <span v-if="row.device_type == 2"><svg-icon icon-class="MACOS" />&nbsp;macOS</span>
                <span v-if="row.device_type == 3"><svg-icon icon-class="linux" />&nbsp;linux</span>
                <span v-if="row.device_type == 4"
                  ><svg-icon icon-class="iphone" />&nbsp;iPhone</span
                >
                <span v-if="row.device_type == 5"><svg-icon icon-class="ipad" />&nbsp;iPad</span>
                <span v-if="row.device_type == 6"
                  ><svg-icon icon-class="android" />&nbsp;Android</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="IP地址">
              <template slot-scope="{ row }">
                {{ row.ip }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="访问地址">
              <template slot-scope="{ row, $index }"> 地址{{ $index }} </template>
            </el-table-column>
          </my-table>
        </el-tab-pane>
        <el-tab-pane label="匹配记录" name="matchRecord">
          <div>匹配记录</div>

          <my-table
            class="mt-10"
            :tableData="pipeiTableData"
            :total="50"
            ref="my-table"
            style="width: 100%"
            border
          >
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="码商名称" align="center" prop="product_name" />
            <el-table-column label="匹配结果" align="center" prop="pipei_result" />
            <el-table-column label="结果说明" align="center" prop="result_info" />
            <el-table-column label="匹配时间" align="center" prop="pipei_time" />
          </my-table>
        </el-tab-pane>
        <el-tab-pane label="通知记录" name="notifyRecord">

          <!-- <div class="notify">
            <div class="item">
              <span class="label">通知时间:</span>
              <span class="value">2025-02-20</span>
            </div>
            <div class="item">
              <span class="label">通知地址:</span>
              <span class="value"> 郑州市-东站-高铁站 </span>
            </div>
          
            <div class="item2">
              <div class="label">
                <div style="width: 120px; text-align: right; line-height: 40px">通知内容:</div>
              </div>
              <div class="value" style="flex: 1; padding-left: 83px">
                <el-input
                  type="textarea"
                  readonly
                  :autosize="{ minRows: 13 }"
                  value="textarea2textarea2textarea2textarea2textarea2textarea2"
                >
                </el-input>
              </div>
            </div>
            <div class="item">
              <span class="label">通知状态:</span>
              <span class="value"> 到达 </span>
            </div>
            <div class="item">
              <span class="label">响应时间:</span>
              <span class="value"> 2025-02-21 </span>
            </div>
            <div class="item2">
              <div style="width: 120px; text-align: right; line-height: 40px">响应内容:</div>

              <div class="value" style="flex: 1; padding-left: 83px">
                <el-input
                  type="textarea"
                  readonly
                  :autosize="{ minRows: 13 }"
                  value="textarea2textarea2textarea2textarea2textarea2textarea2"
                >
                </el-input>
              </div>
            </div>
          </div> -->

          <div class="request">
            <p class="req-line">
              <span class="req-label">通知地址：</span>
              <span class="req-value">8.8.8.8</span>
            </p>

            <p class="req-line">
              <span class="req-label">通知时间：</span>
              <span class="req-value">2025-02-20 15:15:15</span>
            </p>
           
            <p class="req-line2">
              <span class="req-label">通知内容：</span>
              <el-input
                style="margin-top: 15px"
                type="textarea"
                readonly
                :autosize="{ minRows: 13 }"
                value="textarea2textarea2textarea2textarea2textarea2textarea2"
              >
              </el-input>
            </p>
            <p class="req-line">
              <span class="req-label">通知状态:</span>
              <span class="req-value">到达</span>
            </p>
            <p class="req-line">
              <span class="req-label">响应时间：</span>
              <span class="req-value">2025-02-02 15:15:15</span>
            </p>
            <p class="req-line2">
              <span class="req-label">响应内容：</span>
              <el-input
                style="margin-top: 15px"
                type="textarea"
                readonly
                :autosize="{ minRows: 13 }"
                value="textarea2textarea2textarea2textarea2textarea2textarea2"
              >
              </el-input>
            </p>
          </div>


        </el-tab-pane>
        <el-tab-pane label="操作记录" name="operateRecord">
          <div>操作记录</div>

          <my-table
            class="mt-10"
            :tableData="optTableData"
            :total="50"
            ref="my-table"
            style="width: 100%"
            border
          >
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="操作用户名" align="center" prop="opt_username" />
            <el-table-column label="操作结果" align="center" prop="opt_result" />
            <el-table-column label="结果说明" align="center" prop="result_info" />
            <el-table-column label="操作时间" align="center" prop="opt_time" />
          </my-table>
        </el-tab-pane>
        <!-- <el-tab-pane v-if="payType == 'collect'" label="聊天记录" name="chatRecord">

          <div class="chat-box">
            <div class="chat">
              <template v-for="item in chatContent">
                <div class="item-l" v-if="Math.floor(Math.random() * 5) > 3">
                  <div class="content">
                    <div>
                      <span class="label">张三:</span>
                      <span class="label">{{ item }}</span>
                    </div>
                    <span class="time">2025-02-20</span>
                  </div>
                </div>

                <div class="item-r" v-else>
                  <div class="content">
                    <div>
                      <span class="label">{{ item }}</span>
                      <span class="label"></span>
                    </div>
                    <span class="time">2025-02-20</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane> -->

        <el-tab-pane label="请求记录" name="requestRecord">
          <div class="request">
            <p class="req-line">
              <span class="req-label">请求地址：</span>
              <span class="req-value">192.168.10.52</span>
            </p>
            <p class="req-line">
              <span class="req-label">请求时间：</span>
              <span class="req-value">2025-02-02 15:15:15</span>
            </p>
            <p class="req-line2">
              <span class="req-label">请求报文：</span>
              <el-input
                style="margin-top: 15px"
                type="textarea"
                readonly
                :autosize="{ minRows: 13 }"
                value="textarea2textarea2textarea2textarea2textarea2textarea2"
              >
              </el-input>
            </p>
            <p class="req-line">
              <span class="req-label">响应时间：</span>
              <span class="req-value">2025-02-02 15:15:15</span>
            </p>
            <p class="req-line2">
              <span class="req-label">响应报文：</span>
              <el-input
                style="margin-top: 15px"
                type="textarea"
                readonly
                :autosize="{ minRows: 13 }"
                value="textarea2textarea2textarea2textarea2textarea2textarea2"
              >
              </el-input>
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import { cashVisitList } from '@/api/merchant'
export default {
  props: {
    payType: {
      type: String,
      default: () => 'default' // agent-pay  代付
    }
  },
  data() {
    return {
      drawer: false,
      activeName: 'orderInfo',
      list: [],
      total: 0,
      pipeiTableData: [],
      optTableData: [],
      chatContent: [
        '取消、  确认 、补单 、 修改金额 、 通知商户',
        '取消 确认  补单    弹窗 内容一样：',
        '系统订单号',
        '订单金额是多少',
        '实付金额要付多少，  交易密码',
        '交易密码',
        '修改金额要有个弹窗',
        '系统订单号',
        '订单金额',
        '原实付金额',
        '新实付金额',
        '交易密码'
      ]
    }
  },
  watch: {},
  methods: {
    handleClose(done) {
      //   this.$confirm('确认关闭？')
      //     .then((_) => {
      done()
      //     })
      //     .catch((_) => {})
    },
    async getDataList() {
      let ret = await cashVisitList()
      this.list = ret.data
      console.log(this.list, ' this.list ')
      this.total = ret.total
    }
  },
  mounted() {
    if (this.payType == 'default') {
      console.warn('this.payType == default ---- 该属性必须传')
    }

    new Array(10).fill(0).forEach((_, index) => {
      const date = new Date()
      date.setTime(date.getTime() - Math.floor(Math.random() * 10000) * 3600 * 1000 * 24)

      this.pipeiTableData.push({
        product_name: '码商名称' + index,
        pipei_result: '匹配结果' + index,
        result_info: '结果说明' + index,
        pipei_time: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      })
    })

    new Array(10).fill(0).forEach((_, index) => {
      const date = new Date()
      date.setTime(date.getTime() - Math.floor(Math.random() * 10000) * 3600 * 1000 * 24)

      this.optTableData.push({
        opt_username: '名称' + index,
        opt_result: '操作结果' + index,
        result_info: '结果说明' + index,
        opt_time: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      })
    })
  }
}
</script>
<style lang="scss" scoped>
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
::v-deep .svg-icon {
  width: 16px !important;
  font-size: 18px;
}
.notify {
  padding: 15px 20px;
  .item {
    display: flex;
    line-height: 40px;
    margin: 5px 0;

    .label {
      width: 120px;
      text-align: right;
      margin-right: 10px;
    }
    .value {
      width: 350px;
      // height: 80px;
      // background-color: skyblue;
    }
  }
}
.chat-box {
  height: 700px;
  overflow: auto;
}
.chat {
  padding: 15px 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  line-height: 24px;

  .item-r,
  .item-l {
    display: flex;
    justify-content: flex-start;
    margin: 5px 0;
    width: 100%;
    .content {
      padding: 5px 11px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      min-height: 50px;
      max-width: 60%;
      border-radius: 5px;

      .time {
        font-size: 12px;
        color: #999;
      }
    }
  }
  .item-r {
    justify-content: flex-end;
    .content {
      background-color: #95ec69;
      .time {
        text-align: right;
      }
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
</style>
