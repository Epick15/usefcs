import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import component from "../../../Component"
import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../Constants";
import {Build} from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import axios from "axios";
import $ from 'jquery';

class Index extends Component {
    state = {
        modal: false,
        process: '',
        processs: [],

        admissionPlanMask: "",
        programMask: "",
        program: "",
        type: "",
        admissionPlan: "",


        admissionPlans: [],
        programs: [],
        records: [],

    }

    componentDidMount() {
        this.props.organicUnit && this.listSimpleProgramByOrganicUnitRegisterID(this.props.organicUnit)
        this.listAcademicSemesterAndAcademicCalendar()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.organicUnit !== this.props.organicUnit) {
            this.props.organicUnit && this.listSimpleProgramByOrganicUnitRegisterID(this.props.organicUnit)
        }

    }

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

    async createNoRegistration() {
        this.setState({loaderRegistration: true});
        const {process, studentID, organicUnit, program, type} = this.state;
        if (process !== '' && studentID !== '' && organicUnit !== '' && program !== '') {
            const url = app.registration + '/' + app.registrations + '/no';
            let data = new FormData();
            data.set('id_semester', process);
            data.set('id_organic_unit', organicUnit);
            data.set('id_program', program);
            data.set('type', type);
            data.set('id_student', studentID);

            try {
                const res = await axios.post(url, data, app.headers);
                this.listStudentAdmissionProgramWithRegistration(this.state.admissionPlan);
                this.setState({loaderRegistration: false});
                this.closeModal()
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            } catch (err) {
                this.setState({loaderRegistration: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            }
        } else {
            this.setState({loaderRegistration: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    async listStudentAdmissionProgramWithRegistration(id_admission_plan) {
        this.setState({studentLoader: true});
        const url = app.person + '/' + app.student + '/program/' + app.admissionPlan + '/with-registration/' + id_admission_plan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {

                this.setState({records: res.data});
            }
            this.setState({studentLoader: false});
        } catch (err) {
            this.setState({studentLoader: false});
            console.log(err)
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


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});
    openModal = (r) => {
        this.setState({
            modal: true,
            program: r.id_program,
            organicUnit: r.id_organic_unit,
            studentID: r.id,

        })
        console.log(r)
    };
    closeModal = () => {
        this.setState({modal: false, process: ''})

    };

    async destroyNoRegistration(id) {
        try {
            this.setState({loaderCharge: true});
            const url = app.registration + '/' + app.registrations + '/no/' + id;
            const res = await axios.delete(url, app.headers);

            this.listStudentAdmissionProgramWithRegistration(this.state.admissionPlan);
            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderCharge: false});

            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loaderCharge: false});
            return false;
        }
    };

    callDestroyNoRegistration = (id) => {
        this.destroyNoRegistration(id)

    };
    handleChange = field => event => {
        switch (field) {

            case 'program':
                let programMask = $('#programmask-' + event.target.value).attr('dataprogrammask');
                this.setState({program: event.target.value, programMask: programMask});
                this.listAdmissionPlanByProgramIDS(event.target.value)
                break;
            case 'admissionPlan':


                let admissionplanmask = $('#admissionPlan-' + event.target.value).attr('admissionplanmask');
                let studyPlanMask = $('#admissionPlan-' + event.target.value).attr('datastudyplanmask');
                this.setState({
                    admissionPlan: event.target.value,
                    admissionPlanMask: admissionplanmask,

                });
                this.listStudentAdmissionProgramWithRegistration(event.target.value);
                break;
            case 'process':
                this.setState({process: event.target.value});

                break;
            case 'type':
                this.setState({type: event.target.value});

                break;
            default:
                break;
        }
    };

    render() {
        const {processs, process, records} = this.state;
        const {programs, program, admissionPlans, admissionPlan, students} = this.state;
        const options = {
            filter: true,
            searchOpen: false,
            print: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            rowsPerPage: 100,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            rowsPerPageOptions: [10, 30, 50, 500],
            draggableColumns: {
                enabled: true
            },
            downloadOptions: {
                filename: 'excel-format.csv',
                separator: ';',
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                }
            },
            customToolbar: () => {
                return (
                    <>

                    </>
                )
            },
            onDownload: (buildHead, buildBody, columns, data) => {
                component.pdfReportAutoTableRegistrationByAdmissionPlan(
                    "REPORTE DE MATRÍCULA DE ESTUDIANTES",

                    this.props.organicUnitMask,
                    this.state.programMask,
                    this.state.admissionPlanMask,



                    columns,
                    this.state.records
                )
                ;
                return false;
            },
        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        return value;
                    },
                }
            },
            {
                name: "NOMBRE",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "DNI",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "ESTADO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {

                name: "MATRÍCULA ",
                options: {
                    filter: false,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {render: v => `MATRÍCULA  : ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "ACCIONES",
                options: {
                    filter: false,
                    sort: true,
                    download: false,
                    // display: "excluded",
                    // setCellHeaderProps: () => ({align: 'center'}),
                    // setCellProps: () => ({align: 'center'}),

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>

                                    <OverlayTrigger
                                        overlay={<Tooltip>REGISTRAR NO MATRÍCULA</Tooltip>}>
                                        <Build style={{color: "#4367ec"}} onClick={() => this.openModal(value)}/>

                                    </OverlayTrigger>

                                </>
                                : "No def."
                        }


                    },


                }
            }
        ];


        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                    data.push([
                        index + 1,
                        r.Person.name,
                        r.Person.document_number,
                        r.type
                    ])
                    let temp = []
                    let algo = '';
                    if (r.Registration.length > 0) {

                        r.Registration.map((m, i) => {

                            if (m.type === 'Retirado' || m.type === 'Desertado') {
                                algo =
                                    <><a key={i} style={{color: '#ff5252'}}
                                         href="#"
                                         onClick={() => this.callDestroyNoRegistration(m.id)}>{m.Academic_semester.Academic_calendar.denomination.substr(-4) + ' - ' + m.Academic_semester.denomination.substr(-2) + ' ' + m.type}</a> |
                                    </>;
                            } else {
                                algo =
                                    <>{m.Academic_semester.Academic_calendar.denomination.substr(-4) + ' - ' + m.Academic_semester.denomination.substr(-2) + ' ' + m.type + ' | '}</>;
                            }
                            temp.push(algo);

                        })
                    } else {
                        algo = 'No def.'
                        temp.push(algo);
                    }
                    data[index].push(temp)
                    data[index].push(r)
                    return data
                }
            );
        }

        return (

            <>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={
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
                                                    <option value={false} disabled>No se encontraron datos</option>
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Form.Group className="form-group fill">

                                        {this.state.admissionPlanLoader ?
                                            <span className="spinner-border spinner-border-sm mr-1" role="status"/> :
                                            <Form.Control as="select"
                                                          value={admissionPlan}
                                                          onChange={this.handleChange('admissionPlan')}
                                            >
                                                >
                                                <option defaultValue={true} hidden>Plan de admision</option>
                                                {
                                                    admissionPlans.length > 0 ?
                                                        admissionPlans.map((r, k) =>
                                                            <option id={"admissionPlan-" + r.id}

                                                                    admissionplanmask={r.description}
                                                                    datastudyplanmask={r.Plan.description}

                                                                    value={r.id}
                                                                    key={k}> {r.description} </option>
                                                        ) :
                                                        <option value={false} disabled>No se encontraron datos</option>
                                                }
                                            </Form.Control>
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
                <Modal show={this.state.modal}>
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR INCIDENCIA</Modal.Title>

                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}}
                                       onClick={() => this.closeModal()}/>

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={process === "" ? {color: "#ff5252 "} : null}>
                                        Proceso
                                        <small className="text-danger"> *</small>
                                    </Form.Label>

                                    {this.state.calendarLoader ?
                                        <span className="spinner-border spinner-border-sm mr-1" role="status"/> :
                                        <Form.Control as="select"
                                                      value={process}
                                                      onChange={this.handleChange('process')}>
                                            >
                                            <option defaultValue={true} hidden>
                                                Proceso</option>
                                            {
                                                processs.length > 0 ?
                                                    processs.map((r, index) => {

                                                        return (
                                                            <option value={r.id} key={index}

                                                            >
                                                                {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                            </option>
                                                        )

                                                    }) :
                                                    <option defaultValue={true}>Error al cargar los
                                                        Datos</option>
                                            }

                                        </Form.Control>
                                    }

                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"
                                                style={this.state.type === "" ? {color: "#ff5252 "} : null}
                                    >Tipo<small className="text-danger"> *</small></Form.Label>
                                    <Form.Control as="select"
                                                  value={this.state.type}
                                                  onChange={this.handleChange('type')}>
                                        >
                                        <option defaultValue={true} hidden>Seleccione</option>
                                        {/*<option value={"Retirado"}> Retirado</option>*/}
                                        <option value={"Desertado"}> Desertado</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            className="pull-right"
                            // disabled={disabled}
                            variant="primary"
                            onClick={() => this.createNoRegistration()}
                        >
                            {/*{disabled &&*/}
                            {/*<span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                            Guardar
                        </Button>
                    </Modal.Body>


                </Modal>

            </>
        );
    }
}

export default Index;
