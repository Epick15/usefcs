const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV;

const config = require(`${__dirname}/../config/config.json`)[env];
const databaseConfig = {
    ...config,
    // Permite que cada VPS configure su propia conexión sin versionar secretos
    // ni depender de un nombre fijo de base de datos.
    database: process.env.DB_DATABASE || config.database,
    username: process.env.DB_USERNAME || config.username,
    password: process.env.DB_PASSWORD || config.password,
    host: process.env.DB_HOST || config.host,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : config.port,
};
const db = {};

let sequelize;
sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    databaseConfig
);

fs.readdirSync(__dirname + "/registration")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/registration", file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

fs.readdirSync(__dirname + "/person")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/person", file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

fs.readdirSync(__dirname + "/security")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/security", file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });
fs.readdirSync(__dirname + "/programs")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/programs", file))(
            sequelize,
            Sequelize.DataTypes
        );

        db[model.name] = model;
    });

fs.readdirSync(__dirname + "/accounting")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/accounting", file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });
fs.readdirSync(__dirname + "/general")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/general", file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

// ggggggggggggggggggggg

fs.readdirSync(__dirname + "/web")
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname + "/web", file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

// ggggggggggggggggggg

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
