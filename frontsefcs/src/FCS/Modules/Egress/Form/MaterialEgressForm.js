import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Swal from "sweetalert2";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";


moment.locale('es');


class MaterialEgressForm extends React.Component {
    state = {

        action: "add",
        titleFormModalMaterialEgress: "REGISTRAR EGRESO MATERIALES",
        amount: "",
        stateEgress: 'Pendiente',


        materialID: "",
        material: "",
        egressID: "",
        documentOne: "",
        orderNumber: "",
        initDate: "",
        endDate: "",
        organicUnit: this.props.organicUnit,
        retriveDataMaterialEgress: this.props.retriveDataMaterialEgress,
        formModalMaterialEgress: this.props.formModalMaterialEgress,
        deleteMaterialEgressID: this.props.deleteMaterialEgressID,
        materials: [],
    };

    componentDidMount() {
        if (this.state.retriveDataMaterialEgress !== "") {
            this.retriveForm(this.state.retriveDataMaterialEgress);
        }

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveDataMaterialEgress !== this.props.retriveDataMaterialEgress) {
            this.props.retriveDataMaterialEgress !== "" && this.retriveForm(this.props.retriveDataMaterialEgress);
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
        if (prevProps.deleteMaterialEgressID !== this.props.deleteMaterialEgressID) {
            this.props.deleteMaterialEgressID !== "" && this.deleteMaterialEgress(this.props.deleteMaterialEgressID);
        }
        if (prevProps.formModalMaterialEgress !== this.props.formModalMaterialEgress) {
            this.setState({formModalMaterialEgress: this.props.formModalMaterialEgress});
        }
    }


