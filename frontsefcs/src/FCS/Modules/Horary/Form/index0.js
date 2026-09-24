import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";
import defaultUser from "../../../../assets/images/user/default.jpg";
import crypt from "node-cryptex";

moment.locale('es');


class HoraryForm extends React.Component {
    state = {
        action: 'add',
        day: [
            {day: '/Lun', state: false},
            {day: '/Mar', state: false},
            {day: '/Mie', state: false},
            {day: '/Jue', state: false},
            {day: '/Vie', state: false},
            {day: '/Sab', state: false},
            {day: '/Dom', state: false}
        ],
        course: '',
        typeCourse: '',
        group: '',
        ambient: '',
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        teacher: '',
        scheduleID: '',
        contractType: '',
        charge: '',
        charges: [],
        contractTypes: [],
        courses: [],
        teachers: []


    };

    async componentDidMount() {

        this.getCharges();
        this.getContractTypes();
    };

    componentDidUpdate(prevProps, prevState) {


        if (prevProps.form !== this.props.form) {
            this.setState({form: this.props.form});
        }

        if (prevProps.retriveData !== this.props.retriveData) {
            this.props.retriveData !== '' && this.retriveData(this.props.retriveData)
        }


    }

    getCharges() {
        const url = app.general + '/' + app.charge;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({charge: res.data[3].id})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener cargos",
                delay: 2000
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
                title: "Oh no!",
                text: "Error al obtener tipos de contrato",
                delay: 2000
            });
            console.log(err)
        })
    };

    searchCourse(program, params) {
        if (params === '') {
            this.setState({persons: []})
        } else {
            const url = app.programs + '/search-' + app.course + '/' + params;
            let data = new FormData();
            data.set('id_program', program)
            axios.patch(url, data, app.headers).then(res => {
                if (res.data) this.setState({courses: res.data})
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

    searchPerson(params) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/search-person' + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
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

        }

    };

    async createHorary() {
        this.setState({loaderHorary: true});
        const {organicUnit, program, process} = this.props;
        const {
            teacherID,
            courseID,
            typeCourse,
            group,
            day,
            ambient,
            startDate,
            endDate,
            startTime,
            endTime,
            contractType,
            charge

        } = this.state;
        let tempDay = '';
        for (let i = 0; i < day.length; i++) {
            if (day[i].state) {
                tempDay = tempDay + day[i].day
            }

        }
        if (teacherID !== "" && courseID !== "" && typeCourse !== "" && group !== "" && tempDay !== "" && contractType !== "" && charge !== "" && program !== "" && process !== "" &&
            ambient !== "" && startDate !== "" && endDate !== "" && startTime !== "" && endTime !== "" && organicUnit !== ""
        ) {
            const url = app.registration + '/' + app.schedule;
            let data = new FormData();
            data.set("id_teacher", teacherID);
            data.set("id_course", courseID);
            data.set("id_organic_unit", organicUnit);
            data.set("id_process", process);
            data.set("id_program", program);
            data.set("type_course", typeCourse);
            data.set("group_class", group);
            data.set("day", tempDay);
            data.set("ambient", ambient);
            data.set("start_date", startDate);
            data.set("end_date", endDate);
            data.set("start_time", startTime);
            data.set("end_time", endTime);
            data.set("id_contract_type", contractType);
            data.set("id_charge", charge);


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

    async updateHorary() {
        this.setState({loaderHorary: true});
        const {organicUnit, program, process} = this.props;
        const {
            teacherID,
            courseID,
            typeCourse,
            group,
            day,
            ambient,
            startDate,
            endDate,
            startTime,
            endTime,
            contractType,
            charge,
            scheduleID
        } = this.state;
        let tempDay = '';
        for (let i = 0; i < day.length; i++) {
            if (day[i].state) {
                tempDay = tempDay + day[i].day
            }
        }
        if (teacherID !== "" && courseID !== "" && typeCourse !== "" && group !== "" && tempDay !== "" && contractType !== "" && charge !== "" &&
            ambient !== "" && startDate !== "" && endDate !== "" && startTime !== "" && endTime !== ""
        ) {
            const url = app.registration + '/' + app.schedule + '/' + scheduleID;
            let data = new FormData();
            data.set("id_teacher", teacherID);
            data.set("id_course", courseID);
            data.set("type_course", typeCourse);
            data.set("group_class", group);
            data.set("day", tempDay);
            data.set("ambient", ambient);
            data.set("start_date", startDate);
            data.set("end_date", endDate);
            data.set("start_time", startTime);
            data.set("end_time", endTime);
            data.set("id_contract_type", contractType);
            data.set("id_charge", charge);

            data.set("id_organict_unit", organicUnit);
            data.set("id_program", program);
            data.set("id_process", process);


            try {
                const res = await axios.patch(url, data, app.headers);
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

    handleChange = field => event => {
        switch (field) {
            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case 'course':
                this.setState({course: event.target.value});
                this.props.program && this.searchCourse(this.props.program, event.target.value)
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
            case 'ambient':
                this.setState({ambient: event.target.value});
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
            case 'teacher':
                this.setState({teacher: event.target.value});
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
            day: [
                {day: '/Lun', state: false},
                {day: '/Mar', state: false},
                {day: '/Mie', state: false},
                {day: '/Jue', state: false},
                {day: '/Vie', state: false},
                {day: '/Sab', state: false},
                {day: '/Dom', state: false}
            ],
            course: '',
            typeCourse: '',
            group: '',
            ambient: '',
            startTime: '',
            endTime: '',
            startDate: '',
            endDate: '',
            teacher: '',
            courseID: '',
            teacherID: '',

            contractType: '',

            courses: [],
            teachers: []
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

    retriveData = (r) => {
        let splitDay = r.days.split('/')
        let arrayDay = this.state.day;
        for (let i = 0; i < arrayDay.length; i++) {
            for (let j = 0; j < splitDay.length; j++) {
                if (arrayDay[i].day === '/' + splitDay[j]) {
                    arrayDay[i].state = true
                }
            }
        }
        this.setState({
            scheduleID: r.id,
            action: "update",
            day: arrayDay,
            course: r.Course.denomination,
            typeCourse: r.type_course,
            group: r.group_class,
            ambient: r.ambient,
            startTime: r.start_time,
            endTime: r.end_time,
            startDate: r.Teacher.date_start,
            endDate: r.Teacher.date_end,
            teacher: r.Teacher.Person.name,
            courseID: r.Course.id,
            teacherID: r.id_teacher,

            contractType: r.Teacher.id_contract_type,

            courses: [],
            teachers: []
        })


    };
    selectectCourse = (r) => {


        this.setState({
            courseID: r.id,
            course: r.denomination + ' - ' + r.Ciclo.ciclo,
            courses: [],

        });
    };
    closeSelectectCourse = () => {

        this.setState({

            courseID: '',
            course: '',
            courses: [],

        });
    };


    selectectTeacher = (r) => {


        this.setState({
            teacherID: r.id,
            teacher: r.name,
            teachers: [],

        });
    };
    closeSelectectTeacher = () => {

        this.setState({
            teacherID: '',
            teacher: '',
            teachers: [],

        });
    };
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
            group,
            startTime,
            endTime,
            startDate,
            endDate,
            teacher,
            courses,
            teachers,
        } = this.state;

        return (


            <Modal show={this.props.form} size={"xl"} backdrop="static" style={{zIndex: "100000"}}>
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR HORARIO</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}} onClick={() => this.closeForm()}/>

                        </OverlayTrigger>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h5>Datos del curso</h5>
                            <hr/>
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
                                            marginTop: '-30px', float: 'right'
                                        }}
                                        className=" btn btn-dark"><Close
                                        style={{color: "dark"}}/></button>
                                </OverlayTrigger>


                                <Table hover responsive style={{marginTop: '-1px'}}>
                                    <tbody>
                                    {courses.length > 0 &&
                                    courses.map((r, i) => {
                                        let ciclo = r.Ciclo && r.Ciclo.ciclo;
                                        let totalHours = parseFloat(r.practical_hours) + parseFloat(r.hours);
                                        return (
                                            <tr key={i} onClick={() => this.selectectCourse(r)}>
                                                <td scope="row">
                                                    <div className="d-inline-block align-middle">

                                                        <div className="d-inline-block">
                                                            <h6 className="m-b-0"> {r.denomination.toUpperCase() + ' - ' + ciclo}</h6>
                                                            <p className="m-b-0"> {r.Ciclo && r.Ciclo.Plan && r.Ciclo.Plan.description + '/ t. hors:' + totalHours}</p>
                                                        </div>
                                                    </div>

                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                    </tbody>
                                </Table>

                            </Form.Group>

                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
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
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
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
                                    <option value={"1"}> 1</option>
                                    <option value={"2"}> 2</option>
                                    <option value={"3"}> 3</option>
                                    <option value={"4"}> 4</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {/*<Col xs={12} sm={12} md={2} lg={2} xl={2}>*/}
                        {/*    <Form.Group className="form-group fill">*/}
                        {/*        <Form.Label className="floating-label"*/}
                        {/*                    style={ambient === "" ? {color: "#ff5252 "} : null}>*/}
                        {/*            Ambiente*/}
                        {/*            <small className="text-danger"> *</small>*/}
                        {/*        </Form.Label>*/}

                        {/*        <Form.Control*/}
                        {/*            type="text"*/}
                        {/*            value={ambient}*/}
                        {/*            onChange={this.handleChange('ambient')}*/}
                        {/*            placeholder="Ambiente"*/}
                        {/*            margin="normal"*/}
                        {/*        />*/}
                        {/*    </Form.Group>*/}
                        {/*</Col>*/}
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h5>Datos del docente</h5>
                            <hr/>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={teacher === "" ? {color: "#ff5252 "} : null}
                                >Docente<small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="number"
                                    value={teacher}
                                    onChange={this.handleChange('teacher')}
                                    placeholder="Buscar curso"
                                    margin="normal"
                                />

                                <OverlayTrigger
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
                                            marginTop: '-30px', float: 'right'
                                        }}
                                        className=" btn btn-dark"><Close
                                        style={{color: "dark"}}/></button>
                                </OverlayTrigger>


                                <Table hover responsive style={{marginTop: '-1px'}}>
                                    <tbody>
                                    {teachers.length > 0 &&
                                    teachers.map((r, i) => {
                                        return (
                                            <tr key={i} onClick={() => this.selectectTeacher(r)}>
                                                <td scope="row">
                                                    <div className="d-inline-block align-middle">
                                                        <img
                                                            src={r.photo !== "" ? app.server + 'person-photography/' + r.photo : defaultUser}
                                                            // src={defaultUser}
                                                            alt="user"
                                                            className="img-radius align-top m-r-15"
                                                            style={{width: '40px'}}
                                                        />
                                                        <div className="d-inline-block">

                                                            <h6 className="m-b-0"> {r.name}</h6>
                                                            <p className="m-b-0"> {r.document_number}</p>

                                                        </div>
                                                    </div>

                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                    </tbody>
                                </Table>

                            </Form.Group>

                        </Col>

                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={contractType === "" ? {color: "#ff5252 "} : null}
                                >Tipo de contrato <small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={contractType}
                                              onChange={this.handleChange('contractType')}
                                >

                                    <option defaultValue={true} hidden>Tipo de contrato</option>
                                    {
                                        contractTypes.length > 0 ?
                                            contractTypes.map((r, k) =>
                                                <option value={r.id} key={k}> {r.denomination} </option>
                                            ) :
                                            <option value={false} disabled>No se encontraron datos</option>
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
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
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={endDate === "" ? {color: "#ff5252 "} : null}
                                >Fecha Fecha Fin <small className="text-danger"> *</small></Form.Label>
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


                            {
                                action === "add" ?
                                    <Button
                                        className="pull-right"
                                        disabled={this.state.loaderPerson}
                                        variant="primary"
                                        onClick={() => this.createHorary()}
                                    >
                                        {this.state.loaderPerson &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button>

                                    :

                                    <Button
                                        className="pull-right"
                                        disabled={this.state.loaderPerson}
                                        variant="primary"
                                        onClick={() => this.updateHorary()}
                                    >
                                        {this.state.loaderPerson &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar Cambios</Button>

                            }

                        </Col>

                    </Row>
                </Modal.Body>
            </Modal>


        );
    }
}

export default HoraryForm;
