import React, {Component} from 'react';
import {Row, Col, Modal, Form, Button} from 'react-bootstrap';
import DataTable from "./DataTable";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import axios from 'axios';
import app from "../../Constants/index.js"
import TitleModule from "../../TitleModule";
import NavBarMaintenance from "../NavBarMaintenance";

const loadingComponent = (
    <div style={{
        position: 'absolute',
        zIndex: 110,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.8)'
    }}>
        <span className="spinner-border spinner-border-sm mr-1" role="status"/>
    </div>
);

class Material extends Component {
    constructor(props) {
        super(props);
        this.state = {

            loaderData: true,
            module: "REQUISITOS DE INSCRIPCIÓN",
            showModal: false,
            loader: false,
            action: "add",
            titleModel: "",
            actualID: "",
            url: this.props.match.url.replace("/maintenance/", ""),
            // ***************
            description: "",
            modality: "",
            concept: "",
            academicDegree: "",
            // ****************
            records: [],
            concepts: [],
            academicDegrees: [],
        }
    };

    async componentDidMount() {
        this.listRequeriment();
        this.listConceptsRequeriment();
        this.getAcademicDegree();

    }

    async listConceptsRequeriment() {
        this.setState({loaderData: true});
        const url = app.general + '/' + app.concepts + '/' + app.requeriment;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({concepts: res.data});
            if (this.state.loaderData) {
                this.setState({loaderData: false})
            }

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async getAcademicDegree() {
        this.setState({loaderAcademicDegree: true});
        const url = app.general + '/' + app.academicDegree;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({academicDegrees: res.data});

            this.setState({loaderAcademicDegree: false})


        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Grados Academicos", delay: 2000});
            console.log(err)

        }

    };

    async listRequeriment() {
        this.setState({loaderData: true});
        const url = app.general + '/' + app.requeriment;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({records: res.data});
            if (this.state.loaderData) {
                this.setState({loaderData: false})
            }

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async createRequeriment() {
        this.setState({loader: true});
        const {description, typeEntry, concept, academicDegree} = this.state;
        if (description !== '' && typeEntry !== '' && concept !== '' && academicDegree !== '') {
            const url = app.general + '/' + app.requeriment;
            let data = new FormData();
            data.set('description', description);
            data.set('type_entry', typeEntry);
            data.set('id_concept', concept);
            data.set('id_academic_degree', academicDegree);

            try {
                const res = await axios.post(url, data, app.headers);
                this.listRequeriment();
                this.closeModal();
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


    async updateRequeriment() {

        this.setState({loader: true});
        const {description, typeEntry, concept, academicDegree} = this.state;

        if (description !== '' && typeEntry !== '' && concept !== '' && academicDegree !== '') {

            const url = app.general + '/' + app.requeriment + '/' + this.state.actualID;
            let data = new FormData();
            data.set('description', description);
            data.set('type_entry', typeEntry);
            data.set('id_concept', concept);
            data.set('id_academic_degree', academicDegree);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.listRequeriment();
                this.closeModal();
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


    async delete(id) {
        try {
            const url = app.general + '/' + app.requeriment + '/' + id;
            const res = await axios.delete(url, app.headers);

            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loader: false});
            this.listRequeriment();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') this.state.action === "add" ? this.createRequeriment() : this.updateRequeriment()
    };

    openModal = () => {
        this.setState({
            action: "add",
            showModal: !this.state.showModal,
            titleModal: "REGISTRAR " + this.state.module,
            description: "",
            typeEntry: "",
        })
    };
    closeModal = () => {
        this.setState({showModal: !this.state.showModal})
    };
    openEditModal = (r) => {

        this.openModal();
        this.setState({
            action: "updateRequeriment",
            titleModal: "EDITAR " + this.state.module,
            description: r.description,
            typeEntry: r.type_entry,
            concept: r.id_concept,
            academicDegree: r.id_academic_degree,
            actualID: r.id
        });
    };
    handleChange = field => event => {
        switch (field) {
            case 'description':
                let description = event.target.value.toUpperCase();
                this.setState({description: description});
                break;
            case 'typeEntry':
                this.setState({typeEntry: event.target.value});
                break;
            case 'concept':
                this.setState({concept: event.target.value});
                break;
            case 'academicDegree':
                this.setState({academicDegree: event.target.value});
                break;
            default:
                break;
        }
    };
    openSweetAlert = (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            showLoaderOnConfirm: true,
            preConfirm: async (state) => {
                if (!state) {
                    throw new Error("Ok")
                }
                const deleteRecord = await this.delete(id);
                return deleteRecord
            },


        })
    };

    render() {

        const {showModal, loader, action, titleModal, typeEntry, concepts, concept, academicDegrees, academicDegree} = this.state;
        const {description} = this.state;
        const {records} = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"REQUISITOS DE INSCRIPCIÓN"}
                    actualModule={"REQUISITOS DE INSCRIPCIÓN"}
                    fatherModuleUrl={"/master"} fatherModuleTitle={"MAESTRAS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <Row>
                    <NavBarMaintenance url={this.state.url}
                    />
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderData && loadingComponent}
                            <DataTable records={records} module={this.state.module} openSweetAlert={this.openSweetAlert} openModal={this.openModal}
                                       openEditModal={this.openEditModal}/>
                        </div>
                    </Col>
                </Row>

                <Modal show={showModal} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{titleModal}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeModal}> <i className="feather icon-x" style={{fontSize: "20px", color: 'white'}}></i> </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Modalidad de Ingreso</Form.Label>
                                    <Form.Control as="select"
                                                  value={typeEntry}
                                                  onChange={this.handleChange('typeEntry')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        <option value="Postulantes ordinarios">Postulantes ordinarios</option>
                                        <option value="Postulantes por traslado Interno">Postulantes por traslado Interno</option>
                                        <option value="Postulantes por traslado Externo Nacional (particulares o nacionales)">Postulantes por traslado Externo Nacional
                                            (particulares o nacionales)
                                        </option>
                                        <option value="Postulantes por  traslado Externo Internacional">Postulantes por traslado Externo Internacional</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={concept === "" ? {color: "#ff5252 "} : null}
                                    >Concepto <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={concept}

                                                  onChange={this.handleChange('concept')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            concepts.length > 0 ?
                                                concepts.map((r, index) => {

                                                    return (
                                                        <option value={r.id}
                                                                key={index}>
                                                            {r.denomination}
                                                        </option>
                                                    )

                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={academicDegree === "" ? {color: "#ff5252 "} : null}
                                    >Grado Academico <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={academicDegree}

                                                  onChange={this.handleChange('academicDegree')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            academicDegrees.length > 0 ?
                                                academicDegrees.map((r, index) => {

                                                    return (
                                                        <option value={r.id}
                                                                key={index}>
                                                            {r.denomination + " - " + r.abbreviation}
                                                        </option>
                                                    )

                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Descripción</Form.Label>

                                    <Form.Control
                                        as="textarea" rows="3"
                                        value={description}
                                        name={"description"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('description')}
                                        placeholder="Descripción"
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

                                onClick={() => this.createRequeriment()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.updateRequeriment()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>

                </Modal>

            </>
        );
    }
}

export default Material;