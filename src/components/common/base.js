/**
 * webim 鍩虹鎺у埗鍣�
 */
import $ from 'jquery'

function WebImBaseControllor(){
	
	/**
	 * 褰撳墠瀵硅薄
	 */
	var _this = this;
	
	/**
	 * 閰嶇疆
	 */
	var _config = null;
	
	/**
	 * 甯愬彿妯″紡锛�0-琛ㄧず鐙珛妯″紡锛�1-琛ㄧず鎵樼妯″紡
	 */
	var accountMode = 1;
	
	/**
	 * 浼氳瘽瀵硅薄
	 */
	var selSess = null;
	
	/**
	 * 渚濊禆鐨勫伐鍏风被绀轰緥
	 */
	var _tools = null;
	
	/**
	 * 鐧诲綍淇℃伅
	 */
	var loginInfo = null;
	
	/**
	 * 鐩戝惉鍑芥暟
	 */
	var listeners = null;
	
	/**
	 * 閫夐」
	 */
	var options = null;
	
	/**
	 * 鐩存挱闂磇d
	 */
	var avChatRoomId = null;

	/**
	 * 浼氳瘽绫诲瀷
	 */
	var selType = null;
	
	
	var selToID = null;
	var selSess = null;
    var privateSelSess = [];
	var selSessHeadUrl = null;
	
	var maxMessageLength = 256 * 3;
	
	/**
	 * 鐢ㄦ埛閰嶇疆淇℃伅
	 */
	var _userContainer = {};
	
	/**
	 * appId瀛楃涓查暱搴�
	 */
	var _appIdLength = 0;
	
	/**
	 * set 鏂规硶 - 宸ュ叿绫�
	 */
	this.setTools = function(tools){
		_tools = tools;
	}
	
	
	/**
	 * 閾炬帴鐘舵€佸彉鍖栫洃鍚�
	 */
	var onConnNotify = function(resp) {
		var status = 'unknown';
		switch (resp.ErrorCode) {
		case webim.CONNECTION_STATUS.ON:
            status = 'online'
			// webim.Log.warn('杩炴帴鐘舵€佹甯�...');
			break;
		case webim.CONNECTION_STATUS.OFF:
			webim.Log.warn('杩炴帴宸叉柇寮€锛屾棤娉曟敹鍒版柊娑堟伅锛岃妫€鏌ヤ笅浣犵殑缃戠粶鏄惁姝ｅ父');
            status = 'offline';
			break;
		case webim.CONNECTION_STATUS.INIT:
			webim.Log.warn('鍒濆鍖栭摼鎺�');
            status = 'init';
			break;
		case webim.CONNECTION_STATUS.RECONNECT:
			webim.Log.warn('閲嶆柊杩炴帴');
            status = 'reconnect';
			break;
		default:
			webim.Log.error('鏈煡杩炴帴鐘舵€�,status=' + resp.ErrorCode);
			break;
		}
        callNotify('netNetStatusChange', {
            'status' : status,
			'resp' : resp
        });
	};
	
	//IE9(鍚�)浠ヤ笅娴忚鍣ㄧ敤鍒扮殑jsonp鍥炶皟鍑芥暟
	var jsonpCallback = function(rspData) {
	    //璁剧疆鎺ュ彛杩斿洖鐨勬暟鎹�
	    webim.setJsonpLastRspData(rspData);
	}

	//鐩戝惉澶х兢鏂版秷鎭紙鏅€氾紝鐐硅禐锛屾彁绀猴紝绾㈠寘锛�
	var onBigGroupMsgNotify = function(msgList) {
	    for (var i = msgList.length - 1; i >= 0; i--) {//閬嶅巻娑堟伅锛屾寜鐓ф椂闂翠粠鍚庡線鍓�
	        var msg = msgList[i];
	        //console.warn(msg);
	        webim.Log.debug('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
	        //鏄剧ず鏀跺埌鐨勬秷鎭�
	        showMsg(msg,true);
	    }
	}

	//鐩戝惉鏂版秷鎭�(绉佽亰(鍖呮嫭鏅€氭秷鎭€佸叏鍛樻帹閫佹秷鎭�)锛屾櫘閫氱兢(闈炵洿鎾亰澶╁)娑堟伅)浜嬩欢
	//newMsgList 涓烘柊娑堟伅鏁扮粍锛岀粨鏋勪负[Msg]
	var onMsgNotify = function(newMsgList) {
	    var newMsg;
	    for (var j in newMsgList) {//閬嶅巻鏂版秷鎭�
	        newMsg = newMsgList[j];
	        handlderMsg(newMsg);//澶勭悊鏂版秷鎭�
	    }
	}

	//澶勭悊娑堟伅锛堢鑱�(鍖呮嫭鏅€氭秷鎭拰鍏ㄥ憳鎺ㄩ€佹秷鎭�)锛屾櫘閫氱兢(闈炵洿鎾亰澶╁)娑堟伅锛�
	function handlderMsg(msg) {
	    var fromAccount, fromAccountNick, sessType, subType, contentHtml;

	    fromAccount = msg.getFromAccount();
	    if (!fromAccount) {
	        fromAccount = '';
	    }
	    fromAccountNick = msg.getFromAccountNick();
	    if (!fromAccountNick) {
	        fromAccountNick = fromAccount;
	    }

	    //瑙ｆ瀽娑堟伅
	    //鑾峰彇浼氳瘽绫诲瀷
	    //webim.SESSION_TYPE.GROUP-缇よ亰锛�
	    //webim.SESSION_TYPE.C2C-绉佽亰锛�
	    sessType = msg.getSession().type();
	    //鑾峰彇娑堟伅瀛愮被鍨�
	    //浼氳瘽绫诲瀷涓虹兢鑱婃椂锛屽瓙绫诲瀷涓猴細webim.GROUP_MSG_SUB_TYPE
	    //浼氳瘽绫诲瀷涓虹鑱婃椂锛屽瓙绫诲瀷涓猴細webim.C2C_MSG_SUB_TYPE
	    subType = msg.getSubType();

	    switch (sessType) {
	        case webim.SESSION_TYPE.C2C://绉佽亰娑堟伅
	            switch (subType) {
	                case webim.C2C_MSG_SUB_TYPE.COMMON://c2c鏅€氭秷鎭�
	                    //涓氬姟鍙互鏍规嵁鍙戦€佽€呭笎鍙穎romAccount鏄惁涓篴pp绠＄悊鍛樺笎鍙凤紝鏉ュ垽鏂璫2c娑堟伅鏄惁涓哄叏鍛樻帹閫佹秷鎭紝杩樻槸鏅€氬ソ鍙嬫秷鎭�
	                    //鎴栬€呬笟鍔″湪鍙戦€佸叏鍛樻帹閫佹秷鎭椂锛屽彂閫佽嚜瀹氫箟绫诲瀷(webim.MSG_ELEMENT_TYPE.CUSTOM,鍗砊IMCustomElem)鐨勬秷鎭紝鍦ㄩ噷闈㈠鍔犱竴涓瓧娈垫潵鏍囪瘑娑堟伅鏄惁涓烘帹閫佹秷鎭�
	                    contentHtml = convertMsgtoHtml(msg);
	                    webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ', content=' + contentHtml);
	                    //c2c娑堟伅涓€瀹氳璋冪敤宸茶涓婃姤鎺ュ彛
	                    var opts = {
	                        'To_Account': fromAccount,//濂藉弸甯愬彿
	                        'LastedMsgTime': msg.getTime()//娑堟伅鏃堕棿鎴�
	                    };
	                    webim.c2CMsgReaded(opts);

	                    //澶勭悊绉佽亰娑堟伅
                        var userId = fromAccount.substring(_appIdLength);
                        msg.fromAccount = userId;

                        var _userProfilePortrait = _userContainer[userId];
						var newMsg = {
							'content': contentHtml,
							'time': msg.time,
							'fromAccountNick': fromAccountNick || _userProfilePortrait['nickname'],
							'fromAccount': msg.fromAccount,
							'body': msg,
							'headerUrl': _userProfilePortrait['headerUrl'] || msg.headerUrl,
							'role': _userProfilePortrait['role'],
							'subGroupId': _userProfilePortrait['subGroupId'],
							'isSelfGroup': _userProfilePortrait['subGroupId'] == loginInfo.subGroupId
						};

						//鍙戦€佺鑱婃秷鎭帴鏀堕€氱煡
                        callNotify('onPrivateMsgArrive', newMsg);
	                    break;
	            }
	            break;
	        case webim.SESSION_TYPE.GROUP://鏅€氱兢娑堟伅锛屽浜庣洿鎾亰澶╁鍦烘櫙锛屼笉闇€瑕佷綔澶勭悊
	            break;
	    }
	}
	
	
	//缇ゆ秷鎭�
	//鐩戝惉 鐢宠鍔犵兢 绯荤粺娑堟伅
	var onApplyJoinGroupRequestNotify = function(notify) {
	    webim.Log.warn("鎵ц 鍔犵兢鐢宠 鍥炶皟锛�" + JSON.stringify(notify));
	    var timestamp = notify.MsgTime;
	    var reportTypeCh = "[鐢宠鍔犵兢]";
	    var content = notify.Operator_Account + "鐢宠鍔犲叆浣犵殑缇�";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, timestamp);
	}

	//鐩戝惉 鐢宠鍔犵兢琚悓鎰� 绯荤粺娑堟伅
	var onApplyJoinGroupAcceptNotify = function(notify) {
	    webim.Log.warn("鎵ц 鐢宠鍔犵兢琚悓鎰� 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[鐢宠鍔犵兢琚悓鎰廬";
	    var content = notify.Operator_Account + "鍚屾剰浣犵殑鍔犵兢鐢宠锛岄檮瑷€锛�" + notify.RemarkInfo;
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 鐢宠鍔犵兢琚嫆缁� 绯荤粺娑堟伅
	var onApplyJoinGroupRefuseNotify = function (notify) {
	    webim.Log.warn("鎵ц 鐢宠鍔犵兢琚嫆缁� 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[鐢宠鍔犵兢琚嫆缁漖";
	    var content = notify.Operator_Account + "鎷掔粷浜嗕綘鐨勫姞缇ょ敵璇凤紝闄勮█锛�" + notify.RemarkInfo;
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 琚涪鍑虹兢 绯荤粺娑堟伅
	var onKickedGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 琚涪鍑虹兢  鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[琚涪鍑虹兢]";
	    var content = "浣犺绠＄悊鍛�" + notify.Operator_Account + "韪㈠嚭璇ョ兢";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 瑙ｆ暎缇� 绯荤粺娑堟伅
	var onDestoryGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 瑙ｆ暎缇� 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[缇よ瑙ｆ暎]";
	    var content = "缇や富" + notify.Operator_Account + "宸茶В鏁ｈ缇�";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 鍒涘缓缇� 绯荤粺娑堟伅
	var onCreateGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 鍒涘缓缇� 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[鍒涘缓缇";
	    var content = "浣犲垱寤轰簡璇ョ兢";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 琚個璇峰姞缇� 绯荤粺娑堟伅
	var onInvitedJoinGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 琚個璇峰姞缇�  鍥炶皟: " + JSON.stringify(notify));
	    var reportTypeCh = "[琚個璇峰姞缇";
	    var content = "浣犺绠＄悊鍛�" + notify.Operator_Account + "閭€璇峰姞鍏ヨ缇�";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 涓诲姩閫€缇� 绯荤粺娑堟伅
	var onQuitGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 涓诲姩閫€缇�  鍥炶皟锛� " + JSON.stringify(notify));
	    var reportTypeCh = "[涓诲姩閫€缇";
	    var content = "浣犻€€鍑轰簡璇ョ兢";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 琚缃负绠＄悊鍛� 绯荤粺娑堟伅
	var onSetedGroupAdminNotify = function (notify) {
	    webim.Log.warn("鎵ц 琚缃负绠＄悊鍛�  鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[琚缃负绠＄悊鍛榏";
	    var content = "浣犺缇や富" + notify.Operator_Account + "璁剧疆涓虹鐞嗗憳";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 琚彇娑堢鐞嗗憳 绯荤粺娑堟伅
	var onCanceledGroupAdminNotify = function (notify) {
	    webim.Log.warn("鎵ц 琚彇娑堢鐞嗗憳 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[琚彇娑堢鐞嗗憳]";
	    var content = "浣犺缇や富" + notify.Operator_Account + "鍙栨秷浜嗙鐞嗗憳璧勬牸";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 缇よ鍥炴敹 绯荤粺娑堟伅
	var onRevokeGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 缇よ鍥炴敹 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[缇よ鍥炴敹]";
	    var content = "璇ョ兢宸茶鍥炴敹";
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}
	//鐩戝惉 鐢ㄦ埛鑷畾涔� 缇ょ郴缁熸秷鎭�
	var onCustomGroupNotify = function (notify) {
	    webim.Log.warn("鎵ц 鐢ㄦ埛鑷畾涔夌郴缁熸秷鎭� 鍥炶皟锛�" + JSON.stringify(notify));
	    var reportTypeCh = "[鐢ㄦ埛鑷畾涔夌郴缁熸秷鎭痌";
	    var content = notify.UserDefinedField;//缇よ嚜瀹氫箟娑堟伅鏁版嵁
	    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
	}

	//鐩戝惉 缇よ祫鏂欏彉鍖� 缇ゆ彁绀烘秷鎭�
	var onGroupInfoChangeNotify = function (groupInfo) {
	    webim.Log.warn("鎵ц 缇よ祫鏂欏彉鍖� 鍥炶皟锛� " + JSON.stringify(groupInfo));
	    var groupId = groupInfo.GroupId;
	    var newFaceUrl = groupInfo.GroupFaceUrl;//鏂扮兢缁勫浘鏍�, 涓虹┖锛屽垯琛ㄧず娌℃湁鍙樺寲
	    var newName = groupInfo.GroupName;//鏂扮兢鍚嶇О, 涓虹┖锛屽垯琛ㄧず娌℃湁鍙樺寲
	    var newOwner = groupInfo.OwnerAccount;//鏂扮殑缇や富id, 涓虹┖锛屽垯琛ㄧず娌℃湁鍙樺寲
	    var newNotification = groupInfo.GroupNotification;//鏂扮殑缇ゅ叕鍛�, 涓虹┖锛屽垯琛ㄧず娌℃湁鍙樺寲
	    var newIntroduction = groupInfo.GroupIntroduction;//鏂扮殑缇ょ畝浠�, 涓虹┖锛屽垯琛ㄧず娌℃湁鍙樺寲

	    if (newName) {
	        //鏇存柊缇ょ粍鍒楄〃鐨勭兢鍚嶇О
	        //To do
	        webim.Log.warn("缇d=" + groupId + "鐨勬柊鍚嶇О涓猴細" + newName);
	    }
	}

	//鏄剧ず涓€鏉＄兢缁勭郴缁熸秷鎭�
	function showGroupSystemMsg(type, typeCh, group_id, group_name, msg_content, msg_time) {
	    var sysMsgStr = "鏀跺埌涓€鏉＄兢绯荤粺娑堟伅: type=" + type + ", typeCh=" + typeCh + ",缇D=" + group_id + ", 缇ゅ悕绉�=" + group_name + ", 鍐呭=" + msg_content + ", 鏃堕棿=" + webim.Tool.formatTimeStamp(msg_time);
	    webim.Log.warn(sysMsgStr);
	    alert(sysMsgStr);
	}	
	


	//杩涘叆澶х兢
	function applyJoinBigGroup(groupId) {
	    var options = {
	        'GroupId': groupId//缇d
	    };
	    
	    webim.applyJoinBigGroup(
	        options,
	        function (resp) {
	            //JoinedSuccess:鍔犲叆鎴愬姛; WaitAdminApproval:绛夊緟绠＄悊鍛樺鎵�
	            if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
	                webim.Log.debug('杩涚兢鎴愬姛');
	                selToID = groupId;
	                //鍥炶皟鐢ㄦ埛鐘舵€佸彉鍖�
					callNotify('onUserStatusChange', {
						'type' : 'imGroupStatusNotify',
						'status' : 'success'
					});
	            } else {
	            	callNotify('onUserStatusChange', {
						'type' : 'imGroupStatusNotify',
						'status' : 'fail'
					});
	                webim.Log.debug('杩涚兢澶辫触');
	            }
	        },
	        function (err) {
	        	webim.Log.error(err);
	        }
	    );
	}

	//鏄剧ず娑堟伅锛堢兢鏅€�+鐐硅禐+鎻愮ず+绾㈠寘锛�
	function showMsg(msg,ignoreSelf) {
		
	    var isSelfSend, fromAccount, userId,fromAccountNick, sessType, subType;

	    var messageId = msg.messageId;
	    var isHistory = msg.isHistory;
		if (msg.fromClient) {
			if(!msg.content){
				return false;
			}
			var temp = createTextMsg((msg.userId == loginInfo.identifier),msg.content,msg.time,msg.userId,msg.nickname);
			temp.sync = msg.sync;
			msg = temp;
		}
		fromAccount =  msg.getFromAccount();
		if (!fromAccount) {
			return false;
		}
		
		userId = fromAccount.substring(_appIdLength);
		msg.fromAccount = userId;
		
	    var _userProfilePortrait = _userContainer[userId];
	    //棰勫鐞嗙敤鎴蜂俊鎭�
		prepareUserProfile(fromAccount,userId,msg,function(msg, _userProfilePortrait) {
			_userProfilePortrait = _userProfilePortrait || {};
			if (loginInfo.onlyGroupMsg && loginInfo.subGroupId){
				// 鍙戦€佹柟缁勬湭鐭ョ洿鎺ュ拷鐣�
				if (!_userProfilePortrait.subGroupId) {
					return;
				}
				var groupMatch = false;
				var fromSubgroupId = _userProfilePortrait.subGroupId;
				if (fromSubgroupId == 'ALL' || loginInfo.subGroupId == 'ALL') {
					groupMatch = true;
				}else {
					var subGroupIds = loginInfo.subGroupId.split(',');
					var fromSubgroupIds = fromSubgroupId.split(',');
					for(var i in subGroupIds){
						for(var j in fromSubgroupIds){
							if(subGroupIds[i] == fromSubgroupIds[j]){
								groupMatch = true;
								break;
							}
						}
					}
				}
				// 鍙戦€佹柟缁勪笉鍖归厤鐩存帴蹇界暐
				if (!groupMatch) {
					return;
				}
			}
			
			if (!msg.fromClient) {
				fromAccountNick = msg.getFromAccountNick();
				if (!fromAccountNick) {
					fromAccountNick = '鍖垮悕鐢ㄦ埛';
				}
				sessType = msg.getSession().type();
				// 鑾峰彇娑堟伅瀛愮被鍨�
				// 浼氳瘽绫诲瀷涓虹兢鑱婃椂锛屽瓙绫诲瀷涓猴細webim.GROUP_MSG_SUB_TYPE
				// 浼氳瘽绫诲瀷涓虹鑱婃椂锛屽瓙绫诲瀷涓猴細webim.C2C_MSG_SUB_TYPE
				subType = msg.getSubType();

				isSelfSend = msg.getIsSend();//娑堟伅鏄惁涓鸿嚜宸卞彂鐨�
				if(ignoreSelf && isSelfSend){
					return false;
				}
			}

	        var contentHTML = null;
	        switch (subType) {
	            case webim.GROUP_MSG_SUB_TYPE.COMMON://缇ゆ櫘閫氭秷鎭�
	            	contentHTML = convertMsgtoHtml(msg);
	                break;
	            case webim.GROUP_MSG_SUB_TYPE.REDPACKET://缇ょ孩鍖呮秷鎭�
	            	contentHTML = convertMsgtoHtml(msg);
	                break;
	            case webim.GROUP_MSG_SUB_TYPE.LOVEMSG://缇ょ偣璧炴秷鎭�
	                //涓氬姟鑷繁鍙互澧炲姞閫昏緫锛屾瘮濡傚睍绀虹偣璧炲姩鐢绘晥鏋�
	            	contentHTML = convertMsgtoHtml(msg);
	                //灞曠ず鐐硅禐鍔ㄧ敾
	                break;
	            case webim.GROUP_MSG_SUB_TYPE.TIP://缇ゆ彁绀烘秷鎭�
	            	contentHTML = convertMsgtoHtml(msg);
	                break;
	        }
	        
	        //濡傛灉杩斿洖false琛ㄧず涓嶉渶瑕佽繑鍥炴秷鎭€屾槸鐢卞洖璋冮€氱煡绯荤粺鑷澶勭悊
	        if (contentHTML == false) {
				return false;
			}
			//閲嶇疆娑堟伅id
            msg.messageId = messageId;
            msg.isHistory = isHistory;
			var newMsg = {
				'content' : contentHTML,
				'time' : msg.time,
				'fromAccountNick' : fromAccountNick || _userProfilePortrait['nickname'],
				'fromAccount' : msg.fromAccount,
				'body' : msg,
				'messageId' : msg.messageId || msg.random,
				'isHistory' : msg.isHistory,
				'isSelfSend' : isSelfSend,
				'headerUrl' : _userProfilePortrait['headerUrl'] || msg.headerUrl,
				'role' : _userProfilePortrait['role'],
				'subGroupId' : _userProfilePortrait['subGroupId'],
				'isSelfGroup' : _userProfilePortrait['subGroupId'] == loginInfo.subGroupId
			};
			webim.Log.debug(newMsg);
			callNotify('onImTextMsgArrive',newMsg);
	    });
	}

	//鎶婃秷鎭浆鎹㈡垚Html
	function convertMsgtoHtml(msg) {
	    var html = '', elems, elem, type, content;
	    elems = msg.getElems();//鑾峰彇娑堟伅鍖呭惈鐨勫厓绱犳暟缁�
	    for (var i in elems) {
	        elem = elems[i];
	        type = elem.getType();//鑾峰彇鍏冪礌绫诲瀷
	        content = elem.getContent();//鑾峰彇鍏冪礌瀵硅薄
	        var msgToHtml = null;
	        switch (type) {
	            case webim.MSG_ELEMENT_TYPE.TEXT:
	                msgToHtml = convertTextMsgToHtml(content,msg);
	                break;
	            case webim.MSG_ELEMENT_TYPE.FACE:
	                msgToHtml = convertFaceMsgToHtml(content,msg);
	                break;
	            case webim.MSG_ELEMENT_TYPE.IMAGE:
	                msgToHtml = convertImageMsgToHtml(content,msg);
	                break;
	            case webim.MSG_ELEMENT_TYPE.SOUND:
	                msgToHtml = convertSoundMsgToHtml(content,msg);
	                break;
	            case webim.MSG_ELEMENT_TYPE.FILE:
	                msgToHtml = convertFileMsgToHtml(content,msg);
	                break;
	            case webim.MSG_ELEMENT_TYPE.LOCATION://鏆備笉鏀寔鍦扮悊浣嶇疆
	                //msgToHtml = convertLocationMsgToHtml(content);
	                break;
	            case webim.MSG_ELEMENT_TYPE.CUSTOM:
	                msgToHtml = convertCustomMsgToHtml(content,msg);
	                break;
	            case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
	                msgToHtml = convertGroupTipMsgToHtml(content,msg);
	                break;
	            default:
	                webim.Log.error('鏈煡娑堟伅鍏冪礌绫诲瀷: elemType=' + type);
	                break;
	        }
	        
	        if(msgToHtml != false ){
	        	html += msgToHtml;
	        }else{
	        	// 濡傛灉杩斿洖false琛ㄧず闇€瑕佷腑鏂В鏋愯繃绋嬩氦缁欐柊绯荤粺閫氱煡妯″潡澶勭悊
				return false;
	        }
	    }
	    return webim.Tool.formatHtml2Text(html);
	}

	//瑙ｆ瀽鏂囨湰娑堟伅鍏冪礌
	function convertTextMsgToHtml(content) {
	    return content.getText();
	}
	//瑙ｆ瀽琛ㄦ儏娑堟伅鍏冪礌
	function convertFaceMsgToHtml(content) {
	    var faceUrl = null;
	    var data = content.getData();
	    var index = webim.EmotionDataIndexs[data];

	    var emotion = webim.Emotions[index];
	    if (emotion && emotion[1]) {
	        faceUrl = emotion[1];
	    }
	    if (faceUrl) {
	        return '<img src="' + faceUrl + '"/>';
	    } else {
	        return data;
	    }
	}
	//瑙ｆ瀽鍥剧墖娑堟伅鍏冪礌
	function convertImageMsgToHtml(content) {
	    var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL);//灏忓浘
	    var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE);//澶у浘
	    var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN);//鍘熷浘
	    if (!bigImage) {
	        bigImage = smallImage;
	    }
	    if (!oriImage) {
	        oriImage = smallImage;
	    }
	    return '<img src="' + smallImage.getUrl() + '#' + bigImage.getUrl() + '#' + oriImage.getUrl() + '" style="CURSOR: hand" id="' + content.getImageId() + '" bigImgUrl="' + bigImage.getUrl() + '" onclick="imageClick(this)" />';
	}
	//瑙ｆ瀽璇煶娑堟伅鍏冪礌
	function convertSoundMsgToHtml(content) {
	    var second = content.getSecond();//鑾峰彇璇煶鏃堕暱
	    var downUrl = content.getDownUrl();
	    if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
	        return '[杩欐槸涓€鏉¤闊虫秷鎭痌demo鏆備笉鏀寔ie8(鍚�)浠ヤ笅娴忚鍣ㄦ挱鏀捐闊�,璇煶URL:' + downUrl;
	    }
	    return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
	}
	//瑙ｆ瀽鏂囦欢娑堟伅鍏冪礌
	function convertFileMsgToHtml(content) {
	    var fileSize = Math.round(content.getSize() / 1024);
	    return '<a href="' + content.getDownUrl() + '" title="鐐瑰嚮涓嬭浇鏂囦欢" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';

	}
	//瑙ｆ瀽浣嶇疆娑堟伅鍏冪礌
	function convertLocationMsgToHtml(content) {
	    return '缁忓害=' + content.getLongitude() + ',绾害=' + content.getLatitude() + ',鎻忚堪=' + content.getDesc();
	}
	//瑙ｆ瀽鑷畾涔夋秷鎭厓绱�
	function convertCustomMsgToHtml(content,msg) {
	    var data = content.getData() || '{}';
	    var type = content.getDesc();
	    var ext = content.getExt();
	    
	    var jsonExt = JSON.parse(ext);
	    var jsonData = JSON.parse(data) || {};
	    //鍙戦€佽€呮暟鎹�
	    var userData = {
			'userId' : msg.fromAccount,
			'nickname' : jsonExt.identifierNick,
			'headerUrl' : jsonExt.headerUrl,
			'role' : jsonExt.role,
			'subGroupId' : jsonExt.subGroupId
		};
	    
	    var notifyData = {
	    	'userData' : userData,
	    	'msgData' : jsonData,
	    	'type' : type
	    };
	    
	    switch (type) {
	    case 'command':
			callNotify('onCommandArrive', {
	        	'type' : jsonData.command,
	        	'status' : 'success',
	        	'data' : {
	        		'userData' : userData,
	        		'resposeData' : jsonData.respose,
	        		'resposeParam' : jsonData.param
	        	}
	        });
			break;
		case 'userLogin':
			callNotify('onUserStatusChange', {
	        	'type' : 'userLoginStatusNotify',
	        	'status' : 'login',
	        	'data' : notifyData
	        });
			break;
		default:
			callNotify('onImCustomArrive', {//鍏朵粬鎯呭喌鍒欏皢鑷畾涔夋秷鎭€氱煡鍒板鎴风鐢卞鎴风鑷澶勭悊
				'type' : type,
				'status' : 'arrived',
				'data' : notifyData
	        });
			break;
		}
	    return false;
	}
	
	
	//瑙ｆ瀽缇ゆ彁绀烘秷鎭厓绱�
	function convertGroupTipMsgToHtml(content) {
	    var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
	    var text = '';
	    var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
	    var opType, opUserId, userIdList;
	    var memberCount;
	    opType = content.getOpType();//缇ゆ彁绀烘秷鎭被鍨嬶紙鎿嶄綔绫诲瀷锛�
	    opUserId = content.getOpUserId();//鎿嶄綔浜篿d
	    
	    switch (opType) {
	        case webim.GROUP_TIP_TYPE.JOIN://鍔犲叆缇�
	            userIdList = content.getUserIdList();
	            //text += opUserId + '閭€璇蜂簡';
	            for (var m in userIdList) {
	            	var userProfilePortrait = _userContainer[userIdList[m]] || {};
	                text += (userProfilePortrait['nickname'] || userIdList[m]) + ',';
	                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
	                    text += '绛�' + userIdList.length + '浜�';
	                    break;
	                }
	            }
	            
	            //鍒ゆ柇鏄惁閲嶅杩涘叆鎴块棿
	            for (var m in userIdList) {
	            	if(userIdList[m] == loginInfo.identifier){
	            		if(!loginInfo.loginCount){
	            			loginInfo.loginCount = 1;
	            		}else{
	            			loginInfo.loginCount ++;
	            		}
	            		if(loginInfo.loginCount>1){
	            			callNotify('onUserStatusChange', {
	        					'type' : 'userLoginStatusNotify',
	        					'status' : 'repeat'
	        				});
	            		}
	            	}
	            }
	            
	            text = text.substring(0, text.length - 1);
	            text += '杩涘叆鎴块棿';
	            return false;
	            //鎴块棿鎴愬憳鏁板姞1
//	            memberCount = $('#user-icon-fans').html();
//	            $('#user-icon-fans').html(parseInt(memberCount) + 1);
	            break;
	        case webim.GROUP_TIP_TYPE.QUIT://閫€鍑虹兢
	            text += opUserId + '绂诲紑鎴块棿';
	            //鎴块棿鎴愬憳鏁板噺1
//	            memberCount = parseInt($('#user-icon-fans').html());
//	            if (memberCount > 0) {
//	                $('#user-icon-fans').html(memberCount - 1);
//	            }
	            callNotify('onUserStatusChange', {
					'type' : 'userLoginStatusNotify',
					'status' : 'leave'
				});
	            break;
	        case webim.GROUP_TIP_TYPE.KICK://韪㈠嚭缇�
	            text += opUserId + '灏�';
	            userIdList = content.getUserIdList();
	            for (var m in userIdList) {
	                text += userIdList[m] + ',';
	                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
	                    text += '绛�' + userIdList.length + '浜�';
	                    break;
	                }
	            }
	            text += '韪㈠嚭璇ョ兢';
	            break;
	        case webim.GROUP_TIP_TYPE.SET_ADMIN://璁剧疆绠＄悊鍛�
	            text += opUserId + '灏�';
	            userIdList = content.getUserIdList();
	            for (var m in userIdList) {
	                text += userIdList[m] + ',';
	                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
	                    text += '绛�' + userIdList.length + '浜�';
	                    break;
	                }
	            }
	            text += '璁句负绠＄悊鍛�';
	            break;
	        case webim.GROUP_TIP_TYPE.CANCEL_ADMIN://鍙栨秷绠＄悊鍛�
	            text += opUserId + '鍙栨秷';
	            userIdList = content.getUserIdList();
	            for (var m in userIdList) {
	                text += userIdList[m] + ',';
	                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
	                    text += '绛�' + userIdList.length + '浜�';
	                    break;
	                }
	            }
	            text += '鐨勭鐞嗗憳璧勬牸';
	            break;

	        case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO://缇よ祫鏂欏彉鏇�
	            text += opUserId + '淇敼浜嗙兢璧勬枡锛�';
	            var groupInfoList = content.getGroupInfoList();
	            var type, value;
	            for (var m in groupInfoList) {
	                type = groupInfoList[m].getType();
	                value = groupInfoList[m].getValue();
	                switch (type) {
	                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
	                        text += '缇ゅご鍍忎负' + value + '; ';
	                        break;
	                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
	                        text += '缇ゅ悕绉颁负' + value + '; ';
	                        break;
	                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
	                        text += '缇や富涓�' + value + '; ';
	                        break;
	                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
	                        text += '缇ゅ叕鍛婁负' + value + '; ';
	                        break;
	                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
	                        text += '缇ょ畝浠嬩负' + value + '; ';
	                        break;
	                    default:
	                        text += '鏈煡淇℃伅涓�:type=' + type + ',value=' + value + '; ';
	                        break;
	                }
	            }
	            break;

	        case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO://缇ゆ垚鍛樿祫鏂欏彉鏇�(绂佽█鏃堕棿)
	            text += opUserId + '淇敼浜嗙兢鎴愬憳璧勬枡:';
	            var memberInfoList = content.getMemberInfoList();
	            var userId, shutupTime;
	            for (var m in memberInfoList) {
	                userId = memberInfoList[m].getUserId();
	                shutupTime = memberInfoList[m].getShutupTime();
	                text += userId + ': ';
	                if (shutupTime != null && shutupTime !== undefined) {
	                    if (shutupTime == 0) {
	                        text += '鍙栨秷绂佽█; ';
	                    } else {
	                        text += '绂佽█' + shutupTime + '绉�; ';
	                    }
	                } else {
	                    text += ' shutupTime涓虹┖';
	                }
	                if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
	                    text += '绛�' + memberInfoList.length + '浜�';
	                    break;
	                }
	            }
	            break;
	        default:
	            text += '鏈煡缇ゆ彁绀烘秷鎭被鍨嬶細type=' + opType;
	            break;
	    }
	    return text;
	}

	/**
	 * 姣杞秷鎭樉绀虹殑鏃堕棿
	 * @param millisecond
	 */
	function convertMillisecondToHtml(millisecond){
		if(!millisecond || millisecond < 0){
			return '';
		}
		
		millisecond = millisecond * 1000;
		var current = new Date().getTime();
		
		
		var time = new Date(millisecond);
		var y = time.getFullYear();//骞�
		var m = time.getMonth() + 1;//鏈�
		var d = time.getDate();//鏃�
		var h = time.getHours();//鏃�
		var mm = time.getMinutes();//鍒�
		var s = time.getSeconds();//绉�
		if((current - millisecond) > 86400000 && (current - millisecond) < 172800000){
			//鏄ㄥぉ鐨勬秷鎭�
			return '鏄ㄥぉ' +h + ':' + mm;
		}else if((current - millisecond) > 172800000){
			//鏄ㄥぉ鐨勬秷鎭�
			return  m + '-' + ''+d + ' ' +h + ':' + mm;
		}else{
			return h + ':' + mm;
		}
	}

	//tls鐧诲綍
	function tlsLogin() {
	    //璺宠浆鍒癟LS鐧诲綍椤甸潰
	    TLSHelper.goLogin({
	        sdkappid: loginInfo.sdkAppID,
	        acctype: loginInfo.accountType,
	        url: window.location.href
	    });
	}
	//绗笁鏂瑰簲鐢ㄩ渶瑕佸疄鐜拌繖涓嚱鏁帮紝骞跺湪杩欓噷鎷垮埌UserSig
	function tlsGetUserSig(res) {
	    //鎴愬姛鎷垮埌鍑瘉
	    if (res.ErrorCode == webim.TLS_ERROR_CODE.OK) {
	        //浠庡綋鍓峌RL涓幏鍙栧弬鏁颁负identifier鐨勫€�
	        loginInfo.identifier = webim.Tool.getQueryString('identifier');
	        //鎷垮埌姝ｅ紡韬唤鍑瘉
	        loginInfo.userSig = res.UserSig;
	        //浠庡綋鍓峌RL涓幏鍙栧弬鏁颁负sdkappid鐨勫€�
	        loginInfo.sdkAppID = loginInfo.appIDAt3rd = Number(webim.Tool.getQueryString('sdkappid'));
	        //浠巆ookie鑾峰彇accountType
	        var accountType = webim.Tool.getCookie('accountType');
	        if (accountType) {
	            loginInfo.accountType = accountType;
	            sdkLogin();//sdk鐧诲綍
	        } else {
	            location.href = location.href.replace(/\?.*$/gi,'');
	        }
	    } else {
	        //绛惧悕杩囨湡锛岄渶瑕侀噸鏂扮櫥褰�
	        if (res.ErrorCode == webim.TLS_ERROR_CODE.SIGNATURE_EXPIRATION) {
	            tlsLogin();
	        } else {
	            alert('[' + res.ErrorCode + ']' + res.ErrorInfo);
	        }
	    }
	}

	//鍗曞嚮鍥剧墖浜嬩欢
	function imageClick(imgObj) {
	    var imgUrls = imgObj.src;
	    var imgUrlArr = imgUrls.split('#'); //瀛楃鍒嗗壊
	    var smallImgUrl = imgUrlArr[0];//灏忓浘
	    var bigImgUrl = imgUrlArr[1];//澶у浘
	    var oriImgUrl = imgUrlArr[2];//鍘熷浘
	    webim.Log.info('灏忓浘url:' + smallImgUrl);
	    webim.Log.info('澶у浘url:' + bigImgUrl);
	    webim.Log.info('鍘熷浘url:' + oriImgUrl);
	}


	//鍒囨崲鎾斁audio瀵硅薄
	function onChangePlayAudio(obj) {
	    if (curPlayAudio) {//濡傛灉姝ｅ湪鎾斁璇煶
	        if (curPlayAudio != obj) {//瑕佹挱鏀剧殑璇煶璺熷綋鍓嶆挱鏀剧殑璇煶涓嶄竴鏍�
	            curPlayAudio.currentTime = 0;
	            curPlayAudio.pause();
	            curPlayAudio = obj;
	        }
	    } else {
	        curPlayAudio = obj;//璁板綍褰撳墠鎾斁鐨勮闊�
	    }
	}

	//鍗曞嚮璇勮鍥剧墖
	function smsPicClick() {
	    if (!loginInfo.identifier) {//鏈櫥褰�
	        if (accountMode == 1) {//鎵樼妯″紡
	            //灏哸ccount_type淇濆瓨鍒癱ookie涓�,鏈夋晥鏈熸槸1澶�
	            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
	            //璋冪敤tls鐧诲綍鏈嶅姟
	            tlsLogin();
	        } else {//鐙珛妯″紡
	            alert('璇峰～鍐欏笎鍙峰拰绁ㄦ嵁');
	        }
	        return;
	    } else {
	        hideDiscussTool();//闅愯棌璇勮宸ュ叿鏍�
	        showDiscussForm();//鏄剧ず璇勮琛ㄥ崟
	    }
	}
	
