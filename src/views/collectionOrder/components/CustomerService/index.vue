<template>
  <div>
    <DirectiveDialog ref="dialog" title="" :border="false">
      <div class="chat">
        <div class="order">
          <div class="order-ser">
            <el-input @change="inputChange" v-model="input" placeholder="请输入订单号搜索" />
          </div>
          <div class="order-list">
            <div class="list" v-for="(item, index) in orderList" :key="index">
              订单号:{{ item.order_no }}聊天窗口
            </div>
          </div>
        </div>
        <div class="content">
          <div class="box" ref="box">
            <div class="title"><span>{{ title }}</span></div>
            <div v-for="(item, index) in chatList" :key="index" class="item">
              <div v-if="item.to_member !== sessionMsg.member_id" class="user">
                <img class="user-img" :src="userHead" alt="">
                <span class="message" v-if="!item.content.includes(imgUrl) && !iconArr.includes(item.content)">{{
                  item.content }}</span>
                <img v-if="item.content.includes(imgUrl)" :src="item.content" alt="" style="width:100px;">
                <img v-if="iconArr.includes(item.content)" :src="iconList[iconArr.indexOf(item.content)].url" alt=""
                  style="width:40px;">

              </div>
              <div v-if="item.to_member == sessionMsg.member_id" class="me">
                <!-- <span class="message">{{ item.content }}</span> -->
                <span class="message" v-if="!item.content.includes(imgUrl) && !iconArr.includes(item.content)">{{
                  item.content }}</span>
                <img v-if="item.content.includes(imgUrl)" :src="item.content" alt="" style="width:100px;">
                <img v-if="iconArr.includes(item.content)" :src="iconList[iconArr.indexOf(item.content)].url" alt=""
                  style="width:40px;">
                <img class="user-img" :src="dealersHead" alt="">

              </div>
            </div>
          </div>
          <div class="send">
            <div class="icon">
              <img class="icon-icon" src="../../../../assets/icon.png" alt="" @click="openIcon">
              <el-upload class="upload-com" action="" :fileList="[]" :show-file-list="false"
                :http-request="(files) => httpRequest(files)" :before-upload="beforeAvatarUpload" :limit="1">
                <img class="icon-file" src="../../../../assets/file_icon.png" alt="">
              </el-upload>

            </div>
            <div class="input">
              <el-input v-model="input" type="textarea" />
            </div>
            <div class="button">
              <div class="btn1" @click="sendMsg(input)"><span>回复</span></div>
              <!-- <div class="btn2"><span>已解决</span></div> -->
            </div>
          </div>
        </div>

      </div>
    </DirectiveDialog>
    <Icon ref="icon" @chooseIcon=chooseIcon />
  </div>
</template>

