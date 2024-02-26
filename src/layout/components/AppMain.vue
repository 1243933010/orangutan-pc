<template>
  <section class="app-main">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div class="copyright">Copyright © 星际闪汇   2024</div>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'AppMain',
  components: {
    Breadcrumb
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.app-main {
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 100%;

  .copyright {
    padding-top: 40px;
    padding-bottom: 22px;
    text-align: center;
    color: #6D6D6D;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    padding-left: 24px;
    padding-right: 62px;

    display: flex;
    flex-direction: column;
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
