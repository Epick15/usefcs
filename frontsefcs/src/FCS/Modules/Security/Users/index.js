import React, {Component} from 'react';
import DataTable from "./DataTable";
import Swal from "sweetalert2";
import PNotify from "pnotify/dist/es/PNotify";
import axios from 'axios';
import app from "../../../Constants/index.js"
import FormUser from "./FormUser"
import component from "../../../Component";
import TitleModule from "../../../TitleModule";


class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {

            loaderData: true, module: "USUARIOS", openFormUser: false,

            loader: false, action: "add", titleModel: "", actualID: "",

            // *******PERSON********
            denomination: "", name: '', paternal: '', maternal: '', documentNumber: '', email: '', // *******LABORAL********
            organicUnit: "", contractType: "", charge: "", startDate: "", endDate: "", // *******LABORAL********
            role: "", user: "", pas: "", retriveUserData: "", // ****************
            users: [], organicUnits: [], charges: [], contractTypes: [], roles: [],
        }
    };

    //UN REGISTRO ES A QUE UNIDAD PERTENECES COMO TRABAJADOR ==>ADMINISTRATIVO
    //Y OTRO A QUE UNIDAD GESTIONAS => ROLE USUARIO TINES QUE SER ADMINISTRATIVO PARA ESO
    // EN ESTE MODULO SOLO SE REGISTRAN A LOS ADMINISTRADORES, ESTE ROLO SOLO LO REGISTRA EL USUARIO GOD
    //UN USUARIO CON ROL ADMINISTRADOR NO PUEDE REGISTRAR OTRO ADMINISTRADOR...
    // CADA ROL Y USUARIO SE LE ASIGNA SIEMPRE A UNA PERSONA. A ECEPCION DEL USUARIO DIOS
    componentDidMount() {
        this.listUsers();
        this.getUnitOrganic();

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
                res.data.map((record, index) => this.state.organicUnits.push({
                    value: record.id, label: record.denomination + " " + record.Campu.denomination,
                }));
                // this.setState({organicUnits: res.data, showOrganicUnit: true})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!", text: "Error al obtener unidades orgánicas", delay: 2000
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
                title: "Oh no!", text: "Error al obtener roles", delay: 2000
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
                title: "Oh no!", text: "Error al obtener cargos", delay: 2000
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
                title: "Oh no!", text: "Error al obtener tipos de contrato", delay: 2000
            });
            console.log(err)
        })
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

    async updateDemiUserPass(r) {
        let pass = component.generateCode(5);
        let idUSer = r.id;
        let documentNumber = r.user;
        let email = r.Person.email;
        let name = r.Person.name;

        if (pass !== '' && email !== '' && name !== '' && idUSer !== '' && documentNumber !== '') {
            const url = app.security + '/' + app.user + '/demi/update';
            let data = new FormData();

            data.set("id_user", idUSer);
            data.set("document_number", documentNumber);
            data.set("email", email);
            data.set("name", name);
            data.set("pass", pass);


            try {
                const res = await axios.patch(url, data, app.headers);

                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            // this.setState({loader: false});
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


    openFormUser = () => {
        this.setState({openFormUser: true})
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


    openSweetUpdatePassDemi = (data) => {
        Swal.fire({
            icon: 'warning',
            title: 'Actualizar contraseña',
            text: 'Enviaremos sus datos de acceso a su correo',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Actualizar',
        }).then((result) => {
            if (result.value) {
                this.updateDemiUserPass(data);
            }
        })
    };
    openSweetDeleteUser = (id, state) => {
        Swal.fire({
            icon: 'warning',
            title: state ? 'Deshabilitar Usuario' : 'Habilitar Usuario',
            text: state ? 'El usuario no tendra acceso al Sistema' : 'El usuario podra acceder al sistema',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: state ? 'Si, Deshabilitar' : 'Si, Habilitar',
        }).then((result) => {
            if (result.value) {
                this.updateStateUser(id);
            }
        })
    };

    async updateStateUser(id) {

        try {
            this.setState({loaderVoucherDestroyMovement: true});

            const url = app.security + '/' + app.user + '/state/' + id;
            let data = new FormData();
            const res = await axios.patch(url, data, app.headers);
            PNotify.success({title: "Finalizado", text: res.data, delay: 2000});
            this.setState({loaderVoucherDestroyMovement: false});
            this.listUsers();

            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response.data.message, delay: 2000});
            this.setState({loaderVoucherDestroyMovement: false});
            return false;
        }
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
    callData = () => {
        this.listUsers()
    };
    closeForm = () => {
        this.setState({openFormUser: false})
    };

    render() {


        const {users} = this.state;
        return (<>
            <TitleModule
                actualTitle={"USUARIOS"}
                actualModule={"USUARIOS"}
                fatherModuleUrl={""} fatherModuleTitle={""}
            />
            <div style={{position: 'relative'}}>
                {this.state.loaderData && component.spiner}
                <DataTable records={users} module={this.state.module} openSweetAlert={this.openSweetAlert}
                           openFormUser={this.openFormUser}
                           openSweetUpdatePassDemi={this.openSweetUpdatePassDemi}
                           openSweetDeleteUser={this.openSweetDeleteUser}
                />
            </div>
            <FormUser
                openFormUser={this.state.openFormUser}
                retriveUserData={this.state.retriveUserData}
                callData={this.callData}
                closeForm={this.closeForm}
            />


        </>);
    }
}

export default Users;