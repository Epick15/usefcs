import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import 'jspdf-autotable';
import {Button, Card, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import moment from "moment";
import component from "../../Component";
import TitleModule from "../../TitleModule";
import XLSX from "xlsx";
import $ from 'jquery';
import Book from "@material-ui/icons/Book";
import Close from "@material-ui/icons/Close";
import Select from "react-select";
import Attachment from "@material-ui/icons/Attachment";
import StudyPlan from './studyPlan';
import GetApp from "@material-ui/icons/GetApp";
import Assessment from "@material-ui/icons/Assessment";

moment.locale('es');

export default class Report extends Component {

    state = {studyPlan: false, modal: false}

    componentDidMount() {

    };

    closeModal() {
        this.setState({studyPlan: false, modal: false})
    }


    render() {
        const {studyPlan, modal, loader} = this.state

        return (

            <>
                {loader && component.spin}
                <TitleModule
                    actualTitle={"REPORTES"}
                    actualModule={"REPORTES GENERALES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Card>

                            <Card.Body>
                                <h5>Academico</h5>
                                <hr/>
                                <button
                                    onClick={() => this.setState({modal: true, studyPlan: true})}
                                    type="button"
                                    className=" btn btn-primary">
                                    <Book className={"text-warning"}/> Planes de Estudio
                                </button>
                                <br/>
                                {/*<button*/}

                                {/*    type="button"*/}
                                {/*    className=" btn btn-primary">*/}
                                {/*    <Assessment className={"text-purple"}/> Planes de admisión*/}
                                {/*</button>*/}
                            </Card.Body>
                        </Card>
                    </Col>
                    {/*<Col xs={12} sm={12} md={3} lg={3} xl={3}>*/}
                    {/*    <Card>*/}

                    {/*        <Card.Body>*/}
                    {/*            <h5>Contabilidad</h5>*/}
                    {/*            <hr/>*/}
                    {/*            <button*/}

                    {/*                type="button"*/}
                    {/*                className=" btn btn-primary">*/}
                    {/*                <Book className={"text-secondary"}/> Pagos de estudiantes*/}
                    {/*            </button>*/}
                    {/*            <br/>*/}
                    {/*            <button*/}

                    {/*                type="button"*/}
                    {/*                className=" btn btn-primary">*/}
                    {/*                <Book className={"text-secondary"}/> Liquidacion por programa*/}
                    {/*            </button>*/}
                    {/*        </Card.Body>*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                </Row>
                <Modal show={modal} size={"xl"} backdrop="static">
                    <Modal.Header>
                        <h5><GetApp/> Descargar Reporte</h5>
                        <div className="d-inline-block pull-right">
                            <Close type="button" style={{color: "black"}} onClick={() => this.closeModal()}/>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        {studyPlan && <StudyPlan/>}
                    </Modal.Body>
                </Modal>
            </>

        );
    }
}
