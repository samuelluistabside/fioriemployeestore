/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "employeestore/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("employeestore.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                var UserData = new sap.ui.model.json.JSONModel();
                var ProductsData = new sap.ui.model.json.JSONModel("model/Products.json");


                //var oRootPath = jQuery.sap.getModulePath("./"); // your resource root
                var oImageModel = new sap.ui.model.json.JSONModel("img");

                //this._sPNGpath = $.sap.getModulePath("hcm.myleaverequest.ESSLeaveReqExt", "/img");
                        
                this.setModel(oImageModel, "imageModel2");


                var sPath = sap.ui.require.toUrl("img/santa_teresa_1796.png");
                var oModelimage = new sap.ui.model.json.JSONModel({ imagePath: sPath });
                this.setModel(oModelimage, "imagemodel");
                
              
                
                UserData.loadData("model/UserData.json");
                this.setModel(UserData, "UserData");
                this.setModel(ProductsData, "ProductsData");
      
              
                

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);