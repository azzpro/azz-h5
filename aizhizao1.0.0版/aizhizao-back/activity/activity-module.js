var specialPerformanceCode = JSON.parse(localStorage.getItem('specialPerformanceCode'));
Module.define("system.activity", function(page, $) {
	page.ready = function() {
		initDataTable();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$("#Search2").bind("click", function() {
			dataTable2.ajax.reload();
		});
		$('#myModal').on('hidden.bs.modal', function(e){
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
				param.specialPerformanceCode = specialPerformanceCode;
				param.searchInput = $("input[name='nameNo']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/specialPerformance/getSpecialPerformanceRelatedModuleInfos",
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
					"title": "模组名称",
					"data": "moduleName",
					"className": "",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "所属推荐",
					"data": "recommendName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "模组状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.moduleStatus) {
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
					"title": "所属商户",
					"data": "merchantName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "关联产品数量",
					"data": "productNumber",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				
				{
					"title": "关联时间",
					"data": "relatedTime",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "操作",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a onclick="system.activity.initDataTable2(\'' + row.moduleCode + "','"+ row.moduleName + "','"+ row.recommendName + '\');" class="btn btn-primary zlan" href="javascript:;">产品管理</a>';
		            		html += '&nbsp;&nbsp;<a onclick="system.activity.remove(\'' + row.moduleCode + "','"+ row.recommendCode + '\');" class="btn btn-primary zlan" href="javascript:;">移除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	
	//移除
	page.remove = function(moduleCode,recommendCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addOrRemoveModule",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'moduleCode': moduleCode,
				'recommendCode': recommendCode,
				'addOrRemove' : 2,
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
	
	page.initDataTable2 = function(moduleCode,moduleNameB,recommendName) {
		$('#myModal').modal('show');
		if(moduleNameB.length > 8){
			var moduleNameB = moduleNameB.substring(0,8)+'...'
		}
		$('#recommendNameB').html(recommendName+'/'+ moduleNameB);
		dataTable2 = $('#table2').DataTable({
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
				param.moduleCode = moduleCode;
				param.searchInput = $("input[name='searchname']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/specialPerformance/getRecommentProductInfos",
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
					"title": "产品编码",
					"data": "productCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "上架状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.productStatus) {
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
					"title": "活动状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.relatedStatus) {
							case 0:
								return '未关联 ';
								break;
							case 1:
								return '已关联';
								break;
						};
					}
				},
				{
					"title": "最低售价/(发货日)",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var price = row.minPrice + '(' + row.minDeliveryDate + ')';
		         		return price;
		            }
				},
				{
					"title": "参数值",
					"data": "paramValues",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "操作",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.relatedStatus == 0){
							var removeincrease = '<a onclick="system.activity.proincrease(\'' + moduleCode + "','"+ row.productCode + '\');" class="btn btn-primary zlan" href="javascript:;">新增</a>'
						}else{
							var removeincrease = '<a onclick="system.activity.proremove(\'' + moduleCode + "','"+ row.productCode + '\');" class="btn btn-primary zlan" href="javascript:;">移除</a>'
						}
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += removeincrease;
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	
	//新增
	page.proincrease = function(moduleCode,productCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addOrRemoveProduct",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'moduleCode': moduleCode,
				'productCode': productCode,
				'addOrRemove' : 1,
			},
			success: function(data) {
				if (data.code == 0) {
					dataTable2.ajax.reload();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//移除
	page.proremove = function(moduleCode,productCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addOrRemoveProduct",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'moduleCode': moduleCode,
				'productCode': productCode,
				'addOrRemove' : 2,
			},
			success: function(data) {
				if (data.code == 0) {
					dataTable2.ajax.reload();
				} else {
					alert(data.msg)
				}
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