/*/**
 * @copyright: [2016,gaosiedu.com]
 * @version: [v1.0.1]
 * @author: [lixun]
 * @description 直播媒体中心封装工具类
 * 
 */

function LmcTools() {

	// 控制台输出对象
	var console = window.console || {};
	
	var _version = '1_0_3';
	
	// 构造初始化
	function init() {
		console.log = console.log || (console.log = opera.postError);
		console.log = console.log || (window.alert);
		var date = new Date();
		var time = date.getTime() / 1000;
		_version = '' + (time - time % 86400);
	}

	// 执行初始化
	init();

	this.version = _version;
	
	/**
	 * 调用函数
	 * 
	 * @param callbackName
	 *            函数名
	 * @param obj
	 *            函数对象
	 * @param param
	 *            函数调用时输入的实参
	 */
	this.callFunction = function(callbackName, obj, param) {
		if (!callbackName) {
			return false;
		}
		obj = obj || window;
		var _function = obj[callbackName];
		if (_function && typeof _function == 'function') {
			var returnValue =  _function(param);
			if(typeof returnValue != 'undefined' && typeof returnValue == 'boolean'){
				return returnValue;
			}
			return true;
		}
		return false;
	}

	/**
	 * 合并数据
	 * 
	 * @author lixun
	 * @param
	 */
	this.mergeData = function(data1, data2) {
		$.extend(true, data1, data2);
		return data1;
	}

	/**
	 * 异步加载脚本
	 */
	this.loadScript = function(url, callback, cacheJs) {
		if (!url || !url.length || url == '') {
			return false;
		}
		if (url instanceof Array) {
			var rand = Math.random();
			var len = url.length;
			var countName = '__loadScript__' + rand + '__count';
			var successName = '__loadScript__' + rand + '__success';
			window[countName] = 0;
			window[successName] = true;
			for ( var i in url) {
				this.loadScript(url[i], function(error) {
					if (!error) {
						window[successName] = false;
					}
					window[countName] = window[countName] + 1;
					if (window[countName] == len && callback) {
						callback(window[successName]);
						window[countName] = null;
						window[successName] = null;
					}
				}, cacheJs);
			}
		} else if (typeof url == 'string') {

			window['__loadScript__'] = window['__loadScript__'] || {};
			if (window['__loadScript__'][url] == 'loaded') {
				if (callback) {
					callback(true);
				}
				return;
			}
			window['__loadScript__'][url] = 'loadding';

			var script = document.createElement('script');
			script.type = 'text/javascript';
			if (callback) {
				script.onload = function() {
					if (script.readyState && script.readyState != 'loaded'
							&& script.readyState != 'complete') {
						return;
					}
					script.onload = null;
					window['__loadScript__'][url] = 'loaded';
					callback(true);
					return;
				};

				script.onerror = function() {
					script.onerror = null;
					window['__loadScript__'][url] = 'error';
					callback(false);
					return;
				};
			}

			// script.onreadystatechange = function() {
			// if (script.readyState && script.readyState != 'loaded'&&
			// script.readyState != 'complete'){
			// callback(false);
			// }
			// script.onreadystatechange = null;
			// return;
			// };
			if (cacheJs == false) {
				script.src = url + (url.indexOf('?') > -1 ? '&v=' : '?v=')
						+ new Date().getTime();
			} else {
				script.src = url + (url.indexOf('?') > -1 ? '&v=' : '?v=') + this.version;
			}
			document.getElementsByTagName('body')[0].appendChild(script);
		}
	}

	/**
	 * 输出调试日志
	 */
	this.debugLog = function(log) {
		console.debug(log);
	}

	/**
	 * 输出带参数的url
	 */
	this.urlParam = function(url, param, encode) {
		url = url || '';
		// 判断是否有问号
		var haveQmark = url.indexOf('?') > -1;
		if (!haveQmark) {
			url += '?';
		}
		param = param || {};
		url += $.param(param);
		return url;
		// url = url || '';
		// if (typeof encode == 'undefined') {
		// encode = false;
		// }
		// // 判断是否有问号
		// var haveQmark = url.indexOf('?') > -1;
		// if (!haveQmark) {
		// url += '?';
		// }
		//		
		// var haveParam = url.indexOf('&') > -1;
		// param = param || {};
		//
		// var first = true;
		// for ( var key in param) {
		// if (key == '__proto__') {
		// continue;
		// }
		// if (first) {
		// if (!haveParam) {
		// url += '&';
		// }
		// first = false;
		// } else {
		// url += '&';
		// }
		// var value = param[key];
		// var t = typeof (param);
		//			
		// if (value instanceof Array) {
		// for ( var index in value) {
		// var newValue = {
		// key : value[index]
		// };
		// url += this.urlParam('&', newValue, encode);
		// }
		// } else if (t == 'string' || value instanceof String
		// || t == 'number' || value instanceof Number
		// || t == 'boolean' || value instanceof Boolean) {
		// url += ('' + key);
		// if (encode) {
		// url += ('' + encodeURIComponent(value));
		// } else {
		// url += ('' + value);
		// }
		// } else if (t == 'object') {
		// url += this.urlParam('&', value, encode);
		// }
		// }
		// return url;
	}

	/**
	 * 解析json数据
	 */
	this.parseJson = function(str) {
		if (!str) {
			return null;
		}
		var json = null;
		try {
			json = $.parseJSON(str);
		} catch (e) {
			try {
				json = $.parseJSON("(" + str + ")");
			} catch (e) {
				try {
					json = $.parseJSON('(' + str + ')');
				} catch (e) {
					json = eval('(' + str + ')');
				}
			}
		}
		return json;
	}

	/**
	 * 对象转字符串
	 */
	this.jsonStringify = function(obj) {
		if (!obj) {
			return '';
		}
		if (JSON && JSON.stringify) {
			return JSON.stringify(obj);
		}
	}

	
	/**
	 * 判断是否为pc端
	 * @returns {Boolean}
	 */
	this.isMobile = function() {
		return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) ? true: false;
	}
	
	/**
	 * 判断浏览器是否为微信浏览器
	 * 
	 * @returns {Boolean}
	 */
	this.isWeiXin = function () {
		if(!this.isMobile()){
			return false;
		}
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
 			return true;
		} else {
			return false;
		}
	}  

	/**
	 * 设置统一的缓存版本号
	 */
	this.setCahceVersion = function(version){
		this.version = version;
	};
	
	/**
	 * 获取统一的缓存版本号
	 */
	this.getCahceVersion = function(){
		return this.version;
	};


	//字符串序列
	this.allCharts = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    /**
     * 对象转字符串
     */
    this.uuid16 = function() {
    	var uuid = [16];
        for (var i = 0; i < 16; i++) {
            uuid[i] =this.allCharts[Math.floor(Math.random() * this.allCharts.length)];
        }
        return uuid.join("");
    }

    /**
	 * 生成整形的uuid
     * @returns {number}
     */
    this.uuidInt = function() {
        return Math.round(Math.random() * 4294967296);
    }



}

/**
 * @copyright: [2016,gaosiedu.com]
 * @version: [v1.0.1]
 * @author: [lixun]
 * @description 直播媒体中心封装即时通信类
 * 
 */
function LmcIm(options) {

	/**
	 * 工具函数
	 */
	this.tools = new LmcTools();

	/**
	 * im 配置
	 */
	this.config = {
		'loginInfo' : {},
		'listeners' : {},
		'options' : {},
		'baseConfig' : {},
		'notify' : {},
		'userContainer' : {}
	};

	/**
	 * 当前对象
	 */
	var _this = this;

	/**
	 * im基础控制器
	 */
	var _imBase = null;

	/**
	 * im 初始化
	 */
	this.init = function(param) {

		_imBase = new WebImBaseControllor();
		_imBase.setTools(_this.tools);

		var imConfig = param.imConfig;
		_this.config.baseConfig = param.imConfig || {};
		_this.config.clientConfig = param.clientConfig || {};
		_this.config.notify = param.notify || {};
		_this.config.userContainer = param.userContainer || {};

		// 官方 demo appid,需要开发者自己修改（托管模式）
		var sdkAppID = imConfig.sdkAppID;

		// 默认群组头像(选填)
		var selSessHeadUrl = param.imUserConfig.headerUrl || param.imConfig.headerUrl;
		_this.config.baseConfig.selType = webim.SESSION_TYPE.GROUP;
		_this.config.baseConfig.selToID = imConfig.avChatRoomId;
		_this.config.baseConfig.selSess = null;
		_this.config.baseConfig.selSessHeadUrl = selSessHeadUrl;

		// 当前用户身份
		var loginInfo = {
			'userId' : imConfig.userId,//系统中用户id,
			'appId' : imConfig.appId,//当前应用id
			'sdkAppID' : sdkAppID, // 用户所属应用id,必填
			'appIDAt3rd' : sdkAppID, // 用户所属应用id，必填
			'accountType' : imConfig.accountType, // 用户所属应用帐号类型，必填
			'identifier' : imConfig.identifier, //      当前用户ID,必须是否字符串类型，选填
			'identifierNick' : param.imUserConfig.nickname || imConfig.identifierNick || '匿名用户', // 当前用户昵称，选填
			'userSig' : imConfig.userSign, // 当前用户身份凭证，必须是字符串类型，选填
			'headerUrl' : param.imUserConfig.headerUrl,// 当前用户默认头像，选填,
			'subGroupId' : param.imUserConfig.subGroupId, // 分组id,
			'role' : param.imUserConfig.role,// 用户在直播间中的角色,
			'onlyGroupMsg' : param.imUserConfig.onlyGroupMsg
		// 设置用户是否只显示组内消息
		};

		_this.config.loginInfo = loginInfo;

		var isAccessFormalEnv = true;// 是否访问正式环境

		var isLogOn = param.debug;// 是否在浏览器控制台打印sdk日志
		// 其他对象，选填
		var options = {
			'isAccessFormalEnv' : isAccessFormalEnv,// 是否访问正式环境，默认访问正式，选填
			'isLogOn' : isLogOn // 是否开启控制台打印日志,默认开启，选填
		};

		_this.config.options = options;
		// 登录im系统
		_imBase.sdkLogin(_this.config);
	}

	/**
	 * 发送自定义消息
	 */
	this.sendCustomMsg = function(msg) {
		_imBase.sendCustomMsg(msg);
	}
	
	/**
	 * 发送文本消息
	 */
	this.sendTextMsg = function(msg,toUserId,messageId) {
		_imBase.sendTextMsg(msg,toUserId,messageId);
	}
	
	/**
	 * 获取emoji数据
	 */
	this.getEmojis = function() {
		return _imBase.getEmojis();
	}
	

	/**
	 * 主动调用显示消息
	 */
	this.showMessage = function(msg) {
		if (!msg) {
			return false;
		}
		msg.fromClient = true;
		_imBase.showMessage(msg);
	}
	
//	/**
//	 * 推送用户数据
//	 */
//	this.pushUserData = function(userList){
//		_imBase.pushUserData(_this.config);
//	}
}

/**
 * @copyright: [2016,gaosiedu.com]
 * @version: [v1.0.1]
 * @author: [lixun]
 * @description 直播媒体中心控制器核心对象
 */
