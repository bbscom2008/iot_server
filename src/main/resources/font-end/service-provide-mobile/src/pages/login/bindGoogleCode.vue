<template>
  <view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
		<custom-nav-bar title="绑定谷歌验证码"></custom-nav-bar>

		<view class="steps">
			<view class="step">1. (使用Google验证码APP)扫描二维码</view>
			<view class="step">2. 填写(Google验证码APP显示的动态验证码)</view>
			<view class="step">3. 点击【输入验证码进行绑定】按钮，进行确认绑定</view>
			<view class="warning">绑定成功后需要重新登录！！！</view>
		</view>

		<view class="qrcode-section">
			<view class="section-title">【绑定二维码】一旦绑定后，将无法查看，请妥善保管，切勿泄露！</view>
			<view class="qrcode-container">
	
				<MyQrCode :value="googleAuthKeyQrCode"></MyQrCode>
				<!-- <view class="qrcode-actions">
          <button class="action-btn" @click="scanQRCode">扫码</button>
          <button class="action-btn" @click="copySecretKey">导入</button>
        </view> -->
			</view>
			<view class="time-check flex-center">
				<view class="tag" >请确认手机时间与标准时间是否一致</view>
			</view>

		</view>

		<view class="secret-key-section">
			<text class="tip">如果扫码绑定失败，点击按钮复制密钥，也可以导入绑定</text>
			<view class="secret-key" @click="copySecretKey">
				{{googleAuthKey}}
			</view>
		</view>

		<view class="verification-section">
			<view class="section-title">请输入手机上显示的验证码</view>
			<input class="verification-input" v-model="googleCode" type="number" placeholder="请输入6位验证码" maxlength="6" />
			<button class="bind-btn" :disabled="!verificationCodeValid" @click="bindGoogleAuth">
				输入验证码进行绑定
			</button>
		</view>
	</view>
</template>

<script>
	import {
		getGoogleAuthKeyQr
	} from '@/api/login.js'
	import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'
	
	import { bindGoogleCode } from '@/api/login'
	import { bindGoogleCode as bindGcode, setChangePwd } from '@/utils/auth'
	export default {
		components: {
			MyQrCode
		},
		data() {
			return {
				googleCode: '',
				googleAuthKey: '',
				googleAuthKeyQrCode: '', // 
			}
		},
		computed: {
			verificationCodeValid() {
				return /^\d{6}$/.test(this.googleCode)
			}
		},

		onLoad() {
			this.getGoogleAuthKeyList()
		},

		methods: {
			getGoogleAuthKeyList() {
				getGoogleAuthKeyQr().then((ret) => {
					this.googleAuthKey = ret.data.googleAuthKey
					this.googleAuthKeyQrCode = ret.data.googleAuthKeyQrCode
				})
			},

			// 复制密钥
			copySecretKey() {
				uni.setClipboardData({
					data: this.googleAuthKey,
					success: () => {
						uni.showToast({
							title: '密钥已复制',
							icon: 'none'
						})
					}
				})
			},

			
			async bindGoogleAuth() {
				if (!this.verificationCodeValid) return
				try {
					await bindGoogleCode(this.googleCode)
					// bindGcode(this.googleCode) // 保存googleCode 证明已经绑定过了，
					
					if (this.$store.state.loginResult.isFirstLoginPassword == '1') {
						//是否为初次登录密码(1是初始密码,0不是初始密码)
						uni.redirectTo({
							url:'/pages/login/changePassword'
						})
					} else {
						// 不是初始密码，直接登录
						setChangePwd()
						// 此时才 登录成功，
						console.log('-----此时才 登录成功------')
						uni.redirectTo({
							url:'/pages/login/login'
						})
					}
				} catch (err) {
					console.log(err)
				}
			},

		}
	}
</script>

<style lang="scss" scoped>


	.title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin: 20rpx 0 40rpx;
		color: #333;
	}

	.steps {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin: 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.step {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 15rpx;
		line-height: 1.6;
	}

	.warning {
		color: #f56c6c;
    text-align: center;
		font-size: 26rpx;
		margin-top: 20rpx;
		font-weight: bold;
	}

	.qrcode-section {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 26rpx;
		color: #f56c6c;
		margin-bottom: 20rpx;
	}

	.qrcode-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.qrcode-image {
		width: 300rpx;
		height: 300rpx;
		margin: 20rpx 0;
		border: 1rpx solid #eee;
	}

	.qrcode-actions {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}

	.action-btn {
		margin: 0 20rpx;
		font-size: 28rpx;
		background-color: #409EFF;
		color: #fff;
		border-radius: 8rpx;
		padding: 10rpx 30rpx;
	}

	.time-check {
		padding: 20rpx;
		margin-bottom: 30rpx;
		font-size: 26rpx;
    
    .tag{
      border-radius: 12rpx;
      background-color: #f2f2f2;
      color: #686A70;
      padding: 6rpx 20rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
    }
	}

	.secret-key-section {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.tip {
		font-size: 26rpx;
		color: #666;
		display: block;
		margin-bottom: 20rpx;
	}

	.secret-key {
		background-color: #f9f9f9;
		border: 1rpx dashed #ddd;
		padding: 20rpx;
		font-family: monospace;
		word-break: break-all;
		text-align: center;
		color: #333;
		font-size: 28rpx;
	}

	.verification-section {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.verification-input {
		width: 100%;
		height: 80rpx;
		border: 1rpx solid #ddd;
		box-sizing: border-box;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 32rpx;
		text-align: center;
		margin: 20rpx 0;
	}

	.bind-btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #409EFF;
		color: #fff;
		border-radius: 8rpx;
		font-size: 32rpx;
	}

	.bind-btn[disabled] {
		background-color: #c0c4cc;
		color: #fff;
		opacity: 0.7;
	}
</style>