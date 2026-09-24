import React, {Component} from 'react';
import {
    Row,
    Col,
    Card, Dropdown, Form

} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import crypt from "node-cryptex";
import moment from "moment";
import TitleModule from "../TitleModule";
import AcademicDashboard from "./Academic"
import FinancierDashboard from "./Financier"


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class Dashboard extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,
        activeTab: 1
    }


    render() {
        return (
            <Aux>
                <TitleModule
                    actualTitle={"PRINCIPAL"}
                    actualModule={"PRINCIPAL"}
                    fatherModuleUrl={"/"} fatherModuleTitle={""}
                    fatherModule2Url={""} fatherModule2Title={""}
                />
                <Row style={{    padding: '15px'}}>
                    <div className="nav nav-pills" role="tablist">
                        <a href={DEMO.BLANK_LINK} onClick={() => this.setState({activeTab: 1})}
                           className={this.state.activeTab === 1 ? "nav-link active" : "nav-link"}>ACADEMICO</a>
                        <a href={DEMO.BLANK_LINK} onClick={() => this.setState({activeTab: 2})}
                           className={this.state.activeTab === 2 ? "nav-link active" : "nav-link"}>FINANCIERO</a>

                    </div>
                </Row>
                {this.state.activeTab === 1 && <AcademicDashboard/>}
                {this.state.activeTab === 2 && <FinancierDashboard/>}


            </Aux>
        );
    }
}
