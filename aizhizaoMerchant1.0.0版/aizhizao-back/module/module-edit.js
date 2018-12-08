Module.define("system.module", function(page, $) {
	var param = getRequest();
	var moduleCode = param["moduleCode"];
	page.ready = function() {
		page.editor = KindEditor.create('#editor_id');
	    page.editor.sync();
	    
		getGoodModuleInfo();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#classifconfirm").bind("click", classifconfirm);
		initValidate();
		getClassificationParent();
        
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
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
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
						li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' onclick=\"system.module.getClassificationChild(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
							li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' onclick=\"system.module.getClassificationChild2(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
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
					$('#myModal').modal('hide');
				}
			}else{
				/*$('#classifname').html(toos);
				$('#classifcord').html(toosAssortmentcode);
				$('#myModal').modal('hide');*/
				alert('请选择有三级的分类组');
				return;
			}
		}else{
			/*$('#classifname').html(ones);
			$('#classifcord').html(onesAssortmentcode);
			$('#myModal').modal('hide');*/
			alert('请选择有三级的分类组');
			return;
		}
		
	}
	
	function submitForm() {
	   	var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		if(!$("#classifcord").html()){
			alert('请选择分类');
			return;
		}
		if(!editor.html()){
			alert('请输入模组详情');
			return;
		}
		
	   	var file1 = document.basicForm.file1.files[0];
		if(!file1){
	   		var isEditPic = 0
	   	}else{
	   		var isEditPic = 1
	   	}
		var fm = new FormData();
		fm.append('moduleCode', moduleCode);
		fm.append('merchantCode', merchantUserInfo.merchantCode);
		fm.append('assortmentCode', $("#classifcord").html());
		fm.append('moduleName', $("input[name='modulename']").val());
		fm.append('moduleStatus', $("input[name='fill']:checked").val());
		if(!file1){}else{fm.append('goodsModulePicFile', file1);}
		fm.append('isChangeGoodsModulePic', isEditPic);
		fm.append('moduleInfo', editor.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/merchant/goodsModule/editGoodsModule',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('编辑模组成功！');
	        		window.location.href = "#!module/module-management.html";
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//详情
	function getGoodModuleInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/goodsModule/getGoodModuleInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'moduleCode': moduleCode,
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					editor.html(data.moduleInfo);
					$("input[name='modulename']").val(data.moduleName);
					$('#classifname').html(data.classificationName);
					$('#classifcord').html(data.assortmentCode);
					if(data.moduleStatus == 1) {
						$("#Required").attr("checked", "checked");
					}else if(data.moduleStatus == 2){
						$("#Selection").attr("checked", "checked");
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			modulename: "required",
   		},
   		messages: {
   			modulename: "请输入模组名称",
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