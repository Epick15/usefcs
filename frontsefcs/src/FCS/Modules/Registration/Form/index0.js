import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
import component from "../../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import Close from "@material-ui/icons/Close";
import app from "../../../Constants";
import axios from "axios";
import Swal from "sweetalert2";

import {Visibility} from "@material-ui/icons";


moment.locale('es');


class FormAcademicRecord extends React.Component {
    state = {

        formRegistration: this.props.formRegistration,
        studentID: this.props.studentID,
        deleteRegistrationID: this.props.deleteRegistrationID,
        leaveRegistrationID: this.props.leaveRegistrationID,
        academicDegree: this.props.academicDegree,
        titleConcept: "",
        requeriments: "",
        academicCalendar: "",
        process: "",
        note: "",
        multipleCredit: false,
        amount: "",
        typeRegistration: "Regular",
        academicCalendars: [],
        processs: [],
        courses: [],
        checkCourse: []
    };

    async componentDidMount() {
        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});
        this.listAcademicSemesterAndAcademicCalendar();
        this.listActualUit();

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formRegistration !== this.props.formRegistration && prevProps.action !== this.props.action) {

            this.props.formRegistration && this.props.action === "add" && this.retrieveStudentCostAdmissionPlan(this.props.admissionPlanID)
            this.props.formRegistration && this.props.action === "add" && this.state.process && this.listRegistrationCourse(this.props.studyPlanID, this.props.studentID, this.state.process)

        }
        if (prevProps.retriveRegistration !== this.props.retriveRegistration && prevProps.action !== this.props.action) {
            this.props.retriveRegistration !== "" && this.props.action !== "add" && this.retriveRegistration(this.props.retriveRegistration.records);
        }
        if (prevProps.academicDegree !== this.props.academicDegree) {
            this.props.academicDegree !== "" && this.setState({academicDegree: this.props.academicDegree})
        }
        if (prevProps.deleteRegistrationID !== this.props.deleteRegistrationID) {
            this.props.deleteRegistrationID !== "" && this.openRegistrationSweetAlert(this.props.deleteRegistrationID)
        }
        if (prevProps.leaveRegistrationID !== this.props.leaveRegistrationID) {
            this.props.leaveRegistrationID !== "" && this.openLeaveRegistrationSweetAlert(this.props.leaveRegistrationID)
        }
    }

    async listActualUit() {
        this.setState({loaderData: true});
        const url = app.general + '/' + app.uit + '/year/actual';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                amountUit: res.data.amount,
                yearUit: res.data.year
            });
            if (this.state.loaderData) {
                this.setState({loaderData: false})
            }

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async retrieveStudentCostAdmissionPlan(id_admission_plan) {
        this.setState({admissionPlanLoader: true, multipleCredit: false});
        const url = app.person + '/' + app.student + '/' + app.admissionPlan + '/' + id_admission_plan + '/' + app.costAdmissionPlan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                titleConcept: res.data.Concept.denomination,
                amount: res.data.amount,
                concept: res.data.id_concept,

            });
            this.setState({admissionPlanLoader: false});
        } catch (err) {
            this.setState({admissionPlanLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };


    async listConceptByID(description, id) {
        this.setState({admissionPlanLoader: true});
        const url = app.general + '/' + app.concepts + '/id/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                let recargo = 0;
                if (description === 'Otros' || description === 'Tesis' || description === 'Desaprobado') {
                    this.setState({multipleCredit: true})
                } else {
                    this.setState({multipleCredit: false})
                }
                this.setState({
                    //por el 10 de recargo
                    titleConcept: res.data.denomination,
                    amount: Math.round(res.data.percent / 100 * this.state.amountUit + recargo),
                    concept: res.data.id,

                });
            }
            this.setState({admissionPlanLoader: false});
        } catch (err) {
            this.setState({admissionPlanLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listRegistrationCourse(id_plan, id_student, id_process) {
        this.setState({admissionPlanLoader: true});
        const url = app.registration + '/' + app.registrations + '/' + app.course;
        try {
            let data = new FormData();
            data.set('id_plan', id_plan);
            data.set('id_student', id_student);
            data.set('id_process', id_process);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) this.setState({courses: res.data});
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)
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

    async listSeeRequirement(id_course) {
        // this.setState({calendarLoader: true});
        const url = app.registration + '/' + app.registrations + '/' + id_course + '/requirement-course';


        try {
            const res = await axios.get(url, app.headers);
            console.log(res.data)
            if (res.data) this.setState({
                requeriments: res.data,
            });
            // this.setState({calendarLoader: false});
        } catch (err) {
            // this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };


    async createRegistration() {
        this.setState({loaderRegistration: true});
        const {concept, amount, process, typeRegistration} = this.state;
        const {studentID, admissionPlanID, programID, organicUnit} = this.props;
        let tempCourse = [];
        // maping only id and note

        this.state.courses.map(r => {
                if (r.state) {
                    tempCourse.push({
                        id: r.id,
                        note: r.note,
                        note_state: r.note_state
                    })
                }
            }
        );


        if (tempCourse.length > 1 && this.state.multipleCredit) {
            this.setState({loaderRegistration: false});
            PNotify.notice({title: "Advertencia!", text: "Solo puede registrar un curso dirigido", delay: 2000});
        } else {
            if (tempCourse.length > 0 && concept !== '' && amount !== '' && process !== '' && typeRegistration !== '' && studentID !== '' && admissionPlanID !== '' && programID !== '' && organicUnit !== '') {
                const url = app.registration + '/' + app.registrations;
                let data = new FormData();
                data.set('courses', JSON.stringify(tempCourse));
                data.set('id_concept', concept);
                data.set('amount', amount);
                data.set('id_process', process);
                data.set('type', typeRegistration);
                data.set('id_student', studentID);
                data.set('id_admission_plan', admissionPlanID);

                data.set('id_organic_unit', organicUnit);
                data.set('id_program', programID);
                try {
                    const res = await axios.post(url, data, app.headers);
                    this.props.callData();
                    this.closeForm();
                    this.setState({loaderRegistration: false});
                    PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
                } catch (err) {
                    console.log(err.response)
                    this.setState({loaderRegistration: false});
                    PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
                }
            } else {
                this.setState({loaderRegistration: false});
                PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
            }
        }

    };

    async updateRegistration() {
        this.setState({loaderRegistration: true});
        const {concept, amount, process, typeRegistration, registrationID} = this.state;
        let tempCourse = [];
        // maping only id and note

        this.state.courses.map(r => {
                if (r.state) {
                    tempCourse.push({
                        id: r.id,
                        note: r.note,
                        note_state: r.note_state
                    })
                }
            }
        );

        if (tempCourse.length > 0 && concept !== '' && amount !== '' && process !== '' && registrationID !== '' && typeRegistration !== '') {
            const url = app.registration + '/' + app.registrations + '/' + registrationID;

            let data = new FormData();
            data.set('courses', JSON.stringify(tempCourse));
            data.set('id_concept', concept);
            data.set('amount', amount);
            data.set('id_process', process);
            data.set('type', typeRegistration);
            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loaderRegistration: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});

            } catch (err) {
                this.setState({loaderRegistration: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderRegistration: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async leaveRegistration(id) {
        try {
            this.setState({loaderEntry: true});
            const url = app.registration + '/leave-' + app.registrations + '/' + id;
            const res = await axios.patch(url, app.headers);
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

    async destroyRegistration(id) {
        try {
            this.setState({loaderEntry: true});
            const url = app.registration + '/' + app.registrations + '/' + id;
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

    handleChange = field => event => {

        switch (field) {
            case 'note':
                if (event.target.value <= 20) {
                    this.setState({note: event.target.value.replace(/[^0-9/]/g, '')});
                }

                break;
            case 'academicCalendar':
                this.setState({academicCalendar: event.target.value, processs: []});
                this.listProcessByAcademicCalendarID(event.target.value)
                break;
            case 'process':
                this.setState({process: event.target.value});
                this.listRegistrationCourse(this.props.studyPlanID, this.props.studentID, event.target.value)
                break;
            case 'typeRegistration':


                if (event.target.value === 'Extemporánea') {
                    //maestria 8 //doctorado 92

                    // let id = this.state.academicDegree === 'Doctor' ? 92 : 8;
                    // this.listConceptByID('Extemporánea', id)
                    this.setState({amount: parseFloat(this.state.amount) + parseFloat(this.state.amount * 0.1)})


                } else if (event.target.value === 'Curso dirigido Otros') {
                    //maestria 65 //doctorado 63 // especialista 101
                    let id = 0;
                    if (this.state.academicDegree === 'Doctor') {
                        id = 63
                    }
                    if (this.state.academicDegree === 'Maestro') {
                        id = 65
                    }
                    if (this.state.academicDegree === 'Especialista') {
                        id = 101
                    }
                    this.listConceptByID('Otros', id)


                } else if (event.target.value === 'Curso dirigido Tesis') {
                    //maestria 64  //doctorado 62 // especialista 100
                    let id = 0;
                    if (this.state.academicDegree === 'Doctor') {
                        id = 62
                    }
                    if (this.state.academicDegree === 'Maestro') {
                        id = 64
                    }
                    if (this.state.academicDegree === 'Especialista') {
                        id = 100
                    }
                    this.listConceptByID('Tesis', id)


                } else if (event.target.value === 'Curso desaprobado por Credito') {
                    //maestria-doctorado-especialista 99
                    this.listConceptByID('Desaprobado', 99)


                } else {
                    this.retrieveStudentCostAdmissionPlan(this.props.admissionPlanID)
                }
                this.checkFalseAllCourse();
                this.setState({typeRegistration: event.target.value});
                break;
            case 'amount':
                this.setState({amount: event.target.value});
                break;
            default:
                break;
        }
    };
    retriveRegistration = (r) => {

        this.setState({
            registrationID: r.id,
            courses: r.Registration_course,
            academicCalendar: r.Academic_semester.Academic_calendar.id,
            process: r.Academic_semester.id,
            amount: r.Payment.amount,
            titleConcept: r.Payment.Concept.denomination,
            concept: r.Payment.Concept.id,
            typeRegistration: r.type,
        })
        this.listProcessByAcademicCalendarID(r.Academic_semester.Academic_calendar.id)
    };
    closeForm = () => {
        this.props.closeFormRegistration();
        this.setState({
            acacdemicCalendar: "",
            process: "",
            typeRegistration: "Regular",
            courses: []
        })

    };
    checkCourse = (i, state) => {

        let courses = this.state.courses;
        courses[i].state = !state;

        if (courses[i].state === false) {
            courses[i].note = 0
            this.state.multipleCredit && this.setState({amount: this.state.amount / parseFloat(courses[i].credits)})
        } else {
            this.state.multipleCredit && this.setState({amount: this.state.amount * parseFloat(courses[i].credits)})
        }
        this.setState({courses});

    };
    checkFalseAllCourse = () => {

        let courses = this.state.courses;
        for (let i = 0; i < courses.length; i++) {
            courses[i].state = false
        }
        this.setState({courses});

    };

    checkNoteState = (i, state) => {
        let courses = this.state.courses;
        courses[i].note_state = !state;
        if (courses[i].note_state === true) {
            courses[i].note = 0
        }
        this.setState({courses});

    };
    updateNote = (i, e) => {
        if (e.target.value <= 20) {
            let courses = this.state.courses;
            courses[i].note = e.target.value.replace(/[^0-9/]/g, '');
            this.setState({courses: courses});
        }

    };
    openRegistrationSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyRegistration(id) : this.props.closeFormRegistration();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };
    openLeaveRegistrationSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: '¿Estás seguro que desea retirar esta Matrícula?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Retirar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.leaveRegistration(id) : this.props.closeFormRegistration();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };


    render() {


        const {process, titleConcept, typeRegistration} = this.state;
        const {processs, amount} = this.state;

        return (
            <Modal show={this.props.formRegistration} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5"
                                 style={{color: '#ffffff'}}>{this.props.action === "add" ? "REGISTRAR" : "EDITAR"} MATRÍCULA
                        - {this.props.titleModule}</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}}
                                   onClick={() => this.closeForm()}
                            />

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={process === "" ? {color: "#ff5252 "} : null}>
                                    Proceso de matrícula
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
                        <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                    // style={civilStatu === "" ? {color: "#ff5252 "} : null}
                                >Tipo de matrícula <small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={typeRegistration}
                                              onChange={this.handleChange('typeRegistration')}>
                                    >

                                    <option value="Regular"> Regular</option>
                                    <option value="Extemporánea"> Extemporánea</option>
                                    <option value="Curso dirigido Otros">Curso dirigido Otros</option>
                                    <option value="Curso dirigido Tesis">Curso dirigido Tesis</option>
                                    <option value="Curso desaprobado por Credito">Curso desaprobado por Credito</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">
                                    Concepto
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    disabled={true}
                                    value={titleConcept}
                                    onChange={this.handleChange('numberStudent')}
                                    placeholder="Cantidad de estudiantes"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={1} lg={1} xl={1}>
                            <Form.Group className="form-group fill"

                            >
                                <Form.Label className="floating-label"
                                            style={amount === "" ? {color: "#ff5252 "} : null}
                                >Costo<small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    placeholder="Documento de Identidad"
                                    onKeyPress={this.handleKeyPress}
                                    id="amount"
                                    value={amount}
                                    type="number"
                                    onChange={this.handleChange('amount')}
                                />
                            </Form.Group>
                        </Col>


                        <Table size="sm" hover responsive>
                            <thead>
                            <tr className="d-flex">
                                <th className="col-9">Curso</th>
                                <th className="col-1">Ciclo</th>
                                <th className="col-1">Credito</th>
                                <th className="col-1">Requi.</th>

                                {/*<th className="col-2">Nota</th>*/}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.courses.map((r, i) => {


                                    return (
                                        <tr className="d-flex" key={i} style={{height: "45px"}}>
                                            <td className="col-9">
                                                <div className="d-inline-block" style={{
                                                    marginRight: "10px",
                                                    display: "block", /* or inline-block, at least its a block element */
                                                    width: "auto", /* or width is certain by parent element */
                                                    height: "auto", /* height cannot be defined */
                                                    wordBreak: "break-all", /*  */
                                                    wordWrap: "break-word", /* if you want to cut the complete word */
                                                    whiteSpace: "normal"
                                                }}>
                                                    <label
                                                        className="check-task custom-control custom-checkbox d-flex justify-content-center">
                                                        <input type="checkbox" className="custom-control-input"
                                                               onClick={() => this.checkCourse(i, r.state)}
                                                               checked={r.state}
                                                               value={r.state}
                                                               disabled={this.props.action !== "add" ? true : false}
                                                               readOnly
                                                        />
                                                        < span
                                                            className="custom-control-label">{r.order + ". " + r.denomination + " "} {r.type === "Electivo" ?
                                                            <strong
                                                                className={"text-primary"}> {r.type}</strong> : ""}</span>
                                                        
                                                    </label>

                                                </div>
                                            </td>
                                            <td className="col-1">
                                                <div className="d-inline-block align-middle">

                                                    <div className="d-inline-block">
                                                        <p className="m-b-0"
                                                        > {r.ciclo}</p>
                                                        {/*<p className="m-b-0"> Ciclo:<strong>{k.Semester_mention.semester.replace('Semestre', '')} </strong></p>*/}
                                                    </div>
                                                </div>


                                            </td>
                                            <td className="col-1">
                                                <div className="d-inline-block align-middle">

                                                    <div className="d-inline-block">
                                                        <p className="m-b-0"
                                                        > {r.credits}</p>
                                                    </div>
                                                </div>


                                            </td>
                                            <td className="col-1">
                                                <div className="d-inline-block align-middle">
                                                    <div className="d-inline-block">
                                                        <OverlayTrigger
                                                            overlay={<Tooltip
                                                                style={{zIndex: 10000000000}}>{this.state.requeriments}</Tooltip>}>

                                                            <Visibility
                                                                onMouseEnter={() => this.listSeeRequirement(r.id)}
                                                                style={{color: "#4680ff"}}/>
                                                        </OverlayTrigger>

                                                    </div>
                                                </div>
                                            </td>

                                            {/*<td className="col-2">*/}
                                            {/*    <Form.Group className="form-group fill" style={{marginTop: "-8px"}}>*/}
                                            {/*        <input type="text" className="form-control"*/}
                                            {/*               value={r.note}*/}
                                            {/*               onChange={this.updateNote.bind(this, i)}*/}
                                            {/*            // disabled={r.note_state ? true : false}*/}
                                            {/*               placeholder="Nota"*/}
                                            {/*               margin="normal"*/}

                                            {/*        />*/}
                                            {/*    </Form.Group>*/}

                                            {/*</td>*/}

                                        </tr>
                                    )
                                })
                            }


                            </tbody>
                        </Table>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {this.props.action === "add" ?
                                <Button
                                    className="pull-right"
                                    variant="primary"
                                    onClick={() => this.createRegistration()}
                                >
                                    {this.state.loaderRegistration &&
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button>
                                :
                                <Button
                                    className="pull-right"
                                    variant="primary"
                                    onClick={() => this.updateRegistration()}
                                >
                                    {this.state.loaderRegistration &&
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar cambios</Button>
                            }
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

export default FormAcademicRecord;
