var clientUserName = JSON.parse(localStorage.getItem('clientUserName'));
var phoneNumber = JSON.parse(localStorage.getItem('phoneNumber'));
var companyCode = JSON.parse(localStorage.getItem('companyCode'));
Module.define("system.customer", function(page, $) {
	page.ready = function() {
		$('#names').html(clientUserName);
		$('#iphoe').html(phoneNumber);
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
				param.companyCode = companyCode;
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/client/selectClientCompanyEmployeeList",
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
					"title": "成员编号",
					"data": "employeeCode",
					"className": "all",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "成员姓名",
					"data": "employeeName",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "手机号",
					"data": "phone",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "部门名称",
					"data": "deptName",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "所属岗位",
					"data": "postName",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "状态",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.status) {
							case 1:
								return '有效';
								break;
							case 2:
								return '禁用 ';
								break;
						};
					}
				},
				{
					"title": "创建时间",
					"data": "createTime",
					"className": "all",
					"defaultContent": "-"
				}
			],
		});
	}
});