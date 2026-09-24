import React from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import axios from 'axios';
import PNotify from 'pnotify/dist/es/PNotify';
import app from '../../../../Constants';

class FormAuthority extends React.Component {
    state = {
        loader: false,
        formModalAuthority: false,
        authority: null,
        id: '',
        id_organic_unit: '',
        person: '',
        charge: '',
        type: 'G',
        valid_from: '',
        valid_to: ''
    };

    componentDidUpdate(prevProps) {
        if (prevProps.formModalAuthority !== this.props.formModalAuthority) {
            this.setState({formModalAuthority: this.props.formModalAuthority});
        }
        if (prevProps.authority !== this.props.authority) {
            const authority = this.props.authority;
            this.setState(authority ? {
                authority,
                id: authority.id,
                id_organic_unit: authority.id_organic_unit,
                person: authority.person || '',
                charge: authority.charge || '',
                type: authority.type || 'G',
                valid_from: authority.valid_from ? authority.valid_from.substring(0, 10) : '',
                valid_to: authority.valid_to ? authority.valid_to.substring(0, 10) : ''
            } : {
                authority: null,
                id: '',
                id_organic_unit: '',
                person: '',
                charge: '',
                type: 'G',
                valid_from: '',
                valid_to: ''
            });
        }
    }

    closeForm = () => {
        this.props.closeFormModalAuthority();
        this.setState({authority: null, id: '', id_organic_unit: '', person: '', charge: '', type: 'G', valid_from: '', valid_to: ''});
    };

    handleChange = field => event => this.setState({[field]: event.target.value});

    save = async () => {
        const {id, id_organic_unit, person, charge, type, valid_from, valid_to} = this.state;
        if (!id_organic_unit || !person || !charge || !type || !valid_from) {
            return PNotify.notice({title: 'Advertencia', text: 'Complete los campos obligatorios', delay: 2000});
        }
        if (valid_to && valid_to < valid_from) {
            return PNotify.notice({title: 'Advertencia', text: 'La fecha de fin no puede ser anterior a la fecha de inicio', delay: 2000});
        }
        this.setState({loader: true});
        const data = new FormData();
        data.set('id_organic_unit', id_organic_unit);
        data.set('person', person);
        data.set('charge', charge);
        data.set('type', type);
        data.set('valid_from', valid_from);
        data.set('valid_to', valid_to);
        try {
            const url = app.general + '/' + app.authority + (id ? '/' + id : '');
            const res = id
                ? await axios.patch(url, data, app.headers)
                : await axios.post(url, data, app.headers);
            PNotify.success({title: 'Finalizado', text: res.data.message, delay: 2000});
            this.props.callDataAuthority();
            this.setState({loader: false});
            this.closeForm();
        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: 'Oh no!', text: (err.response && err.response.data && err.response.data.message) || 'No se pudo guardar la autoridad', delay: 3000});
        }
    };

    render() {
        const {loader, id, id_organic_unit, person, charge, type, valid_from, valid_to} = this.state;
        const {organicUnits} = this.props;
        return <Modal show={this.state.formModalAuthority} size="lg">
            <Modal.Header className="bg-primary">
                <Modal.Title as="h5" style={{color: '#ffffff'}}>{id ? 'ACTUALIZAR AUTORIDAD' : 'REGISTRAR AUTORIDAD'}</Modal.Title>
                <div className="d-inline-block pull-right"><span type="button" onClick={this.closeForm}><i className="feather icon-x" style={{fontSize: '20px', color: 'white'}} /></span></div>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}><Form.Group><Form.Label>Unidad orgánica</Form.Label><Form.Control as="select" value={id_organic_unit} onChange={this.handleChange('id_organic_unit')}><option value="">Seleccione</option>{organicUnits.map(unit => <option key={unit.id} value={unit.id}>{unit.denomination}</option>)}</Form.Control></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Tipo</Form.Label><Form.Control as="select" value={type} onChange={this.handleChange('type')}><option value="G">General (G)</option><option value="A">Académica (A)</option><option value="U">Unidad de Segunda Especialidad (U)</option><option value="S">Secretaría (S)</option></Form.Control></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Nombre completo</Form.Label><Form.Control value={person} onChange={this.handleChange('person')} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Cargo</Form.Label><Form.Control value={charge} onChange={this.handleChange('charge')} placeholder="Ej.: Directora, Decana o Coordinador" /><Form.Text className="text-muted">El documento añadirá automáticamente “de la” y la unidad orgánica seleccionada.</Form.Text></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Vigente desde</Form.Label><Form.Control type="date" value={valid_from} onChange={this.handleChange('valid_from')} /></Form.Group></Col>
                    <Col md={6}><Form.Group><Form.Label>Vigente hasta (opcional)</Form.Label><Form.Control type="date" value={valid_to} onChange={this.handleChange('valid_to')} /></Form.Group></Col>
                </Row>
                <Button className="pull-right" disabled={loader} variant="primary" onClick={this.save}>{loader && <span className="spinner-border spinner-border-sm mr-1" role="status" />}{id ? 'Guardar cambios' : 'Guardar'}</Button>
            </Modal.Body>
        </Modal>;
    }
}

export default FormAuthority;
