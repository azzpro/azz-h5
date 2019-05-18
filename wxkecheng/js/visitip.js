/*var ulrTo = 'http://192.168.1.175:8081';*/
/*var ulrTo = 'http://192.168.1.222:8081';*/
var ulrTo = 'http://120.78.162.226:8081';

/*var ulrTolist = 'http://192.168.1.119:8080';*/
var ulrTolist = 'http://120.78.162.226:8080';

var clientUserInfo = JSON.parse(localStorage.getItem('clientUserInfo'));
if(clientUserInfo){
	var clientUserCode = clientUserInfo.clientUserCode;
}

$.ajaxSettings.beforeSend = function(xhr,request){
	var sessionId = JSON.parse(localStorage.getItem('sessionId'));
	if (!sessionId) {
		localStorage.removeItem('clientUserInfo');
	    localStorage.removeItem('sessionId');
	}
	xhr.setRequestHeader("token",sessionId);
}
$.ajaxSettings.complete = function(xhr,request){
	var response = JSON.parse(xhr.response);
	if (response.code == 40001) {
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6657c21ece08b798&redirect_uri=http%3a%2f%2fa.izz2025.com/authorization.html&response_type=code&scope=snsapi_userinfo#wechat_redirect";
	}
}

// 获取url路径参数
function getRequest() {
    var d = new Object();
    var g = window.location.href;
    var b = g.split("?");
    if (b.length > 1) {
        var a = b[1].split("&");
        for (var c = 0; c < a.length; c++) {
            var f = a[c].indexOf("=");
            if (f == -1) {
                continue;
            }
            var e = a[c].substring(0, f);
            var j = a[c].substring(f + 1);
            j = decodeURIComponent(j);
            d[e] = j;
        }
    }
    return d;
}