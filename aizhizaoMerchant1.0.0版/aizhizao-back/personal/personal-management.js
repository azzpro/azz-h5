var smsCode = '';
Module.define("system.personal", function(page, $) {
	page.ready = function() {
		initValidate();
		$("#userNameEid").bind("click", userNameEid);
		$("#phoneNumberEid").bind("click", function() {
			$("#eidbt").html("编辑手机");
			$('#phoneNumberNext').show();
			$('#myModal2').modal('show');
			$('#emailNext').hide();
			$('#passNext').hide();
			
		});
		$("#emailEid").bind("click", function() {
			$("#eidbt").html("编辑邮箱");
			$('#emailNext').show();
			$('#myModal2').modal('show');
			$('#phoneNumberNext').hide();
			$('#passNext').hide();
		});
		$("#passEid").bind("click", function() {
			$("#eidbt").html("编辑密码");
			$('#passNext').show();
			$('#myModal2').modal('show');
			$('#phoneNumberNext').hide();
			$('#emailNext').hide();
		});
		$("#phoneNumberNext").bind("click", checkEditVerificationCode);
		$("#emailNext").bind("click", checkEditVerificationCode2);
		$("#passNext").bind("click", checkEditVerificationCode3);
		$("#phoneNumberconfirm").bind("click", phoneNumberEid);
		$("#emailconfirm").bind("click", emailEid);
		$("#passconfirm").bind("click", passEid);
		
		
		
		$('#userCode').html(merchantUserInfo.merchantUserCode);
		$('#userName').html(merchantUserInfo.merchantUserName);
		$('#phoneNumber').html(merchantUserInfo.phoneNumber);
		$("input[name='Phone']").val(merchantUserInfo.phoneNumber);
		$('#postName').html(merchantUserInfo.postName);
		$('#deptCode').html(merchantUserInfo.deptCode);
		$('#deptName').html(merchantUserInfo.deptName);
		$('#roleName').html(merchantUserInfo.roleName);
		$('#roleCode').html(merchantUserInfo.roleCode);
		
		var email = merchantUserInfo.email;
		if(!email){
			$('#email').html('-');
			$('#emailAdd').show();
		}else{
			$('#email').html(email);
			$('#emailEid').show();
		}
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			$("input[name='phonecode']").val('');
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$('#myModal3').on('hidden.bs.modal', function(e){
			$('#basicForm3')[0].reset();
			var validFlag = $('#basicForm3').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$('#myModal4').on('hidden.bs.modal', function(e){
			$('#basicForm4')[0].reset();
			var validFlag = $('#basicForm4').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");
	}
	page.func = function () {
        return false;
    }
	//修改姓名
	function userNameEid() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/editPersonalInfo",
			cache: false, //禁用缓存
			data: {
				'editType': 1,
				'userName': $("input[name='Name']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var arr = merchantUserInfo;
					arr.merchantUserName = $("input[name='Name']").val();
					localStorage.setItem("merchantUserInfo",JSON.stringify(arr));
					$('#userName').html(merchantUserInfo.merchantUserName);
					$('#name').html(merchantUserInfo.merchantUserName);
			        $('#myModal').modal('hide');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//校验号码1
	function checkEditVerificationCode() {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/checkEditVerificationCode",
			cache: false, //禁用缓存
			data: {
				'phoneNumber': $("input[name='Phone']").val(),
				'verificationCode': $("input[name='phonecode']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$('#myModal3').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//校验号码2
	function checkEditVerificationCode2() {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/checkEditVerificationCode",
			cache: false, //禁用缓存
			data: {
				'phoneNumber': $("input[name='Phone']").val(),
				'verificationCode': $("input[name='phonecode']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$('#myModal4').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//校验号码3
	function checkEditVerificationCode3() {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/checkEditVerificationCode",
			cache: false, //禁用缓存
			data: {
				'phoneNumber': $("input[name='Phone']").val(),
				'verificationCode': $("input[name='phonecode']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$('#myModal5').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//修改手机号
	function phoneNumberEid() {
		var validFlag = $('#basicForm3').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/editPersonalInfo",
			cache: false, //禁用缓存
			data: {
				'editType': 2,
				'phoneNumber': $("input[name='Phone2']").val(),
				'verificationCode': $("input[name='phonecode2']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var arr = merchantUserInfo;
					arr.phoneNumber = $("input[name='Phone2']").val();
					localStorage.setItem("merchantUserInfo",JSON.stringify(arr));
					$('#phoneNumber').html(merchantUserInfo.phoneNumber);
			        $('#myModal3').modal('hide');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//修改邮箱
	function emailEid() {
		var validFlag = $('#basicForm4').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/editPersonalInfo",
			cache: false, //禁用缓存
			data: {
				'editType': 3,
				'email': $("input[name='email']").val(),
				'verificationCode': $("input[name='emailcode']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var arr = merchantUserInfo;
					arr.email = $("input[name='email']").val();
					localStorage.setItem("merchantUserInfo",JSON.stringify(arr));
					$('#email').html(merchantUserInfo.email);
					$('#emailAdd').hide();
					$('#emailEid').show();
			        $('#myModal4').modal('hide');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//修改密码
	function passEid() {
		var validFlag = $('#basicForm5').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/editPersonalInfo",
			cache: false, //禁用缓存
			data: {
				'editType': 4,
				'password': $("input[name='password']").val(),
				'confirmPassword': $("input[name='confirm_password']").val(),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
			        $('#myModal5').modal('hide');
			        alert('修改成功！')
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//验证手机号
    var sessiontime = 60;
    var Interval;

    page.ronglian = function() {
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
	   		url: ulrTo+"/azz/api/merchant/sendEditVerificationCode",
	   		data: param,
	   		complete: function(XMLHttpRequest, textStatus) {
	
	   		},
	   		success: function(data) {
	
	   			if(data.code == 0) {
	   				alert('发送成功！');
	   				//$('#myModal').modal('show');
	   				//smsCode = data.data;
	
	   				$(".send").removeClass('btn-primary').addClass('btn-default');
	   				$(".send").html(sessiontime + '秒');
	   				$(".send").removeAttr("onclick");
	   				Interval = setInterval("system.personal.timing()", 1000);
	   			} else {
	   				alert(data.msg);
	   			}
	   		}
	   	});
    }

   page.timing = function() {
   	sessiontime = sessiontime - 1;
   	if(sessiontime == 0) {
   		$(".send").html("获取短信验证码");
   		$(".send").removeClass('btn-default').addClass('btn-primary');
   		$(".send").attr("onclick", "ronglian();");
   		clearInterval(Interval);
   		sessiontime = 60;
   		return;
   	}
   	$(".send").html(sessiontime + '秒后可重新发送');
   }
   
   //修改手机号
    var sessiontime2 = 60;
    var Interval2;

    page.ronglian2 = function() {
	   	var phone2 = $('input[name="Phone2"]').val();
	   	if(!/^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/.test(phone2)) {
	   		alert("请输入正确的手机号");
	   		return;
	   	}
	   	var param = {
	   		'phoneNumber': $('input[name="Phone2"]').val()
	   	};
	   	$.ajax({
	   		type: "POST",
	   		url: ulrTo+"/azz/api/merchant/sendEditVerificationCode",
	   		data: param,
	   		complete: function(XMLHttpRequest, textStatus) {
	
	   		},
	   		success: function(data) {
	
	   			if(data.code == 0) {
	   				alert('发送成功！');
	   				//$('#myModal').modal('show');
	   				//smsCode = data.data;
	
	   				$(".send2").removeClass('btn-primary').addClass('btn-default');
	   				$(".send2").html(sessiontime2 + '秒');
	   				$(".send2").removeAttr("onclick");
	   				Interval2 = setInterval("system.personal.timing2()", 1000);
	   			} else {
	   				alert(data.msg);
	   			}
	   		}
	   	});
    }

   page.timing2 = function() {
   	sessiontime2 = sessiontime2 - 1;
   	if(sessiontime2 == 0) {
   		$(".send2").html("获取短信验证码");
   		$(".send2").removeClass('btn-default').addClass('btn-primary');
   		$(".send2").attr("onclick", "ronglian2();");
   		clearInterval(Interval2);
   		sessiontime2 = 60;
   		return;
   	}
   	$(".send2").html(sessiontime2 + '秒后可重新发送');
   }
   
   //邮箱
   var sessiontime3 = 60;
    var Interval3;

    page.ronglian3 = function() {
	   	var email = $('input[name="email"]').val();
	   	if(!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
	   		alert("请输入正确的邮箱地址");
	   		return;
	   	}
	   	var param = {
	   		'email': $('input[name="email"]').val()
	   	};
	   	$.ajax({
	   		type: "POST",
	   		url: ulrTo+"/azz/api/merchant/sendEditEmailVerificationCode",
	   		data: param,
	   		complete: function(XMLHttpRequest, textStatus) {
	
	   		},
	   		success: function(data) {
	
	   			if(data.code == 0) {
	   				alert('发送成功！');
	   				//$('#myModal').modal('show');
	   				//smsCode = data.data;
	
	   				$(".send3").removeClass('btn-primary').addClass('btn-default');
	   				$(".send3").html(sessiontime3 + '秒');
	   				$(".send3").removeAttr("onclick");
	   				Interval3 = setInterval("system.personal.timing3()", 1000);
	   			} else {
	   				alert(data.msg);
	   			}
	   		}
	   	});
    }

   page.timing3 = function() {
   	sessiontime3 = sessiontime3 - 1;
   	if(sessiontime3 == 0) {
   		$(".send3").html("获取邮箱验证码");
   		$(".send3").removeClass('btn-default').addClass('btn-primary');
   		$(".send3").attr("onclick", "ronglian3();");
   		clearInterval(Interval3);
   		sessiontime3 = 60;
   		return;
   	}
   	$(".send3").html(sessiontime3 + '秒后可重新发送');
   }
	
	function initValidate(){
   		// Basic Form
	   	$("#basicForm").validate({
	   		rules: {
	   			Name: {
	   				required: true,
	   			}
	   		},
	   		messages: {
	   			Name: {
	   				required: "请输入姓名",
	   			},
	   		},
	   		highlight: function(element) {
	   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	   		},
	   		success: function(element) {
	   			$(element).closest('.form-group').removeClass('has-error');
	   		}
	   	});
	   	$("#basicForm2").validate({
	   		rules: {
	   			phonecode: {
	   				required: true,
	   			}
	   		},
	   		messages: {
	   			phonecode: {
	   				required: "请输入验证码",
	   			},
	   		},
	   		highlight: function(element) {
	   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	   		},
	   		success: function(element) {
	   			$(element).closest('.form-group').removeClass('has-error');
	   		}
	   	});
	   	$("#basicForm3").validate({
	   		rules: {
	   			Phone2: {
	   				required: true,
	   				isMobile: true
	   			},
	   			phonecode2: {
	   				required: true,
	   			}
	   		},
	   		messages: {
	   			Phone2: {
	   				required: "请输入手机号码",
	   			},
	   			phonecode2: {
	   				required: "请输入验证码",
	   			}
	   		},
	   		highlight: function(element) {
	   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	   		},
	   		success: function(element) {
	   			$(element).closest('.form-group').removeClass('has-error');
	   		}
	   	});
	   	$("#basicForm4").validate({
	   		rules: {
	   			email: {
	   				required: true,
	   				email: true
	   			},
	   			emailcode: {
	   				required: true,
	   			}
	   		},
	   		messages: {
	   			email: {
	   				required: "请输入邮箱地址",
	   			},
	   			emailcode: {
	   				required: "请输入验证码",
	   			}
	   		},
	   		highlight: function(element) {
	   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	   		},
	   		success: function(element) {
	   			$(element).closest('.form-group').removeClass('has-error');
	   		}
	   	});
	   	$("#basicForm5").validate({
	   		rules: {
	   			password: {
   					required: true,
   					minlength: 6
	   			},
	   			confirm_password: {
	   				required: true,
	   				minlength: 6,
	   				equalTo: "#password"
	   			},
	   		},
	   		messages: {
	   			password: {
	   				required: "请输入密码",
	   				minlength: "密码长度不能小于 6 个字母"
	   			},
	   			confirm_password: {
	   				required: "请输入密码",
	   				minlength: "密码长度不能小于 6 个字母",
	   				equalTo: "两次密码输入不一致"
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
});
