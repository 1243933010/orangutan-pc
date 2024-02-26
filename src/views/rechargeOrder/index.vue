<template>
  <div class="home-container">
    <div class="main">
      <div class="bk">
        <div class="item">
          <div class="val">
            <div class="num"><span>{{ fundData.balance_money }}</span></div>
            <div class="label"><span>账户余额</span></div>
          </div>
          <div class="button">
            <div class="btn1" @click="handleRecharge"><span>充值</span></div>
            <div class="btn2" @click="handleWithdrawal"><span>提现</span></div>
          </div>
        </div>
        <div class="item item1">
          <div class="val">
            <div class="num"><span>{{ fundData.forzen_money }}</span></div>
            <div class="label"><span>冻结余额</span></div>
          </div>
        </div>
        <div class="item item2">
          <div class="val">
            <div class="num"><span>{{ fundData.income_money }}</span></div>
            <div class="label"><span>收益余额</span></div>
          </div>
        </div>
      </div>
      <div class="context">
        <div class="form">

          <div class="form-item">
            <el-select v-model="formData.keyword_type" placeholder="充值单号" style="width: 120px;">
              <el-option label="默认" :value="0" />
              <el-option label="充值单号" :value="1" />
              <el-option label="交易哈希" :value="2" />
            </el-select>
          </div>
          <div class="form-item"><el-input v-model="formData.keyword" type="text" placeholder="请输入......" /></div>
          <div class="form-item">
            <el-select v-model="formData.status" placeholder="充值状态" style="width: 120px;">
              <el-option label="等待中" :value="0" />
              <el-option label="充值成功" :value="1" />
              <el-option label="订单取消 " :value="2" />
              <el-option label="订单失效" :value="3" />
            </el-select>
          </div>
          <div class="form-item">
            <el-select v-model="value" placeholder="创建时间" style="width: 120px;">
              <el-option label="创建时间" :value="1" />
              <!-- <el-option label="否" :value="0" /> -->
            </el-select>
          </div>
          <div class="form-item">
            <!-- <el-date-picker v-model="value" value-format="yyyy-MM-dd HH-mm-ss" type="datetime"
              placeholder="选择日期时间" /> -->
            <el-date-picker v-model="formData.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="form-item submit" @click="getRechargeList(true)"><span>搜索</span></div>
          <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" center>
            <el-table-column prop="status" label="充值状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">等待中</span>
                <span v-if="scope.row.status == 1">充值成功</span>
                <span v-if="scope.row.status == 2">订单取消</span>
                <span v-if="scope.row.status == 3">订单失效</span>
              </template>
            </el-table-column>
            <el-table-column prop="money" label="充值金额">
            </el-table-column>
            <el-table-column prop="recharge_no" label="收款地址">
            </el-table-column>
            <el-table-column prop="transfer_hash" label="交易HASH">
            </el-table-column>
            <el-table-column prop="pay_time" label="交易时间">
              <template slot-scope="scope">
                <span>{{ convertTimestampToDateString(scope.row.pay_time) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="formData.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="formData.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="formData.total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 充值弹窗 -->
    <DirectiveDialog ref="recharge" title="充值" :width="700">
      <div class="dialog-box">
        <div class="form">
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>充值金额</span></div>
              <div class="form-item-input"><el-input v-model="rechargeForm.amount" @input="changeNum" /></div>
            </div>
            <div class="form-item-right">
              <div class="form-item-button" @click="rechargeGenerate"><span>生成充值信息</span></div>
              <!-- <div class="form-item-right-input"><el-input v-model="form.value" /></div> -->
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>充值单号</span></div>
              <div class="form-item-input"><el-input v-model="rechargeForm.recharge_no" /></div>
            </div>
            <div class="form-item-right">
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>钱包地址</span></div>
              <div class="form-item-input"><el-input v-model="rechargeForm.url" /></div>
            </div>
            <div class="form-item-right">
              <div class="form-item-button" v-copy="`${rechargeForm.url}`"><span>复制</span></div>
            </div>
          </div>
          <div class="form-item form-item1">
            <div class="info color"><span>温馨提示：</span></div>
            <div class="info "><span>为避免出现支付异常，请按照充值金额支付</span></div>
          </div>

        </div>
        <div class="submit-btn">
          <div class="btn1 flex-content"  @click="closeFnc">我已充值</div>
          <div class="btn2 flex-content" @click="closeFnc">再想想</div>
        </div>
      </div>
    </DirectiveDialog>


    <!-- 提现弹窗 -->
    <DirectiveDialog ref="withdrawal" title="提现" :width="700">
      <div class="dialog-box">
        <div class="form">
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>网络协议:</span></div>
              <div class="form-item-input"><el-input v-model="withdrawalForm.agreement" /></div>
            </div>
            <div class="form-item-right">
              <!-- <div class="form-item-button"><span>生成充值信息</span></div> -->
              <!-- <div class="form-item-right-input"><el-input v-model="form.value" /></div> -->
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>收款地址:</span></div>
              <div class="form-item-input"><el-select v-model="withdrawalForm.payment_id" placeholder="请选择">
                  <el-option v-for="(item,index) in receivingAddressList" :key="index" :label="item.url" :value="item.payment_id">
                  </el-option>
                </el-select></div>
            </div>
            <div class="form-item-right">
              <div class="form-item-button"><span>添加收款地址</span></div>
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>提现金额:</span></div>
              <div class="form-item-input"><el-input v-model="withdrawalForm.amount" placeholder="" /></div>
            </div>
            <div class="form-item-right">
              <!-- <div class="form-item-button"><span>复制</span></div> -->
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>手机验证码:</span></div>
              <div class="form-item-input"><el-input v-model="withdrawalForm.code" placeholder="请输入验证码" /></div>
            </div>
            <div class="form-item-right">
              <div class="form-item-button" @click="getCodeHandle"><span>{{ codeText }}</span></div>
            </div>
          </div>
          <div class="form-item form-item1">
            <div class="info color"><span>温馨提示：</span></div>
            <div class="info "><span>单笔提现费率为N%，单笔固定费用为N</span></div>
          </div>

        </div>
        <div class="submit-btn">
          <div class="btn1 flex-content" @click="withdrawBtn">确认</div>
          <div class="btn2 flex-content" @click="closeFnc">再想想</div>
        </div>
      </div>
    </DirectiveDialog>

  </div>
</template>
  
<script>
import Navbar from '@/layout/components/Navbar'
import formMixins from '@/mixins/formMixins'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import { recharge_list, fund_data, recharge_submit, payment_channel,withdraw_submit } from '@/api/project'
import {convertTimestampToDateString} from '@/utils/time'

import Vue from 'vue'
Vue.directive('copy', {
  bind: function (el, binding) {
    el.$copy = function () {
      console.log(binding)
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
  name: 'Home',
  components: {
    Navbar,
    DirectiveDialog,
  },
  mixins: [formMixins,],
  data() {
    return {
      value: 1,
      formData: {
        keyword_type: 1,
        keyword: '',
        status: '',
        time: [],
        time_start: '',
        time_end: '',
        page: 1,
        limit: 10,
        total: 0
      },
      tableData: [],
      rechargeForm: {
        recharge_no: '',
        amount: '',
        url: ''
      },
      fundData: {
        balance_money: '',
        forzen_money: "",
        income_money: ""
      },
      withdrawalForm: {
        agreement:'USDT-TRC20',
        amount: '',
        code:'',
        payment_id:''
      },
      codeText: '发送验证码',
      receivingAddressList: []
    }
  },
  mounted() {
    this.convertTimestampToDateString = convertTimestampToDateString;
    this.getRechargeList();
    this.fundDataFnc()
    this.paymentChannel()
  },
  methods: {
    async withdrawBtn(){
      let res = await withdraw_submit(this.withdrawalForm);
      if(res.code==200){
        this.$refs.withdrawal.close();
        this.getRechargeList(true);
        this.$message.success(res.msg)
        return
      }
      this.$message.error(res.msg)
    },
    async paymentChannel(bool = false) {
      if (bool) {
        this.paymentChannelObj.page = 1;
      }
      let res = await payment_channel({});
      if (res.code == 200) {
        this.receivingAddressList = res.data.data;
      }
    },
    getCodeHandle() {
      if (this.codeText == '发送验证码') {
        this.codeText = 60;
        // this.getSmsRegister();
        let time = setInterval(() => {
          this.codeText--;
          if (this.codeText == 0) {
            clearInterval(time);
            this.codeText = '发送验证码'
          }
        }, 1000)
      } else {
        return
      }
      // 获取短信验证码的处理函数
    },
    async rechargeGenerate() {
      let res = await recharge_submit({ amount: this.rechargeForm.amount });
      if (res.code == 200) {
        this.rechargeForm = res.data;
      }
    },
    changeNum() {
      this.rechargeForm.recharge_no = '';
      this.rechargeForm.url = '';
    },
    async fundDataFnc() {
      let res = await fund_data();
      if (res.code == 200) {
        this.fundData = res.data;
      }
    },
    resertFormFnc() {
      this.formData = {
        keyword_type: 1,
        keyword: '',
        status: '',
        time: [],
        time_start: '',
        time_end: '',
        page: 1,
        limit: 10,
        total: 0
      }
      this.getRechargeList();
    },
    handleSizeChange(val) {
      this.formData.limit = val;
      this.getRechargeList(true);
    },
    handleCurrentChange(val) {
      this.formData.page = val;
      this.getRechargeList();
    },
    async getRechargeList(bool = false) {
      if (bool) {
        this.formData.page = 1;
      }
      if (this.formData.time.length > 0) {
        this.formData.time_start = this.formData.time[0];
        this.formData.time_end = this.formData.time[1];
      }
      let res = await recharge_list(this.formData)
      if (res.code == 200) {
        this.tableData = res.data.data;
        this.formData.total = res.data.total;
      }
    },
    handleClick(e) {
      console.log(e)
    },
    handleRecharge() {
      this.rechargeForm={
        recharge_no: '',
        amount: '',
        url: ''
      },
      this.$refs.recharge.openDialog();
    },
    handleWithdrawal() {
      this.withdrawalForm= {
        agreement:'USDT-TRC20',
        amount: '',
        code:'',
        payment_id:''
      },
      this.$refs.withdrawal.openDialog();
    },
    closeFnc() {
      this.$refs.withdrawal.close();
      this.$refs.recharge.close();
      this.getRechargeList(true)
    }
  }
}
</script>
  
<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0;
}

::v-deep .el-select{
  width: 100%;
}
::v-deep .el-pager {
  .active {
    background: linear-gradient(0deg, #5B80EE 0%, #3E63F4 100%);
    font-size: 14px;
    color: white;
    border-radius: 5px;
  }
}

::v-deep .el-table thead th {
  height: 65px;
  /* 替换为你想要的高度值 */
}

::v-deep .el-tabs__nav-wrap::after {
  background-color: white;
}

::v-deep .el-tabs__item.is-active {
  color: #3E63F4;

  font-size: 18px;
  font-weight: 600;
}

::v-deep .el-tabs__active-bar {
  background-color: #3E63F4;
  height: 3px;
}

::v-deep .el-input__inner {
  height: 40px;
  border: 1px solid white;
}

::v-deep .el-pagination__total {
  padding-top: 5px;
}

.dialog-box {
  .form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 37px;

    .form-item1 {
      display: flex;
      flex-direction: column !important;
    }

    .form-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-bottom: 25px;

      .info {
        color: #858585;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .color {
        span {
          color: #F29D51;
        }
      }

      // align-content: flex-start;
      // align-self: flex-start;
      .form-item-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 70%;
        margin-right: 12px;

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

        .form-item-input {
          width: calc(100% - 115px);
          // height: 42px;
          // background-color: red;
          // height: 100%;
          box-sizing: border-box;
          border-top: 1px solid #F1F1F1;
          border-bottom: 1px solid #F1F1F1;
          border-right: 1px solid #F1F1F1;
          // padding: 14px 20px;
          // margin-bottom: 12px;
        }
      }


      .form-item-right {
        display: flex;
        flex-grow: 1;
        flex-direction: column;

        .form-item-button {
          width: 164px;
          height: 42px;
          border: 1px solid #F1F1F1;
          background: linear-gradient(90deg, #5B81EE 0%, #3D63F4 100%);
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
          font-size: 14px;
          box-sizing: border-box;
          // padding: 10px 58px;
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
    // margin-top: 120px;

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
      display: flex;
      justify-content: center;
      align-items: center;

    }

    .btn2 {
      width: 120px;
      height: 42px;
      background: #F7F9FA;
      border: 2px solid #597FEE;
      border-radius: 6px;
      color: #3E64F4;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

//   #3E63F4
.home-container {
  height: 100%;
}

.main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tab {
    background-color: white;
    padding: 17px 0 10px 22px;
    border-radius: 10px 10px 0px 0px;
  }

  .bk {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;

    .item {
      width: 290px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: url('../../assets/recharge_icon1.png')no-repeat;
      margin-right: 10px;
      box-sizing: border-box;
      padding: 27px 14px 12px 27px;

      .val {
        display: flex;
        flex-direction: column;

        .num {
          color: #FFFFFF;
          font-size: 30px;
          font-weight: 600;
          margin-bottom: 5px;

          span {
            line-height: 1;
          }
        }

        .label {
          color: #FFFFFF;
          font-size: 16px;
        }
      }

      .button {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        div {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding: 14px 34px;
          border-radius: 10px;

          span {
            color: #FFFFFF;
            font-size: 14px;
            line-height: 1;
          }
        }

        .btn1 {
          border: 1px solid #FFFFFF;
          background: auto;
        }

        .btn2 {
          background-color: white;
          margin-left: 8px;

          span {
            color: #333333;
          }
        }
      }
    }

    & .item1 {
      background: url('../../assets/recharge_icon2.png')no-repeat;
    }

    & .item2 {
      background: url('../../assets/recharge_icon3.png')no-repeat;
    }
  }

  .context {
    width: 100%;
    margin: 7px auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    // display: flex;
    // flex-direction: row;
    // align-items: center;
    .form {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .form-item {
        margin-right: 7px;
      }

      .submit {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: linear-gradient(90deg, #5B80EE 0%, #3E63F4 100%);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 14px;
      }

      .reset {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: #FFFFFF;
        border: 1px solid #F1F1F1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333333;
        font-size: 14px;
      }
    }

    .table {
      flex-grow: 1;
      box-sizing: border-box;
      background-color: #fff;

      .table-name {

        // padding-left: 20px;
        .table-name-top {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
          cursor: pointer;

          .table-name-top-title {
            color: #333333;
            font-size: 16px;
            font-weight: 600;
            line-height: 12px;
            margin-right: 6px;
          }

          .table-name-top-icon {
            width: 17px;
            height: 14px;
            margin-right: 8px;
          }

          .table-name-top-status {
            font-size: 12px;
            font-weight: 600;
          }

          .success {
            color: #597FEE;
          }
        }

        .table-name-num {
          color: #8590A1;
          font-size: 12px;
        }
      }

      .between {
        display: flex;
        flex-direction: column;

        .between-title {
          color: #333333;
          font-size: 14px;

          margin-bottom: 10px;
          line-height: 1;
        }

        .between-label {
          color: #333333;
          font-size: 14px;
          line-height: 1;
          font-weight: 600;
        }

        .button {
          width: 80px;
          height: 32px;
          background: #FFFFFF;
          border: 1px solid #5B80EE;
          // border-image: linear-gradient(0deg, #5B80EE, #3E63F4) 10 10;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333333;
          font-size: 14px;
          line-height: 1;
        }
      }
    }

    .pagination {
      padding-bottom: 47px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
  }
}
</style>
  