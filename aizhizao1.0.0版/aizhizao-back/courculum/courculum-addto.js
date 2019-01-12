Module.define("system.courculum", function(page, $) {
	var prices = [];
	var params = [];
	var valueArra = [];
	page.ready = function() {
		toAddProduct();
		getClassificationParent();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#classifconfirm").bind("click", classifconfirm);
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
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		$("#file").change(function(){
			$("#pic").show();
		    $("#pic").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		var E = window.wangEditor;
        page.editor = new E('#editor');
        page.editor.customConfig.uploadImgShowBase64 = true;
        page.editor.create();
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
			url: ulrTo+"/azz/api/merchant/product/getClassificationParent",
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
						li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' onclick=\"system.courculum.getClassificationChild(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
			url: ulrTo+"/azz/api/merchant/product/getClassificationChild",
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
							li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' onclick=\"system.courculum.getClassificationChild2(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
			url: ulrTo+"/azz/api/merchant/product/getClassificationChild",
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
		$('#parameterData').empty();
		getPrams();
		initDataTable();
		dataTable.ajax.reload();
	}
	//获取参数
	function getPrams() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/toUpdateParams",
			cache: false, //禁用缓存   
			async: false,
			data: {
				'code': $('#classifcord').html()
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
						
						$('.valuess').keyup(function() {
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
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//增加产品
	function submitForm() {
		valueArra.splice(0,valueArra.length);
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
	        'classificationCode': $('#classifcord').html(),
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
   }
});