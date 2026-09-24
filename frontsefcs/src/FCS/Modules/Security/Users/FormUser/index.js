import React from 'react';
import {Button,  Col,  Form, InputGroup, Modal, OverlayTrigger, Row,  Tooltip} from 'react-bootstrap';


import defaultPhoto from '../../../../../assets/images/user/default.jpg';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import moment from 'moment';
import 'moment/locale/es';

import component from "../../../../Component";
import Select from "react-select";
import Close from "@material-ui/icons/Close";



moment.locale('es');


class UserForm extends React.Component {
    state = {


        existPerson: false,

        preview: defaultPhoto,
        file: '',
        changeImage: false,
        loadImg: false,
        loaderPerson: false,
        openFormUser: this.props.openFormUser,
        role: '',
        pass: '',
        personID: '',
        namePersonMask: '',

        documentNumber: '',

        //para el mode god
        organicUnits: [],
        roles: [],
        contractTypes: [],

        organicUnit: "",
        charge: "",
        contractType: "",
        date_start: "",
        date_end: "",
        teacherModal: false,

    };

    componentDidMount() {
        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});
        this.getUnitOrganic();
        this.getRoles();


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.openFormUser !== this.props.openFormUser) {
            this.setState({openFormUser: this.props.openFormUser});
        }


    }

    getUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                res.data.map((record, index) =>
                    this.state.organicUnits.push({
                        value: record.id,
                        label: record.denomination + " " + record.Campu.denomination,
                    }));
                // this.setState({organicUnits: res.data, showOrganicUnit: true})
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

    //obtener persona id persona y unidad organica
    getRoles() {
        const url = app.security + '/' + app.role;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({roles: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener roles",
                delay: 2000
            });
            console.log(err)
        })
    };

    async validatePersonDni(dni) {
        if (dni) {
            this.setState({validateDniLoader: true});
            const url = app.person + '/validate-person-dni/' + dni;
            try {
                const res = await axios.get(url, app.headers);
                if (res.data) {

                    this.setState({
                        personID: res.data.Person.id,
                        existPerson: true,
                        preview: res.data.Person.photo ? app.server + app.personPhotography + res.data.Person.photo : defaultPhoto,
                        namePersonMask: res.data.Person.name,
                        emailPersonMask: res.data.Person.email,
                    })

                }

                this.setState({validateDniLoader: false});

            } catch (err) {
                this.setState({validateDniLoader: false});
                // PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 9000});

            }
        }
    };

    async createDemi() {
        this.setState({loader: true});
        const {documentNumber, emailPersonMask, namePersonMask, organicUnit, pass, role, personID} = this.state;
        //falta enviar email
        console.log(documentNumber, emailPersonMask, organicUnit, pass, role, personID)
        if (documentNumber !== "" && organicUnit !== "" && pass !== "" && emailPersonMask !== "" && role !== "" && personID !== "") {
            const url = app.security + '/' + app.user + '/create';
            let data = new FormData();

            data.set("document_number", documentNumber);
            data.set("email", emailPersonMask);
            data.set("name", namePersonMask);
            data.set("id_organic_unit", organicUnit.value);


            data.set("id_person", personID);
            data.set("id_role", role);
            data.set("user", documentNumber);
            data.set("pass", pass);
            try {
                const res = await axios.post(url, data, app.headers);
                // this.listUsers();

                this.props.callData();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    handleChange = field => event => {
        switch (field) {
            case 'name':
                let name = event.target.value.replace(/[^À-ÿA-Za-z ]/g, '').toUpperCase();
                this.setState({name: name.slice(0, 60)});

                break;
            case 'paternal':
                let paternal = event.target.value.replace(/[^À-ÿA-Za-z ]/g, '').toUpperCase();
                this.setState({paternal: paternal.slice(0, 60)});
                break;
            case 'maternal':
                let maternal = event.target.value.replace(/[^À-ÿA-Za-z ]/g, '').toUpperCase();
                this.setState({maternal: maternal.slice(0, 60)});
                break;
            case 'documentNumber':
                let documentNumber = event.target.value.replace(/[^0-9]/g, '');
                this.setState({documentNumber: documentNumber.slice(0, 15)});
                this.validatePersonDni(event.target.value)
                break;
            case 'gender':
                this.setState({gender: event.target.value});
                break;
            case 'birthDate':

                this.setState({birthDate: event.target.value});
                break;
            case 'email':


                let email = event.target.value.replace(/[^0-9A-Za-z\-_.@]/g, '').toLowerCase();
                this.setState({email: email.slice(0, 80)});
                break;
            case 'civilStatu':
                this.setState({civilStatu: event.target.value});
                break;
            case 'photo':
                this.setState({photo: event.target.value});
                break;
            case 'cellPhone':
                let cellPhone = event.target.value.replace(/[^0-9]/g, '');
                this.setState({cellPhone: cellPhone.slice(0, 9)});
                break;
            case 'address':
                this.setState({address: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;


            case 'teacherState':
                if (event.target.value == 'false') {
                    this.setState({teacherState: true});
                } else {
                    this.setState({teacherState: false});
                }
                break;
            case 'studentState':
                if (event.target.value == 'false') {
                    this.setState({studentState: true});
                } else {
                    this.setState({studentState: false});
                }
                break;
            case 'administrativeState':
                if (event.target.value === 'false') {
                    this.setState({administrativeState: true});
                } else {
                    this.setState({administrativeState: false});
                }
                break;

            case 'birthDepartment':
                this.setState({birthDepartment: event.target.value, birthProvince: '', birthDistrict: ''});
                this.getProvince(event.target.value, 'birth');
                break;
            case 'birthProvince':
                this.setState({birthProvince: event.target.value, birthDistrict: ''});
                this.getDistrict(event.target.value, 'birth');
                break;
            case 'birthDistrict':
                this.setState({birthDistrict: event.target.value});
                break;

            case 'residentDepartment':
                this.setState({residentDepartment: event.target.value, residentProvince: '', residentDistrict: ''});
                this.getProvince(event.target.value, 'resident');
                break;
            case 'residentProvince':
                this.setState({residentProvince: event.target.value, residentDistrict: ''});
                this.getDistrict(event.target.value, 'resident');
                break;
            case 'residentDistrict':
                this.setState({residentDistrict: event.target.value});
                break;


            case 'organicUnit':
                this.setState({organicUnit: {value: event.value, label: event.label}});
                break;
            case 'role':
                this.setState({role: event.target.value});
                break;
            case 'contractType':
                this.setState({contractType: event.target.value});
                break;

            case 'date_start':
                this.setState({date_start: event.target.value});
                break;
            case 'date_end':
                this.setState({date_end: event.target.value});
                break;

            default:
                break;
        }
    };
    generatePass = () => {
        let code = component.generateCode(5);
        this.setState({pass: code});
    };

    closeForm = () => {
        this.setState({

            personID: '',
            userID: '',


            preview: defaultPhoto,
            file: '',


            name: '',

            documentNumber: '',

            email: '',

        });
        this.props.closeForm();
    };
    closeValidatePersonDni = () => {
        this.setState({
            namePersonMask: "",
            emailPersonMask: "",
            personID: "",
            existPerson: false,
            preview: defaultPhoto,
        });
    };


    render() {

        const {
            namePersonMask, documentNumber, emailPersonMask, role,


        } = this.state;

        const {roles, pass} = this.state;

        // estado del modo dios
        const {organicUnits,   organicUnit} = this.state;

        return (


            <Modal show={this.state.openFormUser} size={""} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR USUARIO</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}} onClick={() => this.closeForm()}/>

                        </OverlayTrigger>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>

                        {this.state.existPerson === false ?
                            <>


                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group className="form-group fill"

                                    >
                                        <Form.Label className="floating-label"
                                                    style={documentNumber === "" ? {color: "#ff5252 "} : null}
                                        >Documento de identidad<small className="text-danger"> *</small></Form.Label>
                                        <Form.Control
                                            placeholder="Documento de Identidad"
                                            onKeyPress={this.handleKeyPress}
                                            id="documentNumber"
                                            value={documentNumber}
                                            onChange={this.handleChange('documentNumber')}
                                        />
                                    </Form.Group>
                                </Col>


                            </>
                            :
                            <>
                                <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label"></Form.Label>
                                        <div className="client-detail">
                                            <div className="client-profile">
                                                <img style={{width: "170px", marginTop: "-7px"}}
                                                     src={this.state.preview}
                                                     onClick={this.openFileReader}
                                                     alt="inputAvatar"/>
                                                <input
                                                    type="file"
                                                    id="inputAvatar"
                                                    style={{display: 'none'}}
                                                    onChange={(event) => this.changeAvatar(event)}
                                                />
                                            </div>

                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={7} lg={7} xl={7}>
                                    <Row>

                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <h5>{namePersonMask}</h5>
                                            <h5>{emailPersonMask}</h5>
                                            <h5>{documentNumber}</h5>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <button type="button" className="btn btn-link p-0" onClick={() => this.closeValidatePersonDni()}>Cambiar</button>

                                        </Col>


                                    </Row>
                                </Col>

                            </>
                        }
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h5>Datos de acceso</h5>
                            <br/>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                <Form.Label className="floating-label"
                                            style={organicUnit === "" ? {color: "#ff5252 "} : null}
                                >Unidada organica <small className="text-danger"> *</small></Form.Label>
                                <Select
                                    isSearchable
                                    value={organicUnit}
                                    name="organicUnit"
                                    options={organicUnits}
                                    classNamePrefix="select"
                                    // isLoading={coursesLoader}
                                    className="basic-single"
                                    placeholder="Buscar unidad organica"
                                    onChange={this.handleChange("organicUnit")}
                                    styles={component.selectSearchStyle}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={role === "" ? {color: "#ff5252 "} : null}
                                >Rol</Form.Label>
                                <Form.Control as="select"
                                              value={role}
                                              onChange={this.handleChange('role')}>
                                    >
                                    <option defaultValue={true} hidden>Por favor seleccione una
                                        opcción</option>
                                    {
                                        roles.length > 0 ?
                                            roles.map((r, index) => {

                                                return (
                                                    <option value={r.id} key={index}>
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
                        <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={documentNumber === "" ? {color: "#ff5252 "} : null}
                                >Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={documentNumber}
                                    name={"documentNumber"}
                                    disabled={true}
                                    onKeyPress={this.handleKeyPress}
                                    onChange={this.handleChange('documentNumber')}
                                    placeholder="Usuario"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>

                        <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={pass === "" ? {color: "#ff5252 "} : null}
                                >Contraseña<small className="text-danger"> *</small></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        style={{marginTop: "3px"}}
                                        type="text"
                                        autoComplete='off'
                                        value={pass}
                                        // onChange={this.handleChange('disabled')}

                                        placeholder="Seleccione un archivo"
                                        margin="normal"
                                    />

                                    <InputGroup.Append>
                                        <OverlayTrigger
                                            overlay={<Tooltip style={{zIndex: 100000000}}>Generar</Tooltip>}>
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
                                                <i onClick={() => this.generatePass()} className="text-primary feather icon-target"/>
                                            </button>

                                        </OverlayTrigger>


                                    </InputGroup.Append>


                                </InputGroup>
                            </Form.Group>
                            {/*<Form.Group className="form-group fill">*/}
                            {/*    <Form.Label className="floating-label">Contraseña</Form.Label>*/}
                            {/*    <Form.Control*/}
                            {/*        type="text"*/}
                            {/*        disabled={true}*/}
                            {/*        value={pass}*/}
                            {/*        name={"pass"}*/}
                            {/*        onKeyPress={this.handleKeyPress}*/}
                            {/*        onChange={this.handleChange('pass')}*/}
                            {/*        placeholder="Contraseña"*/}
                            {/*        margin="normal"*/}
                            {/*    />*/}
                            {/*</Form.Group>*/}
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Button
                                className="pull-right"
                                disabled={this.state.loaderPerson}
                                variant="primary"
                                onClick={() => this.createDemi()}
                            >
                                {this.state.loaderPerson && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button>
                        </Col>
                    </Row>


                </Modal.Body>
            </Modal>


        );
    }
}

export default UserForm;
