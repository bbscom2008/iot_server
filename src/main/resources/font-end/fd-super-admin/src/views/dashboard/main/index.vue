<template>
  <div class="containerd">
    <AccountSummary></AccountSummary>

    <!-- <QuickEnter></QuickEnter> -->

    <TongJiBox1></TongJiBox1>

    <TongJiBox2></TongJiBox2>
  </div>
</template>

<script>
import AccountSummary from './AccountSummary.vue'
import TongJiBox2 from './TongJiBox2.vue'
import QuickEnter from './QuickEnter.vue'
import TongJiBox1 from './TongJiBox1.vue'

export default {
  name: 'Dashboard',
  components: {
    TongJiBox2,
    AccountSummary,
    QuickEnter,
    TongJiBox1
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
