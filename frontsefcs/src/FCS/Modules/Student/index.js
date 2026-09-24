import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import $ from 'jquery';
import DataTable from "./DataTable";
import StudentForm from "./Form";
import {Card, Col, Form, Row} from "react-bootstrap";

import Select from "react-select";


moment.locale('es');

class Student extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        studentLoader: false,
        deleteStudentID: "",
        organicUnit: "",
        admissionPlan: "",
        studyPlanMask: "",
        retriveData: "",
        students: [],
        programs: [],
        organicUnits: [],
        admissionPlans: [],
    };

    async componentDidMount() {

        const admissionID = atob(this.props.match.params.ida);
        this.getUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.listSimpleProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
            this.setState({organicUnit: {value: component.ORGANIC_UNIT}})
        }
        if (admissionID !== "" && admissionID !== '0') {
            this.retriveAdmissionPlanByID(admissionID);
            this.listStudentAdmissionProgram(admissionID);
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

    async listAdmissionPlanByProgramIDS(id_program) {
        this.setState({admissionPlanLoader: true});
        const url = app.programs + '/' + app.admissionPlan + '/' + app.program + '/' + id_program + '/s';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({admissionPlans: res.data});
            }
            this.setState({admissionPlanLoader: false});
        } catch (err) {
            this.setState({admissionPlanLoader: false});
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

    async retriveAdmissionPlanByID(id_admission_plan) {
        const url = app.programs + '/' + app.admissionPlan + '/cost/program/' + id_admission_plan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.listSimpleProgramByOrganicUnitRegisterID(res.data.Program.Organic_unit_register.id);
                this.listAdmissionPlanByProgramIDS(res.data.id_program);
                this.setState({
                    organicUnit: {
                        value: res.data.Program.Organic_unit_register.id,
                        label: res.data.Program.Organic_unit_register.denomination + " " + res.data.Program.Organic_unit_register.Campu.denomination
                    },
                    program: res.data.id_program,
                    admissionPlan: id_admission_plan,
                    studyPlan: res.data.id_plan,
                    process: res.data.id_process,
                    // processMask: res.data.id_process,
                    studyPlanMask: res.data.Plan.description,

                })
            }
            // this.setState({studentLoader: false});
        } catch (err) {
            // this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async listStudentAdmissionProgram(id_admission_plan) {
        this.setState({studentLoader: true});
        const url = app.person + '/' + app.student + '/program/' + app.admissionPlan + '/' + id_admission_plan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({students: res.data});
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };


    handleChange = field => event => {
        switch (field) {
            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case 'program':
                let programMask = $('#programmask-' + event.target.value).attr('dataprogrammask');
                console.log(programMask)
                this.setState({
                    programMask: programMask,
                    program: event.target.value,
                    studyPlan: "",
                    admissionPlan: "",
                    costAdmission: "",
                    concept: ""
                });
                this.listAdmissionPlanByProgramIDS(event.target.value)
                this.listWorkPlanByProgramIDS(event.target.value)
                break;
            case 'admissionPlan':
                let studyPlan = $('#admissionPlan-' + event.target.value).attr('datastudyplan');
                let process = $('#admissionPlan-' + event.target.value).attr('dataprocess');
                let studyPlanMask = $('#admissionPlan-' + event.target.value).attr('datastudyplanmask');
                this.setState({
                    admissionPlan: event.target.value,
                    studyPlan: studyPlan,
                    process: process,
                    studyPlanMask: studyPlanMask
                });

                this.listStudentAdmissionProgram(event.target.value);
                break;
            case 'costAdmission':
                let concept = $('#concept-' + event.target.value).attr('data-concept-id');
                this.setState({costAdmission: event.target.value, concept: concept});
                break;


            default:
                break;
        }
    };
    openForm = () => {
        this.setState({form: true})
    };
    closeForm = () => {
        this.setState({form: false, retriveData: "", optionDelete: ""})
    };
    callData = () => {
        this.listStudentAdmissionProgram(this.state.admissionPlan);
    };
    retriveStudent = async (r) => {
        this.openForm();
        this.setState({retriveData: r});
    };
    deleteStudentsweet = async (deleteStudentID) => {
        this.setState({deleteStudentID: deleteStudentID});

    };

    render() {

        const {
            admissionPlan, admissionPlans
        } = this.state;
        const {program} = this.state;
        // estado del modo dios
        const {organicUnits, organicUnit, programs} = this.state;
        const {studyPlanMask} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={"ESTUDIANTES"}
                    actualModule={"ESTUDIANTES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Card style={{marginBottom: "5px"}}>
                    <Card.Header>
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
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={program === "" ? {color: "#ff5252 "} : null}
                                    >Programa<small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={program}
                                                  onChange={this.handleChange('program')}
                                    >

                                        <option defaultValue={true} hidden>Programa</option>
                                        {
                                            programs.length > 0 ?
                                                programs.map((r, k) => {

                                                        return (<option id={"programmask-" + r.id}
                                                                        dataprogrammask={r.denomination }
                                                                        value={r.id} key={k}> {r.denomination} </option>)

                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={admissionPlan === "" ? {color: "#ff5252 "} : null}
                                    >Plan de admision<small className="text-danger"> *</small></Form.Label>

                                    {this.state.admissionPlanLoader ?
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/> :
                                        <Form.Control as="select"
                                                      value={admissionPlan}
                                                      onChange={this.handleChange('admissionPlan')}
                                        >
                                            >
                                            <option defaultValue={true} hidden>Plan de admision</option>
                                            {
                                                admissionPlans.length > 0 ?
                                                    admissionPlans.map((r, k) =>
                                                        <option id={"admissionPlan-" + r.id} datastudyplan={r.id_plan}
                                                                dataprocess={r.id_process}
                                                                datastudyplanmask={r.Plan.description} value={r.id}
                                                                key={k}> {r.description} </option>
                                                    ) :
                                                    <option value={false} disabled>No se encontraron datos</option>
                                            }
                                        </Form.Control>
                                    }
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={studyPlanMask === "" ? {color: "#ff5252 "} : null}
                                    >Plande de estudio <small className="text-danger"> *</small></Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="Plan de estudio"
                                        id="studyPlanMask"
                                        value={studyPlanMask}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Header>
                </Card>
                <div style={{position: 'relative'}}>
                    {this.state.studentLoader && component.spiner}
                    {admissionPlan !== "" &&
                    <DataTable
                        records={this.state.students}
                        programMask={this.state.programMask}
                        openForm={this.openForm}
                        retriveStudent={this.retriveStudent}
                        deleteStudentsweet={this.deleteStudentsweet}
                    />
                    }
                </div>

                <StudentForm
                    formModal={this.state.form}
                    retriveData={this.state.retriveData}
                    deleteStudentID={this.state.deleteStudentID}
                    admissionPlanID={this.state.admissionPlan}
                    programID={this.state.program}

                    studyPlanID={this.state.studyPlan}
                    process={this.state.process}
                    organicUnitID={this.state.organicUnit.value}
                    closeForm={this.closeForm}
                    callData={this.callData}
                />

            </>
        );
    }
}

export default Student;
