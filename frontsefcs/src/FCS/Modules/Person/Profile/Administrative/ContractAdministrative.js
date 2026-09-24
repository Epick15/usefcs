import React, {Component} from 'react';
import axios from "axios";
import moment from 'moment';
import Swal from "sweetalert2";
import crypt from "node-cryptex";
import app from "../../../../Constants";

import PNotify from "pnotify/dist/es/PNotify";
import IconButton from "@material-ui/core/IconButton";
import {Button, Card, Col, Row, Table, Form} from "react-bootstrap";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';



export default class ContractAdministrative extends Component {

    state = {
        isContractAction: 'table',
        action: 'add',
        id_organic_unit: info.role ? info.role.id_organic_unit : null,
        userID: this.props.userID || '',
        roles: [],
        charges: [],
        contractTypes: [],
        contracts: [],
        organicUnits: [],

        rolID: '',
        chargeID: '',
        contractTypeID: '',
        date_start: '',
        date_end: '',
        currentID: '',
        organicUnitLabel: '',
        roleLabel: '',
        chargeLabel: '',
        contractTypeLabel: '',
        date_startLabel: '',
        date_endLabel: '',
        showOrganicUnit: false,
        disabled: false
    };

    componentDidMount() {
    }

    getUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({organicUnits: res.data, showOrganicUnit: true})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };

    getContractsByUser() {
        const url = app.security + '/' + app.administrativeContract + '/' + this.props.userID;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({contracts: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener contratos",
                delay: 2000
            });
            console.log(err)
        })
    };

    getRoles() {
        const url = app.security + '/' + app.role;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({roles: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener roles",
                delay: 2000
            });
            console.log(err)
        })
    };

    getCharges() {
        const url = app.general + '/' + app.charge;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({charges: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener cargos",
                delay: 2000
            });
            console.log(err)
        })
    };

    getContractTypes() {
        const url = app.general + '/' + app.contractType;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({contractTypes: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener tipos de contrato",
                delay: 2000
            });
            console.log(err)
        })
    };

    handleChange = field => event => {
        switch (field) {
            case 'rolID':
                this.setState({rolID: event.target.value});
                break;
            case 'chargeID':
                this.setState({chargeID: event.target.value});
                break;
            case 'contractTypeID':
                this.setState({contractTypeID: event.target.value});
                break;
            case 'id_organic_unit':
                this.setState({id_organic_unit: event.target.value});
                break;
            case 'date_start':
                this.setState({date_start: event.target.value});
                break;
            case 'date_end':
                this.setState({date_end: event.target.value});
                break;
            default:
                break;
        }
    };

    handleOpenModal = () => {
        this.setState({
            isContractAction: 'register',
            action: 'add',
            disabled: false,
        });

    };

    handleCloseModal = () => {
        this.setState({
            isContractAction: 'table',
            action: 'add',
            disabled: false,
            currentID: '',
            rolID: '',
            chargeID: '',
            contractTypeID: '',
            date_start: '',
            date_end: '',
        })
    };

    saveContractAdministrative() {
        this.setState({disabled: true})
        const url = app.security + '/' + app.administrative;
        const {userID, id_organic_unit, rolID, chargeID, contractTypeID, date_start, date_end} = this.state;

        console.log(userID, id_organic_unit, rolID, chargeID, contractTypeID, date_start, date_end)
        if (userID !== '' && id_organic_unit !== '' && rolID !== '' && chargeID !== '' && contractTypeID && date_start !== '') {
            let data = new FormData();
            data.set('id_user', userID);
            data.set('id_organic_unit', id_organic_unit);
            data.set('id_role', rolID);
            data.set('id_charge', chargeID);
            data.set('id_contract_type', contractTypeID);
            data.set('date_start', moment(date_start).format('YYYY-MM-DD'));
            date_end && data.set('date_end', date_end ? moment(date_end).format('YYYY-MM-DD') : '');
            axios.post(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getContractsByUser();
                this.handleCloseModal();
            }).catch(() => {
                this.setState({disabled: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({disabled: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };


    updateContractAdministrative() {
        this.setState({disabled: true})
        const url = app.security + '/' + app.administrative + '/' + this.state.currentID;
        const {userID, id_organic_unit, rolID, chargeID, contractTypeID, date_start, date_end} = this.state;
        if (userID !== '' && id_organic_unit !== '' && rolID !== '' && chargeID !== '' && contractTypeID && date_start !== '') {
            let data = new FormData();
            data.set('id_user', userID);
            data.set('id_organic_unit', id_organic_unit);
            data.set('id_role', rolID);
            data.set('id_charge', chargeID);
            data.set('id_contract_type', contractTypeID);
            data.set('date_start', moment(date_start).format('YYYY-MM-DD'));
            date_end !== null && data.set('date_end', moment(date_end).format('YYYY-MM-DD'));
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos actualizados correctamente",
                    delay: 2000
                });
                this.getContractsByUser();
                this.handleCloseModal();
            }).catch(() => {
                this.setState({disabled: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({disabled: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    handleClickRetrieveRecord = record => {
        this.setState({
            isContractAction: 'register',
            action: 'update',
            disabled: false,
            currentID: record.id,
            rolID: record.id_role || '',
            id_organic_unit: record.id_organic_unit || '',
            chargeID: record.id_charge || '',
            contractTypeID: record.id_contract_type || '',
            date_start: record.date_start || '',
            date_end: record.date_end || '',
        })
    };

    handleOpenSweetAlertWarning = (id) => {
        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff0000',
            cancelButtonColor: '#0fe603',
            confirmButtonText: 'Si, eliminar',
        }).then((result) => {
            if (result.value) {
                this.deleteContractAdministrative(id);
            }
        })
    };

    deleteContractAdministrative = id => {
        const url = app.security + '/' + app.administrative + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getContractsByUser();
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    handleClickshowReadMore = record => {
        this.setState({
            isContractAction: 'readMore',
            organicUnitLabel: record.Ou ? record.Ou.denomination : 'No definido',
            roleLabel: record.Role ? record.Role.denomination : 'No definido',
            chargeLabel: record.Charge ? record.Charge.denomination : 'No definido',
            contractTypeLabel: record.Ct ? record.Ct.denomination : 'No definido',
            date_startLabel: record.date_start ? moment(record.date_start).format('LL') : 'No definido',
            date_endLabel: record.date_end ? moment(record.date_end).format('LL') : 'No definido',
        });
    };

    render() {
        const {roles, charges, contractTypes, contracts, organicUnits} = this.state;
        const {
            isContractAction, action, disabled, rolID, chargeID, contractTypeID, date_start, date_end, organicUnitLabel, roleLabel, chargeLabel,
            contractTypeLabel, date_startLabel, date_endLabel, id_organic_unit, showOrganicUnit
        } = this.state;

        return (
            <Card>
                <Card.Body className='d-flex align-items-center justify-content-between'>
                    <h5 className="mb-0">Contratos</h5>
                    {isContractAction === 'table' ?
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-0 float-right"
                                onClick={() => this.handleOpenModal()}>
                            <i className='feather icon-plus'/>
                        </button> :
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-0 float-right"
                                onClick={() => this.handleCloseModal()}>
                            <i className='feather icon-x'/>
                        </button>
                    }
                </Card.Body>
                <Card.Body className={isContractAction === 'table' ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>Unidad orgánica</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contracts.length > 0 &&
                        contracts.map((r, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <h6 className="m-b-0"> {r.Ou ? r.Ou.denomination : <span className='text-muted'>No definido</span>}</h6>
                                                <p className="m-b-0">{r.Charge ? r.Charge.denomination : <span className='text-muted'>No definido</span>}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <IconButton
                                            size="small"
                                            aria-label="Ver más"
                                            onClick={() => this.handleClickshowReadMore(r)}
                                        >
                                            <i className="material-icons text-primary">remove_red_eye</i>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="Editar"
                                            onClick={() => this.handleClickRetrieveRecord(r)}
                                        >
                                            <i className="material-icons text-primary">edit</i>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="Eliminar"
                                            onClick={() => this.handleOpenSweetAlertWarning(r.id)}
                                        >
                                            <i className="material-icons text-danger">delete</i>
                                        </IconButton>
                                    </td>
                                </tr>
                            )
                        })
                        }
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Body className={isContractAction === 'register' ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    {showOrganicUnit &&
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Unidad orgánica</label>
                        <Col sm={9}>
                            <Form.Control as="select"
                                          value={id_organic_unit}
                                          onChange={this.handleChange('id_organic_unit')}>
                                >
                                <option defaultValue={true} hidden>Seleccione una opción</option>
                                {
                                    organicUnits.length > 0 ?
                                        organicUnits.map((v, k) =>
                                            <option value={v.id} key={k}> {v.denomination} </option>
                                        ) :
                                        <option value={false} disabled>No se encontraron datos</option>
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    }
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Privilegios</label>
                        <Col sm={9}>
                            <Form.Control as="select"
                                          value={rolID}
                                          onChange={this.handleChange('rolID')}>
                                >
                                <option defaultValue={true} hidden>Seleccione una opción</option>
                                {
                                    roles.length > 0 ?
                                        roles.map((rol, k) =>
                                            <option value={rol.id} key={k}> {rol.denomination} </option>
                                        ) :
                                        <option value={false} disabled>No se encontraron datos</option>
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Cargo</label>
                        <Col sm={9}>
                            <Form.Control as="select"
                                          value={chargeID}
                                          onChange={this.handleChange('chargeID')}>
                                >
                                <option defaultValue={true} hidden>Seleccione una opción</option>
                                {
                                    charges.length > 0 ?
                                        charges.map((charge, k) =>
                                            <option value={charge.id} key={k}> {charge.denomination} </option>
                                        ) :
                                        <option value={false} disabled>No se encontraron datos</option>
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Tipo de contrato</label>
                        <Col sm={9}>
                            <Form.Control as="select"
                                          value={contractTypeID}
                                          onChange={this.handleChange('contractTypeID')}>
                                >
                                <option defaultValue={true} hidden>Seleccione una opción</option>
                                {
                                    contractTypes.length > 0 ?
                                        contractTypes.map((ct, k) =>
                                            <option value={ct.id} key={k}> {ct.denomination} </option>
                                        ) :
                                        <option value={false} disabled>No se encontraron datos</option>
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Fecha inicio / fin</label>


                        <Col sm={9}>
                            <Row>
                                <Col sm={6}>

                                    <input type="date"

                                           className="form-control"
                                           onChange={this.handleChange('date_start')}
                                           max="2999-12-31"
                                           value={date_start}
                                    />
                                </Col>
                                <Col sm={6}>
                                    <input type="date"

                                           className="form-control"
                                           onChange={this.handleChange('date_end')}
                                           max="2999-12-31"
                                           value={date_end}
                                    />

                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {action === 'add' ?
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.saveContractAdministrative()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar</Button> :
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.updateContractAdministrative()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar Cambios</Button>
                    }
                </Card.Body>
                <Card.Body className={isContractAction === 'readMore' ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Unidad orgánica</label>
                        <Col sm={9}><p className='col-form-label'>{organicUnitLabel}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Privilegios</label>
                        <Col sm={9}><p className='col-form-label'>{roleLabel}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Cargo</label>
                        <Col sm={9}><p className='col-form-label'>{chargeLabel}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Tipo de contrato</label>
                        <Col sm={9}><p className='col-form-label'>{contractTypeLabel}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Fecha inicio</label>
                        <Col sm={3}>
                            <p className='col-form-label'>{date_startLabel}</p>
                        </Col>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Fecha Fin</label>
                        <Col sm={3}>
                            <p className='col-form-label'>{date_endLabel}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }
}
