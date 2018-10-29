
import Vue from 'vue'
import axios from 'axios'
const baseLocal = '/apis'
const baseServer = 'http://www.dadiandesign.com'
const baseUrl = 'http://10.31.4.11/wechat/activity'
const serverUrl = 'http://test27.aijianzi.com/wechat/activity'
const onlineUrl = 'http://www.aijianzi.com/wechat/activity'
const baseUrl2 = 'http://10.9.1.28:8765/qitian/'
const baseUrl2Test = 'http://proxy.aijianzi.com/qitian/'
const redirectUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxac80073dee522e92&redirect_uri=http://proxy.aijianzi.com/index.html&response_type=code&scope=snsapi_base'

export default {
    baseUrl: baseUrl2,
    redirectUrl: redirectUrl,
    cellPhone: '18500360036',
    bus: new Vue(),
    formatRequestPost: (url, data) => {
        return axios({
            url: url,
            method: 'post',
            data: data,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    },
    checktel(tel) {
        var reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|(147))\d{8}$/;
        var re = new RegExp(reg);
        var result = re.test(tel);
        return result;
    },
    burialPoint(page){
        
        return  axios.get('http://www.aijianzi.com/wechat/activity/nginxLog', {
                    params: {
                        page: page
                    }
                }).then((res) => {
                    // alert('已埋点:'+page)
                })
    },
    loadMore(callback){
        //获取滚动条当前的位置 
        function getScrollTop() {
            var scrollTop = 0;
            if(document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if(document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        }

        //获取当前可视范围的高度 
        function getClientHeight() {
            var clientHeight = 0;
            if(document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            } else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        }

        //获取文档完整的高度 
        function getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }
        
        //滚动事件触发
        window.onscroll = function() {
            if(getScrollTop() + getClientHeight() == getScrollHeight()) {
                setTimeout(() => {
                    callback()
                },500)
            }
        }
    },
    getCookie(key){
        // 获取当前域下所有的 cookie，保存到 cookies 数组中
		var cookies = document.cookie.split("; ");
		// 遍历 cookies 数组中的每个元素
		for (var i = 0, len = cookies.length; i < len; i++) {
			// cookies[i] : 当前遍历到的元素，代表的是 "key=value" 意思的字符串，
			// 将字符串以 = 号分割返回的数组中第一个元素表示 key，
			// 第二个元素表示 value
			var cookie = cookies[i].split("=");
			// 判断是否是要查找的 key，对查找的 key 、value 都要做解码操作
			if (decodeURIComponent(cookie[0]) === key) {
				return decodeURIComponent(cookie[1]);
			}
		}
		// 没有查找到指定的 key 对应的 value 值，则返回 null
		return null;

    },
    //获取用户userToken
    getUserToken: function(userCellphone){
        if(userCellphone){
            this.formatRequestPost(this.baseUrl+'user/userToken', {
                qUserId: userCellphone
            }).then((res) => {
                if(res.data.resultType === 1){
                    localStorage.setItem('userToken', res.data.appendData.userToken)
                }
            })
        }
    }

}
