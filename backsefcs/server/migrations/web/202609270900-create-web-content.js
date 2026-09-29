'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS web');

        await queryInterface.createTable('Web_content', {
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            presentation: {allowNull: true, type: Sequelize.TEXT},
            mission: {allowNull: true, type: Sequelize.TEXT},
            vision: {allowNull: true, type: Sequelize.TEXT},
            created_at: {allowNull: false, type: Sequelize.DATE},
            updated_at: {allowNull: false, type: Sequelize.DATE}
        }, {schema: 'web'});

        await queryInterface.createTable('Web_authority', {
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            name: {allowNull: false, type: Sequelize.STRING(200)},
            position: {allowNull: false, type: Sequelize.STRING(200)},
            image: {allowNull: true, type: Sequelize.STRING(255)},
            legacy_image: {allowNull: true, type: Sequelize.STRING(50)},
            display_order: {allowNull: false, defaultValue: 1, type: Sequelize.INTEGER},
            published: {allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN},
            created_at: {allowNull: false, type: Sequelize.DATE},
            updated_at: {allowNull: false, type: Sequelize.DATE},
            deleted_at: {allowNull: true, type: Sequelize.DATE}
        }, {schema: 'web'});

        const now = new Date();
        await queryInterface.bulkInsert({tableName: 'Web_content', schema: 'web'}, [{
            presentation: 'La Unidad de Segunda Especialidad de la Facultad de Ciencias de la Salud de la Universidad Nacional de San Martín - Tarapoto, prosiguiendo con su labor orientada a la formación de profesionales altamente especializados en su carrera así como en el campo de la investigación mediante el estudio multidisciplinario, busca incesantemente seguir contribuyendo en dar solución a múltiples problemas dentro del ámbito local, regional, nacional e internacional.',
            mission: 'Formar especialistas en Obstetricia con un enfoque integral, basados en la excelencia académica, la innovación y la ética profesional, contribuyendo al fortalecimiento de la salud sexual y reproductiva.',
            vision: 'Ser una unidad académica de excelencia, reconocida por su contribución al desarrollo de especialistas en obstetricia que impacten positivamente en la salud de la comunidad.',
            created_at: now,
            updated_at: now
        }]);
        await queryInterface.bulkInsert({tableName: 'Web_authority', schema: 'web'}, [
            {name: 'Dr. Ricardo Raul Layza Castañeda', position: 'RECTOR', legacy_image: 'rector', display_order: 1, published: true, created_at: now, updated_at: now},
            {name: 'Obsta. PhD. Gabriela del Pilar Palomino Alvarado', position: 'DECANA', legacy_image: 'decana', display_order: 2, published: true, created_at: now, updated_at: now},
            {name: 'Obsta. Mg. Ynes Torres Flores', position: 'COORDINADORA', legacy_image: 'coordinador', display_order: 3, published: true, created_at: now, updated_at: now}
        ]);
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('Web_authority', {schema: 'web'});
        await queryInterface.dropTable('Web_content', {schema: 'web'});
    }
};
