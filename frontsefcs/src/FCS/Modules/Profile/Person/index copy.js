import React, { Component } from "react";
import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Tabs,
    Tab,
    OverlayTrigger,
    Tooltip,
    Form,
    Modal,
} from "react-bootstrap";

import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Aux from "../../../../hoc/_Aux";
import app from "../../../Constants";

import ProfileForm from "../Form";

import moment from "moment";

import TitleModule from "../../../TitleModule";
import component from "../../../Component";
import preview from "../../../../assets/images/user/default.jpg";
import GetApp from "@material-ui/icons/GetApp";
import Edit from "@material-ui/icons/Edit";
import Book from "@material-ui/icons/Book";

moment.locale("es");

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ORGANIC_UNIT: component.ORGANIC_UNIT,
            form: false,
            modalObservation: false,
            PERSONID: "",
            ALLDATAPERSON: "",

            observation: "",
            user: "",
            namePerson: "",
            name: "",
            paternal: "",
            maternal: "",
            documentNumber: "",
            gender: "",
            birthDate: "",
            email: "",
            civilStatu: "",
            civilStatuMask: "",
            photo: preview,
            address: "",
            cellPhone: "",

            birthUbigeoMask: "",
            birthDepartment: "",
            birthProvince: "",
            birthDistrict: "",

            residentUbigeoMask: "",
            residentDeparmet: "",
            residentProvince: "",
            residentDistrict: "",
            students: [],
        };
    }

    componentDidMount() {
        this.listCountry();

        const PERSONID = atob(this.props.match.params.id);

        this.setState({
            PERSONID: PERSONID,
        });
        this.retrivePersonProfileGOD(PERSONID);
        this.retrivePersonStudentProgram(PERSONID);
    }

    async retrivePersonProfile(id, ORGANIC_UNIT) {
        this.setState({ profileLoader: true });
        const url =
            app.person + "/" + app.persons + "/" + app.profile + "/" + id;
        try {
            let data = new FormData();
            data.set("id_organic_unit", ORGANIC_UNIT);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                this.setData(res.data);
            }

            this.setState({ profileLoader: false });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
            this.setState({ profileLoader: false });
        }
    }

    async retrivePersonStudentProgram(id) {
        this.setState({ profileLoader: true });
        const url =
            app.person + "/" + app.persons + "/" + app.student + "/data/" + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ students: res.data });
            }

            this.setState({ profileLoader: false });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
            this.setState({ profileLoader: false });
        }
    }

    async retrivePersonProfileGOD(id) {
        this.setState({ profileLoader: true });
        const url =
            app.person +
            "/" +
            app.persons +
            "/" +
            app.profile +
            "/" +
            id +
            "/g";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setData(res.data);
            }

            this.setState({ profileLoader: false });
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
            this.setState({ profileLoader: false });
        }
    }

    setData = (r) => {
        let namePerson = r.name + " " + r.paternal + " " + r.maternal;
        this.setState({
            ALLDATAPERSON: r,
            namePerson: namePerson,
            name: r.name,
            paternal: r.paternal,
            maternal: r.maternal,
            documentNumber: r.document_number,
            gender: r.gender,
            birthDate: r.birth_date,
            email: r.email,
            civilStatu: r.id_civil_status,
            photo: r.photo
                ? app.server + app.personPhotography + r.photo
                : preview,
            address: r.address,
            cellPhone: r.cell_phone,

            birthCountry: r.Districts_birth.Province.Department.Country.id,
            birthDepartment: r.Districts_birth.Province.Department.id,
            birthProvince: r.Districts_birth.Province.id,
            birthDistrict: r.Districts_birth.id,

            birthCountryMask:
                r.Districts_birth.Province.Department.Country.description,
            birthDepartmentMaks:
                r.Districts_birth.Province.Department.description,
            birthProvinceMask: r.Districts_birth.Province.description,
            birthDistrictMaks: r.Districts_birth.description,

            resideCountry: r.Districts_reside.Province.Department.Country.id,
            resideDepartment: r.Districts_reside.Province.Department.id,
            resideProvince: r.Districts_reside.Province.id,
            resideDistrict: r.Districts_reside.id,

            resideCountryMask:
                r.Districts_reside.Province.Department.Country.description,
            resideDepartmentMask:
                r.Districts_reside.Province.Department.description,
            resideProvinceMaks: r.Districts_reside.Province.description,
            resideDistrictMaks: r.Districts_reside.description,
            residentDistrict: r.id_ubigeo_resident,
        });
    };

    //PAIS
    async listCountry() {
        this.setState({ loaderDataCountry: true });
        const url = app.general + "/" + app.country;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({ countrys: res.data });
            if (this.state.loaderDataCountry) {
                this.setState({ loaderDataCountry: false });
            }
        } catch (err) {
            PNotify.error({ title: "Oh no!", text: err.response, delay: 2000 });
            console.log(err);
        }
    }

    async reportAcademicRecord(id_student) {
        this.setState({ registrationDataLoader: true });
        const url = app.general + "/report-academic-record/" + id_student;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) component.pdfReportAutoTableRercordAcademic(res.data);

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    closeForm = () => {
        this.setState({ form: false });
    };
    callData = async () => {
        if (component.ORGANIC_UNIT !== "") {
            this.retrivePersonProfile(
                this.state.PERSONID,
                component.ORGANIC_UNIT
            );
        } else {
            this.retrivePersonProfileGOD(this.state.PERSONID);
        }
    };
    downloadPdf = (id_student) => {
        this.reportAcademicRecord(id_student);
    };
    openModalObservation = (r) => {
        this.setState({
            modalObservation: true,
            observationID: r.id,
            observation: r.observation,
        });
    };
    closeModalObservation = () => {
        this.setState({
            modalObservation: false,
            observationID: "",
            observation: "",
        });
    };
    handleChange = (field) => (event) => {
        switch (field) {
            case "observation":
                this.setState({ observation: event.target.value });
                break;
            default:
                break;
        }
    };

    updateObservationStudent() {
        this.setState({ loaderPerson: true });
        const url =
            app.person +
            "/" +
            app.student +
            "/observation-update/" +
            this.state.observationID;
        const { observation } = this.state;

        if (observation !== "") {
            let data = new FormData();
            data.set("observation", observation);
            axios
                .patch(url, data, app.headers)
                .then((res) => {
                    PNotify.success({
                        title: "Finalizado",
                        text: "Datos registrados correctamente",
                        delay: 2000,
                    });

                    this.closeModalObservation();
                    this.retrivePersonStudentProgram(this.state.PERSONID);
                })
                .catch((err) => {
                    this.setState({ loaderPerson: false });
                    PNotify.error({
                        title: "Oh no!",
                        text: err.response.data.message,
                        delay: 3000,
                    });
                });
        } else {
            this.setState({ loaderPerson: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000,
            });
        }
    }

    render() {
        const {
            resideCountryMask,
            resideDepartmentMask,
            resideProvinceMaks,
            resideDistrictMaks,
            birthCountryMask,
            birthDepartmentMaks,
            birthProvinceMask,
            birthDistrictMaks,
        } = this.state;
        let residencia =
            resideCountryMask +
            " - " +
            resideDepartmentMask +
            " - " +
            resideProvinceMaks +
            " - " +
            resideDistrictMaks;
        let nacimiento =
            birthCountryMask +
            " - " +
            birthDepartmentMaks +
            " - " +
            birthProvinceMask +
            " - " +
            birthDistrictMaks;
        const {
            documentNumber,
            gender,
            birthDate,
            email,
            photo,
            address,
            cellPhone,
            modalObservation,
            observation,
        } = this.state;
        return (
            <Aux>
                <TitleModule
                    actualTitle={this.state.namePerson}
                    actualModule={"PERSONA"}
                    fatherModuleUrl={"/profile"}
                    fatherModuleTitle={"PERFIL"}
                    fatherModule2Url={""}
                    fatherModule2Title={""}
                />
                <Row>
                    <Col sm={12} className="btn-page">
                        <Card style={{ marginBottom: "5px" }}>
                            <Card.Body>
                                <Tabs
                                    variant="pills"
                                    defaultActiveKey="home"
                                    className=""
                                >
                                    <Tab
                                        eventKey="home"
                                        title="INFORMACIÓN BASICA"
                                    ></Tab>
                                    <Tab
                                        eventKey="profile"
                                        title="ESTUDIOS"
                                    ></Tab>
                                    <Tab
                                        eventKey="contact"
                                        title="TRABAJO"
                                    ></Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>

                        <Card className="client-map">
                            <Card.Body>
                                <div className="client-detail">
                                    <div className="client-profile">
                                        <img src={photo} alt="" />
                                    </div>
                                    <div className="client-contain">
                                        <h5>{this.state.namePerson}</h5>
                                        <a href="#!" className="text-muted">
                                            {email}
                                        </a>
                                        <p className="text-muted m-0 p-t-10">
                                            {documentNumber}
                                        </p>
                                    </div>
                                </div>
                                <Row className="align-items-end">
                                    <Col>
                                        <Table className="table-borderless m-b-0">
                                            <tbody>
                                                <tr>
                                                    <td className="p-0 border-0">
                                                        <p className="m-b-10">
                                                            Estado civil
                                                        </p>
                                                        <p className="m-b-10">
                                                            Genero
                                                        </p>
                                                        <p className="m-b-10">
                                                            Telefono
                                                        </p>

                                                        <p className="m-b-10">
                                                            Lugar de Nacimimento
                                                        </p>
                                                        <p className="m-b-10">
                                                            Fecha de Nacimimento
                                                        </p>
                                                        <p className="m-b-10">
                                                            Lugar de residencia
                                                        </p>
                                                        <p className="m-b-10">
                                                            Dirección
                                                        </p>
                                                    </td>
                                                    <td className="p-0 border-0">
                                                        <p className="m-b-10">
                                                            Solterno
                                                        </p>
                                                        <p className="m-b-10">
                                                            {gender}
                                                        </p>
                                                        <p className="m-b-10">
                                                            {cellPhone}
                                                        </p>

                                                        <p className="m-b-10">
                                                            {nacimiento}
                                                        </p>
                                                        <p className="m-b-10">
                                                            {birthDate}
                                                        </p>
                                                        <p className="m-b-10">
                                                            {residencia}
                                                        </p>
                                                        <p className="m-b-10">
                                                            {address}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Button
                                    className="pull-right"
                                    // disabled={""}
                                    variant="primary"
                                    onClick={() =>
                                        this.setState({ form: true })
                                    }
                                >
                                    {/*// {"" && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                    EDITAR
                                </Button>
                            </Card.Body>
                        </Card>

                        <Row>
                            {this.state.students.length > 0 &&
                                this.state.students.map((r, i) => {
                                    return (
                                        <Col
                                            xs={12}
                                            sm={12}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                            key={i}
                                        >
                                            <Card className="client-map">
                                                <Card.Body>
                                                    <Row>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            lg={6}
                                                            xl={6}
                                                        >
                                                            <p
                                                                style={{
                                                                    fontSize:
                                                                        "15px",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {" "}
                                                                {
                                                                    r.Program
                                                                        .description
                                                                }
                                                            </p>
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            lg={6}
                                                            xl={6}
                                                        >
                                                            {(!component.ORGANIC_UNIT ||
                                                                component.USER_TYPE ===
                                                                    "Academico" ||
                                                                component.USER_TYPE ===
                                                                    "Administrador") && (
                                                                <>
                                                                    <OverlayTrigger
                                                                        overlay={
                                                                            <Tooltip>
                                                                                DESCARGAR
                                                                                RECORD
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <GetApp
                                                                            style={{
                                                                                color: "#fbb901",
                                                                                float: "right",
                                                                            }}
                                                                            onClick={() =>
                                                                                this.downloadPdf(
                                                                                    r.id
                                                                                )
                                                                            }
                                                                        />
                                                                    </OverlayTrigger>
                                                                </>
                                                            )}
                                                            <OverlayTrigger
                                                                overlay={
                                                                    <Tooltip>
                                                                        REGISTRAR
                                                                        OBSERVACIÓN
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <Edit
                                                                    style={{
                                                                        color: "#01afec",
                                                                        float: "right",
                                                                    }}
                                                                    onClick={() =>
                                                                        this.openModalObservation(
                                                                            r
                                                                        )
                                                                    }
                                                                />
                                                            </OverlayTrigger>
                                                        </Col>
                                                    </Row>
                                                    {r.observation !== null &&
                                                    r.observation !== "null" ? (
                                                        <p>{r.observation}</p>
                                                    ) : (
                                                        <p>
                                                            No se ha registrado
                                                            Observación.
                                                        </p>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                        </Row>
                    </Col>
                    
                    <Modal show={modalObservation}>
                        <Modal.Header className="bg-primary">
                            <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                                Observación
                            </Modal.Title>
                            <div className="d-inline-block pull-right">
                                <span
                                    type="button"
                                    onClick={this.closeModalObservation}
                                >
                                    {" "}
                                    <i
                                        className="feather icon-x"
                                        style={{
                                            fontSize: "20px",
                                            color: "white",
                                        }}
                                    ></i>{" "}
                                </span>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group className="form-group fill">
                                        <Form.Label className="floating-label">
                                            Registre incidencias del estudiante
                                            <small className="text-danger">
                                                {" "}
                                                *
                                            </small>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows="9"
                                            value={observation}
                                            onChange={this.handleChange(
                                                "observation"
                                            )}
                                            margin="normal"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button
                                className="pull-right"
                                // disabled={loader}
                                variant="primary"
                                onClick={() => this.updateObservationStudent()}
                            >
                                Guardar
                            </Button>

                            {/*{action === 'add' ?*/}
                            {/*    <Button*/}
                            {/*        className="pull-right"*/}
                            {/*        disabled={loader}*/}
                            {/*        variant="primary"*/}

                            {/*        onClick={() => this.save()}>*/}
                            {/*        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                            {/*        Guardar</Button> :*/}
                            {/*    <Button*/}
                            {/*        className="pull-right"*/}
                            {/*        disabled={loader}*/}
                            {/*        variant="primary"*/}

                            {/*        onClick={() => this.update()}>*/}
                            {/*        {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                            {/*        Guardar Cambios</Button>*/}
                            {/*}*/}
                        </Modal.Body>
                    </Modal>

                    {/*modal                */}

                    {this.state.form && (
                        <ProfileForm
                            ref={(ref) => (this.Profile = ref)}
                            retriveData={this.state.ALLDATAPERSON}
                            route={"profile"}
                            closeForm={this.closeForm}
                            callData={this.callData}
                        />
                    )}
                </Row>
            </Aux>
        );
    }
}
