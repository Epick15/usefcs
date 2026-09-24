import React from "react";
import {
    Button,
    Col,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";

import Aux from "../../../../hoc/_Aux";

import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import "moment/locale/es";
import $ from "jquery";
import component from "../../../Component";
import Select from "react-select";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";

moment.locale("es");

class ProgramForm extends React.Component {
    state = {
        organicUnit: component.ORGANIC_UNIT,

        isOpen: false,
        programModal: this.props.programModal,
        programsLoader: false,
        programForm: false,
        documentModal: false,
        loaderAcademicDegree: false,

        action: "add",
        programMask: "",
        programOrganicMask: "",
        titleFormProgram: "NUEVO",
        denomination: "",
        program: "",
        academicDegree: "",
        code: "",
        academicPeriod: "",
        totalPeriod: "",
        organicUnitOrigin: "",
        creditElective: "",
        creditRequired: "",
        description: "",
        descriptionDocument: "",
        // MPT
        abbreviation: "",

        programs: [],
        academicDegrees: [],
        academicPeriods: [],
        unitOrganitOrigins: [],
        documetTypes: [],

        documentTypes: [],
        planModal: false,
        actionPlan: "add",
        actionProgramDocument: "add",
        planMask: "",
        planForm: false,
        titleFormPlan: "",
        fileName: "",
        programCodeDocument: "",
        programDocumentID: "",
        plans: [],
        programDocuments: [],
        organicUnits: [],
        //loaders
    };

    async componentDidMount() {
        this.setState({ organicUnit: { value: component.ORGANIC_UNIT } });
        this.getUnitOrganic();
        this.getAcademicDegree();
        this.getOrganitUnitOrigin();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.programModal !== this.props.programModal) {
            this.setState({ programModal: this.props.programModal });
        }
        if (prevProps.retriveData !== this.props.retriveData) {
            this.props.retriveData &&
                this.retriveProgam(this.props.retriveData);
        }
        if (prevProps.deleteID !== this.props.deleteID) {
            this.props.deleteID !== "" &&
                this.deleteSweetProgram(this.props.deleteID);
        }
        // if (prevProps.plans !== this.props.plans) {
        //     this.setState({plans: this.props.plans})
        // }
    }

    getUnitOrganic() {
        const url = app.general + "/" + app.organicUnit;
        axios
            .get(url, app.headers)
            .then((res) => {
                if (res.data) {
                    res.data.map((record, index) =>
                        this.state.organicUnits.push({
                            value: record.id,
                            label:
                                record.denomination +
                                " " +
                                record.Campu.denomination,
                        })
                    );
                    // this.setState({organicUnits: res.data, showOrganicUnit: true})
                }
            })
            .catch((err) => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Error al obtener unidades orgánicas",
                    delay: 2000,
                });
                console.log(err);
            });
    }

    async getAcademicDegree() {
        this.setState({ loaderAcademicDegree: true });
        const url = app.general + "/" + app.academicDegree;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({ academicDegrees: res.data });

            this.setState({ loaderAcademicDegree: false });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los Grados Academicos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async getOrganitUnitOrigin() {
        this.setState({ loaderAcademicPeriod: true });
        const url = app.general + "/" + app.typeOrganicUnit + "/Facultad/type";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({ unitOrganitOrigins: res.data });

            this.setState({ loaderAcademicPeriod: false });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar las Unidades Organicas",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listDocumentType() {
        const url = app.general + "/" + app.documentType;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({ documentTypes: res.data });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes de estudio",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listProgramDocumentProgram(id_program) {
        this.setState({ programDocumentsLoader: true });
        const url =
            app.programs +
            "/" +
            app.programDocument +
            "/" +
            id_program +
            "/" +
            app.program;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ programDocuments: res.data });
                if (this.state.programDocumentsLoader) {
                    this.setState({ programDocumentsLoader: false });
                }
            }
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los documentos del programa",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async saveProgram() {
        this.setState({ programsLoader: true });
        const {
            denomination,
            organicUnit,
            academicDegree,
            code,
            organicUnitOrigin,
            description,
            // MPT
            abbreviation,
        } = this.state;

        if (
            organicUnit !== "" &&
            denomination !== "" &&
            academicDegree !== "" &&
            code !== "" &&
            organicUnitOrigin !== "" &&
            // MPT
            abbreviation
        ) {
            const url = app.programs + "/" + app.program;
            let data = new FormData();
            data.set("id_unit_organic_origin", organicUnitOrigin);
            data.set("id_unit_organic_register", organicUnit.value);
            data.set("id_academic_degree", academicDegree);
            data.set("code", code);
            data.set("denomination", denomination);
            data.set("description", description);
            data.set("abbreviation", abbreviation);
            try {
                const res = await axios.post(url, data, app.headers);

                this.props.callData();
                this.closeModalProgram();
                this.setState({ programsLoader: false });
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                console.log(err);
                this.setState({ programsLoader: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ programsLoader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async updateProgram() {
        this.setState({ programsLoader: true });
        const {
            denomination,
            organicUnit,
            academicDegree,
            code,
            organicUnitOrigin,
            description,
            // MPT
            abbreviation,
        } = this.state;

        if (
            organicUnit !== "" &&
            denomination !== "" &&
            academicDegree !== "" &&
            code !== "" &&
            organicUnitOrigin !== "" &&
            // MPT
            abbreviation
        ) {
            const url =
                app.programs +
                "/" +
                app.program +
                "/" +
                this.state.actualProgramID;
            let data = new FormData();

            data.set("id_unit_organic_register", organicUnit.value);
            data.set("id_unit_organic_origin", organicUnitOrigin);
            data.set("id_academic_degree", academicDegree);
            data.set("code", code);
            data.set("denomination", denomination);
            data.set("description", description);
            // MPT
            data.set("abbreviation", abbreviation);
            try {
                const res = await axios.patch(url, data, app.headers);

                this.setState({ programsLoader: false });
                this.props.callData();
                this.closeModalProgram();

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                console.log(err);
                this.setState({ programsLoader: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ programsLoader: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async delete(id) {
        this.setState({ programsLoader: true });
        try {
            const url = app.programs + "/" + app.program + "/" + id;
            const res = await axios.delete(url, app.headers);

            this.props.callData();
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
            this.setState({ programsLoader: false });

            return true;
        } catch (err) {
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
            this.setState({ programsLoader: false });
            return false;
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            // MPT
            case "abbreviation":
                this.setState({ abbreviation: event.target.value });
                break;

            case "denomination":
                this.setState({
                    denomination: event.target.value
                        .slice(0, 255)
                });
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
            case "code":
                let code = event.target.value.replace(/[^0-9A-Za-z]/g, "");
                this.setState({ code: code.slice(0, 8).toUpperCase() });
                break;
            case "organicUnit":
                this.setState({
                    organicUnit: { value: event.value, label: event.label },
                });
                break;
            case "program":
                // let program = event.target.childNodes[event.target.value].getAttribute('data-program') || '';
                if (event.target.value !== "false") {
                    let program = $("#program-" + event.target.value).attr(
                        "data-program"
                    );
                    let organic = $("#program-" + event.target.value).attr(
                        "data-organic-unit"
                    );
                    this.setState({
                        program: event.target.value,
                        programMask: program,
                        programOrganicMask: organic,
                        plan: "",
                    });
                    this.listPlanByProgramID(event.target.value);
                }
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
                this.setState({
                    descriptionPlan: event.target.value.replace(
                        /[^0-9A-Za-záéíóúüÁÉÍÓÚÜ ]/g,
                        ""
                    ),
                });
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
                this.setState({ creditRequired: creditRequired.slice(0, 2) });
                break;
            case "creditElective":
                let creditElective = event.target.value.replace(/[^0-9]/g, "");
                this.setState({ creditElective: creditElective.slice(0, 2) });
                break;
            default:
                break;
        }
    };

    // cerrar Profile y abir busqueda
    openModalProgram = () => {
        this.setState({
            programModal: true,
            action: "add",
            plan: "",
            program: "",
        });
    };
    closeModalProgram = () => {
        this.props.closeForm();
        this.setState({
            programModal: false,
            action: "add",
            titleFormProgram: "NUEVO",
            actualProgramID: "",
            organicUnitOrigin: "",
            academicDegree: "",
            code: "",
            denomination: "",
            description: "",
        });
    };

    deleteSweetProgram = async (id) => {
        try {
            const alert = await Swal.fire({
                title: "Estás seguro?",
                text: "Este paso es irreversible!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Eliminar!",
                cancelButtonText: "No, Cancelar",
            });
            alert.isConfirmed ? await this.delete(id) : this.props.closeForm();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };
    retriveProgam = (r) => {
        this.setState({
            action: "updateProgram",
            titleFormProgram: "EDITAR",
            programModal: true,
            actualProgramID: r.id,
            organicUnit: {
                value: r.id_unit_organic_register,
                label: r.Organic_unit_register.denomination,
            },
            organicUnitOrigin: r.id_unit_organic_origin,
            academicDegree: r.id_academic_degree,
            academicPeriod: r.id_academic_period,
            code: r.code,
            totalPeriod: r.cant_period,
            denomination: r.denomination,
            creditElective: r.credit_elective,
            creditRequired: r.credit_required,
            description: r.description,
            // MPT
            abbreviation: r.abbreviation,
        });
    };

    render() {
        const { programModal, organicUnits, titleFormProgram } = this.state;
        const { organicUnit, action } = this.state;
        const { academicDegrees, unitOrganitOrigins } = this.state;
        const {
            denomination,
            academicDegree,
            code,
            organicUnitOrigin,
            description,
            // MPT
            abbreviation,
        } = this.state;

        return (
            <Aux>
                <Modal show={programModal} size={"xl"} backdrop="static">
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                            {titleFormProgram} PROGRAMA
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
                                    onClick={() => this.closeModalProgram()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            {!component.ORGANIC_UNIT && (
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Group
                                        className="form-group fill "
                                        style={{ zIndex: 10000 }}
                                    >
                                        <Form.Label
                                            className="floating-label"
                                            style={
                                                organicUnit === ""
                                                    ? { color: "#ff5252 " }
                                                    : null
                                            }
                                        >
                                            Unidada organica{" "}
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Select
                                            isSearchable
                                            value={organicUnit}
                                            name="organicUnit"
                                            options={organicUnits}
                                            classNamePrefix="select"
                                            // isLoading={coursesLoader}
                                            className="basic-single"
                                            placeholder="Buscar unidad organica"
                                            onChange={this.handleChange(
                                                "organicUnit"
                                            )}
                                            styles={component.selectSearchStyle}
                                        />
                                    </Form.Group>
                                    <br />
                                </Col>
                            )}
                            <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            denomination === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Nombre del programa{" "}
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={denomination}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange(
                                            "denomination"
                                        )}
                                        placeholder="Nombre del programa"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
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
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange(
                                            "abbreviation"
                                        )}
                                        placeholder="Abreviatura"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            academicDegree === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Grado academico expedido
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={academicDegree}
                                        onChange={this.handleChange(
                                            "academicDegree"
                                        )}
                                    >
                                        <option defaultValue={true} hidden>
                                            Seleccione
                                        </option>
                                        {academicDegrees.length > 0 ? (
                                            academicDegrees &&
                                            academicDegrees.map((r, index) => (
                                                <option
                                                    value={r.id}
                                                    key={index}
                                                >
                                                    {r.denomination +
                                                        " - " +
                                                        r.abbreviation}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>
                                                No hay registros
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            organicUnitOrigin === ""
                                                ? { color: "#ff5252 " }
                                                : null
                                        }
                                    >
                                        Facultad
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={organicUnitOrigin}
                                        onChange={this.handleChange(
                                            "organicUnitOrigin"
                                        )}
                                    >
                                        <option defaultValue={true} hidden>
                                            Selecione
                                        </option>
                                        {unitOrganitOrigins.length > 0 ? (
                                            unitOrganitOrigins &&
                                            unitOrganitOrigins.map(
                                                (r, index) => (
                                                    <option
                                                        value={r.id}
                                                        key={index}
                                                    >
                                                        {r.denomination}
                                                    </option>
                                                )
                                            )
                                        ) : (
                                            <option disabled>
                                                No hay registros
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        style={
                                            code === ""
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
                                        value={code}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange("code")}
                                        placeholder="Codigo"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">
                                        Observación
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        onKeyPress={this.handleKeyPress}
                                        value={description}
                                        onChange={this.handleChange(
                                            "description"
                                        )}
                                        placeholder="Ingrese descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                {action === "add" ? (
                                    <Button
                                        className="pull-right"
                                        disabled={this.state.programsLoader}
                                        variant="primary"
                                        onClick={() => this.saveProgram()}
                                    >
                                        {this.state.programsLoader &&
                                            component.spin}
                                        Guardar
                                    </Button>
                                ) : (
                                    <Button
                                        className="pull-right"
                                        disabled={this.state.programsLoader}
                                        variant="primary"
                                        onClick={() => this.updateProgram()}
                                    >
                                        {this.state.programsLoader &&
                                            component.spin}
                                        Guardar Cambios
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Aux>
        );
    }
}

export default ProgramForm;
