<template>
  <div class="container">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="登录名:">
        <el-input v-model="formData.username" size="small" placeholder="登录名"></el-input>
      </el-form-item>
      <el-form-item label="Accesskey(商户号):">
        <el-input v-model="formData.userNumber" size="small" placeholder="商户号"></el-input>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input v-model="formData.comment" size="small" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item label="标签">
        <el-select v-model="formData.region" placeholder="活动区域" size="small">
          <el-option label="代收" value="shanghai"></el-option>
          <el-option label="收付" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">
          <i class="el-icon-refresh mr-5" />刷新</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit" size="small">
          <i class="el-icon-plus mr-5" />新建</el-button
        >
      </el-form-item>
    </el-form>

    <div class="tips">操作日志列表：</div>

    <el-button type="danger" plain :disabled="selectedRows.length == 0">删除</el-button>
    <el-button type="danger" @click="openConfirmclear" >清空</el-button>
    <el-button type="warning" plain>导出</el-button>

    <my-table
      class="mt-10"
      ref="infoTable"
      :tableData="list"
      :total="total"
      :loadData="getDataList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55"> </el-table-column>

      <!-- <el-table-column label="序号" align="center" type="index" width="60" /> -->

      <el-table-column align="center" label="访问编号">
        <template slot-scope="{ row }">
          <span>{{ row.infoId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名称">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户端">
        <template slot-scope="{ row }">
          <span>{{ row.clientKey }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备类型" width="130">
        <template slot-scope="{ row }">
          <template>
            <span> {{ row.deviceType }} </span>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="地址">
        <template slot-scope="{ row }">
          <span>{{ row.ipaddr }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录地点">
        <template slot-scope="{ row }">
          <span>{{ row.loginLocation }}</span>
        </template>
      </el-table-column>

  

      <el-table-column align="center" label="操作系统">
        <template slot-scope="{ row }">
          <span>{{ row.os }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览器" >
        <template slot-scope="{ row }">
          <span>{{ row.browser }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录状态">
        <template slot-scope="{ row }">
          <el-tag>{{ row.status==0?'成功':'失败' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述">
        <template slot-scope="{ row }">
          <span>{{ row.msg }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="访问时间">
        <template slot-scope="{ row }">
          <span>{{ row.loginTime }}</span>
        </template>
      </el-table-column>


      <!-- <el-table-column align="center" label="操作" width="190">
        <template>
          <el-button type="primary" size="small"><i class="el-icon-connection"></i>详情</el-button>
        </template>
      </el-table-column> -->

    </my-table>
  </div>
</template>

<script>
import { userLoginLogList } from '@/api/operate-manager'
export default {
  name: 'OperateLog',

  data() {
    return {
      list: [],
      formData: {
        username: '',
        userNumber: '',
        comment: '',
        region: ''
      },
      total: 0,
      selectedRows: [] // 当前选择的行
    }
  },
  methods: {
    async getDataList(currentPage, pageSize) {
      console.log('---getDataList----' + currentPage + '---' + pageSize)
      let ret = await userLoginLogList()
      console.log(JSON.stringify(ret))
      console.log('ret.total : ' + ret.total)

      this.list = ret.data
      this.total = ret.total
    },
    onSubmit() {
      console.log('submit!')
    },
    handleSelectionChange(val) {
      console.log('---handleSelectionChange----' + JSON.stringify(val))
      this.selectedRows = val
    },
    openConfirmclear() {
      this.$confirm('是否确认清空所有操作日志数据项?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted() {
    // 由 my-table 组件自己加载数据
    // this.getDataList()
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
}
</style>
