import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import Delete from '@material-ui/icons/Delete'

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"



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

        const {records, ADMISSIONPLANID} = this.props;
        let total = 0;
        records.map(r => {
            total = parseFloat(r.Discount.amount) + total
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
                name: "DESCRIPCIÓN",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `DESCRIPCIÓN: ${v}`},
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
                name: "PORCENTAJE",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `PORCENTAJE: ${v}`},
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
                                        overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                        <Delete style={{color: "#ff5252"}}
                                                onClick={() => this.props.deleteDiscount(value.id, ADMISSIONPLANID)}/>
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

                            r.Discount.description,
                            r.Discount.amount,

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
                    title={"TOTAL DESCUENTO " + total + ' %'}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;