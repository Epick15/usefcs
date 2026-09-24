import React from 'react';
import {withRouter} from "react-router";
import {Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../index";
import Select from "react-select";
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
            descriptionWork: "",
            plan: "",
            process: "",
            numberStudent: "",
            startDate: "",
            endDate: "",
            endTime: "",
            startTime: "",

            nameAcademicCalendar: "",

            plans: [],
            processs: [],

            academicCalendars: [],
            workPlans: this.props.workPlans,
        }
    }

    async componentDidMount() {
        const programID = atob(this.props.match.params.id);
        this.setState({programID: programID});
        this.listPlanByProgramID(programID);
        this.listAcademicCalendarActualWorkPlan();

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.workPlanID !== this.props.workPlanID) {
            this.setState({workPlanID: this.props.workPlanID});

        }
        if (prevProps.workPlans !== this.props.workPlans) {
            this.setState({workPlans: this.props.workPlans});
            this.retriveWorkPlan(this.props.workPlans);
        }
    }

    async listPlanByProgramID(id) {
        this.setState({plansLoader: true})
        const url = app.programs + '/' + app.program + '/' + id + '/study-plan';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                titleModule: res.data.denomination,
                plans: res.data.Plans
            });
            this.setState({plansLoader: false});
            console.log(res.data)

        } catch (err) {
            this.setState({plansLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err)

        }

    };

    async listAcademicCalendarActualWorkPlan() {
        this.setState({calendarLoader: true});
        const url = app.general + '/' + app.academicCalendar + '/actual/work-plan';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                academicCalendars: res.data,
                processs: res.data.Academic_semesters
            });
            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    handleChange = field => event => {

        switch (field) {
            case 'descriptionWork':
                this.setState({descriptionWork: event.target.value});
                break;
            case 'plan':
                this.setState({plan: event.target.value});
                break;
            case 'process':
                this.setState({process: event.target.value});
                break;
            case 'numberStudent':
                this.setState({numberStudent: event.target.value});
                break;
            case 'startDate':
                this.setState({startDate: event.target.value});
                break;
            case 'endDate':
                this.setState({endDate: event.target.value});
                break;
            case 'startTime':
                this.setState({startTime: event.target.value});
                break;
            case 'endTime':
                this.setState({endTime: event.target.value});
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
    retriveWorkPlan = (r) => {

        this.setState({
            action: "update",
            workPlanID:r.id,
            plan: r.id_plan,
            process: r.id_process,
            numberStudent: r.number_student,
            startDate: r.date_start,
            endDate: r.date_end,
            endTime: r.start_time,
            startTime: r.end_time,
            descriptionWork: r.description,
            day: r.days,
        })
    };

    async createWorkPlan() {
        this.setState({loaderGeneral: true});

        const {programID, plan, process, descriptionWork, numberStudent, day, startDate, endDate, startTime, endTime} = this.state;

        if (programID !== "" && plan !== "" && process !== "" && descriptionWork !== "" && numberStudent !== "" &&
            day !== "" && startDate !== "" && endDate !== "" && startTime !== "" && endTime !== ""
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


            try {
                const res = await axios.post(url, data, app.headers);
                this.props.updateWorkPlanID(res.data.id)
                this.setState({loaderGeneral: false, workPlanID: res.data.id, action: "update"});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderGeneral: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderGeneral: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateWorkPlan() {
        this.setState({loaderGeneral: true});

        const {plan, process, descriptionWork, numberStudent, day, startDate, endDate, startTime, endTime} = this.state;

        if (plan !== "" && process !== "" && descriptionWork !== "" && numberStudent !== "" &&
            day !== "" && startDate !== "" && endDate !== "" && startTime !== "" && endTime !== ""
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


            try {
                const res = await axios.patch(url, data, app.headers);
                this.setState({loaderGeneral: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderGeneral: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderGeneral: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    render() {

        const {day, descriptionWork, plan, process, numberStudent, nameAcademicCalendar, startDate, endDate, endTime, startTime, loader, action} = this.state;
        const {plans, processs} = this.state;
        return (
            <Card>

                <Card.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <h5 className="mb-0">Información especifica</h5>
                            <br/>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Nombre del plan de trabajo <small className="text-danger"> *</small></Form.Label>
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
                                <Form.Label className="floating-label">Plan de estudio <small className="text-danger"> *</small></Form.Label>
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
                                <Form.Label className="floating-label">{nameAcademicCalendar ? nameAcademicCalendar.toLowerCase() : "Calendario academico"} <small
                                    className="text-danger"> *</small></Form.Label>
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
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Cantidada de estudiantes <small className="text-danger"> *</small></Form.Label>
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
                                <Form.Label className="floating-label">Fecha Inicio</Form.Label>
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
                                <Form.Label className="floating-label">Fecha Fin</Form.Label>
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
                                <Form.Label className="floating-label">Hora Inicio</Form.Label>
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
                                <Form.Label className="floating-label">Hora fin</Form.Label>
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
                        <Col>
                            {action === 'add' ?
                                <Button
                                    className="pull-right"
                                    disabled={loader}
                                    variant="primary"

                                    onClick={() => this.createWorkPlan()}>
                                    {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button> :
                                <Button
                                    className="pull-right"
                                    disabled={loader}
                                    variant="primary"

                                    onClick={() => this.updateWorkPlan()}>
                                    {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar Cambios</Button>
                            }
                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        );
    }
}

export default withRouter(FormWorkPlan)

