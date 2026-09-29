'use strict';

module.exports = {
    up: async queryInterface => {
        await queryInterface.sequelize.query(`
            INSERT INTO security."Privilege" (id, id_role, id_module, permit, state, created_at, updated_at)
            SELECT sequence.next_id + permits.order_index, 1, module.id, permits.permit, true, NOW(), NOW()
            FROM security."Module" AS module
            CROSS JOIN (SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM security."Privilege") AS sequence
            CROSS JOIN (VALUES ('0'::security."enum_Privilege_permit", 0), ('1'::security."enum_Privilege_permit", 1), ('2'::security."enum_Privilege_permit", 2), ('3'::security."enum_Privilege_permit", 3)) AS permits(permit, order_index)
            WHERE module.url = '/web-content'
              AND NOT EXISTS (
                  SELECT 1 FROM security."Privilege" AS privilege
                  WHERE privilege.id_role = 1 AND privilege.id_module = module.id AND privilege.permit = permits.permit
              );
        `);
    },
    down: async queryInterface => {
        await queryInterface.sequelize.query(`
            DELETE FROM security."Privilege" WHERE id_role = 1 AND id_module IN (
                SELECT id FROM security."Module" WHERE url = '/web-content'
            )
        `);
    }
};
