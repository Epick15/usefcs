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
import component from "../../../Component"
import Details from "@material-ui/icons/Details";
import {Link} from "react-router-dom";
import Assessment from "@material-ui/icons/Assessment";
import app from "../../../Constants";
import defaultPhoto from "../../../../assets/images/user/default.jpg";
import moment from "moment";

class Index extends Component {

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
            rowsPerPageOptions: [10, 30, 50, 500],
            draggableColumns: {
                enabled: true
            },
            downloadOptions: {
                filename: 'excel-format.csv',
                separator: ';',
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                }
            },
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
            onDownload: (buildHead, buildBody, columns, data) => {

                component.pdfReportAutoTableThreeTitle(
                    "REPORTE DE INGRESO DE ESTUDIANTES",
                    this.props.programMask,
                    "UNIDAD : ESCUELA DE SE PLAN DE ADMISION : 2017 - 1   PLAN DE ESTUDIOS : 2017 -1",
                    columns,
                    data
                );
                return false;
            },
        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return <img src={value ? app.server + app.personPhotography + value : defaultPhoto}
                                        alt="user"
                                        className="img-radius wid-30  m-r-15"/>

                        }
                    },
                }
            },
            {
                name: "NOMBRE",
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
                name: "DNI",
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
                name: "GENERO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `GENERO: ${v}`},
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
                name: "MODALIDAD",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `MODALIDAD: ${v}`},
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
                                            <Link to={"/student/program/" + btoa(value.id) + "/accreditation"}>
                                                <Unarchive className={"text-warning"}/></Link>
                                        </OverlayTrigger>

                                        {
                                            value.type !== "Postulante" &&
                                            <>

                                                <OverlayTrigger
                                                    overlay={<Tooltip>MATRICULAS</Tooltip>}>
                                                    <Link to={"/student/program/" + btoa(value.id) + "/registration"}>
                                                        <VerifiedUser className={"text-purple"}/></Link>


                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    overlay={<Tooltip>PAGOS</Tooltip>}>
                                                    <Link to={"/student/program/" + btoa(value.id) + "/amortization"}>
                                                        <AccountBalanceWallet className={"text-info"}/></Link>


                                                </OverlayTrigger>
                                            </>

                                        }


                                        <OverlayTrigger
                                            overlay={<Tooltip>EDITAR</Tooltip>}>
                                            <Edit style={{color: "#1d86e0"}}
                                                  onClick={() => this.props.retriveStudent(value)}/>

                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                            <Delete style={{color: "#ff5252"}}
                                                    onClick={() => this.props.deleteStudentsweet(value.id)}/>
                                        </OverlayTrigger>


                                    </>
                                    : "No def."
                            } else {
                                return value.state ?


                                    <OverlayTrigger
                                        overlay={<Tooltip>HABILITAR</Tooltip>}>
                                        <RestoreFromTrash style={{color: "#81c334", fontSize: "28px"}}
                                                          onClick={() => this.props.deleteContractSweet({
                                                              id: value.id,
                                                              state: value.state
                                                          })}/>
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
                            r.Person.photo,
                            r.Person.name,
                            r.Person.document_number,
                            r.Person.gender,
                            r.Cost_admission_plan.Concept.denomination,
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
                    title={"LISTADO DE ESTUDIANTES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default Index;
