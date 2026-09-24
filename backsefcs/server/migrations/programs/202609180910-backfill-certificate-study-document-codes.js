'use strict';

module.exports = {
    up: async (queryInterface) => {
        // También cubre instalaciones donde la migración inicial ya se ejecutó
        // antes de incorporar el certificado de estudios a la numeración.
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-Cert.Est.USE'
            WHERE correlative IS NOT NULL
              AND id_concept IN (59, 102, 120)
              AND document_code IS NULL;
        `);
    },

    down: async (queryInterface) => {
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = NULL
            WHERE id_concept IN (59, 102, 120)
              AND document_code LIKE '%-Cert.Est.USE';
        `);
    },
};
