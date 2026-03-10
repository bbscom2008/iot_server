<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        <el-form-item label="用户名" prop="">
          <el-input
            v-model="queryFormData.botUserName"
            placeholder="请输入用户名"
            size="small"
          />
        </el-form-item>

        <el-form-item label="群组id" prop="">
          <el-input v-model="queryFormData.botChatId" placeholder="群组id" size="small" />
        </el-form-item>

        <el-form-item label="用户类型" prop="">
          <el-select
            filterable
            v-model="queryFormData.botUserType"
            placeholder="请选择用户类型"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="操作员" :value="2"></el-option>
            <el-option label="群组客服" :value="3"></el-option>
            <el-option label="群组提醒" :value="4"></el-option>
          </el-select>
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
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      <el-button type="danger"  icon="el-icon-delete" @click="showDeleteAllDialog()">全部删除</el-button>
      <my-table
        class="mt-10"
        :tableData="tableData"
        :loadData="loadTableData"
        ref="tableRef"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="用户名" align="center" prop="botUserName" />
        <el-table-column label="群组ID" align="center" prop="botChatId" />
        <el-table-column label="用户类型" align="center" prop="botUserType">
          <template slot-scope="{ row }">
            <el-tag v-if="row.botUserType==1">管理员</el-tag>
            <el-tag v-if="row.botUserType==2">操作员</el-tag>
            <el-tag v-if="row.botUserType==3">群组客服</el-tag>
            <el-tag v-if="row.botUserType==4">群组提醒</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <div class="opt-box">
              <div class="btn" @click="showEditDialog(row)"><i class="el-icon-edit" />修改</div>
              <div class="btn mt-5" @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
            </div>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      @close="btnCancel"
      :title="isEdit ? '修改机器人用户' : '新增机器人用户'"
      width="600px"
    >
      <el-form
        ref="formData"
        :model="formData"
        label-position="right"
        :rules="rules"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="用户类型" prop="botUserType">
          <el-select v-model="formData.botUserType" placeholder="请选择用户类型" size="small">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="操作员" :value="2"></el-option>
            <el-option label="群组客服" :value="3"></el-option>
            <el-option label="群组提醒" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="botUserName">
          <el-input v-model="formData.botUserName" placeholder="请输入用户名" size="small" />
        </el-form-item>
        <el-form-item v-if="formData.botUserType===3 || formData.botUserType===4" label="群组id" prop="botChatId">
          <el-input
            v-model="formData.botChatId"
            placeholder="请输入群组ID"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注信息"
            size="small"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="注意">
          <span style="color: red">用户名不能添加@符号，群组ID保留开头负号</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="btnCancel" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBotUserPage,
  botUserDelete,
  botUserUpdate,
  botUserAdd
} from '@/api/bot-user-list.js'
import { botUserMangerRules } from './rules.js'
export default {
  name: 'BotUserList',
  data() {
    return {
      queryFormData: this.getQueryForm(),
      formData: {
        botUserName: '',
        botChatId: null,
        botUserType: null,
        remark: ''
      },
      tableData: [],
      isEdit: false, // 是否是编辑状态
      dialogVisible: false,
      rules: botUserMangerRules,
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.tableRef.getTableData(1)
      }
    }
  },
  methods: {
    getQueryForm() {
      return {
        botUserName: '',
        botChatId: null,
        botUserType: null
      }
    },
    queryTableData() {
      // 刷新表格
      this.$refs.tableRef.getTableData(1);
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
    },
    showAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        botUserName: '',
          botChatId: null,
          botUserType: null,
          remark: ''
      }
    },
    async loadTableData(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          params[key] = this.queryFormData[key]
        }
      })
      let res = await getBotUserPage(page, params)
      this.tableData = res.data.list
      return res
    },
    showEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除机器人用户 【 ${row.botUserName} 】 吗？`)
        let res = await botUserDelete(row.botUserId)
        console.log(res, '删除成功')
        this.$refs.tableRef.getTableData(1)
      } catch (e) {
        console.log('取消删除')
      }
    },
    async showDeleteAllDialog() {
      try {
        await this.$confirm('确定删除所有机器人用户吗？此操作不可撤销。')
        // 遍历当前表格数据并删除每一条
        const deletePromises = this.tableData.map(row => botUserDelete(row.botUserId))
        await Promise.all(deletePromises)
        this.$message.success('所有机器人用户已删除')
        this.$refs.tableRef.getTableData(1)
      } catch (e) {
        console.log('取消删除或出现错误', e)
      }
    },
    btnCancel() {
      console.log('----btnCancel----')
      this.dialogVisible = false
      this.$refs.formData.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            //修改
            const {botUserId, botUserName, botChatId, botUserType, remark } = this.formData
            let res = await botUserUpdate({botUserId, botUserName ,botChatId, botUserType, remark})
            console.log(res, '编辑')
          } else {
            //新增
            let res = await botUserAdd({ tenantId: this.$store.state.tenant.selectTenantId, ...this.formData})
            console.log(res, '添加')
          }
          this.btnCancel()
          this.$refs.tableRef.getTableData(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
  mounted() {

  }

}
</script>

<style scoped lang="scss">

</style>
