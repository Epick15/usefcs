'use strict';

module.exports = {
    up: async queryInterface => {
        await queryInterface.sequelize.query(`
            INSERT INTO security."Module" (
                id, id_parent, module_name, type, classes, icon, code, "order", denomination, url, state, created_at, updated_at
            )
            SELECT next_id, 2, 'web-content', 'item', 'nav-item', 'feather icon-globe', '', 14,
                   'Contenido web', '/web-content', true, NOW(), NOW()
            FROM (SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM security."Module") AS sequence
            WHERE NOT EXISTS (
                SELECT 1 FROM security."Module" WHERE url = '/web-content' AND deleted_at IS NULL
            );
        `);
    },
    down: async queryInterface => {
        await queryInterface.sequelize.query(`DELETE FROM security."Module" WHERE url = '/web-content'`);
    }
};
