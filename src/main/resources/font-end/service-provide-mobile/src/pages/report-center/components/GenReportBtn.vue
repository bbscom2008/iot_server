<template>
	<view>
		<view class="btn-box" style="margin: 10px">
			<u-button
				type="primary"
				style="width: 20%; margin: 0"
				@click="reportBtnOk()"
				>生成</u-button
			>
		</view>

		<!-- 搜索弹窗 -->
		<uni-popup
			ref="queryPopupRef"
			:show="showFilter"
			@maskClick="closeSearchModal()"
		>
			<view class="query-popup">
				<view class="popup-header">
					<text class="popup-title">生成日报</text>
					<uni-icons
						type="closeempty"
						class="close-icon"
						size="26"
						@click="closeSearchModal()"
					></uni-icons>
				</view>

				<uni-forms
					ref="queryFormDataRef"
					:model="queryFormData"
					:rules="queryRules"
					class="form"
					label-position="top"
					label-width="200"
				>
					<uni-forms-item label="统计日期" name="createTime" required>
						<uni-datetime-picker
							type="date"
							v-model="queryFormData.createTime"
						/>
					</uni-forms-item>
				</uni-forms>

				<view class="query-buttons">
					<u-button class="search-btn" icon="search" @click="btnConfirmClick()"
						>确定</u-button
					>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import {
	EndOfDayReportGenerate,
	providerTeamReportGenerate,
	productDailyReportGenerate,
	payeeAccountDailyReportGenerate
} from '@/api/report-center.js'

export default {
	name: 'GenReportBtn',
	props: {
		type: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			showFilter: false,
			queryFormData: {
				createTime: ''
			},
			queryRules: {
				createTime: {
					rules: [
						{
							required: true,
							errorMessage: '请选择日期'
						}
					]
				}
			}
		}
	},

	watch: {
		showFilter(v) {
			if (this.$refs.queryPopupRef) {
				if (v) {
					this.$refs.queryPopupRef.open('bottom')
				} else {
					this.$refs.queryPopupRef.close()
				}
			}
		}
	},

	methods: {
		resetQueryForm() {
			this.queryFormData = {}
		},
		closeSearchModal() {
			this.showFilter = false
			this.resetQueryForm()
			if (this.$refs.queryFormDataRef) {
				this.$refs.queryFormDataRef.clearValidate()
			}
		},
		reportBtnOk() {
			console.log('---reportBtnOk-----')
			this.showFilter = true
		},
		async btnConfirmClick() {
			console.log('---this.type--',this.type)

			// /wxapi/statistics/provider/EndOfDayReport/generate?date=2025-09-03&tenantId=1006
			// console.log('--queryFormData.createTime--', this.queryFormData.createTime);
			await this.$refs.queryFormDataRef.validate()
			const params = {
				date: this.queryFormData.createTime,
				tenantId: this.$store.state.tenantInfo.tenantId
			}
			let res = ''
			if (this.type == 1) {
				res = await EndOfDayReportGenerate(params)
			} else if (this.type == 2) {
				res = await providerTeamReportGenerate(params)
			} else if (this.type == 3) {
				res = await productDailyReportGenerate(params)
			} else if (this.type == 4) {
				res = await payeeAccountDailyReportGenerate(params)
			}

			// if (res.data) {
			uni.showToast({
				title: '生成成功',
				icon: 'none'
			})
			this.showFilter = false
			this.$emit('flush-page')
			// }
		}
	}
}
</script>

<style lang="scss" scoped>
.query-popup {
	background-color: white;
	border-radius: 40rpx 40rpx 0 0;

	.form {
		padding: 40rpx 60rpx;
	}
}
</style>
