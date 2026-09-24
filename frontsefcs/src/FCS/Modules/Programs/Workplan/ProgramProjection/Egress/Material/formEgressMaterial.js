import React from 'react';
import {Button,  Col, Form,  Modal, OverlayTrigger, Row,  Tooltip} from 'react-bootstrap';
import app from "../../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../../../../../../Component";

import Close from "@material-ui/icons/Close";


import Swal from "sweetalert2";
import Select from "react-select";


moment.locale('es');


class FormEgressMaterial extends React.Component {
    state = {

        action: "add",
        typeMaterial: "",
        material: "",
        amount: "",
        unitMeasure: "",
        observation: "",
        subTotal: 0,
        cant: "",
        concept: "",


        formEgressMaterial: this.props.formEgressMaterial,
        retriveMaterial: this.props.retriveMaterial,
        deleteMaterialID: this.props.deleteMaterialID,


        materials: [],
        unitMeasures: [],

    };

    async componentDidMount() {
        this.listConceptByDescription();
        this.listUnitMeasure();

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formEgressMaterial !== this.props.formEgressMaterial) {
            this.setState({formEgressMaterial: this.props.formEgressMaterial});
        }
        if (prevProps.retriveMaterial !== this.props.retriveMaterial) {
            this.props.retriveMaterial && this.retriveForm(this.props.retriveMaterial)
        }
        if (prevProps.deleteMaterialID !== this.props.deleteMaterialID) {
            this.props.deleteMaterialID !== "" && this.openEntrySweetAlert(this.props.deleteMaterialID)
        }
    }


    async listMaterialByType(typeMaterial) {
        this.setState({loaderData: true});
        const url = app.general + '/' + app.material + '/type/' + typeMaterial;
        try {
            const res = await axios.get(url, app.headers);
            this.setState({materials: []});
            if (res.data) {
                res.data.map((record, index) =>
                    this.state.materials.push({
                        value: record.id,
                        label: record.denomination,
                    }));
            }

            this.setState({loaderData: false})


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listUnitMeasure() {
        this.setState({loaderData: true})
        const url = app.general + '/' + app.unitMeasure;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({unitMeasures: res.data});
            if (this.state.loaderData) {
                this.setState({loaderData: false})
            }

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listConceptByDescription() {
        try {
            const url = app.general + '/' + app.concepts + '/des/' + 'Pago por adquisición de materiales';
            const res = await axios.get(url, app.headers);
            this.setState({concept: res.data.id, conceptMask: res.data.denomination});
        } catch (err) {
            console.log('We have the error', err);
        }
    };

    async createEgressMaterial(workPlanID) {
        this.setState({loaderMaterial: true});
        const {material, amount, observation, cant, concept, unitMeasure} = this.state;


        if (workPlanID !== '' && concept !== '' && material.value !== '' && unitMeasure !== '' && cant !== '' && amount !== '') {
            const url = app.programs + '/' + app.egressMaterial;
            let data = new FormData();
            data.set("id_work_plan", workPlanID);
            data.set("id_concept", concept);
            data.set("id_material", material.value);
            data.set("id_unit_measure", unitMeasure);
            data.set("cant", cant);
            data.set("amount", amount);
            data.set("observation", observation);
            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({material: "", amount: 0, observation: "", cant: "", unitMeasure: "", subTotal: ""});

                this.props.callDataMaterial();
                this.setState({loaderMaterial: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderMaterial: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderMaterial: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateEgressMaterial() {

        this.setState({loaderMaterial: true});
        const {material, amount, observation, cant, unitMeasure} = this.state;


        if (material.value !== '' && unitMeasure !== '' && cant !== '' && amount !== '') {

            const url = app.programs + '/' + app.egressMaterial + '/' + this.state.actualEgressMaterialID;
            let data = new FormData();
            data.set("id_material", material.value);
            data.set("id_unit_measure", unitMeasure);
            data.set("cant", cant);
            data.set("amount", amount);
            data.set("observation", observation);
            try {
                const res = await axios.patch(url, data, app.headers);

                this.props.callDataMaterial();
                this.closeForm();
                this.setState({loaderMaterial: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            } catch (err) {
                this.setState({loaderMaterial: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderMaterial: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    async destroyEntry(id) {

        try {
            this.setState({loaderMaterial: true});
            const url = app.programs + '/' + app.egressMaterial + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderMaterial: false});
            this.props.callDataMaterial();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderMaterial: false});
            return false;
        }
    };

    handleChange = field => event => {
        switch (field) {
            case 'amount':
                let price = parseFloat(event.target.value) !== "NaN" ? parseFloat(event.target.value) : 0;
                let subTotal = this.state.cant * price;
                this.setState({amount: event.target.value, subTotal: Math.round(subTotal * 100) / 100});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            case 'subTotal':
                this.setState({subTotal: event.target.value});
                break;
            case 'cant':
                this.setState({cant: event.target.value});
                break;
            case 'material':
                this.setState({material: {value: event.value, label: event.label}});
                break;
            case 'unitMeasure':
                this.setState({unitMeasure: event.target.value});
                break;
            case 'typeMaterial':
                this.listMaterialByType(event.target.value);
                this.setState({typeMaterial: event.target.value, material: ""});
                break;


        }
    };
    closeForm = () => {

        this.setState({
            formEgressMaterial: false,
            action: "add",
            actualEgressMaterialID: "",
            amount: "",
            typeMaterial: "",
            cant: "",
            subTotal: 0,
            course: "",
            material: "",
            unitMeasure: "",
            observation: "",
            person: "",
            searchA: "",
        });
        this.props.closeFormMaterial();

    };
    retriveForm = (r) => {
        this.setState({
            formEgressMaterial: true,
            action: "update",
            actualEgressMaterialID: r.id,
            subTotal: r.cant * parseFloat(r.amount).toFixed(2),
            observation: r.observation,
            typeMaterial: r.Material.type,
            material: {value: r.id_material, label: r.Material.denomination},
            amount: r.amount,
            unitMeasure: r.id_unit_measure,
            cant: r.cant
        });


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
            alert.isConfirmed ? await this.destroyEntry(id) : this.props.closeFormEgressMaterial();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };


    render() {
        const {workPlanID} = this.props;
        const {material, materials, unitMeasures, unitMeasure, subTotal, amount, conceptMask, typeMaterial, cant, observation} = this.state;
        const {formEgressMaterial, action, loaderMaterial} = this.state;

        return (
            <>


                <Modal show={formEgressMaterial} size={"xl"} backdrop="static">
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
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        style={typeMaterial === "" ? {color: "#ff5252 "} : null}
                                        className="floating-label">Categorias </Form.Label>
                                    <Form.Control as="select"
                                        // style={{fontSize: '16px'}}
                                                  value={typeMaterial}
                                                  onChange={this.handleChange('typeMaterial')}
                                    >

                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        <option value="Accesorios de escritorio y papelería">Accesorios de escritorio y papelería</option>
                                        <option value="Tintas y tóner">Tintas y tóner</option>
                                        <option value="Consumibles de cómputo">Consumibles de cómputo</option>
                                        <option value="Artículos y productos de limpieza">Artículos y productos de limpieza</option>
                                        <option value="Productos de limpieza">Productos de limpieza</option>
                                        <option value="Servicios">Servicios</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                    <Form.Label className="floating-label"
                                                style={material === "" ? {color: "#ff5252 "} : null}
                                    >Materiales <small className="text-danger"> *</small></Form.Label>
                                    <Select
                                        isSearchable
                                        value={material}
                                        name="organicUnit"
                                        options={materials}
                                        classNamePrefix="select"
                                        // isClearable={true}
                                        // isLoading={coursesLoader}
                                        className="basic-single"
                                        placeholder="Buscar materiales"
                                        onChange={this.handleChange("material")}
                                        styles={component.selectSearchStyle}
                                    />
                                </Form.Group>
                                <br/>
                            </Col>

                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label style={unitMeasure === "" ? {color: "#ff5252 "} : null}
                                                className="floating-label">Unidad de medida </Form.Label>
                                    <Form.Control as="select"
                                        // style={{fontSize: '16px'}}

                                                  value={unitMeasure}
                                                  onChange={this.handleChange('unitMeasure')}
                                    >
                                        <option defaultValue={true} hidden>Por favor seleccione
                                            una
                                            cuenta
                                        </option>
                                        {
                                            unitMeasures.length > 0 ?
                                                unitMeasures.map((r, index) => {
                                                    return (
                                                        <option value={r.id} key={r.id}>
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
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        style={cant === "" ? {color: "#ff5252 "} : null}
                                        className="floating-label">Cantidad</Form.Label>
                                    <Form.Control
                                        value={cant}
                                        type="number"
                                        min="1"
                                        onChange={this.handleChange('cant')}
                                        placeholder="Cantidad"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        style={amount === "" ? {color: "#ff5252 "} : null}
                                        className="floating-label">Costo </Form.Label>
                                    <Form.Control
                                        value={amount}
                                        type="number"
                                        min="0"
                                        onChange={this.handleChange('amount')}
                                        placeholder="Total"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">SubTotal </Form.Label>
                                    <Form.Control
                                        value={subTotal}
                                        disabled={true}
                                        onChange={this.handleChange('subTotal')}
                                        placeholder="Total"
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
                                        disabled={loaderMaterial}
                                        variant="primary"

                                        onClick={() => this.createEgressMaterial(workPlanID)}>
                                        {loaderMaterial && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderMaterial}
                                        variant="primary"

                                        onClick={() => this.updateEgressMaterial()}>
                                        {loaderMaterial && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
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

export default FormEgressMaterial;
