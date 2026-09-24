import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import AddIcon from "@material-ui/icons/Add";
import {withStyles} from "@material-ui/core/styles";

const defaultToolbarStyles = {
    iconButton: {}
};

class CustomToolbar extends React.Component {
    render() {
        const {classes} = this.props;

        return (
            <React.Fragment>
                <Tooltip title={"Recargar"}>
                    <IconButton className={classes.iconButton} onClick={this.props.handleRefreshButtonDataTable}>
                        <RefreshIcon className={classes.deleteIcon}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Agregar"}>
                    <IconButton className={classes.iconButton} onClick={this.props.handleOpenModal}>
                        <AddIcon className={classes.deleteIcon}/>
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    }
}

export default withStyles(defaultToolbarStyles, {name: "CustomToolbar"})(
    CustomToolbar
);
