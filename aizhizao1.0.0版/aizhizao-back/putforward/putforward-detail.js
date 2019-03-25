var param = getRequest();
var applyCode = param["applyCode"];
Module.define("system.putforward", function(page, $) {
	page.ready = function() {
		getPlatformWithdrawDepositApplyDetail();
	}
	function getPlatformWithdrawDepositApplyDetail() {
		$.ajax({
			type: "POST",
			url: ulrTo+"/azz/api/platform/finance/getPlatformWithdrawDepositApplyDetail",
			cache: false, //禁用缓存
			data: {
				'applyCode':applyCode,
			},
			dataType: "json", 
			success: function(data) {
				if (data.code == 0) {
					var applyInfo=data.data.applyInfo;
					$('#applyCode').html(applyInfo.applyCode);
					$('#totalWithdrawDepositMoney').html(applyInfo.totalWithdrawDepositMoney.toFixed(2));
					$('#creator').html(applyInfo.creator);
					$('#phoneNumber').html(applyInfo.phoneNumber);
					$('#createTime').html(applyInfo.createTime);
					switch(applyInfo.status) {
						case 1:
							$('#statustoo').html('待审核 ');
							break;
						case 2:
							$('#statustoo').html('待打款 ');
							break;
						case 3:
							$('#statustoo').html('已打款 ');
							break;
						case 4:
							$('#statustoo').html('已关闭 ');
							break;
						case 5:
							$('#statustoo').html('待打款 ');
							break;
					};
					var accountInfo=data.data.accountInfo;
					$('#accountName').html(accountInfo.accountName?accountInfo.accountName:'-');
					$('#accountBankCardNumber').html(accountInfo.accountBankCardNumber?accountInfo.accountBankCardNumber:'-');
					$('#accountBank').html(accountInfo.accountBank?accountInfo.accountBank:'-');
					$('#accountSubBranch').html(accountInfo.accountSubBranch?accountInfo.accountSubBranch:'-');
					$('#creditCode').html(accountInfo.creditCode?accountInfo.creditCode:'-');
					$('#merchantName').html(accountInfo.merchantName?accountInfo.merchantName:'-');
					
					var orderInfo=data.data.orderInfo;
					$('#totalOrderCount').html(orderInfo.totalOrderCount);
					$('#totalOrderMoney').html(orderInfo.totalOrderMoney.toFixed(2));
					$('#totalTransactionCost').html(orderInfo.totalTransactionCost.toFixed(2));
					$('#totalWithdrawDepositMoneytoo').html(orderInfo.totalWithdrawDepositMoney.toFixed(2));
					var orders = orderInfo.orders;
					var tr = "";
					for(var i = 0;i < orders.length; i++){
						var merchantOrderCode = orders[i].merchantOrderCode;
						var grandTotal = orders[i].grandTotal.toFixed(2);
						var withdrawDepositMoney = orders[i].withdrawDepositMoney.toFixed(2);
						var transactionCost = orders[i].transactionCost.toFixed(2);
						var orderDate = orders[i].orderDate;
						tr += "<tr><td>"+ merchantOrderCode +"</td>"
						+ "<td>"+ grandTotal +"</td>"
						+ "<td>"+ transactionCost +"</td>"
						+ "<td>"+ withdrawDepositMoney +"</td>"
						+ "<td>"+ orderDate +"</td>";
					}
					$("#prodetail").append(tr);
					
					var thirdInfo = data.data.thirdInfo;
					if(thirdInfo){
						$('#thirdInfoCode').html(thirdInfo.thirdInfoCode?thirdInfo.thirdInfoCode:'-');
						$('#thirdInfoStatus').html(thirdInfo.thirdInfoStatus?thirdInfo.thirdInfoStatus:'-');
						$('#thirdInfoWithdrawDepositMoney').html(thirdInfo.thirdInfoWithdrawDepositMoney?thirdInfo.thirdInfoWithdrawDepositMoney.toFixed(2):'-');
					}
				}
			}
		});
	}
	$('.datepicker_start').datepicker({
		minDate: new Date()
	});
	$('.datepicker_end').datepicker({
		minDate: new Date()
	});
	$('.datepicker_start2').css({
		zIndex: "1052"
	}).datepicker();

	// search_class
	$(".search_class").select2({
		width: '100%'
	});
	// select_card
	$(".select_card").select2({
		width: '100%',
		minimumResultsForSearch: -1
	});
});