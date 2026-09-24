import React, {Component} from 'react';
import {
    Button,
    Card, Col, Dropdown, OverlayTrigger,
    Row, Tooltip
} from "react-bootstrap";
import app from "../../../../../Constants";

import moment from 'moment';
import crypt from "node-cryptex";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

moment.locale('es');


const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
const USERID = localStorage.getItem('USER_ID') ? localStorage.getItem('USER_ID') : '';

export default class Registration extends Component {

    state = {
        payments: [],
    };

    componentDidMount() {

    }

    /*
   *  listPaymentStudent
   * FUNCION PARA CARGAR LOS  EL CRONOGRAMA DE PAGOS DEL ESTUDIANTE
   */
    getPaymentStudent(student) {

        const url = app.accounting + '/' + app.payment + '/list/' + student.id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({payments: res.data})
        }).catch(err => {
            this.setState({

            });
            PNotify.error({
                title: "Oh no!",
                text: "Los costos de estre programa no han sido registrados",
                delay: 2000
            });
            console.log(err)
        })
    };


    render() {
        const {payments} = this.state;

        return (

            <Card>

                <Card.Body>
                    <Row>
                        <Col xl={12}>
                            <h5 className="mt-0">AMORTIZACIONES </h5>


                            <hr/>


                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                    <tr>
                                        <th>Concepto</th>
                                        <th>Monto</th>
                                        <th>Codigo</th>
                                        <th>Comprobante</th>
                                        <th>Estado</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {payments.length > 0 && payments.map((r, i) => {
                                        let span = r.type === 'Pendiente' ? 'warning' : r.type == 'Realizado' ? 'primary' : 'success';
                                        let existVaucher = r.type === 'Pendiente' ? false : true;

                                        return (
                                            <tr key={i}>
                                                <th>
                                                    <div className="d-inline-block align-middle">
                                                        <label style={{marginBottom: '-6px'}}
                                                               className="check-task custom-control custom-checkbox  d-flex justify-content-center">
                                                            <input type="checkbox" className="custom-control-input"
                                                                // onClick={() => this.selectedConcept(k)}
                                                                   readOnly
                                                                   disabled={existVaucher}
                                                                   checked={r.state}
                                                                   value={r.state}
                                                            />
                                                            < span style={{fontSize: '13px'}}
                                                                   className="custom-control-label">{r.denomination}</span>
                                                        </label>

                                                    </div>
                                                </th>
                                                <td className="text-center">S/. {r.amount}</td>
                                                <td>{r.code ? r.code : 'No definido'}</td>
                                                <td className="text-center">
                                                    {
                                                        existVaucher ?
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>Ver detalles</Tooltip>}>
                                                                  <span type="button">
                                                                        <i className={'material-icons text-' + span}>receipt</i>
                                                                  </span>
                                                            </OverlayTrigger>
                                                            :
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>Registrar comprobante</Tooltip>}>
                                                                  <span type="button">
                                                                        <i className={'material-icons text-' + span}>receipt</i>
                                                                  </span>
                                                            </OverlayTrigger>

                                                    }


                                                </td>
                                                <td><span className={'badge badge-' + span + ' inline-block'}>{r.type}</span></td>

                                            </tr>
                                        )
                                    })}


                                    </tbody>
                                </table>
                            </div>


                            <hr/>
                            <div className="row">


                                <div className="col-sm-6">
                                    <button type="button" onClick={() => this.saveRegistration()} className="btn btn-block btn-lg btn-danger mt-md-0 mt-2">
                                        <i className="fas fa-bolt mr-1"/> Generar codigo de pago
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>


        )
    }
}
