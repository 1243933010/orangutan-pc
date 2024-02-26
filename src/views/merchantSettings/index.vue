<template>
    <div>
        <div class="setting">
            <div class="box">
                <div class="head-img">
                    <div class="img">
                        <img src="@/assets/user_icon.png" alt="">
                        <div class="status"><span>在线</span></div>
                    </div>
                    <div class="name" @click="openDialog('headImg')"><span>公牛商行</span>
                        <img src="../../assets/edit.png" alt="">
                        <!-- <i style="font-size: 13px; color: #466CF2;" class="el-icon-edit"></i> -->
                    </div>
                </div>
                <div class="message">
                    <div class="message-left">
                        <div class="item">
                            <div class="label"><span>手机号码：18800008888</span></div>
                            
                        </div>
                        <div class="item">
                            <div class="label"><span>收款汇率：10%</span></div>
                            <div class="right" @click="openDialog('rate')"><span>设置</span></div>
                        </div>
                        <div class="item">
                            <div class="label"><span>规定支付时长：10分钟</span></div>
                            <div class="right" @click="openDialog('time')"><span>设置</span></div>
                        </div>
                        <div class="item">
                            <div class="label"><span>已开通收款渠道：</span>
                                <img class="img1" src="../../assets/Paypal.png" alt=""> 
                                <img class="img2" src="../../assets/Visa.png" alt=""> </div>
                        </div>
                    </div>
                    <div class="message-right">
                        <div class="message-right-label">
                            <span>注册时间：</span>
                            <span>当前保证金：</span>
                            <span>收款状态：</span>
                        </div>
                        <div class="message-right-value">
                            <div class="message-right-value-index">
                                <div class="text">2021-12-12</div>
                            </div>
                            <div class="message-right-value-index">
                                <div class="text yellow">20,000.0000</div>
                                <div class="value" @click="$router.push({path:'/rechargeOrder/rechargeOrder'})">充值</div>
                            </div>
                            <div class="message-right-value-index">
                                <div class="bk" :class="{active: tabTag}" @click="tabTag = !tabTag">
                                    <span class="text">已启用</span>
                                    <span class="text">关闭</span>
                                    <div class="silder"></div>
                                </div>
                                
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <Dialog ref="dialog" @getMessage="getMessage" />
    </div>
</template>



<script>
import Dialog from './Dialog.vue'
export default{
    components:{Dialog},
    data(){
        return{
            tabTag: false
        }
    },
    methods:{
        openDialog(type){
            this.$refs.dialog.loadForm(type)
        },
        getMessage(){
            console.log('111111')
        }
    }
}
</script>


<style lang="scss" scoped>
.setting{
    width: 100%;
    background-color: white;
    border-radius: 10px;
    padding: 38px 0 38px 98px;
    .box{
        display: flex;
        flex-direction: row;
        .head-img{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 92px;
            .img{
                position: relative;
                margin-bottom: 15px;
                img{
                    width: 78px;
                    border-radius: 50%;
                }
                .status{
                    position: absolute;
                    left: 15px;
                    bottom: 0;
                    background: linear-gradient( 180deg, #FF7C38 0%, #FF3729 100%);
                    border-radius: 6px 6px 6px 6px;
                    color: white;
                    font-size: 10px;
                    box-sizing: border-box;
                    width: 50px;
                    height: 18px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    // padding: 4px 15px;
                }
            }
            .name{
                display: flex;
                align-items: center;
                cursor: pointer;
                span{
                    color: #2C2C37;
                    font-size: 15px;
                    margin-right: 5px;
                    font-weight: 600;
                }
                img{
                    width: 18px;
                }
            }
        }
        .message{
            display: flex;
            flex-direction: row;
            .message-left{
                display: flex;
                flex-direction: column;
                margin-right: 65px;
                max-width: 250px;
                .item{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 18px;
                    justify-content: space-between;
                    .label{
                        color: #2C2C37;
                        font-size: 14px;
                       span{
                        line-height: 16px;
                       }
                        .img1{
                            width: 55px;
                            margin-right: 14px;
                        }
                        .img2{
                            width: 37px;
                        }
                    }
                    .right{
                        color: #466CF2;
                        font-size: 14px;
                        cursor: pointer;
                    }
                }
            }
            .message-right{
                display: flex;
                flex-direction: row;
                .message-right-label{
                    display: flex;
                    flex-direction: column;
                    max-width: 150px;
                    margin-right: 15px;
                    span{
                        color: #2C2C37;
                        font-size: 14px;
                        margin-bottom: 18px;
                    }
                }
                .message-right-value{
                    .message-right-value-index{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 18px;
                    .text{
                        color: #2C2C37;
                        font-size: 14px;
                    }
                    .yellow{
                        color: #FF560C;
                        font-weight: 600;
                        margin-right: 14px;
                    }
                    .value{
                        color: #466CF2;
                        font-size: 12px;
                        cursor: pointer;
                    }
                    .bk{
                        position: relative;
                        background-color: #2C2C37;
                        border-radius: 6px;
                        width: 100px;
                        height: 28px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        cursor: pointer;

                        span {
                            width: 50%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: white;
                            font-size: 10px;

                            &.text {
                                position: relative;
                                z-index: 1;
                            }
                        }
                        .silder{
                            width: 50%;
                            height: 100%;
                            position: absolute;
                            left: 0;
                            top: 0;
                            background-color: #FF560C;
                            border-radius: 6px;
                            transition: left .35s ease-in-out;
                        }

                        &.active {
                            .silder {
                                left: 50%;
                            }
                        }
                    }
                    }

                }
                
            }
        }
    }
}
</style>