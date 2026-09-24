import React, {Component} from 'react';
import {withRouter} from "react-router";
import PNotify from "pnotify/dist/es/PNotify";
import {
    Row,
    Col,
    Card,
    Form, OverlayTrigger, Tooltip, Button, Modal, Table, Dropdown,

} from 'react-bootstrap';
import moment from "moment";
import $ from 'jquery';
import crypt from "node-cryptex";
import {Link} from "react-router-dom";
import DEMO from "../../../../store/constant";
import TitleModule from "../../../TitleModule";
import app from "../../../Constants";
import axios from "axios";
import component from "../../../Component";
import Swal from "sweetalert2";
import AddCircle from "@material-ui/icons/AddCircle";
import Close from "@material-ui/icons/Close";
import Cycle from "../Components/Cycle";
import Cost from "../Components/Cost";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import DoneAll from "@material-ui/icons/DoneAll";
import Course from "../Components/Course";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

class StudyPlan extends Component {

    state = {
        activity: "Admisión",
        organicUnit: info.role ? info.role.id_organic_unit : null,
        programID: "",
        plan: "",
        titleModule: "",

        planModal: false,
        actionPlan: "add",
        planMask: "",
        planForm: false,
        titleFormPlan: "",
        plans: [],
        plansLoader: true,

    };

    componentDidMount() {
        const programID = atob(this.props.match.params.id);
        console.log(programID)
        this.listPlanByProgramID(programID);
        this.getAcademicPeriod();
        this.setState({programID: programID});
    };

