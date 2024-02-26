<template>
    <div>
        <DirectiveDialog ref="dialog" :title="`订单号${orderDetail.order_no}`"  :refName="refName">
            <div class="content">
                <div class="message"  v-if="[11].includes(orderDetail.order_status)&&userInfo.identity==2">对方已申请退款，请确认是否同意退款，订单将在：<span class="num">{{ countdown }} </span>秒 后自动同意</div>
                <div class="message"  v-if="[12].includes(orderDetail.order_status)&&userInfo.identity==1">对方不同意您的申请退款，请确认是否处理结果，订单将在：<span class="num">{{ countdown }} </span>秒 后自动同意</div>
                <div class="message"  v-if="[14].includes(orderDetail.order_status)&&userInfo.identity==2">您已同意退款，请及时上传退款证明，否则将影响您后续的收款</div>
                <div class="message"  v-if="[13].includes(orderDetail.order_status)&&userInfo.identity==1">您已发起付款争议，可进行聊天沟通，等待官方客服介入判断</div>
                <div class="message"  v-if="[13].includes(orderDetail.order_status)&&userInfo.identity==2">对方已发起付款争议，可进行聊天沟通，等待官方客服介入判断</div>
                <div class="message"  v-if="[15].includes(orderDetail.order_status)&&userInfo.identity==1">对方已退款，请退款是否到账，订单将在：<span class="num">{{ countdown }} </span>秒 后自动确认</div>
                <div class="form">
                    <div class="form-item">
                        <div class="form-item-title">订单状态</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><span>{{ orderDetail.order_status_name }}</span></div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">商家名称</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input :disabled="true"
                                    v-model="orderDetail.dealers_name" /></div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title"><span>收款金额</span></div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input :disabled="true"
                                    v-model="orderDetail.order_money" /></div>
                            <div class="form-item-right-label"><span>注：收款汇率: 10%;收款费用: 200.0000</span></div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">规定支付时长</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input">
                                <el-select v-model="orderDetail.pay_len" placeholder="请选择" :disabled="true"
                                    style="width: 100%;height: 100%;">
                                    <el-option label="10分钟" value="0"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">支付方式</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input">
                                <el-select :disabled="true" v-model="orderDetail.channel" placeholder="请选择"
                                    style="width: 100%;height: 100%;">
                                    <el-option label="papay" value="0"></el-option>
                                </el-select>
                            </div>
                            <div class="form-item-right-label"><span>注：支持亲密付、商业付</span></div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">商家留言</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input :disabled="true"
                                    v-model="orderDetail.payment_remark" /></div>
                        </div>
                    </div>
                    <div class="flex-row">
                        <div class="form-items">
                            <div class="form-item-title">付款证明</div>
                            <div class="form-item-title form-item-see" @click="seeImg(orderDetail.payment_images)">查看附件
                            </div>
                        </div>
                        <!-- <el-badge :value="3"> -->
                        <div class="form-items">
                            <div class="form-item-title">联系对方</div>
                            <div class="form-item-title form-item-chat" @click="handleDialog('chats')">
                                聊天
                                <span class="chat_icon" v-if="sessionMsg.is_read > 0">{{ sessionMsg.is_read }}</span>
                            </div>
                        </div>
                        <!-- </el-badge> -->
                    </div>

                    <div class="form-item">
                        <div class="form-item-title"><span>钱包地址</span></div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input :disabled="true"
                                    v-model="orderDetail.payment_address">
                                    <div slot="append" v-clipboard:copy="orderDetail.payment_address"
                                        v-clipboard:success="clipboardSuccess">复制</div>
                                    <!-- <template slot="append">.com</template> -->
                                </el-input></div>
                        </div>
                    </div>

                    
                    <div class="flex-row">
                        <div class="form-items" style="width:50%;">
                            <div class="form-item-title" style="width:200px;">贸易商退款证明</div>
                            <div class="form-item-title form-item-see" @click="seeImg(orderDetail.refund_images)">查看附件
                            </div>
                        </div>
                       
                    </div>
                    <div class="flex-row" v-if="[14].includes(orderDetail.order_status)&&userInfo.identity==2">
                        <div class="form-items" style="width:50%;">
                            <div class="form-item-title" style="width:200px;">卡商退款证明</div>
                            <el-upload class="upload-com" action="" :fileList="[]" :show-file-list="false"
                                :http-request="(files) => httpRequest(files)" :before-upload="beforeAvatarUpload"
                                :limit="1">
                                <!-- <el-button  class="no-bg-btn">更新头像</el-button> -->
                                <div class="form-item-title form-item-see" v-if="!dealer_refund_images">上传附件</div>
                                <div class="form-item-title form-item-see" v-if="dealer_refund_images">附件已上传</div>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div class="submit-btn">
                    <div class="btn1 flex-content"  v-if="[11].includes(orderDetail.order_status)&&userInfo.identity==2" @click="handleExamine(1)">同意退款</div>
                    <div class="btn3 flex-content" v-if="[11].includes(orderDetail.order_status)&&userInfo.identity==2" @click="handleExamine(2)">不同意退款</div>
                    <div class="btn1 flex-content"  v-if="[12,15].includes(orderDetail.order_status)&&userInfo.identity==1" @click="handleRefund">退款争议</div>
                    <div class="btn1 flex-content"  v-if="[12].includes(orderDetail.order_status)&&userInfo.identity==1" @click="handleCanacel">取消退款</div>
                    <div class="btn3 flex-content" v-if="[14].includes(orderDetail.order_status)&&userInfo.identity==2" @click="refunded">已退款</div>
                    <div class="btn3 flex-content" v-if="[15].includes(orderDetail.order_status)&&userInfo.identity==1" @click="refundedSure">确认已退款</div>
                   
                    <div class="btn2 flex-content" @click="closeFnc">关闭</div>
                </div>
            </div>
        </DirectiveDialog>

        <PreviewImg ref="previewImg" />

         <!-- 聊天 -->
         <Chats ref="chats" />
    </div>
