<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <div class="left-logo">
      <div class="logo-box" @click="goPage('/')">
        <div class="logo-img">
          <img class="img" src="../../assets/logo_icon.png" />
        </div>
        <div class="branch-text">
          <div class="branch">星际闪汇丨</div>
          <div class="slogans">用星际闪汇、让收款更轻松</div>
        </div>
      </div>

      <div class="nav-list">
        <div v-for="(item, index) of leftNavList" :key="index" class="nav-item" @click="goPage(item.path)">{{ item.text }}
        </div>
      </div>
    </div>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item" /> -->

        <div v-for="(item, index) of rightNavList" :key="index" class="right-menu-item" @click="goPage(item.link)">{{
          item.text }}</div>

        <div class="right-menu-item has-icon">
          <i class="el-icon-bell" />
        </div>

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item" />
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="../../assets//user_icon.png" />
          <span>{{ $store.state.user.userInfo.nickname||'未登录' }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/personalCenter/personalData">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link> -->
          <div  @click="goPage('/userCenter/userCenter')">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </div>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
         
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  props: {
    leftNavList: {
      type: Array,
      default: () => []
    },
    rightNavList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  data() {
    return {
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      this.clearAllCookies();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    goPage(link) {
      // console.log(this.$store.state.permission.routes,this.$store.state.user.userInfo.username,'---')
      this.$router.push(link)
    },
    clearAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.navbar {
  height: $navbarH;
  overflow: hidden;
  position: relative;
  background: #DCE6FC;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-logo {
    display: flex;
    align-items: center;

    .logo-box {
      margin-right: 30px;
      padding: 27px 0 22px 75px;
      display: flex;
      align-items: flex-start;

      .logo-img {
        width: 40px;
        height: 40px;
        background-color: #f5f5f5;

        .img {
          width: 100%;
        }
      }

      .branch-text {
        margin-left: 10px;
        display: flex;
        flex-direction: column;

        .branch {
          margin-bottom: 12px;
          color: #191919;
          font-size: 24px;
          font-weight: bold;
        }

        .slogans {
          font-size: 14px;
          color: #7C7D7F;
        }
      }
    }

    .nav-list {
      display: flex;
      align-items: center;

      .nav-item {
        margin-left: 58px;
        color: #192B51;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }

  .right-menu {
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      margin-right: 40px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;

      &:hover {
        color: #192B51;
      }

      &.has-icon {
        font-size: 20px;
      }
    }

    .avatar-container {
      margin-left: 16px;
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          margin-left: 16px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