    async createMaterialEgress() {
        this.setState({loader: true});
        const {organicUnit, program, admissionPlan} = this.props;
        const {amount, initDate, materialID, orderNumber, documentOne, endDate, type, stateEgress} = this.state;

        if (amount !== '' && organicUnit !== '' && program !== '' && documentOne !== '' && admissionPlan !== '' && stateEgress !== '' && amount !== '' && materialID !== '' && initDate !== '' && type !== '') {
            const url = app.accounting + '/' + app.egress + '/material';
            let data = new FormData();
            data.set('id_organic_unit', organicUnit);
            data.set('id_program', program);
            data.set('id_material', materialID);
            data.set('type', type);
            data.set('id_admission_plan', admissionPlan);
            data.set('amount', amount);
            data.set('document_one', documentOne);
            data.set('order_number', orderNumber);
            data.set('init_date', initDate);
            data.set('end_date', endDate);
            data.set('state_egress', stateEgress);
            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callDataMaterialEgress();
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


    async updateMaterialEgress() {

        this.setState({loader: true});
        const {organicUnit, program, admissionPlan} = this.props;
        const {amount, initDate, endDate, materialID, orderNumber, documentOne, stateEgress, type} = this.state;


        if (amount !== '' && materialID !== '' && stateEgress !== '' && documentOne !== '' && type !== '') {
            const url = app.accounting + '/' + app.egress + '/material' + '/' + this.state.egressID;
            let data = new FormData();

            data.set('id_material', materialID);
            data.set('amount', amount);
            data.set('type', type);
            data.set('order_number', orderNumber);
            data.set('document_one', documentOne);
            data.set('init_date', initDate);
            data.set('end_date', endDate);
            data.set('state_egress', stateEgress);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callDataMaterialEgress();
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


    async destroyEgressMaterial(id) {
        try {
            const url = app.accounting + '/' + app.egress + '/material' + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loader: false});
            this.props.callDataMaterialEgress();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    searchMaterial(params) {
        if (params.length === 0) {
            this.setState({materials: []})
        } else {
            if (params.length > 3) {
                const url = app.general + '/search-material' + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) this.setState({materials: res.data})
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


            case 'material':
                this.searchMaterial(event.target.value)
                this.setState({material: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;

            case 'amount':
                this.setState({amount: event.target.value});
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
            case 'endDate':
                this.setState({endDate: event.target.value});
                break;
            case 'stateEgress':
                this.setState({stateEgress: event.target.value});
                break;

            default:
                break;
        }
    };


    selectectMaterial = (r) => {


        this.setState({
            materialID: r.id, material: r.denomination, materials: [],

        });
    };

    closeSelectectMaterial = () => {

        this.setState({
            materialID: '', type: '', material: '',

            materials: [],

        });
    };
    retriveForm = (r) => {


        this.setState({
            action: "update",
            titleFormModalMaterialEgress: "ACTUALIZAR EGRESO MATERIALES",
            egressID: r.id,
            type: r.type,
            amount: r.amount,
            documentOne: r.document_one,
            orderNumber: r.order_number,
            dateEgress: r.egress_date,
            stateEgress: r.state_egress,
            materialID: r.Material.id,
            material: r.Material.denomination,

        })


    };
    closeForm = () => {

        this.props.closeFormModalMaterialEgress();
        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "add",
            formModalMaterialEgress: false,
            titleFormModalMaterialEgress: "REGISTRAR EGRESO MATERIALES",
            dateEgress: '',
            retriveDataTeacherEgress: '',
            amount: '',
            type: '',
            orderNumber: '',
            initDate: '',
            documentOne: '',
            egressID: '',
            stateEgress: 'Pendiente',
            materialID: '',
            material: '',
            materials: [],

        })


    };
    deleteMaterialEgress = async (id) => {

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
                this.destroyEgressMaterial(id);
            } else {
                this.closeForm();
            }
        })
    };

    render() {
        const {loader, action, materials, material, orderNumber,documentOne} = this.state;
        const {initDate, endDate, amount, type, stateEgress} = this.state;
        return (<>

            <Modal show={this.state.formModalMaterialEgress}>
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5"
                                 style={{color: '#ffffff'}}>{this.state.titleFormModalMaterialEgress}</Modal.Title>
                    <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeForm}>
                                <i className="feather icon-x"
                                   style={{fontSize: "20px", color: 'white'}}></i> </span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={material === "" ? {color: "#ff5252 "} : null}
                                >MATERIALES<small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="Administrative"
                                    value={material}
                                    onChange={this.handleChange('material')}
                                    placeholder="Buscar curso"
                                    margin="normal"
                                />
                                {material ? <OverlayTrigger
                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                    <button
                                        onClick={() => this.closeSelectectMaterial()}
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
                                </OverlayTrigger> : <OverlayTrigger
                                    overlay={<Tooltip>NUEVO</Tooltip>}>
                                    <button
                                        onClick={() => this.openFormAdministrative()}
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
                                        className=" btn btn-dark"><Add
                                        style={{color: "dark"}}/></button>
                                </OverlayTrigger>

                                }


                                <Table hover responsive style={{marginTop: '-1px'}}>
                                    <tbody>
                                    {materials.length > 0 && materials.map((r, i) => {
                                        return (<tr key={i} onClick={() => this.selectectMaterial(r)}>
                                            <td scope="row" style={{padding: '1px'}}>
                                                <h5 style={{
                                                    fontSize: '14px', marginBottom: '11px'
                                                }}> {r.denomination} </h5>

                                            </td>
                                        </tr>)
                                    })}
                                    </tbody>
                                </Table>

                            </Form.Group>

                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"

                                >Tipo<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={type}
                                              onChange={this.handleChange('type')}
                                >
                                    <option defaultValue={true} hidden>Seleccione</option>
                                    <option value="Bien">BIEN</option>
                                    <option value="Servicio">SERVICIO</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Concepto</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    defaultValue={'PAGO POR ADQUISICION DE MATERIALES O SERVICIOS'}
                                    name={"concept"}
                                    placeholder="concept"
                                    margin="normal"
                                />
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
                                    placeholder="Descripción"
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

                        onClick={() => this.createMaterialEgress()}>
                        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                        Guardar</Button> : <Button
                        className="pull-right"
                        disabled={loader}
                        variant="primary"

                        onClick={() => this.updateMaterialEgress()}>
                        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                        Guardar Cambios</Button>}
                </Modal.Body>

            </Modal>


        </>);
    }
}

export default MaterialEgressForm;
