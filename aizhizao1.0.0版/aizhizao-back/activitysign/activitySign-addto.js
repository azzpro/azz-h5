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
		fm.append('classificationCode', $('#classifcord').html());
		fm.append('courseName', $("input[name='modelname']").val());
		fm.append('brandCode', $('#brandname').val());
		fm.append('status', $("input[name='fill']:checked").val());
		fm.append('courseDescription', $('#textareatext').val());
		fm.append('coursePicFile', file);
		fm.append('courseInfo', page.editor.txt.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/course/addCourse',
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
   			modelname: "required",
   			brandname: "required",
   			textareatext: "required",
   			btd: "required",
   			file: "required",
   		},
   		messages: {
   			modelname: "请输入课程名称",
   			brandname: "请选择品牌",
   			textareatext: "请输入课程简介",
   			btd: "必填项",
   			file: "请上传课程主图",
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