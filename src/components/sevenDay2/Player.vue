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
        <Chat />
    </div>
    
</template>

<script>
    import LMC from '../common/lmc.js' 
    import Chat from './Chat.vue'

    export default {
        data(){
            return {
                playerUrl: 'http://10.31.4.133:8080/#/?appId=aijianzi_t&roomId=11198&userId=s19258&role=student&subGroupId=386&random=4acef9569ab245fd9838a5fe912fc7d0&expire=1540882258&appSign=A83BBD5FE656A4F7F2FA747DD304734E&subGroupName=%E9%BB%98%E8%AE%A4%E7%8F%AD%E7%BA%A7&nickname=%E5%A4%A7%E5%8F%94%E5%A4%A7%E5%A9%B6%E5%A5%A5%E6%9C%AF%E5%A4%A7%E5%B8%88%E5%A4%A7&courseId=573&knowledgeId=3235&replay=true'
            }
        },
        computed:{},
        components:{
            Chat
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
                return initParams
            },
            initPlayer(params){
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
                        },
                        im: { //即时通信模块
                            'onlyGroupMsg': true, //是否只显示本组消息
                            'emojiBtn': 'emojiBtn1', // 弹出emoji包的按钮
                            'voiceBtn': 'voiceBtn', // 弹出语音功能的按钮
                            'textMsgSendBtn': 'text_msg_send_btn', // 文本消息发送按钮
                            'textMsgInput': 'send_msg_text', // 文本消息发送按钮
                            'emojis': { // emoji表情符号
                                'append': false, //默认是true,
                                'emojiTextTemplate' : '[${content}]',
                                'emojiImgBox': 'emoji-img-box', //表情包图片容器
                                'imgs': {
                                    "微笑": "image/emojis/smile.png",
                                    "可爱": "image/emojis/blush.png",
                                    "呲牙": "image/emojis/grin.png",
                                    "喜欢": "image/emojis/heart_eyes.png",
                                    "吐舌头": "image/emojis/stuck_out_tongue_closed_eyes.png",
                                    "调皮": "image/emojis/stuck_out_tongue_winking_eye.png",
                                    "激动": "image/emojis/joy.png",
                                    "不屑": "image/emojis/unamused.png",
                                    "哼": "image/emojis/smirk.png",
                                    "酷": "image/emojis/sunglasses.png",
                                    "呆": "image/emojis/neutral_face.png",
                                    "飞吻": "image/emojis/kissing_heart.png",
                                    "生气": "image/emojis/angry.png",
                                    "闪瞎": "image/emojis/astonished.png",
                                    "瞪眼": "image/emojis/flushed.png",
                                    "难受": "image/emojis/pensive.png",
                                    "愤怒": "image/emojis/rage.png",
                                    "纠结": "image/emojis/confounded.png",
                                    "怒": "image/emojis/triumph.png",
                                    "困": "image/emojis/sleeping.png",
                                    "吃惊": "image/emojis/fearful.png",
                                    "汗": "image/emojis/sweat.png",
                                    "惊恐": "image/emojis/scream.png",
                                    "大哭": "image/emojis/sob.png",
                                    "花": "image/emojis/rose.png",
                                    "西瓜": "image/emojis/watermelon.png",
                                    "一百分": "image/emojis/100.png",
                                    "厉害": "image/emojis/thumbsup.png",
                                    "ok": "image/emojis/ok_hand.png",
                                    "鼓掌": "image/emojis/clap.png",
                                    "胜利": "image/emojis/v.png",
                                    "祈祷": "image/emojis/pray.png",
                                    "不听": "image/emojis/hear_no_evil.png",
                                    "不说": "image/emojis/speak_no_evil.png",
                                    "不看": "image/emojis/see_no_evil.png",
                                    "魔性": "image/emojis/trollface.png"
                                }
                                // [{//表情图片数据'name' : 'DaXiao','url' : 'xxxxx.gif'} ]
                            },
                            'chatItemsBox': 'chatItemsBox', //聊天消息区容器
                            'chatItemRender': function(msg) { //聊天内容渲染器,
                                // showMsgItem(msg);
                                alert(JSON.stringify(msg))
                            },
                        }
                    }
                })
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
</style>


