 
					        var li = '';
					if(data!=null && data!=0){
						for(var i = 0;i<data.length;i++){
							var assortmentPicUrl = data[i].assortmentPicUrl;
							var assortmentCode = data[i].assortmentCode;
							var assortmentName = data[i].assortmentName;
							var assortmentSort = data[i].assortmentSort;
							var createTime = data[i].createTime;
							li = "<ul class='tab'><li class='tab-li'><span><i class='fa fa-plus-square-o jia'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span><span>" + assortmentCode +"</span><span>" + assortmentName +"</span><span>" + assortmentSort +"</span><span>" + '-' +"</span><span>" + createTime +"</span><span><a onclick=\"system.classification.editDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.classification.delDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>删除</a></span></li></ul>";
							$("#tabs").append(li);
					        var lii = '';
					        //判断有没有二级
					        if(data[i].childList!=null && data[i].childList.length!=0){
					        	
					        	for(var j = 0;j < data[i].childList.length;j++){
						        	var assortmentPicUrl = data[i].childList[j].assortmentPicUrl;
									var assortmentCode = data[i].childList[j].assortmentCode;
									var assortmentName = data[i].childList[j].assortmentName;
									var assortmentSort = data[i].childList[j].assortmentSort;
									var createTime = data[i].childList[j].createTime;
									lii = "<ul class='add tab2' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-plus-square-o jia2'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span><span>" + assortmentCode +"</span><span>" + assortmentName +"</span><span>" + assortmentSort +"</span><span>" + '-' +"</span><span>" + createTime +"</span><span><a onclick=\"system.classification.editDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.classification.delDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>删除</a></span></li></ul>";
				        			$(".tab").append(lii);
				        			var liii = '';
				        			//判断有没有三级
				        			if(data[i].childList[j].childList!=null && data[i].childList[j].childList.length!=0){
							        	for(var f = 0;f < data[i].childList[j].childList.length;f++){
								        	var assortmentPicUrl = data[i].childList[j].childList[f].assortmentPicUrl;
											var assortmentCode = data[i].childList[j].childList[f].assortmentCode;
											var assortmentName = data[i].childList[j].childList[f].assortmentName;
											var assortmentSort = data[i].childList[j].childList[f].assortmentSort;
											var createTime = data[i].childList[j].childList[f].createTime;
											liii = "<ul class='add tab3' style='padding: 0;'><li class='tab-li'><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='fa fa-minus-square-o'></i> <img src=" + assortmentPicUrl +" width='48' height='48' alt='' /></span><span>" + assortmentCode +"</span><span>" + assortmentName +"</span><span>" + assortmentSort +"</span><span>" + '-' +"</span><span>" + createTime +"</span><span><a onclick=\"system.classification.editDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"system.classification.delDeptInfo(\'" + assortmentCode + "','" + assortmentName + "\');\" href='javascript:;'>删除</a></span></li></ul>";
						        			$(".tab2").append(liii);
							        	}
						        		
					        		}else{
					        			$(".tab2").append(liii);
					        		}
					        	}
				        		
			        		}else{
			        			$(".tab").append(lii);
			        		}
				        	
						}
					}else{
						nodata = "<ul class='tab'><li class='tab-li' align='center'>表中数据为空</li></ul>";
								$("#tabs").append(nodata);
					}