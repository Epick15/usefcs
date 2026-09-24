import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {Col, Form, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import app from "../../../Constants";
import HoraryForm from "../Form";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";
import Fingerprint from "@material-ui/icons/Fingerprint";

class Index extends Component {
    state = {
        form: false,
        activate: false,

        program: '', process: '', records: [], programs: [], processs: [], retriveDataSchedule: []
    }

    async componentDidMount() {
        this.listAcademicSemesterAndAcademicCalendar();


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.organicUnit !== this.props.organicUnit) {
            this.listSimpleProgramByOrganicUnitRegisterID(this.props.organicUnit)
        }

    }

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
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: 2000});
            console.log(err)

        }

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

    async retriveSemesterActivity(program, process) {
        this.setState({loaderSchedule: true});
        const url = app.general + '/' + app.semesterActivity + '/retrive';

        try {
            let data = new FormData();
            data.set('id_process', process);
            data.set('id_program', program);
            data.set('id_activity', 2); //HOARIOS
            const res = await axios.patch(url, data, app.headers);
            this.setState({
                activate: res.data,
            });
            this.listScheduleByProgram(program, process)
            this.setState({loaderSchedule: false});
        } catch (err) {
            this.setState({loaderSchedule: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async listScheduleByProgram(program, process) {
        this.setState({loaderSchedule: true});
        const url = app.registration + '/' + app.schedule + '-program/' + program + '/' + process;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                records: res.data,
            });
            this.setState({loaderSchedule: false});
        } catch (err) {
            this.setState({loaderSchedule: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err);
        }
    };

    async destroySchedule(id) {

        try {
            // this.setState({loaderDestroyStudent: true});
            const url = app.registration + '/' + app.schedule + '/' + id
            const res = await axios.delete(url, app.headers);
            if (res) {
                this.listScheduleByProgram(this.state.program, this.state.process)
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            }

            // this.setState({loaderDestroyStudent: false});


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.error.message, delay: 2000});
            // this.setState({loaderDestroyStudent: false});
            return false;
        }
    };

    async createUserIntranet(id, type) {

        document.getElementById('generate-' + id).style.display = "none";
        document.getElementById('spin-' + id).style.display = "";
        if (id !== '' && type !== '') {
            const url = app.intranet + '/' + app.userIntranet;
            let data = new FormData();
            data.set('id_person', id);
            data.set('type', type);
            try {
                const res = await axios.post(url, data, app.headers);
                document.getElementById('generate-' + id).style.display = "";
                document.getElementById('spin-' + id).style.display = "none";
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            } catch (err) {

                document.getElementById('generate-' + id).style.display = "";
                document.getElementById('spin-' + id).style.display = "none";
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            }

        } else {
            document.getElementById('generate-' + id).style.display = "";
            document.getElementById('spin-' + id).style.display = "none";
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    async createScheduleMassive() {
        this.setState({loaderHorary: true});
        const {organicUnit} = this.props;
        const {program, process} = this.state;


        if (program !== "" && process !== "" && organicUnit !== "") {
            const url = app.registration + '/' + app.schedule + '/massive';
            let data = new FormData();
            data.set("id_organic_unit", organicUnit);
            data.set("id_process", process);
            data.set("id_program", program);


            try {
                const res = await axios.post(url, data, app.headers);
                this.listScheduleByProgram(this.state.program, this.state.process)
                this.setState({loaderHorary: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderHorary: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderHorary: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    getMuiTheme = () => createTheme({overrides: component.MuiOption.overrides});
    openForm = () => {

        this.setState({form: true})
    };
    closeForm = () => {
        this.setState({form: false, retriveDataSchedule: "", optionDelete: ""})
        this.listScheduleByProgram(this.state.program, this.state.process);
    };
    handleChange = field => event => {
        switch (field) {


            case 'program':
                this.setState({
                    program: event.target.value,
                });
                event.target.value && this.state.process && this.retriveSemesterActivity(event.target.value, this.state.process)
                break;
            case 'process':
                this.setState({
                    process: event.target.value,
                });
                event.target.value && this.state.program && this.retriveSemesterActivity(this.state.program, event.target.value)
                break;


            default:
                break;
        }
    };

    retriveDataSchedule = (data) => {
        this.setState({
            form: true, retriveDataSchedule: data
        })
    }
    retriveDataActa = (data) => {
        this.setState({
            // form: true,
            // retriveDataSchedule: data
        })
    }
    swalSchedule = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!, se eliminaran en cascada todos los datos que tengan relacion con este registro",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.value && await this.destroySchedule(id);
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };
    callCreateHoraryMassive = () => {
        this.createScheduleMassive()
    }

    render() {
        const {process, programs, processs, program, records} = this.state;

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
                filename: 'excel-format.csv', separator: ';', filterOptions: {
                    useDisplayedColumnsOnly: true, useDisplayedRowsOnly: true,
                }
            },
            customToolbar: () => {
                return (<>
                    {this.state.program && this.state.process && this.state.records.length > 0 && !this.state.loaderSchedule && this.state.activate &&

                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.openForm()} type="button"
                                    className="btn-icon btn btn-primary"><i className="feather icon-plus"></i>
                            </button>
                        </OverlayTrigger>

                    }
                    {this.state.program && this.state.process && this.state.records.length <= 0 && !this.state.loaderSchedule && this.state.activate &&

                        <OverlayTrigger
                            overlay={<Tooltip>Generar Datos en grupo</Tooltip>}>
                            <button onClick={() => this.callCreateHoraryMassive()} type="button"
                                    className="btn-icon btn btn-info"><i className="feather icon-plus"></i>
                            </button>
                        </OverlayTrigger>

                    }
                </>)
            },

        };

        const columns = [
            {
                name: "#", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        return value;
                    },
                }
            },
            {
                name: "CICLO", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "CURSO", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "PLAN DE ESTUDIO", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No";
                        } else {

                            return value.substr(15)

                        }
                    },
                }
            }, {
                name: "ACTA GENERADA", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No";
                        } else {

                            return value.length > 0 ? "Si" : "No"
                        }
                    },
                }
            }, {
                name: "GRUPO", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            }, {
                name: "TIPO", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },


            {

                name: "FECHA INCIO", options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA INCIO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            }, {

                name: "FECHA FIN", options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA FIN: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            }, {

                name: "FECHA FIN ACTA", options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA FIN ACTA: ${v}`},
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
                name: "ACCIONES", options: {
                    filter: false, sort: true, download: false, // display: "excluded",
                    setCellHeaderProps: () => ({align: 'left'}), setCellProps: () => ({align: 'left'}),

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            if (value.Acta_books.length <= 0) {
                                return (<>
                                    {

                                        value.Teacher && value.Teacher.Person && <>
                                        <span id={'spin-' + value.Teacher.Person.id} style={{display: 'none'}}
                                              className="spinner-border spinner-border-sm mr-1" role="status"/>
                                            <OverlayTrigger overlay={<Tooltip>GENERAR ACCESO</Tooltip>}>
                                                <Fingerprint className={"text-info"}
                                                             id={'generate-' + value.Teacher.Person.id}
                                                             onClick={() => this.createUserIntranet(value.Teacher.Person.id, 'Docente')}/>
                                            </OverlayTrigger>
                                        </>}
                                    {
                                        this.state.activate &&
                                        <>
                                            <OverlayTrigger
                                                overlay={<Tooltip>EDITAR</Tooltip>}>
                                                <Edit style={{color: "#1d86e0"}}
                                                      onClick={() => this.retriveDataSchedule(value)}
                                                />

                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                <Delete style={{color: "#ff5252"}}
                                                        onClick={() => this.swalSchedule(value.id)}
                                                />
                                            </OverlayTrigger>
                                        </>
                                    }

                                </>)
                            }

                        }


                    },


                }
            }


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                return (data.push([index + 1,
                    r.Course.Ciclo.ciclo,
                    r.Course.denomination,
                    r.Course.Ciclo.Plan.description,
                    r.Acta_books,
                    r.group_class,
                    r.type_registration,
                    r.start_date,
                    r.end_date,
                    r.end_date_acta,
                    r

                ]))
            });
        }

        return (<>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={<Row>
                            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Form.Group className="form-group fill">

                                    <Form.Control as="select"
                                                  value={program}
                                                  onChange={this.handleChange('program')}
                                    >

                                        <option defaultValue={true} hidden>Programa</option>
                                        {programs.length > 0 ? programs.map((r, k) => {

                                            return (<option id={"programmask-" + r.id}
                                                            dataprogrammask={r.denomination}
                                                            value={r.id}
                                                            key={k}> {r.denomination} </option>)

                                        }) : <option value={false} disabled>No se encontraron
                                            datos</option>}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">


                                    {/*{this.state.calendarLoader ?*/}
                                    {/*<span className="spinner-border spinner-border-sm mr-1" role="status"/>*/}
                                    <Form.Control as="select"
                                                  value={process}
                                                  onChange={this.handleChange('process')}
                                    >

                                        <option defaultValue={true} hidden>
                                            Proceso
                                        </option>
                                        {processs.length > 0 ? processs.map((r, index) => {

                                            return (<option value={r.id} key={index}
                                                            id={"process-" + r.id}
                                                            mask-calendar={r.Academic_calendar.denomination.substr(-4)}
                                                            mask-process={r.denomination.substr(-1)}
                                            >
                                                {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                            </option>)

                                        }) : <option defaultValue={true}>Error al cargar los
                                            Datos</option>}

                                    </Form.Control>


                                </Form.Group>
                            </Col>
                        </Row>

                        }
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
                {/*{this.state.form &&*/}
                <HoraryForm

                    form={this.state.form}
                    retriveDataSchedule={this.state.retriveDataSchedule}
                    program={this.state.program}
                    process={this.state.process}
                    organicUnit={this.props.organicUnit}
                    closeForm={this.closeForm}

                />
                {/*}*/}
            </>


        );
    }

}

export default Index;
