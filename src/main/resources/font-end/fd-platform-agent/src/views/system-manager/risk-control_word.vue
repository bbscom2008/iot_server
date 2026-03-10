
<template>
  <div class="container">
    <el-card>
      <el-form :inline="true" :model="queryFormData" class="demo-form-inline">
        
    <el-form-item label="敏感词" prop="word_name">
      <el-input v-model="queryFormData.word_name" placeholder="请输入敏感词" size="small" />
    </el-form-item>
  
          <el-form-item label="是否启用" prop="is_enable">
            <el-select filterable  v-model="queryFormData.is_enable" placeholder="请选择是否启用" size="small">
              <el-option label="全部" value=""></el-option>  
              <el-option label="启用" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
          </el-form-item>
          
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
          <el-button type="primary"  size="small" icon="el-icon-search" @click="queryTableData" >搜索</el-button>
          <el-button  size="small" icon="el-icon-refresh" @click="resetQueryForm"  >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-10">
      <el-button type="primary" plain icon="el-icon-plus" @click="showAddDialog()">新增</el-button>
      
      
  <my-table class="mt-10" :loadData="mockData" :tableData="tableData"  :total="50" ref="my-table" style="width: 100%" border    >
    <el-table-column label="序号" align="center" type="index" width="60" />
    <el-table-column label="敏感词" align="center" prop="word_name"  />
    
    <el-table-column label="是否启用" align="center" >
      <template slot-scope="{ row }">
        <el-switch v-model="row.is_enable" />
      </template>
    </el-table-column>

    
        <el-table-column label="创建时间" align="center"   prop="create_time" >
          <template slot-scope="{ row }">
            {{ row.create_time }}
          </template>
        </el-table-column>
  <el-table-column label="备注" align="center" prop="remark"  />
    
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
            <div class="opt-box">
              <div type="success" class="btn"  @click="showEditDialog(row)">
                <i class="el-icon-edit" />修改
              </div>
              <div type="primary" class="btn mt-5"   @click="showConfirmDelete(row)">
                <i class="el-icon-delete" />删除
              </div>
             
            </div>

        </template>
      </el-table-column>
        
  </my-table>

    </el-card>

    
    <el-dialog :visible.sync="dialogVisible" :title="isEdit ? '编辑条目' : '新增条目'" width="600px">
      <el-form
        ref="form"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        
    <el-form-item label="敏感词" prop="word_name">
      <el-input v-model="formData.word_name" placeholder="请输入敏感词" size="small" />
    </el-form-item>
  
        <el-form-item label="是否启用" prop="is_enable">
          <el-switch v-model="formData.is_enable" />
        </el-form-item>
            
          <el-form-item label="创建时间" prop="create_time">
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="formData.create_time" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
              
    <el-form-item label="备注" prop="remark">
      <el-input v-model="formData.remark" placeholder="请输入备注" size="small" />
    </el-form-item>
  
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

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
      formData: {
        index : '',
word_name : '',
is_enable : '',
create_time : '',
remark : '',
opt : '',
      },
      queryFormData: {
        word_name : '',
is_enable : '',
create_time : '',
      },
      isEdit: false, // 是否是编辑状态
      
      // 添加扩展数据，如 options 所需要的数据
      
    }
  },
  methods: {
    async showConfirmDelete(row) {
      try {
        let ret = await this.$confirm(`确定删除 【 ${ row } 】 吗？`)
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
                    index : '',
            word_name : '',
            is_enable : '',
            create_time : '',
            remark : '',
            opt : '',
      }
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
      }else{
        // 新增
        this.formData.id = Date.now() 
        this.tableData.push(this.formData)
      }
    },
    resetQueryForm(){
      this.queryFormData = {
        word_name : '',
is_enable : '',
create_time : '',
      }
      this.mockData()
    },
    
    queryTableData() {
      // todo 搜索
      console.log(this.queryFormData)
      this.mockData()
      
      if (this.queryFormData.word_name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.word_name == this.queryFormData.word_name
        })
      }
    
if (this.queryFormData.is_enable != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.is_enable == this.queryFormData.is_enable
        })
      }
    
if (this.queryFormData.create_time != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.create_time == this.queryFormData.create_time
        })
      }
    

      if (this.queryFormData.name != '') {
        this.tableData = this.tableData.filter((item) => {
          return item.name == this.queryFormData.name
        })
      }
      if (this.queryFormData.gender != '') {
        this.tableData = this.tableData.filter((item) => {
          return (
            item.gender == this.queryFormData.gender
          )
        })
      }
      // 是否启用
      this.tableData = this.tableData.filter((item) => {
        return (
          item.isEnable == this.queryFormData.isEnable
        )
      })
    },
    mockData(){
      // 模拟数据
      let columnList = [{"title":"序号","type":"index","key":"index","isSearch":false,"id":1000},{"title":"敏感词","type":"string","key":"word_name","isSearch":true,"id":1001},{"id":1002,"title":"是否启用","type":"boolean","key":"is_enable","isSearch":true},{"title":"创建时间","type":"date","key":"create_time","isSearch":true,"id":1003},{"id":1005,"title":"备注","type":"string","key":"remark","isSearch":false},{"title":"操作","type":"operate","key":"opt","isSearch":false,"id":1004}]
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
            const date = new Date();
            date.setTime(date.getTime() -  Math.floor(Math.random() * 10000) * 3600 * 1000 * 24);
            ele[column.key] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          } else if (column.type == 'boolean') {
            ele[column.key] = Math.floor(Math.random() * 2) == 0 ? false : true
          } else if (column.type == 'index' || column.type == 'operate' || column.type == 'selection') {
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
  }
}
</script>

<style lang="scss" scoped></style>

  