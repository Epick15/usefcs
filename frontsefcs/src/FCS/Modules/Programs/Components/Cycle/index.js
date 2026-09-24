import React, {Component} from 'react';
import {
    Table,
    Form

} from "react-bootstrap";
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";


import moment from 'moment';



import component from '../../../../Component';

moment.locale('es');


export default class Cycle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalCycle: false,
            programID: "",
            academicPeriodCant: 6,
            academicPeriod: "Semestre",
            action: "add",
            loader: false,
            semesters: [],
            cycles: [
                {id: 1, cycle: 'I', semester: '', state: false, exists: false},
                {id: 1, cycle: 'II', semester: '', state: false, exists: false},
                {id: 1, cycle: 'III', semester: '', state: false, exists: false},
                {id: 1, cycle: 'IV', semester: '', state: false, exists: false},
                {id: 1, cycle: 'V', semester: '', state: false, exists: false},
                {id: 1, cycle: 'VI', semester: '', state: false, exists: false},
                {id: 1, cycle: 'VII', semester: '', state: false, exists: false},
                {id: 1, cycle: 'VIII', semester: '', state: false, exists: false},
                {id: 1, cycle: 'IX', semester: '', state: false, exists: false},
                {id: 1, cycle: 'X', semester: '', state: false, exists: false}
            ],
        };
    }


    componentDidMount() {
        this.setState({
            programID: this.props.program
        })
        this.props.program && this.getCycle(this.props.program);

        for (let i = 0; i < this.state.academicPeriodCant; i++) {
            let number = i + 1;
            this.state.semesters.push(<option value={number} key={i}>{this.state.academicPeriod + " " + number}</option>)
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.program !== this.props.program) {
            this.setState({programID: this.props.program});
            this.props.program && this.getCycle(this.props.program);
        }
    }

    getCycle(id) {
        this.setState({loader: true})
        const url = app.programs + '/' + app.cycle + '/' + id + '/' + app.plan;
        axios.get(url, app.headers).then(res => {
            if (res.data.length > 0) {
                let array = this.state.cycles;

                let data = res.data;

                for (let i = 0; i < array.length; i++) {
                    for (let k = 0; k < data.length; k++) {
                        if (array[i].cycle === data[k].ciclo) {
                            array[i].id = data[k].id;
                            array[i].semester = data[k].period;
                            array[i].state = data[k].state;
                            array[i].exists = true;

                        }
                    }


                }
                this.setState({cycles: array, action: "update"});
            }

            this.setState({loader: false})

        }).catch(err => {
            this.setState({loader: false})
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los ciclos",
                delay: 2000
            });
            console.log(err);
        })
    };

    returnCycle = () => {
        return this.state.cycles;
    };


    openModalCycle = () => {
        this.setState({modalCycle: true})
    };

    handleChangeSemeter = (i, e) => {
        let cycles = this.state.cycles;
        if (cycles[i].state) {
            cycles[i].semester = e.target.value;
            this.setState({cycles});
        }


    };
    checkCycle = (i) => {
        let cycles = this.state.cycles;
        cycles[i].state = !cycles[i].state;
        if (cycles[i].state === false) {
            cycles[i].semester = "";
        }

        this.setState({cycles});
    };

    render() {
        //state frontend
        const {cycles} = this.state;

        return (
            <>
                <h5 className="mb-3 mt-1">Ciclos</h5>
                <Table size="sm" hover style={{width: '100%'}}>
                    <thead>
                    <tr className="d-flex">
                        <th className="col-4">Ciclo</th>
                        <th className="col-8">Perido Academico</th>


                    </tr>
                    </thead>
                    {this.state.loader && component.spiner}
                    <tbody>

                    {cycles.length > 0 && cycles.map((k, j) => {

                        return (
                            <tr className="d-flex" key={j} style={{height: "45px"}}>

                                <td className="col-4">
                                    <div className="d-inline-block align-middle">

                                        <div className="d-inline-block">
                                            <label
                                                className="check-task custom-control custom-checkbox d-flex ">
                                                <input type="checkbox" className="custom-control-input"
                                                       id="customCheck2"
                                                       onClick={() => this.checkCycle(j)}
                                                       checked={k.state}
                                                       value={k.state}
                                                       readOnly

                                                />
                                                <p className="custom-control-label m-b-0">{k.cycle}</p>
                                            </label>

                                        </div>
                                    </div>

                                </td>


                                <td className="col-8">
                                    <Form.Group className="form-group fill" style={{marginTop: "-8px"}}>

                                        <Form.Control as="select"
                                                      value={k.semester}
                                                      onChange={this.handleChangeSemeter.bind(this, j)}

                                        >

                                            <option defaultValue={true} hidden>Seleccione</option>
                                            {
                                                this.state.semesters.length > 0 ?
                                                    this.state.semesters
                                                    :
                                                    <option disabled>No hay registros</option>
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                </td>


                            </tr>
                        )
                    })}


                    </tbody>
                </Table>

            </>
        )
    }
}
