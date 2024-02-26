<template>
  <div class="main">
    <div class="content">
      <div class="con-top">
        <div class="data">
          <div class="link">
            <span>您的邀请链接：https://www.baidu.com/123456</span>
            <div v-copy="'text1111111'" class="copy"><span>一键复制</span></div>
          </div>
          <div class="money">
            <div class="title">
              <img src="../../assets/personalData/icon_6.png" alt="">
              <span>数据概览</span>
            </div>
            <div class="money-con">
              <div class="item">
                <div class="item-icon"><img src="../../assets/personalData/icon_3.png" alt=""></div>
                <div class="item-num">181818</div>
                <div class="item-label">（ 账户余额 )</div>
              </div>
              <div class="item">
                <div class="item-icon"><img src="../../assets/personalData/icon_2.png" alt=""></div>
                <div class="item-num">181818</div>
                <div class="item-label disabeld">（ 冻结金额 )</div>
              </div>
              <div class="item">
                <div class="item-icon"><img src="../../assets/personalData/icon_1.png" alt=""></div>
                <div class="item-num">181818</div>
                <div class="item-label">（ 收益金额 )</div>
              </div>
            </div>
          </div>
        </div>
        <div class="order">
          <div class="title">
            <div class="icon"><img src="../../assets/personalData/icon_7.png" alt=""></div>
            <span>待处理订单</span>
          </div>
          <div class="box">
            <div class="item" v-for="(item, index) in orderList" :key="index">
              <div class="label">
                <span class="id">{{ index + 1 }}</span>
                <span class="name">{{ item.id }}</span>
              </div>
              <div class="btn"><span>立即处理</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="con-bottom">
        <div class="data">
          <div class="today">
            <div class="item">
              <div class="num"><span>181,818,1245</span></div>
              <div class="label"><span>今日充值</span></div>
            </div>
            <div class="item">
              <div class="num"><span>181,818,1245</span></div>
              <div class="label"><span>今日收款</span></div>
            </div>
            <div class="item">
              <div class="num"><span>181,818,1245</span></div>
              <div class="label"><span>今日收益</span></div>
            </div>
            <div class="item">
              <div class="num"><span>181,818,1245</span></div>
              <div class="label"><span>今日提现</span></div>
            </div>
          </div>
          <div class="order">
            <div class="item">
              <div class="icon"><img src="../../assets/personalData/icon_5.png" alt=""></div>
              <div class="num">
                <div class="val"><span>181,818,1245</span></div>
                <div class="label"><span>总订单</span></div>
              </div>
            </div>
            <div class="item">
              <div class="icon"><img src="../../assets/personalData/icon_4.png" alt=""></div>
              <div class="num">
                <div class="val"><span>181,818,1245</span></div>
                <div class="label"><span>今日订单</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="message">
          <div class="title">
            <div class="icon"><img src="../../assets/personalData/icon_5.png" alt=""></div>
            <span>系统公告</span>
          </div>
          <div class="box">
            <div class="item" v-for="(item, index) in msgList" :key="index" @click="getNoticeDetail(item,index)">
              <div class="label">
                <span class="id">{{ index + 1 }}</span>
                <span class="name">{{ item.title }}</span>
              </div>
              <!-- <div class="btn"><span>{{ item.name }}</span></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <DirectiveDialog ref="detail" :title="`通知 (${dialogDetail.index+1}/${msgList.length})`" :border="false">
      <div class="dialog-msg">
        <span style="font-weight:600;margin-bottom:10px;">{{ dialogDetail.title }}</span>
        <p>{{ dialogDetail.content||'' }}</p>
      </div>
    </DirectiveDialog>
  </div>
</template>

<script>
import Vue from 'vue'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import { notice, notice_detail } from '@/api/project'

Vue.directive('copy', {
  bind: function (el, binding) {
    el.$copy = function () {
      const textarea = document.createElement('textarea')
      textarea.value = binding.value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('Copy')
      document.body.removeChild(textarea)
    }
    el.addEventListener('click', el.$copy)
  },
  unbind: function (el) {
    el.removeEventListener('click', el.$copy)
  }
})
export default {
  components: { DirectiveDialog },
  data() {
    return {
      orderList: [
        { id: '11122222222' },
        { id: '11122222222' },
        { id: '11122222222' },
        { id: '11122222222' },
        { id: '11122222222' },
      ],
      msgList: [],
      dialogDetail:{} 
    }
  },
  mounted() {
    this.getNotice();
  },
  methods: {
    async getNotice() {
      let res = await notice();
      if (res.code == 200) {
        this.msgList = res.data.data;
      }
    },
    async getNoticeDetail(item,index) {
      let res = await notice_detail(item.notice_id);
      if (res.code == 200) {
        this.dialogDetail = res.data;
        this.dialogDetail.index = index;
        this.$refs.detail.openDialog()
      }
    },
  }
}

