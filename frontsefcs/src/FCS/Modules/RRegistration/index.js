import React, { Component } from "react";
import axios from "axios";
import app from "../../Constants";
import component from "../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import {
    Card,
    Col,
    Form,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import $ from "jquery";
import defaultUser from "../../../assets/images/user/default.jpg";
import DataTableRegistration from "./DataTableRegistration";
import DataTableAllRegistration from "./DataTableAllRegistration";
import DataTableWithProgram from "./DataTableWithProgram";
import Refresh from "@material-ui/icons/Refresh";
import Add from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import Search from "@material-ui/icons/Search";

import FormAcademicRecord from "./Form";

moment.locale("es");

class Registration extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        activate: 0,
        formRegistration: false,
        studentLoader: false,
        deleteMovementID: "",
        organicUnit: "",
        academicDegree: "",
        programID: "",

        organicUnitMask: "",
        program: "",

        retriveData: "",
        students: [],

        organicUnits: [],
        plans: [],
        registrations: [],

        searchPerson: true,
        movementLoader: false,
        conceptLoader: false,
        person: "",
        process: "",
        persons: [],
        processs: [],
        programs: [],
    };

    async componentDidMount() {
        this.listUnitOrganic();
        this.listAcademicSemesterAndAcademicCalendar();
        if (component.ORGANIC_UNIT !== "") {
            this.setState({ organicUnit: component.ORGANIC_UNIT });
            // this.listSimpleProgramByOrganicUnitRegisterID(this.props.organicUnit)
        }
    }

    async retrieveStudent(id_student) {
        const url = app.person + "/" + app.student + "/" + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            this.setState({
                titleModule:
                    res.data.Person.name +
                    " / " +
                    res.data.Person.document_number,
                programID: res.data.id_program,
                titleProgram: res.data.Program.denomination,
                admissionPlanID: res.data.id_admission_plan,
                sedeRegistration:
                    res.data.Program.Organic_unit_register.Campu.denomination,
                unitRegistration:
                    res.data.Program.Organic_unit_register.denomination,
                studyPlanID: res.data.id_plan,
                PERSONID: res.data.Person.id,
                academicDegree: res.data.Program.Academic_degree.denomination,
                // Agregado MPT
                personData: res.data.Person,
                admissionPlan: res.data.Admission_plan.description,
            });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    listUnitOrganic() {
        const url = app.general + "/" + app.organicUnit;
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    this.setState({ organicUnits: res.data });
                }
            })
            .catch((err) => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Error al obtener unidades orgánicas",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    searchPersonStudenUnitOrganic(params, organicUnit) {
        if (params === "") {
            this.setState({ persons: [] });
        } else {
            const url =
                app.person +
                "/search-" +
                app.persons +
                "/" +
                app.student +
                "-uo/" +
                params;
            let data = new FormData();
            data.set("id_organic_unit", organicUnit);
            axios
                .patch(url, data, app.headers)
                .then((res) => {
                    if (res.data) this.setState({ persons: res.data });
                })
                .catch((err) => {
                    PNotify.error({
                        title: "Oh no!",
                        text: "Ha ocurrido un error",
                        delay: 2000,
                    });
                    console.log(err);
                });
        }
    }

    async listRegistrationCourseStudent(id_student) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.registration +
            "/" +
            app.registrations +
            "/" +
            id_student +
            "/" +
            app.registrationCourse;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                this.setState({ registrations: res.data });
            } else {
                this.setState({ registrations: [] });
            }
            this.setState({ registrationDataLoader: false });
        } catch (err) {
            this.setState({ registrationDataLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "organicUnit":
                let organicMask = $("#organicmask-" + event.target.value).attr(
                    "data-organicmask"
                );
                this.setState({
                    organicUnit: event.target.value,
                    organicUnitMask: organicMask,
                });
                this.listSimpleProgramByOrganicUnitRegisterID(
                    event.target.value
                );
                break;
            case "person":
                this.searchPersonStudenUnitOrganic(
                    event.target.value,
                    this.state.organicUnit
                );
                this.setState({ person: event.target.value });
                break;
            case "process":
                this.setState({ process: event.target.value });
                this.state.studentID &&
                    this.state.programID &&
                    this.retriveSemesterActivityRegistration(
                        this.state.programID,
                        event.target.value,
                        this.state.studentID
                    );
                break;
            default:
                break;
        }
    };

    openForm = () => {
        this.setState({ formRegistration: true, action: "add" });
    };
    deleteSweetRegistration = (id) => {
        this.setState({ deleteRegistrationID: id });
    };
    leaveDataRegistration = (id) => {
        this.setState({ leaveRegistrationID: id });
    };
    callData = async () => {
        this.listRegistrationCourseStudent(this.state.studentID);
    };
    retriveDataRegistration = (r) => {
        this.setState({
            formRegistration: true,
            retriveRegistration: r,
            action: "update",
        });
    };
    closeFormRegistration = () => {
        this.setState({
            formRegistration: false,
            retriveRegistration: "",
            deleteRegistrationID: "",
            leaveRegistrationID: "",
            action: "",
        });
    };

    selectectPerson = (r) => {
        this.retriveSemesterActivityRegistration(
            r.Student.Program.id,
            this.state.process,
            r.Student.id
        );

        this.setState({
            searchPerson: false,
            personMask: r.name,
            documentMask: r.document_number,
            studentType: r.Student.type,
            programMask: r.Student.Program.denomination,
            photoMask: r.photo,
            studentID: r.Student.id,
        });
    };
    unSelectectPerson = () => {
        this.setState({
            searchPerson: true,
            personMask: "",
            documentMask: "",
            studentType: "",
            programMask: "",
            photoMask: "",
            academicDegree: "",
            studentID: "",
            totalMovement: "",
            registrations: [],
            movements: [],
        });
    };
    closeSelectectPerson = () => {
        this.setState({
            searchPerson: true,
            person: "",
            personMask: "",
            documentMask: "",
            studentType: "",
            programMask: "",
            photoMask: "",
            academicDegree: "",
            studentID: "",
            totalMovement: "",
            registrations: [],
            persons: [],
            movements: [],
        });
    };
    refreshData = () => {
        this.listRegistrationCourseStudent(this.state.studentID);
    };
    donwloadRecord = () => {
        component.pdfReportAutoRecordAcademico(
            this.state.titleModule.toUpperCase(),
            this.state.titleProgram.toUpperCase(),
            this.state.sedeRegistration.toUpperCase(),
            this.state.unitRegistration.toUpperCase(),
            this.state.registrations
        );
    };

    async listSimpleProgramByOrganicUnitRegisterID(id) {
        this.setState({ programsLoader: true });
        const url =
            app.programs +
            "/" +
            app.program +
            "/s-" +
            app.organicUnit +
            "-register/" +
            id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ programs: res.data });
            }
            this.setState({ programsLoader: false });
        } catch (err) {
            this.setState({ programsLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los Programas de estudio",
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

    async retriveSemesterActivityRegistration(program, process, studentID) {
        this.setState({ loaderSchedule: true });
        const url = app.general + "/" + app.semesterActivity + "/registration";

        try {
            let data = new FormData();
            data.set("id_process", process);
            data.set("id_program", program);
            const res = await axios.patch(url, data, app.headers);
            this.setState({
                activate: res.data.type,
            });
            this.listRegistrationCourseStudent(studentID);
            this.retrieveStudent(studentID);
            //this.listStudentAdmissionProgram(admissionPlan);
            this.setState({ loaderSchedule: false });
        } catch (err) {
            this.setState({ loaderSchedule: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes de estudio",
                delay: 2000,
            });
            console.log(err);
        }
    }

    render() {
        const { persons, person, program, programs, process, processs } =
            this.state;
        // estado del modo dios
        const { organicUnits, organicUnit } = this.state;
        let span =
            this.state.studentType === "Retirado"
                ? "badge-warning"
                : this.state.studentType === "Abandonado"
                ? "badge-danger"
                : this.state.studentType === "Postulante"
                ? "badge-info"
                : this.state.studentType === "Estudiante"
                ? "badge-primary"
                : "badge-success";
        const filterCardStyle = {
            marginBottom: "14px",
            border: "0",
            borderRadius: "8px",
            boxShadow: "0 8px 22px rgba(20, 34, 55, 0.12)",
            overflow: "visible",
        };
        const filterHeaderStyle = {
            background: "#ffffff",
            borderBottom: "0",
            padding: "18px 20px",
        };
        const fieldWrapStyle = {
            marginBottom: "14px",
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
        const studentSummaryStyle = {
            display: "flex",
            alignItems: "center",
            gap: "14px",
            paddingTop: "4px",
        };
        const actionBarStyle = {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
            minHeight: "60px",
        };
        const actionButtonStyle = {
            float: "none",
            width: "44px",
            height: "44px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 0,
        };
        const inactiveNoticeStyle = {
            marginTop: "14px",
            padding: "12px 14px",
            borderRadius: "8px",
            background: "#fff4df",
            border: "1px solid #ffd89a",
            color: "#76520d",
            fontSize: "13px",
            lineHeight: 1.45,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
        };
        const inactiveNoticeButtonStyle = {
            border: "0",
            borderRadius: "6px",
            background: "#7b0050",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            padding: "8px 12px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 10px rgba(123, 0, 80, 0.2)",
        };
        return (
            <>
                <TitleModule
                    actualTitle={"MATRÍCULAS"}
                    actualModule={"MATRÍCULAS"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Card style={filterCardStyle}>
                    <Card.Header style={filterHeaderStyle}>
                        <Row>
                            {!component.ORGANIC_UNIT && (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group
                                        className="form-group fill"
                                        style={fieldWrapStyle}
                                    >
                                        <Form.Label
                                            className="floating-label"
                                            style={labelStyle}
                                        >
                                            Unidad Orgánica
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={organicUnit}
                                            style={controlStyle}
                                            onChange={this.handleChange(
                                                "organicUnit"
                                            )}
                                        >
                                            <option defaultValue={true} hidden>
                                                Unidad
                                            </option>
                                            {organicUnits.length > 0 ? (
                                                organicUnits.map((r, k) => {
                                                    return (
                                                        <option
                                                            id={
                                                                "organicmask-" +
                                                                r.id
                                                            }
                                                            value={r.id}
                                                            data-organicmask={
                                                                r.denomination.toUpperCase() +
                                                                " - " +
                                                                r.Campu.denomination.toUpperCase()
                                                            }
                                                            key={k}
                                                        >
                                                            {" "}
                                                            {r.denomination.toUpperCase() +
                                                                " - " +
                                                                r.Campu.denomination.toUpperCase()}
                                                        </option>
                                                    );
                                                })
                                            ) : (
                                                <option value={false} disabled>
                                                    No se encontraron datos
                                                </option>
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            )}

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group
                                    className="form-group fill"
                                    style={fieldWrapStyle}
                                >
                                    <Form.Label
                                        className="floating-label"
                                        style={labelStyle}
                                    >
                                        Semestre
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        as="select"
                                        value={process}
                                        style={controlStyle}
                                        onChange={this.handleChange("process")}
                                    >
                                        <option defaultValue={true} hidden>
                                            Proceso
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
                                                                -2
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
                                </Form.Group>
                            </Col>
                            <br />

                            {this.state.searchPerson ? (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group
                                        className="form-group fill"
                                        style={{
                                            ...fieldWrapStyle,
                                            marginBottom: 0,
                                        }}
                                    >
                                        <Form.Label
                                            className="floating-label"
                                            style={labelStyle}
                                            // style={program === "" ? {color: "#ff5252 "} : null}
                                        >
                                            Estudiante
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyPress={this.handleKeyPress}
                                            id="number"
                                            value={person}
                                            style={controlStyle}
                                            onChange={this.handleChange(
                                                "person"
                                            )}
                                            placeholder="Buscar"
                                            margin="normal"
                                        />

                                        <OverlayTrigger
                                            overlay={<Tooltip>LIMPIAR</Tooltip>}
                                        >
                                            <button
                                                onClick={() =>
                                                    this.closeSelectectPerson()
                                                }
                                                type="button"
                                                style={{
                                                    position: "relative",
                                                    zIndex: 100,
                                                    padding: "0",
                                                    border: "none",
                                                    background: "none",
                                                    outline: "none",
                                                    color: "#7b7f84",
                                                    marginTop: "-30px",
                                                    float: "right",
                                                }}
                                                className=" btn btn-dark"
                                            >
                                                <Close
                                                    style={{ color: "dark" }}
                                                />
                                            </button>
                                        </OverlayTrigger>

                                        <Table
                                            hover
                                            responsive
                                            style={{ marginTop: "-1px" }}
                                        >
                                            <tbody>
                                                {persons.length > 0 &&
                                                    persons.map((r, i) => {
                                                        let spanP =
                                                            r.Student.type ===
                                                            "Retirado"
                                                                ? "badge-warning"
                                                                : r.Student
                                                                      .type ===
                                                                  "Abandonado"
                                                                ? "badge-danger"
                                                                : r.Student
                                                                      .type ===
                                                                  "Postulante"
                                                                ? "badge-info"
                                                                : r.Student
                                                                      .type ===
                                                                  "Estudiante"
                                                                ? "badge-primary"
                                                                : "badge-success";

                                                        return (
                                                            <tr
                                                                key={i}
                                                                onClick={() =>
                                                                    this.selectectPerson(
                                                                        r
                                                                    )
                                                                }
                                                            >
                                                                <td scope="row">
                                                                    <div className="d-inline-block align-middle">
                                                                        <img
                                                                            src={
                                                                                r.photo !==
                                                                                ""
                                                                                    ? app.server +
                                                                                      "person-photography/" +
                                                                                      r.photo
                                                                                    : defaultUser
                                                                            }
                                                                            // src={defaultUser}
                                                                            alt="user"
                                                                            className="img-radius align-top m-r-15"
                                                                            style={{
                                                                                width: "40px",
                                                                            }}
                                                                        />
                                                                        <div className="d-inline-block">
                                                                            <h6 className="m-b-0">
                                                                                {" "}
                                                                                {
                                                                                    r.name
                                                                                }
                                                                            </h6>
                                                                            <p className="m-b-0">
                                                                                {" "}
                                                                                {
                                                                                    r.document_number
                                                                                }{" "}
                                                                                <span
                                                                                    className={
                                                                                        "badge  inline-block " +
                                                                                        spanP
                                                                                    }
                                                                                >
                                                                                    {r.Student &&
                                                                                        r
                                                                                            .Student
                                                                                            .type}
                                                                                </span>
                                                                            </p>
                                                                            <p className="m-b-0">
                                                                                {" "}
                                                                                {
                                                                                    r
                                                                                        .Student
                                                                                        .Program
                                                                                        .denomination
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    </Form.Group>
                                </Col>
                            ) : (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Row>
                                        <Col
                                            xs={12}
                                            sm={12}
                                            md={8}
                                            lg={8}
                                            xl={8}
                                        >
                                            <div style={studentSummaryStyle}>
                                                <img
                                                    src={
                                                        this.state.photoMask !==
                                                        ""
                                                            ? app.server +
                                                              "person-photography/" +
                                                              this.state
                                                                  .photoMask
                                                            : defaultUser
                                                    }
                                                    // src={defaultUser}
                                                    alt="user"
                                                    className="img-radius align-top m-r-15"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                        marginRight: 0,
                                                    }}
                                                />
                                                <div>
                                                    <h5
                                                        className="m-b-0"
                                                        style={{
                                                            color: "#233044",
                                                            fontSize: "18px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {" "}
                                                        {this.state.personMask}
                                                    </h5>
                                                    <p
                                                        className="m-b-0"
                                                        style={{
                                                            color: "#4d5b6b",
                                                            fontSize: "13px",
                                                        }}
                                                    >
                                                        {
                                                            this.state
                                                                .documentMask
                                                        }{" "}
                                                        <span
                                                            className={
                                                                "badge  inline-block " +
                                                                span
                                                            }
                                                        >
                                                            {this.state.studentType.toUpperCase()}
                                                        </span>
                                                    </p>
                                                    <p
                                                        className="m-b-0"
                                                        style={{
                                                            color: "#4d5b6b",
                                                            fontSize: "13px",
                                                            lineHeight: 1.35,
                                                        }}
                                                    >
                                                        {" "}
                                                        {this.state.programMask}
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col
                                            xs={12}
                                            sm={12}
                                            md={4}
                                            lg={4}
                                            xl={4}
                                        >
                                            <div style={actionBarStyle}>
                                                {this.state.studentType !==
                                                    "Retirado" &&
                                                    this.state.studentType !==
                                                        "Abandonado" &&
                                                    this.state.studentType !==
                                                        "Egresado" && (
                                                        <OverlayTrigger
                                                            overlay={
                                                                <Tooltip>
                                                                    {this.state.activate !==
                                                                    0
                                                                        ? "NUEVO"
                                                                        : "MATRICULA NO ACTIVA PARA ESTE SEMESTRE"}
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <button
                                                                style={
                                                                    actionButtonStyle
                                                                }
                                                                onClick={() =>
                                                                    this.openForm()
                                                                }
                                                                type="button"
                                                                disabled={
                                                                    this.state
                                                                        .activate ===
                                                                    0
                                                                }
                                                                className="btn-icon btn btn-primary"
                                                            >
                                                                <Add />
                                                            </button>
                                                        </OverlayTrigger>
                                                    )}

                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            RECARGAR
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        style={
                                                            actionButtonStyle
                                                        }
                                                        onClick={() =>
                                                            this.refreshData()
                                                        }
                                                        type="button"
                                                        className="btn-icon btn btn-secondary"
                                                    >
                                                        <Refresh />
                                                    </button>
                                                </OverlayTrigger>

                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            BUSCAR ESTUDIANTE
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        style={
                                                            actionButtonStyle
                                                        }
                                                        onClick={() =>
                                                            this.unSelectectPerson()
                                                        }
                                                        type="button"
                                                        className="btn-icon btn btn-info"
                                                    >
                                                        <Search />
                                                    </button>
                                                </OverlayTrigger>
                                            </div>
                                        </Col>
                                        {this.state.activate === 0 &&
                                            this.state.studentType !==
                                                "Retirado" &&
                                            this.state.studentType !==
                                                "Abandonado" &&
                                            this.state.studentType !==
                                                "Egresado" && (
                                                <Col
                                                    xs={12}
                                                    sm={12}
                                                    md={12}
                                                    lg={12}
                                                    xl={12}
                                                >
                                                    <div
                                                        style={
                                                            inactiveNoticeStyle
                                                        }
                                                    >
                                                        <span>
                                                            No hay una actividad
                                                            de matricula activa
                                                            para el semestre
                                                            seleccionado. Active
                                                            la actividad en el
                                                            calendario academico
                                                            de este programa y
                                                            semestre.
                                                        </span>
                                                        <button
                                                            type="button"
                                                            style={
                                                                inactiveNoticeButtonStyle
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    this.props
                                                                        .history
                                                                ) {
                                                                    this.props.history.push(
                                                                        "/setting/academic-calendar"
                                                                    );
                                                                    return;
                                                                }

                                                                window.location.href =
                                                                    "/admin/setting/academic-calendar";
                                                            }}
                                                        >
                                                            Ir al calendario
                                                        </button>
                                                    </div>
                                                </Col>
                                            )}
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    </Card.Header>
                </Card>
                <Row>
                    {this.state.registrations.length > 0 &&
                        this.state.registrations.map((r, i) => {
                            return (
                                <Col
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    key={i}
                                >
                                    <div style={{ position: "relative" }}>
                                        {this.state.registrationDataLoader &&
                                            component.spiner}
                                        <DataTableRegistration
                                            activate={this.state.activate}
                                            titleModule={this.state.titleModule}
                                            titleProgram={
                                                this.state.titleProgram
                                            }
                                            sedeRegistration={
                                                this.state.sedeRegistration
                                            }
                                            unitRegistration={
                                                this.state.unitRegistration
                                            }
                                            records={r}
                                            optionEdit={
                                                r.id_semester ==
                                                    this.state.process &&
                                                i === 0
                                                    ? true
                                                    : false
                                            }
                                            callData={this.callData}
                                            retriveDataRegistration={
                                                this.retriveDataRegistration
                                            }
                                            leaveDataRegistration={
                                                this.leaveDataRegistration
                                            }
                                            deleteSweetRegistration={
                                                this.deleteSweetRegistration
                                            }
                                            personData={this.state.personData}
                                            admissionPlan={
                                                this.state.admissionPlan
                                            }
                                        />
                                    </div>
                                    <br />
                                </Col>
                            );
                        })}
                </Row>
                <FormAcademicRecord
                    callData={this.callData}
                    closeFormRegistration={this.closeFormRegistration}
                    activate={this.state.activate}
                    process={this.state.process}
                    organicUnit={this.state.organicUnit}
                    formRegistration={this.state.formRegistration}
                    admissionPlanID={this.state.admissionPlanID}
                    programID={this.state.programID}
                    studyPlanID={this.state.studyPlanID}
                    studentID={this.state.studentID}
                    academicDegree={this.state.academicDegree}
                    titleModule={this.state.titleModule}
                    retriveRegistration={this.state.retriveRegistration}
                    action={this.state.action}
                    deleteRegistrationID={this.state.deleteRegistrationID}
                    leaveRegistrationID={this.state.leaveRegistrationID}
                    plans={this.state.plans}
                    history={this.props.history}
                />
                {/*{this.state.searchPerson &&*/}
                {/* <DataTableAllRegistration*/}
                {/*     organicUnit={this.state.organicUnit}*/}
                {/*     organicUnitMask={this.state.organicUnitMask}*/}
                {/*/>}*/}
                {!this.state.registrations.length > 0 && (
                    <DataTableWithProgram
                        organicUnit={this.state.organicUnit}
                        organicUnitMask={this.state.organicUnitMask}
                    />
                )}

                {/*// }*/}
            </>
        );
    }
}

export default Registration;
