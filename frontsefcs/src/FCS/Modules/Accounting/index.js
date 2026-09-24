import React, {Component} from 'react';

import {Button, Card, Col, Dropdown, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import Concepts from './Concepts';
import BankAccounts from './BankAccounts';
import Entry from './Entry';
import Egress from './Egress';
import Swal from "sweetalert2";
import crypt from 'node-cryptex';
import app from "../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import moment from 'moment';
import 'moment/locale/es';
import PerfectScrollbar from "react-perfect-scrollbar";
import NumberFormat from "react-number-format";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
//// VERIFICAR SI EL ESTA ABIERTO CON ESE ID ANTES DE REGISTRAR
export default class Accounting extends Component {
    state = {
        isVaryingConcepts: false,
        organicUnit: info.role ? info.role.id_organic_unit : null,
        cashBox: '',
        initialBalance: '',
        initialBalanceID: '',
        initialBalanceDate: '',
        initialConcept: '',
        totalEntry: '',
        totalEgress: '',


        action: 'add',
        actionInitialBalance: 'add',
        initialBalanceInput: true,
        loaderDatailModal: false,
        modalDetail: false,
        actionModalDetail: 'add',
        cashBoxs: [],
        cashBoxFlows: [],
        initialBalances: [],

    };

    componentDidMount() {

        this.state.organicUnit && this.getCashBoxOrganicUnit(this.state.organicUnit);
        this.getInitialConcept();


    };

    // GetDataServer Functions
    //obtiene los datos del las caja que la unidad organica cuenta
    getCashBoxOrganicUnit(id) {

        const url = app.accounting + '/' + app.cashBox + '/' + app.organicUnit + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({cashBoxs: res.data});

        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    // busca el saldo inicial en los conceptos segun ese ideguardar
    getInitialConcept() {

        const url = app.accounting + '/' + app.concepts + '/' + app.initial;
        axios.get(url, app.headers).then(res => {
            if (res.data) {

                this.setState({initialConcept: res.data.id});
            }

        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    // obtiene el total de ingresos o egresos segun el id del inititalConcept (id de apertura)
    getTotalCashFlow(id, type) {

        const url = app.accounting + '/' + app.cashBoxFlow + '/total/' + type + '/' + id;
        axios.get(url, app.headers).then(res => {

            if (type === 'Entry') {
                if (res.data) {
                    let totalEntry = parseFloat(this.state.initialBalanceMask);
                    res.data.map((r, i) => {
                        totalEntry += parseFloat(r.amount)
                    });
                    this.setState({totalEntry: totalEntry});
                } else {
                    this.setState({totalEntry: ''});
                }


            } else {
                if (res.data) {

                    let totalEgress = 0;
                    res.data.map((r, i) => {
                        totalEgress += parseFloat(r.amount)
                    });
                    this.setState({totalEgress: totalEgress});
                } else {
                    this.setState({totalEgress: ''});
                }
            }


        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    }

    //obtiene los datos del flujo de caja  segun la caja y el id de apertura
    getCashBoxFlow(casboxID, initialBalanceID) {

        this.getTotalCashFlow(initialBalanceID, 'Entry');
        this.getTotalCashFlow(initialBalanceID, 'Egress');
        const url = app.accounting + '/' + app.cashBoxFlow + '/' + casboxID + '/' + initialBalanceID;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({cashBoxFlows: res.data});
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    // obtiene los datos del saldo inicial sugun el (initialConcept) y el id de la cuenta (cashBox) y aperturdado (abierto)
    getInitialBalance(id) {
        const url = app.accounting + '/' + app.cashBoxFlow + '/' + app.initialBalance + '/' + this.state.initialConcept + '/' + id;
        axios.get(url, app.headers).then(res => {

            if (res.data) {
                if (res.data.type === 'Abierto') {
                    this.getCashBoxFlow(id, res.data.id);
                    this.setState({
                        initialBalanceID: res.data.id,
                        initialBalances: res.data,
                        initialBalanceMask: res.data.amount,
                        initialBalanceInput: false,
                        initialBalanceDate: res.data.date
                    });
                } else {
                    this.setState({
                        initialBalanceID: '',
                        initialBalances: [],
                        initialBalanceMask: '',
                        initialBalanceInput: true,
                        initialBalanceDate: '',
                        totalEntry: '',
                        totalEgress: ''
                    })
                }

            } else {
                this.setState({
                    initialBalanceID: '',
                    initialBalances: [],
                    initialBalanceMask: '',
                    initialBalanceInput: true,
                    initialBalanceDate: '',
                    totalEntry: '',
                    totalEgress: ''
                })
            }
        }).catch(err => {

            this.setState({
                initialBalanceID: '',
                initialBalances: [],
                initialBalanceMask: '',
                initialBalanceInput: true,
                initialBalanceDate: '',
                totalEntry: '',
                totalEgress: ''
            })

            // PNotify.error({
            //     title: "Oh no!",
            //     text: "Ha ocurrido un error",
            //     delay: 2000
            // });
            console.log(err)
        })
    };

    saveInitialBalance() {
        // guarda el saldo inicial
        const url = app.accounting + '/' + app.cashBoxFlow+ '/' + app.initialBalance;
        const {cashBox, initialBalance, initialConcept} = this.state;
        if (cashBox !== '' && initialBalance !== '' && initialConcept !== '') {

            let data = new FormData();
            data.set('id_cashbox', cashBox);
            data.set('id_user', crypt.encrypt(info.id, k, v));
            data.set('id_concepts', initialConcept);
            data.set('amount', initialBalance);
            data.set('date', moment().format('YYYY-MM-DD h:mm:ss'));
            data.set('type', 'Abierto');
            data.set('state', 'Recibido');
            axios.post(url, data, app.headers).then(() => {

                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getInitialBalance(this.state.cashBox);


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
    }

    updateInitialBalance() {

        const url = app.accounting + '/' + app.cashBoxFlow + '/' + app.initialBalance + '/' + this.state.initialBalanceID;
        const {cashBox, initialBalance, initialConcept} = this.state;
        if (cashBox !== '' && initialBalance !== '' && initialConcept !== '') {

            let data = new FormData();
            data.set('amount', initialBalance);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.handleCloseModal();
                this.getInitialBalance(this.state.cashBox);

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

    // cierra la caja con el type cerrado
    deleteConcepts(id) {
        const url = app.accounting + '/' + app.cashBoxFlow + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getInitialBalance(this.state.cashBox);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //ANULAR ENTRY or EGRESS
    cancelCashFlow(id) {
        const url = app.accounting + '/' + app.cashBoxFlow + '/cancel/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getInitialBalance(this.state.cashBox);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    }

    enableCashFlow(id) {
        const url = app.accounting + '/' + app.cashBoxFlow + '/enable/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getInitialBalance(this.state.cashBox);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    }

    // FRONT FUNCTIONS
    handleOpenModalDetail = () => {

        this.setState({
            titleModalDetail: 'DETALLES',
            modalDetail: true,
            actionModalDetail: 'add',
            denomination: ''
        });

    };
    handleCloseModalDetail = () => {
        this.setState({

            modalDetail: false,

        })
    };


    handleKeyPress = (e) => {
        // alert(this.state.actionInitialBalance)
        if (e.key === 'Enter') {
            this.state.actionInitialBalance === 'add' ?
                this.saveInitialBalance() : this.updateInitialBalance()
        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                this.setState({denomination: event.target.value});
                break;
            case 'department':
                this.setState({department: event.target.value, province: '', district: ''});
                this.getProvince(event.target.value);
                break;
            case 'province':
                this.setState({province: event.target.value, district: ''});
                this.getDistrict(event.target.value);
                break;
            case 'district':
                this.setState({district: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;
            case 'cashBox':
                this.getInitialBalance(event.target.value);
                // this.getCashBoxFlow(event.target.value);
                this.setState({cashBox: event.target.value});

                break;
            case 'initialBalance':
                this.setState({
                    initialBalance: event.target.value.substr(4).replace(",", ""),
                    initialBalanceMask: event.target.value
                });

                break;

            default:
                break;
        }
    };
    handleCloseModal = () => {
        this.setState({
            // isVaryingCampus: false,
            actionInitialBalance: 'add',

        })
    };
    openSweetAlertInitialBalance = (id) => {
        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Cerrar'
        }).then((result) => {
            if (result.value) {
                this.deleteConcepts(id);
            }
        })
    };

    handleOpenButton = (type) => {
        switch (type) {
            case 'Concepts':
                this.Concepts.handleOpenModal();
                break;
            case 'BankAccounts':
                this.BankAccounts.handleOpenModal();
                break;
            case 'Entry':
                this.Entry.handleOpenModal();
                break;
            case 'Egress':
                this.Egress.handleOpenModal();
                break;
            default:
                break;
        }

    };

    handleSetData = (componet) => {
        switch (componet) {
            case 'BankAccounts':
                this.setState({cashBoxs: this.BankAccounts.state.cashBoxs});
                break;
            default:
                break;
        }

    }

    render() {
        const {
            organicUnit, actionInitialBalance, cashBox, initialBalance, initialBalanceMask, initialBalanceInput, initialBalanceDate,
             modalDetail,  titleModalDetail, totalEntry, totalEgress
        } = this.state;
        const {cashBoxs, cashBoxFlows} = this.state;
        return (
            <>
                {organicUnit ?
                    <>
                        <Row>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <div
                                                className="d-inline-block align-middle  col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Mis cuentas</Tooltip>}>
                                                    <Button className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                                            onClick={() => this.handleOpenButton('BankAccounts')}
                                                            style={{
                                                                backgroundColor: '#673ab7',
                                                                border: 'none',
                                                            }}>
                                                        <i className="material-icons">account_balance</i>
                                                    </Button>
                                                </OverlayTrigger>
                                                <div className="d-inline-block">
                                                    <h5>Mis cuentas</h5>
                                                    <p className="m-b-0"> Registra tus cuentas
                                                        bancarias o cajas internas</p>

                                                </div>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill">

                                                            <Form.Control as="select"
                                                                          style={{fontSize: '16px'}}
                                                                          value={cashBox}
                                                                          onChange={this.handleChange('cashBox')}>
                                                                >
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    una
                                                                    cuenta</option>
                                                                {
                                                                    cashBoxs.length > 0 ?
                                                                        cashBoxs.map((cashBox, index) => {
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
                                                </Row>
                                            </div>
                                            {cashBox &&
                                            <>
                                                <div
                                                    className="d-inline-block align-middle  col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                    <OverlayTrigger
                                                        overlay={
                                                            <Tooltip>{initialBalanceDate === '' ? 'Aperturar cuenta' : 'Cerrar cuenta'}</Tooltip>}>
                                                        <Button className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                                                variant={initialBalanceDate === '' ? 'info' : 'warning'}
                                                                onClick={() => this.openSweetAlertInitialBalance(this.state.initialBalanceID)}
                                                                style={{
                                                                    // backgroundColor: '#20c997',
                                                                    border: 'none',
                                                                }}>
                                                            <i className="material-icons">{initialBalance === '' ? 'open_in_new' : 'exit_to_app'}</i>
                                                        </Button>
                                                    </OverlayTrigger>

                                                    {initialBalanceDate === '' ?

                                                        <div className="d-inline-block">
                                                            <h5> Aperturar cuenta </h5>
                                                            <p className="m-b-0"> Registre el saldo inicial para esta
                                                                cuenta </p>
                                                        </div>

                                                        :
                                                        <>
                                                            <div className="d-inline-block">
                                                                <h5> Cuenta Activa
                                                                </h5>
                                                                <p className="m-b-0 ">{moment(initialBalanceDate).format('LLL')} </p>
                                                            </div>
                                                            <div className="d-inline-block pull-right">

                                                                <Dropdown alignRight={true}
                                                                          className="pull-right mr-n4 mt-n1">
                                                                    <Dropdown.Toggle className="btn-icon" style={{
                                                                        border: 'none',
                                                                        background: 'none',
                                                                        outline: 'none',
                                                                        color: 'white',
                                                                        height: '5px'

                                                                    }}>
                                                                        <i
                                                                            className="material-icons pull-right mr-n2 mt-n1"
                                                                            style={{color: '#6c757d'}}>more_vert</i>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu as='ul'
                                                                                   className="list-unstyled card-option">
                                                                        <Dropdown.Item as='li'
                                                                                       onClick={() => this.setState({
                                                                                           initialBalanceInput: true,
                                                                                           actionInitialBalance: 'update'
                                                                                       })}
                                                                                       className="dropdown-item">

                                                                                     <span type="button">
                                                                                         <i
                                                                                             className={'feather icon-edit-2'}/> Editar
                                                                                         </span>
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item as='li'
                                                                                       className="dropdown-item">
                                                                    <span type="button">      <i
                                                                        className={'feather icon-eye'}/> Historial(pronto...)
                                                                   </span>
                                                                        </Dropdown.Item>

                                                                    </Dropdown.Menu>
                                                                </Dropdown>


                                                            </div>
                                                        </>

                                                    }
                                                    {initialBalanceInput &&

                                                    <InputGroup className="mb-3 form-group fill" size="sm">


                                                        <NumberFormat onKeyPress={this.handleKeyPress}
                                                                      style={{marginTop: '10px'}}
                                                                      value={initialBalanceMask}
                                                                      onChange={this.handleChange('initialBalance')}
                                                                      className="form-control"
                                                                      placeholder="Ingreso monto" margin="normal"
                                                                      thousandSeparator prefix="S/. "/>
                                                        <button style={{
                                                            marginLeft: '-25px', marginTop: '10px',
                                                            position: 'relative',
                                                            zIndex: 100,
                                                            padding: '0',
                                                            border: 'none',
                                                            background: 'none',
                                                            outline: 'none',


                                                        }}

                                                        >
                                                            {
                                                                actionInitialBalance === 'add' ?
                                                                    <OverlayTrigger
                                                                        overlay={
                                                                            <Tooltip>Registrar</Tooltip>}>

                                                                        <i className="material-icons text-primary"
                                                                           onClick={() => this.saveInitialBalance()}
                                                                           style={{
                                                                               fontSize: '20px',
                                                                               paddingRight: '5px'
                                                                           }}>send
                                                                        </i>
                                                                    </OverlayTrigger>
                                                                    :
                                                                    <>
                                                                        <OverlayTrigger
                                                                            overlay={
                                                                                <Tooltip>Cerrar</Tooltip>}>
                                                                            <i className="material-icons "
                                                                               onClick={() => this.setState({
                                                                                   initialBalanceInput: false,
                                                                                   actionInitialBalance: 'add'
                                                                               })}
                                                                               style={{
                                                                                   fontSize: '20px',
                                                                                   paddingRight: '15px'
                                                                               }}>close
                                                                            </i>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            overlay={
                                                                                <Tooltip>Actualizar saldo
                                                                                    inicial</Tooltip>}>
                                                                            <i className="material-icons text-primary"
                                                                               onClick={() => this.updateInitialBalance()}
                                                                               style={{
                                                                                   fontSize: '20px',
                                                                                   paddingRight: '5px'
                                                                               }}>send
                                                                            </i>

                                                                        </OverlayTrigger>
                                                                    </>
                                                            }

                                                        </button>


                                                    </InputGroup>


                                                    }

                                                </div>
                                                {/*<hr/>*/}
                                                {/*<div className="d-inline-block align-middle">*/}
                                                {/*    <OverlayTrigger*/}
                                                {/*        overlay={<Tooltip>Encargado</Tooltip>}>*/}
                                                {/*        <Button className='btn-icon btn-rounded wid-50 align-top m-r-15'*/}
                                                {/*                variant='primary'*/}
                                                {/*                onClick={() => this.handleOpenButton('Concepts')}*/}
                                                {/*                style={{*/}

                                                {/*                    border: 'none',*/}
                                                {/*                }}>*/}
                                                {/*            <i className="material-icons">person</i>*/}
                                                {/*        </Button>*/}
                                                {/*    </OverlayTrigger>*/}
                                                {/*    <div className="d-inline-block">*/}
                                                {/*        <h5>Registrar encargado</h5>*/}
                                                {/*        <p className="m-b-0"> Registra Ingresos y Egresos de su organización</p>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </>
                                            }
                                        </Row>
                                    </Card.Body>


                                </Card>
                                {/*<Card>*/}
                                {/*    <Card.Body className='p-b-0'>*/}

                                {/*        <Row>*/}
                                {/*            <Col md={12} className='order-md-1'>*/}
                                {/*                <div style={{height: '600px'}}>*/}
                                {/*                    <PerfectScrollbar>*/}
                                {/*                        <div*/}
                                {/*                            className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">*/}
                                {/*                            <OverlayTrigger*/}
                                {/*                                overlay={<Tooltip>Hitorial</Tooltip>}>*/}
                                {/*                                <Button*/}
                                {/*                                    className='btn-icon btn-rounded wid-50 align-top m-r-15'*/}
                                {/*                                    onClick={() => this.handleOpenButton('Concepts')}*/}
                                {/*                                    style={{*/}
                                {/*                                        backgroundColor: '#00bcd4',*/}
                                {/*                                        border: 'none',*/}
                                {/*                                    }}>*/}
                                {/*                                    <i className="material-icons">reorder</i>*/}
                                {/*                                </Button>*/}
                                {/*                            </OverlayTrigger>*/}
                                {/*                            <div className="d-inline-block">*/}
                                {/*                                <h5>Historial</h5>*/}
                                {/*                                <p className="m-b-0">Aperturas</p>*/}
                                {/*                            </div>*/}
                                {/*                        </div>*/}
                                {/*                    </PerfectScrollbar>*/}
                                {/*                </div>*/}
                                {/*            </Col>*/}

                                {/*        </Row>*/}
                                {/*    </Card.Body>*/}
                                {/*</Card>*/}
                                <Card>
                                    <Card.Body className='p-b-0'>

                                        <Row>

                                            <div
                                                className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Ingresos</Tooltip>}>
                                                    <Button disabled={cashBox === '' ? true : false}
                                                            className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                                            onClick={() => this.handleOpenButton('Entry')}
                                                            style={{
                                                                backgroundColor: '#20c997',
                                                                border: 'none',
                                                            }}>
                                                        <i className="material-icons">trending_up</i>
                                                    </Button>
                                                </OverlayTrigger>
                                                <div className="d-inline-block">
                                                    <h5>Ingresos</h5>
                                                    <p className="m-b-0">Inicial</p>
                                                </div>
                                                <div className="d-inline-block" style={{float: 'right'}}>
                                                    <h5>{totalEntry ? totalEntry + ' S/.' : '0,00 S/.'}</h5>
                                                    <p className="m-b-0"
                                                       style={{float: 'right'}}>{initialBalanceMask ? initialBalanceMask + ' S/.' : '0,00 S/.'}</p>
                                                </div>
                                            </div>

                                        </Row>
                                        <hr/>
                                        <Row>

                                            <div
                                                className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <OverlayTrigger
                                                    overlay={<Tooltip>Egresos</Tooltip>}>
                                                    <Button disabled={cashBox === '' ? true : false}
                                                            className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                                            onClick={() => this.handleOpenButton('Egress')}
                                                            style={{
                                                                backgroundColor: '#ff5252',
                                                                border: 'none',
                                                            }}>
                                                        <i className="material-icons">trending_down</i>
                                                    </Button>
                                                </OverlayTrigger>


                                                <div className="d-inline-block">
                                                    <h5>Egresos</h5>
                                                    <p className="m-b-0">Previsto </p>
                                                </div>
                                                <div className="d-inline-block" style={{float: 'right'}}>
                                                    <h5>{totalEgress ? totalEgress + ' S/.' : '0,00 S/.'}</h5>
                                                    <p className="m-b-0" style={{float: 'right'}}>0,00 S/. </p>
                                                </div>
                                            </div>

                                        </Row>
                                        <hr/>


                                        <div className="d-inline-block align-middle">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Conceptos</Tooltip>}>
                                                <Button className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                                        onClick={() => this.handleOpenButton('Concepts')}
                                                        style={{
                                                            backgroundColor: '#00bcd4',
                                                            border: 'none',
                                                        }}>
                                                    <i className="material-icons">reorder</i>
                                                </Button>
                                            </OverlayTrigger>
                                            <div className="d-inline-block">
                                                <h5>Conceptos</h5>
                                                <p className="m-b-0"> Registra Ingresos y Egresos de su organización</p>
                                            </div>
                                        </div>

                                    </Card.Body>
                                </Card>


                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Card>
                                    <Card.Body>
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <h5>Flujo de caja</h5>
                                                <p className="m-b-0">Entradas y salidas de efectivo</p>

                                            </div>
                                        </div>
                                        <div className="d-inline-block pull-right">

                                            <Dropdown alignRight={true}
                                                      className="pull-right mr-n3 mt-n1">
                                                <Dropdown.Toggle className="btn-icon" style={{
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                    color: 'white',
                                                    height: '5px'

                                                }}>
                                                    <i
                                                        className="material-icons pull-right mr-n2 mt-n1"
                                                        style={{color: '#6c757d'}}>settings</i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu as='ul'
                                                               className="list-unstyled card-option">
                                                    <Dropdown.Item as='li'
                                                                   onClick={() => this.setState({
                                                                       initialBalanceInput: true,
                                                                       actionInitialBalance: 'update'
                                                                   })}
                                                                   className="dropdown-item">

                                                             <span type="button">
                                                                 <i
                                                                     className={'feather icon-edit-2'}/> Maximizar
                                                                 </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item as='li'

                                                                   className="dropdown-item">
                                                                    <span type="button">      <i
                                                                        className={'feather icon-eye'}/> Detalles
                                                                   </span>
                                                    </Dropdown.Item>

                                                </Dropdown.Menu>
                                            </Dropdown>


                                        </div>
                                        <hr/>
                                        <Row>
                                            {cashBox === '' || initialBalanceDate === '' ?
                                                <div
                                                    className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                    <OverlayTrigger
                                                        overlay={<Tooltip>Configuracion</Tooltip>}>
                                                        <Button
                                                            className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                                            variant="warning"
                                                            style={{

                                                                border: 'none',
                                                            }}>
                                                            <i className="material-icons">priority_high</i>
                                                        </Button>

                                                    </OverlayTrigger>
                                                    <div className="d-inline-block">

                                                        <div role="alert"
                                                             className="fade alert alert-warning show"> Antes
                                                            debe
                                                            seleccionar una cuenta y haber registrardo el Saldo
                                                            Inicial
                                                        </div>
                                                    </div>

                                                </div>
                                                :
                                                <Col md={12} className='order-md-1'>
                                                    <div style={{height: '600px'}}>
                                                        <PerfectScrollbar>
                                                            <Card.Body className='p-b-0 '>

                                                                <Row>
                                                                    {
                                                                        cashBoxFlows.length > 0 ?
                                                                            cashBoxFlows.map((r, i) => {
                                                                                // if (bank.state) {
                                                                                const badge = r.state === 'Recibido' ? 'badge-success' :
                                                                                    r.state === 'Pendiente' ? 'badge-warning' :
                                                                                        r.state === 'Anulado' ? 'badge-danger' : 'badge-success';

                                                                                return (
                                                                                    <div key={i} className="d-inline-block align-middle
                                                                                        col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                                                        {r.Concepts.type === 'Entry' ?

                                                                                            <span
                                                                                                className="align-top m-r-15 mr-1 badge"
                                                                                                style={{
                                                                                                    backgroundColor: '#20c997',
                                                                                                    color: '#ffffff00',
                                                                                                    fontSize: '1',
                                                                                                    padding: '0px 5px 30px 0px'
                                                                                                }}>.
                                                                                      </span>
                                                                                            :
                                                                                            <span
                                                                                                className="align-top m-r-15 mr-1 badge"
                                                                                                style={{
                                                                                                    backgroundColor: '#ff5252',
                                                                                                    color: '#ffffff00',
                                                                                                    fontSize: '1',
                                                                                                    padding: '0px 5px 30px 0px'
                                                                                                }}>.
                                                                                      </span>
                                                                                        }
                                                                                        <div className="d-inline-block">
                                                                                            <h6>{r.Concepts.denomination}</h6>
                                                                                            <p className="m-b-0">{moment(r.date).format('LLL')} </p>
                                                                                        </div>
                                                                                        <div
                                                                                            className="d-inline-block pull-right">
                                                                                            <h6>S/. {r.amount}
                                                                                                <Dropdown
                                                                                                    alignRight={true}
                                                                                                    className="pull-right mr-n3 mt-n1">
                                                                                                    <Dropdown.Toggle
                                                                                                        className="btn-icon"
                                                                                                        style={{
                                                                                                            border: 'none',
                                                                                                            background: 'none',
                                                                                                            outline: 'none',
                                                                                                            color: '#ffffff00',
                                                                                                            height: '5px'

                                                                                                        }}>
                                                                                                        <i
                                                                                                            className="material-icons pull-right mr-n3 mt-n1"
                                                                                                            style={{color: '#6c757d'}}>more_vert</i>
                                                                                                    </Dropdown.Toggle>
                                                                                                    <Dropdown.Menu
                                                                                                        as='ul'
                                                                                                        className="list-unstyled card-option">


                                                                                                        {r.Concepts.type === 'Entry' ?

                                                                                                            <Dropdown.Item
                                                                                                                as='li'
                                                                                                                className="dropdown-item"
                                                                                                                onClick={() => this.Entry.handleRetrieveEntry(r)}
                                                                                                            >

                                                                                                                 <span
                                                                                                                     type="button">
                                                                                                                     <i
                                                                                                                         className={'feather icon-edit-2'}/> Editar
                                                                                                                     </span>
                                                                                                            </Dropdown.Item>
                                                                                                            :
                                                                                                            <Dropdown.Item
                                                                                                                as='li'
                                                                                                                className="dropdown-item"
                                                                                                                onClick={() => this.Egress.handleRetrieveEgress(r)}
                                                                                                            >

                                                                                                                 <span
                                                                                                                     type="button">
                                                                                                                     <i
                                                                                                                         className={'feather icon-edit-2'}/> Editar
                                                                                                                     </span>
                                                                                                            </Dropdown.Item>
                                                                                                        }


                                                                                                        <Dropdown.Item
                                                                                                            as='li'
                                                                                                            className="dropdown-item"
                                                                                                            onClick={() => this.handleOpenModalDetail()}
                                                                                                        >
                                                                                                                    <span
                                                                                                                        type="button">      <i
                                                                                                                        className={'feather icon-eye'}/> Detalles
                                                                                                                   </span>
                                                                                                        </Dropdown.Item>
                                                                                                        {r.state !== 'Anulado' ?

                                                                                                            <Dropdown.Item
                                                                                                                as='li'
                                                                                                                className="dropdown-item"
                                                                                                                onClick={() => this.cancelCashFlow(r.id)}
                                                                                                            >

                                                                                                                 <span
                                                                                                                     type="button">                                                                                                                     <i
                                                                                                                     className={'feather icon-x'}/> Anular
                                                                                                                     </span>
                                                                                                            </Dropdown.Item>
                                                                                                            :

                                                                                                            <Dropdown.Item
                                                                                                                as='li'
                                                                                                                className="dropdown-item"
                                                                                                                onClick={() => this.enableCashFlow(r.id)}
                                                                                                            >

                                                                                                                 <span
                                                                                                                     type="button">                                                                                                                     <i
                                                                                                                     className={'feather icon-check'}/> Habilitar
                                                                                                                     </span>
                                                                                                            </Dropdown.Item>
                                                                                                        }

                                                                                                    </Dropdown.Menu>
                                                                                                </Dropdown>


                                                                                            </h6>
                                                                                            <p className="m-b-0 pull-right">

                                                                                                <span
                                                                                                    className={'mr-1 badge ' + badge}>{r.state}</span>


                                                                                            </p>

                                                                                        </div>
                                                                                        <hr/>
                                                                                    </div>
                                                                                )
                                                                                // }
                                                                            })

                                                                            :
                                                                            <div role="alert"
                                                                                 className="fade alert alert-info show">A
                                                                                Registre los ingresos y egresos de caja
                                                                            </div>

                                                                    }


                                                                </Row>


                                                            </Card.Body>
                                                        </PerfectScrollbar>
                                                    </div>
                                                </Col>
                                            }

                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Concepts ref={(ref) => this.Concepts = ref}/>
                        <BankAccounts
                            handleSetData={() => this.handleSetData('BankAccounts')}
                            organicUnit={this.state.organicUnit}
                            ref={(ref) => this.BankAccounts = ref}
                        />
                        <Entry
                            getCashBoxFlow={() => this.getCashBoxFlow(this.state.cashBox, this.state.initialBalanceID)}
                            getTotalCashFlow={() => this.getTotalCashFlow(this.state.initialBalanceID, 'Entry')}
                            cashBox={this.state.cashBox}
                            initialBalanceID={this.state.initialBalanceID}
                            ref={(ref) => this.Entry = ref}/>
                        <Egress
                            getCashBoxFlow={() => this.getCashBoxFlow(this.state.cashBox, this.state.initialBalanceID)}
                            getTotalCashFlow={() => this.getTotalCashFlow(this.state.initialBalanceID, 'Egress')}
                            cashBox={this.state.cashBox}
                            initialBalanceID={this.state.initialBalanceID}
                            ref={(ref) => this.Egress = ref}/>
                        {/*MODAL DETAIL*/}
                        <Modal show={modalDetail} onHide={() => this.setState({modalDetail: false})}>
                            <Modal.Header style={{background: '#4680ff'}}>
                                <Modal.Title as="h5" style={{color: 'white'}}>{titleModalDetail}</Modal.Title>
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
                                                onClick={() => this.handleCloseModalDetail()}
                                                className="material-icons pull-right mr-n2 mt-n1"
                                                style={{color: 'white'}}>close</i>
                                        </Dropdown.Toggle>

                                    </Dropdown>


                                </div>
                            </Modal.Header>
                            <Modal.Body>

                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        PRONTO...
                                    </Col>
                                </Row>


                                {/*{actionModalDetail === 'add' ?*/}
                                {/*    <Button*/}
                                {/*        className="pull-right"*/}
                                {/*        disabled={loaderDatailModal}*/}
                                {/*        variant="primary"*/}
                                {/*        onClick={() => this.saveEntry()}>*/}
                                {/*        {loaderDatailModal &&*/}
                                {/*        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                {/*        Guardar</Button> :*/}
                                {/*    <Button*/}
                                {/*        className="pull-right"*/}
                                {/*        disabled={loaderDatailModal}*/}
                                {/*        variant="primary"*/}
                                {/*        onClick={() => this.updateEntry()}>*/}
                                {/*        {loaderDatailModal &&*/}
                                {/*        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                {/*        Guardar Cambios</Button>*/}
                                {/*}*/}
                            </Modal.Body>


                        </Modal>

                    </>
                    :
                    <Row>
                        <Card>

                            <div
                                className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <OverlayTrigger
                                    overlay={<Tooltip>Modo Dios</Tooltip>}>
                                    <Button
                                        className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                        variant="warning"
                                        style={{

                                            border: 'none',
                                        }}>
                                        <i className="material-icons">priority_high</i>
                                    </Button>

                                </OverlayTrigger>
                                <div className="d-inline-block">

                                    <div role="alert" className="fade alert alert-warning show">El modo Dios aun
                                        esta en desarrollo
                                    </div>
                                </div>

                            </div>

                        </Card>
                    </Row>
                }

            </>
        )
    }
}
