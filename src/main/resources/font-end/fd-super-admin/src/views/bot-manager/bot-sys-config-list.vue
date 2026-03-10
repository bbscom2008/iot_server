<template>
  <div class="container">
    <div class="tips" v-if="isShowUi">
      <p>
        系统参数配置，除非你知道修改的意义，<span style="color: red">否则请不要随意修改！</span>
      </p>
      <p>Telegram机器人配置说明，修改机器人用户以及token后，请点击机器人重新连</p>
      <p>关于机器人如何注册请看下方文档</p>
      <p>
        文档地址：
        <span style="color: red"
          >https://docs.google.com/document/d/1rqW4iYn8Vaes5pEDvck_cpRrxQRlqXiT/edit?usp=sharing&ouid=106139871857272253346&rtpof=true&sd=true</span
        >
      </p>
      <p>
        有任何问题，<span style="color: blue"
          >请查看说明+文档，自助处理！实在不会的群里@客服。</span
        >
      </p>
    </div>

    <el-card class="mt-10">
      <el-button type="primary" size="small" @click="addConfig"> 新增配置 </el-button>
      <el-button type="primary" plain @click="botRegisterAgain()">机器人重连</el-button>

      <my-table
        class="mt-10"
        ref="tableRef"
        :tableData="tableData"
        :loadData="getBotSysConfigPage"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="配置项名称" align="center" prop="configName" />
        <el-table-column label="配置项值" align="center" prop="configValue">
          <template slot-scope="{ row }">
            <div v-if="row.configType == 0">
              {{ row.configValue }}
            </div>
            <div v-else-if="row.configType == 1">
              <el-switch
                v-model="row.configValue"
                active-value="true"
                inactive-value="false"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="isActiveSwitch(row)"
              ></el-switch>
            </div>

            <div v-else-if="row.configType == 2">
              <el-select
                filterable
                v-model="row.configValue"
                placeholder="请选择值"
                @change="selectChange(row)"
                size="small"
              >
                <el-option
                  :label="item.inputName"
                  :value="item.inputValue"
                  v-for="item in row.itemDataObj.inputMessage"
                  :key="item.inputValue"
                ></el-option>
              </el-select>
            </div>
            <div v-else-if="row.configType == 3">
              <div>
                状态：
                <el-tag :type="row.itemDataObj.isEnable ? 'success' : 'danger'">
                  {{ row.itemDataObj.isEnable ? '开启' : '关闭' }}</el-tag
                >
              </div>

              <div v-for="item in row.itemDataObj.inputMessage" :key="item.inputValue">
                <el-tag type="primary">{{ item.inputName }}</el-tag> {{ item.inputValue }}
              </div>
            </div>
            <div v-else>
              {{ displayValue(row.configValue) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />

        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- <el-switch
              v-if="row.configValue == 'true' || row.configValue == 'false'"
              v-model="row.configValue"
              active-value="true"
              inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="isActiveSwitch(row)"
            >
            </el-switch> -->
            <el-tag
              style="cursor: pointer"
              type="primary"
              size="small"
              @click="showUpdateDialog(row)"
              >更新配置
            </el-tag>
            <el-tag type="danger" size="small" @click="deleteConfig(row)">删除 </el-tag>
          </template>
        </el-table-column>
      </my-table>
    </el-card>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改配置' : '新增配置'"
      @close="onBtnCancel"
      width="700px"
    >
      <!-- <div>
        <p class="text red">{{ this.formData.configName ? this.formData.configName : '' }}</p>
      </div>

      <div>key : {{ this.formData.configKey }}</div> -->

      <el-form
        ref="formDataRef"
        :model="formData"
        label-position="right"
        style="margin-right: 50px"
        label-width="120px"
      >
        <el-form-item label="名称" prop="configName">
          <el-input v-model="formData.configName" placeholder="输入名称" size="small" />
        </el-form-item>

        <el-form-item label="key" prop="configKey">
          <el-input v-model="formData.configKey" placeholder="输入key" size="small" />
        </el-form-item>

        <el-form-item label="参数类型" prop="configType">
          <el-select
            filterable
            v-model="formData.configType"
            placeholder="请选择参数类型"
            size="small"
          >
            <!-- 0 1 2 3 4  -->
            <el-option label="输入框" :value="0"></el-option>
            <el-option label="单选框" :value="1"></el-option>
            <el-option label="下拉选择框" :value="2"></el-option>
            <el-option label="有开关的输入框" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="formData.configType == 0">
          <el-form-item label="值" prop="configValue">
            <el-input v-model="formData.configValue" placeholder="输入值" size="small" />
          </el-form-item>
        </template>

        <template v-if="formData.configType == 1">
          <el-form-item label="值" prop="configValue">
            <el-select
              filterable
              v-model="formData.configValue"
              placeholder="请选择值"
              size="small"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="formData.configType == 2">
          <!-- 有开关的输入框  通用模板 -->
          <el-row>
            <el-col :span="12">
              <!-- 输入框的数量 -->
              <el-form-item label="输入框的数量" prop="inputCount">
                <el-input
                  v-model.number="formData.inputCount"
                  placeholder="请输入输入框的数量"
                  @change="handleInputCountChange"
                  size="small"
                >
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="当前值" prop="currentValue">
                <el-select
                  filterable
                  v-model="formData.configValue"
                  placeholder="请选择值"
                  size="small"
                >
                  <el-option
                    :label="item.inputName"
                    :value="item.inputValue"
                    v-for="(item, index) in formData.inputMessage"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="input-line" v-for="(item, index) in formData.inputMessage" :key="index">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label="`名称${index + 1}`"
                  :prop="`inputMessage[${index}].inputName`"
                  :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
                >
                  <el-input v-model="item.inputName" placeholder="请输入名称" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item
                  label-width="80px"
                  :label="`key值${index + 1}`"
                  :prop="`inputMessage[${index}].inputKey`"
                  :rules="[{ required: true, message: '请输入key值', trigger: 'blur' }]"
                >
                  <el-input v-model="item.inputKey" placeholder="请输入key值" size="small">
                  </el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <!-- value 值 -->
                <el-form-item
                  label-width="90px"
                  :label="`value 值${index + 1}`"
                  :prop="`inputMessage[${index}].inputValue`"
                  :rules="[{ required: true, message: '请输入value 值', trigger: 'blur' }]"
                >
                  <el-input v-model="item.inputValue" placeholder="请输入value 值" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>

        <template v-if="formData.configType == 3">
          <!-- 有开关的输入框  通用模板 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="是否开启：" prop="isEnable">
                <el-switch v-model="formData.isEnable" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 输入框的数量 -->
              <el-form-item label="输入框的数量" prop="inputCount" v-if="formData.isEnable">
                <el-input
                  v-model.number="formData.inputCount"
                  placeholder="请输入输入框的数量"
                  @change="handleInputCountChange"
                  size="small"
                >
                  <template slot="append">个</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="input-line" v-for="(item, index) in formData.inputMessage" :key="index">
            <el-row v-if="formData.isEnable">
              <el-col :span="8">
                <el-form-item
                  :label="`名称${index + 1}`"
                  :prop="`inputMessage[${index}].inputName`"
                  :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
                >
                  <el-input v-model="item.inputName" placeholder="请输入名称" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- key值 -->
                <el-form-item
                  label-width="80px"
                  :label="`key值${index + 1}`"
                  :prop="`inputMessage[${index}].inputKey`"
                  :rules="[{ required: true, message: '请输入key值', trigger: 'blur' }]"
                >
                  <el-input v-model="item.inputKey" placeholder="请输入key值" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- value 值 -->
                <el-form-item
                  label-width="90px"
                  :label="`value 值${index + 1}`"
                  :prop="`inputMessage[${index}].inputValue`"
                  :rules="[{ required: true, message: '请输入value 值', trigger: 'blur' }]"
                >
                  <el-input v-model="item.inputValue" placeholder="请输入value 值" size="small">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="输入值"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            size="small"
          />
        </el-form-item>
      </el-form>

      <!-- <el-select
        v-model="formData.configValue"
        placeholder="请选择"
        v-if="['all', 'bank', 'wxPay', 'aliPay'].includes(formData.configValue)"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->

      <el-input
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 10 }"
        v-model="formData.configValue"
        size="small"
        placeholder="请输入"
      />

      <div style="margin-top: 10px; text-align: center">
        <el-button type="primary" @click="onBtnOK()" size="small"> 确认</el-button>
        <el-button type="info" @click="onBtnCancel()" size="small"> 取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  botRegisterAgain,
  botSysConfigUpdate,
  getBotSysConfigPage,
  addBotConfig,
  deleteBotConfig
} from '@/api/bot-sys-config-list.js'

