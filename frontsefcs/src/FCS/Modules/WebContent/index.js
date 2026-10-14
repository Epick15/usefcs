import React, { Component } from "react";
import axios from "axios";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import PNotify from "pnotify/dist/es/PNotify";
import app from "../../Constants";
import TitleModule from "../../TitleModule";
import component from "../../Component";
import "./styles.css";

const emptyAuthority = {
    id: "",
    name: "",
    position: "",
    display_order: 1,
    published: true,
    image: null,
    image_url: null,
    legacy_image: null,
};

export default class WebContent extends Component {
    state = {
        loading: false,
        saving: false,
        activeTab: "about",
        content: {
            presentation: "",
            mission: "",
            vision: "",
            login_entity_name: "SEGUNDA ESPECIALIDAD FCS",
            login_welcome_title: "Bienvenido!",
            login_welcome_description:
                "Inicie en su cuenta y explore las funcionalidades del software de gestion de SEGUNDA ESPECIALIDAD FCS",
            login_form_title: "Iniciar Sesion",
            login_form_description:
                "Por favor Ingrese Usuario y Contraseña",
            login_text_color: "#7c003e",
            login_background_text_color: "#ffffff",
            login_form_position: "right",
            login_background_text_visible: true,
        },
        authorities: [],
        authority: emptyAuthority,
        admission: {
            id_process: "",
            title: "",
            subtitle: "",
            audience: "",
            requirements: [],
            schedule: [],
            calendar: [],
            whatsapp_url: "",
            registration_url: "",
        },
        processes: [],
        specialties: [],
        programs: [],
        specialty: null,
        loginBackgroundImage: null,
        removeLoginBackgroundImage: false,
    };

    componentDidMount() {
        this.load();
    }

    load = async () => {
        this.setState({ loading: true });
        try {
            const [response, admissionResponse, specialtyResponse] =
                await Promise.all([
                    axios.get(`${app.web}/about/manage`, app.headers),
                    axios.get(`${app.web}/admission/manage`, app.headers),
                    axios.get(`${app.web}/specialties/manage`, app.headers),
                ]);
            const specialties = specialtyResponse.data.specialties || [];
            this.setState({
                content: response.data.content || this.state.content,
                authorities: response.data.authorities || [],
                admission:
                    admissionResponse.data.admission || this.state.admission,
                processes: admissionResponse.data.processes || [],
                specialties,
                programs: specialtyResponse.data.programs || [],
                specialty: this.state.specialty
                    ? specialties.find(
                          (item) => item.id === this.state.specialty.id,
                      ) || specialties[0]
                    : specialties[0] || null,
            });
        } catch (error) {
            PNotify.error({
                title: "Error",
                text: "No se pudo cargar el contenido web.",
                delay: 3000,
            });
        }
        this.setState({ loading: false });
    };

    changeContent = (field) => (event) =>
        this.setState({
            content: { ...this.state.content, [field]: event.target.value },
        });
    changeContentBoolean = (field) => (event) =>
        this.setState({
            content: { ...this.state.content, [field]: event.target.checked },
        });
    changeAuthority = (field) => (event) =>
        this.setState({
            authority: {
                ...this.state.authority,
                [field]:
                    field === "published"
                        ? event.target.checked
                        : event.target.value,
            },
        });
    selectImage = (event) =>
        this.setState({
            authority: {
                ...this.state.authority,
                image: event.target.files[0] || null,
            },
        });

    saveContent = async () => {
        this.setState({ saving: true });
        try {
            const data = new FormData();
            data.set("presentation", this.state.content.presentation || "");
            data.set("mission", this.state.content.mission || "");
            data.set("vision", this.state.content.vision || "");
            await axios.patch(`${app.web}/about`, data, app.headers);
            PNotify.success({
                title: "Guardado",
                text: "Contenido público actualizado.",
                delay: 2000,
            });
        } catch (error) {
            PNotify.error({
                title: "Error",
                text: "No se pudo guardar el contenido.",
                delay: 3000,
            });
        }
        this.setState({ saving: false });
    };

