import React, {Component} from 'react';
import {Card, Col, Dropdown, Form, InputGroup, Modal, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import NumberFormat from "react-number-format";
import crypt from "node-cryptex";
import IconButton from "@material-ui/core/IconButton";
import generator from 'voucher-code-generator';
import moment from 'moment';

moment.locale('es');
const customStyles = {
    control: (base, state) => ({
        ...base,
        border: '0 !important',
        borderRadius: '0 !important',
        borderBottom: '1px solid #ced4da !important',
        '&::placeholder': {
            marginLeft: '-7px !important',
        },
        // This line disable the blue border
        boxShadow: '0 !important',
        '&:hover': {
            border: '0 !important',
            borderBottomColor: 'transparent !important',
            backgroundSize: '100% 100%, 100% 100% !important',
            transitionDuration: ' 0.3s !important',
            boxShadow: 'none !important',
            backgroundImage: 'linear-gradient(to top, #4680ff 2px, rgba(70, 128, 255, 0) 2px), linear-gradient(to top, #ced4da 1px, rgba(206, 212, 218, 0) 1px) !important'
        }
    })
}
let dfValue;
moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class Cost extends Component {

    state = {

        // startDate: moment().format('l'),
        // startDate: new Date(),
        /////////STATE FORM////////////
        modalCost: false,
        action: 'add',
        disabled: false,
        mentionID: this.props.mentionID,
        costID: '',
        costConceptID: '',
        code: '',
        concept: '',
        amount: '',
        amountMask: '',

        concepts: [],
        conceptCosts: [],
        costs: [],
        codeCost: '',
    };

    componentDidMount() {

        this.getConcepts();
        this.getCostConcepts(this.state.mentionID);
    }

    //FUNCION PARA CARGAR LOS CONCETOS
    getConcepts() {

        const url = app.accounting + '/' + app.concepts + '/only/' + 'Entry';
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

    // FUNCION PARA CARGAR LOS COSTOS
    getCostConcepts(mentionID) {

        const url = app.accounting + '/' + app.cost + '/list/' + mentionID;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({costs: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    // FUNCION PARA CARGAR LOS CONCEPTOS DE UN COSTO ESPECIFICO
    getCostCode(id) {
        const url = app.accounting + '/' + app.cost + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({codeCost: res.data, conceptCosts: res.data.Concepts})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveCost() {
        const url = app.accounting + '/' + app.cost;
        const {concept, amount, code, mentionID} = this.state;
        if (concept !== '' && amount !== '' && code !== '') {

            let data = new FormData();
            data.set('code', code);
            data.set('id_mention', mentionID);
            data.set('id_parent', concept);
            data.set('amount', amount);
            data.set('type', 'Entry');
            data.set('concept_fixed', false);


            axios.post(url, data, app.headers).then((res) => {
                this.getCostCode(res.data.id);
                this.getCostConcepts(this.state.mentionID);
                this.setState({
                    concept: '',
                    amount: '',
                    amountMask: ''
                })
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
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

    updateCost() {
        const url = app.accounting + '/' + app.concepts + '/' + this.state.costConceptID;
        const {concept, amount, code, mentionID} = this.state;
        if (concept !== '' && amount !== '' && code !== '') {

            let data = new FormData();

            data.set('id_parent', concept);
            data.set('amount', amount);
            data.set('type', 'Entry');
            data.set('concept_fixed', false);

            axios.patch(url, data, app.headers).then((res) => {
                this.getCostCode(this.state.costID);
                this.setState({
                    concept: '',
                    amount: '',
                    amountMask: '',
                    action: 'add'
                })
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });

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

    deleteConcepts(id, costID) {
        const url = app.accounting + '/' + app.concepts + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getCostCode(costID);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    updateOnlineCost(id) {
        const url = app.accounting + '/' + app.cost + '/online/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getCostConcepts(this.state.mentionID)
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    deleteCost(id) {
        const url = app.accounting + '/' + app.cost + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getCostConcepts(this.state.mentionID)
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //FUNCION PARA GENERAR CODIGO
    generateCode = () => {
        this.setState({
            code: generator.generate({
                length: 5,
                count: 1,
                charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            }),
            errorCode: false
        });


    };
    handleChange = field => event => {
        switch (field) {
            case 'code':
                this.setState({code: event.target.value});
                break;
            case 'amount':
                this.setState({
                    amount: event.target.value.substr(4).replace(/,/g, ''),
                    amountMask: event.target.value
                });
                break;
            case 'concept':
                this.setState({concept: event.target.value});
                break;
            case 'required':
                if (event) {
                    if (event) {
                        let array = [];
                        for (let i = 0; i < event.length; i++) {
                            array.push({value: event[i].value, label: event[i].label, order: event[i].order});
                        }
                        this.setState({required: array, changed: true});
                    }

                }
                break;
            case 'online':
                if (event.target.value == 'false') {
                    this.setState({online: true});

                } else {
                    this.setState({online: false});
                }
                break;
            default:
                break;
        }
    };
    openModalCost = () => {
        this.generateCode()
        this.setState({
            modalCost: true, concept: '',
            amount: '',
            amountMask: ''
        })

    };
    openModalCostConcept = (record) => {
        this.setState({modalCost: true, code: record.code});
        this.getCostCode(record.id);
    };
    closeModalCost = () => {
        this.setState({modalCost: false})
    };
    retriveCost = (record, costID) => {
        console.log(costID)
        this.setState({
            action: 'update',
            costID: costID,
            costConceptID: record.id,
            amount: record.amount || '',
            amountMask: record.amount || '',
            concept: record.Concepts_parent.id || '',

        });
    };

    render() {
        //state frontend
        const {concept, code, codeCost} = this.state;
        const {concepts, conceptCosts, costs} = this.state;
        const {modalCost, action, disabled, amountMask} = this.state;
        return (
            <>
                <Col md={12} className='mt-n2'>
                    <Card className='card-border-c-purple'>
                        <Card.Header>
                            <div className="d-inline-block align-middle">
                                <div className="d-inline-block">
                                    <h5>COSTOS</h5>
                                    <p className="m-b-0">Asignar semestres a su mencion</p>
                                </div>

                            </div>
                            <button type="button"
                                    className="btn btn-primary btn-sm rounded m-0 float-right"
                                    onClick={() => this.openModalCost()}>
                                <i className='feather icon-plus'/>
                            </button>
                        </Card.Header>

                    </Card>
                    <Row>
                        {
                            costs.length > 0 ?
                                costs.map((r, i) => {
                                    return (
                                        <Col key={i} md={6} xl={6}>
                                            <Card>
                                                <Card.Body>
                                                    <div
                                                        className="d-inline-block align-middle">
                                                        <div className="d-inline-block">
                                                            <h3 style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}>{r.code}</h3>

                                                        </div>
                                                    </div>
                                                    <div className="pull-right">
                                                        <OverlayTrigger
                                                            overlay={
                                                                <Tooltip>Acciones</Tooltip>}>
                                                            <Dropdown alignRight={true} className="pull-right mr-n4 mt-n1">
                                                                <Dropdown.Toggle
                                                                    className="btn-icon"

                                                                    style={{
                                                                        border: 'none',
                                                                        background: 'none',
                                                                        outline: 'none',
                                                                        color: 'white',
                                                                        height: '5px'

                                                                    }}>
                                                                    <i
                                                                        className="material-icons pull-right mr-n2 mt-n1"
                                                                        style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}>more_vert</i>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu as='ul' className="list-unstyled card-option">
                                                                    {
                                                                        r.state ?
                                                                            <>
                                                                                <Dropdown.Item
                                                                                    as='li'
                                                                                    onClick={() => this.openModalCostConcept(r)}
                                                                                    className="dropdown-item">

                                                                                     <span type="button">
                                                                                         <i
                                                                                             className={'feather icon-edit-2'}/> Editar
                                                                                         </span>
                                                                                </Dropdown.Item>

                                                                                <Dropdown.Item
                                                                                    as='li'
                                                                                    onClick={() => this.deleteCost(r.id)}
                                                                                    className="dropdown-item">
                                                                                     <span type="button">

                                                                                         <i
                                                                                             className={'feather icon-trash-2'}/> Inhabilitar
                                                                                         </span>
                                                                                </Dropdown.Item>
                                                                            </>
                                                                            :
                                                                            <Dropdown.Item
                                                                                as='li'
                                                                                onClick={() => this.deleteCost(r.id)}
                                                                                className="dropdown-item">
                                                                                     <span type="button">

                                                                                         <i
                                                                                             className={'feather icon-check'}/> Habilitar
                                                                                         </span>
                                                                            </Dropdown.Item>
                                                                    }

                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </OverlayTrigger>
                                                        {r.state &&
                                                        <OverlayTrigger
                                                            overlay={
                                                                <Tooltip>Publico</Tooltip>}>
                                                            <div
                                                                onClick={() => this.updateOnlineCost(r.id)}
                                                                className="custom-control custom-switch pull-right mr-n1 mt-1">
                                                                <input type="checkbox"

                                                                       style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}
                                                                       className="custom-control-input pull-right"
                                                                       id={i}
                                                                       readOnly
                                                                       checked={r.online}
                                                                       value={r.online}
                                                                />
                                                                <label
                                                                    className="custom-control-label pull-right"
                                                                    htmlFor="customSwitcht"/>
                                                            </div>
                                                        </OverlayTrigger>
                                                        }
                                                    </div>
                                                    <Row>
                                                        <div className="col-auto">
                                                            {r.Concepts &&
                                                            r.Concepts.map((k, i) => {
                                                                return (
                                                                    <span key={i} className="d-block"
                                                                          style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}>{k.Concepts_parent.denomination} -<strong>  S/. {k.amount}</strong> </span>
                                                                )
                                                            })

                                                            }


                                                        </div>

                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                })
                                :
                                ''
                        }

                    </Row>
                </Col>
                <Modal show={modalCost} onHide={() => this.setState({modalCost: false})}>
                    <Modal.Header style={{background: '#6610f2'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>COSTOS</Modal.Title>
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
                                        onClick={() => this.closeModalCost()}
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
                                <InputGroup className="mb-3 form-group fill" size="sm">
                                    <Form.Label className="floating-label">Codigo</Form.Label>
                                    <Form.Control
                                        style={{marginTop: '11px', background: 'white'}}
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        value={code}
                                        disabled={true}
                                        onChange={this.handleChange('code')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
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
                                                   onClick={() => this.saveCost()}
                                                   style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                </i>
                                                :
                                                <i className="material-icons text-primary"
                                                   onClick={() => this.updateCost()}
                                                   style={{fontSize: '20px', paddingRight: '5px'}}>save
                                                </i>
                                        }

                                    </button>

                                </InputGroup>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Table responsive hover>
                                    <thead>
                                    <tr className="d-flex">
                                        <th className="col-9" style={{border: '0px', background: 'white'}}>Descripción</th>
                                        <th className="col-3" style={{border: '0px', background: 'white'}}>Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {conceptCosts.length > 0 ?
                                        conceptCosts.map((r, i) => {
                                            return (
                                                <tr key={i} className="d-flex">

                                                    <td className="col-9">
                                                        <div className="d-inline-block align-middle">
                                                            <div className="d-inline-block">
                                                                <h6 className="m-b-0"
                                                                    style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}>{r.Concepts_parent.denomination}</h6>
                                                                <p className="m-b-0"
                                                                   style={r.state ? {color: '#37474f'} : {color: '#ff5252'}}>{codeCost.code + ' - S/.' + r.amount}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="col-3">
                                                        {r.state ?
                                                            <>
                                                                <IconButton size="small" aria-label="Habilitar"
                                                                            onClick={() => this.retriveCost(r, codeCost.id)}
                                                                >
                                                                    <i className="material-icons text-primary">edit</i></IconButton>
                                                                <IconButton size="small" aria-label="Habilitar"
                                                                            onClick={() => this.deleteConcepts(r.id, codeCost.id)}
                                                                >
                                                                    <i className="material-icons text-danger">delete</i></IconButton>
                                                            </>
                                                            :
                                                            <IconButton size="small" aria-label="Habilitar"
                                                                        onClick={() => this.deleteConcepts(r.id, codeCost.id)}
                                                            >
                                                                <i className="material-icons text-warning">eject</i></IconButton>
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                        })
                                        :
                                        <tr className="d-flex">

                                            <td className="col-12">
                                                <div className="d-inline-block align-middle">
                                                    <div className="d-inline-block">
                                                        <p className="m-b-0">No hay registros</p>

                                                    </div>
                                                </div>
                                            </td>


                                        </tr>
                                    }


                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}
