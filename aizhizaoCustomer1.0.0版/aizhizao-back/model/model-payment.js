var ordercode = JSON.parse(localStorage.getItem('ordercode'));
Module.define("system.model", function(page, $) {
	page.ready = function() {
		getClientOrderDetail();
		checkClientOrderPaySuccessWin();
		$("#payment").bind("click", submitOrderPay);
		$("#Paid").bind("click", checkClientOrderPaySuccess);
		$("#problem").bind("click", checkClientOrderPaySuccess);
		$(".xzzf").on('click','.bgno',function(){
			$(this).addClass('bg');
			$(this).removeClass('bgno');
			$(this).siblings().removeClass('bg');
			$(this).siblings().addClass('bgno');
		})
	}
	function getClientOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getClientOrderDetail",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':ordercode
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var orderInfo = data.data.orderInfo;
					$('#receiverName').html(orderInfo.receiverName);
					$('#receiverAddress').html(orderInfo.receiverAddress);
					$('#receiverPhoneNumber').html(orderInfo.receiverPhoneNumber);
					$('#grandTotal').html(orderInfo.grandTotal);
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function submitOrderPay() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/pay/submitOrderPay",
			cache: false, //禁用缓存
			data: {
				'orderNumber':ordercode,
				'orderPayType':$('.bg').attr("val"),
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('show');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function checkClientOrderPaySuccess() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/checkClientOrderPaySuccess",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':ordercode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					window.location.reload();
					window.location.href = "#!model/model-paymentOK.html"
				} else {
					$('#myModal').modal('hide');
					$('#myModal2').modal('show');
					$('#dataMSG').html(data.msg);
				}
			}
		});
	}
	
	function checkClientOrderPaySuccessWin() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/checkClientOrderPaySuccess",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':ordercode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					window.location.href = "#!model/model-paymentOK.html"
				} else {
					
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