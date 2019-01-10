var specialPerformanceCode = JSON.parse(localStorage.getItem('specialPerformanceCode'));
Module.define("system.activity", function(page, $) {
	page.ready = function() {
		init();
		specialInfo();
		$('#specialCodetoo').html(specialPerformanceCode);
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$("#img1").attr("src",'');
			$("#img2").attr("src",'');
			specialInfo()
		});
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		$("#file2").change(function(){
		    $("#img2").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$("#Lower").bind("click", Lower);
		$("#Upper").bind("click", Upper);
		$("#confirm").bind("click", editSpecial);
	}
	
	//详情
	function specialInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/specialInfo",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'code': specialPerformanceCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='zcname']").val(data.data.specialPerformanceName);
					$('#MainPic').attr("src", data.data.specialPerformanceMainPicUrl);
					$('#BgPic').attr("src", data.data.specialPerformanceBgPicUrl);
					if(data.data.interviewNumber){
						$('#xxjl').html(data.data.interviewNumber);
					}else{
						$('#xxjl').html('-');
					}
					if(data.data.moduleNumber){
						$('#dzf').html(data.data.moduleNumber);
					}else{
						$('#dzf').html('-');
					}
					if(data.data.productNumber){
						$('#dqc').html(data.data.productNumber);
					}else{
						$('#dqc').html('-');
					}
					if(data.data.status == 1){
						$('#Lower').show();
						$('#Upper').hide();
					}else{
						$('#Lower').hide();
						$('#Upper').show();
					}
					
				}else {
					alert(data.msg)
				}
			}
		});
	}
	
	//下架
	function Lower() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/changeStatus",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'specialCode': specialPerformanceCode,
				'status' : 'N'
			},
			success: function(data) {
				if (data.code == 0) {
					specialInfo();
					alert('下架成功')
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//上架
	function Upper() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/changeStatus",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'specialCode': specialPerformanceCode,
				'status' : 'Y'
			},
			success: function(data) {
				if (data.code == 0) {
					specialInfo();
					alert('上架成功')
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//编辑
	function editSpecial() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var file1 = document.basicForm.file1.files[0];
		var file2 = document.basicForm.file2.files[0];
		if(!file1){
	   		var isEditMainPic = 0
	   	}else{
	   		var isEditMainPic = 1
	   	}
	   	if(!file2){
	   		var isEditBgPic = 0
	   	}else{
	   		var isEditBgPic = 1
	   	}
		var fm = new FormData();
		fm.append('specialName', $('input[name="zcname"]').val());
		fm.append('specialCode', specialPerformanceCode);
		fm.append('isEditMainPic', isEditMainPic);
		fm.append('isEditBgPic', isEditBgPic);
		if(!file1){}else{fm.append('mainFile', file1);}
		if(!file2){}else{fm.append('bgFile', file2);}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/specialPerformance/editSpecial",
			cache: false, //禁用缓存
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal').modal('hide');
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
					required: "请输入活动名称",
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