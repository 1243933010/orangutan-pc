<template>
  <div class="register-container">
      <img class="left-bg" src="../../assets/login_bk.png" />
      <div class="right-form">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
              label-position="left">
              <div class="title-container">
                  <h3 class="title">注册账号</h3>
                  <p>用星际闪汇、让收款更轻松</p>
              </div>

              <div class="divider-box">
                  <h5 class="divider-title">
                      <div class="short-line"></div>
                  </h5>
              </div>

              <div v-if="!isRegister">
                  <div class="form-label">手机号</div>
                  <el-form-item prop="phone">
                      <el-input ref="phone" v-model="loginForm.phone" placeholder="请输入手机号" name="phone" type="text"
                          autocomplete="on" :rules="{
                              required: true,
                              message: '手机号不能为空',
                              trigger: 'blur',
                          }" />
                  </el-form-item>


                  <div class="form-label">短信验证码</div>
                  <el-form-item prop="smsCode" class="code-inp-box">

                      <el-input class="code-inp" placeholder="请输入短信验证码" v-model="loginForm.smsCode"></el-input>
                      <el-button class="code-btn" type="primary" @click.prevent="getCodeHandle">
                          <span v-show="sendText">已发送</span> {{ codeText }}</el-button>
                  </el-form-item>

                  <div style="position: relative;">
                      <div class="form-label">设置密码</div>
                      <el-form-item prop="password">
                          <!-- @focus="cardBool = true" @blur="cardBool = false" -->
                          <el-input @focus="cardBool = true" @blur="cardBool = false" v-model="loginForm.password"
                              placeholder="请设置密码，需不少于8个字符" name="password" type="text" :rules="{
                                  required: true,
                                  message: '密码不能为空',
                                  trigger: 'blur',
                              }" />
                      </el-form-item>
                      <div style="position: absolute;top: 65px;left: 0;z-index: 10;" v-show="cardBool">
                          <el-card class="box-card">
                              <div class="box-card-title"><span>您的密码必须包含:</span></div>
                              <div class="box-card-span"><i class="el-icon-success text"></i> <span>至少8个字符</span></div>
                              <div class="box-card-span"><i class="el-icon-success text"></i> <span>英文/数字/符号 至少两种组合</span>
                              </div>
                          </el-card>
                      </div>
                  </div>


                  <div class="form-label">邀请码 (选填)</div>
                  <el-form-item prop="code" class="code-inp-box">

                      <!-- <el-button class="code-btn" @click.prevent="getInviteCode">{{ inviteText }}</el-button> -->
                      <!-- <el-input class="code-inp" placeholder="请输入邀请码" name="code" type="text" v-model="loginForm.code" ></el-input> -->
                      <el-input ref="code" v-model="loginForm.code" placeholder="若有，请输入邀请码" name="code" type="text"
                          autocomplete="on" :rules="{
                              required: true,
                              message: '邀请码不能为空',
                              trigger: 'blur',
                          }" />

                  </el-form-item>

                  <el-button class="login-btn" type="primary" @click.native.prevent="handleRegister">注册</el-button>
                  <!-- <div style="width: 100%;text-align: center;"><span style="font-size: 13px;color: red;font-weight: 600;">{{ errorMessage }}</span></div> -->

                  <el-form-item class="checkbox-link">
                      已有账号、
                      <div class="go-register" @click="goLoginPage">立即登录</div>
                  </el-form-item>
              </div>

              <transition name="el-fade-in">
                  <div v-show="isRegister" class="transition-box">
                      <img class="img" src="../../assets/zc.png" />
                      <el-button class="go-page-btn" type="primary" @click.native.prevent="goIndexPage">立即跳转</el-button>
                      <div class="countdown-box"><span style="color: #409EFF;">{{ countdownNum }}</span>秒后跳转系统首页</div>
                  </div>
              </transition>
          </el-form>
          <div class="logo">
              <img src="../../assets/logo.png" alt="">
          </div>
      </div>
  </div>
</template>

