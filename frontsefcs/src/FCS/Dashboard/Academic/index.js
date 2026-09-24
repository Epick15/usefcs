import React, {Component} from 'react';
import {Card, Col, Form, Row} from 'react-bootstrap';

import Aux from "../../../hoc/_Aux";
import PNotify from "pnotify/dist/es/PNotify";

import app from "../../Constants";
import crypt from "node-cryptex";
import axios from "axios";
import moment from "moment";
import Chart from "react-apexcharts";

// moment.locale('es');


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class AcademicDashboard extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,

        totalStudent: '',
        totalStudentInscription: '',
        totalStudentRegistration: '',
        totalStudentEgress: '',
        totalStudentEgressTotal: '',
        totalStudentDesertionTotal: '',
        process: '',
        processRegistration: '',
        processEgress: '',
        processRequiredDocument: '',
        stateRequiredDocument: true,
        processs: [],
        seriesInscription: [],
        seriesRegistration: [],
        seriesEgress: [],
        seriesRequiredDocument: [],
        optionsRequiredDocument: {},
        optionsInscription: {},
        optionsEgress: {},
        optionsRegistration: {},


    }


    componentDidMount() {

        this.state.organicUnit && this.getActualAcademicCalendar(this.state.organicUnit);
        this.listAcademicSemesterAndAcademicCalendar()
        this.totalStudentByState()
        this.totalStudentByStateEgress()
        this.totalStudentByStateDesertion()
    }

    async totalStudentByState(process) {
        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-total-student';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                    totalStudent: res.data.totalStudent
                });
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async totalStudentByStateEgress() {
        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-total-student-egress';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                    totalStudentEgressTotal: res.data.totalStudent
                });
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async totalStudentByStateDesertion() {
        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-total-student-desertion';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                    totalStudentDesertionTotal: res.data.totalStudent
                });
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async chartInscriptionProcess(process) {
        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-inscription/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                        seriesInscription: [{data: res.data.cant}],
                        optionsInscription: {
                            chart: {
                                type: 'bar',
                                height: 350
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                }
                            },
                            options: {
                                title: {
                                    text: 'Product Trends by Month',
                                    align: 'left'
                                },
                            },
                            colors: ['#0e9e4a'],
                            dataLabels: {
                                enabled: true
                            },
                            xaxis: {
                                categories: res.data.program
                            }
                        },
                        totalStudentInscription: res.data.total
                    }
                );
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async chartRegistrationProcess(process) {
        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-registration/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                        seriesRegistration: [{data: res.data.cant}],
                        optionsRegistration: {
                            chart: {
                                type: 'bar',
                                height: 350
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                },


                            },
                            options: {
                                title: {
                                    text: 'Product Trends by Month',
                                    align: 'left'
                                },
                            },
                            colors: ['#0e9e4a'],
                            dataLabels: {
                                enabled: true
                            },
                            xaxis: {
                                categories: res.data.program
                            },
                            grid: {
                                xaxis: {
                                    lines: {
                                        show: true
                                    }
                                }
                            },
                            yaxis: {
                                reversed: false,
                                axisTicks: {
                                    show: true
                                }
                            }
                        },
                        totalStudentRegistration: res.data.total
                    }
                );
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async chartEgressProcess(process) {
        this.setState({studentLoader: true});
        const url = app.general + '/chart-egress/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                        seriesEgress: [{data: res.data.cant}],
                        optionsEgress: {
                            chart: {
                                type: 'bar',
                                height: 350
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                },


                            },
                            options: {
                                title: {
                                    text: 'Product Trends by Month',
                                    align: 'left'
                                },
                            },
                            colors: ['#0e9e4a'],
                            dataLabels: {
                                enabled: true
                            },
                            xaxis: {
                                categories: res.data.program
                            },
                            grid: {
                                xaxis: {
                                    lines: {
                                        show: true
                                    }
                                }
                            },
                            yaxis: {
                                reversed: false,
                                axisTicks: {
                                    show: true
                                }
                            }
                        },
                        totalStudentEgress: res.data.total
                    }
                );
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async chartStudentRequiredDocumentProcess(state, process) {
        this.setState({studentLoader: true});
        const url = app.general +  '/chart-student-required-document/' + state + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({
                        seriesRequiredDocument: [{
                            data: res.data.cant
                        }],
                        optionsRequiredDocument: {
                            chart: {
                                type: 'bar',
                                height: 350
                            },

                            plotOptions: {
                                bar: {
                                    borderRadius: 15,
                                    horizontal: true,
                                }
                            },
                            dataLabels: {
                                enabled: true
                            },
                            xaxis: {
                                categories: res.data.program
                            },
                            grid: {
                                xaxis: {
                                    lines: {
                                        show: true
                                    }
                                }
                            },
                            yaxis: {
                                reversed: false,
                                axisTicks: {
                                    show: true
                                }
                            }
                        }
                    }
                );
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async listAcademicSemesterAndAcademicCalendar() {
        this.setState({calendarLoader: true});
        const url = app.general + '/' + app.academicSemester + '/' + app.academicCalendar + '/all';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                processs: res.data,
                process: res.data[1].id,
                processRegistration: res.data[1].id,
                processEgress: res.data[1].id,
                processRequiredDocument: res.data[1].id
            });
            this.chartInscriptionProcess(res.data[1].id)
            this.chartRegistrationProcess(res.data[1].id)
            this.chartEgressProcess(res.data[1].id)
            this.chartStudentRequiredDocumentProcess(this.state.stateRequiredDocument, res.data[1].id)
            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };


    getActualAcademicCalendar(id) {
        const url = app.general + '/' + app.academicCalendar + '/' + id + '/actual';
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({academicCalendars: res.data});
            } else {
                this.setState({academicCalendars: ""});
            }
        }).catch(err => {
            // PNotify.error({
            //     title: "Oh no!",
            //     text: "Error al cargar calendario",
            //     delay: 2000
            // });
            console.log(err);
        })
    }

    handleChange = field => event => {
        switch (field) {

            case 'process':
                this.setState({
                    process: event.target.value
                });
                this.chartInscriptionProcess(event.target.value)
                break;
            case 'processRegistration':
                this.setState({
                    processRegistration: event.target.value
                });
                this.chartRegistrationProcess(event.target.value)
                break;
            case 'processEgress':
                this.setState({
                    processEgress: event.target.value
                });
                this.chartEgressProcess(event.target.value)
                break;
            case 'processRequiredDocument':
                this.setState({
                    processRequiredDocument: event.target.value
                });
                this.chartStudentRequiredDocumentProcess(this.state.stateRequiredDocument, event.target.value)
                break;

            case 'stateRequiredDocument':
                this.setState({
                    stateRequiredDocument: event.target.value
                });
                this.chartStudentRequiredDocumentProcess(event.target.value, this.state.processRegistration)
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <Aux>

                <Row>
                    <Col xl={4} md={12}>
                        <Card className="bg-facebook order-card">
                            <Card.Body>
                                <h6 className="text-white">TOTAL DE ESTUDIANTES</h6>
                                <h2 className="text-white">{this.state.totalStudent}</h2>
                                <p className="m-b-0">Total </p>
                                {/*<i className="card-icon feather icon-users"/>*/}
                                <i className="card-icon fas fa-user-graduate f-36 "/>

                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={4} md={12}>
                        <Card className="bg-linkedin order-card">
                            <Card.Body>
                                <h6 className="text-white">TOTAL DE DESERTADOS</h6>
                                <h2 className="text-white">{this.state.totalStudentDesertionTotal}</h2>
                                <p className="m-b-0">Total</p>
                                <i className="card-icon fas fa-user f-36 "/>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={4} md={12}>
                        <Card className="bg-twitter order-card">
                            <Card.Body>
                                <h6 className="text-white">TOTAL DE EGRESADOS</h6>
                                <h2 className="text-white">{this.state.totalStudentEgressTotal}</h2>
                                <p className="m-b-0">Total </p>
                                <i className="card-icon fas fa-user-tie f-36 "/>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xl={6}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>

                                        <h3 style={{marginBottom: '0px'}}> {this.state.totalStudentInscription}</h3>
                                        <h6 style={{marginBottom: '0px', marginTop: '-5px'}}>INGRESANTES POR
                                            SEMESTRE</h6>

                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group className="form-group fill">

                                            <Form.Control as="select"
                                                          value={this.state.process}
                                                          onChange={this.handleChange('process')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                {
                                                    this.state.processs.length > 0 ?
                                                        this.state.processs.map((r, index) => {

                                                            return (
                                                                <option
                                                                    id={"processmask-" + r.id}
                                                                    value={r.id}
                                                                    key={index}
                                                                    data-processmask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                >
                                                                    {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                </option>
                                                            )

                                                        }) :
                                                        <option defaultValue={true}>Error al cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>

                                    <Col sm={12}>
                                        <div className="chart-percent text-center">
                                            <Chart options={this.state.optionsInscription}
                                                   series={this.state.seriesInscription} type="bar"
                                                   height={200}/>
                                        </div>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>

                    </Col>
                    <Col xl={6}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <h3 style={{marginBottom: '0px'}}> {this.state.totalStudentRegistration}</h3>
                                        <h6 style={{marginBottom: '0px', marginTop: '-5px'}}>MATRICULAS POR
                                            SEMESTRE</h6>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group className="form-group fill">

                                            <Form.Control as="select"
                                                          value={this.state.processRegistration}
                                                          onChange={this.handleChange('processRegistration')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                {
                                                    this.state.processs.length > 0 ?
                                                        this.state.processs.map((r, index) => {

                                                            return (
                                                                <option
                                                                    id={"processmask-" + r.id}
                                                                    value={r.id}
                                                                    key={index}
                                                                    data-processmask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                >
                                                                    {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                </option>
                                                            )

                                                        }) :
                                                        <option defaultValue={true}>Error al cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <div className="chart-percent text-center">
                                            <Chart options={this.state.optionsRegistration}
                                                   series={this.state.seriesRegistration} type="bar"
                                                   height={200}/>
                                        </div>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={6}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <h3 style={{marginBottom: '0px'}}> {this.state.totalStudentEgress}</h3>
                                        <h6 style={{marginBottom: '0px', marginTop: '-5px'}}>EGRESADOS POR
                                            SEMESTRE</h6>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group className="form-group fill">

                                            <Form.Control as="select"
                                                          value={this.state.processEgress}
                                                          onChange={this.handleChange('processEgress')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                {
                                                    this.state.processs.length > 0 ?
                                                        this.state.processs.map((r, index) => {

                                                            return (
                                                                <option
                                                                    id={"processmask-" + r.id}
                                                                    value={r.id}
                                                                    key={index}
                                                                    data-processmask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                >
                                                                    {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                </option>
                                                            )

                                                        }) :
                                                        <option defaultValue={true}>Error al cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <div className="chart-percent text-center">
                                            <Chart options={this.state.optionsEgress}
                                                   series={this.state.seriesEgress} type="bar"
                                                   height={200}/>
                                        </div>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={6}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <h6>DOCUMENTOS DE ESTUDIANTES</h6>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Control as="select"
                                                          value={this.state.stateRequiredDocument}
                                                          onChange={this.handleChange('stateRequiredDocument')}>
                                                >

                                                <option value={true}> Pendiente</option>
                                                <option value={false}> Completado</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Control as="select"
                                                          value={this.state.processRequiredDocument}
                                                          onChange={this.handleChange('processRequiredDocument')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                {
                                                    this.state.processs.length > 0 ?
                                                        this.state.processs.map((r, index) => {

                                                            return (
                                                                <option
                                                                    id={"processmask-" + r.id}
                                                                    value={r.id}
                                                                    key={index}
                                                                    data-processmask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                >
                                                                    {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                </option>
                                                            )

                                                        }) :
                                                        <option defaultValue={true}>Error al cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <div className="chart-percent text-center">
                                            <Chart options={this.state.optionsRequiredDocument}
                                                   series={this.state.seriesRequiredDocument} type="bar"
                                                   height={200}/>
                                        </div>
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}
