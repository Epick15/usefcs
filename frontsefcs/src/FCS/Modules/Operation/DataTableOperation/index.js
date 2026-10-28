import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme , MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import GetApp from "@material-ui/icons/GetApp";
import Replay from "@material-ui/icons/Replay";
import Event from "@material-ui/icons/Event";

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

                            return value ? String(value).slice(0, 10) : "No def."
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
                            let state = value === "Pagado" ? "badge-info" : value === "Anulado" ? "badge-danger" : "badge-warning"

                            return value ?
                                <span className={"badge  inline-block " + state}>{value}</span> : "No def."
                        }
                    },
                }
            },
            {
                name: "MOTIVO",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => value || "-",
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
                                            {value.type !== "Anulado" && <OverlayTrigger
                                                overlay={<Tooltip>EDITAR</Tooltip>}>
                                                <Edit style={{color: "#1d86e0"}}
                                                      onClick={() => this.props.retriveDataOperation(value)}/>
                                            </OverlayTrigger>}
                                            {value.type !== "Anulado" && <OverlayTrigger
                                                overlay={<Tooltip>CAMBIAR FECHA CON SUSTENTO</Tooltip>}>
                                                <Event style={{color: "#7952b3"}}
                                                       onClick={() => this.props.changeOperationDateSweet(value)}/>
                                            </OverlayTrigger>}
                                            <OverlayTrigger
                                                overlay={<Tooltip>{value.type === "Anulado" ? "DESANULAR" : "ANULAR"}</Tooltip>}>
                                                {value.type === "Anulado"
                                                    ? <Replay style={{color: "#1d86e0"}} onClick={() => this.props.deleteOperationSweet(value)}/>
                                                    : <Delete style={{color: "#ff5252"}} onClick={() => this.props.deleteOperationSweet(value)}/>
                                                }
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
                            r.operation_date || r.created_at,
                            r.type,
                            r.type === "Anulado" ? r.cancellation_reason : r.reactivation_reason,
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
