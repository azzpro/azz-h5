Module.define("system.model", function(page, $) {
	page.ready = function() {
		getClassificationList();
		$("#tabs").on('click','.jia',function(){
			$(this).siblings('.modelList2').show();
			$(this).addClass('curr');
			$(this).parents('li').siblings().find('.modelList2').hide();
			$(this).parents('li').siblings().find('.jia').removeClass('curr');
			$(this).parents('li').siblings().find('.jia2').removeClass('curr');
			$(this).parents('li').siblings().find('.jia3').removeClass('curr');
		})
		$("#tabs").on('click','.jia2',function(){
			$(this).siblings('.modelList3').show();
			$(this).addClass('curr');
			$(this).parents('li').siblings().find('.modelList3').hide();
			$(this).parents('li').siblings().find('.jia2').removeClass('curr');
			$(this).parents('li').siblings().find('.jia3').removeClass('curr');
		})
		$("#tabs").on('click','.jia3',function(){
			$(this).addClass('curr');
			$(this).parents('li').siblings().find('.jia3').removeClass('curr');
		})
	}
	function getClassificationList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/selection/getClassificationList",
			cache: false, //禁用缓存   
			async: false,
			dataType: "json", 
			data: {
				'param': $("input[name='nameNo']").val()
			},
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var li = '';
					var divarr = '';
					for(var i = 0;i<data.length;i++){
						var assortmentCode = data[i].assortmentCode;
						var assortmentName = data[i].assortmentName;
						if(data[i].childList==null || !data[i].childList.length!=0){
							
							li += "<li><a href='javascript:;' class='jia' onclick=\"system.model.screen(\'" + assortmentCode + "\');\"><i class='fa fa-caret-right'></i> "+ assortmentName +"</a>"
							    + "</li>";
							divarr += "<div class='modelbt'><a class='pull-right' onclick=\"system.model.screen(\'" + assortmentCode + "\');\" href='javascript:;'>查看更多</a><i class='fa fa-caret-right'></i> "+ assortmentName +"</div><div class='row modelfl'></div>";
						}else{
							var lii = "";
							var divarr2 = "";
							for(var j = 0;j < data[i].childList.length;j++){
								var assortmentCode2 = data[i].childList[j].assortmentCode;
								var assortmentName2 = data[i].childList[j].assortmentName;
								var assortmentPicUrl2 = data[i].childList[j].assortmentPicUrl;
								if(data[i].childList[j].childList==null || !data[i].childList[j].childList.length!=0){
									lii += "<ul class='modelList2 add'><li><a href='javascript:;' onclick=\"system.model.screen(\'" + assortmentCode2 + "\');\" class='jia2'><i class='fa fa-caret-right'></i> "+ assortmentName2 +"</a>"
									+ "</li></ul>";
									divarr2 += "<div class='col-xs-2'><a class='nodecoration' href='javascript:;' onclick=\"system.model.screen(\'" + assortmentCode2 + "\');\"><img src='"+ assortmentPicUrl2 +"' width='100%' height='80px' alt='' /><div class='faan'>"+ assortmentName2 +"</div></a></div>";
								}else{
									var liii = "";
									for(var f = 0;f < data[i].childList[j].childList.length;f++){
										var assortmentCode3 = data[i].childList[j].childList[f].assortmentCode;
										var assortmentName3 = data[i].childList[j].childList[f].assortmentName;
										liii += "<ul class='modelList3 add'><li><a href='javascript:;' onclick=\"system.model.screen(\'" + assortmentCode3 + "\');\" class='jia3'><i class='fa fa-caret-right'></i> "+ assortmentName3 +"</a></li>"
										+ "</ul>";
									}
									lii += "<ul class='modelList2 add'><li><a href='javascript:;' onclick=\"system.model.screen(\'" + assortmentCode2 + "\');\" class='jia2'><i class='fa fa-caret-right'></i> "+ assortmentName2 +"</a>"
									+ liii
									+ "</li></ul>";
									divarr2 += "<div class='col-xs-2'><a class='nodecoration' href='javascript:;' onclick=\"system.model.screen(\'" + assortmentCode2 + "\');\"><img src='"+ assortmentPicUrl2 +"' width='100%' height='80px' alt='' /><div class='faan'>"+ assortmentName2 +"</div></a></div>";
								}
								
							}
							
							li += "<li><a href='javascript:;' class='jia' onclick=\"system.model.screen(\'" + assortmentCode + "\');\"><i class='fa fa-caret-right'></i> "+ assortmentName +"</a>"
							    + lii
							    + "</li>";
							divarr += "<div class='modelbt'><a onclick=\"system.model.screen(\'" + assortmentCode + "\');\" class='pull-right' href='javascript:;'>查看更多</a><i class='fa fa-caret-right'></i> "+ assortmentName +"</div><div class='row modelfl'>"+ divarr2 +"</div>";
							
						}
				    }
					$("#tabs").append(li);
					$("#navList").append(divarr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.screen = function(assortmentCode) {
		if(!window.localStorage){
	        return false;
	    }else{
	        var storage=window.localStorage;
	        var assortmentCodeModel = JSON.stringify(assortmentCode);
	        storage["assortmentCodeModel"]= assortmentCodeModel;
	    }
	    window.location.href = "#!model/model-screen.html"
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