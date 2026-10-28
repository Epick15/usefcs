'use strict';

// Algunas bases históricas fueron restauradas sin la columna que Sequelize usa
// para borrado lógico. La comprobación evita fallar en instalaciones actualizadas.
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const table = {tableName: 'Payment', schema: 'accounting'};
        const columns = await queryInterface.describeTable(table);
        if (!columns.deleted_at) {
            await queryInterface.addColumn(table, 'deleted_at', {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
    },
    down: async () => {
        // No se elimina la columna: podría existir antes de esta migración.
    }
};
