var courseCodeDetail = JSON.parse(localStorage.getItem('courseCodeDetail'));
Module.define("system.courculum", function(page, $) {
	page.ready = function() {
		initDataTable();
		inityz();
		$("#Search").bind("click", function() {
			dataTable.ajax.reload();
		});
		$('#myModal').on('hidden.bs.modal', function(e){
			$('#basicForm')[0].reset();
			var validFlag = $('#basicForm').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
		$('#myModal2').on('hidden.bs.modal', function(e){
			$('#basicForm2')[0].reset();
			var validFlag = $('#basicForm2').validate();
			validFlag.resetForm();
			$(".has-error").removeClass('has-error');
		});
		$("#confirm").bind("click", addGoodsBrand);
		init();
		$('#myModal2').on('shown.bs.modal', function () {
		  init2();
		})
	}
	
	var geocoder,map,marker = null;
	var init = function() {
	    var center = new qq.maps.LatLng(39.916527,116.397128);
	    map = new qq.maps.Map(document.getElementById('container'),{
	        center: center,
	        zoom: 15
	    });
	    //调用地址解析类
	    geocoder = new qq.maps.Geocoder({
	        complete : function(result){
	        	if (marker) {
			        marker.setMap(null);
			        marker.length = 0;
			    }
	            map.setCenter(result.detail.location);
	            $("input[name='beginsaddress']").val(result.detail.address);
	            $("input[name='lat']").val(result.detail.location.lat);//纬度
	            $("input[name='lng']").val(result.detail.location.lng);//经度
	            marker = new qq.maps.Marker({
	                map:map,
	                position: result.detail.location
	            });
	        }
	    });
	    
	    /*//绑定单击事件添加参数
	    qq.maps.event.addListener(map, 'click', function(event) {
	        var marker = new qq.maps.Marker({
                map:map,
                position: event.latLng
            });

		    var latLng = new qq.maps.LatLng(event.latLng.lat, event.latLng.lng);
		    debugger
	    });*/
	    
	    //获取城市列表接口设置中心点
	    citylocation = new qq.maps.CityService({
	        complete : function(result){
	            map.setCenter(result.detail.latLng);
	        }
	    });
	    //调用searchLocalCity();方法    根据用户IP查询城市信息。
	    citylocation.searchLocalCity();
	}
	
	var geocoder2,map2,marker2 = null,marker3 = null;
	var init2 = function() {
	    var center2 = new qq.maps.LatLng($("input[name='lat2']").val(),$("input[name='lng2']").val());
	    map2 = new qq.maps.Map(document.getElementById('container2'),{
	        center: center2,
	        zoom: 15
	    });
	    marker2 = new qq.maps.Marker({
            map:map2,
            position: center2,
        });
        
	    //调用地址解析类
	    geocoder2 = new qq.maps.Geocoder({
	        complete : function(result){
	        	if (marker2) {
			        marker2.setMap(null);
			        marker2.length = 0;
			    }
	        	if (marker3) {
			        marker3.setMap(null);
			        marker3.length = 0;
			    }
	            map2.setCenter(result.detail.location);
	            $("input[name='beginsaddress2']").val(result.detail.address);
	            $("input[name='lat2']").val(result.detail.location.lat);//纬度
	            $("input[name='lng2']").val(result.detail.location.lng);//经度
	            marker3 = new qq.maps.Marker({
	                map:map2,
	                position: result.detail.location
	            });
	        }
	    });
	}
	
	
	page.codeAddress = function() {
	    var address = document.getElementById("address").value;
	    //通过getLocation();方法获取位置信息值
	    geocoder.getLocation(address);
	}
	
	page.codeAddress2 = function() {
	    var address = document.getElementById("address2").value;
	    //通过getLocation();方法获取位置信息值
	    geocoder2.getLocation(address);
	}
	
	jeDate("#beginstime",{
        isTime:false,
        festival: false,
        minDate:'2015-06-16 10:20:25',
        maxDate:'2025-06-16 18:30:35',
        format: 'YYYY-MM-DD hh:mm:ss'
    });
    
    jeDate("#beginstime2",{
        isTime:false,
        festival: false,
        minDate:'2015-06-16 10:20:25',
        maxDate:'2025-06-16 18:30:35',
        format: 'YYYY-MM-DD hh:mm:ss'
    });
	
	
	
	$('.valuess').keyup(function() {
		var value = $(this).val();
		//先把非数字的都替换掉，除了数字和.
		value = value.replace(/[^\d.]/g,"");
		//保证只有出现一个.而没有多个.
		value = value.replace(/\.{2,}/g,".");
		//必须保证第一个为数字而不是.
		value = value.replace(/^\./g,"");
		//保证.只出现一次，而不能出现两次以上
		value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
		//只能输入两个小数
		value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
		
		$(this).val(value);
	});
	
	function initDataTable() {
		dataTable = $('#table').DataTable({
			"language": {url: "../js/chinese.json"},
			"lengthChangevar": false, //去掉每页显示数据条数
			"bPaginate" : true,// 分页按钮  
			"stateSave": false, //状态保存
			"deferRender": true, //延迟渲染数据
			"processing": false,//等待加载效果 
			"serverSide": true,
			"lengthChange": false,
			"responsive": true,
			"searching":false,
			"ordering":false,
			"info":false,
			"ajax": function (data, callback, settings) {
				//封装请求参数  
				var param = {};
				param = data;
				param.pageNum = data.start/10+1;
				param.pageSize = data.length;
				param.searchInput = $("input[name='searchname']").val();
				param.status = $('#approvalType').val();
				param.courseCode = courseCodeDetail;
				//当前页码
				 $.ajax({
				 	type: "POST",   
				 	url: ulrTo + "/azz/api/platform/startClass/getStartClassRecords",
				 	cache: false, //禁用缓存   
				 	data: param, //传入组装的参数   
				 	dataType: "json", 
				 	success: function (result) {
			 			//封装返回数据   
			 			var returnData = {};
			 			returnData = param;
			 			returnData.draw = result.pageNum;//这里直接自行返回了draw计数器,应该由后台返回
			 			returnData.recordsTotal = result.data.total;//返回数据全部记录
			 			returnData.recordsFiltered = result.data.total;//后台不实现过滤功能，每次查询均视作全部结果   
			 			if(null == result.data.rows){
			 				result.data.rows = [];
			 			}
			 			returnData.data = result.data.rows;//返回的数据列表   
			 			//调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染   
			 			//此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕   
			 			callback(returnData);   
				 	}  
				 });
			},
			"columns": [{
					"title": "开课编号",
					"data": "startClassCode",
					"className": "text-nowrap",
					"defaultContent": "-",
				}, // 序号
				{
					"title": "开课名称",
					"data": "startClassName",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "开课时间",
					"data": "startClassTime",
					"className": "text-nowrap",
					"defaultContent": "-"
				},
				{
					"title": "课时",
					"data": "hours",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "开课人数",
					"data": "peopleNumber",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "价格",
					"data": "price",
					"className": "text-nowrap",
					"defaultContent": "-",
				},
				{
					"title": "开课地点",
					"data": "location",
					"className": "",
					"defaultContent": "-",
				},
				{
					"title": "状态",
					"data": "",
					"className": "text-nowrap",
					"defaultContent": "无",
					"render" : function (data, type, row, meta) {
						switch(row.status) {
							case 1:
								return '上架';
								break;
							case 2:
								return '下架';
								break;
						};
					}
				},
				{
					"title": "操作",
					"data": "mobile",
					"className": "text-nowrap",
					"defaultContent": "-",
					"render" : function (data, type, row, meta) {
						if(row.status == 2){
							var statustoo = '上架'
						}else{
							var statustoo = '下架'
						}
						if (row) {
		            		var html = '<div class="am-btn-toolbar">';
		            		html += '<div class="am-btn-group am-btn-group-xs">';
		            		html += '<a href="javascript:;" onclick="system.courculum.parameDetail(\'' + row.startClassCode + '\');">编辑</a>';
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.courculum.editUserStatus(\'' + row.startClassCode + "','"+ statustoo + '\');">'+ statustoo +'</a>';
		            		html += '&nbsp;&nbsp;<a class="text-nowrap" href="javascript:;" onclick="system.courculum.dele(\'' + row.startClassCode + "','"+ row.startClassName + '\');">删除</a>';
		            		html += '</div>';
		            		html += '</div>';
			         		return html;
						}
		            }
				}
			],
		});
	}
	
	//添加
	function addGoodsBrand() {
	   	var validFlag = $('#basicForm').valid();
		if(!validFlag) {
				return;
		}
			
		var fm = new FormData();
		fm.append('courseCode', courseCodeDetail);
		fm.append('startClassName', $("input[name='beginsname']").val());
		fm.append('peopleNumber', $("input[name='beginsnumber']").val());
		fm.append('startClassTime', $("input[name='beginstime']").val());
		fm.append('hours', $("input[name='beginshour']").val());
		fm.append('price', $("input[name='beginsprice']").val());
		fm.append('room', $("input[name='beginsroom']").val());
		fm.append('location', $("input[name='beginsaddress']").val());
		fm.append('latitude', $("input[name='lat']").val());
		fm.append('longitude', $("input[name='lng']").val());
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/startClass/addStartClassRecord',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		dataTable.ajax.reload();
					$('#myModal').modal('hide');
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	//启用禁用
	page.editUserStatus = function(startClassCode,statustoo) {
		if(statustoo == '上架') {
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/platform/startClass/putOnOrPutOffOrDelStartClassRecord",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'startClassCode': startClassCode,
					'status': 1
				},
				success: function(data) {
					if (data.code == 0) {
						dataTable.ajax.reload();
					} else {
						alert(data.msg)
					}
				}
			});
		}else if(statustoo == '下架'){
			$.ajax({
				type: "POST",
				url: ulrTo+"/azz/api/platform/startClass/putOnOrPutOffOrDelStartClassRecord",
				cache: false, //禁用缓存    
				dataType: "json", 
				data: {
					'startClassCode': startClassCode,
					'status': 2
				},
				success: function(data) {
					if (data.code == 0) {
						dataTable.ajax.reload();
					} else {
						alert(data.msg)
					}
				}
			});
		}
	}
	//删除
	page.dele = function(startClassCode,startClassName) {
		$('#bmName').html(startClassName);
		$('#myModal112').modal('show');
		$('#deletebunnot').attr("onclick", "system.courculum.delDeptInfo(\'" + startClassCode + "\');")
	}
	page.delDeptInfo = function(startClassCode) {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/startClass/putOnOrPutOffOrDelStartClassRecord",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'startClassCode': startClassCode,
				'status': 0
			},
			success: function(data) {
				if (data.code == 0) {
					dataTable.ajax.reload();
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	page.parameDetail = function(startClassCode)  {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/startClass/getStartClassRecordDetail",
			cache: false, //禁用缓存    
			dataType: "json", 
			data: {
				'startClassCode': startClassCode
			},
			success: function(data) {
				if (data.code == 0) {
					$("input[name='beginsname2']").val(data.data.startClassName);
					$("input[name='beginsnumber2']").val(data.data.peopleNumber);
					$("input[name='beginstime2']").val(data.data.startClassTime);
					$("input[name='beginshour2']").val(data.data.hours);
					$("input[name='beginsprice2']").val(data.data.price);
					$("input[name='beginsroom2']").val(data.data.room);
					$("input[name='beginsaddress2']").val(data.data.location);
					$("input[name='lat2']").val(data.data.latitude);
					$("input[name='lng2']").val(data.data.longitude);
					
				} else {
					alert(data.msg)
				}
			}
		});
		$('#myModal2').modal('show');
		$('#editconfirm').attr("onclick", "system.courculum.editDeptInfo(\'" + startClassCode + "\');")
	}
	
	page.editDeptInfo = function(startClassCode) {
		var validFlag = $('#basicForm2').valid();
		if(!validFlag) {
				return;
		}
			
		var fm = new FormData();
		fm.append('startClassCode', startClassCode);
		fm.append('courseCode', courseCodeDetail);
		fm.append('startClassName', $("input[name='beginsname2']").val());
		fm.append('peopleNumber', $("input[name='beginsnumber2']").val());
		fm.append('startClassTime', $("input[name='beginstime2']").val());
		fm.append('hours', $("input[name='beginshour2']").val());
		fm.append('price', $("input[name='beginsprice2']").val());
		fm.append('room', $("input[name='beginsroom2']").val());
		fm.append('location', $("input[name='beginsaddress2']").val());
		fm.append('latitude', '22.608940');
		fm.append('longitude', '114.029846');
		$.ajax({
	        type :'POST',
	        url : ulrTo+'/azz/api/platform/startClass/editStartClassRecord',
	        cache: false, //禁用缓存    
			dataType: "json",
			contentType: false, //禁止设置请求类型
	        processData: false, //禁止jquery对DAta数据的处理,默认会处理
			data: fm,
	        success : function(data) {
	        	if (data.code == 0) {
	        		dataTable.ajax.reload();
					$('#myModal2').modal('hide');
				} else {
					alert(data.msg);
				}
	        }
	    });
	}
	
	function inityz() {
		$("#basicForm").validate({
			rules: {
				beginsname: {
					required: true,
				},
				beginsnumber: "required",
				beginstime: "required",
				beginshour: "required",
				beginsprice: "required",
				beginsroom: "required",
				beginsaddress: "required",
			},
			messages: {
				beginsname: {
					required: "请输入开课名称（比如1123届培训班）",
				},
				beginsnumber: "请输入开课人数",
				beginstime: "请选择开课时间",
				beginshour: "请输入课程课时",
				beginsprice: "请输入课程价格",
				beginsroom: "请输入课程所在地点的房间编号（比如605号）",
				beginsaddress: "请选择开课地点",
			},
			highlight: function(element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
			},
			success: function(element) {
				$(element).closest('.form-group').removeClass('has-error');
			}
		});
		
		$("#basicForm").validate({
			rules: {
				beginsname2: {
					required: true,
				},
				beginsnumber2: "required",
				beginstime2: "required",
				beginshour2: "required",
				beginsprice2: "required",
				beginsroom2: "required",
				beginsaddress2: "required",
			},
			messages: {
				beginsname2: {
					required: "请输入开课名称（比如1123届培训班）",
				},
				beginsnumber2: "请输入开课人数",
				beginstime2: "请选择开课时间",
				beginshour2: "请输入课程课时",
				beginsprice2: "请输入课程价格",
				beginsroom2: "请输入课程所在地点的房间编号（比如605号）",
				beginsaddress2: "请选择开课地点",
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