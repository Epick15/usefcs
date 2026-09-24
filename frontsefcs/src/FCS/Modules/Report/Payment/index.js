import React, {Component} from 'react';

import axios from 'axios';
import app from '../../../Constants';
import PNotify from "pnotify/dist/es/PNotify";

import 'jspdf-autotable';


import {Col, Row,} from 'react-bootstrap';
import moment from "moment";


import component from "../../../Component";


import DataTableVoucher from "./DataTableVoucher";
import DataTableAmortization from "./DataTableAmortization";


moment.locale('es');


export default class Report extends Component {

    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        infoStudent: '',
        movements: [],
        payments: [],
    };

    componentDidMount() {
        this.props.studentID !== '' &&
        this.listPaymentStudent(this.props.studentID) &&
        this.listMovement(this.props.studentID) &&
        this.listTotalBalance(this.props.studentID) &&
        this.retrieveStudent(this.props.studentID)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID !== '' &&
            this.listPaymentStudent(this.props.studentID) &&
            this.listMovement(this.props.studentID) &&
            this.listTotalBalance(this.props.studentID) &&
            this.retrieveStudent(this.props.studentID)
        }

    }

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
                        temp.push(
                            {
                                "id": r.id,
                                "concept": r.Concept.denomination,
                                "amount": r.amount,
                                "id_process": r.Academic_semester.Academic_calendar.id,
                                "process": r.Academic_semester.Academic_calendar.denomination.substr(-4) + ' - ' + r.Academic_semester.denomination.substr(-2),
                                "type": r.type,
                                "created_at": r.created_at,
                                "updated_at": r.updated_at,
                            }
                        )
                    }
                )
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
        // this.setState({movementLoader: true});
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
            // this.setState({movementLoader: false});
        } catch (err) {
            // this.setState({movementLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async retrieveStudent(id_student) {
        // this.setState({registrationDataLoader: true});
        const url = app.person + '/' + app.student + '/' + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    // title1, facultad, program, sede, student, totalPayment,
                    infoStudent: {
                        facultad: res.data.Program.Organic_unit_origin.denomination,
                        sede: res.data.Program.Organic_unit_register.Campu.denomination,
                        program: res.data.Program.denomination,
                        name: res.data.Person.name,
                        document: res.data.Person.document_number,
                    }
                })
            }
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    render() {


        return (
            <Row>

                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {this.state.movementLoader && component.spiner}
                            {
                                this.state.movements.length > 0 && this.state.infoStudent !== '' &&
                                < DataTableVoucher
                                    infoStudent={this.state.infoStudent}
                                    movements={this.state.movements}
                                />
                            }


                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {this.state.conceptLoader && component.spiner}
                            {
                                this.state.movements.length > 0 && this.state.infoStudent !== '' &&
                                <DataTableAmortization
                                    infoStudent={this.state.infoStudent}
                                    payments={this.state.payments}

                                />
                            }

                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
