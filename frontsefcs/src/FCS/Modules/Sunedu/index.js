import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import 'jspdf-autotable';
import {
    Row, Col, Card, Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import moment from "moment";
import component from "../../Component";
import TitleModule from "../../TitleModule";
import GetApp from "@material-ui/icons/GetApp";
import XLSX from "xlsx";
import $ from 'jquery';

moment.locale('es');


export default class Report extends Component {

    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT, organicUnit: '', processSunedu: '', process: '', academicDegree: '',

        processs: [], report: [], reportRegistrations: [], reportRegistrationsSunedu: []

    };

    componentDidMount() {
        this.listAcademicSemesterAndAcademicCalendar();

    };

    async listAcademicSemesterAndAcademicCalendar() {
        this.setState({calendarLoader: true});
        const url = app.general + '/' + app.academicSemester + '/' + app.academicCalendar + '/all';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                processs: res.data,
            });
            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async reportSuneduEntry(process) {
        this.setState({calendarLoader: true});
        const url = app.general + '/report-sunedu-entry/' + this.state.academicDegree + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {

                this.setState({
                    report: res.data
                });

            } else {
                this.setState({
                    report: []
                });
            }


            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async reportExecelEntry(process) {
        this.setState({calendarLoader: true});
        const url = app.general + '/report-excel-entry/' + this.state.academicDegree + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {

                this.setState({
                    reportEntry: res.data,
                });

            }


            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async reportExecelRegistration(process) {
        this.setState({calendarLoader: true});
        const url = app.general + '/report-excel-registration/' + this.state.academicDegree + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {

                this.setState({
                    reportRegistrations: res.data,
                });

            } else {
                this.setState({reportRegistrations: []})
            }


            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async reportExecelSuneduRegistration(process) {
        this.setState({calendarLoader: true});
        const url = app.general + '/report-sunedu-registration/' + this.state.academicDegree + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {

                this.setState({
                    reportRegistrationsSunedu: res.data,
                });

            } else {
                this.setState({reportRegistrationsSunedu: []})
            }


            this.setState({calendarLoader: false});
        } catch (err) {
            this.setState({calendarLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };


    handleChange = field => event => {
        switch (field) {

            case 'processSunedu':
                this.setState({
                    processSunedu: event.target.value,
                });

                break;
            case 'academicDegree':
                this.setState({
                    academicDegree: event.target.value, reports: [], process: ''
                });

                break;
            case 'process':

                let processmask = $('#processmask-' + event.target.value).attr('data-processmask');
                this.setState({
                    process: event.target.value, processMask: processmask
                });

                this.state.processSunedu === '1' && this.state.academicDegree !== '' && this.reportSuneduEntry(event.target.value)
                this.state.processSunedu === '1' && this.state.academicDegree !== '' && this.reportExecelEntry(event.target.value)

                this.state.processSunedu === '2' && this.state.academicDegree !== '' && this.reportExecelSuneduRegistration(event.target.value)
                this.state.processSunedu === '2' && this.state.academicDegree !== '' && this.reportExecelRegistration(event.target.value)
                break;


            default:
                break;
        }
    };

    xlxEntrySunedu = () => {
        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.report);
        XLSX.utils.book_append_sheet(workbook, ws, "Results");
        XLSX.writeFile(workbook, this.state.processSunedu + ' ' + this.state.academicDegree + ' ' + this.state.processMask + '.xlsx', {type: 'file'});
    };
    xlxsEntry = () => {
        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.reportEntry);
        XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.writeFile(workbook, this.state.processSunedu + ' ' + this.state.academicDegree + ' ' + this.state.processMask + '.xlsx', {type: 'file'});
    }
    xlxsRegistration = () => {
        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.reportRegistrations);
        XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.writeFile(workbook, this.state.processSunedu + ' ' + this.state.academicDegree + ' ' + this.state.processMask + '.xlsx', {type: 'file'});
    }
    xlxsRegistrationSunedu = () => {
        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.reportRegistrationsSunedu);
        XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.writeFile(workbook, this.state.processSunedu + ' ' + this.state.academicDegree + ' ' + this.state.processMask + '.xlsx', {type: 'file'});
    }

    render() {


        return (

            <>
                <TitleModule
                    actualTitle={"REPORTES"}
                    actualModule={"REPORTES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                        <Card style={{marginBottom: '-10px'}}>

                            <Card.Body>
                                <Row>

                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Proceso Sunedu</Form.Label>
                                            <Form.Control as="select"
                                                          value={this.state.processSunedu}
                                                          onChange={this.handleChange('processSunedu')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                <option value={"1"}>1 Gestion de Ingresantes
                                                </option>
                                                <option value={"2"}>2 Gestion de Matriculados
                                                </option>

                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Grado Academico</Form.Label>
                                            <Form.Control as="select"
                                                          value={this.state.academicDegree}
                                                          onChange={this.handleChange('academicDegree')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                <option value={"Maestro"}> Maestro</option>
                                                <option value={"Doctor"}> Doctor</option>
                                                <option value={"Especialista"}> Especialista</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Procesos</Form.Label>
                                            <Form.Control as="select"
                                                          value={this.state.process}
                                                          onChange={this.handleChange('process')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                {this.state.processs.length > 0 ? this.state.processs.map((r, index) => {

                                                    return (<option
                                                        id={"processmask-" + r.id}
                                                        value={r.id}
                                                        key={index}
                                                        data-processmask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                    >
                                                        {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                    </option>)

                                                }) : <option defaultValue={true}>Error al cargar los
                                                    Datos</option>}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    {this.state.processSunedu === '1' && this.state.academicDegree && this.state.process ? this.state.report.length > 0 ? <>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <OverlayTrigger
                                                overlay={<Tooltip>Descargar Reporte Ingresantes</Tooltip>}>
                                                <button
                                                    style={{
                                                        float: "right", marginRight: "3px", width: '100%'
                                                    }}
                                                    onClick={() => this.xlxEntrySunedu()}
                                                    type="button"
                                                    className=" btn btn-warning">Descargar Formato SUNEDU
                                                </button>
                                            </OverlayTrigger>
                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>

                                            <OverlayTrigger
                                                overlay={<Tooltip>Descargar Reporte Ingresantes</Tooltip>}>
                                                <button
                                                    style={{
                                                        float: "right", marginRight: "3px", width: '100%'
                                                    }}
                                                    onClick={() => this.xlxsEntry()}
                                                    type="button"
                                                    className=" btn btn-dark">Descargar Reporte
                                                </button>
                                            </OverlayTrigger>
                                        </Col>

                                    </> : 'No se encontraron registros' : ''}
                                    {this.state.processSunedu === '2' && this.state.academicDegree && this.state.process ? this.state.reportRegistrations.length > 0 ? <>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>

                                            <OverlayTrigger
                                                overlay={<Tooltip>Descargar Formato Sunedu</Tooltip>}>
                                                <button
                                                    style={{
                                                        float: "right", marginRight: "3px", width: '100%'
                                                    }}
                                                    onClick={() => this.xlxsRegistrationSunedu()}
                                                    type="button"
                                                    className=" btn btn-warning">Descargar Formato Sunedu
                                                </button>
                                            </OverlayTrigger>
                                        </Col>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <OverlayTrigger
                                                overlay={<Tooltip>Descargar Reporte Matriculas</Tooltip>}>
                                                <button
                                                    style={{
                                                        float: "right", marginRight: "3px", width: '100%'
                                                    }}
                                                    onClick={() => this.xlxsRegistration()}
                                                    type="button"
                                                    className=" btn btn-dark">Descargar Reporte
                                                </button>
                                            </OverlayTrigger>
                                        </Col>


                                    </> : 'No se encontraron registros' : ''}


                                </Row>

                            </Card.Body>


                        </Card>
                        <br/>

                    </Col>


                </Row>

            </>

        );
    }
}
