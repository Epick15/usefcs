import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {
    createTheme,
    MuiThemeProvider
} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

export default class DataTableModal extends Component {
    getMuiTheme = () =>
        createTheme({
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
                name: "Conceptos",
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
            records.map((record, index) => {

                    return (
                        data.push([
                            record.denomination,
                            record.concept_fixed ?
                                <Tooltip title={"Sin Acción"}>
                                    <button style={{
                                        padding: '0',
                                        border: 'none',
                                        background: 'none',
                                        outline: 'none',
                                        color: '#4680ff',
                                        disable: true
                                    }}>
                                        <i className="material-icons text-info"

                                           style={{fontSize: '17px'}}
                                        >new_releases</i>
                                    </button>


                                </Tooltip>
                                :
                                record.state ?
                                    <>
                                        <Tooltip title={"Editar"}>
                                            <button style={{

                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#4680ff'

                                            }}>
                                                <i className="material-icons text-primary"
                                                   onClick={() => this.props.handleRetrieveConcepts(record)}
                                                   style={{fontSize: '19px'}}>edit</i>
                                            </button>
                                        </Tooltip>
                                        <Tooltip title={"Deshabilitar"}>
                                            <button style={{

                                                padding: '0',
                                                border: 'none',
                                                background: 'none',
                                                outline: 'none',
                                                color: '#4680ff'

                                            }}>
                                                <i className="material-icons text-danger"
                                                   onClick={() => this.props.deleteConcepts(record.id)}
                                                   style={{fontSize: '19px'}}>delete</i>
                                            </button>
                                        </Tooltip>

                                    </>
                                    :
                                    <Tooltip title={"Habilitar"}>
                                        <button style={{

                                            padding: '0',
                                            border: 'none',
                                            background: 'none',
                                            outline: 'none',
                                            color: '#4680ff'

                                        }}>
                                            <i className="material-icons text-warning"
                                               onClick={() => this.props.deleteConcepts(record.id)}
                                               style={{fontSize: '19px'}}>eject</i>
                                        </button>
                                    </Tooltip>
                        ])
                    )
                }
            )
            ;
        } else {
            data.push(["No se encontraron registros", "", ""]);
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
            // customToolbar: () => {
            //     return (
            //         <>
            //             <Tooltip title={"Roles"}><a href="#">
            //                 <i className="material-icons text-primary"
            //                    // onClick={() => this.props.handleClickRetrieveRecord(record)}
            //                    style={{
            //
            //                        fontSize: '17px',
            //
            //                    }}
            //                 >vpn_key</i>
            //             </a>
            //             </Tooltip>
            //
            //         </>
            //     )
            // },
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
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}
