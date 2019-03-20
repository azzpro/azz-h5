/*var param = getRequest();
var orderCode = param["orderCode"];*/
Module.define("system.putforward", function(page, $) {
	page.ready = function() {
		getMerchantOrderDetail();
	}
	function getMerchantOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/order/getMerchantOrderDetail",
			cache: false, //禁用缓存
			data: {
				'orderCode':orderCode,
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
	
	$('.datepicker_start').datepicker({
		minDate: new Date()
	});
	$('.datepicker_end').datepicker({
		minDate: new Date()
	});
	$('.datepicker_start2').css({
		zIndex: "1052"
	}).datepicker();

	// search_class
	$(".search_class").select2({
		width: '100%'
	});
	// select_card
	$(".select_card").select2({
		width: '100%',
		minimumResultsForSearch: -1
	});
});