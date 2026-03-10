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
        <span>可用余额 <strong class="ml-10">{{ $store.state.userAccount.availableBalance?$store.state.userAccount.availableBalance:0 }}</strong> </span>
        <span>冻结金额 <strong class="ml-10">{{ $store.state.userAccount.freezeBalance?$store.state.userAccount.freezeBalance:0 }}</strong> </span>
        <!-- <span>
          <em class="mr-10" :class="{ disabled: !$store.state.user.swIncome }">开启代收</em>
          <el-switch
            v-model="$store.state.user.swIncome"
            active-color="#13ce66"
            inactive-color="#999"
          >
          </el-switch>
        </span>
        <span>
          <em class="mr-10" :class="{ disabled: !$store.state.user.swPay }">开启代付</em>
          <el-switch v-model="$store.state.user.swPay" active-color="#13ce66" inactive-color="#999">
          </el-switch>
        </span> -->

        <span>
          <!-- <MoonSwitch></MoonSwitch> -->
          <ThemeToggle />
        </span>
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <span>{{ $store.state.user.userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/security-center/index"> -->
          <el-dropdown-item @click.native="showSecurityCenter">安全中心</el-dropdown-item>
          <!-- </router-link> -->
          <!-- <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->

          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <SecurityCenter ref="SecurityCenter" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import SecurityCenter from '@/components/SecurityCenter'
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
    SecurityCenter
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // this.$confirm('如果需要停止接单，请先关闭接单状态再退出，是否立即退出？')
      //   .then(async (_) => {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
      // })
      // .catch((_) => {
      //   console.log('------cache----')
      // })
    },
    showSecurityCenter() {
      this.$refs.SecurityCenter.dialogVisible = true
      this.$refs.SecurityCenter.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
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

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    float: right;
    height: 100%;
    line-height: 50px;
    width: 500px;

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

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
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
}

.dark {
  .navbar {
    background: transparent;
    box-shadow: 0 1px 4px rgba(0,0,0,.72);
  }
}
</style>
