<template>
	<view>
		<view class="search-container">
			<view class="search-box">
				<uni-icons type="search" size="20"></uni-icons>
				<input placeholder-style="font-size:26rpx;" class="search-text" type="text" v-model="inputValue" placeholder="输入搜索关键词" />
			</view>
			<text style="margin-left: 10rpx;">查询</text>
		</view>


	</view>
</template>

<script>
	export default {
		props: {
			bgc: {
				type: String,
				default: '#000000',
			},
			radius: {
				type: Number,
				default: 18,
			}
		},
		data() {
			return {
				inputValue: ""
			};
		},
		methods: {
			gotoSearch() {
				this.$emit("click")
			},
			
		}
	}
</script>

<style lang="scss">
	.search-container {
		// background-color: pink;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;

		.search-box {
			width: 80%;
			color: #333;
			border-radius: 30rpx;
			background-color: #fff;
			height: 60rpx;
			display: flex;
			padding-left: 10rpx;
			box-sizing: border-box;
			align-items: center;
			

			.search-text {
				margin-left: 10rpx;
			}
		}
	}
</style>