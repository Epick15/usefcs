'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('WebAuthority', {
    name: {allowNull: false, type: DataTypes.STRING(200)},
    position: {allowNull: false, type: DataTypes.STRING(200)},
    image: {allowNull: true, type: DataTypes.STRING(255)},
    legacy_image: {allowNull: true, type: DataTypes.STRING(50)},
    display_order: {allowNull: false, defaultValue: 1, type: DataTypes.INTEGER},
    published: {allowNull: false, defaultValue: true, type: DataTypes.BOOLEAN}
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    underscored: true,
    tableName: 'Web_authority',
    schema: 'web'
});
