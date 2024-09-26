sap.ui.define([
	"hcm/ux/snappy/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/smod/ux/lib/thirdparty/sweetalert"
], function(BaseController, JSONModel, SwalJS) {
	"use strict";

	return BaseController.extend("hcm.ux.snappy.controller.App", {

		_bExpanded: true,

		onInit: function() {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// disable busy indication when the metadata is loaded and in case of errors
			this.getOwnerComponent().getModel().metadataLoaded().
			then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.setView(null);	

			this.onCheckRole();
		},

		onSideNavButtonPress: function() {
			var oToolPage = this.byId("app");
			var bSideExpanded = oToolPage.getSideExpanded();
			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		_setToggleButtonTooltip: function(bSideExpanded) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bSideExpanded) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},

		onNavigateToPage: function(oEvent){
			var oItem = oEvent.getParameter('selectedItem');
			var sKey = oItem.getKey();

			// if you click on home, settings or statistics button, call the navTo function
			if (sKey !== "giveSnappy") {
				this.getRouter().navTo("SnappyList", {
					"Snpty": sKey
				}, null, true);
			}

		},

		onItemSelect: function(oEvent) {
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();

			// if you click on home, settings or statistics button, call the navTo function
			if (sKey !== "giveSnappy") {
				this.getRouter().navTo("SnappyList", {
					"Snpty": sKey
				}, null, true);
			}
		},

		onCheckRole: function(){
			const oModel = this.getModel();
			const oAppModel = this.getModel("appModel");

			oAppModel.setProperty("/Busy", true);

			oModel.callFunction("/CheckEmployeeRole", {
				success: (oData)=>{
					oAppModel.setProperty("/FirstManager", oData?.CheckEmployeeRole.FirstManager || false);
					oAppModel.setProperty("/SecondManager", oData?.CheckEmployeeRole.SecondManager || false);
					oAppModel.setProperty("/Busy", false);
				},
				error: ()=>{
					oAppModel.setProperty("/FirstManager", false);
					oAppModel.setProperty("/SecondManager", false);
					oAppModel.setProperty("/Busy", false);
				}
				// 13747
			})
		}
	});

});