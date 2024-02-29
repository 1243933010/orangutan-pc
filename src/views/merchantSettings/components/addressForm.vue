<template>
  <div class="dialog-container">
    <el-form class="address-form" :model="addressInfo" label-width="124px">
      <el-form-item class="input-box" label="状态">
        <el-radio-group v-model="addressInfo.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="input-box label-border" label="账户名称">
        <el-input v-model="addressInfo.account_name" placeholder="请输入账户名称" />
      </el-form-item>
      <el-form-item class="input-box label-border" label="收款地址">
        <el-input v-model="addressInfo.account" placeholder="请输入钱包地址" />
      </el-form-item>
      <el-form-item class="input-box label-border" label="渠道类型">
        <el-select v-model="addressInfo.channel" placeholder="渠道类型">
          <el-option v-for="(item,index) in channelTypeOp" :key="item.key" :label="item.label" :value="item.value" @change="changeSelect" />
        </el-select>
      </el-form-item>
      <el-form-item class="input-box label-border" label="汇率">
        <el-input v-model="addressInfo.rate" placeholder="请输入汇率" />
      </el-form-item>
      <el-form-item class="input-box label-border" label="最小收款金额">
        <el-input v-model="addressInfo.min_money" placeholder="请输入最小收款金额" />
      </el-form-item>
      <el-form-item class="input-box label-border" label="最大收款金额">
        <el-input v-model="addressInfo.max_money" placeholder="请输入最大收款金额" />
      </el-form-item>
      <!-- <el-form-item class="input-box label-border" label="渠道用途">
        <el-select v-model="addressInfo.use_type" placeholder="渠道用途">
          <el-option v-for="item in channelUsageOp" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item class="input-box label-border" label="地址排序">
        <el-input v-model="addressInfo.sort" placeholder="请输入排序序号, 序号越大越靠前" />
      </el-form-item>
      <el-form-item class="input-box label-border" label="备注">
        <el-input v-model="addressInfo.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-button type="primary" class="save-btn" @click="saveHandle">保存信息</el-button>
    </el-form>
  </div>
</template>

<script>
// import clooectionMixins from '../clooectionMixins'
import { payment_config, payment_set, payment_channel, payment_channel_submit, payment_channel_edit } from '@/api/project'

export default {
  name: 'AddressForm',
  props: {
    closeDialog: {
      type: Function,
      default: () => { }
    },
    // getDialogData: {
    //   type: Function,
    //   default: () => { }
    // }
  },
  data() {
    return {
      addressInfo: {
        status: 1,
        account: '',
        channel: '',
        // use_type: '',
        sort: '',
        remark: '',
        rate: '',
        min_money: '',
        max_money: '',
        account_name:''
      },
      channelTypeOp: [
        {
          key: 1,
          value: 'paypal',
          label: 'PayPal'
        },
        {
          key: 2,
          value: 'visa',
          label: 'visa'
        }
      ],
      channelUsageOp: [

        {
          value: 1,
          label: '收款'
        },
        {
          value: 2,
          label: '提现'
        }
      ]
    }
  },
  methods: {
    changeSelect(e) {
      console.log(e)
    },
    openDialog(data) {
      if (data) {
        this.addressInfo = data
      } else {
        this.addressInfo = {
          status: 1,
          account: '',
          channel: '',
          // use_type: '',
          sort: '',
          remark: '',
          rate: '',
          min_money: '',
          max_money: '',
          account_name:''
        }
      }
    },
    async saveHandle() {
      const { bool, msg } = this.validateData([this.addressInfo.account_name, this.addressInfo.status,
        this.addressInfo.url,
        this.addressInfo.channel,
        this.addressInfo.rate,
        this.addressInfo.min_money,
        this.addressInfo.max_money],
      ['账户名称','状态', '收款地址', '渠道类型', '汇率', '最小值', '最大值'])

      if (!bool) {
        this.$message.error(msg)
        return
      }
      
      this.getDialogData(this.addressInfo)
     
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
        // this.paymentChannel(true)
        this.closeDialog()
        return
      }
      this.$message.error(res.msg)
      // 保存后的数据 data
    },
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  padding: 30px 38px 46px;

  .address-form {
    ::v-deep.input-box {
      margin-bottom: 15px;
      display: flex;
      align-items: center;

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
      margin-top: 38px;
      margin-left: 18px;
    }
  }
}
</style>
