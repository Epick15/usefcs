import React, {Component, Fragment} from 'react';
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";

export default class DataTableRecords extends Component {

    getMuiTheme = () =>
        createMuiTheme({
            overrides: {
                MUIDataTable: {
                    paper: {
                        boxShadow: "none",
                        position: 'relative',
                        zIndex: 0                        // marginTop:'-70px'
                    }

                },
                responsiveScroll: {
                    maxHeight: '100px'
                }
            },

        });

    render() {
        const {records} = this.props;

        const columns = [
            {
                name: "Descripción",
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


                    record.denomination.toUpperCase(),


                    record.state ?
                        <Fragment>
                            <Tooltip title={"Editar"}>
                                <IconButton size="small"
                                            onClick={() => this.props.handleClickRetrieveRecord(record)} aria-label="Editar">
                                    <i
                                        className="material-icons text-primary">edit</i></IconButton>
                            </Tooltip>
                            <Tooltip title={"Cerrar"}>
                                <IconButton size="small"
                                            onClick={() => this.props.changeStateMention(record.id)}
                                            aria-label="Disable">
                                    <i
                                        className="material-icons text-danger">delete</i></IconButton>
                            </Tooltip>
                        </Fragment> :
                        <Tooltip title={"Aperturar"}>
                            <IconButton size="small"
                                        onClick={() => this.props.changeStateMention(record.id)} aria-label="Habilitar">
                                <i
                                    className="material-icons text-warning">eject</i></IconButton>
                        </Tooltip>
                ])
            );
        }

        const options = {
            download: false,
            filter: false,
            print: false,
            responsive: 'scrollMaxHeight',
            search: false,
            viewColumns: false,
            selectableRows: false,
            pagination: false,
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
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title=''
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}
