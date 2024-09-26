/* global location history XLSX _ */
sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function(BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("hcm.ux.snappy.controller.SnappyList", {
		onInit: function() {
			var oLocalModel = new JSONModel();
			this.getView().setModel(oLocalModel, "localModel");
			this.getRouter().getRoute("SnappyList").attachPatternMatched(this._onSnappyListMatched, this);
		},
		_onSnappyListMatched: function(oEvent) {
			var oLocalModel = this.getModel("localModel");
			var aTableSearchState = [];
			this._initiateFormData();
			var sSnappyType = oEvent.getParameter("arguments").Snpty;
			switch (sSnappyType) {
				case "FirstManagerSnappy":
				case "FRSMN":
					sSnappyType = 'FRSMN'; //1. Yönetici
					break;
				case "SecondManagerSnappy":
				case "SCNMN":
					sSnappyType = 'SCNMN'; //2. Yönetici
					break;
				case "EmployeeSnappy":
				case "EMPLY":
					sSnappyType = 'EMPLY'; //Çalışan
					break;
				case "ReceivedSnappy":
				case "RECVD":
					sSnappyType = 'RECVD'; //Aldığım
					break;
				case "GivenSnappy":
				case "GIVEN":
					sSnappyType = 'GIVEN'; //Verdiğim
					break;
			}

			this.setView(sSnappyType);	

			oLocalModel.setProperty("/snappyType", sSnappyType);

			aTableSearchState.push(new Filter("Snpty", FilterOperator.EQ, sSnappyType));
			//this.byId("tableSnappyList").getBinding("rows").aFilters = this.aTableSearchState;
			this.byId("idTableSnappyList").getBinding("items").filter(aTableSearchState, "Application");
		},
		oSnappyFilter: function(oEvent) {
			var oLocalModel = this.getModel("localModel");
			var aTableSearchState = [];

			aTableSearchState.push(new Filter("Snpty", FilterOperator.EQ, oLocalModel.getProperty("/snappyType")));
			aTableSearchState.push(new Filter("Ename", FilterOperator.EQ, oLocalModel.getProperty("/snappySearhString")));
			this.byId("idTableSnappyList").getBinding("items").filter(aTableSearchState, "Application");
		},
		onSnappyListRequested: function(){
			this.byId("idTableSnappyList").setBusy(true);
		},
		onSnappyListReceived: function(){
			this.byId("idTableSnappyList").setBusy(false);
		},

		

		onSnappySelectionChange: function(oEvent) {
			const oSelectedSnappy = oEvent.getSource().getBindingContext().getObject();
			
			if (oSelectedSnappy) {
				var oLocalModel = this.getModel("localModel");
				oLocalModel.setProperty("/currentSnappy", {...oSelectedSnappy});
				if (oLocalModel.getProperty("/snappyType") !== 'RECVD') {
					this.getRouter().navTo("SnappyDetail", {
						"Snpty": oSelectedSnappy.Snpty,
						"Snpst": oSelectedSnappy.Snpst || 'DRF',
						"Appid": oSelectedSnappy.Appid,
						"Apprp": oSelectedSnappy.Apprp
					}, null,true);
				} else {
					this.getRouter().navTo("SnappyDetail", {
						"Snpty": oSelectedSnappy.Snpty + '-RECVD' + oSelectedSnappy.Apprp,
						"Snpst": oSelectedSnappy.Snpst || 'DRF',
						"Appid": oSelectedSnappy.Appid,
						"Apprp": oSelectedSnappy.Apprp
					}, null, true);
				}
			}
		},
		onEmployeeValueHelp: function(oEvent) {
			var oLocalModel = this.getModel("localModel");
			oLocalModel.setProperty("/currentSnappy", {});
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("hcm.ux.snappy.fragment.EmployeeSearch", this);
				this.getView().addDependent(this._valueHelpDialog);
			}
			this._valueHelpDialog.open();
		},
		onEmployeeSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			if (sValue && sValue !== '') {
				var aFilters = [];
				aFilters.push(new Filter("Snpty", FilterOperator.EQ, 'EMPSH'));
				aFilters.push(new Filter("Ename", FilterOperator.EQ, sValue));
				oEvent.getSource().getBinding("items").filter(aFilters);
			}
		},
		onEmployeeSelect: function(oEvent) {
			var oSelectedSnappy = oEvent.getParameter("selectedItem").getBindingContext().getObject();
			var oLocalModel = this.getModel("localModel");
			oLocalModel.setProperty("/currentSnappy", oSelectedSnappy);
			this.getRouter().navTo("SnappyDetail", {
				"Snpty": oSelectedSnappy.Snpty,
				"Snpst": oSelectedSnappy.Snpst || 'DRF',
				"Appid": oSelectedSnappy.Appid,
				"Apprp": oSelectedSnappy.Apprp
			}, null, true);
		},

		_formatIcon: function(sSnpst) {
			if (sSnpst === "") {
				return "sap-icon://circle-task";
			} else if (sSnpst === "DRF") {
				return "sap-icon://bo-strategy-management";
			} else if (sSnpst === "CMP") {
				return "sap-icon://circle-task-2";
			} else if (sSnpst === "SVD") {
				return "sap-icon://circle-task-2";
			}
		},
		_formatState: function(sSnpst) {
			if (sSnpst === "") {
				return "Error";
			} else if (sSnpst === "DRF") {
				return "Warning";
			} else if (sSnpst === "CMP") {
				return "Success";
			} else if (sSnpst === "SVD") {
				return "Success";
			}
		},
		_initiateFormData: function(sShow) {
			var oLocalModel = this.getModel("localModel");
			oLocalModel.setData({
				snappyType: "",
				snappySearhString: "",
				currentSnappy: {},
				employeeSearhString: ""
			});
		}

	});
});