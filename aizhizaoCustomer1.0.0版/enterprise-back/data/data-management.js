Module.define("system.business", function(page, $) {
	page.ready = function() {
		searchMerchantInfo();
	}
	function searchMerchantInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/getClientCompanyInfo",
			cache: false, //禁用缓存
			data: {
				'clientUserCode':clientUserInfo.clientUserCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data
					$('#clientUserCode').html(data.clientUserCode);
					switch(data.companyStatus) {
							case 0:
								$('#statuss').html('无效 ');
								break;
							case 1:
								$('#statuss').html('有效');
								break;
					};
					$('#createTime').html(data.createTime);
					$('#companyName').html(data.companyName);
					$('#companyTel').html(data.companyTel);
					$('#credit').html(data.creditCode);
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
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});