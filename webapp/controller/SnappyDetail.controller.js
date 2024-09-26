/* global location history XLSX _ */
sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'sap/ui/model/Sorter',
	'sap/ui/core/format/DateFormat',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/m/MessageBox',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, Device, Sorter, DateFormat, Dialog, Button, Text, MessageBox, Filter, FilterOperator,
	History) {
	"use strict";

	return BaseController.extend("hcm.ux.snappy.controller.SnappyDetail", {
		onInit: function() {
			var oLocalModel = new JSONModel({});
			this.getView().setModel(oLocalModel, "localModel");
			this.getRouter().getRoute("SnappyDetail").attachPatternMatched(this._onSnappyDetailMatched, this);
			this._initiateFormData();
		},
		_onSnappyDetailMatched: function(oEvent) {
			var oLocalModel = this.getModel("localModel");
			var oModel = this.getModel();
			var aTableSearchState = [];
			this._initiateFormData();
			var oArguments = oEvent.getParameter("arguments");

			if(!oArguments){
				this.getRouter().navTo("Welcome", null, null, true);
			}

			//--First update page binding
			if(oArguments?.Appid !== null && oArguments.Apprp !== null){
				oModel.metadataLoaded().then(()=>{
					this.byId("idPageSnappyDetail").bindElement({
						path: oModel.createKey("/SnappyHeaderSet", {
							Appid: oArguments.Appid,
							Apprp: oArguments.Apprp
						})
					});
				});
			}

			var aSnpty = oArguments?.Snpty.split('-');

			oLocalModel.setProperty("/snappyType", aSnpty[0]);
			this.setView(aSnpty[0]);

			//--Second argument exists
			if (aSnpty[1]) {
				oLocalModel.setProperty("/snappyType2", aSnpty[1]);
			}
			oLocalModel.setProperty("/snappyStatus", oArguments?.Snpst);
			oLocalModel.setProperty("/apprasialId", oArguments?.Appid);

			aTableSearchState.push(new Filter("Snpty", FilterOperator.EQ, oArguments?.Snpty));
			aTableSearchState.push(new Filter("Appid", FilterOperator.EQ, oArguments?.Appid));
			aTableSearchState.push(new Filter("Snpdt", FilterOperator.EQ, oLocalModel.getProperty("/selectedKey")));
			if (aSnpty[1]) {
				aTableSearchState.push(new Filter("Snpnt", FilterOperator.EQ, aSnpty[1]));
			}
			this.byId("idTableSnappyDetail").getBinding("items").filter(aTableSearchState, "Application");

			


		},
		onNavBack: function(){
			var oLocalModel = this.getModel("localModel");
			this.getRouter().navTo("SnappyList", {
				"Snpty": oLocalModel.getProperty("/snappyType")
			}, null, true);
		},
		onSnappyDetailRequested: function(){
			this.byId("idTableSnappyDetail").setBusy(true);
		},
		onSnappyDetailReceived: function(){
			this.byId("idTableSnappyDetail").setBusy(false);
		},
		onIconFilterSelect: function(oEvent) {
			var sKey = oEvent.getParameter("key");
			var oLocalModel = this.getModel("localModel");
			var aTableSearchState = [];

			oLocalModel.setProperty("/selectedKey", sKey);

			aTableSearchState.push(new Filter("Snpty", FilterOperator.EQ, oLocalModel.getProperty("/snappyType")));
			aTableSearchState.push(new Filter("Appid", FilterOperator.EQ, oLocalModel.getProperty("/apprasialId")));
			aTableSearchState.push(new Filter("Snpdt", FilterOperator.EQ, sKey));
			if (oLocalModel.getProperty("/snappyType2") !== '') {
				aTableSearchState.push(new Filter("Snpnt", FilterOperator.EQ, oLocalModel.getProperty("/snappyType2")));
			}
			this.byId("idTableSnappyDetail").getBinding("items").filter(aTableSearchState, "Application");
		},
		onEditSnappyDetailSelected: function(oEvent) {
			var oLocalModel = this.getView().getModel("localModel");
			var oSnappyDetail = oEvent.getSource().getBindingContext().getObject();
			oLocalModel.setProperty("/currentSnappyDetail", _.clone(oSnappyDetail));
			this._callEditSnappyDetailDialog();
		},
		onDeleteSnappyDetailSelected: function(oEvent) {
			var that = this;
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oModel = this.getModel();
			var dialog = new Dialog({
				title: that.getText("processConfirmationTitle"),
				type: 'Message',
				state: 'Error',
				content: new Text({
					text: that.getText("areYouSureYouWantToDeleteRecord")
				}),
				beginButton: new Button({
					text: that.getText("DELETE_ACTION"),
					type: 'Reject',
					icon: 'sap-icon://delete',
					press: function() {
						dialog.close();
						dialog.destroy();
						that.openBusyFragment();
						oModel.remove(sPath, {
							success: function(data) {
								//sap.m.MessageToast.show(that.getText("recordSuccessfullyDeleted"));
								that.toastMessage("S","SUCCESSFUL_OPERATION","recordSuccessfullyDeleted", [] );
								that.closeBusyFragment();
							},
							error: function(e) {
								//ssap.m.MessageToast.show(that.getText("errorDeletingRecord"));
								that.alertMessage("E","ERROR_OPERATION","errorDeletingRecord", [] );
								that.closeBusyFragment();
							}
						});
					}
				}),
				endButton: new Button({
					text: that.getText("CANCEL_ACTION"),
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();

		},
		onDeleteSnappy: function(oEvent) {
			var that = this;
			var oModel = this.getModel();
			var oLocalModel = this.getModel("localModel");
			var sPath = "/SnappyHeaderSet(Appid=guid'" + oLocalModel.getProperty("/apprasialId") + "',Apprp='99999999')";

			var dialog = new Dialog({
				title: that.getText("processConfirmationTitle"),
				type: 'Message',
				state: 'Error',
				content: new Text({
					text: that.getText("areYouSureYouWantToDeleteSnappy")
				}),
				beginButton: new Button({
					text: that.getText("DELETE_ACTION"),
					type: 'Reject',
					icon: 'sap-icon://delete',
					press: function() {
						dialog.close();
						dialog.destroy();
						that.openBusyFragment();
						oModel.remove(sPath, {
							success: function(data) {
								//sap.m.MessageToast.show(that.getText("snappySuccessfullyDeleted"));
								that.toastMessage("S","SUCCESSFUL_OPERATION","snappySuccessfullyDeleted", [] );
								that.closeBusyFragment();

								var oHistory = History.getInstance();
								var sPreviousHash = oHistory.getPreviousHash();

								if (sPreviousHash !== undefined) {
									window.history.go(-1);
								} else {
									that.getRouter().navTo("SnappyList", {
										"Snpty": oLocalModel.getProperty("/snappyType")
									}, null, true);
								}
							},
							error: function(e) {
								//sap.m.MessageToast.show(that.getText("errorDeletingSnappy"));
								that.alertMessage("E","ERROR_OPERATION","errorDeletingSnappy", [] );
								that.closeBusyFragment();
							}
						});
					}
				}),
				endButton: new Button({
					text: that.getText("CANCEL_ACTION"),
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();

		},
		onCompleteSnappy: function(oEvent) {
			var that = this;
			var oModel = this.getModel();
			var oLocalModel = this.getModel("localModel");
			var oNewEntry = oModel.createEntry("/SnappyHeaderSet");
			var oCurrentSnappy = _.clone(oNewEntry.getObject());
			oCurrentSnappy.Appid = oLocalModel.getProperty("/apprasialId");
			oCurrentSnappy.Apprp = '99999999';
			var dialog = new Dialog({
				title: that.getText("processConfirmationTitle"),
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: that.getText("areYouSureYouWantToCompleteSnappy")
				}),
				beginButton: new Button({
					text: that.getText("COMPLETE_ACTION"),
					type: 'Accept',
					icon: 'sap-icon://complete',
					press: function() {
						dialog.close();
						dialog.destroy();
						that.openBusyFragment();
						oModel.create('/SnappyHeaderSet', oCurrentSnappy, {
							success: function(oData, oResponse) {
								that.closeBusyFragment();
								that.toastMessage("S","SUCCESSFUL_OPERATION","snappySuccessfullyCompleted", [] );

								var oHistory = History.getInstance();
								var sPreviousHash = oHistory.getPreviousHash();

								if (sPreviousHash !== undefined) {
									window.history.go(-1);
								} else {
									that.getRouter().navTo("SnappyList", {
										"Snpty": oLocalModel.getProperty("/snappyType")
									}, null, true);
								}
							},
							error: function(oError) {
								that.closeBusyFragment();
								that.alertMessage("E","ERROR_OPERATION","errorCompletingSnappy", [] );
							}
						});
					}
				}),
				endButton: new Button({
					text: that.getText("CANCEL_ACTION"),
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();

		},
		onEditSnappyDetail: function(oEvent) {
			var that = this;
			var oModel = this.getModel();
			var oLocalModel = this.getModel("localModel");
			var oCurrentSnappyDetail = oLocalModel.getProperty("/currentSnappyDetail");

			if (oCurrentSnappyDetail.Snpnt !== '') {
				this.openBusyFragment();
				oModel.create('/SnappyDetailSet', oCurrentSnappyDetail, {
					success: function(oData, oResponse) {
						that.closeBusyFragment();
						that.toastMessage("S","SUCCESSFUL_OPERATION","recordSuccessfullyModified", [] );
						that._oEditSnappyDetailDialog.close();
					},
					error: function(oError) {
						that.closeBusyFragment();
						that.alertMessage("E","ERROR_OPERATION","errorModifingRecord", [] );
					}
				});
			}

		},
		onCancelEditSnappyDetailDialog: function(oEvent) {
			this._oEditSnappyDetailDialog.close();
		},
		_callEditSnappyDetailDialog: function() {
			if (!this._oEditSnappyDetailDialog) {
				this._oEditSnappyDetailDialog = sap.ui.xmlfragment("hcm.ux.snappy.fragment.EditSnappyDetail", this);
				this.getView().addDependent(this._oEditSnappyDetailDialog);
			}
			this._oEditSnappyDetailDialog.open();
		},
		_formatIcon: function(sSnpnt) {
			if (sSnpnt !== "") {
				return "sap-icon://sys-enter-2";
			} else {
				return null;
			}
		},
		_formatState: function(sSnpnt) {
			if (sSnpnt !== "") {
				return "Success";
			} else {
				return null;
			}
		},
		_initiateFormData: function(sShow) {
			var oLocalModel = this.getModel("localModel");
			this.byId("idPageSnappyDetail").unbindElement("");
			oLocalModel.setData({
				selectedKey: "C",
				snappyType: "",
				snappyType2: "",
				snappyStatus: "",
				apprasialId: "",
				currentSnappy: {},
				currentSnappyDetail: {}
			});
		}

	});
});