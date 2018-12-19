Module.define("system.model", function(page, $) {
	var items = [];
	var params = [];
	page.ready = function() {
		/*initValidate();*/
		toAddProduct();
		getClassificationParent();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#classifconfirm").bind("click", classifconfirm);
		$("#Search2").bind("click", function() {		
			$(".ones").empty();
			$(".toos").empty();
			$(".three").empty();
			getClassificationParent();
		});
		$("#addBtn").bind("click", function() {
			if(!$("#classifcord").html()){
				alert('请先选择分类');
				return;
			}
			$("#parameterData").append($("#parameterData tr").eq(0).clone());
			$("#parameterData tr:last").find(".brandname .select2").remove();
			$("#parameterData tr:last").find(".Eliminate .select2").remove();
			$("#parameterData tr:last").find("input").val('');
			toAddProduct();
			$('.paramePrice').keyup(function() {
				var value = $(this).val();
				//先把非数字的都替换掉，除了数字和.
				value = value.replace(/[^\d.]/g,"");
				//保证只有出现一个.而没有多个.
				value = value.replace(/\.{2,}/g,".");
				//必须保证第一个为数字而不是.
				value = value.replace(/^\./g,"");
				//保证.只出现一次，而不能出现两次以上
				value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
				//只能输入两个小数
				value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
				
				$(this).val(value);
			});
		});
		$("#parameterData").on('click','.fa-minus-circle',function(){
			$(this).parents('tr').remove();
		})
        
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
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		
	}
	
	$('.paramePrice').keyup(function() {
		var value = $(this).val();
		//先把非数字的都替换掉，除了数字和.
		value = value.replace(/[^\d.]/g,"");
		//保证只有出现一个.而没有多个.
		value = value.replace(/\.{2,}/g,".");
		//必须保证第一个为数字而不是.
		value = value.replace(/^\./g,"");
		//保证.只出现一次，而不能出现两次以上
		value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
		//只能输入两个小数
		value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
		
		$(this).val(value);
	});
	
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
				/*$('#classifname').html(toos);
				$('#classifcord').html(toosAssortmentcode);
				$('#assortmentId').html(toosassortmentId);
				$('#myModal').modal('hide');*/
				alert('请选择有三级的分类组');
				return;
				
			}
		}else{
			/*$('#classifname').html(ones);
			$('#classifcord').html(onesAssortmentcode);
			$('#assortmentId').html(onesassortmentId);
			$('#myModal').modal('hide');*/
			alert('请选择有三级的分类组');
			return;
		}
		$(".Eliminate").remove();
		getPrams();
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
					if(!data.data.pvs || !data.data.pvs.length){
						$("#parameterDataNO").show();
						$("#parameterData").hide();
						$("#parameterDataNot").hide();
					}else{
						$("#parameterDataNO").hide();
						$("#parameterData").show();
						$("#parameterDataNot").hide();
						
						var tr = "";
						var th = "";
						for(var i = 0;i < data.data.pvs.length; i++){
							var paramName = data.data.pvs[i].paramName;
							var paramsType = data.data.pvs[i].type;
							var paramsChoice = data.data.pvs[i].choice;
							
							if(paramsType==1){
								
								var arr2 = [];
								var values = data.data.pvs[i].values;
								arr2.push('<select class="select_card form-control valuess" data-placeholder="请选择参数" name="dropdown">');
								/*arr2.push('<option value="">请选择参数</option>');*/
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
								var paramsChoice = "<span class='hong'>*</span> "
							}else{
								var paramsChoice = ''
							}
							
							th += "<th class='Eliminate'>"+ paramsChoice + paramName +"</th>";
							tr += "<td class='Eliminate'>"+ paramsType +"</td>";
							
							var Newsobj2 = {
								"paramName" : paramName,
								"values" : 0,
								"type" : data.data.pvs[i].type,
								'choice' : data.data.pvs[i].choice,
								'termId' : data.data.pvs[i].termId,
							}
							params.push(Newsobj2);
						}
						$(".parameterDataTD").append(tr);
						$("#importBT").append(th);
						// select_card
						$(".select_card").select2({
							width: '100%',
							minimumResultsForSearch: -1
						});
					}
				} else {
					alert(data.msg)
				}
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
					arr.push('<select class="select_card form-control brandnameVal" name="" data-placeholder="请选择品牌">');
					arr.push('<option value="">请选择品牌</option>');
					for(var i = 0, len = brands.length; i < len; i++) {
						arr.push('<option value="');
						arr.push(brands[i].brandId);
						arr.push('">');
						arr.push(brands[i].brandName);
						arr.push('</option>');
					}
					arr.push('</select>');
					$(".brandname").not(":has(option)").html(arr.join(''));
					// select_card
					$(".select_card").select2({
						width: '100%',
						minimumResultsForSearch: -1
					});
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//增加产品
	function submitForm() {
		
		if(!$("#classifcord").html()){
			alert('请选择分类');
			return;
		}
		items.splice(0,items.length);
		var parameterData = $('#parameterData').find("tr");
		for(var i = 0;i < parameterData.length; i++){
			var paramsval = [];
			var eliminate = $(parameterData[i]).find('.Eliminate');
			for(var y = 0;y < eliminate.length; y++){
				var Newsobj3 = {
					"paramName" : params[y].paramName,
					"values" : $(eliminate[y]).find('.valuess').val(),
					"type" : params[y].type,
					'choice' : params[y].choice,
					'termId' : params[y].termId,
				}
				paramsval.push(Newsobj3);
			}
			var Newsobj = {
				"productCode" : $(parameterData[i]).find('.procode').val(),
				"brandId" : $(parameterData[i]).find('.brandnameVal').val(),
				"deliveryDate" : $(parameterData[i]).find('.delivery').val(),
				'price' : $(parameterData[i]).find('.paramePrice').val(),
				'params' : paramsval,
			}
			items.push(Newsobj);
		}
	    $.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/batchAddProduct",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					alert('产品批量导入成功！');
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
			'items' : items,
	    };
	    return json;
	}
	/*function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			procode: "required",
   			brandname: "required",
   			delivery: "required",
   			price: "required",
   			btd: "required",
   		},
   		messages: {
   			procode: "请输入产品编码",
   			brandname: "请选择品牌",
   			delivery: "请输入交期",
   			price: "请输入价格",
   			btd: "必填项",
   		},
   		highlight: function(element) {
   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
   		},
   		success: function(element) {
   			$(element).closest('.form-group').removeClass('has-error');
   		}
   	});
   
   }*/
	
	// select_card
	$(".select_card").select2({
		width: '100%',
		minimumResultsForSearch: -1
	});
});