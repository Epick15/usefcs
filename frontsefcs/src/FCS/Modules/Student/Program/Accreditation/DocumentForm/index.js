import React from 'react';
import {Button,  Col,  Form, InputGroup, Modal, OverlayTrigger, Row,  Tooltip} from 'react-bootstrap';


import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';

import component from "../../../../../Component";

import Close from "@material-ui/icons/Close";
import Attachment from "@material-ui/icons/Attachment";



import generator from "voucher-code-generator";
import Select from "react-select";
import Swal from "sweetalert2";


moment.locale('es');


class DocumentForm extends React.Component {

    state = {
        organicUnit: "",
        note: 0,
        documentModal: this.props.formDocument,
        belognsID: this.props.belognsID,
        tableName: this.props.tableName,
        retriveDocument: this.props.retriveDocument,

        descriptionDocument: this.props.description,

        fileName: '',
        action: 'add',
        file: '',
        studentDocumentID: '',
        documentTypes: [],
        programDocuments: [],
        organicUnits: [],
    };

    componentDidMount() {
        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});
        this.listDocumentType();
        this.getUnitOrganic();

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formDocument !== this.props.formDocument) {
            this.setState({documentModal: this.props.formDocument});
        }
        if (prevProps.description !== this.props.description) {
            this.setState({descriptionDocument: this.props.description});
        }
        if (prevProps.belognsID !== this.props.belognsID) {
            this.setState({belognsID: this.props.belognsID});
        }
        if (prevProps.tableName !== this.props.tableName) {
            this.setState({tableName: this.props.tableName});
        }
        if (prevProps.retriveDocument !== this.props.retriveDocument) {
            this.props.retriveDocument !== "" && this.retriveDocument(this.props.retriveDocument)

        }
        if (prevProps.deleteDocumentID !== this.props.deleteDocumentID) {
            this.props.deleteDocumentID !== "" && this.openDocumentSweetAlert(this.props.deleteDocumentID)

        }
    }

    getUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                res.data.map((record, index) =>
                    this.state.organicUnits.push({
                        value: record.id,
                        label: record.denomination + " " + record.Campu.denomination,
                    }));

            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };

    async listDocumentType() {

        const url = app.general + '/' + app.documentType;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({documentTypes: res.data});


        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err)

        }

    };

    async createDocument() {
        this.setState({documentLoader: true});

        const {fileName, file, belognsID, documentType, organicUnit, descriptionDocument, note, tableName} = this.state;

        if (organicUnit !== "" && fileName !== "" && belognsID !== "" && note !== "" && descriptionDocument !== "" && documentType !== "" && tableName !== "") {

            const url = app.general + '/' + app.document;
            let data = new FormData();

            data.set('id_document_type', documentType);
            data.set('id_unit_organic', organicUnit.value);
            data.set('topic', descriptionDocument);
            data.set('id_belogns', belognsID);
            data.set('archive', fileName);
            data.set('file', file);
            data.set('tableName', tableName);
            data.set('note', note);

            try {

                const res = await axios.post(url, data, app.headers);
                // this.listProgramDocumentProgram(belognsID);
                if (res) {
                    this.props.callData()
                    this.closeModalDocument()
                }
                this.setState({documentLoader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                console.log(err)
                this.setState({documentLoader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({documentLoader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateDocument() {
        this.setState({documentLoader: true});

        const {fileName, file, belognsID, studentDocumentID, documentType, organicUnit, tableName, descriptionDocument, note, documentID} = this.state;


        if (organicUnit !== "" && fileName !== "" && belognsID !== "" && tableName !== "" && studentDocumentID !== "" && descriptionDocument !== "" && note !== "" && documentType !== "" && documentID !== "") {

            const url = app.general + '/' + app.document + '/' + documentID;
            let data = new FormData();

            data.set('id_document_type', documentType);
            data.set('id_unit_organic', organicUnit.value);
            data.set('topic', descriptionDocument);
            data.set('id_belogns', belognsID);
            data.set('archive', fileName);
            data.set('file', file);
            data.set('note', note);
            data.set('tableName', tableName);
            data.set('id_student_document', studentDocumentID);

            try {

                const res = await axios.patch(url, data, app.headers);
                // this.listProgramDocumentProgram(belognsID);
                if (res) {
                    this.props.callData()
                    this.closeModalDocument()
                }
                this.setState({documentLoader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                console.log(err)
                this.setState({documentLoader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({documentLoader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async destroyDocument(id) {

        try {
            this.setState({documentLoader: true});
            const url = app.general + '/' + app.document + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({documentLoader: false});
            this.props.callData();
            this.closeModalDocument();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({documentLoader: false});
            return false;
        }
    };

    openDocumentSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyDocument(id) : this.props.closeFormDocument();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };
    retriveDocument = (r) => {
        console.log(r)
        this.setState({
            action: "update",
            belognsID: r.id_student,
            documentID: r.Document.id,
            documentType: r.Document.id_document_type,
            organicUnit: {value: r.Document.id_unit_organic, label: r.Document.Organic_unit.denomination},
            descriptionDocument: r.Document.topic,
            fileName: r.Document.archive,
            file: r.file,
            note: r.note,
            studentDocumentID: r.id

        })
    };
    closeModalDocument = () => {
        this.setState({
            documentModal: false,
            programCodeDocument: "",
            programDocuments: [],
            action: "add",
            fileName: "",
            note: "",
            file: "",
            documentType: "",
            descriptionDocument: "",
            documentID: "",
            studentDocumentID: "",

        })
        this.props.closeFormDocument()
    };
    handleChange = field => event => {
        switch (field) {

            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                break;
            case 'documentType':
                this.setState({documentType: event.target.value});
                break;
            case 'note':
                if (event.target.value <= 20) {
                    this.setState({note: event.target.value.replace(/[^0-9/]/g, '')});
                }

                break;
            case 'descriptionDocument':
                this.setState({descriptionDocument: event.target.value});
                break;
            default:
                break;
        }
    };
    showFileManager = () => {
        const input = '#file';
        $(input).click();
    };
    handleChangeFileInput = event => {
        const fileExtension = ['docx', 'doc', 'pdf', 'odt'];
        const input = '#file';
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
                prefix: this.state.belognsID + 'STUDENT' + moment().format('YYYYMhms'),
                count: 1,
                charset: generator.charset('numbers')
            });
            reader.onload = () => {
                this.setState({file: file, fileName: code});
            };
            reader.readAsDataURL(file);
        }
    };
    clearFiles = () => {
        this.setState({
            file: '',
            fileName: ''
        });
        if (this.state.action === 'update') {
            this.setState({
                changed: 'si'
            })
        }
    };

    render() {

        const {documentModal, documentTypes, descriptionDocument, note, documentType, fileName} = this.state;
        const { titleModalDocument, organicUnit, organicUnits} = this.state;

        return (
            <Modal show={documentModal} size={"xl"} backdrop="static">
                {this.state.documentLoader && component.spiner}
                <Modal.Header style={{background: '#00acc1'}}>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR DOCUMENTO {titleModalDocument}</Modal.Title>
                    <div className="d-inline-block pull-right">

                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}} onClick={() => this.closeModalDocument()}/>

                        </OverlayTrigger>

                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {!component.ORGANIC_UNIT && <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                <Form.Label className="floating-label"
                                            style={organicUnit === "" ? {color: "#ff5252 "} : null}
                                >Unidada organica <small className="text-danger"> *</small></Form.Label>
                                <Select
                                    isSearchable
                                    value={organicUnit}
                                    name="organicUnit"
                                    options={organicUnits}
                                    classNamePrefix="select"
                                    // isLoading={coursesLoader}
                                    className="basic-single"
                                    placeholder="Buscar unidad organica"
                                    onChange={this.handleChange("organicUnit")}
                                    styles={component.selectSearchStyle}
                                />
                            </Form.Group>
                            <br/>
                        </Col>}
                        <Col xs={12} sm={12} md={12} lg={2} xl={2}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Tipo de documento<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              id="program"
                                              value={documentType}
                                              onChange={this.handleChange('documentType')}>
                                    >
                                    <option defaultValue={true} hidden>Seleccione</option>
                                    {
                                        documentTypes.length > 0 ?
                                            documentTypes.map((r, index) => {

                                                return (
                                                    <option id={r.id} value={r.id} key={index}>
                                                        {r.denomination}
                                                    </option>
                                                )

                                            }) :
                                            <option value={false}>No se encontraron datos</option>
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Archivo<small className="text-danger"> *</small></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        style={{marginTop: "3px"}}
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
                                            <OverlayTrigger
                                                overlay={<Tooltip style={{zIndex: 100000000}}>Limpiar</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px', marginTop: '-2px',
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

                                            </OverlayTrigger>


                                        </InputGroup.Append> :
                                        <InputGroup.Append>
                                            <OverlayTrigger
                                                overlay={<Tooltip style={{zIndex: 100000000}}>Archivo</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px', marginTop: '-2px',
                                                    position: 'relative',
                                                    zIndex: 100,
                                                    fontSize: '16px',
                                                    padding: '0',
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                }}>
                                                    {/*<i onClick={this.showFileManager} className="text-warning feather icon-paperclip"/>*/}

                                                    <Attachment className="text-warning"/>
                                                </button>

                                            </OverlayTrigger>

                                        </InputGroup.Append>
                                    }
                                </InputGroup>
                                <input
                                    type="file"
                                    style={{display: 'none'}}
                                    name="file"
                                    id="file"
                                    onChange={(event) => this.handleChangeFileInput(event)}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Descripción del documento <small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={descriptionDocument}
                                              onChange={this.handleChange('descriptionDocument')}>
                                    >
                                    <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                    <option value="Evaluación curricular">Evaluación curricular</option>
                                    <option value="Prueba de conocimiento">Prueba de conocimiento</option>
                                    <option value="Entrevista personal">Entrevista personal</option>
                                    {
                                        (this.props.titleAcademicDegree === "Doctor" || this.props.titleAcademicDegree === "DOCTOR") &&
                                        <option value="Proyecto de investigación">Proyecto de investigación</option>
                                    }

                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={3} xl={3}>
                            <Form.Group className="form-group fill">


                                <Form.Label className="floating-label">Nota <small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    style={{marginTop: "3px"}}
                                    type="text"
                                    // min="0"
                                    // max="20"
                                    value={note}

                                    onChange={this.handleChange('note')}
                                    placeholder="Nombre del programa"
                                    margin="normal"
                                />

                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {this.state.action === "add" ?
                                <Button
                                    className="pull-right"
                                    disabled={this.state.documentLoader}
                                    variant="primary"
                                    onClick={() => this.createDocument()}
                                >
                                    {this.state.documentLoader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button>
                                :
                                <Button
                                    className="pull-right"
                                    disabled={this.state.documentLoader}
                                    variant="primary"
                                    onClick={() => this.updateDocument()}
                                >
                                    {this.state.documentLoader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar Cambios</Button>
                            }
                        </Col>

                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}

export default DocumentForm;
