const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const Model = require('../../models').Movement;
const Concepts = require('../../models').Concepts;
const Payment = require('../../models').Payment;
const Student = require('../../models').Student;
const Person = require('../../models').Person;
const Organic_unit = require('../../models').Organic_unit;
const Program = require('../../models').Programs;
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Literal = Sequelize.literal;
const fs = require('fs').promises;
const crypt = require('node-cryptex');
const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);
const ST = Model.sequelize;
const URL_PLUBLIC = require("../Abox").URL_PLUBLIC;
const url_person_voucher = URL_PLUBLIC + 'person/voucher/';

const getVoucherYear = (voucherDate) => {
    if (typeof voucherDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(voucherDate)) {
        throw new Error('La fecha de la boleta debe tener el formato AAAA-MM-DD');
    }

    const parsedDate = new Date(`${voucherDate}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== voucherDate) {
        throw new Error('La fecha de la boleta no es válida');
    }

    return Number(voucherDate.slice(0, 4));
};

const getVoucherCode = (voucherCode) => {
    const code = typeof voucherCode === 'string' ? voucherCode.trim() : '';
    if (!code) throw new Error('El número de boleta es obligatorio');
    return code;
};

const voucherWhere = (voucherCode, voucherYear, excludeId) => ({
    voucher_code: voucherCode,
    voucher_year: voucherYear,
    ...(excludeId ? {id: {[Op.ne]: excludeId}} : {})
});
module.exports = {
    createMovement: async (req, res) => {
        let archive = "";
        let tmp_path = "";
        let voucherYear;
        let voucherCode;
        try {
            voucherYear = getVoucherYear(req.body.voucher_date);
            voucherCode = getVoucherCode(req.body.voucher_code);
            archive = req.body.id_student + '-' + voucherYear + '-' + voucherCode + '.' + req.files.file.name.split('.').pop();
            tmp_path = req.files.file.path;
            let target_path = url_person_voucher + archive;
            let movement = await Model.findOne({where: voucherWhere(voucherCode, voucherYear)});
            if (movement) {
                throw 'Error el comprobante ya ha sido registrado!!'
            } else {
                //copy file in new route
                await fs.copyFile(tmp_path, target_path);
            }
            // delete temp file
            await fs.unlink(tmp_path);
        } catch (e) {
            if (tmp_path) {
                try {
                    await fs.unlink(tmp_path);
                } catch (_) {
                    // El archivo temporal ya pudo haberse eliminado.
                }
            }
            return res.status(444).send(e.message || e)
        }

        try {


            await ST.transaction(async (t) => {
                let movement = await Model.findOne({where: voucherWhere(voucherCode, voucherYear), transaction: t});
                if (movement) throw "Ya se ha registrado ese número de voucher";

                let maxMovementID = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: maxMovementID + 1,
                    id_student: req.body.id_student,
                    id_program: req.body.id_program,
                    id_organic_unit: req.body.id_organic_unit,
                    id_user: req.body.id_user,
                    denomination: req.body.denomination,
                    voucher_code: voucherCode,
                    voucher_year: voucherYear,
                    voucher_amount: req.body.voucher_amount,
                    voucher_date: req.body.voucher_date,
                    voucher_url: archive,
                    observation: req.body.observation,
                    type: req.body.type,
                    state: req.body.state
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err.message || err)
        }

    },
    listMovement: async (req, res) => {
        try {
            let record = await Model.findAll({
                where: {id_student: req.params.id_student},
                order: [['updated_at', 'asc']]
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    listMovementPendientByOrganicUnit: async (req, res) => {
        try {
            let record = await Model.findAll({
                attributes: {exclude: ['id_student', 'id_program', 'id_organic_unit', 'id_user']},
                where: {
                    id_organic_unit: req.params.id_organic_unit,
                    state: 'Registrado'
                },
                include: {
                    attributes: ['id'],
                    model: Student,
                    as: 'Student',
                    include: [
                        {
                            attributes: [[Fn('CONCAT', Col('name'), ' ', Col('paternal'), ' ', Col('maternal')), 'name'], 'document_number'],
                            model: Person, as: 'Person'
                        },
                        {
                            attributes: ['id', 'description'],
                            model: Program,
                            as: "Program"
                        },
                    ]
                }
            });
            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },
    searchVoucherStudent: async (req, res) => {
        try {
            let record = await Model.findAll({
                attributes: ['voucher_code', 'voucher_year', 'voucher_amount', 'voucher_date', 'voucher_url', 'observation', 'type', 'state', 'created_at', 'updated_at'],
                where: {voucher_code: {[Op.iLike]: '%' + req.params.parameter + '%'}},
                include: [
                    {
                        attributes: ['state'],
                        model: Student,
                        as: 'Student',
                        include: {
                            attributes: ['document_number', 'email', [Fn('CONCAT', Col('paternal'), ' ', Col('maternal'), ' ', Col('name')), 'name']],
                            model: Person,
                            as: "Person"
                        },
                    },
                    {
                        attributes: ['description'],
                        model: Program,
                        as: 'Program'
                    },

                ]


            });

            res.status(200).send(record)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.RECORD_NOT_FOUND, err: err})
        }

    },

    updateMovement: async (req, res) => {
        let archive = "";
        let tmp_path = "";
        let movementTemp;
        let voucherYear;
        let voucherCode;

        try {
            voucherYear = getVoucherYear(req.body.voucher_date);
            voucherCode = getVoucherCode(req.body.voucher_code);
            movementTemp = await Model.findByPk(req.params.id);
            if (!movementTemp) throw new Error('No se encontró el comprobante');

            const duplicate = await Model.findOne({
                where: voucherWhere(voucherCode, voucherYear, movementTemp.id)
            });
            if (duplicate) throw new Error('Ya se ha registrado ese número de voucher para este año');
        } catch (err) {
            return res.status(444).send(err.message || err);
        }

        if (req.files && req.files.file) {
            const path = url_person_voucher + movementTemp.voucher_url;
            try {
                archive = req.body.id_student + '-' + voucherYear + '-' + voucherCode + '.' + req.files.file.name.split('.').pop();
                tmp_path = req.files.file.path;
                let target_path = url_person_voucher + archive;
                await fs.copyFile(tmp_path, target_path);
                await fs.unlink(tmp_path);

                if (path !== target_path) {
                    try {
                        await fs.unlink(path);
                    } catch (err) {
                        console.error(err);
                    }
                }
            } catch (e) {
                if (tmp_path) {
                    try {
                        await fs.unlink(tmp_path);
                    } catch (_) {
                        // El archivo temporal ya pudo haberse eliminado.
                    }
                }
                return res.status(444).send(e.message || e);
            }
        }

        try {

            await ST.transaction(async (t) => {


                let movementTemp = await Model.findByPk(req.params.id, {transaction: t})
                await movementTemp.update({
                    denomination: req.body.denomination,
                    voucher_amount: req.body.voucher_amount,
                    // MPT
                    voucher_code: voucherCode,
                    voucher_year: voucherYear,
                    // MPT END
                    voucher_date: req.body.voucher_date,
                    voucher_url: archive !== '' ? archive : movementTemp.voucher_url,
                    observation: req.body.observation,
                    type: req.body.type,
                    state: req.body.state
                }, {transaction: t});


            });

            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }


    },

    destroyMovement: async (req, res) => {
        try {

            await ST.transaction(async (t) => {


                let movementTemp = await Model.findByPk(req.params.id)
                if (movementTemp.state == 'Aceptado') {
                    throw "El comprobante tiene estado Aceptado. para eliminarlo debe estar con estado Registrado";
                }
                await movementTemp.destroy({transaction: t});
                // const path = url_person_voucher + movementTemp.voucher_url;

                // try {
                //     await fs.unlink(path);
                // } catch (err) {
                //    throw "Ocurrio un error al Eliminar comprobante, Por favor intentelo nuevamente";
                // }
            });

            res.status(200).send({message: message.DELETED_OK})
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
