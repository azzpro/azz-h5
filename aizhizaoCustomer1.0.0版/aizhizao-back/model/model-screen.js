var assortmentCodeModel = JSON.parse(localStorage.getItem('assortmentCodeModel'));
var assortmentTopModel = JSON.parse(localStorage.getItem('assortmentTopModel'));
var assortmentNameModel = JSON.parse(localStorage.getItem('assortmentNameModel'));
var priceSort,deliverySort;
var inputParams = [];
var selectParams = [];
var inputParams2 = [];
var selectParams2 = [];
Module.define("system.model", function(page, $) {
	page.ready = function() {
		getClassificationList();
		$('.flname').html(assortmentNameModel);
		if(assortmentTopModel == 3){
			$('#fltheer').show();
			$('#flonetwo').hide();
			getSelectionModuleParams();
			getCombinationInfos();
		}else{
			$('#flonetwo').show();
			$('#fltheer').hide();
			getClassificationChildPagination();
			getCombinationInfos();
		}
		$("#tabs").on('click','.jia',function(){
			$(this).siblings('.modelList2').show();
			$(this).addClass('curr');
			$(this).parents('ul').siblings().find('.modelList2').hide();
			$(this).parents('li').siblings().find('.modelList2').hide();
			$(this).parents('ul').siblings().find('.jia').removeClass('curr');
			$(this).parents('ul').siblings().find('.jia2').removeClass('curr');
			$(this).parents('ul').siblings().find('.jia3').removeClass('curr');
			$(this).parents('li').siblings().find('.jia').removeClass('curr');
			$(this).parents('li').siblings().find('.jia2').removeClass('curr');
			$(this).parents('li').siblings().find('.jia3').removeClass('curr');
			$('.flname').html($(this).text());
		})
		$("#tabs").on('click','.jia2',function(){
			$(this).siblings('.modelList3').show();
			$(this).addClass('curr');
			$(this).parents('ul').siblings().find('.modelList3').hide();
			$(this).parents('li').siblings().find('.modelList3').hide();
			$(this).parents('ul').siblings().find('.jia2').removeClass('curr');
			$(this).parents('ul').siblings().find('.jia3').removeClass('curr');
			$(this).parents('li').siblings().find('.jia2').removeClass('curr');
			$(this).parents('li').siblings().find('.jia3').removeClass('curr');
			$('.flname').html($(this).text());
		})
		$("#tabs").on('click','.jia3',function(){
			$(this).addClass('curr');
			$(this).parents('ul').siblings().find('.jia3').removeClass('curr');
			$('.flname').html($(this).text());
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
			$(this).addClass('defaultsortNo');
			$(this).removeClass('defaultsort')
		})
	}
	function getClassificationList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/getClassificationList",
			cache: false, //禁用缓存   
			dataType: "json", 
			data: {
				'param': $("input[name='nameNo']").val()
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					for(var i = 0;i<data.length;i++){
						var assortmentCode = data[i].assortmentCode;
						var assortmentName = data[i].assortmentName;
						var assortmentTop = 1;
						if(data[i].childList==null || !data[i].childList.length!=0){
							
							li += "<li><a href='javascript:;' assorcode='"+ assortmentCode +"' onclick=\"system.model.screen(\'" + assortmentCode + "','" + assortmentTop + "','" + assortmentName + "\');\" class='jia'><i class='fa fa-caret-right'></i> "+ assortmentName +"</a>"
							    + "</li>";
						}else{
							var lii = "";
							for(var j = 0;j < data[i].childList.length;j++){
								var assortmentCode2 = data[i].childList[j].assortmentCode;
								var assortmentName2 = data[i].childList[j].assortmentName;
								var assortmentPicUrl2 = data[i].childList[j].assortmentPicUrl;
								var assortmentTop2 = 2;
								if(data[i].childList[j].childList==null || !data[i].childList[j].childList.length!=0){
									lii += "<ul class='modelList2 add'><li><a href='javascript:;' assorcode='"+ assortmentCode2 +"' onclick=\"system.model.screen(\'" + assortmentCode2 + "','" + assortmentTop2 + "','" + assortmentName2 + "\');\" class='jia2'><i class='fa fa-caret-right'></i> "+ assortmentName2 +"</a>"
									+ "</li></ul>";
								}else{
									var liii = "";
									for(var f = 0;f < data[i].childList[j].childList.length;f++){
										var assortmentCode3 = data[i].childList[j].childList[f].assortmentCode;
										var assortmentName3 = data[i].childList[j].childList[f].assortmentName;
										var assortmentTop3 = 3;
										liii += "<ul class='modelList3 add'><li><a href='javascript:;' assorcode='"+ assortmentCode3 +"' onclick=\"system.model.screen2(\'" + assortmentCode3 + "','" + assortmentTop3 + "','" + assortmentName3 + "\');\" class='jia3'><i class='fa fa-caret-right'></i> "+ assortmentName3 +"</a></li>"
										+ "</ul>";
									}
									lii += "<ul class='modelList2 add'><li><a href='javascript:;' assorcode='"+ assortmentCode2 +"' onclick=\"system.model.screen(\'" + assortmentCode2 + "','" + assortmentTop2 + "','" + assortmentName2 + "\');\" class='jia2'><i class='fa fa-caret-right'></i> "+ assortmentName2 +"</a>"
									+ liii
									+ "</li></ul>";
								}
								
							}
							li += "<li><a href='javascript:;' assorcode='"+ assortmentCode +"' onclick=\"system.model.screen(\'" + assortmentCode + "','" + assortmentTop + "','" + assortmentName + "\');\" class='jia'><i class='fa fa-caret-right'></i> "+ assortmentName +"</a>"
							    + lii
							    + "</li>";
							
						}
				    }
					$("#tabs").append(li);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.screen = function(assortmentCode,assortmentTop,assortmentName) {
		$('#flonetwo').show();
		$('#fltheer').hide();
		$('.flname').html(assortmentName);
		assortmentCodeModel = assortmentCode;
		assortmentTopModel = assortmentTop;
		$("#modelfl").empty();
		getClassificationChildPagination();
		$("#table").empty();
		getCombinationInfos();
		
	}
	page.screen2 = function(assortmentCode,assortmentTop,assortmentName) {
		$('#fltheer').show();
		$('#flonetwo').hide();
		$('.flname').html(assortmentName);
		assortmentCodeModel = assortmentCode;
		assortmentTopModel = assortmentTop;
		
		var inputParamsEli = $('#inputParams input');
		for(var i = 0;i<inputParamsEli.length;i++){
			if(inputParamsEli[i].checked == true){
				$(inputParamsEli[i]).attr("checked",false);
			}
		}
		var selectParamsEli = $('#selectParams input');
		for(var i = 0;i<selectParamsEli.length;i++){
			if(selectParamsEli[i].checked == true){
				$(selectParamsEli[i]).attr("checked",false);
			}
		}
		selectParams.splice(0,selectParams.length);
		inputParams.splice(0,inputParams.length);
		
		$("#inputParams").empty();
		$("#selectParams").empty();
		getSelectionModuleParams();
		$("#table").empty();
		getCombinationInfos();
	}

	function getClassificationChildPagination() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/getClassificationChildPagination",
			cache: false, //禁用缓存   
			dataType: "json", 
			data: {
				'assortmentCode': assortmentCodeModel,
				'pageNum' : 1,
				'pageSize': 100,
			},
			success: function(data) {
				if (data.code == 0) {
					var rows = data.data.rows;
					var li = '';
					if(!rows || !rows.length){
							li += "<div class='col-xs-12 text-center'>暂无分类</div>";
						}else{
							for(var i = 0;i<rows.length;i++){
							var assortmentCode = rows[i].assortmentCode;
							var assortmentName = rows[i].assortmentName;
							var assortmentPicUrl = rows[i].assortmentPicUrl;
							var assortmentTop = rows[i].assortmentTop + 1;
							if(assortmentTop == 3){
								li += "<div class='col-xs-2'><a class='nodecoration' href='javascript:;' onclick=\"system.model.screen2(\'" + assortmentCode + "','" + assortmentTop + "','" + assortmentName + "\');\"><img src='" + assortmentPicUrl + "' width='100%' height='80px' alt='' /><div class='faan'>"+ assortmentName +"</div></a></div>";
							}else{
								li += "<div class='col-xs-2'><a class='nodecoration' href='javascript:;' onclick=\"system.model.screen(\'" + assortmentCode + "','" + assortmentTop + "','" + assortmentName + "\');\"><img src='" + assortmentPicUrl + "' width='100%' height='80px' alt='' /><div class='faan'>"+ assortmentName +"</div></a></div>";
							}
						}
				    }
					$("#modelfl").append(li);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function getSelectionModuleParams() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/getSelectionModuleParams",
			cache: false, //禁用缓存   
			contentType: "application/json; charset=utf-8",
			dataType: "json", 
			data:JSON.stringify(getSelectionModuleParamsData()),
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
									
									for(var r = 0;r<paramValuess.sort().length;r++){
										liii +="<label class='checkbox-inline'><input onclick='system.model.checkQx(this)' type='checkbox' paramsTermId='"+ paramsTermId +"' value='"+ paramValuess[r] +"'> "+ paramValuess[r] +"</label>";
									}
									lii += "<tr><td width='20%' align='right'>"+ paramsName +"：</td><td width='80%' class='selectParamsTD'>"
									    + liii
			    		  	            + "</td></tr>";
								}
								$("#selectParams").append(lii);
								selectParams2.splice(0,selectParams2.length);
								var selectdb = $('#selectParams input');
								for(var m = 0; m<selectdb.length; m++){
									var Newsobj1 = {
										"paramsTermId" : $(selectdb[m]).attr("paramsTermId"),
										"paramsValue" : $(selectdb[m]).attr("value")
									}
									selectParams2.push(Newsobj1);
									
								}
								for(var k = 0;k<selectParams2.length;k++){
									if( JSON.stringify(selectParams).indexOf(JSON.stringify(selectParams2[k])) != -1 ){
										selectdb.eq(k).attr("checked",true);
									}
								}
							}
							if(paramsType == 2){
								var lii = '';
								for(var y = 0;y<paramsTerms.length;y++){
									var paramValues = paramsTerms[y].paramValues;
									var paramValuess = paramValues.split(',');
									var paramsName = paramsTerms[y].paramsName;
									var paramsTermId = paramsTerms[y].paramsTermId;
									var liit = '';
									for(var r = 0;r<paramValuess.sort().length;r++){
										liit +="<label class='checkbox-inline'><input type='checkbox' onclick='system.model.checkQx2(this)' paramsTermId='"+ paramsTermId +"' value='"+ paramValuess[r] +"'> "+ paramValuess[r] +"</label>";
									}
									lii += "<tr><td width='20%' align='right'>"+ paramsName +"：</td><td width='80%' class='inputParamsTD'>"
									    + liit
			    		  	            + "</td></tr>";
								}
								$("#inputParams").append(lii);
								
								inputParams2.splice(0,inputParams2.length);
								var inputdb = $('#inputParams input');
								for(var m = 0; m<inputdb.length; m++){
									var Newsobj3= {
										"paramsTermId" : $(inputdb[m]).attr("paramsTermId"),
										"paramsValue" : $(inputdb[m]).attr("value")
									}
									inputParams2.push(Newsobj3);
									
								}
								for(var k = 0;k<inputParams2.length;k++){
									if( JSON.stringify(inputParams).indexOf(JSON.stringify(inputParams2[k])) != -1 ){
										inputdb.eq(k).attr("checked",true);
									}
								}
							}
					    }
					}
					var selectParamsTd = $('#selectParams .selectParamsTD');
					for(var i = 0;i<selectParamsTd.length;i++){
						var selectParamslabel = $(selectParamsTd[i]).children('label');
						if(selectParamslabel.length == 1){
							$(selectParamsTd[i]).parents("tr").attr("class","add");
						}
					}
					var inputParamsTd = $('#inputParams .inputParamsTD');
					for(var i = 0;i<inputParamsTd.length;i++){
						var inputParamslabel = $(inputParamsTd[i]).children('label');
						if(inputParamslabel.length == 1){
							$(inputParamsTd[i]).parents("tr").attr("class","add");
						}
					}
					var checkboxinline = $('.checkbox-inline input');
					for(var i = 0;i<checkboxinline.length;i++){
						if ( checkboxinline[i].checked == true){
							$(checkboxinline[i]).parents("tr").removeClass('add')
						}
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	function getSelectionModuleParamsData() {
	    var json = {
	        'assortmentCode': assortmentCodeModel,
			'level' : assortmentTopModel,
			'selectParams' : selectParams,
			'inputParams' : inputParams,
	    };
	    return json;
	}
	
	page.checkQx = function (selectcheckbox) {
		if ( selectcheckbox.checked == true){
			var Newsobj = {
				"paramsTermId" : $(selectcheckbox).attr("paramsTermId"),
				"paramsValue" : $(selectcheckbox).attr("value"),
			}
			selectParams.push(Newsobj);
		}else{
			$.each(selectParams,function(index,item){
				// index是索引值（即下标）   item是每次遍历得到的值；
				if(item.paramsTermId== $(selectcheckbox).attr("paramsTermId") && item.paramsValue== $(selectcheckbox).attr("value")){
					selectParams.splice(index,1);
					return false;
				}
			});
		}
		$("#selectParams").empty();
		$("#inputParams").empty();
		getSelectionModuleParams();
		$("#table").empty();
		getCombinationInfos();
	}
	
	page.checkQx2 = function (inputcheckbox) {
		if ( inputcheckbox.checked == true){
			var Newsobj = {
				"paramsTermId" : $(inputcheckbox).attr("paramsTermId"),
				"paramsValue" : $(inputcheckbox).attr("value"),
			}
			inputParams.push(Newsobj);
		}else{
			$.each(inputParams,function(index,item){
				// index是索引值（即下标）   item是每次遍历得到的值；
				if(item.paramsTermId== $(inputcheckbox).attr("paramsTermId") && item.paramsValue== $(inputcheckbox).attr("value")){
					inputParams.splice(index,1);
					return false;
				}
			});
		}
		$("#selectParams").empty();
		$("#inputParams").empty();
		getSelectionModuleParams();
		$("#table").empty();
		getCombinationInfos();
	}
	
	function getCombinationInfos() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/client/selection/getSelectionModuleInfos",
		cache: false, //禁用缓存   
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		data:JSON.stringify(getCombinationData()),
		success: function(data) {
			if (data.code == 0) {
				$('#total').html(data.data.total);
				$('#Totalquantity').html(data.data.total);
				var rows = data.data.rows;
				var tr = '';
				if(!rows || !rows.length){
					tr += "<tr><td colspan='3'>无任何内容</td></tr>";
				}else{
					
					for(var i = 0;i<rows.length;i++){
						var modulePicUrl = rows[i].modulePicUrl;
						var moduleName = rows[i].moduleName;
						var moduleCodemodel = rows[i].moduleCode;
						var deliveryDate = rows[i].minDeliveryDate;
						var price = rows[i].minPrice.toFixed(2);
						var recommendReason = rows[i].moduleRemark;
						if(recommendReason){
							
						}else{
							var recommendReason = '-'
						}
						tr += "<tr><td class='textleft'><a href='javascript:;'onclick=\"system.model.details(\'" + moduleCodemodel + "\');\"><img src='"+ modulePicUrl +"' class='tj-tu left' alt='' /></a><div class='tj-zi left'><h2><a href='javascript:;' onclick=\"system.model.details(\'" + moduleCodemodel + "\');\">"+ moduleName +"</a></h2><p>"+ recommendReason +"</p></div></td>"
							+ "<td>"+ price +"</td>"
							+ "<td>"+ deliveryDate +"天</td></tr>";
				    }
				}
				$("#table").append(tr);
				Pagination();
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
					url: ulrTo+"/azz/api/client/selection/getSelectionModuleInfos",
					cache: false, //禁用缓存   
					contentType: "application/json; charset=utf-8",
					dataType: "json", 
					data:JSON.stringify(getCombinationData2(api)),
					success: function(data) {
				        	$("#table").empty();
				        	$('#Totalquantity').html(data.data.total);
				        	var rows = data.data.rows;
							var tr = '';
						if(!rows || !rows.length){
							tr += "<tr><td colspan='3'>无任何内容</td></tr>";
						}else{
							for(var i = 0;i<rows.length;i++){
								var modulePicUrl = rows[i].modulePicUrl;
								var moduleName = rows[i].moduleName;
								var moduleCodemodel = rows[i].moduleCode;
								var deliveryDate = rows[i].minDeliveryDate;
								var price = rows[i].minPrice.toFixed(2);
								var recommendReason = rows[i].moduleRemark;
								if(recommendReason){
									
								}else{
									var recommendReason = '-'
								}
								tr += "<tr><td class='textleft'><a href='javascript:;' onclick=\"system.model.details(\'" + moduleCodemodel + "\');\"><img src='"+ modulePicUrl +"' class='tj-tu left' alt='' /></a><div class='tj-zi left'><h2><a href='javascript:;' onclick=\"system.model.details(\'" + moduleCodemodel + "\');\">"+ moduleName +"</a></h2><p>"+ recommendReason +"</p></div></td>"
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
	        'assortmentCode': assortmentCodeModel,
			'level' : assortmentTopModel,
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
	        'assortmentCode': assortmentCodeModel,
	        'level' : assortmentTopModel,
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
	page.details = function (moduleCodemodel) {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var moduleCodemodel = JSON.stringify(moduleCodemodel);
	        storage["moduleCodemodel"]= moduleCodemodel;
	    }
	    window.location.href = "#!model/model-detail.html"
	}
	
	$('.datepicker_start').datepicker({
		minDate: new Date()
	});
	$('.datepicker_end').datepicker({
		minDate: new Date()
	});
	$('.datepicker_start2').css({
		zIndex: "1052"
	}).datepicker();

	// search_class
	$(".search_class").select2({
		width: '100%'
	});
	// select_card
	$(".select_card").select2({
		width: '100%',
		minimumResultsForSearch: -1
	});
});