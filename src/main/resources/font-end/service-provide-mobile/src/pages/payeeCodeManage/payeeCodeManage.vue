<template>
	<view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
		<!-- 自定义标题栏 -->
		<custom-nav-bar title="提现审核2">

			<view class="right" slot="right">
				<view class="nav-right" @click="showFilter = true">
					<uni-icons type="search" color="#fff"></uni-icons>
					<text class="filter-text">筛选</text>
				</view>
			</view>

		</custom-nav-bar>

		<!-- 搜索框 -->
		<view class="search-box">
			<!-- <image src="/static/search.png" class="search-icon"></image> -->
			<uni-icons type="search"></uni-icons>
			<input class="search-input" placeholder="请输入收款码名称" placeholder-class="placeholder"
				v-model="searchKeyword" />
		</view>
		<!-- </view> -->

		<!-- 收款码列表 -->
		<scroll-view class="qr-code-list" scroll-y>
			<view v-for="(item, index) in filteredQrCodes" :key="index" class="qr-code-card">
				<view class="card-row channel">{{item.channel}}</view>

				<view class="card-row">
					<view class="row-left">
						<switch :checked="item.status === '开启'" @change="toggleStatus(index)" color="#409EFF" />
						<text class="status-text">{{item.status}}</text>
					</view>
					<view class="row-right name">{{item.name}}</view>
				</view>

				<view class="card-row">
					<view class="row-left">
						<text class="label">单日限额:</text>
						<text class="value">{{item.dailyLimit}}元</text>
					</view>
					<view class="row-right">
						<text class="label">单日限单:</text>
						<text class="value">{{item.dailyOrderLimit}}单</text>
					</view>
				</view>

				<view class="card-row">
					<view class="row-left">
						<text class="label">累计收款:</text>
						<text class="value">{{item.totalAmount}}元</text>
					</view>
					<view class="row-right">
						<text class="label">累计次数:</text>
						<text class="value">{{item.totalTimes}}次</text>
					</view>
				</view>

				<view class="card-row">
					<view class="row-left">
						<text class="label">今日收款:</text>
						<text class="value">{{item.todayAmount}}元</text>
					</view>
					<view class="row-right">
						<text class="label">今日次数:</text>
						<text class="value">{{item.todayTimes}}次</text>
					</view>
				</view>

				<view class="card-row">
					<view class="row-left">
						<text class="label">昨日收款:</text>
						<text class="value">{{item.yesterdayAmount}}元</text>
					</view>
					<view class="row-right">
						<text class="label">昨日次数:</text>
						<text class="value">{{item.yesterdayTimes}}次</text>
					</view>
				</view>

				<view class="card-row remark">
					<text class="label">备注:</text>
					<text class="value">{{item.remark || '无'}}</text>
				</view>

				<view class="card-row create-time">
					<text class="label">创建时间:</text>
					<text class="value">{{item.createTime}}</text>
				</view>

				<view class="action-buttons">
					<button class="delete-btn" @click="deleteQrCode(index)">删除</button>
					<button class="edit-btn" @click="editQrCode(index)">修改</button>
				</view>
			</view>
		</scroll-view>

		<!-- 筛选弹层 -->
		<uni-popup ref="filterPopupRef" type="bottom" :is-mask-click="false">
			<view class="filter-popup">
				<view class="popup-header">
					<text class="popup-title">筛选条件</text>
					<!-- <image src="/static/close.png" class="close-icon" @click="hideFilter"></image> -->
					<uni-icons type="closeempty" class="close-icon" size="26" @click="hideFilter"></uni-icons>

				</view>

				<view class="filter-item">
					<text class="filter-label">通道</text>
					<picker class="filter-picker" :range="channelOptions" :value="filterParams.channelIndex"
						@change="onChannelChange">
						<view class="picker-text">
							{{filterParams.channelIndex >= 0 ? channelOptions[filterParams.channelIndex] : '请选择通道'}}
						</view>
					</picker>
				</view>

				<view class="filter-item">
					<text class="filter-label">收款码名称</text>
					<input class="filter-input" v-model="filterParams.name" placeholder="请输入收款码名称" />
				</view>

				<view class="filter-item">
					<text class="filter-label">接单状态</text>
					<picker class="filter-picker" :range="statusOptions" :value="filterParams.statusIndex"
						@change="onStatusChange">
						<view class="picker-text">
							{{filterParams.statusIndex >= 0 ? statusOptions[filterParams.statusIndex] : '请选择状态'}}
						</view>
					</picker>
				</view>

				<view class="filter-buttons">
					<button class="reset-btn" @click="resetFilter">重置</button>
					<button class="search-btn" @click="applyFilter">搜索</button>
				</view>
			</view>
		</uni-popup>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				searchKeyword: '',
				showFilter: false,
				channelOptions: ['支付宝', '微信', '银联', '云闪付', 'PayPal'],
				statusOptions: ['开启', '关闭'],
				filterParams: {
					channelIndex: -1,
					name: '',
					statusIndex: -1
				},
				qrCodes: [{
						channel: '支付宝',
						name: '支付宝个人收款码',
						status: '开启',
						dailyLimit: '5000',
						dailyOrderLimit: '50',
						totalAmount: '12500',
						totalTimes: '32',
						todayAmount: '800',
						todayTimes: '3',
						yesterdayAmount: '1200',
						yesterdayTimes: '5',
						remark: '个人日常使用',
						createTime: '2023-06-10 14:30:22'
					},
					{
						channel: '微信',
						name: '微信商户收款码',
						status: '开启',
						dailyLimit: '10000',
						dailyOrderLimit: '100',
						totalAmount: '35600',
						totalTimes: '78',
						todayAmount: '1500',
						todayTimes: '12',
						yesterdayAmount: '2300',
						yesterdayTimes: '18',
						remark: '店铺收款专用',
						createTime: '2023-06-12 09:15:45'
					},
					{
						channel: '支付宝',
						name: '支付宝企业收款码',
						status: '关闭',
						dailyLimit: '20000',
						dailyOrderLimit: '200',
						totalAmount: '0',
						totalTimes: '0',
						todayAmount: '0',
						todayTimes: '0',
						yesterdayAmount: '0',
						yesterdayTimes: '0',
						remark: '企业大额收款',
						createTime: '2023-06-15 16:20:33'
					},
					{
						channel: '银联',
						name: '银联商户收款码',
						status: '开启',
						dailyLimit: '50000',
						dailyOrderLimit: '300',
						totalAmount: '78200',
						totalTimes: '56',
						todayAmount: '3200',
						todayTimes: '8',
						yesterdayAmount: '4500',
						yesterdayTimes: '12',
						remark: '大额交易专用',
						createTime: '2023-05-28 11:05:17'
					},
					{
						channel: '云闪付',
						name: '云闪付个人收款码',
						status: '开启',
						dailyLimit: '3000',
						dailyOrderLimit: '30',
						totalAmount: '6800',
						totalTimes: '25',
						todayAmount: '200',
						todayTimes: '2',
						yesterdayAmount: '500',
						yesterdayTimes: '4',
						remark: '备用收款码',
						createTime: '2023-06-01 13:40:55'
					},
					{
						channel: 'PayPal',
						name: 'PayPal国际收款',
						status: '关闭',
						dailyLimit: '1000',
						dailyOrderLimit: '10',
						totalAmount: '0',
						totalTimes: '0',
						todayAmount: '0',
						todayTimes: '0',
						yesterdayAmount: '0',
						yesterdayTimes: '0',
						remark: '国际客户使用',
						createTime: '2023-06-14 10:25:08'
					},
					{
						channel: '微信',
						name: '微信个人收款码',
						status: '开启',
						dailyLimit: '2000',
						dailyOrderLimit: '20',
						totalAmount: '4500',
						totalTimes: '18',
						todayAmount: '150',
						todayTimes: '1',
						yesterdayAmount: '300',
						yesterdayTimes: '2',
						remark: '小额收款',
						createTime: '2023-05-30 15:50:42'
					},
					{
						channel: '支付宝',
						name: '支付宝花呗收款',
						status: '开启',
						dailyLimit: '3000',
						dailyOrderLimit: '30',
						totalAmount: '8900',
						totalTimes: '35',
						todayAmount: '400',
						todayTimes: '3',
						yesterdayAmount: '600',
						yesterdayTimes: '5',
						remark: '支持花呗付款',
						createTime: '2023-06-08 12:15:30'
					},
					{
						channel: '银联',
						name: '银联信用卡收款',
						status: '关闭',
						dailyLimit: '10000',
						dailyOrderLimit: '50',
						totalAmount: '0',
						totalTimes: '0',
						todayAmount: '0',
						todayTimes: '0',
						yesterdayAmount: '0',
						yesterdayTimes: '0',
						remark: '信用卡专用',
						createTime: '2023-06-13 17:35:19'
					},
					{
						channel: '微信',
						name: '微信零钱收款',
						status: '开启',
						dailyLimit: '1000',
						dailyOrderLimit: '10',
						totalAmount: '2300',
						totalTimes: '12',
						todayAmount: '100',
						todayTimes: '1',
						yesterdayAmount: '200',
						yesterdayTimes: '2',
						remark: '零钱小额收款',
						createTime: '2023-06-05 08:45:27'
					}
				]
			}
		},
		computed: {
			filteredQrCodes() {
				return this.qrCodes.filter(item => {
					// 搜索关键词过滤
					const keywordMatch = this.searchKeyword ?
						item.name.includes(this.searchKeyword) ||
						item.channel.includes(this.searchKeyword) : true;

					// 筛选条件过滤
					const channelMatch = this.filterParams.channelIndex >= 0 ?
						item.channel === this.channelOptions[this.filterParams.channelIndex] : true;

					const nameMatch = this.filterParams.name ?
						item.name.includes(this.filterParams.name) : true;

					const statusMatch = this.filterParams.statusIndex >= 0 ?
						item.status === this.statusOptions[this.filterParams.statusIndex] : true;

					return keywordMatch && channelMatch && nameMatch && statusMatch;
				});
			}
		},
		watch: {
			showFilter(v) {
				if (this.$refs.filterPopupRef) {
					if (v) {
						this.$refs.filterPopupRef.open()
					} else {
						this.$refs.filterPopupRef.close()

					}
				}
			}
		},
		onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			toggleStatus(index) {
				this.qrCodes[index].status = this.qrCodes[index].status === '开启' ? '关闭' : '开启';
			},
			deleteQrCode(index) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个收款码吗？',
					success: (res) => {
						if (res.confirm) {
							this.qrCodes.splice(index, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			editQrCode(index) {
				uni.showToast({
					title: '跳转到编辑页面',
					icon: 'none'
				});
				// 实际项目中这里应该是跳转到编辑页面
				// uni.navigateTo({
				//   url: '/pages/qrcode/edit?id=' + index
				// });
			},
			onChannelChange(e) {
				this.filterParams.channelIndex = e.detail.value;
			},
			onStatusChange(e) {
				this.filterParams.statusIndex = e.detail.value;
			},
			resetFilter() {
				this.filterParams = {
					channelIndex: -1,
					name: '',
					statusIndex: -1
				};
			},
			applyFilter() {
				this.showFilter = false;
			},
			hideFilter() {
				this.showFilter = false;
			}
		}
	}
</script>

<style scoped >


	/* 自定义导航栏样式 */
	.custom-nav-bar {
		background-color: #409EFF;
		padding-bottom: 20rpx;
	}

	.nav-content {
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		color: #fff;
	}

	.nav-left {
		width: 80rpx;
	}

	.back-icon {
		width: 20px;
		height: 20px;
	}

	.nav-title {
		font-size: 18px;
		font-weight: bold;
		flex: 1;
		text-align: center;
	}



	.filter-icon {
		width: 18px;
		height: 18px;
		margin-right: 4px;
	}

	.filter-text {
		font-size: 14px;
	}

	/* 搜索框样式 */
	.search-box {
		background-color: #fff;
		border-radius: 20px;
		height: 36px;
		margin: 0 20rpx;
		padding: 0 15px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.search-icon {
		width: 16px;
		height: 16px;
		margin-right: 8px;
	}

	.search-input {
		flex: 1;
		height: 100%;
		font-size: 14px;
		color: #333;
	}

	.placeholder {
		color: #999;
		font-size: 14px;
	}

	/* 收款码列表样式 */
	.qr-code-list {
		height: calc(100vh - 120px);
		padding: 15rpx;
		box-sizing: border-box;
	}

	.qr-code-card {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.card-row {
		display: flex;
		margin-bottom: 15rpx;
		align-items: center;
	}

	.channel {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.row-left,
	.row-right {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.status-text {
		margin-left: 10rpx;
		font-size: 14px;
		color: #666;
	}

	.name {
		text-align: right;
		font-size: 14px;
		color: #333;
	}

	.label {
		color: #999;
		font-size: 12px;
		margin-right: 8rpx;
	}

	.value {
		color: #333;
		font-size: 12px;
	}

	.remark,
	.create-time {
		flex-direction: column;
		align-items: flex-start;
	}

	.remark .value,
	.create-time .value {
		margin-top: 5rpx;
		font-size: 12px;
		color: #666;
	}

	.action-buttons {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
		padding-top: 15rpx;
		border-top: 1rpx solid #eee;
	}

	.delete-btn,
	.edit-btn {
		width: 120rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 12px;
		margin-left: 15rpx;
		border-radius: 25rpx;
		padding: 0;
	}

	.delete-btn {
		background-color: #fff;
		color: #F56C6C;
		border: 1rpx solid #F56C6C;
	}

	.edit-btn {
		background-color: #409EFF;
		color: #fff;
	}

	/* 筛选弹层样式 */
	.filter-popup {
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.popup-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.close-icon {
		width: 20px;
		height: 20px;
	}

	.filter-item {
		margin-bottom: 30rpx;
	}

	.filter-label {
		display: block;
		margin-bottom: 10rpx;
		font-size: 14px;
		color: #666;
	}

	.filter-picker {
		background-color: #f5f5f5;
		border-radius: 8rpx;
		padding: 15rpx;
		font-size: 14px;
	}

	.picker-text {
		color: #333;
	}

	.filter-input {
		background-color: #f5f5f5;
		border-radius: 8rpx;
		padding: 15rpx;
		font-size: 14px;
		color: #333;
	}

	.filter-buttons {
		display: flex;
		margin-top: 40rpx;
	}

	.reset-btn,
	.search-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 14px;
		border-radius: 8rpx;
	}

	.reset-btn {
		background-color: #fff;
		color: #409EFF;
		border: 1rpx solid #409EFF;
		margin-right: 20rpx;
	}

	.search-btn {
		background-color: #409EFF;
		color: #fff;
	}
</style>