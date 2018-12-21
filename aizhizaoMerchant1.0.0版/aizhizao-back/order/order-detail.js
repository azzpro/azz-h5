var orderCode = JSON.parse(localStorage.getItem('orderCode'));
var myFileArr = [];
Module.define("system.order", function(page, $) {
	page.ready = function() {
		getMerchantOrderDetail();
		getAllExpressCompany();
		init();
		$("#receiptS").bind("click", submitForm);
		$("#expressCif").bind("click", expressCif);
		$("#logisticsCif").bind("click", logisticsCif);
		$("#selfCif").bind("click", selfCif);
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
				$('#logisticsDY').show();
				$('#logisticsCif').show();
				$('#logisticsSR').show();
			}else{
				$('#logisticsDY').hide();
				$('#logisticsCif').hide();
				$('#logisticsSR').hide();
			}
			if($("input[name='mode']:checked").val() == 3){
				$('#selfDY').show();
				$('#selfCif').show();
				$('#selfSR').show();
			}else{
				$('#selfDY').hide();
				$('#selfCif').hide();
				$('#selfSR').hide();
			}
		});
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$("input[name='mode']:checked").val(1);
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
				$('#logisticsDY').show();
				$('#logisticsCif').show();
				$('#logisticsSR').show();
			}else{
				$('#logisticsDY').hide();
				$('#logisticsCif').hide();
				$('#logisticsSR').hide();
			}
			if($("input[name='mode']:checked").val() == 3){
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
		
		var objUrl;
		var img_html;
		$("#myFile").change(function() {
			var img_div = $(".img_div");
			var filepath = $("input[name='myFile']").val();
			
			for(var i = 0; i < this.files.length; i++) {
				objUrl = getObjectURL(this.files[i]);
				myFileArr.push(this.files[i]);
				var extStart = filepath.lastIndexOf(".");
				var ext = filepath.substring(extStart, filepath.length).toUpperCase();
				/*
				描述：鉴定每个图片上传尾椎限制
				* */
				if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
					$(".shade").fadeIn(500);
					$(".text_span").text("图片限于bmp,png,gif,jpeg,jpg格式");
					this.value = "";
					$(".img_div").html("");
					return false;
				} else {
					/*
					 若规则全部通过则在此提交url到后台数据库
					 * */
					img_html = "<div class='isImg'><img src='" + objUrl + "' style='height: 100%; width: 100%;' /><button class='removeBtn' onclick='system.order.removeImg(this," + this.files[i].size + ")'>x</button></div>";
					img_div.append(img_html);
				}
			}
			/*
			描述：鉴定每个图片大小总和
			* */
			var file_size = 0;
			var all_size = 0;
			for(j = 0; j < this.files.length; j++) {
				file_size = this.files[j].size;
				all_size = all_size + this.files[j].size;
				var size = all_size / 1024;
				if(size > 500) {
					$(".shade").fadeIn(500);
					$(".text_span").text("上传的图片大小不能超过100k！");
					this.value = "";
					$(".img_div").html("");
					return false;
				}
			}
			return true;
		});
		/*
		描述：鉴定每个浏览器上传图片url 目前没有合并到Ie
		 * */
		function getObjectURL(file) {
			var url = null;
			if(window.createObjectURL != undefined) { // basic
				url = window.createObjectURL(file);
			} else if(window.URL != undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if(window.webkitURL != undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			//console.log(url);
			return url;
		}
	}
	page.removeImg = function(r,w){
		$(r).parent().remove();
		$.each(myFileArr,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.size == w){
				myFileArr.splice(index,1);
				return false;
			}
		});
		
	}
	function getMerchantOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/order/getMerchantOrderDetail",
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
					if(data.invoiceStatus == 0){
						$('#invoiceStatus').html('未开票')
					}else if(data.invoiceStatus == 1){
						$('#invoiceStatus').html('已开票')
					}
					$('#remark').html(data.remark);
					$('#grandTotal').html(data.grandTotal);
					if(data.orderStatusId == 1){
						$('#receiptS').show();
					}else{
						
					}
					if(data.orderStatusId == 2){
						$('#fhstatus').show();
						$('#sharr').show();
						$('#dingdfh').show();
						
					}else{
						
					}
					if(data.orderStatusId == 3){
						$('#deliver').show();
						$('#fhstatus').show();
						$('#sharr').show();
					}else{
						
					}
					if(data.orderStatusId == 4){
						$('#deliver').show();
						$('#fhstatus').show();
						$('#sharr').show();
						$('#fhdID').show();
						$('#invoice').show();
						$('#signintoo').show();
						var shipmentFileInfos = data.shipInfo.shipmentFileInfos;
						var atr = "";
						for(var i = 0;i < shipmentFileInfos.length; i++){
							var fileUrl = shipmentFileInfos[i].fileUrl;
							var fileName = shipmentFileInfos[i].fileName;
							atr += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
						}
						$("#signFileInfos").append(atr);
						
						var signForInfo = data.signForInfo;
						$('#consignee').html(signForInfo.consignee);
						$('#createTime').html(signForInfo.createTime);
						
						var signFileInfos = signForInfo.signFileInfos;
						var atr2 = "";
						for(var i = 0;i < signFileInfos.length; i++){
							var fileUrl = signFileInfos[i].fileUrl;
							var fileName = signFileInfos[i].fileName;
							atr2 += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
						}
						$("#signFileInfos2").append(atr2);
					}else{
						
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
					
					if(data.orderStatusId != 1){
						var receiverAddress = data.receiverAddress;
						$('#receiverName').html(receiverAddress.receiverName);
						$('#number').html(receiverAddress.number);
						$('#addressAlias').html(receiverAddress.addressAlias);
						$('#address').html(receiverAddress.address);
					}
					
					if(data.orderStatusId == 3 || data.orderStatusId == 4){
						var shipInfo = data.shipInfo;
						$('#createTimeS').html(shipInfo.createTime);
						$('#creatorS').html(shipInfo.creator);
						if(shipInfo.deliveryType == 1){
							$('#companyNameS').html(shipInfo.companyName +'-'+ shipInfo.number);
						}else if(shipInfo.deliveryType == 2){
							$('#companyNameS').html(shipInfo.logistiscCompanyName +'-'+ shipInfo.number);
						}else if(shipInfo.deliveryType == 3){
							$('#companyNameS').html(shipInfo.deliveryPerson +'-'+ shipInfo.deliveryPhoneNumber);
						}
						
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//接单
	function submitForm() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/order/editMerchantOrderStatus",
			cache: false, //禁用缓存
			data: {
				'orderCode':orderCode,
				'status':1,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					window.location.reload();
					window.location.href = "#!order/order-management.html"				
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//订单发货-快递
	function expressCif() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		var fm = new FormData();
		fm.append('orderCode', orderCode);
		fm.append('status', 2);
		fm.append('deliveryType', $("input[name='mode']:checked").val());
		fm.append('expressCompanyId', $("#companyOne").val());
		fm.append('number', $("input[name='Couriernumber']").val());
		for(var i = 0;i < myFileArr.length; i++){
			fm.append('shipmentFiles['+i+']', myFileArr[i]);
		}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/merchant/order/editMerchantOrderStatus',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.reload();
	        		window.location.href = "#!order/order-management.html"
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	//订单发货-物流
	function logisticsCif() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		var fm = new FormData();
		fm.append('orderCode', orderCode);
		fm.append('status', 2);
		fm.append('deliveryType', $("input[name='mode']:checked").val());
		fm.append('logistiscCompanyName', $("input[name='Logisticscompany']").val());
		fm.append('number', $("input[name='Singlenumber']").val());
		for(var i = 0;i < myFileArr.length; i++){
			fm.append('shipmentFiles['+i+']', myFileArr[i]);
		}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/merchant/order/editMerchantOrderStatus',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.reload();
	        		window.location.href = "#!order/order-management.html"
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	//订单发货-自送
	function selfCif() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		var fm = new FormData();
		fm.append('orderCode', orderCode);
		fm.append('status', 2);
		fm.append('deliveryType', $("input[name='mode']:checked").val());
		fm.append('deliveryPerson', $("input[name='Distributionperson']").val());
		fm.append('deliveryPhoneNumber', $("input[name='phonenumber']").val());
		for(var i = 0;i < myFileArr.length; i++){
			fm.append('shipmentFiles['+i+']', myFileArr[i]);
		}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/merchant/order/editMerchantOrderStatus',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.reload();
	        		window.location.href = "#!order/order-management.html"
				} else {
					alert(data.msg);
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
				'orderCode':orderCode,
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
	
	function init() {
		$("#basicForm").validate({
			rules: {
				Couriernumber: {
	   				required: true,
	   			},
				Singlenumber: {
	   				required: true,
	   			},
				phonenumber: {
	   				required: true,
	   			},
				myFile: {
	   				required: true,
	   			},
				Logisticscompany: {
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
				Singlenumber: {
	   				required: "请输入物流单号",
	   			},
				phonenumber: "请输入手机号码",
				myFile: "请上传出库单扫描件",
				Logisticscompany: "请输入物流公司",
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