var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
Module.define("system.stomerorder", function(page, $) {
	page.ready = function() {
		getGeneratedMerchantOrderInfo();
	}
	function getGeneratedMerchantOrderInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/order/getGeneratedMerchantOrderInfo",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#clientOrderCode').html(data.data.clientOrderCode);
					switch(data.data.orderStatusId) {
						case 7:
							$('#statuss').html('待支付');
							break;
						case 8:
							$('#statuss').html('待确认');
							break;
						case 9:
							$('#statuss').html('待配货');
							break;
						case 10:
							$('#statuss').html('待签收');
							break;
						case 11:
							$('#statuss').html('已完成');
							break;
						case 12:
							$('#statuss').html('已关闭');
							break;
					}
					switch(data.data.paymentMethod) {
						case 1:
							$('#paymentMethod').html('在线支付 ');
							break;
						case 2:
							$('#paymentMethod').html('线下支付');
							break;
					}
					$('#grandTotal').html(data.data.grandTotal);
					$('#handlerTime').html(data.data.handlerTime);
					var merchantOrderInfos = data.data.merchantOrderInfos;
					var htmlArr = "";
					for(var i = 0;i < merchantOrderInfos.length; i++){
						var eachMerchantGrandTotal = merchantOrderInfos[i].eachMerchantGrandTotal;
						var merchantCode = merchantOrderInfos[i].merchantCode;
						var merchantName = merchantOrderInfos[i].merchantName;
						var orderItems = merchantOrderInfos[i].orderItems;
						var orderStatusId = merchantOrderInfos[i].orderStatusId;
						var merchantOrderCode = merchantOrderInfos[i].merchantOrderCode;
						
						switch(orderStatusId) {
							case 1:
								var orderStatusId = '待确认';
								break;
							case 2:
								var orderStatusId = '待发货';
								break;
							case 3:
								var orderStatusId = '待签收';
								break;
							case 4:
								var orderStatusId = '已完成';
								break;
							case 5:
								var orderStatusId = '已取消';
								break;
						}
						var tr = "";
						for(var j = 0;j < orderItems.length; j++){
							var modulePicUrl = orderItems[j].modulePicUrl;
							var productCode = orderItems[j].productCode;
							var moduleName = orderItems[j].moduleName;
							var quantity = orderItems[j].quantity;
							var productPrice = orderItems[j].productPrice;
							var productPriceSum = orderItems[j].productPriceSum;
							var deliveryTime = orderItems[j].deliveryTime;
							
							tr += "<tr><td><img class='pull-left' src='"+ modulePicUrl +"' width='45' height='45' alt='' /><div class='pull-left spacing  text-left'>产品编码："+ productCode +"<br>模组名称："+ moduleName +"</div></td>"
							+ "<td>"+ quantity +"</td>"
							+ "<td>"+ productPrice +"</td>"
							+ "<td>"+ productPriceSum +"</td>"
							+ "<td>"+ deliveryTime +"</td></tr>";
						}
						htmlArr += "<div class='panel-body'><div class='panel-heading'><h4 class='pull-right'>订单状态：" + orderStatusId + " <small>" + merchantOrderCode + "</small></h4><h4 class='panel-title'>" + merchantName + "</h4></div>"
	       					+ "<div class='table-responsive'>"
	       					+ "<table class='table table-striped table-bordered table-hover text-center text-nowrap dataTable no-footer dtr-inline' width='100%'><thead><tr>"
	       					+ "<th>模组名称</th><th>数量</th><th>单价(元)</th><th>小计(元)</th><th>发货日期</th></tr></thead><tbody>"
							+ tr
	       					+ "</tbody></table><div class='divcs'><div class='pull-right'>含税总金额(元)：<span>" + eachMerchantGrandTotal + "</span></div> </div></div></div>";
					}
					$("#distributCD").append(htmlArr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});