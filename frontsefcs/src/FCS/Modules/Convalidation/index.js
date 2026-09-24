import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";

import { Card, Col, Form, InputGroup, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import defaultUser from "../../../assets/images/user/default.jpg";

import Search from "@material-ui/icons/Search";


import Attachment from "@material-ui/icons/Attachment";
import Close from "@material-ui/icons/Close";


moment.locale('es');

class Convalidation extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        studentLoader: false,
        deleteMovementID: "",
        organicUnit: "",
        program: "",
        plan: "",
        academicDegree: "",

        retriveData: "",
        students: [],

        organicUnits: [],
        plans: [],
        cycleCourses: [],
        programs: [],
        registrations: [],


        searchPerson: true,
        movementLoader: false,
        conceptLoader: false,
        person: "",
        persons: [],

    };

    async componentDidMount() {
        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.listSimpleProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
            this.setState({organicUnit: component.ORGANIC_UNIT})
        }
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

    async listCourseByPlanStudy(id) {
        this.setState({loader: true})
        const url = app.programs + '/' + app.cycle + '/' + app.course + '/' + id + '/' + app.plan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({cycleCourses: res.data});
            }

            this.setState({loader: false})
        } catch (err) {
            this.setState({loader: false})
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Grados Academicos", delay: 2000});
            console.log(err)

        }

    };

    async retrieveStudent(id_student) {
        // this.setState({registrationDataLoader: true});
        const url = app.person + '/' + app.student + '/' + id_student;
        try {

            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                titleModule: res.data.Person.name + " / " + res.data.Person.document_number,
                titleProgram: res.data.Program.denomination,
                admissionPlanID: res.data.id_admission_plan,
                studyPlanID: res.data.id_plan,
                PERSONID: res.data.Person.id,
                academicDegree: res.data.Program.Academic_degree.denomination
            });
            console.log('aqui', res.data)
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listRegistrationCourseStudent(id_student) {
        this.setState({registrationDataLoader: true});
        const url = app.registration + '/' + app.registrations + '/' + id_student + '/' + app.registrationCourse;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                this.setState({registrations: res.data})
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

    async listPlanByProgramID(id) {
        this.setState({plansLoader: true})
        const url = app.programs + '/' + app.program + '/' + id + '/study-plan';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                plans: res.data.Plans
            });
            this.setState({plansLoader: false});
            console.log(res.data)

        } catch (err) {
            this.setState({plansLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
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

    searchPersonStudenUnitOrganic(params, organicUnit) {
        if (params === '') {
            this.setState({persons: []})
        } else {
            const url = app.person + '/search-' + app.persons + '/' + app.student + '-uo/' + params;
            let data = new FormData();
            data.set('id_organic_unit', organicUnit)
            axios.patch(url, data, app.headers).then(res => {
                if (res.data) this.setState({persons: res.data})
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err)
            })
        }

    };


    handleChange = field => event => {
        switch (field) {
            case 'organicUnit':
                this.setState({organicUnit: event.target.value});
                this.listSimpleProgramByOrganicUnitRegisterID(event.target.value);
                break;
            case 'person':
                this.searchPersonStudenUnitOrganic(event.target.value, this.state.organicUnit)
                this.setState({person: event.target.value});
                break;
            case 'program':
                this.setState({program: event.target.value});
                this.listPlanByProgramID(event.target.value)
                break;
            case 'plan':
                this.setState({plan: event.target.value});
                this.listCourseByPlanStudy(event.target.value)

                break;
            default:
                break;
        }
    };

    openForm = () => {
        this.setState({formRegistration: true, action: "add"});
    };
    deleteSweetRegistration = (id) => {
        this.setState({deleteRegistrationID: id})
    };
    leaveDataRegistration = (id) => {
        this.setState({leaveRegistrationID: id})
    };
    callData = async () => {
        this.listRegistrationCourseStudent(this.state.studentID)
    };
    retriveDataRegistration = (r) => {

        this.setState({formRegistration: true, retriveRegistration: r, action: "update"});
    };
    closeFormRegistration = () => {
        this.setState({
            formRegistration: false,
            retriveRegistration: "",
            deleteRegistrationID: "",
            leaveRegistrationID: "",
            action: ""
        })
    };

    selectectPerson = (r) => {

        this.listRegistrationCourseStudent(r.Student.id);
        this.retrieveStudent(r.Student.id);

        this.setState({
            searchPerson: false,
            personMask: r.name,
            documentMask: r.document_number,
            programMask: r.Student.Program.denomination,
            photoMask: r.photo,
            studentID: r.Student.id,

        });
    };
    unSelectectPerson = () => {

        this.setState({
            searchPerson: true,
            personMask: '',
            documentMask: '',
            programMask: '',
            photoMask: '',
            academicDegree: '',
            studentID: '',
            totalMovement: '',
            registrations: [],
            movements: []
        });
    };


    render() {

        const {
            persons, person, programs, program, plans, plan, fileName
        } = this.state;

        // estado del modo dios
        const {organicUnits, organicUnit} = this.state;
        let span = this.state.studentType === 'Retirado' ? 'badge-warning' :
            this.state.studentType === 'Abandonado' ? 'badge-danger' :
                this.state.studentType === 'Postulante' ? 'badge-info' :
                    this.state.studentType === 'Estudiante' ? 'badge-primary' : 'badge-success';
        return (
            <>

                <TitleModule
                    actualTitle={"CONVALIDACIONES"}
                    actualModule={"CONVALIDACIONES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Card style={{marginBottom: "5px"}}>
                    <Card.Header>
                        <Row>
                            {!component.ORGANIC_UNIT &&
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>


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


                            </Col>}
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                        // style={gender === "" ? {color: "#ff5252 "} : null}
                                    >Tipo<small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                        // value={gender}
                                                  onChange={this.handleChange('gender')}>
                                        >
                                        <option defaultValue={true} hidden>Tipo</option>
                                        <option value={"Traslado interno"}> TRASLADO INTERNO</option>
                                        <option value={"Traslado externo"}> TRASLADO EXTERNO</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Archivo<small
                                        className="text-danger"> *</small></Form.Label>
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
                            {this.state.searchPerson ?
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"
                                            // style={program === "" ? {color: "#ff5252 "} : null}
                                        >Estudiante<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            type="text"
                                            onKeyPress={this.handleKeyPress}
                                            id="number"
                                            value={person}
                                            onChange={this.handleChange('person')}
                                            placeholder="Buscar"
                                            margin="normal"
                                        />

                                        <OverlayTrigger
                                            overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                            <button
                                                onClick={() => this.closeSelectectPerson()}
                                                type="button"
                                                style={{
                                                    position: 'relative',
                                                    zIndex: 100,
                                                    padding: '0',
                                                    border: 'none',
                                                    background: 'none',
                                                    outline: 'none',
                                                    color: '#7b7f84',
                                                    marginTop: '-30px', float: 'right'
                                                }}
                                                className=" btn btn-dark"><Close
                                                style={{color: "dark"}}/></button>
                                        </OverlayTrigger>


                                        <Table hover responsive style={{marginTop: '-1px'}}>
                                            <tbody>
                                            {persons.length > 0 &&
                                            persons.map((r, i) => {

                                                let spanP = r.Student.type === 'Retirado' ? 'badge-warning' :
                                                    r.Student.type === 'Abandonado' ? 'badge-danger' :
                                                        r.Student.type === 'Postulante' ? 'badge-info' :
                                                            r.Student.type === 'Estudiante' ? 'badge-primary' : 'badge-success';

                                                return (
                                                    <tr key={i} onClick={() => this.selectectPerson(r)}>
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
                                                                    <p className="m-b-0"> {r.document_number} <span
                                                                        className={"badge  inline-block " + spanP}>{r.Student && r.Student.type}</span>
                                                                    </p>
                                                                    <p className="m-b-0"> {r.Student.Program.denomination}</p>
                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }
                                            </tbody>
                                        </Table>

                                    </Form.Group>

                                </Col>

                                :
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Row>
                                        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                            <div className="d-inline-block align-middle">
                                                <img
                                                    src={this.state.photoMask !== "" ? app.server + 'person-photography/' + this.state.photoMask : defaultUser}
                                                    // src={defaultUser}
                                                    alt="user"
                                                    className="img-radius align-top m-r-15"
                                                    style={{width: '60px'}}
                                                />
                                                <div className="d-inline-block">
                                                    <h5 className="m-b-0"> {this.state.personMask}</h5>
                                                    <p className="m-b-0">{this.state.documentMask}
                                                        {/*<span*/}
                                                        {/*    className={"badge  inline-block " + span}>{this.state.studentType.toUpperCase()}</span>*/}

                                                    </p>
                                                    <p className="m-b-0"> {this.state.programMask}</p>

                                                </div>


                                            </div>
                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>


                                            <div style={{float: "right"}}>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>BUSCAR ESTUDIANTE</Tooltip>}>
                                                    <button style={{float: "right", marginRight: "3px"}}
                                                            onClick={() => this.unSelectectPerson()}
                                                            type="button"
                                                            className="btn-icon btn btn-info"><Search/></button>

                                                </OverlayTrigger>

                                            </div>
                                        </Col>


                                    </Row>
                                </Col>
                            }

                        </Row>
                    </Card.Header>
                </Card>

                <Row>

                    <Col md={12}>
                        <Card>
                            <Card.Header style={{paddingBottom: '0px', paddingTop: '0px'}}>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Row>
                                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                <Form.Group className="form-group fill">

                                                    <Form.Control as="select"
                                                                  value={program}
                                                                  onChange={this.handleChange('program')}
                                                    >
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
                                                                <option value={false} disabled>No se encontraron
                                                                    datos</option>
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                                <Form.Group className="form-group fill">

                                                    <Form.Control as="select"
                                                                  value={plan}
                                                                  onChange={this.handleChange('plan')}
                                                    >
                                                        >
                                                        <option defaultValue={true} hidden>Plan de estudio</option>
                                                        {
                                                            plans.length > 0 ?
                                                                plans.map((r, k) => {

                                                                        return (<option id={"programmask-" + r.id}
                                                                                        value={r.id}
                                                                                        key={k}> {r.description + ' '} {r.valid && 'ACTUAL'} </option>)

                                                                    }
                                                                ) :
                                                                <option value={false} disabled>No se encontraron
                                                                    datos</option>
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>

                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}   style={{paddingTop: '5px'}}>
                                        <OverlayTrigger
                                            overlay={<Tooltip>Guardar</Tooltip>}>
                                            <button

                                                // onClick={() => this.updateRegistrationCourse()}
                                                type="button"
                                                className="btn-icon btn btn-primary pull-right"><i
                                                className="feather icon-save"></i>
                                            </button>
                                        </OverlayTrigger>
                                    </Col>

                                </Row>
                            </Card.Header>

                            <Card.Body style={{padding: '0px'}}>
                                <Table size="sm" hover responsive style={{width: '100%'}}>
                                    <thead>
                                    <tr>
                                        <th>Curso</th>
                                        <th>Ciclo</th>
                                        <th>Credito</th>
                                        <th>Requi.</th>
                                        <th>Nota</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.cycleCourses.length > 0 && this.state.cycleCourses.map((r, i) => {
                                            let req = '';
                                            r.requirements.length > 0 ? r.requirements.map((k, j) => {
                                                req = k.order + '/' + req;
                                            }) : req = 'Ninguno'
                                            return (
                                                <tr style={{height: "45px"}}>
                                                    <td>
                                                        {r.order + ' ' + r.denomination}
                                                    </td>
                                                    <td>
                                                        {r.cycle}


                                                    </td>
                                                    <td>
                                                        {r.credits}


                                                    </td>
                                                    <td>
                                                        {
                                                            req
                                                        }
                                                    </td>
                                                    <td><input
                                                        // value={note}
                                                        style={{
                                                            width: "70%",
                                                            border: "none",
                                                            borderBottom: "1px solid #ced4da",
                                                            fontSize: "15px"
                                                        }}

                                                        // onChange={this.changeNote.bind(this, rowIndex)}
                                                    /></td>

                                                </tr>
                                            )
                                        })
                                    }


                                    </tbody>
                                </Table>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }

}

export default Convalidation;
