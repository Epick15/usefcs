import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import app from "../../../../Constants";

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
import Add from "@material-ui/icons/Add";
import component from "../../../../Component";

const customStyles = {
    control: (base, state) => ({
        ...base,
        border: "0 !important",
        borderRadius: "0 !important",
        borderBottom: "1px solid #ced4da !important",
        "&::placeholder": {
            marginLeft: "-7px !important",
        },
        // This line disable the blue border
        boxShadow: "0 !important",
        "&:hover": {
            border: "0 !important",
            borderBottomColor: "transparent !important",
            backgroundSize: "100% 100%, 100% 100% !important",
            transitionDuration: " 0.3s !important",
            boxShadow: "none !important",
            backgroundImage:
                "linear-gradient(to top, #4680ff 2px, rgba(70, 128, 255, 0) 2px), linear-gradient(to top, #ced4da 1px, rgba(206, 212, 218, 0) 1px) !important",
        },
    }),
};
let dfValue;
export default class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: "",
            cycleCourses: [],

            action: "add",
            code: "",
            denomination: "",
            abbreviation: "",
            credits: "",
            theoryHours: "",
            practiceHours: "",
            area: "",
            order: "",
            typeCourse: "",
            requirements: "",
            required: "",
            loader: false,
            requiredCourses: [],
            coursesLoader: false,
        };
    }

    componentDidMount() {
        this.setState({
            planId: this.props.planId,
        });

        this.listCycleCourseByPlan(this.props.planId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.planId !== this.props.planId) {
            this.setState({ planId: this.props.planId });
            this.listCycleCourseByPlan(this.props.planId);
        }
    }

    // MPT
    generateCourseCode = () => {
        let yearForCode = () => {
            let planName = this.props.planName;
            let guionPosicion = planName.replace(/\s/g, "").indexOf("-");
            let planYear = () =>
                planName
                    .replace(/\s/g, "")
                    .slice(guionPosicion - 2, guionPosicion);

            return planYear();
        };
        let cicloForCode = (ciclo) => {
            if (ciclo === "I") {
                return "00I";
            } else if (ciclo === "II") {
                return "0II";
            } else {
                return "III";
            }
        };
        let typeForCode = () =>
            this.state.typeCourse === "Obligatorio" ? "O" : "E";
        let orderForCode = (ord) => {
            console.log(ord);
            if (ord < 10 && ord.toString().length < 2) {
                return `0${ord}`;
            } else {
                return ord;
            }
        };
        let courseCode =
            yearForCode() +
            "E" +
            cicloForCode(this.state.cicloCode) +
            typeForCode() +
            this.props.abbreviationProgram +
            orderForCode(this.state.order);
        this.setState({ code: courseCode });
    };
    //

    getCourseRequired(planId, cycle) {
        this.setState({ coursesLoader: true });
        const url =
            app.programs +
            "/" +
            app.cycle +
            "/" +
            app.course +
            "/" +
            planId +
            "/" +
            cycle +
            "/course-required";
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data)
                    this.setState({
                        requiredCourses: res.data,
                        coursesLoader: false,
                    });
            })
            .catch((err) => {
                this.setState({ coursesLoader: false });
                PNotify.error({
                    title: "Oh no!",
                    text: "Error al obtener prerequisitos",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    saveCourse() {
        this.setState({ loader: true });
        const url = app.programs + "/" + app.course;
        const {
            typeCourse,
            cicloID,
            code,
            denomination,
            abbreviation,
            credits,
            theoryHours,
            practiceHours,
            area,
            order,
            planId,
            required,
        } = this.state;

        if (
            code !== "" &&
            denomination !== "" &&
            abbreviation !== "" &&
            credits !== "" &&
            theoryHours !== "" &&
            practiceHours !== "" &&
            area !== "" &&
            order !== "" &&
            planId !== "" &&
            cicloID !== ""
        ) {
            let data = new FormData();

            data.set("id_ciclo", cicloID);
            data.set("code", code);
            data.set("denomination", denomination);
            data.set("abbreviation", abbreviation);
            data.set("area", area);
            data.set("order", order);
            data.set("credits", credits);
            data.set("practical_hours", practiceHours);
            data.set("hours", theoryHours);
            data.set("type", typeCourse);
            if (required !== "") {
                data.set("requirements", JSON.stringify(required));
            }

            axios
                .post(url, data, app.headers)
                .then(() => {
                    this.listCycleCourseByPlan(this.state.planId);
                    this.closeModalCourse();
                    this.setState({ loader: false });
                    PNotify.success({
                        title: "Finalizado",
                        text: "Registro almacenado correctamente",
                        delay: 2000,
                    });
                })
                .catch((err) => {
                    this.setState({ loader: false });
                    PNotify.error({
                        title: "Oh no!",
                        text: "Ha ocurrido un error",
                        delay: 2000,
                    });
                    console.log(err);
                });
        } else {
            this.setState({ loader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    updateCourse() {
        this.setState({ loader: true });
        const url = app.programs + "/" + app.course + "/" + this.state.courseID;
        const {
            mentionID,
            typeCourse,
            code,
            denomination,
            abbreviation,
            credits,
            theoryHours,
            practiceHours,
            area,
            order,
            required,
            planId,
        } = this.state;
        if (
            code !== "" &&
            denomination !== "" &&
            abbreviation !== "" &&
            credits !== "" &&
            theoryHours !== "" &&
            practiceHours !== "" &&
            area !== "" &&
            order !== "" &&
            planId !== ""
        ) {
            let data = new FormData();
            data.set("code", code);
            data.set("denomination", denomination);
            data.set("abbreviation", abbreviation);
            data.set("area", area);
            data.set("credits", credits);
            data.set("practical_hours", practiceHours);
            data.set("hours", theoryHours);
            data.set("type", typeCourse);
            data.set("order", order);
            data.set("requirements", JSON.stringify(required));
            axios
                .patch(url, data, app.headers)
                .then(() => {
                    this.listCycleCourseByPlan(this.state.planId);
                    this.closeModalCourse();
                    PNotify.success({
                        title: "Finalizado",
                        text: "Registro actualizado correctamente",
                        delay: 2000,
                    });
                })
                .catch((err) => {
                    this.setState({ loader: false });
                    PNotify.error({
                        title: "Oh no!",
                        text: "Ha ocurrido un error",
                        delay: 2000,
                    });
                    console.log(err);
                });
        } else {
            this.setState({ loader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async listCycleCourseByPlan(id) {
        this.setState({ loader: true });
        const url =
            app.programs +
            "/" +
            app.cycle +
            "/" +
            app.course +
            "/" +
            app.plan +
            "/" +
            id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ cycleCourses: res.data });
            }

            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los Grados Academicos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async destroyCourse(id) {
        try {
            this.setState({ plansLoader: true });
            const url = app.programs + "/" + app.course + "/" + id;
            const res = await axios.delete(url, app.headers);

            PNotify.success({
                title: "Finalizado",
                text: res.data,
                delay: 2000,
            });
            this.setState({ loader: false });
            this.listCycleCourseByPlan(this.state.planId);
        } catch (err) {
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
            this.setState({ loader: false });
            return false;
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "typeCourse":
                this.setState({ typeCourse: event.target.value });
                break;
            // comentar para automatico
            // case "code":
            //     this.setState({
            //         code: event.target.value
            //             .replace(/[^a-zA-Z0-9/]/g, "")
            //             .slice(0, 15)
            //             .toUpperCase(),
            //     });
            //     break;
            case "denomination":
                this.setState({
                    denomination: event.target.value
                        .slice(0, 250)
                        .toUpperCase(),
                });
                break;
            case "abbreviation":
                this.setState({
                    abbreviation: event.target.value
                        .replace(/[^A-Za-záéíóúÁÉÍÓÚÜ /]/g, "")
                        .slice(0, 20)
                        .toUpperCase(),
                });
                break;
            case "credits":
                this.setState({
                    credits: event.target.value
                        .replace(/[^0-9/]/g, "")
                        .slice(0, 2),
                });
                break;
            case "theoryHours":
                this.setState({
                    theoryHours: event.target.value
                        .replace(/[^0-9/]/g, "")
                        .slice(0, 3),
                });
                break;
            case "practiceHours":
                this.setState({
                    practiceHours: event.target.value
                        .replace(/[^0-9/]/g, "")
                        .slice(0, 3),
                });
                break;
            case "area":
                this.setState({
                    area: event.target.value.replace(
                        /[^A-Za-záéíóúÁÉÍÓÚÜ /]/g,
                        ""
                    ),
                });
                break;
            case "order":
                this.setState({
                    order: event.target.value
                        .replace(/[^0-9/]/g, "")
                        .slice(0, 2),
                });
                break;
            case "required":
                if (event) {
                    if (event) {
                        let array = [];
                        for (let i = 0; i < event.length; i++) {
                            array.push({
                                value: event[i].value,
                                label: event[i].label,
                                order: event[i].order,
                            });
                        }
                        this.setState({ required: array, changed: true });
                    }
                }
                break;
            default:
                break;
        }
    };

    retriveModalCourse = (data, ciclo) => {
        this.getCourseRequired(this.state.planId, ciclo);
        if (data.requirements) {
            dfValue = JSON.parse(data.requirements);
        }
        console.log(data);
        this.setState({
            titleModalCourse: "CURSO-",
            courseID: data.id,
            code: data.code || "", //comentar para automatico
            typeCourse: data.type || "",
            denomination: data.denomination || "",
            abbreviation: data.abbreviation || "",
            credits: data.credits || "",
            theoryHours: data.hours || "",
            practiceHours: data.practical_hours || "",
            prerequisites: data.requiremets,
            requiredCourses: data.requiremets,
            area: data.area || "",
            order: data.order || "",
            action: "update",
            courseModal: true,
            // MPT
            // cicloLetter: ciclo,
        });
    };
    openModalCourse = (data) => {
        this.setState({ cicloCode: data.ciclo });
        if (data.ciclo !== "I") {
            this.getCourseRequired(this.state.planId, data.ciclo);
        }
        this.setState({
            titleModalCourse: "NUEVO CURSO - CICLO " + data.ciclo,
            cicloID: data.id,
            action: "add",
            courseModal: true,
            // MPT
            // cicloLetter: data.ciclo,
        });
    };
    closeModalCourse = () => {
        dfValue = "";
        this.setState({
            code: "",
            denomination: "",
            abbreviation: "",

            credits: "",
            theoryHours: "",
            practiceHours: "",
            prerequisites: "",
            requiredCourses: [],
            area: "",
            order: "",
            action: "add",
            loader: false,
            courseModal: false,
        });
    };
    deleteSweetCourse = (id) => {
        Swal.fire({
            icon: "warning",
            title: "Estás seguro?",
            text: "Este paso es irreversible!",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar",
        }).then((result) => {
            if (result.value) {
                this.destroyCourse(id);
            }
        });
    };

    render() {
        const { courseModal } = this.state;
        const { cycleCourses } = this.state;
        const {
            action,
            titleModalCourse,
            code,
            denomination,
            semesterMask,
            typeCourse,
            abbreviation,
            credits,
            requiredCourses,

            theoryHours,
            practiceHours,
            area,
            order,
            loader,
            coursesLoader,
        } = this.state;
        let totalCredit = 0;
        return (
            <Row>
                {cycleCourses.length > 0 && this.state.planId ? (
                    cycleCourses.map((r, index) => {
                        return (
                            <Col md={12} key={index}>
                                <Card className="card-border-c-blue mt-n2">
                                    <Card.Header
                                        className="h-40"
                                        style={{
                                            height: "40px",
                                            marginBottom: "-1px",
                                        }}
                                    >
                                        <div
                                            className="d-inline-block align-middle"
                                            style={{ marginTop: "-25px" }}
                                        >
                                            <div className="d-inline-block">
                                                <h5>{"Ciclo " + r.ciclo}</h5>
                                            </div>
                                        </div>
                                        <div
                                            className="d-inline-block pull-right"
                                            style={{
                                                marginTop: "-18px",
                                                marginRight: "15px",
                                            }}
                                        >
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>
                                                        Añadir curso
                                                    </Tooltip>
                                                }
                                            >
                                                <Add
                                                    onClick={() =>
                                                        this.openModalCourse(r)
                                                    }
                                                />
                                            </OverlayTrigger>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="card-task pb-0 pt-0 pl-0 pr-0">
                                        <Table
                                            size="sm"
                                            hover
                                            responsive
                                            style={{ width: "100%" }}
                                        >
                                            <thead>
                                                <tr className="d-flex">
                                                    <th className="col-1">#</th>
                                                    <th className="col-7">
                                                        Curso
                                                    </th>
                                                    <th className="col-3">
                                                        Horas
                                                    </th>
                                                    <th className="col-1"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {r.Course.length > 0 ? (
                                                    r.Course.map((k, i) => {
                                                        let required = "";
                                                        totalCredit =
                                                            totalCredit +
                                                            k.credits;
                                                        if (
                                                            k.requeriments !==
                                                                "" &&
                                                            JSON.parse(
                                                                k.requirements
                                                            )
                                                        ) {
                                                            let data = [];
                                                            data = JSON.parse(
                                                                k.requirements
                                                            );
                                                            if (
                                                                data.length > 0
                                                            ) {
                                                                required =
                                                                    " - Pre-Requisitos |";
                                                                JSON.parse(
                                                                    k.requirements
                                                                ).map((x) => {
                                                                    required =
                                                                        required +
                                                                        x.order +
                                                                        "|";
                                                                });
                                                            }
                                                        } else {
                                                            required = "";
                                                        }
                                                        return (
                                                            <tr
                                                                key={i}
                                                                className="d-flex"
                                                            >
                                                                <td className="col-1">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <p
                                                                                className="m-b-0"
                                                                                style={
                                                                                    k.state
                                                                                        ? {
                                                                                              color: "#37474f",
                                                                                          }
                                                                                        : {
                                                                                              color: "#ff5252",
                                                                                          }
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                {
                                                                                    k.order
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="col-7">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <h6
                                                                                className="m-b-0"
                                                                                style={
                                                                                    k.state
                                                                                        ? {
                                                                                              color: "#37474f",
                                                                                          }
                                                                                        : {
                                                                                              color: "#ff5252",
                                                                                          }
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                {
                                                                                    k.denomination
                                                                                }
                                                                            </h6>
                                                                            <p
                                                                                className="m-b-0"
                                                                                style={
                                                                                    k.state
                                                                                        ? {
                                                                                              color: "#37474f",
                                                                                          }
                                                                                        : {
                                                                                              color: "#ff5252",
                                                                                          }
                                                                                }
                                                                            >
                                                                                Creditos:{" "}
                                                                                <strong>
                                                                                    {" "}
                                                                                    {
                                                                                        k.credits
                                                                                    }
                                                                                </strong>
                                                                                {
                                                                                    required
                                                                                }{" "}
                                                                                {k.type ===
                                                                                "Electivo" ? (
                                                                                    <strong
                                                                                        className={
                                                                                            "text-primary"
                                                                                        }
                                                                                    >
                                                                                        {" "}
                                                                                        {
                                                                                            k.type
                                                                                        }
                                                                                    </strong>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="col-3">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <p
                                                                                className="m-b-0"
                                                                                style={
                                                                                    k.state
                                                                                        ? {
                                                                                              color: "#37474f",
                                                                                          }
                                                                                        : {
                                                                                              color: "#ff5252",
                                                                                          }
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                T:
                                                                                <strong>
                                                                                    {
                                                                                        k.hours
                                                                                    }
                                                                                </strong>{" "}
                                                                                hrs
                                                                            </p>
                                                                            <p
                                                                                className="m-b-0"
                                                                                style={
                                                                                    k.state
                                                                                        ? {
                                                                                              color: "#37474f",
                                                                                          }
                                                                                        : {
                                                                                              color: "#ff5252",
                                                                                          }
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                P:
                                                                                <strong>
                                                                                    {
                                                                                        k.practical_hours
                                                                                    }
                                                                                </strong>{" "}
                                                                                hrs
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="col-1">
                                                                    <Dropdown
                                                                        alignRight={
                                                                            true
                                                                        }
                                                                        className=""
                                                                    >
                                                                        <Dropdown.Toggle
                                                                            className="btn-icon"
                                                                            style={{
                                                                                border: "none",
                                                                                background:
                                                                                    "none",
                                                                                outline:
                                                                                    "none",
                                                                                color: "white",
                                                                                height: "5px",
                                                                                marginLeft:
                                                                                    "-18",
                                                                            }}
                                                                        >
                                                                            <i
                                                                                className="material-icons"
                                                                                style={{
                                                                                    color: "#6c757d",
                                                                                }}
                                                                            >
                                                                                more_vert
                                                                            </i>
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu
                                                                            as="ul"
                                                                            className="list-unstyled card-option"
                                                                        >
                                                                            <Dropdown.Item
                                                                                as="li"
                                                                                onClick={() =>
                                                                                    this.retriveModalCourse(
                                                                                        k,
                                                                                        r.ciclo
                                                                                    )
                                                                                }
                                                                                className="dropdown-item"
                                                                            >
                                                                                <span type="button">
                                                                                    {" "}
                                                                                    <i
                                                                                        className={
                                                                                            "feather icon-edit-2"
                                                                                        }
                                                                                    />{" "}
                                                                                    Editar{" "}
                                                                                </span>
                                                                            </Dropdown.Item>
                                                                            <Dropdown.Item
                                                                                as="li"
                                                                                onClick={() =>
                                                                                    this.deleteSweetCourse(
                                                                                        k.id
                                                                                    )
                                                                                }
                                                                                className="dropdown-item"
                                                                            >
                                                                                <span type="button">
                                                                                    {" "}
                                                                                    <i
                                                                                        className={
                                                                                            "feather icon-eye"
                                                                                        }
                                                                                    />{" "}
                                                                                    Eliminar{" "}
                                                                                </span>
                                                                            </Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr className="d-flex">
                                                        <td className="col-12">
                                                            <div className="d-inline-block align-middle">
                                                                <div className="d-inline-block">
                                                                    <p className="m-b-0">
                                                                        {" "}
                                                                        No hay
                                                                        cursos
                                                                        registrados
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                    <Card.Footer
                                        className="h-40"
                                        style={{ height: "40px" }}
                                    >
                                        {/*<p className="task-due card-text"><strong> Creditos : </strong><strong className="label label-primary">35</strong></p>*/}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <Col md={12}>
                        {this.state.loader ? (
                            component.spin
                        ) : (
                            <Card>
                                <Card.Header className="bg-c-yellow order-card">
                                    <h5 className="text-white ">
                                        No ha registrado los ciclos
                                    </h5>
                                    <p>
                                        {" "}
                                        Por favor registrar, los ciclos de para
                                        continuar
                                    </p>
                                    <i className="feather icon-alert-triangle card-icon" />
                                </Card.Header>
                            </Card>
                        )}
                    </Col>
                )}
                <Modal show={courseModal}>
                    <Modal.Header style={{ background: "#4680ff" }}>
                        <Modal.Title as="h5" style={{ color: "white" }}>
                            {titleModalCourse}
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
                                        onClick={this.closeModalCourse}
                                        className="material-icons pull-right mr-n2 mt-n1"
                                        style={{ color: "white" }}
                                    >
                                        close
                                    </i>
                                </Dropdown.Toggle>
                            </Dropdown>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            denomination === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Nombre
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={denomination}
                                        onChange={this.handleChange(
                                            "denomination"
                                        )}
                                        placeholder="Ingrese denominación del curso"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            order === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Número de orden
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={order}
                                        onChange={this.handleChange("order")}
                                        placeholder="Ingrese número de orden"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            typeCourse === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Tipo
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        as="select"
                                        value={typeCourse}
                                        onChange={this.handleChange(
                                            "typeCourse"
                                        )}
                                    >
                                        <option defaultValue={true} hidden>
                                            Por favor seleccione una opcción
                                        </option>
                                        <option value="Electivo">
                                            Electivo
                                        </option>
                                        <option value="Obligatorio">
                                            Obligatorio
                                        </option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            code === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Código
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={code}
                                        // onChange={this.handleChange("code")} //comentar para automatico
                                        // placeholder="GENERAR POR N° ORDEN"
                                        margin="normal"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Button
                                    className="btn btn-info d-block"
                                    onClick={this.generateCourseCode}
                                    disabled={
                                        this.state.order === "" ||
                                        this.state.typeCourse === ""
                                    }
                                >
                                    Generar código
                                </Button>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            abbreviation === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Abreviatura
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={abbreviation}
                                        onChange={this.handleChange(
                                            "abbreviation"
                                        )}
                                        placeholder="Ingrese abreviatura del curso"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            credits === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Créditos
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={credits}
                                        onChange={this.handleChange("credits")}
                                        placeholder="Ingrese créditos del curso"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            theoryHours === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Horas Teoría
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={theoryHours}
                                        onChange={this.handleChange(
                                            "theoryHours"
                                        )}
                                        placeholder="Ingrese horas de teoría"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            practiceHours === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Horas Práctica
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={practiceHours}
                                        onChange={this.handleChange(
                                            "practiceHours"
                                        )}
                                        placeholder="Ingrese horas de práctica"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            area === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Area
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        as="select"
                                        value={area}
                                        onChange={this.handleChange("area")}
                                    >
                                        <option defaultValue={true} hidden>
                                            Por favor seleccione una opcción
                                        </option>
                                        <option value="General">General</option>
                                        <option value="Especialidad">
                                            Especialidad
                                        </option>
                                        <option value="Especifico">
                                            Especifico
                                        </option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {semesterMask !== "Semestre I" && (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label
                                            className="floating-label"
                                            style={{ position: "absolute" }}
                                        >
                                            Prerequisitos
                                        </Form.Label>
                                        <Select
                                            isMulti
                                            isSearchable
                                            defaultValue={dfValue}
                                            name="prerequisites"
                                            options={requiredCourses}
                                            classNamePrefix="select"
                                            isLoading={coursesLoader}
                                            className="basic-multi-select"
                                            onChange={this.handleChange(
                                                "required"
                                            )}
                                            styles={customStyles}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>
                        {action === "add" ? (
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"
                                onClick={() => this.saveCourse()}
                            >
                                {loader && (
                                    <span
                                        className="spinner-border spinner-border-sm mr-1"
                                        role="status"
                                    />
                                )}
                                Guardar
                            </Button>
                        ) : (
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"
                                onClick={() => this.updateCourse()}
                            >
                                {loader && (
                                    <span
                                        className="spinner-border spinner-border-sm mr-1"
                                        role="status"
                                    />
                                )}
                                Guardar Cambios
                            </Button>
                        )}
                    </Modal.Body>
                </Modal>
            </Row>
        );
    }
}
