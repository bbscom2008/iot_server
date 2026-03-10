<template>
  <div class="container">
    <!-- <h3>运营管理 - 收银台模板管理</h3> -->
    <div class="tips">收银台模板：</div>
    <div class="template-con">
      <div class="add-template-item" @click="addTemplate">
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

      <div class="template-item" v-for="(item, index) of list" :key="index">
        <div class="template-item-top" style="background-color: rgb(0, 94, 166); height: 100px">
          <img
            :src="require('@/assets/img/' + logoUrl[item.baseInfo.templeTitleLogoUrl].name)"
            style="height: 40px"
          />
        </div>
        <div class="template-item-center">
          <p class="template-item-title">{{ item.baseInfo.templeName }}</p>
        </div>
        <div class="template-item-bottom">
          <el-button type="text" @click="editTemplate(item, index)">编辑</el-button>
          <el-button type="text" @click="preview(item)">预览</el-button>
          <el-button type="text" @click="deleteBtn(index)">删除</el-button>
          <el-button type="text" @click="copyTemplate(item, index)">复制</el-button>
        </div>
      </div>

      <el-dialog
        @close="btnCopyCancel"
        :visible.sync="dialogVisible"
        title="复制模板"
        width="500px"
      >
        <el-form ref="copyForm" label-width="120px" :rules="rules" :model="copyForm">
          <el-form-item label="原模板名称" prop="">
            <el-input v-model="copyForm.oldName" disabled size="small" />
          </el-form-item>

          <el-form-item label="新模板名称" prop="templeName">
            <el-input
              v-model="copyForm.templeName"
              placeholder="请输入模板名称"
              size="small"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="btnCopyCancel" size="small"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmit()" size="small"> 确定 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { templateManagerList } from '@/api/operate-manager'

export default {
  name: 'TemplateManager',
  data() {
    const validateService = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    }
    const validateGeneral = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    }
    return {
      // list: [],
      dialogVisible: false,
      copyForm: {
        oldName: '', // 原模板名称
        cashTempleId: '', // 原收银台模板ID
        templeName: '' // 复制后模板新名称
      },
      rules: {
        isGeneral: [{ required: true, trigger: 'change', message: '请选择' }],
        isChild: [{ required: true, trigger: 'change', message: '请选择' }],
        payRefer: [{ required: true, trigger: 'change', message: '请选择' }],
        serviceMerchant: [{ required: true, trigger: 'blur', validator: validateService }],
        generalMerchant: [{ required: true, trigger: 'blur', validator: validateGeneral }]
      },

      logoUrl: [
        { name: 'weixin-pay.png', label: '微信支付' },
        { name: 'zhifu-pay.png', label: '支付宝支付' },
        { name: 'zhongguo-pay.png', label: '中国银行' },
        { name: 'gongshang-pay.png', label: '工商银行' }
      ]
    }
  },
  computed: {
    list() {
      return this.$store.state['gcode-state'].templateList
    }
  },
  methods: {
    copyTemplate(item, index) {
      this.dialogVisible = true
      this.copyForm.oldName = item.baseInfo.templeName
      this.copyForm.cashTempleId = item.baseInfo.cashTempleId

    },
    editTemplate(item, index) {
      this.$store.state['gcode-state'].currEditTemplateId = index
      this.$router.push('/service-manager/template-create')
    },
    preview(item) {
      console.log('-----preview(item)------')

      localStorage.setItem('templateData', JSON.stringify(item))
      window.open('http://localhost:9527/#/template-preview', '_blank')
    },
    // async templateManagerList() {
    //   let ret = await templateManagerList()
    //   this.list = ret.data
    // },
    addTemplate() {
      // this.dialogVisible = true
      this.$store.state['gcode-state'].currEditTemplateId = -1
      this.$router.push('/service-manager/template-create')
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
    },
    btnCopyCancel() {
      this.dialogVisible = false
      this.$refs.copyForm.resetFields()
    },
    deleteBtn(index) {
      this.$confirm('确认删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.$store.state['gcode-state'].templateList.splice(index, 1)
          console.log('-------index----' + index)

          this.$store.commit('gcode-state/removeTemplateList', index)

          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   })
        })
    }
  },
  mounted() {
    // this.templateManagerList()
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
      color: rgba(0, 0, 0, 0.35);
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
        color: rgba(0, 0, 0, 0.8);
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
