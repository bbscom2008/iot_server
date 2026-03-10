<template>
  <div class="tongji-box cagetory-tongji" style="background-color: transparent; padding:14px 0;">
    <div class="btn-change">
      <el-radio-group v-model="flag" @input="radioChange">
        <el-radio-button label="0" value="0">代收</el-radio-button>
        <el-radio-button label="1" value="1">代付</el-radio-button>
      </el-radio-group>
    </div>

    <div class="cate-box2">
      <!-- 通道 -->
      <!-- <TongJiColumnItem
        ref="channelRef"
        title="通道"
        nameKey="channelName"
        :loadPageData="getChannelDailyReport"
        :loadSelectData="allMerchantList"
      ></TongJiColumnItem> -->
      <ChannelSummaryCard :tradeType="flag" ref="channelSummaryRef" style="height: 550px;"></ChannelSummaryCard>

      <!-- 商户 -->
      <TongJiColumnItem
        ref="merchantRef"
        title="商户"
        :loadPageData="getMerchantDailyReport"
        :loadSelectData="allMerchantList"
        nameKey="merchantName"
        style="min-height: 550px;"
      ></TongJiColumnItem>

      <!-- 码商 -->
      <!-- <TongJiColumnItem title="码商"></TongJiColumnItem> -->

      <!-- 产品 -->
      <!-- <TongJiColumnItem title="产品"></TongJiColumnItem> -->
    </div>
  </div>
</template>

<script>
// import { channelDailyReport } from '@/api/today-report'

import TongJiColumnItem from './tongji-column-item.vue'

import { dailyMerchantReport } from '@/api/today-report'

import { getMerchantList } from '@/api/merchant-info.js'

import ChannelSummaryCard from './channel-summary-card.vue'

import changeTenant from '@/mixins/change-tenant'
export default {
  mixins: [changeTenant],
  name: 'TongJiBox2',
  components: {
    TongJiColumnItem,
    ChannelSummaryCard
  },
  data() {
    return {
      flag: '0',
      merchantDataList: []
    }
  },
  methods: {
    // 通道数据
    // async getChannelDailyReport(page) {
    //   let obj = {
    //     tenantId: this.tenantId,
    //     userId: this.$store.state.userAccount.userId,
    //     tradeType: this.flag
    //   }
    //   let res = await channelDailyReport({ ...page, ...obj })
    //   return res
    // },
    onSelectedTenantChange() {
      this.$refs.merchantRef.flushData()
    },

    // 商户 数据
    async getMerchantDailyReport(page) {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId,
        userId: this.$store.state.userAccount.userId,
        tradeType: this.flag
      }
      let res = await dailyMerchantReport({ ...page, ...obj })
      return res
    },

    // 商户下拉框
    async allMerchantList() {
      let ret = await getMerchantList({ tenantId: this.$store.state.tenant.selectTenantId })
      return ret
    },

    radioChange(e) {
      this.$refs.merchantRef.flushData()
    }
  }
}
</script>

<style lang="scss" scoped>
.cagetory-tongji {
  margin-top: 20px;

  .cate-box2 {
    margin-top: 15px;
    display: flex;
    gap: 20px;
  }
}
</style>
