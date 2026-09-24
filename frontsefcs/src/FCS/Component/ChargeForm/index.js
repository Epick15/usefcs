import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import app from "../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../index";
import Select from "react-select";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";


moment.locale('es');


class ChargeForm extends React.Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        organicUnits: [],
        charges: [],
        contractTypes: [],
        dfValue: "",
        organicUnit: "",
        charge: "",
        contractType: "",
        date_start: "",
        date_end: "",
        action: "add",

        formModal: this.props.formModal,
        retriveData: this.props.retriveData,
        typeForm: this.props.route === "teacher" ? "Docente" : "Administrativo",
        route: this.props.route,
        optionDelete: this.props.optionDelete,

    };

    componentDidMount() {

        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});
        if (this.state.retriveData !== "") {
            this.retriveForm(this.state.retriveData);
        }
        if (this.state.optionDelete !== "" && this.state.formModal === false) {
            this.deleteContractSweet(this.state.optionDelete);
        }
        this.getUnitOrganic();
        this.getCharges();
        this.getContractTypes();


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveData !== this.props.retriveData) {
            this.setState({retriveData: this.props.retriveData});
        }
        if (prevProps.optionDelete !== this.props.optionDelete) {
            this.setState({optionDelete: this.props.optionDelete});
        }
        if (prevProps.formModal !== this.props.formModal) {
            this.setState({formModal: this.props.formModal});
        }
        if (prevProps.route !== this.props.route) {
            this.setState({route: this.props.route});
        }

    }

    getUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                res.data.map((record, index) =>
                    this.state.organicUnits.push({
                        value: record.id,
                        label: record.denomination + " " + record.Campu.denomination,
                    }));
                // this.setState({organicUnits: res.data, showOrganicUnit: true})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };

    getCharges() {
        const url = app.general + '/' + app.charge;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({charges: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener cargos",
                delay: 2000
            });
            console.log(err)
        })
    };

    getContractTypes() {
        const url = app.general + '/' + app.contractType;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({contractTypes: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener tipos de contrato",
                delay: 2000
            });
            console.log(err)
        })
    };

    createCharge() {
        this.setState({loaderCharge: true});
        const url = app.person + '/' + this.state.route;

        const {organicUnit, charge, contractType, date_start, date_end} = this.state;
        if (this.props.personID !== '' && organicUnit !== '' && charge !== '' && contractType !== '' && date_start !== '' && date_end) {
            let data = new FormData();
            data.set("id_person", this.props.personID);
            data.set('id_charge', charge);
            data.set('id_contract_type', contractType);
            data.set('date_start', date_start);
            data.set('date_end', date_end);
            data.set('id_organic_unit', organicUnit.value);
            axios.post(url, data, app.headers).then((res) => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.setState({loaderCharge: false});
                this.props.callData();
                this.closeForm();
            }).catch((err) => {
                this.setState({loaderCharge: false})
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.message,
                    delay: 3000
                });
            });
        } else {
            this.setState({loaderCharge: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    updateCharge() {
        this.setState({loaderCharge: true});
        const url = app.person + '/' + this.state.route + '/' + this.state.actualChargeID;

        const {organicUnit, charge, contractType, date_start, date_end} = this.state;
        if (this.props.personID !== '' && organicUnit !== '' && charge !== '' && contractType !== '' && date_start !== '' && date_end) {
            let data = new FormData();

            data.set('id_charge', charge);
            data.set('id_contract_type', contractType);
            data.set('date_start', date_start);
            data.set('date_end', date_end);
            data.set('id_organic_unit', organicUnit.value);
            axios.patch(url, data, app.headers).then((res) => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.setState({loaderCharge: false});
                this.props.callData();
                this.closeForm();
            }).catch((err) => {
                this.setState({loaderCharge: false})
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.message,
                    delay: 3000
                });
            });
        } else {
            this.setState({loaderCharge: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    async destroyCharge(id) {
        try {
            this.setState({loaderCharge: true});
            const url = app.person + '/' + this.state.route + '/' + id;
            const res = await axios.delete(url, app.headers);


            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderCharge: false});
            this.props.callData();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderCharge: false});
            return false;
        }
    };

    handleChange = field => event => {
        switch (field) {


            case 'organicUnit':

                this.setState({organicUnit: {value: event.value, label: event.label}});
                break;
            case 'charge':
                this.setState({charge: event.target.value});
                break;
            case 'contractType':
                this.setState({contractType: event.target.value});
                break;

            case 'date_start':
                this.setState({date_start: event.target.value});
                break;
            case 'date_end':
                this.setState({date_end: event.target.value});
                break;

            default:
                break;
        }
    };

    closeForm = () => {
        this.setState({
            organicUnit: "",
            dfValue: "",
            charge: "",
            contractType: "",
            date_start: "",
            date_end: "",
            actualChargeID: "",
            action: "add"
        });
        this.props.closeForm();

    };
    retriveForm = (r) => {


        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "update",
            actualChargeID: r.id,
            organicUnit: {value: r.id_organic_unit, label: r.Organic_unit.denomination},
            charge: r.id_charge,
            contractType: r.id_contract_type,
            date_start: r.date_start,
            date_end: r.date_end
        })


    };
    deleteContractSweet = (optionDelete) => {
        Swal.fire({
            icon: 'warning',
            title: optionDelete.state ? 'Inhabilitar Contrato' : 'Habilitar Contrato',
            text: optionDelete.state ? 'No podra gestionar datos de este Contrato' : 'Gestionar datos del Contrato',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: optionDelete.state ? 'Si, Inhabilitar' : 'Si, Habilitar',
        }).then((result) => {
            if (result.value) {
                this.destroyCharge(optionDelete.id);
            } else {
                this.props.closeForm();
            }
        })
    };

    render() {
        const {organicUnits, formModal, date_start, date_end, organicUnit, charge, contractType, charges, contractTypes, action, loaderCharge} = this.state;

        return (
            <>


                <Modal show={formModal} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{action === "add" ? "REGISTRAR" : "EDITAR"} CARGO {this.state.typeForm.toUpperCase()}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}} onClick={() => this.closeForm()}/>

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>


                        <Row>
                            {!component.ORGANIC_UNIT && <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                    <Form.Label className="floating-label"
                                                style={organicUnit === "" ? {color: "#ff5252 "} : null}
                                    >Unidada organica <small className="text-danger"> *</small></Form.Label>
                                    <Select
                                        isSearchable
                                        value={organicUnit}
                                        name="organicUnit"
                                        options={organicUnits}
                                        classNamePrefix="select"
                                        // isLoading={coursesLoader}
                                        className="basic-single"
                                        placeholder="Buscar unidad organica"
                                        onChange={this.handleChange("organicUnit")}
                                        styles={component.selectSearchStyle}
                                    />

                                </Form.Group>
                                <br/>
                            </Col>}

                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={charge === "" ? {color: "#ff5252 "} : null}
                                    >Cargo<small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={charge}

                                                  onChange={this.handleChange('charge')}
                                    >
                                        >
                                        <option defaultValue={true} hidden>Cargo</option>
                                        {
                                            charges.length > 0 ?
                                                charges.map((r, k) => {
                                                        if ("DOCENTE" === this.state.typeForm.toUpperCase() || "Docente" === this.state.typeForm) {
                                                            if (r.denomination === this.state.typeForm.toUpperCase() || r.denomination === this.state.typeForm) {
                                                                return (<option value={r.id} key={k}> {r.denomination} </option>)
                                                            } else {
                                                                return null
                                                            }
                                                        } else {
                                                            if (r.denomination !== "Docente" && r.denomination !== "DOCENTE") {
                                                                return (<option value={r.id} key={k}> {r.denomination} </option>)
                                                            } else {
                                                                return null
                                                            }
                                                        }


                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={contractType === "" ? {color: "#ff5252 "} : null}
                                    >Tipo de contrato <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={contractType}
                                                  onChange={this.handleChange('contractType')}
                                    >
                                        >
                                        <option defaultValue={true} hidden>Tipo de contrato</option>
                                        {
                                            contractTypes.length > 0 ?
                                                contractTypes.map((r, k) =>
                                                    <option value={r.id} key={k}> {r.denomination} </option>
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={date_start === "" ? {color: "#ff5252 "} : null}
                                    >Fecha Inicio <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="form-control"
                                        onChange={this.handleChange('date_start')}
                                        max="2999-12-31"
                                        value={date_start}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"

                                    >Fecha Fecha Fin <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="form-control"
                                        onChange={this.handleChange('date_end')}
                                        max="2999-12-31"
                                        value={date_end}
                                    />
                                </Form.Group>
                            </Col>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                {action === 'add' ?
                                    <Button
                                        className="pull-right"
                                        disabled={loaderCharge}
                                        variant="primary"

                                        onClick={() => this.createCharge()}>
                                        {loaderCharge && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderCharge}
                                        variant="primary"

                                        onClick={() => this.updateCharge()}>
                                        {loaderCharge && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
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

export default ChargeForm;
