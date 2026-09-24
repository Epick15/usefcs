import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';

import {
    Card,
    Col,
    Row
} from 'react-bootstrap';

import app from '../../../Constants';
import component from '../../../Component';
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import TitleModule from "../../../TitleModule";

import DataTableDiscount from "./DataTableDiscount";
import Form from "./Form";


moment.locale('es');


class Discount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,

            action: "add",
            titleModule: "",
            titleProgram: "",
            titleConcept: "",


            disabled: false,
            form: false,


            studentID: "",
            PERSONID: "",
            studentDiscounts: []

        };

    }

    async componentDidMount() {
        const studentID = atob(this.props.match.params.id);
        this.setState({studentID: studentID});
        this.listRequerimentDeliveredByStudent(studentID);
        this.listStudentDiscount(studentID);

    }


    async listRequerimentDeliveredByStudent(id) {
        this.setState({acreditationStudent: true});
        const url = app.person + '/' + app.requerimentDelivered + '/' + app.student + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                if (res.data.Person) {
                    this.setState({
                        PERSONID: res.data.Person.id,
                        ADMISSIONPLANID: res.data.id_admission_plan,
                        PROGRAMID: res.data.id_program,
                        ORGANICUNITID: res.data.id_organic_unit,
                        titleModule: res.data.Person.name + " / " + res.data.Person.document_number,
                    });

                }
                this.setState({
                    titleProgram: res.data.Program.denomination,
                    titleConcept: res.data.Concept.denomination,
                    titleAcademicDegree: res.data.Program.Academic_degree.denomination,
                    requeriments: res.data.Requeriment_delivereds,
                    type: res.data.type
                });
            }
            this.setState({acreditationStudent: false});
        } catch (err) {
            this.setState({acreditationStudent: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)
        }
    };

    async listStudentDiscount(id_student) {
        this.setState({loaderDiscount: true});
        const url = app.person + '/' + app.studentDiscount + '/' + id_student
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({studentDiscounts: res.data})
            }
            this.setState({loaderDiscount: false});
        } catch (err) {
            this.setState({loaderDiscount: false});
            PNotify.error({title: "Algo salio mal!", text: "Por favor intentelo nuevamente", delay: 2000});
            console.log(err)
        }
    };

    async destroyStudentDiscount(id, id_admission_plan) {

        try {
            this.setState({loaderDestroyStudent: true});
            const url = app.person + '/' + app.studentDiscount + '/' + id + '/' + id_admission_plan;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderDestroyStudent: false});
            this.listStudentDiscount(this.state.studentID);
            // this.props.callListMovement();
            // this.closeForm();
            // return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
            this.setState({loaderDestroyStudent: false});
            return false;
        }
    };

    deleteDiscount = async (id_student) => {

        this.destroyStudentDiscount(id_student, this.state.ADMISSIONPLANID)


    };
    openForm = () => {
        this.setState({form: true})
    }
    closeForm = () => {
        this.setState({form: false})
    }
    callData = () => {

        this.listStudentDiscount(this.state.studentID);


    };

    render() {


        const {titleProgram, titleConcept} = this.state;

        return (
            <>
                <TitleModule
                    actualTitle={this.state.titleModule}
                    actualModule={"DESCUENTOS"}
                    fatherModuleUrl={"/inscription/" + btoa(this.state.ADMISSIONPLANID)}
                    fatherModuleTitle={"INSCRIPCIONES"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{marginBottom: "5px"}}>
                            <Card.Header>

                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <div className="">
                                            <h5>{titleProgram}</h5> <br/>
                                            {titleConcept.toUpperCase()} (El total del descuento solo se aplica a las
                                            pensiones de enseñansa)
                                        </div>
                                    </Col>


                                </Row>
                            </Card.Header>

                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                        <DataTableDiscount deleteDiscount={this.deleteDiscount} records={this.state.studentDiscounts}
                                           ADMISSIONPLANID={this.state.ADMISSIONPLANID}
                                           openForm={this.openForm}/>
                    </Col>


                </Row>
                {
                    this.state.form &&
                    <Form studentID={this.state.studentID} ADMISSIONPLANID={this.state.ADMISSIONPLANID}
                          callData={this.callData}
                          closeForm={this.closeForm}/>
                }


            </>
        );
    }
}

export default withRouter(Discount)
