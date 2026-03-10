<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="聊天室设置"
    @close="onDialogBtnCancel()"
    :append-to-body="true"
    width="800px"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="快捷短语" name="tab1">
        <el-form
          ref="formDataRef"
          :model="formData"
          label-position="right"
          style="margin-left: 20px"
          label-width="0px"
        >
          <div style="margin-bottom: 10px">
            <el-button type="primary" @click="addInputMsg()">增加一条</el-button>
          </div>

          <div class="input-line" v-for="(item, index) in formData.messageList" :key="index">
            <el-row>
              <el-col :span="18">
                <el-form-item
                  label=""
                  :prop="'messageList.' + index + '.text'"
                  :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]"
                >
                  <el-input v-model="item.text" placeholder="请输入内容" size="small"> </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="4" :push="1">
                <el-button type="danger" @click="removeInput(index)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="快捷卡片" name="tab2">
        <div style="margin-bottom: 10px">
          <el-button type="primary" @click="addInputMsg('card')">增加一条</el-button>
        </div>
        <el-form ref="formDataRef2" :model="formData2" label-width="100px" label-position="right">
          <div class="input-line" v-for="(item, index) in formData2.cardList" :key="index"
            style="border-bottom: 1px solid #ccc;margin-bottom: 15px;"
          >
            <el-row>
              <el-col :span="14">
                <el-form-item
                  label="卡片名称："
                  :prop="'cardList.' + index + '.title'"
                  :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
                >
                  <el-input v-model="item.title" placeholder="请输入标题" size="small"> </el-input>
                </el-form-item>
                <el-form-item
                  label="内容链接："
                  :prop="'cardList.' + index + '.value'"
                  :rules="[{ required: true, message: '请输入链接', trigger: 'blur' }]"
                >
                  <el-input
                    v-model="item.value"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入链接，二维码解析出的数据"
                    size="small"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="账号：">
                  <el-input v-model="item.username" placeholder="请输入账号" size="small">
                  </el-input>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input v-model="item.remark" placeholder="请输入备注" size="small"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <my-qr-code
                  style="margin-left: 10px"
                  :value="item.value"
                  v-if="item.value.length > 0"
                  :size="160"
                ></my-qr-code>
              </el-col>
              <el-col :span="2">
                <el-button type="danger" @click="removeInput(index, 'card')">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="支付设置" name="tab3">
        <payment-settings ref="paymentSettingsRef"></payment-settings>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" style="text-align: center">
      <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
      <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addShortMessage, getShortMessage } from '@/api/chat'
import MyQrCode from '../MyQrCode/MyQrCode.vue'
import PaymentSettings from './payment-settings.vue'
export default {
  components: { MyQrCode, PaymentSettings },
  name: 'ChatSetting',
  data() {
    return {
      dialogVisible: true,
      activeName: 'tab2',
      formData: {
        messageList: [
          // {
          //   text: ''
          // }
        ]
      },
      formData2: {
        cardList: [
          // {
          //   type: 'card',
          //   title: '微信群1',
          //   value: 'http://www.example.com/card1'
          // }
        ]
      },
      responseData: null
    }
  },
  computed: {},
  mounted() {
    this.getShortMessage()
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
    },
    /**
     * 获取快捷短语
     */
    async getShortMessage() {
      this.responseData = await this.$store.dispatch('chat/getShortMessageAction')
      this.formData.messageList = this.$store.state.chat.quickMessageList
      this.formData2.cardList = this.$store.state.chat.quickCardList
    },
    showChatSetting() {
      this.dialogVisible = true
    },

    onDialogBtnCancel() {
      console.log('===onDialogBtnCancel==')
      this.dialogVisible = false
      this.$emit('close')
    },

    addInputMsg(type) {
      if (type == 'card') {
        this.formData2.cardList.push({
          type: 'card',
          title: '',
          value: '',
          username: '',
          remark: ''
        })
      } else {
        this.formData.messageList.push({
          text: ''
        })
      }
    },

    removeInput(index, type) {
      if (type == 'card') {
        this.formData2.cardList.splice(index, 1)
      } else {
        this.formData.messageList.splice(index, 1)
      }
    },

    async onDialogBtnOk() {
      if (this.activeName == 'tab1' || this.activeName == 'tab2') {
        this.btnOkTab1()
        return
      }
      if (this.activeName == 'tab3') {
        await this.$refs.paymentSettingsRef.handleSave()
        this.$emit('close')
      }
    },
    async btnOkTab1() {
      let valid = await new Promise((resolve) => {
        this.$refs.formDataRef.validate((valid) => {
          resolve(valid)
        })
      })

      console.log('valid =======>', valid)
      if (!valid) {
        this.activeName = 'tab1'
        return
      }

      let valid2 = await new Promise((resolve) => {
        this.$refs.formDataRef2.validate((valid) => {
          resolve(valid)
        })
      })

      console.log('valid2 =======>', valid2)
      if (!valid2) {
        this.activeName = 'tab2'
        return
      }
      const params = {
        providerId: this.$store.state.user.personalInfo.providerId,
        content: JSON.stringify([].concat(this.formData.messageList, this.formData2.cardList))
      }

      if (this.responseData && this.responseData.id) {
        params.id = this.responseData.id
      }

      addShortMessage(params).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$store.commit('chat/updateQuickMessageList', this.formData.messageList)
        this.$store.commit('chat/updateQuickCardList', this.formData2.cardList)
        this.$emit('close')
      })
    }
  }
}
</script>

<style></style>
