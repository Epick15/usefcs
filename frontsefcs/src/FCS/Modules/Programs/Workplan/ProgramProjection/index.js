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
import Egress from "./Egress";
import UtilityProjected from "./UtilityProjected";

moment.locale('es');


class WorkPlanProjection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 1,
            organicUnit: component.ORGANIC_UNIT,

            titleModule: "",

            formWorkPlan: false,
            workPlanLoader: false,

            programID: "",
            workPlanID: "",
            studyPlanID: "",
            retriveWorkPlan: "",
            deleteWorkPlanID: "",

            workPlanMask: "",
            studyPlanMask: "",
            numberStudentMaks: "",
            processMask: "",
            academicCalendarMask: "",
            durationMask: "",

            workPlans: [],
        };

    }

    async componentDidMount() {
        const workPlanID = atob(this.props.match.params.id);
        this.setState({workPlanID: workPlanID});
        this.listWorkPlanByID(workPlanID);


    }

    async listWorkPlanByID(id) {
        this.setState({loaderWorkPlan: true});
        const url = app.programs + '/' + app.workPlan + '/' + id;
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
                    workPlanMask: res.data.description,
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


    openFormWorkPlan = () => {
        this.setState({formWorkPlan: true});
    };
    updateWorkPlanID = (id) => {
        this.setState({workPlanID: id});
    };
    retriveDataWorkPlan = (r) => {
        this.setState({formWorkPlan: true, retriveWorkPlan: r});
    };
    closeFormWorPlan = () => {
        this.setState({formWorkPlan: false, retriveWorkPlan: "", deleteWorkPlanID: ""})
    };
    deleteSweetWorkPlan = (id) => {
        this.setState({deleteWorkPlanID: id})
    };
    callData = async () => {
        this.listWorkPlanByProgram(this.state.programID)
    };
    selectedItem = (item) => {
        this.setState({activeTab: item})
    };

    render() {


        const {activeTab, form} = this.state;

        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"PLAN DE TRABAJO PROYECTADO"}
                    fatherModuleUrl={"/programs"} fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={"/programs/" + btoa(this.state.programID) + "/work-plan"} fatherModule2Title={"PLANES DE TRABAJO"}

                />


                <Card style={{marginBottom: "5px"}}>
                    <Card.Header>

                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <div className="">
                                    <h4>{this.state.workPlanMask}</h4>
                                    <p className="text-muted">{this.state.academicCalendarMask} / {this.state.processMask} / {this.state.studyPlanMask}</p>


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
                    <Card.Body>
                        <div className="nav nav-pills" role="tablist">

                            <a href={"#"} className={activeTab === 1 ? "nav-link active" : "nav-link"} onClick={() => this.selectedItem(1)}>INGRESOS</a>
                            <a href={"#"} className={activeTab === 2 ? "nav-link active" : "nav-link"} onClick={() => this.selectedItem(2)}>EGRESOS</a>
                            <a href={"#"} className={activeTab === 3 ? "nav-link active" : "nav-link"} onClick={() => this.selectedItem(3)}>UTILIDAD PROYECTADA</a>

                        </div>

                    </Card.Body>
                </Card>
                {/*{activeTab === 1 && <General programID={this.state.programID} updateWorkPlanID={this.updateWorkPlanID} workPlanID={this.state.workPlanID}/>}*/}
                {activeTab === 1 && <Entry workPlanID={this.state.workPlanID} numberStudentMaks={this.state.numberStudentMaks}
                />}
                {activeTab === 2 && <Egress workPlanID={this.state.workPlanID} durationMask={this.state.durationMask} studyPlanID={this.state.studyPlanID}/>}
                {activeTab === 3 && <UtilityProjected workPlanID={this.state.workPlanID}/>}


            </>
        );
    }
}

export default withRouter(WorkPlanProjection)