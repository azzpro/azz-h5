var solicitContributionCodeEdit = JSON.parse(localStorage.getItem('solicitContributionCodeEdit'));
Module.define("system.activitysign", function(page, $) {
	page.ready = function() {
		var E = window.wangEditor;
        page.editor = new E('#editor');
        page.editor.customConfig.uploadImgShowBase64 = true;
        page.editor.create();
		initValidate();
		getCourseDetail();
		$("#SubmissionBtn").bind("click", submitForm);

		$("#file").change(function(){
			$("#pic").show();
		    $("#pic").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
	}
	
	//编辑
	function submitForm() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		var file = document.basicForm.file.files[0];
		if(!file){
	   		var isEditPic = 0
	   	}else{
	   		var isEditPic = 1
	   	}
	   	
		var fm = new FormData();
		fm.append('solicitContributionCode', solicitContributionCodeEdit);
		/*fm.append('remark', $("textarea[name='remark']").val());*/
		fm.append('solicitContributionName', $("input[name='activityname']").val());
		fm.append('solicitContributionStatus', $("input[name='fill']:checked").val());
		if(!file){}else{fm.append('solicitContributionPicFile', file);}
		fm.append('isChangeSolicitContributionPic', isEditPic);
		fm.append('solicitContributionContent', page.editor.txt.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/solicitContribution/editSolicitContribution',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('编辑成功！');
					window.location.href = "#!soliciting/soliciting-management.html";
				} else {
					alert(data.msg);
				}
	        }
	    });

	}
	
	//活动详情
	function getCourseDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/solicitContribution/getSolicitContributionDetail",
			cache: false, //禁用缓存
			async: false,
			data: {
				'solicitContributionCode':solicitContributionCodeEdit,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					
					/*$("textarea[name='remark']").val(data.data.remark);*/
					$("input[name='activityname']").val(data.data.solicitContributionName);
					$("#pic").attr("src",data.data.solicitContributionPicUrl);
					if(data.data.solicitContributionStatus == 1) {
						$("#Required").attr("checked", "checked");
					}else if(data.data.solicitContributionStatus == 2){
						$("#Selection").attr("checked", "checked");
					}
					
					page.editor.txt.html(data.data.solicitContributionContent);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			activityname: "required",
   		},
   		messages: {
   			activityname: "请输入征稿名称",

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