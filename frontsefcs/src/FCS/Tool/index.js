import React from "react";


const MuiOption =
    {
        overrides: {
            MUIDataTable: {
                root: {
                    backgroundColor: "#FF000"
                },
                paper: {
                    boxShadow: "0 5px 11px 0px rgba(69, 90, 100, 0.3)"
                }
            },
            MUIDataTableHeadCell: {
                fixedHeader: {
                    borderBottom: "1px solid #e2e5e8",
                    fontSize: "13px",
                    color: "#37474f",
                    backgroundColor: "#ecf0f5"
                },

            },
            MUIDataTableBodyCell: {
                root: {


                    bordertop: "1px solid #e2e5e8",
                    whitespace: "nowrap",

                },

            },
            MUIDataTableHead: {
                root: {
                    backgroundColor: "#ecf0f5",
                    color: "rgb(255, 255, 255)",
                    borderBottom: "none"
                }
            },

        },
        textLabels: {
            body: {
                noMatch: "Lo sentimos, no se encontraron registros coincidentes",
                toolTip: "Ordenar",
                columnHeaderTooltip: column => `Ordenar por ${column.label}`
            },
            pagination: {
                next: "Siguiente página",
                previous: "Pagina anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar CSV",
                print: "Imprimir",
                viewColumns: "Ver columnas",
                filterTable: "Tabla de filtros",
            },
            filter: {
                all: "Todas",
                title: "FILTROS",
                reset: "REINICIAR",
            },
            viewColumns: {
                title: "Mostrar colunas",
                titleAria: "Mostrar / ocultar colunas da tabela",
            },
            selectedRows: {
                text: "fila (s) seleccionada (s)",
                delete: "Eliminar",
                deleteAria: "Eliminar filas seleccionadas",
            },
        },
        pnotice: {
            title: "Advertencia!",
            text: "Complete los campos obligatorios",
            delay: 2000
        },
        psuccess: {
            title: "Finalizado",
            text: "Datos registrados correctamente",
            delay: 2000
        }
    };
let Loader = async () => {

    return (
        <div className="spinner-grow text-light" role="status">
            <span className="sr-only">Loading...</span>
        </div>

    );
};
export default {Loader, MuiOption};