    saveLoginContent = async () => {
        this.setState({ saving: true });
        try {
            const data = new FormData();
            [
                "login_entity_name",
                "login_welcome_title",
                "login_welcome_description",
                "login_form_title",
                "login_form_description",
                "login_text_color",
                "login_background_text_color",
                "login_form_position",
                "login_background_text_visible",
            ].forEach((field) => data.set(field, this.state.content[field] || ""));
            if (this.state.loginBackgroundImage instanceof File)
                data.set("login_background_image", this.state.loginBackgroundImage);
            data.set(
                "remove_login_background_image",
                this.state.removeLoginBackgroundImage,
            );
            await axios.patch(`${app.web}/about`, data, app.headers);
            PNotify.success({
                title: "Guardado",
                text: "Contenido del inicio de sesión actualizado.",
                delay: 2000,
            });
            this.setState({
                loginBackgroundImage: null,
                removeLoginBackgroundImage: false,
            });
            this.load();
        } catch (error) {
            PNotify.error({
                title: "Error",
                text:
                    (error.response && error.response.data.message) ||
                    "No se pudo guardar el contenido del inicio de sesión.",
                delay: 3000,
            });
        }
        this.setState({ saving: false });
    };

    selectLoginBackground = (event) => {
        const image = event.target.files[0] || null;
        if (image && image.size > 500 * 1024) {
            event.target.value = "";
            return PNotify.error({
                title: "Imagen demasiado pesada",
                text: "El fondo no puede superar 500 KB. Optimízalo con TinyPNG u otro compresor antes de subirlo.",
                delay: 4000,
            });
        }
        this.setState({
            loginBackgroundImage: image,
            removeLoginBackgroundImage: false,
        });
    };

    saveAuthority = async () => {
        const authority = this.state.authority;
        if (!authority.name.trim() || !authority.position.trim())
            return PNotify.notice({
                title: "Advertencia",
                text: "Ingrese nombre y cargo.",
                delay: 2000,
            });
        this.setState({ saving: true });
        const data = new FormData();
        data.set("name", authority.name);
        data.set("position", authority.position);
        data.set("display_order", authority.display_order || 1);
        data.set("published", authority.published);
        if (authority.image instanceof File) data.set("image", authority.image);
        try {
            const response = authority.id
                ? await axios.patch(
                      `${app.web}/authorities/${authority.id}`,
                      data,
                      app.headers,
                  )
                : await axios.post(`${app.web}/authorities`, data, app.headers);
            PNotify.success({
                title: "Guardado",
                text: response.data.message,
                delay: 2000,
            });
            this.setState({ authority: emptyAuthority });
            this.load();
        } catch (error) {
            PNotify.error({
                title: "Error",
                text:
                    (error.response && error.response.data.message) ||
                    "No se pudo guardar la autoridad.",
                delay: 3000,
            });
        }
        this.setState({ saving: false });
    };

    changeAdmission = (field) => (event) =>
        this.setState({
            admission: { ...this.state.admission, [field]: event.target.value },
        });
    changeAdmissionJson = (field) => (event) =>
        this.setState({
            admission: { ...this.state.admission, [field]: event.target.value },
        });
    saveAdmission = async () => {
        this.setState({ saving: true });
        const admission = this.state.admission;
        const data = new FormData();
        ["id_process", "title", "subtitle", "audience", "whatsapp_url", "registration_url"].forEach(
            (field) => data.set(field, admission[field] || ""),
        );
        try {
            ["requirements", "schedule", "calendar"].forEach((field) =>
                data.set(
                    field,
                    typeof admission[field] === "string"
                        ? JSON.stringify(JSON.parse(admission[field] || "[]"))
                        : JSON.stringify(admission[field] || []),
                ),
            );
        } catch (_) {
            this.setState({ saving: false });
            return PNotify.notice({
                title: "Advertencia",
                text: "Revise el formato JSON de requisitos, horario o cronograma.",
                delay: 3000,
            });
        }
        try {
            const response = await axios.patch(
                `${app.web}/admission`,
                data,
                app.headers,
            );
            PNotify.success({
                title: "Guardado",
                text: response.data.message,
                delay: 2000,
            });
            this.load();
        } catch (error) {
            PNotify.error({
                title: "Error",
                text: "No se pudo guardar la admisión.",
                delay: 3000,
            });
        }
        this.setState({ saving: false });
    };

