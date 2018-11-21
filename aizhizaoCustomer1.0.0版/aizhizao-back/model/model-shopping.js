Module.define("system.model", function(page, $) {
	page.ready = function() {
		init();
		getShippingAddressList();
		getDefaultShippingAddress();
		$("#addShippingAddress").bind("click", addShippingAddress);
		$('#distpicker').distpicker({
	   		autoSelect: false,
		    /*province: '广东省',
		    city: '深圳市',
		    district: '罗湖区'*/
		});
		$.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})$/;
			return this.optional(element) || (length == 11 && mobile.test(value));
		}, "请正确填写您的手机号码");
		
		$('#myModal2').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
			$('#distpicker').distpicker('reset');
		});
		$('#myModal3').on('hidden.bs.modal', function(e){
			$('#basicForm2')[0].reset();
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
	}
	function getShippingAddressList() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getShippingAddressList",
			cache: false, //禁用缓存
			data: {},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					var tr = "";
					for(var i = 0;i < data.length; i++){
						var shippingId = data[i].shippingId;
						var isDefault = data[i].isDefault;
						var receiverName = data[i].receiverName;
						var receiverPhoneNumber = data[i].receiverPhoneNumber;
						var provinceName = data[i].provinceName;
						var cityName = data[i].cityName;
						var areaName = data[i].areaName;
						var detailAddress = data[i].detailAddress;
						var address = provinceName + cityName + areaName + detailAddress;
						if(isDefault == 1){
							var isDefaultS = '默认' 
						}else{
							var isDefaultS = '' 
						}
						
						tr += "<tr><td>"+ isDefaultS +"</td>"
						+ "<td>"+ receiverName +"&nbsp;&nbsp;&nbsp;"+ receiverPhoneNumber +"<br>"+ address +"</td>"
						+ "<td><a href='javascript:;' onclick=\"system.model.Selection(\'" + receiverName+ "','" + receiverPhoneNumber + "','" + address + "\');\">选用</a>&nbsp;&nbsp;<a href='javascript:;' onclick=\"system.model.edit(\'" + shippingId + "\');\">编辑</a>&nbsp;&nbsp;<a href='javascript:;' onclick=\"system.model.deletes(\'" + shippingId + "\');\">删除</a></td></tr>";
					}
					$("#addressList").append(tr);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function addShippingAddress() {
		var validFlag = $('#basicForm').valid();
		if(!validFlag) {
			return;
		}
		var adefault = 0;
		if ($('#default').is(':checked')) {
			adefault = 1;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/addShippingAddress",
			cache: false, //禁用缓存
			data: {
				'receiverName':$("input[name='consignee']").val(),
				'receiverPhoneNumber':$("input[name='Phone']").val(),
				'provinceName':$("#province").val(),
				'provinceCode':$("#province").val(),
				'cityCode':$("#city").val(),
				'cityName':$("#city").val(),
				'areaCode':$("#district").val(),
				'areaName':$("#district").val(),
				'detailAddress':$("input[name='detailaddress']").val(),
				'addressAlias':$("input[name='addressalias']").val(),
				'isDefault':adefault,
				
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal2').modal('hide');
					$("#addressList").empty();
					getShippingAddressList()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//选中
	page.Selection = function (receiverName,receiverPhoneNumber,address) {
		$('#address').html(address);
		$('#consignee').html(receiverName);
		$('#pohe').html(receiverPhoneNumber);
		$('#myModal').modal('hide');
	}
	
	//删除
	page.deletes = function (shippingId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/delShippingAddress",
			cache: false, //禁用缓存
			data: {
				'shippingId':shippingId,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$("#addressList").empty();
					getShippingAddressList()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	//编辑
	page.edit = function (shippingId) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getShippingAddress",
			cache: false, //禁用缓存
			data: {
				'shippingId':shippingId,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$("input[name='addressalias2']").val(data.addressAlias);
					$('#distpicker2').distpicker('destroy');
					$('#distpicker2').distpicker({
						autoSelect: true,
					    province: data.provinceName,
					    city: data.cityName,
					    district: data.areaName
					});
					$("input[name='consignee2']").val(data.receiverName);
					$("input[name='Phone2']").val(data.receiverPhoneNumber);
					$("input[name='detailaddress2']").val(data.detailAddress);
					if(data.isDefault == 1){
						$("#default2").attr("checked", "checked");
					}
					
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal3').modal('show');
		$('#addShippingAddress2').attr("onclick", "system.model.editGroup(\'" + shippingId +"\');")
	}
	
	//默认
	function getDefaultShippingAddress() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/getDefaultShippingAddress",
			cache: false, //禁用缓存
			data: {},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data=data.data;
					$('#address').html(data.provinceName + data.cityName + data.areaName + data.detailAddress);
					$('#consignee').html(data.receiverName);
					$('#pohe').html(data.receiverPhoneNumber);
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.editGroup = function (shippingId) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
			return;
		}
		var adefault2 = 0;
		if ($('#default2').is(':checked')) {
			adefault2 = 1;
		}
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/client/order/addShippingAddress",
			cache: false, //禁用缓存
			data: {
				'shippingId':shippingId,
				'receiverName':$("input[name='consignee2']").val(),
				'receiverPhoneNumber':$("input[name='Phone2']").val(),
				'provinceName':$("#province2").val(),
				'provinceCode':$("#province2").val(),
				'cityCode':$("#city2").val(),
				'cityName':$("#city2").val(),
				'areaCode':$("#district2").val(),
				'areaName':$("#district2").val(),
				'detailAddress':$("input[name='detailaddress2']").val(),
				'addressAlias':$("input[name='addressalias2']").val(),
				'isDefault':adefault2,
				
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					$('#myModal3').modal('hide');
					$("#addressList").empty();
					getShippingAddressList()
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function init() {
		$("#basicForm").validate({
			rules: {
				consignee: {
	   				required: true,
	   			},
				Phone: {
	   				required: true,
	   				isMobile: true,
	   			},
				province: "required",
	   			city: "required",
	   			detailaddress: "required",
	   			addressalias: "required",
				
			},
			messages: {
				consignee: {
	   				required: "请输入收货人",
	   			},
	   			Phone: {
	   				required: "请输入您的电话号码",
	   				isMobile: "请正确填写您的手机号码",
	   			},
				province: "请选择省",
	   			city: "请选择市",
	   			detailaddress: "请输入详细地址",
	   			addressalias: "请输入地址别名",
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			}
		});
		$("#basicForm2").validate({
			rules: {
				consignee2: {
	   				required: true,
	   			},
				Phone2: {
	   				required: true,
	   				isMobile: true,
	   			},
				province2: "required",
	   			city2: "required",
	   			detailaddress2: "required",
	   			addressalias2: "required",
				
			},
			messages: {
				consignee2: {
	   				required: "请输入收货人",
	   			},
	   			Phone2: {
	   				required: "请输入您的电话号码",
	   				isMobile: "请正确填写您的手机号码",
	   			},
				province2: "请选择省",
	   			city2: "请选择市",
	   			detailaddress2: "请输入详细地址",
	   			addressalias2: "请输入地址别名",
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
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