var activityCodeDetail = JSON.parse(localStorage.getItem('activityCodeDetail'));
Module.define("system.activitysign", function(page, $) {
	page.ready = function() {
		initDataTable();
		getCourseDetail();
	}
	
	//活动详情
	function getCourseDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/activity/getPlatformActivityDetail",
			cache: false, //禁用缓存
			async: false,
			data: {
				'activityCode':activityCodeDetail,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					
					$("#place").html(data.data.activityAddress);
					$("#activityname").html(data.data.activityName);
					$("#pic").attr("src",data.data.activityPicUrl);
					if(data.data.status == 1) {
						$("#Required").html("上架");
					}else if(data.data.activityInfo.status == 2){
						$("#Required").html("下架");
					}
					$("#beginstime").html(data.data.activityTime);
					$("#beginstimeEnd").html(data.data.deadline);
					$("#limit").html(data.data.signUpLimit+'人');
					$("#signUpCount").html(data.data.signUpCount);
					
					
					
					
					$('#editorsa').html(data.data.activityContent);
					
				} else {
					alert(data.msg)
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
				param.activityCode = activityCodeDetail;
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/activity/getPlatformSignUpInfos",
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
					"title": "微信头像",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var img = '<div class="wxtu"><img src=' + row.headImageUrl +' width="100" height="60" alt="" /></div>';
						return img;
					}
				}, // 序号
				{
					"title": "微信名称",
					"data": "nickname",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "报名人姓名",
					"data": "userName",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "手机号",
					"data": "phoneNumber",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "公司名称",
					"data": "companyName",
					"className": "all",
					"defaultContent": "-",
				},
				{
					"title": "职位",
					"data": "position",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "报名时间",
					"data": "signUpTime",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
			],
		});
	}
	
});