import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';

import Configuration from './Configuration';
import Loader from "../Loader";
import rutas from "../../../routes";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";
import app from "../../../FCS/Constants";
import axios from "axios";
import crypt from "node-cryptex";

const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

class AdminLayout extends Component {
    state = {
        moduless: [], router: [], typeUser: '',
    }

    componentDidMount() {


        info.mode ? this.getModule() : this.getModules(info.role.id_role);


    }

    // modulos para el usuario DEMI falta c eambiar por for en lugar de map para hacer continue
    getModules = (id) => {

        const url = app.security + '/' + app.module + '/nav/' + app.role + '/' + id;
        axios.get(url, app.headers).then(res => {

            if (res.data) {
                let datos = [];
                for (let i in res.data) {
                    for (let j in res.data[i].children) {
                        if ((res.data[i].children[j].Privilege.length === 0) || (res.data[i].children[j].Privilege.find(p => p.permit === '1') === undefined) || (res.data[i].children[j].Privilege.find(p => p.permit === '1').state === false)) {
                            delete res.data[i].children[j]
                        }
                        if (res.data[i].children[j] && res.data[i].children[j].children) {
                            for (let k in res.data[i].children[j].children) {
                                if ((res.data[i].children[j].children[k].Privilege.length === 0) || (res.data[i].children[j].children[k].Privilege.find(p => p.permit === '1') === undefined) || (res.data[i].children[j].children[k].Privilege.find(p => p.permit === '1').state === false)) {
                                    delete res.data[i].children[j].children[k]
                                }
                                if (res.data[i].children[j].children[k] !== undefined) {
                                    datos.push(res.data[i].children[j].children[k])
                                }

                            }
                        }
                    }
                }
                this.setState({moduless: res.data, router: datos});

            } else {
                console.log('No tiene permisos de ningun modulo')
            }

        }).catch(err => {

            console.log(err)
        })
    };


    getModule() {
        const url = app.security + '/' + app.module + '/nav';
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({moduless: res.data})
        }).catch(err => {
            console.log(err);
        })
    }


    fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.props.onFullScreenExit();
        }
    };

    UNSAFE_componentWillMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onUNSAFE_componentWillMount();
        }
    }

    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onUNSAFE_componentWillMount();
        }
    }

    render() {
        /* full screen exit call */
        document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);
        let menu = []
        if (info.mode) {

            menu = rutas.god.map((route, index) => {
                return (route.component) ? (<Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (<route.component {...props} />)}/>) : (null);
            });


        } else {
            if (info.role.Role.denomination === 'Administrador') {
                menu = rutas.administrador.map((route, index) => {
                    return (route.component) ? (<Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (<route.component {...props} />)}/>) : (null);
                });
            }
            if (info.role.Role.denomination === 'Contabilidad') {
                menu = rutas.contabilidad.map((route, index) => {
                    return (route.component) ? (<Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (<route.component {...props} />)}/>) : (null);
                })
            }
            if (info.role.Role.denomination === 'Academico') {
                menu = rutas.academico.map((route, index) => {
                    return (route.component) ? (<Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (<route.component {...props} />)}/>) : (null);
                })
            }
            if (info.role.Role.denomination === 'Sunedu') {
                menu = rutas.sunedu.map((route, index) => {
                    return (route.component) ? (<Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (<route.component {...props} />)}/>) : (null);
                })
            }
            if (info.role.Role.denomination === 'Egresos') {
                menu = rutas.sunedu.map((route, index) => {
                    return (route.component) ? (<Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (<route.component {...props} />)}/>) : (null);
                })
            }
            // MPT
            if (info.role.Role.denomination === 'Visualizador') {
                menu = rutas.visualizador.map((route, index) => {
                    return (route.component) ? (<Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (<route.component {...props} />)}/>) : (null);
                })
            }
        }


        let mainClass = ['pcoded-wrapper'];
        if (this.props.layout === 'horizontal' && this.props.subLayout === 'horizontal-2') {
            mainClass = [...mainClass, 'container'];
        }
        return (<Aux>
            <Fullscreen enabled={this.props.isFullScreen}>
                <Navigation moduless={this.state.moduless}/>
                <NavBar/>
                <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
                    <div className={mainClass.join(' ')}>
                        <div className="pcoded-content" style={{marginTop: "100px"}}>
                            <div className="pcoded-inner-content">
                                <div className="main-body">
                                    <div className="page-wrapper">
                                        <Suspense fallback={<Loader/>}>
                                            <Switch>
                                                {menu}
                                                <Redirect from="/" to={this.props.defaultPath}/>
                                            </Switch>
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fullscreen>

        </Aux>);
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.defaultPath,
        isFullScreen: state.isFullScreen,
        collapseMenu: state.collapseMenu,
        layout: state.layout,
        subLayout: state.subLayout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({type: actionTypes.FULL_SCREEN_EXIT}),
        onUNSAFE_componentWillMount: () => dispatch({type: actionTypes.COLLAPSE_MENU})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));
