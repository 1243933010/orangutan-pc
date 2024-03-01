<template>
    <div>
        <div class="setting">
            <div class="box">
                <div class="head-img">
                    <div class="img">
                        <img src="@/assets/user_icon.png" alt="">
                        <div class="status"><span>在线</span></div>
                    </div>
                    <div class="name" @click="openDialog('headImg')"><span>{{ dealersInfo.dealers_name }}</span>
                        <img src="../../assets/edit.png" alt="">
                        <!-- <i style="font-size: 13px; color: #466CF2;" class="el-icon-edit"></i> -->
                    </div>
                </div>
                <div class="message">
                    <div class="message-left">
                        <div class="item">
                            <div class="label"><span>手机号码：{{ dealersInfo.mobile }}</span></div>

                        </div>
                        <!-- <div class="item">
                            <div class="label"><span>收款汇率：{{ dealersInfo.rate }}­‰</span></div>
                            <div class="right" @click="openDialog('rate')"><span>设置</span></div>
                        </div> -->
                        <div class="item">
                            <div class="label"><span>规定支付时长：{{ dealersInfo.pay_time }}分钟</span></div>
                            <div class="right" @click="openDialog('time')"><span>设置</span></div>
                        </div>
                        <div class="item">
                            <div class="label"><span>已开通收款渠道：</span>
                                <img v-if="dealersInfo.channel.includes('paypal')" class="img1"
                                    src="../../assets/Paypal.png" alt="">
                                <img v-if="dealersInfo.channel.includes('visa')" class="img2" src="../../assets/Visa.png"
                                    alt="">
                            </div>
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
                                <div class="text">{{ convertTimestampToDateString(dealersInfo.created_at) }}</div>
                            </div>
                            <div class="message-right-value-index">
                                <div class="text yellow">{{ dealersInfo.earnest_money || 0 }}</div>
                                <div class="value" @click="$router.push({ path: '/rechargeOrder/rechargeOrder' })">充值</div>
                            </div>
                            <div class="message-right-value-index">
                                <div class="bk" :class="{ active: tabTag }" @click="handleStatus">
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

        <div>
            <div class="add-btn">
                <el-button type="primary" class="add-address-btn" @click="openDialog1('添加收款地址')">
                    <i class="el-icon-plus" />添加</el-button>
            </div>
            <div class="tab-pane-container" style="border-radius: 10px; text-align: center">
                <el-table height="100%" :data="receivingAddressList" style="width: 100%">
                    <el-table-column prop="channel" label="渠道类型">
                        <!-- <template slot-scope="scope">
                <span>{{ scope.row.channel }}</span>
              </template> -->
                    </el-table-column>
                    <!-- <el-table-column prop="use_type" label="渠道用途">
                        <template slot-scope="scope">
                            <span v-if="scope.row.use_type == 1">收款</span>
                            <span v-if="scope.row.use_type == 2">提现</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="account_name" label="账号名称" />

                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <!-- <el-tag :type="scope.row.stateTag" disable-transitions>{{
                  scope.row.stateLabel
                }}</el-tag> -->
                            <span v-if="scope.row.status == 1">启用</span>
                            <span v-if="scope.row.status == 0">禁用</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="account" label="收款地址" />
                    <el-table-column prop="rate" label="汇率" />
                    <el-table-column prop="rate" label="收款金额区间">
                        <template slot-scope="scope">
                            <span>{{ scope.row.min_money }}-{{ scope.row.max_money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rate" label="汇率" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button type="primary" plain @click="openDialog1('编辑收款地址', scope.row)">编辑</el-button> -->
                            <span style="color: #466CF2;" @click="openDialog1('编辑收款地址', scope.row)">编辑</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div class="pagination">
                    <el-pagination :current-page="paymentChannelObj.page" :page-sizes="[10, 20, 30, 40]"
                        :page-size="paymentChannelObj.limit" layout="total, sizes, prev, pager, next, jumper"
                        :total="paymentChannelObj.total" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div> -->
            </div>
        </div>
        <Dialog ref="dialog" @getMessage="getMessage" />


        <!-- 编辑收款地址 -->
        <DirectiveDialog ref="directiveDialogRef1" :title="dialogTit">
            <AddressForm ref="addressFormRef" :close-dialog="closeDialog" :get-dialog-data="getDialogData"
                :address-info="checkedAddress" />
        </DirectiveDialog>
    </div>
</template>



<script>
import Dialog from './Dialog.vue'
import { dealers_info, update_info, payment_channel } from '@/api/project'
import { convertTimestampToDateString } from '@/utils/time'
import AddressForm from './components/addressForm'
import DirectiveDialog from '@/components/DirectiveDialog/index'
export default {
    components: { Dialog, AddressForm, DirectiveDialog },
    data() {
        return {
            tabTag: false,
            dealersInfo: {},
            convertTimestampToDateString: null,
            receivingAddressList: [],
            paymentChannelObj: {
                page: 1,
                limit: 10,
                total: 10
            },
        }
    },
    mounted() {
        this.getDealersInfo();
        this.convertTimestampToDateString = convertTimestampToDateString;
        this.paymentChannel(true)
    },
    methods: {
        async getDialogData(data) {
            // console.log(data);
            let fnc = payment_channel_submit
            if (data.payment_id) {
                fnc = payment_channel_edit
            }

            const res = await fnc(data)

            // console.log(res)
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.paymentChannel(true)
                return
            }
            this.$message.error(res.msg)
            // 保存后的数据 data
        },
        closeDialog() {
            console.log('1111')
            this.$refs.directiveDialogRef1.close()
        },
        async paymentChannel(bool = false) {
            if (bool) {
                this.paymentChannelObj.page = 1
            }
            const res = await payment_channel(this.paymentChannelObj)
            if (res.code == 200) {
                this.receivingAddressList = res.data.data
                this.paymentChannelObj.total = res.data.total
            }
        },
        openDialog1(dialogTit, data = undefined) {
            this.dialogTit = dialogTit
            this.checkedAddress = data
            this.$refs.directiveDialogRef1.openDialog(data)
            this.$nextTick(() => {
                this.$refs.addressFormRef?.openDialog(data);
            })
        },
        async handleStatus() {
            console.log(this.tabTag, this.dealersInfo)
            let res = await update_info({ payment_status: this.dealersInfo.payment_status == 0 ? 1 : 0 })
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.getDealersInfo()
                return
            }
            this.$message.error(res.msg)
        },
        async getDealersInfo() {
            let res = await dealers_info();
            if (res.code == 200) {
                this.dealersInfo = res.data;
                this.tabTag = !Boolean(res.data.payment_status)
            }
        },
        openDialog(type) {
            this.$refs.dialog.loadForm(type)
        },
        getMessage() {
            console.log('111111')
        }
    }
}
</script>


