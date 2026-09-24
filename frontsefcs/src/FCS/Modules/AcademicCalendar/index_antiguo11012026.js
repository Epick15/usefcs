import React, { Component } from "react";
import axios from "axios";

import crypt from "node-cryptex";
import app from "../../Constants";

import PNotify from "pnotify/dist/es/PNotify";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import moment from "moment";
import ModalAcademic from "./ModalAcademic";
import TitleModule from "../../TitleModule";
import component from "../Programs/AdmissionPlan";
import GetApp from "@material-ui/icons/GetApp";
import { Check } from "@material-ui/icons";
import Swal from "sweetalert2";

const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem("INFO")
    ? JSON.parse(crypt.decrypt(localStorage.getItem("INFO"), k, v))
    : "";

export default class AcademicCalendar extends Component {
    state = {
        organicUnit: component.ORGANIC_UNIT,
        loader: false,
        action: "add",

        process: "",

        academicCalendar: "",

        programs: [],
        processs: [],
        semesterActivitys: [],
        academicCalendars: [],
    };

    async componentDidMount() {
        this.listAcademicSemesterAndAcademicCalendar();
        this.listProgramReport();
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
                });
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

    async listProgramReport() {
        this.setState({ loader: true });
        const url = app.programs + "/" + app.program + "-report";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ programs: res.data });
            }
            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal",
                delay: err,
            });
            console.log(err);
        }
    }

    async listSemesterActivity(program, process) {
        this.setState({ loader: true });
        const url =
            app.general +
            "/" +
            app.semesterActivity +
            "/list/" +
            program +
            "/" +
            process;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ semesterActivitys: res.data });
            }
            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal",
                delay: err,
            });
            console.log(err);
        }
    }

    async updateSemesterActivity(r) {
        this.setState({ loader: true });
        const url =
            app.general + "/" + app.semesterActivity + "/update/" + r.id;

        let data = new FormData();

        data.set("date_start", r.date_start);
        data.set("date_end", r.date_end);
        data.set("state", r.state);

        try {
            const res = await axios.patch(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            this.setState({ loader: false });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    async createSemesterActivity() {
        this.setState({ loader: true });
        const { program, process } = this.state;
        const url = app.general + "/" + app.semesterActivity + "/create";

        let data = new FormData();

        data.set("id_program", program);
        data.set("id_academic_semester", process);

        try {
            const res = await axios.post(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            this.setState({ loader: false });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    async finishSemesterActivity() {
        this.setState({ loader: true });
        const url = app.general + "/" + app.semesterActivity + "/finish";

        let data = new FormData();

        data.set("id_program", this.state.program);
        data.set("id_process", this.state.process);

        try {
            const res = await axios.patch(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            // this.setState({loader: false});
            // PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    async updateStateSemesterActivity() {
        this.setState({ loader: true });
        const url = app.general + "/" + app.semesterActivity + "/state";
        let data = new FormData();
        try {
            const res = await axios.patch(url, data, app.headers);
            this.listSemesterActivity(this.state.program, this.state.process);
            this.setState({ loader: false, process: "", program: "" });
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "program":
                this.setState({ program: event.target.value });
                this.state.process &&
                    this.listSemesterActivity(
                        event.target.value,
                        this.state.process
                    );
                break;
            case "academicCalendar":
                this.setState({
                    academicCalendar: event.target.value,
                    processs: [],
                });
                this.listProcessByAcademicCalendarID(event.target.value);
                break;
            case "process":
                this.setState({ process: event.target.value });
                this.state.program &&
                    this.listSemesterActivity(
                        this.state.program,
                        event.target.value
                    );
                break;
            case "startDate":
                this.setState({ startDate: event.target.value });
                this.calculateMount();
                break;
            case "endDate":
                this.setState({ endDate: event.target.value });
                this.calculateMount();
                break;
            default:
                break;
        }
    };
    handleChangeArray = (k, type, v) => {
        let data = [];
        data = this.state.semesterActivitys;
        console.log(v.target.value);
        if (type === "state") {
            // for (let i = 0; i < data.length; i++) {
            //     data[i].state = false
            // }
            data[k].state = !data[k].state;
        }
        if (type === "start") {
            data[k].date_start = v.target.value;
        }
        if (type === "end") {
            data[k].date_end = v.target.value;
        }
        this.setState({ semesterActivitys: data });
    };
    openFinishSweetAlert = async () => {
        try {
            const alert = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Este paso es irreversible!. Se cerrara el proceso de registro",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Finalizar!",
                cancelButtonText: "No, Cancelar",
            });
            alert.isConfirmed
                ? await this.finishSemesterActivity()
                : this.props.closeForm();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };

    render() {
        const { semesterActivitys, process, program, programs } = this.state;
        const { processs } = this.state;
        return (
            <>
                {this.state.loader && component.spiner}
                <TitleModule
                    actualTitle={"CALENDARIO ACADEMICO"}
                    actualModule={"APERTURA Y CIERRE DE PROCESOS"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card
                            className=" order-card"
                            style={{ marginBottom: "10px" }}
                        >
                            <Card.Body>
                                <Row>
                                    <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">
                                                Programa
                                            </Form.Label>

                                            <Form.Control
                                                as="select"
                                                value={program}
                                                onChange={this.handleChange(
                                                    "program"
                                                )}
                                            >
                                                <option
                                                    defaultValue={true}
                                                    hidden
                                                >
                                                    Programa
                                                </option>
                                                {programs.length > 0 ? (
                                                    programs.map((r, k) => {
                                                        return (
                                                            <option
                                                                id={r.id}
                                                                value={r.id}
                                                                key={k}
                                                            >
                                                                {" "}
                                                                {r.description}
                                                            </option>
                                                        );
                                                    })
                                                ) : (
                                                    <option
                                                        value={false}
                                                        disabled
                                                    >
                                                        No se encontraron datos
                                                    </option>
                                                )}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">
                                                Proceso
                                                <small className="text-danger">
                                                    {" "}
                                                    *
                                                </small>
                                            </Form.Label>

                                            {this.state.calendarLoader ? (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                />
                                            ) : (
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
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={1} lg={1} xl={1}>
                                        {semesterActivitys.length === 0 && (
                                            <div className="d-inline-block align-middle ">
                                                <Button
                                                    className="btn-icon btn-rounded wid-50 align-top m-r-15"
                                                    onClick={() =>
                                                        this.createSemesterActivity()
                                                    }
                                                    style={{
                                                        border: "none",
                                                    }}
                                                >
                                                    <i className="material-icons">
                                                        add
                                                    </i>
                                                    {/*<i className={'feather icon-image'}/>*/}
                                                </Button>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {semesterActivitys.length > 0 && (
                            <>
                                <Card
                                    className=" order-card"
                                    style={{ marginBottom: "10px !important" }}
                                >
                                    <Card.Body style={{ padding: "0px" }}>
                                        <Row>
                                            <Col
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                                xl={12}
                                            >
                                                <Table
                                                    size="sm"
                                                    hover
                                                    style={{ width: "100%" }}
                                                >
                                                    <thead>
                                                        <tr className="d-flex">
                                                            <th className="col-4">
                                                                Procesos
                                                            </th>
                                                            <th className="col-3">
                                                                Fecha Inicio
                                                            </th>
                                                            <th className="col-3">
                                                                Fecha Fin
                                                            </th>
                                                            <th className="col-1">
                                                                Abierto
                                                            </th>
                                                            <th className="col-1"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {semesterActivitys &&
                                                            semesterActivitys.map(
                                                                (r, i) => {
                                                                    return (
                                                                        <tr
                                                                            className="d-flex"
                                                                            key={
                                                                                i
                                                                            }
                                                                            style={{
                                                                                height: "45px",
                                                                            }}
                                                                        >
                                                                            <td className="col-4">
                                                                                <p className=" m-b-0">
                                                                                    {
                                                                                        r.activity
                                                                                    }
                                                                                </p>
                                                                            </td>
                                                                            <td className="col-3">
                                                                                <Form.Group
                                                                                    className="form-group fill"
                                                                                    style={{
                                                                                        marginTop:
                                                                                            "-8px",
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        type="date"
                                                                                        disabled={
                                                                                            r.finish
                                                                                        }
                                                                                        className="form-control"
                                                                                        onChange={this.handleChangeArray.bind(
                                                                                            this,
                                                                                            i,
                                                                                            "start"
                                                                                        )}
                                                                                        max="2999-12-31"
                                                                                        value={
                                                                                            r.date_start
                                                                                        }
                                                                                    />
                                                                                </Form.Group>
                                                                            </td>
                                                                            <td className="col-3">
                                                                                <Form.Group
                                                                                    className="form-group fill"
                                                                                    style={{
                                                                                        marginTop:
                                                                                            "-8px",
                                                                                    }}
                                                                                >
                                                                                    <input
                                                                                        type="date"
                                                                                        disabled={
                                                                                            r.finish
                                                                                        }
                                                                                        className="form-control"
                                                                                        onChange={this.handleChangeArray.bind(
                                                                                            this,
                                                                                            i,
                                                                                            "end"
                                                                                        )}
                                                                                        max="2999-12-31"
                                                                                        value={
                                                                                            r.date_end
                                                                                        }
                                                                                    />
                                                                                </Form.Group>
                                                                            </td>
                                                                            <td className="col-1">
                                                                                {!r.finish ? (
                                                                                    <Row>
                                                                                        No
                                                                                        <div
                                                                                            className="custom-control custom-switch"
                                                                                            //onClick={() => this.handleChangeArray(i)}
                                                                                            onClick={this.handleChangeArray.bind(
                                                                                                this,
                                                                                                i,
                                                                                                "state"
                                                                                            )}
                                                                                        >
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="custom-control-input"
                                                                                                readOnly
                                                                                                checked={
                                                                                                    r.state
                                                                                                }
                                                                                                value={
                                                                                                    r.state
                                                                                                }
                                                                                            />
                                                                                            <label
                                                                                                className="custom-control-label"
                                                                                                htmlFor="customSwitch1"
                                                                                            />
                                                                                        </div>
                                                                                        Si
                                                                                    </Row>
                                                                                ) : (
                                                                                    " Finalizado"
                                                                                )}
                                                                            </td>
                                                                            <td className="col-1">
                                                                                {!r.finish && (
                                                                                    <i
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            this.updateSemesterActivity(
                                                                                                r
                                                                                            )
                                                                                        }
                                                                                        className="material-icons text-primary"
                                                                                    >
                                                                                        save
                                                                                    </i>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                {/*{*/}
                                {/*    !semesterActivitys[0].finish &&*/}
                                <Row
                                    style={{ marginBottom: "10px !important" }}
                                >
                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <button
                                            style={{
                                                float: "right",
                                                marginRight: "3px",
                                            }}
                                            onClick={() =>
                                                this.openFinishSweetAlert()
                                            }
                                            type="butt-on"
                                            className=" btn btn-primary"
                                        >
                                            <Check /> Finalizar Proceso
                                        </button>
                                    </Col>
                                </Row>
                                {/*}*/}
                            </>
                        )}
                        <Row style={{ marginBottom: "10px !important" }}>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <button
                                    style={{
                                        float: "center",
                                        marginRight: "3px",
                                    }}
                                    onClick={() =>
                                        this.updateStateSemesterActivity()
                                    }
                                    type="butt-on"
                                    className=" btn btn-primary"
                                >
                                    <Check /> Cerrar todas las Actividades
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
}
