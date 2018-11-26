Module.define("system.invoice", function(page, $) {
	page.ready = function() {
		init();
		getShippingAddressList();
		getInvoiceTemplateList();
		getDefaultShippingAddress()
		$("#addShippingAddress").bind("click", addShippingAddress);
		$("#Submission").bind("click", Submission);
		initDataTable();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$('#distpicker').distpicker({
	   		autoSelect: false,
		    /*province: '广东省',
		    city: '深圳市',
		    district: '罗湖区'*/
		});
		$.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");
		
		$('#myModal2').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$('#distpicker').distpicker('reset');
		});
		$('#myModal3').on('hidden.bs.modal', function(e){
			$('#basicForm2')[0].reset();
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
		
		$("input[name='invoices']").bind("change", function(){
			if($("input[name='invoices']:checked").val() == 0){
				$("#addinvoices").empty();
				getInvoiceTemplateList();
			}else if($("input[name='invoices']:checked").val() == 1){
				$("#addinvoices").empty();
				getInvoiceTemplateList2();
			}
		});
		
	}
	
	function initDataTable() {
		dataTable = $('#table').DataTable({
			"language": {url: "../js/chinese.json"},
			"lengthChangevar": false, //去掉每页显示数据条数
			"bPaginate" : true,// 分页按钮  
			"stateSave": false, //状态保存
			"deferRender": true, //延迟渲染数据
			"processing": false,//等待加载效果 
			"serverSide": true,
			"lengthChange": false,
			"responsive": true,
			"searching":false,
			"ordering":false,
			"info":false,
			"ajax": function (data, callback, settings) {
				
				//封装请求参数  
				var param = {};
				param = data;
				param.pageNum = data.start/10+1;
				param.pageSize = data.length;
				param.clientOrderCode = $("input[name='searchcod']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/client/invoice/getInvoiceClientList",
				 	cache: false, //禁用缓存   
				 	data: param, //传入组装的参数   
				 	dataType: "json", 
				 	success: function (result) {
			 			//封装返回数据   
			 			var returnData = {};
			 			returnData = param;
			 			returnData.draw = result.pageNum;//这里直接自行返回了draw计数器,应该由后台返回
			 			returnData.recordsTotal = result.data.total;//返回数据全部记录
			 			returnData.recordsFiltered = result.data.total;//后台不实现过滤功能，每次查询均视作全部结果   
			 			if(null == result.data.rows){
			 				result.data.rows = [];
			 			}
			 			returnData.data = result.data.rows;//返回的数据列表   
			 			//调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染   
			 			//此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕   
			 			callback(returnData);   
				 	}  
				 });
			},
			"columns": [{
					"title": "订单编号",
					"data": "clientOrderCode",
					"className": "all",
					"defaultContent": "-"
				}, 
				{
					"title": "订单金额",
					"data": "grandTotal",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "订单状态",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.orderStatusId) {
							case 7:
								return '待支付';
								break;
							case 8:
								return '待确认';
								break;
							case 9:
								return '待配货 ';
								break;
							case 10:
								return '代签收';
								break;
							case 11:
								return '已完成';
								break;
							case 12:
								return '已关闭';
								break;
						};
					}
				},
				{
					"title": "申请状态",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.invoiceStatus) {
							case 0:
								return '未开票';
								break;
							case 1:
								return '已开票';
								break;
						};
					}
				},
				{
					"title": "创建时间",
					"data": "createTime",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "操作",
					"data": "",
					"className": "desktop testview",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
			            	var html = '<div class="am-btn-toolbar">';
			            		html += '<div class="am-btn-group am-btn-group-xs">';
			            		html += '<a href="javascript:;" onclick="system.invoice.details(\'' + row.clientOrderCode +"','" + row.grandTotal +'\');">申请开票</a>';
			            		html += '</div>';
			            		html += '</div>';
				            return html;
						}
		            }
				}
			],
		});
	}
	
	//选中
	page.details = function (clientOrderCode,grandTotal) {
		$('#clientOrderCode').html(clientOrderCode);
		$('#grandTotal').html(grandTotal);
		$("#prodetail").empty();
		getClientOrderItems(clientOrderCode);
		$('#myModal4').modal('hide');
	}
	
	//产品明细
	function getClientOrderItems(clientOrderCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/invoice/getClientOrderItems",
			cache: false, //禁用缓存
			data: {
				'searchInput' : clientOrderCode
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var orderItems = data.data;
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
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//默认地址
	function getDefaultShippingAddress() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getDefaultShippingAddress",
			cache: false, //禁用缓存
			data: {},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data=data.data;
					$('#address').html(data.provinceName + data.cityName + data.areaName + data.detailAddress);
					$('#consignee').html(data.receiverName);
					$('#pohe').html(data.receiverPhoneNumber);
					$('#addressAlias').html(data.addressAlias);
					$('#shippingId').html(data.shippingId)
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//提交申请
	function Submission() {
		if(!$('#Invoicetypeid').html()){
			alert('请选择开票模板');
			return;
		}
		if(!$('#shippingId').html()){
			alert('请选择寄送地址');
			return;
		}
		if(!$('#clientOrderCode').html()){
			alert('请选择订单');
			return;
		}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/client/invoice/addInvoiceApply',
	        cache: false, //禁用缓存    
			dataType: "json",
			data: {
				'amount' : $('#grandTotal').html(),
				'clientOrderCode' : $('#clientOrderCode').html(),
				'invoiceTemplateId' : $('#Invoicetypeid').html(),
				'shippingAddressId' : $('#shippingId').html()
			},
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.href = "#!invoice/invoice-management.html"
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//发票模板
	function getInvoiceTemplateList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/invoice/getInvoiceTemplateList",
			cache: false, //禁用缓存
			data: {
				'invoiceType' : 0
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var tr = "";
					for(var i = 0;i < data.length; i++){
						var title = data[i].title;
						var number = data[i].number;
						var id = data[i].id;
						var remark = data[i].remark;
						var ordinary = '普通发票';
						
						
						tr += "<tr>"
						+ "<td>发票抬头："+ title +"<br>纳税人识别号："+ number +"</td>"
						+ "<td><a class='btn btn-primary zlan' href='javascript:;' onclick=\"system.invoice.SelecS(\'" + title+ "','" + number + "','" + id + "','" + remark + "','" + ordinary + "\');\">选用</a></td></tr>";
					}
					$("#addinvoices").append(tr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//选中
	page.SelecS = function (title,number,id,remark,ordinary) {
		$('#Invoicetype').html(ordinary);
		$('#Invoiceraised').html(title);
		$('#taxpayer').html(number);
		$('#remark').html(remark);
		$('#Invoicetypeid').html(id);
		$('#myModal5').modal('hide');
		$('#ordinarySS').show();
		$('#incrementSS').hide();
	}
	//发票模板
	function getInvoiceTemplateList2() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/invoice/getInvoiceTemplateList",
			cache: false, //禁用缓存
			data: {
				'invoiceType' : 1
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var tr = "";
					for(var i = 0;i < data.length; i++){
						var companyName = data[i].companyName;
						var number = data[i].number;
						var id = data[i].id;
						var createTime = data[i].createTime;
						var ordinary2 = '增值税专用发票';
						var regAddress = data[i].regAddress;
						var regTelephone = data[i].regTelephone;
						var bank = data[i].bank;
						var bankAccount = data[i].bankAccount;
						
						
						tr += "<tr>"
						+ "<td>公司名称："+ companyName +"<br>纳税人识别号："+ number +"</td>"
						+ "<td><a class='btn btn-primary zlan' href='javascript:;' onclick=\"system.invoice.SelecStar(\'" + companyName+ "','" + number + "','" + id + "','" + createTime + "','" + ordinary2 + "','" + regAddress + "','" + regTelephone + "','" + bank + "','" + bankAccount + "\');\">选用</a></td></tr>";
					}
					$("#addinvoices").append(tr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//选中
	page.SelecStar = function (companyName,number,id,createTime,ordinary2,regAddress,regTelephone,bank,bankAccount) {
		$('#incrementtype').html(ordinary2);
		$('#companyName').html(companyName);
		$('#createTime').html(createTime);
		$('#number').html(number);
		$('#Invoicetypeid').html(id);
		$('#regAddress').html(regAddress);
		$('#regTelephone').html(regTelephone);
		$('#bank').html(bank);
		$('#bankAccount').html(bankAccount);
		
		$('#myModal5').modal('hide');
		$('#incrementSS').show();
		$('#ordinarySS').hide();
	}
	
	function getShippingAddressList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getShippingAddressList",
			cache: false, //禁用缓存
			data: {},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var tr = "";
					for(var i = 0;i < data.length; i++){
						var shippingId = data[i].shippingId;
						var isDefault = data[i].isDefault;
						var receiverName = data[i].receiverName;
						var receiverPhoneNumber = data[i].receiverPhoneNumber;
						var provinceName = data[i].provinceName;
						var cityName = data[i].cityName;
						var areaName = data[i].areaName;
						var detailAddress = data[i].detailAddress;
						var addressAlias = data[i].addressAlias;
						var address = provinceName + cityName + areaName + detailAddress;
						if(isDefault == 1){
							var isDefaultS = '默认' 
						}else{
							var isDefaultS = '' 
						}
						
						tr += "<tr><td>"+ isDefaultS +"</td>"
						+ "<td>"+ receiverName +"&nbsp;&nbsp;&nbsp;"+ receiverPhoneNumber +"<br>"+ address +"</td>"
						+ "<td><a href='javascript:;' onclick=\"system.invoice.Selection(\'" + receiverName+ "','" + receiverPhoneNumber + "','" + address + "','" + shippingId + "','" + addressAlias + "\');\">选用</a>&nbsp;&nbsp;<a href='javascript:;' onclick=\"system.invoice.edit(\'" + shippingId + "\');\">编辑</a>&nbsp;&nbsp;<a href='javascript:;' onclick=\"system.invoice.deletes(\'" + shippingId + "\');\">删除</a></td></tr>";
					}
					$("#addressList").append(tr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function addShippingAddress() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		var adefault = 0;
		if ($('#default').is(':checked')) {
			adefault = 1;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/addShippingAddress",
			cache: false, //禁用缓存
			data: {
				'receiverName':$("input[name='consignee']").val(),
				'receiverPhoneNumber':$("input[name='Phone']").val(),
				'provinceName':$("#province").val(),
				'provinceCode':$("#province").val(),
				'cityCode':$("#city").val(),
				'cityName':$("#city").val(),
				'areaCode':$("#district").val(),
				'areaName':$("#district").val(),
				'detailAddress':$("input[name='detailaddress']").val(),
				'addressAlias':$("input[name='addressalias']").val(),
				'isDefault':adefault,
				
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$("#addressList").empty();
					getShippingAddressList()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//选中
	page.Selection = function (receiverName,receiverPhoneNumber,address,shippingId,addressAlias) {
		$('#address').html(address);
		$('#consignee').html(receiverName);
		$('#pohe').html(receiverPhoneNumber);
		$('#shippingId').html(shippingId);
		$('#addressAlias').html(addressAlias);
		$('#myModal').modal('hide');
	}
	
	//删除
	page.deletes = function (shippingId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/delShippingAddress",
			cache: false, //禁用缓存
			data: {
				'shippingId':shippingId,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$("#addressList").empty();
					getShippingAddressList()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//编辑
	page.edit = function (shippingId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getShippingAddress",
			cache: false, //禁用缓存
			data: {
				'shippingId':shippingId,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$("input[name='addressalias2']").val(data.addressAlias);
					$('#distpicker2').distpicker('destroy');
					$('#distpicker2').distpicker({
						autoSelect: true,
					    province: data.provinceName,
					    city: data.cityName,
					    district: data.areaName
					});
					$("input[name='consignee2']").val(data.receiverName);
					$("input[name='Phone2']").val(data.receiverPhoneNumber);
					$("input[name='detailaddress2']").val(data.detailAddress);
					if(data.isDefault == 1){
						$("#default2").attr("checked", "checked");
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal3').modal('show');
		$('#addShippingAddress2').attr("onclick", "system.invoice.editGroup(\'" + shippingId +"\');")
	}
	
	page.editGroup = function (shippingId) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		var adefault2 = 0;
		if ($('#default2').is(':checked')) {
			adefault2 = 1;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/editShippingAddress",
			cache: false, //禁用缓存
			data: {
				'shippingId':shippingId,
				'receiverName':$("input[name='consignee2']").val(),
				'receiverPhoneNumber':$("input[name='Phone2']").val(),
				'provinceName':$("#province2").val(),
				'provinceCode':$("#province2").val(),
				'cityCode':$("#city2").val(),
				'cityName':$("#city2").val(),
				'areaCode':$("#district2").val(),
				'areaName':$("#district2").val(),
				'detailAddress':$("input[name='detailaddress2']").val(),
				'addressAlias':$("input[name='addressalias2']").val(),
				'isDefault':adefault2,
				
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal3').modal('hide');
					$("#addressList").empty();
					getShippingAddressList()
				} else {
					alert(data.msg)
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
				Phone: {
	   				required: true,
	   				isMobile: true,
	   			},
				province: "required",
	   			city: "required",
	   			detailaddress: "required",
	   			addressalias: "required",
				
			},
			messages: {
				consignee: {
	   				required: "请输入收货人",
	   			},
	   			Phone: {
	   				required: "请输入您的电话号码",
	   				isMobile: "请正确填写您的手机号码",
	   			},
				province: "请选择省",
	   			city: "请选择市",
	   			detailaddress: "请输入详细地址",
	   			addressalias: "请输入地址别名",
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			}
		});
		$("#basicForm2").validate({
			rules: {
				consignee2: {
	   				required: true,
	   			},
				Phone2: {
	   				required: true,
	   				isMobile: true,
	   			},
				province2: "required",
	   			city2: "required",
	   			detailaddress2: "required",
	   			addressalias2: "required",
				
			},
			messages: {
				consignee2: {
	   				required: "请输入收货人",
	   			},
	   			Phone2: {
	   				required: "请输入您的电话号码",
	   				isMobile: "请正确填写您的手机号码",
	   			},
				province2: "请选择省",
	   			city2: "请选择市",
	   			detailaddress2: "请输入详细地址",
	   			addressalias2: "请输入地址别名",
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