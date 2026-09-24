import React, {Component} from 'react';
import {
    Button,
    Col,
    Dropdown,
    Form, InputGroup,
    Modal, Row
} from "react-bootstrap";
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

import DatePicker from "react-datepicker";
import moment from 'moment';
import NumberFormat from "react-number-format";
import crypt from "node-cryptex";
import DataTable from "./DataTable";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class Mention extends Component {

    state = {

        // startDate: moment().format('l'),
        // startDate: new Date(),
        /////////STATE FORM////////////
        mentionID: '',
        programID: '',
        denomination: '',
        creditRequired: '',
        creditElective: '',


        disabled: false,

        action: 'add',
        currentID: '',
        title: '',
        mentionModal: false,
        mentions: [],
    };

    componentDidMount() {

    }

    getMentions(id) {
        const url = app.programs + '/' + app.mention + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({mentions: res.data});
            this.props.handleSetData('Mention');
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveMention() {

        const url = app.programs + '/' + app.mention;
        const {denomination, creditRequired, creditElective, programID} = this.state;
        if (denomination !== '' && creditRequired !== '' && creditElective !== '') {

            let data = new FormData();
            data.set('denomination', denomination);
            data.set('credit_required', creditRequired);
            data.set('credit_elective', creditElective);
            data.set('id_programs', programID);
            data.set('code', 123);
            axios.post(url, data, app.headers).then(() => {
                this.getMentions(programID);
                this.setState({
                    denomination: '',
                    creditRequired: '',
                    creditElective: ''
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

    updateMention() {

        const url = app.programs + '/' + app.mention + '/' + this.state.mentionID;
        const {denomination, creditRequired, creditElective, programID} = this.state;
        if (denomination !== '' && creditRequired !== '' && creditElective !== '') {

            let data = new FormData();
            data.set('denomination', denomination);
            data.set('credit_required', creditRequired);
            data.set('credit_elective', creditElective);
            data.set('id_programs', programID);
            data.set('code', 123);
            axios.patch(url, data, app.headers).then(() => {
                this.getMentions(programID);
                this.setState({
                    denomination: '',
                    creditRequired: '',
                    creditElective: '',
                    action: 'add'
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
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


    //Operation Functions
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.action === 'add') {
                this.saveMention();
            } else {
                this.updateMention();
            }

        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                this.setState({denomination: event.target.value.replace(/[^A-Za-záéíóúüÁÉÍÓÚÜ ]/g, '').toUpperCase()});
                break;
            case 'creditRequired':

                let creditRequired = event.target.value.replace(/[^0-9]/g, '');
                this.setState({creditRequired: creditRequired.slice(0, 2)});
                break;
            case 'creditElective':
                let creditElective = event.target.value.replace(/[^0-9]/g, '');
                this.setState({creditElective: creditElective.slice(0, 2)});
                break;

            default:
                break;
        }
    };
    handleOpenModal = (programID, programMask) => {
        this.getMentions(programID);
        this.setState({
            programID: programID,
            titleModal: 'MENCIONES DEL PROGRAMA DE ' + programMask,
            mentionModal: true,
            action: 'add',
            denomination: '',
            creditRequired: '',
            creditElective: '',

        });

    };
    handleCloseModal = () => {
        this.setState({
            mentionModal: false,
            action: 'add',
            denomination: '',
            creditRequired: '',
            creditElective: '',
        })
    };
    handleClickRetrieveRecord = record => {
        this.setState({
            action: 'update',
            mentionID: record.id,
            denomination: record.denomination || '',
            creditRequired: record.credit_required || '',
            creditElective: record.credit_elective || '',

        });
    };

    changeStateMention = (id) => {
        const url = app.programs + '/' + app.mention + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getMentions(this.state.programID);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    render() {
        //state frontend
        const {denomination, creditRequired, creditElective} = this.state;
        const {mentions} = this.state;

        const {titleModal, action, disabled} = this.state;

        return (
            <>
                <Modal show={this.state.mentionModal} onHide={() => this.setState({mentionModal: false})}>
                    <Modal.Header style={{background: '#ffba57'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>
                            {titleModal}
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
                                    <Form.Label className="floating-label">Creditos electivos</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id="number"
                                        value={creditElective}
                                        onChange={this.handleChange('creditElective')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <InputGroup className="mb-3 form-group fill" size="sm">
                                    <Form.Label className="floating-label">Creditos obligatorios</Form.Label>
                                    <Form.Control
                                        style={{marginTop: '10px'}}
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        value={creditRequired}
                                        onChange={this.handleChange('creditRequired')}
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
                                                   onClick={() => this.saveMention()}
                                                   style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                </i>
                                                :
                                                <i className="material-icons text-primary"
                                                   onClick={() => this.updateMention()}
                                                   style={{fontSize: '20px', paddingRight: '5px'}}>save
                                                </i>
                                        }

                                    </button>

                                </InputGroup>

                            </Col>

                        </Row>

                        <DataTable
                            records={mentions}
                            handleClickRetrieveRecord={this.handleClickRetrieveRecord}
                            changeStateMention={this.changeStateMention}

                        />


                    </Modal.Body>


                </Modal>


            </>
        )
    }
}
