import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme , MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import GetApp from "@material-ui/icons/GetApp";

class DataTable extends Component {

    getMuiTheme = () => createTheme ({overrides: component.MuiOption.overrides});


    render() {

        const {records} = this.props;


        const options = {

            filter: false,
            print: false,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,

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
                name: "CONCEPTO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `CURSO: ${v}`},
                    setCellProps: () => ({style: {minWidth: "500px", maxWidth: "500px"}}),
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
                name: "MONTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA: ${v}`},
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
                name: "PROCESO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PROCESO: ${v}`},
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
                name: "F.REGISTRO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `F.REGISTRO: ${v}`},
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
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `ESTADO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            let state = value === "Pagado" ? "badge-info" : "badge-warning"

                            return value ?
                                <span className={"badge  inline-block " + state}>{value}</span> : "No def."
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
                    setCellHeaderProps: () => ({align: 'left'}),
                    setCellProps: () => ({align: 'left'}),

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                <>
                                    {
                                        !component.ORGANIC_UNIT &&
                                        <>
                                            <OverlayTrigger
                                                overlay={<Tooltip>EDITAR</Tooltip>}>
                                                <Edit style={{color: "#1d86e0"}}
                                                      onClick={() => this.props.retriveDataOperation(value)}/>

                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                <Delete style={{color: "#ff5252"}}
                                                        onClick={() => this.props.deleteOperationSweet(value.id)}/>
                                            </OverlayTrigger>
                                        </>


                                    }
                                </>
                                : "No def."
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
                            r.concept,
                            r.amount,
                            r.process,
                            r.created_at,
                            r.type,
                            r

                        ])
                    )
                }
            );
        } else {
            data.push(["No se encontraron registros"]);
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={'Listado de operaciones'}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;
