/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"hcm/ux/snappy/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"hcm/ux/snappy/test/integration/pages/Worklist",
	"hcm/ux/snappy/test/integration/pages/Object",
	"hcm/ux/snappy/test/integration/pages/NotFound",
	"hcm/ux/snappy/test/integration/pages/Browser",
	"hcm/ux/snappy/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "hcm.ux.snappy.view."
	});

	sap.ui.require([
		"hcm/ux/snappy/test/integration/WorklistJourney",
		"hcm/ux/snappy/test/integration/ObjectJourney",
		"hcm/ux/snappy/test/integration/NavigationJourney",
		"hcm/ux/snappy/test/integration/NotFoundJourney",
		"hcm/ux/snappy/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});