import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';

import Aux from "../../../../hoc/_Aux";

import preview from '../../../../assets/images/user/default.jpg';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';

import component from "../../../Component";

import Close from "@material-ui/icons/Close";

import Swal from "sweetalert2";


moment.locale('es');


class ProfileForm extends React.Component {
    state = {


        studentState: false,
        teacherState: false,
        administrativeState: false,

        action: "add",
        retriveData: this.props.retriveData,
        preview: preview,
        file: '',
        changeImage: false,
        loadImg: false,
        loaderPerson: false,

        name: '',
        paternal: '',
        maternal: '',
        documentNumber: '',
        gender: '',
        birthDate: "",
        email: '',
        civilStatu: '',
        civilStatuMask: '',
        photo: '',
        address: '',
        cellPhone: '',

        birthUbigeoMask: '',
        birthDepartment: '',
        birthProvince: '',
        birthDistrict: '',

        residentUbigeoMask: '',
        residentDeparmet: '',
        residentProvince: '',
        residentDistrict: '',

        civilStatus: [],


        birthDepartments: [],
        birthProvinces: [],
        birthDistrics: [],
        residentDepartments: [],
        residentProvinces: [],
        residentDistrics: [],
        //para el mode god
        organicUnits: [],
        charges: [],
        contractTypes: [],

        organicUnit: "",
        charge: "",
        contractType: "",
        date_start: "",
        date_end: "",

        teacherModal: false,


        messageConsultApi: "",
        datosReniecResult: "",
        datosReniec: "",

    };

