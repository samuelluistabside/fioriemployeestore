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
            //var userdatajsonurl = sap.ui.require.toUrl("employeestore/model/UserData.json") 

            //var UserData = new sap.ui.model.json.JSONModel(userdatajsonurl);
            var UserData = this.getModel("UsersModel");
            var producstjsonurl = sap.ui.require.toUrl("employeestore/model/Products.json")  
            //var imgurl = sap.ui.require.toUrl("employeestore/img")  
            var ProductsData = new sap.ui.model.json.JSONModel(producstjsonurl);

            var paymentjsonurl = sap.ui.require.toUrl("employeestore/model/PaymentMethod.json");  
            var PaymentData = new sap.ui.model.json.JSONModel(paymentjsonurl);

            var oRootPath = sap.ui.require.toUrl("employeestore/img")   // your resource root
    
            var oImageModel = new sap.ui.model.json.JSONModel({
                path : oRootPath,
            });
            
            var Ordersjsonurl = sap.ui.require.toUrl("employeestore/model/Orders.json");  
            var OrdersData = new sap.ui.model.json.JSONModel(Ordersjsonurl);

            var paymentProfilejsonurl = sap.ui.require.toUrl("employeestore/model/PaymentProfiles2.json");  
            var PaymentProfileData = new sap.ui.model.json.JSONModel(paymentProfilejsonurl);

            var paymentCourtjsonurl = sap.ui.require.toUrl("employeestore/model/PaymentCourt.json");  
            var PaymentCourtData = new sap.ui.model.json.JSONModel(paymentCourtjsonurl);

            var CourtTypejsonurl = sap.ui.require.toUrl("employeestore/model/CourtType.json");  
            var CourtTypeData = new sap.ui.model.json.JSONModel(CourtTypejsonurl);

            this.setModel(oImageModel, "imageModel");
            
  
          
            

            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            this.setModel(UserData, "UserData");
          
            
            
            //UserData.loadData("employeestore/model/UserData.json");
          
            this.setModel(ProductsData, "ProductsData");
            this.setModel(PaymentData, "PaymentData");
            this.setModel(OrdersData, "OrdersData");
            this.setModel(PaymentProfileData, "PaymentProfileData");
            this.setModel(PaymentCourtData, "PaymentCourtData");
            this.setModel(CourtTypeData, "CourtTypeData");

        }
    });
}
);