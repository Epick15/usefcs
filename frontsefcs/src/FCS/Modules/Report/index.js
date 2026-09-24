import React, { Component } from 'react';
import axios from 'axios';
import app from '../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import 'jspdf-autotable';
import { Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import moment from "moment";
import component from "../../Component";
import TitleModule from "../../TitleModule";
import DataTablePaymentProgramAdmision from './DataTablePaymentProgramAdmision'
import DataTableInscription from './DataTableInscription'
import Payment from './Payment'
import SearchStudent from './SearchStudent'
import XLSX from "xlsx";
import GetApp from "@material-ui/icons/GetApp";
import $ from 'jquery';
import NavBarReport from "./NavBarReport";

moment.locale('es');

export default class Report extends Component {

    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        USER_TYPE: component.USER_TYPE,
        organicUnit: '',
        donwloadLiquidation: false,
        module: '',
        reportMovementDateTotal: 0,
        typeOption: '',
        typeOptionTwo: '',

        info: '',
        startMovement: '',
        endMovement: '',
        startMovementRegister: '',
        movementUnitDenomination: '',
        principalOrganit: '',
        organicUnitDenomination: '',
        endMovementRegister: '',

        studentID: '',
        general: '',
        organicUnits: [],


        program: '',
        programs: [],
        processs: [],
        process: '',
        admissionPlan: '',
        admissionPlans: [],
        reportMovementDates: [],
        reportMovementDateVouchers: [],
        reportEntry: []
    };

    componentDidMount() {
        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.listSimpleProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
            this.setState({ organicUnit: component.ORGANIC_UNIT })
        }
        this.listAcademicSemesterAndAcademicCalendar();
    };

    async listAcademicSemesterAndAcademicCalendar() {
        this.setState({ calendarLoader: true });
        const url = app.general + '/' + app.academicSemester + '/' + app.academicCalendar + '/all';

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                processs: res.data,
            });
            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    listUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({ organicUnits: res.data })
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!", text: "Error al obtener unidades orgánicas", delay: 2000
            });
            console.log(err)
        })
    };

    async listSimpleProgramByOrganicUnitRegisterID(id) {
        this.setState({ programsLoader: true });
        const url = app.programs + '/' + app.program + '/s-' + app.organicUnit + '-register/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ programs: res.data });
            }
            this.setState({ programsLoader: false })

        } catch (err) {
            this.setState({ programsLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los Programas de estudio", delay: 2000 });
            console.log(err)

        }

    };

    async listAdmissionPlanByProgramIDS(id_program) {
        this.setState({ admissionPlanLoader: true });
        const url = app.programs + '/' + app.admissionPlan + '/' + app.program + '/' + id_program + '/s';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({ admissionPlans: res.data });
            }
            this.setState({ admissionPlanLoader: false });
        } catch (err) {
            this.setState({ admissionPlanLoader: false });
            console.log(err)
        }
    };

    async reportExecelEntryOrganicUnit(process) {
        this.setState({ calendarLoader: true });
        const url = app.general + '/report-excel-entry/organic-unit/' + this.state.organicUnit + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                this.setState({
                    reportEntry: res.data
                });
            } else {
                this.setState({ reportEntry: [] })
            }


            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    async reportExecelRegistrionOrganicUnit(process) {
        this.setState({ calendarLoader: true });
        const url = app.general + '/report-excel-registration/organic-unit/' + this.state.organicUnit + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.length > 0) {
                this.setState({
                    reportEntry: res.data
                });
            } else {
                this.setState({ reportEntry: [] })
            }


            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    async reportExcelPaymentProgramAdmisionTotal(admissionPlan, process) {
        this.setState({ calendarLoader: true });
        const url = app.general + '/report-excel-payment/program/admission-plan/complete/' + admissionPlan + '/' + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    reportEntry: res.data.dataExcel
                });
            } else {
                this.setState({ reportEntry: [] })
            }


            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    async reportExecelMovementStudentByRangeDate(start, end) {
        this.setState({ calendarLoader: true });
        const url = app.general + '/report-excel-movement/range';
        try {
            let data = new FormData();
            data.set('id_organict_unit', this.state.organicUnit);
            data.set('start_movement', start);
            data.set('end_movement', end);

            const res = await axios.patch(url, data, app.headers);
            if (res.data.dataExcel.length > 0) {

                this.setState({
                    reportMovementDates: res.data.dataExcel,
                    organicUnitDenomination: res.data.organicUnitDenomination,
                    reportMovementDateTotal: res.data.totalAmount,
                    principalOrganit: res.data.principalOrganit,
                    reportMovementDateVouchers: res.data.dataPdf
                });
            } else {
                this.setState({ reportMovementDates: [], reportMovementDateVouchers: [], reportMovementDateTotal: 0 })
            }


            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    async reportDataMovementStudentByRangeDateRegistrationVoucher(start, end) {
        this.setState({ calendarLoader: true });
        const url = app.general + '/report-movement/range/registration';
        try {
            let data = new FormData();
            data.set('id_organict_unit', this.state.organicUnit);
            data.set('start_movement', start);
            data.set('end_movement', end);

            const res = await axios.patch(url, data, app.headers);
            if (res.data.dataExcel.length > 0) {
                this.setState({
                    reportMovementDates: res.data.dataExcel,
                    reportMovementDateVouchers: res.data.dataPdf,
                    organicUnitDenomination: res.data.organicUnitDenomination,
                    principalOrganit: res.data.principalOrganit,
                    reportMovementDateTotal: res.data.totalAmount
                });
            } else {
                this.setState({ reportMovementDates: [], reportMovementDateVouchers: [], reportMovementDateTotal: 0 })
            }


            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    async listAcademicSemesterAndAcademicCalendarByAdmissionPlan(id) {
        this.setState({ calendarLoader: true });
        const url = app.general + '/' + app.academicSemester + '/' + app.academicCalendar + '/' + app.admissionPlan + '/' + id;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                processs: res.data,
            });
            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000 });
            console.log(err);
        }
    };

    async reportLiquidationByAdmissionPlan(admissionPlan) {


        this.setState({ registrationDataLoader: true });
        const url = app.general + '/report/liquidation/' + admissionPlan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({
                    reportLiquidations: res.data
                });
            } else {
                this.setState({ reportLiquidations: [] })
            }


        } catch (err) {
            PNotify.error({ title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000 });
            console.log(err)
        }

    };

    handleChange = field => event => {
        switch (field) {
            case 'organicUnit':
                this.setState({
                    organicUnit: event.target.value,
                    module: '',
                    typeOption: '',
                    typeOptionTwo: '',
                    studentID: '',
                    admissionPlan: ''
                });
                this.listSimpleProgramByOrganicUnitRegisterID(event.target.value);
                break;
            case 'module':
                this.setState({
                    module: event.target.value,
                    typeOption: '',
                    typeOptionTwo: '',
                    studentID: '',
                    admissionPlan: '',
                    process: '',
                    processs: [],
                    processMask: ''
                });
                event.target.value === 'ESTUDIANTES INSCRITOS' && this.listAcademicSemesterAndAcademicCalendar();
                event.target.value === 'ESTUDIANTES MATRICULADOS' && this.listAcademicSemesterAndAcademicCalendar();
                break;
            case 'typeOption':
                this.setState({
                    typeOption: event.target.value, typeOptionTwo: '', studentID: '', admissionPlan: '', processs: []
                });


                break;
            case 'typeOptionTwo':
                this.setState({ typeOptionTwo: event.target.value, studentID: '', admissionPlan: '' });
                //LISTAMOS LOS SEMESTRES SEGUN EL PLAN DE ADMISION
                event.target.value === 'PLAN DE ADMISIÓN Y SEMESTRE' && this.listAcademicSemesterAndAcademicCalendar();


                break;
            case 'program':
                let programmask = $('#programmask-' + event.target.value).attr('dataprogrammask');
                this.setState({
                    program: event.target.value, programmask: programmask, admissionPlan: ''
                });
                this.state.module === 'PAGOS' && this.listAdmissionPlanByProgramIDS(event.target.value)
                this.state.module === 'ESTUDIANTES INSCRITOS' && this.setState({
                    process: '', processs: []
                })
                break;
            case 'admissionPlan':
                this.setState({
                    admissionPlan: event.target.value,
                });
                this.state.typeOptionTwo === 'LIQUIDACION' && this.reportLiquidationByAdmissionPlan(event.target.value);
                break;
            case 'process':
                let processmask = $('#processmask-' + event.target.value).attr('data-processmask');
                this.setState({
                    process: event.target.value, processMask: processmask
                });
                this.state.module === 'ESTUDIANTES INSCRITOS' && this.reportExecelEntryOrganicUnit(event.target.value);
                this.state.module === 'ESTUDIANTES MATRICULADOS' && this.reportExecelRegistrionOrganicUnit(event.target.value);
                this.state.module === 'PAGOS' && this.state.typeOption === 'PROGRAMA' && this.state.typeOptionTwo === 'PLAN DE ADMISIÓN Y SEMESTRE' && this.reportExcelPaymentProgramAdmisionTotal(this.state.admissionPlan, event.target.value);
                break;
            case 'startMovement':
                this.setState({ startMovement: event.target.value });
                event.target.value !== '' && this.state.endMovement !== '' && this.reportExecelMovementStudentByRangeDate(event.target.value, this.state.endMovement);
                break;
            case 'endMovement':
                this.setState({ endMovement: event.target.value });
                this.state.startMovement !== '' && event.target.value !== '' && this.reportExecelMovementStudentByRangeDate(this.state.startMovement, event.target.value);
                break;
            case 'startMovementRegister':
                this.setState({ startMovementRegister: event.target.value });
                event.target.value !== '' && this.state.endMovementRegister !== '' && this.reportDataMovementStudentByRangeDateRegistrationVoucher(event.target.value, this.state.endMovementRegister);
                break;
            case 'endMovementRegister':
                this.setState({ endMovementRegister: event.target.value });
                this.state.startMovementRegister !== '' && event.target.value !== '' && this.reportDataMovementStudentByRangeDateRegistrationVoucher(this.state.startMovementRegister, event.target.value);
                break;
            default:
                break;
        }
    }
    personInfo = (studentID) => {
        this.setState({ studentID: studentID })
    }
    xlxsEntry = () => {
        const workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(this.state.reportEntry);
        XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.writeFile(workbook, 'REPORTE DE INGRESANTES ' + this.state.processMask + '.xlsx', { type: 'file' });
    }
    xlxsRegistration = () => {
        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.reportEntry);
        XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.writeFile(workbook, 'REPORTE DE MATRICULADOS ' + this.state.processMask + '.xlsx', { type: 'file' });
    }
    xlxsPaymentAdmissionPlanSemester = () => {

        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.reportEntry);
        XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.writeFile(workbook, 'REPORTE DE ESTUDIANTES PAGOS POR SEMESTRE' + '.xlsx', { type: 'file' });
    }

    MovementStudentByRangeDate = () => {
        const workbook = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(this.state.reportMovementDates);
        XLSX.utils.book_append_sheet(workbook, ws, 'dd');
        XLSX.writeFile(workbook, 'REPORTE DE VOUCHERS' + '.xlsx', { type: 'file' });
    }

    PdfMovementStudentByRangeDate = () => {

        component.pdfReportAutoMovementStudentByRangeDate(
            this.state.reportMovementDateVouchers,
            this.state.principalOrganit,
            this.state.organicUnitDenomination,
            this.state.startMovementRegister,
            this.state.endMovementRegister,
            this.state.reportMovementDateTotal
        );
    }
    PdfMovementStudentByRangeDateRegisterVoucher = () => {

        component.pdfReportAutoMovementStudentByRangeDate(
            this.state.reportMovementDateVouchers,
            this.state.principalOrganit,
            this.state.organicUnitDenomination,
            this.state.startMovement,
            this.state.endMovement,
            this.state.reportMovementDateTotal
        );
    }
    Pdfliquidacion = (data) => {

        component.pdfReportLiquidationByAdmissionPlan(data);
    }


    render() {

        const {
            organicUnit,
            organicUnits,
            program,
            programs,
            startMovementRegister,
            endMovementRegister,
            startMovement,
            endMovement,
            //////
            general
        } = this.state;
        const { admissionPlan, admissionPlans } = this.state;


        return (

            <>
                <TitleModule
                    actualTitle={"REPORTES"}
                    actualModule={"REPORTES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                        <Card style={{ marginBottom: '-10px' }}>

                            <Card.Body>
                                <Row>
                                    {(!component.ORGANIC_UNIT || component.USER_TYPE === 'Contabilidad' || component.USER_TYPE === 'Academico') &&
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label"
                                                >Unidad Organica<small className="text-danger"> *</small></Form.Label>
                                                <Form.Control as="select"
                                                    value={organicUnit}
                                                    onChange={this.handleChange('organicUnit')}>
                                                    <option defaultValue={true} hidden>Unidad</option>
                                                    {organicUnits.length > 0 ? organicUnits.map((r, k) => {
                                                        return (<option
                                                            value={r.id}
                                                            key={k}> {r.denomination.toUpperCase() + ' - ' + r.Campu.denomination.toUpperCase()}
                                                        </option>)
                                                    }) : <option value={false} disabled>No se encontraron
                                                        datos</option>}
                                                </Form.Control>
                                            </Form.Group>


                                        </Col>}
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Modulo</Form.Label>
                                            <Form.Control as="select"
                                                value={this.state.module}
                                                onChange={this.handleChange('module')}
                                            >
                                                <option defaultValue={true} hidden>Seleccione</option>
                                                <option value={"PAGOS"}> PAGOS</option>
                                                <option value={"ESTUDIANTES INSCRITOS"}>ESTUDIANTES INSCRITOS</option>
                                                <option value={"ESTUDIANTES MATRICULADOS"}>ESTUDIANTES MATRICULADOS
                                                </option>
                                                <option
                                                    value={"ESTUDIANTES MATRICULADOS POR PROCESO DE INGRESO"}>ESTUDIANTES
                                                    MATRICULADOS POR PROCESO DE INGRESO
                                                </option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    {this.state.module === 'PAGOS' && <>
                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                            <Form.Group className="form-group fill">
                                                <Form.Label className="floating-label">Reporte por</Form.Label>
                                                <Form.Control as="select"
                                                    value={this.state.typeOption}
                                                    onChange={this.handleChange('typeOption')}
                                                >
                                                    <option defaultValue={true} hidden>Seleccione</option>
                                                    <option value={"ESTUDIANTE"}> ESTUDIANTE</option>
                                                    <option value={"PROGRAMA"}> PROGRAMA</option>
                                                    <option value={"FECHA PAGO"}> FECHA DE VOUCHER</option>
                                                    <option value={"FECHA REGISTRO"}> FECHA DE REGISTRO DE
                                                        VOUCHER
                                                    </option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        {this.state.typeOption === 'PROGRAMA' && <>
                                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <Form.Group className="form-group fill">
                                                    <Form.Label className="floating-label">Reporte
                                                        por</Form.Label>
                                                    <Form.Control as="select"
                                                        value={this.state.typeOptionTwo}
                                                        onChange={this.handleChange('typeOptionTwo')}
                                                    >
                                                        <option defaultValue={true} hidden>Seleccione</option>
                                                        <option value={"PLAN DE ADMISIÓN"}> PLAN DE ADMISIÓN
                                                        </option>
                                                        <option value={"LIQUIDACION"}>LIQUIDACIÓN
                                                        </option>
                                                        <option value={"PLAN DE ADMISIÓN Y SEMESTRE"}>PLAN DE
                                                            ADMISIÓN Y SEMESTRE
                                                        </option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            {/*MUESTRAE LA LISTA DE PROGRAMAS DE ESTUDIO*/}
                                            {this.state.typeOptionTwo !== '' &&
                                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label className="floating-label"
                                                            style={program === "" ? { color: "#ff5252 " } : null}
                                                        >Programa<small
                                                            className="text-danger"> *</small></Form.Label>
                                                        <Form.Control as="select"
                                                            value={program}
                                                            onChange={this.handleChange('program')}
                                                        >
                                                            >
                                                            <option defaultValue={true} hidden>Programa</option>
                                                            {programs.length > 0 ? programs.map((r, k) => {

                                                                return (<option id={"programmask-" + r.id}
                                                                    dataprogrammask={r.denomination}
                                                                    value={r.id}
                                                                    key={k}> {r.denomination} </option>)

                                                            }) : <option value={false} disabled>No se
                                                                encontraron
                                                                datos</option>}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>}
                                            {/*LISTA LOS PLANES DE ADMISION SEGUN EL PROGRAMA*/}
                                            {this.state.typeOptionTwo !== '' &&
                                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label className="floating-label"
                                                            style={admissionPlan === "" ? { color: "#ff5252 " } : null}
                                                        >Plan de admision<small
                                                            className="text-danger"> *</small></Form.Label>

                                                        {this.state.admissionPlanLoader ? <span
                                                            className="spinner-border spinner-border-sm mr-1"
                                                            role="status" /> : <Form.Control as="select"
                                                                value={admissionPlan}
                                                                onChange={this.handleChange('admissionPlan')}
                                                            >

                                                            <option defaultValue={true} hidden>Plan de
                                                                admision
                                                            </option>
                                                            {admissionPlans.length > 0 ? admissionPlans.map((r, k) =>
                                                                <option id={"admissionPlan-" + r.id}
                                                                    datastudyplan={r.id_plan}
                                                                    dataprocess={r.id_process}
                                                                    admissionplanmask={r.description}
                                                                    datastudyplanmask={r.Plan.description}
                                                                    value={r.id}
                                                                    key={k}> {r.description.toUpperCase()} </option>) :
                                                                <option value={false} disabled>No se
                                                                    encontraron
                                                                    datos</option>}
                                                        </Form.Control>}
                                                    </Form.Group>
                                                </Col>}


                                            {this.state.typeOptionTwo === 'PLAN DE ADMISIÓN Y SEMESTRE' && <>
                                                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <Form.Group className="form-group fill">
                                                        <Form.Label
                                                            className="floating-label">Procesos</Form.Label>
                                                        <Form.Control as="select"
                                                            value={this.state.process}
                                                            onChange={this.handleChange('process')}
                                                        >
                                                            <option defaultValue={true} hidden>Seleccione
                                                            </option>
                                                            {this.state.processs.length > 0 ? this.state.processs.map((r, index) => {

                                                                return (<option
                                                                    id={"processmask-" + r.id}
                                                                    value={r.id}
                                                                    key={index}
                                                                    data-processmask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                >
                                                                    {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                                </option>)

                                                            }) : <option defaultValue={true}>Error al cargar
                                                                los
                                                                Datos</option>}
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>

                                                {this.state.process !== '' ? this.state.reportEntry.length > 0 ?
                                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>DECARGAR -
                                                                EXCEL</Tooltip>}>
                                                            <button
                                                                style={{
                                                                    float: "right", marginRight: "3px", width: '100%'
                                                                }}
                                                                onClick={() => this.xlxsPaymentAdmissionPlanSemester()}
                                                                type="butt-on"
                                                                className=" btn btn-success"><GetApp />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </Col> : <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <button
                                                            style={{ float: "right", marginRight: "3px", width: '100%' }}
                                                            disabled={true}
                                                            type="butt-on"
                                                            className=" btn btn-success">No se
                                                            encontraron
                                                            registros
                                                        </button>
                                                    </Col>

                                                    : ''

                                                }

                                            </>

                                            }
                                            {this.state.typeOptionTwo === 'LIQUIDACION' && <>


                                                {

                                                    this.state.reportLiquidations ?
                                                        <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <OverlayTrigger
                                                                overlay={<Tooltip>DECARGAR - PDF</Tooltip>}>
                                                                <button
                                                                    style={{
                                                                        float: "right",
                                                                        marginRight: "3px",
                                                                        width: '100%'
                                                                    }}
                                                                    onClick={() => this.Pdfliquidacion(this.state.reportLiquidations)}
                                                                    type="butt-on"
                                                                    className=" btn btn-danger"><GetApp />
                                                                </button>
                                                            </OverlayTrigger>
                                                        </Col> : <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                            <button
                                                                style={{
                                                                    float: "right", marginRight: "3px", width: '100%'
                                                                }}
                                                                disabled={true}
                                                                type="butt-on"
                                                                className=" btn btn-success">No se
                                                                encontraronsss
                                                                registros
                                                            </button>
                                                        </Col>


                                                }

                                            </>

                                            }
                                        </>}

                                        {this.state.typeOption === 'FECHA PAGO' && <>
                                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <Form.Group className="form-group fill">
                                                    <Form.Label className="floating-label"
                                                    // style={date_start === "" ? {color: "#ff5252 "} : null}
                                                    >Fecha de Inicio <small
                                                        className="text-danger"> *</small></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        className="form-control"
                                                        onChange={this.handleChange('startMovement')}
                                                        max="2999-12-31"
                                                        value={startMovement}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <Form.Group className="form-group fill">
                                                    <Form.Label className="floating-label"
                                                    // style={date_start === "" ? {color: "#ff5252 "} : null}
                                                    >Fecha de Fin <small
                                                        className="text-danger"> *</small></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        className="form-control"
                                                        onChange={this.handleChange('endMovement')}
                                                        max="2999-12-31"
                                                        value={endMovement}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            {this.state.reportMovementDates.length > 0 ?

                                                <>
                                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>DECARGAR VOUCHER POR FECHA -
                                                                EXCEL</Tooltip>}>
                                                            <button
                                                                style={{
                                                                    float: "right", marginRight: "3px", width: '100%'
                                                                }}
                                                                onClick={() => this.MovementStudentByRangeDate()}
                                                                type="butt-on"
                                                                className=" btn btn-success"><GetApp />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>DECARGAR VOUCHER POR FECHA -
                                                                PDF</Tooltip>}>
                                                            <button
                                                                style={{
                                                                    float: "right", marginRight: "3px", width: '100%'
                                                                }}
                                                                onClick={() => this.PdfMovementStudentByRangeDateRegisterVoucher()}
                                                                type="butt-on"
                                                                className=" btn btn-warning"><GetApp />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                </> : <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <button
                                                        style={{
                                                            float: "right", marginRight: "3px", width: '100%'
                                                        }}
                                                        disabled={true}
                                                        type="butt-on"
                                                        className=" btn btn-success">No se encontraron
                                                        registros
                                                    </button>
                                                </Col>


                                            }

                                        </>}
                                        {this.state.typeOption === 'FECHA REGISTRO' && <>
                                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <Form.Group className="form-group fill">
                                                    <Form.Label className="floating-label"
                                                    // style={date_start === "" ? {color: "#ff5252 "} : null}
                                                    >Fecha de Inicio <small
                                                        className="text-danger"> *</small></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        className="form-control"
                                                        onChange={this.handleChange('startMovementRegister')}
                                                        max="2999-12-31"
                                                        value={startMovementRegister}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                                <Form.Group className="form-group fill">
                                                    <Form.Label className="floating-label"
                                                    // style={date_start === "" ? {color: "#ff5252 "} : null}
                                                    >Fecha de Fin <small
                                                        className="text-danger"> *</small></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        className="form-control"
                                                        onChange={this.handleChange('endMovementRegister')}
                                                        max="2999-12-31"
                                                        value={endMovementRegister}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            {this.state.reportMovementDates.length > 0 ?

                                                <>
                                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>DECARGAR VOUCHER POR FECHA -
                                                                EXCEL</Tooltip>}>
                                                            <button
                                                                style={{
                                                                    float: "right", marginRight: "3px", width: '100%'
                                                                }}
                                                                onClick={() => this.MovementStudentByRangeDate()}
                                                                type="butt-on"
                                                                className=" btn btn-success"><GetApp />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                        <OverlayTrigger
                                                            overlay={<Tooltip>DECARGAR VOUCHER POR FECHA -
                                                                PDF</Tooltip>}>
                                                            <button
                                                                style={{
                                                                    float: "right", marginRight: "3px", width: '100%'
                                                                }}
                                                                onClick={() => this.PdfMovementStudentByRangeDate()}
                                                                type="butt-on"
                                                                className=" btn btn-danger"><GetApp />
                                                            </button>
                                                        </OverlayTrigger>
                                                    </Col>
                                                </> : <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                    <button
                                                        style={{
                                                            float: "right", marginRight: "3px", width: '100%'
                                                        }}
                                                        disabled={true}
                                                        type="butt-on"
                                                        className=" btn btn-success">No se encontraron
                                                        registros
                                                    </button>
                                                </Col>


                                            }

                                        </>}
                                    </>}
                                    {this.state.module === 'ESTUDIANTES INSCRITOS' && <>
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
                                        {this.state.process !== '' ? this.state.reportEntry.length > 0 ?
                                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>DECARGAR - EXCEL</Tooltip>}>
                                                    <button
                                                        style={{
                                                            float: "right", marginRight: "3px", width: '100%'
                                                        }}
                                                        onClick={() => this.xlxsEntry()}
                                                        type="butt-on"
                                                        className=" btn btn-success"><GetApp />
                                                    </button>
                                                </OverlayTrigger>
                                            </Col> : <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <button
                                                    style={{
                                                        float: "right", marginRight: "3px", width: '100%'
                                                    }}
                                                    disabled={true}
                                                    type="butt-on"
                                                    className=" btn btn-success">No se encontraron registros
                                                </button>
                                            </Col>

                                            : ''

                                        }

                                    </>

                                    }
                                    {this.state.module === 'ESTUDIANTES MATRICULADOS' && <>
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
                                        {this.state.process !== '' ? this.state.reportEntry.length > 0 ?
                                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>DECARGAR - EXCEL</Tooltip>}>
                                                    <button
                                                        style={{
                                                            float: "right", marginRight: "3px", width: '100%'
                                                        }}
                                                        onClick={() => this.xlxsRegistration()}
                                                        type="butt-on"
                                                        className=" btn btn-success"><GetApp />
                                                    </button>
                                                </OverlayTrigger>
                                            </Col>

                                            : <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                                <button
                                                    style={{
                                                        float: "right", marginRight: "3px", width: '100%'
                                                    }}
                                                    disabled={true}
                                                    type="butt-on"
                                                    className=" btn btn-success">No se encontraron registros
                                                </button>
                                            </Col>

                                            : ''

                                        }
                                    </>

                                    }
                                </Row>

                            </Card.Body>


                        </Card>
                        <br />
                        {this.state.module === 'PAGOS' && this.state.typeOption === 'ESTUDIANTE' &&
                            <SearchStudent organicUnit={this.state.organicUnit} personInfo={this.personInfo} />

                        }

                        {this.state.module === 'PAGOS' && this.state.typeOption === 'ESTUDIANTE' && this.state.studentID !== '' &&
                            <Payment studentID={this.state.studentID} />}
                        {this.state.module === 'PAGOS' && this.state.typeOption === 'PROGRAMA' && this.state.typeOptionTwo === 'PLAN DE ADMISIÓN' && this.state.admissionPlan !== '' &&
                            <DataTablePaymentProgramAdmision admissionPlan={this.state.admissionPlan}
                            />}
                        {this.state.module === 'INSCRIPCIONES' && this.state.program !== '' &&
                            <DataTableInscription program={this.state.program}
                            />}
                    </Col>


                </Row>

            </>

        );
    }
}
