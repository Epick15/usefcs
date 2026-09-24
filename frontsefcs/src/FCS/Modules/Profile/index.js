import React, { Component } from "react";
import axios from "axios";
import app from "../../Constants";
import component from "../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";

import ProfileForm from "./Form";
import {
    Card,
    Col,
    Form,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";
import defaultUser from "../../../assets/images/user/default.jpg";
import Add from "@material-ui/icons/Add";

import { Link } from "react-router-dom";

moment.locale("es");

class Profile extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        persons: [],
        profiles: [],
    };

    async componentDidMount() {
        if (component.ORGANIC_UNIT !== "") {
            this.listPersonProfile(component.ORGANIC_UNIT);
        } else {
            this.listPersonProfileGOD();
        }
    }

    async listPersonProfile(ORGANIC_UNIT) {
        this.setState({ teacherLoader: true });
        const url = app.person + "/" + app.persons + "/" + app.profile;
        try {
            let data = new FormData();
            data.set("id_organic_unit", ORGANIC_UNIT);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) this.setState({ profiles: res.data });
            this.setState({ teacherLoader: false });
        } catch (err) {
            this.setState({ teacherLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listPersonProfileGOD() {
        this.setState({ teacherLoader: true });
        const url = app.person + "/" + app.persons + "/" + app.profile + "/g";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ profiles: res.data });
            }
            this.setState({ teacherLoader: false });
        } catch (err) {
            this.setState({ teacherLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    openForm = () => {
        this.setState({ form: true });
    };
    closeForm = () => {
        this.setState({ form: false });
    };
    callData = () => {
        if (component.ORGANIC_UNIT !== "") {
            this.listPersonProfile(component.ORGANIC_UNIT);
        } else {
            this.listPersonProfileGOD();
        }
    };

    searchPerson(params) {
        if (params.length === 0) {
            this.setState({ persons: [] });
        } else {
            if (params.length > 3) {
                const url = app.person + "/search-person/" + params;
                let data = new FormData();
                axios
                    .patch(url, data, app.headers)
                    .then((res) => {
                        if (res.data) this.setState({ persons: res.data });
                    })
                    .catch((err) => {
                        PNotify.error({
                            title: "Oh no!",
                            text: "Ha ocurrido un error",
                            delay: 2000,
                        });
                        console.log(err);
                    });
            }
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "person":
                this.searchPerson(event.target.value);
                this.setState({ person: event.target.value });
                break;
            default:
                break;
        }
    };

    render() {
        const { persons, person } = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"PERFILES"}
                    actualModule={"PERFILES"}
                    fatherModuleUrl={""}
                    fatherModuleTitle={""}
                />
                <Card style={{ marginBottom: "5px" }}>
                    <Card.Header>
                        <Row>
                            <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        // style={program === "" ? {color: "#ff5252 "} : null}
                                    >
                                        Estudiante
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        // onKeyPress={this.handleKeyPress}
                                        id="number"
                                        value={person}
                                        onChange={this.handleChange("person")}
                                        placeholder="Buscar"
                                        margin="normal"
                                    />
                                    <Table
                                        hover
                                        responsive
                                        style={{ marginTop: "-1px" }}
                                    >
                                        <tbody>
                                            {persons.length > 0 &&
                                                persons.map((r, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td scope="row">
                                                                <Link
                                                                    to={
                                                                        "/profile/" +
                                                                        btoa(
                                                                            r.id
                                                                        ) +
                                                                        "/person"
                                                                    }
                                                                >
                                                                    <div className="d-inline-block align-middle">
                                                                        <img
                                                                            src={
                                                                                r.photo !==
                                                                                ""
                                                                                    ? app.server +
                                                                                      "person-photography/" +
                                                                                      r.photo
                                                                                    : defaultUser
                                                                            }
                                                                            // src={defaultUser}
                                                                            alt="user"
                                                                            className="img-radius align-top m-r-15"
                                                                            style={{
                                                                                width: "40px",
                                                                            }}
                                                                        />
                                                                        <div className="d-inline-block">
                                                                            <h6
                                                                                className="m-b-0"
                                                                                style={{
                                                                                    color: "#374762",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {
                                                                                    r.name
                                                                                }
                                                                            </h6>
                                                                            <p
                                                                                className="m-b-0"
                                                                                style={{
                                                                                    color: "#374762",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {r.document_number +
                                                                                    " "}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </Col>
                            <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                <div style={{ float: "right" }}>
                                    <OverlayTrigger
                                        overlay={<Tooltip>NUEVO</Tooltip>}
                                    >
                                        <button
                                            style={{ float: "right" }}
                                            onClick={() => this.openForm()}
                                            type="button"
                                            className="btn-icon btn btn-primary"
                                        >
                                            <Add />
                                        </button>
                                    </OverlayTrigger>
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                </Card>

                {/*<div style={{position: 'relative'}}>*/}
                {/*    {this.state.teacherLoader && component.spiner}*/}
                {/*    <DataTable*/}
                {/*        records={this.state.profiles}*/}
                {/*        openForm={this.openForm}*/}
                {/*    />*/}
                {/*</div>*/}
                {this.state.form && (
                    <ProfileForm
                        ref={(ref) => (this.Profile = ref)}
                        retriveData={""}
                        route={"profile"}
                        closeForm={this.closeForm}
                        callData={this.callData}
                    />
                )}
            </>
        );
    }
}

export default Profile;
