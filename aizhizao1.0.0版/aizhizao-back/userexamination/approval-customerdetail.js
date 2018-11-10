Module.define("system.userexamination", function(page, $) {
	var param = getRequest();
	var companyCode = param["companyCode"];
	var clientUserCode;
	page.ready = function() {
		searchClientInfo();
		searchClientCertificationList();
		$("#adopt").bind("click", adopt);
		$("#refuse").bind("click", refuse);
	}
	function searchClientCertificationList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/searchClientCertificationList",
			cache: false, //禁用缓存
			data: {
				'param':companyCode,
				'status':'',
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data.rows[0];
					if(data.status==1){
						$('#kzdd').show()
					}else{
						$('#kzdd').hide()
					}
				
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function searchClientInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/searchClientInfo",
			cache: false, //禁用缓存
			data: {
				'companyCode':companyCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$('#companyCode').html(data.companyCode);
					switch(data.status) {
							case 0:
								$('#statuss').html('无效');
								break;
							case 1:
								$('#statuss').html('有效 ');
								break;
							case 2:
								$('#statuss').html('禁用');
								break;
					};
					$('#createTime').html(data.createTime);
					$('#companyName').html(data.companyName);
					$('#creditCode').html(data.creditCode);
					$('#companyTel').html(data.companyTel);
					$('#address').html(data.address);
					if(data.tradingCertificateFirstFileUrl == null){
						$('#pic1').hide()
					}else{
						$('#pic1').show();
						$('#pic1').attr("src", data.tradingCertificateFirstFileUrl); 
						/*$('#picname1').html(data.tradingCertificateFirstFileName);*/
					}
					if(data.tradingCertificateSecondFileUrl == null){
						$('#pic2').hide()
					}else{
						$('#pic2').show();
						$('#pic2').attr("src", data.tradingCertificateSecondFileUrl); 
						/*$('#picname2').html(data.tradingCertificateSecondFileName);*/
					}
					if(data.tradingCertificateThirdFileUrl == null){
						$('#pic3').hide()
					}else{
						$('#pic3').show();
						$('#pic3').attr("src", data.tradingCertificateThirdFileUrl); 
						/*$('#picname3').html(data.tradingCertificateThirdFileName);*/
					}

					
					
					
					clientUserCode = data.clientUserCode;
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//通过
	function adopt() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/auditClient",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'clientUserCode': clientUserCode,
				'companyCode' : companyCode,
         	    'status': 2,
			},
			success: function(data) {
				if (data.code == 0) {
					searchClientCertificationList();
					$('#myModal111').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//拒绝
	function refuse() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/auditClient",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'clientUserCode': clientUserCode,
				'companyCode' : companyCode,
         	    'status': 0,
			},
			success: function(data) {
				if (data.code == 0) {
					searchClientCertificationList();
					$('#myModal111').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
});