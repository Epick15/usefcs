import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import PNotify from "pnotify/dist/es/PNotify";
import component from "../../../Component"
import app from "../../../Constants";
import axios from "axios";

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inscriptions: [],
            info: ''
        }

    };

    componentDidMount() {
        this.reportInscription(this.props.program)
    }

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    async reportInscription(id_program) {
        this.setState({movementLoader: true});
        const url = app.general + '/' + app.report + '-inscription/' + id_program;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.inscriptions) {
                let totalMovement = 0;


                this.setState({inscriptions: res.data.inscriptions, totalMovement: totalMovement, info: res.data.info});
            }


            this.setState({movementLoader: false});
        } catch (err) {
            this.setState({movementLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    render() {

        const {inscriptions} = this.state;
        let totalAcept = 0;
        let totalRegister = 0;

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
            onDownload: (buildHead, buildBody, columns, data) => {
                // title1, facultad, program, sede, student, totalPayment,
                component.pdfReportAutoPaymentProgramAdmision(
                    "REPORTE DE INGRESOS POR PROGRAMA DE ESTUDIO",

                    this.state.info.program_denomination,
                    this.state.info.organic_unit_denomination,
                    this.state.info.admission_plan_denomination,
                    this.state.info.sede_denomination,

                    totalAcept,
                    totalRegister,
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
                    customFilterListOptions: {render: v => `#: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value.toString() : "No def."
                        }
                    }
                }
            },
            {
                name: "ESTUDIANTE",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `ESTUDIANTE: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    }


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
                name: "PLAN DE ESTUDIO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PLAN DE ESTUDIO: ${v}`},
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
                name: "PLAN DE ADMSIÓN",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PLAN DE ADMSIÓN: ${v}`},
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
                name: "FECHA DE REGISTRO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA DE REGISTRO: ${v}`},
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
                name: "ULTIMA ACTUALIZACIÓN",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `ULTIMA ACTUALIZACIÓN: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },

        ];
        let data = [];

        if (inscriptions.length > 0) {
            inscriptions.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.Person.name,
                            r.Person.document_number,
                            r.type,
                            r.Plan.description.substr(-7) ,
                            r.Admission_plan.description.substr(-7) ,
                            r.created_at,
                            r.updated_at
                        ])
                    )
                }
            );
        } else {
            data.push(["No se encontraron registros"]);
        }

        return (


            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"RECIBOS ACEPTADO S/." + totalAcept}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;