import React from 'react';
import {Row, Col} from 'react-bootstrap';
import PNotify from "pnotify/dist/es/PNotify";
import AdministrativeDataTable from "./Administrative/administrativeDataTable"
import FormAdministrative from "./Administrative/formAdministrative"
import SpecialComssionDataTable from "./Comission/specialComissionDataTable"
import FormComission from "./Comission/formComission";
import AdmissionComissionDataTable from "./Comission/admissionComissionDataTable"
import TeacherDataTable from "./Teacher/teacherDataTable";
import FormTeacher from "./Teacher/formTeacher";
import MaterialDataTable from "./Material/materialDataTable";
import FormMaterial from "./Material/formEgressMaterial";
import app from "../../../../../Constants";
import axios from "axios";
import component from "../../../../../Component";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formComission: false,
            formAdministrative: false,
            formMaterial: false,
            formTeacher: false,
            loaderComission: false,
            loaderAdministrative: false,
            loaderMaterial: false,
            loaderTeacher: false,
            typeComission: "",
            workPlanID: this.props.workPlanID,
            studyPlanID: this.props.studyPlanID,
            egressAdministratives: [],
            specialComissions: [],
            admisionComissions: [],
            egressTeachers: [],
            egressMaterials: [],
        }
    }

    async componentDidMount() {
        if (this.props.workPlanID) {
            this.listEgressAdministrativeByWorkPlanID(this.props.workPlanID);
            this.listEgressTeacherByWorkPlanID(this.props.workPlanID);
            this.listEgressComissionByWorkPlanID(this.props.workPlanID);

            this.listEgressMaterialByWorkPlanID(this.props.workPlanID);
        }

    }


    async listEgressAdministrativeByWorkPlanID(id) {
        this.setState({loaderAdministrative: true});
        const url = app.programs + '/' + app.egressAdministrative + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({egressAdministratives: res.data});
            this.setState({loaderAdministrative: false});
        } catch (err) {
            this.setState({loaderAdministrative: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    async listEgressComissionByWorkPlanID(id) {
        this.setState({loaderComission: true});
        const url = app.programs + '/' + app.egressComission + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({specialComissions: [], admisionComissions: []});
                res.data.map((record) => {
                    if (record.Concept.denomination === "Pago a la comisión especial") {
                        this.state.specialComissions.push(record);
                    } else {
                        this.state.admisionComissions.push(record);
                    }
                });
                this.setState({loaderComission: false})
            }


            // this.setState({egressComission: res.data});

        } catch (err) {
            this.setState({loaderComission: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    async listEgressTeacherByWorkPlanID(id) {
        this.setState({loaderTeacher: true});
        const url = app.programs + '/' + app.egressTeacher + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({egressTeachers: res.data});
            this.setState({loaderTeacher: false});
        } catch (err) {
            this.setState({loaderTeacher: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    async listEgressMaterialByWorkPlanID(id) {
        this.setState({loaderMaterial: true});
        const url = app.programs + '/' + app.egressMaterial + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({egressMaterials: res.data});
            this.setState({loaderMaterial: false});
        } catch (err) {
            this.setState({loaderMaterial: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    openFormAdministrative = () => {
        this.setState({formAdministrative: true})
    };
    openFormComission = (typeComission) => {

        this.setState({formComission: true, typeComission: typeComission})
    };
    openFormTeacher = () => {
        this.setState({formTeacher: true})
    };
    closeFormAdministrative = () => {
        this.setState({formAdministrative: false, retriveAdministrative: "", deleteAdministrativeID: ""})
    };
    closeFormTeacher = () => {
        console.log("aquiiii");
        this.setState({formTeacher: false, retriveTeacher: "", deleteTeacherID: ""})
    };
    closeFormComission = () => {
        this.setState({formComission: false, retriveComission: "", deleteComissionID: ""})
    };
    retriveAdministrative = (r) => {
        this.setState({retriveAdministrative: r})
    };
    retriveTeacher = (r) => {
        this.setState({retriveTeacher: r})
    };
    retriveComission = (r) => {
        this.setState({retriveComission: r})
    };
    deleteSweetAdministrative = (id) => {
        this.setState({deleteAdministrativeID: id})
    };
    deleteSweetComssion = (id) => {
        this.setState({deleteComissionID: id})
    };
    deleteSweetTeacher = (id) => {
        this.setState({deleteTeacherID: id})
    };
    callDataEgressAdministrative = async () => {
        this.listEgressAdministrativeByWorkPlanID(this.state.workPlanID)
    };
    callDataComission = async () => {
        this.listEgressComissionByWorkPlanID(this.state.workPlanID)
    };
    callDataTeacher = async () => {
        this.listEgressTeacherByWorkPlanID(this.state.workPlanID)
    };

    openFormMaterial = () => {
        this.setState({formEgressMaterial: true})
    };
    closeFormMaterial = () => {
        this.setState({formEgressMaterial: false, retriveMaterial: "", deleteMaterialID: ""})
    };
    retriveMaterial = (r) => {
        this.setState({retriveMaterial: r})
    };
    deleteSweetMaterial = (id) => {
        this.setState({deleteMaterialID: id})
    };
    callDataMaterial = async () => {
        this.listEgressMaterialByWorkPlanID(this.state.workPlanID)
    };

    //****************************************************************


    render() {

        return (

            <Row>
                <Col>
                    <div style={{position: 'relative'}}>
                        {this.state.loaderAdministrative && component.spiner}
                        <AdministrativeDataTable durationMask={this.props.durationMask} openFormAdministrative={this.openFormAdministrative}
                                                 retriveAdministrative={this.retriveAdministrative}
                                                 deleteSweetAdministrative={this.deleteSweetAdministrative} records={this.state.egressAdministratives}/>
                    </div>
                    <br/>
                    <div style={{position: 'relative'}}>
                        {this.state.loaderTeacher && component.spiner}
                        <TeacherDataTable openFormTeacher={this.openFormTeacher} retriveTeacher={this.retriveTeacher} deleteSweetTeacher={this.deleteSweetTeacher}
                                          records={this.state.egressTeachers}/>
                    </div>


                    <br/>

                    <div style={{position: 'relative'}}>
                        {this.state.loaderComission && component.spiner}
                        <SpecialComssionDataTable durationMask={this.props.durationMask}
                                                  openFormComission={this.openFormComission} retriveComission={this.retriveComission} deleteSweetComssion={this.deleteSweetComssion}
                                                  records={this.state.specialComissions}/>
                    </div>


                    <br/>
                    <div style={{position: 'relative'}}>
                        {this.state.loaderComission && component.spiner}
                        <AdmissionComissionDataTable durationMask={this.props.durationMask} openFormComission={this.openFormComission} retriveComission={this.retriveComission}
                                                     deleteSweetComssion={this.deleteSweetComssion}
                                                     records={this.state.admisionComissions}/>
                    </div>

                    <br/>
                    <div style={{position: 'relative'}}>
                        {this.state.loaderMaterial && component.spiner}
                        <MaterialDataTable
                            openFormMaterial={this.openFormMaterial}
                            retriveMaterial={this.retriveMaterial}
                            deleteSweetMaterial={this.deleteSweetMaterial}
                            records={this.state.egressMaterials}
                        />
                    </div>
                    <FormAdministrative durationMask={this.props.durationMask} workPlanID={this.state.workPlanID} formAdministrative={this.state.formAdministrative}
                                        retriveAdministrative={this.state.retriveAdministrative} deleteAdministrativeID={this.state.deleteAdministrativeID}
                                        closeFormAdministrative={this.closeFormAdministrative} callDataEgressAdministrative={this.callDataEgressAdministrative}/>

                    <FormComission durationMask={this.props.durationMask} workPlanID={this.state.workPlanID} formComission={this.state.formComission}
                                   retriveComission={this.state.retriveComission}
                                   deleteComissionID={this.state.deleteComissionID} typeComission={this.state.typeComission} closeFormComission={this.closeFormComission}
                                   callDataComission={this.callDataComission}/>
                    <FormTeacher workPlanID={this.state.workPlanID} formTeacher={this.state.formTeacher} studyPlanID={this.props.studyPlanID}
                                 retriveTeacher={this.state.retriveTeacher} deleteTeacherID={this.state.deleteTeacherID} closeFormTeacher={this.closeFormTeacher}
                                 callDataTeacher={this.callDataTeacher}/>

                    <FormMaterial workPlanID={this.state.workPlanID} studyPlanID={this.props.studyPlanID} formEgressMaterial={this.state.formEgressMaterial}
                                  retriveMaterial={this.state.retriveMaterial} deleteMaterialID={this.state.deleteMaterialID} closeFormMaterial={this.closeFormMaterial}
                                  callDataMaterial={this.callDataMaterial}/>


                </Col>
            </Row>

        );
    }
}

export default Index;