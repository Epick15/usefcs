'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.addColumn({tableName: 'Web_admission', schema: 'web'}, 'id_process', {allowNull: true, type: Sequelize.INTEGER}),
    down: async queryInterface => queryInterface.removeColumn({tableName: 'Web_admission', schema: 'web'}, 'id_process')
};
