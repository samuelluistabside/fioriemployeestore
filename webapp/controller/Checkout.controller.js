sap.ui.define([
	"./BaseController",
	"../model/cart",
	"../model/EmailType",
	"../model/formatter",
	"sap/m/Link",
	"sap/m/MessageBox",
	"sap/m/MessageItem",
	"sap/m/MessagePopover",
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"../model/Orders",
], function (
	BaseController,
	cart,
	EmailType,
	formatter,
	Link,
	MessageBox,
	MessageItem,
	MessagePopover,
	Device,
	oCore,
	JSONModel,
	MessageToast,
	orderManager
) {
	"use strict";

	var paymentusd = false
	var SelectedPayment = null;
	return BaseController.extend("employeestore.controller.Checkout", {

		types : {
			email: new EmailType()
		},
		

		
		formatter: formatter,

		loadData:function (){



			var UserData = this.getOwnerComponent().getModel("UserData")
			console.log(UserData)

			var TitleCredits = this.getView().byId("TituloCredits")

			try {
				var oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
				//console.log("current user: ","'",oUser.trim(),"'")
	  
			  } catch (error) {
	  
				var oUser = "Default User";
				//console.log("current user: ","'",oUser.trim(),"'")
				

			  }
            
			  console.log(UserData.getProperty("/User_Data"))
			  

			  
				

			var aUsers = UserData.getProperty("/User_Data");
			for (var i = 0; i < aUsers.length; i++) {
				if (aUsers[i].name === oUser) {
					console.log(aUsers[i].name)
					var fCredits = aUsers[i].credits;
					break;
				}
			}

		
			TitleCredits.setText("Creditos: " + fCredits + " USD" )
			
			var oModel = new JSONModel(
				{
					SelectedPayment: "Credits",
					SelectedDeliveryMethod: "Standard Delivery",
					DifferentDeliveryAddress: false,
					CashOnDelivery: {
						FirstName: "",
						LastName: "",
						PhoneNumber: "",
						Email: ""
					},
					InvoiceAddress: {
						Address: "",
						City: "",
						ZipCode: "",
						Country: "",
						Note: ""
					},
					DeliveryAddress: {
						Address: "",
						Country: "",
						City: "",
						ZipCode: "",
						Note: ""
					},
					CreditCard: {
						Name: "",
						CardNumber: "",
						SecurityCode: "",
						Expire: ""
					}
				}),
				oReturnToShopButton = this.byId("ReturnButton");

			this.setModel(oModel);
			
			
			// previously selected entries in wizard
			this._oHistory = {
				prevPaymentSelect: null,
				prevDiffDeliverySelect: null
			};

			var PaymentData = this.getOwnerComponent().getModel("PaymentData")
			this.getView().setModel(PaymentData,"PaymentData")

			 



			// Assign the model object to the SAPUI5 core
			this.setModel(oCore.getMessageManager().getMessageModel(), "message");

			// switch to single column view for checout process
			this.getRouter().getRoute("checkout").attachMatched(function () {
				this._setLayout("One");
			}.bind(this));

			// set focus to the "Return to Shop" button each time the view is shown to avoid losing
			// the focus after changing the layout to one column
			this.getView().addEventDelegate({
				onAfterShow : function () {
					oReturnToShopButton.focus();
				}
			});


			var oDataBanks = {
				banks: [
					{ id: "0102", name: "Banco de Venezuela, S.A.C.A." },
					{ id: "0104", name: "Venezolano de Crédito" },
					{ id: "0105", name: "Mercantil" },
					{ id: "0108", name: "Provincial" },
					{ id: "0114", name: "Bancaribe" },
					{ id: "0115", name: "Exterior" },
					{ id: "0116", name: "Occidental de Descuento" },
					{ id: "0128", name: "Banco Caroní" },
					{ id: "0134", name: "Banesco" },
					{ id: "0138", name: "Banco Plaza" },
					{ id: "0137", name: "Banco Sofitasa" },
					{ id: "0151", name: "BFC Banco Fondo Común" },
					{ id: "0156", name: "100% Banco" },
					{ id: "0157", name: "Del Sur" },
					{ id: "0163", name: "Banco del Tesoro" },
					{ id: "0166", name: "Banco Agrícola de Venezuela" }
				]
			};
			
			var oModelBanks = new sap.ui.model.json.JSONModel(oDataBanks);
			this.getView().setModel(oModelBanks, "bankModel");

			var oDataExt = {
				ext: [
					{ id: "0412", name: "0412" },
					{ id: "0414", name: "0414" },
					{ id: "0424", name: "0424" },
					{ id: "0426", name: "0426" }
					
				]
			};
			
			var oModelExt = new sap.ui.model.json.JSONModel(oDataExt);
			this.getView().setModel(oModelExt, "ExtModel");

			this.oCartModel;
			if (this.sOrderId == 'cart') {
				this.oCartModel = this.getModel("cartProducts");
			} else {
				this.fillCartWithOrderProducts()
			}

			this.getView().setModel(this.oCartModel, "OrderProductsData");

		},

		_onRouteMatched : function (oEvent) {
			var oArgs, oView;

			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

            this.sOrderId = oArgs.OrderId;

			this.loadData();
		},

		FillOrderProductData: function () {

		},

		onInit: function () {

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("checkout").attachMatched(this._onRouteMatched, this);
			// this.getView().byId("depositreferencelabel").setVisible(paymentusd);
			// this.getView().byId("depositreference").setVisible(paymentusd);

			// var UserData = this.getOwnerComponent().getModel("UserData")
			// console.log(UserData)

			// var TitleCredits = this.getView().byId("_IDGenTitle1")

			// try {
			// 	var oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
			// 	//console.log("current user: ","'",oUser.trim(),"'")
	  
			//   } catch (error) {
	  
			// 	var oUser = "Default User";
			// 	//console.log("current user: ","'",oUser.trim(),"'")
				

			//   }
            
			//   console.log(UserData.getProperty("/User_Data"))
			  

			  
				

			// var aUsers = UserData.getProperty("/User_Data");
			// for (var i = 0; i < aUsers.length; i++) {
			// 	if (aUsers[i].name === oUser) {
			// 		console.log(aUsers[i].name)
			// 		var fCredits = aUsers[i].credits;
			// 		break;
			// 	}
			// }

		
			// TitleCredits.setText("Creditos: " + fCredits + " USD" )
			
			// var oModel = new JSONModel(
			// 	{
			// 		SelectedPayment: "Credits",
			// 		SelectedDeliveryMethod: "Standard Delivery",
			// 		DifferentDeliveryAddress: false,
			// 		CashOnDelivery: {
			// 			FirstName: "",
			// 			LastName: "",
			// 			PhoneNumber: "",
			// 			Email: ""
			// 		},
			// 		InvoiceAddress: {
			// 			Address: "",
			// 			City: "",
			// 			ZipCode: "",
			// 			Country: "",
			// 			Note: ""
			// 		},
			// 		DeliveryAddress: {
			// 			Address: "",
			// 			Country: "",
			// 			City: "",
			// 			ZipCode: "",
			// 			Note: ""
			// 		},
			// 		CreditCard: {
			// 			Name: "",
			// 			CardNumber: "",
			// 			SecurityCode: "",
			// 			Expire: ""
			// 		}
			// 	}),
			// 	oReturnToShopButton = this.byId("returnToShopButton");

			// this.setModel(oModel);
			
			
			// // previously selected entries in wizard
			// this._oHistory = {
			// 	prevPaymentSelect: null,
			// 	prevDiffDeliverySelect: null
			// };

			// var PaymentData = this.getOwnerComponent().getModel("PaymentData")
			// this.getView().setModel(PaymentData,"PaymentData")

			// // Assign the model object to the SAPUI5 core
			// this.setModel(oCore.getMessageManager().getMessageModel(), "message");

			// // switch to single column view for checout process
			// this.getRouter().getRoute("checkout").attachMatched(function () {
			// 	this._setLayout("One");
			// }.bind(this));

			// // set focus to the "Return to Shop" button each time the view is shown to avoid losing
			// // the focus after changing the layout to one column
			// this.getView().addEventDelegate({
			// 	onAfterShow : function () {
			// 		oReturnToShopButton.focus();
			// 	}
			// });


			// var oDataBanks = {
			// 	banks: [
			// 		{ id: "0102", name: "Banco de Venezuela, S.A.C.A." },
			// 		{ id: "0104", name: "Venezolano de Crédito" },
			// 		{ id: "0105", name: "Mercantil" },
			// 		{ id: "0108", name: "Provincial" },
			// 		{ id: "0114", name: "Bancaribe" },
			// 		{ id: "0115", name: "Exterior" },
			// 		{ id: "0116", name: "Occidental de Descuento" },
			// 		{ id: "0128", name: "Banco Caroní" },
			// 		{ id: "0134", name: "Banesco" },
			// 		{ id: "0138", name: "Banco Plaza" },
			// 		{ id: "0137", name: "Banco Sofitasa" },
			// 		{ id: "0151", name: "BFC Banco Fondo Común" },
			// 		{ id: "0156", name: "100% Banco" },
			// 		{ id: "0157", name: "Del Sur" },
			// 		{ id: "0163", name: "Banco del Tesoro" },
			// 		{ id: "0166", name: "Banco Agrícola de Venezuela" }
			// 	]
			// };
			
			// var oModelBanks = new sap.ui.model.json.JSONModel(oDataBanks);
			// this.getView().setModel(oModelBanks, "bankModel");

			// var oDataExt = {
			// 	ext: [
			// 		{ id: "0412", name: "0412" },
			// 		{ id: "0414", name: "0414" },
			// 		{ id: "0424", name: "0424" },
			// 		{ id: "0426", name: "0426" }
					
			// 	]
			// };
			
			// var oModelExt = new sap.ui.model.json.JSONModel(oDataExt);
			// this.getView().setModel(oModelExt, "ExtModel");
		},

		/**
		 * Only validation on client side, does not involve a back-end server.
		 * @param {sap.ui.base.Event} oEvent Press event of the button to display the MessagePopover
		 */
		onShowMessagePopoverPress: function (oEvent) {
			var oButton = oEvent.getSource();

			var oLink = new Link({
				text: "Show more information",
				href: "http://sap.com",
				target: "_blank"
			});

			/**
			 * Gather information that will be visible on the MessagePopover
			 */
			var oMessageTemplate = new MessageItem({
				type: '{message>type}',
				title: '{message>message}',
				subtitle: '{message>additionalText}',
				link: oLink
			});

			if (!this.byId("errorMessagePopover")) {
				var oMessagePopover = new MessagePopover(this.createId("messagePopover"), {
					items: {
						path: 'message>/',
						template: oMessageTemplate
					},
					afterClose: function () {
						oMessagePopover.destroy();
					}
				});
				this._addDependent(oMessagePopover);
			}

			oMessagePopover.openBy(oButton);
		},

		onreferenceChange: function(oEvent){


			
			var textreference = this.getView().byId("depositreference").getValue();
			console.log(textreference.length)
			var oInput = oEvent.getSource();
			//console.log(oInput)
			if(textreference.length == 10){
				this.getView().byId("submitOrder").setEnabled(true);
			}else{
				this.getView().byId("submitOrder").setEnabled(false);
			}
		},

		//To be able to stub the addDependent function in unit test, we added it in a separate function
		_addDependent: function (oMessagePopover) {
			this.getView().addDependent(oMessagePopover);
		},

		/**
		 * Show the payment method according wit the user selection
		 */

		// onCompletePaymentSelection: function() {
			
		// 	var oElement = this.byId("paymentTypeStep");
		// 	var SelectedPaymentItem = this.getView().byId("PType2").getSelectedItem();
		// 	debugger;
		// 	// Verifica qué objeto se seleccionó y navega a un paso específico
		// 	var oWizard = this.byId("shoppingCartWizard"); // Reemplaza con el ID de tu Wizard
		// 	switch(SelectedPayment) {
		// 		case "Pago Móvil": 
		// 			oElement.setNextStep(this.byId("PagoMovilStep"));
		// 			break;
		// 		case "Tarjeta Debito Credito": 
		// 			oWizard.goToStep(this.byId("PagoMovilStep")); break;
		// 		default: 
		// 			MessageToast.show(oBundle.getText("Por favor seleccione un Método de pago")); 
		// 			oWizard.invalidateStep(this.byId("bankAccountStep")); // Invalida el paso para evitar que el usuario avance
		// 			break;
		// 	}
				
		// },
		onCompletePaymentSelection: function() {
			var oTree = this.getView().byId("PType2");
			var SelectedPaymentItem = oTree.getSelectedItem();
			var oWizard = this.byId("shoppingCartWizard");
			
			if (SelectedPaymentItem) {
				var oContext = SelectedPaymentItem.getBindingContext("PaymentData");
				var SelectedPayment = oContext.getProperty("text"); // Obteniendo el texto del método de pago seleccionado
		
				switch (SelectedPayment) {
					case "Pago Móvil":
						this.byId("bankAccountStep").setNextStep(this.byId("PagoMovilStep"));
						SelectedPayment = "Pago Movil";
						break;
					case "Tarjeta Debito Credito":
						this.byId("bankAccountStep").setNextStep(this.byId("TarjetaCreditoStep"));
						SelectedPayment = "Credit Card";
						break;
					default:
						sap.m.MessageToast.show("Por favor seleccione un Método de pago");
						oWizard.invalidateStep(this.byId("bankAccountStep")); // Invalida el paso para evitar que el usuario avance
						
						break;
				}
			} else {
				sap.m.MessageToast.show("Por favor seleccione un Método de pago");
				oWizard.invalidateStep(this.byId("bankAccountStep")); // Invalida el paso si no se ha seleccionado nada
			}
		},

		onCompletePagoMovil: function() {
			var oView = this.getView();
			var bIsValid = true;
			var oWizard = oView.byId("shoppingCartWizard");
			var textcreditsfinal = this.getView().byId("textcreditsfinal")

		
			// Validación de selección de banco
			var oBankSelect = oView.byId("InputBanks");
			var sSelectedBank = oBankSelect.getSelectedKey();
			if (!sSelectedBank) {
				bIsValid = false;
				oBankSelect.setValueState(sap.ui.core.ValueState.Error);
				oBankSelect.setValueStateText("Debe seleccionar un banco.");
			} else {
				oBankSelect.setValueState(sap.ui.core.ValueState.None);
			}
		
			// Validación del teléfono
			var oPhoneInput = oView.byId("inputTele");
			var sPhoneValue = oPhoneInput.getValue();
			var oPhoneRegex = /^[0-9]{7}$/; // Ajusta el regex según el formato esperado
			if (!oPhoneRegex.test(sPhoneValue)) {
				bIsValid = false;
				oPhoneInput.setValueState(sap.ui.core.ValueState.Error);
				oPhoneInput.setValueStateText("Debe ingresar un número telefónico válido.");
			} else {
				oPhoneInput.setValueState(sap.ui.core.ValueState.None);
			}
		
			// Validación de la cédula
			var oCedulaInput = oView.byId("inputCed");
			var sCedulaValue = oCedulaInput.getValue();
			var oCedulaRegex = /^[VJEG]-\d{8,9}$/; // Ajusta el regex según el formato esperado (e.g., V-12345678)
			if (!oCedulaRegex.test(sCedulaValue)) {
				bIsValid = false;
				oCedulaInput.setValueState(sap.ui.core.ValueState.Error);
				oCedulaInput.setValueStateText("Debe ingresar una cédula válida.");
			} else {
				oCedulaInput.setValueState(sap.ui.core.ValueState.None);
			}
		
			// Si todas las validaciones son exitosas
			if (bIsValid) {
				// oWizard.validateStep(this.byId("PagoMovilStep"));
				// this.getView().byId("submitOrder").setEnabled(true);
				textcreditsfinal.setText("Se confirmo el pago exitosamente" )
				this.getView().byId("submitOrder").setEnabled(true);
				this.byId("PagoMovilStep").setNextStep(this.byId("creditsfinal"));
				oWizard.validateStep(this.byId("PagoMovilStep"));				// Continúa al siguiente paso o completa el Wizard
			} else {
				sap.m.MessageToast.show("Por favor, complete todos los campos correctamente.");
				// Invalida el paso si hay algún error
				oWizard.invalidateStep(this.byId("PagoMovilStep"));
			}
		},

		onCompleteCreditCard: function() {
			var oView = this.getView();
			var bIsValid = true;
			var oWizard = oView.byId("shoppingCartWizard");
			var textcreditsfinal = this.getView().byId("textcreditsfinal")

		
			// // Validación de selección de banco
			// var oBankSelect = oView.byId("InputBanks");
			// var sSelectedBank = oBankSelect.getSelectedKey();
			// if (!sSelectedBank) {
			// 	bIsValid = false;
			// 	oBankSelect.setValueState(sap.ui.core.ValueState.Error);
			// 	oBankSelect.setValueStateText("Debe seleccionar un banco.");
			// } else {
			// 	oBankSelect.setValueState(sap.ui.core.ValueState.None);
			// }
		
			// // Validación del teléfono
			// var oPhoneInput = oView.byId("inputTele");
			// var sPhoneValue = oPhoneInput.getValue();
			// var oPhoneRegex = /^[0-9]{7}$/; // Ajusta el regex según el formato esperado
			// if (!oPhoneRegex.test(sPhoneValue)) {
			// 	bIsValid = false;
			// 	oPhoneInput.setValueState(sap.ui.core.ValueState.Error);
			// 	oPhoneInput.setValueStateText("Debe ingresar un número telefónico válido.");
			// } else {
			// 	oPhoneInput.setValueState(sap.ui.core.ValueState.None);
			// }
		
			// // Validación de la cédula
			// var oCedulaInput = oView.byId("inputCed");
			// var sCedulaValue = oCedulaInput.getValue();
			// var oCedulaRegex = /^[VJEG]-\d{8,9}$/; // Ajusta el regex según el formato esperado (e.g., V-12345678)
			// if (!oCedulaRegex.test(sCedulaValue)) {
			// 	bIsValid = false;
			// 	oCedulaInput.setValueState(sap.ui.core.ValueState.Error);
			// 	oCedulaInput.setValueStateText("Debe ingresar una cédula válida.");
			// } else {
			// 	oCedulaInput.setValueState(sap.ui.core.ValueState.None);
			// }
		
			// Si todas las validaciones son exitosas
			if (bIsValid) {
				// oWizard.validateStep(this.byId("PagoMovilStep"));
				// this.getView().byId("submitOrder").setEnabled(true);
				textcreditsfinal.setText("Se confirmo el pago exitosamente" )
				this.getView().byId("submitOrder").setEnabled(true);
				this.byId("TarjetaCreditoStep").setNextStep(this.byId("creditsfinal"));
				oWizard.validateStep(this.byId("TarjetaCreditoStep"));				// Continúa al siguiente paso o completa el Wizard
			} else {
				sap.m.MessageToast.show("Por favor, complete todos los campos correctamente.");
				// Invalida el paso si hay algún error
				oWizard.invalidateStep(this.byId("TarjetaCreditoStep"));
			}
		},

		onTreeSelectionChange: function (oEvent) {
			// Obtén el elemento seleccionado
			var oSelectedItem = oEvent.getParameter("listItem");
			var oContext = oSelectedItem.getBindingContext("PaymentData");
			var oSelectedData = oContext.getObject();
			SelectedPayment = oSelectedData.text;
			

			
		},

		fillCartWithOrderProducts: function(){
			// Buscar productos de la orden específica
			var oOrdersModel = this.getOwnerComponent().getModel("OrdersData");
			var aOrders = oOrdersModel.getProperty("/Orders");
			
			// Buscar la orden por el OrderId
			var oOrder = aOrders.find(function(order) {
				return order.OrderId === this.sOrderId;
			}.bind(this));
		
			if (oOrder) {
				var aProducts = oOrder.Products; // Los productos de la orden
				var oCartEntries = {};
		
				// Transformar los productos al formato de cartProducts
				aProducts.forEach(function(product) {
					oCartEntries[product.product_name] = {
						Quantity: product.Quantity,
						availability: product.availability,
						credit_available: true, // Condición para créditos
						description: product.description,
						factory: product.factory,
						id: product.id,
						image: product.image,
						manufacturer: product.manufacturer,
						number_available: 23, // Valor fijo, ajusta según sea necesario
						payment_profile: product.payment_profile,
						price: product.price,
						product_name: product.product_name,
						supplier: product.supplier,
						supplierPhone: product.supplierPhone,
						unit: "L" 
					};
				});
		
				// Actualizar el modelo cartProducts con los productos de la orden
				this.oCartModel = this.getModel("cartProducts");
				this.oCartModel.setProperty("/cartEntries", oCartEntries);
				this.oCartModel.refresh(true); // Refrescar el modelo para reflejar los cambios
			} else {
				console.error("No se encontró la orden con ID: " + this.sOrderId);
			}

		},

		/**
		 * Shows next WizardStep according to user selection
		 */
		goToPaymentStep: function () {
			var selectedKey = this.getModel().getProperty("/SelectedPayment");
			var oElement = this.byId("paymentTypeStep");
			

			var oWizard = this.byId("shoppingCartWizard");
			var oFirstStep = oWizard.getSteps()[0];
			
			var TitleCredits = this.getView().byId("_IDGenTitle1")
			
			var textcreditsfinal = this.getView().byId("textcreditsfinal")
			//Llenado de los productos del carrito
			var oCartModel;
			var oCartEntries;
			if (this.sOrderId == 'cart') {
				oCartModel = this.getModel("cartProducts");
				oCartEntries = oCartModel.getProperty("/cartEntries");
			} else {
				this.fillCartWithOrderProducts()
			}
			
			var allcredit = true
			var allcash = true
			var sumtotal = 0

			var totalproductquantity = 0
			var validationtext = this.getView().byId("validationtext")

			for(var key in oCartEntries) 
			{
				totalproductquantity = totalproductquantity + oCartEntries[key].Quantity
				sumtotal = sumtotal + (oCartEntries[key].price * oCartEntries[key].Quantity)
				if (oCartEntries[key].credit_available === false) {
					allcredit = false
					
					} else{
						allcash = false
					}

				}

			var creditsallow = true

			var UserData = this.getOwnerComponent().getModel("UserData")

			try {
				var oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
				//console.log("current user: ","'",oUser.trim(),"'")
		
				} catch (error) {
		
				var oUser = "Default User";
				//console.log("current user: ","'",oUser.trim(),"'")
				

				}

			var userindex = 0

		
			var maxpurchasedmonthallowed = 5

			var aUsers = UserData.getProperty("/User_Data");
			for (var i = 0; i < aUsers.length; i++) {
				if (aUsers[i].name === oUser) {
					userindex = i
					var fCredits = aUsers[i].credits;
					var purchasedthismonth =   aUsers[i].thismonthpurchased
					break;
				}
			}
		
			if(sumtotal > fCredits ){
				creditsallow = false
				console.log("la cantidad de creditos no es suficiente")
			}

			switch (selectedKey) {
				case "Pay with Credits":
					paymentusd = false
					// this.getView().byId("depositreferencelabel").setVisible(paymentusd);
					// this.getView().byId("depositreference").setVisible(paymentusd);
					this.getView().byId("submitOrder").setEnabled(!paymentusd);
				
					
					//oElement.setNextStep(this.byId("bankAccountStep"));
					//if credits allows and if all products are credits avaleibale


					if( !creditsallow || !allcredit) {


						if( !creditsallow & allcredit){

							//validationtext.setText("No tienes suficientes créditos para pedir todos los productos del carrito")

							MessageToast.show("No tienes suficientes créditos para pedir todos los productos del carrito");


						}else if (creditsallow & !allcredit){

							//validationtext.setText("Hay productos en el carrito que no se pueden canjear con creditos")
							MessageToast.show("Hay productos en el carrito que no se pueden canjear con creditos");

						}else if (!creditsallow & !allcredit){

							//validationtext.setText("Hay productos en el carrito que no se pueden canjear con creditos")
							MessageToast.show("Hay productos en el carrito que no se pueden canjear con creditos");
						}

						//validationtext.setText("")
						//oElement.setNextStep(this.byId("paymentTypeStep"));
						oWizard.discardProgress(oFirstStep);
						// scroll to top
						oWizard.goToStep(oFirstStep);
						
					}else{
						
						//aUsers[userindex].credits = aUsers[userindex].credits - sumtotal;  
						//TitleCredits.setText("Creditos: " + aUsers[userindex].credits + " USD" )
						var creditsleft = aUsers[userindex].credits - sumtotal
						textcreditsfinal.setText("Actualmente tienes: " + aUsers[userindex].credits + " USD en creditos , luego de esta compra por :  " + sumtotal + " USD, tendras :   "  + creditsleft  + " USD en creditos" )
						oElement.setNextStep(this.byId("creditsfinal"));
					}
					

					
				
					break;
				case " Bank Transfer":
					paymentusd = true
					this.getView().byId("PaymentsType2").setVisible(paymentusd);
					// this.getView().byId("depositreferencelabel").setVisible(paymentusd);
					// this.getView().byId("depositreference").setVisible(paymentusd);
					this.getView().byId("submitOrder").setEnabled(!paymentusd);
					if ( !allcash){

						//validationtext.setText("Hay productos en el carrito que no se pueden comprar con USD")
						MessageToast.show("Hay productos en el carrito que no se pueden comprar con USD");
						//oElement.setNextStep(this.byId("paymentTypeStep"));
						oWizard.discardProgress(oFirstStep);
						// scroll to top
						oWizard.goToStep(oFirstStep);
					}else{

						if( purchasedthismonth +  totalproductquantity <= maxpurchasedmonthallowed){

							//validationtext.setText("")
						oElement.setNextStep(this.byId("bankAccountStep"));

						}else{
						
						var purchasedallowleft = maxpurchasedmonthallowed - (purchasedthismonth)

							//validationtext.setText("Hay productos en el carrito que no se pueden comprar con USD")
						MessageToast.show("La cantidad de productos en el carrito es mayor a la cantidad permitida restante por este mes (" + purchasedallowleft + " productos)" );
						//oElement.setNextStep(this.byId("paymentTypeStep"));
						oWizard.discardProgress(oFirstStep);
						// scroll to top
						oWizard.goToStep(oFirstStep);


						}
						
					}
					
					break;
				case "Credit Card":
				default:

				paymentusd = false
				this.getView().byId("PaymentsType2").setVisible(paymentusd);
				// this.getView().byId("depositreferencelabel").setVisible(paymentusd);
				// this.getView().byId("depositreference").setVisible(paymentusd);
				this.getView().byId("submitOrder").setEnabled(!paymentusd);
				
					
				if(  !creditsallow || !allcredit) {

					if( !creditsallow & allcredit){

                        //validationtext.setText("You don't have enough credits to order all the products in the cart")
						MessageToast.show("You don't have enough credits to order all the products in the cart");


					}else if (creditsallow & !allcredit){

						//validationtext.setText("Hay productos en el carrito que no se pueden canjear con creditos")
						MessageToast.show("Hay productos en el carrito que no se pueden canjear con creditos");

					}else if (!creditsallow & !allcredit){

						//validationtext.setText("Hay productos en el carrito que no se pueden canjear con creditos")
						MessageToast.show("Hay productos en el carrito que no se pueden canjear con creditos");
					}
					//oElement.setNextStep(this.byId("paymentTypeStep"));
					oWizard.discardProgress(oFirstStep);
					// scroll to top
					oWizard.goToStep(oFirstStep);

				}else{

					var creditsleft = aUsers[userindex].credits - sumtotal
					textcreditsfinal.setText("Actualmente tienes: " + aUsers[userindex].credits + " USD en creditos , luego de esta compra por :  " + sumtotal + " USD, tendras :   "  + creditsleft  + " USD en creditos" )
					oElement.setNextStep(this.byId("creditsfinal"));
				}
					break;
			}
		},

		/**
		 * Shows warning message if user changes previously selected payment method
		 */
		setPaymentMethod: function () {
			this._setDiscardableProperty({
				message: this.getResourceBundle().getText("checkoutControllerChangePayment"),
				discardStep: this.byId("paymentTypeStep"),
				modelPath: "/SelectedPayment",
				historyPath: "prevPaymentSelect"
			});
		},

		/**
		 * Shows warning message if user changes previously selected delivery address
		 */
		setDifferentDeliveryAddress: function () {
			this._setDiscardableProperty({
				message: this.getResourceBundle().getText("checkoutControllerChangeDelivery"),
				discardStep: this.byId("invoiceStep"),
				modelPath: "/DifferentDeliveryAddress",
				historyPath: "prevDiffDeliverySelect"
			});
		},

		/**
		 * Called from WizardStep "invoiceStep"
		 * shows next WizardStep "DeliveryAddressStep" or "DeliveryTypeStep" according to user selection
		 */
		invoiceAddressComplete: function () {
			var sNextStepId = (this.getModel().getProperty("/DifferentDeliveryAddress"))
				? "deliveryAddressStep"
				: "deliveryTypeStep";
			this.byId("invoiceStep").setNextStep(this.byId(sNextStepId));

		},

		/**
		 * Called from <code>ordersummary</code>
		 * shows warning message and cancels order if confirmed
		 */
		handleWizardCancel: function () {
			var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureCancel");
			this._handleSubmitOrCancel(sText, "warning", "home");
		},

		/**
		 * Called from <code>ordersummary</code>
		 * shows warning message and submits order if confirmed
		 */
		// handleWizardSubmit: function () {

		// 	var UserData = this.getOwnerComponent().getModel("UserData")

		// 	try {
		// 		var oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
		// 		//console.log("current user: ","'",oUser.trim(),"'")
		
		// 		} catch (error) {
		
		// 		var oUser = "Default User";
		// 		//console.log("current user: ","'",oUser.trim(),"'")
				

		// 		}

		// 	var userindex = 0
		// 	var sumtotal = 0

		// 	var oCartModel2 = this.getModel("cartProducts")
		// 	var oCartEntries2 = oCartModel2.getProperty("/cartEntries");
		

		// 	var aUsers = UserData.getProperty("/User_Data");
		// 	for (var i = 0; i < aUsers.length; i++) {
		// 		if (aUsers[i].name === oUser) {
		// 			userindex = i
		// 			var fCredits = aUsers[i].credits;
		// 			break;
		// 		}
		// 	}

		// 	for(var key in oCartEntries2) 
		// 	{
		// 		sumtotal = sumtotal + (oCartEntries2[key].price * oCartEntries2[key].Quantity)
			
		// 	}


			
		// 	if (!paymentusd){

		// 	aUsers[userindex].credits = aUsers[userindex].credits - sumtotal;
			
		// 	var TitleCredits = this.getView().byId("_IDGenTitle1")
		// 	TitleCredits.setText("Creditos: " + aUsers[userindex].credits + " USD" )

		// 	}

		// 	var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureSubmit");
		// 	this._handleSubmitOrCancel(sText, "confirm", "ordercompleted");
		// },

		handleWizardSubmit: function () {

			var UserData = this.getOwnerComponent().getModel("UserData");
		
			var oUser;
			try {
				oUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
			} catch (error) {
				oUser = "Default User";
			}
		
			var userIndex = 0;
			var sumTotal = 0;
		
			var oCartModel2 = this.getModel("cartProducts");
			var oCartEntries2 = oCartModel2.getProperty("/cartEntries");
			
			// Encontrar al usuario actual y obtener sus créditos
			var aUsers = UserData.getProperty("/User_Data");
			for (var i = 0; i < aUsers.length; i++) {
				if (aUsers[i].name === oUser) {
					userIndex = i;
					var fCredits = aUsers[i].credits;
					break;
				}
			}
		
			// Calcular el total de la compra
			for (var key in oCartEntries2) {
				sumTotal += (oCartEntries2[key].price * oCartEntries2[key].Quantity);
			}
		
			// Actualizar créditos si no es un pago en dólares (usando créditos)
			if (!paymentusd) {
				aUsers[userIndex].credits = aUsers[userIndex].credits - sumTotal;
				var TitleCredits = this.getView().byId("_IDGenTitle1");
				TitleCredits.setText("Creditos: " + aUsers[userIndex].credits + " USD");
			}
		
			// Obtener el siguiente ID en la secuencia
			var oOrderModel = this.getOwnerComponent().getModel("OrdersData");
			var oOrders = oOrderModel.getProperty("/Orders") || [];
			var sNextOrderId = this._getNextOrderId(oOrders); // Método para obtener el siguiente ID
		
			// Crear nueva orden
			var oNewOrder = {
				OrderId: sNextOrderId, // Siguiente ID en la secuencia
				Status: "Pendiente Aprobación",
				CreatedAt: new Date().toLocaleDateString(), // Fecha de creación actual
				Amount: sumTotal + " VES",
				ShippingAddress: "Dirección de envío aquí", // Debes obtener la dirección real
				Items: Object.keys(oCartEntries2).length + " Items",
				Products: oCartEntries2, // Añadir los productos del carrito
				events: [
					{
						"type": "Created",
						"status": "Success",
						"date": new Date().toISOString(), // Fecha actual en formato ISO
						"properties": oUser, // Usuario actual
						"Texto": "Orden Creada por " + oUser
					},
					{
						"type": "Approval",
						"status": "In Process",
						"date": null,
						"properties": oUser,
						"Texto": "Orden Pendiente de Aprobación"
					}
				]
			};
		
			// Llamar a la función addOrder de la clase Order.js
			orderManager.addOrder(oNewOrder, oOrderModel);
		
			var sText = this.getResourceBundle().getText("checkoutControllerAreYouSureSubmit");
			this._handleSubmitOrCancel(sText, "confirm", "ordercompleted");
		},
		
		// Método para obtener el siguiente ID en la secuencia de órdenes
		_getNextOrderId: function (aOrders) {
			if (!aOrders.length) {
				return "50000001"; // Si no hay órdenes previas, empieza en 50000001
			}
		
			var aOrderIds = aOrders.map(function(order) {
				return parseInt(order.OrderId, 10); // Convertir a número
			});
		
			var iMaxOrderId = Math.max.apply(null, aOrderIds); // Obtener el ID más alto
		
			return (iMaxOrderId + 1).toString(); // Incrementar en 1 y devolver como string
		},

		/**
		 * Called from <code>_handleSubmitOrCancel</code>
		 * resets Wizard after submitting or canceling order
		 */
		backToWizardContent: function () {
			this.byId("wizardNavContainer").backToPage(this.byId("wizardContentPage").getId());
		},

		/**
		 * Removes validation error messages from the previous step
		 */
		_clearMessages: function () {
			oCore.getMessageManager().removeAllMessages();
		},

		/**
		 * Checks the corresponding step after activation to decide whether the user can proceed or needs
		 * to correct the input
		 */
		onCheckStepActivation: function(oEvent) {
			this._clearMessages();
			var sWizardStepId = oEvent.getSource().getId();
			switch (sWizardStepId) {
				case this.createId("creditCardStep"):
					this.checkCreditCardStep();
					break;
				case this.createId("cashOnDeliveryStep"):
					this.checkCashOnDeliveryStep();
					break;
				case this.createId("invoiceStep"):
					this.checkInvoiceStep();
					break;
				case this.createId("deliveryAddressStep"):
					this.checkDeliveryAddressStep();
					break;
				
			}
		},

		/**
		 * Validates the credit card step initially and after each input
		 */
		checkCreditCardStep: function () {
			this._checkStep("creditCardStep", ["creditCardHolderName", "creditCardNumber", "creditCardSecurityNumber", "creditCardExpirationDate"]);
		},

		/**
		 * Validates the cash on delivery step initially and after each input
		 */
		checkCashOnDeliveryStep: function () {
			this._checkStep("cashOnDeliveryStep", ["cashOnDeliveryName", "cashOnDeliveryLastName", "cashOnDeliveryPhoneNumber", "cashOnDeliveryEmail"]);
		},

		/**
		 * Validates the invoice step initially and after each input
		*/
		checkInvoiceStep: function () {
			this._checkStep("invoiceStep", ["invoiceAddressAddress", "invoiceAddressCity", "invoiceAddressZip", "invoiceAddressCountry"]);
		},

		/**
		 * Validates the delivery address step initially and after each input
		 */
		checkDeliveryAddressStep: function () {
			this._checkStep("deliveryAddressStep", ["deliveryAddressAddress", "deliveryAddressCity", "deliveryAddressZip", "deliveryAddressCountry"]);
		},

		/**
		 * Checks if one or more of the inputs are empty
		 * @param {array} aInputIds - Input ids to be checked
		 * @returns {boolean}
		 * @private
		 */
		_checkInputFields : function (aInputIds) {
			var oView = this.getView();

			return aInputIds.some(function (sInputId) {
				var oInput = oView.byId(sInputId);
				var oBinding = oInput.getBinding("value");
				try {
					oBinding.getType().validateValue(oInput.getValue());
				} catch (oException) {
					return true;
				}
				return false;
			});
		},

		/**
		 * Hides button to proceed to next WizardStep if validation conditions are not fulfilled
		 * @param {string} sStepName - the ID of the step to be checked
		 * @param {array} aInputIds - Input IDs to be checked
		 * @private
		 */
		_checkStep: function (sStepName, aInputIds) {
			var oWizard = this.byId("shoppingCartWizard"),
				oStep = this.byId(sStepName),
				bEmptyInputs = this._checkInputFields(aInputIds),
				bValidationError = !!oCore.getMessageManager().getMessageModel().getData().length;

			if (!bValidationError && !bEmptyInputs) {
				oWizard.validateStep(oStep);
			} else {
				oWizard.invalidateStep(oStep);
			}
		},

		/**
		 * Called from  Wizard on <code>complete</code>
		 * Navigates to the summary page in case there are no errors
		 */
		checkCompleted: function () {
			if (oCore.getMessageManager().getMessageModel().getData().length > 0) {
				MessageBox.error(this.getResourceBundle().getText("popOverMessageText"));
			} else {
				this.byId("wizardNavContainer").to(this.byId("summaryPage"));
			}
		},

		/**
		 * navigates to "home" for further shopping
		 */
		// onReturnToShopButtonPress: function () {
         
		// 	this._setLayout("One");
		// 	this.getRouter().navTo("RouteMain");
		// },

		onReturnToShopButtonPress: function () {
			this._setLayout("Two"); // Cambiar el diseño
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Cart");

		},

		// *** the following functions are private "helper" functions ***

		/**
		 * Called from both <code>setPaymentMethod</code> and <code>setDifferentDeliveryAddress</code> functions.
		 * Shows warning message if user changes previously selected choice
		 * @private
		 * @param {Object} oParams Object containing message text, model path and WizardSteps
		 */
		_setDiscardableProperty: function (oParams) {
			var oWizard = this.byId("shoppingCartWizard");
			if (oWizard.getProgressStep() !== oParams.discardStep) {
				MessageBox.warning(oParams.message, {
					actions: [MessageBox.Action.YES,
						MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							oWizard.discardProgress(oParams.discardStep);
							this._oHistory[oParams.historyPath] = this.getModel().getProperty(oParams.modelPath);
						} else {
							this.getModel().setProperty(oParams.modelPath, this._oHistory[oParams.historyPath]);
						}
					}.bind(this)
				});
			} else {
				this._oHistory[oParams.historyPath] = this.getModel().getProperty(oParams.modelPath);
			}
		},

		/**
		 * Called from <code>handleWizardCancel</code> and <code>handleWizardSubmit</code> functions.
		 * Shows warning message, resets shopping cart and wizard if confirmed and navigates to given route
		 * @private
		 * @param {string} sMessage message text
		 * @param {string} sMessageBoxType message box type (e.g. warning)
		 * @param {string} sRoute route to navigate to
		 */
		_handleSubmitOrCancel: function (sMessage, sMessageBoxType, sRoute) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES,
					MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						// resets Wizard
						

						var oWizard = this.byId("shoppingCartWizard");
						var oModel = this.getModel();
						var oCartModel = this.getModel("cartProducts");
						this._navToWizardStep(this.byId("contentsStep"));
						oWizard.discardProgress(oWizard.getSteps()[0]);
						var oModelData = oModel.getData();
						oModelData.SelectedPayment = "Credits";
						oModelData.SelectedDeliveryMethod = "Standard Delivery";
						oModelData.DifferentDeliveryAddress = false;
						oModelData.CashOnDelivery = {};
						oModelData.InvoiceAddress = {};
						oModelData.DeliveryAddress = {};
						oModelData.CreditCard = {};
						oModel.setData(oModelData);
						//all relevant cart properties are set back to default. Content is deleted.
						var oCartModelData = oCartModel.getData();
						oCartModelData.cartEntries = {};
						oCartModelData.totalPrice = 0;
						oCartModel.setData(oCartModelData);
					
						sap.ui.core.UIComponent.getRouterFor(this).navTo(sRoute);
					}
				}.bind(this)
			});
		},

		/**
		 * gets customData from ButtonEvent
		 * and navigates to WizardStep
		 * @private
		 * @param {sap.ui.base.Event} oEvent the press event of the button
		 */
		_navBackToStep: function (oEvent) {
			var sStep = oEvent.getSource().data("navBackTo");
			var oStep = this.byId(sStep);
			this._navToWizardStep(oStep);
		},

		/**
		 * navigates to WizardStep
		 * @private
		 * @param {Object} oStep WizardStep DOM element
		 */
		_navToWizardStep: function (oStep) {
			var oNavContainer = this.byId("wizardNavContainer");
			var _fnAfterNavigate = function () {
				this.byId("shoppingCartWizard").goToStep(oStep);
				// detaches itself after navigaton
				oNavContainer.detachAfterNavigate(_fnAfterNavigate);
			}.bind(this);

			oNavContainer.attachAfterNavigate(_fnAfterNavigate);
			oNavContainer.to(this.byId("wizardContentPage"));
		}
	});
});
