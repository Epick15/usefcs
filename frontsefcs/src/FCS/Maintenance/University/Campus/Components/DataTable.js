import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import CustomToolbar from "./Toolbar";
import DataTableActions from "./Actions";

export default class DataTableRecords extends Component {
    render() {
        const {records} = this.props;

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "Descripcion",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "Acciones",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => ({align: 'center'}),
                    setCellProps: () => ({align: 'center'}),
                }
            }
        ];

        const data = [];

        if (records.length > 0) {
            records.map((record, index) =>
                data.push([
                    index + 1,
                    record.denomination.toUpperCase(),
                    <DataTableActions
                        record={record}
                        handleClickRetrieveRecord={this.props.handleClickRetrieveRecord}
                        handleOpenSweetAlertWarning={this.props.handleOpenSweetAlertWarning}
                    />
                ])
            );
        } else {
            data.push(["No se encontraron registros", "", ""]);
        }

        const options = {
            download: false,
            filter: false,
            print: false,
            responsive: 'scrolled',
            // expandableRows: true,
            // expandableRowsOnClick: true,
            // expandableRow: () => {
            //     return ('algo')
            // },

            selectableRows: false,
            customToolbar: () => {
                return (
                    <CustomToolbar
                        handleOpenModal={this.props.handleOpenModal}
                        handleRefreshButtonDataTable={this.props.handleRefreshButtonDataTable}
                    />
                )
            },
            textLabels: {
                body: {
                    noMatch: "Lo sentimos, no se encontraron registros coincidentes",
                    toolTip: "Sort",
                },
                pagination: {
                    next: "Siguiente",
                    previous: "Anterior",
                    rowsPerPage: "Registros por página:",
                    displayRows: "de",
                },
                toolbar: {
                    search: "Buscar",
                    downloadCsv: "Descargar CSV",
                    print: "Imprimir",
                    viewColumns: "Ver columnas",
                    filterTable: "Tabla de filtro",
                },
                filter: {
                    all: "Todas",
                    title: "FILTROS",
                    reset: "REINICIAR",
                },
                viewColumns: {
                    title: "Mostrar columnas",
                    titleAria: "Mostrar/Ocultar Columnas de tabla",
                },
                selectedRows: {
                    text: "Registro(s) seleccionados",
                    delete: "Eliminar",
                    deleteAria: "Eliminar registros seleccionados",
                },
            }
        };

        return (
            <MuiThemeProvider theme={myTheme}>
                <MUIDataTable
                    title={"Listado de registros"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

{/*<MuiThemeProvider theme={myTheme}>*/
}
{/*</MuiThemeProvider>*/
}
const myTheme = createMuiTheme({
    overrides: {
        // MuiTableRow: {
        //     height: '30px',
        //     root: {
        //         cursor: 'pointer',
        //
        //     },
        //     hover: {
        //         '&$root': {
        //             '&:hover': {
        //                 background: 'gray'
        //             }
        //         }
        //     }
        // }
    }
});
