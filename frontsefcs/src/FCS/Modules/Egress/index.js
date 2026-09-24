import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";

import {Card, Col, Form, Row} from "react-bootstrap";
import TeacherEgressDataTable from "./DataTable/TeacherEgressDataTable";
import AdministrativeEgressDataTable from "./DataTable/AdministrativeEgressDataTable";
import TeacherEgressForm from "./Form/TeacherEgressForm";
import AdministrativeEgressForm from "./Form/AdministrativeEgressForm";
import MaterialEgressForm from "./Form/MaterialEgressForm";
import MaterialEgressDataTable from "./DataTable/MaterialEgressDataTable";


moment.locale('es');

const loadingComponent = (
    <div style={{
        position: 'absolute',
        zIndex: 110,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.8)'
    }}>
        <span className="spinner-border spinner-border-sm mr-1" role="status"/>
    </div>
);

class Egress extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        organicUnit: '',
        deleteEgressID: '',
        totalEgressByPlan: 0,
        form: false,

        loaderTeacher: false,
        loaderAdministrative: false,
        loaderMaterial: false,

        retriveDataTeacherEgress: '',
        retriveDataAdministrativeEgress: '',
        retriveDataMaterialEgress: '',

        admissionPlan: '',
        organicUnits: [],
        admissionPlans: [],
        TeacherEgresss: [],
        materialEgresss: [],
        administrativeEgresss: [],
        programs: [],


    };

    async componentDidMount() {

        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.listSimpleProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
            this.setState({organicUnit: component.ORGANIC_UNIT})
        }
    }

    async listTeacherEgressByPlan(planID) {
        this.setState({loaderTeacher: true});
        const url = app.accounting + '/' + app.egress + '/teacher/' + app.admissionPlan + '/' + planID;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({TeacherEgresss: res.data});
            } else {
                this.setState({TeacherEgresss: []});
            }
            this.setState({loaderTeacher: false});
        } catch (err) {
            this.setState({loaderTeacher: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)


        }

    }

    async listAdministrativeEgressByPlan(planID) {
        this.setState({loaderAdministrative: true});
        const url = app.accounting + '/' + app.egress + '/administrative/' + app.admissionPlan + '/' + planID;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({administrativeEgresss: res.data});
            } else {
                this.setState({administrativeEgresss: []});
            }
            this.setState({loaderAdministrative: false});
        } catch (err) {
            this.setState({loaderAdministrative: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)


        }

    }

    async listMaterialEgressByPlan(planID) {
        this.setState({loaderMaterial: true});
        const url = app.accounting + '/' + app.egress + '/material/' + app.admissionPlan + '/' + planID;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({materialEgresss: res.data});
            } else {
                this.setState({materialEgresss: []});
            }
            this.setState({loaderMaterial: false});
        } catch (err) {
            this.setState({loaderMaterial: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    async listTotalEgressByPlan(planID) {
        this.setState({loaderEgressByPlan: true});
        const url = app.accounting + '/' + app.egress + '/total/' + app.admissionPlan + '/' + planID;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({totalEgressByPlan: res.data});
            } else {
                this.setState({totalEgressByPlan: 0});
            }
            this.setState({loaderMaterialEgress: false});
        } catch (err) {
            this.setState({loaderMaterialEgress: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }


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

    listUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({organicUnits: res.data})
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

    handleChange = field => event => {
        switch (field) {


            case 'organicUnit':
                this.setState({organicUnit: event.target.value});
                this.listSimpleProgramByOrganicUnitRegisterID(event.target.value);
                break;

            case 'program':
                this.setState({program: event.target.value, admissionPlan: ''});
                this.listAdmissionPlanByProgramIDS(event.target.value)
                break;
            case 'admissionPlan':

                this.setState({
                    admissionPlan: event.target.value
                });
                this.listTotalEgressByPlan(event.target.value)
                this.listTeacherEgressByPlan(event.target.value)
                this.listAdministrativeEgressByPlan(event.target.value)
                this.listMaterialEgressByPlan(event.target.value)
                break;


            default:
                break;
        }
    };

    /* CALL DATA FUNCTIONS*/
    callDataTeacherEgress = () => {

        this.listTeacherEgressByPlan(this.state.admissionPlan);
        this.listTotalEgressByPlan(this.state.admissionPlan);

    };
    callDataAdministrativeEgress = () => {
        this.listAdministrativeEgressByPlan(this.state.admissionPlan);
        this.listTotalEgressByPlan(this.state.admissionPlan);
    };
    callDataMaterialEgress = () => {
        console.log('no se por que entra aqui')
        this.listMaterialEgressByPlan(this.state.admissionPlan);
        this.listTotalEgressByPlan(this.state.admissionPlan);
    };
    /*OPEN MODAL FUNCTIONS*/
    openFormModalTeacherEgress = () => {
        this.setState({
            formModalTeacherEgress: true,
            titleFormModalTeacherEgress: "REGISTRAR EGRESO DOCENTE",
        })
    };
    openFormModalAdministrativeEgress = () => {
        this.setState({
            formModalAdministrativeEgress: true,
            titleFormModalAdministrativeEgress: "REGISTRAR EGRESO ADMINISTRATIVO",
        })
    };
    openFormModalMaterialEgress = () => {
        this.setState({
            formModalMaterialEgress: true,
            titleFormModalMaterialEgress: "REGISTRAR EGRESO MATERIAL",
        })
    };
    /*CLOSE MODAL FUNCTIONS*/
    closeFormModalTeacherEgress = () => {
        this.setState({formModalTeacherEgress: false, retriveDataTeacherEgress: "", deleteTeacherEgress: ""})
    };
    closeFormModalAdministrativeEgress = () => {
        this.setState({
            formModalAdministrativeEgress: false,
            retriveDataAdministrativeEgress: "",
            deleteAdministrativeEgress: ""
        })
    };
    closeFormModalMaterialEgress = () => {
        this.setState({
            formModalMaterialEgress: false,
            retriveDataMaterialEgress: "",
            deleteMaterialEgress: ""
        })
    };
    /*RETRIVE DATA FUNCTIONS*/
    retriveTeacherEgress = (r) => {
        this.openFormModalTeacherEgress();
        this.setState({retriveDataTeacherEgress: r});
    };
    retriveAdministrativeEgress = (r) => {
        this.openFormModalAdministrativeEgress();
        this.setState({retriveDataAdministrativeEgress: r});
    };
    retriveMaterialEgress = (r) => {
        this.openFormModalMaterialEgress();
        this.setState({retriveDataMaterialEgress: r});
    };
    /*SWEETALERT FUNCTIONS*/
    sweetDeleteTeacherEgress = async (deleteEgressID) => {

        this.setState({deleteTeacherEgressID: deleteEgressID});
    };
    sweetDeleteAdministrativeEgress = async (deleteEgressID) => {
        this.setState({deleteAdministrativeEgressID: deleteEgressID});
    };
    sweetDeleteMaterialEgress = async (deleteEgressID) => {
        this.setState({deleteMaterialEgressID: deleteEgressID});
    };

    render() {

        const {
            admissionPlan, admissionPlans
        } = this.state;

        const {program} = this.state;


        // estado del modo dios
        const {organicUnits, organicUnit, programs} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={"EGRESOS"}
                    actualModule={"EGRESOS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />

                <Card style={{marginBottom: "5px"}}>

                    <Card.Header style={{paddingBottom: '0px'}}>
                        <Row>
                            {!component.ORGANIC_UNIT &&
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"

                                        >Unidad Organica<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control as="select"
                                                      value={organicUnit}
                                                      onChange={this.handleChange('organicUnit')}
                                        >
                                            >
                                            <option defaultValue={true} hidden>Unidad</option>
                                            {
                                                organicUnits.length > 0 ?
                                                    organicUnits.map((r, k) => {

                                                            return (<option
                                                                value={r.id}
                                                                key={k}> {r.denomination.toUpperCase() + ' - ' + r.Campu.denomination.toUpperCase()}
                                                            </option>)

                                                        }
                                                    ) :
                                                    <option value={false} disabled>No se encontraron datos</option>
                                            }
                                        </Form.Control>
                                    </Form.Group>

                                    <br/>
                                </Col>}


                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"

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
                                                                        dataprogrammask={r.denomination}
                                                                        value={r.id}
                                                                        key={k}> {r.denomination} </option>)

                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron
                                                    datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">

                                    <Form.Label className="floating-label"

                                    >Plan de admisión<small className="text-danger"> *</small></Form.Label>
                                    {/*{this.state.calendarLoader ?*/}
                                    {/*<span className="spinner-border spinner-border-sm mr-1" role="status"/>*/}
                                    <Form.Control as="select"
                                                  value={admissionPlan}
                                                  onChange={this.handleChange('admissionPlan')}
                                    >

                                        <option defaultValue={true} hidden>
                                            Proceso
                                        </option>
                                        {
                                            admissionPlans.length > 0 ?
                                                admissionPlans.map((r, index) => {


                                                    return (
                                                        <option value={r.id} key={index}
                                                                id={r.id}

                                                        >
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

                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">TOTAL</Form.Label>
                                    <Form.Control
                                        type="number"

                                        value={this.state.totalEgressByPlan}


                                        disabled={true}
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>


                        </Row>

                    </Card.Header>
                </Card>
                {this.state.program !== '' && this.state.admissionPlan !== '' &&
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{position: 'relative'}}>
                                {this.state.loaderTeacher && loadingComponent}
                                <TeacherEgressDataTable records={this.state.TeacherEgresss}
                                                        openFormModalTeacherEgress={this.openFormModalTeacherEgress}
                                                        retriveTeacherEgress={this.retriveTeacherEgress}
                                                        sweetDeleteTeacherEgress={this.sweetDeleteTeacherEgress}/>
                            </div>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop: '10px'}}>
                            <div style={{position: 'relative'}}>
                                {this.state.loaderAdministrative && loadingComponent}
                                <AdministrativeEgressDataTable records={this.state.administrativeEgresss}

                                                               openFormModalAdministrativeEgress={this.openFormModalAdministrativeEgress}
                                                               retriveAdministrativeEgress={this.retriveAdministrativeEgress}
                                                               sweetDeleteAdministrativeEgress={this.sweetDeleteAdministrativeEgress}/>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{marginTop: '10px'}}>
                            <div style={{position: 'relative'}}>
                                {this.state.loaderMaterial && loadingComponent}
                                <MaterialEgressDataTable records={this.state.materialEgresss}

                                                         openFormModalMaterialEgress={this.openFormModalMaterialEgress}
                                                         retriveMaterialEgress={this.retriveMaterialEgress}
                                                         sweetDeleteMaterialEgress={this.sweetDeleteMaterialEgress}
                                />
                            </div>
                        </Col>
                    </Row>
                }
                <TeacherEgressForm
                    organicUnit={this.state.organicUnit}
                    admissionPlan={this.state.admissionPlan}
                    program={this.state.program}

                    callDataTeacherEgress={this.callDataTeacherEgress}
                    closeFormModalTeacherEgress={this.closeFormModalTeacherEgress}

                    formModalTeacherEgress={this.state.formModalTeacherEgress}
                    retriveDataTeacherEgress={this.state.retriveDataTeacherEgress}
                    deleteEgressID={this.state.deleteTeacherEgressID}


                />
                <AdministrativeEgressForm
                    organicUnit={this.state.organicUnit}
                    admissionPlan={this.state.admissionPlan}
                    program={this.state.program}

                    callDataAdministrativeEgress={this.callDataAdministrativeEgress}
                    closeFormModalAdministrativeEgress={this.closeFormModalAdministrativeEgress}

                    formModalAdministrativeEgress={this.state.formModalAdministrativeEgress}
                    retriveDataAdministrativeEgress={this.state.retriveDataAdministrativeEgress}
                    deleteEgressID={this.state.deleteAdministrativeEgressID}

                />
                <MaterialEgressForm
                    organicUnit={this.state.organicUnit}
                    admissionPlan={this.state.admissionPlan}
                    program={this.state.program}

                    callDataMaterialEgress={this.callDataMaterialEgress}
                    closeFormModalMaterialEgress={this.closeFormModalMaterialEgress}

                    formModalMaterialEgress={this.state.formModalMaterialEgress}
                    retriveDataMaterialEgress={this.state.retriveDataMaterialEgress}
                    deleteMaterialEgressID={this.state.deleteMaterialEgressID}
                />
            </>
        )


    }

}

export default Egress;