</script>

<style lang="scss" scoped>
.dialog-msg {
  padding: 0 40px;
  color: #2C2F37;
  font-size: 18px;
}

.main {
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;

  // overflow-y: scroll;
  // margin-bottom: 116px;
  .con-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    margin-bottom: 10px;

    .data {
      width: 60%;
      display: flex;
      flex-direction: column;

      .link {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 16px 20px;
        background: white;
        border-radius: 10px;
        margin-bottom: 22px;

        span {
          color: #657584;
          font-size: 18px;
        }

        div {
          width: 119px;
          height: 40px;
          background: #3D63F4;
          border-radius: 10px;

          display: flex;
          justify-content: center;
          align-items: center;

          span {
            color: #FFFFFF;
            font-size: 16px;
          }
        }
      }

      .money {
        display: flex;
        flex-direction: column;

        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 19px;

          img {
            width: 15px;
            height: 16px;
            margin-right: 8px;
          }

          span {
            color: #404866;
            font-size: 18px;
            line-height: 1;
            font-weight: 600;
          }
        }

        .money-con {
          width: 100%;
          background: linear-gradient(0deg, #E8EFFF 0%, #FFFFFF 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 39px 57px 49px;

          .item {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .item-icon {
              width: 28px;
              height: 28px;
              margin-bottom: 19px;
            }

            .item-num {
              color: #202A4E;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 21px;
            }

            .item-label {
              color: #9A9CA1;
              font-size: 18px;
            }

            .disabeld {
              color: #9A9CA1;
            }
          }
        }
      }
    }

    .order {
      width: 40%;
      height: 100%;
      background: url('../../assets/personalData/bk1.png') no-repeat left top / cover;
      box-sizing: border-box;
      padding: 21px 26px;
      position: absolute;
      left: calc(60% + 10px);
      top: 0;
      overflow-y: auto;
      border-radius: 10px;

      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 30px;

        img {
          width: 15px;
          height: 16px;
          margin-right: 8px;
        }

        span {
          color: #404866;
          font-size: 18px;
          font-weight: 600;
        }
      }

      .box {
        display: flex;
        flex-direction: column;

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          .label {
            color: #404866;
            font-size: 16px;



            .id {
              margin-right: 21px;
            }
          }

          .btn {
            background: linear-gradient(90deg, #5A80EE 0%, #3E64F4 100%);
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 14px;
            box-sizing: border-box;
            padding: 10px 13px;
          }
        }
      }
    }
  }

  .con-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    position: relative;

    // padding-bottom: 116px;
    .data {
      width: 60%;

      .today {
        width: 100%;
        background-color: white;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 68px 57px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .item {
          display: flex;
          flex-direction: column;

          .num {
            color: #202A4E;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 21px;

            span {
              line-height: 1;
            }
          }

          .label {
            color: #9A9CA1;
            font-size: 18px;

            span {
              line-height: 1;
            }
          }
        }
      }

      .order {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item {
          width: calc(50% - 5px);
          background-color: white;
          box-sizing: border-box;
          padding: 68px 57px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 10px;

          .icon {
            width: 46px;
            height: 46px;
            margin-right: 26px;
          }

          .num {
            display: flex;
            flex-direction: column;

            .val {
              color: #202A4E;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 21px;
            }

            .label {
              color: #9A9CA1;
              font-size: 18px;
            }
          }
        }
      }
    }

    .message {
      width: 40%;
      height: 100%;
      background: url('../../assets/personalData/bk1.png') no-repeat left top / cover;
      box-sizing: border-box;
      padding: 21px 26px;
      position: absolute;
      left: calc(60% + 10px);
      top: 0;
      overflow-y: auto;
      border-radius: 10px;

      .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 30px;

        img {
          width: 15px;
          height: 16px;
          margin-right: 8px;
        }

        span {
          color: #404866;
          font-size: 18px;
          font-weight: 600;
        }
      }

      .box {
        display: flex;
        flex-direction: column;

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          .label {
            color: #404866;
            font-size: 16px;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
              width:80%;
              white-space: nowrap;
              /* 不换行 */
              overflow: hidden;
              /* 隐藏超出容器范围的内容 */
              text-overflow: ellipsis;
              /* 使用省略号替代被隐藏的内容 */
              // color:red;
            }

            .id {
              margin-right: 21px;
            }
          }

          .btn {
            background: linear-gradient(90deg, #5A80EE 0%, #3E64F4 100%);
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 14px;
            box-sizing: border-box;
            padding: 10px 13px;
          }
        }
      }
    }
  }
}</style>
