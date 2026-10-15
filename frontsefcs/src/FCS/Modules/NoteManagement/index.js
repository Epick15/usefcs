import React, { Component } from "react";
import axios from "axios";
import app from "../../Constants";
import component from "../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import Select from "react-select";
import DataTable from "./DataTable";
import $ from "jquery";
import GetApp from "@material-ui/icons/GetApp";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Lock from "@material-ui/icons/Lock";
import Swal from "sweetalert2";

moment.locale("es");

class NoteManagement extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        activate: false,
        studentLoader: false,
        deleteStudentID: "",
        organicUnit: "",
        admissionPlan: "",
        retriveData: "",

        programs: [],
        organicUnits: [],
        admissionPlans: [],

        typeRegistration: "",
        teacher: "",
        acta: "",
        actaState: false,

        teacherName: "",
        endRegistration: "",

        academicCalendar: "",
        actaCode: "",
        schedule: "",

        processs: [],
        academicCalendars: [],
        schedules: [],
        students: [],
    };

    async componentDidMount() {
        this.getUnitOrganic();
        this.listAcademicSemesterAndAcademicCalendar();
        if (component.ORGANIC_UNIT !== "") {
            this.listSimpleProgramByOrganicUnitRegisterID(
                component.ORGANIC_UNIT
            );
            this.setState({ organicUnit: { value: component.ORGANIC_UNIT } });
        }
    }

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

    getUnitOrganic() {
        const url = app.general + "/" + app.organicUnit;
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    res.data.map((record, index) =>
                        this.state.organicUnits.push({
                            value: record.id,
                            label:
                                record.denomination +
                                " " +
                                record.Campu.denomination,
                        })
                    );
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

    async listAcademicCalendar() {
        this.setState({ calendarLoader: true });
        const url = app.general + "/" + app.academicCalendar;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    academicCalendars: res.data,
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

    async listProcessByAcademicCalendarID(academicCalendarID) {
        this.setState({ calendarLoader: true });
        const url =
            app.general +
            "/" +
            app.academicCalendar +
            "/" +
            academicCalendarID +
            "/process";

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

    async listRegistrationCourseByProgramAndSemester(
        id_program,
        id_academic_semester
    ) {
        this.setState({ loaderPrograms: true });
        const url =
            app.registration +
            "/" +
            app.registrationCourse +
            "/" +
            app.program +
            "/" +
            id_program +
            "/" +
            app.academicSemester +
            "/" +
            id_academic_semester;
        try {
            const res = await axios.patch(url, app.headers);
            console.log(res.data);
            if (res.data) {
                this.setState({ schedules: res.data });
            } else {
                this.setState({ schedules: [] });
            }
        } catch (err) {
            this.setState({ schedules: [] });
            console.log(err);
        }
    }

    async listScheduleCourseByProgramProcess(id_program, id_academic_semester) {
        this.setState({ loaderPrograms: true });
        const url =
            app.registration +
            "/" +
            app.schedule +
            "-course/" +
            id_program +
            "/" +
            id_academic_semester;
        try {
            const res = await axios.get(url, app.headers);
            console.log(res.data);
            if (res.data) {
                this.setState({ schedules: res.data });
            } else {
                this.setState({ schedules: [] });
            }
        } catch (err) {
            this.setState({ schedules: [] });
            console.log(err);
        }
    }

    async listScheduleAdmissionPlan(id_schedule) {
        this.setState({ studentLoader: true });
        const url =
            app.registration +
            "/" +
            app.schedule +
            "/" +
            app.admissionPlan +
            "/" +
            id_schedule;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    admissionPlans: res.data.plan,
                    endRegistration: res.data.end_date,
                    teacherName: res.data.teacher,
                    teacher: res.data.id_teacher,
                    studentLoader: false,
                });
            } else {
                this.setState({ admissionPlans: [], studentLoader: false });
            }
        } catch (err) {
            this.setState({ studentLoader: false });
            console.log(err);
        }
    }

    async listRegistrationCourseStudentBySchedule(id_schedule) {
        this.setState({ studentLoader: true });
        const url =
            app.registration +
            "/" +
            app.schedule +
            "/registration-course/" +
            id_schedule;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    admissionPlans: res.data.plan,
                    endRegistration: res.data.end_date,
                    teacherName: res.data.teacher,
                    teacher: res.data.id_teacher,
                    students: res.data.students,
                    studentLoader: false,
                });
            } else {
                this.setState({ admissionPlans: [], studentLoader: false });
            }
        } catch (err) {
            this.setState({ studentLoader: false });
            console.log(err);
        }
    }

    async listScheduleStundent(id_schedule, id_admission_plan) {
        this.setState({ studentLoader: true });
        const url =
            app.registration +
            "/" +
            app.schedule +
            "/" +
            app.student +
            "/" +
            id_schedule +
            "/" +
            id_admission_plan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                this.setState({ students: res.data, studentLoader: false });
            } else {
                this.setState({ students: [] });
                this.setState({ studentLoader: false });
            }
        } catch (err) {
            this.setState({ studentLoader: false });
            console.log(err);
        }
    }

    async listActaBookBySchedule(id_schedule) {
        this.setState({ actaBookLoader: true });
        const url =
            app.programs +
            "/" +
            app.actaBook +
            "/" +
            app.schedule +
            "/" +
            id_schedule;
        try {
            const res = await axios.get(url, app.headers);

            if (res.data) {
                this.setState({
                    actaCode: res.data.code_acta,
                    acta: res.data.id_acta_book,
                    actaState: res.data.state_acta,
                });
            }
            this.setState({ actaBookLoader: false });
        } catch (err) {
            this.setState({ actaBookLoader: false });
            this.setState({ actaCode: "", acta: "", actaState: false });
            console.log(err);
        }
    }

    async closeActaBook(id_acta) {
        this.setState({ loaderCloseActa: true });

        const url = app.programs + "/" + app.actaBook + "-close/" + id_acta;
        let data = new FormData();
        data.set("state", true);

        try {
            const res = await axios.patch(url, data, app.headers);
            this.listActaBookBySchedule(this.state.schedule);
            this.setState({ loaderCloseActa: false });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loaderCloseActa: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    confirmCloseActaBook = async () => {
        const alert = await Swal.fire({
            title: "¿Cerrar el acta?",
            text:
                "El acta quedará finalizada y ya no podrá anularse desde el sistema.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar acta",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#1b5e20",
        });
        if (alert.isConfirmed) this.closeActaBook(this.state.acta);
    };

    confirmDestroyActaBook = async () => {
        const alert = await Swal.fire({
            title: "¿Anular el acta?",
            text:
                "Se eliminará el acta abierta y podrá generarse nuevamente. Las calificaciones no se modificarán.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, anular acta",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#c62828",
        });
        if (alert.isConfirmed) this.destroyActaBook(this.state.acta);
    };

    async destroyActaBook(id_acta) {
        this.setState({ actaBookLoader: true });
        const url = app.programs + "/" + app.actaBook + "/" + id_acta;
        try {
            const res = await axios.delete(url, app.headers);
            this.setState({
                acta: "",
                actaCode: "",
                actaState: false,
                actaBookLoader: false,
            });
            PNotify.success({
                title: "Acta anulada",
                text: res.data.message,
                delay: 2500,
            });
        } catch (err) {
            this.setState({ actaBookLoader: false });
            PNotify.error({
                title: "No se pudo anular el acta",
                text:
                    (err.response && err.response.data && err.response.data.message) ||
                    "Ocurrió un error al anular el acta.",
                delay: 3000,
            });
        }
    }

    async createActaBook() {
        this.setState({ loaderHorary: true });
        const {
            organicUnit,
            program,
            process,
            teacher,
            type,
            course,

            schedule,
            typeRegistration,
        } = this.state;

        if (
            course !== "" &&
            teacher !== "" &&
            program !== "" &&
            process !== "" &&
            type !== "" &&
            typeRegistration !== ""
        ) {
            const url = app.programs + "/" + app.actaBook;

            let data = new FormData();
            data.set("id_process", process);
            data.set("id_program", program);
            data.set("id_teacher", teacher);
            data.set("id_course", course);
            data.set("id_schedule", schedule);

            data.set("type", typeRegistration);

            try {
                const res = await axios.post(url, data, app.headers);
                // this.closeForm()
                this.listActaBookBySchedule(
                    this.state.schedule,
                    this.state.admissionPlan
                );
                this.setState({ loaderHorary: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderHorary: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderHorary: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async retriveSemesterActivity(program, process) {
        this.setState({ loaderSchedule: true });
        const url = app.general + "/" + app.semesterActivity + "/retrive";

        try {
            let data = new FormData();
            data.set("id_process", process);
            data.set("id_program", program);
            data.set("id_activity", 8); //calificaciones
            const res = await axios.patch(url, data, app.headers);
            this.setState({
                activate: res.data,
            });
            this.listScheduleCourseByProgramProcess(program, process);
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

    handleChange = (field) => (event) => {
        switch (field) {
            case "organicUnit":
                this.setState({
                    organicUnit: { value: event.value, label: event.label },
                });
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case "program":
                this.setState({
                    program: event.target.value,
                    process: "",
                    schedule: "",
                    course: "",
                    typeRegistration: "",
                    admissionPlan: "",
                    actaCode: "",
                    admissionPlans: [],
                    teacherName: "",
                    endRegistration: "",
                    teacher: "",
                });
                // this.state.process && this.listRegistrationCourseByProgramAndSemester(event.target.value, this.state.process);
                this.state.process &&
                    this.listScheduleCourseByProgramProcess(
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
                // this.state.program && this.listScheduleCourseByProgramProcess(this.state.program, event.target.value)
                this.state.program &&
                    this.retriveSemesterActivity(
                        this.state.program,
                        event.target.value
                    );

                this.setState({
                    process: event.target.value,
                    schedule: "",
                    course: "",
                    typeRegistration: "",
                    admissionPlan: "",
                    actaCode: "",
                    actaState: false,
                    admissionPlans: [],
                    students: [],
                    teacherName: "",
                    endRegistration: "",
                    teacher: "",
                });
                break;

            case "schedule":
                let course = $("#course-" + event.target.value).attr(
                    "data-courseid"
                );
                let typeRegistration = $("#course-" + event.target.value).attr(
                    "data-typeregistration"
                );
                this.state.process &&
                    this.listRegistrationCourseStudentBySchedule(
                        event.target.value
                    );
                this.state.process &&
                    this.listActaBookBySchedule(event.target.value);

                this.setState({
                    schedule: event.target.value,
                    course: course,
                    typeRegistration: typeRegistration,
                    teacherName: "",
                    endRegistration: "",
                    teacher: "",
                    students: [],
                    admissionPlans: [],
                });
                break;

            case "admissionPlan":
                this.setState({ admissionPlan: event.target.value });
                this.state.schedule &&
                    this.listScheduleStundent(
                        this.state.schedule,
                        event.target.value
                    );
                this.state.schedule &&
                    this.listActaBookBySchedule(
                        this.state.schedule,
                        event.target.value
                    );
                break;

            default:
                break;
        }
    };

    async reportActa(id_acta_book) {
        this.setState({ registrationDataLoader: true });
        const url = app.general + "/report-acta/" + id_acta_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                component.pdfReportAutoTableActa(res.data);
            }

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    render() {
        const { courseLoader, process, activate, admissionPlan, schedule } =
            this.state;
        const { program } = this.state;
        // estado del modo dios
        const { organicUnits, organicUnit, programs, admissionPlans } =
            this.state;
        const { processs, schedules } = this.state;
        const eligibleStudents = this.state.students.filter(student =>
            student.payment_status && student.payment_status.can_enter_grade
        );
        const blockedStudents = this.state.students.filter(student =>
            !student.payment_status || !student.payment_status.can_enter_grade
        );
        const fieldStyle = {
            minHeight: "42px",
            borderColor: "#d9dee7",
            borderRadius: "7px",
            boxShadow: "none",
            fontSize: "0.86rem",
        };
        const readOnlyFieldStyle = {
            ...fieldStyle,
            background: "#f5f7fa",
            color: "#445064",
            fontWeight: 600,
        };
        return (
            <>
                <TitleModule
                    actualTitle={"CALIFICACIONES"}
                    actualModule={"CALIFICACIONES"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Card
                    style={{
                        marginBottom: "20px",
                        border: "none",
                        borderRadius: "14px",
                        boxShadow: "0 8px 24px rgba(31, 45, 61, 0.10)",
                        overflow: "hidden",
                    }}
                >
                    <Card.Header
                        style={{
                            background: "#fff",
                            border: "none",
                            padding: "22px 24px",
                        }}
                    >
                        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                            <div>
                                <h5 className="mb-1" style={{ color: "#79003c", fontWeight: 700 }}>
                                    Configuración de calificaciones
                                </h5>
                                <small className="text-muted">
                                    Seleccione el curso para consultar a los estudiantes y registrar sus notas.
                                </small>
                            </div>
                            <Badge
                                pill
                                style={{
                                    background: schedule ? "#e4f5ec" : "#f2f4f7",
                                    color: schedule ? "#147a42" : "#6c757d",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    padding: "8px 12px",
                                    marginTop: "6px",
                                }}
                            >
                                {schedule ? "Curso seleccionado" : "Pendiente de selección"}
                            </Badge>
                        </div>
                        <div
                            style={{
                                background: "#fafbfc",
                                border: "1px solid #eef0f4",
                                borderRadius: "10px",
                                padding: "18px",
                            }}
                        >
                        <div className="d-flex align-items-center mb-3">
                            <span style={{ color: "#79003c", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                Selección académica
                            </span>
                            <div style={{ background: "#e7eaf0", height: "1px", flex: 1, marginLeft: "12px" }} />
                        </div>
                        <Row style={{ rowGap: "16px" }}>
                            {!component.ORGANIC_UNIT && (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group
                                        className="form-group fill mb-0"
                                        style={{ zIndex: 10000, marginBottom: 0 }}
                                    >
                                        <Form.Label
                                            className="floating-label"
                                            style={
                                                organicUnit === ""
                                                    ? { color: "#ff5252 " }
                                                    : null
                                            }
                                        >
                                            Unidada organica{" "}
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Select
                                            isSearchable
                                            value={organicUnit}
                                            name="organicUnit"
                                            options={organicUnits}
                                            classNamePrefix="select"
                                            // isLoading={schedulesLoader}
                                            className="basic-single"
                                            placeholder="Buscar unidad organica"
                                            onChange={this.handleChange(
                                                "organicUnit"
                                            )}
                                            styles={component.selectSearchStyle}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill mb-0">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            program === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Programa
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={program}
                                        onChange={this.handleChange("program")}
                                        style={fieldStyle}
                                    >
                                        >
                                        <option defaultValue={true} hidden>
                                            Programa
                                        </option>
                                        {programs.length > 0 ? (
                                            programs.map((r, k) => {
                                                return (
                                                    <option
                                                        value={r.id}
                                                        key={k}
                                                        id={"program-" + r.id}
                                                        mask-program={
                                                            r.denomination
                                                        }
                                                        mask-ou-origin={
                                                            r
                                                                .Organic_unit_origin
                                                                .denomination
                                                        }
                                                        mask-ou-register={
                                                            r
                                                                .Organic_unit_register
                                                                .Campu
                                                                .denomination
                                                        }
                                                    >
                                                        {r.denomination}
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
                            <Col xs={12} sm={12} md={1} lg={1} xl={1}>
                                <Form.Group className="form-group fill mb-0">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            process === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Proceso
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
                                            style={fieldStyle}
                                        >
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

                            <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                                <Form.Group className="form-group fill mb-0">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            courseLoader === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Curso
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    {this.state.admissionPlanLoader ? (
                                        <span
                                            className="spinner-border spinner-border-sm mr-1"
                                            role="status"
                                        />
                                    ) : (
                                        <Form.Control
                                            as="select"
                                            value={schedule}
                                            onChange={this.handleChange(
                                                "schedule"
                                            )}
                                            style={fieldStyle}
                                        >
                                            <option defaultValue={true} hidden>
                                                Cursos
                                            </option>
                                            {schedules.length > 0 ? (
                                                schedules.map((r, k) => (
                                                    <option
                                                        value={r.id}
                                                        key={k}
                                                        id={"course-" + r.id}
                                                        data-courseid={
                                                            r.Course.id
                                                        }
                                                        data-typeregistration={
                                                            r.type_registration
                                                        }
                                                    >
                                                        {" "}
                                                        {r.Course.order +
                                                            "-" +
                                                            r.Course.Ciclo
                                                                .ciclo +
                                                            "-" +
                                                            r.Course
                                                                .denomination +
                                                            "-" +
                                                            r.type_registration +
                                                            "-" +
                                                            r.group_class}{" "}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={false} disabled>
                                                    No se encontraron datos
                                                </option>
                                            )}
                                        </Form.Control>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <div className="d-flex align-items-center" style={{ marginTop: "2px" }}>
                                    <span style={{ color: "#79003c", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                        Información del registro
                                    </span>
                                    <div style={{ background: "#e7eaf0", height: "1px", flex: 1, marginLeft: "12px" }} />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill mb-0">
                                    <Form.Label className="floating-label">
                                        Docente{" "}
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Plan de estudio"
                                        id="teachermask"
                                        value={this.state.teacherName}
                                        disabled={true}
                                        style={readOnlyFieldStyle}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill mb-0">
                                    <Form.Label className="floating-label">
                                        Fecha Limite de registro{" "}
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Plan de estudio"
                                        id="endDate"
                                        value={this.state.endRegistration}
                                        disabled={true}
                                        style={readOnlyFieldStyle}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                {this.state.course && this.state.actaCode == ""
                                    ? //!component.ORGANIC_UNIT && activate &&
                                      activate && (
                                          <Button
                                              className="w-100"
                                              variant="primary"
                                              style={{ minHeight: "42px", marginTop: "16px", borderRadius: "7px", fontWeight: 600 }}
                                              onClick={() =>
                                                  this.createActaBook()
                                              }
                                          >
                                              {" "}
                                              Generar Acta
                                          </Button>
                                      )
                                    : this.state.actaCode && (
                                                  <Form.Group
                                                      className="form-group fill mb-0"
                                                      style={{ position: "relative" }}
                                                  >
                                                      <Form.Label className="floating-label">
                                                          Codigo de acta{" "}
                                                          <small className="text-danger">
                                                              {" "}
                                                              *
                                                          </small>
                                                      </Form.Label>

                                                      <Form.Control
                                                          type="text"
                                                          placeholder="Plan de estudio"
                                                          id="codeacta"
                                                          value={
                                                              this.state
                                                                  .actaCode
                                                          }
                                                          disabled={true}
                                                          style={{
                                                              ...readOnlyFieldStyle,
                                                              paddingRight: component.IS_GOD
                                                                  ? "120px"
                                                                  : "48px",
                                                          }}
                                                      />
                                                      <OverlayTrigger
                                                          placement="top"
                                                          overlay={
                                                              <Tooltip>
                                                                  Descargar acta
                                                              </Tooltip>
                                                          }
                                                      >
                                                          <Button
                                                              type="button"
                                                              variant="light"
                                                              aria-label="Descargar acta"
                                                              onClick={() =>
                                                                  this.reportActa(
                                                                      this.state.acta
                                                                  )
                                                              }
                                                              style={{
                                                                  position: "absolute",
                                                                  right: "5px",
                                                                  bottom: "4px",
                                                                  zIndex: 3,
                                                                  width: "34px",
                                                                  height: "34px",
                                                                  padding: 0,
                                                                  border: "none",
                                                                  borderRadius: "6px",
                                                                  color: "#a05a00",
                                                                  background: "#fff3d6",
                                                                  display: "inline-flex",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                              }}
                                                          >
                                                              <GetApp fontSize="small" />
                                                          </Button>
                                                      </OverlayTrigger>
                                                      {component.IS_GOD &&
                                                          !this.state.actaState && (
                                                              <OverlayTrigger
                                                                  placement="top"
                                                                  overlay={
                                                                      <Tooltip>
                                                                          Anular acta abierta
                                                                      </Tooltip>
                                                                  }
                                                              >
                                                                  <Button
                                                                      type="button"
                                                                      variant="light"
                                                                      aria-label="Anular acta"
                                                                      onClick={
                                                                          this
                                                                              .confirmDestroyActaBook
                                                                      }
                                                                      style={{
                                                                          position:
                                                                              "absolute",
                                                                          right: "44px",
                                                                          bottom: "4px",
                                                                          zIndex: 3,
                                                                          width: "34px",
                                                                          height: "34px",
                                                                          padding: 0,
                                                                          border: "none",
                                                                          borderRadius:
                                                                              "6px",
                                                                          color: "#b71c1c",
                                                                          background:
                                                                              "#ffebee",
                                                                          display:
                                                                              "inline-flex",
                                                                          alignItems:
                                                                              "center",
                                                                          justifyContent:
                                                                              "center",
                                                                      }}
                                                                  >
                                                                      <DeleteForever fontSize="small" />
                                                                  </Button>
                                                              </OverlayTrigger>
                                                          )}
                                                      {component.IS_GOD &&
                                                          !this.state.actaState && (
                                                              <OverlayTrigger
                                                                  placement="top"
                                                                  overlay={
                                                                      <Tooltip>
                                                                          Cerrar acta
                                                                      </Tooltip>
                                                                  }
                                                              >
                                                                  <Button
                                                                      type="button"
                                                                      variant="light"
                                                                      aria-label="Cerrar acta"
                                                                      onClick={
                                                                          this
                                                                              .confirmCloseActaBook
                                                                      }
                                                                      disabled={
                                                                          this
                                                                              .state
                                                                              .loaderCloseActa
                                                                      }
                                                                      style={{
                                                                          position:
                                                                              "absolute",
                                                                          right: "83px",
                                                                          bottom: "4px",
                                                                          zIndex: 3,
                                                                          width: "34px",
                                                                          height: "34px",
                                                                          padding: 0,
                                                                          border: "none",
                                                                          borderRadius:
                                                                              "6px",
                                                                          color: "#1b5e20",
                                                                          background:
                                                                              "#e8f5e9",
                                                                          display:
                                                                              "inline-flex",
                                                                          alignItems:
                                                                              "center",
                                                                          justifyContent:
                                                                              "center",
                                                                      }}
                                                                  >
                                                                      <Lock fontSize="small" />
                                                                  </Button>
                                                              </OverlayTrigger>
                                                          )}
                                                  </Form.Group>
                                      )}
                            </Col>
                        </Row>
                        </div>
                    </Card.Header>
                </Card>
                <div style={{ position: "relative" }}>
                    {this.state.studentLoader && component.spiner}
                    {schedule && (
                        <Row className="mb-3">
                            <Col xs={12} md={6} className="mb-3 mb-md-0">
                                <Card style={{ border: "1px solid #ccebd9", borderRadius: "12px", background: "linear-gradient(135deg, #f2fcf6, #e6f7ed)", boxShadow: "0 4px 14px rgba(20, 122, 66, 0.08)" }}>
                                    <Card.Body className="py-3 px-4">
                                        <small className="text-uppercase" style={{ color: "#147a42", fontWeight: 700, letterSpacing: "0.04em" }}>Habilitados para notas</small>
                                        <div className="d-flex align-items-end justify-content-between mt-1">
                                            <strong style={{ color: "#146c38", fontSize: "2rem", lineHeight: 1 }}>{eligibleStudents.length}</strong>
                                            <span className="text-muted small">pagos al día</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} md={6}>
                                <Card style={{ border: "1px solid #f2d69a", borderRadius: "12px", background: "linear-gradient(135deg, #fffaf0, #fff3d8)", boxShadow: "0 4px 14px rgba(180, 120, 0, 0.08)" }}>
                                    <Card.Body className="py-3 px-4">
                                        <small className="text-uppercase" style={{ color: "#9a6700", fontWeight: 700, letterSpacing: "0.04em" }}>Bloqueados por pagos</small>
                                        <div className="d-flex align-items-end justify-content-between mt-1">
                                            <strong style={{ color: "#8a5a00", fontSize: "2rem", lineHeight: 1 }}>{blockedStudents.length}</strong>
                                            <span className="text-muted small">requieren regularización</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                    {schedule && blockedStudents.length > 0 && (
                        <Alert
                            variant="warning"
                            className="mb-4"
                            style={{
                                border: "1px solid #f2d69a",
                                borderLeft: "5px solid #c68a00",
                                borderRadius: "10px",
                                background: "#fffaf0",
                            }}
                        >
                            <Alert.Heading style={{ fontSize: "1rem", fontWeight: 700 }}>
                                Estudiantes bloqueados por pagos pendientes
                            </Alert.Heading>
                            Hay {blockedStudents.length} estudiante(s) sin habilitación para notas. Deben regularizar la matrícula y todas las pensiones del ciclo en <strong>Contabilidad</strong> antes de continuar. Si no regularizan el pago y figuran en el listado principal, su nota en el acta será <strong>0 (cero)</strong>, por lo que quedarán desaprobados.
                        </Alert>
                    )}
                    {schedule && (
                        <>
                            <Card style={{ border: "none", borderRadius: "14px", boxShadow: "0 6px 20px rgba(31, 45, 61, 0.08)", overflow: "hidden" }}>
                                <Card.Body className="p-0">
                                    <DataTable
                                        activate={activate}
                                        acta={this.state.acta}
                                        actaState={this.state.actaState}
                                        records={eligibleStudents}
                                        title="ESTUDIANTES HABILITADOS PARA REGISTRAR NOTAS"
                                    />
                                </Card.Body>
                            </Card>
                            {blockedStudents.length > 0 && (
                                <Card className="mt-4" style={{ border: "1px solid #f2d69a", borderRadius: "14px", boxShadow: "0 6px 20px rgba(31, 45, 61, 0.08)", overflow: "hidden" }}>
                                    <Card.Body className="p-0">
                                        <DataTable
                                            blocked={true}
                                            activate={false}
                                            acta={this.state.acta}
                                            actaState={this.state.actaState}
                                            records={blockedStudents}
                                            title="ESTUDIANTES BLOQUEADOS POR PAGOS PENDIENTES"
                                        />
                                    </Card.Body>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }
}

export default NoteManagement;
