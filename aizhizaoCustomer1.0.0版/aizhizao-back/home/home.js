$(document).ready(function() {
	getSelectionIndexData()
});
function getSelectionIndexData() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getSelectionIndexData",
		cache: false, //禁用缓存   
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var classificationInfos = data.data.classificationInfos;
				$('#xxjl').html(data.data.selectionRecordCount);
				$('#dzf').html(data.data.notPaidOrderCount);
				$('#dqc').html(data.data.notSignedOrderCount);
				var divarr = '';
				if(!classificationInfos || !classificationInfos.length){
					divarr += "<div class='col-xs-12 text-center'>暂无内容</div>";
			    }else{
			    	for(var i = 0;i < classificationInfos.length;i++){
						var assortmentName = classificationInfos[i].assortmentName;
						var assortmentPicUrl = classificationInfos[i].assortmentPicUrl;
						var assortmentCode = classificationInfos[i].assortmentCode;
						var assortmentTop = 1;
						divarr += "<div class='col-xs-12 col-sm-6 col-md-3'><a class='nodecoration' onclick=\"screen(\'" + assortmentCode + "','" + assortmentTop + "','" + assortmentName + "\');\" href='javascript:;'><img src='"+ assortmentPicUrl +"' width='100%' height='80px' alt='' /><div class='faan'>"+ assortmentName +"</div></a></div>"
					}
		    	}
				$("#molelist").append(divarr);
				
			} else {
				alert(data.msg)
			}
		}
	});
}
function screen(assortmentCode,assortmentTop,assortmentName) {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var assortmentCodeModel = JSON.stringify(assortmentCode);
	        storage["assortmentCodeModel"]= assortmentCodeModel;
	        var assortmentTopModel = JSON.stringify(assortmentTop);
	        storage["assortmentTopModel"]= assortmentTopModel;
	        var assortmentNameModel = JSON.stringify(assortmentName);
	        storage["assortmentNameModel"]= assortmentNameModel;
	    }
	    window.location.href = "#!model/model-screen.html"
	}