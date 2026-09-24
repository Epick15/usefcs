import React, { Component } from "react";
import { withRouter } from "react-router";
import PNotify from "pnotify/dist/es/PNotify";
import {
    Row,
    Col,
    Form,
    OverlayTrigger,
    Tooltip,
    Button,
    Modal,
} from "react-bootstrap";
import moment from "moment";
import $ from "jquery";
import crypt from "node-cryptex";

import TitleModule from "../../../TitleModule";
import app from "../../../Constants";
import axios from "axios";
import component from "../../../Component";
import Swal from "sweetalert2";

import Close from "@material-ui/icons/Close";
import Cycle from "../Components/Cycle";

import Course from "../Components/Course";
import DataTable from "./DataTable";

moment.locale("es");
const k = new Buffer(32);
const v = new Buffer(16);

class StudyPlan extends Component {
    state = {
        activity: "Admisión",
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        programID: "",
        plan: "",
        titleModule: "",
        studyPlanLoader: false,
        courseForm: false,
        mesh: false,

        planModal: false,
        actionPlan: "add",
        planMask: "",
        planForm: false,
        titleFormPlan: "",
        plans: [],
        academicPeriods: [],

        creditElective: 0,
        creditRequired: 0,
        codePlan: "",
        descriptionPlan: "",
    };

    async componentDidMount() {
        const programID = atob(this.props.match.params.id);
        this.setState({ programID: programID });
        this.listProgramIDPlan(programID);
        this.getAcademicPeriod();
    }

