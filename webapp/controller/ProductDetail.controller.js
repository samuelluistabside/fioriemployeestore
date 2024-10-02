sap.ui.define([
    'sap/base/util/deepExtend',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (deepExtend, Controller, JSONModel) {
    "use strict";

    return Controller.extend("employeestore.controller.ProductDetail", {

        onInit: function () {

            var sProductId = this.getProductIdFromParams();
            var sOrderId = this.getOrderIdFromParams();

            // Cargar el modelo de órdenes
            this.ProductsData = this.getOwnerComponent().getModel("ProductsData");
            this.getView().setModel(this.ProductsData, "ProductsData");

            this.OrdersData = this.getOwnerComponent().getModel("OrdersData");
            this.getView().setModel(this.OrdersData, "OrdersData");

            // Configurar el modelo para la orden seleccionada
            this.oSelectedProductModel = new JSONModel();
            this.getView().setModel(this.oSelectedProductModel, "SelectedProduct");
            this.selectOrderById(sProductId);

            // Seleccionar producto de la orden
            this.oSelectedProductOrderModel = new JSONModel();
            this.getView().setModel(this.oSelectedProductModel, "SelectedOrderProduct");
            this.selectOrderProductById(sOrderId,sProductId);

            var ImageData = this.getOwnerComponent().getModel("imagemodel");
            this.getView().setModel(ImageData, "imagemodel");

            // //Cargar Perfiles de Pagos
            // var ProfilePaymentData = this.getOwnerComponent().getModel("PaymentProfileData");
            // this.getView().setModel(ProfilePaymentData);

            var ProfilePaymentData = this.getOwnerComponent().getModel("PaymentProfileData");
            this.getView().setModel(ProfilePaymentData, "PaymentProfileData"); 
            // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/countriesExtendedCollection.json"));
			// this.getView().setModel(oModel);

            this.oSelectedPaymentProfileModel = new JSONModel();
            this.getView().setModel(this.oSelectedPaymentProfileModel, "SelectedPaymentProfile");

            this.oSelectedProduct = this.getView().getModel("SelectedOrderProduct").getProperty("/"); // Obtén el producto seleccionado
            if (this.oSelectedProduct && this.oSelectedProduct.payment_profile) {
                var sPaymentProfileId = this.oSelectedProduct.payment_profile; // Obtén el ID del perfil de pago
                // Llamar a la función selectPaymentProfileById con el ID del perfil de pago
                this.selectPaymentProfileById(sPaymentProfileId);
            } else {
                console.error("No se pudo obtener el perfil de pago del producto seleccionado");
            }

            var oViewModel = new JSONModel({
                editable: false
            });
            this.getView().setModel(oViewModel, "viewModel");
        },


        selectPaymentProfileById: function ( sPaymentProfileId) {
            var aPaymentProfiles = this.getView().getModel("PaymentProfileData").getProperty("/PaymentProfile");
            
            // Buscar la Perfil de Pago por sPaymentProfileId
            var selectedPaymentProfile = aPaymentProfiles.find(paymentProfile => paymentProfile.ID === sPaymentProfileId);
            
            
            if (selectedPaymentProfile) {
                this.getView().getModel("SelectedPaymentProfile").setData(selectedPaymentProfile);
            } else {
                if (this.oViewModel = 'create') {
                    var oEmptyModel = new sap.ui.model.json.JSONModel({
                        ID: "",
                        paymentWCredits: false,
                        paymentWMoney: false,
                        salesFrequency: "",
                        maxQuantity: 0,
                        courtDate: null
                    });
                
                    // Asignar el modelo vacío a la vista
                    this.getView().setModel(oEmptyModel, "SelectedPaymentProfile");
                } else {
                    sap.m.MessageToast.show("Product not found");
                }
            }
        },

        handleLoadItems: function(oControlEvent) {
			oControlEvent.getSource().getBinding("items").resume();
		},

        // onExit: function() {
        //     this.getView().destroyContent();
        // },


        // onEdit: function() {
        //     var oViewModel = this.getView().getModel("viewModel");
        //     oViewModel.setProperty("/editable", true);
        //     this.aProductCollection = JSON.parse(JSON.stringify(this.oSelectedOrderModel.getProperty("/Products")));
        //     this.byId("_editButton").setVisible(false);
        //     this.byId("_saveButton").setVisible(true);
        //     this.byId("_cancelButton").setVisible(true);
        //     this.byId("QuantityInput").setEditable(true);
        //     // this.rebindTable("SelectedOrder>/Products");
        // },

        // onCancel: function() {
        //     var oViewModel = this.getView().getModel("viewModel");
        //     oViewModel.setProperty("/editable", false);
		// 	this.byId("_cancelButton").setVisible(false);
		// 	this.byId("_saveButton").setVisible(false);
		// 	this.byId("_editButton").setVisible(true);
		// 	this.oSelectedOrderModel.setProperty("/Products", this.aProductCollection);
		// },

        // onSave: function() {
        //     var oViewModel = this.getView().getModel("viewModel");
        //     oViewModel.setProperty("/editable", false);
        
        //     // Ocultar los botones
        //     this.byId("_cancelButton").setVisible(false);
        //     this.byId("_saveButton").setVisible(false);
        //     this.byId("_editButton").setVisible(true);
        
        //     // Obtener el ID de la orden actual
        //     var sOrderId = this.getView().getModel("SelectedOrder").getProperty("/OrderId");
        
        //     // Encontrar el índice del pedido en OrdersData
        //     var aOrders = this.OrdersData.getProperty("/Orders");
        //     var iOrderIndex = aOrders.findIndex(function(order) {
        //         return order.OrderId === sOrderId;
        //     });
        
        //     if (iOrderIndex !== -1) {
        //         // Actualizar el pedido en OrdersData con los datos de SelectedOrder
        //         this.OrdersData.setProperty("/Orders/" + iOrderIndex, this.oSelectedOrderModel.getData());
        //         sap.m.MessageToast.show("Order saved successfully.");
        //     } else {
        //         sap.m.MessageToast.show("Order not found.");
        //     }
        // },
        getProductIdFromParams: function () {
            return "P001"; // Cambiar a la lógica para obtener el parámetro real
        },

        getOrderIdFromParams: function () {
            return "50000083"; // Cambiar a la lógica para obtener el parámetro real
        },

        selectOrderById: function (sProductId) {
            var aProducts = this.ProductsData.getProperty("/Products");
            var aProduct = aProducts.find(function(order) {
                return order.id === sProductId;
            });

            if (aProduct) {
                this.getView().getModel("SelectedProduct").setData(aProduct);
            } else {
                sap.m.MessageToast.show("Order not found");
            }
        },
        navToPaymentProfile:function(){
            if (this.oSelectedProduct.payment_profile) {
                this.getOwnerComponent().getRouter().navTo("PaymentProfileDetail", {
                    PaymentProfileId: this.oSelectedProduct.payment_profile,
                    mode: 'update'
                });
            } else {
                sap.m.MessageToast.show("Product ID not found");
            }
        },
        selectOrderProductById: function (sOrderId, sProductId) {
            var aOrders = this.OrdersData.getProperty("/Orders");
            var selectedProduct = null;
        
            // Buscar la orden por OrderId
            var selectedOrder = aOrders.find(order => order.OrderId === sOrderId);
            
            if (selectedOrder && selectedOrder.Products) {
                // Buscar el producto por ProductId dentro de la orden encontrada
                selectedProduct = selectedOrder.Products.find(product => product.id === sProductId);
            }
            if (selectedProduct) {
                this.getView().getModel("SelectedOrderProduct").setData(selectedProduct);
            } else {
                sap.m.MessageToast.show("Product not found");
            }
        }
    });
});
