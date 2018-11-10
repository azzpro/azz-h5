var merchantCodeLogin = JSON.parse(localStorage.getItem('merchantCodeLogin'));
Module.define("system.business", function(page, $) {
	page.ready = function() {
		searchMerchantInfo();
	}
	function searchMerchantInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/getMerchantInfo",
			cache: false, //禁用缓存
			data: {
				'merchantCode':merchantCodeLogin,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data
					$('#merchantCode').html(data.merchantCode);
					switch(data.qualificationApplyStatus) {
							case 0:
								$('#statuss').html('未申请');
								break;
							case 1:
								$('#statuss').html('待审核');
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
					$('#companyName').html(data.companyName);
					$('#personName').html(data.legalPersonName);
					$('#legalPersonIdCard').html(data.legalPersonIdCard);
					$('#companyTel').html(data.companyTel);
					$('#address').html(data.address);

					if(data.tradingCertificateFirstFileUrl == null){
						$('#pic3').hide();
					}else{
						$('#pic3').show();
						$('#pic3').attr("src", data.tradingCertificateFirstFileUrl); 
						/*$('#picname3').html(data.tradingCertificateFirstFileName);*/
					}
					if(data.tradingCertificateSecondFileUrl == null){
						$('#pic4').hide();
					}else{
						$('#pic4').show();
						$('#pic4').attr("src", data.tradingCertificateSecondFileUrl); 
						/*$('#picname4').html(data.tradingCertificateSecondFileName);*/
					}
					if(data.tradingCertificateThirdFileUrl == null){
						$('#pic5').hide();
					}else{
						$('#pic5').show();
						$('#pic5').attr("src", data.tradingCertificateThirdFileUrl); 
						/*$('#picname5').html(data.tradingCertificateThirdFileName);*/
					}
					if(data.businessLicenseFileUrl == null){
						$('#pic6').hide();
					}else{
						$('#pic6').show();
						$('#pic6').attr("src", data.businessLicenseFileUrl); 
						/*$('#picname6').html(data.businessLicenseFileName);*/
					}
					
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});