var wxorderCode = JSON.parse(localStorage.getItem('wxorderCode'));
Module.define("system.courorder", function(page, $) {
	page.ready = function() {
		getPlatformCourseOrderDetail();
		$("#receiptS").bind("click", confirmCourseOrder);
	}

	function getPlatformCourseOrderDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/course/order/getPlatformCourseOrderDetail",
			cache: false, //禁用缓存
			data: {
				'orderCode':wxorderCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var orderInfo = data.data;
					$('#orderCode').html(orderInfo.orderCode);
					$('#orderTime').html(orderInfo.orderTime);
					switch(orderInfo.orderStatus) {
						case 13:
							$('#orderStatus').html('待支付');
							break;
						case 14:
							$('#orderStatus').html('待处理');
							break;
						case 15:
							$('#orderStatus').html('待确认');
							break;
						case 16:
							$('#orderStatus').html('待评价');
							break;
						case 17:
							$('#orderStatus').html('已完成');
							break;
						case 18:
							$('#orderStatus').html('已关闭');
							break;
					};
					$('#personName').html(orderInfo.personName);
					$('#phoneNumber').html(orderInfo.phoneNumber);
					$('#email').html(orderInfo.email);
					$('#graduateSchool').html(orderInfo.graduateSchool);
					$('#company').html(orderInfo.company);
					$('#nickName').html(orderInfo.nickName);
					$('#openid').html(orderInfo.openid);
					$('#wxBindingPhone').html(orderInfo.wxBindingPhone);
					$('#courseName').html(orderInfo.courseName);
					$('#classificationName').html(orderInfo.classificationName);
					$('#courseParams').html(orderInfo.courseParams);
					$('#startClassCode').html(orderInfo.startClassCode);
					$('#startClassName').html(orderInfo.startClassName);
					$('#peopleNumber').html(orderInfo.peopleNumber);
					$('#startClassTime').html(orderInfo.startClassTime);
					$('#location').html(orderInfo.location);
					$('#price').html(orderInfo.price);
					if(orderInfo.orderStatus==17){
						$('#evaluate').show();
						$('#evaluationContent').html(orderInfo.evaluationContent);
						switch(orderInfo.grade) {
							case 1:
								$('#grade').html('<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span>');
								break;
							case 2:
								$('#grade').html('<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span>');
								break;
							case 3:
								$('#grade').html('<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span>');
								break;
							case 4:
								$('#grade').html('<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span>');
								break;
							case 5:
								$('#grade').html('<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span>');
								break;
						};
					}
					if(orderInfo.orderStatus==14){
						$('#receiptS').show();
					}else{
						$('#receiptS').hide();
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//确认
	function confirmCourseOrder() {
		$.ajax({
				type: "POST",
				url: ulrTo + "/azz/api/platform/course/order/confirmCourseOrder",
				cache: false, //禁用缓存   
				dataType: "json", 
				data: {
					'orderCode': $('#orderCode').html()
				},
				success: function(data) {
					if (data.code == 0) {
						getPlatformCourseOrderDetail();
	  					alert("操作成功！");
					} else {
						alert(data.msg);
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