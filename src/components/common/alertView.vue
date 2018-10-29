<template>
    <div class="alertview" v-if="arg.alertFlag">
        <div class="title">
            提示
        </div>
        <div class="content">{{arg.alertcontent}}</div>
        <button class="confirm" @click="handleAlertviewClick">确定</button>
    </div>
</template>

<script>
    export default {
        props:{
            arg: {
                type: Object,
                required: true
            }
        },
        data(){
            return {

            }
        },
        mounted(){

        },
        methods: {
            handleAlertviewClick(){
                this.$emit('stateChange', false)
                if(this.arg.callback !== undefined){
                    this.arg.callback()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .alertview{
        width: 500px;
        background: #fff;
        box-shadow: 5px 5px 15px #888888;
        z-index: 200;
        padding: 10px 0 0px;
        border-radius: 15px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .title{
            height: 60px;
            line-height: 60px;
            font-size: 30px;
            font-weight: bold;
        }
        .content{
            box-sizing: border-box;
            padding: 20px 35px;
            font-size: 25px;
            border-bottom: 1px solid #ccc;
            color: #999;
        }
        .confirm{
            display: inline-block;
            width: 100%;
            height: 100%;
            padding: 0 25px;
            border: 0;
            border-radius: 0 0 15px 15px;
            font-size: 30px;
            color: #26a2ff;
            height: 80px;
        }
    }
</style>


