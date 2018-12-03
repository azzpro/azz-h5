Module.define("system.article", function(page, $) {
	page.ready = function() {
		getColumnLsit();
		initDataTable();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
	}
	
	function getColumnLsit() {
		$.ajax({
			type: 'POST',
			url: ulrTo + '/azz/api/index/getColumnLsit',
			cache: false, //禁用缓存    
			dataType: "json",
			success: function(data) {
				if(data.code == 0) {
					var arr = [];
					arr.push('<option value=" ">全部</option>');
					for(var i = 0, len = data.data.length; i < len; i++) {
						arr.push('<option value="');
						arr.push(data.data[i].id);
						arr.push('">');
						arr.push(data.data[i].columnName);
						arr.push('</option>');
					}
					$("#approvalType").html(arr.join(''));
				} else {

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
				param.articleTitle = $("input[name='searchname']").val();
				param.columnId = $("#approvalType").val();
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/index/getArticleList",
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
					"title": "文章主图",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						var img = '<img src=' + row.articlePicUrl +' width="60" height="60" alt="" />';
						return img;
					}
				}, // 序号
				{
					"title": "文章标题",
					"data": "articleTitle",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "所属栏目",
					"data": "columnName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "创建人",
					"data": "creator",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "创建时间",
					"data": "createTime",
					"className": "text-nowrap",
					"defaultContent": "无"
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
	            			html += '&nbsp;&nbsp;<a href="javascript:;" onclick="system.article.getColumnInfo(\'' + row.articleId + '\');">编辑</a>';
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.article.delDeptInfo(\'' + row.articleId + "','"+ row.articleTitle + '\');">删除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
			            	
						}
		            }
				}
			],
		});
	}
	//编辑
	page.getColumnInfo = function(articleId) {
		if(!window.localStorage){
            return false;
        }else{
            var storage=window.localStorage;
            var articleId = JSON.stringify(articleId);
            storage["articleId"]= articleId;
        }
        window.location.href = "#!article/article-edit.html"
	}
	//删除
	page.delDeptInfo = function(articleId,articleTitle) {
		$('#bmName').html(articleTitle);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.article.delDeptInfotoo(\'" + articleId + "\');")
	}
	page.delDeptInfotoo = function(articleId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/index/delArticle",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'articleId': articleId,
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