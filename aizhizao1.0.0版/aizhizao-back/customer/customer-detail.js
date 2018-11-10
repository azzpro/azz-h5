Module.define("system.customerdetail", function(page, $) {
	var param = getRequest();
	var clientUserCode = param["clientUserCode"];
	page.ready = function() {
		selectClientUserInfo();
	}
	function selectClientUserInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selectClientUserInfo",
			cache: false, //禁用缓存
			data: {
				'code':clientUserCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$('#clientUserName').html(data.clientUserName);
					$('#phoneNumber').html(data.phoneNumber);
					$('#email').html(data.email);
					$('#companyPower').html(data.companyPower);
					$('#companyName').html(data.companyName);
					$('#employeeName').html(data.employeeName);
					$('#deptmentName').html(data.deptmentName);
					$('#pic1').attr("src", data.avatarUrl); 
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});