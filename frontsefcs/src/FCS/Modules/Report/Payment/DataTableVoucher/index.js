import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import component from "../../../../Component"


class DataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});


    render() {

        const {movements, infoStudent} = this.props;
        let total = 0;
        movements.map(r => {
            if (r.state === 'Aceptado') {
                total = parseFloat(r.voucher_amount) + total
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
                component.pdfReportAutoVoucherStudent(
                    "REPORTE DE RECIBOS DE PAGO",
                    infoStudent.facultad.toUpperCase(),
                    infoStudent.program.toUpperCase(),
                    infoStudent.sede.toUpperCase(),
                    infoStudent.name.toUpperCase(),
                    total,
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
                            r.voucher_code,
                            r.voucher_amount,
                            r.voucher_date,
                            r.type,
                            r.state,
                            r.voucher_url,
                            r.observation,
                            r.created_at,
                            r.updated_at,


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
                    title={"RECIBOS ACEPTADO S/." + total}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;