<script>
import { number } from "echarts/lib/export";
import SocialSign from "./components/SocialSignin";
import { register, invite_code, sms_register } from '@/api/project'
export default {
  name: "Login",
  components: { SocialSign },
  data() {
      // const validateSmsCode = (rule, value, callback) => {
      //   console.log(value)
      //   if (value.length === 0) {
      //     callback(new Error("短信验证码不能为空"));
      //   } else {
      //     callback();
      //   }
      // };
      return {
          loginForm: {
              phone: 17154453425,
              code: "",
              smsCode: "",
              password: ''
          },
          loginRules: {
              phone: [
                  { required: true, trigger: "blur", message: "手机号不能为空" },
                  {
                      pattern: /^1[3456789]\d{9}$/,
                      message: "请输入正确的手机号码或者座机号",
                  },
              ],
              smsCode: [
                  { required: true, trigger: "blur", message: "验证码不能为空" },
              ],
              password: [
                  { required: true, trigger: "blur", message: "密码不能为空" },
              ],
              // code: [
              //   { required: true, trigger: "blur", message: "邀请码不能为空" },
              // ],
          },
          passwordType: "password",
          capsTooltip: false,
          loading: false,
          isRegister: false, // 是否已经注册成功, 用于是否跳转到首页前的提示
          countdownNum: 3, // 倒计时 3秒
          codeText: '获取验证码',
          inviteText: '获取邀请码',
          errorMessage: '',
          sendText: false,
          cardBool: false
      };
  },
  mounted() {
      // 获取当前页面的 URL
      const currentURL = window.location.hash;
      // 从 URL 中提取哈希部分（#）之后的内容
      const hashIndex = currentURL.indexOf('#');
      const hash = hashIndex !== -1 ? currentURL.slice(hashIndex + 1) : '';
      // 分割哈希部分，获取路径和查询参数部分
      const hashParts = hash.split('?');
      const path = hashParts[0];
      const queryParams = hashParts[1];
      // 解析查询参数部分
      if (queryParams) {
          // 将查询参数字符串解析为对象
          const params = new URLSearchParams(queryParams);
          // 获取 invite_code 参数的值
          const inviteCode = params.get('invite_code');
          if (inviteCode) {
              // console.log('invite_code 的值是：', inviteCode);
              this.loginForm.code = inviteCode;
          } else {
              console.log('URL 中没有 invite_code 参数');
          }
      } else {
          console.log('URL 中没有查询参数');
      }

      // if (this.loginForm.username === "") {
      //   this.$refs.username.focus();
      // } else if (this.loginForm.password === "") {
      //   this.$refs.password.focus();
      // }
  },
  methods: {
      inputBlur() {
          console.log('1111')
      },
      GetRequest(urlStr) {
          if (typeof urlStr == "undefined") {
              var url = decodeURI(location.hash); //获取url中"?"符后的字符串
          } else {
              var url = "?" + urlStr.split("?")[1];
          }
          var theRequest = new Object();
          if (url.indexOf("?") != -1) {
              var str = url.substr(1);
              var strs = str.split("&");
              for (var i = 0; i < strs.length; i++) {
                  theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
              }
          }
          return theRequest;
      },
      async handleRegister() {
          this.$refs.loginForm.validate(async (valid) => {
              this.loading = true;
              if (valid) {
                  this.loading = false;
                  let formData = { mobile: this.loginForm.phone, code: this.loginForm.smsCode, invite_code: this.loginForm.code, password: this.loginForm.password };
                  try {
                      let response = await this.$store.dispatch('user/registerAtion', formData)
                      console.log(response, 'response---')
                      if (response.code == 200) {
                          this.$message.success('注册成功')
                          this.$store.dispatch('user/getInfo', {}).then(() => {
                              this.loading = false;
                              this.isRegister = true
                              setTimeout(() => {
                                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
                              }, 3000)
                          }).catch((err) => {
                              console.log(err, '---')
                              this.loading = false;
                          })
                      }
                      // this.errorMessage = response.msg || '错误';
                      // setTimeout(() => {
                      //   this.errorMessage = '';
                      // }, 2000)

                  } catch (error) {
                  }



              } else {
                  console.log("error submit!!");
                  this.loading = false;
                  return false;
              }
          });
      },
      // async getInviteCode(){

      // },
      async getInviteCode() {
          let res = await invite_code({});
          console.log(res, '===')

      },
      async getSmsRegister() {
          let res = await sms_register({ mobile: this.loginForm.phone })
          console.log(res)
          if (res.code == 200) {
              console.log('---')
              this.$message.success(res.msg)
          }
      },
      getCodeHandle() {
          if (this.codeText == '获取验证码') {
              this.codeText = 60;
              this.sendText = true;
              this.getSmsRegister();
              let time = setInterval(() => {
                  this.codeText--;
                  if (this.codeText == 0) {
                      clearInterval(time);
                      this.sendText = false;
                      this.codeText = '获取验证码'
                  }
              }, 1000)
          } else {
              return
          }
          // 获取短信验证码的处理函数
      },
      goLoginPage() {
          this.$router.push({ path: "/login" });
      },
      goIndexPage() {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
      },
  },
};
</script>

<style lang="scss" scoped>
::v-deep  .el-input__inner{
  border-left:none;
}
</style>
<style lang="scss">
.box-card {
  border-radius: 7px;

  .box-card-title {
      font-size: 16px;
      margin-bottom: 14px;
  }

  .box-card-span {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;

      .text {
          color: #CED3D9;
          margin-right: 5px;
      }

      span {
          color: #CED3D9;
          font-size: 13px;
      }
  }
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.register-container {
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
              .title {
                  margin-bottom: 0;
                  font-size: 30px;
              }
          }

          .divider-box {
              margin-bottom: 22px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              border-bottom: 1px solid #dcdfe6;

              .divider-title {
                  margin: 0;
                  padding-bottom: 10px;
                  position: relative;

                  .short-line {
                      height: 2px;
                      background-color: #1890ff;
                      position: absolute;
                      left: 0;
                      bottom: -1px;
                      width: 74px;
                  }
              }
          }

          .el-input__inner {
              height: 54px;
          }

          .code-inp-box {
              .el-form-item__content {
                  display: flex;

                  .code-inp {
                      margin-right: 10px;
                      flex-grow: 1;


                  }

                  .code-btn {
                      margin-bottom: 0;
                      width: 134px;
                      text-align: center;
                  }
              }
          }

          .login-btn {
              width: 100%;
              margin-bottom: 30px;
              height: 54px;
          }

          .checkbox-link {
              width: 100%;

              .el-form-item__content {
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }

              .go-register {
                  cursor: pointer;
                  color: #1890ff;
              }
          }

          .transition-box {
              display: flex;
              flex-direction: column;

              .img {
                  min-height: 100px;
                  background-color: #f5f5f5;
              }

              .countdown-box {
                  margin-top: 38px;
                  text-align: center;
              }
          }
      }
  }
}</style>