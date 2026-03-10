<template>
  <div class="container">
    <!-- <h3>运营管理 - 收银台模板管理</h3> -->

    <el-card>
      <el-form :inline="true" :rules="queryRules" ref="queryFormDataRef"  :model="queryFormData" class="demo-form-inline">
        <el-form-item label="模板名称" prop="templateName">
          <el-input
            v-model="queryFormData.templateName"
            placeholder="请输入模板名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="是否默认" prop="isDefault">
          <el-select
            filterable
            v-model="queryFormData.isDefault"
            placeholder="请选择是否启用"
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="默认" :value="1"></el-option>
            <el-option label="非默认" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryFormData.createTime"
            type="datetimerange"
            :picker-options="myPickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
:default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryBtnSearch()"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt-20">
      <div class="tips">收银台模板：</div>
      <div class="template-con">
        <div class="add-template-item" @click="addTemplate" 
         v-if="$store.getters.userPermissionList.indexOf('template-create') !=-1 || $store.state.user.tokenInfo.isPlatformAdmin"  >

          <div class="add-template-img-con">
            <img
              data-v-47ed671f=""
              src="//jeequan.oss-cn-beijing.aliyuncs.com/jeepay/cdn/d/manager/assets/add-icon.a2f73e90.svg"
              alt="add-icon"
              class="add-template-img"
            />
            <img
              data-v-47ed671f=""
              src="//jeequan.oss-cn-beijing.aliyuncs.com/jeepay/cdn/d/manager/assets/add-icon-hover.50df40dd.svg"
              alt="add-icon"
              class="add-template-img-hover"
            />
          </div>
          <p class="add-template-text">新建模板</p>
        </div>

        <div class="template-item" v-for="(item, index) of templateList" :key="index">
          <div
            class="template-item-top"
            style="height: 100px"
            :style="{ backgroundColor: `#42b983`, position: 'relative' }"
          >
           <div style="height: 45px;width:45px;" v-loading="item.iconUrl==''">
              <!-- <img
              :src="item.iconUrl"
              style="height: 100%"
              /> -->
              <el-image
                style="height: 100%;width:100%"
                :src="item.iconUrl"
                fit="cover"></el-image>

            </div>
             <el-tag 
            style="position: absolute; top: 0px; right: 0px;"
            v-if="item.isDefault==1" type="success" effect="dark" >默认</el-tag>
          </div>

          <div class="template-item-center">
            <p class="template-item-title">{{ item.templateName }}</p>
          </div>
          <div class="template-item-bottom">

            <!-- <el-button v-if="item.isDefault" disabled type="text" >默认模板</el-button> -->
            <el-button  type="text" @click="editTemplate(item, index)">{{item.isDefault==1?'复制':'编辑'}}</el-button>
            <!-- <el-button type="text" @click="preview(item)">预览</el-button> -->
            <el-button v-if="!item.isDefault" type="text" @click="deleteBtn(item)">删除</el-button>
            <!-- <el-button type="text" @click="copyTemplate(item, index)">复制</el-button> -->
            <a :href="`/template-preview?templateId=${item.cashTemplateId}`" target="_blank"  ><el-button type="text">预览</el-button></a>
          </div>
        </div>
      </div>
      <div>
        <el-pagination
          style="margin-top: 20px; text-align: right"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[15, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog @close="btnCopyCancel" :visible.sync="dialogVisible" title="复制模板" width="500px">
      <el-form ref="copyForm" label-width="120px" :rules="rules" :model="copyForm">
        <el-form-item label="模板名称" prop="">
          <el-input v-model="copyForm.oldName" disabled size="small" />
        </el-form-item>

        <!-- <el-form-item label="新模板名称" prop="templeName">
          <el-input v-model="copyForm.templeName" placeholder="请输入模板名称" size="small" />
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="btnCopyCancel" size="small"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTemplateList, deleteTemplate } from '@/api/template-create'

import { BankInfoList } from '@/utils/constants'

import { templateRules, queryRules } from './rules.js'

import { getFileById } from '@/api/upload'

