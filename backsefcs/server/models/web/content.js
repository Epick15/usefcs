'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('WebContent', {
    presentation: {allowNull: true, type: DataTypes.TEXT},
    mission: {allowNull: true, type: DataTypes.TEXT},
    vision: {allowNull: true, type: DataTypes.TEXT},
    login_entity_name: {allowNull: true, type: DataTypes.STRING(200)},
    login_welcome_title: {allowNull: true, type: DataTypes.STRING(200)},
    login_welcome_description: {allowNull: true, type: DataTypes.TEXT},
    login_form_title: {allowNull: true, type: DataTypes.STRING(200)},
    login_form_description: {allowNull: true, type: DataTypes.TEXT},
    login_background_image: {allowNull: true, type: DataTypes.STRING(255)},
    login_text_color: {allowNull: true, type: DataTypes.STRING(7)},
    login_background_text_color: {allowNull: true, type: DataTypes.STRING(7)},
    login_form_position: {allowNull: true, type: DataTypes.STRING(10)},
    login_background_text_visible: {allowNull: false, type: DataTypes.BOOLEAN, defaultValue: true}
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,
    underscored: true,
    tableName: 'Web_content',
    schema: 'web'
});
