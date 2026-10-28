'use strict';

module.exports = {
    up: async (queryInterface) => {
        // User_intranet identifica a los usuarios con UUID. Se preservan
        // eventuales valores numéricos históricos convirtiéndolos a texto.
        await queryInterface.sequelize.query(`
            ALTER TABLE accounting."Payment"
            ALTER COLUMN cancelled_by TYPE VARCHAR(50)
            USING cancelled_by::text
        `);
        await queryInterface.sequelize.query(`
            ALTER TABLE accounting."Payment"
            ALTER COLUMN reactivated_by TYPE VARCHAR(50)
            USING reactivated_by::text
        `);
    },
    down: async () => {
        // No se revierte: UUID no puede convertirse de forma segura a INTEGER.
    }
};
