import React, { Component } from "react";
import axios from "axios";

import crypt from "node-cryptex";
import app from "../../Constants";

import PNotify from "pnotify/dist/es/PNotify";
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
import ModalAcademic from "./ModalAcademic";
import TitleModule from "../../TitleModule";
import component from "../Programs/AdmissionPlan";
import GetApp from "@material-ui/icons/GetApp";
import { Check } from "@material-ui/icons";
import Swal from "sweetalert2";

const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem("INFO")
    ? JSON.parse(crypt.decrypt(localStorage.getItem("INFO"), k, v))
    : "";

export default class AcademicCalendar extends Component {
    state = {
        organicUnit: component.ORGANIC_UNIT,
        loader: false,
        action: "add",

        process: "",

        academicCalendar: "",

        programs: [],
        processs: [],
        semesterActivitys: [],
        academicCalendars: "",
    };

    async componentDidMount() {
        this.listAcademicSemesterAndAcademicCalendar();
        this.listProgramReport();
        this.listAcademicCalendarActual();
    }

    listAcademicCalendarActual() {
        const url = app.general + "/" + app.academicCalendar + "/actual";
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    this.setState({ academicCalendars: res.data });
                }
            })
            .catch((err) => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Error al cargar calendario",
                    delay: 2000,
                });
                console.log(err);
            });
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

    async listProgramReport() {
        this.setState({ loader: true });
        const url = app.programs + "/" + app.program + "-report";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ programs: res.data });
            }
            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal",
                delay: err,
            });
            console.log(err);
        }
    }

    async listSemesterActivity(program, process) {
        this.setState({ loader: true });
        const url =
            app.general +
            "/" +
            app.semesterActivity +
            "/list/" +
            program +
            "/" +
            process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ semesterActivitys: res.data });
            }
            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal",
                delay: err,
            });
            console.log(err);
        }
    }

    async updateSemesterActivity(r) {
        this.setState({ loader: true });
        const url =
            app.general + "/" + app.semesterActivity + "/update/" + r.id;

        let data = new FormData();

        data.set("date_start", r.date_start);
        data.set("date_end", r.date_end);
        data.set("state", r.state);

        try {
            const res = await axios.patch(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            this.setState({ loader: false });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    async createSemesterActivity() {
        this.setState({ loader: true });
        const { program, process } = this.state;
        const url = app.general + "/" + app.semesterActivity + "/create";

        let data = new FormData();

        data.set("id_program", program);
        data.set("id_academic_semester", process);

        try {
            const res = await axios.post(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            this.setState({ loader: false });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    async finishSemesterActivity() {
        this.setState({ loader: true });
        const url = app.general + "/" + app.semesterActivity + "/finish";

        let data = new FormData();

        data.set("id_program", this.state.program);
        data.set("id_process", this.state.process);

        try {
            const res = await axios.patch(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            // this.setState({loader: false});
            // PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    async updateStateSemesterActivity() {
        this.setState({ loader: true });
        const url = app.general + "/" + app.semesterActivity + "/state";
        let data = new FormData();
        try {
            const res = await axios.patch(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            this.setState({ loader: false, process: "", program: "" });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "program":
                this.setState({ program: event.target.value });
                this.state.process &&
                    this.listSemesterActivity(
                        event.target.value,
                        this.state.process
                    );
                break;
            case "academicCalendar":
                this.setState({
                    academicCalendar: event.target.value,
                    processs: [],
                });
                this.listProcessByAcademicCalendarID(event.target.value);
                break;
            case "process":
                this.setState({ process: event.target.value });
                this.state.program &&
                    this.listSemesterActivity(
                        this.state.program,
                        event.target.value
                    );
                break;
            case "startDate":
                this.setState({ startDate: event.target.value });
                this.calculateMount();
                break;
            case "endDate":
                this.setState({ endDate: event.target.value });
                this.calculateMount();
                break;
            default:
                break;
        }
    };
    handleChangeArray = (k, type, v) => {
        let data = [];
        data = this.state.semesterActivitys;
        console.log(v.target.value);
        if (type === "state") {
            // for (let i = 0; i < data.length; i++) {
            //     data[i].state = false
            // }
            data[k].state = !data[k].state;
        }
        if (type === "start") {
            data[k].date_start = v.target.value;
        }
        if (type === "end") {
            data[k].date_end = v.target.value;
        }
        this.setState({ semesterActivitys: data });
    };
    openFinishSweetAlert = async () => {
        try {
            const alert = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Este paso es irreversible!. Se cerrara el proceso de registro",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Finalizar!",
                cancelButtonText: "No, Cancelar",
            });
            alert.isConfirmed
                ? await this.finishSemesterActivity()
                : this.props.closeForm();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };

    getSelectedProgramName = () => {
        const selected = this.state.programs.find(
            (item) => String(item.id) === String(this.state.program)
        );

        return selected ? selected.description : "Seleccione un programa";
    };

    getSelectedProcess = () => {
        return this.state.processs.find(
            (item) => String(item.id) === String(this.state.process)
        );
    };

    getSelectedProcessName = () => {
        const selected = this.getSelectedProcess();

        if (!selected) return "Seleccione un semestre";

        return (
            selected.Academic_calendar.denomination.substr(-4) +
            "-" +
            selected.denomination.substr(-2)
        );
    };

    getActivityHelpText = (activity) => {
        const text = activity ? activity.toLowerCase() : "";

        if (text.indexOf("matricula regular") > -1) {
            return "Habilita la matricula regular en el modulo de matriculas.";
        }

        if (text.indexOf("matricula extemporanea") > -1) {
            return "Habilita matriculas fuera del periodo regular.";
        }

        if (text.indexOf("horarios") > -1) {
            return "Permite aperturar cursos y horarios del semestre.";
        }

        if (text.indexOf("calificaciones") > -1) {
            return "Permite ingresar notas y cerrar actas.";
        }

        if (text.indexOf("clases") > -1) {
            return "Marca el periodo operativo para el dictado de clases.";
        }

        return "Controla si esta actividad esta disponible para el semestre.";
    };

    render() {
        const { semesterActivitys, process, program, programs } = this.state;
        const { processs, academicCalendars } = this.state;
        const activeActivities = semesterActivitys.filter((item) => item.state)
            .length;
        const selectedProcess = this.getSelectedProcess();
        const selectedProcessName = this.getSelectedProcessName();
        const selectedProgramName = this.getSelectedProgramName();
        const processCalendarName =
            selectedProcess && selectedProcess.Academic_calendar
                ? selectedProcess.Academic_calendar.denomination
                : "";
        const currentCalendarName = academicCalendars
            ? academicCalendars.denomination
            : "No definido";
        const currentCalendarRange = academicCalendars
            ? moment(academicCalendars.date_start).format("LL") +
              " - " +
              moment(academicCalendars.date_end).format("LL")
            : "No definido";
        const calendarMismatch =
            processCalendarName &&
            currentCalendarName !== "No definido" &&
            processCalendarName !== currentCalendarName;
        const activeCalendarWithoutSemesters =
            academicCalendars &&
            academicCalendars.Academic_semesters &&
            academicCalendars.Academic_semesters.length === 0;
        const heroStyle = {
            border: "0",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #006aa6 0%, #00a7b7 100%)",
            boxShadow: "0 10px 22px rgba(15, 23, 42, 0.16)",
            overflow: "hidden",
        };
        const heroBodyStyle = {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            minHeight: "96px",
            flexWrap: "wrap",
        };
        const iconButtonStyle = {
            minHeight: "46px",
            borderRadius: "8px",
            border: "0",
            background: "#ffffff",
            color: "#006aa6",
            boxShadow: "0 6px 14px rgba(15, 23, 42, 0.18)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 16px",
            fontWeight: 800,
            whiteSpace: "nowrap",
        };
        const labelStyle = {
            display: "block",
            color: "#334e68",
            fontSize: "12px",
            fontWeight: 800,
            marginBottom: "6px",
            textTransform: "uppercase",
        };
        const controlStyle = {
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            minHeight: "42px",
            color: "#243b53",
            fontSize: "14px",
            boxShadow: "none",
        };
        const helperStyle = {
            color: "#627d98",
            fontSize: "12px",
            marginTop: "6px",
            lineHeight: 1.35,
        };
        const infoGridStyle = {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginTop: "14px",
        };
        const infoItemStyle = {
            border: "1px solid #d9e2ec",
            borderRadius: "8px",
            padding: "10px 12px",
            background: "#f8fafc",
        };
        const noticeStyle = {
            border: "1px solid #ffd89a",
            borderRadius: "8px",
            background: "#fff8e8",
            color: "#76520d",
            padding: "10px 12px",
            fontSize: "13px",
            lineHeight: 1.45,
            marginTop: "12px",
        };
        const emptyStyle = {
            border: "1px dashed #bcccdc",
            borderRadius: "8px",
            background: "#f8fafc",
            padding: "18px",
            color: "#486581",
            fontSize: "13px",
            lineHeight: 1.45,
            marginBottom: "12px",
        };
        const dateInputStyle = {
            ...controlStyle,
            minHeight: "36px",
            padding: "6px 10px",
        };
        return (
            <>
                {this.state.loader && component.spiner}
                <TitleModule
                    actualTitle={"CALENDARIO ACADEMICO"}
                    actualModule={"APERTURA Y CIERRE DE PROCESOS"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={heroStyle}>
                            <Card.Body style={heroBodyStyle}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                    }}
                                >
                                        <Button
                                            title="Crear o editar calendario academico"
                                            onClick={() =>
                                                this.ModalAcademic.handleOpenModalAcademicCalendar()
                                            }
                                            style={iconButtonStyle}
                                        >
                                            <i className="material-icons">
                                                add
                                            </i>
                                            Nuevo / gestionar calendario
                                        </Button>

                                        <div>
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    borderRadius: "16px",
                                                    background:
                                                        "rgba(255,255,255,0.18)",
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    padding: "4px 10px",
                                                    marginBottom: "6px",
                                                }}
                                            >
                                                Calendario activo
                                            </span>
                                            <h4
                                                className="text-white"
                                                style={{ marginBottom: "4px" }}
                                            >
                                                {currentCalendarName}
                                            </h4>
                                            <p className="text-white m-b-0">
                                                {currentCalendarRange}
                                            </p>
                                        </div>
                                </div>
                                <div
                                    style={{
                                        color: "#ffffff",
                                        fontSize: "13px",
                                        textAlign: "right",
                                        maxWidth: "360px",
                                    }}
                                >
                                    Configure que procesos estaran abiertos para
                                    cada programa y semestre.
                                </div>
                                <i className="feather icon-calendar card-icon" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card
                            style={{
                                border: "0",
                                borderRadius: "8px",
                                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.10)",
                                marginBottom: "12px",
                            }}
                        >
                            <Card.Body>
                                <div
                                    style={{
                                        color: "#52616f",
                                        fontSize: "13px",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        marginBottom: "12px",
                                    }}
                                >
                                    Contexto de configuracion
                                </div>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group>
                                            <Form.Label style={labelStyle}>
                                                Programa
                                            </Form.Label>

                                            <Form.Control
                                                as="select"
                                                value={program}
                                                onChange={this.handleChange(
                                                    "program"
                                                )}
                                                style={controlStyle}
                                            >
                                                <option value="" hidden>
                                                    Seleccione programa
                                                </option>
                                                {programs.length > 0 ? (
                                                    programs.map((r, k) => {
                                                        return (
                                                            <option
                                                                id={r.id}
                                                                value={r.id}
                                                                key={k}
                                                            >
                                                                {r.description}
                                                            </option>
                                                        );
                                                    })
                                                ) : (
                                                    <option
                                                        value={false}
                                                        disabled
                                                    >
                                                        No se encontraron datos
                                                    </option>
                                                )}
                                            </Form.Control>
                                            <div style={helperStyle}>
                                                Las actividades se guardan por
                                                programa.
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group>
                                            <Form.Label style={labelStyle}>
                                                Semestre academico
                                                <small className="text-danger">
                                                    {" "}
                                                    *
                                                </small>
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
                                                    onChange={this.handleChange(
                                                        "process"
                                                    )}
                                                    style={controlStyle}
                                                >
                                                    <option value="" hidden>
                                                        Seleccione semestre
                                                    </option>
                                                    {processs.length > 0 ? (
                                                        processs.map(
                                                            (r, index) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            r.id
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        id={
                                                                            "process-" +
                                                                            r.id
                                                                        }
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
                                                            }
                                                        )
                                                    ) : (
                                                        <option
                                                            defaultValue={true}
                                                        >
                                                            Error al cargar los
                                                            Datos
                                                        </option>
                                                    )}
                                                </Form.Control>
                                            )}
                                            <div style={helperStyle}>
                                                Este es el semestre que se
                                                habilitara en matriculas.
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                        <Form.Label style={labelStyle}>
                                            Actividades
                                        </Form.Label>
                                        <Button
                                            disabled={
                                                !program ||
                                                !process ||
                                                semesterActivitys.length > 0
                                            }
                                            onClick={() =>
                                                this.createSemesterActivity()
                                            }
                                            style={{
                                                ...controlStyle,
                                                width: "100%",
                                                border: "0",
                                                background:
                                                    !program ||
                                                    !process ||
                                                    semesterActivitys.length > 0
                                                        ? "#d9e2ec"
                                                        : "#7b0050",
                                                color: "#ffffff",
                                                fontWeight: 800,
                                            }}
                                        >
                                            <i className="material-icons">
                                                add
                                            </i>{" "}
                                            Crear
                                        </Button>
                                        <div style={helperStyle}>
                                            Crea las filas si aun no existen.
                                        </div>
                                    </Col>
                                </Row>
                                <div style={infoGridStyle}>
                                    <div style={infoItemStyle}>
                                        <div
                                            style={{
                                                color: "#627d98",
                                                fontSize: "11px",
                                                fontWeight: 800,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Programa seleccionado
                                        </div>
                                        <p
                                            style={{
                                                color: "#102a43",
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                margin: 0,
                                            }}
                                        >
                                            {selectedProgramName}
                                        </p>
                                    </div>
                                    <div style={infoItemStyle}>
                                        <div
                                            style={{
                                                color: "#627d98",
                                                fontSize: "11px",
                                                fontWeight: 800,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Semestre seleccionado
                                        </div>
                                        <p
                                            style={{
                                                color: "#102a43",
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                margin: 0,
                                            }}
                                        >
                                            {selectedProcessName}
                                        </p>
                                    </div>
                                    <div style={infoItemStyle}>
                                        <div
                                            style={{
                                                color: "#627d98",
                                                fontSize: "11px",
                                                fontWeight: 800,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Procesos abiertos
                                        </div>
                                        <p
                                            style={{
                                                color: "#102a43",
                                                fontSize: "14px",
                                                fontWeight: 700,
                                                margin: 0,
                                            }}
                                        >
                                            {semesterActivitys.length > 0
                                                ? activeActivities +
                                                  " de " +
                                                  semesterActivitys.length
                                                : "Sin configurar"}
                                        </p>
                                    </div>
                                </div>
                                {calendarMismatch && (
                                    <div style={noticeStyle}>
                                        El semestre seleccionado pertenece a{" "}
                                        <strong>{processCalendarName}</strong>,
                                        pero la cabecera muestra como activo{" "}
                                        <strong>{currentCalendarName}</strong>.
                                        Si corresponde trabajar otro calendario,
                                        marquelo como Actual en el boton + de la
                                        cabecera.
                                    </div>
                                )}
                                {activeCalendarWithoutSemesters && (
                                    <div style={noticeStyle}>
                                        El calendario activo no tiene semestres
                                        habilitados. Abra el boton + de la
                                        cabecera, seleccione el calendario y
                                        marque los procesos I y/o II que
                                        correspondan.
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {!program || !process ? (
                            <div style={emptyStyle}>
                                Seleccione un programa y un semestre academico
                                para ver o crear las actividades del periodo.
                            </div>
                        ) : semesterActivitys.length === 0 ? (
                            <div style={emptyStyle}>
                                Este programa aun no tiene actividades para{" "}
                                <strong>{selectedProcessName}</strong>. Use el
                                boton <strong>Crear</strong> para generar
                                Inscripcion, Horarios, Matricula y demas
                                procesos.
                            </div>
                        ) : (
                            <>
                                <Card
                                    style={{
                                        border: "0",
                                        borderRadius: "8px",
                                        boxShadow:
                                            "0 8px 20px rgba(15, 23, 42, 0.10)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Card.Body style={{ padding: "0px" }}>
                                        <Row>
                                            <Col
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                                xl={12}
                                            >
                                                <Table
                                                    size="sm"
                                                    hover
                                                    responsive
                                                    style={{
                                                        width: "100%",
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <thead
                                                        style={{
                                                            background:
                                                                "#eef3f8",
                                                            color: "#334e68",
                                                            fontSize: "12px",
                                                            textTransform:
                                                                "uppercase",
                                                        }}
                                                    >
                                                        <tr>
                                                            <th>
                                                                Proceso
                                                            </th>
                                                            <th>
                                                                Fecha inicio
                                                            </th>
                                                            <th>
                                                                Fecha fin
                                                            </th>
                                                            <th>
                                                                Estado
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {semesterActivitys &&
                                                            semesterActivitys.map(
                                                                (r, i) => {
                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            <td>
                                                                                <p
                                                                                    style={{
                                                                                        marginBottom:
                                                                                            "2px",
                                                                                        fontWeight: 700,
                                                                                        color:
                                                                                            "#102a43",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        r.activity
                                                                                    }
                                                                                </p>
                                                                                <span
                                                                                    style={{
                                                                                        color:
                                                                                            "#627d98",
                                                                                        fontSize:
                                                                                            "12px",
                                                                                    }}
                                                                                >
                                                                                    {this.getActivityHelpText(
                                                                                        r.activity
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="date"
                                                                                    disabled={
                                                                                        r.finish
                                                                                    }
                                                                                    className="form-control"
                                                                                    onChange={this.handleChangeArray.bind(
                                                                                        this,
                                                                                        i,
                                                                                        "start"
                                                                                    )}
                                                                                    max="2999-12-31"
                                                                                    value={
                                                                                        r.date_start
                                                                                    }
                                                                                    style={
                                                                                        dateInputStyle
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="date"
                                                                                    disabled={
                                                                                        r.finish
                                                                                    }
                                                                                    className="form-control"
                                                                                    onChange={this.handleChangeArray.bind(
                                                                                        this,
                                                                                        i,
                                                                                        "end"
                                                                                    )}
                                                                                    max="2999-12-31"
                                                                                    value={
                                                                                        r.date_end
                                                                                    }
                                                                                    style={
                                                                                        dateInputStyle
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                {!r.finish ? (
                                                                                    <div
                                                                                        style={{
                                                                                            display:
                                                                                                "flex",
                                                                                            alignItems:
                                                                                                "center",
                                                                                            gap:
                                                                                                "8px",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            className="custom-control custom-switch"
                                                                                        >
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="custom-control-input"
                                                                                                id={
                                                                                                    "activitySwitch" +
                                                                                                    i
                                                                                                }
                                                                                                onChange={this.handleChangeArray.bind(
                                                                                                    this,
                                                                                                    i,
                                                                                                    "state"
                                                                                                )}
                                                                                                checked={
                                                                                                    r.state
                                                                                                }
                                                                                                value={
                                                                                                    r.state
                                                                                                }
                                                                                            />
                                                                                            <label
                                                                                                className="custom-control-label"
                                                                                                htmlFor={
                                                                                                    "activitySwitch" +
                                                                                                    i
                                                                                                }
                                                                                            />
                                                                                        </div>
                                                                                        <strong
                                                                                            style={{
                                                                                                color: r.state
                                                                                                    ? "#00897b"
                                                                                                    : "#9aa5b1",
                                                                                                fontSize:
                                                                                                    "13px",
                                                                                            }}
                                                                                        >
                                                                                            {r.state
                                                                                                ? "Abierto"
                                                                                                : "Cerrado"}
                                                                                        </strong>
                                                                                    </div>
                                                                                ) : (
                                                                                    <span
                                                                                        style={{
                                                                                            display:
                                                                                                "inline-block",
                                                                                            borderRadius:
                                                                                                "14px",
                                                                                            background:
                                                                                                "#e5e7eb",
                                                                                            color:
                                                                                                "#4b5563",
                                                                                            fontSize:
                                                                                                "12px",
                                                                                            fontWeight: 800,
                                                                                            padding:
                                                                                                "5px 10px",
                                                                                        }}
                                                                                    >
                                                                                        Finalizado
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    textAlign:
                                                                                        "right",
                                                                                }}
                                                                            >
                                                                                {!r.finish && (
                                                                                    <i
                                                                                        type="button"
                                                                                        title="Guardar cambios"
                                                                                        onClick={() =>
                                                                                            this.updateSemesterActivity(
                                                                                                r
                                                                                            )
                                                                                        }
                                                                                        className="material-icons"
                                                                                        style={{
                                                                                            cursor:
                                                                                                "pointer",
                                                                                            color:
                                                                                                "#7b0050",
                                                                                            fontSize:
                                                                                                "24px",
                                                                                        }}
                                                                                    >
                                                                                        save
                                                                                    </i>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                {/*{*/}
                                {/*    !semesterActivitys[0].finish &&*/}
                                <Row
                                    style={{
                                        marginTop: "14px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: "10px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    this.updateStateSemesterActivity()
                                                }
                                                type="button"
                                                style={{
                                                    border: "1px solid #cbd5e1",
                                                    borderRadius: "6px",
                                                    background: "#fff",
                                                    padding: "10px 14px",
                                                    color: "#334e68",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Cerrar todas las actividades
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.openFinishSweetAlert()
                                                }
                                                type="button"
                                                style={{
                                                    border: "0",
                                                    borderRadius: "6px",
                                                    background: "#7b0050",
                                                    padding: "10px 16px",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                <Check /> Finalizar semestre
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                                {/*}*/}
                            </>
                        )}
                    </Col>
                </Row>

                <ModalAcademic
                    listAcademicCalendarActual={() =>
                        this.listAcademicCalendarActual()
                    }
                    ref={(ref) => (this.ModalAcademic = ref)}
                />
            </>
        );
    }
}
