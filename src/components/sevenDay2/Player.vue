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
            <div id="chatItemsBox" class="messageScreen" ref="messageScreen">
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
                initParams: {},
                getVideoTimer: null
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
            }
            
        },
        mounted(){
            //设置播放不自动全屏
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
                    clearInterval(this.getVideoTimer)
                    this.getVideoTimer = null
                },1000)
            }
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
                    border: 0px;
                    border-radius: 0px;
                    width: 300px;
                    height: 48px;
                    outline: none;
                    padding-left: 5px;
                    background: powderblue;
                }
                .button{
                    background: greenyellow;
                    color: #FFF;
                    font-size: 25px;
                    font-weight: bold;
                    line-height: 58px;
                    width: 100px;
                    height: 58px;
                }
            }
        }
    }
</style>


