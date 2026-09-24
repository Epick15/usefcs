import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"
import Error from "@material-ui/icons/Error";


class DataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {

            filter: false,
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
                            <button onClick={() => this.props.openModal()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

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
                name: "EQUIVALENCIA",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `EQUIVALENCIA: ${v}`},
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
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ?
                                component.ORGANIC_UNIT === "" ?
                                    <>
                                        <OverlayTrigger
                                            overlay={<Tooltip>Editar</Tooltip>}>
                                            <Edit style={{color: "#1d86e0"}} onClick={() => this.props.openEditModal(value)}/>

                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            overlay={<Tooltip>Eliminar</Tooltip>}>
                                            <Delete style={{color: "#ff5252"}} onClick={() => this.props.openSweetAlert(value.id)}/>

                                        </OverlayTrigger>
                                    </>
                                    :
                                    <OverlayTrigger
                                        overlay={<Tooltip>SIN ACCIONES</Tooltip>}>
                                        <Error aria-disabled={true} style={{color: "#00acc1"}}/>

                                    </OverlayTrigger>
                                : "No def."
                        }


                    }
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
                            r.equivalence,
                            r

                        ])
                    )
                }
            );
        } else {
            data.push(["No se encontraron registros", "", ""]);
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE " + this.props.module}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;