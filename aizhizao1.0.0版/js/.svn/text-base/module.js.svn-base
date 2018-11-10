var Namespace = {
	// 注册命名空间（动态创建js对象）
	register : function(namespace) {
		var root = window;
		var objs = namespace.split(".");
		for (var i = 0; i < objs.length; i++) {
			root = root[objs[i]] = root[objs[i]] || {};
		}
		return root;
	}
};
// 模块对象
var Module = function(namespace) {
	this.name = namespace;
	this.hasInit = false;
};
/**
 * @function Module.define(namespace, defineFunction)
 * @description 模块定义，（可解决全局变量冲突）
 * @param {String}
 *            命名空间（例：com.a.b）
 * @param {Function}
 */
Module.define = function(namespace, defineFunction) {
	var module = Namespace.register(namespace);
	if (typeof (defineFunction) == "function") {
		defineFunction(module, $);
	}
	module.ready && module.ready();
	console.log("加载模块：" + namespace);
};

/**
 * @function $.fn.pageLoad(url, [callback])
 * @description 基于jquery的load的方法，载入远程资源页面后，做一些渲染操作
 * @param {String}
 *            url一个包含发送请求的URL字符串，或以注册的资源key值
 * @param {Function}
 *            callback 载入成功后的回调
 */
$.fn.pageLoad = function(url, callback, errorCallback) {
	this.empty().html("");
	// 清除旧的module，更新module
	this.attr("module", url);
	var me = this;
	// 异步加载界面
	this.load(url, null, function(responseText, textStatus, xhr) {
		if (textStatus == "error") {
			errorCallback && errorCallback();
			// 如果未登录，则跳转到登录界面
			if (403 == xhr.status) {
				window.top.location.href = "system/login.html";
			}
			
			if (404 == xhr.status) {
				// window.location.hash = "system/404.html";
				alert('资源找不到，可能被删除！');
			}
		} else {
			if (typeof callback === "function") {
				callback()
			}
		}
	});
}

var _appVersion = 20180223;
//全局ajax请求设置，页面上所有的ajax请求，如果未登陆跳转则到登录界面
$.ajaxSetup({
	cache: true,
    beforeSend: function(n) {
        var _url = this.url;
        var appVersion = _appVersion;
        if (appVersion && _url.indexOf(".js", _url.length - 3) != -1 && _url.indexOf("?") == -1) {
            this.url = [_url.substr(0, _url.length - 3), ".js?version=", appVersion].join("")
        } else if (appVersion && _url.indexOf(".html") != -1) {
            var a = _url.split("?");
            this.url = [a[0], "?version=", appVersion, a[1] ? "&" + a[1] : ""].join("");
        }
    },
	complete: function (xhr, status) {
		// 未登录，后台返回的http状态码是403
		if (403 == xhr.status) {
			window.top.location.href = "system/login.html?redirct=" + encodeURIComponent(window.top.location.href);
		}
	}
});