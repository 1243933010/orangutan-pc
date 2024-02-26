<template>
  <div class="dialog-container">
    <el-form class="address-form" :model="addressInfo" label-width="94px">
      <el-form-item class="input-box" label="用户头像">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="formInfo.avatar" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class="input-box label-border" label="账号名称">
        <el-input
          v-model="formInfo.nickname"
          placeholder="请输入钱包地址"
        ></el-input>
      </el-form-item>
      <el-form-item class="input-box label-border" label="邮箱">
        <el-input
          type="email"
          v-model="formInfo.email"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item class="input-box label-border" label="确认密码">
        <el-input
          type="password"
          v-model="formInfo.password"
          placeholder="修改信息需要密码，请输入密码"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="save-btn" @click="saveHandle"
        >保存信息</el-button
      >
    </el-form>
  </div>
</template>

<script>
// import clooectionMixins from '../clooectionMixins'
export default {
  name: "materialsForm",
  props: {
    closeDialog: {
      type: Function,
      default: () => {},
    },
    getDialogData: {
      type: Function,
      default: () => {},
    },
    formInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    saveHandle() {
      this.closeDialog();
      this.getDialogData(this.formInfo);
    },
  },
  mounted() {
    console.log(this.formInfo);
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

        .el-input__inner {
          border: 1px solid #c0c4cc;
          padding: 14px 0 14px 32px;
          border-radius: 0;
          line-height: normal;
          height: auto;
        }

        .el-date-editor.el-input {
          width: 100%;
        }

        .el-upload {
          border: 1px solid #F1F1F1;
          padding: 16px;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;

          .avatar-uploader-icon {
            font-size: 36px;
            color: #F1F1F1;
          }
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
