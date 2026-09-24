import React, {Component} from 'react';
import {
    Button,
    Col,
    Dropdown,
    Form,
    Modal, Row
} from "react-bootstrap";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

import DatePicker from "react-datepicker";
import moment from 'moment';
import NumberFormat from "react-number-format";
import crypt from "node-cryptex";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class Entry extends Component {

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
            data.set('id_user', crypt.encrypt(info.id, k, v));
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

    updateEntry()  {

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
        const {denomination, vaucherCode, stateEntry,  amountMask, startDate, concept, observation} = this.state;
        const {concepts} = this.state;
        const cashboxProps = this.props.cashBox;
        const initialBalanceID = this.props.initialBalanceID;
        const {titleModal, action, disabled} = this.state;

        return (
            <>
                <Modal show={this.state.isVarying} onHide={() => this.setState({isVarying: false})}>
                    <Modal.Header style={{background: '#20c997'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>{titleModal}</Modal.Title>
                        <div className="d-inline-block pull-right">

                            <Dropdown alignRight={true} className="pull-right mr-n3 mt-n1">
                                <Dropdown.Toggle className="btn-icon" style={{
                                    border: 'none',
                                    background: 'none',
                                    outline: 'none',
                                    color: '#ffffff00',
                                    height: '5px'

                                }}>
                                    <i
                                        onClick={() => this.handleCloseModal()}
                                        className="material-icons pull-right mr-n2 mt-n1"
                                        style={{color: 'white'}}>close</i>
                                </Dropdown.Toggle>

                            </Dropdown>


                        </div>
                    </Modal.Header>
                    <Modal.Body>

                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id="number"
                                        value={denomination}
                                        onChange={this.handleChange('denomination')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Codigo de Comprobante</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id="number"
                                        value={vaucherCode}
                                        onChange={this.handleChange('vaucherCode')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Estado</Form.Label>
                                    <Form.Control as="select"
                                                  value={stateEntry}
                                                  onChange={this.handleChange('stateEntry')}>
                                        >
                                        <option defaultValue={true} hidden>Seleccione una
                                            opcción</option>
                                        <option value="Recibido">Recibido</option>
                                        <option value="Pendiente">Pendiente</option>

                                    </Form.Control>
                                </Form.Group>

                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Monto</Form.Label>
                                    <NumberFormat onKeyPress={this.handleKeyPress}

                                                  value={amountMask}
                                                  onChange={this.handleChange('amount')}
                                                  className="form-control"
                                                  placeholder="Ingreso monto" margin="normal"
                                                  thousandSeparator prefix="S/. "/>
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>

                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Fecha</Form.Label>
                                    <DatePicker
                                        selected={startDate}
                                        todayButton={"Today"}
                                        onChange={this.handleChange('startDate')}
                                        className="form-control "
                                        isClearable={true}
                                        placeholderText="dia/mes/año"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Concepto</Form.Label>
                                    <Form.Control as="select"
                                                  value={concept}
                                                  onChange={this.handleChange('concept')}>
                                        >
                                        <option defaultValue={true} hidden>
                                            Por favor seleccione una opcción</option>
                                        {
                                            concepts.length > 0 ?
                                                concepts.map((cashBox, index) => {
                                                    // if (bank.state) {
                                                    return (
                                                        <option value={cashBox.id} key={index}>
                                                            {cashBox.denomination}
                                                        </option>
                                                    )
                                                    // }
                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Observaciones</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id="number"
                                        value={observation}
                                        onChange={this.handleChange('observation')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        {action === 'add' ?
                            <Button
                                className="pull-right"
                                disabled={disabled}
                                variant="primary"
                                onClick={() => this.saveEntry(cashboxProps, initialBalanceID)}>
                                {disabled &&
                                <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                className="pull-right"
                                disabled={disabled}
                                variant="primary"
                                onClick={() => this.updateEntry()}>
                                {disabled &&
                                <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>


                </Modal>


            </>
        )
    }
}
