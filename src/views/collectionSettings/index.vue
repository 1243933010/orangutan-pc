<template>
  <div class="dialog-container">
    <!-- <div class="dialog-container-title">
      <img src="../../assets/collection_icon.png" alt="">
      <span>收款设置</span>
    </div> -->
    <el-tabs v-model="activeName" class="tabs-container" @tab-click="tabClick">
      <el-tab-pane label="收款设置" name="first">
        <el-form class="address-form" :model="addressInfo" label-width="150px">
          <el-form-item class="input-box label-border" label="收款状态">
            <el-select v-model="addressInfo.payment_status" placeholder="收款状态">
              <el-option v-for="item in channelUsageOp" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <div class="form-label"><span>关闭后将不能收款</span></div>
          </el-form-item>
          <el-form-item class="input-box label-border" label="收款汇率">
            <el-input v-model="addressInfo.rate" placeholder="请输入收款汇率" />
            <div class="form-label"><span>谨慎设置汇率，汇率高低会影响收款意向度</span></div>

          </el-form-item>
          <el-form-item class="input-box label-border" label="收款区间">
            <!-- type="textarea" -->
            <el-input v-model="addressInfo.min_money" style="width: 45%;" type="number" placeholder="最小值" />
            <span style="width: 10%;text-align: center;">---</span>
            <el-input v-model="addressInfo.max_money" style="width: 45%;" type="number" placeholder="最大值" />
            <div class="form-label"><span>只收在这个范围的金额</span></div>

          </el-form-item>
          <el-form-item class="input-box label-border" label="规定支付时长">
            <el-input v-model="addressInfo.pay_time" placeholder="10分钟" />
            <div class="form-label"><span>规定交易订单支付时长</span></div>

          </el-form-item>
          <el-form-item class="input-box label-border" label="收款留言">
            <el-input v-model="addressInfo.remark" placeholder="请输入收款留言" />
            <div class="form-label"><span>防止封号风险，给打款方备注说明</span></div>

          </el-form-item>
          <div class="save-btn">
            <el-button type="primary" @click="paymentSet">保存信息</el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="通道地址" name="second">
        <el-button type="primary" class="add-address-btn" @click="openDialog('添加收款地址')"><i
          class="el-icon-plus"
        />添加收款地址</el-button>
        <div class="tab-pane-container" style="border-radius: 10px; text-align: center">
          <el-table height="100%" :data="receivingAddressList" style="width: 100%">
            <el-table-column prop="channel" label="渠道类型">
              <!-- <template slot-scope="scope">
                <span>{{ scope.row.channel }}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="use_type" label="渠道用途">
              <template slot-scope="scope">
                <span v-if="scope.row.use_type == 1">收款</span>
                <span v-if="scope.row.use_type == 2">提现</span>
              </template>
            </el-table-column>
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
                <el-button type="primary" plain @click="openDialog('编辑收款地址', scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              :current-page="paymentChannelObj.page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="paymentChannelObj.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="paymentChannelObj.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑收款地址 -->
    <DirectiveDialog ref="directiveDialogRef1" :title="dialogTit">
      <AddressForm
        ref="addressFormRef"
        :close-dialog="closeDialog"
        :get-dialog-data="getDialogData"
        :address-info="checkedAddress"
      />
    </DirectiveDialog>
  </div>
</template>

<script>
// import clooectionMixins from '../clooectionMixins'
import { payment_config, payment_set, payment_channel, payment_channel_submit, payment_channel_edit } from '@/api/project'
import AddressForm from './components/addressForm'
import DirectiveDialog from '@/components/DirectiveDialog/index'

