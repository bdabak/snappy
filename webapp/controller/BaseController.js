sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "../utils/FormValidator"],
  function (Controller, MessageBox, FormValidator) {
    "use strict";

    return Controller.extend("hcm.ux.snappy.controller.BaseController", {
      /**
       * Convenience method for accessing the router.
       * @public
       * @returns {sap.ui.core.routing.Router} the router for this component
       */
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },

      _formatType: function (sType) {
        try {
          return "Type" + sType;
        } catch (oError) {
          return null;
        }
      },
      _formatPernrVisibility: function (sPernr) {
        try {
          if (sPernr === "99999999") {
            return "";
          } else {
            return sPernr;
          }
        } catch (oError) {
          return null;
        }
      },
      _formatString: function (sString) {
        try {
          return sString.split(" ").join("");
        } catch (oError) {
          return null;
        }
      },

      /**
       * Convenience method for getting the view model by name.
       * @public
       * @param {string} [sName] the model name
       * @returns {sap.ui.model.Model} the model instance
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Convenience method for setting the view model.
       * @public
       * @param {sap.ui.model.Model} oModel the model instance
       * @param {string} sName the model name
       * @returns {sap.ui.mvc.View} the view instance
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Getter for the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      getText: function (sTextCode, aParam) {
        var aTextParam = aParam;
        if (!aTextParam) {
          aTextParam = [];
        }
        return this.getResourceBundle().getText(sTextCode, aTextParam);
      },
      _getBusyFragment: function () {
        this.oBusyDialog = sap.ui.getCore().byId("GenericBusyDialog") || null;

        if (!this.oBusyDialog) {
          this.oBusyDialog = sap.ui.xmlfragment(
            "hcm.ux.snappy.fragment.GenericBusyDialog",
            this
          );

          this.getView().addDependent(this.oBusyDialog);
        }

        return this.oBusyDialog;
      },
      openBusyFragment: function (sTextCode = null, aMessageParameters = []) {
        var oDialog = this._getBusyFragment();
        var that = this;
        if (sTextCode) {
          oDialog.setText(this.getText(sTextCode, aMessageParameters));
        } else {
          oDialog.setText(this.getText("PLEASE_WAIT", []));
        }

        setTimeout(() => {
          oDialog.open();
        }, 100);
      },

      closeBusyFragment: function () {
        var oDialog = this._getBusyFragment();
        setTimeout(() => {
          oDialog.close();
        }, 500);
      },

      onDateParseError: function (oEvent) {
        oEvent.getSource().setValue();
        this._callWarnDialog(this.getText("invalidDateFormat"));
      },
      _formatNumber: function (sId) {
        try {
          return parseInt(sId, 10).toString();
        } catch (oErr) {
          return null;
        }
      },
      _validateForm: function (oForm) {
        var oValidator = new FormValidator(this);

        if (oForm) {
          oValidator.clearTraces(oForm);
          var sResult = oValidator.validate(oForm);
          return sResult;
        } else {
          return true;
        }
      },
      _clearValidationTraces: function (oForm) {
        var oValidator = new FormValidator(this);
        if (oForm) {
          oValidator.clearTraces(oForm);
        }
      },
      _callSuccessDialog: function (messageText) {
        messageText = messageText
          ? messageText
          : this.getText("operationCompletedSuccessfully");
        var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
        MessageBox.success(messageText, {
          styleClass: bCompact ? "sapUiSizeCompact" : "",
        });
      },
      _callWarnDialog: function (messageText) {
        MessageBox.show(messageText, {
          icon: sap.m.MessageBox.Icon.WARNING,
          title: "Uyarı",
          actions: [sap.m.MessageBox.Action.CLOSE],
          content: messageText,
          contentWidth: "20%",
        });
      },
      _callWarnDetailsDialog: function (messages, messageText) {
        var sDetail = "";
        for (var i = 0; i < messages.length; i++) {
          sDetail = sDetail + "<li>" + messages[i] + "</li> ";
        }

        sap.m.MessageBox.show(messageText, {
          icon: sap.m.MessageBox.Icon.WARN,
          title: "Hata",
          actions: [sap.m.MessageBox.Action.CLOSE],
          details: "<ul>" + sDetail + "</ul>",
          contentWidth: "50%",
        });
      },
      _callErrorDialog: function (messageText) {
        var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
        messageText = messageText
          ? messageText
          : this.getText("operationFailed");
        MessageBox.error(messageText, {
          styleClass: bCompact ? "sapUiSizeCompact" : "",
        });
      },
      _callErrorDetailsDialog: function (messages, messageText) {
        var that = this;
        var sDetail = "";
        for (var i = 0; i < messages.length; i++) {
          sDetail = sDetail + "<li>" + messages[i] + "</li> ";
        }

        sap.m.MessageBox.show(messageText, {
          icon: sap.m.MessageBox.Icon.ERROR,
          title: that.getText("ERROR"),
          actions: [sap.m.MessageBox.Action.CLOSE],
          details: "<ul>" + sDetail + "</ul>",
          contentWidth: "50%",
        });
      },
      setView: function (sView) {
        const oAppModel = this.getView().getModel("appModel");
        oAppModel?.setProperty("/View", sView);
      },

      constructPageTitle: function (sViewType, sEmployeeName) {
        const aViewMap = new Map([
          ["FRSMN", this.getText("FirstManagerView", [])],
          ["SCNMN", this.getText("SecondManagerView", [])],
          ["EMPLY", this.getText("EmployeeView", [])],
          ["RECVD", this.getText("ReceivedView", [])],
          ["GIVEN", this.getText("GivenView", [])],
        ]);
        if (!sViewType) {
          return "";
        }

        if (!sEmployeeName) {
          return aViewMap.get(sViewType);
        }

        return aViewMap.get(sViewType) + " - " + sEmployeeName;
      },
      alertMessage: function (
        sType,
        sTitle,
        sMessage,
        aMessageParam,
        sPosition = "center"
      ) {
        var sIcon;

        switch (sType) {
          case "W":
            sIcon = "warning";
            break;
          case "E":
            sIcon = "error";
            break;
          case "S":
            sIcon = "success";
            break;
          case "I":
            sIcon = "info";
            break;
          case "Q":
            sIcon = "question";
            break;
          default:
            sIcon = "success";
        }

        this.showMessage({
          text: this.getText(sMessage, aMessageParam),
          title: this.getText(sTitle),
          icon: sIcon,
          showConfirmButton: true,
          timer: undefined,
          position: sPosition ? sPosition : "center",
        });
      },

      toastMessage: function (sType, sTitle, sMessage, aMessageParam) {
        var sIcon;

        switch (sType) {
          case "W":
            sIcon = "warning";
            break;
          case "E":
            sIcon = "error";
            break;
          case "S":
            sIcon = "success";
            break;
          case "I":
            sIcon = "info";
            break;
          default:
            sIcon = "success";
        }

        this.showMessage({
          html: this.getText(sMessage, aMessageParam),
          title: this.getText(sTitle),
          icon: sIcon,
          showConfirmButton: sIcon !== "success",
        });
      },

      showMessage: function (opts) {
        var options = {
          title: null,
          text: null,
          html: null,
          icon: "info",
          position: "bottom",
          showConfirmButton: false,
          confirmButtonText: this.getText("CONFIRM_ACTION", []),
          confirmButtonColor: "#3085d6",
          showCancelButton: false,
          cancelButtonText: this.getText("CANCEL_ACTION", []),
          cancelButtonColor: "#d33",
          showCloseButton: false,
          toast: true,
          timer: 5000,
          timerProgressBar: true,
          // customClass: {
          // 	popup: "colored-toast"
          // },
          // iconColor: "white",
          backdrop: false,
        };

        for (var k in options) {
          if (opts.hasOwnProperty(k)) {
            options[k] = opts[k];
          }
        }

        Swal.fire({ ...options }).then(function (result) {
          if (result.isConfirmed) {
            if (opts.confirmCallbackFn !== undefined) {
              try {
                opts.confirmCallbackFn();
              } catch (e) {}
            }
          }
          if (result.isCancelled) {
            if (opts.cancelCallbackFn !== undefined) {
              try {
                opts.cancelCallbackFn();
              } catch (e) {}
            }
          }
        });
      },
      confirmDialog: function (opts) {
        var options = {
          title: null,
          html: null,
          icon: "info",
          position: "center",
          timer: undefined,
          timerProgressBar: false,
          showConfirmButton: true,
          confirmButtonText: this.getText("CONFIRM_ACTION", []),
          confirmButtonColor: "#3085d6",

          showCancelButton: true,
          cancelButtonText: this.getText("CANCEL_ACTION", []),
          cancelButtonColor: "#d33",
          showCloseButton: false,
          focusConfirm: true,
          toast: false,
          timer: undefined,
          timerProgressBar: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: true,
          input: undefined,
          inputLabel: "",
          inputPlaceholder: "",
          inputAttributes: {},
          preConfirm: null,
        };

        for (var k in options) {
          if (opts.hasOwnProperty(k)) {
            options[k] = opts[k];
          }
        }

        Swal.fire({ ...options }).then(function (result) {
          if (result.isConfirmed) {
            if (opts.confirmCallbackFn !== undefined) {
              try {
                opts.confirmCallbackFn();
              } catch (e) {}
            }
          }
          if (result.isCancelled) {
            if (opts.cancelCallbackFn !== undefined) {
              try {
                opts.cancelCallbackFn();
              } catch (e) {}
            }
          }
        });
      },
      /**
       * Adds a history entry in the FLP page history
       * @public
       * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
       * @param {boolean} bReset If true resets the history before the new entry is added
       */
      addHistoryEntry: (function () {
        var aHistoryEntries = [];

        return function (oEntry, bReset) {
          if (bReset) {
            aHistoryEntries = [];
          }

          var bInHistory = aHistoryEntries.some(function (entry) {
            return entry.intent === oEntry.intent;
          });

          if (!bInHistory) {
            aHistoryEntries.push(oEntry);
            this.getOwnerComponent()
              .getService("ShellUIService")
              .then(function (oService) {
                oService.setHierarchy(aHistoryEntries);
              });
          }
        };
      })(),
    });
  }
);
