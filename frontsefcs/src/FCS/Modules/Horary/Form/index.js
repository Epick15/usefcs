import React from 'react';
import {Button, Card, Col, Dropdown, Form, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";
import Swal from "sweetalert2";
import defaultUser from "../../../../assets/images/user/default.jpg";
import Delete from "@material-ui/icons/Delete";
import TeacherForm from "../../../Component/TeacherForm";
import Fingerprint from "@material-ui/icons/Fingerprint";

moment.locale('es');


class HoraryForm extends React.Component {
    state = {

        action: 'add',
        day: [{day: '/Lun', state: false}, {day: '/Mar', state: false}, {day: '/Mie', state: false}, {
            day: '/Jue', state: false
        }, {day: '/Vie', state: false}, {day: '/Sab', state: false}, {day: '/Dom', state: false}],
        course: '',
        typeCourse: '',
        group: '',
        ambient: '',
        typeRegistration: '',
        startTime: '',
        principalTeacher: false,
        formTeacher: false,
        endTime: '',
        studyPlan: '',
        startDate: '',
        endDateActa: '',
        endDate: '',
        teacher: '',
        person: '',
        scheduleID: '',
        contractType: '',
        charge: '',
        charges: [],
        contractTypes: [],
        courses: [],
        horarys: [],
        teachers: [],
        studyPlans: [],
        persons: []


    };

    async componentDidMount() {

        this.getCharges();
        this.getContractTypes();


    };

    componentDidUpdate(prevProps, prevState) {


        if (prevProps.form !== this.props.form) {
            this.setState({form: this.props.form});
        }

        if (prevProps.retriveDataSchedule !== this.props.retriveDataSchedule) {
            this.props.retriveDataSchedule !== '' && this.retriveDataSchedule(this.props.retriveDataSchedule)
        }
        if (prevProps.program !== this.props.program) {
            this.props.program !== '' && this.listPlanByProgramID(this.props.program)
        }


    }

    async listPlanByProgramID(id) {
        this.setState({loader: true});
        const url = app.programs + '/' + app.plan + '/' + app.program + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({studyPlans: res.data});
            }
            this.setState({loader: false})

        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: 2000});
            console.log(err)

        }

    };

    getCharges() {
        const url = app.general + '/' + app.charge;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({charge: res.data[3].id})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!", text: "Error al obtener cargos", delay: 2000
            });
            console.log(err)
        })
    };

    getContractTypes() {
        const url = app.general + '/' + app.contractType;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({contractTypes: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!", text: "Error al obtener tipos de contrato", delay: 2000
            });
            console.log(err)
        })
    };

    async listHoraryBySchedule(scheduleID) {
        this.setState({loaderData: true});
        const url = app.registration + '/' + app.horary + '/' + scheduleID;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                horarys: res.data
            });


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listTeacherBySchedule(scheduleID) {
        this.setState({loaderData: true});
        const url = app.person + '/' + app.teacher + '/' + app.schedule + '/' + scheduleID;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                teachers: res.data
            });


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    searchCourse(program, studyPlan, params) {
        if (params === '') {
            this.setState({persons: []})
        } else {
            const url = app.programs + '/search-' + app.course + '/' + params;
            let data = new FormData();
            data.set('id_program', program)
            data.set('id_study_plan', studyPlan)
            axios.patch(url, data, app.headers).then(res => {
                if (res.data) this.setState({courses: res.data})
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                });
                console.log(err)
            })
        }

    };

    searchPerson(params) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/search-person' + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) this.setState({persons: res.data})
                }).catch(err => {
                    PNotify.error({
                        title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                    });
                    console.log(err)
                })
            }

        }

    };

    async createSchedule() {
        this.setState({loaderHorary: true});
        const {organicUnit, program, process} = this.props;
        const {

            courseID, group, typeRegistration, startDate, endDate, endDateActa,


        } = this.state;

        if (courseID !== "" && group !== "" && program !== "" && process !== "" && startDate !== "" && endDate !== "" && endDateActa !== "" && organicUnit !== "" && typeRegistration !== "") {
            const url = app.registration + '/' + app.schedule;
            let data = new FormData();
            data.set("id_course", courseID);
            data.set("id_organic_unit", organicUnit);
            data.set("id_process", process);
            data.set("id_program", program);
            data.set("group_class", group);
            data.set("type", typeRegistration);
            data.set("start_date", startDate);
            data.set("end_date", endDate);
            data.set("end_date_acta", endDateActa);


            try {
                const res = await axios.post(url, data, app.headers);
                this.closeForm()
                this.setState({loaderHorary: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderHorary: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderHorary: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async createTeacher() {
        this.setState({loaderHorary: true});
        const {organicUnit, program, process} = this.props;
        const {

            personID, scheduleID, principalTeacher,


        } = this.state;

        if (personID !== "" && scheduleID !== "") {
            const url = app.person + '/' + app.teacher;
            let data = new FormData();
            data.set("id_person", personID);
            data.set("id_schedule", scheduleID);
            data.set("id_organic_unit", organicUnit);
            data.set("principal", principalTeacher);


            try {
                const res = await axios.post(url, data, app.headers);
                this.listTeacherBySchedule(this.state.scheduleID)
                this.closeSelectectTeacher()
                this.setState({loaderHorary: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderHorary: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderHorary: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async createHorary() {
        this.setState({loaderHorary: true});

        const {
            scheduleID, typeCourse, teacher, day, ambient, startTime, endTime
        } = this.state;

        let tempDay = '';
        for (let i = 0; i < day.length; i++) {
            if (day[i].state) {
                tempDay = tempDay + day[i].day
            }

        }
        if (scheduleID !== "" && typeCourse !== "" && day !== "" && ambient !== "" && teacher !== "" && startTime !== "" && endTime !== "" && tempDay !== "") {
            const url = app.registration + '/' + app.horary;
            let data = new FormData();
            data.set("id_schedule", scheduleID);
            data.set("id_teacher", teacher);
            data.set("type_course", typeCourse);
            data.set("days", tempDay);
            data.set("ambient", ambient);
            data.set("start_time", startTime);
            data.set("end_time", endTime);


            try {
                const res = await axios.post(url, data, app.headers);
                this.listHoraryBySchedule(this.state.scheduleID);
                this.cleanHorary()
                this.setState({loaderHorary: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderHorary: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderHorary: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateSchedule() {
        this.setState({loaderHorary: true});
        const {organicUnit, program, process} = this.props;
        const {
            scheduleID, courseID, group, startDate, typeRegistration, endDate, endDateActa,


        } = this.state;

        if (courseID !== "" && group !== "" && program !== "" && process !== "" && startDate !== "" && endDate !== "" && endDateActa !== "" && organicUnit !== "" && typeRegistration !== "") {
            const url = app.registration + '/' + app.schedule + '/' + scheduleID;
            let data = new FormData();
            data.set("id_course", courseID);
            data.set("group_class", group);
            data.set("type", typeRegistration);
            data.set("start_date", startDate);
            data.set("end_date", endDate);
            data.set("end_date_acta", endDateActa);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.closeForm()
                this.setState({loaderHorary: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderHorary: false});
                PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});

            }

        } else {
            this.setState({loaderHorary: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    handleChange = field => event => {
        switch (field) {
            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case 'course':
                this.setState({course: event.target.value});
                this.state.studyPlan && this.props.program && this.searchCourse(this.props.program, this.state.studyPlan, event.target.value)
                break;
            case 'typeCourse':
                this.setState({typeCourse: event.target.value});
                break;
            case 'startDate':
                this.setState({startDate: event.target.value});
                break;
            case 'endDate':
                this.setState({endDate: event.target.value});
                break;
            case 'group':
                this.setState({group: event.target.value});
                break;
            case 'typeRegistration':
                this.setState({typeRegistration: event.target.value});
                break;
            case 'ambient':
                this.setState({ambient: event.target.value});
                break;
            case 'studyPlan':
                this.setState({studyPlan: event.target.value});
                break;
            case 'contractType':
                this.setState({contractType: event.target.value});
                break;
            case 'startTime':
                this.setState({startTime: event.target.value});
                break;
            case 'endTime':
                this.setState({endTime: event.target.value});
                break;
            case 'endDateActa':
                this.setState({endDateActa: event.target.value});
                break;
            case 'teacher':
                this.setState({teacher: event.target.value});
                break;
            case 'person':
                this.setState({person: event.target.value});
                this.searchPerson(event.target.value)
                break;


            default:
                break;
        }
    };


    closeForm = () => {
        this.props.closeForm()
        this.setState({
            scheduleID: '',
            action: 'add',
            day: [{day: '/Lun', state: false}, {day: '/Mar', state: false}, {day: '/Mie', state: false}, {
                day: '/Jue', state: false
            }, {day: '/Vie', state: false}, {day: '/Sab', state: false}, {day: '/Dom', state: false}],
            course: '',
            typeCourse: '',
            typeRegistration: '',
            group: '',
            ambient: '',
            startTime: '',
            endTime: '',
            startDate: '',
            endDate: '',
            endDateActa: '',
            teacher: '',
            courseID: '',
            teacherID: '',

            contractType: '',
            courses: [],
            persons: [],
            horarys: [],
            teachers: []
        })
    };
    cleanHorary = () => {

        this.setState({

            day: [{day: '/Lun', state: false}, {day: '/Mar', state: false}, {day: '/Mie', state: false}, {
                day: '/Jue', state: false
            }, {day: '/Vie', state: false}, {day: '/Sab', state: false}, {day: '/Dom', state: false}],

            typeCourse: '',

            teacher: '', ambient: '', startTime: '', endTime: '',

        })
    };
    openStudentSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!, Se eliminaran todos los datos de este estudiante",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyStudent(id) : this.props.closeForm();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    retriveDataSchedule = (r) => {
        this.listHoraryBySchedule(r.id);
        this.listTeacherBySchedule(r.id);
        this.setState({
            scheduleID: r.id || '',
            action: "update",
            typeRegistration: r.type_registration === 'R' ? 'Regular' : r.type_registration === 'D' ? 'Curso dirigido Otros' : 'Aplazado',
            course: r.Course.denomination || '',
            group: r.group_class || '',
            startDate: r.start_date,
            endDate: r.end_date,
            endDateActa: r.end_date_acta,
            courseID: r.Course && r.Course.id || '',

            courses: [],
            persons: [],
            teachers: []
        })


    };
    selectectCourse = (r) => {


        this.setState({
            courseID: r.id, course: r.denomination + ' - ' + r.Ciclo.ciclo, courses: [],

        });
    };
    closeSelectectCourse = () => {

        this.setState({

            courseID: '', course: '', courses: [],

        });
    };


    selectectTeacher = (r) => {


        this.setState({
            personID: r.id, person: r.name, persons: [],

        });
    };

    closeSelectectTeacher = () => {

        this.setState({
            personID: '', person: '', persons: [],

        });
    };
    togglePrincipalTeacher = () => {
        this.setState({principalTeacher: !this.state.principalTeacher});
    }
    toggleHandler = (d) => {
        let array = this.state.day;
        let totalDay = '';
        array[d].state = !array[d].state;

        this.setState({
            day: array
        });
        array.map(r => {
            if (r.state) {
                totalDay += r.day;
            }
        });

        this.setState({totalDay: totalDay});
        return array[d].state
    };

    async destroyHorary(id) {

        try {
            // this.setState({loaderDestroyStudent: true});
            const url = app.registration + '/' + app.horary + '/' + id
            const res = await axios.delete(url, app.headers);
            if (res) {
                this.listHoraryBySchedule(this.state.scheduleID)
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            }

            // this.setState({loaderDestroyStudent: false});


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
            // this.setState({loaderDestroyStudent: false});
            return false;
        }
    };

    async destroyTeacher(id) {

        try {
            // this.setState({loaderDestroyStudent: true});
            const url = app.person + '/' + app.teacher + '/' + id
            const res = await axios.delete(url, app.headers);
            if (res) {
                this.listTeacherBySchedule(this.state.scheduleID)
                this.listHoraryBySchedule(this.state.scheduleID)
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            }

            // this.setState({loaderDestroyStudent: false});


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
            // this.setState({loaderDestroyStudent: false});
            return false;
        }
    };

    swalHorary = async (id) => {
        this.destroyHorary(id);
    };
    swalTeacher = async (id) => {
        this.destroyTeacher(id);
    };
    openFormTeacher = () => {
        // this.setState({formTeacher: true})
    };
    closeFormTeacher = () => {
        this.setState({formTeacher: false})
    }

    async createUserIntranet(id, type) {

        document.getElementById('generate-' + id).style.display = "none";
        document.getElementById('spin-' + id).style.display = "";
        if (id !== '' && type !== '') {
            const url = app.intranet + '/' + app.userIntranet;
            let data = new FormData();
            data.set('id_person', id);
            data.set('type', type);
            try {
                const res = await axios.post(url, data, app.headers);
                document.getElementById('generate-' + id).style.display = "";
                document.getElementById('spin-' + id).style.display = "none";
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            } catch (err) {

                document.getElementById('generate-' + id).style.display = "";
                document.getElementById('spin-' + id).style.display = "none";
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            }

        } else {
            document.getElementById('generate-' + id).style.display = "";
            document.getElementById('spin-' + id).style.display = "none";
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    render() {
        console.log(this.props.form)
        const {
            action
        } = this.state;

        const {
            day,
            course,
            contractTypes,
            contractType,
            typeCourse,
            ambient,
            principalTeacher,
            group,
            studyPlan,
            studyPlans,
            startTime,
            endTime,
            startDate,
            endDate,
            endDateActa,
            person,
            typeRegistration,
            teacher,
            courses,
            teachers,
            persons,
        } = this.state;
        const fullScreenStyle = {
            position: 'fixed', top: 0, left: 0, right: 0, width: this.props.windowWidth, // overflowY: 'auto',
            height: '100%'
        };
        const scrollable = {
            overflowY: 'auto', maxHeight: ' 900px',
        };
        return (<>
                {this.state.form && <Row className='btn-page'>
                    <Card className="full-card" style={fullScreenStyle}>
                        <Card.Header style={{background: '#4680ff'}}>
                            <Card.Title as='h5' style={{color: 'white', fontSize: '20px'}}>Carga
                                Horaria</Card.Title>
                            <div className="d-inline-block pull-right">

                                <div className="card-header-right">

                                    <Dropdown alignRight={true} className="pull-right mt-2">
                                        <Dropdown.Toggle className="btn-icon" style={{
                                            border: 'none', background: 'none', outline: 'none', color: 'white',


                                        }}>
                                            <i
                                                onClick={() => this.closeForm()}
                                                className="material-icons pull-right "
                                            >close</i>
                                        </Dropdown.Toggle>

                                    </Dropdown>
                                </div>


                            </div>
                        </Card.Header>
                        <Card.Body style={scrollable}>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <h5>Datos del curso</h5>
                                            <hr/>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={studyPlan === "" ? {color: "#ff5252 "} : null}
                                                >Plan de Estudio<small
                                                    className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                              value={studyPlan}
                                                              onChange={this.handleChange('studyPlan')}
                                                >

                                                    <option defaultValue={true} hidden>Plan de estudio</option>
                                                    <option defaultValue={true} hidden>Docente</option>
                                                    {studyPlans.length > 0 ? studyPlans.map((r, k) => {

                                                        return (<option
                                                            value={r.id}
                                                            key={k}> {r.description}
                                                        </option>)

                                                    }) : <option value={false} disabled>No se encontraron
                                                        datos</option>}
                                                </Form.Control>
                                            </Form.Group>

                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={course === "" ? {color: "#ff5252 "} : null}
                                                >Curso<small className="text-danger"> *</small></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="number"
                                                    value={course}
                                                    onChange={this.handleChange('course')}
                                                    placeholder="Buscar curso"
                                                    margin="normal"
                                                />

                                                <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectCourse()}
                                                        type="button"
                                                        style={{
                                                            position: 'relative',
                                                            zIndex: 100,
                                                            padding: '0',
                                                            border: 'none',
                                                            background: 'none',
                                                            outline: 'none',
                                                            color: '#7b7f84',
                                                            marginTop: '-30px',
                                                            float: 'right'
                                                        }}
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger>


                                                <Table hover responsive style={{marginTop: '-1px'}}>
                                                    <tbody>
                                                    {courses.length > 0 && courses.map((r, i) => {
                                                        let ciclo = r.Ciclo && r.Ciclo.ciclo;
                                                        let totalHours = parseFloat(r.practical_hours) + parseFloat(r.hours);
                                                        return (<tr key={i} onClick={() => this.selectectCourse(r)}>
                                                            <td scope="row">
                                                                <div
                                                                    className="d-inline-block align-middle">

                                                                    <div className="d-inline-block">
                                                                        <h6 className="m-b-0"> {r.denomination.toUpperCase() + ' - ' + ciclo}</h6>

                                                                    </div>
                                                                </div>

                                                            </td>
                                                        </tr>)
                                                    })}
                                                    </tbody>
                                                </Table>

                                            </Form.Group>

                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={typeRegistration === "" ? {color: "#ff5252 "} : null}
                                                >Tipo Matrícula<small
                                                    className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                              value={typeRegistration}
                                                              onChange={this.handleChange('typeRegistration')}
                                                >

                                                    <option defaultValue={true} hidden>Seleccione</option>
                                                    <option value="Regular"> Regular o Extemporánea (R)</option>
                                                    <option value="Curso dirigido Otros">Curso dirigido Tesis u
                                                        Otros
                                                        (D)
                                                    </option>
                                                    <option value="Aplazado">Aplazado (A)</option>
                                                    <option value="Convalidado UNSM">Convalidado UNSM (C)</option>
                                                    <option value="Convalidado Externo">Convalidado Externo (CC)
                                                    </option>
                                                    {/*<option value="Curso desaprobado por Credito">Curso desaprobado por*/}
                                                    {/*    Credito (R)*/}
                                                    {/*</option>*/}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={group === "" ? {color: "#ff5252 "} : null}
                                                >Grupo<small className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                              value={group}
                                                              onChange={this.handleChange('group')}
                                                >
                                                    >
                                                    <option defaultValue={true} hidden>Grupo</option>
                                                    <option value={"01"}> 01</option>
                                                    <option value={"02"}> 02</option>
                                                    <option value={"03"}> 03</option>
                                                    <option value={"04"}> 04</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={startDate === "" ? {color: "#ff5252 "} : null}
                                                >Fecha Inicio <small className="text-danger"> *</small></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    className="form-control"
                                                    onChange={this.handleChange('startDate')}
                                                    max="2999-12-31"
                                                    value={startDate}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"

                                                >Fecha Fin <small className="text-danger"> *</small></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    className="form-control"
                                                    onChange={this.handleChange('endDate')}
                                                    max="2999-12-31"
                                                    value={endDate}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"

                                                >Fecha Fin de registro de Acta<small
                                                    className="text-danger"> *</small></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    className="form-control"
                                                    onChange={this.handleChange('endDateActa')}
                                                    max="2999-12-31"
                                                    value={endDateActa}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                            {action === "add" ? <Button
                                                    className="pull-right"
                                                    disabled={this.state.loaderPerson}
                                                    variant="primary"
                                                    onClick={() => this.createSchedule()}
                                                >
                                                    {this.state.loaderPerson &&
                                                        <span className="spinner-border spinner-border-sm mr-1"
                                                              role="status"/>}
                                                    Guardar</Button>

                                                :

                                                <Button
                                                    className="pull-right"
                                                    disabled={this.state.loaderPerson}
                                                    variant="primary"
                                                    onClick={() => this.updateSchedule()}
                                                >
                                                    {this.state.loaderPerson &&
                                                        <span className="spinner-border spinner-border-sm mr-1"
                                                              role="status"/>}
                                                    Guardar Cambios</Button>

                                            }

                                        </Col>


                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <h5>Registrar docente en el curso</h5>
                                            <hr/>
                                        </Col>

                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={person === "" ? {color: "#ff5252 "} : null}
                                                >Docente<small className="text-danger"> *</small></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="teacher"
                                                    value={person}
                                                    onChange={this.handleChange('person')}
                                                    placeholder="Buscar curso"
                                                    margin="normal"
                                                />
                                                {person ? <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectTeacher()}
                                                        type="button"
                                                        style={{
                                                            position: 'relative',
                                                            zIndex: 100,
                                                            padding: '0',
                                                            border: 'none',
                                                            background: 'none',
                                                            outline: 'none',
                                                            color: '#7b7f84',
                                                            marginTop: '-30px',
                                                            float: 'right'
                                                        }}
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger> : <OverlayTrigger
                                                    overlay={<Tooltip>NUEVO</Tooltip>}>
                                                    <button
                                                        onClick={() => this.openFormTeacher()}
                                                        type="button"
                                                        style={{
                                                            position: 'relative',
                                                            zIndex: 100,
                                                            padding: '0',
                                                            border: 'none',
                                                            background: 'none',
                                                            outline: 'none',
                                                            color: '#7b7f84',
                                                            marginTop: '-30px',
                                                            float: 'right'
                                                        }}
                                                        className=" btn btn-dark"><Add
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger>

                                                }


                                                <Table hover responsive style={{marginTop: '-1px'}}>
                                                    <tbody>
                                                    {persons.length > 0 && persons.map((r, i) => {
                                                        return (<tr key={i}
                                                                    onClick={() => this.selectectTeacher(r)}>
                                                            <td scope="row">
                                                                <div
                                                                    className="d-inline-block align-middle">
                                                                    <img
                                                                        src={r.photo !== "" ? app.server + 'person-photography/' + r.photo : defaultUser}
                                                                        // src={defaultUser}
                                                                        alt="user"
                                                                        className="img-radius align-top m-r-15"
                                                                        style={{width: '40px'}}
                                                                    />
                                                                    <div className="d-inline-block">

                                                                        <h6 className="m-b-0"> {r.name}</h6>
                                                                        <p className="m-b-0"> {r.document_number} </p>

                                                                    </div>
                                                                </div>

                                                            </td>
                                                        </tr>)
                                                    })}
                                                    </tbody>
                                                </Table>

                                            </Form.Group>

                                        </Col>


                                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                            <Form.Group className="form-group fill mt-3 ">
                                                <Form.Label className="floating-label mt-n3">Marcar si es docente
                                                    principal(Encargado de registrar notas)</Form.Label>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="principal"
                                                               onChange={() => this.togglePrincipalTeacher()}
                                                               checked={principalTeacher}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="principal">Si</label>
                                                    </div>
                                                </div>

                                            </Form.Group>


                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <Button
                                                className="pull-right"
                                                disabled={this.state.loaderPerson}
                                                variant="primary"
                                                onClick={() => this.createTeacher()}
                                            >
                                                {this.state.loaderPerson &&
                                                    <span className="spinner-border spinner-border-sm mr-1"
                                                          role="status"/>}
                                                Guardar</Button>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <br/>
                                        </Col>
                                        <Table responsive size="sm">

                                            <tbody>
                                            {this.state.teachers && this.state.teachers.map((r, i) => {
                                                return (<tr key={i}>

                                                    <td>{r.Person.name}</td>
                                                    <td>{r.principal ? <>
                                                                <span id={'spin-' + r.Person.id}
                                                                      style={{display: 'none'}}
                                                                      className="spinner-border spinner-border-sm mr-1"
                                                                      role="status"/>
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>GENERAR ACCESO</Tooltip>}>
                                                            <Fingerprint className={"text-info"}
                                                                         id={'generate-' + r.Person.id}
                                                                         onClick={() => this.createUserIntranet(r.Person.id, 'Docente')}/>
                                                        </OverlayTrigger>
                                                    </> : ''

                                                    }</td>
                                                    <td><Delete style={{color: "#ff5252"}}
                                                                onClick={() => this.swalTeacher(r.id)}
                                                    /></td>

                                                </tr>)
                                            })}


                                            </tbody>
                                        </Table>

                                    </Row>
                                </Col>
                                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <h5>Asignar horarios al docente</h5>
                                            <hr/>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={teacher === "" ? {color: "#ff5252 "} : null}
                                                >Selecione Docente<small
                                                    className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                              value={teacher}
                                                              onChange={this.handleChange('teacher')}
                                                >
                                                    <option defaultValue={true} hidden>Docente</option>
                                                    {teachers.length > 0 ? teachers.map((r, k) => {

                                                        return (<option
                                                            value={r.id}
                                                            key={k}> {r.Person.name}
                                                        </option>)

                                                    }) : <option value={false} disabled>No se encontraron
                                                        datos</option>}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={typeCourse === "" ? {color: "#ff5252 "} : null}
                                                >Tipo<small className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                              value={typeCourse}
                                                              onChange={this.handleChange('typeCourse')}
                                                >
                                                    >
                                                    <option defaultValue={true} hidden>Tipo</option>
                                                    <option value={"Teoria y Practica"}> Teoria y Practica</option>
                                                    <option value={"Teoria"}> Teoria</option>
                                                    <option value={"Practica"}> Practica</option>
                                                    <option value={"Laboratorio"}> Laboratorio</option>
                                                    <option value={"Campo"}> Campo</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>


                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={ambient === "" ? {color: "#ff5252 "} : null}
                                                >Ambiente <small className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                              value={ambient}
                                                              onChange={this.handleChange('ambient')}
                                                >

                                                    <option defaultValue={true} hidden>Tipo de contrato</option>
                                                    <option value={"VIRTUAL"}> VIRTUAL</option>
                                                    <option value={"A1"}> A1</option>
                                                    <option value={"A2"}> A2</option>
                                                    <option value={"A3"}> A3</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={startTime === "" ? {color: "#ff5252 "} : null}
                                                >Hora Inicio</Form.Label>
                                                <Form.Control

                                                    onKeyPress={this.handleKeyPress}
                                                    id="number"
                                                    type="time"
                                                    value={startTime}
                                                    onChange={this.handleChange('startTime')}
                                                    placeholder="Ingrese descripción"
                                                    margin="normal"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                            style={endTime === "" ? {color: "#ff5252 "} : null}
                                                >Hora fin</Form.Label>
                                                <Form.Control
                                                    type="time"
                                                    onKeyPress={this.handleKeyPress}
                                                    id="number"
                                                    value={endTime}
                                                    onChange={this.handleChange('endTime')}
                                                    placeholder="Ingrese descripción"
                                                    margin="normal"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                            <Form.Group className="form-group fill mt-3 ">
                                                <Form.Label className="floating-label mt-n3">Dias de la
                                                    semana</Form.Label>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="lun"
                                                               onChange={() => this.toggleHandler(0)}
                                                               checked={day[0].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="lun">Lun</label>
                                                    </div>
                                                </div>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="mar"
                                                               onChange={() => this.toggleHandler(1)}
                                                               checked={day[1].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="mar">Mar</label>
                                                    </div>
                                                </div>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="mie"
                                                               onChange={() => this.toggleHandler(2)}
                                                               checked={day[2].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="mie">Mie</label>
                                                    </div>
                                                </div>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="jue"
                                                               onChange={() => this.toggleHandler(3)}
                                                               checked={day[3].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="jue">Jue</label>
                                                    </div>
                                                </div>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="vie"
                                                               onChange={() => this.toggleHandler(4)}
                                                               checked={day[4].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="vie">Vie</label>
                                                    </div>
                                                </div>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="sab"
                                                               onChange={() => this.toggleHandler(5)}
                                                               checked={day[5].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="sab">Sab</label>
                                                    </div>
                                                </div>
                                                <div className="d-inline-block mr-2">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input"
                                                               id="Dom"
                                                               onChange={() => this.toggleHandler(6)}
                                                               checked={day[6].state}
                                                        />
                                                        <label className="custom-control-label"
                                                               htmlFor="Dom">Dom</label>
                                                    </div>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>

                                            {this.state.scheduleID && <Button
                                                className="pull-right"
                                                disabled={this.state.loaderPerson}
                                                variant="primary"
                                                onClick={() => this.createHorary()}
                                            >
                                                {this.state.loaderPerson &&
                                                    <span className="spinner-border spinner-border-sm mr-1"
                                                          role="status"/>}
                                                Guardar</Button>}


                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <br/>
                                        </Col>
                                        <Table responsive size="sm">

                                            <tbody>
                                            {this.state.horarys && this.state.horarys.map((r, i) => {
                                                return (<tr key={i}>
                                                    <td>{r.Teacher.Person.name}</td>
                                                    <td>{r.type_course}</td>
                                                    <td>{r.ambient}</td>
                                                    <td>{r.start_time + ' - ' + r.end_time}</td>
                                                    <td>{r.days}</td>
                                                    <td><Delete style={{color: "#ff5252"}}
                                                                onClick={() => this.swalHorary(r.id)}
                                                    /></td>

                                                </tr>)
                                            })}


                                            </tbody>
                                        </Table>
                                    </Row>
                                </Col>
                            </Row>

                        </Card.Body>

                    </Card>
                </Row>

                }
                {this.state.formTeacher && <TeacherForm ref={(ref) => this.Profile = ref}
                                                        route={"teacher"}
                                                        closeFormTeacher={this.closeFormTeacher}

                />}
            </>


        );
    }

}

export default HoraryForm;
