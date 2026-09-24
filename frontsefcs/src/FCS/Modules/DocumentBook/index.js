import React, {Component} from 'react';
import {
    Row, Col, Card, Dropdown, Form

} from 'react-bootstrap';

import crypt from "node-cryptex";
import moment from "moment";
import TitleModule from "../../TitleModule";

import Document from "./Document";
import GenerateDocument from "./GenerateDocument";
import ActaBook from "./ActaBook";

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class Dashboard extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null, activeTab: 1


    }


    render() {
        return (
            <>
            <TitleModule
                actualTitle={"LIBRO DE DOCUMENTOS"}
                actualModule={"LIBRO DE DOCUMENTOS"}
                fatherModuleUrl={"/"} fatherModuleTitle={""}
                fatherModule2Url={""} fatherModule2Title={""}
            />
            <Row style={{padding: '15px'}}>
                <div className="nav nav-pills" role="tablist">
                    <a href={'#'} onClick={() => this.setState({activeTab: 1})}
                       className={this.state.activeTab === 1 ? "nav-link active" : "nav-link"}>D.PENDIENTES ></a>
                    <a href={'#'} onClick={() => this.setState({activeTab: 2})}
                       className={this.state.activeTab === 2 ? "nav-link active" : "nav-link"}>D.GENERADOS</a>
                    <a href={'#'} onClick={() => this.setState({activeTab: 3})}
                       className={this.state.activeTab === 3 ? "nav-link active" : "nav-link"}>ACTAS</a>

                </div>
            </Row>
            {this.state.activeTab === 1 && <Document/>}
            {this.state.activeTab === 2 && <GenerateDocument/>}
            {this.state.activeTab === 3 && <ActaBook/>}
            {/*{this.state.activeTab === 2 && <FinancierDashboard/>}*/}
        </>);
    }
}
