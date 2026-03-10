<template>
    <view class="server-container">
        <!-- 可拖拽图片 -->

        <view class="img-box" :style="{ left: imgLeft + 'rpx', top: imgTop + 'rpx', opacity: opacity }"
            @touchmove.stop.prevent="handleTouchMove" @touchstart="handleTouchStart" @touchend="handleTouchEnd"
            @click="navigateToDetail">
            <image class="draggable-img" src="/static/imgs/server.jpg"></image>
            <span class="msg-count"  v-if="$store.state.newMessageCount" >{{$store.state.newMessageCount}}</span>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                imgLeft: 600, // 图片初始X位置
                imgTop: 0, // 图片初始Y位置
                startX: 0, // 触摸起始X坐标
                startY: 0, // 触摸起始Y坐标
                isDragging: false, // 是否正在拖拽
                opacity: 0.9,
            }
        },
        created() {
            const systemInfo = uni.getSystemInfoSync()
            console.log('systemInfo', systemInfo);
						this.$store.commit('setWindowsSize', systemInfo.safeArea)
            this.imgTop = 500
        },
        mounted(){
            this.$store.dispatch('getNewMessageCount')
        },
        methods: {
            // 触摸开始事件
            handleTouchStart(e) {
                this.startX = e.touches[0].clientX
                this.startY = e.touches[0].clientY
                this.isDragging = false
                this.opacity = 0.4
            },
            handleTouchEnd(e) {
                this.opacity = 0.9
            },
            // 触摸移动事件
            handleTouchMove(e) {
                // 计算移动距离
                const moveX = e.touches[0].clientX - this.startX
                const moveY = e.touches[0].clientY - this.startY

                // 如果移动距离大于阈值，则判定为拖拽
                if (Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
                    this.isDragging = true
                }

                // 更新图片位置
                this.imgLeft += moveX * 2
                this.imgTop += moveY * 2

                // 更新起始坐标
                this.startX = e.touches[0].clientX
                this.startY = e.touches[0].clientY


                // 阻止页面滚动
                e.preventDefault()
            },

            // 点击跳转（非拖拽时才触发）
            navigateToDetail() {
                if (!this.isDragging  && this.$store.state.isChatRoomMode == 0) {
                    uni.navigateTo({
                        url: '/pages/chat-client/chat-list'
                    })
                }else{
                    // 切换到 订单列表 tabs 
                    this.$store.commit('setTabIndex', 1)
                }
                this.isDragging = false // 重置状态
            }
        }
    }
</script>

<style lang="scss" scoped>
    .server-container {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 99999;
        width: 100%;
        height: 100%;
        pointer-events: none;
        /* 防止拖拽时页面滚动 */
    }

    .img-box {
        opacity: 0.7;
        pointer-events: auto;
        position: absolute;
        cursor: pointer;
        border-radius: 50%;
        width: 80rpx;
        height: 80rpx;

        .msg-count {
            position: absolute;
            right: -20rpx;
            top: -20rpx;
            font-size: 20rpx;
            line-height: 30rpx;
            background-color: #c00;
            padding: 0 10rpx;
            color: white;
            border-radius: 22rpx;
        }
    }

    .draggable-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 4rpx solid #fff;
    }
</style>