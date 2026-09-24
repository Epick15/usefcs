import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'

import GetApp from '@material-ui/icons/GetApp'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"


import app from "../../../../Constants";

class DataTable extends Component {

    getMuiTheme = () => createTheme({overrides: component.MuiOption.overrides});

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
                return (<>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormDocumentProgram()} type="button"
                                    className="btn-icon btn btn-primary"><i className="feather icon-plus"></i>
                            </button>

                        </OverlayTrigger>

                    </>)
            },


        };

        const columns = [{
            name: "#", options: {
                filter: false, sort: true,
            }
        }, {
            name: "DESCRIPCIÓN", options: {
                filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                    if (value === undefined) {
                        return "No def.";
                    } else {

                        return value ? value : "No def."
                    }
                },

            }
        }, {
            name: "TIPO DE DOCUMENTO", options: {
                filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                    if (value === undefined) {
                        return "No def.";
                    } else {

                        return value ? value : "No def."
                    }
                },

            }
        }, {
            name: "NOMBRE DEL ARCHIVO", options: {
                filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                    if (value === undefined) {
                        return "No def.";
                    } else {

                        return value ? value : "No def."
                    }
                },

            }
        },


            {
                name: "ACCIONES", options: {
                    filter: false, sort: true, download: false, // display: "excluded",
                    // setCellHeaderProps: () => ({align: 'center'}),
                    // setCellProps: () => ({align: 'center'}),

                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            if (value === "") {
                                return "No def.";
                            } else {

                                return (<>
                                    <OverlayTrigger
                                        overlay={<Tooltip>DESCARGAR ARCHIVO</Tooltip>}>
                                        <a href={value.Document ? app.server + app.docsProgram + value.Document.archive : "#"}>
                                            <GetApp type="button"
                                                    className="text-dark"/></a>


                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}>
                                        <Edit type="button" style={{color: "#1d86e0"}}
                                              onClick={() => this.props.retriveDocumentProgram(value)}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>ANULAR</Tooltip>}>
                                        <Delete type="button" style={{color: "#ff5252"}}
                                                onClick={() => this.props.deleteSweetDocumentProgram(value.Document.id)}/>

                                    </OverlayTrigger>

                                </>)
                            }
                        }

                    },


                }
            }];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                return (data.push([index + 1, r.Document.topic, r.Document.Document_type.denomination, r.Document.archive, r]))
            });
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"LISTADO DE DOCUMENTOS"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;