</template>


<script>
// import clooectionMixins from '../clooectionMixins'
import DirectiveDialog from "@/components/DirectiveDialog/index";
import {  order_detail ,uploadImg,order_refund_argue,order_refund_examine,order_refunded,order_close_refund,order_confirm_refund} from '@/api/project'
import clipboard from '@/directive/clipboard/index.js'
import PreviewImg from "@/components/PreviewImg/index";
import { generateRandomString } from '@/utils/time'
import Chats from './CustomerService/index'
export default {
    // mixins:[clooectionMixins],
    props: {
        refName: {
            type: String,
            default: ''
        }
    },
    components: {
        DirectiveDialog,
        PreviewImg,
        Chats
    },
    directives: {
        clipboard
    },
    data() {
        return {
            countdown: '',
            dealer_refund_images:'',
            orderDetail: {},
            intervalId:null,
            sessionMsg: {}
        }
    },
    computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
    watch:{
        countdown(newValue,oldValue){
            console.log(newValue,oldValue)
            if(newValue=='00:01'){
                this.getDetail(this.orderDetail.order_id)
            }
        }
    },
    methods: {
        handleDialog(refName) {
            if (this.$refs[refName]) {
                this.$refs[refName].openDialog(this.orderDetail)
            }
        },
        getChat(orderId) {
            this.socketApi.sendSock({ method: "getChat", id: generateRandomString(), params: orderId },
                (res) => {
                    console.log(res, '---||')
                    if (res.code == 200) {
                        this.sessionMsg = res.data;
                    }
                }); //获取聊天信息
        },
        async refundedSure(){
            
            let res = await order_confirm_refund({ order_id: this.orderDetail.order_id });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                return
            }
            this.$message.error(res.msg)
        },
        async refunded(){
            let res = await order_refunded({ order_id: this.orderDetail.order_id,dealer_refund_images:this.dealer_refund_images });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                return
            }
            this.$message.error(res.msg)
        },
        async handleRefund(){
            let res = await order_refund_argue({ order_id: this.orderDetail.order_id });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                return
            }
            this.$message.error(res.msg)
        },
        async handleCanacel(){
            let res = await order_close_refund({ order_id: this.orderDetail.order_id });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                return
            }
            this.$message.error(res.msg)
        },
        async seeImg(url) {
            this.$refs.previewImg.previewImg(process.env.VUE_APP_FILE_URL + url)
        },
        async handleExamine(status){
            let res = await order_refund_examine({ order_id: this.orderDetail.order_id,result:status });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                return
            }
            this.$message.error(res.msg)
        },
        async httpRequest(files) {
            const formData = new FormData();
            formData.append("file", files.file);  //文件名
            let res = await uploadImg(formData)
            console.log(res, process.env.VUE_APP_FILE_URL)
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.dealer_refund_images = res.data
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
        clipboardSuccess() {
            this.$message.success('复制成功')
        },
        async getDetail(id) {
            let res = await order_detail(id);
            if (res.code == 200) {
                this.orderDetail = res.data;
                if(res.data.countdown>0){
                    this.startCountdown(res.data.countdown/60)
                }
                this.$refs.dialog.openDialog()
            }
        },
        clearIntervalFnc(){
            clearInterval(this.intervalId);
        },
        openDialog(row) {
            this.countdown = '';
            this.getDetail(row.order_id)
            clearInterval(this.intervalId);
            this.getChat(row.order_id)
        },
        startCountdown(minutes) {
            let seconds = minutes * 60;
            this.intervalId = setInterval(() => {
                const formattedMinutes = Math.floor(seconds / 60);
                const formattedSeconds = seconds % 60;

                const displayMinutes = formattedMinutes < 10 ? '0' + formattedMinutes : formattedMinutes;
                const displaySeconds = formattedSeconds < 10 ? '0' + formattedSeconds : formattedSeconds;

                // console.log(`${displayMinutes}:${displaySeconds}`);
                this.countdown = `${displayMinutes}:${displaySeconds}`;
                // if (seconds === 0) {
                if (this.countdown == '00:00') {
                    clearInterval(this.intervalId); // 倒计时结束，清除定时器
                    this.seconds = ''
                    console.log('倒计时结束');
                } else {
                    seconds--;

                }
            }, 1000); // 每秒执行一次
        },
        closeFnc() {
            this.$refs.dialog.close()
            this.$emit('closeDialog', this.refName)
        },
    }
}
</script>


