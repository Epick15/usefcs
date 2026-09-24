import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Swal from "sweetalert2";
import Close from "@material-ui/icons/Close";
import defaultUser from "../../../../assets/images/user/default.jpg";


moment.locale('es');


class TeacherEgressForm extends React.Component {
    state = {

        action: "add",
        titleFormModalTeacherEgress: "REGISTRAR EGRESO DOCENTE",
        amount: "",
        studyPlan: "",
        course: '',
        courseID: '',
        initDate: '',
        endDate: '',
        typeTeacher: '',
        stateEgress: 'Pendiente',


        personID: "",
        person: "",
        orderNumber: "",
        documentOne: "",
        egressID: "",
        dateEgress: "",
        organicUnit: this.props.organicUnit,
        retriveDataTeacherEgress: this.props.retriveDataTeacherEgress,
        formModalTeacherEgress: this.props.formModalTeacherEgress,
        deleteTeacherEgress: this.props.deleteTeacherEgress,
        persons: [],
        studyPlans: [],
        courses: [],
    };

    componentDidMount() {
        if (this.state.retriveDataTeacherEgress !== "") {
            this.retriveForm(this.state.retriveDataTeacherEgress);
        }

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveDataTeacherEgress !== this.props.retriveDataTeacherEgress) {
            this.props.retriveDataTeacherEgress !== "" && this.retriveForm(this.props.retriveDataTeacherEgress);
        }
        if (prevProps.organicUnit !== this.props.organicUnit) {
            this.setState({organicUnit: this.props.organicUnit});
        }
        if (prevProps.admissionPlan !== this.props.admissionPlan) {
            this.setState({admissionPlan: this.props.admissionPlan});
        }
        if (prevProps.program !== this.props.program) {
            this.setState({program: this.props.program});
            this.props.program !== '' && this.listPlanByProgramID(this.props.program)
        }
        if (prevProps.deleteEgressID !== this.props.deleteEgressID) {
            this.props.deleteEgressID !== "" && this.deleteTeacherEgress(this.props.deleteEgressID);
        }
        if (prevProps.formModalTeacherEgress !== this.props.formModalTeacherEgress) {
            this.setState({formModalTeacherEgress: this.props.formModalTeacherEgress});
        }
    }

    async listPlanByProgramID(id) {
        this.setState({loader: true});
        const url = app.programs + '/' + app.plan + '/' + app.program + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({studyPlans: res.data});
            }
            this.setState({loader: false})

        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: 2000});
            console.log(err)

        }

    };

    async createTeacherEgress() {
        this.setState({loader: true});
        const {organicUnit, program, admissionPlan} = this.props;
        const {
            amount, initDate, personID, orderNumber, documentOne, endDate, courseID, typeTeacher, stateEgress
        } = this.state;


        if (amount !== '' && organicUnit !== '' && program !== '' && stateEgress !== '' && documentOne !== '' && admissionPlan !== '' && courseID !== '' && typeTeacher !== '' && personID !== '' && initDate !== '') {
            const url = app.accounting + '/' + app.egress + '/teacher';
            let data = new FormData();
            data.set('id_organic_unit', organicUnit);
            data.set('id_program', program);
            data.set('id_course', courseID);
            data.set('id_teacher', personID);
            data.set('id_admission_plan', admissionPlan);
            data.set('amount', amount);
            data.set('type_teacher', typeTeacher);
            data.set('order_number', orderNumber);
            data.set('document_one', documentOne);
            data.set('init_date', initDate);
            data.set('end_date', endDate);
            data.set('state_egress', stateEgress);
            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callDataTeacherEgress();
                this.closeForm();
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


    async updateTeacherEgress() {

        this.setState({loader: true});

        const {
            amount, personID, orderNumber, documentOne, typeTeacher, endDate, initDate, courseID, stateEgress
        } = this.state;


        if (amount !== '' && personID !== '' && initDate !== '' && courseID !== '' && documentOne !== '' && stateEgress !== '') {
            const url = app.accounting + '/' + app.egress + '/teacher' + '/' + this.state.egressID;
            let data = new FormData();

            data.set('id_teacher', personID);
            data.set('id_course', courseID);
            data.set('amount', amount);
            data.set('order_number', orderNumber);
            data.set('init_date', initDate);
            data.set('type_teacher', typeTeacher);
            data.set('document_one', documentOne);
            data.set('state_egress', stateEgress);
            data.set('end_date', endDate);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callDataTeacherEgress();
                this.closeForm();
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


    async destroyEgressTeacher(id) {
        try {
            const url = app.accounting + '/' + app.egress + '/teacher' + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loader: false});
            this.props.callDataTeacherEgress();
            // return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    searchPerson(params) {
        if (params.length === 0) {
            this.setState({persons: []})
        } else {
            if (params.length > 3) {
                const url = app.person + '/search-person' + '/' + params;
                let data = new FormData();
                axios.patch(url, data, app.headers).then(res => {
                    if (res.data) this.setState({persons: res.data})
                }).catch(err => {
                    PNotify.error({
                        title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                    });
                    console.log(err)
                })
            }

        }

    };

    searchCourse(program, studyPlan, params) {
        if (params === '') {
            this.setState({persons: []})
        } else {
            const url = app.programs + '/search-' + app.course + '/' + params;
            let data = new FormData();
            data.set('id_program', program)
            data.set('id_study_plan', studyPlan)
            axios.patch(url, data, app.headers).then(res => {
                if (res.data) this.setState({courses: res.data})
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!", text: "Ha ocurrido un error", delay: 2000
                });
                console.log(err)
            })
        }

    };

    selectectCourse = (r) => {


        this.setState({
            courseID: r.id, course: r.denomination + ' - ' + r.Ciclo.ciclo, courses: [],

        });

    };
    closeSelectectCourse = () => {

        this.setState({

            courseID: '', course: '', courses: [],

        });
    };


    handleChange = field => event => {
        switch (field) {


            case 'person':
                this.searchPerson(event.target.value)
                this.setState({person: event.target.value});
                break;
            case 'typeTeacher':
                this.setState({typeTeacher: event.target.value});
                break;
            case 'stateEgress':
                this.setState({stateEgress: event.target.value});
                break;
            case 'course':
                this.setState({course: event.target.value});
                this.state.studyPlan && this.props.program && this.searchCourse(this.props.program, this.state.studyPlan, event.target.value)
                break;
            case 'orderNumber':
                this.setState({orderNumber: event.target.value});
                break;
            case 'documentOne':
                this.setState({documentOne: event.target.value});
                break;
            case 'amount':
                this.setState({amount: event.target.value});
                break;
            case 'initDate':
                this.setState({initDate: event.target.value});
                break;
            case 'endDate':
                this.setState({endDate: event.target.value});
                break;
            case 'studyPlan':
                this.setState({studyPlan: event.target.value});
                break;
            default:
                break;
        }
    };


    selectectTeacher = (r) => {


        this.setState({
            personID: r.id, person: r.name, persons: [],

        });
    };

    closeSelectectTeacher = () => {

        this.setState({
            personID: '', person: '', persons: [],

        });
    };
    retriveForm = (r) => {


        this.setState({
            action: "update",
            titleFormModalTeacherEgress: "ACTUALIZAR EGRESO DOCENTE",
            egressID: r.id,
            courseID: r.Course.id,
            course: r.Course.denomination,
            amount: r.amount,
            documentOne: r.document_one,
            stateEgress: r.state_egress,
            typeTeacher: r.type_teacher,
            orderNumber: r.order_number,
            endDate: r.end_date,
            initDate: r.init_date,
            personID: r.Teacher.id,
            person: r.Teacher.name,

        })


    };
    closeForm = () => {

        this.props.closeFormModalTeacherEgress();
        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "add",
            formModalTeacherEgress: false,
            titleFormModalTeacherEgress: "REGISTRAR EGRESO DOCENTE",
            dateEgress: '',
            amount: '',
            documentOne: '',
            orderNumber: '',
            retriveDataTeacherEgress: '',
            egressID: '',
            personID: '',
            initDate: '',
            endDate: '',
            stateEgress: '',
            person: '',
            persons: [],

        })


    };
    deleteTeacherEgress = async (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
        }).then((result) => {
            if (result.value) {
                this.destroyEgressTeacher(id);
            } else {
                this.closeForm();
            }
        })
    };

    render() {
        const {loader, action, persons, person, course, typeTeacher, studyPlan} = this.state;
        const {endDate, initDate, amount, cci, orderNumber, documentOne, courses, stateEgress,studyPlans} = this.state;
        return (<>

            <Modal show={this.state.formModalTeacherEgress}>
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5"
                                 style={{color: '#ffffff'}}>{this.state.titleFormModalTeacherEgress}</Modal.Title>
                    <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeForm}>
                                <i className="feather icon-x"
                                   style={{
                                       fontSize: "20px", color: 'white'
                                   }}></i> </span>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Tipo</Form.Label>
                                <Form.Control as="select"
                                              value={typeTeacher}
                                              onChange={this.handleChange('typeTeacher')}>
                                    >
                                    <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                    <option value="Interno">Interno</option>
                                    <option value="Externo">Externo</option>

                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={person === "" ? {color: "#ff5252 "} : null}
                                >Buscar por DNI<small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="teacher"
                                    value={person}
                                    onChange={this.handleChange('person')}
                                    placeholder="Buscar curso"
                                    margin="normal"
                                />
                                {person ? <OverlayTrigger
                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                    <button
                                        onClick={() => this.closeSelectectTeacher()}
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
                                    // <OverlayTrigger
                                    //     overlay={<Tooltip>NUEVO</Tooltip>}>
                                    //     <button
                                    //         onClick={() => this.openFormTeacher()}
                                    //         type="button"
                                    //         style={{
                                    //             position: 'relative',
                                    //             zIndex: 100,
                                    //             padding: '0',
                                    //             border: 'none',
                                    //             background: 'none',
                                    //             outline: 'none',
                                    //             color: '#7b7f84',
                                    //             marginTop: '-30px', float: 'right'
                                    //         }}
                                    //         className=" btn btn-dark"><Add
                                    //         style={{color: "dark"}}/></button>
                                    // </OverlayTrigger>

                                }
                                <Table hover responsive style={{marginTop: '-1px'}}>
                                    <tbody>
                                    {persons.length > 0 && persons.map((r, i) => {
                                        return (<tr key={i} onClick={() => this.selectectTeacher(r)}>
                                            <td scope="row">
                                                <div className="d-inline-block align-middle">
                                                    <img
                                                        src={r.photo !== "" ? app.server + 'person-photography/' + r.photo : defaultUser}
                                                        // src={defaultUser}
                                                        alt="user"
                                                        className="img-radius align-top m-r-15"
                                                        style={{width: '40px'}}
                                                    />
                                                    <div className="d-inline-block">

                                                        <h6 className="m-b-0"> {r.name}</h6>
                                                        <p className="m-b-0"> {r.document_number} </p>

                                                    </div>
                                                </div>

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
                                            style={studyPlan === "" ? {color: "#ff5252 "} : null}
                                >Plan de Estudio<small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                              value={studyPlan}
                                              onChange={this.handleChange('studyPlan')}
                                >

                                    <option defaultValue={true} hidden>Plan de estudio</option>
                                    <option defaultValue={true} hidden>Docente</option>
                                    {studyPlans.length > 0 ? studyPlans.map((r, k) => {

                                        return (<option
                                            value={r.id}
                                            key={k}> {r.description}
                                        </option>)

                                    }) : <option value={false} disabled>No se encontraron
                                        datos</option>}
                                </Form.Control>
                            </Form.Group>

                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={course === "" ? {color: "#ff5252 "} : null}
                                >Curso<small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="number"
                                    value={course}
                                    onChange={this.handleChange('course')}
                                    placeholder="Buscar curso"
                                    margin="normal"
                                />

                                <OverlayTrigger
                                    overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                    <button
                                        onClick={() => this.closeSelectectCourse()}
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
                                </OverlayTrigger>


                                <Table hover responsive style={{marginTop: '-1px'}}>
                                    <tbody>
                                    {courses.length > 0 && courses.map((r, i) => {
                                        let ciclo = r.Ciclo && r.Ciclo.ciclo;
                                        let totalHours = parseFloat(r.practical_hours) + parseFloat(r.hours);
                                        return (<tr key={i} onClick={() => this.selectectCourse(r)}>
                                            <td scope="row">
                                                <div className="d-inline-block align-middle">

                                                    <div className="d-inline-block">
                                                        <h6 className="m-b-0"> {r.denomination.toUpperCase() + ' - ' + ciclo}</h6>
                                                        <p className="m-b-0"> {r.Ciclo && r.Ciclo.Plan && r.Ciclo.Plan.description + '/ t. hors:' + totalHours}</p>
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>)
                                    })}
                                    </tbody>
                                </Table>

                            </Form.Group>

                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Monto</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={amount}
                                    name={"amount"}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('amount')}
                                    placeholder="Monto"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Tipo</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    defaultValue={'SERVICIO'}
                                    name={"type"}
                                    placeholder="servicio"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Concepto</Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    defaultValue={'PAGO A DOCENTE'}
                                    name={"concept"}
                                    placeholder="servicio"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Documento de Solicitud</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxlength="50"
                                    value={documentOne}
                                    name={"documentOne"}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('documentOne')}
                                    placeholder="Documento de Solicitud"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={initDate === "" ? {color: "#ff5252 "} : null}
                                >Fecha solicitud <small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="date"
                                    className="form-control"
                                    onChange={this.handleChange('initDate')}
                                    max="2999-12-31"
                                    value={initDate}
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Documento que acredita</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxlength="50"
                                    value={orderNumber}
                                    name={"orderNumber"}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('orderNumber')}
                                    placeholder="Documento que acredita"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"

                                >Fecha de documento <small
                                    className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    type="date"
                                    className="form-control"
                                    onChange={this.handleChange('endDate')}
                                    max="2999-12-31"
                                    value={endDate}
                                />
                            </Form.Group>
                        </Col>


                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Estado</Form.Label>
                                <Form.Control as="select"
                                              value={stateEgress}
                                              onChange={this.handleChange('stateEgress')}>

                                    <option defaultValue={true} hidden>Por favor seleccione una opcción</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Pagado">Pagado</option>

                                </Form.Control>
                            </Form.Group>
                        </Col>

                    </Row>
                    {action === 'add' ? <Button
                        className="pull-right"
                        disabled={loader}
                        variant="primary"

                        onClick={() => this.createTeacherEgress()}>
                        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                        Guardar</Button> : <Button
                        className="pull-right"
                        disabled={loader}
                        variant="primary"

                        onClick={() => this.updateTeacherEgress()}>
                        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                        Guardar Cambios</Button>}
                </Modal.Body>

            </Modal>


        </>);
    }
}

export default TeacherEgressForm;
