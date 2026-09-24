import React from "react";

import Tooltip from "@material-ui/core/Tooltip";

import {withStyles} from "@material-ui/core/styles";

const defaultToolbarStyles = {
    iconButton: {}
};

class CustomToolbar extends React.Component {
    render() {


        return (
            <React.Fragment>

                <Tooltip title={"Recargar"}>


                        <i className="material-icons text-dark"
                           style={{
                               float: 'right',
                               marginRight: '5px'
                           }}
                           onClick={() => this.handleOpenSweetAlertWarning()}
                        >add</i>

                </Tooltip>

            </React.Fragment>
        );
    }
}

export default withStyles(defaultToolbarStyles, {name: "CustomToolbar"})(
    CustomToolbar
);
