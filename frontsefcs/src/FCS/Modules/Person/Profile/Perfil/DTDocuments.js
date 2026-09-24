import React, {Fragment, Component} from 'react';
import $ from "jquery";
import axios from "axios";
import Swal from "sweetalert2";
import styled from 'styled-components';
import app from "../../../../Constants";
import DatePicker from "react-datepicker";
import PNotify from "pnotify/dist/es/PNotify";
import generator from 'voucher-code-generator';
import Tooltip from "@material-ui/core/Tooltip";
import {Button, Table, Dropdown, Row, Col, Form, Modal, InputGroup} from "react-bootstrap";
import moment from 'moment';


const DatePickerStyled = styled.div`
    .react-datepicker__input-container {
      width: inherit;
    }
    .react-datepicker-wrapper {
      width: 100%;
    }
  }`;


export default class DTDocuments extends Component {
    state = {
        documents: [],
        documentTypes: [],
        personID: '',

        documentTypeID: '',
        emission_date: '',
        code: '',
        topic: '',
        disabled: false,
        modalDocument: false,
        showFormDocument: false,
        action: 'add',
        fileName: '',
        currentID: '',
        changed: 'no',
        isCurriculum: this.props.isCurriculum || false,
    };


    getDocumentsByPerson = id_person => {
        this.setState({personID: id_person});
        const url = app.general + '/' + app.document + '/' + id_person;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({
                    documents: res.data,
                })
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al cargar documentos",
                delay: 2000
            });
            console.log(err);
        })
    };

    getDocumentType = () => {
        const url = app.general + '/' + app.documentType;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({
                    documentTypes: res.data,
                })
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al cargar tipo de documento",
                delay: 2000
            });
            console.log(err);
        })
    };

    handleChange = field => event => {
        switch (field) {
            case 'documentTypeID':
                this.setState({documentTypeID: event.target.value});
                break;
            case 'code':
                this.setState({code: event.target.value.replace(/[^ A-Za-záéíóúÁÉÍÓÚÜ0-9-/]/g, '')});
                break;
            case 'topic':
                this.setState({topic: event.target.value.replace(/[^ A-Za-záéíóúÁÉÍÓÚÜ0-9.,-/]/g, '')});
                break;
            case 'emission_date':
                this.setState({emission_date: event});
                break;
            default:
                break;
        }
    };

    handleModalDocument = () => {
        this.setState({
            modalDocument: !this.state.modalDocument,
            action: 'add',
            documentTypeID: '',
            emission_date: '',
            code: '',
            topic: '',
            disabled: false,
            showFormDocument: false
        });
    };
    handleAddDocument = () => {
        this.state.isCurriculum && this.handleModalDocument();
        this.setState({
            showFormDocument: !this.state.showFormDocument,
            action: 'add',
            documentTypeID: '',
            emission_date: '',
            code: '',
            topic: '',
            disabled: false,
        });
        this.clearFiles();
    };

    showFileManager = () => {
        const input = '#refdocument';
        $(input).click();
    };

    handleChangeFileInput = event => {
        const fileExtension = ['docx', 'doc', 'pdf', 'odt'];
        const input = '#refdocument';
        let value = $(input).val().split('.').pop().toLowerCase();
        if ($.inArray(value, fileExtension) === -1) {
            let message = "Por favor use estos formatos: " + fileExtension.join(', ');
            PNotify.error({title: 'Oh no!', text: message, delay: 2000});
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            let code = generator.generate({
                length: 3,
                prefix: 'IL' + this.props.personDNI + moment().format('YYMMDDhhmmss'),
                count: 1,
                charset: generator.charset('numbers')
            });
            reader.onload = () => {
                this.setState({refdocument: file, fileName: code});
            };
            reader.readAsDataURL(file);
        }
    };

    clearFiles = () => {
        this.setState({
            refdocument: '',
            fileName: ''
        });
        if (this.state.action === 'update') {
            this.setState({
                changed: 'si'
            })
        }
    };

    saveDocument = () => {
        this.setState({disabled: true});
        const url = app.general + '/' + app.document;
        const {documentTypeID, emission_date, code, topic, fileName, refdocument, personID, isCurriculum} = this.state;
        if (documentTypeID && emission_date && code && topic) {
            let data = new FormData();
            data.set('id_document_type', documentTypeID);
            data.set('emission_date', moment(emission_date).format('YYYY-MM-DD hh:mm:ss'));
            data.set('code', code);
            data.set('topic', topic);
            data.set('id_unit_organic', personID);
            if (fileName && refdocument) {
                data.set('archive', fileName);
                data.set('file', refdocument);
                data.set('exists', 'si');
            } else {
                data.set('exists', 'no');
            }
            axios.post(url, data, app.headers).then(res => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                if (isCurriculum) {
                    this.props.handleClickSelectDocument(res.data.record);
                    this.handleModalDocument();
                    this.setState({disabled: false});
                } else {
                    this.handleAddDocument();
                    this.getDocumentsByPerson(this.state.personID);
                }
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

    handleClickRetrieveDocument = (record) => {
        this.setState({
            action: 'update',
            currentID: record.id,
            documentTypeID: record.id_document_type,
            emission_date: record.emission_date ? new Date(record.emission_date) : '',
            code: record.code,
            topic: record.topic,
            fileName: record.archive,
            showFormDocument: true,
        })
    };

    updateDocument = () => {
        this.setState({disabled: true});
        const url = app.general + '/' + app.document + '/' + this.state.currentID;
        const {documentTypeID, emission_date, code, topic, fileName, refdocument, personID, changed, isCurriculum} = this.state;
        if (documentTypeID && emission_date && code && topic) {
            let data = new FormData();
            data.set('id_document_type', documentTypeID);
            data.set('emission_date', moment(emission_date).format('YYYY-MM-DD hh:mm:ss'));
            data.set('code', code);
            data.set('topic', topic);
            data.set('id_unit_organic', personID);
            data.set('changed', changed);
            if (fileName && refdocument) {
                data.set('archive', fileName);  //nombre
                data.set('file', refdocument);  //req.files
            }
            axios.patch(url, data, app.headers).then(res => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos actualizados correctamente",
                    delay: 2000
                });
                if (isCurriculum) {
                    this.props.handleClickSelectDocument(res.data.record);
                    this.handleModalDocument();
                    this.setState({disabled: false});
                } else {
                    this.handleAddDocument();
                    this.getDocumentsByPerson(this.state.personID);
                }
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

    openAlertChangeStateDocument = _id => {
        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#29f200',
            confirmButtonColor: '#ff0000',
            confirmButtonText: 'Si, eliminar',
        }).then((result) => {
            if (result.value) {
                this.deleteDocument(_id);
            }
        })
    };

    deleteDocument = id => {
        const url = app.general + '/' + app.document + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getDocumentsByPerson(this.state.personID);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un al eliminar registro",
                delay: 2000
            });
        })
    };

    render() {
        const {documents, documentTypes} = this.state;
        const {showFormDocument, action, documentTypeID, emission_date, code, topic, modalDocument, disabled, fileName, isCurriculum} = this.state;
        return (

            <Modal show={modalDocument} onHide={this.handleModalDocument} size='lg'>
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>Gestionar documentos</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <Dropdown alignRight className="pull-right">
                            <i onClick={this.handleModalDocument}
                               className="material-icons pull-right"
                               style={{color: 'white'}}>close</i>
                            {!isCurriculum &&
                            <i onClick={this.handleAddDocument}
                               className="material-icons pull-right"
                               style={{color: 'white'}}>add</i>
                            }
                        </Dropdown>
                    </div>
                </Modal.Header>
                <Modal.Body style={{padding: '0'}}>
                    {showFormDocument ?
                        <Fragment>
                            <Row className='md-12 p-25'>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">
                                        <Form.Control as="select"
                                                      style={{fontSize: '16px'}}
                                                      value={documentTypeID}
                                                      onChange={this.handleChange('documentTypeID')}>
                                            >
                                            <option defaultValue={true} hidden>Seleccione tipo de documento</option>
                                            {
                                                documentTypes.length > 0 ?
                                                    documentTypes.map((record, index) =>
                                                        <option value={record.id} key={index}>{record.denomination}</option>
                                                    ) :
                                                    <option value={false}>No se encontraron datos</option>
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Fecha de emisión</Form.Label>
                                        <DatePickerStyled>
                                            <DatePicker
                                                selected={emission_date}
                                                todayButton={"Hoy"}
                                                onChange={this.handleChange('emission_date')}
                                                className="form-control"
                                                isClearable
                                                placeholderText="mes/dia/año"
                                            />
                                        </DatePickerStyled>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Código</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete='off'
                                            value={code}
                                            onChange={this.handleChange('code')}
                                            placeholder="Ingrese Código"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Archivo</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                autoComplete='off'
                                                value={fileName}
                                                onChange={this.handleChange('disabled')}
                                                onClick={this.showFileManager}
                                                placeholder="Seleccione un archivo"
                                                margin="normal"
                                            />
                                            {fileName ?
                                                <InputGroup.Append>
                                                    <Tooltip title='Limpiar'>
                                                        <button style={{
                                                            marginLeft: '-25px', marginTop: '10px',
                                                            position: 'relative',
                                                            zIndex: 100,
                                                            fontSize: '20px',
                                                            padding: '0',
                                                            border: 'none',
                                                            background: 'none',
                                                            outline: 'none',
                                                        }}>
                                                            <i onClick={this.clearFiles} className="text-danger feather icon-x-circle"/>
                                                        </button>
                                                    </Tooltip>
                                                    {action === 'update' &&
                                                    <Tooltip title='Descargar'>
                                                        <a target='_blank' rel='noreferrer noopener'
                                                           href={app.server + app.docs + '/' + fileName}
                                                           style={{
                                                               marginLeft: '-45px', marginTop: '10px',
                                                               position: 'relative',
                                                               zIndex: 100,
                                                               fontSize: '20px',
                                                               padding: '0',
                                                               border: 'none',
                                                               background: 'none',
                                                               outline: 'none',
                                                           }}>
                                                            <i className="text-primary feather icon-download-cloud"/>
                                                        </a>
                                                    </Tooltip>
                                                    }
                                                </InputGroup.Append> :
                                                <InputGroup.Append>
                                                    <Tooltip title='Archivo'>
                                                        <button style={{
                                                            marginLeft: '-25px', marginTop: '10px',
                                                            position: 'relative',
                                                            zIndex: 100,
                                                            fontSize: '16px',
                                                            padding: '0',
                                                            border: 'none',
                                                            background: 'none',
                                                            outline: 'none',
                                                        }}>
                                                            <i onClick={this.showFileManager} className="text-warning feather icon-paperclip"/>
                                                        </button>
                                                    </Tooltip>
                                                </InputGroup.Append>
                                            }
                                        </InputGroup>
                                        <input
                                            type="file"
                                            style={{display: 'none'}}
                                            name="refdocument"
                                            id="refdocument"
                                            onChange={(event) => this.handleChangeFileInput(event)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">Asunto</Form.Label>
                                        <Form.Control
                                            type="text"
                                            autoComplete='off'
                                            value={topic}
                                            onChange={this.handleChange('topic')}
                                            placeholder="Ingrese Código"
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Modal.Footer className='mb-1'>
                                <Button
                                    variant="danger"
                                    onClick={this.handleAddDocument}>
                                    Cancelar
                                </Button>
                                {action === 'add' ?
                                    <Button
                                        variant="primary"
                                        disabled={disabled}
                                        onClick={() => this.saveDocument()}>
                                        {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar
                                    </Button> :
                                    <Button
                                        variant="primary"
                                        disabled={disabled}
                                        onClick={() => this.updateDocument()}>
                                        {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Actualizar
                                    </Button>
                                }
                            </Modal.Footer>
                        </Fragment> :
                        <Table responsive hover>
                            <thead>
                            <tr className="d-flex">
                                <th className="col-3">N° Documento</th>
                                <th className="col-6">Título</th>
                                <th className="col-1">Archivo</th>
                                <th className="col-2">Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {documents.length > 0 &&
                            documents.map((record, index) => {
                                return (
                                    <tr key={index} className="d-flex">
                                        <td className="col-3">
                                            <div className="d-inline-block align-middle">
                                                <div className="d-inline-block">
                                                    <p className="m-b-0"> {record.code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-6">
                                            <div className="d-inline-block align-middle">
                                                <div className="d-inline-block">
                                                    <p className="m-b-0"> {record.topic}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-1">
                                            <div className="d-inline-block align-middle">
                                                <div className="d-inline-block">
                                                    <p className="m-b-0">
                                                        {record.archive ?
                                                            <Tooltip title={"Descargar"}>
                                                                <a target='_blank' rel='noreferrer noopener'
                                                                   href={app.server + app.docs + '/' + record.archive}
                                                                   style={{
                                                                       padding: '0',
                                                                       border: 'none',
                                                                       background: 'none',
                                                                       outline: 'none',
                                                                   }}>
                                                                    <i className="material-icons text-primary"
                                                                       style={{fontSize: '19px'}}>cloud_download</i>
                                                                </a>
                                                            </Tooltip> :
                                                            <Tooltip title={"No disponible"}>
                                                                <button style={{
                                                                    padding: '0',
                                                                    border: 'none',
                                                                    background: 'none',
                                                                    outline: 'none',
                                                                }}>
                                                                    <i className="material-icons text-muted"
                                                                       style={{fontSize: '19px'}}>cloud_download</i>
                                                                </button>
                                                            </Tooltip>
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-2 d-flex">
                                            <div className="d-inline-block align-middle">
                                                <div className="d-inline-block">
                                                    <p className="">
                                                        <Tooltip title={"Seleccionar"}>
                                                            <button style={{
                                                                padding: '0',
                                                                border: 'none',
                                                                background: 'none',
                                                                outline: 'none',
                                                            }}>
                                                                <i className="material-icons text-success"
                                                                   onClick={() => this.props.handleClickSelectDocument(record)}
                                                                   style={{fontSize: '19px'}}>done_all</i>
                                                            </button>
                                                        </Tooltip>
                                                    </p>
                                                </div>
                                            </div>
                                            <Dropdown alignRight>
                                                <Dropdown.Toggle className="btn-icon" style={{
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                    color: 'white',
                                                    height: '5px',

                                                }}>
                                                    <i className="text-dark material-icons">more_vert</i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu as='ul' className="list-unstyled card-option">
                                                    <Fragment>
                                                        <Dropdown.Item as='li' className="dropdown-item"
                                                                       onClick={() => this.handleClickDetailDocument(record)}>
                                                            <i className={'feather icon-more-horizontal'}/> Detalles
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as='li' className="dropdown-item"
                                                                       onClick={() => this.handleClickRetrieveDocument(record)}>
                                                            <i className={'feather icon-edit-2'}/> Editar
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as='li' className="dropdown-item"
                                                                       onClick={() => this.openAlertChangeStateDocument(record.id)}>
                                                            <i className={'feather icon-trash-2'}/> Eliminar
                                                        </Dropdown.Item>
                                                    </Fragment>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>

                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </Table>
                    }
                </Modal.Body>
            </Modal>

        );
    }
}
