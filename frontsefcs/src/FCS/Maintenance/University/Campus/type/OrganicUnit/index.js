import React from 'react';
import {Button, Col, Modal, Form, Row, Card} from 'react-bootstrap';
import Nestable from 'react-nestable';
import Tooltip from "@material-ui/core/Tooltip";
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import UcFirst from "../../../../../../App/components/UcFirst";



class OrganicUnit extends React.Component {
    state = {
        example: 1,

        type: '',
        denomination: '',
        abbreviation: '',


        typeOrganitUnits: [],

        defaultCollapsed: false,
        isVaryingOrganitUnit: false,
    };

    componentDidMount() {


        this.getTyperganicUnit();


    }


    //GetDataServer Functions


    saveOrganicUnit = () => {
        const url = app.general + '/' + app.organicUnit;
        const {denomination, type, abbreviation,  parentID} = this.state;
        if (denomination !== '' && type !== '' && abbreviation !== '' ) {
            let data = new FormData();
            data.set('id_campus', this.props.campusID);
            if (parentID !== '') {
                data.set('id_parent', parentID);
            }
            data.set('denomination', denomination);
            data.set('id_type_organic_unit', type);
            data.set('abbreviation', abbreviation);
            axios.post(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.props.getOrganicUnit();
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
    updateOrganicUnit = () => {
        const url = app.general + '/' + app.organicUnit + '/' + this.state.currentID;
        const {denomination, type, district} = this.state;
        if (denomination !== '' && type !== '' && district !== '') {
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('type', type);
            data.set('code', '1234');
            data.set('id_ubigeo', district);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.getOrganicUnit();
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

    deleteOrganicUnit = id => {
        const url = app.general + '/' + app.organicUnit + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getOrganicUnit();
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };
    //GetDataServer Functions type organit unit
    getTyperganicUnit = () => {
        const url = app.general + '/' + app.typeOrganicUnit;

        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({typeOrganitUnits: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    //Operation Functions

    handleOpenModalOrganicUnit = () => {
        this.setState({
            titleModal: 'AGREGAR UNIDAD ORGANICA',
            isVaryingOrganitUnit: true,
            action: 'add',
            denomination: ''
        });
    };
    handleCloseModal = () => {
        this.setState({
            isVaryingOrganitUnit: false,
            action: 'add',
            denomination: '',
            type: '',
            abbreviation: '',

            currentID: '',
        })
    };
    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                let denomination = event.target.value.replace(/[^À-ÿA-Za-z ]/g, '');
                this.setState({denomination: denomination});
                break;
            case 'abbreviation':
                this.setState({abbreviation: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;

            default:
                break;
        }
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
            </div>
        );
    };

    renderExampleOne = () => {
        const {defaultCollapsed} = this.state;

        return (
            <div>
                {this.props.data.length > 0 &&
                < Nestable
                    items={this.props.data}
                    collapsed={defaultCollapsed}
                    renderItem={this.renderItem}
                    ref={el => this.refNestable = el}
                />
                }


                <br/>

            </div>
        );
    };


    render() {
        //props


        //state backend
        const {denomination, type, abbreviation} = this.state;
        const {typeOrganitUnits} = this.state;
        //state frontend
        const {action} = this.state;
        return (
            <Row>
                <Col sm={12} md={12} style={{marginTop: '-42px'}}>

                    <Tooltip title={"Nuevo"}>
                        <Button className='btn-icon btn-rounded' variant=''
                                style={{
                                    float: 'right',
                                    marginRight: '5px',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                                onClick={() => this.handleOpenModalOrganicUnit()}>
                            <i className="material-icons">add</i>
                        </Button>
                    </Tooltip>

                    {this.props.data.length > 0 && this.renderExampleOne()}


                </Col>
                <Modal show={this.state.isVaryingOrganitUnit}
                       onHide={() => this.setState({isVaryingOrganitUnit: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title as="h5">{this.state.titleModal}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Card.Title as="h5"><UcFirst
                                    text=""/> {this.props.descriptionCampus}</Card.Title>
                                <br/>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"> Tipo de Unidad Organica</Form.Label>
                                    <Form.Control as="select"
                                                  value={type}
                                                  onChange={this.handleChange('type')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                        {
                                            typeOrganitUnits.length > 0 ?
                                                typeOrganitUnits && typeOrganitUnits.map((typeOrganitUnit, index) => {
                                                    return (
                                                        <option value={typeOrganitUnit.id} key={index}>
                                                            {typeOrganitUnit.denomination}
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
                                    <Form.Label className="floating-label">Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
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
                                    <Form.Label className="floating-label">Abreviatura</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id="abbreviation"
                                        value={abbreviation}
                                        onChange={this.handleChange('abbreviation')}
                                        placeholder="Ingrese abreviatura"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>


                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger"
                                onClick={() => this.handleCloseModal()}>Cancelar</Button>
                        {action === 'add' ?
                            <Button variant="primary" onClick={() => this.saveOrganicUnit()}>Guardar</Button> :
                            <Button variant="primary" onClick={() => this.updateOrganicUnit()}>Guardar Cambios</Button>
                        }
                    </Modal.Footer>
                </Modal>
            </Row>
        );
    }
}

export default OrganicUnit;