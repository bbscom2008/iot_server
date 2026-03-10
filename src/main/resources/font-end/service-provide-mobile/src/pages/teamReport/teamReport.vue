<template>
	<view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
		<!-- 自定义导航栏 -->
		<custom-nav-bar :showBack="true" title="团队管理">

			<view class="right" slot="right">
				<view class="nav-right" @click="showFilter = true">
					<uni-icons type="search" color="#fff"></uni-icons>
					<text class="filter-text">筛选</text>
				</view>
			</view>

		</custom-nav-bar>
		<!-- 自定义导航栏 -->
		<!-- <view class="custom-nav-bar" :style="{paddingTop: statusBarHeight + 'px'}">
      <view class="nav-content">
        <view class="nav-left" @click="goBack">
          <image src="/static/back_white.png" class="back-icon"></image>
        </view>
        <view class="nav-title">团队报表</view>
        <view class="nav-right" @click="showFilter = true">
          <image src="/static/filter.png" class="filter-icon"></image>
        </view>
      </view>
    </view> -->

		<!-- 数据概览 -->
		<view class="data-overview">
			<view class="overview-item">
				<text class="overview-label">订单数量</text>
				<text class="overview-value">100</text>
			</view>
			<view class="overview-item">
				<text class="overview-label">订单金额</text>
				<text class="overview-value">100</text>
			</view>
			<view class="overview-item">
				<text class="overview-label">成功率</text>
				<text class="overview-value">100%</text>
			</view>
		</view>

		<!-- 日期选择 -->
		<view class="date-picker">
			<picker mode="date" fields="month" @change="onDateChange">
				<view class="date-text">{{currentDate}}</view>
			</picker>
		</view>

		<!-- 报表列表 -->
		<scroll-view class="report-list" scroll-y>
			<view v-for="(item, index) in reportData" :key="index" class="report-card">
				<view class="card-header">
					<text class="card-title">{{item.serviceUnit}}</text>
					<text class="card-date">{{item.statDate}}</text>
				</view>

				<view class="card-row">
					<text class="row-label">订单数量</text>
					<text class="row-value">{{item.orderCount}}</text>
				</view>

				<view class="card-row">
					<text class="row-label">订单金额</text>
					<text class="row-value">{{item.orderAmount}}元</text>
				</view>

				<view class="card-row">
					<text class="row-label">成功订单数</text>
					<text class="row-value">{{item.successCount}}</text>
				</view>

				<view class="card-row">
					<text class="row-label">成功金额</text>
					<text class="row-value">{{item.successAmount}}元</text>
				</view>

				<view class="card-row">
					<text class="row-label">支付金额</text>
					<text class="row-value">{{item.paymentAmount}}元</text>
				</view>

				<view class="card-row highlight">
					<text class="row-label">成功率</text>
					<text class="row-value">{{item.successRate}}%</text>
				</view>

				<view class="card-row">
					<text class="row-label">分项金额</text>
					<text class="row-value">{{item.subItem}}元</text>
				</view>
			</view>
		</scroll-view>

		<!-- 筛选弹窗 -->
		<uni-popup ref="filterPopup" type="bottom" :mask-click="false">
			<view class="filter-popup">
				<view class="popup-header">
					<text class="popup-title">筛选条件</text>
					<!-- <image src="/static/close.png" class="close-icon" @click="hideFilter"></image> -->
					<uni-icons type="closeempty"></uni-icons>
				</view>

				<view class="filter-item">
					<text class="filter-label">统计日期</text>
					<picker mode="date" fields="month" @change="onFilterDateChange">
						<view class="filter-picker">
							{{filterParams.date || '请选择日期'}}
						</view>
					</picker>
				</view>

				<view class="filter-item">
					<text class="filter-label">服务单位</text>
					<input class="filter-input" v-model="filterParams.unit" placeholder="请输入服务单位" />
				</view>

				<view class="filter-item">
					<text class="filter-label">成功率范围</text>
					<view class="range-picker">
						<input class="range-input" v-model="filterParams.minRate" placeholder="最小值" type="number" />
						<text class="range-separator">至</text>
						<input class="range-input" v-model="filterParams.maxRate" placeholder="最大值" type="number" />
						<text class="range-unit">%</text>
					</view>
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
				showFilter: false,
				currentDate: '2023-06',
				reportData: [{
						statDate: '2016-01-30',
						serviceUnit: '服务单',
						orderCount: 26,
						orderAmount: 18,
						successCount: 18,
						successAmount: 47,
						paymentAmount: 44,
						successRate: 44,
						subItem: 18
					},
					{
						statDate: '2016-04-16',
						serviceUnit: '服务单',
						orderCount: 44,
						orderAmount: 11,
						successCount: 17,
						successAmount: 19,
						paymentAmount: 41,
						successRate: 17,
						subItem: 37
					},
					{
						statDate: '2016-05-02',
						serviceUnit: '服务单',
						orderCount: 17,
						orderAmount: 17,
						successCount: 17,
						successAmount: 45,
						paymentAmount: 42,
						successRate: 36,
						subItem: 23
					},
					{
						statDate: '2016-07-24',
						serviceUnit: '服务单',
						orderCount: 19,
						orderAmount: 20,
						successCount: 40,
						successAmount: 36,
						paymentAmount: 43,
						successRate: 33,
						subItem: 19
					},
					{
						statDate: '2016-08-06',
						serviceUnit: '服务单',
						orderCount: 46,
						orderAmount: 26,
						successCount: 40,
						successAmount: 36,
						paymentAmount: 43,
						successRate: 36,
						subItem: 37
					},
					{
						statDate: '1999-09-09',
						serviceUnit: '服务单',
						orderCount: 38,
						orderAmount: 40,
						successCount: 43,
						successAmount: 22,
						paymentAmount: 39,
						successRate: 42,
						subItem: 12
					},
					{
						statDate: '2010-07-27',
						serviceUnit: '服务单',
						orderCount: 28,
						orderAmount: 32,
						successCount: 35,
						successAmount: 23,
						paymentAmount: 19,
						successRate: 31,
						subItem: 13
					},
					{
						statDate: '2016-04-04',
						serviceUnit: '服务单',
						orderCount: 29,
						orderAmount: 42,
						successCount: 42,
						successAmount: 49,
						paymentAmount: 19,
						successRate: 44,
						subItem: 21
					},
					{
						statDate: '2019-03-11',
						serviceUnit: '服务单',
						orderCount: 37,
						orderAmount: 23,
						successCount: 19,
						successAmount: 24,
						paymentAmount: 16,
						successRate: 22,
						subItem: 11
					},
					{
						statDate: '2019-04-11',
						serviceUnit: '服务单',
						orderCount: 36,
						orderAmount: 22,
						successCount: 45,
						successAmount: 13,
						paymentAmount: 18,
						successRate: 33,
						subItem: 44
					}
				],
				filterParams: {
					date: '',
					unit: '',
					minRate: '',
					maxRate: ''
				}
			}
		},
		computed: {
			filteredData() {
				return this.reportData.filter(item => {
					// 日期筛选
					const dateMatch = this.filterParams.date ?
						item.statDate.includes(this.filterParams.date.replace('-', '').substr(0, 6)) : true;

					// 服务单位筛选
					const unitMatch = this.filterParams.unit ?
						item.serviceUnit.includes(this.filterParams.unit) : true;

					// 成功率范围筛选
					let rateMatch = true;
					if (this.filterParams.minRate) {
						rateMatch = item.successRate >= Number(this.filterParams.minRate);
					}
					if (this.filterParams.maxRate) {
						rateMatch = rateMatch && (item.successRate <= Number(this.filterParams.maxRate));
					}

					return dateMatch && unitMatch && rateMatch;
				});
			}
		},
		onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			hideFilter() {
				this.$refs.filterPopup.close();
			},
			onDateChange(e) {
				this.currentDate = e.detail.value;
				// 这里可以添加日期变化时的数据加载逻辑
			},
			onFilterDateChange(e) {
				this.filterParams.date = e.detail.value;
			},
			resetFilter() {
				this.filterParams = {
					date: '',
					unit: '',
					minRate: '',
					maxRate: ''
				};
			},
			applyFilter() {
				this.reportData = this.filteredData;
				this.hideFilter();
			}
		}
	}
