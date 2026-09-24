import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import Book from '@material-ui/icons/Book'
import Bookmark from '@material-ui/icons/Bookmark'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"
import Receipt from "@material-ui/icons/Receipt";
import Description from "@material-ui/icons/Description";
import {Link} from "react-router-dom";

class ComissionDataTable extends Component {
    constructor(props) {
        super(props);

    };

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
            // customToolbar: () => {
            //     return (
            //         <>
            //             <OverlayTrigger
            //                 overlay={<Tooltip>Nuevo</Tooltip>}>
            //                 <button onClick={() => this.props.openForm()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>
            //
            //             </OverlayTrigger>
            //
            //         </>
            //     )
            // },


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
                name: "CARGO",
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
                name: "DESCRIPCIÓN",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `TIPO CONTRATO: ${v}`},
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
                name: "PROGRAMA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CARGO: ${v}`},
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
                    customFilterListOptions: {render: v => `FECHA INICIO: ${v}`},
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
                    customFilterListOptions: {render: v => `FECHA FIN: ${v}`},
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
                            if (value === true) {
                                return <span className="badge badge-primary inline-block">Habilitado</span>
                            } else if (value === false) {
                                return <span className="badge badge-danger inline-block">Inhabilitado</span>
                            } else {
                                return "No def.";
                            }


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

                            return value ?
                                <>
                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}>
                                        <Edit style={{color: "#1d86e0"}} onClick={() => this.props.retriveProgam(value)}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>ANULAR</Tooltip>}>
                                        <Delete style={{color: "#ff5252"}} onClick={() => this.props.deleteSweetProgram(value.id, value.state)}/>

                                    </OverlayTrigger>

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

                            r.denomination,
                            r.Organic_unit_origin.denomination,
                            r.Academic_degree.denomination,
                            r.Academic_degree.abbreviation,
                            r.state,
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
                    title={"LISTADO DE COMISIONES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default ComissionDataTable;