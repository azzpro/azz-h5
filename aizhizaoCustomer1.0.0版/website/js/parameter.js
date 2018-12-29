var caseCode = JSON.parse(localStorage.getItem('caseCode'));
var inputParams = [];
var selectParams = [];
var inputParams2 = [];
var selectParams2 = [];
var inputParamstest = [];
var selectParamstest = [];
$(document).ready(function() {
    getInitParamsByCaseCode();
    $(".parameter").on('click','.parlr a',function(){
		if($(this).hasClass('csxz')){  //加
			$(this).addClass('curr');
			$(this).removeClass('csxz');
			upperCase();
		}else{   //减
			$(this).addClass('csxz');
			$(this).removeClass('curr');
			upperCase();
		}
	})
     $(".parameter").on('click','.pardel a',function(){
		$(this).parents('.pardel').siblings('.parlr').find('a').removeClass('curr');
		$(this).parents('.pardel').siblings('.parlr').find('a').removeClass('csxz');
		$(this).parents('.pardel').siblings('.parlr').find('a').addClass('csxz');
	})
    $("#Submission").bind("click", Submission);
    
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
function getInitParamsByCaseCode() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getInitParamsByCaseCode",
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
	
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getInitParamsByCaseCode",
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
    };
    return json;
}
//提交
function Submission() {
	var Params = $.extend(inputParamstest, selectParamstest);
	if(!Params || !Params.length){
		alert('请选择参数')
		return false;
	}
	if(!window.localStorage){
        return false;
    }else{
        var storage=window.localStorage;
        var inputParamss = JSON.stringify(inputParams);
        storage["inputParamss"]= inputParamss;
        var selectParamss = JSON.stringify(selectParams);
        storage["selectParamss"]= selectParamss;
    }
    window.location.href = "screen.html"
    
}