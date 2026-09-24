import React, { useState, useEffect } from "react";
import {
    Button,
    Col,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";

import defaultPhoto from "../../../../assets/images/user/default.jpg";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import "moment/locale/es";
import $ from "jquery";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { alignPropType } from "react-bootstrap/esm/DropdownMenu";
import { Sort } from "@material-ui/icons";

moment.locale("es");

const FormChangeProgram = (props) => {
    let listPrograms = props.listPrograms;
    let isShown = props.isShown;
    let organicUnitId = props.organicUnitId;
    let personId = props.personId;
    let lastProgramId = props.lastProgramId;

    const [programId, setProgramId] = useState("");
    const [admissionPlanId, setAdmissionPlaId] = useState("");
    const [studyPlanId, setStudyPlanId] = useState("");

    const [admissionPlanLoader, setAdmissionPlanLoader] = useState(false);
    const [listAdmissionPlans, setListAdmissionPlans] = useState([]);
    const [costAdmissionPlanId, setCostAdmissionPlanId] = useState("");
    const [conceptId, setConceptId] = useState("");
    // const [listCostsAdmissionPlan, setListCostsAdmissionPlan] = useState([]);
    const [studyPlanDescription, setStudyPlanDescription] = useState("");
    const [semesterId, setSemesterId] = useState("");

    useEffect(() => {
        setStudyPlanDescription("");
    }, [programId]);

    const handleChange = (field) => (event) => {
        switch (field) {
            case "programId":
                setProgramId(event.target.value);
                toListAdmissionPlans(event.target.value);
                break;
            case "admissionPlanId":
                setAdmissionPlaId(event.target.value);
                toListConceptsInscription(event.target.value);
                let element = document.getElementById(
                    "admission-plan-form-" + event.target.value
                );
                // Obtiene planId, description y semesterId a partir del selector de planes de admision
                let dataId = element.dataset.studyPlanId;
                setStudyPlanId(dataId);
                let dataDescription = element.dataset.studyPlanDescription;
                setStudyPlanDescription(dataDescription);
                let dataSemesterId = element.dataset.semesterId;
                setSemesterId(dataSemesterId);
                break;
            default:
                break;
        }
    };

    const closeForm = () => {
        props.closeForm();
        setProgramId("");
        setAdmissionPlaId("");
        setStudyPlanDescription("");
    };

    // FUNCIONES
    const toListAdmissionPlans = async (id_program) => {
        setAdmissionPlanLoader(true);
        const url =
            app.programs +
            "/" +
            app.admissionPlan +
            "/" +
            app.program +
            "/" +
            id_program +
            "/s";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                console.log(res.data);
                // Ordenamos en descendente y obtenemos el primero(ultimo)
                let last = res.data.sort((a, b) => b.id - a.id)[0];
                // Añadimos nuevamente a un array de un solo elmento
                setListAdmissionPlans([last]);
            }
            setAdmissionPlanLoader(false);
        } catch (err) {
            setAdmissionPlanLoader(false);
        }
    };

    const toListConceptsInscription = async (id_admission_plan) => {
        // this.setState({ costAdmissionLoader: true });
        const url =
            app.general +
            "/" +
            app.concepts +
            "/inscription/" +
            id_admission_plan +
            "/web";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                setCostAdmissionPlanId(res.data[0].id);
                setConceptId(res.data[0].Concept.id);
            }
        } catch (err) {}
    };

    // FORMULARIO PARA CAMBIAR (CREAR) NUEVO ESTUDIANTE EN UN PROGRAMA
    const [studentForm, setStudentForm] = useState({
        organicUnitId: "",
        admissionPlanId: "",
        costAdmissionPlanId: "",
        conceptId: "",
        programId: "",
        studyPlanId: "",
        semesterId: "",
        personId: "",
        discount: false,
        lastProgramId: "",
    });

    useEffect(() => {
        setStudentForm({
            organicUnitId: organicUnitId,
            admissionPlanId: Number(admissionPlanId),
            costAdmissionPlanId: costAdmissionPlanId,
            conceptId: conceptId,
            programId: Number(programId),
            studyPlanId: Number(studyPlanId),
            personId: personId,
            semesterId: Number(semesterId),
            discount: false,
            lastProgramId: Number(lastProgramId),
        });
    }, [
        organicUnitId,
        admissionPlanId,
        costAdmissionPlanId,
        conceptId,
        programId,
        studyPlanId,
        personId,
        semesterId,
        lastProgramId,
    ]);

    console.log(studentForm);
    const changeProgram = async () => {
        // this.setState({ loaderPerson: true });
        const url = app.person + "/" + app.student + "/change-program";
        if (
            studentForm.organicUnitId !== "" &&
            studentForm.admissionPlanId !== "" &&
            studentForm.costAdmissionPlanId !== "" &&
            studentForm.conceptId !== "" &&
            studentForm.programId !== "" &&
            studentForm.studyPlanId !== "" &&
            studentForm.personId !== "" &&
            studentForm.semesterId !== "" &&
            studentForm.lastProgramId
        ) {
            let data = new FormData();
            data.set("id_organic_unit", studentForm.organicUnitId);
            data.set("id_admission_plan", studentForm.admissionPlanId);
            data.set("id_cost_admission", studentForm.costAdmissionPlanId);
            data.set("id_concept", studentForm.conceptId);
            data.set("id_program", studentForm.programId);
            data.set("id_plan", studentForm.studyPlanId);
            data.set("id_person", studentForm.personId);
            data.set("id_semester", studentForm.semesterId);
            data.set("discount", studentForm.discount);
            data.set("id_last_program", studentForm.lastProgramId)

            try {
                const res = await axios.post(url, data, app.headers);

                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });

                // this.setState({ loaderPerson: false });
                closeForm();
            } catch (err) {
                // this.setState({ loaderPerson: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.error,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderPerson: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000,
            });
        }
    };

    return (
        <Modal
            show={isShown}
            size={"lg"}
            backdrop="static"
            style={{ zIndex: "100000" }}
        >
            <Modal.Header className="bg-primary">
                <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                    CAMBIAR DE PROGRAMA
                </Modal.Title>
                <div className="d-inline-block pull-right">
                    <OverlayTrigger
                        overlay={
                            <Tooltip style={{ zIndex: 100000000 }}>
                                Cerrar
                            </Tooltip>
                        }
                    >
                        <Close style={{ color: "white" }} onClick={closeForm} />
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
                                    programId === ""
                                        ? { color: "#ff5252 " }
                                        : null
                                }
                            >
                                Programa
                                <small className="text-danger"> *</small>
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={programId}
                                onChange={handleChange("programId")}
                            >
                                <option defaultValue={true} hidden>
                                    Programa
                                </option>
                                {listPrograms.length > 0 ? (
                                    listPrograms.map((r, k) => {
                                        return (
                                            <option
                                                id={
                                                    "program-description-form-" +
                                                    r.id
                                                }
                                                value={r.id}
                                                key={k}
                                            >
                                                {r.denomination}
                                            </option>
                                        );
                                    })
                                ) : (
                                    <option value={false} disabled>
                                        No se encontraron datos
                                    </option>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Form.Group className="form-group fill">
                            <Form.Label className="floating-label">
                                Plan de admision
                                <small className="text-danger"> *</small>
                            </Form.Label>
                            {admissionPlanLoader ? (
                                <span
                                    className="spinner-border spinner-border-sm mr-1"
                                    role="status"
                                />
                            ) : (
                                <Form.Control
                                    as="select"
                                    value={admissionPlanId}
                                    onChange={handleChange("admissionPlanId")}
                                >
                                    <option defaultValue={true} hidden>
                                        Plan de admision
                                    </option>
                                    {listAdmissionPlans.length > 0 ? (
                                        listAdmissionPlans.map((r, k) => (
                                            <option
                                                id={
                                                    "admission-plan-form-" +
                                                    r.id
                                                }
                                                data-study-plan-id={r.id_plan}
                                                data-study-plan-description={
                                                    r.Plan.description
                                                }
                                                data-semester-id={r.id_process}
                                                value={r.id}
                                                key={k}
                                            >
                                                {r.description}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={false} disabled>
                                            No se encontraron datos
                                        </option>
                                    )}
                                </Form.Control>
                            )}
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                        <Form.Group className="form-group fill">
                            <Form.Label className="floating-label">
                                Plan de estudio{" "}
                                <small className="text-danger"> *</small>
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Plan de estudio"
                                id="studyPlanDescription"
                                value={studyPlanDescription}
                                disabled={true}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        {admissionPlanId != "" && (
                            <Button
                                className="pull-right"
                                // disabled={this.state.loaderPerson}
                                variant="primary"
                                onClick={changeProgram}
                            >
                                Cambiar programa
                            </Button>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default FormChangeProgram;
