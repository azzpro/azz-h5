Module.define("system.module", function(page, $) {
	var param = getRequest();
	var moduleCode = param["moduleCode"];
	page.ready = function() {
		selectClientUserInfo();
	}
	function selectClientUserInfo() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/merchant/goodsModule/getGoodModuleInfo",
			cache: false, //禁用缓存
			data: {
				'moduleCode':moduleCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var data = data.data;
					$('#moduleCode').html(data.moduleCode);
					$('#classificationName').html(data.classificationName);
					switch(data.moduleStatus) {
						case 0:
							$('#moduleStatus').html('无效');
							break;
						case 1:
							$('#moduleStatus').html('上架');
							break;
						case 2:
							$('#moduleStatus').html('下架');
							break;
					};
					$('#moduleName').html(data.moduleName);
					
					if(data.modulePicUrl == null){
						$('#pic1').hide()
					}else{
						$('#pic1').show();
						$('#pic1').attr("src", data.modulePicUrl); 
					}
					$('#content').html(data.moduleInfo);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
});