</script>

<style scoped>

	/* 自定义导航栏 */
	.custom-nav-bar {
		background-color: #409EFF;
		padding-bottom: 15px;
	}

	.nav-content {
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 15px;
		color: #fff;
	}

	.nav-left {
		width: 40px;
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

	.nav-right {
		color: white;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.filter-icon {
		width: 20px;
		height: 20px;
	}

	/* 数据概览 */
	.data-overview {
		display: flex;
		background-color: #fff;
		padding: 15px;
		margin: 10px;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.overview-item {
		flex: 1;
		text-align: center;
	}

	.overview-label {
		display: block;
		font-size: 12px;
		color: #909399;
		margin-bottom: 5px;
	}

	.overview-value {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
	}

	/* 日期选择 */
	.date-picker {
		margin: 10px;
		background-color: #fff;
		border-radius: 8px;
		padding: 10px 15px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.date-text {
		font-size: 14px;
		color: #409EFF;
		text-align: center;
	}

	/* 报表列表 */
	.report-list {
		height: calc(100vh - 200px);
		padding: 10px;
		box-sizing: border-box;
	}

	.report-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 10px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ebeef5;
	}

	.card-title {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
	}

	.card-date {
		font-size: 12px;
		color: #909399;
	}

	.card-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		font-size: 14px;
	}

	.card-row.highlight {
		background-color: #f0f7ff;
		margin: 5px -15px;
		padding: 8px 15px;
		border-radius: 4px;
	}

	.row-label {
		color: #606266;
	}

	.row-value {
		color: #303133;
		font-weight: 500;
	}

	/* 筛选弹窗 */
	.filter-popup {
		background-color: #fff;
		border-radius: 12px 12px 0 0;
		padding: 20px;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #ebeef5;
	}

	.popup-title {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
	}

	.close-icon {
		width: 20px;
		height: 20px;
	}

	.filter-item {
		margin-bottom: 20px;
	}

	.filter-label {
		display: block;
		margin-bottom: 8px;
		font-size: 14px;
		color: #606266;
	}

	.filter-input,
	.filter-picker {
		background-color: #f5f7fa;
		border-radius: 4px;
		padding: 10px;
		font-size: 14px;
		width: 100%;
		box-sizing: border-box;
	}

	.range-picker {
		display: flex;
		align-items: center;
	}

	.range-input {
		flex: 1;
		background-color: #f5f7fa;
		border-radius: 4px;
		padding: 10px;
		font-size: 14px;
		text-align: center;
	}

	.range-separator {
		margin: 0 10px;
		color: #909399;
	}

	.range-unit {
		margin-left: 5px;
		color: #909399;
	}

	.filter-buttons {
		display: flex;
		margin-top: 30px;
	}

	.reset-btn,
	.search-btn {
		flex: 1;
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		border-radius: 4px;
	}

	.reset-btn {
		background-color: #fff;
		color: #409EFF;
		border: 1px solid #409EFF;
		margin-right: 10px;
	}

	.search-btn {
		background-color: #409EFF;
		color: #fff;
	}
</style>