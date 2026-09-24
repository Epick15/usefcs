import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'


import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../../Component"



import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import NumberFormat from "react-number-format";

class EntryWorkPlanDataTable extends Component {

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        let TOTAL = 0;
        records.map((r) => {

            TOTAL = r.cant * parseFloat(r.amount).toFixed(2) + TOTAL
        });


        const options = {

            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            selectableRows: false,
            rowsPerPage: 100,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormEntry()} type="button"
                                    className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

                        </OverlayTrigger>

                    </>
                )
            },

            customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
                let TOTALFINAL = TOTAL * this.props.numberStudentMaks;
                return (
                    <TableFooter className={""}>
                        <TableRow>
                            <TableCell className={""}>
                                <NumberFormat value={TOTALFINAL.toFixed(2)}
                                              displayType={'text'}
                                              thousandSeparator={true}
                                              prefix={'S/ '}
                                              maximumFractionDigits={2}
                                              renderText={TOTALFINAL => <h4 className="">{TOTALFINAL}</h4>}
                                />;
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                );
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
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "CATEGORIA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CATEGORIA: ${v}`},
                }
            },
            {
                name: "FRECUENCIA",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "MONTO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return value ? parseFloat(value).toFixed(2) : "No def."
                    }
                }
            },
            {
                name: "SUBTOTAL",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        // console.log(SUBTOTALFOOTER)
                        let SUBTOTAL = value.cant * parseFloat(value.amount)
                        // SUBTOTALFOOTER = SUBTOTAL + SUBTOTALFOOTER;
                        return value ? SUBTOTAL.toFixed(2) : "No def."
                    }
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
                                        <Edit style={{color: "#1d86e0"}}
                                              onClick={() => this.props.retriveEntry(value)}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>ANULAR</Tooltip>}>
                                        <Delete style={{color: "#ff5252"}}
                                                onClick={() => this.props.deleteSweetEntry(value.id)}/>

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
                            r.Concept.denomination,
                            r.Concept.Category_concept.description,
                            r.cant,
                            r.amount,

                            r,


                        ])
                    )
                }
            );
        }


        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"TOTAL EN BASE A " + this.props.numberStudentMaks + " ESTUDIANTES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default EntryWorkPlanDataTable;