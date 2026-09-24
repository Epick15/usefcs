import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

class MaterialEgressDataTable extends Component {


    getMuiTheme = () => createTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {
            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            print: false,
            confirmFilters: true,
            download: false,
            viewColumns: true,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormModalMaterialEgress()} type="button"
                                    className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

                        </OverlayTrigger>

                    </>
                )
            }
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
                name: "NOMBRE",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `NOMBRE: ${v}`},
                    setCellProps: () => ({style: {minWidth: "400px", maxWidth: "400px"}}),
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
                name: "TIPO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `TIPO: ${v}`},
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
                    customFilterListOptions: {render: v => `MONTO: ${v}`},
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
                    setCellHeaderProps: () => ({align: 'left'}),
                    setCellProps: () => ({align: 'left'}),

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?

                                        <>
                                            <OverlayTrigger
                                                overlay={<Tooltip>EDITAR</Tooltip>}>
                                                <Edit style={{color: "#1d86e0"}}
                                                      onClick={() => this.props.retriveMaterialEgress(value)}
                                                />

                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                <Delete style={{color: "#ff5252"}}
                                                        onClick={() => this.props.sweetDeleteMaterialEgress(value.id)}
                                                />
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
                            r.Material !== null ? r.Material.denomination : 'No registrado',

                            r.type,

                            r.amount,
                    
                            r.state_egress,
                            r

                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE EGRESOS DE MATERIALES O SERVICIOS"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default MaterialEgressDataTable;