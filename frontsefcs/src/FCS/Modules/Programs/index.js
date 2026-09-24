import React, {Component} from 'react';
import axios from 'axios';

import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";


import moment from "moment";
import TitleModule from "../../TitleModule";
import DataTable from "./DataTable";
import ProgramForm from "./FormProgram";


moment.locale('es');


export default class Programs extends Component {
    state = {
        organicUnit: component.ORGANIC_UNIT,

        isOpen: false,
        programModal: false,
        programForm: false,
        documentModal: false,
        loaderAcademicDegree: false,

        retriveData: "",
        deleteID: "",

        action: 'add',
        programMask: "",
        programOrganicMask: "",
        titleFormProgram: "NUEVO",
        denomination: "",
        program: "",
        academicDegree: "",
        code: "",
        academicPeriod: "",
        totalPeriod: "",
        organicUnitOrigin: "",
        creditElective: "",
        creditRequired: "",
        description: "",
        descriptionDocument: "",


        programs: [],
        academicDegrees: [],
        academicPeriods: [],
        unitOrganitOrigins: [],
        documetTypes: [],

        documentTypes: [],
        planModal: false,
        actionPlan: "add",
        actionProgramDocument: "add",
        planMask: "",
        planForm: false,
        titleFormPlan: "",
        fileName: "",
        programCodeDocument: "",
        programDocumentID: "",
        plans: [],
        programDocuments: [],
        organicUnits: [],
        //loaders
        programsLoader: true,
        plansLoader: true,
        programDocumentsLoader: true,
        onlineProgramLoder: false,


    };

    async componentDidMount() {
        if (component.ORGANIC_UNIT !== "") {
            this.listProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
        } else {
            this.listProgramGOD();
        }
    }

    async listProgramByOrganicUnitRegisterID(id) {
        this.setState({programsLoader: true});
        const url = app.programs + '/' + app.program + '/' + app.organicUnit + '-register/' + id;
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

    async listProgramGOD() {
        this.setState({programsLoader: true});
        const url = app.programs + '/' + app.program + '/all/g';
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


    openForm = () => {
        this.setState({programModal: true});
    };
    retriveData = (r) => {
        this.setState({retriveData: r});
    };
    deleteSweetProgram = (id) => {
        this.setState({deleteID: id});
    };

    closeForm = () => {
        this.setState({programModal: false, retriveData: "", deleteID: ""});
    };

    callData = async () => {
        if (component.ORGANIC_UNIT !== "") {
            this.listProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
        } else {
            this.listProgramGOD();
        }
    };

    render() {


        const {programs} = this.state;



        return (

            <>
                <TitleModule
                    actualTitle={"PROGRAMAS"}
                    actualModule={"PROGRAMAS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />

                <div style={{position: 'relative'}}>
                    {this.state.programsLoader && component.spiner}
                    <DataTable
                        records={programs}
                        openForm={this.openForm}
                        retriveData={this.retriveData}
                        deleteSweetProgram={this.deleteSweetProgram}
                        openModalDocument={this.openModalDocument}
                    />
                </div>


                <ProgramForm
                    programModal={this.state.programModal}
                    retriveData={this.state.retriveData}
                    deleteID={this.state.deleteID}
                    route={"student"}
                    closeForm={this.closeForm}
                    callData={this.callData}
                />

            </>


        );
    }
}
