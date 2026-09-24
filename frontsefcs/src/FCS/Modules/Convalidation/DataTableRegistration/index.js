import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import Delete from "@material-ui/icons/Delete";
import Archive from "@material-ui/icons/Archive";

class DataTable extends Component {

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const title = records.Payment.Concept.denomination.toUpperCase() + " - " + records.type.toUpperCase() + " / " + records.Academic_semester.Academic_calendar.denomination + " - " + records.Academic_semester.denomination + " - " + records.state;
        const {optionEdit} = this.props;
        // const {academic} = this.props;
        // const {payment} = this.props;

        const options = {

            filter: false,
            print: false,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {

                if (optionEdit) {
                    return (
                        <>

                            {/*<OverlayTrigger*/}
                            {/*    overlay={<Tooltip>Rectificación de Matrícula</Tooltip>}>*/}
                            {/*    <button onClick={() => this.props.retriveDataRegistration({records})}*/}
                            {/*            disabled={true}*/}
                            {/*            type="button"*/}
                            {/*            style={{*/}
                            {/*                backgroundColor: "white",*/}
                            {/*                borderColor: "white"*/}
                            {/*            }}*/}
                            {/*            className="btn-icon btn btn-primary"><BorderColor style={{color: "#00bcd4"}}/>*/}
                            {/*    </button>*/}

                            {/*</OverlayTrigger>*/}
                            {
                                records.state === "Pagado" &&
                                <OverlayTrigger
                                    overlay={<Tooltip>Retirar y reservar matricula - Retiro de Matrícula</Tooltip>}>
                                    <button onClick={() => this.props.leaveDataRegistration(records.id)}
                                            type="button"
                                            style={{
                                                backgroundColor: "white",
                                                borderColor: "white"
                                            }}
                                            className="btn-icon btn btn-warning"><Archive style={{color: "#ffba57"}}/>
                                    </button>

                                </OverlayTrigger>
                            }

                            {/*<OverlayTrigger*/}
                            {/*    overlay={<Tooltip>Editar</Tooltip>}>*/}
                            {/*    <button onClick={() => this.props.retriveDataRegistration({records})}*/}
                            {/*            type="button"*/}
                            {/*            style={{*/}
                            {/*                backgroundColor: "white",*/}
                            {/*                borderColor: "white"*/}
                            {/*            }}*/}
                            {/*            className="btn-icon btn btn-primary"><Edit style={{color: "#4680ff"}}/>*/}
                            {/*    </button>*/}

                            {/*</OverlayTrigger>*/}
                            <OverlayTrigger
                                overlay={<Tooltip>Eliminar</Tooltip>}>
                                <button onClick={() => this.props.deleteSweetRegistration(records.id)}
                                        type="button"
                                        style={{
                                            backgroundColor: "white",
                                            borderColor: "white"
                                        }}
                                        className="btn-icon btn btn-dark"><Delete style={{color: "#ff5252"}}/></button>
                            </OverlayTrigger>
                        </>
                    )
                }
            },
            // customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
            //
            //     return (
            //         <TableFooter className={""}>
            //             <TableRow>
            //                 <TableCell className={""}>
            //
            //                 </TableCell>
            //             </TableRow>
            //         </TableFooter>
            //     );
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
                name: "CURSO",
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
                name: "CICLO",
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
                name: "CREDITOS",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CODIGO: ${v}`},
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
                name: "NOTA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `NOTA: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value
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
                            let state = value === "Aprobado" ? "badge-info" : value === "Desaprobado" ? "badge-danger" : "badge-warning"

                            return value ?
                                <span className={"badge  inline-block " + state}>{value}</span> : "No def."
                        }
                    },
                }
            }

        ];
        let data = [];

        if (records.Registration_course.length > 0) {
            records.Registration_course.map((r, index) => {

                    return (
                        data.push([
                            r.order,
                            r.denomination,
                            r.ciclo,
                            r.credits,
                            r.note,
                            r.type,

                        ])
                    )
                }
            );
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
