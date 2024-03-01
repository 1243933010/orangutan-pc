<template>
  <div class="dialog-container">
    <el-form class="address-form" :model="addressInfo" label-width="94px">

      <el-form-item class="input-box label-border" label="提现地址">
        <el-input v-model="addressInfo.address" placeholder="请输入提现地址"></el-input>
      </el-form-item>

      <el-form-item class="input-box label-border" label="网络">
        <el-input :disabled="true" v-model="addressInfo.chain" placeholder="请输入chain"></el-input>
      </el-form-item>
      <el-form-item class="input-box label-border" label="备注">
        <el-input v-model="addressInfo.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-button type="primary" class="save-btn" @click="saveHandle">保存信息</el-button>
    </el-form>
  </div>
</template>

<script>
// import clooectionMixins from '../clooectionMixins'
export default {
  name: "addressForm",
  props: {
    closeDialog: {
      type: Function,
      default: () => { },
    },
    getDialogData: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    return {
      addressInfo: {
        address: "",
        chain: 'trc20',
        remark: ''
      },
      channelTypeOp: [
        {
          key: 1,
          value: 'paypal',
          label: "PayPal",
        },
        {
          key: 2,
          value: "visa",
          label: "visa",
        }
      ],
      channelUsageOp: [

        {
          value: 1,
          label: "收款",
        },
        {
          value: 2,
          label: "提现",
        },
      ],
    };
  },
  methods: {
    changeSelect(e) {
      console.log(e)
    },
    openDialog(data) {
      if (data) {
        this.addressInfo = data;
      } else {
        this.addressInfo = {
          address: "",
          chain: 'trc20',
          remark: ''
        }
      }
    },
    async saveHandle() {
      let { bool, msg } = this.validateData([this.addressInfo.address],
        [ '地址'])

      if (!bool) {
        this.$message.error(msg)
        return
      }
      this.closeDialog();
      this.getDialogData(this.addressInfo);
    },
  },
};
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
