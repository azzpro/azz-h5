   var openid = JSON.parse(localStorage.getItem('openid'));
   var accessToken = JSON.parse(localStorage.getItem('accessToken'));
   var expiresIn = JSON.parse(localStorage.getItem('expiresIn'));
   var refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
   var scope = JSON.parse(localStorage.getItem('scope'));
   var unionid = JSON.parse(localStorage.getItem('unionid'));
   var smsCode = '';
   // 获取url路径参数
	function getRequest() {
	    var d = new Object();
	    var g = window.location.href;
	    var b = g.split("?");
	    if (b.length > 1) {
	        var a = b[1].split("&");
	        for (var c = 0; c < a.length; c++) {
	            var f = a[c].indexOf("=");
	            if (f == -1) {
	                continue;
	            }
	            var e = a[c].substring(0, f);
	            var j = a[c].substring(f + 1);
	            j = decodeURIComponent(j);
	            d[e] = j;
	        }
	    }
	    return d;
	}
   $(function() {
	   	initValidate();
	   	$("#registerBtn").bind("click", submitForm);
	   	/*$.validator.addMethod("checkSms", function(value, element, params) {
	   		return(smsCode && value && value == smsCode);
	   	}, "请输入正确的验证码！");*/
   	
   		$('#myModal2').on('hidden.bs.modal', function(e){
			window.location.href = "../login.html";
		});
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
   		'verificationCode': $('input[name="phonecode"]').val(),
   		'password': $('input[name="password"]').val(),
   		'confirmPassword': $('input[name="confirm_password"]').val(),
   		'openid': openid,
   		'accessToken': accessToken,
   		'expiresIn': expiresIn,
   		'refreshToken': refreshToken,
   		'scope': scope,
   		'unionid': unionid,
   	};
   	$.ajax({
   		type: "POST",
   		url: ulrTo+"/azz/api/wechat/regAndBind",
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
					
					setTimeout(function() {
		           var param = getRequest();
		           if (param.redirct) {
		        	   window.location.href = param.redirct;
		           } else {
		        	   window.location.href = "./main.html#!home/home.html";
		           }
		      }, 100);
   			} else {
   				alert(data.msg);
   			}
   		}
   	});
   }

   var sessioncode = "";
   var sessiontime = 60;
   var Interval;

   function ronglian() {
   	var phone = $('input[name="Phone"]').val();
   	if(!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(phone)) {
   		alert("请输入正确的手机号");
   		return;
   	}
   	var param = {
   		'phoneNumber': $('input[name="Phone"]').val()
   	};
   	$.ajax({
   		type: "POST",
   		url: ulrTo+"/azz/api/client/sendVerificationCode",
   		data: param,
   		complete: function(XMLHttpRequest, textStatus) {

   		},
   		success: function(data) {

   			if(data.code == 0) {
   				//alert('发送成功！');
   				$('#myModal').modal('show');
   				//smsCode = data.data;

   				$("#send").removeClass('btn-primary').addClass('btn-default');
   				$("#send").html(sessiontime + '秒');
   				$("#send").removeAttr("onclick");
   				Interval = setInterval("timing()", 1000);
   			} else {
   				alert(data.msg);
   			}
   		}
   	});
   }

   function timing() {
   	sessiontime = sessiontime - 1;
   	if(sessiontime == 0) {
   		$("#send").html("获取短信验证码");
   		$("#send").removeClass('btn-default').addClass('btn-primary');
   		$("#send").attr("onclick", "ronglian();");
   		clearInterval(Interval);
   		sessiontime = 60;
   		return;
   	}
   	$("#send").html(sessiontime + '秒后可重新发送');
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
   			phonecode: {
   				required: true,
   				minlength: 6,
   				maxlength: 6,
   				digits: true,
   				//checkSms: true
   			},
   			password: {
   				required: true,
   				minlength: 6
   			},
   			confirm_password: {
   				required: true,
   				minlength: 6,
   				equalTo: "#password"
   			},
   			agree: "required"
   		},
   		messages: {
   			Phone: {
   				required: "请输入您的电话号码",
   				minlength: "请输入正确的电话号码"
   			},
   			phonecode: {
   				required: "请输入手机验证码",
   				minlength: "手机验证码为6位数字",
   			},
   			password: {
   				required: "请输入密码",
   				minlength: "密码长度不能小于 6 个字母"
   			},
   			confirm_password: {
   				required: "请输入密码",
   				minlength: "密码长度不能小于 6 个字母",
   				equalTo: "两次密码输入不一致"
   			},
   			agree: "请确认已阅读，并勾选"
   		},
   		highlight: function(element) {
   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
   		},
   		success: function(element) {
   			$(element).closest('.form-group').removeClass('has-error');
   		}
   	});
   }