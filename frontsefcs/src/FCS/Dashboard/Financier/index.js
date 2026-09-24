import React, {Component} from 'react';
import {
    Row, Col, Card, Dropdown, Form

} from 'react-bootstrap';

import Aux from "../../../hoc/_Aux";
import DEMO from "../../../store/constant";
import avatar2 from '../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../assets/images/user/avatar-4.jpg';
import PNotify from "pnotify/dist/es/PNotify";

import app from "../../Constants";
import crypt from "node-cryptex";
import axios from "axios";
import moment from "moment";

import avatar5 from "../../../assets/images/user/avatar-5.jpg";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import DataTable from "./DataTable";
import Chart from "react-apexcharts";
import percentageChart from "../../../Demo/Widget/chart/percentage-chart";
import component from "../../Component";

// moment.locale('es');


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class FinancierDashboard extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,


        startDate: '2022-01-01', totalStudentPaymentPendient: 0, endDate: moment().format('YYYY-MM-DD'),


        seriesMovement: [], studentPaymentPendients: [],

        optionsMovement: {},


    }


    componentDidMount() {

        this.state.organicUnit && this.getActualAcademicCalendar(this.state.organicUnit);
        this.listAcademicSemesterAndAcademicCalendar()
        this.listAcademicSemesterAndAcademicCalendar()

        this.totalStudentPaymentPendient()
        this.chartEntryMovement(this.state.startDate, this.state.endDate)
    }

    async chartEntryMovement(startDate, endDate) {

        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-movement-entry';
        let data = new FormData();
        data.set('startDate', startDate);
        data.set('endDate', endDate);
        try {
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                let total = 0;
                res.data.cant.map((r) => {
                    total = r + total
                })
                this.setState({


                    seriesMovement: res.data.cant, optionsMovement: {
                        chart: {
                            width: 380, type: 'pie',
                        }, labels: res.data.program, responsive: [{
                            breakpoint: 480, options: {
                                chart: {
                                    width: 200
                                }, legend: {
                                    position: 'bottom'
                                }
                            }
                        }]

                    }, totalBrutalEntry: total
                });
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
        }
    };

    async chartEntryEgressNetoMovement(startDate, endDate) {

        this.setState({studentLoader: true});
        const url = app.general + '/' + 'chart-movement-een';
        let data = new FormData();
        data.set('startDate', startDate);
        data.set('endDate', endDate);
        try {
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                let total = 0;
                res.data.cant.map((r) => {
                    total = r + total
                })
                this.setState({


                    seriesMovement: res.data.cant, optionsMovement: {
                        chart: {
                            width: 380, type: 'pie',
                        }, labels: res.data.program, responsive: [{
                            breakpoint: 480, options: {
                                chart: {
                                    width: 200
                                }, legend: {
                                    position: 'bottom'
                                }
                            }
                        }]

                    }, totalBrutalEntry: total
                });
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
                process: res.data[0].id,
                processRegistration: res.data[0].id,
                processRequiredDocument: res.data[0].id
            });

            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async listStudentPaymentPendient() {
        this.setState({sudentLoader: true});
        const url = app.general + '/chart-student-payment-pendient';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                studentPaymentPendients: res.data,

            });

            this.setState({sudentLoader: false});
        } catch (err) {
            this.setState({sudentLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async totalStudentPaymentPendient() {
        this.setState({calendarLoader: true});
        const url = app.general + '/chart-total-payment-pendient';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                totalStudentPaymentPendient: res.data.totalStudentPaymentPendient,

            });

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

            case 'startDate':
                this.setState({
                    startDate: event.target.value
                });
                this.chartEntryMovement(event.target.value, this.state.endDate)
                //this.chartEntryEgressNetoMovement(event.target.value, this.state.endDate)

                break;
            case 'endDate':
                this.setState({
                    endDate: event.target.value
                });
                this.chartEntryMovement(this.state.startDate, event.target.value)
                //this.chartEntryEgressNetoMovement(this.state.startDate, event.target.value)
                break;

            default:
                break;
        }
    }

    render() {
        const {startDate, endDate} = this.state;
        return (<Aux>

            <Row>
                <Col xl={6} md={12}>
                    <Card className="bg-linkedin order-card">
                        <Card.Body>
                            <h6 className="text-white">TOTAL INGRESOS BRUTO</h6>
                            <h2 className="text-white"> S/. {this.state.totalBrutalEntry}</h2>
                            <p className="m-b-0">Segun fechas seleccionadas </p>
                            {/*<i className="card-icon feather icon-users"/>*/}
                            <i className="card-icon fas fa-coins f-36 "/>

                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} md={12}>
                    <Card className="order-card" style={{background: '#ff4560'}}>
                        <Card.Body>
                            <h6 className="text-white">TOTAL PAGOS PENDIENTES</h6>
                            <h2 className="text-white"> S/. {this.state.totalStudentPaymentPendient}</h2>
                            <p className="m-b-0">Desde el 2000 - 1 hasta hoy</p>
                            {/*<i className="card-icon feather icon-users"/>*/}
                            <i className="card-icon fas fa-coins f-36 "/>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <h6>INGRESO BRUTO DE PROGRAMAS POR FECHAS</h6>
                                </Col>
                                <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                            // style={startDate === "" ? {color: "#ff5252 "} : null}
                                        >
                                            Fecha Inicio
                                            <small className="text-danger"> *</small>
                                        </Form.Label>

                                        <Form.Control
                                            type="date"
                                            max="2999-12-31"
                                            onChange={this.handleChange('startDate')}
                                            value={startDate}
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                            // style={startDate === "" ? {color: "#ff5252 "} : null}
                                        >
                                            Fecha Fin
                                            <small className="text-danger"> *</small>
                                        </Form.Label>

                                        <Form.Control
                                            type="date"
                                            max="2999-12-31"
                                            onChange={this.handleChange('endDate')}
                                            value={endDate}
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>

                                <Col sm={12}>
                                    <div className="chart-percent text-center">
                                        <Chart options={this.state.optionsMovement}
                                               series={this.state.seriesMovement} type="donut"
                                               height={400}/>
                                    </div>
                                </Col>

                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Aux>);
    }
}
