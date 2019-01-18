   var openid = JSON.parse(localStorage.getItem('openid'));
   var accessToken = JSON.parse(localStorage.getItem('accessToken'));
   var expiresIn = JSON.parse(localStorage.getItem('expiresIn'));
   var refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
   var scope = JSON.parse(localStorage.getItem('scope'));
   var unionid = JSON.parse(localStorage.getItem('unionid'));
   
   $(function() {
	   	initValidate();
	   	$("#registerBtn").bind("click", submitForm);
	   	$.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");
   });

   function submitForm() {
   	var validFlag = $('#basicForm').valid();
	if(!validFlag) {
			return;
	}
   	var param = {
   		'phoneNumber': $('input[name="Phone"]').val(),
   		'password': $('input[name="password"]').val(),
   		'openid': openid,
   		'accessToken': accessToken,
   		'expiresIn': expiresIn,
   		'refreshToken': refreshToken,
   		'scope': scope,
   		'unionid': unionid,
   	};
   	$.ajax({
   		type: "POST",
   		url: ulrTo+"/azz/api/wechat/loginAndBind",
   		data: param,
   		success: function(data) {
   			if(data.code == 0) {
   				if(!window.localStorage){
	            return false;
	        }else{
	            var storage=window.localStorage;
	            var clientUserInfo = JSON.stringify(data.data.clientUserInfo);
	            var clientType = JSON.stringify(data.data.clientUserInfo.clientType)
	            var menus = JSON.stringify(data.data.menus);
	            var clientUserPermissions = JSON.stringify(data.data.clientUserPermissions);
	            var sessionId = JSON.stringify(data.data.sessionId);
	            storage["clientUserInfo"]= clientUserInfo;
	            storage["menus"]= menus;
	            storage["clientType"]= clientType;
	            storage["clientUserPermissions"]= clientUserPermissions;
	            storage["sessionId"]= sessionId;
	        }
					
			window.location.href = "../main.html#!home/home.html";
			return;
			
   			} else {
   				alert(data.msg);
   			}
   		}
   	});
   }
   function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			Phone: {
   				required: true,
   				minlength: 11,
   				maxlength: 11,
   				isMobile: true,
   			},
   			password: {
   				required: true,
   				minlength: 6
   			},
   		},
   		messages: {
   			Phone: {
   				required: "请输入您的电话号码",
   				minlength: "请输入正确的电话号码"
   			},
   			password: {
   				required: "请输入密码",
   				minlength: "密码长度不能小于 6 个字母"
   			},
   		},
   		highlight: function(element) {
   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
   		},
   		success: function(element) {
   			$(element).closest('.form-group').removeClass('has-error');
   		}
   	});
   }