import React, { Component } from "react";
import axios from "axios";
import app from "../../Constants";
import PNotify from "pnotify/dist/es/PNotify";
import { Card, Col, Form, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import component from "../../Component";
import TitleModule from "../../TitleModule";
import GetApp from "@material-ui/icons/GetApp";
import XLSX from "xlsx";
import $ from "jquery";

moment.locale("es");

export default class ReportWebInscription extends Component {
    state = {
        admissionId: "",
        admissionName: "",
        admissionsList: [],
        inscriptionsList: [],
        loader: false,
    };

    async componentDidMount() {
        await this.listAdmissions();
    }

    async listAdmissions() {
        this.setState({ loader: true });
        const url = `${app.web}/admissions`;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                console.log("Data received from API:", res.data); // Log data
                this.setState({ admissionsList: res.data.admissions });
            }
            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salió mal",
                delay: 3000,
            });
            console.log(err);
        }
    }

    async listInscriptions() {
        this.setState({ loader: true });
        // if (this.state.admissionId === "") {
        //     return false;
        // }
        const url = `${app.web}/inscriptions/${this.state.admissionId}`;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                console.log("Data received from API:", res.data); // Log data
                this.setState({ inscriptionsList: res.data.inscriptions });
            }
            this.setState({ loader: false });
        } catch (err) {
            this.setState({ loader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salió mal",
                delay: 3000,
            });
            console.log(err);
        }
    }

    handleChange = (event) => {
        let admissionTitle = $("#admission-" + event.target.value).attr(
            "data-addmission-name"
        );
        this.setState({
            admissionId: event.target.value,
            admissionName: admissionTitle,
        });
    };

    xlsxInscriptions = async () => {
        await this.listInscriptions();
        const workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(this.state.inscriptionsList);
        // XLSX.utils.book_append_sheet(workbook, ws, this.state.processMask);
        XLSX.utils.book_append_sheet(
            workbook,
            ws,
            "ADMISIÓN - " + this.state.admissionName
        );
        XLSX.writeFile(
            workbook,
            "REPORTE DE PRE-INSCRITOS " + this.state.admissionName + ".xlsx",
            { type: "file" }
        );
    };

    downloadData = () => {
        // Implementa la lógica para descargar datos
    };

    render() {
        const { admissionId, admissionsList, loader } = this.state;

        return (
            <>
                {loader && component.spin}
                <TitleModule
                    actualTitle={"REPORTES"}
                    actualModule={"REPORTES DE PRE-INSCRITOS"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Row>
                    <Col xs={12} md={6} lg={4}>
                        <Card>
                            <Card.Header>
                                <h5>DESCARGAR PRE INSCRITOS</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="form-group fill">
                                    <Form.Control
                                        as="select"
                                        value={admissionId}
                                        onChange={this.handleChange}
                                    >
                                        <option value="" hidden>
                                            Plan de admisión
                                        </option>
                                        {admissionsList.length > 0 ? (
                                            admissionsList.map((r, k) => (
                                                <option
                                                    id={"admission-" + r.id}
                                                    key={k}
                                                    value={r.id}
                                                    data-addmission-name={
                                                        r.name
                                                    }
                                                >
                                                    {r.name.toUpperCase()}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>
                                                No se encontraron datos
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                                <hr />

                                <OverlayTrigger
                                    overlay={
                                        <Tooltip>DECARGAR - EXCEL</Tooltip>
                                    }
                                >
                                    <button
                                        style={{
                                            float: "right",
                                            marginRight: "3px",
                                            width: "100%",
                                        }}
                                        onClick={() => this.xlsxInscriptions()}
                                        type="butt-on"
                                        className=" btn btn-success"
                                    >
                                        <GetApp />
                                    </button>
                                </OverlayTrigger>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
