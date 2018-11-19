var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
Module.define("system.stomerorder", function(page, $) {
	page.ready = function() {
		getClientOrderDetail();
	}
	function getClientOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/order/getClientOrderDetail",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var orderInfo = data.data.orderInfo;
					if(orderInfo.orderStatusId == 7){
						$('#cancelTime').show();
					}else{
						$('#cancelTime').hide();
					}
					if(orderInfo.orderStatusId == 8){
						$('#distribution').show();
					}else{
						$('#distribution').hide();
					}
					if(orderInfo.orderStatusId == 11){
						$('#Signin').show();
					}else{
						$('#Signin').hide();
					}
					
					
					$('#orderCode').html(orderInfo.clientOrderCode);
					switch(orderInfo.orderStatusId) {
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
					switch(orderInfo.paymentMethod) {
						case 1:
							$('#paymentMethod').html('在线支付 ');
							break;
						case 2:
							$('#paymentMethod').html('线下支付');
							break;
					}
					$('#orderType').html(orderInfo.orderType);
					$('#orderCreator').html(orderInfo.orderCreator);
					$('#orderTime').html(orderInfo.orderTime);
					$('#receiverName').html(orderInfo.receiverName);
					$('#receiverPhoneNumber').html(orderInfo.receiverPhoneNumber);
					$('#addressAlias').html(orderInfo.addressAlias);
					$('#receiverAddress').html(orderInfo.receiverAddress);
					$('#remark').html(orderInfo.remark);
					$('#grandTotal').html(orderInfo.grandTotal);
					
					var orderItems = orderInfo.orderItems;
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
					
					var signInfo = data.data.signInfo;
					$('#consignee').html(signInfo.consignee);
					$('#signTime').html(signInfo.signTime);
					var signFileInfos = signInfo.signFileInfos;
					var atr = "";
					for(var i = 0;i < signFileInfos.length; i++){
						var fileUrl = signFileInfos[i].fileUrl;
						var fileName = signFileInfos[i].fileName;
						atr += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
					}
					$("#signFileInfos").append(atr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});