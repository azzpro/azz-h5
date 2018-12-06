Module.define("system.article", function(page, $) {
	page.ready = function() {
		$("#SubmissionBtn").bind("click", submitForm);
		initValidate();
		getColumnLsit();
		KindEditor.ready(function(K) {
                window.editor = K.create('#editor_id');
                editor.sync();
        });

		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
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
	
	function submitForm() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
		
		if(!editor.html()){
			alert('请输入文章详情');
			return;
		}
		
	   	var file1 = document.basicForm.file1.files[0];
			
		var fm = new FormData();
		fm.append('indexColumnId', $('#approvalType').val());
		fm.append('articleTitle', $("input[name='title']").val());
		fm.append('price', $("input[name='price']").val());
		fm.append('remark1', $("input[name='supplement']").val());
		fm.append('remark2', $("input[name='supplement2']").val());
		fm.append('mainPicture', file1);
		fm.append('articleDetail', editor.html());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/index/addArticle',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('新增文章成功！');
	        		window.location.href = "#!article/article-management.html";
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
   			column: "required",
   			title: "required",
   			file: "required",
   			content: "required",
   		},
   		messages: {
   			modulename: "请输入所属栏目",
   			title: "请输入文章标题",
   			file: "请上传文章主图",
   			content: "请填写文章详情",
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