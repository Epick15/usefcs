'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    {tableName: 'Web_content', schema: 'web'},
    'login_background_image',
    {type: Sequelize.STRING(255), allowNull: true}
  ),
  down: queryInterface => queryInterface.removeColumn(
    {tableName: 'Web_content', schema: 'web'},
    'login_background_image'
  )
};
