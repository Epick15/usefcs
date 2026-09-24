import React, {Component} from 'react';
import {Button, Col, Form, InputGroup, Modal,  Row, Tab, Tabs} from "react-bootstrap";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

import Tooltip from "@material-ui/core/Tooltip";
import DataTableModal from "./DataTableModal";

export default class Concepts extends Component {

    state = {
        typeConcept: 'Entry',
        titleModal: '',
        denomination: '',
        action: 'add',
        currentID: '',
        title: '',
        isVarying: false,
        concepts: [],
    };

    componentDidMount() {
        this.getConcepts(this.state.typeConcept);
    }

    getConcepts = (typeConcept) => {

        this.setState({typeConcept: typeConcept});
        const url = app.accounting + '/' + app.concepts + '/' + typeConcept;
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
    saveConcepts = () => {
        const url = app.accounting + '/' + app.concepts;
        const {denomination, typeConcept} = this.state;
        if (denomination !== '' && typeConcept !== '') {

            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', typeConcept);
            axios.post(url, data, app.headers).then(() => {
                this.setState({
                    denomination: ''
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getConcepts(typeConcept);

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
    updateConcepts = () => {
        const url = app.accounting + '/' + app.concepts + '/' + this.state.currentID;
        const {denomination, typeConcept} = this.state;
        if (denomination !== '' && typeConcept !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', typeConcept);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.getConcepts(typeConcept);

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
    deleteConcepts = id => {
        const url = app.accounting + '/' + app.concepts + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getConcepts(this.state.typeConcept);
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

            default:
                break;
        }
    };
    handleOpenModal = () => {

        this.setState({
            titleModal: 'CONCEPTOS DE PAGO',
            isVarying: true,
            action: 'add',
            denomination: ''
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
    handleRetrieveConcepts = record => {
        this.setState({
            isVarying: true,
            action: 'update',
            currentID: record.id,
            denomination: record.denomination,
            titleModal: 'Modificar registro'
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
        const {denomination} = this.state;
        const {concepts} = this.state;
        const {action} = this.state;
        return (
            <>
                <Modal show={this.state.isVarying} onHide={() => this.handleCloseModal()}>

                    <Modal.Body>

                        <Button className='btn-icon btn-rounded' variant=''
                                style={{
                                    float: 'right',
                                    position: 'relative',
                                    zIndex: 1000,
                                    marginLeft: '-50px',
                                    paddingLeft: '30px',
                                }}
                                onClick={() => this.setState({isVarying: false})}
                        >
                            <i className="material-icons" style={{fontSize: '18px'}}>close</i>
                        </Button>

                        <Tabs variant="tabs" className="mb-3"
                              activeKey={this.state.key}
                              onSelect={(event) => this.getConcepts(event)}
                              id="controlled-tab-example"
                        >


                            <Tab eventKey="Entry" title={<h5>Ingresos</h5>}>


                                <br/>
                                <Row>
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
                                            <Tooltip title={"Guardar"}>
                                                <button style={{
                                                    marginLeft: '-25px', marginTop: '10px',
                                                    position: 'relative',
                                                    zIndex: 100,
                                                    padding: '0',
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                    color: '#4680ff'

                                                }}>
                                                    {
                                                        action === 'add' ?
                                                            <i className="material-icons text-primary"
                                                               onClick={() => this.saveConcepts()}
                                                               style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                            </i>
                                                            :
                                                            <i className="material-icons text-primary"
                                                               onClick={() => this.updateConcepts()}
                                                               style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                            </i>
                                                    }

                                                </button>
                                            </Tooltip>
                                        </InputGroup>
                                    </Col>


                                </Row>

                                {
                                    concepts.length > 0 &&
                                    <DataTableModal deleteConcepts={this.deleteConcepts}
                                                    handleRetrieveConcepts={this.handleRetrieveConcepts}
                                                    records={concepts}/>

                                }


                            </Tab>
                            <Tab eventKey="Egress" title={<h5>Egresos</h5>}>

                                <br/>
                                <Row>

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
                                            <Tooltip title={"Registrar"}>
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
                                                               onClick={() => this.saveConcepts()}
                                                               style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                            </i>
                                                            :
                                                            <i className="material-icons text-primary"
                                                               onClick={() => this.updateConcepts()}
                                                               style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                            </i>
                                                    }

                                                </button>
                                            </Tooltip>
                                        </InputGroup>
                                    </Col>


                                </Row>

                                {
                                    concepts.length > 0 &&
                                    <DataTableModal deleteConcepts={this.deleteConcepts}
                                                    handleRetrieveConcepts={this.handleRetrieveConcepts}
                                                    records={concepts}/>

                                }


                            </Tab>


                        </Tabs>


                    </Modal.Body>

                </Modal>

            </>
        )
    }
}
