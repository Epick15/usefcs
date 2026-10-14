'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {tableName: 'Web_content', schema: 'web'},
      'login_background_text_visible',
      {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true}
    );
    await queryInterface.sequelize.query(`
      UPDATE web."Web_content"
      SET login_background_text_visible = COALESCE(login_background_text_visible, true)
    `);
  },
  down: queryInterface => queryInterface.removeColumn(
    {tableName: 'Web_content', schema: 'web'},
    'login_background_text_visible'
  )
};
