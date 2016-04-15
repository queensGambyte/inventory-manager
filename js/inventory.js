$(function() {
	var modelPerm= {
		rackNumber: [],
		binNumber: [],
		batchNumber: [],
		drugName: [],
		alternateDrugs: [],
		company: [],
		distributor: [],
		stockInDate: [],
		stock: [],
		unitPrice: [],
		expiryDate: [],
		returnedItems: [],
		purpose: [],
		tableNames: ["Rack Number", "Bin Number", "Batch Number", "Drug Name", "Alternate Drugs", "Company",
						"Distributor", "Stock-In Date", "Stock/Quantity", "Unit Price", "Expiry Date", "Returned Items", "Purpose"],
		addDataFields: ["rackNumber", "binNumber", "batchNumber", "drugName", "alternateDrugs", "company", 
						"distributor", "stockInDate", "stock", "unitPrice", "expiryDate", "returnedItems", "purpose"]
		
	};
	 var modelTemp={
		patientName: [],
		contactNo: [],
		age: [],
		consultant: [],
		gender: [],
		hospital: [],
		address: [],
		problemTypes: [],
		billingFields: ["Patient Name", "Contact No", "Age", "Consultant", "Gender", "Hospital", "Address", "Problem types"],
		addBillingFields: ["patientName", "contactNo", "age", "consultant", "gender", "hospital", "address", "problemTypes"],
		serialNo: [],
		description: [],
		batchNo: [],
		quantity: [],
		price: [],
		totalPrice: [],
		billingTableFields: ["SerialNo", "Description", "Batch No", "Quantity", "Price", "Total Price"],
		addBillingTableFields: ["serialNo", "description", "batchNo", "quantity", "price", "totalPrice"],
		discount: "",
		invoiceNo: "",
		counter: 1,
		date: ""
	 };
	 
	var inventoryView= {
		init: function() {
			$("#viewingArea").append("<div id='inventoryView'></div>");
			$("#inventoryView").append(inventoryView.htmlInitHeaders);
			controller.initInventoryHeaders();
			controller.initInventoryContent();
			$("#inventoryView").append(inventoryView.searchBox);
			$("#inventoryView").append(inventoryView.displayResult);
			$("#search").submit(function(event) {
				event.preventDefault();
				console.log(controller.getQueryResult());
				inventoryView.renderQuery();
				$("#searchString").prop("value", "");
				
			});
		},	
		
		searchBox: '<form id="search">'+
					'<strong>Find in Inventory: </strong><input type="search" placeholder="Enter a drug name or drug purpose" id="searchString" style="width: 250px; margin-bottom: 15px;">'+
					'<input type="submit" style="">'+
					'</form>',
					
		displayResult: '<div id="viewQueryResult"></div>',
		
		htmlInitHeaders: "<div class='table-container'>"+
						"<table class='table table-bordered' id='inventoryTable'>"+
						"<thead>"+
						"<tr id='tableHeaders'>" +
						"</tr>"+
						"</thead>"+
						"</table>"+
						"</div>",
					
		htmlInitQueryHeaders: "<table class='table table-bordered' id='inventoryQueryTable'>"+
					"<thead>"+
					"<tr id='tableQueryHeaders'>" +
					"</tr>"+
					"</thead>"+
					"</table>",			
				
		renderQuery: function() {
			if($("#viewQueryResult").children()) {
				$("#viewQueryResult").empty();
			};
			$("#viewQueryResult").append(inventoryView.htmlInitQueryHeaders);
			controller.initInventoryHeaders(5);
			controller.initInventoryContent(controller.getQueryResult());
		},
		
		renderTable: function() {
			$("#inventoryView").remove();
			inventoryView.init();
		}
	};
	
	var billingView = {
		init: function() {
			$("#viewingArea").append("<div id='billingView'></div>");
			$("#billingView").append(billingView.billingFormHtml);
			controller.initBillingForm();
			$("#billingForm").submit(function(event) {
				event.preventDefault();
				alert("you submitted billing form");
				//push data into model
				controller.savePatientInfo();
				controller.clearBillingFields();
				$("#billingForm").hide();
				$("#billingTableForm").show();
			});
			
			$("#billingView").append(billingView.billingTableFormHtml);
			controller.initBillingTableForm();
			$("#billingTableForm").submit(function(event) {
				event.preventDefault();
				alert("Enter next medicine \n Click on Finished adding medicines after all medicines have been added");
				//push data into model
				controller.savePurchaseInfo();
				controller.adjustInventory();
				controller.clearBillingTableFields();
			});
			
			$("#finished").click(function() {
				
				controller.clearBillingTableFields();
				controller.savePurchaseInfo();
				$("#billingTableForm").hide();
				$("#billingForm").show();
				var discount= prompt("Enter a discount%");
				controller.saveDiscount(discount);
				controller.generateAndSaveInvoiceNo();
				controller.saveModels();
				controller.emptyPatientInfo();
				controller.emptyPurchaseInfo();
				//inventoryView.renderTable();
				window.open("invoice.html");
			});
			$("#billingView").hide();
		},
		billingFormHtml: "<form id='billingForm'>"+
					"<fieldset id='billingFormFieldset'>"+
					"<legend>Fill in these fields:</legend>"+
					"</fieldset>"+
					"</form>",
		billingTableFormHtml: 	"<form id='billingTableForm'>"+
					"<fieldset id='billingTableFormFieldset'>"+
					"<legend>Add all medicines one by one and click Finished adding medicines button</legend>"+
					"</fieldset>"+
					"</form><br>",		
		render: ""
	};
	
	var addDataView = {
		init: function() {
			$("#viewingArea").append("<div id='addDataView'></div>");
			$("#addDataView").append(addDataView.formHtml);
			controller.initAddDataForm();
			$("#addDataForm").submit(function(event) {
				event.preventDefault();
				controller.addData();
				controller.clearFormFields();
			});
			$("#addDataView").hide();
		},
		
		formHtml: "<form id='addDataForm'>"+
					"<fieldset id='addDataFormFieldset'>"+
					"<legend>Fill in these fields:</legend>"+
					"</fieldset>"+
					"</form>"
	};
	
	var controller= {
		downloadLink: '',
		
		setDownloadLink: function() {
			controller.downloadLink = controller.writeToFile(JSON.stringify(modelPerm));
		},
		
		initModel: function() {
			if(localStorage.modelPerm) {
				modelPerm= JSON.parse(localStorage.modelPerm);
			}
		},
		
		init: function() {
			controller.initModel();
			inventoryView.init();
			billingView.init();
			addDataView.init();
			//console.log(JSON.stringify(modelPerm));
			controller.downloadLink= controller.writeToFile(JSON.stringify(modelPerm));
			$("#myid1").prop("href", controller.downloadLink);
			$("#billing").click(function() {
				$("#billingView").show();
				$("#inventoryView").hide();
				$("#addDataView").hide();
			});
			$("#inventory").click(function() {
				$("#billingView").hide();
				inventoryView.renderTable();
				$("#inventoryView").show();
				$("#addDataView").hide();
			});
			$("#addData").click(function() {
				$("#billingView").hide();
				$("#inventoryView").hide();
				$("#addDataView").show();
			});
		},
		
		getQueryResult: function() {
			var queryString = $("#searchString").prop("value");
			console.log(queryString);
			var iterations= modelPerm.drugName.length;
			var indices= [];
			for(var i=0; i<iterations; i++) {
				if(queryString== modelPerm.drugName[i] || modelPerm.purpose[i].indexOf(queryString)>-1) {
					indices.push(i);
				}
			}
			return indices;
		},
		
		getPrice: function() {
			var queryDrug= $("#description").prop("value");
			var iterations= modelPerm.drugName.length;
			for(var i=0; i<iterations; i++) {
				if(queryDrug.toLowerCase()==modelPerm.drugName[i].toLowerCase()) {
					return modelPerm.unitPrice[i];
				}
			}
			return "Check Spelling of Drug";
		},
		
		getStock: function() {
			var queryDrug= $("#description").prop("value");
			var iterations= modelPerm.drugName.length;
			for(var i=0; i<iterations; i++) {
				if(queryDrug.toLowerCase()==modelPerm.drugName[i].toLowerCase()) {
					return i;
				}
			}
		},
		
		initInventoryHeaders: function() {
			var iterations = modelPerm.tableNames.length;
			if(arguments.length==0) {
				for(var i=0; i<iterations; i++) {
					$("#tableHeaders").append("<th>"+modelPerm.tableNames[i]+"</th>");
				}
			} else{
				for(var i=0; i<iterations; i++) {
					$("#tableQueryHeaders").append("<th>"+modelPerm.tableNames[i]+"</th>");
				}
			}	
		},
		
		initInventoryContent: function(indices) {
			var iterations1="";
			if(arguments.length==1){
				iterations1= indices.length;
				var iterations2= modelPerm.tableNames.length;
				for(var i in indices) {
					//console.log(i);
					var htmlInitContent= "<tbody>"+
								"<tr id='tableQueryContent"+"Row"+indices[i]+"'>"+
								"</tr>"+
								"</tbody>"
					$("#inventoryQueryTable").append(htmlInitContent);			
					for(var j=0; j<iterations2; j++){
						$("#tableQueryContentRow"+indices[i]).append("<td>"+modelPerm[modelPerm.addDataFields[j]][indices[i]]+"</td>");
					}
				}
			} else{
				iterations1= modelPerm.rackNumber.length;
				var iterations2= modelPerm.tableNames.length;
				for(var i=0; i<iterations1; i++) {
					var htmlInitContent= "<tbody>"+
								"<tr id='tableContent"+"Row"+i+"'>"+
								"</tr>"+
								"</tbody>"
					$("#inventoryTable").append(htmlInitContent);			
					for(var j=0; j<iterations2; j++){
						$("#tableContentRow"+i).append("<td>"+modelPerm[modelPerm.addDataFields[j]][i]+"</td>");
					}
				}
			}
		},
		
		initAddDataForm: function() {
			var iterations = modelPerm.tableNames.length;
			for(var i=0; i<iterations; i++) {
				if(i!=2){
					if(i%2!=0){
						$("#addDataFormFieldset").append('<span class="pull-right"><strong>'+ modelPerm.tableNames[i] + ': </strong>'+ 
											'<input type="text" id="' + modelPerm.addDataFields[i] + '" class="form-field" required></span><br>');
					} else{
						$("#addDataFormFieldset").append('<span><strong>'+ modelPerm.tableNames[i] + ': </strong>'+ 
										'<input type="text" id="' + modelPerm.addDataFields[i] + '" class="form-field" required></span>');
					}
				} else{
					$("#addDataFormFieldset").append('<span><strong>'+ modelPerm.tableNames[i] + ': </strong>'+ 
										'<input type="text" id="' + modelPerm.addDataFields[i] + '" class="form-field"></span>');
				}						
			}
			$("#addDataFormFieldset").append('<br><input type= "submit" class="center-block" value="Submit">');
			$("#addDataFormFieldset").append('<br><a class="pull-right" download="data.txt" id="myid1"><h2>CLICK HERE TO SAVE DATA TO FILE</h2></a>');
			controller.setDownloadLink();
			$("#myid1").prop("href", controller.downloadLink);
		},
		
		addData: function() {
			var iterations=modelPerm.addDataFields.length;
			console.log(iterations);
			for(var i=0; i<iterations; i++) {
					modelPerm[modelPerm.addDataFields[i]].push($("#"+modelPerm.addDataFields[i]).prop("value"));
				}
			localStorage.modelPerm= JSON.stringify(modelPerm);
			controller.setDownloadLink(); //updating downloadLink for download
			$("#myid1").prop("href", controller.downloadLink); //updating href for download
		},
		
		writeToFile: function(text) {
			var textFile = null;
			
			var data = new Blob([text], {type: 'text/plain'});

			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (textFile !== null) {
			  window.URL.revokeObjectURL(textFile);
			}

			textFile = window.URL.createObjectURL(data);

			// returns a URL you can use as a href
			return textFile;
			
		},
		
		clearFormFields: function() {
			var iterations=modelPerm.addDataFields.length;
			for(var i=0; i<iterations; i++) {
				if(true) {
					$("#"+modelPerm.addDataFields[i]).prop("value", "");
				}
			}
			alert("New data added");
		},
		
		initBillingForm: function() {
			var iterations= modelTemp.billingFields.length;
			for(var i=0; i<iterations; i++) {
				
					if(i%2!=0){
						$("#billingFormFieldset").append('<span class="pull-right"><strong>'+ modelTemp.billingFields[i] + ': </strong>'+ 
											'<input type="text" id="' + modelTemp.addBillingFields[i] + '" class="form-field"></span><br>');
					} else{
						$("#billingFormFieldset").append('<span><strong>'+ modelTemp.billingFields[i] + ': </strong>'+ 
										'<input type="text" id="' + modelTemp.addBillingFields[i] + '" class="form-field"></span>');
					}
				} 					
			
			$("#billingFormFieldset").append('<br><input type= "submit" class="center-block" value="Submit">');
		},
		
		clearBillingFields: function() {
			var iterations= modelTemp.addBillingFields.length;
			for(var i=0; i<iterations; i++){
				$("#"+modelTemp.addBillingFields[i]).prop("value","");
			}
		},
		
		initBillingTableForm: function() {
			var iterations= modelTemp.addBillingTableFields.length;
				for(var i=0; i<iterations; i++) {
				
					if(i%2!=0){
						$("#billingTableFormFieldset").append('<span class="pull-right"><strong>'+ modelTemp.billingTableFields[i] + ': </strong>'+ 
											'<input type="text" id="' + modelTemp.addBillingTableFields[i] + '" class="form-field" required></span><br>');
					} else{
						$("#billingTableFormFieldset").append('<span><strong>'+ modelTemp.billingTableFields[i] + ': </strong>'+ 
										'<input type="text" id="' + modelTemp.addBillingTableFields[i] + '" class="form-field" required></span>');
					}
					
				} 					
				$("#price").prop("disabled", "true");
				$("#totalPrice").prop("disabled", "true");
				//$("#totalPrice").prop("value", "See on Final Bill");
				$("#description").change(function() {
					$("#price").prop("value", controller.getPrice());
				});
				$("#quantity").change(function() {
					var tp= $("#price").prop("value") * $("#quantity").prop("value");
					$("#totalPrice").prop("value", tp.toFixed(2));
				});
			
			$("#billingTableFormFieldset").append('<br><input type= "submit" class="center-block" value="Submit">');
			$("#billingTableFormFieldset").append('<input type="button" id="finished" class="pull-right" value="Finished Adding Medicines"></input>');
			$("#billingTableForm").hide();
		},
		
		clearBillingTableFields: function() {
			var iterations= modelTemp.addBillingTableFields.length;
			for(var i=0; i<iterations; i++){
				$("#"+modelTemp.addBillingTableFields[i]).prop("value","");
			}
		},
		
		savePatientInfo: function() {
			var iterations= modelTemp.addBillingFields.length;
			for(var i=0; i<iterations; i++) {
				if($("#"+modelTemp.addBillingFields[i]).prop("value")){
					modelTemp[modelTemp.addBillingFields[i]].push($("#"+modelTemp.addBillingFields[i]).prop("value"));
				} else{
					modelTemp[modelTemp.addBillingFields[i]].push("--");
				}
				//console.log(modelTemp[modelTemp.addBillingFields[i]][0]);
			}
		},
		
		savePurchaseInfo: function() {
			var iterations= modelTemp.addBillingTableFields.length;
			for(var i=0; i<iterations; i++) {
				if($("#"+modelTemp.addBillingTableFields[i]).prop("value")){
					modelTemp[modelTemp.addBillingTableFields[i]].push($("#"+modelTemp.addBillingTableFields[i]).prop("value"));
				} else{
					modelTemp[modelTemp.addBillingTableFields[i]].push("--");
				}
			}
		},
		
		emptyPatientInfo: function() {
			var iterations= modelTemp.addBillingFields.length;
			for(var i=0; i<iterations; i++) {
				modelTemp[modelTemp.addBillingFields[i]].splice(0,modelTemp[modelTemp.addBillingFields[i]].length);
			}
		},
		
		emptyPurchaseInfo: function() {
			var iterations= modelTemp.addBillingTableFields.length;
			for(var i=0; i<iterations; i++) {
				modelTemp[modelTemp.addBillingTableFields[i]].splice(0,modelTemp[modelTemp.addBillingTableFields[i]].length);
			}
		},
		
		saveDiscount: function(d) {
			modelTemp.discount= d;
		},
		
		generateAndSaveInvoiceNo: function() {
			var d= new Date();
			modelTemp.invoiceNo= "KP-"+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"-"+modelTemp.counter;
			modelTemp.counter++;
			modelTemp.date= ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()+"";
			console.log(modelTemp.date);
		},
		
		adjustInventory: function() {
			var target= controller.getStock();
			console.log(target);
			modelPerm.stock[target]-= parseInt($("#quantity").prop("value"));
		},
		
		saveModels: function() {
			localStorage.modelTemp=JSON.stringify(modelTemp);
			localStorage.modelPerm= JSON.stringify(modelPerm);
		},
		
		addBillingData: function() {
			
		},
		
		addBillingTableData: function() {
			
		}
		 
	};
	
	controller.init();
});