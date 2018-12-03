Module.define("system.picture", function(page, $) {
	page.ready = function() {
		init();
		initDataTable();
		$("#confirm").bind("click", addColumn);
		$("#modifyconfirm").bind("click", editColumn);
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$("#file2").change(function(){
		    $("#img2").attr("src",URL.createObjectURL($(this)[0].files[0]));
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
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/index/getImageList",
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
					"title": "图片",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var img = '<img src=' + row.picUrl +' width="60" height="60" alt="" />';
						return img;
					}
				}, // 序号
				{
					"title": "跳转链接",
					"data": "jumpLink",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "所属栏目",
					"data": "columnName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "创建人",
					"data": "creator",
					"className": "text-nowrap",
					"defaultContent": "-",
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
	            			html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.picture.getColumnInfo(\'' + row.imageId + '\');">编辑</a>';
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.picture.delDeptInfo(\'' + row.imageId + '\');">删除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	//删除
	page.delDeptInfo = function(imageId) {
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.picture.delDeptInfotoo(\'" + imageId + "\');")
	}
	page.delDeptInfotoo = function(imageId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/index/delImage",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'imageId': imageId,
			},
			success: function(data) {
				if (data.code == 0) {
					dataTable.ajax.reload();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//增加
	function addColumn() {
	   	var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		
	   	var file1 = document.basicForm.file1.files[0];
			
		var fm = new FormData();
		fm.append('indexColumnId', $("#subordinate").val());
		fm.append('jumpLink', $("input[name='jumplink']").val());
		fm.append('mainPicture', file1)
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/index/addImage',
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
	
	//详情
	page.getColumnInfo = function(imageId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/index/getImageInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'imageId': imageId,
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='jumplink2']").val(data.data.jumpLink);
					$("#imageId").html(data.data.id)
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
	}
	
	//编辑
	function editColumn() {
	   	var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
				return;
		}
		
	   	var file2 = document.basicForm2.file2.files[0];
		if(!file2){
			var editStatus=0
		}else{
			var editStatus=1
		}
		var fm = new FormData();
		fm.append('imageId', $("#imageId").html());
		fm.append('columnId', $("#subordinate2").val());
		fm.append('jumpLink', $("input[name='jumplink2']").val());
		fm.append('editStatus', editStatus);
		if(!file2){}else{fm.append('mainPicture', file2);}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/index/editImage',
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
	
	function init() {
		$("#basicForm").validate({
			rules: {
				jumplink: {
					required: true,
				},
				file: {
					required: true,
				},
			},
			messages: {
				jumplink: {
					required: "请输入跳转链接",
				},
				file: {
					required: "请上传图片",
				},
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
				jumplink2: {
					required: true,
				}
			},
			messages: {
				jumplink2: {
					required: "请输入跳转链接",
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