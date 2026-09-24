import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import Add from '@material-ui/icons/Add'

import {

    Col,

    OverlayTrigger,
    Row,

    Tooltip
} from 'react-bootstrap';

import app from '../../../../Constants';
import component from '../../../../Component';
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import TitleModule from "../../../../TitleModule";



import DataTableRegistration from "./DataTableRegistration";

import FormAcademicRecord from "./Form";



moment.locale('es');


class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,
            action: "",
            titleModule: "",
            titleProgram: "",

            formRegistration: false,
            registrationDataLoader: false,

            studentID: "",
            admissionPlanID: "",
            studyPlanID: "",
            retriveRegistration: "",
            deleteRegistrationID: "",
            leaveRegistrationID: "",
            PERSONID: "",
            plans: [],
            admissionPlan: [],
            registrations: [],
        };

    }

    async componentDidMount() {

        const studentID = atob(this.props.match.params.id);
        this.setState({studentID: studentID});
        this.retrieveStudent(studentID);
        this.listRegistrationCourseStudent(studentID);
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

    async listRegistrationCourseStudent(id_student) {
        this.setState({registrationDataLoader: true});
        const url = app.registration + '/' + app.registrations + '/' + id_student + '/' + app.registrationCourse;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                this.setState({registrations: res.data})
            } else {
                this.setState({registrations: []})
            }
            this.setState({registrationDataLoader: false});
        } catch (err) {
            this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listPlanBystudentID(id) {
        this.setState({plansLoader: true})
        const url = app.programs + '/' + app.program + '/' + id + '/study-plan';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                titleModule: "CARLOS PAREDES ROJAS / 70236954",
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

    openForm = () => {
        this.setState({formRegistration: true, action: "add"});
    };

    retriveDataRegistration = (r) => {

        this.setState({formRegistration: true, retriveRegistration: r, action: "update"});
    };
    closeFormRegistration = () => {
        this.setState({
            formRegistration: false,
            retriveRegistration: "",
            deleteRegistrationID: "",
            leaveRegistrationID: "",
            action: ""
        })
    };
    deleteSweetRegistration = (id) => {
        this.setState({deleteRegistrationID: id})
    };
    leaveDataRegistration = (id) => {
        this.setState({leaveRegistrationID: id})
    };
    callData = async () => {
        this.listRegistrationCourseStudent(this.state.studentID)
    };

    render() {


        const {titleProgram} = this.state;

        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"MATRÍCULA"}
                    fatherModuleUrl={"/student-list/" + btoa(this.state.admissionPlanID)}
                    fatherModuleTitle={"ESTUDIANTES"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className='filter-bar'>

                        <nav className="navbar m-b-30 p-10">
                            <ul className="nav">
                                <li className="nav-item f-text active">
                                    <h5>{titleProgram}</h5>
                                </li>

                            </ul>

                            <div className="nav-item nav-grid f-view">
                                <OverlayTrigger
                                    overlay={<Tooltip>Nuevo</Tooltip>}>
                                    <button style={{marginRight: "8px"}} onClick={() => this.openForm()} type="button"
                                            className="btn-icon btn btn-primary"><Add/></button>

                                </OverlayTrigger>

                            </div>
                        </nav>


                    </Col>
                    {this.state.registrations.length > 0 ?
                        this.state.registrations.map((r, i) => {
                            return (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} key={i}>
                                    <div style={{position: 'relative'}}>
                                        {this.state.registrationDataLoader && component.spiner}
                                        <DataTableRegistration
                                            records={r}
                                            optionEdit={i === 0 ? true : false}
                                            retriveDataRegistration={this.retriveDataRegistration}
                                            leaveDataRegistration={this.leaveDataRegistration}
                                            deleteSweetRegistration={this.deleteSweetRegistration}
                                        />
                                    </div>
                                    <br/>
                                </Col>
                            )
                        }) :
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div role="alert" className="fade alert alert-primary alert-dismissible show">
                                No se encontraron registros. Click en el boton (+), para registrar una nueva matricula
                            </div>
                        </Col>
                    }

                </Row>

                <FormAcademicRecord callData={this.callData}
                                    closeFormRegistration={this.closeFormRegistration}
                                    formRegistration={this.state.formRegistration}
                                    admissionPlanID={this.state.admissionPlanID}
                                    studyPlanID={this.state.studyPlanID}
                                    studentID={this.state.studentID}
                                    titleModule={this.state.titleModule}
                                    retriveRegistration={this.state.retriveRegistration}
                                    action={this.state.action}
                                    deleteRegistrationID={this.state.deleteRegistrationID}
                                    leaveRegistrationID={this.state.leaveRegistrationID}
                                    plans={this.state.plans}

                />


            </>
        )
    }

}

export default withRouter(Registration)