<style lang="scss" scoped>
.add-btn{
    width: 100%;
    margin: 35px 0 19px 0;
    padding-right: 30px;
    display: flex;
    flex-direction: row;
    flex-direction: row-reverse;

    ::v-deep .el-button{
        background: #466CF2;
        border-radius: 10px;
    }
    
}
.setting {
    width: 100%;
    background-color: white;
    border-radius: 10px;
    padding: 38px 0 38px 98px;

    .box {
        display: flex;
        flex-direction: row;

        .head-img {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 92px;

            .img {
                position: relative;
                margin-bottom: 15px;

                img {
                    width: 78px;
                    border-radius: 50%;
                }

                .status {
                    position: absolute;
                    left: 15px;
                    bottom: 0;
                    background: linear-gradient(180deg, #FF7C38 0%, #FF3729 100%);
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

            .name {
                display: flex;
                align-items: center;
                cursor: pointer;

                span {
                    color: #2C2C37;
                    font-size: 15px;
                    margin-right: 5px;
                    font-weight: 600;
                }

                img {
                    width: 18px;
                }
            }
        }

        .message {
            display: flex;
            flex-direction: row;

            .message-left {
                display: flex;
                flex-direction: column;
                margin-right: 65px;
                max-width: 250px;

                .item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 18px;
                    justify-content: space-between;

                    .label {
                        color: #2C2C37;
                        font-size: 14px;

                        span {
                            line-height: 16px;
                        }

                        .img1 {
                            width: 55px;
                            margin-right: 14px;
                        }

                        .img2 {
                            width: 37px;
                        }
                    }

                    .right {
                        color: #466CF2;
                        font-size: 14px;
                        cursor: pointer;
                    }
                }
            }

            .message-right {
                display: flex;
                flex-direction: row;

                .message-right-label {
                    display: flex;
                    flex-direction: column;
                    max-width: 150px;
                    margin-right: 15px;

                    span {
                        color: #2C2C37;
                        font-size: 14px;
                        margin-bottom: 18px;
                    }
                }

                .message-right-value {
                    .message-right-value-index {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-bottom: 18px;

                        .text {
                            color: #2C2C37;
                            font-size: 14px;
                        }

                        .yellow {
                            color: #FF560C;
                            font-weight: 600;
                            margin-right: 14px;
                        }

                        .value {
                            color: #466CF2;
                            font-size: 12px;
                            cursor: pointer;
                        }

                        .bk {
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

                            .silder {
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