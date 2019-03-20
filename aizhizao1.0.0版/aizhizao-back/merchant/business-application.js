Module.define("system.business", function(page, $) {
	page.ready = function() {
		
		initValidate();
		$("#SubmissionBtn").bind("click", submitForm);
		$("#file1").change(function(){
		    $("#img1").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$("#file2").change(function(){
		    $("#img2").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$("#file3").change(function(){
		    $("#img3").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$("#file4").change(function(){
		    $("#img4").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		$("#file5").change(function(){
		    $("#img5").attr("src",URL.createObjectURL($(this)[0].files[0]));
		});
		
		
	}
	function submitForm() {
	   	var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
	   	var file1 = document.basicForm.file1.files[0];
	   	var file2 = document.basicForm.file2.files[0];
	   	var file3 = document.basicForm.file3.files[0];
	   	var file4 = document.basicForm.file4.files[0];
	   	var file5 = document.basicForm.file5.files[0];
	   	if(!file1){
	   		alert('请上传ICP备案图片');
	   		return;
	   	}
	   	if(!file2){
	   		alert('请上传营业执照图片');
	   		return;
	   	}
	   	if(!file3){
	   		alert('请上传身份证正面图片');
	   		return;
	   	}
	   	if(!file4){
	   		alert('请上传身份证反面图片');
	   		return;
	   	}
	   	if(!file5){
	   		alert('请上传开户许可证图片');
	   		return;
	   	}

		var fm = new FormData();
		fm.append('merFullName', $("input[name='Enterprisename']").val());
		fm.append('merShortName', $("input[name='EnterpriseAbb']").val());
		fm.append('merCertType', $("select[name='type']").val());
		fm.append('merCertNo', $("input[name='CertificateNo']").val());
		fm.append('merProvince', $("input[name='province']").val());
		fm.append('merCity', $("input[name='city']").val());
		fm.append('merDistrict', $("input[name='area']").val());
		fm.append('merAddress', $("input[name='address']").val());
		fm.append('icpAuthPic', file1);
		fm.append('businessPic', file2);
		fm.append('merContactName', $("input[name='name']").val());
		fm.append('merContactPhone', $("input[name='phoe']").val());
		fm.append('merContactEmail', $("input[name='email']").val());
		fm.append('legalName', $("input[name='legalname']").val());
		fm.append('legalIdCard', $("input[name='IDnumber']").val());
		fm.append('legalFrontPic', file3);
		fm.append('legalBackPic', file4);
		fm.append('accountLicense', $("input[name='Opennumber']").val());
		fm.append('cardNo', $("input[name='BankAccount']").val());
		fm.append('bankCode', $("input[name='branchname']").val());
		fm.append('headBankCode', $("input[name='BankCoding']").val());
		fm.append('bankProvince', $("input[name='province2']").val());
		fm.append('bankCity', $("input[name='city2']").val());
		fm.append('openAccountPic', file5);
		
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/merchant/regMerchantYeeEnterpriseAccount',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		alert('注册成功！');
	        		window.location.href = "business-detail3.html";
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
	   			Enterprisename: "required",
	   			EnterpriseAbb: "required",
	   			CertificateNo: "required",
	   			province:"required",
	   			city:"required",
	   			area:"required",
	   			address:"required",
	   			name: "required",
	   			phoe: "required",
	   			email: "required",
	   			legalname: "required",
	   			IDnumber: "required",
	   			Opennumber: "required",
	   			BankAccount: "required",
	   			branchname: "required",
	   			BankCoding: "required",
	   			province2:"required",
	   			city2:"required",
	   		},
	   		messages: {
	   			Enterprisename: "请输入企业名称",
	   			EnterpriseAbb: "请输入商户简称",
	   			CertificateNo: "请输入证件号",
	   			province:"请输入省",
	   			city:"请输入市",
	   			area:"请输入详细地址",
	   			address:"请输入区",
	   			name: "请输入姓名",
	   			phoe: "请输入手机号",
	   			email: "请输入邮箱",
	   			legalname: "请输入法人姓名",
	   			IDnumber: "请输入身份证号",
	   			Opennumber: "请输入开户许可证编号",
	   			BankAccount: "请输入银行对公账户",
	   			branchname: "请输入开户支行名称",
	   			BankCoding: "请输入开户行编码",
	   			province2:"请输入省",
	   			city2:"请输入市",
	   			
	   		},
	   		highlight: function(element) {
	   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	   		},
	   		success: function(element) {
	   			$(element).closest('.form-group').removeClass('has-error');
	   		}
	   	});
   }
});