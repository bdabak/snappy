sap.ui.define([
		"hcm/ux/snappy/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("hcm.ux.snappy.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("StaffPreference");
			}

		});

	}
);