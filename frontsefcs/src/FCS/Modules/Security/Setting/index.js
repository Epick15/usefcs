import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import UitDataTable from "./DataTable/UitDataTable";
import AuthorityDataTable from "./DataTable/AuthorityDataTable";
import ConfigDataTable from "./DataTable/ConfigDataTable";
import FormUit from "./Form/FormUit";
import BankAccountDataTable from "./DataTable/BankAccountDataTable";
import FormBankAccount from "./Form/FormBankAccount";
import FormAuthority from "./Form/FormAuthority";
import FormOrganicUnit from "./Form/FormOrganicUnit";

import PNotify from "pnotify/dist/es/PNotify";
import axios from 'axios';
import app from "../../../Constants/index.js"
import TitleModule from "../../../TitleModule";
import OrganicUnitDataTable from "./DataTable/OrganicUnitTable";


const loadingComponent = (
    <div style={{
        position: 'absolute',
        zIndex: 110,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.8)'
    }}>
        <span className="spinner-border spinner-border-sm mr-1" role="status"/>
    </div>
);

class StudyLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaderBankAccount: false,
            loaderUit: false,
            loaderAuthority: false,
            loaderConfig: false,
            loaderOrganicUnit: false,

            formModalBankAccount: false,
            titleFormModalBankAccount: "",
            retriveBankAccount: "",
            deleteBankAccount: "",

            formModalUit: false,
            titleFormModalUit: "",
            retriveUit: "",
            deleteUit: "",
            formModalAuthority: false,
            retriveAuthority: "",
            formModalOrganicUnit: false,
            retriveOrganicUnit: "",

            loader: false,
            action: "add",
            titleModel: "",
            actualID: "",
            url: this.props.match.url.replace("/master/", ""),
            // ***************
            denomination: "",
            // ****************
            bankAccounts: [],
            authoritys: [],
            organicUnits: [],
            campuses: [],
            configs: [],
            uits: [],
        }
    };

    async componentDidMount() {
        this.listOrganictUnit();
        this.listBankAccount();
        this.listUit();
        this.listAuthority();
        this.listConfig();
        this.listCampus();

    }

    async listCampus() {
        try {
            const res = await axios.get(app.general + '/' + app.campus, app.headers);
            if (res.data) this.setState({campuses: res.data});
        } catch (err) {
            console.log(err);
        }
    }

    async listBankAccount() {
        this.setState({loaderBankAccount: true});
        const url = app.general + '/' + app.bankAccount;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({bankAccounts: res.data});
            this.setState({loaderBankAccount: false});
        } catch (err) {
            this.setState({loaderBankAccount: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listOrganictUnit() {
        this.setState({loaderOrganicUnit: true});
        const url = app.general + '/' + app.organicUnit + '/all/unit';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({organicUnits: res.data});
            this.setState({loaderOrganicUnit: false});
        } catch (err) {
            this.setState({loaderOrganicUnit: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listUit() {
        this.setState({loaderUit: true});
        const url = app.general + '/' + app.uit;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({uits: res.data});
            this.setState({loaderUit: false});
        } catch (err) {
            this.setState({loaderUit: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }


    async updateActualUit(id) {
        this.setState({loaderUit: true});
        const url = app.general + '/' + app.uit + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({uits: res.data});
            this.setState({loaderUit: false});
        } catch (err) {
            this.setState({loaderUit: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listAuthority() {
        this.setState({loaderAuthority: true});
        const url = app.general + '/' + app.authority;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({authoritys: res.data});
            this.setState({loaderAuthority: false});
        } catch (err) {
            this.setState({loaderAuthority: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async updateStateOrganicUnit(id) {
        this.setState({loaderOrganicUnit: true});
        const url = app.general + '/update-' + app.organicUnit + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.listOrganictUnit()
            this.setState({loaderOrganicUnit: false});
        } catch (err) {
            this.setState({loaderOrganicUnit: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async listConfig() {
        this.setState({loaderConfig: true});
        const url = app.general + '/' + app.config;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({configs: res.data});
            this.setState({loaderConfig: false});
        } catch (err) {
            this.setState({loaderConfig: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }

    async updateStateConfig(id) {
        this.setState({loaderConfig: true});
        const url = app.general + '/update-' + app.config + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.listConfig()
            this.setState({loaderConfig: false});
        } catch (err) {
            this.setState({loaderConfig: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }
    async updateStateAuthority(id) {
        this.setState({loaderAuthority: true});
        const url = app.general + '/update-' + app.authority + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.listAuthority()
            this.setState({loaderAuthority: false});
        } catch (err) {
            this.setState({loaderAuthority: false});
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)

        }

    }
    callData = async () => {
        this.listBankAccount();
    };

    callDataUit = async () => {
        this.listUit();
    };
    callDataAuthority = async () => {
        this.listAuthority();
    };
    callDataOrganicUnit = async () => {
        this.listOrganictUnit();
    };

    openFormModalAuthority = () => {
        this.setState({formModalAuthority: true, retriveAuthority: ""});
    };
    closeFormModalAuthority = () => {
        this.setState({formModalAuthority: false, retriveAuthority: ""});
    };
    editFormModalAuthority = authority => {
        this.setState({formModalAuthority: true, retriveAuthority: authority});
    };
    closeFormModalOrganicUnit = () => {
        this.setState({formModalOrganicUnit: false, retriveOrganicUnit: ""});
    };
    editFormModalOrganicUnit = organicUnit => {
        this.setState({formModalOrganicUnit: true, retriveOrganicUnit: organicUnit});
    };


    handleKeyPress = (e) => {
        if (e.key === 'Enter') this.state.action === "add" ? this.save() : this.update()
    };

    openFormModalBankAccount = () => {
        this.setState({

            formModalBankAccount: true,
            titleFormModalBankAccount: "REGISTRAR CUENTA BANCARIA",
        })
    };
    closeFormModalBankAccount = () => {
        this.setState({formModalBankAccount: false, retriveBankAccount: "", deleteBankAccount: ""})
    };
    editFormModalBankAccount = (r) => {
        this.setState({
            retriveBankAccount: r,
            formModalBankAccount: !this.state.formModalBankAccount,
            titleFormModalBankAccount: "ACTUALIZAR CUENTA BANCARIA",
        });
    };
    sweetDeleteBankAccount = (id) => {
        console.log("auiii", id)
        this.setState({
            deleteBankAccount: id
        });
    };

    openFormModalUit = () => {
        this.setState({

            formModalUit: true,
            titleFormModalUit: "REGISTRAR CUENTA BANCARIA",
        })
    };
    closeFormModalUit = () => {
        this.setState({formModalUit: false, retriveUit: "", deleteUit: ""})
    };
    editFormModalUit = (r) => {
        this.setState({
            retriveUit: r,
            formModalUit: !this.state.formModalUit,
            titleFormModalUit: "ACTUALIZAR CUENTA BANCARIA",
        });
    };
    sweetDeleteUit = (id) => {
        console.log("auiii", id)
        this.setState({
            deleteUit: id
        });
    };

    handleChange = field => event => {
        switch (field) {
            case 'denomination':
                this.setState({denomination: event.target.value.replace(/[^ A-Za-záéíóúÁÉÍÓÚÜ/]/g, '').toUpperCase()});
                break;
            default:
                break;
        }
    };
    actualUit = async (r) => {
        this.updateActualUit(r)
    };
    stateAuthority = async (r) => {
        this.updateStateAuthority(r)
    };
    stateOrganicUnit = async (r) => {
        this.updateStateOrganicUnit(r)
    };
    stateConfig = async (r) => {
        this.updateStateConfig(r)
    };

    render() {

        const {bankAccounts, uits, authoritys, organicUnits, configs, campuses} = this.state;
        return (
            <>  <TitleModule
                actualTitle={"CONFIGURACIÓN"}
                actualModule={"CONFIGURACIÓN"}
                fatherModuleUrl={""} fatherModuleTitle={""}
                fatherModule2Url={""} fatherModule2Title={""}

            />
                <Row>
                    <Col xs={12}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderOrganicUnit && loadingComponent}
                            <OrganicUnitDataTable records={organicUnits}
                                                   stateOrganicUnit={this.stateOrganicUnit}
                                                   editFormModalOrganicUnit={this.editFormModalOrganicUnit}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{paddingTop: '10px'}}>
                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderConfig && loadingComponent}
                            <ConfigDataTable records={configs}
                                             stateConfig={this.stateConfig}
                            />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderBankAccount && loadingComponent}
                            <BankAccountDataTable records={bankAccounts} openSweetAlert={this.openSweetAlert}
                                                  openFormModalBankAccount={this.openFormModalBankAccount}
                                                  editFormModalBankAccount={this.editFormModalBankAccount}
                                                  sweetDeleteBankAccount={this.sweetDeleteBankAccount}
                            />
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderUit && loadingComponent}
                            <UitDataTable records={uits} openSweetAlert={this.openSweetAlert}
                                          openFormModalUit={this.openFormModalUit}
                                          editFormModalUit={this.editFormModalUit}
                                          actualUit={this.actualUit}
                                          sweetDeleteUit={this.sweetDeleteUit}/>
                        </div>
                    </Col>
                </Row>
                <Row style={{paddingTop: '10px'}}>
                    <Col xs={12}>
                        <div style={{position: 'relative'}}>
                            {this.state.loaderAuthority && loadingComponent}
                            <AuthorityDataTable records={authoritys}
                                                stateAuthority={this.stateAuthority}
                                                openFormModalAuthority={this.openFormModalAuthority}
                                                editFormModalAuthority={this.editFormModalAuthority}
                            />
                        </div>
                    </Col>
                </Row>

                <FormBankAccount
                    callData={this.callData}
                    formModalBankAccount={this.state.formModalBankAccount}
                    retriveBankAccount={this.state.retriveBankAccount}
                    deleteBankAccount={this.state.deleteBankAccount}
                    closeFormModalBankAccount={this.closeFormModalBankAccount}
                />
                <FormUit
                    callDataUit={this.callDataUit}
                    formModalUit={this.state.formModalUit}
                    retriveUit={this.state.retriveUit}
                    deleteUit={this.state.deleteUit}
                    closeFormModalUit={this.closeFormModalUit}
                />
                <FormAuthority
                    callDataAuthority={this.callDataAuthority}
                    formModalAuthority={this.state.formModalAuthority}
                    authority={this.state.retriveAuthority}
                    organicUnits={organicUnits}
                    closeFormModalAuthority={this.closeFormModalAuthority}
                />
                <FormOrganicUnit
                    visible={this.state.formModalOrganicUnit}
                    record={this.state.retriveOrganicUnit}
                    campuses={campuses}
                    closeFormModalOrganicUnit={this.closeFormModalOrganicUnit}
                    callDataOrganicUnit={this.callDataOrganicUnit}
                />


            </>
        );
    }
}

export default StudyLevel;
