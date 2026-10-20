'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            {tableName: 'Registration_course', schema: 'registration'},
            'grade_payment_override',
            {allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false}
        );
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn(
            {tableName: 'Registration_course', schema: 'registration'},
            'grade_payment_override'
        );
    }
};
