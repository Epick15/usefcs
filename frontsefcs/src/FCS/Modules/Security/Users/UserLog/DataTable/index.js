import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import { OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../../Component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Refresh from "@material-ui/icons/Refresh";
import moment from 'moment';
import 'moment/locale/es';
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
                            overlay={<Tooltip>Recargar</Tooltip>}>
                            <Refresh onClick={() => this.props.refreshData()}/>
                        </OverlayTrigger>
                    </>
                )
            },
            expandableRows: true,
            expandableRowsHeader: false,
            expandableRowsOnClick: true,

            renderExpandableRow: (rowData, rowMeta) => {
                const colSpan = rowData.length + 1;
                console.log(rowData);
                return (
                    <TableRow>
                        <TableCell colSpan={colSpan}>
                            {/*Custom expandable row option. Data: {JSON.stringify(rowData[6])}*/}
                            {rowData[6]}
                        </TableCell>
                    </TableRow>
                );
            },
            // onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => console.log(curExpanded, allExpanded, rowsExpanded)


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
                name: "METODO",
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
                name: "ESTADO",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value === "400" ? <span className={'badge badge-danger inline-block'}>{value}</span> :
                                <span className={'badge badge-success inline-block'}>{value}</span>
                        }
                    },

                }
            },
            {
                name: "URL",
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
                name: "DIRECCIÓN REMOTA",
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
                name: "FECHA",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? moment(value).format('MMMM Do YYYY, h:mm:ss a') : "No def."
                        }
                    },
                }
            },
            {
                name: "BODY",
                options: {
                    filter: false,
                    sort: true,
                    display: false,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            }
        ];
        let data = [];

        if (records.length > 0) {
            records.reverse().map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.method,
                            r.status,
                            r.url,
                            r["remote-addr"],
                            r.date,
                            r.body
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