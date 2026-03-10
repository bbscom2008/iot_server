<template>
  <view class="container11">
    <!-- 新增  和  修改  弹窗 -->
    <uni-popup ref="addPopupRef" @maskClick="onDialogBtnCancel()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">{{
            procType == 0 ? '取消订单' : procType == 1 ? '确认订单' : '驳回订单'
          }}</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onDialogBtnCancel()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content content" scroll-y>
          <uni-forms
            ref="formDataRef"
            style="padding-top: 30rpx"
            :model="formData"
            label-position="left"
            label-width="200"
          >
            <uni-forms-item label="系统订单号：" name="">
              <view class="item-value">{{ formData.systemOrderNo }}</view>
            </uni-forms-item>

            <uni-forms-item label="商户订单号：" name="">
              <view class="item-value">{{ formData.merchantOrderNo }}</view>
            </uni-forms-item>
            <uni-forms-item label="订单金额：" name="">
              <view class="item-value">{{ formData.orderAmount }}</view>
            </uni-forms-item>
            <uni-forms-item label="收款人：" name="">
              <view class="item-value">{{
                formData.paymentData
                  ? JSON.parse(formData.paymentData).payee
                  : ''
              }}</view>
            </uni-forms-item>
            <uni-forms-item label="账号：" name="">
              <view class="item-value">{{
                formData.paymentData
                  ? JSON.parse(formData.paymentData).payeeNo
                  : ''
              }}</view>
            </uni-forms-item>
            <uni-forms-item label="地址：" name="">
              <view class="item-value"
                >{{
                  formData.paymentData
                    ? JSON.parse(formData.paymentData).payeeAddress
                    : ''
                }}
              </view>
            </uni-forms-item>

            <template v-if="procType == 1 || procType == 2">
              <!-- 确认订单  -->
              <uni-forms-item
                label="付款说明："
                class="have-mb"
                name=""
                v-if="procType == 1"
              >
                <view class="item-value">{{ formData.paymentDesc }}</view>
              </uni-forms-item>

              <uni-forms-item
                label="转账说明："
                name="transferDesc"
                v-if="procType == 1"
              >
                <uni-easyinput
                  v-model="formData.transferDesc"
                  placeholder="请输入转账说明"
                  type="textarea"
                  @blur="$refs.formDataRef.validateField('transferDesc')"
                />
              </uni-forms-item>

              <uni-forms-item
                label="驳回原因："
                name="auditResultRemarkIndex"
                v-if="procType == 2"
                required
                :rules="[
                  {
                    required: true,
                    errorMessage: '请选择原因'
                  }
                ]"
              >
                <MySelect
                  :options="auditResultRemarkOptions"
                  v-model="formData.auditResultRemarkIndex"
                >
                </MySelect>
              </uni-forms-item>
              <uni-forms-item
                label="其他原因："
                name="auditResultRemark"
                required
                v-if="procType == 2 && formData.auditResultRemarkIndex == 6"
                :rules="[
                  {
                    required: true,
                    errorMessage: '请输入原因'
                  }
                ]"
              >
                <uni-easyinput
                  v-model="formData.auditResultRemark"
                  type="textarea"
                  placeholder="请输入转账说明"
                  @blur="$refs.formDataRef.validateField('auditResultRemark')"
                />
              </uni-forms-item>

              <!-- 转账凭证（图片地址，多图地址","分割） -->
              <uni-forms-item
                label="凭证："
                name="transferVoucher"
                :required="procType == 1"
                :rules="
                  procType == 1
                    ? [
                        {
                          required: true,
                          errorMessage: '请选择图片'
                        }
                      ]
                    : []
                "
              >
                <u-upload
                  :fileList="uploadFileList"
                  @afterRead="afterRead"
                  @delete="deletePic"
                  multiple
                  accept="image"
                  uploadText="上传图片,最多5张"
                  :maxCount="5"
                ></u-upload>
              </uni-forms-item>
            </template>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>
    <CheckTradePwd
      @checkSuccess="doConfirmOrder"
      :showCheckPwdPopup.sync="showCheckPwdPopup"
    />
  </view>
</template>

<script>
import { queryRules, balanceRules } from './rules'

import CheckTradePwd from '@/components/check-trade-password/index.vue'

import { amountCheck } from '@/utils/validate.js'

import {
  refreshOptions,
  orderStateOptions,
  notifyStatusOptions,
  isActiveOptions,
  uploadServiceUrl,
  balanceTypeOptions,
  changeTypeOptions
} from '@/utils/constants.js'

import {
  confirmPayOrder,
  cancelPayOrder,
  rejectPayOrder
} from '@/api/agent-pay.js'

import {
  getFileById,
  uploadFileToServer,
  handleUploadParseFileToServer,
  handleUploadDataToQrCode
} from '@/api/upload'

