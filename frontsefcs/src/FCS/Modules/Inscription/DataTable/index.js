import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Unarchive from "@material-ui/icons/Unarchive";
import Fingerprint from "@material-ui/icons/Fingerprint";
import LocalOffer from "@material-ui/icons/LocalOffer";

// MPT
import SwapHoriz from "@material-ui/icons/SwapHoriz";
// MPT

import RestoreFromTrash from "@material-ui/icons/RestoreFromTrash";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import component from "../../../Component";

import { Link } from "react-router-dom";

import app from "../../../Constants";
import defaultPhoto from "../../../../assets/images/user/default.jpg";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

class Index extends Component {
    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });

    async createUserIntranet(id, type) {
        document.getElementById("generate-" + id).style.display = "none";
        document.getElementById("spin-" + id).style.visibility = "visible";
        if (id !== "" && type !== "") {
            const url = app.intranet + "/" + app.userIntranet;
            let data = new FormData();
            data.set("id_person", id);
            data.set("type", type);
            try {
                const res = await axios.post(url, data, app.headers);
                document.getElementById("generate-" + id).style.display = "";
                document.getElementById("spin-" + id).style.visibility =
                    "hidden";
                if (res.data.mail_sent === false) {
                    PNotify.notice({
                        title: "Acceso creado",
                        text: res.data.message,
                        delay: 4000,
                    });
                } else {
                    PNotify.success({
                        title: "Finalizado",
                        text: res.data.message,
                        delay: 2000,
                    });
                }
            } catch (err) {
                document.getElementById("generate-" + id).style.display = "";
                document.getElementById("spin-" + id).style.visibility =
                    "hidden";
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            document.getElementById("generate-" + id).style.display = "";
            document.getElementById("spin-" + id).style.visibility = "hidden";
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    render() {
        const { records } = this.props;
        const options = {
            filter: true,
            searchOpen: false,
            print: false,
            responsive: "simple",
            searchPlaceholder: "Buscar",
            search: true,
            rowsPerPage: 100,
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
                        {this.props.activate && (
                            <OverlayTrigger overlay={<Tooltip>Nuevo</Tooltip>}>
                                <button
                                    onClick={() => this.props.openForm()}
                                    type="button"
                                    className="btn-icon btn btn-primary"
                                >
                                    <i className="feather icon-plus"></i>
                                </button>
                            </OverlayTrigger>
                        )}
                    </>
                );
            },
            onDownload: (buildHead, buildBody, columns, data) => {
                component.pdfReportAutoTableThreeTitle(
                    "REPORTE DE INGRESO DE ESTUDIANTES",
                    this.props.programMask,
                    this.props.organicMask,
                    this.props.studyPlanMask,
                    this.props.admissionPlanMask,

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
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return value;
                    },
                },
            },
            {
                name: "FOTO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return (
                                <img
                                    src={
                                        value
                                            ? app.server +
                                              app.personPhotography +
                                              value
                                            : defaultPhoto
                                    }
                                    alt="user"
                                    className="img-radius wid-30  m-r-15"
                                />
                            );
                        }
                    },
                },
            },
            {
                name: "NOMBRE",
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
                name: "DNI",
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
                name: "EMAIL",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `EMAIL: ${v}` },
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
                name: "MODALIDAD",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `MODALIDAD: ${v}`,
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
                name: "ESTADO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `FECHA FIN: ${v}`,
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
                            if (value) {
                                return value.state ? (
                                    <>
                                        <span
                                            id={"spin-" + value.Person.id}
                                            style={{ visibility: "hidden" }}
                                            className="spinner-border spinner-border-sm mr-1"
                                            role="status"
                                        />
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip>
                                                    GENERAR ACCESO
                                                </Tooltip>
                                            }
                                        >
                                            <Fingerprint
                                                className={"text-info"}
                                                id={
                                                    "generate-" +
                                                    value.Person.id
                                                }
                                                onClick={() =>
                                                    this.createUserIntranet(
                                                        value.Person.id,
                                                        "Estudiante"
                                                    )
                                                }
                                            />
                                        </OverlayTrigger>
                                        {this.props.activate && (
                                            <>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            ACREDITACIÓN
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Link
                                                        to={
                                                            "/inscription/student/" +
                                                            btoa(value.id) +
                                                            "/accreditation"
                                                        }
                                                    >
                                                        <Unarchive
                                                            className={
                                                                "text-warning"
                                                            }
                                                        />
                                                    </Link>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            DESCUENTOS
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Link
                                                        to={
                                                            "/inscription/student/" +
                                                            btoa(value.id) +
                                                            "/discount"
                                                        }
                                                    >
                                                        <LocalOffer
                                                            className={
                                                                "text-purple"
                                                            }
                                                        />
                                                    </Link>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            EDITAR
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Edit
                                                        style={{
                                                            color: "#1d86e0",
                                                        }}
                                                        onClick={() =>
                                                            this.props.retriveStudent(
                                                                value
                                                            )
                                                        }
                                                    />
                                                </OverlayTrigger>
                                                {/* MPT */}
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            CAMBIAR ESPECIALIDAD
                                                        </Tooltip>
                                                    }
                                                >
                                                    <SwapHoriz
                                                        style={{
                                                            color: "#1d8615",
                                                        }}
                                                        onClick={() =>
                                                            this.props.openFormChangeProgram(
                                                                value
                                                            )
                                                        }
                                                    />
                                                </OverlayTrigger>
                                                {/* MPT END */}
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            ELIMINAR
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Delete
                                                        style={{
                                                            color: "#ff5252",
                                                        }}
                                                        onClick={() =>
                                                            this.props.deleteStudentsweet(
                                                                value.id
                                                            )
                                                        }
                                                    />
                                                </OverlayTrigger>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    "No def."
                                );
                            } else {
                                return value.state ? (
                                    <OverlayTrigger
                                        overlay={<Tooltip>HABILITAR</Tooltip>}
                                    >
                                        <RestoreFromTrash
                                            style={{
                                                color: "#81c334",
                                                fontSize: "28px",
                                            }}
                                            onClick={() =>
                                                this.props.deleteContractSweet({
                                                    id: value.id,
                                                    state: value.state,
                                                })
                                            }
                                        />
                                    </OverlayTrigger>
                                ) : (
                                    "No def."
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
                    r.Person.photo,
                    r.Person.name,
                    r.Person.document_number,
                    r.Person.email,
                    r.Cost_admission_plan.Concept.denomination,

                    r.type,
                    r,
                ]);
            });
        }

        return (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE ESTUDIANTES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

export default Index;
