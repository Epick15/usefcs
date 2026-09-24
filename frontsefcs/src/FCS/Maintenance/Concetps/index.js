import React, {Component} from 'react';
import {Row, Col, Modal, Form, Button} from 'react-bootstrap';
import DataTable from "./DataTable";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import axios from 'axios';
import app from "../../Constants/index.js"
import component from "../../Component"
import TitleModule from "../../TitleModule";
import NavBarMaintenance from "../NavBarMaintenance";


class Concepts extends Component {
    constructor(props) {
        super(props);
        this.state = {

            loaderData: true,
            module: "CONCEPTOS",
            showModal: false,
            loader: false,
            action: "add",
            titleModel: "",
            generate: false,
            actualID: "",
            url: this.props.match.url.replace("/maintenance/", ""),
            // ***************
            denomination: "",
            type: "",
            percent: "",
            order: "",
            categoryConcept: "",
            amountUit: "",
            yearUit: "",

            // ****************
            records: [],
            categoryConcepts: [],
        }
    };

    async componentDidMount() {
        this.listConcepts();
        this.listCategoryConcept();
        this.listActualUit();

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

    async listCategoryConcept() {
        this.setState({loaderData: true});
        const url = app.general + '/' + app.categoryConcept;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({categoryConcepts: res.data});
            if (this.state.loaderData) {
                this.setState({loaderData: false})
            }

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listConcepts() {
        this.setState({loaderData: true})
        const url = app.general + '/' + app.concepts;
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

    async save() {
        this.setState({loader: true});
        const {denomination, type, order, categoryConcept, percent, generate} = this.state;


        if (denomination !== "" && type !== "" && order !== "" && categoryConcept !== "" && percent !== "") {
            const url = app.general + '/' + app.concepts;
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', type);
            data.set('order', order);
            data.set('generate', generate);
            data.set('percent', percent);
            data.set('id_category_concept', categoryConcept);


            try {
                const res = await axios.post(url, data, app.headers);
                this.listConcepts();
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


    async updateConcept() {

        this.setState({loader: true});
        const {denomination, type, order, categoryConcept, percent, generate} = this.state;

        if (denomination !== "" && type !== "" && order !== "" && categoryConcept !== "" && percent !== "") {
            const url = app.general + '/' + app.concepts + '/' + this.state.actualID;
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', type);
            data.set('order', order);
            data.set('generate', generate);
            data.set('percent', percent);
            data.set('id_category_concept', categoryConcept);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.listConcepts();
                this.closeModal();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                console.log(err)
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response.message, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };


    async delete(id) {
        try {
            const url = app.general + '/' + app.concepts + '/' + id;
            const res = await axios.delete(url, app.headers);

            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loader: false});
            this.listConcepts();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') this.state.action === "add" ? this.save() : this.updateConcept()
    };

    openModal = () => {
        this.setState({
            action: "add",
            showModal: !this.state.showModal,
            titleModal: "REGISTRAR " + this.state.module,
            denomination: "",
            type: "",
            percent: "",
            order: "",
            categoryConcept: "",
        })
    };
    closeModal = () => {
        this.setState({showModal: !this.state.showModal})
    };
    openEditModal = (r) => {
        this.openModal();
        this.setState({
            action: "updateConcept",
            titleModal: "EDITAR " + this.state.module,
            denomination: r.denomination,
            type: r.type,
            order: r.order,
            generate: r.generate,
            percent: r.percent || "",
            categoryConcept: r.id_category_concept,
            actualID: r.id
        });
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':

                this.setState({denomination: event.target.value});
                break;
            case 'order':
                this.setState({order: event.target.value});
                break;
            case 'generate':

                this.setState({generate: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;
            case 'categoryConcept':
                this.setState({categoryConcept: event.target.value});
                break;
            case 'percent':
                this.setState({percent: event.target.value});
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
    toggleHandler = () => {
        this.setState(prevState => {
            return {generate: !prevState.generate}
        })
    };

    render() {

        const {showModal, loader, action, titleModal} = this.state;
        const {denomination, order, type, categoryConcept, percent, generate} = this.state;
        const {records, categoryConcepts} = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"CONCEPTOS"}
                    actualModule={"CONCEPTOS"}
                    fatherModuleUrl={"/master"} fatherModuleTitle={"MAESTRAS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <Row>
                    <NavBarMaintenance url={this.state.url}
                    />
                    <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderData && component.spiner}
                            <DataTable amountUit={this.state.amountUit} yearUit={this.state.yearUit} records={records}
                                       module={this.state.module} openSweetAlert={this.openSweetAlert}
                                       openModal={this.openModal}
                                       openEditModal={this.openEditModal}/>
                        </div>
                    </Col>
                </Row>
                <Modal show={showModal}>
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{titleModal}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeModal}> <i className="feather icon-x" style={{
                                fontSize: "20px",
                                color: 'white'
                            }}></i> </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Numero de orden</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={order}
                                        name={"order"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('order')}
                                        placeholder="Numero de orden"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Categoria</Form.Label>
                                    <Form.Control as="select"
                                                  value={categoryConcept}
                                                  onChange={this.handleChange('categoryConcept')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            categoryConcepts.length > 0 ?
                                                categoryConcepts.map((r, index) => {
                                                    return (
                                                        <option value={r.id} key={index}>
                                                            {r.description}
                                                        </option>
                                                    )
                                                }) :
                                                <option defaultValue={true}>Error al cargar los Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Tipo</Form.Label>
                                    <Form.Control as="select"
                                                  value={type}
                                                  onChange={this.handleChange('type')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione</option>
                                        <option value={"Ingreso"}>Ingreso</option>
                                        <option value={"Egreso"}>Egreso</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Porcentaje</Form.Label>
                                    <Form.Control
                                        type="text"

                                        value={percent}
                                        name={"percent"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('percent')}
                                        placeholder="Porcentaje"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        type="text"

                                        value={denomination}
                                        name={"denomination"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('denomination')}
                                        placeholder="Descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Tiene correlativo</Form.Label>
                                    <Form.Control as="select"
                                                  value={generate}
                                                  onChange={this.handleChange('generate')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione</option>
                                        <option value={true}>Si</option>
                                        <option value={false}>No</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                        </Row>
                        {action === 'add' ?
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.save()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.updateConcept()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>

                </Modal>

            </>
        );
    }
}

export default Concepts;