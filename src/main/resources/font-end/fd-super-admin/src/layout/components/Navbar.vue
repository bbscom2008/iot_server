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
        <!-- <span>可用余额 <strong class="ml-10">88888</strong> </span>
        <span>冻结金额 <strong class="ml-10">8888</strong> </span>
        <span>
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
          <span style="font-weight: bold" class="mr-10">选择平台:</span>
          <!-- <el-select filterable  v-model="$store.state.user.platformName" size="small">
            <el-option label="平台1" :value="1"></el-option>
            <el-option label="平台2" :value="2"></el-option>
            <el-option label="平台3" :value="3"></el-option>
          </el-select> -->

          <el-select
            filterable
            v-model="$store.state.tenant.selectTenantId"
            placeholder="请选择平台"
            size="small"
            @change="tenantChange"
          >
            <el-option
              :label="item.tenantName"
              :value="item.tenantId"
              v-for="item in tenantList"
              :key="item.tenantId"
            ></el-option>
          </el-select>
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
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

    </div>
      <SecurityCenter ref="SecurityCenter"></SecurityCenter>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import ErrorLog from '@/components/ErrorLog'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import Screenfull from '@/components/Screenfull'
import SecurityCenter from '@/components/SecurityCenter'
import SizeSelect from '@/components/SizeSelect'
import { mapGetters } from 'vuex'
import MoonSwitch from '@/components/MoonSwitch'
import ThemeToggle from '@/components/ThemeToggle'

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
    ...mapGetters(['sidebar', 'avatar', 'device', 'tenantList'])
  },

  watch: {
    'tenantList': {
      handler(newVal,oldVal){
        let tenant = newVal.find(item => item.tenantId == this.$store.state.tenant.selectTenantId)
        document.title = tenant?tenant.tenantName+'-超管端':'超管端'
      },
    },
  },
  

  methods: {

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // this.$confirm('确定退出吗？')
      //   .then(async (_) => {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
      // })
    },
    tenantChange(e){
      let tenant = this.tenantList.find(item => item.tenantId == e)
      document.title = tenant?tenant.tenantName+'-超管端':'超管端'
      this.$store.commit('tenant/update_selectTenantId',e)
    },
    showSecurityCenter() {
      this.$refs.SecurityCenter.dialogVisible = true
      this.$refs.SecurityCenter.resetFields()
    }
  },
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
    width: 650px;

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

.dark {
  .navbar {
    background: transparent;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.72);
  }
}
</style>
