var merchantCode = JSON.parse(localStorage.getItem('merchantCode'));
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
				'code':merchantCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data
					$('#merchantCode').html(data.merchantCode);
					switch(data.status) {
							case 0:
								$('#statuss').html('已拒绝');
								break;
							case 1:
								$('#statuss').html('待审核');
								break;
							case 2:
								$('#statuss').html('已通过');
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
					$('#accountName').html(data.accountName);
					$('#accountBankCardNumber').html(data.accountBankCardNumber);
					$('#accountBank').html(data.accountBank);
					$('#accountSubBranch').html(data.accountSubBranch);
					$('#pic1').attr("src", data.businessLicenseFileUrl); 
					$('#picname1').html(data.legalPersonIdCardFileName);
					$('#pic3').attr("src", data.tradingCertificateFirstFileUrl); 
					$('#picname3').html(data.tradingCertificateFirstFileName);
					$('#pic4').attr("src", data.tradingCertificateSecondFileUrl); 
					$('#picname4').html(data.tradingCertificateSecondFileName);
					$('#pic5').attr("src", data.tradingCertificateThirdFileUrl); 
					$('#picname5').html(data.tradingCertificateThirdFileName);
					$('#pic6').attr("src", data.businessLicenseFileUrl); 
					$('#picname6').html(data.businessLicenseFileName);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});