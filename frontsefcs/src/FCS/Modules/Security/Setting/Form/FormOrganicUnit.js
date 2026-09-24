import React from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import axios from 'axios';
import PNotify from 'pnotify/dist/es/PNotify';
import app from '../../../../Constants';

class FormOrganicUnit extends React.Component {
    state = {loader: false, visible: false, record: null, denomination: '', abbreviation: '', id_campus: ''};

    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible || prevProps.record !== this.props.record) {
            const record = this.props.record;
            this.setState({visible: this.props.visible, record, denomination: record ? record.denomination || '' : '', abbreviation: record ? record.abbreviation || '' : '', id_campus: record ? record.id_campus || '' : ''});
        }
    }

    close = () => this.props.closeFormModalOrganicUnit();
    change = field => event => this.setState({[field]: event.target.value});

    save = async () => {
        const {record, denomination, abbreviation, id_campus} = this.state;
        if (!record || !denomination.trim() || !abbreviation.trim() || !id_campus) return PNotify.notice({title: 'Advertencia', text: 'Complete los campos obligatorios', delay: 2000});
        this.setState({loader: true});
        const data = new FormData();
        data.set('denomination', denomination.trim());
        data.set('abbreviation', abbreviation.trim());
        data.set('id_campus', id_campus);
        data.set('id_parent', record.id_parent || '');
        data.set('id_type_organic_unit', record.id_type_organic_unit);
        try {
            const res = await axios.patch(app.general + '/' + app.organicUnit + '/' + record.id, data, app.headers);
            PNotify.success({title: 'Finalizado', text: res.data.message, delay: 2000});
            this.props.callDataOrganicUnit();
            this.close();
        } catch (err) {
            PNotify.error({title: 'Oh no!', text: (err.response && err.response.data && err.response.data.message) || 'No se pudo actualizar la unidad orgánica', delay: 3000});
        } finally {
            this.setState({loader: false});
        }
    };

    render() {
        const {loader, visible, record, denomination, abbreviation, id_campus} = this.state;
        const {campuses = []} = this.props;
        return <Modal show={visible} onHide={this.close}>
            <Modal.Header closeButton className="bg-primary"><Modal.Title as="h5" style={{color: '#fff'}}>EDITAR UNIDAD ORGÁNICA</Modal.Title></Modal.Header>
            <Modal.Body><Row>
                <Col md={12}><Form.Group><Form.Label>Descripción</Form.Label><Form.Control value={denomination} onChange={this.change('denomination')} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Abreviatura</Form.Label><Form.Control value={abbreviation} onChange={this.change('abbreviation')} /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Sede</Form.Label><Form.Control as="select" value={id_campus} onChange={this.change('id_campus')}><option value="">Seleccione</option>{campuses.map(campus => <option key={campus.id} value={campus.id}>{campus.denomination}</option>)}</Form.Control></Form.Group></Col>
            </Row>{record && <small className="text-muted">El tipo y la dependencia jerárquica se conservan sin cambios.</small>}</Modal.Body>
            <Modal.Footer><Button variant="secondary" onClick={this.close}>Cancelar</Button><Button disabled={loader} variant="primary" onClick={this.save}>{loader ? 'Guardando...' : 'Guardar cambios'}</Button></Modal.Footer>
        </Modal>;
    }
}

export default FormOrganicUnit;
