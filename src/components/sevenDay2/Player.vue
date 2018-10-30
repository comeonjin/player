<template>
    <div class="playerContainer">
        <div id="window">
            <div id="view">
                <div id="player-box-container" class="col-md-12 col-xs-12 player-box">
                    <div id="mianPlayerBox" style="height: 100%;">
                    </div>
                    <div id="auxPlayerBox">
                    </div>
                    <div id="audioPlayerBox">
                    </div>
                </div>
                <div class="view-bottom">

                </div>
            </div>
        </div>
        <!-- <Chat /> -->
        <div class="chatBox">
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
    </div>
    
</template>

<script>
    import LMC from '../common/lmc.js' 
    import Chat from './Chat.vue'
    import Message from './Message.vue'

    export default {
        data(){
            return {
                // playerUrl: 'http://10.31.4.133:8080/#/?appId=aijianzi_t&roomId=11198&userId=s19258&role=student&subGroupId=386&random=4acef9569ab245fd9838a5fe912fc7d0&expire=1540882258&appSign=A83BBD5FE656A4F7F2FA747DD304734E&subGroupName=%E9%BB%98%E8%AE%A4%E7%8F%AD%E7%BA%A7&nickname=%E5%A4%A7%E5%8F%94%E5%A4%A7%E5%A9%B6%E5%A5%A5%E6%9C%AF%E5%A4%A7%E5%B8%88%E5%A4%A7&courseId=573&knowledgeId=3235&replay=true'
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
                initParams: {}
            }
        },
        computed:{},
        components:{
            Chat,
            Message
        },
        created(){
            
            if(window.location.href.split('?')[1]){
                this.initPlayer(this.getParams())
                console.log(this.getParams())
            }
            // //参数说明(后三个): 课程id 课节id userToken
            // let url = common.baseUrl+'play/'+this.$route.params.playType+'/'+this.currentCourseId+'/'+this.currentKnowledgeId+'/'+localStorage.getItem('userToken')
            // alert('视频播放url: __'+url)
            // axios.get(url).then((res)=> {
            //     alert(JSON.stringify(res.data.appendData))
            //     if(res.data.resultType === 1){
            //         this.initPlayer(res.data.appendData)
            //     }else{
            //         alert(res.data.message)
            //     }
            // })
            // this.initPlayer({
            //     "role":"student",
            //     "headerUrl":"http%3A%2F%2Ftest27.aijianzi.com%2F%2Fupload%2Fhead%2F15739_big.jpg",
            //     "replay":true,
            //     "userId":"s15739",
            //     "roomId":"4531",
            //     "knowledgeId":2303,
            //     "subGroupName":"",
            //     "random":"9a6b5273e3044341a7d74482ce834f10",
            //     "appSign":"8087AB8C230A628066DB62391D6943B3",
            //     "appId":"aijianzi_test",
            //     "subGroupId":"0",
            //     "expire":1534564516,
            //     "serverType":"LMC",
            //     "nickname":"%E5%98%BF%E5%98%BF%E5%93%88%E5%93%88",
            //     "courseId":149})
        },
        mounted(){
            console.log(document.getElementById('send_msg_text'))
        },
        methods: {
            getParams(){
                let initParams = {}
                decodeURI(window.location.href).split('?')[1].split('&').map((item) => {
                    initParams[item.split('=')[0]] = item.split('=')[1]
                })
                this.initParams = initParams
                return initParams
            },
            initPlayer(params){
                const context = this
                LMC.init({
                    appConfig: {
                        // 应用配置
                        lmcServer: "https://lmc.91haoke.com/core",
                        cacheJs: true, // 是否缓存JavaScript文件,默认不缓存
                        appId: params.appId, // 应用id
                        appSign: params.appSign, // 应用授权签名,
                        expire: params.expire, //鉴权到期时间
                        random: params.random, //鉴权随机字符串
                        debug: true, //是否输出调试信息
                        errorPage: null, // 加载错误页面,
                        repeatPage: null, // 重复登录错误页面,
                        timeoutPage: null, // 鉴权超时错误页面
                        volume: 80 // 默认音量
                    },

                    liveConfig: {
                        // 直播配置
                        roomId: params.roomId // 直播间id
                    },

                    userConfig: {
                        // 用户配置
                        userId: params.userId, // 用户身份标识
                        nickname: params.nickname, // 用户身份标识
                        headerUrl: params.headerUrl, // 用户头像路径
                        role: params.role, // ['teacher','assistant','student']  用户权限，可以自行扩展
                        subGroupId: params.subGroupId, //用户分组id,如果所属多个分则用逗号分隔,如果属于全部组则subGroupId为ALL
                        onlyGroupMsg: true //设置用户是否只显示组内消息
                    },

                    modules: {
                        //模块配置
                        notify: {
                            //初始化完成
                            onInitCompleted: function(self) {
                                console.log(self)
                            },
                            onTextMsgSend: function(msg) { //当发送普通消息时回调
                                alert(JSON.stringify(msg))
                                LMC.debugLog('onTextMsgSend');
                                LMC.debugLog(msg);
                            },
                        },
                        im: { //即时通信模块
                            'onlyGroupMsg': true, //是否只显示本组消息
                            // 'emojiBtn': 'emojiBtn1', // 弹出emoji包的按钮
                            // 'voiceBtn': 'voiceBtn', // 弹出语音功能的按钮
                            'textMsgSendBtn': 'text_msg_send_btn', // 文本消息发送按钮
                            'textMsgInput': 'send_msg_text', // 文本消息发送按钮
                            'chatItemsBox': 'chatItemsBox', //聊天消息区容器
                            'chatItemRender': function(msg) { //聊天内容渲染器,
                                // showMsgItem(msg);
                                // context.currentMessage = msg.content
                                context.renderMessage(msg.content, context.formateTime(msg.time*1000), msg.fromAccount)
                                // debugger
                                console.log("**********************************",msg)
                                // context.sendMessage(context.formateTime(msg.time))
                                
                            },
                        }
                    }
                })
            },
            sendMessage(date) {
                
                console.log(LMC.getStatus().speaking)
                debugger

                if (LMC.getStatus().speaking !== 'off') {
                    if(this.currentMessage !== ''){
                        LMC.sendTextMsg(this.currentMessage);
                    }
                }
            },
            renderMessage(message,date,userId){
                const messageData = {
                    direction: this.initParams.userId === userId ? 'right' : 'left',
                    portrait: '../../../assets/portrait.jpg',
                    name: 'GACZE',
                    date: date,
                    message: message,
                };
                if (message !== '') {
                    this.currentMessage = ''
                    this.messageList.push(messageData);
                    this.$nextTick(() => {
                        this.$refs.messageScreen.scrollTop = (this.$refs.messageScreen.scrollHeight - this.$refs.messageScreen.clientHeight);
                    })
                }
            },
            handleScroll() {
                console.log(this.$refs.messageScreen.scrollTop);
            },
            outputHeight() {
                console.log('元素高度', this.$refs.messageScreen.clientHeight);
                console.log('元素内容区高度', this.$refs.messageScreen.scrollHeight);
            },
            formateTime(timeValue){
                let date = new Date(timeValue*1000)
                const timeString = `${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
                return timeString
            },
        }
    }
</script>

<style lang="less" scoped>
    // #window{
    //     position: absolute;
    //     width: 100%;
    //     height: 100%;
    //     background: #fff;
    // }
    @font-size: 20px;

    .playerContainer{
        .chatBox{
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
    }
</style>


