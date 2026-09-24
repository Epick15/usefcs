import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../../Component"


class DataTable extends Component {
    constructor(props) {
        super(props);

    };

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        let TOTAL = 0;
        records.map((r) => {

            TOTAL = parseFloat(r.amount) + TOTAL
        });
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
                            <button onClick={() => this.props.openForm()} type="button"
                                    className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

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
                name: "CONCEPTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CONCEPTO: ${v}`},
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
                    filter: false,
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
                name: "SEMESTER",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `SEMESTER: ${v}`},
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
                name: "AÑO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `AÑO: ${v}`},
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
            // {
            //     name: "ACCIONES",
            //     options: {
            //         filter: false,
            //         sort: true,
            //         download: false,
            //         // display: "excluded",
            //         setCellHeaderProps: () => ({align: 'left'}),
            //         setCellProps: () => ({align: 'left'}),
            //
            //         customBodyRender: (value, tableMeta, updateValue) => {
            //
            //             if (value === undefined) {
            //                 return "No def.";
            //             } else {
            //
            //                 return value ?
            //                     <>
            //                         <OverlayTrigger
            //                             overlay={<Tooltip>EDITAR</Tooltip>}>
            //                             <Edit style={{color: "#1d86e0"}}/>
            //
            //                         </OverlayTrigger>
            //                         <OverlayTrigger
            //                             overlay={<Tooltip>INHABILITAR</Tooltip>}>
            //                             <Delete style={{color: "#ff5252"}}/>
            //                         </OverlayTrigger>
            //                     </>
            //                     : "No def."
            //             }
            //
            //
            //         },
            //
            //
            //     }
            // }

        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.Concept.denomination,
                            r.amount,
                            r.Academic_semester.denomination,
                            r.Academic_semester.Academic_calendar.denomination.substr(-4),
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
                    title={"TOTAL : " + TOTAL.toFixed(2)}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;