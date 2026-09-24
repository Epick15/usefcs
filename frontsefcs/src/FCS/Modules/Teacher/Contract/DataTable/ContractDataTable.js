import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"
import moment from 'moment';

moment.locale('es');

class ContractDataTable extends Component {


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
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openForm()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>
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
                name: "CARGO",
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
                name: "TIPO CONTRATO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `TIPO CONTRATO: ${v}`},
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
                name: "UNIDAD ORGANICA",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `UNIDAD ORGANICA: ${v}`},
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
                name: "FECHA INICIO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA INICIO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? moment(value).format('ll') : "No def."
                        }
                    },
                }
            },
            {

                name: "FECHA FIN",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA FIN: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? moment(value).format('ll') : "No def."
                        }
                    },
                }
            },
            {
                name: "ESTADO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `ESTADO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            if (value !== "") {
                                let date = moment(value).format('YYYY-MM-DD');
                                let now = moment().format('YYYY-MM-DD');
                                console.log(date, now)
                                if (now < date) {
                                    return <span className="badge badge-primary inline-block">Vigente</span>
                                } else {
                                    return <span className="badge badge-danger inline-block">No Vigente</span>
                                }


                            } else {
                                return "No def.";
                            }


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
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            if (value.state) {
                                return value ?
                                    <>
                                        <OverlayTrigger
                                            overlay={<Tooltip>EDITAR</Tooltip>}>
                                            <Edit style={{color: "#1d86e0"}} onClick={() => this.props.retriveContract(value)}/>

                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            overlay={<Tooltip>INHABILITAR</Tooltip>}>
                                            <Delete style={{color: "#ff5252"}} onClick={() => this.props.deleteContractSweet({id: value.id, state: value.state})}/>
                                        </OverlayTrigger>


                                    </>
                                    : "No def."
                            } else {
                                return value ?


                                    <OverlayTrigger
                                        overlay={<Tooltip>HABILITAR</Tooltip>}>
                                        <RestoreFromTrash style={{color: "#81c334", fontSize: "28px"}}
                                                          onClick={() => this.props.deleteContractSweet({id: value.id, state: value.state})}/>
                                    </OverlayTrigger>


                                    : "No def."
                            }

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
                            r.Charge.denomination,
                            r.Contract_type.denomination,
                            r.Organic_unit.denomination,
                            r.date_start,
                            r.date_end,
                            r.date_end,
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
                    title={"LISTADO DE CONTRATOS"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default ContractDataTable;