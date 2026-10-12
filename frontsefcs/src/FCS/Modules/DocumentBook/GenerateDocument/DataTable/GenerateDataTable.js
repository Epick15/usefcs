import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
    Button,
    Col,
    Form,
    InputGroup,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import component from "../../../../Component";
import PNotify from "pnotify/dist/es/PNotify";
import $ from "jquery";
import app from "../../../../Constants";
import Close from "@material-ui/icons/Close";
import axios from "axios";
import GetApp from "@material-ui/icons/GetApp";
import Backup from "@material-ui/icons/Backup";
import CloudDone from "@material-ui/icons/CloudDone";
import Edit from "@material-ui/icons/Edit";
import Refresh from "@material-ui/icons/Refresh";
import moment from "moment";
import Attachment from "@material-ui/icons/Attachment";
import generator from "voucher-code-generator";
// MPT

import StudyCertificate from "../../../../Component/DocumentFormats/StudyCertificate";

class Index extends Component {
    state = {
        modal: false,
        modalDocument: false,
        modalAcademicRecordEmission: false,
        loaderDocumentBook: false,
        process: "",
        correlative: "",
        calendarMask: "",
        observation: "",
        processs: [],
        records: [],

        fileName: "",
        action: "add",
        studentID: "",
        file: "",
        stateUpload: false,
        paymentID: "",
        recordPaymentID: "",
        academicRecordEmissionDate: "",
        academicRecordEmissionReason: "",
    };

    componentDidMount() {
        this.listAcademicCalendar();
    }

    async reportCertyStudy(id_student, id_document_book) {
        // this.setState({registrationDataLoader: true});
        const url =
            app.general +
            "/report-cert-study/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableCertStudy2(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportCertyStudySeunsm(id_student, id_document_book) {
      // this.setState({registrationDataLoader: true});
      const url =
        app.general + "/report-cert-study/" + id_student + "/" + id_document_book;
      try {
        const res = await axios.get(url, app.headers);
        if (res.data) console.log(res.data);
        component.pdfReportAutoTableCertStudySeunsm(res.data);
        // this.setState({registrationDataLoader: false});
      } catch (err) {
        // this.setState({registrationDataLoader: false});
        PNotify.error({
          title: "Oh no!",
          text: "Algo salio mal al cargar los datos",
          delay: 2000,
        });
        console.log(err);
      }
    }

    // async reportCertyStudySeunsm(id_student, id_document_book) {
    //     const url =
    //         app.general +
    //         "/report-cert-study/" +
    //         id_student +
    //         "/" +
    //         id_document_book;
    //     try {
    //         const res = await axios.get(url, app.headers);
    //         console.log(res.data);
    //         this.setState({ dataCert: res.data });
    //     } catch (err) {
    //         PNotify.error({
    //             title: "Oh no!",
    //             text: "Algo salio mal al cargar los datos",
    //             delay: 2000,
    //         });
    //         console.log(err);
    //     }
    // }

