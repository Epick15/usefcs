import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Send from "@material-ui/icons/Send";
import Event from "@material-ui/icons/Event";
import Close from "@material-ui/icons/Close";

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
        modalAcademicRecordEmission: false,
        loaderAcademicRecordEmission: false,
        paymentID: "",
        recordPaymentID: "",
        academicRecordEmissionDate: "",
        academicRecordEmissionReason: "",
        process: "",
        processs: [],
    };

    componentDidMount() {}

    async reportAcademicRecord(id_student, id_payment) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-academic-record/" +
            id_student +
            "?id_payment=" +
            id_payment;
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

    downloadPdf = (id_student, id_payment) => {
        this.reportAcademicRecord(id_student, id_payment);
    };
    openAcademicRecordEmission = async (payment) => {
        this.setState({
            modalAcademicRecordEmission: true,
            paymentID: payment.id,
            loaderAcademicRecordEmission: true,
        });
        try {
            const url =
                app.accounting +
                "/" +
                app.payment +
                "/student/" +
                payment.id_student +
                "/academic-record-emission";
            const res = await axios.get(url, app.headers);
            this.setState({
                loaderAcademicRecordEmission: false,
                recordPaymentID: res.data.id_payment,
                academicRecordEmissionDate: res.data.academic_record_emission_date
                    ? moment(res.data.academic_record_emission_date).format("YYYY-MM-DD")
                    : "",
                academicRecordEmissionReason:
                    res.data.academic_record_emission_reason || "",
            });
        } catch (err) {
            this.setState({loaderAcademicRecordEmission: false});
            PNotify.error({
                title: "Oh no!",
                text: err.response && err.response.data.message,
                delay: 2000,
            });
        }
    };
    closeAcademicRecordEmission = () => {
        this.setState({
            modalAcademicRecordEmission: false,
            paymentID: "",
            recordPaymentID: "",
            academicRecordEmissionDate: "",
            academicRecordEmissionReason: "",
        });
    };
    async updateAcademicRecordEmission() {
        const {
            recordPaymentID,
            academicRecordEmissionDate,
            academicRecordEmissionReason,
        } = this.state;
        if (!academicRecordEmissionDate || !academicRecordEmissionReason.trim()) {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete la fecha de emisión y el motivo",
                delay: 2000,
            });
            return;
        }

        this.setState({loaderAcademicRecordEmission: true});
        const url =
            app.accounting +
            "/" +
            app.payment +
            "/" +
            recordPaymentID +
            "/academic-record-emission";
        const data = new FormData();
        data.set("academic_record_emission_date", academicRecordEmissionDate);
        data.set("academic_record_emission_reason", academicRecordEmissionReason.trim());

        try {
            const res = await axios.patch(url, data, app.headers);
            this.setState({loaderAcademicRecordEmission: false});
            this.props.callData();
            this.closeAcademicRecordEmission();
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
        } catch (err) {
            this.setState({loaderAcademicRecordEmission: false});
            PNotify.error({
                title: "Oh no!",
                text: err.response && err.response.data.message,
                delay: 2000,
            });
        }
    }
    handleEmissionChange = (field) => (event) => {
        this.setState({[field]: event.target.value});
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
                                                    value.id_student,
                                                    value.id
                                                )
                                            }
                                        />
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>
                                                FECHA DE EMISIÓN DE RÉCORD ACADÉMICO
                                            </Tooltip>
                                        }
                                    >
                                        <Event
                                            style={{color: "#6f42c1"}}
                                            onClick={() =>
                                                this.openAcademicRecordEmission(value)
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
                <Modal
                    show={this.state.modalAcademicRecordEmission}
                    backdrop="static"
                >
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{color: "#ffffff"}}>
                            FECHA DE EMISIÓN DE RÉCORD ACADÉMICO
                        </Modal.Title>
                        <Close
                            style={{color: "white", marginLeft: "auto"}}
                            onClick={() => this.closeAcademicRecordEmission()}
                        />
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label>Fecha de emisión <small className="text-danger">*</small></Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={this.state.academicRecordEmissionDate}
                                        onChange={this.handleEmissionChange("academicRecordEmissionDate")}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label>Motivo del cambio <small className="text-danger">*</small></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows="3"
                                        value={this.state.academicRecordEmissionReason}
                                        onChange={this.handleEmissionChange("academicRecordEmissionReason")}
                                        placeholder="Indique el motivo de la fecha manual"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Button
                                    className="pull-right"
                                    disabled={this.state.loaderAcademicRecordEmission}
                                    variant="primary"
                                    onClick={() => this.updateAcademicRecordEmission()}
                                >
                                    Guardar fecha
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Index;
