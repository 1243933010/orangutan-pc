<template>
    <div class="content">
        <div class="form">
            <div class="form-item">
                <div class="form-item-title"><span>收款金额</span></div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input v-model="form.order_money" /></div>
                    <div class="form-item-right-label"><span>注：收款汇率: {{+collectionObj.rate}}%</span></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">可得</div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input :disabled="true" v-model="collectionObj.real_amout" /></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">支付方式</div>
                <div class="form-item-right">
                    <div class="form-item-right-input">
                        <el-input v-model="collectionObj.channel" :disabled="true" />
                        <!-- <el-select v-model="collectionObj.return_method" placeholder="请选择" style="width: 100%;height: 100%;">
                            <el-option label="papay" value="0"></el-option>
                        </el-select> -->
                    </div>
                    <div class="form-item-right-label"><span>注：支持亲密付、商业付</span></div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">商家名称</div>
                <div class="form-item-right">
                    <div class="form-item-right-input"><el-input :disabled="true" v-model="collectionObj.dealers_name" />
                    </div>
                </div>
            </div>
            <div class="form-item">
                <div class="form-item-title">规定支付时长</div>
                <div class="form-item-right">
                    <div class="form-item-right-input">
                        <el-input :disabled="true" v-model="collectionObj.pay_len" />
                        <!-- <el-select v-model="collectionObj.pay_len" placeholder="请选择" style="width: 100%;height: 100%;">
                            <el-option label="10分钟" value="0"></el-option>
                        </el-select> -->
                    </div>
                </div>
            </div>
            <div class="form-text">
                <span class="title">商家留言</span>
                <span class="label">{{ collectionObj.remark }}</span>
            </div>
        </div>
        <div class="submit-btn">
            <div class="btn1 flex-content" @click="handleSubmit">确认发起</div>
            <div class="btn2 flex-content" @click="closeFnc">再想想</div>
        </div>
    </div>
</template>


<script>
import clooectionMixins from '../clooectionMixins'
import { collection_submit } from '@/api/project'

export default {
    // mixins: [clooectionMixins],
    props:{
        collectionObj:{
            type:Object,
            default:()=>{}
        }
    },
    data() {
        return {
            form: {
                order_money: ''
            },
            
        }
    },
    methods: {
        async handleSubmit() {
           
            if(!this.form.order_money){
                this.$message.error('请输入金额')
                return
            }
            let res = await collection_submit({ payment_id:this.collectionObj.payment_id, order_money: this.form.order_money });
            if (res.code == 200) {
            this.$message.success(res.msg)
            this.$emit('closeDialog')
            return
          }
          this.$message.error(res.msg)
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
    box-sizing: border-box;
    padding: 34px 22px;

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
    }

    // background-color: red;
}</style>