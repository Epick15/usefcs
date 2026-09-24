import React from 'react';
import {Button,  Col, Form, InputGroup, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';
import app from "../../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';

import Close from "@material-ui/icons/Close";


import Swal from "sweetalert2";
import defaultUser from "../../../../../../../assets/images/user/default.jpg";

moment.locale('es');


class FormAdministrative extends React.Component {
    state = {

        action: "add",
        amount: "",
        subTotal: 0,
        concept: "",
        person: "",
        observation: "",
        conceptMask: "",
        searchA: "",
        numberMonth: this.props.durationMask,
        formAdministrative: this.props.formAdministrative,
        retriveAdministrative: this.props.retriveAdministrative,
        concepts: [],
        persons: [],

    };

    async componentDidMount() {
        this.listConceptByDescription();
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formAdministrative !== this.props.formAdministrative) {
            this.setState({formAdministrative: this.props.formAdministrative});
        }
        if (prevProps.retriveAdministrative !== this.props.retriveAdministrative) {
            this.props.retriveAdministrative && this.retriveForm(this.props.retriveAdministrative)
        }
        if (prevProps.deleteAdministrativeID !== this.props.deleteAdministrativeID) {
            this.props.deleteAdministrativeID !== "" && this.openEntrySweetAlert(this.props.deleteAdministrativeID)
        }
    }

    async listConceptByDescription() {
        try {
            const url = app.general + '/' + app.concepts + '/des/Pago a administrativos';
            const res = await axios.get(url, app.headers);
            this.setState({concept: res.data.id, conceptMask: res.data.denomination});
        } catch (err) {
            console.log('We have the error', err);
        }
    };

    async searchPersonAdministrative(params) {
        try {
            if (params !== '') {
                const url = app.person + '/search-person-a' + params;
                const res = await axios.get(url, app.headers);
                this.setState({persons: res.data})
                return res;
            } else {
                return null
            }
        } catch (err) {
            console.log('We have the error', err);
            return err;
        }
    };

    async createEgressAdministrative(workPlanID) {
        this.setState({loaderAdministrative: true});

        const {concept, numberMonth, amount, person, observation} = this.state;
        if (workPlanID !== '' && person !== '' && concept !== '' && numberMonth !== '' && amount !== '') {
            const url = app.programs + '/' + app.egressAdministrative;
            let data = new FormData();
            data.set('id_work_plan', workPlanID);
            data.set('id_person', person);
            data.set('id_concept', concept);
            data.set('number_month', numberMonth);
            data.set('amount', amount);
            data.set('observation', observation);

            try {
                const res = await axios.post(url, data, app.headers);
                this.cleanInputPerson();
                this.setState({amount: "", observation: "", subTotal: ""});
                this.props.callDataEgressAdministrative();
                this.setState({loaderAdministrative: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderAdministrative: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderAdministrative: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateEgressAdministrative() {

        this.setState({loaderAdministrative: true});
        const {amount, person, observation} = this.state;

        if (person !== '' && amount !== '') {

            const url = app.programs + '/' + app.egressAdministrative + '/' + this.state.actualEgressAdministrativeID;
            let data = new FormData();

            data.set('id_person', person);
            data.set('amount', amount);
            data.set('observation', observation);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callDataEgressAdministrative();
                this.closeForm();
                this.setState({loaderAdministrative: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderAdministrative: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderAdministrative: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    async destroyEntry(id) {

        try {
            this.setState({loaderAdministrative: true});
            const url = app.programs + '/' + app.egressAdministrative + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderAdministrative: false});
            this.props.callDataEgressAdministrative();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderAdministrative: false});
            return false;
        }
    };


    handleChange = field => event => {
        switch (field) {
            case 'amount':

                const subTotal = Math.round(event.target.value * this.props.durationMask * 100) / 100;
                this.setState({amount: event.target.value, subTotal: subTotal});
                break;
            case 'subTotal':
                this.setState({subTotal: event.target.value});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            case 'concept':
                this.setState({concept: {value: event.value, label: event.label}});
                break;
            case 'searchA':
                this.searchPersonAdministrative(event.target.value);
                this.setState({searchA: event.target.value});
                break;
            default:
                break;
        }
    };

    closeForm = () => {
        this.setState({
            formAdministrative: false,
            action: "add",
            amount: "",
            subTotal: "",
            observation: "",
        });
        this.props.closeFormAdministrative();

    };
    retriveForm = (r) => {


        this.setState({
            formAdministrative: true,
            action: "update",
            actualEgressAdministrativeID: r.id,
            amount: r.amount,
            subTotal: Math.round(r.amount * r.number_month * 100) / 100,
            observation: r.observation,
            person: r.Person.id,
            searchA: r.Person.name,

        })


    };

    openEntrySweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyEntry(id) : this.props.closeFormAdministrative();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    selectedPerson = (data) => {
        this.setState({
            person: data.id || '',
            searchA: data.name || '',
            dataPerson: data || '',
            persons: [],
        })
    };
    cleanInputPerson = () => {

        this.setState({
            person: "",
            searchA: "",
            dataPerson: "",
            persons: [],
        })

    };


    render() {
        const {persons, person, searchA, conceptMask, subTotal, amount, observation} = this.state;
        const {formAdministrative, action, loaderAdministrative} = this.state;

        return (
            <>


                <Modal show={formAdministrative} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}> {action === "add" ? "REGISTRAR" : "EDITAR"} {conceptMask}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close type="button" style={{color: "white"}} onClick={() => this.closeForm()}/>

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>


                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <InputGroup>
                                        <Form.Label
                                            style={person === "" ? {color: "#ff5252 "} : null}
                                            className="floating-label">Buscar Personal Administrativo<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            style={{marginTop: "3px"}}
                                            id="number"
                                            value={searchA}
                                            onChange={this.handleChange('searchA')}
                                            placeholder="Nombre / DNI"
                                            margin="normal"
                                        />
                                        <InputGroup.Append>
                                            <OverlayTrigger
                                                overlay={<Tooltip style={{zIndex: 100000000}}>Limpiar</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px', marginTop: '-2px',
                                                    position: 'relative',
                                                    zIndex: 100,
                                                    fontSize: '20px',
                                                    padding: '0',
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                }}>
                                                    <Close onClick={() => this.cleanInputPerson()} className="text-dark"/>
                                                </button>
                                            </OverlayTrigger>
                                        </InputGroup.Append>
                                    </InputGroup>
                                    <div className=" table-responsive"
                                         style={{
                                             position: 'absolute',
                                             zIndex: '223123',
                                             backgroundColor: 'white'
                                         }}
                                    >

                                        {persons.length > 0 && <Table hover responsive style={{marginTop: '-1px'}}>
                                            <tbody>
                                            {persons.length > 0 &&
                                            persons.map((r, i) => {
                                                return (
                                                    <tr key={i} onClick={() => this.selectedPerson(r)}>
                                                        <td scope="row">
                                                            <div className="d-inline-block align-middle">
                                                                <img
                                                                    // src={app.server + 'photography/' + r.photo || defaultUser}
                                                                    src={defaultUser}
                                                                    alt="user"
                                                                    className="img-radius align-top m-r-15"
                                                                    style={{width: '40px'}}
                                                                />
                                                                <div className="d-inline-block">
                                                                    <h6 className="m-b-0"> {r.name}</h6>
                                                                    <p className="m-b-0"> {r.document_number}</p>
                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                            </tbody>
                                        </Table>}

                                    </div>
                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={amount === "" ? {color: "#ff5252 "} : null}
                                    >Monto <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={this.handleChange('amount')}
                                        placeholder="Monto"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Meses </Form.Label>
                                    <Form.Control
                                        value={this.props.durationMask}
                                        disabled={true}
                                        placeholder="Total de meses"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                    >SubTotal </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={subTotal}
                                        disabled={true}
                                        onChange={this.handleChange('subTotal')}
                                        placeholder="subTotal"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Observación </Form.Label>
                                    <Form.Control
                                        value={observation}
                                        onChange={this.handleChange('observation')}
                                        placeholder="observation"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                {action === 'add' ?
                                    <Button
                                        className="pull-right"
                                        disabled={loaderAdministrative}
                                        variant="primary"

                                        onClick={() => this.createEgressAdministrative(this.props.workPlanID)}>
                                        {loaderAdministrative && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderAdministrative}
                                        variant="primary"

                                        onClick={() => this.updateEgressAdministrative()}>
                                        {loaderAdministrative && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar Cambios</Button>
                                }


                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>


            </>
        );
    }
}

export default FormAdministrative;
