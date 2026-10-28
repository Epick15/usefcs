'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const table = {tableName: 'Document_book', schema: 'programs'};
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
