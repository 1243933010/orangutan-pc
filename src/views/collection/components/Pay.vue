<template>
    <div class="content">
        <div class="message">订单已付款，等待对方确认，订单将在：<span class="num">{{ countdown }}秒 </span>后自动确认</div>
        <div class="form">
            <div class="form-item">
                <div class="form-item-title">订单状态</div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><span>已付款</span></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">商家名称</div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input v-model="form.value" /></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title"><span>收款金额</span></div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input v-model="form.value" /></div>
                    <div class="form-item-right-label"><span>注：收款汇率: 10%;收款费用: 200.0000</span></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">规定支付时长</div>
                <div class="form-item-right">
                    <div class="form-item-right-input">
                        <el-select v-model="form.value" placeholder="请选择" style="width: 100%;height: 100%;">
                            <el-option label="10分钟" value="0"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">支付方式</div>
                <div class="form-item-right">
                    <div class="form-item-right-input">
                        <el-select v-model="form.value" placeholder="请选择" style="width: 100%;height: 100%;">
                            <el-option label="papay" value="0"></el-option>
                        </el-select>
                    </div>
                    <div class="form-item-right-label"><span>注：支持亲密付、商业付</span></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">商家留言</div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input v-model="form.text" /></div>
                </div>
            </div>
            <div class="flex-row">
                <div class="form-items">
                    <div class="form-item-title">付款证明</div>
                    <div class="form-item-title form-item-see">查看附件</div>
                </div>
                <!-- <el-badge :value="3"> -->
                    <div class="form-items">
                        <div class="form-item-title">联系对方</div>
                        <div class="form-item-title form-item-chat">
                            聊天
                            <span class="chat_icon">3</span>
                        </div>
                    </div>
                <!-- </el-badge> -->
            </div>
            <div class="form-item">
                <div class="form-item-title"><span>钱包地址</span></div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input v-model="form.value" /></div>
                </div>
            </div>
        </div>
        <div class="submit-btn">
            <div class="btn1 flex-content">我已收款</div>

            <div class="btn3 flex-content" @click="closeFnc">发起争议</div>

            <div class="btn2 flex-content" @click="closeFnc">关闭</div>
        </div>
    </div>
</template>


<script>
// import clooectionMixins from '../clooectionMixins'
export default {
    // mixins:[clooectionMixins],
    data() {
        return {
            countdown: '',
            form: {
                value: '',
                text: '必须使用本人实名账号，转账时请不要备注任何信息。比如: 仿牌'
            }
        }
    },
    mounted() {
        this.startCountdown(10)
    },
    methods: {
        startCountdown(minutes) {
            let seconds = minutes * 60;
            const intervalId = setInterval(() => {
                const formattedMinutes = Math.floor(seconds / 60);
                const formattedSeconds = seconds % 60;

                const displayMinutes = formattedMinutes < 10 ? '0' + formattedMinutes : formattedMinutes;
                const displaySeconds = formattedSeconds < 10 ? '0' + formattedSeconds : formattedSeconds;

                // console.log(`${displayMinutes}:${displaySeconds}`);
                this.countdown = `${displayMinutes}:${displaySeconds}`;
                if (seconds === 0) {
                    clearInterval(intervalId); // 倒计时结束，清除定时器
                    this.seconds = ''
                    console.log('倒计时结束');
                } else {
                    seconds--;

                }
            }, 1000); // 每秒执行一次
        },
        closeFnc() {
            this.$emit('closeDialog')
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
                .chat_icon{
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
        .btn3{
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