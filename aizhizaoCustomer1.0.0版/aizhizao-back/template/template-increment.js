Module.define("system.templateincer", function(page, $) {
	var dataTable;
	page.ready = function() {
		initDataTable();
		init();
		$("#confirm").bind("click", addUser);
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

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
				param.pageNum = data.start/10+1;
				param.pageSize = data.length;
				param.invoiceType = 1;
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/client/invoice/getInvoiceTemplateList",
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
					"title": "单位名称",
					"data": "companyName",
					"className": "all",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "纳税人识别号",
					"data": "number",
					"className": "all",
					"defaultContent": "-"
				},
				{
					"title": "开户银行",
					"data": "bank",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "银行账户",
					"data": "bankAccount",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "注册地址",
					"data": "regAddress",
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
			            		html += '<a href="javascript:;" onclick="system.templateincer.getUserInfo(\'' + row.id + '\');">编辑</a>';
			            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.templateincer.delDeptInfo(\'' + row.id + "','"+ row.companyName + '\');">删除</a>';
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
	
	//增加
	function addUser() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/invoice/addEditInvoiceTemplate",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'invoiceType': 1,
         	    'companyName': $("input[name='companyname']").val(),
				'number': $("input[name='paytaxes']").val(),
				'regAddress': $("input[name='registered']").val(),
				'regPhone': $("input[name='telephone']").val(),
				'bank': $("input[name='bank']").val(),
				'bankAccount': $("input[name='account']").val(),
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					dataTable.ajax.reload();
					$('#myModal111').modal('show');
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//详情
	page.getUserInfo = function(id) {
		$.ajax({
			type: "GET",
			url: ulrTo+"/azz/api/client/invoice/getClientInvoiceTemplateDetail",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'invoiceId': id
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='companyname2']").val(data.data.companyName);
					$("input[name='paytaxes2']").val(data.data.taxIdentificationNumber);
					$("input[name='registered2']").val(data.data.regAddress);
					$("input[name='telephone2']").val(data.data.regTelephone);
					$("input[name='bank2']").val(data.data.bank);
					$("input[name='account2']").val(data.data.bankAccount);
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.templateincer.editUser(\'" + id + "\');")
	}
	
	//编辑
	page.editUser = function(id) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/invoice/addEditInvoiceTemplate",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'id': id,
         	    'invoiceType': 1,
         	    'companyName': $("input[name='companyname2']").val(),
				'number': $("input[name='paytaxes2']").val(),
				'regAddress': $("input[name='registered2']").val(),
				'regPhone': $("input[name='telephone2']").val(),
				'bank': $("input[name='bank2']").val(),
				'bankAccount': $("input[name='account2']").val(),
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
	
	
	//删除
	page.delDeptInfo = function(id,companyName) {
		$('#bmName').html(companyName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.templateincer.delDeptInfotoo(\'" + id + "\');")
	}
	page.delDeptInfotoo = function(id) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/invoice/delInvoiceTemplate",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'id': id
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
				companyname: {
	   				required: true,
	   			},
				paytaxes: {
	   				required: true,
	   			},
				registered: {
	   				required: true,
	   			},
				telephone: {
	   				required: true,
	   				isMobile: true,
	   			},
				bank: {
	   				required: true,
	   			},
				account: {
	   				required: true,
	   			}
			},
			messages: {
				invoice: {
	   				required: "请输入公司名称",
	   			},
				paytaxes: {
	   				required: "请输入纳税识别号",
	   			},
				registered: {
	   				required: "请输入注册地址",
	   			},
				telephone: {
	   				required: "请输入注册电话",
	   			},
				bank: {
	   				required: "请输入开户银行",
	   			},
				account: {
	   				required: "请输入银行账号",
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
				companyname2: {
	   				required: true,
	   			},
				paytaxes2: {
	   				required: true,
	   			},
				registered2: {
	   				required: true,
	   			},
				telephone2: {
	   				required: true,
	   				isMobile: true,
	   			},
				bank2: {
	   				required: true,
	   			},
				account2: {
	   				required: true,
	   			}
			},
			messages: {
				invoice2: {
	   				required: "请输入公司名称",
	   			},
				paytaxes2: {
	   				required: "请输入纳税识别号",
	   			},
				registered2: {
	   				required: "请输入注册地址",
	   			},
				telephone2: {
	   				required: "请输入注册电话",
	   			},
				bank2: {
	   				required: "请输入开户银行",
	   			},
				account2: {
	   				required: "请输入银行账号",
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