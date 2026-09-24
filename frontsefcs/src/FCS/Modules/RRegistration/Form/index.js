import React from "react";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Table,
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

import { Visibility } from "@material-ui/icons";
import defaultUser from "../../../../assets/images/user/default.jpg";
import MUIDataTable from "mui-datatables";
import GetApp from "@material-ui/icons/GetApp";
import Delete from "@material-ui/icons/Delete";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

moment.locale("es");

class FormAcademicRecord extends React.Component {
    state = {
        formRegistration: this.props.formRegistration,
        studentID: this.props.studentID,
        deleteRegistrationID: this.props.deleteRegistrationID,
        leaveRegistrationID: this.props.leaveRegistrationID,
        academicDegree: this.props.academicDegree,
        process: this.props.process,
        titleConcept: "",
        requeriments: "",
        academicCalendar: "",

        note: "",
        observation: "",
        multipleCredit: false,
        amount: "",
        selected_date: "",
        typeRegistration: "",
        academicCalendars: [],

        courses: [],
        checkCourse: [],
    };

    async componentDidMount() {
        this.setState({ organicUnit: { value: component.ORGANIC_UNIT } });
        this.listActualUit();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.formRegistration !== this.props.formRegistration &&
            prevProps.action !== this.props.action
        ) {
            // this.props.formRegistration && this.props.action === "add" && this.retrieveStudentCostAdmissionPlan(this.props.admissionPlanID)
            // this.props.formRegistration && this.props.action === "add" && this.state.process && this.listRegistrationCourse(this.props.studyPlanID, this.props.studentID, this.state.process)
        }
        if (
            prevProps.retriveRegistration !== this.props.retriveRegistration &&
            prevProps.action !== this.props.action
        ) {
            this.props.retriveRegistration !== "" &&
                this.props.action !== "add" &&
                this.retriveRegistration(
                    this.props.retriveRegistration.records
                );
        }
        if (prevProps.academicDegree !== this.props.academicDegree) {
            this.props.academicDegree !== "" &&
                this.setState({ academicDegree: this.props.academicDegree });
        }
        if (
            prevProps.deleteRegistrationID !== this.props.deleteRegistrationID
        ) {
            this.props.deleteRegistrationID !== "" &&
                this.openRegistrationSweetAlert(
                    this.props.deleteRegistrationID
                );
        }
        if (prevProps.leaveRegistrationID !== this.props.leaveRegistrationID) {
            this.props.leaveRegistrationID !== "" &&
                this.openLeaveRegistrationSweetAlert(
                    this.props.leaveRegistrationID
                );
        }
        if (prevProps.process !== this.props.process) {
            this.setState({
                process: this.props.process,
                typeRegistration: "",
            });
        }
    }

    goToOpenCourse = () => {
        if (this.props.history) {
            this.props.history.push({
                pathname: "/open-course",
                state: {
                    organicUnit: this.props.organicUnit,
                },
            });
            return;
        }

        window.location.href = "/admin/open-course";
    };

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

    async retrieveStudentCostAdmissionPlan(id_admission_plan) {
        this.setState({ admissionPlanLoader: true, multipleCredit: false });
        const url =
            app.person +
            "/" +
            app.student +
            "/" +
            app.admissionPlan +
            "/" +
            id_admission_plan +
            "/" +
            app.costAdmissionPlan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    titleConcept: res.data.Concept.denomination,
                    amount: res.data.amount,
                    concept: res.data.id_concept,
                });
            this.setState({ admissionPlanLoader: false });
        } catch (err) {
            this.setState({ admissionPlanLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listConceptByID(description, id) {
        this.setState({ admissionPlanLoader: true });
        const url = app.general + "/" + app.concepts + "/id/" + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                let recargo = 0;
                if (
                    description === "Otros" ||
                    description === "Tesis" ||
                    description === "Desaprobado" ||
                    description === "Aplazado" ||
                    description === "Convalidado"
                ) {
                    this.setState({ multipleCredit: true });
                } else {
                    this.setState({ multipleCredit: false });
                }
                this.setState({
                    //por el 10 de recargo
                    titleConcept: res.data.denomination,
                    amount: Math.round(
                        (res.data.percent / 100) * this.state.amountUit +
                            recargo
                    ),
                    concept: res.data.id,
                });
            }
            this.setState({ admissionPlanLoader: false });
        } catch (err) {
            this.setState({ admissionPlanLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listRegistrationCourse(
        id_plan,
        id_student,
        id_process,
        typeRegistration
    ) {
        let type = "";
        if (
            typeRegistration === "Regular" ||
            typeRegistration === "Extemporánea" ||
            typeRegistration === "Curso desaprobado por Credito"
        ) {
            type = "R";
        }
        if (
            typeRegistration === "Curso dirigido Tesis" ||
            typeRegistration === "Curso dirigido Otros"
        ) {
            type = "D";
        }
        if (typeRegistration === "Convalidado UNSM") {
            type = "C";
        }
        if (typeRegistration === "Convalidado Externo") {
            type = "CC";
        }
        this.setState({ admissionPlanLoader: true });
        const url =
            app.registration + "/" + app.registrations + "/" + app.course;
        try {
            let data = new FormData();
            data.set("id_plan", id_plan);
            data.set("id_student", id_student);
            data.set("id_process", id_process);
            data.set("type_registration", type);
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

    async createRegistration() {
        this.setState({ loaderRegistration: true });
        const { concept, amount, selected_date, process, typeRegistration } = this.state;
        const { studentID, admissionPlanID, programID, organicUnit } =
            this.props;
        let tempCourse = [];
        // maping only id and note

        this.state.courses.map((r) => {
            if (r.state) {
                tempCourse.push({
                    id: r.id,
                    id_schedule: r.id_schedule,
                    note: r.note,
                    note_state: r.note_state,
                });
            }
        });

        if (tempCourse.length > 1 && this.state.multipleCredit) {
            this.setState({ loaderRegistration: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Solo puede registrar un curso dirigido",
                delay: 2000,
            });
        } else {
            if (
                tempCourse.length > 0 &&
                concept !== "" &&
                amount !== "" &&
                selected_date !== "" &&
                process !== "" &&
                typeRegistration !== "" &&
                studentID !== "" &&
                admissionPlanID !== "" &&
                programID !== "" &&
                organicUnit !== ""
            ) {
                const url = app.registration + "/" + app.registrations;
                let data = new FormData();
                data.set("courses", JSON.stringify(tempCourse));
                data.set("id_concept", concept);
                data.set("amount", amount);
                data.set("selected_date", selected_date);
                data.set("id_process", process);
                data.set("type", typeRegistration);
                data.set("id_student", studentID);
                data.set("id_admission_plan", admissionPlanID);

                data.set("id_organic_unit", organicUnit);
                data.set("id_program", programID);
                try {
                    const res = await axios.post(url, data, app.headers);
                    this.props.callData();
                    this.closeForm();
                    this.setState({ loaderRegistration: false });
                    PNotify.success({
                        title: "Finalizado",
                        text: res.data.message,
                        delay: 2000,
                    });
                } catch (err) {
                    console.log(err.response);
                    this.setState({ loaderRegistration: false });
                    PNotify.error({
                        title: "Oh no!",
                        text: err.response.data.message,
                        delay: 2000,
                    });
                }
            } else {
                this.setState({ loaderRegistration: false });
                PNotify.notice({
                    title: "Advertencia!",
                    text: "Complete los campos obligatorios",
                    delay: 2000,
                });
            }
        }
    }

    async updateRegistration() {
        this.setState({ loaderRegistration: true });
        const { concept, amount, process, typeRegistration, registrationID } =
            this.state;
        let tempCourse = [];
        // maping only id and note

        this.state.courses.map((r) => {
            if (r.state) {
                tempCourse.push({
                    id: r.id,
                    id_schedule: r.id_schedule,
                    note: r.note,
                    note_state: r.note_state,
                });
            }
        });

        if (
            tempCourse.length > 0 &&
            concept !== "" &&
            amount !== "" &&
            process !== "" &&
            registrationID !== "" &&
            typeRegistration !== ""
        ) {
            const url =
                app.registration +
                "/" +
                app.registrations +
                "/" +
                registrationID;
            let data = new FormData();
            data.set("courses", JSON.stringify(tempCourse));
            data.set("id_concept", concept);
            data.set("amount", amount);
            data.set("id_process", process);
            data.set("type", typeRegistration);

            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({ loaderRegistration: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderRegistration: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderRegistration: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async leaveRegistration(id) {
        try {
            this.setState({ loaderEntry: true });
            const url =
                app.registration + "/leave-" + app.registrations + "/" + id;
            const res = await axios.patch(url, app.headers);
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

    async destroyRegistration(id) {
        try {
            this.setState({ loaderEntry: true });
            const url = app.registration + "/" + app.registrations + "/" + id;
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
            this.closeForm();
            PNotify.error({
                title: "Oh no!",
                text: err.response.data.message,
                delay: 2000,
            });
            this.setState({ loaderEntry: false });
            return false;
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "note":
                if (event.target.value <= 20) {
                    this.setState({
                        note: event.target.value.replace(/[^0-9/]/g, ""),
                    });
                }

                break;
            case "academicCalendar":
                this.setState({
                    academicCalendar: event.target.value,
                    processs: [],
                });
                this.listProcessByAcademicCalendarID(event.target.value);
                break;

            case "typeRegistration":
                if (event.target.value === "Regular") {
                    //maestria 4 //doctorado 3 // especialidad 94
                    this.retrieveStudentCostAdmissionPlan(
                        this.props.admissionPlanID
                    );
                }
                if (event.target.value === "Extemporánea") {
                    //maestria 8 //doctorado 92

                    let id = 0;
                    if (this.state.academicDegree === "Doctor") {
                        id = 92;
                    }
                    if (this.state.academicDegree === "Maestro") {
                        id = 8;
                    }
                    if (this.state.academicDegree === "Especialista") {
                        alert("no definido");
                    }
                    this.listConceptByID("Extemporánea", id);
                    // this.setState({amount: parseFloat(this.state.amount) + parseFloat(this.state.amount * 0.1)})
                }
                if (event.target.value === "Curso dirigido Otros") {
                    //maestria 65 //doctorado 63 // especialista 101
                    let id = 0;
                    if (this.state.academicDegree === "Doctor") {
                        id = 63;
                    }
                    if (this.state.academicDegree === "Maestro") {
                        id = 65;
                    }
                    if (this.state.academicDegree === "Especialista") {
                        id = 101;
                    }
                    this.listConceptByID("Otros", id);
                }
                if (event.target.value === "Curso dirigido Tesis") {
                    //maestria 64  //doctorado 62 // especialista 100
                    let id = 0;
                    if (this.state.academicDegree === "Doctor") {
                        id = 62;
                    }
                    if (this.state.academicDegree === "Maestro") {
                        id = 64;
                    }
                    if (this.state.academicDegree === "Especialista") {
                        id = 100;
                    }
                    this.listConceptByID("Tesis", id);
                }
                if (event.target.value === "Curso desaprobado por Credito") {
                    //maestria-doctorado-especialista 99
                    this.listConceptByID("Desaprobado", 99);
                }
                if (event.target.value === "Aplazado") {
                    //maestria 121  //doctorado 122 // especialista 123
                    let id = 0;
                    if (this.state.academicDegree === "Doctor") {
                        id = 122;
                    }
                    if (this.state.academicDegree === "Maestro") {
                        id = 121;
                    }
                    if (this.state.academicDegree === "Especialista") {
                        id = 123;
                    }
                    this.listConceptByID("Aplazado", id);
                }
                if (event.target.value === "Convalidado UNSM") {
                    let id = 66;
                    this.listConceptByID("Convalidado", id);
                }
                if (event.target.value === "Convalidado Externo") {
                    let id = 67;
                    this.listConceptByID("Convalidado", id);
                }

                //else {
                //  this.retrieveStudentCostAdmissionPlan(this.props.admissionPlanID)
                // }
                this.checkFalseAllCourse();
                this.setState({ typeRegistration: event.target.value });
                this.listRegistrationCourse(
                    this.props.studyPlanID,
                    this.props.studentID,
                    this.state.process,
                    event.target.value
                );
                break;
            case "amount":
                this.setState({ amount: event.target.value });
                break;
            case "selected_date":
                this.setState({ selected_date: event.target.value });
                break;
            case "observation":
                this.setState({ observation: event.target.value });
                break;
            default:
                break;
        }
    };
    retriveRegistration = (r) => {
        this.setState({
            registrationID: r.id,
            courses: r.Registration_course,
            academicCalendar: r.Academic_semester.Academic_calendar.id,
            process: r.Academic_semester.id,
            amount: r.Payment.amount,
            titleConcept: r.Payment.Concept.denomination,
            concept: r.Payment.Concept.id,
            typeRegistration: r.type,
        });
        this.listProcessByAcademicCalendarID(
            r.Academic_semester.Academic_calendar.id
        );
    };
    closeForm = () => {
        this.props.closeFormRegistration();
        this.setState({
            typeRegistration: "",
            courses: [],
        });
    };
    checkCourse = (i, state) => {
        let courses = this.state.courses;
        courses[i].state = !state;

        if (courses[i].state === false) {
            courses[i].note = 0;
            this.state.multipleCredit &&
                this.setState({
                    amount: this.state.amount / parseFloat(courses[i].credits),
                });
        } else {
            this.state.multipleCredit &&
                this.setState({
                    amount: this.state.amount * parseFloat(courses[i].credits),
                });
        }
        this.setState({ courses });
    };
    checkFalseAllCourse = () => {
        let courses = this.state.courses;
        for (let i = 0; i < courses.length; i++) {
            courses[i].state = false;
        }
        this.setState({ courses });
    };

    checkNoteState = (i, state) => {
        let courses = this.state.courses;
        courses[i].note_state = !state;
        if (courses[i].note_state === true) {
            courses[i].note = 0;
        }
        this.setState({ courses });
    };
    updateNote = (i, e) => {
        if (e.target.value <= 20) {
            let courses = this.state.courses;
            courses[i].note = e.target.value.replace(/[^0-9/]/g, "");
            this.setState({ courses: courses });
        }
    };
    openRegistrationSweetAlert = async (id) => {
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
                ? await this.destroyRegistration(id)
                : this.props.closeFormRegistration();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };
    openLeaveRegistrationSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: "¿Estás seguro que desea retirar esta Matrícula?",
                text: "Este paso es irreversible!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Retirar!",
                cancelButtonText: "No, Cancelar",
            });
            alert.isConfirmed
                ? await this.leaveRegistration(id)
                : this.props.closeFormRegistration();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };

    renderPrerequisites = (course) => {
        const hasPrerequisites = course.prerequisites && course.prerequisites.length > 0;
        if (!hasPrerequisites) return null;
        return (
            <div className="mt-1 small">
                <strong>Prerrequisito:</strong>{" "}
                {course.prerequisites.map((requirement, index) => (
                    <span key={requirement.id || index} className={requirement.status === "Aprobado" ? "text-success" : requirement.status === "Desaprobado" ? "text-danger" : "text-warning"}>
                        {index > 0 ? "; " : ""}
                        {requirement.denomination} (Ciclo {requirement.ciclo || "-"}: {requirement.status})
                    </span>
                ))}
            </div>
        );
    };

    renderPreviousCycleFailures = (courses) => {
        const failures = [];
        courses.forEach(course => (course.previousCycleFailures || []).forEach(failure => {
            if (!failures.some(item => item.id === failure.id)) failures.push(failure);
        }));
        if (!failures.length) return null;
        return <div className="alert alert-warning py-2 mb-2">
            <strong>Desaprobados del ciclo anterior:</strong>{" "}
            {failures.map((failure, index) => <span key={failure.id}>{index > 0 ? "; " : ""}{failure.denomination}</span>)}
        </div>;
    };

    render() {
        const { titleConcept, observation, typeRegistration } = this.state;
        const { amount, selected_date } = this.state;
        const fullScreenStyle = {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            width: this.props.windowWidth, // overflowY: 'auto',
            height: "100%",
            background: "#f4f7fb",
        };
        const scrollable = {
            overflowY: "auto",
            maxHeight: "calc(100vh - 70px)",
            padding: "22px 24px 28px",
        };
        const modalHeaderStyle = {
            background: "#2f7be8",
            minHeight: "64px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 4px 14px rgba(47, 123, 232, 0.2)",
        };
        const labelStyle = {
            position: "static",
            display: "block",
            marginBottom: "6px",
            color: "#5f2750",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
        };
        const controlStyle = {
            height: "42px",
            borderColor: "#cfd6df",
            borderRadius: "6px",
            boxShadow: "none",
            fontSize: "14px",
        };
        const sectionStyle = {
            background: "#ffffff",
            borderRadius: "8px",
            padding: "18px",
            boxShadow: "0 8px 22px rgba(20, 34, 55, 0.1)",
        };
        const footerStyle = {
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
        };
        let totalCredit = 0;
        return (
            this.props.formRegistration && (
                <Row className="btn-page">
                    <Card className="full-card" style={fullScreenStyle}>
                        <Card.Header style={modalHeaderStyle}>
                            <Card.Title
                                as="h5"
                                style={{ color: "white", fontSize: "20px" }}
                            >
                                {this.props.titleModule}
                            </Card.Title>
                            <div className="d-inline-block pull-right">
                                <div className="card-header-right">
                                    <Dropdown
                                        alignRight={true}
                                        className="pull-right mt-2"
                                    >
                                        <Dropdown.Toggle
                                            className="btn-icon"
                                            style={{
                                                border: "none",
                                                background: "none",
                                                outline: "none",
                                                color: "white",
                                            }}
                                        >
                                            <i
                                                onClick={() => this.closeForm()}
                                                className="material-icons pull-right "
                                            >
                                                close
                                            </i>
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body style={scrollable}>
                            <Row style={sectionStyle}>
                                <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label
                                            className="floating-label"
                                            style={labelStyle}
                                            // style={civilStatu === "" ? {color: "#ff5252 "} : null}
                                        >
                                            Tipo de matrícula{" "}
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={typeRegistration}
                                            style={controlStyle}
                                            onChange={this.handleChange(
                                                "typeRegistration"
                                            )}
                                        >
                                            <option defaultValue={true} hidden>
                                                Seleccione
                                            </option>
                                            {this.props.activate === 3 && (
                                                <>
                                                    <option value="Regular">
                                                        {" "}
                                                        Regular (R)
                                                    </option>
                                                    <option value="Curso desaprobado por Credito">
                                                        Curso desaprobado por
                                                        Credito (R)
                                                    </option>
                                                </>
                                            )}
                                            {this.props.activate === 4 && (
                                                <option value="Extemporánea">
                                                    {" "}
                                                    Extemporánea (R)
                                                </option>
                                            )}
                                            {this.props.activate === 5 && (
                                                <>
                                                    <option value="Curso dirigido Otros">
                                                        Curso dirigido Otros (D)
                                                    </option>
                                                    <option value="Curso dirigido Tesis">
                                                        Curso dirigido Tesis (D)
                                                    </option>
                                                </>
                                            )}
                                            {this.props.activate === 6 && (
                                                <>
                                                    <option value="Convalidado UNSM">
                                                        Curso Convalidado UNSM
                                                        (C)
                                                    </option>
                                                    <option value="Convalidado Externo">
                                                        Curso Convalidado
                                                        Externo (C)
                                                    </option>
                                                </>
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label
                                            className="floating-label"
                                            style={labelStyle}
                                        >
                                            Concepto
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            disabled={true}
                                            value={titleConcept}
                                            style={controlStyle}
                                            onChange={this.handleChange(
                                                "numberStudent"
                                            )}
                                            placeholder="Cantidad de estudiantes"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={1} lg={1} xl={1}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label
                                            className="floating-label"
                                            style={{
                                                ...labelStyle,
                                                color:
                                                    amount === ""
                                                        ? "#ff5252"
                                                        : labelStyle.color,
                                            }}
                                        >
                                            Costo
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            onKeyPress={this.handleKeyPress}
                                            id="amount"
                                            value={amount}
                                            type="number"
                                            style={controlStyle}
                                            onChange={this.handleChange(
                                                "amount"
                                            )}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label
                                            className="floating-label"
                                            style={{
                                                ...labelStyle,
                                                color:
                                                    selected_date === ""
                                                        ? "#ff5252"
                                                        : labelStyle.color,
                                            }}
                                        >
                                            Fecha
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            onKeyPress={this.handleKeyPress}
                                            id="selected_date"
                                            value={selected_date}
                                            type="date"
                                            style={controlStyle}
                                            onChange={this.handleChange("selected_date")}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label
                                            className="floating-label"
                                            style={{
                                                ...labelStyle,
                                                color:
                                                    observation === ""
                                                        ? "#ff5252"
                                                        : labelStyle.color,
                                            }}
                                        >
                                            Observación
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            placeholder="Observación"
                                            onKeyPress={this.handleKeyPress}
                                            id="observation"
                                            value={observation}
                                            type="text"
                                            style={controlStyle}
                                            onChange={this.handleChange(
                                                "observation"
                                            )}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {this.renderPreviousCycleFailures(this.state.courses)}
                                    <Table
                                        size="sm"
                                        hover
                                        responsive
                                        style={{
                                            width: "100%",
                                            marginTop: "8px",
                                            marginBottom: 0,
                                            borderCollapse: "separate",
                                            borderSpacing: "0 8px",
                                        }}
                                    >
                                        <thead
                                            style={{
                                                background: "#eef3f8",
                                                color: "#4d5b6b",
                                                fontSize: "12px",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            <tr className="d-flex">
                                                {/*<th className="col-1">#</th>*/}
                                                <th className="col-7">Curso</th>
                                                <th className="col-5">
                                                    Detalles
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.courses.length > 0 ? (
                                                this.state.courses.map(
                                                    (k, i) => {
                                                        return (
                                                            <tr
                                                                key={i}
                                                                className="d-flex"
                                                                style={{
                                                                    background:
                                                                        "#ffffff",
                                                                    border:
                                                                        "1px solid #e3e8ef",
                                                                }}
                                                            >
                                                                <td className="col-7">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <label className="check-task custom-control custom-checkbox d-flex justify-content-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="custom-control-input"
                                                                                    onClick={() =>
                                                                                        this.checkCourse(
                                                                                            i,
                                                                                            k.state
                                                                                        )
                                                                                    }
                                                                                    checked={
                                                                                        k.state
                                                                                    }
                                                                                    value={
                                                                                        k.state
                                                                                    }
                                                                                    disabled={
                                                                                        this
                                                                                            .props
                                                                                            .action !==
                                                                                        "add"
                                                                                            ? true
                                                                                            : false
                                                                                    }
                                                                                    readOnly
                                                                                />
                                                                                <span className="custom-control-label">
                                                                                    <p
                                                                                        className="m-b-0"
                                                                                        style={{
                                                                                            color:
                                                                                                "#687789",
                                                                                            fontSize:
                                                                                                "12px",
                                                                                        }}
                                                                                    >
                                                                                        #{" "}
                                                                                        <strong>
                                                                                            {
                                                                                                k.order
                                                                                            }
                                                                                        </strong>{" "}
                                                                                        /
                                                                                        Grupo:{" "}
                                                                                        <strong>
                                                                                            {" "}
                                                                                            {
                                                                                                k.group
                                                                                            }
                                                                                        </strong>{" "}
                                                                                        <br />
                                                                                    </p>
                                                                                    <h5
                                                                                        className="m-b-0"
                                                                                        style={{
                                                                                            color:
                                                                                                "#27364a",
                                                                                            fontSize:
                                                                                                "15px",
                                                                                            fontWeight: 700,
                                                                                        }}
                                                                                    >
                                                                                        {" "}
                                                                                        {
                                                                                            k.denomination
                                                                                        }
                                                                                    </h5>
                                                                                    <p
                                                                                        className="m-b-0"
                                                                                        style={{
                                                                                            color:
                                                                                                "#687789",
                                                                                            fontSize:
                                                                                                "12px",
                                                                                        }}
                                                                                    >
                                                                                        Creditos:{" "}
                                                                                        <strong>
                                                                                            {" "}
                                                                                            {k.credits ||
                                                                                                "No Def."}
                                                                                        </strong>

                                                                                        /
                                                                                        Ciclo:{" "}
                                                                                        <strong>
                                                                                            {" "}
                                                                                            {k.ciclo ||
                                                                                                "No Def."}
                                                                                        </strong>
                                                                                        {/*{k.type === "Electivo" ?*/}
                                                                                        {/*    <strong*/}
                                                                                        {/*        className={"text-primary"}> {k.type}</strong> : ""}*/}
                                                                                            </p>
                                                                                            {this.renderPrerequisites(k)}
                                                                                        </span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="col-5">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <p
                                                                                className="m-b-0"
                                                                                key={
                                                                                    i
                                                                                }
                                                                            >
                                                                                {k
                                                                                    .teachers
                                                                                    .length >
                                                                                0
                                                                                    ? k.teachers.map(
                                                                                          (
                                                                                              r,
                                                                                              l
                                                                                          ) => {
                                                                                              return (
                                                                                                  <div
                                                                                                      key={
                                                                                                          l
                                                                                                      }
                                                                                                  >
                                                                                                      <h6 className="m-b-0">
                                                                                                          {" "}
                                                                                                          {
                                                                                                              r
                                                                                                                  .Person
                                                                                                                  .name
                                                                                                          }
                                                                                                      </h6>
                                                                                                      {r
                                                                                                          .Horarys
                                                                                                          .length >
                                                                                                      0
                                                                                                          ? r.Horarys.map(
                                                                                                                (
                                                                                                                    n,
                                                                                                                    j
                                                                                                                ) => {
                                                                                                                    let temp =
                                                                                                                        "Dia: " +
                                                                                                                        n.days +
                                                                                                                        " Hora: " +
                                                                                                                        n.start_time +
                                                                                                                        "-" +
                                                                                                                        n.end_time +
                                                                                                                        " Amb.: " +
                                                                                                                        n.ambient;
                                                                                                                    return (
                                                                                                                        <p
                                                                                                                            className="m-b-0"
                                                                                                                            key={
                                                                                                                                j
                                                                                                                            }
                                                                                                                        >
                                                                                                                            {
                                                                                                                                temp
                                                                                                                            }
                                                                                                                        </p>
                                                                                                                    );
                                                                                                                }
                                                                                                            )
                                                                                                          : "No def"}
                                                                                                  </div>
                                                                                              );
                                                                                          }
                                                                                      )
                                                                                    : "No def."}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <tr className="d-flex">
                                                    <td className="col-12">
                                                        <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
                                                            <div className="d-inline-block">
                                                                <p className="m-b-0">
                                                                    No se han
                                                                    aperturado
                                                                    los cursos
                                                                </p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="primary"
                                                                className="mt-2 mt-sm-0"
                                                                onClick={this.goToOpenCourse}
                                                            >
                                                                Aperturar cursos
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    style={footerStyle}
                                >
                                    {this.props.action === "add" ? (
                                        <Button
                                            className="pull-right"
                                            variant="primary"
                                            onClick={() =>
                                                this.createRegistration()
                                            }
                                        >
                                            {this.state.loaderRegistration && (
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
                                            variant="primary"
                                            onClick={() =>
                                                this.updateRegistration()
                                            }
                                        >
                                            {this.state.loaderRegistration && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                />
                                            )}
                                            Guardar cambios
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Row>
            )
        );
    }
}

export default FormAcademicRecord;
