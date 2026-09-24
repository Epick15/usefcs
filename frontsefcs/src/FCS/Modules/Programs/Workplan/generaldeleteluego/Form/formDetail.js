import React from 'react';
import {withRouter} from "react-router";
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import app from "../../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import component from "../index";

import crypt from "node-cryptex";

const k = new Buffer(32);
const v = new Buffer(16);
moment.locale('es');

class FormDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,
            loader: false,
            action: "add",
            // workPlanID: this.props.workPlanID,
            workPlanID: this.props.workPlanID,
            details: this.props.details,
            detailWorkPlanID: "",
            foundation: "",
            objective: "",
            legalBase: "",
            organization: "",
            request: "",

        }
    }

    async componentDidMount() {


    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.workPlanID !== this.props.workPlanID) {
            this.setState({workPlanID: this.props.workPlanID});
        }
        if (prevProps.details !== this.props.details) {
            this.setState({details: this.props.details});
            this.retriveDetail(this.props.details);


        }
    }

    retriveDetail = (r) => {

        this.setState({
            action: "update",
            detailWorkPlanID: r.id,
            foundation: r.foundation,
            objective: r.objective,
            legalBase: r.legalBase,
        })
    };
    handleChange = field => event => {

        switch (field) {
            case 'foundation':
                this.setState({foundation: event.target.value});
                break;
            case 'objective':
                this.setState({objective: event.target.value});
                break;
            case 'legalBase':
                this.setState({legalBase: event.target.value});
                break;
            case 'organization':
                this.setState({organization: event.target.value});
                break;
            case 'request':
                this.setState({request: event.target.value});
                break;
            default:
                break;
        }
    };


    async createDetailWorkPlan() {
        this.setState({loaderDetail: true});

        const {workPlanID, foundation, objective, legalBase, organization, request} = this.state;
        console.log(workPlanID);
        if (workPlanID !== "" && foundation !== "" && objective !== "" && legalBase !== "") {
            const url = app.programs + '/' + app.detailWorkPlan;
            let data = new FormData();

            data.set("id_work_plan", workPlanID);
            data.set("foundation", foundation);
            data.set("objective", objective);
            data.set("legal_base", legalBase);
            // data.set("organization", organization);
            // data.set("request", request);

            try {
                const res = await axios.post(url, data, app.headers);

                this.setState({loaderDetail: false, detailWorkPlanID: res.data.id, action: "update"});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderDetail: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderDetail: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };

    async updateDetailWorkPlan() {
        this.setState({loaderDetail: true});

        const {foundation, objective, legalBase, organization, request} = this.state;

        if (foundation !== "" && objective !== "" && legalBase !== "") {
            const url = app.programs + '/' + app.detailWorkPlan + '/' + this.state.detailWorkPlanID;
            let data = new FormData();

            data.set("foundation", foundation);
            data.set("objective", objective);
            data.set("legal_base", legalBase);
            // data.set("organization", organization);
            // data.set("request", request);

            try {
                const res = await axios.patch(url, data, app.headers);

                this.setState({loaderDetail: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loaderDetail: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderDetail: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    render() {

        const {foundation, objective, legalBase, organization, request, loader, action} = this.state;
        return (
            <Card>

                <Card.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>

                            <h5 className="mb-0">Detalles</h5>
                            <br/>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Fundamentación <small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    as="textarea" rows="13"
                                    value={foundation}
                                    onChange={this.handleChange('foundation')}
                                    placeholder="Estuiantes base para ingresos"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Bases Legales <small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    as="textarea" rows="9"
                                    value={legalBase}

                                    onChange={this.handleChange('legalBase')}
                                    placeholder="Estuiantes base para ingresos"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">Objetivos <small className="text-danger"> *</small></Form.Label>
                                <Form.Control
                                    as="textarea" rows="9"
                                    value={objective}
                                    onChange={this.handleChange('objective')}
                                    placeholder="Estuiantes base para ingresos"
                                    margin="normal"
                                />
                            </Form.Group>
                        </Col>

                        {/*<Col xs={12} sm={12} md={12} lg={12} xl={12}>*/}
                        {/*    <Form.Group className="form-group fill">*/}
                        {/*        <Form.Label className="floating-label">Organizacion <small className="text-danger"> *</small></Form.Label>*/}
                        {/*        <Form.Control*/}
                        {/*            as="textarea" rows="9"*/}
                        {/*            value={organization}*/}
                        {/*            onChange={this.handleChange('organization')}*/}
                        {/*            placeholder="Estuiantes base para ingresos"*/}
                        {/*            margin="normal"*/}
                        {/*        />*/}
                        {/*    </Form.Group>*/}
                        {/*</Col>*/}
                        {/*<Col xs={12} sm={12} md={12} lg={12} xl={12}>*/}
                        {/*    <Form.Group className="form-group fill">*/}
                        {/*        <Form.Label className="floating-label">Requerimientos <small className="text-danger"> *</small></Form.Label>*/}
                        {/*        <Form.Control*/}
                        {/*            as="textarea" rows="9"*/}
                        {/*            value={request}*/}
                        {/*            onChange={this.handleChange('request')}*/}
                        {/*            placeholder="Estuiantes base para ingresos"*/}
                        {/*            margin="normal"*/}
                        {/*        />*/}
                        {/*    </Form.Group>*/}
                        {/*</Col>*/}
                        <Col>
                            {action === 'add' ?
                                <Button
                                    className="pull-right"
                                    disabled={loader}
                                    variant="primary"

                                    onClick={() => this.createDetailWorkPlan()}>
                                    {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar</Button> :
                                <Button
                                    className="pull-right"
                                    disabled={loader}
                                    variant="primary"

                                    onClick={() => this.updateDetailWorkPlan()}>
                                    {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                    Guardar Cambios</Button>
                            }


                        </Col>
                    </Row>

                </Card.Body>
            </Card>
        );
    }
}

export default withRouter(FormDetail)

