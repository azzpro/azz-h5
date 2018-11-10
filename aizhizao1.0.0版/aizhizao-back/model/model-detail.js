Module.define("system.model", function(page, $) {
	var param = getRequest();
	var productId = param["productId"];
	page.ready = function() {
		productInfo();
	}
	function productInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/productInfo",
			cache: false, //禁用缓存
			data: {
				'id':productId,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$('#productCode').html(data.productCode);
					switch(data.currentStatus) {
						case 1:
							$('#currentStatus').html('上架');
							break;
						case 2:
							$('#currentStatus').html('下架');
							break;
					};
					$('#createTime').html(data.createTime);
					$('#merchantName').html(data.merchantName);
					$('#moduleName').html(data.moduleName);
					var prices = data.prices;
					var li = '';
					for(var i = 0;i< prices.length;i++){
						li += "<li><p>" + prices[i].deliveryDate + "</p>" + prices[i].price + "</li>"
					}
					$("#prices").append(li);
					
					var params = data.params;
					var lii = '';
					for(var i = 0;i< params.length;i++){
						lii += "<li><p>" + params[i].paramsName + "</p>" + params[i].paramsValue + "</li>"
					}
					$("#params").append(lii);
				} else {
					alert(data.msg)
				}
			}
		});
	}
});