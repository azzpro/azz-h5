var User = {};
User.Permission = {
	permission : null
};

if (pasa.type != 1) {
	$.ajax({
		type : 'get',
		cache : true,
		url : 'https://biba.pctx.cn/zuul/bibaCrmApi/api/user/getUserPersion',
		data : {"userUuid" : pasa.uuid},
		async : false,
		success : function(data) {
			var permissionList = data.data.split(",");
			User.Permission.permission = {};
			for (var i = 0; i < permissionList.length; i++) {
				User.Permission.permission[permissionList[i]] = true;
			}
		}
	});
}

User.Permission.check = function(operationCode) {
	return User.Permission.permission[operationCode];
}

$.fn.checkPermission = function() {
	return this.each(function() {
        var $this = $(this), operationPermission = $this.attr("operationPermission") || "";
        User.Permission.check(operationPermission) ? $this.show() : $this.remove()
    });
}

User.Permission.afterInitUI = function(dom) {
	dom = dom || window.document.body;
	dom = dom.jquery ? dom : $(dom);
	// 过滤超级管理员的uuid
	if (pasa.type != 1) {
		dom.find("[operationPermission]").checkPermission();
	}
}

$(function(){
	// 页面初始化完后校验权限，每个页面包括iframe下的页面要引用这个js
	User.Permission.afterInitUI();
});