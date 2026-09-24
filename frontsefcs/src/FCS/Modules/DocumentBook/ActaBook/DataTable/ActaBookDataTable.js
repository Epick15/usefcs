import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
    Button,
    Col,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import component from "../../../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../../Constants";
import Close from "@material-ui/icons/Close";
import axios from "axios";
import GetApp from "@material-ui/icons/GetApp";
import Refresh from "@material-ui/icons/Refresh";

// MPT
import Acta from "../../../../Component/DocumentFormats/Acta";

class Index extends Component {
    state = {
        modal: false,
        loaderDocumentBook: false,
        process: "",
        correlative: "",
        observation: "",
        records: [],
        processs: [],
    };

    componentDidMount() {
        this.listAcademicSemesterAndAcademicCalendar();
    }

    async listActatBook(process) {
        this.setState({ actaBookLoader: true });
        const url = app.programs + "/" + app.actaBook + "/" + process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ records: res.data });
            }

            this.setState({ actaBookLoader: false });
        } catch (err) {
            this.setState({ actaBookLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listAcademicSemesterAndAcademicCalendar() {
        this.setState({ calendarLoader: true });
        const url =
            app.general +
            "/" +
            app.academicSemester +
            "/" +
            app.academicCalendar +
            "/all";

        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    processs: res.data,
                    process: res.data[0].id,
                });
            this.listActatBook(res.data[0].id);

            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes de estudio",
                delay: 2000,
            });
            console.log(err);
        }
    }

    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });

    // downloadPdf = (id_student, id_document_book) => {
    //     this.reportCertyStudy(id_student, id_document_book)
    //
    // }

    closeData = () => {
        this.setState({
            modal: false,
            documentBookID: "",
            correlative: "",
            observation: "",
        });
    };

    async reportActa(id_acta_book) {

        this.setState({registrationDataLoader: true});
        const url = app.general + '/report-acta/' + id_acta_book;
        try {

            const res = await axios.get(url, app.headers);
            if (res.data) {
                component.pdfReportAutoTableActa(res.data)
            }

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)

        }

    }

    // async reportActa(id_acta_book) {
    //     const url = app.general + "/report-acta/" + id_acta_book;
    //     try {
    //         const res = await axios.get(url, app.headers);
    //         console.log(res.data);
    //         this.setState({ dataActa: res.data });
    //     } catch (err) {
    //         PNotify.error({
    //             title: "Oh no!",
    //             text: "Algo salio mal al cargar los datos",
    //             delay: 2000,
    //         });
    //         console.log(err);
    //     }
    // }

    handleChange = (field) => (event) => {
        switch (field) {
            case "process":
                this.setState({ process: event.target.value });
                this.listActatBook(event.target.value);
                break;
            case "correlative":
                this.setState({
                    correlative: event.target.value.replace(/^(0+)/g, ""),
                });
                break;
            case "observation":
                this.setState({ observation: event.target.value });
                break;
            default:
                break;
        }
    };
    callData = () => {
        this.listActatBook(this.state.process);
    };

    render() {
        const { records } = this.state;

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
            onDownload: (buildHead, buildBody, columns, data) => {
                component.pdfReportAutoTablePaymentPendient(
                    "REPORTE DE PAGOS PENDIENTES",

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
                                onClick={() => this.callData()}
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
                name: "CORRELATIVO",
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
                name: "TIPO",
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
                name: "PROGRAMA",
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
                name: "DOCENTE",
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
                name: "CURSO",
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
                                    {/*<OverlayTrigger*/}
                                    {/*    overlay={<Tooltip>EDITAR</Tooltip>}>*/}
                                    {/*    <Edit style={{color: "#1d86e0"}}*/}
                                    {/*          onClick={() => this.retriveData(value)}*/}
                                    {/*    />*/}
                                    {/*</OverlayTrigger>*/}
                                    {/* <OverlayTrigger
                                        overlay={<Tooltip>DESCARGAR</Tooltip>}
                                    > */}
                                    <GetApp
                                        style={{ color: "#101b33" }}
                                        onClick={() =>
                                            this.reportActa(value.id)
                                        }
                                    />
                                    {/* </OverlayTrigger> */}
                                </>
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
                    r.correlative,
                    r.type,
                    r.Program.description,
                    r.Teacher.Person.name +
                        " / " +
                        r.Teacher.Person.document_number,
                    r.Schedule.Course.denomination,
                    r,
                ]);
            });
        }
        const { correlative, observation, process, processs } = this.state;
        return (
            <>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title={
                                    <Row>
                                        <Col
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                        >
                                            <Form.Group className="form-group fill">
                                                {/*{this.state.calendarLoader ?*/}
                                                {/*<span className="spinner-border spinner-border-sm mr-1" role="status"/>*/}
                                                <Form.Control
                                                    as="select"
                                                    value={process}
                                                    onChange={this.handleChange(
                                                        "process"
                                                    )}
                                                >
                                                    <option
                                                        defaultValue={true}
                                                        hidden
                                                    >
                                                        Proceso
                                                    </option>
                                                    {processs.length > 0 ? (
                                                        processs.map(
                                                            (r, index) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            r.id
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        id={
                                                                            "process-" +
                                                                            r.id
                                                                        }
                                                                        mask-calendar={r.Academic_calendar.denomination.substr(
                                                                            -4
                                                                        )}
                                                                        mask-process={r.denomination.substr(
                                                                            -1
                                                                        )}
                                                                    >
                                                                        {r.Academic_calendar.denomination.substr(
                                                                            -4
                                                                        ) +
                                                                            "-" +
                                                                            r.denomination.substr(
                                                                                -2
                                                                            )}
                                                                    </option>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <option
                                                            defaultValue={true}
                                                        >
                                                            Error al cargar los
                                                            Datos
                                                        </option>
                                                    )}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                }
                                data={data}
                                columns={columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </Col>
                </Row>
                <Modal show={this.state.modal} backdrop="static">
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                            ACTUALIZAR DATOS
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{ zIndex: 100000000 }}>
                                        Cerrar
                                    </Tooltip>
                                }
                            >
                                <Close
                                    style={{ color: "white" }}
                                    onClick={() => this.closeData()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        // style={ambient === "" ? {color: "#ff5252 "} : null}
                                    >
                                        Correlativo
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        value={correlative}
                                        minlength="1"
                                        maxlength="4"
                                        onChange={this.handleChange(
                                            "correlative"
                                        )}
                                        placeholder="correlative"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        // style={ambient === "" ? {color: "#ff5252 "} : null}
                                    >
                                        Observaciones
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={observation}
                                        onChange={this.handleChange(
                                            "observation"
                                        )}
                                        placeholder="observation"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button
                                    className="pull-right"
                                    disabled={this.state.loaderDocumentBook}
                                    variant="primary"
                                    onClick={() => this.updateDocumentBook()}
                                >
                                    Guardar Cambios
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>

                {/* MPT */}
                {/* {this.state.dataActa && <Acta dataActa={this.state.dataActa} />} */}
            </>
        );
    }
}

export default Index;