export default {
  name: 'TemplateManager',
  data() {
    return {
      queryRules:queryRules,
      rules: templateRules,
      dialogVisible: false,
      copyForm: {
        oldName: '', // 原模板名称
        cashTempleId: '', // 原收银台模板ID
        templeName: '' // 复制后模板新名称
      },

      pageSize: 100, // 每页显示条数
      pageNum: 1, // 当前页码
      total: 0, // 总条数

      templateList: [],

      logoUrl: BankInfoList,
      queryFormData: this.getQueryForm()
    }
  },
  // computed: {
  //   list() {
  //     return this.$store.state['gcode-state'].templateList
  //   }
  // },
  methods: {

    loadImageIcon(){
        this.templateList.forEach(ele=>{
        let templateTitleLogoUrl = ele.templateTitleLogoUrl
        console.log('templateTitleLogoUrl, : ', templateTitleLogoUrl)

          if(templateTitleLogoUrl.length < 3){  // 系统图标

            ele.iconUrl = require('@/assets/img_bank/' + this.logoUrl[templateTitleLogoUrl].icon)
          }else{ // 自定义图标
            // fileId 
           getFileById(templateTitleLogoUrl).then(res=>{
             ele.iconUrl =  res.data.fileUrl
           })
          }
      })
    
    },

    async queryTableData() {
      let params = {
        tenantId: this.$store.state.tenant.currTenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          params[key] = this.queryFormData[key]
        }
      })

      let ret = await getTemplateList({ pageNum: this.pageNum, pageSize: this.pageSize }, params)
      this.templateList = ret.data.list.map(ele=>{
        return {
          ...ele,
          iconUrl:''
        }
      })
      this.total = ret.data.total

      this.loadImageIcon()
    },

    queryBtnSearch(){
      this.$refs.queryFormDataRef.validate(async (valid) => {
        if (valid) {
          this.pageNum = 1
          this.flushPage()
        }
      })
    },
    flushPage() {
      this.queryTableData()
    },

    resetQueryForm() {
      this.pageSize = 10
      this.pageNum = 1
      this.queryFormData = this.getQueryForm()
      this.$refs.queryFormDataRef.resetFields()
      this.flushPage()
    },
    getQueryForm() {
      return {
        templateName: '', // 模板名称
        isDefault: '', // 是否默认
      }
    },

    handleSizeChange(size) {
      this.pageSize = size
      this.flushPage()
    },
    // 当前页码变化
    handleCurrentChange(page) {
      this.pageNum = page
      this.flushPage()
    },

    copyTemplate(item, index) {
      this.dialogVisible = true
      this.copyForm.cashTemplateId = item.cashTemplateId
      this.copyForm.oldName = item.templateName
      this.copyForm.cashTempleId = item.cashTemplateId
    },

    editTemplate(item, index) {
      this.$store.state['gcode-state'].currEditTemplateId = item.cashTemplateId
      this.$router.push('/service-manager/template-create')
    },
    preview(item) {
      console.log('-----preview(item)------')

      localStorage.setItem('templateData', JSON.stringify(item))
      window.open('http://localhost:9527/#/template-preview', '_blank')
    },

    addTemplate() {
      this.$store.state['gcode-state'].currEditTemplateId = -1
      this.$router.push('/service-manager/template-create')
    },
    async handleSubmit() {
      let res = await copyTemplate(this.copyForm.cashTemplateId)

      this.$message.success('复制成功!')
      this.dialogVisible = false
      this.flushPage()
    },
    btnCopyCancel() {
      this.dialogVisible = false
      // this.$refs.copyForm.resetFields()
    },
    deleteBtn(item) {
      this.$confirm('确认删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log('-------item----', item)

        await deleteTemplate(BigInt(item.cashTemplateId))
        this.$message.success('删除成功!')
        this.flushPage()
      })
    }
  },
  mounted() {
    this.flushPage()
  }
}
</script>

<style lang="scss" scoped>

.dark .template-con .add-template-item{
  background: #333;
}

.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
}
.template-con {
  //   display: flex;
  //   justify-content: space-between;
  //   flex-wrap: wrap;
  //   align-content: flex-start;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  .add-template-item:hover {
    cursor: pointer;
  }
  .add-template-item:hover .add-template-img {
    opacity: 0;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  .add-template-item:hover .add-template-img-hover {
    opacity: 1;
    -webkit-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }
  .add-template-item:hover {
    border-color: rgba(25, 83, 255, 0.3);
    background: rgba(25, 83, 255, 0.06);
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  .add-template-item:hover .add-template-text {
    color: #1953ff;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  .add-template-item {
    height: 200px;
    background: rgba(240, 238, 238, 1);
    width: 180px;
    border-radius: 6px;
    border: 2px dashed rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin: 12px;
    .add-template-img-con {
      width: 80px;
      height: 80px;
      position: relative;
    }
    .add-template-img {
      width: 80px;
      height: 80px;
      opacity: 1;
      position: absolute;
    }
    .add-template-img-hover {
      width: 80px;
      height: 80px;
      opacity: 0;
      position: absolute;
    }
    .add-template-text {
      font-size: 13px;
      margin-top: 8px;
      
    }
  }

  .template-item {
    height: 200px;
    background: rgba(179, 179, 179, 0.1);
    width: 180px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 12px;
    .template-item-top {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .template-item-center {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      border-bottom: 0.5px solid rgba(179, 179, 179, 0.2);
      .template-item-title {
        font-size: 15px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
      }
    }
    .template-item-bottom {
      padding: 0 12px;
      height: 50px;
      color: rgba(0, 0, 0, 0.55);
      font-size: 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      ::v-deep i {
        font-weight: 600;
      }
    }
  }
}
</style>
