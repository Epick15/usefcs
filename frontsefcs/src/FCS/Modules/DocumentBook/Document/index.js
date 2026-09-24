import React, {Component} from 'react';
import {
    Row, Col, Card, Dropdown, Form

} from 'react-bootstrap';


import PNotify from "pnotify/dist/es/PNotify";

import app from "../../../Constants";
import crypt from "node-cryptex";
import axios from "axios";
import moment from "moment";

import PendientDataTable from "./DataTable/PendientDataTable";

import component from "../../../Component";


// moment.locale('es');


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class AcademicDashboard extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,
        loader: false,
        pendientDocumentPayments: [],

    }


    componentDidMount() {
        this.listDocumentPayment()


    }

    async listDocumentPayment() {
        this.setState({loader: true});
        const url = app.programs + '/' + app.documentBook + '-payment';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({pendientDocumentPayments: res.data});
            }


            this.setState({loader: false});
        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };


    async createDocumentBook(id_payment) {

        this.setState({loaderVoucher: true});


        const url = app.programs + '/' + app.documentBook;

        if (id_payment !== '') {
            let data = new FormData();
            data.set('id_payment', id_payment);


            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({loaderVoucher: false});
                this.listDocumentPayment()

                PNotify.success({
                    title: "Finalizado", text: 'El documento ha sido Generado', delay: 2000
                });

            } catch (err) {
                this.setState({loaderVoucher: false});
                PNotify.error({
                    title: "Oh no!", text: err.response.data.message, delay: 2000
                })
            }
        } else {
            this.setState({loaderVoucher: false})
            PNotify.notice({
                title: "Advertencia!", text: "Complete los campos obligatorios,Correctamente", delay: 2000
            });
        }


    };

    createDocument = (id_payment) => {
        this.createDocumentBook(id_payment)
    }
    callData = () => {
        this.listDocumentPayment()

    }


    render() {

        return (<Row>
            {this.state.loader && component.spiner}
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <PendientDataTable records={this.state.pendientDocumentPayments}
                                   callData={this.callData}
                                   createDocument={this.createDocument}
                />
            </Col>

        </Row>);
    }

}
