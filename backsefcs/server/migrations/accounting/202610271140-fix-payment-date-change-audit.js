'use strict';

module.exports = {
    up: async (queryInterface) => {
        // Las cuentas de intranet usan UUID. La primera versión de esta
        // migración creó la columna como INTEGER; se normaliza a texto para
        // soportar tanto los UUID actuales como eventuales IDs históricos.
        await queryInterface.sequelize.query(`
            ALTER TABLE accounting."Payment_date_change"
            ALTER COLUMN changed_by TYPE VARCHAR(50)
            USING changed_by::text
        `);
    },
    down: async () => {
        // No se revierte: una UUID no puede convertirse de forma segura a INTEGER.
    }
};
