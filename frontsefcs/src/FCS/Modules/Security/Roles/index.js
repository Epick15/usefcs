import React from 'react';
import {Row, Col, Card, Modal, Form, Button, InputGroup, Alert, Dropdown,} from 'react-bootstrap';
import Nestable from 'react-nestable';
import Tooltip from "@material-ui/core/Tooltip";
import axios from 'axios';
import app from '../../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import DataTableModal from "./Components/DataTableModal";
import TitleModule from "../../../TitleModule";


class Roles extends React.Component {
    state = {
        example: 1,
        defaultCollapsed: false,
        loaderPrivilege: false,
        url: '',
        code: '',
        role: '',
        denomination: '',
        order: '',
        description: '',
        roles: [],
        modules: [],
        parentID: '',

    };

    componentDidMount() {
        this.getRole();

    }

    getModules = (id) => {
        this.setState({modules: []});
        const url = app.security + '/' + app.module + '/' + app.role + '/' + id;
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

    collapse = (collapseCase) => {
        this.getModules(this.state.role)
        if (this.refNestable) {
            switch (collapseCase) {
                case 0:
                    this.refNestable.collapse('NONE');

                    break;
                case 1:
                    this.refNestable.collapse('ALL');

                    break;
                case 2:
                    this.refNestable.collapse([1]);

                    break;
                default:
                    this.refNestable.collapse('NONE');

                    break;
            }
        }
    };

    renderItem = ({item, collapseIcon, handler}) => {


        return (
            <>
                <div className="pc-nestable-item">
                    {handler}
                    {collapseIcon}
                    {item.text}
                </div>
                {item.id_parent === null ? '' :
                    <Row style={{paddingLeft: '35px'}}>
                        {this.renderPrivilege(item.Privilege, item.id)}
                    </Row>
                }
            </>
        );
    };
    renderPrivilege = (item, moduleID) => {

        for (let i = 0; i < 4; i++) {


            if (item[i]) {
                switch (item[i].permit) {
                    case '0':
                        item[0] = item[i];
                        break;
                    case '1':
                        item[1] = item[i];
                        break;
                    case '2':
                        item[2] = item[i];
                        break;
                    case '3':
                        item[3] = item[i];
                        break;
                    default:
                        break;
                }
            } else {
                item[i] = []
            }
        }

        return (

            <>


                <div className="to-do-list mr-2 mt-2 pb-0 mb-0">
                    <div className="d-inline-block">

                        <label
                            className="check-task custom-control custom-checkbox d-flex justify-content-center">
                            {item[0] &&
                            item[0].permit === '0' ?
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '0')}
                                           defaultChecked={item[0].state}/>
                                    < span className="custom-control-label"> Crear</span>
                                </>
                                :
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '0')}
                                           defaultChecked={false}/>
                                    < span className="custom-control-label"> Crear</span>
                                </>
                            }
                        </label>

                    </div>
                </div>
                <div className="to-do-list mr-2 mt-2 pb-0 mb-0">
                    <div className="d-inline-block">
                        <label
                            className="check-task custom-control custom-checkbox d-flex justify-content-center">
                            {item[1] &&
                            item[1].permit === '1' ?
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '1')}
                                           defaultChecked={item[1].state}/>
                                    < span className="custom-control-label"> Leer</span>
                                </>
                                :
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '1')}
                                           defaultChecked={false}/>
                                    < span className="custom-control-label"> Leer</span>
                                </>
                            }
                        </label>
                    </div>
                </div>
                <div className="to-do-list mr-2 mt-2 pb-0 mb-0">
                    <div className="d-inline-block">
                        <label
                            className="check-task custom-control custom-checkbox d-flex justify-content-center">
                            {item[2] &&
                            item[2].permit === '2' ?
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '2')}
                                           defaultChecked={item[2].state}/>
                                    < span className="custom-control-label"> Actualizar</span>
                                </>
                                :
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '2')}
                                           defaultChecked={false}/>
                                    < span className="custom-control-label"> Actualizar</span>
                                </>
                            }
                        </label>
                    </div>
                </div>
                <div className="to-do-list mr-2 mt-2 pb-0 mb-0">
                    <div className="d-inline-block">
                        <label
                            className="check-task custom-control custom-checkbox d-flex justify-content-center">
                            {item[3] &&
                            item[3].permit === '3' ?
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '3')}
                                           defaultChecked={item[3].state}/>
                                    < span className="custom-control-label"> Borrar</span>
                                </>
                                :
                                <>
                                    <input type="checkbox" className="custom-control-input"
                                           id="customCheck2"
                                           onClick={() => this.savePrivilege(this.state.role, moduleID, '3')}
                                           defaultChecked={false}/>
                                    < span className="custom-control-label"> Borrar</span>
                                </>
                            }
                        </label>
                    </div>
                </div>


            </>

        )


    };

    getRole = () => {
        const url = app.security + '/' + app.role;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({roles: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };
    saveRole = () => {
        this.setState({disabled: true});
        const url = app.security + '/' + app.role;
        const {denomination} = this.state;
        if (denomination !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', 'Administrativo');
            axios.post(url, data, app.headers).then((res) => {
                this.setState({
                    disabled: false, action: 'add',
                    denomination: '',
                    currentID: ''
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getRole();

            }).catch((res) => {
                const message = res.response ? res.response.data.message : 'Algo salio mal';
                this.setState({disabled: false});
                PNotify.notice({
                    title: "Oh no!",
                    text: message,
                    delay: 4000
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
    updateRole = (id) => {
        this.setState({disabled: true});
        const url = app.security + '/' + app.role + '/' + id;
        const {denomination} = this.state;
        if (denomination !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            axios.patch(url, data, app.headers).then((res) => {
                this.setState({
                    disabled: false, action: 'add',
                    denomination: '',
                    currentID: ''
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.setState({
                    isVarying: true
                })
                this.getRole();
            }).catch((res) => {
                this.setState({
                    disabled: false, action: 'add',
                    denomination: '',
                    currentID: ''
                })
                PNotify.notice({
                    title: "Oh no!",
                    text: 'Algo salio mal',
                    delay: 4000
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
    deleteRole = id => {

        const url = app.security + '/' + app.role + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getRole();
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };


    handleChange = field => event => {
        switch (field) {
            case 'role':
                this.getModules(event.target.value);
                this.setState({role: event.target.value});
                break;
            case 'denomination':

                this.setState({denomination: event.target.value});
                break;

            default:
                break;
        }
    };
    handleOpenModal = () => {
        this.setState({

            isVarying: true,
            action: 'add',
            denomination: ''
        });
    };

    handleCloseModal = () => {
        this.setState({
            isVarying: false,
            action: 'add',
            denomination: '',
            currentID: '',


        })
    };
    handleRetrieveRole = record => {


        this.setState({
            isVarying: true,
            action: 'update',
            userID: record.id,
            denomination: record.denomination,
            titleModal: 'Editar Role'
        })
    };
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.state.action === 'add' ?
                this.saveRole() : this.updateRole(this.state.userID)
        }

    };

    ListItem(item, id) {
        var children = null;
        if (item.values && item.values.length) {
            children = (
                <ul key={id}>
                    {item.values.map(i => (
                        this.ListItem(i, i.id)
                    ))}
                </ul>
            );
        }

        return (
            <li key={id}>
                {item.name}
                {children}

            </li>
        );
    }

    savePrivilege = (roleID, moduleID, permit) => {

        this.setState({loaderPrivilege: true});
        const url = app.security + '/' + app.privilege;

        if (roleID !== '' && moduleID !== '' && permit !== '') {
            let data = new FormData();
            data.set('id_role', roleID);
            data.set('id_module', moduleID);
            data.set('permit', permit);
            axios.post(url, data, app.headers).then((res) => {
                this.setState({loaderPrivilege: false});
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });


            }).catch((res) => {
                const message = res.response ? res.response.data.message : 'Algo salio mal';
                this.setState({loaderPrivilege: false});
                PNotify.notice({
                    title: "Oh no!",
                    text: message,
                    delay: 4000
                });
            });
        } else {
            this.setState({loaderPrivilege: false});
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };
    updatePrivilege = (id) => {

        const url = app.security + '/' + app.privilege + '/' + id;
        axios.delete(url, app.headers).then(res => {


            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });

        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    render() {
        const {isVarying, denomination, action, modules} = this.state;
        const {roles} = this.state;
        const {role} = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"ROLES"}
                    actualModule={"ROLES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Tooltip title={"Volver"}>
                                            <Button className='btn-icon btn-rounded' variant='primary'
                                                    onClick={() => this.handleOpenModal()}>
                                                <i className="material-icons">add</i>
                                            </Button>
                                        </Tooltip>
                                        <h5>&emsp;Roles</h5>
                                    </Col>

                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={3}>

                                        <Form.Group className="form-group fill">
                                            <Form.Control as="select"
                                                          value={role}
                                                          onChange={this.handleChange('role')}>
                                                >
                                                <option defaultValue={true} hidden>Por favor seleccione un Rol</option>
                                                {
                                                    roles.length > 0 ?
                                                        roles && roles.map((role, index) => {
                                                            // if (role.state) {
                                                            return (
                                                                <option value={role.id} key={index}>
                                                                    {role.denomination}
                                                                </option>
                                                            )
                                                            // }

                                                        }) :
                                                        <option defaultValue={true}>Error al cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} className="pt-2">
                                        <h5>Privilegios</h5>


                                        {modules.length > 0 && role !== '' ?

                                            < Nestable
                                                items={modules}
                                                collapsed={false}

                                                renderItem={this.renderItem}

                                            />
                                            :
                                            <>
                                                <hr/>
                                                <Alert variant="info">

                                                    Antes debe seleccionar un Rol
                                                </Alert>
                                            </>
                                        }

                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal show={isVarying}>
                    <Modal.Header style={{background: '#4680ff'}}>
                        <Modal.Title as="h5" style={{color: 'white'}}>Roles</Modal.Title>
                        <div className="d-inline-block pull-right">

                            <Dropdown alignRight={true} className="pull-right mr-n3 mt-n1">
                                <Dropdown.Toggle className="btn-icon" style={{
                                    border: 'none',
                                    background: 'none',
                                    outline: 'none',
                                    color: '#ffffff00',
                                    height: '5px'

                                }}>
                                    <i
                                        onClick={() => this.handleCloseModal()}
                                        className="material-icons pull-right mr-n2 mt-n1"
                                        style={{color: 'white'}}>close</i>
                                </Dropdown.Toggle>

                            </Dropdown>


                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <InputGroup className=" mb-3 form-group fill" size=" sm">
                                    <Form.Label className=" floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        style={{marginTop: '10px'}}
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id=" role"
                                        value={denomination}
                                        onChange={this.handleChange('denomination')}
                                        placeholder="Descripcíon"
                                        margin=" normal"
                                    />
                                    <Tooltip title={"Guardar"}>
                                        <button style={{
                                            marginLeft: '-25px', marginTop: '10px',
                                            position: 'relative',
                                            zIndex: 100,
                                            padding: '0',
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            color: '#4680ff'

                                        }}>
                                            {
                                                action === 'add' ?
                                                    <i className="material-icons text-primary"
                                                       onClick={() => this.saveRole()}
                                                       style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                    </i>
                                                    :
                                                    <i className="material-icons text-primary"
                                                       onClick={() => this.updateRole(this.state.userID)}
                                                       style={{fontSize: '20px', paddingRight: '5px'}}>send
                                                    </i>
                                            }

                                        </button>
                                    </Tooltip>
                                </InputGroup>
                            </Col>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <DataTableModal records={roles} deleteRole={this.deleteRole}
                                                handleRetrieveRole={this.handleRetrieveRole}
                                />
                            </Col>


                        </Row>
                    </Modal.Body>

                </Modal>

            </>
        );
    }
}

export default Roles;
