'use strict';
module.exports = (sequelize, DataTypes) => sequelize.define('WebSpecialty', {
    id_program: {type: DataTypes.INTEGER, allowNull: false},
    slug: {type: DataTypes.STRING(60), allowNull: false, unique: true},
    title: {type: DataTypes.TEXT, allowNull: true},
    objectives: {type: DataTypes.JSONB, allowNull: false, defaultValue: []},
    competencies: {type: DataTypes.JSONB, allowNull: false, defaultValue: []},
    color: {type: DataTypes.STRING(20), allowNull: false, defaultValue: '#811632'},
    background_color: {type: DataTypes.STRING(20), allowNull: false, defaultValue: '#f8f6f3'},
    published: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
}, {timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', paranoid: false, underscored: true, tableName: 'Web_specialty', schema: 'web'});
