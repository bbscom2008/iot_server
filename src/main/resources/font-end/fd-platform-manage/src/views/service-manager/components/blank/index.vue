<template>
	<el-card class="card">
		<!-- <el-row v-for="(row, index) in banks" :key="index">
					<el-col :span="5" class="blank_block shadow bg-white" v-for="(bank, i) in row" :key="i">
						<div>
							<img :src="bank.src" :width="imgWidth" :height="imgHeight">
							<p  class="txt" style="font-size: 12px;">{{ bank.name}}</p>
						</div>
					</el-col>
				</el-row> -->


		<el-row>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="upwallet://" android="upwallet://">
					<img src="@/assets/img/yunshanfu.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">云闪付</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="com.icbc.iphoneclient://" android="com.icbc.androidclient://">
					<img src="@/assets/img/gongshang.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">工商银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="BOCMBCIphone://" android="boc://com.chinamworld.bocmbci/startWith">
					<img src="@/assets/img/zhongguo.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">中国银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="bankabc://" android="bankabc://">
					<img src="@/assets/img/nongye.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">农业银行</p>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="wx2654d9155d70a468://" android="ccbapp://main.ccb.com">
					<img src="@/assets/img/jianshe.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">建设银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="wx862767be0919d45a://" android="bocom://">
					<img src="@/assets/img/jiaotong.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">交通银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="cmbmobilebank://" android="cmbmobilebank://">
					<img src="@/assets/img/zhaoshang.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">招商银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="cibmb://" android="cibmb://jumpurl">
					<img src="@/assets/img/xingye.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">业兴银行</p>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="psbcMobileBank://" android="psbc://mainpage">
					<img src="@/assets/img/youchu.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">邮储银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="citic://" android="wakeupciticmobilebank://splashActivity:8899/citicbank">
					<img src="@/assets/img/zhongxin.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">中信银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="wxf505f9da589b9506://" android="cebbank://mobile">
					<img src="@/assets/img/guangda.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">光大银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="spdbbank://wap.spdb.com.cn://" android="spdbbank://wap.spdb.com.cn://">
					<img src="@/assets/img/pufa.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">浦发银行</p>
				</div>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="com.cmbc.cn.iphone://" android="cmbc://qd.mbank://">
					<img src="@/assets/img/minsheng.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">民生银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="com.hx.hxbank://" android="hxbmb://">
					<img src="@/assets/img/huaxia.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">华夏银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="paebqw://" android="paesuperbank://">
					<img src="@/assets/img/pingan.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">平安银行</p>
				</div>
			</el-col>
			<el-col :span="5" class="blank_block shadow bg-white">
				<div @click="goTo" class="item" ios="cgb://lua/openxml://" android="cgb://lua/openxml://">
					<img src="@/assets/img/guangfa.png" :width="imgWidth" :height="imgHeight">
					<p  class="txt" style="font-size: 12px;">广发银行</p>
				</div>
			</el-col>
		</el-row>


		<!-- <el-row>
					<el-col :span="5" class="blank_block shadow bg-white">
						<div>
							<img src="@/assets/img/yinlian.jpg" :width="imgWidth" :height="imgHeight">
							<p  class="txt" style="font-size: 12px;">银联</p>
						</div>
					</el-col>
				</el-row> -->


	</el-card>
</template>

<script>

export default {
	name: 'BankIcons',
	data() {
		return {
			imgWidth: '50%',
			imgHeight: '50%',
			banks: [
				[
					{ src: '@/assets/img/yunshanfu.png', name: '云闪付' },
					{ src: '@/assets/img/gongshang.png', name: '工商银行' },
					{ src: '@/assets/img/nongye.png', name: '农业银行' },
					{ src: '@/assets/img/zhongguo.png', name: '中国银行' },
				],
				[
					{ src: '@/assets/img/jianshe.png', name: '建设银行' },
					{ src: '@/assets/img/jiaotong.png', name: '交通银行' },
					{ src: '@/assets/img/youchu.png', name: '邮储银行' },
					{ src: '@/assets/img/xingye.png', name: '兴业银行' },
				],
				// ...其他银行图标
			],
		};
	},
	methods: {
		getDeviceOS() {
			const userAgent = navigator.userAgent;
			if (/android/i.test(userAgent)) {
				return "Android";
			} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
				return "iOS";
			} else {
				return "Unknown";
			}
		},

		goTo(event) {
			// 从事件对象中获取当前被点击的元素
			const el = event.currentTarget;

			// 读取自定义属性值
			const iosValue = el.getAttribute('ios');
			const androidValue = el.getAttribute('android');


			// 这里可以根据需要使用 iosValue 和 androidValue
			let deviceOs = this.getDeviceOS();
			if( deviceOs == 'iOS'){
				//使用ios地址
				window.location.href = iosValue;
			}else{
				//使用安卓方式打开
				window.location.href = androidValue;
			}
		}
	}
};
</script>

<style scoped>
.blank_block {
	padding-top: 10px;
	padding-bottom: 10px;
	width: 100%;
	margin: 5px;
}

.bg-white {
	background-color: #ffffff;
}

/* 阴影 */
/* #ifndef APP-PLUS-NVUE */
.shadow {
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
}

.card {
	margin: 5px;
	/* margin-inline: 20px; */
	border-radius: 10px !important;
}

.el-row{
	display:flex;
}

.el-row .item{
	display:flex;
	flex-direction: column;
    align-items: center;
}

.el-row .item .txt{
	margin:8px 0 0;
}
</style>