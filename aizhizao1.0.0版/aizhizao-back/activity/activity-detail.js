Module.define("system.activity", function(page, $) {
	page.ready = function() {
		init();
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
	}
	
	//编辑
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