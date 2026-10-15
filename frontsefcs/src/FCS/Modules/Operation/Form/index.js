import React from "react";
import {
    Button,
    Col,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";

import moment from "moment";
import "moment/locale/es";
import component from "../../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import Close from "@material-ui/icons/Close";
import app from "../../../Constants";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

moment.locale("es");

class FormOperation extends React.Component {
    state = {
        formOperation: this.props.formOperation,
        studentID: this.props.studentID,
        deleteOperationID: this.props.deleteOperationID,
        retriveOperation: this.props.retriveOperation,
        leaveRegistrationID: this.props.leaveRegistrationID,

        titleConcept: "",
        requeriments: "",
        academicCalendar: "",
        process: "",
        paymentID: "",
        note: "",
        multipleCredit: false,

        amount: "",
        typeRegistration: "Regular",
        academicCalendars: [],
        processs: [],
        courses: [],
        checkCourse: [],

        action: "add",
        loaderConcept: false,
        concept: "",
        concepts: [],
    };

    async componentDidMount() {
        this.setState({ organicUnit: { value: component.ORGANIC_UNIT } });
        this.listAcademicSemesterAndAcademicCalendar();
        this.listActualUit();
        this.listConceptOperation(this.state.studentID);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.formOperation !== this.props.formOperation &&
            prevProps.action !== this.props.action
        ) {
            this.props.formOperation &&
                this.props.action === "add" &&
                this.setState({ formOperation: this.props.formOperation });
        }
        if (
            prevProps.retriveOperation !== this.props.retriveOperation &&
            prevProps.action !== this.props.action
        ) {
            this.props.retriveOperation !== "" &&
                this.retriveOperation(this.props.retriveOperation);
        }
        if (prevProps.academicDegree !== this.props.academicDegree) {
            this.props.academicDegree !== "" &&
                this.setState({ academicDegree: this.props.academicDegree });
        }

        if (prevProps.deleteOperationID !== this.props.deleteOperationID) {
            this.props.deleteOperationID !== "" &&
                this.openOperationSweetAlert(this.props.deleteOperationID);
        }
        if (prevProps.leaveRegistrationID !== this.props.leaveRegistrationID) {
            this.props.leaveRegistrationID !== "" &&
                this.openLeaveRegistrationSweetAlert(
                    this.props.leaveRegistrationID
                );
        }
    }

    async listConceptOperation(id) {
        try {
            const url = app.accounting + "/payment-operation/" + id;
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                res.data.map((record, index) =>
                    this.state.concepts.push({
                        value: record.id,
                        label: record.denomination,
                        percent: record.percent,
                    })
                );
            }
        } catch (err) {
            console.log("We have the error", err);
        }
    }

    async listConceptByType() {
        try {
            const url = app.general + "/" + app.concepts + "/type/Ingreso";
            const res = await axios.get(url, app.headers);
            res.data.map((record, index) =>
                this.state.concepts.push({
                    value: record.id,
                    label:
                        record.Category_concept.description +
                        " - " +
                        record.denomination,
                    percent: record.percent,
                })
            );
        } catch (err) {
            console.log("We have the error", err);
        }
    }

    async listActualUit() {
        this.setState({ loaderData: true });
        const url = app.general + "/" + app.uit + "/year/actual";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    amountUit: res.data.amount,
                    yearUit: res.data.year,
                });
            if (this.state.loaderData) {
                this.setState({ loaderData: false });
            }
        } catch (err) {
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
            console.log(err);
        }
    }

    async listRegistrationCourse(id_plan, id_student) {
        this.setState({ admissionPlanLoader: true });
        const url =
            app.registration + "/" + app.registrations + "/" + app.course;
        try {
            let data = new FormData();
            data.set("id_plan", id_plan);
            data.set("id_student", id_student);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) this.setState({ courses: res.data });
            this.setState({ studentLoader: false });
        } catch (err) {
            this.setState({ studentLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listAcademicSemesterAndAcademicCalendar() {
        this.setState({ calendarLoader: true });
        const url =
            app.general +
            "/" +
            app.academicSemester +
            "/" +
            app.academicCalendar +
            "/all";

        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    processs: res.data,
                });
            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes de estudio",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async createPayment() {
        this.setState({ loaderOperation: true });
        const { concept, amount, process } = this.state;
        const { studentID } = this.props;

        if (
            concept !== "" &&
            amount !== "" &&
            process !== "" &&
            studentID !== ""
        ) {
            const url = app.accounting + "/" + app.payment;
            let data = new FormData();

            data.set("id_concept", concept.value);
            data.set("amount", amount);
            data.set("id_process", process);
            data.set("type", "Pendiente");
            data.set("id_student", studentID);
            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({ loaderOperation: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderOperation: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderOperation: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async updatePayment() {
        this.setState({ loaderOperation: true });
        const { concept, amount, process, paymentID } = this.state;

        if (
            concept !== "" &&
            amount !== "" &&
            process !== "" &&
            paymentID !== ""
        ) {
            const url =
                app.accounting + "/" + app.payment + "-update/" + paymentID;
            let data = new FormData();

            data.set("id_concept", concept.value);
            data.set("amount", amount);
            data.set("id_process", process);

            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({ loaderOperation: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderOperation: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderOperation: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async destroyPayment(id) {
        try {
            this.setState({ loaderEntry: true });
            const url = app.accounting + "/" + app.payment + "/" + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
            this.setState({ loaderEntry: false });
            this.props.callData();
            this.closeForm();
            return true;
        } catch (err) {
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
            this.setState({ loaderEntry: false });
            return false;
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "concept":
                this.setState({
                    concept: { value: event.value, label: event.label },
                    amount: event.percent,
                });
                break;
            case "process":
                this.setState({ process: event.target.value });
                break;
            case "amount":
                this.setState({ amount: event.target.value });
                break;
            default:
                break;
        }
    };
    retriveOperation = (r) => {
        console.log(r);
        this.setState({
            action: "update",
            paymentID: r.id,
            formOperation: true,
            concept: { value: r.id_concept, label: r.concept },
            process: r.id_process,
            amount: r.amount,
        });
        // this.listProcessByAcademicCalendarID(r.Academic_semester.Academic_calendar.id)
    };
    closeForm = () => {
        this.props.closeFormOperation();
        this.setState({
            concept: "",
            process: "",
            paymentID: "",
            amount: "",
            formOperation: false,
        });
    };

    openOperationSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: "Estás seguro?",
                text: "Este paso es irreversible!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Eliminar!",
                cancelButtonText: "No, Cancelar",
            });
            alert.isConfirmed
                ? await this.destroyPayment(id)
                : this.props.closeFormOperation();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };

    render() {
        const { concept, action, loaderConcept, process } = this.state;
        const { concepts, processs, amount } = this.state;

        return (
            <Modal
                show={this.state.formOperation}
                size={"xl"}
                backdrop="static"
                dialogClassName="management-modal"
            >
                <Modal.Header className="management-modal-header">
                    <Modal.Title as="h5">
                        {this.props.action === "add" ? "REGISTRAR" : "EDITAR"}{" "}
                        OPERACIÓN
                        <small>Registra el concepto, monto y periodo de la operación.</small>
                    </Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={
                                <Tooltip style={{ zIndex: 100000000 }}>
                                    Cerrar
                                </Tooltip>
                            }
                        >
                            <Close
                                style={{ color: "white" }}
                                onClick={() => this.closeForm()}
                            />
                        </OverlayTrigger>
                    </div>
                </Modal.Header>
                <Modal.Body className="management-modal-body">
                    <Row>
                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                            <Form.Group
                                className="form-group fill "
                                style={{ zIndex: 10000 }}
                            >
                                <Form.Label
                                    className="floating-label"
                                    style={
                                        concept === ""
                                            ? { color: "#ff5252 " }
                                            : null
                                    }
                                >
                                    Conceptos{" "}
                                    <small className="text-danger"> *</small>
                                </Form.Label>
                                <Select
                                    isSearchable
                                    value={concept}
                                    name="concept"
                                    options={concepts}
                                    classNamePrefix="select"
                                    // isLoading={coursesLoader}
                                    className="basic-single"
                                    placeholder="Buscar conceptos"
                                    onChange={this.handleChange("concept")}
                                    styles={component.selectSearchStyle}
                                />
                            </Form.Group>
                            <br />
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Form.Group className="form-group fill">
                                <Form.Label
                                    className="floating-label"
                                    style={
                                        amount === ""
                                            ? { color: "#ff5252 " }
                                            : null
                                    }
                                >
                                    Monto{" "}
                                    <small className="text-danger"> *</small>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={amount}
                                    onChange={this.handleChange("amount")}
                                    placeholder="Monto"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Form.Group className="form-group fill">
                                <Form.Label
                                    className="floating-label"
                                    style={
                                        process === ""
                                            ? { color: "#ff5252 " }
                                            : null
                                    }
                                >
                                    Periodo Actual
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                {this.state.calendarLoader ? (
                                    <span
                                        className="spinner-border spinner-border-sm mr-1"
                                        role="status"
                                    />
                                ) : (
                                    <Form.Control
                                        as="select"
                                        value={process}
                                        onChange={this.handleChange("process")}
                                    >
                                        <option defaultValue={true} hidden>
                                            Periodo
                                        </option>
                                        {processs.length > 0 ? (
                                            processs.map((r, index) => {
                                                return (
                                                    <option
                                                        value={r.id}
                                                        key={index}
                                                        id={"process-" + r.id}
                                                        mask-calendar={r.Academic_calendar.denomination.substr(
                                                            -4
                                                        )}
                                                        mask-process={r.denomination.substr(
                                                            -1
                                                        )}
                                                    >
                                                        {r.Academic_calendar.denomination.substr(
                                                            -4
                                                        ) +
                                                            "-" +
                                                            r.denomination.substr(
                                                                8
                                                            )}
                                                    </option>
                                                );
                                            })
                                        ) : (
                                            <option defaultValue={true}>
                                                Error al cargar los Datos
                                            </option>
                                        )}
                                    </Form.Control>
                                )}
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {action === "add" ? (
                                <Button
                                    className="pull-right"
                                    disabled={loaderConcept}
                                    variant="primary"
                                    onClick={() => this.createPayment()}
                                >
                                    {loaderConcept && (
                                        <span
                                            className="spinner-border spinner-border-sm mr-1"
                                            role="status"
                                        />
                                    )}
                                    Guardar
                                </Button>
                            ) : (
                                <Button
                                    className="pull-right"
                                    disabled={loaderConcept}
                                    variant="primary"
                                    onClick={() => this.updatePayment()}
                                >
                                    {loaderConcept && (
                                        <span
                                            className="spinner-border spinner-border-sm mr-1"
                                            role="status"
                                        />
                                    )}
                                    Guardar Cambios
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

export default FormOperation;