function LmcController() {
	/**
	 * 当前对象
	 */
	var _this = this;
	
	/**
	 * 回调函数-通知函数容器
	 */
	var _notify = null;

	/**
	 * 当前用户是否活动状态判断,如果用户重复登录之后则活动状态变回false
	 */
	var _isActive = true;

	/**
	 * 心跳轮询定时器保存参数
	 */
	var _heartbeatIntervalId = null;

	/**
	 * 心跳数据轮询间隔(5分钟轮询一次)
	 */
	var _heartbeatInterval = 5 * 60 * 1000;

	/**
	 * 心跳轮询(用户状态)定时器保存参数
	 */
	var _statusHeartbeatIntervalId = null;
	
	/**
	 * 心跳数据轮询(用户状态)间隔(5分钟轮询一次)
	 */
	var _statusHeartbeatInterval = 5 * 60 * 1000;
	
	/**
	 * 用户积分统计数据轮询间隔(5分钟轮询一次)
	 */
	var _userPointCountIntervalId = null;

	/**
	 * 用户积分统计数据轮询间隔(5分钟轮询一次)
	 */
	var _userPointCountInterval = 5 * 60 * 1000;
	
	/**
	 * 未收到用户状态轮询判断用户离线的超时时长(心跳周期+20秒)
	 */
	var _userOffLineTimeOut = _statusHeartbeatInterval + 20 * 1000;
	
	/**
	 * 及时通信参数
	 */
	var _imOptions = null;

	/**
	 * 直播间状态
	 */
	var _status = {
		'liveUserCount' : 0, // 在线用户数量
		'liveGroupUserCount' : 0,// 同组在线用户数量
		'userStatus' : 'normal', // '
		'liveStatus' : 'wait', // live --> 直播中 , suspend -->暂停 end -->直播结束,
		'serverTime' : new Date().getTime(),// 服务器时间默认没有的情况下以客户端时间代替
		'serverTimeDiff' : 0,// 客户端与服务器端的时间差
		'liveStartTime' : 0, // 直播开始时间
		'liveSuspendTime' : 0,// 直播暂停时间
		'liveEndTime' : 0, // 直播结束时间
		'endTime' :0, //直播预计开始时间
		'startTime' : 0, //直播预计结束 时间
		'speaking' : 'on', // 禁言 off 表示禁言
		'barrage' : 'off', // 弹幕 off 表示使用弹幕,
		'bgmusic' : 'stop',//背景音乐开关,play表示播放,stop表示结束
		'bgmusicUrl' : '',//背景音乐url
		'orientation' :'', //屏幕方向
		'currentMediaIndex' : null, //当前的媒体对象
		'liveUserIds' : ''
	};

	/**
	 * 媒体中心配置数据
	 */
	var _lmcBase = null;

	/**
	 * 命令数据
	 */
	var _cmd = {};
	
	/**
	 * 命令附加参数数据
	 */
	var _cmdData = {};

	/**
	 * 播放器集合
	 */
	var _player = {};

	/**
	 * 主要的主播媒体对象
	 */
	var _mainAnchorRoomMedia = null;
	
	/**
	 * 鉴权后的媒体(用户正在使用的媒体)
	 */
	var _signedRoomMedia = null;

	/**
	 * 内部容器(用于存放播放器参数)
	 */
	var _innerContainer = {};

	/**
	 * 存放用户的容器
	 */
	var _userContainer = {};

	/**
	 * 将用户压入容器
	 */
	var _pushUserToContainer = function(user){
		if(!user || !user.userId){
			return false;
		}
		var userId = user.userId;
		user.self = user.userId == _this.options.userConfig.userId;
		if (user.self) {
			if(user.speaking == 'off'){
				_status.speaking = 'off';
			}
		}
		var temp =  _userContainer[userId];
		if(!temp){
			if (_status.liveUserIds.indexOf(";"+userId+";") == -1) {
				_status.liveUserIds=_status.liveUserIds+";"+userId+";";
			if(!user.lastLoginTime || (user.lastLoginTime >= _status.serverTime - _userOffLineTimeOut)){
				if(!user.lastLoginTime){
					user.lastLoginTime = _status.serverTime;
				}
				user.isOnline = true;
				_status.liveUserCount++;
				if(user.subGroupId == _this.options.userConfig.subGroupId || _this.options.userConfig.subGroupId == 'ALL') {
					_status.liveGroupUserCount++;
				}
			} else {
					user.isOnline = false;
				}
			user.pointValue = user.pointValue || 0;
			_userContainer[userId] = user;
			_this.tools.callFunction('onUserJoin',_notify, user);
			}
		}else{
			var change = false;
			if (temp.pointValue != user.pointValue) {
				change = true;
				temp.pointValue = user.pointValue || temp.pointValue;
			}
			if (temp.subGroupId != user.subGroupId) {
				change = true;
				temp.subGroupId = user.subGroupId || temp.subGroupId;
			}
			if ( temp.lastLoginTime != user.lastLoginTime && temp.lastLoginTime != undefined) {
				change = true;
				temp.lastLoginTime = user.lastLoginTime || temp.lastLoginTime;
				if(!temp.isOnline) {
					temp.isOnline = true;
						_status.liveUserCount++;
						if(user.subGroupId == _this.options.userConfig.subGroupId || _this.options.userConfig.subGroupId == 'ALL') {
							_status.liveGroupUserCount++;
						}
				}
			} else if(temp.lastLoginTime == undefined || temp.isOnline == undefined) {
				change = true;
				temp.lastLoginTime = user.lastLoginTime || _status.serverTime;
				temp.isOnline = true;
			}
			if (temp.role != user.role) {
				change = true;
				temp.role = user.role || temp.role;
			}
			if (temp.nickname != user.nickname) {
				change = true;
				temp.nickname = user.nickname || temp.nickname;
			}
			if (temp.headerUrl != user.headerUrl) {
				change = true;
				temp.headerUrl = user.headerUrl || temp.headerUrl;
			}
			if (temp.speaking != user.speaking) {
				change = true;
				temp.speaking = user.speaking || temp.speaking;
			}
			if (temp.extData != user.extData) {
				change = true;
				temp.extData = user.extData || temp.extData;
			}
			if(change){
				_this.tools.callFunction('onUserChange',_notify, temp);
			}
		}
		
	}
	
	/**
	 * 心跳实现
	 */
	var _heartbeatImpl = function() {
		_requestLmcData({
			'action' : 'putHeartbeat',
			'data' : {
				'headerUrl' : _this.options.userConfig.headerUrl,
				'extData' :  _this.options.userConfig.extData
			},
			'success' : function(json) {
				_status.serverTime = json.serverTime || _status.serverTime;
//				_lmcBase.usesrCounts = json.data;
//				_flushStatus([ {
//					'name' : 'liveUserCount'
//				}, {
//					'name' : 'liveGroupUserCount'
//				} ]);

				// 轮询触发
				_pollingTrigger();
			}
		});
	}

	/**
	 * 心跳实现
	 */
	var _statusHeartbeatImpl = function() {
		var data = _this.tools.mergeData({},_userContainer[_this.options.userConfig.userId]);
		// 计算当前在线的用户
		_this.im.sendCustomMsg({
			'type' : 'userStatusPolling',
			'data' : data
		});
	}
	
	/**
	 * 用户积分获取轮询实现
	 */
	var _userPointCountPollingImpl = function() {
		_requestLmcData({
			'action' : 'getUserPointCount',
			'success' : function(json) {
				if(!json || json.error || !json.data){
					return false;
				}
				_lmcBase.userPointCount = json.data;
			},
			'error' : function(err) {
			}
		});	
	}

	/**
	 * 发送心跳数据
	 */
	var _heartbeat = function() {
		if (_heartbeatIntervalId) {
			return false;
		}
		_heartbeatImpl();
		_heartbeatIntervalId = setInterval(function() {
			if (!_isActive) {
				if (_heartbeatIntervalId) {
					clearInterval(_heartbeatIntervalId);
				}
			} else {
				_heartbeatImpl();
			}
		}, _heartbeatInterval);
	}

	/**
	 * 发送(状态)心跳数据-状态数据仅仅发送至客户端
	 */
	var _statusHeartbeat = function() {
		if (_statusHeartbeatIntervalId) {
			return false;
		}
		// 状态轮询
		_statusHeartbeatImpl();
		_statusHeartbeatIntervalId = setInterval(function() {
			if (!_isActive) {
				if (_statusHeartbeatIntervalId) {
					clearInterval(_statusHeartbeatIntervalId);
				}
			} else {
				_statusHeartbeatImpl();
			}
		}, _statusHeartbeatInterval);
	}
	
	
	/**
	 * 用户积分统计轮询
	 */
	var _userPointCountPolling = function() {
		if (_userPointCountIntervalId) {
			return false;
		}
		// 状态轮询
		_userPointCountPollingImpl();
		_userPointCountIntervalId = setInterval(function() {
			if (!_isActive) {
				if (_userPointCountIntervalId) {
					clearInterval(_userPointCountIntervalId);
				}
			} else {
				_userPointCountPollingImpl();
			}
		}, _userPointCountInterval);
	}

	/**
	 * 轮询触发
	 */
	var _pollingTrigger = function() {
		_this.tools.callFunction('onPollingTrigger', _notify, _status);
	}

	/**
	 * 时间修正
	 */
	var _timeCorrect = function() {
		_status.serverTime += 1000;
	}
	
	/**
	 * 用户在线人数修正
	 */
	var _userCountCorrect = function (){
		if(!_userContainer){
			return false;
		}
		for ( var userId in _userContainer) {
			if (!userId) {
				continue;
			}
			var user = _userContainer[userId];
			if(!user){
				continue;
			}
			
			if(!user.lastLoginTime || (user.lastLoginTime <  _status.serverTime - _userOffLineTimeOut)){
				if(user.isOnline == true) {
					user.isOnline = false;
					_status.liveUserCount--;
					if(user.subGroupId == _this.options.userConfig.subGroupId || _this.options.userConfig.subGroupId == 'ALL') {
						_status.liveGroupUserCount--;
					}
					_this.tools.callFunction('onUserChange',_notify, user);
				}
			}
		}
	}

	/**
	 * 加载直播间配置
	 * 
	 * @param 加载参数
	 */
	var _requestLmcData = function(param, isAsync) {
		var _appConfig = _this.options.appConfig;
		var _liveConfig = _this.options.liveConfig;
		var _userConfig = _this.options.userConfig;

		// 基础数据
		var baseData = {
			'appId' : _appConfig.appId,
			'appSign' : _appConfig.appSign,
			'expire' :  _appConfig.expire,
			'random' : _appConfig.random,
			'roomId' : _liveConfig.roomId,
			'userId' : _userConfig.userId,
			'role' : _userConfig.role,
			'subGroupId' : _userConfig.subGroupId,
			'nickname' : _userConfig.nickname,
			'isFromMobile' : _this.tools.isMobile(),
			'dataType' : 'jsonp'
		};

		var data = param.data || {};

		var newData = {};
		_this.tools.mergeData(newData, data);
		_this.tools.mergeData(newData, baseData);

		if (typeof isAsync == 'undefined') {
			isAsync = true;
		}
		$.ajax({
			async : !!isAsync,
			url : _appConfig.lmcServer + '/' + param.action,
			type : "POST",
			dataType : 'jsonp',
			jsonp : 'jsoncallback',
			data : newData,
			timeout : 5000,
			success : function(json) {// 客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数
				var json = json;
				_this.debugLog('lmcData : ');
				_this.debugLog(json);
				_this.tools.callFunction('success', param, json);
			},
			error : function(xhr) {
				_this.tools.callFunction('onError', {
					'type' : 'getLmcConfigError'
				});
			}
		});
	}


	/**
	 * 判断分组id是否为同组
	 */
	var _isSameGroup = function(groupId) {
		if (!groupId) {
			return false;
		}
		if(groupId == 'ALL'){
			return true;
		}
		var userSubGroupId = _this.options.userConfig.subGroupId;
		var subgroupIds = groupId.split(',');
		var userSubgroupIds = userSubGroupId.split(',');

		var sameGroup = false;
		for ( var subgroupId in subgroupIds) {
			for ( var userSubgroupId in userSubgroupIds) {
				if (subgroupIds[subgroupId] == userSubgroupIds[userSubgroupId]) {
					sameGroup = true;
					break;
				}
			}
			if (sameGroup) {
				break;
			}
		}
		return sameGroup;
	}

	/**
	 * 获取命令参数数据
	 */
	var _getCmdParam = function(type, skipClientParam) {
		if (!skipClientParam) {
			var temp = _cmd[type];
			if (temp) {
				return temp;
			}
		}
		var target = _getSameGroupCmd(type);
		if(!target){
			return null;
		}
		if (target == null) {
			return {};
		}
		_cmd[type] = target.value;
		return target.value;
	}

	
	/**
	 * 获取命令参数附加数据
	 */
	var _getCmdData = function(type, skipClientParam) {
		if (!skipClientParam) {
			var temp = _cmdData[type];
			if (temp) {
				return temp;
			}
		}
		var target = _getSameGroupCmd(type);
		if(!target){
			return {};
		}
		_cmdData[type] = target.cmdData;
		return target.cmdData;
	}
	
	
	/**
	 * 获取同组命令
	 */
	var _getSameGroupCmd = function(type){
		if (!_lmcBase.cmdDatas || !_lmcBase.cmdDatas.length) {
			return null;
		}
		var cmdDatas = _lmcBase.cmdDatas;
		var target = null;
		var target1 = null;
		var target2 = null;
		var target3 = null;
		var temp = null;
		if(type == 'speaking' && _this.options.userConfig.role == 'student') {
			var person = 1,
				group = 1,
				room = 1;

			for ( var i in cmdDatas) {
			var cmd = cmdDatas[i];
			if(!cmd){
				continue;
			}
			if (type == cmd.type) {
				temp = cmd;
				if (!cmd.receiveSubgroupId || cmd.receiveSubgroupId != 'ALL') {
					var sameGroup = _isSameGroup(cmd.receiveSubgroupId);
					var self = cmd.receiveUserId && cmd.receiveUserId == _this.options.userConfig.userId;
					if (!sameGroup && !self) {
						continue;
					} else if(sameGroup) {/*
							if(cmd.receiveSubgroupId == 'ALL') {
								if (null == target1 || temp.arriveTime > target1.arriveTime) {
									target1 = cmd;
									if(cmd.value == 'on') {
											room = 1;
										} else if(cmd.value == 'off') {
											room = 0;
										}
								}
							} else {*/
								if (null == target2 || temp.arriveTime > target2.arriveTime) {
									target2 = cmd;
									if(cmd.value == 'on') {
										group = 1;
									} else if(cmd.value == 'off') {
										group = 0;
									}
								}
							/*}*/
					} else if(self) {
						if (null == target3 || temp.arriveTime > target3.arriveTime) {
							target3 = cmd;
							if(cmd.value == 'on') {
								person = 1;
							} else if(cmd.value == 'off') {
								person = 0;
							}
						}
					}
				}else if(cmd.receiveSubgroupId == 'ALL') {
					if (null == target1 || temp.arriveTime > target1.arriveTime) {
						target1 = cmd;
						console.log(cmd);
						if(cmd.value == 'on') {
							room = 1;
						} else if(cmd.value == 'off') {
							room = 0;
						}
						console.log(room);
					}
				}
				if (!target) {
					target = Object.assign({}, temp);
				} /*else {
					// 取出命令到达时间最晚的命令
					if (temp.arriveTime > target.arriveTime) {
						target = temp;
					}
				}*/
				if( person && group && room) {
					target.value = 'on';
				} else {
					target.value = 'off';
				}
			}
		}
		return target;
		} else {
		for ( var i in cmdDatas) {
			var cmd = cmdDatas[i];
			if(!cmd){
				continue;
			}
			if (type == cmd.type) {
				if (!cmd.receiveSubgroupId || cmd.receiveSubgroupId != 'ALL') {
					var sameGroup = _isSameGroup(cmd.receiveSubgroupId);
					var self = cmd.receiveUserId && cmd.receiveUserId == _this.options.userConfig.userId;
					if (!sameGroup && !self) {
						continue;
					}
				}
				temp = cmd;
				if (!target) {
					target = cmd;
				} else {
					// 取出命令到达时间最晚的命令
					if (temp.arriveTime > target.arriveTime) {
						target = temp;
					}
				}
			}
		}
		return target;
		}
	}
	
	/**
	 * 刷新状态
	 * 
	 * @param flush
	 *            如果我true表示强制取出服务端的命令,如果为false则表示可以取出客户端缓存的命令
	 */
	var _flushStatus = function(flushList) {

		if (!flushList) {
			flushList = [ {
				'name' : 'liveStatus'
			}, {
				'name' : 'speaking'
			}, {
				'name' : 'barrage'
			}, {
				'name' : 'bgmusic'
			}, {
				'name' : 'liveUserCount'
			}, {
				'name' : 'liveGroupUserCount'
			} ];
		}

		if (flushList) {
			for ( var i in flushList) {
				var field = flushList[i];
				var name = field.name;
				var skipClientParam = field.skip;
				if (name == 'liveStatus') {
					_status.liveStatus = _getCmdParam('liveStatus',skipClientParam) || _status.liveStatus;
				} else if (name == 'speaking') {
					_status.speaking = _getCmdParam('speaking', skipClientParam) || _status.speaking;
				} else if (name == 'barrage') {
					_status.barrage = _getCmdParam('barrage', skipClientParam) || _status.barrage;
				} else if (name == 'bgmusic') {
					_status.bgmusic = _getCmdParam('bgmusic', skipClientParam) || _status.bgmusic;
				} else if (name == 'liveUserCount') {
//					if (_lmcBase.usesrCounts) {
//						_status.liveUserCount = 0;
//						for ( var i in _lmcBase.usesrCounts) {
//							var usesrCount = _lmcBase.usesrCounts[i];
//							var subgroupId = usesrCount.subgroupId;
//							var count = usesrCount.count;
//							if (count > 0) {
//								_status.liveUserCount += count;
//							}
//						}
//						if (_status.liveUserCount == 0) {
//							_status.liveUserCount = 1;
//						}
//					}
				} else if (name == 'liveGroupUserCount') {
//					if (_lmcBase.usesrCounts) {
//						_status.liveGroupUserCount = 0;
//						for ( var i in _lmcBase.usesrCounts) {
//							var usesrCount = _lmcBase.usesrCounts[i];
//							var subgroupId = usesrCount.subgroupId;
//							var count = usesrCount.count;
//							if (_isSameGroup(subgroupId) && count > 0) {
//								_status.liveGroupUserCount += count;
//							}
//						}
//						if (_status.liveGroupUserCount == 0) {
//							_status.liveGroupUserCount = 1;
//						}
//					}
				}
			}
		}
	}
	
	/**
	 * 发送自定义消息实现
	 */
	var _sendCustomMsgImpl = function(msg){
		var data = msg.data || {};
		var type = msg.type;
		var messageCofings = _lmcBase.messageConfigs;
		if(!messageCofings){
			return false;
		}
		var messageConfig = messageCofings[type];
		if(!messageConfig){
			_this.tools.callFunction('onCustomMsgRejected',_notify, {'error' : 'undefined','msg' : msg});
			return false;
		}
		// 发送自定义消息最的次数限制
		var max = messageConfig.maxValue || 0;
		// 发送自定义消息发送时间间隔
		var interval = messageConfig.intervalValue || 0;
		// 指定可发送对应消息的用户
		var users = messageConfig.users;
		// 制定可发送对应消息的角色
		var roles = messageConfig.roles;
		
		var userId = _this.options.userConfig.userId;
		var role = _this.options.userConfig.role;
		// 校验权限
		var allow = true;
		if((users && users.length) || (roles && roles.length)){
			allow = false;
			if(users && users.length){
				for(var i in users){
					if(userId == users[i]){
						allow = true;
						break;
					}
				}
			}
			if(!allow && (roles && roles.length)){
				for(var i in roles){
					if(role == roles[i]){
						allow = true;
						break;
					}
				}
			}
		}
		
		if(!allow){
			_this.tools.callFunction('onCustomMsgRejected',_notify, {'error' : 'not_allow','msg' : msg});
			return false;
		}
		
		var messageFlagType = data.flag || type;
		var messageId = userId + '_' + type + '_' + messageFlagType;
		
		var time = (new Date()).getTime();
		
		var selfCustomMessage = _lmcBase.selfCustomMessageList[messageId];
		if(!selfCustomMessage){
			selfCustomMessage = {};
			selfCustomMessage.time = time;
			selfCustomMessage.previousTime = time;
			selfCustomMessage.content = data.content;
			selfCustomMessage.customType = type;
			selfCustomMessage.count = 1;
			_lmcBase.selfCustomMessageList[messageId] = selfCustomMessage;
		}else {
			selfCustomMessage.content = data.content;
			var oldCount = selfCustomMessage.count || 0;
			var oldTime = selfCustomMessage.time;
			if('initCompleted' != type){ //初始化消息特殊处理
				if(max && oldCount >= max){
					_this.tools.callFunction('onCustomMsgRejected', _notify, {
						'error' : 'too_much',
						'max' : max,
						'msg' : msg
					});
					return false;
				}
				if(interval && oldTime + (interval * 1000) >= time){
					_this.tools.callFunction('onCustomMsgRejected', _notify, {
						'error' : 'too_fast',
						'lastTime' : oldTime,
						'interval' : interval,
						'time' : time,
						'msg' : msg
					});
					return false;
				}
			}
			selfCustomMessage.previousTime = oldTime;
			selfCustomMessage.count = oldCount + 1 ;
			selfCustomMessage.time = time;
		}
		_this.im.sendCustomMsg(msg);		
	}
	
	/**
	 * 计算积分
	 */
	var _prosessPoint = function(type,flag,data){
		//计算自定义消息对应积分
		var points = _lmcBase.pointConfigs || {};
		var point = points[type + '_' + flag];
		if (point) {
			var userId = _this.options.userConfig.userId;
			var messageFlagType = data.flag || type;
			var messageId = userId + '_' + type + '_' + messageFlagType;
			
			var selfCustomMessage = _lmcBase.selfCustomMessageList[messageId];
			
			// 是否允许获得积分
			var allow = true;
			if(selfCustomMessage){
				var time = selfCustomMessage.time || (new Date()).getTime();
				// 消息发送计数
				var messageCount = selfCustomMessage.count;
				// 消息发送时间
				var messageTime = selfCustomMessage.previousTime;
				// 获取积分的次数限制
				var max = point.maxValue || 0;
				// 获取积分时间间隔
				var interval = point.intervalValue || 0;
				var count = selfCustomMessage.count;
				if(max && messageCount > max){
					allow = false;
				}
				if(interval && count > 1 && (messageTime + interval * 1000) > time){
					allow = false;
				}
			}
			if(!allow){
				return false;
			}
			
			var pointValue = 0;
			var pointType = point.type;
			var complexMatch = false;
			if (!pointType || pointType == 'simple') {
				pointValue = point.pointValue;
			} else if ('complex' == pointType) {
				var target = data.content;
				var expressions = point.expressions;
				if (expressions && expressions.length) {
					var orther = null;
					for ( var i in expressions) {
						var expression = expressions[i];
						var pattern = expression.pattern;
						if (!pattern) {
							continue;
						}
						if (pattern == '_$ORTHER$_') {
							orther = expression;
						} else if (pattern == target) {
							pointValue = expression.pointValue;
							complexMatch = true;
						}
					}
					if (!pointValue && orther) {
						pointValue = orther.pointValue;
					}
				}
			}
			if(pointValue){
				pointValue = pointValue - 0;
			}
			if(pointValue){
				var self = _userContainer[_this.options.userConfig.userId];
				if(self){
					//发送积分变化通知
					_this.tools.callFunction('onGetPoint',_notify, {
						'pointValue' : pointValue,
						'type' : type,
						'pointType' : pointType,
						'complexMatch' : complexMatch
					});
					// 通知客户端用户发生变化
					var oldValue = self.pointValue;
					pointValue += (oldValue || 0);
					self.pointValue = pointValue;
					_this.tools.callFunction('onUserChange',_notify, self);
				}
			}
		}
	
	}

	/**
	 * 通知代理
	 */
	var _notifyProxy = {
		'onInitCompleted' : function(msg){
			msg = msg || {};
			_sendCustomMsgImpl({
				'type' : 'initCompleted'
			});
			_this.tools.callFunction('onInitCompleted',_notify, msg);
			return true;
		},
		'onUserDataChange' : function(msg) {
			msg = msg || {};
			if('changeProfile' == msg.type){
				_pushUserToContainer(msg.data);
			}
			return true;
		},
		'onPollingTrigger' : function(msg) {
			msg = msg || {};
			_this.tools.callFunction('onPollingTrigger',_notify, msg);
			return true;
		},
		'onImTextSend' : function(msg) {// 当im发送文本信息完成时回调
			msg = msg || {};
			
			if(msg.status == 'error'){
				_this.tools.callFunction('onError',_notify, {
					'type' : 'sendTextMsgError',
					'errInfo' : msg.errInfo
				});
				return false;
			}

			if (_status.barrage == 'on' && _this.options.modules.im.useBarrage) {
				$('#' + _this.options.modules.im.textMsgInput).val('');
				// 判断服务端允许使用弹幕且,用户允许发送弹幕,并且发送自定义消息
				_this.im.sendCustomMsg({
					'type' : 'barrage',
					'data' : {
						'content' : msg.content,
						'messageId': msg.messageId
					}
				});
			}
			
			// 将消息同步发送到lmc服务器
			_requestLmcData({
				'action' : 'saveMessage',
				'data' : {
					'messageType' : 'text',
					'messageContent' : msg.content,
					'messageId' : msg.messageId,
					'userData' : _this.tools.jsonStringify({
						'nickname' : _this.options.userConfig.nickname,
						'headerUrl' : _this.options.userConfig.headerUrl,
						'role' : _this.options.userConfig.role
					})
				}
			}, true);
			_this.tools.callFunction('onImTextSend',_notify, msg);
			return true;
		},
        'onImTextMsgArrive' : function(msg) {// 当im文本消息到达时回调
			if(!msg){
				return false;
			}
            _this.tools.callFunction('onImTextMsgArrive',_notify, msg);
            return true;
        },
		'onImCustomSend' : function(msg) {// 当im发送自定义信息完成时回调
			msg = msg || {};
			var data = msg.data || {};
			var type = data.type;
			// 将消息同步发送到lmc服务器
			if ('userLogin' == type) {
				// 开启状态轮询
				_statusHeartbeat();
			} else if('userStatusPolling' != type){
				var messageFlagType = msg.data.data.flag || type;
				_requestLmcData({
					'action' : 'saveMessage',
					'data' : {
						'messageType' : 'custom',
						'messageContent' : msg.data.data.content,
						'flag' : messageFlagType,
						'customType' : type
					}
				}, false);
				// 计算自定义消息获得的积分
				_prosessPoint(type, messageFlagType, data.data);
			}
			_this.tools.callFunction('onImCustomSend',_notify, msg);
			return true;
		},
		'onImCustomArrive' : function(msg) {// 当自定义消息到达时回调
			msg = msg || {};
			var type = msg.type;
			var data = msg.data || {};
			if ('userStatusPolling' == type) {
				// 如果是用户状态轮询消息则不用通知服务端端,而是在客户端自行处理
				var userData = data.userData || {};
				userData.lastLoginTime = _status.serverTime || (new Date()).getTime();
				if(data.msgData){
					userData.pointValue = data.msgData.pointValue;
				}
				_pushUserToContainer(userData);
				return false;
			}
			
			if ('barrage' == type) {
				_this.tools.callFunction('onImCustomArrive',_notify, msg);
				return false;
			}
			
			var points = _lmcBase.pointConfigs;
			if(points){
				var point = points[type + '_' + (data.msgData.flag || type)];
				if (point && point.type == 'multiple') {
					var data = msg.data || {};
					var msgData = data.msgData || {};
					var userId = _this.options.userConfig.userId;
					var content = msgData.content;
					var pointValue = null;
					if(content){
						contentJson = _this.tools.parseJson(content);
						if(contentJson){
							pointValue = contentJson[userId];
							if(pointValue && !isNaN(pointValue)){
								pointValue = pointValue - 0;
							}
						}
					}
					if(pointValue){
						var self = _userContainer[_this.options.userConfig.userId];
						if(self){
							//发送积分变化通知
							_this.tools.callFunction('onGetPoint',_notify, {
								'pointValue' : pointValue,
								'type' : type,
								'pointType' : point.type
							});
							// 通知客户端用户发生变化
							var oldValue = self.pointValue;
							pointValue += (oldValue || 0);
							self.pointValue = pointValue;
							_this.tools.callFunction('onUserChange',_notify, self);
						}
					}
				}
			}
			_this.tools.callFunction('onImCustomArrive',_notify, msg);
		},
		'onCommandArrive' : function(msg) {// 当自命令消息到达时回调
			msg = msg || {};
			// 命令类型,部分命令需要先进行内部处理再分发到客户端
			var type = msg.type;
			// 响应数据
			var resposeData = msg.data.resposeData || {};
			// 响应参数发送命令时的参数
			var resposeParam = msg.data.resposeParam || {};
			var cmd = resposeData.data;
			if(cmd.receiveSubgroupId && !_this.isSameGroup(cmd.receiveSubgroupId)){
				// 如果是单独发送给某一个组的命令则匹配之后再发送,不匹配则直接忽略
				return ;
			}
			if(cmd.receiveUserId && cmd.receiveUserId != _this.options.userConfig.userId){
				// 如果是单独发送给某一个用户的命令则匹配之后再发送,不匹配则直接忽略
				return ;
			}
			_lmcBase.cmdDatas.push(cmd);
			switch (type) {
			case 'changeLiveStatus': // 收到了一个变更直播状态的命令
				// 主播媒体对象
				var mediaIndex = resposeParam.mediaIndex;
				// 命令操作的媒体对象在用户所拥有的目标媒体对象
				var target = null;
				for ( var i in _lmcBase.mediaConfigs) {
					var mediaConfig = _lmcBase.mediaConfigs[i];
					if (mediaConfig.mediaIndex == mediaIndex) {
						target = mediaConfig;
						break;
					}
				}
				if (!target) {
					// 如果未找到则忽略
					return false;
				}
				
				var liveStatus = resposeParam.status;
				target.liveStatus = liveStatus;
				target.lastOptionTime = resposeData.serverTime;
				if ('start' == liveStatus) {
					target.realStartTime = resposeData.serverTime;
					_status.realStartTime = resposeData.serverTime;
				} else if ('suspend' == liveStatus) {
					target.realSuspendTime = resposeData.serverTime;
					_status.realSuspendTime = resposeData.serverTime;
				} else if ('end' == liveStatus) {
					target.realEndTime = resposeData.serverTime;
					_status.realEndTime = resposeData.serverTime;
				}
				
				_status.currentMediaIndex = mediaIndex;
				_status.serverTime = resposeData.serverTime || _status.serverTime;
				_status.serverTimeDiff = new Date().getTime() - resposeData.serverTime;
				_status.liveStatus = target.liveStatus;
				_status.lastOptionTime = target.lastOptionTime || 0;
				_status.realStartTime = target.realStartTime || 0;
				_status.liveStartTime = target.realStartTime || 0;
				_status.realEndTime = target.realEndTime || 0;
				_status.currentMediaIndex = mediaIndex;
				_status.liveStatus = liveStatus;
				_status.endTime = target.endTime || 0;
				_status.startTime = target.startTime || 0;
				
				_this.tools.callFunction('onLiveStatusChange', _notify, {
					'status' : liveStatus
				});
				
				
				// 重新检查播放器状态
				_this.checkMediaPlayer();
				_pollingTrigger();
				break;
			case 'speaking': // 收到禁言变更命令
				_flushStatus([ {
					'name' : 'speaking',
					'skip' : true
				} ]);
				var statusValue = _getCmdParam('speaking');
				_status.speaking = statusValue;

				_userContainer[_this.options.userConfig.userId].speaking = _status.speaking;//不确定

				_pollingTrigger();
				break;
			case 'barrage': // 收到弹幕变更命令
				_flushStatus([ {
					'name' : 'barrage',
					'skip' : true
				} ]);
				var statusValue = _getCmdParam('barrage');
				_status.barrage = statusValue;
				_pollingTrigger();
				break;
			case 'bgmusic': // 收到背景音乐变更消息
				_flushStatus([ {
					'name' : 'bgmusic',
					'skip' : true
				} ]);
				
				var statusValue = _getCmdParam('bgmusic');
				_status.bgmusicUrl = resposeParam.cmdData || '';
				_status.bgmusic = statusValue;
				// 重新背景音乐播放器状态
				_this.checkBgMusicPlayer();
				_pollingTrigger();
				break;
			case 'withdraw': // 收到撤回消息命令
                var messageId = resposeParam.messageId;
                if(messageId){
                    _this.tools.callFunction('onWithdrawArrive', _notify, {
                        'messageId' : messageId
                    });
				}
				break;
			default:
				break;
			}
			_this.tools.callFunction('onCommandArrive', _notify, msg);
			return true;
		},
		'onUserStatusChange' : function(msg) {// 当用户状态变化时回调
			if (msg.type == 'userLoginStatusNotify' && msg.status == 'repeat') {
				_showError('repeat', '在其他终端登录,被迫下线');
				return false;
			}else if (msg.type == 'userLoginStatusNotify' && msg.status == 'login') {
//				_status.liveUserCount++;
//				_status.liveGroupUserCount++;
				_pollingTrigger();
			} else if (msg.type == 'userLoginStatusNotify' && msg.status == 'loginSuccess') {
				// loginSuccess 只会在用户登录时自己向自己发起回调
				_this.initTextMessageList();
			}
			_this.tools.callFunction('onUserStatusChange', _notify, msg);
			return true;
		},
		'onMediaPlayerStatusChange' : function(msg) {// 当媒体播放器状态变化时回调
			msg = msg || {};
			_this.tools.callFunction('onMediaPlayerStatusChange', _notify, msg);
			return true;
		},
		'onLiveStatusChange' : function(msg) {// 当直播状态变化时回调
			msg = msg || {};
			_this.tools.callFunction('onLiveStatusChange', _notify, msg);
			return true;
		},
		'onTextMsgSend' : function(msg) {// 当发送普通消息时回调
			msg = msg || {};
			_this.tools.callFunction('onTextMsgSend', _notify, msg);
			return true;
		},
		'onCustomMsgSend' : function(msg) {// 当发送自定义消息时回调
			msg = msg || {};
			_this.tools.callFunction('onCustomMsgSend', _notify, msg);
			return true;
		},
		'onCommandSend' : function(msg) {// 当发送自定义消息时回调
			msg = msg || {};
			if (msg.status == 'success') {
				if (msg.data.data.command == 'changeLiveStatus') {
					var respose = msg.data.data.respose;
					_status.liveStatus = respose.liveStatus || respose.data.value;
					_status.serverTime = respose.serverTime;
					_pollingTrigger();
					
					// 状态改变时发送一条停止背景音乐的命令
					_this.sendCommand({
						'type' : 'bgmusic',
						param : {
							'status' : 'stop'
						}
					});
				}
			}
			_this.tools.callFunction('onCommandSend', _notify, msg);
			return true;
		},
		'onNetworkError' : function(msg) {// 网络错误
			_this.tools.callFunction('onNetworkError', _notify, msg);
			return true;
		},
        'netNetStatusChange' : function(msg) {// 网络状态变更
			if(msg.status != 'online'){
                if(msg.status == 'reconnect'){
                    //网络状态恢复重新登录
                    _this.initIm(_imOptions);
                }else if(msg.status == 'offline'){
                    _this.tools.callFunction('onNetworkError', _notify, msg);
                }
            }
            return true;
        },
        'onPrivateMsgArrive' : function(msg) {// 收到私聊消息
			_this.tools.callFunction('onPrivateMsgArrive', _notify, msg);
            return true;
        }
	}

	/**
	 * 获取主播控制媒体对象
	 */
	var _getAnchorRoomMedia = function() {
		var roomMedias = _lmcBase.mediaConfigs;
		if (roomMedias && roomMedias.length > 0) {
			for ( var i in roomMedias) {
				var roomMedia = roomMedias[i];
				var serverUsers = roomMedia['users'];
				if(serverUsers){
					for(var i in serverUsers){
						if (serverUsers[i] == _this.options.userConfig.userId) {
							return roomMedia;
						}
					}
				}
				
			}
		}
		return null;
	}

	/**
	 * 获取鉴权的媒体参数
	 */
	var _getSignedMedia = function(index) {
		var signedRoomMedias = _lmcBase.room.signedRoomMedias;
		if (signedRoomMedias && signedRoomMedias.length > 0) {
			for ( var i in signedRoomMedias) {
				var signedRoomMedia = signedRoomMedias[i];
				if (signedRoomMedia.index == index) {
					return signedRoomMedia;
				}
			}
		}
	}
	
	
	/**
	 * 获取鉴权的媒体参数-根据当前所在的组 
	 */  
	var _getSignedMediaWithGroup = function() {
		// 如果当前媒体索引未找到则更新当前媒体索引
		var userId = _this.options.userConfig.userId;
		if (!_status.currentMediaIndex) {
			var lastOptionTime = 0; // 媒体的最后操作时间,将作为时间优先依据
			var liveStatus = ''; // 媒体的最后操作状态,将作为状态优先依据
			var tempMediaConfig = null;// 临时的媒体配置对象
			for ( var i in _lmcBase.mediaConfigs) {
				var mediaConfig = _lmcBase.mediaConfigs[i];
				if(!mediaConfig.liveStatus){
					mediaConfig.liveStatus = 'wait';
				}
				if(!mediaConfig.lastOptionTime){
					mediaConfig.lastOptionTime = 0;
				}
				if (!tempMediaConfig) {
					tempMediaConfig = mediaConfig;
					continue;
				}
				if (mediaConfig.users) {
					// 如果当前用户是媒体控制者,则优先将控制者对应的媒体作为当前媒体
					// _this.options.userConfig.userId
					for ( var i in mediaConfig.users) {
						// 如果当前用户是媒体控制者,则优先将控制者对应的媒体作为当前媒体
						if (mediaConfig.users[i] == userId) {
							tempMediaConfig = mediaConfig;
							break;
						}
					}
				}
				
				// liveStatus;
				// lastOptionTime;
				// realStartTime;
				// realEndTime;
				if (!mediaConfig.lastOptionTime && !tempMediaConfig.lastOptionTime) {
					// 如果媒体操作时间都为空(都未开始)
					if(mediaConfig.isMain){
						tempMediaConfig = mediaConfig;
					}
					continue;
				}else if(tempMediaConfig.liveStatus == 'end' && mediaConfig.liveStatus != 'end'){
					// 找到未结束的直播
					tempMediaConfig = mediaConfig;
				}else if (mediaConfig.lastOptionTime > tempMediaConfig.lastOptionTime) {
					// 如果均有操作,按照时间优先原则,优先找到最后操作的媒体
					tempMediaConfig = mediaConfig;
				}
			}
			if (tempMediaConfig) {
				_status.currentMediaIndex = tempMediaConfig.mediaIndex;
				_status.endTime = tempMediaConfig.endTime;
				_status.startTime = tempMediaConfig.startTime;
				_status.liveStatus = tempMediaConfig.liveStatus;
				_status.lastOptionTime = tempMediaConfig.lastOptionTime || 0;
				_status.realStartTime = tempMediaConfig.realStartTime || 0;
				_status.liveStartTime = tempMediaConfig.realStartTime || 0;
				_status.realEndTime = tempMediaConfig.realEndTime || 0;
			}
		}
		return _getSignedMedia(_status.currentMediaIndex);
	}

	/**
	 * 检查和渲染播放器的内部实现
	 */
	var _checkMediaPlayerImpl = function() {
		// 'mianPlayerBox' : 'mianPlayerBox',//主播放器容器id(主播放器用于播放推流视频和推流白板)
		// 'auxPlayerBox' : 'auxPlayerBox',//辅助放器容器id(辅助播放器用于播放广告,摄像头等)
		// 'audioPlayerBox' : 'audioPlayerBox'//主播放器容器id(音频播放器用于播放一般声音,暖场音频等)
		// 'ignoreSuspend' : false,//是否忽略暂停命令,一般用于教师端或者助教端
		// 'ignoreEnd' : false//是否忽略暂停命令,一般用于教师端或者助教端
		var mainPlayerId = _this.options.modules.player.mianPlayerBox;
		var auxPlayerId = _this.options.modules.player.auxPlayerBox;
		var ignoreSuspend = _this.options.modules.player.ignoreSuspend;
		var ignoreEnd = _this.options.modules.player.ignoreEnd;

		if (!mainPlayerId) {
			_this.debugLog('options.modules.player.mianPlayerBox is not defined ');
			return false;
		}
		// 获取鉴权的媒体参数
		var signedMedia = _getSignedMediaWithGroup();
		
		_signedRoomMedia = signedMedia;
		var paltformType = signedMedia['paltformType'];
		var isMobile = _this.tools.isMobile();

		var $mainPlayer = $('#' + mainPlayerId);
		var $auxPlayer = $('#' + auxPlayerId);

		var innerMainPlayerId = mainPlayerId + '_inner';
		var innerAuxPlayerId = mainPlayerId + '_inner';

		var $mainPlayerInner = $mainPlayer.find('.inner');
		if ($mainPlayerInner.length == 0) {
			var $inner = $('<div/>');
			$inner.attr('class', 'inner');
			$inner.attr('id', innerMainPlayerId);
			$inner.css({
				'height': '100%',
				'width': '100%',
				'cursor': 'pointer'
			});
			$mainPlayer.append($inner);
			$mainPlayerInner = $mainPlayer.find('.inner');
		}

		var $innerAuxPlayer = $auxPlayer.find('.inner');
		if ($innerAuxPlayer.length == 0) {
			var $inner = $('<div/>');
			$inner.attr('class', 'inner');
			$inner.attr('id', innerAuxPlayerId);
			$auxPlayer.append($inner);
			$innerAuxPlayer = $auxPlayer.find('.inner');
		}
		
		//根据状态获取背景
		var bg = _this.options.modules.player.mianPlayerBoxBackground;
		var bgImg = _lmcBase.serverConfig.resourceCdn + '/images/placeholder/player_bg_' + _status.liveStatus + '.png';
		if(bg && bg[_status.liveStatus]){
			bgImg = bg[_status.liveStatus];
		}

		$mainPlayer.css({
			'background' : 'url("'+bgImg+'") no-repeat scroll 0 0 / 100% 100%'
		});

		if(_status.liveStatus == 'end'){
			
			var targetPlaybackMedia = null;
			var signedPlaybackMedias = _lmcBase.room.signedRoomPlaybackMedias;
			if(signedPlaybackMedias && signedPlaybackMedias.length){
				targetPlaybackMedia = signedPlaybackMedias[0];
			}
			
			var playbackPaltformType = null;
			if(targetPlaybackMedia != null){
				$mainPlayer.show();
				$mainPlayerInner.show();
				playbackPaltformType = targetPlaybackMedia.playbakcPlatformType;
				// pc端处理逻辑
				if ('aliyun' == playbackPaltformType) {
					var opt = {
							isLive : false,
							isMobile : isMobile,
							$mainPlayerInner : $mainPlayerInner,
							mobileVedioType : '->application/octet-stream',
							innerMainPlayerId : innerMainPlayerId,
							paltformType : playbackPaltformType
					};
					var playList = targetPlaybackMedia.playList;
					
					var mobileUrl = '';
					var pcUrls = [];
					
					//按照码率进行排序
					playList.sort(function(a,b){
						return b.bitrate - a.bitrate;
					});
					
					for(var i in playList){
						var play = playList[i];
						if(play.format == 'mp4'){
							pcUrls.push(play.url);
							mobileUrl = play.url;
						}else if(play.format == 'm3u8'){
							pcUrls.push(play.url);
							mobileUrl = play.url;
						}
					}
					opt.mobileUrl = mobileUrl;
					opt.pcUrls = pcUrls;
					_useAliyunPlay(opt);
				}
			}else{
				if ('aliyun' == paltformType) {
					if (isMobile) {
						$mainPlayerInner.hide();
						var $video = $mainPlayerInner.find('video');
						if ($video && $video.length > 0) {
							var video = $video.get(0);
							video.pause();
							$video.attr('src', 'undefined');
						}
					} else {
						$mainPlayerInner.remove();
					}
				} else if ('huantuo' == paltformType) {
					$mainPlayerInner.hide();
					var _MT = _innerContainer[paltformType + 'SDK_MAIN'];
					if (!_MT) {
						_MT.stop();
					}
				}
			}
			
			
		} else if (_status.liveStatus == 'start' || (_status.liveStatus == 'wait' && ignoreSuspend) || (_status.liveStatus == 'suspend' && ignoreSuspend)) {
			// 如果处于开始状态,
			$mainPlayer.show();
			$mainPlayerInner.show();
			// pc端处理逻辑
			if ('aliyun' == paltformType) {
				var opt = {
					isLive : true,
					isMobile : isMobile,
					$mainPlayerInner : $mainPlayerInner,
					mobileVedioType : '->application/x-mpegURL',
					innerMainPlayerId : innerMainPlayerId,
					paltformType : paltformType
				};
				var mobileUrl = '';
				var pcUrls = [];
				var FLV_URL = signedMedia.FLV_URL
				pcUrls.push(FLV_URL);
				pcUrls.push(signedMedia.HD_RTMP_URL);
				pcUrls.push(signedMedia.SD_RTMP_URL);
				opt.mobileUrl = signedMedia.M3U8_URL;
				opt.pcUrls = pcUrls;
				_useAliyunPlay(opt);
			} else if ('huantuo' == paltformType) {
				// 欢拓
				var huantuo_cdn = 'http://static-1.talk-fun.com/open';
				var huantuo_js = '';
				if (isMobile) {
					// http://static-1.talk-fun.com/open/maituo_v2/dist/live/mobile/h5/sdk-mobile.2.5.min.js?v=117114
					huantuo_js = '/maituo_v2/dist/sdk-mobile.min.js';
				} else {
					huantuo_js = '/maituo_v2/dist/sdk-pc.min.js';
				}
				_this.loadScript([ huantuo_cdn + huantuo_js ], function() {
					// 创建SDK对象
					var huantuo_auxPlayer = paltformType + '_auxPlayer';
					var huantuo_mainPlayer = paltformType + '_mainPlayer';
					$('#' + innerAudioPlayerId).show();
					$('#' + innerAuxPlayerId).show();
					var _MT = _innerContainer[paltformType + 'SDK_MAIN'];
					var access_token = signedMedia['data']['access_token'];
					if (!_MT) {
						_MT = new MT.SDK.main(access_token);
						_innerContainer[paltformType + 'SDK_MAIN'] = _MT;
						_MT.camera(innerAuxPlayerId, huantuo_auxPlayer,
								function(camera) {
									_this.debugLog('辅助播放器加载完成！');
									$(camera).hide();
								});
						_MT.mainPlayer(innerMainPlayerId, huantuo_mainPlayer,
								function(player) {
									_this.debugLog("主播放器加载完成！");
								});
					}
				});
			}
		} else if (_status.liveStatus == 'wait') {
		} else if (_status.liveStatus == 'suspend') {
			if ('aliyun' == paltformType) {
				if (isMobile) {
					$mainPlayerInner.hide();
					var $video = $mainPlayerInner.find('video');
					if ($video && $video.length > 0) {
						var video = $video.get(0);
						video.pause();
						$video.attr('src', 'undefined');
					}
				} else {
					$mainPlayerInner.remove();
				}
			} else if ('huantuo' == paltformType) {
				$mainPlayerInner.hide();
				var _MT = _innerContainer[paltformType + 'SDK_MAIN'];
				if (!_MT) {
					_MT.stop();
				}
			}
		} 
		
		// 检查音频播放器
		_checkAudioPlayerImpl();
	}

	/**
	 * 检查背景音乐播放器实现
	 */
	var _checkBgMusicPlayerImpl = function(){
		if(_status.bgmusic == 'play'){
			if(_status.liveStatus == 'wait' || _status.liveStatus == 'suspend'){
				var audioUrl = _getCmdData('bgmusic',true);
				if(audioUrl){
					_this.playAudio({
						status : 'play',
						url : audioUrl,
						loop : true
					});
				}
			}
		}else if(_status.bgmusic == 'stop'){
			_this.playAudio({
				status : 'ended'
			});
		}
	}
	/**
	 * 检查音频播放器
	 */
	var _checkAudioPlayerImpl = function() {
		var audioPlayerId = _this.options.modules.player.audioPlayerBox;
		var $audioPlayer = $('#' + audioPlayerId);
		var innerAudioPlayerId = audioPlayerId + '_inner';
		var $innerAudioPlayer = $audioPlayer.find('.inner');
		if ($innerAudioPlayer.length == 0) {
			var $inner = $('<div/>');
			$inner.attr('class', 'inner');
			$inner.attr('id', innerAudioPlayerId);
			$audioPlayer.append($inner);
			$innerAudioPlayer = $audioPlayer.find('.inner');
			var audio = '<audio></audio>';
			$innerAudioPlayer.append(audio);
		}
		var $audio = $innerAudioPlayer.find('audio');
		
		var audio = $audio.get(0);
		if(!audio){
			return false;
		}
		audio.addEventListener('play', function() {
			_this.tools.callFunction('onAudioPlayerStatuChange',  _notify, {
				'url' : audio.src,
				'status' : 'play'
			});
		}, false);
		audio.addEventListener('pause', function() {
			_this.tools.callFunction('onAudioPlayerStatuChange', _notify, {
				'url' : audio.src,
				'status' : 'pause'
			});
		}, false);
		audio.addEventListener('ended', function() {
			_this.tools.callFunction('onAudioPlayerStatuChange',  _notify, {
				'url' : audio.src,
				'status' : 'ended'
			});
		}, false);
		
		return $audio;
	}
	
	
	/**
	 * 使用阿里云播放器播放视频
	 */
	var _useAliyunPlay = function(opt){
		var isLive = opt.isLive || false;
		var isMobile = opt.isMobile || false;
		var $mainPlayerInner = opt.$mainPlayerInner;
		var mobileVedioType = opt.mobileVedioType || '->application/x-mpegURL';
		var innerMainPlayerId = opt.innerMainPlayerId;
		var paltformType = opt.paltformType;
		
		var ckplayerJsPath = '/platform/ckplayer6.8/ckplayer/ckplayer.js';
		if(!isLive){
			ckplayerJsPath = '/platform/ckplayer6.8/ckplayer/ckplayer_playback.js';
		}
		
		_this.loadScript(_lmcBase.serverConfig.resourceCdn + ckplayerJsPath,
			function() {
				window.loadedHandler = function() {
					$mainPlayerInner.css({
						'height' : '100%',
						'width' : '100%'
					});
					var $video = $mainPlayerInner.find('video');
					if ($video && $video.length > 0) {
						$video.css({
							'z-index' : '100'
						});
						$video.attr('x-webkit-airplay','true');
						$video.attr('webkit-playsinline','true');
						var video = $video.get(0);
						video.addEventListener('pause',function(e) {
							if (this.webkitExitFullscreen) {
								this.webkitExitFullscreen();
							}
						});
					}
				}
			
				var pcUrls = opt.pcUrls;
				var defaultUrl = pcUrls[0];
				var deff = '';
				var first = true;
				for(var i in pcUrls){
					if(first){
						first = false;
					}else{
						deff += '|';
					}
					deff += pcUrls[i];
				}
				
				var v = _this.options.appConfig.volume == null ? 0 : _this.options.appConfig.volume
				var flashvars={
					a : '',
					b : '0',
					c : 0,
					deff: deff,
					f : defaultUrl,
					h : '3',
					p : '1',
					lv : isLive ? '1' : '0',
				    v : v,
					loaded : 'loadedHandler'
				};
				
				if(!isLive){
					var isM3u8 = false;
					var defaultUrlSubs = defaultUrl.split('?');
					if(defaultUrlSubs && defaultUrlSubs.length > 0){
						isM3u8 = defaultUrlSubs[0].lastIndexOf('.m3u8') == (defaultUrlSubs[0].length - 5)
					}
					if(isM3u8){
						flashvars['a'] = defaultUrl;
						flashvars['f'] = _lmcBase.serverConfig.resourceCdn +  '/platform/ckplayer6.8/plugins/m3u8/m3u8.swf';
						flashvars['s'] = 4;
						flashvars['c'] = 0;
						flashvars['deff'] = null;
					}
				}
				
				var video = [];
				if (isMobile) {
					var $video = $mainPlayerInner.find('video');
					if ($video && $video.length > 0) {
						$mainPlayerInner.empty();
					}
					video.push(opt.mobileUrl + mobileVedioType);
				}
				var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
				CKobject.embed(_lmcBase.serverConfig.resourceCdn + '/platform/ckplayer6.8/ckplayer/ckplayer.swf',
						innerMainPlayerId,
						paltformType + 'ckplayer_mian',
						'100%', '100%', false,
						flashvars, video, params);
			
		});
	}
	
	
	/**
	 * 显示错误页面
	 * @param type 错误类型
	 * @param message 错误消息
	 */
	var _showError = function(type,message){
		var mainPlayerId = _this.options.modules.player.mianPlayerBox;
		var $mainPlayer = $('#' + mainPlayerId);
		$mainPlayer.find('video').attr('src','undefined');
		
		var page = null;
		if(type == 'repeat'){
			page = _this.options.appConfig.repeatPage;
		}else if(type == 'timeout'){
			page = _this.options.appConfig.timeoutPage;
		}else {
			page = _this.options.appConfig.errorPage;
		}
		$('body').empty();
		if (page) {
			window.location.href = page;
		}else{
			alert(message);
		}
		
	}
	/**
	 * 工具函数
	 */
	this.tools = new LmcTools();
	/**
	 * 即时通讯
	 */
	this.im = new LmcIm();

	/**
	 * 控制器配置选项
	 */
	this.options = {
		'appConfig' : {// 应用配置
			'lmcServer' : '/lmc/core',// 直播媒体中心服务器地址,
			'cacheJs' : false, // 是否缓存JavaScript文件,默认不缓存,
			'appId' : null,// 应用id
			'appSign' : null,// 应用授权签名,
			'expire' : 0, //鉴权到期时间
			'random' : null, //鉴权随机字符串
			'debug' : false, // 是否需要调试,
			'errorPage' : null, // 加载错误页面,
			'repeatPage' : null, // 重复登录错误页面,
			'timeoutPage' : null, // 鉴权超时错误页面
			'volume' : 80 // 默认音量
		},
		'liveConfig' : {// 直播配置
			'roomId' : null
		// 直播间id,
		},
		'userConfig' : {// 用户配置
			'userId' : null,// 用户身份标识
			'nickname' : null,// 用户身份标识
			'headerUrl' : null,// 用户头像路径
			'role' : 'student',// ['teacher','assistant','student'] 用户权限，可以自行扩展
			'subGroupId' : '1',// 用户分组id,如果所属多个分则用逗号分隔,如果属于全部组则subGroupId为ALL
			'onlyGroupMsg' : true,// 仅仅接收同组消息
			'repeatLogin' : false,// 是否允许重复登录,默认不允许
			'onRepeatlogin' : null,// 配置重复登录时的处理函数
			'extData' : null //用户扩展数据
		// 设置用户是否只显示组内消息
		},
		'modules' : { // 模块配置
			'notify' : { // 回调通知模块
				'onUserJoin' : null, // 当用户进入直播间
				'onUserOffline' : null,//用户从直播间离线
				'onUserChange' : null, // 当用户进入直播间
				'onInitCompleted' : null,// 当组件初始化完成
				'onGetPoint' : null,//当用户获得积分时回调
				'onPollingTrigger' : null,// 直播间轮询状态触发,每一秒触发一次
				'onImCustomArrive' : null, // 当自定义消息到达时回调
				'onCommandArrive' : null, // 当命令消息到达时回调
				'onPrivateMsgArrive' : null,//当私聊消息到达时回调
                'onImTextMsgArrive' : null, // 当文本消息到达时回调
				'onWithdrawArrive' : null,//当消息撤回指令到达时回调
				'onUserStatusChange' : null, // 当用户状态变化时回调
				'onMediaPlayerStatusChange' : null, // 当媒体播放器状态变化时回调
				'onLiveStatusChange' : null, // 当直播状态变化时回调
				'onImTextMsgSend' : null,// 当发送普通消息时回调
				'onCustomMsgSend' : null,// 当发送自定义消息时回调
				'onCustomMsgRejected' : null,//当发送自定义消息被拒绝时回调
				'onCommandSend' : null,// 当发送命令消息时回调
				'onError' : null, // 当系统错误发生时回调
				'onNetworkError' : null, //当网络错误发生时回调
				'onOrientationChange' : null,//当屏幕方向改变时触发,在初始化时会触发
				'onAudioPlayerStatuChange' : null //当音频播放器的状态发生变化时回调
			// 当发生错误或者异常时回调
			},
			'player' : { // 播放器模块
				'mianPlayerBox' : 'mianPlayerBox',// 主播放器容器id(主播放器用于播放推流视频和推流白板)
				'mianPlayerBoxBackground' : null ,// 主播放器背景填充
				'auxPlayerBox' : 'auxPlayerBox',// 辅助放器容器id(辅助播放器用于播放广告,摄像头等)
				'audioPlayerBox' : 'audioPlayerBox',// 主播放器容器id(音频播放器用于播放一般声音,暖场音频等)
				'ignoreSuspend' : false,// 是否忽略暂停命令,一般用于教师端或者助教端
				'ignoreEnd' : false
			// 是否忽略暂停命令,一般用于教师端或者助教端
			},
			'im' : {// 即时通信模块
				'onlyGroupMsg' : true,// 是否只显示本组消息
				'voiceBtn' : 'voiceBtn',// 弹出语音功能的按钮
				'useBarrage' : false,//使用弹幕
				'reverseHistoryMsg' : true,//将历史反向排序
				'emojis' : {// emoji表情符号
					'append' : true,// 自定义的表情是否添加到系统自带表情之后,如为false将清除原有表情
					'emojiTextTemplate' : '[${content}]',// emoji表情转为文字的模板
					'maxWidth' : '32px',//表情最大宽度
					'maxHeight' : '32px',//表情最大高度
					'imgs' : {// [{//表情图片数据'表情名' : url','表情2' : url2'} ]
					}
				}
			}
		}
	};


	/**
	 * 日志输出
	 */
	this.debugLog = function(_log) {
		if (this.options.appConfig.debug) {
			this.tools.debugLog(_log);
		}
	}

	/**
	 * load script 代理
	 */
	this.loadScript = function(url, callback) {
		this.tools.loadScript(url, callback, this.options.appConfig.cacheJs);
	}

	/**
	 * 直播初始化
	 * 
	 * @param options {
	 *            'lmcServer' : 'http://testwx.teacherv.top',// 直播媒体中心服务器地址,
	 *            'cacheJs' : false, // 是否缓存JavaScript文件,默认不缓存, 'appId' :
	 *            '0000001',// 应用id 'appSign' : 'xxxxxxxxxxxxxx'// 应用授权签名
	 *            'roomId' : '00000001',//直播间id 'userId' : '00000001',//用户身份标识
	 *            'nickname' : '00000001',//用户身份标识 'role' :
	 *            'student',//['teacher','assistant','student'],用户权限,默认为三种权限,但是权限对应的操作用户可以自行扩展 }
	 */
	this.init = function(_options) {
		if(!$ && !jQuery){
			alert('请加载jquery库');
		}
		_this.tools.mergeData(_this.options, _options);

		_this.debugLog('options');
		_this.debugLog(_this.options);
		
		//检查falsh插件的支持情况
		if(!_this.tools.isMobile()){
			var supportFlush = true;
			if (typeof window.ActiveXObject != "undefined") {
				try {
					supportFlush = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
				} catch(exception) {
					supportFlush = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
				}
			} else {
				supportFlush = !!navigator.plugins['Shockwave Flash'];
			}
			if(!supportFlush){
				var updateFlash = window.confirm('您的浏览器不支持Flash,请更新后重启浏览器');
				if(updateFlash){
					window.location.href = 'https://get2.adobe.com/cn/flashplayer/';
				}
			}
		}

		// 加载直播间配置
		_this.loadConfig({
			'success' : function(lmcBase) {// 加载成功回调
				// 初始化im(im是必选模块)
//				var imOptions = {};
				_this.debugLog(lmcBase);
				_lmcBase = lmcBase;

				if (!_lmcBase.serverConfig) {
					_lmcBase.serverConfig = {};
				}else{
                    if( _lmcBase.serverConfig.resourceCdn && _lmcBase.serverConfig.resourceCdn.indexOf("https://")  === -1 ){
                        _lmcBase.serverConfig.resourceCdn = _lmcBase.serverConfig.resourceCdn.replace("http://", "https://");
                    }
                }
				if (!_lmcBase.imConfig) {
					_lmcBase.imConfig = {};
				}
				if (!_lmcBase.messageConfigs) {
					_lmcBase.messageConfigs = [];
				}
				if (!_lmcBase.pointConfigs) {
					_lmcBase.pointConfigs = [];
				}
				if (!_lmcBase.extDatas) {
					_lmcBase.extDatas = [];
				}
				if (!_lmcBase.cmdDatas) {
					_lmcBase.cmdDatas = [];
				}
				if (!_lmcBase.usesrCounts) {
					_lmcBase.usesrCounts = [];
				}
				if (!_lmcBase.userList) {
					_lmcBase.userList = [];
				}
				if (!_lmcBase.selfCustomMessageList) {
					_lmcBase.selfCustomMessageList = {};
				}
				if (!_lmcBase.customMessageCount) {
					_lmcBase.customMessageCount = [];
				}
				if(!_lmcBase.userPointCount){
					_lmcBase.userPointCount = [];
				}
				// 初始化信息赋值
				_notify = _this.options.modules.notify;

				//TODO 版本兼容控制,再下一次版版本发布时删除
				if(!_notify.onImTextMsgArrive){
                    _notify.onImTextMsgArrive = _this.options.modules.im.chatItemRender;
				}
				
				// 初始化命令
				_this.initCmdData();

				if(_this.tools.isMobile() && !(typeof window.orientation == 'undefined')){
					_this.tools.callFunction('onOrientationChange', _notify, (window.orientation % 180 == 0) ? 'vertical' : 'horizontal' );
					window.addEventListener("orientationchange", function() {
						_this.tools.callFunction('onOrientationChange', _notify, (window.orientation % 180 == 0) ? 'vertical' : 'horizontal' );
					});
				}
			},
			'error' : function(url) {// 加载成功回调
				_this.debugLog('加载脚本错误:' + url);
			}
		});

		//状态轮询
		setInterval(_pollingTrigger, 1000);
		//时间修正同步
		setInterval(_timeCorrect, 1000);
		//修正在线用户数量修正同步,每分钟修正一次
		setInterval(_userCountCorrect, 60000);
	}

	/**
	 * 加载直播间配置
	 * 
	 * @param 加载参数
	 */
	this.loadConfig = function(param) {
		_requestLmcData({
			'action' : 'init',
			'data' : {
				'nickname' : _this.options.userConfig.nickname,
				'headerUrl' : _this.options.userConfig.headerUrl
			},
			'success' : function(json) {
				if(!json || json.error){
					var type = '';
					var message = '';
					if(json.code == 'paramError'){
						if(json.message == 'appSign is overdue'){
							type = 'timeout';
							message = '试听结束';
						}else{
							message = '参数错误 ' + (json.message || '');
						}
					}
					_showError(type, message);
					return false;
				}
				var _config = json;
				_this.debugLog('lmcData : ');
				_this.tools.callFunction('success', param, _config);
			},
			'error' : function(xhr) {
				_this.tools.callFunction('onError', {
					'type' : 'getLmcConfigError'
				});
			}
		});
	}

	/**
	 * 初始化im，在直播时必须加载im模块
	 * 
	 * @param 加载参数
	 */
	this.initIm = function(param) {
		_this.debugLog(param);
		var cdn = param.resourceCdn;
		var urls = [ cdn + '/platform/tls/sdk/webim.js', cdn + '/platform/tls/sdk/json2.js', cdn + '/js/im/tls/base.js' ];
		_this.loadScript(urls, function(success) {
			_this.debugLog('初始化im完成:' + success);
			if (!success) {
				alert('加载错误,请刷新重试'+ _this.tools.jsonStringify(urls));
				return false;
			}
			// 初始化im
			_this.im.init(param);

            // 初始化文本消息列表
           /* _this.initTextMessageList();*/
		});
	}

	/**
	 * 
	 * 初始化媒体播放器模块
	 * 
	 * @param 加载参数
	 */
	this.initMediaPlayer = function(param) {
		_this.debugLog(param);
		_this.checkMediaPlayer();
	}
	
	/**
	 * 
	 * 初始化媒体播放器模块
	 * 
	 * @param 加载参数
	 */
	this.initBgmusicPlayer = function(param) {
		_this.debugLog(param);
		_this.checkBgMusicPlayer();
	}
	

	/**
	 * 初始化扩展数据列表
	 */
	this.initExtDataList = function(){
		_requestLmcData({
			'action' : 'getExtDataList',
			'success' : function(json) {
				if (!json.error && json.length > 0) {
					_this.tools.callFunction('onExtDataListInit',_notify, json);
				}
			},
			'error' : function(err) {
			}
		});
	}
	
	/**
	 * 初始化用户列表
	 */
	this.initUserList = function(){
		_requestLmcData({
			'action' : 'getUserList',
			'success' : function(json) {
				if (!json.error && json.data && json.data.length > 0) {
					for(var i in json.data){
						if(!json.data[i].nickname){
							json.data[i].nickname = '匿名用户';
						}
						_pushUserToContainer(json.data[i]);
					}
				}
				// 初始化im模块
				_this.initIm(_imOptions);
			},
			'error' : function(err) {
			}
		});
	}
	
	
	/**
	 * 初始化自定义消息
	 */
	this.initCustomMessage = function(){
		_requestLmcData({
			'action' : 'getCustomMessage',
			'success' : function(json) {
				if(!json || json.error || !json.data){
					return false;
				}
				
				var selfCustomMessage = json.data.selfCustomMessageCount;
				if (selfCustomMessage && selfCustomMessage.length > 0) {
					for(var i in selfCustomMessage){
						var item = selfCustomMessage[i];
						var id = item.id;
						var finalId = item.userId + '_' + id.customType + '_' + id.flag;
						item.id = finalId;
//						_pushUserToContainer(item);
						_lmcBase.selfCustomMessageList[item.id] = item;
					}
				}
				var customMessageCount = json.data.customMessageCount;
				if (customMessageCount && customMessageCount.length > 0) {
					for(var i in customMessageCount){
						_lmcBase.customMessageCount.push(customMessageCount[i]);
					}
				}
			},
			'error' : function(err) {
			}
		});
	}


    /**
     * 初始化文本消息列表
     */
    this.initTextMessageList = function(){
      _this.loadHistoryTextMessage(function(){
          _status.historyMsgLoadComplete = true;
	  });
    }


	/**
	 * 初始化命令数据
	 */
	this.initCmdData = function(){
		_requestLmcData({
			'action' : 'getCmdData',
			'success' : function(json) {
				if(json && !json.error){
					var imOptions = {};
					_lmcBase.cmdDatas = json;
					
					// 刷新所有状态
					_flushStatus();

					var imConfig = {
						'userId' : _this.options.userConfig.userId,
						'appId' : _this.options.appConfig.appId,
						'identifier' : _lmcBase.room.conf.identifier,
						'userSign' : _lmcBase.room.conf.imSign,
						'sdkAppID' : _lmcBase.room.conf.imsdkAppID,
						'accountType' : _lmcBase.room.conf.imAccountType,
						'avChatRoomId' : _lmcBase.imConfig.imPlatformParam.avChatRoomId
					};
					
					//用户属性
		            var slef = {
		              'userId' : _this.options.userConfig.userId,
		        	  'nickname' : _this.options.userConfig.nickname,
		  			  'headerUrl' : _this.options.userConfig.headerUrl,
		  			  'role' : _this.options.userConfig.role,
		  			  'subGroupId' : _this.options.userConfig.subGroupId,
		  			  'pointValue' : _lmcBase.userPointValue || 0,
		  			  'lastLoginTime' : _status.serverTime,
		  			  'extData' : _this.options.userConfig.extData
		            };
		            
		            //用户登录时保存自己的属性
		            _pushUserToContainer(slef);
					
					_lmcBase.serverConfig.resourceCdn = _lmcBase.serverConfig.resourceCdn || '';
					_heartbeatInterval = _lmcBase.serverConfig.heartbeatInterval || _heartbeatInterval;

					//合并im参数,im加载过程中可能会用到资源cdn服务器路径
					_this.tools.mergeData(imOptions, {
						'resourceCdn' : _lmcBase.serverConfig.resourceCdn.replace('http://', 'https://')
					});
					_this.tools.mergeData(imOptions, {
						'clientConfig' : _this.options.modules.im,
						'imConfig' : imConfig,
						'imUserConfig' : _this.options.userConfig,
						'notify' : _notifyProxy
					});
					
					imOptions.userContainer = _userContainer;
					_imOptions = imOptions;
					
					_this.debugLog('imOptions');
					_this.debugLog(imOptions);
					// 开始心跳轮询
					_heartbeat();
					// 开启用户积分轮询
					_userPointCountPolling();
					// 初始化用户自己发送的自定义消息列表
					_this.initCustomMessage();
					// 初始化用户列表
					_this.initUserList();
					
					// 初始化媒体播放器模块
					_this.initMediaPlayer(_this.options);
					//初始化背景音乐播放器
					_this.initBgmusicPlayer();
					
					// 初始化扩展数据列表
					_this.initExtDataList();

				}
			},
			'error' : function(err) {
			}
		});
	}
	
	/**
	 * 获取用户积分统计
	 */
	this.getUserPointCount = function(){
		return _lmcBase.userPointCount;
	}
	
	
	/**
	 * 检查播放器状态
	 * 
	 * @param 加载参数
	 */
	this.checkMediaPlayer = function() {
		try {
			_checkMediaPlayerImpl();
		} catch (e) {
			_this.debugLog('checkMediaPlayer error ');
		}
	}
	/**
	 * 检查背景音乐播放器状态
	 * 
	 * @param 加载参数
	 */
	this.checkBgMusicPlayer = function() {
		try {
			_checkBgMusicPlayerImpl();
		} catch (e) {
			_this.debugLog('checkBgMusicPlayer error ');
		}
	}
	

	/**
	 * 设置选项参数
	 */
	this.setOption = function(option) {

	}

	/**
	 * 发送自定义消息
	 */
	this.sendCustomMsg = function(msg) {
		var type = msg.type;
		if ('command' == type) {
			_this.tools.callFunction('onImCustomSend', {
				'status' : 'fail',
				'error' : '如需发送command消息请使用sendCommand',
				'data' : msgData
			});
			return false;
		}else if('userStatusPolling' == type || 'initCompleted' == type){
			return false;
		}
        //绑定一个消息id
        msg.messageId  = _this.tools.uuidInt();
		return _sendCustomMsgImpl(msg);
	}
	
	/**
	 * 发送文本消息
	 */
	this.sendTextMsg = function(msg,toUserId) {
		var self = _userContainer[_this.options.userConfig.userId];
		if (self.speaking == 'off') {
			_this.tools.callFunction('onCustomMsgRejected', _notify, {
				'error' : 'not_allow',
				'msg' : msg
			});
			return false;
		}
		if(toUserId){
			toUserId = _this.options.appConfig.appId + toUserId;
		}
		return this.im.sendTextMsg(msg,toUserId, _this.tools.uuidInt());
	}
	
	/**
	 * 获取emoji数据
	 */
	this.getEmojis= function() {
		return this.im.getEmojis();
	}

	/**
	 * 发送命令
	 */
	this.sendCommand = function(msg) {
		var type = msg.type;
		if (!type) {
			return false;
		}
		var commands = {
			'changeLiveStatus' : {
				'action' : 'changeStatus',
				'statusFlag' : 'liveStatus'
			},
			'speaking' : {
				'action' : 'speaking',
				'statusFlag' : 'speaking'
			},
			'barrage' : {
				'action' : 'barrage',
				'statusFlag' : 'barrage'
			},
			'bgmusic' : {
				'action' : 'bgmusic',
				'statusFlag' : 'bgmusic'
			},
            'withdraw' : {
                'action' : 'withdraw'
            }
		};
		if (!commands.hasOwnProperty(type)) {
			_this.tools.callFunction('onImCustomSend',
					_notify, {
						'status' : 'fail',
						'error' : '不支持的命令',
						'data' : msg
					});
		}
		
		msg.param = msg.param || {};
		if (!msg.param.toUserId) {
			_cmd[type] = msg.param.status;
		}
		// 发送命令之后刷新状态
		var command = commands[type];
		var commandParam = msg.param;
		if (type == 'changeLiveStatus') {
			// 获取主播控制的媒体对象
			var anchorRoomMedia = _getAnchorRoomMedia();
			if(!anchorRoomMedia){
				_this.tools.callFunction('onError',_notify, {'error' : '没有可操作的媒体对象'});
				return false;
			}
			commandParam.mediaIndex = anchorRoomMedia.mediaIndex;
		}
		// 刷新状态
		_flushStatus([ {
			'name' : command['statusFlag']
		} ]);
		_requestLmcData({
			'action' : command.action,
			'data' : commandParam,
			'success' : function(json) {
				if (json.error) {
					_this.tools.callFunction('onImCustomSend',
							_notify, {
								'status' : 'fail',
								'error' : json.error,
								'data' : msg
							});
				} else {
					_this.im.sendCustomMsg({
						'type' : 'command',
						'data' : {
							'command' : type,
							'param' : commandParam,
							'respose' : json
						}
					});
				}
			},
			'error' : function(err) {
				_this.tools.callFunction('onImCustomSend',
						_notify, {
							'status' : 'fail',
							'error' : '命令无法发送到服务器端',
							'data' : msg
						});
			}
		});

	}

	/**
	 * 获取播放器状态
	 */
	this.getPlayerStatus = function(msg) {

	}
	
	/**
	 * 获取用户列表
	 */
	this.getUserList = function(){
		return _userContainer;
	}
	
	/**
	 * 获取自己发出的自定义消息
	 */
	this.getselfCustomMessageList = function(){
		return _lmcBase.selfCustomMessageList;
	}
	
	/**
	 * 获取自定义消息计数器
	 */
	this.getCustomMessageCount = function(){
		return _lmcBase.customMessageCount;
	}
	
	/**
	 * 获取当前鉴权的媒体信息
	 */
	this.getSignedRoomMedia = function(){
		return _signedRoomMedia;
	}	
	
	/**
	 * 获取直播间状态
	 */
	this.getStatus = function(){
		return _status;
	}
	
	/**
	 * 获取基础信息
	 */
	this.getBase = function(){
		var result = {
			endTime : _lmcBase.endTime,
			startTime : _lmcBase.startTime,
			liveDesc : _lmcBase.liveDesc,
			liveName : _lmcBase.liveName
		};
		return result;
	}
	
	/**
	 * 设置使用弹幕
	 */
	this.setUseBarrage = function(useBarrage){
		_this.options.modules.im.useBarrage = useBarrage;
	}

    /**
     * 加载历史消息
     */
    this.loadHistoryTextMessage = function(callback){
        if(!!_status.historyMsgLoadFinished){
            return false;
        }
        if(!!_status.historyMsgLoadding){
            return ;
        }
    	var data = {};

    	if(_status.historyMsgEarliest){
            data.lastTime = _status.historyMsgEarliest;
        }
        _status.historyMsgLoadding = true;
        _requestLmcData({
            'action' : 'getMessage',
			'data' : data,
            'success' : function(json) {
                if(!json || json.error || !json.data){
                	if(!json.data || json.data.length == 0){
                		//历史消息加载完成
                        _status.historyMsgLoadComplete = true;
                        //历史消息加载结束
                        _status.historyMsgLoadFinished = true;
					}
                    //历史消息加载中的标识
                    _status.historyMsgLoadding = false;
                    return false;
                }

                var len = json.data.length;
                if(len < 30){
					//历史消息加载完成
					_status.historyMsgLoadComplete = true;
					//历史消息加载结束
					_status.historyMsgLoadFinished = true;
                    //历史消息加载中的标识
                    _status.historyMsgLoadding = false;
                }

                //重新排序
				if(_this.options.modules.im.reverseHistoryMsg){
                    json.data.reverse();
				}

                for ( var i in json.data) {
                    if(i == len -1){
                        _status.historyMsgLoadding = false;
                        if(callback){
                            try{
                                callback(json.data);
                            }catch(e){
                            }
                        }
                    }
                    var historyMsg = json.data[i];
                    var userData = _this.tools.parseJson(historyMsg.userData);
                    if (!userData) {
                        continue;
                    }

					if(historyMsg.time && (!_status.historyMsgEarliest || _status.historyMsgEarliest > historyMsg.time)){
						_status.historyMsgEarliest = historyMsg.time;
					}

                    _this.im.showMessage({
                        'userId' : _this.options.appConfig.appId +  historyMsg.userId,
                        'messageId' : historyMsg.messageId,
                        'nickname' : userData.nickname,
                        'subGroupId' : historyMsg.subGroupId,
                        'role' : userData.role,
                        'headerUrl' : userData.headerUrl,
                        'content' : historyMsg.content,
                        'isHistory' : true,
                        'time' : parseInt(historyMsg.time / 1000),
                        'sync' : false
                    });
                }
            },
            'error' : function(err) {
                _status.historyMsgLoadding = false;
            }
        });
    }
	
	/**
	 * 判断是否同组
	 */
	this.isSameGroup = function(groupId){
		return _isSameGroup(groupId);
	}
	
	/**
	 * 播放声音
	 */
	this.playAudio = function(_options){
		var options = _options || {};
		var $audio = _checkAudioPlayerImpl();
		var audio = $audio.get(0);
		if(!audio){
			return false;
		}
		var loop = !!options.loop;
		audio.loop = loop;
		var url = options.url;
		if(url){
			audio.src = url;
		}
		var status = options.status || 'play';
		
		if(status == 'switch'){
			//音乐开关状态为切换时,在暂停和播放之间进行切换
			if(audio.src && (audio.ended || audio.paused)){
				status = 'play';
			}else{
				status = 'paused';
			}
		}
		
		if(window.WeixinJSBridge){
			WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
				if (status == 'play' && audio.play) {
					if (audio.src) {
						audio.play();
					}
				}else if (status == 'paused' && audio.pause) {
					audio.pause();
				}else if (status == 'ended' && audio.duration && audio.fastSeek) {
					audio.fastSeek(audio.duration);
				}else if (status == 'ended') {
					audio.pause();
				}
			});
		}else{
			if (status == 'play' && audio.play) {
				if (audio.src) {
					audio.play();
				}
			}else if (status == 'paused' && audio.pause) {
				audio.pause();
			}else if (status == 'ended' && audio.duration && audio.fastSeek) {
				audio.fastSeek(audio.duration);
			}else if (status == 'ended') {
				audio.pause();
			}
		}
	}

}

/**
 * 注册媒体控制中心对象
 */
var LMC = window.LMC || new LmcController();
export default LMC