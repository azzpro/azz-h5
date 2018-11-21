var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
Module.define("system.stomerorder", function(page, $) {
	var infos = [];
	var cddeArra = [];
	page.ready = function() {
		getAllocatedMerchantOrder();
		$("#Confirmation").bind("click", submitForm);
	}
	function getAllocatedMerchantOrder() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/order/getAllocatedMerchantOrder",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					
					$('#orderCode').html(data.clientOrderCode);
					$('#grandTotal').html(data.grandTotal);
					
					switch(data.orderStatusId) {
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
					switch(data.paymentMethod) {
						case 1:
							$('#paymentMethod').html('在线支付 ');
							break;
						case 2:
							$('#paymentMethod').html('线下支付');
							break;
					}
					
					var merchantOrderInfos = data.merchantOrderInfos;
					var htmlArr = "";
					for(var i = 0;i < merchantOrderInfos.length; i++){
						var eachMerchantGrandTotal = merchantOrderInfos[i].eachMerchantGrandTotal;
						var merchantCode = merchantOrderInfos[i].merchantCode;
						var merchantName = merchantOrderInfos[i].merchantName;
						var orderItems = merchantOrderInfos[i].orderItems;

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
						htmlArr += "<div class='panel-body'><div class='panel-heading'><h4 class='panel-title'>" + merchantName + "</h4></div>"
	       					+ "<div class='table-responsive'>"
	       					+ "<table class='table table-striped table-bordered table-hover text-center text-nowrap dataTable no-footer dtr-inline' width='100%'><thead><tr>"
	       					+ "<th>模组名称</th><th>数量</th><th>单价(元)</th><th>小计(元)</th><th>发货日期</th></tr></thead><tbody>"
							+ tr
	       					+ "</tbody></table><div class='divcs'><div class='pull-right'>含税总金额(元)：<span>" + eachMerchantGrandTotal + "</span></div>订单备注: <input class='cdde' type='text' name='' placeholder='请输入备注'></div></div></div>";
						var Newsobj = {
								"merchantCode" : merchantCode,
								"remark" : '',
							}
							infos.push(Newsobj);
					}
					$("#distributCD").append(htmlArr);
					
				} else {
					alert(data.msg);
					window.location.reload();
				}
			}
		});
	}
	
	//拆分
	function submitForm() {
		var cddess = $('.cdde');
		for(var i = 0;i < cddess.length; i++){
			cddeArra.push(cddess[i].value);
		}
		
		for(var i = 0 ; i < cddeArra.length;i++){
	    	infos[i].remark = cddeArra[i];
	    }
		
	    $.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/order/allocateClientOrder",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					alert('拆分成功！');
					window.location.href = "#!stomerorder/stomerorder.html";
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function GetJsonData() {
	    var json = {
	        'clientOrderCode': clientOrderCode,
			'infos' : infos,
			
	    };
	    return json;
	}
	
});