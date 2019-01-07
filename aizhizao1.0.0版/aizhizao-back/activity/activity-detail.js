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