import React from 'react';
import {Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';

import Aux from "../../../../hoc/_Aux";

import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';
import 'moment/locale/es';
import $ from 'jquery';
import component from "../../../Component";
import Select from "react-select";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";


moment.locale('es');


class ModalActa extends React.Component {

    state = {modal: false};


    render() {

        const {modal} = this.state;


        return (


            <Modal show={modal} size={"xl"} backdrop="static">
                <Modal.Header className='bg-primary'>
                    <Modal.Title as="h5">TITULO AQUI</Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={<Tooltip style={{zIndex: 100000000}}>Cerrar</Tooltip>}>
                            <Close style={{color: "white"}} onClick={() => this.closeModalProgram()}/>

                        </OverlayTrigger>


                    </div>
                </Modal.Header>
                <Modal.Body>


                </Modal.Body>
            </Modal>


        );
    }
}

export default ModalActa;
