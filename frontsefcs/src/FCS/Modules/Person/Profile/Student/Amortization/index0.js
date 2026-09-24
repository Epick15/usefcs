import React, {Component} from 'react';
import {
    Button,
    Card,
    Col,
    Dropdown,
    Form, Modal, OverlayTrigger,
    Row, Tooltip
} from "react-bootstrap";
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import crypt from "node-cryptex";
import $ from 'jquery';
import NumberFormat from "react-number-format";
import defaultTicket from "../../../../../../assets/images/ticket/defaultTicket.png";

moment.locale('es');


const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
const USERID = localStorage.getItem('USER_ID') ? localStorage.getItem('USER_ID') : '';

export default class Amortization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "",
            student: "",


            amount: 0.00,
            amountMask: '',
            paymentDate: '',
            voucherCode: '',
            studentID: '',
            disabled: false,
            codePayment: '',
            loadImg: false,
            imgSize: "wid-100",
            preview: defaultTicket,
            file: '',
            changeImage: false,


            voucherImg: '',
            action: 'add',
            registerTicketModal: false,
            detailTicketModal: false,
            monthlys: [],
            monthlyPendings: [],
            monthlyRealizeds: [],

        };
    }

    componentDidMount() {
        this.getPaymentStudent(this.props.studentID);
        this.setState({
            userID: this.props.userID,
            student: this.props.studentID,
            activeForm: this.props.activeForm,
        })


    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.studentID !== this.props.studentID) {
            this.setState({studentID: this.props.studentID});
            this.getPaymentStudent(this.props.studentID);
        }

    }

    /*
    * B-CONCEPTOS-ESTUDIANTE
    *  listPaymentStudent
    * FUNCION PARA CARGAR LOS  EL CRONOGRAMA DE PAGOS DEL ESTUDIANTE
    */
    getPaymentStudent(studentID) {
        const url = app.accounting + '/' + app.payment + '/list/' + studentID;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({monthlys: res.data, studentID: studentID, imgSize: "wid-100",});

        }).catch(err => {
            this.setState({});
            PNotify.error({
                title: "Oh no!",
                text: "Los costos de estre programa no han sido registrados",
                delay: 2000
            });
            console.log(err)
        })
    };

    /*
      * B-CODIGO-PENDIENTE
      * FUNCION PARA CARGAR LOS MONTOS POR PARA REGISTRAR EL VAUCHER
      */
    getPaymentStudentPending(studentID, code) {
        const url = app.accounting + '/' + app.payment + '/list/pending/' + code + '/' + studentID;
        axios.get(url, app.headers).then(res => {
            if (res.data.length > 0) {
                this.setState({monthlyPendings: res.data, registerTicketModal: true})
            } else {
                this.setState({monthlyPendings: [], registerTicketModal: false})
            }

        }).catch(err => {
            this.setState({});
            PNotify.error({
                title: "Oh no!",
                text: "Los costos de estre programa no han sido registrados",
                delay: 2000
            });
            console.log(err)
        })
    };

    pendingVoucherGenerate() {
        this.setState({disabled: true});

        const url = app.accounting + '/' + app.payment + '/pending/generate';
        const {monthlys} = this.state;

        const concepts = this.selectedConceptNull(monthlys);

        if (concepts.length > 0) {

            let data = new FormData();
            data.set('concepts', crypt.encrypt(JSON.stringify(concepts), k, v));
            axios.patch(url, data, app.headers).then(() => {
                this.removeAvatar();
                this.setState({
                    disabled: false,
                    registerTicketModal: false,
                    voucherCode: '',
                    amount: '',
                    amountMask: '',
                    file: '',
                    paymentDate: '',
                    monthlys: [],
                });
                this.getPaymentStudent(this.state.studentID);

                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });


            }).catch(() => {
                this.setState({disabled: false});
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });


        } else {
            this.setState({disabled: false});

            PNotify.notice({

                title: "Advertencia!",
                text: "Algo Salio mal",
                delay: 2000
            });
        }
    };

    /*
   *FUNCION PARA REGISTRAR EL VAUCHAR DEL ESTUDIANTE
   */
    realizedVoucher() {


        let TOTALAMOUNT = 0;
        this.state.monthlyPendings.map(k => {
            TOTALAMOUNT = TOTALAMOUNT + parseFloat(k.amount);
        });
        console.log(TOTALAMOUNT, this.state.monthlyPendings)
        this.setState({disabled: true});

        const url = app.accounting + '/' + app.payment + '/realized/voucher';
        const {voucherCode, amount, paymentDate, studentID, monthlyPendings, file} = this.state;
        if (voucherCode !== '' && amount !== '' && paymentDate !== '' && file !== '') {
            if (TOTALAMOUNT == amount) {
                let data = new FormData();

                data.set('photo', file);
                data.set('voucher_code', voucherCode);
                data.set('id_student', studentID);
                data.set('voucher_amount', amount);
                data.set('voucher_date', paymentDate);
                data.set('concepts', crypt.encrypt(JSON.stringify(monthlyPendings), k, v));
                axios.patch(url, data, app.headers).then(() => {
                    this.removeAvatar();
                    this.setState({
                        disabled: false,
                        registerTicketModal: false,
                        voucherCode: '',
                        amount: '',
                        amountMask: '',
                        file: '',
                        paymentDate: '',
                        monthlyPendings: [],
                    });
                    this.getPaymentStudent(this.state.studentID);
                    PNotify.success({
                        title: "Finalizado",
                        text: "Registro actualizado correctamente",
                        delay: 2000
                    });
                }).catch(() => {
                    this.setState({disabled: false});
                    PNotify.error({
                        title: "Oh no!",
                        text: "Ha ocurrido un error",
                        delay: 2000
                    });
                });
            } else {
                this.setState({disabled: false});
                PNotify.notice({
                    title: "Advertencia!",
                    text: "El monto ingresado no coincide con el monto Total",
                    delay: 2000
                });
            }

        } else {
            this.setState({disabled: false});

            PNotify.notice({

                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    /*
     *  listPaymentStudent
     * FUNCION PARA CARGAR LOS LOS PAGOS SEGUN EL CODIGO DE PAGO CUANDO ESTA EN ESTADO REALIZADO VER DETALLES
     */
    getPaymentCode(codePayment) {
        const url = app.accounting + '/' + app.payment + '/voucher-code/' + codePayment;
        axios.get(url, app.headers).then(res => {
            if (res.data.length > 0) this.setState({
                monthlyRealizeds: res.data,
                detailTicketModal: true,
                voucherImg: app.server + 'voucher/' + res.data[0].Payment_detail.Cashbox_flow.voucher_url,
            })
        }).catch(err => {

            PNotify.error({
                title: "Oh no!",
                text: "Los costos de estre programa no han sido registrados",
                delay: 2000
            });
            console.log(err)
        })
    };

    /*
    * A-ESTADOS DEL VOUCHER
    * FUNCION PARA CANCELAR EL ESTADO PENDIENTE FALSE
    */
    pendingVoucher(type) {
        let concepts = [];
        if (type === 'monthlyRealizeds') {
            concepts = this.state.monthlyRealizeds;
        } else {
            concepts = this.state.monthlyPendings;
        }

        this.setState({disabled: true});
        const url = app.accounting + '/' + app.payment + '/pending/voucher';

        if (concepts !== '') {

            let data = new FormData();
            data.set('concepts', crypt.encrypt(JSON.stringify(concepts), k, v));
            axios.patch(url, data, app.headers).then(() => {
                this.removeAvatar();
                this.setState({
                    disabled: false,
                    registerTicketModal: false,
                    voucherCode: '',
                    amount: '',
                    amountMask: '',
                    file: '',
                    paymentDate: '',
                    monthlyPendings: [],
                    imgSize: 'wid-100',

                    detailTicketModal: false,
                    voucherImg: '',
                    monthlyRealizeds: [],
                });
                this.getPaymentStudent(this.state.studentID);
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });


            }).catch(() => {
                this.setState({disabled: false});
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });


        } else {
            this.setState({disabled: false});

            PNotify.notice({

                title: "Advertencia!",
                text: "Algo Salio mal",
                delay: 2000
            });
        }
    };

    closeModalRegisterTicket = () => {
        // TOTALAMOUNT = 0;
        this.setState({
            registerTicketModal: false,

        });
    };
    closeModalDetailTicket = () => {
        // TOTALAMOUNT = 0;
        this.setState({
            detailTicketModal: false
        });
    };
    openFileReader = () => {
        const input = '#inputVaucher';
        $(input).click();
    };
    changeVaucher = (event) => {
        const fileExtension = ['jpg'];
        const input = '#inputVaucher';
        let value = $(input).val().split('.').pop().toLowerCase();
        if ($.inArray(value, fileExtension) === -1) {
            let message = "Por favor use estos formatos: " + fileExtension.join(', ');
            PNotify.notice({title: "Error", text: message, delay: 2000});
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onload = () => {
                this.setState({
                    file: file,
                    imgSize: 'wid-500 text-center',
                    preview: reader.result,
                    status: true
                });
            };
            reader.readAsDataURL(file);
        }
        if (this.state.changeImage) {
            setTimeout(() => {
                this.changeImage(this.state.personID);
            }, 600);

        }

    };
    removeAvatar = () => {
        this.setState({file: '', preview: null});
        const input = '#inputAvatar';
        $(input).val('');
    };
    handleChange = field => event => {
        switch (field) {
            case 'voucherCode':
                let voucherCode = event.target.value.replace(/[^0-9]/g, '');
                this.setState({voucherCode: voucherCode.slice(0, 11)});
                break;
            case 'amount':
                this.setState({
                    amount: event.target.value.substr(4).replace(/,/g, ''),
                    amountMask: event.target.value
                });
                break;
            case 'paymentDate':
                this.setState({paymentDate: event.target.value});
                break;

            default:
                break;
        }
    };
    selectedConcept = (k) => {
        console.log(k)
        let total = this.state.totalInversion;
        let data = [];
        data = this.state.monthlys;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === k.id && data[i].order_number === k.order_number) {
                data[i].state = !k.state;
                // data[i].exists = !k.exists;
                if (data[i].state) {
                    total = total + parseFloat(data[i].amount);
                } else {
                    total = total - parseFloat(data[i].amount);
                }
            }
        }
        console.log(data);
        this.setState({totalInversion: total, monthlys: data})
    };

    selectedConceptNull = (record) => {


        let data = record;
        let tempArray = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].state && data[i].type === "Nulo") {

                tempArray.push(data[i]);
            }
        }
        return tempArray;
    };

    render() {

        const {registerTicketModal, detailTicketModal, disabled, imgSize, preview, loadImg} = this.state;
        const {amountMask, paymentDate, voucherCode, voucherImg} = this.state;
        const {monthlys, monthlyPendings, monthlyRealizeds, activeForm} = this.state;

        let TOTALAMOUNT = 0;
        return (

            <>

                <Row>
                    <Col xl={12}>

                        <Card>
                            <Card.Header className='h-40' style={{height: '40px', marginBottom: '-1px'}}>
                                <div className="d-inline-block align-middle" style={{marginTop: '-25px'}}>
                                    <div className="d-inline-block">
                                        <h5>SEMESTRE </h5>
                                    </div>
                                </div>

                            </Card.Header>
                            <Card.Body>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                        <tr>

                                            <th>Concepto</th>
                                            <th>Monto</th>
                                            <th>Semestre</th>
                                            <th>Fecha</th>
                                            <th>Codigo</th>
                                            <th>Comprobante</th>
                                            <th>Pago</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {monthlys.length > 0 && monthlys.map((r, i) => {
                                            let existCode = r.Payment_details.length > 0 ? true : false;

                                            let span = 'secondary';
                                            let paymentType = 'No definido';
                                            let existVaucher = '';
                                            if (existCode) {
                                                // let statePending = r.state ? 'warning' : 'secondary';
                                                span = r.type === 'Pendiente' ? 'warning' : r.type == 'Realizado' ? 'primary' : 'success';
                                                existVaucher = r.type === 'Pendiente' ? false : true;
                                                paymentType = r.type
                                            }

                                            return (
                                                <tr key={i}>

                                                    <th>
                                                        <div className="d-inline-block align-middle">
                                                            <label style={{marginBottom: '-6px'}}
                                                                   className="check-task custom-control custom-checkbox  d-flex justify-content-center">
                                                                <input type="checkbox" className="custom-control-input"
                                                                       onClick={() => this.selectedConcept(r)}
                                                                       readOnly
                                                                       disabled={r.type === "Nulo" ? false : true}
                                                                       checked={r.state}
                                                                       value={r.state}
                                                                />
                                                                < span style={{fontSize: '13px'}}
                                                                       className="custom-control-label">{r.denomination + " " + r.order_number}</span>
                                                            </label>

                                                        </div>
                                                    </th>
                                                    <td>S/. {r.amount}</td>
                                                    <td className="text-center">{r.id_semester_mention ? r.id_semester_mention : 'No definido'}</td>
                                                    <td>{r.payment_date ? moment(r.payment_date).format('L') : "No definido"}</td>
                                                    <th>{r.Payment_details.length > 0 ? r.Payment_details[0].code : 'No definido'}</th>
                                                    <td className="text-center">
                                                        {
                                                            existVaucher ?
                                                                <OverlayTrigger
                                                                    overlay={<Tooltip>Ver detalles</Tooltip>}>
                                                                                  <span type="button" onClick={() => this.getPaymentCode(r.Payment_details[0].code)}>
                                                                                        <i className={'material-icons text-' + span}>receipt</i>
                                                                                  </span>
                                                                </OverlayTrigger>
                                                                :
                                                                <OverlayTrigger
                                                                    overlay={<Tooltip>Registrar comprobante</Tooltip>}>
                                                                                  <span type="button"
                                                                                        onClick={() => this.getPaymentStudentPending(this.state.studentID, r.Payment_details[0].code)}>
                                                                                        <i className={'material-icons text-' + span}>receipt</i>
                                                                                  </span>
                                                                </OverlayTrigger>

                                                        }


                                                    </td>
                                                    <td><span className={'badge badge-' + span + ' inline-block'}>{paymentType}</span></td>

                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <hr/>

                            </Card.Body>
                        </Card>
                        <div className="row">
                            <div className="col-sm-6">
                                <button type="button" onClick={() => this.pendingVoucherGenerate()}
                                        className="btn btn-block btn-lg btn-danger mt-md-0 mt-2">
                                    <i className="fas fa-bolt mr-1"/> Generar codigo de pago
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Modal show={registerTicketModal}>
                    <Modal.Header style={{background: '#4680ff'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>REGISTRAR PAGO</Modal.Title>
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
                                        onClick={this.closeModalRegisterTicket}
                                        className="material-icons pull-right mr-n2 mt-n1"
                                        style={{color: 'white'}}>close</i>
                                </Dropdown.Toggle>
                            </Dropdown>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="mt-1">

                                    <h4 className="mt-0">{monthlyPendings.length > 0 ? monthlyPendings[0].Payment_detail.code : 'CODIGO'} </h4>

                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <table>
                                    <tbody>

                                    {monthlyPendings.length > 0 &&
                                    monthlyPendings.map((k, i) => {

                                        TOTALAMOUNT = TOTALAMOUNT + parseFloat(k.amount);
                                        return (

                                            <tr key={i}>

                                                <td style={{fontSize: '15px'}}>

                                                    {k.denomination + " " + k.order_number}

                                                </td>
                                                <td>.......................</td>
                                                <td style={{paddingLeft: ' 11px'}}><strong style={{fontSize: '14px'}}> S/. {k.amount}</strong></td>

                                            </tr>

                                        )
                                    })

                                    }

                                    <tr>
                                        <td><strong> TOTAL</strong></td>
                                        <td>.......................</td>
                                        <td style={{fontSize: '17px', paddingLeft: ' 11px'}}><strong> S/. {TOTALAMOUNT}.00</strong></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <hr/>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Codigo de vaucher</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="number"
                                        value={voucherCode}
                                        onChange={this.handleChange('voucherCode')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Fecha</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        onChange={this.handleChange('paymentDate')}
                                        max="2999-12-31"
                                        value={paymentDate}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Monto</Form.Label>
                                    <NumberFormat

                                        value={amountMask}
                                        onChange={this.handleChange('amount')}
                                        className="form-control"
                                        placeholder="Ingreso monto" margin="normal"
                                        thousandSeparator prefix="S/. "/>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Adjuntar vaucher</Form.Label>

                                </Form.Group>
                                <div className="position-relative d-inline-block mb-4">
                                    {loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    <img className={" img-fluid " + imgSize}
                                         onClick={this.openFileReader}
                                         src={preview || defaultTicket}
                                         alt="User"/>
                                </div>
                                <input
                                    type="file"
                                    id="inputVaucher"
                                    style={{display: 'none'}}
                                    onChange={(event) => this.changeVaucher(event)}

                                />
                            </Col>
                        </Row>


                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.realizedVoucher()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Registrar pago</Button>
                        <Button
                            className="pull-right mr-1"
                            disabled={disabled}
                            variant="danger"
                            onClick={() => this.pendingVoucher('monthlyPendings')}>
                            {/*{disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                            Cancelar operación</Button>

                    </Modal.Body>
                </Modal>
                <Modal show={detailTicketModal}>
                    <Modal.Header style={{background: '#4680ff'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>PAGO REGISTRADO</Modal.Title>
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
                                        onClick={this.closeModalDetailTicket}
                                        className="material-icons pull-right mr-n2 mt-n1"
                                        style={{color: 'white'}}>close</i>
                                </Dropdown.Toggle>
                            </Dropdown>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="mt-1">

                                    <h4 className="mt-0">{monthlyRealizeds.length > 0 ? monthlyRealizeds[0].Payment_detail.code : 'CODIGO'} </h4>

                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <table>
                                    <tbody>

                                    {monthlyRealizeds.length > 0 &&
                                    monthlyRealizeds.map((k, i) => {

                                        TOTALAMOUNT = TOTALAMOUNT + parseFloat(k.amount);
                                        return (

                                            <tr key={i}>

                                                <td style={{fontSize: '15px'}}>

                                                    {k.denomination + " " + k.order_number}

                                                </td>
                                                <td>.......................</td>
                                                <td style={{paddingLeft: ' 11px'}}><strong style={{fontSize: '14px'}}> S/. {k.amount}</strong></td>

                                            </tr>

                                        )
                                    })

                                    }

                                    <tr>


                                        <td><strong> TOTAL</strong></td>
                                        <td>.......................</td>
                                        <td style={{fontSize: '17px', paddingLeft: ' 11px'}}><strong> S/. {TOTALAMOUNT}.00</strong></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <hr/>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Codigo de vaucher</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="number"
                                        value={monthlyRealizeds.length > 0 ? monthlyRealizeds[0].Payment_detail.Cashbox_flow.voucher_code : 'CODIGO'}
                                        disabled={true}
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Fecha</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        onChange={this.handleChange('paymentDate')}
                                        max="2999-12-31"
                                        value={monthlyRealizeds.length > 0 ? monthlyRealizeds[0].Payment_detail.Cashbox_flow.voucher_date : 'CODIGO'}
                                        disabled={true}
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Monto</Form.Label>
                                    <NumberFormat

                                        value={monthlyRealizeds.length > 0 ? monthlyRealizeds[0].Payment_detail.Cashbox_flow.voucher_amount : 'PAYMENT'}
                                        disabled={true}
                                        className="form-control"

                                        thousandSeparator prefix="S/. "/>
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Adjuntar vaucher</Form.Label>

                                </Form.Group>
                                <div className="position-relative d-inline-block mb-4">
                                    {loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}

                                    <img className={" img-fluid wid-500"}
                                         src={voucherImg}
                                         alt="voucher"/>


                                </div>

                            </Col>

                        </Row>


                        <Button
                            className="pull-right mr-1"
                            disabled={disabled}
                            variant="danger"
                            onClick={() => this.pendingVoucher('monthlyRealizeds')}>
                            {/*{disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                            Cancelar operación</Button>

                    </Modal.Body>
                </Modal>
            </>

        )
    }
}
