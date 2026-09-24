import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
import Close from "@material-ui/icons/Close";
import defaultTicket from "../../../../assets/images/ticket/defaultTicket.png";
import $ from 'jquery';
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import Swal from "sweetalert2";


moment.locale('es');
const token = localStorage.getItem('TOKEN') || null;

class FormVoucher extends React.Component {
    state = {
        form: this.props.form,
        studentID: this.props.studentID,
        retriveMovement: this.props.retriveMovement,
        action: "add",
        preview: "",
        file: '',
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
        vouchers: []
    };

    async componentDidMount() {


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.form !== this.props.form) {
            this.setState({form: this.props.form})
        }
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID && this.setState({studentID: this.props.studentID})
        }
        if (prevProps.programID !== this.props.programID) {
            this.props.programID && this.setState({programID: this.props.programID})
        }
        if (prevProps.organicUnit !== this.props.organicUnit) {
            this.props.organicUnit && this.setState({organicUnit: this.props.organicUnit})
        }
        if (prevProps.retriveMovement !== this.props.retriveMovement) {
            this.props.retriveMovement !== "" && this.retriveData(this.props.retriveMovement);
        }

        if (prevProps.deleteMovementID !== this.props.deleteMovementID) {
            this.props.deleteMovementID !== "" && this.openMovementSweetAlert(this.props.deleteMovementID);
        }
    }

    async searchVoucherStudent(params) {

        try {
            if (params === '') {
                this.setState({vouchers: []})
            } else {
                const url = app.accounting + '/' + app.movement + '/' + app.student + '/search/' + params;
                let data = new FormData();
                const res = await axios.get(url, data, app.headers)
                if (res.data) this.setState({vouchers: res.data})

            }
        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: 2000});
            console.log(err)
        }


    };

    async createMovement() {

        this.setState({loaderVoucher: true});
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            file,
            studentID,
            observation,
            voucherType,
            voucherState
        } = this.state;
        const {organicUnit, programID} = this.props;
        const url = app.accounting + '/' + app.movement;

        if (organicUnit !== '' && programID !== '' && voucherCode !== '' && voucherDate !== '' && voucherAmount !== '' && file !== '' && studentID !== '' && voucherState !== '' && voucherType !== '') {
            let data = new FormData();
            data.set('id_student', studentID);
            data.set('id_organic_unit', organicUnit);
            data.set('id_program', programID);

            data.set('file', file);
            data.set("voucher_code", voucherCode);
            data.set("voucher_amount", voucherAmount);
            data.set("voucher_date", voucherDate);
            data.set("observation", observation);
            data.set("type", voucherType);
            data.set("state", voucherState);

            try {
                const res = await axios.post(url, data, app.headers);
                this.setState({loaderVoucher: false});
                this.props.callListMovement();
                this.closeForm();
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000
                });

            } catch (err) {
                this.setState({loaderVoucher: false});
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data,
                    delay: 2000
                })
            }
        } else {
            this.setState({loaderVoucher: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }


    };

    async updateMovement() {
        this.setState({loaderVoucher: true});
        const {
            voucherCode,
            voucherDate,
            voucherAmount,
            file,
            studentID,
            observation,
            voucherState,
            voucherType
        } = this.state;
        const url = app.accounting + '/' + app.movement + '/' + this.state.movementID;
        if (voucherCode !== '' && voucherDate !== '' && voucherAmount !== '' && studentID !== '' && voucherType !== '' && voucherState !== '') {
            let data = new FormData();
            data.set('id_student', studentID);
            data.set('file', file);
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
                this.setState({loaderVoucher: false});
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
            } catch (err) {
                this.setState({loaderVoucher: false});
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data,
                    delay: 2000
                })

            }

        } else {
            this.setState({loaderVoucherPerson: false})
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000
            });
        }


    };

    async destroyMovement(id) {

        try {
            this.setState({loaderVoucherDestroyMovement: true});
            const url = app.accounting + '/' + app.movement + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderVoucherDestroyMovement: false});
            this.props.callListMovement();
            this.closeForm();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.error, delay: 2000});
            this.setState({loaderVoucherDestroyMovement: false});
            return false;
        }
    };

    async listVoucher(voucher_url) {
        this.setState({conceptLoader: true});
        const url = app.server + app.voucher + voucher_url
        try {

            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'x-accesss-token': token
                }
            });
            if (res.data) {
                const imgUrl = window.URL.createObjectURL(new Blob([res.data]));
                // this.imgVoucher.src = imgUrl

                this.setState({preview: imgUrl})
            }


            this.setState({conceptLoader: false});
        } catch (err) {
            this.setState({conceptLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    async listPreviewVoucher(voucher_url) {
        this.setState({conceptLoader: true});
        const url = app.server + app.voucher + voucher_url
        try {

            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'x-accesss-token': token
                }
            });
            if (res.data) {
                const imgUrl = window.URL.createObjectURL(new Blob([res.data]));
                // this.imgVoucher.src = imgUrl

                this.setState({previewVoucher: imgUrl})
            }


            this.setState({conceptLoader: false});
        } catch (err) {
            this.setState({conceptLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    retriveData = (r) => {
        this.listVoucher(r.voucher_url);
        this.setState({
            action: 'update',
            movementID: r.id,
            // preview: r.voucher_url ? app.server + app.voucher + r.voucher_url : defaultTicket,
            voucherCode: r.voucher_code,
            voucherDate: r.voucher_date,
            voucherAmount: r.voucher_amount,
            observation: r.observation,
            voucherState: r.state,
            voucherType: r.type,
        })
    };
    handleChange = field => event => {

        switch (field) {
            case 'voucherCode':
                let voucherCode = event.target.value;
                this.setState({voucherCode: voucherCode.slice(0, 30)});
                break;
            case 'voucherAmount':
                this.setState({

                    voucherAmount: event.target.value.slice(0, 8)
                });
                break;
            case 'voucherDate':
                this.setState({voucherDate: event.target.value});
                break;
            case 'voucherSearch':
                this.setState({voucherSearch: event.target.value});
                this.searchVoucherStudent(event.target.value)
                break;
            case 'observation':
                this.setState({observation: event.target.value});
                break;
            case 'voucherState':
                this.setState({voucherState: event.target.value});
                break;
            case 'voucherSearch':
                this.setState({voucherSearch: event.target.value});
                break;
            case 'voucherType':
                this.setState({voucherType: event.target.value});
                break;
            default:
                break;
        }
    };
    openFileReader = () => {
        const input = '#inputVaucher';
        $(input).click();
    };
    changeVaucher = (event) => {
        const fileExtension = ['jpg', 'jpeg', 'png'];
        const input = '#inputVaucher';
        let value = $(input).val().split('.').pop().toLowerCase();
        console.log(value)
        if ($.inArray(value, fileExtension) === -1) {
            let message = "Por favor use estos formatos: " + fileExtension.join(', ');
            PNotify.notice({title: "Error", text: message, delay: 2000});
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onload = () => {
                this.setState({
                    file: file,
                    // imgSize: 'wid-500 text-center',
                    preview: reader.result,
                    status: true
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
        this.setState({file: '', preview: null});
        const input = '#inputAvatar';
        $(input).val('');
    };
    closeForm = () => {
        this.setState({
            vouchers: [],
            form: false,
            preview: "",
            file: '',
            voucherCode: "",
            voucherDate: "",
            voucherAmount: "",
            observation: "",
            voucherState: "",
            voucherSearch: "",
            voucherType: "",
            action: "add",
        })
        this.props.closeForm()
    }
    openMovementSweetAlert = async (id) => {
        try {
            const alert = await Swal.fire({
                title: 'Estás seguro?',
                text: "Este paso es irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminar!',
                cancelButtonText: 'No, Cancelar'
            });
            alert.isConfirmed ? await this.destroyMovement(id) : this.props.closeForm();
        } catch (e) {
            console.log('error:', e);
            return false;
        }
    };
    closeSearchVoucher = () => {
        this.setState({
            voucherSearch: '',
            vouchers: [],
        });
    };
    openPreviewVoucher = (voucher_url) => {
        this.listPreviewVoucher(voucher_url)
        this.setState({viewVoucher: true})
    }
    closePreviewVoucher = () => {

        this.setState({viewVoucher: false, previewVoucher: ''})
    }

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
            vouchers
        } = this.state;

        return (
            <>
                <Modal show={this.state.form} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5"
                                     style={{color: '#ffffff'}}>{this.state.action === "add" ? "REGISTRAR" : "EDITAR"} VOUCHER
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}}
                                       onClick={() => this.closeForm()}
                                />

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Comprobante de pago
                                                (PNG,JPG,JPEG)</Form.Label>
                                        </Form.Group>
                                        <div className="position-relative d-inline-block mb-4">
                                            {/*{loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                            <img

                                                ref={(ref) => this.imgVoucher = ref}
                                                style={preview ? {marginTop: "-25px", width: "100%"} : {
                                                    marginTop: "-25px",
                                                    width: "30%"
                                                }}
                                                onClick={this.openFileReader}
                                                src={preview || defaultTicket}
                                                alt="User"/>
                                        </div>
                                        <input
                                            type="file"
                                            id="inputVaucher"
                                            style={{display: 'none'}}
                                            onChange={(event) => this.changeVaucher(event)}

                                        />

                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>


                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={voucherType === "" ? {color: "#ff5252 "} : null}
                                            >Tipo Comprobante<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control as="select"
                                                          value={voucherType}
                                                          onChange={this.handleChange('voucherType')}>

                                                <option defaultValue={true} hidden>seleccione</option>
                                                <option value={"Caja Tesorería"}>Caja Tesorería</option>
                                                <option value={"Transferencia"}> Transferencia</option>
                                                <option value={"Deposíto"}> Deposíto</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={voucherCode === "" ? {color: "#ff5252 "} : null}
                                            >N° Recibo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="number"
                                                disabled={this.state.action !== 'add'}
                                                value={voucherCode}
                                                onChange={this.handleChange('voucherCode')}
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={voucherAmount === "" ? {color: "#ff5252 "} : null}
                                            >Monto</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={voucherAmount}
                                                className="form-control"
                                                onChange={this.handleChange('voucherAmount')}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={voucherDate === "" ? {color: "#ff5252 "} : null}
                                            >Fecha</Form.Label>
                                            <Form.Control
                                                type="date"
                                                max="2999-12-31"
                                                value={voucherDate}
                                                onChange={this.handleChange('voucherDate')}
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"
                                                        style={voucherState === "" ? {color: "#ff5252 "} : null}
                                            >Estado<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control as="select"
                                                          value={voucherState}
                                                          onChange={this.handleChange('voucherState')}>
                                                <option defaultValue={true} hidden>seleccione</option>
                                                <option value={"Regularizado"}>Regularizado</option>
                                                <option value={"Registrado"}>Registrado</option>
                                                <option value={"Aceptado"}> Aceptado</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label">Observación</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={observation}
                                                onChange={this.handleChange('observation')}
                                                margin="normal"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        {
                                            this.state.action === "add" ?

                                                <Button
                                                    className="pull-right mr-1"
                                                    onClick={() => this.createMovement()}
                                                    variant="primary"
                                                    disabled={loaderVoucher}
                                                >
                                                    {loaderVoucher &&
                                                        <span className="spinner-border spinner-border-sm mr-1"
                                                              role="status"/>}
                                                    Guardar</Button>
                                                :
                                                <Button
                                                    className="pull-right mr-1"
                                                    onClick={() => this.updateMovement()}
                                                    variant="primary"
                                                    disabled={loaderVoucher}
                                                >
                                                    {loaderVoucher &&
                                                        <span className="spinner-border spinner-border-sm mr-1"
                                                              role="status"/>}
                                                    Guardar Cambios</Button>

                                        }


                                    </Col>


                                </Row>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label"

                                    > Buscar N° Recibo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="number"
                                        value={voucherSearch}
                                        onChange={this.handleChange('voucherSearch')}
                                        margin="normal"
                                    />
                                    <OverlayTrigger
                                        overlay={<Tooltip>LIMPIAR</Tooltip>}>
                                        <button
                                            onClick={() => this.closeSearchVoucher()}
                                            type="button"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#7b7f84',
                                                marginTop: '-30px', float: 'right'
                                            }}
                                            className=" btn btn-dark"><Close
                                            style={{color: "dark"}}/></button>
                                    </OverlayTrigger>
                                    <Table hover responsive style={{marginTop: '-1px'}}>
                                        <tbody>
                                        {vouchers.length > 0 &&
                                            vouchers.map((r, i) => {
                                                let person = r.Student && r.Student.Person ? r.Student.Person.name : '';
                                                let document = r.Student && r.Student.Person ? r.Student.Person.document_number : '';
                                                let program = r.Program ? r.Program.description : '';
                                                let preview = r.voucher_url !== '' ? app.server + app.voucher + r.voucher_url : '';
                                                return (
                                                    <tr key={i}>
                                                        <td scope="row">


                                                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                                                                <a href={'#'}
                                                                   onClick={() => this.openPreviewVoucher(r.voucher_url)}>
                                                                    <h6 className="m-b-0"
                                                                        style={{
                                                                            color: '#4680ff',
                                                                            textDecorationLine: 'underline'
                                                                        }}> {r.voucher_code}</h6>
                                                                </a>
                                                                <p className="m-b-0">
                                                                <span
                                                                    style={{
                                                                        color: 'black',
                                                                        fontWeight: 'bold'
                                                                    }}>Monto:</span>{r.voucher_amount}
                                                                    <span
                                                                        style={{
                                                                            color: 'black',
                                                                            fontWeight: 'bold'
                                                                        }}> Fecha:</span>{r.voucher_date}
                                                                    <span
                                                                        style={{
                                                                            color: 'black',
                                                                            fontWeight: 'bold'
                                                                        }}> Tipo:</span>{r.type}
                                                                    <span
                                                                        style={{
                                                                            color: 'black',
                                                                            fontWeight: 'bold'
                                                                        }}> Estado:</span>{r.state}

                                                                </p>
                                                                <p className="m-b-0"> {r.observation}</p>
                                                                <p className="m-b-0"> {person + '/ '} <span
                                                                    style={{
                                                                        color: 'black',
                                                                        fontWeight: 'bold'
                                                                    }}>{document}</span></p>
                                                                <p className="m-b-0"> {program}</p>

                                                            </Col>


                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </Table>
                                </Form.Group>


                            </Col>

                        </Row>

                    </Modal.Body>
                </Modal>
                <Modal show={this.state.viewVoucher} size={"xl"} backdrop="static">
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5"
                                     style={{color: '#ffffff'}}>VOUCHER
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                                <Close style={{color: "white"}}
                                       onClick={() => this.closePreviewVoucher()}
                                />

                            </OverlayTrigger>


                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Comprobante de pago
                                        (PNG,JPG,JPEG)</Form.Label>
                                </Form.Group>
                                <div className="position-relative d-inline-block mb-4">
                                    {/*{loadImg && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}*/}
                                    <img

                                        ref={(ref) => this.imgVoucher = ref}
                                        style={preview ? {marginTop: "-25px", width: "100%"} : {
                                            marginTop: "-25px",
                                            width: "30%"
                                        }}

                                        src={previewVoucher || defaultTicket}
                                        alt="User"/>
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
