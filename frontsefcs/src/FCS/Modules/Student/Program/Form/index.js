import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';

import {withRouter} from "react-router";
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';
import component from "../../../../Component";
import Select from "react-select";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";

moment.locale('es');


class StudentProgramForm extends React.Component {
    state = {
        personID: atob(this.props.match.params.id),
        retriveData: this.props.retriveData,
        file: '',
        changeImage: false,
        loadImg: false,
        action: "add",

        program: "",
        admissionPlan: "",
        studyPlan: "",
        process: "",
        workPlan: "",
        costAdmission: "",
        concept: "",
        studyPlanMask: "",


        //para el mode god
        organicUnits: [],
        charges: [],
        contractTypes: [],
        programs: [],
        admissionPlans: [],
        workPlans: [],
        costAdmissions: [],

        organicUnit: "",
        voucherCode: "",
        voucherAmount: "",
        voucherDate: "",
        voucherFile: "",
        voucherUrl: "",


    };

    componentDidMount() {
        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});
        this.getUnitOrganic();

        if (component.ORGANIC_UNIT !== "") {
            this.listSimpleProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
        }

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveData !== this.props.retriveData) {
            this.props.retriveData !== "" && this.retriveData(this.props.retriveData);
        }
        if (prevProps.deleteStudentID !== this.props.deleteStudentID) {
            this.props.deleteStudentID !== "" && this.openStudentProgramSweetAlert(this.props.deleteStudentID);
        }
        if (prevProps.formModal !== this.props.formModal) {
            this.setState({formModal: this.props.formModal});
        }


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
                // this.setState({organicUnits: res.data, showOrganicUnit: true})
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


    //obtener persona id persona y unidad organica


    async listAdmissionPlanByProgramIDS(id_program) {
        this.setState({loaderPrograms: true});
        const url = app.programs + '/' + app.admissionPlan + '/' + app.program + '/' + id_program + '/s';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({admissionPlans: res.data});
            }
        } catch (err) {
            console.log(err)
        }
    };

    async listWorkPlanByProgramIDS(id_program) {
        this.setState({loaderPrograms: true});
        const url = app.programs + '/' + app.workPlan + '/' + app.program + '/' + id_program + '/s';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({workPlans: res.data});
            }
        } catch (err) {
            console.log(err)
        }
    };

    async listConceptsInscriptionWeb(id_admission_plan) {
        this.setState({loaderPrograms: true});
        const url = app.general + '/' + app.concepts + '/inscription/' + id_admission_plan + '/web';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({costAdmissions: res.data});
            }
        } catch (err) {
            // PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Grados Academicos", delay: 2000});
            console.log(err)

        }

    };


    async createStudentProgram() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.student;

        const {
            organicUnit, admissionPlan, costAdmission, concept, program, studyPlan, personID, process,

        } = this.state;


        if (organicUnit !== '' && admissionPlan !== '' && costAdmission !== '' && concept !== '' && program !== '' && process !== '' && studyPlan !== ''

        ) {
            let data = new FormData();
            data.set("id_person", personID);
            data.set('id_organic_unit', organicUnit.value);

            data.set('id_admission_plan', admissionPlan);
            data.set('id_cost_admission', costAdmission);
            data.set('id_concept', concept);
            data.set('id_program', program);
            data.set('id_plan', studyPlan);
            data.set('id_process', process);


            try {
                const res = await axios.post(url, data, app.headers);

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData()
                this.closeForm();

            } catch (err) {
                this.setState({loaderPerson: false});
                PNotify.error({title: "Oh no!", text: err.response.data.error, delay: 2000});

            }
        } else {
            this.setState({loaderPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    async updateStudentProgram() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.student + '/' + this.state.studentID;

        const {
            organicUnit,
            admissionPlan,
            costAdmission,
            concept,
            program,
            process,
            studyPlan,

        } = this.state;


        if (organicUnit !== '' && admissionPlan !== '' && costAdmission !== '' && concept !== '' && program !== '' && studyPlan !== '' && process !== ''
        ) {
            let data = new FormData();
            data.set('id_organic_unit', organicUnit.value);

            data.set('id_admission_plan', admissionPlan);
            data.set('id_cost_admission', costAdmission);
            data.set('id_concept', concept);
            data.set('id_program', program);
            data.set('id_plan', studyPlan);
            data.set('id_process', process);


            try {
                const res = await axios.patch(url, data, app.headers);

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData()
                this.closeForm();

            } catch (err) {
                this.setState({loaderPerson: false});
                console.log(err.response.data);
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.error,

                    delay: 3000
                });

            }
        } else {
            this.setState({loaderPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    async destroyStudentProgram(id) {

        try {
            this.setState({loaderDestroyStudentProgram: true});
            const url = app.person + '/' + app.student + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderDestroyStudentProgram: false});
            this.props.callData();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderDestroyStudentProgram: false});
            return false;
        }
    };

    handleChange = field => event => {
        switch (field) {

            case 'documentNumber':
                let documentNumber = event.target.value.replace(/[^0-9]/g, '');
                this.setState({documentNumber: documentNumber.slice(0, 15)});

                break;


            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case 'program':
                this.setState({
                    program: event.target.value,
                    studyPlan: "",
                    process: "",
                    admissionPlan: "",
                    costAdmission: "",
                    concept: "",
                    studyPlanMask: ""
                });
                this.listAdmissionPlanByProgramIDS(event.target.value)
                this.listWorkPlanByProgramIDS(event.target.value)
                break;
            case 'admissionPlan':

                let studyPlan = $('#admissionPlan-' + event.target.value).attr('data-studyPlan');
                let process = $('#admissionPlan-' + event.target.value).attr('data-process');
                let studyPlanMask = $('#admissionPlan-' + event.target.value).attr('data-studyPlanMask');

                this.setState({
                    admissionPlan: event.target.value,
                    studyPlan: studyPlan,
                    process: process,
                    studyPlanMask: studyPlanMask
                });
                this.listConceptsInscriptionWeb(event.target.value);


                break;
            case 'costAdmission':
                let concept = $('#concept-' + event.target.value).attr('data-concept-id');
                this.setState({costAdmission: event.target.value, concept: concept});
                break;


            case 'voucherAmount':
                this.setState({voucherAmount: event.target.value});
                break;
            case 'voucherCode':
                this.setState({voucherCode: event.target.value});
                break;
            case 'voucherDate':
                this.setState({voucherDate: event.target.value});
                break;
            case 'voucherUrl':
                this.setState({voucherUrl: event.target.value});
                break;
            default:
                break;
        }
    };
    retriveData = (r) => {

        console.log(r)
        console.log(r.Payment.id_cost_admission)
        this.listSimpleProgramByOrganicUnitRegisterID(r.id_organic_unit);
        this.listAdmissionPlanByProgramIDS(r.id_program);
        this.listConceptsInscriptionWeb(r.id_admission_plan);
        this.setState({
            action: 'update',
            studentID: r.id,
            organicUnit: {value: r.Organic_unit.id, label: r.Organic_unit.denomination},
            admissionPlan: r.id_admission_plan,
            costAdmission: r.Payment.id_cost_admission,
            concept: r.id_concept,
            program: r.id_program,
            studyPlan: r.id_plan,
            process: r.id_process,
            studyPlanMask: r.Plan.description


        });
    };

    changeVoucher = (event) => {

        const fileExtension = ['jpg', 'png'];
        const input = '#inputVoucher';
        let value = $(input).val().split('.').pop().toLowerCase();
        if ($.inArray(value, fileExtension) === -1) {
            let message = "Por favor use estos formatos: " + fileExtension.join(', ');
            Swal.fire({
                title: 'Complete los datos requeridos ',
                text: message,
                icon: 'info',
                confirmButtonText: 'Ok'
            })
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onload = () => {
                this.setState({

                    voucherFile: file,

                });
            };
            reader.readAsDataURL(file);
        }


    };

    closeForm = () => {
        this.setState({
            action: 'add',
            studentID: '',
            organicUnit: '',
            admissionPlan: '',
            costAdmission: '',
            concept: '',
            program: '',
            studyPlan: '',
            process: '',


        });
        this.props.closeForm();
    };
    openStudentProgramSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyStudentProgram(id) : this.props.closeForm();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    render() {

        const {
            action,
            loaderPerson,
            program,
            studyPlanMask,

            admissionPlan,
            admissionPlans,
            costAdmission,

            costAdmissions,


        } = this.state;


        const {organicUnits, organicUnit, programs} = this.state;

        return (


            <Modal show={this.props.openForm} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR ESTUDIANTE</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}} onClick={() => this.closeForm()}/>

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>


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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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

                                                    return (<option value={r.id} key={k}> {r.denomination} </option>)

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
                                            style={admissionPlan === "" ? {color: "#ff5252 "} : null}
                                >Plan de admision<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={admissionPlan}
                                              onChange={this.handleChange('admissionPlan')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Plan de admision</option>
                                    {
                                        admissionPlans.length > 0 ?
                                            admissionPlans.map((r, k) =>
                                                <option id={"admissionPlan-" + r.id} data-studyPlan={r.id_plan}
                                                        data-process={r.id_process}
                                                        data-studyPlanMask={r.Plan.description} value={r.id}
                                                        key={k}> {r.description} </option>
                                            ) :
                                            <option value={false} disabled>No se encontraron datos</option>
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={studyPlanMask === "" ? {color: "#ff5252 "} : null}
                                >Plande de estudio <small className="text-danger"> *</small></Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Dirección"
                                    id="studyPlanMask"
                                    value={studyPlanMask}
                                    disabled={true}
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={costAdmission === "" ? {color: "#ff5252 "} : null}
                                >Modalidad<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={costAdmission}
                                              onChange={this.handleChange('costAdmission')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Modalidad</option>
                                    {
                                        costAdmissions.length > 0 ?
                                            costAdmissions.map((r, index) => {

                                                return (
                                                    <option
                                                        id={"concept-" + r.id}
                                                        style={{fontSize: "14px"}}
                                                        data-concept={r.Concept.denomination}
                                                        data-concept-id={r.Concept.id}
                                                        data-amount={r.amount}
                                                        key={r.id} value={r.id}>
                                                        {r.Concept.denomination + " - S/." + r.amount}
                                                    </option>
                                                )

                                            }) :
                                            <option value={false}>Aun no ha registrado datos</option>
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>


                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                            {action === 'add' ?
                                <Button
                                    className="pull-right"
                                    disabled={loaderPerson}
                                    variant="primary"

                                    onClick={() => this.createStudentProgram()}>
                                    {loaderPerson &&
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button> :
                                <Button
                                    className="pull-right"
                                    disabled={loaderPerson}
                                    variant="primary"

                                    onClick={() => this.updateStudentProgram()}>
                                    {loaderPerson &&
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


export default withRouter(StudentProgramForm)