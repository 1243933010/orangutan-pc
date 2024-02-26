<template>
  <div class="home-container">
    <navbar :leftNavList="leftNavList" />

    <div class="banner">
      <div class="banner-bg pic">
        <img class="img" src="../../assets/index/banner.png" />
      </div>
      <!-- <div class="text-box">
        <h1></h1>
      </div> -->
    </div>

    <footer>
      <div class="logo-box">
        <div class="logo-img">
          <img class="img" src="../../assets/logo_icon.png" />
        </div>
        <div class="branch-text">
          <div class="branch">星际闪汇丨</div>
          <div class="slogans">用星际闪汇、让收款更轻松</div>

          <div class="copyright-box">Copyright @ 星际闪汇 2024</div>
        </div>
      </div>
      <div class="contact-info">
        <div class="contact-box">客服邮箱: 10086@qq.com</div>
        <div class="contact-box">客服Telegram: 10086@qq.com</div>
        <div class="contact-box">客服Skype: 10086@qg.com</div>
        <div class="contact-box">Telegram社群: 10086@qq.com</div>
        <div class="social-list">
          <div class="pic icon"><img src="../../assets/imgIcon/tiwtter.png" alt="" class="img"></div>
          <div class="pic icon"><img src="../../assets/imgIcon/facebook.png" alt="" class="img"></div>
          <div class="pic icon"><img src="../../assets/imgIcon/whatsApp.png" alt="" class="img"></div>
          <div class="pic icon"><img src="../../assets/imgIcon/plan.png" alt="" class="img"></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  data() {
    return {
      activeName: 0,
      leftNavList: [
        {
          text: "首页",
          path: "/"
        },
        {
          text: "收款",
          path: "/collection"
        },
        {
          text: "充值",
          path: "/rechargeOrder/rechargeOrder"
        },
        {
          text: "订单",
          path: "/withdrawal/withdrawal"
        }
      ]
    }
  },
  methods: {
    handleClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  .banner {
    .banner-bg {
      width: 100%;
      background-color: rgba(0, 0, 0, .3);
    }
  }

  footer {
    padding: 54px 13.5% 56px;
    display: flex;
    justify-content: space-between;
    background-color: #1A2033;

    .logo-box {
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
          color: #fff;
          font-size: 24px;
          font-weight: bold;
        }

        .slogans {
          font-size: 14px;
          color: #fff;
        }

        .copyright-box {
          position: relative;
          bottom: -60px;
          color: #5A5E7B;
          font-size: 14px;
        }
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;

      .contact-box {
        margin-bottom: 12px;
        color: #5A5E7B;
        font-size: 14px;
      }

      .social-list {
        margin-top: 4px;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 26px;
          width: 26px;
        }
      }
    }
  }
}
</style>
