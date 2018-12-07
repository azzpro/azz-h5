Module.define("system.parameter", function(page, $) {
	var param = getRequest();
	var combinationCode = param["combinationCode"];
	var paramData = [];
	var paramsId = [];
	page.ready = function() {
		initValidate();
		getCaseInfo();
		paramDatalist();
		initDataTable2();
		initDataTable();
		
		$("#SubmissionBtn").bind("click", submitForm);
		$("#PreservationButton").bind("click", Select);
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		}); 
		$("#Search2").bind("click", function() {
			dataTable2.ajax.reload();
		});
		$("#Search3").bind("click", function() {
			dataTable3.ajax.reload();
		});
		
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
	}
	
	//详情
	function getCaseInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/combination/getCombinationInfo",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'combinationCode': combinationCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$("#file2").change(function(){
					    $("#pic1").attr("src",URL.createObjectURL($(this)[0].files[0]));
					});
					if(data.combinationPicUrl==null){
						$('#pic1').attr("src", '../images/ewma.jpg');
					}else{
						$('#pic1').attr("src", data.combinationPicUrl);
					}
					
					$("input[name='programmename']").val(data.combinationName);
					$('#caseName').html(data.caseName);
					$('#caseCode').html(data.caseCode);
					
					if(data.status == 1) {
						$("#Required").attr("checked", "checked");
					}else if(data.status == 2){
						$("#Selection").attr("checked", "checked");
					}
					
					$('#remark').val(data.recommendReason);
					
					var goodsModuleInfos = data.goodsModuleInfos;
					for(var i = 0;i < goodsModuleInfos.length; i++){
						var Newsobj3 = {
							"moduleName" : goodsModuleInfos[i].moduleName,
							"moduleCode" : goodsModuleInfos[i].moduleCode,
							"moduleStatus" : goodsModuleInfos[i].moduleStatus,
							"merchantName" : goodsModuleInfos[i].merchantName,
						}
						paramData.push(Newsobj3);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}

	//增加方案
	function submitForm() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		paramsId.splice(0,paramsId.length);
		for(var i = 0 ; i < paramData.length;i++){
	    	paramsId.push(paramData[i].moduleCode)
	    }
		if(!$("#caseCode").html()){
			alert('请选择方案');
			return;
		}
		
	    var file1 = document.basicForm2.file2.files[0];
		if(!file1){
	   		var isEditPic = 0
	   	}else{
	   		var isEditPic = 1
	   	}
		var fm = new FormData();
		fm.append('combinationCode', combinationCode);
		fm.append('caseCode', $('#caseCode').html());
		fm.append('combinationName', $("input[name='programmename']").val());
		fm.append('status', $("input[name='fill']:checked").val());
		fm.append('recommendReason', $('#remark').val());
		fm.append('moduleCodes', paramsId);
		if(!file1){}else{fm.append('combinationPicFile', file1);}
		fm.append('isChangeCombinationPic', isEditPic);
		
		
		$.ajax({
	        type :'POST',
	        url : ulrTo+"/azz/api/merchant/combination/editCombination",
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.href = "#!parameter/parameter-management.html";
				} else {
					alert(data.msg);
				}
	        }
	    });
	}

	function initDataTable2() {
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
				param.searchInput = $("input[name='searchname2']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/combination/getCaseInfoList",
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
					"title": "方案编号",
					"data": "caseCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "方案名称",
					"data": "caseName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "方案状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.caseStatus) {
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
					"title": "所属分类",
					"data": "assortmentName",
					"className": "text-nowrap",
					"defaultContent": "-"
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
		            		html += '<a onclick="system.parameter.Selecttoo(\'' + row.caseName + "','"+ row.caseCode + '\');" class="btn btn-primary zlan" href="javascript:;">选中</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	page.Selecttoo = function(caseName,caseCode) {
		$('#caseName').html(caseName);
		$('#caseCode').html(caseCode);
		$('#myModal').modal('hide');
		dataTable.ajax.reload();
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
				param.caseCode = $('#caseCode').html();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/combination/getModuleInfoList",
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
					"title": '<input id="checkUuid" onclick="system.parameter.checkAll()" type="checkbox">',
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render": function(data, type, row, meta) {
						return '<input onclick="system.parameter.checkQx()" name="deviceUuid" moduleName="'+row.moduleName+'" moduleCode="'+row.moduleCode+'" moduleStatus="'+row.moduleStatus+'" merchantName="'+row.merchantName+'" type="checkbox">';
					}
				}, // 序号
				{
					"title": "模组名称",
					"data": "moduleName",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "模组编号",
					"data": "moduleCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "状态",
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
			if($(this).attr("moduleCode") == paramData[i].moduleCode){
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
				"moduleName" : $(this).attr("moduleName"),
				"moduleCode" : $(this).attr("moduleCode"),
				"moduleStatus" : $(this).attr("moduleStatus"),
				"merchantName" : $(this).attr("merchantName"),
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
				var moduleName = paramData[i].moduleName;
				var moduleCode = paramData[i].moduleCode;
				var moduleStatus = paramData[i].moduleStatus;
				var merchantName = paramData[i].merchantName;
				if(moduleStatus==1){
					var moduleStatus = '上架'
				}else{
					var moduleStatus = '下架'
				}
				tr += "<tr><td>"+ moduleName +"</td>"
				+ "<td>"+ moduleCode +"</td>"
				+ "<td>"+ moduleStatus +"</td>"
				+ "<td>"+ merchantName +"</td>"
				+ "<td><a onclick=\"system.parameter.delDeptInfo2(\'" + moduleCode + "\');\" href='javascript:;'>删除</a>&nbsp;&nbsp;<a onclick=\"system.parameter.productA(\'" + moduleCode + "\');\" href='javascript:;'>产品管理</a></td></tr>";
			}
			$("#parameData").append(tr);
		}
	}
	page.delDeptInfo2 = function(moduleCode) {
		$.each(paramData,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.moduleCode== moduleCode){
				paramData.splice(index,1);
				$("#parameData").empty();
				paramDatalist();
				return false;
			}
		});
		paramsId.splice(0,paramsId.length);
	}
	
	page.productA = function(moduleCode) {
		$('#moduleCodeSD').html(moduleCode);
		initDataTable3();
		dataTable3.ajax.reload();
		$('#myModal3').modal('show');
	}
	
	function initDataTable3() {
		dataTable3 = $('#table3').DataTable({
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
				param.searchInput = $("input[name='searchname3']").val();
				param.moduleCode = $('#moduleCodeSD').html();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/combination/getProductInfoList",
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
					"title": "产品编号",
					"data": "productCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "产品品牌",
					"data": "brandName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "价格",
					"data": "productPrice",
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
					"title": "参数信息",
					"data": "productParams",
					"className": "",
					"defaultContent": "-"
				}
			],
		});
	}
	
	function initValidate(){
	   	// Basic Form
	   	$("#basicForm").validate({
	   		rules: {
	   			programmename: "required",
	   		},
	   		messages: {
	   			programmename: "请输入方案名称",
	   		},
	   		highlight: function(element) {
	   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	   		},
	   		success: function(element) {
	   			$(element).closest('.form-group').removeClass('has-error');
	   		}
	   	});
    }
});