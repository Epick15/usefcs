import React, {Component} from 'react';
import {Dropdown} from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";
import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
import Avatar2 from '../../../../../assets/images/user/avatar-2.jpg';
import crypt from 'node-cryptex';
import axios from 'axios';
import app from "../../../../../FCS/Constants";
import {Redirect} from "react-router-dom";
import defaultUser from "../../../../../assets/images/user/default.jpg";

const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

class NavRight extends Component {
    state = {
        listOpen: false, loader: false, preview: defaultUser, role: "",

    };

    componentDidMount() {

        const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

        const userID = localStorage.getItem('USER_ID') ? localStorage.getItem('USER_ID') : '';
        const ROLE = info.role;
        ROLE ? this.getUserInformation(userID) : this.setState({
            name: 'DIOSTREVER', emailUnsm: '?@unsm.edu.pe', role: "dios", organicUnit: "GOD MODE",
        });
    }


    getUserInformation(userID) {

        const url = app.security + '/' + app.user + '/' + crypt.decrypt(userID, k, v);

        axios.get(url, app.headers).then(res => {
            const data = JSON.parse(crypt.decrypt(res.data, k, v));

            if (data) {
                this.setState({
                    name: data.Person.name,
                    emailUnsm: data.email,
                    preview: data.photo ? app.server + 'photography/' + data.photo : defaultUser,
                    role: info.role.Role.denomination,
                    organicUnit: info.role.Organic_unit.denomination,

                });
            }
        }).catch((err) => {
            console.log(err)
        });
    };

    logout = () => {
        localStorage.clear();
        window.location.href = '/admin/login';
    };

    render() {
        const {name, preview, role, organicUnit} = this.state;
        return (<Aux>
                {/*<div>*/}
                {/*    <h6 className="d-inline-block m-b-0 text-white">CALENDARIO ACADEMICO 2020</h6><br/>*/}
                {/*</div>*/}


                <ul className="navbar-nav ml-auto">
                    {/*<li>*/}
                    {/*    <Dropdown alignRight={!this.props.rtlLayout}>*/}
                    {/*        <Dropdown.Toggle variant={'link'} id="dropdown-basic">*/}
                    {/*            <i className="feather icon-bell icon"/>*/}
                    {/*        </Dropdown.Toggle>*/}
                    {/*        <Dropdown.Menu alignRight className="notification">*/}
                    {/*            <div className="noti-head">*/}
                    {/*                <h6 className="d-inline-block m-b-0">Notifications</h6>*/}
                    {/*                <div className="float-right">*/}
                    {/*                    <a href={DEMO.BLANK_LINK} className="m-r-10">mark as read</a>*/}
                    {/*                    <a href={DEMO.BLANK_LINK}>clear all</a>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div style={{height: '300px'}}>*/}
                    {/*                <PerfectScrollbar>*/}
                    {/*                    <ul className="noti-body">*/}
                    {/*                        <li className="n-title">*/}
                    {/*                            <p className="m-b-0">NEW</p>*/}
                    {/*                        </li>*/}
                    {/*                        <li className="notification">*/}
                    {/*                            <div className="media">*/}
                    {/*                                <img className="img-radius" src={Avatar1}*/}
                    {/*                                     alt="Generic placeholder"/>*/}
                    {/*                                <div className="media-body">*/}
                    {/*                                    <p><strong>John Doe</strong><span className="n-time text-muted"><i*/}
                    {/*                                        className="icon feather icon-clock m-r-10"/>5 min</span></p>*/}
                    {/*                                    <p>New ticket Added</p>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </li>*/}
                    {/*                        <li className="n-title">*/}
                    {/*                            <p className="m-b-0">EARLIER</p>*/}
                    {/*                        </li>*/}
                    {/*                        <li className="notification">*/}
                    {/*                            <div className="media">*/}
                    {/*                                <img className="img-radius" src={Avatar2}*/}
                    {/*                                     alt="Generic placeholder"/>*/}
                    {/*                                <div className="media-body">*/}
                    {/*                                    <p><strong>Joseph William</strong><span*/}
                    {/*                                        className="n-time text-muted"><i*/}
                    {/*                                        className="icon feather icon-clock m-r-10"/>10 min</span>*/}
                    {/*                                    </p>*/}
                    {/*                                    <p>Prchace New Theme and make payment</p>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </li>*/}
                    {/*                        <li className="notification">*/}
                    {/*                            <div className="media">*/}
                    {/*                                <img className="img-radius" src={Avatar1}*/}
                    {/*                                     alt="Generic placeholder"/>*/}
                    {/*                                <div className="media-body">*/}
                    {/*                                    <p><strong>Sara Soudein</strong><span*/}
                    {/*                                        className="n-time text-muted"><i*/}
                    {/*                                        className="icon feather icon-clock m-r-10"/>12 min</span>*/}
                    {/*                                    </p>*/}
                    {/*                                    <p>currently login</p>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </li>*/}
                    {/*                        <li className="notification">*/}
                    {/*                            <div className="media">*/}
                    {/*                                <img className="img-radius" src={Avatar2}*/}
                    {/*                                     alt="Generic placeholder"/>*/}
                    {/*                                <div className="media-body">*/}
                    {/*                                    <p><strong>Joseph William</strong><span*/}
                    {/*                                        className="n-time text-muted"><i*/}
                    {/*                                        className="icon feather icon-clock m-r-10"/>30 min</span>*/}
                    {/*                                    </p>*/}
                    {/*                                    <p>Prchace New Theme and make payment</p>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </li>*/}
                    {/*                    </ul>*/}
                    {/*                </PerfectScrollbar>*/}
                    {/*            </div>*/}
                    {/*            <div className="noti-footer">*/}
                    {/*                <a href={DEMO.BLANK_LINK}>show all</a>*/}
                    {/*            </div>*/}
                    {/*        </Dropdown.Menu>*/}
                    {/*    </Dropdown>*/}
                    {/*</li>*/}
                    <li>
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-user"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={preview} className="img-radius" alt="User Profile"/>
                                    <span>{name}</span>
                                    <hr/>
                                    <span>{role}</span>
                                    <hr/>
                                    <span>{organicUnit}</span>

                                </div>

                                <ul className="pro-body">
                                    <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i
                                        className="feather icon-settings"/> Configuración</a></li>
                                    <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i
                                        className="feather icon-user"/> Perfil</a></li>
                                    <li>
                                        <a href={DEMO.BLANK_LINK}
                                           onClick={() => this.logout()}
                                           className="dropdown-item">
                                            <i className="feather icon-lock"/> Cerrar
                                            Sesion {this.state.loader &&
                                            <span className="spinner-border spinner-border-sm mr-1"
                                                  role="status"/>}</a></li>
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </Aux>);
    }
}

export default NavRight;
