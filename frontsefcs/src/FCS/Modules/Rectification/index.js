import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";


import { Card, Col, Form, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import defaultUser from "../../../assets/images/user/default.jpg";

import DataTableRegistration from "./DataTableRegistration";
import Add from "@material-ui/icons/Add";
import Search from "@material-ui/icons/Search";
import FormAcademicRecord from "./Form";


moment.locale('es');

class Registration extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        studentLoader: false,
        deleteMovementID: "",
        organicUnit: "",
        academicDegree: "",

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
                academicDegree: res.data.Program.Academic_degree.denomination
            });
            console.log('aqui', res.data)
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
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
                this.setState({organicUnit: event.target.value});
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
            programMask: '',
            photoMask: '',
            academicDegree: '',
            studentID: '',
            totalMovement: '',
            registrations: [],
            movements: []
        });
    };


    render() {

        const {
      persons, person
        } = this.state;

        // estado del modo dios
        const {organicUnits, organicUnit} = this.state;

        return (
            <>

                <TitleModule
                    actualTitle={"RECTIFICACIÓN DE MATRÍCULAS"}
                    actualModule={"RECTIFICACIÓN DE MATRÍCULAS"}
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
                                                            value={r.id} key={k}> {r.denomination.toUpperCase()} </option>)

                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>

                                <br/>
                            </Col>}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                {this.state.searchPerson ?
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
                                        <Table hover responsive style={{marginTop: '-1px'}}>
                                            <tbody>
                                            {persons.length > 0 &&
                                            persons.map((r, i) => {
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
                                                                    <p className="m-b-0"> {r.document_number}</p>
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
                                    :

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
                                                    <p className="m-b-0">{this.state.documentMask}</p>
                                                    <p className="m-b-0"> {this.state.programMask}</p>

                                                </div>


                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>


                                            <div style={{float: "right"}}>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Nuevo</Tooltip>}>
                                                    <button style={{float: "right"}}
                                                            onClick={() => this.openForm()}
                                                            type="button"
                                                            className="btn-icon btn btn-primary"><Add/></button>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Buscar Estudiante</Tooltip>}>
                                                    <button style={{float: "right", marginRight: "3px"}}
                                                            onClick={() => this.unSelectectPerson()}
                                                            type="button"
                                                            className="btn-icon btn btn-info"><Search/></button>

                                                </OverlayTrigger>

                                            </div>
                                        </Col>


                                    </Row>

                                }


                            </Col>


                        </Row>
                    </Card.Header>
                </Card>
                <Row>
                    {this.state.registrations.length > 0 &&
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
                    })
                    }
                </Row>
                <FormAcademicRecord callData={this.callData}
                                    closeFormRegistration={this.closeFormRegistration}
                                    formRegistration={this.state.formRegistration}
                                    admissionPlanID={this.state.admissionPlanID}
                                    studyPlanID={this.state.studyPlanID}
                                    studentID={this.state.studentID}
                                    academicDegree={this.state.academicDegree}
                                    titleModule={this.state.titleModule}
                                    retriveRegistration={this.state.retriveRegistration}
                                    action={this.state.action}
                                    deleteRegistrationID={this.state.deleteRegistrationID}
                                    leaveRegistrationID={this.state.leaveRegistrationID}
                                    plans={this.state.plans}

                />
            </>
        );
    }

}

export default Registration;
