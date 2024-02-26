<template>
    <div>
        <el-dialog title="附件" :visible.sync="dialogVisible" width="30%" >
           <img style="width: 100%;" :src="url" alt="">
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            url:''
        };
    },
    methods: {
       previewImg(url){
        this.url = ''
        this.dialogVisible = true;
        this.url = url;
       }
    }
};
</script>