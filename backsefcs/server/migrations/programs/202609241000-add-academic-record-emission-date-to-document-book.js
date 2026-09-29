'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            {tableName: 'Document_book', schema: 'programs'},
            'academic_record_emission_date',
            {allowNull: true, type: Sequelize.DATEONLY}
        );
        await queryInterface.addColumn(
            {tableName: 'Document_book', schema: 'programs'},
            'academic_record_emission_reason',
            {allowNull: true, type: Sequelize.TEXT}
        );
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn(
            {tableName: 'Document_book', schema: 'programs'},
            'academic_record_emission_reason'
        );
        await queryInterface.removeColumn(
            {tableName: 'Document_book', schema: 'programs'},
            'academic_record_emission_date'
        );
    },
};
