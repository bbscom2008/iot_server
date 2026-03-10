<template>
  <div class="container">
    <!-- <div class="tips">统一模板</div> -->
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="名称：">
        <el-input v-model="formData.name" size="small" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select filterable  v-model="formData.status" multiple placeholder="请选择" clearable size="small">
          <el-option label="状态1" value="1" />
          <el-option label="状态2" value="2" />
          <el-option label="状态3" value="3" />
          <el-option label="状态4" value="4" />
          <el-option label="状态5" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间：" prop="dateRange">
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
        <el-button @click="onSubmit" size="small" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-button type="success" plain icon="el-icon-edit">修改</el-button>
    <el-button type="danger" plain :disabled="selectedRows.length == 0" icon="el-icon-delete"
      >删除</el-button
    >
    <el-button type="warning" plain icon="el-icon-download">导出</el-button>
    <el-button type="danger" plain icon="el-icon-refresh">刷新缓存</el-button>

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

      <el-table-column align="center" label="名称">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.status == '1' ? 'success' : 'info'">
            {{ row.status == '1' ? '启用中' : '未启用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否绑定">
        <template slot-scope="{ row }">
          <el-checkbox :checked="row.isBind == '1' ? true : false" style="margin-left: 15px">
            {{ row.isBind == '1' ? '已绑定' : '未绑定' }}
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否可用">
        <template slot-scope="{ row }">
          <el-switch v-model="row.isEnable" active-color="#13ce66" inactive-color="#999">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="{ row }">
          <template>
            <span> {{ row.createdTime }} </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
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
    <el-dialog :visible.sync="dialogVisible" title="新建模板" width="600px">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" size="small" />
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select filterable  v-model="form.type" placeholder="请选择" @change="selectChange" size="small">
            <el-option label="类型1" value="1" />
            <el-option label="类型2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否支持：" prop="isGeneral">
          <el-radio-group v-model="form.isGeneral" size="small">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="2">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否隐藏：" prop="isHide">
          <el-switch
            active-text="是"
            inactive-text="否"
            v-model="form.isHide"
            active-color="#13ce66"
            inactive-color="#999"
            size="small"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>


    <div class="con">
      <el-button @click="length='20'">20cm</el-button>
      <el-button @click="length='40'">40cm</el-button>
      
      <div class="con1">
        <p :class="length=='20'?'Length20':'Length40'">
      </p>
      </div>
    </div>
  </div>
</template>

<script>
// import { dictionaryManageList } from '@/api/operate-manager'
export default {
  name: 'dictionaryManage',

  data() {
    const validateRemark = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    }
    return {
      length:'20',
      list: [
        {
          name: '测试名称',
          type: '测试类型',
          status: 1,
          isBind: 1,
          isEnable: true,
          createdTime: '2025-02-10 14:28:15',
          remark: '我是一个备注'
        },
        {
          name: '测试名称',
          type: '测试类型',
          status: 0,
          isBind: 0,
          isEnable: false,
          createdTime: '2025-02-10 14:28:15',
          remark: '我是一个备注'
        }
      ],
      formData: {
        name: '',
        status: '',
        createdTime: ''
      },
      dialogVisible: false,
      total: 0,
      selectedRows: [], // 当前选择的行
      form: {
        name: '',
        type: '',
        isGeneral: 1,
        isHide: 0,
        remark: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入' }],
        type: [{ required: true, trigger: 'change', message: '请选择' }],
        isGeneral: [{ required: true, trigger: 'change', message: '请选择' }],
        isHide: [{ required: true, trigger: 'change', message: '请选择' }],
        remark: [{ required: true, trigger: 'blur', validator: validateRemark }]
      }
    }
  },
  methods: {
    async getDataList(currentPage, pageSize) {
      //   console.log('---getDataList----' + currentPage + '---' + pageSize)
      //   let ret = await dictionaryManageList()
      //   console.log(JSON.stringify(ret))
      //   console.log('ret.total : ' + ret.total)
      //   this.list = ret.data
      //   this.total = ret.total
    },
    selectChange(e) {
      console.log(e)
    },
    onSubmit() {
      console.log('submit!')
    },
    handleAdd() {
      this.dialogVisible = true
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('提交')
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
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
.icon {
  color: #1890ff;
  font-size: 16px;
}
.item {
  width: 30px;
}
.con{
  cursor: pointer;
  transition: all 0.3s;
}
.con1{
  transition: all 0.3s;
}
.Length20{
   transition: all 0.3s;
  background:red;
  width: 200px;
  height: 100px;
  border-radius: 20px;
}
.Length40{
   transition: all 0.3s;
  background:pink;
  width: 400px;
  height: 50px;
  border-radius: 20px;
}
</style>
