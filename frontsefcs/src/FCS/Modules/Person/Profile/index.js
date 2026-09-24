import React from 'react';
import {Card, Col, Dropdown, Form, Row} from 'react-bootstrap';

import Aux from "../../../../hoc/_Aux";

import DEMO from "../../../../store/constant";
import defaultUser from '../../../../assets/images/user/default.jpg';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';
import Study from './Perfil/Study';
import Laboral from './Perfil/Laboral';
import Curriculum from './Perfil/Curriculum';
import Workload from "./Teacher/Workload";
import ContractTeacher from "./Teacher/ContractTeacher";
import ContractAdministrative from "./Administrative/ContractAdministrative";
import Inscription from "./Student/Inscription";




moment.locale('es');


class Profile extends React.Component {
    state = {
        activeProfileTab: 'Perfil',
        isPersonalEdit: false,
        isContactEdit: false,
        isOtherEdit: false,
        organicUnit: this.props.organicUnit,
        role: '',

        profile: false,

        personID: '',
        personState: '',
        studentState: false,
        teacherState: false,
        administrativeState: false,


        preview: defaultUser,
        file: '',
        changeImage: false,
        loadImg: false,
        loaderPerson: false,

        name: '',
        paternal: '',
        maternal: '',
        documentNumber: '',
        gender: '',
        birthDate: new Date(),
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
        persons: [],

        birthDepartments: [],
        birthProvinces: [],
        birthDistrics: [],
        residentDepartments: [],
        residentProvinces: [],
        residentDistrics: [],
        //para el mode god
        orgnictUnits: [],
        roles: [],

    };

    componentDidMount() {

        this.getCivilStatus();
        this.getDepartment(2546, 'birth');
        this.getDepartment(2546, 'resident');
        this.getRole();


    };


