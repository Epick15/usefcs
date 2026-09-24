import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"


class ConfigDataTable extends Component {


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
                name: "ABREVIATURA",
                options: {
                    filter: false,
                    sort: true,

                }
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
                                     onClick={() => this.props.stateConfig(value.id)}
                                >

                                    <input type="checkbox" className="custom-control-input" id={value.id}
                                           checked={value.state}/>
                                    <label className="custom-control-label" htmlFor={value.id}/>
                                    <span className="custom-control-label">Si</span>
                                </div>
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
                            r.description,
                            r.abbreviation,
                            r,
                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"UNIDAD ORGANICA PRINCIPAL"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default ConfigDataTable;