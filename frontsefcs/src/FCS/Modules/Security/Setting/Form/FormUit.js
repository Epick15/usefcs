import React from 'react';
import {Button, Col, Form, Modal,  Row} from 'react-bootstrap';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';

import Swal from "sweetalert2";


moment.locale('es');


class FormUit extends React.Component {
    state = {
        action: "add",
        titleFormModalUit: "REGISTRAR UIT",
        numberAccount: "",
        cci: "",
        bank: "",
        retriveUit: this.props.retriveUit,
        formModalUit: this.props.formModalUit,
        deleteUit: this.props.deleteUit,

    };

    componentDidMount() {

        if (this.state.retriveUit !== "") {
            this.retriveForm(this.state.retriveUit);
        }

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveUit !== this.props.retriveUit) {
            this.retriveForm(this.props.retriveUit);
        }
        if (prevProps.deleteUit !== this.props.deleteUit) {
            this.props.deleteUit !== "" && this.deleteUit(this.props.deleteUit);
        }
        if (prevProps.formModalUit !== this.props.formModalUit) {
            this.setState({formModalUit: this.props.formModalUit});
        }


    }


    async createUit() {
        this.setState({loader: true});
        const {year, amount} = this.state;
        if (year !== '' && amount !== '') {
            const url = app.general + '/' + app.uit;
            let data = new FormData();
            data.set('year', year);
            data.set('amount', amount);
            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callDataUit();
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


    async updateUit() {

        this.setState({loader: true});
        const {year, amount, uitID} = this.state;

        if (year !== '' && amount !== '' && uitID !== '') {

            const url = app.general + '/' + app.uit + '/' + this.state.uitID;
            let data = new FormData();
            data.set('year', year);
            data.set('amount', amount);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callDataUit();
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


    async destroyUit(id) {
        try {
            const url = app.general + '/' + app.uit + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loader: false});
            this.props.callDataUit();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    handleChange = field => event => {
        switch (field) {


            case 'year':
                this.setState({year: event.target.value});
                break;
            case 'amount':
                this.setState({amount: event.target.value});
                break;


            default:
                break;
        }
    };


    retriveForm = (r) => {
        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "update",
            titleFormModalUit: "ACTUALIZAR UIT",
            uitID: r.id,
            year: r.year,
            amount: r.amount
        });
    };
    closeForm = () => {
        this.props.closeFormModalUit();
        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "add",
            titleFormModalUit: "REGISTRAR CUENTA BANCARIA",
            uitID: "",
            year: "",
            amount: ""
        });
    };
    deleteUit = async (id) => {

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
                this.destroyUit(id);
            } else {
                this.closeForm();
            }
        })
    };

    render() {
        const {loader, action} = this.state;
        const {year, amount} = this.state;

        return (
            <>

                <Modal show={this.state.formModalUit}>
                    <Modal.Header className='bg-primary'>

                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{this.state.titleFormModalUit}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeForm}> <i className="feather icon-x"
                                                                             style={{fontSize: "20px", color: 'white'}}></i> </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>

                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Año</Form.Label>
                                    <Form.Control
                                        type="number"

                                        value={year}
                                        name={"year"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('year')}
                                        placeholder="Descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Monto</Form.Label>
                                    <Form.Control
                                        type="number"

                                        value={amount}
                                        name={"amount"}
                                        onChange={this.handleChange('amount')}
                                        placeholder="CCI"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {action === 'add' ?
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.createUit()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.updateUit()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>

                </Modal>


            </>
        );
    }
}

export default FormUit;
