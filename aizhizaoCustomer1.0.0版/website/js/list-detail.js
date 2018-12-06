var param = getRequest();
var articleId = param["articleId"];
$(document).ready(function() {
	searchNavDetail();
	$("#signup").bind("click", signup);
});

function searchNavDetail() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/searchNavDetail",
		data:{
			'articleId' : articleId
		},
		cache: false, //禁用缓存
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				$('#articleTitle').html(data.articleTitle);
				$('#articleContent').html(data.articleContent);
				if(data.remark){
					$('#bml').show();
					$('#price').html(data.price);
				}
			} else {
				alert(data.msg)
			}
		}
	});
}

function signup() {
	var articleTitle = $("#articleTitle").html();
    window.location.href = "signup.html?articleTitle="+articleTitle+"&articleId="+articleId
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