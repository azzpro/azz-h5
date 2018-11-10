Module.define("system.customer", function(page, $) {
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
				 	url: ulrTo + "/azz/api/client/selectClientUserList",
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
					"title": "客户编号",
					"data": "clientUserCode",
					"className": "all",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "注册手机号",
					"data": "phoneNumber",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "账号类型",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.clientType) {
							case 0:
								return '个人用户';
								break;
							case 1:
								return '企业用户';
								break;
						};
					}
				},
				{
					"title": "邮箱地址",
					"data": "email",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "账户状态",
					"data": "",
					"className": "all",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.status) {
							case 0:
								return '无效';
								break;
							case 1:
								return '有效 ';
								break;
							case 2:
								return '禁用 ';
								break;
						};
					}
				},
				{
					"title": "注册时间",
					"data": "createTime",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "desktop testview",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.status == 1){
							var statustoo = '禁用'
						}else{
							var statustoo = '启用'
						}
						if (row) {
			            	var html = '<div class="am-btn-toolbar">';
			            		html += '<div class="am-btn-group am-btn-group-xs">';
			            		html += '<a href="#!customer/customer-detail.html?clientUserCode={0}">编辑</a>'.format(row.clientUserCode);
			            		html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.customer.editUserStatus(\'' + row.clientUserCode + "','"+ statustoo + '\');">'+ statustoo +'</a>';
			            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.customer.delDeptInfo(\'' + row.clientUserCode + '\');">密码重置</a>';
			            		html += '</div>';
			            		html += '</div>';
				            return html;
						}
		            }
				}
			],
		});
	}
	
	//启用禁用
	page.editUserStatus = function(clientUserCode,statustoo) {
		if(statustoo == '启用') {
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/client/updateClientUserStatus",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'code': clientUserCode,
					'status': 1
				},
				success: function(data) {
					if (data.code == 0) {
						dataTable.ajax.reload();
					} else {
						alert(data.msg)
					}
				}
			});
		}else if(statustoo == '禁用'){
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/client/updateClientUserStatus",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'code': clientUserCode,
					'status': 2
				},
				success: function(data) {
					if (data.code == 0) {
						dataTable.ajax.reload();
					} else {
						alert(data.msg)
					}
				}
			});
		}
	}
});