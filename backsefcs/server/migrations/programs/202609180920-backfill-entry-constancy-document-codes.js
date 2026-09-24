'use strict';

module.exports = {
    up: async (queryInterface) => {
        // Cubre instalaciones que ya aplicaron la migración inicial.
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-C.Ing.USE'
            WHERE correlative IS NOT NULL
              AND id_concept IN (1, 2, 113)
              AND document_code IS NULL;
        `);
    },

    down: async (queryInterface) => {
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = NULL
            WHERE id_concept IN (1, 2, 113)
              AND document_code LIKE '%-C.Ing.USE';
        `);
    },
};
