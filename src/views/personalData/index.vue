<template>
  <div class="personal-data-container">
    <el-tabs v-model="activeName" class="tabs-container" @tab-click="tabClick">
      <el-tab-pane label="个人资料" name="first">
        <div class="tab-pane-container">
          <el-form ref="basicData" class="basic-data-form" :model="basicData" label-width="94px">

            <!-- 右边的 -->
            <div class="right-form">
              <el-form-item label="用户头像" class="input-box">
                <div class="avatar">
                  <img
                    style="width:100%;"
                    :src="basicData.head_img ? VUE_APP_FILE_URL + basicData.head_img : ''"
                    alt=""
                  >
                </div>

                <el-upload
                  class="upload-com"
                  action=""
                  :file-list="[]"
                  :http-request="(files) => httpRequest1(files)"
                  :before-upload="beforeAvatarUpload"
                  :limit="1"
                >
                  <el-button class="no-bg-btn">更新头像</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="账号名称" class="input-box label-border">
                <el-input v-model="basicData.username" :disabled="!userBool.userName" />
                <el-button
                  v-if="!userBool.userName"
                  class="no-bg-btn"
                  @click="userBool.userName = true"
                >编辑</el-button>
                <el-button
                  v-if="userBool.userName"
                  class="no-bg-btn"
                  @click="setUser('username')"
                >修改</el-button>
              </el-form-item>
              <el-form-item label="手机号码" class="input-box label-border">
                <el-input v-model="basicData.mobile" :disabled="true" />
                <el-button class="no-bg-btn" disabled>暂不可修改</el-button>
              </el-form-item>
              <el-form-item label="邮箱" class="input-box label-border">
                <el-input v-model="basicData.email" :disabled="!userBool.email" type="email" />
                <el-button
                  v-if="!userBool.email"
                  class="no-bg-btn"
                  @click="userBool.email = true"
                >编辑</el-button>
                <el-button v-if="userBool.email" class="no-bg-btn" @click="setUser('email')">修改</el-button>
              </el-form-item>
              <el-form-item label="注册时间" class="input-box label-border">
                <el-date-picker v-model="basicData.created_at" :disabled="true" type="date" prefix-icon="" />
                <el-button class="no-bg-btn" style="position: relative; z-index: -1" />
              </el-form-item>
              <div class="" style="width: 100%;text-align: center;">
                <el-button type="primary" @click="openMaterialsDialog">编辑</el-button>
              </div>
            </div>

          </el-form>

        </div>
      </el-tab-pane>

    </el-tabs>

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
import { user_info, authentication,
  uploadImg, payment_channel, payment_channel_submit,
  payment_channel_edit, user_info_edit } from '@/api/project'
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
      userBool: {
        headIcon: false,
        userName: false,
        email: false
      },
      basicData: {},
      authenticationData: {
        store_name: '',
        name: '',
        card_no: '',
        cardFront: '',
        cardBack: ''
      },
      receivingAddressList: [],
      dialogTit: '编辑收款地址',
      checkedAddress: undefined,
      paymentChannelObj: {
        page: 1,
        limit: 10,
        total: 10
      }
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
    this.getUserInfo()
  },
  methods: {
    async setUser(type) {
      // console.log(this.basicData,this.basicData[type],type)
      const formData = {
        field: type,
        value: this.basicData[type]
      }
      const res = await user_info_edit(formData)
      if (res.code == 200) {
        this.$message.success(res.msg)
        this.userBool = {
          headIcon: false,
          userName: false,
          email: false
        }
        this.getUserInfo()
        return
      }
      this.$message.error(res.msg)
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
    async httpRequest(type, files) {
      console.log(res, process.env.VUE_APP_FILE_URL)
      const formData = new FormData()
      formData.append('file', files.file) // 文件名

      const res = await uploadImg(formData)

      if (res.code == 200) {
        this.authenticationData[type] = process.env.VUE_APP_FILE_URL + res.data
        return
      }
      this.$message.error(res.msg)
    },
    async httpRequest1(files) {
      const formData = new FormData()
      console.log('---')
      formData.append('file', files.file) // 文件名
      const res = await uploadImg(formData)
      console.log(res, process.env.VUE_APP_FILE_URL)
      if (res.code == 200) {
        this.basicData.head_img = res.data
        this.setUser('head_img')
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
      formData.front = formData.cardFront
      formData.back = formData.cardBack
      const { bool, msg } = this.validateData([formData.store_name, formData.name, formData.card_no, formData.front, formData.back],
        ['商户名称', '名称', '身份证号', '身份证正面', '身份证反面'])

      if (!bool) {
        this.$message.error(msg)
        return
      }
      const res = await authentication(formData)
      if (res.code == 200) {
        this.$message.success(res.msg)
        this.getUserInfo()
        return
      }
      this.$message.error(res.msg)
    },
    async getUserInfo() {
      const res = await user_info()
      // console.log(res,'---')
      if (res.code == 200) {
        res.data.created_at = convertTimestampToDateString(res.data.created_at)
        this.basicData = res.data
      }
    },
    tabClick(e) {
      console.log(e)
      if (+e.index == 1) {
        this.paymentChannel()
      }
      if (+e.index == 2) {
        this.getUserInfo()
      }
    },
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
    },
    openMaterialsDialog() {
      this.$refs.materialsDialogRef.openDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

::v-deep .el-input__inner{
  border-top-right-radius: 6px !important;
  border-bottom-right-radius: 6px !important;
}
.pagination {
    padding-bottom: 47px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
}

::v-deep .el-pager {
    .active {
        background: linear-gradient(0deg, #5B80EE 0%, #3E63F4 100%);
        font-size: 14px;
        color: white;
        border-radius: 5px;
    }
}

.personal-data-container {
    flex-grow: 1;
    min-height: 10%;

    display: flex;
    flex-direction: column;

    .tabs-container {
        height: 100%;
        flex-grow: 1;

        display: flex;
        flex-direction: column;

        ::v-deep.el-tabs__header {
            margin-bottom: 2px;
            border-radius: 10px 10px 0 0;
            background-color: #fff;

            .el-tabs__nav-wrap {
                margin-bottom: 0;
                overflow: visible;

                &::after {
                    content: none;
                }
            }

            .el-tabs__nav-scroll {
                overflow: visible;
            }

            .el-tabs__nav {
                padding: 22px 0 22px;
                float: none;

                .el-tabs__active-bar {
                    bottom: -2px;
                }

                .el-tabs__item {
                    padding-right: 0;
                    padding-left: 32px;
                    font-size: 18px;
                    color: #333333;
                    line-height: normal;
                    height: auto;
                    font-weight: 800;

                    &.is-active {
                        color: $subMenuHover;
                    }
                }
            }
        }

        ::v-deep.el-tabs__content {
            border-radius: 0 0 10px 10px;
            flex-grow: 1;

            display: flex;
            flex-direction: column;

            .el-tab-pane {
                display: flex;
                flex-direction: column;
                height: 100%;
                flex-grow: 1;
                align-items: flex-start;

                .tab-pane-container {
                    overflow-y: auto;
                    width: 100%;
                    padding: 38px 32px;
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
            }

            .add-address-btn {
                margin-top: 18px;
                margin-bottom: 8px;

                i {
                    margin-right: 10px;
                    border: 1px solid #fff;
                    padding: 2px;
                    font-size: 12px;
                }
            }

            .basic-data-form {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                flex-grow: 1;

                .left-form,
                .right-form {
                    padding-right: 176px;
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                }
            }

            .authentication-form {
                display: flex;
                flex-direction: column;
                margin: 0 auto;
                width: 100%;
                max-width: 40%;
            }

            .edit-btn {
                display: flex;
                justify-content: center;
            }

            .el-table {
                .el-tag {
                    padding: 0;
                    background-color: transparent;
                    border: none;
                }
            }

            .input-box {
                margin-bottom: 25px;
                display: flex;

                &:last-child {
                    margin-bottom: 0;
                }

                &.label-border {
                    .el-form-item__label {
                        border: 1px solid #c0c4cc;
                        border-right: none;
                        border-radius: 6px 0 0 6px;
                        padding: 14px 0 14px 32px;
                        min-width: 130px;
                    }
                }

                .avatar {
                    margin-left: 32px;
                    border-radius: 50%;
                    height: 50px;
                    width: 50px;
                    overflow: hidden;
                    background-color: rgba(0, 0, 0, 0.3);
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

                    .el-input__inner {
                        border: 1px solid #c0c4cc;
                        padding-left: 32px;
                        border-radius: 0;
                        height: 100%;
                    }

                    .el-date-editor.el-input {
                        width: 100%;
                    }

                    .no-bg-btn {
                        margin-left: 32px;
                        padding: 0;
                        background-color: transparent;
                        border: none;
                        color: #1890ff;
                        width: 100px;
                        text-align: left;

                        &[disabled] {
                            color: #c0c4cc;
                        }
                    }
                }
            }

            .id-card-container {
                margin-top: 13px;
                margin-bottom: 48px;
                display: flex;
                justify-content: space-between;

                .id-card-box {
                    width: 33.33%;

                    .illustrate {
                        margin-bottom: 22px;
                        color: #333333;

                        span {
                            color: #858585;
                        }
                    }

                    .upload-com {
                        .el-upload {
                            width: 100%;
                        }

                        .el-upload-dragger {
                            border: none;
                            height: auto;
                            width: 100%;
                        }

                        .pic {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}</style>
