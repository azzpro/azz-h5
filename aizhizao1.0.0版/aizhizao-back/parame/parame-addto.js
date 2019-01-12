Module.define("system.parame", function(page, $) {
	var paramss = [];
	page.ready = function() {
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
   	   		var shuzi = $('.shuzi');
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
			"paramsHidden" : $("input[name='selection']:checked").val(),
			"param" : parVal
		}
		paramss.push(Newsobj);
		
		$('#myModal').modal('hide');
		$("#paramsData").empty();
		paramslist();
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
				var paramsHidden = paramss[i].paramsHidden;
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
				if(paramsHidden == 0){
					var paramsHiddenT = '隐藏';
					var showhide = "<a onclick=\"system.parame.showhide1(\'" + paramName + "\');\" href='javascript:;'>使用</a>"
				}else{
					var paramsHiddenT = '使用';
					var showhide = "<a onclick=\"system.parame.showhide2(\'" + paramName + "\');\" href='javascript:;'>隐藏</a>"
				}
				tr += "<tr><td class='text-nowrap'>"+ paramName +"</td>"
				+ "<td class='text-nowrap'>"+ paramsChoice +"</td>"
				+ "<td class='text-nowrap'>"+ paramsType +"</td>"
				+ "<td class='text-nowrap'>"+ paramsHiddenT +"</td>"
				+ "<td class='break-word'>"+ param +"</td>"
				+ "<td class='text-nowrap'>"+ showhide +"&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.parame.delDeptInfo2(\'" + paramName + "\');\" href='javascript:;'>删除</a></td></tr>";
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
	page.showhide1 = function(paramName) {
		$.each(paramss,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.paramName== paramName){
				item.paramsHidden = '1';
				$("#paramsData").empty();
				paramslist();
				return false;
			}
		});
	}
	page.showhide2 = function(paramName) {
		$.each(paramss,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.paramName== paramName){
				item.paramsHidden = '0';
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
						li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' onclick=\"system.parame.getClassificationChild(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
							li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' onclick=\"system.parame.getClassificationChild2(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
	
	//添加参数
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
			url: ulrTo+"/azz/api/merchant/addParams",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					window.location.href = "#!parame/parame-management.html";
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function GetJsonData() {
	    var json = {
	        'params': paramss,
			'assortmentCode' :$('#classifcord').html()
	    };
	    return json;
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