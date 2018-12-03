Module.define("system.payment", function(page, $) {
	var dataTable;
	page.ready = function() {
		initDataTable();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		
	};
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
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/pay/toPayList",
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
					"title": "支付类型",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.payMethod) {
							case 1:
								return '线上支付';
								break;
							case 2:
								return '线下支付';
								break;
						};
					}
				}, 
				{
					"title": "支付流水号",
					"data": "payNumber",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "三方流水号",
					"data": "threePartyNumber",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "订单编号",
					"data": "orderNumber",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "支付状态",
					"data": "phoneNumber",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.payStatus) {
							case 1:
								return '待支付';
								break;
							case 2:
								return '支付成功';
								break;
							case 3:
								return '关闭支付';
								break;
							case 4:
								return '支付失败';
								break;
						};
					}
				},
				{
					"title": "渠道费用",
					"data": "channelMoney",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "客户联系方式",
					"data": "customerPhone",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "支付时间",
					"data": "payTime",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "desktop testview",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
			            	var html = '<div class="am-btn-toolbar">';
			            		html += '<div class="am-btn-group am-btn-group-xs">';
			            		html += '<a href="javascript:;" onclick="system.payment.details(\'' + row.orderNumber + '\');">详情</a>';
			            		html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.payment.refund(\'' + row.orderNumber + '\');">退款</a>';
			            		html += '</div>';
			            		html += '</div>';
				            return html;
						}
		            }
				}
			],
			/*drawCallback : function() {
	        	// 校验权限
	        	User.Permission.afterInitUI();
	        }*/
		});
	}
	
	//详情
	page.details = function(orderNumber) {
		if(!window.localStorage){
            return false;
        }else{
            var storage=window.localStorage;
            var orderNumber = JSON.stringify(orderNumber);
            storage["orderNumber"]= orderNumber;
        }
        /*window.location.href = "#!invoice/invoice-detail.html"*/
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