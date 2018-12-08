$(document).ready(function() {
	
    var swiper = new Swiper('.swiper-container', {
	      spaceBetween: 0,
	      centeredSlides: true,
	      autoplay: {
	        delay: 2500,
	        disableOnInteraction: false,
	      },
	      pagination: {
	        el: '.swiper-pagination',
	        clickable: true,
	      },
	});
	searchHomeSlide();
	searchNavOne();
	searchNavTwo();
	jQuery.jqtab = function(tabtit,tab_conbox,shijian) {
	    $(tab_conbox).find(".tab_con").hide();
	    $(tabtit).find("li:first").addClass("curr").show(); 
	    $(tab_conbox).find(".tab_con:first").show();
	  
	    $(tabtit).find("li").bind(shijian,function(){
	      $(this).addClass("curr").siblings("li").removeClass("curr"); 
	      var activeindex = $(tabtit).find("li").index(this);
	      $(tab_conbox).children().eq(activeindex).show().siblings().hide();
	      return false;
	    });
	  
	};
	$.jqtab("#tabs","#tab_conbox","click");
	
	jQuery.jqtab2 = function(tabtit,tab_conbox,shijian) {
	    $(tab_conbox).find(".tab_con").hide();
	    $(tabtit).find("li:first").addClass("curr").show(); 
	    $(tab_conbox).find(".tab_con:first").show();
	  
	    $(tabtit).find("li").bind(shijian,function(){
	      $(this).addClass("curr").siblings("li").removeClass("curr"); 
	      var activeindex = $(tabtit).find("li").index(this);
	      $(tab_conbox).children().eq(activeindex).show().siblings().hide();
	      return false;
	    });
	  
	};
	$.jqtab2("#tabs2","#tab_conbox2","click");
	
	$("#faidmore").bind("click", faidmore);
	$("#ljlistmore").bind("click", ljlistmore);
	
	jQuery.fn.limit=function(){
	var self = $("[limit]");
	self.each(function(){
	var objString = $(this).text();
	var objLength = $(this).text().length;
	var num = $(this).attr("limit");
	if(objLength > num){
	$(this).attr("title",objString);
	objString = $(this).text(objString.substring(0,num)+"...");
	}
	$(this).attr("title"," ")
	})
	}
});

function faidmore() {
	var columnCode = $("#faidcolumnCode").html();
    window.location.href = "list.html?columnCode="+columnCode
}
function ljlistmore() {
	var columnCode = $("#ljlistcolumnCode").html();
    window.location.href = "list.html?columnCode="+columnCode
}

//banner
function searchHomeSlide() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/searchHomeSlide",
		cache: false, //禁用缓存
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				var wrapper = '';
				for(var i = 0;i<data.length;i++){
					var homeSlidePicUrl = data[i].homeSlidePicUrl;
					var jumpLink = data[i].jumpLink;
					wrapper +="<div class='swiper-slide'><a href='"+ jumpLink +"'><img src='"+ homeSlidePicUrl +"' alt='' /></a></div>";
			    }
				$("#swiper-wrapper").append(wrapper);
			} else {
				alert(data.msg)
			}
		}
	});
}

function searchNavOne() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/searchNavOne",
		cache: false, //禁用缓存
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				var wrapper='';
				var wrapper2='';
				for(var i = 0;i<2;i++){
					wrapper +="<li><a href='list-detail.html?articleId="+data[i].articleId+"'><img src='"+data[i].articlePicUrl+"' alt='' /><h3><font class='jqzi'>"+data[i].articleTitle+"</font>  <span>推荐</span></h3></a></li>";
				}
				for(var y = 2;y<4;y++){
					wrapper2 +="<li><a href='list-detail.html?articleId="+data[y].articleId+"'><img src='"+data[y].articlePicUrl+"' alt='' /><div class='bg'></div><div class='zi'><font class='jqzi'>"+data[y].articleTitle+"</font><span>推荐</span></div></a></li>";
				}
				$("#faid").append(wrapper);
				$("#faid2").append(wrapper2);
				$("#faidcolumnCode").html(data[0].columnCode);
				$(".jqzi").attr("limit",15)
				$("[limit]").limit();
			} else {
				alert(data.msg)
			}
		}
	});
}

function searchNavTwo() {
	$.ajax({
		type: "POST",
		url: ulrTo+"/azz/api/index/searchNavTwo",
		cache: false, //禁用缓存
		dataType: "json", 
		success: function(data) {
			if (data.code == 0) {
				var data = data.data;
				var li = '';
				for(var i = 0;i<data.length;i++){
					var articleId = data[i].articleId;
					var articlePicUrl = data[i].articlePicUrl;
					var articleTitle = data[i].articleTitle;
					var price = data[i].price;
					li +="<li><a href='list-detail.html?articleId="+articleId+"'><img src='"+articlePicUrl+"' alt='' /><div class='lj-zi'><font class='jqzi2'>"+articleTitle+"</font><p>¥"+price+"</p></div></a></li>";
			    }
				$("#ljlist").append(li);
				$("#ljlistcolumnCode").html(data[0].columnCode);
				$(".jqzi2").attr("limit",13)
				$("[limit]").limit();
			} else {
				alert(data.msg)
			}
		}
	});
}