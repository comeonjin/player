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
        <div class="chatBox" v-if="chatItemsBoxHeight !== 0">
            <div class="chatTitle">
                聊天
            </div>
            <div id="chatItemsBox" :style="{height: chatItemsBoxHeight}" class="messageScreen" ref="messageScreen">
                <Message v-for="(item, index) in messageList" :key="index" :messageDataSource="item" />
            </div>

            <div class="inputMessage">
                <input id="send_msg_text" class="input" type="text" :disabled="noSpeaking" v-model="currentMessage">
                <div id="text_msg_send_btn" class="messageSendButton" :class="{noSpeak: noSpeaking}" @click="sendMessage">
                    {{buttonContent}} 
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
    import LMC from '../common/lmc.js' 
    import Chat from './Chat.vue'
    import Message from './Message2.vue'

    export default {
        data(){
            return {
                // playerUrl: 'http://10.31.4.133:8080/#/?appId=aijianzi_t&roomId=11198&userId=s19258&role=student&subGroupId=386&random=4acef9569ab245fd9838a5fe912fc7d0&expire=1540882258&appSign=A83BBD5FE656A4F7F2FA747DD304734E&subGroupName=%E9%BB%98%E8%AE%A4%E7%8F%AD%E7%BA%A7&nickname=%E5%A4%A7%E5%8F%94%E5%A4%A7%E5%A9%B6%E5%A5%A5%E6%9C%AF%E5%A4%A7%E5%B8%88%E5%A4%A7&courseId=573&knowledgeId=3235&replay=true'
                messageList: [],
                //v-model 了input输入框
                currentMessage: '',
                //保存从url中获取的参数对象
                initParams: {},
                //一个interVal timer对象用于检查video dom对象是否已经渲染
                getVideoTimer: null,
                //动态获取聊天区域的高度
                chatItemsBoxHeight: 0,
                noSpeaking: true,
                //上课状态码 1未开始 2上课 3休息 4下课
                playerStatus: 0
            }
        },
        computed:{
            buttonContent(){
                return this.noSpeaking ? '禁言中' : '发送'
            }
        },
        components:{
            Chat,
            Message
        },
        created(){
            //页面加载获取参数对象
            if(window.location.href.split('?')[1]){
                this.initPlayer(this.getParams())
            }
            
        },
        mounted(){
            //设置播放时不自动全屏播放
            this.setVideo()  
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
                                LMC.debugLog('onTextMsgSend');
                                LMC.debugLog(msg);
                            },
                            onPollingTrigger: function(status){
                                // alert(JSON.stringify(status))
                                context.noSpeaking = (status.speaking === 'off')
                            }
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
                                context.renderMessage(msg.content, context.formateTime(msg.time), msg.fromAccount, msg.fromAccountNick)
                                // debugger
                                // console.log("**********************************",msg)
                                // context.sendMessage(context.formateTime(msg.time))
                                
                            },
                        },
                        
                    }
                })
            },
            sendMessage(date) {
                console.log(LMC.getStatus().speaking)
                if (this.speaking !== 'off') {
                    if(this.currentMessage !== ''){
                        LMC.sendTextMsg(this.currentMessage);
                    }
                }
            },
            renderMessage(message,date,userId,nickname){
                const messageData = {
                    direction: this.initParams.userId === userId ? 'right' : 'left',
                    name: nickname,
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
            
            formateTime(timeValue){
                function add0(value){
                    let res = value < 10 ? '0'+value : value
                    return res 
                }
                let date = new Date(timeValue*1000)
                let month = add0(date.getMonth()+1);
                let day = add0(date.getDate());
                let hours = add0(date.getHours());
                let minutes = add0(date.getMinutes());

                
                const timeString = `${month}-${day} ${hours}:${minutes}`
                return timeString
            },
            //设置移动端播放器播放时不自动全屏
            setVideo(){
                this.getVideoTimer = setInterval(() => {
                    if(!document.getElementsByTagName('video')[0]){
                        return
                    }
                    const video = document.getElementsByTagName('video')[0]
                    video.setAttribute('webkit-playsinline', true)
                    video.setAttribute('playsinline', true)
                    video.setAttribute('x5-playsinline', true)

                    //获取到video标签后,计算聊天区域高度
                    this.getCurrentVideoHeight()
                    clearInterval(this.getVideoTimer)
                    this.getVideoTimer = null

                },1000)
            },
            getCurrentVideoHeight(){
                console.log('video window height is: ++++++++++++++++++++++++++++',document.getElementById('window').offsetHeight)
                console.log('client window height is: ++++++++++++++++++++++++++++',document.body.clientHeight)            
                this.chatItemsBoxHeight = (document.body.clientHeight-document.getElementById('window').offsetHeight-100) + 'px'
            },
            
        }
    }
</script>

<style lang="less" scoped>
    
    .playerContainer{
        .chatBox{
            box-sizing: border-box;
            padding: 0 20px;
            background: #eee;

            .chatTitle{
                line-height: 55px;
                font-size: 30px;
                font-weight: bold;
                color: #555;
                border-bottom: 1px solid #ccc;
                text-align: left;
                background: #eee;
            }
            .messageScreen{
                overflow-y: auto;
            }
            .inputMessage{
                position: fixed;
                width: 100%;
                left: 0;
                background: #FFF;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                height: 80px;
                .input{
                    font-size: 25px;
                    border: 1px solid #aaa ;
                    border-radius: 1px;
                    width: 530px;
                    height: 55px;
                    outline: none;
                    padding: 0 15px;
                    -webkit-appearance: none; //去掉内阴影
                    &:focus{
                        border-color: #1ab394;
                    }

                }
                .messageSendButton{
                    background: #1ab394;
                    color: #FFF;
                    font-size: 30px;
                    font-weight: bold;
                    line-height: 62px;
                    width: 120px;
                    height: 60px;
                    border-radius: 5px;
                    
                }
                .noSpeak{
                    background: rgb(235, 235, 228);
                    color: #aaa;
                }
            }
        }
    }
</style>


