// sap.ui.define([
// 	"sap/m/MessageBox",
// 	"sap/m/MessageToast"
// ], function (
// 	MessageBox,
// 	MessageToast) {
// 	"use strict";

// 	return {

// 		_addOrdersItem: function (oBundle, oOrderToBeAdded, oOrderSelectedModel) {
//             // find existing entry for product
//             var oCollectionEntries = Object.assign({}, {});
            
//             oProductsToBeAdded.array.forEach(element => {
                
//                 // create new entry
//                 var oCartEntry = Object.assign({}, element);
//                 oCartEntry.Quantity = element.Quantity;
//                 oCollectionEntries[oProductToBeAdded.product_name] = oCartEntry;
                
//             });
            
//             //update the cart model
//             oOrderSelectedModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
//             oOrderSelectedModel.refresh(true);
//             MessageToast.show(oBundle.getText("Productos agregado al carrito" ));
//         }
//     };
// });


sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    MessageBox,
    MessageToast) {
    "use strict";

    return {

        /**
         * Agrega una nueva orden al modelo de órdenes.
         * @public
         * @param {Object} oOrderEntry Entrada de la nueva orden
         * @param {Object} oOrderModel Modelo de órdenes
         */
        addOrder: function (oOrderEntry, oOrderModel) {
            var oCollectionEntries = oOrderModel.getProperty("/Orders") || [];

            // Agregar la nueva orden a la colección
            oCollectionEntries.push(oOrderEntry);

            // Actualizar el modelo con la nueva colección
            oOrderModel.setProperty("/Orders", oCollectionEntries);

            // Refrescar el modelo para asegurarse de que los cambios se reflejen en la vista
            oOrderModel.refresh(true);
            MessageToast.show("Orden añadida exitosamente.");
        },

        /**
         * Elimina una orden del modelo de órdenes.
         * @public
         * @param {string} sOrderId ID de la orden a eliminar
         * @param {Object} oOrderModel Modelo de órdenes
         */
        deleteOrder: function (sOrderId, oOrderModel) {
            var oCollectionEntries = oOrderModel.getProperty("/Orders") || [];

            // Filtrar la orden que se desea eliminar
            var updatedEntries = oCollectionEntries.filter(function(order) {
                return order.OrderId !== sOrderId;
            });

            if (updatedEntries.length === oCollectionEntries.length) {
                MessageBox.error("No se encontró ninguna orden con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la nueva colección
            oOrderModel.setProperty("/Orders", updatedEntries);
            oOrderModel.refresh(true);

            MessageToast.show("Orden eliminada exitosamente.");
        },

        /**
         * Actualiza una orden en el modelo de órdenes.
         * @public
         * @param {string} sOrderId ID de la orden a actualizar
         * @param {Object} oUpdatedOrderData Datos para actualizar la orden
         * @param {Object} oOrderModel Modelo de órdenes
         */
        updateOrder: function (sOrderId, oUpdatedOrderData, oOrderModel) {
            var oCollectionEntries = oOrderModel.getProperty("/Orders") || [];
            var orderFound = false;

            // Buscar y actualizar la orden
            var updatedEntries = oCollectionEntries.map(function(order) {
                if (order.OrderId === sOrderId) {
                    orderFound = true;
                    return Object.assign(order, oUpdatedOrderData);
                }
                return order;
            });

            if (!orderFound) {
                MessageBox.error("No se encontró ninguna orden con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la nueva colección
            oOrderModel.setProperty("/Orders", updatedEntries);
            oOrderModel.refresh(true);

            MessageToast.show("Orden actualizada exitosamente.");
        },

        /**
         * Agrega un nuevo producto a una orden existente.
         * @public
         * @param {string} sOrderId ID de la orden a la que se añadirá el producto
         * @param {Object} oProductEntry Entrada del producto a añadir
         * @param {Object} oOrderModel Modelo de órdenes
         */
        addProductToOrder: function (sOrderId, oProductEntry, oOrderModel) {
            var oCollectionEntries = oOrderModel.getProperty("/Orders") || [];
            var orderFound = false;

            // Buscar la orden y agregar el producto
            var updatedEntries = oCollectionEntries.map(function(order) {
                if (order.OrderId === sOrderId) {
                    orderFound = true;
                    order.Products.push(oProductEntry); // Agregar el nuevo producto
                }
                return order;
            });

            if (!orderFound) {
                MessageBox.error("No se encontró ninguna orden con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la nueva colección
            oOrderModel.setProperty("/Orders", updatedEntries);
            oOrderModel.refresh(true);

            MessageToast.show("Producto añadido exitosamente a la orden.");
        },

        /**
         * Elimina un producto de una orden existente.
         * @public
         * @param {string} sOrderId ID de la orden
         * @param {string} sProductId ID del producto a eliminar
         * @param {Object} oOrderModel Modelo de órdenes
         */
        deleteProductFromOrder: function (sOrderId, sProductId, oOrderModel) {
            var oCollectionEntries = oOrderModel.getProperty("/Orders") || [];
            var orderFound = false;

            // Buscar la orden y eliminar el producto
            var updatedEntries = oCollectionEntries.map(function(order) {
                if (order.OrderId === sOrderId) {
                    orderFound = true;
                    order.Products = order.Products.filter(function(product) {
                        return product.id !== sProductId;
                    });
                }
                return order;
            });

            if (!orderFound) {
                MessageBox.error("No se encontró ninguna orden con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la nueva colección
            oOrderModel.setProperty("/Orders", updatedEntries);
            oOrderModel.refresh(true);

            MessageToast.show("Producto eliminado exitosamente de la orden.");
        },

        /**
         * Actualiza un producto dentro de una orden existente.
         * @public
         * @param {string} sOrderId ID de la orden
         * @param {string} sProductId ID del producto a actualizar
         * @param {Object} oUpdatedProductData Datos actualizados del producto
         * @param {Object} oOrderModel Modelo de órdenes
         */
        updateProductInOrder: function (sOrderId, sProductId, oUpdatedProductData, oOrderModel) {
            var oCollectionEntries = oOrderModel.getProperty("/Orders") || [];
            var orderFound = false;

            // Buscar la orden y actualizar el producto
            var updatedEntries = oCollectionEntries.map(function(order) {
                if (order.OrderId === sOrderId) {
                    orderFound = true;
                    order.Products = order.Products.map(function(product) {
                        if (product.id === sProductId) {
                            return Object.assign(product, oUpdatedProductData);
                        }
                        return product;
                    });
                }
                return order;
            });

            if (!orderFound) {
                MessageBox.error("No se encontró ninguna orden con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la nueva colección
            oOrderModel.setProperty("/Orders", updatedEntries);
            oOrderModel.refresh(true);

            MessageToast.show("Producto actualizado exitosamente en la orden.");
        }
    };
});
