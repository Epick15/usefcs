'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            {tableName: 'Payment', schema: 'accounting'},
            'operation_date',
            {type: Sequelize.DATEONLY, allowNull: true}
        );
        await queryInterface.sequelize.query(`
            UPDATE accounting."Payment"
            SET operation_date = created_at::date
            WHERE operation_date IS NULL
        `);
        await queryInterface.createTable('Payment_date_change', {
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            id_payment: {allowNull: false, type: Sequelize.INTEGER},
            previous_date: {allowNull: false, type: Sequelize.DATEONLY},
            new_date: {allowNull: false, type: Sequelize.DATEONLY},
            reason: {allowNull: false, type: Sequelize.TEXT},
            changed_by: {allowNull: false, type: Sequelize.STRING(50)},
            created_at: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
        }, {schema: 'accounting'});
        await queryInterface.addIndex(
            {tableName: 'Payment_date_change', schema: 'accounting'},
            ['id_payment', 'created_at'],
            {name: 'Payment_date_change_payment_created_at_idx'}
        );
    },
    down: async (queryInterface) => {
        await queryInterface.removeIndex(
            {tableName: 'Payment_date_change', schema: 'accounting'},
            'Payment_date_change_payment_created_at_idx'
        );
        await queryInterface.dropTable('Payment_date_change', {schema: 'accounting'});
        await queryInterface.removeColumn({tableName: 'Payment', schema: 'accounting'}, 'operation_date');
    }
};
