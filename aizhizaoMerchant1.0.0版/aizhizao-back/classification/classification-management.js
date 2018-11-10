Module.define("system.classification", function(page, $) {
	page.ready = function() {
		getClassificationList();
		
		$("#Search").bind("click", function() {		
			$("#tabs").empty();
			getClassificationList();
		});
		
		$("#tabs").on('click','.jia',function(){
			if($(this).hasClass('fa-plus-square-o')){  //加
				$(this).addClass('fa-minus-square-o');
				$(this).removeClass('fa-plus-square-o');
				$(this).parents('li').nextAll('.tab2').show();
				/*$(this).parents('.tab').siblings().find('.jia').addClass('fa-plus-square-o');*/
			}else{   //减
				$(this).addClass('fa-plus-square-o');
				$(this).removeClass('fa-minus-square-o');
				$(this).parents('li').nextAll('.tab2').hide();
			}
		})
		$("#tabs").on('click','.jia2',function(){
			if($(this).hasClass('fa-plus-square-o')){  //加
				$(this).addClass('fa-minus-square-o');
				$(this).removeClass('fa-plus-square-o');
				$(this).parents('li').nextAll('.tab3').show();
				/*$(this).parents('.tab2').siblings().find('.jia2').addClass('fa-plus-square-o');*/
			}else{   //减
				$(this).addClass('fa-plus-square-o');
				$(this).removeClass('fa-minus-square-o');
				$(this).parents('li').nextAll('.tab3').hide();
			}
		})
	}
	
	function getClassificationList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/classification/getClassificationList",
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
						var assortmentPicUrl = data[i].assortmentPicUrl;
						var assortmentCode = data[i].assortmentCode;
						var assortmentName = data[i].assortmentName;
						var assortmentSort = data[i].assortmentSort;
						var createTime = data[i].createTime;
						if(data[i].childList==null || !data[i].childList.length!=0){
							
							li += "<ul class='tab'><li class='tab-li'><span><i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span>"
							+ "<span>" + assortmentCode +"</span>"
							+ "<span>" + assortmentName +"</span>"
							+ "<span>" + assortmentSort +"</span>"
							+ "<span>" + '-' +"</span>"
							+ "<span>" + createTime +"</span>"
							+ "</li>"
							+ "</ul>";
						}else{
							var lii = "";
							for(var j = 0;j < data[i].childList.length;j++){
								var assortmentPicUrl2 = data[i].childList[j].assortmentPicUrl;
								var assortmentCode2 = data[i].childList[j].assortmentCode;
								var assortmentName2 = data[i].childList[j].assortmentName;
								var assortmentSort2 = data[i].childList[j].assortmentSort;
								var createTime2 = data[i].childList[j].createTime;
								if(data[i].childList[j].childList==null || !data[i].childList[j].childList.length!=0){
									lii += "<ul class='add tab2' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl2 +" width='48' height='48' alt='' /></span>"
									+ "<span>" + assortmentCode2 +"</span>"
									+ "<span>" + assortmentName2 +"</span>"
									+ "<span>" + assortmentSort2 +"</span>"
									+ "<span>" + '-' +"</span>"
									+ "<span>" + createTime2 +"</span>"
									+ "</li>"
									+ "</ul>";
								}else{
									var liii = "";
									for(var f = 0;f < data[i].childList[j].childList.length;f++){
										var assortmentPicUrl3 = data[i].childList[j].childList[f].assortmentPicUrl;
										var assortmentCode3 = data[i].childList[j].childList[f].assortmentCode;
										var assortmentName3 = data[i].childList[j].childList[f].assortmentName;
										var assortmentSort3 = data[i].childList[j].childList[f].assortmentSort;
										var createTime3 = data[i].childList[j].childList[f].createTime;
										liii += "<ul class='add tab3' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl3 +" width='48' height='48' alt='' /></span>"
										+ "<span>" + assortmentCode3 +"</span>"
										+ "<span>" + assortmentName3 +"</span>"
										+ "<span>" + assortmentSort3 +"</span>"
										+ "<span>" + '-' +"</span>"
										+ "<span>" + createTime3 +"</span>"
										+ "</li>"
										+ "</ul>";
									}
									lii += "<ul class='add tab2' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-plus-square-o jia2'></i> <img src=" + assortmentPicUrl2 +" width='48' height='48' alt='' /></span>"
									+ "<span>" + assortmentCode2 +"</span>"
									+ "<span>" + assortmentName2 +"</span>"
									+ "<span>" + assortmentSort2 +"</span>"
									+ "<span>" + '-' +"</span>"
									+ "<span>" + createTime2 +"</span>"
									+ "</li>"
									+ liii
									+ "</ul>";
								}
								
							}
							
							li += "<ul class='tab'><li class='tab-li'><span><i class='fa fa-plus-square-o jia'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span>"
							+ "<span>" + assortmentCode +"</span>"
							+ "<span>" + assortmentName +"</span>"
							+ "<span>" + assortmentSort +"</span>"
							+ "<span>" + '-' +"</span>"
							+ "<span>" + createTime +"</span>"
							+ "</li>"
							+ lii
							+ "</ul>";
							
						}
				    }
					$("#tabs").append(li);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}

});