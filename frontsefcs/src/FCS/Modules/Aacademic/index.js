import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import {Card, Col, Form, Row} from "react-bootstrap";
import Select from "react-select";
import DataTable from "./DataTable";
import $ from 'jquery';

moment.locale('es');

class NoteManagement extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        studentLoader: false,
        deleteStudentID: "",
        organicUnit: "",
        admissionPlan: "",
        studyPlanMask: "",
        retriveData: "",

        programs: [],
        organicUnits: [],
        admissionPlans: [],

        facultadMask: "",
        programMask: "",
        sedeMask: "",
        creditMask: "",
        teacherMask: "No se registro docente",
        typeCourseMask: "",
        calendarMask: "",
        processMask: "",

        studyPlansLoader: false,
        academicCalendar: "",
        studyPlan: "",
        studyPlans: [],
        processs: [],
        academicCalendars: [],
        courses: [],
        students: [],
    };

    async componentDidMount() {

        this.getUnitOrganic()
        this.listAcademicSemesterAndAcademicCalendar();



    }

    async listSimpleProgramByOrganicUnitRegisterID(id) {
        this.setState({programsLoader: true});
        const url = app.programs + '/' + app.program + '/s-' + app.organicUnit + '-register/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({programs: res.data});
            }
            this.setState({programsLoader: false})

        } catch (err) {
            this.setState({programsLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Programas de estudio", delay: 2000});
            console.log(err)

        }

    };

    getUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                res.data.map((record, index) =>
                    this.state.organicUnits.push({
                        value: record.id,
                        label: record.denomination + " " + record.Campu.denomination,
                    }));
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };

    async listAcademicCalendar() {
        this.setState({calendarLoader: true});
        const url = app.general + '/' + app.academicCalendar;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                academicCalendars: res.data,
            });
            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async listProcessByAcademicCalendarID(academicCalendarID) {
        this.setState({calendarLoader: true});
        const url = app.general + '/' + app.academicCalendar + '/' + academicCalendarID + '/process';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                processs: res.data,
            });
            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async listAcademicSemesterAndAcademicCalendar() {
        this.setState({calendarLoader: true});
        const url = app.general + '/' + app.academicSemester + '/' + app.academicCalendar + '/all';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                processs: res.data,
            });
            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };


    async listPlanByProgramID(id_program) {
        this.setState({studyPlanLoader: true});
        const url = app.programs + '/' + app.plan + '/' + app.program + '/' + id_program;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({studyPlans: res.data});
            }
            this.setState({studyPlanLoader: false});
        } catch (err) {
            this.setState({studyPlanLoader: false});
            console.log(err)
        }
    };

    async listRegistrationCourseByProgramAndSemester(id_program, id_academic_semester) {
        this.setState({loaderPrograms: true});
        const url = app.registration + '/' + app.registrationCourse + '/' + app.program + '/' + id_program + '/' + app.academicSemester + '/' + id_academic_semester;
        try {
            const res = await axios.patch(url, app.headers);
            console.log(res.data)
            if (res.data) {

                this.setState({courses: res.data});
            } else {
                this.setState({courses: []});
            }
        } catch (err) {
            this.setState({courses: []});
            console.log(err)
        }

    };

    async listRegistrationStudentByCourseAndSemester(id_course, id_academic_semester) {
        this.setState({studentLoader: true});
        const url = app.registration + '/' + app.registrationCourse + '/' + app.course + '/' + id_course + '/' + app.academicSemester + '/' + id_academic_semester;
        try {
            const res = await axios.patch(url, app.headers);
            if (res.data.length > 0) {
                let temp = [];
                res.data.map(r =>
                    temp.push(
                        {
                            "id_registration_course": r.id,
                            "registration_course_note": r.note,
                            "registration_course_note_letter": component.numberToLetter(r.note),
                            "registration_course_state": r.state === 'Sin nota' ? true : false,
                            "id_registration": r.Registration.id,
                            "registration_type": r.Registration.type,
                            "registration_created_at": r.Registration.created_at,
                            "id_student": r.Registration.Student.id,
                            "id_person": r.Registration.Student.Person.id,
                            "document_number": r.Registration.Student.Person.document_number,
                            "email": r.Registration.Student.Person.email,
                            "name": r.Registration.Student.Person.name,
                            "photo": r.Registration.Student.Person.photo,

                        }
                    )
                )
                this.setState({students: temp});
                this.setState({studentLoader: false});
            } else {
                this.setState({students: []});
                this.setState({studentLoader: false});
            }
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }

    };

    async listTeacherScheduleByProcessCourse(id_course, id_academic_semester) {
        this.setState({studentLoader: true});
        const url = app.registration + '/' + app.schedule + '-teacher/' + id_course + '/' + id_academic_semester;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    teacherMask: res.data
                })
            } else {
                this.setState({
                    teacherMask: "No se registro docente",
                })
            }
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }

    };

    handleChange = field => event => {
        switch (field) {


            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case 'program':
                let programMask = $('#program-' + event.target.value).attr('mask-program');
                let facultadMask = $('#program-' + event.target.value).attr('mask-ou-origin');
                let sedeMask = $('#program-' + event.target.value).attr('mask-ou-register');

                this.setState({
                    program: event.target.value,
                    programMask: programMask,
                    facultadMask: facultadMask,
                    sedeMask: sedeMask,

                });
                this.state.process && this.listRegistrationCourseByProgramAndSemester(event.target.value, this.state.process);
                break;

            case 'academicCalendar':
                this.setState({academicCalendar: event.target.value, processs: []});
                this.listProcessByAcademicCalendarID(event.target.value)
                break;
            case 'process':

                let calendarMask = $('#process-' + event.target.value).attr('mask-calendar');
                let processMask = $('#process-' + event.target.value).attr('mask-process');
                this.state.program && this.listRegistrationCourseByProgramAndSemester(this.state.program, event.target.value)
                this.state.course && this.listRegistrationStudentByCourseAndSemester(this.state.course, this.state.process)
                this.state.course && this.listTeacherScheduleByProcessCourse(this.state.course, this.state.process)
                this.setState({process: event.target.value, calendarMask: calendarMask, processMask: processMask});
                break;

            case 'course':
                let courseMask = $('#course-' + event.target.value).attr('mask-course');
                let creditMask = $('#course-' + event.target.value).attr('mask-credit');
                let typeCourseMask = $('#course-' + event.target.value).attr('mask-type-course');
                this.state.process && this.listRegistrationStudentByCourseAndSemester(event.target.value, this.state.process)
                this.state.process && this.listTeacherScheduleByProcessCourse(event.target.value, this.state.process)
                this.setState({
                    course: event.target.value,
                    courseMask: courseMask,
                    creditMask: creditMask,
                    typeCourseMask: typeCourseMask
                });
                break;

            case 'studyPlan':
                this.setState({studyPlan: event.target.value});

                break;

            default:
                break;
        }
    };


    render() {

        const {
            courseLoader, process, course
        } = this.state;
        const {program} = this.state;
        // estado del modo dios
        const {organicUnits, organicUnit, programs} = this.state;
        const {processs, courses} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={"CALIFICACIONES"}
                    actualModule={"CALIFICACIONES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Card style={{marginBottom: "5px"}}>
                    <Card.Header>
                        <Row>
                            {!component.ORGANIC_UNIT &&
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                    <Form.Label className="floating-label"
                                                style={organicUnit === "" ? {color: "#ff5252 "} : null}
                                    >Unidada organica <small className="text-danger"> *</small></Form.Label>
                                    <Select
                                        isSearchable
                                        value={organicUnit}
                                        name="organicUnit"
                                        options={organicUnits}
                                        classNamePrefix="select"
                                        // isLoading={coursesLoader}
                                        className="basic-single"
                                        placeholder="Buscar unidad organica"
                                        onChange={this.handleChange("organicUnit")}
                                        styles={component.selectSearchStyle}
                                    />
                                </Form.Group>
                                <br/>
                            </Col>}

                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={process === "" ? {color: "#ff5252 "} : null}>
                                        Proceso
                                        <small className="text-danger"> *</small>
                                    </Form.Label>

                                    {this.state.calendarLoader ?
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/> :
                                        <Form.Control as="select"
                                                      value={process}
                                                      onChange={this.handleChange('process')}>
                                            >
                                            <option defaultValue={true} hidden>
                                                Proceso</option>
                                            {
                                                processs.length > 0 ?
                                                    processs.map((r, index) => {

                                                        return (
                                                            <option value={r.id} key={index}
                                                                    id={"process-" + r.id}
                                                                    mask-calendar={r.Academic_calendar.denomination.substr(-4)}
                                                                    mask-process={r.denomination.substr(-1)}
                                                            >
                                                                {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                            </option>
                                                        )

                                                    }) :
                                                    <option defaultValue={true}>Error al cargar los
                                                        Datos</option>
                                            }

                                        </Form.Control>
                                    }

                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={program === "" ? {color: "#ff5252 "} : null}
                                    >Programa<small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={program}
                                                  onChange={this.handleChange('program')}

                                    >
                                        >
                                        <option defaultValue={true} hidden>Programa</option>
                                        {
                                            programs.length > 0 ?
                                                programs.map((r, k) => {

                                                        return (<option
                                                            value={r.id} key={k}
                                                            id={"program-" + r.id}
                                                            mask-program={r.denomination}
                                                            mask-ou-origin={r.Organic_unit_origin.denomination}
                                                            mask-ou-register={r.Organic_unit_register.Campu.denomination}
                                                        >
                                                            {r.denomination}

                                                        </option>)

                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={courseLoader === "" ? {color: "#ff5252 "} : null}
                                    >Curso<small className="text-danger"> *</small></Form.Label>

                                    {this.state.admissionPlanLoader ?
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/> :
                                        <Form.Control as="select"
                                                      value={course}
                                                      onChange={this.handleChange('course')}
                                        >
                                            >
                                            <option defaultValue={true} hidden>Cursos</option>
                                            {
                                                courses.length > 0 ?
                                                    courses.map((r, k) =>
                                                        <option value={r.id}
                                                                key={k}
                                                                id={"course-" + r.id}
                                                                mask-course={r.denomination}
                                                                mask-credit={r.credits}
                                                                mask-type-course={r.type}
                                                        > {r.order + " - " + r.ciclo + " - " + r.denomination + " - " + r.credits} </option>
                                                    ) :
                                                    <option value={false} disabled>No se encontraron datos</option>
                                            }
                                        </Form.Control>
                                    }
                                </Form.Group>
                            </Col>

                        </Row>
                    </Card.Header>
                </Card>
                <div style={{position: 'relative'}}>
                    {this.state.studentLoader && component.spiner}
                    <DataTable

                        records={this.state.students}
                        facultadMask={this.state.facultadMask}
                        programMask={this.state.programMask}
                        courseMask={this.state.courseMask}
                        sedeMask={this.state.sedeMask}
                        creditMask={this.state.creditMask}
                        teacherMask={this.state.teacherMask}
                        typeCourseMask={this.state.typeCourseMask}
                        calendarMask={this.state.calendarMask}
                        processMask={this.state.processMask}
                    />
                </div>

            </>
        );
    }
}

export default NoteManagement;
