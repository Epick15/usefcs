import React, {Component} from 'react';
import {Card, Col, Form, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import GetApp from "@material-ui/icons/GetApp";
import app from "../../../Constants";
import box from "../../../Component";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

export default class StudyPlan extends Component {
    state = {studyPlan: '', program: '', studyPlans: [], programs: [], data: []};


    async componentDidMount() {
        await this.listProgramReport()
    }

    async listProgramReport() {
        this.setState({loader: true});
        const url = app.programs + '/' + app.program + '-report';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({programs: res.data});
            }
            this.setState({loader: false})

        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: err});
            console.log(err)

        }
    }

    async listStudyPlanByProgramIDReport(program) {
        this.setState({loader: true});
        const url = app.programs + '/' + app.studyPlan + '/' + app.program + '/' + program + '/report';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({studyPlans: res.data});
            }
            this.setState({loader: false})

        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: err});
            console.log(err)

        }
    }

    async reportStudyPlan(program) {
        this.setState({loader: true});
        const url = app.general + '/report-study-plan/' + program;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({data: res.data});
            }
            this.setState({loader: false})

        } catch (err) {
            this.setState({loader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal", delay: err});
            console.log(err)

        }
    }


    handleChange = field => event => {
        switch (field) {
            case 'program':
                this.setState({program: event.target.value});
                this.listStudyPlanByProgramIDReport(event.target.value)
                break;
            case 'studyPlan':
                this.setState({studyPlan: event.target.value,});
                this.reportStudyPlan(event.target.value)
                break;
            default:
                break;
        }
    }

    async downloadData() {
        this.setState({loader: true})
        let status = await box.pdfReportAutoTableStudyPlan(this.state.data)
        console.log(status)
        status && this.setState({loader: false})

    };

    render() {
        const {loader, studyPlan, program, studyPlans, programs} = this.state;


        return (
            <Row>
                {loader && box.spiner}
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Form.Group className="form-group fill">

                        <Form.Control as="select"
                                      value={program}
                                      onChange={this.handleChange('program')}
                        >

                            <option defaultValue={true} hidden>Programa</option>
                            {programs.length > 0 ? programs.map((r, k) => {

                                return (
                                    <option id={r.id}
                                            value={r.id}
                                            key={k}> {r.description}
                                    </option>)

                            }) : <option value={false} disabled>No se
                                encontraron
                                datos</option>}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Form.Group className="form-group fill">
                        <Form.Control as="select"
                                      value={studyPlan}
                                      onChange={this.handleChange('studyPlan')}
                        >
                            <option defaultValue={true} hidden>Plan de
                                estudio
                            </option>
                            {studyPlans.length > 0 ? studyPlans.map((r, k) =>
                                    <option id={r.id}
                                            value={r.id}
                                            key={k}>
                                        {r.description.toUpperCase()} </option>) :
                                <option value={false} disabled>No se
                                    encontraron
                                    datos</option>}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <hr/>
                <Col xs={12} sm={12} md={4} lg={4} xl={4}>

                    <button
                        style={{
                            float: "right",
                            marginRight: "3px",
                            width: '100%'
                        }}
                        onClick={() => this.downloadData()}
                        type="butt-on"
                        className=" btn btn-primary"><GetApp/>
                    </button>
                </Col>
            </Row>


        );
    }
}