<script>
import DirectiveDialog from '@/components/DirectiveDialog/index'
import { order_list, uploadImg } from '@/api/project'
import { generateRandomString } from '@/utils/time'
import Icon from './Icon.vue'
import $bus from '@/utils/mitt';
// 闭嘴 大哭 调皮 尴尬 惊讶 开心 苦笑 难过 嗯 哦 浅笑 伤心 社死 生气 失望 爽 歪嘴笑 微笑 无了 无语 笑 呀 眨眼 龇牙
export default {
  components: { DirectiveDialog, Icon },
  props: {

  },
  data() {
    return {
      title: '',
      chatList: [],
      input: '',
      orderList: [],
      orderObject: {},
      sessionMsg: {},
      iconList: [
        { label: '[闭嘴]', url: require('@/assets/chat/icon_1.png') },
        { label: '[大哭]', url: require('@/assets/chat/icon_2.png') },
        { label: '[调皮]', url: require('@/assets/chat/icon_3.png') },
        { label: '[尴尬]', url: require('@/assets/chat/icon_4.png') },
        { label: '[惊讶]', url: require('@/assets/chat/icon_5.png') },
        { label: '[开心]', url: require('@/assets/chat/icon_6.png') },
        { label: '[苦笑]', url: require('@/assets/chat/icon_7.png') },
        { label: '[难过]', url: require('@/assets/chat/icon_8.png') },
        { label: '[嗯]', url: require('@/assets/chat/icon_9.png') },
        { label: '[哦]', url: require('@/assets/chat/icon_10.png') },
        { label: '[浅笑]', url: require('@/assets/chat/icon_11.png') },
        { label: '[伤心]', url: require('@/assets/chat/icon_12.png') },
        { label: '[社死]', url: require('@/assets/chat/icon_13.png') },
        { label: '[生气]', url: require('@/assets/chat/icon_14.png') },
        { label: '[失望]', url: require('@/assets/chat/icon_15.png') },
        { label: '[爽]', url: require('@/assets/chat/icon_16.png') },
        { label: '[歪嘴笑]', url: require('@/assets/chat/icon_17.png') },
        { label: '[微笑]', url: require('@/assets/chat/icon_18.png') },
        { label: '[无了]', url: require('@/assets/chat/icon_19.png') },
        { label: '[无语]', url: require('@/assets/chat/icon_20.png') },
        { label: '[笑]', url: require('@/assets/chat/icon_21.png') },
        { label: '[呀]', url: require('@/assets/chat/icon_22.png') },
        { label: '[眨眼]', url: require('@/assets/chat/icon_23.png') },
        { label: '[龇牙]', url: require('@/assets/chat/icon_24.png') },
      ],
      iconArr: ['[闭嘴]', '[大哭]', '[调皮]', '[尴尬]', '[惊讶]', '[开心]', '[苦笑]', '[难过]', '[嗯]', '[哦]', '[浅笑]', '[伤心]', '[社死]', '[生气]', '[失望]', '[爽]', '[歪嘴笑]', '[微笑]', '[无了]', '[无语]', '[笑]', '[呀]', '[眨眼]', '[龇牙]']
    }
  },
  computed: {
    imgUrl() {
      return process.env.VUE_APP_FILE_URL;
    },
    userHead() {
      return `${process.env.VUE_APP_FILE_URL}${this.sessionMsg.member_info.head_img}`
    },
    dealersHead() {
      return `${process.env.VUE_APP_FILE_URL}${this.sessionMsg.dealers_member_info.head_img}`
    }
  },
  mounted() {
    $bus.on('new_message', (res) => {
      console.log(res, '--------222')
      // if (res.data.chat_message_id !== this.sessionMsg.chat_message_id) {
      //   this.chatList.push({ to_member: '', content: res.data.message })
      // } else {
      //   this.chatList.push({ to_member: this.sessionMsg.member_id, content: res.data.message })
      // }
      this.chatList.push({ to_member: '', content: res.data.message })
      this.scrollToBottom()
    });

  },
  methods: {
    chooseIcon(item) {
      console.log(item)
      this.socketApi.sendSock({ method: "sendChat", id: generateRandomString(), params: { chat_session_id: this.sessionMsg.chat_session_id, content: item.label } },
        (response) => {
          this.chatList.push({ to_member: this.sessionMsg.member_id, content: item.label })
          this.scrollToBottom()
        }); //聊天
    },
    openIcon() {
      this.$refs.icon.openDialog();
    },
    async httpRequest(files) {
      const formData = new FormData();
      formData.append("file", files.file);  //文件名
      let res = await uploadImg(formData)
      // console.log(res, process.env.VUE_APP_FILE_URL)
      if (res.code == 200) {
        this.$message.success(res.msg)
        // this.socketApi.sendSock({ method: "sendChat", id: generateRandomString(), params: { chat_session_id: this.sessionMsg.chat_session_id, content: `${imgUrl}${res.data}` } },
        //   (response) => {
        //     this.chatList.push({ to_member: this.sessionMsg.member_id, content: `${imgUrl}${res.data}` })
        //     this.scrollToBottom()
        //   }); //聊天
        this.sendMsg(`${this.imgUrl}${res.data}`)
        // this.chatList.push({ to_member: this.sessionMsg.member_id, content: `${this.imgUrl}${res.data}` })
        this.scrollToBottom()
        // this.payment_images = res.data
        return
      }
      this.$message.error(res.msg)
    },
    beforeAvatarUpload(file) {
      const isIMG = file.type.includes('image');

      if (!isIMG) {
        this.$message.error('上传头像只能是图片!');
      }
      return isIMG;
    },
    scrollToBottom() {
      const chatContent = this.$refs.box;//装会话的容器
      this.$nextTick(() => {
        //注意要使用nexttick以免获取不到dom
        if (chatContent.scrollHeight) {
          chatContent.scrollTop = chatContent.scrollHeight - chatContent.offsetHeight
        }

      })
    },
    async sendMsg(str) {
      // console.log(this.sessionMsg)
      this.socketApi.sendSock({ method: "sendChat", id: generateRandomString(), params: { chat_session_id: this.sessionMsg.chat_session_id, content: str } },
        (res) => { console.log(res) }); //聊天
      this.chatList.push({ to_member: this.sessionMsg.member_id, content: str })
      this.scrollToBottom()
    },
    async getWsMsg(orderId) {
      let res = await this.getChat(orderId)
      await this.getChatHistory()
      await this.readMessage()


    },
    getChat(orderId) {
      return new Promise((resolve, reject) => {
        this.socketApi.sendSock({ method: "getChat", id: generateRandomString(), params: orderId },
          (res) => {
            console.log(res, '---||')
            if (res.code == 200) {
              this.sessionMsg = res.data;
              resolve(res.data);
            }
          }); //获取聊天信息
      })
    },
    getChatHistory() {
      return new Promise((resolve, reject) => {
        this.socketApi.sendSock({ method: "getChatHistory", id: generateRandomString(), params: this.sessionMsg.chat_session_id },
          (result) => {
            console.log(result, '---||')
            if (result.code == 200) {
              this.chatList = result.data;
              this.scrollToBottom()
              resolve()
            }
          })   //获取聊天记录
      })
    },
    readMessage() {
      return new Promise((resolve, reject) => {
        this.socketApi.sendSock({ method: "readMessage", id: generateRandomString(), params: this.sessionMsg.chat_session_id },
          (response) => {
            resolve(response)
          })   //标记已读了未读消息
      })
    },
    inputChange(e) {
      console.log('111')
    },
    openDialog(row) {
      this.orderObject = row;
      this.title = `工单号: ${row.order_no}`
      if (this.$refs.dialog) {
        this.$refs.dialog.openDialog();
        this.getList(true);
        this.getWsMsg(row.order_id);
      }
    },
    async getList() {
      let res = await order_list({ limit: 100000, page: 1 })
      if (res.code == 200) {
        this.orderList = res.data.data;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  background: none;
  border: none !important;
}

::v-deep .el-textarea__inner {
  background: none;
  border: none !important;
}

.chat {
  display: flex;
  flex-direction: row;

  .order {
    width: 35%;
    box-sizing: border-box;
    padding: 0 10px;

    .order-ser {
      margin-bottom: 40px;
      color: #84868C;
      font-size: 12px;
      background: #F1F0F5;
    }

    .order-list {
      width: 100%;
      padding-left: 15px;
      color: #2C2F37;
      font-size: 12px;
      font-weight: 600;
      // max-height: 500px;
      overflow-y: auto;

      .list {
        margin-bottom: 18px;
      }
    }
  }

  // background-color: red;
  .content {
    width: 95%;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .box {
      height: 458px;
      overflow-y: scroll;

      .title {
        color: #2C2F37;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 50px;
      }
    }

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
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-right: 20px;

        div {
          width: 120px;
          height: 42px;
          background: #FFFFFF;
          border: 1px solid #F1F1F1;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 11px;

          span {
            color: #333333;
            font-size: 14px;
          }
        }

        .btn2 {
          background: linear-gradient(90deg, #5A80EE 0%, #3D63F4 100%);

          span {
            color: white;
          }
        }
      }
    }
  }


}</style>
