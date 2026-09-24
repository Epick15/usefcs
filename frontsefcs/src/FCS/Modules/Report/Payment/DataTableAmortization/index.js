import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import component from "../../../../Component"


class DataTable extends Component {

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});


    render() {

        const {payments, infoStudent} = this.props;
        let total = 0;
        payments.map(r => {
            if (r.type === 'Pagado') {
                total = parseFloat(r.amount) + total
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
                component.pdfReportAutoConceptStudent(
                    "REPORTE DE CONCEPTOS DE PAGO",
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
                }
            },
            {
                name: "CONCEPTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CONCEPTO: ${v}`},
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
                name: "MONTO",
                options: {
                    filter: false,
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
                name: "PROCESO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `SEMESTER: ${v}`},
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
            {
                name: "id_process",
                options: {
                    filter: true,
                    sort: true,
                    display:false,
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

        if (payments.length > 0) {
            payments.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.concept,
                            r.amount,
                            r.process,
                            r.type,
                            r.created_at,
                            r.updated_at,
                            r.id_process,

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
                    title={"CONCEPTOS PAGADOS S/." + total}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;