'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('WebContent', {
    presentation: {allowNull: true, type: DataTypes.TEXT},
    mission: {allowNull: true, type: DataTypes.TEXT},
    vision: {allowNull: true, type: DataTypes.TEXT}
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,
    underscored: true,
    tableName: 'Web_content',
    schema: 'web'
});
