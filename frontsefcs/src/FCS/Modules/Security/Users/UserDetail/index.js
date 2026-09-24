import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import { Card,  Table} from 'react-bootstrap';

import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../../../TitleModule";
import app from "../../../../Constants";


moment.locale('es');



class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {

            userID: "",
            user: "",
            namePerson: "",
            userRoles: [],

        };

    }

    componentDidMount() {
        const userID = atob(this.props.match.params.id);
        userID && this.listUserID(userID);
        this.setState({userID: userID});
    }

    async listUserID(id) {

        const url = app.security + '/' + app.user + '/' + id + '/' + app.roles;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                let namePerson = "";
                if (res.data.Person) {
                    namePerson = res.data.Person.name + " " + res.data.Person.paternal + " " + res.data.Person.maternal + " / " + res.data.Person.document_number;
                }else{
                    namePerson="No definido"
                }
                this.setState({user: res.data, userRoles: res.data.User_roles,namePerson});


            }


        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes de estudio", delay: 2000});
            console.log(err)

        }

    };

    render() {


        const {namePerson} = this.state;
        const {userRoles} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={namePerson}
                    actualModule={"DETALLE USUARIO ROLES"}
                    fatherModuleUrl={"/setting/users"} fatherModuleTitle={"USUARIOS"}
                    fatherModule2Url={""} fatherModule2Title={""}
                />

                <Card style={{marginBottom: "5px"}}>
                    <Card.Header>
                        <h5> Listado de Roles</h5>


                    </Card.Header>
                    <Card.Body>
                        <Table ref="tbl" striped hover responsive bordered id="data-table-zero">
                            <thead>
                            <tr>
                                <th>Rol</th>
                                <th>Unidad organica</th>
                                <th>Estado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                userRoles.length > 0 &&
                                userRoles.map((r, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{r.Role.denomination}</td>
                                            <td>{r.Organic_unit.denomination}</td>
                                            <td>{r.state ? "Habilitado" : "Inhabilitado"}</td>
                                        </tr>
                                    )
                                })
                            }


                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>


            </>
        );
    }
}

export default withRouter(UserDetail)