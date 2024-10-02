sap.ui.define([
    'sap/base/util/deepExtend',
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/paymentProfile",
    "sap/ui/Device",
], function (deepExtend, Controller, JSONModel,paymentProfile,Device) {
    "use strict";

    return Controller.extend("employeestore.controller.PaymentProfileDetail", {

        

        onInit: function () {

            var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("PaymentProfileDetail").attachMatched(this._onRouteMatched, this);

            
        },

        loadData: function(){
            // Cargar el modelo de órdenes
            this.PaymentProfilesData = this.getOwnerComponent().getModel("PaymentProfileData");
            this.getView().setModel(this.PaymentProfilesData, "PaymentProfileData");

            // Configurar el modelo para la orden seleccionada
            this.oSelectedPaymentProfileModel = new JSONModel();
            this.getView().setModel(this.oSelectedPaymentProfileModel, "SelectedPaymentProfile");

            
            this.selectPaymentProfileById(this.sPaymentProfileId);

            var CourtTypeData = this.getOwnerComponent().getModel("CourtTypeData");
            this.getView().setModel(CourtTypeData,"CourtTypeData");

            var PaymentProfileCourtTypesData = this.oSelectedPaymentProfileModel.getProperty("/CourtType")
            this.getView().setModel(PaymentProfileCourtTypesData,"PaymentProfileCourtTypesData");

            this.oViewModel = new JSONModel({
                editable: false,
                applyChangesRN: false,
                mode: this.sMode
            });
            
            if (this.sMode == 'create') {
                this.oViewModel.setProperty("/editable", true);
            }
            
            this.getView().setModel(this.oViewModel, "viewModel");

            var oCfgModel = new JSONModel({});
			
			this.getView().setModel(oCfgModel, "cfg");
			this._toggleCfgModel();


        },

        // onExit: function() {
        //     this.getView().destroyContent();
        // },


        onEditOrDoneButtonPress: function () {
			this._toggleCfgModel();
		},

		_toggleCfgModel: function () {
			var oCfgModel = this.getView().getModel("cfg");
			var oData = oCfgModel.getData();
			var bDataNoSetYet = !oData.hasOwnProperty("inDelete");
			var bInDelete = (bDataNoSetYet ? true : oData.inDelete);
			var sPhoneMode = (Device.system.phone ? "None" : "SingleSelectMaster");
			var sPhoneType = (Device.system.phone ? "Active" : "Inactive");

			oCfgModel.setData({
				inDelete: !bInDelete,
				notInDelete: bInDelete,
				listMode: (bInDelete ? sPhoneMode : "Delete"),
				listItemType: (bInDelete ? sPhoneType : "Inactive"),
				pageTitle: (bInDelete ? "Lista de cortes involucrados" : "Lista de cortes involucrados")
			});
		},

        onEdit: function() {
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/editable", true);
            this._toggleCfgModel();

            // this.rebindTable("SelectedOrder>/Products");
        },

        onCancel: function() {
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/editable", false);

            sap.m.MessageToast.show("No se guardaron los cambios" );
            // this.rebindTable("SelectedOrder>/Products");
        },

        onSave: function() {
            if (this.onValidateForm()) {
                var oViewModel = this.getView().getModel("viewModel");
                oViewModel.setProperty("/editable", false);
                sap.m.MessageToast.show("Se guardaron los cambios" );
            }
            


            // this.rebindTable("SelectedOrder>/Products");
        },

        onCreateForm: function() {
            if (this.onValidateForm()) {
                
                // Obtener el modelo SelectedPaymentProfile
                var oSelectedPaymentProfile = this.getView().getModel("SelectedPaymentProfile");
                
                // Crear el nuevo perfil de pago (esto sería tu nueva entrada)
                var oNewPaymentProfile = {
                    ID: oSelectedPaymentProfile.getProperty("/ID"),
                    name: oSelectedPaymentProfile.getProperty("/name"),
                    description: oSelectedPaymentProfile.getProperty("/description"),
                    paymentWCredits: oSelectedPaymentProfile.getProperty("/paymentWCredits"),
                    paymentWMoney: oSelectedPaymentProfile.getProperty("/paymentWMoney"),
                    salesFrequency: oSelectedPaymentProfile.getProperty("/salesFrequency"),
                    maxQuantity: oSelectedPaymentProfile.getProperty("/maxQuantity"),
                    courtDate: oSelectedPaymentProfile.getProperty("/courtDate")
                };

                var oModel = this.getView().getModel("SelectedPaymentProfile");

                // Llamar a la función addPaymentProfile del archivo paymentProfile.js
                paymentProfile.addPaymentProfile(null, oNewPaymentProfile, this.PaymentProfilesData);

                var oViewModel = this.getView().getModel("viewModel");
                oViewModel.setProperty("/editable", false);
                oViewModel.setProperty("/mode", 'update');


                
            }
        },
    
        onValidateForm: function() {
            var oView = this.getView();
            var oModel = oView.getModel("SelectedPaymentProfile");
        
            // Obtener los valores del modelo
            var bID = oModel.getProperty("/ID");
            var bPaymentWCredits = oModel.getProperty("/paymentWCredits");
            var bPaymentWMoney = oModel.getProperty("/paymentWMoney");
            var sSalesFrequency = oModel.getProperty("/salesFrequency");
            var iMaxQuantity = oModel.getProperty("/maxQuantity");
            var sCourtDate = oModel.getProperty("/courtDate");
        
            var bValid = true;
            var aMessages = [];
        
            // Validar que el ID tenga más de 5 caracteres
            if (!bID || bID.length <= 5) {
                bValid = false;
                aMessages.push("El ID debe tener más de 5 caracteres.");
                return false;
            }

            // Validar que no exista otro registro con el mismo ID
            var aPaymentProfiles = this.PaymentProfilesData.getProperty("/PaymentProfile");
            var duplicateProfile = aPaymentProfiles.find(function(profile) {
                return profile.ID === bID;
            });

            if (duplicateProfile) {
                bValid = false;
                aMessages.push("Ya existe un perfil de pago con el mismo ID.");
            }

            // Validar que al menos uno de los checkbox esté seleccionado
            if (!bPaymentWCredits && !bPaymentWMoney) {
                bValid = false;
                aMessages.push("Debe seleccionar al menos una opción de pago (Crédito o Métodos de Pago).");
            }
        
            // Validar que se haya seleccionado una frecuencia
            if (!sSalesFrequency) {
                bValid = false;
                aMessages.push("Debe seleccionar una frecuencia.");
            }
        
            // Validar que la cantidad máxima por usuario sea mayor o igual a 0
            if (iMaxQuantity < 0 || iMaxQuantity === null || iMaxQuantity === undefined) {
                bValid = false;
                aMessages.push("La cantidad máxima por usuario debe ser mayor o igual a 0.");
            }
        
            // Validar que la fecha de corte esté llena
            if (!sCourtDate) {
                bValid = false;
                aMessages.push("Debe ingresar una fecha de corte.");
            }
        
            // Mostrar mensajes si hay errores
            if (!bValid) {
                sap.m.MessageBox.error(aMessages.join("\n"));
                return false;
            } else {
                sap.m.MessageToast.show("Validación exitosa.");
                // Aquí puedes continuar con la lógica de guardar o procesar los datos si son válidos
                return true;
            }
    
            
    
        },

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

        _onRouteMatched : function (oEvent) {
            var oArgs, oView;
    
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();
    
            this.sPaymentProfileId = oArgs.PaymentProfileId;
            this.sMode = oArgs.mode;
            
            this.loadData();
        },

        // getPaymentProfileIdFromParams: function () {
        //     var oRouter = this.getOwnerComponent().getRouter();
        //     var oRoute = oRouter.getRoute("PaymentProfileDetail"); // Asegúrate de que el nombre de la ruta es correcto
        //     var sPaymentProfileId = null;

        //     if (oRoute) {
        //         oRoute.attachPatternMatched(function (oEvent) {
        //             sPaymentProfileId = oEvent.getParameter("arguments").PaymentProfileId;
        //         }, this);
        //     }

        //     return sPaymentProfileId;
        // },

        selectPaymentProfileById: function ( sPaymentProfileId) {
            var aPaymentProfiles = this.PaymentProfilesData.getProperty("/PaymentProfile");
            
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
        }
    });
});
