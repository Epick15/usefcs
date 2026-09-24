import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import Delete from '@material-ui/icons/Delete'


import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"


import Edit from "@material-ui/icons/Edit";


class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: false,
            studentID: this.props.studentID,
        }

    };

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.studentID !== this.props.studentID) {
            this.props.studentID && this.setState({studentID: this.props.studentID})
        }

    }

    render() {

        const {records} = this.props;
        let total = 0;
        records.map(r => {
            if (r.state === 'Aceptado') {
                total = parseFloat(r.voucher_amount) + total
            }
        })
        const options = {

            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            print: false,
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
                name: "N° RECIBO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `N° RECIBO: ${v}`},
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
                name: "FECHA",
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

            // {
            //     name: "TIPO",
            //     options: {
            //         filter: true,
            //         sort: true,
            //         customFilterListOptions: {render: v => `TIPO: ${v}`},
            //         customBodyRender: (value, tableMeta, updateValue) => {
            //
            //             if (value === undefined) {
            //                 return "No def.";
            //             } else {
            //
            //                 return value ? value : "No def."
            //             }
            //         },
            //     }
            // },
            {
                name: "PAGO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PAGO: ${v}`},
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
                                              onClick={() => this.props.retriveMovement(value)}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>INHABILITAR</Tooltip>}>
                                        <Delete style={{color: "#ff5252"}}
                                                onClick={() => this.props.deleteMovementSweet(value.id, value.voucher_amount)}/>
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
                            r.voucher_code,
                            r.voucher_amount,
                            r.voucher_date,

                            // r.type,
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
                    title={"VOUCHER ACEPTADO S/." + total}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;