Module.define("system.courorder", function(page, $) {
	page.ready = function() {
		initDataTable();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
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
				param.moduleStatus = $('#approvalType').val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/course/getCourseInfos",
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
					"title": "课程主图",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var img = '<img src=' + row.coursePicUrl +' width="45" height="45" alt="" />';
						return img;
					}
				}, // 序号
				{
					"title": "课程名称",
					"data": "courseName",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "品牌",
					"data": "brandName",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "最近开课时间",
					"data": "latelyStartClassTime",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "最近开课地点",
					"data": "latelyStartClassLocation",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "开课人数",
					"data": "peopleNumber",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "开课课时",
					"data": "hours",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "无",
					"render" : function (data, type, row, meta) {
						switch(row.status) {
							case 1:
								return '上架';
								break;
							case 2:
								return '下架';
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
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a href="javascript:;" onclick="system.courculum.parameDetail(\'' + row.courseCode + '\');">详情</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
						}
		            }
				}
			],
		});
	}
	
	//启用禁用
	page.editUserStatus = function(courseCode,statustoo) {
		if(statustoo == '上架') {
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/platform/course/putOnOrPutOffOrDelCourse",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'courseCode': courseCode,
					'status': 1
				},
				success: function(data) {
					if (data.code == 0) {
						dataTable.ajax.reload();
					} else {
						alert(data.msg)
					}
				}
			});
		}else if(statustoo == '下架'){
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/platform/course/putOnOrPutOffOrDelCourse",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'courseCode': courseCode,
					'status': 2
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
	}
	//删除
	page.dele = function(courseCode,courseName) {
		$('#bmName').html(courseName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.courculum.delDeptInfo(\'" + courseCode + "\');")
	}
	page.delDeptInfo = function(courseCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/putOnOrPutOffOrDelCourse",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'courseCode': courseCode,
				'status': 0
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
	
	page.parameDetail = function(courseCode)  {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var courseCodeDetail = JSON.stringify(courseCode);
	        storage["courseCodeDetail"]= courseCodeDetail;
	        }
	    window.location.href = "#!courculum/courculum-edit.html"
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