'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {tableName: 'Web_content', schema: 'web'},
      'login_form_position',
      {type: Sequelize.STRING(10), allowNull: true, defaultValue: 'right'}
    );
    await queryInterface.sequelize.query(`
      UPDATE web."Web_content"
      SET login_form_position = COALESCE(login_form_position, 'right')
    `);
  },
  down: queryInterface => queryInterface.removeColumn(
    {tableName: 'Web_content', schema: 'web'},
    'login_form_position'
  )
};
