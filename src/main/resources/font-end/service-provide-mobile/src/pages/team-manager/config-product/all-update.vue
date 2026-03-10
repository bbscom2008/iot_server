<template>
	<view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
		<!-- 新增  和  修改  弹窗 -->
		<uni-popup ref="addPopupRef" @maskClick="onDialogBtnCancel()">
			<view class="query-popup">
				<view class="popup-header">
					<text class="popup-title">{{ isAll ? '全部修改' : '批量修改' }}</text>
					<uni-icons type="closeempty" class="close-icon" size="26" @click="onDialogBtnCancel()"></uni-icons>
				</view>

				<scroll-view class="modal-content" scroll-y>
					<uni-forms ref="formDataRef" :model="formData" :rules="formDataRules" label-position="top"
						label-width="200">

						<uni-forms-item label-position="left" label="修改费率" name="isModifiedProviderRate">
							<u-switch :activeValue="1" :inactiveValue="0" v-model="formData.isModifiedProviderRate" />
						</uni-forms-item>

						<!-- <uni-forms-item label="产品名称" name="productId" required>
							<MySelect :options="allProdectList" v-model="formData.productId" placeholder="请选择产品名称">
							</MySelect>
						</uni-forms-item> -->

						<uni-forms-item label="码商费率(%)" name="providerRate" required
							v-if="formData.isModifiedProviderRate">
							<uni-easyinput v-model="formData.providerRate" placeholder="请输入码商费率" type="number"
								@blur="$refs.formDataRef.validateField('providerRate')" />
						</uni-forms-item>

						<uni-forms-item label="调整类型" name="providerRateAdjustType"
							v-if="formData.isModifiedProviderRate" required>
							<u-radio-group v-model="formData.providerRateAdjustType" placement="column">
								<u-radio :customStyle="{ marginBottom: '8px' }" label="设置为当前值" :name="1"></u-radio>
								<view>例如：输入2，无论之前费率是多少，都会调整为2%</view>

								<u-radio :customStyle="{ marginBottom: '8px' }" label="全部增加当前值" :name="2"></u-radio>
								<view>例如：输入2，之前费率是5%，会调整为7%</view>
								<u-radio :customStyle="{ marginBottom: '8px' }" label="全部减少当前值" :name="3"></u-radio>
								<view>例如：输入2，之前费率是5%，会调整为3%</view>
							</u-radio-group>
						</uni-forms-item>

						<uni-forms-item label="修改费用" name="isProviderPerTransactionFee">
							<u-switch :activeValue="1" :inactiveValue="0"
								v-model="formData.isProviderPerTransactionFee" />
						</uni-forms-item>

						<uni-forms-item label="单笔费用" name="providerPerTransactionFee" required
							v-if="formData.isProviderPerTransactionFee">
							<uni-easyinput v-model="formData.providerPerTransactionFee" placeholder="请输入单笔费用"
								type="number" @blur="$refs.formDataRef.validateField('providerPerTransactionFee')" />
						</uni-forms-item>

						<uni-forms-item label="是否启用" name="isActive" required>
							<u-radio-group v-model="formData.isActive" placement="row">
								<u-radio style="margin-right: 20rpx;" label="保持不变" :name="null"></u-radio>
								<u-radio style="margin-right: 20rpx;" label="启用" :name="1"></u-radio>
								<u-radio style="margin-right: 20rpx;" label="关闭" :name="0"></u-radio>
							</u-radio-group>
						</uni-forms-item>
					</uni-forms>
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
	import {
		formatDateTime
	} from '@/utils'

	import {
		queryRules,
		formDataRules,
		balanceRules
	} from './rules'

	import {
		amountCheck
	} from '@/utils/validate.js'

	import {
		isActiveOptions,
	} from '@/utils/constants.js'

	import {
		deleteProductProviderRelRelation,
		updateProductProviderRelationByProviderId,
		batchUpdateProductProviderRelation,
	} from '@/api/report-center'

	import {
		debounce
	} from '@/utils/index.js'
	export default {
		name: 'ReceiveOrder',
		props: {
			updateVisible: {
				type: Boolean,
				default: false
			},
			isAll: {
				type: Boolean,
				default: false
			},
			providerId: {
				type: String,
				default: ''
			},
			idList:{
				type: Array,
				default:()=>[]
			}
		},
		data() {
			return {
				formDataRules,
				isActiveOptions,
				queryRules,

				formData: this.getFormData(),

				allProdectList: [{
					label: 'abc',
					value: 1
				}]
			}
		},

		watch: {
			updateVisible(v) {
				if (this.$refs.addPopupRef) {
					if (v) {
						this.$refs.addPopupRef.open('bottom')
					} else {
						this.$refs.addPopupRef.close()
					}
				}
			}
		},
		onUnload() {},
		methods: {
			unBindItem(item) {
				uni.showModal({
					title: '确认解绑',
					content: `确定要解绑 ${item.productName} 吗？`,
					success: async (res) => {
						if (res.confirm) {
							await deleteProductProviderRelRelation(item.id)
							this.$message.success('解绑成功')
							this.flushPage()
						}
					}
				})
			},

			onDialogBtnCancel() {
				this.$refs.formDataRef.clearValidate()
				this.$emit('update:updateVisible', false)
				this.formData = this.getFormData()
			},

			onDialogBtnOk() {
				this.$refs.formDataRef
					.validate()
					.then(async (ret) => {
						if (this.isAll) {
							await updateProductProviderRelationByProviderId({
								providerId: this.providerId,
								...this.formData,
							})
						} else {
							let res = await batchUpdateProductProviderRelation({
								idList: this.idList,
								...this.formData
							})
						}
						this.$message.success('修改成功')
						this.onDialogBtnCancel()
						// this.flushPage()
						this.$emit('flushPage')
					})
					.catch((err) => {
						console.log('----err----', err);
						this.$message.error('输入不正确，请检查')
					})
			},

			getFormData() {
				return {
					isModifiedProviderRate: 0,
					isProviderPerTransactionFee: 0,
					providerRateAdjustType: 1,
					isActive: null
				}
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