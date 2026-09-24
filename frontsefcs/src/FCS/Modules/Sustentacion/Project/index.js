import React, {Component} from 'react';
import {
    Row, Col, Card, Dropdown, Form

} from 'react-bootstrap';


import PNotify from "pnotify/dist/es/PNotify";

import app from "../../../Constants";
import crypt from "node-cryptex";
import axios from "axios";
import moment from "moment";

import DataTableProjet from "./DataTable/DataTableProjet";

import component from "../../../Component";
import TitleModule from "../../../TitleModule";

import FormProject from "./Form"
import FormAccess from "./Access"
// moment.locale('es');


moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';
export default class Project extends Component {
    state = {
        organicUnit: info.role ? info.role.id_organic_unit : '',
        loader: false,
        formProject: false,
        formAccess: false,
        dataRetrive: '',
        organicUnits: [],
        projects: [],

    }


    componentDidMount() {
        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.setState({organicUnit: component.ORGANIC_UNIT})
            this.listSimpleProgramByOrganicUnitRegisterID(component.ORGANIC_UNIT);
        }


    }

    async listSimpleProgramByOrganicUnitRegisterID(id) {
        this.setState({programsLoader: true});
        const url = app.programs + '/' + app.program + '/s-' + app.organicUnit + '-register/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({programs: res.data});
            }
            this.setState({programsLoader: false})

        } catch (err) {
            this.setState({programsLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los Programas de estudio", delay: 2000});
            console.log(err)

        }

    };

    async listProjectByOrganicUnitID(id) {
        this.setState({loader: true});
        const url = app.programs + '/' + app.project + '/' + app.organicUnit + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {

                this.setState({projects: res.data});
            }


            this.setState({loader: false});
        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los planes", delay: 2000});
            console.log(err)

        }

    };

    listUnitOrganic() {
        const url = app.general + '/' + app.organicUnit;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({organicUnits: res.data})
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al obtener unidades orgánicas",
                delay: 2000
            });
            console.log(err)
        })
    };


    handleChange = field => event => {
        switch (field) {

            case 'organicUnit':

                this.listProjectByOrganicUnitID(event.target.value)

                this.setState({
                    organicUnit: event.target.value
                });

                break;

            default:
                break;
        }
    }

    callData = () => {
        this.listProjectByOrganicUnitID(this.state.organicUnit)
    }
    openFormProject = () => {
        this.setState({formProject: true, dataRetrive: ''})
    }

    openEditFormProject = (r) => {
        this.setState({formProject: true, dataRetrive: r})
    }
    closeFormProject = () => {
        this.setState({formProject: false, dataRetrive: ''})
    }


    openAccessProject = (r) => {
        this.setState({formAccess: true, dataRetrive: r})
    }
    closeAccessProject = () => {
        this.setState({formAccess: false, dataRetrive: ''})
    }

    render() {
        const {organicUnit, organicUnits} = this.state;
        return (<>
            {this.state.loader && component.spiner}
            <TitleModule
                actualTitle={"SUTENTACIONES"}
                actualModule={"SUTENTACIONES"}
                fatherModuleUrl={"/"} fatherModuleTitle={""}
                fatherModule2Url={""} fatherModule2Title={""}
            />
            <Row style={{padding: '15px'}}>
                <div className="nav nav-pills" role="tablist">
                    <a href={'#'} onClick={() => this.setState({activeTab: 1})}
                       className={"nav-link active"}>PROYECTOS ></a>
                    <a href={'#'} onClick={() => this.setState({activeTab: 2})}
                       className={"nav-link"}>TESIS</a>

                </div>


            </Row>
            <Row>
                <Col>
                    {!component.ORGANIC_UNIT &&
                        <Card style={{marginBottom: "5px"}}>

                            <Card.Header style={{paddingBottom: '0px'}}>
                                <Row>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>


                                        <Form.Group className="form-group fill">
                                            <Form.Label className="floating-label"

                                            >Unidad Organica<small className="text-danger"> *</small></Form.Label>
                                            <Form.Control as="select"
                                                          value={organicUnit}
                                                          onChange={this.handleChange('organicUnit')}
                                            >
                                                >
                                                <option defaultValue={true} hidden>Unidad</option>
                                                {
                                                    organicUnits.length > 0 ?
                                                        organicUnits.map((r, k) => {

                                                                return (<option
                                                                    value={r.id}
                                                                    key={k}> {r.denomination.toUpperCase() + ' - ' + r.Campu.denomination.toUpperCase()}
                                                                </option>)

                                                            }
                                                        ) :
                                                        <option value={false} disabled>No se encontraron datos</option>
                                                }
                                            </Form.Control>
                                        </Form.Group>

                                        <br/>
                                    </Col>


                                </Row>
                            </Card.Header>
                        </Card>}
                </Col>

                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <DataTableProjet records={this.state.projects}
                                     callData={this.callData}
                                     openEditFormProject={this.openEditFormProject}
                                     openAccessProject={this.openAccessProject}
                                     openFormProject={this.openFormProject}
                                     createDocument={this.createDocument}
                    />
                </Col>
                {this.state.formProject &&
                    <FormProject closeFormProject={this.closeFormProject} organicUnit={this.state.organicUnit}
                                 dataRetrive={this.state.dataRetrive}/>}
                {this.state.formAccess &&
                    <FormAccess closeAccessProject={this.closeAccessProject} organicUnit={this.state.organicUnit}
                                dataRetrive={this.state.dataRetrive}/>}
            </Row>
        </>);
    }

}
