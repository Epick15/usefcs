'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const table = {tableName: 'Payment', schema: 'accounting'};
        await queryInterface.addColumn(table, 'cancellation_reason', {type: Sequelize.TEXT, allowNull: true});
        await queryInterface.addColumn(table, 'cancelled_at', {type: Sequelize.DATE, allowNull: true});
        await queryInterface.addColumn(table, 'cancelled_by', {type: Sequelize.STRING(50), allowNull: true});
        await queryInterface.addColumn(table, 'annulled_previous_type', {type: Sequelize.STRING(20), allowNull: true});
        await queryInterface.addColumn(table, 'reactivation_reason', {type: Sequelize.TEXT, allowNull: true});
        await queryInterface.addColumn(table, 'reactivated_at', {type: Sequelize.DATE, allowNull: true});
        await queryInterface.addColumn(table, 'reactivated_by', {type: Sequelize.STRING(50), allowNull: true});
    },
    down: async (queryInterface) => {
        const table = {tableName: 'Payment', schema: 'accounting'};
        await queryInterface.removeColumn(table, 'reactivated_by');
        await queryInterface.removeColumn(table, 'reactivated_at');
        await queryInterface.removeColumn(table, 'reactivation_reason');
        await queryInterface.removeColumn(table, 'annulled_previous_type');
        await queryInterface.removeColumn(table, 'cancelled_by');
        await queryInterface.removeColumn(table, 'cancelled_at');
        await queryInterface.removeColumn(table, 'cancellation_reason');
    }
};
