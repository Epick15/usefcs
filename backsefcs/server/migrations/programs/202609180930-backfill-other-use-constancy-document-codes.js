'use strict';

module.exports = {
    up: async (queryInterface) => {
        // Completa los documentos ya emitidos sin modificar su correlativo.
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-' ||
                CASE
                    WHEN id_concept = 122 THEN 'C.Mat.USE'
                    WHEN id_concept = 103 THEN 'C.NoAdeu.USE'
                    WHEN id_concept = 17 THEN 'C.OrdMer.USE'
                    WHEN id_concept = 124 THEN 'C.NoProcDis.USE'
                END
            WHERE correlative IS NOT NULL
              AND id_concept IN (17, 103, 122, 124)
              AND document_code IS NULL;
        `);
    },

    down: async (queryInterface) => {
        await queryInterface.sequelize.query(`
            UPDATE programs."Document_book"
            SET document_code = NULL
            WHERE id_concept IN (17, 103, 122, 124)
              AND document_code IN (
                  correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-C.Mat.USE',
                  correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-C.NoAdeu.USE',
                  correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-C.OrdMer.USE',
                  correlative || '-' || TO_CHAR(created_at, 'YYYY') || '-C.NoProcDis.USE'
              );
        `);
    },
};
