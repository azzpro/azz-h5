Module.define("system.courbrand", function(page, $) {
	page.ready = function() {
		initDataTable();
		init();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		
		var E = window.wangEditor;
        page.editor = new E('#editor');
        page.editor.customConfig.uploadImgShowBase64 = true;
        page.editor.create();
        
        var E2 = window.wangEditor;
        page.editor2 = new E2('#editor2');
        page.editor2.customConfig.uploadImgShowBase64 = true;
        page.editor2.create();
        
		$("#confirm").bind("click", addGoodsBrand);
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$("#file2").change(function(){
		    $("#img2").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$("#img1").attr("src",'');
			page.editor.txt.html("")

		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$("#img2").attr("src",'');

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
				param.searchInput = $("input[name='searchname']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/course/getBrandInfoList",
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
					"title": "品牌主图",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var img = '<img src=' + row.brandPicUrl +' width="45" height="45" alt="" />';
						return img;
					}
				}, // 序号
				{
					"title": "品牌编号",
					"data": "brandCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "品牌名称",
					"data": "brandName",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "品牌简介",
					"data": "brandDescription",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "课程数量",
					"data": "createTime",
					"className": "text-nowrap",
					"defaultContent": "无"
				},
				{
					"title": "创建时间",
					"data": "createTime",
					"className": "text-nowrap",
					"defaultContent": "无"
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a href="javascript:;" onclick="system.courbrand.editDeptInfo(\'' + row.brandCode + '\');">编辑</a>';
		            		html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.courbrand.delDeptInfo(\'' + row.brandCode + "','"+ row.brandName + '\');">删除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
						}
		            }
				}
			],
		});
	}
	
	//添加
	function addGoodsBrand() {
	   	var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		if(!page.editor.txt.text()){
			alert('请输入品牌详情');
			return;
		}
	   	var file1 = document.basicForm.file1.files[0];
			
		var fm = new FormData();
		fm.append('brandName', $("input[name='brandName']").val());
		fm.append('brandInfo', page.editor.txt.html());
		fm.append('brandDescription', $("textarea[name='brandDescription']").val());
		fm.append('brandPicFile', file1);
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/course/addBrand',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		dataTable.ajax.reload();
					$('#myModal').modal('hide');
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//编辑
	page.editDeptInfo = function(brandCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/getBrandInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'brandCode': brandCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='brandName2']").val(data.data.brandName);
					$("textarea[name='brandDescription2']").val(data.data.brandDescription);
					page.editor2.txt.html(data.data.brandInfo);
					
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.courbrand.editDeptInfotoo(\'" + brandCode + "\');")
	}
	
	page.editDeptInfotoo = function(brandCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
				return;
		}
		if(!page.editor2.txt.text()){
			alert('请输入品牌详情');
			return;
		}
	   	var file2 = document.basicForm2.file2.files[0];
	   	if(!file2){
	   		var isChangeGoodsBrandPic = 0
	   	}else{
	   		var isChangeGoodsBrandPic = 1
	   	}
			
		var fm = new FormData();
		fm.append('brandCode', brandCode);
		fm.append('brandName', $("input[name='brandName2']").val());
		fm.append('brandInfo', page.editor2.txt.html());
		fm.append('brandDescription', $("textarea[name='brandDescription2']").val());
		if(!file2){}else{fm.append('brandPicFile', file2);}
		fm.append('isChangeGoodsBrandPic', isChangeGoodsBrandPic);
		
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/course/editBrand',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		dataTable.ajax.reload();
	        		$('#myModal2').modal('hide');
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//删除
	page.delDeptInfo = function(brandCode,brandName) {
		$('#bmName').html(brandName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.courbrand.delDeptInfotoo(\'" + brandCode + "\');")
	}
	
	page.delDeptInfotoo = function(brandCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/delBrand",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'brandCode': brandCode
			},
			success: function(data) {
				if (data.code == 0) {
					dataTable.ajax.reload();
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
				brandName: {
					required: true,
				},
				file: "required",
			},
			messages: {
				brandName: {
					required: "请输入品牌名称",
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
				brandName2: {
					required: true,
				}
			},
			messages: {
				brandName2: {
					required: "请输入品牌名称",
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