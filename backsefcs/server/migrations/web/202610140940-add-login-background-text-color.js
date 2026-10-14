'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {tableName: 'Web_content', schema: 'web'},
      'login_background_text_color',
      {type: Sequelize.STRING(7), allowNull: true, defaultValue: '#ffffff'}
    );
    await queryInterface.sequelize.query(`
      UPDATE web."Web_content"
      SET login_background_text_color = COALESCE(login_background_text_color, '#ffffff')
    `);
  },
  down: queryInterface => queryInterface.removeColumn(
    {tableName: 'Web_content', schema: 'web'},
    'login_background_text_color'
  )
};
