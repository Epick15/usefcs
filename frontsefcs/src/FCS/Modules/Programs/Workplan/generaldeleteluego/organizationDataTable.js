import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Receipt from "@material-ui/icons/Receipt";

class ComissionDataTable extends Component {

    constructor(props) {
        super(props);

    };

    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {

            filter: true,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormOrganization()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i>
                            </button>

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
                name: "OBSERVACIÓN",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        return value ? value.denomination : "No def."

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
                            return (
                                <>

                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}>
                                        <Edit style={{color: "#1d86e0"}} onClick={() => this.props.retriveFormOrganization(value)}/>

                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={<Tooltip>ANULAR</Tooltip>}>
                                        <Delete style={{color: "#ff5252"}} onClick={() => this.props.openOrganizationSweetAlert(value.id)}/>

                                    </OverlayTrigger>

                                </>
                            )
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
                            r.Person.name,
                            r.charge,
                            r.observation,
                            r
                        ])
                    )
                }
            );
        } else {
            data.push([]);
        }


        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"ORGANIZACIÓN"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default ComissionDataTable;