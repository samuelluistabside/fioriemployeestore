sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("employeestore.controller.Main", {
            onInit: function () {

                var DataProducts = new sap.ui.model.json.JSONModel("../model/Products.json");
			    this.getView().setModel(DataProducts);
			    console.log(this.getView().getModel())

                

            },
            formatter: {
                formatAvailability: function(number_available) {
                    return number_available ? "Credit Redemption " : "Cash Payment";
                }
            }
        });
    });
