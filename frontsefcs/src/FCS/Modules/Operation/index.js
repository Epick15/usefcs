import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import {Card, Col, Form, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import defaultUser from "../../../assets/images/user/default.jpg";
import DataTableOperation from "./DataTableOperation";
import Add from "@material-ui/icons/Add";
import Search from "@material-ui/icons/Search";
import FormOperation from "./Form";
import Refresh from "@material-ui/icons/Refresh";

moment.locale('es');

class Operation extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        studentLoader: false,
        deleteMovementID: "",
        organicUnit: "",
        academicDegree: "",
        retriveData: "",
        studentType: "",
        studentID: "",
        students: [],
        organicUnits: [],
        plans: [],
        payments: [],
        searchPerson: true,
        movementLoader: false,
        conceptLoader: false,
        person: "",
        persons: []
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
                title: "Oh no!", text: "Error al obtener unidades orgánicas", delay: 2000
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
                    title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                });
                console.log(err)
            })
        }

    };


    async listPaymentStudentOperation(id_student) {
        this.setState({conceptLoader: true});
        const url = app.accounting + '/' + app.payment + '/' + app.student + '/' + id_student + '/operation';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                let temp = [];
                res.data.map(r => {

                    temp.push({
                        "id": r.id,
                        "id_process": r.Academic_semester.id,
                        "concept": r.Concept.denomination,
                        "id_concept": r.Concept.id,
                        "amount": r.amount,
                        "process": r.Academic_semester.Academic_calendar.denomination.substr(-4) + ' - ' + r.Academic_semester.denomination.substr(-2),
                        "type": r.type,
                        "created_at": r.created_at,
                        "state": r.state
                    })
                })
                this.setState({payments: temp});
            }


            this.setState({conceptLoader: false});
        } catch (err) {
            this.setState({conceptLoader: false});
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
        this.setState({formOperation: true, action: "add"});
    };
    deleteOperationSweet = (id) => {
        this.setState({deleteOperationID: id})
    };
    leaveDataRegistration = (id) => {
        this.setState({leaveRegistrationID: id})
    };
    callData = async () => {
        this.listPaymentStudentOperation(this.state.studentID)
    };
    retriveDataOperation = (r) => {

        this.setState({formOperation: true, retriveOperation: r, action: "update"});
    };
    closeFormOperation = () => {
        this.setState({
            formOperation: false, retriveOperation: "", deleteOperationID: "", action: ""
        })
    };

    selectectPerson = (r) => {

        this.listPaymentStudentOperation(r.Student.id);


        this.setState({
            searchPerson: false,
            personMask: r.name,
            documentMask: r.document_number,
            programMask: r.Student.Program.denomination,
            studentType: r.Student.type,
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
            payments: [],
            movements: []
        });
    };
    refreshData = () => {
        this.listPaymentStudentOperation(this.state.studentID);
    }

    render() {

        const {
            persons, person
        } = this.state;

        // estado del modo dios
        const {organicUnits, organicUnit, payments} = this.state;

        let span = this.state.studentType === 'Retirado' ? 'badge-warning' : this.state.studentType === 'Abandonado' ? 'badge-danger' : this.state.studentType === 'Postulante' ? 'badge-info' : this.state.studentType === 'Estudiante' ? 'badge-primary' : 'badge-success';
        return (<>

            <TitleModule
                actualTitle={"OPERACIONES"}
                actualModule={"OPERACIONES"}
                fatherModuleUrl={""} fatherModuleTitle={""}
            />
            <Card style={{marginBottom: "5px"}}>

                <Card.Header>
                    <Row>
                        {!component.ORGANIC_UNIT && <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"

                                >Unidad Organica<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={organicUnit}
                                              onChange={this.handleChange('organicUnit')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Unidad</option>
                                    {organicUnits.length > 0 ? organicUnits.map((r, k) => {

                                        return (<option
                                            value={r.id}
                                            key={k}> {r.denomination.toUpperCase() + ' - ' + r.Campu.denomination.toUpperCase()}
                                        </option>)

                                    }) : <option value={false} disabled>No se encontraron datos</option>}
                                </Form.Control>
                            </Form.Group>

                            <br/>
                        </Col>}
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {this.state.searchPerson ? <Form.Group className="form-group fill">
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
                                        {persons.length > 0 && persons.map((r, i) => {
                                            return (<tr key={i} onClick={() => this.selectectPerson(r)}>
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
                                            </tr>)
                                        })}
                                        </tbody>
                                    </Table>

                                </Form.Group> :

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
                                                <p className="m-b-0">{this.state.documentMask}

                                                    <span
                                                        className={"badge  inline-block " + span}>{this.state.studentType.toUpperCase()}</span>

                                                </p>
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
                                                overlay={<Tooltip>Recargar</Tooltip>}>
                                                <button style={{float: "right", marginRight: "3px"}}
                                                        onClick={() => this.refreshData()}
                                                        type="button"
                                                        className="btn-icon btn btn-secondary"><Refresh/></button>
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
                {payments.length > 0 && <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{position: 'relative'}}>
                        {this.state.registrationDataLoader && component.spiner}
                        <DataTableOperation
                            records={payments}
                            retriveDataOperation={this.retriveDataOperation}
                            leaveDataRegistration={this.leaveDataRegistration}
                            deleteOperationSweet={this.deleteOperationSweet}
                        />
                    </div>
                    <br/>
                </Col>}

            </Row>

            {this.state.studentID && <FormOperation callData={this.callData}
                                                    closeFormOperation={this.closeFormOperation}
                                                    action={this.state.action}
                                                    formOperation={this.state.formOperation}
                                                    studentID={this.state.studentID}
                                                    retriveOperation={this.state.retriveOperation}
                                                    deleteOperationID={this.state.deleteOperationID}

            />}
        </>);
    }

}

export default Operation;
