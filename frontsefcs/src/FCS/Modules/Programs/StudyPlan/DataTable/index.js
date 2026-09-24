import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
// import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";

import Bookmark from "@material-ui/icons/Bookmark";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import component from "../../../../Component";

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
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button
                                onClick={() => this.props.openModalPlan()}
                                type="button"
                                className="btn-icon btn btn-primary"
                            >
                                <i className="feather icon-plus"></i>
                            </button>
                        </OverlayTrigger>
                    </>
                );
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
                name: "DESCRIPCIÓN",
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
                name: "CREDITOS OBLIGATORIOS",
                options: {
                    filter: true,
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
                name: "¿MALLA CORRECTA?",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? "Si" : "No";
                        }
                    },
                },
            },

            {
                name: "ACTUAL",
                options: {
                    filter: true,
                    sort: true,
                    // customBodyRender: (value, tableMeta, updateValue) => {
                    //
                    //     if (value === undefined) {
                    //         return "No def.";
                    //     } else {
                    //
                    //         return value ? <span className="badge badge-info inline-block">HABILITADO</span> :
                    //             <span className="badge badge-warning inline-block">INHABILITADO</span>
                    //     }
                    // },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? (
                                <div
                                    className="custom-control custom-switch"
                                    onClick={() =>
                                        this.props.actualPlan(value.id)
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={value.id}
                                        readOnly
                                        checked={value.valid}
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor={value.id}
                                    />
                                    <span className="custom-control-label">
                                        Si
                                    </span>
                                </div>
                            ) : (
                                "No def."
                            );
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
                            if (value === "") {
                                return "No def.";
                            } else {
                                return (
                                    <>
                                        <OverlayTrigger
                                            overlay={<Tooltip>CURSOS</Tooltip>}
                                        >
                                            <Bookmark
                                                type="button"
                                                className="text-dark"
                                                onClick={() =>
                                                    this.props.openFormCourse(
                                                        value
                                                    )
                                                }
                                            />
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            overlay={<Tooltip>EDITAR</Tooltip>}
                                        >
                                            <Edit
                                                type="button"
                                                style={{ color: "#1d86e0" }}
                                                onClick={() =>
                                                    this.props.retrivePlan(
                                                        value
                                                    )
                                                }
                                            />
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            overlay={<Tooltip>ANULAR</Tooltip>}
                                        >
                                            <Delete
                                                type="button"
                                                style={{ color: "#ff5252" }}
                                                onClick={() =>
                                                    this.props.deleteSweetPlan(
                                                        value.id,
                                                        value.state
                                                    )
                                                }
                                            />
                                        </OverlayTrigger>
                                    </>
                                );
                            }
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
                    r.description,
                    r.credit_required,
                    r.mesh,
                    r,
                    r,
                ]);
            });
        }

        return (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE PLANES DE ESTUDIO"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

export default DataTable;
