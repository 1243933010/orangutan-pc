<template>
  <div class="personal-data-container">

    <div class="step-list">
      <template v-for="(step, index) of stepList">
        <div :key="step.num" class="step-item" :class="{ active: step.isActive }">
          <div class="round">
            <span class="num">{{ step.num }}</span>
            <i class="el-icon-check icon" />
          </div>

          <span class="text">{{ step.text }}</span>
        </div>
        <div v-if="index !== stepList.length - 1" class="line" />
      </template>
    </div>

    <el-form
      ref="basicData"
      label-position="left"
      :rules="rules"
      class="basic-data-form"
      :class="stepType"
      :model="authenticationData"
      label-width="94px"
    >
      <!-- 左边的 -->
      <div class="in-review">
        <div class="pic">
          <img src="../../assets/funnel.png">
        </div>
        <p>认证信息正在审核中，请耐心等待！</p>
      </div>
      <div class="left-form">
        <el-form-item label="商家名称:" class="input-box" prop="dealers_name">
          <el-input v-model="authenticationData.dealers_name" :disabled="stepType !== 'apply'" />
        </el-form-item>
        <el-form-item label="姓名:" class="input-box" prop="name">
          <el-input v-model="authenticationData.name" :disabled="stepType !== 'apply'" />
        </el-form-item>
        <el-form-item label="身份证号:" class="input-box" prop="card_no">
          <el-input v-model="authenticationData.card_no" :disabled="stepType !== 'apply'" />
        </el-form-item>
        <el-form-item label="证件照:" prop="" class="id-card-img">
          <el-upload
            class="upload-com"
            action=""
            :file-list="[]"
            :http-request="(files) => httpRequest(files,'card_img_front')"
            :before-upload="beforeAvatarUpload"
            :limit="1"
          >
            <!-- <el-button class="no-bg-btn">更新头像</el-button> -->
            <img class="img" :src="authenticationData.card_img_front?authenticationData.card_img_front:require('../../assets/personalData/cardFront.png')" alt="">
          </el-upload>
          <!-- <el-upload class="upload-com" action="" drag multiple>
            <div class="pic">
              <img class="img" src="../../assets/personalData/cardFront.png" alt="">
            </div>
            <p>身份证正面</p>
          </el-upload> -->

          <!-- <el-upload class="upload-com" action="" drag multiple>
            <div class="pic">
              <img class="img" src="../../assets/personalData/cardOpposite.png" alt="">
            </div>
            <p>身份证正面</p>
          </el-upload> -->
          <el-upload
            class="upload-com"
            action=""
            :file-list="[]"
            :http-request="(files) => httpRequest(files,'card_img_back')"
            :before-upload="beforeAvatarUpload"
            :limit="1"
          >
            <!-- <el-button class="no-bg-btn">更新头像</el-button> -->
            <img class="img" :src="authenticationData.card_img_back?authenticationData.card_img_back:require('../../assets/personalData/cardFront.png')" alt="">
          </el-upload>
        </el-form-item>
        <el-button type="primary" @click="authenticationFnc">申请认证</el-button>
      </div>
    </el-form>

    <!-- 编辑收款地址 -->
    <DirectiveDialog ref="directiveDialogRef" :title="dialogTit">
      <AddressForm
        ref="addressFormRef"
        :close-dialog="closeDialog"
        :get-dialog-data="getDialogData"
        :address-info="checkedAddress"
      />
    </DirectiveDialog>

    <!-- 编辑资料 -->
    <DirectiveDialog ref="materialsDialogRef" title="编辑资料">
      <MaterialsForm
        :close-dialog="closeMaterialsDialog"
        :get-dialog-data="getMaterialsDialogData"
        :form-info="basicData"
      />
    </DirectiveDialog>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import AddressForm from '@/views/personal-center/components/addressForm'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import MaterialsForm from '@/views/personal-center/components/materialsForm'
