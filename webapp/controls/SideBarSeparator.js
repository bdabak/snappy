sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend(
    "hcm.ux.snappy.controls.SideBarSeparator",
    {
      metadata: {
        properties: {
          title: {
            type: "string",
            bindable: true,
          }
        },
        aggregations: {
        },
        
      },
      init: function () {},
      renderer: function (oRM, oControl) {
        const sTitle = oControl.getTitle() || null;
          oRM
            .openStart("div",oControl)
            .class("smod-sb-sep");
            sTitle ? oRM.attr("data-title", sTitle) : null;
          oRM.openEnd()
             .close("div");
      }
      
    }
  );
});