    changeAdmissionList =
        (field, index, property = null) =>
        (event) => {
            const values = [...(this.state.admission[field] || [])];
            values[index] = property
                ? { ...values[index], [property]: event.target.value }
                : event.target.value;
            this.setState({
                admission: { ...this.state.admission, [field]: values },
            });
        };
    addAdmissionListItem = (field) => {
        const defaults = {
            requirements: "",
            schedule: { day: "", time: "", detail: "" },
            calendar: { activity: "", date: "" },
        };
        this.setState({
            admission: {
                ...this.state.admission,
                [field]: [
                    ...(this.state.admission[field] || []),
                    defaults[field],
                ],
            },
        });
    };
    removeAdmissionListItem = (field, index) =>
        this.setState({
            admission: {
                ...this.state.admission,
                [field]: (this.state.admission[field] || []).filter(
                    (_, itemIndex) => itemIndex !== index,
                ),
            },
        });

    selectSpecialty = (event) =>
        this.setState({
            specialty:
                this.state.specialties.find(
                    (item) => String(item.id) === event.target.value,
                ) || null,
        });
    changeSpecialty = (field) => (event) =>
        this.setState({
            specialty: {
                ...this.state.specialty,
                [field]:
                    field === "published"
                        ? event.target.checked
                        : event.target.value,
            },
        });
    changeSpecialtyList = (field, index) => (event) => {
        const values = [...(this.state.specialty[field] || [])];
        values[index] = event.target.value;
        this.setState({
            specialty: { ...this.state.specialty, [field]: values },
        });
    };
    addSpecialtyListItem = (field) =>
        this.setState({
            specialty: {
                ...this.state.specialty,
                [field]: [...(this.state.specialty[field] || []), ""],
            },
        });
    removeSpecialtyListItem = (field, index) =>
        this.setState({
            specialty: {
                ...this.state.specialty,
                [field]: (this.state.specialty[field] || []).filter(
                    (_, itemIndex) => itemIndex !== index,
                ),
            },
        });
    saveSpecialty = async () => {
        const specialty = this.state.specialty;
        if (!specialty) return;
        const objectives = (specialty.objectives || [])
            .map((item) => String(item).trim())
            .filter(Boolean);
        const competencies = (specialty.competencies || [])
            .map((item) => String(item).trim())
            .filter(Boolean);
        this.setState({ saving: true });
        const data = new FormData();
        ["id_program", "slug", "title", "color", "background_color"].forEach(
            (field) => data.set(field, specialty[field] || ""),
        );
        data.set("published", specialty.published);
        data.set("objectives", JSON.stringify(objectives));
        data.set("competencies", JSON.stringify(competencies));
        try {
            const response = await axios.patch(
                `${app.web}/specialties/${specialty.id}`,
                data,
                app.headers,
            );
            PNotify.success({
                title: "Guardado",
                text: response.data.message,
                delay: 2000,
            });
            this.load();
        } catch (error) {
            PNotify.error({
                title: "Error",
                text:
                    (error.response && error.response.data.message) ||
                    "No se pudo guardar la especialidad.",
                delay: 3000,
            });
        }
        this.setState({ saving: false });
    };

    editAuthority = (authority) =>
        this.setState({ authority: { ...authority, image: null } });
    removeAuthority = async (authority) => {
        if (!window.confirm(`¿Eliminar a ${authority.name}?`)) return;
        try {
            const response = await axios.delete(
                `${app.web}/authorities/${authority.id}`,
                app.headers,
            );
            PNotify.success({
                title: "Eliminado",
                text: response.data.message,
                delay: 2000,
            });
            if (this.state.authority.id === authority.id)
                this.setState({ authority: emptyAuthority });
            this.load();
        } catch (error) {
            PNotify.error({
                title: "Error",
                text: "No se pudo eliminar la autoridad.",
                delay: 3000,
            });
        }
    };

