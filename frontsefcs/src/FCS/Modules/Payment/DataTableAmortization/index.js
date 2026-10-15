import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import component from "../../../Component";
import Refresh from "@material-ui/icons/Refresh";
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
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.records !== this.props.records) {
            this.setState({ records: this.props.records, paidOut: [] });
        }
        if (prevProps.totalBalance !== this.props.totalBalance) {
            this.setState({ totalBalance: this.props.totalBalance });
        }
    }

    async updateStatePayment() {
        let paidOutTemp = this.state.paidOut;
        paidOutTemp = paidOutTemp.filter((item) => item);
        if (paidOutTemp.length > 0) {
            const url = app.accounting + "/" + app.payment + "/state";
            let data = new FormData();
            data.set("concepts", JSON.stringify(paidOutTemp));
            try {
                const res = await axios.patch(url, data, app.headers);
                this.toggleAction();
                PNotify.success({
                    title: "Finalizado",
                    text:
                        res.data && res.data.message
                            ? res.data.message
                            : res.data || "Estados actualizados correctamente",
                    delay: 2000,
                });
            } catch (err) {
                // this.setState({loaderRegistration: false});
                PNotify.error({
                    title: "Oh no!",
                    text: err.response,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderRegistration: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });
    changeState = (i, e) => {
        let concepts = [...this.state.records];
        let paidOutTemp = [...this.state.paidOut];
        const nextState = e.target.value;
        const previousState = concepts[i].type;
        const amount = parseFloat(concepts[i].amount) || 0;
        const currentBalance = parseFloat(this.state.totalBalance) || 0;
        const previousConsumesBalance = previousState === "Pagado";
        if (previousState === nextState) {
            return;
        }

        //actuaizamos los id ya registrados
        for (let k = 0; k < concepts.length; k++) {
            if (concepts[k].type === "Pagado") {
                paidOutTemp[k] = {
                    id: concepts[k].id,
                    type: "Pagado",
                    denomination: concepts[k].denomination,
                };
            }
        }

        //buscarmo si existe el id en nuestro array temporal

        if (nextState === "Pagado") {
            if (previousConsumesBalance || amount <= currentBalance) {
                paidOutTemp[i] = {
                    id: concepts[i].id,
                    type: "Pagado",
                    denomination: concepts[i].denomination,
                };
                concepts[i] = { ...concepts[i], type: nextState };
                if (!previousConsumesBalance) {
                    this.props.reduceTotalMovement("add", amount);
                }
                this.setState({ paidOut: paidOutTemp });
            } else {
                PNotify.notice({
                    title: "No cuenta con saldo disponible!",
                    text: "Los comprobantes deben ser aceptados",
                    delay: 2000,
                });
            }
        }
        if (nextState === "Pendiente") {
            paidOutTemp[i] = {
                id: concepts[i].id,
                type: "Pendiente",
                denomination: concepts[i].denomination,
            };
            concepts[i] = { ...concepts[i], type: nextState };
            if (previousConsumesBalance) {
                this.props.reduceTotalMovement("delete", amount);
            }
            this.setState({ paidOut: paidOutTemp });
        }
        // MPT
        if (nextState === "Anulado") {
            paidOutTemp[i] = {
                id: concepts[i].id,
                type: "Anulado",
                denomination: concepts[i].denomination,
            };
            concepts[i] = { ...concepts[i], type: nextState };
            if (previousConsumesBalance) {
                this.props.reduceTotalMovement("delete", amount);
            }
            this.setState({ paidOut: paidOutTemp });
        }
        if (nextState === "Exonerado") {
            paidOutTemp[i] = {
                id: concepts[i].id,
                type: "Exonerado",
                denomination: concepts[i].denomination,
            };
            concepts[i] = { ...concepts[i], type: nextState };
            if (previousConsumesBalance) {
                this.props.reduceTotalMovement("delete", amount);
            }
            this.setState({ paidOut: paidOutTemp });
        }
        if (nextState === "Regularizado") {
            paidOutTemp[i] = {
                id: concepts[i].id,
                type: "Regularizado",
                denomination: concepts[i].denomination,
            };
            concepts[i] = { ...concepts[i], type: nextState };
            if (previousConsumesBalance) {
                this.props.reduceTotalMovement("delete", amount);
            }
            this.setState({ paidOut: paidOutTemp });
        }
        // MPT END
        this.setState({ records: concepts });
    };
    toggleAction = () => {
        this.setState({ edit: !this.state.edit });
    };

    getStateStyle = (state) => {
        const styles = {
            Pagado: {
                color: "#1e7e34",
                background: "#dff3e5",
                border: "#9bd6aa",
            },
            Pendiente: {
                color: "#856404",
                background: "#fff3cd",
                border: "#ffe08a",
            },
            Anulado: {
                color: "#842029",
                background: "#f8d7da",
                border: "#f1aeb5",
            },
            Exonerado: {
                color: "#055160",
                background: "#cff4fc",
                border: "#9eeaf9",
            },
            Regularizado: {
                color: "#41464b",
                background: "#e2e3e5",
                border: "#c4c8cb",
            },
        };

        return (
            styles[state] || {
                color: "#41464b",
                background: "#e9ecef",
                border: "#ced4da",
            }
        );
    };

    renderStateBadge = (state) => {
        const style = this.getStateStyle(state);

        return (
            <span
                style={{
                    display: "inline-block",
                    minWidth: "86px",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    border: "1px solid " + style.border,
                    color: style.color,
                    background: style.background,
                    fontWeight: 600,
                    fontSize: "12px",
                    textAlign: "center",
                }}
            >
                {state || "No definido"}
            </span>
        );
    };

    renderSummaryBadge = (label, amount, style) => (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "14px",
                border: "1px solid " + style.border,
                color: style.color,
                background: style.background,
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1,
            }}
        >
            <span>{label}</span>
            <strong>S/. {amount}</strong>
        </span>
    );

    render() {
        const { records } = this.state;
        let paidTotal = 0;
        let pendingTotal = 0;
        let exemptedTotal = 0;
        records.map((r) => {
            if (r.type === "Pagado" || r.type === "Regularizado") {
                paidTotal = parseFloat(r.amount) + paidTotal;
            } else if (r.type === "Exonerado") {
                exemptedTotal = parseFloat(r.amount) + exemptedTotal;
            } else if (r.type === "Pendiente" || r.type === "Registrado") {
                pendingTotal = parseFloat(r.amount) + pendingTotal;
            }
        });

        const options = {
            filter: true,
            searchOpen: false,
            rowsPerPage: 100,
            responsive: "simple",
            searchPlaceholder: "Buscar",
            search: true,
            download: false,
            print: false,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger overlay={<Tooltip>Recargar</Tooltip>}>
                            <button
                                onClick={() => this.props.callConceptStudent()}
                                type="button"
                                className="btn-icon btn btn-light"
                            >
                                <Refresh />
                            </button>
                        </OverlayTrigger>
                        {this.state.edit ? (
                            <OverlayTrigger
                                overlay={<Tooltip>Guardar</Tooltip>}
                            >
                                <button
                                    onClick={() => this.updateStatePayment()}
                                    type="button"
                                    className="btn-icon btn btn-primary"
                                >
                                    <i className="feather icon-save"></i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            <OverlayTrigger overlay={<Tooltip>Editar</Tooltip>}>
                                <button
                                    onClick={() => this.toggleAction()}
                                    type="button"
                                    className="btn-icon btn btn-primary"
                                >
                                    <i className="feather icon-edit-2"></i>
                                </button>
                            </OverlayTrigger>
                        )}
                    </>
                );
            },
        };

        const columns = [
            {
                name: "#",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                name: "CONCEPTO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `CONCEPTO: ${v}`,
                    },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "F.LIMITE PAGO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `F.LIMITE PAGO: ${v}`,
                    },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "MONTO",
                options: {
                    filter: false,
                    sort: true,
                    customFilterListOptions: { render: (v) => `MONTO: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
            {
                name: "PROCESO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: {
                        render: (v) => `SEMESTER: ${v}`,
                    },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },

            {
                name: "ESTADO",
                options: {
                    filter: true,
                    sort: true,
                    customFilterListOptions: { render: (v) => `ESTADO: ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        let rowIndex = tableMeta.rowIndex;

                        if (value === undefined) {
                            return "No def.";
                        } else {
                            // return value ? value : "No def."
                            if (this.state.edit) {
                                const stateStyle = this.getStateStyle(value);
                                return (
                                    <select
                                        id="estate"
                                        style={{
                                            width: "100%",
                                            minWidth: "120px",
                                            border:
                                                "1px solid " +
                                                stateStyle.border,
                                            borderRadius: "6px",
                                            color: stateStyle.color,
                                            background:
                                                stateStyle.background,
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            padding: "5px 8px",
                                            outline: "none",
                                        }}
                                        value={value}
                                        onChange={this.changeState.bind(
                                            this,
                                            rowIndex
                                        )}
                                    >
                                        <option value="Pendiente">
                                            Pendiente
                                        </option>
                                        <option value="Pagado">Pagado</option>
                                        <option value="Regularizado">
                                            Regularizado
                                        </option>
                                        <option value="Anulado">Anulado</option>
                                        <option value="Exonerado">Exonerado</option>
                                    </select>
                                );
                            } else {
                                return this.renderStateBadge(value);
                            }
                        }
                    },
                },
            },
        ];
        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                return data.push([
                    index + 1,
                    r.concept,
                    r.payment_date,
                    r.amount,
                    r.process,
                    r.type,
                ]);
            });
        }

        return (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                    title={
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: "8px",
                                padding: "2px 0",
                            }}
                        >
                            {this.renderSummaryBadge(
                                "Pagados",
                                paidTotal,
                                this.getStateStyle("Pagado")
                            )}
                            {this.renderSummaryBadge(
                                "Exonerados",
                                exemptedTotal,
                                this.getStateStyle("Exonerado")
                            )}
                            {this.renderSummaryBadge(
                                "Pendientes reales",
                                pendingTotal,
                                this.getStateStyle("Pendiente")
                            )}
                        </div>
                    }
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        );
    }
}

export default DataTable;
