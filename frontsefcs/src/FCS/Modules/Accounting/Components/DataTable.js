import React, {Component} from 'react';
import CustomToolbar from "./Toolbar";
import DataTableActions from "./Actions";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

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
                name: "Especialidad",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "Estado",
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
                    record.state?<span className='text-primary'>Activo</span>:<span className='text-danger'>Inactivo</span>,
                    record.state?
                    <DataTableActions
                        record={record}
                        handleClickManagePrograms={this.props.handleClickManagePrograms}
                        handleClickRetrieveRecord={this.props.handleClickRetrieveRecord}
                        handleOpenSweetAlertWarning={this.props.handleOpenSweetAlertWarning}
                    />:
                    <Tooltip title={"Aperturar"}>
                        <IconButton size="small"
                                    onClick={() => this.props.handleOpenSweetAlertWarning(record.id,'enable')} aria-label="Habilitar">
                            <i
                                className="material-icons text-warning">eject</i></IconButton>
                    </Tooltip>
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
                <MUIDataTable
                    title={"Listado de registros"}
                    data={data}
                    columns={columns}
                    options={options}
                />
        );
    }
}
