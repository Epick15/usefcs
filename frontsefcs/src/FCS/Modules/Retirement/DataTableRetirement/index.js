import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";

import app from "../../../Constants";
import GetApp from "@material-ui/icons/GetApp";

class DataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const {title} = this.props;

        const options = {

            filter: false,
            print: false,
            columns: false,
            download: false,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            // customToolbar: () => {
            //
            //
            //         return (
            //             <>
            //
            //                 {
            //                     stateRegistration === "Pagado" &&
            //                     <OverlayTrigger
            //                         overlay={<Tooltip>Retirar y reservar matricula - Retiro de Matrícula</Tooltip>}>
            //
            //                         <button style={{float: "right"}}
            //                             // onClick={() => this.openForm()}
            //                                 type="button"
            //                                 className=" btn btn-warning">RETIRAR
            //                         </button>
            //
            //
            //                     </OverlayTrigger>
            //                 }
            //
            //             </>
            //         )
            //
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
                name: "DESCRIPCIÓN",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `DESCRIPCIÓN: ${v}`},
                    // setCellProps: () => ({style: {minWidth: "500px", maxWidth: "500px"}}),
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
                name: "RESOLUCIÓN DE RETIRO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `RESOLUCIÓN DE RETIRO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {


                            return (
                                value ?

                                    value
                                    : "No def."
                            )
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
                                        overlay={<Tooltip>DESCARGAR ARCHIVO</Tooltip>}>
                                        <a href={app.server + app.docsStudent + value.document_archive}>
                                            <GetApp type="button" className="text-dark"/></a>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}>
                                        <Edit style={{color: "#7b7f84"}}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>INHABILITAR</Tooltip>}>
                                        <Delete style={{color: "#7b7f84"}}/>
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
                            r.payment_concept_denomination.toUpperCase() + ' ' + r.type.toUpperCase(),
                            r.academic_calendar_denomination + ' ' + r.academic_semester_denomination,
                            r.document_archive,
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
                    title={title}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;
