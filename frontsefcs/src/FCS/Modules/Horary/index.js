import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import DataTable from "./DataTable";
import {Card, Col, Form, Row} from "react-bootstrap";
import Workload from "./Workload";
import ModalActa from "./FormModalActa";

moment.locale('es');

class Horary extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        organicUnit: '',
        form: false,
        horaryLoader: false,


        organicUnits: [],


    };

    async componentDidMount() {

        this.listUnitOrganic()
        if (component.ORGANIC_UNIT !== "") {
            this.setState({organicUnit: component.ORGANIC_UNIT})
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
                    actualTitle={"HORARIOS"}
                    actualModule={"HORARIOS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />
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
                <div style={{position: 'relative'}}>
                    {this.state.horaryLoader && component.spiner}

                    <DataTable
                        records={[]}
                        organicUnit={this.state.organicUnit}
                        retriveStudent={this.retriveStudent}
                        deleteStudentsweet={this.deleteStudentsweet}
                        ref={(ref) => this.DataTableData = ref}
                    />

                </div>



            </>
        );
    }

}

export default Horary;

/**
 * Generamos en Schedule, los cursos segun el plan actual
 * @params id_semester
 * @params id_program
 */
/**
 * hacer el comentario y luego enter
 */