import { debounce } from '@/utils/index.js'
export default {
  name: 'ProcOrderPopup',
  components: {
    CheckTradePwd
  },
  props: {
    orderVisible: {
      type: Boolean,
      default: false
    },
    procType: {
      type: Number,
      default: 1 // 0 取消   1  确认  2  驳回
    },
    currItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showCheckPwdPopup: false,
      isActiveOptions,
      queryRules,

      formData: {},
      uploadFileList: [], // 上传的文件列表
      auditResultRemarkOptions: [
        {
          label: '信息不符',
          value: 0
        },
        {
          label: '信用卡',
          value: 1
        },
        {
          label: '银行卡退款',
          value: 2
        },
        {
          label: '账号限制收款',
          value: 3
        },
        {
          label: '会员账号设置隐私',
          value: 4
        },

        {
          label: '未实名',
          value: 5
        },
        {
          label: '账户风险',
          value: 7
        },

        {
          label: '其他原因',
          value: 6
        }
      ]
    }
  },

  watch: {
    currItem(v) {
      console.log('----v----', v)

      this.formData = v
      this.uploadFileList = []
      // this.uploadFileList = v.transferVoucher
      //   .split(',')
      //   .map((item) => ({ url: item }))
    },
    orderVisible(v) {
      console.log('--orderVisible--v----', v)
      if (this.$refs.addPopupRef) {
        if (v) {
          this.$refs.addPopupRef.open('bottom')
          // this.formData.auditResultRemarkIndex = 0
          this.formData.auditResultRemark = ''
          this.formData.transferVoucher = ''
          console.log('----this.currItem----', this.currItem)
        } else {
          this.$refs.addPopupRef.close()
        }
      }
    }
  },
  onUnload() {},
  methods: {
    // 上传图片
    // 新增图片
    async afterRead(event) {
      console.log('----event----', event)

      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file)
      let fileListLen = this.uploadFileList.length
      lists.map((item) => {
        this.uploadFileList.push({
          ...item,
          status: 'uploading',
          message: '上传中'
        })
      })
      for (let i = 0; i < lists.length; i++) {
        let response = await uploadFileToServer(lists[i].url)
        console.log('----response----', response)
        console.log('---typeof-response----', typeof response)

        console.log('---event.file---', event.file)
        if (response && response.data) {
          // let ret = await getFileById(response.data)
          // console.log(ret)

          let item = this.uploadFileList[fileListLen]
          this.uploadFileList.splice(
            fileListLen,
            1,
            Object.assign(item, {
              status: 'success',
              message: '',
              // url: ret.data.fileUrl,
              url: lists[i].url,
              fileId: response.data
            })
          )
          fileListLen++
        }
      }
      this.formData.transferVoucher = this.uploadFileList
        .map((item) => item.fileId)
        .join(',')

      // this.$refs.formDataRef.clearValidate()
      this.$nextTick(() => {
        this.$refs.formDataRef.validateField('transferVoucher')
      })
    },

    // 删除图片
    deletePic(file) {
      console.log('----file----', file)
      this.uploadFileList.splice(file.index, 1)
      this.formData.transferVoucher = this.uploadFileList
        .map((item) => item.fileId)
        .join(',')
      this.$nextTick(() => {
        this.$refs.formDataRef.validateField('transferVoucher')
      })
    },

    onDialogBtnCancel() {
      this.$refs.formDataRef.clearValidate()
      this.$emit('update:orderVisible', false)
    },

    async doConfirmOrder() {
      await confirmPayOrder({
        orderId: this.currItem.orderId,
        transferDesc: this.formData.transferDesc,
        transferVoucher: this.uploadFileList
          .map((item) => item.fileId)
          .join(',')
      })
      this.$message.success('确认订单成功')

      this.onDialogBtnCancel()
      this.$emit('flushPage')
    },
    onDialogBtnOk() {
      this.$refs.formDataRef
        .validate()
        .then(async (ret) => {
          if (this.procType == 0) {
            await cancelPayOrder(this.currItem.orderId)
            this.$message.success('取消订单成功')

            this.onDialogBtnCancel()
            this.$emit('flushPage')
          } else if (this.procType == 1) {
            // 确认订单
            if (this.$store.getters.isSecondConfirmOrder) {
              this.showCheckPwdPopup = true
            } else {
              await this.doConfirmOrder()
            }
          } else {
            // 驳回订单
            if (this.formData.auditResultRemarkIndex != 6) {
              this.formData.auditResultRemark =
                this.auditResultRemarkOptions[
                  this.formData.auditResultRemarkIndex
                ].label
            }

            await rejectPayOrder({
              orderId: this.currItem.orderId,
              transferVoucher: this.uploadFileList
                .map((item) => item.fileId)
                .join(','),
              auditResultRemark: this.formData.auditResultRemark
            })
            this.$message.success('驳回订单成功')

            this.onDialogBtnCancel()
            this.$emit('flushPage')
          }
        })
        .catch((err) => {
          console.log('----err----', err)
          this.$message.error('输入不正确，请检查')
        })
    }
  }
}
</script>

<style scoped lang="scss">
.refresh-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.refresh-select .picker {
  color: #333;
  font-size: 28rpx;
}

.refresh-timer {
  color: #666;
  font-size: 26rpx;
}

.content {
  ::v-deep .uni-forms-item {
    // margin-bottom: 20rpx !important;
    .uni-forms-item__label {
      width: 200rpx;
      text-align: right;
      height: 40rpx;
      justify-content: flex-end !important;
      color: #999;
    }
  }

  .item-value {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
