import React, {Component} from 'react';
import {Button, Card, Col, Dropdown, Form, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import Workload from './Workload';

import crypt from 'node-cryptex';
import app from "../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';

import $ from 'jquery';

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class OpenCourse extends Component {
    state = {
        isVaryingConcepts: false,
        organicUnit: this.props.location && this.props.location.state && this.props.location.state.organicUnit
            ? this.props.location.state.organicUnit
            : info.role ? info.role.id_organic_unit : null,
        defaultSwitch: false,
        academicSemester: "",
        academicSemesterMask: '',
        program: '',
        mention: '',
        programMask: '',
        mentionMask: '',

        programs: [],
        mentions: [],
        semesterCourses: [],
        academicCalendars: "",
        academicSemesters: [],
        action: 'add',
        switchingOpenCourses: {},

        loaderDatailModal: false,
        modalDetail: false,
        actionModalDetail: 'add',


    };

    componentDidMount() {
        if (this.state.organicUnit) {
            this.getProgram(this.state.organicUnit);
        }
        this.getActualSemester();
        this.getAcademicSemesters();
    };

    // obtiene el semestre actual
    getActualSemester() {
        const url = app.general + '/' + app.academicCalendar + '/' + app.openCourse;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({
                    academicCalendars: res.data,
                    academicSemester: res.data.Academic_semester.id,
                    academicSemesterMask: res.data.denomination + ' / ' + res.data.Academic_semester.denomination
                })
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al cargar calendario",
                delay: 2000
            });
            console.log(err);
        })
    };

    // obtiene los programas por id de unidad_organica
    getProgram(id) {
        if (!id) {
            PNotify.notice({
                title: "Advertencia!",
                text: "Seleccione una unidad organica para listar programas",
                delay: 2000
            });
            return;
        }

        const url = app.programs + '/' + app.program + '/s-' + app.organicUnit + '-register/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({programs: res.data});
            }
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    // obtiene los planes de estudio del programa
    getMention(id) {
        const url = app.programs + '/' + app.program + '/' + id + '/' + app.studyPlan;
        axios.get(url, app.headers).then(res => {
            if (res.data && res.data.Plans) {
                const actualPlan = res.data.Plans.find(plan => plan.valid) || res.data.Plans[0];
                this.setState({
                    mentions: res.data.Plans,
                    mention: actualPlan ? actualPlan.id : '',
                    mentionMask: actualPlan ? actualPlan.description : '',
                    semesterCourses: []
                });

                if (actualPlan) {
                    this.getMentionSemesterCourse(actualPlan.id);
                }
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error al cargar los planes de estudio",
                delay: 2000
            });
            console.log(err)
        })
    };

    getAcademicSemesters() {
        const url = app.general + '/' + app.academicSemester + '/' + app.academicCalendar + '/all';
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({academicSemesters: res.data});
        }).catch(err => console.log(err));
    };

    // obtiene los ciclos y cursos del plan de estudios
    getMentionSemesterCourse(idPlan) {
        const url = app.programs + '/' + app.cycle + '/' + app.course + '/' + app.plan + '/' + idPlan;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                const {program, academicSemester} = this.state;
                if (!program || !academicSemester) {
                    this.setState({semesterCourses: res.data});
                    return;
                }

                const scheduleUrl = app.registration + '/' + app.schedule + '-' + app.course + '/' + program + '/' + academicSemester;
                axios.get(scheduleUrl, app.headers).then(scheduleRes => {
                    const schedules = scheduleRes.data || [];
                    const semesterCourses = res.data.map(cycle => ({
                        ...cycle,
                        Course: cycle.Course.map(course => {
                            const schedule = schedules.find(item => item.id_course === course.id || (item.Course && item.Course.id === course.id));
                            return {
                                ...course,
                                Schedule: schedule || null,
                                Open_course: schedule || null,
                            };
                        })
                    }));
                    this.setState({semesterCourses});
                }).catch(() => {
                    this.setState({semesterCourses: res.data});
                });
            }else{

            }
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //CAMBIA EL ESTASDO DE APERTURA
    async toogleOpenCourse(idOpenCourse) {
        const url = app.registration + '/' + app.openCourse + '/' + idOpenCourse;
        let data = new FormData();
        return axios.patch(url, data, app.headers).then(() => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro actualizado correctamente",
                delay: 2000
            });
            this.getMentionSemesterCourse(this.state.mention);

        }).catch(() => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        });
    };

    //REGISTRA LA APERTURA
    async saveOpenCourse(idCourse) {
        const url = app.registration + '/' + app.openCourse;
        const {program, academicSemester} = this.state;
        if (program !== '' && academicSemester !== '') {

            let data = new FormData();
            data.set('id_course', idCourse);
            data.set('id_semester', academicSemester);
            data.set('id_program', program);
            return axios.post(url, data, app.headers).then(() => {
                this.getMentionSemesterCourse(this.state.mention);
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }

    };

    setSwitchingOpenCourse = (key, state) => {
        this.setState(prevState => ({
            switchingOpenCourses: {
                ...prevState.switchingOpenCourses,
                [key]: state
            }
        }));
    };

    handleOpenCourseSwitch = async (course, switchId) => {
        if (this.state.switchingOpenCourses[switchId]) return;

        this.setSwitchingOpenCourse(switchId, true);
        try {
            if (course.Open_course) {
                await this.toogleOpenCourse(course.Open_course.id);
            } else {
                await this.saveOpenCourse(course.id);
            }
        } finally {
            this.setSwitchingOpenCourse(switchId, false);
        }
    };


    // FRONT FUNCTIONS
    handleChange = field => event => {
        switch (field) {
            case 'program':
                // var masks = event.target.childNodes[event.target.value].getAttribute('data-name') || '';
                if (event.target.value !== 'false') {


                    let masks = $('#program-' + event.target.value).attr('data-program');
                    this.setState({program: event.target.value, programMask: masks, mention: '', mentionMask: '', mentions: [], semesterCourses: []});
                    this.getMention(event.target.value);

                }


                break;
            case 'mention':
                // var mask = event.target.childNodes[event.target.value].getAttribute('data-name') || '';
                if (event.target.value !== 'false') {
                    let mask = $('#mention-' + event.target.value).attr('data-mention');
                    this.setState({mention: event.target.value, mentionMask: mask});
                    this.getMentionSemesterCourse(event.target.value);

                }


                break;
            case 'academicSemester': {
                const selected = this.state.academicSemesters.find(item => String(item.id) === String(event.target.value));
                this.setState({
                    academicSemester: event.target.value,
                    academicSemesterMask: selected
                        ? selected.Academic_calendar.denomination + ' / ' + selected.denomination
                        : ''
                }, () => {
                    if (this.state.mention) this.getMentionSemesterCourse(this.state.mention);
                });
                break;
            }
            case 'province':
                this.setState({province: event.target.value, district: ''});
                this.getDistrict(event.target.value);
                break;
            case 'district':
                this.setState({district: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;
            case 'cashBox':
                this.getInitialBalance(event.target.value);
                // this.getCashBoxFlow(event.target.value);
                this.setState({cashBox: event.target.value});

                break;
            case 'initialBalance':
                this.setState({
                    initialBalance: event.target.value.substr(4).replace(",", ""),
                    initialBalanceMask: event.target.value
                });

                break;

            default:
                break;
        }
    };
    //CAMBIA EL ESTADO
    validateState = state => {
        if (state) {
            return typeof state.state === 'boolean' ? state.state : true;
        } else {
            return false;
        }
    };


    handleKeyPress = (e) => {
        // alert(this.state.actionInitialBalance)
        if (e.key === 'Enter') {
            this.state.actionInitialBalance === 'add' ?
                this.saveInitialBalance() : this.updateInitialBalance()
        }
    };

    handleCloseModal = () => {
        this.setState({
            // isVaryingCampus: false,
            actionInitialBalance: 'add',

        })
    };


    render() {
        const {
            organicUnit,
        } = this.state;

        const {program, mention, programMask, mentionMask} = this.state;
        const {programs, mentions, semesterCourses, academicCalendars, academicSemesters, academicSemester, academicSemesterMask} = this.state;

        return (
            <>

                        <Row>
                            <Col xl={3}>
                                <Card>
                                    <Card.Header className="bg-facebook order-card">
                                        <h4 className="text-white" >{academicSemesterMask || (academicCalendars.Academic_semester ? academicCalendars.Academic_semester.denomination : "")}</h4>
                                        <p className="m-b-0">Apertura de cursos</p>
                                        <i className="feather icon-clock card-icon"/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <div
                                                className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">



                                                 <Row>
                                                     <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                         <Form.Group className="form-group fill">
                                                             <Form.Control as="select"
                                                                           style={{fontSize: '15px'}}
                                                                           value={academicSemester}
                                                                           onChange={this.handleChange('academicSemester')}>
                                                                 <option value="" hidden>Seleccione el período</option>
                                                                 {academicSemesters.map(semester => (
                                                                     <option value={semester.id} key={semester.id}>
                                                                         {semester.Academic_calendar.denomination + ' / ' + semester.denomination}
                                                                     </option>
                                                                 ))}
                                                             </Form.Control>
                                                         </Form.Group>
                                                     </Col>
                                                     <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill">

                                                            <Form.Control as="select"
                                                                          style={{fontSize: '15px'}}
                                                                          value={program}
                                                                          onChange={this.handleChange('program')}>
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    un Programa</option>
                                                                {
                                                                    programs.length > 0 ?
                                                                        programs.map((program, index) => {
                                                                            return (
                                                                                <option id={'program-' + program.id} value={program.id} data-program={program.denomination}
                                                                                        key={index}>
                                                                                    {program.denomination}
                                                                                </option>
                                                                            )
                                                                        }) :
                                                                        <option value={false}>No se encontraron datos</option>
                                                                }
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Control as="select"
                                                                          style={{fontSize: '16px'}}
                                                                          value={mention}
                                                                          onChange={this.handleChange('mention')}>
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    un Plan de estudios</option>
                                                                {
                                                                    mentions.length > 0 ?
                                                                        mentions.map((mention, index) => {
                                                                            return (
                                                                                <option id={'mention-' + mention.id} value={mention.id} data-mention={mention.description}
                                                                                        key={index}>
                                                                                    {mention.description}
                                                                                </option>
                                                                            )
                                                                        }) :
                                                                        <option value={false}>No se encontraron datos</option>
                                                                }
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>

                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={6}>
                                <Card>
                                    <Card.Body>
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                {
                                                    (program !== '') && (mention !== '') ?
                                                        <h5>PROGRAMA
                                                            DE {programMask + (mentionMask ? ' / PLAN ' + mentionMask : '')} </h5>
                                                        : <h5>PROGRAMA DE ESTUDIOS</h5>
                                                }

                                                <p className="m-b-0">Aperture cursos, Registre horarios y grupos,
                                                    Aisigne Docentes al curso</p>

                                            </div>
                                        </div>



                                    </Card.Body>
                                </Card>
                                <Row>
                                    {semesterCourses.length > 0 ?
                                        semesterCourses.map((r, index) => {

                                            return (
                                                <Col key={index} md={12} className='mt-n2'>
                                                    <Card className='card-border-c-blue'>
                                                        <Card.Header className='h-40' style={{height: '40px'}}>

                                                            <h6 className="mt-n2">CICLO {r.ciclo || r.semester}</h6>

                                                        </Card.Header>
                                                        <Card.Body className='card-task'>
                                                            <Row>
                                                                {
                                                                    r.Course.length > 0 ?
                                                                        r.Course.map((k, i) => {
                                                                            const switchId = 'open-course-' + (r.id || r.ciclo || index) + '-' + k.id;
                                                                            return (
                                                                                <Col key={i} md={12}>
                                                                                    <div
                                                                                        className="d-inline-block align-middle">
                                                                                        <div className="d-inline-block">
                                                                                            <Card.Text
                                                                                                className='task-detail'>{k.denomination}</Card.Text>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="pull-right">
                                                                                        <OverlayTrigger
                                                                                            overlay={
                                                                                                <Tooltip>Acciones</Tooltip>}>
                                                                                            <Dropdown alignRight={true}
                                                                                                      className="pull-right mr-n4 mt-n1">
                                                                                                <Dropdown.Toggle
                                                                                                    className="btn-icon"
                                                                                                    style={{
                                                                                                        border: 'none',
                                                                                                        background: 'none',
                                                                                                        outline: 'none',
                                                                                                        color: 'white',
                                                                                                        height: '5px'

                                                                                                    }}>
                                                                                                    <i
                                                                                                        className="material-icons pull-right mr-n2 mt-n1"
                                                                                                        style={{color: '#6c757d'}}>more_vert</i>
                                                                                                </Dropdown.Toggle>
                                                                                                <Dropdown.Menu as='ul'
                                                                                                               className="list-unstyled card-option">
                                                                                                    <Dropdown.Item
                                                                                                        as='li'
                                                                                                        onClick={() => this.Workload.handleOpenModal(k)}
                                                                                                        className="dropdown-item">

                                                                                     <span type="button">
                                                                                         <i
                                                                                             className={'feather icon-clock'}/> Carga horaria
                                                                                         </span>
                                                                                                    </Dropdown.Item>


                                                                                                </Dropdown.Menu>
                                                                                            </Dropdown>
                                                                                        </OverlayTrigger>


                                                                                        <Form.Group
                                                                                            className="pull-right mr-n1 mt-n2">
                                                                                            <div className="switch switch-success d-inline m-r-10">

                                                                                                <Form.Control
                                                                                                    type="checkbox"
                                                                                                     id={switchId}
                                                                                                     onChange={() => this.handleOpenCourseSwitch(k, switchId)}
                                                                                                     disabled={this.state.switchingOpenCourses[switchId]}
                                                                                                     checked={this.validateState(k.Open_course)}
                                                                                                     value={this.validateState(k.Open_course)}

                                                                                                 />
                                                                                                 <Form.Label
                                                                                                     htmlFor={switchId}
                                                                                                     className="cr"/>
                                                                                            </div>

                                                                                        </Form.Group>

                                                                                    </div>
                                                                                    <hr className="mt-3 mb-1"/>


                                                                                </Col>)
                                                                        })
                                                                        :
                                                                        <Col md={12}>
                                                                            No hay cursos registrados
                                                                        </Col>


                                                                }


                                                            </Row>


                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )

                                        })


                                        :
                                        <Col md={12}>
                                            ''
                                        </Col>
                                    }


                                </Row>
                            </Col>
                        </Row>

                        <Workload
                            ref={(ref) => this.Workload = ref}
                        />





            </>
        )
    }
}
