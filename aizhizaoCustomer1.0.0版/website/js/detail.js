var combinationCode = JSON.parse(localStorage.getItem('combinationCode'));
var inputParams = [];
var selectParams = [];
var inputParams2 = [];
var selectParams2 = [];
var inputParamstest = [];
var selectParamstest = [];
$(document).ready(function() {
    getCombinationDetail();
    $("#submit").bind("click", login);
    $("#saverecord").bind("click", addSelectionRecord);
    $(".aaList").on('click','dd a',function(){
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
    $("#table").on('click','.jiahao',function(){
		$(this).addClass('guohao');
		$(this).removeClass('jiahao');
		$(this).parents('tr').siblings().find('span').addClass('jiahao');
		$(this).parents('tr').siblings().find('span').removeClass('guohao');
	})
    $("input[name='productprice']:checked").bind("change", function(){
			alert('ddddd')
		});
});
function getCombinationDetail() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getCombinationDetail",
		cache: false, //禁用缓存   
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(GetJsonDatatoo()),
		success: function(data) {
			if (data.code == 0) {
				var params = data.data.params;
				if(!params || !params.length){
					
				}else{
					for(var i = 0;i<params.length;i++){
						var paramsType = params[i].paramsType;
						var paramsTerms = params[i].paramsTerms;
						if(paramsType == 1){
							var lii = '';
							for(var j = 0;j<paramsTerms.length;j++){
								var paramValues = paramsTerms[j].paramValues;
								var paramValuess = paramValues.split(',');
								var paramsName = paramsTerms[j].paramsName;
								var paramsTermId = paramsTerms[j].paramsTermId;
								var liii = '';
								for(var r = 0;r<paramValuess.length;r++){
									liii +="<dd><a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a></dd>";
								}
								lii += "<dl class='c'><dt>"+ paramsName +"</dt>"
	  								+ liii
	  								+ "</dl>";
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
									liit +="<dd><a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a></dd>";
								}
								li += "<dl class='c'><dt>"+ paramsName +"</dt>"
	  								+ liit
	  								+ "</dl>";
							}
							$("#inputList").append(li);
						}
				    }
				}
				
				$('#combinationPicUrl').attr("src", data.data.combinationPicUrl);
				$('#combinationName').html(data.data.combinationName);
				$('#recommendReason').html(data.data.recommendReason);
				
				var productInfos = data.data.productInfos;
				var tr = '';
				if(!productInfos || !productInfos.length){
					tr += "<tr><td>无任何内容</td></tr>";
				}else{
					for(var i = 0;i<productInfos.length;i++){
						var productInfosArr = productInfos[i];
						var td = '';
						for(var r = 0;r<productInfosArr.length;r++){
							td +="<td>"+ productInfosArr[r] +"</td>";
						}
						tr +="<tr><td><span onclick=\"productselection(\'" + productInfosArr[0] + "\');\" class='jiahao'></span></td>"
						   + td
				    	   + "</tr>";
				    }
				}
				$("#table").append(tr);
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
	}
	
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getCombinationDetail",
		cache: false, //禁用缓存   
		async: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(GetJsonData()),
		success: function(data) {
			if (data.code == 0) {
				$("#parameter").empty();
				$("#inputList").empty();
				$("#table").empty();
				
				inputParams2.splice(0,inputParams2.length);
				selectParams2.splice(0,selectParams2.length);
				var params = data.data.params;
				if(!params || !params.length){
					
				}else{
					for(var i = 0;i<params.length;i++){
						var paramsType = params[i].paramsType;
						var paramsTerms = params[i].paramsTerms;
						if(paramsType == 1){
							var lii = '';
							for(var j = 0;j<paramsTerms.length;j++){
								var paramValues = paramsTerms[j].paramValues;
								var paramValuess = paramValues.split(',');
								var paramsName = paramsTerms[j].paramsName;
								var paramsTermId = paramsTerms[j].paramsTermId;
								var liii = '';
								for(var r = 0;r<paramValuess.length;r++){
									liii +="<dd><a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a></dd>";
								}
								lii += "<dl class='c'><dt>"+ paramsName +"</dt>"
	  								+ liii
	  								+ "</dl>";
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
									liit +="<dd><a class='csxz' href='javascript:;'><i class='jia'>+</i><i class='del'>x</i><span>"+ paramValuess[r] +"</span><p style='display: none;'>"+ paramsTermId +"</p></a></dd>";
								}
								li += "<dl class='c'><dt>"+ paramsName +"</dt>"
	  								+ liit
	  								+ "</dl>";
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
				
				$('#combinationPicUrl').attr("src", data.data.combinationPicUrl);
				$('#combinationName').html(data.data.combinationName);
				$('#recommendReason').html(data.data.recommendReason);
				
				var productInfos = data.data.productInfos;
				var tr = '';
				if(!productInfos || !productInfos.length){
					tr += "<tr><td>无任何内容</td></tr>";
				}else{
					for(var i = 0;i<productInfos.length;i++){
						var productInfosArr = productInfos[i];
						var td = '';
						for(var r = 0;r<productInfosArr.length;r++){
							td +="<td>"+ productInfosArr[r] +"</td>";
						}
						tr +="<tr><td><span onclick=\"productselection(\'" + productInfosArr[0] + "\');\" class='jiahao'></span></td>"
						   + td
				    	   + "</tr>";
				    }
				}
				$("#table").append(tr);
			} else {
				alert(data.msg)
			}
		}
	});
}
function GetJsonData() {
    var json = {
        'combinationCode': combinationCode,
		'inputParams' : inputParams,
		'selectParams' : selectParams,
    };
    return json;
}
function GetJsonDatatoo() {
    var json = {
        'combinationCode': combinationCode,
    };
    return json;
}

//读取产品编码
function productselection(productInfo) {
	$("#deliveryDate").empty();
	$('#prodseyes').show();
	$('#prodse').hide();
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getProductPrice",
		cache: false, //禁用缓存
		data: {
			productCode: productInfo,
		},
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				$('#productCode').html(data.productCode);
				var inputs = '';
				var prices = data.prices;
				for(var i = 0;i<prices.length;i++){
					var deliveryDate = prices[i].deliveryDate;
					var price = prices[i].price;
					var productPriceId = prices[i].productPriceId;
					inputs +="<label><input type='radio' onclick=\"priceselection(\'" + price + "\');\" name='productprice' value='"+ productPriceId +"'> "+ deliveryDate +"天</label>&nbsp;&nbsp;&nbsp;&nbsp;";
			    }
				$("#deliveryDate").append(inputs);
			} else {
				alert(data.msg)
			}
		}
	});
}
function priceselection(price) {
	$('#price').html(price)
}

//保存产品
function addSelectionRecord() {
	if(!$("input[name='productprice']:checked").val()){
		alert('请选择产品交期');
		return;
	}
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/addSelectionRecord",
		cache: false, //禁用缓存
		data: {
			productCode: $('#productCode').html(),
			productPriceId: $("input[name='productprice']:checked").val(),
		},
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				$('#myModal2').modal('show')
			} else if(data.code == 40001){
				alert('请先登录');
				$('#myModal').modal('show')
			} else {
				alert(data.msg)
			}
		}
	});
}

function login() {
	var uname = $("input[name='username']").val();
	var pword = $("input[name='password']").val();
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/login",
		data: {'phoneNumber': uname,'password': pword},
		success: function(data) {
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
				$('#myModal').modal('hide')
				return;
			} else {
				$(".passwordhtml").html(data.msg);
			}
		}
	});
}

//全局ajax请求设置，页面上所有的ajax请求，如果未登陆跳转则到登录界面
$.ajaxSetup({
	crossDomain: true,
	cache : false,  //关闭缓存
	beforeSend: function(request) {
		var sessionId = JSON.parse(localStorage.getItem('sessionId'));
		request.setRequestHeader("token",sessionId);
	},
});