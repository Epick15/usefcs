import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"


class OrganicUnitDataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {

            filter: false,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            print: false,
            confirmFilters: false,
            download: false,
            viewColumns: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormModalUit()} type="button"
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

                }
            },

            {
                name: "ABREV.",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "SEDE",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "ESTADO",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ?
                                <div className="custom-control custom-switch"
                                     onClick={() => this.props.stateOrganicUnit(value.id)}>

                                    <input type="checkbox" className="custom-control-input" id={value.id}
                                           checked={value.state}/>
                                    <label className="custom-control-label" htmlFor={value.id}/>
                                    <span className="custom-control-label">Si</span>
                                </div>
                                : "No def."
                        }
                    },

                }
            },
            {
                name: "ACCIONES",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: value => <OverlayTrigger overlay={<Tooltip>Editar unidad orgánica</Tooltip>}><Edit style={{color: '#1d86e0', cursor: 'pointer'}} onClick={() => this.props.editFormModalOrganicUnit(value)} /></OverlayTrigger>
                }
            },


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.denomination,
                            r.abbreviation,
                            r.Campu.denomination,
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
                    title={"UNIDADES ORGANICAS"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default OrganicUnitDataTable;
