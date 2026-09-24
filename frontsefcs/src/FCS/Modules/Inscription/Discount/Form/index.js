import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
import Close from "@material-ui/icons/Close";
import $ from 'jquery';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

moment.locale('es');

class FormDiscount extends React.Component {
    state = {

        form: true,
        studentID: this.props.studentID,
        ADMISSIONPLANID: this.props.ADMISSIONPLANID,
        retriveMovement: this.props.retriveMovement,
        action: "add",
        preview: "",
        loaderDiscount: false,
        amount: '',


        discounts: []

    };

    async componentDidMount() {
        this.listDiscount()

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.form !== this.props.form) {
            this.setState({form: this.props.form})
        }

    }

    async listDiscount() {
        this.setState({loaderDiscount: true});
        const url = app.general + '/' + app.discount
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({discounts: res.data})
            }
            this.setState({loaderDiscount: false});
        } catch (err) {
            this.setState({loaderDiscount: false});
            PNotify.error({title: "Algo salio mal!", text: "Por favor intentelo nuevamente", delay: 2000});
            console.log(err)
        }
    };

    async createStudentDiscount() {

        this.setState({loaderDiscount: true});
        const {
            studentID,
            discount,
            amount,
            observation
        } = this.state;
        const url = app.person + '/' + app.studentDiscount;

        if (studentID !== '' && discount !== '' && amount !== '') {
            let data = new FormData();
            data.set('id_student', studentID);
            data.set('id_discount', discount);
            data.set('id_admission_plan', this.props.ADMISSIONPLANID);
            data.set('observation', observation);
            data.set('amount', amount);


            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });
                this.setState({loaderDiscount: false});
            } catch (err) {
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.error,
                    delay: 2000
                });
                this.setState({loaderDiscount: false});
            }

        } else {
            this.setState({loaderDiscount: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }


    };


    handleChange = field => event => {

        switch (field) {
            case 'discount':
                let amount = $('#discount-' + event.target.value).attr('discountAmount');
                this.setState({discount: event.target.value, amount: amount});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            default:
                break;
        }
    };

    closeForm = () => {
        this.setState({
            form: false,
            amount: "",
            observation: "",
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
            discounts,
            discount,
            observation,
            loaderDiscount,

        } = this.state;

        return (
            <Modal show={this.state.form} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5"
                                 style={{color: '#ffffff'}}>{this.state.action === "add" ? "REGISTRAR" : "EDITAR"} DESCUENTO
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={discount === "" ? {color: "#ff5252 "} : null}
                                >Descuento<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={discount}
                                              onChange={this.handleChange('discount')}>
                                    >
                                    <option defaultValue={true} hidden>
                                        Descuento</option>
                                    {
                                        discounts.length > 0 ?
                                            discounts.map((r, index) => {

                                                return (
                                                    <option
                                                        id={"discount-" + r.id}
                                                        discountamount={r.amount}
                                                        value={r.id} key={index}>
                                                        {r.description}
                                                    </option>
                                                )

                                            }) :
                                            <option defaultValue={true}>Error al cargar los
                                                Datos</option>
                                    }
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
                                        onClick={() => this.createStudentDiscount()}
                                        variant="primary"
                                        disabled={loaderDiscount}
                                    >
                                        {loaderDiscount &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button>
                                    :
                                    <Button
                                        className="pull-right mr-1"
                                        onClick={() => this.updateMovement()}
                                        variant="primary"
                                        disabled={loaderDiscount}
                                    >
                                        {loaderDiscount &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar Cambios</Button>

                            }


                        </Col>


                    </Row>


                </Modal.Body>
            </Modal>
        );
    }
}

export default FormDiscount;
