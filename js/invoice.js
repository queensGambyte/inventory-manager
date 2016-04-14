$(function() {
	var model= JSON.parse(localStorage.modelTemp);
	
	var viewPatientInfoTable= {
		init: function() {
			controller.setupPatientInfoTable();
			controller.setupInvoiceAndDate();
		}
	};
	
	var viewPurchaseTableInfo= {
		init: function() {
			controller.setupPurchaseInfoTable();
			controller.setupFinalFields();
		}
	};
	
	var controller= {
		init: function() {
			viewPatientInfoTable.init();
			viewPurchaseTableInfo.init();
		},
		
		setupPatientInfoTable: function() {
			var iterations= model.billingFields.length;
			for(var i=0; i<iterations; i++) {
				$("#"+model.addBillingFields[i]).prop("innerHTML", model.billingFields[i]+": <strong>"+model[model.addBillingFields[i]][0]+"</strong>");
			}
		},
		
		setupInvoiceAndDate: function() {
			$("#invoiceNumber").prop("innerHTML", "<strong>Invoice#: "+model.invoiceNo+"</strong>");
			$("#date").prop("innerHTML", "<strong>Date: "+model.date+"</strong>")
		},
		
		setupPurchaseInfoTable: function() {
			$("#purchase").append("<tbody id='purchaseRows'></tbody>");
			//console.log(model.description[model.description.length-1]);
			if(model.description[model.description.length-1]=="--"){
				model.description.pop();
			}
			if(model.totalPrice[model.totalPrice.length-1]=="--" || model.totalPrice[model.totalPrice.length-1]==undefined || model.totalPrice[model.totalPrice.length-1]==NaN) {
				model.totalPrice.pop();
			}
			var iterations= model.description.length;
			var iterations2= model.addBillingTableFields.length;
			for(var i=0; i<iterations; i++) {
				$("#purchaseRows").append(
					"<tr id='row"+i+"'>"+
					"</tr>"
				);
				for(var j=0; j<iterations2; j++ ) {
					$("#row"+i).append(
						"<td>"+"<strong>"+
						model[model.addBillingTableFields[j]][i]+
						"</strong>"+"</td>"
					);
				}
			}
		},
		
		setupFinalFields: function() {
			var arraySum= function(array) {
				var iterations= array.length;
				console.log(iterations);
				var sum=0;
				for(var i=0; i<iterations; i++) {
					sum+= parseFloat(array[i]);
					console.log(sum, array[i]);
				}
				return parseFloat(sum).toFixed(2);
			};
			var savings= function(dp) {
				var disc= parseFloat(dp);
				return (arraySum(model.totalPrice)*disc/100).toFixed(2);
			};
			//console.log(model.totalPrice.reduce(getSum));
			$("#items").prop("innerHTML", model.description.length);
			$("#total").prop("innerHTML", "Rs "+arraySum(model.totalPrice));
			$("#saved").prop("innerHTML", "Rs "+savings(model.discount));
			$("#pay").prop("innerHTML", "Rs "+(arraySum(model.totalPrice)-savings(model.discount)).toFixed(0));
		}
		
	};
	
	controller.init();
});