Module.define("system.brand", function(page, $) {
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
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/goodsBrand/getGoodsBrandInfoList",
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
					"title": "英文名",
					"data": "brandEnglishName",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "品牌简介",
					"data": "brandDescription",
					"className": "all",
					"defaultContent": "-",
				}
			],
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