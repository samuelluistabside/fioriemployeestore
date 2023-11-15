sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("employeestore.controller.OrderCompleted", {

		onInit: function () {
			this._oRouter = this.getRouter();
		},

		onReturnToShopButtonPress: function () {
			//navigates back to home screen
			this._setLayout("One");
			this._oRouter.navTo("RouteMain");
		}
	});
});
