Module.define("system.module", function(page, $) {
	KindEditor.ready(function(K) {
        window.editor = K.create('#editor_id');
        editor.sync();
    });
	page.ready = function() {
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
			
		var fm = new FormData();
		fm.append('merchantCode', merchantUserInfo.merchantCode);
		fm.append('assortmentCode', $("#classifcord").html());
		fm.append('moduleName', $("input[name='modulename']").val());
		fm.append('moduleStatus', $("input[name='fill']:checked").val());
		fm.append('goodsModulePicFile', file1);
		fm.append('moduleInfo', editor.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/merchant/goodsModule/addGoodsModule',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('新增模组成功！');
	        		window.location.href = "#!module/module-management.html";
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			modulename: "required",
   			file: "required",
   		},
   		messages: {
   			modulename: "请输入模组名称",
   			file: "请上传模组主图",
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