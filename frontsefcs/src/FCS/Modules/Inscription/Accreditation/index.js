import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';

import {
    Card, Col, OverlayTrigger, Row, Table, Tooltip
} from 'react-bootstrap';

import app from '../../../Constants';
import component from '../../../Component';
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import TitleModule from "../../../TitleModule";

import DocumentForm from "./DocumentForm";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import GetApp from "@material-ui/icons/GetApp";
import DEMO from "../../../../store/constant";


moment.locale('es');


class Acreditation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,

            action: "add",
            titleModule: "",
            titleProgram: "",
            titleConcept: "",
            type: "",
            titleAcademicDegree: "",

            disabled: false,
            formAdmissionPlan: false,
            acreditationStudent: false,
            formDocumentStudent: false,
            requerimentLoader: false,
            stateStudentLoader: false,

            studentID: "",
            PERSONID: "",
            description: "",
            AdmissionPlanID: "",
            retriveWorkPlan: "",
            deleteDocumentStudent: "",

            requeriments: [],
            studentDocuments: [],
        };

    }

    async componentDidMount() {
        const studentID = atob(this.props.match.params.id);
        this.setState({studentID: studentID});
        this.listRequerimentDeliveredByStudent(studentID);
        this.listDocumentStudentByStudentID(studentID);

    }


    async listRequerimentDeliveredByStudent(id) {
        this.setState({acreditationStudent: true});
        const url = app.person + '/' + app.requerimentDelivered + '/' + app.student + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                if (res.data.Person) {
                    this.setState({
                        PERSONID: res.data.Person.id,
                        ADMISSIONPLANID: res.data.id_admission_plan,
                        PROGRAMID: res.data.id_program,
                        ORGANICUNITID: res.data.id_organic_unit,
                        titleModule: res.data.Person.name + " / " + res.data.Person.document_number,
                    });

                }
                this.setState({
                    titleProgram: res.data.Program.denomination,
                    titleConcept: res.data.Concept.denomination,
                    titleAcademicDegree: res.data.Program.Academic_degree.denomination,
                    requeriments: res.data.Requeriment_delivereds,
                    type: res.data.type
                });
                this.listRequerimentByConceptAcademicDegree(res.data.id_concept, res.data.Program.id_academic_degree)
            }
            this.setState({acreditationStudent: false});
        } catch (err) {
            this.setState({acreditationStudent: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)
        }
    };

    async listDocumentStudentByStudentID(id) {
        this.setState({studentDocumentLoader: true});
        const url = app.person + '/' + app.student + '/' + id + "/" + app.document;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({studentDocuments: res.data})

            }
            this.setState({studentDocumentLoader: false});
        } catch (err) {
            this.setState({studentDocumentLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)
        }
    };

    async listRequerimentByConceptAcademicDegree(id_concept, id_academic) {
        this.setState({requerimentLoader: true});
        const url = app.general + '/' + app.requeriment + '/concept/' + id_concept + '/academic/' + id_academic;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                let requeriments = res.data;
                let temp = [];
                let requerimentDelivered = this.state.requeriments;

                for (let k = 0; k < requeriments.length; k++) {
                    temp.push({
                        id: requeriments[k].id,
                        id_requeriment_delivered: null,
                        description: requeriments[k].description,
                        exist: false,
                        state: false,
                    })
                }
                requeriments = temp;
                for (let k = 0; k < requeriments.length; k++) {
                    for (let y = 0; y < requerimentDelivered.length; y++) {
                        if (requeriments[k].id === requerimentDelivered[y].id_requeriment) {
                            requeriments[k].id_requeriment_delivered = requerimentDelivered[y].id;
                            requeriments[k].state = requerimentDelivered[y].state;
                            requeriments[k].exist = true;
                        }
                    }

                }
                this.setState({requeriments});

            }


            this.setState({requerimentLoader: false});


        } catch (err) {
            this.setState({requerimentLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err)

        }

    };


    async createRequerimentDelivered(positionArray, state) {

        let temp = this.state.requeriments;
        //ACTUALIZAMOS EL ESTADO EN EL ARRYA TEMPORAL************
        temp[positionArray].state = !state;
        let arrayRequirement = [];
        for (let i = 0; i < temp.length; i++) {
            arrayRequirement.push({
                id: temp[i].id,
                exists: temp[i].exist,
                state: temp[i].state
            })
        }
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.requerimentDelivered;
        const {studentID} = this.state;
        if (studentID !== '' && arrayRequirement.length > 0) {
            let data = new FormData();
            data.set('id_student', studentID);
            data.set('arrayRequirement', JSON.stringify(arrayRequirement));
            try {
                const res = await axios.post(url, data, app.headers);

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });
                this.listRequerimentDeliveredByStudent(studentID);

                this.setState({loaderPerson: false});


            } catch (err) {
                this.setState({loaderPerson: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }
        } else {
            this.setState({loaderPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    updateRequerimentDelivered(id) {
        console.log(this.state.requeriments)
        this.setState({disabled: true});
        const url = app.person + '/' + app.requerimentDelivered + '/' + id;
        if (id !== "") {
            let data = new FormData();
            axios.patch(url, data, app.headers).then(() => {
                this.listRequerimentDeliveredByStudent(this.state.studentID);
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro almacenado correctamente",
                    delay: 2000
                });

            }).catch(err => {
                this.setState({disabled: false});
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err);
            })
        } else {
            this.setState({disabled: false});
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    async updateStateStudentProgram(type) {
        this.setState({stateStudentLoader: true});

        const url = app.person + '/' + app.student + '/state/' + this.state.studentID;
        const {studentID} = this.state;
        if (studentID !== '' && type !== '') {
            let data = new FormData();
            data.set('type', type);
            try {
                const res = await axios.patch(url, data, app.headers);
                this.setState({type: type})
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });

                this.setState({stateStudentLoader: false});
            } catch (err) {
                this.setState({stateStudentLoader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }
        } else {
            this.setState({stateStudentLoader: false});
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    openFormDocument = () => {
        this.setState({formDocumentStudent: true})
    };

    updateAdmissionPlanID = (id) => {
        this.setState({AdmissionPlanID: id});
    };
    retriveDocumentStudent = (r) => {
        this.setState({formDocumentStudent: true, retriveStudentDocument: r});
    };
    closeFormDocument = () => {
        this.setState({formDocumentStudent: false, retriveStudentDocument: "", deleteDocumentStudent: ""})
    };
    deleteSweetDocumentStudent = (id) => {
        this.setState({deleteDocumentStudent: id})
    };
    callData = async () => {
        this.listDocumentStudentByStudentID(this.state.studentID)
    };


    render() {


        const {requeriments, studentDocuments} = this.state;
        const {titleProgram, titleConcept} = this.state;
        let totalPromedy = 0;
        let divider = (this.state.titleAcademicDegree === "Maestro" || this.state.titleAcademicDegree === "MAESTRO") ? 3 : 4;
        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"ACREDITACIÓN"}
                    fatherModuleUrl={"/inscription/" + btoa(this.state.ADMISSIONPLANID)}
                    fatherModuleTitle={"INSCRIPCIONES"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{marginBottom: "5px"}}>
                            <Card.Header>

                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <div className="">
                                            <h5>{titleProgram}</h5> <br/>
                                            {titleConcept.toUpperCase()}
                                        </div>
                                    </Col>


                                </Row>
                            </Card.Header>

                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Card className="table-card">
                            <Card.Header>
                                <h5>REQUISITOS PRESENTADOS PARA LA ADMISIÓN</h5>
                                {/*<span className="d-block m-t-5">use props <code>size="sm"</code> with <code>Table</code> component</span>*/}
                            </Card.Header>
                            <Card.Body className='pb-0'>
                                <div style={{position: 'relative'}}>
                                    {this.state.requerimentLoader && component.spiner}
                                    <Table size="sm" hover responsive style={{width: '100%'}}>

                                        <tbody>
                                        {
                                            requeriments.length > 0 && requeriments.map((r, i) => {
                                                return (
                                                    <tr key={i}>

                                                        <td>
                                                            <div key={i} className="d-inline-block"
                                                                 style={{
                                                                     marginRight: "10px",
                                                                     display: "block", /* or inline-block, at least its a block element */
                                                                     width: "auto", /* or width is certain by parent element */
                                                                     height: "auto", /* height cannot be defined */
                                                                     wordBreak: "break-all", /*  */
                                                                     wordWrap: "break-word", /* if you want to cut the complete word */
                                                                     whiteSpace: "normal"
                                                                 }}>
                                                                <label
                                                                    className="check-task custom-control custom-checkbox d-flex justify-content-center">
                                                                    <input type="checkbox"
                                                                           className="custom-control-input"
                                                                           onClick={r.exist ? () => this.updateRequerimentDelivered(r.id_requeriment_delivered) : () => this.createRequerimentDelivered(i, r.state)}
                                                                           checked={r.state}
                                                                           value={r.state}
                                                                           readOnly
                                                                    />
                                                                    < span
                                                                        className="custom-control-label">{r.description}</span>

                                                                </label>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                )
                                            })
                                        }


                                        </tbody>
                                    </Table>
                                </div>


                            </Card.Body>


                        </Card>

                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Card className="table-card">
                            <nav className="navbar ">
                                <h5>DOCUMENTACIÓN PRESENTADA PARA LA ADMISIÓN EPG</h5>
                                <div className="nav-item nav-grid f-view">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Nuevo</Tooltip>}>
                                        <button style={{marginRight: "8px"}} onClick={() => this.openFormDocument()}
                                                type="button" className="btn-icon btn btn-primary"><Add/>
                                        </button>

                                    </OverlayTrigger>

                                </div>
                            </nav>
                            <Card.Body className='pb-0'>
                                <div style={{position: 'relative'}}>
                                    {this.state.studentDocumentLoader && component.spiner}
                                    <Table size="sm" hover responsive style={{width: '100%'}}>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Documento</th>
                                            <th>Nota</th>
                                            <th>Acciones</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {studentDocuments.length > 0 ?
                                            studentDocuments.map((r, i) => {
                                                totalPromedy = totalPromedy + r.note;
                                                return (
                                                    <tr key={i}>
                                                        <th scope="row">{i + 1}</th>
                                                        <td>{r.Document.topic}</td>
                                                        <td>{r.note}</td>
                                                        <td>
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>DESCARGAR ARCHIVO</Tooltip>}>
                                                                <a href={r.Document ? app.server + app.docsStudent + r.Document.archive : "#"}>
                                                                    <GetApp type="button" className="text-dark"/></a>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>EDITAR</Tooltip>}>
                                                                <Edit type="button" style={{color: "#1d86e0"}}
                                                                      onClick={() => this.retriveDocumentStudent(r)}/>

                                                            </OverlayTrigger>
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                                <Delete type="button" style={{color: "#ff5252"}}
                                                                        onClick={() => this.deleteSweetDocumentStudent(r.Document.id)}/>

                                                            </OverlayTrigger>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td>No se encontraron registros</td>
                                            </tr>
                                        }


                                        </tbody>
                                        <tfoot>
                                        <tr>

                                            <th colspan="4">NOTA FINAL :{Math.round(totalPromedy / divider)}</th>


                                        </tr>
                                        </tfoot>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="table-card">


                            <div style={{position: 'relative'}}>
                                {this.state.stateStudentLoader && component.spiner}
                                <Card.Body className='pb-0'>

                                    <OverlayTrigger
                                        overlay={<Tooltip>Cuando no cumple con los
                                            requisitos</Tooltip>}>
                                        <a href={DEMO.BLANK_LINK}
                                           onClick={() => this.updateStateStudentProgram("Postulante")}
                                           className={this.state.type === "Postulante" ? "btn btn-success btn-sl-sm" : "btn btn-outline-success btn-sl-sm"}
                                        >POSTULANTE</a>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>Cuando cumple con los
                                            requisitos y su nota final es mayor a 14</Tooltip>}>
                                        <a href={DEMO.BLANK_LINK}
                                           onClick={() => this.updateStateStudentProgram("Estudiante")}
                                           className={this.state.type === "Estudiante" ? "btn btn-success btn-sl-sm" : "btn btn-outline-success btn-sl-sm"}
                                        >ESTUDIANTE</a>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        overlay={<Tooltip>Cuando el estudiante solicita realizar el proceso de Retiro y
                                            reserva de matrícula</Tooltip>}>

                                        <a href={DEMO.BLANK_LINK}
                                           onClick={() => this.updateStateStudentProgram("Retirado")}
                                           className={this.state.type === "Retirado" ? "btn btn-success btn-sl-sm" : "btn btn-outline-success btn-sl-sm"}
                                        >RETIRADO</a>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>Cuando el estudiante no se matrícula</Tooltip>}>

                                        <a href={DEMO.BLANK_LINK}
                                           onClick={() => this.updateStateStudentProgram("Abandonado")}
                                           className={this.state.type === "Abandonado" ? "btn btn-success btn-sl-sm" : "btn btn-outline-success btn-sl-sm"}
                                        >ABANDONADO</a>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>Cuando aprueba el total de creditos</Tooltip>}>

                                        <a href={DEMO.BLANK_LINK}
                                           onClick={() => this.updateStateStudentProgram("Egresado")}
                                           className={this.state.type === "Egresado" ? "btn btn-success btn-sl-sm" : "btn btn-outline-success btn-sl-sm"}
                                        >EGRESADO</a>
                                    </OverlayTrigger>

                                </Card.Body>
                            </div>

                        </Card>

                    </Col>


                    <DocumentForm callData={this.callData}
                                  closeFormDocument={this.closeFormDocument}
                                  formDocument={this.state.formDocumentStudent}
                                  retriveDocument={this.state.retriveStudentDocument}
                                  deleteDocumentID={this.state.deleteDocumentStudent}
                                  belognsID={this.state.studentID}
                                  tableName={"Student_document"}
                                  titleAcademicDegree={this.state.titleAcademicDegree}
                    />
                </Row>


            </>
        );
    }
}

export default withRouter(Acreditation)
