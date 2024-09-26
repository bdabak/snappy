sap.ui.define(
  ["sap/ui/core/Control", "sap/ui/Device"],
  function (Control, Device) {
    "use strict";

    return Control.extend("hcm.ux.snappy.controls.SideBar", {
      metadata: {
        properties: {
          title: {
            type: "string",
            bindable: true,
          },
          expandedLogo: {
            type: "sap.ui.core.URI",
            bindable: true,
          },
          collapsedLogo: {
            type: "sap.ui.core.URI",
            bindable: true,
          },
        },
        aggregations: {
          header: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
          links: {
            type: "sap.ui.core.Control",
            multiple: "true",
            singularName: "link",
          },
          footer: {
            type: "sap.ui.core.Control",
            multiple: false,
          },
        },
        defaultAggregation: "navLinks",
        events: {
          select: {
            parameters: {
              selectedItem: {
                type: "hcm.ux.snappy.controls.SideBarNavLinkItem",
              },
            },
          },
        },
      },
      init: function () {
        var sLibraryPath = jQuery.sap.getModulePath("hcm.ux.snappy"); //get the server location of the ui library
        jQuery.sap.includeStyleSheet(sLibraryPath + "/controls/SideBar.css");

        Device.media.attachHandler(
          this.handleResizeSideBar,
          this,
          sap.ui.Device.media.RANGESETS.SAP_STANDARD
        );
      },
      renderer: function (oRM, oControl) {
        const aLinks = oControl.getLinks() || [];
        oRM
          .openStart("div", oControl)
          .class("smod-sb")
          .class(Device.system.desktop === false ? "close" : null)
          .openEnd() //--Side filter main

          //--Logo
          .openStart("div")
          .class("smod-sb-logo-details")
          .openEnd();

        if (oControl.getExpandedLogo() && oControl.getCollapsedLogo()) {
          oRM
            .openStart("div") //--Logo icon
            .class("smod-sb-brand-logo")
            .class("toggleMenu")
            .openEnd()
            //--Expanded
            .voidStart("img") //--Logo image expandded
            .class("smod-sb-brand-logo-expanded")
            .class("toggleMenu")
            .attr("role", "button")
            .attr("tabIndex", "0")
            .attr("src", oControl.getExpandedLogo())
            .voidEnd()
            //--Expanded

            //--Collapsed
            .voidStart("img") //--Logo image collapsed
            .class("smod-sb-brand-logo-collapsed")
            .class("toggleMenu")
            .attr("role", "button")
            .attr("tabIndex", "0")
            .attr("src", oControl.getCollapsedLogo())
            .voidEnd()
            .close("div"); //-- Logo icon
          //--Collapsed
        } else {
          oRM
            .openStart("span") //--Logo icon
            .class("linkIcon")
            .class("toggleMenu")
            .openEnd()
            .text("menu")
            .close("span") //-- Logo icon
            .openStart("span") //--Logo title
            .class("smod-sb-title")
            .openEnd()
            .text(oControl.getTitle())
            .close("span"); //-- Logo title
        }

        oRM.close("div");
        //--Logo

        //--Header
        if (oControl.getHeader()) {
          oRM
            .openStart("div")
            .class("smod-sb-header")
            .openEnd()
            .renderControl(oControl.getHeader())
            .close("div");
        }
        //--Header

        //--Nav links
        oRM.openStart("ul").class("smod-sb-nav-links").openEnd();
        aLinks.forEach((oLink) => {
          oRM.renderControl(oLink);
        });
        oRM.close("ul");
        //--Footer
        if (oControl.getFooter()) {
          oRM
            .openStart("div")
            .class("smod-sb-footer")
            .openEnd()
            .renderControl(oControl.getFooter())
            .close("div");
        }
        //--Footer

        //--Nav links

        oRM.close("div"); //--Side filter main
      },
      ontap: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(e.target).hasClass("toggleMenu") && !Device.system.phone) {
          this.$().toggleClass("close");
        }
      },
      handleResizeSideBar: function (oEvent) {
        switch (oEvent.name) {
          case "Phone":
            this.$().addClass("close");
            break;
          case "Tablet":
            this.$().addClass("close");
            break;
          case "Desktop":
            this.$().removeClass("close");
            break;
        }
      },
    });
  }
);
