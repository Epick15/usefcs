import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';

import { OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"

import {Link} from "react-router-dom";

import defaultPhoto from '../../../../assets/images/user/default.jpg';
import app from "../../../Constants";
import moment from "moment";




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
                            <button onClick={() => this.props.openForm()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

                        </OverlayTrigger>

                    </>
                )
            },
            onDownload: (buildHead, buildBody, columns, data) => {

                component.pdfReportAutoTable("ESCUELA DE SE UNSM", "REPORTE DE PERFILES", columns, data);
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
                            return value ? <img src={value.photo ? app.server + app.personPhotography + value.photo : defaultPhoto} alt="user"
                                                className="img-radius wid-30  m-r-15"/>
                                : "No def."
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

                            return value ? value.name : "No def."
                        }
                    },

                }
            },
            {
                name: "D.IDENTIDAD",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `D.IDENTIDAD: ${v}`},
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
                    filter: false,
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
            {
                name: "F.NACIMIENTO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `F.NACIMIENTO: ${v}`},
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
                name: "ULTIMA ACTUALIZACION",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `ULTIMA ACTUALIZACION: ${v}`},
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
                                        overlay={<Tooltip>Perfil</Tooltip>}>
                                        <Link to={"/profile/" + btoa(value.id) + "/person"}> <Person className={"text-primary"}/></Link>


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
                            r,
                            r,
                            r.document_number,
                            r.email,
                            r.birth_date,
                            r.gender,
                            r.updated_at,
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
                    title={"LISTADO DE PERFILES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;
