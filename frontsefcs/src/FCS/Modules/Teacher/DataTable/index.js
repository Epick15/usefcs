import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';

import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import {Link} from "react-router-dom";
import Details from "@material-ui/icons/Details";
import app from "../../../Constants";
import defaultPhoto from "../../../../assets/images/user/default.jpg";

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
                name: "NOMBRE",
                options: {
                    filter: false,
                    sort: true,

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? <>    <img src={value.photo ? app.server + app.personPhotography + value.photo : defaultPhoto} alt="user" className="img-radius wid-30  m-r-15"/>
                                {value.name}</> : "No def."
                        }
                    },

                }
            },
            {
                name: "DNI",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `DNI: ${v}`},
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
                name: "CORREO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CORREO: ${v}`},
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
            //     name: "CARGO",
            //     options: {
            //         filter: true,
            //         sort: true,
            //         customFilterListOptions: {render: v => `CARGO: ${v}`},
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

            // {
            //     name: "TIPO CONTRATO",
            //     options: {
            //         filter: true,
            //         sort: true,
            //         customFilterListOptions: {render: v => `TIPO CONTRATO: ${v}`},
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
            // {
            //     name: "ESTADO",
            //     options: {
            //         filter: true,
            //         sort: true,
            //         customFilterListOptions: {render: v => `ESTADO: ${v}`},
            //         customBodyRender: (value, tableMeta, updateValue) => {
            //
            //             if (value === undefined) {
            //                 return "No def.";
            //             } else {
            //                 if (value === true) {
            //                     return <span className="badge badge-primary inline-block">Habilitado</span>
            //                 } else if (value === false) {
            //                     return <span className="badge badge-danger inline-block">Inhabilitado</span>
            //                 } else {
            //                     return "No def.";
            //                 }
            //
            //
            //             }
            //         },
            //     }
            // },
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
                                        overlay={<Tooltip>Contratos</Tooltip>}>
                                        <Link to={"/teacher/" +  btoa(value.id) + "/contract"}> <Details className={"text-warning"}/></Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>Perfil</Tooltip>}>
                                        <Link to={"/profile/" +  btoa(value.id) + "/person"}> <Person className={"text-primary"}/></Link>


                                    </OverlayTrigger>
                                    {/*<OverlayTrigger*/}
                                    {/*    overlay={<Tooltip>Eliminar</Tooltip>}>*/}
                                    {/*    <Delete style={{color: "#ff5252"}} onClick={() => this.props.openSweetAlert(value.id)}/>*/}

                                    {/*</OverlayTrigger>*/}

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
                            r,
                            r.document_number,
                            r.email,
                            r.Teachers[0].Organic_unit.denomination,
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
                    title={"LISTADO DEL PERSONAL DOCENTE"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;