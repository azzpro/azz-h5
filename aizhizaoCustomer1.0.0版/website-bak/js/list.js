var param = getRequest();
var columnCode = param["columnCode"];
$(document).ready(function() {
	searchNavList();
	jQuery.fn.limit=function(){
	var self = $("[limit]");
	self.each(function(){
	var objString = $(this).text();
	var objLength = $(this).text().length;
	var num = $(this).attr("limit");
	if(objLength > num){
	$(this).attr("title",objString);
	objString = $(this).text(objString.substring(0,num)+"...");
	}
	$(this).attr("title"," ")
	})
	}
});

function searchNavList() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/searchNavList",
		data:{
			'columnCode' : columnCode
		},
		cache: false, //禁用缓存
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				$('#ly-banner').attr("src", data.columnPicUrl);
				$('#list-text').html(data.columnName);
				var homeNavs = data.homeNavs;
				var li = '';
				for(var i = 0;i<homeNavs.length;i++){
					var articleId = homeNavs[i].articleId;
					var articlePicUrl = homeNavs[i].articlePicUrl;
					var articleTitle = homeNavs[i].articleTitle;
					var price = homeNavs[i].price;
					var remark1 = homeNavs[i].remark1;
					var remark2 = homeNavs[i].remark2;
					if(price){
						var priceK = '<p>¥'+price+'</p>'
					}else{
						var priceK = ''
					}
					if(remark1){
						var remark = '<span>开班日期：'+remark1+'<br />开班地点：<font>'+remark2+'</font></span>'
					}else{
						var remark = ''
					}
					
					li +="<li><a href='list-detail.html?articleId="+articleId+"'><img src='"+articlePicUrl+"' alt='' /><div class='lj-zi'><font class='jqzi'>"+articleTitle+"</font>"+priceK+""+remark+"</div></a></li>";
			    }
				$("#listId").append(li);
				$(".jqzi").attr("limit",15)
				$("[limit]").limit();
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