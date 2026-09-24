import React, {Component} from 'react';
import axios from "axios";
import moment from 'moment';
import Swal from "sweetalert2";
import styled from 'styled-components';
import DTDocuments from './DTDocuments';
import app from "../../../../Constants";
import DatePicker from "react-datepicker";
import PNotify from "pnotify/dist/es/PNotify";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {Button, Card, Col, Row, Table, InputGroup} from "react-bootstrap";

moment.locale('es');
const DatePickerStyled = styled.div`
    .react-datepicker__input-container {
      width: inherit;
    }
    .react-datepicker-wrapper {
      width: 100%;
    }
  }`;


export default class Laboral extends Component {

    state = {

        isOtherEdit: false,
        action: 'add',
        entity: '',
        charge: '',
        direction: '',
        cellphone: '',

        formLaboral: 'table',
        personID: this.props.personID,

        laborals: [],

        date_start: '',
        date_end: '',
        documentCode: '',
        documentID: '',
        date_startShow: '',
        date_endShow: '',
    };

    componentDidMount() {
        this.getLaboral(this.state.personID);
    };


    getLaboral(id) {
        const url = app.person + '/' + app.work + '/' + app.persons + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({laborals: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    saveLaboral = () => {
        this.setState({disabled: true})
        const url = app.person + '/' + app.work;
        const {personID, entity, charge, direction, cellphone, documentID, date_start, date_end} = this.state;
        if (personID !== '' && entity !== '' && charge !== '' && direction !== '' && cellphone !== '' && date_start !== '') {
            let data = new FormData();
            data.set('id_person', personID);
            data.set('entity', entity);
            data.set('id_document', documentID);
            data.set('date_start', moment(date_start).format('YYYY-MM-DD hh:mm:ss'));
            date_end && data.set('date_end', date_end ? moment(date_end).format('YYYY-MM-DD hh:mm:ss') : '');
            data.set('charge', charge);
            data.set('direction', direction);
            data.set('cellphone', cellphone);
            axios.post(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getLaboral(personID);
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
    updateLaboral = (id) => {
        this.setState({disabled: true})
        const url = app.person + '/' + app.work + '/' + this.state.currentID;

        const {personID, entity, charge, direction, cellphone, documentID, date_start, date_end} = this.state;
        if (personID !== '' && entity !== '' && charge !== '' && direction !== '' && cellphone !== '' && date_start !== '') {
            let data = new FormData();
            data.set('id_person', personID);
            data.set('id_document', documentID);
            data.set('date_start', moment(date_start).format('YYYY-MM-DD hh:mm:ss'));
            date_end && data.set('date_end', date_end ? moment(date_end).format('YYYY-MM-DD hh:mm:ss') : '');
            data.set('entity', entity);
            data.set('charge', charge);
            data.set('direction', direction);
            data.set('cellphone', cellphone);
            axios.patch(url, data, app.headers).then(() => {
                PNotify.success({
                    title: "Finalizado",
                    text: "Registro actualizado correctamente",
                    delay: 2000
                });
                this.getLaboral(personID);
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

    deleteLaboral(id) {
        const url = app.person + '/' + app.work + '/' + id;
        axios.delete(url, app.headers).then(res => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro eliminado correctamente",
                delay: 2000
            });
            this.getLaboral(this.state.personID);
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
                this.saveLaboral();
            } else {
                this.updateLaboral();
            }

        }
    };
    handleChange = field => event => {
        switch (field) {
            case 'personID':
                this.setState({personID: event.target.value});
                break;
            case 'entity':
                this.setState({entity: event.target.value.replace(/[^ A-Za-záéíóúÁÉÍÓÚÜ0-9-/]/g, '')});
                break;
            case 'charge':
                this.setState({charge: event.target.value.replace(/[^ A-Za-záéíóúÁÉÍÓÚÜ/]/g, '')});
                break;
            case 'direction':
                this.setState({direction: event.target.value.replace(/[^ A-Za-záéíóúÁÉÍÓÚÜ0-9#-/]/g, '')});
                break;
            case 'cellphone':
                this.setState({cellphone: event.target.value.replace(/[^ 0-9/]/g, '').slice(0, 12)});
                break;
            case 'date_start':
                this.setState({date_start: event});
                break;
            case 'date_end':
                this.setState({date_end: event});
                break;
            default:
                break;
        }
    };
    handleOpenModal = () => {
        this.setState({
            formLaboral: 'register',
            action: 'add',
            entity: '',
            charge: '',
            direction: '',
            cellphone: '',
            date_start: '',
            date_end: '',
            documentID: '',
            documentCode: '',
        });

    };
    handleCloseModal = () => {
        this.setState({
            formLaboral: 'table',
            action: 'add',
            disabled: false,
            // aqui se pone todos tus estados para vaciar el formulario
            currentID: '',
            entity: '',
            charge: '',
            direction: '',
            cellphone: '',

        })
    };
    handleClickRetrieveRecord = record => {
        this.setState({
            formLaboral: 'register',
            action: 'update',
            currentID: record.id,
            date_start: record.date_start ? new Date(record.date_start) : '',
            date_end: record.date_end ? new Date(record.date_end) : '',
            documentID: record.id_document,
            documentCode: record.Doc ? record.Doc.code : '',
            entity: record.entity,
            charge: record.charge,
            direction: record.direction,
            cellphone: record.cellphone,
        });
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
                this.deleteLaboral(id);
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

    handleClickshowReadMore = record => {
        this.setState({
            formLaboral: 'readMore',
            entity: record.entity,
            charge: record.charge,
            direction: record.direction,
            cellphone: record.cellphone,
            date_startShow: record.date_start && record.date_start.slice(0, 10),
            date_endShow: record.date_end && record.date_end.slice(0, 10),
            documentCode: record.Doc ? record.Doc.code : 'No definido',
        });
    };

    render() {
        //state frontend
        const {entity, charge, direction, cellphone, laborals} = this.state;

        const {action, disabled, formLaboral, date_start, date_end, documentCode, date_startShow, date_endShow} = this.state;

        return (
            <Card>
                <Card.Body className='d-flex align-items-center justify-content-between'>
                    <h5 className="mb-0">Información Laboral</h5>
                    {formLaboral === 'table' ?
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-0 float-right"
                                onClick={() => this.handleOpenModal()}>
                            <i className='feather icon-plus'/>
                        </button> :
                        <button type="button"
                                className="btn btn-primary btn-sm rounded m-0 float-right"
                                onClick={() => this.handleCloseModal()}>
                            <i className='feather icon-x'/>
                        </button>
                    }
                </Card.Body>

                <Card.Body className={formLaboral === 'table' ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    <Table responsive hover>
                        <thead>
                        <tr className="d-flex">
                            <th className="col-6">Entidad</th>
                            <th className="col-2">Contacto</th>
                            <th className="col-2">Cargo</th>
                            <th className="col-2">Acciones</th>
                        </tr>

                        </thead>
                        <tbody>
                        {laborals.length > 0 &&
                        laborals.map((r, i) => {
                            return (
                                <tr key={i} className="d-flex">
                                    <td className="col-6">
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <h6 className="m-b-0"> {r.entity}</h6>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-2">
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <p className="m-b-0"> {r.cellphone}</p>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-2">
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                <p className="m-b-0"> {r.charge}</p>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-2">
                                        <IconButton
                                            size="small"
                                            aria-label="Ver más"
                                            onClick={() => this.handleClickshowReadMore(r)}
                                        >
                                            <i className="material-icons text-primary">remove_red_eye</i>
                                        </IconButton>
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
                <Card.Body className={formLaboral === 'register' ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Entidad</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   autoComplete='off'
                                   placeholder="Entidad"
                                   value={entity}
                                   id="entity"
                                   onChange={this.handleChange('entity')}
                            />
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Cargo</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   autoComplete='off'
                                   placeholder="Cargo"
                                   value={charge}
                                   id="charge"
                                   onChange={this.handleChange('charge')}
                            />
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Dirección</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   autoComplete='off'
                                   placeholder="Dirección"
                                   value={direction}
                                   id="direction"
                                   onChange={this.handleChange('direction')}
                            />
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Celular</label>
                        <Col sm={9}>
                            <input type="text" className="form-control"
                                   autoComplete='off'
                                   placeholder="Celular"
                                   value={cellphone}
                                   id="cellphone"
                                   onChange={this.handleChange('cellphone')}
                            />
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Fecha inicio / fin</label>
                        <Col sm={9}>
                            <Row>
                                <Col sm={6}>
                                    <DatePickerStyled>
                                        <DatePicker
                                            selected={date_start}
                                            todayButton={"Hoy"}
                                            onChange={this.handleChange('date_start')}
                                            className="form-control"
                                            isClearable
                                            maxDate={date_end}
                                            placeholderText="Fecha inicio"
                                        />
                                    </DatePickerStyled>
                                </Col>
                                <Col sm={6}>
                                    <DatePickerStyled>
                                        <DatePicker
                                            selected={date_end}
                                            todayButton={"Hoy"}
                                            onChange={this.handleChange('date_end')}
                                            className="form-control"
                                            isClearable
                                            minDate={date_start}
                                            placeholderText="Fecha fin"
                                        />
                                    </DatePickerStyled>
                                </Col>
                            </Row>
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
                    {action === 'add' ?
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.saveLaboral()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar</Button> :
                        <Button
                            className="pull-right"
                            disabled={disabled}
                            variant="primary"
                            onClick={() => this.updateLaboral()}>
                            {disabled && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                            Guardar Cambios</Button>
                    }
                </Card.Body>
                <Card.Body className={formLaboral === 'readMore' ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Entidad</label>
                        <Col sm={9}><p>{entity}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Cargo</label>
                        <Col sm={9}><p>{charge}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Dirección</label>
                        <Col sm={9}><p>{direction}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label className="col-sm-3 col-form-label font-weight-bolder">Celular</label>
                        <Col sm={9}><p>{cellphone}</p></Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Fecha inicio</label>
                        <Col sm={3}>
                            <p>{date_startShow}</p>
                        </Col>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Fecha Fin</label>
                        <Col sm={3}>
                            <p>{date_endShow}</p>
                        </Col>
                    </Row>
                    <Row className='form-group'>
                        <label
                            className="col-sm-3 col-form-label font-weight-bolder">Documento</label>
                        <Col sm={9}>
                            <p>{documentCode}</p>
                        </Col>
                    </Row>
                </Card.Body>


                <DTDocuments
                    personDNI={this.props.personDNI}
                    handleClickSelectDocument={this.handleClickSelectDocument}
                    ref={(ref) => this.DTDocuments = ref}/>

            </Card>
        )
    }
}
