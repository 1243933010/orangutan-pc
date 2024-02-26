<template>
    <div>
        <DirectiveDialog ref="dialog" :title="title">
            <div class="content">
                <div class="form" v-if="formType == 'headImg'">
                    <div class="form-item">
                        <div class="form-item-title">商家头像</div>
                        <div class="form-item-right1">
                            <el-upload class="upload-com" action="" :fileList="[]" :show-file-list="false"
                                :http-request="(files) => httpRequest(files)" :before-upload="beforeAvatarUpload"
                                :limit="1">
                                <img class="icon-file" src="../../assets/user_icon.png" alt="">
                            </el-upload>
                            <!-- <div class="form-item-right-input"><el-input  v-model="iunput" /></div> -->
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="form-item-title">商家名称</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input v-model="iunput" /></div>
                        </div>
                    </div>
                </div>
                <div class="form" v-if="formType == 'rate'">
                    <div class="form-item">
                        <div class="form-item-title">收款汇率</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input v-model="iunput" /></div>
                        </div>
                    </div>
                </div>
                <div class="form" v-if="formType == 'time'">
                    <div class="form-item">
                        <div class="form-item-title">支付时长</div>
                        <div class="form-item-right">
                            <div class="form-item-right-input"><el-input v-model="iunput" /></div>
                        </div>
                    </div>
                </div>
                <div class="submit-btn">
                    <div class="btn1 flex-content" @click="$emit('getMessage')">确定</div>
                    <div class="btn2 flex-content" @click="$refs.dialog.close()">关闭</div>
                </div>
            </div>
        </DirectiveDialog>
    </div>
</template>


<script>
import DirectiveDialog from "@/components/DirectiveDialog/index";
import {   uploadImg} from '@/api/project'

export default {
    components: { DirectiveDialog },
    data() {
        return {
            formType: '',
            dialogVisible: false,
            title: '',
            iunput: '',
            headImg: ''
        }
    },
    methods: {
        async httpRequest(files) {
            const formData = new FormData();
            formData.append("file", files.file);  //文件名
            let res = await uploadImg(formData)
            console.log(res, process.env.VUE_APP_FILE_URL)
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.headImg = res.data
                return
            }
            this.$message.error(res.msg)
        },
        beforeAvatarUpload(file) {
            const isIMG = file.type.includes('image');

            if (!isIMG) {
                this.$message.error('上传头像只能是图片!');
            }
            return isIMG;
        },
        loadForm(type) {
            this.formType = type;
            // this.dialogVisible = true;
            let info = { headImg: '修改个人信息', rate: '修改汇率', time: '修改支付时长' };
            this.title = info[type];
            this.$refs.dialog.openDialog()
        },
        handleClose() {
            return false
        }
    }
}
</script>


<style lang="scss" scoped>
::v-deep .el-input__inner {
    border: 1px solid white;
    height: 100%;
}

::v-deep .el-input-group__append {
    background: #F5F7FA;
    border: none;
    color: #3D64F4;
    cursor: pointer;
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
    padding: 13px 25px;

    .form {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .flex-row {
            width: 45%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .form-item,
        .form-items {
            width: 45%;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 49px;

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
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }

            .form-item-see {
                color: #597FEE;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                border-left: none;
            }

            .form-item-chat {
                background-color: #F4B63F;
                color: white;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                border-left: none;
                position: relative;

                .chat_icon {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background-color: #FF5C0C;
                    box-sizing: border-box;
                    // padding: 3px 7px;
                    border-radius: 50%;
                    line-height: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .form-item-right1{
                padding-left: 10px;
                .icon-file{
                    width: 50px;
                    border-radius: 50%;
                }
            }
            .form-item-right {
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                

                .form-item-right-input {
                    height: 42px;
                    box-sizing: border-box;
                    border-top: 1px solid #F1F1F1;
                    border-bottom: 1px solid #F1F1F1;
                    border-right: 1px solid #F1F1F1;
                    // padding: 14px 20px;
                    // margin-bottom: 12px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    span {
                        padding-left: 21px;
                        color: #333333;
                        font-size: 14px;
                    }
                }

                .form-item-right-label {
                    color: #8E8E8E;
                    font-size: 14px;
                }

            }
        }

        .form-items {
            width: 45%;
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
}

.submit-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-top: 30px;

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

    .btn3 {
        width: 120px;
        height: 42px;
        background-color: #F1F1F1;
        color: #7B7B7F;
        border-radius: 6px;
    }
}</style>