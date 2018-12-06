var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
Module.define("system.invoice", function(page, $) {
	page.ready = function() {
		getClientInvoiceApplyDetail();
		$("#Subbunnot").bind("click", operationInvoiceStatus);
		$("#Subbunnotrefuse").bind("click", operationInvoiceStatusrefuse);
	}
	
	function operationInvoiceStatus() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/invoice/operationInvoiceStatus",
			cache: false, //禁用缓存
			data: {
				'clientInvoiceApplyCode':$("#clientApplyCode").html(),
				'status' : 1
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					alert('操作成功');
					window.location.href = "#!invoice/invoice-management.html"
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function operationInvoiceStatusrefuse() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/invoice/operationInvoiceStatus",
			cache: false, //禁用缓存
			data: {
				'clientInvoiceApplyCode':$("#clientApplyCode").html(),
				'status' : 0
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					alert('操作成功');
					window.location.href = "#!invoice/invoice-management.html"
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//详情
	function getClientInvoiceApplyDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/invoice/getPlatformClientInvoiceOrderDetail",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode' : clientOrderCode
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data=data.data;
					
					if(data.invoiceStatus == 0){
						$('.Application').show();
						$('#Invoice').hide();
					}else{
						$('#Invoice').show();
					}
					//关联订单
					$('#orderCode').html(data.orderCode);
					switch(data.statusId) {
						case 7:
							$('#statusId').html('待支付');
							break;
						case 8:
							$('#statusId').html('待确认');
							break;
						case 9:
							$('#statusId').html('待配货');
							break;
						case 10:
							$('#statusId').html('代签收');
							break;
						case 11:
							$('#statusId').html('已完成');
							break;
						case 12:
							$('#statusId').html('已关闭');
							break;
					};
					switch(data.paymentMethod) {
						case 1:
							$('#paymentMethod').html('在线支付');
							break;
						case 2:
							$('#paymentMethod').html('线下支付');
							break;
					};
					$('#grandTotal').html(data.grandTotal);
					$('#applyAmount').html(data.applyAmount);
					
					//开票详情
					if(data.invoiceType == 0){
						$('#ordinarySS').show();
						$("#clientApplyCode").html(data.clientApplyCode);
						$('#createTime').html(data.createTime);
						$('#invoiceTitle').html(data.invoiceTitle);
						$('#taxIdentificationNumber').html(data.taxIdentificationNumber);
					}else if(data.invoiceType == 1){
						$('#incrementSS').show();
						$("#clientApplyCode2").html(data.clientApplyCode);
						$('#createTime2').html(data.createTime);
						$('#companyName').html(data.companyName);
						$('#taxIdentificationNumber2').html(data.taxIdentificationNumber);
						$('#regAddress').html(data.regAddress);
						$('#regTelephone').html(data.regTelephone);
						$('#bank').html(data.bank);
						$('#bankAccount').html(data.bankAccount);
						
					}
					//收货地址
					$('#consignee').html(data.receiverName);
					$('#pohe').html(data.receiverPhoneNumber);
					$('#addressAlias').html(data.addressAlias);
					$('#address').html(data.detailAddress);
					
					//开票信息
					var invoiceDelivery = data.relevanceMerchantItem;
					if(invoiceDelivery){
						var trr = "";
						for(var i = 0;i < invoiceDelivery.length; i++){
							var grandTotal = invoiceDelivery[i].grandTotal;
							var merchantApplyCode = invoiceDelivery[i].merchantApplyCode;
							var merchantOrderCode = invoiceDelivery[i].merchantOrderCode;
							var deliveryType = invoiceDelivery[i].deliveryType;
							var companyName = invoiceDelivery[i].companyName;
							var number = invoiceDelivery[i].number;
							var deliveryPerson = invoiceDelivery[i].deliveryPerson;
							var deliveryPhone = invoiceDelivery[i].deliveryPhone;
							var status = invoiceDelivery[i].status;
							if(deliveryType==0){
								var invoiceinfo = companyName + '-' + number;
							}else if(deliveryType==1){
								var invoiceinfo = deliveryPerson + '-' + deliveryPhone;
							}else{
								var invoiceinfo = '-'
							}
							switch(status) {
							case 0:
								var statuss = '待确认';
								break;
							case 1:
								var statuss = '待开票';
								break;
							case 2:
								var statuss = '待签收';
								break;
							case 3:
								var statuss = '已完成';
								break;
							};
						
							
							trr += "<tr><td>"+ merchantOrderCode +"</td>"
							+ "<td>"+ grandTotal +"</td>"
							+ "<td>"+ statuss +"</td>"
							+ "<td>"+ merchantApplyCode +"</td>"
							+ "<td>"+ invoiceinfo +"</td></tr>";
						}
						$("#invoiceinformation").append(trr);
					}else{
						var trrrr = "<tr><td colspan='5'>无记录</td></tr>";
						$("#invoiceinformation").append(trrrr);
					}
					
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