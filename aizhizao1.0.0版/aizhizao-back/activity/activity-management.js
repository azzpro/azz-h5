Module.define("system.activity", function(page, $) {
	page.ready = function() {
		init();
		initDataTable();
		$("#Search").bind("click", function() {
			$("#activityList").empty();
			initDataTable();
		});
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			/*$("#tabs").empty();
			getClassificationList();*/
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$("#img1").attr("src",'');
			$("#img2").attr("src",'');
		});
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$("#file2").change(function(){
		    $("#img2").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$("#confirm").bind("click", addSpecial);
	}
	//增加
	function addSpecial() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var file1 = document.basicForm.file1.files[0];
		var file2 = document.basicForm.file2.files[0];
		var fm = new FormData();
		fm.append('specialName', $('input[name="zcname"]').val());
		fm.append('mainFile', file1);
		fm.append('bgFile', file2);
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/addSpecial",
			cache: false, //禁用缓存
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
					$("#activityList").empty();
					initDataTable();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//列表
	function initDataTable() {
		$.ajax({
			type:"POST",
			url:ulrTo + "/azz/api/platform/specialPerformance/searchSpecialList",
			async:false,
			cache: false, //禁用缓存
			data: {
				pageNum: '1',
				pageSize: '12',
				specialPerformanceName : $("input[name='nameNo']").val(),
				status : $('#approvalType').val()
			},
			dataType: "json", 
			success: function (data) {
				if (data.code == 0) {
					$('#total').html(data.data.total);
					var rows = data.data.rows;
					
					if(!rows || !rows.length){
						var nodata = "<p class='text-center'>表中数据为空</p>";
						$("#activityList").append(nodata);
					}else{
						var htmlArr = "";
						for(var i = 0;i < rows.length; i++){
							var specialPerformanceName = rows[i].specialPerformanceName;//专场名称
							var specialPerformanceCode = rows[i].specialPerformanceCode;//专场编码
							var specialPerformanceMainPicUrl = rows[i].specialPerformanceMainPicUrl;//专场主图
							var interviewNumber = rows[i].interviewNumber;//访问人数
							var moduleNumber = rows[i].moduleNumber;//模组数量
							var productNumber = rows[i].productNumber;//产品数量
							var status = rows[i].status;//状态
							if(rows[i].createTime){
									var createTime = rows[i].createTime.substring(0,10);//创建时间
								}else{
									var createTime = "-"
								}
							if(status == 1){
								var statustoo = "<span class='jxz'>进行中</span>";
							}else{
								var statustoo = "<span class='yxj'>已下架</span>";
							}
							if(interviewNumber == null){
								var interviewNumber = "-"
							}
							if(moduleNumber == null){
								var moduleNumber = "-"
							}
							if(productNumber == null){
								var productNumber = "-"
							}
							htmlArr += "<div class='col-sm-3'><div class='well activity'><a onclick=\"system.activity.getColumnInfo(\'" + specialPerformanceCode + "\');\" href='javascript:;'><div class='activity-tu'><img src='"+ specialPerformanceMainPicUrl +"' alt='' /></div>"
								+ "<h3 class='activity-name'>"+ statustoo + specialPerformanceName +"</h3><div class='activity-zi'>"
								+ "<p><span>访问人数："+ interviewNumber +"</span>"+ createTime +"</p><p><span>模组数量："+ moduleNumber +"</span>产品数量："+ productNumber +"</p></div></a></div></div>"
								
							
						}
						$("#activityList").append(htmlArr);
					}
					Pagination();
				}else{
					alert(data.msg)
				}
			}
		});
		
	}
	
	function Pagination(){
		$('.M-box').pagination({
		    totalData: parseInt($('#total').html()),
		    //jump: true,
		    showData: 12,
		    isHide: true,
		    coping: true,
		    prevContent: '上一页',
   			nextContent: '下一页',
		    callback: function (api) {
		        var data = {
					pageNum: api.getCurrent(),
					pageSize: 12,
					specialPerformanceName : $("input[name='nameNo']").val(),
					status : $('#approvalType').val()
		        };
		        $.getJSON(ulrTo + '/azz/api/platform/specialPerformance/searchSpecialList#!method=POST', data, function (data) {
		        	
		        	$("#activityList").empty();
		        	var rows = data.data.rows;
					if(!rows || !rows.length){
						var nodata = "<p class='text-center'>表中数据为空</p>";
						$("#activityList").append(nodata);
					}else{
						var htmlArr = "";
						for(var i = 0;i < rows.length; i++){
							var specialPerformanceName = rows[i].specialPerformanceName;//专场名称
							var specialPerformanceCode = rows[i].specialPerformanceCode;//专场编码
							var specialPerformanceBgPicUrl = rows[i].specialPerformanceBgPicUrl;//专场主图
							var interviewNumber = rows[i].interviewNumber;//访问人数
							var moduleNumber = rows[i].moduleNumber;//模组数量
							var productNumber = rows[i].productNumber;//产品数量
							var status = rows[i].status;//状态
							if(rows[i].createTime){
								var createTime = rows[i].createTime.substring(0,10);//创建时间
							}else{
								var createTime = "-"
							}
							
							if(status == 1){
								var statustoo = "<span class='jxz'>进行中</span>";
							}else{
								var statustoo = "<span class='yxj'>已下架</span>";
							}
							if(interviewNumber == null){
								var interviewNumber = "-"
							}
							if(moduleNumber == null){
								var moduleNumber = "-"
							}
							if(productNumber == null){
								var productNumber = "-"
							}
							htmlArr += "<div class='col-sm-3 col-lg-2'><div class='well activity'><a onclick=\"system.activity.getColumnInfo(\'" + specialPerformanceCode + "\');\" href='javascript:;'><div class='activity-tu'><img src='"+ specialPerformanceBgPicUrl +"' alt='' /></div>"
								+ "<h3 class='activity-name'>"+ statustoo + specialPerformanceName +"</h3><div class='activity-zi'>"
								+ "<p><span>访问人数："+ interviewNumber +"</span>"+ createTime +"</p><p><span>模组数量："+ moduleNumber +"</span>产品数量："+ productNumber +"</p></div></a></div></div>"
								
							
						}
						$("#activityList").append(htmlArr);
					}
					
		            
		        });

		        
		    }
		});
	}
	
	//编辑
	page.getColumnInfo = function(specialPerformanceCode) {
		if(!window.localStorage){
            return false;
        }else{
            var storage=window.localStorage;
            var specialPerformanceCode = JSON.stringify(specialPerformanceCode);
            storage["specialPerformanceCode"]= specialPerformanceCode;
        }
        window.location.href = "#!activity/activity-detail.html"
	}

	function init() {
		$("#basicForm").validate({
			rules: {
				zcname: {
					required: true,
				},
				file1: "required",
				file2: "required",
			},
			messages: {
				zcname: {
					required: "请输入活动名称",
				},
				file1: "请上传专场主图",
				file2: "请上传专场背景",
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