import React, {Component} from 'react';
import axios from 'axios';
import app from '../../Constants';
import component from '../../Component';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../TitleModule";
import DataTable from "./DataTable";
import TeacherForm from "./Form";

moment.locale('es');

class Teacher extends Component {
    state = {
        ORGANIC_UNIT: component.ORGANIC_UNIT,
        isOpen: false,
        form: false,
        teachers: []
    };

    async componentDidMount() {

        if (component.ORGANIC_UNIT !== "") {
            this.listPersonTeacher(component.ORGANIC_UNIT);
        } else {
            this.listPersonTeacherGOD();
        }
    }

    async listPersonTeacher(ORGANIC_UNIT) {

        this.setState({teacherLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.teacher;
        try {
            let data = new FormData();
            data.set('id_organic_unit', ORGANIC_UNIT);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) this.setState({teachers: res.data});
            this.setState({teacherLoader: false});
        } catch (err) {
            this.setState({teacherLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)
        }
    };

    async listPersonTeacherGOD() {

        this.setState({teacherLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.teacher + '/g';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({teachers: res.data});
            }
            this.setState({teacherLoader: false});
        } catch (err) {
            this.setState({teacherLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)
        }
    };

    openForm = () => {
        this.setState({form: true});
    };
    closeForm = () => {
        this.setState({form: false});
    };
    callData = () => {
        if (component.ORGANIC_UNIT !== "") {
            this.listPersonTeacher(component.ORGANIC_UNIT);
        } else {
            this.listPersonTeacherGOD();
        }
    };

    render() {


        return (
            <>

                <TitleModule
                    actualTitle={"DOCENTES"}
                    actualModule={"DOCENTES"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                />

                <div style={{position: 'relative'}}>
                    {this.state.teacherLoader && component.spiner}
                    <DataTable
                        records={this.state.teachers}
                        openForm={this.openForm}
                    />
                </div>
                {this.state.form &&
                <TeacherForm ref={(ref) => this.Profile = ref}
                             route={"teacher"}
                             closeForm={this.closeForm}
                             callData={this.callData}
                />
                }


            </>
        );
    }
}

export default Teacher;