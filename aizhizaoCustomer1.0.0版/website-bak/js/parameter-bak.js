var caseCode = JSON.parse(localStorage.getItem('caseCode'));
var inputParams = [];
var selectParams = [];
$(document).ready(function() {
    getInitParamsByCaseCode();
    
    $("#parameter").on('click','.parlr a',function(){
		if($(this).hasClass('csxz')){  //加
			$(this).addClass('curr');
			$(this).removeClass('csxz');
		}else{   //减
			$(this).addClass('csxz');
			$(this).removeClass('curr');
		}
	})
     $("#parameter").on('click','.pardel a',function(){
		$(this).parents('.pardel').siblings('.parlr').find('a').removeClass('curr');
		$(this).parents('.pardel').siblings('.parlr').find('a').removeClass('csxz');
		$(this).parents('.pardel').siblings('.parlr').find('a').addClass('csxz');
	})
    $('input').blur(upperCase);
});
function getInitParamsByCaseCode() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getInitParamsByCaseCode",
		cache: false, //禁用缓存   
		async:false,
		dataType: "json", 
		data: {
			'caseCode': caseCode
		},
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
									liii +="<a class='csxz' href='javascript:;' paramsTermId='"+ paramsTermId +"'><i class='jia'>+</i><i class='del'>x</i>"+ paramValuess[r] +"</a>";
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
								var maxVal = paramsTerms[y].maxVal;
								var minVal = paramsTerms[y].minVal;
								var paramsName = paramsTerms[y].paramsName;
								var paramsTermId = paramsTerms[y].paramsTermId;
								li += "<li><span>"+ paramsName +"</span><input maxVal='"+ maxVal +"' paramsTermId='"+ paramsTermId +"' minVal='"+ minVal +"' type='text' value='' placeholder='"+ minVal + "~" + maxVal +"' /></li>";
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
	if($(this).val() == '' || parseFloat($(this).val()) >= parseFloat($(this).attr("minVal")) && parseFloat($(this).val()) <= parseFloat($(this).attr("maxVal"))){}else{
		$(this).val('');
		alert('输入的值超出范围');
		return false;
	}
	
	$(this).each(function(){
		var Newsobj = {
			"minVal" : $(this).val(),
			"maxVal" : $(this).attr("maxVal"),
			"paramsTermId" : $(this).attr("paramsTermId"),
		}
		// 声明数据是否存在于数组的标识，默认为不存在
		var existsDataFlag = false;
		
		for(var i=0;i<inputParams.length;i++){
			// 如果数据在数组中已经存在
			if($(this).attr("paramsTermId") == inputParams[i].paramsTermId){
				// 更新数据至数组中
				inputParams[i] = Newsobj;
				// 修改标识为数据已经存在
				existsDataFlag = true;
				// 中断循环
				break;
			}
		}
		// 如果数据不存在于数组，则插入数据到数组中
		if (!existsDataFlag) {
			inputParams.push(Newsobj);
		}
		
	});
	$.each(inputParams,function(index,item){
		// index是索引值（即下标）   item是每次遍历得到的值；
		if(item.minVal == ''){
			inputParams.splice(index,1);
			return false;
		}
	});
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getCombinationInitParams",
		cache: false, //禁用缓存   
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(GetJsonData()),
		success: function(data) {
			if (data.code == 0) {
				$(".parameter").empty();
				$(".inputList").empty();
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
									liii +="<a class='csxz' href='javascript:;' paramsTermId='"+ paramsTermId +"'><i class='jia'>+</i><i class='del'>x</i>"+ paramValuess[r] +"</a>";
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
								var maxVal = paramsTerms[y].maxVal;
								var minVal = paramsTerms[y].minVal;
								var paramsName = paramsTerms[y].paramsName;
								var paramsTermId = paramsTerms[y].paramsTermId;
								li += "<li><span>"+ paramsName +"</span><input maxVal='"+ maxVal +"' paramsTermId='"+ paramsTermId +"' minVal='"+ minVal +"' type='text' value='' placeholder='"+ minVal + "~" + maxVal +"' /></li>";
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
function GetJsonData() {
    var json = {
        'caseCode': caseCode,
		'inputParams' : inputParams,
		'selectParams' : selectParams,
    };
    return json;
}