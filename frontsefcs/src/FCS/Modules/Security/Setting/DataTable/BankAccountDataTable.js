import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete'
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../../Component"

class BankAccountDataTable extends Component {


    getMuiTheme = () => createMuiTheme({overrides: component.MuiOption.overrides});

    render() {

        const {records} = this.props;
        const options = {

            filter: false,
            searchOpen: false,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: false,
            print:false,
            confirmFilters:false,
            download:false,
            viewColumns:false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Nuevo</Tooltip>}>
                            <button onClick={() => this.props.openFormModalBankAccount()} type="button" className="btn-icon btn btn-primary"><i className="feather icon-plus"></i></button>

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
                name: "ENTIDAD",
                options: {
                    filter: false,
                    sort: true,

                }
            },

            {
                name: "CUENTA",
                options: {
                    filter: false,
                    sort: true,

                }
            },
            {
                name: "CCI",
                options: {
                    filter: false,
                    sort: true,

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
                            r.Bank.denomination || <span className='text-muted'>No def.</span>,
                            r.number_account || <span className='text-muted'>No def.</span>,
                            r.cci || <span className='text-muted'>No def.</span>,

                            <>
                                <OverlayTrigger
                                    overlay={<Tooltip>Editar</Tooltip>}>
                                    <Edit style={{color: "#1d86e0"}} onClick={() => this.props.editFormModalBankAccount(r)}/>

                                </OverlayTrigger>
                                <OverlayTrigger
                                    overlay={<Tooltip>Eliminar</Tooltip>}>
                                    <Delete style={{color: "#ff5252"}} onClick={() => this.props.sweetDeleteBankAccount(r.id)}/>

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
                    title={"LISTADO DE CUENTAS BANCARIAS "}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default BankAccountDataTable;