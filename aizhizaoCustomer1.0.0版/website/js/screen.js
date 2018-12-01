var caseCode = JSON.parse(localStorage.getItem('caseCode'));
var inputParams = JSON.parse(localStorage.getItem('inputParamss'));
var selectParams = JSON.parse(localStorage.getItem('selectParamss'));
var inputParams2 = [];
var selectParams2 = [];
var inputParamstest = [];
var selectParamstest = [];
var priceSort,deliverySort;
$(document).ready(function() {
    getCombinationInitParams();
    getCombinationInfos();
    Pagination();
    $(".parameter").on('click','.parlr a',function(){
		if($(this).hasClass('csxz')){  //加
			$(this).addClass('curr');
			$(this).removeClass('csxz');
			upperCase();
			$("#table").empty();
			getCombinationInfos();
    		Pagination();
		}else{   //减
			$(this).addClass('csxz');
			$(this).removeClass('curr');
			upperCase();
			$("#table").empty();
			getCombinationInfos();
    		Pagination();
		}
	})
     $(".parameter").on('click','.pardel a',function(){
		$(this).parents('.pardel').siblings('.parlr').find('a').removeClass('curr');
		$(this).parents('.pardel').siblings('.parlr').find('a').removeClass('csxz');
		$(this).parents('.pardel').siblings('.parlr').find('a').addClass('csxz');
	})
     
    $("#priceSort").on('click','.sort',function(){
		if($(this).hasClass('sort-h')){  //加
			$(this).addClass('sort-b');
			$(this).removeClass('sort-h');
			$(this).parents().siblings("#deliverySort").find("span").addClass('sort-h');
			$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-t');
			$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-b');
			//默认排序开启
			$(this).parents().siblings("#defaultSort").find("span").addClass('defaultsort');
			$(this).parents().siblings("#defaultSort").find("span").removeClass('defaultsortNo');
			priceSort = 0;
			deliverySort='';
			$("#table").empty();
			getCombinationInfos();
    		Pagination();

		}else if($(this).hasClass('sort-b')){
			$(this).addClass('sort-t');
			$(this).removeClass('sort-b');
			$(this).parents().siblings("#deliverySort").find("span").addClass('sort-h');
			$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-t');
			$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-b');
			//默认排序开启
			$(this).parents().siblings("#defaultSort").find("span").addClass('defaultsort');
			$(this).parents().siblings("#defaultSort").find("span").removeClass('defaultsortNo');
			priceSort = 1;
			$("#table").empty();
			getCombinationInfos();
    		Pagination();

		}else if($(this).hasClass('sort-t')){
			$(this).addClass('sort-b');
			$(this).removeClass('sort-t');
			$(this).parents().siblings("#deliverySort").find("span").addClass('sort-h');
			$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-t');
			$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-b');
			//默认排序开启
			$(this).parents().siblings("#defaultSort").find("span").addClass('defaultsort');
			$(this).parents().siblings("#defaultSort").find("span").removeClass('defaultsortNo');
			priceSort = 0;
			$("#table").empty();
			getCombinationInfos();
    		Pagination();
		}
	})
    
    $("#deliverySort").on('click','.sort',function(){
		if($(this).hasClass('sort-h')){  //加
			$(this).addClass('sort-b');
			$(this).removeClass('sort-h');
			$(this).parents().siblings("#priceSort").find("span").addClass('sort-h');
			$(this).parents().siblings("#priceSort").find("span").removeClass('sort-t');
			$(this).parents().siblings("#priceSort").find("span").removeClass('sort-b');
			//默认排序开启
			$(this).parents().siblings("#defaultSort").find("span").addClass('defaultsort');
			$(this).parents().siblings("#defaultSort").find("span").removeClass('defaultsortNo');
			deliverySort = 0;
			priceSort='';
			$("#table").empty();
			getCombinationInfos();
    		Pagination();

		}else if($(this).hasClass('sort-b')){
			$(this).addClass('sort-t');
			$(this).removeClass('sort-b');
			$(this).parents().siblings("#priceSort").find("span").addClass('sort-h');
			$(this).parents().siblings("#priceSort").find("span").removeClass('sort-t');
			$(this).parents().siblings("#priceSort").find("span").removeClass('sort-b');
			//默认排序开启
			$(this).parents().siblings("#defaultSort").find("span").addClass('defaultsort');
			$(this).parents().siblings("#defaultSort").find("span").removeClass('defaultsortNo');
			deliverySort = 1;
			$("#table").empty();
			getCombinationInfos();
    		Pagination();

		}else if($(this).hasClass('sort-t')){
			$(this).addClass('sort-b');
			$(this).removeClass('sort-t');
			$(this).parents().siblings("#priceSort").find("span").addClass('sort-h');
			$(this).parents().siblings("#priceSort").find("span").removeClass('sort-t');
			$(this).parents().siblings("#priceSort").find("span").removeClass('sort-b');
			//默认排序开启
			$(this).parents().siblings("#defaultSort").find("span").addClass('defaultsort');
			$(this).parents().siblings("#defaultSort").find("span").removeClass('defaultsortNo');
			deliverySort = 0;
			$("#table").empty();
			getCombinationInfos();
    		Pagination();
		}
	})
    
    $("#defaultSort").on('click','.defaultsort',function(){
		$(this).parents().siblings("#priceSort").find("span").addClass('sort-h');
		$(this).parents().siblings("#priceSort").find("span").removeClass('sort-t');
		$(this).parents().siblings("#priceSort").find("span").removeClass('sort-b');
		$(this).parents().siblings("#deliverySort").find("span").addClass('sort-h');
		$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-t');
		$(this).parents().siblings("#deliverySort").find("span").removeClass('sort-b');
		
		priceSort='';
		deliverySort='';
		$("#table").empty();
		getCombinationInfos();
		Pagination();
		$(this).addClass('defaultsortNo');
		$(this).removeClass('defaultsort')
	})
    
});
function getCombinationInitParams() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getCombinationInitParams",
		cache: false, //禁用缓存   
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(GetJsonDatatoo()),
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				if(!data || !data.length){
					
				}else{
					for(var i = 0;i<data.length;i++){
						var paramsType = data[i].paramsType;
						var paramsTerms = data[i].paramsTerms;
						if(paramsType == 1){
							var lii = '';
							for(var j = 0;j<paramsTerms.length;j++){
								var paramValues = paramsTerms[j].paramValues;
								var paramValuess = paramValues.split(',');
								var paramsName = paramsTerms[j].paramsName;
								var paramsTermId = paramsTerms[j].paramsTermId;
								var liii = '';
								for(var r = 0;r<paramValuess.length;r++){
									liii +="<a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a>";
								}
								lii += "<li><dl class='c'><dt>"+ paramsName +"</dt><dd class='parlr'>"
	  								+ liii
	  								+ "</dd>"
	  								+ "<!--<dd class='pardel'><a class='deled' href='javascript:;'><i class='del'>x</i>清除</a></dd>--></dl></li>";
							}
							$("#parameter").append(lii);
						}
						if(paramsType == 2){
							var li = '';
							for(var y = 0;y<paramsTerms.length;y++){
								var paramValues = paramsTerms[y].paramValues;
								var paramValuess = paramValues.split(',');
								var paramsName = paramsTerms[y].paramsName;
								var paramsTermId = paramsTerms[y].paramsTermId;
								var liit = '';
								for(var r = 0;r<paramValuess.length;r++){
									liit +="<a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a>";
								}
								li += "<li><dl class='c'><dt>"+ paramsName +"</dt><dd class='parlr'>"
	  								+ liit
	  								+ "</dd>"
	  								+ "<!--<dd class='pardel'><a class='deled' href='javascript:;'><i class='del'>x</i>清除</a></dd>--></dl></li>";
							}
							$("#inputList").append(li);
						}
				    }
				}
			} else {
				alert(data.msg)
			}
		}
	});
}

