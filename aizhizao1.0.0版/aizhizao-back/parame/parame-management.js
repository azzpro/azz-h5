Module.define("system.parame", function(page, $) {
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
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/searchParamsList",
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
					"title": "参数项编号",
					"data": "paramCode",
					"className": "all",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "所属分类名称",
					"data": "assortmentName",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "产品使用量",
					"data": "productUseCount",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "参数项数量",
					"data": "paramsCount",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "创建时间",
					"data": "createTime",
					"className": "all",
					"defaultContent": "无"
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "desktop testview",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.flag==0){
							var flag = '编辑'
						}else{
							var flag = '详情'
						}
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a href="javascript:;" onclick="system.parame.parameDetail(\'' + row.paramCode + "','"+ row.flag + '\');">'+ flag +'</a>';
		            		html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.parame.delDeptInfo(\'' + row.paramCode + "','"+ row.assortmentName + '\');">删除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
						}
		            }
				}
			],
		});
	}
	
	page.parameDetail = function(paramCode,flag)  {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var paramCode = JSON.stringify(paramCode);
	        var flag = JSON.stringify(flag);
	        storage["paramCode"]= paramCode;
	        storage["flag"]= flag;
	        }
	    window.location.href = "#!parame/parame-edit.html"
	}
	
	//删除
	page.delDeptInfo = function(paramCode,assortmentName) {
		$('#bmName').html(assortmentName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.parame.delDeptInfotoo(\'" + paramCode + "\');")
	}
	
	page.delDeptInfotoo = function(paramCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/deleteParams",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'code': paramCode
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