    async listProgramIDPlan(id) {
        this.setState({ studyPlanLoader: true });
        const url = app.programs + "/" + app.program + "/" + id + "/study-plan";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    titleModule: res.data.denomination,
                    plans: res.data.Plans,
                    // MPT
                    abbreviationProgram: res.data.abbreviation,
                });
            this.setState({ studyPlanLoader: false });
        } catch (err) {
            this.setState({ studyPlanLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes de estudio",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async getAcademicPeriod() {
        this.setState({ loaderAcademicPeriod: true });
        const url = app.general + "/" + app.academicPeriod;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({ academicPeriods: res.data });
            this.setState({ loaderAcademicPeriod: false });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los Periodos Academicos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async destroyPlan(id) {
        try {
            this.setState({ studyPlanLoader: true });
            const url = app.programs + "/" + app.plan + "/" + id;
            const res = await axios.delete(url, app.headers);

            PNotify.success({
                title: "Finalizado",
                text: res.data,
                delay: 2000,
            });
            this.setState({ studyPlanLoader: false });
            this.listProgramIDPlan(this.state.programID);
            return true;
        } catch (err) {
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
            this.setState({ studyPlanLoader: false });
            return false;
        }
    }

    async createPlan() {
        this.setState({ studyPlanLoader: true });

        const { programID, codePlan, creditRequired, descriptionPlan, mesh } =
            this.state;

        if (
            programID !== "" &&
            codePlan !== "" &&
            creditRequired !== "" &&
            descriptionPlan !== "" &&
            mesh !== ""
        ) {
            const url = app.programs + "/" + app.plan;
            let data = new FormData();

            data.set("id_program", programID);
            // data.set("id_academic_period", academicPeriod);
            data.set("code", codePlan);
            data.set("mesh", mesh);
            // data.set("cant_period", totalPeriod);

            data.set("credit_required", creditRequired);
            data.set("description", descriptionPlan);
            data.set(
                "cycles",
                crypt.encrypt(JSON.stringify(this.Cycle.returnCycle()), k, v)
            );

            try {
                const res = await axios.post(url, data, app.headers);

                this.listProgramIDPlan(this.state.programID);
                this.closeFormPlan();
                this.setState({ studyPlanLoader: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                console.log(err);
                this.setState({ studyPlanLoader: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ studyPlanLoader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async updatePlan() {
        this.setState({ studyPlanLoader: true });
        const {
            creditElective,
            codePlan,
            creditRequired,
            descriptionPlan,
            mesh,
        } = this.state;

        if (
            codePlan !== "" &&
            creditElective !== "" &&
            creditRequired !== "" &&
            descriptionPlan !== "" &&
            mesh !== ""
        ) {
            const url =
                app.programs + "/" + app.plan + "/" + this.state.actualPlanID;
            let data = new FormData();

            data.set("credit_elective", creditElective);
            data.set("code", codePlan);
            // data.set("state", true);
            data.set("credit_required", creditRequired);
            data.set("description", descriptionPlan);
            data.set("mesh", mesh);
            data.set(
                "cycles",
                crypt.encrypt(JSON.stringify(this.Cycle.returnCycle()), k, v)
            );
            try {
                const res = await axios.patch(url, data, app.headers);
                this.listProgramIDPlan(this.state.programID);
                this.closeFormPlan();
                this.setState({ studyPlanLoader: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                console.log(err);
                this.setState({ studyPlanLoader: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ studyPlanLoader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async updateActualPlan(planID) {
        this.setState({ studyPlanLoader: true });
        if (planID !== "") {
            const url =
                app.programs +
                "/" +
                app.plan +
                "/" +
                this.state.programID +
                "/actual";
            let data = new FormData();
            data.set("id_plan", planID);
            try {
                const res = await axios.patch(url, data, app.headers);
                this.setState({
                    studyPlanLoader: false,
                    plans: res.data.record,
                });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                console.log(err);
                this.setState({ studyPlanLoader: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ studyPlanLoader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "denomination":
                this.setState({ denomination: event.target.value });
                break;
            case "organicUnitOrigin":
                this.setState({ organicUnitOrigin: event.target.value });
                break;

            case "academicPeriod":
                this.setState({ academicPeriod: event.target.value });
                break;
            case "description":
                this.setState({ description: event.target.value });
                break;

            case "academicDegree":
                this.setState({ academicDegree: event.target.value });
                break;
            case "mesh":
                this.setState({ mesh: event.target.value });
                break;
            case "code":
                let code = event.target.value.replace(/[^0-9A-Za-z]/g, "");
                this.setState({ code: code.slice(0, 6).toUpperCase() });
                break;

            case "plan":
                if (event.target.value !== "false") {
                    let plan = $("#plan-" + event.target.value).attr(
                        "data-plan"
                    );
                    this.setState({ plan: event.target.value, planMask: plan });
                }

                break;
            case "descriptionPlan":
                let descriptionPlan = event.target.value
                    .slice(0, 255)
                    .toUpperCase();
                this.setState({ descriptionPlan: descriptionPlan });
                break;
            case "codePlan":
                let codePlan = event.target.value.replace(/[^0-9A-Za-z]/g, "");
                this.setState({ codePlan: codePlan.slice(0, 6).toUpperCase() });
                break;
            case "totalPeriod":
                let totalPeriod = event.target.value.replace(/[^0-9]/g, "");
                this.setState({ totalPeriod: totalPeriod.slice(0, 2) });
                break;
            case "creditRequired":
                let creditRequired = event.target.value.replace(/[^0-9]/g, "");
                this.setState({ creditRequired: creditRequired.slice(0, 3) });
                break;
            case "creditElective":
                let creditElective = event.target.value.replace(/[^0-9]/g, "");
                this.setState({ creditElective: creditElective.slice(0, 2) });
                break;

            case "documentType":
                this.setState({ documentType: event.target.value });
                break;
            case "descriptionDocument":
                this.setState({ descriptionDocument: event.target.value });
                break;
            default:
                break;
        }
    };
    openModalPlan = () => {
        this.setState({
            planModal: true,
            actionPlan: "add",
            plan: "",
        });
    };

    deleteSweetPlan = (id, state) => {
        Swal.fire({
            icon: "warning",
            title: state ? "Eliminar Plan" : "Habilitar Plan",
            text: state
                ? "No podra gestionar datos de este plan"
                : "Gestionar datos del plan",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: state ? "Si, Eliminar" : "Si, Habilitar",
        }).then((result) => {
            if (result.value) {
                this.destroyPlan(id);
            }
        });
    };
    closeFormPlan = () => {
        this.setState({
            planForm: false,
            action: "add",
            titleFormPlan: "",
            actualPlanID: "",
            descriptionPlan: "",
            planModal: false,

            academicPeriod: "",
            codePlan: "",
            totalPeriod: "",

            creditElective: "",
            creditRequired: "",
        });
    };
    retrivePlan = (r) => {
        this.setState({
            actionPlan: "update",
            titleFormPlan: "Editar",
            planModal: true,
            actualPlanID: r.id,

            academicPeriod: r.id_academic_period,

            codePlan: r.code,
            totalPeriod: r.cant_period,
            descriptionPlan: r.description,
            mesh: r.mesh,
            creditElective: r.credit_elective,
            creditRequired: r.credit_required,
        });
    };

    updateProgramCourseForCycle = () => {
        this.Course.getCycleCurse(this.state.program);
    };
    openFormCourse = (r) => {
        this.setState({
            courseForm: !this.state.courseForm,
            plan: r.id,
            planMask: r.description,
            // MPT
            planCode: r.code,
            planName: r.description
        });
    };
    closeFormCourse = () => {
        this.setState({
            courseForm: !this.state.courseForm,
            plan: "",
            planMask: "",
        });
    };
    actualPlan = (id) => {
        this.updateActualPlan(id);
    };

    render() {
        const { titleModule } = this.state;
        const { planModal, planMask, actionPlan, descriptionPlan } = this.state;

        const { codePlan, totalPeriod, creditElective, mesh, creditRequired } =
            this.state;
        return (
            <>
                <TitleModule
                    actualTitle={titleModule}
                    actualModule={"PLANES DE ESTUDIO"}
                    fatherModuleUrl={"/programs"}
                    fatherModuleTitle={"PROGRAMAS"}
                    fatherModule2Url={""}
                    fatherModule2Title={""}
                />

                {this.state.courseForm ? (
                    <Row>
                        <Col xs={12} sm={12} md={12} xl={12} lg={12}>
                            <Row>
                                <Col xs={12} sm={12} md={12} xl={12} lg={12}>
                                    <Row>
                                        <Col
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            className="filter-bar"
                                        >
                                            <nav className="navbar m-b-30 p-10">
                                                <ul className="nav">
                                                    <li className="nav-item f-text active">
                                                        <h5> {planMask}</h5>
                                                    </li>
                                                </ul>
                                                <div className="nav-item nav-grid f-view">
                                                    <OverlayTrigger
                                                        overlay={
                                                            <Tooltip>
                                                                Cerrar
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <button
                                                            style={{
                                                                marginRight:
                                                                    "8px",
                                                            }}
                                                            onClick={() =>
                                                                this.closeFormCourse()
                                                            }
                                                            type="button"
                                                            className="btn-icon btn btn-dark"
                                                        >
                                                            <Close />
                                                        </button>
                                                    </OverlayTrigger>
                                                </div>
                                            </nav>
                                        </Col>
                                    </Row>
                                    <Course
                                        planId={this.state.plan}
                                        planCode={this.state.planCode}
                                        planName={this.state.planName}
                                        ref={(ref) => (this.Course = ref)}
                                        // MPT
                                        abbreviationProgram={
                                            this.state.abbreviationProgram
                                        }
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                ) : (
                    <div style={{ position: "relative" }}>
                        {this.state.studyPlanLoader && component.spiner}
                        <DataTable
                            actualPlan={this.actualPlan}
                            records={this.state.plans}
                            openModalPlan={this.openModalPlan}
                            retrivePlan={this.retrivePlan}
                            deleteSweetPlan={this.deleteSweetPlan}
                            openFormCourse={this.openFormCourse}
                        />
                    </div>
                )}

                <Modal show={planModal} size={"xl"} backdrop="static">
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                            PLANES DE ESTUDIO
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
                                    onClick={() => this.closeFormPlan()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            descriptionPlan === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Nombre del plan
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={descriptionPlan}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange(
                                            "descriptionPlan"
                                        )}
                                        placeholder="Ejemplo : PLAN DE ESTUDIO + AÑO + PROCESO"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            codePlan === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Codigo
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={codePlan}
                                        onChange={this.handleChange("codePlan")}
                                        placeholder="Codigo"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            {/*<Col xs={12} sm={12} md={2} lg={2} xl={2}>*/}
                            {/*    <Form.Group className="form-group fill">*/}
                            {/*        <Form.Label className="floating-label" style={creditElective === "" ? {color: "#ff5252 "} : null}>*/}
                            {/*            Creditos electivos*/}
                            {/*            <small className="text-danger"> *</small>*/}
                            {/*        </Form.Label>*/}

                            {/*        <Form.Control*/}
                            {/*            type="number"*/}
                            {/*            min="0"*/}
                            {/*            onKeyPress={this.handleKeyPress}*/}
                            {/*            value={creditElective}*/}
                            {/*            onChange={this.handleChange('creditElective')}*/}
                            {/*            placeholder="Creditos electivos"*/}
                            {/*            margin="normal"*/}
                            {/*        />*/}
                            {/*    </Form.Group>*/}
                            {/*</Col>*/}
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            creditRequired === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Creditos obligatorios
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        onKeyPress={this.handleKeyPress}
                                        value={creditRequired}
                                        onChange={this.handleChange(
                                            "creditRequired"
                                        )}
                                        placeholder="Creditos obligatorios"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            mesh === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Cuenta con malla ?
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={mesh}
                                        onChange={this.handleChange("mesh")}
                                    >
                                        <option defaultValue={true} hidden>
                                            Genero
                                        </option>
                                        <option value={true}> Si</option>
                                        <option value={false}> No</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Row>
                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Cycle
                                            totalPeriod={totalPeriod}
                                            program={this.state.actualPlanID}
                                            updateProgramCourseForCycle={
                                                this.updateProgramCourseForCycle
                                            }
                                            ref={(ref) => (this.Cycle = ref)}
                                        />
                                    </Col>
                                </Row>
                            </Col>

                            <Col>
                                {actionPlan === "add" ? (
                                    <Button
                                        className="pull-right"
                                        disabled={this.state.studyPlanLoader}
                                        variant="primary"
                                        onClick={() => this.createPlan()}
                                    >
                                        {this.state.studyPlanLoader &&
                                            component.spin}
                                        Guardar
                                    </Button>
                                ) : (
                                    <Button
                                        className="pull-right"
                                        disabled={this.state.studyPlanLoader}
                                        variant="primary"
                                        onClick={() => this.updatePlan()}
                                    >
                                        {this.state.studyPlanLoader &&
                                            component.spin}
                                        Guardar Cambios
                                    </Button>
                                )}
                                {/*<Button*/}
                                {/*    className="pull-right mr-1"*/}
                                {/*    disabled={this.state.studyPlanLoader}*/}
                                {/*    variant="danger"*/}
                                {/*    onClick={() => this.closeFormPlan()}>*/}
                                {/*    Cerrar</Button>*/}
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default withRouter(StudyPlan);
