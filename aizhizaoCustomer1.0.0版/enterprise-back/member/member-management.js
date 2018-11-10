Module.define("system.member", function(page, $) {
	var dataTable;
	page.ready = function() {
		initDataTable();
		init();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$.validator.addMethod("checkpassword", function(value, element, params) {
			password = $("input[name='Password']").val();
			password2 = $("input[name='ConfirmPassword']").val();
			return(password && password2 && password == password2);
		}, "输入的密码不一致！");
		$.validator.addMethod("checkpassword2", function(value, element, params) {
			password3 = $("input[name='Password2']").val();
			password4 = $("input[name='ConfirmPassword2']").val();
			return(password3 && password4 && password3 == password4);
		}, "输入的密码不一致！");
		
		$("#confirm").bind("click", addUser);
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			$("input[name='Password2']").val('');
			$("input[name='ConfirmPassword2']").val('');

		});
		$.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");
		
	};
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
				 	type: "GET",   
				 	url: ulrTo + "/azz/api/client/getClientUserList",
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
					"data": "clientUserCode",
					"className": "all",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "成员姓名",
					"data": "clientUserName",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "手机号",
					"data": "phoneNumber",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "岗位名称",
					"data": "postName",
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
					"title": "角色名称",
					"data": "roleName",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "状态",
					"data": "status",
					"className": "all",
					"defaultContent": "无"
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
						if(row.status == '禁用'){
							var statustoo = '启用'
						}else{
							var statustoo = '禁用'
						}
						if(row.isEnterpriseAuthenticator == 1){
							var htmlatt = ''
						}else{
							var htmlatt = '<a href="javascript:;" onclick="system.member.getUserInfo(\'' + row.clientUserCode + '\');">编辑</a>&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.member.delDeptInfo(\'' + row.clientUserCode + "','"+ row.clientUserName + '\');">移除</a>'
						}
						if (row) {
			            	var html = '<div class="am-btn-toolbar">';
			            		html += '<div class="am-btn-group am-btn-group-xs">';
			            		html += htmlatt;
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
	
	//增加成员
	function addUser() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/addClientUser",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'clientUserName': $("input[name='memberName']").val(),
         	    'phoneNumber': $("input[name='phone']").val(),
				'email': $("input[name='eMail']").val(),
				'postName': $("input[name='Postname']").val(),
				'deptCode': $("input[name='DepartmentNo']").val(),
				'roleCode': $("input[name='RoleNo']").val()
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
	
	//成员详情
	page.getUserInfo = function(clientUserCode) {
		$.ajax({
			type: "GET",
			url: ulrTo+"/azz/api/client/getClientUserInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'clientUserCode': clientUserCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='memberName2']").val(data.data.clientUserName);
					$("input[name='phone2']").val(data.data.phoneNumber);
					$("input[name='eMail2']").val(data.data.email);
					$("input[name='Postname2']").val(data.data.postName);
					$("input[name='DepartmentNo2']").val(data.data.deptCode);
					$("input[name='RoleNo2']").val(data.data.roleCode);
					
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.member.editUser(\'" + clientUserCode + "\');")
	}
	
	//编辑成员
	page.editUser = function(clientUserCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/editClientUser",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'clientUserCode':clientUserCode,
				'clientUserName': $("input[name='memberName2']").val(),
         	    'phoneNumber': $("input[name='phone2']").val(),
				'email': $("input[name='eMail2']").val(),
				'postName': $("input[name='Postname2']").val(),
				'deptCode': $("input[name='DepartmentNo2']").val(),
				'roleCode': $("input[name='RoleNo2']").val()
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
	
	//移除成员
	page.delDeptInfo = function(clientUserCode,clientUserName) {
		$('#bmName').html(clientUserName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.member.delDeptInfotoo(\'" + clientUserCode + "\');")
	}
	page.delDeptInfotoo = function(clientUserCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/removeClientUser",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'clientUserCode': clientUserCode,
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
				memberName: {
	   				required: true,
	   			},
				phone: {
	   				required: true,
	   				minlength: 11,
	   				maxlength: 11,
	   				isMobile: true,
	   		},
				DepartmentNo: {
	   				required: true,
	   			},
				RoleNo: {
	   				required: true,
	   			}
			},
			messages: {
				memberName: {
	   				required: "请输入成员姓名",
	   			},
				phone: {
	   				required: "请输入您的电话号码",
	   				minlength: "请输入正确的电话号码"
	   			},
				DepartmentNo: "请输入部门编号",
				RoleNo: "请输入角色编号",
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
				memberName2: {
	   				required: true,
	   			},
				phone2: {
	   				required: true,
	   				minlength: 11,
	   				maxlength: 11,
	   				isMobile: true,
	   			},
				Password2: {
	   				required: false,
	   			},
				ConfirmPassword2: {
	   				required: false,
	   				checkpassword: false,
	   			},
				DepartmentNo2: {
	   				required: true,
	   			},
				RoleNo2: {
	   				required: true,
	   			}
			},
			messages: {
				memberName2: {
	   				required: "请输入成员姓名",
	   			},
				phone2: {
	   				required: "请输入您的电话号码",
	   				minlength: "请输入正确的电话号码"
	   			},
				Password2: "请输输入密码",
				ConfirmPassword2: {
					required: "请输入密码",
					checkpassword: "两次密码输入不一致"
				},
				DepartmentNo2: "请输入部门编号",
				RoleNo2: "请输入角色编号",
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