function upperCase() {
	
	inputParams.splice(0,inputParams.length);
	var inputListVal = $('#inputList').find('.curr span');
	var inputListid = $('#inputList').find('.curr p');
	for(var i = 0; i<inputListVal.length; i++){
		var Newsobj = {
			"paramsValue" : inputListVal[i].textContent,
			"paramsTermId" : inputListid[i].textContent
		}
		inputParams.push(Newsobj);
	}
	
	selectParams.splice(0,selectParams.length);
	var parameterVal = $('#parameter').find('.curr span');
	var parameterid = $('#parameter').find('.curr p');
	for(var i = 0; i<parameterVal.length; i++){
		var Newsobj2 = {
			"paramsValue" : parameterVal[i].textContent,
			"paramsTermId" : parameterid[i].textContent
		}
		selectParams.push(Newsobj2);
	}
	
	inputParamstest.splice(0,inputParamstest.length);
	var inputListVal2 = $('#inputList').find('.curr span');
	var inputListid2 = $('#inputList').find('.curr p');
	for(var i = 0; i<inputListVal2.length; i++){
		var Newsobj5 = {
			"paramsValue" : inputListVal2[i].textContent,
			"paramsTermId" : inputListid2[i].textContent
		}
		inputParamstest.push(Newsobj5);
	}
	
	selectParamstest.splice(0,selectParamstest.length);
	var parameterVal2 = $('#parameter').find('.curr span');
	var parameterid2 = $('#parameter').find('.curr p');
	for(var i = 0; i<parameterVal2.length; i++){
		var Newsobj6 = {
			"paramsValue" : parameterVal2[i].textContent,
			"paramsTermId" : parameterid2[i].textContent
		}
		selectParamstest.push(Newsobj6);
	}
	
	var Params = $.extend(inputParamstest, selectParamstest);
	if(!Params || !Params.length){
		window.location.reload();
		return;
	}
	
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getCombinationParams",
		cache: false, //禁用缓存   
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(GetJsonData()),
		success: function(data) {
			if (data.code == 0) {
				$("#parameter").empty();
				$("#inputList").empty();
				inputParams2.splice(0,inputParams2.length);
				selectParams2.splice(0,selectParams2.length);
				var data = data.data;
				if(!data || !data.length){
					
				}else{
					for(var i = 0;i<data.length;i++){
						var paramsType = data[i].paramsType;
						var paramsTerms = data[i].paramsTerms;
						if(paramsType == 1){
							var lii = '';
							for(var j = 0;j<paramsTerms.length;j++){
								var paramValues = paramsTerms[j].paramValues;
								var paramValuess = paramValues.split(',');
								var paramsName = paramsTerms[j].paramsName;
								var paramsTermId = paramsTerms[j].paramsTermId;
								var liii = '';
								for(var r = 0;r<paramValuess.length;r++){
									liii +="<a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a>";
								}
								lii += "<li><dl class='c'><dt>"+ paramsName +"</dt><dd class='parlr'>"
	  								+ liii
	  								+ "</dd>"
	  								+ "<!--<dd class='pardel'><a class='deled' href='javascript:;'><i class='del'>x</i>清除</a></dd>--></dl></li>";
							}
							$("#parameter").append(lii);
						}
						if(paramsType == 2){
							var li = '';
							for(var y = 0;y<paramsTerms.length;y++){
								var paramValues = paramsTerms[y].paramValues;
								var paramValuess = paramValues.split(',');
								var paramsName = paramsTerms[y].paramsName;
								var paramsTermId = paramsTerms[y].paramsTermId;
								var liit = '';
								for(var r = 0;r<paramValuess.length;r++){
									liit +="<a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a>";
								}
								li += "<li><dl class='c'><dt>"+ paramsName +"</dt><dd class='parlr'>"
	  								+ liit
	  								+ "</dd>"
	  								+ "<!--<dd class='pardel'><a class='deled' href='javascript:;'><i class='del'>x</i>清除</a></dd>--></dl></li>";
							}
							$("#inputList").append(li);
						}
				    }
				}
				
				var inputListcss = $('#inputList').find('.csxz span');
				var inputListooid = $('#inputList').find('.csxz p');
				for(var i = 0; i<inputListcss.length; i++){
					var Newsobj3 = {
						"paramsValue" : inputListcss[i].textContent,
						"paramsTermId" : inputListooid[i].textContent
					}
					inputParams2.push(Newsobj3);
				}
				
				for(var i=0;i<inputParams2.length;i++){
					// 如果数据在数组中已经存在
					if( JSON.stringify(inputParams).indexOf(JSON.stringify(inputParams2[i])) != -1 ){
						inputListcss.eq(i).parent().addClass('curr');
						inputListcss.eq(i).parent().removeClass('csxz');
					}
				}
				/*for(var i = 0; i<inputListcss.length; i++){
					if($.inArray(inputParams3 ,inputParams2) != -1){
						inputListcss.eq(i).parent().addClass('curr');
						inputListcss.eq(i).parent().removeClass('csxz');
					}
				}*/
				
				var parametercss = $('#parameter').find('.csxz span');
				var parameterooid = $('#parameter').find('.csxz p');
				for(var i = 0; i<parametercss.length; i++){
					var Newsobj4 = {
						"paramsValue" : parametercss[i].textContent,
						"paramsTermId" : parameterooid[i].textContent
					}
					selectParams2.push(Newsobj4);
				}
				for(var i=0;i<selectParams2.length;i++){
					// 如果数据在数组中已经存在
					if( JSON.stringify(selectParams).indexOf(JSON.stringify(selectParams2[i])) != -1 ){
						parametercss.eq(i).parent().addClass('curr');
						parametercss.eq(i).parent().removeClass('csxz');
					}
				}
				/*for(var i = 0; i<parametercss.length; i++){
					if($.inArray(inputParams3 ,selectParams2) != -1){
						parametercss.eq(i).parent().addClass('curr');
						parametercss.eq(i).parent().removeClass('csxz');
					}
				}*/
			} else {
				alert(data.msg)
			}
		}
	});
}
function GetJsonData() {
    var json = {
        'caseCode': caseCode,
		'inputParams' : inputParams,
		'selectParams' : selectParams,
    };
    return json;
}
function GetJsonDatatoo() {
    var json = {
        'caseCode': caseCode,
        'inputParams' : inputParams,
		'selectParams' : selectParams,
    };
    return json;
}

