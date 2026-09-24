import React, {Component} from 'react';
import {
    Button,
    Card,
    Col,

    Dropdown,
    Form,

    Row, Table,

} from "react-bootstrap";
import app from "../../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';

import crypt from "node-cryptex";


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class DetailCourse extends Component {

    state = {


        organicUnit: info ? info.id_organic_unit : null,

        isVarying: false,
        course: "",
        studentID: this.props.studentID,
        historys: [
            {
                "id": 139,
                "document": "",
                "teacher": "Juan Alberto Riascos Armas",
                "user_change": "Administrador",
                "reazon": "",
                "description": "Registro de nota",
                "date": "2020-06-28T14:24:02-05:00",

            },
            {
                "id": 139,
                "document": 564646,
                "teacher": "",
                "user_change": "Administrador",
                "reazon": "El docente se equivoco",
                "description": "Cambio de nota",
                "date": "2020-06-28T14:24:02-05:00",

            },
            {
                "id": 139,
                "document": 564646,
                "teacher": "",
                "user_change": "Administrador",
                "reazon": "El estudiante se retiro",
                "description": "Retirado",
                "date": "2020-06-28T14:24:02-05:00",
            },
        ]
    };

    componentDidMount() {

    }

    updateGradeStudentCourse() {
        this.setState({load: true})
        const url = app.registration + '/' + app.registrations + '/grade/' + app.student + '/' + this.state.currentID;

        const {note, approved, state} = this.state;
        if (note !== '' && approved !== '' && state !== '') {
            let data = new FormData();
            data.set('note', note);
            data.set('approved', approved);
            data.set('state', state);

            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });

                this.props.getRecordStudent(this.state.studentID);
                this.setState({load: false});
            }).catch(() => {
                this.setState({load: false});
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({load: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    updateRemoveStudentCourse() {
        this.setState({load: true})
        const url = app.registration + '/' + app.registrations + '/remove/' + app.student + '/' + this.state.currentID;

        const {note, approved, state} = this.state;
        if (note !== '' && approved !== '' && state !== '') {
            let data = new FormData();

            data.set('state', "Retirado");

            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });

                this.props.getRecordStudent(this.state.studentID);
                this.setState({load: false});
            }).catch(() => {
                this.setState({load: false});
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({load: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };


    handleOpenModal = (course) => {
        this.setState({
            currentID: course.id,
            note: course.note,
            approved: false,
            state: course.state,
            denomination: course.Course.denomination,
            isVarying: true,
        });
    };
    // console.log(course)


    handleCloseModal = () => {
        this.setState({
            currentID: "",
            note: "",
            approved: "",
            state: "",
            denomination: "",
            isVarying: false,
        })

    };

    handleChange = field => event => {
        switch (field) {

            case 'note':
                let _note = event.target.value;

                if (_note < 0) {
                    //no se permite nota menor a cero
                    alert("no se permite nota menor a cero");
                    _note = "";
                } else if (_note > 20) {
                    _note = "";
                    alert("no se permite nota maayor a 20")
                    //no se permite nota maayor a 20
                }

                if (_note !== "") {
                    if (_note >= 0 && _note < 11) {
                        this.setState({state: "Desaprobado", approved: false})
                    } else if (_note > 10 && _note <= 20) {
                        this.setState({state: "Aprobado", approved: true})
                    }
                }

                this.setState({note: _note});
                break;


            default:
                break;
        }
    };

    render() {
        //state frontend
        const {isVarying, load, historys} = this.state;

        const {denomination, state, note} = this.state;


        const fullScreenStyle = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: this.props.windowWidth,
            // overflowY: 'auto',
            height: '100%'
        };
        const scrollable = {
            overflowY: 'auto',
            maxHeight: ' 900px',
        };
        return (
            <>
                {isVarying &&
                <Row className='btn-page'>
                    <Card className={"full-card"} style={fullScreenStyle}>
                        <Card.Header style={{background: '#4680ff'}}>
                            <Card.Title as='h5' style={{color: 'white', fontSize: '20px'}}>{denomination}</Card.Title>
                            <div className="d-inline-block pull-right">

                                <div className="card-header-right">

                                    <Dropdown alignRight={true} className="pull-right mt-2">
                                        <Dropdown.Toggle className="btn-icon" style={{
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            color: 'white',


                                        }}>
                                            <i
                                                onClick={() => this.setState({isVarying: false})}
                                                className="material-icons pull-right "
                                            >close</i>
                                        </Dropdown.Toggle>

                                    </Dropdown>
                                </div>


                            </div>
                        </Card.Header>
                        <Card.Body style={scrollable}>
                            <Row>
                                <Col xl={3}>
                                    {/*{state === "Cursando" ?*/}

                                    <Card className="border mb-15 shadow-none">
                                        <Card.Body>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                                    <h5 className="mb-0">RETIRAR AL ESTUDIANTE DEL CURSO</h5>
                                                    <hr/>

                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label className="floating-label">Razon</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            // onKeyPress={this.handleKeyPress}
                                                            id="number"
                                                            // value={ambient}
                                                            // onChange={this.handleChange('ambient')}
                                                            placeholder="Ingrese descripción"
                                                            margin="normal"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                                    <Button
                                                        className="pull-right"
                                                        disabled={load}
                                                        variant="primary"
                                                        onClick={() => this.updateRemoveStudentCourse()}
                                                    >
                                                        {load &&
                                                        <span className="spinner-border spinner-border-sm mr-1"
                                                              role="status"/>}
                                                        RETIRAR
                                                    </Button>

                                                </Col>
                                            </Row>

                                        </Card.Body>
                                    </Card>
                                    {/*:*/}

                                    <Card className="border mb-15 shadow-none">
                                        <Card.Body>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                                    <h5 className="mb-0">CAMBIAR NOTA - {state}</h5>
                                                    <hr/>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label className="floating-label">Nota</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            // onKeyPress={this.handleKeyPress}
                                                            id="number"
                                                            value={note}
                                                            onChange={this.handleChange('note')}
                                                            placeholder="Ingrese descripción"
                                                            margin="normal"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label className="floating-label">Documento</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            // onKeyPress={this.handleKeyPress}
                                                            id="number"
                                                            // value={ambient}
                                                            // onChange={this.handleChange('ambient')}
                                                            placeholder="Ingrese descripción"
                                                            margin="normal"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label className="floating-label">Razon</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            // onKeyPress={this.handleKeyPress}
                                                            id="number"
                                                            // value={ambient}
                                                            // onChange={this.handleChange('ambient')}
                                                            placeholder="Ingrese descripción"
                                                            margin="normal"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                                    <Button
                                                        className="pull-right"
                                                        load={load}
                                                        variant="primary"
                                                        onClick={() => this.updateGradeStudentCourse()}
                                                    >
                                                        {load &&
                                                        <span className="spinner-border spinner-border-sm mr-1"
                                                              role="status"/>}
                                                        Guardar Cambios
                                                    </Button>

                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    {/*}*/}


                                </Col>
                                <Col xl={9}>
                                    <Card className="border mb-15 shadow-none">
                                        <Card.Body>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                                    <h5 className="mb-0">HISTORIAL DE CAMBIOS</h5>
                                                    <hr/>

                                                </Col>
                                                <Table hover responsive style={{marginTop: '-1px'}}>
                                                    <tbody>
                                                    {historys.length > 0 &&
                                                    historys.map((r, i) => {
                                                        return (
                                                            <tr
                                                                key={i}

                                                            >
                                                                <td scope="row">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <h6 className={'m-b-0 program-'}>{r.teacher || r.user_change}</h6>
                                                                            <p className={'m-b-0 mention-'}>{moment(r.date).format('LLL')}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td scope="row">

                                                                    <p className={'m-b-0 mention-'}>{r.document}</p>

                                                                </td>
                                                                <td scope="row">

                                                                    <p className={'m-b-0 mention-'}>{r.reazon}</p>

                                                                </td>
                                                                <td scope="row">

                                                                    <p className={'m-b-0 mention-'}>{r.description}</p>

                                                                </td>

                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                    </tbody>
                                                </Table>

                                            </Row>
                                        </Card.Body>
                                    </Card>


                                </Col>
                            </Row>
                        </Card.Body>

                    </Card>
                </Row>

                }
            </>
        )
    }
}
