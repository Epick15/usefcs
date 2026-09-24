import React from 'react';
import {Button, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
import Fingerprint from "@material-ui/icons/Fingerprint";
import Close from "@material-ui/icons/Close";
import $ from 'jquery';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";
import Attachment from "@material-ui/icons/Attachment";
import generator from "voucher-code-generator";
import defaultUser from "../../../../../assets/images/user/default.jpg";
import program from "../../../Student/Program";
import component from "../../../../Component";

moment.locale('es');
const token = localStorage.getItem('TOKEN') || null;

class AccesProject extends React.Component {
    state = {

        projectName: '',

        action: 'add',
        studentID: '',
        stateUpload: false,
        formProject: false,

        resolutionJury: '',
        resolutionDate: '',
        fileNameResolutionJury: '',
        fileResolutionJury: '',


        fileNameProject: '',
        fileProject: '',


        student: '',
        studentName: '',
        students: [],


        adviser: '',
        adviserName: '',
        advisers: [],

        president: '',
        presidentName: '',
        presidents: [],

        secretary: '',
        secretaryName: '',
        secretarys: [],

        vocal: '',
        vocalName: '',
        vocals: [],

        program: '',
        programs: []
    };

    async componentDidMount() {

        if (this.props.dataRetrive) {
            this.retriveData(this.props.dataRetrive)
        }

    };


    retriveData(r) {
        console.log(r)
        this.setState({
            action: 'update',
            projectID: r.id_project,
            student: r.id_student,
            studentName: r.student_name,
            adviserName: r.adviser_name,
            adviser: r.id_adviser,
            presidentName: r.president_name,
            president: r.id_president,
            secretaryName: r.secretary_name,
            secretary: r.id_secretary,
            vocalName: r.vocal_name,
            vocal: r.id_vocal,
            program: r.id_program,
            resolutionDate: r.resolution_jury_date,
            fileNameResolutionJury: r.resolution_jury_file,
            resolutionJury: r.resolution_jury,
            projectName: r.project_name,
            fileNameProject: r.project_file,


        })
    }


    async createUserProject(id, type) {


        this.setState({loader: true});
        if (id !== '' && type !== '') {
            const url = app.intranet + '/' + app.userIntranet;
            let data = new FormData();
            data.set('id_person', id);
            data.set('type', type);
            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({loader: false});
                component.Notify('success', res.data.message);
            } catch (err) {

                this.setState({loader: false});
                component.Notify('error', err.response);

            }

        } else {
            this.setState({loader: false});
            component.Notify('notice', 'Complete los campos obligatorios"');
        }

    };


    render() {

        const {
            projectName,
            resolutionJury,
            resolutionDate,
            fileNameResolutionJury,

            program,
            programs,
            student,
            studentName,
            students,


            adviser,
            adviserName,
            advisers,

            president,
            presidentName,
            presidents,

            secretary,
            secretaryName,
            secretarys,

            vocal,
            vocalName,
            vocals,
            formProject, file, fileName, fileNameProject
        } = this.state;

        return (<>
                {this.state.loader && component.spiner}

                <Modal show={true} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>Generar Acesos</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}} onClick={() => this.props.closeAccessProject()}/>

                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={studentName === "" ? {color: "#ff5252 "} : null}
                                    >Estudiante<small
                                        className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="student"
                                        readOnly={true}
                                        value={studentName}
                                        placeholder="Buscar"
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                        <button

                                            id={'generate-' + this.state.student}
                                            onClick={() => this.createUserProject(this.state.student, 'Estudiante')}

                                            type="button"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#7b7f84',
                                                marginTop: '-30px',
                                                float: 'right'
                                            }}
                                            className=" btn btn-dark"><Fingerprint
                                            style={{color: "#00793d"}}/></button>
                                    </OverlayTrigger>


                                </Form.Group>

                            </Col>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={adviserName === "" ? {color: "#ff5252 "} : null}
                                    >Asesor<small
                                        className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="student"
                                        readOnly={true}
                                        value={adviserName}
                                        placeholder="Buscar"
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                        <button
                                            id={'generate-' + this.state.adviser}
                                            onClick={() => this.createUserProject(this.state.adviser, 'Docente')}
                                            type="button"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#7b7f84',
                                                marginTop: '-30px',
                                                float: 'right'
                                            }}
                                            className=" btn btn-dark"><Fingerprint
                                            style={{color: "#00793d"}}/></button>
                                    </OverlayTrigger>


                                </Form.Group>

                            </Col>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={presidentName === "" ? {color: "#ff5252 "} : null}
                                    >Presidente<small
                                        className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="president"
                                        readOnly={true}
                                        value={presidentName}
                                        placeholder="Buscar"
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                        <button
                                            id={'generate-' + this.state.president}
                                            onClick={() => this.createUserProject(this.state.president, 'Docente')}
                                            type="button"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#7b7f84',
                                                marginTop: '-30px',
                                                float: 'right'
                                            }}
                                            className=" btn btn-dark"><Fingerprint
                                            style={{color: "#00793d"}}/></button>
                                    </OverlayTrigger>


                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={secretaryName === "" ? {color: "#ff5252 "} : null}
                                    >Secretario<small
                                        className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="secretary"
                                        readOnly={true}
                                        value={secretaryName}
                                        placeholder="Buscar"
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                        <button
                                            id={'generate-' + this.state.secretary}
                                            onClick={() => this.createUserProject(this.state.secretary, 'Docente')}
                                            type="button"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#7b7f84',
                                                marginTop: '-30px',
                                                float: 'right'
                                            }}
                                            className=" btn btn-dark"><Fingerprint
                                            style={{color: "#00793d"}}/></button>
                                    </OverlayTrigger>


                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={vocalName === "" ? {color: "#ff5252 "} : null}
                                    >Vocal<small
                                        className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="vocal"
                                        readOnly={true}
                                        value={vocalName}
                                        placeholder="Buscar"
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                        <button
                                            id={'generate-' + this.state.vocal}
                                            onClick={() => this.createUserProject(this.state.vocal, 'Docente')}
                                            type="button"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#7b7f84',
                                                marginTop: '-30px',
                                                float: 'right'
                                            }}
                                            className=" btn btn-dark"><Fingerprint
                                            style={{color: "#00793d"}}/></button>
                                    </OverlayTrigger>


                                </Form.Group>

                            </Col>


                        </Row>


                    </Modal.Body>
                </Modal>
            </>

        );
    }
}

export default AccesProject;
