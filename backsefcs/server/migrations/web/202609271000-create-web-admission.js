'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Web_admission', {
            id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
            id_admission_plan: {allowNull: true, type: Sequelize.INTEGER},
            title: {allowNull: true, type: Sequelize.STRING(200)},
            subtitle: {allowNull: true, type: Sequelize.STRING(255)},
            audience: {allowNull: true, type: Sequelize.STRING(255)},
            requirements: {allowNull: true, type: Sequelize.JSONB},
            schedule: {allowNull: true, type: Sequelize.JSONB},
            calendar: {allowNull: true, type: Sequelize.JSONB},
            whatsapp_url: {allowNull: true, type: Sequelize.TEXT},
            created_at: {allowNull: false, type: Sequelize.DATE},
            updated_at: {allowNull: false, type: Sequelize.DATE}
        }, {schema: 'web'});
        await queryInterface.bulkInsert({tableName: 'Web_admission', schema: 'web'}, [{
            title: 'ADMISIÓN 2026-II', subtitle: 'Segunda Especialidad en Obstetricia', audience: 'DIRIGIDO A PROFESIONALES TITULADOS EN OBSTETRICIA',
            requirements: JSON.stringify(['Copia simple del Título Profesional de Obstetra registrado en SUNEDU.', 'Copia simple del DNI.', 'Solicitud de inscripción, compromiso de pago de estudios, compromiso de entrega de documentos y declaración jurada.', 'Recibo de pago por derecho de inscripción y/o admisión.', 'Ficha de datos.']),
            schedule: JSON.stringify([{day: 'SÁBADOS', time: '3:00 pm - 8:00 pm', detail: '5 horas'}, {day: 'DOMINGOS', time: '8:00 am - 1:00 pm', detail: '5 horas'}]),
            calendar: JSON.stringify([{activity: 'Inscripción y presentación de documentos', date: 'Hasta el 04 de marzo 2026 (Hora límite 2:45 pm)'}, {activity: 'Evaluación de expedientes', date: '05 y 06 de marzo 2026'}, {activity: 'Examen de admisión', date: '07 de marzo 2026 (9 a 12 am)'}, {activity: 'Inicio de clases, ciclo I', date: '21 de marzo 2026'}]),
            whatsapp_url: 'https://api.whatsapp.com/send?phone=51989032962', created_at: new Date(), updated_at: new Date()
        }]);
    },
    down: async queryInterface => queryInterface.dropTable('Web_admission', {schema: 'web'})
};
