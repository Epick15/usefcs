import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
import Close from "@material-ui/icons/Close";
import defaultTicket from "../../../../assets/images/ticket/defaultTicket.png";
import $ from 'jquery';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

moment.locale('es');

class FormVoucher extends React.Component {
    state = {

        form: this.props.form,
        studentID: this.props.studentID,
        retriveMovement: this.props.retriveMovement,
        action: "add",
        preview: "",
        loaderVoucher: false,
        file: '',
        voucherCode: "",
        voucherDate: "",
        voucherAmount: "",
        observation: "",
        voucherType: "",
        voucherState: ""


    };

    async componentDidMount() {


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.form !== this.props.form) {
            this.setState({form: this.props.form})
        }
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID && this.setState({studentID: this.props.studentID})
        }
        if (prevProps.retriveMovement !== this.props.retriveMovement) {
            this.props.retriveMovement !== "" && this.retriveData(this.props.retriveMovement);
        }

        if (prevProps.deleteMovementID !== this.props.deleteMovementID) {
            this.props.deleteMovementID !== "" && this.openMovementSweetAlert(this.props.deleteMovementID);
        }
    }

    async createMovement() {

        this.setState({loaderVoucher: true});
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            file,
            studentID,
            observation,
            voucherType,
            voucherState
        } = this.state;
        const url = app.accounting + '/' + app.movement;

        if (voucherCode !== '' && voucherDate !== '' && voucherAmount !== '' && file !== '' && studentID !== '' && voucherState !== '' && voucherType !== '') {
            let data = new FormData();
            data.set('id_student', studentID);
            data.set('file', file);
            data.set("voucher_code", voucherCode);
            data.set("voucher_amount", voucherAmount);
            data.set("voucher_date", voucherDate);
            data.set("observation", observation);
            data.set("type", voucherType);
            data.set("state", voucherState);

            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callListMovement();
                this.closeForm();
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });
                this.setState({loaderVoucher: false});
            } catch (err) {
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.error,
                    delay: 2000
                });
                this.setState({loaderVoucher: false});
            }

        } else {
            this.setState({loaderVoucher: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }


    };

    async updateMovement() {
        this.setState({loaderVoucher: false});
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            file,
            studentID,
            observation,
            voucherState,
            voucherType
        } = this.state;
        const url = app.accounting + '/' + app.movement + '/' + this.state.movementID;
        if (voucherCode !== '' && voucherDate !== '' && voucherAmount !== '' && studentID !== '' && voucherType !== '' && voucherState !== '') {
            let data = new FormData();
            data.set('id_student', studentID);
            data.set('file', file);
            data.set("voucher_code", voucherCode);
            data.set("voucher_amount", voucherAmount);
            data.set("voucher_date", voucherDate);
            data.set("observation", observation);
            data.set("type", voucherType);
            data.set("state", voucherState);

            try {
              await axios.patch(url, data, app.headers);
                this.props.callListMovement();
                this.closeForm();
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.setState({loaderVoucher: false});
            } catch (err) {
                PNotify.error({
                    title: "Oh no!",
                    text: "Algo salio mal",
                    delay: 2000
                });
                this.setState({loaderVoucher: false});
            }

        } else {
            this.setState({loaderVoucher: false});
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }


    };

    async destroyMovement(id) {

        try {
            this.setState({loaderDestroyMovement: true});
            const url = app.accounting + '/' + app.movement + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderDestroyMovement: false});
            this.props.callListMovement();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
            this.setState({loaderDestroyMovement: false});
            return false;
        }
    };

    retriveData = (r) => {


        this.setState({
            action: 'update',
            movementID: r.id,
            preview: r.voucher_url ? app.server + app.voucher + r.voucher_url : defaultTicket,
            voucherCode: r.voucher_code,
            voucherDate: r.voucher_date,
            voucherAmount: r.voucher_amount,
            observation: r.observation,
            voucherState: r.state,
            voucherType: r.type,
        })
    };
    handleChange = field => event => {

        switch (field) {
            case 'voucherCode':
                let voucherCode = event.target.value;
                this.setState({voucherCode: voucherCode.slice(0, 30)});
                break;
            case 'voucherAmount':
                this.setState({

                    voucherAmount: event.target.value.slice(0, 8)
                });
                break;
            case 'voucherDate':
                this.setState({voucherDate: event.target.value});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            case 'voucherState':
                this.setState({voucherState: event.target.value});
                break;
            case 'voucherType':
                this.setState({voucherType: event.target.value});
                break;
            default:
                break;
        }
    };
    openFileReader = () => {
        const input = '#inputVaucher';
        $(input).click();
    };
    changeVaucher = (event) => {
        const fileExtension = ['jpg', 'jpeg', 'png'];
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
                    // imgSize: 'wid-500 text-center',
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
    closeForm = () => {
        this.setState({
            form: false,
            preview: "",
            file: '',
            voucherCode: "",
            voucherDate: "",
            voucherAmount: "",
            observation: "",
            voucherState: "",
            voucherType: "",
            action: "add",
        })
        this.props.closeForm()
    }
    openMovementSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyMovement(id) : this.props.closeForm();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    render() {

        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            observation,
            preview,
            voucherType,
            voucherState,
            loaderVoucher
        } = this.state;

        return (
            <Modal show={this.state.form} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5"
                                 style={{color: '#ffffff'}}>{this.state.action === "add" ? "REGISTRAR" : "EDITAR"} VOUCHER
                    </Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}}
                                   onClick={() => this.closeForm()}
                            />

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Comprobante de pago</Form.Label>
                                    </Form.Group>
                                    <div className="position-relative d-inline-block mb-4">
                                        {/*{loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                        <img
                                            style={preview ? {marginTop: "-25px", width: "100%"} : {
                                                marginTop: "-25px",
                                                width: "30%"
                                            }}
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
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>


                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                                    style={voucherType === "" ? {color: "#ff5252 "} : null}
                                        >Tipo Comprobante<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control as="select"
                                                      value={voucherType}
                                                      onChange={this.handleChange('voucherType')}>
                                            >
                                            <option defaultValue={true} hidden>seleccione</option>
                                            <option value={"Caja Tesorería"}>Caja Tesorería</option>
                                            <option value={"Transferencia"}> Transferencia</option>
                                            <option value={"Deposíto"}> Deposíto</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                                    style={voucherCode === "" ? {color: "#ff5252 "} : null}
                                        >N° Recibo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="number"
                                            disabled={this.state.action !== 'add'}
                                            value={voucherCode}
                                            onChange={this.handleChange('voucherCode')}
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                                    style={voucherAmount === "" ? {color: "#ff5252 "} : null}
                                        >Monto</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={voucherAmount}
                                            className="form-control"
                                            onChange={this.handleChange('voucherAmount')}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                                    style={voucherDate === "" ? {color: "#ff5252 "} : null}
                                        >Fecha</Form.Label>
                                        <Form.Control
                                            type="date"
                                            max="2999-12-31"
                                            value={voucherDate}
                                            onChange={this.handleChange('voucherDate')}
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                                    style={voucherState === "" ? {color: "#ff5252 "} : null}
                                        >Estado<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control as="select"
                                                      value={voucherState}
                                                      onChange={this.handleChange('voucherState')}>
                                            >
                                            <option defaultValue={true} hidden>seleccione</option>
                                            <option value={"Registrado"}>Registrado</option>
                                            <option value={"Aceptado"}> Aceptado</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Observación</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={observation}
                                            onChange={this.handleChange('observation')}
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {
                                        this.state.action === "add" ?

                                            <Button
                                                className="pull-right mr-1"
                                                onClick={() => this.createMovement()}
                                                variant="primary"
                                                disabled={loaderVoucher}
                                            >
                                                {loaderVoucher &&
                                                <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                                Guardar</Button>
                                            :
                                            <Button
                                                className="pull-right mr-1"
                                                onClick={() => this.updateMovement()}
                                                variant="primary"
                                                disabled={loaderVoucher}
                                            >
                                                {loaderVoucher &&
                                                <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                                Guardar Cambios</Button>

                                    }


                                </Col>


                            </Row>
                        </Col>
                    </Row>

                </Modal.Body>
            </Modal>
        );
    }
}

export default FormVoucher;
