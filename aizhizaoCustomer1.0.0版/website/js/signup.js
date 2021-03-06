var param = getRequest();
var articleId = param["articleId"];
var articleTitle = param["articleTitle"];
$(document).ready(function() {
	$("#addSignUpCourse").bind("click", addSignUpCourse);
	$('#articleTitle').html(articleTitle);
	var sideBar = $ ("header"), tp = sideBar.prop ("offsetTop");
    $(window).scroll (function (){
        var top=$(window).scrollTop();
        //top = top <= tp ? tp : top;
        //console.info(top);
        if( top>=40 ){
        	sideBar.css (
        {
            "position" : "fixed",
            "z-index" : "33",
            "width" :"100%",
            "background" : "#333",
            "top": "0",
        });
        } else if( top <= 40 ){
        	sideBar.css (
        {
            "position" : "relative",
        });
        }
    })
});

function addSignUpCourse() {
	if(!$("input[name='name']").val()){
		alert('请填写姓名');
		return
	}
	
	var mobile = $('input[name="mobile"]').val();
   	if(!/^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/.test(mobile)) {
   		alert("请输入正确的手机号");
   		return;
   	}

	if(!$("input[name='company']").val()){
		alert('请填写公司');
		return
	}
	if(!$("input[name='position']").val()){
		alert('请填写职位');
		return
	}
	
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/addSignUpCourse",
		data:{
			'articleId' : articleId,
			'name' : $("input[name='name']").val(),
			'gender' : $("input[name='gender']:checked").val(),
			'mobilePhone' : $("input[name='mobile']").val(),
			'email' : $("input[name='mailbox']").val(),
			'qq' : $("input[name='qq']").val(),
			'company' : $("input[name='company']").val(),
			'post' : $("input[name='position']").val(),
		},
		cache: false, //禁用缓存
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				window.location.href = "list-detail.html?articleId="+articleId
			} else {
				alert(data.msg)
			}
		}
	});
}


// 获取url路径参数
function getRequest() {
    var d = new Object();
    var g = window.location.href;
    var b = g.split("?");
    if (b.length > 1) {
        var a = b[1].split("&");
        for (var c = 0; c < a.length; c++) {
            var f = a[c].indexOf("=");
            if (f == -1) {
                continue;
            }
            var e = a[c].substring(0, f);
            var j = a[c].substring(f + 1);
            j = decodeURIComponent(j);
            d[e] = j;
        }
    }
    return d;
}