    componentDidMount() {

        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});
        this.getUnitOrganic();
        this.getCivilStatus();
        this.getCharges();
        this.getContractTypes();
        this.getDepartment(2546, 'birth');
        this.getDepartment(2546, 'resident');
        this.props.retriveData !== "" && this.retriveForm(this.props.retriveData)

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveData !== this.props.retriveData) {
            this.props.retriveData !== "" && this.retriveForm(this.props.retriveData)
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

    getCharges() {
        const url = app.general + '/' + app.charge;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({charges: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener cargos",
                delay: 2000
            });
            console.log(err)
        })
    };

    getContractTypes() {
        const url = app.general + '/' + app.contractType;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({contractTypes: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener tipos de contrato",
                delay: 2000
            });
            console.log(err)
        })
    };

    //obtener persona id persona y unidad organica


    getCivilStatus() {
        const url = app.general + '/' + app.civilStatus;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({civilStatus: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    consulApiReniec() {
        if (this.state.documentNumber.length == 8) {
            const url = app.apiRenicDNI + this.state.documentNumber + app.tokenReniec;
            axios.get(url).then(res => {
                if (res.data) this.setState({
                    datosReniec: res.data,
                    datosReniecResult: res.data.nombres + ' ' + res.data.apellidoPaterno + ' ' + res.data.apellidoMaterno
                })
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err)
            })
        } else {
            this.setState({
                messageConsultApi: 'Dni incorrecto'
            })
        }

    };

    changeDataReniec() {
        this.setState({
            name: this.state.datosReniec.nombres,
            paternal: this.state.datosReniec.apellidoPaterno,
            maternal: this.state.datosReniec.apellidoMaterno,
            datosReniec: '',
            datosReniecResult: ''
        })
    }

    createPersonProfile() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.persons + '/' + app.profile;
        const {
            name,
            paternal,
            maternal,
            documentNumber,
            gender,
            birthDate,
            email,
            civilStatu,
            file,
            cellPhone,
            address,
            birthDistrict,
            residentDistrict
        } = this.state;

        let validateEmail = this.validateEmail(email);
        if (name !== '' && paternal !== '' && maternal !== '' && documentNumber !== '' && gender !== '' && cellPhone !== '' && address !== ''
            && birthDate !== '' && email !== '' && civilStatu !== '' && birthDistrict !== '' && residentDistrict !== '' && validateEmail
        ) {
            let data = new FormData();
            data.set('file', file);
            data.set('name', name);
            data.set('paternal', paternal);
            data.set('maternal', maternal);
            data.set('document_number', documentNumber);
            data.set('gender', gender);
            // data.set('birth_date', moment(birthDate).format('YYYY-MM-DD'));
            data.set('birth_date', birthDate);
            data.set('email', email);
            data.set('id_civil_status', civilStatu);
            data.set('cell_phone', cellPhone);
            data.set('address', address);
            data.set('id_ubigeo_birth', birthDistrict);
            data.set('id_ubigeo_resident', residentDistrict);


            axios.post(url, data, app.headers).then((res) => {

                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData();
                this.props.closeForm()


            }).catch((err) => {


                this.setState({loaderPerson: false})
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.message,
                    delay: 3000
                });
            });
        } else {
            this.setState({loaderPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    updatePersonProfile() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.persons + '/' + app.profile + '-update/' + this.state.actualPersonID;
        const {
            name,
            paternal,
            maternal,
            documentNumber,
            gender,
            birthDate,
            email,
            civilStatu,
            file,
            cellPhone,
            address,
            birthDistrict,
            residentDistrict
        } = this.state;

        let validateEmail = this.validateEmail(email);
        if (name !== '' && paternal !== '' && maternal !== '' && documentNumber !== '' && gender !== '' && cellPhone !== '' && address !== ''
            && birthDate !== '' && email !== '' && civilStatu !== '' && birthDistrict !== '' && residentDistrict !== '' && validateEmail
        ) {
            let data = new FormData();
            data.set('file', file);
            data.set('name', name);
            data.set('paternal', paternal);
            data.set('maternal', maternal);
            data.set('document_number', documentNumber);
            data.set('gender', gender);
            data.set('birth_date', birthDate);
            data.set('email', email);
            data.set('id_civil_status', civilStatu);
            data.set('cell_phone', cellPhone);
            data.set('address', address);
            data.set('id_ubigeo_birth', birthDistrict);
            data.set('id_ubigeo_resident', residentDistrict);


            axios.patch(url, data, app.headers).then((res) => {

                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData();
                this.closeForm();

            }).catch((err) => {


                this.setState({loaderPerson: false})
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.message,
                    delay: 3000
                });
            });
        } else {
            this.setState({loaderPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    changeImage(id) {
        this.setState({loadImg: true})
        const url = app.person + '/' + app.persons + '/change-img/' + id;
        const {file, documentNumber} = this.state;

        if (file !== '' && documentNumber !== '') {
            let data = new FormData();
            data.set('photo', file);
            data.set('photo', file);
            data.set('document_number', documentNumber);
            axios.patch(url, data, app.headers).then((res) => {

                setTimeout(() => {
                    this.setState({loadImg: false})
                    // this.getPerson(id);
                }, 1000);

                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
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

    async validatePersonDni(dni) {
        if (dni) {
            this.setState({validateDniLoader: true});
            const url = app.person + '/validate-person-dni/' + dni;
            try {
                const res = await axios.get(url, app.headers);
                if (res.data) {
                    // PNotify.error({title: "Oh no!", text: res.data.message, delay: 9000});
                }

                this.setState({validateDniLoader: false});

            } catch (err) {
                this.setState({validateDniLoader: false});
                PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 9000});

            }
        }

    };

    // Ubigeo Functions
    getDepartment(id, type) {
        const url = app.general + app.UbigeoNacional + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                if (type === 'birth') {
                    this.setState({
                        birthDepartments: res.data,
                    });
                } else {
                    this.setState({
                        residentDepartments: res.data
                    });
                }

            }
        }).catch(err => {
            console.log(err)
        });
    };

    getProvince(id, type) {
        const url = app.general + '/' + app.ubigeo + '/' + app.province + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                if (type === 'birth') {
                    this.setState({
                        birthProvinces: res.data
                    });
                } else {
                    this.setState({

                        residentProvinces: res.data
                    });
                }

            }
        }).catch(err => {
            console.log(err)
        });
    };

    getDistrict(id, type) {
        const url = app.general + '/' + app.ubigeo + '/' + app.district + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                if (type === 'birth') {
                    this.setState({
                        birthDistrics: res.data
                    });
                } else {
                    this.setState({
                        residentDistrics: res.data,
                    });
                }

            }
        }).catch(err => {
            console.log(err)
        });
    };

    validateEmail = (emailField) => {
        if (emailField.indexOf('@') >= 0) {

            return true;
        } else {
            return false
        }


    }

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
                if (event.target.value == 'false') {
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
            case 'charge':
                this.setState({charge: event.target.value});
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

    retriveForm = (r) => {

        if (r.Districts_reside && r.Districts_reside.Province && r.Districts_reside.Province.Department &&
            r.Districts_reside.Province.Department.Country) {
            this.getDepartment(r.Districts_reside.Province.Department.Country.id, 'reside');
            this.getProvince(r.Districts_reside.Province.Department.id || null, 'reside');
            this.getDistrict(r.Districts_reside.Province.id || null, 'reside');
            this.setState({

                residentCountry: r.Districts_reside.Province.Department.Country.id,
                residentDepartment: r.Districts_reside.Province.Department.id,
                residentProvince: r.Districts_reside.Province.id,
                residentDistrict: r.Districts_reside.id,

            });
        }
        if (r.Districts_birth && r.Districts_birth.Province && r.Districts_birth.Province.Department &&
            r.Districts_birth.Province.Department.Country) {
            this.getDepartment(r.Districts_birth.Province.Department.Country.id, 'birth');
            this.getProvince(r.Districts_birth.Province.Department.id || null, 'birth');
            this.getDistrict(r.Districts_birth.Province.id || null, 'birth');
            this.setState({

                birthCountry: r.Districts_birth.Province.Department.Country.id,
                birthDepartment: r.Districts_birth.Province.Department.id,
                birthProvince: r.Districts_birth.Province.id,
                birthDistrict: r.Districts_birth.id,

            });
        }


        this.setState({
            preview: r.photo !== "" ? app.server + app.personPhotography + r.photo : preview,
            action: "update",
            titleModal: "EDITAR ",
            actualPersonID: r.id,
            name: r.name,
            paternal: r.paternal,
            maternal: r.maternal,
            documentNumber: r.document_number,
            gender: r.gender,
            birthDate: r.birth_date,
            email: r.email,
            civilStatu: r.id_civil_status,
            address: r.address,
            cellPhone: r.cell_phone
        });
    };
    // cerrar Profile y abir busqueda

    openFileReader = () => {
        const input = '#inputAvatar';
        $(input).click();
    };
    changeAvatar = (event) => {

        const fileExtension = ['jpg', 'png'];
        const input = '#inputAvatar';
        let value = $(input).val().split('.').pop().toLowerCase();
        if ($.inArray(value, fileExtension) === -1) {
            let message = "Por favor use estos formatos: " + fileExtension.join(', ');
            Swal.fire({
                title: 'Complete los datos requeridos ',
                text: message,
                icon: 'info',
                confirmButtonText: 'Ok'
            })
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onload = () => {
                this.setState({
                    previewStage: true,
                    file: file,
                    preview: reader.result,
                    status: true
                });
            };
            reader.readAsDataURL(file);
        }
        // if (this.state.changeImage) {
        //     setTimeout(() => {
        //         this.changeImage(this.state.personID);
        //     }, 600);
        //
        // }

    };

    removeAvatar = () => {
        this.setState({file: '', preview: null});
        const input = '#inputAvatar';
        $(input).val('');
    };

    closeForm = () => {
        this.setState({

            personID: '',
            userID: '',
            personState: '',
            teacherState: false,
            studentState: false,
            administrativeState: false,


            preview: preview,
            file: '',
            changeImage: false,

            name: '',
            paternal: '',
            maternal: '',
            documentNumber: '',
            gender: '',
            birthDate: '',
            email: '',
            civilStatu: '',
            photo: '',
            address: '',
            cellPhone: '',

            birthUbigeoMask: '',
            birthDepartment: '',
            birthProvince: '',
            birthDistrict: '',

            residentUbigeoMask: '',
            residentDeparmet: '',
            residentProvince: '',
            residentDistrict: '',


            birthProvinces: [],
            birthDistrics: [],

            residentProvinces: [],
            residentDistrics: [],
        });
        this.props.closeForm();
    };

    render() {

        const {
            address,
            cellPhone,
            loaderPerson,
            name,
            paternal,
            maternal,
            documentNumber,
            gender,
            birthDate,
            email,
            civilStatu,
            civilStatus,
            birthDepartment,
            birthProvince,
            birthDistrict,
            residentDepartment,
            residentProvince,
            residentDistrict,

        } = this.state;

        const {
            birthDepartments,
            birthProvinces,
            birthDistrics,
            residentDepartments,
            residentProvinces,
            residentDistrics
        } = this.state;


        return (
            <Aux>


                <Modal show={true} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5"
                                     style={{color: '#ffffff'}}>{this.state.action === "add" ? "REGISTRAR PERFIL" : "ACTUALIZAR PERFIL"}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}} onClick={() => this.closeForm()}/>
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>

                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill"

                                >
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
                            <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                                <Row>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill"

                                        >
                                            <Form.Label className="floating-label"
                                                        style={documentNumber === "" ? {color: "#ff5252 "} : null}
                                            >Documento de identidad<small
                                                className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                placeholder="Documento de Identidad"
                                                onKeyPress={this.handleKeyPress}
                                                id="documentNumber"
                                                value={documentNumber}
                                                onChange={this.handleChange('documentNumber')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={name === "" ? {color: "#ff5252 "} : null}
                                            >Nombre<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                placeholder="Nombres"
                                                onKeyPress={this.handleKeyPress}
                                                id="name"
                                                value={name}
                                                onChange={this.handleChange('name')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={paternal === "" ? {color: "#ff5252 "} : null}
                                            >Apellido paterno <small className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                placeholder="Apellido Paterno"
                                                onKeyPress={this.handleKeyPress}
                                                id="paternal"
                                                value={paternal}
                                                onChange={this.handleChange('paternal')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={maternal === "" ? {color: "#ff5252 "} : null}
                                            >Apellido materno<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                placeholder="Apellido Materno"
                                                onKeyPress={this.handleKeyPress}
                                                id="maternal"
                                                value={maternal}
                                                onChange={this.handleChange('maternal')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={gender === "" ? {color: "#ff5252 "} : null}
                                            >Genero<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control as="select"
                                                          value={gender}
                                                          onChange={this.handleChange('gender')}>
                                                >
                                                <option defaultValue={true} hidden>Genero</option>
                                                <option value={"Masculino"}> Masculino</option>
                                                <option value={"Femenino"}> Femenino</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={birthDate === "" ? {color: "#ff5252 "} : null}
                                            >Fecha de nacimiento <small className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="date"
                                                className="form-control"
                                                onChange={this.handleChange('birthDate')}
                                                max="2999-12-31"
                                                value={birthDate}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={civilStatu === "" ? {color: "#ff5252 "} : null}
                                            >Estado civil <small className="text-danger"> *</small></Form.Label>
                                            <Form.Control as="select"
                                                          value={civilStatu}
                                                          onChange={this.handleChange('civilStatu')}>
                                                >
                                                <option defaultValue={true} hidden>Estado civil</option>
                                                {
                                                    civilStatus.length > 0 ?
                                                        civilStatus.map((civilStatu, index) => {
                                                            // if (bank.state) {
                                                            return (
                                                                <option value={civilStatu.id}
                                                                        key={index}>
                                                                    {civilStatu.denomination}
                                                                </option>
                                                            )
                                                            // }
                                                        }) :
                                                        <option defaultValue={true}>Error al cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={cellPhone === "" ? {color: "#ff5252 "} : null}
                                            >Celular <small className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                placeholder="Celular"
                                                onKeyPress={this.handleKeyPress}
                                                id="cellPhone"
                                                value={cellPhone}
                                                onChange={this.handleChange('cellPhone')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={email.includes('@') ? null : {color: "#ff5252 "}}
                                            >Correo<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control
                                                type="email"
                                                required
                                                onKeyPress={this.handleKeyPress}
                                                id="email"
                                                value={email}
                                                onChange={this.handleChange('email')}
                                                placeholder="Gmail"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={9} lg={9} xl={9}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={address === "" ? {color: "#ff5252 "} : null}
                                            >Dirección actual <small className="text-danger"> *</small></Form.Label>

                                            <Form.Control
                                                type="text"
                                                placeholder="Dirección"
                                                onKeyPress={this.handleKeyPress}
                                                id="address"
                                                value={address}
                                                onChange={this.handleChange('address')}
                                            />
                                        </Form.Group>
                                    </Col>

                                </Row>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={birthDistrict === "" ? {color: "#ff5252 "} : null}
                                    >Lugar de nacimiento<small className="text-danger"> *</small></Form.Label>
                                    <Row>
                                        <Col sm={4}>
                                            <Form.Control as="select"
                                                          value={birthDepartment}
                                                          onChange={this.handleChange('birthDepartment')}>
                                                >
                                                <option defaultValue={true} hidden
                                                        style={{color: "whitesmoke"}}>Departamento</option>
                                                {
                                                    birthDepartments.length > 0 ?
                                                        birthDepartments && birthDepartments.map((birthDepartment, index) => {
                                                            // if (bank.state) {
                                                            return (
                                                                <option value={birthDepartment.id}
                                                                        key={index}>
                                                                    {birthDepartment.description}
                                                                </option>
                                                            )
                                                            // }
                                                        }) :
                                                        <option defaultValue={true}>Error al
                                                            cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Control as="select"
                                                          value={birthProvince}
                                                          onChange={this.handleChange('birthProvince')}>
                                                >
                                                <option defaultValue={true} hidden>Provincia</option>
                                                {
                                                    birthProvinces.length > 0 ?
                                                        birthProvinces && birthProvinces.map((birthProvince, index) => {
                                                            return (
                                                                <option value={birthProvince.id}
                                                                        key={index}>
                                                                    {birthProvince.description}
                                                                </option>
                                                            )
                                                        }) :
                                                        <option defaultValue={true}>Error al
                                                            cargar los Datos</option>
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Control as="select"
                                                          value={birthDistrict}
                                                          onChange={this.handleChange('birthDistrict')}>
                                                >
                                                <option defaultValue={true} hidden>Distrito</option>
                                                {
                                                    birthDistrics.length > 0 ?
                                                        birthDistrics && birthDistrics.map((birthDistrict, index) => {
                                                            return (
                                                                <option value={birthDistrict.id}
                                                                        key={index}>
                                                                    {birthDistrict.description}
                                                                </option>
                                                            )
                                                        }) :
                                                        <option defaultValue={true}>Error al
                                                            cargar los Datos</option>
                                                }
                                            </Form.Control>
                                        </Col>

                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={residentDistrict === "" ? {color: "#ff5252 "} : null}
                                    >Lugar de residencia <small className="text-danger"> *</small></Form.Label>
                                    <Row>
                                        <Col sm={4}>
                                            <Form.Control as="select"
                                                          value={residentDepartment}
                                                          onChange={this.handleChange('residentDepartment')}>
                                                >
                                                <option defaultValue={true} hidden>Departamento</option>
                                                {
                                                    residentDepartments.length > 0 ?
                                                        residentDepartments && residentDepartments.map((residentDepartment, index) => {
                                                            // if (bank.state) {
                                                            return (
                                                                <option
                                                                    value={residentDepartment.id}
                                                                    key={index}>
                                                                    {residentDepartment.description}
                                                                </option>
                                                            )
                                                            // }
                                                        }) :
                                                        <option defaultValue={true}>Error al
                                                            cargar los
                                                            Datos</option>
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Control as="select"
                                                          value={residentProvince}
                                                          onChange={this.handleChange('residentProvince')}>
                                                >
                                                <option defaultValue={true} hidden>Provincia</option>
                                                {
                                                    residentProvinces.length > 0 ?
                                                        residentProvinces && residentProvinces.map((residentProvince, index) => {
                                                            return (
                                                                <option value={residentProvince.id}
                                                                        key={index}>
                                                                    {residentProvince.description}
                                                                </option>
                                                            )
                                                        }) :
                                                        <option defaultValue={true}>Error al
                                                            cargar los Datos</option>
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col sm={4}>
                                            <Form.Control as="select"
                                                          value={residentDistrict}
                                                          onChange={this.handleChange('residentDistrict')}>
                                                >
                                                <option defaultValue={true} hidden>Distrito</option>
                                                {
                                                    residentDistrics.length > 0 ?
                                                        residentDistrics && residentDistrics.map((residentDistrict, index) => {
                                                            return (
                                                                <option value={residentDistrict.id}
                                                                        key={index}>
                                                                    {residentDistrict.description}
                                                                </option>
                                                            )
                                                        }) :
                                                        <option defaultValue={true}>Error al
                                                            cargar los Datos</option>
                                                }
                                            </Form.Control>
                                        </Col>

                                    </Row>
                                </Form.Group>
                            </Col>


                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                {this.state.action === 'add' ?
                                    <Button
                                        className="pull-right"
                                        disabled={loaderPerson}
                                        variant="primary"

                                        onClick={() => this.createPersonProfile()}>
                                        {loaderPerson &&
                                            <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button> :
                                    <Button
                                        className="pull-right"
                                        disabled={loaderPerson}
                                        variant="primary"

                                        onClick={() => this.updatePersonProfile()}>
                                        {loaderPerson &&
                                            <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar Cambios</Button>
                                }
                                {
                                    this.state.documentNumber.length == 8 &&
                                    <Button

                                        disabled={loaderPerson}
                                        variant="primary"
                                        style={{float: 'left'}}

                                        onClick={() => this.consulApiReniec()}>

                                        Consultar Reniec</Button>
                                }


                                {
                                    this.state.datosReniecResult !== '' &&
                                    <div>
                                        <span
                                            style={{
                                                marginLeft: '15px',
                                                float: 'left',
                                            }}>{this.state.datosReniecResult}</span>
                                        <Button
                                            className="pull-right"
                                            disabled={loaderPerson}
                                            variant="info"
                                            style={{
                                                float: 'left', padding: 'revert', marginLeft: '15px'
                                            }}

                                            onClick={() => this.changeDataReniec()}>
                                            {loaderPerson &&
                                                <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                            Cambiar datos</Button>
                                        <br/>


                                    </div>
                                }
                            </Col>

                        </Row>
                    </Modal.Body>
                </Modal>


            </Aux>
        );
    }
}

export default ProfileForm;
