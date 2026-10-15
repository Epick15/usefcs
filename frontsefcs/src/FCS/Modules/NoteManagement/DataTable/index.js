import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component";
import PNotify from "pnotify/dist/es/PNotify";

import app from "../../../Constants";

import axios from "axios";

class Index extends Component {
    constructor(props) {

        super(props);
        this.state = {
            edit: false,
            records: this.props.records,
            // activate: this.props.activate,

        }
    };


    componentDidUpdate(prevProps, prevState) {

        if (prevProps.records !== this.props.records) {
            this.setState({records: this.props.records})
        }
        // if (prevProps.records !== this.props.activate) {
        //     this.setState({activate: this.props.activate})
        // }

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
            download: component.ORGANIC_UNIT === '' ? true : false,
            downloadOptions: {
                filename: 'excel-format.csv',
                separator: ';',
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                }
            },
            customToolbar: () => {
                if (!this.props.blocked && this.props.activate && (!this.props.acta || !this.props.actaState)) {
                    return (
                        <>

                            {
                                this.props.records.length > 0 &&
                                this.state.edit ?
                                    <OverlayTrigger
                                        overlay={<Tooltip>Guardar</Tooltip>}>
                                        <button onClick={() => this.updateRegistrationCourse()} type="button"
                                                className="btn-icon btn btn-primary"><i
                                            className="feather icon-save"></i>
                                        </button>
                                    </OverlayTrigger>
                                    :
                                    <OverlayTrigger
                                        overlay={<Tooltip>Editar</Tooltip>}>
                                        <button onClick={() => this.toggleAction()} type="button"
                                                className="btn-icon btn btn-primary"><i
                                            className="feather icon-edit-2"></i>
                                        </button>
                                    </OverlayTrigger>
                            }
                        </>
                    )
                }
            },

        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: false,
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
                    sort: false,
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
                    sort: false,
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
                    sort: false,
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
                    sort: false,
                    customFilterListOptions: {render: v => `NOTA NÚMERO: ${v}`},
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),
                    customBodyRender: (value, tableMeta, updateValue) => {

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
            },
            {
                name: "PAGOS PENDIENTES",
                options: {
                    filter: false,
                    sort: false,
                    display: this.props.blocked,
                    customBodyRender: (value) => value || "Sin pagos pendientes"
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
                            r.payment_status && r.payment_status.pending_concepts.length > 0
                                ? [...new Set(r.payment_status.pending_concepts)].join(", ")
                                : "Sin pagos pendientes",
                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={this.props.title || "LISTADO DE ESTUDIANTES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default Index;