    getRole() {
        const url = app.security + '/' + app.role;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({roles: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    //obtener persona id persona y unidad organica
    getPerson(id) {
        const url = app.person + '/' + app.persons + '/retrive-mode/' + id;
        axios.get(url, app.headers).then(res => {


            if (res.data) {
                if (res.data.Ubigeo_birth && res.data.Ubigeo_birth.Ubigeo_parent && res.data.Ubigeo_birth.Ubigeo_parent.Ubigeo_parent &&
                    res.data.Ubigeo_birth.Ubigeo_parent.Ubigeo_parent) {
                    this.getDepartment(res.data.Ubigeo_birth.Ubigeo_parent.Ubigeo_parent.id_parent, 'birth');
                    this.getProvince(res.data.Ubigeo_birth.Ubigeo_parent.id_parent || null, 'birth');
                    this.getDistrict(res.data.Ubigeo_birth.id_parent || null, 'birth');
                    this.setState({
                        birthDepartment: res.data.Ubigeo_birth ? res.data.Ubigeo_birth.Ubigeo_parent.Ubigeo_parent.id : '',
                        birthProvince: res.data.Ubigeo_birth ? res.data.Ubigeo_birth.Ubigeo_parent.id : '',
                        birthDistrict: res.data.Ubigeo_birth ? res.data.Ubigeo_birth.id : '',
                        birthUbigeoMask: res.data.Ubigeo_birth.name + '-' + res.data.Ubigeo_birth.Ubigeo_parent.name + ',' + res.data.Ubigeo_birth.Ubigeo_parent.Ubigeo_parent.name
                    });
                }

                if (res.data.Ubigeo_resident && res.data.Ubigeo_resident.Ubigeo_parent && res.data.Ubigeo_resident.Ubigeo_parent.Ubigeo_parent &&
                    res.data.Ubigeo_resident.Ubigeo_parent.Ubigeo_parent) {

                    this.getDepartment(res.data.Ubigeo_resident.Ubigeo_parent.Ubigeo_parent.id_parent || null, 'resident');
                    this.getProvince(res.data.Ubigeo_resident.Ubigeo_parent.id_parent || null, 'resident');
                    this.getDistrict(res.data.Ubigeo_resident.id_parent || null, 'resident');
                    this.setState({
                        residentDeparment: res.data.Ubigeo_resident ? res.data.Ubigeo_resident.Ubigeo_parent.Ubigeo_parent.id : '',
                        residentProvince: res.data.Ubigeo_resident ? res.data.Ubigeo_resident.Ubigeo_parent.id : '',
                        residentDistrict: res.data.Ubigeo_resident ? res.data.Ubigeo_resident.id : '',
                        residentUbigeoMask: res.data.Ubigeo_resident.name + '-' + res.data.Ubigeo_resident.Ubigeo_parent.name + ',' + res.data.Ubigeo_resident.Ubigeo_parent.Ubigeo_parent.name
                    });
                }

                this.setState({

                    action: 'update',
                    persons: res.data,
                    personState: res.data.state,
                    personID: res.data.id || '',
                    userID: res.data.User.id || '',


                    preview: res.data.photo ? app.server + 'photography/' + res.data.photo : defaultUser,
                    changeImage: true,


                    name: res.data.name || '',
                    paternal: res.data.paternal || '',
                    maternal: res.data.maternal || '',
                    documentNumber: res.data.document_number || '',
                    gender: res.data.gender || '',
                    address: res.data.address || '',
                    cellPhone: res.data.cell_phone || '',

                    birthDate: res.data.birth_date || '',
                    birthDateMask: moment(res.data.birth_date).format('LL') || '',

                    email: res.data.email || '',
                    civilStatu: res.data.id_civil_status || '',
                    civilStatuMask: res.data.Civil_status.denomination || '',
                    photo: res.data.photo || '',
                    studentState: res.data.User.student_state,
                    teacherState: res.data.User.teacher_state,
                    administrativeState: res.data.User.administrative_state,

                })


            }
        }).catch(err => {
            console.log(err.response);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

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

    savePerson() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.persons;
        const {
            studentState,
            teacherState,
            administrativeState,
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
            && birthDate !== '' && email !== '' && civilStatu !== '' && birthDistrict !== '' && residentDistrict !== '' && validateEmail) {
            let data = new FormData();
            if (file !== '') {
                data.set('avatar', 'change');
                data.set('photo', file);
            } else {
                data.set('avatar', 'empty');
            }
            data.set('name', name);
            data.set('paternal', paternal);
            data.set('maternal', maternal);
            data.set('document_number', documentNumber);
            data.set('gender', gender);
            data.set('birth_date', moment(birthDate).format('YYYY-MM-DD'));
            data.set('email', email);
            data.set('id_civil_status', civilStatu);
            data.set('cell_phone', cellPhone);
            data.set('address', address);
            data.set('id_ubigeo_birth', birthDistrict);
            data.set('id_ubigeo_resident', residentDistrict);
            data.set('student_state', studentState);
            data.set('teacher_state', teacherState);
            data.set('administrative_state', administrativeState);

            axios.post(url, data, app.headers).then((res) => {

                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
                this.getPerson(res.data.id);
                this.setState({personID: res.data.id});
                this.setState({loaderPerson: false});
                this.setState({isPersonalEdit: !this.state.isPersonalEdit});

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

    updatePerson(id) {
        this.setState({disabled: true})
        const url = app.person + '/' + app.persons + '/' + id;
        const {
            organicUnit,
            name, paternal, maternal, documentNumber, gender, birthDate, email, civilStatu,
            studentState, teacherState, administrativeState,
            cellPhone, address, birthDistrict, residentDistrict
        } = this.state;
        if (name !== '' && paternal !== '' && maternal !== '' && documentNumber !== '' && gender !== ''
            && birthDate !== '' && email !== '' && civilStatu !== '' && birthDistrict !== '' && residentDistrict !== '') {
            let data = new FormData();
            data.set('name', name);
            data.set('paternal', paternal);
            data.set('maternal', maternal);
            data.set('document_number', documentNumber);
            data.set('gender', gender);
            data.set('birth_date', moment(birthDate).format('YYYY-MM-DD'));
            data.set('email', email);
            data.set('id_civil_status', civilStatu);

            data.set('cell_phone', cellPhone);
            data.set('address', address);
            data.set('id_ubigeo_birth', birthDistrict);
            data.set('id_ubigeo_resident', residentDistrict);
            data.set('id_organic_unit', organicUnit);
            data.set('student_state', studentState);
            data.set('teacher_state', teacherState);
            data.set('administrative_state', administrativeState);


            axios.patch(url, data, app.headers).then((res) => {
                this.getPerson(res.data.id);
                this.setState({personID: res.data.id});
                this.setState({isPersonalEdit: !this.state.isPersonalEdit});
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

    disabledPerson(id) {
        const url = app.person + '/' + app.persons + '/' + id;
        axios.delete(url, app.headers).then(res => {
            this.getPerson(id);

            PNotify.success({
                title: "Finalizado",
                text: 'Exito',
                delay: 2000
            });

        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    // Ubigeo Functions
    getDepartment(id_padre, type) {
        const url = app.general + app.UbigeoNacional + '/' + id_padre;
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

    getProvince(id_padre, type) {
        const url = app.general + app.UbigeoNacional + '/' + id_padre;
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

    getDistrict(id_padre, type) {
        const url = app.general + app.UbigeoNacional + '/' + id_padre;
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
                if (event.target.value === 'false') {
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


            case 'role':
                this.setState({role: event.target.value});
                break;
            case 'organicUnit':
                this.setState({organicUnit: event.value});
                break;

            default:
                break;
        }
    };
    //formulario vacio
    newProfile = () => {
        this.setState({profile: true, isPersonalEdit: true, action: 'add'});
    };
    // datos de la persona seleccionada
    selectedPerson = (r) => {

        this.getPerson(r.id);
        this.setState({
            profile: true,
            isPersonalEdit: false,
            personID: r.id,
            userID: r.User.id,

            activeProfileTab: 'Perfil',
        });
    };
    // cerrar Profile y abir busqueda
    closeProfile = () => {
        this.setState({
            action: 'add',
            profile: false,
            activeProfileTab: 'Perfil',
            personID: '',
            userID: '',
            personState: '',
            teacherState: false,
            studentState: false,
            administrativeState: false,


            preview: defaultUser,
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


            persons: [],


            birthProvinces: [],
            birthDistrics: [],

            residentProvinces: [],
            residentDistrics: [],
        });
        this.props.openSearch()
    };
    openFileReader = () => {
        const input = '#inputAvatar';
        $(input).click();
    };
    changeAvatar = (event) => {
        const fileExtension = ['jpg'];
        const input = '#inputAvatar';
        let value = $(input).val().split('.').pop().toLowerCase();
        if ($.inArray(value, fileExtension) === -1) {
            let message = "Por favor use estos formatos: " + fileExtension.join(', ');
            PNotify.warning({title: "Error", text: message, delay: 2000});
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onload = () => {
                this.setState({
                    file: file,
                    preview: reader.result,
                    status: true
                });
            };
            reader.readAsDataURL(file);
        }
        if (this.state.changeImage) {
            setTimeout(() => {
                this.changeImage(this.state.personID);
            }, 600);

        }

    };


    removeAvatar = () => {
        this.setState({file: '', preview: null});
        const input = '#inputAvatar';
        $(input).val('');
    };

    handleContractTeacher = () => {
        this.ContractTeacher.getRoles();
        this.ContractTeacher.getCharges();
        this.ContractTeacher.getContractTypes();
        this.ContractTeacher.getContractsByUser();
        this.setState({activeProfileTab: 'Teacher'});
        !this.state.organicUnit && this.ContractTeacher.getUnitOrganic();
    };

    handleContractAdministrative = () => {
        this.ContractAdministrative.getRoles();
        this.ContractAdministrative.getCharges();
        this.ContractAdministrative.getContractTypes();
        this.ContractAdministrative.getContractsByUser();
        this.setState({activeProfileTab: 'Administrative'});
        !this.state.organicUnit && this.ContractAdministrative.getUnitOrganic();
    };

    handleStudent = () => {
        // this.state.organicUnit && this.Registration.getStudentMention(this.state.organicUnit);
        this.state.organicUnit && this.Inscription.getProgram(this.state.organicUnit);
        this.setState({activeProfileTab: 'Student'});

    };

    render() {
        const profileTabClass = 'nav-link text-reset';
        const profileTabActiveClass = 'nav-link text-reset active';

        const profilePanClass = 'tab-pane fade';
        const profilePanActiveClass = 'tab-pane fade show active';

        const {profile} = this.state;

        //state backend
        const {
            personID,
            address,
            cellPhone,
            studentState,
            administrativeState,
            teacherState,
            preview,
            personState,
            loadImg,
            civilStatuMask,
            name,
            paternal,
            maternal,
            documentNumber,
            gender,
            birthDate,
            birthDateMask,
            email,
            civilStatu,
            civilStatus,
            birthUbigeoMask,
            birthDepartment,
            birthProvince,
            birthDistrict,
            residentUbigeoMask,
            residentDepartment,
            residentProvince,
            residentDistrict,

        } = this.state;

        const {
            action,
            loaderPerson,
            birthDepartments,
            birthProvinces,
            birthDistrics,
            residentDepartments,
            residentProvinces,
            residentDistrics
        } = this.state;


        return (
            <Aux>
                {profile &&
                <>
                    <div className='user-profile user-card mb-4' style={{marginTop: '70px'}}>
                        <Card.Header className='border-0 p-0 pb-0 pt-10'>
                            <div className="cover-img-block">
                                <div className="overlay"/>
                                <div className="change-cover">
                                    <Dropdown onClick={this.closeProfile}>
                                        <Dropdown.Toggle variant="link" id="dropdown-basic"
                                                         className='drp-icon text-white'>
                                            <i className="feather icon-x"/>
                                        </Dropdown.Toggle>

                                    </Dropdown>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className='py-0'>
                            <div className="user-about-block m-0">
                                <Row>
                                    <Col md={4} className='text-center mt-n5'>
                                        <div className="change-profile text-center">

                                            <Dropdown className='w-auto d-inline-block'>
                                                <Dropdown.Toggle as='a' variant="link" id="dropdown-basic">

                                                    <div className="profile-dp">

                                                        <div className="position-relative d-inline-block">
                                                            {loadImg &&
                                                            <span className="spinner-border spinner-border-sm mr-1"
                                                                  role="status"/>}
                                                            <img className="img-radius img-fluid wid-100"
                                                                 src={preview || defaultUser}
                                                                 alt="User"/>
                                                        </div>
                                                        <div className="overlay">
                                                            <span>Opciones</span>
                                                            <input
                                                                type="file"
                                                                id="inputAvatar"
                                                                style={{display: 'none'}}
                                                                onChange={(event) => this.changeAvatar(event)}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="certificated-badge">
                                                        {personState ? <>
                                                                <i className="fas fa-certificate text-c-blue bg-icon"/>
                                                                <i className="fas fa-check front-icon text-white"/>
                                                            </>
                                                            :
                                                            <>
                                                                <i className="fas fa-certificate text-c-yellow bg-icon"/>
                                                                <i className="fas fa-exclamation front-icon text-white ml-1"/>
                                                            </>
                                                        }
                                                    </div>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu as='ul'
                                                               className="list-unstyled card-option">

                                                    {personID ?
                                                        <>
                                                            <Dropdown.Item as='li'
                                                                           onClick={this.openFileReader}
                                                                           className="dropdown-item">
                                                                         <span type="button">
                                                                             <i
                                                                                 className={'feather icon-image'}/> Cambiar Foto
                                                                             </span>
                                                            </Dropdown.Item>
                                                            {personState ?
                                                                <Dropdown.Item as='li'
                                                                               onClick={() => this.disabledPerson(personID)}
                                                                               className="dropdown-item">

                                                                              <span type="button">
                                                                                  <i className={'feather icon-x'}/> Deshabilitar
                                                                              </span>
                                                                </Dropdown.Item>
                                                                :
                                                                <Dropdown.Item as='li'
                                                                               onClick={() => this.disabledPerson(personID)}
                                                                               className="dropdown-item">
                                                                                <span type="button">
                                                                                 <i
                                                                                     className={'feather icon-user-check'}/> Habilitar
                                                                                 </span>
                                                                </Dropdown.Item>
                                                            }
                                                        </>
                                                        :
                                                        <Dropdown.Item as='li'
                                                                       onClick={this.openFileReader}
                                                                       className="dropdown-item">

                                                             <span type="button">
                                                                 <i
                                                                     className={'feather icon-image'}/> Añadir Foto
                                                                 </span>
                                                        </Dropdown.Item>
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        {documentNumber ?
                                            <>
                                                <h5 className="mb-1">{name + ' ' + paternal + ' ' + maternal}</h5>
                                                <p className="mb-2 text-muted">{documentNumber}</p>
                                            </>
                                            :
                                            <>
                                                <h5 className="mb-1">No definido</h5>
                                                <p className="mb-2 text-muted">No definido</p>
                                            </>
                                        }

                                    </Col>
                                    <Col md={8} className='mt-md-4'>
                                        <Row>
                                            <Col>
                                                <a href={DEMO.BLANK_LINK}
                                                   className="mb-1 text-muted d-flex align-items-end text-h-primary"><i
                                                    className="feather icon-globe mr-2 f-18"/>{email || 'No definido'}
                                                </a>
                                                <div className="clearfix"/>
                                                <a href="mailto:demo@domain.com"
                                                   className="mb-1 text-muted d-flex align-items-end text-h-primary"><i
                                                    className="feather icon-mail mr-2 f-18"/>{email || 'No definido'}
                                                </a>
                                                <div className="clearfix"/>
                                                <a href={DEMO.BLANK_LINK}
                                                   className="mb-1 text-muted d-flex align-items-end text-h-primary"><i
                                                    className="feather icon-phone mr-2 f-18"/>{cellPhone || 'No definido'}
                                                </a>
                                            </Col>
                                            <Col>
                                                <div className="media">
                                                    <i className="feather icon-map-pin mr-2 mt-1 f-18"/>
                                                    <div className="media-body">
                                                        <p className="mb-0 text-muted">{residentUbigeoMask.toUpperCase() || 'No definido'}</p>
                                                        <p className="mb-0 text-muted">{address.toUpperCase() || ''}</p>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col md={12}>
                                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab"
                                            role="tablist">
                                            <li className="nav-item">
                                                <a className={this.state.activeProfileTab === 'Perfil' ? profileTabActiveClass : profileTabClass}
                                                   onClick={() => {
                                                       this.setState({activeProfileTab: 'Perfil'})
                                                   }} id="Perfil-tab" href={DEMO.BLANK_LINK}>
                                                    <i className="feather icon-user mr-2"/>Perfil</a>
                                                {/*<i className="material-icons mr-2">close</i>Perfil</a>*/}
                                            </li>
                                            {!this.state.isPersonalEdit &&
                                            <>
                                                {teacherState &&
                                                <li className="nav-item">
                                                    <a className={this.state.activeProfileTab === 'Teacher' ? profileTabActiveClass : profileTabClass}
                                                       onClick={() => this.handleContractTeacher()} id="profile-tab"
                                                       href={DEMO.BLANK_LINK}><i
                                                        className="feather icon-briefcase mr-2"/>Docente</a>
                                                </li>}
                                                {studentState &&
                                                <li className="nav-item">
                                                    <a className={this.state.activeProfileTab === 'Student' ? profileTabActiveClass : profileTabClass}
                                                       onClick={() => this.handleStudent()}
                                                       id="contact-tab" href={DEMO.BLANK_LINK}><i
                                                        className="feather icon-book mr-2"/>Estudiante</a>
                                                </li>}
                                                {administrativeState &&
                                                <li className="nav-item">
                                                    <a className={this.state.activeProfileTab === 'Administrative' ? profileTabActiveClass : profileTabClass}
                                                       onClick={() => this.handleContractAdministrative()}
                                                       id="gallery-tab" href={DEMO.BLANK_LINK}><i
                                                        className="feather icon-bookmark mr-2"/>Administrativo</a>
                                                </li>}
                                            </>
                                            }
                                        </ul>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </div>
                    <Row>
                        <Col md={12} className='order-md-2'>
                            <div className="tab-content">
                                <div
                                    className={this.state.activeProfileTab === 'Perfil' ? profilePanActiveClass : profilePanClass}
                                    id='Perfil'>
                                    <Row>
                                        <Col md={5}>
                                            <Card>
                                                <Card.Body
                                                    className='d-flex align-items-center justify-content-between'>
                                                    <h5 className="mb-0">Información Personal</h5>
                                                    <button type="button"
                                                            className="btn btn-primary btn-sm rounded m-0 float-right"
                                                            onClick={() => this.setState({isPersonalEdit: !this.state.isPersonalEdit})}>
                                                        <i className={this.state.isPersonalEdit ? 'feather icon-x' : 'feather icon-edit'}/>
                                                    </button>
                                                </Card.Body>
                                                <Card.Body
                                                    className={this.state.isPersonalEdit ? 'border-top pro-det-edit collapse' : 'border-top pro-det-edit collapse show'}>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">DNI</label>
                                                        <Col sm={9}>
                                                            {documentNumber}
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Nombres</label>
                                                        <Col sm={9}>
                                                            {name + ' ' + maternal + ' ' + paternal}
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Sexo</label>
                                                        <Col sm={9}>
                                                            {gender}
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Celular</label>
                                                        <Col sm={9}>
                                                            {cellPhone}
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Fecha
                                                            de Nacimiento</label>
                                                        <Col sm={9}>
                                                            {birthDateMask}
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Estado
                                                            Civil</label>
                                                        <Col sm={9}>
                                                            {civilStatuMask}
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Residencia</label>
                                                        <Col sm={9}>
                                                            <p className="mb-0 text-muted">{address}</p>
                                                            <p className="mb-0 text-muted">{residentUbigeoMask}</p>

                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Lugar
                                                            Nacimiento</label>
                                                        <Col sm={9}>

                                                            <p className="mb-0 text-muted">{birthUbigeoMask}</p>

                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                                <Card.Body
                                                    className={this.state.isPersonalEdit ? 'border-top pro-det-edit collapse show' : 'border-top pro-det-edit collapse'}>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">DNI</label>
                                                        <Col sm={9}>
                                                            <input type="text" className="form-control"
                                                                   placeholder="Documento de Identidad"
                                                                   onKeyPress={this.handleKeyPress}
                                                                   id="documentNumber"
                                                                   value={documentNumber}
                                                                   onChange={this.handleChange('documentNumber')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Nombres</label>
                                                        <Col sm={9}>
                                                            <input type="text" className="form-control"
                                                                   placeholder="Nombres"
                                                                   onKeyPress={this.handleKeyPress}
                                                                   id="name"
                                                                   value={name}
                                                                   onChange={this.handleChange('name')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Apellido
                                                            Paterno</label>
                                                        <Col sm={9}>
                                                            <input type="text" className="form-control"
                                                                   placeholder="Apellido Paterno"
                                                                   onKeyPress={this.handleKeyPress}
                                                                   id="paternal"
                                                                   value={paternal}
                                                                   onChange={this.handleChange('paternal')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Apellido
                                                            Materno</label>
                                                        <Col sm={9}>
                                                            <input type="text" className="form-control"
                                                                   placeholder="Apellido Materno"
                                                                   onKeyPress={this.handleKeyPress}
                                                                   id="maternal"
                                                                   value={maternal}
                                                                   onChange={this.handleChange('maternal')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Genero</label>
                                                        <Col sm={9}>
                                                            <div
                                                                className="custom-control custom-radio custom-control-inline">
                                                                <input type="radio" id="customRadioInline1"
                                                                       name="customRadioInline1"
                                                                       className="custom-control-input"
                                                                       onChange={this.handleChange('gender')}
                                                                       checked={gender === "Masculino"}
                                                                       value='Masculino'

                                                                />
                                                                <label className="custom-control-label"
                                                                       htmlFor="customRadioInline1">Masculino</label>
                                                            </div>
                                                            <div
                                                                className="custom-control custom-radio custom-control-inline">
                                                                <input type="radio" id="customRadioInline2"
                                                                       name="customRadioInline1"
                                                                       className="custom-control-input"
                                                                       onChange={this.handleChange('gender')}
                                                                       checked={gender === "Femenino"}
                                                                       value='Femenino'
                                                                />
                                                                <label className="custom-control-label"
                                                                       htmlFor="customRadioInline2">Femenino</label>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Fecha
                                                            de nacimiento</label>
                                                        <Col sm={9}>
                                                            <input type="date"

                                                                   className="form-control"
                                                                   onChange={this.handleChange('birthDate')}
                                                                   max="2999-12-31"
                                                                   value={birthDate}
                                                            />

                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Estado
                                                            Civil</label>
                                                        <Col sm={9}>
                                                            <Form.Control as="select"
                                                                          value={civilStatu}
                                                                          onChange={this.handleChange('civilStatu')}>
                                                                >
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    una
                                                                    opcción</option>
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
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Celular</label>
                                                        <Col sm={9}>
                                                            <input type="text" className="form-control"
                                                                   placeholder="Celular"
                                                                   onKeyPress={this.handleKeyPress}
                                                                   id="cellPhone"
                                                                   value={cellPhone}
                                                                   onChange={this.handleChange('cellPhone')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Gmail</label>
                                                        <Col sm={9}>
                                                            <input type="text" className="form-control"
                                                                   onKeyPress={this.handleKeyPress}
                                                                   id="email"
                                                                   value={email}
                                                                   onChange={this.handleChange('email')}
                                                                   placeholder="Gmail"
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Nacimiento</label>
                                                        <Col sm={9}>
                                                            <Row>
                                                                <Col sm={12}>
                                                                    <Form.Control as="select"
                                                                                  value={birthDepartment}
                                                                                  onChange={this.handleChange('birthDepartment')}>
                                                                        >
                                                                        <option defaultValue={true} hidden>Por favor
                                                                            seleccione una opcción</option>
                                                                        {
                                                                            birthDepartments.length > 0 ?
                                                                                birthDepartments && birthDepartments.map((birthDepartment, index) => {
                                                                                    // if (bank.state) {
                                                                                    return (
                                                                                        <option value={birthDepartment.id}
                                                                                                key={index}>
                                                                                            {birthDepartment.name}
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
                                                                <Col sm={12}>
                                                                    <Form.Control as="select"
                                                                                  value={birthProvince}
                                                                                  onChange={this.handleChange('birthProvince')}>
                                                                        >
                                                                        <option defaultValue={true} hidden>Por favor
                                                                            seleccione una opcción</option>
                                                                        {
                                                                            birthProvinces.length > 0 ?
                                                                                birthProvinces && birthProvinces.map((birthProvince, index) => {
                                                                                    return (
                                                                                        <option value={birthProvince.id}
                                                                                                key={index}>
                                                                                            {birthProvince.name}
                                                                                        </option>
                                                                                    )
                                                                                }) :
                                                                                <option defaultValue={true}>Error al
                                                                                    cargar los Datos</option>
                                                                        }
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col sm={12}>
                                                                    <Form.Control as="select"
                                                                                  value={birthDistrict}
                                                                                  onChange={this.handleChange('birthDistrict')}>
                                                                        >
                                                                        <option defaultValue={true} hidden>Por favor
                                                                            seleccione una opcción</option>
                                                                        {
                                                                            birthDistrics.length > 0 ?
                                                                                birthDistrics && birthDistrics.map((birthDistrict, index) => {
                                                                                    return (
                                                                                        <option value={birthDistrict.id}
                                                                                                key={index}>
                                                                                            {birthDistrict.name}
                                                                                        </option>
                                                                                    )
                                                                                }) :
                                                                                <option defaultValue={true}>Error al
                                                                                    cargar los Datos</option>
                                                                        }
                                                                    </Form.Control>
                                                                </Col>

                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Residencia</label>
                                                        <Col sm={9}>
                                                            <Row>
                                                                <Col sm={12}>
                                                                    <Form.Control as="select"
                                                                                  value={residentDepartment}
                                                                                  onChange={this.handleChange('residentDepartment')}>
                                                                        >
                                                                        <option defaultValue={true} hidden>Por favor
                                                                            seleccione una opcción</option>
                                                                        {
                                                                            residentDepartments.length > 0 ?
                                                                                residentDepartments && residentDepartments.map((residentDepartment, index) => {
                                                                                    // if (bank.state) {
                                                                                    return (
                                                                                        <option
                                                                                            value={residentDepartment.id}
                                                                                            key={index}>
                                                                                            {residentDepartment.name}
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
                                                                <Col sm={12}>
                                                                    <Form.Control as="select"
                                                                                  value={residentProvince}
                                                                                  onChange={this.handleChange('residentProvince')}>
                                                                        >
                                                                        <option defaultValue={true} hidden>Por favor
                                                                            seleccione una opcción</option>
                                                                        {
                                                                            residentProvinces.length > 0 ?
                                                                                residentProvinces && residentProvinces.map((residentProvince, index) => {
                                                                                    return (
                                                                                        <option value={residentProvince.id}
                                                                                                key={index}>
                                                                                            {residentProvince.name}
                                                                                        </option>
                                                                                    )
                                                                                }) :
                                                                                <option defaultValue={true}>Error al
                                                                                    cargar los Datos</option>
                                                                        }
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col sm={12}>
                                                                    <Form.Control as="select"
                                                                                  value={residentDistrict}
                                                                                  onChange={this.handleChange('residentDistrict')}>
                                                                        >
                                                                        <option defaultValue={true} hidden>Por favor
                                                                            seleccione una opcción</option>
                                                                        {
                                                                            residentDistrics.length > 0 ?
                                                                                residentDistrics && residentDistrics.map((residentDistrict, index) => {
                                                                                    return (
                                                                                        <option value={residentDistrict.id}
                                                                                                key={index}>
                                                                                            {residentDistrict.name}
                                                                                        </option>
                                                                                    )
                                                                                }) :
                                                                                <option defaultValue={true}>Error al
                                                                                    cargar los Datos</option>
                                                                        }
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col sm={12}>
                                                                    <input type="text" className="form-control"
                                                                           placeholder="Dirección"
                                                                           onKeyPress={this.handleKeyPress}
                                                                           id="address"
                                                                           value={address}
                                                                           onChange={this.handleChange('address')}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label
                                                            className="col-sm-3 col-form-label font-weight-bolder">Usuarios</label>
                                                        <Col sm={9}>
                                                            <Row>
                                                                <Col sm={12}>
                                                                    <label>Estudiante</label>
                                                                    <div
                                                                        className="custom-control custom-switch pull-right">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input pull-right"
                                                                               id="customSwitche"
                                                                               readOnly
                                                                               onChange={this.handleChange('studentState')}
                                                                               checked={studentState}
                                                                               value={studentState}
                                                                        />
                                                                        <label
                                                                            className="custom-control-label pull-right"
                                                                            htmlFor="customSwitche"/>
                                                                    </div>
                                                                </Col>
                                                                <Col sm={12}>
                                                                    <label>Docente</label>
                                                                    <div
                                                                        className="custom-control custom-switch pull-right">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input pull-right"
                                                                               id="customSwitcht"
                                                                               readOnly
                                                                               onChange={this.handleChange('teacherState')}
                                                                               checked={teacherState}
                                                                               value={teacherState}
                                                                        />
                                                                        <label
                                                                            className="custom-control-label pull-right"
                                                                            htmlFor="customSwitcht"/>
                                                                    </div>
                                                                </Col>
                                                                <Col sm={12}>
                                                                    <label>Administrativo</label>
                                                                    <div
                                                                        className="custom-control custom-switch pull-right">
                                                                        <input type="checkbox"
                                                                               className="custom-control-input pull-right"
                                                                               id="customSwitcha"
                                                                               readOnly
                                                                               onChange={this.handleChange('administrativeState')}
                                                                               checked={administrativeState}
                                                                               value={administrativeState}
                                                                        />
                                                                        <label
                                                                            className="custom-control-label pull-right"
                                                                            htmlFor="customSwitcha"/>
                                                                    </div>
                                                                </Col>

                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <Row className="form-group">
                                                        <label className="col-sm-3 col-form-label"/>
                                                        <Col sm={9}>
                                                            {action === 'add' ?
                                                                <button type="submit" className="btn btn-primary"
                                                                        onClick={() => this.savePerson()}>
                                                                    {loaderPerson && <span
                                                                        className="spinner-border spinner-border-sm mr-1"
                                                                        role="status"/>}
                                                                    Guardar

                                                                </button>
                                                                :
                                                                <button type="submit" className="btn btn-primary"
                                                                        onClick={() => this.updatePerson(this.state.personID)}>
                                                                    {loaderPerson && <span
                                                                        className="spinner-border spinner-border-sm mr-1"
                                                                        role="status"/>}
                                                                    Guardar Cambios

                                                                </button>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>

                                        </Col>
                                        <Col md={7}>
                                            {!this.state.isPersonalEdit && this.state.personID &&
                                            <>
                                                < Study personID={this.state.personID} personDNI={documentNumber}/>
                                                < Laboral personID={this.state.personID} personDNI={documentNumber}/>
                                                < Curriculum personID={this.state.personID} personDNI={documentNumber}/>
                                            </>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                                <div
                                    className={this.state.activeProfileTab === 'Teacher' ? profilePanActiveClass : profilePanClass}
                                    id='Teacher'>
                                    <Row>
                                        <Col md={6}>
                                            <ContractTeacher
                                                userID={this.state.userID}
                                                ref={(ref) => this.ContractTeacher = ref}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Workload/>
                                        </Col>
                                    </Row>
                                </div>
                                <div
                                    className={this.state.activeProfileTab === 'Student' ? profilePanActiveClass : profilePanClass}
                                    id='Student'>
                                    <Row>
                                        <Col md={12}>
                                            {
                                                this.state.userID &&
                                                <Inscription organicUnit={this.props.organicUnit}
                                                             userID={this.state.userID}
                                                             ref={(ref) => this.Inscription = ref}
                                                />
                                            }
                                        </Col>
                                        {/*<Col md={12}>*/}

                                        {/*    <div className="container">*/}
                                        {/*        <div className="row justify-content-center">*/}
                                        {/*            <div className="text-center">*/}
                                        {/*                <h5 className="text-muted mb-4">Modulo ESTUDIANTE, EN CONSTRUCCIÓN, pre-inscripción,matrículas, programas de estudio,*/}
                                        {/*                    rendimiento*/}
                                        {/*                    academico, pagos</h5>*/}
                                        {/*                <img src={imgMaintenance} alt="" className="img-fluid"/>*/}


                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}

                                        {/*</Col>*/}
                                    </Row>
                                </div>
                                <div
                                    className={this.state.activeProfileTab === 'Administrative' ? profilePanActiveClass : profilePanClass}
                                    id='Administrative'>
                                    <Row>
                                        <Col md={6}>
                                            <ContractAdministrative
                                                userID={this.state.userID}
                                                ref={(ref) => this.ContractAdministrative = ref}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
                }
            </Aux>
        );
    }
}

export default Profile
