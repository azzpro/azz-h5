$(document).ready(function() {
    getSelectionCaseInfos();
    Pagination();
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
function getSelectionCaseInfos() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getSelectionCaseInfos",
		async:false,
		cache: false, //禁用缓存
		data: {
			pageNum: '1',
			pageSize: '9',
		},
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				$('#total').html(data.data.total);
				var rows = data.data.rows;
				var li = '';
				if(!rows || !rows.length){
					li += "<li>无任何内容</li>";
				}else{
					for(var i = 0;i<rows.length;i++){
						var caseCode = rows[i].caseCode;
						var caseName = rows[i].caseName;
						var casePicUrl = rows[i].casePicUrl;
						li += "<li><a href='javascript:;'onclick=\"details(\'" + caseCode + "\');\"><div class='list-tu'><img src='"+ casePicUrl +"' alt='' /></div><p>"+ caseName +"</p></a></li>";
				    }
				}
				$("#list").append(li);
			} else {
				alert(data.msg)
			}
		}
	});
}

function Pagination(){
		$('.M-box').pagination({
		    totalData: parseInt($('#total').html()),
		    //jump: true,
		    showData: 9,
		    isHide: true,
		    coping: true,
		    prevContent: '上一页',
   			nextContent: '下一页',
		    callback: function (api) {
		        var data = {
		            pageNum: api.getCurrent(),
					pageSize: 9,
		        };
		        $.getJSON(ulrTo + '/azz/api/client/selection/getSelectionCaseInfos#!method=POST', data, function (data) {
		        	$("#list").empty();
		        	var rows = data.data.rows;
					var li = '';
					if(!rows || !rows.length){
						li += "<li>无任何内容</li>";
					}else{
						for(var i = 0;i<rows.length;i++){
							var caseCode = rows[i].caseCode;
							var caseName = rows[i].caseName;
							var casePicUrl = rows[i].casePicUrl;
							li += "<li><a href='javascript:;'onclick=\"details(\'" + caseCode + "\');\"><div class='list-tu'><img src='"+ casePicUrl +"' alt='' /></div><p>"+ caseName +"</p></a></li>";
					    }
					}
					$("#list").append(li);
					
		        });

		        
		    }
		});
	}

	//详情
	function details(caseCode) {
		if(!window.localStorage){
            return false;
        }else{
            var storage=window.localStorage;
            var caseCode = JSON.stringify(caseCode);
            storage["caseCode"]= caseCode;
        }
        window.location.href = "parameter.html"
	}