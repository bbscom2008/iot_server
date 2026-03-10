<template>
	<view>
		<view class="no-data" v-if="visible">
			<uni-icons type="search" size="50"></uni-icons>
			<text>暂无相关数据</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			visible:{
				typeof: Boolean,
				default: false
			}
		}
		data() {
			return {
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.no-data {
		display: flex;
		color: #666;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>