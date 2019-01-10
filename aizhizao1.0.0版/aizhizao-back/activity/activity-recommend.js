var specialPerformanceCode = JSON.parse(localStorage.getItem('specialPerformanceCode'));
Module.define("system.activity", function(page, $) {
	page.ready = function() {
		init();
		getRecommendInfos();
		$("#Search").bind("click", function() {
			$("#activityListToo").empty();
			getRecommendInfos();
		});
		$("#Search2").bind("click", function() {
			dataTable.ajax.reload();
		});
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
		$('#myModal3').on('hidden.bs.modal', function(e){
			$("#activityListToo").empty();
			getRecommendInfos();
		});
		$("#confirm").bind("click", addRecommend);
	}
	
	//增加
	function addRecommend() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addRecommend",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'specialPerformanceCode': specialPerformanceCode,
				'recommendName' : $("input[name='zcname']").val(),
				'status' : $("input[name='recommend']:checked").val(),
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					$("#activityListToo").empty();
					getRecommendInfos()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//列表
	function getRecommendInfos() {
		$.ajax({
			type:"POST",
			url:ulrTo + "/azz/api/platform/specialPerformance/getRecommendInfos",
			async:false,
			cache: false, //禁用缓存
			data: {
				'specialPerformanceCode' : specialPerformanceCode,
				'recommendName' : $("input[name='nameNo']").val()
			},
			dataType: "json", 
			success: function (data) {
				if (data.code == 0) {
					$('#total').html(data.data.total);
					var rows = data.data;
					
					if(!rows || !rows.length){
						var nodata = "<p class='text-center'>表中数据为空</p>";
						$("#activityListToo").append(nodata);
					}else{
						var htmlArr = "";
						for(var i = 0;i < rows.length; i++){
							var moduleInfos = rows[i].moduleInfos;
							var recommendCode = rows[i].recommendCode;//组合编码
							var recommendName = rows[i].recommendName;//组合名称
							var status = rows[i].status;//状态
							if(status == 1){
								var statust = "<button class='btn btn-primary zlan' onclick=\"system.activity.lower(\'" + recommendCode + "\');\">下架推荐</button>"
							}else{
								var statust = "<button class='btn btn-primary zlan' onclick=\"system.activity.upper(\'" + recommendCode + "\');\">上架推荐</button>"
							}
							var htmlPro = "";
							if(!moduleInfos || !moduleInfos.length){
								htmlPro = "<p class='text-center'>表中数据为空</p>";
							}else{
								for(var j = 0;j < moduleInfos.length; j++){
									var moduleCode = moduleInfos[j].moduleCode;
									var moduleName = moduleInfos[j].moduleName;
									var moduleStatus = moduleInfos[j].moduleStatus;
									var modulePicUrl = moduleInfos[j].modulePicUrl;
									
									if(moduleInfos[j].moduleMinDeliveryDate){
										var moduleMinDeliveryDate = moduleInfos[j].moduleMinDeliveryDate;
									}else{
										var moduleMinDeliveryDate = '-'
									}
									if(moduleInfos[j].moduleMinPrice){
										var moduleMinPrice = moduleInfos[j].moduleMinPrice;
									}else{
										var moduleMinPrice = '-'
									}
									
									if(moduleStatus == 1){
										var statustoo = "<span class='jxz'>上架中</span>";
									}else{
										var statustoo = "<span class='yxj'>已下架</span>";
									}
									if(moduleName.length > 8){
										var moduleName = moduleName.substring(0,8)+'...'
									}
									htmlPro += "<div class='col-sm-3'><div class='well activity'><div class='activity-tu'><img src='"+ modulePicUrl +"' alt='' /></div>"
											 + "<h3 class='activity-name'>"+ statustoo + "<font class='jqzi'>"+ moduleName +"</font></h3><div class='activity-zi'><p>起步价格/交期："+ moduleMinPrice +"(元)/"+ moduleMinDeliveryDate +"(天)</p></div></div></div>";
								}
							}
							htmlArr += "<div class='panel-heading'><h4 class='panel-title'><div class='pull-right'>"
							         + "<button class='btn btn-primary zlan' onclick=\"system.activity.edit(\'" + recommendCode + "','" + recommendName + "','" + status + "\');\">编辑推荐</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							         + statust
							         + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-primary zlan' onclick=\"system.activity.initDataTable(\'" + recommendCode + "','" + recommendName + "\');\">关联模组</button></div>"+ recommendName +"</h4></div><div class='row mt10'>"
									 + htmlPro
							         + "</div>";
							
						}
						$("#activityListToo").append(htmlArr);
					}
				}else{
					alert(data.msg)
				}
			}
		});
		
	}
	
	//编辑
	page.edit = function(recommendCode,recommendName,status) {
		$('#myModal2').modal('show');
		$('input[name="zcname2"]').val(recommendName);
		if(status == 1){
			$("#upper2").attr("checked", "checked");
		}else{
			$("#lower2").attr("checked", "checked");
		}
		$('#confirm2').attr("onclick", "system.activity.edittoo(\'" + recommendCode + "\');")
	}
	page.edittoo = function(recommendCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
				return;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/editRecommend",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'recommendCode': recommendCode,
				'recommendName' : $("input[name='zcname2']").val(),
				'status' : $("input[name='recommend2']:checked").val(),
			},
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$("#activityListToo").empty();
					getRecommendInfos()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//下架
	page.lower = function(recommendCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/putOnOrPutOffRecommend",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'recommendCode': recommendCode,
				'status' : 2,
			},
			success: function(data) {
				if (data.code == 0) {
					$("#activityListToo").empty();
					getRecommendInfos();
					alert("下架成功")
				} else {
					alert(data.msg)
				}
			}
		});
	}
	//上架
	page.upper = function(recommendCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/putOnOrPutOffRecommend",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'recommendCode': recommendCode,
				'status' : 1,
			},
			success: function(data) {
				if (data.code == 0) {
					$("#activityListToo").empty();
					getRecommendInfos();
					alert("上架成功")
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.initDataTable = function(recommendCode,recommendName) {
		$('#myModal3').modal('show');
		$('#recommendNameA').html(recommendName);
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
				param.recommendCode = recommendCode;
				param.searchInput = $("input[name='searchname']").val();
				//当前页码
				 $.ajax({
				 	type: "POST",
				 	url: ulrTo + "/azz/api/platform/specialPerformance/getRelatedModuleInfos",
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
					"title": "模组编号",
					"data": "moduleCode",
					"className": "text-nowrap",
					"defaultContent": "-"
				}, // 序号
				{
					"title": "模组名称",
					"data": "moduleName",
					"className": "",
					"defaultContent": "-"
				},
				{
					"title": "所属分类",
					"data": "classificationName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "所属商户",
					"data": "merchantName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "上架状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.moduleStatus) {
							case 1:
								return '上架';
								break;
							case 2:
								return '下架';
								break;
						};
					}
				},
				{
					"title": "关联状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						switch(row.relatedStatus) {
							case 0:
								return '未关联 ';
								break;
							case 1:
								return '已关联';
								break;
						};
					}
				},
				{
					"title": "操作",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.relatedStatus == 0){
							var removeincrease = '<a onclick="system.activity.increase(\'' + row.moduleCode + "','"+ recommendCode + '\');" class="btn btn-primary zlan" href="javascript:;">新增</a>'
						}else{
							var removeincrease = '<a onclick="system.activity.remove(\'' + row.moduleCode + "','"+ recommendCode + '\');" class="btn btn-primary zlan" href="javascript:;">移除</a>'
						}
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += removeincrease;
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	
	//新增
	page.increase = function(moduleCode,recommendCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addOrRemoveModule",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'moduleCode': moduleCode,
				'recommendCode': recommendCode,
				'addOrRemove' : 1,
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
	
	//移除
	page.remove = function(moduleCode,recommendCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addOrRemoveModule",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'moduleCode': moduleCode,
				'recommendCode': recommendCode,
				'addOrRemove' : 2,
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
				zcname: {
					required: true,
				},
			},
			messages: {
				zcname: {
					required: "请输入推荐名称",
				},

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
				zcname2: {
					required: true,
				},
			},
			messages: {
				zcname2: {
					required: "请输入推荐名称",
				},

			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
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