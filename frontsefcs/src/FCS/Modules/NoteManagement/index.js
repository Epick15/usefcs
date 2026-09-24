import React, { Component } from "react";
import axios from "axios";
import app from "../../Constants";
import component from "../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import {
    Button,
    Card,
    Col,
    Form,
    InputGroup,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import Select from "react-select";
import DataTable from "./DataTable";
import $ from "jquery";
import GetApp from "@material-ui/icons/GetApp";

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
        const { concept, cant, amount, observation } = this.state;

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
        return (
            <>
                <TitleModule
                    actualTitle={"CALIFICACIONES"}
                    actualModule={"CALIFICACIONES"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Card style={{ marginBottom: "5px" }}>
                    <Card.Header>
                        <Row>
                            {!component.ORGANIC_UNIT && (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group
                                        className="form-group fill "
                                        style={{ zIndex: 10000 }}
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
                                    <br />
                                </Col>
                            )}
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
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
                                <Form.Group className="form-group fill">
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
                                <Form.Group className="form-group fill">
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
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
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
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
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
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                {this.state.course && this.state.actaCode == ""
                                    ? //!component.ORGANIC_UNIT && activate &&
                                      activate && (
                                          <Button
                                              className="pull-right"
                                              variant="primary"
                                              onClick={() =>
                                                  this.createActaBook()
                                              }
                                          >
                                              {" "}
                                              Generar Acta
                                          </Button>
                                      )
                                    : this.state.actaCode && (
                                          <>
                                              <Col
                                                  xs={12}
                                                  sm={12}
                                                  md={6}
                                                  lg={6}
                                                  xl={6}
                                              >
                                                  <Form.Group className="form-group fill">
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
                                                      />
                                                      {!component.ORGANIC_UNIT && (
                                                          <InputGroup.Append
                                                              style={{
                                                                  float: "right",
                                                                  marginTop:
                                                                      "-33px",
                                                                  marginRight:
                                                                      "5px",
                                                              }}
                                                          >
                                                              <OverlayTrigger
                                                                  overlay={
                                                                      <Tooltip
                                                                          style={{
                                                                              zIndex: 100000000,
                                                                          }}
                                                                      >
                                                                          Descargar
                                                                          Acta
                                                                      </Tooltip>
                                                                  }
                                                              >
                                                                  <GetApp
                                                                      className="text-warning"
                                                                      onClick={() =>
                                                                          this.reportActa(
                                                                              this
                                                                                  .state
                                                                                  .acta
                                                                          )
                                                                      }
                                                                  />
                                                              </OverlayTrigger>
                                                          </InputGroup.Append>
                                                      )}
                                                  </Form.Group>
                                              </Col>
                                          </>
                                      )}
                            </Col>
                        </Row>
                    </Card.Header>
                </Card>
                <div style={{ position: "relative" }}>
                    {this.state.studentLoader && component.spiner}
                    <DataTable
                        activate={activate}
                        acta={this.state.acta}
                        actaState={this.state.actaState}
                        records={this.state.students}
                    />
                </div>
            </>
        );
    }
}

export default NoteManagement;
