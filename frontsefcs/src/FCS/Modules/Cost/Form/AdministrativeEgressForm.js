import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Swal from "sweetalert2";
import Close from "@material-ui/icons/Close";
import defaultUser from "../../../../assets/images/user/default.jpg";


moment.locale('es');


class AdministrativeEgressForm extends React.Component {
    state = {

        action: "add",
        titleFormModalAdministrativeEgress: "REGISTRAR EGRESO ADMINISTRATIVO",
        amount: "",
        orderNumber: "",
        documentOne: "",
        initDate: '',
        stateEgress: 'Pendiente',
        endDate: '',

        personID: "",
        person: "",
        concept: "",
        egressID: "",
        dateEgress: "",
        organicUnit: this.props.organicUnit,
        retriveDataAdministrativeEgress: this.props.retriveDataAdministrativeEgress,
        formModalAdministrativeEgress: this.props.formModalAdministrativeEgress,
        deleteAdministrativeEgress: this.props.deleteAdministrativeEgress,
        persons: [],
    };

    componentDidMount() {

        if (this.state.retriveDataAdministrativeEgress !== "") {
            this.retriveForm(this.state.retriveDataAdministrativeEgress);
        }

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveDataAdministrativeEgress !== this.props.retriveDataAdministrativeEgress) {
            this.props.retriveDataAdministrativeEgress !== "" && this.retriveForm(this.props.retriveDataAdministrativeEgress);
        }
        if (prevProps.organicUnit !== this.props.organicUnit) {
            this.setState({organicUnit: this.props.organicUnit});
        }
        if (prevProps.admissionPlan !== this.props.admissionPlan) {
            this.setState({admissionPlan: this.props.admissionPlan});
        }
        if (prevProps.program !== this.props.program) {
            this.setState({program: this.props.program});
        }
        if (prevProps.deleteEgressID !== this.props.deleteEgressID) {
            this.props.deleteEgressID !== "" && this.deleteAdministrativeEgress(this.props.deleteEgressID);
        }
        if (prevProps.formModalAdministrativeEgress !== this.props.formModalAdministrativeEgress) {
            this.setState({formModalAdministrativeEgress: this.props.formModalAdministrativeEgress});
        }
    }


    async createAdministrativeEgress() {
        this.setState({loader: true});
        const {organicUnit, program, admissionPlan} = this.props;
        const {amount, endDate, initDate, personID, orderNumber, documentOne, concept, stateEgress} = this.state;


        if (amount !== '' && organicUnit !== '' && program !== '' && admissionPlan !== '' && documentOne !== '' && stateEgress !== '' && personID !== '' && initDate !== '' && concept !== '') {
            const url = app.accounting + '/' + app.egress + '/administrative';
            let data = new FormData();
            data.set('id_organic_unit', organicUnit);
            data.set('id_program', program);
            data.set('id_administrative', personID);
            data.set('id_admission_plan', admissionPlan);
            data.set('id_concept', concept);
            data.set('amount', amount);
            data.set('order_number', orderNumber);
            data.set('document_one', documentOne);
            data.set('end_date', endDate);
            data.set('state_egress', stateEgress);
            data.set('init_date', initDate);
            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callDataAdministrativeEgress();
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


    async updateAdministrativeEgress() {

        this.setState({loader: true});
        const {organicUnit, program, admissionPlan} = this.props;
        const {amount, endDate, initDate, personID, orderNumber, documentOne, concept, stateEgress} = this.state;


        if (amount !== '' && personID !== '' && initDate !== '' && stateEgress !== '' && concept !== '' && documentOne !== '') {
            const url = app.accounting + '/' + app.egress + '/administrative' + '/' + this.state.egressID;
            let data = new FormData();

            data.set('id_administrative', personID);
            data.set('amount', amount);
            data.set('order_number', orderNumber);
            data.set('document_one', documentOne);
            data.set('id_concept', concept);
            data.set('end_date', endDate);
            data.set('init_date', initDate);
            data.set('state_egress', stateEgress);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callDataAdministrativeEgress();
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


    async destroyEgressAdministrative(id) {
        try {
            const url = app.accounting + '/' + app.egress + '/Administrative' + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loader: false});
            this.props.callDataAdministrativeEgress();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    searchPerson(params) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/search-person' + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) this.setState({persons: res.data})
                }).catch(err => {
                    PNotify.error({
                        title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                    });
                    console.log(err)
                })
            }

        }

    };

    handleChange = field => event => {
        switch (field) {


            case 'person':
                this.searchPerson(event.target.value)
                this.setState({person: event.target.value});
                break;

            case 'amount':
                this.setState({amount: event.target.value});
                break;
            case 'concept':
                this.setState({concept: event.target.value});
                break;
            case 'orderNumber':
                this.setState({orderNumber: event.target.value});
                break;
            case 'documentOne':
                this.setState({documentOne: event.target.value});
                break;
            case 'initDate':
                this.setState({initDate: event.target.value});
                break;
            case 'stateEgress':
                this.setState({stateEgress: event.target.value});
                break;
            case 'endDate':
                this.setState({endDate: event.target.value});
                break;


            default:
                break;
        }
    };


    selectectAdministrative = (r) => {


        this.setState({
            personID: r.id, person: r.name, persons: [],

        });
    };

    closeSelectectAdministrative = () => {

        this.setState({
            personID: '', person: '', persons: [],

        });
    };
    retriveForm = (r) => {


        this.setState({
            action: "update",
            titleFormModalAdministrativeEgress: "ACTUALIZAR EGRESO ADMINISTRATIVO",
            egressID: r.id,
            amount: r.amount,
            concept: r.id_concept,
            orderNumber: r.order_number,
            documentOne: r.document_one,
            initDate: r.init_date,
            stateEgress: r.state_egress,
            endDate: r.end_date,
            personID: r.Administrative.id,
            person: r.Administrative.name,

        })


    };
    closeForm = () => {

        this.props.closeFormModalAdministrativeEgress();
        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "add",
            formModalAdministrativeEgress: false,
            titleFormModalAdministrativeEgress: "REGISTRAR EGRESO ADMINISTRATIVO",
            initDate: '',
            endDate: '',
            amount: '',
            concept: '',
            orderNumber: '',
            documentOne: '',
            stateEgress: 'Pendiente',
            egressID: '',
            personID: '',
            person: '',
            persons: [],

        })


    };
    deleteAdministrativeEgress = async (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
        }).then((result) => {
            if (result.value) {
                this.destroyEgressAdministrative(id);
            } else {
                this.closeForm();
            }
        })
    };

    render() {
        const {loader, action, persons, person, stateEgress} = this.state;
        const {endDate, initDate, amount, orderNumber, documentOne, concept} = this.state;
        return (<>

            <Modal show={this.state.formModalAdministrativeEgress}>
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5"
                                 style={{color: '#ffffff'}}>{this.state.titleFormModalAdministrativeEgress}</Modal.Title>
                    <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeForm}> <i className="feather icon-x"
                                                                             style={{
                                                                                 fontSize: "20px", color: 'white'
                                                                             }}></i> </span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={person === "" ? {color: "#ff5252 "} : null}
                                >Buscar por DNI<small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="Administrative"
                                    value={person}
                                    onChange={this.handleChange('person')}
                                    placeholder="Buscar"
                                    margin="normal"
                                />
                                {person ? <OverlayTrigger
                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                    <button
                                        onClick={() => this.closeSelectectAdministrative()}
                                        type="button"
                                        style={{
                                            position: 'relative',
                                            zIndex: 100,
                                            padding: '0',
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            color: '#7b7f84',
                                            marginTop: '-30px',
                                            float: 'right'
                                        }}
                                        className=" btn btn-dark"><Close
                                        style={{color: "dark"}}/></button>
                                </OverlayTrigger> : <></>


                                }


                                <Table hover responsive style={{marginTop: '-1px'}}>
                                    <tbody>
                                    {persons.length > 0 && persons.map((r, i) => {
                                        return (<tr key={i} onClick={() => this.selectectAdministrative(r)}>
                                            <td scope="row">
                                                <div className="d-inline-block align-middle">
                                                    <img
                                                        src={r.photo !== "" ? app.server + 'person-photography/' + r.photo : defaultUser}
                                                        // src={defaultUser}
                                                        alt="user"
                                                        className="img-radius align-top m-r-15"
                                                        style={{width: '40px'}}
                                                    />
                                                    <div className="d-inline-block">

                                                        <h6 className="m-b-0"> {r.name}</h6>
                                                        <p className="m-b-0"> {r.document_number} </p>

                                                    </div>
                                                </div>

                                            </td>
                                        </tr>)
                                    })}
                                    </tbody>
                                </Table>

                            </Form.Group>

                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Tipo</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    defaultValue={'SERVICIO'}
                                    name={"type"}
                                    placeholder="servicio"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={concept === "" ? {color: "#ff5252 "} : null}
                                >Concepto<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={concept}
                                              onChange={this.handleChange('concept')}
                                >

                                    <option defaultValue={true} hidden>Seleccione</option>
                                    <option value="88"> Pago a administrativos</option>
                                    <option value="89">Pago a la comisión de admisión</option>
                                    <option value="90">Pago a la comisión especial</option>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Monto</Form.Label>
                                <Form.Control
                                    type="number"

                                    value={amount}
                                    name={"amount"}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('amount')}
                                    placeholder="Monto"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Documento de Solicitud</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxlength="50"
                                    value={documentOne}
                                    name={"documentOne"}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('documentOne')}
                                    placeholder="Documento de Solicitud"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={initDate === "" ? {color: "#ff5252 "} : null}
                                >Fecha solicitud <small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="date"
                                    className="form-control"
                                    onChange={this.handleChange('initDate')}
                                    max="2999-12-31"
                                    value={initDate}
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Documento que acredita</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxlength="50"
                                    value={orderNumber}
                                    name={"orderNumber"}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('orderNumber')}
                                    placeholder="Documento que acredita"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"

                                >Fecha de documento <small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="date"
                                    className="form-control"
                                    onChange={this.handleChange('endDate')}
                                    max="2999-12-31"
                                    value={endDate}
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Estado</Form.Label>
                                <Form.Control as="select"
                                              value={stateEgress}
                                              onChange={this.handleChange('stateEgress')}>

                                    <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Pagado">Pagado</option>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    {action === 'add' ? <Button
                        className="pull-right"
                        disabled={loader}
                        variant="primary"

                        onClick={() => this.createAdministrativeEgress()}>
                        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                        Guardar</Button> : <Button
                        className="pull-right"
                        disabled={loader}
                        variant="primary"

                        onClick={() => this.updateAdministrativeEgress()}>
                        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                        Guardar Cambios</Button>}
                </Modal.Body>

            </Modal>


        </>);
    }
}

export default AdministrativeEgressForm;
