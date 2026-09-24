import React, {Component} from 'react';
import {Row} from 'react-bootstrap';

import TitleModule from "../TitleModule";
import NavBarMaintenance from "./NavBarMaintenance";


class Master extends Component {

    render() {


        return (
            <>
                <TitleModule
                    actualTitle={"MAESTRAS"}
                    actualModule={"MAESTRAS"}
                    fatherModuleUrl={""} fatherModuleTitle={""}
                    fatherModule2Url={""} fatherModule2Title={""}

                />

                <Row>


                    <NavBarMaintenance/>


                </Row>
            </>

        );
    }
}

export default Master;
