import React, {Component} from 'react';
import {withRouter} from "react-router";
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";

import TitleModule from "../../../TitleModule";
import app from "../../../Constants";
import axios from "axios";
import component from "../../../Component";

import DataTable from "./DataTable";
import DocumentForm from "../../../Component/DocumentForm";

moment.locale('es');

class DocumentProgram extends Component {

    state = {

        ORGANIC_UNIT: component.ORGANIC_UNIT,
        programID: "",
        deleteDocumentProgramID: "",

        titleModule: "",
        documentProgramLoader: false,
        formDocumentProgram: false,
        courseForm: false,

        actionPlan: "add",

        titleFormDocumentProgram: "",
        documentPrograms: [],


    };

    async componentDidMount() {
        const programID = atob(this.props.match.params.id);
        this.setState({programID: programID});
        this.listDocumentProgramByProgramID(programID);


    };

    async listDocumentProgramByProgramID(id) {
        this.setState({documentProgramLoader: true})
        const url = app.programs + '/' + app.program + '/' + id + '/document';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                titleModule: res.data.denomination,
                documentPrograms: res.data.Program_documents
            });
            this.setState({documentProgramLoader: false});


        } catch (err) {
            this.setState({documentProgramLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err)
        }
    };





    openFormDocumentProgram = () => {
        this.setState({formDocumentProgram: true});
    };
    updateDocumentProgramID = (id) => {
        this.setState({DocumentProgramID: id});
    };
    retriveDocumentProgram = (r) => {
        this.setState({formDocumentProgram: true, retriveDocumentProgram: r});
    };
    closeFormDocumentProgram = () => {
        this.setState({formDocumentProgram: false, retriveDocumentProgram: "", deleteDocumentProgramID: ""})
    };
    deleteSweetDocumentProgram = (id) => {
        this.setState({deleteDocumentProgramID: id})
    };
    callData = async () => {
        this.listDocumentProgramByProgramID(this.state.programID)
    };

    render() {


        const {titleModule} = this.state;


        return (
            <>

                <TitleModule
                    actualTitle={titleModule}
                    actualModule={"DOCUMENTOS"}
                    fatherModuleUrl={"/programs"} fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />


                <div style={{position: 'relative'}}>
                    {this.state.documentProgramLoader && component.spiner}
                    <DataTable
                        actualPlan={this.actualPlan}
                        records={this.state.documentPrograms}
                        openFormDocumentProgram={this.openFormDocumentProgram}
                        retriveDocumentProgram={this.retriveDocumentProgram}
                        deleteSweetDocumentProgram={this.deleteSweetDocumentProgram}


                    />
                </div>


                <DocumentForm callData={this.callData}
                              closeFormDocument={this.closeFormDocumentProgram}
                              formDocument={this.state.formDocumentProgram}
                              retriveDocument={this.state.retriveDocumentProgram}
                              deleteDocumentID={this.state.deleteDocumentProgramID}
                              belognsID={this.state.programID}
                              tableName={"Program_document"}

                />

            </>


        );
    }
}

export default withRouter(DocumentProgram)