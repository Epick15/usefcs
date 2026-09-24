import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';

import app from '../../../Constants';
import component from '../../../Component';
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import TitleModule from "../../../TitleModule";
import DataTable from "./DataTable";
import FormWorkPlan from "./FormWorkPlan/formWorkPlan";


moment.locale('es');


class WorkPlan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,

            titleModule: "",

            formWorkPlan: false,
            workPlanLoader: false,

            programID: "",
            workPlanID: "",
            retriveWorkPlan: "",
            deleteWorkPlanID: "",

            plans: [],
            workPlans: [],
        };

    }

    async componentDidMount() {
        const programID = atob(this.props.match.params.id);
        this.setState({programID: programID});
        this.listWorkPlanByProgram(programID);
        this.listPlanByProgramID(programID);
    }


    async listWorkPlanByProgram(id) {
        this.setState({workPlanLoader: true});
        const url = app.programs + '/' + app.workPlan + '/' + app.program + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({workPlans: res.data});
            this.setState({workPlanLoader: false});
        } catch (err) {
            this.setState({workPlanLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

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

    render() {



        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"PLAN DE TRABAJO"}
                    fatherModuleUrl={"/programs"} fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />


                <FormWorkPlan callData={this.callData}
                              closeFormWorPlan={this.closeFormWorPlan}
                              formWorkPlan={this.state.formWorkPlan}
                              retriveWorkPlan={this.state.retriveWorkPlan}
                              deleteWorkPlanID={this.state.deleteWorkPlanID}
                              plans={this.state.plans}

                />

                <div style={{position: 'relative'}}>
                    {this.state.workPlanLoader && component.spiner}
                    <DataTable
                        records={this.state.workPlans}
                        openFormWorkPlan={this.openFormWorkPlan}
                        retriveDataWorkPlan={this.retriveDataWorkPlan}
                        deleteSweetWorkPlan={this.deleteSweetWorkPlan}

                    />
                </div>


            </>
        );
    }
}

export default withRouter(WorkPlan)