var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
Module.define("system.invoice", function(page, $) {
	page.ready = function() {
		getAllExpressCompany();
		getClientInvoiceApplyDetail();
		$("#Subbunnot").bind("click", confirmBillingApplication);
		$("#expressCif").bind("click", orderInvoice);
		$("#selfCif").bind("click", orderInvoice2);
		if($("input[name='mode']:checked").val() == 1){
			$('#expressDY').show();
			$('#expressCif').show();
			$('#expressSR').show();
				
		}
		$("input[name='mode']").bind("change", function(){
			if($("input[name='mode']:checked").val() == 1){
				$('#expressDY').show();
				$('#expressCif').show();
				$('#expressSR').show();
				
			}else{
				$('#expressDY').hide();
				$('#expressCif').hide();
				$('#expressSR').hide();
			}
			if($("input[name='mode']:checked").val() == 2){
				$('#selfDY').show();
				$('#selfCif').show();
				$('#selfSR').show();
			}else{
				$('#selfDY').hide();
				$('#selfCif').hide();
				$('#selfSR').hide();
			}
		});
		
		$('#myModal2').on('hidden.bs.modal', function(e){
			$("#express").attr("checked","checked");
			if($("input[name='mode']:checked").val() == 1){
				$('#expressDY').show();
				$('#expressCif').show();
				$('#expressSR').show();
				
			}else{
				$('#expressDY').hide();
				$('#expressCif').hide();
				$('#expressSR').hide();
			}
			if($("input[name='mode']:checked").val() == 2){
				$('#selfDY').show();
				$('#selfCif').show();
				$('#selfSR').show();
			}else{
				$('#selfDY').hide();
				$('#selfCif').hide();
				$('#selfSR').hide();
			}
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
	}
	//确认开票申请
	function confirmBillingApplication() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/invoice/confirmBillingApplication",
			cache: false, //禁用缓存
			data: {
				'merchantOrderCode':clientOrderCode,
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
	
	//详情
	function getClientInvoiceApplyDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/invoice/getMerchantInvoiceDetail",
			cache: false, //禁用缓存
			data: {
				'merchantOrderCode' : clientOrderCode
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data=data.data;
					if(data.merchantInvoiceApplyStatus==0){
						$('#Application').show();
					}else{
						$('#Application').hide();
					}
					if(data.merchantInvoiceApplyStatus==1){
						$('#Orderinvoice').show();
					}else{
						$('#Orderinvoice').hide();
					}
					//关联订单
					$('#orderCode').html(data.merchantOrderCode);
					switch(data.clientOrderStatus) {
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
					switch(data.merchantInvoiceApplyStatus) {
						case 0:
							$('#merchantInvoiceApplyStatus').html('待确认');
							break;
						case 1:
							$('#merchantInvoiceApplyStatus').html('待开票');
							break;
						case 2:
							$('#merchantInvoiceApplyStatus').html('待签收');
							break;
						case 3:
							$('#merchantInvoiceApplyStatus').html('已完成');
							break;
					};
					
					$('#grandTotal').html(data.grandTotal);
					$('#applyAmount').html(data.applyAmount);
					
					//开票详情
					if(data.invoiceType == 0){
						$('#ordinarySS').show();
						$("#clientApplyCode").html(data.merchantApplyCode);
						$('#createTime').html(data.createTime);
						$('#invoiceTitle').html(data.invoiceTitle);
						$('#taxIdentificationNumber').html(data.taxIdentificationNumber);
					}else if(data.invoiceType == 1){
						$('#incrementSS').show();
						$("#clientApplyCode2").html(data.merchantApplyCode);
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
					$('#address').html(data.provinceName+data.cityName+data.areaName+data.detailAddress);
					
					//配送
					if(data.merchantInvoiceApplyStatus==2 || data.merchantInvoiceApplyStatus==3){
						$('#distribution').show();
						$('#deliveryCreator').html(data.deliveryCreator);
						$('#deliveryCreateTime').html(data.deliveryCreateTime);
						if(data.deliveryType == 0){
							$('#delivery').html(data.deliveryCompanyName+'-'+data.number);
						}else if(data.deliveryType == 1){
							$('#delivery').html(data.deliveryPerson+'-'+data.deliveryPhone);
						}
					}
					//产品明细
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
					
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//查询所有快递公司
	function getAllExpressCompany() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/order/getAllExpressCompany",
			cache: false, //禁用缓存
			data: {
				'orderCode':clientOrderCode,
				'status':1,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var arr = [];
					for(var i = 0, len = data.data.length; i < len; i++) {
						arr.push('<option value="');
						arr.push(data.data[i].id);
						arr.push('">');
						arr.push(data.data[i].companyName);
						arr.push('</option>');
					}
					$("#companyOne").html(arr.join(''));		
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//发货-快递
	function orderInvoice() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/invoice/orderInvoice",
			cache: false, //禁用缓存
			data: {
				'deliveryType':0,
				'expressCompanyId':$('#companyOne').val(),
				'number':$("input[name='Couriernumber']").val(),
				'merchantOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					window.location.reload();
					window.location.href = "#!invoice/invoice-management.html"
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//发货-自送
	function orderInvoice2() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/invoice/orderInvoice",
			cache: false, //禁用缓存
			data: {
				'deliveryType':1,
				'deliveryPerson':$("input[name='Distributionperson']").val(),
				'deliveryPhone':$("input[name='phonenumber']").val(),
				'merchantOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					window.location.reload();
					window.location.href = "#!invoice/invoice-management.html"
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function init() {
		$("#basicForm").validate({
			rules: {
				Couriernumber: {
	   				required: true,
	   			},
				phonenumber: {
	   				required: true,
	 		  	},
				Distributionperson: {
	   				required: true,
	   			}
				
			},
			messages: {
				Couriernumber: {
	   				required: "请输入快递单号",
	   		},
				phonenumber: "请输入手机号码",
				Distributionperson: "请输入配送人"
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
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