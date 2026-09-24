import React from 'react';
import {Row, Col} from 'react-bootstrap';
import EntryWorkPlanDataTable from "./EntryWorkPlanDataTable"
import FormEntry from "./formEntry";

import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../../../Constants";
import axios from "axios";
import component from "../../../../../Component";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formEntry: false,
            loaderEntry: false,
            workPlanID: this.props.workPlanID,
            entrys: [],
            retriveEntry: "",
            deleteEntryID: ""
        }
    }

    componentDidMount() {
        console.log(this.props.workPlanID, "Entry");
        this.props.workPlanID && this.listEntryByWorkPlanID(this.props.workPlanID);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.workPlanID !== this.props.workPlanID) {
            this.setState({workPlanID: this.props.workPlanID});
            this.props.workPlanID && this.listEntryByWorkPlanID(this.props.workPlanID);
        }
    }

    async listEntryByWorkPlanID(id) {
        this.setState({loaderEntry: true});
        const url = app.programs + '/' + app.entryWorkPlan + '/' + id;
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
        this.listEntryByWorkPlanID(this.state.workPlanID)

    };

    render() {

        return (

            <Row>
                <Col>

                    <FormEntry workPlanID={this.state.workPlanID}
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

export default Index;