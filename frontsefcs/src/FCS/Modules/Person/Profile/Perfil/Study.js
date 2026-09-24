import React, {Component} from 'react';
import Swal from "sweetalert2";
import axios from "axios";
import DTDocuments from './DTDocuments';
import app from "../../../../Constants";
import PNotify from "pnotify/dist/es/PNotify";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {Button, Card, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import moment from 'moment';


moment.locale('es');
export default class Study extends Component {

    state = {

        // startDate: moment().format('l'),
        // startDate: new Date(),
        /////////STATE FORM////////////
        isOtherEdit: false,
        academicDegree: '',
        action: 'add',
        university: '',
        title: '',
        formStudy: false,
        personID: this.props.personID,
        documentCode: '',
        documentID: '',

        academicDegrees: [],
        studys: [],
    };

    //CARGA TODAS LAS FUNCIONES
    componentDidMount() {
        this.getStudy(this.state.personID);
        this.getAcademicDegree();
    }

    getStudy(id) {

        const url = app.person + '/' + app.study + '/' + app.persons + '/' + id;
        axios.get(url, app.headers).then(res => {

            if (res.data) this.setState({studys: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    getAcademicDegree = () => {
        const url = app.general + '/' + app.academicDegree;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({academicDegrees: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveStudy = () => {
        this.setState({disabled: true})
        const url = app.person + '/' + app.study;

        const {personID, academicDegree, documentID, university, title} = this.state;
        if (personID !== '' && academicDegree !== '' && university !== '' && title !== '') {
            let data = new FormData();
            data.set('id_person', personID);
            data.set('id_academic_degree', academicDegree);
            data.set('id_document', documentID);
            data.set('university', university);
            data.set('title', title);
            axios.post(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getStudy(personID);
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

    updateStudy = (id) => {
        this.setState({disabled: true})
        const url = app.person + '/' + app.study + '/' + this.state.currentID;

        const {personID, academicDegree, documentID, university, title} = this.state;
        if (personID !== '' && academicDegree !== '' && university !== '' && title !== '') {
            let data = new FormData();
            data.set('id_person', personID);
            data.set('id_academic_degree', academicDegree);
            data.set('id_document', documentID);
            data.set('university', university);
            data.set('title', title);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.getStudy(personID);
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

    deleteStudy(id) {
        const url = app.person + '/' + app.study + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getStudy(this.state.personID);
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //Operation Functions
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (this.state.action === 'add') {
                this.saveStudy();
            } else {
                this.updateStudy();
            }

        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'personID':
                this.setState({personID: event.target.value});
                break;
            case 'academicDegree':
                this.setState({academicDegree: event.target.value});
                break;
            case 'university':
                this.setState({university: event.target.value});
                break;
            case 'title':
                this.setState({title: event.target.value});
                break;
            default:
                break;
        }
    };
    handleOpenModal = () => {
        this.setState({
            formStudy: true,
            isVarying: true,
            action: 'add',
            academicDegree: '',
            documentID: '',
            documentCode: '',
            university: '',
            title: '',
        });

    };
    handleCloseModal = () => {
        this.setState({

            action: 'add',
            disabled: false,
            formStudy: false,
            // aqui se pone todos tus estados para vaciar el formulario
            currentID: '',
            academicDegree: '',
            documentID: '',
            documentCode: '',
            university: '',
            title: '',
        })
    };
    handleClickRetrieveRecord = record => {
        this.setState({
            formStudy: true,
            action: 'update',
            currentID: record.id,
            academicDegree: record.Academic_degree.id,
            documentID: record.id_document,
            documentCode: record.Document ? record.Document.code : '',
            university: record.university,
            title: record.title,
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
            confirmButtonText: 'Si, eliminar',
            customClass: {
                container: 'my-swal'
            }
        }).then((result) => {
            if (result.value) {
                this.deleteStudy(id);
            }
        })
    };

    handleDTDocuments = () => {
        this.DTDocuments.handleModalDocument();
        this.DTDocuments.getDocumentsByPerson(this.state.personID);
        this.DTDocuments.getDocumentType();
    };

    handleClickSelectDocument = (record) => {
        this.setState({
            documentID: record.id,
            documentCode: record.code,
        });
        this.DTDocuments.handleModalDocument();
    };


    render() {
        //state frontend
        const {academicDegree, documentCode, university, title, academicDegrees, studys} = this.state;

        const {formStudy, action, disabled} = this.state;

        return (
            <Card>
                <Card.Body
                    className='d-flex align-items-center justify-content-between'>
                    <h5 className="mb-0">Estudios</h5>
                    {!formStudy ?
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-0 float-right"
                                onClick={() => this.handleOpenModal()}>
                            <i className='feather icon-plus'/>
                        </button>
                        :
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-0 float-right"
                                onClick={() => this.handleCloseModal()}>
                            <i className='feather icon-x'/>
                        </button>

                    }

                </Card.Body>
                <Card.Body
                    className={formStudy ? 'border-top pro-det-edit collapse' : 'border-top pro-det-edit collapse show'}>
                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Universidad</th>
                            <th>Documento</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {studys.length > 0 &&
                        studys.map((r, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <h6 className="m-b-0"> {r.title}</h6>
                                                <p className="m-b-0">{r.Academic_degree.denomination}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <h6 className="m-b-0"> {r.university}</h6>
                                                <p className="m-b-0">Universidad</p>
                                            </div>
                                        </div>
                                    </td>

                                        <td>
                                            <div className="d-inline-block align-middle">
                                                <div className="d-inline-block">
                                                    <p className='m-b-0 align-items-center'>
                                                        {(r.Document && r.Document.archive) ?
                                                            <Tooltip title={"Descargar"}>
                                                                <a target='_blank' rel='noreferrer noopener'
                                                                   href={app.server + app.docs + '/' + r.Document.archive}
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

                                    <td>
                                        <IconButton
                                            size="small"
                                            aria-label="Editar"
                                            onClick={() => this.handleClickRetrieveRecord(r)}
                                        >
                                            <i className="material-icons text-primary">edit</i>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="Eliminar"
                                            onClick={() => this.handleOpenSweetAlertWarning(r.id)}
                                        >
                                            <i className="material-icons text-danger">delete</i>
                                        </IconButton>
                                    </td>
                                </tr>
                            )
                        })
                        }
                        </tbody>
                    </Table>
                </Card.Body>

                <Card.Body
                    className={formStudy ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>

                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Grado Academico</label>
                        <Col sm={9}>
                            <Form.Control as="select"
                                          value={academicDegree}
                                          onChange={this.handleChange('academicDegree')}>
                                >
                                <option defaultValue={true} hidden>Por favor seleccione una opción</option>
                                {
                                    academicDegrees.length > 0 ?
                                        academicDegrees && academicDegrees.map((academicDegree, index) =>
                                            <option value={academicDegree.id} key={index}>{academicDegree.denomination}</option>
                                        ) :
                                        <option disabled>No hay registros</option>
                                }
                            </Form.Control>
                        </Col>

                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Documento</label>
                        <Col sm={9}>
                            <InputGroup>
                                <input type="text"
                                       className="form-control"
                                       autoComplete='off'
                                       placeholder="Seleccione documento"
                                       value={documentCode}
                                       onChange={this.handleChange('disabled')}
                                />
                                <InputGroup.Append>
                                    <Tooltip title='Documento'>
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
                                            <i className="material-icons"
                                               onClick={this.handleDTDocuments}>search
                                            </i>
                                        </button>
                                    </Tooltip>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Universidad</label>
                        <Col sm={9}>
                            <input type="text"
                                   className="form-control"
                                   placeholder="Universidad"
                                   value={university}
                                   id="university"
                                   onChange={this.handleChange('university')}
                            />
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Título</label>
                        <Col sm={9}>
                            <input type="text"
                                   className="form-control"
                                   placeholder="Título"
                                   value={title}
                                   id="title"
                                   onChange={this.handleChange('title')}
                            />
                        </Col>
                    </Row>
                    {action === 'add' ?
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.saveStudy()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar</Button> :
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.updateStudy()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar Cambios</Button>
                    }


                </Card.Body>

                <DTDocuments
                    personDNI={this.props.personDNI}
                    handleClickSelectDocument={this.handleClickSelectDocument}
                    ref={(ref) => this.DTDocuments = ref}/>


            </Card>
        )
    }
}
