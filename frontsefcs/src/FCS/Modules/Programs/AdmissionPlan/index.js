import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';

import app from '../../../Constants';
import component from '../../../Component';
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import TitleModule from "../../../TitleModule";
import DataTable from "./DataTable";
import FormAdmissionPlan from "./FormAdmissionPlan/formAdmissionPlan";


moment.locale('es');


class AdmissionPlan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,

            titleModule: "",

            formAdmissionPlan: false,
            admissionPlanLoader: false,

            programID: "",
            AdmissionPlanID: "",
            retriveWorkPlan: "",
            deleteAdmissionPlanID: "",

            plans: [],
            admissionPlan: [],
        };

    }

    async componentDidMount() {
        const programID = atob(this.props.match.params.id);
        this.setState({programID: programID});
        this.listAdmissionPlanByProgram(programID);
        this.listPlanByProgramID(programID);
    }


    async listAdmissionPlanByProgram(id) {
        this.setState({admissionPlanLoader: true});
        const url = app.programs + '/' + app.admissionPlan + '/' + app.program + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({admissionPlan: res.data});
            this.setState({admissionPlanLoader: false});
        } catch (err) {
            this.setState({admissionPlanLoader: false});
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

    openFormAdmissionPlan = () => {
        this.setState({formAdmissionPlan: true});
    };
    updateAdmissionPlanID = (id) => {
        this.setState({AdmissionPlanID: id});
    };
    retriveDataAdmissionPlan = (r) => {
        this.setState({formAdmissionPlan: true, retriveAdmissionPlan: r});
    };
    closeFormAdmissionPlan = () => {
        this.setState({formAdmissionPlan: false, retriveAdmissionPlan: "", deleteAdmissionPlanID: ""})
    };
    deleteSweetAdmissionPlan = (id) => {
        this.setState({deleteAdmissionPlanID: id})
    };
    callData = async () => {
        this.listAdmissionPlanByProgram(this.state.programID)
    };

    render() {



        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"PLAN DE ADMISIÓN"}
                    fatherModuleUrl={"/programs"} fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />


                <FormAdmissionPlan callData={this.callData}
                                   closeFormAdmissionPlan={this.closeFormAdmissionPlan}
                                   formAdmissionPlan={this.state.formAdmissionPlan}
                                   retriveAdmissionPlan={this.state.retriveAdmissionPlan}
                                   deleteAdmissionPlanID={this.state.deleteAdmissionPlanID}
                                   plans={this.state.plans}

                />

                <div style={{position: 'relative'}}>
                    {this.state.admissionPlanLoader && component.spiner}
                    <DataTable
                        records={this.state.admissionPlan}
                        openFormAdmissionPlan={this.openFormAdmissionPlan}
                        retriveDataAdmissionPlan={this.retriveDataAdmissionPlan}
                        deleteSweetAdmissionPlan={this.deleteSweetAdmissionPlan}

                    />
                </div>


            </>
        );
    }
}

export default withRouter(AdmissionPlan)