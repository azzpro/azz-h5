Module.define("system.order", function(page, $) {
	page.ready = function() {
		searchMerchantInfo();
	}
	function searchMerchantInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/getMerchantInfo",
			cache: false, //禁用缓存
			data: {
				'code':"merchantCode",
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});