<template>
  <div class="container">
    <div class="tips">
      <p>系统参数配置，除非你知道修改的意义，否则请不要随意修改！</p>
      <p>只读配置，只能找技术修改！</p>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" size="small" @click="addConfig"> 新增配置 </el-button>
    </div>

    <el-card class="mt-10">
      <my-table
        ref="tableRef"
        :tableData="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :loadData="getSystemConfigPage"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <my-table-column align="center" label="配置名称">
          <template slot-scope="{ row }">
            <span>{{ row.configName }}</span>
          </template>
        </my-table-column>

        <my-table-column align="center" label="值">
          <template slot-scope="{ row }">
            <span v-if="row.configType == '1'">
              {{ row.configValue == '0' ? '否' : '是' }}
            </span>
            <span v-else-if="row.configType == '2' || row.configType == '0'">
              {{ row.configValue }}
            </span>
            <span v-else-if="row.configType == '3'">
              <!-- 带开关的输入框 -->

              <template v-if="row.configKey == 'enableAutoBlockIp'">
                <div>
                  是否开启：
                  <el-tag
                    :type="JSON.parse(row.configValue).isAutoBlockEnable ? 'success' : 'danger'"
                    size="mini"
                  >
                    {{ JSON.parse(row.configValue).isAutoBlockEnable ? '开启' : '关闭' }}</el-tag
                  >
                </div>

                <div v-if="JSON.parse(row.configValue).isAutoBlockEnable">
                  <span>时长：</span>{{ JSON.parse(row.configValue).duration }} 分钟
                </div>

                <div v-if="JSON.parse(row.configValue).isAutoBlockEnable">
                  <span>次数：</span>{{ JSON.parse(row.configValue).count }} 次
                </div>
              </template>
              <template v-else>
                <div>
                  是否开启：
                  <el-tag :type="row.isEnable ? 'success' : 'danger'" size="mini">
                    {{ row.isEnable ? '开启' : '关闭' }}</el-tag
                  >
                </div>
                <template v-if="row.isEnable">
                  <div v-for="(item, index) in row.inputMessage" :key="index">
                    {{ item.inputName }} : {{ item.inputValue }}
                  </div>
                </template>
              </template>
            </span>
          </template>
        </my-table-column>
        <my-table-column align="center" label="配置说明">
          <template slot-scope="{ row }">
            <span>{{ row.remark ? row.remark : '---' }}</span>
          </template>
        </my-table-column>
        <!-- <my-table-column align="center" label="参数类型">
        <template slot-scope="{ row }">
          {{ row.configType == 0 ? '输入框' : '单选框' }}
        </template>
        </my-table-column> -->
        <my-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-switch
              v-if="row.configType == '1'"
              v-model="row.configValue"
              size="small"
              @change="(e) => isActiveSwitch(e, row)"
            ></el-switch>
            <el-button v-else type="primary" size="small" @click="dialogType1(row)"
              >更新配置</el-button
            >
          </template>
        </my-table-column>
      </my-table>
    </el-card>
    <!-- 弹窗 -->

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改配置' : '新增配置'"
      @close="onDialogBtnCancel()"
      width="750px"
    >
      <el-form
        :rules="rules"
        ref="formDataRef"
        :model="formData"
        label-position="right"
        label-width="100px"
        style="margin-right: 50px"
      >
        <el-form-item label="名称" prop="configName">
          <el-input
            :disabled="isEdit"
            v-model="formData.configName"
            placeholder="输入名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="key" prop="configKey">
          <el-input
            :disabled="isEdit"
            v-model="formData.configKey"
            placeholder="输入key"
            size="small"
            @blur="configKeyBlur"
          />
        </el-form-item>
        <el-form-item label="参数类型" prop="configType">
          <el-select
            :disabled="isEdit"
            filterable
            v-model="formData.configType"
            placeholder="请选择参数类型"
            size="small"
          >
            <el-option label="输入框" :value="0"></el-option>
            <el-option label="单选框" :value="1"></el-option>
            <!-- <el-option label="下拉框" value="2"></el-option> -->
            <el-option label="有开关的输入框" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="值" prop="configValue" v-if="formData.configType == '0'">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.configValue"
            placeholder="请输入值"
            size="small"
          />
        </el-form-item>
        <el-form-item label="值" prop="configValueSwitch" v-if="formData.configType == '1'">
          <el-radio v-model="formData.configValueSwitch" :label="1">开启</el-radio>
          <el-radio v-model="formData.configValueSwitch" :label="0">关闭</el-radio>
        </el-form-item>
        <!-- <el-form-item label="值" prop="configValue"  v-if="formData.configType=='2'">
          <el-select
            filterable
            v-model="formData.configValue"
            placeholder="请选择参数类型"
            size="small"
          >
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- 有开关的输入框  Type == 3   -->
        <template v-if="formData.configType == 3">
          <!-- 有开关的输入框  通用模板 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否开启：" prop="isEnable">
                <el-switch :value="formData.isEnable" @change="commonEnableSwitch" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 输入框的数量 -->
              <el-form-item label="输入框的数量" prop="inputCount" v-if="formData.isEnable">
                <el-input
                  v-model.number="formData.inputCount"
                  placeholder="请输入输入框的数量"
                  @change="handleInputCountChange"
                  :disabled="isEdit"
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
                  <el-input
                    v-model="item.inputKey"
                    :disabled="isEdit"
                    placeholder="请输入key值"
                    size="small"
                  >
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

        <el-form-item label="配置说明" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.remark"
            placeholder="请输入配置说明"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog
      :visible.sync="iPdialogVisible"
      @close="onIPDialogBtnCancel()"
      title="IP白名单"
      width="600px"
    >
      <el-form
        :rules="rules"
        ref="ipformRef"
        :model="formData"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="账号登录IP" prop="loginIP">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.loginIP"
            placeholder="输入IP，多个IP用，号间隔"
            size="small"
          />
        </el-form-item>

        <el-form-item label="进单网关IP" prop="receiveIp">
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.receiveIp"
            placeholder="输入IP，多个IP用，号间隔"
            size="small"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onIPDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onIPDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getSystemConfigPage,
  systemConfig,
  systemConfigUpdate,
  systemConfigAdd,
  systemConfigIsExists
} from '@/api/system-manager'

