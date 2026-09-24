import React from 'react';
import {Button, Card, Col, Form, Modal, Row,} from 'react-bootstrap';
import Nestable from 'react-nestable';
import Tooltip from "@material-ui/core/Tooltip";
import axios from 'axios';
import app from '../../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import TitleModule from "../../../TitleModule";

class Modules extends React.Component {
    state = {
        example: 1,
        defaultCollapsed: false,
        url: '',
        code: '',
        order: '',
        description: '',
        modules: [],
        parentID: '',

    };

    componentDidMount() {
        this.getModules();
    }

    getModules = () => {
        const url = app.security + '/' + app.module;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({modules: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };
    deleteModules = id => {
        const url = app.security + '/' + app.module + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getModules();
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };
    collapse = (collapseCase) => {
        if (this.refNestable || this.refNestableHandler) {
            switch (collapseCase) {
                case 0:
                    this.refNestable.collapse('NONE');
                    this.refNestableHandler.collapse('NONE');
                    break;
                case 1:
                    this.refNestable.collapse('ALL');
                    this.refNestableHandler.collapse('ALL');
                    break;
                case 2:
                    this.refNestable.collapse([1]);
                    this.refNestableHandler.collapse([1]);
                    break;
                default:
                    this.refNestable.collapse('NONE');
                    this.refNestableHandler.collapse('NONE');
                    break;
            }
        }
    };

    renderItem = ({item, collapseIcon, handler}) => {
        return (
            <div className="pc-nestable-item">
                {handler}
                {collapseIcon}
                {item.text}
                {<>
                    <Tooltip title={"Eliminar"}>
                        <i className="material-icons text-dark"
                           onClick={() => this.deleteModules(item.id)}
                           style={{
                               float: 'right',
                               fontSize: '20px',
                               marginTop: '2px'
                           }}>close</i>
                    </Tooltip>
                    <Tooltip title={"Editar"}>
                        <i className="material-icons text-dark"
                           onClick={() => this.editModules(item)}
                           style={{
                               float: 'right',
                               fontSize: '17px',
                               marginTop: '2px'
                           }}
                        >edit</i>
                    </Tooltip>
                    <Tooltip title={"Nuevo"}>
                        <i className="material-icons text-primary"
                           onClick={() => this.handleOpenModalModules(item)}
                           style={{
                               float: 'right',
                               fontSize: '20px',
                               marginTop: '2px'
                           }}>add</i>
                    </Tooltip>
                </>}
            </div>
        );
    };


    saveModules = () => {
        this.setState({disabled: true})
        const urls = app.security + '/' + app.module;
        const {url, code, order, description, parentID} = this.state;
        if (url !== '' && code !== '' && order !== '' && description !== '') {
            let data = new FormData();
            if (parentID !== '') {
                data.set('id_parent', parentID);
            }
            data.set('url', url);
            data.set('code', code);
            data.set('order', order);
            data.set('denomination', description);
            axios.post(urls, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getModules();
                this.handleCloseModal();
            }).catch(() => {
                this.setState({disabled: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({disabled: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };
    updateModules = () => {
        this.setState({disabled: true})
        const urls = app.security + '/' + app.module + '/' + this.state.currentID;
        const {url, code, order, description, parentID} = this.state;
        if (url !== '' && code !== '' && order !== '' && description !== '') {
            let data = new FormData();
            if (parentID !== '') {
                data.set('id_parent', parentID);
            }
            data.set('url', url);
            data.set('code', code);
            data.set('order', order);
            data.set('denomination', description);
            axios.patch(urls, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.getModules();
                this.handleCloseModal();
            }).catch(() => {
                this.setState({disabled: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({disabled: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'url':
                this.setState({url: event.target.value.replace(/[^a-z0-9:.-/]/g, '')});
                break;
            case 'code':
                this.setState({code: event.target.value.replace(/[^0-9/]/g, '')});
                break;
            case 'order':
                this.setState({order: event.target.value.replace(/[^0-9/]/g, '')});
                break;
            case 'description':
                this.setState({description: event.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚÜ /]/g, '')});
                break;
            default:
                break;
        }
    };
    handleOpenModal = () => {
        this.setState({

            isVarying: true,
            action: 'add',
            url: '',
            code: '',
            order: '',
            description: ''
        });
    };
    handleOpenModalModules = (item) => {
        if (item) {
            this.setState({

                isVarying: true,
                action: 'add',
                url: '',
                code: '',
                order: '',
                description: '',
                parentID: item.id
            });
        } else {
            this.setState({

                isVarying: true,
                action: 'add',
                url: '',
                code: '',
                order: '',
                description: '',

            });
        }

    };
    handleCloseModal = () => {
        this.setState({
            isVarying: false,
            action: 'add',
            url: '',
            code: '',
            order: '',
            description: '',
            currentID: '',
            disabled: false,
            parentID: ''

        })
    };
    editModules = record => {
        this.setState({
            isVarying: true,
            action: 'update',
            currentID: record.id,
            url: record.url,
            code: record.code,
            order: record.order,
            description: record.text,

        })
    };

    render() {
        const {isVarying, url, code, order, description, disabled, action, modules, defaultCollapsed} = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"MODULOS"}
                    actualModule={"MODULOS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <Card>
                            <Card.Header>
                                <Tooltip title={"Volver"}>
                                    <Button className='btn-icon btn-rounded' variant='primary'
                                            onClick={() => this.handleOpenModal()}>
                                        <i className="material-icons">add</i>
                                    </Button>
                                </Tooltip>
                                &emsp;MODULO
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={3} className="pb-4">
                                    </Col>
                                    <Col sm={6} md={6}>
                                        {modules.length > 0 &&
                                        < Nestable
                                            items={modules}
                                            collapsed={defaultCollapsed}
                                            renderItem={this.renderItem}
                                            confirmChange={false}
                                            ref={el => this.refNestable = el}
                                        />
                                        }
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal show={isVarying} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title as="h5">Modulo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Url</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={url}
                                        onChange={this.handleChange('url')}
                                        placeholder="Ingrese url"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Codigo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={code}
                                        onChange={this.handleChange('code')}
                                        placeholder="Ingrese codigo"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Orden</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={order}
                                        onChange={this.handleChange('order')}
                                        placeholder="Ingrese orden"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={description}
                                        onChange={this.handleChange('description')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.setState({isVarying: false})}>Cancelar</Button>
                        {action === 'add' ?
                            <Button
                                disabled={disabled}
                                variant="primary"
                                onClick={() => this.saveModules()}>
                                {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                disabled={disabled}
                                variant="primary"
                                onClick={() => this.updateModules()}>
                                {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }

                    </Modal.Footer>
                </Modal>

            </>
        );
    }
}

export default Modules;
