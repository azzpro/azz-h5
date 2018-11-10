Module.define("system.userexamination", function(page, $) {
	var param = getRequest();
	var merchantCode = param["merchantCode"];
	page.ready = function() {
		searchMerchantInfo();
		$("#adopt").bind("click", adopt);
		$("#refuse").bind("click", refuse);
	}
	function searchMerchantInfo() {
		$.ajax({
			type: "GET",
			url: ulrTo+"/azz/api/merchant/searchMerchantInfo",
			cache: false, //禁用缓存
			data: {
				'merchantCode':merchantCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					if(data.status==1){
						$('#kzdd').show()
					}else{
						$('#kzdd').hide()
					}
					$('#merchantCode').html(data.merchantCode);
					switch(data.status) {
							case 0:
								$('#statuss').html('未申请');
								break;
							case 1:
								$('#statuss').html('待审批');
								break;
							case 2:
								$('#statuss').html('已通过');
								break;
							case 3:
								$('#statuss').html('已拒绝');
								break;
					};
					$('#createTime').html(data.createTime);
					$('#merchantName').html(data.merchantName);
					$('#legalPersonName').html(data.legalPersonName);
					$('#legalPersonIdCard').html(data.legalPersonIdCard);
					$('#companyName').html(data.companyName);
					$('#creditCode').html(data.creditCode);
					$('#companyTel').html(data.companyTel);
					$('#address').html(data.address);
					if(data.tradingCertificateFirstFileUrl == null){
						$('#pic1').hide();
					}else{
						$('#pic1').show();
						$('#pic1').attr("src", data.tradingCertificateFirstFileUrl); 
						/*$('#picname1').html(data.tradingCertificateFirstFileName);*/
					}
					if(data.tradingCertificateSecondFileUrl == null){
						$('#pic2').hide();
					}else{
						$('#pic2').show();
						$('#pic2').attr("src", data.tradingCertificateSecondFileUrl); 
						/*$('#picname2').html(data.tradingCertificateSecondFileName);*/
					}
					if(data.tradingCertificateThirdFileUrl == null){
						$('#pic3').hide();
					}else{
						$('#pic3').show();
						$('#pic3').attr("src", data.tradingCertificateThirdFileUrl); 
						/*$('#picname3').html(data.tradingCertificateThirdFileName);*/
					}
					if(data.businessLicenseFileUrl == null){
						$('#pic4').hide();
					}else{
						$('#pic4').show();
						$('#pic4').attr("src", data.businessLicenseFileUrl); 
						/*$('#picname4').html(data.businessLicenseFileName);*/
					}
					
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
			url: ulrTo+"/azz/api/merchant/auditEnterprise",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'merchantCode': merchantCode,
         	    'status': 2,
			},
			success: function(data) {
				if (data.code == 0) {
					searchMerchantInfo();
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
			url: ulrTo+"/azz/api/merchant/auditEnterprise",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'merchantCode': merchantCode,
         	    'status': 0,
			},
			success: function(data) {
				if (data.code == 0) {
					searchMerchantInfo();
					$('#myModal111').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	
});