var clientUserInfo = JSON.parse(localStorage.getItem('clientUserInfo'));
$(document).ready(function() {
	initValidate();
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

});
function submitForm() {
   	var validFlag = $('#basicForm').valid();
	if(!validFlag) {
			return;
	}
   	var file1 = document.basicForm.file1.files[0];
   	var file2 = document.basicForm.file2.files[0];
   	var file3 = document.basicForm.file3.files[0];
   	
   	var tradingCertificateFiles = [];
	tradingCertificateFiles.push(file1);
	tradingCertificateFiles.push(file2);
	tradingCertificateFiles.push(file3);
		
	var fm = new FormData();
	fm.append('clientUserCode', clientUserInfo.clientUserCode);
	fm.append('clientUserName', $("input[name='merchantname']").val());
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
	$.ajax({
        type :'POST',
        url : ulrTo+'/azz/api/client/enterpriseAuth',
        cache: false, //禁用缓存    
		dataType: "json",
		contentType: false, //禁止设置请求类型
        processData: false, //禁止jquery对DAta数据的处理,默认会处理
		data: fm,
        success : function(data) {
        	if (data.code == 0) {
        		if(!window.localStorage){
		            return false;
		        }else{
		            var storage=window.localStorage;
		            var clientUserInfo = JSON.stringify(data.data.clientUserInfo);
		            var clientType = JSON.stringify(data.data.clientUserInfo.clientType)
		            var menus = JSON.stringify(data.data.menus);
		            var clientUserPermissions = JSON.stringify(data.data.clientUserPermissions);
		            var sessionId = JSON.stringify(data.data.sessionId);
		            storage["clientUserInfo"]= clientUserInfo;
		            storage["menus"]= menus;
		            storage["clientType"]= clientType;
		            storage["clientUserPermissions"]= clientUserPermissions;
		            storage["sessionId"]= sessionId;
		        }
        		window.location.href = "register-entThree.html";
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
   			merchantname: "required",
   			enterprisename: "required",
   			creditcode: "required",
   			pohe: "required",
   			province: "required",
   			city: "required",
   			district: "required",
   			address: "required",
   			file: "required",
   		},
   		messages: {
   			merchantname: "请输入本人姓名",
   			enterprisename: "请输入公司名称",
   			creditcode: "请输入信用代码",
   			pohe: "请输入公司电话",
   			province: "请选择省",
   			city: "请选择市",
   			district: "请选择区",
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

//全局ajax请求设置，页面上所有的ajax请求，如果未登陆跳转则到登录界面
$.ajaxSetup({
	crossDomain: true,
	cache : false,  //关闭缓存
	beforeSend: function(request) {
		var sessionId = JSON.parse(localStorage.getItem('sessionId'));
		if (!sessionId) {
			window.location.href = "../../aizhizao-back/login.html";
		}
		request.setRequestHeader("token",sessionId);
	}
});