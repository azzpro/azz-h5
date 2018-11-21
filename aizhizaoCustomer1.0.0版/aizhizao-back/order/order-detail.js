var clientOrderCode = JSON.parse(localStorage.getItem('clientOrderCode'));
var myFileArr = [];
Module.define("system.order", function(page, $) {
	page.ready = function() {
		getClientOrderDetail();
		init();
		$("#expressCif").bind("click", expressCif);
		$('#myModal').on('hidden.bs.modal', function(e){
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
	function getClientOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getClientOrderDetail",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var orderInfo = data.data.orderInfo;
					if(orderInfo.orderStatusId == 7){
						$('#receiptS').show();
						$('#gqBH').show();
					}else{
						$('#receiptS').hide();
						$('#gqBH').hide();
					}
					if(orderInfo.orderStatusId == 10){
						$('#Signin').show();
						$('#deliver').show();
					}else{
						$('#Signin').hide();
						$('#deliver').hide();
					}
					if(orderInfo.orderStatusId == 11){
						$('#deliver').show();
						$('#signintoo').show();
						
						var signForInfo = data.data.signInfo;
						$('#consigneeS').html(signForInfo.consignee);
						$('#createTime').html(signForInfo.signTime);
						
						var signFileInfos = signForInfo.signFileInfos;
						var atr2 = "";
						for(var i = 0;i < signFileInfos.length; i++){
							var fileUrl = signFileInfos[i].fileUrl;
							var fileName = signFileInfos[i].fileName;
							atr2 += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
						}
						$("#signFileInfos2").append(atr2);
					}else{
						$('#signintoo').hide();
						$('#deliver').hide();
					}
					$('#clientOrderCode').html(orderInfo.clientOrderCode);
					switch(orderInfo.orderStatusId) {
						case 7:
							$('#orderStatusIdS').html('待支付');
							break;
						case 8:
							$('#orderStatusIdS').html('待确认');
							break;
						case 9:
							$('#orderStatusIdS').html('待配货');
							break;
						case 10:
							$('#orderStatusIdS').html('待签收');
							break;
						case 11:
							$('#orderStatusIdS').html('已完成');
							break;
						case 12:
							$('#orderStatusIdS').html('已关闭');
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
						var productPriceSum = orderItems[i].subtotal;
						var deliveryTime = orderItems[i].deliveryTime;
						
						tr += "<tr><td><img class='pull-left' src='"+ modulePicUrl +"' width='45' height='45' alt='' /><div class='pull-left spacing  text-left'>产品编码："+ productCode +"<br>模组名称："+ moduleName +"</div></td>"
						+ "<td>"+ quantity +"</td>"
						+ "<td>"+ productPrice +"</td>"
						+ "<td>"+ productPriceSum +"</td>"
						+ "<td>"+ deliveryTime +"</td></tr>";
					}
					$("#prodetail").append(tr);
					
					
					if(orderInfo.orderStatusId == 10 || orderInfo.orderStatusId == 11){
						var deliveryInfos = data.data.deliveryInfos;
						var tab = "";
						var content = "";
						for(var i = 0;i < deliveryInfos.length; i++){
							var deliveryType = deliveryInfos[i].deliveryType;
							var expressCompany = deliveryInfos[i].expressCompany;
							var number = deliveryInfos[i].number;
							var logistiscCompanyName = deliveryInfos[i].logistiscCompanyName;
							var deliveryPerson = deliveryInfos[i].deliveryPerson;
							var deliveryPhoneNumber = deliveryInfos[i].deliveryPhoneNumber;
							var deliveryTime = deliveryInfos[i].deliveryTime;
							var productCodes = deliveryInfos[i].productCodes;
							
							
							switch(deliveryType) {
								case 1:
									var deliveryTypes = '快递配送';
									break;
								case 2:
									var deliveryTypes = '物流配送';
									break;
								case 3:
								var deliveryTypes = '商家配送';
									break;
							}
							if(deliveryType == 1){
								var distributions = expressCompany +'-'+ number
							}else if(deliveryType == 2){
								var distributions = logistiscCompanyName +'-'+ number
							}else if(deliveryType == 3){
								var distributions = deliveryPerson +'-'+ deliveryPhoneNumber
							}
							
							var expressFileInfos = deliveryInfos[i].expressFileInfos;
							var signFileInfos = "";
							for(var j = 0;j < expressFileInfos.length; j++){
								var fileUrl = expressFileInfos[j].fileUrl;
								var fileName = expressFileInfos[j].fileName;
								signFileInfos += "<a class='ALJ' href='" + fileUrl + "' target='_blank'>" + fileName + "</a>";
							}
							tab += "<li>包裹"+ (i+1) +"</li>";
							content += "<div><table width='100%' class='table mb30'><tbody><tr>"
				    		  	    + "<td>配送方式："+ deliveryTypes +"</td>"
				    		  	    + "<td>配送信息："+ distributions +"</td>"
				    		  	    + "<td>发货时间："+ deliveryTime +"</td></tr>"
				    		        + "<tr><td colspan='3'>发货单："+ signFileInfos +"</td></tr>"
				    		        + "<tr><td colspan='3'>产品信息："+ productCodes +"</td></tr></tbody></table></div>";
						}
						$("#tab-menu").append(tab);
						$("#tab-content").append(content);
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//否能执行签收操作
	function expressCif() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/checkSignOperation",
			cache: false, //禁用缓存
			data: {
				'clientOrderCode':clientOrderCode,
			},
			dataType: "json", 
			success: function(data) {
	        	if (data.code == 0) {
	        		uploadSignForm();
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//签收
	function uploadSignForm() {
		var fm = new FormData();
		fm.append('clientOrderCode', clientOrderCode);
		fm.append('consignee', $("input[name='consignee']").val());
		for(var i = 0;i < myFileArr.length; i++){
			fm.append('signFormFiles['+i+']', myFileArr[i]);
		}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/client/order/uploadSignForm',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.reload()
	        		window.location.href = "#!order/order-management.html"
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	function init() {
		$("#basicForm").validate({
			rules: {
				consignee: {
	   				required: true,
	   			},
				myFile: {
	   				required: true,
	   			}
				
			},
			messages: {
				consignee: {
	   				required: "请输入收货人",
	   			},
				myFile: "请上传出库单扫描件"
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