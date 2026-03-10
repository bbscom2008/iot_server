<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="操作类型" prop="handle_type">
          <el-input v-model="queryFormData.handle_type" placeholder="请输入操作类型" size="small" />
        </el-form-item>

        <el-form-item label="操作人员" prop="handle_person">
          <el-input
            v-model="queryFormData.handle_person"
            placeholder="请输入操作人员"
            size="small"
          />
        </el-form-item>

        <el-form-item label="操作时间" prop="handle_time">
          <el-date-picker
            v-model="queryFormData.handle_time"
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
      <!-- <el-button type="primary" plain icon="el-icon-plus" @click="showExportDialog()"
        >导出</el-button
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
        <el-table-column label="系统模块" align="center" prop="system_module" />
        <el-table-column label="操作类型" align="center" prop="handle_type" />
        <el-table-column label="操作人员" align="center" prop="handle_person" />
        <el-table-column label="操作地址" align="center" prop="handle_address" />
        <el-table-column label="操作状态" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.handle_status == '1'" type="success" size="small">成功</el-tag>
            <el-tag v-if="row.handle_status == '2'" type="danger" size="small">失败</el-tag>
            <el-tag v-if="row.handle_status == '0'" type="warning" size="small">操作中</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作时间" align="center" prop="handle_time">
          <template slot-scope="{ row }">
            {{ row.handle_time }}
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
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'gCodePreview',
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      code: '',
      tableData: [],
      dialogVisible: false,
      drawer: false,
      formData: {
        index: '',
        system_module: '',
        handle_type: '',
        handle_person: '',
        handle_address: '',
        handle_status: '',
        handle_time: ''
      },
      queryFormData: {
        handle_type: '',
        handle_person: '',
        handle_time: ''
      },
      isEdit: false // 是否是编辑状态

      // 添加扩展数据，如 options 所需要的数据
    }
  },
  methods: {
    showExportDialog() {
      console.log('导出')
    },
    showClassifyDialog() {
      this.drawer = true
    },
    handleClose() {
      this.drawer = false
    },
    resetQueryForm() {
      this.queryFormData = {
        handle_type: '',
        handle_person: '',
        handle_time: ''
      }
      this.mockData()
    },

    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()

      if (this.queryFormData.handle_type != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.handle_type == this.queryFormData.handle_type
        })
      }

      if (this.queryFormData.handle_person != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.handle_person == this.queryFormData.handle_person
        })
      }

      if (this.queryFormData.handle_time != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.handle_time == this.queryFormData.handle_time
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
        { title: '系统模块', type: 'string', key: 'system_module', isSearch: false, id: 1001 },
        { title: '操作类型', type: 'string', key: 'handle_type', isSearch: true, id: 1002 },
        { title: '操作人员', type: 'string', key: 'handle_person', isSearch: true, id: 1003 },
        { title: '操作地址', type: 'string', key: 'handle_address', isSearch: false, id: 1004 },
        { title: '操作状态', type: 'string', key: 'handle_status', isSearch: false, id: 1005 },
        { title: '操作时间', type: 'date', key: 'handle_time', isSearch: true, id: 1006 }
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
          if (column.title == '操作状态') {
            ele[column.key] = Math.floor(Math.random() * 3)
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