import {
  user_info, authentication, uploadImg, payment_channel,
  payment_channel_submit, payment_channel_edit, user_info_edit, dealers_verify_status, dealers_verify
} from '@/api/project'
import { convertTimestampToDateString } from '@/utils/time'
export default {
  name: 'Home',
  components: {
    Navbar,
    AddressForm,
    DirectiveDialog,
    MaterialsForm
  },
  data() {
    return {
      activeName: 'first',
      // userBool: {
      //   headIcon: false,
      //   userName: false,
      //   email: false
      // },
      basicData: {},
      authenticationData: {
        dealers_name: '',
        name: '',
        card_no: '',
        card_img_front: '',
        card_img_back: ''
      },
      receivingAddressList: [],
      dialogTit: '编辑收款地址',
      checkedAddress: undefined,
      paymentChannelObj: {
        page: 1,
        limit: 10,
        total: 10
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        card_no: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur'
          }
        ],
        dealers_name: [
          {
            required: true,
            message: '请输入商家名称',
            trigger: 'blur'
          }
        ]
      },
      stepList: [
        {
          num: 1,
          text: '申请认证',
          isActive: true
        },
        {
          num: 2,
          text: '平台审核',
          isActive: false
        },
        {
          num: 3,
          text: '成为商家',
          isActive: false
        }
      ],
      stepType: 'apply', // apply: 申请认证,  review: 审核中, result: 结果
      statusObj: {}
    }
  },
  computed: {
    VUE_APP_FILE_URL() {
      return process.env.VUE_APP_FILE_URL
    }
  },
  mounted() {
    // this.receivingAddressList.sort((a, b) => a.sort - b.sort);
    // console.log(this.receivingAddressList);
    // this.getUserInfo()
    this.getDealersVerifyStatus()
  },
  methods: {
    // async getDealersVerify() {

    // },
    async getDealersVerifyStatus() {
      const res = await dealers_verify_status()
      if (res.code == 200) {
        this.statusObj = res.data
        if (res.data.auth_status == 1) {
          this.stepType = review
        } else if (res.data.auth_status > 1) {
          this.stepType = result
        }
      }
    },
    // async setUser(type) {
    //   // console.log(this.basicData,this.basicData[type],type)
    //   const formData = {
    //     field: type,
    //     value: this.basicData[type]
    //   }
    //   const res = await user_info_edit(formData)
    //   if (res.code == 200) {
    //     this.$message.success(res.msg)
    //     this.userBool = {
    //       headIcon: false,
    //       userName: false,
    //       email: false
    //     }
    //     this.getUserInfo()
    //     return
    //   }
    //   this.$message.error(res.msg)
    // },
    // handleSizeChange(val) {
    //   this.paymentChannelObj.limit = val
    //   this.paymentChannel(true)
    // },
    // handleCurrentChange(val) {
    //   this.paymentChannelObj.page = val
    //   this.paymentChannel()
    // },
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
    async httpRequest(files, type) {
      console.log(type, files, process.env.VUE_APP_FILE_URL)
      const formData = new FormData()
      formData.append('file', files.file) // 文件名
      const res = await uploadImg(formData)
      if (res.code == 200) {
        this.authenticationData[type] = process.env.VUE_APP_FILE_URL + res.data
        return
      }
      this.$message.error(res.msg)
    },

    beforeAvatarUpload(file) {
      const isIMG = file.type.includes('image')
      if (!isIMG) {
        this.$message.error('上传头像只能是图片!')
      }
      return isIMG
    },
    async authenticationFnc() {
      const formData = this.authenticationData
      // formData.front = formData.cardFront
      // formData.back = formData.cardBack
      const { bool, msg } = this.validateData([formData.dealers_name, formData.name, formData.card_no, formData.card_img_front, formData.card_img_back],
        ['商户名称', '名称', '身份证号', '身份证正面', '身份证反面'])

      if (!bool) {
        this.$message.error(msg)
        return
      }
      const res = await dealers_verify(formData)
      if (res.code == 200) {
        this.$message.success('已申请认证')
        this.getDealersVerifyStatus()
        return
      }
      this.$message.error(res.msg)
    },
    // async getUserInfo() {
    //   const res = await user_info()
    //   // console.log(res,'---')
    //   if (res.code == 200) {
    //     res.data.created_at = convertTimestampToDateString(res.data.created_at)
    //     this.basicData = res.data
    //   }
    // },
    // tabClick(e) {
    //   console.log(e)
    //   if (+e.index == 1) {
    //     this.paymentChannel()
    //   }
    //   if (+e.index == 2) {
    //     this.getUserInfo()
    //   }
    // },
    openDialog(dialogTit, data = undefined) {
      this.dialogTit = dialogTit
      this.checkedAddress = data
      this.$refs.directiveDialogRef.openDialog(data)
      this.$nextTick(() => {
        this.$refs.addressFormRef?.openDialog(data)
      })
      // console.log(data,this.$refs.directiveDialogRef);
    },
    closeDialog() {
      this.$refs.directiveDialogRef.close()
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
    closeMaterialsDialog() {
      this.$refs.materialsDialogRef.close()
    },
    getMaterialsDialogData(data) {
      console.log(data)
      // 保存后的数据 data
    }
    // openMaterialsDialog() {
    //   this.$refs.materialsDialogRef.openDialog()
    // }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.personal-data-container {
  flex-grow: 1;
  min-height: 10%;

  display: flex;
  flex-direction: column;

  .step-list {
    margin: 20px 0 48px 104px;
    max-width: 662px;
    width: 100%;
    display: flex;
    align-items: center;

    .step-item {
      border-radius: 50%;
      border: 6px solid #DEDFF7;
      width: 50px;
      height: 50px;
      position: relative;

      &.active {
        .round {
          background-image: linear-gradient(180deg, #5666FF 0%, #7A5AFF 100%);

          .num {
            display: none;
          }

          .icon {
            display: block;
          }
        }
      }

      .round {
        border-radius: 50%;
        border: 6px solid #fff;
        width: 100%;
        height: 100%;
        background-color: #DEDFF7;

        @include df(center, center);

        .num {
          color: #9492AC;
          font-size: 16px;
          font-weight: bold;
        }

        .icon {
          display: none;
          color: #fff;
          font-weight: bold;
        }
      }

      .text {
        position: absolute;
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        color: #1D1D1D;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .line {
      margin-left: 52px;
      margin-right: 52px;
      height: 4px;
      flex-grow: 1;
      background-color: #DDDEEC;
    }
  }

  .basic-data-form {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: flex-start;

    border-radius: 10px;
    padding: 65px 92px;
    background-color: #fff;

    &.review {
      .left-form {
        padding-left: 42px;

        .input-box {
          ::v-deep .el-input__inner {
            border: none;
          }
        }
      }
    }

    .in-review {
      margin-bottom: 40px;
      border-radius: 20px;
      padding: 18px 28px;
      background-color: #F2F5FA;

      display: flex;
      align-items: center;

      .pic {
        width: 38px;
      }

      p {
        margin-left: 14px;
        color: #DD8813;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .left-form {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .input-box {
        width: 100%;

        ::v-deep .el-form-item__label {
          height: 48px;
          line-height: 48px;
        }

        ::v-deep .el-input__inner {
          height: 48px;
          line-height: 48px;
          background-color: transparent;
        }
      }

      .id-card-img {
        width: 100%;

        ::v-deep .el-form-item__content {
          display: flex;

          .upload-com {
            margin-right: 45px;
            .img{
              width: 200px;
              height: 111px;
            }

            .el-upload {
              width: 100%;

              .el-upload-dragger {
                background-color: transparent;
              }
            }

            .el-upload-dragger {
              border: none;
              height: auto;
              width: 100%;
            }

            .pic {
              border-radius: 5px;
              border: 1px dashed #aaa;
              width: 100%;
              overflow: hidden;
            }

            p {
              margin-top: 8px;
              color: #B8BDC6;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
