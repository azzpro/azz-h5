Module.define("system.order", function(page, $) {
	page.ready = function() {
		initDataTable();
		Pagination();
		$("#Search").bind("click", function() {
			$("#orderTable").empty();
			initDataTable();
			Pagination();
		});
	}
	
	function initDataTable() {
		$.ajax({
			type:"POST",
			url:ulrTo + "/azz/api/client/order/getClientOrderInfoList",
			async:false,
			cache: false, //禁用缓存
			data: {
				pageNum: '1',
				pageSize: '10',
				searchInput : $("input[name='searchname']").val(),
				orderStatus : $('#approvalType').val()
			},
			dataType: "json", 
			success: function (data) {
				$('#total').html(data.data.total);
				var rows = data.data.rows;
				
				if(!rows || !rows.length){
					var nodata = "<li class='tab-liii' align='center'>表中数据为空</li>";
					$("#orderTable").append(nodata);
				}else{
					var htmlArr = "";
					for(var i = 0;i < rows.length; i++){
						var clientOrderCode = rows[i].clientOrderCode;
						var orderTime = rows[i].orderTime;
						var receiverName = rows[i].receiverName;
						var orderItems = rows[i].orderItems;
						var grandTotal = rows[i].grandTotal;
						var paymentMethod = rows[i].paymentMethod;
						var orderStatusId = rows[i].orderStatusId;
						if(paymentMethod == 1){
							var paymentMethodS = '在线支付'
						}else if(paymentMethod == 2){
							var paymentMethodS = '线下支付'
						}else{
							var paymentMethodS = ''
						}
						switch(orderStatusId) {
							case 7:
								var orderStatusIdS = '待支付';
								break;
							case 8:
								var orderStatusIdS = '待确认';
								break;
							case 9:
								var orderStatusIdS = '待配货';
								break;
							case 10:
								var orderStatusIdS = '待签收';
								break;
							case 11:
								var orderStatusIdS = '已完成';
								break;
							case 12:
								var orderStatusIdS = '已关闭';
								break;
						}
						
						if(orderStatusId==7){
							var paymentStatus="<a href='javascript:;' onclick=\"system.order.payment(\'" + clientOrderCode + "\');\" class='btn btn-primary zlan'>付款</a>"
						}else{
							var paymentStatus="-"
						}

						var tr = "";
						for(var j = 0;j < orderItems.length; j++){
							var modulePicUrl = orderItems[j].modulePicUrl;
							var productCode = orderItems[j].productCode;
							var moduleName = orderItems[j].moduleName;
							var deliveryTime = orderItems[j].deliveryTime;
							var quantity = orderItems[j].quantity;
							
							tr += "<dl><dd><img class='pull-left' src='" + modulePicUrl + "' width='45' height='45' alt='' /><div class='pull-left spacing  text-left'>产品编码："+ productCode +"<br>模组名称："+ moduleName +"</div></dd>"
							   + "<dd>"+quantity+"</dd><dd>"+deliveryTime+"</dd></dl>";
						}
						htmlArr += "<li class='tabbt'><span><b>收货人:</b>"+ receiverName +"</span>"+ orderTime +"&nbsp;&nbsp;<b>订单编号:</b> "+ clientOrderCode +"</li><li class='tab-lii'><div class='child1'>"
								+ tr
								+ "</div><div class='child2'>"+ grandTotal +"<br />"+ paymentMethodS +"</div><div class='child3'><p>"+ orderStatusIdS +"<br>"
								+ "<a href='javascript:;' onclick=\"system.order.details(\'" + clientOrderCode + "\');\">订单详情</a>"
								+ "</p></div><div class='child4'>"+paymentStatus+"</div>"
								+ "</li>";
					}
					$("#orderTable").append(htmlArr);
				}
				
		
			}
		});
		
	}
	
	function Pagination(){
		$('.M-box').pagination({
		    totalData: parseInt($('#total').html()),
		    //jump: true,
		    showData: 10,
		    isHide: true,
		    coping: true,
		    prevContent: '上一页',
   			nextContent: '下一页',
		    callback: function (api) {
		        var data = {
					pageNum: api.getCurrent(),
					pageSize: 10,
					searchInput : $("input[name='searchname']").val(),
					orderStatus : $('#approvalType').val()
		        };
		        $.getJSON(ulrTo + '/azz/api/client/order/getClientOrderInfoList#!method=POST', data, function (data) {
		        	
		        	$("#orderTable").empty();
		        	var rows = data.data.rows;
				
					if(!rows || !rows.length){
						var nodata = "<li class='tab-liii' align='center'>表中数据为空</li>";
						$("#orderTable").append(nodata);
					}else{
						var htmlArr = "";
						for(var i = 0;i < rows.length; i++){
							var clientOrderCode = rows[i].clientOrderCode;
							var orderTime = rows[i].orderTime;
							var receiverName = rows[i].receiverName;
							var orderItems = rows[i].orderItems;
							var grandTotal = rows[i].grandTotal;
							var paymentMethod = rows[i].paymentMethod;
							var orderStatusId = rows[i].orderStatusId;
							if(paymentMethod == 1){
								var paymentMethodS = '在线支付'
							}else if(paymentMethod == 2){
								var paymentMethodS = '线下支付'
							}
							switch(orderStatusId) {
								case 7:
									var orderStatusIdS = '待支付';
									break;
								case 8:
									var orderStatusIdS = '待确认';
									break;
								case 9:
									var orderStatusIdS = '待配货';
									break;
								case 10:
									var orderStatusIdS = '待签收';
									break;
								case 11:
									var orderStatusIdS = '已完成';
									break;
								case 12:
									var orderStatusIdS = '已关闭';
									break;
							}
	
							var tr = "";
							for(var j = 0;j < orderItems.length; j++){
								var modulePicUrl = orderItems[j].modulePicUrl;
								var productCode = orderItems[j].productCode;
								var moduleName = orderItems[j].moduleName;
								var deliveryTime = orderItems[j].deliveryTime;
								var quantity = orderItems[j].quantity;
								
								tr += "<dl><dd><img class='pull-left' src='" + modulePicUrl + "' width='45' height='45' alt='' /><div class='pull-left spacing  text-left'>产品编码："+ productCode +"<br>模组名称："+ moduleName +"</div></dd>"
								   + "<dd>"+quantity+"</dd><dd>"+deliveryTime+"</dd></dl>";
							}
							htmlArr += "<li class='tabbt'><span><b>收货人:</b>"+ receiverName +"</span>"+ orderTime +"&nbsp;&nbsp;<b>订单编号:</b> "+ clientOrderCode +"</li><li class='tab-lii'><div class='child1'>"
									+ tr
									+ "</div><div class='child2'>"+ grandTotal +"<br />"+ paymentMethodS +"</div><div class='child3'><p>"+ orderStatusIdS +"<br>"
									+ "<a href='javascript:;' onclick=\"system.order.details(\'" + clientOrderCode + "\');\">订单详情</a>"
									+ "</p></div><div class='child4'><a href='javascript:;' onclick=\"system.order.payment(\'" + clientOrderCode + "\');\" class='btn btn-primary zlan'>付款</a></div>"
									+ "</li>";
						}
						$("#orderTable").append(htmlArr);
					}
		            
		        });

		        
		    }
		});
	}
	
	//详情
	page.details = function(clientOrderCode) {
		if(!window.localStorage){
            return false;
        }else{
            var storage=window.localStorage;
            var clientOrderCode = JSON.stringify(clientOrderCode);
            storage["clientOrderCode"]= clientOrderCode;
        }
        window.location.href = "#!order/order-detail.html"
	}
	//付款
	page.payment = function(clientOrderCode) {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var ordercode = JSON.stringify(clientOrderCode);
	        storage["ordercode"]= ordercode;
	    }
	    window.location.href = "#!model/model-payment.html"
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