import React, {Component} from 'react';
import {
    Card,
    Col,
    Dropdown,

    Row,
} from "react-bootstrap";
import app from "../../../../Constants";

import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import crypt from "node-cryptex";
import $ from 'jquery';
import Requeriment from "./Requeriment";
import Amortization from "./Amortization";
import AcademicRecord from "./AcademicRecord";

moment.locale('es');


const k = new Buffer(32);
const v = new Buffer(16);


export default class Inscription extends Component {

    state = {
        userID: this.props.userID,
        studentID: '',
        organicUnit: this.props.organicUnit || '',

        loaderPreinscription: false,
        addProgram: false,
        activeForm: '',
        studentProgram: '',
        program: '',
        programMask: '',
        mention: '',
        totalSemester: 0,
        codeCost: '',
        totalInversion: 0.00,
        mentionMask: '',
        programs: [],
        mentions: [],
        costs: [],
        studentMentionRegistrations: [],
    };

    componentDidMount() {

    }

    // FUNCION PARA LISTAR PROGRAMAS SEGUN LA UNIDAD ORGANICA
    getProgram() {

        const url = app.security + '/' + app.student + '/' + app.organicUnit + '/' + this.state.userID + '/' + this.state.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {

                this.setState({programs: res.data});

            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };


    /**
     * listMentionUser
     * PERSONA=>MATRICULAS
     * Funcion para buscar si existe una mencion con el usuaio y mencion seleccionado del estudiante
     * si existe se muestran las mensualidades de pagos sino la pre-inscripcion
     * */
    getStudentMention = (mentionID) => {

    };

    /*
    // B-COSTOS-MENCION
     * listOneCostMention
     * FUNCION PARA CARGAR LOS COSTOS SOLO CUANDO NO EXISTE NINGUN REGISTRO DEL ESTUDIANTE EN LA MENCION SELECCIONADA
     */
    getCostConcepts(mentionID) {

        const url = app.accounting + '/' + app.cost + '/one/list/' + mentionID;
        axios.get(url, app.headers).then(res => {
            console.log(res.data)
            if (res.data) this.setState({codeCost: res.data.Cost.code, costs: res.data.Concepts, totalInversion: 0.00})
        }).catch(err => {
            this.setState({
                totalInversion: 0.00,
                costs: [],
                codeCost: ''
            });
            PNotify.error({
                title: "Oh no!",
                text: "Los costos de estre programa no han sido registrados",
                delay: 2000
            });
            console.log(err)
        })
    };


    // FUNCION PARA CARGAR EL NUMERO TOTAL DE SEMESTRE QUE TIENE UNA MENCION
    getTotalSemester(mentionID) {

        const url = app.accounting + '/' + app.semesterMention + '/quantity/' + mentionID;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({totalSemester: res.data.totalSemester})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    //Funcion para registrar en Security.student  y Accounting.payment
    saveInscription() {
        // cost[0] por que solo necesitamos el concepto  preinscripcion
        this.setState({loaderPreinscription: true});
        const url = app.security + '/' + app.student;
        const {mention, costs, organicUnit, userID} = this.state;
        if (mention !== '' && costs[0].state && organicUnit !== '') {

            let data = new FormData();
            data.set('id_mention', mention);
            // data.set('id_user', USERID);
            data.set('id_user', userID);
            data.set('id_organic_unit', organicUnit);
            data.set('concepts', crypt.encrypt(JSON.stringify(costs), k, v));


            axios.post(url, data, app.headers).then((res) => {
                this.getStudentMention(this.state.mention);
                this.setState({
                    addProgram: false,
                    loaderPreinscription: false,
                    program: '',
                    programMask: '',
                    mention: '',
                    mentionMask: '',
                    totalInversion: 0.00,
                    costs: []
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
            }).catch((err) => {
                alert('alegria totla');
                this.setState({
                    loaderPreinscription: false,

                });
                let message = '';
                if (err.response.data) {
                    message = err.response.data.message
                }

                PNotify.error({
                    title: "Oh no!",
                    text: message,
                    delay: 2000
                });
            });
        } else {

            this.setState({loaderPreinscription: false});
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    handleChange = field => event => {
        switch (field) {
            case 'program':
                if (event.target.value !== 'false') {
                    let program = $('#program-' + event.target.value).attr('data-program');
                    this.setState({program: event.target.value, programMask: program, mentionMask: '', mention: ''});
                    this.getMention(event.target.value);

                }
                break;
            case 'mention':
                if (event.target.value !== 'false') {
                    let mention = $('#mention-' + event.target.value).attr('data-mention');
                    this.setState({mention: event.target.value, mentionMask: mention});
                    this.getStudentMention(event.target.value);
                }
                break;


            default:
                break;
        }
    };
    selectedConcept = (k) => {
        let total = this.state.totalInversion;
        let data = [];
        data = this.state.costs;


        for (let i = 0; i < data.length; i++) {

            if (data[i].id === k.id && data[i].order_number === k.order_number) {
                data[i].state = !k.state;


                data[i].exists = !k.exists;
                if (data[i].state) {
                    data[i].type = "Pendiente";
                    total = total + parseFloat(data[i].amount);
                } else {
                    data[i].type = "Nulo";
                    total = total - parseFloat(data[i].amount);
                }
            }


        }
        console.log(data);
        this.setState({totalInversion: total, costs: data})
    };


    handleRef = (type) => {

        this.setState({activeForm: type});
        // switch (type) {
        //     case 'Amortización':
        //         this.Amortization.getPaymentStudent(this.state.studentID);
        //         break;
        //     case 'Record Académico':
        //         // this.AcademicRecord.getRecordStudent(this.state.studentID);
        //         break;
        //
        //
        //     default:
        //         break;
        // }

    };
    selectedProgram = (data, studentID, type) => {
        this.setState({activeForm: type});
        this.styleSelected(data, studentID);
        this.setState({
            activeForm: type,
            studentID: studentID
        })


    };
    styleSelected = (data, studentID) => {

        for (let i = 0; i < data.length; i++) {
            document.getElementsByClassName("row-card" + data[i].id)[0].style.background = '#3c5a9936';
            document.getElementsByClassName("program-" + studentID)[0].style.color = 'white';
            document.getElementsByClassName("mention-" + studentID)[0].style.color = 'white';

        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === studentID) {
                document.getElementsByClassName("row-card" + studentID)[0].style.background = '#3C5A99';
                document.getElementsByClassName("program-" + studentID)[0].style.color = 'white';
                document.getElementsByClassName("mention-" + studentID)[0].style.color = 'white';
            }

        }

    };

    render() {
        const {activeForm} = this.state;

        const {programs} = this.state;


        return (
            <Row>

                {programs.length > 0 ?
                    <Col xl={3}>
                        {programs.map((r, i) => {
                            return (
                                <Card key={i} className={"order-card row-card" + r.id}
                                      style={{background: '#3c5a9936', marginBottom: "10px"}}
                                      onClick={() => this.selectedProgram(programs, r.id, 'Record Académico')}
                                >
                                    <Card.Body>
                                        <h5 className={"text-white mention-" + r.id}>{r.Mention.denomination}</h5>
                                        <p className={"m-b-0 program-" + r.id}>{r.Mention.Programs.denomination}</p>
                                        <i className="card-icon fas fa-book fa-36"/>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Col>
                    :
                    <Col xl={12}>

                        <Card style={{marginBottom: '10px'}} className="bg-c-yellow order-card">
                            <Card.Body>

                                <h5 className="text-white ">No se encontraron registros</h5>
                                <p>No esta registrado en ningun programa de estudio </p>
                                <i className="feather icon-alert-triangle card-icon"/>
                            </Card.Body>

                        </Card>
                    </Col>
                }


                <Col xl={9}>
                    {
                        this.state.studentID &&
                        <Card className="bg-linkedin " style={{marginBottom: "10px"}}>
                            <Card.Body>
                                <div className="d-inline-block">
                                    <h5 className="text-white">{activeForm.toUpperCase()} </h5>

                                </div>
                                <div className="d-inline-block pull-right">
                                    <Dropdown alignRight={true}
                                              className="pull-right mr-n3 mt-n2">
                                        <Dropdown.Toggle className="btn-icon" style={{
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            color: '#0077B5',
                                            height: '5px'

                                        }}>
                                            <i
                                                className="material-icons pull-right mr-n2 mt-n1"
                                                style={{
                                                    color: 'white', paddingTop: "15px", paddingLeft: "17px"
                                                }}>more_vert</i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu as='ul' className="list-unstyled card-option">
                                            <Dropdown.Item as='li'

                                                           onClick={() => this.handleRef("Requisitos")}

                                                           className="dropdown-item">
                                                                    <span type="button">
                                                                        <i className={'feather icon-file-text'}/> Requisitos
                                                                   </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='li'

                                                           onClick={() => this.handleRef("Record Académico")}

                                                           className="dropdown-item">
                                                                    <span type="button">
                                                                        <i className={'feather icon-book'}/> Record Academico
                                                                   </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='li'
                                                           onClick={() => this.handleRef("Amortización")}
                                                           className="dropdown-item">
                                                                    <span type="button">
                                                                        <i className={'feather icon-thumbs-up'}/> Amortizaciones
                                                                   </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item as='li'
                                                           onClick={() => this.formCost()}
                                                           className="dropdown-item">
                                                                    <span type="button">
                                                                        <i className={'feather icon-calendar'}/> Asistencias
                                                                   </span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Card.Body>
                        </Card>

                    }


                    {
                        activeForm === 'Requisitos' &&
                        <Requeriment
                            // getStudentMention={() => this.getStudentMention(this.state.mention)}
                            ref={(ref) => this.Requeriment = ref}
                        />
                    }
                    {
                        activeForm === 'Amortización' && this.state.studentID &&
                        <Amortization
                            activeForm={this.state.activeForm}
                            studentID={this.state.studentID}

                        />
                    }
                    {
                        activeForm === 'Record Académico' && this.state.studentID &&
                        <AcademicRecord
                            activeForm={this.state.activeForm}
                            studentID={this.state.studentID}

                        />
                    }
                </Col>


            </Row>
        )
    }
}
