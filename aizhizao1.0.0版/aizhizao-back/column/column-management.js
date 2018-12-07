Module.define("system.column", function(page, $) {
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
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			
			$("#img1").attr("src",'');
			
		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			$('#basicForm2')[0].reset();
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
			"bPaginate" : false,// 分页按钮  
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
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/index/getColumnLsit",
				 	cache: false, //禁用缓存   
				 	data: param, //传入组装的参数   
				 	dataType: "json", 
				 	success: function (result) {
			 			//封装返回数据   
			 			var returnData = {};
			 			returnData = param;
			 			if(null == result.data){
			 				result.data = [];
			 			}
			 			returnData.data = result.data;//返回的数据列表
			 			//调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染   
			 			//此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕   
			 			callback(returnData);   
				 	}  
				 });
			},
			"columns": [{
					"title": "栏目主图",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var img = '<img src=' + row.columnPicUrl +' width="45" height="45" alt="" />';
						return img;
					}
				}, // 序号
				{
					"title": "栏目名称",
					"data": "columnName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "栏目代码",
					"data": "columnCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "栏目类型",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.columnType) {
							case 1:
								return '图片展示';
								break;
							case 2:
								return '文章展示';
								break;
						};
					}
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
			            	if(row.columnCode == 'homeslide'){
								var statustoo = '-'
							}else{
								var statustoo = '<a class="text-nowrap" href="javascript:;">链接</a>'
							}
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += statustoo;
	            			html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.column.getColumnInfo(\'' + row.id + '\');">编辑</a>';
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.column.delDeptInfo(\'' + row.id + "','"+ row.columnName + '\');">删除</a>';
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
	page.delDeptInfo = function(id,columnName) {
		$('#bmName').html(columnName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.column.delDeptInfotoo(\'" + id + "\');")
	}
	page.delDeptInfotoo = function(id) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/index/delColumn",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'columnId': id,
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
		fm.append('columnName', $("input[name='columnname']").val());
		fm.append('columnCode', $("input[name='columncode']").val());
		fm.append('columnType', $("input[name='types']:checked").val());
		if(!file1){}else{fm.append('mainPicture', file1);}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/index/addColumn',
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
	page.getColumnInfo = function(columnId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/index/getColumnInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'columnId': columnId,
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='columnname2']").val(data.data.columnName);
					$("input[name='columncode2']").val(data.data.columnCode);
					$("#idedi").html(data.data.id);
					if(data.data.columnType == 1) {
						$("#Required2").attr("checked", "checked");
					}else if(data.data.columnType == 2){
						$("#Selection2").attr("checked", "checked");
					}
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
		fm.append('columnId', $("#idedi").html());
		fm.append('columnName', $("input[name='columnname2']").val());
		fm.append('columnCode', $("input[name='columncode2']").val());
		fm.append('columnType', $("input[name='types2']:checked").val());
		fm.append('editStatus', editStatus);
		if(!file2){}else{fm.append('mainPicture', file2);}
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/index/editColumn',
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
				columnname: {
					required: true,
				},
				columncode: {
					required: true,
				},
			},
			messages: {
				columnname: {
					required: "请输入栏目名称",
				},
				columncode: {
					required: "请输入栏目代码",
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
				columnname2: {
					required: true,
				},
				columncode2: {
					required: true,
				},
			},
			messages: {
				columnname2: {
					required: "请输入栏目名称",
				},
				columncode2: {
					required: "请输入栏目代码",
				},
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