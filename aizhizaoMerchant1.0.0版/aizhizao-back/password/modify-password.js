var userInfo = JSON.parse(localStorage.getItem('userInfo'));
Module.define("system.password", function(page, $) {
	var password = "";
	var password2 = "";
	page.ready = function() {
		init();
		$.validator.addMethod("checkpassword", function(value, element, params) {
			password = $('#password').val();
			password2 = $('#password2').val();
			return(password && password2 && password == password2);
		}, "输入的密码不一致！");
		$("#edit").bind("click", edit);
	}
	page.func = function () {
            return false;
        }
	function edit() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		submitForm();
	}
	document.onkeydown = function(e){ 
	    var ev = document.all ? window.event : e;
	    if(ev.keyCode==13) {
	    	$("#nextpage").click();
	     }
	}
	function submitForm() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/user/editPassword",
			async: false,
			data: {
				'userCode': userInfo.userCode,
         	    'firstPassword': $("#password").val(),
				'secondPassword': $("#password2").val()
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('show');
					$('#basicForm')[0].reset();
					
				} else {
					$('#myModal2').modal('show');
				}
			}
		});
	}
	function init() {
		$("#basicForm").validate({
			rules: {
				password: {
					required: true,
					minlength: 6,
					maxlength: 20
				},
				password2: {
					required: true,
					minlength: 6,
					maxlength: 20,
					checkpassword: true
				},
			},
			messages: {
				password: {
					required: "请输入密码",
					minlength: "密码至少6个字符",
					maxlength: "密码不可超出20位",
					checkpassword: "两次密码输入不一致"
				},
				password2: {
					required: "请输入密码",
					minlength: "密码至少6个字符",
					maxlength: "密码不可超出20位",
					checkpassword: "两次密码输入不一致"
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