//	/**
//	 * 鍒涘缓鏂囨湰娑堟伅
//	 */
//	function createTextMsg(isSend,msgtosend,msgTime,identifier,identifierNick){
//	    var seq = -1;//娑堟伅搴忓垪锛�-1琛ㄧずsdk鑷姩鐢熸垚锛岀敤浜庡幓閲�
//	    var random = Math.round(Math.random() * 4294967296);//娑堟伅闅忔満鏁帮紝鐢ㄤ簬鍘婚噸
//	    msgTime = msgTime || Math.round(new Date().getTime() / 1000);//娑堟伅鏃堕棿鎴�
//	    var subType;//娑堟伅瀛愮被鍨�
//	    if (selType == webim.SESSION_TYPE.GROUP) {
//	        //缇ゆ秷鎭瓙绫诲瀷濡備笅锛�
//	        //webim.GROUP_MSG_SUB_TYPE.COMMON-鏅€氭秷鎭�,
//	        //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-鐐硅禐娑堟伅锛屼紭鍏堢骇鏈€浣�
//	        //webim.GROUP_MSG_SUB_TYPE.TIP-鎻愮ず娑堟伅(涓嶆敮鎸佸彂閫侊紝鐢ㄤ簬鍖哄垎缇ゆ秷鎭瓙绫诲瀷)锛�
//	        //webim.GROUP_MSG_SUB_TYPE.REDPACKET-绾㈠寘娑堟伅锛屼紭鍏堢骇鏈€楂�
//	        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
//
//	    } else {
//	        //C2C娑堟伅瀛愮被鍨嬪涓嬶細
//	        //webim.C2C_MSG_SUB_TYPE.COMMON-鏅€氭秷鎭�,
//	        subType = webim.C2C_MSG_SUB_TYPE.COMMON;
//	    }
//		
//		if (!selSess) {
//	       selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
//	    }
//		var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, identifier, subType, identifierNick);
//	    //瑙ｆ瀽鏂囨湰鍜岃〃鎯�
//	    var expr = /\[[^[\]]{1,3}\]/mg;
//	    var emotions = msgtosend.match(expr);
//	    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
//	    if (!emotions || emotions.length < 1) {
//	        text_obj = new webim.Msg.Elem.Text(msgtosend);
//	        msg.addText(text_obj);
//	    } else {//鏈夎〃鎯�
//
//	        for (var i = 0; i < emotions.length; i++) {
//	            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
//	            if (tmsg) {
//	                text_obj = new webim.Msg.Elem.Text(tmsg);
//	                msg.addText(text_obj);
//	            }
//	            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
//	            emotion = webim.Emotions[emotionIndex];
//	            if (emotion) {
//	                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
//	                msg.addFace(face_obj);
//	            } else {
//	                text_obj = new webim.Msg.Elem.Text(emotions[i]);
//	                msg.addText(text_obj);
//	            }
//	            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
//	            msgtosend = msgtosend.substring(restMsgIndex);
//	        }
//	        if (msgtosend) {
//	            text_obj = new webim.Msg.Elem.Text(msgtosend);
//	            msg.addText(text_obj);
//	        }
//	    }
//	    return msg;
//	}
	
	
	/**
	 * 鍒涘缓鏂囨湰娑堟伅
	 */
	function createTextMsg(isSend,msgtosend,msgTime,identifier,identifierNick,toAccount){
		if(!msgtosend){
			return null;
		}
	    var seq = -1;//娑堟伅搴忓垪锛�-1琛ㄧずsdk鑷姩鐢熸垚锛岀敤浜庡幓閲�
	    var random = Math.round(Math.random() * 4294967296);//娑堟伅闅忔満鏁帮紝鐢ㄤ簬鍘婚噸
	    msgTime = msgTime || Math.round(new Date().getTime() / 1000);//娑堟伅鏃堕棿鎴�
	    var subType;//娑堟伅瀛愮被鍨�
	    if (selType == webim.SESSION_TYPE.GROUP) {
	        //缇ゆ秷鎭瓙绫诲瀷濡備笅锛�
	        //webim.GROUP_MSG_SUB_TYPE.COMMON-鏅€氭秷鎭�,
	        //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-鐐硅禐娑堟伅锛屼紭鍏堢骇鏈€浣�
	        //webim.GROUP_MSG_SUB_TYPE.TIP-鎻愮ず娑堟伅(涓嶆敮鎸佸彂閫侊紝鐢ㄤ簬鍖哄垎缇ゆ秷鎭瓙绫诲瀷)锛�
	        //webim.GROUP_MSG_SUB_TYPE.REDPACKET-绾㈠寘娑堟伅锛屼紭鍏堢骇鏈€楂�
	        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

	    } else {
	        //C2C娑堟伅瀛愮被鍨嬪涓嬶細
	        //webim.C2C_MSG_SUB_TYPE.COMMON-鏅€氭秷鎭�,
	        subType = webim.C2C_MSG_SUB_TYPE.COMMON;
	    }

	    var session = null;
        if(toAccount){
            session = privateSelSess[toAccount];
            if (!session) {
                session = new webim.Session(webim.SESSION_TYPE.C2C, toAccount, toAccount, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
                privateSelSess[toAccount] = session;
			}
        }else {
            session = selSess;
            if (!session) {
                selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
                session = selSess;
            }
        }
		var msg = new webim.Msg(session, isSend, seq, random, msgTime, identifier || loginInfo.identifier, subType, identifierNick || loginInfo.identifierNick);
	    //瑙ｆ瀽鏂囨湰鍜岃〃鎯�
	    var expr = /\[[^[\]]{1,3}\]/mg;
	    var emotions = msgtosend.match(expr);
	    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
	    if (!emotions || emotions.length < 1) {
	        text_obj = new webim.Msg.Elem.Text(msgtosend);
	        msg.addText(text_obj);
	    } else {//鏈夎〃鎯�

	        for (var i = 0; i < emotions.length; i++) {
	            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
	            if (tmsg) {
	                text_obj = new webim.Msg.Elem.Text(tmsg);
	                msg.addText(text_obj);
	            }
	            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
	            emotion = webim.Emotions[emotionIndex];
	            if (emotion) {
	                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
	                msg.addFace(face_obj);
	            } else {
	                text_obj = new webim.Msg.Elem.Text(emotions[i]);
	                msg.addText(text_obj);
	            }
	            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
	            msgtosend = msgtosend.substring(restMsgIndex);
	        }
	        if (msgtosend) {
	            text_obj = new webim.Msg.Elem.Text(msgtosend);
	            msg.addText(text_obj);
	        }
	    }
	    return msg;
	}

	/**
	 * 鍙戦€佽嚜瀹氫箟娑堟伅
	 */
	this.sendCustomMsg = function(msgData) {
		msgData = msgData || {};
		msgData.data = msgData.data || {};
		msgData.ext = {
			'identifierNick' : loginInfo.identifierNick,
			'headerUrl' : loginInfo.headerUrl,
			'role' : loginInfo.role,
			'subGroupId' : loginInfo.subGroupId,
			'userId' : loginInfo.userId
		}
		
	    var data = JSON.stringify(msgData.data);
	    var desc = msgData.type;
	    var ext = JSON.stringify(msgData.ext);

	    if (!selSess) {
	        selSess = new webim.Session(selType, selToID, selToID, loginInfo.headerUrl, Math.round(new Date().getTime() / 1000));
	    }
	    var msg = new webim.Msg(selSess, true,-1,-1,-1,loginInfo.identifier,0,loginInfo.identifierNick);
	    var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext);
	    msg.addCustom(custom_obj);
	    // 鐩存帴鏄剧ず涓€鏉�
	    _this.showMessage(msg);
	    
	    //璋冪敤鍙戦€佹秷鎭帴鍙�
	    webim.sendMsg(msg, function (resp) {
	    	if('command' == desc){
	    		callNotify('onCommandSend', {
		    		'status' : 'success',
		    		'data' : msgData
		    	});
	    	}else{
	    		callNotify('onImCustomSend', {
		    		'status' : 'success',
		    		'data' : msgData
		    	});
	    	}
	    }, function (err) {
	    	if('command' == desc){
	    		callNotify('onCommandSend', {
	    			'status' : 'fial',
	    			'msg' : err,
	    			'data' : msgData
	    		});
	    	}else{
	    		callNotify('onImCustomSend', {
	    			'status' : 'fial',
	    			'msg' : err,
	    			'data' : msgData
	    		});
	    	}
	    });
	}



	/**
	 * 鍙戦€佹秷鎭�(鏅€氭秷鎭�)
	 */
	this.sendTextMsg = function(msgContent,toUserId,messageId) {

	    if (!loginInfo.identifier) {//鏈櫥褰�
	        if (accountMode == 1) {//鎵樼妯″紡
	            //灏哸ccount_type淇濆瓨鍒癱ookie涓�,鏈夋晥鏈熸槸1澶�
	            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
	            //璋冪敤tls鐧诲綍鏈嶅姟
	            tlsLogin();
	        } else {//鐙珛妯″紡
	        	webim.Log.debug('鐢ㄦ埛鐧诲綍閿欒');
	        }
	        return;
	    }

	    if (!selToID) {
	        webim.Log.error('鐢ㄦ埛娌℃湁杩涘叆鎴块棿,鏆傛椂涓嶈兘鑱婂ぉ');
	        $('#' + _config.clientConfig.textMsgInput).val('');
	        return;
	    }
	    
	    var msgLen = webim.Tool.getStrBytes(msgContent);

	    if (msgContent.length < 1) {
	        callNotify('onImTextSend', {
	        	'status' : 'error',
	        	'errInfo' : '鍙戦€佺殑娑堟伅涓嶈兘涓虹┖!'
	        });
	        return;
	    }

	    var maxLen, errInfo;
	    if (selType == webim.SESSION_TYPE.GROUP) {
	        maxLen = maxMessageLength || webim.MSG_MAX_LENGTH.GROUP;
	        errInfo = '娑堟伅闀垮害瓒呭嚭闄愬埗(鏈€澶�' + Math.round(maxLen / 3) + '姹夊瓧)';
	    } else {
	        maxLen = maxMessageLength || webim.MSG_MAX_LENGTH.C2C;
	        errInfo = '娑堟伅闀垮害瓒呭嚭闄愬埗(鏈€澶�' + Math.round(maxLen / 3) + '姹夊瓧)';
	    }
	    if (msgLen > maxLen) {
	    	$('#' + _config.clientConfig.textMsgInput).val(msgContent.substring(0, Math.round(maxLen / 3)));
	        callNotify('onImTextSend', {
	        	'status' : 'error',
	        	'errInfo' : errInfo,
	        	'content' : msgContent
	        });
	        return;
	    }

	    //閫氱煡鏂囨湰娑堟伅鍙戦€�
	    var allow = callNotify('onImTextSend', {
			'status' : 'success',
			'content' : msgContent,
			'messageId' : messageId
		});
		if (!allow) {
			return false;
		}
	    
	    var isSend = true;//鏄惁涓鸿嚜宸卞彂閫�
	    var msg = createTextMsg(isSend,msgContent,null,null,null,toUserId);
	    if(messageId){
	    	msg.random = messageId
		}
	    // 鐩存帴鏄剧ず涓€鏉�
	    _this.showMessage(msg);
	    
	    webim.sendMsg(msg, function (resp) {
	        callNotify('onTextMsgSend', {
	        	'status' : 'success',
	        	'data' : msg
	        });
	    }, function (err) {
	        webim.Log.error('鍙戞秷鎭け璐�:' + err.ErrorInfo);
	        callNotify('onTextMsgSend', {
	        	'status' : 'error',
	        	'data' : msg
	        });
	    });
	}
	
	/**
	 * 鍙戦€佹秷鎭�(鏅€氭秷鎭�)
	 */
	this.getEmojis = function(){
		return webim.Emotions;
	}
	
	
	
	//鍙戦€佹秷鎭�(缇ょ偣璧炴秷鎭�)
	function sendGroupLoveMsg() {

	    if (!loginInfo.identifier) {//鏈櫥褰�
	        if (accountMode == 1) {//鎵樼妯″紡
	            //灏哸ccount_type淇濆瓨鍒癱ookie涓�,鏈夋晥鏈熸槸1澶�
	            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
	            //璋冪敤tls鐧诲綍鏈嶅姟
	            tlsLogin();
	        } else {//鐙珛妯″紡
	            alert('璇峰～鍐欏笎鍙峰拰绁ㄦ嵁');
	        }
	        return;
	    }

	    if (!selToID) {
	        alert('鎮ㄨ繕娌℃湁杩涘叆鎴块棿锛屾殏涓嶈兘鐐硅禐');
	        return;
	    }

	    if (!selSess) {
	        selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
	    }
	    var isSend = true;//鏄惁涓鸿嚜宸卞彂閫�
	    var seq = -1;//娑堟伅搴忓垪锛�-1琛ㄧずsdk鑷姩鐢熸垚锛岀敤浜庡幓閲�
	    var random = Math.round(Math.random() * 4294967296);//娑堟伅闅忔満鏁帮紝鐢ㄤ簬鍘婚噸
	    var msgTime = Math.round(new Date().getTime() / 1000);//娑堟伅鏃堕棿鎴�
	    //缇ゆ秷鎭瓙绫诲瀷濡備笅锛�
	    //webim.GROUP_MSG_SUB_TYPE.COMMON-鏅€氭秷鎭�,
	    //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-鐐硅禐娑堟伅锛屼紭鍏堢骇鏈€浣�
	    //webim.GROUP_MSG_SUB_TYPE.TIP-鎻愮ず娑堟伅(涓嶆敮鎸佸彂閫侊紝鐢ㄤ簬鍖哄垎缇ゆ秷鎭瓙绫诲瀷)锛�
	    //webim.GROUP_MSG_SUB_TYPE.REDPACKET-绾㈠寘娑堟伅锛屼紭鍏堢骇鏈€楂�
	    var subType = webim.GROUP_MSG_SUB_TYPE.LOVEMSG;

	    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
	    var msgtosend = 'love_msg';
	    var text_obj = new webim.Msg.Elem.Text(msgtosend);
	    msg.addText(text_obj);

	    webim.sendMsg(msg, function (resp) {
	        if (selType == webim.SESSION_TYPE.C2C) {//绉佽亰鏃讹紝鍦ㄨ亰澶╃獥鍙ｆ墜鍔ㄦ坊鍔犱竴鏉″彂鐨勬秷鎭紝缇よ亰鏃讹紝闀胯疆璇㈡帴鍙ｄ細杩斿洖鑷繁鍙戠殑娑堟伅
	            showMsg(msg);
	        }
	        webim.Log.info('鐐硅禐鎴愬姛');
	    }, function (err) {
	        webim.Log.error('鍙戦€佺偣璧炴秷鎭け璐�:' + err.ErrorInfo);
	        alert('鍙戦€佺偣璧炴秷鎭け璐�:' + err.ErrorInfo);
	    });
	}
	//闅愯棌璇勮鏂囨湰妗�
	function hideDiscussForm() {
	    $('.video-discuss-form').hide();
	}
	//鏄剧ず璇勮鏂囨湰妗�
	function showDiscussForm() {
	    $('.video-discuss-form').show();
	}
	//闅愯棌璇勮宸ュ叿鏍�
	function hideDiscussTool() {
	    $('.video-discuss-tool').hide();
	}
	//鏄剧ず璇勮宸ュ叿鏍�
	function showDiscussTool() {
	    $('.video-discuss-tool').show();
	}
