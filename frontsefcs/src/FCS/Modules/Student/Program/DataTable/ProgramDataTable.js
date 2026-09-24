import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import Unarchive from '@material-ui/icons/Unarchive'
import VerifiedUser from '@material-ui/icons/VerifiedUser'
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"

import {Link} from "react-router-dom";


class ProgramDataTable extends Component {

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
                name: "PROGRAMA DE ESTUDIO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value.denomination ? value.denomination : "No def."
                        }
                    },
                }
            },
            {
                name: "PLAN DE ESTUDIO",
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
                name: "PLAN DE ADMISIÓN",
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
                name: "MODALIDADA DE INGRESO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `MODALIDADA DE INGRESO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined || value === null) {
                            return "No def.";
                        } else {

                            return value ? value.denomination : "No def."
                        }
                    },
                }
            },
            {

                name: "ESTADO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `FECHA FIN: ${v}`},
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
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            if (value) {
                                return value.state ?
                                    <>
                                        <OverlayTrigger overlay={<Tooltip>ACREDITACIÓN</Tooltip>}>
                                            <Link to={"/student/program/" + btoa(value.id) + "/accreditation"}> <Unarchive className={"text-warning"}/></Link>
                                        </OverlayTrigger>

                                        {
                                            value.type !== "Postulante" &&

                                            <OverlayTrigger
                                                overlay={<Tooltip>MATRICULAS</Tooltip>}>
                                                <Link to={"/student/program/" + btoa(value.id) + "/registration"}> <VerifiedUser className={"text-purple"}/></Link>


                                            </OverlayTrigger>

                                        }
                                        <OverlayTrigger
                                            overlay={<Tooltip>PAGOS</Tooltip>}>
                                            <Link to={"/student/program/" + btoa(value.id) + "/amortization"}> <AccountBalanceWallet className={"text-info"}/></Link>


                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            overlay={<Tooltip>EDITAR</Tooltip>}>
                                            <Edit style={{color: "#1d86e0"}} onClick={() => this.props.retriveStudent(value)}/>

                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                            <Delete style={{color: "#ff5252"}} onClick={() => this.props.deleteStudentsweet(value.id)}/>
                                        </OverlayTrigger>


                                    </>
                                    : "No def."
                            } else {
                                return value.state ?


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
                            r.Program,
                            r.Plan.description,
                            r.Admission_plan.description,
                            r.Concept,
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
                    title={"LISTADO DE PROGRAMAS DE ESTUDIO"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default ProgramDataTable;
