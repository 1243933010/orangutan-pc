<template>
  <div class="login-container">
    <img class="left-bg" src="../../assets/login_bk.png">
    <div class="right-form">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >

        <div class="title-container">
          <h3 class="title">登录 星际闪汇</h3>
          <p class="descript">用星际闪汇、让收款更轻松</p>
        </div>

        <div class="divider-box">
          <h5 class="divider-title">
            登录账号
            <div class="short-line" />
          </h5>
        </div>

        <el-form-item prop="phone">
          <el-input
            ref="phone"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            name="phone"
            type="text"
            autocomplete="on"
            class="form-input"
          >
            <template slot="prepend">账 号</template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            name="password"
            type="text"
            autocomplete="on"
            class="form-input"
          >
            <template slot="prepend">密 码</template>
          </el-input>
        </el-form-item>
        <!--
        <el-form-item prop="smsCode" class="code-inp-box">
          <el-input class="code-inp" placeholder="请输入短信验证码" v-model="loginForm.smsCode"></el-input>
          <el-button class="code-btn" type="primary" @click.prevent="getCodeHandle">{{ codeText }}</el-button>
        </el-form-item> -->
        <el-form-item class="checkbox-link">
          <div class="go-register" @click="goPage">注册账号</div>
          <div class="forget-passwd" @click="forgetPwd">忘记密码?</div>
        </el-form-item>
        <el-button
          :loading="loading"
          class="login-btn"
          type="primary"
          @click.native.prevent="handleLogin"
        >登录</el-button>

        <el-form-item class="checkbox-link">
          <el-checkbox label="下次自动登录" name="type" />
        </el-form-item>
      </el-form>
      <div class="logo">
        <img src="../../assets/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'
import { sms_login } from '@/api/project'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    const validateSmsCode = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('短信验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        // code: "",
        smsCode: '',
        isRemember: [],
        password: ''
      },
      loginRules: {
        phone: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码或者座机号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        // code: [{ required: true, trigger: 'blur', validator: validateCode }],
        smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: true,
      redirect: undefined,
      otherQuery: {},
      codeText: '获取验证码'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          try {
            this.$store.dispatch('user/login', { mobile: this.loginForm.phone, password: this.loginForm.password }).then((response) => {
              this.loading = false
              if (response.code == 200) {
                setTimeout(() => {
                  this.$store.dispatch('user/getInfo', {}).then(() => {
                    this.loading = false
                    this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                  }).catch((err) => {
                    this.loading = false
                  })
                }, 1000)
              }
            }).then((err) => {
              // console.log(err,'============1')
              this.loading = false
            })
          } catch (error) {
            // console.log(error,'============')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    async getSmsRegister() {
      const res = await sms_login({ mobile: this.loginForm.phone })
      console.log(res)
      if (res.code == 200) {
        console.log('---')
        this.$message.success(res.msg)
      }
    },
    getCodeHandle() {
      if (this.codeText == '获取验证码') {
        this.codeText = 60
        this.getSmsRegister()
        const time = setInterval(() => {
          this.codeText--
          if (this.codeText == 0) {
            clearInterval(time)
            this.codeText = '获取验证码'
          }
        }, 1000)
      } else {
        return
      }
      // 获取短信验证码的处理函数
    },
    goPage() {
      this.$router.push({ path: '/register' })
    },
    forgetPwd() {
      this.$router.push({ path: '/forget-password' })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep  .el-input__inner{
  border-left:none;
}
</style>
<style lang="scss">

.login-container {
    display: flex;

    .left-bg {
        background: #f5f5f5;
        width: 60%;
        height: 100vh;
    }

    .right-form {
        padding: 0 10%;
        width: 40%;
        display: flex;
        align-items: center;
        position: relative;

        .logo {
            position: absolute;
            top: 36px;
            left: 24px;

            img {
                width: 158px;
                height: 40px;
            }
        }

        .login-form {
            width: 100%;

            .title-container {
                margin-bottom: 38px;

                .title {
                    font-weight: bold;
                    font-size: 30px;
                    color: #191919;
                    margin-bottom: 0;
                }

                .descript {
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    font-size: 18px;
                    color: #7C7D7F;
                }
            }

            .divider-box {
                margin-bottom: 22px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                border-bottom: 1px solid #DCDFE6;

                .divider-title {
                    margin: 0;
                    padding-bottom: 10px;
                    position: relative;
                    font-weight: 400;
                    font-size: 18px;
                    color: #191919;

                    .short-line {
                        background: linear-gradient(90deg, #326CFB 0%, #326CFB 100%);
                        height: 4px;
                        position: absolute;
                        left: 0;
                        bottom: -1px;
                        width: calc(100% + 20px);
                    }
                }
            }

            .login-btn {
                width: 100%;
                margin-bottom: 30px;
                height: 54px;
                background: linear-gradient(0deg, #326CFB 0%, #326CFB 100%);
                border-radius: 6px;
            }

            .checkbox-link {
                width: 100%;

                .el-form-item__content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    &::after,
                    &::before {
                        content: none;
                    }
                }

                .go-register {
                    margin-left: 18px;
                    font-weight: 400;
                    font-size: 16px;
                    color: #666767;
                    cursor: pointer;
                }

                .forget-passwd {
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    font-size: 16px;
                    color: #326CFB;
                    cursor: pointer;
                }
            }

            .form-input {
                .el-input__inner {
                    height: 54px;
                    background: #FFFFFF;
                    border-radius: 0px 6px 6px 0px;
                }

                .el-input-group__prepend {
                    color: #191919;
                    font-size: 16px;
                    background-color: #fff;

                }
            }
        }
    }
}
</style>