import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Unarchive from '@material-ui/icons/Unarchive'
import LocalOffer from '@material-ui/icons/LocalOffer'

import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash'
import {Button, Col, Dropdown, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import {Link} from "react-router-dom";
import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../Constants";
import defaultPhoto from "../../../../assets/images/user/default.jpg";
import {Build} from "@material-ui/icons";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker";
import Close from "@material-ui/icons/Close";
import axios from "axios";


class Index extends Component {
    state = {
        modal: false,
        process: '',
        processs: []
    }

    componentDidMount() {

    }


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});


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
            rowsPerPageOptions: [10, 30, 50, 500],
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
                    "REPORTE DE PAGOS PENDIENTES",

                    columns,
                    data
                )
                ;
                return false;
            },
            customToolbar: () => {
                return (
                    <>

                    </>
                )
            },

        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        return value;
                    },
                }
            },

            {
                name: "NOMBRE",
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
                name: "DNI",
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

                name: "PROG. UNID. ORG. ",
                options: {
                    filter: true,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {render: v => `PROG. UNID. ORG.  : ${v}`},
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

                name: "MONTO ",
                options: {
                    filter: true,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {render: v => `MONTO  : ${v}`},
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

                name: "CONCEPTO ",
                options: {
                    filter: true,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {render: v => `CONCEPTO  : ${v}`},
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

                name: "PROCESO ",
                options: {
                    filter: true,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {render: v => `PROCESO  : ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
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
                            index + 1,
                            r.Student && r.Student.Person ? r.Student.Person.name : 'No def.',
                            r.Student && r.Student.Person ? r.Student.Person.document_number : 'No def.',
                            r.Program && r.Program.description,
                            r.amount,
                            r.denomination,
                            r.Academic_semester.Academic_calendar.denomination.substr(-4) + ' - ' + r.Academic_semester.denomination.substr(-2),


                        ])
                    )

                }
            );
        }

        return (

            <>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={"LISTADO DE ESTUDIANTES"}
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
