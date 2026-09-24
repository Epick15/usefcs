import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";

import {Card, Col, Form,  Row  } from "react-bootstrap";

import DataTable from './DataTable';

moment.locale('es');

class UpdateRegistration extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,


        admissionPlanCant: "",
        organicUnit: "",
        program: "",
        admissionPlan: "",

        organicUnits: [],
        students: [],
        admissionPlans: [],
        programs: [],

    };

    async componentDidMount() {
        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.setState({organicUnit: component.ORGANIC_UNIT})
        }
    }


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
                this.setState({organicUnit: event.target.value});

                break;

            default:
                break;
        }
    };


    render() {
        const {organicUnits, organicUnit} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={"ACTUALIZACION DE MATRICULAS"}
                    actualModule={"ACTUALIZACION DE MATRICULAS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
                <Card style={{marginBottom: "5px"}}>

                    <Card.Header>
                        <Row>
                            {!component.ORGANIC_UNIT &&
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
                                                            value={r.id} key={k}> {r.denomination.toUpperCase()} </option>)

                                                    }
                                                ) :
                                                <option value={false} disabled>No se encontraron datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>

                                <br/>
                            </Col>}


                        </Row>
                    </Card.Header>
                </Card>
                <DataTable
                    organicUnit={this.state.organicUnit}
                    admissionPlanCant={this.state.admissionPlanCant}
                    records={this.state.students}/>
            </>
        );
    }
}

export default UpdateRegistration;
