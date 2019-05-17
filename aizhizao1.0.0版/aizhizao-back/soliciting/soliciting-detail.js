var solicitContributionCodeDetail = JSON.parse(localStorage.getItem('solicitContributionCodeDetail'));
Module.define("system.soliciting", function(page, $) {
	page.ready = function() {
		getCourseDetail();
	}
	
	//活动详情
	function getCourseDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/solicitContribution/getSolicitContributionDetail",
			cache: false, //禁用缓存
			async: false,
			data: {
				'solicitContributionCode':solicitContributionCodeDetail,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					
					$("#remark").html(data.data.remark);
					$("#solicitContributionName").html(data.data.solicitContributionName);
					$("#pic").attr("src",data.data.solicitContributionPicUrl);
					if(data.data.solicitContributionStatus == 1) {
						$("#Required").html("上架");
					}else if(data.data.solicitContributionStatus == 2){
						$("#Required").html("下架");
					}
					
					$('#editorsa').html(data.data.solicitContributionContent);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
});