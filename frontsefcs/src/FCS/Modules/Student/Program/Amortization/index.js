import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import {

    Card,
    Col,
    Tabs,
    Tab,

    Row,

} from 'react-bootstrap';
import app from '../../../../Constants';
import component from '../../../../Component';
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import TitleModule from "../../../../TitleModule";
import DataTableAmortization from "./DataTableAmortization";
import DataTableVoucher from "./DataTableVoucher";
import FormAcademicRecord from "./Form";


moment.locale('es');


class Amortization extends Component {


    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,

            titleModule: "",

            activeTab: "amortization",
            formAdmissionPlan: false,
            admissionPlanLoader: false,

            programID: "",
            AdmissionPlanID: "",
            retriveWorkPlan: "",
            deleteAdmissionPlanID: "",

            payments: [],
            plans: [],
            admissionPlan: [],
        };

    }

    async componentDidMount() {

        const studentID = atob(this.props.match.params.id);
        this.setState({studentID: studentID});
        this.retrieveStudent(studentID);
        this.listPaymentStudent(studentID);

        // this.listPlanBystudentID(studentID);
    }


    async retrieveStudent(id_student) {
        // this.setState({registrationDataLoader: true});
        const url = app.person + '/' + app.student + '/' + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                titleModule: res.data.Person.name + " / " + res.data.Person.document_number,
                titleProgram: res.data.Program.denomination,
                admissionPlanID: res.data.id_admission_plan,
                studyPlanID: res.data.id_plan,
                PERSONID: res.data.Person.id,
            });
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listPaymentStudent(id_student) {
        // this.setState({registrationDataLoader: true});
        const url = app.accounting + '/' + app.payment + '/' + app.student + '/' + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                payments: res.data
            });
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    selectTab = (select) => {
        console.log(select)
        this.setState({activeTab: select});
    };

    render() {


        const {activeTab} = this.state;

        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"AMORTIZACIONES"}
                    fatherModuleUrl={"/student-list/" + btoa(this.state.admissionPlanID)}
                    fatherModuleTitle={"ESTUDIANTES"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{marginBottom: "5px"}}>
                            <Card.Header>

                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingLeft: "0px"}}>
                                        <nav className="navbar ">
                                            <ul className="nav">
                                                <li className="nav-item f-text active">
                                                    <h5> MAESTRÍA EN CIENCIAS DE LA EDUCACIÓN CON MENCIÓN EN TUTORÍA Y
                                                        ORIENTACIÓN EDUCATIVA</h5>
                                                </li>

                                            </ul>
                                            {/*<div className="nav-item nav-grid f-view">*/}
                                            {/*    <h5>S/. 1650</h5>*/}

                                            {/*</div>*/}
                                        </nav>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Tabs defaultActiveKey="amortization" className="px-20"
                                              onSelect={this.selectTab.bind(this)}>
                                            <Tab eventKey="amortization" title="AMORTIZACIONES">

                                            </Tab>
                                            <Tab eventKey="voucher" title="COMPROBANTES DE PAGO">

                                            </Tab>
                                        </Tabs>

                                    </Col>

                                </Row>

                            </Card.Header>

                        </Card>
                    </Col>
                    {
                        activeTab === "amortization" &&

                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className='filter-bar'>

                            {/*<Card style={{marginBottom: "5px"}}>*/}


                            {/*    <Tabs variant="pills" defaultActiveKey="home" className="" style={{marginLeft: " 0px"}}>*/}
                            {/*        <Tab eventKey="home" title="SEMESTRE 2020 - 1">*/}

                            {/*        </Tab>*/}
                            {/*        <Tab eventKey="profile" title="SEMESTRE 2020 - 2">*/}

                            {/*        </Tab>*/}
                            {/*        <Tab eventKey="contact" title="SEMESTRE 2021 - 1">*/}

                            {/*        </Tab>*/}
                            {/*    </Tabs>*/}


                            {/*</Card>*/}
                            <div style={{position: 'relative'}}>
                                {this.state.admissionPlanLoader && component.spiner}
                                <DataTableAmortization
                                    records={this.state.payments}
                                    openFormAdmissionPlan={this.openFormAdmissionPlan}
                                    retriveDataAdmissionPlan={this.retriveDataAdmissionPlan}
                                    deleteSweetAdmissionPlan={this.deleteSweetAdmissionPlan}

                                />
                            </div>

                        </Col>
                    }

                    {
                        activeTab === "voucher" &&
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className='filter-bar'>


                            <div style={{position: 'relative'}}>
                                {this.state.admissionPlanLoader && component.spiner}
                                <DataTableVoucher
                                    records={[]}
                                    openFormAdmissionPlan={this.openFormAdmissionPlan}
                                    retriveDataAdmissionPlan={this.retriveDataAdmissionPlan}
                                    deleteSweetAdmissionPlan={this.deleteSweetAdmissionPlan}

                                />
                            </div>

                        </Col>
                    }


                </Row>
                <FormAcademicRecord callData={this.callData}
                                    closeFormAdmissionPlan={this.closeFormAdmissionPlan}
                                    formAdmissionPlan={this.state.formAdmissionPlan}
                                    retriveAdmissionPlan={this.state.retriveAdmissionPlan}
                                    deleteAdmissionPlanID={this.state.deleteAdmissionPlanID}
                                    plans={this.state.plans}

                />


            </>
        );
    }
}

export default withRouter(Amortization)