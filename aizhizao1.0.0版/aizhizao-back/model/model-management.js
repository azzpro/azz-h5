Module.define("system.model", function(page, $) {
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
				param.param = $("input[name='searchname']").val();
				param.status = $('#approvalType').val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/product/selectPlatformProductList",
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
					"title": "系统编码",
					"data": "systemCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "产品编码",
					"data": "productCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "所属商户",
					"data": "merchantName",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "价格",
					"data": "price",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "参数项",
					"data": "params",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
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
			            	if(row.status == 2){
								var statustoo = '-'
							}else{
								var statustoo = '下架'
							}
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a href="#!model/model-detail.html?productId={0}">详情</a>'.format(row.productId);
	            			html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.model.editUserStatus(\'' + row.productId + "','"+ statustoo + '\');">'+ statustoo +'</a>';
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
	page.editUserStatus = function(productId,statustoo) {
		if(statustoo == '上架') {
			/*$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'moduleCode': moduleCode,
					'moduleStatus': 1
				},
				success: function(data) {
					if (data.code == 0) {
						dataTable.ajax.reload();
					} else {
						alert(data.msg)
					}
				}
			});*/
		}else if(statustoo == '下架'){
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/merchant/product/downProduct",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'id': productId,
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