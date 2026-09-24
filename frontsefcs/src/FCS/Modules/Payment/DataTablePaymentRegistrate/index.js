import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import Delete from "@material-ui/icons/Delete";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import component from "../../../Component";

import Edit from "@material-ui/icons/Edit";

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: false,
            studentID: this.props.studentID,
        };
    }

    getMuiTheme = () =>
        createMuiTheme({ overrides: component.MuiOption.overrides });

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID &&
                this.setState({ studentID: this.props.studentID });
        }
    }

    render() {
        const { records } = this.props;
        let total = 0;
        records.map((r) => {
            if (r.state === "Aceptado") {
                total = parseFloat(r.voucher_amount) + total;
            }
        });
        const options = {
            filter: true,
            searchOpen: false,
            responsive: "simple",
            searchPlaceholder: "Buscar",
            search: true,
            print: false,
            download: false,
            rowsPerPage: 100,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                name: "NOMBRE",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: { render: (v) => `NOMBRE: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "DNI",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: { render: (v) => `DNI: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "UNI.ORG",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: { render: (v) => `UNI.ORG: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "N° RECIBO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `N° RECIBO: ${v}`,
                    },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "MONTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `MONTO: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "FECHA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `FECHA: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },

            {
                name: "PAGO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `PAGO: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                return data.push([
                    index + 1,
                    r.Student.Person.name,
                    r.Student.Person.document_number,
                    r.Student.Program.description,
                    r.voucher_code,
                    r.voucher_amount,
                    r.voucher_date,

                    // r.type,
                    r.state,
                    r,
                ]);
            });
        }

        return (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"Vouchers pendientes de validación"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

export default DataTable;
