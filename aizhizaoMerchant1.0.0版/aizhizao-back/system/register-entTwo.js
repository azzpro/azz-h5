var merchantCodeLogin = JSON.parse(localStorage.getItem('merchantCodeLogin'));
$(document).ready(function() {
	initValidate();
	getMerchantQualificationApplyStatus();
	if(merchantCodeLogin==null){
		window.location.href = "../login.html";
	}
	$("#SubmissionBtn").bind("click", submitForm);
   	$('#distpicker').distpicker({
   		autoSelect: false,
	    /*province: '广东省',
	    city: '深圳市',
	    district: '罗湖区'*/
	});
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

});
function getMerchantQualificationApplyStatus() {
   	$.ajax({
   		type: "POST",
   		url: ulrTo+"/azz/api/merchant/getMerchantQualificationApplyStatus",
   		data: {'merchantCode' : merchantCodeLogin},
   		success: function(data) {
   			if(data.code == 0) {
   				if(data.data == 1){
   					window.location.href = "register-entThree.html";
   				}else if(data.data == 2){
   					window.location.href = "../login.html";
   				}
   			} else {
   				alert(data.msg);
   			}
   		}
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
   	
   	var tradingCertificateFiles = [];
	tradingCertificateFiles.push(file1);
	tradingCertificateFiles.push(file2);
	tradingCertificateFiles.push(file3);
	
	var businessLicenseFiles = [];
	businessLicenseFiles.push(file4);
		
	var fm = new FormData();
	fm.append('merchantCode', merchantCodeLogin);
	fm.append('merchantName', $("input[name='merchantname']").val());
	fm.append('companyName', $("input[name='enterprisename']").val());
	fm.append('creditCode', $("input[name='creditcode']").val());
	fm.append('companyTel', $("input[name='pohe']").val());
	fm.append('proviceCode', $("#province").val());
	fm.append('proviceName', $("#province").val());
	fm.append('cityCode', $("#city").val());
	fm.append('cityName', $("#city").val());
	fm.append('areaCode', $("#district").val());
	fm.append('areaName', $("#district").val());
	fm.append('detailAddress', $("input[name='address']").val());
	fm.append('tradingCertificateFiles[0]', file1);
	if(!file2){}else{fm.append('tradingCertificateFiles[1]', file2);}
	if(!file3){}else{fm.append('tradingCertificateFiles[2]', file3);}
	if(!file4){}else{fm.append('businessLicenseFiles[0]', file4);}
	$.ajax({
        type :'POST',
        url : ulrTo+'/azz/api/merchant/completeMerchantInfo',
        cache: false, //禁用缓存    
		dataType: "json",
		contentType: false, //禁止设置请求类型
        processData: false, //禁止jquery对DAta数据的处理,默认会处理
		data: fm,
        success : function(data) {
        	if (data.code == 0) {
        		window.location.href = "register-entThree.html";
			} else {
				alert(data.msg);
				getMerchantQualificationApplyStatus()
			}
        }
    });
}


function initValidate(){
   	// Basic Form
   	$("#basicForm").validate({
   		rules: {
   			merchantname: "required",
   			enterprisename: "required",
   			creditcode: "required",
   			pohe: "required",
   			province: "required",
   			city: "required",
   			/*district: "required",*/
   			address: "required",
   			file: "required",
   		},
   		messages: {
   			merchantname: "请输入商户名称",
   			enterprisename: "请输入企业名称",
   			creditcode: "请输入信用代码",
   			pohe: "请输入公司电话",
   			province: "请选择省",
   			city: "请选择市",
   			/*district: "请选择区",*/
   			address: "请输入详细地址",
   			file: "请上传营业执照",
   		},
   		highlight: function(element) {
   			$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
   		},
   		success: function(element) {
   			$(element).closest('.form-group').removeClass('has-error');
   		}
   	});
   }