var merchantCode = JSON.parse(localStorage.getItem('merchantCode'));
Module.define("system.business", function(page, $) {
	page.ready = function() {
		enterpriseInfo();
	}
	function enterpriseInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/enterpriseInfo",
			cache: false, //禁用缓存
			data: {
				'merchantCode':merchantCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					if(!data.merchantNo){
						$('#threereg').show();
					}
					$('#merchantNo').html(data.merchantNo?data.merchantNo:'');
					$('#merFullName').html(data.merFullName?data.merFullName:'');
					$('#merShortName').html(data.merShortName?data.merShortName:'');
					$('#merAddress').html(data.merAddress?data.merAddress:'');
					$('#merProvince').html(data.merProvince?data.merProvince+'/'+data.merCity+'/'+data.merDistrict:'');
					$('#merContactName').html(data.merContactName?data.merContactName:'');
					$('#merContactPhone').html(data.merContactPhone?data.merContactPhone:'');
					$('#merContactEmail').html(data.merContactEmail?data.merContactEmail:'');
					$('#legalName').html(data.legalName?data.legalName:'');
					$('#legalIdCard').html(data.legalIdCard?data.legalIdCard:'');
					$('#accountLicense').html(data.accountLicense?data.accountLicense:'');
					$('#cardNo').html(data.cardNo?data.cardNo:'');
					$('#bankCode').html(data.bankCode?data.bankCode:'');
					$('#bankProvince').html(data.bankProvince?data.bankProvince+'/'+data.bankCity:'');
					
					if(data.icpAuthPic == null){
						$('#pic1').hide()
					}else{
						$('#pic1').show();
						$('#pic1').attr("src", data.icpAuthPic); 
					}
					if(data.businessPic == null){
						$('#pic2').hide()
					}else{
						$('#pic2').show();
						$('#pic2').attr("src", data.businessPic); 
					}
					if(data.legalFrontPic == null){
						$('#pic3').hide()
					}else{
						$('#pic3').show();
						$('#pic3').attr("src", data.legalFrontPic); 
					}
					if(data.legalBackPic == null){
						$('#pic4').hide()
					}else{
						$('#pic4').show();
						$('#pic4').attr("src", data.legalBackPic); 
					}
					if(data.openAccountPic == null){
						$('#pic5').hide()
					}else{
						$('#pic5').show();
						$('#pic5').attr("src", data.openAccountPic); 
					}
					
					
					
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});