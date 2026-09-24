import React, {Component} from 'react';
import { Col,  Form,  Table} from "react-bootstrap";
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import NumberFormat from "react-number-format";


import generator from 'voucher-code-generator';
import moment from 'moment';



import component from "../../../../Component";

moment.locale('es');


moment.locale('es');



export default class Cost extends Component {

    state = {

        // startDate: moment().format('l'),
        // startDate: new Date(),
        /////////STATE FORM////////////
        modalCost: false,
        action: 'add',

        costForm: false,
        programID: "",
        costID: '',
        costConceptID: '',
        code: '',
        concept: '',
        amount: '',
        amountMask: '',

        loader: false,
        actualCost: false,
        onlineCost: false,

        concepts: [],

        costPrograms: [],
        costs: [],
        codeCost: '',
    };

    componentDidMount() {
        this.setState({programID: this.props.program});
        this.listConceptsType();
        this.generateCode();
        this.props.program && this.listCostByPlanID(this.props.program);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.program !== this.props.program) {
            this.setState({programID: this.props.program});
            this.props.program && this.listConceptsType(this.props.program);
        }
    }

    returnCost = () => {
        return this.state.concepts
    };
    returnCode = () => {
        return this.state.code
    };

    //FUNCION PARA CARGAR LOS CONCETOS
    listConceptsType() {
        this.setState({loader: true})
        const url = app.general + '/' + app.concepts + '/type/Ingreso';
        axios.get(url, app.headers).then(res => {

            if (res.data) {

                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].state = false;
                }

                this.setState({concepts: res.data})

            }
            this.setState({loader: false})
        }).catch(err => {
            this.setState({loader: false})
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };

    // FUNCION PARA CARGAR LOS COSTOS COJE EL ARRAY CERO POR QUE ES EL QUE ESTA ACTIVO
    listCostByPlanID(planID) {
        this.setState({loader: true})
        const url = app.programs + '/' + app.cost + '/' + planID + '/' + app.plan;
        axios.get(url, app.headers).then(res => {
            if (res.data.length > 0) {
                let concepts = this.state.concepts;
                let arrayTempCost = res.data;

                for (let i = 0; i < arrayTempCost.length; i++) {
                    for (let j = 0; j < concepts.length; j++) {
                        if (concepts[j].id === arrayTempCost[i].id_concept) {
                            concepts[j].id = arrayTempCost[i].id;
                            concepts[i].state = arrayTempCost[i].state;
                            concepts[i].amount = arrayTempCost[i].amount;
                        }
                    }
                }


                this.setState({concepts: concepts, code: res.data[0].code})
            }

            this.setState({loader: false})

        }).catch(err => {
            this.setState({loader: false})
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };


    //FUNCION PARA GENERAR CODIGO
    generateCode = () => {
        this.setState({
            code: generator.generate({
                length: 5,
                count: 1,
                charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            }),
            errorCode: false
        });


    };
    handleChange = field => event => {
        switch (field) {
            case 'code':
                this.setState({code: event.target.value});
                break;
            case 'amount':
                this.setState({
                    amount: event.target.value.substr(4).replace(/,/g, ''),
                    amountMask: event.target.value
                });
                break;
            case 'concept':
                this.setState({concept: event.target.value});
                break;
            case 'required':
                if (event) {
                    if (event) {
                        let array = [];
                        for (let i = 0; i < event.length; i++) {
                            array.push({value: event[i].value, label: event[i].label, order: event[i].order});
                        }
                        this.setState({required: array, changed: true});
                    }

                }
                break;
            case 'onlineCost':
                this.setState({onlineCost: !this.state.onlineCost});


                break;
            case 'actualCost':
                console.log(event.target.value)
                this.setState({actualCost: !this.state.actualCost});
                if (event.target.value === "true") {
                    this.setState({onlineCost: false});
                }


                break;
            default:
                break;
        }
    };
    openModalCost = () => {

        this.setState({
            modalCost: true,

        })

    };

    closeModalCost = () => {
        this.setState({modalCost: false})
    };

    handleChangeAmount = (j, data) => {
        let concepts = this.state.concepts;
        if (concepts[j].state) {
            concepts[j].amount = data.target.value;
        }
        this.setState({concepts: concepts});

    };
    changeCheckState = (k) => {

        let concepts = this.state.concepts;
        concepts[k].state = !concepts[k].state;
        if (concepts[k].state === false) {
            concepts[k].amount = null
        }
        this.setState({concepts});
    };
    openFormCost = () => {

        this.generateCode();
        this.setState({
            costForm: true,
            action: "add",
            titleFormCost: "Nuevo",
            actualCost: "",
            onlineCost: "",

        });


    };
    restConcept = () => {
        let concepts = this.state.concepts;
        for (let j = 0; j < concepts.length; j++) {
            concepts[j].id_parent = null;
            concepts[j].state = null;
            concepts[j].amount = null
        }
    };
    editFormCost = (data) => {
        this.restConcept();
        let concepts = this.state.concepts;
        let arrayTempCost = data.Concepts;
        for (let i = 0; i < arrayTempCost.length; i++) {
            for (let j = 0; j < concepts.length; j++) {
                if (concepts[j].id === arrayTempCost[i].id_parent) {
                    concepts[i].id_parent = arrayTempCost[i].id;
                    concepts[i].state = arrayTempCost[i].state;
                    concepts[i].amount = arrayTempCost[i].amount;
                }
            }
        }
        this.setState({concepts});
        this.setState({
            costForm: true,
            action: "update",
            titleFormCost: "Editar",
            actualCost: data.state,
            onlineCost: data.online,
            code: data.code,
            costConceptID: data.id
        });


    };
    closeFormCost = () => {
        this.restConcept();

        this.setState({

            costForm: false,
            action: "add",
            titleFormCost: "",
            actualCostID: "",
            code: "",

        })
    };

    render() {
        //state frontend

        const {concepts} = this.state;

        return (


            <>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h5 className="mb-3 mt-1"> Conceptos de pago </h5>
                    <Table size="sm" hover style={{width: '100%'}}>
                        <thead>
                        <tr className="d-flex">
                            <th className="col-6">Concepto</th>
                            <th className="col-6">Monto</th>
                        </tr>
                        </thead>
                        {this.state.loader && component.spiner}
                        <tbody>

                        {concepts.length > 0 && concepts.map((k, j) => {

                            return (
                                <tr className="d-flex" key={j} style={{height: "45px"}}>

                                    <td className="col-6">
                                        <div className="d-inline-block align-middle">

                                            <div className="d-inline-block">
                                                <label
                                                    className="check-task custom-control custom-checkbox d-flex ">
                                                    <input type="checkbox" className="custom-control-input"
                                                           id={"customCheck" + j}
                                                           onClick={() => this.changeCheckState(j)}
                                                           checked={k.state}
                                                           value={k.state}
                                                           readOnly

                                                    />
                                                    <p className="custom-control-label m-b-0">{k.denomination}</p>
                                                </label>

                                            </div>
                                        </div>

                                    </td>
                                    <td className="col-6">
                                        <Form.Group className="form-group fill" style={{marginTop: "-8px"}}>

                                            <NumberFormat
                                                value={k.amount}
                                                onChange={this.handleChangeAmount.bind(this, j)}
                                                className="form-control"
                                                placeholder="Ingreso monto" margin="normal"
                                                thousandSeparator/>
                                        </Form.Group>

                                    </td>


                                </tr>
                            )
                        })}


                        </tbody>
                    </Table>

                </Col>
            </>


        )
    }
}
