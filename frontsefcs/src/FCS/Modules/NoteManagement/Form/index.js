import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';

import Aux from "../../../../hoc/_Aux";
import defaultPhoto from '../../../../assets/images/user/default.jpg';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';
import component from "../../../Component";
import Select from "react-select";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";
import {FileInput} from "react-bootstrap4-form-validation";
import {Link} from "react-router-dom";
import Person from "@material-ui/icons/Person";

moment.locale('es');


class StudentForm extends React.Component {
    state = {

        /*LoadersStates*/
        action: "add",
        admissionPlanLoader: false,
        costAdmissionLoader: false,
        studentState: false,
        existPerson: false,
        form: false,
        preview: defaultPhoto,
        file: '',
        changeImage: false,
        loadImg: false,
        loaderPerson: false,

        personID: '',
        namePersonMask: '',
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


        program: this.props.programID,
        admissionPlan: this.props.admissionPlanID,
        studyPlan: this.props.studyPlanID,
        process: this.props.process,
        organicUnit: this.props.organicUnitID,
        workPlan: "",
        costAdmission: "",
        concept: "",
        studyPlanMask: "",


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
        programs: [],
        admissionPlans: [],
        workPlans: [],
        costAdmissions: [],


        voucherCode: "",
        voucherAmount: "",
        voucherDate: "",
        voucherFile: "",
        voucherUrl: "",

        studentModal: false,

    };

