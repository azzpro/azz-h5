var paramCode = JSON.parse(localStorage.getItem('paramCode'));
var flag = JSON.parse(localStorage.getItem('flag'));
Module.define("system.courparam", function(page, $) {
	var paramss = [];
	page.ready = function() {
		toUpdateParams();
		init();
		paramslist();
		getClassificationParent();
		$("#confirm").bind("click", addDeptInfo);
		$("#addParams").bind("click", addParams);
		$("#classifconfirm").bind("click", classifconfirm);
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$('.jdf').remove();
			$('#paramVal').hide();
		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			$("input[name='nameNo']").val('')
			$(".ones").empty();
			$(".toos").empty();
			$(".three").empty();
			getClassificationParent();
		});
		
		if(flag==0){
			$('.ycl').show();
		}else{
			$('.ycl').hide();
		}
		
		//添加隐藏项
		$("input[name='format']").bind("change", function(){
	   	    if($("input[name='format']:checked").val() == 1){
	   	    	$('#paramVal').show();
	   	    }else{
	   	    	$('#paramVal').hide();
	   	    }
   	   	});
   	   	$("#added").click(function(){
   	   		if(!$('#parVal').val()){
   	   			alert('请输入参数值');
   	   			return;
   	   		}
   	   		var shuzi = $('.shuzi')
   	   		for(var i = 0; i<shuzi.length; i++){
   	   			if($('#parVal').val() == shuzi[i].innerHTML){
	   	   			alert('参数值已存在');
	   	   			return;
	   	   		}
   	   		}
		    $("#addParVal").append("<div class='jdf'><div class='shuzi'>"+ $('#parVal').val() +"</div><i class='fa fa-times'></i></div>");
		    
		});
		$("#addParVal").on('click','.fa',function(){
			$(this).parents('.jdf').remove()
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
		
		$("#Search").bind("click", function() {		
			$(".ones").empty();
			$(".toos").empty();
			$(".three").empty();
			getClassificationParent();
		});
		
		
	}
	function addDeptInfo() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		if($("input[name='format']:checked").val() == 1){
			if(!$('.shuzi').html()){
				alert('请新增参数值！')
				return;
			}
		}
		var csmks = 2;
		$.each(paramss,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.paramName== $("input[name='parameName']").val()){
				csmks = 1;
				alert('参数名称已存在！')
				return;
			}
		});
		if(csmks==1) {
			return;
		}
		
		var parVal = [];
		$('.shuzi').each(function(){
			parVal.push($(this).html());
		});
		var Newsobj = {
			"paramName" : $("input[name='parameName']").val(),
			"paramsType" : $("input[name='format']:checked").val(),
			"paramsChoice" : $("input[name='fill']:checked").val(),
			"param" : parVal
		}
		paramss.push(Newsobj);
		$('#myModal').modal('hide');
		$("#paramsData").empty();
		paramslist();
		if(flag==0){
			$('.ycl').show();
		}else{
			$('.ycl').hide();
		}
	}
	
	function paramslist() {
		if(!paramss || !paramss.length){
			nodata = "<tr><td colspan='6' height='30'>表中数据为空</td></tr>";
			$("#paramsData").append(nodata);
		}else{
			var tr = "";
			for(var i = 0;i < paramss.length; i++){
				var paramName = paramss[i].paramName;
				var paramsType = paramss[i].paramsType;
				var paramsChoice = paramss[i].paramsChoice;
				var param = paramss[i].param;
				
				if(paramsType==1){
					var paramsType = '下拉选择'
				}else{
					var paramsType = '参数填写'
				}
				if(paramsChoice==1){
					var paramsChoice = '必填'
				}else{
					var paramsChoice = '选填'
				}
				
				tr += "<tr><td class='text-nowrap'>"+ paramName +"</td>"
				+ "<td class='text-nowrap'>"+ paramsChoice +"</td>"
				+ "<td class='text-nowrap'>"+ paramsType +"</td>"
				+ "<td class='break-word'>"+ param +"</td>"
				+ "<td class='text-nowrap'><a class='ycl' onclick=\"system.courparam.delDeptInfo2(\'" + paramName + "\');\" href='javascript:;'>删除</a></td></tr>";
			}
			$("#paramsData").append(tr);
		}
	}
	page.delDeptInfo2 = function(paramName) {
		$.each(paramss,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.paramName== paramName){
				paramss.splice(index,1);
				$("#paramsData").empty();
				paramslist();
				return false;
			}
		});
	}
	
	//分类列表
	function getClassificationParent() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/getClassificationParent",
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
						li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' onclick=\"system.courparam.getClassificationChild(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
			url: ulrTo+"/azz/api/platform/course/getClassificationChild",
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
							li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' onclick=\"system.courparam.getClassificationChild2(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
			url: ulrTo+"/azz/api/platform/course/getClassificationChild",
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
							li += "<li assortmentCode='" + assortmentCode + "' class='zhengc'>" + assortmentName + "</li>"
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
		var toos = $('.toos li.curr').text();
		var toosAssortmentcode = $('.toos li.curr').attr('assortmentcode');
		var three = $('.three li.curr').text();
		var threeAssortmentcode = $('.three li.curr').attr('assortmentcode');
		//判断li的个数
		var oneslength = $('.ones li.zhengc').length + $('.ones li.curr').length;
		var tooslength = $('.toos li.zhengc').length + $('.toos li.curr').length;
		var threelength = $('.three li.zhengc').length + $('.three li.curr').length;
		if(!ones || !onesAssortmentcode){
			alert('请选择一级分类')  
		}else if(tooslength >= 1){
			if(!toos || !toosAssortmentcode){
				alert('请选择二级分类')
			}else if(threelength >= 1){
				if(!three || !threeAssortmentcode){
					alert('请选择三级分类')
				}else{
					$('#classifname').html(three);
					$('#classifcord').html(threeAssortmentcode);
					$('#myModal2').modal('hide');
				}
			}else{
				/*$('#classifname').html(toos);
				$('#classifcord').html(toosAssortmentcode);
				$('#myModal2').modal('hide');*/
				alert('请选择有三级的分类组');
				return;
			}
		}else{
			/*$('#classifname').html(ones);
			$('#classifcord').html(onesAssortmentcode);
			$('#myModal2').modal('hide');*/
			alert('请选择有三级的分类组');
			return;
		}
		
	}
	
	//修改参数
	function addParams() {
		if(!paramss || !paramss.length){
			alert('请添加参数');
			return false;
		}
		if(!$('#classifcord').html()){
			alert('请选择分类')
			return false;
		}
		
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/updateParams",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					window.location.href = "#!courparam/courparam-management.html";
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function GetJsonData() {
	    var json = {
	        'params': paramss,
			'assortmentCode' :$('#classifcord').html(),
			'parentCode' : paramCode,
			'paramCode' : $('#paramsCode').html()
	    };
	    return json;
	}
	
	//参数详情
	function toUpdateParams() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/toUpdateParams",
			cache: false, //禁用缓存
			async: false,
			data: {
				'code':paramCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var Paramsdata = data.data;
					paramss.splice(0,paramss.length);
					for(var i = 0;i < Paramsdata.length; i++){
						var valuesArr = Paramsdata[i].values;
						if(!valuesArr || !valuesArr.length){
							var values = []
						}else{
							var values = valuesArr.split(',');
						}
						
						var Newsobj2 = {
							"paramName" : Paramsdata[i].paramsName,
							"paramsType" : Paramsdata[i].paramsType,
							"paramsChoice" : Paramsdata[i].paramsChoice,
							"paramParentId" : Paramsdata[i].paramParentId,
							"paramCode" : Paramsdata[i].paramsCode,
							"param" : values
						}
						paramss.push(Newsobj2);
						$('#classifname').html(Paramsdata[0].assortName);
						$('#classifcord').html(Paramsdata[0].assortCode);
						$('#paramsCode').html(Paramsdata[0].paramsCode);
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function init() {
		$("#basicForm").validate({
			rules: {
				parameName: {
					required: true,
				},
				parVal: {
					required: true,
				}
			},
			messages: {
				parameName: {
					required: "请输入参数项名称",
				},
				parVal: {
					required: "请输入参数值",
				}
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