function getCombinationInfos() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getCombinationInfos",
		cache: false, //禁用缓存   
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(getCombinationData()),
		success: function(data) {
			if (data.code == 0) {
				$('#total').html(data.data.total);
				var rows = data.data.rows;
				var tr = '';
				if(!rows || !rows.length){
					tr += "<tr><td colspan='3'>无任何内容</td></tr>";
				}else{
					for(var i = 0;i<rows.length;i++){
						var combinationPicUrl = rows[i].combinationPicUrl;
						var combinationName = rows[i].combinationName;
						var combinationCode = rows[i].combinationCode;
						var deliveryDate = rows[i].deliveryDate;
						var price = rows[i].price;
						var recommendReason = rows[i].recommendReason;
						if(recommendReason){
							
						}else{
							var recommendReason = '-'
						}
						tr += "<tr><td class='textleft'><a href='javascript:;'onclick=\"details(\'" + combinationCode + "\');\"><img src='"+ combinationPicUrl +"' class='tj-tu left' alt='' /></a><div class='tj-zi left'><h2><a href='javascript:;'onclick=\"details(\'" + combinationCode + "\');\">"+ combinationName +"</a></h2><p>"+ recommendReason +"</p></div></td>"
							+ "<td>"+ price +"</td>"
							+ "<td>"+ deliveryDate +"天</td></tr>";
				    }
				}
				$("#table").append(tr);
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
		    showData: 10,
		    isHide: true,
		    coping: true,
		    prevContent: '上一页',
   			nextContent: '下一页',
		    callback: function (api) {
		        var data=JSON.stringify(getCombinationData2(api));
		        contentType: "application/json; charset=utf-8";
				dataType: "json";
		        $.ajax({
					type: "POST",
					url: ulrTo+"/azz/api/client/selection/getCombinationInfos",
					cache: false, //禁用缓存   
					async: false,
					contentType: "application/json; charset=utf-8",
					dataType: "json", 
					data:JSON.stringify(getCombinationData2(api)),
					success: function(data) {
				        	$("#table").empty();
				        	var rows = data.data.rows;
							var tr = '';
						if(!rows || !rows.length){
							tr += "<tr><td colspan='3'>无任何内容</td></tr>";
						}else{
							for(var i = 0;i<rows.length;i++){
								var combinationPicUrl = rows[i].combinationPicUrl;
								var combinationName = rows[i].combinationName;
								var combinationCode = rows[i].combinationCode;
								var deliveryDate = rows[i].deliveryDate;
								var price = rows[i].price;
								var recommendReason = rows[i].recommendReason;
								if(recommendReason){
									
								}else{
									var recommendReason = '-'
								}
								tr += "<tr><td class='textleft'><a href='javascript:;' onclick=\"details(\'" + combinationCode + "\');\"><img src='"+ combinationPicUrl +"' class='tj-tu left' alt='' /></a><div class='tj-zi left'><h2><a href='javascript:;'onclick=\"details(\'" + combinationCode + "\');\">"+ combinationName +"</a></h2><p>"+ recommendReason +"</p></div></td>"
									+ "<td>"+ price +"</td>"
									+ "<td>"+ deliveryDate +"天</td></tr>";
						    }
						}
						$("#table").append(tr);
					}
		       });
		    }
		});
	}
function getCombinationData() {
    var json = {
        'caseCode': caseCode,
		'inputParams' : inputParams,
		'selectParams' : selectParams,
		'isPriceAsc' : priceSort,
		'isDeliveryDateAsc' : deliverySort,
		'pageNum' : 1,
		'pageSize' : 10
    };
    return json;
}
function getCombinationData2(api) {
    var json = {
        'caseCode': caseCode,
		'inputParams' : inputParams,
		'selectParams' : selectParams,
		'isPriceAsc' : priceSort,
		'isDeliveryDateAsc' : deliverySort,
		'pageNum' : api.getCurrent(),
		'pageSize' : 10
    };
    return json;
}
//详情
function details(combinationCode) {
	if(!window.localStorage){
        return false;
    }else{
        var storage=window.localStorage;
        var combinationCode = JSON.stringify(combinationCode);
        storage["combinationCode"]= combinationCode;
    }
    window.location.href = "detail.html"
}