export default {
  components: { AddressForm, DirectiveDialog },
  props: {
    closeDialog: {
      type: Function,
      default: () => { }
    },
    getDialogData: {
      type: Function,
      default: () => { }
    }
    // addressInfo: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       stateVal: '0'
    //     }
    //   }
    // }
  },
  data() {
    return {
      channelUsageOp: [
        {
          value: 0,
          label: '关闭'
        },
        {
          value: 1,
          label: '开启'
        }
      ],
      addressInfo: {
        rate: '',
        min_money: '',
        max_money: '',
        pay_time: '',
        remark: '',
        num: '',
        payment_status: ''
      },
      receivingAddressList: [],
      activeName: 'first',
      paymentChannelObj: {
        page: 1,
        limit: 10,
        total: 10
      },
      checkedAddress: undefined,
      dialogTit: '编辑收款地址'
    }
  },
  mounted() {
    console.log(this.addressInfo)
    this.paymentConfig()
  },
  methods: {
    tabClick(e) {
      console.log(e)
      if (+e.index == 1) {
        this.paymentChannel()
      }
      if (+e.index == 2) {
        this.getUserInfo()
      }
    },
    handleSizeChange(val) {
      this.paymentChannelObj.limit = val
      this.paymentChannel(true)
    },
    handleCurrentChange(val) {
      this.paymentChannelObj.page = val
      this.paymentChannel()
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
    openDialog(dialogTit, data = undefined) {
      this.dialogTit = dialogTit
      this.checkedAddress = data
      this.$refs.directiveDialogRef1.openDialog(data)
      // this.$nextTick(() => {
      //   this.$refs.addressFormRef?.openDialog(data);
      // })
    },
    changeInput(e) {
      console.log(e)
    },
    async paymentConfig() {
      const res = await payment_config()
      console.log(res, '**')
      if (res.code == 200) {
        this.addressInfo = res.data
      }
    },
    async paymentSet() {
      const formData = this.addressInfo

      if (formData.min_money >= this.addressInfo.max_money) {
        this.$message.error('最大最小值格式错误')
        return
      }
      //  formData.min_money = formData.num.split('-')[0].trim();
      //  formData.max_money = formData.num.split('-')[1].trim();
      const { bool, msg } = this.validateData([formData.payment_status, formData.rate, formData.max_money, formData.min_money, formData.pay_time],
        ['收款状态', '汇率', '最大金额', '最小金额', '支付市场'])

      if (!bool) {
        this.$message.error(msg)
        return
      }
      const res = await payment_set(formData)
      console.log(res)
      if (res.code == 200) {
        this.$message.success(res.msg)
        return
      }
      this.$message.error(res.msg)
    },
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
    saveHandle() {
      this.closeDialog()
      this.getDialogData(this.addressInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}

.dialog-container {
  padding: 30px 38px 46px;
  background-color: white;
  flex-grow: 1;

  .dialog-container-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #404865;
    margin-bottom: 67px;
    font-size: 18px;
    font-weight: 600;

    img {
      width: 23px;
      height: 21px;
      margin-right: 9px;
    }
  }

  .address-form {
    max-width: 50%;
    margin: 0 auto;

    ::v-deep.input-box {
      width: 1050px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;

      .form-label {
        width: 80%;
        padding-left: 58px;
        color: #858585;
        font-size: 14px;
        line-height: 1;

        span {
          line-height: 1;
        }
      }

      &.label-border {
        align-items: stretch;

        .el-form-item__label {
          border: 1px solid #c0c4cc;
          border-right: none;
          border-radius: 6px 0 0 6px;
        }
      }

      .el-form-item__label {
        padding-left: 20px;
        line-height: normal;
        text-align: left;
        display: flex;
        align-items: center;
        padding-right: 0;
      }

      .el-form-item__content {
        margin-left: 0 !important;
        display: flex;
        flex-grow: 1;
        align-items: center;

        .el-radio-group {
          display: flex;
          align-items: center;
        }

        .el-input__inner {
          border: 1px solid #c0c4cc;
          padding: 14px 0 14px 32px;
          border-radius: 0;
          line-height: normal;
          height: auto;
        }

        .el-date-editor.el-input,
        .el-select {
          width: 100%;
        }
      }
    }

    .save-btn {
      width: 100%;
      margin-top: 220px;
      text-align: center;

      .el-button {
        background: linear-gradient(90deg, #5A80EE 0%, #3D63F4 100%);
      }

      // margin-left: 18px;
    }
  }
}
</style>
