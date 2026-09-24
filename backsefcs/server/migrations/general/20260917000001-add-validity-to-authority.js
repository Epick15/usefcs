'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            { tableName: 'Authority', schema: 'general' },
            'valid_from',
            { allowNull: true, type: Sequelize.DATEONLY }
        );
        await queryInterface.addColumn(
            { tableName: 'Authority', schema: 'general' },
            'valid_to',
            { allowNull: true, type: Sequelize.DATEONLY }
        );
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn({ tableName: 'Authority', schema: 'general' }, 'valid_to');
        await queryInterface.removeColumn({ tableName: 'Authority', schema: 'general' }, 'valid_from');
    }
};
