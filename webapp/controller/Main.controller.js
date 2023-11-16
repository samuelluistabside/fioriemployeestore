sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "./BaseController",
    "../model/cart",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel,UIComponent,BaseController,cart) {
        "use strict";

        return BaseController.extend("employeestore.controller.Main", {
            onInit: function () {

              
                
                var ProductsData = new sap.ui.model.json.JSONModel("../model/Products.json");
			    this.getView().setModel(ProductsData,"ProductsData");

               
                
                var oModel = this.getView().getModel()
                
              
               
                var oModel2 = new sap.ui.model.json.JSONModel();

                /*
                var UserData = new sap.ui.model.json.JSONModel();
                UserData.attachRequestFailed(function(oEvent) {
                    var oParams = oEvent.getParameters();
                    var sMessage = oParams.response.statusText;
                    console.log("Error: " + sMessage);
                });
                UserData.loadData("../model/UserData.json");

                */
           


               

                

                 //TitleCredits.setText("Creditos: " + fCredits + " USD" )
                // Display the credit.
              

               
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.attachRouteMatched(this.handleRouteMatched, this);


            },

            handleRouteMatched : function (evt) {
                //Check whether is the detail page is matched.

                try {
                    var oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
                    //console.log("current user: ","'",oUser.trim(),"'")
          
                  } catch (error) {
          
                    var oUser = "Default User";
                    //console.log("current user: ","'",oUser.trim(),"'")
                    
                  }

                var TitleCredits = this.getView().byId("_IDGenTitle1")
                    
                var UserData = this.getOwnerComponent().getModel("UserData")
           
              
                    

                var aUsers = UserData.getProperty("/User_Data");
                for (var i = 0; i < aUsers.length; i++) {
                    if (aUsers[i].name === oUser) {
                        var fCredits = aUsers[i].credits;
                        break;
                    }
                }

                TitleCredits.setText("Creditos: " + fCredits + " USD" )

                //You code here to run every time when your detail page is called.
            },
        


            /**
		 * Navigate to the generic cart view
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");

			this._setLayout(bPressed ? "One" : "Two");
			this.getRouter().navTo(bPressed ? "RouteMain" : "Cart");
		},

        /**
		 * Event handler to determine which button was clicked
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
        
        
		onAddToCart: function (oEvent) {
            
			var oResourceBundle = this.getModel("i18n").getResourceBundle();
            
			var oProduct = oEvent.getSource().getBindingContext("ProductsData").getObject();
            

			var oCartModel = this.getModel("cartProducts");
 
			cart.addToCart(oResourceBundle, oProduct, oCartModel);

            //que pasa si lo dejo en el carrito y nunca compro>? que no me deje agregar mas al carrito deberia ser solo local, hasta q se compre
            oProduct.number_available = oProduct.number_available - 1;
            var oModel = this.getView().getModel("ProductsData"); // Assuming "ProductsData" is the model name
            oModel.setProperty(oEvent.getSource().getBindingContext("ProductsData").getPath(), oProduct);
		},
            
       

        
            formatter: {
                formatAvailability: function(number_available) {
                    return number_available ? "Disponible" : "No Disponible";
                },
                formatAvailabilitycredit: function(credit_available) {
                    return credit_available ? "Canjeo de Creditos " : "Pago en USD";
                }, 
            }
        });
    });