//	//闅愯棌琛ㄦ儏妗�
//	function hideDiscussEmotion() {
//		$('#' + _config.clientConfig.emojis.emojiImgBox).hide();
//		// $('.video-discuss-emotion').hide();
//		// $('.video-discuss-emotion').fadeOut('slow');
//	}
//	//鏄剧ず琛ㄦ儏妗�
//	function showDiscussEmotion() {
//		$('#' + _config.clientConfig.emojis.emojiImgBox).show();
//		// $('.video-discuss-emotion').show();
//		// $('.video-discuss-emotion').fadeIn('slow');
//
//	}
	//灞曠ず鐐硅禐鍔ㄧ敾
	function showLoveMsgAnimation() {
	    //鐐硅禐鏁板姞1
	    var loveCount = $('#user-icon-like').html();
	    $('#user-icon-like').html(parseInt(loveCount) + 1);
	    var toolDiv = document.getElementById('video-discuss-tool');
	    var loveSpan = document.createElement('span');
	    var colorList = ['red', 'green', 'blue'];
	    var max = colorList.length - 1;
	    var min = 0;
	    var index = parseInt(Math.random() * (max - min + 1) + min, max + 1);
	    var color = colorList[index];
	    loveSpan.setAttribute('class', 'like-icon zoomIn ' + color);
	    toolDiv.appendChild(loveSpan);
	}

	//鍒濆鍖栬〃鎯�
	function initEmotionUL() {
		
		var emojis = _config.clientConfig.emojis;
		webim.Log.debug('_config.clientConfig.emojis');
		webim.Log.debug(emojis);
		
		if(emojis){
			if(!emojis.append){
				 webim.EmotionDataIndexs = {};
				 webim.Emotions = {};
			}
			
			var count = 0;
			for (var index in webim.Emotions) {
				count ++;
			}
			
			var imgs = emojis.imgs || [];
			var index = count;
			for ( var i in imgs) {
				var img = imgs[i];
				var name = [ '[' + i + ']' ];
				var oldIndex = webim.EmotionDataIndexs[name];
				if (typeof oldIndex != 'undefined') {// 宸插瓨鍦ㄨ琛ㄦ儏
					webim.Emotions[oldIndex][1] = img;
				} else {// 鏂拌〃鎯�
					webim.EmotionDataIndexs[name] = index;
					webim.Emotions['' + index] = [ name, img ];
					index++;
				}
			}
		}
		
//		hideDiscussEmotion();
//		webim.Log.debug(webim.Emotions);
		
//	    for (var index in webim.Emotions) { 
//	        var emotions = $('<img>').attr({
//	            'id': webim.Emotions[index][0],
//	            'src': webim.Emotions[index][1],
//	            'style': 'cursor:pointer;'
//	        }).click(function () {
//	            selectEmotionImg(this);
//	        });
//	        $('<li>').append(emotions).appendTo($('#' + emojis.emojiImgBox));
//	    }
//	    
//	    window.isClickEmojiImgBox = false;
//		window.isClickEmojiBtn = false;
//		
//		//鐐瑰嚮鍏朵粬鍖哄煙鏄〃鎯呭寘娑堝け
//		$(window).click(function() {
//			if (isClickEmojiBtn) {
//				showDiscussEmotion();
//				isClickEmojiBtn = false;
//				return;
//			}
//			if (!isClickEmojiImgBox) {
//				hideDiscussEmotion();
//			}
//			isClickEmojiImgBox = false;
//		});
//		
//		$('#' + emojis.emojiImgBox).click(function(){
//			isClickEmojiImgBox = true;
//		});
//		
//		
//		//褰撴寜浣忚〃鎯呭寘鎸夐挳鏄脊鍑鸿〃鎯呭寘
//		$('#' + _config.clientConfig.emojiBtn).on('mousedown',function() {
//			isClickEmojiBtn = true;
//		});
	}

	//鎵撳紑鎴栨樉绀鸿〃鎯�
	function showEmotionDialog() {
	    if (openEmotionFlag) {//濡傛灉宸茬粡鎵撳紑
	        openEmotionFlag = false;
	        hideDiscussEmotion();//鍏抽棴
	    } else {//濡傛灉鏈墦寮€
	        openEmotionFlag = true;
	        showDiscussEmotion();//鎵撳紑
	    }
	}
	//閫変腑琛ㄦ儏
	function selectEmotionImg(selImg) {
		var textMsgInput = '#' + _config.clientConfig.textMsgInput;
	    $(textMsgInput).val($(textMsgInput).val() + selImg.id);
	}

	//閫€鍑哄ぇ缇�
	function quitBigGroup() {
	    var options = {
	        'GroupId': avChatRoomId//缇d
	    };
	    webim.quitBigGroup(
	        options,
	        function (resp) {
	            webim.Log.info('閫€缇ゆ垚鍔�');
	            $('#video_sms_list').find('li').remove();
	            //webim.Log.error('杩涘叆鍙︿竴涓ぇ缇�:'+avChatRoomId2);
	            //applyJoinBigGroup(avChatRoomId2);//鍔犲叆澶х兢
	        },
	        function (err) {
	            alert(err.ErrorInfo);
	        }
	    );
	}

	//鐧诲嚭
	function logout() {
	    //鐧诲嚭
	    webim.logout(
	        function (resp) {
	            webim.Log.info('鐧诲嚭鎴愬姛');
	            loginInfo.identifier = null;
	            loginInfo.userSig = null;
	            $('#video_sms_list').find('li').remove();
	            var indexUrl = window.location.href;
	            var pos = indexUrl.indexOf('?');
	            if (pos >= 0) {
	                indexUrl = indexUrl.substring(0, pos);
	            }
	            window.location.href = indexUrl;
	        }
	    );
	}

	/**
	 * 璋冪敤鍑芥暟
	 * @param fName
	 * @param param
	 */
	function callNotify (fName,param){
		return _tools.callFunction(fName,_config.notify,param);
	}


	/**
	 * 棰勫鐞嗙敤鎴蜂俊鎭�
	 */
	function prepareUserProfile(prepareUser,userId, msg, callback) {
	    var userData = _userContainer[userId];
	    var missData = false;
	    if(!userData || !userData.nickname || !userData.subGroupId){
	    	missData = true;
	    }
		var sync = (typeof msg.sync != 'undefined' && !msg.sync);
		if (!sync && missData && !msg.fromClient && prepareUser != '@TIM#SYSTEM') {
			webim.getProfilePortrait({
				'To_Account' : [ prepareUser],
				'TagList' : 
					[ 'Tag_Profile_IM_Nick', 
					  'Tag_Profile_IM_SelfSignature',
					  'Tag_Profile_IM_Image'
					]
			}, function(successData) {
				userData = {
					'userId' : userId
				};
				if(successData && successData['UserProfileItem'] && successData['UserProfileItem'].length > 0){
					var item = successData['UserProfileItem'][0];
					var profile = item['ProfileItem'];
					for(var key in profile){
						if (profile[key].Tag == 'Tag_Profile_IM_Nick') {//鑾峰彇鑷畾涔夋樀绉�
							userData.nickname = profile[key].Value;
						} else if (profile[key].Tag == 'Tag_Profile_IM_SelfSignature') { //鎴栬€呰嚜瀹氫箟涓€х鍚�
							var value = profile[key].Value || '';
							var values = value.split("_");
							if (values && values.length >= 3) {
								userData.subGroupId = values[0];
								userData.role = values[1];
								userData.nickName = values[2];
							}
							if (values && values.length >= 4) {
								userData.nickName = values[3];
							}
						} else if (profile[key].Tag == 'Tag_Profile_IM_Image') {//鑾峰彇澶村儚
							userData.headerUrl = profile[key].Value;
						}
					}
					
					callNotify('onUserDataChange', {
						'type' : 'changeProfile',
						'status' : 'success',
						'data' : userData
					});
				}
				_userContainer[userId] = userData;
				callback(msg, userData);
			}, function(errorData) {
				webim.Log.error(errorData);
				callback(msg, {});
			});
			return ;
		} else {
			if(msg.fromClient){
				callback(msg, {
					'subGroupId' : msg.subGroupId,
					'role' : msg.role,
					'headerUrl' : msg.headerUrl
				});
			}else{
				callback(msg, userData);
			}
		}
	}

	
	//sdk鐧诲綍
	this.sdkLogin = function(config) {
		
		_config = config;
		
		
		var onGroupSystemNotifys = {
			// "1": onApplyJoinGroupRequestNotify, //鐢宠鍔犵兢璇锋眰锛堝彧鏈夌鐞嗗憳浼氭敹鍒�,鏆備笉鏀寔锛�
			// "2": onApplyJoinGroupAcceptNotify, //鐢宠鍔犵兢琚悓鎰忥紙鍙湁鐢宠浜鸿兘澶熸敹鍒�,鏆備笉鏀寔锛�
			// "3": onApplyJoinGroupRefuseNotify, //鐢宠鍔犵兢琚嫆缁濓紙鍙湁鐢宠浜鸿兘澶熸敹鍒�,鏆備笉鏀寔锛�
			// "4": onKickedGroupNotify, //琚鐞嗗憳韪㈠嚭缇�(鍙湁琚涪鑰呮帴鏀跺埌,鏆備笉鏀寔)
			"5" : onDestoryGroupNotify, // 缇よ瑙ｆ暎(鍏ㄥ憳鎺ユ敹)
			// "6": onCreateGroupNotify, //鍒涘缓缇�(鍒涘缓鑰呮帴鏀�,鏆備笉鏀寔)
			// "7": onInvitedJoinGroupNotify, //閭€璇峰姞缇�(琚個璇疯€呮帴鏀�,鏆備笉鏀寔)
			// "8": onQuitGroupNotify, //涓诲姩閫€缇�(涓诲姩閫€鍑鸿€呮帴鏀�,鏆備笉鏀寔)
			// "9": onSetedGroupAdminNotify, //璁剧疆绠＄悊鍛�(琚缃€呮帴鏀�,鏆備笉鏀寔)
			// "10": onCanceledGroupAdminNotify, //鍙栨秷绠＄悊鍛�(琚彇娑堣€呮帴鏀�,鏆備笉鏀寔)
			"11" : onRevokeGroupNotify, // 缇ゅ凡琚洖鏀�(鍏ㄥ憳鎺ユ敹)
			"255" : onCustomGroupNotify // 鐢ㄦ埛鑷畾涔夐€氱煡(榛樿鍏ㄥ憳鎺ユ敹)
		};
		
		// 鐩戝惉浜嬩欢
		var listeners = {
			"onConnNotify" : onConnNotify, // 閫夊～
			"jsonpCallback" : jsonpCallback, // IE9(鍚�)浠ヤ笅娴忚鍣ㄧ敤鍒扮殑jsonp鍥炶皟鍑芥暟,绉诲姩绔彲涓嶅～锛宲c绔繀濉�
			"onBigGroupMsgNotify" : onBigGroupMsgNotify, // 鐩戝惉鏂版秷鎭�(澶х兢)浜嬩欢锛屽繀濉�
			"onMsgNotify" : onMsgNotify,// 鐩戝惉鏂版秷鎭�(绉佽亰(鍖呮嫭鏅€氭秷鎭拰鍏ㄥ憳鎺ㄩ€佹秷鎭�)锛屾櫘閫氱兢(闈炵洿鎾亰澶╁)娑堟伅)浜嬩欢锛屽繀濉�
			"onGroupSystemNotifys" : onGroupSystemNotifys, // 鐩戝惉锛堝缁堢鍚屾锛夌兢绯荤粺娑堟伅浜嬩欢锛屽繀濉�
			"onGroupInfoChangeNotify" : onGroupInfoChangeNotify,
			"onKickedEventCall"  : function(param){
				if(param==1){
					// 褰搃m閲嶅鐧诲綍鏃跺彂璧峰洖璋�
					callNotify('onUserStatusChange', {
						'type' : 'userLoginStatusNotify',
						'status' : 'repeat'
					});
				}else{
					callNotify('onNetworkError', {
						'component' : 'im'
					});
				}
			}
		};

		_config.listeners = listeners;
		
//		window.loginInfo = _config.loginInfo;
//		window.listeners = _config.listeners;
//		window.options = _config.options;
//		window.avChatRoomId = _config.baseConfig.avChatRoomId;
//
//		window.selType = _config.baseConfig.selType;
//		window.selToID = _config.baseConfig.selToID;
//		window.selSess = _config.baseConfig.selSess;
//		window.selSessHeadUrl = _config.baseConfig.selSessHeadUrl;
		
		loginInfo = _config.loginInfo;
		listeners = _config.listeners;
		options = _config.options;
		avChatRoomId = _config.baseConfig.avChatRoomId;

		selType = _config.baseConfig.selType;
		selToID = _config.baseConfig.selToID;
		selSess = _config.baseConfig.selSess;
		selSessHeadUrl = _config.baseConfig.selSessHeadUrl;
		
		_userContainer = _config.userContainer;
		_appIdLength = loginInfo.appId.length;
	    //web sdk 鐧诲綍
	    webim.login(loginInfo, listeners, options,
	        function (identifierNick) {
	            //identifierNick涓虹櫥褰曠敤鎴锋樀绉�(娌℃湁璁剧疆鏃讹紝涓哄笎鍙�)锛屾棤鐧诲綍鎬佹椂涓虹┖
	            webim.Log.info('webim鐧诲綍鎴愬姛');
	            applyJoinBigGroup(avChatRoomId);//鍔犲叆澶х兢
	            hideDiscussForm();//闅愯棌璇勮琛ㄥ崟
	            initEmotionUL();//鍒濆鍖栬〃鎯�
	            webim.setAutoRead(selSess, true, true);
	            
//	            //鐢ㄦ埛灞炴€�
//	            var profile = {
//	        	  'nickname' : loginInfo.identifierNick,
//	  			  'headerUrl' : loginInfo.headerUrl,
//	  			  'role' : loginInfo.role,
//	  			  'subGroupId' : loginInfo.subGroupId
//	            };
//	            //鐢ㄦ埛鐧诲綍鏃朵繚瀛樿嚜宸辩殑灞炴€�
//	            _userContainer[loginInfo.identifier] = profile;
	            
	            //璁剧疆鐢ㄦ埛璧勬枡
				webim.setProfilePortrait({
				'ProfileItem' : [
						{
							'Tag' : 'Tag_Profile_IM_Nick',
							'Value' : loginInfo.identifierNick
						},
						{
							'Tag' : 'Tag_Profile_IM_SelfSignature',
							'Value' : loginInfo.subGroupId + '_' + loginInfo.role + '_' + loginInfo.userId + '_' + loginInfo.identifierNick
						}, {
							'Tag' : 'Tag_Profile_IM_Image',
							'Value' : loginInfo.headerUrl
						} ]
				}, function(successData) {
					webim.Log.debug(successData);
					//鎺ㄩ€佺櫥褰曟秷鎭�
					_this.sendCustomMsg({
						'type' : 'userLogin'
					});
				}, function(errorData) {
					webim.Log.error(errorData);
				});
	            
//	            $('#' + _config.clientConfig.textMsgSendBtn).click(function(){
//	            	$('#' + _config.clientConfig.textMsgInput).blur();
//	            	onSendMsg();
//	            });
	            
	            //瑙︽懜灞忚Е鎽稿埌鍙戦€佹寜閽殑鏃跺€欏彂閫�,鍚﹀垯浼氬嚭鐜伴渶瑕佺偣鍑讳袱娆″彂閫佹寜閽墠鑳藉彂閫佺殑bug
//	            $('#' + _config.clientConfig.textMsgSendBtn).on('mousedown',function(){
//	            	$('#' + _config.clientConfig.textMsgInput).blur();
//	            	onSendMsg();
//				});
//	            
//	            $('#' + _config.clientConfig.textMsgInput).on('keypress',function(event){
//	            	if(event.which == 13){
//	            		$('#' + _config.clientConfig.textMsgInput).blur();
//		            	onSendMsg();
//	            	}
//	            })
	            
	            // 褰搃m鐧诲綍鎴愬姛鏃跺彂璧峰洖璋�
	            callNotify('onUserStatusChange', {
					'type' : 'userLoginStatusNotify',
					'status' : 'loginSuccess'
				});
	            
	            // 璋冪敤鍒濆鍖栧畬鎴�
	            callNotify('onInitCompleted', {});
	        },
	        function (err) {
				callNotify('onUserStatusChange', {
					'type' : 'userLoginStatusNotify',
					'status' : 'fial',
					'data' : err
				});
	        	webim.Log.error(err);
	        }
	    );
	    
		//			if (/debug/gi.test(location.hash)) {
		//				document
		//						.write('<script src="http://sdklog.isd.com/js/vconsole.min.js"></scr'
		//								+ 'ipt>');
		//			}
	}	
	
	/**
	 * 鏄剧ず娑堟伅
	 */
	this.showMessage = function(msg){
		showMsg(msg);
	}
	
}