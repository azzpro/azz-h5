   var smsCode = '';
   $(function() {
	   	initValidate();
	   	$("#registerBtn").bind("click", submitForm);
	   	/*$.validator.addMethod("checkSms", function(value, element, params) {
	   		return(smsCode && value && value == smsCode);
	   	}, "请输入正确的验证码！");*/
   	
   		$('#myModal2').on('hidden.bs.modal', function(e){
			window.location.href = "register-entTwo.html";
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
   		'registerName': $('input[name="username"]').val(),
   		'phoneNumber': $('input[name="Phone"]').val(),
   		'verificationCode': $('input[name="phonecode"]').val(),
   		'password': $('input[name="password"]').val(),
   		'confirmPassword': $('input[name="confirm_password"]').val()
   	};
   	$.ajax({
   		type: "POST",
   		url: ulrTo+"/azz/api/merchant/regist",
   		data: param,
   		success: function(data) {
   			if(data.code == 0) {
   				$('#myModal2').modal('show');
   				if(!window.localStorage){
			        return false;
			    }else{
			        var storage=window.localStorage;
			        var merchantCodeLogin = JSON.stringify(data.data);
			        storage["merchantCodeLogin"]= merchantCodeLogin;
		        }
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
   	if(!/^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/.test(phone)) {
   		alert("请输入正确的手机号");
   		return;
   	}
   	var param = {
   		'phoneNumber': $('input[name="Phone"]').val()
   	};
   	$.ajax({
   		type: "POST",
   		url: ulrTo+"/azz/api/merchant/sendVerificationCode",
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
   			username: {
   				required: true,
   				minlength: 2
   			},
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
   			username: {
   				required: "请输入姓名",
   				minlength: "用户名必需由4-20个字符组成"
   			},
   			Phone: {
   				required: "请输入您的电话号码",
   				minlength: "请输入正确的手机号码"
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