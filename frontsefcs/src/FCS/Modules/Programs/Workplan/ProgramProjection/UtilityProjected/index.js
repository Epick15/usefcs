import React from 'react';
import {Row, Col, Card} from 'react-bootstrap';

import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../../../Constants";
import axios from "axios";
import NumberFormat from "react-number-format";


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            totalEntry: 0,
            totalEgressTeacher: 0,
            totalEgressAdministrative: 0,
            totalEgressComission: 0,
            totalEgressMaterial: 0,
            totalProjection: 0,
            totalEgress: 0,
        }
    }

    async componentDidMount() {
        if (this.props.workPlanID) {
            this.listWorkPlanTotalProjectionByID(this.props.workPlanID);
        }

    }

    async listWorkPlanTotalProjectionByID(id) {
        this.setState({loader: true});
        const url = app.programs + '/' + app.workPlan + '/total-projection/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({
                totalEntry: res.data.totalEntry,
                //
                totalEgressTeacher: res.data.totalEgressTeacher,
                totalEgressAdministrative: res.data.totalEgressAdministrative,
                totalEgressComission: res.data.totalEgressComission,
                totalEgressMaterial: res.data.totalEgressMaterial,
                //
                totalEgress: res.data.totalEgressMaterial + res.data.totalEgressComission + res.data.totalEgressAdministrative + res.data.totalEgressTeacher,
                totalProjection: res.data.totalEntry - (res.data.totalEgressMaterial + res.data.totalEgressComission + res.data.totalEgressAdministrative + res.data.totalEgressTeacher),

            });
            this.setState({loader: false});
        } catch (err) {
            this.setState({loader: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    render() {
        const {totalEntry, totalProjection, totalEgress} = this.state;

        return (

            <Row>
                <Col md={12} xl={12}>
                    <Card className="overflow-hidden">
                        <Card.Body className=" pb-0" style={{background: "#009688"}}>
                            <Row className="text-white">
                                <Col sm='auto'>

                                    <NumberFormat value={totalProjection.toFixed(2)}
                                                  displayType={'text'}
                                                  thousandSeparator={true}
                                                  prefix={'S/ '}
                                                  maximumFractionDigits={2}
                                                  renderText={totalProjection => <h4 className="m-b-5 text-white">{totalProjection}</h4>}
                                    />
                                    <h6 className="text-white">100% Total Utilidad proyectada</h6>


                                </Col>
                                <Col className="text-right">
                                    <h6 className="text-white">100%</h6>
                                </Col>
                            </Row>

                        </Card.Body>
                        <Card.Footer>
                            <Row className="">
                                <Col sm='auto'>
                                    <NumberFormat value={totalEntry.toFixed(2)}
                                                  displayType={'text'}
                                                  thousandSeparator={true}
                                                  prefix={'S/ '}
                                                  maximumFractionDigits={2}
                                                  renderText={totalEntry => <h4>{totalEntry}</h4>}
                                    />

                                    <p className="text-muted">Total Ingresos</p>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="">75%</h6>
                                </Col>
                            </Row>
                            <Row className="">
                                <Col sm='auto'>
                                    <NumberFormat value={totalEgress.toFixed(2)}
                                                  displayType={'text'}
                                                  thousandSeparator={true}
                                                  prefix={'S/ '}
                                                  maximumFractionDigits={2}
                                                  renderText={totalEgress => <h4>{totalEgress}</h4>}
                                    />

                                    <p className="text-muted">Total Egresos</p>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="">25%</h6>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={6} xl={6}>
                    <Card className="overflow-hidden">
                        <Card.Body className="bg-c-green pb-0">
                            <Row className="text-white">
                                <Col sm='auto'>
                                    <NumberFormat value={Math.round(totalProjection * 0.37 * 100) / 100}
                                                  displayType={'text'}
                                                  thousandSeparator={true}
                                                  prefix={'S/ '}
                                                  maximumFractionDigits={2}
                                                  renderText={totalProjection => <h4 className="text-white">{totalProjection}</h4>}
                                    />
                                    <h6 className="text-white">37% de la utilidad proyectada para la Universidad Nacional de San Martín</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="text-white">100%</h6>
                                </Col>
                            </Row>

                        </Card.Body>

                    </Card>
                </Col>
                <Col md={6} xl={6}>
                    <Card className="overflow-hidden">

                        <Card.Body className="bg-c-blue pb-0">
                            <Row className="text-white">
                                <Col sm='auto'>
                                    <NumberFormat value={Math.round(totalProjection * 0.63 * 100) / 100}
                                                  displayType={'text'}
                                                  thousandSeparator={true}
                                                  prefix={'S/ '}
                                                  maximumFractionDigits={2}
                                                  renderText={totalProjection => <h4 className="text-white">{totalProjection}</h4>}
                                    />
                                    <h6 className="text-white">63% de la utilidad proyectada para la Escuela de Posgrado</h6>
                                </Col>
                                <Col className="text-right">
                                    <h6 className="text-white">100%</h6>
                                </Col>
                            </Row>

                        </Card.Body>


                    </Card>
                </Col>
            </Row>

        );
    }
}

export default Index;