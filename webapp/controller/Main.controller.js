sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "./BaseController",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel,UIComponent,BaseController) {
        "use strict";

        return BaseController.extend("employeestore.controller.Main", {
            onInit: function () {

                
                var ProductsData = new sap.ui.model.json.JSONModel("../model/Products.json");
			    this.getView().setModel(ProductsData,"ProductsData");

                var UserData = new sap.ui.model.json.JSONModel();

                var oModel = this.getView().getModel()
                
                try {
                    var oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
                    //console.log("current user: ","'",oUser.trim(),"'")
          
                  } catch (error) {
          
                    var oUser = "Default User";
                    //console.log("current user: ","'",oUser.trim(),"'")
                    
                  }

                var TitleCredits = this.getView().byId("_IDGenTitle1")
               
                var oModel2 = new sap.ui.model.json.JSONModel();
                UserData.attachRequestFailed(function(oEvent) {
                    var oParams = oEvent.getParameters();
                    var sMessage = oParams.response.statusText;
                    console.log("Error: " + sMessage);
                });
                UserData.loadData("../model/UserData.json");

                UserData.attachRequestCompleted(function() {
                    

                    var aUsers = UserData.getProperty("/User_Data");
                    for (var i = 0; i < aUsers.length; i++) {
                        if (aUsers[i].name === oUser) {
                            var fCredits = aUsers[i].credits;
                            break;
                        }
                    }

                    TitleCredits.setText("Credits: " + fCredits )



                });


                // Display the credit.
              

                // Create a filter.
                var filter = sap.ui.model.Filter("name", sap.ui.model.FilterOperator.EQ, oUser)
                


            },

            
            
  


            /**
		 * Navigate to the generic cart view
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");

			this._setLayout(bPressed ? "One" : "Two");
			this.getRouter().navTo(bPressed ? "Cart" : "Main");
		},
        
            formatter: {
                formatAvailability: function(number_available) {
                    return number_available ? "Available " : "Not Available";
                },
                formatAvailabilitycredit: function(credit_available) {
                    return credit_available ? "Credit Redemption " : "Cash Payment";
                }, 
            }
        });
    });
