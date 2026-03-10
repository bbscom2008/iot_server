<template>
  <div class="container">
        <!-- <div class="tips">字典管理列表：</div> -->
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="字典名称:">
        <el-input v-model="formData.name" size="small" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典类型:">
        <el-input v-model="formData.type" size="small" placeholder="字典类型"></el-input>
      </el-form-item>
      <el-form-item label="创建时间:" prop="dateRange">
        <el-date-picker
          v-model="formData.createdTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
:default-time="['00:00:00', '23:59:59']"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small" icon="el-icon-search"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button  @click="onSubmit" size="small" icon="el-icon-refresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-button type="primary" plain icon="el-icon-plus">新增</el-button>
    <el-button type="success" plain icon="el-icon-edit">修改</el-button>
    <el-button type="danger" plain :disabled="selectedRows.length == 0" icon="el-icon-delete"
      >删除</el-button
    >
    <el-button type="warning" plain icon="el-icon-download">导出</el-button>
    <el-button type="danger" plain  icon="el-icon-refresh"
      >刷新缓存</el-button
    >

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

      <el-table-column label="序号" align="center" type="index" width="60" />

      <el-table-column align="center" label="字典名称">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="字典类型">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="{ row }">
          <template>
            <span> {{ row.createdTime }} </span>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <i class="el-icon-edit-outline icon"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete icon"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </my-table>
  </div>
</template>

<script>
import { dictionaryManageList } from '@/api/operate-manager'
export default {
  name: 'dictionaryManage',

  data() {
    return {
      list: [],
      formData: {
        name: '',
        type: '',
        createdTime: ''
      },
      total: 0,
      selectedRows: [] // 当前选择的行
    }
  },
  methods: {
    async getDataList(currentPage, pageSize) {
      console.log('---getDataList----' + currentPage + '---' + pageSize)
      let ret = await dictionaryManageList()
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
.icon{
    color: #1890ff;
    font-size: 16px;
}
.item{
    width: 30px;
}
</style>
