import React, {Component} from 'react';
import {Button, Card, Col, Dropdown, Form, Row,} from "react-bootstrap";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

import moment from 'moment';

import crypt from "node-cryptex";


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class Workload extends Component {

    state = {

        // startTime: moment().format('l'),
        // startTime: new Date(),
        /////////STATE FORM////////////
        organicUnit: info ? info.id_organic_unit : null,
        startTime: '',
        endTime: '',
        groupClas: '',
        typeCourse: '',
        totalDay: '',
        day: [
            {day: '/Lun', state: false},
            {day: '/Mar', state: false},
            {day: '/Mie', state: false},
            {day: '/Jue', state: false},
            {day: '/Vie', state: false},
            {day: '/Sab', state: false},
            {day: '/Dom', state: false}
        ],
        ambient: '',

        newTeacher: false,
        activeTeacher: true,

        disabled: false,

        action: 'add',
        currentID: '',
        title: '',
        isVarying: false,
        typeCourses: [],
        groupClass: [],
        schedules: [],
        teachers: [],
        teacherSchedules: [],
    };

    componentDidMount() {

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

    getGroupClass() {

        const url = app.registration + '/' + app.groupClass;
        axios.get(url, app.headers).then(res => {

            if (res.data) this.setState({groupClass: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    getTypeCourse() {

        const url = app.registration + '/' + app.typeCourse;
        axios.get(url, app.headers).then(res => {

            if (res.data) this.setState({typeCourses: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    searchTeacher(params) {
        if (params === '') {
            this.setState({teachers: []})
        } else {
            const url = app.person + '/' + app.teacher + '-search/string/' + params + '/' + this.state.organicUnit;
            axios.get(url, app.headers).then(res => {
                if (res.data) this.setState({teachers: res.data})
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err)
            })
        }

    };

    // obtener los horarios segun el id de apertura
    getSchedule(id) {
        const url = app.registration + '/' + app.schedule + '/' + app.openCourse + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({schedules: res.data})
        }).catch(err => {
            // PNotify.error({
            //     title: "Oh no!",
            //     text: "Ha ocurrido un error",
            //     delay: 2000
            // });
            console.log(err)
        })
    };

    //obtener docente con sus horarios segun id openCourse
    getTeacherSchedule(id) {
        const url = app.registration + '/' + app.schedule + '/' + app.openCourse + '/teacher/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({teacherSchedules: res.data})
        }).catch(err => {
            // PNotify.error({
            //     title: "Oh no!",
            //     text: "Ha ocurrido un error",
            //     delay: 2000
            // });
            console.log(err)
        })
    };

    saveShedule() {

        const url = app.registration + '/' + app.schedule;
        const {startTime, endTime, groupClas, typeCourse, totalDay, ambient} = this.state;
        if (startTime !== '' && endTime !== '' && groupClas !== '' && typeCourse !== '' && totalDay !== '' && ambient !== '') {

            let data = new FormData();
            data.set('id_open_course', this.state.openCourse);
            data.set('id_type_course', typeCourse);
            data.set('id_group_class', groupClas);
            data.set('days', totalDay);
            data.set('ambient', ambient);
            data.set('start_time', startTime);
            data.set('end_time', endTime);

            axios.post(url, data, app.headers).then(() => {
                this.getSchedule(this.state.openCourse);
                this.handleCloseModal();
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

    updateSchedule() {

        const url = app.accounting + '/' + app.cashBoxFlow + '/' + this.state.currentID;
        const {denomination, vaucherCode, stateEntry, amount, startTime, concept, observation} = this.state;
        if (vaucherCode !== '' && stateEntry !== '' && amount !== '' && startTime !== '' && concept !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('voucher', vaucherCode);
            data.set('state', stateEntry);
            data.set('amount', amount);
            data.set('date', moment(startTime).format('YYYY-MM-DD h:mm:ss'));
            data.set('id_groupClass', concept);
            data.set('observation', observation);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.closeModal();
                this.props.getCashBoxFlow();

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

    //registrar docente en el horario
    updateTeacherSchedule(idOpenCourse) {
        const url = app.registration + '/' + app.schedule + '/' + idOpenCourse;
        const {dataTeacher} = this.state;
        if (dataTeacher) {
            let data = new FormData();
            data.set('id_teacher', dataTeacher.id);

            axios.patch(url, data, app.headers).then(() => {
                this.setState({
                    newTeacher: false,
                    // activeTeacher: '',
                    // dataTeacher: [],
                })
                this.getSchedule(this.state.openCourse);
                this.getTeacherSchedule(this.state.openCourse);
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
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

    updateTeacherPrincipal(idOpenCourse, idTeacher) {
        const url = app.registration + '/' + app.schedule + '/teacher-principal/' + idOpenCourse;

        if (idOpenCourse) {
            let data = new FormData();
            data.set('id_teacher', idTeacher);

            axios.patch(url, data, app.headers).then(() => {
                this.setState({
                    newTeacher: false,
                    // activeTeacher: '',
                    // dataTeacher: [],
                })
                // this.getSchedule(this.state.openCourse);
                this.getTeacherSchedule(this.state.openCourse);
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
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

    // eliminar horario del docente
    deleteTeacherSchedule(idOpenCourse) {
        const url = app.registration + '/' + app.schedule + '/delete/' + idOpenCourse;

        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });

            this.getSchedule(this.state.openCourse);
            this.getTeacherSchedule(this.state.openCourse);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //eliminar horario
    deleteSchedule(id) {
        const url = app.registration + '/' + app.schedule + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getSchedule(this.state.openCourse);
            this.getTeacherSchedule(this.state.openCourse);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //Operation Functions
    closeFormTeacher = () => {
        this.setState({
            newTeacher: false,
            activeTeacher: '',
            dataTeacher: [],
        })
    };
    activeTeacher = (dataTeacher, i) => {

        console.log(dataTeacher)
        this.setState({

            dataTeacher: dataTeacher
        })
    };
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.action === 'add') {
                this.savegroupClass();
            } else {
                this.updategroupClass();
            }

        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'startTime':
                this.setState({startTime: event.target.value});
                break;
            case 'endTime':
                this.setState({endTime: event.target.value});
                break;
            case 'groupClas':
                this.setState({
                    groupClas: event.target.value
                });
                break;
            case 'typeCourse':
                this.setState({typeCourse: event.target.value});
                break;
            case 'ambient':
                this.setState({ambient: event.target.value});
                break;
            case 'day':
                this.setState({day: event.target.value});
                break;

            case 'teacher':
                this.searchTeacher(event.target.value)
                this.setState({teacher: event.target.value});
                break;


            default:
                break;
        }
    };
    selecTeacher = (dataTeacher) => {
        console.log(dataTeacher)
        this.setState({
            newTeacher: true,
            teachers: [],
            teacher: '',
            /////////////
            dataTeacher: dataTeacher,
            activeTeacher: true,
        })
    };
    toggleHandler = (d) => {
        var array = this.state.day;
        var totalDay = '';
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


    handleOpenModal = (course) => {
        // console.log(course)
        this.getGroupClass();
        this.getTypeCourse();
        this.getSchedule(course.Open_course.id);
        this.getTeacherSchedule(course.Open_course.id);
        this.setState({
            titleModal: course.denomination,
            openCourse: course.Open_course.id,
            isVarying: true,
            action: 'add',
            denomination: ''
        });

    };
    handleCloseModal = () => {
        this.setState({
            day: [
                {day: '/Lun', state: false},
                {day: '/Mar', state: false},
                {day: '/Mie', state: false},
                {day: '/Jue', state: false},
                {day: '/Vie', state: false},
                {day: '/Sab', state: false},
                {day: '/Dom', state: false}
            ],
            action: 'add',

            currentID: '',
            startTime: '',
            endTime: '',
            groupClas: '',
            typeCourse: '',
            totalDay: '',

            ambient: '',

        })

    };

    handleOpenSweetAlertWarning = (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            customClass: {
                container: 'my-swal'
            }
        }).then((result) => {
            if (result.value) {
                this.deletegroupClass(id);
            }
        })
    };


    render() {
        //state frontend
        const {
            isVarying,
            groupClas,
            typeCourse,
            startTime,
            endTime,
            ambient,
            day,
            teacher,
            newTeacher,
            dataTeacher,
            teacherSchedules
        } = this.state;

        const {groupClass, typeCourses, schedules, teachers} = this.state;

        const {titleModal, action, disabled} = this.state;
        const fullScreenStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: this.props.windowWidth,
            // overflowY: 'auto',
            height: '100%'
        };
        const scrollable = {
            overflowY: 'auto',
            maxHeight: ' 900px',
        };
        return (
            <>
                {isVarying &&
                    <Row className='btn-page'>
                        <Card className="full-card" style={fullScreenStyle}>
                            <Card.Header style={{background: '#4680ff'}}>
                                <Card.Title as='h5' style={{color: 'white', fontSize: '20px'}}>{titleModal}</Card.Title>
                                <div className="d-inline-block pull-right">

                                    <div className="card-header-right">

                                        <Dropdown alignRight={true} className="pull-right mt-2">
                                            <Dropdown.Toggle className="btn-icon" style={{
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: 'white',


                                            }}>
                                                <i
                                                    onClick={() => this.setState({isVarying: false})}
                                                    className="material-icons pull-right "
                                                >close</i>
                                            </Dropdown.Toggle>

                                        </Dropdown>
                                    </div>


                                </div>
                            </Card.Header>
                            <Card.Body style={scrollable}>
                                <Row>
                                    <Col xl={3}>
                                        <Card className="border mb-15 shadow-none">
                                            <Card.Body>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                                        <h5 className="mb-0">Registrar Horario </h5>
                                                        <hr/>
                                                    </Col>
                                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Label className="floating-label">Hora
                                                                Inicio</Form.Label>
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
                                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Label className="floating-label">Hora fin</Form.Label>
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
                                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Label className="floating-label">Grupo</Form.Label>
                                                            <Form.Control as="select"
                                                                          value={groupClas}
                                                                          onChange={this.handleChange('groupClas')}>
                                                                >
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    una Mención</option>
                                                                {
                                                                    groupClass.length > 0 ?
                                                                        groupClass.map((r, index) => {
                                                                            // if (bank.state) {
                                                                            return (
                                                                                <option value={r.id} key={index}>
                                                                                    {r.denomination}
                                                                                </option>
                                                                            )
                                                                            // }
                                                                        }) :
                                                                        <option defaultValue={true}>Error al cargar los
                                                                            Datos</option>
                                                                }
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Label className="floating-label">Tipo</Form.Label>
                                                            <Form.Control as="select"
                                                                          value={typeCourse}
                                                                          onChange={this.handleChange('typeCourse')}>
                                                                >
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    una Mención</option>
                                                                {
                                                                    typeCourses.length > 0 ?
                                                                        typeCourses.map((r, index) => {
                                                                            // if (bank.state) {
                                                                            return (
                                                                                <option value={r.id} key={index}>
                                                                                    {r.denomination}
                                                                                </option>
                                                                            )
                                                                            // }
                                                                        }) :
                                                                        <option defaultValue={true}>Error al cargar los
                                                                            Datos</option>
                                                                }
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Label className="floating-label">Aula</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                onKeyPress={this.handleKeyPress}
                                                                id="number"
                                                                value={ambient}
                                                                onChange={this.handleChange('ambient')}
                                                                placeholder="Ingrese descripción"
                                                                margin="normal"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill mt-3 ">
                                                            <Form.Label className="floating-label mt-n3">Dias de la
                                                                semana</Form.Label>
                                                            <div className="d-inline-block mr-2">
                                                                <div className="custom-control custom-checkbox">
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
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
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
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
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
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
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
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
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
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
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
                                                                           id="sab"
                                                                           onChange={() => this.toggleHandler(5)}
                                                                           checked={day[5].state}
                                                                    />
                                                                    <label className="custom-control-label"
                                                                           htmlFor="sab">Sab</label>
                                                                </div>
                                                            </div>
                                                            {/*<div className="d-inline-block ml-2">*/}
                                                            {/*    <div className="custom-control custom-checkbox">*/}
                                                            {/*        <input type="checkbox" className="custom-control-input"*/}
                                                            {/*               id="customCheck2"/>*/}
                                                            {/*        <label className="custom-control-label"*/}
                                                            {/*               htmlFor="customCheck2">Dom</label>*/}
                                                            {/*    </div>*/}
                                                            {/*</div>*/}
                                                        </Form.Group>

                                                        {/*<div className="form-group mt-3">*/}
                                                        {/*    <label htmlFor="example-textarea">Quick Order Notes:</label>*/}
                                                        {/*    <textarea className="form-control" id="example-textarea" rows="3" placeholder="Write some note.."/>*/}
                                                        {/*</div>*/}
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        {action === 'add' ?
                                                            <Button
                                                                className="pull-right"
                                                                disabled={disabled}
                                                                variant="primary"
                                                                onClick={() => this.saveShedule()}
                                                            >
                                                                {disabled &&
                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-1"
                                                                        role="status"/>}
                                                                Guardar</Button> :
                                                            <Button
                                                                className="pull-right"
                                                                disabled={disabled}
                                                                variant="primary"
                                                            >
                                                                {disabled &&
                                                                    <span
                                                                        className="spinner-border spinner-border-sm mr-1"
                                                                        role="status"/>}
                                                                Guardar Cambios</Button>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        <Card className="border mb-15 shadow-none">
                                            <Card.Body>

                                                <h5 className="mb-0">Docentes</h5>
                                                <hr/>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                                        <Form.Group className="form-group fill">
                                                            <Form.Label
                                                                className="floating-label">Buscar</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                onKeyPress={this.handleKeyPress}
                                                                id="number"
                                                                value={teacher}
                                                                onChange={this.handleChange('teacher')}
                                                                placeholder="Ingrese descripción"
                                                                margin="normal"
                                                            />
                                                            <div className=" table-responsive"
                                                                 style={{
                                                                     position: 'absolute',
                                                                     zIndex: '223123',
                                                                     backgroundColor: 'white'
                                                                 }}
                                                            >

                                                                <table className="table table-bordered table-hover">
                                                                    <tbody style={{
                                                                        overflowY: 'auto',
                                                                        maxHeight: '450px',
                                                                        display: 'block',
                                                                        width: '100%'
                                                                    }}>
                                                                    {teachers.length > 0 &&
                                                                        teachers.map((r, i) => {
                                                                            return (
                                                                                <tr key={i}
                                                                                    onClick={() => this.selecTeacher(r)}
                                                                                >
                                                                                    <td className="order-subtotal"
                                                                                        style={{padding: '5px'}}
                                                                                    ><span>{r.name}</span>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }


                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        </Form.Group>

                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xl={9}>
                                        <Row>

                                            <Col xl={12}>
                                                <Card className="border mb-15 shadow-none">
                                                    <Card.Body>

                                                        <h5 className="mb-0">Horarios Actuales</h5>
                                                        <hr/>
                                                        <Col md={12}>
                                                            <Row>
                                                                {schedules.length > 0 ?
                                                                    schedules.map((r, i) => {
                                                                        return (

                                                                            <div className="d-inline-block align-middle
                                                                                        col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                        <span
                                                                            className="align-top m-r-15 mr-1 badge"
                                                                            style={{
                                                                                backgroundColor: '#20c997',
                                                                                color: '#ff5252',
                                                                                fontSize: '1',
                                                                                padding: '0px 5px 30px 0px'
                                                                            }}>.
                                                                                      </span>
                                                                                <div className="d-inline-block">
                                                                                    <h6>{r.Type_course.denomination + ' - ' + r.ambient}</h6>
                                                                                    <p className="m-b-0">{r.days} </p>
                                                                                </div>
                                                                                <div
                                                                                    className="d-inline-block pull-right">
                                                                                    <h6>{r.Group_class.denomination}
                                                                                        {r.id_teacher === null &&
                                                                                            <>
                                                                                                <Dropdown
                                                                                                    onClick={() => this.deleteSchedule(r.id)}
                                                                                                    alignRight={true}
                                                                                                    className="pull-right mr-n3 mt-n1">
                                                                                                    <Dropdown.Toggle
                                                                                                        className="btn-icon"
                                                                                                        style={{
                                                                                                            border: 'none',
                                                                                                            background: 'none',
                                                                                                            outline: 'none',
                                                                                                            color: '#ffffff00',
                                                                                                            height: '5px'

                                                                                                        }}>
                                                                                                        <i

                                                                                                            className="material-icons pull-right mr-n3 mt-n1"
                                                                                                            style={{color: '#ff5252'}}>delete</i>
                                                                                                    </Dropdown.Toggle>

                                                                                                </Dropdown>

                                                                                                <Dropdown
                                                                                                    onClick={() => this.updateTeacherSchedule(r.id)}
                                                                                                    alignRight={true}
                                                                                                    className="pull-right mr-n3 mt-n1">
                                                                                                    <Dropdown.Toggle
                                                                                                        className="btn-icon"
                                                                                                        style={{
                                                                                                            border: 'none',
                                                                                                            background: 'none',
                                                                                                            outline: 'none',
                                                                                                            color: '#ffffff00',
                                                                                                            height: '5px'

                                                                                                        }}>
                                                                                                        <i

                                                                                                            className="material-icons pull-right mr-n3 mt-n1"
                                                                                                            style={{color: '#4680ff'}}>assignment_returned</i>
                                                                                                    </Dropdown.Toggle>

                                                                                                </Dropdown>

                                                                                            </>
                                                                                        }
                                                                                    </h6>
                                                                                    <p className="m-b-0 pull-right">
                                                                                        {r.start_time + ' -' + r.end_time}
                                                                                    </p>

                                                                                </div>
                                                                                <hr/>
                                                                            </div>

                                                                        )

                                                                    })


                                                                    :
                                                                    <p></p>
                                                                }
                                                            </Row>
                                                        </Col>

                                                    </Card.Body>
                                                </Card>


                                                {newTeacher &&
                                                    <Card className="border mb-15 shadow-none">
                                                        <Card.Body>
                                                            <Row>
                                                                <div
                                                                    className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                    <div className="d-inline-block">
                                                                        <h5>{dataTeacher.name}</h5>

                                                                        <p className="m-b-0">{dataTeacher.document_number} </p>
                                                                    </div>
                                                                    <div
                                                                        className="d-inline-block pull-right">

                                                                        <Dropdown
                                                                            alignRight={true}
                                                                            onClick={() => this.closeFormTeacher()}
                                                                            className="pull-right mr-n3 mt-n1">

                                                                            <Dropdown.Toggle
                                                                                className="btn-icon"
                                                                                style={{
                                                                                    border: 'none',
                                                                                    background: 'none',
                                                                                    outline: 'none',
                                                                                    color: '#ffffff00',
                                                                                    height: '5px'

                                                                                }}>
                                                                                <i
                                                                                    className="material-icons pull-right mr-n3 mt-n1"
                                                                                    style={{color: '#ff5252'}}>close</i>
                                                                            </Dropdown.Toggle>

                                                                        </Dropdown>

                                                                    </div>

                                                                    <hr/>
                                                                </div>


                                                            </Row>
                                                        </Card.Body>
                                                    </Card>

                                                }

                                                {teacherSchedules.length > 0 ?
                                                    teacherSchedules.map((r, i) => {
                                                        return (
                                                            <Card className="border mb-15 shadow-none" key={i}>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <div
                                                                            className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                            <div className="d-inline-block"
                                                                                 onClick={() => this.activeTeacher(r, i)}
                                                                            >
                                                                                <h5>{r.name}</h5>

                                                                                <p className="m-b-0">{r.document_number} </p>
                                                                            </div>
                                                                            <div
                                                                                className="d-inline-block pull-right">
                                                                                <Dropdown
                                                                                    alignRight={true}
                                                                                    className="pull-right mr-n3 mt-n1">
                                                                                    <Dropdown.Toggle
                                                                                        className="btn-icon"
                                                                                        style={{
                                                                                            border: 'none',
                                                                                            background: 'none',
                                                                                            outline: 'none',
                                                                                            color: '#ffffff00',
                                                                                            height: '5px'

                                                                                        }}>
                                                                                        {r.Open_course ?
                                                                                            <i
                                                                                                onClick={() => this.updateTeacherPrincipal(r.Open_course.id, null)}
                                                                                                className="material-icons pull-right mr-n3 mt-n1"
                                                                                                style={{color: '#4680ff'}}>radio_button_checked</i>
                                                                                            :
                                                                                            <i
                                                                                                onClick={() => this.updateTeacherPrincipal(r.Schedule[0].id_open_course, r.id)}
                                                                                                className="material-icons pull-right mr-n3 mt-n1"
                                                                                                style={{color: '#4680ff'}}>radio_button_unchecked</i>
                                                                                        }

                                                                                    </Dropdown.Toggle>

                                                                                </Dropdown>
                                                                            </div>

                                                                            <hr/>
                                                                            {r.Schedule.length > 0 ?
                                                                                r.Schedule.map((r, i) => {
                                                                                    return (

                                                                                        <div className="d-inline-block align-middle
                                                                                        col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                        <span
                                                                            className="align-top m-r-15 mr-1 badge"
                                                                            style={{
                                                                                backgroundColor: '#4680ff',
                                                                                color: '#ff5252',
                                                                                fontSize: '1',
                                                                                padding: '0px 5px 30px 0px'
                                                                            }}>.
                                                                                      </span>
                                                                                            <div
                                                                                                className="d-inline-block">
                                                                                                <h6>{r.Type_course.denomination + ' - ' + r.ambient}</h6>
                                                                                                <p className="m-b-0">{r.days} </p>
                                                                                            </div>
                                                                                            <div
                                                                                                className="d-inline-block pull-right">
                                                                                                <h6>{r.Group_class.denomination}
                                                                                                    <Dropdown
                                                                                                        onClick={() => this.deleteTeacherSchedule(r.id)}
                                                                                                        alignRight={true}
                                                                                                        className="pull-right mr-n3 mt-n1">
                                                                                                        <Dropdown.Toggle
                                                                                                            className="btn-icon"
                                                                                                            style={{
                                                                                                                border: 'none',
                                                                                                                background: 'none',
                                                                                                                outline: 'none',
                                                                                                                color: '#ffffff00',
                                                                                                                height: '5px'

                                                                                                            }}>
                                                                                                            <i

                                                                                                                className="material-icons pull-right mr-n3 mt-n1"
                                                                                                                style={{color: '#ff5252'}}>close</i>
                                                                                                        </Dropdown.Toggle>

                                                                                                    </Dropdown>


                                                                                                </h6>
                                                                                                <p className="m-b-0 pull-right">
                                                                                                    {r.start_time + ' -' + r.end_time}
                                                                                                </p>

                                                                                            </div>
                                                                                            <hr/>
                                                                                        </div>

                                                                                    )

                                                                                })

                                                                                :
                                                                                <p></p>
                                                                            }
                                                                        </div>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        )
                                                    })
                                                    :
                                                    ''
                                                }


                                            </Col>

                                        </Row>
                                    </Col>


                                </Row>
                            </Card.Body>

                        </Card>
                    </Row>

                }
            </>
        )
    }
}
