import React, {Component} from 'react';
import {Row, Col, Modal, Form, Button} from 'react-bootstrap';
import DataTable from "./DataTable";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import axios from 'axios';
import app from "../../Constants/index.js"
import NavBarMaintenance from "../NavBarMaintenance";
import TitleModule from "../../TitleModule";

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

class ActivityType extends Component {
    constructor(props) {
        super(props);
        this.state = {

            loaderData: true,
            module: "TIPOS DE ACTIVIDADES",
            showModal: false,
            loader: false,
            action: "add",
            titleModel: "",
            actualID: "",
            url: this.props.match.url.replace("/maintenance/", ""),
            // ***************
            denomination: "",
            // ****************
            records: [],
        }
    };

    componentDidMount() {
        this.listActivityType();

    }

    async listActivityType() {
        this.setState({loaderData: true})
        const url = app.general + '/' + app.activityType;
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
        const {denomination} = this.state;


        if (denomination !== '') {
            const url = app.general + '/' + app.activityType;
            let data = new FormData();
            data.set('denomination', denomination);


            try {
                const res = await axios.post(url, data, app.headers);
                this.listActivityType();
                this.closeModal();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    async update() {

        this.setState({loader: true});
        const {denomination} = this.state;

        if (denomination !== '') {

            const url = app.general + '/' + app.activityType + '/' + this.state.actualID;
            let data = new FormData();
            data.set('denomination', denomination);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.listActivityType();
                this.closeModal();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data, delay: 2000});


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
            const url = app.general + '/' + app.activityType + '/' + id;
            const res = await axios.delete(url, app.headers);

            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loader: false});
            this.listActivityType();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') this.state.action === "add" ? this.save() : this.update()
    };

    openModal = () => {
        this.setState({
            action: "add",
            showModal: !this.state.showModal,
            titleModal: "REGISTRAR " + this.state.module,
            denomination: "",
        })
    };
    closeModal = () => {
        this.setState({showModal: !this.state.showModal})
    };
    openEditModal = (r) => {

        this.openModal();
        this.setState({
            action: "update",
            titleModal: "EDITAR " + this.state.module,
            denomination: r.denomination,
            actualID: r.id
        });
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                let denomination = event.target.value.replace(/[^À-ÿA-Za-z ]/g, '');
                this.setState({denomination: denomination});
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

        const {showModal, loader, action, titleModal} = this.state;
        const {denomination} = this.state;
        const {records} = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"TIPOS DE ACTIVIDADES DEL CALENDARIO ACADEMICO"}
                    actualModule={"TIPOS DE ACTIVIDADES"}
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
                <Modal show={showModal}>
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{titleModal}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeModal}> <i className="feather icon-x" style={{fontSize: "20px", color: 'white'}}></i> </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
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

                                onClick={() => this.update()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>

                </Modal>

            </>
        );
    }
}

export default ActivityType;