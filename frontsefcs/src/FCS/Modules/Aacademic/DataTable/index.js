import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component";
import PNotify from "pnotify/dist/es/PNotify";

import app from "../../../Constants";

import axios from "axios";
import GetApp from "@material-ui/icons/GetApp";

class Index extends Component {
    constructor(props) {

        super(props);
        this.state = {
            edit: false,
            records: this.props.records,
            teacherMask: this.props.teacherMask,

            facultadMask: this.props.facultadMask,
            programMask: this.props.programMask,
            sedeMask: this.props.sedeMask,
            creditMask: this.props.creditMask,
            courseMask: this.props.courseMask,
            typeCourseMask: this.props.typeCourseMask,
            calendarMask: this.props.calendarMask,
            processMask: this.props.processMask,
        }
    };


    componentDidUpdate(prevProps, prevState) {

        if (prevProps.records !== this.props.records) {
            this.setState({records: this.props.records})
        }
        if (prevProps.facultadMask !== this.props.facultadMask) {
            this.setState({facultadMask: this.props.facultadMask})
        }
        if (prevProps.programMask !== this.props.programMask) {
            this.setState({programMask: this.props.programMask})
        }
        if (prevProps.sedeMask !== this.props.sedeMask) {
            this.setState({sedeMask: this.props.sedeMask})
        }
        if (prevProps.creditMask !== this.props.creditMask) {
            this.setState({creditMask: this.props.creditMask})
        }
        if (prevProps.courseMask !== this.props.courseMask) {
            this.setState({courseMask: this.props.courseMask})
        }
        if (prevProps.teacherMask !== this.props.teacherMask) {
            this.setState({teacherMask: this.props.teacherMask})
        }
        if (prevProps.typeCourseMask !== this.props.typeCourseMask) {
            this.setState({typeCourseMask: this.props.typeCourseMask})
        }
        if (prevProps.calendarMask !== this.props.calendarMask) {
            this.setState({calendarMask: this.props.calendarMask})
        }
        if (prevProps.processMask !== this.props.processMask) {
            this.setState({processMask: this.props.processMask})
        }
        if (prevProps.teacherMask !== this.props.teacherMask) {
            this.setState({teacherMask: this.props.teacherMask})
        }
    };

    async updateRegistrationCourse() {
        let courses = this.state.records;
        let tempCourse = [];
        this.setState({edit: !this.state.edit})
        courses.map(r =>
            tempCourse.push({
                "id": r.id_registration_course,
                "note": r.registration_course_note
            })
        )
        if (tempCourse.length > 0) {
            const url = app.registration + '/' + app.registrationCourse + '/note';
            let data = new FormData();
            data.set('courses', JSON.stringify(tempCourse));
            try {
                const res = await axios.patch(url, data, app.headers);

                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});

            } catch (err) {
                // this.setState({loaderRegistration: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderRegistration: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    getMuiTheme = () => createTheme({overrides: component.MuiOption.overrides});
    toggleAction = () => {
        this.setState({edit: !this.state.edit})
    }
    changeNote = (i, e) => {
        if (e.target.value <= 20) {
            let courses = this.state.records;
            let number = e.target.value.replace(/[^0-9/]/g, '');
            courses[i].registration_course_note = number;
            courses[i].registration_course_note_letter = component.numberToLetter(parseInt(number));
            this.setState({records: courses});
        }
    };


    render() {

        const {records} = this.state;
        const totalStudent = records.length;
        let approvedStudent = 0;
        let desaprovedStudent = 0;
        records.map(r => {
            r.registration_course_note >= 14 ? approvedStudent = approvedStudent + 1 : desaprovedStudent = desaprovedStudent + 1;
        })
        const options = {
            filter: false,
            searchOpen: false,
            print: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            selectableRows: false,
            rowsPerPage: 100,
            textLabels: component.MuiOption.textLabels,
            rowsPerPageOptions: [50, 100, 500],
            draggableColumns: {
                enabled: true
            },
            download:  false,
            downloadOptions: {
                filename: 'excel-format.csv',
                separator: ';',
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                }
            },
            // customToolbar: () => {
            //     return (
            //         <>
            //
            //             {
            //                 this.props.records.length > 0 &&
            //                 this.state.edit ?
            //                     <OverlayTrigger
            //                         overlay={<Tooltip>Guardar</Tooltip>}>
            //                         <button onClick={() => this.updateRegistrationCourse()} type="button"
            //                                 className="btn-icon btn btn-primary"><i className="feather icon-save"></i>
            //                         </button>
            //                     </OverlayTrigger>
            //                     :
            //                     <OverlayTrigger
            //                         overlay={<Tooltip>Editar</Tooltip>}>
            //                         <button onClick={() => this.toggleAction()} type="button"
            //                                 className="btn-icon btn btn-primary"><i className="feather icon-edit-2"></i>
            //                         </button>
            //                     </OverlayTrigger>
            //             }
            //         </>
            //     )
            // },
            onDownload: (buildHead, buildBody, columns, data) => {

                // component.pdfReportAutoTableActaEvaluation(
                //     this.state.facultadMask.toUpperCase(),
                //     this.state.programMask,
                //     this.state.sedeMask.toUpperCase(),
                //     this.state.courseMask,
                //     this.state.creditMask,
                //     this.state.teacherMask,
                //     this.state.typeCourseMask.toUpperCase(),
                //     this.state.calendarMask,
                //     this.state.processMask,
                //     totalStudent,
                //     approvedStudent,
                //     desaprovedStudent,
                //     columns,
                //     data
                // );
                return false;
            },
        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value
                        }
                    },
                }
            },

            {
                name: "APELLIDOS Y NOMBRES",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "CODIGO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },


            {
                name: "NOTA LETRA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `NOTA LETRA: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value
                        }
                    },
                }
            },
            {
                name: "NOTA NÚMERO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `NOTA NÚMERO: ${v}`},
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),
                    customBodyRender: (value, tableMeta, updateValue) => {

                        // console.log(tableMeta)
                        // console.log(tableMeta.rowIndex)
                        // console.log(updateValue)
                        let rowIndex = tableMeta.rowIndex;
                        if (value === undefined) {
                            return "No def.";
                        } else {


                            if (this.state.edit) {
                                let note = value.registration_course_note

                                return (

                                    <input
                                        value={note}
                                        style={{
                                            width: "70%",
                                            border: "none",
                                            borderBottom: "1px solid #ced4da",
                                            fontSize: "15px"
                                        }}

                                        onChange={this.changeNote.bind(this, rowIndex)}
                                    />
                                )
                            } else {
                                return value.registration_course_note;
                            }
                        }
                    },
                }
            }


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                    return (
                        data.push([
                            index + 1,
                            r.name,
                            r.document_number,
                            r.registration_course_note_letter,
                            r,
                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE ESTUDIANTES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default Index;
