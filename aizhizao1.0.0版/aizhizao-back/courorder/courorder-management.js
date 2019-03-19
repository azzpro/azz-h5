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
				param.orderStatusId = $('#approvalType').val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/course/order/getPlatformCourseOrders",
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
					"title": "订单编号",
					"data": "orderCode",
					"className": "text-nowrap",
					"defaultContent": "-",
				}, // 序号
				{
					"title": "课程名称",
					"data": "courseName",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "开课编号",
					"data": "startClassCode",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "下单人手机号",
					"data": "phoneNumber",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "订单金额(元)",
					"data": "grandTotal",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "订单状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.orderStatus) {
							case 13:
								return '待支付';
								break;
							case 14:
								return '待处理 ';
								break;
							case 15:
								return '待确认';
								break;
							case 16:
								return '待评价';
								break;
							case 17:
								return '已完成';
								break;
							case 18:
								return '已关闭';
								break;
						};
					}
				},
				{
					"title": "下单时间",
					"data": "orderTime",
					"className": "text-nowrap",
					"defaultContent": "-",
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
		            		html += '<a href="javascript:;" onclick="system.courorder.parameDetail(\'' + row.orderCode + '\');">详情</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
						}
		            }
				}
			],
		});
	}
	//详情
	page.parameDetail = function(orderCode)  {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var wxorderCode = JSON.stringify(orderCode);
	        storage["wxorderCode"]= wxorderCode;
	        }
	    window.location.href = "#!courorder/courorder-detail.html"
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