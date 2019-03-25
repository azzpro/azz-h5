Module.define("system.putforward", function(page, $) {
	page.ready = function() {
		initDataTable();
		getWithdrawDepositCount();
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
				//当前页码
				 $.ajax({
				 	type: "GET",   
				 	url: ulrTo + "/azz/api/merchant/finance/getWithdrawDepositApplyInfos",
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
					"title": "提现单号",
					"data": "applyCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "提现金额",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						return row.totalWithdrawDepositMoney.toFixed(2)
					}
				},
				{
					"title": "手续费用",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						return row.commissionCharge.toFixed(2)
					}
				},
				{
					"title": "提现状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.status) {
							case 1:
								return '待审核';
								break;
							case 2:
								return '待打款 ';
								break;
							case 3:
								return '已打款 ';
								break;
							case 4:
								return '已关闭 ';
								break;
							case 5:
								return '待打款';
								break;
						};
					}
				},
				{
					"title": "提现账户",
					"data": "withdrawDepositAccount",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "打款时间",
					"data": "payWithTime",
					"className": "text-nowrap",
					"defaultContent": "-"
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
		            		html += '<a href="#!putforward/putforward-detail.html?applyCode={0}">详情</a>'.format(row.applyCode);
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	function getWithdrawDepositCount() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/finance/getWithdrawDepositCount",
			cache: false, //禁用缓存   
			dataType: "json", 
			data: {
				
			},
			success: function(data) {
				if (data.code == 0) {
					var rows = data.data;
					$('#xxjl').html(rows.totalIncome);
					$('#dzf').html(rows.withdrawDepositMoney);
					$('#dqc').html(rows.notWithdrawDepositMoney);
				} else {
					alert(data.msg)
				}
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