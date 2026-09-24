import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../../TitleModule";
import app from "../../../Constants";
import ContractDataTable from "./DataTable/ContractDataTable";
import component from "../../../Component";
import ChargeForm from "../../../Component/ChargeForm";

moment.locale('es');

class AdministrativeContract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ORGANIC_UNIT: component.ORGANIC_UNIT,
            PERSONID: "",
            user: "",
            namePerson: "",
            contracts: [],
            contractsLoader: false,
            comisionLoader: false,
            form: false,
            ChargeForm: false,
            retriveData: "",
            optionDelete: ""
        };
    }

    async componentDidMount() {
        const PERSONID = atob(this.props.match.params.id);

        this.setState({
            PERSONID: PERSONID,

        });
        if (component.ORGANIC_UNIT !== "") {
            PERSONID && this.retrivePersonAdministrative(PERSONID, component.ORGANIC_UNIT);
        } else {
            this.retrivePersonAdministrativeGOD(PERSONID);
        }
    }

    async retrivePersonAdministrative(id, ORGANIC_UNIT) {
        let namePerson = "";
        this.setState({contractsLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.administrative + '/' + id;
        try {
            let data = new FormData();
            data.set('id_organic_unit', ORGANIC_UNIT);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                namePerson = res.data.name;
                this.setState({namePerson, contracts: res.data.Administratives});
            }

            this.setState({contractsLoader: false});
        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err);
            this.setState({contractsLoader: false});
        }

    };

    async retrivePersonAdministrativeGOD(id,) {
        let namePerson = "";
        this.setState({contractsLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.administrative + '/' + id + '/g';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                namePerson = res.data.name;
                this.setState({namePerson, contracts: res.data.Administratives});
            }

            this.setState({contractsLoader: false});
        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err);
            this.setState({contractsLoader: false});
        }

    };

    openForm = () => {
        this.setState({form: true, ChargeForm: true})
    };
    closeForm = () => {
        this.setState({ChargeForm: false, form: false, retriveData: "", optionDelete: ""})
    };
    callData = async () => {
        if (component.ORGANIC_UNIT !== "") {
            this.retrivePersonAdministrative(this.state.PERSONID, component.ORGANIC_UNIT);
        } else {
            this.retrivePersonAdministrativeGOD(this.state.PERSONID);
        }
    };
    retriveContract = async (r) => {
        this.openForm();
        this.setState({retriveData: r});
    };
    deleteContractSweet = async (optionDelete) => {
        this.setState({optionDelete: optionDelete, ChargeForm: true});
    };

    render() {
        const {namePerson} = this.state;
        const {contracts} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={namePerson}
                    actualModule={"CONTRATACIONES"}
                    fatherModuleUrl={"/administrative"} fatherModuleTitle={"ADMINISTRATIVOS"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <div style={{position: 'relative'}}>
                    {this.state.contractsLoader && component.spiner}
                    <ContractDataTable records={contracts}
                                       openForm={this.openForm}
                                       retriveContract={this.retriveContract}
                                       deleteContractSweet={this.deleteContractSweet}
                    />
                </div>

                <br/>
                {/*<div style={{position: 'relative'}}>*/}
                {/*    {this.state.comisionLoader && component.spiner}*/}
                {/*    <ComissionDataTable records={[]}/>*/}
                {/*</div>*/}
                {this.state.ChargeForm &&
                <ChargeForm route={"administrative"}
                            personID={this.state.PERSONID}
                            retriveData={this.state.retriveData}
                            optionDelete={this.state.optionDelete}
                            formModal={this.state.form}
                            closeForm={this.closeForm}
                            callData={this.callData}
                />
                }


            </>
        );
    }
}

export default withRouter(AdministrativeContract)