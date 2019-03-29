var param = getRequest();
var specialCode = param["specialCode"];
$(document).ready(function() {
	getSpecialPerformanceOfIndex();
	getSpecialPerformanceOfIndexNav();
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
	
	$('.returntop').click(function(){
		$('body,html').animate({scrollTop:0},300);
		return false;
	})
	
	$("#navCb").on('click','.dianl',function(){
		$(this).parents('li').addClass('curr');
		$(this).parents('li').siblings().removeClass('curr');
		var recommendCode = $(this).attr("recommendCode");
		$("#speciallistId").empty();
		getSpecialPerformanceOfIndex(recommendCode);
		
	})
});

function getSpecialPerformanceOfIndexNav() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/getSpecialPerformanceOfIndex",
		data:{
			'specialPerformanceCode' : specialCode,
			'recommendCode': '',
		},
		cache: false, //禁用缓存
		async:false,
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				var recommends = data.recommends;
				var htmlLi = "";
				for(var i = 0;i < recommends.length; i++){
					var recommendName = recommends[i].recommendName;
					var recommendCode = recommends[i].recommendCode;
					if(recommendName.length > 4){
						var recommendName = recommendName.substring(0,4)+'...'
					}
					htmlLi +="<li><a href='javascript:;' class='dianl' recommendCode='"+ recommendCode +"'>"+ recommendName +"</a></li>"
				}
				$("#navCb").append(htmlLi);
			} else {
				alert(data.msg)
			}
		}
	});
}

function getSpecialPerformanceOfIndex(recommendCode) {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/getSpecialPerformanceOfIndex",
		data:{
			'specialPerformanceCode' : specialCode,
			'recommendCode': recommendCode,
			'pageNum': '1',
			'pageSize': '16',
		},
		cache: false, //禁用缓存
		async:false,
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				$('#total').html(data.data.moduleInfos.total);
				var data = data.data;
				$('#ly-banner').attr("src", data.specialPerformanceMainPicUrl);
				$('.special-bg').attr("style", 'background: url('+ data.specialPerformanceBgPicUrl +') no-repeat center top;');
				
				var rows = data.moduleInfos.rows;
				if(!rows || !rows.length){
					var nodata = "<p align='center' style='color: #fff;'>表中数据为空</p>";
					$("#speciallistId").append(nodata);
				}else{
					var htmlArr = "";
					for(var i = 0;i < rows.length; i++){
						var moduleCode = rows[i].moduleCode;
						var moduleName = rows[i].moduleName;
						var modulePicUrl = rows[i].modulePicUrl;
						var moduleMinPrice = rows[i].moduleMinPrice;
						if(!moduleMinPrice){
							var moduleMinPrice = '-'
						}
						if(moduleName.length > 8){
							var moduleName = moduleName.substring(0,8)+'...'
						}
						htmlArr += "<li><a href='javascript:;' onclick=\"details(\'" + moduleCode + "\');\"><div class='special-tu'><img src='"+ modulePicUrl +"' alt='' /></div>"
								 + "<h3><span>"+ moduleName +"</span><img src='images/hot.png' alt='' /></h3><p>优惠价：<span><b>"+ moduleMinPrice +"</b>元/起</span></p></a></li>";
					}
					$("#speciallistId").append(htmlArr);
					Pagination(recommendCode);
				}
			} else {
				alert(data.msg)
			}
		}
	});
}

function Pagination(recommendCode){
	$('.M-box').pagination({
	    totalData: parseInt($('#total').html()),
	    //jump: true,
	    showData: 16,
	    isHide: true,
	    coping: true,
	    prevContent: '上一页',
		nextContent: '下一页',
	    callback: function (api) {
	        var data = {
				'pageNum': api.getCurrent(),
				'pageSize': 16,
				'specialPerformanceCode' : specialCode,
				'recommendCode': recommendCode,
	        };
	        $.getJSON(ulrTo + '/azz/api/index/getSpecialPerformanceOfIndex#!method=POST', data, function (data) {
	        	
	        	$("#speciallistId").empty();
	        	var data = data.data;
	        	$('#ly-banner').attr("src", data.specialPerformanceMainPicUrl);
	        	$('.special-bg').attr("src", 'background: url('+ data.specialPerformanceBgPicUrl +') no-repeat center top;')

				var rows = data.moduleInfos.rows;
				if(!rows || !rows.length){
					var nodata = "<p class='text-center'>表中数据为空</p>";
					$("#speciallistId").append(nodata);
				}else{
					var htmlArr = "";
					for(var i = 0;i < rows.length; i++){
						var moduleCode = rows[i].moduleCode;
						var moduleName = rows[i].moduleName;
						var modulePicUrl = rows[i].modulePicUrl;
						var moduleMinPrice = rows[i].moduleMinPrice;
						if(!moduleMinPrice){
							var moduleMinPrice = '-'
						}
						if(moduleName.length > 8){
							var moduleName = moduleName.substring(0,8)+'...'
						}
						htmlArr += "<li><a href='javascript:;' onclick=\"details(\'" + moduleCode + "\');\"><div class='special-tu'><img src='"+ modulePicUrl +"' alt='' /></div>"
								 + "<h3><span>"+ moduleName +"</span><img src='images/hot.png' alt='' /></h3><p>优惠价：<span><b>"+ moduleMinPrice +"</b>元/起</span></p></a></li>";
					}
					$("#speciallistId").append(htmlArr);
				}
				
	            
	        });

	        
	    }
	});
}

//详情
function details(moduleCode) {
	if(!window.localStorage){
        return false;
    }else{
        var storage=window.localStorage;
        var moduleCodepro = JSON.stringify(moduleCode);
        storage["moduleCodepro"]= moduleCodepro;
    }
    window.location.href = "modelDetail.html"
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