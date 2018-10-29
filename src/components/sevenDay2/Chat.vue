<template>
    <div class="chatContainer">
        <div id="chatItemsBox" class="messageScreen" @scroll="handleScroll" ref="messageScreen">
            <Message v-for="(item, index) in messageList" :key="index" :messageDataSource="item" />
        </div>

        <div class="inputMessage">
            <input id="send_msg_text" class="input" type="text" v-model="currentMessage">
            <div id="text_msg_send_btn" class="button" @click="sendMessage">
                发送 
            </div>
        </div>
    </div>
</template>

<script>
import Message from './Message';

export default {
    name: 'chat',
    data() {
        return {
            messageList: [{
                direction: 'left',
                portrait: '../../../assets/portrait.jpg',
                name: 'GACZE',
                date: '10-20 21:07',
                message: '老师们辛苦了老师们辛苦了',
            }, {
                direction: 'right',
                portrait: '../../../assets/portrait.jpg',
                name: 'GACZE',
                date: '10-20 21:07',
                message: '老师们辛苦了老师们辛苦了老师们辛苦了',
            }, {
                direction: 'right',
                portrait: '../../../assets/portrait.jpg',
                name: 'GACZE',
                date: '10-20 21:07',
                message: '老师们辛苦了老师们辛苦了老师们辛苦了老师们辛苦了',
            }, {
                direction: 'left',
                portrait: '../../../assets/portrait.jpg',
                name: 'GACZE',
                date: '10-20 21:07',
                message: '老师们辛苦了老师们辛苦了老师们辛苦了老师们辛苦了老师们辛苦了',
            }],
            currentMessage: '',

        };
    },
    mounted() {
        this.outputHeight();
    },
    // watch: {
    //     messageList(){
    //         this.$nextTick(() => {
    //             this.$refs.messageScreen.scrollTop = (this.$refs.messageScreen.scrollHeight - this.$refs.messageScreen.clientHeight + 61);
    //         })
    //     },
    // },
    methods: {
        sendMessage() {
            const messageData = {
                direction: 'left',
                portrait: '../../../assets/portrait.jpg',
                name: 'GACZE',
                date: '10-20 21:07',
                message: this.currentMessage,
            };
            if (this.currentMessage !== '') {
                this.messageList.push(messageData);
                this.currentMessage = '';
                this.outputHeight();
                this.$nextTick(() => {
                    this.$refs.messageScreen.scrollTop = (this.$refs.messageScreen.scrollHeight - this.$refs.messageScreen.clientHeight);
                })
            }
            // if (LMC.getStatus().speaking == 'off') {
            //     showAlert('禁言中');
            // } else {
            //     if ($.trim($("#send_msg_text").val()) == '') {
            //         $("#send_msg_text").val('');
            //         showAlert('请输入内容');
            //         return;
            //     }
            //     LMC.sendTextMsg(_barrageColor + "/*/" + $('#send_msg_text').val());
            //     $('#send_msg_text').val('');
            //     $("#text_msg_num").html(50 - $("#send_msg_text").val().length);
            // }
        },
        handleScroll() {
            console.log(this.$refs.messageScreen.scrollTop);
        },
        outputHeight() {
            console.log('元素高度', this.$refs.messageScreen.clientHeight);
            console.log('元素内容区高度', this.$refs.messageScreen.scrollHeight);
        },
    },
    updated() {
        console.log('updated');
    },
    components: {
        Message,
    },
};
</script>

<style lang="less" scoped>
    @font-size: 20px;

    .chatContainer{
        .messageScreen{
            background: orange;
            height: 300px;
            overflow-y: auto;
        }
        .inputMessage{
            background: lightsalmon;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 60px;
            .input{
                display: block;
                border: 0px;
                width: 300px;
                height: 48px;
                outline: none;
                padding-left: 5px;
            }
            .button{
                background: greenyellow;
                color: #FFF;
                font-size: @font-size;
                line-height: 50px;
                width: 100px;
                height: 50px;
            }
        }
    }
</style>
