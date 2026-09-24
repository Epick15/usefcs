import React from 'react';
import {withRouter} from "react-router";
import {Button,  Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../index";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";
import crypt from "node-cryptex";

const k = new Buffer(32);
const v = new Buffer(16);
moment.locale('es');

class FormWorkPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,
            loader: false,
            action: "add",
            day: [
                {day: '/Lun', state: false},
                {day: '/Mar', state: false},
                {day: '/Mie', state: false},
                {day: '/Jue', state: false},
                {day: '/Vie', state: false},
                {day: '/Sab', state: false},
                {day: '/Dom', state: false}
            ],
            workPlanID: this.props.workPlanID,
            programID: this.props.programID,
            formWorkPlan: this.props.formWorkPlan,

            retriveWorkPlan: this.props.retriveWorkPlan,
            descriptionWork: "",
            plan: "",
            process: "",
            numberStudent: "",
            startDate: "",
            endDate: "",
            endTime: "",
            startTime: "",

            foundation: "",
            objective: "",
            legalBase: "",
            organization: "",
            request: "",
            academicCalendar: "",

            nameAcademicCalendar: "",

            plans: [],
            processs: [],

            academicCalendars: [],

        }
    }

    async componentDidMount() {
        const programID = atob(this.props.match.params.id);
        this.setState({programID: programID});
        this.listAcademicCalendar();
        this.setState({plans: this.props.plans})


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formWorkPlan !== this.props.formWorkPlan) {
            this.setState({formWorkPlan: this.props.formWorkPlan});
        }
        if (prevProps.retriveWorkPlan !== this.props.retriveWorkPlan) {
            this.props.retriveWorkPlan && this.retriveForm(this.props.retriveWorkPlan)
        }
        if (prevProps.deleteWorkPlanID !== this.props.deleteWorkPlanID) {
            this.props.deleteWorkPlanID !== "" && this.openWorkPlanSweetAlert(this.props.deleteWorkPlanID)
        }
        if (prevProps.plans !== this.props.plans) {
            this.setState({plans: this.props.plans})
        }
    }


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

    calculateMount = () => {

        if (this.state.startDate && this.state.endDate) {
            let diffDuration = moment.duration(moment(this.state.startDate).diff(moment(this.state.endDate)));


            let day = diffDuration.days() * -1;
            let mounth = diffDuration.months() * -1;
            let year = diffDuration.years() * -1;

            let totalDays = (year * 12 * 30.4167) + (mounth * 30.4167) + day;

            const totalYears = Math.trunc(totalDays / 365);
            const totalMonths = Math.trunc((totalDays % 365) / 30);
            const remainingDays = Math.trunc((totalDays % 365) % 30);
            console.log(totalYears + " AÑOS " + totalMonths + " MESES " + remainingDays + " DIAS")
            // return (totalYears + " AÑOS " + totalMonths + " MESES " + remainingDays + " DIAS")

        }

    }
    handleChange = field => event => {

        switch (field) {
            case 'descriptionWork':
                this.setState({descriptionWork: event.target.value});
                break;
            case 'plan':
                this.setState({plan: event.target.value});
                break;
            case 'academicCalendar':
                this.setState({academicCalendar: event.target.value, processs: []});
                this.listProcessByAcademicCalendarID(event.target.value)
                break;
            case 'process':
                this.setState({process: event.target.value});
                break;
            case 'numberStudent':
                this.setState({numberStudent: event.target.value});
                break;
            case 'startDate':
                this.setState({startDate: event.target.value});
                this.calculateMount();
                break;
            case 'endDate':

                this.setState({endDate: event.target.value});
                this.calculateMount();
                break;
            case 'startTime':
                this.setState({startTime: event.target.value});
                break;
            case 'endTime':
                this.setState({endTime: event.target.value});
                break;
            case 'foundation':
                this.setState({foundation: event.target.value});
                break;
            case 'objective':
                this.setState({objective: event.target.value});
                break;
            case 'legalBase':
                this.setState({legalBase: event.target.value});
                break;
            case 'organization':
                this.setState({organization: event.target.value});
                break;
            case 'request':
                this.setState({request: event.target.value});
                break;
            default:
                break;
        }
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
    retriveForm = (r) => {
        console.log(r, "aqui la otra data")
        this.setState({
            action: "update",
            workPlanID: r.id,
            plan: r.id_plan,
            process: r.id_process,
            numberStudent: r.number_student,
            startDate: r.date_start,
            endDate: r.date_end,
            endTime: r.start_time,
            startTime: r.end_time,
            descriptionWork: r.description,
            day: r.days,

            foundation: r.foundation,
            objective: r.objective,
            legalBase: r.legal_base,
        })
    };
    closeForm = () => {

        this.setState({
            action: "add",
            workPlanID: "",
            plan: "",
            process: "",
            numberStudent: "",
            startDate: "",
            endDate: "",
            endTime: "",
            startTime: "",
            descriptionWork: "",
            day: [
                {day: '/Lun', state: false},
                {day: '/Mar', state: false},
                {day: '/Mie', state: false},
                {day: '/Jue', state: false},
                {day: '/Vie', state: false},
                {day: '/Sab', state: false},
                {day: '/Dom', state: false}
            ],

            foundation: "",
            objective: "",
            legalBase: "",
        });
        this.props.closeFormWorPlan();
    };
    openWorkPlanSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyWorkPlan(id) : this.props.closeFormWorPlan();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    async createWorkPlan() {
        this.setState({loaderWorkPlan: true});

        const {
            programID,
            plan,
            process,
            descriptionWork,
            numberStudent,
            day,
            startDate,
            endDate,
            startTime,
            endTime
        } = this.state;
        // const {foundation, objective, legalBase} = this.state;
        if (programID !== "" && plan !== "" && process !== "" && descriptionWork !== "" && numberStudent !== "" &&
            day !== "" && startDate !== "" && endDate !== "" && startTime !== "" && endTime !== ""
            // && foundation !== "" && objective !== "" && legalBase !== ""
        ) {
            const url = app.programs + '/' + app.workPlan;
            let data = new FormData();
            data.set("id_program", programID);
            data.set("id_plan", plan);
            data.set("id_process", process);
            data.set("description", descriptionWork);
            data.set("number_student", numberStudent);
            data.set("days", crypt.encrypt(JSON.stringify(day), k, v));
            data.set("date_start", startDate);
            data.set("date_end", endDate);
            data.set("start_time", startTime);
            data.set("end_time", endTime);

            // data.set("foundation", foundation);
            // data.set("objective", objective);
            // data.set("legal_base", legalBase);


            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loaderWorkPlan: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderWorkPlan: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderWorkPlan: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateWorkPlan() {
        this.setState({loaderWorkPlan: true});

        const {plan, process, descriptionWork, numberStudent, day, startDate, endDate, startTime, endTime} = this.state;
        // const {foundation, objective, legalBase} = this.state;
        if (plan !== "" && process !== "" && descriptionWork !== "" && numberStudent !== "" &&
            day !== "" && startDate !== "" && endDate !== "" && startTime !== "" && endTime !== ""
            // && foundation !== "" && objective !== "" && legalBase !== ""
        ) {
            const url = app.programs + '/' + app.workPlan + '/' + this.state.workPlanID;
            let data = new FormData();
            data.set("id_plan", plan);
            data.set("id_process", process);
            data.set("description", descriptionWork);
            data.set("number_student", numberStudent);
            data.set("days", crypt.encrypt(JSON.stringify(day), k, v));
            data.set("date_start", startDate);
            data.set("date_end", endDate);
            data.set("start_time", startTime);
            data.set("end_time", endTime);

            // data.set("foundation", foundation);
            // data.set("objective", objective);
            // data.set("legal_base", legalBase);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loaderWorkPlan: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderWorkPlan: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderWorkPlan: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async destroyWorkPlan(id) {
        console.log(id)
        try {
            this.setState({loaderEntry: true});
            const url = app.programs + '/' + app.workPlan + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderEntry: false});
            this.props.callData();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderEntry: false});
            return false;
        }
    };

    render() {

        const {
            day,
            descriptionWork,
            plan,
            process,
            formWorkPlan,
            loaderWorkPlan,
            numberStudent,
            startDate,
            endDate,
            endTime,
            startTime,
            action
        } = this.state;
        const {academicCalendars, academicCalendar} = this.state;
        const {plans, processs} = this.state;
        return (

            <Modal show={formWorkPlan} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}> {action === "add" ? "REGISTRAR" : "EDITAR"} PLAN DE
                        TRABAJO</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close type="button" style={{color: "white"}} onClick={() => this.closeForm()}/>

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <h5 className="mb-0">Información especifica</h5>
                            <br/>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={descriptionWork === "" ? {color: "#ff5252 "} : null}>
                                    Nombre del plan de trabajo
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    value={descriptionWork}
                                    onChange={this.handleChange('descriptionWork')}
                                    placeholder="ejemplo : Plan de trabajo 2020 - 1"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label" style={plan === "" ? {color: "#ff5252 "} : null}>
                                    Plan de estudio
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control as="select"
                                              value={plan}
                                              onChange={this.handleChange('plan')}>
                                    >
                                    <option defaultValue={true} hidden>
                                        Por favor seleccione una opcción</option>
                                    {
                                        plans.length > 0 ?
                                            plans.map((r, index) => {

                                                return (
                                                    <option value={r.id} key={index}>
                                                        {r.description}
                                                    </option>
                                                )

                                            }) :
                                            <option defaultValue={true}>Error al cargar los
                                                Datos</option>
                                    }

                                </Form.Control>

                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={academicCalendar === "" ? {color: "#ff5252 "} : null}>
                                    Calendario Academico
                                    <small className="text-danger"> *</small>
                                </Form.Label>


                                <Form.Control as="select"
                                              value={academicCalendar}
                                              onChange={this.handleChange('academicCalendar')}>
                                    >
                                    <option defaultValue={true} hidden>
                                        Por favor seleccione una opcción</option>
                                    {
                                        academicCalendars.length > 0 ?
                                            academicCalendars.map((r, index) => {

                                                return (
                                                    <option value={r.id} key={index}>
                                                        {r.denomination}
                                                    </option>
                                                )

                                            }) :
                                            <option defaultValue={true}>Error al cargar los
                                                Datos</option>
                                    }

                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
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
                                            Por favor seleccione una opcción</option>
                                        {
                                            processs.length > 0 ?
                                                processs.map((r, index) => {

                                                    return (
                                                        <option value={r.id} key={index}>
                                                            {r.denomination}
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
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={numberStudent === "" ? {color: "#ff5252 "} : null}>
                                    Cantidad de estudiantes
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    value={numberStudent}
                                    onChange={this.handleChange('numberStudent')}
                                    placeholder="Cantidad de estudiantes"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <h5 className="mb-0">Fecha de Inicio y Horario </h5>
                            <br/>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={startDate === "" ? {color: "#ff5252 "} : null}>
                                    Fecha Inicio
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    max="2999-12-31"
                                    onChange={this.handleChange('startDate')}
                                    value={startDate}
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={endDate === "" ? {color: "#ff5252 "} : null}>
                                    Fecha Fin
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    max="2999-12-31"
                                    onChange={this.handleChange('endDate')}
                                    value={endDate}
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
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
                        <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={startTime === "" ? {color: "#ff5252 "} : null}>
                                    Hora Inicio
                                    <small className="text-danger"> *</small>
                                </Form.Label>


                                <Form.Control


                                    id="number"
                                    type="time"
                                    value={startTime}
                                    onChange={this.handleChange('startTime')}
                                    placeholder="Ingrese descripción"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">

                                <Form.Label className="floating-label"
                                            style={endTime === "" ? {color: "#ff5252 "} : null}>
                                    Hora fin
                                    <small className="text-danger"> *</small>
                                </Form.Label>
                                <Form.Control
                                    type="time"

                                    id="number"
                                    value={endTime}
                                    onChange={this.handleChange('endTime')}
                                    placeholder="Ingrese descripción"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>

                        {/*<Col xs={12} sm={12} md={12} lg={12} xl={12}>*/}
                        {/*    <Form.Group className="form-group fill">*/}
                        {/*        <Form.Label className="floating-label">Fundamentación <small className="text-danger"> *</small></Form.Label>*/}
                        {/*        <Form.Control*/}
                        {/*            as="textarea" rows="9"*/}
                        {/*            value={foundation}*/}
                        {/*            onChange={this.handleChange('foundation')}*/}
                        {/*            placeholder="Estuiantes base para ingresos"*/}
                        {/*            margin="normal"*/}
                        {/*        />*/}
                        {/*    </Form.Group>*/}
                        {/*</Col>*/}
                        {/*<Col xs={12} sm={12} md={12} lg={12} xl={12}>*/}
                        {/*    <Form.Group className="form-group fill">*/}
                        {/*        <Form.Label className="floating-label">Bases Legales <small className="text-danger"> *</small></Form.Label>*/}
                        {/*        <Form.Control*/}
                        {/*            as="textarea" rows="9"*/}
                        {/*            value={legalBase}*/}

                        {/*            onChange={this.handleChange('legalBase')}*/}
                        {/*            placeholder="Estuiantes base para ingresos"*/}
                        {/*            margin="normal"*/}
                        {/*        />*/}
                        {/*    </Form.Group>*/}
                        {/*</Col>*/}
                        {/*<Col xs={12} sm={12} md={12} lg={12} xl={12}>*/}
                        {/*    <Form.Group className="form-group fill">*/}
                        {/*        <Form.Label className="floating-label">Objetivos <small className="text-danger"> *</small></Form.Label>*/}
                        {/*        <Form.Control*/}
                        {/*            as="textarea" rows="9"*/}
                        {/*            value={objective}*/}
                        {/*            onChange={this.handleChange('objective')}*/}
                        {/*            placeholder="Estuiantes base para ingresos"*/}
                        {/*            margin="normal"*/}
                        {/*        />*/}
                        {/*    </Form.Group>*/}
                        {/*</Col>*/}

                        <Col>
                            {action === 'add' ?
                                <Button
                                    className="pull-right"
                                    disabled={loaderWorkPlan}
                                    variant="primary"

                                    onClick={() => this.createWorkPlan()}>
                                    {loaderWorkPlan &&
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button> :
                                <Button
                                    className="pull-right"
                                    disabled={loaderWorkPlan}
                                    variant="primary"

                                    onClick={() => this.updateWorkPlan()}>
                                    {loaderWorkPlan &&
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

export default withRouter(FormWorkPlan)

