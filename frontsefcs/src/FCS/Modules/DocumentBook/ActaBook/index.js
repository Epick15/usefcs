import React, {Component} from 'react';
import {
    Row,
    Col,
    Card, Dropdown, Form

} from 'react-bootstrap';


import PNotify from "pnotify/dist/es/PNotify";

import app from "../../../Constants";
import crypt from "node-cryptex";
import axios from "axios";
import moment from "moment";

import ActaBookDataTable from "./DataTable/ActaBookDataTable";


// moment.locale('es');


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class ActaBook extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,
        documentBookLoader: false,
        pendientDocumentPayments: [],
        documentBooks: [],
    }


    render() {

        return (
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ActaBookDataTable records={[]}
                        // createDocument={this.createDocument}
                    />
                </Col>

            </Row>
        );
    }

}
