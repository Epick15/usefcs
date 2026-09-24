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

const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem("INFO")
    ? JSON.parse(crypt.decrypt(localStorage.getItem("INFO"), k, v))
    : "";

export default class AcademicCalendar extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,
        academicCalendars: "",
        academicSemesterID: "",
        modalActivity: false,
        activitys: [],
    };

    componentDidMount() {
        this.listAcademicCalendarActual();
        this.getActivity();
    }

    listAcademicCalendarActual() {
        const url = app.general + "/" + app.academicCalendar + "/actual";
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

    getActivity() {
        const url = app.general + "/activitys";
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    let array = [];
                    let arrayTemp = res.data;
                    for (let i = 0; i < arrayTemp.length; i++) {
                        array.push({
                            id: arrayTemp[i].id,
                            denomination: arrayTemp[i].denomination,
                            state: arrayTemp[i].state,
                            Activity: [],
                        });

                        for (let j = 0; j < arrayTemp[i].Activity.length; j++) {
                            array[i].Activity.push({
                                id: arrayTemp[i].Activity[j].id,
                                denomination:
                                    arrayTemp[i].Activity[j].denomination,
                                date_start: "",
                                date_end: "",
                                state: arrayTemp[i].Activity[j].state,
                            });
                        }
                    }

                    this.setState({
                        activitys: array,
                    });
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

    saveSemesterActivity() {
        this.setState({ disabled: true });
        const url = app.general + "/" + app.semesterActivity;
        const { activitys, academicSemesterID } = this.state;
        if (activitys && academicSemesterID !== "") {
            let data = new FormData();
            data.set("id_academic_semester", academicSemesterID);
            data.set(
                "activitys",
                crypt.encrypt(JSON.stringify(activitys), k, v)
            );
            axios
                .post(url, data, app.headers)
                .then(() => {
                    this.closeModalActivity();
                    this.setState({ disabled: false });
                    this.listAcademicCalendarActual();
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

    updateSemesterActivity() {
        this.setState({ disabled: true });
        const url = app.general + "/" + app.semesterActivity + "/update";
        const { activitys, academicSemesterID } = this.state;
        if (activitys && academicSemesterID !== "") {
            let data = new FormData();
            data.set("id_academic_semester", academicSemesterID);
            data.set(
                "activitys",
                crypt.encrypt(JSON.stringify(activitys), k, v)
            );
            axios
                .patch(url, data, app.headers)
                .then(() => {
                    this.closeModalActivity();
                    this.setState({ disabled: false });
                    this.listAcademicCalendarActual();
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

    updateActualActivity(id) {
        this.setState({ disabled: true });
        const url =
            app.general + "/" + app.semesterActivity + "/" + id + "/actual";

        if (id !== "") {
            let data = new FormData();

            axios
                .patch(url, data, app.headers)
                .then(() => {
                    this.setState({ disabled: false });
                    this.listAcademicCalendarActual();
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

    updateDateModal = (k, r, type, date) => {
        let activitys = this.state.activitys;
        if (type == "start") {
            activitys[k].Activity[r].date_start = date.target.value;
        } else {
            activitys[k].Activity[r].date_end = date.target.value;
        }
        this.setState({ activitys });
        console.log(this.state.activitys);
    };
    openModalActivity = (denomination, id) => {
        this.setState({
            modalActivity: true,
            titleModalSemester: denomination,
            academicSemesterID: id,
            action: "add",
        });
    };

    closeModalActivity = () => {
        this.getActivity();
        this.setState({
            modalActivity: false,
            titleModalSemester: "",
            academicSemesterID: "",
            action: "add",
        });
    };
    openEditModalActivity = (record, denomination, id) => {
        let array = [];
        for (let i = 0; i < record.length; i++) {
            if (
                !array.find(
                    (x) =>
                        x.denomination ==
                        record[i].Activity.Activity_type.denomination
                )
            ) {
                array.push({
                    id: record[i].Activity.Activity_type.id,
                    denomination: record[i].Activity.Activity_type.denomination,
                    state: record[i].Activity.Activity_type.state,
                    Activity: [],
                });
            }
        }
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < record.length; j++) {
                if (
                    array[i].denomination ===
                    record[j].Activity.Activity_type.denomination
                ) {
                    array[i].Activity.push({
                        id: record[j].id,
                        denomination: record[j].Activity.denomination,
                        date_start: record[j].date_start,
                        date_end: record[j].date_end,
                        state: record[j].state,
                    });
                }
            }
        }
        console.log(array);
        this.setState({
            activitys: array,
            titleModalSemester: denomination,
            academicSemesterID: id,
            modalActivity: true,
            action: "update",
        });
        // console.log(array);
    };
    changeModalState = (r, k) => {
        let array = this.state.activitys;
        console.log(r, k);
        for (let i = 0; i < array.length; i++) {
            if (i == r) {
                for (let j = 0; j < array[i].Activity.length; j++) {
                    if (j == k) {
                        array[i].Activity[j].state =
                            !array[i].Activity[j].state;
                    }
                }
            }
        }
        this.setState({ activitys: array });
        console.log(this.state.activitys);
    };
    changeActualActivity = (r, k) => {
        console.log(r, k);
        let array = this.state.academicCalendars.Academic_semesters;
        let arrayTemp = {
            id: this.state.academicCalendars.id,
            denomination: this.state.academicCalendars.denomination,
            date_start: this.state.academicCalendars.date_start,
            date_end: this.state.academicCalendars.date_end,
            state: this.state.academicCalendars.state,
            Academic_semesters: [],
        };
        let semesterActivityID = "";
        for (let i = 0; i < array.length; i++) {
            if (array[i].S_a.length > 0) {
                for (let j = 0; j < array[i].S_a.length; j++) {
                    if (j == k && i == r) {
                        semesterActivityID = array[i].S_a[j].id;
                    }
                }
            }
            arrayTemp.Academic_semesters.push(array[i]);
        }

        this.updateActualActivity(semesterActivityID);
        this.setState({ academicCalendars: arrayTemp });
    };

    render() {
        const {
            organicUnit,
            academicCalendars,
            activitys,
            titleModalSemester,
            modalActivity,
            disabled,
            action,
        } = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"CALENDARIO ACADEMICO"}
                    actualModule={"CALENDARIO ACADEMICO"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card className="bg-linkedin order-card">
                            <Card.Body>
                                <Row>
                                    <div className="d-inline-block align-middle  col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <Button
                                            className="btn-icon btn-rounded wid-50 align-top m-r-15"
                                            onClick={() =>
                                                this.ModalAcademic.handleOpenModalAcademicCalendar()
                                            }
                                            style={{
                                                backgroundColor: "#4680ff",
                                                border: "none",
                                            }}
                                        >
                                            <i className="material-icons">
                                                add
                                            </i>
                                            {/*<i className={'feather icon-image'}/>*/}
                                        </Button>

                                        <div className="d-inline-block">
                                            <h4 className="text-white">
                                                {academicCalendars
                                                    ? academicCalendars.denomination
                                                    : "No definido"}
                                            </h4>
                                            <p className="text-white m-b-0">
                                                {academicCalendars
                                                    ? moment(
                                                          academicCalendars.date_start
                                                      ).format("LL") +
                                                      " - " +
                                                      moment(
                                                          academicCalendars.date_end
                                                      ).format("LL")
                                                    : "No definido"}
                                            </p>
                                        </div>
                                    </div>
                                    <i className="feather icon-calendar card-icon" />
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        {academicCalendars
                            ? academicCalendars.Academic_semesters.length > 0 &&
                              academicCalendars.Academic_semesters.map(
                                  (r, i) => {
                                      return (
                                          <Card key={i}>
                                              <Card.Header
                                                  className="h-40"
                                                  style={{
                                                      height: "40px",
                                                      marginBottom: "-1px",
                                                  }}
                                              >
                                                  <div
                                                      className="d-inline-block align-middle"
                                                      style={{
                                                          marginTop: "-25px",
                                                      }}
                                                  >
                                                      <div className="d-inline-block">
                                                          <h5>
                                                              {r.denomination}
                                                          </h5>
                                                      </div>
                                                  </div>
                                                  <div
                                                      className="d-inline-block pull-right"
                                                      style={{
                                                          marginTop: "-11px",
                                                      }}
                                                  >
                                                      {r.S_a.length == 0 ? (
                                                          <OverlayTrigger
                                                              overlay={
                                                                  <Tooltip>
                                                                      Nuevo
                                                                  </Tooltip>
                                                              }
                                                          >
                                                              <Dropdown
                                                                  alignRight={
                                                                      true
                                                                  }
                                                                  style={{
                                                                      marginRight:
                                                                          "-9px ",
                                                                  }}
                                                                  onClick={() =>
                                                                      this.openModalActivity(
                                                                          r.denomination,
                                                                          r.id
                                                                      )
                                                                  }
                                                                  className="pull-right "
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
                                                                      }}
                                                                  >
                                                                      <i
                                                                          className="material-icons pull-right mr-n2 mt-n1"
                                                                          style={{
                                                                              color: "#6c757d",
                                                                          }}
                                                                      >
                                                                          add
                                                                      </i>
                                                                  </Dropdown.Toggle>
                                                              </Dropdown>
                                                          </OverlayTrigger>
                                                      ) : (
                                                          <OverlayTrigger
                                                              overlay={
                                                                  <Tooltip>
                                                                      Editar
                                                                  </Tooltip>
                                                              }
                                                          >
                                                              <Dropdown
                                                                  alignRight={
                                                                      true
                                                                  }
                                                                  style={{
                                                                      marginRight:
                                                                          "-9px ",
                                                                  }}
                                                                  onClick={() =>
                                                                      this.openEditModalActivity(
                                                                          r.S_a,
                                                                          r.denomination,
                                                                          r.id
                                                                      )
                                                                  }
                                                                  className="pull-right "
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
                                                      )}
                                                  </div>
                                              </Card.Header>
                                              <Card.Body className="card-task pb-0 pt-0 pl-0 pr-0">
                                                  <Table
                                                      size="sm"
                                                      hover
                                                      responsive
                                                      style={{ width: "100%" }}
                                                  >
                                                      <tbody>
                                                          {r.S_a.length > 0 &&
                                                              r.S_a.map(
                                                                  (k, j) => {
                                                                      if (
                                                                          k.state
                                                                      ) {
                                                                          return (
                                                                              <tr
                                                                                  className="d-flex"
                                                                                  key={
                                                                                      j
                                                                                  }
                                                                              >
                                                                                  <td className="col-1">
                                                                                      <div
                                                                                          className="custom-control custom-switch"
                                                                                          onClick={() =>
                                                                                              this.changeActualActivity(
                                                                                                  i,
                                                                                                  j
                                                                                              )
                                                                                          }
                                                                                      >
                                                                                          <input
                                                                                              type="checkbox"
                                                                                              className="custom-control-input"
                                                                                              id={
                                                                                                  j
                                                                                              }
                                                                                              readOnly
                                                                                              checked={
                                                                                                  k.actual
                                                                                              }
                                                                                              value={
                                                                                                  k.actual
                                                                                              }
                                                                                          />
                                                                                          <label
                                                                                              className="custom-control-label"
                                                                                              htmlFor="customSwitch1"
                                                                                          />
                                                                                      </div>
                                                                                  </td>

                                                                                  <td className="col-2">
                                                                                      <div className="d-inline-block align-middle">
                                                                                          <div className="d-inline-block">
                                                                                              <span className="m-b-0 badge badge-primary">
                                                                                                  {
                                                                                                      k
                                                                                                          .Activity
                                                                                                          .Activity_type
                                                                                                          .denomination
                                                                                                  }
                                                                                              </span>
                                                                                          </div>
                                                                                      </div>
                                                                                  </td>

                                                                                  <td className="col-4">
                                                                                      <div className="d-inline-block align-middle">
                                                                                          <div className="d-inline-block">
                                                                                              <p className="m-b-0">
                                                                                                  {
                                                                                                      k
                                                                                                          .Activity
                                                                                                          .denomination
                                                                                                  }
                                                                                              </p>
                                                                                          </div>
                                                                                      </div>
                                                                                  </td>
                                                                                  <td className="col-5">
                                                                                      <div className="d-inline-block align-middle">
                                                                                          <div className="d-inline-block">
                                                                                              <p>
                                                                                                  {k.date_start
                                                                                                      ? moment(
                                                                                                            k.date_start
                                                                                                        ).format(
                                                                                                            " DD/MM/YYYY "
                                                                                                        ) +
                                                                                                        " - "
                                                                                                      : "No definido "}
                                                                                                  {k.date_end
                                                                                                      ? moment(
                                                                                                            k.date_end
                                                                                                        ).format(
                                                                                                            " DD/MM/YYYY "
                                                                                                        )
                                                                                                      : "No definido "}
                                                                                              </p>
                                                                                              {/*<p className="m-b-0">*/}
                                                                                              {/*    Del {k.date_start ? moment(k.date_start).format('LL').substring(0, moment(k.date_start).format('LL').length - 8) + " " : "No definido "}*/}
                                                                                              {/*    al {k.date_end ? moment(k.date_end).format('LL').substring(0, moment(k.date_end).format('LL').length - 8) : "No definido"}</p>*/}
                                                                                          </div>
                                                                                      </div>
                                                                                  </td>
                                                                              </tr>
                                                                          );
                                                                      } else {
                                                                          return null;
                                                                      }
                                                                  }
                                                              )}
                                                      </tbody>
                                                  </Table>
                                              </Card.Body>
                                          </Card>
                                      );
                                  }
                              )
                            : "No definido"}
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Card>
                            <Card.Header
                                className="h-40"
                                style={{ height: "40px", marginBottom: "-1px" }}
                            >
                                <div
                                    className="d-inline-block align-middle"
                                    style={{ marginTop: "-25px" }}
                                >
                                    <div className="d-inline-block">
                                        <h5>ACTIVIDADES</h5>
                                    </div>
                                </div>
                                <div
                                    className="d-inline-block pull-right"
                                    style={{ marginTop: "-11px" }}
                                >
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>Añadir curso</Tooltip>
                                        }
                                    >
                                        <Dropdown
                                            alignRight={true}
                                            style={{ marginRight: "-9px " }}
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
                                                    style={{ color: "#6c757d" }}
                                                >
                                                    add
                                                </i>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu
                                                as="ul"
                                                className="list-unstyled card-option"
                                            >
                                                <Dropdown.Item
                                                    as="li"
                                                    // onClick={() => this.Course.openModalCourse()}
                                                    className="dropdown-item"
                                                >
                                                    <span type="button">
                                                        <i
                                                            className={
                                                                "feather icon-edit-2"
                                                            }
                                                        />{" "}
                                                        Especifico
                                                    </span>
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    as="li"
                                                    className="dropdown-item"
                                                >
                                                    <span type="button">
                                                        {" "}
                                                        <i
                                                            className={
                                                                "feather icon-eye"
                                                            }
                                                        />{" "}
                                                        General
                                                    </span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </OverlayTrigger>
                                </div>
                            </Card.Header>
                            <Card.Body className="card-task pb-0 pt-0 pl-0 pr-0">
                                <Row>
                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        {activitys.length > 0 &&
                                            activitys.map((r, i) => {
                                                return (
                                                    <Table
                                                        size="sm"
                                                        hover
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        key={i}
                                                    >
                                                        <thead>
                                                            <tr className="d-flex">
                                                                <th className="col-12">
                                                                    {
                                                                        r.denomination
                                                                    }
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {r.Activity.length >
                                                                0 &&
                                                                r.Activity.map(
                                                                    (k, j) => {
                                                                        return (
                                                                            <tr
                                                                                className="d-flex"
                                                                                key={
                                                                                    j
                                                                                }
                                                                            >
                                                                                <td className="col-12">
                                                                                    <div className="d-inline-block align-middle">
                                                                                        <div className="d-inline-block">
                                                                                            <p className="m-b-0">
                                                                                                {
                                                                                                    k.denomination
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                        </tbody>
                                                    </Table>
                                                );
                                            })}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <ModalAcademic
                    listAcademicCalendarActual={this.listAcademicCalendarActual}
                    // listAcademicCalendarActual={() => this.listAcademicCalendarActual()}
                    ref={(ref) => (this.ModalAcademic = ref)}
                />

                <Modal
                    show={modalActivity}
                    onHide={() => this.setState({ modalActivity: false })}
                    size="lg"
                >
                    <Modal.Header style={{ background: "#4680ff" }}>
                        <Modal.Title as="h5" style={{ color: "white" }}>
                            {titleModalSemester}
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
                                        onClick={() =>
                                            this.closeModalActivity()
                                        }
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
                            {activitys.length > 0 &&
                                activitys.map((r, i) => {
                                    return (
                                        <Table
                                            size="sm"
                                            hover
                                            style={{ width: "100%" }}
                                            key={i}
                                        >
                                            <thead>
                                                <tr className="d-flex">
                                                    <th className="col-12">
                                                        {r.denomination}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {r.Activity.length > 0 &&
                                                    r.Activity.map((k, j) => {
                                                        return (
                                                            <tr
                                                                className="d-flex"
                                                                key={j}
                                                                style={{
                                                                    height: "45px",
                                                                }}
                                                            >
                                                                <td className="col-4">
                                                                    <div className="d-inline-block align-middle">
                                                                        <div className="d-inline-block">
                                                                            <label className="check-task custom-control custom-checkbox d-flex ">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="custom-control-input"
                                                                                    id="customCheck2"
                                                                                    onClick={() =>
                                                                                        this.changeModalState(
                                                                                            i,
                                                                                            j
                                                                                        )
                                                                                    }
                                                                                    checked={
                                                                                        k.state
                                                                                    }
                                                                                    value={
                                                                                        k.state
                                                                                    }
                                                                                    readOnly
                                                                                />
                                                                                <p className="custom-control-label m-b-0">
                                                                                    {
                                                                                        k.denomination
                                                                                    }
                                                                                </p>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="col-4">
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
                                                                                k.finish
                                                                            }
                                                                            className="form-control"
                                                                            onChange={this.updateDateModal.bind(
                                                                                this,
                                                                                i,
                                                                                j,
                                                                                "start"
                                                                            )}
                                                                            max="2999-12-31"
                                                                            value={
                                                                                k.date_start
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                </td>
                                                                <td className="col-4">
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
                                                                                k.finish
                                                                            }
                                                                            className="form-control"
                                                                            onChange={this.updateDateModal.bind(
                                                                                this,
                                                                                i,
                                                                                j,
                                                                                "end"
                                                                            )}
                                                                            max="2999-12-31"
                                                                            value={
                                                                                k.date_end
                                                                            }
                                                                        />
                                                                    </Form.Group>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    );
                                })}
                            <Col>
                                {action === "add" ? (
                                    <Button
                                        className="pull-right"
                                        disabled={disabled}
                                        variant="primary"
                                        onClick={() =>
                                            this.saveSemesterActivity()
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
                                        className="pull-right"
                                        disabled={disabled}
                                        variant="primary"
                                        onClick={() =>
                                            this.updateSemesterActivity()
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
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}
