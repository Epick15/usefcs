import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import PNotify from "pnotify/dist/es/PNotify";
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    Table,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import moment from "moment";

import crypt from "node-cryptex";
import Profile from './Profile'

import defaultUser from "../../../assets/images/user/default.jpg";


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class Person extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : null,
        searchPerson: true,
        person: '',
        persons: []
    };

    componentDidMount() {

    };

    searchPerson(params) {
        if (params === '') {
            this.setState({persons: []})
        } else {
            const url = app.person + '/' + app.persons + '-search/string/' + params;
            axios.get(url, app.headers).then(res => {
                if (res.data) this.setState({persons: res.data})
            }).catch(err => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
                console.log(err)
            })
        }

    };

    handleChange = field => event => {
        switch (field) {

            case 'person':
                this.searchPerson(event.target.value)
                this.setState({person: event.target.value});
                break;


            default:
                break;
        }
    };

    // mostrar buscador
    openSearch = () => {
        this.setState({searchPerson: true});
    };
    //ocultar el buscador y abrir el formulario vacio
    closeSearh = () => {
        this.setState({searchPerson: false});
        this.Profile.newProfile();
    };
    // ocultar y abrir formulario con datos de la persona
    selectectPerson = (r) => {
        this.setState({searchPerson: false});
        this.Profile.selectedPerson(r);

    };

    render() {
        //state backend
        const {person, searchPerson} = this.state;
        const {persons} = this.state;

        return (
            <>
                {searchPerson &&
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={4}>

                        <Card>
                            <Card.Header  style={{paddingBottom: "4px", paddingTop: "4px"}} className="bg-facebook order-card">


                                <OverlayTrigger
                                    overlay={<Tooltip>Nuevo</Tooltip>}>
                                    <Button className='btn-icon btn-rounded wid-50 align-top m-r-15'
                                            onClick={() => this.closeSearh(null)}
                                            style={{backgroundColor: '#4680ff', border: 'none'}}>
                                        <i className="material-icons">add</i>
                                    </Button>
                                </OverlayTrigger>
                                <div className="d-inline-block">
                                    <h4 className="text-white" style={{paddingTop: "8px"}}>PERSONAS</h4>
                                    {/*<p className="m-b-0">Administrativos , Docentes y*/}
                                    {/*    Estudiantes</p>*/}
                                    <i className="feather icon-user card-icon"/>
                                </div>


                            </Card.Header>
                            <Card.Body style={{marginBottom: "-25px", marginTop: "-19px"}}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Group className="form-group fill">
                                            <Form.Control
                                                type="text"
                                                // onKeyPress={this.handleKeyPress}
                                                id="number"
                                                value={person}
                                                onChange={this.handleChange('person')}
                                                placeholder="Buscar"
                                                margin="normal"
                                            />
                                            <Table hover responsive style={{marginTop: '-1px'}}>
                                                <tbody>
                                                {persons.length > 0 &&
                                                persons.map((r, i) => {
                                                    return (
                                                        <tr key={i} onClick={() => this.selectectPerson(r)}>
                                                            <td scope="row">
                                                                <div className="d-inline-block align-middle">
                                                                    <img
                                                                        // src={app.server + 'photography/' + r.photo || defaultUser}
                                                                        src={defaultUser}
                                                                        alt="user"
                                                                        className="img-radius align-top m-r-15"
                                                                        style={{width: '40px'}}
                                                                    />
                                                                    <div className="d-inline-block">
                                                                        <h6 className="m-b-0"> {r.name}</h6>
                                                                        <p className="m-b-0"> {r.document_number}</p>
                                                                    </div>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                }
                                                </tbody>
                                            </Table>

                                        </Form.Group>
                                    </Col>

                                </Row>


                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
                }


                <Profile ref={(ref) => this.Profile = ref}
                         organicUnit={this.state.organicUnit}
                         openSearch={this.openSearch}
                />


            </>
        );
    }
}
