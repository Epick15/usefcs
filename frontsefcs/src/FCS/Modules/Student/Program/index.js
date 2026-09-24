import React, {Component} from 'react';
import {withRouter} from "react-router";
import axios from 'axios';
import PNotify from "pnotify/dist/es/PNotify";
import moment from "moment";
import TitleModule from "../../../TitleModule";
import app from "../../../Constants";
import ProgramDataTable from "./DataTable/ProgramDataTable";
import StudentProgramForm from "./Form/index";
import component from "../../../Component";


moment.locale('es');

class StudentProgram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ORGANIC_UNIT: component.ORGANIC_UNIT,
            PERSONID: "",
            deleteStudentID: "",
            user: "",
            namePerson: "",
            students: [],
            studentsLoader: false,
            comisionLoader: false,
            openForm: false,
            ChargeForm: false,
            retriveData: "",
            optionDelete: ""
        };
    }

    async componentDidMount() {

        const personid = atob(this.props.match.params.id);
        this.setState({PERSONID: personid});
        component.ORGANIC_UNIT !== "" ? personid && this.retrivePersonStudent(personid, component.ORGANIC_UNIT) : this.retrivePersonStudentGOD(personid);

    }

    async retrivePersonStudent(id, ORGANIC_UNIT) {
        let namePerson = "";
        this.setState({studentsLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.student + '/' + id;
        try {
            let data = new FormData();
            data.set('id_organic_unit', ORGANIC_UNIT);
            const res = await axios.patch(url, data, app.headers);
            if (res.data) {
                if (res.data.Students.length > 0) {
                    namePerson = res.data.name;
                    this.setState({namePerson, students: res.data.Students});
                } else {
                    this.props.history.push("/student")
                }

            }

            this.setState({studentsLoader: false});
        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err);
            this.setState({studentsLoader: false});
        }

    };

    async retrivePersonStudentGOD(id,) {
        let namePerson = "";
        this.setState({studentsLoader: true});
        const url = app.person + '/' + app.persons + '/' + app.student + '/' + id + '/g';
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                if (res.data.Students.length > 0) {
                    namePerson = res.data.name;
                    this.setState({namePerson, students: res.data.Students});
                } else {
                    this.props.history.push("/student")
                }

            }

            this.setState({studentsLoader: false});
        } catch (err) {
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err);
            this.setState({studentsLoader: false});
        }

    };

    openForm = () => {
        this.setState({openForm: true, ChargeForm: true})
    };
    closeForm = () => {
        this.setState({ChargeForm: false, openForm: false, retriveData: "", optionDelete: ""})
    };
    callData = async () => {
        if (component.ORGANIC_UNIT !== "") {
            this.retrivePersonStudent(this.state.PERSONID, component.ORGANIC_UNIT);
        } else {
            this.retrivePersonStudentGOD(this.state.PERSONID);
        }
    };
    retriveStudent = async (r) => {
        this.openForm();
        this.setState({retriveData: r});
    };
    deleteStudentsweet = async (deleteStudentID) => {
        this.setState({deleteStudentID: deleteStudentID});
    };

    render() {
        const {namePerson} = this.state;
        const {students} = this.state;
        return (
            <>

                <TitleModule
                    actualTitle={namePerson}
                    actualModule={"PROGRAMAS DE ESTUDIO"}
                    fatherModuleUrl={"/student"} fatherModuleTitle={"ESTUDIANTES"}
                    fatherModule2Url={""} fatherModule2Title={""}

                />
                <div style={{position: 'relative'}}>
                    {this.state.studentsLoader && component.spiner}
                    <ProgramDataTable records={students}
                                      openForm={this.openForm}
                                      retriveStudent={this.retriveStudent}
                                      deleteStudentsweet={this.deleteStudentsweet}
                    />
                </div>


                <StudentProgramForm
                    personID={this.state.PERSONID}
                    openForm={this.state.openForm}
                    retriveData={this.state.retriveData}
                    deleteStudentID={this.state.deleteStudentID}
                    closeForm={this.closeForm}
                    callData={this.callData}
                />


            </>
        );
    }
}

export default withRouter(StudentProgram)