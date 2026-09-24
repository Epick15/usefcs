import React from 'react';
import {Button, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';
import component from "../../../Component";
import Close from "@material-ui/icons/Close";
import Attachment from "@material-ui/icons/Attachment";
import generator from "voucher-code-generator";
import Swal from "sweetalert2";

moment.locale('es');

class DocumentForm extends React.Component {

    state = {
        organicUnit: "",
        note: 0,
        documentModal: this.props.formDocument,
        belognsID: this.props.belognsID,
        tableName: 'Student_document_retirement',
        retriveDocument: this.props.retriveDocument,

        descriptionDocument: this.props.description,

        titleRegistration: '',
        titleConcept: '',
        fileName: '',
        action: 'add',
        file: '',
        studentDocumentID: '',
        documentTypes: [],
        programDocuments: [],
        organicUnits: [],
    };

    componentDidMount() {
        this.setState({organicUnit: component.ORGANIC_UNIT});
        this.listDocumentType();
        this.listUnitOrganic();

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formDocument !== this.props.formDocument) {
            this.setState({documentModal: this.props.formDocument});
            this.listUltimateRegistrationCourseStudent(this.state.belognsID)
            this.listPaymentRetirementByStudent(this.state.belognsID)
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

    async listUltimateRegistrationCourseStudent(id_student) {
        this.setState({registrationDataLoader: true});
        const url = app.registration + '/' + app.registrations + '/' + id_student + '/' + app.registrationCourse + '/ultimate';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    registrationID: res.data.id,
                    registrations: res.data.Registration_course,
                    stateRegistration: res.data.state,
                    titleRegistration: res.data.Payment.Concept.denomination.toUpperCase() + " - " + res.data.type.toUpperCase() + " / " + res.data.Academic_semester.Academic_calendar.denomination + " - " + res.data.Academic_semester.denomination + " - " + res.data.state
                })
            } else {
                this.setState({registrations: []})
            }
            this.setState({registrationDataLoader: false});
        } catch (err) {
            this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listPaymentRetirementByStudent(id_student) {
        // this.setState({registrationDataLoader: true});
        const url = app.accounting + '/' + app.payment + '/' + app.student + '/' + id_student + '/retirement';
        try {

            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    conceptStateType: res.data.type === 'Pagado' ? true : false,
                    conceptID: res.data.id,
                    titleConcept: res.data.Concept.denomination + ' - ' + res.data.type,
                })
            }

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    listUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({organicUnits: res.data})
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
            if (res.data) this.setState({documentTypes: res.data, documentType: 2});


        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err)

        }

    };

    async createDocument() {
        this.setState({documentLoader: true});

        const {
            fileName,
            file,
            belognsID,
            documentType,
            organicUnit,
            tableName,
            registrationID,
            conceptID
        } = this.state;

        if (organicUnit !== "" && fileName !== "" && belognsID !== "" &&
            documentType !== "" && conceptID !== "" && registrationID !== "" && tableName !== "") {

            const url = app.general + '/' + app.document;
            let data = new FormData();
            data.set('id_concept', conceptID);
            data.set('id_registration', registrationID);
            data.set('id_document_type', documentType);
            data.set('id_unit_organic', organicUnit);
            data.set('topic', 'RESOLUCIÓN DE RETIRO');
            data.set('id_belogns', belognsID);
            data.set('archive', fileName);
            data.set('file', file);
            data.set('tableName', tableName);

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

        const {
            fileName,
            file,
            belognsID,
            studentDocumentID,
            documentType,
            organicUnit,
            tableName,
            descriptionDocument,
            note,
            documentID
        } = this.state;


        if (organicUnit !== "" && fileName !== "" && belognsID !== "" && tableName !== "" && studentDocumentID !== "" && descriptionDocument !== "" && note !== "" && documentType !== "" && documentID !== "") {

            const url = app.general + '/' + app.document + '/' + documentID;
            let data = new FormData();

            data.set('id_document_type', documentType);
            data.set('id_unit_organic', organicUnit);
            data.set('topic', 'RESOLUCIÓN DE RETIRO');
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
        this.setState({
            action: "update",
            belognsID: r.id_student,
            documentID: r.Document.id,
            organicUnit: r.Document.id_unit_organic,
            descriptionDocument: r.Document.topic,
            fileName: r.Document.archive,
            file: r.file,
            note: r.note,
            studentDocumentID: r.id

        })
    };
    closeModalDocument = () => {
        this.props.closeFormDocument()

        this.setState({
            documentModal: false,
            programCodeDocument: "",
            programDocuments: [],
            action: "add",
            fileName: "",
            titleConcept: "",
            note: "",
            file: "",
            descriptionDocument: "",
            documentID: "",
            studentDocumentID: "",

        })

    };
    handleChange = field => event => {
        switch (field) {

            case 'organicUnit':

                this.setState({organicUnit: event.target.value});
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
                prefix: this.state.belognsID + '-S-R-' + moment().format('YYYYMhms'),
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

        const {documentModal, documentTypes, documentType, fileName} = this.state;
        const {titleModalDocument, organicUnit, organicUnits} = this.state;

        return (
            <Modal show={documentModal} size={"xl"} backdrop="static">
                {this.state.documentLoader && component.spiner}
                <Modal.Header style={{background: '#00acc1'}}>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>RETIRO Y RESERVA DE
                        MATRÍCULA {titleModalDocument}</Modal.Title>
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


                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"

                                >Unidad Organica<small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={organicUnit}
                                              onChange={this.handleChange('organicUnit')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Unidad</option>
                                    {
                                        organicUnits.length > 0 ?
                                            organicUnits.map((r, k) => {

                                                    return (<option
                                                        value={r.id} key={k}> {r.denomination.toUpperCase()} </option>)

                                                }
                                            ) :
                                            <option value={false} disabled>No se encontraron datos</option>
                                    }
                                </Form.Control>
                            </Form.Group>

                            <br/>
                        </Col>}
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Form.Group className="form-group fill">


                                <Form.Label className="floating-label">Matrícula <small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    style={{marginTop: "3px"}}
                                    type="text"
                                    disabled={true}
                                    value={this.state.titleRegistration.toUpperCase()}
                                    // onChange={this.handleChange('descriptionDocument')}
                                    placeholder="Nombre del programa"
                                    margin="normal"
                                />

                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <Form.Group className="form-group fill">


                                <Form.Label className="floating-label">Concepto <small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    style={{marginTop: "3px"}}
                                    type="text"
                                    disabled={true}
                                    value={this.state.titleConcept.toUpperCase()}
                                    placeholder="El concepto de retiro debe estar pagado"
                                    margin="normal"
                                />

                            </Form.Group>
                        </Col>


                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Tipo de documento<small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              id="program"
                                              value={documentType}
                                              disabled={true}
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
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
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
                                                    <i onClick={this.clearFiles}
                                                       className="text-danger feather icon-x-circle"/>
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


                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {this.state.action === "add" ?

                                this.state.stateRegistration && this.state.conceptStateType ?

                                    <Button
                                        className="pull-right"
                                        disabled={this.state.documentLoader}
                                        variant="primary"
                                        onClick={() => this.createDocument()}
                                    >
                                        {this.state.documentLoader &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button>
                                    :
                                    <Button
                                        className="pull-right"
                                        disabled={true}
                                        variant="secondary"

                                    > Guardar</Button>
                                :
                                <Button
                                    className="pull-right"
                                    disabled={this.state.documentLoader}
                                    variant="primary"
                                    onClick={() => this.updateDocument()}
                                >
                                    {this.state.documentLoader &&
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
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