import { settingRules } from './rules.js'

export default {
  name: 'SystemSetting',
  data() {
    return {
      rules: settingRules,
      tableData: [],
      dialogVisible: false,
      formData: {},
      isEdit: false
    }
  },
  methods: {
    commonEnableSwitch(e) {
      console.log('---commonEnableSwitch------', e)
      this.formData.isEnable = e
      this.$forceUpdate()
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
    addConfig() {
      this.isEdit = false
      this.dialogVisible = true
      this.formData = {
        configName: '',
        configKey: '',
        configType: 0,
        configValue: '',
        configValueSwitch: 1,
        remark: ''
      }
    },
    async isActiveSwitch(e, row) {
      let obj = Object.assign({}, row)
      obj.configValue = obj.configValue == 1 ? true : false
      try {
        let res = await systemConfigUpdate({
          sysConfigId: obj.sysConfigId,
          configName: obj.configName,
          configType: obj.configType,
          configValue: obj.configValue,
          remark: obj.remark
        })
        console.log(res)
      } catch (e) {
        console.log(e)
      }
      this.$refs.tableRef.getTableData()
    },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.$refs.formDataRef.resetFields()
    },
    onDialogBtnOk() {
      this.$refs.formDataRef.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            if (this.formData.configType == 3) {
              // 通用版
              let configValue = JSON.stringify({
                isEnable: this.formData.isEnable,
                inputCount: this.formData.inputCount,
                inputMessage: this.formData.inputMessage
              })
              this.formData.configValue = configValue
            }
            //  await systemConfigUpdate({...this.formData
            // })

            await systemConfigUpdate({
              configName: this.formData.configName,
              configKey: this.formData.configKey,
              configType: this.formData.configType,
              configValue: this.formData.configValue,
              remark: this.formData.remark,
              sysConfigId: this.formData.sysConfigId,
            })

            this.$message.success('修改成功')

          } else {
            // 新增
            let configValue = ''
            if (this.formData.configType == 0) {
              configValue = this.formData.configValue
            } else if (this.formData.configType == 1) {
              configValue = this.formData.configValueSwitch == 1 ? true : false
            } else if (this.formData.configType == 3) {
              // 通用版
              configValue = JSON.stringify({
                isEnable: this.formData.isEnable,
                inputCount: this.formData.inputCount,
                inputMessage: this.formData.inputMessage
              })
            }
            let res = await systemConfigAdd({
              configName: this.formData.configName,
              configKey: this.formData.configKey,
              configType: this.formData.configType,
              configValue: configValue,
              remark: this.formData.remark
            })
            console.log(res, 'res')
          }
          this.onDialogBtnCancel()
          this.flushPage()
        }
      })
    },
    async configKeyBlur(e) {
      console.log(e.target.value, '已经失焦')
      if (e.target.value) {
        let res = await systemConfigIsExists(e.target.value)
        if (res.data) {
          this.$message.error('key已存在！')
          this.formData.configKey = ''
        }
        console.log(res)
      }
    },
    flushPage() {
      this.$refs.tableRef.getTableData()
    },

    async getSystemConfigPage(page) {
      let res = await getSystemConfigPage({ ...page })
      this.tableData = res.data.list
      this.tableData.forEach((item) => {
        if (item.configValue == 'true' || item.configValue == 'false') {
          item.configValue = item.configValue == 'true' ? 1 : 0
        }
        this.parseValueToObj(item)
      })
      return res
    },
    /**
     * 将 网络返回的 数据格式  转换为 本地使用的格式
     */
    parseValueToObj(row) {
      if (row.configType == 0) {
      } else if (row.configType == 2) {
      } else if (row.configType == 3) {
        // 通用版
        try {
          let configValue = JSON.parse(row.configValue)
          row.isEnable = configValue.isEnable
          row.inputCount = configValue.inputCount
          row.inputMessage = configValue.inputMessage
        } catch (e) {
          console.log('====有脏数据===', e)
        }
      } else if (row.configType == 4) {
      }
    },

    onFormChange(e) {
      console.log(e)
      console.log(e.length, 'length')
    },
    dialogType1(row) {
      console.log(row, 'row')
      this.isEdit = true
      this.formData = Object.assign({}, row)
      this.dialogVisible = true
    }
    // async handleSubmit() {
    //   if (!this.formData.configValue) {
    //     this.$message({
    //       message: '输入不能为空！',
    //       type: 'error',
    //       duration: 5 * 1000
    //     })
    //     return
    //   } else if (this.formData.configValue.length > 256) {
    //     this.$message({
    //       message: '长度不能超过256个字符',
    //       type: 'error',
    //       duration: 5 * 1000
    //     })
    //     return
    //   }
    //   let res = await systemConfigUpdate({ ...this.formData })
    //   console.log(res, 'res')
    //   this.dialogVisible = false
    //   this.$refs.tableRef.getTableData(1)
    // }
  },
  mounted() {}
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
