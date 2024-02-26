<template>
    <div>
        <DirectiveDialog ref="dialog"  :refName="refName">

            <div class="content">
                <div class="message" v-if="orderDetail.order_status==0">订单发起合作，请在：<span class="num">{{ countdown }}秒 </span>内完成确认，超时将取消订单</div>
                <div class="message" v-if="orderDetail.order_status==1">订单已取消，很抱歉没能合作成功，可查看聊天记录，看看问题出在哪里</div>
                <div class="message" v-if="orderDetail.order_status==2">订单已确认合作，等待对方付款，订单将在：<span class="num">{{ countdown }}秒 </span>后取消</div>
                
                

                <div class="form">
                    <div class="form-item">
                        <div class="form-item-title">订单状态</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input :disabled="true"
                                    v-model="orderDetail.order_status_name" /></div>
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
                            <div class="form-item-right-label"><span>注：收款汇率: {{+orderDetail.rate }}%</span></div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">规定支付时长</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input :disabled="true" v-model="orderDetail.pay_len" />
                            </div>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">支付方式</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input">
                                <el-input v-model="orderDetail.channel" :disabled="true" />
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
                            <div class="form-item-title">联系对方</div>
                            <div class="form-item-title form-item-chat" :class="orderDetail.order_status==1?'disabled':''"  @click="handleDialog('chats')">
                                聊天
                                <span class="chat_icon" v-if="sessionMsg.is_read > 0">{{ sessionMsg.is_read }}</span>
                                <!-- <span class="chat_icon">3</span> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="submit-btn">
                    <div class="btn1 flex-content"  v-if="orderDetail.order_status==0" @click="handleSubmit">确认合作</div>
                    <div class="btn3 flex-content"  v-if="orderDetail.order_status==0" @click="handleCancel">取消合作</div>

                    <div class="btn2 flex-content" @click="closeFnc">关闭</div>
                </div>
            </div>
        </DirectiveDialog>

         <!-- 聊天 -->
         <Chats ref="chats" />
    </div>
</template>


<script>
import DirectiveDialog from "@/components/DirectiveDialog/index";
import { order_submit, order_detail,order_cancel  } from '@/api/project'
import { generateRandomString } from '@/utils/time'
import Chats from './CustomerService/index'
export default {
    // mixins: [clooectionMixins],
    components: {
        DirectiveDialog,
        Chats
    },
    props: {
        statusList: {
            type: Array,
            default: () => []
        },
        refName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            form: {
                order_money: ''
            },
            countdown: '',
            orderDetail: {},
            intervalId:null,
            sessionMsg: {}
            // collectionObj:{}

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
        clearIntervalFnc(){
            clearInterval(this.intervalId);
        },
        async getDetail(id) {
            let res = await order_detail(id);
            if (res.code == 200) {
                this.orderDetail = res.data;
                if(res.data.countdown>0){
                    this.startCountdown(res.data.countdown/60)
                }
                // this.startCountdown(res.data.pay_len)
                this.$refs.dialog.openDialog()
            }
        },
        openDialog(row) {
            this.countdown = '';
            clearInterval(this.intervalId);
            this.getDetail(row.order_id)
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
        async handleSubmit() {
            let res = await order_submit({ order_id: this.orderDetail.order_id });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                // this.$refs.dialog.close()
                // this.$emit('closeDialog')
                return
            }
            this.$message.error(res.msg)
        },
        async handleCancel() {
            const res = await order_cancel({ order_id: this.orderDetail.order_id })
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDetail(this.orderDetail.order_id)
                // this.$refs.dialog.close()
                // this.$emit('closeDialog')
                return
            }
            this.$message.error(res.msg)
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
    box-sizing: border-box;
    padding: 34px 22px;

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

        .form-item {
            width: 45%;
            display: flex;
            flex-direction: row;
            margin-bottom: 56px;

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
            }

            .form-item-right {
                display: flex;
                flex-grow: 1;
                flex-direction: column;

                .form-item-right-input {
                    height: 42px;
                    box-sizing: border-box;
                    border-top: 1px solid #F1F1F1;
                    border-bottom: 1px solid #F1F1F1;
                    border-right: 1px solid #F1F1F1;
                    // padding: 14px 20px;
                    margin-bottom: 12px;
                }

                .form-item-right-label {
                    color: #8E8E8E;
                    font-size: 14px;
                }

            }
        }

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
            .disabled{
                background: #A6AEB9 !important;
                color: #F1F1F1 !important;
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
        margin-top: 120px;

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
            background: #F1F1F1;
            // border: 2px solid #597FEE;
            border-radius: 6px;
            color: #7B7B7F;
        }
    }

    // background-color: red;
}</style>