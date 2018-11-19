var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
Module.define("system.stomerorder", function(page, $) {
	page.ready = function() {
		getClientOrderOperationRecords();
	}
	function getClientOrderOperationRecords() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/client/order/getClientOrderOperationRecords",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					if(!data || !data.length){
						var nodata = "<tr><td colspan='4' height='30'>表中数据为空</td></tr>";
						$("#table").append(nodata);
					}else{
						var tr = "";
						for(var i = 0;i < data.length; i++){
							var optType = data[i].optType;
							var optTime = data[i].optTime;
							var operator = data[i].operator;
							var optRemark = data[i].optRemark;
							
							tr += "<tr><td>"+ optType +"</td>"
							+ "<td>"+ optTime +"</td>"
							+ "<td>"+ operator +"</td>"
							+ "<td>"+ optRemark +"</td></tr>";
						}
						$("#table").append(tr);
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});