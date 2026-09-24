import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Send from "@material-ui/icons/Send";

import {
    Button,
    Col,
    Dropdown,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import component from "../../../../Component";

import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../../Constants";
import axios from "axios";
import GetApp from "@material-ui/icons/GetApp";
import moment from "moment";
import Refresh from "@material-ui/icons/Refresh";

class Index extends Component {
    state = {
        modal: false,
        process: "",
        processs: [],
    };

    componentDidMount() {}

    async reportAcademicRecord(id_student) {
        this.setState({ registrationDataLoader: true });
        const url = app.general + "/report-academic-record/" + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) component.pdfReportAutoTableRercordAcademic(res.data);

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });

    downloadPdf = (id_student) => {
        this.reportAcademicRecord(id_student);
    };

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
            rowsPerPageOptions: [10, 30, 50, 100, 500],
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
            onDownload: (buildHead, buildBody, columns, data) => {
                component.pdfReportAutoTablePaymentPendient(
                    "REPORTE DE DOCUMENTOS PENDIENTES",

                    columns,
                    data
                );
                return false;
            },
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger overlay={<Tooltip>Recargar</Tooltip>}>
                            <button
                                onClick={() => this.props.callData()}
                                type="button"
                                className="btn-icon btn btn-light"
                            >
                                <Refresh />
                            </button>
                        </OverlayTrigger>
                    </>
                );
            },
        };

        const columns = [
            {
                name: "ACCIONES ",
                options: {
                    filter: false,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {
                        render: (v) => `ACCIONES  : ${v}`,
                    },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return (
                                <>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>DESCARGAR RECORD</Tooltip>
                                        }
                                    >
                                        <GetApp
                                            style={{ color: "#fbb901" }}
                                            onClick={() =>
                                                this.downloadPdf(
                                                    value.id_student
                                                )
                                            }
                                        />
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>
                                                GENERAR CORRELATIVO
                                            </Tooltip>
                                        }
                                    >
                                        <Send
                                            style={{ color: "#4680ff" }}
                                            onClick={() =>
                                                this.props.createDocument(
                                                    value.id
                                                )
                                            }
                                        />
                                    </OverlayTrigger>
                                </>
                            );
                        }
                    },
                },
            },
            {
                name: "DOCUMENTO",
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
                name: "ESTUDIANTE",
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
                name: "U.ORGANICA",
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
                name: "FECHA",
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
        ];

        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                return data.push([
                    r,
                    r.denomination,
                    r.Student.Person.name +
                        " / " +
                        r.Student.Person.document_number,
                    r.Program.description,
                    moment(r.created_at).format("YYYY-MM-DD h:mm:ss"),
                ]);
            });
        }

        return (
            <>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={"LISTADO DE PENDIENTES"}
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </>
        );
    }
}

export default Index;
