import React from 'react';
import {Button, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
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
import crypt from "node-cryptex";

moment.locale('es');
const token = localStorage.getItem('TOKEN') || null;

class FormProject extends React.Component {
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
        this.listSimpleProgramByOrganicUnitRegisterID(this.props.organicUnit)
        if (this.props.dataRetrive) {
            this.retriveData(this.props.dataRetrive)
        }

    };

    componentDidUpdate(prevProps, prevState) {

    }

    async listSimpleProgramByOrganicUnitRegisterID(id) {
        this.setState({programsLoader: true});
        const url = app.programs + '/' + app.program + '/s-' + app.organicUnit + '-register/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({programs: res.data});
            }
            this.setState({programsLoader: false})

        } catch (err) {
            this.setState({programsLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Programas de estudio", delay: 2000});
            console.log(err)

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

    searchStudentProgram(program, params) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/student-search-program/' + program + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) this.setState({students: res.data})
                }).catch(err => {
                    PNotify.error({
                        title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                    });
                    console.log(err)
                })
            }

        }

    };

    searchPerson(params, type) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/search-person' + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) {
                        if (type === 'adviser') {
                            this.setState({advisers: res.data})
                        }
                        if (type === 'president') {
                            this.setState({presidents: res.data})
                        }
                        if (type === 'secretary') {
                            this.setState({secretarys: res.data})
                        }
                        if (type === 'vocal') {
                            this.setState({vocals: res.data})
                        }
                    }
                }).catch(err => {
                    PNotify.error({
                        title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                    });
                    console.log(err)
                })
            }

        }

    };

    handleChange = field => event => {

        switch (field) {

            case 'studentName':
                this.searchStudentProgram(this.state.program, event.target.value)
                this.setState({studentName: event.target.value});
                break;


            case 'adviserName':
                this.searchPerson(event.target.value, 'adviser')
                this.setState({adviserName: event.target.value});
                break;
            case 'presidentName':
                this.searchPerson(event.target.value, 'president')
                this.setState({presidentName: event.target.value});
                break;
            case 'secretaryName':
                this.searchPerson(event.target.value, 'secretary')
                this.setState({secretaryName: event.target.value});
                break;
            case 'vocalName':
                this.searchPerson(event.target.value, 'vocal')
                this.setState({vocalName: event.target.value});
                break;


            case 'program':
                this.setState({program: event.target.value});
                break;
            case 'projectName':
                this.setState({projectName: event.target.value});
                break;

            case 'resolutionDate':
                this.setState({resolutionDate: event.target.value});
                break;
            case 'resolutionJury':
                this.setState({resolutionJury: event.target.value});
                break;

            default:
                break;
        }
    };

    selectectPerson = (r, type) => {
        if (type === 'student') {
            console.log(r)
            this.setState({
                student: r.Student.id,
                studentName: r.name + ' / ' + r.document_number,
                students: [],
            })
        }
        if (type === 'adviser') {
            this.setState({
                adviser: r.id,
                adviserName: r.name + ' / ' + r.document_number,
                advisers: [],
            })
        }
        if (type === 'president') {
            this.setState({
                president: r.id,
                presidentName: r.name + ' / ' + r.document_number,
                presidents: [],
            })
        }
        if (type === 'secretary') {
            this.setState({
                secretary: r.id,
                secretaryName: r.name + ' / ' + r.document_number,
                secretarys: [],
            })
        }
        if (type === 'vocal') {
            this.setState({
                vocal: r.id,
                vocalName: r.name + ' / ' + r.document_number,
                vocals: [],
            })
        }

    };

    closeSelectectPerson = (type) => {

        if (type === 'student') {
            this.setState({
                student: '',
                studentName: '',
                students: [],
            })
        }
        if (type === 'adviser') {
            this.setState({
                adviser: '',
                adviserName: '',
                advisers: [],
            })
        }
        if (type === 'president') {
            this.setState({
                president: '',
                presidentName: '',
                presidents: [],
            })
        }
        if (type === 'secretary') {
            this.setState({
                secretary: '',
                secretaryName: '',
                secretarys: [],
            })
        }
        if (type === 'vocal') {
            this.setState({
                vocal: '',
                vocalName: '',
                vocals: [],
            })
        }
    };


    showFileManager = () => {
        const input = '#fileResolutionJury';
        $(input).click();
    };
    handleChangeFileInput = event => {
        const fileExtension = ['pdf'];
        const input = '#fileResolutionJury';
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
                prefix: this.state.student + 'RES' + moment().format('YYYYMhms'),
                count: 1,
                charset: generator.charset('numbers')
            });
            reader.onload = () => {
                this.setState({fileResolutionJury: file, fileNameResolutionJury: code});
            };
            reader.readAsDataURL(file);
        }
    };
    clearFiles = () => {
        this.setState({
            fileResolutionJury: '',
            fileNameResolutionJury: ''
        });
        if (this.state.action === 'update') {
            this.setState({
                changed: 'si'
            })
        }
    };

    showFileManager2 = () => {
        const input = '#fileProject';
        $(input).click();
    };
    handleChangeFileInput2 = event => {
        const fileExtension = ['pdf'];
        const input = '#fileProject';
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
                prefix: this.state.student + 'P' + moment().format('YYYYMhms'),
                count: 1,
                charset: generator.charset('numbers')
            });
            reader.onload = () => {
                this.setState({fileProject: file, fileNameProject: code});
            };
            reader.readAsDataURL(file);
        }
    };
    clearFiles2 = () => {
        this.setState({
            fileProject: '',
            fileNameProject: ''
        });
        if (this.state.action === 'update') {
            this.setState({
                changed: 'si'
            })
        }
    };


    async createProjectTesis() {
        this.setState({loader: true});
        const {
            resolutionJury,
            fileNameResolutionJury,
            resolutionDate,
            fileResolutionJury,

            //
            projectName,
            fileNameProject,
            fileProject,
            //
            program,
            student,
            adviser,
            president,
            secretary,
            vocal,
        } = this.state;
        const {organicUnit} = this.props
        if (resolutionJury !== '' && fileNameResolutionJury !== '' && resolutionDate !== '' && fileResolutionJury !== '' && organicUnit !== '' &&
            projectName !== '' && fileNameProject !== '' && fileProject !== '' &&
            program !== '' && student !== '' && adviser !== president !== '' && secretary !== '' && vocal !== '') {
            const url = app.programs + '/project-tesis';
            let data = new FormData();

            data.set('id_student', student);
            data.set('id_adviser', adviser);
            data.set('id_president', president);
            data.set('id_secretary', secretary);
            data.set('id_vocal', vocal);
            data.set('id_program', program);
            data.set('id_organic_unit', organicUnit);

            data.set('resolution_jury_date', resolutionDate);
            data.set('file_resolution_jury', fileResolutionJury);
            data.set('resolution_jury_name', resolutionJury);
            data.set('file_name_resolution_jury', fileNameResolutionJury);


            data.set('project_name', projectName);
            data.set('file_name_project', fileNameProject);
            data.set('file_project', fileProject);


            try {
                const res = await axios.post(url, data, app.headers);
                // this.props.callDataMaterialEgress();
                // this.closeForm();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateProjectTesis() {
        this.setState({loader: true});

        const {
            resolutionJury,
            fileNameResolutionJury,
            resolutionDate,
            fileResolutionJury,
            //
            projectName,
            fileNameProject,
            fileProject,
            //
            program,
            student,
            adviser,
            president,
            secretary,
            vocal,
        } = this.state;
        console.log(resolutionJury,
            fileNameResolutionJury,
            resolutionDate,
            fileResolutionJury,
            //
            projectName,
            fileNameProject,
            fileProject,
            //
            program,
            student,
            adviser,
            president,
            secretary,
            vocal,)
        if (resolutionJury !== '' && fileNameResolutionJury !== '' && resolutionDate !== '' &&
            projectName !== '' && fileNameProject !== '' &&
            program !== '' && student !== '' && adviser !== president !== '' && secretary !== '' && vocal !== '') {
            const url = app.programs + '/project-tesis/' + this.state.projectID;
            let data = new FormData();

            data.set('id_student', student);
            data.set('id_adviser', adviser);
            data.set('id_president', president);
            data.set('id_secretary', secretary);
            data.set('id_vocal', vocal);
            data.set('id_program', program);

            data.set('resolution_jury_date', resolutionDate);
            data.set('file_resolution_jury', fileResolutionJury);
            data.set('resolution_jury_name', resolutionJury);
            data.set('file_name_resolution_jury', fileNameResolutionJury);


            data.set('project_name', projectName);
            data.set('file_name_project', fileNameProject);
            data.set('file_project', fileProject);


            try {
                const res = await axios.post(url, data, app.headers);
                // this.props.callDataMaterialEgress();
                // this.closeForm();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
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


                <Modal show={true} backdrop="static" size={"xl"}>
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>PROYECTO DE TESIS</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}} onClick={() => this.props.closeFormProject()}/>

                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>

                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Nombre del proyecto</Form.Label>
                                            <Form.Control
                                                type="text"
                                                as="textarea" rows="4"
                                                value={projectName}
                                                name={"projectName"}
                                                onKeyPress={this.handleKeyPress}
                                                onChange={this.handleChange('projectName')}
                                                placeholder="Nombre del proyecto"
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{paddingBottom: '14px'}}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={program === "" ? {color: "#ff5252 "} : null}
                                            >Programa<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control as="select"
                                                          value={program}
                                                          onChange={this.handleChange('program')}
                                            >

                                                <option defaultValue={true} hidden>Programa</option>
                                                {
                                                    programs.length > 0 ?
                                                        programs.map((r, k) => {

                                                                return (<option id={"programmask-" + r.id}
                                                                                dataprogrammask={r.denomination}
                                                                                value={r.id}
                                                                                key={k}> {r.denomination} </option>)

                                                            }
                                                        ) :
                                                        <option value={false} disabled>No se encontraron datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={studentName === "" ? {color: "#ff5252 "} : null}
                                            >Buscar Estudiante (Nombres / Dni)<small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="student"
                                                value={studentName}
                                                onChange={this.handleChange('studentName')}
                                                placeholder="Buscar"
                                                margin="normal"
                                            />
                                            {studentName ?
                                                <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectPerson('student')}
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
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger> : <></>

                                            }


                                            <Table hover responsive style={{marginTop: '-1px'}}>
                                                <tbody>
                                                {students.length > 0 && students.map((r, i) => {
                                                    return (
                                                        <tr key={i} onClick={() => this.selectectPerson(r, 'student')}>
                                                            <td scope="row">
                                                                <h6 className="m-b-0"> {r.name}</h6>
                                                                <p className="m-b-0"> {r.document_number} </p>

                                                            </td>
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </Table>

                                        </Form.Group>

                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={adviserName === "" ? {color: "#ff5252 "} : null}
                                            >Buscar Asesor (Nombres / Dni)<small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="student"
                                                value={adviserName}
                                                onChange={this.handleChange('adviserName')}
                                                placeholder="Buscar"
                                                margin="normal"
                                            />
                                            {adviserName ?
                                                <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectPerson('adviser')}
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
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger> : <></>

                                            }


                                            <Table hover responsive style={{marginTop: '-1px'}}>
                                                <tbody>
                                                {advisers.length > 0 && advisers.map((r, i) => {
                                                    return (
                                                        <tr key={i} onClick={() => this.selectectPerson(r, 'adviser')}>
                                                            <td scope="row">
                                                                <h6 className="m-b-0"> {r.name}</h6>
                                                                <p className="m-b-0"> {r.document_number} </p>

                                                            </td>
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </Table>

                                        </Form.Group>

                                    </Col>

                                </Row>

                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Resolución de Asignacion de
                                                Jurados</Form.Label>
                                            <Form.Control
                                                type="text"

                                                value={resolutionJury}
                                                name={"resolutionJury"}
                                                onKeyPress={this.handleKeyPress}
                                                onChange={this.handleChange('resolutionJury')}
                                                placeholder="Nombre del proyecto"
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"

                                            >Fecha de Resolución <small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="date"
                                                className="form-control"
                                                onChange={this.handleChange('resolutionDate')}
                                                max="2999-12-31"
                                                value={resolutionDate}
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={presidentName === "" ? {color: "#ff5252 "} : null}
                                            >Buscar Presidente (Nombres / Dni)<small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="president"
                                                value={presidentName}
                                                onChange={this.handleChange('presidentName')}
                                                placeholder="Buscar"
                                                margin="normal"
                                            />
                                            {presidentName ?
                                                <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectPerson('president')}
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
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger> : <></>

                                            }


                                            <Table hover responsive style={{marginTop: '-1px'}}>
                                                <tbody>
                                                {presidents.length > 0 && presidents.map((r, i) => {
                                                    return (
                                                        <tr key={i}
                                                            onClick={() => this.selectectPerson(r, 'president')}>
                                                            <td scope="row">
                                                                <h6 className="m-b-0"> {r.name}</h6>
                                                                <p className="m-b-0"> {r.document_number} </p>

                                                            </td>
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </Table>

                                        </Form.Group>

                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={secretaryName === "" ? {color: "#ff5252 "} : null}
                                            >Buscar Secretario (Nombres / Dni)<small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="secretary"
                                                value={secretaryName}
                                                onChange={this.handleChange('secretaryName')}
                                                placeholder="Buscar"
                                                margin="normal"
                                            />
                                            {secretaryName ?
                                                <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectPerson('secretary')}
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
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger> : <></>

                                            }


                                            <Table hover responsive style={{marginTop: '-1px'}}>
                                                <tbody>
                                                {secretarys.length > 0 && secretarys.map((r, i) => {
                                                    return (
                                                        <tr key={i}
                                                            onClick={() => this.selectectPerson(r, 'secretary')}>
                                                            <td scope="row">
                                                                <h6 className="m-b-0"> {r.name}</h6>
                                                                <p className="m-b-0"> {r.document_number} </p>

                                                            </td>
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </Table>

                                        </Form.Group>

                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={vocalName === "" ? {color: "#ff5252 "} : null}
                                            >Buscar Vocal (Nombres / Dni)<small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="vocal"
                                                value={vocalName}
                                                onChange={this.handleChange('vocalName')}
                                                placeholder="Buscar"
                                                margin="normal"
                                            />
                                            {vocalName ?
                                                <OverlayTrigger
                                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                                    <button
                                                        onClick={() => this.closeSelectectPerson('vocal')}
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
                                                        className=" btn btn-dark"><Close
                                                        style={{color: "dark"}}/></button>
                                                </OverlayTrigger> : <></>

                                            }


                                            <Table hover responsive style={{marginTop: '-1px'}}>
                                                <tbody>
                                                {vocals.length > 0 && vocals.map((r, i) => {
                                                    return (
                                                        <tr key={i}
                                                            onClick={() => this.selectectPerson(r, 'vocal')}>
                                                            <td scope="row">
                                                                <h6 className="m-b-0"> {r.name}</h6>
                                                                <p className="m-b-0"> {r.document_number} </p>

                                                            </td>
                                                        </tr>)
                                                })}
                                                </tbody>
                                            </Table>

                                        </Form.Group>

                                    </Col>


                                </Row>
                            </Col>


                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <hr/>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Projecto (Archivo.pdf)<small
                                        className="text-danger"> *</small></Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            style={{marginTop: "3px"}}
                                            type="text"
                                            autoComplete='off'
                                            value={fileNameProject}
                                            disabled={fileNameProject ? true : false}
                                            onChange={this.handleChange('fileNameProject')}
                                            onClick={this.showFileManager2}
                                            placeholder="Seleccione un archivo"
                                            margin="normal"
                                        />
                                        {fileNameProject ? <InputGroup.Append>
                                            <OverlayTrigger
                                                overlay={<Tooltip
                                                    style={{zIndex: 100000000}}>Limpiar</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px',
                                                    marginTop: '-2px',
                                                    position: 'relative',
                                                    zIndex: 100,
                                                    fontSize: '20px',
                                                    padding: '0',
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                }}>
                                                    <i onClick={this.clearFiles2}
                                                       className="text-danger feather icon-x-circle"/>
                                                </button>

                                            </OverlayTrigger>


                                        </InputGroup.Append> : <InputGroup.Append>
                                            <OverlayTrigger
                                                overlay={<Tooltip
                                                    style={{zIndex: 100000000}}>Archivo</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px',
                                                    marginTop: '-2px',
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

                                        </InputGroup.Append>}
                                    </InputGroup>
                                    <input
                                        type="file"
                                        style={{display: 'none'}}
                                        name="fileProject"
                                        id="fileProject"
                                        onChange={(event) => this.handleChangeFileInput2(event)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Resolución (Archivo.pdf)<small
                                        className="text-danger"> *</small></Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            style={{marginTop: "3px"}}
                                            type="text"
                                            autoComplete='off'
                                            value={fileNameResolutionJury}
                                            disabled={fileNameResolutionJury ? true : false}
                                            onChange={this.handleChange('fileNameResolutionJury')}
                                            onClick={this.showFileManager}
                                            placeholder="Seleccione un archivo"
                                            margin="normal"
                                        />
                                        {fileNameResolutionJury ? <InputGroup.Append>
                                            <OverlayTrigger
                                                overlay={<Tooltip
                                                    style={{zIndex: 100000000}}>Limpiar</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px',
                                                    marginTop: '-2px',
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


                                        </InputGroup.Append> : <InputGroup.Append>
                                            <OverlayTrigger
                                                overlay={<Tooltip
                                                    style={{zIndex: 100000000}}>Archivo</Tooltip>}>
                                                <button style={{
                                                    marginLeft: '-25px',
                                                    marginTop: '-2px',
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

                                        </InputGroup.Append>}
                                    </InputGroup>
                                    <input
                                        type="file"
                                        style={{display: 'none'}}
                                        name="fileResolutionJury"
                                        id="fileResolutionJury"
                                        onChange={(event) => this.handleChangeFileInput(event)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                {this.state.action == 'add' ?
                                    <Button
                                        className="pull-right"
                                        variant="primary"
                                        onClick={() => this.createProjectTesis()}>
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        variant="primary"
                                        onClick={() => this.updateProjectTesis()}>
                                        Actualizar</Button>


                                }


                            </Col>
                        </Row>

                    </Modal.Body>
                </Modal>
            </>

        );
    }
}

export default FormProject;
