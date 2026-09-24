import React, {Fragment,Component} from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

export default class DataTableActions extends Component {
    render() {
        const {record} = this.props;
        return (
            <Fragment>
                <Tooltip title={"Editar"}>
                    <IconButton size="small"
                                onClick={() => this.props.handleClickRetrieveRecord(record)} aria-label="Editar">
                        <i
                            className="material-icons text-primary">edit</i></IconButton>
                </Tooltip>
                <Tooltip title={"Cerrar"}>
                     <IconButton size="small"
                                 onClick={() => this.props.handleOpenSweetAlertWarning(record.id,'disable')}
                                 aria-label="Disable">
                         <i
                             className="material-icons text-danger">block</i></IconButton>
                </Tooltip>
                <Tooltip title={"Gestionar programas"}>
                    <IconButton size="small"
                                onClick={() => this.props.handleClickManagePrograms(record)} aria-label="Editar">
                        <i
                            className="material-icons text-primary">arrow_forward</i></IconButton>
                </Tooltip>
            </Fragment>
        );
    }
}
