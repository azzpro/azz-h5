var userInfo = JSON.parse(localStorage.getItem('userInfo'));
Module.define("system.jurisdiction", function(page, $) {
	page.ready = function() {
		initDataTable();
		init();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$("#confirm").bind("click", addRole);
	}
	
	function initDataTable() {
		dataTable = $('#table').DataTable({
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
				param.searchInput = $("input[name='searchname']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/permission/getRoleList",
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
				 	}  
				 });
			},
			"columns": [{
					"title": "角色编号",
					"data": "roleCode",
					"className": "all",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "角色名称",
					"data": "roleName",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "备注",
					"data": "remark",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "创建人",
					"data": "creator",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "创建时间",
					"data": "createTime",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "desktop testview",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
			            	var html = '<div class="am-btn-toolbar">';
			            		html += '<div class="am-btn-group am-btn-group-xs">';
			            		if(row.roleName == '管理员'){
			            			html += ''
			            		}else{
			            		html += '<a href="javascript:;" onclick="system.jurisdiction.getUserInfo(\'' + row.roleCode + "','"+ row.roleName +  "','"+ row.remark + '\');">编辑</a>';
			            		html += '&nbsp;&nbsp;<a href="#!member/jurisdiction-settings.html?roleCode={0}">权限设置</a>'.format(row.roleCode);
			            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.jurisdiction.delDeptInfo(\'' + row.roleCode + "','"+ row.roleName + '\');">删除</a>';
			            		}
			            		html += '</div>';
			            		html += '</div>';
				            return html;
						}
		            }
				}
			],
			/*drawCallback : function() {
	        	// 校验权限
	        	User.Permission.afterInitUI();
	        }*/
		});
	}
	
	//增加角色
	function addRole() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/permission/addRole",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'roleName': $("input[name='Username']").val(),
         	    'remark': $("#description").val()
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					$('#basicForm')[0].reset();
					dataTable.ajax.reload();
					$('#myModal111').modal('show');
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//角色详情
	page.getUserInfo = function(roleCode,roleName,remark) {
		$("input[name='Username2']").val(roleName);
		if(remark != null){
			$("#description2").val(remark);
		}else{
			$("#description2").val('');
		}
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.jurisdiction.editRole(\'" + roleCode + "\');")
	}
	
	//编辑角色
	page.editRole = function(roleCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/permission/editRole",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'roleCode':roleCode,
				'roleName': $("input[name='Username2']").val(),
         	    'remark': $("#description2").val()
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					dataTable.ajax.reload();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//删除角色
	page.delDeptInfo = function(roleCode,roleName) {
		$('#bmName').html(roleName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.jurisdiction.delDeptInfotoo(\'" + roleCode + "\');")
	}
	page.delDeptInfotoo = function(roleCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/permission/delRole",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'roleCode': roleCode
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
	
	function init() {
		$("#basicForm").validate({
			rules: {
				Username: {
	   				required: true,
	   			}
			},
			messages: {
				Username: {
	   				required: "请输入角色名称",
	   			}
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			}
		});
		$("#basicForm2").validate({
			rules: {
				Username2: {
	   				required: true,
	   			}
			},
			messages: {
				Username2: {
	   				required: "请输入角色名称",
	   			}
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