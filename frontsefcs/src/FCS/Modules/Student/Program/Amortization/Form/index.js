import React from 'react';
import { Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip} from 'react-bootstrap';


import moment from 'moment';
import 'moment/locale/es';
import component from "../../../../../Component";

import Close from "@material-ui/icons/Close";


moment.locale('es');


class FormAcademicRecord extends React.Component {
    state = {};

    componentDidMount() {
        this.setState({organicUnit: {value: component.ORGANIC_UNIT}});

        if (component.ORGANIC_UNIT !== "") {

        }

    };


    render() {



        return (


            <Modal show={false} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5" style={{color: '#ffffff'}}>REGISTRAR CURSOS</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}}
                                // onClick={() => this.closeForm()}
                            />

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>


                    <Row>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                    // style={civilStatu === "" ? {color: "#ff5252 "} : null}
                                >Concepto <small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                    // value={civilStatu}
                                    // onChange={this.handleChange('civilStatu')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Estado civil</option>
                                    {/*{*/}
                                    {/*    civilStatus.length > 0 ?*/}
                                    {/*        civilStatus.map((civilStatu, index) => {*/}
                                    {/*            // if (bank.state) {*/}
                                    {/*            return (*/}
                                    {/*                <option value={civilStatu.id}*/}
                                    {/*                        key={index}>*/}
                                    {/*                    {civilStatu.denomination}*/}
                                    {/*                </option>*/}
                                    {/*            )*/}
                                    {/*            // }*/}
                                    {/*        }) :*/}
                                    {/*        <option defaultValue={true}>Error al cargar los*/}
                                    {/*            Datos</option>*/}
                                    {/*}*/}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                    // style={civilStatu === "" ? {color: "#ff5252 "} : null}
                                >Calenadario Academico <small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                    // value={civilStatu}
                                    // onChange={this.handleChange('civilStatu')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Estado civil</option>
                                    {/*{*/}
                                    {/*    civilStatus.length > 0 ?*/}
                                    {/*        civilStatus.map((civilStatu, index) => {*/}
                                    {/*            // if (bank.state) {*/}
                                    {/*            return (*/}
                                    {/*                <option value={civilStatu.id}*/}
                                    {/*                        key={index}>*/}
                                    {/*                    {civilStatu.denomination}*/}
                                    {/*                </option>*/}
                                    {/*            )*/}
                                    {/*            // }*/}
                                    {/*        }) :*/}
                                    {/*        <option defaultValue={true}>Error al cargar los*/}
                                    {/*            Datos</option>*/}
                                    {/*}*/}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label"
                                    // style={civilStatu === "" ? {color: "#ff5252 "} : null}
                                >Proceso <small className="text-danger"> *</small></Form.Label>
                                <Form.Control as="select"
                                    // value={civilStatu}
                                    // onChange={this.handleChange('civilStatu')}
                                >
                                    >
                                    <option defaultValue={true} hidden>Estado civil</option>
                                    {/*{*/}
                                    {/*    civilStatus.length > 0 ?*/}
                                    {/*        civilStatus.map((civilStatu, index) => {*/}
                                    {/*            // if (bank.state) {*/}
                                    {/*            return (*/}
                                    {/*                <option value={civilStatu.id}*/}
                                    {/*                        key={index}>*/}
                                    {/*                    {civilStatu.denomination}*/}
                                    {/*                </option>*/}
                                    {/*            )*/}
                                    {/*            // }*/}
                                    {/*        }) :*/}
                                    {/*        <option defaultValue={true}>Error al cargar los*/}
                                    {/*            Datos</option>*/}
                                    {/*}*/}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Table size="sm" hover responsive style={{width: '100%'}}>
                            <thead>
                            <tr className="d-flex">


                                <th className="col-6">Curso</th>
                                <th className="col-1">Ciclo</th>
                                <th className="col-1">Creditos</th>
                                <th className="col-2">Codigo</th>
                                <th className="col-2">Prerequisito</th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr className="d-flex">
                                <td className="col-8">
                                    <div className="custom-control custom-checkbox ">
                                        <input type="checkbox" className="custom-control-input" id="proset1" defaultChecked={true}/>
                                        <label className="custom-control-label" htmlFor="proset1">
                                            Matematica
                                        </label>
                                    </div>
                                </td>


                                <td className="col-2">
                                    <div className="d-inline-block align-middle">

                                        <div className="d-inline-block">
                                            <p className="m-b-0"
                                            > Ciclo 2</p>
                                            {/*<p className="m-b-0"> Ciclo:<strong>{k.Semester_mention.semester.replace('Semestre', '')} </strong></p>*/}
                                        </div>
                                    </div>


                                </td>
                                <td className="col-2">
                                    <div className="d-inline-block align-middle">

                                        <div className="d-inline-block">
                                            <p className="m-b-0"
                                            > 32</p>
                                        </div>
                                    </div>


                                </td>


                            </tr>

                            </tbody>
                        </Table>
                    </Row>

                </Modal.Body>
            </Modal>


        );
    }
}

export default FormAcademicRecord;
