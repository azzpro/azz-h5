Module.define("system.customerdetail", function(page, $) {
	page.ready = function() {
		selectClientUserInfo();
		initValidate();
		$("#changeAvatar").bind("click", changeAvatar);
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$("#img1").attr("src",'');
			
		});
	}
	function selectClientUserInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/getClientPersonalInfo",
			cache: false, //禁用缓存
			data: {
				'clientUserCode':clientUserInfo.clientUserCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$('#clientUserName').html(data.clientUserName);
					$('#phoneNumber').html(data.phoneNumber);
					$('#email').html(data.email);
					$('#companyPower').html(data.roleName);
					$('#companyName').html(data.companyName);
					if(data.avatarUrl==null){
						$('#pic1').attr("src", '../images/ewma.jpg');
					}else{
						$('#pic1').attr("src", data.avatarUrl);
					}
					if(clientType == 0){
						$('#nodsd').hide()
					}else if(clientType == 1){
						$('#nodsd').show()
					}
					
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function changeAvatar() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var file1 = document.basicForm.file1.files[0];
		var fm = new FormData();
		fm.append('clientUserCode', clientUserInfo.clientUserCode);
		fm.append('avatarFile', file1);
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/changeAvatar",
			cache: false, //禁用缓存
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					selectClientUserInfo();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			file: "required",
   		},
   		messages: {
   			file: "请上传照片",
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