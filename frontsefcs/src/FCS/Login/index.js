import React from 'react';

import PNotify from "pnotify/dist/es/PNotify";
import './../../assets/scss/style.scss';
import app from "../Constants";
import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";
import $ from 'jquery';
import HotKey from 'react-hot-keys';
import axios from 'axios';
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import {Button, Row, Table} from "react-bootstrap";
import crypt from 'node-cryptex';
import config from "../../config";

const k = new Buffer(32);
const v = new Buffer(16);

//gaurdo localstorage segun eso cargo los modulos roles y privilegios del usuario
class Login extends React.Component {
    state = {
        newUser: false,
        root: false,
        user: '',
        pass: '',
        loader: false,
        multipleUser: false,
        roles: [],
        sessionData: [],
        loginContent: {},
    };

    componentDidMount() {
        axios.get(`${app.web}/about`)
            .then((response) => this.setState({loginContent: response.data.content || {}}))
            // The login remains available before the content migration is applied.
            .catch(() => {});
    }

    onKeyUp = () => {
        this.setState({root: true});
        const url = app.security + '/' + app.user + '/god';
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({
                    welcome: 'ADMIN TOTAL',
                    password: '',
                    newUser: false,
                    initialUsers: res.data
                });
            }
        }).catch(() => {
            this.setState({
                newUser: true,
                snackBar: true,
                variant: 'danger',
                horizontal: 'right',
                snackBarMessage: '¡Ha ocurrido un error!'
            });
        });
        setTimeout(() => {
            const field = '#dni';
            $(field).focus();
        }, 10);


        if (this.state.newUser) {

        } else {
            this.setState({
                snackBar: true,
                variant: 'danger',
                horizontal: 'right',
                snackBarMessage: 'Acción no permitida'
            });
        }
    };

    handleChange = field => event => {
        switch (field) {
            case 'user':
                this.setState({user: event.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚÜ/0-9]/g, '')});
                break;
            case 'pass':
                this.setState({pass: event.target.value.replace(/[^A-Za-záéíóúÁÉÍÓÚÜ/0-9]/g, '')});
                break;
            default:
                break;
        }
    };

    registerNewGod() {
        const url = app.security + '/' + app.user;
        const {user, pass} = this.state;
        if (user !== '' && pass !== '') {

            let data = new FormData();
            data.set('user', user);
            data.set('pass', pass);
            axios.post(url, data, app.headers).then(() => {
                this.setState({
                    newUser: false,
                    user: '',
                    pass: ''
                });
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });

            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    };

    serverRequestSaveSession(session, role) {


        const _info = crypt.encrypt(JSON.stringify({role: role, mode: session.mode}), k, v) || '';
        localStorage.setItem('INFO', _info);

        const _user = session.user;
        localStorage.setItem('USER_ID', _user);


        const _token = session.token;
        localStorage.setItem('TOKEN', _token);

        let hourLogin = moment().format();
        let hourExpire = crypt.encrypt(moment(hourLogin).add(3, 'hours').format(), k, v);

        localStorage.setItem('_rki', hourExpire);

        // const _session = crypt.encrypt(res.data.id.toString(), k, v);
        // localStorage.setItem('SESSION_ID', _session);


        window.location.href = '/admin/';

    };

    login() {
        // validate_password
        this.setState({loader: true})
        const url = app.security + '/' + app.user + '/' + app.login;
        const {user, pass} = this.state;
        if (user !== '' && pass !== '') {
            let data = new FormData();
            data.set('user', user);
            data.set('pass', crypt.encrypt(pass, k, v));
            axios.post(url, data, app.headers).then((res) => {
                if (res.data.mode) {
                    this.serverRequestSaveSession(res.data, null);
                } else {
                    const role = JSON.parse(crypt.decrypt(res.data.info, k, v)) || false;
                    if (role.length > 1) {

                        this.setState({multipleUser: true, sessionData: res.data, roles: role})
                    } else {
                        this.serverRequestSaveSession(res.data, role[0]);
                    }
                }


            }).catch(() => {
                this.setState({loader: false})
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            this.setState({loader: false});
            PNotify.notice({
                title: "Advertencia ACTUAL!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    render() {
        const {newUser, user, pass, root, multipleUser, roles, loginContent} = this.state;
        const loginEntityName = loginContent.login_entity_name || config.entityName;
        const loginWelcomeTitle = loginContent.login_welcome_title || 'Bienvenido!';
        const loginWelcomeDescription = loginContent.login_welcome_description || `Inicie en su cuenta y explore las funcionalidades del software de gestion de ${loginEntityName}`;
        const loginFormTitle = loginContent.login_form_title || 'Iniciar Sesion';
        const loginFormDescription = loginContent.login_form_description || 'Por favor ingrese usuario y contraseña';
        const loginTextColor = /^#[0-9a-f]{6}$/i.test(loginContent.login_text_color || '')
            ? loginContent.login_text_color
            : '#7c003e';
        const loginBackgroundTextColor = /^#[0-9a-f]{6}$/i.test(loginContent.login_background_text_color || '')
            ? loginContent.login_background_text_color
            : '#ffffff';
        const loginFormPosition = ['left', 'center', 'right'].includes(loginContent.login_form_position)
            ? loginContent.login_form_position
            : 'right';
        const loginBackgroundTextVisible = loginContent.login_background_text_visible !== false;
        const loginBackgroundUrl = loginContent.login_background_url
            ? `${app.server.replace(/\/api\/?$/, '')}${loginContent.login_background_url}`
            : null;
        return (
            <>
                <Breadcrumb/>
                <div
                    className={`auth-wrapper align-items-stretch aut-bg-img login-form-${loginFormPosition}`}
                    style={loginBackgroundUrl ? {backgroundImage: `url("${loginBackgroundUrl}")`} : null}
                >
                    <div className="flex-grow-1">
                        <div className="h-100 d-md-flex align-items-center auth-side-img">
                            {loginBackgroundTextVisible && (
                                <div className="col-sm-10 auth-content w-auto">
                                    {/*<img src={authLogo} alt="" className="img-fluid"/>*/}
                                    <h1 className="my-4" style={{color: loginBackgroundTextColor}}>{loginWelcomeTitle}</h1>
                                    <h4 className="font-weight-normal" style={{color: loginBackgroundTextColor}}>{loginWelcomeDescription}</h4>
                                </div>
                            )}
                        </div>
                        <div className="auth-side-form">
                            <div className=" auth-content">
                                {/*<img src={authLogoDark} alt="" className="img-fluid mb-4 d-block d-xl-none d-lg-none"/>*/}
                                <h1 className="mb-3" style={{color: loginTextColor}}>{loginEntityName}</h1>
                                {
                                    root && newUser ?
                                        <Row style={{marginLeft: '0px'}}>
                                            <Tooltip title={"Volver"}>
                                                <Button className='btn-icon' variant='' style={{marginTop: '-4px'}}
                                                        onClick={() => this.setState({
                                                            root: false,
                                                            newUser: false
                                                        })}>
                                                    <i className="material-icons">close</i>
                                                </Button>
                                            </Tooltip>
                                            <h3 className="mb-3">Registrar <span
                                                className="text-c-blue">Super Usuario</span></h3>

                                        </Row>


                                        :
                                        root ?
                                            <Row style={{marginLeft: '0px'}}>

                                                <h3 className="mb-3">Super <span
                                                    className="text-c-blue">Usuario</span>
                                                </h3>
                                                <Tooltip title={"Volver"}>
                                                    <Button className='btn-icon' variant='' style={{marginTop: '-4px'}}
                                                            onClick={() => this.setState({
                                                                root: false,
                                                                newUser: false
                                                            })}>
                                                        <i className="material-icons">close</i>
                                                    </Button>
                                                </Tooltip>

                                            </Row>
                                            :
                                            <h3 className="mb-3" style={{color: loginTextColor}}>{loginFormTitle}</h3>

                                }


                                {
                                    root && newUser ?
                                        !multipleUser &&
                                        <p>Vamos a configurar el Sistema, Por favor registre un usuario y
                                            contraseña</p>
                                        :
                                        !multipleUser &&
                                        <p style={{color: loginTextColor}}>{loginFormDescription}</p>
                                }
                                {multipleUser && <p>Por favor Seleccione un Usuario</p>}
                                {
                                    !multipleUser ?
                                        <>
                                            <div className="input-group mb-3">
                                                <input type="email" className="form-control"
                                                       value={user}
                                                       onChange={this.handleChange('user')}
                                                       placeholder={root && newUser ? 'Usuario' : 'DNI'}/>
                                            </div>
                                            <div className="input-group mb-4">
                                                <input type="password" className="form-control" placeholder="Contraseña"
                                                       value={pass}
                                                       onKeyPress={this.handleKeyPress}
                                                       onChange={this.handleChange('pass')}/>
                                            </div>
                                        </>
                                        :


                                        <Table responsive hover>
                                            <tbody>
                                            {roles.length > 0 &&
                                            roles.map((r, i) => {
                                                return (
                                                    <tr key={i}
                                                        onClick={() => this.serverRequestSaveSession(this.state.sessionData, r)}>
                                                        <td>
                                                            <div className="d-inline-block align-middle">
                                                                <div className="d-inline-block">
                                                                    <h6 className="m-b-0"
                                                                        style={{color: '#37474f'}}>{r.Organic_unit.denomination}</h6>
                                                                    <p className="m-b-0"
                                                                       style={{color: '#37474f'}}>{r.Role.denomination}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }

                                            </tbody>
                                        </Table>

                                }


                                {
                                    root && newUser ?
                                        !multipleUser &&
                                        <button className="btn btn-block btn-primary mb-0"
                                                onClick={() => this.registerNewGod()}>Registrar</button>
                                        :
                                        !multipleUser &&
                                        <button className="btn btn-block btn-primary mb-0"
                                                onClick={() => this.login()}>Iniciar {this.state.loader &&
                                        <span className="spinner-border spinner-border-sm mr-1"
                                              role="status"/>}</button>
                                }


                            </div>
                        </div>
                    </div>
                </div>
                <HotKey
                    keyName="ctrl+shift+alt+a"
                    onKeyUp={this.onKeyUp}
                />
            </>
        );
    }
}

export default Login;
