Module.define("system.department", function(page, $) {
	page.ready = function() {
		init();
		getDeptList();
		$("#confirm").bind("click", addDeptInfo);
		
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			$("#tabs").empty();
			getDeptList();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$('#myModal3').on('hidden.bs.modal', function(e){
			$('#basicForm3')[0].reset();
			$("#tabs").empty();
			getDeptList();
			var validFlag = $('#basicForm3').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');

		});
		
		$("#Search").bind("click", function() {		
			$("#tabs").empty();
			getDeptList();
		});
		
		$("#tabs").on('click','.jia',function(){
			if($(this).hasClass('fa-plus-square-o')){  //加
				$(this).addClass('fa-minus-square-o');
				$(this).removeClass('fa-plus-square-o');
				$(this).parents('li').nextAll('.tab2').show();
				$(this).parents('.tab').siblings().find('.jia').addClass('fa-plus-square-o');
			}else{   //减
				$(this).addClass('fa-plus-square-o');
				$(this).removeClass('fa-minus-square-o');
				$(this).parents('li').nextAll('.tab2').hide();
				$(this).parents('.tab').children('.tab2').empty();
				$(this).parents('.tab').children('.tab2').remove();
			}
		})
		$("#tabs").on('click','.jia2',function(){
			if($(this).hasClass('fa-plus-square-o')){  //加
				$(this).addClass('fa-minus-square-o');
				$(this).removeClass('fa-plus-square-o');
				$(this).parents('li').nextAll('.tab3').show();
				$(this).parents('.tab2').siblings().find('.jia2').addClass('fa-plus-square-o');
			}else{   //减
				$(this).addClass('fa-plus-square-o');
				$(this).removeClass('fa-minus-square-o');
				$(this).parents('.tab2').nextAll('.tab3').hide();
				$(this).parents('.tab2').children('.tab3').empty();
				$(this).parents('.tab2').children('.tab3').remove();
			}
		})
	}

	function addDeptInfo() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/addFirstLevelDept",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'deptName': $("input[name='departmentname']").val(),
         	    'parentCode': $("input[name='departmentNo']").val(),
				'status': $("input[name='state']:checked").val()
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					$('#basicForm')[0].reset();
					$("#tabs").empty();
					getDeptList();
					$('#myModal111').modal('show');
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function getDeptList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/searchDeptList",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'deptNameCode': $("input[name='nameNo']").val()
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					for(var i = 0;i<data.length;i++){
						var deptName = data[i].deptName;
						var deptCode = data[i].deptCode;
						var status = data[i].status;
						var creator = data[i].creator;
						var createTime = data[i].createTime;
						var parentCode = data[i].parentCode;
						if(status == 2){
					        var statusswitch = '启用';
				        }else if(status == 1){
				            var statusswitch = '禁用';
				        };
						if(status == 2){
					        var status = '禁用';
				        }else if(status == 1){
				            var status = '启用';
				        };
				        
						li += "<ul class='tab'><li class='tab-li'><span><i onclick=\"system.department.getDeptParentList(\'" + deptCode + "\');\" class='fa fa-plus-square-o jia'></i> " + deptName +"</span><span>" + deptCode +"</span><span>" + status +"</span><span>" + creator +"</span><span>" + createTime +"</span><span><a onclick=\"system.department.addChildDept(\'" + deptCode + "\');\" href='javascript:;'>新建子级</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.editDeptInfo(\'" + deptCode + "','" + deptName + "','" + parentCode + "','" + status + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.statussWitch(\'" + deptCode + "','" + statusswitch + "\');\" href='javascript:;'>" + statusswitch +"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.delDeptInfo(\'" + deptCode + "','" + deptName + "\');\" href='javascript:;'>删除</a></span></li></ul>"
				    }
					$("#tabs").append(li);
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.getDeptParentList = function(deptCode) {
		$('.tab').children('.tab2').empty();
		$('.tab').children('.tab2').remove();
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/searchChildDeptList",
			cache: false, //禁用缓存    
			async: false,
			dataType: "json", 
			data: {
				'parentCode': deptCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var lii = '';
					if(!data || !data.length){
						$(".tab").append(lii);
					}else{
						for(var i = 0;i<data.length;i++){
							var deptName = data[i].deptName;
							var deptCode = data[i].deptCode;
							var status = data[i].status;
							var creator = data[i].creator;
							var createTime = data[i].createTime;
							var parentCode = data[i].parentCode;
							if(status == 2){
						        var statusswitch = '启用';
					        }else{
					            var statusswitch = '禁用';
					        };
							if(status == 2){
						        var status = '禁用';
					        }else if(status == 1){
					            var status = '启用';
					        };
					        
							lii += "<ul class='add tab2' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i onclick=\"system.department.getDeptParentList2(\'" + deptCode + "\');\" class='fa fa-plus-square-o jia2'></i> " + deptName +"</span><span>" + deptCode +"</span><span>" + status +"</span><span>" + creator +"</span><span>" + createTime +"</span><span><a onclick=\"system.department.addChildDept(\'" + deptCode + "\');\" href='javascript:;'>新建子级</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.editDeptInfo(\'" + deptCode + "','" + deptName + "','" + parentCode + "','" + status + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.statussWitch(\'" + deptCode + "','" + statusswitch + "\');\" href='javascript:;'>" + statusswitch +"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.delDeptInfo(\'" + deptCode + "','" + deptName + "\');\" href='javascript:;'>删除</a></span></li></ul>"
					    }
						
						$(".tab").append(lii);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.getDeptParentList2 = function(deptCode) {
		$('.tab2').children('.tab3').empty();
		$('.tab2').children('.tab3').remove();
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/searchChildDeptList",
			cache: false, //禁用缓存    
			async: false,
			dataType: "json", 
			data: {
				'parentCode': deptCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var lii = '';
					if(!data || !data.length){
						$(".tab2").append(lii);
					}else{
						for(var i = 0;i<data.length;i++){
							var deptName = data[i].deptName;
							var deptCode = data[i].deptCode;
							var status = data[i].status;
							var creator = data[i].creator;
							var createTime = data[i].createTime;
							var parentCode = data[i].parentCode;
							if(status == 2){
						        var statusswitch = '启用';
					        }else if(status == 1){
					            var statusswitch = '禁用';
					        };
							if(status == 2){
						        var status = '禁用';
					        }else if(status == 1){
					            var status = '启用';
					        };
					        
							lii += "<ul class='add tab3' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-minus-square-o'></i> " + deptName +"</span><span>" + deptCode +"</span><span>" + status +"</span><span>" + creator +"</span><span>" + createTime +"</span><span><a onclick=\"system.department.editDeptInfo(\'" + deptCode + "','" + deptName + "','" + parentCode + "','" + status + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.statussWitch(\'" + deptCode + "','" + statusswitch + "\');\" href='javascript:;'>" + statusswitch +"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.department.delDeptInfo(\'" + deptCode + "','" + deptName + "\');\" href='javascript:;'>删除</a></span></li></ul>"
					    }
						
						$(".tab2").append(lii);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//新建子级
	page.addChildDept = function(deptCode) {
		$('#myModal3').modal('show');
		$('#addChild').attr("onclick", "system.department.addChildDepttoo(\'" + deptCode + "\');")
	}
	
	page.addChildDepttoo = function(deptCode) {
		var validFlag = $('#basicForm3').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/addChildDept",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'deptName': $("input[name='departmentname3']").val(),
         	    'parentCode': deptCode,
				'status': $("input[name='state3']:checked").val()
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal3').modal('hide');
					$('#basicForm')[0].reset();
					$("#tabs").empty();
					getDeptList();
					$('#myModal111').modal('show');
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//编辑
	page.editDeptInfo = function(deptCode,deptName,parentCode,status) {
		$('#bbmNo').html(deptCode);
		$("input[name='departmentname2']").val(deptName);
		if(!parentCode){
			$("input[name='departmentNo2']").val();
		}else{
			$("input[name='departmentNo2']").val(parentCode);
		}
		if(status == '启用') {
			$("#open").attr("checked", "checked");
		}else if(status == '禁用'){
			$("#Close").attr("checked", "checked");
		}
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.department.editDeptInfotoo(\'" + deptCode + "\');")
	}
	
	page.editDeptInfotoo = function(deptCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/editDept",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'deptName': $("input[name='departmentname2']").val(),
         	    'deptCode': deptCode,
				'parentCode': $("input[name='departmentNo2']").val(),
				'status': $("input[name='state2']:checked").val()
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$("#tabs").empty();
					getDeptList();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//启用禁用
	page.statussWitch = function(deptCode,statusswitch) {
		if(statusswitch == '启用') {
			$.ajax({
				type: "GET",
				url: ulrTo+"/azz/api/merchant/dept/isEnableDept",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'deptCode': deptCode,
					'status' : 1
				},
				success: function(data) {
					if (data.code == 0) {
						$("#tabs").empty();
						getDeptList();
					} else {
						alert(data.msg)
					}
				}
			});
		}else if(statusswitch == '禁用'){
			$.ajax({
				type: "GET",
				url: ulrTo+"/azz/api/merchant/dept/isEnableDept",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'deptCode': deptCode,
					'status' : 2
				},
				success: function(data) {
					if (data.code == 0) {
						$("#tabs").empty();
						getDeptList();
					} else {
						alert(data.msg)
					}
				}
			});
		}
	}
	
	//删除
	page.delDeptInfo = function(deptCode,deptName) {
		$('#bmName').html(deptName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.department.delDeptInfotoo(\'" + deptCode + "\');")
	}
	
	page.delDeptInfotoo = function(deptCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/dept/delDept",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'deptCode': deptCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("#tabs").empty();
					getDeptList();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function init() {
		$("#basicForm").validate({
			rules: {
				departmentname: {
					required: true,
				}
			},
			messages: {
				departmentname: {
					required: "请输入部门名称",
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
				departmentname2: {
					required: true,
				}
			},
			messages: {
				departmentname2: {
					required: "请输入部门名称",
				}
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			}
		});
		$("#basicForm3").validate({
			rules: {
				departmentname3: {
					required: true,
				}
			},
			messages: {
				departmentname3: {
					required: "请输入部门名称",
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