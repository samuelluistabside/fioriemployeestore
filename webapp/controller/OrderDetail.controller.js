sap.ui.define([
    'sap/base/util/deepExtend',
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (deepExtend,BaseController, Controller, JSONModel) {
    "use strict";

    return Controller.extend("employeestore.controller.OrderDetail", {

        onInit: function () {
            

            // this.sOrderId = this.getOrderIdFromParams();
            var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("OrderDetail").attachMatched(this._onRouteMatched, this);

            
        },

        loadData: function(){
             // Cargar el modelo de órdenes
             this.OrdersData = this.getOwnerComponent().getModel("OrdersData");
             this.getView().setModel(this.OrdersData, "OrdersData");
 
             // Configurar el modelo para la orden seleccionada
             this.oSelectedOrderModel = new JSONModel();
             this.getView().setModel(this.oSelectedOrderModel, "SelectedOrder");
             this.selectOrderById(this.sOrderId);
 
             var ImageData = this.getOwnerComponent().getModel("imagemodel");
             this.getView().setModel(ImageData, "imagemodel");
 
             var oViewModel = new JSONModel({
                 editable: false
             });
             this.getView().setModel(oViewModel, "viewModel");
        },

        onExit: function() {
            this.getView().destroyContent();
        },

        rebindTable: function(sPath) {
            this.oTable.bindItems({
                path: sPath,
                templateShareable: true
            });
        },

        onEdit: function() {
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/editable", true);
            this.aProductCollection = JSON.parse(JSON.stringify(this.oSelectedOrderModel.getProperty("/Products")));
            this.byId("_editButton").setVisible(false);
            this.byId("_saveButton").setVisible(true);
            this.byId("_cancelButton").setVisible(true);
            this.byId("QuantityInput").setEditable(true);
            // this.rebindTable("SelectedOrder>/Products");
        },

        onCancel: function() {
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/editable", false);
			this.byId("_cancelButton").setVisible(false);
			this.byId("_saveButton").setVisible(false);
			this.byId("_editButton").setVisible(true);
			this.oSelectedOrderModel.setProperty("/Products", this.aProductCollection);
		},

        onSave: function() {
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/editable", false);
        
            // Ocultar los botones
            this.byId("_cancelButton").setVisible(false);
            this.byId("_saveButton").setVisible(false);
            this.byId("_editButton").setVisible(true);
        
            // Obtener el ID de la orden actual
            // var sOrderId = this.getView().getModel("SelectedOrder").getProperty("/OrderId");
        
            // Encontrar el índice del pedido en OrdersData
            var aOrders = this.OrdersData.getProperty("/Orders");
            var iOrderIndex = aOrders.findIndex(function(order) {
                return order.OrderId === this.sOrderId;
            });
        
            if (iOrderIndex !== -1) {
                // Actualizar el pedido en OrdersData con los datos de SelectedOrder
                this.OrdersData.setProperty("/Orders/" + iOrderIndex, this.oSelectedOrderModel.getData());
                sap.m.MessageToast.show("Order saved successfully.");
            } else {
                sap.m.MessageToast.show("Order not found.");
            }
        },
        getOrderIdFromParams: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            var oRoute = oRouter.getRoute("OrderDetail"); // Asegúrate de que el nombre de la ruta es correcto
            var sOrderId = null;

            if (oRoute) {
                oRoute.attachPatternMatched(function (oEvent) {
                    sOrderId = oEvent.getParameter("arguments").OrderId;
                }, this);
            }

            return sOrderId;
        },

        _onRouteMatched : function (oEvent) {
			var oArgs, oView;

			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

            this.sOrderId = oArgs.orderId;
            this.sMode = oArgs.mode;

			this.loadData();
		},

        onIconPress: function(oEvent) {
            // // Obtener el ProductId desde customData
            // Obtener el control que disparó el evento
            var oSource = oEvent.getSource();

            // Obtener los datos personalizados
            var aCustomData = oSource.getCustomData();
            var sProductId = "";

            // Buscar la clave "ProductId"
            aCustomData.forEach(function(oData) {
                if (oData.getKey() === "ProductId") {
                    sProductId = oData.getValue();
                }
            });

            // Navegar a la vista de detalles del producto con el ProductId
            if (sProductId) {
                this.getOwnerComponent().getRouter().navTo("ProductDetail", {
                    ProductId: sProductId
                });
            } else {
                sap.m.MessageToast.show("Product ID not found");
            }

            this.byId("TablaProductos").focus();

        },

        selectOrderById: function (sOrderId) {
            var aOrders = this.OrdersData.getProperty("/Orders");
            var oOrder = aOrders.find(function(order) {
                return order.OrderId === sOrderId;
            });

            if (oOrder) {
                this.getView().getModel("SelectedOrder").setData(oOrder);
            } else {
                sap.m.MessageToast.show("Order not found");
            }
        },

        onPaymentButton: function (oEvent){
            // Navegar a la vista de checkout con la orden a cancelar
            if (this.sOrderId) {
                this.getOwnerComponent().getRouter().navTo("checkout", {
                    OrderId: this.sOrderId
                });
            } else {
                sap.m.MessageToast.show("Order ID not found");
            }

        }
    });
});
