Module.define("system.model", function(page, $) {
	var ordercordId = [];
	page.ready = function() {
		initDataTable();
		initDataTable2();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$("#shoppingcart").bind("click", shoppingcart);
		$("#bulkorder").bind("click", bulkorder);
		$("#bulkdel").bind("click", bulkdel);
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
				 	url: ulrTo + "/azz/api/client/selection/getSelectionRecord",
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
			 			$('#GogNumber').html(result.data.total);
				 	}  
				 });
			},
			"columns": [{
					"title": '<input id="checkUuid" onclick="system.model.checkAll()" type="checkbox">',
					"data": "",
					"className": "",
					"defaultContent": "-",
					"render": function(data, type, row, meta) {
						return '<input onclick="system.model.checkQx()" name="deviceUuid" selectionRecordId="'+row.selectionRecordId+'" type="checkbox">';
					}
				}, // 序号
				{
					"title": "产品编码",
					"data": "productCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "参考单价",
					"data": "price",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "状态",
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
					"title": "交期",
					"data": "deliveryDate",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "所属模组",
					"data": "moduleName",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "保存时间",
					"data": "createTime",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "参数值",
					"data": "paramsValue",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "操作",
					"data": "merchantName",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a href="javascript:;" onclick="system.model.OrderInfo(\'' + row.selectionRecordId + '\');">订购</a>'
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.model.delDeptInfo(\'' + row.selectionRecordId + '\');">删除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	
	page.checkAll = function () {
		var all = document.getElementById('checkUuid'); //获取到点击全选的那个复选框的id  
		var one = document.getElementsByName('deviceUuid'); //获取到复选框的名称  
		//因为获得的是数组，所以要循环 为每一个checked赋值  
		for(var i = 0; i < one.length; i++) {
			one[i].checked = all.checked; 
		}
	}
	page.checkQx = function () {
		$('#checkUuid').attr("checked",false);

         var userids=document.getElementsByName("deviceUuid");
         var count=0;
         //遍历所有的复选框
         for(var i=0;i<userids.length;i++){
             if(userids[i].checked){
                 count++;
             }
         }
         //选中复选框的个数==获取复选框的个数 
         if(count==userids.length){
             document.getElementById("checkUuid").checked=true;
         }else{
             document.getElementById("checkUuid").checked=false;
         }
	}
	
	function bulkorder() {
		ordercordId.splice(0,ordercordId.length);
		$('input[name="deviceUuid"]:checked').each(function(){
			ordercordId.push($(this).attr("selectionRecordId"));
		});
		if(!ordercordId || !ordercordId.length){
			alert('请选择产品');
			return
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/addProductsToShoppingCart",
			cache: false, //禁用缓存   
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					dataTable2.ajax.reload();
					alert('订购成功，请到购物车下单!');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function bulkdel() {
		ordercordId.splice(0,ordercordId.length);
		$('input[name="deviceUuid"]:checked').each(function(){
			ordercordId.push($(this).attr("selectionRecordId"));
		});
		if(!ordercordId || !ordercordId.length){
			alert('请选择产品');
			return
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/delSelectionRecord",
			cache: false, //禁用缓存   
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					dataTable.ajax.reload();
					alert('删除成功!');
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function GetJsonData() {
	    var json = {
	        'selectionRecordIds': ordercordId,
	    };
	    return json;
	}
	
	page.OrderInfo = function(selectionRecordId) {
		ordercordId.splice(0,ordercordId.length);
		ordercordId.push(selectionRecordId);
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/addProductsToShoppingCart",
			cache: false, //禁用缓存   
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					dataTable2.ajax.reload();
					alert('订购成功!')
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.delDeptInfo = function(selectionRecordId) {
		ordercordId.splice(0,ordercordId.length);
		ordercordId.push(selectionRecordId);
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/delSelectionRecord",
			cache: false, //禁用缓存   
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					dataTable.ajax.reload();
					alert('删除成功!')
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function initDataTable2() {
		dataTable2 = $('#table2').DataTable({
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
				 	url: ulrTo + "/azz/api/client/selection/getShoppingCartProductInfos",
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
			 			$('.stripNumber').html(result.data.length);
				 	}  
				 });
			},
			"columns": [{
					"title": "产品编码",
					"data": "productCode",
					"className": "",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "单价",
					"data": "price",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "状态",
					"data": "",
					"className": "",
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
					"title": "交期",
					"data": "deliveryDate",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "所属模组",
					"data": "moduleName",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "操作",
					"data": "merchantName",
					"className": "",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.model.delDeptInfo2(\'' + row.shoppingCartId + '\');">移除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	
	page.delDeptInfo2 = function(shoppingCartId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/removeShoppingCartProduct",
			cache: false, //禁用缓存   
			dataType: "json", 
			data: {
				'shoppingCartId': shoppingCartId
			},
			success: function(data) {
				if (data.code == 0) {
					dataTable2.ajax.reload();
					alert('移除成功!')
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//购物车
	function shoppingcart() {
        window.location.href = "#!model/model-shopping.html";
        window.location.reload();
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