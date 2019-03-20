/*var param = getRequest();
var orderCode = param["orderCode"];*/
Module.define("system.putforward", function(page, $) {
	page.ready = function() {
		getMerchantOrderDetail();
		$("#PreservationButton").bind("click", Select);
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
	}
	function getMerchantOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/order/getMerchantOrderDetail",
			cache: false, //禁用缓存
			data: {
				'orderCode':orderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					
					
				} else {
					alert(data.msg)
				}
			}
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
				param.assortmentId = $('#assortmentId').html();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/case/getCaseParamList",
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
					"title": '<input id="checkUuid" onclick="system.programme.checkAll()" type="checkbox">',
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render": function(data, type, row, meta) {
						return '<input onclick="system.programme.checkQx()" name="deviceUuid" uuid="'+row.id+'" paramCode="'+row.paramCode+'" paramName="'+row.paramName+'" paramsType="'+row.paramsType+'" paramValue="'+row.paramValue+'" type="checkbox">';
					}
				}, // 序号
				{
					"title": "产品参数编号",
					"data": "paramCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "产品参数名称",
					"data": "paramName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "产品参数格式",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.paramsType) {
							case 1:
								return '下拉选择';
								break;
							case 2:
								return '参数填写';
								break;
						};
					}
				},
				{
					"title": "参数值",
					"data": "paramValue",
					"className": "text-nowrap",
					"defaultContent": "-",
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
	function Select() {
		paramsId.splice(0,paramsId.length);
		$('input[name="deviceUuid"]:checked').each(function(){
			var existsFlag = false;
			for(var i=0;i<paramData.length;i++){
				if($(this).attr("paramCode") == paramData[i].paramCode){
					// 如果moduleCode的值在原来数组中已经存在，则标识为已存在，则跳出当前循环
					existsFlag = true;
					continue;
				}
			}
			if(existsFlag){
				// 如果moduleCode已存在，则不需要添加到数组
				return true;
			}
			var Newsobj = {
				"id" : $(this).attr("uuid"),
				"paramCode" : $(this).attr("paramCode"),
				"paramName" : $(this).attr("paramName"),
				"paramsType" : $(this).attr("paramsType"),
				"paramValue" : $(this).attr("paramValue"),
			}
			paramData.push(Newsobj);
		});
		
		$("#parameData").empty();
		paramDatalist();
		$('#myModal2').modal('hide');
	}
	
	function paramDatalist() {
		if(!paramData || !paramData.length){
			nodata = "<tr><td colspan='5' height='30'>表中数据为空</td></tr>";
			$("#parameData").append(nodata);
		}else{
			var tr = "";
			for(var i = 0;i < paramData.length; i++){
				var paramCode = paramData[i].paramCode;
				var paramName = paramData[i].paramName;
				var paramsType = paramData[i].paramsType;
				var paramValue = paramData[i].paramValue;
				if(paramsType==1){
					var paramsType = '下拉选择'
				}else{
					var paramsType = '参数填写'
				}
				if(paramValue=="undefined"){
					var paramValue = '-'
				}else{
					var paramValue = paramValue
				}
				tr += "<tr><td>"+ paramName +"</td>"
				+ "<td>"+ paramCode +"</td>"
				+ "<td>"+ paramsType +"</td>"
				+ "<td>"+ paramValue +"</td>"
				+ "<td><a onclick=\"system.programme.delDeptInfo2(\'" + paramCode + "\');\" href='javascript:;'>删除</a></td></tr>";
			}
			$("#parameData").append(tr);
		}
	}
	page.delDeptInfo2 = function(paramCode) {
		$.each(paramData,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.paramCode== paramCode){
				paramData.splice(index,1);
				$("#parameData").empty();
				paramDatalist();
				return false;
			}
		});
		paramsId.splice(0,paramsId.length);
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