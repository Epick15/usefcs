import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';

import Delete from '@material-ui/icons/Delete'
import Details from '@material-ui/icons/Details'
import Storage from '@material-ui/icons/Storage'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component";
import {Link} from "react-router-dom";
import app from "../../../../Constants";
import defaultPhoto from "../../../../../assets/images/user/default.jpg";

class DataTable extends Component {


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
                return (<>
                    <OverlayTrigger
                        overlay={<Tooltip>Nuevo</Tooltip>}>
                        <button onClick={() => this.props.openFormUser()} type="button"
                                className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

                    </OverlayTrigger>

                </>)
            },


        };

        const columns = [{
            name: "#", options: {
                filter: false, sort: true,
            }
        },

            {
                name: "NOMBRE", options: {
                    filter: false, sort: true,

                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? <>    <img
                                src={value.photo ? app.server + app.personPhotography + value.photo : defaultPhoto}
                                alt="user"
                                className="img-radius wid-30  m-r-15"/>
                                {value.name}</> : "No def."
                        }
                    },

                }
            }, {
                name: "USUARIO", options: {
                    filter: false, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            }, {
                name: "EMAIL", options: {
                    filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value.email : "No def."
                        }
                    },

                }
            }, {
                name: "CONTRASEÑA", options: {
                    filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? <span type="button" className="btn btn-link p-0"
                                                 onClick={() => this.props.openSweetUpdatePassDemi(value)}>Actualizar</span> : "Inactivo."
                        }
                    },

                }
            }, {
                name: "ESTADO", options: {
                    filter: true, sort: true, customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? "Activo" : "Inactivo."
                        }
                    },

                }
            }, {
                name: "ACCIONES", options: {
                    filter: false,
                    sort: true,
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? <>
                                <OverlayTrigger
                                    overlay={<Tooltip>Roles</Tooltip>}>
                                    <Link to={"/setting/user/" + btoa(value.id)}> <Details
                                        className={"text-warning"}/></Link>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    overlay={<Tooltip>Log</Tooltip>}>
                                    <Link to={"/setting/user/log/" + btoa(value.id)}> <Storage
                                        className={"text-info"}/></Link>
                                </OverlayTrigger>
                                {value.state ? <OverlayTrigger
                                    overlay={<Tooltip>Inhabilitar</Tooltip>}>
                                    <Delete style={{color: "#ff5252"}}
                                            onClick={() => this.props.openSweetDeleteUser(value.id, value.state)}/>

                                </OverlayTrigger> : <OverlayTrigger
                                    overlay={<Tooltip>Habilitar</Tooltip>}>
                                    <Delete style={{color: "#4367ec"}}
                                            onClick={() => this.props.openSweetDeleteUser(value.id, value.state)}/>

                                </OverlayTrigger>

                                }


                            </> : "No def."
                        }


                    }
                }
            }


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                return (data.push([index + 1, r.Person, r.user, r.Person, r, r.state, r]))
            });
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