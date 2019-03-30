var paramData=[];
var valueArra=[];
var withdrawDepositMoneyarr=[];
var grandtotalarr=[];
Module.define("system.putforward", function(page, $) {
	page.ready = function() {
		getAccountInfoByMerchantCode();
		paramDatalist();
		initDataTable();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#PreservationButton").bind("click", Select);
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
	}
	function getAccountInfoByMerchantCode() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/finance/getAccountInfoByMerchantCode",
			cache: false, //禁用缓存
			data: {
				
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					if(!data.data){
					 alert('非合法提现商户');
					 window.location.href = "#!putforward/putforward-management.html";
					 return;
					}
					$('#accountName').html(data.data.accountName);
					$('#accountBankCardNumber').html(data.data.accountBankCardNumber);
					$('#creditCode').html(data.data.creditCode);
					$('#accountBank').html(data.data.accountBank);
					$('#accountSubBranch').html(data.data.accountSubBranch);
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function sum(arr){
	  return arr.reduce(function(prep,curr,idx,arr){
	    return prep+curr;
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
				 	url: ulrTo + "/azz/api/merchant/finance/getMerchantOrders",
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
					"title": '<input id="checkUuid" onclick="system.putforward.checkAll()" type="checkbox">',
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render": function(data, type, row, meta) {
						if(row.withdrawDepositStatus == 1){
							return '<input onclick="system.putforward.checkQx()" name="deviceUuid" merchantOrderCode="'+row.merchantOrderCode+'" grandTotal="'+row.grandTotal.toFixed(2)+'" withdrawDepositMoney="'+row.withdrawDepositMoney.toFixed(2)+'" transactionCost="'+row.transactionCost.toFixed(2)+'" orderDate="'+row.orderDate+'" type="checkbox">';
						}else{
							return '-'
						}
						
					}
				}, // 序号
				{
					"title": "订单编号",
					"data": "merchantOrderCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "订单金额",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						return row.grandTotal.toFixed(2)
					}
				},
				{
					"title": "订单状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.orderStatusId) {
							case 1:
								return '待确认';
								break;
							case 2:
								return '待发货';
								break;
							case 3:
								return '待签收';
								break;
							case 4:
								return '已完成';
								break;
							case 5:
								return '已取消';
								break;
						};
					}
				},
				{
					"title": "提现状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.withdrawDepositStatus) {
							case 1:
								return '可提现';
								break;
							case 2:
								return '提现中';
								break;
							case 3:
								return '已提现';
								break;
						};
					}
				},
				{
					"title": "下单时间",
					"data": "orderDate",
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
		$('input[name="deviceUuid"]:checked').each(function(){
			var existsFlag = false;
			for(var i=0;i<paramData.length;i++){
				if($(this).attr("merchantordercode") == paramData[i].merchantordercode){
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
				"merchantordercode" : $(this).attr("merchantordercode"),
				"grandtotal" : $(this).attr("grandtotal"),
				"withdrawDepositMoney" : $(this).attr("withdrawDepositMoney"),
				"transactionCost" : $(this).attr("transactionCost"),
				"orderdate" : $(this).attr("orderdate"),
			}
			paramData.push(Newsobj);
		});
		
		$("#prodetail").empty();
		paramDatalist();
		$('#myModal').modal('hide');
	}
	
	function paramDatalist() {
		if(!paramData || !paramData.length){
			nodata = "<tr><td colspan='6' height='30'>表中数据为空</td></tr>";
			$("#prodetail").append(nodata);
		}else{
			var tr = "";
			$('#xxjl').html(paramData.length);
			withdrawDepositMoneyarr.splice(0,withdrawDepositMoneyarr.length);
			grandtotalarr.splice(0,grandtotalarr.length);
			for(var i = 0;i < paramData.length; i++){
				var merchantordercode = paramData[i].merchantordercode;
				var grandtotal = paramData[i].grandtotal;
				var withdrawDepositMoney = paramData[i].withdrawDepositMoney;
				var transactionCost = paramData[i].transactionCost;
				var orderdate = paramData[i].orderdate;
				tr += "<tr><td>"+ merchantordercode +"</td>"
				+ "<td>"+ grandtotal +"</td>"
				+ "<td>"+ transactionCost +"</td>"
				+ "<td>"+ withdrawDepositMoney +"</td>"
				+ "<td>"+ orderdate +"</td>"
				+ "<td><a onclick=\"system.putforward.delDeptInfo2(\'" + merchantordercode + "\');\" href='javascript:;'>移除</a></td></tr>";
				withdrawDepositMoneyarr.push(parseFloat(paramData[i].withdrawDepositMoney));
				grandtotalarr.push(parseFloat(paramData[i].grandtotal));
			}
			var s=sum(withdrawDepositMoneyarr);
			var g=sum(grandtotalarr);
			$('#dqc').html(s.toFixed(2));
			$('#dzf').html(g.toFixed(2));
			$("#prodetail").append(tr);
		}
	}
	page.delDeptInfo2 = function(merchantordercode) {
		$.each(paramData,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.merchantordercode== merchantordercode){
				paramData.splice(index,1);
				$("#prodetail").empty();
				paramDatalist();
				return false;
			}
		});
	}
	
	//申请
	function submitForm() {
		valueArra.splice(0,valueArra.length);
		for(var i = 0;i < paramData.length; i++){
			valueArra.push(paramData[i].merchantordercode);
		}
	    $.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/finance/withdrawDepositApply",
			cache: false, //禁用缓存   
			async: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(GetJsonData()),
			success: function(data) {
				if (data.code == 0) {
					alert('申请提现成功！');
					window.location.href = "#!putforward/putforward-management.html";
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function GetJsonData() {
	    var json = {
	        'withdrawDepositAccount': $('#accountBankCardNumber').html(),
			'merchantOrderCodes' : valueArra,
	    };
	    return json;
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