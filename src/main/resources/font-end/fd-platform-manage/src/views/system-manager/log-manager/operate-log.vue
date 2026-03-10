<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="操作类型" prop="operationType">
          <el-select
            v-model="queryFormData.operationType"
            placeholder="请输入操作类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="其他" value="0"></el-option>
            <el-option label="新增" value="1"></el-option>
            <el-option label="修改" value="2"></el-option>
            <el-option label="删除" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="操作人员" prop="userName">
          <el-input v-model="queryFormData.userName" placeholder="请输入操作人员" size="small" />
        </el-form-item>

        <el-form-item label="操作时间" prop="requestTime">
          <el-date-picker
            v-model="queryFormData.requestTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
:default-time="['00:00:00', '23:59:59']"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptionsAll"
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
      <my-table
        class="mt-10"
        :loadData="getSystemLogPage"
        :tableData="tableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="系统模块" align="center" prop="title" />
        <el-table-column label="操作类型" align="center" prop="operationType">
          <template slot-scope="{ row }">
            <span v-if="row.operationType == '0'" type="success" size="small">其他</span>
            <span v-if="row.operationType == '1'" type="success" size="small">新增</span>
            <span v-if="row.operationType == '2'" type="success" size="small">修改</span>
            <span v-if="row.operationType == '3'" type="success" size="small">删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center" prop="userName" />
        <el-table-column label="操作地址" align="center" prop="ip" />
        <el-table-column label="操作状态" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.operationStatus" type="success" size="small">成功</el-tag>
            <el-tag v-else type="danger" size="small">失败</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作时间" align="center" prop="requestTime">
          <template slot-scope="{ row }">
            {{ row.requestTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div class="btn" @click="showClassifyDialog(row)">
                <i class="el-icon-tickets" />详情
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>
    <el-drawer
      title="操作内容"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="35%"
    >
      <div class="request">
        <p class="req-line">
          <span class="req-label">请求地址：</span>
          <span class="req-value">{{classifyList.ipLocation}}</span>
        </p>
        <p class="req-line">
          <span class="req-label">请求时间：</span>
          <span class="req-value">{{classifyList.requestTime}}</span>
        </p>
        <p class="req-line2">
          <span class="req-label">请求报文：</span>
          <el-input
            style="margin-top: 15px"
            type="textarea"
            readonly
            :autosize="{ minRows: 13 }"
            :value="classifyList.requestBody?classifyList.requestBody:'空'"
          >
          </el-input>
        </p>
        <p class="req-line">
          <span class="req-label">响应时间：</span>
          <span class="req-value">{{classifyList.responseTime}}</span>
        </p>
        <p class="req-line2">
          <span class="req-label">响应报文：</span>
          <el-input
          v-if="classifyList.operationStatus"
            style="margin-top: 15px"
            type="textarea"
            readonly
            :autosize="{ minRows: 13 }"
            :value="classifyList.responseBody?classifyList.responseBody:'空'"
          >
          </el-input>
          <el-input
          v-else
            style="margin-top: 15px"
            type="textarea"
            readonly
            :autosize="{ minRows: 13 }"
            :value="classifyList.errorMsg?classifyList.errorMsg:'空'"
          >
          </el-input>
        </p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getSystemLogPage, getSystemLogClassify } from '@/api/system-manager'
import { formatDateTime } from '@/utils'
export default {
  name: 'OperateLog',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      drawer: false,
      queryFormData: this.getQueryForm(),
      classifyList:{},
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    async getSystemLogPage(page) {
      let obj = { ...this.queryFormData, tenantId: this.tenantId }
      if (this.queryFormData.requestTime) {
        obj = {
          ...obj,
          startTime: this.queryFormData.requestTime ? this.queryFormData.requestTime[0] : '',
          endTime: this.queryFormData.requestTime ? this.queryFormData.requestTime[1] : ''
        }
      }
      const { requestTime, ...rest } = obj
      let res = await getSystemLogPage(rest, { ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async showClassifyDialog(row) {
      this.drawer = true
      let res =await getSystemLogClassify(BigInt(row.operationLogId))
      this.classifyList=res.data
      console.log(res,'resresresresresres')
      console.log(res)
    },
    handleClose() {
      this.drawer = false
    },
    getQueryForm(){
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      let nowStr = formatDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59))
      let todayStr = formatDateTime(today)

      return  {
        operationType: '',
        userName: '',
        requestTime: [todayStr, nowStr]
      }
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.$refs.tableRef.getTableData(1)
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.notify {
  padding: 15px 20px;
  margin: 50px;
  border-radius: 3px;
  border: 1px solid #000;
  .item {
    display: flex;
    line-height: 40px;
    margin: 5px 0;

    .label {
      width: 150px;
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
