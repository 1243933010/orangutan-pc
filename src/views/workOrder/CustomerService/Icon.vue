<template>
    <div>
        <el-dialog  :visible.sync="dialogVisible" width="30%">
            <div class="icon">
                <div class="item" v-for="(item,index) in iconList" :key="index" @click="chooseIcon(item)">
                <img :src="item.url" alt="">
                </div>
            </div>
        </el-dialog>
    </div>
</template>


<script>
// 闭嘴 大哭 调皮 尴尬 惊讶 开心 苦笑 难过 嗯 哦 浅笑 伤心 社死 生气 失望 爽 歪嘴笑 微笑 无了 无语 笑 呀 眨眼 龇牙
export default {
    data() {
        return {
            dialogVisible:false,
            iconList:[
                {label:'[闭嘴]',url:require('@/assets/chat/icon_1.png')},
                {label:'[大哭]',url:require('@/assets/chat/icon_2.png')},
                {label:'[调皮]',url:require('@/assets/chat/icon_3.png')},
                {label:'[尴尬]',url:require('@/assets/chat/icon_4.png')},
                {label:'[惊讶]',url:require('@/assets/chat/icon_5.png')},
                {label:'[开心]',url:require('@/assets/chat/icon_6.png')},
                {label:'[苦笑]',url:require('@/assets/chat/icon_7.png')},
                {label:'[难过]',url:require('@/assets/chat/icon_8.png')},
                {label:'[嗯]',url:require('@/assets/chat/icon_9.png')},
                {label:'[哦]',url:require('@/assets/chat/icon_10.png')},
                {label:'[浅笑]',url:require('@/assets/chat/icon_11.png')},
                {label:'[伤心]',url:require('@/assets/chat/icon_12.png')},
                {label:'[社死]',url:require('@/assets/chat/icon_13.png')},
                {label:'[生气]',url:require('@/assets/chat/icon_14.png')},
                {label:'[失望]',url:require('@/assets/chat/icon_15.png')},
                {label:'[爽]',url:require('@/assets/chat/icon_16.png')},
                {label:'[歪嘴笑]',url:require('@/assets/chat/icon_17.png')},
                {label:'[微笑]',url:require('@/assets/chat/icon_18.png')},
                {label:'[无了]',url:require('@/assets/chat/icon_19.png')},
                {label:'[无语]',url:require('@/assets/chat/icon_20.png')},
                {label:'[笑]',url:require('@/assets/chat/icon_21.png')},
                {label:'[呀]',url:require('@/assets/chat/icon_22.png')},
                {label:'[眨眼]',url:require('@/assets/chat/icon_23.png')},
                {label:'[龇牙]',url:require('@/assets/chat/icon_24.png')},
            ]
        }
    },
    methods: {
        openDialog(){
            this.dialogVisible  = true;
        },
        chooseIcon(item){
            
            this.$emit('chooseIcon',item)
            this.dialogVisible  = false;
        },
    }
}
</script>

<style lang="scss" scoped>
.icon{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .item{
        width: 35px;
        margin: 3px;
        img{
            width: 100%;
        }
    }
}

</style>