import { Switch } from 'element-ui'

export default {
  name: 'BotSysConfigList',
  components: {
    // 局部注册，覆盖全局的同名自定义组件
    'el-switch': Switch
  },
  data() {
    return {
      isShowUi: true,
      isEdit: false,
      tableData: [],
      dialogVisible: false,
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'bank',
          label: '银行卡'
        },
        {
          value: 'wxPay',
          label: '微信'
        },
        {
          value: 'aliPay',
          label: '支付宝'
        }
      ],
      formData: {}
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
    addConfig() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        configName: '',
        configKey: '',
        configType: 0,
        configValue: '',
        remark: '',
        itemData: ''
      }
    },

    handleInputCountChange(n) {
      if (!this.formData.inputMessage) {
        // this.formData.inputMessage = []
        this.$set(this.formData, 'inputMessage', [])
      }
      if (n > this.formData.inputMessage.length) {
        new Array(n - this.formData.inputMessage.length).fill(0).forEach((_) => {
          this.formData.inputMessage.push({
            inputName: '',
            inputKey: '',
            inputValue: ''
          })
        })
      }

      if (n < this.formData.inputMessage.length) {
        this.formData.inputMessage.splice(n)
      }
      this.$forceUpdate()
    },
    async getBotSysConfigPage(page) {
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
      let res = await getBotSysConfigPage(page, params)

      this.tableData = res.data.list.map((ele) => {
        try {
          if (ele.itemData && ele.itemData.length > 0) {
            ele.itemDataObj = JSON.parse(ele.itemData)

            if (ele.configType == 2) {
              ele.inputCount = ele.itemDataObj.inputCount
              ele.inputMessage = ele.itemDataObj.inputMessage
            } else if (ele.configType == 3) {
              ele.isEnable = ele.itemDataObj.isEnable
              ele.inputCount = ele.itemDataObj.inputCount
              ele.inputMessage = ele.itemDataObj.inputMessage
            }
          }
        } catch (e) {
          console.log('--出错了，可能是老数据：---', e)
        }

        return ele
      })
      return res
    },

    // 单独改变 开关
    async isActiveSwitch(row) {
      let obj = Object.assign({}, row)
      // obj.configValue = obj.configValue == 1 ? 'true' : 'false'
      await botSysConfigUpdate(obj)
      this.$refs.tableRef.getTableData()
    },

    // 单独改变 下拉框
    async selectChange(row) {
      let { itemDataObj, ...param } = row
      await botSysConfigUpdate(param)
      this.$refs.tableRef.getTableData()
    },

    showUpdateDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.formData = Object.assign({}, row)
    },

    deleteConfig(row) {
      this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          await deleteBotConfig(row.botConfigId)
          this.$message.success('删除成功')
          this.$refs.tableRef.getTableData()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    async onBtnOK() {
      // 基础数据
      let params = {
        tenantId: this.$store.state.tenant.selectTenantId,
        configName: this.formData.configName,
        configKey: this.formData.configKey,
        configType: this.formData.configType,
        configValue: this.formData.configValue,
        remark: this.formData.remark
      }

      if (this.formData.configType == 0) {
        // 输入框 , 基本数据就 可以
      } else if (this.formData.configType == 1) {
        // 单选框 , configValue 要改为  "true"  "false"
        params.configValue = this.formData.configValue == 1 ? 'true' : 'false'
      } else if (this.formData.configType == 2) {
        // 下拉框 封装 itemData
        let itemData = {
          inputCount: this.formData.inputCount,
          inputMessage: this.formData.inputMessage
        }
        params.itemData = JSON.stringify(itemData)
      } else if (this.formData.configType == 3) {
        // 有开关的输入框
        let itemData = {
          isEnable: this.formData.isEnable,
          inputCount: this.formData.inputCount,
          inputMessage: this.formData.inputMessage
        }
        params.itemData = JSON.stringify(itemData)

        params.configValue = {
          enabled: this.formData.isEnable
        }
        this.formData.inputMessage.forEach((ele) => {
          params.configValue[ele.inputKey] = ele.inputValue
        })

        params.configValue = JSON.stringify(params.configValue)
      }

      try {
        if (this.isEdit) {
          params.botConfigId = this.formData.botConfigId
          await botSysConfigUpdate(params)
        } else {
          await addBotConfig(params)
        }
        this.$message.success('操作成功')
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.onBtnCancel()
        this.$refs.tableRef.getTableData()
      }
    },
    onBtnCancel() {
      this.dialogVisible = false
    },
    async botRegisterAgain() {
      let res = await botRegisterAgain(this.$store.state.tenant.selectTenantId)
      this.$message.success('重连成功')
    },
    displayValue(value) {
      const map = {
        true: '是',
        false: '否',
        all: '全部',
        bank: '银行卡',
        wxPay: '微信',
        aliPay: '支付宝'
      }
      return map[value] || value // 没匹配就显示原值
    }
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
.tips {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 20px;
}

.text {
  line-height: 8px;
}

.textColor {
  color: #1a53ff;
}

.f-b {
  font-weight: bold;
}

.red {
  color: red;
}

.m-t-10 {
  margin-top: 10px;
}
</style>
