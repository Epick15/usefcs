import React from 'react';
import {withRouter} from "react-router";
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../index";

import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";


moment.locale('es');

class FormAdmissionPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,
            loader: false,
            action: "add",

            admissionPlanID: this.props.admissionPlanID,
            programID: this.props.programID,
            formAdmissionPlan: this.props.formAdmissionPlan,

            retriveAdmissionPlan: this.props.retriveAdmissionPlan,
            descriptionWork: "",
            duration: "",
            dateClass: "",
            plan: "",
            process: "",
            numberStudent: "",
            startDate: "",
            academicCalendar: "",
            endDate: "",

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
        if (prevProps.formAdmissionPlan !== this.props.formAdmissionPlan) {
            this.setState({formAdmissionPlan: this.props.formAdmissionPlan});
        }
        if (prevProps.retriveAdmissionPlan !== this.props.retriveAdmissionPlan) {
            this.props.retriveAdmissionPlan && this.retriveForm(this.props.retriveAdmissionPlan)
        }
        if (prevProps.deleteAdmissionPlanID !== this.props.deleteAdmissionPlanID) {
            this.props.deleteAdmissionPlanID !== "" && this.openAdmissionPlanSweetAlert(this.props.deleteAdmissionPlanID)
        }
        if (prevProps.plans !== this.props.plans) {
            this.setState({plans: this.props.plans})
        }
    }


    // async listAcademicCalendarActualAdmissionPlan() {
    //     this.setState({calendarLoader: true});
    //     const url = app.general + '/' + app.academicCalendar + '/actual/work-plan';
    //
    //     try {
    //         const res = await axios.get(url, app.headers);
    //         if (res.data) this.setState({
    //             academicCalendars: res.data,
    //             processs: res.data.Academic_semesters
    //         });
    //         this.setState({calendarLoader: false});
    //     } catch (err) {
    //         this.setState({calendarLoader: false});
    //         PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
    //         console.log(err);
    //     }
    // };
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
                this.setState({descriptionWork: event.target.value.slice(0, 255).toUpperCase()});
                break;
            case 'plan':
                this.setState({plan: event.target.value});
                break;
            case 'duration':
                this.setState({duration: event.target.value});
                break;
            case 'dateClass':
                this.setState({dateClass: event.target.value});
                break;
            case 'academicCalendar':
                this.setState({academicCalendar: event.target.value, processs: []});
                this.listProcessByAcademicCalendarID(event.target.value)
                break;
            case 'process':
                this.setState({process: event.target.value});
                break;
            case 'numberStudent':
                this.setState({numberStudent: event.target.value.replace(/[^0-9/]/g, '').slice(0, 2)});
                break;
            case 'startDate':
                this.setState({startDate: event.target.value});
                this.calculateMount();
                break;
            case 'endDate':
                this.setState({endDate: event.target.value});
                this.calculateMount();
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
        this.listProcessByAcademicCalendarID(r.Process.id_academic_calendar);
        this.setState({


            action: "update",
            admissionPlanID: r.id,
            duration: r.duration,
            dateClass: r.date_class,
            plan: r.id_plan,
            process: r.id_process,
            academicCalendar: r.Process.id_academic_calendar,
            numberStudent: r.number_student,
            startDate: r.date_start,
            endDate: r.date_end,
            descriptionWork: r.description,

        })
    };
    closeForm = () => {

        this.setState({
            action: "add",
            admissionPlanID: "",
            plan: "",
            duration: "",
            dateClass: "",
            process: "",
            numberStudent: "",
            startDate: "",
            endDate: "",
            descriptionWork: "",
        });
        this.props.closeFormAdmissionPlan();
    };
    openAdmissionPlanSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyAdmissionPlan(id) : this.props.closeFormAdmissionPlan();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    async createAdmissionPlan() {
        this.setState({loaderAdmissionPlan: true});

        const {
            programID,
            plan,
            process,
            descriptionWork,
            numberStudent,
            startDate,
            endDate,
            dateClass,
            duration
        } = this.state;

        if (programID !== "" && plan !== "" && process !== "" && descriptionWork !== "" && numberStudent !== ""
            && startDate !== "" && endDate !== "" && dateClass !== "" && duration !== ""
        ) {
            const url = app.programs + '/' + app.admissionPlan;
            let data = new FormData();
            data.set("id_program", programID);
            data.set("id_plan", plan);
            data.set("duration", duration);
            data.set("date_class", dateClass);
            data.set("id_process", process);
            data.set("description", descriptionWork);
            data.set("number_student", numberStudent);
            data.set("date_start", startDate);
            data.set("date_end", endDate);


            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loaderAdmissionPlan: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderAdmissionPlan: false});
                PNotify.error({title: "Oh no!", text: err.response.data.error, delay: 2000});

            }

        } else {
            this.setState({loaderAdmissionPlan: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateAdmissionPlan() {
        this.setState({loaderAdmissionPlan: true});

        const {
            plan, process, descriptionWork, numberStudent, startDate, endDate, dateClass,
            duration
        } = this.state;

        if (plan !== "" && process !== "" && descriptionWork !== "" && numberStudent !== "" &&
            startDate !== "" && endDate !== "" && dateClass !== "" && duration !== "") {
            const url = app.programs + '/' + app.admissionPlan + '/' + this.state.admissionPlanID;
            let data = new FormData();
            data.set("id_plan", plan);
            data.set("duration", duration);
            data.set("date_class", dateClass);
            data.set("id_process", process);
            data.set("description", descriptionWork);
            data.set("number_student", numberStudent);
            data.set("date_start", startDate);
            data.set("date_end", endDate);

            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loaderAdmissionPlan: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderAdmissionPlan: false});
                PNotify.error({title: "Oh no!", text: err.response.data.error, delay: 2000});

            }

        } else {
            this.setState({loaderAdmissionPlan: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async destroyAdmissionPlan(id) {
        console.log(id)
        try {
            this.setState({loaderEntry: true});
            const url = app.programs + '/' + app.admissionPlan + '/' + id;
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
            academicCalendar,
            descriptionWork,
            plan,
            process,
            formAdmissionPlan,
            loaderAdmissionPlan,
            numberStudent,
            duration,
            dateClass,
            startDate,
            endDate,

            action
        } = this.state;
        const {academicCalendars} = this.state;
        const {plans, processs} = this.state;
        return (

            <Modal show={formAdmissionPlan} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}> {action === "add" ? "REGISTRAR" : "EDITAR"} PLAN DE
                        ADMISIÓN</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close type="button" style={{color: "white"}} onClick={() => this.closeForm()}/>

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>

                    <Row>

                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={descriptionWork === "" ? {color: "#ff5252 "} : null}>
                                    Nombre del plan de admisión
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    value={descriptionWork}
                                    onChange={this.handleChange('descriptionWork')}
                                    placeholder="PLAN DE ADMISSIÓN + AÑO + PROCESO"
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
                                    Proceso de admisión
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
                                    type="number"
                                    value={numberStudent}
                                    onChange={this.handleChange('numberStudent')}
                                    placeholder="Cantidad de estudiantes"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>


                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
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
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
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
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={dateClass === "" ? {color: "#ff5252 "} : null}>
                                    Fecha de matrícula
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    max="2999-12-31"
                                    onChange={this.handleChange('dateClass')}
                                    value={dateClass}
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={duration === "" ? {color: "#ff5252 "} : null}>
                                    Duración en meses
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    value={duration}
                                    onChange={this.handleChange('duration')}
                                    placeholder="Duración en meses"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            {action === 'add' ?
                                <Button
                                    className="pull-right"
                                    disabled={loaderAdmissionPlan}
                                    variant="primary"

                                    onClick={() => this.createAdmissionPlan()}>
                                    {loaderAdmissionPlan &&
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button> :
                                <Button
                                    className="pull-right"
                                    disabled={loaderAdmissionPlan}
                                    variant="primary"

                                    onClick={() => this.updateAdmissionPlan()}>
                                    {loaderAdmissionPlan &&
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

export default withRouter(FormAdmissionPlan)

