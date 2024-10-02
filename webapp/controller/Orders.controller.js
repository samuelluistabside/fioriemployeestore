sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/Device',
    'sap/ui/model/Filter',
    'sap/ui/model/Sorter',
    'sap/ui/model/json/JSONModel',
    'sap/m/Menu',
    'sap/m/MenuItem',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    "../model/formatter"
], function(Controller, Device , Filter, Sorter, JSONModel, Menu, MenuItem, MessageToast, Fragment , formatter) {
"use strict";

var SettingsDialogController = Controller.extend("employeestore.controller.OrdersController", {

    formatter: formatter,

    onInit: function () {
        // Cargar el modelo desde un archivo JSON externo
        // var oModel = new JSONModel();
        // oModel.loadData(sap.ui.require.toUrl("employeestore/model/Orders.json"));
        // this.getView().setModel(oModel, "OrdersData");
        // var OrdersData = this.getOwnerComponent().getModel("OrdersData")
		// this.getView().setModel(OrdersData,"OrdersData");
        

        var oView = this.getView();
        Fragment.load({
            id: this.getView().getId(),
            name: "employeestore.view.fragments.ColumnMenu",
            controller: this
        }).then(function(oMenu) {
            oView.addDependent(oMenu);
            return oMenu;
        });

        this._mViewSettingsDialogs = {};

        this.mGroupFunctions = {
            SupplierName: function(oContext) {
                var name = oContext.getProperty("SupplierName");
                return {
                    key: name,
                    text: name
                };
            },
            Price: function(oContext) {
                var price = oContext.getProperty("Price");
                var currencyCode = oContext.getProperty("CurrencyCode");
                var key, text;
                if (price <= 100) {
                    key = "LE100";
                    text = "100 " + currencyCode + " or less";
                } else if (price <= 1000) {
                    key = "BT100-1000";
                    text = "Between 100 and 1000 " + currencyCode;
                } else {
                    key = "GT1000";
                    text = "More than 1000 " + currencyCode;
                }
                return {
                    key: key,
                    text: text
                };
            }
            
        };

        // var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
		// this.getView().setModel(oModel);

        var OrdersData = this.getOwnerComponent().getModel("OrdersData");
        this.getView().setModel(OrdersData);


    },

    resetGroupDialog: function(oEvent) {
        this.groupReset =  true;
    },

    getViewSettingsDialog: function (sDialogFragmentName) {
        var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

        if (!pDialog) {
            pDialog = Fragment.load({
                id: this.getView().getId(),
                name: sDialogFragmentName,
                controller: this
            }).then(function (oDialog) {
                if (Device.system.desktop) {
                    oDialog.addStyleClass("sapUiSizeCompact");
                }
                return oDialog;
            });
            this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
        }
        return pDialog;
    },

    // onOrderLinkPress: function(oEvent) {
    //     var sOrderId = oEvent.getSource().getText();
    //     this.getRouter().navTo( "OrderDetail");
    //     // Navegación a la vista de detalle de la orden usando el sOrderId.
    //     // Aquí puedes implementar la lógica para navegar a la vista de detalles de la orden.
    // },

    onOrderLinkPress: function(oEvent) {
        var oViewOrderDetail = sap.ui.getCore().byId("OrderDetail");
        if (oViewOrderDetail) {
            oViewOrderDetail.destroyContent();
        }
        var sOrderId = oEvent.getSource().getText();
    
        // Navegación a la vista de detalle de la orden usando el sOrderId
        sap.ui.core.UIComponent.getRouterFor(this).navTo("OrderDetail", {
            orderId: sOrderId
        });
    },

    handleBackMainPressed: function () {
        sap.ui.core.UIComponent.getRouterFor(this).navTo("Cart");
    },

    handleSortButtonPressed: function () {
        this.getViewSettingsDialog("employeestore.view.fragments.SortDialog")
            .then(function (oViewSettingsDialog) {
                oViewSettingsDialog.open();
            });
    },

    handleFilterButtonPressed: function () {
        this.getViewSettingsDialog("employeestore.view.fragments.FilterDialog")
            .then(function (oViewSettingsDialog) {
                oViewSettingsDialog.open();
            });
    },

    handleGroupButtonPressed: function () {
        this.getViewSettingsDialog("employeestore.view.fragments.GroupDialog")
            .then(function (oViewSettingsDialog) {
                oViewSettingsDialog.open();
            });
    },

    handleSortDialogConfirm: function (oEvent) {
        var oTable = this.byId("idProductsTable2"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            sPath,
            bDescending,
            aSorters = [];

        sPath = mParams.sortItem.getKey();
        bDescending = mParams.sortDescending;
        aSorters.push(new Sorter(sPath, bDescending));

        // apply the selected sort and group settings
        oBinding.sort(aSorters);
    },

    handleFilterDialogConfirm: function (oEvent) {
        var oTable = this.byId("idProductsTable2"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            aFilters = [];

        mParams.filterItems.forEach(function(oItem) {
            var aSplit = oItem.getKey().split("___"),
                sPath = aSplit[0],
                sOperator = aSplit[1],
                sValue1 = aSplit[2],
                sValue2 = aSplit[3],
                oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
            aFilters.push(oFilter);
        });

        // apply filter settings
        oBinding.filter(aFilters);

        // update filter bar
        this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
        this.byId("vsdFilterLabel").setText(mParams.filterString);
    },

    handleGroupDialogConfirm: function (oEvent) {
        var oTable = this.byId("idProductsTable2"),
            mParams = oEvent.getParameters(),
            oBinding = oTable.getBinding("items"),
            sPath,
            bDescending,
            vGroup,
            aGroups = [];

        if (mParams.groupItem) {
            sPath = mParams.groupItem.getKey();
            bDescending = mParams.groupDescending;
            vGroup = this.mGroupFunctions[sPath];
            aGroups.push(new Sorter(sPath, bDescending, vGroup));
            // apply the selected group settings
            oBinding.sort(aGroups);
        } else if (this.groupReset) {
            oBinding.sort();
            this.groupReset = false;
        }
    },

    onToggleContextMenu: function (oEvent) {
        var oToggleButton = oEvent.getSource();
        if (oEvent.getParameter("pressed")) {
            oToggleButton.setTooltip("Disable Custom Context Menu");
            this.byId("idProductsTable2").setContextMenu(new Menu({
                items: [
                    new MenuItem({text: "{Name}"}),
                    new MenuItem({text: "{ProductId}"})
                ]
            }));
        } else {
            oToggleButton.setTooltip("Enable Custom Context Menu");
            this.byId("idProductsTable2").destroyContextMenu();
        }
    },

    onActionItemPress: function() {
        MessageToast.show('Action Item Pressed');
    }
});

return SettingsDialogController;
});