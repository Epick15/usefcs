import React, {Component} from 'react';
import {

    Card,
    Col,

    Row

} from "react-bootstrap";
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";


import moment from 'moment';

import crypt from "node-cryptex";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class Workload extends Component {

    state = {

        // startDate: moment().format('l'),
        // startDate: new Date(),
        /////////STATE FORM////////////
        denomination: '',
        vaucherCode: '',
        stateEntry: '',
        amount: '',
        startDate: '',
        concept: '',
        observation: '',

        disabled: false,

        action: 'add',
        currentID: '',
        title: '',
        isVarying: false,
        concepts: [],
    };

    componentDidMount() {

    }

    getConcepts() {

        const url = app.accounting + '/' + app.concepts + '/only/Entry';
        axios.get(url, app.headers).then(res => {

            if (res.data) this.setState({concepts: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveEntry(cashboxProps, initialBalanceID) {

        const url = app.accounting + '/' + app.cashBoxFlow;
        const {denomination, vaucherCode, stateEntry, amount, startDate, concept, observation} = this.state;
        if (vaucherCode !== '' && stateEntry !== '' && amount !== '' && startDate !== '' && concept !== '') {

            let data = new FormData();
            data.set('denomination', denomination);
            data.set('id_parent', initialBalanceID);
            data.set('id_user', crypt.encrypt(info.user.id, k, v));
            data.set('voucher', vaucherCode);
            data.set('id_cashbox', cashboxProps);
            data.set('state', stateEntry);
            data.set('amount', amount);
            data.set('date', moment(startDate).format('YYYY-MM-DD h:mm:ss'));
            data.set('id_concepts', concept);
            data.set('observation', observation);
            axios.post(url, data, app.headers).then(() => {

                this.closeModal();
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.props.getCashBoxFlow();


            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    updateEntry() {

        const url = app.accounting + '/' + app.cashBoxFlow + '/' + this.state.currentID;
        const {denomination, vaucherCode, stateEntry, amount, startDate, concept, observation} = this.state;
        if (vaucherCode !== '' && stateEntry !== '' && amount !== '' && startDate !== '' && concept !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('voucher', vaucherCode);
            data.set('state', stateEntry);
            data.set('amount', amount);
            data.set('date', moment(startDate).format('YYYY-MM-DD h:mm:ss'));
            data.set('id_concepts', concept);
            data.set('observation', observation);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.closeModal();
                this.props.getCashBoxFlow();

            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    closeModal = () => {
        this.setState({
            isVarying: false,
            action: 'add',
            denomination: '',
            vaucherCode: '',
            stateEntry: '',
            amount: '',
            amountMask: '',
            startDate: '',
            concept: '',
            observation: '',
        })
    };


    //Operation Functions
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.action === 'add') {
                this.saveConcepts();
            } else {
                this.updateConcepts();
            }

        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                this.setState({denomination: event.target.value.replace(/[^A-Za-záéíóúüÁÉÍÓÚÜ ]/g, '').toUpperCase()});
                break;
            case 'vaucherCode':
                this.setState({vaucherCode: event.target.value});
                break;
            case 'stateEntry':

                this.setState({stateEntry: event.target.value});
                break;
            case 'amount':

                this.setState({
                    amount: event.target.value.substr(4).replace(/,/g, ''),
                    amountMask: event.target.value
                });
                break;
            case 'startDate':
                console.log(event);
                this.setState({startDate: event});
                break;
            case 'concept':
                this.setState({concept: event.target.value});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            default:
                break;
        }
    };
    handleOpenModal = () => {
        this.getConcepts();
        this.setState({
            titleModal: 'NUEVO INGRESO',
            isVarying: true,
            action: 'add',
            denomination: ''
        });

    };
    handleCloseModal = () => {
        this.setState({
            isVarying: false,
            action: 'update',
            titleModal: 'NUEVO INGRESO',
            currentID: '',
            denomination: '',
            vaucherCode: '',
            stateEntry: '',
            amount: '',
            amountMask: '',
            startDate: '',
            concept: '',
            observation: '',
        })
    };
    handleRetrieveEntry = record => {
        this.getConcepts();
        this.setState({
            isVarying: true,
            action: 'update',
            titleModal: 'MODIFICAR INGRESO',
            currentID: record.id,
            denomination: record.denomination || '',
            vaucherCode: record.voucher || '',
            stateEntry: record.state || '',
            amount: record.amount || '',
            amountMask: record.amount || '',
            startDate: new Date(record.date) || '',
            concept: record.id_concepts || '',
            observation: record.observation || '',
        })
    };
    handleOpenSweetAlertWarning = (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            customClass: {
                container: 'my-swal'
            }
        }).then((result) => {
            if (result.value) {
                this.deleteConcepts(id);
            }
        })
    };


    render() {
        //state frontend


        return (
            <Card>
                <Card.Body
                    className='d-flex align-items-center justify-content-between'>
                    <h5 className="mb-0">Carga Horaria</h5>
                    {/*<button type="button"*/}
                    {/*        className="btn btn-primary btn-sm rounded m-0 float-right"*/}
                    {/*        onClick={() => this.setState({isOtherEdit: !this.state.isOtherEdit})}>*/}
                    {/*    <i className={this.state.isOtherEdit ? 'feather icon-x' : 'feather icon-plus'}/>*/}
                    {/*</button>*/}
                </Card.Body>
                <Card.Body
                    className={this.state.isOtherEdit ? 'border-top pro-det-edit collapse' : 'border-top pro-det-edit collapse show'}>
                    En desarrollo
                </Card.Body>
                <Card.Body
                    className={this.state.isOtherEdit ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Occupation</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   placeholder="Full Name"
                                   defaultValue="Designer"/>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Skills</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   placeholder="Skill"
                                   defaultValue="C#, Javascript, Scss"/>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Jobs</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   placeholder="Skill"
                                   defaultValue="Phoenixcoded"/>
                        </Col>
                    </Row>
                    <Row className="form-group">
                        <label className="col-sm-3 col-form-label"/>
                        <Col sm={9}>
                            <button type="submit" className="btn btn-primary"
                                    onClick={() => this.setState({isOtherEdit: !this.state.isOtherEdit})}>Save
                            </button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}
