import React, {Component} from 'react';
import {Row} from 'react-bootstrap';

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
                <main className="admin-dashboard">
                    <section className="dashboard-intro">
                        <div>
                            <span className="dashboard-eyebrow">Panel de control</span>
                            <h1>Resumen institucional</h1>
                            <p>Consulta los principales indicadores académicos y financieros en un solo lugar.</p>
                        </div>
                        <div className="dashboard-status">
                            <i className="feather icon-activity"/>
                            Datos actualizados en tiempo real
                        </div>
                    </section>

                    <Row className="dashboard-navigation-row">
                        <div className="nav nav-pills dashboard-tabs" role="tablist" aria-label="Secciones del panel">
                            <a href={DEMO.BLANK_LINK} onClick={(event) => {
                                event.preventDefault();
                                this.setState({activeTab: 1});
                            }}
                               className={this.state.activeTab === 1 ? "nav-link active" : "nav-link"}>
                                <i className="fas fa-graduation-cap"/> Académico
                            </a>
                            <a href={DEMO.BLANK_LINK} onClick={(event) => {
                                event.preventDefault();
                                this.setState({activeTab: 2});
                            }}
                               className={this.state.activeTab === 2 ? "nav-link active" : "nav-link"}>
                                <i className="fas fa-chart-line"/> Financiero
                            </a>
                        </div>
                    </Row>
                    <section className="dashboard-content">
                        {this.state.activeTab === 1 && <AcademicDashboard/>}
                        {this.state.activeTab === 2 && <FinancierDashboard/>}
                    </section>
                </main>


            </Aux>
        );
    }
}
