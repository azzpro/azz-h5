Module.define("system.template", function(page, $) {
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
		$('#myModal2').on('hidden.bs.modal', function(e){
			$("input[name='Password2']").val('');
			$("input[name='ConfirmPassword2']").val('');

		});
		
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
				param.invoiceType = 0;
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
					"title": "发票票抬头",
					"data": "title",
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
					"title": "备注",
					"data": "remark",
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
			            		html += '<a href="javascript:;" onclick="system.template.getUserInfo(\'' + row.id + '\');">编辑</a>';
			            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.template.delDeptInfo(\'' + row.id + "','"+ row.title + '\');">删除</a>';
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
				'invoiceType': 0,
         	    'invoiceTitle': $("input[name='invoice']").val(),
				'number': $("input[name='paytaxes']").val(),
				'remark': $("#remarks").val()
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
					$("input[name='invoice2']").val(data.data.invoiceTitle);
					$("input[name='paytaxes2']").val(data.data.taxIdentificationNumber);
					$("#remarks2").val(data.data.remark);
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.template.editUser(\'" + id + "\');")
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
				'invoiceType': 0,
         	    'invoiceTitle': $("input[name='invoice2']").val(),
				'number': $("input[name='paytaxes2']").val(),
				'remark': $("#remarks2").val()
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
	page.delDeptInfo = function(id,title) {
		$('#bmName').html(title);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.template.delDeptInfotoo(\'" + id + "\');")
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
				invoice: {
	   				required: true,
	   			},
				paytaxes: {
	   				required: true,
	   			}
			},
			messages: {
				invoice: {
	   				required: "请输入发票抬头",
	   			},
				paytaxes: {
	   				required: "请输入纳税识别号",
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
				invoice2: {
	   				required: true,
	   			},
				paytaxes2: {
	   				required: true,
	   			}
			},
			messages: {
				invoice2: {
	   				required: "请输入发票抬头",
	   			},
				paytaxes2: {
	   				required: "请输入纳税识别号",
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