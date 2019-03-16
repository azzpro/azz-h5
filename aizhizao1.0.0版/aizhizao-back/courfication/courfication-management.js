Module.define("system.courfication", function(page, $) {
	page.ready = function() {
		init();
		getClassificationList();
		$("#confirm").bind("click", addClassification);
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			$("#tabs").empty();
			getClassificationList();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$("#img1").attr("src",'');
		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$("#img2").attr("src",'');
		});
		
		$("#Search").bind("click", function() {
			$("#tabs").empty();
			getClassificationList();
		});
		
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$("#file2").change(function(){
		    $("#img2").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$("#tabs").on('click','.jia',function(){
			if($(this).hasClass('fa-plus-square-o')){  //加
				$(this).addClass('fa-minus-square-o');
				$(this).removeClass('fa-plus-square-o');
				$(this).parents('li').nextAll('.tab2').show();
				/*$(this).parents('.tab').siblings().find('.jia').addClass('fa-plus-square-o');*/
			}else{   //减
				$(this).addClass('fa-plus-square-o');
				$(this).removeClass('fa-minus-square-o');
				$(this).parents('li').nextAll('.tab2').hide();
			}
		})
		$("#tabs").on('click','.jia2',function(){
			if($(this).hasClass('fa-plus-square-o')){  //加
				$(this).addClass('fa-minus-square-o');
				$(this).removeClass('fa-plus-square-o');
				$(this).parents('li').nextAll('.tab3').show();
				/*$(this).parents('.tab2').siblings().find('.jia2').addClass('fa-plus-square-o');*/
			}else{   //减
				$(this).addClass('fa-plus-square-o');
				$(this).removeClass('fa-minus-square-o');
				$(this).parents('li').nextAll('.tab3').hide();
			}
		})
	}

	function addClassification() {
	   	var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var assortmentParentCode=$("input[name='classificationcode']").val();
		if(assortmentParentCode){
			var assortmentParentCode = $("input[name='classificationcode']").val()
		}else{
			var assortmentParentCode = 0
		}
	   	var file1 = document.basicForm.file1.files[0];
			
		var fm = new FormData();
		fm.append('assortmentParentCode', assortmentParentCode);
		fm.append('assortmentName', $("input[name='classificationname']").val());
		fm.append('assortmentSort', $("input[name='classificationsort']").val());
		fm.append('classificationFile', file1);
		/*if(!file2){}else{fm.append('tradingCertificateFiles[1]', file2);}*/
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/course/addClassification',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		$("#tabs").empty();
					getClassificationList();
					$('#myModal').modal('hide');
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	function getClassificationList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/getClassificationList",
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
						var assortmentPicUrl = data[i].classificationPicUrl;
						var assortmentCode = data[i].classificationCode;
						var assortmentName = data[i].classificationName;
						var assortmentSort = data[i].sort;
						var createTime = data[i].createTime;
						if(data[i].childList==null || !data[i].childList.length!=0){
							
							li += "<ul class='tab'><li class='tab-li'><span><i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span>"
							+ "<span>" + assortmentCode +"</span>"
							+ "<span>" + assortmentName +"</span>"
							+ "<span>" + assortmentSort +"</span>"
							+ "<span>" + '-' +"</span>"
							+ "<span>" + createTime +"</span>"
							+ "<span><a onclick=\"system.courfication.editDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.courfication.delDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>删除</a></span></li>"
							+ "</ul>";
						}else{
							var lii = "";
							for(var j = 0;j < data[i].childList.length;j++){
								var assortmentPicUrl2 = data[i].childList[j].classificationPicUrl;
								var assortmentCode2 = data[i].childList[j].classificationCode;
								var assortmentName2 = data[i].childList[j].classificationName;
								var assortmentSort2 = data[i].childList[j].sort;
								var createTime2 = data[i].childList[j].createTime;
								if(data[i].childList[j].childList==null || !data[i].childList[j].childList.length!=0){
									lii += "<ul class='add tab2' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl2 +" width='48' height='48' alt='' /></span>"
									+ "<span>" + assortmentCode2 +"</span>"
									+ "<span>" + assortmentName2 +"</span>"
									+ "<span>" + assortmentSort2 +"</span>"
									+ "<span>" + '-' +"</span>"
									+ "<span>" + createTime2 +"</span>"
									+ "<span><a onclick=\"system.courfication.editDeptInfo(\'" + assortmentCode2 + "','" + assortmentName2 + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.courfication.delDeptInfo(\'" + assortmentCode2 + "','" + assortmentName2 + "\');\" href='javascript:;'>删除</a></span></li>"
									+ "</ul>";
								}else{
									var liii = "";
									for(var f = 0;f < data[i].childList[j].childList.length;f++){
										var assortmentPicUrl3 = data[i].childList[j].childList[f].classificationPicUrl;
										var assortmentCode3 = data[i].childList[j].childList[f].classificationCode;
										var assortmentName3 = data[i].childList[j].childList[f].classificationName;
										var assortmentSort3 = data[i].childList[j].childList[f].sort;
										var createTime3 = data[i].childList[j].childList[f].createTime;
										liii += "<ul class='add tab3' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl3 +" width='48' height='48' alt='' /></span>"
										+ "<span>" + assortmentCode3 +"</span>"
										+ "<span>" + assortmentName3 +"</span>"
										+ "<span>" + assortmentSort3 +"</span>"
										+ "<span>" + '-' +"</span>"
										+ "<span>" + createTime3 +"</span>"
										+ "<span><a onclick=\"system.courfication.editDeptInfo(\'" + assortmentCode3 + "','" + assortmentName3 + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.courfication.delDeptInfo(\'" + assortmentCode3 + "','" + assortmentName3 + "\');\" href='javascript:;'>删除</a></span></li>"
										+ "</ul>";
									}
									lii += "<ul class='add tab2' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-plus-square-o jia2'></i> <img src=" + assortmentPicUrl2 +" width='48' height='48' alt='' /></span>"
									+ "<span>" + assortmentCode2 +"</span>"
									+ "<span>" + assortmentName2 +"</span>"
									+ "<span>" + assortmentSort2 +"</span>"
									+ "<span>" + '-' +"</span>"
									+ "<span>" + createTime2 +"</span>"
									+ "<span><a onclick=\"system.courfication.editDeptInfo(\'" + assortmentCode2 + "','" + assortmentName2 + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.courfication.delDeptInfo(\'" + assortmentCode2 + "','" + assortmentName2 + "\');\" href='javascript:;'>删除</a></span></li>"
									+ liii
									+ "</ul>";
								}
								
							}
							
							li += "<ul class='tab'><li class='tab-li'><span><i class='fa fa-plus-square-o jia'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span>"
							+ "<span>" + assortmentCode +"</span>"
							+ "<span>" + assortmentName +"</span>"
							+ "<span>" + assortmentSort +"</span>"
							+ "<span>" + '-' +"</span>"
							+ "<span>" + createTime +"</span>"
							+ "<span><a onclick=\"system.courfication.editDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.courfication.delDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>删除</a></span></li>"
							+ lii
							+ "</ul>";
							
						}
				    }
					$("#tabs").append(li);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//编辑
	page.editDeptInfo = function(assortmentCode,assortmentName) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/getClassificationInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'assortmentCode': assortmentCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='classificationcode2']").val(data.data.classificationParentCode);
					$("input[name='classificationname2']").val(data.data.classificationName);
					$("input[name='classificationsort2']").val(data.data.sort);
					
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.courfication.editDeptInfotoo(\'" + assortmentCode + "\');")
	}
	
	page.editDeptInfotoo = function(assortmentCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
				return;
		}
	   	var file2 = document.basicForm2.file2.files[0];
	   	if(!file2){
	   		var isEditPic = 0
	   	}else{
	   		var isEditPic = 1
	   	}
			
		var fm = new FormData();
		fm.append('assortmentCode', assortmentCode);
		fm.append('assortmentParentCode', $("input[name='classificationcode2']").val());
		fm.append('assortmentName', $("input[name='classificationname2']").val());
		fm.append('assortmentSort', $("input[name='classificationsort2']").val());
		if(!file2){}else{fm.append('classificationFile', file2);}
		fm.append('isEditPic', isEditPic);
		
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/course/editClassification',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		$("#tabs").empty();
					getClassificationList();
					$('#myModal2').modal('hide');
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//删除
	page.delDeptInfo = function(assortmentCode,assortmentName) {
		$('#bmName').html(assortmentName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.courfication.delDeptInfotoo(\'" + assortmentCode + "\');")
	}
	
	page.delDeptInfotoo = function(assortmentCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/delClassification",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'assortmentCode': assortmentCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("#tabs").empty();
					getClassificationList();
					$('#myModal112').modal('hide');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function init() {
		$("#basicForm").validate({
			rules: {
				classificationname: {
					required: true,
				},
				file: "required",
			},
			messages: {
				classificationname: {
					required: "请输入分类名称",
				},
				file: "请上传分类主图",
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
				classificationname2: {
					required: true,
				}
			},
			messages: {
				classificationname2: {
					required: "请输入分类名称",
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
	
});