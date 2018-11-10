//对象String添加一个trim方法来删除字符串两端的空格
String.prototype.trim = function() {  
	return this.replace(/(^\s*)|(\s*$)/g, '');
}
//对象String添加一个trim方法来删除字符串两端的空格
String.prototype.xurl = function() {
	 var url = this;
     if (url && url.length > 0 && url.indexOf("http") < 0) {
         return "http://" + url;
     }else{
    	 return url;
     }
	return "#";
}
// 给原型对象String增加replaceAll方法，用于在字符串中用一些字符替换另一些字符
String.prototype.replaceAll = function(regexp, replacement) {
	// g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。m 执行多行匹配
    return this.replace(new RegExp(regexp,"gm"), replacement)
}
//对象String判断为null,undefined返回""

//从数据指定位置插入新对象
Array.prototype.insert = function(index,obj) {
  	this.splice(index,0,obj);
}

//删除指定的对象
Array.prototype.removeAt = function(index) {
  	this.splice(index,1);
}

//删除指定对象
Array.prototype.remove = function(obj) {
  	var index = this.indexOf(obj);
  	if (index >= 0)
    	this.removeAt(index);
}

//清空数据
Array.prototype.removeAll = function() {
  	this.splice(0,this.length);
}

//定义select标记的全局变量
var selectFg = false;

//选择所有checkbox
function cf_SelectAll() {
	if (selectFg == false) 
		selectFg = true;
	else 
		selectFg = false;
	var obj = document.getElementsByTagName("INPUT");
	for(var i = 0; i < obj.length; i++) {
        if(obj[i].type.toUpperCase() == "CHECKBOX" )
        	if (selectFg == true)
            	obj[i].checked = true;
            else 
            	obj[i].checked = false;		
	}
}

/**
 * 去掉特殊字符（换行，Tab，两端空格，标签）
 * @param {Object} htmlcode
 */
function removeSpecialSymbol(htmlcode) {
	var content = htmlcode.replace(/<[^>].*?>/g,"");
	content.replace(/(^\s*)|(\s*$)/g, ""); //去掉两端空格
	content = content.replace(/<\/?.+?>/g,""); //去掉换行
    content = content.replace(/[\r\n]/g, ""); 
    content = content.replace(/[\t]/g, ""); //去掉制表符
	return content;
}

//去除html标签
function removeTags(str){
	return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}

/** 
 * json对象转字符串形式 
 */
function json2str(o) {
	var arr = [];
	var fmt = function(s) {
		if (typeof s == 'object' && s != null)
			return json2str(s);
		return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
	}
	for ( var i in o)
		arr.push("'" + i + "':" + fmt(o[i]));
	return '{' + arr.join(',') + '}';
}

function countCharacters(str){ 
    var totalCount = 0; 
    for(var i=0; i<str.length; i++){ 
        var c = str.charCodeAt(i); 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){ 
             totalCount++; 
        } 
        else{ 
            totalCount+=2;
        } 
     } 
    return totalCount; 
} 

/**
 * 解析URL参数
 * @param {Object} name
 * @return {TypeName} 
 */
function parseUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 

//根据cookie得到对象
function getEntityFromCookie(name){
	var getInfo= getCookie(name);
	var Entity=eval("("+getInfo+")");
	return Entity;
}
//设置cookie
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

// 根据cookie得到对象
function getCookieO(name) {
	var getInfo = getCookieV(name);
	var Entity = eval("(" + getInfo + ")");
	return Entity;
}

// 获取cookie的值
function getCookieV(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(name) != -1)
			return decodeURIComponent(c.substring(name.length, c.length));
	}
	return "";
}
// 删除cookies
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookieV(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+ ";path=/";
}
//清除所有cookie
function clearCookie(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i =  keys.length; i--;)
        	if(!(keys[i]=='loginname'||keys[i]=='remmbername'))
        		document.cookie=keys[i]+'=0;expires=' + new Date(0).toUTCString()+ ";path=/";
    }    
}

/**
 * 示例： var code = location.search.geturlstring("code");
 */
String.prototype.geturlstring = function(name) {
    var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)"),
        r;
    if (r = this.match(reg)) return unescape(r[2]);
    return null;
};

/* 
*  方法:Array.remove(dx) 通过遍历,重构数组 
*  功能:删除数组元素. 
*  参数:dx删除元素的下标. 
*/ 
Array.prototype.arrRemove = function(obj) 
{
	for(var i =0;i <this.length;i++){ 
		var temp = this[i]; 
		if(!isNaN(obj)){ 
		temp=i; 
		} 
		if(temp == obj){ 
		for(var j = i;j <this.length;j++){ 
		this[j]=this[j+1]; 
		} 
		this.length = this.length-1; 
		} 
	}
	return this;
};
//根据父节点ID 获取对应子节点数据
function treedata(id, data){
	var treedatas = new Array();
    var j = 0;
    $.each(data, function(i, v) {
        if (v.parented == id) {
            treedatas[j] = v;
            j++;
        }
    });
    return treedatas;
}
//判断pc还是iphone
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/***
 * 获取url参数方法
 * @param name 参数名称
 * @returns
 */
function getQueryString(name) 
{ 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
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

 /**              
 * 时间戳转换日期              
 * @param <int> unixTime    待时间戳(秒)              
 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)              
 * @param <int>  timeZone   时区              
 */
function UnixToDate(unixTime, isFull, timeZone) {
    if (typeof (timeZone) == 'number')
    {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime);
    var ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    ymdhis += (time.getUTCMonth()+1) + "-";
    ymdhis += time.getUTCDate();
    if (isFull === true)
    {
        ymdhis += " " + time.getUTCHours() + ":";
        ymdhis += time.getUTCMinutes() + ":";
        ymdhis += time.getUTCSeconds();
    }
    return ymdhis;
}

//全局ajax请求设置，页面上所有的ajax请求，如果未登陆跳转则到登录界面
$.ajaxSetup({
	crossDomain: true,
	cache : false,  //关闭缓存
	beforeSend: function(request) {
		var sessionId = JSON.parse(localStorage.getItem('sessionId'));
		if (!sessionId) {
			localStorage.removeItem('userInfo');
		    localStorage.removeItem('menus');
		    localStorage.removeItem('userPermissions');
		    localStorage.removeItem('sessionId');
			window.location.href = "login.html";
		}
		request.setRequestHeader("token",sessionId);
	},
	complete: function (xhr, status, request) {
		// 未登录，后台返回的http状态码是403
		if (xhr.status == 200) {
			if (xhr.responseJSON && xhr.responseJSON.code == 40001) {
				localStorage.removeItem('userInfo');
			    localStorage.removeItem('menus');
			    localStorage.removeItem('userPermissions');
			    localStorage.removeItem('sessionId');
				window.location.href = "login.html";
			}
		}
	}
});

String.prototype.format = function () {
    var args = arguments;
    var reg = /\{(\d+)\}/g;
    return this.replace(reg, function (g0, g1) {   
        return args[+g1];      
    });
};