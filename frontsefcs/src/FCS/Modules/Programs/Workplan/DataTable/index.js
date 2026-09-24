import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import ChangeHistory from '@material-ui/icons/ChangeHistory'
import Details from '@material-ui/icons/Details'

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"


import {Link} from "react-router-dom";

class DataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {

            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormWorkPlan()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

                        </OverlayTrigger>

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
                }
            },
            {
                name: "DESCRIPCIÓN",
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
                name: "PLAN DE ESTUDIO",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value.description : "No def."
                        }
                    },

                }
            },
            {
                name: "CALENDARIO ACADEMICO",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value.denomination : "No def."
                        }
                    },

                }
            },
            {
                name: "PROCESO",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value.denomination : "No def."
                        }
                    },

                }
            },
            {
                name: "BASE ESTUDIANTES",
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
                name: "FECHA INICIO",
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
                name: "FECHA FIN",
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
                name: "ACCIONES",
                options: {
                    filter: false,
                    sort: true,
                    download: false,
                    // display: "excluded",
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),

                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return (

                                <>
                                    <OverlayTrigger overlay={<Tooltip>PROYECCIÓN</Tooltip>}>
                                        <Link to={"/programs/work-plan/" +  btoa(value.id)+ "/projection"}> <Details className={"text-warning"}/></Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>EJECUCIÓN</Tooltip>}>
                                        <Link to={"#"}> <ChangeHistory  className={"text-info"}/></Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}>
                                        <Edit type="button" style={{color: "#1d86e0"}} onClick={() => this.props.retriveDataWorkPlan(value)}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>ANULAR</Tooltip>}>
                                        <Delete type="button" style={{color: "#ff5252"}} onClick={() => this.props.deleteSweetWorkPlan(value.id)}/>

                                    </OverlayTrigger>

                                </>)
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
                            r.description,
                            r.Plan,
                            r.Process.Academic_calendar,
                            r.Process,
                            r.number_student,
                            r.date_start,
                            r.date_end,
                            r
                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE PLANES DE TRABAJO"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;