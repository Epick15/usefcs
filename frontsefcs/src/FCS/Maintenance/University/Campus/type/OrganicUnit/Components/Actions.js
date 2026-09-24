import React, {Component} from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

export default class DataTableActions extends Component {
    render() {
        const {record} = this.props;
        return (
            <span>
                <Tooltip title={"Editar"}>
                    <IconButton size="small"
                                onClick={() => this.props.handleClickRetrieveRecord(record)} aria-label="Editar">
                        <i
                            className="material-icons text-primary">edit</i></IconButton>
                </Tooltip>
                <Tooltip title={"Eliminar"}>
                     <IconButton size="small"
                                 onClick={() => this.props.handleOpenSweetAlertWarning(record.id)}
                                 aria-label="Eliminar">
                         <i
                             className="material-icons text-danger">delete</i></IconButton>
                </Tooltip>
            </span>
        );
    }
}
