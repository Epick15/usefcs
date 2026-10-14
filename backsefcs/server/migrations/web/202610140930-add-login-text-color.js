'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {tableName: 'Web_content', schema: 'web'},
      'login_text_color',
      {type: Sequelize.STRING(7), allowNull: true, defaultValue: '#7c003e'}
    );
    await queryInterface.sequelize.query(`
      UPDATE web."Web_content"
      SET login_text_color = COALESCE(login_text_color, '#7c003e')
    `);
  },
  down: queryInterface => queryInterface.removeColumn(
    {tableName: 'Web_content', schema: 'web'},
    'login_text_color'
  )
};
