import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";

import DataTableAmortization from "./DataTableAmortization";
import DataTableVoucher from "./DataTableVoucher";
import {Card, Col, Form, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import defaultUser from "../../../assets/images/user/default.jpg";
import FormVoucher from "./Form";

import Search from "@material-ui/icons/Search";


moment.locale('es');

class Payment extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        studentLoader: false,
        deleteMovementID: "",
        organicUnit: "",

        retriveData: "",
        studentType: "",
        students: [],

        organicUnits: [],


        totalMovement: 0,
        totalConcept: 0,
        totalSaldo: 0,

        searchPerson: true,
        movementLoader: false,
        conceptLoader: false,
        person: "",
        persons: [],
        payments: [],
        movements: []
    };

    async componentDidMount() {


        this.listUnitOrganic()


    }


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

    searchPersonStudent(params) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/search-person-student/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) this.setState({persons: res.data})
                }).catch(err => {
                    PNotify.error({
                        title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                    });
                    console.log(err)
                })
            }

        }

    };

    async listPaymentStudent(id_student) {
        this.setState({conceptLoader: true});
        const url = app.accounting + '/' + app.payment + '/' + app.student + '/' + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                let temp = [];
                let totalConcept = 0;
                res.data.map(r => {
                    if (r.type === "Pagado") {
                        totalConcept = parseFloat(r.amount) + totalConcept
                    }
                    temp.push({
                        "id": r.id,
                        "payment_date": r.payment_date,
                        "concept": r.Concept.denomination,
                        "amount": r.amount,
                        "process": r.Academic_semester.Academic_calendar.denomination.substr(-4) + ' - ' + r.Academic_semester.denomination.substr(-2),
                        "type": r.type
                    })
                })
                this.setState({payments: temp, totalConcept: totalConcept});
            }


            this.setState({conceptLoader: false});
        } catch (err) {
            this.setState({conceptLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listMovement(id_student) {
        this.setState({movementLoader: true});
        const url = app.accounting + '/' + app.movement + '/' + app.student + '/' + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                let totalMovement = 0;

                res.data.map((r) => {
                    if (r.state === "Aceptado") totalMovement = parseFloat(r.voucher_amount) + totalMovement
                });
                this.setState({movements: res.data, totalMovement: totalMovement});
            }


            this.setState({movementLoader: false});
        } catch (err) {
            this.setState({movementLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listTotalBalance(id_student) {
        this.setState({movementLoader: true});
        const url = app.accounting + '/' + app.payment + '/total-balance';
        try {
            let data = new FormData();
            data.set('id_student', id_student);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                this.setState({
                    totalMovement: res.data.totalMovement,
                    totalConcept: res.data.totalConcept,
                    totalBalance: res.data.totalMovement - res.data.totalConcept
                })
            }
            this.setState({movementLoader: false});
        } catch (err) {
            this.setState({movementLoader: false});
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
                this.searchPersonStudent(event.target.value);
                this.setState({person: event.target.value});
                break;


            default:
                break;
        }
    };

    openForm = () => {
        this.setState({form: true})
    };
    closeForm = () => {
        this.setState({form: false, deleteMovementID: '', retriveMovement: ''});

    };

    retriveMovement = async (r) => {
        this.setState({retriveMovement: r, form: true});
    };
    deleteMovementSweet = async (deleteMovementID, amount) => {

        this.setState({deleteMovementID: deleteMovementID});
    };
    selectectPerson = (r) => {

        this.listPaymentStudent(r.Student.id);
        this.listMovement(r.Student.id);
        this.listTotalBalance(r.Student.id);
        this.setState({
            searchPerson: false,
            personMask: r.name,
            documentMask: r.document_number,
            programMask: r.Student.Program.denomination,
            studentType: r.Student.type,
            photoMask: r.photo,
            studentID: r.Student.id,
            organicUnit: r.Student.id_organic_unit,
            programID: r.Student.Program.id
        });
    };
    unSelectectPerson = () => {

        this.setState({
            searchPerson: true,
            personMask: '',
            documentMask: '',
            programMask: '',
            photoMask: '',
            studentID: '',
            organicUnit: '',
            totalMovement: '',
            payments: [],
            movements: []
        });
    };
    callConceptStudent = () => {
        this.listPaymentStudent(this.state.studentID);
        this.listTotalBalance(this.state.studentID);
    };
    callListMovement = () => {
        this.listMovement(this.state.studentID);
        this.listTotalBalance(this.state.studentID);
    };
    // Math.round(subTotal * 100) / 100}
    reduceTotalMovement = (type, amount) => {
        if (type === 'add') {
            let temp = Math.round(parseFloat(this.state.totalConcept) + parseFloat(amount));
            this.setState({
                totalConcept: temp, totalBalance: this.state.totalBalance - parseFloat(amount),
            })
        } else {
            let temp = Math.round(parseFloat(this.state.totalConcept) - parseFloat(amount));
            this.setState({
                totalConcept: temp, totalBalance: this.state.totalBalance + parseFloat(amount),
            })
        }


    };
    closeSelectectPerson = () => {

        this.setState({
            searchPerson: true,
            personMask: '',
            organicUnit: '',
            person: '',
            documentMask: '',
            programMask: '',
            photoMask: '',
            studentID: '',
            totalMovement: '',
            persons: [],
            payments: [],
            movements: []
        });
    };

    render() {

        const {persons, person} = this.state;
        // estado del modo dios


        let span = this.state.studentType === 'Retirado' ? 'badge-warning' : this.state.studentType === 'Abandonado' ? 'badge-danger' : this.state.studentType === 'Postulante' ? 'badge-info' : this.state.studentType === 'Estudiante' ? 'badge-primary' : 'badge-success';
        return (<>

                <TitleModule
                    actualTitle={"ENTRADAS"}
                    actualModule={"ENTRADAS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Card style={{marginBottom: "5px"}}>

                    <Card.Header>
                        <Row>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                {this.state.searchPerson ? <Row>

                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                    // style={program === "" ? {color: "#ff5252 "} : null}
                                                >Estudiante<small className="text-danger"> *</small></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    // onKeyPress={this.handleKeyPress}
                                                    id="number"
                                                    value={person}
                                                    onChange={this.handleChange('person')}
                                                    placeholder="Buscar"
                                                    margin="normal"
                                                />
                                                <Table hover responsive style={{marginTop: '-1px'}}>
                                                    <tbody>
                                                    {persons.length > 0 && persons.map((r, i) => {
                                                        let spanP = r.Student === null ? '' : r.Student.type === 'Retirado' ? 'badge-warning' : r.Student.type === 'Abandonado' ? 'badge-danger' : r.Student.type === 'Postulante' ? 'badge-info' : r.Student.type === 'Estudiante' ? 'badge-primary' : 'badge-success';

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
                                                                            <p className="m-b-0"> {r.document_number}
                                                                                <span
                                                                                    className={"badge  inline-block " + spanP}>{r.Student && r.Student.type}</span>
                                                                                {r.Student && r.Student.Admission_plan.description.substr(-6)}
                                                                            </p>

                                                                            <p className="m-b-0"> {r.Student && r.Student.Program.denomination}</p>
                                                                        </div>
                                                                    </div>

                                                                </td>
                                                            </tr>)
                                                    })}
                                                    </tbody>
                                                </Table>

                                            </Form.Group>
                                        </Col>

                                    </Row> :

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
                                                ingresos
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Buscar Estudiante</Tooltip>}>
                                                    <button style={{float: "right", marginRight: "3px"}}
                                                            onClick={() => this.unSelectectPerson()}
                                                            type="button"
                                                            className="btn-icon btn btn-info"><Search/></button>

                                                </OverlayTrigger>

                                                <span
                                                    style={{
                                                        float: "right", marginRight: "10px"
                                                    }}>  saldo disponible<h3>S/. {this.state.totalBalance}</h3></span>

                                            </div>


                                        </Col>
                                    </Row>

                                }


                            </Col>


                        </Row>
                    </Card.Header>
                </Card>
                {this.state.searchPerson === false && <Row>

                    <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                        <div style={{position: 'relative'}}>
                            {this.state.movementLoader && component.spiner}
                            <DataTableVoucher
                                openForm={this.openForm}
                                deleteMovementSweet={this.deleteMovementSweet}
                                records={this.state.movements}
                                retriveMovement={this.retriveMovement}
                                studentID={this.state.studentID}
                            />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={7} lg={7} xl={7}>
                        <div style={{position: 'relative'}}>
                            {this.state.conceptLoader && component.spiner}
                            <DataTableAmortization
                                callConceptStudent={this.callConceptStudent}
                                reduceTotalMovement={this.reduceTotalMovement}
                                records={this.state.payments}
                                totalBalance={this.state.totalBalance}
                            />
                        </div>
                    </Col>
                </Row>}
                <FormVoucher
                    form={this.state.form}
                    closeForm={this.closeForm}
                    callListMovement={this.callListMovement}
                    studentID={this.state.studentID}
                    programID={this.state.programID}
                    organicUnit={this.state.organicUnit}
                    retriveMovement={this.state.retriveMovement}
                    deleteMovementID={this.state.deleteMovementID}
                />
            </>);
    }

}

export default Payment;