<style lang="scss" scoped>
::v-deep .el-input__inner {
    border: 1px solid white;
    height: 100%;
}

::v-deep .el-input-group__append {
    background: #F5F7FA;
    border: none;
    color: #3D64F4;
    cursor: pointer;
}

::v-deep .el-input {
    height: 100%;
}

.flex-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    width: 100%;
    padding-left: 5px;
    // padding-right: 20px;
    padding: 13px 25px;

    .message {
        color: #2C2F37;
        font-size: 14px;
        margin-bottom: 36px;

        .num {
            color: #FF5C0C;
        }
    }

    .form {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .flex-row {
            width: 45%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .form-item,
        .form-items {
            width: 45%;
            display: flex;
            flex-direction: row;
            margin-bottom: 49px;

            // align-content: flex-start;
            // align-self: flex-start;
            .form-item-title {
                width: 115px;
                height: 42px;
                border: 1px solid #F1F1F1;
                font-size: 14px;
                color: #333333;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }

            .form-item-see {
                color: #597FEE;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                border-left: none;
            }

            .form-item-chat {
                background-color: #F4B63F;
                color: white;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                border-left: none;
                position: relative;

                .chat_icon {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background-color: #FF5C0C;
                    box-sizing: border-box;
                    // padding: 3px 7px;
                    border-radius: 50%;
                    line-height: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .form-item-right {
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;

                .form-item-right-input {
                    height: 42px;
                    box-sizing: border-box;
                    border-top: 1px solid #F1F1F1;
                    border-bottom: 1px solid #F1F1F1;
                    border-right: 1px solid #F1F1F1;
                    // padding: 14px 20px;
                    margin-bottom: 12px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    span {
                        padding-left: 21px;
                        color: #333333;
                        font-size: 14px;
                    }
                }

                .form-item-right-label {
                    color: #8E8E8E;
                    font-size: 14px;
                }

            }
        }

        .form-items {
            width: 45%;
        }

        .form-text {
            width: 100%;
            color: #333333;
            font-size: 14px;
            padding-left: 30px;

            .title {
                margin-right: 70px;
            }
        }
    }

    .submit-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin-top: 30px;

        div {
            margin: 0 10px;
        }

        .btn1 {
            width: 120px;
            height: 42px;
            border: 1px solid #F1F1F1;
            background: linear-gradient(90deg, #5A80EE 0%, #3D63F4 100%);
            border-radius: 6px;
            color: white;

        }

        .btn2 {
            width: 120px;
            height: 42px;
            background: #F7F9FA;
            border: 2px solid #597FEE;
            border-radius: 6px;
            color: #3E64F4;
        }

        .btn3 {
            width: 120px;
            height: 42px;
            background-color: #F1F1F1;
            color: #7B7B7F;
            border-radius: 6px;
        }
    }

    // background-color: red;
}
</style>