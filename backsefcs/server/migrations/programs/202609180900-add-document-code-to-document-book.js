'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            {tableName: 'Document_book', schema: 'programs'},
            'document_code',
            {
                allowNull: true,
                type: Sequelize.STRING,
            }
        );

        // Se conserva el correlativo existente y se registra su código oficial
        // para las constancias que tienen numeración.
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-' ||
                CASE
                    WHEN id_concept IN (59, 102, 120) THEN 'Cert.Est.USE'
                    WHEN id_concept IN (1, 2, 113) THEN 'C.Ing.USE'
                    WHEN id_concept IN (36, 98, 117, 118) THEN 'C.Est.USE'
                    WHEN id_concept IN (111, 115, 119) THEN 'C.Egr.USE'
                    WHEN id_concept = 104 THEN 'C.Exp.USE'
                    WHEN id_concept = 130 THEN 'C.Exp.S.USE'
                END
            WHERE correlative IS NOT NULL
              AND id_concept IN (1, 2, 36, 59, 98, 102, 104, 111, 113, 115, 117, 118, 119, 120, 130);
        `);
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn(
            {tableName: 'Document_book', schema: 'programs'},
            'document_code'
        );
    },
};
