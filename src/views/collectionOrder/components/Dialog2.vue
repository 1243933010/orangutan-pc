<template>
    <div class="content">
        <div class="shop-detail">
            <div class="shop-detail-user">

                <div class="img">
                    <img src="../../../assets/close_icon.png" alt="">
                </div>
                <div class="text">
                    <div class="top">
                        <div class="name"><span>顺丰商行</span></div>
                        <div class="status-img"><img src="../../../assets/online.png" alt=""></div>
                        <div class="status-text"><span>在线</span></div>
                    </div>
                    <div class="center">
                        <div class="text1"><span>注册时间: 2021-12-12</span></div>
                        <div class="text1">|</div>
                        <div class="text2"><span class="label">收款汇率: </span><span class="value">10%</span></div>
                        <div class="text1">|</div>
                        <div class="text3"><span class="label">当前保证金：</span><span class="value">20,000.0000</span></div>
                    </div>
                    <div class="bottom">
                        <div class="authentication">
                            <img src="../../../assets/authentication_icon.png" alt="">
                            <span>已认证商家</span>
                        </div>
                        <div class="channel">
                            <span>收款渠道: </span>
                            <span class="value">PayPal、Visa</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shop-detail-between ">
                <div class="title">
                    <div><span>近30天成交信息</span></div>
                </div>
                <div class="content">
                    <div class="item">
                        <div class="label"><span>20,000.0000</span></div>
                        <div class="value"><span>收款金额</span></div>
                    </div>
                    <div class="item">
                        <div class="label"><span>20,0</span></div>
                        <div class="value"><span>成交订单</span></div>
                    </div>
                    <div class="item">
                        <div class="label"><span>20</span></div>
                        <div class="value"><span>成交率</span></div>
                    </div>
                    <div class="item">
                        <div class="label"><span>66</span></div>
                        <div class="value"><span>成交客户</span></div>
                    </div>
                </div>
            </div>
            <div class="shop-detail-history shop-detail-between">
                <div class="title">
                    <div><span>历史成交信息</span></div>
                </div>
                <div class="content">
                    <div class="item">
                        <div class="label"><span>20,000.0000</span></div>
                        <div class="value"><span>收款金额</span></div>
                    </div>
                    <div class="item">
                        <div class="label"><span>20,0</span></div>
                        <div class="value"><span>成交订单</span></div>
                    </div>
                    <div class="item">
                        <div class="label"><span>20</span></div>
                        <div class="value"><span>成交率</span></div>
                    </div>
                    <div class="item">
                        <div class="label"><span>66</span></div>
                        <div class="value"><span>成交客户</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="submit-btn">
            <div class="btn1 flex-content">发起收款</div>
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
            form: {
                value: ''
            }
        }
    },
    methods: {
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
    padding: 34px 22px;
    .shop-detail {
        width: 100%;

        .shop-detail-user {
            width: 100%;
            background-color: white;
            box-sizing: border-box;
            padding: 22px 25px;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;

            .img {
                margin-right: 10px;

                img {
                    width: 50px;
                    height: 50px;
                }
            }

            .text {
                display: flex;
                flex-direction: column;

                .top {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 13px;

                    .name {
                        color: #333333;
                        font-size: 16px;
                        margin-right: 6px;
                    }

                    .status-img {
                        width: 17px;
                        height: 14px;
                        margin-right: 8px;
                    }

                    .status-text {
                        color: #597FEE;
                        font-size: 12px;
                    }
                }

                .center {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 12px;
                    color: #8590A1;

                    .text1,
                    .text2,
                    .text3 {
                        margin-right: 10px;

                        .value {
                            color: #F47A18;
                        }
                    }
                }

                .bottom {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .authentication,
                    .channel {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        color: #8590A1;
                        font-size: 12px;
                        margin-right: 78px;

                        img {
                            width: 16px;
                            height: 15px;
                            margin-right: 8px;
                        }

                        .value {
                            color: #0574F9;
                            padding-left: 3px;
                        }
                    }

                    .channer {
                        margin-right: 0px;
                    }
                }
            }
        }

        .shop-detail-between {
            width: 100%;
            background-color: white;
            box-sizing: border-box;
            padding: 22px 25px;
            border-radius: 10px;
            margin-bottom: 10px;

            .title {
                margin-bottom: 30px;

                div {
                    border-left: 3px solid #597FEE;
                    padding-left: 3px;
                    color: #333333;
                    font-size: 14px;
                    // position: relative;
                }
                &::after{
                    content:'';
                    height: 100%;
                    width: 3px;
                    background-color: red;
                    // position: absolute;
                    // top: 0;
                }
            }

            .content {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .item {
                    text-align: center;

                    .label {
                        color: #333333;
                        font-size: 16px;
                        margin-bottom: 7px;
                    }

                    .value {
                        color: #8590A1;
                        font-size: 12px;
                    }
                }
            }
        }

        // background-color: red;
    }

    .form {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

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
        margin-top: 23px;

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
    }

    // background-color: red;
}</style>