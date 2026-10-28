'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Payment_date_change', {
        id_payment: {allowNull: false, type: DataTypes.INTEGER},
        previous_date: {allowNull: false, type: DataTypes.DATEONLY},
        new_date: {allowNull: false, type: DataTypes.DATEONLY},
        reason: {allowNull: false, type: DataTypes.TEXT},
        changed_by: {allowNull: false, type: DataTypes.STRING(50)},
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        // La configuración global usa paranoid=true; este historial es
        // inmutable y su tabla no tiene deleted_at.
        paranoid: false,
        underscored: true,
        tableName: 'Payment_date_change',
        schema: 'accounting',
    });
};
