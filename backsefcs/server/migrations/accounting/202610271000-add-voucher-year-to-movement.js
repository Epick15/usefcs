'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(
            {tableName: 'Movement', schema: 'accounting'},
            'voucher_year',
            {type: Sequelize.SMALLINT, allowNull: true}
        );

        // La fecha histórica se guarda como texto. Se completa el año cuando
        // empieza con una fecha ISO (AAAA-MM-DD); los registros no migrables
        // permanecen nulos para su corrección manual.
        await queryInterface.sequelize.query(`
            UPDATE accounting."Movement"
            SET voucher_year = SUBSTRING(voucher_date FROM 1 FOR 4)::SMALLINT
            WHERE voucher_date ~ '^\\d{4}-\\d{2}-\\d{2}$'
        `);

        await queryInterface.addIndex(
            {tableName: 'Movement', schema: 'accounting'},
            ['voucher_code', 'voucher_year'],
            {
                name: 'Movement_voucher_code_year_active_unique',
                unique: true,
                where: {
                    deleted_at: null,
                    voucher_year: {[Sequelize.Op.ne]: null}
                }
            }
        );
    },

    down: async (queryInterface) => {
        await queryInterface.removeIndex(
            {tableName: 'Movement', schema: 'accounting'},
            'Movement_voucher_code_year_active_unique'
        );
        await queryInterface.removeColumn(
            {tableName: 'Movement', schema: 'accounting'}, 'voucher_year'
        );
    }
};
