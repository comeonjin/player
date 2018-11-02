<template>
    <div class="messageContainer">
        <div class="messageTop">
            <div class="nickName" :style="{float: messageDataSource.direction}">
                 {{messageDataSource.name}}
            </div>
            <div class="messageTime" :style="{float: messageDataSource.direction}">
                {{messageDataSource.date}}
            </div>
        </div>
        <div class="messageContent" :style="{textAlign: messageDataSource.direction}">
            {{messageDataSource.message}}
        </div>
    </div>
</template>
    
<script>
    export default {
        props: {
            messageDataSource: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                
            }
        }
    };
</script>

<style lang="less" scoped>
    @font-size: 30px;
    .messageContainer{
        width: 100%;
        min-height: 50px;
        overflow: hidden;
        margin-bottom: 20px;
        box-sizing: border-box;
        .messageTop{
            box-sizing: border-box;
            padding: 0 20px;
            height: 40px;
            .nickName{
                height: 40px;
                line-height: 45px;
                font-size: @font-size;
                color: #3498db;
                font-weight: bold;
            }
            .messageTime{
                font-size: 25px;
                color: #aaa;
                height: 40px;
                line-height: 45px;
                padding: 0 10px;
            }
        }
        .messageContent{
            width: 98%;
            font-size: @font-size;
            background: #fff;
            border-radius: 5px;
            padding: 15px 20px;
            box-sizing: border-box;
            line-height: 50px;
        }
    }
</style>