    async getAcademicPeriod() {
        this.setState({loaderAcademicPeriod: true});
        const url = app.general + '/' + app.academicPeriod;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({academicPeriods: res.data});

            this.setState({loaderAcademicPeriod: false})


        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Periodos Academicos", delay: 2000});
            console.log(err)

        }

    };

    async destroyPlan(id) {
        try {
            this.setState({plansLoader: true});
            const url = app.programs + '/' + app.plan + '/' + id;
            const res = await axios.delete(url, app.headers);


            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({plansLoader: false});
            this.listPlanByProgramID(this.state.programID);
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({plansLoader: false});
            return false;
        }
    };

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

    async createPlan() {
        this.setState({plansLoader: true});

        const {programID, academicPeriod, codePlan, totalPeriod, creditElective, creditRequired, descriptionPlan} = this.state;

        if (programID !== "" && academicPeriod !== "" && codePlan !== "" && totalPeriod !== "" && creditElective !== "" && creditRequired !== "" && descriptionPlan !== "") {

            const url = app.programs + '/' + app.plan;
            let data = new FormData();


            data.set("id_program", programID);
            data.set("id_academic_period", academicPeriod);
            data.set("code", codePlan);
            data.set("cant_period", totalPeriod);

            data.set("credit_elective", creditElective);
            data.set("credit_required", creditRequired);
            data.set("description", descriptionPlan);
            data.set("cycles", crypt.encrypt(JSON.stringify(this.Cycle.returnCycle()), k, v));


            try {

                const res = await axios.post(url, data, app.headers);


                this.listPlanByProgramID(this.state.programID);
                this.closeFormPlan();
                this.setState({plansLoader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                console.log(err)
                this.setState({plansLoader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({plansLoader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updatePlan() {
        this.setState({plansLoader: true});
        const {academicPeriod, totalPeriod, creditElective, codePlan, creditRequired, descriptionPlan} = this.state;


        if (academicPeriod !== "" && totalPeriod !== "" && codePlan !== "" && creditElective !== "" && creditRequired !== "" && descriptionPlan !== "") {

            const url = app.programs + '/' + app.plan + '/' + this.state.actualPlanID;
            let data = new FormData();

            data.set("id_academic_period", academicPeriod);
            data.set("cant_period", totalPeriod);
            data.set("credit_elective", creditElective);
            data.set("code", codePlan);
            data.set("state", true);
            data.set("credit_required", creditRequired);
            data.set("description", descriptionPlan);
            data.set("cycles", crypt.encrypt(JSON.stringify(this.Cycle.returnCycle()), k, v));
            data.set("costs", crypt.encrypt(JSON.stringify(this.Cost.returnCost()), k, v));

            try {

                const res = await axios.patch(url, data, app.headers);
                this.listPlanByProgramID(this.state.program);
                this.closeFormProgram();
                this.setState({plansLoader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                console.log(err)
                this.setState({plansLoader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({plansLoader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                this.setState({denomination: event.target.value.replace(/[^0-9A-Za-záéíóúüÁÉÍÓÚÜ ]/g, '')});
                break;
            case 'organicUnitOrigin':
                this.setState({organicUnitOrigin: event.target.value});
                break;

            case 'academicPeriod':
                this.setState({academicPeriod: event.target.value});
                break;
            case 'description':
                this.setState({description: event.target.value});
                break;

            case 'academicDegree':
                this.setState({academicDegree: event.target.value});
                break;
            case 'code':
                let code = event.target.value.replace(/[^0-9A-Za-z]/g, '');
                this.setState({code: code.slice(0, 6).toUpperCase()});
                break;


            case 'program':
                // let program = event.target.childNodes[event.target.value].getAttribute('data-program') || '';
                if (event.target.value !== 'false') {
                    let program = $('#program-' + event.target.value).attr('data-program');
                    let organic = $('#program-' + event.target.value).attr('data-organic-unit');
                    this.setState({program: event.target.value, programMask: program, programOrganicMask: organic, plan: ""});
                    this.listPlanByProgramID(event.target.value);

                }
                break;

            case 'plan':
                if (event.target.value !== "false") {
                    let plan = $('#plan-' + event.target.value).attr('data-plan');
                    this.setState({plan: event.target.value, planMask: plan});
                }

                break;
            case 'descriptionPlan':
                this.setState({descriptionPlan: event.target.value.replace(/[^0-9A-Za-záéíóúüÁÉÍÓÚÜ ]/g, '')});
                break;
            case 'codePlan':

                let codePlan = event.target.value.replace(/[^0-9A-Za-z]/g, '');
                this.setState({codePlan: codePlan.slice(0, 6).toUpperCase()});
                break;
            case 'totalPeriod':
                let totalPeriod = event.target.value.replace(/[^0-9]/g, '');
                this.setState({totalPeriod: totalPeriod.slice(0, 2)});
                break;
            case 'creditRequired':
                let creditRequired = event.target.value.replace(/[^0-9]/g, '');
                this.setState({creditRequired: creditRequired.slice(0, 2)});
                break;
            case 'creditElective':
                let creditElective = event.target.value.replace(/[^0-9]/g, '');
                this.setState({creditElective: creditElective.slice(0, 2)});
                break;


            case 'documentType':
                this.setState({documentType: event.target.value});
                break;
            case 'descriptionDocument':
                this.setState({descriptionDocument: event.target.value});
                break;
            default:
                break;
        }
    };
    openModalPlan = () => {
        this.setState({
            planModal: true,
            actionPlan: "add",
            plan: ""
        })
    };
    closeModalProgram = () => {
        this.closeFormProgram();
        this.setState({programModal: false})
    };
    closeModalPlan = () => {
        this.closeFormPlan();
        this.setState({
            planModal: false,

        })
    };
    openFormPlan = () => {
        this.setState({
            planForm: true,
            actionPlan: "add",
            titleFormPlan: "Nuevo",
        })
    };
    deleteSweetPlan = (id, state) => {
        Swal.fire({
            icon: 'warning',
            title: state ? 'Inhabilitar Plan' : 'Habilitar Plan',
            text: state ? 'No podra gestionar datos de este plan' : 'Gestionar datos del plan',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: state ? 'Si, Inhabilitar' : 'Si, Habilitar',
        }).then((result) => {
            if (result.value) {
                this.destroyPlan(id);
            }
        })

    };
    closeFormPlan = () => {
        this.setState({
            planForm: false,
            action: "add",
            titleFormPlan: "",
            actualPlanID: "",
            descriptionPlan: "",


            academicPeriod: "",
            codePlan: "",
            totalPeriod: "",

            creditElective: "",
            creditRequired: "",

        })
    }
    retrivePlan = (r) => {

        this.setState({
            actionPlan: "update",
            titleFormPlan: "Editar",
            planForm: true,
            actualPlanID: r.id,

            academicPeriod: r.id_academic_period,

            codePlan: r.code,
            totalPeriod: r.cant_period,
            descriptionPlan: r.description,
            creditElective: r.credit_elective,
            creditRequired: r.credit_required,


        });
    };
    validPlan = (id) => {
        let plans = [];
        plans = this.state.plans;
        for (let i = 0; i < plans.length; i++) {
            if (plans[i].id === id) {
                plans[i].valid = !plans[i].valid;
            } else {
                plans[i].valid = false;
            }
        }

        return plans

    };
    updateProgramCourseForCycle = () => {
        this.Course.getCycleCurse(this.state.program);
    };

    render() {


        const {titleModule, plansLoader} = this.state;
        const {programModal, documentModal, documentTypes, descriptionDocument, planModal, documentType, fileName, planMask, planForm, titleFormPlan, programForm, actionPlan, descriptionPlan, titleFormProgram, programMask, programOrganicMask} = this.state;
        const {organicUnit, action, titleModalDocument, programDocuments} = this.state;
        const {programs, academicDegrees, plan, academicPeriods, unitOrganitOrigins, plans} = this.state;
        const {denomination, program, academicDegree, code, codePlan, academicPeriod, totalPeriod, organicUnitOrigin, creditElective, creditRequired, description} = this.state;

        let totalRegistration = 0;
        return (
            <>

                <TitleModule
                    actualTitle={titleModule}
                    actualModule={"PLANES DE ESTUDIO"}
                    fatherModuleUrl={"/programs"} fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />

                <Row>
                    <Col xs={12} sm={12} md={12} xl={12} lg={12}>
                        <Card>
                            <Card.Header className="bg-linkedin order-card"
                                         style={{paddingBottom: "4px", paddingTop: "4px"}}>
                                <OverlayTrigger
                                    overlay={<Tooltip>Planes de estudio</Tooltip>}>
                                    <Button className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                            onClick={() => this.openModalPlan()}
                                            style={{
                                                backgroundColor: '#4680ff',
                                                border: 'none',
                                            }}>
                                        <i className="material-icons">add</i>
                                    </Button>
                                </OverlayTrigger>
                                <div className="d-inline-block">
                                    <h4 className="text-white" style={{paddingTop: "8px"}}>PLANES DE ESTUDIO</h4>


                                </div>

                                <i className="feather icon-bookmark card-icon"/>
                            </Card.Header>

                            <Card.Body style={{marginBottom: "-25px", marginTop: "-19px"}}>

                                <Row>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                        <Form.Group className="form-group fill">
                                            {this.state.plansLoader && component.spiner}
                                            <Form.Control as="select"
                                                          id="program"

                                                          value={plan}
                                                          onChange={this.handleChange('plan')}>
                                                >
                                                <option defaultValue={true} hidden>Por favor seleccione una Programa</option>
                                                {
                                                    plans.length > 0 ?
                                                        plans.map((r, index) => {
                                                            if (r.state) {
                                                                return (
                                                                    <option
                                                                        id={'plan-' + r.id} value={r.id} data-plan={r.description}
                                                                        key={r.id}>
                                                                        {r.description}
                                                                    </option>
                                                                )
                                                            } else {
                                                                return null
                                                            }
                                                        }) :
                                                        <option value={false}>Aun no ha registrado datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>

                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    {
                        this.state.plan &&
                        <Col xs={12} sm={12} md={12} xl={12} lg={12}>
                            <Row>

                                <Col xs={12} sm={12} md={8} xl={8} lg={8}>

                                    <Course program={this.state.plan} ref={(ref) => this.Course = ref}/>

                                </Col>
                                <Col xs={12} sm={12} md={4} xl={4} lg={4}>
                                    <Card>
                                        <Card.Header className=" order-card"
                                                     style={{paddingBottom: "4px", paddingTop: "4px"}}>

                                            <h4 style={{paddingTop: "8px"}}>PLAN 2020</h4>


                                        </Card.Header>
                                        <Card.Body className='card-task '>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} xl={12} lg={12}>
                                                    Creditos Electivos : 30
                                                    <hr/>

                                                    Creditos Obligatorios: 30
                                                    <hr/>

                                                    Periodos: 4

                                                    <hr/>
                                                    Actual
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    }
                </Row>
                <Modal show={planModal} size={"xl"} backdrop="static">

                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>PLANES DE ESTUDIO DEL {programMask}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            {!planForm &&
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Nuevo plan</Tooltip>}>
                                <AddCircle style={{color: "white"}} onClick={() => this.openFormPlan()}/>

                            </OverlayTrigger>
                            }
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}} onClick={() => this.closeModalPlan()}/>

                            </OverlayTrigger>

                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        {planForm ?
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <h5 className="mb-3 mt-1">{titleFormPlan} plan de estudio</h5>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Nombre del plan <small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={descriptionPlan}
                                            onKeyPress={this.handleKeyPress}
                                            onChange={this.handleChange('descriptionPlan')}
                                            placeholder="Nombre del plan"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Periodo Academico<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control as="select"
                                                      value={academicPeriod}
                                                      onChange={this.handleChange('academicPeriod')}
                                        >


                                            <option defaultValue={true} hidden>Seleccione</option>
                                            {
                                                academicPeriods.length > 0 ?
                                                    academicPeriods && academicPeriods.map((r, index) =>
                                                        <option value={r.id} key={index}>{r.abbreviation}</option>
                                                    ) :
                                                    <option disabled>No hay registros</option>
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Cantidad total de periodo<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={totalPeriod}

                                            onChange={this.handleChange('totalPeriod')}
                                            placeholder="Cantidad total de periodo"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Codigo<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={codePlan}

                                            onChange={this.handleChange('codePlan')}
                                            placeholder="Codigo"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Creditos electivos<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyPress={this.handleKeyPress}
                                            value={creditElective}
                                            onChange={this.handleChange('creditElective')}
                                            placeholder="Creditos electivos"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Creditos requeridos<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyPress={this.handleKeyPress}
                                            value={creditRequired}
                                            onChange={this.handleChange('creditRequired')}
                                            placeholder="Creditos requeridos"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <Cycle totalPeriod={totalPeriod} program={this.state.actualPlanID}
                                                   updateProgramCourseForCycle={this.updateProgramCourseForCycle}
                                                   ref={(ref) => this.Cycle = ref}/>
                                        </Col>

                                    </Row>

                                </Col>

                                <Col>

                                    {actionPlan === 'add' ?
                                        <Button
                                            className="pull-right"
                                            disabled={this.state.plansLoader}
                                            variant="primary"
                                            onClick={() => this.createPlan()}>
                                            {this.state.plansLoader && component.spin}
                                            Guardar</Button> :

                                        <Button
                                            className="pull-right"
                                            disabled={this.state.plansLoader}
                                            variant="primary"
                                            onClick={() => this.updatePlan()}>
                                            {this.state.plansLoader && component.spin}
                                            Guardar Cambios</Button>
                                    }
                                    <Button
                                        className="pull-right mr-1"
                                        disabled={this.state.plansLoader}
                                        variant="danger"
                                        onClick={() => this.closeFormPlan()}>
                                        Cerrar</Button>
                                </Col>
                            </Row>
                            :
                            <Row style={{marginTop: "-20px"}}>
                                <Table responsive hover>
                                    <thead>
                                    <tr>
                                        <th>LISTADO</th>
                                        <th>ESTADO</th>
                                        <th>ACTUAL</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                    </thead>
                                    {this.state.plansLoader && component.spiner}
                                    <tbody>
                                    {plans.length > 0
                                        ?
                                        plans.map((r, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div className="d-inline-block align-middle">
                                                            <div className="d-inline-block">
                                                                <h6 className="m-b-0" style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}> {r.description}</h6>
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td>
                                                        {r.state ?
                                                            <span className="badge badge-primary inline-block">Habilitado</span> :
                                                            <span className="badge badge-danger inline-block">Inhabilitado</span>}
                                                    </td>

                                                    <td>
                                                        <div className="custom-control custom-switch">

                                                            <input type="checkbox"
                                                                   className="custom-control-input"
                                                                   onClick={() => this.updateValidPlan(r.id)}
                                                                   checked={r.valid}
                                                                   value={r.valid}
                                                                   id={"customSwitch" + r.id}/><label
                                                            className="custom-control-label" htmlFor={"customSwitch" + r.id}>{r.valid ? "SI" : "NO"}</label></div>
                                                    </td>
                                                    <td>

                                                        {
                                                            r.state ?
                                                                <>
                                                                    <OverlayTrigger
                                                                        overlay={<Tooltip style={{zIndex: 100000000}}>Editar</Tooltip>}>
                                                                        <Edit style={{color: "#1d86e0"}} onClick={() => this.retrivePlan(r)}/>

                                                                    </OverlayTrigger>

                                                                    <OverlayTrigger
                                                                        overlay={<Tooltip style={{zIndex: 100000000}}>Inhabilitar</Tooltip>}>
                                                                        <Delete style={{color: "#ff5252"}} onClick={() => this.deleteSweetPlan(r.id, r.state)}/>

                                                                    </OverlayTrigger>


                                                                </>
                                                                :
                                                                <>
                                                                    <OverlayTrigger
                                                                        overlay={<Tooltip style={{zIndex: 100000000}}>Habilitar</Tooltip>}>
                                                                        <DoneAll style={{color: "#1d86e0"}} onClick={() => this.deleteSweetPlan(r.id, r.state)}/>
                                                                    </OverlayTrigger>

                                                                </>
                                                        }


                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td>No se encontraron registros</td>
                                        </tr>
                                    }
                                    </tbody>
                                </Table>
                            </Row>
                        }


                    </Modal.Body>
                </Modal>

            </>


        );
    }
}

export default withRouter(StudyPlan)