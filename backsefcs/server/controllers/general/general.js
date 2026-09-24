const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Discount;
const Authority = require('../../models').Authority;
const Organic_unit = require('../../models').Organic_unit;
const System_configuration = require('../../models').System_configuration;
const ST = Model.sequelize;
module.exports = {

    listDiscount: async (req, res) => {
        try {
            let records = await Model.findAll({ order: [['created_at', 'asc']]});
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    listAuthority: async (req, res) => {
        try {
            let records = await Authority.findAll({
                attributes: ['id', 'id_organic_unit', 'person', 'charge', 'type', 'valid_from', 'valid_to', 'state'],
                include: {
                    attributes: ['denomination', 'abbreviation'],
                    model: Organic_unit,
                    as: 'Organic_unit'
                },
                order: [
                    [Sequelize.literal('"valid_from" IS NULL'), 'ASC'],
                    ['valid_from', 'DESC'],
                    ['valid_to', 'DESC'],
                    ['created_at', 'DESC']
                ]
            });
            res.status(200).send(records)
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    createAuthority: async (req, res) => {
        try {
            const {id_organic_unit, person, charge, type, valid_from, valid_to} = req.body;
            if (!id_organic_unit || !person || !charge || !type || !valid_from) {
                return res.status(422).send({message: 'Complete los campos obligatorios de la autoridad'});
            }
            if (valid_to && valid_to < valid_from) {
                return res.status(422).send({message: 'La fecha de fin no puede ser anterior al inicio de vigencia'});
            }
            const overlap = await Authority.findOne({
                where: {
                    id_organic_unit,
                    type,
                    state: true,
                    [Op.and]: [
                        {[Op.or]: [{valid_from: {[Op.lte]: valid_to || '9999-12-31'}}, {valid_from: null}]},
                        {[Op.or]: [{valid_to: {[Op.gte]: valid_from}}, {valid_to: null}]}
                    ]
                }
            });
            if (overlap) {
                return res.status(422).send({message: 'Ya existe una autoridad vigente para ese tipo y unidad en el periodo indicado'});
            }
            const authority = await Authority.create({id_organic_unit, person, charge, type, valid_from, valid_to, state: true});
            res.status(201).send({message: message.CREATED_OK, authority});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    updateAuthority: async (req, res) => {
        try {
            const {id_organic_unit, person, charge, type, valid_from, valid_to} = req.body;
            if (!id_organic_unit || !person || !charge || !type || !valid_from) {
                return res.status(422).send({message: 'Complete los campos obligatorios de la autoridad'});
            }
            if (valid_to && valid_to < valid_from) {
                return res.status(422).send({message: 'La fecha de fin no puede ser anterior al inicio de vigencia'});
            }
            const authority = await Authority.findByPk(req.params.id);
            if (!authority) return res.status(404).send({message: 'Autoridad no encontrada'});
            const overlap = await Authority.findOne({
                where: {
                    id: {[Op.ne]: authority.id},
                    id_organic_unit,
                    type,
                    state: true,
                    [Op.and]: [
                        {[Op.or]: [{valid_from: {[Op.lte]: valid_to || '9999-12-31'}}, {valid_from: null}]},
                        {[Op.or]: [{valid_to: {[Op.gte]: valid_from}}, {valid_to: null}]}
                    ]
                }
            });
            if (overlap) {
                return res.status(422).send({message: 'Ya existe una autoridad vigente para ese tipo y unidad en el periodo indicado'});
            }
            await authority.update({id_organic_unit, person, charge, type, valid_from, valid_to});
            res.status(200).send({message: message.UPDATED_OK, authority});
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err});
        }
    },
    updateStateAuthority: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await Authority.findByPk(req.params.id);
                await data.update({
                    state: !data.state
                }, {transaction: t});

            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    listConfig: async (req, res) => {
        try {
            let records = await System_configuration.findAll();
            res.status(200).send(records)
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    },
    updateStateConfig: async (req, res) => {
        try {
            await ST.transaction(async (t) => {
                let data = await System_configuration.findByPk(req.params.id);
                await data.update({
                    state: !data.state
                }, {transaction: t});

            });
            res.status(200).send({message: message.UPDATED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    }

};
