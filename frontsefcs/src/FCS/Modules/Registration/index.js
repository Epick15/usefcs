import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import {Card, Col, Form, OverlayTrigger, Row, Table,  Tooltip} from "react-bootstrap";
import $ from 'jquery';
import defaultUser from "../../../assets/images/user/default.jpg";
import DataTableRegistration from "./DataTableRegistration";
import DataTableAllRegistration from "./DataTableAllRegistration";
import DataTableWithProgram from "./DataTableWithProgram";
import Refresh from "@material-ui/icons/Refresh";
import Add from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import Search from "@material-ui/icons/Search";

import FormAcademicRecord from "./Form";


moment.locale('es');

class Registration extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        formRegistration: false,
        studentLoader: false,
        deleteMovementID: "",
        organicUnit: "",
        academicDegree: "",
        programID: "",

        organicUnitMask: "",


        retriveData: "",
        students: [],

        organicUnits: [],
        plans: [],
        registrations: [],


        searchPerson: true,
        movementLoader: false,
        conceptLoader: false,
        person: "",
        persons: [],

    };

    async componentDidMount() {
        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.setState({organicUnit: component.ORGANIC_UNIT})
        }
    }

    async retrieveStudent(id_student) {
        const url = app.person + '/' + app.student + '/' + id_student;
        try {

            const res = await axios.get(url, app.headers);
            if (res.data)
                console.log(res.data)
            this.setState({
                titleModule: res.data.Person.name + " / " + res.data.Person.document_number,
                programID: res.data.id_program,
                titleProgram: res.data.Program.denomination,
                admissionPlanID: res.data.id_admission_plan,
                sedeRegistration: res.data.Program.Organic_unit_register.Campu.denomination,
                unitRegistration: res.data.Program.Organic_unit_register.denomination,
                studyPlanID: res.data.id_plan,
                PERSONID: res.data.Person.id,
                academicDegree: res.data.Program.Academic_degree.denomination
            });

        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    listUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({organicUnits: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };

    searchPersonStudenUnitOrganic(params, organicUnit) {
        if (params === '') {
            this.setState({persons: []})
        } else {
            const url = app.person + '/search-' + app.persons + '/' + app.student + '-uo/' + params;
            let data = new FormData();
            data.set('id_organic_unit', organicUnit)
            axios.patch(url, data, app.headers).then(res => {
                if (res.data) this.setState({persons: res.data})
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err)
            })
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


    handleChange = field => event => {
        switch (field) {
            case 'organicUnit':
                let organicMask = $('#organicmask-' + event.target.value).attr('data-organicmask');
                this.setState({organicUnit: event.target.value, organicUnitMask: organicMask});
                break;
            case 'person':
                this.searchPersonStudenUnitOrganic(event.target.value, this.state.organicUnit)
                this.setState({person: event.target.value});
                break;
            default:
                break;
        }
    };

    openForm = () => {
        this.setState({formRegistration: true, action: "add"});
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

    selectectPerson = (r) => {

        this.listRegistrationCourseStudent(r.Student.id);
        this.retrieveStudent(r.Student.id);

        this.setState({
            searchPerson: false,
            personMask: r.name,
            documentMask: r.document_number,
            studentType: r.Student.type,
            programMask: r.Student.Program.denomination,
            photoMask: r.photo,
            studentID: r.Student.id,

        });
    };
    unSelectectPerson = () => {

        this.setState({
            searchPerson: true,
            personMask: '',
            documentMask: '',
            studentType: '',
            programMask: '',
            photoMask: '',
            academicDegree: '',
            studentID: '',
            totalMovement: '',
            registrations: [],
            movements: []
        });
    };
    closeSelectectPerson = () => {

        this.setState({
            searchPerson: true,
            person: '',
            personMask: '',
            documentMask: '',
            studentType: '',
            programMask: '',
            photoMask: '',
            academicDegree: '',
            studentID: '',
            totalMovement: '',
            registrations: [],
            persons: [],
            movements: []
        });
    };
    refreshData = () => {
        this.listRegistrationCourseStudent(this.state.studentID);
    }
    donwloadRecord = () => {

        component.pdfReportAutoRecordAcademico(
            this.state.titleModule.toUpperCase(),
            this.state.titleProgram.toUpperCase(),
            this.state.sedeRegistration.toUpperCase(),
            this.state.unitRegistration.toUpperCase(),
            this.state.registrations
        );
    }

    render() {

        const {
            persons, person
        } = this.state;
        // estado del modo dios
        const {organicUnits, organicUnit} = this.state;
        let span = this.state.studentType === 'Retirado' ? 'badge-warning' :
            this.state.studentType === 'Abandonado' ? 'badge-danger' :
                this.state.studentType === 'Postulante' ? 'badge-info' :
                    this.state.studentType === 'Estudiante' ? 'badge-primary' : 'badge-success';
        return (
            <>

                <TitleModule
                    actualTitle={"MATRÍCULAS"}
                    actualModule={"MATRÍCULAS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Card style={{marginBottom: "5px"}}>

                    <Card.Header>
                        <Row>
                            {!component.ORGANIC_UNIT &&
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"

                                    >Unidad Organica<small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={organicUnit}
                                                  onChange={this.handleChange('organicUnit')}
                                    >
                                        >
                                        <option defaultValue={true} hidden>Unidad</option>
                                        {
                                            organicUnits.length > 0 ?
                                                organicUnits.map((r, k) => {

                                                        return (<option
                                                            id={"organicmask-" + r.id}
                                                            value={r.id}
                                                            data-organicmask={r.denomination.toUpperCase() + ' - ' + r.Campu.denomination.toUpperCase()}
                                                            key={k}> {r.denomination.toUpperCase() + ' - ' + r.Campu.denomination.toUpperCase()}
                                                        </option>)

                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>

                                <br/>
                            </Col>}

                            {this.state.searchPerson ?
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                            // style={program === "" ? {color: "#ff5252 "} : null}
                                        >Estudiante<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyPress={this.handleKeyPress}
                                            id="number"
                                            value={person}
                                            onChange={this.handleChange('person')}
                                            placeholder="Buscar"
                                            margin="normal"
                                        />

                                        <OverlayTrigger
                                            overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                            <button
                                                onClick={() => this.closeSelectectPerson()}
                                                type="button"
                                                style={{
                                                    position: 'relative',
                                                    zIndex: 100,
                                                    padding: '0',
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                    color: '#7b7f84',
                                                    marginTop: '-30px', float: 'right'
                                                }}
                                                className=" btn btn-dark"><Close
                                                style={{color: "dark"}}/></button>
                                        </OverlayTrigger>


                                        <Table hover responsive style={{marginTop: '-1px'}}>
                                            <tbody>
                                            {persons.length > 0 &&
                                            persons.map((r, i) => {

                                                let spanP = r.Student.type === 'Retirado' ? 'badge-warning' :
                                                    r.Student.type === 'Abandonado' ? 'badge-danger' :
                                                        r.Student.type === 'Postulante' ? 'badge-info' :
                                                            r.Student.type === 'Estudiante' ? 'badge-primary' : 'badge-success';

                                                return (
                                                    <tr key={i} onClick={() => this.selectectPerson(r)}>
                                                        <td scope="row">
                                                            <div className="d-inline-block align-middle">
                                                                <img
                                                                    src={r.photo !== "" ? app.server + 'person-photography/' + r.photo : defaultUser}
                                                                    // src={defaultUser}
                                                                    alt="user"
                                                                    className="img-radius align-top m-r-15"
                                                                    style={{width: '40px'}}
                                                                />
                                                                <div className="d-inline-block">
                                                                    <h6 className="m-b-0"> {r.name}</h6>
                                                                    <p className="m-b-0"> {r.document_number} <span
                                                                        className={"badge  inline-block " + spanP}>{r.Student && r.Student.type}</span>
                                                                    </p>
                                                                    <p className="m-b-0"> {r.Student.Program.denomination}</p>
                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                            </tbody>
                                        </Table>

                                    </Form.Group>

                                </Col>

                                :
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Row>
                                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                            <div className="d-inline-block align-middle">
                                                <img
                                                    src={this.state.photoMask !== "" ? app.server + 'person-photography/' + this.state.photoMask : defaultUser}
                                                    // src={defaultUser}
                                                    alt="user"
                                                    className="img-radius align-top m-r-15"
                                                    style={{width: '60px'}}
                                                />
                                                <div className="d-inline-block">
                                                    <h5 className="m-b-0"> {this.state.personMask}</h5>
                                                    <p className="m-b-0">{this.state.documentMask} <span
                                                        className={"badge  inline-block " + span}>{this.state.studentType.toUpperCase()}</span>

                                                    </p>
                                                    <p className="m-b-0"> {this.state.programMask}</p>

                                                </div>


                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>


                                            <div style={{float: "right"}}>
                                                {
                                                    this.state.studentType !== 'Retirado' && this.state.studentType !== 'Abandonado' && this.state.studentType !== 'Egresado' &&
                                                    <OverlayTrigger
                                                        overlay={<Tooltip>NUEVO</Tooltip>}>
                                                        <button style={{float: "right"}}
                                                                onClick={() => this.openForm()}
                                                                type="button"
                                                                className="btn-icon btn btn-primary"><Add/></button>
                                                    </OverlayTrigger>
                                                }

                                                <OverlayTrigger
                                                    overlay={<Tooltip>RECARGAR</Tooltip>}>
                                                    <button style={{float: "right", marginRight: "3px"}}
                                                            onClick={() => this.refreshData()}
                                                            type="button"
                                                            className="btn-icon btn btn-secondary"><Refresh/></button>
                                                </OverlayTrigger>



                                                <OverlayTrigger
                                                    overlay={<Tooltip>BUSCAR ESTUDIANTE</Tooltip>}>
                                                    <button style={{float: "right", marginRight: "3px"}}
                                                            onClick={() => this.unSelectectPerson()}
                                                            type="button"
                                                            className="btn-icon btn btn-info"><Search/></button>

                                                </OverlayTrigger>

                                            </div>
                                        </Col>


                                    </Row>
                                </Col>
                            }


                        </Row>
                    </Card.Header>
                </Card>
                <Row>
                    {this.state.registrations.length > 0 &&
                    this.state.registrations.map((r, i) => {
                        return (
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} key={i}>
                                <div style={{position: 'relative'}} >
                                    {this.state.registrationDataLoader && component.spiner}
                                    <DataTableRegistration
                                        titleModule={this.state.titleModule}
                                        titleProgram={this.state.titleProgram}
                                        sedeRegistration={this.state.sedeRegistration}
                                        unitRegistration={this.state.unitRegistration}
                                        records={r}
                                        optionEdit={i === 0 ? true : false}
                                        callData={this.callData}
                                        retriveDataRegistration={this.retriveDataRegistration}
                                        leaveDataRegistration={this.leaveDataRegistration}
                                        deleteSweetRegistration={this.deleteSweetRegistration}
                                    />
                                </div>
                                <br/>
                            </Col>
                        )
                    })
                    }
                </Row>
                <FormAcademicRecord callData={this.callData}
                                    closeFormRegistration={this.closeFormRegistration}
                                    organicUnit={this.state.organicUnit}
                                    formRegistration={this.state.formRegistration}
                                    admissionPlanID={this.state.admissionPlanID}
                                    programID={this.state.programID}
                                    studyPlanID={this.state.studyPlanID}
                                    studentID={this.state.studentID}
                                    academicDegree={this.state.academicDegree}
                                    titleModule={this.state.titleModule}
                                    retriveRegistration={this.state.retriveRegistration}
                                     action={this.state.action}
                                     deleteRegistrationID={this.state.deleteRegistrationID}
                                     leaveRegistrationID={this.state.leaveRegistrationID}
                                     plans={this.state.plans}
                                     history={this.props.history}

                />
                {/*{this.state.searchPerson &&*/}
                {/* <DataTableAllRegistration*/}
                {/*     organicUnit={this.state.organicUnit}*/}
                {/*     organicUnitMask={this.state.organicUnitMask}*/}
                {/*/>*/}
                {
                    !this.state.registrations.length > 0 &&
                    <DataTableWithProgram
                        organicUnit={this.state.organicUnit}
                        organicUnitMask={this.state.organicUnitMask}
                    />
                }

                {/*// }*/}
            </>
        );
    }

}

export default Registration;
