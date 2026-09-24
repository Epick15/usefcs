import React, {Component} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import app from '../../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import Type from "./type";
import {Row, Col, Card, Modal, Badge, Form, Button, Tab, Nav} from 'react-bootstrap';
import UcFirst from "../../../../App/components/UcFirst";
import Tooltip from "@material-ui/core/Tooltip";
import TitleModule from "../../../TitleModule";

export default class Campus extends Component {
    state = {
        denomination: '',
        type: '',
        department: '',
        province: '',
        district: '',
        action: 'add',
        currentID: '',
        title: '',
        isVaryingCampus: false,
        campusID: '',
        descriptionCampus: '',


        campuss: [],
        countrys: [],
        birthDepartments: [],
        birthProvinces: [],
        birthDistrics: [],
        organitUnits: [],
    };

    componentDidMount() {
        this.getCampus();
        this.getDepartment(2546);
    };


    //GetDataServer Functions
    getCampus = () => {
        const url = app.general + '/' + app.campus;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({campuss: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveCampus() {
        const url = app.general + '/' + app.campus;
        const {denomination, type, district} = this.state;
        if (denomination !== '' && type !== '' && district !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', type);
            data.set('code', '1234');
            data.set('id_district', district);
            axios.post(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getCampus();
                this.handleCloseModal();
            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    updateCampus() {
        const url = app.general + '/' + app.campus + '/' + this.state.currentID;
        const {denomination, type, district} = this.state;
        if (denomination !== '' && type !== '' && district !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', type);
            data.set('code', '1234');
            data.set('id_district', district);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.getCampus();
                this.handleCloseModal();
            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    deleteCampus(id) {
        const url = app.general + '/' + app.campus + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getCampus();
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    // Ubigeo Funcitons

    getDepartment = (id) => {
        const url = app.general + app.UbigeoNacional + '/' + id;
        axios.get(url,app.headers).then(res => {
            if (res.data) {
                this.setState({birthDepartments: res.data});
            }
        }).catch(err => {
            console.log(err)
        });
    };
    getProvince = (id) => {
        const url = app.general + '/' + app.ubigeo + '/' + app.province + '/' + id;
        axios.get(url,app.headers).then(res => {
            if (res.data) {
                this.setState({birthProvinces: res.data});
            }
        }).catch(err => {
            console.log(err)
        });
    };
    getDistrict = (id) => {
        const url = app.general + '/' + app.ubigeo + '/' + app.district + '/' + id;
        axios.get(url,app.headers).then(res => {
            if (res.data) {
                this.setState({birthDistrics: res.data});
            }
        }).catch(err => {
            console.log(err)
        });
    };


    //Operation Functions
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.state.action === 'add' ?
                this.saveCampus() : this.updateCampus()
        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                let denomination = event.target.value.replace(/[^À-ÿA-Za-z ]/g, '');
                this.setState({denomination: denomination});
                break;
            case 'department':
                this.setState({department: event.target.value, province: '', district: ''});
                this.getProvince(event.target.value);
                break;
            case 'province':
                this.setState({province: event.target.value, district: ''});
                this.getDistrict(event.target.value);
                break;
            case 'district':
                this.setState({district: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;

            default:
                break;
        }
    };
    handleOpenModalCampus = () => {
        this.setState({
            titleModal: 'AGREGAR SEDE O FILIAL',
            isVaryingCampus: true,
            action: 'add',
            denomination: ''
        });
    };
    handleCloseModal = () => {
        this.setState({
            isVaryingCampus: false,
            action: 'add',
            denomination: '',
            type: '',
            department: '',
            province: '',
            district: '',
            currentID: '',
        })
    };
    handleClickRetrieveCampus = record => {
        console.log(record)
        this.getDepartment(89);
        this.getProvince(record.District.Province.Department.id);
        this.getDistrict(record.District.Province.id);
        this.setState({
            titleModal: 'MODIFICAR REGISTRO',
            isVaryingCampus: true,
            action: 'update',
            currentID: record.id,
            district: record.District.id,
            province: record.District.Province.id,
            department: record.District.Province.Department.id,
            denomination: record.denomination,
            type: record.type,

        })
    };
    handleOpenSweetAlertWarning = (id) => {
        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.value) {
                this.deleteCampus(id);
            }
        })
    };

    handleOpenTab(campus) {
        this.setState({
            campusID: campus.id,
            descriptionCampus: (campus.type === 'Matrix' ? 'Sede' : 'Filial') + ' - ' + campus.District.description
        });
        this.Type.getOrganicUnit(campus.id);
    };


    render() {
        //state backend
        const {denomination, type, department, province, district, campusID, descriptionCampus} = this.state;
        const {birthDepartments, birthProvinces, birthDistrics, campuss} = this.state;
        //state frontend
        const {action} = this.state;
        return (
            <div>
                <TitleModule
                    actualTitle={"UNIVERSIDAD"}
                    actualModule={"UNIVERSIDAD"}
                    fatherModuleUrl={"/"} fatherModuleTitle={""}
                    fatherModule2Url={""} fatherModule2Title={""}

                />

                <Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Card>
                            <Card.Header>
                                {/*<CustomToolbar handleOpenModalCampus={this.handleOpenModalCampus}/>*/}
                                {/*<Card.Title as='h5'>Campus</Card.Title>*/}

                                <Tooltip title={"Volver"}>
                                    <Button className='btn-icon btn-rounded' variant='primary'
                                            onClick={this.handleOpenModalCampus}>
                                        <i className="material-icons">add</i>
                                    </Button>
                                </Tooltip>
                                &emsp;CAMPUS
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="home">
                                    <Row>
                                        <Col sm={3}>

                                            <Nav variant="pills" className="flex-column">
                                                {
                                                    campuss.length > 0 ?
                                                        campuss && campuss.map((campus, index) => {
                                                            return (
                                                                <Nav.Item key={index}>
                                                                    <Nav.Link
                                                                        onClick={() => this.handleOpenTab(campus)}
                                                                        eventKey={campus.id}
                                                                    >
                                                                        {campus.type === 'Matrix' ?
                                                                            <Badge pill variant="success"
                                                                                   className="mr-1"><UcFirst
                                                                                text=" "/></Badge> :
                                                                            <Badge pill variant="secondary"
                                                                                   className="mr-1"><UcFirst
                                                                                text=" "/></Badge>
                                                                        }
                                                                        {campus.District.description + ' '}
                                                                        <Tooltip title={"Eliminar"}>
                                                                            <i className="material-icons text-dark"
                                                                               onClick={() => this.handleOpenSweetAlertWarning(campus.id)}
                                                                               style={{
                                                                                   float: 'right',
                                                                                   fontSize: '20px',
                                                                                   marginTop: '2px'
                                                                               }}>close</i>
                                                                        </Tooltip>
                                                                        <Tooltip title={"Editar"}>
                                                                            <i className="material-icons text-dark"
                                                                               onClick={() => this.handleClickRetrieveCampus(campus)}
                                                                               style={{
                                                                                   float: 'right',
                                                                                   fontSize: '17px',
                                                                                   marginTop: '2px'
                                                                               }}
                                                                            >edit</i>
                                                                        </Tooltip>
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            )
                                                        }) :
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="nulo"
                                                                      onClick={() => this.handleOpenModalCampus()}>Registre
                                                                Sedes o
                                                                filiales</Nav.Link>
                                                        </Nav.Item>
                                                }


                                            </Nav>
                                        </Col>
                                        <Col sm={9}>
                                            <Tab.Content>
                                                <Tab.Pane eventKey={campusID}>
                                                    <Type campusID={campusID} descriptionCampus={descriptionCampus}
                                                          ref={(ref) => this.Type = ref}
                                                    />
                                                </Tab.Pane>

                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal show={this.state.isVaryingCampus} onHide={() => this.setState({isVaryingCampus: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title as="h5">{this.state.titleModal}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        type="email"
                                        onKeyPress={this.handleKeyPress}
                                        id="denomination"
                                        value={denomination}
                                        onChange={this.handleChange('denomination')}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"> Tipo</Form.Label>
                                    <Form.Control as="select"
                                                  value={type}
                                                  onChange={this.handleChange('type')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        <option value="Matrix">Sede</option>
                                        <option value="Subsidiary">Filial</option>

                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Departamento</Form.Label>
                                    <Form.Control as="select"
                                                  value={department}
                                                  onChange={this.handleChange('department')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            birthDepartments.length > 0 ?
                                                birthDepartments && birthDepartments.map((department, index) => {
                                                    return (
                                                        <option value={department.id} key={index}>
                                                            {department.description}
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
                                    <Form.Label className="floating-label">Provincia</Form.Label>
                                    <Form.Control as="select"
                                                  value={province}
                                                  onChange={this.handleChange('province')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            birthProvinces.length > 0 ?
                                                birthProvinces && birthProvinces.map((province, index) => {
                                                    return (
                                                        <option value={province.id} key={index}>
                                                            {province.description}
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
                                    <Form.Label className="floating-label">Distrito</Form.Label>
                                    <Form.Control as="select"
                                                  value={district}
                                                  onChange={this.handleChange('district')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            birthDistrics.length > 0 ?
                                                birthDistrics && birthDistrics.map((district, index) => {
                                                    return (
                                                        <option value={district.id} key={index}>
                                                            {district.description}
                                                        </option>
                                                    )
                                                }) :
                                                <option defaultValue={true}>Error al cargar los Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger"
                                onClick={() => this.handleCloseModal()}>Cancelar</Button>
                        {action === 'add' ?
                            <Button variant="primary" onClick={() => this.saveCampus()}>Guardar</Button> :
                            <Button variant="primary" onClick={() => this.updateCampus()}>Guardar Cambios</Button>
                        }
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
