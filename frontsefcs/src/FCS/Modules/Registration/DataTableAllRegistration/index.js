import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import PNotify from "pnotify/dist/es/PNotify";
import $ from 'jquery';
import {OverlayTrigger, Tooltip, Form, Col, Row} from "react-bootstrap";
import Refresh from '@material-ui/icons/Refresh'
import component from "../../../Component"
import app from "../../../Constants";
import axios from "axios";
import moment from "moment";


class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            process: '',
            processMask: '',
            processs: [],
            records: [],
            form: false,
            studentID: this.props.studentID,
        }

    };

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    componentDidMount() {
        this.listAcademicSemesterAndAcademicCalendar()
    }

    async listRegistrationByOrganicUnitSemester(id_process) {
        // this.setState({retirementDataLoader: true});
        const url = app.registration + '/' + app.registrations + '/' + app.organicUnit + '/' + app.semester + '/' + id_process;
        try {
            let data = new FormData();
            data.set('id_organic_unit', this.props.organicUnit);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                this.setState({records: res.data})
            }

            // this.setState({retirementDataLoader: false});
        } catch (err) {
            // this.setState({retirementDataLoader: false});
            PNotify.error({
                title: "Algo salio mal al cargar los datos",
                text: "Por favor intentelo nuevamente",
                delay: 2000
            });
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


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID && this.setState({studentID: this.props.studentID})
        }

    }

    handleChange = field => event => {
        switch (field) {

            case 'process':
                let process = $('#process-' + event.target.value).attr('process-mask');
                this.listRegistrationByOrganicUnitSemester(event.target.value)
                this.setState({process: event.target.value, processMask: process});
                break;
            default:
                break;
        }
    };

    render() {

        const {processs, records} = this.state;


        const options = {

            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,

            draggableColumns: {
                enabled: true
            },
            draggable: true,
            rowsPerPage: 100,
            print: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            download: true,
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


                        <OverlayTrigger
                            overlay={<Tooltip>RECARGAR</Tooltip>}>
                            <button onClick={() => this.listRegistrationByOrganicUnitSemester(this.state.process)}
                                    type="button"
                                    className="btn-icon btn btn-light"><Refresh/></button>

                        </OverlayTrigger>

                    </>


                )
            },
            onDownload: (buildHead, buildBody, columns, data) => {

                component.pdfReportAutoTableRegistrationModule(
                    this.props.organicUnitMask,
                    this.state.processMask,
                    columns,
                    data
                );
                return false;
            },

        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "NOMBRE",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `NOMBRE: ${v}`},
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
                    customFilterListOptions: {render: v => `DNI: ${v}`},
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
                name: "ADMISIÓN",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `ADMISIÓN: ${v}`},
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
                name: "PROGRAMA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PROGRAMA: ${v}`},
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
                name: "TIPO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `TIPO: ${v}`},
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
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `ESTADO: ${v}`},
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
                name: "F.REGISTRO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `F.REGISTRO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? moment(value).format('YYYY-MM-DD h:mm:ss') : "No def."
                        }
                    },
                }
            },


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.Student.Person.name,
                            r.Student.Person.document_number,
                            r.Student.Admission_plan.description.substr(-6),
                            r.Program.denomination,
                            r.type,
                            r.state,
                            r.created_at,


                        ])
                    )
                }
            );
        }
        return (


            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={

                        <Form.Group className="form-group fill">


                            {this.state.calendarLoader ?
                                <span className="spinner-border spinner-border-sm mr-1" role="status"/> :

                                <Row>
                                    <Col>
                                        <Form.Control as="select"
                                                      value={this.state.process}
                                                      onChange={this.handleChange('process')}
                                        >

                                            <option defaultValue={true} hidden>
                                                Proceso
                                            </option>
                                            {
                                                processs.length > 0 ?
                                                    processs.map((r, index) => {

                                                        return (
                                                            <option value={r.id} key={index}
                                                                    id={"process-" + r.id}
                                                                    process-mask={r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}

                                                            >
                                                                {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-2)}
                                                            </option>
                                                        )

                                                    }) :
                                                    <option defaultValue={true}>Error al cargar los
                                                        Datos</option>
                                            }

                                        </Form.Control>
                                    </Col>
                                    {/*<Col>*/}
                                    {/*    <Form.Control as="select"*/}
                                    {/*                  value={this.state.process}*/}
                                    {/*                  onChange={this.handleChange('process')}*/}
                                    {/*    >*/}

                                    {/*        <option defaultValue={true} hidden>*/}
                                    {/*            Programa*/}
                                    {/*        </option>*/}
                                    {/*        {*/}
                                    {/*            processs.length > 0 ?*/}
                                    {/*                processs.map((r, index) => {*/}

                                    {/*                    return (*/}
                                    {/*                        <option value={r.id} key={index}*/}
                                    {/*                                id={"process-" + r.id}*/}
                                    {/*                                mask-calendar={r.Academic_calendar.denomination.substr(-4)}*/}
                                    {/*                                mask-process={r.denomination.substr(-1)}*/}
                                    {/*                        >*/}
                                    {/*                            {r.Academic_calendar.denomination.substr(-4) + '-' + r.denomination.substr(-1)}*/}
                                    {/*                        </option>*/}
                                    {/*                    )*/}

                                    {/*                }) :*/}
                                    {/*                <option defaultValue={true}>Error al cargar los*/}
                                    {/*                    Datos</option>*/}
                                    {/*        }*/}

                                    {/*    </Form.Control>*/}
                                    {/*</Col>*/}
                                </Row>
                            }

                        </Form.Group>

                    }
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }

}

export default DataTable;