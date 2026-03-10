<template>
  <el-card>
    <h3 class="h3Color">
      <span>账户汇总</span
      ><el-button type="primary" class="ml-10" icon="el-icon-refresh" @click="RefreshAccount"
        >刷新</el-button
      >
    </h3>
    <div class="huizong">
      <div class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon" style="background: #cccccc">
            <svg-icon icon-class="dingdan" className="dingdan" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">商户可用余额:</div>
            <div class="card-panel-num">
              <span>
                {{ topList.merchantAvailableBalance ? topList.merchantAvailableBalance : 0 }}
              </span>
              元
            </div>
          </div>
        </div>
      </div>
      <div class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon" style="background: #ff8247">
            <svg-icon icon-class="dingdanjine" className="dingdanjine" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">商户冻结金额:</div>
            <div class="card-panel-num">
              <span>
                {{ topList.merchantFreezeBalance ? topList.merchantFreezeBalance : 0 }}
              </span>
              元
            </div>
          </div>
        </div>
      </div>
      <div class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon" style="background: #548b54">
            <svg-icon icon-class="chengjiaodingdanjine" className="chengjiaodingdanjine" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">预付商户金额:</div>
            <div class="card-panel-num">
              <span>
                {{ topList.merchantCollectDeposit ? topList.merchantCollectDeposit : 0 }}
              </span>
              元
            </div>
          </div>
        </div>
      </div>
      <div class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon" style="background: #43cd80">
            <svg-icon icon-class="shangfei" className="shangfei" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">码商可用余额:</div>
            <div class="card-panel-num">
              <span>
                {{ topList.providerAvailableBalance ? topList.providerAvailableBalance : 0 }}
              </span>
              元
            </div>
          </div>
        </div>
      </div>
      <div class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon" style="background: #eedc82">
            <svg-icon icon-class="hetong-dingdanshuliang" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">码商冻结金额:</div>
            <div class="card-panel-num">
              <span>
                {{ topList.providerFreezeBalance ? topList.providerFreezeBalance : 0 }}
              </span>
              元
            </div>
          </div>
        </div>
      </div>
      <div class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon" style="background: #7a378b">
            <svg-icon icon-class="qiandai" className="qiandai" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总金额:</div>
            <div class="card-panel-num">
              <span>
                {{ topList.totalAmount ? topList.totalAmount : 0 }}
              </span>
              元
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>

import {
  accountSummary,
} from '@/api/user'

import changeTenant  from '@/mixins/change-tenant'

export default {
  mixins: [changeTenant],
  name: 'AccountSummary',
  data() {
    return {
      topList: {
        merchantAvailableBalance: 0,
        merchantFreezeBalance: 0,
        merchantCollectDeposit: 0,
        providerAvailableBalance: 0
      } //顶部数据
    }
  },
  created() {
    this.tenantAccountSummary()
  },
  methods: {
    onSelectedTenantChange() {
      this.tenantAccountSummary()
    },
    RefreshAccount() {
      this.tenantAccountSummary()
    },
    async tenantAccountSummary() {
      let res = await accountSummary({
        tenantId: this.$store.state.tenant.selectTenantId
      })
      this.topList = res.data ? res.data : {}
    }
  }
}
</script>

<style></style>
