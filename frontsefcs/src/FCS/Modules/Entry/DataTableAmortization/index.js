import React, {Component} from 'react';
import MUIDataTable from "mui-datatables";
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import component from "../../../Component"
import Refresh from '@material-ui/icons/Refresh'
import PNotify from "pnotify/dist/es/PNotify";
import app from "../../../Constants";
import axios from "axios";

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            totalBalance: this.props.totalBalance,
            records: this.props.records,
            paidOut: [],
        }

    };

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.records !== this.props.records) {
            this.setState({records: this.props.records})
        }
        if (prevProps.totalBalance !== this.props.totalBalance) {
            this.setState({totalBalance: this.props.totalBalance})
        }

    };

    async updateStatePayment() {

        let paidOutTemp = this.state.paidOut
        paidOutTemp = paidOutTemp.filter(item => item)
        if (paidOutTemp.length > 0) {
            const url = app.accounting + '/' + app.payment + '/state';
            let data = new FormData();
            data.set('concepts', JSON.stringify(paidOutTemp));
            try {
                const res = await axios.patch(url, data, app.headers);
                this.toggleAction();
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});

            } catch (err) {
                // this.setState({loaderRegistration: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loaderRegistration: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };

    getMuiTheme = () => createTheme({overrides: component.MuiOption.overrides});
    changeState = (i, e) => {
        let concepts = this.state.records;
        let paidOutTemp = this.state.paidOut;


        //actuaizamos los id ya registrados
        for (let k = 0; k < concepts.length; k++) {
            if (concepts[k].type === 'Pagado') {
                paidOutTemp[k] = {'id': concepts[k].id, 'type': 'Pagado', 'denomination': concepts[k].denomination}
            }
        }


        //buscarmo si existe el id en nuestro array temporal


        if (e.target.value === 'Pagado') {
            if (parseFloat(concepts[i].amount) <= this.state.totalBalance) {
                paidOutTemp[i] = {'id': concepts[i].id, 'type': 'Pagado', 'denomination': concepts[i].denomination}
                concepts[i].type = e.target.value;
                this.props.reduceTotalMovement('add', concepts[i].amount)
                this.setState({paidOut: paidOutTemp})

            } else {
                PNotify.notice({
                    title: "No cuenta con saldo disponible!",
                    text: "Los comprobantes deben ser aceptados",
                    delay: 2000
                });
            }
        }
        if (e.target.value === 'Pendiente') {
            paidOutTemp[i] = {'id': concepts[i].id, 'type': 'Pendiente', 'denomination': concepts[i].denomination}
            concepts[i].type = e.target.value;
            this.props.reduceTotalMovement('delete', concepts[i].amount)
            this.setState({paidOut: paidOutTemp})
        }


    };
    toggleAction = () => {
        this.setState({edit: !this.state.edit})
    }

    render() {

        const {records} = this.state;
        let total = 0;
        let pendient = 0;
        records.map(r => {
            if (r.type === 'Pagado') {
                total = parseFloat(r.amount) + total
            } else {
                pendient = parseFloat(r.amount) + pendient
            }
        })

        const options = {

            filter: true,
            searchOpen: false,
            rowsPerPage: 100,
            responsive: 'simple',
            searchPlaceholder: "Buscar",
            search: true,
            print: false,
            download: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger
                            overlay={<Tooltip>Recargar</Tooltip>}>
                            <button onClick={() => this.props.callConceptStudent()} type="button"
                                    className="btn-icon btn btn-light"><Refresh/></button>

                        </OverlayTrigger>
                        {/*{*/}

                        {/*    this.state.edit ?*/}
                        {/*        <OverlayTrigger*/}
                        {/*            overlay={<Tooltip>Guardar</Tooltip>}>*/}
                        {/*            <button onClick={() => this.updateStatePayment()} type="button"*/}
                        {/*                    className="btn-icon btn btn-primary"><i className="feather icon-save"></i>*/}
                        {/*            </button>*/}
                        {/*        </OverlayTrigger>*/}
                        {/*        :*/}
                        {/*        <OverlayTrigger*/}
                        {/*            overlay={<Tooltip>Editar</Tooltip>}>*/}
                        {/*            <button onClick={() => this.toggleAction()} type="button"*/}
                        {/*                    className="btn-icon btn btn-primary"><i className="feather icon-edit-2"></i>*/}
                        {/*            </button>*/}
                        {/*        </OverlayTrigger>*/}
                        {/*}*/}
                    </>


                )
            },


        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "F.LIMITE PAGO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `F.LIMITE PAGO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },

                }
            },
            {
                name: "CONCEPTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `CONCEPTO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },

                }
            },
            {
                name: "MONTO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: {render: v => `MONTO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },
            {
                name: "PROCESO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `SEMESTER: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            return value ? value : "No def."
                        }
                    },
                }
            },

            {
                name: "ESTADO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {render: v => `ESTADO: ${v}`},
                    customBodyRender: (value, tableMeta, updateValue) => {
                        let rowIndex = tableMeta.rowIndex;

                        if (value === undefined) {
                            return "No def.";
                        } else {

                            // return value ? value : "No def."
                            if (this.state.edit) {
                                return (
                                    <select id="estate"
                                            style={{
                                                width: "100%",
                                                border: "none",
                                                borderBottom: "1px solid #ced4da",
                                                fontSize: "15px"
                                            }}
                                            value={value}
                                            onChange={this.changeState.bind(this, rowIndex)}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Pagado">Pagado</option>
                                    </select>
                                )
                            } else {
                                return value ? value : "No def."
                            }

                        }
                    },
                }
            },
            // {
            //     name: "ACCIONES",
            //     options: {
            //         filter: false,
            //         sort: true,
            //         download: false,
            //         // display: "excluded",
            //         setCellHeaderProps: () => ({align: 'left'}),
            //         setCellProps: () => ({align: 'left'}),
            //
            //         customBodyRender: (value, tableMeta, updateValue) => {
            //
            //             if (value === undefined) {
            //                 return "No def.";
            //             } else {
            //
            //                 return value ?
            //                     <>
            //                         <OverlayTrigger
            //                             overlay={<Tooltip>EDITAR</Tooltip>}>
            //                             <Edit style={{color: "#1d86e0"}}/>
            //
            //                         </OverlayTrigger>
            //                         <OverlayTrigger
            //                             overlay={<Tooltip>INHABILITAR</Tooltip>}>
            //                             <Delete style={{color: "#ff5252"}}/>
            //                         </OverlayTrigger>
            //                     </>
            //                     : "No def."
            //             }
            //
            //
            //         },
            //
            //
            //     }
            // }

        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {

                    return (
                        data.push([
                            index + 1,
                            r.concept,
                            r.payment_date,
                            r.amount,
                            r.process,
                            r.type,

                        ])
                    )
                }
            );
        }

        return (

            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={"CONCEPTOS PAGADOS S/." + total + "| PENDIENTES S/." + pendient}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>


        );
    }
}

export default DataTable;