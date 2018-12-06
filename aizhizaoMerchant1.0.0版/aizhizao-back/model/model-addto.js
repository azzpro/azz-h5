Module.define("system.model", function(page, $) {
	var prices = [];
	var params = [];
	var valueArra = [];
	page.ready = function() {
		toAddProduct();
		initValidate();
		getClassificationParent();
		paramslist();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#classifconfirm").bind("click", classifconfirm);
		$("#confirm").bind("click", addDeptInfo);
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$("#Search2").bind("click", function() {		
			$(".ones").empty();
			$(".toos").empty();
			$(".three").empty();
			getClassificationParent();
		});
        
        $("#dianji").on('click','.ones li',function(){
			if($(this).hasClass('zhengc')){  //加
				$(this).addClass('curr');
				$(this).removeClass('zhengc');
				$(this).parents('.col-sm-4').next().find('.toos').show();
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		$("#dianji").on('click','.toos li',function(){
			if($(this).hasClass('zhengc')){  //加
				$(this).addClass('curr');
				$(this).removeClass('zhengc');
				$(this).parents('.col-sm-4').next().find('.three').show();
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		$("#dianji").on('click','.three li',function(){
			if($(this).hasClass('zhengc')){  //加
				$(this).addClass('curr');
				$(this).removeClass('zhengc');
				$(this).siblings().addClass('zhengc');
			}
		})
		
		$('#myModal3').on('hidden.bs.modal', function(e){
			$('#basicForm2')[0].reset();
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
		
	}
	$('.paramePrice').keyup(function() {
		$(this).val($(this).val().replace(/[^\d.]/g,""));
	});
	$('.paramePrice').blur(function() {
	    var money = $(this).val() - 0.0;
	    $(this).val(money.toFixed(2));
	});
	
	$('.valuess').keyup(function() {
		$(this).val($(this).val().replace(/[^\d.]/g,""));
	});
	$('.valuess').blur(function() {
	    var money = $(this).val() - 0.0;
	    $(this).val(money.toFixed(2));
	});
	//新增价格
	function addDeptInfo() {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}

		var Newsobj = {
			"deliveryDate" : $("input[name='delivery']").val(),
			"price" : $("input[name='paramePrice']").val()
		}
		prices.push(Newsobj);
		
		$('#myModal3').modal('hide');
		$("#priceData").empty();
		paramslist();
	}
	
	//价格列表
	function paramslist() {
		if(!prices || !prices.length){
			nodata = "<tr><td colspan='5' height='30'>表中数据为空</td></tr>";
			$("#priceData").append(nodata);
		}else{
			var tr = "";
			for(var i = 0;i < prices.length; i++){
				var deliveryDate = prices[i].deliveryDate;
				var price = prices[i].price;
				tr += "<tr><td>"+ deliveryDate +"</td>"
				+ "<td>"+ price +"</td>"
				+ "<td><a onclick=\"system.model.delDeptInfo2(\'" + deliveryDate + "\');\" href='javascript:;'>删除</a></td></tr>";
			}
			$("#priceData").append(tr);
		}
	}
	page.delDeptInfo2 = function(deliveryDate) {
		$.each(prices,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.deliveryDate== deliveryDate){
				prices.splice(index,1);
				$("#priceData").empty();
				paramslist();
				return false;
			}
		});
	}
	
	//所属品牌
	function toAddProduct() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/toAddProduct",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var arr = [];
					var brands = data.data.brands;
					for(var i = 0, len = brands.length; i < len; i++) {
						arr.push('<option value="');
						arr.push(brands[i].brandId);
						arr.push('">');
						arr.push(brands[i].brandName);
						arr.push('</option>');
					}
					$("#brandname").html(arr.join(''));
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//分类列表
	function getClassificationParent() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/classification/getClassificationParent",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'param': $("input[name='nameNo']").val()
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					for(var i = 0;i<data.length;i++){
						var assortmentCode = data[i].assortmentCode;
						var assortmentName = data[i].assortmentName;
						var assortmentId = data[i].id;
						li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' onclick=\"system.model.getClassificationChild(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
				    }
					$(".ones").append(li);
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.getClassificationChild = function(assortmentCode) {
		$('.toos').empty();
		$('.three').empty();
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/classification/getClassificationChild",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'parentCode': assortmentCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					if(!data || !data.length){
						li += "<li>无任何分类</li>";
						$(".toos").append(li);
					}else{
						for(var i = 0;i<data.length;i++){
							var assortmentCode = data[i].assortmentCode;
							var assortmentName = data[i].assortmentName;
							var assortmentId = data[i].id;
							li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' onclick=\"system.model.getClassificationChild2(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
					    }
						$(".toos").append(li);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.getClassificationChild2 = function(assortmentCode) {
		$('.three').empty();
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/classification/getClassificationChild",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'parentCode': assortmentCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					if(!data || !data.length){
						li += "<li>无任何分类</li>";
						$(".three").append(li);
					}else{
						for(var i = 0;i<data.length;i++){
							var assortmentCode = data[i].assortmentCode;
							var assortmentName = data[i].assortmentName;
							var assortmentId = data[i].id;
							li += "<li assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' class='zhengc'>" + assortmentName + "</li>"
					    }
						$(".three").append(li);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//添加分类
	function classifconfirm() {
		var ones = $('.ones li.curr').text();
		var onesAssortmentcode = $('.ones li.curr').attr('assortmentcode');
		var onesassortmentId = $('.ones li.curr').attr('assortmentId');
		var toos = $('.toos li.curr').text();
		var toosAssortmentcode = $('.toos li.curr').attr('assortmentcode');
		var toosassortmentId = $('.toos li.curr').attr('assortmentId');
		var three = $('.three li.curr').text();
		var threeAssortmentcode = $('.three li.curr').attr('assortmentcode');
		var threeassortmentId = $('.three li.curr').attr('assortmentId');
		//判断li的个数
		var oneslength = $('.ones li.zhengc').length + $('.ones li.curr').length;
		var tooslength = $('.toos li.zhengc').length + $('.toos li.curr').length;
		var threelength = $('.three li.zhengc').length + $('.three li.curr').length;
		if(!ones || !onesAssortmentcode){
			alert('请选择一级分类');
			return;
		}else if(tooslength >= 1){
			if(!toos || !toosAssortmentcode){
				alert('请选择二级分类');
				return;
			}else if(threelength >= 1){
				if(!three || !threeAssortmentcode){
					alert('请选择三级分类');
					return;
				}else{
					$('#classifname').html(three);
					$('#classifcord').html(threeAssortmentcode);
					$('#assortmentId').html(threeassortmentId);
					$('#myModal').modal('hide');
				}
			}else{
				$('#classifname').html(toos);
				$('#classifcord').html(toosAssortmentcode);
				$('#assortmentId').html(toosassortmentId);
				$('#myModal').modal('hide');
			}
		}else{
			$('#classifname').html(ones);
			$('#classifcord').html(onesAssortmentcode);
			$('#assortmentId').html(onesassortmentId);
			$('#myModal').modal('hide');
		}
		$('#parameterData').empty();
		getPrams();
		initDataTable();
		dataTable.ajax.reload();
	}
	//获取参数
	function getPrams() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/getPrams",
			cache: false, //禁用缓存   
			async: false,
			data: {
				'assortmentId': $('#assortmentId').html()
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					if(data.data.pvs == null){
						nodata = "<tr><td colspan='5' height='30'>表中数据为空</td></tr>";
						$("#parameterData").append(nodata);
					}else{
						var tr = "";
						for(var i = 0;i < data.data.pvs.length; i++){
							var paramName = data.data.pvs[i].paramName;
							var paramsType = data.data.pvs[i].type;
							var paramsChoice = data.data.pvs[i].choice;
							
							if(paramsType==1){
								
								var arr2 = [];
								var values = data.data.pvs[i].values;
								arr2.push('<select class="select_card valuess" name="dropdown">');
								for(var y = 0, len2 = values.length; y < len2; y++) {
									arr2.push('<option value="');
									arr2.push(values[y]);
									arr2.push('">');
									arr2.push(values[y]);
									arr2.push('</option>');
								}
								arr2.push('</select>');
								var paramsType =arr2.join('');
								
							}else{
								if(paramsChoice==1){
									var paramsType = '<input type="text" maxlength="" name="btd" class="valuess">'
								}else{
									var paramsType = '<input type="text" maxlength="" name="" class="valuess">'
								}
								
							}
							if(paramsChoice==1){
								var paramsChoice = '必填'
							}else{
								var paramsChoice = '选填'
							}
							tr += "<tr><td>"+ paramName +"</td>"
							+ "<td>"+ paramsChoice +"</td>"
							+ "<td>"+ paramsType +"</td></tr>";
							
							var Newsobj2 = {
								"paramName" : paramName,
								"values" : 0,
								"type" : data.data.pvs[i].type,
								'choice' : data.data.pvs[i].choice,
								'termId' : data.data.pvs[i].termId,
							}
							params.push(Newsobj2);
						}
						$("#parameterData").append(tr);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//增加产品
	function submitForm() {
		var valuess = $('.valuess');
		for(var i = 0;i < valuess.length; i++){
			valueArra.push(valuess[i].value);
		}
		
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		
		if(!$("#classifcord").html()){
			alert('请选择分类');
			return;
		}
		
		if(!prices || !prices.length){
			alert('请添加产品价格');
			return;
		}
		
		for(var i = 0 ; i < valueArra.length;i++){
	    	params[i].values = valueArra[i];
	    }
		
	    $.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/addProduct",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					alert('新增产品成功！');
					window.location.href = "#!model/model-management.html";
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function GetJsonData() {
	    var json = {
	        'assortmentId': $('#assortmentId').html(),
			'productCode' : $("input[name='modelname']").val(),
			'brandId' : $('#brandname').val(),
			'status' : $("input[name='fill']:checked").val(),
			'moduleId' : $('#moduleID').html(),
			'prices' : prices,
			'merchantId' : merchantUserInfo.merchantId,
			'params' : params,
			
	    };
	    return json;
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
				param.param = $("input[name='searchname']").val();
				param.assortmentId = $('#assortmentId').html();
				param.merchantId = merchantUserInfo.merchantId;
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/product/getModule",
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
					"title": "模组名称",
					"data": "moduleName",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "模组编号",
					"data": "moduleCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.moduleStatus) {
							case 1:
								return '上架';
								break;
							case 2:
								return '下架';
								break;
						};
					}
				},
				{
					"title": "操作",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a onclick="system.model.Select(\'' + row.moduleName + "','"+ row.moduleId + '\');" class="btn btn-primary zlan" href="javascript:;">选中</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	page.Select = function(moduleName,moduleId) {
		$('#modulename').html(moduleName);
		$('#moduleID').html(moduleId);
		$('#myModal2').modal('hide');
	}
	
	function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			modelname: "required",
   			brandname: "required",
   			btd: "required",
   		},
   		messages: {
   			modelname: "请输入产品编号",
   			brandname: "请选择品牌",
   			btd: "必填项",
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
   			delivery: "required",
   			paramePrice: "required",
   		},
   		messages: {
   			delivery: "请输入交期",
   			paramePrice: "请输入价格",
   		},
   		highlight: function(element) {
   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
   		},
   		success: function(element) {
   			$(element).closest('.form-group').removeClass('has-error');
   		}
   	});
   }
});