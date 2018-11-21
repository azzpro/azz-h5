var orderCode = JSON.parse(localStorage.getItem('orderCode'));
Module.define("system.chantorders", function(page, $) {
	page.ready = function() {
		getMerchantOrderDetail();
	}
	function getMerchantOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/merchant/order/getPlatformMerchantOrderDetail",
			cache: false, //禁用缓存
			data: {
				'orderCode':orderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$('#orderCode').html(data.orderCode);
					$('#orderTime').html(data.orderTime);
					$('#orderStatus').html(data.orderStatus);
					$('#remark').html(data.remark);
					$('#grandTotal').html(data.grandTotal);
					if(data.orderStatusId == 1){
						$('#receiptS').show();
					}else{
						$('#receiptS').hide();
					}
					if(data.orderStatusId == 2){
						
					}else{
					}
					if(data.orderStatusId == 3){
						$('#deliver').show();
					}else{
						$('#deliver').hide();
					}
					if(data.orderStatusId == 4){
						$('#deliver').show();
						$('#signintoo').show();
					}else{
						$('#deliver').hide();
						$('#signintoo').hide();
					}
					var orderItems = data.orderItems;
					var tr = "";
					for(var i = 0;i < orderItems.length; i++){
						var modulePicUrl = orderItems[i].modulePicUrl;
						var productCode = orderItems[i].productCode;
						var moduleName = orderItems[i].moduleName;
						var quantity = orderItems[i].quantity;
						var productPrice = orderItems[i].productPrice;
						var productPriceSum = orderItems[i].subtotal;
						var deliveryTime = orderItems[i].deliveryTime;
						
						tr += "<tr><td><img class='pull-left' src='"+ modulePicUrl +"' width='45' height='45' alt='' /><div class='pull-left spacing  text-left'>产品编码："+ productCode +"<br>模组名称："+ moduleName +"</div></td>"
						+ "<td>"+ quantity +"</td>"
						+ "<td>"+ productPrice +"</td>"
						+ "<td>"+ productPriceSum +"</td>"
						+ "<td>"+ deliveryTime +"</td></tr>";
					}
					$("#prodetail").append(tr);
					
					var receiverAddress = data.receiverAddress;
					$('#receiverName').html(receiverAddress.receiverName);
					$('#number').html(receiverAddress.number);
					$('#addressAlias').html(receiverAddress.addressAlias);
					$('#address').html(receiverAddress.address);
					
					if(data.orderStatusId == 3 || data.orderStatusId == 4){
						var shipInfo = data.shipInfo;
						$('#createTimeS').html(shipInfo.createTime);
						$('#creatorS').html(shipInfo.creator);
						$('#companyNameS').html(shipInfo.companyName);
						$('#numberS').html(shipInfo.number);
						var shipmentFileInfos = shipInfo.shipmentFileInfos;
						var atr = "";
						for(var i = 0;i < shipmentFileInfos.length; i++){
							var fileUrl = shipmentFileInfos[i].fileUrl;
							var fileName = shipmentFileInfos[i].fileName;
							atr += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
						}
						$("#signFileInfos").append(atr);
					}
					
					
					if(data.orderStatusId == 4){
						var signForInfo = data.signForInfo;
						$('#consignee').html(signForInfo.consignee);
						$('#createTime').html(signForInfo.createTime);
						$('#createTime').html(signForInfo.createTime);
						
						var signFileInfos = signForInfo.signFileInfos;
						var atr2 = "";
						for(var i = 0;i < signFileInfos.length; i++){
							var fileUrl = signFileInfos[i].fileUrl;
							var fileName = signFileInfos[i].fileName;
							atr2 += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
						}
						$("#signFileInfos2").append(atr2);
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});