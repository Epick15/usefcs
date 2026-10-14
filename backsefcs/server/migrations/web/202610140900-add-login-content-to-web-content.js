'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = {tableName: 'Web_content', schema: 'web'};
    await queryInterface.addColumn(table, 'login_entity_name', {type: Sequelize.STRING(200), allowNull: true});
    await queryInterface.addColumn(table, 'login_welcome_title', {type: Sequelize.STRING(200), allowNull: true});
    await queryInterface.addColumn(table, 'login_welcome_description', {type: Sequelize.TEXT, allowNull: true});
    await queryInterface.addColumn(table, 'login_form_title', {type: Sequelize.STRING(200), allowNull: true});
    await queryInterface.addColumn(table, 'login_form_description', {type: Sequelize.TEXT, allowNull: true});
  },
  down: async queryInterface => {
    const table = {tableName: 'Web_content', schema: 'web'};
    await queryInterface.removeColumn(table, 'login_form_description');
    await queryInterface.removeColumn(table, 'login_form_title');
    await queryInterface.removeColumn(table, 'login_welcome_description');
    await queryInterface.removeColumn(table, 'login_welcome_title');
    await queryInterface.removeColumn(table, 'login_entity_name');
  }
};
