import React, {Component} from 'react';
import { Col, Dropdown, Form, InputGroup, Modal, Row, } from "react-bootstrap";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";
import Tooltip from "@material-ui/core/Tooltip";
import DataTableModal from "./DataTableModal";


export default class BankAccounts extends Component {

    state = {
        typeConcept: 'Entry',
        bank: '',
        titleModal: '',
        denomination: '',
        accountNumber: '',
        action: 'add',
        currentID: '',
        title: '',
        isVarying: false,
        cashBoxs: [],
        banks: [],
    };

    componentDidMount() {
        this.getBanksAccounts(this.props.organicUnit);
        this.getBanks();
    }

    getBanks() {
        const url = app.general + '/' + app.bank;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({banks: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    getBanksAccounts(id) {
        const url = app.accounting + '/' + app.cashBox + '/' + app.organicUnit + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({cashBoxs: res.data})
            this.props.handleSetData();

        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveBankAccounts() {
        const url = app.accounting + '/' + app.cashBox;
        const {denomination, type, bank, accountNumber} = this.state;
        const forType = type === 'Banco' ? (denomination !== '' && type !== '' && bank !== '' && accountNumber !== '') : (denomination !== '' && type !== '');
        if (forType) {

            let data = new FormData();
            if (type === 'Banco') {
                data.set('id_bank', bank);
                data.set('account_number', accountNumber);
            }
            data.set('denomination', denomination);
            data.set('type', type);
            data.set('id_organic_unit', this.props.organicUnit);
            axios.post(url, data, app.headers).then(() => {
                this.setState({
                    denomination: '',
                    type: '',
                    accountNumber: '',
                    bank: '',
                    acction: 'add'
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });

                this.getBanksAccounts(this.props.organicUnit);


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

    updateBankAccounts() {
        const url = app.accounting + '/' + app.cashBox + '/' + this.state.currentID;
        const {denomination, type, bank, accountNumber} = this.state;
        const forType = type === 'Banco' ? (denomination !== '' && type !== '' && bank !== '' && accountNumber !== '') : (denomination !== '' && type !== '');

        if (forType) {

            let data = new FormData();
            if (type === 'Banco') {
                data.set('id_bank', bank);
                data.set('account_number', accountNumber);
            }
            data.set('denomination', denomination);
            data.set('type', type);
            axios.patch(url, data, app.headers).then(() => {
                this.setState({
                    denomination: '',
                    type: '',
                    accountNumber: '',
                    bank: '',
                    acction: 'add'
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });

                this.getBanksAccounts(this.props.organicUnit);
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

    deleteBankAccounts(id) {
        const url = app.accounting + '/' + app.cashBox + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });

            this.getBanksAccounts(this.props.organicUnit);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };


    //Operation Functions
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.action === 'add') {
                this.saveBankAccounts();
            } else {
                this.updateBankAccounts();
            }

        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                this.setState({denomination: event.target.value.replace(/[^A-Za-záéíóúüÁÉÍÓÚÜ ]/g, '').toUpperCase()});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;
            case 'bank':
                this.setState({bank: event.target.value});
                break;
            case 'accountNumber':
                this.setState({accountNumber: event.target.value});
                break;
            default:
                break;
        }
    };
    handleOpenModal = () => {

        this.setState({
            titleModal: 'MIS CUENTAS',
            isVarying: true,
            action: 'add',
            denomination: '',
            type: '',
            bank: '',
            accountNumber: '',
        });

    };
    handleCloseModal = () => {
        this.setState({
            isVarying: false,
            action: 'add',
            denomination: '',
            currentID: '',
        })
    };
    handleClickRetrieveBankAccounts = record => {
        if (record.id_bank) {
            this.setState({type: 'Banco'})
        } else {
            this.setState({type: 'Caja Interna'})
        }
        this.setState({
            isVarying: true,
            action: 'update',
            currentID: record.id,
            denomination: record.denomination,
            bank: record.id_bank,
            accountNumber: record.account_number,

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
        const {denomination, type, accountNumber, bank} = this.state;
        const {cashBoxs, banks} = this.state;

        const {action} = this.state;
        return (
            <>
                <Modal show={this.state.isVarying} onHide={() => this.setState({isVarying: false})}>
                    <Modal.Header style={{background: '#6610f2'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>{this.state.titleModal}

                        </Modal.Title>
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
                                        onClick={() => this.setState({isVarying: false})}
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
                                    <Form.Label className="floating-label">Tipo</Form.Label>
                                    <Form.Control as="select"
                                                  value={type}
                                                  onChange={this.handleChange('type')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        <option value="Banco">Entidad Bancaria</option>
                                        <option value="Caja Interna">Caja Interna</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            {type === 'Banco' && <>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Seleccione Entidad Bancaria</Form.Label>
                                        <Form.Control as="select"
                                                      value={bank}
                                                      onChange={this.handleChange('bank')}>
                                            >
                                            <option defaultValue={true} hidden>Por favor seleccione una
                                                opcción</option>
                                            {
                                                banks.length > 0 ?
                                                    banks.map((bank, index) => {
                                                        // if (bank.state) {
                                                        return (
                                                            <option value={bank.id} key={index}>
                                                                {bank.denomination}
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
                                        <Form.Label className="floating-label">Número de cuenta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyPress={this.handleKeyPress}
                                            id="number"
                                            value={accountNumber}
                                            onChange={this.handleChange('accountNumber')}
                                            placeholder="Ingrese descripción"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                            </>}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <InputGroup className="mb-3 form-group fill" size="sm">
                                    <Form.Label className="floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        style={{marginTop: '10px'}}
                                        type="email"
                                        onKeyPress={this.handleKeyPress}
                                        id="denomination"
                                        value={denomination}
                                        onChange={this.handleChange('denomination')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                    <Tooltip title={action === 'add' ? "Registrar" : 'Actualizar'}>
                                        <button style={{
                                            marginLeft: '-25px', marginTop: '10px',
                                            position: 'relative',
                                            zIndex: 100,
                                            padding: '0',
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            color: '#4680ff'

                                        }}

                                        >
                                            {
                                                action === 'add' ?
                                                    <i className="material-icons text-primary"
                                                       onClick={() => this.saveBankAccounts()}
                                                       style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                    </i>
                                                    :
                                                    <i className="material-icons text-primary"
                                                       onClick={() => this.updateBankAccounts()}
                                                       style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                    </i>
                                            }

                                        </button>
                                    </Tooltip>
                                </InputGroup>
                            </Col>


                        </Row>
                        {
                            cashBoxs.length > 0 &&
                            <DataTableModal deleteBankAccounts={this.deleteBankAccounts}
                                            handleClickRetrieveBankAccounts={this.handleClickRetrieveBankAccounts}
                                            records={cashBoxs}/>

                        }

                    </Modal.Body>

                </Modal>
            </>
        )
    }
}
