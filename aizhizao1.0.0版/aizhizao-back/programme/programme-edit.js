Module.define("system.programme", function(page, $) {
	var param = getRequest();
	var caseCode = param["caseCode"];
	var paramData = [];
	var paramsId = [];
	page.ready = function() {
		initValidate();
		getClassificationParent();
		getCaseInfo();
		initDataTable();
		paramDatalist();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#classifconfirm").bind("click", classifconfirm);
		$("#PreservationButton").bind("click", Select);
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$("#Search2").bind("click", function() {		
			$(".ones").empty();
			$(".toos").empty();
			$(".three").empty();
			getClassificationParent();
		});
        
        $("#dianji").on('click','.ones li',function(){
			if($(this).hasClass('zhengc')){  //加
				$(this).addClass('curr');
				$(this).removeClass('zhengc');
				$(this).parents('.col-sm-4').next().find('.toos').show();
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		$("#dianji").on('click','.toos li',function(){
			if($(this).hasClass('zhengc')){  //加
				$(this).addClass('curr');
				$(this).removeClass('zhengc');
				$(this).parents('.col-sm-4').next().find('.three').show();
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		$("#dianji").on('click','.three li',function(){
			if($(this).hasClass('zhengc')){  //加
				$(this).addClass('curr');
				$(this).removeClass('zhengc');
				$(this).siblings().removeClass('curr');
				$(this).siblings().addClass('zhengc');
			}
		})
		
	}
	
	//详情
	function getCaseInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/case/getCaseInfo",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'caseCode': caseCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$("#file2").change(function(){
					    $("#pic1").attr("src",URL.createObjectURL($(this)[0].files[0]));
					});
					if(data.casePicUrl==null){
						$('#pic1').attr("src", '../images/ewma.jpg');
					}else{
						$('#pic1').attr("src", data.casePicUrl);
					}
					$("input[name='programmename']").val(data.caseName);
					$('#classifname').html(data.classificationName);
					$('#classifcord').html(data.classificationCode);
					$('#assortmentId').html(data.classificationId);
					
					if(data.caseStatus == 1) {
						$("#Required").attr("checked", "checked");
					}else if(data.caseStatus == 2){
						$("#Selection").attr("checked", "checked");
					}
					$('#remark').val(data.remark);
					
					var caseParamsData = data.caseParamsList;
					for(var i = 0;i < caseParamsData.length; i++){
						var Newsobj3 = {
							"id" : caseParamsData[i].id,
							"paramName" : caseParamsData[i].paramsName,
							"paramCode" : caseParamsData[i].paramsCode,
							"paramsType" : caseParamsData[i].paramsType,
							"paramValue" : caseParamsData[i].paramsValue,
						}
						paramData.push(Newsobj3);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//分类列表
	function getClassificationParent() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/getClassificationParent",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'param': $("input[name='nameNo']").val()
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					for(var i = 0;i<data.length;i++){
						var assortmentCode = data[i].assortmentCode;
						var assortmentName = data[i].assortmentName;
						var assortmentId = data[i].id;
						li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' onclick=\"system.programme.getClassificationChild(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
				    }
					$(".ones").append(li);
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.getClassificationChild = function(assortmentCode) {
		$('.toos').empty();
		$('.three').empty();
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/getClassificationChild",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'parentCode': assortmentCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					if(!data || !data.length){
						li += "<li>无任何分类</li>";
						$(".toos").append(li);
					}else{
						for(var i = 0;i<data.length;i++){
							var assortmentCode = data[i].assortmentCode;
							var assortmentName = data[i].assortmentName;
							var assortmentId = data[i].id;
							li += "<li class='zhengc' assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' onclick=\"system.programme.getClassificationChild2(\'" + assortmentCode + "\');\"><i class='fa fa-angle-right'></i>" + assortmentName + "</li>"
					    }
						$(".toos").append(li);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.getClassificationChild2 = function(assortmentCode) {
		$('.three').empty();
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/product/getClassificationChild",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'parentCode': assortmentCode
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					if(!data || !data.length){
						li += "<li>无任何分类</li>";
						$(".three").append(li);
					}else{
						for(var i = 0;i<data.length;i++){
							var assortmentCode = data[i].assortmentCode;
							var assortmentName = data[i].assortmentName;
							var assortmentId = data[i].id;
							li += "<li assortmentCode='" + assortmentCode + "' assortmentId='" + assortmentId + "' class='zhengc'>" + assortmentName + "</li>"
					    }
						$(".three").append(li);
					}
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//添加分类
	function classifconfirm() {
		var ones = $('.ones li.curr').text();
		var onesAssortmentcode = $('.ones li.curr').attr('assortmentcode');
		var onesassortmentId = $('.ones li.curr').attr('assortmentId');
		var toos = $('.toos li.curr').text();
		var toosAssortmentcode = $('.toos li.curr').attr('assortmentcode');
		var toosassortmentId = $('.toos li.curr').attr('assortmentId');
		var three = $('.three li.curr').text();
		var threeAssortmentcode = $('.three li.curr').attr('assortmentcode');
		var threeassortmentId = $('.three li.curr').attr('assortmentId');
		//判断li的个数
		var oneslength = $('.ones li.zhengc').length + $('.ones li.curr').length;
		var tooslength = $('.toos li.zhengc').length + $('.toos li.curr').length;
		var threelength = $('.three li.zhengc').length + $('.three li.curr').length;
		if(!ones || !onesAssortmentcode){
			alert('请选择一级分类');
			return;
		}else if(tooslength >= 1){
			if(!toos || !toosAssortmentcode){
				alert('请选择二级分类');
				return;
			}else if(threelength >= 1){
				if(!three || !threeAssortmentcode){
					alert('请选择三级分类');
					return;
				}else{
					$('#classifname').html(three);
					$('#classifcord').html(threeAssortmentcode);
					$('#assortmentId').html(threeassortmentId);
					$('#myModal').modal('hide');
				}
			}else{
				/*$('#classifname').html(toos);
				$('#classifcord').html(toosAssortmentcode);
				$('#assortmentId').html(toosassortmentId);
				$('#myModal').modal('hide');*/
				alert('请选择有三级的分类组');
				return;
			}
		}else{
			/*$('#classifname').html(ones);
			$('#classifcord').html(onesAssortmentcode);
			$('#assortmentId').html(onesassortmentId);
			$('#myModal').modal('hide');*/
			alert('请选择有三级的分类组');
			return;
		}
		initDataTable();
		dataTable.ajax.reload();
	}

	//增加方案
	function submitForm() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		for(var i = 0 ; i < paramData.length;i++){
	    	paramsId.push(paramData[i].id)
	    }
		if(!$("#classifcord").html()){
			alert('请选择分类');
			return;
		}
		
		if(!paramsId || !paramsId.length){
			alert('请添加参数');
			return false;
		}
		if(!file1){
	   		var isEditPic = 0
	   	}else{
	   		var isEditPic = 1
	   	}
		
	    var file1 = document.basicForm2.file2.files[0];
			
		var fm = new FormData();
		fm.append('classificationId', $('#assortmentId').html());
		fm.append('caseCode', caseCode);
		fm.append('caseName', $("input[name='programmename']").val());
		fm.append('caseStatus', $("input[name='fill']:checked").val());
		fm.append('remark', $('#remark').val());
		fm.append('paramsId', paramsId);
		if(!file1){}else{fm.append('caseFile', file1);}
		fm.append('isEditPic', isEditPic);
		$.ajax({
	        type :'POST',
	        url : ulrTo+"/azz/api/merchant/case/editCase",
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		window.location.href = "#!programme/programme-management.html";
				} else {
					alert(data.msg);
				}
	        }
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
				param.assortmentId = $('#assortmentId').html();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/merchant/case/getCaseParamList",
				 	cache: false, //禁用缓存   
				 	async: false,
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
					"title": '<input id="checkUuid" onclick="system.programme.checkAll()" type="checkbox">',
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render": function(data, type, row, meta) {
						return '<input onclick="system.programme.checkQx()" name="deviceUuid" uuid="'+row.id+'" paramCode="'+row.paramCode+'" paramName="'+row.paramName+'" paramsType="'+row.paramsType+'" paramValue="'+row.paramValue+'" type="checkbox">';
					}
				}, // 序号
				{
					"title": "产品参数编号",
					"data": "paramCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "产品参数名称",
					"data": "paramName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "产品参数格式",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.paramsType) {
							case 1:
								return '下拉选择';
								break;
							case 2:
								return '参数填写';
								break;
						};
					}
				},
				{
					"title": "参数值",
					"data": "paramValue",
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
		paramsId.splice(0,paramsId.length);
		$('input[name="deviceUuid"]:checked').each(function(){
			var existsFlag = false;
			for(var i=0;i<paramData.length;i++){
				if($(this).attr("paramCode") == paramData[i].paramCode){
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
				"id" : $(this).attr("uuid"),
				"paramCode" : $(this).attr("paramCode"),
				"paramName" : $(this).attr("paramName"),
				"paramsType" : $(this).attr("paramsType"),
				"paramValue" : $(this).attr("paramValue"),
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
				var paramCode = paramData[i].paramCode;
				var paramName = paramData[i].paramName;
				var paramsType = paramData[i].paramsType;
				var paramValue = paramData[i].paramValue;
				if(paramsType==1){
					var paramsType = '下拉选择'
				}else{
					var paramsType = '参数填写'
				}
				if(paramValue=="undefined" || paramValue==undefined){
					var paramValue = '-'
				}else{
					var paramValue = paramValue
				}
				tr += "<tr><td>"+ paramName +"</td>"
				+ "<td>"+ paramCode +"</td>"
				+ "<td>"+ paramsType +"</td>"
				+ "<td>"+ paramValue +"</td>"
				+ "<td><a onclick=\"system.programme.delDeptInfo2(\'" + paramCode + "\');\" href='javascript:;'>删除</a></td></tr>";
			}
			$("#parameData").append(tr);
		}
	}
	page.delDeptInfo2 = function(paramCode) {
		$.each(paramData,function(index,item){
			// index是索引值（即下标）   item是每次遍历得到的值；
			if(item.paramCode== paramCode){
				paramData.splice(index,1);
				$("#parameData").empty();
				paramDatalist();
				return false;
			}
		});
		paramsId.splice(0,paramsId.length);
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