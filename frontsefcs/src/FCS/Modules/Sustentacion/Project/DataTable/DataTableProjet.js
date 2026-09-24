import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Send from '@material-ui/icons/Send';

import {Button, Col, Dropdown, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import component from "../../../../Component"

import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../../Constants";
import axios from "axios";
import GetApp from "@material-ui/icons/GetApp";
import moment from "moment";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Fingerprint from "@material-ui/icons/Fingerprint";


class Index extends Component {
    state = {
        modal: false,
        process: '',
        processs: []
    }

    componentDidMount() {

    }

    async reportAcademicRecord(id_student) {

        this.setState({registrationDataLoader: true});
        const url = app.general + '/report-academic-record/' + id_student;
        try {

            const res = await axios.get(url, app.headers);
            if (res.data)
                component.pdfReportAutoTableRercordAcademic(res.data)

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({title: "Oh no!", text: "Algo salio mal al cargar los datos", delay: 2000});
            console.log(err)

        }

    };

    getMuiTheme = () => createTheme({overrides: component.MuiOption.overrides});
    downloadDocument = (id) => {
        // console.log(id)
        //
        // axios.get(app.server + 'sustentation/, {
        //     responseType: 'blob',
        // })
        //     .then((res) => {
        //         fileDownload(res.data, filename)
        //     })
    }
    downloadPdf = (id_student) => {
        this.reportAcademicRecord(id_student)
    };

    render() {

        const {records} = this.props;


        const options = {
            filter: true,
            searchOpen: false,
            print: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            rowsPerPage: 100,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            rowsPerPageOptions: [10, 30, 50, 100, 500],
            draggableColumns: {
                enabled: true
            },
            downloadOptions: {
                filename: 'excel-format.csv',
                separator: ';',
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                }
            },
            onDownload: (buildHead, buildBody, columns, data) => {

                component.pdfReportAutoTablePaymentPendient(
                    "REPORTE DE PROJECTOS",

                    columns,
                    data
                )
                ;
                return false;
            },

            customToolbar: () => {
                return (<>
                        <OverlayTrigger
                            overlay={<Tooltip>Recargar</Tooltip>}>
                            <button onClick={() => this.props.callData()} type="button"
                                    className="btn-icon btn btn-light"><Refresh/></button>

                        </OverlayTrigger>

                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormProject()} type="button"
                                    className="btn-icon btn btn-primary"><i className="feather icon-plus"></i>
                            </button>
                        </OverlayTrigger>

                    </>


                )
            },

        };

        const columns = [

            {
                name: "#",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.index}
                                    <br/>
                                    {value.id_project}
                                </>
                                : "No def."
                        }
                    },
                }
            },
            {
                name: "RESOLUCIÓN",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.resolution_jury}
                                    <br/>
                                    {value.resolution_jury_date}

                                    <OverlayTrigger
                                        overlay={<Tooltip>DESCARGAR RECORD</Tooltip>}>
                                        <GetApp style={{color: "#fbb901"}}

                                            onClick={() => window.open(app.server + 'sustentation/' + value.resolution_jury_file, "_blank")}
                                        />

                                    </OverlayTrigger>
                                </>


                                : "No def."
                        }
                    },
                }
            },

            {
                name: "ESTUDIANTE",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.student_name}
                                    <br/>
                                    <p>{value.student_document}</p>
                                </>
                                : "No def."
                        }
                    },
                }
            },
            {
                name: "ASESOR",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.adviser_name}
                                    <br/>
                                    {value.adviser_document}
                                </>
                                : "No def."
                        }
                    },
                }
            },

            {
                name: "PROGRAMA",
                options: {
                    filter: true,
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
                name: "NOMBRE PROJECTO",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.project_name}
                                    <OverlayTrigger
                                        overlay={<Tooltip>DESCARGAR RECORD</Tooltip>}>
                                        <GetApp style={{color: "#fbb901"}}
                                                onClick={() => window.open(app.server + 'sustentation/' + value.project_file, "_blank")}
                                        />

                                    </OverlayTrigger>


                                </>


                                : "No def."
                        }
                    },
                }
            },

            // {
            //     name: "RES.JURADO",
            //     options: {
            //         filter: true,
            //         sort: true,
            //         customBodyRender: (value, tableMeta, updateValue) => {
            //
            //             if (value === undefined) {
            //                 return "No def.";
            //             } else {
            //
            //                 return value ?
            //                     <>
            //                         {value.resolution_jury}
            //                         <br/>
            //                         {value.resolution_jury_date}
            //
            //                         <OverlayTrigger
            //                             overlay={<Tooltip>DESCARGAR RECORD</Tooltip>}>
            //                             <GetApp style={{color: "#fbb901"}}
            //                                     onClick={() => this.downloadPdf(value.id_student)}
            //                             />
            //
            //                         </OverlayTrigger>
            //                     </>
            //
            //
            //                     : "No def."
            //             }
            //         },
            //     }
            // },


            {
                name: "PRESIDENTE",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.president_name}
                                    <br/>
                                    {value.president_document}
                                </>
                                : "No def."
                        }
                    },
                }
            },
            {
                name: "SECRETARIO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.secretary_name}
                                    <br/>
                                    {value.secretary_document}
                                </>
                                : "No def."
                        }
                    },
                }
            },
            {
                name: "VOCAL",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {value.vocal_name}
                                    <br/>
                                    {value.vocal_document}
                                </>
                                : "No def."
                        }
                    },
                }
            },

            {
                name: "FECHA",
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
                name: "ESTADO",
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

                name: "ACCIONES ",
                options: {
                    filter: false,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {render: v => `ACCIONES  : ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return <>
                                <OverlayTrigger
                                    overlay={<Tooltip>EDITAR</Tooltip>}>
                                    <Edit style={{color: "#1d86e0"}}
                                          onClick={() => this.props.openEditFormProject(value)}
                                    />

                                </OverlayTrigger>
                                <OverlayTrigger
                                    overlay={<Tooltip>Accesos</Tooltip>}>
                                    <Fingerprint style={{color: "#00793d"}}
                                                 onClick={() => this.props.openAccessProject(value)}
                                    />

                                </OverlayTrigger>

                            </>
                        }
                    },
                }
            },

        ];
        let data = [];
        if (records.length > 0) {
            records.map((r, index) => {
                    return (
                        data.push([
                            {index: index + 1, id_project: r.id_project},
                            {
                                resolution_jury: r.resolution_jury,
                                resolution_jury_date: r.resolution_jury_date,
                                resolution_jury_file: r.resolution_jury_file
                            },
                            {student_name: r.student_name, student_document: r.student_document},
                            {adviser_name: r.adviser_name, adviser_document: r.adviser_document},


                            r.program,
                            {project_name: r.project_name, project_file: r.project_file},

                            // {
                            //     resolution_jury: r.resolution_jury,
                            //     resolution_jury_date: r.resolution_jury_date,
                            //     resolution_jury_file: r.resolution_jury_file
                            // },
                            {president_name: r.president_name, president_document: r.president_document},
                            {secretary_name: r.secretary_name, secretary_document: r.secretary_document},
                            {vocal_name: r.vocal_name, vocal_document: r.vocal_document},


                            r.created_at,
                            r.state,
                            r
                        ])
                    )
                }
            );
        }

        return (

            <>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={"LISTADO"}
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>


            </>
        );
    }
}

export default Index;