    async reportConstancyStudy(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-study/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyStudy(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyStudySeunsm(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-study/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyStudySeunsm(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyEntry(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-entry/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyEntry(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyExpedito(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-expedito/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyExpedito(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyEntrySeunsm(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-entry/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyEntrySeunsm(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyEgress(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-egress/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);

            component.pdfReportAutoTableConstancyEgress(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyEgressSeunsm(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-egress/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);

            component.pdfReportAutoTableConstancyEgressSeunsm(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyAdeudar(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-egress/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyAdeudar(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyAdeudarSeunsm(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-egress/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyAdeudarSeunsm(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyDisciplinarySeunsm(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-disciplinary/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyDisciplinarySeunsm(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyRegistration(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-registration/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyRegistration(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async reportConstancyOrdenMerito(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-order-merito/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);
            component.pdfReportAutoTableConstancyOrdenMerito(res.data);
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    // MPT
    async reportConstancyExpeditoSustentationSeunsm(
        id_student,
        id_document_book
    ) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-constancy-expedito-sustentation/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) console.log(res.data);

            component.pdfReportAutoTableConstancyExpeditoSustentationSeunsm(
                res.data
            );
            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listAcademicCalendar() {
        this.setState({ calendarLoader: true });
        const url = app.general + "/" + app.academicCalendar;

        try {
            const res = await axios.get(url, app.headers);
            if (res.data)
                this.setState({
                    processs: res.data,
                    process: res.data[0].id,
                });
            this.listDocumentBook(res.data[0].id);

            this.setState({ calendarLoader: false });
        } catch (err) {
            this.setState({ calendarLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes de estudio",
                delay: 2000,
            });
            console.log(err);
        }
    }

    async listDocumentBook(id) {
        this.setState({ documentBookLoader: true });
        const url = app.programs + "/" + app.documentBook + "/" + id;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) {
                this.setState({ records: res.data });
            }

            this.setState({ documentBookLoader: false });
        } catch (err) {
            this.setState({ documentBookLoader: false });
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los planes",
                delay: 2000,
            });
            console.log(err);
        }
    }

    getMuiTheme = () =>
        createTheme({ overrides: component.MuiOption.overrides });

    async updateDocumentBook() {
        this.setState({ loaderDocumentBook: true });

        const { correlative, observation, documentBookID } = this.state;

        if (correlative !== "") {
            const url =
                app.programs + "/" + app.documentBook + "/" + documentBookID;
            let data = new FormData();
            data.set("correlative", correlative);
            data.set("observation", observation);
            try {
                const res = await axios.patch(url, data, app.headers);
                if (res) {
                    this.setState({ loaderDocumentBook: false });
                    this.listDocumentBook(this.state.process);
                    this.closeData();
                    PNotify.success({
                        title: "Finalizado",
                        text: res.data.message,
                        delay: 2000,
                    });
                }
            } catch (err) {
                this.setState({ loaderDocumentBook: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data.message,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderDocumentBook: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000,
            });
        }
    }

    async reportAcademicRecord(id_student, id_document_book) {
        this.setState({ registrationDataLoader: true });
        const url =
            app.general +
            "/report-academic-record/" +
            id_student +
            "/" +
            id_document_book;
        try {
            const res = await axios.get(url, app.headers);
            if (res.data) component.pdfReportAutoTableRercordAcademic(res.data);

            // this.setState({registrationDataLoader: false});
        } catch (err) {
            // this.setState({registrationDataLoader: false});
            PNotify.error({
                title: "Oh no!",
                text: "Algo salio mal al cargar los datos",
                delay: 2000,
            });
            console.log(err);
        }
    }

    retriveData = (data) => {
        this.setState({
            modal: true,
            documentBookID: data.id,
            correlative: data.correlative.replace(/^(0+)/g, ""),
            observation: data.observation || "",
        });
    };
    closeData = () => {
        this.setState({
            modal: false,
            documentBookID: "",
            correlative: "",
            observation: "",
        });
    };
    openAcademicRecordEmission = async (data) => {
        this.setState({
            modalAcademicRecordEmission: true,
            documentBookID: data.id,
            paymentID: data.id_payment,
            loaderDocumentBook: true,
        });
        try {
            const url =
                app.accounting +
                "/" +
                app.payment +
                "/student/" +
                data.id_student +
                "/academic-record-emission";
            const res = await axios.get(url, app.headers);
            this.setState({
                loaderDocumentBook: false,
                recordPaymentID: res.data.id_payment,
                academicRecordEmissionDate: res.data.academic_record_emission_date
                    ? moment(res.data.academic_record_emission_date).format("YYYY-MM-DD")
                    : "",
                academicRecordEmissionReason:
                    res.data.academic_record_emission_reason || "",
            });
        } catch (err) {
            this.setState({loaderDocumentBook: false});
            PNotify.error({
                title: "Oh no!",
                text: err.response && err.response.data.message,
                delay: 2000,
            });
        }
    };
    closeAcademicRecordEmission = () => {
        this.setState({
            modalAcademicRecordEmission: false,
            documentBookID: "",
            paymentID: "",
            recordPaymentID: "",
            academicRecordEmissionDate: "",
            academicRecordEmissionReason: "",
        });
    };
    async updateAcademicRecordEmission() {
        const {
            recordPaymentID,
            academicRecordEmissionDate,
            academicRecordEmissionReason,
        } = this.state;

        if (!academicRecordEmissionDate || !academicRecordEmissionReason.trim()) {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete la fecha de emisión y el motivo",
                delay: 2000,
            });
            return;
        }

        this.setState({loaderDocumentBook: true});
        const url =
            app.accounting +
            "/" +
            app.payment +
            "/" +
            recordPaymentID +
            "/academic-record-emission";
        const data = new FormData();
        data.set("academic_record_emission_date", academicRecordEmissionDate);
        data.set("academic_record_emission_reason", academicRecordEmissionReason.trim());

        try {
            const res = await axios.patch(url, data, app.headers);
            this.setState({loaderDocumentBook: false});
            this.listDocumentBook(this.state.process);
            this.closeAcademicRecordEmission();
            PNotify.success({
                title: "Finalizado",
                text: res.data.message,
                delay: 2000,
            });
        } catch (err) {
            this.setState({loaderDocumentBook: false});
            PNotify.error({
                title: "Oh no!",
                text: err.response && err.response.data.message,
                delay: 2000,
            });
        }
    }
    downloadPdf = (field, id_student, id_document_book) => {
        switch (field) {
            case "record":
                this.reportAcademicRecord(id_student, id_document_book);
                break;
            case "certificado":
                this.reportCertyStudy(id_student, id_document_book);
                break;
            case "certificado_seunsm":
                this.reportCertyStudySeunsm(id_student, id_document_book);
                break;
            case "c_estudio":
                this.reportConstancyStudy(id_student, id_document_book);
                break;
            case "c_estudio_se":
                this.reportConstancyStudySeunsm(id_student, id_document_book);
                break;
            case "c_entry":
                this.reportConstancyEntry(id_student, id_document_book);
                break;
            case "c_expedito_seunsm":
                this.reportConstancyExpedito(id_student, id_document_book);
                break;
            case "c_entry_se":
                this.reportConstancyEntrySeunsm(id_student, id_document_book);
                break;
            case "c_egress":
                this.reportConstancyEgress(id_student, id_document_book);
                break;
            case "c_egress_seunsm":
                this.reportConstancyEgressSeunsm(id_student, id_document_book);
                break;
            case "c_adeudar":
                this.reportConstancyAdeudar(id_student, id_document_book);
                break;
            case "c_adeudar_seunsm":
                this.reportConstancyAdeudarSeunsm(id_student, id_document_book);
                break;
            case "c_disciplinary_seunsm":
                this.reportConstancyDisciplinarySeunsm(
                    id_student,
                    id_document_book
                );
                break;
            case "c_registration":
                this.reportConstancyRegistration(id_student, id_document_book);
                break;
            case "c_orden_merito":
                this.reportConstancyOrdenMerito(id_student, id_document_book);
                break;
            case "c_expedito_sustentation_seunsm":
                this.reportConstancyExpeditoSustentationSeunsm(
                    id_student,
                    id_document_book
                );
                break;
            default:
                break;
        }
    };
    handleChange = (field) => (event) => {
        switch (field) {
            case "correlative":
                this.setState({ correlative: event.target.value });
                break;
            case "observation":
                this.setState({ observation: event.target.value });
                break;
            case "process":
                this.listDocumentBook(event.target.value);
                this.setState({ process: event.target.value });

                break;
            case "academicRecordEmissionDate":
                this.setState({academicRecordEmissionDate: event.target.value});
                break;
            case "academicRecordEmissionReason":
                this.setState({academicRecordEmissionReason: event.target.value});
                break;

            default:
                break;
        }
    };

    retriveUploadDocument = (data) => {
        this.setState({
            modalDocument: true,
            documentBookID: data.id,
            studentID: data.id_student,
            fileName: data.file,
            stateUpload: data.state_upload,
        });
    };
    closeUploadDocument = (data) => {
        this.setState({
            modalDocument: false,
            documentBookID: "",
            studentID: "",
            file: "",
            fileName: "",
            stateUpload: "",
        });
    };
    showFileManager = () => {
        const input = "#file";
        $(input).click();
    };
    handleChangeFileInput = (event) => {
        const fileExtension = ["pdf"];
        const input = "#file";
        let value = $(input).val().split(".").pop().toLowerCase();
        if ($.inArray(value, fileExtension) === -1) {
            let message =
                "Por favor use estos formatos: " + fileExtension.join(", ");
            PNotify.error({ title: "Oh no!", text: message, delay: 2000 });
            $(input).click();
        } else {
            let reader = new FileReader();
            let file = event.target.files[0];
            let code = generator.generate({
                length: 3,
                prefix:
                    this.state.studentID + "s" + moment().format("YYYYMhmss"),
                count: 1,
                charset: generator.charset("numbers"),
            });
            reader.onload = () => {
                this.setState({ file: file, fileName: code });
            };
            reader.readAsDataURL(file);
        }
    };
    clearFiles = () => {
        this.setState({
            file: "",
            fileName: "",
        });
        if (this.state.action === "update") {
            this.setState({
                changed: "si",
            });
        }
    };

    async uploadDocumentBook() {
        this.setState({ loaderDocumentBook: true });
        const { documentBookID, fileName, file } = this.state;

        const url =
            app.programs + "/" + app.documentBook + "/upload/" + documentBookID;

        if (fileName !== "" && file !== "") {
            let data = new FormData();
            data.set("file", file);
            data.set("file_name", fileName);

            try {
                const res = await axios.patch(url, data, app.headers);
                this.setState({ loaderDocumentBook: false });
                this.listDocumentBook(this.state.process);
                this.closeUploadDocument();
                PNotify.success({
                    title: "Finalizado",
                    text: res.data.message,
                    delay: 2000,
                });
            } catch (err) {
                this.setState({ loaderDocumentBook: false });
                PNotify.error({
                    title: "Oh no!",
                    text: err.response.data,
                    delay: 2000,
                });
            }
        } else {
            this.setState({ loaderVoucher: false });
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios,Correctamente",
                delay: 2000,
            });
        }
    }

    render() {
        const { records } = this.state;

        const options = {
            filter: true,
            searchOpen: false,
            print: false,
            responsive: "simple",
            searchPlaceholder: "Buscar",
            search: true,
            rowsPerPage: 100,
            selectableRows: false,
            textLabels: component.MuiOption.textLabels,
            rowsPerPageOptions: [10, 30, 50, 500],
            draggableColumns: {
                enabled: true,
            },
            downloadOptions: {
                filename: "excel-format.csv",
                separator: ";",
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                },
            },
            onDownload: (buildHead, buildBody, columns, data) => {
                component.pdfReportAutoTablePaymentPendient(
                    "REPORTE DE DOCUMENTOS GENERADOS",

                    columns,
                    data
                );
                return false;
            },
            customToolbar: () => {
                return (
                    <>
                        <OverlayTrigger overlay={<Tooltip>Recargar</Tooltip>}>
                            <button
                                onClick={() =>
                                    this.listDocumentBook(this.state.process)
                                }
                                type="button"
                                className="btn-icon btn btn-light"
                            >
                                <Refresh />
                            </button>
                        </OverlayTrigger>
                    </>
                );
            },
        };

        const columns = [
            {
                name: "ACCIONES ",
                options: {
                    filter: false,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: {
                        render: (v) => `ACCIONES  : ${v}`,
                    },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return (
                                <>
                                    <OverlayTrigger
                                        overlay={<Tooltip>EDITAR</Tooltip>}
                                    >
                                        <Edit
                                            style={{ color: "#1d86e0" }}
                                            onClick={() =>
                                                this.retriveData(value)
                                            }
                                        />
                                    </OverlayTrigger>
                                    {
                                        //CERTIFICADOS
                                        (value.Concept.id === 59 ||
                                            value.Concept.id === 120) && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#101b33" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "certificado",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CERTIFICADOS SE
                                        value.Concept.id === 102 && (
                                            // <OverlayTrigger
                                            //     overlay={
                                            //         <Tooltip></Tooltip>
                                            //     }
                                            // >
                                            <GetApp
                                                style={{ color: "#101b33" }}
                                                onClick={() =>
                                                    this.downloadPdf(
                                                        "certificado_seunsm",
                                                        value.id_student,
                                                        value.id
                                                    )
                                                }
                                            />
                                            // </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE INGRESO
                                        (value.Concept.id === 1 ||
                                            value.Concept.id === 2) && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#ed5b4f" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_entry",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE INGRESO SE
                                        value.Concept.id === 113 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#ed5b4f" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_entry_se",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE ESTUDIO
                                        (value.Concept.id === 36 ||
                                            value.Concept.id === 117 ||
                                            value.Concept.id === 118) && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#4367ec" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_estudio",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE ESTUDIO SEUNSM
                                        value.Concept.id === 98 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#4367ec" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_estudio_se",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE EGRESO
                                        (value.Concept.id === 111 ||
                                            value.Concept.id === 119) && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_egress",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE EGRESO SEGUNDA ESPECIALIDAD
                                        value.Concept.id === 115 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_egress_seunsm",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE NO ADEUDAR BIENES
                                        value.Concept.id === 18 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_adeudar",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE NO ADEUDAR BIENES SEUNSM
                                        value.Concept.id === 103 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_adeudar_seunsm",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE NO DISCIPLINARIO BIENES SEUNS
                                        value.Concept.id === 124 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_disciplinary_seunsm",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE MATRÍCULA
                                        (value.Concept.id === 121 ||
                                            value.Concept.id === 122 ||
                                            value.Concept.id === 125) && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_registration",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                    {
                                        //CONSTANCIA DE ORDEN DE MERITO
                                        value.Concept.id === 17 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_orden_merito",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }

                                    {
                                        //CONSTANCIA DE EXPEDITO SEUNSM
                                        value.Concept.id === 104 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#20d1d1" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_expedito_seunsm",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }

                                    {
                                        //CONSTANCIA DE EXPEDITO SUSTENTACIÓN SEGUNDA ESPECIALIDAD
                                        value.Concept.id === 130 && (
                                            <OverlayTrigger
                                                overlay={
                                                    <Tooltip>DESCARGAR</Tooltip>
                                                }
                                            >
                                                <GetApp
                                                    style={{ color: "#C133FF" }}
                                                    onClick={() =>
                                                        this.downloadPdf(
                                                            "c_expedito_sustentation_seunsm",
                                                            value.id_student,
                                                            value.id
                                                        )
                                                    }
                                                />
                                            </OverlayTrigger>
                                        )
                                    }
                                </>
                            );
                        }
                    },
                },
            },
            {
                name: "D ",
                options: {
                    filter: false,
                    sort: true,
                    colSpan: 12,
                    customFilterListOptions: { render: (v) => `D  : ${v}` },
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return (
                                <>
                                    {value.state_upload ? (
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip>
                                                    VER DOCUMENTO{" "}
                                                </Tooltip>
                                            }
                                        >
                                            <Backup
                                                style={{ color: "#45d098" }}
                                                onClick={() =>
                                                    this.retriveUploadDocument(
                                                        value
                                                    )
                                                }
                                            />
                                        </OverlayTrigger>
                                    ) : (
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip>
                                                    ADJUNTAR DOCUMENTO{" "}
                                                </Tooltip>
                                            }
                                        >
                                            <Backup
                                                style={{ color: "#a3b4c8" }}
                                                onClick={() =>
                                                    this.retriveUploadDocument(
                                                        value
                                                    )
                                                }
                                            />
                                        </OverlayTrigger>
                                    )}
                                </>
                            );
                        }
                    },
                },
            },
            {
                name: "NÚMERO",
                options: {
                    filter: false,
                    sort: true,
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
                name: "DOCUMENTO",
                options: {
                    filter: true,
                    sort: true,
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
                name: "ESTUDIANTE",
                options: {
                    filter: false,
                    sort: true,
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
                name: "U.ORGANICA",
                options: {
                    filter: true,
                    sort: true,
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
                name: "FECHA",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value === undefined) {
                            return "No def.";
                        } else {
                            return value ? value : "No def.";
                        }
                    },
                },
            },
        ];

        let data = [];

        if (records.length > 0) {
            records.map((r, index) => {
                return data.push([
                    r,
                    r,
                    r.document_code || r.correlative,
                    r.Concept.denomination,
                    r.Student.Person.name ||
                        "CORREGIR / " + r.Student.Person.document_number ||
                        "CORREGIR",
                    r.Program.description,
                    moment(r.created_at).format("YYYY-MM-DD h:mm:ss"),
                ]);
            });
        }
        const {
            correlative,
            observation,
            processs,
            process,
            loaderDocumentBook,
            fileName,
        } = this.state;
        return (
            <>
                {this.state.documentBookLoader && component.spiner}
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={
                            <Form.Group className="form-group fill">
                                <Form.Control
                                    as="select"
                                    value={process}
                                    onChange={this.handleChange("process")}
                                >
                                    <option defaultValue={true} hidden>
                                        Proceso
                                    </option>
                                    {processs.length > 0 ? (
                                        processs.map((r, index) => {
                                            return (
                                                <option
                                                    value={r.id}
                                                    key={index}
                                                    id={"process-" + r.id}
                                                    mask-calendar={r.denomination.substr(
                                                        -4
                                                    )}
                                                >
                                                    {r.denomination.substr(-4)}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <option defaultValue={true}>
                                            Error al cargar los Datos
                                        </option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        }
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
                <Modal show={this.state.modal} backdrop="static">
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                            ACTUALIZAR DATOS
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{ zIndex: 100000000 }}>
                                        Cerrar
                                    </Tooltip>
                                }
                            >
                                <Close
                                    style={{ color: "white" }}
                                    onClick={() => this.closeData()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        // style={ambient === "" ? {color: "#ff5252 "} : null}
                                    >
                                        Correlativo
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        value={correlative}
                                        minlength="1"
                                        maxlength="4"
                                        onChange={this.handleChange(
                                            "correlative"
                                        )}
                                        placeholder="correlative"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label
                                        className="floating-label"
                                        // style={ambient === "" ? {color: "#ff5252 "} : null}
                                    >
                                        Observaciones
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={observation}
                                        onChange={this.handleChange(
                                            "observation"
                                        )}
                                        placeholder="observation"
                                        margin="normal"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button
                                    className="pull-right"
                                    disabled={loaderDocumentBook}
                                    variant="primary"
                                    onClick={() => this.updateDocumentBook()}
                                >
                                    Guardar Cambios
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={this.state.modalAcademicRecordEmission}
                    backdrop="static"
                >
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{color: "#ffffff"}}>
                            FECHA DE EMISIÓN DE RÉCORD ACADÉMICO
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{zIndex: 100000000}}>
                                        Cerrar
                                    </Tooltip>
                                }
                            >
                                <Close
                                    style={{color: "white"}}
                                    onClick={() =>
                                        this.closeAcademicRecordEmission()
                                    }
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">
                                        Fecha de emisión
                                        <small className="text-danger"> *</small>
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={this.state.academicRecordEmissionDate}
                                        onChange={this.handleChange(
                                            "academicRecordEmissionDate"
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">
                                        Motivo del cambio
                                        <small className="text-danger"> *</small>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows="3"
                                        value={
                                            this.state
                                                .academicRecordEmissionReason
                                        }
                                        onChange={this.handleChange(
                                            "academicRecordEmissionReason"
                                        )}
                                        placeholder="Indique el motivo de la fecha manual"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Button
                                    className="pull-right"
                                    disabled={this.state.loaderDocumentBook}
                                    variant="primary"
                                    onClick={() =>
                                        this.updateAcademicRecordEmission()
                                    }
                                >
                                    Guardar fecha
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.modalDocument} backdrop="static">
                    <Modal.Header className="bg-primary">
                        <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                            DOCUMENTO SUBIDO
                        </Modal.Title>
                        <div className="d-inline-block pull-right">
                            <OverlayTrigger
                                overlay={
                                    <Tooltip style={{ zIndex: 100000000 }}>
                                        Cerrar
                                    </Tooltip>
                                }
                            >
                                <Close
                                    style={{ color: "white" }}
                                    onClick={() => this.closeUploadDocument()}
                                />
                            </OverlayTrigger>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Form.Group className="form-group fill">
                                    <Form.Label className="floating-label">
                                        Archivo
                                        <small className="text-danger">
                                            {" "}
                                            *
                                        </small>
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            style={{ marginTop: "3px" }}
                                            type="text"
                                            autoComplete="off"
                                            value={fileName}
                                            disabled={fileName ? true : false}
                                            onChange={this.handleChange(
                                                "fileName"
                                            )}
                                            onClick={this.showFileManager}
                                            placeholder="Seleccione un archivo"
                                            margin="normal"
                                        />
                                        {fileName ? (
                                            <InputGroup.Append>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip
                                                            style={{
                                                                zIndex: 100000000,
                                                            }}
                                                        >
                                                            Limpiar
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        style={{
                                                            marginLeft: "-25px",
                                                            marginTop: "-2px",
                                                            position:
                                                                "relative",
                                                            zIndex: 100,
                                                            fontSize: "20px",
                                                            padding: "0",
                                                            border: "none",
                                                            background: "none",
                                                            outline: "none",
                                                        }}
                                                    >
                                                        <i
                                                            onClick={
                                                                this.clearFiles
                                                            }
                                                            className="text-danger feather icon-x-circle"
                                                        />
                                                    </button>
                                                </OverlayTrigger>
                                            </InputGroup.Append>
                                        ) : (
                                            <InputGroup.Append>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip
                                                            style={{
                                                                zIndex: 100000000,
                                                            }}
                                                        >
                                                            Archivo
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        style={{
                                                            marginLeft: "-25px",
                                                            marginTop: "-2px",
                                                            position:
                                                                "relative",
                                                            zIndex: 100,
                                                            fontSize: "16px",
                                                            padding: "0",
                                                            border: "none",
                                                            background: "none",
                                                            outline: "none",
                                                        }}
                                                    >
                                                        {/*<i onClick={this.showFileManager} className="text-warning feather icon-paperclip"/>*/}

                                                        <Attachment className="text-warning" />
                                                    </button>
                                                </OverlayTrigger>
                                            </InputGroup.Append>
                                        )}
                                    </InputGroup>
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        name="file"
                                        id="file"
                                        onChange={(event) =>
                                            this.handleChangeFileInput(event)
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button
                                    className="pull-right"
                                    disabled={loaderDocumentBook}
                                    variant="primary"
                                    onClick={() => this.uploadDocumentBook()}
                                >
                                    {loaderDocumentBook && (
                                        <span
                                            className="spinner-border spinner-border-sm mr-1"
                                            role="status"
                                        />
                                    )}
                                    Guardar
                                </Button>
                                {this.state.fileName &&
                                    this.state.stateUpload && (
                                        <Button
                                            className="pull-right"
                                            disabled={loaderDocumentBook}
                                            variant="warning"
                                            onClick={() =>
                                                window.open(
                                                    app.server +
                                                        "student-document/" +
                                                        this.state.fileName,
                                                    "_blank"
                                                )
                                            }
                                        >
                                            {loaderDocumentBook && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                />
                                            )}
                                            Descargar Documento
                                        </Button>
                                    )}
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                {/* MPT */}
                {this.state.dataCert && (
                    <StudyCertificate dataCert={this.state.dataCert} />
                )}
            </>
        );
    }
}

export default Index;
