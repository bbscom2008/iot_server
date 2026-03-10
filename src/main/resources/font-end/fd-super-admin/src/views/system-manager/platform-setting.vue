<template>
  <div class="container">
    <div class="tips">
      <p>平台参数配置，除非你知道修改的意义，否则请不要随意修改！</p>
      <p>只读配置，只能找技术修改！</p>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" size="small" @click="addConfig"> 新增配置 </el-button>
      <el-button type="danger" size="small" @click="modifyAllPlatformConfig">
        全平台修改【超管专用】
      </el-button>
    </div>

    <el-card class="mt-10">
      <my-table
        ref="tableRef"
        :tableData="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :loadData="getTenantConfigPage"
      >
        <el-table-column label="序号" align="center" type="index" width="60" />

        <el-table-column align="center" label="配置名称">
          <template slot-scope="{ row }">
            <span>{{ row.configName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="值">
          <template slot-scope="{ row }">
            <span v-if="row.configType == '0'">
              {{ row.configValue }}
            </span>

            <span v-if="row.configType == '1'">
              {{ row.configValue == '0' ? '否' : '是' }}
            </span>

            <template v-if="row.configType == '2'">
              <span v-if="row.configKey == 'retainDay'"> {{ row.configValue }} 天 </span>

              <span v-if="row.configKey == 'tenantAllMerchantSettlements'">
                {{ row.configValue == '关闭' ? row.configValue : row.configValue + ' 时' }}
              </span>

              <!-- 添加自动代收时间范围配置项的显示 -->
              <span v-if="row.configKey == 'autoCollectionPaymentTimeRangeKey'">
                <span v-if="row.configValue && isCrossMidnightFun(row.configValue)">
                  <!-- 跨午夜格式显示 -->
                  <el-tag type="warning" size="mini">跨午夜</el-tag>
                  {{ row.configValue.slice(0, -1) }}
                </span>
                <span v-else>
                  <!-- 同一天格式显示 -->
                  <el-tag type="info" size="mini">同天</el-tag>
                  {{ row.configValue }}
                </span>
              </span>
            </template>

            <span v-if="row.configType == '3'">
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

            <span v-if="row.configType == '4' && row.configKey == 'chatRoomWelcomeMessage'">
              <div
                v-html="
                  JSON.parse(row.configValue).welcomeMessage &&
                  JSON.parse(row.configValue).welcomeMessage.length > 0
                    ? JSON.parse(row.configValue).welcomeMessage[0].html
                    : ''
                "
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="配置说明">
          <template slot-scope="{ row }">
            <span>{{ row.remark ? row.remark : '' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="参数类型">
        <template slot-scope="{ row }">
          {{ row.configType == 0 ? '输入框' : '单选框' }}
        </template>
         </el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-switch
              v-if="row.configType == '1'"
              v-model="row.configValue"
              size="small"
              @change="(e) => isActiveSwitch(e, row)"
            ></el-switch>

            <el-button v-else type="primary" size="small" @click="updateConfig(row)"
              >更新配置</el-button
            >
          </template>
        </el-table-column>
      </my-table>
    </el-card>
    <!-- 弹窗 -->

    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '修改配置' : '新增配置'"
      @close="onDialogBtnCancel()"
      width="850px"
    >
      <el-form
        :rules="rules"
        ref="formDataRef"
        :model="formData"
        label-position="right"
        style="margin-right: 50px"
        label-width="120px"
      >
        <el-form-item label="名称" prop="configName">
          <!-- :disabled="isEdit" -->
          <el-input v-model="formData.configName" placeholder="输入名称" size="small" />
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
            filterable
            v-model="formData.configType"
            placeholder="请选择参数类型"
            size="small"
          >
            <!-- 0 1 2 3 4  -->
            <el-option label="输入框" :value="allConfigType.input.value"></el-option>
            <el-option label="单选框" :value="allConfigType.radio.value"></el-option>
            <el-option label="下拉选择框" :value="allConfigType.select.value"></el-option>
            <el-option label="有开关的输入框" :value="allConfigType.switchInput.value"></el-option>
            <el-option label="动态输入框" :value="allConfigType.dynamicInput.value"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item
          label="值"
          prop="configValue"
          v-if="formData.configType == '0' && formData.configKey !== 'minAllowableCollectAmount'"
        >
          <el-input
            type="textarea"
            :rows="3"
            v-model="formData.configValue"
            placeholder="请输入值"
            size="small"
          />
        </el-form-item> -->

        <!-- configType == 0 -->
        <template v-if="formData.configType == allConfigType.input.value">
          <el-form-item label="值" prop="configValue">
            <el-input
              type="textarea"
              :rows="3"
              v-model="formData.configValue"
              placeholder="请输入值"
              size="small"
            />
          </el-form-item>
        </template>

        <!-- configType == 1 -->
        <el-form-item
          label="是否开启"
          prop="configValueSwitch"
          v-if="formData.configType == allConfigType.radio.value"
        >
          <el-radio v-model="formData.configValueSwitch" :label="1">开启</el-radio>
          <el-radio v-model="formData.configValueSwitch" :label="0">关闭</el-radio>
        </el-form-item>

        <!-- //------================================================ -->
        <!-- configType == 2  下拉框 -->
        <template v-if="formData.configType == allConfigType.select.value">
          <el-form-item
            v-if="formData.configKey == allConfigType.select.configKey.retainDay"
            label="数据保留时间"
            prop="configValueSelect"
          >
            <el-select
              filterable
              v-model="formData.configValueSelect"
              placeholder="请选择数据保留时间"
              size="small"
            >
              <el-option label="7天" :value="7"></el-option>
              <el-option label="14天" :value="14"></el-option>
              <el-option label="21天" :value="21"></el-option>
              <el-option label="30天" :value="30"></el-option>
            </el-select>
          </el-form-item>

          <!-- 修改自动代收时间范围配置项，支持跨午夜时间选择 -->
          <el-form-item
            label="时间范围"
            prop="configValueTimeRange"
            v-if="
              formData.configKey == allConfigType.select.configKey.autoCollectionPaymentTimeRangeKey
            "
            :rules="timeRangeRules"
          >
            <div style="display: flex; align-items: center; gap: 10px">
              <!-- 时间范围选择 -->
              <el-time-picker
                v-model="formData.startTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="开始时间"
                size="small"
              >
              </el-time-picker>

              <span>至</span>

              <el-time-picker
                v-model="formData.endTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="结束时间"
                size="small"
              >
              </el-time-picker>
            </div>

            <div style="margin-top: 8px; color: #909399; font-size: 12px">
              <i class="el-icon-info"></i>
              <span v-if="isCrossMidnight"
                >跨午夜模式：结束时间小于开始时间时自动跨到第二天（如22:00-02:00）</span
              >
              <span v-else>普通模式：选择同一天内的时间范围</span>
            </div>
          </el-form-item>

          <!-- 定时结算 -->
          <template
            v-if="formData.configKey == allConfigType.select.configKey.tenantAllMerchantSettlements"
          >
            <el-form-item label="定时结算" prop="configValueSettle">
              <el-switch v-model="iscloseSettle" size="small"></el-switch>
            </el-form-item>

            <el-form-item label="选择结算时间" prop="configValueSettle" v-if="iscloseSettle">
              <el-time-picker
                v-model="formData.configValueSettle"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="任意时间点"
              >
              </el-time-picker>
            </el-form-item>
          </template>
        </template>

        <!-- 有开关的输入框  Type == 3   -->
        <template v-if="formData.configType == 3">
          <!-- 自动加入黑名单 -->
          <template v-if="formData.configKey == 'enableAutoBlockIp'">
            <el-form-item label="是否开启：" prop="isAutoBlockEnable">
              <el-switch v-model="formData.isAutoBlockEnable" />
              <div class="help-tip">指定时长内，超过允许次数将自动加入黑名单</div>
            </el-form-item>
            <el-form-item label="允许次数 ：" prop="count" v-if="formData.isAutoBlockEnable">
              <el-input v-model="formData.count" placeholder="请输入允许次数" size="small">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>

            <el-form-item label="时长范围：" prop="duration" v-if="formData.isAutoBlockEnable">
              <el-input v-model="formData.duration" placeholder="请输入时长范围" size="small">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </template>
          <template v-else>
            <!-- 有开关的输入框  通用模板 -->
            <el-row>
              <el-col :span="6">
                <el-form-item label="是否开启：" prop="isEnable">
                  <el-switch v-model="formData.isEnable" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
        </template>

        <!-- 欢迎语配置 -->
        <template v-if="formData.configType == 4 && formData.configKey == 'chatRoomWelcomeMessage'">
          <el-form-item label="选择欢迎语数量" prop="messageCount">
            <el-select
              filterable
              v-model="formData.messageCount"
              placeholder="选择欢迎语数量"
              @change="handleMessageCountChange"
              size="small"
            >
              <el-option label="1" :value="1"></el-option>
              <el-option label="2" :value="2"></el-option>
              <el-option label="3" :value="3"></el-option>
              <el-option label="4" :value="4"></el-option>
              <el-option label="5" :value="5"></el-option>
            </el-select>
          </el-form-item>

          <div v-for="(item, index) in formData.welcomeMessage" :key="index">
            <!-- <div style="margin-left: 20px; font-weight: 600">第{{ index + 1 }}条欢迎语：</div> -->

            <el-form-item
              :label="`第${index + 1}条,选择类型`"
              :prop="`welcomeMessage[${index}].type`"
            >
              <!-- :rules="[{ required: true, message: '请选择消息类型', trigger: 'blur' }]" -->
              <el-select
                filterable
                v-model="item.type"
                placeholder="选择消息类型"
                @change="(e) => handleWelcomeMessageTypeChange(index, e)"
                size="small"
              >
                <el-option label="文本" value="html"></el-option>
                <el-option label="图片" value="image"></el-option>
                <el-option label="视频" value="video"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="选择图片"
              v-if="item.type == 'image'"
              :prop="`welcomeMessage[${index}].imageFileId`"
            >
              <!-- :rules="[{ required: true, message: '请选择图片', trigger: 'blur' }]" -->
              <MyImageUploadVue :limit="1" v-model="item.imageFileId" />
            </el-form-item>

            <el-form-item
              label="选择视频"
              v-if="item.type == 'video'"
              :prop="`welcomeMessage[${index}].videoFileId`"
            >
              <!-- :rules="[{ required: true, message: '请选择视频', trigger: 'blur' }]" -->
              <MyImageUploadVue :limit="1" accept="video/*" v-model="item.videoFileId" />
            </el-form-item>

            <el-form-item
              v-if="item.type == 'html'"
              label="内容"
              :prop="`welcomeMessage[${index}].html`"
            >
              <!-- :rules="[{ required: true, message: '请输入', trigger: 'blur' }]" -->
              <MySimpleRichText v-model="item.html" />
            </el-form-item>
          </div>
        </template>

        <el-form-item label="配置说明" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
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

    <el-dialog
      :visible.sync="modifyAllPlatformConfigDialogVisible"
      title="全平台修改配置"
      @close="onAllDialogBtnCancel()"
      width="850px"
    >
      <el-form
        ref="allformDataRef"
        :model="allFormData"
        label-position="right"
        style="margin-right: 50px"
        label-width="120px"
      >
        <!-- <el-form-item label="名称" prop="configName">
            <el-input v-model="formData.configName" placeholder="输入名称" size="small" />
          </el-form-item> -->

        <el-form-item label="key" prop="configKey">
          <el-input v-model="allFormData.configKey" placeholder="输入key" size="small" />
        </el-form-item>

        <el-form-item label="value" prop="configValue">
          <el-input
            :disabled="isEdit"
            v-model="allFormData.configValue"
            placeholder="输入value"
            size="small"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="onAllDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onAllDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTenantConfigPage,
  systemTenantAdd,
  systemTenantUpdate,
  tenantConfigIsExists
} from '@/api/system-manager'

import MySimpleRichText from '@/components/MyRichText/MySimpleRichText.vue'

import { mapGetters } from 'vuex'

import { settingRules } from './rules.js'
import { option, minutes } from './utils.js'
import MyImageUploadVue from '@/components/MyImageUpload.vue'
export default {
  name: 'PlatformSetting',
  components: {
    MyImageUploadVue,
    MySimpleRichText
  },
  data() {
    return {
      modifyAllPlatformConfigDialogVisible: false,
      allFormData: {},
      allConfigType: {
        input: {
          value: 0, // 普通输入框，只是key value 的形式，不做特殊处理
          configKey: {}
        },
        radio: {
          value: 1, // 单选框 , 只是一个开关，不做特殊处理
          configKey: {}
        },
        select: {
          value: 2, // 下拉框 type 不一样处理不一样
          configKey: {
            retainDay: 'retainDay', // 数据保留天数
            tenantAllMerchantSettlements: 'tenantAllMerchantSettlements', // 定时结算
            autoCollectionPaymentTimeRangeKey: 'autoCollectionPaymentTimeRangeKey' // 时间范围内自动开启代收代付
          }
        },
        switchInput: {
          value: 3, // 有开关的输入框 type 不一样处理不一样
          configKey: {
            enableAutoBlockIp: 'enableAutoBlockIp' // 指定时长内，超过允许次数将自动加入黑名单
          }
        },
        dynamicInput: {
          value: 4, // 动态输入框 type 不一样处理不一样
          configKey: {}
        }
      },

      rules: settingRules,
      tableData: [],
      dialogVisible: false,
      formData: {},
      isEdit: false,
      options: [],
      iscloseSettle: 1, ////1 打开   0--关闭
      // 时间范围验证规则
      timeRangeRules: [
        {
          validator: (rule, value, callback) => {
            if (!this.formData.startTime || !this.formData.endTime) {
              callback(new Error('请选择时间范围'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['tenantList']),
    selectTenantId() {
      return this.$store.state.tenant.selectTenantId
    },
    isCrossMidnight() {
      // 如果时间1 小于时间2 是普通 模式
      // 否则是 跨午夜模式
      return this.formData.startTime > this.formData.endTime
    }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (this.$route.name == 'PlatformSetting') {
        this.$refs.tableRef.getTableData(1)
      }
    }
  },
  methods: {
    modifyAllPlatformConfig() {
      this.modifyAllPlatformConfigDialogVisible = true
    },

    async onAllDialogBtnOk() {
      if (this.allFormData.configKey == '' || this.allFormData.configValue == '') {
        this.$message.error('key 和 value 不能为空')
        return
      }

      // 遍历所有平台， 获得该平台的信息


      for (let index = 0; index < this.tenantList.length; index++) {

        const tenant = this.tenantList[index];

        // let tenant = {
        //   tenantId: 1000,
        //   tenantName: '测试平台'
        // }

        console.log(tenant.tenantName, ' :  ', tenant.tenantId)

        const tenantId = tenant.tenantId // TODO 测试环境写死 1000， 线上环境放开
        let res = await getTenantConfigPage({
          tenantId: tenantId,
          pageSize: 100,
          pageNum: 1
        })

        let findItem = res.data.list.find((item) => {
          return item.configKey == this.allFormData.configKey
        })

        if (findItem) {
          console.log(tenant.tenantName, '  : 找到当前配置 : ', this.allFormData.configKey)

          await systemTenantUpdate({
            configName: findItem.configName,
            configType: findItem.configType,
            configValue: this.allFormData.configValue,
            remark: findItem.remark,
            tenantConfigId: findItem.tenantConfigId,
            tenantId: findItem.tenantId
          })
          console.log(tenant.tenantName, '  : 更新配置成功 : ', this.allFormData.configKey)
        } else {
          console.log(tenant.tenantName, '  : 未找到当前配置 : ', this.allFormData.configKey)
        }

        await new Promise((resolve) => setTimeout(resolve, 500))

      }

      this.$message.success('全平台修改配置操作已执行完毕，请注意查看日志')
      this.modifyAllPlatformConfigDialogVisible = false
    },

    onAllDialogBtnCancel() {
      // this.allFormData = {}
      this.modifyAllPlatformConfigDialogVisible = false
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
    handleWelcomeMessageTypeChange(index, e) {
      console.log(index)
      console.log(e)

      this.formData.welcomeMessage[index] = {
        type: e
      }

      this.$forceUpdate()
    },
    handleMessageCountChange(n) {
      if (n > this.formData.welcomeMessage.length) {
        new Array(n - this.formData.welcomeMessage.length).fill(0).forEach((_) => {
          this.formData.welcomeMessage.push({
            type: 'html'
          })
        })
      }

      if (n < this.formData.welcomeMessage.length) {
        this.formData.welcomeMessage.splice(n)
      }
      this.$forceUpdate()
    },
    isCrossMidnightFun(value) {
      // value 是 类似 20:00-18:00  这种格式的时间，
      // 如果 时间1 小于 时间2 是普通 模式
      // 否则是 跨午夜模式
      let time1Str = value.split('-')[0]
      let time2Str = value.split('-')[1]
      let time1 = new Date(`2000-01-01 ${time1Str}:00`)
      let time2 = new Date(`2000-01-01 ${time2Str}:00`)

      return time1 > time2
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
        configValueSettle: '',
        configValueSelect: 30,
        // 修改自动代收时间范围配置项的默认值
        startTime: '09:00', // 开始时间
        endTime: '18:00', // 结束时间
        remark: '',
        isCrossMidnight: false, // 跨午夜选择开关
        welcomeMessage: []
      }
    },
    async isActiveSwitch(e, row) {
      let obj = Object.assign({}, row)
      obj.configValue = obj.configValue == 1 ? true : false
      try {
        let res = await systemTenantUpdate({
          tenantId: this.$store.state.tenant.selectTenantId,
          tenantConfigId: obj.tenantConfigId,
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
    switchConfigValue(e) {
      if (e == 'tenantAllMerchantSettlements') {
        if (this.iscloseSettle == 0) {
          return '关闭'
        } else {
          return this.formData.configValueSettle
        }
      } else if (e == 'retainDay') {
        return this.formData.configValueSelect
      } else if (e == 'autoCollectionPaymentTimeRangeKey') {
        // 修改自动代收时间范围配置项的值处理，支持时间跨天选择
        // 跨午夜模式：添加特殊标识
        return `${this.formData.startTime}-${this.formData.endTime}`
      }
      return this.formData.configValue
    },

    // 将 fromData 转换为 网络数据对象
    parseFormData2Obj() {
      let configValue = ''

      if (this.formData.configType == 0) {
        // 输入框
        configValue = this.formData.configValue
      } else if (this.formData.configType == 1) {
        // 开关
        configValue = this.formData.configValueSwitch == 1 ? true : false
      } else if (this.formData.configType == 2) {
        // 下拉框
        configValue = this.switchConfigValue(this.formData.configKey)
      } else if (this.formData.configType == 3) {
        // 有开关的输入框
        if (this.formData.configKey == 'enableAutoBlockIp') {
          configValue = JSON.stringify({
            isAutoBlockEnable: this.formData.isAutoBlockEnable,
            duration: this.formData.duration,
            count: this.formData.count
          })
        } else {
          // 通用版
          configValue = JSON.stringify({
            isEnable: this.formData.isEnable,
            inputCount: this.formData.inputCount,
            inputMessage: this.formData.inputMessage
          })
        }
      } else if (this.formData.configType == 4) {
        // 聊天室
        configValue = JSON.stringify({
          messageCount: this.formData.messageCount,
          welcomeMessage: this.formData.welcomeMessage
        })
      }

      return configValue
    },

    onDialogBtnOk() {
      this.$refs.formDataRef.validate(async (valid) => {
        if (valid) {
          let configValue = this.parseFormData2Obj()

          if (this.isEdit) {
            await systemTenantUpdate({
              tenantId: this.$store.state.tenant.selectTenantId,
              tenantConfigId: this.formData.tenantConfigId,
              configName: this.formData.configName,
              configType: this.formData.configType,
              configValue: configValue,
              remark: this.formData.remark
            })
            this.$message.success('修改成功')
          } else {
            // 新增

            let res = await systemTenantAdd({
              tenantId: this.$store.state.tenant.selectTenantId,
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

    flushPage() {
      this.$refs.tableRef.getTableData()
    },

    async configKeyBlur(e) {
      console.log(e.target.value, '已经失焦')
      if (e.target.value) {
        let res = await tenantConfigIsExists(e.target.value, {
          tenantId: this.$store.state.tenant.selectTenantId
        })
        if (res.data) {
          this.$message.error('key已存在！')
          this.formData.configKey = ''
        }
        console.log(res)
      }
    },
    async getTenantConfigPage(page) {
      let res = await getTenantConfigPage({
        tenantId: this.$store.state.tenant.selectTenantId,
        ...page
      })
      this.tableData = res.data.list
      this.tableData.forEach((item) => {
        // 补丁，
        if (item.configValue == 'true' || item.configValue == 'false') {
          item.configValue = item.configValue == 'true' ? 1 : 0
        }

        this.parseValueToObj(item)
      })
      return res
    },

    onFormChange(e) {
      console.log(e)
      console.log(e.length, 'length')
    },
    updateConfig(row) {
      console.log(row, 'row')
      this.isEdit = true

      // this.formData = row
      this.formData = Object.assign({}, row)
      // Vue.set(this,'formData',row)
      this.dialogVisible = true
      this.$forceUpdate()
    },

    /**
     * 将 网络返回的 数据格式  转换为 本地使用的格式
     */
    parseValueToObj(row) {
      if (row.configType == 0) {
        // 修改之前的BUG
        // if (row.configKey == 'chatRoomWelcomeMessage') {
        //   row.configType == 4
        //   row.messageCount = 0
        //   row.welcomeMessage = []
        // }
        // 输入框
        // if (row.configKey == 'minAllowableCollectAmount') {
        //   row.configValueAmount = row.configValue
        // }
      } else if (row.configType == 2) {
        // 下拉框
        if (row.configKey == 'retainDay') {
          row.configValueSelect = Number(row.configValue)
        } else if (row.configKey == 'tenantAllMerchantSettlements') {
          if (row.configValue == '关闭') {
            this.iscloseSettle = 0
          } else {
            this.iscloseSettle = 1
            row.configValueSettle = row.configValue
          }
        } // 修改自动代收时间范围配置项的编辑处理，支持跨午夜时间选择
        else if (row.configKey == 'autoCollectionPaymentTimeRangeKey') {
          if (row.configValue) {
            // 普通格式：09:00-18:00
            const timeRange = row.configValue.split('-')
            if (timeRange.length === 2) {
              row.startTime = timeRange[0]
              row.endTime = timeRange[1]
              row.isCrossMidnight = false
            }
          }
        }
      } else if (row.configType == 3) {
        // 带开关的输入框

        if (row.configKey == 'enableAutoBlockIp') {
          let configValue = JSON.parse(row.configValue)
          row.isAutoBlockEnable = configValue.isAutoBlockEnable
          row.duration = configValue.duration
          row.count = configValue.count
        } else {
          // 通用版
          try {
            let configValue = JSON.parse(row.configValue)
            row.isEnable = configValue.isEnable
            row.inputCount = configValue.inputCount
            row.inputMessage = configValue.inputMessage
          } catch (e) {
            console.log('====有脏数据===', e)
          }
        }
      } else if (row.configType == 4) {
        try {
          if (row.configKey == 'chatRoomWelcomeMessage') {
            let configValue = JSON.parse(row.configValue)
            row.messageCount = configValue.messageCount
            row.welcomeMessage = configValue.welcomeMessage
          }
        } catch (e) {
          console.log(e)
        }
      }

      // // 修补一个 BUG
      // if (row.configKey == 'chatRoomWelcomeMessage') {
      //   row.configType = 4
      //   let configValue = JSON.parse(`{\"messageCount\":2,\"welcomeMessage\":[{\"type\":\"html\",\"html\":\"<p><span style=\\\"color: rgb(225, 60, 57);\\\"><strong>您好，欢迎进入客服聊天室 ✨✨</strong></span></p><p>当前订单编号： #{orderId} </p><p>订单金额：<span style=\\\"color: rgb(225, 60, 57);\\\"><strong> #{orderAmount}</strong></span></p><p> 创建时间： #{createTime} </p><p>转账备注： #{transferRemark} </p><p><span style=\\\"color: rgb(225, 60, 57);\\\"><strong>温馨提示： 为了保障您的安全，切勿向任何人提供验证码、密码，等个人信息！！</strong></span></p>\"},{\"type\":\"html\",\"html\":\"<p>欢迎您使用本系统，VIP专属客服为您提供以下入款方式：</p><p>1 : QQ收款 ; </p><p>2 : 抖音扫码 ; </p><p>3 : 微信 ; </p><p>4 : 沃钱包 ; </p><p>5 : 翼支付 ; </p><p>6 : 钉钉扫码 ; </p><p>7 : 数字人民币-禁止修改金额 ; </p><p>8 : 支付宝 ; </p><p>9 : 向支付宝账户付款 ; </p><p>10 : 代还信用卡 ; </p><p>11 : 吱口令 ; </p><p>12 : 移动荷包-禁止充话费 ; </p><p>13 : 拼多多扫码 ; </p><p>14 : 新浪微博 ; </p><p><br></p><p>您当前选择的是: 微信 </p><p>客服处理需要一点时间，请稍等片刻!</p><p>VIP您好, 为了避免交易争议,  我方不会主动添加您的联系方式。 所有主动联系您的 都是骗子！支付了我方不认可 不扯皮  不退不补！ 请不要主动提供您的账号信息</p>\"}]}`)
      //     row.messageCount = configValue.messageCount
      //     row.welcomeMessage = configValue.welcomeMessage
      // }
    },

    // 移除不再使用的方法
    onCrossMidnightChange(val) {
      if (val) {
        // 切换到跨午夜模式，设置默认跨午夜时间
        this.formData.startTime = '22:00'
        this.formData.endTime = '02:00'
      } else {
        // 关闭跨午夜模式，设置默认同一天时间
        this.formData.startTime = '09:00'
        this.formData.endTime = '18:00'
      }
    }
  },
  mounted() {
    option.forEach((item) => {
      item.children = minutes
    })
    this.options = option
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
