<template>
  <div>
    <DirectiveDialog ref="initiate" :title="title" :border="false">
      <div class="chat">
        <div class="content">
          <div v-for="(item, index) in chatList" :key="index" class="item">
            <div v-if="item.type == 0" class="user">
              <img class="user-img" src="../../assets/close_icon.png" alt="">
              <span class="message">{{ item.message }}</span>
            </div>
            <div v-if="item.type == 1" class="me">
              <span class="message">{{ item.message }}</span>
              <img class="user-img" src="../../assets/close_icon.png" alt="">

            </div>
          </div>
        </div>
        <div class="send">
          <div class="icon">
            <img class="icon-icon" src="../../assets/icon.png" alt="">
            <img class="icon-file" src="../../assets/file_icon.png" alt="">
          </div>
          <div class="input">
            <el-input v-model="input" type="textarea" />
          </div>
          <div class="button">
            <div class="btn1"><span>回复</span></div>
            <div class="btn2"><span>已解决</span></div>
          </div>
        </div>
      </div>
    </DirectiveDialog>

  </div>
</template>

<script>
import DirectiveDialog from '../DirectiveDialog/index'
export default {
  components: { DirectiveDialog },
  props: {

  },
  data() {
    return {
      title: '工单号: xxxxx',
      chatList: [
        { type: 0, message: '你好' },
        { type: 0, message: '你好' },
        { type: 0, message: '你好' }
      ],
      input: ''
    }
  },
  methods: {
    init() {
      if (this.$refs.initiate) {
        this.$refs.initiate.openDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner{
    background: none;
    border: none !important;
}

::v-deep  .el-textarea__inner {
    background: none;
    border: none !important;
}
.chat {

    // background-color: red;
    .content {
        width: 95%;
        margin: 0 auto;
        height: 400px;
        overflow-y: scroll;

        // background: wheat;
        .item {
            display: flex;
            flex-direction: row;
            margin-bottom: 12px;

            .user,
            .me {
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;

                .user-img {
                    width: 50px;
                    height: 50px;
                    margin-right: 34px;
                }

                .message {
                    line-height: 1;
                    background-color: #FFFFFF;
                    border-radius: 6px;
                    box-sizing: border-box;
                    padding: 12px 24px;
                    color: #2C2F37;
                    font-size: 18px;
                }
            }

            & .me {
                display: flex;
                justify-content: flex-end;
                align-self: flex-end;

                .user-img {
                    margin-left: 34px;
                    margin-right: 0px;
                }
            }
        }
    }

    .send {
        width: 100%;
        border-top: 2px solid white;
        padding-top: 12px;

        .icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 20px;
            padding-left: 10px;
            .icon-icon {
                margin: 0 10px;
                width: 21px;
                height: 22px;
            }

            .icon-file {
                width: 22px;
                height: 20px;
            }
        }

        .input {
            padding-bottom: 20px;
            padding-left: 10px;
        }

        .button {
           width:100%;
           display: flex;
           justify-content: flex-end;
           padding-right: 20px;
           div{
            width: 120px;
            height: 42px;
            background: #FFFFFF;
            border: 1px solid #F1F1F1;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 11px;
            span{
                color: #333333;
                font-size:14px;
            }
           }
           .btn2{
            background: linear-gradient(90deg, #5A80EE 0%, #3D63F4 100%);
            span{
                color: white;
            }
           }
        }
    }
}</style>
