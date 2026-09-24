import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';

import { Card, Col,Row} from 'react-bootstrap';

import app from '../../../../Constants';
import component from '../../../../Component';
import PNotify from "pnotify/dist/es/PNotify";


import moment from "moment";
import TitleModule from "../../../../TitleModule";


import Entry from "./Entry";


moment.locale('es');


class CostAdmission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            organicUnit: component.ORGANIC_UNIT,

            titleModule: "",

            admissionPlan: false,
            workPlanLoader: false,

            programID: "",
            admissionPlanID: "",
            studyPlanID: "",
            retriveAdmissionPlan: "",
            deleteAdmissionPlanID: "",

            admissionPlanMask: "",
            studyPlanMask: "",
            numberStudentMaks: "",
            processMask: "",
            academicCalendarMask: "",
            durationMask: "",

            workPlans: [],
        };

    }

    async componentDidMount() {
        const admissionPlanID = atob(this.props.match.params.id);

        this.setState({admissionPlanID: admissionPlanID});
        this.listAdmissionPlanByID(admissionPlanID);


    }

    async listAdmissionPlanByID(id) {
        this.setState({loaderWorkPlan: true});
        const url = app.programs + '/' + app.admissionPlan + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                let diffDuration = moment.duration(moment(res.data.date_start).diff(moment(res.data.date_end)));


                let day = diffDuration.days() * -1;
                let mounth = diffDuration.months() * -1;
                let year = diffDuration.years() * -1;

                let totalDays = (year * 12 * 30.4167) + (mounth * 30.4167) + day;

                const totalYears = Math.trunc(totalDays / 365);
                const totalMonths = Math.trunc((totalDays % 365) / 30);
                let durationMask = totalYears * 12 + totalMonths


                this.setState({
                    titleModule: res.data.Program.denomination,
                    programID: res.data.id_program,
                    admissionPlanMask: res.data.description,
                    studyPlanMask: res.data.Plan.description,
                    studyPlanID: res.data.id_plan,
                    numberStudentMaks: res.data.number_student,
                    processMask: res.data.Process.denomination,
                    academicCalendarMask: res.data.Process.Academic_calendar.denomination,
                    durationMask: durationMask
                });
            }
            this.setState({loaderWorkPlan: false});
        } catch (err) {
            this.setState({loaderWorkPlan: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }


    openFormAdmissionPlan = () => {
        this.setState({admissionPlan: true});
    };
    updateAdmissionPlanID = (id) => {
        this.setState({admissionPlanID: id});
    };
    retriveDataAdmissionPlan = (r) => {
        this.setState({admissionPlan: true, retriveAdmissionPlan: r});
    };
    closeFormWorPlan = () => {
        this.setState({admissionPlan: false, retriveAdmissionPlan: "", deleteAdmissionPlanID: ""})
    };
    deleteSweetAdmissionPlan = (id) => {
        this.setState({deleteAdmissionPlanID: id})
    };
    callData = async () => {
        this.listAdmissionPlanByProgram(this.state.programID)
    };
    selectedItem = (item) => {
        this.setState({activeTab: item})
    };

    render() {



        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"COSTO DE ADMISIÓN"}
                    fatherModuleUrl={"/programs"} fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={"/programs/" +btoa( this.state.programID ) + "/admission-plan"} fatherModule2Title={"PLANES DE ADMISIÓN"}

                />


                <Card style={{marginBottom: "5px"}}>
                    <Card.Header>

                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <div className="">
                                    <h4>{this.state.admissionPlanMask}</h4>
                                    <p className="text-muted">{this.state.academicCalendarMask} / {this.state.processMask} / {this.state.studyPlanMask.toUpperCase()}</p>


                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6} className="text-right">
                                <div className="row">
                                    <div className="col"><p className="text-muted m-b-5">DURACIÓN TOTAL EN MESES</p><h5>{this.state.durationMask}</h5></div>
                                    <div className="col"><p className="text-muted m-b-5">TOTAL DE ESTUDIANTES</p><h5>{this.state.numberStudentMaks}</h5></div>

                                </div>
                            </Col>
                        </Row>
                    </Card.Header>

                </Card>

                < Entry AdmissionPlanID={this.state.admissionPlanID} numberStudentMaks={this.state.numberStudentMaks}/>



            </>
        );
    }
}

export default withRouter(CostAdmission)