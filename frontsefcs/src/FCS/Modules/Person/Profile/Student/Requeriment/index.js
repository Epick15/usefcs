import React, {Component} from 'react';
import {
    Card

} from "react-bootstrap";

import moment from 'moment';


moment.locale('es');




export default class Requeriment extends Component {

    state = {
        userID: this.props.userID,

    };

    componentDidMount() {

    }


    render() {



        return (




                    <Card style={{marginBottom: '10px'}}>
                        <Card.Body>
                            <div className="d-inline-block align-middle">
                                <div className="d-inline-block">

                                            <h5>NUEVO PROGRAMA DE ESTUDIO </h5>


                                </div>
                            </div>





                        </Card.Body>
                    </Card>



        )
    }
}
