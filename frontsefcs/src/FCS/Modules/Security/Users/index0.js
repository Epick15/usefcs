import React, {Component} from 'react';
import {Row, Col, Modal, Form, Button} from 'react-bootstrap';
import DataTable from "./DataTable";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import axios from 'axios';
import app from "../../../Constants/index.js"
import Select from "react-select";
import component from "../../../Component";
import TitleModule from "../../../TitleModule";


class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {

            loaderData: true,
            module: "USUARIOS",
            showModal: false,
            loader: false,
            action: "add",
            titleModel: "",
            actualID: "",

            // *******PERSON********
            denomination: "",
            name: '',
            paternal: '',
            maternal: '',
            documentNumber: '',
            email: '',
            // *******LABORAL********
            organicUnit: "",
            contractType: "",
            charge: "",
            startDate: "",
            endDate: "",
            // *******LABORAL********
            role: "",
            user: "",
            pas: "",
            // ****************
            users: [],
            organicUnits: [],
            charges: [],
            contractTypes: [],
            roles: [],
        }
    };

    //UN REGISTRO ES A QUE UNIDAD PERTENECES COMO TRABAJADOR ==>ADMINISTRATIVO
    //Y OTRO A QUE UNIDAD GESTIONAS => ROLE USUARIO TINES QUE SER ADMINISTRATIVO PARA ESO
    // EN ESTE MODULO SOLO SE REGISTRAN A LOS ADMINISTRADORES, ESTE ROLO SOLO LO REGISTRA EL USUARIO GOD
    //UN USUARIO CON ROL ADMINISTRADOR NO PUEDE REGISTRAR OTRO ADMINISTRADOR...
    // CADA ROL Y USUARIO SE LE ASIGNA SIEMPRE A UNA PERSONA. A ECEPCION DEL USUARIO DIOS
    componentDidMount() {
        this.listUsers();
        // this.getUnitOrganic();

        this.getRoles();
        this.getCharges();
        this.getContractTypes();

    }

    async listUsers() {
        this.setState({loaderData: true});
        const url = app.security + '/' + app.users;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({users: res.data});

            this.setState({loaderData: false})


        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    getUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                res.data.map((record, index) =>
                    this.state.organicUnits.push({
                        value: record.id,
                        label: record.denomination + " " + record.Campu.denomination,
                    }));
                // this.setState({organicUnits: res.data, showOrganicUnit: true})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };


    getRoles() {
        const url = app.security + '/' + app.role;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({roles: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener roles",
                delay: 2000
            });
            console.log(err)
        })
    };

    getCharges() {
        const url = app.general + '/' + app.charge;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({charges: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener cargos",
                delay: 2000
            });
            console.log(err)
        })
    };

    getContractTypes() {
        const url = app.general + '/' + app.contractType;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({contractTypes: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener tipos de contrato",
                delay: 2000
            });
            console.log(err)
        })
    };


    async save() {
        this.setState({loader: true});
        const {name, paternal, maternal, documentNumber, email, organicUnit, contractType, charge, startDate, endDate, user, pass, role} = this.state;


        if (name !== "" && paternal !== "" && maternal !== "" && documentNumber !== "" && email !== "" && organicUnit !== "" && contractType !== "" && charge !== "" && startDate !== "" && endDate !== "" && user !== "" && pass !== "" && role !== "") {
            const url = app.security + '/' + app.user + '/create';
            let data = new FormData();


            data.set("name", name);
            data.set("paternal", paternal);
            data.set("maternal", maternal);
            data.set("document_number", documentNumber);
            data.set("email", email);
            data.set("id_organic_unit", organicUnit);
            data.set("id_contract_type", contractType);
            data.set("id_charge", charge);
            data.set("start_date", startDate);
            data.set("end_date", endDate);
            data.set("id_role", role);
            data.set("user", user);
            data.set("pass", pass);
            try {
                const res = await axios.post(url, data, app.headers);
                this.listUsers();
                this.closeModal();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    async update() {

        this.setState({loader: true});
        const {denomination, category} = this.state;

        if (denomination !== '' && category !== '') {

            const url = app.general + '/' + app.Seeting + '/' + this.state.actualID;
            let data = new FormData();
            data.set('denomination', denomination);
            data.set('category', category);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.listSeeting();
                this.closeModal();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };


    async delete(id) {
        try {
            const url = app.general + '/' + app.Seeting + '/' + id;
            const res = await axios.delete(url, app.headers);

            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loader: false});
            this.listSeeting();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') this.state.action === "add" ? this.save() : this.update()
    };

    openModal = () => {
        let code = component.generateCode(5);
        console.log(code)
        this.setState({
            action: "add",
            showModal: !this.state.showModal,
            titleModal: "REGISTRAR " + this.state.module,
            denomination: "",
            category: "",
            pass: code
        })
    };

    openEditModal = (r) => {

        this.openModal();
        this.setState({
            action: "update",
            titleModal: "EDITAR " + this.state.module,
            denomination: r.denomination,
            category: r.type,
            actualID: r.id
        });
    };

    openSweetAlert = (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            type: 'warning',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            showLoaderOnConfirm: true,
            preConfirm: async (state) => {
                if (!state) {
                    throw new Error("Ok")
                }
                const deleteRecord = await this.delete(id);
                return deleteRecord
            },


        })
    };
    handleChange = field => event => {
        switch (field) {
            case 'name':
                this.setState({name: event.target.value});
                break;
            case 'paternal':
                this.setState({paternal: event.target.value});
                break;
            case 'maternal':
                this.setState({maternal: event.target.value});
                break;
            case 'documentNumber':
                this.setState({documentNumber: event.target.value, user: event.target.value});
                break;
            case 'email':
                this.setState({email: event.target.value});
                break;
            case 'organicUnit':
                this.setState({organicUnit: event.value});
                break;
            case 'contractType':
                this.setState({contractType: event.target.value});
                break;
            case 'charge':
                this.setState({charge: event.target.value});
                break;

            case 'startDate':
                this.setState({startDate: event.target.value});
                break;
            case 'endDate':
                this.setState({endDate: event.target.value});
                break;

                break;
            case 'pass':
                this.setState({pass: event.target.value});
                break;
            case 'role':
                this.setState({role: event.target.value});
                break;
            default:
                break;
        }
    };

    render() {

        const {showModal, loader, action, titleModal, pass} = this.state;
        const {
            denomination, name, paternal, maternal, documentNumber, email,
            organicUnit, contractType, charge, startDate, endDate,
            role, user, pas,
        } = this.state;
        const {users, organicUnits, charges, contractTypes, roles} = this.state;
        return (
            <>
                <TitleModule
                    actualTitle={"CONFIGURACIÓN"}
                    actualModule={"CONFIGURACIÓN"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <div style={{position: 'relative'}}>
                    {this.state.loaderData && component.spiner}
                    <DataTable records={users} module={this.state.module} openSweetAlert={this.openSweetAlert} openModal={this.openModal} openEditModal={this.openEditModal}/>
                </div>

                <Modal show={showModal}>
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{titleModal}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeModal}> <i className="feather icon-x" style={{fontSize: "20px", color: 'white'}}></i> </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <h5>Datos personales</h5>
                                <br/>
                            </Col>
                            <Col xs={12} sm={12} md={6} xl={6} lg={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Documento de indentidad</Form.Label>
                                    <Form.Control
                                        type="number"

                                        value={documentNumber}
                                        name={"documentNumber"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('documentNumber')}
                                        placeholder="Descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} xl={6} lg={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Nombre</Form.Label>
                                    <Form.Control
                                        type="text"

                                        value={name}
                                        name={"name"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('name')}
                                        placeholder="Descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} xl={6} lg={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Apellido Paterno</Form.Label>
                                    <Form.Control
                                        type="text"

                                        value={paternal}
                                        name={"paternal"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('paternal')}
                                        placeholder="Apellido paterno"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={6} xl={6} lg={6}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Apellido Materno</Form.Label>
                                    <Form.Control
                                        type="text"

                                        value={maternal}
                                        name={"maternal"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('maternal')}
                                        placeholder="Apellido materno"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>

                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Correo electronico</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={email}
                                        name={"email"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('email')}
                                        placeholder="Correo electronico"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <h5>Datos laborales</h5>
                                <br/>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill " style={{zIndex: 10000}}>
                                    <Form.Label className="floating-label">Unidad Organica Pertenece</Form.Label>
                                    <Select
                                        className="form-control"
                                        classNamePrefix="select "
                                        onChange={this.handleChange('organicUnit')}
                                        name="semester"
                                        options={organicUnits}
                                        placeholder="Seleccione un semestre de la mención"
                                        styles={component.selectSearchStyle}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Cargo</Form.Label>
                                    <Form.Control as="select"
                                                  value={charge}
                                                  onChange={this.handleChange('charge')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una
                                            opcción</option>
                                        {
                                            charges.length > 0 ?
                                                charges.map((r, index) => {

                                                    return (
                                                        <option value={r.id} key={index}>
                                                            {r.denomination}
                                                        </option>
                                                    )

                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Tipo contrato</Form.Label>
                                    <Form.Control as="select"
                                                  value={contractType}
                                                  onChange={this.handleChange('contractType')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una
                                            opcción</option>
                                        {
                                            contractTypes.length > 0 ?
                                                contractTypes.map((r, index) => {

                                                    return (
                                                        <option value={r.id} key={index}>
                                                            {r.denomination}
                                                        </option>
                                                    )

                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Fecha de inicio</Form.Label>
                                    <input type="date"

                                           className="form-control"
                                           onChange={this.handleChange('startDate')}
                                           max="2999-12-31"
                                           value={startDate}
                                    />

                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Fecha fin</Form.Label>
                                    <input type="date"

                                           className="form-control"
                                           onChange={this.handleChange('endDate')}
                                           max="2999-12-31"
                                           value={endDate}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <h5>Datos de acceso</h5>
                                <br/>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Rol</Form.Label>
                                    <Form.Control as="select"
                                                  value={role}
                                                  onChange={this.handleChange('role')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una
                                            opcción</option>
                                        {
                                            roles.length > 0 ?
                                                roles.map((r, index) => {

                                                    return (
                                                        <option value={r.id} key={index}>
                                                            {r.denomination}
                                                        </option>
                                                    )

                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={documentNumber}
                                        name={"documentNumber"}
                                        disabled={true}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('documentNumber')}
                                        placeholder="Usuario"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Contraseña</Form.Label>
                                    <Form.Control
                                        type="text"
                                        disabled={true}
                                        value={pass}
                                        name={"pass"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('pass')}
                                        placeholder="Contraseña"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {action === 'add' ?
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.save()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.update()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>

                </Modal>

            </>
        );
    }
}

export default Users;