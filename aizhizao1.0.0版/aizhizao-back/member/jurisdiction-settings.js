var userInfo = JSON.parse(localStorage.getItem('userInfo'));
Module.define("system.jurisdictionsettings", function(page, $) {
	var param = getRequest();
	var roleCode = param["roleCode"];
	page.ready = function() {
		getPermissions();
		$("#saveRole").bind("click",saveRole);
		$('#myModal111').on('hidden.bs.modal', function(e){
			window.location.href = "#!member/jurisdiction.html";
		});
		
	}
	var setting = {
	    view: {
			selectedMulti: true,
			fontCss : {'font-size':'14px !important','font-weight':'400','height':'21px','line-height':'21px'},
			showIcon: false
		},
		check: {
			enable: true,
			chkboxType:  { "Y": "ps", "N": "ps" }
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		edit: {
			enable: false
		}
	};


	/*var zNodes =[
		{ id:101, pId:0, name:"随意勾选 1", open:true},
		{ id:101001, pId:101, name:"随意勾选 1-1", open:true},
		{ id:101001001, pId:101001, name:"随意勾选 1-1-1"},
		{ id:101001001001, pId:101001001, name:"随意勾选 1-1-1"},
		{ id:101001002, pId:101001, name:"随意勾选 1-1-2"},
		{ id:101002, pId:101, name:"随意勾选 1-2", open:true},
		{ id:101002001, pId:101002, name:"随意勾选 1-2-1"},
		{ id:101002002, pId:101002, name:"随意勾选 1-2-2"},
		{ id:102, pId:0, name:"随意勾选 2", open:true},
		{ id:102001, pId:102, name:"随意勾选 2-1"},
		{ id:102002, pId:102, name:"随意勾选 2-2", open:true},
		{ id:102002001, pId:102002, name:"随意勾选 2-2-1", checked:true},
		{ id:102002002, pId:102002, name:"随意勾选 2-2-2"},
		{ id:102003, pId:102, name:"随意勾选 2-3"}
	];*/
	function getPermissions() {
		$.ajax({
			type: "GET",
			url: ulrTo+"/azz/api/permission/getPermissionList",
			cache: false, //禁用缓存
			data: {
				'roleCode':roleCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					data = data.data;
					var arr = [];
					for (var i=0;i<data.length;i++) {
						var obj = new Object();
						obj.id = data[i].permissionCode;
						obj.pId = data[i].parentPermissionCode;
						obj.name = data[i].permissionName;
						obj.uuid = data[i].permissionCode;
						obj.open = true;
						if (data[i].isSelected == 1) {
							obj.checked = true;
						}
						
						arr[i] = obj;
					}
					apppermissionNodes = arr;
					$.fn.zTree.init($("#apppermissionTree"), setting, apppermissionNodes);
					
				} else {
					alert(data.msg)
				}
			}
		});
	}
	
	function saveRole() {
		var apppermissionTree = $.fn.zTree.getZTreeObj("apppermissionTree");
		var apppermissionNodes = apppermissionTree.getCheckedNodes();
		var apppermissionArr = [];
		for (var i=0;i<apppermissionNodes.length;i++) {
			apppermissionArr.push(apppermissionNodes[i].uuid);
		}
		
		if (apppermissionArr.length==0){
			$("#myModal222").modal("show");
			return false;
		}
		$.ajax({
			type:"post",
			url:ulrTo + "/azz/api/permission/setRolePermissions",
			data: {
				'roleCode':roleCode,
				'permissionCodes':apppermissionArr.join(","),
			},
			async:true,
			success: function(data){
				if (data.code == 0) {
					$("#myModal111").modal("show");
				} else {
					alert(data.msg)
				}
			}
		});
	}
		
});