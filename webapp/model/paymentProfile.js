sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    MessageBox,
    MessageToast) {
    "use strict";

    return {

        /**
         * Adds a PaymentProfile to the PaymentProfileModel.
         * @public
         * @param {Object} oBundle i18n bundle (optional)
         * @param {Object} oPaymentProfileEntry PaymentProfile to be added
         * @param {Object} oPaymentProfileModel PaymentProfile model
         */
        addPaymentProfile: function (oBundle, oPaymentProfileEntry, oPaymentProfileModel) {
            var oCollectionEntries = oPaymentProfileModel.getProperty("/PaymentProfile") || [];
            oCollectionEntries.push(oPaymentProfileEntry);
            oPaymentProfileModel.setProperty("/PaymentProfile", oCollectionEntries);
            oPaymentProfileModel.refresh(true);
        },

        /**
         * Deletes a PaymentProfile from the PaymentProfileModel.
         * @public
         * @param {string} sPaymentProfileId ID of the PaymentProfile to be deleted
         * @param {Object} oPaymentProfileModel PaymentProfile model
         */
        deletePaymentProfile: function (sPaymentProfileId, oPaymentProfileModel) {
            var oCollectionEntries = oPaymentProfileModel.getProperty("/PaymentProfile") || [];
            
            // Buscar y eliminar el perfil de pago con el ID proporcionado
            var updatedEntries = oCollectionEntries.filter(function(profile) {
                return profile.ID !== sPaymentProfileId;
            });

            if (updatedEntries.length === oCollectionEntries.length) {
                MessageBox.error("No se encontró ningún perfil de pago con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la nueva colección
            oPaymentProfileModel.setProperty("/PaymentProfile", updatedEntries);
            oPaymentProfileModel.refresh(true);

            MessageToast.show("Perfil de pago eliminado con éxito.");
        },

        /**
         * Updates an existing PaymentProfile in the PaymentProfileModel.
         * @public
         * @param {string} sPaymentProfileId ID of the PaymentProfile to be updated
         * @param {Object} oUpdatedProfileData Data to update the PaymentProfile
         * @param {Object} oPaymentProfileModel PaymentProfile model
         */
        updatePaymentProfile: function (sPaymentProfileId, oUpdatedProfileData, oPaymentProfileModel) {
            var oCollectionEntries = oPaymentProfileModel.getProperty("/PaymentProfile") || [];
            
            // Buscar el perfil de pago por ID y actualizarlo
            var profileFound = false;
            var updatedEntries = oCollectionEntries.map(function(profile) {
                if (profile.ID === sPaymentProfileId) {
                    profileFound = true;
                    return Object.assign(profile, oUpdatedProfileData);  // Actualizar los datos del perfil
                }
                return profile;
            });

            if (!profileFound) {
                MessageBox.error("No se encontró ningún perfil de pago con el ID especificado.");
                return;
            }

            // Actualizar el modelo con la colección actualizada
            oPaymentProfileModel.setProperty("/PaymentProfile", updatedEntries);
            oPaymentProfileModel.refresh(true);

            MessageToast.show("Perfil de pago actualizado con éxito.");
        }

    };
});
