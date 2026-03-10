<template>
	<view class="cate-container">
		<view class="nav-bar" :style="{ height : navBarHeight + 'rpx'}">
			<!-- <view class="sys-order" @click="showDrawer(1)">
				<text>系统订单号</text>
				<uni-icons type="down" size="20" style="color: white;"></uni-icons>
			</view> -->

			<picker @change="onOrderChange" :value="pickOrderIndex" :range="orderOptions" range-key="label"
				indicator-style="height: 200rpx;">
				<view class="picker sys-order">
					{{orderOptions[pickOrderIndex].label}}
					<uni-icons type="down" size="20" style="color: white;"></uni-icons>
				</view>
			</picker>

			<my-search style="width: 50vw;"></my-search>

			<!-- <view class="flush-order" @click="showDrawer(2)">
				<text>接单刷新</text>
				<uni-icons type="down" size="20" style="color: white;"></uni-icons>
			</view> -->
			<picker @change="onRefreshChange" :value="reFreshIndex" :range="reFreshOptions" range-key="label"
				indicator-style="height: 200rpx;">
				<view class="picker flush-order">
					{{reFreshOptions[reFreshIndex].label}}
					<uni-icons type="down" size="20" style="color: white;"></uni-icons>
				</view>
			</picker>

		</view>

		<view class="main">
			<!-- <view class="no-data" v-if="dataList.length == 0" >
				<uni-icons type="search" size="50"></uni-icons>
				<text>暂无相关数据</text>
			</view> -->

			<!-- <list ref="list" loadmoreoffset="100" @loadmore="loadmore">
			    <cell v-for="num in lists">
			      <text>{{num}}</text>
			    </cell>
			  </list> -->

			<checkComp></checkComp>

		</view>

		<!-- 底部弹窗 -->
		<!-- <uni-popup ref="popup" type="bottom">
			<view class="opt-btn">
				<text class="txt-btn">取消</text>
				<text class="txt-btn btn-ok">确定</text>
			</view>
			<picker-view :value="value" @change="onChange" indicator-style="height: 100rpx;"
				style="width: 100%; height: 600rpx; background: #fff;">
				<picker-view-column>
					<view v-for="(item, index) in items" :key="index" :style="{
		              lineHeight: '100rpx',
		              color: pickCurrentSelect === index ? '#000' : '#999',  
		              textAlign: 'center'
		            }">
						{{ item }}
					</view>
				</picker-view-column>
			</picker-view>
		</uni-popup> -->


	</view>
</template>

<script>
	import checkComp from './components/checkComp.vue'
	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			checkComp
		},
		data() {
			return {
				// lists: ['A', 'B', 'C', 'D', 'E','F','G','H','I','J'],
				pickType: 1, // 1 系统订单号  2  接单刷新
				pickCurrentSelect: 0,
				value: [0],
				dataList: [],
				orderOptions: [{
						label: '系统订单号',
						value: 0
					},
					{
						label: '商户订单号',
						value: 1
					},
					{
						label: '应付金额',
						value: 2
					},
					{
						label: '实付金额',
						value: 3
					},
				],
				reFreshOptions: [{
						label: '手动刷新',
						value: 0
					},
					{
						label: '每10秒刷新',
						value: 1
					},
					{
						label: '每10秒刷新',
						value: 2
					},
					{
						label: '每30秒刷新',
						value: 3
					},
					{
						label: '每1分钟刷新',
						value: 4
					},
				],
				reFreshIndex: 0,
				pickOrderIndex: 0,

			};
		},
		computed: {
			...mapState(['navBarHeight']),
		},
		onLoad() {

		},
		methods: {
			onRefreshChange(e) {
				this.reFreshIndex = e.detail.value;
			},
			onOrderChange(e) {
				this.pickOrderIndex = e.detail.value;
			},
			// loadmore(){},
			onChange(e) {
				console.log(e);
				this.pickCurrentSelect = e.detail.value[0]
			},
			showDrawer(type) {
				this.pickType = type
				console.log('---showDrawer-----', type);
				this.pickCurrentSelect = 0
				this.$refs.popup.open('top')
			},

		}
	}
</script>

<style lang="scss">
	.cate-container {
		padding-top: 100rpx;
	}


	.nav-bar {
		position: fixed;
		top: 0%;
		width: 100vw;
		z-index: 100;
		background-color: $my-bg-color;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 26rpx;
		color: white;

		.sys-order {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
		}

		.flush-order {
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
		}
	}

	.picker-view {
		width: 750rpx;
		height: 600rpx;
		margin-top: 20rpx;
	}

	.item {
		line-height: 100rpx;
		width: 100vw;
		text-align: center;
	}

	.opt-btn {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		padding: 0 20rpx;
	}


</style>