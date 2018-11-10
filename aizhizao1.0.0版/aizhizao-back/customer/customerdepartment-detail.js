var companyCode = JSON.parse(localStorage.getItem('companyCode'));
Module.define("system.customer", function(page, $) {
	page.ready = function() {
		selectClientCompanyDetail();
	}
	function selectClientCompanyDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selectClientCompanyDetail",
			cache: false, //禁用缓存
			data: {
				'code':companyCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data
					$('#companyCode').html(data.companyCode);
					switch(data.status) {
							case 1:
								$('#statuss').html('已开通');
								break;
							case 2:
								$('#statuss').html('未开通');
								break;
					};
					$('#authTime').html(data.authTime);
					$('#companyName').html(data.companyName);
					$('#companyTel').html(data.companyTel);
					$('#creditCode').html(data.creditCode);
					$('#detailAddress').html(data.detailAddress);
					
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
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});