import React from 'react';
import {Button, Card, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../index";

import Close from "@material-ui/icons/Close";

import defaultUser from "../../../../../../assets/images/user/default.jpg";

import Swal from "sweetalert2";

moment.locale('es');


class FormOrganization extends React.Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        action: "add",
        searchTA: "",
        person: "",
        observation: "",
        loaderOrganization: false,
        formOrganization: this.props.formOrganization,
        workPlanID: this.props.workPlanID,
        persons: [],
        retriveOrganizationData: this.props.retriveOrganizationData,
        organizationID: this.props.organizationID,


    };

    componentDidMount() {


    };


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveOrganizationData !== this.props.retriveOrganizationData) {
            this.setState({retriveOrganizationData: this.props.retriveOrganizationData});
            this.retriveForm(this.props.retriveOrganizationData);
        }
        if (prevProps.organizationID !== this.props.organizationID) {
            this.setState({organizationID: this.props.organizationID});
            this.openOrganizationSweetAlert(this.state.organizationID);
        }
        if (prevProps.formOrganization !== this.props.formOrganization) {
            this.setState({formOrganization: this.props.formOrganization});
        }
        if (prevProps.workPlanID !== this.props.workPlanID) {
            this.setState({workPlanID: this.props.workPlanID});
        }


    }

    async searchPersonTeacherAndAdministrative(params) {
        try {
            if (params !== '') {
                const url = app.person + '/search-person-ta' + params;
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


    async createOrganizationWorkPlan() {
        this.setState({loaderOrganization: true});
        const {person, workPlanID, observation, charge} = this.state;

        if (person !== '' && workPlanID !== '' && charge !== '') {
            const url = app.programs + '/' + app.organizationWorkPlan;
            let data = new FormData();
            data.set('id_work_plan', workPlanID);
            data.set('id_person', person);
            data.set('charge', charge);
            data.set('observation', observation);

            try {
                const res = await axios.post(url, data, app.headers);
                this.closeForm();
                this.props.callData();
                this.setState({loaderOrganization: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderOrganization: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderOrganization: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    async destroyOrganizationWorkPlan(id) {
        try {
            this.setState({loaderOrganization: true});
            const url = app.programs + '/' + app.organizationWorkPlan + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderOrganization: false});
            this.props.callData();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderOrganization: false});
            return false;
        }
    };

    async updateOrganizationWorkPlan() {

        this.setState({loader: true});
        const {person, observation, charge} = this.state;

        if (person !== '' && observation !== '' && charge !== '') {

            const url = app.programs + '/' + app.organizationWorkPlan + '/' + this.state.actualChargeID;
            let data = new FormData();
            data.set('id_person', person);
            data.set('charge', charge);
            data.set('observation', observation);

            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    handleChange = field => event => {
        switch (field) {
            case 'charge':
                this.setState({charge: event.target.value});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            case 'searchTA':
                this.searchPersonTeacherAndAdministrative(event.target.value);
                this.setState({searchTA: event.target.value});
                break;
            default:
                break;
        }
    };

    closeForm = () => {
        this.setState({
            formOrganization: false,
            action: "add",
            person: "",
            observation: "",
            charge: "",
            searchTA: "",
            organizationID: "",
            dataPerson: "",
            persons: [],
        });
        this.props.closeFormOrganization();

    };
    retriveForm = (r) => {

        console.log(r, "aqui esta la data en el form");
        this.setState({
            formOrganization: true,
            action: "update",
            actualChargeID: r.id,
            charge: r.charge,
            person: r.Person.id,
            searchTA: r.Person.name || '',
            observation: r.observation || '',

        })


    };
    openOrganizationSweetAlert = (id) => {
        console.log("sweetalert", id)
        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            icon: 'warning',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            showLoaderOnConfirm: true,
            preConfirm: async (state) => {
                if (!state) {
                    alert("algo aqui")
                    this.setState({organizationID: ""});
                    this.props.closeFormOrganization();
                    throw new Error("Ok")

                }
                const deleteRecord = await this.destroyOrganizationWorkPlan(id);
                return deleteRecord
            },
        })
    };

    selectedPerson = (data) => {
        this.setState({
            person: data.id || '',
            searchTA: data.name || '',
            dataPerson: data || '',
            persons: [],
        })
    };
    cleanInputPerson = () => {

        this.setState({
            person: "",
            searchTA: "",
            dataPerson: "",
            persons: [],
        })

    };

    render() {
        const {formOrganization, searchTA, persons, observation, charge, action, loaderOrganization} = this.state;

        return (
            <>


                <Modal show={formOrganization} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>ORGANIZACIÓN {action === "add" ? "REGISTRAR" : "EDITAR"}</Modal.Title>
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
                                            className="floating-label">Persona<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            style={{marginTop: "3px"}}
                                            id="number"
                                            value={searchTA}
                                            onChange={this.handleChange('searchTA')}
                                            placeholder="Ingrese descripción"
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

                                        <Table hover responsive style={{marginTop: '-1px'}}>
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
                                        </Table>

                                    </div>
                                </Form.Group>

                            </Col>


                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Cargo <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={charge}
                                                  onChange={this.handleChange('charge')}
                                    >
                                        <option defaultValue={true} hidden>
                                            Por favor seleccione una opcción
                                        </option>
                                        <option value="Presidente">Presidente</option>
                                        <option value="Secretaria/o">Secretaria/o</option>
                                        <option value="Miembro">Miembro</option>
                                        <option value="Apoyo Administrativo">Apoyo Administrativo</option>
                                    </Form.Control>

                                </Form.Group>
                            </Col>


                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Observación </Form.Label>
                                    <Form.Control
                                        value={observation}
                                        onChange={this.handleChange('observation')}
                                        placeholder="Observación"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                {action === 'add' ?
                                    <Button
                                        className="pull-right"
                                        disabled={loaderOrganization}
                                        variant="primary"

                                        onClick={() => this.createOrganizationWorkPlan()}>
                                        {loaderOrganization && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderOrganization}
                                        variant="primary"

                                        onClick={() => this.updateOrganizationWorkPlan()}>
                                        {loaderOrganization && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
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

export default FormOrganization;
