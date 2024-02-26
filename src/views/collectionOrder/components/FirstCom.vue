<template>
    <div>
        <div class="dialog-label">
            <span>温馨提示:当前账号因为资金交易异常，已被冻结，不可操作!请联系官方客服处理，官方电话: 10086.</span>
        </div>

        <div class="submit-btn">
            <div class="btn1 flex-content">确认收款</div>

            <div class="btn2 flex-content" @click="closeFnc">认证商家</div>
        </div>
    </div>
</template>



<script>
export default{
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.flex-content {
    display: flex;
    justify-content: center;
    align-items: center;
}
.dialog-label{
    color: #333333;
    font-size: 14px;
    padding-top: 49px;
    padding-left: 29px;
    margin-bottom: 83px;
}

.submit-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin-bottom: 36px;

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
        .btn3{
            width: 120px;
            height: 42px;
            background-color: #F1F1F1;
            color: #7B7B7F;
            border-radius: 6px;
        }
    }
</style>