    imageUrl = (authority) =>
        authority.image_url
            ? `${app.server.replace(/\/api\/?$/, "")}${authority.image_url}`
            : null;

    render() {
        const { loading, saving, content, authorities, authority } = this.state;
        return (
            <>
                {loading && component.spin}
                <TitleModule
                    actualTitle="SITIO WEB"
                    actualModule="CONTENIDO PÚBLICO"
                    fatherModuleUrl=""
                    fatherModuleTitle=""
                />
                <section className="web-content-admin">
                <div className="web-content-intro">
                    <div><span>ADMINISTRACIÓN DEL SITIO</span><p>Actualiza el contenido que se publica en SiteUSE.</p></div>
                    <small>Los cambios se reflejan en el sitio público.</small>
                </div>
                <div className="mb-4 web-content-tabs">
                    <Button
                        className="mr-2"
                        variant={
                            this.state.activeTab === "about"
                                ? "primary"
                                : "outline-primary"
                        }
                        onClick={() => this.setState({ activeTab: "about" })}
                    >
                        Nosotros
                    </Button>
                    <Button
                        className="mr-2"
                        variant={
                            this.state.activeTab === "admission"
                                ? "primary"
                                : "outline-primary"
                        }
                        onClick={() =>
                            this.setState({ activeTab: "admission" })
                        }
                    >
                        Admisión
                    </Button>
                    <Button
                        className="mr-2"
                        variant={
                            this.state.activeTab === "specialties"
                                ? "primary"
                                : "outline-primary"
                        }
                        onClick={() =>
                            this.setState({ activeTab: "specialties" })
                        }
                    >
                        Especialidades
                    </Button>
                    <Button
                        variant={
                            this.state.activeTab === "login"
                                ? "primary"
                                : "outline-primary"
                        }
                        onClick={() => this.setState({ activeTab: "login" })}
                    >
                        Inicio de sesión
                    </Button>
                </div>
                {this.state.activeTab === "about" && (
                    <>
                        <Row>
                            <Col lg={8}>
                                <Card>
                                    <Card.Header>
                                        <h5>PRESENTACIÓN, MISIÓN Y VISIÓN</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label>
                                                Presentación
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                value={
                                                    content.presentation || ""
                                                }
                                                onChange={this.changeContent(
                                                    "presentation",
                                                )}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Misión</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={content.mission || ""}
                                                onChange={this.changeContent(
                                                    "mission",
                                                )}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Visión</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={content.vision || ""}
                                                onChange={this.changeContent(
                                                    "vision",
                                                )}
                                            />
                                        </Form.Group>
                                        <Button
                                            disabled={saving}
                                            onClick={this.saveContent}
                                        >
                                            Guardar contenido
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={4}>
                                <Card>
                                    <Card.Header>
                                        <h5>
                                            {authority.id
                                                ? "EDITAR AUTORIDAD"
                                                : "NUEVA AUTORIDAD"}
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                value={authority.name}
                                                onChange={this.changeAuthority(
                                                    "name",
                                                )}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Cargo</Form.Label>
                                            <Form.Control
                                                value={authority.position}
                                                onChange={this.changeAuthority(
                                                    "position",
                                                )}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Orden</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={authority.display_order}
                                                onChange={this.changeAuthority(
                                                    "display_order",
                                                )}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Fotografía</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={this.selectImage}
                                            />
                                            <Form.Text className="text-muted">
                                                Opcional. Si no adjuntas una
                                                nueva foto al editar, se
                                                conserva la actual.
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Check
                                            className="mb-3"
                                            type="checkbox"
                                            label="Publicar en el sitio"
                                            checked={authority.published}
                                            onChange={this.changeAuthority(
                                                "published",
                                            )}
                                        />
                                        <Button
                                            disabled={saving}
                                            onClick={this.saveAuthority}
                                        >
                                            {authority.id
                                                ? "Guardar cambios"
                                                : "Agregar autoridad"}
                                        </Button>
                                        {authority.id && (
                                            <Button
                                                variant="link"
                                                onClick={() =>
                                                    this.setState({
                                                        authority:
                                                            emptyAuthority,
                                                    })
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Card>
                                    <Card.Header>
                                        <h5>AUTORIDADES</h5>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Table
                                            responsive
                                            hover
                                            className="mb-0"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Orden</th>
                                                    <th>Foto</th>
                                                    <th>Nombre</th>
                                                    <th>Cargo</th>
                                                    <th>Estado</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {authorities.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            {item.display_order}
                                                        </td>
                                                        <td>
                                                            {this.imageUrl(
                                                                item,
                                                            ) ? (
                                                                <img
                                                                    alt=""
                                                                    src={this.imageUrl(
                                                                        item,
                                                                    )}
                                                                    style={{
                                                                        width: 45,
                                                                        height: 45,
                                                                        objectFit:
                                                                            "cover",
                                                                    }}
                                                                />
                                                            ) : (
                                                                "Predeterminada"
                                                            )}
                                                        </td>
                                                        <td>{item.name}</td>
                                                        <td>{item.position}</td>
                                                        <td>
                                                            {item.published
                                                                ? "Publicado"
                                                                : "Oculto"}
                                                        </td>
                                                        <td>
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() =>
                                                                    this.editAuthority(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                Editar
                                                            </Button>{" "}
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() =>
                                                                    this.removeAuthority(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {!authorities.length && (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center"
                                                        >
                                                            No hay autoridades
                                                            registradas.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
                {this.state.activeTab === "admission" && (
                    <Row>
                        <Col lg={9}>
                            <Card>
                                <Card.Header>
                                    <h5>ADMISIÓN PÚBLICA</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group>
                                        <Form.Label>
                                            Proceso de admisión vigente
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={
                                                this.state.admission
                                                    .id_process || ""
                                            }
                                            onChange={this.changeAdmission(
                                                "id_process",
                                            )}
                                        >
                                            <option value="">
                                                Seleccione un proceso
                                            </option>
                                            {this.state.processes.map(
                                                (process) => (
                                                    <option
                                                        key={process.id}
                                                        value={process.id}
                                                    >
                                                        {process.denomination}
                                                    </option>
                                                ),
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control
                                            value={
                                                this.state.admission.title || ""
                                            }
                                            onChange={this.changeAdmission(
                                                "title",
                                            )}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Subtítulo</Form.Label>
                                        <Form.Control
                                            value={
                                                this.state.admission.subtitle ||
                                                ""
                                            }
                                            onChange={this.changeAdmission(
                                                "subtitle",
                                            )}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Dirigido a</Form.Label>
                                        <Form.Control
                                            value={
                                                this.state.admission.audience ||
                                                ""
                                            }
                                            onChange={this.changeAdmission(
                                                "audience",
                                            )}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Requisitos</Form.Label>
                                        {(
                                            this.state.admission.requirements ||
                                            []
                                        ).map((item, index) => (
                                            <Row
                                                key={`requirement-${index}`}
                                                className="mb-2"
                                            >
                                                <Col>
                                                    <Form.Control
                                                        value={item}
                                                        placeholder="Escriba un requisito"
                                                        onChange={this.changeAdmissionList(
                                                            "requirements",
                                                            index,
                                                        )}
                                                    />
                                                </Col>
                                                <Col xs="auto">
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() =>
                                                            this.removeAdmissionListItem(
                                                                "requirements",
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        Quitar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() =>
                                                this.addAdmissionListItem(
                                                    "requirements",
                                                )
                                            }
                                        >
                                            + Agregar requisito
                                        </Button>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            Horario de atención
                                        </Form.Label>
                                        {(
                                            this.state.admission.schedule || []
                                        ).map((item, index) => (
                                            <Row
                                                key={`schedule-${index}`}
                                                className="mb-2"
                                            >
                                                <Col md={3}>
                                                    <Form.Control
                                                        value={item.day || ""}
                                                        placeholder="Día"
                                                        onChange={this.changeAdmissionList(
                                                            "schedule",
                                                            index,
                                                            "day",
                                                        )}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Control
                                                        value={item.time || ""}
                                                        placeholder="Horario"
                                                        onChange={this.changeAdmissionList(
                                                            "schedule",
                                                            index,
                                                            "time",
                                                        )}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Control
                                                        value={
                                                            item.detail || ""
                                                        }
                                                        placeholder="Detalle"
                                                        onChange={this.changeAdmissionList(
                                                            "schedule",
                                                            index,
                                                            "detail",
                                                        )}
                                                    />
                                                </Col>
                                                <Col xs="auto">
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() =>
                                                            this.removeAdmissionListItem(
                                                                "schedule",
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        Quitar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() =>
                                                this.addAdmissionListItem(
                                                    "schedule",
                                                )
                                            }
                                        >
                                            + Agregar horario
                                        </Button>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Cronograma</Form.Label>
                                        {(
                                            this.state.admission.calendar || []
                                        ).map((item, index) => (
                                            <Row
                                                key={`calendar-${index}`}
                                                className="mb-2"
                                            >
                                                <Col>
                                                    <Form.Control
                                                        value={
                                                            item.activity || ""
                                                        }
                                                        placeholder="Actividad"
                                                        onChange={this.changeAdmissionList(
                                                            "calendar",
                                                            index,
                                                            "activity",
                                                        )}
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        value={item.date || ""}
                                                        placeholder="Fecha"
                                                        onChange={this.changeAdmissionList(
                                                            "calendar",
                                                            index,
                                                            "date",
                                                        )}
                                                    />
                                                </Col>
                                                <Col xs="auto">
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() =>
                                                            this.removeAdmissionListItem(
                                                                "calendar",
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        Quitar
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() =>
                                                this.addAdmissionListItem(
                                                    "calendar",
                                                )
                                            }
                                        >
                                            + Agregar actividad
                                        </Button>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>URL de WhatsApp</Form.Label>
                                        <Form.Control
                                            value={
                                                this.state.admission
                                                    .whatsapp_url || ""
                                            }
                                            onChange={this.changeAdmission(
                                                "whatsapp_url",
                                            )}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>URL de registro / inscripción</Form.Label>
                                        <Form.Control
                                            type="url"
                                            placeholder="https://..."
                                            value={this.state.admission.registration_url || ""}
                                            onChange={this.changeAdmission("registration_url")}
                                        />
                                        <Form.Text className="text-muted">Enlace que abrirá el botón flotante “REGÍSTRATE” del SiteUSE.</Form.Text>
                                    </Form.Group>
                                    <Button
                                        disabled={saving}
                                        onClick={this.saveAdmission}
                                    >
                                        Guardar admisión
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card>
                                <Card.Body>
                                    <strong>Costos por programa</strong>
                                    <p className="mb-0 mt-2">
                                        El sitio mostrará un bloque por programa
                                        y tomará los costos de su plan vinculado
                                        al proceso seleccionado.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
                {this.state.activeTab === "specialties" &&
                    this.state.specialty && (
                        <Row>
                            <Col lg={9}>
                                <Card>
                                    <Card.Header>
                                        <h5>ESPECIALIDADES</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label>
                                                Especialidad a editar
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={this.state.specialty.id}
                                                onChange={this.selectSpecialty}
                                            >
                                                {this.state.specialties.map(
                                                    (item) => (
                                                        <option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.title ||
                                                                item.slug}
                                                        </option>
                                                    ),
                                                )}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>
                                                Programa académico vinculado
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={
                                                    this.state.specialty
                                                        .id_program || ""
                                                }
                                                onChange={this.changeSpecialty(
                                                    "id_program",
                                                )}
                                            >
                                                {this.state.programs.map(
                                                    (item) => (
                                                        <option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.denomination}
                                                        </option>
                                                    ),
                                                )}
                                            </Form.Control>
                                            <Form.Text className="text-muted">
                                                El plan, ciclos y cursos se
                                                consultan directamente de este
                                                programa. No se duplican aquí.
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>
                                                Título público
                                            </Form.Label>
                                            <Form.Control
                                                value={
                                                    this.state.specialty
                                                        .title || ""
                                                }
                                                onChange={this.changeSpecialty(
                                                    "title",
                                                )}
                                            />
                                        </Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>
                                                        Color principal
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="color"
                                                        value={
                                                            this.state.specialty
                                                                .color ||
                                                            "#811632"
                                                        }
                                                        onChange={this.changeSpecialty(
                                                            "color",
                                                        )}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>
                                                        Color de fondo
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="color"
                                                        value={
                                                            this.state.specialty
                                                                .background_color ||
                                                            "#f8f6f3"
                                                        }
                                                        onChange={this.changeSpecialty(
                                                            "background_color",
                                                        )}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group>
                                            <Form.Label>Objetivos</Form.Label>
                                            {(
                                                this.state.specialty
                                                    .objectives || []
                                            ).map((item, index) => (
                                                <Row
                                                    key={`objective-${index}`}
                                                    className="mb-2"
                                                >
                                                    <Col>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            value={item}
                                                            placeholder="Escriba un objetivo"
                                                            onChange={this.changeSpecialtyList(
                                                                "objectives",
                                                                index,
                                                            )}
                                                        />
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                this.removeSpecialtyListItem(
                                                                    "objectives",
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Quitar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() =>
                                                    this.addSpecialtyListItem(
                                                        "objectives",
                                                    )
                                                }
                                            >
                                                + Agregar objetivo
                                            </Button>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>
                                                Competencias
                                            </Form.Label>
                                            {(
                                                this.state.specialty
                                                    .competencies || []
                                            ).map((item, index) => (
                                                <Row
                                                    key={`competency-${index}`}
                                                    className="mb-2"
                                                >
                                                    <Col>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            value={item}
                                                            placeholder="Escriba una competencia"
                                                            onChange={this.changeSpecialtyList(
                                                                "competencies",
                                                                index,
                                                            )}
                                                        />
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button
                                                            variant="outline-danger"
                                                            onClick={() =>
                                                                this.removeSpecialtyListItem(
                                                                    "competencies",
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Quitar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() =>
                                                    this.addSpecialtyListItem(
                                                        "competencies",
                                                    )
                                                }
                                            >
                                                + Agregar competencia
                                            </Button>
                                        </Form.Group>
                                        <Form.Check
                                            className="mb-3"
                                            type="checkbox"
                                            label="Publicar en el sitio"
                                            checked={
                                                this.state.specialty.published
                                            }
                                            onChange={this.changeSpecialty(
                                                "published",
                                            )}
                                        />
                                        <Button
                                            disabled={saving}
                                            onClick={this.saveSpecialty}
                                        >
                                            Guardar especialidad
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={3}>
                                <Card>
                                    <Card.Body>
                                        <strong>Información académica</strong>
                                        <p className="mb-0 mt-2">
                                            Los cursos del sitio proceden del
                                            plan vigente que ya administra el
                                            sistema.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                {this.state.activeTab === "login" && (
                    <Row>
                        <Col lg={9}>
                            <Card>
                                <Card.Header>
                                    <h5>INICIO DE SESIÓN ADMINISTRATIVO</h5>
                                </Card.Header>
                                <Card.Body>
                                    <p className="text-muted">
                                        Personaliza los textos que se muestran en
                                        la página de acceso al panel administrativo.
                                    </p>
                                    <Form.Group>
                                        <Form.Label>Nombre de la institución</Form.Label>
                                        <Form.Control
                                            value={content.login_entity_name || ""}
                                            placeholder="SEGUNDA ESPECIALIDAD FCS"
                                            onChange={this.changeContent("login_entity_name")}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Título de bienvenida</Form.Label>
                                        <Form.Control
                                            value={content.login_welcome_title || ""}
                                            placeholder="Bienvenido!"
                                            onChange={this.changeContent("login_welcome_title")}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Descripción de bienvenida</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={content.login_welcome_description || ""}
                                            placeholder="Inicie en su cuenta y explore las funcionalidades del software."
                                            onChange={this.changeContent("login_welcome_description")}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Título del formulario</Form.Label>
                                        <Form.Control
                                            value={content.login_form_title || ""}
                                            placeholder="Iniciar Sesión"
                                            onChange={this.changeContent("login_form_title")}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Indicaciones del formulario</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={content.login_form_description || ""}
                                            placeholder="Por favor ingrese usuario y contraseña."
                                            onChange={this.changeContent("login_form_description")}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Color de texto del formulario</Form.Label>
                                        <Form.Control
                                            type="color"
                                            value={content.login_text_color || "#7c003e"}
                                            onChange={this.changeContent("login_text_color")}
                                        />
                                        <Form.Text className="text-muted">
                                            Por defecto: guinda. Se aplica al nombre institucional, título e indicaciones del formulario.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Color de texto sobre la imagen</Form.Label>
                                        <Form.Control
                                            type="color"
                                            value={content.login_background_text_color || "#ffffff"}
                                            onChange={this.changeContent("login_background_text_color")}
                                        />
                                        <Form.Text className="text-muted">
                                            Por defecto: blanco. Se aplica al título y descripción mostrados sobre la imagen de fondo.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Ubicación del formulario</Form.Label>
                                        <Form.Check
                                            className="mb-3"
                                            type="checkbox"
                                            label="Mostrar texto sobre la imagen de fondo"
                                            checked={content.login_background_text_visible !== false}
                                            onChange={this.changeContentBoolean("login_background_text_visible")}
                                        />
                                        <Form.Control
                                            as="select"
                                            value={content.login_form_position || "right"}
                                            onChange={this.changeContent("login_form_position")}
                                        >
                                            <option value="left">Izquierda</option>
                                            <option value="center">Centro</option>
                                            <option value="right">Derecha</option>
                                        </Form.Control>
                                        <Form.Text className="text-muted">
                                            Por defecto: derecha.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Imagen de fondo</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                                            onChange={this.selectLoginBackground}
                                        />
                                        <Form.Text className="text-muted">
                                            JPG, PNG, WEBP, GIF o AVIF. Máximo 500 KB.
                                            Si pesa más, optimízala con TinyPNG antes de subirla.
                                        </Form.Text>
                                        {content.login_background_url && !this.state.removeLoginBackgroundImage && (
                                            <div className="mt-3">
                                                <img
                                                    src={`${app.server.replace(/\/api\/?$/, "")}${content.login_background_url}`}
                                                    alt="Fondo actual del login"
                                                    style={{ width: "100%", maxWidth: 360, maxHeight: 140, objectFit: "cover" }}
                                                />
                                                <Button
                                                    className="ml-2"
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => this.setState({ removeLoginBackgroundImage: true, loginBackgroundImage: null })}
                                                >
                                                    Restablecer fondo predeterminado
                                                </Button>
                                            </div>
                                        )}
                                        {this.state.loginBackgroundImage && (
                                            <Form.Text className="text-success">
                                                Nueva imagen: {this.state.loginBackgroundImage.name}
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                    <Button disabled={saving} onClick={this.saveLoginContent}>
                                        Guardar inicio de sesión
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={3}>
                            <Card>
                                <Card.Body>
                                    <strong>Alcance</strong>
                                    <p className="mb-0 mt-2">
                                        Esta sección modifica solo los textos visibles.
                                        Usuarios, contraseñas y roles se gestionan en Seguridad.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
                </section>
            </>
        );
    }
}
