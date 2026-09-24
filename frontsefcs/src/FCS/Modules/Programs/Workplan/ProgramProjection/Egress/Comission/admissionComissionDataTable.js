import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../../../Component"

import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import NumberFormat from "react-number-format";

class AdmissionComissionDataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        let TOTAL = 0;
        records.map((r) => {
            TOTAL = r.number_month * parseFloat(r.amount).toFixed(2) + TOTAL
        });
        const options = {

            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormComission("Pago a la comisión de admisión")} type="button" className="btn-icon btn btn-primary"><i
                                className="feather icon-plus"></i></button>

                        </OverlayTrigger>

                    </>
                )
            },
            customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {

                return (
                    <TableFooter className={""}>
                        <TableRow>
                            <TableCell className={""}>
                                <NumberFormat value={TOTAL.toFixed(2)}
                                              displayType={'text'}
                                              thousandSeparator={true}
                                              prefix={'S/ '}
                                              maximumFractionDigits={2}
                                              renderText={TOTAL => <h4 className="">{TOTAL}</h4>}
                                />
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
                name: "NOMBRE",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "OBSERVACIÓN",
                options: {
                    filter: true,
                    sort: true,

                }
            },
            {
                name: "TOTAL MESES",
                options: {
                    filter: true,
                    sort: true,

                }
            },
            {
                name: "MONTO",
                options: {
                    filter: true,
                    sort: true,

                }
            },
            {
                name: "SUBTOTAL",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        let SUBTOTAL = value.number_month * parseFloat(value.amount);

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
                        return (<>

                            <OverlayTrigger
                                overlay={<Tooltip>EDITAR</Tooltip>}>
                                <Edit style={{color: "#1d86e0"}} onClick={() => this.props.retriveComission(value)}/>

                            </OverlayTrigger>
                            <OverlayTrigger
                                overlay={<Tooltip>ANULAR</Tooltip>}>
                                <Delete style={{color: "#ff5252"}} onClick={() => this.props.deleteSweetComssion(value.id)}/>

                            </OverlayTrigger>

                        </>)


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
                            r.Person.name + "/" + r.charge,
                            r.observation,
                            r.number_month,
                            r.amount,
                            r,
                            r
                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"PAGO COMISION DE ADMISIÓN"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default AdmissionComissionDataTable;