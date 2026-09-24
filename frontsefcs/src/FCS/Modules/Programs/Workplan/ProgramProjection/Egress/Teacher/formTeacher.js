import React from 'react';
import {Button,  Col, Form, InputGroup, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';
import app from "../../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Close from "@material-ui/icons/Close";


import Swal from "sweetalert2";
import defaultUser from "../../../../../../../assets/images/user/default.jpg";
import $ from 'jquery';

moment.locale('es');


class FormTeacher extends React.Component {
    state = {

        action: "add",
        priceHour: 0,
        numberMonth: 12,
        concept: "",
        observation: "",
        person: "",
        course: "",
        totalHour: "",
        conceptMask: "",
        searchA: "",
        subTotal: "",
        studyPlanID: this.props.studyPlanID,
        formTeacher: this.props.formTeacher,
        retriveTeacher: this.props.retriveTeacher,
        deleteTeacherID: this.props.deleteTeacherID,
        concepts: [],
        persons: [],
        courses: [],

    };

    async componentDidMount() {
        this.listConceptByDescription();
        this.listCourseByPlanID(this.props.studyPlanID)
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.formTeacher !== this.props.formTeacher) {
            this.setState({formTeacher: this.props.formTeacher});
        }
        if (prevProps.retriveTeacher !== this.props.retriveTeacher) {
            this.props.retriveTeacher && this.retriveForm(this.props.retriveTeacher)
        }
        if (prevProps.deleteTeacherID !== this.props.deleteTeacherID) {
            this.props.deleteTeacherID !== "" && this.openEntrySweetAlert(this.props.deleteTeacherID)
        }
    }

    async listConceptByDescription() {
        try {
            const url = app.general + '/' + app.concepts + '/des/Pago a docentes';
            const res = await axios.get(url, app.headers);
            this.setState({concept: res.data.id, conceptMask: res.data.denomination});
        } catch (err) {
            console.log('We have the error', err);
        }
    };

    async listCourseByPlanID(STUDYPLANID) {
        try {
            const url = app.programs + '/' + app.cycle + '/' + STUDYPLANID + '/' + app.course;
            const res = await axios.get(url, app.headers);
            this.setState({courses: res.data})

        } catch (err) {
            console.log('We have the error', err);
        }
    };

    async searchPersonTeacher(params) {
        try {
            if (params !== '') {
                const url = app.person + '/search-person-t' + params;
                const res = await axios.get(url, app.headers);
                this.setState({persons: res.data});
                return res;
            } else {
                return null
            }
        } catch (err) {
            console.log('We have the error', err);
            return err;
        }
    };

    async createEgressTeacher(workPlanID) {
        this.setState({loaderTeacher: true});

        const {concept, course, priceHour, person, observation, totalHour} = this.state;

        if (workPlanID !== '' && person !== '' && concept !== '' && course !== '' && totalHour !== '' && priceHour !== '') {
            const url = app.programs + '/' + app.egressTeacher;
            let data = new FormData();
            data.set('id_work_plan', workPlanID);
            data.set('id_person', person);
            data.set('id_course', course);
            data.set('id_concept', concept);
            data.set('cant', totalHour);
            data.set('price_hour', priceHour);
            data.set('observation', observation);

            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({course: "", priceHour: "", totalHour: "", observation: "", subTotal: ""});
                this.cleanInputPerson()
                this.props.callDataTeacher();
                this.setState({loaderTeacher: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderTeacher: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderTeacher: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateEgressTeacher() {

        this.setState({loaderTeacher: true});
        const {course, priceHour, totalHour, person, observation} = this.state;

        if (person !== '' && course !== '' && totalHour !== '' && priceHour !== '') {

            const url = app.programs + '/' + app.egressTeacher + '/' + this.state.actualEgressTeacherID;
            let data = new FormData();


            data.set('id_person', person);
            data.set('id_course', course);
            data.set('cant', totalHour);
            data.set('price_hour', priceHour);
            data.set('observation', observation);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callDataTeacher();
                this.closeForm();
                this.setState({loaderTeacher: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderTeacher: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderTeacher: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    async destroyEntry(id) {

        try {
            this.setState({loaderTeacher: true});
            const url = app.programs + '/' + app.egressTeacher + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loaderTeacher: false});
            this.props.callDataTeacher();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderTeacher: false});
            return false;
        }
    };


    handleChange = field => event => {
        switch (field) {
            case 'priceHour':
                let subTotal = Math.round(this.state.totalHour * event.target.value * 100) / 100;
                this.setState({priceHour: event.target.value, subTotal: subTotal});
                break;
            case 'course':
                let totalHour = $('#course-' + event.target.value).attr('data-course');
                let costo = this.state.priceHour !== 0 ? totalHour * parseFloat(this.state.priceHour).toFixed(2) : totalHour;
                this.setState({course: event.target.value, totalHour: totalHour, subTotal: costo});
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;


            case 'searchA':
                this.searchPersonTeacher(event.target.value);
                this.setState({searchA: event.target.value});
                break;
            default:
                break;
        }
    };

    closeForm = () => {
        this.setState({
            formTeacher: false,
            action: "add",
            actualEgressTeacherID: "",
            priceHour: "",
            totalHour: "",
            subTotal: "",
            course: "",

            observation: "",
            person: "",
            searchA: "",
        });
        this.props.closeFormTeacher();

    };
    retriveForm = (r) => {

        this.setState({
            formTeacher: true,
            action: "update",
            actualEgressTeacherID: r.id,
            priceHour: r.price_hour,
            totalHour: r.cant,
            subTotal: r.cant * parseFloat(r.price_hour).toFixed(2),
            course: r.id_course,
            numberMonth: r.number_month,
            observation: r.observation,
            person: r.Person.id,
            searchA: r.Person.name,

        })


    };

    openEntrySweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyEntry(id) : this.props.closeFormTeacher();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };


    selectedPerson = (data) => {
        this.setState({
            person: data.id || '',
            searchA: data.name || '',
            dataPerson: data || '',
            persons: [],
        })
    };
    cleanInputPerson = () => {

        this.setState({
            person: "",
            searchA: "",
            dataPerson: "",
            persons: [],
        })

    };


    render() {
        const {workPlanID} = this.props;
        const {person, persons, searchA, courses, course, subTotal, conceptMask, totalHour, priceHour, observation} = this.state;
        const {formTeacher, action, loaderTeacher} = this.state;

        return (
            <>


                <Modal show={formTeacher} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}> {action === "add" ? "REGISTRAR" : "EDITAR"} - {conceptMask}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close type="button" style={{color: "white"}} onClick={() => this.closeForm()}/>

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>


                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <InputGroup>
                                        <Form.Label
                                            style={person === "" ? {color: "#ff5252 "} : null}
                                            className="floating-label">Buscar Docentes<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            style={{marginTop: "3px"}}
                                            id="number"
                                            value={searchA}
                                            onChange={this.handleChange('searchA')}
                                            placeholder="Nombre / DNI"
                                            margin="normal"
                                        />
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
                                                    <Close onClick={() => this.cleanInputPerson()} className="text-dark"/>
                                                </button>
                                            </OverlayTrigger>
                                        </InputGroup.Append>
                                    </InputGroup>
                                    <div className=" table-responsive"
                                         style={{
                                             position: 'absolute',
                                             zIndex: '223123',
                                             backgroundColor: 'white'
                                         }}
                                    >

                                        {persons.length > 0 && <Table hover responsive style={{marginTop: '-1px'}}>
                                            <tbody>
                                            {persons.length > 0 &&
                                            persons.map((r, i) => {
                                                return (
                                                    <tr key={i} onClick={() => this.selectedPerson(r)}>
                                                        <td scope="row">
                                                            <div className="d-inline-block align-middle">
                                                                <img
                                                                    // src={app.server + 'photography/' + r.photo || defaultUser}
                                                                    src={defaultUser}
                                                                    alt="user"
                                                                    className="img-radius align-top m-r-15"
                                                                    style={{width: '40px'}}
                                                                />
                                                                <div className="d-inline-block">
                                                                    <h6 className="m-b-0"> {r.name}</h6>
                                                                    <p className="m-b-0"> {r.document_number}</p>
                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                            </tbody>
                                        </Table>}

                                    </div>
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        style={course === "" ? {color: "#ff5252 "} : null}
                                        className="floating-label">Cursos <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                        // style={{fontSize: '16px'}}
                                                  value={course}
                                                  onChange={this.handleChange('course')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione
                                            una
                                            cuenta</option>
                                        {
                                            courses.length > 0 ?
                                                courses.map((r, index) => {
                                                    return (
                                                        <option id={'course-' + r.id} value={r.id} data-course={r.total_hours} key={index}>
                                                            {r.denomination}
                                                        </option>
                                                    )
                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label style={priceHour === 0 ? {color: "#ff5252 "} : null}
                                                className="floating-label">Costo por hora <small className="text-danger"> *</small></Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={priceHour}
                                        onChange={this.handleChange('priceHour')}
                                        placeholder="Monto"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Total horas </Form.Label>
                                    <Form.Control
                                        value={totalHour}
                                        disabled={true}
                                        onChange={this.handleChange('totalHour')}
                                        placeholder="Total de meses"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>


                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">SubTotal </Form.Label>
                                    <Form.Control
                                        value={subTotal}
                                        disabled={true}
                                        onChange={this.handleChange('subTotal')}
                                        placeholder="Total"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Observación </Form.Label>
                                    <Form.Control
                                        value={observation}
                                        onChange={this.handleChange('observation')}
                                        placeholder="observation"
                                        margin="normal"
                                    />
                                </Form.Group>

                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                {action === 'add' ?
                                    <Button
                                        className="pull-right"
                                        disabled={loaderTeacher}
                                        variant="primary"

                                        onClick={() => this.createEgressTeacher(workPlanID)}>
                                        {loaderTeacher && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderTeacher}
                                        variant="primary"

                                        onClick={() => this.updateEgressTeacher()}>
                                        {loaderTeacher && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar Cambios</Button>
                                }


                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>


            </>
        );
    }
}

export default FormTeacher;
