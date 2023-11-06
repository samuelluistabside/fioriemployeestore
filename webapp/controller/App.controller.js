sap.ui.define(
    [
        "./BaseController",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "../model/LocalStorageModel",
    ],
    function(BaseController,JSONModel,LocalStorageModel) {
      "use strict";
  
      return BaseController.extend("employeestore.controller.App", {
        onInit: function() {

          

          var oViewModel,
          fnSetAppNotBusy,
				  iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

          oViewModel = new sap.ui.model.json.JSONModel({
            busy : false,
            delay : 0,
            layout : "OneColumn",
            smallScreenMode : true
        });

        

        
        //create and set cart model
        var oCartModel = new LocalStorageModel("SHOPPING_CART", {
          cartEntries: {},
          savedForLaterEntries: {}
        });
        this.setModel(oCartModel, "cartProducts");

        this.setModel(oViewModel, "appView");
        //this._setLayout("One");

        fnSetAppNotBusy = function() {
          oViewModel.setProperty("/busy", false);
          oViewModel.setProperty("/delay", iOriginalBusyDelay);
        };
  
        // since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
        //this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
        //this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);
  
        // apply content density mode to root view
        //this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }

        
      });
    }
  );
  