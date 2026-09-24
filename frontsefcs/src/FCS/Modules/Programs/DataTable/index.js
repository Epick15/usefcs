import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Book from "@material-ui/icons/Book";
import Assessment from "@material-ui/icons/Assessment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import component from "../../../Component";
import Description from "@material-ui/icons/Description";
import { Link } from "react-router-dom";

class DataTable extends Component {
    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });

    render() {
        const { records } = this.props;
        const options = {
            filter: true,
            searchOpen: false,
            responsive: "simple",
            searchPlaceholder: "Buscar",
            search: true,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            rowsPerPageOptions: [10, 30, 50, 500],
            draggableColumns: {
                enabled: true,
            },
            downloadOptions: {
                filename: "excel-format.csv",
                separator: ";",
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                },
            },

            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button
                                onClick={() => this.props.openForm()}
                                type="button"
                                className="btn-icon btn btn-primary"
                            >
                                <i className="feather icon-plus"></i>
                            </button>
                        </OverlayTrigger>
                    </>
                );
            },
            onDownload: (buildHead, buildBody, columns, data) => {
                component.pdfReportAutoTable(
                    "ESCUELA DE SE UNSM",
                    "REPORTE DE PROGRAMAS DE ESTUDIO",
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
                },
            },

            {
                name: "PROGRAMA",
                options: {
                    filter: false,
                    sort: true,
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
                name: "GRADO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `GRADO: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value.denomination : "No def.";
                        }
                    },
                },
            },
            {
                name: "UNI. ORG ADMINISTRADORA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `UNI. ORG ADMINISTRADORA: ${v}`,
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
                name: "FACULTAD",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `FACULTAD: ${v}`,
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
                name: "SEDE",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `SEDE: ${v}` },
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
                name: "ESTADO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `ESTADO: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            if (value === "") {
                                return "No def.";
                            } else {
                                return value ? (
                                    <span className="badge badge-primary inline-block">
                                        Habilitado
                                    </span>
                                ) : (
                                    <span className="badge badge-danger inline-block">
                                        Inhabilitado
                                    </span>
                                );
                            }
                        }
                    },
                },
            },

            {
                name: "ACCIONES",
                options: {
                    filter: false,
                    sort: true,
                    download: false,
                    // display: "excluded",
                    setCellHeaderProps: () => ({ align: "center" }),
                    setCellProps: () => ({ align: "center" }),

                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? (
                                <>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>PLANES DE ESTUDIO</Tooltip>
                                        }
                                    >
                                        <Link
                                            to={
                                                "/programs/" +
                                                btoa(value.id) +
                                                "/study-plan"
                                            }
                                        >
                                            {" "}
                                            <Book className={"text-warning"} />
                                        </Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>
                                                PLANES DE ADMISIÓN
                                            </Tooltip>
                                        }
                                    >
                                        <Link
                                            to={
                                                "/programs/" +
                                                btoa(value.id) +
                                                "/admission-plan"
                                            }
                                        >
                                            {" "}
                                            <Assessment
                                                className={"text-purple"}
                                            />
                                        </Link>
                                    </OverlayTrigger>
                                    {/*<OverlayTrigger overlay={<Tooltip>PLANES DE TRABAJO</Tooltip>}>*/}
                                    {/*    <Link to={"/programs/" + btoa(value.id) + "/work-plan"}> <Bookmark className={"text-info"}/></Link>*/}

                                    {/*</OverlayTrigger>*/}
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip
                                                style={{ zIndex: 100000000 }}
                                            >
                                                DOCUMENTOS
                                            </Tooltip>
                                        }
                                    >
                                        <Link
                                            to={
                                                "/programs/" +
                                                btoa(value.id) +
                                                "/document"
                                            }
                                        >
                                            {" "}
                                            <Description
                                                className={"text-secondary"}
                                            />
                                        </Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}
                                    >
                                        <Edit
                                            style={{ color: "#1d86e0" }}
                                            onClick={() =>
                                                this.props.retriveData(value)
                                            }
                                        />
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>ANULAR</Tooltip>}
                                    >
                                        <Delete
                                            style={{ color: "#ff5252" }}
                                            onClick={() =>
                                                this.props.deleteSweetProgram(
                                                    value.id,
                                                    value.state
                                                )
                                            }
                                        />
                                    </OverlayTrigger>
                                </>
                            ) : (
                                "No def."
                            );
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
                    r.denomination || null,
                    r.Academic_degree || null,
                    r.Organic_unit_register.denomination,
                    r.Organic_unit_origin.denomination,
                    r.Organic_unit_register.Campu.denomination,
                    r.state,
                    r,
                ]);
            });
        }

        return (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE PROGRAMAS"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

export default DataTable;
