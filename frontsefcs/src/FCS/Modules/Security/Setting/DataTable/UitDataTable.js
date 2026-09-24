import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"


class UitDataTable extends Component {


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
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormModalUit()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

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
                name: "AÑO",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "MONTO",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "Actual",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ?
                                <div className="custom-control custom-switch" onClick={() => this.props.actualUit(value.id)}>

                                    <input type="checkbox" className="custom-control-input" id={value.id} checked={value.state}/>
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
                    sort: true,
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),
                }
            }


        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.year || <span className='text-muted'>No def.</span>,
                            r.amount || <span className='text-muted'>No def.</span>,
                            r,

                            <>
                                <OverlayTrigger
                                    overlay={<Tooltip>Editar</Tooltip>}>
                                    <Edit style={{color: "#1d86e0"}} onClick={() => this.props.editFormModalUit(r)}/>

                                </OverlayTrigger>
                                <OverlayTrigger
                                    overlay={<Tooltip>Eliminar</Tooltip>}>
                                    <Delete style={{color: "#ff5252"}} onClick={() => this.props.sweetDeleteUit(r.id)}/>

                                </OverlayTrigger>


                            </>


                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"UNIDAD IMPOSITIVA TRIBUTARIA - UIT"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default UitDataTable;