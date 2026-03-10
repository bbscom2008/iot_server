<template>
  <div class="container">
    <!-- <h3>安全中心</h3> -->
    <div class="config" >
      <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane label="敏感词管理" name="tab1">
          <div class="mt-20 base-config">
           <riskControlWord></riskControlWord>
          </div>
        </el-tab-pane>

        <!----------------- tab2 -----文本信息配置------- -->

        <el-tab-pane label="风险IP管理" name="tab2">
          <div class="mt-20 base-config">
           <riskControlIp></riskControlIp>
          </div>
        </el-tab-pane>

        <el-tab-pane label="风险银行地区管理" name="tab3">
          <div class="mt-20 base-config">
           <riskControlRegion></riskControlRegion>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>

import riskControlIp from './risk-control_ip.vue';
import riskControlWord from './risk-control_word.vue';
import riskControlRegion from './risk-control_region.vue';


export default {
  name: 'RiskControlCenter',
  components: {
    riskControlIp,
    riskControlWord,
    riskControlRegion
  },
  data() {
    return {
      activeName: 'tab3',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
