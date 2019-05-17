Module.define("system.soliciting", function(page, $) {
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
		
		
	}
	
	//增加
	function submitForm() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var file = document.basicForm.file.files[0];
		
		var fm = new FormData();
		fm.append('solicitContributionStatus', $("input[name='fill']:checked").val());
		fm.append('solicitContributionName', $("input[name='activityname']").val());
		/*fm.append('remark', $("textarea[name='remark']").val());*/
		fm.append('solicitContributionPicFile', file);
		fm.append('solicitContributionContent', page.editor.txt.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/solicitContribution/addSolicitContribution',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('新增成功！');
					window.location.href = "#!soliciting/soliciting-management.html";
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
   			file: "required",
   		},
   		messages: {
   			activityname: "请输入征稿名称",
   			file: "请上传征稿主图",
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