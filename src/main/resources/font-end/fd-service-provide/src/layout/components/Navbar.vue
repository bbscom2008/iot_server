<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 自动刷新页面的组件 -->
      <auto-refresh class="auto-refresh-item" />

      <div class="sound_box">
        <div
          style="cursor: pointer; display: flex; align-items: center"
          v-if="$store.state.settings.notifySound"
          @click="clickSoundSwitch(false)"
        >
          <svg-icon icon-class="volume-high" class="v-high" />
          <span style="color: #cc0000; font-size: 12px">已开启</span>
        </div>
        <div
          v-else
          ref="soundSwitchClose"
          style="cursor: pointer; display: flex; align-items: center"
          @click="clickSoundSwitch(true)"
        >
          <svg-icon icon-class="volume-mute2" class="v-high close" />
          <span style="color: #cccccc; font-size: 12px">已关闭</span>
        </div>
      </div>

      <span ref="noSoundSwitch"
        >代付订单
        <strong
          class="ml-10"
          style="
            background-color: #c00;
            padding: 2px 6px;
            color: #fff;
            border-radius: 10px;
            font-size: 18px;
          "
        >
          {{ $store.state.userAccount.paymentOrder ? $store.state.userAccount.paymentOrder : 0 }}
        </strong>
      </span>
      <span
        >代收订单
        <strong
          class="ml-10"
          style="
            background-color: #c00;
            padding: 2px 6px;
            color: #fff;
            border-radius: 10px;
            font-size: 18px;
          "
          >{{
            $store.state.userAccount.collectOPrder ? $store.state.userAccount.collectOPrder : 0
          }}</strong
        >
      </span>
      <span
        >可用余额
        <strong class="ml-10">{{
          $store.state.userAccount.availableBalance ? $store.state.userAccount.availableBalance : 0
        }}</strong>
      </span>

      <span>
        <em class="mr-10" :class="{ disabled: !$store.state.user.swIncome }">开启代收</em>
        <el-switch v-model="$store.state.user.swIncome" @change="(e) => enableChange(e)">
        </el-switch>
      </span>
      <span>
        <em class="mr-10" :class="{ disabled: !$store.state.user.swPay }">开启代付</em>
        <el-switch v-model="$store.state.user.swPay" @change="(e) => enableChange(e)"> </el-switch>
      </span>
      <ThemeToggle></ThemeToggle>

      <div @click="showSecurityCenter" style="cursor: pointer">安全中心</div>
      <div divided @click="logout" style="cursor: pointer">
        <span style="display: block">退出</span>
      </div>

      <div class="avatar-wrapper">
        <img src="@/assets/img/avator.png" class="user-avatar" />
        <span>{{ $store.state.user.userName }}</span>
      </div>
    </div>
    <SecurityCenter ref="SecurityCenter"></SecurityCenter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import AutoRefresh from '@/components/AutoRefresh'
import SecurityCenter from '@/components/SecurityCenter'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { getOrUpdateCollectAndPayment } from '@/api/user'
import ThemeToggle from '@/components/ThemeToggle'
import MoonSwitch from '@/components/MoonSwitch'

import { startWebSocket, setInSoundBox } from '@/utils/notify'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    MoonSwitch,
    ThemeToggle,
    SecurityCenter,
    AutoRefresh
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  watch: {
    '$store.state.user.SecurityCenterFlag'(newVal) {
      if (newVal) {
        this.showSecurityCenter()
        // 重置标志位为 false，避免重复触发
        this.$store.commit('user/SET_SECURITY_CENTER_FLAG', false)
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      if (this.$store.state.user.swPay || this.$store.state.user.swIncome) {
        this.$confirm('如果需要停止接单，请先关闭接单状态再退出，是否立即退出？').then(
          async (_) => {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login`)
          }
        )
      } else {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login`)
      }
    },
    showSecurityCenter() {
      this.$refs.SecurityCenter.dialogVisible = true
      this.$refs.SecurityCenter.resetFields()
    },
    async enableChange(e) {
      try {
        let res = await getOrUpdateCollectAndPayment(this.$store.state.userAccount.userId, {
          isCollectEnable: this.$store.state.user.swIncome == 1 ? true : false,
          isPaymentEnable: this.$store.state.user.swPay == 1 ? true : false
        })
        this.$store.state.user.swIncome = res.data.isCollectEnable == true ? 1 : 0
        this.$store.state.user.swPay = res.data.isPaymentEnable == true ? 1 : 0
      } catch (err) {
        console.log(err)
      }
    },

    clickSoundSwitch(flag) {
      console.log('clickSoundSwitch--', flag)
      this.$store.state.settings.isAutoFlush = false
      this.$store.commit('settings/CHANGE_NotifySound', flag)
    },

    handleFirstClick(e) {
      // 检查点击是否在 sound_box 内
      const clickedInSoundBox = e.target.closest('.sound_box') ? true : false
      // 第一次点击，是否有点中声音开关
      console.log('---clickedInSoundBox---', clickedInSoundBox)

      if (clickedInSoundBox) {
        // 第一次就点中了声音开关，什么都不做，由声音开关的事件处理器来处理
      } else {
        // 第一次点击没有点中声音开关，启动 WebSocket，并且自动开启声音开关
        this.$store.commit('settings/CHANGE_NotifySound', true)
      }

      // 移除监听器
      document.removeEventListener('click', this.handleFirstClick, true)
    }
  },
  mounted() {
    document.addEventListener('click', this.handleFirstClick, true)

    setTimeout(() => {
      this.$store.state.settings.isAutoFlush = true

      this.$refs.noSoundSwitch && this.$refs.noSoundSwitch.click()
    }, 1000)
  },
  beforeDestroy() {
    // 清理监听器
    document.removeEventListener('click', this.handleFirstClick, true)
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  min-height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .auto-refresh-item {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    min-height: 50px;
    gap: 15px;
    margin-left: 15px;
    margin-right: 15px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-wrapper {
      // margin-top: 5px;
      position: relative;

      .user-avatar {
        cursor: pointer;
        vertical-align: middle;
        margin-right: 5px;
        width: 28px;
        height: 28px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        // position: absolute;
        // right: -20px;
        // top: 25px;
        // font-size: 12px;
      }
    }

    .sound_box {
      .v-high {
        cursor: pointer;
        width: 1.3em;
        height: 1.3em;
        fill: #cc0000;
      }

      .close {
        fill: #cccccc;
      }
    }
  }

  .nav-end {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 20px;

    .disabled {
      color: #cccccc;
    }
  }
}

// .dark {
//   .navbar {
//     background: transparent;
//     box-shadow: 0 1px 4px rgba(0, 0, 0, 0.72);
//   }
// }
</style>
