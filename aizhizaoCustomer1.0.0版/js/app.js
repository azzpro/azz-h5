var menus = JSON.parse(localStorage.getItem('menus'));
var clientType = JSON.parse(localStorage.getItem('clientType'));
var clientUserInfo = JSON.parse(localStorage.getItem('clientUserInfo'));
Module.define("app.main", function(page, $) {
	//var request = getRequest();

	page.ready = function() {
		//导航
		
			var navli = '';
			navli += '<li class="active"><a  href="#!home/home.html"><i class="fa fa-home"></i> <span>首页</span></a></li>'
               + '<li class="nav-parent"><a href="javascript:;"><i class="glyphicon glyphicon-shopping-cart"></i> <span>订单管理</span></a>'
			   + '<ul class="children">'
			   + '<li><a href="#!customerorder/information.html"><i class="fa fa-caret-right"></i>客户订单</a></li>'
			   + '<li><a href="#!merchantorders/modify-password.html"><i class="fa fa-caret-right"></i>商户订单</a></li>'
			   + '</ul></li><li class="nav-parent"><a href="javascript:;"><i class="fa fa-shield"></i> <span>财务管理</span></a>'
				+ '<ul class="children">'
				+ '<li><a  href="#!payment/information.html"><i class="fa fa-caret-right"></i>支付管理</a></li>'
				+ '<li><a href="#!putforward/modify-password.html"><i class="fa fa-caret-right"></i>提现管理</a></li>'
				+ '<li><a href="#!invoice/modify-password.html"><i class="fa fa-caret-right"></i>发票管理</a></li>'
				+ '</ul></li><li class="nav-parent"><a href="javascript:;"><i class="fa fa-clock-o"></i> <span>选型管理</span></a>'
				+ '<ul class="children">'
				+ '<li><a href="#!parameter/information.html"><i class="fa fa-caret-right"></i>参数管理</a></li>'
				+ '<li><a href="#!programme/modify-password.html"><i class="fa fa-caret-right"></i>方案管理</a></li>'
				+ '<li><a href="#!selectionmodule/modify-password.html"><i class="fa fa-caret-right"></i>模组管理</a></li>'
				+ '<li><a href="#!examination/modify-password.html"><i class="fa fa-caret-right"></i>审批管理</a></li>'
				+ '</ul></li>'
				+ '<li><a href="#!data/data-management.html"><i class="fa fa-cogs"></i> <span>资料管理</span></a></li>';
			$("#mainMenu").append(navli);
		
		//loadMenuClickEvent();
		// 开启hashchange事件监听，监听网址上符号为#的后面部分网址的变化
		$.history.init(function(uri){
			// 如果#号后面的网址变化，则根据变化后的网址重新加载iframe和选中菜单
			_forward(uri);
		});
		// 屏蔽datatable的错误提示
		$.fn.dataTable.ext.errMode = function(s,h,m){};

		//getPersonalMessage();
	};

	// 阻止a标签的默认事件
	page._stopDefasultEvent = function(a) {
	    if (a.preventDefault) {
	        a.preventDefault();
	    } else {
	        a.returnValue = false;
	    }
	};
	
	var _forward = function(uri) {
	    if (uri) {
	    	uri = '#!' + uri;
	    	page.forward(uri);
	    } else {
	    	// 如果网址上的#号后面部分没内容，或者没有#号，则加载首页
	        window.location.hash = "#!home/home.html";
	    }
	};
	
	/**
	 * 根据入参uri先更新网址#号后面地址，接着加载菜单右边的内容和根据网址选中菜单。
	 * 如果入参uri与当前网址#号后面地址相同，则只加载菜单右边的内容和根据网址选中菜单，不更新当前网址#号后面的地址
	 */
	page.forward = function(uri) {
    	if (window.location.hash == uri) {// 如果将要跳转的uri与当前网址#号后面部分相同，则更新iframe和选中菜单
        	// 根据#号后面的网址加载iframe的内容
            $('#mainpage').pageLoad(window.location.hash.substring(2));
            // 根据#号后面的网址选中菜单
	        selectedMenuByUrl(window.location.hash);
        } else {
        	// 如果将要跳转的uri与当前浏览器网址#号后面部分不同，则页面无刷新更新网址#号后面部分地址
            window.location.hash = uri;
        }
	};
	
	// 根据url选中菜单
	function selectedMenuByUrl(url) {
		var parentURL=url.split('/')[0];
		var childURL=url.split("/")[1]; 
		var urlLiParentEle= $($('#mainMenu a[href^="'+(parentURL)+'"]')[0]).parent("li");
		
		var urlLiEle = $('#mainMenu a[href="'+url+'"]').parent("li");
	    mbxNav(url);
	    // 如果菜单是展示的，则执行根据url选中菜单的功能
	    if(!$('body').hasClass('leftpanel-show')) {
	    	$("#mainMenu li").removeClass('active nav-active');
	    	$('#mainMenu ul[class="children"]').hide();
	        if(urlLiEle.parent("ul").hasClass('children')){
	            urlLiEle.parent("ul").show();
	            urlLiEle.parents(".nav-parent").addClass('nav-active active');
	        }
			urlLiEle.addClass('active');

			//不存在菜单的页面选中效果
			if(urlLiEle.length==0){
				if(urlLiParentEle.parent("ul").hasClass('children')){
					urlLiParentEle.parent("ul").show();
					urlLiParentEle.parents(".nav-parent").addClass('nav-active active');
				}
					urlLiParentEle.addClass('active');
				
			}
	    }if($('body').hasClass('leftpanel-collapsed')) {
	    	$('#mainMenu>li').bind("hover",function(){
	    		if($('#mainMenu>li').hasClass('nav-hover')){
	    			$('#mainMenu ul[class="children"]').hide();
	    			$('#mainMenu .nav-hover ul[class="children"]').show();
	    		}else{
	    			$('#mainMenu .nav-parent ul[class="children"]').hide();
	    		}
	    	});
	    	
	    }
	    
	    // 如果是移动端选中菜单后，则隐藏菜单
	    if ($('body').hasClass('leftpanel-show')) {
	    	$('.menutoggle').trigger("click");
	    }
	}
	
	//设置面包屑导航
	function mbxNav(url){
		// 面包屑导航
		var parentURL=url.split('/')[0];
		var childURL=url.split("/")[1];
		var curParentEle= $($('#mainMenu a[href^="'+(parentURL)+'"]')[0]).parent("li");
		
		var cur = $('#mainMenu a[href="'+url+'"]');//当前页面左侧菜单链接节点
		var parents = cur.parents("ul:eq(0)");//父级ul
	    var mbx = $('.mbx-nav');
	    var btitle;
	    var stitle;
		var icon;
		//当父级ul是有子菜单的一级菜单
	    if(cur.parents("ul:eq(0)").hasClass("children")){
	        btitle = parents.prev("a").text();//父菜单名称
	        icon = parents.prev("a").find("i").attr("class");//父菜单图标
	        stitle = cur.text();//当前菜单名称
	        mbx.html("<i class='" + icon + "'></i>" + btitle + "<span>" + stitle + "</span>");//更改面包屑导航
	    }else{
	        btitle = cur.text();
	        icon = cur.find("i").attr("class");
	        mbx.html("<i class='" + icon + "'></i>" + btitle);
		}
		
		//设置没有导航菜单的面包屑导航显示
		if(cur.length==0){
			if(curParentEle.parents("ul:eq(0)").hasClass("children")){
				btitle = curParentEle.parents("ul:eq(0)").prev("a").text();
				icon = curParentEle.parents("ul:eq(0)").prev("a").find("i").attr("class");
				mbx.html("<i class='" + icon + "'></i>" + btitle);
			}else{
				btitle = curParentEle.find("a").text();
				icon = curParentEle.find("a").find("i").attr("class");
				mbx.html("<i class='" + icon + "'></i>" + btitle);
			}
		}
	}

	/*var getPersonalMessage = function() {
	    $.ajax({
	        type :'GET',
	        url : 'http://172.18.10.213:8001/bibaCrm/user/personalMessage',
	        data : {'username' : request.name},
	        async: false,
	        success : function(data) {
	        	window.workspaceVO = window['workspaceVO'] || {};
	            workspaceVO.user = data.data;
	            setCookie("userInfo",json2str(data.data),60000);
	            $('.contactName').text(workspaceVO.user.company.contactName);
	        }
	    });
	};*/
	
});