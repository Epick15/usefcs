import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
    Button,
    Col,
    Alert,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import component from "../../../Component";
import Delete from "@material-ui/icons/Delete";
import GetApp from "@material-ui/icons/GetApp";
import Edit from "@material-ui/icons/Edit";
import app from "../../../Constants";
import axios from "axios";
import moment from "moment";
import crypt from "node-cryptex";

class DataTable extends Component {
    state = {
        showModal: false,
        registrationCurses: [],
    };
    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });
    downloadFicha = (records) => {
        console.log({records1: records, records2: records });
        component.pdfReportAutoTableFichaRegistration(
            records.Academic_semester.Academic_calendar.denomination +
                " - " +
                records.Academic_semester.denomination,
            this.props.titleProgram.toUpperCase(),
            this.props.titleModule.toUpperCase(),
            this.props.unitRegistration.toUpperCase(),
            this.props.sedeRegistration.toUpperCase(),
            records.Registration_course,
            records.created_at,
            this.props.personData,
            this.props.admissionPlan,
            records.selected_date,
            // this.props.idProgram,
            // this.props.codePlan,
        );
    };

    async listRegistrationCourseByRegistration(id_registration) {
        // this.setState({registrationDataLoader: true});
        const url =
            app.registration +
            "/registration-course/registration/" +
            id_registration;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({ registrationCurses: res.data });

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            // PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err);
        }
    }

    openModal = (id_registration) => {
        this.listRegistrationCourseByRegistration(id_registration);
        this.setState({ showModal: !this.state.showModal });
    };
    closeModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };
    updateStateRegistrationCourse = (i, dato) => {
        let array = this.state.registrationCurses;

        array[i].state = dato.target.value;
        this.setState({ registrationCurses: array });
    };

    async updateStateRegistration() {
        try {
            const url =
                app.registration +
                "/" +
                app.registrations +
                "/update-state/" +
                this.state.registrationCurses[0].id_registration;
            let data = new FormData();
            data.set(
                "registrationCurses",
                JSON.stringify(this.state.registrationCurses)
            );
            const res = await axios.patch(url, data, app.headers);
            if (res) {
                this.props.callData();
                this.setState({ showModal: false });
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { showModal } = this.state;
        const { records } = this.props;
        const title =
            records.Payment.Concept.denomination.toUpperCase() +
            " - " +
            records.type.toUpperCase() +
            " / " +
            records.Academic_semester.Academic_calendar.denomination +
            " - " +
            records.Academic_semester.denomination +
            " - " +
            records.state;
        const titleNode = (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ color: "#203047", fontSize: "16px", fontWeight: 700 }}>
                    {records.Payment.Concept.denomination.toUpperCase()} - {records.type.toUpperCase()}
                </span>
                <span style={{ color: "#687789", fontSize: "13px", fontWeight: 600 }}>
                    {records.Academic_semester.Academic_calendar.denomination} - {records.Academic_semester.denomination}
                </span>
                <span
                    className={
                        "badge inline-block " +
                        (records.state === "Pagado" ? "badge-success" : "badge-warning")
                    }
                    style={{ fontSize: "11px", padding: "5px 8px" }}
                >
                    {records.state}
                </span>
            </div>
        );
        const { optionEdit } = this.props;
        const modalHeaderStyle = {
            background: "#2f7be8",
            minHeight: "60px",
            alignItems: "center",
        };
        const modalBodyStyle = {
            background: "#f4f7fb",
            padding: "20px",
        };
        const controlStyle = {
            height: "38px",
            borderColor: "#cfd6df",
            borderRadius: "6px",
            boxShadow: "none",
            fontSize: "13px",
        };

        const options = {
            filter: false,
            print: false,
            searchOpen: false,
            responsive: "simple",
            searchPlaceholder: "Buscar",
            download: false,
            search: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                if (optionEdit) {
                    return (
                        <>
                            <OverlayTrigger
                                overlay={<Tooltip>DESCARGAR FICHA</Tooltip>}
                            >
                                <button
                                    onClick={() => this.downloadFicha(records)}
                                    type="button"
                                    style={{
                                        backgroundColor: "white",
                                        borderColor: "white",
                                    }}
                                    className="btn-icon btn btn-dark"
                                >
                                    <GetApp style={{ color: "#4680ff" }} />
                                </button>
                            </OverlayTrigger>
                            {this.props.activate !== 0 && (
                                <>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>
                                                Editar estado curso
                                            </Tooltip>
                                        }
                                    >
                                        <button
                                            onClick={() =>
                                                this.openModal(records.id)
                                            }
                                            type="button"
                                            style={{
                                                backgroundColor: "white",
                                                borderColor: "white",
                                            }}
                                            className="btn-icon btn btn-dark"
                                        >
                                            <Edit
                                                style={{ color: "#bf009c" }}
                                            />
                                        </button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>Eliminar</Tooltip>}
                                    >
                                        <button
                                            onClick={() =>
                                                this.props.deleteSweetRegistration(
                                                    records.id
                                                )
                                            }
                                            type="button"
                                            style={{
                                                backgroundColor: "white",
                                                borderColor: "white",
                                            }}
                                            className="btn-icon btn btn-dark"
                                        >
                                            <Delete
                                                style={{ color: "#ff5252" }}
                                            />
                                        </button>
                                    </OverlayTrigger>
                                </>
                            )}
                        </>
                    );
                } else {
                    return (
                        <OverlayTrigger
                            overlay={<Tooltip>DESCARGAR FICHA</Tooltip>}
                        >
                            <button
                                onClick={() => this.downloadFicha(records)}
                                type="button"
                                style={{
                                    backgroundColor: "white",
                                    borderColor: "white",
                                }}
                                className="btn-icon btn btn-dark"
                            >
                                <GetApp style={{ color: "#4680ff" }} />
                            </button>
                        </OverlayTrigger>
                    );
                }
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
                name: "CURSO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: { render: (v) => `CURSO: ${v}` },
                    setCellProps: () => ({
                        style: { minWidth: "600px", maxWidth: "600px" },
                    }),
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
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `TIPO: ${v}` },
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
                name: "CICLO",
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
                name: "CREDITOS",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `CODIGO: ${v}` },
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
                name: "NOTA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `NOTA: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value;
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
                            let state =
                                value === "Aprobado"
                                    ? "badge-info"
                                    : value === "Desaprobado"
                                    ? "badge-danger"
                                    : "badge-warning";

                            return value ? (
                                <span
                                    className={"badge  inline-block " + state}
                                >
                                    {value}
                                </span>
                            ) : (
                                "No def."
                            );
                        }
                    },
                },
            },
        ];
        let data = [];

        if (records.Registration_course.length > 0) {
            records.Registration_course.map((r, index) => {
                return data.push([
                    r.order,
                    r.denomination,
                    r.type_registration_course,
                    r.ciclo,
                    r.credits,
                    r.note,
                    r.state_registration_course,
                ]);
            });
        }

        return (
            <>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <div
                        style={{
                            marginBottom: "16px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            boxShadow: "0 8px 22px rgba(20, 34, 55, 0.1)",
                        }}
                    >
                        <MUIDataTable
                            title={titleNode || title}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                    </div>
                </MuiThemeProvider>

                <Modal
                    show={showModal}
                    onHide={() => this.closeModal()}
                    size="lg"
                >
                    <Modal.Header style={modalHeaderStyle}>
                        <Modal.Title as="h5" style={{ color: "white" }}>
                            RETIRAR ESTUDIANTE DEL CURSO
                        </Modal.Title>
                        <i
                            onClick={() => this.closeModal()}
                            className="material-icons pull-right mr-n2 mt-n1"
                            style={{ color: "white" }}
                        >
                            close
                        </i>
                    </Modal.Header>
                    <Modal.Body style={modalBodyStyle}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Alert
                                    variant={"success"}
                                    style={{
                                        border: "0",
                                        borderRadius: "8px",
                                        color: "#285b45",
                                        background: "#dff3e8",
                                    }}
                                >
                                    Cuando el estudiante solicita retirarse de
                                    uno o mas cursos despues de iniciado el
                                    semestre, registre aqui el estado para que
                                    no figure como desaprobado.
                                </Alert>
                            </Col>
                            <Table
                                size="sm"
                                hover
                                responsive
                                style={{
                                    width: "100%",
                                    background: "#ffffff",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <tbody>
                                    {this.state.registrationCurses.length > 0 &&
                                        this.state.registrationCurses.map(
                                            (r, j) => {
                                                return (
                                                    <tr
                                                        className="d-flex"
                                                        key={j}
                                                        style={{
                                                            height: "45px",
                                                        }}
                                                    >
                                                        <td className="col-8">
                                                            <p
                                                                style={{
                                                                    marginBottom:
                                                                        0,
                                                                    color:
                                                                        "#27364a",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {
                                                                    r.Course
                                                                        .denomination
                                                                }
                                                            </p>
                                                        </td>
                                                        <td
                                                            className="col-4"
                                                            style={{
                                                                paddingTop:
                                                                    "0.1em",
                                                            }}
                                                        >
                                                            <Form.Group className="form-group fill">
                                                                <Form.Control
                                                                    as="select"
                                                                    style={
                                                                        controlStyle
                                                                    }
                                                                    disabled={
                                                                        r.state ==
                                                                        "Aprobado"
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    value={
                                                                        r.state
                                                                    }
                                                                    onChange={this.updateStateRegistrationCourse.bind(
                                                                        this,
                                                                        j
                                                                    )}
                                                                >
                                                                    <option
                                                                        value="Aprobado"
                                                                        hidden
                                                                    >
                                                                        Aprobado
                                                                    </option>
                                                                    <option
                                                                        value="Desaprobado"
                                                                        hidden
                                                                    >
                                                                        Desaprobado
                                                                    </option>
                                                                    <option value="Retirado">
                                                                        Retirado
                                                                    </option>
                                                                </Form.Control>
                                                            </Form.Group>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                </tbody>
                            </Table>

                            <Col
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginTop: "8px",
                                }}
                            >
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        this.updateStateRegistration()
                                    }
                                >
                                    Guardar
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default DataTable;
