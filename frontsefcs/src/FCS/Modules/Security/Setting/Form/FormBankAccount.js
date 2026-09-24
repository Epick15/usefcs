import React from 'react';
import {Button, Col, Form, Modal,  Row} from 'react-bootstrap';
import app from "../../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';
import Swal from "sweetalert2";


moment.locale('es');


class FormBankAccount extends React.Component {
    state = {
        action: "add",
        titleFormModalBankAccount: "REGISTRAR CUENTA BANCARIA",
        numberAccount: "",
        cci: "",
        bank: "",
        retriveBankAccount: this.props.retriveBankAccount,
        formModalBankAccount: this.props.formModalBankAccount,
        deleteBankAccount: this.props.deleteBankAccount,
        banks: [],
    };

    componentDidMount() {
        this.listBank();
        if (this.state.retriveBankAccount !== "") {
            this.retriveForm(this.state.retriveBankAccount);
        }

    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.retriveBankAccount !== this.props.retriveBankAccount) {
            this.retriveForm(this.props.retriveBankAccount);
        }
        if (prevProps.deleteBankAccount !== this.props.deleteBankAccount) {
            this.props.deleteBankAccount !== "" && this.deleteBankAccount(this.props.deleteBankAccount);
        }
        if (prevProps.formModalBankAccount !== this.props.formModalBankAccount) {
            this.setState({formModalBankAccount: this.props.formModalBankAccount});
        }


    }

    listBank() {
        const url = app.general + '/' + app.bank;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({banks: res.data})
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };


    async createBankAccount() {
        this.setState({loader: true});
        const {numberAccount, cci, bank} = this.state;


        if (numberAccount !== '' && cci !== '' && bank !== '') {
            const url = app.general + '/' + app.bankAccount;
            let data = new FormData();
            data.set('bank', bank);
            data.set('number_account', numberAccount);
            data.set('cci', cci);


            try {
                const res = await axios.post(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }


    };


    async updateBankAccount() {

        this.setState({loader: true});
        const {numberAccount, cci, bank, bankAccountID} = this.state;

        if (numberAccount !== '' && cci !== '' && bank !== '' && bankAccountID !== '') {

            const url = app.general + '/' + app.bankAccount + '/' + this.state.bankAccountID;
            let data = new FormData();
            data.set('bank', bank);
            data.set('number_account', numberAccount);
            data.set('cci', cci);


            try {
                const res = await axios.patch(url, data, app.headers);
                this.props.callData();
                this.closeForm();
                this.setState({loader: false});
                PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});


            } catch (err) {
                this.setState({loader: false});
                PNotify.error({title: "Oh no!", text: err.response, delay: 2000});

            }

        } else {
            this.setState({loader: false});
            PNotify.notice({title: "Advertencia!", text: "Complete los campos obligatorios", delay: 2000});
        }

    };


    async destroyBankAccount(id) {
        try {
            const url = app.general + '/' + app.bankAccount + '/' + id;
            const res = await axios.delete(url, app.headers);
            PNotify.success({title: "Finalizado", text: res.data.message, delay: 2000});
            this.setState({loader: false});
            this.props.callData();
            return true;

        } catch (err) {
            PNotify.error({title: "Oh no!", text: err.response, delay: 2000});
            this.setState({loader: false});
            return false;
        }
    };

    handleChange = field => event => {
        switch (field) {


            case 'bank':
                this.setState({bank: event.target.value});
                break;
            case 'numberAccount':
                this.setState({numberAccount: event.target.value});
                break;
            case 'cci':
                this.setState({cci: event.target.value});
                break;

            default:
                break;
        }
    };


    retriveForm = (r) => {


        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "update",
            titleFormModalBankAccount: "ACTUALIZAR CUENTA BANCARIA",
            bankAccountID: r.id,
            bank: r.id_bank,
            numberAccount: r.number_account,
            cci: r.cci,

        })


    };
    closeForm = () => {

        this.props.closeFormModalBankAccount();
        this.setState({
            // organicUnit: r.id_organic_unit,
            action: "add",
            titleFormModalBankAccount: "REGISTRAR CUENTA BANCARIA",
            bankAccountID: "",
            bank: "",
            numberAccount: "",
            cci: "",

        })


    };
    deleteBankAccount = async (id) => {
        console.log(id)
        Swal.fire({
            title: 'Estás seguro?',
            text: "Este paso es irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
        }).then((result) => {
            if (result.value) {
                this.destroyBankAccount(id);
            } else {
                this.closeForm();
            }
        })
    };

    render() {
        const { loader, action} = this.state;
        const {bank, numberAccount, cci, banks} = this.state;

        return (
            <>

                <Modal show={this.state.formModalBankAccount}>
                    <Modal.Header className='bg-primary'>
                        <Modal.Title as="h5" style={{color: '#ffffff'}}>{this.state.titleFormModalBankAccount}</Modal.Title>
                        <div className="d-inline-block pull-right">
                            <span type="button" onClick={this.closeForm}> <i className="feather icon-x"
                                                                             style={{fontSize: "20px", color: 'white'}}></i> </span>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Banco</Form.Label>
                                    <Form.Control as="select"
                                                  value={bank}
                                                  onChange={this.handleChange('bank')}>
                                        >
                                        <option defaultValue={true} hidden>Por favor seleccione una
                                            opcción</option>
                                        {
                                            banks.length > 0 ?
                                                banks.map((bank, index) => {
                                                    // if (bank.state) {
                                                    return (
                                                        <option value={bank.id} key={index}>
                                                            {bank.denomination}
                                                        </option>
                                                    )
                                                    // }
                                                }) :
                                                <option defaultValue={true}>Error al cargar los
                                                    Datos</option>
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">Numero de cuenta</Form.Label>
                                    <Form.Control
                                        type="number"

                                        value={numberAccount}
                                        name={"numberAccount"}
                                        onKeyPress={this.handleKeyPress}
                                        onChange={this.handleChange('numberAccount')}
                                        placeholder="Descripción"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={12} xs={12} sm={12} md={12} lg={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">CCI</Form.Label>
                                    <Form.Control
                                        type="number"

                                        value={cci}
                                        name={"cci"}
                                        onChange={this.handleChange('cci')}
                                        placeholder="CCI"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {action === 'add' ?
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.createBankAccount()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar</Button> :
                            <Button
                                className="pull-right"
                                disabled={loader}
                                variant="primary"

                                onClick={() => this.updateBankAccount()}>
                                {loader && <span className="spinner-border spinner-border-sm mr-1" role="status"/>}
                                Guardar Cambios</Button>
                        }
                    </Modal.Body>

                </Modal>


            </>
        );
    }
}

export default FormBankAccount;
