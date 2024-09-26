sap.ui.define([
	"hcm/ux/snappy/controller/BaseController",
    "sap/tnt/library"
], function(
	BaseController,
    tntLib
) {
	"use strict";

	return BaseController.extend("hcm.ux.snappy.controller.Welcome", {
        onInit: function() {
			this.getRouter().getRoute("Welcome").attachPatternMatched(this._onWelcomeMatched, this);
		},
       
        onGoToEmployeeSnappyView: function(){
            this.getRouter().navTo("SnappyList", {
                "Snpty": "EMPLY"
            }, null, true);
        },
        onGoToReceivedSnappyView: function(){
            this.getRouter().navTo("SnappyList", {
                "Snpty": "RCVD"
            }, null, true);
        },
        _onWelcomeMatched:function(){
            this.setView(null);	
        }
	});
});