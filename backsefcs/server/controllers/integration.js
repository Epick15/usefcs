const Sequelize = require("sequelize");
const Student = require("../models").Student;
const Person = require("../models").Person;
const Program = require("../models").Programs;
const Payment = require("../models").Payment;
const DocumentBook = require("../models").Document_book;

const {Op} = Sequelize;

// Concepto institucional: Constancia de expedito de sustentación.
const EXPEDITO_SUSTENTATION_CONCEPT_ID = 130;
const PAID_PAYMENT_TYPES = ["Pagado", "Aceptado", "Regularizado", "Confirmado"];
const DEBT_PAYMENT_TYPES = ["Pendiente", "Registrado"];

const toAmount = (amount) => Number.parseFloat(amount || 0);

module.exports = {
    getStudentAcademicStatus: async (req, res) => {
        const documentNumber = String(req.params.documentNumber || "").trim();

        // DNI (8), CE y documentos extranjeros: no se impone una longitud fija.
        if (!/^[A-Za-z0-9-]{6,15}$/.test(documentNumber)) {
            return res.status(400).send({message: "Número de documento inválido."});
        }

        try {
            const students = await Student.findAll({
                attributes: ["id", "id_program"],
                where: {state: true},
                include: [
                    {
                        model: Person,
                        as: "Person",
                        required: true,
                        attributes: ["document_number"],
                        where: {document_number: documentNumber},
                    },
                    {
                        model: Program,
                        as: "Program",
                        required: false,
                        attributes: ["denomination"],
                    },
                ],
                order: [["id", "ASC"]],
            });

            if (!students.length) {
                return res.status(404).send({
                    found: false,
                    document_number: documentNumber,
                    students: [],
                });
            }

            const studentIds = students.map((student) => student.id);
            const [debts, sustentationPayments, sustentationDocuments] = await Promise.all([
                Payment.findAll({
                    attributes: ["id_student", "amount"],
                    where: {
                        id_student: {[Op.in]: studentIds},
                        type: {[Op.in]: DEBT_PAYMENT_TYPES},
                    },
                }),
                Payment.findAll({
                    attributes: ["id", "id_student", "type", "amount", "created_at"],
                    where: {
                        id_student: {[Op.in]: studentIds},
                        id_concept: EXPEDITO_SUSTENTATION_CONCEPT_ID,
                    },
                    order: [["created_at", "DESC"]],
                }),
                DocumentBook.findAll({
                    attributes: ["id", "id_student", "document_code", "created_at"],
                    where: {
                        id_student: {[Op.in]: studentIds},
                        id_concept: EXPEDITO_SUSTENTATION_CONCEPT_ID,
                        state: true,
                    },
                    order: [["created_at", "DESC"]],
                }),
            ]);

            const debtsByStudent = new Map();
            debts.forEach((payment) => {
                const current = debtsByStudent.get(payment.id_student) || {count: 0, amount: 0};
                current.count += 1;
                current.amount += toAmount(payment.amount);
                debtsByStudent.set(payment.id_student, current);
            });
            const paymentByStudent = new Map();
            sustentationPayments.forEach((payment) => {
                if (!paymentByStudent.has(payment.id_student)) paymentByStudent.set(payment.id_student, payment);
            });
            const documentByStudent = new Map();
            sustentationDocuments.forEach((document) => {
                if (!documentByStudent.has(document.id_student)) documentByStudent.set(document.id_student, document);
            });

            const result = students.map((student) => {
                const debt = debtsByStudent.get(student.id) || {count: 0, amount: 0};
                const operation = paymentByStudent.get(student.id);
                const constancy = documentByStudent.get(student.id);

                return {
                    student_id: student.id,
                    program: student.Program ? student.Program.denomination : null,
                    has_debt: debt.count > 0,
                    debt_count: debt.count,
                    debt_amount: Number(debt.amount.toFixed(2)),
                    sustentation_expedito: {
                        has_operation: Boolean(operation),
                        operation_paid: Boolean(operation && PAID_PAYMENT_TYPES.includes(operation.type)),
                        operation_status: operation ? operation.type : null,
                        has_constancy: Boolean(constancy),
                        document_code: constancy ? constancy.document_code : null,
                        issued_at: constancy ? constancy.created_at : null,
                    },
                };
            });

            return res.status(200).send({
                found: true,
                document_number: documentNumber,
                students: result,
            });
        } catch (error) {
            console.error("Error al consultar integración académica:", error);
            return res.status(500).send({message: "No se pudo consultar el estado académico."});
        }
    },
};
