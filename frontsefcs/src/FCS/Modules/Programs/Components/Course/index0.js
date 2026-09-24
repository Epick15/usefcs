import React, {Component, Fragment} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import app from "../../../../Constants";

import PNotify from "pnotify/dist/es/PNotify";
import {Button, Card, Col, Dropdown, Form, InputGroup, Modal, OverlayTrigger, Row, Tab, Tabs, Tooltip} from "react-bootstrap";
import DataTable from "../DataTable";

const customStyles = {
    control: (base, state) => ({
        ...base,
        border: '0 !important',
        borderRadius: '0 !important',
        borderBottom: '1px solid #ced4da !important',
        '&::placeholder': {
            marginLeft: '-7px !important',
        },
        // This line disable the blue border
        boxShadow: '0 !important',
        '&:hover': {
            border: '0 !important',
            borderBottomColor: 'transparent !important',
            backgroundSize: '100% 100%, 100% 100% !important',
            transitionDuration: ' 0.3s !important',
            boxShadow: 'none !important',
            backgroundImage: 'linear-gradient(to top, #4680ff 2px, rgba(70, 128, 255, 0) 2px), linear-gradient(to top, #ced4da 1px, rgba(206, 212, 218, 0) 1px) !important'
        }
    })
}
let dfValue;
export default class Coursess extends Component {
    state = {
        courseModal: false,
        action: 'add',
        // semesterCourses: []
        semesterID: '',
        mentionID: '',
        semesterMask: '',
        code: '',
        denomination: '',
        abbreviation: '',
        credits: '',
        theoryHours: '',
        practiceHours: '',
        area: '',
        order: '',
        requirements: '',
        disabled: false,

        requiredCourses: [],


        courses: [],
        prerequisites: [],
        courseID: '',

        loadingGetcourses: true,
        required: '',
        disableTab: true,
        changed: false,

    };

