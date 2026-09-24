import React, {Component} from 'react';
import axios from 'axios';
import app from '../../../Constants';
import PNotify from "pnotify/dist/es/PNotify";

import 'jspdf-autotable';

import {
    Row,
    Col,
    Card,
    Form, Table, OverlayTrigger, Tooltip,

} from 'react-bootstrap';
import moment from "moment";


import component from "../../../Component";


import defaultUser from "../../../../assets/images/user/default.jpg";
import Refresh from "@material-ui/icons/Refresh";
import Search from "@material-ui/icons/Search";

moment.locale('es');


export default class SearchStudent extends Component {

    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        organicUnit: this.props.organicUnit,
        searchPerson: true,
        person: '',
        studentInfo: '',
        persons: [],
        organicUnits: []
    };

    componentDidMount() {


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
    selectectPerson = (r) => {


        this.props.personInfo(r.Student.id)
        this.setState({
            searchPerson: false,
            personMask: r.name,
            documentMask: r.document_number,
            programMask: r.Student.Program.denomination,
            studentType: r.Student.type,
            photoMask: r.photo,
            studentID: r.Student.id
        });

    };
    unSelectectPerson = () => {
        this.props.personInfo('')
        this.setState({
            searchPerson: true,
            personMask: '',
            documentMask: '',
            programMask: '',
            studentType: '',
            photoMask: '',
            studentID: ''
        });
    };

    render() {

        const {  persons, person} = this.state;
        let span = this.state.studentType === 'Retirado' ? 'badge-warning' :
            this.state.studentType === 'Abandonado' ? 'badge-danger' :
                this.state.studentType === 'Postulante' ? 'badge-info' :
                    this.state.studentType === 'Estudiante' ? 'badge-primary' : 'badge-success';

        return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Card style={{marginBottom: "5px"}}>

                        <Card.Header>
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

                        </Card.Header>
                    </Card>
                </Col>
            </Row>
        );
    }
}
