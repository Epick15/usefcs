import React from 'react';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';
import OrganizationDataTable from "./organizationDataTable"

import PNotify from "pnotify/dist/es/PNotify";
import component from "../../../../Component";
import app from "../../../../Constants";
import axios from "axios";
import crypt from "node-cryptex";
import FormWorkPlan from "./Form/formWorkPlan"
import FormOrganization from "./Form/formOrganization"
import FormDetail from "./Form/formDetail"
import DTDocuments from "../../../Person/Profile/Perfil/DTDocuments";

const k = new Buffer(32);
const v = new Buffer(16);

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organicUnit: component.ORGANIC_UNIT,
            workPlanID: this.props.workPlanID,
            day: [
                {day: '/Lun', state: false},
                {day: '/Mar', state: false},
                {day: '/Mie', state: false},
                {day: '/Jue', state: false},
                {day: '/Vie', state: false},
                {day: '/Sab', state: false},
                {day: '/Dom', state: false}
            ],
            descriptionWork: "",
            plan: "",
            process: "",
            numberStudent: "",
            startDate: "",
            endDate: "",
            endTime: "",
            startTime: "",
            nameAcademicCalendar: "",

            organizationID: "",
            organizationData: "",

            formOrganization: false,
            loaderDetail: false,
            loaderOrganization: false,
            loaderWorkPlan: false,
            organizations: [],
            details: "",
            workPlans: "",
        }
    }

    async componentDidMount() {

        this.state.workPlanID && this.listWorkPlanByID(this.state.workPlanID);
        this.state.workPlanID && this.listDetailWorkPlanByID(this.state.workPlanID);
        this.state.workPlanID && this.listOrganizationWorkPlanByID(this.state.workPlanID);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.workPlanID !== this.props.workPlanID) {
            this.setState({workPlanID: this.props.workPlanID});
            this.state.workPlanID && this.listWorkPlanByID(this.state.workPlanID);
            this.state.workPlanID && this.listDetailWorkPlanByID(this.state.workPlanID);
            this.state.workPlanID && this.listOrganizationWorkPlanByID(this.state.workPlanID);
        }
    }

    async listOrganizationWorkPlanByID(id) {
        this.setState({loaderOrganization: true});
        const url = app.programs + '/' + app.organizationWorkPlan + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({organizations: res.data});
            this.setState({loaderOrganization: false});
        } catch (err) {
            this.setState({loaderOrganization: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    async listDetailWorkPlanByID(id) {
        this.setState({loaderDetail: true});
        const url = app.programs + '/' + app.detailWorkPlan + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({details: res.data});
            this.setState({loaderDetail: false});
        } catch (err) {
            this.setState({loaderDetail: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    async listWorkPlanByID(id) {
        this.setState({loaderWorkPlan: true});
        const url = app.programs + '/' + app.workPlan + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({workPlans: res.data});
            this.setState({loaderWorkPlan: false});
        } catch (err) {
            this.setState({loaderWorkPlan: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    openFormOrganization = () => {
        this.setState({formOrganization: true});
    };
    retriveFormOrganization = (r) => {
        this.setState({retriveOrganizationData: r});
    };
    closeFormOrganization = () => {
        this.setState({formOrganization: false, organizationID: ""});
    };
    openOrganizationSweetAlert = (id) => {
        this.FormOrganization.openOrganizationSweetAlert(id)

    };
    callData = async () => {
        this.listOrganizationWorkPlanByID(this.state.workPlanID)

    };

    render() {

        return (

            <Row>
                <Col>
                    <FormWorkPlan
                        updateWorkPlanID={this.props.updateWorkPlanID}
                        workPlans={this.state.workPlans}

                    />


                    <FormDetail
                        workPlanID={this.props.workPlanID}
                        details={this.state.details}
                    />


                    <div style={{position: 'relative'}}>
                        {this.state.loaderOrganization && component.spiner}
                        <OrganizationDataTable records={this.state.organizations}
                                               openFormOrganization={this.openFormOrganization}
                                               retriveFormOrganization={this.retriveFormOrganization}
                                               openOrganizationSweetAlert={this.openOrganizationSweetAlert}
                        />
                    </div>


                    <FormOrganization closeFormOrganization={this.closeFormOrganization}
                                      formOrganization={this.state.formOrganization}
                                      workPlanID={this.props.workPlanID}
                                      organizationID={this.state.organizationID}
                                      retriveOrganizationData={this.state.retriveOrganizationData}
                                      callData={this.callData}
                                      ref={(ref) => this.FormOrganization = ref}
                    />


                </Col>
            </Row>

        );
    }
}

export default Index;