Module.define("system.signup", function(page, $) {
	page.ready = function() {
		initDataTable();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#tips').val('');
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
				param.courseName = $("input[name='searchname']").val();
				param.status = $("#approvalType").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/index/getClientSignUpList",
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
					"title": "提交时间",
					"data": "creatTime",
					"className": "text-nowrap",
					"defaultContent": "-",
				}, // 序号
				{
					"title": "状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.status) {
							case 0:
								return '待处理';
								break;
							case 1:
								return '已处理';
								break;
						};
					}
				},
				{
					"title": "课程名称",
					"data": "articleName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "姓名",
					"data": "name",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "性别",
					"data": "createTime",
					"className": "text-nowrap",
					"defaultContent": "无",
					"render" : function (data, type, row, meta) {
						switch(row.gender) {
							case 0:
								return '男';
								break;
							case 1:
								return '女';
								break;
						};
					}
				},
				{
					"title": "联系方式",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.mobilePhone){
							var mobilePhone = row.mobilePhone
						}else{
							var mobilePhone = ''
						}
						if(row.email){
							var email = row.email
						}else{
							var email = ''
						}
						return mobilePhone +'<br>' + email
					}
				},
				{
					"title": "公司",
					"data": "company",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "职位",
					"data": "post",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "处理人",
					"data": "post",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.modifier){
							var modifier = row.modifier
						}else{
							var modifier = ''
						}
						if(row.modifierTime){
							var modifierTime = row.modifierTime
						}else{
							var modifierTime = ''
						}
						return modifier +'<br>' + modifierTime
					}
				},
				{
					"title": "备注",
					"data": "remark",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
			            	if(row.status==0){
								var statustoo = '<a class="text-nowrap" href="javascript:;" onclick="system.signup.delDeptInfo(\'' + row.id + '\');">处理</a>'
							}else{
								var statustoo = '-'
							}
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += statustoo;
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	//处理
	page.delDeptInfo = function(id) {
		$('#myModal').modal('show');
		$('#confirm').attr("onclick", "system.signup.delDeptInfotoo(\'" + id + "\');")
	}
	page.delDeptInfotoo = function(id) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/index/editSignUp",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'id': id,
				'remark': $('#tips').val(),
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					dataTable.ajax.reload();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	

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