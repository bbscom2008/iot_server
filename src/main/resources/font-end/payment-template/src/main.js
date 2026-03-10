import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

// 自定义组件和工具
import CustomButton from "@/components/CustomButton/index.vue";
import CustomDialog from "@/components/CustomDialog/index.vue";
import CustomForm from "@/components/CustomForm/index.vue";
import CustomFormItem from "@/components/CustomFormItem/index.vue";
import CustomInput from "@/components/CustomInput/index.vue";
import CustomUpload from "@/components/CustomUpload/index.vue";
import CustomImage from "@/components/CustomImage/index.vue";
import CustomTag from "@/components/CustomTag/index.vue";
import Message from "@/utils/message";
import MessageBox from "@/utils/messageBox.js";
import "@/directives/loading.js";
import "@/styles/loading.scss";

// 注册全局组件
Vue.component("el-button", CustomButton);
Vue.component("el-dialog", CustomDialog);
Vue.component("el-form", CustomForm);
Vue.component("el-form-item", CustomFormItem);
Vue.component("el-input", CustomInput);
Vue.component("el-upload", CustomUpload);
Vue.component("el-image", CustomImage);
Vue.component("el-tag", CustomTag);

// 注册全局方法
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$eventBus = new Vue();

import "@/styles/index.scss"; // global css

import App from "./App.vue";
import store from "./store";
import router from "./router";
// import '@/utils/test.js'
import "@/icons"; // icon

// import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

import scrollDirective from "@/directives/scroll";

Vue.directive("scroll", scrollDirective);

Vue.config.productionTip = false;

// 测试环境为 true , 正式环境为 flase , 会去掉所有的 log 日志
const isTest = process.env.VUE_APP_CURR_MODE === "test";

let vConsoleInstance = null;

console.log('isTest : ', isTest);

if (isTest) {
  // import(/* webpackChunkName: "vconsole" */ "vconsole").then(
  //   ({ default: VConsole }) => {
  //     vConsoleInstance = new VConsole();
  //   }
  // );
} else {
  console.log = function () {};
  console.error = function () {};
  console.warn = function () {};
  console.dir = function () {};
}

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
