import React from "react";
import {
    Button,
    Col,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Table,
    Tooltip,
} from "react-bootstrap";

import moment from "moment";
import "moment/locale/es";
import Close from "@material-ui/icons/Close";
import defaultTicket from "../../../../assets/images/ticket/defaultTicket.png";
import $ from "jquery";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";

moment.locale("es");
const token = localStorage.getItem("TOKEN") || null;

class FormVoucher extends React.Component {
    state = {
        form: this.props.form,
        studentID: this.props.studentID,
        retriveMovement: this.props.retriveMovement,
        action: "add",
        preview: "",
        file: "",
        voucherCode: "",
        loaderVoucher: false,
        viewVoucher: false,
        voucherDate: "",
        previewVoucher: "",
        voucherAmount: "",
        observation: "",
        voucherSearch: "",
        voucherType: "",
        voucherState: "",
        vouchers: [],
    };

    async componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.form !== this.props.form) {
            this.setState({ form: this.props.form });
        }
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID &&
                this.setState({ studentID: this.props.studentID });
        }
        if (prevProps.programID !== this.props.programID) {
            this.props.programID &&
                this.setState({ programID: this.props.programID });
        }
        if (prevProps.organicUnit !== this.props.organicUnit) {
            this.props.organicUnit &&
                this.setState({ organicUnit: this.props.organicUnit });
        }
        if (prevProps.retriveMovement !== this.props.retriveMovement) {
            this.props.retriveMovement !== "" &&
                this.retriveData(this.props.retriveMovement);
        }

        if (prevProps.deleteMovementID !== this.props.deleteMovementID) {
            this.props.deleteMovementID !== "" &&
                this.openMovementSweetAlert(this.props.deleteMovementID);
        }
    }

    async searchVoucherStudent(params) {
        try {
            if (params === "") {
                this.setState({ vouchers: [] });
            } else {
                const url =
                    app.accounting +
                    "/" +
                    app.movement +
                    "/" +
                    app.student +
                    "/search/" +
                    params;
                let data = new FormData();

                const res = await axios.get(url, data, app.headers);
                if (res.data) this.setState({ vouchers: res.data });
            }
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al buscar comprobantes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async createMovement() {
        this.setState({ loaderVoucher: true });
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            file,
            studentID,
            observation,
            voucherType,
            voucherState,
        } = this.state;
        const { organicUnit, programID } = this.props;
        const url = app.accounting + "/" + app.movement;

        if (
            organicUnit !== "" &&
            programID !== "" &&
            voucherCode !== "" &&
            voucherDate !== "" &&
            voucherAmount !== "" &&
            file !== "" &&
            studentID !== "" &&
            voucherState !== "" &&
            voucherType !== ""
        ) {
            let data = new FormData();
            data.set("id_student", studentID);
            data.set("id_organic_unit", organicUnit);
            data.set("id_program", programID);

            data.set("file", file);
            data.set("voucher_code", voucherCode);
            data.set("voucher_amount", voucherAmount);
            data.set("voucher_date", voucherDate);
            data.set("observation", observation);
            data.set("type", voucherType);
            data.set("state", voucherState);

            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({ loaderVoucher: false });
                this.props.callListMovement();
                this.closeForm();
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderVoucher: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderVoucher: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios antes de guardar",
                delay: 2000,
            });
        }
    }

    async updateMovement() {
        this.setState({ loaderVoucher: true });
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            file,
            studentID,
            observation,
            voucherState,
            voucherType,
        } = this.state;
        const url =
            app.accounting + "/" + app.movement + "/" + this.state.movementID;
        if (
            voucherCode !== "" &&
            voucherDate !== "" &&
            voucherAmount !== "" &&
            studentID !== "" &&
            voucherType !== "" &&
            voucherState !== ""
        ) {
            let data = new FormData();
            data.set("id_student", studentID);
            data.set("file", file);
            data.set("voucher_code", voucherCode);
            data.set("voucher_amount", voucherAmount);
            data.set("voucher_date", voucherDate);
            data.set("observation", observation);
            data.set("type", voucherType);
            data.set("state", voucherState);

            try {
                await axios.patch(url, data, app.headers);
                this.props.callListMovement();
                this.closeForm();
                this.setState({ loaderVoucher: false });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderVoucher: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.error,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderVoucher: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios antes de guardar",
                delay: 2000,
            });
        }
    }

    async destroyMovement(id) {
        try {
            this.setState({ loaderVoucherDestroyMovement: true });
            const url = app.accounting + "/" + app.movement + "/" + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({
                title: "Finalizado",
                text: res.data,
                delay: 2000,
            });
            this.setState({ loaderVoucherDestroyMovement: false });
            this.props.callListMovement();
            this.closeForm();
            return true;
        } catch (err) {
            PNotify.error({
                title: "Oh no!",
                text: err.response.data.error,
                delay: 2000,
            });
            this.setState({ loaderVoucherDestroyMovement: false });
            return false;
        }
    }

    async listVoucher(voucher_url) {
        this.setState({ conceptLoader: true });
        const url = app.server + app.voucher + voucher_url;
        try {
            const res = await axios.get(url, {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    "x-accesss-token": token,
                },
            });
            if (res.data) {
                const imgUrl = window.URL.createObjectURL(new Blob([res.data]));
                // this.imgVoucher.src = imgUrl

                this.setState({ preview: imgUrl });
            }

            this.setState({ conceptLoader: false });
        } catch (err) {
            this.setState({ conceptLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listPreviewVoucher(voucher_url) {
        this.setState({ conceptLoader: true });
        const url = app.server + app.voucher + voucher_url;
        try {
            const res = await axios.get(url, {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    "x-accesss-token": token,
                },
            });
            if (res.data) {
                const imgUrl = window.URL.createObjectURL(new Blob([res.data]));
                // this.imgVoucher.src = imgUrl

                this.setState({ previewVoucher: imgUrl });
            }

            this.setState({ conceptLoader: false });
        } catch (err) {
            this.setState({ conceptLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    retriveData = (r) => {
        this.listVoucher(r.voucher_url);
        this.setState({
            action: "update",
            movementID: r.id, // preview: r.voucher_url ? app.server + app.voucher + r.voucher_url : defaultTicket,
            voucherCode: r.voucher_code || "",
            voucherDate: r.voucher_date || "",
            voucherAmount: r.voucher_amount || "",
            observation: r.observation || "",
            voucherState: r.state,
            voucherType: r.type,
        });
    };
    handleChange = (field) => (event) => {
        switch (field) {
            case "voucherCode":
                let voucherCode = event.target.value.replace(
                    /[^0-9A-Za-z-.]/g,
                    ""
                );
                // let voucherCode = event.target.value;
                this.setState({ voucherCode: voucherCode.slice(0, 30) });
                break;
            case "voucherAmount":
                this.setState({
                    voucherAmount: event.target.value.slice(0, 8),
                });
                break;
            case "voucherDate":
                this.setState({ voucherDate: event.target.value });
                break;
            case "voucherSearch":
                this.setState({ voucherSearch: event.target.value });
                this.searchVoucherStudent(event.target.value);
                break;
            case "observation":
                this.setState({ observation: event.target.value });
                break;
            case "voucherState":
                this.setState({ voucherState: event.target.value });
                break;
            case "voucherSearch":
                this.setState({ voucherSearch: event.target.value });
                break;
            case "voucherType":
                this.setState({ voucherType: event.target.value });
                break;
            default:
                break;
        }
    };
    openFileReader = () => {
        const input = "#inputVaucher";
        $(input).click();
    };
    changeVaucher = (event) => {
        const fileExtension = ["jpg", "jpeg", "png"];
        const input = "#inputVaucher";
        let value = $(input).val().split(".").pop().toLowerCase();
        console.log(value);
        if ($.inArray(value, fileExtension) === -1) {
            let message =
                "Por favor use estos formatos: " + fileExtension.join(", ");
            PNotify.notice({ title: "Error", text: message, delay: 2000 });
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onload = () => {
                this.setState({
                    file: file, // imgSize: 'wid-500 text-center',
                    preview: reader.result,
                    status: true,
                });
            };
            reader.readAsDataURL(file);
        }
        if (this.state.changeImage) {
            setTimeout(() => {
                this.changeImage(this.state.personID);
            }, 600);
        }
    };
    removeAvatar = () => {
        this.setState({ file: "", preview: null });
        const input = "#inputAvatar";
        $(input).val("");
    };
    closeForm = () => {
        this.setState({
            vouchers: [],

            form: false,
            preview: "",
            file: "",
            voucherCode: "",
            voucherDate: "",
            voucherAmount: "",
            observation: "",
            voucherState: "",
            voucherSearch: "",
            voucherType: "",
            action: "add",
        });
        this.props.closeForm();
    };
    openMovementSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: "Estás seguro?",
                text: "Este paso es irreversible!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Eliminar!",
                cancelButtonText: "No, Cancelar",
            });
            alert.isConfirmed
                ? await this.destroyMovement(id)
                : this.props.closeForm();
        } catch (e) {
            console.log("error:", e);
            return false;
        }
    };
    closeSearchVoucher = () => {
        this.setState({
            voucherSearch: "",
            vouchers: [],
        });
    };
    openPreviewVoucher = (voucher_url) => {
        this.listPreviewVoucher(voucher_url);
        this.setState({ viewVoucher: true });
    };
    closePreviewVoucher = () => {
        this.setState({ viewVoucher: false, previewVoucher: "" });
    };

    render() {
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            observation,
            preview,
            voucherType,
            voucherState,
            loaderVoucher,
            voucherSearch,
            viewVoucher,
            previewVoucher,
            vouchers,
        } = this.state;

        return (
            <>
                <Modal show={this.state.form} size={"xl"} backdrop="static">
                    <Modal.Header
                        className="bg-primary"
                        style={{
                            alignItems: "center",
                            padding: "18px 24px",
                        }}
                    >
                        <Modal.Title
                            as="h5"
                            style={{
                                color: "#ffffff",
                                fontWeight: 600,
                                letterSpacing: 0,
                                margin: 0,
                            }}
                        >
                            {this.state.action === "add"
                                ? "Registrar"
                                : "Editar"}{" "}
                            comprobante
                        </Modal.Title>
                        <div className="d-inline-block ml-auto">
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{ zIndex: 100000000 }}>
                                        Cerrar
                                    </Tooltip>
                                }
                            >
                                <Close
                                    style={{
                                        color: "white",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => this.closeForm()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            background: "#f7f9fc",
                            padding: "24px",
                        }}
                    >
                        <Row style={{ rowGap: "18px" }}>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Row>
                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <div
                                            style={{
                                                background: "#ffffff",
                                                border:
                                                    "1px solid #e1e7ef",
                                                borderRadius: "6px",
                                                padding: "16px",
                                                minHeight: "360px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                <h6
                                                    style={{
                                                        marginBottom: "4px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Comprobante de pago
                                                </h6>
                                                <span
                                                    style={{
                                                        color: "#6c757d",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Formatos permitidos: PNG,
                                                    JPG o JPEG
                                                </span>
                                            </div>
                                            <div
                                                className="position-relative d-flex align-items-center justify-content-center"
                                                style={{
                                                    border:
                                                        "1px dashed #b8c2cc",
                                                    borderRadius: "6px",
                                                    background: "#fbfcfe",
                                                    minHeight: "280px",
                                                    padding: "12px",
                                                }}
                                            >
                                            {/*{loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                            <img
                                                ref={(ref) =>
                                                    (this.imgVoucher = ref)
                                                }
                                                style={{
                                                    width: preview
                                                        ? "100%"
                                                        : "120px",
                                                    maxHeight: "260px",
                                                    objectFit: "contain",
                                                    cursor: "pointer",
                                                }}
                                                onClick={this.openFileReader}
                                                src={preview || defaultTicket}
                                                alt="Comprobante de pago"
                                            />
                                            </div>
                                            <p
                                                className="m-b-0"
                                                style={{
                                                    color: "#6c757d",
                                                    fontSize: "12px",
                                                    marginTop: "10px",
                                                }}
                                            >
                                                Haz clic en la imagen para
                                                seleccionar el archivo.
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            id="inputVaucher"
                                            style={{ display: "none" }}
                                            onChange={(event) =>
                                                this.changeVaucher(event)
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <div
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #e1e7ef",
                                        borderRadius: "6px",
                                        padding: "18px",
                                        minHeight: "360px",
                                    }}
                                >
                                    <div style={{ marginBottom: "18px" }}>
                                        <h6
                                            style={{
                                                marginBottom: "4px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Datos del comprobante
                                        </h6>
                                        <span
                                            style={{
                                                color: "#6c757d",
                                                fontSize: "13px",
                                            }}
                                        >
                                            Completa los datos tal como figuran
                                            en el voucher o recibo.
                                        </span>
                                    </div>
                                <Row style={{ rowGap: "14px" }}>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group
                                            className="form-group fill"
                                            style={{ marginTop: "10px" }}
                                        >
                                            <Form.Label
                                                className="floating-label"
                                                style={{
                                                    background: "#ffffff",
                                                    padding: "0 4px",
                                                    left: "8px",
                                                    zIndex: 2,
                                                    ...(voucherType === ""
                                                        ? { color: "#ff5252 " }
                                                        : {}),
                                                }}
                                            >
                                                Tipo de comprobante
                                                <small className="text-danger">
                                                    {" "}
                                                    *
                                                </small>
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={voucherType}
                                                style={{
                                                    paddingLeft: "8px",
                                                    paddingRight: "8px",
                                                }}
                                                onChange={this.handleChange(
                                                    "voucherType"
                                                )}
                                            >
                                                <option
                                                    value=""
                                                    defaultValue={true}
                                                    hidden
                                                >
                                                    Seleccione tipo
                                                </option>
                                                <option
                                                    value={"Caja Tesorería"}
                                                >
                                                    Caja Tesorería
                                                </option>
                                                <option value={"Transferencia"}>
                                                    {" "}
                                                    Transferencia
                                                </option>
                                                <option value={"Deposíto"}>
                                                    {" "}
                                                    Depósito
                                                </option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label
                                                className="floating-label"
                                                style={
                                                    voucherCode === ""
                                                        ? { color: "#ff5252 " }
                                                        : null
                                                }
                                            >
                                                Nro. recibo
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="number"
                                                placeholder="Ejemplo: 0957266"
                                                // disabled={
                                                //     this.state.action !== "add"
                                                // }
                                                value={voucherCode}
                                                onChange={this.handleChange(
                                                    "voucherCode"
                                                )}
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label
                                                className="floating-label"
                                                style={
                                                    voucherAmount === ""
                                                        ? { color: "#ff5252 " }
                                                        : null
                                                }
                                            >
                                                Monto
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={voucherAmount}
                                                className="form-control"
                                                placeholder="Ejemplo: 350.00"
                                                onChange={this.handleChange(
                                                    "voucherAmount"
                                                )}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label
                                                className="floating-label"
                                                style={
                                                    voucherDate === ""
                                                        ? { color: "#ff5252 " }
                                                        : null
                                                }
                                            >
                                                Fecha
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                max="2999-12-31"
                                                value={voucherDate}
                                                placeholder="dd/mm/aaaa"
                                                onChange={this.handleChange(
                                                    "voucherDate"
                                                )}
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group
                                            className="form-group fill"
                                            style={{ marginTop: "10px" }}
                                        >
                                            <Form.Label
                                                className="floating-label"
                                                style={{
                                                    background: "#ffffff",
                                                    padding: "0 4px",
                                                    left: "8px",
                                                    zIndex: 2,
                                                    ...(voucherState === ""
                                                        ? { color: "#ff5252 " }
                                                        : {}),
                                                }}
                                            >
                                                Estado
                                                <small className="text-danger">
                                                    {" "}
                                                    *
                                                </small>
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={voucherState}
                                                style={{
                                                    paddingLeft: "8px",
                                                    paddingRight: "8px",
                                                }}
                                                onChange={this.handleChange(
                                                    "voucherState"
                                                )}
                                            >
                                                <option
                                                    value=""
                                                    defaultValue={true}
                                                    hidden
                                                >
                                                    Seleccione estado
                                                </option>
                                                <option value={"Regularizado"}>
                                                    Regularizado
                                                </option>
                                                <option value={"Registrado"}>
                                                    Registrado
                                                </option>
                                                <option value={"Aceptado"}>
                                                    {" "}
                                                    Aceptado
                                                </option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">
                                                Observacion
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={observation}
                                                placeholder="Ejemplo: pago validado por tesoreria"
                                                onChange={this.handleChange(
                                                    "observation"
                                                )}
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <div
                                            className="d-flex justify-content-end"
                                            style={{
                                                gap: "8px",
                                                marginTop: "8px",
                                            }}
                                        >
                                            <Button
                                                onClick={() => this.closeForm()}
                                                variant="light"
                                                disabled={loaderVoucher}
                                            >
                                                Cancelar
                                            </Button>
                                            {this.state.action === "add" ? (
                                            <Button
                                                onClick={() =>
                                                    this.createMovement()
                                                }
                                                variant="primary"
                                                disabled={loaderVoucher}
                                            >
                                                {loaderVoucher && (
                                                    <span
                                                        className="spinner-border spinner-border-sm mr-1"
                                                        role="status"
                                                    />
                                                )}
                                                Guardar
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    this.updateMovement()
                                                }
                                                variant="primary"
                                                disabled={loaderVoucher}
                                            >
                                                {loaderVoucher && (
                                                    <span
                                                        className="spinner-border spinner-border-sm mr-1"
                                                        role="status"
                                                    />
                                                )}
                                                Guardar Cambios
                                            </Button>
                                        )}
                                        </div>
                                    </Col>
                                </Row>
                                </div>
                            </Col>
                        </Row>
                        <hr style={{ margin: "24px 0" }} />
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #e1e7ef",
                                        borderRadius: "6px",
                                        padding: "18px",
                                    }}
                                >
                                <div style={{ marginBottom: "14px" }}>
                                    <h6
                                        style={{
                                            marginBottom: "4px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Comprobantes registrados
                                    </h6>
                                    <span
                                        style={{
                                            color: "#6c757d",
                                            fontSize: "13px",
                                        }}
                                    >
                                        Busca por numero de recibo para revisar
                                        comprobantes existentes del estudiante.
                                    </span>
                                </div>
                                <Form.Group
                                    className="form-group fill"
                                    style={{ position: "relative" }}
                                >
                                    <Form.Label className="floating-label">
                                        Buscar Nro. recibo
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="number"
                                        value={voucherSearch}
                                        placeholder="Ejemplo: 0957266, 0783573"
                                        onChange={this.handleChange(
                                            "voucherSearch"
                                        )}
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>Limpiar</Tooltip>}
                                    >
                                        <button
                                            onClick={() =>
                                                this.closeSearchVoucher()
                                            }
                                            type="button"
                                            style={{
                                                position: "absolute",
                                                right: "0",
                                                top: "22px",
                                                zIndex: 100,
                                                padding: "0",
                                                border: "none",
                                                background: "none",
                                                outline: "none",
                                                color: "#7b7f84",
                                                cursor: "pointer",
                                            }}
                                            className=" btn btn-dark"
                                        >
                                            <Close style={{ color: "dark" }} />
                                        </button>
                                    </OverlayTrigger>
                                    {voucherSearch !== "" && vouchers.length === 0 && (
                                        <div
                                            style={{
                                                color: "#6c757d",
                                                fontSize: "13px",
                                                padding: "12px 0 0",
                                            }}
                                        >
                                            No se encontraron comprobantes con
                                            ese numero.
                                        </div>
                                    )}
                                    {vouchers.length > 0 && (
                                    <Table
                                        hover
                                        responsive
                                        style={{
                                            marginTop: "12px",
                                            marginBottom: 0,
                                        }}
                                    >
                                        <tbody>
                                            {vouchers.map((r, i) => {
                                                    let person =
                                                        r.Student &&
                                                        r.Student.Person
                                                            ? r.Student.Person
                                                                  .name
                                                            : "";
                                                    let document =
                                                        r.Student &&
                                                        r.Student.Person
                                                            ? r.Student.Person
                                                                  .document_number
                                                            : "";
                                                    let program = r.Program
                                                        ? r.Program.description
                                                        : "";
                                                    return (
                                                        <tr key={i}>
                                                            <td
                                                                scope="row"
                                                                style={{
                                                                    borderTop:
                                                                        "1px solid #edf1f5",
                                                                    padding:
                                                                        "12px 0",
                                                                }}
                                                            >
                                                                <Col
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={12}
                                                                    lg={6}
                                                                    xl={6}
                                                                >
                                                                    <a
                                                                        href={
                                                                            "#"
                                                                        }
                                                                        onClick={() =>
                                                                            this.openPreviewVoucher(
                                                                                r.voucher_url
                                                                            )
                                                                        }
                                                                    >
                                                                        <h6
                                                                            className="m-b-0"
                                                                            style={{
                                                                                color: "#4680ff",
                                                                                textDecorationLine:
                                                                                    "underline",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            {
                                                                                r.voucher_code
                                                                            }
                                                                        </h6>
                                                                    </a>
                                                                    <p className="m-b-0">
                                                                        <span
                                                                            style={{
                                                                                color: "black",
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            Monto:
                                                                        </span>
                                                                        {
                                                                            r.voucher_amount
                                                                        }
                                                                        <span
                                                                            style={{
                                                                                color: "black",
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Fecha:
                                                                        </span>
                                                                        {
                                                                            r.voucher_date
                                                                        }
                                                                        <span
                                                                            style={{
                                                                                color: "black",
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Tipo:
                                                                        </span>
                                                                        {r.type}
                                                                        <span
                                                                            style={{
                                                                                color: "black",
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Estado:
                                                                        </span>
                                                                        {
                                                                            r.state
                                                                        }
                                                                    </p>
                                                                    <p className="m-b-0">
                                                                        {" "}
                                                                        {
                                                                            r.observation
                                                                        }
                                                                    </p>
                                                                    <p className="m-b-0">
                                                                        {" "}
                                                                        {person +
                                                                            "/ "}{" "}
                                                                        <span
                                                                            style={{
                                                                                color: "black",
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            {
                                                                                document
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                    <p className="m-b-0">
                                                                        {" "}
                                                                        {
                                                                            program
                                                                        }
                                                                    </p>
                                                                </Col>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </Table>
                                    )}
                                </Form.Group>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={this.state.viewVoucher}
                    size={"xl"}
                    backdrop="static"
                >
                    <Modal.Header
                        className="bg-primary"
                        style={{
                            alignItems: "center",
                            padding: "18px 24px",
                        }}
                    >
                        <Modal.Title
                            as="h5"
                            style={{
                                color: "#ffffff",
                                fontWeight: 600,
                                letterSpacing: 0,
                                margin: 0,
                            }}
                        >
                            Vista previa del comprobante
                        </Modal.Title>
                        <div className="d-inline-block ml-auto">
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{ zIndex: 100000000 }}>
                                        Cerrar
                                    </Tooltip>
                                }
                            >
                                <Close
                                    style={{
                                        color: "white",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => this.closePreviewVoucher()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            background: "#f7f9fc",
                            padding: "24px",
                        }}
                    >
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #e1e7ef",
                                        borderRadius: "6px",
                                        padding: "16px",
                                    }}
                                >
                                    <h6
                                        style={{
                                            marginBottom: "12px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Comprobante de pago
                                    </h6>
                                    <div
                                        className="position-relative d-flex align-items-center justify-content-center"
                                        style={{
                                            minHeight: "460px",
                                            background: "#fbfcfe",
                                            border: "1px solid #e1e7ef",
                                            borderRadius: "6px",
                                            padding: "12px",
                                        }}
                                    >
                                    {/*{loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                    <img
                                        ref={(ref) => (this.imgVoucher = ref)}
                                        style={{
                                            width: "100%",
                                            maxHeight: "620px",
                                            objectFit: "contain",
                                        }}
                                        src={previewVoucher || defaultTicket}
                                        alt="Comprobante de pago"
                                    />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default FormVoucher;
