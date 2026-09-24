import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import DataTable from "./DataTable";
import AdministrativeForm from "./Form";

moment.locale('es');

class Administrative extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        administratives: []
    };

    async componentDidMount() {

        if (component.ORGANIC_UNIT !== "") {
            this.listPersonAdministrative(component.ORGANIC_UNIT);
        } else {
            this.listPersonAdministrativeGOD();
        }
    }

    async listPersonAdministrative(ORGANIC_UNIT) {

        this.setState({administrativeLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.administrative;
        try {
            let data = new FormData();
            data.set('id_organic_unit', ORGANIC_UNIT);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) this.setState({administratives: res.data});
            this.setState({administrativeLoader: false});
        } catch (err) {
            this.setState({administrativeLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)
        }
    };

    async listPersonAdministrativeGOD() {

        this.setState({administrativeLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.administrative + '/g';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({administratives: res.data});
            }
            this.setState({administrativeLoader: false});
        } catch (err) {
            this.setState({administrativeLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)
        }
    };

    openForm = () => {
        this.setState({form: true});
    };
    closeForm = () => {
        this.setState({form: false});
    };
    callData = () => {
        if (component.ORGANIC_UNIT !== "") {
            this.listPersonAdministrative(component.ORGANIC_UNIT);
        } else {
            this.listPersonAdministrativeGOD();
        }
    };

    render() {


        return (
            <>

                <TitleModule
                    actualTitle={"ADMINISTRATIVOS"}
                    actualModule={"ADMINISTRATIVOS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />

                <div style={{position: 'relative'}}>
                    {this.state.administrativeLoader && component.spiner}
                    <DataTable
                        records={this.state.administratives}
                        openForm={this.openForm}
                    />
                </div>
                {this.state.form &&
                <AdministrativeForm ref={(ref) => this.Profile = ref}
                                    route={"teacher"}
                                    closeForm={this.closeForm}
                                    callData={this.callData}
                />
                }


            </>
        );
    }
}

export default Administrative;