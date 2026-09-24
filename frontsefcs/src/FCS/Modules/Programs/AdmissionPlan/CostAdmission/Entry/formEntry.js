import React from 'react';
import {Button,  Col, Form,  Modal, OverlayTrigger, Row,  Tooltip} from 'react-bootstrap';
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../../../../../Component";

import Close from "@material-ui/icons/Close";


import Swal from "sweetalert2";
import Select from "react-select";

moment.locale('es');


class FormEntry extends React.Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        action: "add",
        amount: "",
        cant: 1,
        subTotal: "",
        concept: "",
        percent: "",
        observation: "",

        amountUit: "",
        yearUit: "",
        formEntry: this.props.formEntry,
        retriveEntry: this.props.retriveEntry,
        concepts: []

    };

    async componentDidMount() {
        this.listConceptByType();
        this.listActualUit();
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formEntry !== this.props.formEntry) {
            this.setState({formEntry: this.props.formEntry});
        }
        if (prevProps.retriveEntry !== this.props.retriveEntry) {
            this.props.retriveEntry && this.retriveForm(this.props.retriveEntry)
        }
        if (prevProps.deleteEntryID !== this.props.deleteEntryID) {
            this.props.deleteEntryID !== "" && this.openEntrySweetAlert(this.props.deleteEntryID)
        }
    }

    async listActualUit() {
        this.setState({loaderData: true});
        const url = app.general + '/' + app.uit + '/year/actual';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                amountUit: res.data.amount,
                yearUit: res.data.year
            });
            if (this.state.loaderData) {
                this.setState({loaderData: false})
            }

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listConceptByType() {
        try {
            const url = app.general + '/' + app.concepts + '/type/Ingreso';
            const res = await axios.get(url, app.headers);
            res.data.map((record) =>
                this.state.concepts.push({
                    value: record.id,
                    label: record.Category_concept.description + " - " + record.denomination,
                    percent: record.percent
                })
            );
        } catch (err) {
            console.log('We have the error', err);
        }
    };


    async createCostAdmissionPlan(AdmissionPlanID) {
        this.setState({loaderCostAdmission: true});


        const {concept, cant, amount, observation} = this.state;

        if (AdmissionPlanID !== '' && concept.value !== '' && amount !== ''&& cant !== '') {
            const url = app.programs + '/' + app.costAdmissionPlan;
            let data = new FormData();
            data.set('id_admission_plan', AdmissionPlanID);
            data.set('id_concept', concept.value);
            data.set('cant', cant);
            data.set('amount', amount);
            data.set('observation', observation);

            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({concept: "", cant: 1, amount: "", observation: "", subTotal: ""});
                this.props.callData();
                this.setState({loaderCostAdmission: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderCostAdmission: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderCostAdmission: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateCostAdmissionPlan() {

        this.setState({loaderCostAdmission: true});
        const {concept, cant, amount, observation} = this.state;

        if (concept !== '' && cant !== '' && amount !== '') {

            const url = app.programs + '/' + app.costAdmissionPlan + '/' + this.state.actualEntryID;
            let data = new FormData();
            data.set('id_concepts', concept.value);
            data.set('cant', cant);
            data.set('amount', amount);
            data.set('observation', observation);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loaderCostAdmission: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderCostAdmission: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderCostAdmission: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    async destroyEntry(id) {
        console.log(id)
        try {
            this.setState({loaderCostAdmission: true});
            const url = app.programs + '/' + app.costAdmissionPlan + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderCostAdmission: false});
            this.props.callData();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderCostAdmission: false});
            return false;
        }
    };

    calculateSubTotal = (amount, cant) => {
        if (cant !== "" && amount !== "") {
            let subTotal = cant * amount;
            this.setState({subTotal: Math.round(subTotal * 100) / 100})
        }

    }
    handleChange = field => event => {
        switch (field) {
            case 'amount':

                this.calculateSubTotal(event.target.value, this.state.cant);
                this.setState({amount: event.target.value});
                break;
            case 'cant':
                this.calculateSubTotal(this.state.amount, event.target.value);
                this.setState({cant: event.target.value});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;

            case 'concept':
                let amount = Math.round(event.percent * this.state.amountUit / 100);
                this.calculateSubTotal(amount, this.state.cant);
                this.setState({concept: {value: event.value, label: event.label}, amount: amount});
                break;
            default:
                break;
        }
    };

    closeForm = () => {
        this.setState({
            formEntry: false,
            action: "add",
            amount: "",
            cant: "",
            subTotal: "",
            concept: "",
            observation: "",
        });
        this.props.closeFormEntry();

    };
    retriveForm = (r) => {

        console.log(r, "aqui esta la data en el form");
        this.setState({
            formEntry: true,
            action: "update",
            actualEntryID: r.id,
            amount: r.amount,
            cant: r.cant,
            subTotal: Math.round(r.amount * r.cant * 100) / 100,
            concept: {value: r.id_concepts, label: r.Concept.Category_concept.description + " - " + r.Concept.denomination},
            observation: r.observation,

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
                alert.isConfirmed ? await this.destroyEntry(id) : this.props.closeFormEntry();
            } catch (e) {
                console.log('error:', e);
                return false;
            }
        };

    render() {
        const {AdmissionPlanID} = this.props;

        const {concepts, concept, cant, amount,  observation} = this.state;
        const {formEntry, action, loaderCostAdmission} = this.state;

        return (
            <>


                <Modal show={formEntry} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}> {action === "add" ? "REGISTRAR /" : "EDITAR /"} COSTOS
                            UIT {this.state.yearUit}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close type="button" style={{color: "white"}} onClick={() => this.closeForm()}/>

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>


                        <Row>


                            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                    <Form.Label className="floating-label"
                                                style={concept === "" ? {color: "#ff5252 "} : null}
                                    >Conceptos <small className="text-danger"> *</small></Form.Label>
                                    <Select
                                        isSearchable
                                        value={concept}
                                        name="concept"
                                        options={concepts}
                                        classNamePrefix="select"
                                        // isLoading={coursesLoader}
                                        className="basic-single"
                                        placeholder="Buscar conceptos"
                                        onChange={this.handleChange("concept")}
                                        styles={component.selectSearchStyle}
                                    />

                                </Form.Group>
                                <br/>
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={cant === "" ? {color: "#ff5252 "} : null}
                                    >Frecuencia <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={cant}
                                        onChange={this.handleChange('cant')}
                                        placeholder="Frecuencia"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={amount === "" ? {color: "#ff5252 "} : null}
                                    >Monto <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={amount}
                                        onChange={this.handleChange('amount')}
                                        placeholder="Monto"
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
                                        disabled={loaderCostAdmission}
                                        variant="primary"

                                        onClick={() => this.createCostAdmissionPlan(AdmissionPlanID)}>
                                        {loaderCostAdmission && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderCostAdmission}
                                        variant="primary"

                                        onClick={() => this.updateCostAdmissionPlan()}>
                                        {loaderCostAdmission && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
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

export default FormEntry;
