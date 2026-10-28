const Sequelize = require('sequelize');
const message = require('../../messages');
const Op = Sequelize.Op;
const fs = require('fs');
const Fn = Sequelize.fn;
const Col = Sequelize.col;
const Model = require('../../models').Payment;
const Concept = require('../../models').Concept;
const Registration = require('../../models').Registration;
const Student = require('../../models').Student;
const Academic_semester = require('../../models').Academic_semester;
const Academic_calendar = require('../../models').Academic_calendar;
const Movement = require('../../models').Movement;
const PaymentDateChange = require('../../models').Payment_date_change;

const k = new Buffer.alloc(32);
const v = new Buffer.alloc(16);

const ST = Model.sequelize;
const academicRecordFilter = {
    [Op.iLike]: '%Record Académico%'
};

const findAcademicRecordPayment = (idStudent, transaction) => Model.findOne({
    where: {id_student: idStudent},
    include: [{
        model: Concept,
        as: 'Concept',
        required: true,
        where: {denomination: academicRecordFilter}
    }],
    order: [['created_at', 'DESC']],
    transaction
});

module.exports = {
    listPaymentStudent: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                    records = await Model.findAll({
                        where: {id_student: req.params.id},
                        include: [
                            {
                                model: Concept,
                                as: "Concept"
                            },
                            {
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    model: Academic_calendar,
                                    as: "Academic_calendar",

                                }
                            }
                        ],
                        order: [['created_at', 'asc']],
                    }, {transaction: true})
                }
            );
            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    listPaymentStudentOperation: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                    records = await Model.findAll({
                        where: {id_student: req.params.id},
                        include: [
                            {
                                model: Concept,
                                as: "Concept"
                            },
                            {
                                model: Academic_semester,
                                as: "Academic_semester",
                                include: {
                                    model: Academic_calendar,
                                    as: "Academic_calendar",

                                }
                            }
                        ],
                        order: [['created_at', 'asc']],
                    }, {transaction: true})
                }
            );
            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    listPaymentRetirementByStudent: async (req, res) => {
        try {
            let records;
            await ST.transaction(async (t) => {
                    records = await Model.findOne({
                        attributes: ['id', 'denomination', 'type', 'state'],
                        where: {id_student: req.params.id, state: false, id_concept: 6},
                        include: [
                            {
                                attributes: ['denomination'],
                                model: Concept,
                                as: "Concept"
                            }

                        ],
                        order: [['created_at', 'asc']],
                    }, {transaction: true})
                }
            );
            res.status(200).send(records);
        } catch (err) {
            console.log(err);
            res.status(445).send(err)
        }
    },
    updateStatePayment: async (req, res) => {
        try {
            let movements = [];
            await ST.transaction(async (t) => {
                let concepts = JSON.parse(req.body.concepts)
                let sizeConcepts = concepts.length;
                let arrayTemRegistration = [];
                for (let i = 0; i < concepts.length; i++) {

                    let movementTemp = await Model.findByPk(concepts[i].id)
                    let movementTempData = await movementTemp.update({type: concepts[i].type}, {transaction: t});
                    movements.push(movementTempData);
                    if (movementTemp.denomination === 'Matrícula' && concepts[i].type === 'Pagado') {
                        arrayTemRegistration.push({id: movementTemp.id_registration, state: 'Pagado'})
                    }
                    if (movementTemp.denomination === 'Matrícula' && concepts[i].type === 'Pendiente') {
                        arrayTemRegistration.push({id: movementTemp.id_registration, state: 'Pendiente'})
                    }
                }
                await Promise.all(movements);
                let tempRegistrationPromise = [];
                for (let j = 0; j < arrayTemRegistration.length; j++) {

                    let registration = await Registration.findByPk(arrayTemRegistration[j].id);
                    let registrationData = await registration.update({state: arrayTemRegistration[j].state}, {transaction: t});
                    tempRegistrationPromise.push(registrationData);
                }
                await Promise.all(tempRegistrationPromise);
            });
            res.status(200).send(message.UPDATED_OK)
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    listTotalBalance: async (req, res) => {
        try {
            let movements = [];
            let concepts = [];
            let totalConcept = 0;
            let totalMovement = 0;
            await ST.transaction(async (t) => {

                concepts = await Model.findAll({where: {id_student: req.body.id_student, type: 'Pagado'}});
                movements = await Movement.findAll({
                    where: {
                        id_student: req.body.id_student,
                        state: {[Op.or]: ['Aceptado', 'Regularizado']}
                    }
                });

                concepts.map(item => {
                    totalConcept = parseFloat(item.amount) + totalConcept
                });
                movements.map(item => {
                    totalMovement = parseFloat(item.voucher_amount) + totalMovement
                });


            });
            res.status(200).send({totalMovement: totalMovement, totalConcept: totalConcept})
        } catch (err) {
            console.log(err);
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }

    },
    createPayment: async (req, res) => {


        try {


            await ST.transaction(async (t) => {

                let concept = await Concept.findByPk(req.body.id_concept);
                let student = await Student.findByPk(req.body.id_student);
                let maxPaymnetID = await Model.max('id', {paranoid: false}, {transaction: t});
                await Model.create({
                    id: maxPaymnetID + 1,
                    id_student: req.body.id_student,
                    id_program: student.id_program,
                    id_organic_unit: student.id_organic_unit,
                    id_semester: req.body.id_process,
                    id_concept: req.body.id_concept,
                    operation_date: new Date().toISOString().slice(0, 10),
                    denomination: concept.denomination,
                    amount: req.body.amount,
                    type: 'Pendiente',
                    generate: concept.generate ? 1 : 0,
                    state: false
                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err)
        }

    },
    updatePayment: async (req, res) => {


        try {


            await ST.transaction(async (t) => {

                let concept = await Concept.findByPk(req.body.id_concept);
                let payment = await Model.findByPk(req.params.id_payment);

                // MPT 191123
                let generateValue = () => {
                    if (payment.generate == 2) {
                        return 2;
                    } else {
                        concept.generate ? 1 : 0
                    }
                }
                // MPT 191123 END

                await payment.update({
                    id_semester: req.body.id_process,
                    id_concept: req.body.id_concept,
                    denomination: concept.denomination,
                    amount: req.body.amount,
                    generate: generateValue(),
                    // generate: concept.generate ? 1 : 0

                }, {transaction: t});
            });
            res.status(200).send({message: message.REGISTERED_OK})
        } catch (err) {

            console.log(err);
            res.status(445).send(err)
        }

    },
    getAcademicRecordEmissionDate: async (req, res) => {
        try {
            const payment = await findAcademicRecordPayment(req.params.id_student);
            if (!payment) throw {message: 'No se encontró la operación de Récord Académico'};

            res.status(200).send({
                id_payment: payment.id,
                academic_record_emission_date: payment.academic_record_emission_date,
                academic_record_emission_reason: payment.academic_record_emission_reason,
            });
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
    updateAcademicRecordEmissionDate: async (req, res) => {
        try {
            const emissionDate = req.body.academic_record_emission_date;
            const emissionReason = (req.body.academic_record_emission_reason || '').trim();

            if (!emissionDate || !emissionReason) {
                throw {message: 'La fecha de emisión y el motivo son obligatorios'};
            }

            await ST.transaction(async (t) => {
                const selectedPayment = await Model.findByPk(req.params.id_payment, {transaction: t});
                if (!selectedPayment) throw {message: 'No se encontró la operación'};
                const payment = await findAcademicRecordPayment(
                    selectedPayment.id_student,
                    t
                );
                if (!payment) {
                    throw {message: 'No se encontró la operación de Récord Académico'};
                }

                await payment.update({
                    academic_record_emission_date: emissionDate,
                    academic_record_emission_reason: emissionReason,
                }, {transaction: t});
            });

            res.status(200).send({message: message.UPDATED_OK});
        } catch (err) {
            console.log(err);
            res.status(445).send(err);
        }
    },
    togglePaymentAnnulment: async (req, res) => {
        try {
            const reason = (req.body.reason || '').trim();
            if (!reason) throw {message: 'El motivo es obligatorio'};

            await ST.transaction(async (t) => {
                const payment = await Model.findByPk(req.params.id, {transaction: t});
                if (!payment) throw {message: 'No se encontró la operación'};

                if (payment.type === 'Anulado') {
                    await payment.update({
                        type: payment.annulled_previous_type || 'Pendiente',
                        reactivation_reason: reason,
                        reactivated_at: new Date(),
                        reactivated_by: req.userId,
                    }, {transaction: t});
                    return;
                }

                await payment.update({
                    annulled_previous_type: payment.type,
                    type: 'Anulado',
                    cancellation_reason: reason,
                    cancelled_at: new Date(),
                    cancelled_by: req.userId,
                    reactivation_reason: null,
                    reactivated_at: null,
                    reactivated_by: null,
                }, {transaction: t});
            });

            res.status(200).send({message: message.UPDATED_OK});
        } catch (err) {
            console.log(err);
            res.status(445).send({message: err.message || message.ERROR_TRANSACTION, error: err});
        }
    },
    updateOperationDate: async (req, res) => {
        try {
            const operationDate = String(req.body.operation_date || '').trim();
            const reason = String(req.body.reason || '').trim();
            const parsedOperationDate = new Date(`${operationDate}T00:00:00Z`);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(operationDate) ||
                Number.isNaN(parsedOperationDate.getTime()) ||
                parsedOperationDate.toISOString().slice(0, 10) !== operationDate) {
                throw {message: 'La fecha de operación no es válida'};
            }
            if (!reason) throw {message: 'El sustento del cambio de fecha es obligatorio'};

            await ST.transaction(async (t) => {
                const payment = await Model.findByPk(req.params.id, {transaction: t});
                if (!payment) throw {message: 'No se encontró la operación'};
                if (payment.type === 'Anulado') {
                    throw {message: 'No se puede modificar la fecha de una operación anulada'};
                }

                const previousDate = payment.operation_date || payment.created_at.toISOString().slice(0, 10);
                if (previousDate === operationDate) {
                    throw {message: 'La nueva fecha debe ser diferente a la registrada'};
                }

                await payment.update({operation_date: operationDate}, {transaction: t});
                await PaymentDateChange.create({
                    id_payment: payment.id,
                    previous_date: previousDate,
                    new_date: operationDate,
                    reason,
                    changed_by: req.userId,
                }, {transaction: t});
            });

            res.status(200).send({message: message.UPDATED_OK});
        } catch (err) {
            console.log(err);
            res.status(445).send({message: err.message || message.ERROR_TRANSACTION, error: err});
        }
    },
    destroyPayment: async (req, res) => {
        try {
            // Una operación forma parte del historial contable y puede sustentar
            // documentos numerados. Nunca se borra: debe anularse con motivo.
            res.status(409).send({message: 'La operación no puede eliminarse. Anúlela indicando el motivo.'});
        } catch (err) {
            console.log(err)
            res.status(445).send({message: message.ERROR_TRANSACTION, error: err})
        }
    }
};
