import React, { Component } from "react";
import {
    Card,
    Col,
    Dropdown,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";

import $ from "jquery";
import CourseDetail from "./CourseDetail";

moment.locale("es");

export default class AcademicRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentID: "",
            registrations: [],
        };
    }

    /*
     * B-CONCEPTOS-ESTUDIANTE
     *  listPaymentStudent
     * FUNCION PARA CARGAR LOS  EL CRONOGRAMA DE PAGOS DEL ESTUDIANTE
     */
    componentDidMount() {
        this.setState({
            studentID: this.props.studentID,
            activeForm: this.props.activeForm,
        });
        this.getRecordStudent(this.props.studentID);
    }

    //
    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.studentID !== this.props.studentID) {
    //         this.setState({studentID: this.props.studentID})
    //     }
    //     if (prevProps.activeForm !== this.props.activeForm) {
    //         this.setState({activeForm: this.props.activeForm})
    //     }
    // }

    getRecordStudent(studentID) {
        const url =
            app.registration +
            "/" +
            app.registrations +
            "/" +
            studentID +
            "/" +
            app.student;
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) this.setState({ registrations: res.data });
            })
            .catch((err) => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Algo salio mal al cargar el record Academico",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    openFileReader = () => {
        const input = "#inputVaucher";
        $(input).click();
    };

    removeAvatar = () => {
        this.setState({ file: "", preview: null });
        const input = "#inputAvatar";
        $(input).val("");
    };
    handleChange = (field) => (event) => {
        switch (field) {
            case "voucherCode":
                let voucherCode = event.target.value.replace(/[^0-9]/g, "");
                this.setState({ voucherCode: voucherCode.slice(0, 11) });
                break;
            case "amount":
                this.setState({
                    amount: event.target.value.substr(4).replace(/,/g, ""),
                    amountMask: event.target.value,
                });
                break;
            case "paymentDate":
                this.setState({ paymentDate: event.target.value });
                break;

            default:
                break;
        }
    };
    selectedConcept = (k) => {
        console.log(k);
        let total = this.state.totalInversion;
        let data = [];
        data = this.state.monthlys;
        for (let i = 0; i < data.length; i++) {
            if (
                data[i].id === k.id &&
                data[i].order_number === k.order_number
            ) {
                data[i].state = !k.state;
                // data[i].exists = !k.exists;
                if (data[i].state) {
                    total = total + parseFloat(data[i].amount);
                } else {
                    total = total - parseFloat(data[i].amount);
                }
            }
        }
        console.log(data);
        this.setState({ totalInversion: total, monthlys: data });
    };

    render() {
        const { registrations } = this.state;

        return (
            <Row>
                {registrations.length > 0 &&
                    registrations.map((r, index) => {
                        let totalCredit = 0;
                        return (
                            <Col key={index} md={12}>
                                <Card style={{ marginBottom: "14px" }}>
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
                                                <h5>
                                                    {r.AS.denomination +
                                                        " - " +
                                                        r.AS.AC.denomination.replace(
                                                            "CALENDARIO ACADEMICO",
                                                            ""
                                                        )}
                                                </h5>
                                            </div>
                                        </div>
                                        <div
                                            className="d-inline-block pull-right"
                                            style={{ marginTop: "-11px" }}
                                        >
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>Editar</Tooltip>
                                                }
                                            >
                                                <Dropdown
                                                    alignRight={true}
                                                    style={{
                                                        marginRight: "-9px ",
                                                    }}
                                                    className="pull-right "
                                                >
                                                    <Dropdown.Toggle
                                                        className="btn-icon"
                                                        style={{
                                                            border: "none",
                                                            background: "none",
                                                            outline: "none",
                                                            color: "white",
                                                            height: "5px",
                                                        }}
                                                    >
                                                        <i
                                                            className="material-icons pull-right mr-n2 mt-n1"
                                                            style={{
                                                                color: "#6c757d",
                                                            }}
                                                        >
                                                            edit
                                                        </i>
                                                    </Dropdown.Toggle>
                                                </Dropdown>
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
                                                    <th className="col-6">
                                                        Curso
                                                    </th>
                                                    <th className="col-1">
                                                        Ciclo
                                                    </th>
                                                    <th className="col-1">
                                                        Creditos
                                                    </th>
                                                    <th className="col-1">
                                                        Nota
                                                    </th>
                                                    <th className="col-2 ">
                                                        Estado
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {r.Registration.length > 0 ? (
                                                    r.Registration.map(
                                                        (k, i) => {
                                                            let span = "";
                                                            switch (k.state) {
                                                                // k.approved ? "primary" : k.state === "Desaprobado" ? "danger" : "info";
                                                                case "Aprobado":
                                                                    span =
                                                                        "primary";

                                                                    break;
                                                                case "Desaprobado":
                                                                    span =
                                                                        "danger";
                                                                    break;
                                                                case "Cursando":
                                                                    span =
                                                                        "info";
                                                                    break;
                                                                case "Retirado":
                                                                    span =
                                                                        "secondary";
                                                                    break;

                                                                default:
                                                                    break;
                                                            }
                                                            totalCredit =
                                                                totalCredit +
                                                                k.Course
                                                                    .credits;

                                                            return (
                                                                <tr
                                                                    key={i}
                                                                    className="d-flex"
                                                                    onClick={() =>
                                                                        this.CourseDetail.handleOpenModal(
                                                                            k
                                                                        )
                                                                    }
                                                                >
                                                                    <td className="col-1">
                                                                        <div className="d-inline-block align-middle">
                                                                            <div className="d-inline-block">
                                                                                <p className="m-b-0">
                                                                                    {" "}
                                                                                    {
                                                                                        k
                                                                                            .Course
                                                                                            .order
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-6">
                                                                        <div className="d-inline-block align-middle">
                                                                            <div className="d-inline-block">
                                                                                <p className="m-b-0">
                                                                                    {" "}
                                                                                    {
                                                                                        k
                                                                                            .Course
                                                                                            .denomination
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-1">
                                                                        <div className="d-inline-block align-middle">
                                                                            <div className="d-inline-block">
                                                                                <p className="m-b-0">
                                                                                    {" "}
                                                                                    {k.Course.Semester_mention.semester.replace(
                                                                                        "Semestre",
                                                                                        ""
                                                                                    )}
                                                                                </p>
                                                                                {/*<p className="m-b-0"> Ciclo:<strong>{k.Semester_mention.semester.replace('Semestre', '')} </strong></p>*/}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-1">
                                                                        <div className="d-inline-block align-middle">
                                                                            <div className="d-inline-block">
                                                                                <p className="m-b-0">
                                                                                    {" "}
                                                                                    {
                                                                                        k
                                                                                            .Course
                                                                                            .credits
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-1">
                                                                        <div className="d-inline-block align-middle">
                                                                            <div className="d-inline-block">
                                                                                <p className="m-b-0">
                                                                                    {" "}
                                                                                    {
                                                                                        k.note
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="col-2">
                                                                        <span
                                                                            className={
                                                                                "badge badge-" +
                                                                                span +
                                                                                " inline-block"
                                                                            }
                                                                        >
                                                                            {
                                                                                k.state
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
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
                                        <p className="task-due card-text">
                                            <strong> Creditos : </strong>
                                            <strong className="label label-primary">
                                                {totalCredit}
                                            </strong>
                                        </p>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })}
                <CourseDetail
                    studentID={this.state.studentID}
                    getRecordStudent={() =>
                        this.getRecordStudent(this.state.studentID)
                    }
                    ref={(ref) => (this.CourseDetail = ref)}
                />
            </Row>
        );
    }
}
