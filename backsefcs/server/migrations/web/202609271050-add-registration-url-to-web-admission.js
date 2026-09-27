'use strict';
module.exports = {
  up: queryInterface => queryInterface.addColumn({tableName: 'Web_admission', schema: 'web'}, 'registration_url', {type: require('sequelize').TEXT, allowNull: true}),
  down: queryInterface => queryInterface.removeColumn({tableName: 'Web_admission', schema: 'web'}, 'registration_url')
};
