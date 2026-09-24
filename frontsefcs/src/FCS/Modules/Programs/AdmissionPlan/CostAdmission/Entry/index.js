import React from 'react';
import {withRouter} from "react-router";
import {Row, Col} from 'react-bootstrap';
import EntryWorkPlanDataTable from "./EntryWorkPlanDataTable"
import FormEntry from "./formEntry";

import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../../../Constants";
import axios from "axios";
import component from "../../../../../Component";
import DataTable from "../../DataTable";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formEntry: false,
            loaderEntry: false,
            AdmissionPlanID: this.props.AdmissionPlanID,
            entrys: [],
            retriveEntry: "",
            deleteEntryID: ""
        }
    }

    componentDidMount() {
        const AdmissionPlanID = atob(this.props.match.params.id);
        this.setState({AdmissionPlanID: AdmissionPlanID});
        AdmissionPlanID && this.listCostByAdmissionPlanID(AdmissionPlanID);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.AdmissionPlanID !== this.props.AdmissionPlanID) {
            this.setState({AdmissionPlanID: this.props.AdmissionPlanID});
            this.props.AdmissionPlanID && this.listCostByAdmissionPlanID(this.props.AdmissionPlanID);
        }
    }

    async listCostByAdmissionPlanID(id) {
        this.setState({loaderEntry: true});
        const url = app.programs + '/' + app.costAdmissionPlan + '/' + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) this.setState({entrys: res.data});
            this.setState({loaderEntry: false});
        } catch (err) {
            this.setState({loaderEntry: false})
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            console.log(err)
        }

    }

    openFormEntry = () => {
        this.setState({formEntry: true})
    };
    closeFormEntry = () => {
        this.setState({formEntry: false, retriveEntry: "", deleteEntryID: ""})
    };
    retriveEntry = (r) => {
        this.setState({retriveEntry: r})
    };
    deleteSweetEntry = (id) => {
        this.setState({deleteEntryID: id})
    };

    callData = async () => {
        this.listCostByAdmissionPlanID(this.state.AdmissionPlanID)

    };

    render() {

        return (

            <Row>
                <Col>

                    <FormEntry AdmissionPlanID={this.state.AdmissionPlanID}
                               formEntry={this.state.formEntry}
                               retriveEntry={this.state.retriveEntry}
                               deleteEntryID={this.state.deleteEntryID}
                               closeFormEntry={this.closeFormEntry}
                               callData={this.callData}
                    />
                    <div style={{position: 'relative'}}>
                        {this.state.loaderEntry && component.spiner}
                        <EntryWorkPlanDataTable openFormEntry={this.openFormEntry}
                                                records={this.state.entrys}
                                                numberStudentMaks={this.props.numberStudentMaks}
                                                retriveEntry={this.retriveEntry}
                                                deleteSweetEntry={this.deleteSweetEntry}
                        />
                    </div>
                </Col>
            </Row>

        );
    }
}


export default withRouter(Index)