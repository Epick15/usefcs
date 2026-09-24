import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"


class AuthorityDataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {

            filter: false,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            print: false,
            confirmFilters: false,
            download: false,
            viewColumns: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => <OverlayTrigger overlay={<Tooltip>Nueva autoridad</Tooltip>}><button onClick={this.props.openFormModalAuthority} type="button" className="btn-icon btn btn-primary"><Add /></button></OverlayTrigger>,


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
                name: "CARGO",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "UNIDAD",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "VIGENCIA",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: value => <span style={{whiteSpace: 'nowrap'}}>{value}</span>
                }
            },
            {
                name: "TIPO",
                options: {filter: false, sort: true}
            },
            {
                name: "ACTUAL",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ?
                                <div className="custom-control custom-switch"
                                     onClick={() => this.props.stateAuthority(value.id)}
                                >

                                    <input type="checkbox" className="custom-control-input" id={value.id}
                                           checked={value.state}/>
                                    <label className="custom-control-label" htmlFor={value.id}/>
                                    <span className="custom-control-label">{value.state ? "Sí" : "No"}</span>
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
                    customBodyRender: value => <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}><Edit style={{color: '#1d86e0', cursor: 'pointer'}} onClick={() => this.props.editFormModalAuthority(value)} /></OverlayTrigger>
                }
            }


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                    return (
                        data.push([
                            index + 1,
                            r.person,
                            r.charge,
                            r.Organic_unit.denomination,
                            (r.valid_from || 'Sin inicio') + ' - ' + (r.valid_to || 'Actual'),
                            r.type,
                            r,
                            r,
                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"AUTORIDADES"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default AuthorityDataTable;