    async componentDidMount() {

        this.props.admissionPlanID !== "" && this.listConceptsInscriptionWeb(this.props.admissionPlanID);
        this.getCivilStatus();
        this.getDepartment(2546, 'birth');
        this.getDepartment(2546, 'resident');


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.admissionPlanID !== this.props.admissionPlanID) {
            if (this.props.admissionPlanID !== "") {
                this.listConceptsInscriptionWeb(this.props.admissionPlanID);
                this.setState({admissionPlan: this.props.admissionPlanID})
            }
        }
        if (prevProps.programID !== this.props.programID) {
            this.setState({program: this.props.programID})
        }
        if (prevProps.studyPlanID !== this.props.studyPlanID) {
            this.setState({studyPlan: this.props.studyPlanID})
        }
        if (prevProps.process !== this.props.process) {
            this.setState({process: this.props.process})
        }
        if (prevProps.organicUnitID !== this.props.organicUnitID) {
            this.setState({organicUnit: this.props.organicUnitID,})
        }
        if (prevProps.retriveData !== this.props.retriveData) {
            this.props.retriveData !== "" && this.retriveData(this.props.retriveData);
        }
        if (prevProps.deleteStudentID !== this.props.deleteStudentID) {
            this.props.deleteStudentID !== "" && this.openStudentSweetAlert(this.props.deleteStudentID);
        }
        if (prevProps.formModal !== this.props.formModal) {
            this.setState({formModal: this.props.formModal});
        }
    }

    //obtener persona id persona y unidad organica

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
                    })

                }

                this.setState({validateDniLoader: false});

            } catch (err) {
                this.setState({validateDniLoader: false});
                // PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 9000});

            }
        }

    };

    async listAdmissionPlanByProgramIDS(id_program) {
        this.setState({admissionPlanLoader: true});
        const url = app.programs + '/' + app.admissionPlan + '/' + app.program + '/' + id_program + '/s';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({admissionPlans: res.data});
            }
            this.setState({admissionPlanLoader: false});
        } catch (err) {
            this.setState({admissionPlanLoader: false});
            console.log(err)
        }
    };

    async listConceptsInscriptionWeb(id_admission_plan) {
        this.setState({costAdmissionLoader: true});
        const url = app.general + '/' + app.concepts + '/inscription/' + id_admission_plan + '/web';
        try {
            const res = await axios.get(url, app.headers);

            if (res.data !== "") {

                this.setState({costAdmissions: res.data});
            }
            this.setState({costAdmissionLoader: false});

        } catch (err) {
            // PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Grados Academicos", delay: 2000});
            this.setState({costAdmissionLoader: false});
            console.log(err)

        }

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

    createPersonStudent() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.persons + '/' + app.student;
        const {
            studentState,
            organicUnit,
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
            residentDistrict,
            admissionPlan,
            costAdmission,
            concept,
            program,
            studyPlan,
            process,

        } = this.state;
        console.log(organicUnit.value, admissionPlan, costAdmission, concept, program, studyPlan);
        let validateEmail = this.validateEmail(email);
        if (name !== '' && paternal !== '' && maternal !== '' && documentNumber !== '' && gender !== '' && cellPhone !== '' && address !== ''
            && birthDate !== '' && email !== '' && civilStatu !== '' && birthDistrict !== '' && residentDistrict !== '' && validateEmail &&
            admissionPlan !== '' && costAdmission !== '' && concept !== '' && program !== '' && studyPlan !== '' && process !== ''

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
            data.set('student_state', studentState);

            data.set('id_organic_unit', organicUnit);

            data.set('id_admission_plan', admissionPlan);
            data.set('id_cost_admission', costAdmission);
            data.set('id_concept', concept);
            data.set('id_program', program);
            data.set('id_plan', studyPlan);
            data.set('id_process', process);


            axios.post(url, data, app.headers).then((res) => {

                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData()
                this.closeForm();

            }).catch((err) => {


                this.setState({loaderPerson: false})
                PNotify.error({title: "Oh no!", text: err.response.data.err, delay: 2000});
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

    async createStudentProgram() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.student;

        const {
            organicUnit, admissionPlan, workPlan, costAdmission, concept, program, studyPlan, process, personID
        } = this.state;


        if (organicUnit !== '' && admissionPlan !== '' && costAdmission !== '' && concept !== '' && program !== '' && studyPlan !== '' && process !== '' &&
            personID !== ''
        ) {
            let data = new FormData();
            data.set("id_person", this.state.personID);
            data.set('id_organic_unit', organicUnit);

            data.set('id_admission_plan', admissionPlan);
            data.set('id_cost_admission', costAdmission);
            data.set('id_concept', concept);
            data.set('id_program', program);
            data.set('id_plan', studyPlan);
            data.set('id_process', process);


            try {
                const res = await axios.post(url, data, app.headers);

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData()
                this.closeForm();

            } catch (err) {
                this.setState({loaderPerson: false});
                PNotify.error({title: "Oh no!", text: err.response.data.error, delay: 2000});

            }
        } else {
            this.setState({loaderPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }
    };

    async updateStudentProgram() {
        this.setState({loaderPerson: true});
        const url = app.person + '/' + app.student + '/' + this.state.studentID;

        const {
            costAdmission, concept, process
        } = this.state;


        if (costAdmission !== '' && concept !== '' && process !== '') {
            let data = new FormData();

            data.set('id_cost_admission', costAdmission);
            data.set('id_concept', concept);
            data.set('id_process', process);


            try {
                const res = await axios.patch(url, data, app.headers);

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });


                this.setState({loaderPerson: false});
                this.props.callData()
                this.closeForm();

            } catch (err) {
                this.setState({loaderPerson: false});
                PNotify.error({title: "Oh no!", text: err.response.data.error, delay: 2000});

            }
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

    async destroyStudent(id) {

        try {
            this.setState({loaderDestroyStudent: true});
            const url = app.person + '/' + app.student + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderDestroyStudent: false});
            this.props.callData();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
            this.setState({loaderDestroyStudent: false});
            return false;
        }
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


            case 'studentState':
                if (event.target.value == 'false') {
                    this.setState({studentState: true});
                } else {
                    this.setState({studentState: false});
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
                this.listSimpleProgramByOrganicUnitRegisterID(event.value);
                break;
            case 'program':
                this.setState({
                    program: event.target.value,
                    studyPlan: "",
                    process: "",
                    admissionPlan: "",
                    costAdmission: "",
                    concept: ""
                });
                this.listAdmissionPlanByProgramIDS(event.target.value)
                this.listWorkPlanByProgramIDS(event.target.value)
                break;
            case 'admissionPlan':
                let studyPlan = $('#admissionPlan-' + event.target.value).attr('data-studyPlan');
                let process = $('#admissionPlan-' + event.target.value).attr('data-process');
                let studyPlanMask = $('#admissionPlan-' + event.target.value).attr('data-studyPlanMask');
                this.setState({
                    admissionPlan: event.target.value,
                    studyPlan: studyPlan,
                    process: process,
                    studyPlanMask: studyPlanMask
                });
                this.listConceptsInscriptionWeb(event.target.value);
                break;
            case 'costAdmission':
                let concept = $('#concept-' + event.target.value).attr('data-concept-id');
                this.setState({costAdmission: event.target.value, concept: concept});
                break;


            case 'voucherAmount':
                this.setState({voucherAmount: event.target.value});
                break;
            case 'voucherCode':
                this.setState({voucherCode: event.target.value});
                break;
            case 'voucherDate':
                this.setState({voucherDate: event.target.value});
                break;
            case 'voucherUrl':
                this.setState({voucherUrl: event.target.value});
                break;
            default:
                break;
        }
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
    changeVoucher = (event) => {

        const fileExtension = ['jpg', 'png'];
        const input = '#inputVoucher';
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

                    voucherFile: file,

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
            studentID: '',

            personState: '',
            teacherState: false,
            studentState: false,
            administrativeState: false,
            existPerson: false,

            preview: defaultPhoto,
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

            costAdmission: ""
        });
        this.props.closeForm();
    };
    closeValidatePersonDni = () => {
        this.setState({
            namePersonMask: "",
            personID: "",
            studentID: "",
            existPerson: false,
            preview: defaultPhoto,
            costAdmission: '',
            concept: ''
        });
    };
    openStudentSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyStudent(id) : this.props.closeForm();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };

    retriveData = (r) => {
        console.log(r)
        this.setState({
            action: "update",
            studentID: r.id,
            personID: r.Person.id,
            document_number: r.Person.document_number,
            namePersonMask: r.Person.name,
            documentNumber: r.Person.document_number,
            admissionPlan: r.id_admission_plan,
            costAdmission: r.id_cost_admission,
            concept: r.id_concept,
            existPerson: true
        })


    };

    render() {

        const {
            personID,
            address,
            cellPhone,
            namePersonMask,
            action,
            admissionPlan,
            admissionPlans,
            costAdmission,
            concept,
            costAdmissions,
            loadImg,
            civilStatuMask,
            name,
            paternal,
            maternal,
            documentNumber,
            gender,
            birthDate,
            organitUnit,
            email,
            civilStatu,
            photo,
            civilStatus,
            changeImage,
            role,
            charge,
            contractType,
            birthDepartment,
            birthProvince,
            birthDistrict,
            residentUbigeoMask,
            residentDepartment,
            residentProvince,
            residentDistrict,

        } = this.state;

        const {
            charges,
            workPlans,
            birthDepartments,
            birthProvinces,
            program,
            birthDistrics,
            residentDepartments,
            residentProvinces,
            residentDistrics
        } = this.state;

        // estado del modo dios
        const {formModal, date_start, workPlan, organicUnit, programs} = this.state;
        const {voucherCode, studyPlanMask, voucherDate, voucherUrl, fileVoucher} = this.state;

        return (


            <Modal show={formModal} size={"xl"} backdrop="static" style={{zIndex: "100000"}}>
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR ESTUDIANTE</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}} onClick={() => this.closeForm()}/>

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>


                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <h5>Datos del Generales</h5>
                            <hr/>
                        </Col>
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

                        {this.state.existPerson === false ?
                            <>

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
                                                >Fecha de nacimiento <small
                                                    className="text-danger"> *</small></Form.Label>
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
                                                                return (
                                                                    <option
                                                                        value={residentDepartment.id}
                                                                        key={index}>
                                                                        {residentDepartment.description}
                                                                    </option>
                                                                )
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

                            </>
                            :
                            <>

                                <Col xs={12} sm={12} md={10} lg={10} xl={10}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <h5>{namePersonMask}</h5>
                                            <h5>{documentNumber}</h5>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            {action === "add" ? <button type="button" className="btn btn-link p-0"
                                                                        onClick={() => this.closeValidatePersonDni()}>Cambiar</button>
                                                :
                                                <Link className="btn btn-link p-0"
                                                      to={"/profile/" + btoa(this.state.personID) + "/person"}> Editar
                                                    Persona</Link>}
                                        </Col>


                                    </Row>
                                </Col>

                            </>
                        }
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <br/>
                            <h5>Datos del Programa</h5>
                            <hr/>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                            style={costAdmission === "" ? {color: "#ff5252 "} : null}
                                >Modalidad<small className="text-danger"> *</small></Form.Label>
                                {this.state.costAdmissionLoader ?
                                    <span className="spinner-border spinner-border-sm mr-1" role="status"/> :
                                    <Form.Control as="select"
                                                  value={costAdmission}
                                                  onChange={this.handleChange('costAdmission')}
                                    >
                                        >
                                        <option defaultValue={true} hidden>Modalidad</option>
                                        {
                                            costAdmissions.length > 0 ?
                                                costAdmissions.map((r, index) => {

                                                    return (
                                                        <option
                                                            id={"concept-" + r.id}
                                                            style={{fontSize: "14px"}}
                                                            data-concept={r.Concept.denomination}
                                                            data-concept-id={r.Concept.id}
                                                            data-amount={r.amount}
                                                            key={r.id} value={r.id}>
                                                            {r.Concept.denomination + " - S/." + r.amount}
                                                        </option>
                                                    )

                                                }) :
                                                <option value={false}>Aun no ha registrado datos</option>
                                        }
                                    </Form.Control>
                                }
                            </Form.Group>
                        </Col>


                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            {
                                action === "add" ?
                                    <Button
                                        className="pull-right"
                                        disabled={this.state.loaderPerson}
                                        variant="primary"
                                        onClick={this.state.existPerson === false ? () => this.createPersonStudent() : () => this.createStudentProgram()}
                                    >
                                        {this.state.loaderPerson &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar</Button>

                                    :

                                    <Button
                                        className="pull-right"
                                        disabled={this.state.loaderPerson}
                                        variant="primary"
                                        onClick={() => this.updateStudentProgram()}
                                    >
                                        {this.state.loaderPerson &&
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                        Guardar Cambios</Button>

                            }

                        </Col>

                    </Row>

                </Modal.Body>
            </Modal>


        );
    }
}

export default StudentForm;
