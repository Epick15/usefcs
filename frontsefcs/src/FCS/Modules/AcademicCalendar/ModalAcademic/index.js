import React, { Component } from "react";
import {
    Button,
    Col,
    Dropdown,
    Form,
    Modal,
    Row,
    Table,
} from "react-bootstrap";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";

import crypt from "node-cryptex";

import "moment/locale/es";

const k = new Buffer(32);
const v = new Buffer(16);

export default class ModalAcademic extends Component {
    state = {
        // startDate: moment().format('l'),
        // startDate: new Date(),
        /////////STATE FORM////////////
        organicUnit: this.props.organicUnit,
        modalAcademicCalendar: false,
        academicCalendars: [],
        semesters: [],
        denomination: "",
        date_start: "",
        date_end: "",
        check: false,
        ////////////

        disabled: false,
        action: "add",
        currentID: "",
        title: "",
        mentionModal: false,
        mentions: [],
    };

    componentDidMount() {
        this.getSemester();
    }

    listAcademicCalendarAll() {
        const url = app.general + "/" + app.academicCalendar + "/all";
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    this.setState({ academicCalendars: res.data });
                }
            })
            .catch((err) => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Error al cargar calendario",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    getSemester() {
        const url = app.general + "/" + app.semester;
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    let array = res.data;
                    for (let k = 0; k < array.length; k++) {
                        array[k].state = false;
                    }

                    this.setState({
                        semesters: array,
                    });
                }
            })
            .catch((err) => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Error al cargar semestres",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    saveAcademicCalendar() {
        this.setState({ disabled: true });
        const url = app.general + "/" + app.academicCalendar;
        const {
            denomination,
            date_start,
            date_end,
            check,
            semesters,
            organicUnit,
        } = this.state;
        if (
            denomination !== "" &&
            date_start !== "" &&
            date_end !== "" &&
            organicUnit !== ""
        ) {
            let data = new FormData();
            data.set("denomination", denomination.trim());
            data.set("date_start", moment(date_start).format("YYYY-MM-DD"));
            data.set("date_end", moment(date_end).format("YYYY-MM-DD"));
            data.set("state", check);
            data.set("id_unit_organic", organicUnit);
            data.set(
                "semesters",
                crypt.encrypt(JSON.stringify(semesters), k, v)
            );

            axios
                .post(url, data, app.headers)
                .then(() => {
                    this.setState({ disabled: false });
                    this.listAcademicCalendarAll();
                    this.props.listAcademicCalendarActual();
                    this.handleResetModal();
                    PNotify.success({
                        title: "Finalizado",
                        text: "Registro almacenado correctamente",
                        delay: 2000,
                    });
                })
                .catch((err) => {
                    this.setState({ disabled: false });
                    PNotify.error({
                        title: "Oh no!",
                        text: "Ha ocurrido un error",
                        delay: 2000,
                    });
                    console.log(err);
                });
        } else {
            this.setState({ disabled: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    updateAcademicCalendar() {
        this.setState({ disabled: true });
        const url =
            app.general +
            "/" +
            app.academicCalendar +
            "/" +
            this.state.currentID;
        const {
            denomination,
            date_start,
            date_end,
            check,
            semesters,
            organicUnit,
        } = this.state;
        if (
            denomination !== "" &&
            date_start !== "" &&
            date_end !== "" &&
            organicUnit !== ""
        ) {
            let data = new FormData();
            data.set("denomination", denomination.trim());
            data.set("date_start", moment(date_start).format("YYYY-MM-DD"));
            data.set("date_end", moment(date_end).format("YYYY-MM-DD"));
            data.set("state", check);
            data.set("id_unit_organic", organicUnit);
            data.set(
                "semesters",
                crypt.encrypt(JSON.stringify(semesters), k, v)
            );

            axios
                .patch(url, data, app.headers)
                .then(() => {
                    this.setState({ disabled: false });
                    this.listAcademicCalendarAll();
                    this.props.listAcademicCalendarActual();
                    this.handleResetModal();
                    PNotify.success({
                        title: "Finalizado",
                        text: "Registro almacenado correctamente",
                        delay: 2000,
                    });
                })
                .catch((err) => {
                    this.setState({ disabled: false });
                    PNotify.error({
                        title: "Oh no!",
                        text: "Ha ocurrido un error",
                        delay: 2000,
                    });
                    console.log(err);
                });
        } else {
            this.setState({ disabled: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    deleteAcademicCalendar() {
        if (!this.state.currentID) {
            PNotify.notice({
                title: "Advertencia!",
                text: "Seleccione un calendario para eliminar",
                delay: 2000,
            });
            return;
        }

        const confirmDelete = window.confirm(
            "Se eliminara el calendario seleccionado. Esta accion no se puede deshacer. Desea continuar?"
        );

        if (!confirmDelete) return;

        this.setState({ disabled: true });
        const url =
            app.general +
            "/" +
            app.academicCalendar +
            "/" +
            this.state.currentID;

        axios
            .delete(url, app.headers)
            .then(() => {
                this.setState({ disabled: false });
                this.listAcademicCalendarAll();
                this.props.listAcademicCalendarActual();
                this.handleResetModal();
                PNotify.success({
                    title: "Finalizado",
                    text: "Calendario eliminado correctamente",
                    delay: 2000,
                });
            })
            .catch((err) => {
                this.setState({ disabled: false });
                PNotify.error({
                    title: "Oh no!",
                    text: "No se pudo eliminar el calendario",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    //Operation Functions
    handleOpenModalAcademicCalendar = () => {
        this.listAcademicCalendarAll();
        this.setState({
            modalAcademicCalendar: true,
        });
    };

    updateStateSemester = (position) => {
        let array = this.state.semesters;
        for (let i = 0; i < array.length; i++) {
            if (i === position) {
                array[i].state = !array[i].state;
            }
        }
        this.setState({ semesters: array });
    };
    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (this.state.action === "add") {
                this.saveMention();
            } else {
                this.updateMention();
            }
        }
    };
    handleChange = (field) => (event) => {
        switch (field) {
            case "denomination":
                this.setState({
                    denomination: event.target.value.replace(
                        /[^A-Za-záéíóúüÁÉÍÓÚÜ/0-9 ]/g,
                        ""
                    ),
                });
                break;
            case "date_start":
                this.setState({ date_start: event.target.value });
                break;
            case "date_end":
                this.setState({ date_end: event.target.value });
                break;
            case "check":
                this.setState({ check: !this.state.check });
                break;
            default:
                break;
        }
    };
    handleRetriveData = (r) => {
        let array = this.state.semesters;

        for (let k = 0; k < array.length; k++) {
            if (r.Academic_semesters && r.Academic_semesters[k]) {
                array[k].state = r.Academic_semesters[k].state;
            }
        }
        this.setState({
            action: "update",
            currentID: r.id,
            denomination: r.denomination,
            check: r.state,
            date_start: r.date_start ? r.date_start : "",
            date_end: r.date_end ? r.date_end : "",
            semesters: array,
        });
    };
    handleResetModal = () => {
        let array = this.state.semesters;
        for (let k = 0; k < array.length; k++) {
            array[k].state = false;
        }
        this.setState({
            action: "add",
            currentID: "",
            denomination: "",
            check: false,
            date_start: "",
            date_end: "",
            semesters: array,
        });
    };
    handleCloseModal = () => {
        this.handleResetModal();
        this.setState({
            modalAcademicCalendar: false,
        });
    };
    handleClickRetrieveRecord = (record) => {
        this.setState({
            action: "update",
            mentionID: record.id,
            denomination: record.denomination || "",
            creditRequired: record.credit_required || "",
            creditElective: record.credit_elective || "",
        });
    };

    render() {
        //state frontend
        const { denomination, date_end, date_start, check } = this.state;
        const { academicCalendars, semesters } = this.state;

        const { action, disabled } = this.state;
        const labelStyle = {
            display: "block",
            color: "#334e68",
            fontSize: "12px",
            fontWeight: 800,
            marginBottom: "6px",
            textTransform: "uppercase",
        };
        const controlStyle = {
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            minHeight: "42px",
            color: "#243b53",
            fontSize: "14px",
            boxShadow: "none",
        };
        const helperStyle = {
            color: "#627d98",
            fontSize: "12px",
            marginTop: "6px",
            lineHeight: 1.35,
        };
        const sectionStyle = {
            border: "1px solid #d9e2ec",
            borderRadius: "8px",
            background: "#f8fafc",
            padding: "12px",
            marginBottom: "12px",
        };
        const actualNoticeStyle = {
            border: "1px solid #ffd89a",
            borderRadius: "8px",
            background: "#fff8e8",
            color: "#76520d",
            padding: "10px 12px",
            fontSize: "13px",
            lineHeight: 1.45,
            marginTop: "8px",
        };

        return (
            <>
                <Modal
                    show={this.state.modalAcademicCalendar}
                    onHide={() =>
                        this.setState({ modalAcademicCalendar: false })
                    }
                    size="lg"
                    centered
                >
                    <Modal.Header style={{ background: "#006aa6" }}>
                        <Modal.Title as="h5" style={{ color: "white" }}>
                            CALENDARIO ACADÉMICO
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <Dropdown
                                alignRight={true}
                                className="pull-right mr-n3 mt-n1"
                            >
                                <Dropdown.Toggle
                                    className="btn-icon"
                                    style={{
                                        border: "none",
                                        background: "none",
                                        outline: "none",
                                        color: "#ffffff00",
                                        height: "5px",
                                    }}
                                >
                                    <i
                                        onClick={() => this.handleCloseModal()}
                                        className="material-icons pull-right mr-n2 mt-n1"
                                        style={{ color: "white" }}
                                    >
                                        close
                                    </i>
                                </Dropdown.Toggle>
                            </Dropdown>
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ background: "#f4f7fb" }}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group style={sectionStyle}>
                                    <Form.Label
                                        style={{
                                            ...labelStyle,
                                            color:
                                                denomination === ""
                                                    ? "#ff5252"
                                                    : labelStyle.color,
                                        }}
                                    >
                                        Descripción
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        id="number"
                                        value={denomination}
                                        onChange={this.handleChange(
                                            "denomination"
                                        )}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                        style={controlStyle}
                                    />
                                    <div style={helperStyle}>
                                        Ingrese el anio del calendario, por
                                        ejemplo 2026.
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            date_start === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Fecha de Inicio{" "}
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="form-control"
                                        onChange={this.handleChange(
                                            "date_start"
                                        )}
                                        max="2999-12-31"
                                        value={date_start}
                                    />
                                </Form.Group>
                            </Col>
                            {/*<Col xs={12} sm={12} md={6} lg={6} xl={6}>*/}
                            {/*    <Form.Group className="form-group fill">*/}
                            {/*        <Form.Label className="floating-label">Fecha Inicio</Form.Label>*/}
                            {/*        <DatePickerStyled>*/}
                            {/*            <DatePicker*/}
                            {/*                selected={date_start}*/}
                            {/*                todayButton={"Hoy"}*/}
                            {/*                onChange={this.handleChange('date_start')}*/}
                            {/*                className="form-control"*/}
                            {/*                isClearable*/}

                            {/*                placeholderText="dia/mes/año"*/}
                            {/*            />*/}
                            {/*        </DatePickerStyled>*/}
                            {/*    </Form.Group>*/}
                            {/*</Col>*/}
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            date_end === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Fecha de Fin{" "}
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="form-control"
                                        onChange={this.handleChange("date_end")}
                                        max="2999-12-31"
                                        value={date_end}
                                    />
                                </Form.Group>
                            </Col>
                            {/*<Col xs={12} sm={12} md={6} lg={6} xl={6}>*/}
                            {/*    <Form.Group className="form-group fill">*/}
                            {/*        <Form.Label className="floating-label">Fecha Fin</Form.Label>*/}
                            {/*        <DatePickerStyled>*/}
                            {/*            <DatePicker*/}
                            {/*                selected={date_end}*/}
                            {/*                onChange={this.handleChange('date_end')}*/}
                            {/*                className="form-control"*/}
                            {/*                isClearable*/}

                            {/*                placeholderText="dia/mes/año"*/}
                            {/*            />*/}
                            {/*        </DatePickerStyled>*/}
                            {/*    </Form.Group>*/}
                            {/*</Col>*/}
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">
                                        Procesos
                                    </Form.Label>
                                </Form.Group>
                                <div className="to-do-list mr-2 mt-2 pb-0 mb-0">
                                    {semesters.length > 0 &&
                                        semesters.map((r, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className="d-inline-block"
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <label className="check-task custom-control custom-checkbox d-flex justify-content-center">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            onChange={() =>
                                                                this.updateStateSemester(
                                                                    i
                                                                )
                                                            }
                                                            checked={r.state}
                                                            value={r.state}
                                                        />
                                                        <span className="custom-control-label">
                                                            {r.denomination}
                                                        </span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group>
                                    <Form.Label style={labelStyle}>
                                        Estado del calendario
                                    </Form.Label>
                                </Form.Group>
                                <div className="to-do-list mr-2 mt-2 pb-0 mb-0">
                                    <div
                                        className="d-inline-block"
                                        style={{ marginRight: "10px" }}
                                    >
                                        <label className="check-task custom-control custom-checkbox d-flex justify-content-center">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customCheck2"
                                                onChange={this.handleChange(
                                                    "check"
                                                )}
                                                checked={check}
                                            />
                                            <span className="custom-control-label">
                                                Marcar como calendario actual
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                {check && (
                                    <div style={actualNoticeStyle}>
                                        Al guardar, este calendario sera el que
                                        aparezca en la cabecera y los otros
                                        calendarios quedaran desactivados.
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                        marginTop: "12px",
                                    }}
                                >
                                    {action !== "add" && (
                                        <Button
                                            disabled={disabled}
                                            variant="danger"
                                            onClick={() =>
                                                this.deleteAcademicCalendar()
                                            }
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                    {action === "add" ? (
                                        <Button
                                            disabled={disabled}
                                            variant="primary"
                                            onClick={() =>
                                                this.saveAcademicCalendar()
                                            }
                                        >
                                            {disabled && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                />
                                            )}
                                            Guardar
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={disabled}
                                            variant="primary"
                                            onClick={() =>
                                                this.updateAcademicCalendar()
                                            }
                                        >
                                            {disabled && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                />
                                            )}
                                            Guardar Cambios
                                        </Button>
                                    )}
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <hr />
                                <Table
                                    hover
                                    responsive
                                    style={{ marginTop: "-1px" }}
                                >
                                    <tbody>
                                        {academicCalendars.length > 0 &&
                                            academicCalendars.map((r, i) => {
                                                return (
                                                    <tr
                                                        key={i}
                                                        onClick={() =>
                                                            this.handleRetriveData(
                                                                r
                                                            )
                                                        }
                                                    >
                                                        <td scope="row">
                                                            <div className="d-inline-block align-middle">
                                                                <div className="d-inline-block">
                                                                    <h6
                                                                        className={
                                                                            "m-b-0 program-"
                                                                        }
                                                                    >
                                                                        {
                                                                            r.denomination
                                                                        }{" "}
                                                                        -{" "}
                                                                        {r.state
                                                                            ? "Actual"
                                                                            : ""}
                                                                    </h6>
                                                                    <p
                                                                        className={
                                                                            "m-b-0 mention-"
                                                                        }
                                                                    >
                                                                        {moment(
                                                                            r.date_start
                                                                        ).format(
                                                                            "LL"
                                                                        ) +
                                                                            " - " +
                                                                            moment(
                                                                                r.date_end
                                                                            ).format(
                                                                                "LL"
                                                                            )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}
