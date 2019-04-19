Module.define("system.activitysign", function(page, $) {
	page.ready = function() {
		var E = window.wangEditor;
        page.editor = new E('#editor');
        page.editor.customConfig.uploadImgShowBase64 = true;
        page.editor.create();
		initValidate();
		$("#SubmissionBtn").bind("click", submitForm);

		$("#file").change(function(){
			$("#pic").show();
		    $("#pic").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		jeDate("#beginstime",{
	        isinitVal:false,
	        minDate: '2016-06-16',
	        maxDate: '2035-06-16',
	        format: 'YYYY-MM-DD hh:mm:ss',
	        zIndex:3000
	    });
	    
	    jeDate("#beginstimeEnd",{
	        isinitVal:false,
	        minDate: '2016-06-16',
	        maxDate: '2035-06-16',
	        format: 'YYYY-MM-DD hh:mm:ss',
	        zIndex:3000
	    });
		
	}
	
	//增加
	function submitForm() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var file = document.basicForm.file.files[0];
		
		var fm = new FormData();
		fm.append('activityAddress', $("input[name='place']").val());
		fm.append('activityName', $("input[name='activityname']").val());
		fm.append('activityTime', $("input[name='beginstime']").val());
		fm.append('status', $("input[name='fill']:checked").val());
		fm.append('deadline', $("input[name='beginstimeEnd']").val());
		fm.append('signUpLimit', $("input[name='limit']").val());
		fm.append('activityPicFile', file);
		fm.append('activityContent', page.editor.txt.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/activity/addActivity',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('新增成功！');
					window.location.href = "#!activitysign/activitySign-management.html";
				} else {
					alert(data.msg);
				}
	        }
	    });

	}
	
	function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			activityname: "required",
   			beginstime: "required",
   			beginstimeEnd: "required",
   			place: "required",
   			limit: "required",
   			file: "required",
   		},
   		messages: {
   			activityname: "请输入活动名称",
   			beginstime: "请选择活动开始时间",
   			beginstimeEnd: "请选择报名截止时间",
   			place: "请输入活动地点",
   			limit: "请输入报名人数",
   			file: "请上传活动主图",
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