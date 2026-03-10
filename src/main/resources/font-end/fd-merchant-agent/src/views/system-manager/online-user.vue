<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="账号" prop="user_name">
          <el-input v-model="queryFormData.user_name" placeholder="请输入账号" size="small" />
        </el-form-item>

        <el-form-item label="登录IP" prop="login_ip">
          <el-input v-model="queryFormData.login_ip" placeholder="请输入登录IP" size="small" />
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
      <!-- <el-button type="primary" plain icon="el-icon-plus" @click="RefreshBtn">刷新</el-button> -->

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
        <el-table-column label="账号" align="center" prop="user_name" />
        <el-table-column label="用户名称" align="center" prop="user_nick_name" />
        <el-table-column label="登录设备" align="center" prop="login_shebei">
          <template slot-scope="{ row }">
            <span v-if="row.login_shebei == 0"> <svg-icon icon-class="weizhi" /> &nbsp;未知</span>
            <span v-if="row.login_shebei == 1">
              <svg-icon icon-class="windows" />&nbsp;Windows</span
            >
            <span v-if="row.login_shebei == 2"><svg-icon icon-class="MACOS" />&nbsp;macOS</span>
            <span v-if="row.login_shebei == 3"><svg-icon icon-class="linux" />&nbsp;linux</span>
            <span v-if="row.login_shebei == 4"><svg-icon icon-class="iphone" />&nbsp;iPhone</span>
            <span v-if="row.login_shebei == 5"><svg-icon icon-class="ipad" />&nbsp;iPad</span>
            <span v-if="row.login_shebei == 6"><svg-icon icon-class="android" />&nbsp;Android</span>
          </template>
        </el-table-column>
        <el-table-column label="登录IP" align="center" prop="login_ip" />
        <el-table-column label="最后登录时间" align="center"  prop="last_login_time" />

        <el-table-column label="创建时间" align="center"  prop="created_time">
          <template slot-scope="{ row }">
            {{ row.created_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click="showConfirmDelete(row)">
              <i class="el-icon-delete" /> 踢出
            </el-button>
          </template>
        </el-table-column>
      </my-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'gCodePreview',
  data() {
    return {
      code: '',
      tableData: [],
      formData: {
        index: '',
        user_name: '',
        user_nick_name: '',
        login_shebei: '',
        login_ip: '',
        last_login_time: '',
        created_time: ''
      },
      queryFormData: {
        user_name: '',
        login_ip: ''
      },
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    RefreshBtn() {
      console.log('刷新')
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定踢出用户 【 ${row.user_name} 】 吗？`)
        this.tableData = this.tableData.filter((item) => {
          return item.id !== row.id
        })
        //todo 调用接口删除
        console.log('删除成功')
      } catch (e) {
        console.log('取消删除')
      }
    },
    resetQueryForm() {
      this.queryFormData = {
        user_name: '',
        login_ip: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.user_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.user_name == this.queryFormData.user_name
        })
      }

      if (this.queryFormData.login_ip != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.login_ip == this.queryFormData.login_ip
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
        { title: '账号', type: 'string', key: 'user_name', isSearch: true, id: 1001 },
        { title: '用户名称', type: 'string', key: 'user_nick_name', isSearch: false, id: 1002 },
        { title: '登录设备', type: 'string', key: 'login_shebei', isSearch: false, id: 1003 },
        { title: '登录IP', type: 'string', key: 'login_ip', isSearch: true, id: 1004 },
        {
          title: '最后登录时间',
          type: 'date',
          key: 'last_login_time',
          isSearch: false,
          id: 1005
        },
        { title: '创建时间', type: 'date', key: 'created_time', isSearch: false, id: 1006 }
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

          if (column.title == '登录设备') {
            ele[column.key] = Math.floor(Math.random() * 6)
          } else if (column.title == '登录IP') {
            //189.125.125.2
            https: ele[column.key] =
              ' https://' +
              Math.floor(Math.random() * 300) +
              '.' +
              Math.floor(Math.random() * 300) +
              '.' +
              Math.floor(Math.random() * 300) +
              '.' +
              Math.floor(Math.random() * 1)
          }
        })
        this.tableData.push(ele)
      })
    }
  },
  mounted() {
    this.mockData()
  }
}
</script>

<style lang="scss" scoped></style>
