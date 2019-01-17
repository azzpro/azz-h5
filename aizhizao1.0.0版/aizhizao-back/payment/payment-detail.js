var orderNumber = JSON.parse(localStorage.getItem('orderNumber'));
Module.define("system.payment", function(page, $) {
	page.ready = function() {
		getClientInvoiceApplyDetail();
	}
	
	//详情
	function getClientInvoiceApplyDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/pay/getOrderInfo",
			cache: false, //禁用缓存
			data: {
				'number' : orderNumber
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data=data.data;
					
					//支付信息
					$('#orderNumber').html(data.orderNumber);
					$('#orderMoney').html(data.orderMoney);
					var orderTime = String(data.orderTime);
					var Y = orderTime.substring(0,4);
					var M = orderTime.substring(4,6);
					var D = orderTime.substring(6,8);
					var h = orderTime.substring(8,10);
					var m = orderTime.substring(10,12);
					var s = orderTime.substring(12,14);
					var lastLoginTimeDesc = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
					$('.orderTime').html(lastLoginTimeDesc);
					switch(data.orderStatus) {
						case 1:
							$('#statusId').html('待支付');
							break;
						case 2:
							$('#statusId').html('支付成功 ');
							break;
						case 3:
							$('#statusId').html('关闭支付');
							break;
						case 4:
							$('#statusId').html('支付失败');
							break;
					};
					switch(data.orderMethod) {
						case 1:
							$('#orderMethod').html('在线支付');
							break;
						case 2:
							$('#orderMethod').html('线下支付');
							break;
					};
					
					//渠道信息
					$('#threePartyNumber').html(data.threePartyNumber);
					$('#orderType').html(data.orderType);
					$('#orderMoney2').html(data.orderMoney);
					$('#orderChannelMoney').html(data.orderChannelMoney);
					
					
					switch(data.orderStatus) {
						case 1:
							$('#orderStatus').html('待支付');
							break;
						case 2:
							$('#orderStatus').html('支付成功 ');
							break;
						case 3:
							$('#orderStatus').html('关闭支付');
							break;
						case 4:
							$('#orderStatus').html('支付失败');
							break;
					};
					
					//关联客户订单信息
					$('#clientOrderCode').html(data.coi.clientOrderCode);
					$('#grandTotal').html(data.coi.grandTotal);
					$('#orderCreator').html(data.coi.orderCreator);
					$('#clientPhoneNumber').html(data.coi.clientPhoneNumber);
					$('#orderTime2').html(data.coi.orderTime);
					switch(data.coi.paymentStatus) {
						case 1:
							$('#paymentStatus').html('待支付');
							break;
						case 2:
							$('#paymentStatus').html('支付成功 ');
							break;
						case 3:
							$('#paymentStatus').html('关闭支付');
							break;
						case 4:
							$('#paymentStatus').html('支付失败');
							break;
					};
					
					
					//产品明细
					var orderItems = data.orderItem;
					var tr = "";
					for(var i = 0;i < orderItems.length; i++){
						var modulePicUrl = orderItems[i].modulePicUrl;
						var productCode = orderItems[i].productCode;
						var moduleName = orderItems[i].moduleName;
						var quantity = orderItems[i].quantity;
						var productPrice = orderItems[i].productPrice;
						var productPriceSum = orderItems[i].productPriceSum;
						var deliveryTime = orderItems[i].deliveryTime;
						
						tr += "<tr><td><img class='pull-left' src='"+ modulePicUrl +"' width='45' height='45' alt='' /><div class='pull-left spacing  text-left'>产品编码："+ productCode +"<br>模组名称："+ moduleName +"</div></td>"
						+ "<td>"+ quantity +"</td>"
						+ "<td>"+ productPrice +"</td>"
						+ "<td>"+ productPriceSum +"</td>"
						+ "<td>"+ deliveryTime +"</td></tr>";
					}
					$("#prodetail").append(tr);
					
					
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