    // obtiene los cursos requeridos menores a este semestre
    getCourseRequiredss(id, semesterMask) {
        const url = app.programs + '/' + app.course + '/semester-required' + '/' + semesterMask + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({requiredCourses: res.data, loadingGetcourses: false})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener prerequisitos",
                delay: 2000
            });
            console.log(err);
        })
    };

    saveCourse() {

        const url = app.programs + '/' + app.course;


        const {mentionID, typeCourse, semesterID, code, denomination, abbreviation, credits, theoryHours, practiceHours, area, order, programID, required} = this.state;

        if (code !== '' && denomination !== '' && abbreviation !== '' && credits !== '' && theoryHours !== '' && practiceHours !== '' && area !== '' && order !== '' && programID !== '' && semesterID !== '') {
            let data = new FormData();

            data.set('id_semester_mention', semesterID);
            data.set('code', code);
            data.set('denomination', denomination);
            data.set('abbreviation', abbreviation);
            data.set('area', area);
            data.set('order', order);
            data.set('credits', credits);
            data.set('practical_hours', practiceHours);
            data.set('hours', theoryHours);
            data.set('type', typeCourse);
            if (required !== '') {
                data.set('requirements', JSON.stringify(required));
            }

            axios.post(url, data, app.headers).then(() => {
                this.setState({disabled: true})
                this.props.getMentionSemesterCourse(mentionID);
                this.closeModalCourse();
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro almacenado correctamente",
                    delay: 2000
                });
            }).catch(err => {
                this.setState({disabled: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err);
            })
        } else {
            this.setState({disabled: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    updateCourse() {
        this.setState({disabled: true})
        const url = app.programs + '/' + app.course + '/' + this.state.courseID;
        const {mentionID, typeCourse, code, denomination, abbreviation, credits, theoryHours, practiceHours, area, order, required, programID} = this.state;
        if (code !== '' && denomination !== '' && abbreviation !== '' && credits !== '' && theoryHours !== '' && practiceHours !== '' && area !== '' && order !== '' && programID !== '') {
            let data = new FormData();
            data.set('code', code);
            data.set('denomination', denomination);
            data.set('abbreviation', abbreviation);
            data.set('area', area);
            data.set('credits', credits);
            data.set('practical_hours', practiceHours);
            data.set('hours', theoryHours);
            data.set('type', typeCourse);
            data.set('order', order);
            data.set('requirements', JSON.stringify(required));
            axios.patch(url, data, app.headers).then(() => {
                this.props.getMentionSemesterCourse(mentionID);
                this.closeModalCourse();
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
            }).catch(err => {
                this.setState({disabled: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err);
            })
        } else {
            this.setState({disabled: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    openModalCourse = (mentionID, semesterMask, semesterID, programID) => {
        this.getCourseRequiredss(mentionID, semesterMask);
        this.setState({
            titleModalCourse: 'CURSO-' + semesterMask.toUpperCase(),
            mentionID: mentionID,
            semesterID: semesterID,
            semesterMask: semesterMask,
            programID: programID,
            courseModal: true
        })
    };
    retriveModalCourse = (mentionID, semesterMask, data) => {
        this.getCourseRequiredss(mentionID, semesterMask)
        if (data.requirements) {
            dfValue = JSON.parse(data.requirements);
        }
        console.log(data);
        this.setState({
            titleModalCourse: 'CURSO-' + semesterMask.toUpperCase(),
            courseID: data.id,
            semesterMask: semesterMask,
            code: data.code || '',
            typeCourse: data.type || '',
            denomination: data.denomination || '',
            abbreviation: data.abbreviation || '',
            credits: data.credits || '',
            theoryHours: data.hours || '',
            practiceHours: data.practical_hours || '',
            prerequisites: data.requiremets,
            requiredCourses: data.requiremets,
            area: data.area || '',
            order: data.order || '',
            action: 'update',
            courseModal: true
        })
    };
    closeModalCourse = () => {
        dfValue = '';
        this.setState({
            code: '',
            denomination: '',
            abbreviation: '',

            credits: '',
            theoryHours: '',
            practiceHours: '',
            prerequisites: '',
            requiredCourses: [],
            area: '',
            order: '',
            action: 'add',
            disabled: false,
            courseModal: false
        })
    };
    handleChange = field => event => {
        switch (field) {
            case 'typeCourse':
                this.setState({typeCourse: event.target.value});
                break;
            case 'code':
                this.setState({code: event.target.value.replace(/[^a-zA-Z0-9/]/g, '').slice(0, 15).toUpperCase()});
                break;
            case 'denomination':
                this.setState({denomination: event.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚÜ /]/g, '')});
                break;
            case 'abbreviation':
                this.setState({abbreviation: event.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚÜ /]/g, '')});
                break;
            case 'credits':
                this.setState({credits: event.target.value.replace(/[^0-9/]/g, '')});
                break;
            case 'theoryHours':
                this.setState({theoryHours: event.target.value.replace(/[^0-9/]/g, '')});
                break;
            case 'practiceHours':
                this.setState({practiceHours: event.target.value.replace(/[^0-9/]/g, '')});
                break;
            case 'area':
                this.setState({area: event.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚÜ /]/g, '')});
                break;
            case 'order':
                this.setState({order: event.target.value.replace(/[^0-9/]/g, '')});
                break;
            case 'required':
                if (event) {
                    if (event) {
                        let array = [];
                        for (let i = 0; i < event.length; i++) {
                            array.push({value: event[i].value, label: event[i].label, order: event[i].order});
                        }
                        this.setState({required: array, changed: true});
                    }

                }
                break;
            default:
                break;
        }
    };

    render() {
        const {courseModal, action} = this.state;
        const {
            titleModalCourse, code, denomination, semesterMask, typeCourse, abbreviation, credits, requiredCourses, required, theoryHours,
            practiceHours, area, order, disabled, loadingGetcourses, disableTab
        } = this.state;
        return (
            <Modal show={courseModal} onHide={() => this.closeModalCourse}>
                <Modal.Header style={{background: '#4680ff'}}>
                    <Modal.Title as="h5" style={{color: 'white'}}>{titleModalCourse}</Modal.Title>
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
                                    onClick={this.closeModalCourse}
                                    className="material-icons pull-right mr-n2 mt-n1"
                                    style={{color: 'white'}}>close</i>
                            </Dropdown.Toggle>
                        </Dropdown>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={denomination}
                                    onChange={this.handleChange('denomination')}
                                    placeholder="Ingrese denominación del curso"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Código</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={code}
                                    onChange={this.handleChange('code')}
                                    placeholder="Ingrese Código"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Abreviatura</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={abbreviation}
                                    onChange={this.handleChange('abbreviation')}
                                    placeholder="Ingrese abreviatura del curso"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Número de orden</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={order}
                                    onChange={this.handleChange('order')}
                                    placeholder="Ingrese número de orden"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Créditos</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={credits}
                                    onChange={this.handleChange('credits')}
                                    placeholder="Ingrese créditos del curso"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Horas Teoría</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={theoryHours}
                                    onChange={this.handleChange('theoryHours')}
                                    placeholder="Ingrese horas de teoría"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Horas Práctica</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={practiceHours}
                                    onChange={this.handleChange('practiceHours')}
                                    placeholder="Ingrese horas de práctica"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Área</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={area}
                                    onChange={this.handleChange('area')}
                                    placeholder="Ingrese Área"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Tipo</Form.Label>
                                <Form.Control as="select"
                                              value={typeCourse}
                                              onChange={this.handleChange('typeCourse')}>
                                    >
                                    <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                    <option value="Electivo">Electivo</option>
                                    <option value="Obligatorio">Obligatorio</option>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {(semesterMask !== 'Semestre I') &&
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label" style={{position: 'absolute'}}>Prerequisitos</Form.Label>
                                <Select
                                    isMulti
                                    isSearchable
                                    defaultValue={dfValue}
                                    name="prerequisites"
                                    options={requiredCourses}
                                    classNamePrefix="select"
                                    // isLoading={loadingGetcourses}
                                    className="basic-multi-select"
                                    onChange={this.handleChange('required')}
                                    styles={customStyles}
                                />
                            </Form.Group>
                        </Col>
                        }
                    </Row>
                    {action === 'add' ?
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.saveCourse()}>
                            {disabled &&
                            <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar</Button> :
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.updateCourse()}>
                            {disabled &&
                            <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar Cambios</Button>
                    }
                </Modal.Body>
            </Modal>
        );
    }
}
