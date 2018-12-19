Module.define("system.module", function(page, $) {
	var param = getRequest();
	var moduleCode = param["moduleCode"];
	var paramData = [];
	var paramDatacode = [];
	page.ready = function() {
		initDataTable();
		getImportedProductInfos();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$("#PreservationButton").bind("click", Select);
		$("#SubmissionBtn").bind("click", saveModuleProducts);
		
		paramDatalist();
	}
	//查询
	function getImportedProductInfos() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/goodsModule/getImportedProductInfos",
			cache: false, //禁用缓存
			data: {
				'moduleCode': moduleCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var moduleInfo = data.data.moduleInfo;
					$('#modulecode').html(moduleInfo.moduleCode);
					$('#modulename').html(moduleInfo.moduleName);
					$('#modulelist').html(moduleInfo.classificationName);
					var moduleProducts = data.data.moduleProducts;
					var td = '';
					if(!moduleProducts || !moduleProducts.length){
						td += "<tr><td colspan='2' height='30'>暂无任何包含产品</td></tr>";
					}else{
						for(var i = 0;i<moduleProducts.length;i++){
							var productCode = moduleProducts[i].productCode;
							var paramValues = moduleProducts[i].paramValues;
							td += "<tr><td>"+ productCode +"</td><td>"+ paramValues +"</td></tr>"
					    }
					}
					$("#moduleProducts").append(td);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//保存
	function saveModuleProducts() {
		if(!paramData || !paramData.length){
			alert("请先导入产品");
			return
		}
		paramDatacode.splice(0,paramDatacode.length);
		for(var i = 0;i < paramData.length; i++){
			paramDatacode.push(paramData[i].productCode);
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/goodsModule/saveModuleProducts",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					alert('保存成功！');
					window.location.href = "#!module/module-management.html";
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function GetJsonData() {
	    var json = {
	        'moduleCode': moduleCode,
			'productCodes' : paramDatacode,
			
	    };
	    return json;
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
				param.moduleCode = moduleCode;
				param.productCode = $("input[name='searchname']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/goodsModule/getProductsForImport",
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
					"title": '<input id="checkUuid" onclick="system.module.checkAll()" type="checkbox">',
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render": function(data, type, row, meta) {
						return '<input onclick="system.module.checkQx()" name="deviceUuid" productCode="'+row.productCode+'" paramValues="'+row.paramValues+'" type="checkbox">';
					}
				}, // 序号
				{
					"title": "产品编码",
					"data": "productCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "产品参数",
					"data": "paramValues",
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
		 if(!$('input[name="deviceUuid"]:checked').length > 0){
		 	alert('请选择产品');
		 	return
		 }
         $('input[name="deviceUuid"]:checked').each(function(){
			var existsFlag = false;
			for(var i=0;i<paramData.length;i++){
				if($(this).attr("productCode") == paramData[i].productCode){
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
				"productCode" : $(this).attr("productCode"),
				"paramValues" : $(this).attr("paramValues"),
			}
			paramData.push(Newsobj);
		});
		
		$("#parameData").empty();
		paramDatalist();
		$('#myModal').modal('hide');
	}
	
	function paramDatalist() {
		if(!paramData || !paramData.length){
			nodata = "<tr><td colspan='3' height='30'>表中数据为空</td></tr>";
			$("#parameData").append(nodata);
		}else{
			var tr = "";
			for(var i = 0;i < paramData.length; i++){
				var productCode = paramData[i].productCode;
				var paramValues = paramData[i].paramValues;
				tr += "<tr><td>"+ productCode +"</td>"
				+ "<td>"+ paramValues +"</td>"
				+ "<td><a onclick=\"system.module.delDeptInfo(\'" + productCode + "\');\" href='javascript:;'>移除</a></td></tr>";
			}
			$("#parameData").append(tr);
		}
	}
	page.delDeptInfo = function(productCode) {
		$.each(paramData,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.productCode== productCode){
				paramData.splice(index,1);
				$("#parameData").empty();
				paramDatalist();
				return false;
			}
		});
	}
	
});