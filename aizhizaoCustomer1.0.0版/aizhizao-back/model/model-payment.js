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
			async:false,
			data: {
				'orderCode':ordercode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('show');
					var data = data.data;
					$("#gatewayFORM").attr('action',data.req_url)
					$("input[name='acct_name']").val(data.acct_name);
					$("input[name='back_url']").val(data.back_url);
					$("input[name='bank_code']").val(data.bank_code);
					$("input[name='busi_partner']").val(data.busi_partner);
					$("input[name='card_no']").val(data.card_no);
					$("input[name='dt_order']").val(data.dt_order);
					$("input[name='flag_modify']").val(data.flag_modify);
					$("input[name='id_no']").val(data.id_no);
					$("input[name='id_type']").val(data.id_type);
					$("input[name='info_order']").val(data.info_order);
					$("input[name='money_order']").val(data.money_order);
					$("input[name='name_goods']").val(data.name_goods);
					$("input[name='no_agree']").val(data.no_agree);
					$("input[name='no_order']").val(data.no_order);
					$("input[name='notify_url']").val(data.notify_url);
					$("input[name='oid_partner']").val(data.oid_partner);
					$("input[name='pay_type']").val(data.pay_type);
					$("input[name='req_url']").val(data.req_url);
					$("input[name='risk_item']").val(data.risk_item);
					$("input[name='sign']").val(data.sign);
					$("input[name='sign_type']").val(data.sign_type);
					$("input[name='timestamp']").val(data.timestamp);
					$("input[name='url_order']").val(data.url_order);
					$("input[name='url_return']").val(data.url_return);
					$("input[name='user_id']").val(data.user_id);
					$("input[name='userreq_ip']").val(data.userreq_ip);
					$("input[name='valid_order']").val(data.valid_order);
					$("input[name='version']").val(data.version);
					document.getElementById("gatewayFORM").submit();
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