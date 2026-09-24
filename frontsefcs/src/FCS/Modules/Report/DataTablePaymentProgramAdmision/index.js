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
            movements: [],
            info: ''
        }

    };

    componentDidMount() {
        this.reportPaymentProgramAdmision(this.props.admissionPlan)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.admissionPlan !== this.props.admissionPlan) {
            this.props.admissionPlan !== '' && this.reportPaymentProgramAdmision(this.props.admissionPlan)
        }
    }

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    async reportPaymentProgramAdmision(id_admission_plan) {
        this.setState({movementLoader: true});
        const url = app.general + '/' + app.report + '-payment/program/' + app.admissionPlan + '/' + id_admission_plan;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data.movements) {
                let totalMovement = 0;

                res.data.movements.map((r) => {
                    if (r.Movement.state === "Aceptado") totalMovement = parseFloat(r.Movement.voucher_amount) + totalMovement
                });
                this.setState({movements: res.data.movements, totalMovement: totalMovement, info: res.data.info});
            }


            this.setState({movementLoader: false});
        } catch (err) {
            this.setState({movementLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    render() {

        const {movements} = this.state;
        let totalAcept = 0;
        let totalRegister = 0;
        movements.map(r => {
            if (r.Movement.state === 'Aceptado') {
                totalAcept = parseFloat(r.Movement.voucher_amount) + totalAcept
            } else {
                totalRegister = parseFloat(r.Movement.voucher_amount) + totalRegister
            }
        })
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
                    data,
                    movements
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
                name: "N° RECIBO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `N° RECIBO: ${v}`},
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
                name: "MONTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `MONTO: ${v}`},
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
                name: "FECHA DE RECIBO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA DE RECIBO: ${v}`},
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
                name: "PAGO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PAGO: ${v}`},
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
                name: "ARCHIVO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `ARCHIVO: ${v}`},
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
                name: "OBSERVACIÓN",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `OBSERVACIÓN: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "";
                        } else {

                            return value ? value : ""
                        }
                    },
                }
            },
            {
                name: "FECHA DE REGISTRO",
                options: {
                    filter: true,
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
                    filter: true,
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

        if (movements.length > 0) {
            movements.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.Person.document_number,
                            r.Person.name,
                            r.Movement.voucher_code,
                            r.Movement.voucher_amount,
                            r.Movement.voucher_date,
                            r.Movement.type,
                            r.Movement.state,
                            r.Movement.voucher_url,
                            r.Movement.observation,
                            r.Movement.created_at,
                            r.Movement.updated_at,


                        ])
                    )
                }
            );
        } else {
            data.push(["No se encontraron registros"]);
        }

        return (


            <MuiThemeProvider theme={this.getMuiTheme()}>
                {this.state.movementLoader && component.spiner}
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