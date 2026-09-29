'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({tableName: 'Web_specialty', schema: 'web'}, {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
      id_program: {type: Sequelize.INTEGER, allowNull: false}, slug: {type: Sequelize.STRING(60), allowNull: false, unique: true},
      title: Sequelize.TEXT, objectives: {type: Sequelize.JSONB, allowNull: false, defaultValue: []}, competencies: {type: Sequelize.JSONB, allowNull: false, defaultValue: []},
      color: {type: Sequelize.STRING(20), allowNull: false, defaultValue: '#811632'}, background_color: {type: Sequelize.STRING(20), allowNull: false, defaultValue: '#f8f6f3'},
      published: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true}, created_at: Sequelize.DATE, updated_at: Sequelize.DATE
    });
    const now = new Date();
    await queryInterface.bulkInsert({tableName: 'Web_specialty', schema: 'web'}, [
      {id_program: 5, slug: 'aro', title: 'Segunda Especialidad en Obstetricia de Alto Riesgo con mención en Cuidados Intensivos Maternos', objectives: JSON.stringify([]), competencies: JSON.stringify([]), color: '#03437d', background_color: '#f4f8ff', published: true, created_at: now, updated_at: now},
      {id_program: 1, slug: 'eco', title: 'Segunda Especialidad en Ecografía Obstétrica con mención en Monitoreo Fetal Electrónico', objectives: JSON.stringify([]), competencies: JSON.stringify([]), color: '#74ae08', background_color: '#f4fde3', published: true, created_at: now, updated_at: now},
      {id_program: 3, slug: 'cacu', title: 'Segunda Especialidad en Salud Reproductiva con mención en Prevención de Cáncer de Cuello Uterino y Mama', objectives: JSON.stringify([]), competencies: JSON.stringify([]), color: '#fa549e', background_color: '#fae6e5', published: true, created_at: now, updated_at: now}
    ]);
  },
  down: async queryInterface => queryInterface.dropTable({tableName: 'Web_specialty', schema: 'web'})
};
