import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';


import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../../../TitleModule";
import app from "../../../../Constants";
import component from "../../../../Component";
import DataTable from "./DataTable";


moment.locale('es');


class UserLog extends Component {

    constructor(props) {
        super(props);
        this.state = {

            userID: "",
            user: "",
            namePerson: "",
            request: [],

        };

    }

    componentDidMount() {
        const userID = atob(this.props.match.params.id);
        userID && this.listUserLogID(userID);
        this.setState({userID: userID});
    }

    async listUserLogID(id) {

        const url = app.security + '/' + app.user + '/' + id + '/log';
        try {
            const res = await axios.get(url, app.headers);


            let namePerson = "";
            if (res.data.User) {
                if (res.data.User.Person) {
                    namePerson = res.data.User.Person.name + " / " + res.data.User.Person.document_number;
                } else {
                    namePerson = "No definido"
                }
            } else {
                namePerson = "No definido"
            }
            this.setState({request: res.data.Request, namePerson: namePerson});


        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: 2000});
            console.log(err)

        }

    };

    refreshData = () => {
        this.listUserLogID(this.state.userID)
    }

    render() {


        const {namePerson} = this.state;
        const {request} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={namePerson}
                    actualModule={"LOG DE USUARIO"}
                    fatherModuleUrl={"/setting/users"} fatherModuleTitle={"USUARIOS"}
                    fatherModule2Url={""} fatherModule2Title={""}
                />

                <div style={{position: 'relative'}}>
                    {this.state.loaderData && component.spiner}
                    <DataTable records={request} module={"PETICIONES"} openSweetAlert={this.openSweetAlert}
                               openFormUser={this.openFormUser}
                               refreshData={this.refreshData}
                               openSweetUpdatePassDemi={this.openSweetUpdatePassDemi}
                    />
                </div>

            </>
        );
    }
}

export default withRouter(UserLog)