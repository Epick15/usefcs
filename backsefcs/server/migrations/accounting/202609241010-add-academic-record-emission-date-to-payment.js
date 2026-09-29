'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            {tableName: 'Payment', schema: 'accounting'},
            'academic_record_emission_date',
            {allowNull: true, type: Sequelize.DATEONLY}
        );
        await queryInterface.addColumn(
            {tableName: 'Payment', schema: 'accounting'},
            'academic_record_emission_reason',
            {allowNull: true, type: Sequelize.TEXT}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn(
            {tableName: 'Payment', schema: 'accounting'},
            'academic_record_emission_reason'
        );
        await queryInterface.removeColumn(
            {tableName: 'Payment', schema: 'accounting'},
            'academic_record_emission_date'
        );
    },
};
