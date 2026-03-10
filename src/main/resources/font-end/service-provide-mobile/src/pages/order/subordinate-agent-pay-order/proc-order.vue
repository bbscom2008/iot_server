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

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="formDataRef"
            :model="formData"
            label-position="top"
            label-width="200"
          >
            <uni-forms-item label="系统订单号" name="">
              <uni-easyinput :value="formData.systemOrderNo" disabled />
            </uni-forms-item>

            <uni-forms-item label="商户订单号" name="">
              <uni-easyinput :value="formData.merchantOrderNo" disabled />
            </uni-forms-item>
            <uni-forms-item label="订单金额" name="">
              <uni-easyinput :value="formData.orderAmount" disabled />
            </uni-forms-item>
            <uni-forms-item label="收款信息" name="">
              <uni-easyinput :value="formData.payeeData" disabled />
            </uni-forms-item>

            <template v-if="procType == 1 || procType == 2">
              <!-- 确认订单  -->
              <uni-forms-item label="付款说明" name="" v-if="procType == 1">
                <uni-easyinput :value="formData.paymentDesc" disabled />
              </uni-forms-item>
              <uni-forms-item
                label="转账说明"
                name="transferDesc"
                v-if="procType == 1"
                required
              >
                <uni-easyinput
                  v-model="formData.transferDesc"
                  placeholder="请输入转账说明"
                  type="textarea"
                  @blur="$refs.formDataRef.validateField('transferDesc')"
                />
              </uni-forms-item>

              <uni-forms-item
                label="驳回原因"
                name="auditResultRemarkIndex"
                v-if="procType == 2"
                required
              >
                <MySelect
                  :options="auditResultRemarkOptions"
                  v-model="formData.auditResultRemarkIndex"
                >
                </MySelect>
              </uni-forms-item>

              <uni-forms-item
                label="其他原因"
                name="auditResultRemark"
                required
                v-if="
                  procType == 2 &&
                  formData.auditResultRemarkIndex ==
                    auditResultRemarkOptions.length - 1
                "
              >
                <uni-easyinput
                  v-model="formData.auditResultRemark"
                  type="textarea"
                  placeholder="请输入转账说明"
                  @blur="$refs.formDataRef.validateField('auditResultRemark')"
                />
              </uni-forms-item>

              <!-- 转账凭证（图片地址，多图地址","分割） -->
              <uni-forms-item label="凭证" name="transferVoucher" required>
                <u-upload
                  :fileList="uploadFileList"
                  @afterRead="afterRead"
                  @delete="deletePic"
                  multiple
                  uploadText="上传图片,最多5张"
                  :maxCount="5"
                ></u-upload>
              </uni-forms-item>
            </template>
          </uni-forms>

          <view>
            {{ JSON.stringify(uploadFileList) }}
          </view>

        </scroll-view>

        <view class="query-buttons">
          <u-button @click="onDialogBtnCancel()">取消</u-button>
          <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { queryRules, balanceRules } from './rules'

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

import { debounce } from '@/utils/index.js'
export default {
  name: 'ProcOrderPopup',
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
      isActiveOptions,
      queryRules,

      formData: {},
      uploadFileList: [], // 上传的文件列表
      auditResultRemarkOptions: [
        { label: '余额不足', value: 0 },
        { label: '支付金额与订单金额不一致', value: 1 },
        { label: '其他原因', value: 2 }
      ]
    }
  },

  watch: {
    currItem(v) {
      console.log('----v----', v)

      this.formData = v
      this.uploadFileList = v.transferVoucher
        .split(',')
        .map((item) => ({ url: item }))
    },
    orderVisible(v) {
      console.log('--orderVisible--v----', v)
      if (this.$refs.addPopupRef) {
        if (v) {
          this.$refs.addPopupRef.open('bottom')
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
        let  result = await this.uploadFilePromise(lists[i].url)
        result = JSON.parse(result)

        console.log('----result----', result);
        console.log('---typeof-result----', typeof result);
        
        let item = this.uploadFileList[fileListLen]
        this.uploadFileList.splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: 'success',
            message: '',
            url: result[0].url
          })
        )
        fileListLen++
      }
    },
    uploadFilePromise(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: uploadServiceUrl, // 后端文件上传接口地址
          filePath: filePath,
          name: 'file', // 后端接收文件的字段名
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject('上传失败')
            }
          },
          fail: (err) => {
            console.error('文件上传失败:', err)
            reject('上传失败')
          }
        })
      })
    },

    // 删除图片
    deletePic(file) {
      console.log('----file----', file)

      this.uploadFileList.splice(file.index, 1)
    },

    onDialogBtnCancel() {
      this.$refs.formDataRef.clearValidate()
      this.$emit('update:orderVisible', false)
    },

    onDialogBtnOk() {
      this.$refs.formDataRef
        .validate()
        .then(async (ret) => {
          if (this.procType == 0) {
            await cancelPayOrder(this.currItem.orderId)
            this.$message.success('取消订单成功')
          } else if (this.procType == 1) {




            await confirmPayOrder({
              orderId: this.currItem.orderId,
              transferDesc: this.formData.transferDesc,
              transferVoucher: this.uploadFileList.map((item) => item.url).join(',')
            })
            this.$message.success('确认订单成功')


          } else {
            if (
              this.formData.auditResultRemarkIndex <
              this.auditResultRemarkOptions.length - 1
            ) {
              this.formData.auditResultRemark =
                this.auditResultRemarkOptions[
                  this.formData.auditResultRemarkIndex
                ].label
            }

            await rejectPayOrder({
              orderId: this.currItem.orderId,
              transferVoucher: this.uploadFileList.map((item) => item.url).join(','),
              auditResultRemark: this.formData.auditResultRemark
            })
            this.$message.success('驳回订单成功')
          }

          this.onDialogBtnCancel()
          this.$emit('flushPage')
        })
        .catch((err) => {
          console.log('----err----', err)
          this.$message.error('输入不正确，请检查')
        })
    }
  }
}
</script>

<style scoped>


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
</style>
