var assortmentCodeModel = JSON.parse(localStorage.getItem('assortmentCodeModel'));
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
					for(var i = 0;i<data.length;i++){
						var assortmentCode = data[i].assortmentCode;
						var assortmentName = data[i].assortmentName;
						if(data[i].childList==null || !data[i].childList.length!=0){
							
							li += "<li><a href='javascript:;' class='jia'><i class='fa fa-caret-right'></i> "+ assortmentName +"</a>"
							    + "</li>";
						}else{
							var lii = "";
							for(var j = 0;j < data[i].childList.length;j++){
								var assortmentCode2 = data[i].childList[j].assortmentCode;
								var assortmentName2 = data[i].childList[j].assortmentName;
								var assortmentPicUrl2 = data[i].childList[j].assortmentPicUrl;
								if(data[i].childList[j].childList==null || !data[i].childList[j].childList.length!=0){
									lii += "<ul class='modelList2 add'><li><a href='javascript:;' class='jia2'><i class='fa fa-caret-right'></i> "+ assortmentName2 +"</a>"
									+ "</li></ul>";
								}else{
									var liii = "";
									for(var f = 0;f < data[i].childList[j].childList.length;f++){
										var assortmentCode3 = data[i].childList[j].childList[f].assortmentCode;
										var assortmentName3 = data[i].childList[j].childList[f].assortmentName;
										liii += "<ul class='modelList3 add'><li><a href='javascript:;' class='jia3'><i class='fa fa-caret-right'></i> "+ assortmentName3 +"</a></li>"
										+ "</ul>";
									}
									lii += "<ul class='modelList2 add'><li><a href='javascript:;' class='jia2'><i class='fa fa-caret-right'></i> "+ assortmentName2 +"</a>"
									+ liii
									+ "</li></ul>";
								}
								
							}
							
							li += "<li><a href='javascript:;' class='jia'><i class='fa fa-caret-right'></i> "+ assortmentName +"</a>"
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