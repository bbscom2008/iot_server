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
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <span
          >可用余额
          <strong class="ml-10">{{
            $store.state.userAccount.availableBalance
              ? $store.state.userAccount.availableBalance
              : 0
          }}</strong>
        </span>
        <span
          >冻结金额
          <strong class="ml-10">{{
            $store.state.userAccount.freezeBalance ? $store.state.userAccount.freezeBalance : 0
          }}</strong>
        </span>
        <span>
          <em class="mr-10" :class="{ disabled: !$store.state.user.swIncome }">开启代收</em>
          <el-switch v-model="$store.state.user.swIncome" @change="(e) => enableChange(e, 'true')">
          </el-switch>
        </span>
        <span>
          <em class="mr-10" :class="{ disabled: !$store.state.user.swPay }">开启代付</em>
          <el-switch v-model="$store.state.user.swPay" @change="(e) => enableChange(e, 'true')">
          </el-switch>
        </span>

        <span>
          <!-- <MoonSwitch></MoonSwitch> -->
          <ThemeToggle></ThemeToggle>
        </span>
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <div class="nav-end avatar-container">
        <div @click="showSecurityCenter" style="cursor: pointer">安全中心</div>
        <div divided @click="logout" style="cursor: pointer">
          <span style="display: block">退出</span>
        </div>

        <div class="avatar-wrapper">
          <img src="@/assets/img/avator.png" class="user-avatar" />
          <span>{{ $store.state.user.userName }}</span>
        </div>
      </div>

      <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/img/avator.png" class="user-avatar" />
          <span>{{ $store.state.user.userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="showSecurityCenter">安全中心</el-dropdown-item>
          <el-dropdown-item divided @click.native="showPersonalCenter">平台信息</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <SecurityCenter ref="SecurityCenter"></SecurityCenter>
    <PersonalCenter ref="PersonalCenter"></PersonalCenter>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrUpdateCollectAndPayment, getCollectAndPayment } from '@/api/user'
import Breadcrumb from '@/components/Breadcrumb'
import SecurityCenter from '@/components/SecurityCenter'
import PersonalCenter from '@/components/PersonalCenter'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

import ThemeToggle from '@/components/ThemeToggle'
import MoonSwitch from '@/components/MoonSwitch'

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
    PersonalCenter
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      if (this.$store.state.user.swPay || this.$store.state.user.swIncome) {
        this.$confirm('如果需要停止接单，请先关闭接单状态再退出，是否立即退出？').then(
          async (_) => {
            // this.$store.state.user.swPay = 0
            // this.$store.state.user.swIncome = 0
            await this.$store.dispatch('user/logout')
            // this.$router.push(`/login`)
          }
        )
      } else {
        await this.$store.dispatch('user/logout')
        // this.$router.push(`/login`)
      }
    },
    showSecurityCenter() {
      this.$refs.SecurityCenter.dialogVisible = true
      this.$refs.SecurityCenter.resetFields()
    },
    showPersonalCenter() {
      this.$refs.PersonalCenter.dialogVisible = true
      this.$refs.PersonalCenter.resetFields()
    },

    async enableChange(e, flag) {
      try {
        let res = await getOrUpdateCollectAndPayment(this.tenantId, {
          isCollectEnable: flag ? (this.$store.state.user.swIncome == 1 ? true : false) : null,
          isPaymentEnable: flag ? (this.$store.state.user.swPay == 1 ? true : false) : null
        })
        this.$store.state.user.swIncome = res.data.isCollectEnable == true ? 1 : 0
        this.$store.state.user.swPay = res.data.isPaymentEnable == true ? 1 : 0
      } catch (err) {
        console.log(err)
      }
    },
    async getSwitchState() {
      let res = await getCollectAndPayment(this.tenantId)
      this.$store.state.user.swIncome = res.data.isCollectEnable == true ? 1 : 0
      this.$store.state.user.swPay = res.data.isPaymentEnable == true ? 1 : 0
    }
  },
  mounted() {
    this.getSwitchState()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  min-width: 1150px;
  position: relative;
  // background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

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

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    float: right;
    height: 100%;
    line-height: 50px;
    width: 860px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      // color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
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
    }
  }

  .nav-end {
    display: flex;
    align-items: center;
    margin-right: 20px;
    justify-content: space-between;
    gap: 20px;

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
